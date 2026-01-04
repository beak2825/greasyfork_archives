// ==UserScript==
// @name         Drink Water
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  notify drink water, for testing. Default 2 hours mention.
// @author       luvSeohyun
// @match        https://*/*
// @match        http://*/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404800/Drink%20Water.user.js
// @updateURL https://update.greasyfork.org/scripts/404800/Drink%20Water.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const drinkMention = 2 * 60 * 60 * 1000; // ms

    function crossTime(a, b) {
        if (a.getFullYear() !== b.getFullYear() || a.getMonth() !== b.getMonth() || a.getDate() !== b.getDate()) {
            GM_log(`another day ${a.getTime()}, ${b.getTime()}`);
            return -1;
        }
        GM_log(`cross time ${a.getTime() - b.getTime()}`);
        return a.getTime() - b.getTime();
    }

    function mention_set(str, now, timeout) {
        if (timeout) {
            GM_log('create new time');
            now = new Date();
        }
        if (!document.hidden) {
            alert(str);
            GM_setValue('drinkTime', now);
        }
        setTimeout(mention_set, drinkMention, 'drink water', now);
    }

    if (location.host.startsWith('www')) {
        let now = new Date();
        let saved = new Date(GM_getValue('drinkTime', new Date('2020-6-6')));
        const cross = crossTime(now, saved);
        if (cross === -1) {
            mention_set('new day', now, false);
        } else if(cross >= drinkMention) {
            mention_set('drink water', now, false);
        } else {
            setTimeout(mention_set, drinkMention - cross, 'drink water', now, true);
        }
    }
})();