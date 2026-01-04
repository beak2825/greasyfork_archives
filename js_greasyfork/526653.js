// ==UserScript==
// @name         Marfeel Monitoring CSS Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  CSS módosítás a Marfeel Monitoring oldalakon
// @author       attila.virag@centralmediacsoport.hu
// @match        https://hub.marfeel.com/monitoring/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marfeel.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526653/Marfeel%20Monitoring%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/526653/Marfeel%20Monitoring%20CSS%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS szabály hozzáadása
    GM_addStyle(`
        #content > div > div > article > a > div > img {
            aspect-ratio: 16 / 6;
            object-fit: cover;
        }
    `);
})();
