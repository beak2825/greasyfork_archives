// ==UserScript==
// @name         Prevent Reload Genius
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Avoid reloading while transcribing
// @author       Fri
// @match        https://genius.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genius.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475025/Prevent%20Reload%20Genius.user.js
// @updateURL https://update.greasyfork.org/scripts/475025/Prevent%20Reload%20Genius.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('beforeunload', function(e) {
        var saveButtonoldPage = document.querySelector('button[ng-click="lyrics_ctrl.lyrics_form.submit()"]')
        var saveButtonnewPage = document.querySelector('.LyricsEditdesktop__Controls-sc-19lxrhp-3 > button > span')

        if(document.querySelector(".react_song_page_preview_link")) {
            if (saveButtonoldPage.textContent.trim() === 'Save') {
                e.preventDefault();
                e.returnValue = '';
            }
        } else if(document.querySelector(".OptOutButton__Container-e48zu0-0")) {
            if (saveButtonnewPage.textContent === 'Shift + Enter') {
                e.preventDefault();
                e.returnValue = '';
            }
        } else;

    });
})();
