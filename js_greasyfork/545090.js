// ==UserScript==
// @name         GP2-Revived Full (Mobile Enhanced)
// @namespace    https://2.gangsterparadise.co.uk
// @version      6.5
// @description  Full GP2 revamp with integrated mobile support and QoL improvements (no dark mode)
// @author       null
// @match        https://2.gangsterparadise.co.uk/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545090/GP2-Revived%20Full%20%28Mobile%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545090/GP2-Revived%20Full%20%28Mobile%20Enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to apply responsive styles to the iframe's content
    const applyIframeStyles = () => {
        const iframe = document.getElementById('mainFrame');
        if (iframe && iframe.contentDocument) {
            const iframeDoc = iframe.contentDocument;
            const style = iframeDoc.createElement('style');
            style.textContent = `
                body {
                    word-wrap: break-word;
                    overflow-x: hidden;
                    font-size: clamp(10px, 2.5vw, 14px) !important;
                }
                /* This is the key fix: force all elements to respect the viewport */
                * {
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                /* Override hardcoded widths on tables, images, and other elements */
                table, img, iframe {
                    width: 100% !important;
                    height: auto !important;
                }
                /* Ensure tables are horizontally scrollable without breaking layout */
                .responsive-table-container {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch; /* For smoother scrolling on iOS */
                }
                /* Revert table styling to allow normal display within the container */
                table {
                    display: table !important;
                    min-width: 100%;
                }
            `;
            iframeDoc.head.appendChild(style);

            // Wrap tables in a container for horizontal scrolling
            const tables = iframeDoc.querySelectorAll('table');
            tables.forEach(table => {
                // Check if the table's content is wider than the parent
                if (table.scrollWidth > table.clientWidth) {
                    const wrapper = iframeDoc.createElement('div');
                    wrapper.className = 'responsive-table-container';
                    table.parentNode.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                }
            });
        }
    };

    // Function to dynamically adjust the layout based on the stats bar height
    const adjustLayout = () => {
        const statsBar = document.getElementById('stats');
        const iframe = document.getElementById('mainFrame');
        const navMenu = document.getElementById('nav2');
        const hamburger = document.getElementById('gp2-hamburger-toggle');
        const fabContainer = document.getElementById('gp2-fab-container');

        if (statsBar && iframe && navMenu && hamburger && fabContainer) {
            const statsHeight = statsBar.offsetHeight;

            iframe.style.top = `${statsHeight}px`;
            iframe.style.height = `calc(100vh - ${statsHeight}px)`;

            // Adjust nav menu and hamburger button position based on stats bar height
            navMenu.style.paddingTop = `${statsHeight}px`;
            hamburger.style.top = `calc(${statsHeight/2}px - 14px)`; // Center hamburger button vertically
        }
    };

    const initializeTheme = () => {
        // Inject mobile meta tag
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
        document.head.appendChild(meta);

        // Inject responsive and mobile-friendly styles for the main page
        const style = document.createElement('style');
        style.textContent = `
            /* Single fluid layout for all devices */
            html, body {
                max-width: 100vw;
                overflow-x: hidden !important;
                height: 100vh;
                margin: 0;
                padding: 0;
            }
            body {
                display: flex;
                flex-direction: column;
            }
            body.menu-open {
                overflow: hidden !important;
            }
            #options, #logo, #gpbar, #clock {
                display: none !important;
            }
            #gp2-hamburger-toggle {
                position: fixed;
                left: 10px;
                z-index: 10001;
                background: #000;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                transition: transform 0.3s ease;
                display: block;
            }
            #nav2 {
                position: fixed;
                top: 0;
                left: -250px;
                width: 250px;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                z-index: 10000;
                box-shadow: 2px 0 5px rgba(0,0,0,0.5);
                transition: left 0.3s ease;
                overflow-y: auto;
                margin-top: 0 !important;
            }
            #nav2.open {
                left: 0;
            }

            #stats {
                width: 100% !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                min-height: 40px;
                height: auto;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.75) !important;
                background-image: none !important;
                border-radius: 0 0 10px 10px !important;
                padding: 5px !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
                z-index: 10002;
            }
            #stats table, #stats td, #stats th {
                display: contents;
                width: auto !important;
            }

            #iframe, #mainFrame {
                position: fixed !important;
                left: 0 !important;
                width: 100% !important;
                flex-grow: 1;
                overflow-y: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-sizing: border-box;
                z-index: 2;
            }

            body, td, tr {
                font-size: clamp(10px, 2.5vw, 14px) !important;
                box-sizing: border-box;
            }
            #gp2-fab-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            #gp2-fab-container button {
                background: #111;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                cursor: pointer;
            }

            /* --- Custom Dark Scrollbar Styles --- */
            /* For WebKit browsers (Chrome, Safari) */
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #333;
            }
            ::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #888;
            }
        `;
        document.head.appendChild(style);

        // This check ensures the hamburger button is only added to the main window
        if (window.top === window.self) {
            // Hamburger menu toggle button
            const toggle = document.createElement('button');
            toggle.innerText = '☰';
            toggle.id = 'gp2-hamburger-toggle';
            document.body.appendChild(toggle);

            // Add event listener for the toggle
            toggle.onclick = () => {
                const nav = document.getElementById('nav2');
                nav.classList.toggle('open');
                toggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            };

            // Floating action buttons
            const fabContainer = document.createElement('div');
            fabContainer.id = 'gp2-fab-container';

            const topBtn = document.createElement('button');
            topBtn.innerText = '⬆';
            topBtn.title = 'Scroll to Top';
            topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

            fabContainer.appendChild(topBtn);
            document.body.appendChild(fabContainer);
        }
    };

    // We use a MutationObserver to watch for changes to the stats bar's height.
    // This handles cases where the content changes dynamically.
    const statsObserver = new MutationObserver(adjustLayout);
    const statsBar = document.getElementById('stats');
    if (statsBar) {
        statsObserver.observe(statsBar, { attributes: true, childList: true, subtree: true });
    }

    // This code ensures the problematic mousewheel function is disabled.
    window.addEventListener('load', () => {
        if (typeof unsafeWindow.$ !== 'undefined' && typeof unsafeWindow.$.fn.mousewheel === 'function') {
            unsafeWindow.$('#nav2').off('mousewheel');
        }
    });

    // We now listen for the iframe to load, and then apply our styles and adjust the layout.
    const iframe = document.getElementById('mainFrame');
    if (iframe) {
        iframe.addEventListener('load', () => {
            applyIframeStyles();
            adjustLayout();
        });
    }

    // Listen for window resize to adjust layout
    window.addEventListener('resize', adjustLayout);

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeTheme();
            adjustLayout();
        });
    } else {
        initializeTheme();
        adjustLayout();
    }
})();