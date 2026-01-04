// ==UserScript==
// @name         除去黑白滤镜
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决黑白滤镜
// @author       Jacky
// @match        *://*/*
// @icon         
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455880/%E9%99%A4%E5%8E%BB%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455880/%E9%99%A4%E5%8E%BB%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let html=document.getElementsByTagName('html');
    html[0].style.WebkitFilter='none';

    let body=document.getElementsByTagName('body');
    body[0].classList.remove("big-event-gray");;
})();