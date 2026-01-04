// ==UserScript==
// @name         范文助手
// @namespace    范文助手
// @version      1.0
// @description  绕过收费，支持网站：www.diyifanwen.com、www.77cn.com.cn、www.fanwenwang.com、www.cnfla.com、fanwen.chazidian.com、www.liuxue86.com、www.xuefen.com.cn
// @author       不想说话的树
// @match        *www.xiegw.cn/*
// @match        *www.xuefen.com.cn/*
// @match        *www.yuwenmi.com/*
// @match        *www.ndcksc.com/*
// @match        *fanwen.chazidian.com/*
// @match        *www.fanwenwang.com/*
// @match        *www.cnfla.com/*
// @match        *www.liuxue86.com/*
// @match        *s.diyifanwen.com/down/down.asp?url=*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/476163/%E8%8C%83%E6%96%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/476163/%E8%8C%83%E6%96%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    if (window.location.host == 'www.ndcksc.com') {
        //(req_domain + '/index/index/d_docs?url=' + arcurl + "&art_md5=" + art_md5)
        let url = window.location.href;
        console.log('url is '+url);
         if(url.indexOf('wkdoc/?url')>0)
           {
           location.href =(req_domain + '/index/index/d_docs?url=' + arcurl + "&art_md5=" + art_md5);
        }




        //document.getElementsByClassName("downlod_btn_right")[0].setAttribute('onclick', 'exportHTML()');
    }

    if (window.location.host == 's.diyifanwen.com') {
        $.cookie(cookiename, cookievalue, {
            expires: expires,
            path: '/',
            domain: 'diyifanwen.com'
        });
        $('.webchat-dyfw').hide();
        if (document.body.id == 'downdoc') {
            $.removeCookie('downfile', {
                path: '/',
                domain: 'diyifanwen.com'
            });
        } else if ($.cookie('down-guoxue-file') != undefined) {
            document.location = $.cookie('down-guoxue-file');
            $.removeCookie('down-guoxue-file', {
                path: '/',
                domain: 'diyifanwen.com'
            });
        } else {
            alert('验证成功，请进行复制');
        }
    }

    if (window.location.host == 'www.fanwenwang.com' || window.location.host == 'www.cnfla.com') {
        let url = window.location.pathname
        if(url=="/dldoc/index.html"){
            document.getElementsByClassName("download_card_btn")[0].setAttribute('onclick', 'exportHTML()');
        }
    }

    if (window.location.host == 'fanwen.chazidian.com' || window.location.host == 'www.xuefen.com.cn') {
        document.getElementsByClassName("downBtn")[1].innerHTML = "破解成功，点击直接下载"        
        exportHTML = function(){
            // 文章下载
            if(window.location.host == 'mini.yyrtv.com'){
                var artNode = $(".article");
                var fileName = $('.article h1').text().replace(/\s+/g, "");
            }else{
                var artNode = $("#app .articleGroup");
                var fileName = $('#app .articleGroup .tit').text().replace(/\s+/g, "");
            }
            var newNode = artNode.clone(true);
            $(newNode).wordExport(fileName);
            if($('.popdiv').length == 0){
                // window.popup();
            }else{
                $('.popdiv').css('display','flex');
            }
        }
        document.getElementsByClassName("downBtn")[1].setAttribute('onclick', 'exportHTML()');
        document.getElementsByClassName("downBtn")[0].setAttribute('onclick', 'exportHTML()');
    }

    if (window.location.host == 'www.liuxue86.com') {
        exportHTML = function(){
            var url = window.location.href.replace("www", "m");
            location.href = "//extra.liuxue86.com/doc.php?title=" + $("h1 a").html() + "&referrer=" + encodeURI(url.split("?")[0])}
        document.getElementsByClassName("nav_down_ll")[0].setAttribute('onclick', 'exportHTML()');
    }

    if (window.location.host == 'www.xiegw.cn') {
      console.log(window.location);
        if(location.href.indexOf('html?url=')>0){
        window.words();
        }
    }

    if (window.location.host == 'www.yuwenmi.com') {
      console.log(window.location);
        if(location.href.indexOf('dldoc/index')>0){
        window.exportHTML();
        }
    }




})();

