// ==UserScript==
// @name         Accelerider Jump Tool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  将百度网盘分享链接跳转到坐骑以高速下载
// @author       Mrs4s
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/link*
// @match        *://yun.baidu.com/share/link*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29202/Accelerider%20Jump%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/29202/Accelerider%20Jump%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var yunData = unsafeWindow.yunData;
    console.log("ShareId: "+yunData.SHARE_ID+" ShareUk="+yunData.SHARE_UK+" PublicShare: "+isPublicShare());
    console.log(yunData);
    /*
    //自动跳转http,本地server不支持https
    if(location.protocol=="https:"){
        window.location.href="http://"+location.hostname+location.pathname;
        return;
    }
    */
    addButton();
    //判断是单个文件分享还是文件夹或者多文件分享
    function isSingleShare() {
        return yunData.getContext === undefined ? true : false;
    }
    function isPublicShare(){
        return yunData.SHARE_PUBLIC==1;
    }


    //source  https://greasyfork.org/zh-CN/scripts/23635-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B
    function addButton() {
        if (isSingleShare()) {
            $('div.slide-show-right').css('width', '500px');
            $('div.frame-main').css('width', '96%');
            $('div.share-file-viewer').css('width', '740px').css('margin-left', 'auto').css('margin-right', 'auto');
        }
        else
            $('div.slide-show-right').css('width', '500px');
        var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
        var $dropdownbutton_a = $('<a class="g-button" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
        var $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-download" title="发送到坐骑下载"></em><span class="text" style="width: auto;">发送到坐骑下载</span></span>');
        var $dropdownbutton_span = $('<span class="menu" style="width:auto;z-index:31"></span>');
        var $downloadButton = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:void(0);">点我发送</a>');
        //$dropdownbutton_span.append($downloadButton);
        $dropdownbutton_a.append($dropdownbutton_a_span);
        $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);
        $dropdownbutton.hover(function () {
            $dropdownbutton.toggleClass('button-open');
        });
        $dropdownbutton_a_span.click(downloadButtonClick);
        $downloadButton.click(downloadButtonClick);
        $('div.module-share-top-bar div.bar div.button-box').append($dropdownbutton);
    }
    function getLocalhost(){
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        return "http://127.0.0.1:10000/baiduShareDownload?shareid="+yunData.SHARE_ID+"&shareuk="+yunData.SHARE_UK+"&public="+yunData.SHARE_PUBLIC+"&ts="+timestamp;
    }
    function downloadButtonClick(){
        //https
        if(location.protocol=="https:"){
            var $image=$('<img src="'+getLocalhost()+'" alt=""/>');
            $(document.body).append($image);
            $image.remove();
            return;
        }
        $.ajax({
            url:getLocalhost(),
            method:"GET",
            async:false,
            dataType:"json",
            success:function(response){
                console.log("success");
            },
            error:function(response){
                console.log("fail");
                alert("发送失败，请确认你已经打开了坐骑？");
            }
        });
    }
})();