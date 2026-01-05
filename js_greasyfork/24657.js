// ==UserScript==
// @name baidunet downloader
// @namespace    www.52pojie.cn
// @version      1.1
// @description 分享页面也可以下载哦，反正我就是不用度娘云管家！
// @include      *n.baidu.com/share/link*
// @include      *n.baidu.com/s/*
// @run-at       document-start
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        unsafeWindow
// @copyright    2012+, Jixun
// @downloadURL https://update.greasyfork.org/scripts/24657/baidunet%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/24657/baidunet%20downloader.meta.js
// ==/UserScript==


try { var w=unsafeWindow; } catch (e) { var w=window; }
w.navigator.__defineGetter__ ('platform', function () {return 'Cracked by Jixun ^^';});


(function() {
    'use strict';
    
    var $ = $ || window.$;
    
    var yunData,sign,timestamp,bdstoken,logid;
    var fileList=[],selectList=[],
        list_grid_status='list';
    var observer,currentPage,currentPath,currentCategory;
    var panAPIUrl = location.protocol + "//" + location.host + "/api/";
    var restAPIUrl1 = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
    //var restAPIUrl2 = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";
    
    $(function(){
        initParams();
        registerEventListener();
        createObserver();
        addButton();
        createIframe();
        addDialog();
        console.log('Baidu Yun Helper load successful!');
    });
    
    function initParams(){
        yunData = unsafeWindow.yunData;
        sign = getSign();
        timestamp = getTimestamp();
        bdstoken = getBDStoken();
        logid = getLogid();
        currentPage = getCurrentPage();
        
        if(currentPage == 'list')
            currentPath = getPath();
        
        if(currentPage == 'category')
            currentCategory = getCategory();
        
        refreshListGridStatus();
        refreshFileList();
        refreshSelectList();
    }
    
    function refreshFileList(){
        if (currentPage == 'list') {
            fileList = getFileList();
        } else if (currentPage == 'category'){
            fileList = getCategoryFileList();
        }
    }
    
    function refreshSelectList(){
        selectList = [];
    }
    
    function refreshListGridStatus(){
        list_grid_status = getListGridStatus();
    }
    
    function getListGridStatus(){
        var status = 'list';
        var $status_div = $('div.list-grid-switch');
        if ($status_div.hasClass('list-switched-on')){
            status = 'list';
        } else if ($status_div.hasClass('grid-switched-on')) {
            status = 'grid';
        }
        return status;
    }
    
    function registerEventListener(){
        registerHashChange();
        registerListGridStatus();
        registerCheckbox();
        registerAllCheckbox();
        registerFileSelect();
    }
    
    function registerHashChange(){
        window.addEventListener('hashchange',function(e){
            refreshListGridStatus();
            if(getCurrentPage() == 'list') {
                if(currentPage == getCurrentPage()){
                    if(currentPath == getPath()){
                        return;
                    } else {
                        currentPath = getPath();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else {
                    currentPage = getCurrentPage();
                    currentPath = getPath();
                    refreshFileList();
                    refreshSelectList();
                }
            } else if (getCurrentPage() == 'category') {
                if(currentPage == getCurrentPage()){
                    if(currentCategory == getCategory()){
                        return;
                    } else {
                        currentPage = getCurrentPage();
                        currentCategory = getCategory();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else {
                    currentPage = getCurrentPage();
                    currentCategory = getCategory();
                    refreshFileList();
                    refreshSelectList();
                }
            }
        });
    }
    
    function registerListGridStatus(){
        var $a_list = $('a[node-type=list-switch]');
        $a_list.click(function(){
            list_grid_status = 'list';
        });
        
        var $a_grid = $('a[node-type=grid-switch]');
        $a_grid.click(function(){
            list_grid_status = 'grid';
        });
    }
    
    function registerCheckbox(){
        var $checkbox = $('span.checkbox');
        $checkbox.each(function(index,element){
            $(element).bind('click',function(e){
                var $parent = $(this).parent();
                var filename;
                if(list_grid_status == 'list') {
                    filename = $('div.file-name div.text a',$parent).attr('title');
                }else if(list_grid_status == 'grid'){
                    filename = $('div.file-name a',$parent).attr('title');
                }
                if($parent.hasClass('item-active')){
                    console.log('unselect file:'+filename);
                    for(var i=0;i<selectList.length;i++){
                        if(selectList[i].filename == filename){
                            selectList.splice(i,1);
                        }
                    }
                }else{
                    console.log('select file:'+filename);
                    $.each(fileList,function(index,element){
                        if(element.server_filename == filename){
                            var obj = {
                                filename:element.server_filename,
                                path:element.path,
                                fs_id:element.fs_id,
                                isdir:element.isdir
                            };
                            selectList.push(obj);
                        }
                    });
                }
            });
        });
    }
    
    function unregisterCheckbox(){
        var $checkbox = $('span.checkbox');
        $checkbox.each(function(index,element){
            $(element).unbind('click');
        });
    }
    
    function registerAllCheckbox(){
        var $checkbox = $('div.col-item.check');
        $checkbox.each(function(index,element){
            $(element).bind('click',function(e){
                var $parent = $(this).parent();
                if($parent.hasClass('checked')){
                    console.log('unselect all');
                    selectList = [];
                } else {
                    console.log('select all');
                    selectList = [];
                    $.each(fileList,function(index,element){
                        var obj = {
                            filename:element.server_filename,
                            path:element.path,
                            fs_id:element.fs_id,
                            isdir:element.isdir
                        };
                        selectList.push(obj);
                    });
                }
            });
        });
    }
    
    function unregisterAllCheckbox(){
        var $checkbox = $('div.col-item.check');
        $checkbox.each(function(index,element){
            $(element).unbind('click');
        });
    }
    
    function registerFileSelect(){
        var $dd = $('div.list-view dd');
        $dd.each(function(index,element){
            $(element).bind('click',function(e){
                var nodeName = e.target.nodeName.toLowerCase();
                if(nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
                    selectList = [];
                    var filename = $('div.file-name div.text a',$(this)).attr('title');
                    console.log('select file:' + filename);
                    $.each(fileList,function(index,element){
                        if(element.server_filename == filename){
                            var obj = {
                                filename:element.server_filename,
                                path:element.path,
                                fs_id:element.fs_id,
                                isdir:element.isdir
                            };
                            selectList.push(obj);
                        }
                    });
                }
            });
        });
    }
    
    function unregisterFileSelect(){
        var $dd = $('div.list-view dd');
        $dd.each(function(index,element){
            $(element).unbind('click');
        });
    }
    
    function createObserver(){
        var MutationObserver = window.MutationObserver;
        var options = {
            'childList': true
        };
        observer = new MutationObserver(function(mutations){
            unregisterCheckbox();
            unregisterAllCheckbox();
            unregisterFileSelect();
            registerCheckbox();
            registerAllCheckbox();
            registerFileSelect();
        });
        var list_view = document.querySelector('.list-view');
        var grid_view = document.querySelector('.grid-view');
        
        observer.observe(list_view,options);
        observer.observe(grid_view,options);
    }
    
    //添加下载按钮
    function addButton(){
        var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
        var $dropdownbutton_a = $('<a class="g-button" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
        var $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-download" title="百度网盘下载助手"></em><span class="text" style="width: auto;">点击下载</span></span>');
        var $dropdownbutton_span = $('<span class="menu" style="width:auto"></span>');
        
        var $panAPIDownloadButton = $('<a data-menu-id="b-menu201" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
        var $restAPIDownloadButton1 = $('<a data-menu-id="b-menu202" class="g-button-menu" href="javascript:void(0);">API下载(百度云ID)</a>');
        var $restAPIDownloadButton2 = $('<a data-menu-id="b-menu203" class="g-button-menu" href="javascript:void(0);">API下载(ES ID)</a>');
        var $linkButton1 = $('<a data-menu-id="b-menu204" class="g-button-menu" href="javascript:void(0);">显示链接(直接下载)</a>');
        var $linkButton2 = $('<a data-menu-id="b-menu204" class="g-button-menu" href="javascript:void(0);">显示链接(百度云ID)</a>');
        var $linkButton3 = $('<a data-menu-id="b-menu204" class="g-button-menu" href="javascript:void(0);">显示链接(ES ID)</a>');
        
        $dropdownbutton_span.append($panAPIDownloadButton).append($restAPIDownloadButton1).append($restAPIDownloadButton2).append($linkButton1).append($linkButton2).append($linkButton3);
        $dropdownbutton_a.append($dropdownbutton_a_span);
        $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);
        
        $dropdownbutton.hover(function(){
            $dropdownbutton.toggleClass('button-open');
        });
        
        $panAPIDownloadButton.click(panAPIDownloadClick);
        $restAPIDownloadButton1.click(restAPIDownloadClick1);
        $restAPIDownloadButton2.click(restAPIDownloadClick2);
        $linkButton1.click(linkButtonClick1);
        $linkButton2.click(linkButtonClick2);
        $linkButton3.click(linkButtonClick3);
        
        $('div.default-dom div.bar div.list-tools').append($dropdownbutton);
    }
    
    function addDialog(){
        var screenWidth = document.body.clientWidth;
        var dialogLeft = screenWidth>568 ? (screenWidth-568)/2 : 0;
        var $dialog_div = $('<div class="dialog" id="baiduyunHelperDialog" style="width: 568px; top: 0px; bottom: auto; left: '+dialogLeft+'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>');
        var $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-header-title">下载链接</span></h3></div>');
        var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>');
        var $dialog_body = $('<div class="dialog-body"></div>');
        var $content = $('<div style="padding:0 20px"><a id="downloadlink" href="javascript:void(0)"></a></div>');
        var $tip = $('<div id="dialog_tip" style="padding-left:20px;background-color:#faf2d3;border-top: 1px solid #c4dbfe;"><p></p></div>');
        var $shadow = $('<div id="dialog_shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
        
        var mouseInitX,mouseInitY,dialogInitX,dialogInitY;
        $dialog_header.mousedown(function(event){
            mouseInitX = parseInt(event.pageX);
            mouseInitY = parseInt(event.pageY);
            dialogInitX = parseInt($dialog_div.css('left').replace('px',''));
            dialogInitY = parseInt($dialog_div.css('top').replace('px',''));
            $(this).mousemove(function(event){
                var tempX = dialogInitX + parseInt(event.pageX) - mouseInitX;
                var tempY = dialogInitY + parseInt(event.pageY) - mouseInitY;
                tempX = tempX<0 ? 0 : tempX>screenWidth-568 ? screenWidth-568 : tempX;
                tempY = tempY<0 ? 0 : tempY;
                $dialog_div.css('left',tempX+'px').css('top',tempY+'px');
            });
        });
        $dialog_header.mouseup(function(event){
            $(this).unbind('mousemove');
        });
        $dialog_control.click(dialogControl);
        $('body').append($dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body.append($content).append($tip)));
        $('body').append($shadow);
    }
    
    function panAPIDownloadClick(){
        console.log('PAN API download button clicked.');
        
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        }

        var fidlist,downloadType;
        var downloadLink;
        
        fidlist = getFidList(selectList);
        
        if (selectList.length == 1) {
            if (selectList[0].isdir === 1)
                downloadType = 'batch';
            else if (selectList[0].isdir === 0)
                downloadType= 'dlink';
        } else if(selectList.length > 1){
            downloadType = 'batch';
        }
        downloadLink = getDownloadLinkWithPanAPI(fidlist,downloadType);
        execDownload(downloadLink);
    }
    
    function restAPIDownloadClick1(){
        console.log("REST API download 1 button clicked.");
        
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        } else if (selectList.length > 1) {
            alert("该方法不支持多文件下载！");
            return;
        } else {
            if(selectList[0].isdir == 1){
                alert("该方法不支持目录下载！");
                return;
            }
        }
        
        var downloadLink = getDownloadLinkWithRESTAPI1(selectList[0].path);
        execDownload(downloadLink);
    }
    
    function restAPIDownloadClick2(){
        console.log("REST API download 1 button clicked.");
        
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        } else if (selectList.length > 1) {
            alert("该方法不支持多文件下载！");
            return;
        } else {
            if(selectList[0].isdir == 1){
                alert("该方法不支持目录下载！");
                return;
            }
        }
        
        var downloadLink = getDownloadLinkWithRESTAPI2(selectList[0].path);
        execDownload(downloadLink);
    }
    
    function linkButtonClick1(){
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        }

        var fidlist,downloadType;
        var downloadLink;

        fidlist = getFidList(selectList);

        if (selectList.length == 1) {
            if (selectList[0].isdir === 1)
                downloadType = 'batch';
            else if (selectList[0].isdir === 0)
                downloadType= 'dlink';
        } else if(selectList.length > 1){
            downloadType = 'batch';
        }
        downloadLink = getDownloadLinkWithPanAPI(fidlist,downloadType);
        
        $('#downloadlink').attr('href',downloadLink).text(downloadLink);
        var $shadow = $('#dialog_shadow');
        var $dialog = $('#baiduyunHelperDialog');
        var $tip = $('div#dialog_tip p');
        $tip.text('显示模拟百度网盘获取的链接，可以使用右键迅雷下载,复制无用，需要传递cookie');
        $shadow.show();
        $dialog.show();
    }
    
    function linkButtonClick2(){
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        } else if (selectList.length > 1) {
            alert("该方法不支持多文件下载！");
            return;
        } else {
            if(selectList[0].isdir == 1){
                alert("该方法不支持目录下载！");
                return;
            }
        }
        
        var downloadLink = getDownloadLinkWithRESTAPI1(selectList[0].path);
        $('#downloadlink').attr('href',downloadLink).text(downloadLink);
        var $shadow = $('#dialog_shadow');
        var $dialog = $('#baiduyunHelperDialog');
        var $tip = $('div#dialog_tip p');
        $tip.text('显示模拟APP获取的链接(使用百度云ID)，可以使用右键迅雷下载,复制无用，需要传递cookie');
        $shadow.show();
        $dialog.show();
    }
    
    function linkButtonClick3(){
        if(selectList.length === 0) {
            alert("获取选中文件失败，请刷新重试！");
            return;
        } else if (selectList.length > 1) {
            alert("该方法不支持多文件下载！");
            return;
        } else {
            if(selectList[0].isdir == 1){
                alert("该方法不支持目录下载！");
                return;
            }
        }
        
        var downloadLink = getDownloadLinkWithRESTAPI2(selectList[0].path);
        $('#downloadlink').attr('href',downloadLink).text(downloadLink);
        var $shadow = $('#dialog_shadow');
        var $dialog = $('#baiduyunHelperDialog');
        var $tip = $('div#dialog_tip p');
        $tip.text('显示模拟APP获取的链接(使用ES ID)，可以使用右键迅雷下载,复制无用，需要传递cookie');
        $shadow.show();
        $dialog.show();
    }
    
    function dialogControl(){
        $('#downloadlink').attr('href','javascript:void(0)').text('');
        $('div#dialog_tip p').text('');
        var $dialog = $('#baiduyunHelperDialog');
        var $shadow = $('#dialog_shadow');
        $dialog.hide();
        $shadow.hide();
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
    function getPath(){
        var hash = location.hash;
        var regx = /(^|&|\/)path=([^&]*)(&|$)/i;
        var result = hash.match(regx);
        return decodeURIComponent(result[2]);
    }
    
    function getCategory(){
        var hash = location.hash;
        var regx = /(^|&|\/)type=([^&]*)(&|$)/i;
        var result = hash.match(regx);
        return decodeURIComponent(result[2]);
    }
    
    function getCurrentPage(){
        var hash = location.hash;
        return decodeURIComponent(hash.substring(hash.indexOf('#')+1,hash.indexOf('/')));
    }

    //获取文件列表
    function getFileList(){
        var filelist = [];
        var listUrl = panAPIUrl + "list";
        var path = getPath();
        var params = {
            dir:path,
            bdstoken:bdstoken,
            logid:logid,
            order:'size',
            desc:0,
            clienttype:0,
            showempty:0,
            web:1,
            channel:'chunlei',
            appid:250528
        };
        $.ajax({
            url:listUrl,
            async:false,
            method:'GET',
            data:params,
            success:function(result){
                filelist = 0===result.errno ? result.list : [];
            }
        });
        return filelist;
    }
    
    function getCategoryFileList(){
        var filelist = [];
        var listUrl = panAPIUrl + "categorylist";
        var category = getCategory();
        var params = {
            category:category,
            bdstoken:bdstoken,
            logid:logid,
            order:'size',
            desc:0,
            clienttype:0,
            showempty:0,
            web:1,
            channel:'chunlei',
            appid:250528
        };
        $.ajax({
            url:listUrl,
            async:false,
            method:'GET',
            data:params,
            success:function(result){
                filelist = 0===result.errno ? result.info : [];
            }
        });
        return filelist;
    }

    function getFidList(list){
        var fidlist = null;
        if (list.length === 0)
            return null;
        var fileidlist = [];
        $.each(list,function(index,element){
            fileidlist.push(element.fs_id);
        });
        fidlist = '[' + fileidlist + ']';
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
            var n = document,c=decodeURI;
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

    function getDownloadLinkWithRESTAPI1(path){
        var link = restAPIUrl1 + 'file?method=download&app_id=250528&path=' + path;
        return link;
    }
    
    function getDownloadLinkWithRESTAPI2(path){
        var link = restAPIUrl1 + 'file?method=download&app_id=266719&path=' + path;
        return link;
    }
    
    function execDownload(link){
        console.log('selectList:');
        console.log(selectList);
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