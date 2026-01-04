// ==UserScript==
// @name         Blank Template For ShellShockers Theme Designers - Beginner
// @description  Intructions contained (Video tutorial coming soon)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Penguinie
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429395/Blank%20Template%20For%20ShellShockers%20Theme%20Designers%20-%20Beginner.user.js
// @updateURL https://update.greasyfork.org/scripts/429395/Blank%20Template%20For%20ShellShockers%20Theme%20Designers%20-%20Beginner.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Theme Template';

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://theme-template.plund1991.repl.co/style.css';
        document.head.appendChild(style);
    }
    if(document.body){
        addScript();
    }else{
        document.addEventListener('DOMContentLoaded', function(e){
            addScript();
        })
    }
})();