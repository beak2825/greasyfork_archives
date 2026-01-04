// ==UserScript==
// @name         CS Helper Rename Hotfix
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1032262
// @version      1.0
// @description  A hotfix for the CS Helper extension to fix renaming not working
// @author       OreozHere
// @match        https://www.chickensmoothie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519607/CS%20Helper%20Rename%20Hotfix.user.js
// @updateURL https://update.greasyfork.org/scripts/519607/CS%20Helper%20Rename%20Hotfix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeImages() {
        const images = document.querySelectorAll('img[src="/img/icons/refresh24-red.png"][alt="Generate seasonal name"]');
        images.forEach(img => img.remove());
    }
    removeImages();
    const observer = new MutationObserver(removeImages);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
