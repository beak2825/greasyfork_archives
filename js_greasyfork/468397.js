// ==UserScript==
// @name         Dropout Caption Enabler
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Try and automatically enable english captions after page loads
// @author       l4sgc
// @match        https://embed.vhx.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dropout.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468397/Dropout%20Caption%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/468397/Dropout%20Caption%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    function cc() {
        try {
            let query = Array.from(document.querySelectorAll('span')).filter(e => e.textContent.toLowerCase().includes('english'));
            //console.log('cc', query);
            if (query.length === 1) query[0].dispatchEvent(clickEvent);
            else setTimeout(cc, 500);
        } catch (x) {
            console.log(x);
        }
    }

    setTimeout(cc, 500);
})();