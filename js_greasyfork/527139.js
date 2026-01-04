// ==UserScript==
// @name        Fast Rise
// @namespace   Violentmonkey Scripts
// @match       https://rise.articulate.com/author/*
// @grant       none
// @version     1.4.1
// @author      AMC-Albert
// @description Adds navigation buttons near the left of the header and enhances performance on Articulate Rise authoring pages.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527139/Fast%20Rise.user.js
// @updateURL https://update.greasyfork.org/scripts/527139/Fast%20Rise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const highlightColor = '#15095814'; // Color for the last visited section button
    const navButtonContainerId = 'rise-nav-buttons-container';
    const prevButtonId = 'rise-prev-button';
    const nextButtonId = 'rise-next-button';
    const debounceDelay = 150; // ms delay for debouncing outline updates

    const hrefDetailsPrefix = '#/author/details/';

    // --- State ---
    let outlineUpdateTimeout = null;

    // --- Helpers ---
    const isCourseOutline = () => window.location.href.includes('/author/course');
    const isSectionPage = () => window.location.href.includes('/author/details/');
    const scrollKey = `scrollPos_${window.location.origin}${window.location.pathname}`;
    const buttonKey = `lastClickedButton_${window.location.origin}${window.location.pathname}`;
    const navKey = `sectionNav_${window.location.origin}${window.location.pathname}`;

    console.log('Fast Rise Userscript loaded. Version:', GM_info.script.version);

    // --- Styling ---
    const style = document.createElement('style');
    style.textContent = `
        /* Disable animations to make things snappy and instant, except on a few elements that break if their animations are removed */
        *:not(.author-layout--process *, [data-rmiz-modal-content] *, .curtain *, .upload-progress *, .review-publish-spinner *) {
            animation: none !important;
            transition: none !important;
        }

        /* Remove banner thumbnails from 'copy to another course' feature to make it load faster */
        .copy-lesson-dialog__course-list__course-icon {
            background-image: none !important;
        }

        /* Remove AI garbage */
        button:has(.ai-gradient), .menu__item:has(.ai-gradient), .ai-tooltip-rich, .authoring-tooltip:has([src="https://cdn.articulate.com/assets/rise/assets/ai/block-wizard/generate-image-thumbnail.webp"]) {
            display: none;
        }

        /* Navigation Button Styles */
        #${navButtonContainerId} {
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 0 15px;
        }

        #${navButtonContainerId} button {
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            transition: background-color 0.2s ease; /* Add back transition for buttons */
             display: none; /* Hidden by default, shown via JS */
        }

        #${navButtonContainerId} button:hover {
            background-color: #e0e0e0;
        }

         #${navButtonContainerId} button:active {
             background-color: #d0d0d0;
         }

         /* Ensure app-header uses flexbox if not already */
         .app-header {
             display: flex;
             align-items: center;
             width: 100%;
         }
    `;
    document.head.appendChild(style);

    // --- Core Logic ---

    // Save scroll position periodically on the course outline page
    setInterval(() => {
        if (isCourseOutline()) {
            localStorage.setItem(scrollKey, window.scrollY);
        }
    }, 500);

    // Restore scroll position and setup on load
    window.addEventListener('load', () => {
        console.log('Window loaded. Setting up...');
        setupPage();
    });

    // Handle browser back/forward navigation and hash changes
    window.addEventListener('popstate', handleNavigationChange);
    window.addEventListener('hashchange', handleNavigationChange);

    function handleNavigationChange() {
         console.log('Navigation event (popstate/hashchange). Setting up...');
         // Use a small delay to allow Rise's own routing/rendering to settle
         setTimeout(setupPage, 50);
    }


    // Override Articulate's scroll resets on the course outline page
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(x, y) {
        if (isCourseOutline() && y === 0) {
            const savedScrollPos = localStorage.getItem(scrollKey);
            if (savedScrollPos !== null && window.scrollY !== parseInt(savedScrollPos, 10)) {
                const newY = parseInt(savedScrollPos, 10);
                // console.log('Overriding scrollTo(0) with saved position:', newY);
                originalScrollTo.call(window, x, newY);
                return; // Prevent original call with y=0
            }
        }
        originalScrollTo.call(window, x, y);
    };

    // Function to run setup tasks based on current page
    function setupPage() {
        addNavigationButtons(); // Attempt to add buttons if not present
        updateButtonVisibility(); // Show/hide buttons based on page type

        if (isCourseOutline()) {
            console.log('On Course Outline page.');
            runOutlineUpdates(); // Update index, attach listeners, highlight immediately
            const savedScrollPos = localStorage.getItem(scrollKey);
            if (savedScrollPos !== null) {
                // Delay slightly to ensure layout is stable
                setTimeout(() => {
                    // Double check we are still on the outline page before scrolling
                    if(isCourseOutline()){
                         window.scrollTo(0, parseInt(savedScrollPos, 10));
                    }
                }, 150);
            }
        } else if (isSectionPage()) {
            console.log('On Section Detail page.');
            updateLastClickedButton();
        } else {
             console.log('On other Rise page.');
        }
    }

    // --- Outline Page Specific Functions ---

    // Debounced function to schedule updates for the course outline page
    function scheduleOutlineUpdate() {
        clearTimeout(outlineUpdateTimeout);
        outlineUpdateTimeout = setTimeout(() => {
            if (isCourseOutline()) { // Final check before running
                console.log('Debounced outline update triggered.');
                runOutlineUpdates();
            }
        }, debounceDelay);
    }

    // Function to perform all necessary updates on the outline page
    function runOutlineUpdates() {
        console.log('Running outline updates (index, listeners, highlight).');
        updateNavigationIndex();
        attachClickListeners();
        highlightLastClickedButton();
    }

    // Scans the course outline and updates the stored navigation order
    function updateNavigationIndex() {
        if (!isCourseOutline()) return; // Only run on the outline page

        // Selector for links leading to section detail pages within the outline
        const sectionLinkSelector = `.course-outline-item__link[href^="${hrefDetailsPrefix}"], a[arc-button][href^="${hrefDetailsPrefix}"]`;
        const sectionLinks = document.querySelectorAll(sectionLinkSelector);
        const hrefs = Array.from(sectionLinks).map(link => link.getAttribute('href'));

        const existingHrefs = JSON.parse(localStorage.getItem(navKey) || '[]');
        // Only update localStorage if the list has actually changed
        if (JSON.stringify(hrefs) !== JSON.stringify(existingHrefs)) {
             if (hrefs.length > 0) {
                localStorage.setItem(navKey, JSON.stringify(hrefs));
                console.log(`Navigation index updated with ${hrefs.length} sections.`);
             } else {
                 // Clear the index if no sections are found
                 localStorage.removeItem(navKey);
                 console.log('Navigation index cleared (no sections found).');
             }
        }
    }


    // Save the href of the last clicked "Edit Content" button
    function attachClickListeners() {
        if (!isCourseOutline()) return; // Only run on the outline page

        // Target links that lead to section detail pages
        const sectionLinkSelector = `.course-outline-item__link[href^="${hrefDetailsPrefix}"], a[arc-button][href^="${hrefDetailsPrefix}"]`;
        const buttons = document.querySelectorAll(sectionLinkSelector);

        buttons.forEach(button => {
            // Remove existing listeners to prevent duplicates if re-run
            button.removeEventListener('click', handleButtonClick);
            button.addEventListener('click', handleButtonClick);
        });
    }

    function handleButtonClick(event) {
        const href = event.currentTarget.getAttribute('href');
        if (href) {
            localStorage.setItem(buttonKey, href);
            console.log('Button clicked, saving href:', href);
             // Remove highlight from previously clicked button
             const sectionLinkSelector = `.course-outline-item__link[href^="${hrefDetailsPrefix}"], a[arc-button][href^="${hrefDetailsPrefix}"]`;
             document.querySelectorAll(sectionLinkSelector).forEach(btn => {
                 if (btn.style.background === highlightColor) {
                     btn.style.background = '';
                 }
             });
             // Highlight the clicked button immediately
             event.currentTarget.style.background = highlightColor;
        }
    }


    // Highlight the button corresponding to the last visited section
    function highlightLastClickedButton() {
         if (!isCourseOutline()) return; // Only run on the outline page

        const lastClickedHref = localStorage.getItem(buttonKey);
        const sectionLinkSelector = `.course-outline-item__link[href^="${hrefDetailsPrefix}"], a[arc-button][href^="${hrefDetailsPrefix}"]`;

        // Remove highlight from any previously highlighted button first
        document.querySelectorAll(sectionLinkSelector).forEach(btn => {
             if (btn.style.background === highlightColor) {
                 btn.style.background = '';
             }
        });

        if (lastClickedHref) {
            const button = document.querySelector(`.course-outline-item__link[href="${lastClickedHref}"]`) || document.querySelector(`a[arc-button][href="${lastClickedHref}"]`);
            if (button) {
                button.style.background = highlightColor;
            }
        }
    }

    // --- Section Page Specific Functions ---

    // Update the last clicked button state when arriving at a section page
    function updateLastClickedButton() {
        const currentHref = window.location.hash;
        // Only update if it looks like a valid section detail URL
        if (currentHref.startsWith(hrefDetailsPrefix)) {
            localStorage.setItem(buttonKey, currentHref);
            console.log('Updated last clicked button on section load:', currentHref);
        }
    }

     // --- Navigation ---

    function navigateToSection(direction) {
        if (!isSectionPage()) {
            console.log('Navigation attempted, but not on a section page.');
            return; // Only navigate when on a section page
        }

        const hrefs = JSON.parse(localStorage.getItem(navKey) || '[]');
        if (hrefs.length === 0) {
             console.log('No navigation data found. Visit the course outline first.');
             alert('Navigation data not available. Please visit the main course outline page first.');
             return;
        }

        const currentHref = window.location.hash;
        const currentIndex = hrefs.indexOf(currentHref);

        let targetIndex = -1;
        if (direction === 'next' && currentIndex < hrefs.length - 1) {
            targetIndex = currentIndex + 1;
        } else if (direction === 'previous' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        } else if (currentIndex === -1) {
             console.warn(`Current URL (${currentHref}) not found in stored navigation index. Re-visit the course outline.`);
             alert(`Current section not found in navigation index. Please visit the course outline page to refresh it.`);
             return;
        } else {
             // Optionally provide feedback that they are at the start/end
             const buttonId = direction === 'next' ? nextButtonId : prevButtonId;
             const button = document.getElementById(buttonId);
             if (button) {
                 button.style.opacity = '0.5'; // Dim the button briefly
                 setTimeout(() => { button.style.opacity = '1'; }, 300);
             }
            return; // Already at the start/end
        }

        if (targetIndex !== -1) {
            const nextHref = hrefs[targetIndex];
            console.log(`Navigating ${direction} to index ${targetIndex}: ${nextHref}`);
            localStorage.setItem(buttonKey, nextHref); // Update last clicked button state *before* navigating
            window.location.hash = nextHref; // Perform navigation
             // No need for setupPage call here, hashchange listener will handle it
        }
    }

    // Keyboard shortcuts for section navigation (Ctrl + Alt + Left/Right)
    window.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);

        if (!isInputFocused && isSectionPage() && e.ctrlKey && e.altKey) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateToSection('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateToSection('previous');
            }
        }
    });


    // --- UI Elements ---

    function addNavigationButtons() {
        if (document.getElementById(navButtonContainerId)) {
            return; // Already added
        }

        const header = document.querySelector('.app-header');
        if (!header) {
            return; // Header not ready
        }

        console.log('Adding navigation buttons to header.');

        const container = document.createElement('div');
        container.id = navButtonContainerId;

        const prevButton = document.createElement('button');
        prevButton.id = prevButtonId;
        prevButton.textContent = '←';
        prevButton.title = 'Previous Section (Ctrl+Alt+Left)';
        prevButton.addEventListener('click', () => navigateToSection('previous'));

        const nextButton = document.createElement('button');
        nextButton.id = nextButtonId;
        nextButton.textContent = '→';
        nextButton.title = 'Next Section (Ctrl+Alt+Right)';
        nextButton.addEventListener('click', () => navigateToSection('next'));

        container.appendChild(prevButton);
        container.appendChild(nextButton);

        header.insertBefore(container, header.children[1]);

        updateButtonVisibility(); // Update visibility immediately after adding
    }

    function updateButtonVisibility() {
        const container = document.getElementById(navButtonContainerId);
        if (container) {
             const shouldShow = isSectionPage();
             const buttons = container.querySelectorAll('button');
             buttons.forEach(button => {
                button.style.display = shouldShow ? 'inline-block' : 'none';
             });
        }
    }

    // --- Dynamic Content Handling ---

    const observer = new MutationObserver((mutationsList, observer) => {
        let needsGeneralSetup = false; // For header/buttons
        let potentialOutlineChange = false; // Flag if outline items might have changed

        // Check for header setup need (independent of outline page)
         if (!document.getElementById(navButtonContainerId)) {
             for (const mutation of mutationsList) {
                 if (mutation.type === 'childList') {
                     for (const node of mutation.addedNodes) {
                         if (node.nodeType === Node.ELEMENT_NODE && (node.matches('.app-header') || node.querySelector('.app-header'))) {
                             needsGeneralSetup = true;
                             break;
                         }
                     }
                 }
                 if (needsGeneralSetup) break;
             }
         }

         // Check for outline changes *if* on the outline page
         if (isCourseOutline()) {
             for (const mutation of mutationsList) {
                 if (mutation.type === 'childList') {
                     const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
                     for (const node of changedNodes) {
                         if (node.nodeType === Node.ELEMENT_NODE) {
                             // Check if the node itself or its descendants match outline item/link structure
                             const sectionLinkSelector = `.course-outline-item, .course-outline-item__link, a[arc-button][href^="${hrefDetailsPrefix}"]`;
                             if (node.matches(sectionLinkSelector) || node.querySelector(sectionLinkSelector)) {
                                 potentialOutlineChange = true;
                                 break; // Found a relevant change in this mutation's nodes
                             }
                         }
                     }
                 }
                 if (potentialOutlineChange) break; // Stop checking mutations if change found
             }
         }

         // After looping through mutations:
         if (needsGeneralSetup) {
             addNavigationButtons();
         }

         // Always update button visibility as page state might change implicitly
         updateButtonVisibility();

         // If outline changes were detected, schedule the debounced update
         if (potentialOutlineChange) {
             scheduleOutlineUpdate();
         }
    });


    // Start observing the documentElement for broad coverage
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial setup attempt after script injection
    setTimeout(setupPage, 50);

})();