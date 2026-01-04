// ==UserScript==
// @name         Asspig notifier
// @namespace    http://blog.regularoddity.com/
// @version      1.1
// @description  Nofifies new messages on the Asspig website through scraping.
// @author       E E
// @match        https://www.asspig.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asspig.com
// @grant        GM_notification
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/441695/Asspig%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/441695/Asspig%20notifier.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';
    let messages = 0;
    const Query = '#link_messenger span';

    setInterval(function() {
        let element = document.querySelector(Query);
        if (!element) {
            return;
        }
        element = element.textContent;
        let count = element.length === 0 ? 0 : parseInt(element);
        if (count > messages) {
            GM_notification(count === 1 ? 'There is a message on Asspig.'
                : `There are ${count} messages on Asspig.`);
        }
        messages = count;
    }, 2000);
})();