// ==UserScript==
// @name         fake hyperion detect roblox | PRANK SCRIPT
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @author       TOOM_TYM
// @description  crash roblox script
// @match        *://*.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @downloadURL https://update.greasyfork.org/scripts/498298/fake%20hyperion%20detect%20roblox%20%7C%20PRANK%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/498298/fake%20hyperion%20detect%20roblox%20%7C%20PRANK%20SCRIPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    this script not hacking you or etc dont worry its a funny script (REMOVE IT IF U SEND SCRIPT TO YOUR FRIENDS and use js obufscator he-he)
    credit: TOOM_TYM
    */
    const basedtext = document.title
    if (location.href.includes("/games")) {
        document.getElementById('game-details-play-button-container').addEventListener('click', (event) => {
            const checker = setInterval(() => {
                if (document.getElementById('confirm-btn')) {
                    document.title = "x64dbg"
                    setTimeout(() => {
                      document.title = basedtext
                    }, "10300");
                    clearInterval(checker)
                }
            }, 100)
         });
    }    
    console.log("injected!")
})();