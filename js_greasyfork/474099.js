// ==UserScript==
// @name       YouTube: Move "New To You" to front
// @namespace  https://mathemaniac.org/
// @version    1.1.0
// @description  Moves the "New To You" button to the front of the list, right after "All".
// @match        https://www.youtube.com/
// @copyright  2023, Sebastian Paaske Tørholm
// @license    MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/474099/YouTube%3A%20Move%20%22New%20To%20You%22%20to%20front.user.js
// @updateURL https://update.greasyfork.org/scripts/474099/YouTube%3A%20Move%20%22New%20To%20You%22%20to%20front.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Changelog:
// 1.1.0: Re-do the sorting when returning to front page from a video as well.


var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var config = { childList: true, characterData: false, attributes: false, subtree: true };
var observer = new MutationObserver( function (mutations) {
    mutations.forEach( function (mutation) {
        if (mutation.type == 'childList') {
            let chips = document.querySelector('#chips');
            if (chips && ! chips.querySelector('yt-chip-cloud-chip-renderer:has([title="All"]) + yt-chip-cloud-chip-renderer:has([title="New to you"])')) {
                moveButton();
            }
        }
    });
});

observer.observe(document.querySelector('body'), config);

var interval;

function moveButton () {
    let chips = document.querySelector('#chips');
    if (! chips) return;

    let all = chips.querySelector('yt-chip-cloud-chip-renderer:has([title="All"])');
    let newToYou = chips.querySelector('yt-chip-cloud-chip-renderer:has([title="New to you"])');

    if (!all || !newToYou) return;

    newToYou.remove();
    all.insertAdjacentElement('afterend', newToYou);
    clearInterval(interval);
}

interval = setInterval(moveButton, 100);
