// ==UserScript==
// @name         NoneBot 网站增强
// @namespace    https://github.com/KomoriDev/nonebot-website-tweaker
// @version      0.1.1
// @description  为 NoneBot 网站提供额外功能
// @author       Komorebi
// @license      MIT
// @homepage     https://github.com/KomoriDev/nonebot-website-tweaker
// @match        https://nonebot.dev/store/*
// @icon         https://nonebot.dev/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519423/NoneBot%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519423/NoneBot%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('NoneBot website extension loaded successfully');

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector('nav.paginate-container');
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addJumpControls() {
        const paginationNav = document.querySelector('nav.paginate-container');
        if (!paginationNav) return;

        const separator = document.createElement('span');
        separator.style.width = '1.5px';
        separator.style.height = '2rem';
        separator.style.margin = '10px';
        separator.style.backgroundColor = 'var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity,1)))';

        const jumpContainer = document.createElement('div');
        jumpContainer.className = 'paginate-pager';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '页码';
        input.style.width = '60px';
        input.style.outline = 'none';
        input.style.textIndent = '5px';
        input.style.marginRight = '5px';
        input.style.borderWidth = '2px';
        input.style.borderColor = 'var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity,1)))';

        const button = document.createElement('button');
        button.className = 'paginate-button';
        button.textContent = '跳转';
        button.style.width = '3rem';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const pageNumber = parseInt(input.value);
            if (isNaN(pageNumber) || pageNumber < 1) {
                alert('请输入有效的页码！');
                return;
            }

            const totalPages = getTotalPages();
            if (pageNumber > totalPages) {
                alert(`最大页数为 ${totalPages}`);
                return;
            }

            goToPage(pageNumber);
        });

        jumpContainer.appendChild(input);
        jumpContainer.appendChild(button);
        paginationNav.appendChild(separator);
        paginationNav.appendChild(jumpContainer);

        document.addEventListener('keydown', handleKeyNavigation);
    }

    function getTotalPages() {
        const paginateButtons = document.querySelectorAll('li.paginate-button');
        const totalPagesElement = paginateButtons[paginateButtons.length - 1];
        return totalPagesElement ? parseInt(totalPagesElement.textContent) : 1;
    }

    function goToPage(pageNumber) {
        const pageButtons = document.querySelectorAll('li.paginate-button');
        if (!pageButtons) return;

        const pageMap = new Map();
        pageButtons.forEach((button, index) => {
            const textContent = button.textContent.trim();
            pageMap.set(Number(textContent), index);
        });

        if (pageMap.has(pageNumber)) {
            const targetIndex = pageMap.get(pageNumber);
            pageButtons[targetIndex].click();
        } else {
            alert('未找到对应页码按钮！');
        }
    }

    function handleKeyNavigation(event) {
        const currentActivePage = document.querySelector('li.paginate-button.active');
        if (!currentActivePage) return;

        const currentPageNumber = parseInt(currentActivePage.textContent);
        const totalPages = getTotalPages();

        if (event.key === 'ArrowRight') {
            if (currentPageNumber < totalPages) {
                goToPage(currentPageNumber + 1);
            }
        } else if (event.key === 'ArrowLeft') {
            if (currentPageNumber > 1) {
                goToPage(currentPageNumber - 1);
            }
        }
    }

    waitForElement('.paginate-button', addJumpControls)

})();
