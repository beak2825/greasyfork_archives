// ==UserScript==
// @name         DM5
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  节省体力
// @author       shiki
// @match         *://*.dm5.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393482/DM5.user.js
// @updateURL https://update.greasyfork.org/scripts/393482/DM5.meta.js
// ==/UserScript==

document.addEventListener('keydown',(e)=>{
    if(e.keyCode===39 && ShowNext){
        ShowNext()
    }
    if(e.keyCode===37 && ShowPre){
        ShowPre()
    }
})