// ==UserScript==
// @name         Omegle Cleaner
// @namespace    https://greasyfork.org/users/592063
// @version      0.1
// @description  Omegle Cleaner.
// @author       wuniversales
// @match        https://www.omegle.com/*
// @icon         https://icons.duckduckgo.com/ip2/omegle.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439940/Omegle%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/439940/Omegle%20Cleaner.meta.js
// ==/UserScript==

let deleteads=true;

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        let head, style;
        let escape_HTML_Policy = window.trustedTypes.createPolicy("Peach_Policy", {createHTML: (to_escape) => to_escape});
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = escape_HTML_Policy.createHTML(css.replace(/;/g, ' !important;'));
        head.appendChild(style);
    }
    addGlobalStyle("div#abovevideosexybtn,div.lowersexybtnwrapper,div.lowergaybtnwrapper, div > img[alt=Sexy], div > img[alt=Gay]{display:none;}");
    window.onload = function() {
        setInterval(function(){
            if(document.body.querySelectorAll('div.logitem > div > div > div > span').length>0){
                try{document.body.querySelector('div.logitem > div > div > div > span').click();}catch(e){}
            }
        },1000);
    }
})();