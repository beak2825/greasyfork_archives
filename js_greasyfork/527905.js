// ==UserScript==
// @name         Cubox beta版网站开启深色模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为beta版的cubox开启深色模式，右下角可以选择切换浅色/深色。
// @author       Lapis0x0
// @match        https://beta.cubox.pro/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527905/Cubox%20beta%E7%89%88%E7%BD%91%E7%AB%99%E5%BC%80%E5%90%AF%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/527905/Cubox%20beta%E7%89%88%E7%BD%91%E7%AB%99%E5%BC%80%E5%90%AF%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeStyles = `
        /* Base colors */
        :root {
            --dark-bg: #1a1a1a;
            --dark-bg-secondary: #262626;
            --dark-content: #e0e0e0;
            --dark-content-light: #a0a0a0;
            --dark-border: #404040;
            --brand-theme: #4554FF;
        }

        /* Body and main containers */
        body,
        #root,
        .bg-white,
        .bg-gray-1 {
            background-color: var(--dark-bg) !important;
            color: var(--dark-content) !important;
        }

        /* Cards and containers */
        .shadow-sm-card,
        .shadow-md-card {
            background-color: var(--dark-bg-secondary) !important;
            border-color: var(--dark-border) !important;
        }

        /* Text colors */
        .text-content-heavy,
        .text-content-normal,
        .text-14px,
        .text-12px {
            color: var(--dark-content) !important;
        }

        /* Title text in header */
        .text-seo6UG[data-name="Text"] {
            color: #FFFFFF !important;
        }

        /* Header dropdown arrow */
        .flex[aria-haspopup="menu"] svg path[stroke="#191919"] {
            stroke: #FFFFFF !important;
        }

        .text-content-light {
            color: var(--dark-content-light) !important;
        }

        /* Borders */
        .border-gray-3,
        .border-brand-aura-deeper,
        [class*="border-"] {
            border-color: var(--dark-border) !important;
        }

        /* Hover states */
        .hover\:bg-gray-2:hover,
        .hover\:bg-gray-3:hover,
        .hover\:bg-gray-4:hover {
            background-color: var(--dark-bg-secondary) !important;
        }

        /* Icons */
        svg[stroke="#191919"] {
            stroke: var(--dark-content) !important;
        }

        svg[fill="#191919"] {
            fill: var(--dark-content) !important;
        }

        /* Special elements */
        .rounded-6px.bg-gray-3 {
            background-color: var(--dark-bg-secondary) !important;
        }

        /* Divider lines */
        .h-1px.bg-gray-3 {
            background-color: var(--dark-border) !important;
            opacity: 0.5;
        }

        /* Keep brand colors */
        .bg-brand-theme {
            background-color: var(--brand-theme) !important;
        }

        /* Image adjustments */
        img {
            opacity: 0.9;
        }
    `;

    // Create and inject stylesheet
    const styleElement = document.createElement('style');
    styleElement.textContent = darkModeStyles;
    document.head.appendChild(styleElement);

    // Remove Beta badge
    function removeBetaBadge() {
        const betaBadge = document.querySelector('div.rounded-4px.px-4px[style*="background: rgb(237, 237, 237)"]');
        if (betaBadge) {
            betaBadge.remove();
        }
    }

    // Initial removal
    removeBetaBadge();

    // Also remove on dynamic content changes
    const observer = new MutationObserver(removeBetaBadge);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add dark mode toggle button
    const toggleContainer = document.createElement('div');
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🌓';

    toggleContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        transition: all 0.3s ease;
    `;

    toggleButton.style.cssText = `
        width: 32px;
        height: 32px;
        background: #4554FF;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.3;
        transition: all 0.3s ease;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    toggleContainer.appendChild(toggleButton);

    // Hover effects
    toggleContainer.addEventListener('mouseenter', () => {
        toggleButton.style.opacity = '1';
        toggleButton.style.width = '120px';
        toggleButton.style.borderRadius = '16px';
        toggleButton.innerHTML = isDarkMode ? 'Dark Mode On' : 'Dark Mode Off';
    });

    toggleContainer.addEventListener('mouseleave', () => {
        toggleButton.style.opacity = '0.3';
        toggleButton.style.width = '32px';
        toggleButton.style.borderRadius = '50%';
        toggleButton.innerHTML = '🌓';
    });

    // Toggle functionality
    let isDarkMode = true;
    toggleButton.onclick = function() {
        isDarkMode = !isDarkMode;
        styleElement.disabled = !isDarkMode;
        if (toggleButton.style.width === '120px') {
            toggleButton.innerHTML = isDarkMode ? 'Dark Mode On' : 'Dark Mode Off';
        }
    };

    document.body.appendChild(toggleContainer);
})();
