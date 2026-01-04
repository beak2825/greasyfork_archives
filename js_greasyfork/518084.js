// ==UserScript==
// @name         Moodle AutoConnect
// @namespace    https://t.me/johannmosin
// @version      0.1.2.1
// @description  Автоматически присоединяется к конференциям на Moodle
// @author       Johann Mosin
// @match        https://edu.vsu.ru/mod/bigbluebuttonbn/view.php?*
// @match        https://*.edu.vsu.ru/html5client/join?sessionToken=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518084/Moodle%20AutoConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/518084/Moodle%20AutoConnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle "bigbluebuttonbn" pages
    function handleBigBlueButtonPage() {
        const checkInterval = setInterval(() => {
            console.log("Checking for session link...");
            const sessionLink = Array.from(document.querySelectorAll('a')).find(td => td.textContent.includes("Подключиться к сеансу"));
            if (sessionLink) {
                const href = sessionLink.href;
                console.log("Found session link:", href);
                window.open(href, '_blank');
                clearInterval(checkInterval); // Stop checking
            } else {location.reload();}
        }, 10000);
    }

    // Function to handle "html5client" pages
    function handleHtml5ClientPage() {
        const buttonInterval = setInterval(() => {
            console.log("Checking for buttons...");
            const joinButton = document.querySelector('button[aria-label="Только слушать"]');
            if (joinButton) {
                joinButton.click();
                console.log("Clicked button: Только слушать");
            }
            const connectButton = document.querySelector('button[aria-label="Проиграть звук"]');
            if (connectButton) {
                connectButton.click();
                console.log("Clicked button: Проиграть звук");
                clearInterval(buttonInterval); // Stop checking
            }
        }, 2000);
    }

    // Main logic to determine which handler to use
    if (window.location.href.includes("bigbluebuttonbn")) {
        console.log("Detected bigbluebuttonbn page.");
        handleBigBlueButtonPage();
    } else if (window.location.href.includes("html5client")) {
        console.log("Detected html5client page.");
        handleHtml5ClientPage();
    }
})();
