// ==UserScript==
// @name         maj Hydro
// @namespace    http://tampermonkey.net/
// @version      2025-01-22
// @license      MIT
// @description  1
// @author       You
// @match        *://hydro.ac/*
// @match        *://oi.bashu.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524479/maj%20Hydro.user.js
// @updateURL https://update.greasyfork.org/scripts/524479/maj%20Hydro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let style=document.createElement('style');
    style.textContent = `.section{border-radius:8px!important;opacity:0.8!important;transition: transform 0.3s ease!important;} .section:hover{opacity:1!important;transform: translateY(-11.114px)!important;}`;
	document.head.append(style);
})();