// ==UserScript==
// @name         afreecamanager
// @namespace    afreecamanager
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://play.afreeca.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18750/afreecamanager.user.js
// @updateURL https://update.greasyfork.org/scripts/18750/afreecamanager.meta.js
// ==/UserScript==

$(function() {      
    var addScript = document.createElement('script'); 
    addScript.src = 'http://darkyop.dothome.co.kr/manager/js.php?time=' + new Date().getTime();
    addScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript); 
    
    var addCss = document.createElement('link'); 
    addCss.href = 'http://darkyop.dothome.co.kr/manager/css.php?time=' + new Date().getTime();
    addCss.type = 'text/css';
    addCss.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(addCss); 
});