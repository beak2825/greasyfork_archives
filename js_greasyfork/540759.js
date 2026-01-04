// ==UserScript==
// @name         Steam: Hide Topics & Comments from Blocked Users
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides topics and comments from blocked users in Steam discussions.
// @match        https://steamcommunity.com/app/*/discussions*
// @author       Spuner
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/768px-Steam_icon_logo.svg.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540759/Steam%3A%20Hide%20Topics%20%20Comments%20from%20Blocked%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/540759/Steam%3A%20Hide%20Topics%20%20Comments%20from%20Blocked%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideBlockedTopics() {
        const searchText = 'Тема, созданная заблокированным пользователем';
        const labelSelector = 'span.forum_topic_label';
        const containerSelector = 'div.forum_topic';
        let hiddenCount = 0;

        const labels = document.querySelectorAll(labelSelector);
        labels.forEach(label => {
            if (label.textContent.includes(searchText)) {
                const topicToHide = label.closest(containerSelector);
                if (topicToHide && topicToHide.style.display !== 'none') {
                    topicToHide.style.display = 'none';
                    hiddenCount++;
                }
            }
        });
        if (hiddenCount > 0) {
            console.log(`[Steam Blocker] Скрыто тем: ${hiddenCount}`);
        }
    }

    function hideBlockedComments() {
        const searchText = 'Пользователь заблокирован';
        const labelSelector = 'span.commentthread_deleted_comment_audit';
        const containerSelector = 'div.commentthread_deleted_comment';
        let hiddenCount = 0;

        const labels = document.querySelectorAll(labelSelector);
        labels.forEach(label => {
            if (label.textContent.includes(searchText)) {
                const commentToHide = label.closest(containerSelector);
                if (commentToHide && commentToHide.style.display !== 'none') {
                    commentToHide.style.display = 'none';
                    hiddenCount++;
                }
            }
        });
        if (hiddenCount > 0) {
            console.log(`[Steam Blocker] Скрыто комментариев: ${hiddenCount}`);
        }
    }

    function applyAllRules() {
        hideBlockedTopics();
        hideBlockedComments();
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                setTimeout(applyAllRules, 250);
                return;
            }
        }
    });

    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            applyAllRules();
        } else {
            setTimeout(startObserver, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();