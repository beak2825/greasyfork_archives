// ==UserScript==
// @name         osu! Remove Classic (CL) Mod from Top Plays
// @namespace    https://osu.ppy.sh/users/
// @version      1.3
// @description  Removes the Classic (CL) mod from top plays on osu! user profiles
// @author       MrTerror
// @match        https://osu.ppy.sh/users/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538570/osu%21%20Remove%20Classic%20%28CL%29%20Mod%20from%20Top%20Plays.user.js
// @updateURL https://update.greasyfork.org/scripts/538570/osu%21%20Remove%20Classic%20%28CL%29%20Mod%20from%20Top%20Plays.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeClassicMod() {
        document.querySelectorAll('.mod--CL').forEach(mod => mod.remove());
    }

    // Initial run
    removeClassicMod();

    // Observe specific container for top plays
    const getTargetContainer = () => (
        document.querySelector('.js-react--user-page') ||
        document.querySelector('.user-profile') ||
        document.body
    );

    let targetContainer = getTargetContainer();
    const observer = new MutationObserver(removeClassicMod);
    observer.observe(targetContainer, { childList: true, subtree: true });

    // Re-observe if container changes
    const containerCheck = setInterval(() => {
        const newContainer = getTargetContainer();
        if (newContainer !== targetContainer) {
            targetContainer = newContainer;
            observer.observe(targetContainer, { childList: true, subtree: true });
            removeClassicMod();
        }
    }, 1000);

    // Handle navigation
    window.addEventListener('popstate', removeClassicMod);
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        removeClassicMod();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        removeClassicMod();
    };
})();