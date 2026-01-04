// ==UserScript==
// @name         F4 눌러서 URL을 Clipboard로 복사
// @description  Press F4 to copy the current URL to clipboard and move to the address bar with a confirmation popup
// @match        https://exhentai.org/*
// @match        https://www.iwara.tv/*
// @version 0.0.1.20250612155514
// @namespace https://greasyfork.org/users/1480633
// @downloadURL https://update.greasyfork.org/scripts/539230/F4%20%EB%88%8C%EB%9F%AC%EC%84%9C%20URL%EC%9D%84%20Clipboard%EB%A1%9C%20%EB%B3%B5%EC%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539230/F4%20%EB%88%8C%EB%9F%AC%EC%84%9C%20URL%EC%9D%84%20Clipboard%EB%A1%9C%20%EB%B3%B5%EC%82%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy the current page's URL to the clipboard
    function copyURLToClipboard() {
        const url = window.location.href;
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        console.log('URL copied to clipboard: ' + url);
        showPopup('URL 복사 완료'); // Show popup on success
    }

    // Function to show a bubble popup
    function showPopup(message) {
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.position = 'fixed';
        popup.style.top = '60px'; // Position right below the address bar
        popup.style.left = '50%'; // Center horizontally
        popup.style.transform = 'translateX(-50%)'; // Center horizontally with transform
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.fontSize = '14px';
        popup.style.zIndex = '1000';
        popup.style.transition = 'opacity 0.5s ease';
        popup.style.opacity = '1'; // Start visible

        document.body.appendChild(popup);

        // After 2 seconds, fade out the popup
        setTimeout(() => {
            popup.style.opacity = '0';
            // Remove the popup after it fades out (0.3s for transition)
            setTimeout(() => {
                popup.remove();
            }, 300);
        }, 500); // Show for 2 seconds before fading out
    }

    // Add event listener for F4 key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F4') {
            setTimeout(copyURLToClipboard, 0);
        }
    });
})();