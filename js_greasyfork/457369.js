// ==UserScript==
// @name         Tampermonkey automatically google login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically google login for tampermonkey
// @license      MIT
// @author       IgnaV
// @match        https://accounts.google.com/o/oauth2/v2/auth?*auth.tampermonkey.net*
// @icon         http://google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457369/Tampermonkey%20automatically%20google%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/457369/Tampermonkey%20automatically%20google%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excecuteWithCondition = (condition, callback, maxAttempts=40, delay=100) => {
        let attempts = 0;
        const intervalId = setInterval(() => {
            const result = condition();
            if (result) {
                clearInterval(intervalId);
                callback(result)
            } else if (attempts < maxAttempts) {
                attempts++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);
    }
    var noClick = document.createElement("p");
    noClick.style.cssText = 'position:fixed;padding:0;margin:0;top:0;left:0;width: 100%;height:100%;background:rgba(255,255,255,0.5);';

    const clickButton = btn => {btn.click(); document.body.appendChild(noClick);};

    const condition = () => document.querySelector('.JDAKTe.ibdqA.W7Aapd.zpCp3.SmR8 > .lCoei.YZVTmd.SmR8');
    excecuteWithCondition(condition, clickButton);
})();