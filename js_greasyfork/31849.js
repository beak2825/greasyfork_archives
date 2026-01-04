
// ==UserScript==
// @name         melonmanager
// @namespace    melonmanager
// @version      0.11
// @description  memon manager plugin
// @author       yoshikiller
// @match        http://www.melon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31849/melonmanager.user.js
// @updateURL https://update.greasyfork.org/scripts/31849/melonmanager.meta.js
// ==/UserScript==

$(function() {      
    var addScript = document.createElement('script'); 
    addScript.src = 'http://www.maroo.me/melonmanager/melonm.js?time=' + new Date().getTime();
    addScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript); 
    
    var addCss = document.createElement('link'); 
    addCss.href = 'http://www.maroo.me/melonmanager/melonm.css?time=' + new Date().getTime();
    addCss.type = 'text/css';
    addCss.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(addCss); 
});