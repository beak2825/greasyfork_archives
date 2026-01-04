// ==UserScript==
// @name         Star Wars Theme (beta)
// @description Star wars theme for shell
// @version      0.1
// @author       Penguinie
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/769700
// @downloadURL https://update.greasyfork.org/scripts/429087/Star%20Wars%20Theme%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429087/Star%20Wars%20Theme%20%28beta%29.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Star Wars Blaster';

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://star-wars-theme.plund1991.repl.co/style.css';
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


