// ==UserScript==
// @name         csdn-博客园-网页美化
// @description  csdn和博客园进行网页美化的一个脚本
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  csdn和博客园进行网页美化的一个脚本
// @author       yaochao,lrabbit
// @match        https://blog.csdn.net/*
// @match        https://www.cnblogs.com/*
// @match        https://juejin.cn/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430539/csdn-%E5%8D%9A%E5%AE%A2%E5%9B%AD-%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430539/csdn-%E5%8D%9A%E5%AE%A2%E5%9B%AD-%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$ || $;
    var host = window.location.host;

    function o(e) {
        if (e = "string" == typeof e ? document.querySelector(e) : e,
        navigator.userAgent.match(/ipad|ipod|iphone/i)) {
            var t = e.contentEditable
              , n = e.readOnly;
            e.contentEditable = !0,
            e.readOnly = !0;
            var o = document.createRange();
            o.selectNodeContents(e);
            var i = window.getSelection();
            i.removeAllRanges(),
            i.addRange(o),
            e.setSelectionRange(0, 999999),
            e.contentEditable = t,
            e.readOnly = n
        } else
            e.select()
    }

    function copy(e){
    var t = e.target || e.srcElement
          , n = document.documentElement.scrollTop;

        if (t.className.indexOf("hljs-button") > -1) {
            e.preventDefault();
            var i = document.getElementById("hljs-copy-el");
            i || (i = document.createElement("textarea"),
            i.style.position = "absolute",
            i.style.left = "-9999px",
            i.style.top = n + "px",
            i.id = "hljs-copy-el",
            document.body.appendChild(i)),
            i.textContent = e.currentTarget.parentNode.innerText.replace(/[\u00A0]/gi, " ");
            o("#hljs-copy-el");
            try {
                var r = document.execCommand("copy");
                t.dataset.title = '复制成功';
                r && setTimeout(function() {
                    t.dataset.title = '复制';
                }, 1e3)
            } catch (a) {
                t.dataset.title = '';
            }

        }
    }

    switch(host) {
        case 'blog.csdn.net':
            $('.adblock,aside,.recommend-box,.pulllog-box,.tool-box,.meau-gotop-box,#csdn-toolbar,.comment-box,.p4course_target,.right-item,.recommend-right,#dmp_ad_58,.fourth_column,.csdn-side-toolbar,#toolBarBox,#blogColumnPayAdvert,.login-mark,.passportbox,.csdn-toolbar').remove();
            $('main').css('float', 'unset').css('margin', 'auto').css("background", '#ccc').css('padding', '10px');
            $('.main_father.clearfix.d-flex.justify-content-center').css('background', 'url(https://c-ssl.duitang.com/uploads/item/201205/27/20120527232351_Xr3Bx.jpeg)');
            $('.article_content').removeAttr("style");
			$('#btn-readmore').parent().remove();
            $('.hljs-button').removeClass('signin');
            $('code').unbind('click').removeAttr('onclick').click(function(event){ });
            $('.hljs-button').unbind('click').removeAttr('onclick').click(function(event){copy(event)});
            $('.hljs-button').attr("data-title",'复制')

            break;
        case 'www.cnblogs.com':
            $('#header,#footer,#sideBar,#comment_form').remove();
            $('#mainContent').css('background', '#ccc').css('padding', '10px');
            break;
        case 'juejin.cn':
            $('.main-header-box').remove();
            break;
    }
})();
