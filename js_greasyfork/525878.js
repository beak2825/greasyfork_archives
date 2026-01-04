// ==UserScript==
// @name         Navigation Menu ⭐ClopoStars⭐
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  A simple script to enhance the ClopoStars.com navigation menu for a smoother, more intuitive experience.This script is shared with the hope that it helps, but please remember—use it at your own risk. I’m not responsible for any unexpected issues, data loss, or account problems. Tinker wisely, stay safe, and happy browsing!
// @author       ChatGPT-4-turbo
// @match        https://clopostars.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525878/Navigation%20Menu%20%E2%AD%90ClopoStars%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/525878/Navigation%20Menu%20%E2%AD%90ClopoStars%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[ClopoStars Nav Menu] Script initialized.');

    GM_addStyle(`
    .marketplace-menu-btn:hover {
        color: rgb(78, 253, 107) !important;
    }`);

    const menus = [
        {
            name: 'MY BASE',
            selector: '.dropdown-base ul',
            items: [
                { name: 'My Cards', url: 'https://clopostars.com/base', icon: '../../../../assets/icons/heroicons/outline/credit-card.svg' },
                { name: 'My Profile', url: 'https://clopostars.com/base/profile', icon: '../../../../assets/icons/heroicons/outline/user-circle.svg' }
            ]
        },
        {
            name: 'COMPETITIONS',
            selector: '.dropdown-competition ul',
            items: [
                { name: 'UpComing', url: 'https://clopostars.com/competitions/upcoming', icon: '../../../../assets/icons/heroicons/outline/forward.svg' },
                { name: 'In Progress', url: 'https://clopostars.com/competitions/progress', icon: '../../../../assets/icons/heroicons/outline/cupe-transparent.svg' },
                { name: 'Finished', url: 'https://clopostars.com/competitions/finished', icon: '../../../../assets/icons/heroicons/outline/check.svg' }
            ]
        },
        {
            name: 'RIVALS',
            selector: '.dropdown-competition ul',
            findByText: 'RIVALS',
            items: [
                { name: 'UpComing', url: 'https://clopostars.com/rivals/upcoming', icon: '../../../../assets/icons/heroicons/outline/forward.svg' },
                { name: 'In Progress', url: 'https://clopostars.com/rivals/progress', icon: '../../../../assets/icons/heroicons/outline/forward.svg' },
                { name: 'Finished', url: 'https://clopostars.com/rivals/finished', icon: '../../../../assets/icons/heroicons/outline/forward.svg' },
                { name: 'My Stats', url: 'https://clopostars.com/rivals/my-stats', icon: '../../../../assets/icons/heroicons/outline/forward.svg' }
            ]
        },
        {
            name: 'ALLIES',
            selector: '.dropdown-allies ul',
            items: [
                { name: 'Prestige ranking', url: 'https://clopostars.com/allies/prestige', icon: '../../../../assets/icons/heroicons/outline/academic-cap.svg' },
                { name: 'Cards', url: 'https://clopostars.com/allies/cards', icon: '../../../../assets/icons/heroicons/outline/swatch.svg' },
                { name: 'Yesterday Scores', url: 'https://clopostars.com/allies/yesterday-scores', icon: '../../../../assets/icons/heroicons/outline/swatch.svg' },
                { name: 'Statistics', url: 'https://clopostars.com/allies/statistics', icon: '../../../../assets/icons/heroicons/outline/swatch.svg' },
                { name: 'Card Comparison', url: 'https://clopostars.com/allies/cards-comparison', icon: '../../../../assets/icons/heroicons/outline/swatch.svg' },
                { name: 'Help', url: 'https://clopostars.com/allies/help', icon: '../../../../assets/icons/heroicons/outline/question-mark-circle.svg' }
            ]
        },
        {
            name: 'SHOP',
            selector: '.dropdown-base ul',
            findByText: 'SHOP',
            items: [
                { name: 'Offers', url: 'https://clopostars.com/shop/offers', icon: '../../../../assets/icons/heroicons/outline/shopping-bag.svg' }
            ]
        }
    ];

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    function initializeMenus() {
        console.log('[ClopoStars Nav Menu] Initializing menus...');

        menus.forEach(menu => {
            const menuElement = menu.findByText
                ? [...document.querySelectorAll('.dropdown-nav')].find(nav => nav.textContent.includes(menu.findByText))?.querySelector(menu.selector)
                : document.querySelector(menu.selector);

            if (menuElement) {
                console.log(`[ClopoStars Nav Menu] Populating menu: ${menu.name}`);
                menuElement.innerHTML = '';

                menu.items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'flex font-semibold text-gray-600';
                    li.innerHTML = `
                        <div class="dropdown relative flex w-full">
                            <a href="${item.url}" class="mx-3 flex w-full items-center justify-start rounded-md py-2 px-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-primary-500">
                                <span class="mr-2 text-gray-400">
                                    <img src="${item.icon}" class="w-5 h-5">
                                </span>
                                <span class="ml-1">${item.name}</span>
                            </a>
                        </div>
                    `;
                    menuElement.appendChild(li);
                });
            } else {
                console.log(`[ClopoStars Nav Menu] Menu not found: ${menu.name}`);
            }
        });

        const marketplaceMenu = [...document.querySelectorAll('.dropdown')]
        .find(nav => nav.textContent.includes('MARKETPLACE'));

        if (marketplaceMenu) {
            console.log('[ClopoStars Nav Menu] Setting up MARKETPLACE menu.');

            const referenceMenu = document.querySelector('.dropdown-nav button');
            const computedStyles = referenceMenu ? window.getComputedStyle(referenceMenu) : null;

            const wrapper = document.createElement('div');
            wrapper.className = 'dropdown-nav relative inline-block';

            const link = document.createElement('a');
            link.href = 'https://clopostars.com/market';
            link.className = 'menu-btn text-gray-600 hover:text-primary-500 marketplace-menu-btn'; // Add custom class
            link.innerHTML = '<span>MARKETPLACE</span>';

            if (computedStyles) {
                link.style.height = computedStyles.height;
                link.style.padding = computedStyles.padding;
                link.style.margin = computedStyles.margin;
                link.style.fontSize = computedStyles.fontSize;
                link.style.display = computedStyles.display;
                link.style.alignItems = computedStyles.alignItems;
                link.style.justifyContent = computedStyles.justifyContent;
                link.style.textDecoration = computedStyles.textDecoration;
                link.style.cursor = computedStyles.cursor;
            }

            link.setAttribute('target', '_self');
            link.setAttribute('rel', 'noopener noreferrer');
            link.addEventListener('click', function(event) {
                if (event.ctrlKey || event.metaKey || event.button === 1) {
                    event.preventDefault();
                    window.open(link.href, '_blank');
                }
            });

            wrapper.appendChild(link);
            marketplaceMenu.innerHTML = '';
            marketplaceMenu.appendChild(wrapper);
        } else {
            console.log('[ClopoStars Nav Menu] MARKETPLACE menu not found.');
        }

    }

    waitForElement('.dropdown-nav', initializeMenus);
})();