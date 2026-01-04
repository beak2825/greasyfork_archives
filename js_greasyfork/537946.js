// ==UserScript==
// @name         Disposal Auto Selector
// @version      1.3
// @author       aquagloop
// @description  Auto select the highest-success disposal method for Torn crimes.
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/1476871
// @downloadURL https://update.greasyfork.org/scripts/537946/Disposal%20Auto%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/537946/Disposal%20Auto%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function isDisposalPage() {
        return window.location.hash === '#/disposal';
    }

    const BEST_BY_JOB = {
        'Broken Appliance':   'Sink',
        'Biological Waste':   'Sink',
        'Body Part':          'Dissolve',
        'Dead Body':          'Dissolve',
        'Documents':          'Burn',
        'Firearm':            'Sink',
        'Firearms':           'Sink',
        'General Waste':      'Bury',
        'Industrial Waste':   'Sink',
        'Murder Weapon':      'Sink',
        'Old Furniture':      'Burn',
        'Vehicle':            'Sink',
        'Building Debris':    'Bury'
    };

    function isVisible(el) {
        return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    setInterval(() => {
        if (!isDisposalPage()) return;

        document.querySelectorAll('.crime-option').forEach(container => {
            if (container.dataset.autoClicked === 'true') {
                const anyVisible = Array.from(container.querySelectorAll('button[aria-label]')).some(isVisible);
                if (!anyVisible) delete container.dataset.autoClicked;
                return;
            }

            const visibleBtns = Array.from(container.querySelectorAll('button[aria-label]')).filter(isVisible);
            if (visibleBtns.length === 0) return;

            const header = container.querySelector('[class^="crimeOptionSection"]');
            const jobName = header ? header.textContent.trim() : null;

            let best = BEST_BY_JOB[jobName];
            if (!best) {
                for (let key in BEST_BY_JOB) {
                    if (jobName && jobName.includes(key)) {
                        best = BEST_BY_JOB[key];
                        break;
                    }
                }
            }

            let target = null;
            if (best) {
                target = visibleBtns.find(btn =>
                    btn.getAttribute('aria-label').toLowerCase() === best.toLowerCase()
                );
            }
            if (!target) target = visibleBtns[0];

            if (target) {
                target.click();
                container.dataset.autoClicked = 'true';
            }
        });
    }, 300);
})();