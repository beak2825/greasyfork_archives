// ==UserScript==
// @name         GitHub to DeepWiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to GitHub repo pages to open the corresponding DeepWiki page.
// @description:zh-CN 在 GitHub 仓库页面添加按钮，以快速打开对应的 DeepWiki 页面。
// @author       Leihao Zhou
// @match        https://github.com/*/*
// @grant        GM_addStyle
// @grant        window.open
// @run-at       document-idle
// @name:zh-CN   GitHub 跳转 DeepWiki
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534332/GitHub%20to%20DeepWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/534332/GitHub%20to%20DeepWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'deepwiki-button-userscript'; // Unique ID

    const addDeepWikiButton = () => {
        // 1. Check if already added
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        // 2. Check if on a valid repo page (path needs at least user/repo)
        const pathParts = location.pathname.split('/').filter(Boolean);
        // Ensure it's a repo page, not settings, issues, PRs etc. within the repo for simplicity
        // A more robust check might involve looking for specific page elements.
        if (pathParts.length !== 2) {
             // console.log('DeepWiki Button: Not on a main repo page.');
             return; // Only target the main repo page for now
        }

        // 3. Find insertion point (try a few common selectors for GitHub's layout)
        const potentialTargets = [
            '.gh-header-actions', // Newer layout
            '.pagehead-actions', // Older layout
            '#repository-container-header > div > div > div > ul' // Fallback selector observed
        ];
        let targetElement = null;
        for (const selector of potentialTargets) {
            targetElement = document.querySelector(selector);
            if (targetElement) break;
        }

        if (!targetElement) {
            // console.log('DeepWiki Button: Target element not found using selectors:', potentialTargets);
            // Try again after a short delay in case the element is slow to render
            setTimeout(() => {
                if (!document.getElementById(BUTTON_ID)) { // Check again before retrying
                     targetElement = document.querySelector(potentialTargets.join(', ')); // Try all at once
                     if (targetElement) {
                         insertButton(targetElement);
                     } else {
                         console.warn('DeepWiki Button: Target element still not found after delay.');
                     }
                }
            }, 1000); // Wait 1 second
            return;
        }

        insertButton(targetElement);
    };

    const insertButton = (targetElement) => {
         // 4. Create button
        const button = document.createElement('a');
        button.id = BUTTON_ID;
        button.textContent = '🚀 Open in DeepWiki';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.href = '#'; // Set href to '#' initially to make it behave like a link
        button.setAttribute('aria-label', 'Open this repository in DeepWiki');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0'); // Make it focusable

        // Apply styles using GM_addStyle for better management or inline styles
        // Using inline styles for simplicity here
        button.style.marginLeft = '8px';
        button.style.padding = '5px 16px'; // Adjusted padding like GitHub buttons
        button.style.border = '1px solid rgba(240, 246, 252, 0.1)'; // GitHub's border color
        button.style.borderRadius = '6px';
        button.style.backgroundColor = '#21262d'; // GitHub's dark button background
        button.style.color = '#c9d1d9'; // GitHub's dark button text color
        button.style.fontWeight = '500';
        button.style.fontSize = '14px'; // Match GitHub button font size
        button.style.lineHeight = '20px';
        button.style.cursor = 'pointer';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.verticalAlign = 'middle'; // Ensure vertical alignment

        // Add hover/focus effect mimicking GitHub
        const hoverBg = '#30363d';
        const hoverBorder = '#8b949e';
        const defaultBg = '#21262d';
        const defaultBorder = 'rgba(240, 246, 252, 0.1)';

        button.onmouseover = () => { button.style.backgroundColor = hoverBg; button.style.borderColor = hoverBorder; };
        button.onmouseout = () => { button.style.backgroundColor = defaultBg; button.style.borderColor = defaultBorder; };
        button.onfocus = () => { button.style.outline = '2px solid #58a6ff'; button.style.outlineOffset = '2px'; }; // Accessibility focus ring
        button.onblur = () => { button.style.outline = 'none'; };


        const handleClick = (event) => {
            event.preventDefault(); // Prevent default link navigation
            event.stopPropagation(); // Stop event bubbling
            const currentUrl = location.href;
            // More robust replacement: ensure we only replace the domain and the base path
            const urlObject = new URL(currentUrl);
            const pathParts = urlObject.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                const user = pathParts[0];
                const repo = pathParts[1];
                const deepwikiUrl = `https://deepwiki.com/${user}/${repo}`;
                 window.open(deepwikiUrl, '_blank');
            } else {
                console.error('DeepWiki Button: Could not extract user/repo from URL:', currentUrl);
            }
        };

        // 5. Add click handler
        button.addEventListener('click', handleClick);
        // Add keydown handler for accessibility (Enter/Space)
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                handleClick(event);
            }
        });


        // 6. Insert button (prepend to appear first in the actions list, or append if prepend not suitable)
        // Using prepend is generally better for visibility
        if (targetElement.prepend) {
             targetElement.prepend(button);
        } else {
            targetElement.insertBefore(button, targetElement.firstChild); // Fallback for older browsers
        }
        console.log('DeepWiki Button added.');
    }


    // --- Handling SPA Navigation ---
    // GitHub uses Turbo (formerly Turbolinks) for navigation. Observe changes to the body or a specific container.
    let previousUrl = location.href;
    const observer = new MutationObserver((mutationsList) => {
        // Check if URL changed - simple way to detect SPA navigation
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            // Wait a bit for the new page elements to likely render after URL change
            setTimeout(addDeepWikiButton, 300);
        } else {
             // If URL didn't change, check if the button is missing and the target exists (e.g., partial DOM update)
             if (!document.getElementById(BUTTON_ID)) {
                 const target = document.querySelector('.gh-header-actions, .pagehead-actions, #repository-container-header > div > div > div > ul');
                 if (target) {
                     addDeepWikiButton(); // Try adding if target exists but button doesn't
                 }
             }
        }
    });

    // Start observing the body for subtree modifications and child list changes.
    // Observing 'body' is broad but reliable for catching SPA navigations.
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run in case the page is already loaded
    // Use requestIdleCallback or setTimeout for potentially better timing
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(addDeepWikiButton, 500); // Delay slightly
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(addDeepWikiButton, 500));
    }

})();