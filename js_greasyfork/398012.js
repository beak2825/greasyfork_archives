// ==UserScript==
// @name         Wanikani Always Show Review/Lesson Buttons
// @namespace    https://greasyfork.org/en/users/122343-tender-waffles
// @version      1
// @description  Ensures the wanikani Review/Lesson buttons in the toolbar always display when on the dashboard, no matter what scroll position you're at
// @author       Tender Waffles
// @include      https://www.wanikani.com*
// @include      *preview.wanikani.com*
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/398012/Wanikani%20Always%20Show%20ReviewLesson%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/398012/Wanikani%20Always%20Show%20ReviewLesson%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('scroll', removeHidden);
    function removeHidden() {
        var buttons = document.querySelector('.navigation-shortcuts');
        buttons.classList.remove('hidden');
    }

    removeHidden();
})();