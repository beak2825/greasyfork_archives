// ==UserScript==
// @name         Reddit Sidebar and Subgrid Adjustment
// @version      1.3
// @description  Replace Reddit's navbar menu button with a custom hamburger menu, and adjust layout accordingly
// @author       sj-jason
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-end
// @license      MIT 
// @namespace https://greasyfork.org/users/1359671
// @downloadURL https://update.greasyfork.org/scripts/505717/Reddit%20Sidebar%20and%20Subgrid%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/505717/Reddit%20Sidebar%20and%20Subgrid%20Adjustment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and insert the hamburger menu
    function createHamburgerMenu() {
        const hamburger = document.createElement('div');
        hamburger.id = 'custom-hamburger';
        hamburger.innerHTML = `
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #custom-hamburger {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 20px;
                position: absolute;
                top: 10px;
                z-index: 1000;
                background-color: transparent;
            }
            #custom-hamburger .bar {
                width: 30px;
                height: 4px;
                background-color: #fff;
                margin: 3px 0;
                transition: 0.3s;
            }
            #custom-hamburger.open .bar:nth-child(1) {
                transform: rotate(45deg);
                margin: 0;
            }
            #custom-hamburger.open .bar:nth-child(2) {
                opacity: 0;
            }
            #custom-hamburger.open .bar:nth-child(3) {
                transform: rotate(-45deg);
                margin: 0;
            }
        `;
        document.head.appendChild(style);

        const targetElement = document.querySelector('#reddit-logo > span.hidden.s\\:flex.items-center > svg');
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            hamburger.style.left = `${rect.right + window.scrollX + 10}px`;
            hamburger.style.top = `${rect.top + window.scrollY}px`;

            document.body.appendChild(hamburger);

            hamburger.addEventListener('click', () => {
                const sidebar = document.querySelector('#left-sidebar');
                const sidebarContainer = document.querySelector('#left-sidebar-container');
                const subgrid = document.querySelector('.subgrid-container');
                const mainContainer = document.querySelector('.main-container');

                if (sidebar && sidebarContainer) {
                    const isHidden = sidebar.classList.toggle('hidden');
                    sidebarContainer.classList.toggle('hidden', isHidden);

                    // Trigger reflow to apply style changes
                    document.body.offsetHeight;

                    if (mainContainer) {
                        mainContainer.classList.toggle('expanded', isHidden);
                    }
                }
                if (subgrid) {
                    subgrid.classList.toggle('expanded');
                }
                hamburger.classList.toggle('open');
            });
        }
    }

    // Function to remove the existing navbar menu button
    function removeExistingNavbarButton() {
        const existingButton = document.querySelector('#navbar-menu-button');
        if (existingButton) {
            existingButton.remove();
        }
    }

    // Add CSS for handling the sidebar and adjusting the layout
    const sidebarStyle = document.createElement('style');
    sidebarStyle.textContent = `
        #left-sidebar.hidden,
        #left-sidebar-container.hidden {
            display: none !important;
        }
        .subgrid-container.expanded,
        .main-container.expanded {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
        }
        .main-container.expanded {
            width: calc(100% - 272px) !important;
            max-width: calc(100% - 272px) !important;
        }
        .subgrid-container {
            width: calc(100vw - 272px) !important;
            max-width: calc(100vw - 272px) !important;
        }
        .main-container {
            justify-content: center !important;
        }
        #main-content {
            max-width: calc(100% - 1rem - 316px) !important;
        }
        #right-sidebar-container:has(> aside) {
            display: none !important;
        }
        #main-content:has(+ #right-sidebar-container > aside) {
            max-width: 100% !important;
        }
        #main-content [slot='post-media-container'] shreddit-aspect-ratio {
            --max-height: min(100%, /*[[cardHeight]]*/) !important;
        }
        #main-content [slot='post-media-container'] gallery-carousel ul > li {
            width: auto !important;
        }
        #site-header {
            width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
    `;
    document.head.appendChild(sidebarStyle);

    // Initialize script after page load
    window.addEventListener('load', () => {
        createHamburgerMenu();
        removeExistingNavbarButton();
    });
})();
