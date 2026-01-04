// ==UserScript==
// @name         Torn - Pickpocketing Filter
// @namespace    duck.wowow
// @version      0.2
// @description  Hide unwanted targets in the pickpocketing list
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546382/Torn%20-%20Pickpocketing%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/546382/Torn%20-%20Pickpocketing%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targets = [
        "Mobster",
        //"Cyclist",
                    ];
    const backgroundColor = '#b33828';

    if (!location.href.includes('pickpocketing')) return;

    function hideNonTargets() {
        const list = document.querySelector('.virtualList___noLef');
        if (!list) return;

        let target = false;

        [...list.children].forEach(item => {
            const nameDiv = item?.querySelector('.titleAndProps___DdeVu div');
            const nameText = nameDiv?.textContent?.trim() || '';

            if (!targets.includes(nameText)) {
                item.style.cssText = 'display: none; pointer-events: none;';
            } else if (nameText) {
                item.style.cssText = '--transition-duration: 300ms; height: 51px; transform: translateY(0px);';
                target = true;
            }
        });

        const background = document.querySelector('.backdrops-container');
        if (target && background) background.style.background = backgroundColor;
        else if (background) background.style.background = '';
    }

    function initObserver() {
        const list = document.querySelector('.virtualList___noLef');
        if (!list) return;

        const observer = new MutationObserver(hideNonTargets);
        observer.observe(list, { childList: true });

        hideNonTargets();
    }

    const observerInit = new MutationObserver(() => {
        const list = document.querySelector('.virtualList___noLef');
        if (list) {
            initObserver();
            observerInit.disconnect();
        }
    });

    observerInit.observe(document.body, { childList: true, subtree: true });
})();
