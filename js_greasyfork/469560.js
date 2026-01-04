// ==UserScript==
// @name         Navigate chat groups
// @namespace    http://www.github.com/awyugan
// @version      0.3
// @description  Navigate through chat groups with even conversation IDs
// @author       awyugan
// @match        https://42share.io/gpt/*
// @match        https://42share.com/gpt/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469560/Navigate%20chat%20groups.user.js
// @updateURL https://update.greasyfork.org/scripts/469560/Navigate%20chat%20groups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let groups = [];
    let currentGroupIndex = 0;
    let groupSelector = '.relative.mx-auto.max-w-screen-xl.dark\\:text-gray-100.text-gray-700.w-full.px-4.py-10';

    function updateGroups() {
        groups = Array.from(document.querySelectorAll(groupSelector)).filter((group, index) => index % 2 === 0);
        currentGroupIndex = 0;
    }

    function navigateToPreviousGroups() {
        if (currentGroupIndex >= 2) {
            currentGroupIndex -= 2;
            groups[currentGroupIndex].scrollIntoView();
        } else if (currentGroupIndex === 1) {
            currentGroupIndex = 0;
            groups[currentGroupIndex].scrollIntoView();
        } else {
            scrollPreviousPage();
        }
    }

    function navigateToNextGroups() {
        if (currentGroupIndex < groups.length - 2) {
            currentGroupIndex += 2;
            groups[currentGroupIndex].scrollIntoView();
        } else if (currentGroupIndex === groups.length - 2) {
            currentGroupIndex = groups.length - 1;
            groups[currentGroupIndex].scrollIntoView();
        } else {
            scrollNextPage();
        }
    }

    function scrollNextPage() {
        window.scrollBy(0, window.innerHeight);
    }

    function scrollPreviousPage() {
        window.scrollBy(0, -window.innerHeight);
    }

    let previousArrow = document.createElement('div');
    previousArrow.innerHTML = '&#x25B2;';
    previousArrow.className = 'navigate-groups-arrow navigate-groups-arrow-previous';
    previousArrow.addEventListener('click', navigateToPreviousGroups);
    document.body.appendChild(previousArrow);

    let nextArrow = document.createElement('div');
    nextArrow.innerHTML = '&#x25BC;';
    nextArrow.className = 'navigate-groups-arrow navigate-groups-arrow-next';
    nextArrow.addEventListener('click', navigateToNextGroups);
    document.body.appendChild(nextArrow);

    let groupObserver = new MutationObserver(updateGroups);
    let targetNode = document.body;
    let config = { childList: true, subtree: true };

    groupObserver.observe(targetNode, config);

    updateGroups();

    GM_addStyle(`
        .navigate-groups-arrow {
            position: fixed;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .navigate-groups-arrow:hover {
            background-color: #f5f5f5;
        }

        .navigate-groups-arrow-previous {
            bottom: 70px;
            right: 30px;
            font-size: 24px;
        }

        .navigate-groups-arrow-next {
            bottom: 20px;
            right: 30px;
            font-size: 24px;
        }
    `);

    // 禁用复制按钮的复制功能
    let copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.addEventListener('mousedown', function(event) {
            event.preventDefault();
        });
    }
})();
