// ==UserScript==
// @name         Comick Client
// @namespace    https://github.com/Nublord33/Comick-CLient
// @version      0.1
// @description  Comick Client (Alpha)
// @author       Nublord33/SkibidiSKid(joke name)
// @match        https://comick.io/*
// @license      Apache license 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531623/Comick%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/531623/Comick%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SOLID_COLOR = '#121318'; // Original solid background color
    const SECONDARY_COLOR = '#212328'; // Secondary color
    const OTHER_COLOR = '#3a3f47'; // New color for specific <a> elements
    const ICON_COLOR = '#e38783'; // Icon color for <path> elements with fill-rule="evenodd"
    const FONT_COLOR = '#e5e7eb'; // Font color
    const FONT_STYLE = 'JetBrains Mono, monospace'; // Font style

    // Class name variables with dots for CSS selectors
    const COMICK_STATUS = '.flex-1.mt-0.py-3.px-2.h-12.border.border-gray-300.dark\\:bg-gray-700.dark\\:border-gray-700.rounded';
    const BUTTON_CLASS = '.md\\:w-96.h-12.btn.px-2.py-3.flex-1';
    const A_CLASS = '.flex-1.md\\:w-96.h-12.btn.btn-primary.px-2.py-3.flex.items-center.rounded.flex.flex-1';
    const SELECT_SECONDARY_CLASS = '.cursor-pointer.pl-2.pr-6.py-1.border.border-gray-300.rounded.dark\\:border-gray-600';
    const TABLE_CLASS = '.table-fixed.w-full.whitespace-nowrap';
    const UL_CLASS = '.scrollbox.dark\\:scrollbox-dark.mt-3.mb-3.flex.flex-wrap.max-h-32.md\\:max-h-48.xl\\:max-h-48.overflow-y-auto.items-center.scrollbar-thin.scrollbar-thumb-gray-300.scrollbar-track-gray-100.dark\\:scrollbar-thumb-gray-600.dark\\:scrollbar-track-gray-700.scrollbar-thumb-rounded';
    const COMICK_TOPBAR = '.flex.items-center.justify-between.space-x-2.px-3.sm\\:px-6.lg\\:px-8.py-2.lg\\:border-b.border-gray-100.dark\\:border-gray-700.max-sm\\:overflow-x-auto.drop-shadow-sm.bg-white\\/95.dark\\:bg-gray-800\\/95';
    const BUTTON_SECONDARY_CLASS = '.btn.w-full.text-center.text-xs.px-0.border-none';
    const SCROLLBOX_CLASS = '.max-h-64.overflow-y-auto.scrollbox.dark\\:scrollbox-dark.scrollbar-thin.scrollbar-thumb-gray-300.scrollbar-track-gray-100.dark\\:scrollbar-thumb-gray-600.dark\\:scrollbar-track-gray-700.scrollbar-thumb-rounded.mt-1';

    // Long class selectors as variables
    const COMIC_DESC = '.comic-desc.xl\\:h-auto.max-h-96.overflow-y-auto.scrollbox.dark\\:scrollbox-dark.scrollbar-thin.scrollbar-thumb-gray-300.scrollbar-track-gray-100.dark\\:scrollbar-thumb-gray-600.dark\\:scrollbar-track-gray-700.scrollbar-thumb-rounded.my-3.md\\:my-5.prose.prose-hr\\:my-3.dark\\:prose-invert.max-w-none.prose-table\\:w-auto';
    const SCROLLBOX_CLASS_1 = '.scrollbox.dark\\:scrollbox-dark.mt-3.mb-3.flex.flex-wrap.max-h-32.md\\:max-h-48.xl\\:max-h-48.overflow-y-auto.items-center.scrollbar-thin.scrollbar-thumb-gray-300.scrollbar-track-gray-100.dark\\:scrollbar-thumb-gray-600.dark\\:scrollbar-track-gray-700.scrollbar-thumb-rounded';
    const SCROLLBOX_CLASS_2 = '.flex.items-center.max-w-max.overflow-x-auto.scrollbox.dark\\:scrollbox-dark.scrollbar-thin.scrollbar-thumb-gray-300.scrollbar-track-gray-100.dark\\:scrollbar-thumb-gray-600.dark\\:scrollbar-track-gray-700.scrollbar-thumb-rounded.space-x-3';

    //Set solid background and remove background image if not an image.
    function setSolidBackground(element, color) {
        element.style.backgroundColor = color;
        if (element.tagName.toLowerCase() !== 'img') {
            element.style.backgroundImage = 'none';
        }
    }

    // Helper: Set color for <path> elements with fill-rule="evenodd" and clip-rule="evenodd"
    function setIconColorForPaths() {
    document.querySelectorAll('path').forEach(path => {
        path.style.color = ICON_COLOR; // Apply the icon color to all paths
    });
}

    //Apply styles to multiple selectors
    function applyStylesToSelectors(selectors, color) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                setSolidBackground(element, color);
                element.style.border = 'none'; // Remove the border
            });
        });
    }

    // Function to apply styles to all relevant elements
    function applyCustomStyles() {
        // Apply solid background to body
        setSolidBackground(document.body, SOLID_COLOR);
        // Apply FONT_COLOR and FONT_STYLE to body
        document.body.style.color = FONT_COLOR;
        document.body.style.fontFamily = FONT_STYLE;

        // Apply styles to individual elements
        applyStylesToSelectors([BUTTON_CLASS, A_CLASS], OTHER_COLOR);
        applyStylesToSelectors([SELECT_SECONDARY_CLASS, COMICK_STATUS], SECONDARY_COLOR);

        document.querySelectorAll(TABLE_CLASS).forEach(table => {
            table.querySelectorAll('*').forEach(element => {
                if (element.tagName.toLowerCase() === 'input' && element.type === 'text' && element.placeholder === 'Goto chap') {
                    setSolidBackground(element, SECONDARY_COLOR); // Apply secondary color
                    return;
                }
                if (element.tagName.toLowerCase() !== 'i' || !element.classList.contains('flag-icon')) {
                    setSolidBackground(element, SOLID_COLOR); // Apply solid color to other elements
                }
            });
        });

        // Apply solid background to specific content areas
        applyStylesToSelectors([COMIC_DESC, SCROLLBOX_CLASS_1, SCROLLBOX_CLASS_2], SOLID_COLOR);

        // Style list items
        document.querySelectorAll(UL_CLASS).forEach(ul => {
            ul.querySelectorAll('li[title^="Vote:"]').forEach(li => {
                li.style.backgroundColor = SECONDARY_COLOR;
            });
        });
        document.querySelectorAll(SCROLLBOX_CLASS_2).forEach(div => {
    div.querySelectorAll('.dark\\:hover\\:bg-gray-600').forEach(innerDiv => {
        innerDiv.style.backgroundColor = SECONDARY_COLOR;
    });
});


        // Apply styles to secondary buttons
        applyStylesToSelectors([BUTTON_SECONDARY_CLASS], OTHER_COLOR);

        // Apply styles to scrollboxes
        applyStylesToSelectors([SCROLLBOX_CLASS], SOLID_COLOR);

        // Apply styles to the top bar
        applyStylesToSelectors([COMICK_TOPBAR], SECONDARY_COLOR);

        // Apply styles to .bg-blue-500 elements
        applyStylesToSelectors(['.bg-blue-500'], OTHER_COLOR);

        // Apply ICON_COLOR to <path> elements with fill-rule="evenodd" and clip-rule="evenodd"
        setIconColorForPaths();
    }

    // Initial style application
    applyCustomStyles();

    // Reapply styles on navigation changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(history, args);
        applyCustomStyles();
    };

    window.addEventListener('popstate', applyCustomStyles);
    document.addEventListener("DOMContentLoaded", applyCustomStyles);

    // MutationObserver for dynamically loaded content
    let styleTimeout;
    const observer = new MutationObserver((mutationsList) => {
        clearTimeout(styleTimeout);
        styleTimeout = setTimeout(() => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    applyCustomStyles();
                    break;
                }
            }
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Hook into fetch() to handle dynamically loaded content
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        applyCustomStyles();
        return response;
    };
})();
