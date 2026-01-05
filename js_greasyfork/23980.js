// ==UserScript==
// @name         自用脚本-百度云直接下载
// @namespace    undefined
// @version      0.3
// @description  直接下载百度云的文件，可以避免下载大文件和exe文件时调用云管家
// @author       NoEggEgg
// @match        http://pan.baidu.com/disk/*
// @match        https://pan.baidu.com/disk/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23980/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC-%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/23980/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC-%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var yunData,sign,timestamp,bdstoken,logid;
    var panAPIUrl = location.protocol + "//pan.baidu.com/api/";
    var restAPIUrl1 = "https://pcs.baidu.com/rest/2.0/pcs/";
    var restAPIUrl2 = "https://d.pcs.baidu.com/rest/2.0/pcs/";
    
    initParams();
    addButton();
    addDialog();
    createIframe();
    console.log('Baidu Yun Helper load successful!');
    
    function initParams(){
        yunData = window.yunData;
        sign = getSign();
        timestamp = getTimestamp();
        bdstoken = getBDStoken();
        logid = getLogid();
    }
    
    //添加下载按钮
    function addButton(){
        var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
        var $dropdownbutton_a = $('<a class="g-button" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
        var $dropdownbutton_a_span = $('<span class="g-button-right"><span class="text" style="width: auto;">下载助手</span></span>');
        var $dropdownbutton_span = $('<span class="menu" style="width:auto"></span>');
        
        var $panAPIDownloadButton = $('<a data-menu-id="b-menu201" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
        var $restAPIDownloadButton1 = $('<a data-menu-id="b-menu202" class="g-button-menu" href="javascript:void(0);">再次下载</a>');
        var $restAPIDownloadButton2 = $('<a data-menu-id="b-menu203" class="g-button-menu" href="javascript:void(0);">三次下载</a>');
        var $xunleiButton = $('<a data-menu-id="b-menu203" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
        
        $dropdownbutton_span.append($panAPIDownloadButton).append($restAPIDownloadButton1).append($restAPIDownloadButton2).append($xunleiButton);
        $dropdownbutton_a.append($dropdownbutton_a_span);
        $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);
        
        $dropdownbutton.hover(function(){
            $dropdownbutton.toggleClass('button-open');
        });
        
        $panAPIDownloadButton.click(panAPIDownloadClick);
        $restAPIDownloadButton1.click(restAPIDownloadClick1);
        $restAPIDownloadButton2.click(restAPIDownloadClick2);
        $xunleiButton.click(xunleiButtonClick);
        
        $($('div.bar div').get(1)).append($dropdownbutton);
    }
    
    function addDialog(){
        var $dialog_div = $('<div class="dialog dialog-moduleDownloadDialog  dialog-gray" id="baiduyunHelperDialog" style="width: 568px; top: 7px; bottom: auto; left: 396px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>');
        var $dialog_header = $('<div class="dialog-header dialog-drag"><h3><span class="dialog-header-title">下载链接</span></h3></div>');
        var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>');
        var $dialog_body = $('<div class="dialog-body"></div>');
        var $content = $('<div style="padding:0 20px"><a id="downloadlink" href="javascript:void(0)"></a></div>');
        var $tip = $('<div id="dialog_tip"><p>使用第一种方法获取的链接，可以使用右键迅雷下载。复制无用，需要传递cookie</p></div>');
        
        $dialog_control.click(dialogControl);
        $('body').append($dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body.append($content).append($tip)));
    }
    
    function panAPIDownloadClick(){
        console.log('PAN API download button clicked.');
        
        if(!checkSelectItem(1))
            return;
        var dir = getDir();
        var filelist = getFileList(dir);
        if(filelist === null || filelist.errno !== 0){
            alert("获取文件列表失败！");
            return;
        }
        
        var filename = getFileName();
        if(filename.length === 0){
            alert("获取文件名失败！");
            return;
        }
        
        var fileid = getSelectFileId(dir,filename,filelist.list);
        if (fileid.length === 0){
            alert("获取文件ID失败！");
            return;
        }

        var fidlist = getFidList(fileid);
        
        if(fidlist === null){
            alert("获取文件ID失败！");
            return;
        }

        var downloadLink;
        console.log(fileid);
        if (fileid.length == 1) {
            var type;
            var filetype = getFileType();
            if (filetype == 'dir')
                type = 'batch';
            else if (filetype == 'file')
                type= 'dlink';
            downloadLink = getDownloadLinkWithPanAPI(fidlist,type);
        } else if(fileid.length > 1){
            downloadLink = getDownloadLinkWithPanAPI(fidlist,'batch');
        }
        execDownload(downloadLink);
    }
    
    function restAPIDownloadClick1(){
        console.log("REST API download 1 button clicked.");
        if(!checkSelectItem(2))
            return;
        var dir = getDir();
        var filename = getFileName();
        var downloadLink = getDownloadLinkWithRESTAPI1(dir,filename[0]);
        execDownload(downloadLink);
    }
    
    function restAPIDownloadClick2(){
        console.log("REST API download 1 button clicked.");
        if(!checkSelectItem(3))
            return;
        var dir = getDir();
        var filename = getFileName();
        var downloadLink = getDownloadLinkWithRESTAPI2(dir,filename[0]);
        execDownload(downloadLink);
    }
    
    function xunleiButtonClick(){
        if(!checkSelectItem(1))
            return;
        var dir = getDir();
        var filelist = getFileList(dir);
        if(filelist === null || filelist.errno !== 0){
            alert("获取文件列表失败！");
            return;
        }
        
        var filename = getFileName();
        if(filename.length === 0){
            alert("获取文件名失败！");
            return;
        }
        
        var fileid = getSelectFileId(dir,filename,filelist.list);
        if (fileid.length === 0){
            alert("获取文件ID失败！");
            return;
        }

        var fidlist = getFidList(fileid);
        
        if(fidlist === null){
            alert("获取文件ID失败！");
            return;
        }

        var downloadLink;
        if (fileid.length == 1) {
            var type;
            var filetype = getFileType();
            if (filetype == 'dir')
                type = 'batch';
            else if (filetype == 'file')
                type= 'dlink';
            downloadLink = getDownloadLinkWithPanAPI(fidlist,type);
        } else if(fileid.length > 1){
            downloadLink = getDownloadLinkWithPanAPI(fidlist,'batch');
        }
        
        $('#downloadlink').attr('href',downloadLink).text(downloadLink);
        var $dialog = $('#baiduyunHelperDialog');
        $dialog.show();
    }
    
    function dialogControl(){
        $('#downloadlink').attr('href','javascript:void(0)').text('');
        var $dialog = $('#baiduyunHelperDialog');
        $dialog.hide();
    }
    
    function checkSelectItem(n){
        var $dd = $('div.list-view dd.item-active');
        if ($dd.length === 0) {
            alert("没有选中文件！");
            return false;
        }
        if (n != 1) {
            if ($dd.length>1){
            alert("不要选中多个文件，只支持单个下载！");
            return false;
            }
            var $div = $($dd[0]).children('div');
            var type = $($div[0]).attr('class').split(" ");
            if(type[1] == "dir-small"){
                alert("不支持目录下载！");
                return false;
            }
        }
        return true;
    }

    function getSign(){
        var signFnc;
        try{
            signFnc = new Function("return " + yunData.sign2)();
        } catch(e){
            throw new Error(e.message);
        }
        return base64Encode(signFnc(yunData.sign5,yunData.sign1));
    }

    //获取当前目录
    function getDir(){
        var url = window.location.href;
        return decodeURIComponent(url.substring(url.lastIndexOf('=')+1));
    }
    
    function getFileName(){
        var filename = [];
        var $a = $('div.list-view dd.item-active div.file-name a.filename');
        $a.each(function(){
            filename.push($(this).text());
        });
        return filename;
    }
    
    function getFileType(){
        var $dd = $('div.list-view dd.item-active');
        var $div = $($dd[0]).children('div');
        var type = $($div[0]).attr('class').split(" ");
        if(type[1] == "dir-small"){
            return 'dir';
        } else {
            return 'file';
        }
    }

    //获取当前目录的文件列表
    function getFileList(dir){
        var filelist = null;
        var listUrl = panAPIUrl + "list";
        var params = {
            dir:dir,
            bdstoken:bdstoken,
            logid:logid,
            num:100,
            order:'size',
            desc:0,
            clienttype:0,
            showempty:'0',
            web:1,
            page:1,
            channel:'chunlei',
            appid:250528
        };
        $.ajax({
            url:listUrl,
            async:false,
            method:'GET',
            data:params,
            success:function(result){
                filelist = result;
            }
        });
        return filelist;
    }

    //获取选中文件的fileid
    function getSelectFileId(dir,filename,filelist){
        console.log(filelist);
        var fileid = [];
        
        if(filename.length === 0)
            return [];
        
        console.log("filename:"+filename);
        
        if (filelist.length > 0) {
            for(var i=0;i<filelist.length;i++){
                for (var j=0;j<filename.length;j++){
                    if (filelist[i].server_filename === filename[j]){
                        console.log(filelist[i].server_filename);
                        fileid.push(filelist[i].fs_id);
                    }
                }
            }
        } else {
            return [];
        }
        return fileid;
    }

    function getFidList(fileid){
        var fidlist = null;
        if (fileid.length === 0)
            return null;
        fidlist = '[' + fileid + ']';
        return fidlist;
    }

    function getTimestamp(){
        return yunData.timestamp;
    }

    function getBDStoken(){
        return yunData.MYBDSTOKEN;
    }

    function getLogid(){
        var name = "BAIDUID";
        function getCookie(e) {
            var o, t;
            var n = window.document,c=window.decodeURI;
            return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="),-1 != o) ? (o = o + e.length + 1,t = n.cookie.indexOf(";", o),-1 == t && (t = n.cookie.length),c(n.cookie.substring(o, t))) : "";
        }
        var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
        var d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var f = String.fromCharCode;
        function l(e){
            if (e.length < 2) {
                var n = e.charCodeAt(0);
                return 128 > n ? e : 2048 > n ? f(192 | n >>> 6) + f(128 | 63 & n) : f(224 | n >>> 12 & 15) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
            }
            var n = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
            return f(240 | n >>> 18 & 7) + f(128 | n >>> 12 & 63) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
        }
        function g(e){
            return (e + "" + Math.random()).replace(d, l);
        }
        function m(e){
            var n = [0, 2, 1][e.length % 3];
            var t = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
            var o = [u.charAt(t >>> 18), u.charAt(t >>> 12 & 63), n >= 2 ? "=" : u.charAt(t >>> 6 & 63), n >= 1 ? "=" : u.charAt(63 & t)];
            return o.join("");
        }
        function h(e){
            return e.replace(/[\s\S]{1,3}/g, m);
        }
        function p(){
            return h(g((new Date()).getTime()));
        }
        function w(e,n){
            return n ? p(String(e)).replace(/[+\/]/g, function(e) {
                return "+" == e ? "-" : "_";
            }).replace(/=/g, "") : p(String(e));
        }
        return w(getCookie(name));
    }

    //获取下载地址。这个地址不是直接下载地址，访问这个地址会返回302，response header中的location才是真实下载地址
    //暂时没有找到提取方法
    function getDownloadLinkWithPanAPI(fidlist,type){
        var downloadUrl = panAPIUrl + "download";
        var link = null;
        var params= {
            sign:sign,
            timestamp:timestamp,
            fidlist:fidlist,
            type:type,
            channel:'chunlei',
            web:1,
            app_id:250528,
            bdstoken:bdstoken,
            logid:logid,
            clienttype:0
        };
        $.ajax({
            url:downloadUrl,
            async:false,
            method:'GET',
            data:params,
            success:function(result){
                if (type == 'dlink')
                    link = result.dlink[0].dlink;
                else if (type == 'batch')
                    link = result.dlink;
            }
        });
        return link;
    }

    function getDownloadLinkWithRESTAPI1(){
        var path = getDir();
        var filename = getFileName();
        
        var link = restAPIUrl1 + 'file?method=download&app_id=250528&path=' + path + '/' + filename[0];
        return link;
    }
    
    function getDownloadLinkWithRESTAPI2(){
        var path = getDir();
        var filename = getFileName();
        
        var link = restAPIUrl2 + 'file?method=download&app_id=250528&path=' + path + '/' + filename[0];
        return link;
    }
    
    function execDownload(link){
        console.log("download link:"+link);
        $('#helperdownloadiframe').attr('src',link);
    }

    function createIframe(){
        var $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
        var $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
        $div.append($iframe);
        $('body').append($div);

    }

    function base64Encode(t){
        var a, r, e, n, i, s, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (e = t.length,r = 0,a = ""; e > r; ) {
            if (n = 255 & t.charCodeAt(r++),r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4);
                a += "==";
                break;
            }
            if (i = t.charCodeAt(r++),r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
                a += o.charAt((15 & i) << 2);
                a += "=";
                break;
            }
            s = t.charCodeAt(r++);
            a += o.charAt(n >> 2);
            a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
            a += o.charAt((15 & i) << 2 | (192 & s) >> 6);
            a += o.charAt(63 & s);
        }
        return a;
    }
})();