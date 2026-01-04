// ==UserScript==
// @name         Recolor
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  恢复网页颜色
// @author       backrock12
// @include      https://*
// @include      http://*
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3dmgame.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456100/Recolor.user.js
// @updateURL https://update.greasyfork.org/scripts/456100/Recolor.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle( "html  { -webkit-filter: none; }");

    const html= document.querySelector('html')
    html.style  =' -webkit-filter: none;';
    // Your code here...
})();