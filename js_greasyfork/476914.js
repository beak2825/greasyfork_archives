// ==UserScript==
// @name         Fuck Ads, Perchance
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Bypass loading ads from ad-powered text-to-image plugins on perchance.org.
// @author       Teraskull
// @match        https://perchance.org/*
// @icon         https://static.wikia.nocookie.net/perchance/images/e/e6/Site-logo.png
// @license      GPLv3
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476914/Fuck%20Ads%2C%20Perchance.user.js
// @updateURL https://update.greasyfork.org/scripts/476914/Fuck%20Ads%2C%20Perchance.meta.js
// ==/UserScript==


// Information about how the ads load:
// https://www.reddit.com/r/uBlockOrigin/comments/153ubcw/blocking_a_single_specific_script_out_of_several/


(function() {
    'use strict';

    window.addEventListener('message', (e) => {
        if (e.data.type === 'usingAdPoweredPlugin') {
            e.data.type = 'fuckYourAdPoweredPlugin';
        }
        console.debug(e.data.type);
    });

})();
