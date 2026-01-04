// ==UserScript==
// @name        FreshRSS Duplicate Filter
// @namespace   https://github.com/hiroki-miya
// @version     1.0.4
// @description Mark as read and hide older articles in the FreshRSS feed list that have the same title, URL and content within a category or feed.
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/509575/FreshRSS%20Duplicate%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/509575/FreshRSS%20Duplicate%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const DEFAULT_CATEGORY_LIST = [];
    const DEFAULT_CHECK_LIMIT = 100;

    // Load saved settings
    let selectedCategories = GM_getValue('selectedCategories', DEFAULT_CATEGORY_LIST);
    let checkLimit = GM_getValue('checkLimit', DEFAULT_CHECK_LIMIT);

    // Add styles
    GM_addStyle(`
        #freshrss-duplicate-filter {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            width: max-content;
        }
        #freshrss-duplicate-filter > h2 {
            box-shadow: inset 0 0 0 0.5px black;
            padding: 5px 10px;
            text-align: center;
            cursor: move;
        }
        #freshrss-duplicate-filter > h4 {
            margin-top: 0;
        }
        #fdfs-categories {
            margin-bottom: 10px;
            max-height: 60vh;
            overflow-y: auto;
        }
    `);

    // Settings screen
    function showSettings() {
        const categories = Array.from(document.querySelectorAll('#sidebar a > span.title')).map(cat => cat.innerText);
        const selected = selectedCategories || [];

        let categoryOptions = categories.map(cat => {
            const checked = selected.includes(cat) ? 'checked' : '';
            return `<label><input type="checkbox" value="${cat}" ${checked}> ${cat}</label>`;
        }).join('');

        const limitInput = `<label>Check Limit: <input type="number" id="checkLimit" value="${checkLimit}" min="1"></label>`;

        const settingsHTML = `
                <h2>Duplicate Filter Settings</h2>
                <h4>Select category or feed</h4>
                <div id="fdfs-categories">${categoryOptions}</div>
                ${limitInput}
                <br>
                <button id="fdfs-save">Save</button>
                <button id="fdfs-close">Close</button>
        `;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = "freshrss-duplicate-filter";
        settingsDiv.innerHTML = settingsHTML;
        document.body.appendChild(settingsDiv);

        // Make settings panel draggable
        makeDraggable(settingsDiv);

        // Save button event
        document.getElementById('fdfs-save').addEventListener('click', () => {
            const selectedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
            const newLimit = parseInt(document.getElementById('checkLimit').value, 10);

            GM_setValue('selectedCategories', selectedCheckboxes);
            GM_setValue('checkLimit', newLimit);

            // Update the loaded settings
            selectedCategories = selectedCheckboxes;
            checkLimit = newLimit;

            showTooltip('Saved');

            // Mark duplicates as read after saving
            markDuplicatesAsRead();
        });

        // Close button event
        document.getElementById('fdfs-close').addEventListener('click', () => {
            document.body.removeChild(settingsDiv);
        });
    }

    // Register settings screen
    GM_registerMenuCommand('Settings', showSettings);

    // Function to display the tooltip
    function showTooltip(message) {
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px 20px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '16px';
        tooltip.style.textAlign = 'center';

        // Add the tooltip to the page
        document.body.appendChild(tooltip);

        // Automatically remove the tooltip after 1 second
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 1000);
    }

    // Make element draggable
    function makeDraggable(elmnt) {
        const header = elmnt.querySelector('h2');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Mark as read and hide articles
    function markAsDuplicate(articleElement) {
        if (!articleElement) return;

        // Check if mark_read function is available
        if (typeof mark_read === 'function') {
            mark_read(articleElement, true, true);
        } else {
            // Fallback: manually add 'read' class and trigger 'read' event
            articleElement.classList.add('read');
            const event = new Event('read');
            articleElement.dispatchEvent(event);
        }

        // Hide the article
        articleElement.remove();
    }

    // Check for duplicate articles and mark older ones as read (with retry support)
    function markDuplicatesAsRead(retryCount = 0) {
        const articles = Array.from(document.querySelectorAll('#stream > .flux'));

        // If no articles found and we haven't exceeded retry limit, wait and retry
        if (articles.length === 0 && retryCount < 10) {
            setTimeout(() => markDuplicatesAsRead(retryCount + 1), 300);
            return;
        }

        if (articles.length === 0) {
            return;
        }

        const articleMap = new Map();
        let duplicateCount = 0;

        articles.slice(-checkLimit).forEach(article => {
            const titleElement = article.querySelector('a.item-element.title');
            if (!titleElement) return;

            const title = titleElement.innerText;
            const url = titleElement.href;
            const timeElement = article.querySelector('.date > time');
            if (!timeElement) return;

            const articleData = { element: article, timestamp: new Date(timeElement.datetime).getTime() };

            // Duplicate check
            if (articleMap.has(title)) {
                const existingArticle = articleMap.get(title);
                if (existingArticle.url === url) {
                    const older = existingArticle.timestamp < articleData.timestamp ? existingArticle : articleData;

                    // Mark older articles as duplicates
                    markAsDuplicate(older.element);
                    duplicateCount++;
                }
            } else {
                articleMap.set(title, { ...articleData, url });
            }
        });
    }

    // Get the current category
    function getCurrentCategory() {
        const categoryElement = document.querySelector('.category.active > ul > li.active > a > span.title');
        if (categoryElement) {
            return categoryElement.innerText;
        } else {
            const categoryElement_cat = document.querySelector('.category.active > a > span.title');
            if (categoryElement_cat) {
                return categoryElement_cat.innerText;
            } else {
                return null;
            }
        }
    }

    // Check if should run in current category
    function shouldRunInCurrentCategory() {
        const currentCategory = getCurrentCategory();
        const shouldRun = currentCategory && selectedCategories.includes(currentCategory);
        return shouldRun;
    }

    // Debounce function to prevent excessive calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Main check function with debounce
    const debouncedCheck = debounce(() => {
        if (shouldRunInCurrentCategory()) {
            markDuplicatesAsRead();
        }
    }, 500);

    // Setup multiple detection methods
    function setupObserver() {
        const targetNode = document.querySelector('#stream');
        if (!targetNode) {
            setTimeout(setupObserver, 1000);
            return;
        }

        // Method 1: MutationObserver for #stream changes
        const streamObserver = new MutationObserver((mutations) => {
            // Check if articles were added
            const articlesAdded = mutations.some(mutation =>
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.classList && node.classList.contains('flux')
                )
            );

            if (articlesAdded) {
                debouncedCheck();
            }
        });
        streamObserver.observe(targetNode, { childList: true, subtree: false });

        // Method 2: URL change detection (for feed switching)
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Wait a bit for the content to load
                setTimeout(debouncedCheck, 800);
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });

        // Method 3: Sidebar click detection
        const sidebar = document.querySelector('#sidebar');
        if (sidebar) {
            sidebar.addEventListener('click', (e) => {
                const target = e.target.closest('a');
                if (target) {
                    setTimeout(debouncedCheck, 800);
                }
            }, true);
        }

        // Method 4: Watch for loading indicators
        const loadingObserver = new MutationObserver(() => {
            const loadingElement = document.querySelector('.loading, #load_more.loading');
            if (!loadingElement) {
                // Loading finished
                debouncedCheck();
            }
        });
        loadingObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
        });

        // Initial run
        setTimeout(() => {
            if (shouldRunInCurrentCategory()) {
                markDuplicatesAsRead();
            }
        }, 1500);
    }

    // Start setupObserver when the script starts
    setupObserver();
})();