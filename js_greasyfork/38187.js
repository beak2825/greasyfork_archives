// ==UserScript==
// @name               Hide tianya bbs google ad
// @name:zh-CN         隐藏天涯google广告
// @namespace          vince.tianya
// @version            1.0
// @description        hide google ad in tianya bbs
// @description:zh-CN  隐藏天涯显示的google广告
// @author             vince ding
// @match        *://*.tianya.cn/*
// @downloadURL https://update.greasyfork.org/scripts/38187/Hide%20tianya%20bbs%20google%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/38187/Hide%20tianya%20bbs%20google%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var css,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        css = `#ty_msg_mod,#replay-banner,.ads-loc-holder{display:none!important;}
               #doc{width:100%;}
               #bbs_float_menu{left:auto!important;right:0!important;}
               #bbsPost{left:25px;}`;

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
})();