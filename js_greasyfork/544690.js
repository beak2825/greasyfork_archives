// ==UserScript==
// @name         Sxyprn Sorter Plus
// @namespace    http://sxyprn.com/
// @version      6.2
// @description  Sort local media by upvotes/ratings with infinite scroll and custom styling
// @author       sharmanhall
// @match        *://sxyprn.com/*
// @match        *://sxyprn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544690/Sxyprn%20Sorter%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/544690/Sxyprn%20Sorter%20Plus.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Sxyprn Sorter Plus
// @namespace    https://greasyfork.org/en/users/866731-sharmanhall
// @version      6.0
// @description  Enhanced Sxyprn experience with smart sorting (likes, orgasmic, playlist, views), infinite scroll, custom auto-loading (1-100 pages), and toggleable UI improvements. Works on all page types with persistent settings.
// @author       sharmanhall
// @match        *://sxyprn.com/*
// @match        *://*.sxyprn.com/*
// @icon         https://sxyprn.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Custom CSS styles
    const customCSS = `

.sharing_toolbox,
.splitter {
  display: none;
}

.next_page,
.back_to,
.show_more,
.mysums_blog {
  background: none;
  border: none;
  padding: 12px 10px;
  margin: 12px 0;
}

#top_panel {
  padding: 20px 0;
}

#top_panel_menu span {
  padding-left: 32px;
  margin-left: 2px;
}

#player_el {
  height: auto;
}

.vid_container {
  border: none;
}

#wrapper_div {
  width: auto;
  margin: 0 100px;
}

#vid_container_id,
.post_el_post.post_el_small {
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.post_el_small {
  background: none;
  width: 556px;
  max-width: 100%;
  margin: 0;
}

.post_vid_thumb {
  display: inline-block;
  text-align: center;
}

.mini_post_vid_thumb {
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
}

.block_header {
  border: none;
}

.splitter_block_header {
  background: none;
  top: -32px;
}

.main_footer {
  font-size: 0.8125rem;
  text-align: center;
  border: none;
  margin: 36px 0 26px;
}

.main_footer span {
  font-size: 0.95rem;
  margin: 0 0.5rem;
}

#scroll_top_wrap {
  cursor: default;
}

#scroll_top_div {
  background: none;
  color: #ffffff;
  opacity: 0.2;
}

#scroll_top_wrap:hover #scroll_top_div {
  background: none;
  color: #ffffff;
  opacity: 0.5;
}



.sharing_toolbox,
.splitter {
  display: none;
}
.next_page,
.back_to,
.show_more,
.mysums_blog {
  background: none;
  border: none;
  padding: 12px 10px;
  margin: 12px 0;
}
#top_panel {
  padding: 20px 0;
}
#top_panel_menu span {
  padding-left: 32px;
  margin-left: 2px;
}
#player_el {
  height: auto;
}
.vid_container {
  border: none;
}
#wrapper_div {
  width: auto;
  margin: 0 100px;
}
#vid_container_id,
.post_el_post.post_el_small {
  width: 100%;
  max-width: 100%;
  margin: 0;
}
.post_el_small {
  background: none;
  width: 556px;
  max-width: 100%;
  margin: 0;
}
.post_vid_thumb {
  display: inline-block;
  text-align: center;
}
.mini_post_vid_thumb {
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
}
.block_header {
  border: none;
}
.splitter_block_header {
  background: none;
  top: -32px;
}
.main_footer {
  font-size: 0.8125rem;
  text-align: center;
  border: none;
  margin: 36px 0 26px;
}
.main_footer span {
  font-size: 0.95rem;
  margin: 0 0.5rem;
}
#scroll_top_wrap {
  cursor: default;
}
#scroll_top_div {
  background: none;
  color: #ffffff;
  opacity: 0.2;
}
#scroll_top_wrap:hover #scroll_top_div {
  background: none;
  color: #ffffff;
  opacity: 0.5;
}
    `;

    let customStyleElement = null;

    // Apply or remove custom styles
    function toggleCustomStyles(enable) {
        if (enable) {
            if (!customStyleElement) {
                customStyleElement = document.createElement('style');
                customStyleElement.id = 'custom-media-styles';
                customStyleElement.textContent = customCSS;
                document.head.appendChild(customStyleElement);
            }
        } else {
            if (customStyleElement) {
                customStyleElement.remove();
                customStyleElement = null;
            }
        }

        // Save preference
        localStorage.setItem('customStylesEnabled', enable.toString());
    }

    // Load saved preference
    function loadCustomStylesPreference() {
        const saved = localStorage.getItem('customStylesEnabled');
        return saved === null ? true : saved === 'true'; // Default to enabled
    }

    // Add sorting controls
    function addSortControls() {
        const searchResults = document.querySelector('.search_results');
        const mainContent = document.querySelector('.main_content');
        const targetContainer = searchResults || mainContent;

        if (!targetContainer) return;

        // Create sort control container
        const sortContainer = document.createElement('div');
        sortContainer.style.cssText = `
            background: #333;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        sortContainer.innerHTML = `
            <label style="color: white; font-weight: bold;">Sort by:</label>
            <button id="sortLikes" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Likes ↓
            </button>
            <button id="sortOrgasmic" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Orgasmic ↓
            </button>
            <button id="sortPlaylist" style="padding: 5px 10px; background: #ffc107; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Playlist ↓
            </button>
            <button id="sortViews" style="padding: 5px 10px; background: #6f42c1; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Views ↓
            </button>
            <button id="resetSort" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Reset
            </button>
            <div style="margin-left: 20px; display: flex; align-items: center; gap: 10px; border-left: 1px solid #555; padding-left: 20px;">
                <label style="color: white; font-weight: bold;">Auto-load:</label>
                <input type="number" id="autoLoadPages" min="1" max="100" value="3" placeholder="Pages" style="padding: 5px; border-radius: 3px; border: none; background: white; width: 60px; text-align: center;">
                <span style="color: #ccc; font-size: 12px;">pages</span>
                <button id="autoLoadStart" style="padding: 5px 10px; background: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Load Pages
                </button>
                <span id="autoLoadStatus" style="color: #ccc; font-size: 12px;"></span>
            </div>
            <div style="margin-left: 20px; display: flex; align-items: center; gap: 10px; border-left: 1px solid #555; padding-left: 20px;">
                <label style="color: white; font-weight: bold;">Custom Styles:</label>
                <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" id="customStylesToggle" style="cursor: pointer;">
                    <span style="color: white; font-size: 12px;">Enhanced UI</span>
                </label>
            </div>
        `;

        // Insert before target container
        targetContainer.parentNode.insertBefore(sortContainer, targetContainer);

        // Add event listeners
        document.getElementById('sortLikes').addEventListener('click', () => sortPosts('likes'));
        document.getElementById('sortOrgasmic').addEventListener('click', () => sortPosts('orgasmic'));
        document.getElementById('sortPlaylist').addEventListener('click', () => sortPosts('playlist'));
        document.getElementById('sortViews').addEventListener('click', () => sortPosts('views'));
        document.getElementById('resetSort').addEventListener('click', resetSort);
        document.getElementById('autoLoadStart').addEventListener('click', startAutoLoad);

        // Custom styles toggle
        const customStylesToggle = document.getElementById('customStylesToggle');
        customStylesToggle.checked = loadCustomStylesPreference();
        toggleCustomStyles(customStylesToggle.checked);

        customStylesToggle.addEventListener('change', (e) => {
            toggleCustomStyles(e.target.checked);
        });
    }

    // Store original order
    let originalOrder = null;

    function sortPosts(type) {
        const searchResults = document.querySelector('.search_results');
        const mainContent = document.querySelector('.main_content');
        const targetContainer = searchResults || mainContent;

        if (!targetContainer) return;

        const posts = Array.from(targetContainer.querySelectorAll('.post_el_small'));

        // Store original order if not already stored
        if (!originalOrder) {
            originalOrder = posts.slice();
        }

        posts.sort((a, b) => {
            let valueA = 0;
            let valueB = 0;

            switch(type) {
                case 'likes':
                    valueA = parseInt(a.querySelector('.vid_like_blog_hl')?.textContent || '0');
                    valueB = parseInt(b.querySelector('.vid_like_blog_hl')?.textContent || '0');
                    break;
                case 'orgasmic':
                    valueA = parseInt(a.querySelector('.tm_orgasmic_hl')?.textContent || '0');
                    valueB = parseInt(b.querySelector('.tm_orgasmic_hl')?.textContent || '0');
                    break;
                case 'playlist':
                    valueA = parseInt(a.querySelector('.tm_playlist_hl')?.textContent || '0');
                    valueB = parseInt(b.querySelector('.tm_playlist_hl')?.textContent || '0');
                    break;
                case 'views':
                    const viewsA = a.querySelector('.post_control_time')?.textContent || '';
                    const viewsB = b.querySelector('.post_control_time')?.textContent || '';
                    valueA = parseInt(viewsA.match(/(\d+)\s+views/)?.[1] || '0');
                    valueB = parseInt(viewsB.match(/(\d+)\s+views/)?.[1] || '0');
                    break;
            }

            return valueB - valueA; // Descending order
        });

        // Clear and re-append sorted posts
        posts.forEach(post => post.remove());
        posts.forEach(post => targetContainer.appendChild(post));

        // Update button states
        updateButtonStates(type);
    }

    function resetSort() {
        if (!originalOrder) return;

        const searchResults = document.querySelector('.search_results');
        const mainContent = document.querySelector('.main_content');
        const targetContainer = searchResults || mainContent;

        if (!targetContainer) return;

        // Remove all posts
        const currentPosts = targetContainer.querySelectorAll('.post_el_small');
        currentPosts.forEach(post => post.remove());

        // Re-append in original order
        originalOrder.forEach(post => targetContainer.appendChild(post));

        // Reset button states
        updateButtonStates(null);
    }

    function updateButtonStates(activeType) {
        const buttons = ['sortLikes', 'sortOrgasmic', 'sortPlaylist', 'sortViews'];
        const typeMap = {
            'likes': 'sortLikes',
            'orgasmic': 'sortOrgasmic',
            'playlist': 'sortPlaylist',
            'views': 'sortViews'
        };

        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                if (typeMap[activeType] === buttonId) {
                    button.style.background = '#0056b3';
                    button.style.fontWeight = 'bold';
                } else {
                    // Reset to original colors
                    switch(buttonId) {
                        case 'sortLikes':
                            button.style.background = '#007bff';
                            break;
                        case 'sortOrgasmic':
                            button.style.background = '#28a745';
                            break;
                        case 'sortPlaylist':
                            button.style.background = '#ffc107';
                            break;
                        case 'sortViews':
                            button.style.background = '#6f42c1';
                            break;
                    }
                    button.style.fontWeight = 'normal';
                }
            }
        });
    }

    // Initialize when page loads
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addSortControls);
        } else {
            addSortControls();
        }
    }

    init();

    // Also handle dynamic content loading
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const searchResults = document.querySelector('.search_results');
                const mainContent = document.querySelector('.main_content');
                const targetContainer = searchResults || mainContent;

                if (targetContainer && !document.getElementById('sortLikes')) {
                    setTimeout(addSortControls, 100);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Infinite scroll functionality
    let isLoading = false;
    let currentPageOffset = 0; // Track actual page offset instead of page number
    let hasNextPage = true;
    let autoLoadInProgress = false;
    let autoLoadTarget = 0;
    let autoLoadCurrent = 0;

    function getCurrentPageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        return parseInt(pageParam || '0');
    }

    function getNextPageURL() {
        const currentURL = new URL(window.location.href);
        const nextPageOffset = currentPageOffset + 30;

        currentURL.searchParams.set('page', nextPageOffset);
        return currentURL.toString();
    }

    function loadNextPage() {
        if (isLoading || !hasNextPage) return;

        isLoading = true;

        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'infinite-scroll-loading';
        loadingDiv.style.cssText = `
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #666;
            background: #f0f0f0;
            margin: 10px 0;
            border-radius: 5px;
        `;

        if (autoLoadInProgress) {
            loadingDiv.innerHTML = `Auto-loading page ${autoLoadCurrent + 1} of ${autoLoadTarget}...`;
        } else {
            loadingDiv.innerHTML = 'Loading more content...';
        }

        const searchResults = document.querySelector('.search_results');
        const mainContent = document.querySelector('.main_content');
        const targetContainer = searchResults || mainContent;

        if (targetContainer) {
            targetContainer.appendChild(loadingDiv);
        }

        fetch(getNextPageURL())
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newPosts = doc.querySelectorAll('.post_el_small');

                if (newPosts.length === 0) {
                    hasNextPage = false;
                    loadingDiv.innerHTML = 'No more content to load';
                    if (autoLoadInProgress) {
                        finishAutoLoad();
                    }
                    return;
                }

                // Remove loading indicator
                loadingDiv.remove();

                // Append new posts to current page
                newPosts.forEach(post => {
                    targetContainer.appendChild(post.cloneNode(true));
                });

                currentPageOffset += 30; // Increment by 30 for next page

                // Check if there's a next page link in the fetched content
                const nextPageLink = doc.querySelector('a[href*="page="]:has(.next_page)');
                if (!nextPageLink) {
                    hasNextPage = false;
                }

                isLoading = false;

                // Continue auto-loading if in progress
                if (autoLoadInProgress) {
                    autoLoadCurrent++;
                    updateAutoLoadStatus();

                    if (autoLoadCurrent >= autoLoadTarget || !hasNextPage) {
                        finishAutoLoad();
                    } else {
                        // Small delay between auto-loads to prevent overwhelming the server
                        setTimeout(() => {
                            loadNextPage();
                        }, 500);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading next page:', error);
                loadingDiv.innerHTML = 'Error loading content. Scroll to try again.';
                isLoading = false;
                if (autoLoadInProgress) {
                    finishAutoLoad();
                }
            });
    }

    function handleScroll() {
        if (isLoading || !hasNextPage || autoLoadInProgress) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;

        // Load next page when user is 200px from bottom
        if (scrollPosition >= documentHeight - 200) {
            loadNextPage();
        }
    }

    // Auto-load functionality
    function startAutoLoad() {
        const pagesToLoad = parseInt(document.getElementById('autoLoadPages').value);
        if (!pagesToLoad || pagesToLoad < 1) {
            alert('Please enter a valid number of pages (1-100)');
            return;
        }

        if (pagesToLoad > 100) {
            alert('Maximum 100 pages allowed');
            return;
        }

        autoLoadInProgress = true;
        autoLoadTarget = pagesToLoad;
        autoLoadCurrent = 0;

        const startButton = document.getElementById('autoLoadStart');
        startButton.disabled = true;
        startButton.textContent = 'Loading...';

        updateAutoLoadStatus();
        loadNextPage();
    }

    function updateAutoLoadStatus() {
        const statusEl = document.getElementById('autoLoadStatus');
        if (statusEl) {
            statusEl.textContent = `Loading ${autoLoadCurrent}/${autoLoadTarget} pages...`;
        }
    }

    function finishAutoLoad() {
        autoLoadInProgress = false;

        const startButton = document.getElementById('autoLoadStart');
        const statusEl = document.getElementById('autoLoadStatus');

        if (startButton) {
            startButton.disabled = false;
            startButton.textContent = 'Load Pages';
        }

        if (statusEl) {
            statusEl.textContent = `✓ Loaded ${autoLoadCurrent} pages. Manual scroll active.`;
            setTimeout(() => {
                statusEl.textContent = '';
            }, 3000);
        }
    }

    // Initialize infinite scroll
    function initInfiniteScroll() {
        currentPageOffset = getCurrentPageFromURL();

        // Check if next page exists on initial load
        const nextPageLink = document.querySelector('a[href*="page="]:has(i)');
        if (!nextPageLink || nextPageLink.textContent.includes('Next Page')) {
            hasNextPage = !!nextPageLink;
        }

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Hide existing pagination controls
        const paginationControls = document.querySelector('#center_control');
        const nextPageDiv = document.querySelector('.next_page');

        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        if (nextPageDiv && nextPageDiv.parentElement) {
            nextPageDiv.parentElement.style.display = 'none';
        }

        // Add infinite scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.id = 'scroll-indicator';
        scrollIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
        `;
        const pageNumber = Math.floor(currentPageOffset / 30) + 1;
        scrollIndicator.innerHTML = `📜 Infinite Scroll Active<br>Page ${pageNumber}`;
        document.body.appendChild(scrollIndicator);

        // Update page indicator on scroll
        window.addEventListener('scroll', () => {
            const currentPageNumber = Math.floor(currentPageOffset / 30) + 1;
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                indicator.innerHTML = `📜 Infinite Scroll Active<br>Page ${currentPageNumber}`;
            }
        });
    }

    // Initialize infinite scroll when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInfiniteScroll);
    } else {
        initInfiniteScroll();
    }

})();