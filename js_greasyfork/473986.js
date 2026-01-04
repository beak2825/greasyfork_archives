// ==UserScript==
// @name         t66y links clicked highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   t66y links clicked highlight!
// @author       You
// @match        https://www.t66y.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473986/t66y%20links%20clicked%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/473986/t66y%20links%20clicked%20highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("h3 a:visited {color: #C3BFBF!important;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();