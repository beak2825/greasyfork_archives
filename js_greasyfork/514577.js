// ==UserScript==
// @name         Rate Your Music Search
// @namespace    https://greasyfork.org/en/users/247131
// @author       ALi3naTEd0
// @version      1.0
// @description  Search Selected Text on RateYourMusic.com with a simple shortcut on any website.
// @match        *://*/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514577/Rate%20Your%20Music%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/514577/Rate%20Your%20Music%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to perform the search on RateYourMusic
    function searchRateYourMusic(text) {
        const searchUrl = `https://rateyourmusic.com/search?searchterm=${encodeURIComponent(text)}`;
        GM_openInTab(searchUrl, { active: false }); // active: false opens the tab in the background
    }

    // Keyboard shortcuts: Ctrl + < and Ctrl + ,
    document.addEventListener('keydown', (e) => {
        const selectedText = window.getSelection().toString().trim();
        if ((e.ctrlKey && e.key === '<') || (e.ctrlKey && e.key === ',')) {
            if (selectedText) {
                searchRateYourMusic(selectedText);
            } else {
                alert("Please select some text first.");
            }
        }
    });
})();
