// ==UserScript==
// @name         BTDigg頁面跳轉優化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  能用更順手的操作來使用BTDigg網頁。
// @author       Rootcat with GPT
// @match        https://btdig.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492074/BTDigg%E9%A0%81%E9%9D%A2%E8%B7%B3%E8%BD%89%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492074/BTDigg%E9%A0%81%E9%9D%A2%E8%B7%B3%E8%BD%89%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function createDropdownWithSearchBar(parentElement) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '57px';
        container.style.right = '15px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        parentElement.appendChild(container);

        const prevButton = document.createElement('button');
        prevButton.textContent = '＜';
        prevButton.style.width = '30px';
        prevButton.style.height = '30px';
        prevButton.style.marginRight = '5px';
        prevButton.addEventListener('click', function() {
            const currentPage = getCurrentPageNumber();
            if (currentPage > 0) {
                navigateToPage(currentPage - 1);
            }
        });
        container.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.textContent = '＞';
        nextButton.style.width = '30px';
        nextButton.style.height = '30px';
        nextButton.style.marginRight = '5px';
        nextButton.addEventListener('click', function() {
            const currentPage = getCurrentPageNumber();
            if (currentPage < 70) {
                navigateToPage(currentPage + 1);
            }
        });
        container.appendChild(nextButton);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Page';
        searchInput.style.width = '40px';
        searchInput.style.height = '30px';
        searchInput.style.marginRight = '5px';
        container.appendChild(searchInput);

        const dropdown = document.createElement('select');
        dropdown.style.width = '96px';
        dropdown.style.height = '30px';
        container.appendChild(dropdown);

        const currentPageNumber = getCurrentPageNumber();

        for (let i = 0; i <= 70; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Page ${i}`;
            if (i == currentPageNumber) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        }

        dropdown.addEventListener('change', function() {
            const currentPage = dropdown.value;
            navigateToPage(currentPage);
        });

        searchInput.addEventListener('change', function() {
            const pageNumber = parseInt(searchInput.value);
            if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber <= 70) {
                navigateToPage(pageNumber);
            } else {
                alert('請輸入0到70中的數值。');
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                const currentPage = getCurrentPageNumber();
                if (currentPage > 0) {
                    navigateToPage(currentPage - 1);
                }
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                const currentPage = getCurrentPageNumber();
                if (currentPage < 70) {
                    navigateToPage(currentPage + 1);
                }
            }
        });
    }

    function navigateToPage(pageNumber) {
        const currentURL = window.location.href;
        let newURL;
        if (currentURL.includes("&p=")) {
            newURL = currentURL.replace(/(&p=)\d+/, `$1${pageNumber}`);
        } else {
            newURL = currentURL + `&p=${pageNumber}`;
        }
        window.location.href = newURL;
    }

    function getCurrentPageNumber() {
        const currentURL = window.location.href;
        const match = currentURL.match(/&p=(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    const bodyElement = document.querySelector('body');
    if (bodyElement) {
        createDropdownWithSearchBar(bodyElement);
    }

})();