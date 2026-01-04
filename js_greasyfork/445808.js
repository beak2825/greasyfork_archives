// ==UserScript==
// @name         YouNow Auto Liker - Free 20
// @namespace    http://jasonml.com/
// @version      0.3.1
// @description  Not finished
// @author       JasonML (damnscout#8500 @ discord.gg/jasonml)
// @match        https://www.younow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=younow.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/445808/YouNow%20Auto%20Liker%20-%20Free%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/445808/YouNow%20Auto%20Liker%20-%20Free%2020.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let found = false;
    let searching = false;
    let lastUrl = document.location.pathname;
    function attachToLikes() {
        let initialSet = setInterval(() => {
            const els = document.querySelectorAll('button.button.button--stream-actions');
            Array.from(els).forEach( el => {
                if (el && el.textContent.includes('Likes')) {
                    found = true;
                    searching = false;
                    clearTimeout(initialSet);
                    function liker () {
                        const int = setInterval(() => {
                            if (el) {
                                el.click()
                            } else {
                                found = false;
                                clearInterval(int);
                            }
                        }, 2000);
                        setTimeout(() => clearInterval(int), 200000);
                    }
                    el.addEventListener('click', liker, {once: true});
                } else {
                    console.log("Not found: ", el.textContent)
                }
            });
        }, 1000);
    }

    setInterval(() => {
        if(document.location.pathname.length === 0 ) return;
        if ((!found && !searching) || lastUrl !== document.location.pathname) {
            lastUrl = document.location.pathname;
            searching = true;
            found = false;
            attachToLikes();
        }
    }, 1000);
})();