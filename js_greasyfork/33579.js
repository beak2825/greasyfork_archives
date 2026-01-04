// ==UserScript==
// @name        hi-pda.com 论坛热度高亮
// @description:zh-cn  hi-pda.com 论坛热度高亮
// @namespace   www.joyk.com/dig
// @include     https://www.4d4y.com/*
// @version     1.3
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @grant       none
// @description hipda论坛热度高亮
// @downloadURL https://update.greasyfork.org/scripts/33579/hi-pdacom%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/33579/hi-pdacom%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==
var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
}
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
           #postlist{border: 1px solid #ccc;}
            #nav, #nav a {
               color: #000000;
            }

            body{
               background:#fff;
            }
            .avatar,.postauthor .profile, .postbottom {
               display:none;
            }
            .t_msgfontfix {
               min-height:0px !important;
            }
            body{
               margin: 0 auto;
                width: 960px;
            }
            .wrap, #nav{
               width:100%;
            }
            a:visited{
                  color:#aaa;
            }
            div#header div.wrap h2{
                  display:none;
            }
            .main{border:1px #ccc solid;}
          */
    });
    var head = document.querySelector('head')
    head.appendChild(style);
};
loadCss();
$(function () {
    
    $('.threadlist tr').each(function () {
        var num = parseInt($('.nums strong', this).text());
        if (num > 20) {
            $(this).css('background', '#FFEBEB')
        }
        if (num > 50) {
            $(this).css('background', '#FFCDCD')
        }
        if (num > 100) {
            $(this).css('background', '#FBAAAA')
        }
        $(this).attr('target', '_blank');
    });
});
