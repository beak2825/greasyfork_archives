// ==UserScript==
// @name         gaiaonline announcement remover
// @version      1.1
// @description  announcement are awful.
// @author       don't @ me bro
// @match        *://www.gaiaonline.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1262821
// @downloadURL https://update.greasyfork.org/scripts/487568/gaiaonline%20announcement%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/487568/gaiaonline%20announcement%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filterAndRemoveDivs() {
    const notifyBubble = document.getElementById('notifyBubbleContainer');
    if (notifyBubble) {
        const messageContent = notifyBubble.querySelector('.messageContent');
        if (messageContent) {
            const announcements = messageContent.querySelectorAll('.notify_announcements');
            announcements.forEach(announcement => announcement.parentNode.removeChild(announcement));
            const remainingDivs = messageContent.querySelectorAll('li');
            if (remainingDivs.length === 0) {
                notifyBubble.parentNode.removeChild(notifyBubble);
            }
        }
    }
}


    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (!mutation.addedNodes) return;

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].nodeType === Node.ELEMENT_NODE) {
                    if (mutation.addedNodes[i].id === 'notifyBubbleContainer' ||
                        mutation.addedNodes[i].querySelector('.notify_announcements')) {
                        filterAndRemoveDivs();
                        break;
                    }
                }
            }
        });
    });


    function startObserving() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            filterAndRemoveDivs();
        } else {
            setTimeout(startObserving, 10);
        }
    }

    startObserving();
})();
