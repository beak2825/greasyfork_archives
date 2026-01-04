// ==UserScript==
// @name         Add article menu item
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  This user script will add menu options to to each article in BuildWise.
// @author       saikiran.dannana@buildwise.ai
// @match        *://*.buildwise.ai/*
// @icon         https://images.buildwise.ai/BuildWise_logo_without_name.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520554/Add%20article%20menu%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/520554/Add%20article%20menu%20item.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add event listeners to article menu buttons
    function setupMenuButtonListeners() {
        const menuButtons = document.querySelectorAll('.article-menu-btn');
        menuButtons.forEach(button => {
            if (!button.dataset.listenerAdded) {
                button.addEventListener('click', onMenuButtonClick);
                button.dataset.listenerAdded = true;
            }
        });
    }

    // Find element by class and text
    function getElementByText(className, textContent) {
        return Array.from(document.querySelectorAll(`.${className}`)).find(
            el => el.textContent.trim() === textContent
        );
    }

    // Handle menu button click
    function onMenuButtonClick() {
        setTimeout(() => {
            const menuContainer = document.getElementById('menu-list-container');
            const menuItemTemplate = document.querySelector('.menu-list-item');

            if (!menuContainer || !menuItemTemplate) return;

            const newItems = [
                {
                    icon: `
                        <svg width="17" height="17" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.44019 2.97528C4.7482 3.04007 4.12246 3.25208 3.58948 3.60544C3.37011 3.74973 3.22435 3.86898 3.03147 4.06186C2.5353 4.5595 2.18931 5.22352 2.03913 5.96998C1.9449 6.43524 1.95226 5.89784 1.94637 12.4261C1.94343 16.7297 1.94637 18.417 1.95815 18.5878C2.01263 19.3475 2.23495 20.0306 2.61039 20.5901C2.80768 20.8831 3.12718 21.2247 3.3863 21.4176C3.94873 21.8387 4.61569 22.0963 5.35921 22.1802C5.65368 22.2126 18.4953 22.2141 18.8015 22.1802C19.5347 22.1022 20.1884 21.8563 20.7243 21.4588C21.5003 20.8816 21.9861 20.0645 22.1569 19.0442C22.2143 18.7041 22.2173 18.5745 22.2173 16.7945V15.0616L19.8822 15.0645L17.5486 15.0689L16.5282 16.8136L15.5079 18.5583H12.0067H8.50556L6.75644 15.5695L5.00586 12.5822L5.04119 12.5218C5.07653 12.4614 7.8813 7.6661 8.28471 6.97852L8.50409 6.60308H12.0067H15.5094L16.5268 8.34778L17.5441 10.0925L19.8807 10.0969L22.2173 10.0998V8.40078C22.2173 6.65314 22.2129 6.48235 22.1569 6.14224C22.0185 5.2986 21.6799 4.61839 21.1204 4.05597C20.5948 3.5274 19.9543 3.19466 19.1681 3.04007C18.7352 2.95614 19.1048 2.95909 12.0583 2.96203C8.49084 2.96203 5.51381 2.96792 5.44019 2.97528Z" fill="black"/>
                            <path d="M10.2356 9.27804C10.2194 9.30454 9.83067 9.99212 9.37131 10.8063C8.91195 11.6205 8.49675 12.3522 8.45111 12.4332L8.36719 12.5819L9.31094 14.1779L10.2547 15.7754H12.1525H14.0503L14.9764 14.2074C15.4859 13.3446 15.9099 12.6246 15.9187 12.6084C15.932 12.5805 15.8009 12.3419 14.9882 10.9035L14.043 9.23093H12.154H10.265L10.2356 9.27804Z" fill="#EC5F2A"/>
                        </svg>
                    `,
                    label: 'Send to Procore'
                }
            ];

            const targetItem = getElementByText('menu-list-item', 'Bookmark');

            newItems.forEach(({ icon, label }) => {
                const newItem = menuItemTemplate.cloneNode(true);

                const svgElement = newItem.querySelector('svg');
                if (svgElement) svgElement.outerHTML = icon;

                const textElement = newItem.querySelector('.menu-item-title');
                if (textElement) textElement.textContent = label;

                if (targetItem?.nextSibling) {
                    menuContainer.insertBefore(newItem, targetItem.nextSibling);
                } else {
                    menuContainer.appendChild(newItem);
                }

                newItem.addEventListener('click', onNewMenuItemClick);
            });
        }, 0);
    }

    // Show full-screen modal with image
    function showImageModal(imageUrl, onClose) {
        const modalOverlay = document.createElement('div');
        Object.assign(modalOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '99999999',
            padding: '64px 0'
        });

        const modalImage = document.createElement('img');
        modalImage.src = imageUrl;
        Object.assign(modalImage.style, {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px'
        });

        modalOverlay.appendChild(modalImage);

        modalOverlay.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
            if (onClose) onClose();
        });

        document.body.appendChild(modalOverlay);
    }

    // Handle new menu item click
    function onNewMenuItemClick(event) {
        event.preventDefault();
        showImageModal(
            'https://d3bg16e6fimkd7.cloudfront.net/Screenshot+2024-12-16+at+12.27.36%E2%80%AFPM.png',
            createTaskInProcore
        );
    }

    // Create task in Procore
    function createTaskInProcore() {
        const token = JSON.parse(localStorage.getItem('bwAuthStorage'));
        if (!token?.state?.accessToken) {
            console.error('Access token not found');
            return;
        }

        fetch('https://app.buildwise.ai/v1/api/procore/company/29274/project/1039305/task', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.state.accessToken}`
            }
        })
        .then(response => response.ok ? response.json() : Promise.reject('API call failed'))
        .then(data => console.log('API response:', data))
        .catch(error => console.error('Error:', error));
    }

    // Monitor DOM changes
    const observer = new MutationObserver(setupMenuButtonListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    setupMenuButtonListeners();
})();