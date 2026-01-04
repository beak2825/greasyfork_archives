// ==UserScript==
// @name         MCBBS 反咏e脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  MCBBS反制一道阳光咏e的脚本。该脚本仅用于折叠内容以方便浏览，该加载的东西还是要加载的！这是一个临时应急脚本，所以不做展开折叠的功能。
// @author       我是绵羊Yang_g
// @include     http*://*.mcbbs.net*
// @match       http://*.mcbbs.net/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402615/MCBBS%20%E5%8F%8D%E5%92%8Fe%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/402615/MCBBS%20%E5%8F%8D%E5%92%8Fe%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cssStr = ".t_fsz{max-height: 300px; overflow: hidden;}";
    cssStr += ".quote{max-height: 300px; overflow: hidden;}";
    cssStr += "";
    cssStr += "";

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = cssStr;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);



})();