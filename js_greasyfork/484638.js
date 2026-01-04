// ==UserScript==
// @name         LeetCode CN to LeetCode COM Redirector with Abort Option
// @namespace    http://tampermonkey.net/
// @version      2024-01-12#3
// @description  Redirect from leetcode.cn to leetcode.com with a loading animation and an option to abort.
// @author       Yuyang Wang
// @match        *://leetcode.cn/*
// @match        *://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484638/LeetCode%20CN%20to%20LeetCode%20COM%20Redirector%20with%20Abort%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/484638/LeetCode%20CN%20to%20LeetCode%20COM%20Redirector%20with%20Abort%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL is from leetcode.cn
    if (window.location.host === 'leetcode.cn') {
        // Create a container for the loader
        // Create a container for the loader
        var loaderContainer = document.createElement("div");
        loaderContainer.style.position = "fixed";
        loaderContainer.style.top = "0";
        loaderContainer.style.left = "0";
        loaderContainer.style.width = "100%";
        loaderContainer.style.height = "100%";
        loaderContainer.style.display = "flex";
        loaderContainer.style.justifyContent = "center";
        loaderContainer.style.alignItems = "center";
        loaderContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // 50% transparent background
        loaderContainer.innerHTML = '<div class="loader"></div>';

        // Create and style the abort button
        var abortButton = document.createElement("button");
        abortButton.innerHTML = "Abort Redirect";
        abortButton.style.position = "fixed";
        abortButton.style.top = "20px";
        abortButton.style.right = "20px";
        abortButton.style.zIndex = "1001";

        // Append the loader and the abort button to the body
        document.body.appendChild(loaderContainer);
        document.body.appendChild(abortButton);

        GM_addStyle(`
            .loader {
                border: 16px solid #f3f3f3;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);

        // Create the new URL by replacing 'leetcode.cn' with 'leetcode.com'
        var newUrl = window.location.href.replace('leetcode.cn', 'leetcode.com');

        // Redirect to the new URL after a short delay to show the animation
        var redirectTimeout = setTimeout(function() {
            window.location.href = newUrl;
        }, 1000); // Adjust the time as needed

        // Function to abort the redirect
        abortButton.addEventListener('click', function() {
            loaderContainer.style.display = 'none';
            abortButton.style.display = 'none';
            clearTimeout(redirectTimeout);
        });
    }
})();
