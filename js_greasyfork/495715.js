// ==UserScript==
// @name         Twitter Image to SauceNAO
// @namespace    http://yourwebsite.com
// @version      3.2
// @description  Adds a button to convert Twitter image URLs to SauceNAO search URLs. Instantly searches for single image tweets, and shows a dropdown for multiple images.
// @author       FunkyJustin
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495715/Twitter%20Image%20to%20SauceNAO.user.js
// @updateURL https://update.greasyfork.org/scripts/495715/Twitter%20Image%20to%20SauceNAO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToSauceNAOUrl(imageUrl) {
        const encodedUrl = encodeURIComponent(imageUrl);
        return `https://saucenao.com/search.php?url=${encodedUrl}`;
    }

    function createSauceNAODropdown(imageUrls, button) {
        const dropdown = document.createElement('div');
        dropdown.className = 'saucenao-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.zIndex = '10000';
        dropdown.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.padding = '4px';
        dropdown.style.fontSize = '14px';

        imageUrls.forEach((imageUrl, index) => {
            const menuItem = document.createElement('div');
            menuItem.style.padding = '8px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.color = '#000';
            menuItem.innerText = `Search Image ${index + 1}`;

            menuItem.addEventListener('click', () => {
                const saucenaoUrl = convertToSauceNAOUrl(imageUrl);
                window.open(saucenaoUrl, '_blank');
                dropdown.remove();
            });

            dropdown.appendChild(menuItem);
        });

        const searchAllItem = document.createElement('div');
        searchAllItem.style.padding = '8px';
        searchAllItem.style.cursor = 'pointer';
        searchAllItem.style.color = '#000';
        searchAllItem.innerText = 'Search All Images';

        searchAllItem.addEventListener('click', () => {
            imageUrls.forEach(imageUrl => {
                const saucenaoUrl = convertToSauceNAOUrl(imageUrl);
                window.open(saucenaoUrl, '_blank');
            });
            dropdown.remove();
        });

        dropdown.appendChild(searchAllItem);

        button.parentNode.style.position = 'relative';
        button.parentNode.appendChild(dropdown);

        const buttonRect = button.getBoundingClientRect();
        dropdown.style.bottom = `${button.offsetTop}px`;
        dropdown.style.left = `${button.offsetLeft}px`;

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target) && event.target !== button) {
                dropdown.remove();
            }
        }, { once: true });

        return dropdown;
    }

    function addSauceNAOBtn() {
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            const images = article.querySelectorAll('img[src*="pbs.twimg.com/media"]');
            const imageUrls = Array.from(images).map(img => img.src);

            if (imageUrls.length > 0) {
                const container = article.querySelector('div[role="group"]');

                if (container) {
                    const existingButton = container.querySelector('.saucenao-button');
                    if (!existingButton) {
                        const button = document.createElement('div');
                        button.className = 'saucenao-button';
                        button.style.display = 'inline-block';
                        button.style.marginLeft = '8px';
                        button.style.cursor = 'pointer';
                        button.style.color = 'rgb(29, 155, 240)';

                        button.innerText = 'SauceNAO';

                        const dropdownIcon = document.createElement('span');
                        dropdownIcon.innerText = ' ▼';  // Dropdown icon
                        dropdownIcon.style.display = imageUrls.length > 1 ? 'inline' : 'none';  // Show only if multiple images

                        button.appendChild(dropdownIcon);  // Add the icon to the button

                        button.addEventListener('click', (event) => {
                            event.stopPropagation();
                            event.preventDefault();

                            if (imageUrls.length === 1) {
                                const saucenaoUrl = convertToSauceNAOUrl(imageUrls[0]);
                                window.open(saucenaoUrl, '_blank');
                            } else {
                                document.querySelectorAll('.saucenao-dropdown').forEach(el => el.remove());
                                createSauceNAODropdown(imageUrls, button);
                            }
                        });

                        container.appendChild(button);
                    }
                }
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            addSauceNAOBtn();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addSauceNAOBtn();
})();
