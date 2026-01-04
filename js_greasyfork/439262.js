// ==UserScript==
// @name         Peardeck Skipper
// @namespace    http://jadenjsj.ddns.net:6100/scripts/peardeckskip.user.js
// @version      0.1
// @description  Auto Skip the How are you feeling today? That wastes your time
// @author       JadenJSJ
// @match        https://app.peardeck.com/*
// @icon         https://app.peardeck.com/favicon.ico
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439262/Peardeck%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/439262/Peardeck%20Skipper.meta.js
// ==/UserScript==

(function() {
     setInterval(function(){
        let links = document.getElementsByTagName('a');
         for(let a of links)
         {
             if( a.text === 'Or Skip'){
                 a.click();
                 console.log('[PD Skipper] Skipped');
             }
         }
    }, 1E3);
})();