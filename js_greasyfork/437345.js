// ==UserScript==
// @name         Hide youtube #shorts
// @namespace    https://gist.github.com/danieloliveira117/8d129abcc5d744890c9bd55f1c122472
// @version      1.5
// @description  Remove youtube shorts from subscriptions (Only in grid view)
// @author       danieloliveira117
// @match        https://*.youtube.com/feed/subscriptions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437345/Hide%20youtube%20shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/437345/Hide%20youtube%20shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeShorts() {
        document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]').forEach(t => {
            if (t) {
                const elem = t.closest('ytd-rich-section-renderer');

                if (elem) {
                    elem.remove();
                    console.log('Removed shorts section');
                }
            }
        });
    }

    const observer = new MutationObserver(removeShorts);
    observer.observe(document.querySelector('#page-manager'), { childList: true, subtree: true });
})();