// ==UserScript==
// @name         multi-domain-redirect
// @namespace    https://greasyfork.org/users/1203219
// @author       harutya
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @version      0.0.2
// @description  Bangumi 多域名悬浮跳转
// @downloadURL https://update.greasyfork.org/scripts/481506/multi-domain-redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/481506/multi-domain-redirect.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let isDragging = false;
    let startY;

    // Check if the current window is the top window
    if (window.self != window.top) {
        return;
    }
    createFloatingMenu();

    function createFloatingMenu() {
        const wrapper = document.createElement('div');
        wrapper.id = 'multiDomainMenuWrapper';

        const menu = document.createElement('div');
        menu.id = 'multiDomainMenu';

        // Define the domains and paths
        const domains = {
            'bgm.tv': ['bangumi.tv', 'chii.in'],
            'bangumi.tv': ['chii.in', 'bgm.tv'],
            'chii.in': ['bgm.tv', 'bangumi.tv']
        };

        // Get the current domain
        const currentDomain = window.location.hostname;

        // Create links for other domains
        for (const targetDomain of domains[currentDomain]) {
            const link = document.createElement('a');
            link.href = window.location.href.replace(currentDomain, targetDomain);
            link.textContent = targetDomain;
            link.style.color = '#F09199';
            menu.appendChild(link);
        }

        // Create the Go button
        const goButton = document.createElement('div');
        goButton.id = 'goButton';
        goButton.textContent = 'Go';

        // Load the saved position from GM storage
        const savedPosition = JSON.parse(GM_getValue('multiDomainMenuPosition', '{"top": "40%"}'));
        wrapper.style.top = savedPosition.top;

        // Show menu on hover
        goButton.addEventListener('mouseenter', () => {
            menu.style.display = 'flex';
        });

        // Hide menu when leaving the wrapper
        wrapper.addEventListener('mouseleave', () => {
            menu.style.display = 'none';
        });

        // Handle mouse down event for dragging
        goButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY - wrapper.getBoundingClientRect().top;
        });

        // Handle mouse move event for dragging
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newY = e.clientY - startY;
                wrapper.style.top = Math.max(0, Math.min(newY, window.innerHeight - wrapper.clientHeight)) + 'px';
            }
        });

        // Handle mouse up event for dragging
        document.addEventListener('mouseup', () => {
            isDragging = false;

            // Save the current position to GM storage
            GM_setValue('multiDomainMenuPosition', JSON.stringify({ top: wrapper.style.top }));
        });

        wrapper.appendChild(goButton);
        wrapper.appendChild(menu);
        document.body.appendChild(wrapper);

        // Hide menu initially
        menu.style.display = 'none';

        // Add click event to Go button
        goButton.addEventListener('click', () => {
            // Find the first link inside the menu and navigate to it
            const firstLink = menu.querySelector('a');
            if (firstLink) {
                window.location.href = firstLink.href;
            }
        });
    }

    // Add styles to head
    const style = document.createElement('style');
    style.textContent = `
        #multiDomainMenuWrapper {
            position: fixed;
            top: 40%;
            left: 0;
            transform: translateY(-50%);
            z-index: 9999;
            cursor: pointer;
        }

        #multiDomainMenu {
            display: none;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            position: absolute;
            top: 100%;
            left: 0;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        }

        #multiDomainMenu a {
            text-decoration: none;
            padding: 3px;
        }

        #goButton {
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 5px;
            background-color: #fff;
            color: #F09199;
        }
    `;

    document.head.appendChild(style);
})();