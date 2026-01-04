// ==UserScript==
// @name         Medium Freedium Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "Freedium" button to Medium posts
// @author       lmdw
// @match        *://medium.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528304/Medium%20Freedium%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/528304/Medium%20Freedium%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let found = false; // Biến để theo dõi xem đã tìm thấy bài đăng hay chưa
    let url = window.location.href; // Lưu URL ban đầu
    let checkInterval; // Biến để lưu interval ID
    let timeout; // Biến để lưu timeout ID
    let metaTagRef = null; // Lưu trữ tham chiếu đến tag meta (tối ưu hóa)
    let freediumButton = null; // Biến để lưu tham chiếu đến nút Freedium

    // Function to create and append the Freedium button
    function createFreediumButton() {
        // Create the button element
        freediumButton = document.createElement('button');
        freediumButton.textContent = 'Freedium';

        // Style the button to match Medium's design (example styles - adjust as needed)
        freediumButton.style.position = 'fixed';
        freediumButton.style.top = '50%'; // Position vertically centered
        freediumButton.style.right = '10px'; // Position near the scrollbar
        freediumButton.style.transform = 'translateY(-50%)'; // Correct vertical centering
        freediumButton.style.backgroundColor = '#292929';
        freediumButton.style.color = '#fff';
        freediumButton.style.border = 'none';
        freediumButton.style.padding = '10px 15px';
        freediumButton.style.borderRadius = '4px';
        freediumButton.style.cursor = 'pointer';
        freediumButton.style.zIndex = '9999'; // Ensure it's on top of other elements
        freediumButton.style.fontFamily = 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif'; // Medium's font
        freediumButton.style.fontSize = '14px';

        // Add opacity and hover effect
        freediumButton.style.opacity = '0.4'; // Initial opacity (more transparent)
        freediumButton.style.transition = 'opacity 0.2s ease-in-out'; // Smooth transition

        freediumButton.addEventListener('mouseover', function() {
            freediumButton.style.opacity = '1'; // Fully opaque on hover
            freediumButton.style.backgroundColor = '#3e3e3e';
        });
        freediumButton.addEventListener('mouseout', function() {
            freediumButton.style.opacity = '0.6'; // Return to original opacity
            freediumButton.style.backgroundColor = '#292929';
        });


        // Add the click event listener to redirect to Freedium
        freediumButton.addEventListener('click', function() {
            window.location.href = 'https://freedium.cfd/' + window.location.href;
        });

        // Append the button to the body
        document.body.appendChild(freediumButton);
    }

    function checkAndPrint() {
        if (!metaTagRef) {
            metaTagRef = document.querySelector('meta[data-rh="true"][property="og:type"][content="article"]');
        }

        if (metaTagRef) {
            // In thông báo nổi bật bằng CSS
            console.log('%cFound Medium post', 'color: white; background-color: green; font-size: 16px; padding: 5px;');
            createFreediumButton();
            found = true;
            clearInterval(checkInterval);
            clearTimeout(timeout);

        }
    }

    function notFound() {
        if (!found) {
            console.log('%cNot found Medium post', 'color: white; background-color: red; font-size: 16px; padding: 5px;');
            clearInterval(checkInterval);
            found = true;
        }
    }

    function startChecking() {
        // Xóa nút Freedium nếu nó tồn tại
        if (freediumButton) {
            freediumButton.remove();
            freediumButton = null;
        }

        found = false;
        metaTagRef = null; // Reset tham chiếu tag meta
        clearInterval(checkInterval);
        clearTimeout(timeout);

        checkInterval = setInterval(checkAndPrint, 1000);

        timeout = setTimeout(notFound, 5000);
    }

    // Kiểm tra khi trang được tải xong hoàn toàn (load event)
    window.addEventListener('load', function() {
        startChecking();
    });

    // Theo dõi thay đổi URL (giảm tần suất kiểm tra)
    setInterval(function() {
        if (window.location.href !== url) {
            url = window.location.href;
            startChecking();
        }
    }, 1000);

    window.addEventListener('beforeunload', function (e) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
    });

})();