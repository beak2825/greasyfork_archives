// ==UserScript==
// @name         bring back meandyou
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fricc stegi
// @author       ManuPwnn (code by MurmeltierS)
// @match        https://www.twitch.tv/stegi*
// @grant        none
// @run-at       document-start
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/481743/bring%20back%20meandyou.user.js
// @updateURL https://update.greasyfork.org/scripts/481743/bring%20back%20meandyou.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

(async function() {
    'use strict';
    const handledTextTokens = new WeakSet()

    const doo = async () => {
        const elms = Array.from(document.querySelectorAll('[class="text-token"]'))
        elms.forEach(
            (elm) => {
                if (handledTextTokens.has(elm)) return
                if (elm.innerText?.includes('meandyou')) {
                    elm.innerHTML = elm.innerHTML.replace(/meandyou/g, '<img src="https://cdn.7tv.app/emote/63b0aa4708b9976dac16f9e3/2x.webp" style="height: 2em;vertical-align: middle;">')
                }
                handledTextTokens.add(elm)
            }
        )
    }
    setInterval(doo, 1000)
})();