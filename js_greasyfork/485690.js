// ==UserScript==
// @name         AO3 Pagination Enhancement
// @name:zh-CN   AO3 分页增强
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add page jumping feature to AO3 pagination
// @description:zh-CN  为AO3 添加跳转页码功能
// @author       acacius
// @match        https://archiveofourown.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485690/AO3%20Pagination%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/485690/AO3%20Pagination%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle page jump
    function jumpToPage() {
        const inputElement = document.getElementById('jumpToPageInput');
        if (inputElement) {
            const page = parseInt(inputElement.value);
            const maxPage = parseInt(document.querySelector('.pagination.actions li.next').previousElementSibling.querySelector('a').innerText);
            if (!isNaN(page) && page > 0 && page <= maxPage) {
                // Build the new URL with the selected page
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('page', page);
                window.location.href = currentUrl.toString();
            }
        }
    }

    // Insert input box and button after the pagination
    const pagination = document.querySelector('.pagination.actions');
    if (pagination) {
        const jumpContainer = document.createElement('div');
        const maxPageValue = parseInt(document.querySelector('.pagination.actions li.next').previousElementSibling.querySelector('a').innerText);
        jumpContainer.innerHTML = `
            <input type="number" id="jumpToPageInput" placeholder="Page" style="width: 60px; margin-right: 5px;" min="1" max="${maxPageValue}">
            <button id="jumpToPageButton">Go</button>
        `;
        pagination.appendChild(jumpContainer);

        // Add event listener for the button click
        const jumpButton = document.getElementById('jumpToPageButton');
        if (jumpButton) {
            jumpButton.addEventListener('click', jumpToPage);
        }

        // Add event listener for pressing Enter in the input box
        const jumpInput = document.getElementById('jumpToPageInput');
        if (jumpInput) {
            jumpInput.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    jumpToPage();
                }
            });
        }
    }

    // Add sticky style to the pagination element
    GM_addStyle(`
        .pagination.actions {
            position: sticky;
            bottom: 0;
            background-color: white; /* Adjust as needed */
            z-index: 1000; /* Adjust as needed */
        }
    `);
})();
