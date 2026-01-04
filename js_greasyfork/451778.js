// ==UserScript==
// @name spider4Douyin
// @version 0.1.0
// @author hyddg
// @description 用于提取当前视频的地址
// @homepage https://greasyfork.org/zh-CN/scripts/961591
// @match *://www.douyin.com/discover*,
// @match *://www.douyin.com/user/*
// @name:en rapidupload-userscript
// @namespace moe.cangku.111
// @homepageURL https://greasyfork.org/zh-CN/scripts/961591
// @contributionURL https://afdian.net/@mengzonefire
// @description:en input bdlink to get files or get bdlink for Baidu™ WebDisk.
// @compatible firefox Violentmonkey
// @compatible firefox Tampermonkey
// @compatible chrome Violentmonkey
// @compatible chrome Tampermonkey
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setClipboard
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/451778/spider4Douyin.user.js
// @updateURL https://update.greasyfork.org/scripts/451778/spider4Douyin.meta.js
// ==/UserScript==
(function(){
    window.addEventListener('load',function(){
        var videoUrls="";
        const actionButtons=$("<span class='acionBars'></span>");
        var copyUrlButton=$('<span>点我复制视频地址</span>');
        copyUrlButton.click(function(){
            const url=$("video>source").attr("src");
            if(!url){
                alert("当前页面不存在视频");
                return;
            }
            videoUrls=videoUrls+"https:"+$("video>source").attr("src")+"\n";
            console.log("videoUrls:",videoUrls)
        });
        const clearButton=$('<span>点我清除已复制视频地址</span>');
        clearButton.click(function (){
            videoUrls="";
        });
        var downloadUrlButton=$("<span>点我下载已复制的视频地址</span>");
        downloadUrlButton.click(function(){
            var textFileAsBlob = new Blob([videoUrls], {type:'text/plain'});
            var downloadLink = document.createElement("a");
            downloadLink.download = 'test.txt';
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.click();
        });

        //给创建的按钮添加css
        $("#root").append(actionButtons);
        $(actionButtons).append(copyUrlButton).append(clearButton).append(downloadUrlButton);
        actionButtons.css({'position':"fixed","top":"100px","left":"40px","color":"red",'border':'1px solid yellow',"z-index":999,'padding':'4px 0'});
        $('.acionBars>span').css({'border':'1px solid red','border-radius':'10px','margin-right':'10px'});
        $('.acionBars>span:last-child').css({'margin-right':'0'});
    });
})()