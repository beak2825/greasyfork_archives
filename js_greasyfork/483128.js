// ==UserScript==
// @name         NoVideoAds YouTube Beautiful Animation (Enhanced)
// @description  Remove video ads on YouTube and display a beautiful and attractive notification animation indicating the removal of ads with enhanced style and interface
// @version      1.1
// @author       HiraganaDev
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @icon         https://www.youtube.com/s/desktop/28b0985e/img/favicon.ico
// @namespace https://greasyfork.org/users/1239133
// @downloadURL https://update.greasyfork.org/scripts/483128/NoVideoAds%20YouTube%20Beautiful%20Animation%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483128/NoVideoAds%20YouTube%20Beautiful%20Animation%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for the notification animation
    GM_addStyle(`
        @keyframes fade-in {
            0% {
                transform: translateY(-30px) scale(0.5);
                opacity: 0;
            }
            100% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }

        .notification {
            position: fixed;
            top: 70px;
            right: 30px;
            z-index: 2147483647;
            padding: 12px;
            background-color: #4285F4;
            color: white;
            font-weight: bold;
            opacity: 0;
            transform: translateY(-30px) scale(0.5);
            animation: fade-in 0.3s ease-out 0.4s forwards;
            border-radius: 6px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            line-height: 1.4;
            max-width: 240px;
            transition: background-color 0.3s ease;
            cursor: pointer;
        }

        .notification:hover {
            background-color: #0c59cf;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
            transform: translateY(1px) scale(1.02);
        }

        .notification:active {
            background-color: #0a47c2;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transform: translateY(1px) scale(0.98);
        }
    `);

    // Add the notification element and event listener
    function addNotification() {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = 'Ads have been removed!';
        notification.addEventListener('click', removeNotification);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => {
                notification.remove();
            }, 300); // Wait for the fade-out animation to complete (0.3 seconds)
        }, 5000); // Delay before hiding the notification (5 seconds)
    }

    // Remove the notification when clicked
    function removeNotification() {
        const notification = document.querySelector('.notification');

        if (notification) {
            notification.style.opacity = 0;
            setTimeout(() => {
                notification.remove();
            }, 300); // Wait for the fade-out animation to complete (0.3 seconds)
        }
    }

    // Remove video ads
    function removeVideoAds() {
        const observer = new MutationObserver(() => {
            const videoAd = document.querySelector('video[class*="video-stream"][src*="doubleclick.net"]');
            if (videoAd && videoAd.parentElement) {
                videoAd.parentElement.style.display = 'none';
                observer.disconnect();
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.documentElement, config);
    }

    // Run the script when the page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            addNotification();
            removeVideoAds();
        }, 2000); // Delay execution to wait for the page to fully load
    });
})();