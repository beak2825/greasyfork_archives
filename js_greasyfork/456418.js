// ==UserScript==
// @name         BBRT notifier
// @namespace    http://blog.regularoddity.com/
// @version      0.3
// @description  Nofifies new messages on the BBRT website through scraping.
// @author       E E
// @match        https://www.barebackrt.com/members/default.php
// @icon         https://www.barebackrt.com/favicon.ico
// @grant        GM_notification
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/456418/BBRT%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/456418/BBRT%20notifier.meta.js
// ==/UserScript==

/* esversion: 6 */

(function() {
    'use strict';
    let messages = 0;
    const Query = 'emailLogo';


    let getNode = function() {
        let doc = top.window.frames[1].document.children[0];
        let xpath = document.evaluate('//span[@id="emailLogo"]', doc);
        return xpath.iterateNext();
    };

    setInterval(function() {
        let node = getNode();
        let count;
        if (!node) {
            count = 0;
        } else {
            let text = node.textContent;
            text = text.substring(1);
            count = parseInt(text);
        }
        if (count > messages) {
            GM_notification(
                count === 1 ? 'There is a message on BBRT.'
                    : `There are ${count} messages on BBRT.`);
        }
        messages = count;
    }, 2000);
})();