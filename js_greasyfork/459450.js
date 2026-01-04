// ==UserScript==
// @name         Memedroid.com - Adjust memes to screen
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adjust pictures and videos so that they won't be bigger than the screen!
// @author       Lucas
// @license      MIT
// @match        https://*.memedroid.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=memedroid.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459450/Memedroidcom%20-%20Adjust%20memes%20to%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/459450/Memedroidcom%20-%20Adjust%20memes%20to%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set up the throttler
    const throttle = (fn, delay) => {
        // Capture the current time
        let time = Date.now();

        // Here's our logic
        return () => {
            if((time + delay - Date.now()) <= 0) {
                // Run the function we've passed to our throttler,
                // and reset the `time` variable (so we can check again).
                fn();
                time = Date.now();
            }
        }
    }

    const fixArticles = function() {
        document.querySelectorAll('article').forEach((el) => {
            addArticleFix(el, (e) => {
                if (e.dataset.sizefix === 'yes') {
                    return;
                }
                e.dataset.sizefix = 'yes';
                let apply_styles = (i) => {
                    i.style.setProperty('max-height', '90vh', 'important');
                    i.style.setProperty('width', 'auto', 'important');
                    i.style.setProperty('min-width', '0', 'important');
                    i.style.setProperty('margin-left', 'auto', 'important');
                    i.style.setProperty('margin-right', 'auto', 'important');
                    i.parentNode.style.setProperty('text-align', 'center', 'important');
                }
                e.querySelectorAll('img,video').forEach((i) => {
                    setInterval(() => {
                        apply_styles(i);
                        i.addEventListener('play', function(v) {
                            setTimeout(() => {
                                apply_styles(v.target);
                            }, 5);
                        }, {once : true});
                    }, 300);

                });
            });
        });
    };

    function addArticleFix(element, callback) {
        new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.intersectionRatio > 0) {
                    callback(element);
                    observer.disconnect();
                }
            });
        }).observe(element);
    }

    window.addEventListener('scroll', function() {
        throttle(fixArticles, 300);
    });

    fixArticles();
})();