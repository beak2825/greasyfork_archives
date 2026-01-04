// ==UserScript==
// @name         codecombat代码变大
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  codecombat代码变大!
// @author       You
// @match        https://codecombat.cn/play/level/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459292/codecombat%E4%BB%A3%E7%A0%81%E5%8F%98%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/459292/codecombat%E4%BB%A3%E7%A0%81%E5%8F%98%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elm = document.getElementsByClassName("ace_content")[0];
    var newStyle = elm.getAttribute("style") + "font-size:20px;";
    elm.setAttribute("style", newStyle);
})();