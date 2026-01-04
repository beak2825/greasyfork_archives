// ==UserScript==
// @name         Rainbow Highlight
// @namespace    *://*/*
// @version      0.2
// @description  change the highlight color on web pages
// @author       crisxh
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=w3schools.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438392/Rainbow%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/438392/Rainbow%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let mainBox=document.querySelector("html");
    mainBox.addEventListener("mousedown",function(){
        let rainbow=["#e994b0","#fdd68e","#f5f573","#aee7ae","#bdbdf7","#9e78b9","#ca62ca"];

        let randomColor=rainbow[Math.floor(Math.random()*rainbow.length)];
         GM_addStyle("::selection{background-color:"+randomColor+";}");
    });

})();