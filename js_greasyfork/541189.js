// ==UserScript==
// @name         Remove Blur Filter on chan.sankakucomplex
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Removes SVG blur filters only on chan.sankakucomplex.com
// @author       fumeko-ts
// @match        *://chan.sankakucomplex.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541189/Remove%20Blur%20Filter%20on%20chansankakucomplex.user.js
// @updateURL https://update.greasyfork.org/scripts/541189/Remove%20Blur%20Filter%20on%20chansankakucomplex.meta.js
// ==/UserScript==



(function() {
    'use strict';

    setTimeout = ((o) => (f, d, ...a) =>(f + '').includes('FADE_IN_DURATION') ? o(f, 0, ...a) : o(f, d, ...a))(setTimeout);

    function removeBlurFilter() {
        const blurFilter = document.getElementById('f-blur');
        if (blurFilter) {
            blurFilter.remove();
            console.log('Blur filter removed successfully');
        }
    }
    window.addEventListener('load', () => {
        removeBlurFilter();
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.id === 'f-blur' || node.querySelector('#f-blur')) {
                            removeBlurFilter();
                        }
                    }
                });
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    });
})();
