// ==UserScript==
// @name         Highlight RW Effects
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Highlight RW effects in the attack loader
// @author       Weav3r
// @match        https://www.torn.com/loader.php?sid=attack*
// @downloadURL https://update.greasyfork.org/scripts/496410/Highlight%20RW%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/496410/Highlight%20RW%20Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const specifiedClasses = [
        'attacking-events-dune',
        'attacking-events-critical-hit',
        'attacking-events-standart-damage',
        'attacking-events-mug',
        'attacking-events-attack-win',
        'attacking-events-miss',
        'attacking-events-leave',
        'attacking-events-attack-join',
        'attacking-events-booster-use',
        'attacking-events-ziro-damage',
        'attacking-events-grenade-use',
        'attacking-events-reloading',
        'attacking-events-attack-lose',
        'attacking-events-riot',
        'attacking-events-quicken',
        "attacking-events-assault"
    ];

    function highlightNonMatchingEvents() {

        const messages = document.querySelectorAll('.message___Z4JCk');

        messages.forEach(message => {
            const parent = message.closest('.col1____LGQW');
            if (parent) {
                const iconWrap = parent.querySelector('.iconWrap___aIfWj span');
                if (iconWrap) {
                    const classes = iconWrap.classList;
                    const matches = specifiedClasses.some(specifiedClass => classes.contains(specifiedClass));
                    if (!matches) {
                        parent.style.backgroundColor = 'rgba(255, 255, 204, 0.3)';
                    }
                }
            }
        });
    }

    highlightNonMatchingEvents();

    const observer = new MutationObserver(() => {
        highlightNonMatchingEvents();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
