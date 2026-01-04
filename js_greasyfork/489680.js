// ==UserScript==
// @name         Read The Newsies
// @namespace    fresh.news.helper
// @version      1.1
// @description  Newsletter biggener
// @author       Freshmentality
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/city.php*
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/gym.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489680/Read%20The%20Newsies.user.js
// @updateURL https://update.greasyfork.org/scripts/489680/Read%20The%20Newsies.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Function to enlarge SVG icon
    function enlargeSVG() {
        let notificationElement = document.querySelector('a.linkWrap___faB9d.messages___RSm47.positive___oIv0D');
        let svgElement = document.querySelector('a.linkWrap___faB9d.messages___RSm47 svg.default___XXAGt');
        if (notificationElement && svgElement) {
            svgElement.setAttribute('width', '75');
            svgElement.setAttribute('height', '75');
        }
    }

    // Function to flash notification
    function flashNotification() {
        let notificationElement = document.querySelector('a.linkWrap___faB9d.messages___RSm47.positive___oIv0D');
        if (notificationElement) {
            let circle = document.createElement('div');
            circle.classList.add('notification-circle');
            document.body.appendChild(circle);

            // Position the circle to overlap the notification area
            let rect = notificationElement.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;

            circle.style.left = centerX + 'px';
            circle.style.top = centerY + 'px';

            setTimeout(function() {
                circle.remove();
                displayNotificationText();
            }, 3000);
        }
    }

    // Function to display notification text
    function displayNotificationText() {
        let text = document.createElement('div');
        text.textContent = 'YOU GOT A MESSAGE, READ IT NOW!';
        text.classList.add('notification-text');
        document.body.appendChild(text);
    }

    // CSS styles for flashing notification circle
    let circleCSS = `
        .notification-circle {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #66FF66;
            animation: growShrink 1.5s infinite alternate;
            transform-origin: center;
        }

        @keyframes growShrink {
            0% { transform: scale(1); }
            50% { transform: scale(5); }
            100% { transform: scale(1); }
        }
    `;

    // CSS styles for notification text
    let textCSS = `
        .notification-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: bold;
            color: #66FF66;
            animation: neon 1s ease-in-out infinite alternate;
            z-index: 9999; /* Ensure the text overlaps everything */
        }

        @keyframes neon {
            0% { text-shadow: 0 0 5px #66FF66, 0 0 10px #6220d1, 0 0 15px #66FF66; }
            100% { text-shadow: 0 0 5px #00ff00, 0 0 10px #6220d1, 0 0 15px #00ff00; }
        }
    `;

    // Inject CSS styles
    let circleStyle = document.createElement('style');
    circleStyle.appendChild(document.createTextNode(circleCSS));
    document.head.appendChild(circleStyle);

    let textStyle = document.createElement('style');
    textStyle.appendChild(document.createTextNode(textCSS));
    document.head.appendChild(textStyle);

    // Enlarge SVG icon and flash notification on page load
    enlargeSVG();
    flashNotification();
})();