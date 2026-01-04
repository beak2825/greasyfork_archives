// ==UserScript==
// @name         afreecamanager+plus
// @namespace    afreecamanager+plus
// @version      0.94
// @description  afreeca manager plugin for web player
// @author       darkyop, yoshikiller
// @match        http://play.afreecatv.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31165/afreecamanager%2Bplus.user.js
// @updateURL https://update.greasyfork.org/scripts/31165/afreecamanager%2Bplus.meta.js
// ==/UserScript==

$(function() {      
    var addScript = document.createElement('script'); 
    addScript.src = 'http://www.maroo.me/afmanager/afm.js?time=' + new Date().getTime();
    addScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript); 
    
    var addCss = document.createElement('link'); 
    addCss.href = 'http://www.maroo.me/afmanager/afm.css?time=' + new Date().getTime();
    addCss.type = 'text/css';
    addCss.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(addCss); 
});