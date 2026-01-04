// ==UserScript==
// @name         Sprinter
// @author       _Aldan_
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  autostart video + skip intro/outro
// @match        https://jut.su/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522773/Sprinter.user.js
// @updateURL https://update.greasyfork.org/scripts/522773/Sprinter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wasPlayClicked = false;
    window.addEventListener('load', () => {
        const pb = document.querySelector('button.vjs-big-play-button');
        if (pb && !wasPlayClicked) {
            pb.click();
            wasPlayClicked = true;
        }
    });

    const tasks = new WeakMap();
    function scheduleClick(el) {
        if (!el.classList.contains('vjs-hidden')) {
            if (!tasks.has(el)) {
                const timer = setTimeout(() => {
                    el.click();
                    tasks.delete(el);
                }, 2000);
                tasks.set(el, timer);
            }
        } else if (tasks.has(el)) {
            clearTimeout(tasks.get(el));
            tasks.delete(el);
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const t = mutation.target;
                if (
                    t.matches('div.vjs-overlay-skip-intro') ||
                    (
                        t.matches('div.vjs-overlay') &&
                        (/пропустить заставку/i.test(t.textContent) || /следующая серия/i.test(t.textContent))
                    )
                ) {
                    scheduleClick(t);
                }
            }
        }
    });

    observer.observe(document.body, { attributes: true, subtree: true });

    function init() {
        const els = document.querySelectorAll('div.vjs-overlay-skip-intro, div.vjs-overlay');
        els.forEach(el => {
            if (
                el.matches('div.vjs-overlay-skip-intro') ||
                /пропустить заставку/i.test(el.textContent) ||
                /следующая серия/i.test(el.textContent)
            ) {
                scheduleClick(el);
            }
        });
    }

    window.addEventListener('load', init);
})();
