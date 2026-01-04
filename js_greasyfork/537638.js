// ==UserScript==
// @name             Hide Members-Only Videos on Youtube
// @namespace        https://greasyfork.org/en/users/4612-gdorn
// @version          1.4
// @description      Hides videos marked "Members-Only" from main landing page.
// @author           GDorn
// @match            https://www.youtube.com/*
// @grant            none
// @license          GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/537638/Hide%20Members-Only%20Videos%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/537638/Hide%20Members-Only%20Videos%20on%20Youtube.meta.js
// ==/UserScript==

const ITEM_SELECTOR = 'ytd-rich-item-renderer';

(function() {
    'use strict';

    function hideMembersOnlyElements() {
        document.querySelectorAll(ITEM_SELECTOR).forEach(maybeHide);
    }

    function maybeHide(item) {
        if (item.style.display == 'none') return;
        if (item.textContent.includes('Members only') || item.textContent.includes('Members first')) {
            console.log("Hiding item:", item);
            item.style.display = 'none';
        } else {
            //console.log("Not hiding item:", item);
        }
    }

    function runWhenReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            hideMembersOnlyElements();
        } else {
            setTimeout(runWhenReady, 500);
        }
    }

    runWhenReady();

    const observer = new MutationObserver(mutations => {
        for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (node.matches(ITEM_SELECTOR)){
                    maybeHide(node);
                }
                else {
                    node.querySelectorAll && node.querySelectorAll(ITEM_SELECTOR).forEach(maybeHide);
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', hideMembersOnlyElements);

    var oldHref = document.location.href;
    var observer2 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                runWhenReady();
                hideMembersOnlyElements();
                setTimeout(hideMembersOnlyElements, 5000); // one last one, just in case things load very slowly

            }
        });
    });


    let attemptCount = 0;
    const maxAttempts = 10;
    const intervalCheck = setInterval(() => {
        if (attemptCount >= maxAttempts) {
            clearInterval(intervalCheck);
            return;
        }
        hideMembersOnlyElements();
        attemptCount++;
    }, 1000);

    hideMembersOnlyElements();
    setTimeout(hideMembersOnlyElements, 5000);  // one last one, just in case things load very slowly
})();