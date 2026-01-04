// ==UserScript==
// @name         范文网绕过收费下载文档免费下载文档
// @namespace    第一范文网 1.1
// @version      1.6
// @description  绕过收费，支持网站：www.diyifanwen.com、www.77cn.com.cn、www.fanwenwang.com、www.cnfla.com、fanwen.chazidian.com、www.liuxue86.com
// @author       LZJ
// @match        *www.77cn.com.cn/*
// @match        *fanwen.chazidian.com/*
// @match        *www.fanwenwang.com/*
// @match        *www.cnfla.com/*
// @match        *www.liuxue86.com/*
// @match        *s.diyifanwen.com/down/down.asp?url=*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/446754/%E8%8C%83%E6%96%87%E7%BD%91%E7%BB%95%E8%BF%87%E6%94%B6%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/446754/%E8%8C%83%E6%96%87%E7%BD%91%E7%BB%95%E8%BF%87%E6%94%B6%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {

    if (window.location.host == 'www.77cn.com.cn') {
        let pattern = /(\d+)/ig; //定义正则表达式
        let url = window.location.pathname
        document.getElementsByClassName("word-pic")[0].children[0].href =
            'https://www.77cn.com.cn/plus/word.php?id=' + url.match(pattern)[0]
        document.getElementsByClassName("word-pic")[1].children[0].href =
            'https://www.77cn.com.cn/plus/word.php?id=' + url.match(pattern)[0]
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

    if (window.location.host == 'fanwen.chazidian.com') {
        document.getElementsByClassName("downBtn")[1].innerHTML = "破解成功，点击直接下载"
        console.log("123")
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
})();

