// ==UserScript==
// @name         去除keylol的cp站链接utm
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  去除keylol帖子中cp站链接utm
// @author       who
// @match        https://keylol.com/t*
// @icon         https://icons.duckduckgo.com/ip2/keylol.com.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510422/%E5%8E%BB%E9%99%A4keylol%E7%9A%84cp%E7%AB%99%E9%93%BE%E6%8E%A5utm.user.js
// @updateURL https://update.greasyfork.org/scripts/510422/%E5%8E%BB%E9%99%A4keylol%E7%9A%84cp%E7%AB%99%E9%93%BE%E6%8E%A5utm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const UTMKEY = "utm_campaign=DD";

    let alist = document.querySelectorAll(".pcb a");
    for (let alink of alist){
        if (alink.href.endsWith(UTMKEY)){
            alink.href=alink.href.slice(0, alink.href.search('utm_')-1)
        }
    }
    // Your code here...
})();