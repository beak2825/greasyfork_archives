// ==UserScript==
// @name         Mangadex auto-scroll fixer
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  Reverts the automatic scroll in Mangadex that tends to skip one or more pages
// @author       You
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543526/Mangadex%20auto-scroll%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/543526/Mangadex%20auto-scroll%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const start = () => setInterval(() => {
        window.scrollTo(0,0)
    }, 100)
    let it = start();
    const clear = () => clearInterval(it);
    document.addEventListener("keydown", clear);
    document.addEventListener("wheel", clear);
    document.addEventListener("click", clear);

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        if (args) {
            const [state] = args;
            if (state && state.back && state.current) {
                const matchBack = state.back.match(/^\/chapter\/(.*)\/\d+$/);
                const resultBack = matchBack ? matchBack[1] : null;

                const matchCur = state.current.match(/^\/chapter\/(.*)\/\d+$/);
                const resultCur = matchCur ? matchCur[1] : null;

                if (resultBack !== resultCur) {
                    it = start()
                }
            }
        }
        return originalPushState.apply(this, args);
    };
})();