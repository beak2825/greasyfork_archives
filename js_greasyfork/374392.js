// ==UserScript==
// @name         Set h1 innerText to page title
// @namespace    scripto
// @version      1.1
// @description  Set video title to page title
// @author       scriptomensch
// @include      http*://www.eroticage.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @downloadURL https://update.greasyfork.org/scripts/374392/Set%20h1%20innerText%20to%20page%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/374392/Set%20h1%20innerText%20to%20page%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.getElementsByTagName('title').item(0).innerHTML = document.getElementsByTagName('h1').item(0).innerText
})();