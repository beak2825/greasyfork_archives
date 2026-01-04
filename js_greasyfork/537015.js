// ==UserScript==
// @name         HumanOrNot.ai Humans Only
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Made by AJR - For humanornot.ai to match with only humans
// @author       AJR
// @match        https://app.humanornot.ai/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537015/HumanOrNotai%20Humans%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/537015/HumanOrNotai%20Humans%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        if (typeof input === 'string' && input.includes('https://api.humanornot.ai/human-or-not/chat/')) {
            try {
                if (init && init.body) {
                    const body = JSON.parse(init.body);
                    if (body.user_id) {
                        body.partner_type = 'human';
                        init.body = JSON.stringify(body);
                    }
                }
            } catch (e) {}
        }
        return originalFetch(input, init);
    };
})();
