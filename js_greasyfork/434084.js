// ==UserScript==
// @name         t66y
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  t66y1
// @author       You
// @match        http://t66y.com/*
// @icon         https://www.google.com/s2/favicons?domain=t66y.com
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434084/t66y.user.js
// @updateURL https://update.greasyfork.org/scripts/434084/t66y.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
}

var loadCss = function () {
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
            .postauthor .profile, .postbottom {
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
            .avatar{
                              display:none;

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

    $('.tr3').each(function () {
        var num = parseInt($('td:nth-child(5)', this).text());
        if (num > 100) {
            $(this).css('background', '#FFEBEB')
        }
        if (num > 200) {
            $(this).css('background', '#FFCDCD')
        }
        if (num > 300) {
            $(this).css('background', '#FBAAAA')
        }
        $(this).attr('target', '_blank');
    });
});
})();