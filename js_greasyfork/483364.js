// ==UserScript==
// @name         Kageshi Mode Stumblechat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically add new users to localStorage HideList
// @match        https://stumblechat.com/room/*
// @author       MeKLiN
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483364/Kageshi%20Mode%20Stumblechat.user.js
// @updateURL https://update.greasyfork.org/scripts/483364/Kageshi%20Mode%20Stumblechat.meta.js
// ==/UserScript==

(function () {
        'use strict';

        // Helper: Load HideList from localStorage or create a new one
        function loadHideList() {
                const list = localStorage.getItem('HideList');
                return list ? JSON.parse(list) : [];
        }

        // Helper: Save HideList back to localStorage
        function saveHideList(list) {
                localStorage.setItem('HideList', JSON.stringify(list));
        }

        // Add username if not already in HideList
        function addToHideList(username) {
                const hideList = loadHideList();
                if (!hideList.includes(username)) {
                        hideList.push(username);
                        saveHideList(hideList);
                        console.log(`[HideList] Added: ${username}`);
                }
        }

        // Extract usernames from all <li class="bar"> elements
        function scanAndUpdateUserList() {
                document.querySelectorAll('ul.list li.bar').forEach(li => {
                        const usernameSpan = li.querySelector('.username');
                        if (usernameSpan) {
                                const username = usernameSpan.textContent.trim();
                                if (username) addToHideList(username);
                        }
                });
        }

        // Start observing when ul.list is available
        function observeUserList() {
                const userList = document.querySelector('ul.list');
                if (!userList) {
                        setTimeout(observeUserList, 500); // Wait and retry
                        return;
                }

                // Initial scan
                scanAndUpdateUserList();

                const observer = new MutationObserver(() => {
                        scanAndUpdateUserList();
                });

                observer.observe(userList, { childList: true, subtree: true });
                console.log('[HideList] MutationObserver started on user list.');
        }

        // Start script
        observeUserList();
})();
