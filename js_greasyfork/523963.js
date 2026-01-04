// ==UserScript==
// @name         Add Following, Trash, and Profile Menu Items to Suno AI
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Add 'Following', 'Trash', and 'Profile' menu items to the Suno AI navigation column
// @author       SST (via ChatGPT)
// @license      MIT
// @match        https://suno.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523963/Add%20Following%2C%20Trash%2C%20and%20Profile%20Menu%20Items%20to%20Suno%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/523963/Add%20Following%2C%20Trash%2C%20and%20Profile%20Menu%20Items%20to%20Suno%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVGs for icons with inline styles
    const followingSvg = '<svg style="height: 1em; width: 1em;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4zm2 2v2h3v3h2v-3h3v-2h-3V7h-2v3h-3zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z"></path></svg>';
    const trashSvg = '<svg style="height: 0.8em; width: 1em;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>';
    const profileSvg = '<svg style="height: 0.85em; width: 1em;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"/><path fill="currentColor" d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"/></svg>';

    // Function to add new menu items
    function addMenuItems() {
        // Create the 'Following' menu item
        let followingItem = document.createElement('a');
        followingItem.href = '/feed';
        followingItem.innerHTML = `<div class="relative w-full flex flex-row items-center justify-left gap-2 py-2 pl-10 font-sans font-medium text-base/5 before:block before:absolute before:inset-y-2 before:left-0 before:w-1 before:bg-primary before:origin-left before:opacity-50 before:scale-x-0 before:transition-transform before:duration-200 cursor-pointer text-secondary hover:text-primary hover:before:scale-x-100 hover:before:bg-primary hover:before:opacity-50">${followingSvg} Following</div>`;

        // Create the 'Trash' menu item
        let trashItem = document.createElement('a');
        trashItem.href = '/me/trash';
        trashItem.innerHTML = `<div class="relative w-full flex flex-row items-center justify-left gap-2 py-2 pl-10 font-sans font-medium text-base/5 before:block before:absolute before:inset-y-2 before:left-0 before:w-1 before:bg-primary before:origin-left before:opacity-50 before:scale-x-0 before:transition-transform before:duration-200 cursor-pointer text-secondary hover:text-primary hover:before:scale-x-100 hover:before:bg-primary hover:before:opacity-50">${trashSvg} Trash</div>`;

        // Create the 'Profile' menu item
        let profileItem = document.createElement('a');
        profileItem.href = 'https://suno.com/@sixstringtoker';
        profileItem.innerHTML = `<div class="relative w-full flex flex-row items-center justify-left gap-2 py-2 pl-10 font-sans font-medium text-base/5 before:block before:absolute before:inset-y-2 before:left-0 before:w-1 before:bg-primary before:origin-left before:opacity-50 before:scale-x-0 before:transition-transform before:duration-200 cursor-pointer text-secondary hover:text-primary hover:before:scale-x-100 hover:before:bg-primary hover:before:opacity-50">${profileSvg} Profile</div>`;

        // Find the menu item that links to "Library" and insert 'Following' below it
        let libraryItem = document.querySelector('a[href="/me"]');
        if (libraryItem) {
            if (!document.querySelector('a[href="/feed"]')) {
                libraryItem.parentNode.insertBefore(followingItem, libraryItem.nextSibling);
            }
        }

        // Insert 'Trash' below the Search menu item
        let searchItem = document.querySelector('a[href="/search"]');
        if (searchItem) {
            if (!document.querySelector('a[href="/me/trash"]')) {
                searchItem.parentNode.insertBefore(trashItem, searchItem.nextSibling);
            }
        }

        // Insert 'Profile' above 'Create'
        let createItem = document.querySelector('a[href="/create"]');
        if (createItem) {
            if (!document.querySelector('a[href="https://suno.com/@sixstringtoker"]')) {
                createItem.parentNode.insertBefore(profileItem, createItem);
            }
        }
    }

    // Use MutationObserver to ensure the menu items are added even after the page loads
    const observer = new MutationObserver(addMenuItems);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add the menu items
    addMenuItems();
})();
