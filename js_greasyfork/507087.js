// ==UserScript==
// @name         Hide Blocked User's Posts on Chicken Smoothie
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1032262
// @version      1.0
// @description  Hides "This post was made by User who is currently on your ignore list. Display this post." message on all forum pages.
// @author       OreozHere
// @match        https://www.chickensmoothie.com/Forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507087/Hide%20Blocked%20User%27s%20Posts%20on%20Chicken%20Smoothie.user.js
// @updateURL https://update.greasyfork.org/scripts/507087/Hide%20Blocked%20User%27s%20Posts%20on%20Chicken%20Smoothie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndHidePosts() {
        document.querySelectorAll('div.inner').forEach(innerDiv => {
            if (innerDiv.querySelector('div.ignore')) {
                const parentDiv = innerDiv.closest('div.post');
                if (parentDiv) {
                    parentDiv.style.display = 'none';
                }
            }
        });
    }

    checkAndHidePosts();

    const observer = new MutationObserver(checkAndHidePosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();
