// ==UserScript==
// @name         Zendesk Notification Sound & Highlight Updated
// @namespace    https://yourdomain.com
// @version      3.0
// @description  Play sound and change button style when a new notification arrives in Zendesk.
// @author       KoKa_UA
// @match        *://*.zendesk.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526142/Zendesk%20Notification%20Sound%20%20Highlight%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/526142/Zendesk%20Notification%20Sound%20%20Highlight%20Updated.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const notificationSound = new Audio("https://zvukitop.com/wp-content/uploads/2021/03/zvuki-opovesheniya.mp3");




    function checkForNewMessages(mutationsList) {

        const unreadCountElement = document.querySelector('[data-test-id="awm-unread-count"]');
        const notificationButton = document.querySelector('button[aria-label="Notifications"]');

        if (unreadCountElement && notificationButton) {
            if (unreadCountElement.innerText.trim() !== "0" && unreadCountElement.innerText.trim() !== "") {
                notificationSound.play();
                notificationButton.classList.add("has-new-messages");
            } else {
                notificationButton.classList.remove("has-new-messages");
            }
        }
    }


    function startObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver(checkForNewMessages);
        observer.observe(targetNode, config);

    }

    window.addEventListener('load', function() {
        setTimeout(startObserver, 5000);
    });

})();