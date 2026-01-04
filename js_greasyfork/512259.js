// ==UserScript==
// @license MIT
// @name         嗅探小插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sniff and display all HTTP/HTTPS links from a webpage in a floating div with numbering
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @icon         https://s1.imagehub.cc/images/2024/10/11/d11fee938e8a681bdcf6e09b7c414002.th.png
// @downloadURL https://update.greasyfork.org/scripts/512259/%E5%97%85%E6%8E%A2%E5%B0%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512259/%E5%97%85%E6%8E%A2%E5%B0%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles for the floating div and toggle button
    GM_addStyle(`
    #floatingDiv {
        position: fixed;
        top: 50px; /* Adjusted to leave space for the toggle button */
        right: 10px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
        border: 1px solid white; /* Change border color to white */
        padding: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        display: none; /* Initially hidden */
        border-radius: 15px; /* Rounded corners */
        backdrop-filter: blur(10px); /* Frosted glass effect */
    }
    #floatingDiv h2 {
        margin-top: 0;
        text-align: center;
    }
    #floatingDiv a {
        display: block;
        word-wrap: break-word;
        margin: 5px 0;
        padding: 5px;
        border-bottom: 1px solid #ddd;
        text-decoration: none;
        color: #007BFF;
    }
    #floatingDiv a:hover {
        background-color: #f0f0f0;
    }
    #floatingDiv img {
        display: block;
        margin: 0 auto 10px;
        width: 50px;
        height: 50px;
    }
    #floatingDiv .footer {
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
        color: #333;
    }
    #toggleButton {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10001;
        background-color: rgba(0, 123, 255, 0.8); /* Semi-transparent background */
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        border-radius: 15px; /* Rounded corners */
        backdrop-filter: blur(10px); /* Frosted glass effect */
    }
    /* 滚动条轨道 */
    #floatingDiv::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 15px;
    }
    /* 滚动条 */
    #floatingDiv::-webkit-scrollbar {
        width: 12px;
        border-radius: 15px;
    }
    /* 滚动条滑块 */
    #floatingDiv::-webkit-scrollbar-thumb {
        background: #007BFF;
        border-radius: 15px;
    }
`);

    // Create the floating div
    const floatingDiv = document.createElement('div');
    floatingDiv.id = 'floatingDiv';
    floatingDiv.innerHTML = `
        <img src="https://s1.imagehub.cc/images/2024/10/11/d11fee938e8a681bdcf6e09b7c414002.th.png" alt="Icon">
        <h2>网址嗅探小插件</h2>
        <div class="footer">信阳师范大学</div>
    `;
    document.body.appendChild(floatingDiv);

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = '嗅探小插件展开';
    document.body.appendChild(toggleButton);

    // Function to extract HTTP/HTTPS links
    function extractHttpLinks() {
        const links = document.querySelectorAll('a[href^="http"], a[href^="https"]');
        links.forEach((link, index) => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = `${index + 1}. ${link.href}`;
            floatingDiv.insertBefore(linkElement, floatingDiv.querySelector('.footer'));
        });
    }

    // Function to toggle the visibility of the floating div
    function toggleFloatingDiv() {
        if (floatingDiv.style.display === 'none' || floatingDiv.style.display === '') {
            floatingDiv.style.display = 'block';
            toggleButton.textContent = '嗅探小插件收起';
        } else {
            floatingDiv.style.display = 'none';
            toggleButton.textContent = '嗅探小插件展开';
        }
    }

    // Attach event listener to the toggle button
    toggleButton.addEventListener('click', toggleFloatingDiv);

    // Run the function after the page has fully loaded
    window.addEventListener('load', extractHttpLinks);
})();