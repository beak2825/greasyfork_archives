// ==UserScript==
// @name         Discord Theme For ShellShock
// @description  ShellShockers But Discord
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Penguinie
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430520/Discord%20Theme%20For%20ShellShock.user.js
// @updateURL https://update.greasyfork.org/scripts/430520/Discord%20Theme%20For%20ShellShock.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Discord.gg';

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://discord.penguinie.repl.co/style.css';
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
