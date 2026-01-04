// ==UserScript==
// @name         Pages View Google Docs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a thumbnail view similar to MS Word, including both heading and section grouping
// @match        https://docs.google.com/document/d/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531613/Pages%20View%20Google%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/531613/Pages%20View%20Google%20Docs.meta.js
// ==/UserScript==


(() => {
    'use strict';

    // ---------------------------
    // 1. Utility Functions
    // ---------------------------
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const clickElement = element => {
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        });
        console.log('Simulated click on', element);
    };

    const waitForHeaderBubbles = async (timeout = 3000) => {
        const startTime = Date.now();
        let bubbles = [];
        while (Date.now() - startTime < timeout) {
            bubbles = Array.from(document.querySelectorAll('div.docs-bubble.kix-header-footer-bubble'))
                .filter(bubble => window.getComputedStyle(bubble).display !== 'none');
            if (bubbles.length) break;
            await sleep(300);
        }
        return bubbles;
    };

    // New function to load header bubble using a chain of fallbacks.
    function clickHeaderChain() {
        // Attempt 1: Try to click the main Header option.
        const mainHeader = document.evaluate(
            "//div[contains(@class, 'goog-menuitem') and contains(@class, 'apps-menuitem') and not(contains(@class, 'goog-submenu'))]//span[contains(@aria-label, 'Header') and not(contains(@aria-label, 'Headers'))]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (mainHeader) {
            clickElement(mainHeader.closest('div.goog-menuitem'));
            // Close any lingering menus.
            document.querySelectorAll('div.goog-menu').forEach(menu => menu.style.display = 'none');
            console.log("Main Header clicked immediately.");
            return;
        }

        // Attempt 2: Try the fallback "Headers & footers" option.
        const fallbackHeader = document.evaluate(
            "//div[contains(@class, 'goog-menuitem') and contains(@class, 'apps-menuitem') and contains(@class, 'goog-submenu')]//span[contains(@aria-label, 'Headers') and contains(@aria-label, 'footers')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (fallbackHeader) {
            clickElement(fallbackHeader.closest('div.goog-menuitem'));
            console.log("Fallback 'Headers & footers' clicked.");
            // Wait a bit then try for the main header.
            setTimeout(() => {
                const mainHeaderRetry = document.evaluate(
                    "//div[contains(@class, 'goog-menuitem') and contains(@class, 'apps-menuitem') and not(contains(@class, 'goog-submenu'))]//span[contains(@aria-label, 'Header') and not(contains(@aria-label, 'Headers'))]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (mainHeaderRetry) {
                    clickElement(mainHeaderRetry.closest('div.goog-menuitem'));
                    document.querySelectorAll('div.goog-menu').forEach(menu => menu.style.display = 'none');
                    console.log("Main Header clicked after fallback.");
                } else {
                    console.log("Main Header did not appear after clicking fallback.");
                }
            }, 500);
            return;
        }

        // Attempt 3: Use the Insert menu as a last resort.
        const insertMenu = document.querySelector('div#docs-insert-menu');
        if (insertMenu) {
            clickElement(insertMenu);
            console.log("Insert menu clicked as fallback.");
            setTimeout(() => {
                const fallbackHeaderRetry = document.evaluate(
                    "//div[contains(@class, 'goog-menuitem') and contains(@class, 'apps-menuitem') and contains(@class, 'goog-submenu')]//span[contains(@aria-label, 'Headers') and contains(@aria-label, 'footers')]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (fallbackHeaderRetry) {
                    clickElement(fallbackHeaderRetry.closest('div.goog-menuitem'));
                    console.log("'Headers & footers' clicked from Insert menu.");
                    setTimeout(() => {
                        const mainHeaderFinal = document.evaluate(
                            "//div[contains(@class, 'goog-menuitem') and contains(@class, 'apps-menuitem') and not(contains(@class, 'goog-submenu'))]//span[contains(@aria-label, 'Header') and not(contains(@aria-label, 'Headers'))]",
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;
                        if (mainHeaderFinal) {
                            clickElement(mainHeaderFinal.closest('div.goog-menuitem'));
                            document.querySelectorAll('div.goog-menu').forEach(menu => menu.style.display = 'none');
                            console.log("Main Header clicked after Insert chain.");
                        } else {
                            console.log("Main Header did not appear after Insert chain.");
                        }
                    }, 500);
                } else {
                    console.log("'Headers & footers' did not appear after clicking Insert menu.");
                }
            }, 500);
        } else {
            console.log("Insert menu is missing.");
        }
    }

    const disableDocumentTabs = () => {
        const tabsElem = document.querySelector(
            'div.navigation-widget.navigation-widget-unified-styling.docs-material.navigation-widget-floating-navigation-button.navigation-location-indicator.outline-refresh.navigation-widget-hoverable.navigation-widget-chaptered.left-sidebar-container-content-child'
        );
        if (tabsElem) {
            tabsElem.style.pointerEvents = 'none';
            console.log("Document tabs disabled.");
        }
    };

    const enableDocumentTabs = () => {
        const tabsElem = document.querySelector(
            'div.navigation-widget.navigation-widget-unified-styling.docs-material.navigation-widget-floating-navigation-button.navigation-location-indicator.outline-refresh.navigation-widget-hoverable.navigation-widget-chaptered.left-sidebar-container-content-child'
        );
        if (tabsElem) {
            tabsElem.style.pointerEvents = '';
            console.log("Document tabs re-enabled.");
        }
    };


    // ---------------------------
    // 2. Global State & Constants
    // ---------------------------
    let currentTextDirection = 'ltr';
    let thumbnailOverlay = null;
    let overlayPositionObserver = null;
    let thumbnailZoomFactor = 1;
    const ZOOM_RATIO = 1.15, MIN_ZOOM = 0.5, MAX_ZOOM = 2.0;
    const capturedPages = new Set();
    let captureTimeoutId = null;
    let mutationObserver = null;
    let isGroupingEnabled = false; // For heading grouping
    let isSectionGroupingEnabled = false; // New flag for section grouping
    const capturedPageData = {}; // { pageNumber: { thumbEntry, headings: Set() } }
    let headingGroupsArr = [];
    let cancelScrollSequence = false;
    let isThumbnailViewActive = false;
    let pagesViewButton = null;
    let progressBarContainer = null;
    let progressBarInner = null;
    let tabSelectionIntervalId = null;
    let cancelHeadingClicks = false;
    let initialSelectedTab = null; // Store the tab element that was selected when opening overlay

    // ---------------------------
    // 3. Document & Scroll Utilities
    // ---------------------------
    const getDocumentId = () =>
    (window.location.href.match(/\/d\/([a-zA-Z0-9_-]+)/) || [])[1] || 'default';

    const getScrollableElement = () => document.querySelector('.kix-appview-editor');

    const saveScrollPosition = () => {
        const scrollable = getScrollableElement();
        if (scrollable) {
            const scrollData = JSON.parse(localStorage.getItem('googleDocsScrollData') || '{}');
            scrollData[getDocumentId()] = scrollable.scrollTop;
            localStorage.setItem('googleDocsScrollData', JSON.stringify(scrollData));
        }
    };

    const restoreScrollPosition = () => {
        const scrollable = getScrollableElement();
        const scrollData = JSON.parse(localStorage.getItem('googleDocsScrollData') || '{}');
        const pos = scrollData[getDocumentId()];
        if (scrollable && pos !== undefined) {
            scrollable.scrollTop = parseInt(pos, 10);
        }
    };

    // ---------------------------
    // 4. Thumbnail Overlay Management
    // ---------------------------
    const updateOverlayPosition = () => {
        let topOffset = '50px';
        let ruler = document.getElementById('kix-horizontal-ruler') ||
            document.querySelector('div#docs-chrome[aria-label="Menu bar"]');
        if (ruler) topOffset = `${ruler.getBoundingClientRect().bottom}px`;

        let leftOffset = '10px';
        const sidebar = document.querySelector('.left-sidebar-container');
        if (sidebar) leftOffset = `${sidebar.getBoundingClientRect().right}px`;

        if (thumbnailOverlay) {
            Object.assign(thumbnailOverlay.style, { top: topOffset, left: leftOffset });
        }
    };

    const startOverlayPositionObserver = () => {
        const targets = [];
        const sidebar = document.querySelector('.left-sidebar-container');
        if (sidebar) targets.push(sidebar);
        let ruler = document.getElementById('kix-horizontal-ruler') ||
            document.querySelector('div#docs-chrome[aria-label="Menu bar"]');
        if (ruler) targets.push(ruler);
        if (!targets.length) return;
        overlayPositionObserver = new MutationObserver(updateOverlayPosition);
        targets.forEach(target =>
                        overlayPositionObserver.observe(target, { attributes: true, attributeFilter: ['style', 'class'] })
                       );
    };

    const stopOverlayPositionObserver = () => {
        if (overlayPositionObserver) {
            overlayPositionObserver.disconnect();
            overlayPositionObserver = null;
        }
    };

    const createThumbnailOverlay = () => {
        thumbnailOverlay = document.createElement('div');
        thumbnailOverlay.id = 'thumbnailOverlay';
        updateOverlayPosition();
        Object.assign(thumbnailOverlay.style, {
            position: 'fixed',
            right: '0',
            bottom: '0',
            background: '#f9fbfd',
            zIndex: '10000',
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '10px',
            alignContent: 'flex-start'
        });
        document.body.appendChild(thumbnailOverlay);
        startOverlayPositionObserver();
    };

    const removeThumbnailOverlay = () => {
        if (thumbnailOverlay) {
            thumbnailOverlay.remove();
            thumbnailOverlay = null;
        }
        stopOverlayPositionObserver();
    };

    // ---------------------------
    // 5. Thumbnail Display & Zoom
    // ---------------------------
    const insertThumbnailInOrder = (thumbElement, pageNumber) => {
        if (!thumbnailOverlay) return;
        const thumbnails = Array.from(thumbnailOverlay.querySelectorAll('.thumbnail-entry'));
        const index = thumbnails.findIndex(el => parseInt(el.dataset.pageNumber, 10) > pageNumber);
        if (index >= 0) {
            thumbnailOverlay.insertBefore(thumbElement, thumbnails[index]);
        } else {
            thumbnailOverlay.appendChild(thumbElement);
        }
    };

    const updateThumbnailZoom = () => {
        if (!thumbnailOverlay) return;
        thumbnailOverlay.querySelectorAll('.thumbnail-entry img').forEach(img => {
            img.style.width = `${200 * thumbnailZoomFactor}px`;
        });
    };

    const handleCtrlZoom = event => {
 // Zoom in (multiplicative)
        if (['=', 'Add', 'NumpadAdd'].includes(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            thumbnailZoomFactor = Math.min(thumbnailZoomFactor * ZOOM_RATIO, MAX_ZOOM);
          updateThumbnailZoom();
       }
        // Zoom out (multiplicative)
        else if (['-', 'Subtract', 'NumpadSubtract'].includes(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            thumbnailZoomFactor = Math.max(thumbnailZoomFactor / ZOOM_RATIO, MIN_ZOOM);
            updateThumbnailZoom();
        }
    };

    const attachZoomListeners = () => {
        window.addEventListener('keydown', handleCtrlZoom, true);
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                (iframe.contentDocument || iframe.contentWindow.document)
                    .addEventListener('keydown', handleCtrlZoom, true);
            } catch (err) {
                console.error('Error attaching zoom listener:', err);
            }
        });
    };

    const detachZoomListeners = () => {
        window.removeEventListener('keydown', handleCtrlZoom, true);
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                (iframe.contentDocument || iframe.contentWindow.document)
                    .removeEventListener('keydown', handleCtrlZoom, true);
            } catch (err) {
                console.error('Error detaching zoom listener:', err);
            }
        });
    };

    // Update text direction and re-render thumbnails (flat or grouped)
    const setTextDirection = direction => {
        currentTextDirection = direction;
        if (thumbnailOverlay) {
            thumbnailOverlay.style.direction = direction;
            updateOverlayPosition();
            // When RTL, add extra padding on the right.
            if (direction === 'rtl') {
                thumbnailOverlay.style.padding = '10px 20px 10px 10px'; // top, right, bottom, left
            } else {
                thumbnailOverlay.style.padding = '10px';
            }
        }
        if (!isGroupingEnabled && !isSectionGroupingEnabled) {
            thumbnailOverlay.replaceChildren();
            Object.keys(capturedPageData)
                .map(Number)
                .sort((a, b) => a - b)
                .forEach(pageNum => {
                const data = capturedPageData[pageNum];
                if (data?.thumbEntry) {
                    thumbnailOverlay.appendChild(data.thumbEntry);
                }
            });
        } else if (isGroupingEnabled) {
            renderGroupedThumbnails();
        } else if (isSectionGroupingEnabled) {
            renderSectionGroupedPages();
        }
    };

    // ---------------------------
    // 6. Page Capture Module
    // ---------------------------
    const getCurrentPageNumber = () => {
        const tooltip = document.querySelector('div.jfk-tooltip-contentId[style*="direction: ltr"]');
        if (tooltip) {
            const match = tooltip.textContent.match(/(\d+)\s+of/);
            return match ? parseInt(match[1], 10) : null;
        }
        return null;
    };

    const getCurrentSelectedHeading = () => {
        const headingElem = document.querySelector(
            '#chapter-container-t\\.wf0m5iat3jku > div.chapter-item.chapter-item-subchapters-indent-enabled > div.updating-navigation-item-list > div.navigation-item-list.goog-container .navigation-item.location-indicator-highlight'
        );
        if (headingElem) {
            const content = headingElem.querySelector('.navigation-item-content');
            const headingText = content ? content.textContent.trim() : 'Unknown';
            const levelMatch = content ? content.className.match(/navigation-item-level-(\d+)/) : null;
            return { headingElem, headingText, navLevel: levelMatch ? parseInt(levelMatch[1], 10) : 0 };
        }
        return null;
    };

    const getHighestParentHeading = currentHeadingElem => {
        const parentContainer = currentHeadingElem.parentNode;
        const allHeadings = Array.from(parentContainer.querySelectorAll('.navigation-item'));
        const currentIndex = allHeadings.indexOf(currentHeadingElem);
        let highestHeading = currentHeadingElem, highestLevel = Infinity;
        for (let i = currentIndex - 1; i >= 0; i--) {
            const elem = allHeadings[i];
            const content = elem.querySelector('.navigation-item-content');
            if (content) {
                const level = (content.className.match(/navigation-item-level-(\d+)/) || [])[1] || 0;
                if (level < highestLevel) {
                    highestLevel = level;
                    highestHeading = elem;
                }
            }
        }
        const content = highestHeading.querySelector('.navigation-item-content');
        return {
            headingElem: highestHeading,
            headingText: content ? content.textContent.trim() : 'Unknown',
            navLevel: highestLevel === Infinity ? 0 : highestLevel
        };
    };

    // ---------------------------
    // 7. Grouping Functions (Heading Grouping)
    // ---------------------------
    const recordHeadingStartingPages = async () => {
        // Disable document tabs while heading clicks are active.
        disableDocumentTabs();

        // Reset grouping array and ensure heading clicks can run.
        headingGroupsArr = [];
        cancelHeadingClicks = false;
        const selectedTab = document.querySelector('.chapter-item-label-and-buttons-container-selected');
        if (!selectedTab) {
            console.warn("No selected tab found.");
            enableDocumentTabs();
            return;
        }
        const chapterItem = selectedTab.closest('.chapter-item');
        if (!chapterItem) {
            console.warn("Selected tab does not have a chapter-item parent.");
            enableDocumentTabs();
            return;
        }
        const navList = chapterItem.querySelector('.updating-navigation-item-list');
        if (!navList) {
            console.warn("No navigation item list found under the selected tab.");
            enableDocumentTabs();
            return;
        }

        const topLevelHeadings = Array.from(navList.querySelectorAll('.navigation-item')).filter(item => {
            const content = item.querySelector('.navigation-item-content');
            return content?.classList.contains('navigation-item-level-0');
        });
        const totalHeadings = topLevelHeadings.length;
        let clickedCount = 0;
        const progressBar = document.getElementById('headingProgressBar');
        if (progressBar) {
            progressBar.style.width = `0%`;
        }

        try {
            for (const item of topLevelHeadings) {
                if (cancelHeadingClicks) {
                    console.log("Heading click loop cancelled.");
                    break;
                }
                clickElement(item);
                clickedCount++;
                if (progressBar) {
                    progressBar.style.width = `${(clickedCount / totalHeadings) * 100}%`;
                }
                await sleep(100);
                const currentPage = getCurrentPageNumber();
                if (currentPage) {
                    const headingText = item.querySelector('.navigation-item-content')?.textContent.trim() || 'Unknown';
                    headingGroupsArr.push({ headingText, navLevel: 0, startingPage: currentPage, pages: new Set() });
                }
            }
        } finally {
            // Always re-enable document tabs after the loop completes or is interrupted.
            enableDocumentTabs();
        }
    };


    const assignPagesToGroups = () => {
        headingGroupsArr.sort((a, b) => a.startingPage - b.startingPage);
        const capturedPageNumbers = Object.keys(capturedPageData).map(Number).sort((a, b) => a - b);
        const groupsByStartingPage = {};
        headingGroupsArr.forEach(group => {
            groupsByStartingPage[group.startingPage] = groupsByStartingPage[group.startingPage] || [];
            groupsByStartingPage[group.startingPage].push(group);
        });
        const distinctStartPages = Object.keys(groupsByStartingPage).map(Number).sort((a, b) => a - b);
        distinctStartPages.forEach((sp, index) => {
            const nextSP = index < distinctStartPages.length - 1 ? distinctStartPages[index + 1] : Infinity;
            const pagesInRange = capturedPageNumbers.filter(pageNum => pageNum >= sp && pageNum < nextSP);
            const groups = groupsByStartingPage[sp];
            groups.forEach((group, idx) => {
                group.pages = (idx < groups.length - 1)
                    ? new Set(capturedPageNumbers.includes(sp) ? [sp] : [])
                : new Set(pagesInRange);
            });
        });
    };

    const capturePages = () => {
        if (!thumbnailOverlay) return;
        const pages = Array.from(document.querySelectorAll('.kix-page-paginated'));
        const scrollable = getScrollableElement();
        pages.forEach((page, index) => {
            const rotatingTileManager = page.closest('.kix-rotatingtilemanager.docs-ui-hit-region-surface');
            if (rotatingTileManager && rotatingTileManager.parentElement &&
                window.getComputedStyle(rotatingTileManager.parentElement).display === 'none') return;
            let pageNumber = parseInt(page.style.zIndex, 10);
            pageNumber = !isNaN(pageNumber) ? pageNumber + 1 : index + 1;
            if (capturedPages.has(pageNumber)) return;
            const canvas = page.querySelector('canvas.kix-canvas-tile-content');
            if (!canvas) return;
            // Force a reflow/repaint on the canvas.
            canvas.style.display = 'none';
            void canvas.offsetHeight;
            canvas.style.display = '';
            let dataUrl;
            try {
                dataUrl = canvas.toDataURL();
            } catch (err) {
                console.error('Error converting canvas to image:', err);
                return;
            }
            let pageScrollPos = 0;
            if (scrollable) {
                const containerRect = scrollable.getBoundingClientRect();
                const pageRect = page.getBoundingClientRect();
                pageScrollPos = scrollable.scrollTop + (pageRect.top - containerRect.top);
            }
            const thumbEntry = document.createElement('div');
            thumbEntry.className = 'thumbnail-entry';
            thumbEntry.dataset.pageNumber = pageNumber;
            thumbEntry.dataset.scrollPos = pageScrollPos;
            Object.assign(thumbEntry.style, {
                margin: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: '0',
                transition: 'opacity 0.5s'
            });
            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.width = `${200 * thumbnailZoomFactor}px`;
            img.style.height = 'auto';
            img.name = `page_${pageNumber}`;
            thumbEntry.appendChild(img);
            const pageLabel = document.createElement('div');
            pageLabel.innerText = `Page ${pageNumber}`;
            pageLabel.style.marginTop = '5px';
            thumbEntry.appendChild(pageLabel);
            thumbEntry.addEventListener('click', () => {
                exitThumbnailView();
                isGroupingEnabled = false;
                isSectionGroupingEnabled = false;
                const targetPos = parseInt(thumbEntry.dataset.scrollPos, 10);
                if (scrollable) scrollable.scrollTop = targetPos;
            });
            if (!isGroupingEnabled && !isSectionGroupingEnabled) {
                insertThumbnailInOrder(thumbEntry, pageNumber);
            }
            capturedPageData[pageNumber] = { thumbEntry, headings: new Set() };
            setTimeout(() => { thumbEntry.style.opacity = '1'; }, 50);
            capturedPages.add(pageNumber);
        });
        updateProgressBar();
    };

    const capturePagesWrapper = () => {
        capturePages();
        if (isGroupingEnabled) {
            renderGroupedThumbnails();
        } else if (isSectionGroupingEnabled) {
            // Call without waiting so that scrolling is not blocked.
            renderSectionGroupedPages();
        }
    };

    const startObservingPages = () => {
        const container = document.querySelector('.kix-rotatingtilemanager-content');
        if (!container) return;
        mutationObserver = new MutationObserver(() => {
            clearTimeout(captureTimeoutId);
            captureTimeoutId = setTimeout(capturePagesWrapper, 100);
        });
        mutationObserver.observe(container, { childList: true, subtree: true, attributes: true });
    };

    const stopObservingPages = () => {
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
    };

    // ---------------------------
    // 8. Fast Scroll Simulation
    // ---------------------------
    const simulateScrollSequence = async () => {
        const scrollable = getScrollableElement();
        if (!scrollable) return;
        scrollable.scrollTop = 0;
        startObservingPages();
        capturePagesWrapper();
        const intervalId = setInterval(() => {
            if (cancelScrollSequence) {
                clearInterval(intervalId);
                return;
            }
            const { scrollTop, clientHeight, scrollHeight } = scrollable;
            const newScroll = scrollTop + clientHeight;
            if (newScroll >= scrollHeight) {
                scrollable.scrollTop = scrollHeight;
                capturePagesWrapper();
                if (progressBarInner) progressBarInner.style.background = '#2684fc';
                clearInterval(intervalId);
                console.log("Reached bottom of page, scroll sequence complete.");
                recordHeadingStartingPages().then(() => {
                    assignPagesToGroups();
                    if (isGroupingEnabled) {
                        renderGroupedThumbnails();
                    }
                });
            } else {
                scrollable.scrollTop = newScroll;
                capturePagesWrapper();
            }
        }, 50);
    };

    // ---------------------------
    // 9. Thumbnail View Toggle & Cleanup
    // ---------------------------
    const createProgressBar = () => {
        if (!pagesViewButton) return;
        progressBarContainer = document.createElement('div');
        Object.assign(progressBarContainer.style, {
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%) translateY(1px)',
            width: '60%',
            height: '2px',
            background: 'transparent',
            pointerEvents: 'none'
        });
        progressBarInner = document.createElement('div');
        Object.assign(progressBarInner.style, {
            height: '100%',
            width: '0%',
            background: '#555'
        });
        progressBarContainer.appendChild(progressBarInner);
        pagesViewButton.appendChild(progressBarContainer);
    };

    const removeProgressBar = () => {
        progressBarContainer?.remove();
        progressBarContainer = progressBarInner = null;
    };

    const updateProgressBar = () => {
        if (!progressBarInner) return;
        const tooltipElem = document.querySelector('div.jfk-tooltip-contentId[style*="direction: ltr"]');
        if (!tooltipElem) return setTimeout(updateProgressBar, 500);
        const match = tooltipElem.textContent.match(/of\s*(\d+)/);
        if (!match) return;
        const maxPages = parseInt(match[1], 10);
        if (maxPages === 0) return;
        const progressPercent = Math.min((capturedPages.size / maxPages) * 100, 100);
        progressBarInner.style.width = progressPercent + '%';
    };

    const toggleThumbnailView = () => {
        if (!isThumbnailViewActive) {
            cancelScrollSequence = false;
            // Reset heading click cancellation.
            cancelHeadingClicks = false;
            // Store the initially selected tab element.
            initialSelectedTab = document.querySelector('.chapter-item-label-and-buttons-container.chapter-item-label-and-buttons-container-selected');

            // Start monitoring the selected tab.
            tabSelectionIntervalId = setInterval(() => {
                // If the initially selected tab no longer exists or lost the selected class, close overlay.
                if (!initialSelectedTab || !initialSelectedTab.classList.contains('chapter-item-label-and-buttons-container-selected')) {
                    console.log("Current tab is no longer selected. Closing overlay.");
                    exitThumbnailView();
                }
            }, 1000);

            saveScrollPosition();
            createThumbnailOverlay();
            simulateScrollSequence();
            isThumbnailViewActive = true;
            attachZoomListeners();
            createProgressBar();
            createCustomMenu(pagesViewButton);
            pagesViewButton.classList.add('active');
            // Check for header bubble at the start.
            const headerBubbleExists = document.querySelector('div.docs-bubble.kix-header-footer-bubble') &&
                  window.getComputedStyle(document.querySelector('div.docs-bubble.kix-header-footer-bubble')).display !== 'none';
            if (headerBubbleExists) {
                console.log("Header bubble detected on Pages View open; section grouping available.");
            } else {
                console.log("No header bubble detected on Pages View open; section grouping disabled.");
            }
        } else {
            exitThumbnailView();
        }
    };

    const exitThumbnailView = (skipRestore = false) => {
        if (tabSelectionIntervalId) {
            clearInterval(tabSelectionIntervalId);
            tabSelectionIntervalId = null;
        }
        cancelHeadingClicks = true;
        cancelScrollSequence = true;
        removeThumbnailOverlay();
        removeProgressBar();
        document.getElementById('customMenu')?.remove();
        if (!skipRestore) restoreScrollPosition();
        stopObservingPages();
        capturedPages.clear();
        Object.keys(capturedPageData).forEach(key => delete capturedPageData[key]);
        headingGroupsArr = [];
        isThumbnailViewActive = false;
        isGroupingEnabled = false;
        isSectionGroupingEnabled = false;
        detachZoomListeners();
        pagesViewButton?.classList.remove('active');
    };

    // ---------------------------
    // 10. Button Management
    // ---------------------------
    const waitForElement = (selector, timeout = 20000) =>
    new Promise((resolve, reject) => {
        const observer = new MutationObserver((_, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout waiting for element: ${selector}`));
        }, timeout);
    });

    const addPagesViewButton = referenceElement => {
        const newButton = document.createElement('div');
        newButton.setAttribute('role', 'button');
        newButton.className = 'goog-inline-block jfk-button jfk-button-standard kix-outlines-widget-header-add-chapter-button-icon custom-pages-view-button';
        newButton.tabIndex = 0;
        newButton.setAttribute('data-tooltip-class', 'kix-outlines-widget-header-add-chapter-button-tooltip');
        newButton.setAttribute('aria-label', 'Pages view');
        newButton.setAttribute('data-tooltip', 'Pages view');

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'docs-icon goog-inline-block';
        const iconInner = document.createElement('div');
        iconInner.className = 'docs-icon-img-container docs-icon-img docs-icon-editors-ia-content-copy';

        iconInner.setAttribute('aria-hidden', 'true');
        iconInner.textContent = '\u00A0';
        iconWrapper.appendChild(iconInner);
        newButton.appendChild(iconWrapper);

        // Inject button styles.
        const style = document.createElement('style');
        style.textContent = `
      .custom-pages-view-button {
        user-select: none;
        direction: ltr;
        visibility: visible;
        position: relative;
        display: inline-block;
        cursor: pointer;
        font-size: 11px;
        text-align: center;
        white-space: nowrap;
        line-height: 27px;
        outline: 0;
        color: #333;
        border: 1px solid rgba(0,0,0,.1);
        font-family: "Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        font-weight: 500;
        background-color: transparent;
        background-image: none;
        border-radius: 50%;
        border-width: 0;
        box-shadow: none;
        min-width: unset;
        height: 28px;
        margin: 2px;
        padding: 0;
        width: 28px;
        transition: background-color 0.3s ease;
      }
      .custom-pages-view-button:hover {
        background-color: rgba(0,0,0,0.1);
      }
      .custom-pages-view-button.active,
      .custom-menu-button.active {
        background-color: rgba(0,0,0,0.1);
      }
      .custom-menu-button:focus,
      .custom-menu-button:active {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }
      .custom-menu-button.active {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
        background-color: rgba(0,0,0,0.1);
      }
    `;
      document.head.appendChild(style);
      referenceElement.parentNode.insertBefore(newButton, referenceElement.nextSibling);
      pagesViewButton = newButton;
      newButton.addEventListener('click', toggleThumbnailView);
  };

    const createCustomMenu = referenceButton => {
        const menu = document.createElement('div');
        menu.id = 'customMenu';
        const rect = referenceButton.getBoundingClientRect();
        Object.assign(menu.style, {
            position: 'absolute',
            left: (rect.left - 180) + 'px',
            top: (rect.top - 55) + 'px',
            width: '200px',
            backgroundColor: '#fff',
            borderRadius: '26px',
            padding: '8px',
            zIndex: '10001',
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
            fontWeight: '400',
            fontSize: '13px',
            color: '#000',
            cursor: 'default',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        });

        for (let i = 1; i <= 4; i++) {
            const btn = document.createElement('div');
            btn.className = 'goog-inline-block jfk-button jfk-button-standard custom-pages-view-button custom-menu-button';
            btn.tabIndex = 0;
            Object.assign(btn.style, {
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });
            if (i === 1) {
                // Section grouping button
                btn.setAttribute('data-tooltip', 'Section grouping');
            } else if (i === 2) {
                // Heading grouping button
                btn.setAttribute('data-tooltip', 'Heading grouping');
            } else if (i === 3) {
                btn.setAttribute('data-tooltip', 'Left-to-right');
            } else if (i === 4) {
                btn.setAttribute('data-tooltip', 'Right-to-left');
            }
            btn.setAttribute('data-tooltip-class', 'kix-outlines-widget-header-add-chapter-button-tooltip');

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'docs-icon goog-inline-block goog-menuitem-icon';
            iconWrapper.setAttribute('aria-hidden', 'true');
            iconWrapper.style.userSelect = 'none';

            const iconInner = document.createElement('div');
            iconInner.className = 'docs-icon-img-container docs-icon-img';
            iconInner.style.userSelect = 'none';
            if (i === 1 || i === 2) {
  iconInner.style.transform = 'translate(1px, 0px)';
}
btn.appendChild(iconInner);


            if (i === 1) {
                // Section Grouping: square grid icon
                iconInner.classList.add('docs-icon-editors-ia-square-grid-view');
                btn.addEventListener('click', async () => {
                    isSectionGroupingEnabled = !isSectionGroupingEnabled;
                    btn.classList.toggle('active', isSectionGroupingEnabled);
                    if (isSectionGroupingEnabled) {
                        // First, check if header bubbles already exist.
                        let headerBubbles = Array.from(document.querySelectorAll('div.docs-bubble.kix-header-footer-bubble'))
                        .filter(bubble => window.getComputedStyle(bubble).display !== 'none');
                        if (!headerBubbles.length) {
                            // If not, trigger the header chain and wait until bubbles appear (up to 3000ms).
                            clickHeaderChain();
                            headerBubbles = await waitForHeaderBubbles(3000);
                        }
                        if (headerBubbles.length) {
                            renderSectionGroupedPages();
                        } else {
                            console.log("Header bubble not loaded; section grouping will not be applied.");
                        }
                    } else {
                        // Revert to flat view.
                        if (thumbnailOverlay) {
                            thumbnailOverlay.replaceChildren();
                            Object.keys(capturedPageData)
                                .map(Number)
                                .sort((a, b) => a - b)
                                .forEach(pageNum => {
                                const data = capturedPageData[pageNum];
                                if (data?.thumbEntry) {
                                    thumbnailOverlay.appendChild(data.thumbEntry);
                                }
                            });
                        }
                    }
                });
            }
            else if (i === 2) {
                // Heading Grouping: header/footer icon
                iconInner.classList.add('docs-icon-editors-ia-header-footer');
                // Ensure the button is positioned relative to its container so the progress bar aligns correctly.
                btn.style.position = 'relative';
                btn.addEventListener('click', () => {
                    isGroupingEnabled = !isGroupingEnabled;
                    btn.classList.toggle('active', isGroupingEnabled);
                    if (isGroupingEnabled) {
                        renderGroupedThumbnails();
                    } else {
                        if (thumbnailOverlay) {
                            thumbnailOverlay.replaceChildren();
                            Object.keys(capturedPageData)
                                .map(Number)
                                .sort((a, b) => a - b)
                                .forEach(pageNum => {
                                const data = capturedPageData[pageNum];
                                if (data?.thumbEntry) {
                                    thumbnailOverlay.appendChild(data.thumbEntry);
                                }
                            });
                        }
                    }
                });
                // Create a progress bar container similar to the pages view progress bar.
                const headingProgressContainer = document.createElement('div');
                Object.assign(headingProgressContainer.style, {
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(1px)',
                    width: '60%',
                    height: '2px',
                    background: 'transparent',
                    pointerEvents: 'none'
                });
                const headingProgressInner = document.createElement('div');
                headingProgressInner.id = 'headingProgressBar';
                Object.assign(headingProgressInner.style, {
                    height: '100%',
                    width: '0%',
                    background: '#2684fc'
                });
                headingProgressContainer.appendChild(headingProgressInner);
                btn.appendChild(headingProgressContainer);
            }

            else if (i === 3) {
                iconInner.classList.add('docs-icon-text-ltr-20');
                btn.addEventListener('click', () => {
                    setTextDirection('ltr');
                    document.querySelectorAll('#customMenu .custom-menu-button[data-tooltip="Left-to-right"], #customMenu .custom-menu-button[data-tooltip="Right-to-left"]')
                        .forEach(btnElem => {
                        btnElem.classList.toggle('active', btnElem.getAttribute('data-tooltip') === 'Left-to-right');
                    });
                });
                if (currentTextDirection === 'ltr') btn.classList.add('active');
            } else if (i === 4) {
                iconInner.classList.add('docs-icon-text-rtl-20');
                btn.addEventListener('click', () => {
                    setTextDirection('rtl');
                    document.querySelectorAll('#customMenu .custom-menu-button[data-tooltip="Left-to-right"], #customMenu .custom-menu-button[data-tooltip="Right-to-left"]')
                        .forEach(btnElem => {
                        btnElem.classList.toggle('active', btnElem.getAttribute('data-tooltip') === 'Right-to-left');
                    });
                });
                if (currentTextDirection === 'rtl') btn.classList.add('active');
            }
            iconWrapper.appendChild(iconInner);
            btn.appendChild(iconWrapper);
            menu.appendChild(btn);
        }
        document.body.appendChild(menu);
        return menu;
    };

    // ---------------------------
    // 11. Grouped Thumbnails Rendering (Heading Grouping)
    // ---------------------------
    const renderGroupedThumbnails = () => {
        if (!thumbnailOverlay) return;
        thumbnailOverlay.replaceChildren();
        headingGroupsArr.sort((a, b) => a.startingPage - b.startingPage).forEach(group => {
            const groupContainer = document.createElement('div');
            Object.assign(groupContainer.style, {
                margin: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#fff'
            });
            const headingTitle = document.createElement('div');
            headingTitle.textContent = group.headingText;
            headingTitle.style.fontWeight = 'bold';
            headingTitle.style.marginBottom = '5px';
            groupContainer.appendChild(headingTitle);
            const thumbsContainer = document.createElement('div');
            Object.assign(thumbsContainer.style, {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
            });
            Array.from(group.pages).sort((a, b) => a - b).forEach(pageNum => {
                const data = capturedPageData[pageNum];
                if (data?.thumbEntry) {
                    const thumbClone = data.thumbEntry.cloneNode(true);
                    thumbClone.addEventListener('click', () => {
                        exitThumbnailView();
                        const targetPos = parseInt(thumbClone.dataset.scrollPos, 10);
                        const scrollable = getScrollableElement();
                        if (scrollable) scrollable.scrollTop = targetPos;
                    });
                    thumbsContainer.appendChild(thumbClone);
                }
            });
            groupContainer.appendChild(thumbsContainer);
            thumbnailOverlay.appendChild(groupContainer);
        });
    };

    // ---------------------------
    // 11a. Section Grouping: Render Pages Grouped by Section
    // ---------------------------
    // Helper function to close unwanted menus (mimics the Borders and Shading behavior)
    function closeMenusExcept(exceptionsSelectors = []) {
        const allMenus = document.querySelectorAll(
            'div.goog-menu.goog-menu-vertical.docs-material.shell-menu.goog-menu-noaccel, div.goog-menu.goog-menu-vertical.docs-material'
        );
        allMenus.forEach(menu => {
            if (!exceptionsSelectors.some(selector => menu.matches(selector))) {
                menu.style.display = 'none';
                console.log('Closed unwanted menu:', menu);
            }
        });
        // Additionally, click the document body to clear any overlays.
        document.body.click();
    }

    // Asynchronous helper to ensure header bubbles are loaded
    const ensureHeaderBubblesLoaded = async (pauseScroll = true) => {
        // Check for existing visible header/footer bubbles.
        let headerBubbles = Array.from(document.querySelectorAll('div.docs-bubble.kix-header-footer-bubble'))
        .filter(bubble => window.getComputedStyle(bubble).display !== 'none');
        if (headerBubbles.length) {
            return headerBubbles;
        }

        // If no bubbles are found and pauseScroll is allowed, pause scroll simulation.
        if (pauseScroll) {
            cancelScrollSequence = true;
        }

        // --- Attempt 1: Direct click of "Header" ---
        let headerLabel = document.querySelector('div.goog-menuitem[role="menuitem"] span.goog-menuitem-label[aria-label^="Header"]');
        if (headerLabel) {
            const headerMenuItem = headerLabel.closest('div.goog-menuitem[role="menuitem"]');
            if (headerMenuItem) {
                console.log("Clicking Header menu item.");
                clickElement(headerMenuItem);
                await sleep(300);
                headerBubbles = await waitForHeaderBubbles();
                if (headerBubbles.length) {
                    closeMenusExcept([]); // Remove any menus that remain.
                    return headerBubbles;
                }
            }
        }

        // --- Attempt 2: Click "Header & Footer" then "Header" ---
        let headerFooterLabel = document.querySelector('div.goog-menuitem[role="menuitem"] span.goog-menuitem-label[aria-label*="Header & Footer"]');
        if (headerFooterLabel) {
            const headerFooterMenuItem = headerFooterLabel.closest('div.goog-menuitem[role="menuitem"]');
            if (headerFooterMenuItem) {
                console.log("Clicking Header & Footer menu item.");
                clickElement(headerFooterMenuItem);
                await sleep(300);
                headerLabel = document.querySelector('div.goog-menuitem[role="menuitem"] span.goog-menuitem-label[aria-label^="Header"]');
                if (headerLabel) {
                    const headerMenuItem = headerLabel.closest('div.goog-menuitem[role="menuitem"]');
                    if (headerMenuItem) {
                        console.log("Clicking Header menu item after Header & Footer.");
                        clickElement(headerMenuItem);
                        await sleep(300);
                    }
                }
                headerBubbles = await waitForHeaderBubbles();
                if (headerBubbles.length) {
                    closeMenusExcept([]);
                    return headerBubbles;
                }
            }
        }

        // --- Attempt 3: Use the Insert menu to insert header/footer ---
        const insertMenuButton = document.getElementById('docs-insert-menu');
        if (insertMenuButton) {
            console.log("Clicking Insert menu button to try to insert header and footer.");
            clickElement(insertMenuButton);
            await sleep(300);
            let insertHeaderFooterLabel = document.querySelector('div.goog-menuitem span.goog-menuitem-label[aria-label*="Header & footer"]');
            if (insertHeaderFooterLabel) {
                const insertHeaderFooterMenuItem = insertHeaderFooterLabel.closest('div.goog-menuitem[role="menuitem"]');
                if (insertHeaderFooterMenuItem) {
                    clickElement(insertHeaderFooterMenuItem);
                    await sleep(300);
                    headerLabel = document.querySelector('div.goog-menuitem[role="menuitem"] span.goog-menuitem-label[aria-label^="Header"]');
                    if (headerLabel) {
                        const headerMenuItem = headerLabel.closest('div.goog-menuitem[role="menuitem"]');
                        if (headerMenuItem) {
                            console.log("Clicking Header menu item after Insert menu.");
                            clickElement(headerMenuItem);
                            await sleep(300);
                        }
                    }
                }
                headerBubbles = await waitForHeaderBubbles();
                if (headerBubbles.length) {
                    closeMenusExcept([]);
                    return headerBubbles;
                }
            }
        }

        console.log("Header/footer bubble elements still not found after all attempts.");
        return headerBubbles;
    };

    // Updated renderSectionGroupedPages function that uses the helper above
    const renderSectionGroupedPages = async () => {
        if (!thumbnailOverlay) return;

        // Ensure header bubbles are loaded (only if they aren't already)
        const headerBubbles = await ensureHeaderBubblesLoaded();
        if (!headerBubbles.length) {
            console.log("Cannot proceed with section grouping; header bubbles are unavailable.");
            return;
        }

        // Group pages by section using header bubble descriptions.
        const sectionGroups = {};
        headerBubbles.forEach((bubble, index) => {
            const pageNumber = index + 1;
            const descriptionSpan = bubble.querySelector('.kix-header-footer-bubble-description');
            if (!descriptionSpan) {
                console.log("Header/footer bubble description not found for page " + pageNumber);
                return;
            }
            const text = descriptionSpan.textContent;
            // Capture strings like "Section 1" from descriptions such as "Header - Section 1"
            const match = text.match(/Section\s+\S+/);
            const sectionKey = match ? match[0] : 'Unknown Section';
            if (!sectionGroups[sectionKey]) sectionGroups[sectionKey] = new Set();
            sectionGroups[sectionKey].add(pageNumber);
        });

        // Clear the overlay and build the grouped thumbnails.
        thumbnailOverlay.replaceChildren();
        Object.keys(sectionGroups).sort().forEach(sectionKey => {
            const groupContainer = document.createElement('div');
            Object.assign(groupContainer.style, {
                margin: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#fff'
            });
            const header = document.createElement('div');
            header.textContent = sectionKey;
            header.style.fontWeight = 'bold';
            header.style.marginBottom = '5px';
            groupContainer.appendChild(header);
            const thumbsContainer = document.createElement('div');
            Object.assign(thumbsContainer.style, {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
            });
            Array.from(sectionGroups[sectionKey]).sort((a, b) => a - b).forEach(pageNum => {
                const data = capturedPageData[pageNum];
                if (data?.thumbEntry) {
                    const thumbClone = data.thumbEntry.cloneNode(true);
                    thumbClone.addEventListener('click', () => {
                        exitThumbnailView();
                        const targetPos = parseInt(thumbClone.dataset.scrollPos, 10);
                        const scrollable = getScrollableElement();
                        if (scrollable) scrollable.scrollTop = targetPos;
                    });
                    thumbsContainer.appendChild(thumbClone);
                }
            });
            groupContainer.appendChild(thumbsContainer);
            thumbnailOverlay.appendChild(groupContainer);
        });
    };

    // ---------------------------
    // 12. Initialization
    // ---------------------------
    waitForElement('.kix-outlines-widget-header-add-chapter-button')
        .then(addPagesViewButton)
        .catch(console.error);
})();
