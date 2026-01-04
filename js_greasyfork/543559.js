// ==UserScript==
// @name         Google Maps Enhanced Edits
// @namespace    https://github.com/gncnpk/google-maps-enhanced-edits
// @version      0.0.17
// @description  Adds quality of life tweaks to the editing experience in Google Maps.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://www.google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543559/Google%20Maps%20Enhanced%20Edits.user.js
// @updateURL https://update.greasyfork.org/scripts/543559/Google%20Maps%20Enhanced%20Edits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInit = false;
    let isEventHandlersInit = false;
    let oldHref = document.location.href;

    // Store observers for cleanup
    let autoCleanupObserver = null;
    let containerObserver = null;
    let bodyObserver = null;

    // inject a global CSS rule
    const style = document.createElement('style');
    style.textContent = `
    .qjoALb {
      margin-bottom: 0 !important;
    }
    .n6N0W {
      margin-bottom: 0 !important;
    }
    .zOQ8Le {
      margin-bottom: 4px !important;
    }
    .BjkJBb {
      margin: 6px !important;
    }
    .JjQyvd {
      margin: 0 8px 10px !important;
    }
    .mOLNZc {
      padding-top: 10px !important;
    }
    .Jo6p1e {
      padding: 10px !important;
    }
    .uLTO2d {
      margin: 8px !important;
    }
    .fontTitleLarge.HYVdIf:hover {
      text-decoration: underline;
    }

    /* Date filter disabled states */
    .quick-date-btn:disabled,
    .clear-date-btn:disabled {
      background: #e0e0e0 !important;
      color: #999 !important;
      cursor: not-allowed !important;
      border-color: #ccc !important;
    }
    input[type="date"]:disabled {
      background: #f5f5f5 !important;
      color: #999 !important;
      cursor: not-allowed !important;
    }

    /* Edit numbering styles */
    .edit-number {
      position: relative;
      margin-top: auto;
      margin-bottom: auto;
      margin-right: 5px;
      background: #4285f4;
      color: white;
      font-size: 12px;
      font-weight: bold;
      width: 24px;
      height: 24px;
      border-radius: 0%;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }
    .edit-number.hidden {
      display: none !important;
    }
    .edit-number.highlight {
      background: #ea4335 !important;
      transform: scale(1.2);
      box-shadow: 0 0 15px rgba(234, 67, 53, 0.8);
    }
    .Jo6p1e {
      position: relative !important;
    }
    .m6QErb.XiKgde.ecceSd.JoFlEe {
      width: auto !important;
    }
    .YWlkcf.fVTiyc {
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
    .PInAKb {
      border-radius: 0% !important;
      margin-right: 5px !important;
    }

    /* Go to edit number styles */
    .go-to-edit-container {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-bottom: 8px;
    }
    .go-to-edit-input {
      flex: 1;
      padding: 4px 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 12px;
    }
    .go-to-edit-btn {
      background: #4285f4;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .go-to-edit-btn:hover {
      background: #3367d6;
    }
    .go-to-edit-btn:disabled {
      background: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }

    /* Filter list styles */
    .filter-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 120px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #f9f9f9;
    }
    .filter-list-item {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #e0e0e0;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s ease;
    }
    .filter-list-item:last-child {
      border-bottom: none;
    }
    .filter-list-item:hover {
      background: #e8f0fe;
    }
    .filter-list-item.active {
      background: #4285f4;
      color: white;
      font-weight: bold;
    }
    .filter-list-item.active:hover {
      background: #3367d6;
    }
    .filter-count {
      font-size: 11px;
      background: rgba(0,0,0,0.1);
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 8px;
    }
    .filter-list-item.active .filter-count {
      background: rgba(255,255,255,0.2);
    }
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      flex-shrink: 0;
    }

    /* ===== PURE CSS CLEANUP RULES ===== */

    /* Hide first child of .eYfez elements */
    .eYfez > *:first-child {
      display: none !important;
    }

    /* Hide parent elements containing the symbol */
    *:has(> .MaIKSd.google-symbols.G47vBd) {
      display: none !important;
    }

    /* Hide status elements (they'll be replaced with colored borders) */
    .cLk0Bb, .UgJ9Rc, .ehaAif, .gZbGnf {
      display: none !important;
    }

    /* Add colored left borders based on status classes */
    .Jo6p1e:has(.cLk0Bb) {
      border-left: 10px solid #198639 !important; /* Accepted - Green */
    }
    .Jo6p1e:has(.UgJ9Rc) {
      border-left: 10px solid #b26c00 !important; /* Pending - Orange */
    }
    .Jo6p1e:has(.ehaAif) {
      border-left: 10px solid #dc362e !important; /* Not Accepted - Red */
    }
    .Jo6p1e:has(.gZbGnf) {
      border-left: 10px solid #5e5e5e !important; /* Incorrect - Gray */
    }

    /* Add tooltip styling and behavior */
    .fontTitleLarge.HYVdIf {
      cursor: pointer;
      position: relative;
    }
    .fontTitleLarge.HYVdIf::after {
      content: "Go to map edit";
      position: absolute;
      display: none;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      top: 100%;
      left: 0;
      margin-top: 4px;
    }
    .fontTitleLarge.HYVdIf:hover::after {
      display: block;
    }

    /* Fallback for browsers without :has() support */
    @supports not selector(*:has(*)) {
      .gmee-symbol-parent {
        display: none !important;
      }
      /* Fallback colored borders using class-based approach */
      .gmee-status-accepted .Jo6p1e {
        border-left: 10px solid #198639 !important;
      }
      .gmee-status-pending .Jo6p1e {
        border-left: 10px solid #b26c00 !important;
      }
      .gmee-status-not-accepted .Jo6p1e {
        border-left: 10px solid #dc362e !important;
      }
      .gmee-status-incorrect .Jo6p1e {
        border-left: 10px solid #5e5e5e !important;
      }
    }
  `;
    document.head.appendChild(style);

    // current filters
    let currentStatusFilter = null;
    let currentTypeFilter = null;
    let currentDateFilter = null; // Date object or null
    let currentDateRangeEnd = null; // Date object for range end or null
    let editsContainer = null;

    // DOM & state - Load numbering preference from localStorage
    let popup, btnContainer, typeContainer, dateContainer, statsDiv;
    let autoLoadEnabled = false;
    let numberingEnabled = localStorage.getItem('gmee-numbering-enabled') !== 'false'; // Default to true, false only if explicitly set
    let scrollContainer = null;
    let statusList = null;
    let typeList = null;

    // LocalStorage key for user preferences
    const STORAGE_KEY = 'gmee-numbering-enabled';

    // Function to save numbering preference
    function saveNumberingPreference() {
        localStorage.setItem(STORAGE_KEY, numberingEnabled.toString());
    }

    // Replace your old STATUSES definition with this:
    const STATUSES = [{
            name: 'Accepted',
            className: 'cLk0Bb',
            color: '#198639'
        },
        {
            name: 'Pending',
            className: 'UgJ9Rc',
            color: '#b26c00'
        },
        {
            name: 'Not Accepted',
            className: 'ehaAif',
            color: '#dc362e'
        },
        {
            name: 'Incorrect',
            className: 'gZbGnf',
            color: '#5e5e5e'
        }
    ];

    // Improved function to find edits container with multiple strategies
    function findEditsContainer() {
        // Strategy 1: Look for containers with edit items (.EhpEb class)
        const editItems = document.querySelectorAll('.EhpEb');
        if (editItems.length > 0) {
            // Find the common parent container
            let container = editItems[0].parentElement;
            while (container && container.children.length < editItems.length) {
                container = container.parentElement;
            }
            if (container && container.children.length >= editItems.length) {
                return container;
            }
        }

        // Strategy 2: Look for containers with multiple m6QErb XiKgde elements
        const containers = Array.from(document.querySelectorAll('.m6QErb.XiKgde'))
            .filter(el => {
                const parent = el.parentElement;
                return parent && Array.from(parent.children).filter(child =>
                    child.classList.contains('m6QErb') && child.classList.contains('XiKgde')
                ).length > 1;
            });

        if (containers.length > 0) {
            // Find the container with the most edit-like items
            let bestContainer = null;
            let maxEditItems = 0;

            containers.forEach(container => {
                const editCount = container.querySelectorAll('.EhpEb, .Jo6p1e').length;
                if (editCount > maxEditItems) {
                    maxEditItems = editCount;
                    bestContainer = container;
                }
            });

            if (bestContainer) {
                return bestContainer;
            }
        }

        // Strategy 3: Original fallback method
        const potentialContainers = document.getElementsByClassName('m6QErb XiKgde');
        for (let i = 0; i < potentialContainers.length; i++) {
            const container = potentialContainers[i];
            const editItems = container.querySelectorAll('.EhpEb');
            if (editItems.length > 0) {
                return container;
            }
        }

        return null;
    }

    // Improved function to find scroll container
    function findScrollContainer() {
        // Strategy 1: Find container with edits
        if (editsContainer) {
            let container = editsContainer;
            while (container && container !== document.body) {
                const style = getComputedStyle(container);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                    container.scrollHeight > container.clientHeight) {
                    return container;
                }
                container = container.parentElement;
            }
        }

        // Strategy 2: Look for common Google Maps scroll containers
        const commonScrollSelectors = [
            '.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde',
            '.CsJaGe',
            '.siAUzd.Vetdqc',
            '[role="main"]'
        ];

        for (const selector of commonScrollSelectors) {
            const container = document.querySelector(selector);
            if (container) {
                const style = getComputedStyle(container);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                    container.scrollHeight > container.clientHeight) {
                    return container;
                }
            }
        }

        // Strategy 3: Find any scrollable container that contains edits
        const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const style = getComputedStyle(el);
            return (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                el.scrollHeight > el.clientHeight &&
                el.querySelector('.EhpEb');
        });

        return scrollableElements.length > 0 ? scrollableElements[0] : null;
    }

    // Function to go to specific edit number
    function goToEditNumber(targetNumber) {
        if (!editsContainer || !numberingEnabled) {
            alert('Edit numbering must be enabled to use this feature');
            return;
        }

        // Get all visible edit items
        const allItems = Array.from(editsContainer.children);
        const visibleItems = allItems.filter(item => getComputedStyle(item).display !== 'none');

        if (targetNumber < 1 || targetNumber > visibleItems.length) {
            alert(`Please enter a number between 1 and ${visibleItems.length}`);
            return;
        }

        const targetItem = visibleItems[targetNumber - 1];
        if (!targetItem) return;

        // Clear any existing highlights
        document.querySelectorAll('.edit-number.highlight').forEach(el => {
            el.classList.remove('highlight');
        });

        // Find and highlight the target edit number
        const numberElement = targetItem.querySelector('.edit-number');
        if (numberElement) {
            numberElement.classList.add('highlight');

            // Remove highlight after 3 seconds
            setTimeout(() => {
                numberElement.classList.remove('highlight');
            }, 3000);
        }

        // Scroll to the target item
        if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const itemRect = targetItem.getBoundingClientRect();

            // Calculate scroll position to center the item
            const scrollTop = scrollContainer.scrollTop + itemRect.top - containerRect.top - (containerRect.height / 2) + (itemRect.height / 2);

            scrollContainer.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        } else {
            // Fallback: scroll into view
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Deinitialize function to clean up when leaving edits page
    function deinitializeEditsUI() {
        console.log('Deinitializing Google Maps Enhanced Edits UI');

        // Remove popup
        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
            popup = null;
        }

        // Disconnect observers
        if (autoCleanupObserver) {
            autoCleanupObserver.disconnect();
            autoCleanupObserver = null;
        }

        if (containerObserver) {
            containerObserver.disconnect();
            containerObserver = null;
        }

        if (bodyObserver) {
            bodyObserver.disconnect();
            bodyObserver = null;
        }

        // Reset variables
        currentStatusFilter = null;
        currentTypeFilter = null;
        currentDateFilter = null;
        currentDateRangeEnd = null;
        editsContainer = null;
        btnContainer = null;
        typeContainer = null;
        dateContainer = null;
        statsDiv = null;
        autoLoadEnabled = false;
        scrollContainer = null;
        statusList = null;
        typeList = null;

        // Reset initialization flags
        isInit = false;

        // Hide edit numbers instead of removing them
        document.querySelectorAll('.edit-number').forEach(el => el.classList.add('hidden'));

        // Remove CSS classes for symbol parents (fallback cleanup)
        document.querySelectorAll('.gmee-symbol-parent').forEach(el => {
            el.classList.remove('gmee-symbol-parent');
        });

        console.log('UI deinitialized successfully');
    }

    // Toggle auto load on/off
    function toggleAutoLoad() {
        autoLoadEnabled = !autoLoadEnabled;

        if (autoLoadEnabled && scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }

        // Update toggle button text and color
        const autoLoadBtn = document.querySelector('.toggle-autoload-btn');
        if (autoLoadBtn) {
            autoLoadBtn.textContent = autoLoadEnabled ? 'Disable Auto Load' : 'Enable Auto Load';
            autoLoadBtn.style.backgroundColor = autoLoadEnabled ? '#ea4335' : '#34a853';
        }
    }

    // Helper function to parse date from edit text
    function parseEditDate(dateText) {
        if (!dateText) return null;

        const now = new Date();
        let editDate;

        // Handle "Submitted [Month] [Day]" format (e.g., "Submitted Aug 7")
        if (dateText.includes('Submitted')) {
            const submittedMatch = dateText.match(/Submitted\s+([A-Za-z]+)\s+(\d+)/i);
            if (submittedMatch) {
                const monthStr = submittedMatch[1];
                const day = parseInt(submittedMatch[2]);
                const currentYear = now.getFullYear();

                // Parse the month name to get month index
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                let monthIndex = monthNames.findIndex(m => monthStr.toLowerCase().startsWith(m.toLowerCase()));
                if (monthIndex === -1) {
                    monthIndex = fullMonthNames.findIndex(m => monthStr.toLowerCase() === m.toLowerCase());
                }

                if (monthIndex !== -1) {
                    editDate = new Date(currentYear, monthIndex, day);

                    // If the date is in the future, assume it's from last year
                    if (editDate > now) {
                        editDate.setFullYear(currentYear - 1);
                    }
                }
            }
        }
        // Handle relative dates like "2 days ago", "1 week ago", etc.
        else if (dateText.includes('ago')) {
            const match = dateText.match(/(\d+)\s*(day|week|month|year)s?\s*ago/i);
            if (match) {
                const amount = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                editDate = new Date(now);

                switch (unit) {
                    case 'day':
                        editDate.setDate(editDate.getDate() - amount);
                        break;
                    case 'week':
                        editDate.setDate(editDate.getDate() - (amount * 7));
                        break;
                    case 'month':
                        editDate.setMonth(editDate.getMonth() - amount);
                        break;
                    case 'year':
                        editDate.setFullYear(editDate.getFullYear() - amount);
                        break;
                }
            }
        }
        // Handle "today", "yesterday" text
        else if (dateText.toLowerCase().includes('today')) {
            editDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (dateText.toLowerCase().includes('yesterday')) {
            editDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            editDate.setDate(editDate.getDate() - 1);
        } else {
            // Try to parse absolute dates
            editDate = new Date(dateText);
            if (isNaN(editDate.getTime())) {
                return null;
            }
        }

        return editDate && !isNaN(editDate.getTime()) ? editDate : null;
    }

    // Helper function to get date range of available edits
    function getEditDateRange() {
        if (!editsContainer) return {
            min: null,
            max: null,
            hasEdits: false
        };

        const editItems = Array.from(editsContainer.children);
        const dates = [];

        editItems.forEach(item => {
            // Skip items that are still loading
            if (isEditItemLoading(item)) return;

            const dateElement = item.querySelector('.fontBodySmall.eYfez');
            if (dateElement) {
                const dateText = dateElement.textContent.trim();
                const parsedDate = parseEditDate(dateText);
                if (parsedDate) {
                    dates.push(parsedDate);
                }
            }
        });

        if (dates.length === 0) {
            return {
                min: null,
                max: null,
                hasEdits: false
            };
        }

        const sortedDates = dates.sort((a, b) => a - b);
        return {
            min: sortedDates[0],
            max: sortedDates[sortedDates.length - 1],
            hasEdits: true
        };
    }

    // Helper function to update date input constraints
    function updateDateInputConstraints() {
        const startDateInput = dateContainer.querySelector('input[type="date"]:first-of-type');
        const endDateInput = dateContainer.querySelector('input[type="date"]:last-of-type');
        const quickDateButtons = dateContainer.querySelectorAll('.quick-date-btn');
        const clearBtn = dateContainer.querySelector('.clear-date-btn');

        if (!startDateInput || !endDateInput) return;

        const dateRange = getEditDateRange();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Set max date to today for both inputs
        startDateInput.max = todayStr;
        endDateInput.max = todayStr;

        if (dateRange.hasEdits) {
            // Set min date to earliest edit date
            const minDateStr = dateRange.min.toISOString().split('T')[0];
            startDateInput.min = minDateStr;
            endDateInput.min = minDateStr;

            // Enable inputs and buttons
            startDateInput.disabled = false;
            endDateInput.disabled = false;
            quickDateButtons.forEach(btn => btn.disabled = false);
            clearBtn.disabled = currentDateFilter === null;

            // Update placeholder text
            startDateInput.title = `Select date between ${dateRange.min.toLocaleDateString()} and ${today.toLocaleDateString()}`;
            endDateInput.title = `Select date between ${dateRange.min.toLocaleDateString()} and ${today.toLocaleDateString()}`;
        } else {
            // Disable inputs and buttons when no edits are available
            startDateInput.disabled = true;
            endDateInput.disabled = true;
            startDateInput.value = '';
            endDateInput.value = '';
            quickDateButtons.forEach(btn => btn.disabled = true);
            clearBtn.disabled = true;

            // Update placeholder text
            startDateInput.title = 'No edits available for date filtering';
            endDateInput.title = 'No edits available for date filtering';
        }
    }

    // Helper function to update go-to-edit input constraints
    function updateGoToEditConstraints() {
        const goToInput = popup?.querySelector('.go-to-edit-input');
        const goToBtn = popup?.querySelector('.go-to-edit-btn');

        if (!goToInput || !goToBtn || !editsContainer) return;

        const visibleItems = Array.from(editsContainer.children).filter(item =>
            getComputedStyle(item).display !== 'none'
        );

        const maxNumber = visibleItems.length;

        if (maxNumber === 0) {
            goToInput.disabled = true;
            goToBtn.disabled = true;
            goToInput.placeholder = 'No edits available';
            goToInput.title = 'No edits available to navigate to';
        } else {
            goToInput.disabled = false;
            goToBtn.disabled = !numberingEnabled;
            goToInput.placeholder = `1-${maxNumber}`;
            goToInput.title = numberingEnabled ?
                `Enter edit number between 1 and ${maxNumber}` :
                'Enable edit numbering to use this feature';
            goToInput.max = maxNumber;
            goToInput.min = 1;
        }
    }

    // Helper function to check if an edit item is still loading
    function isEditItemLoading(item) {
        // Check for common indicators that content is still loading
        const dateElement = item.querySelector('.fontBodySmall.eYfez');
        const titleElement = item.querySelector('.fontTitleLarge.HYVdIf');
        const typeElement = item.querySelectorAll('.BjkJBb')[0]?.children[1];

        // If key elements are missing or empty, consider it still loading
        if (!dateElement || !titleElement || !typeElement) return true;
        if (!dateElement.textContent.trim() || !titleElement.textContent.trim() || !typeElement.textContent.trim()) return true;

        // Check for loading indicators or placeholder text
        const dateText = dateElement.textContent.trim();
        const titleText = titleElement.textContent.trim();

        if (dateText.includes('Loading') || titleText.includes('Loading') ||
            dateText === '...' || titleText === '...') return true;

        return false;
    }

    // Helper function to check if edit date is in selected range
    function isDateInRange(dateText) {
        if (!currentDateFilter) return true;

        // If date text is empty or not yet loaded, don't filter it out
        if (!dateText || dateText.trim() === '') return true;

        const editDate = parseEditDate(dateText);
        if (!editDate) return true; // Include items we can't parse or that haven't loaded yet

        const editDateOnly = new Date(editDate.getFullYear(), editDate.getMonth(), editDate.getDate());
        const filterDateOnly = new Date(currentDateFilter.getFullYear(), currentDateFilter.getMonth(), currentDateFilter.getDate());

        if (currentDateRangeEnd) {
            // Range filtering
            const endDateOnly = new Date(currentDateRangeEnd.getFullYear(), currentDateRangeEnd.getMonth(), currentDateRangeEnd.getDate());
            return editDateOnly >= filterDateOnly && editDateOnly <= endDateOnly;
        } else {
            // Single date filtering
            return editDateOnly.getTime() === filterDateOnly.getTime();
        }
    }

    // Add numbering to all edit items
    function addEditNumbering() {
        const PANE_SELECTOR = '.EhpEb';
        document.querySelectorAll(PANE_SELECTOR).forEach((item, index) => {
            const wrap = item.querySelector('.qjoALb');
            if (!wrap) return;

            // Look for existing number element
            let existingNumber = wrap.querySelector('.edit-number');

            if (numberingEnabled) {
                if (existingNumber) {
                    // Reuse existing number element
                    existingNumber.textContent = index + 1;
                    existingNumber.classList.remove('hidden');
                } else {
                    // Create new number element if it doesn't exist
                    const numberElement = document.createElement('div');
                    numberElement.className = 'edit-number';
                    numberElement.textContent = index + 1;
                    wrap.insertBefore(numberElement, wrap.children[0]);
                }
            } else {
                // Hide existing number instead of removing it
                if (existingNumber) {
                    existingNumber.classList.add('hidden');
                }
            }
        });
    }

    // Simplified auto cleanup - only JS-dependent functions remain
    // Simplified auto cleanup - most functionality moved to CSS
    function setupAutoCleanup() {
        autoCleanupObserver = new MutationObserver(() => {
            if (autoLoadEnabled) {
                return;
            }
            replaceSpecificEdit();
            addEditNumberingLocal();
            legacyBrowserFallbacks();
        });

        function replaceSpecificEdit() {
            autoCleanupObserver.disconnect();
            document.querySelectorAll('.EhpEb').forEach(item => {
                const mediumEl = item.querySelector('.fontBodyMedium.JjQyvd.TqOXoe');
                const smallEl = item.querySelectorAll('.BjkJBb')[0]?.children[1];
                if (mediumEl && smallEl) {
                    const texts = Array.from(
                        mediumEl.querySelectorAll('.NlVald.xMSdlb')
                    ).map(el => el.textContent.trim());
                    smallEl.textContent = texts.join(', ');
                }
            });
            autoCleanupObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function addEditNumberingLocal() {
            autoCleanupObserver.disconnect();
            addEditNumbering();
            autoCleanupObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Only needed for browsers that don't support :has() selector
        function legacyBrowserFallbacks() {
            if (!CSS.supports('selector(*:has(*))')) {
                // Fallback for hiding symbol parents
                document.querySelectorAll('.MaIKSd.google-symbols.G47vBd').forEach(el => {
                    const p = el.parentElement;
                    if (p && !p.classList.contains('gmee-symbol-parent')) {
                        p.classList.add('gmee-symbol-parent');
                    }
                });

                // Fallback for status-based colored borders
                document.querySelectorAll('.EhpEb').forEach(item => {
                    // Remove old status classes
                    item.classList.remove('gmee-status-accepted', 'gmee-status-pending',
                        'gmee-status-not-accepted', 'gmee-status-incorrect');

                    // Add appropriate status class
                    if (item.querySelector('.cLk0Bb')) {
                        item.classList.add('gmee-status-accepted');
                    } else if (item.querySelector('.UgJ9Rc')) {
                        item.classList.add('gmee-status-pending');
                    } else if (item.querySelector('.ehaAif')) {
                        item.classList.add('gmee-status-not-accepted');
                    } else if (item.querySelector('.gZbGnf')) {
                        item.classList.add('gmee-status-incorrect');
                    }
                });
            }
        }

        // Initial pass
        replaceSpecificEdit();
        addEditNumberingLocal();
        legacyBrowserFallbacks();

        autoCleanupObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Update edit numbering based on visible items
    function updateEditNumbering() {
        if (!editsContainer || !numberingEnabled) return;

        const allItems = Array.from(editsContainer.children);
        let visibleIndex = 1;

        allItems.forEach(item => {
            const wrap = item.querySelector('.qjoALb');
            const numberElement = wrap?.querySelector('.edit-number');

            if (getComputedStyle(item).display !== 'none') {
                // Item is visible, update number
                if (numberElement) {
                    numberElement.textContent = visibleIndex;
                    numberElement.classList.remove('hidden');
                }
                visibleIndex++;
            } else {
                // Item is hidden, hide number
                if (numberElement) {
                    numberElement.classList.add('hidden');
                }
            }
        });
    }

    // Toggle edit numbering on/off
    function toggleEditNumbering() {
        numberingEnabled = !numberingEnabled;
        saveNumberingPreference(); // Save to localStorage

        // Update all existing numbers
        addEditNumbering();
        updateEditNumbering();

        // Update toggle button text
        const toggleBtn = document.querySelector('.toggle-numbering-btn');
        if (toggleBtn) {
            toggleBtn.textContent = numberingEnabled ? 'Hide Numbers' : 'Show Numbers';
            toggleBtn.style.backgroundColor = numberingEnabled ? '#ea4335' : '#34a853';
        }

        // Update go-to-edit constraints
        updateGoToEditConstraints();
    }

    // --- filterEdits() ---
    function filterEdits() {
        if (!editsContainer) return;

        // Find scroll container if not found yet
        if (!scrollContainer) {
            scrollContainer = findScrollContainer();
        }

        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        Array.from(editsContainer.children).forEach(item => {
            let visible = true;

            // If the item is still loading, always keep it visible to avoid premature filtering
            if (isEditItemLoading(item)) {
                item.style.display = '';
                return;
            }

            // status filter via CSS class
            if (currentStatusFilter) {
                const statusObj = STATUSES.find(s => s.name === currentStatusFilter);
                if (
                    !statusObj ||
                    !item.querySelector(`.${statusObj.className}`)
                ) {
                    visible = false;
                }
            }

            // type filter remains unchanged
            if (visible && currentTypeFilter) {
                const b = item.querySelectorAll('.BjkJBb')[0]?.children[1];
                if (!b) {
                    visible = false;
                } else {
                    const parts = b.textContent.split(',').map(p => p.trim());
                    if (!parts.includes(currentTypeFilter)) {
                        visible = false;
                    }
                }
            }

            // date filter
            if (visible && currentDateFilter) {
                const dateElement = item.querySelector('.fontBodySmall.eYfez');
                if (!dateElement) {
                    // If no date element exists yet, don't filter it out (content may still be loading)
                    visible = true;
                } else {
                    const dateText = dateElement.textContent.trim();
                    // If date text is empty or just whitespace, assume content is still loading
                    if (!dateText || dateText === '') {
                        visible = true;
                    } else {
                        if (!isDateInRange(dateText)) {
                            visible = false;
                        }
                    }
                }
            }

            item.style.display = visible ? '' : 'none';
        });

        // Update numbering after filtering
        updateEditNumbering();
    }

    // Update list item active states
    function updateActiveListItems() {
        // Update status list items
        if (statusList) {
            const statusItems = statusList.querySelectorAll('.filter-list-item');
            statusItems.forEach(item => {
                const isActive = item.dataset.status === currentStatusFilter;
                item.classList.toggle('active', isActive);
            });
        }

        // Update type list items
        if (typeList) {
            const typeItems = typeList.querySelectorAll('.filter-list-item');
            typeItems.forEach(item => {
                const isActive = item.dataset.type === currentTypeFilter;
                item.classList.toggle('active', isActive);
            });
        }
    }

    // make an element draggable by its header
    function makeDraggable(el, handleSelector) {
        const handle = el.querySelector(handleSelector);
        if (!handle) return;
        handle.style.cursor = 'move';
        let offsetX = 0,
            offsetY = 0;

        handle.addEventListener('pointerdown', e => {
            const r = el.getBoundingClientRect();
            el.style.left = `${r.left}px`;
            el.style.top = `${r.top}px`;
            el.style.right = 'auto';
            el.style.transform = 'none';
            offsetX = e.clientX - r.left;
            offsetY = e.clientY - r.top;
            el.setPointerCapture(e.pointerId);
            e.preventDefault();
        });

        el.addEventListener('pointermove', e => {
            if (!el.hasPointerCapture(e.pointerId)) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        });
        ['pointerup', 'pointercancel'].forEach(evt => {
            el.addEventListener(evt, e => {
                if (el.hasPointerCapture(e.pointerId)) {
                    el.releasePointerCapture(e.pointerId);
                }
            });
        });
    }

    function updateButtonsAndStats() {
        // find scroll container if not found yet
        if (!scrollContainer) {
            scrollContainer = findScrollContainer();
        }

        // grab only those items not hidden by filterEdits()
        const visibleItems = Array.from(editsContainer.children)
            .filter(item => getComputedStyle(item).display !== 'none');

        // --- STATUS COUNTS based on visibleItems ---
        const sCounts = {};
        STATUSES.forEach(s => {
            sCounts[s.name] = 0;
        });
        visibleItems.forEach(item => {
            STATUSES.forEach(s => {
                if (item.querySelector(`.${s.className}`)) {
                    sCounts[s.name]++;
                }
            });
        });

        const total = Object.values(sCounts).reduce((a, b) => a + b, 0);
        statsDiv.textContent = `Total edits: ${total}`;

        // Update status list
        updateStatusList(sCounts);

        // --- TYPE COUNTS based on visibleItems ---
        const typeCounts = {};
        visibleItems.forEach(item => {
            const b = item.querySelectorAll('.BjkJBb')[0]?.children[1];
            if (!b) return;
            b.textContent.split(',').forEach(part => {
                const txt = part.trim();
                if (!txt) return;
                typeCounts[txt] = (typeCounts[txt] || 0) + 1;
            });
        });

        // Update type list
        updateTypeList(typeCounts);

        // Update date filter display
        updateDateFilterDisplay();

        // Update date input constraints based on available edits
        updateDateInputConstraints();

        // Update go-to-edit constraints
        updateGoToEditConstraints();

        // Update edit numbering
        updateEditNumbering();

        // auto-scroll if needed
        if (autoLoadEnabled && scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }

        updateActiveListItems();
    }

    // Update status list
    function updateStatusList(sCounts) {
        if (!statusList) return;

        // Clear existing items
        statusList.innerHTML = '';

        STATUSES.forEach(s => {
            const count = sCounts[s.name] || 0;
            if (count > 0) {
                const listItem = document.createElement('li');
                listItem.className = 'filter-list-item';
                listItem.dataset.status = s.name;

                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'status-indicator';
                statusIndicator.style.backgroundColor = s.color;

                const nameSpan = document.createElement('span');
                nameSpan.textContent = s.name;

                const countSpan = document.createElement('span');
                countSpan.className = 'filter-count';
                countSpan.textContent = count;

                listItem.appendChild(statusIndicator);
                listItem.appendChild(nameSpan);
                listItem.appendChild(countSpan);

                listItem.addEventListener('click', () => {
                    currentStatusFilter = currentStatusFilter === s.name ? null : s.name;
                    filterEdits();
                    updateButtonsAndStats();
                });

                statusList.appendChild(listItem);
            }
        });
    }

    // Update type list
    function updateTypeList(typeCounts) {
        if (!typeList) return;

        // Clear existing items
        typeList.innerHTML = '';

        Object.entries(typeCounts).forEach(([type, count]) => {
            if (count > 0) {
                const listItem = document.createElement('li');
                listItem.className = 'filter-list-item';
                listItem.dataset.type = type;

                const nameSpan = document.createElement('span');
                nameSpan.textContent = type;

                const countSpan = document.createElement('span');
                countSpan.className = 'filter-count';
                countSpan.textContent = count;

                listItem.appendChild(nameSpan);
                listItem.appendChild(countSpan);

                listItem.addEventListener('click', () => {
                    currentTypeFilter = currentTypeFilter === type ? null : type;
                    filterEdits();
                    updateButtonsAndStats();
                });

                typeList.appendChild(listItem);
            }
        });
    }

    // Update date filter display
    function updateDateFilterDisplay() {
        const dateStatus = dateContainer.querySelector('.date-status');
        if (dateStatus) {
            if (currentDateFilter) {
                const startDate = currentDateFilter.toLocaleDateString();
                if (currentDateRangeEnd) {
                    const endDate = currentDateRangeEnd.toLocaleDateString();
                    dateStatus.textContent = `Filtering: ${startDate} - ${endDate}`;
                } else {
                    dateStatus.textContent = `Filtering: ${startDate}`;
                }
                dateStatus.style.color = '#4285f4';
                dateStatus.style.fontWeight = 'bold';
            } else {
                dateStatus.textContent = 'No date filter active';
                dateStatus.style.color = '#666';
                dateStatus.style.fontWeight = 'normal';
            }
        }
    }

    // Clear date filter
    function clearDateFilter() {
        currentDateFilter = null;
        currentDateRangeEnd = null;
        filterEdits();
        updateButtonsAndStats();
    }

    // build the floating popup
    function createPopup() {
        popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            padding: '10px',
            zIndex: '9999',
            textAlign: 'left',
            width: '280px'
        });

        // stats
        statsDiv = document.createElement('div');
        statsDiv.textContent = 'Total edits: 0';
        statsDiv.classList.add('drag-handle');
        statsDiv.style.marginBottom = '8px';
        popup.appendChild(statsDiv);

        // status header
        const statusHeader = document.createElement('div');
        statusHeader.textContent = 'Filter edits by status:';
        statusHeader.style.marginBottom = '4px';
        statusHeader.style.fontWeight = 'bold';
        popup.appendChild(statusHeader);

        // status list container
        btnContainer = document.createElement('div');
        btnContainer.style.marginBottom = '12px';

        statusList = document.createElement('ul');
        statusList.className = 'filter-list';
        btnContainer.appendChild(statusList);
        popup.appendChild(btnContainer);

        // type header
        const typeHeader = document.createElement('div');
        typeHeader.textContent = 'Filter edits by type:';
        typeHeader.style.marginBottom = '4px';
        typeHeader.style.fontWeight = 'bold';
        popup.appendChild(typeHeader);

        // type list container
        typeContainer = document.createElement('div');
        typeContainer.style.marginBottom = '12px';

        typeList = document.createElement('ul');
        typeList.className = 'filter-list';
        typeContainer.appendChild(typeList);
        popup.appendChild(typeContainer);

        // date header + container
        const dateHeader = document.createElement('div');
        dateHeader.textContent = 'Filter edits by date:';
        dateHeader.style.margin = '8px 0 4px';
        dateHeader.style.fontWeight = 'bold';
        popup.appendChild(dateHeader);

        dateContainer = document.createElement('div');

        // Date status display
        const dateStatus = document.createElement('div');
        dateStatus.className = 'date-status';
        dateStatus.textContent = 'No date filter active';
        dateStatus.style.cssText = `
            margin-bottom: 8px;
            font-size: 12px;
            color: #666;
        `;
        dateContainer.appendChild(dateStatus);

        // Date input container
        const dateInputContainer = document.createElement('div');
        dateInputContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 8px;
        `;

        // Start date input
        const startDateInput = document.createElement('input');
        startDateInput.type = 'date';
        startDateInput.style.cssText = `
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
        `;
        startDateInput.addEventListener('change', () => {
            if (startDateInput.value) {
                const selectedDate = new Date(startDateInput.value + 'T00:00:00');
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today

                // Validate date is not in the future
                if (selectedDate > today) {
                    alert('Cannot select a future date');
                    startDateInput.value = '';
                    return;
                }

                // Validate date is within available edit range
                const dateRange = getEditDateRange();
                if (dateRange.hasEdits && (selectedDate < dateRange.min || selectedDate > dateRange.max)) {
                    alert(`Please select a date between ${dateRange.min.toLocaleDateString()} and ${dateRange.max.toLocaleDateString()}`);
                    startDateInput.value = '';
                    return;
                }

                currentDateFilter = selectedDate;
                // If end date is set and start > end, clear end date
                if (currentDateRangeEnd && currentDateFilter > currentDateRangeEnd) {
                    currentDateRangeEnd = null;
                    endDateInput.value = '';
                }
                filterEdits();
                updateButtonsAndStats();
            } else {
                currentDateFilter = null;
                currentDateRangeEnd = null;
                filterEdits();
                updateButtonsAndStats();
            }
        });

        // End date input (for range selection)
        const endDateInput = document.createElement('input');
        endDateInput.type = 'date';
        endDateInput.placeholder = 'End date (optional)';
        endDateInput.style.cssText = `
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
        `;
        endDateInput.addEventListener('change', () => {
            if (endDateInput.value) {
                const selectedDate = new Date(endDateInput.value + 'T23:59:59');
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today

                // Validate date is not in the future
                if (selectedDate > today) {
                    alert('Cannot select a future date');
                    endDateInput.value = '';
                    return;
                }

                // Validate date is within available edit range
                const dateRange = getEditDateRange();
                if (dateRange.hasEdits && (selectedDate < dateRange.min || selectedDate > dateRange.max)) {
                    alert(`Please select a date between ${dateRange.min.toLocaleDateString()} and ${dateRange.max.toLocaleDateString()}`);
                    endDateInput.value = '';
                    return;
                }

                if (currentDateFilter && selectedDate >= currentDateFilter) {
                    currentDateRangeEnd = selectedDate;
                } else if (!currentDateFilter) {
                    // If no start date, set both to same date
                    currentDateFilter = new Date(endDateInput.value + 'T00:00:00');
                    currentDateRangeEnd = selectedDate;
                    startDateInput.value = endDateInput.value;
                } else {
                    // End date is before start date, swap them
                    currentDateRangeEnd = currentDateFilter;
                    currentDateFilter = new Date(endDateInput.value + 'T00:00:00');
                    startDateInput.value = endDateInput.value;
                }
                filterEdits();
                updateButtonsAndStats();
            } else {
                currentDateRangeEnd = null;
                filterEdits();
                updateButtonsAndStats();
            }
        });

        // Labels and inputs
        const startLabel = document.createElement('label');
        startLabel.textContent = 'Start date:';
        startLabel.style.fontSize = '12px';

        const endLabel = document.createElement('label');
        endLabel.textContent = 'End date (optional):';
        endLabel.style.fontSize = '12px';

        dateInputContainer.appendChild(startLabel);
        dateInputContainer.appendChild(startDateInput);
        dateInputContainer.appendChild(endLabel);
        dateInputContainer.appendChild(endDateInput);

        // Quick date buttons
        const quickDateContainer = document.createElement('div');
        quickDateContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 8px;
        `;

        const quickDates = [{
                name: 'Today',
                days: 0
            },
            {
                name: 'Yesterday',
                days: 1
            },
            {
                name: 'Last 7 days',
                days: 7
            },
            {
                name: 'Last 30 days',
                days: 30
            }
        ];

        quickDates.forEach(({
            name,
            days
        }) => {
            const btn = document.createElement('button');
            btn.textContent = name;
            btn.className = 'quick-date-btn';
            btn.style.cssText = `
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 11px;
                cursor: pointer;
                flex: 1;
            `;
            btn.addEventListener('click', () => {
                // Check if we have edits available
                const dateRange = getEditDateRange();
                if (!dateRange.hasEdits) {
                    alert('No edits available for date filtering');
                    return;
                }

                const now = new Date();
                if (days === 0) {
                    // Today only - check if we have edits for today
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (today < dateRange.min || today > dateRange.max) {
                        alert('No edits available for today');
                        return;
                    }
                    currentDateFilter = today;
                    currentDateRangeEnd = null;
                    startDateInput.value = currentDateFilter.toISOString().split('T')[0];
                    endDateInput.value = '';
                } else {
                    // Range from X days ago to today
                    let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1);
                    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                    // Adjust start date if it's before our earliest edit
                    if (startDate < dateRange.min) {
                        startDate = dateRange.min;
                    }

                    // Check if the range contains any edits
                    if (startDate > dateRange.max) {
                        alert(`No edits available in the last ${days} days`);
                        return;
                    }

                    currentDateFilter = startDate;
                    currentDateRangeEnd = endDate;
                    startDateInput.value = startDate.toISOString().split('T')[0];
                    endDateInput.value = endDate.toISOString().split('T')[0];
                }
                filterEdits();
                updateButtonsAndStats();
            });
            quickDateContainer.appendChild(btn);
        });

        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear Filter';
        clearBtn.className = 'clear-date-btn';
        clearBtn.style.cssText = `
            background: #dc362e;
            border: none;
            border-radius: 4px;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
        `;
        clearBtn.addEventListener('click', () => {
            startDateInput.value = '';
            endDateInput.value = '';
            clearDateFilter();
        });

        dateContainer.appendChild(dateInputContainer);
        dateContainer.appendChild(quickDateContainer);
        dateContainer.appendChild(clearBtn);
        popup.appendChild(dateContainer);

        // Go to edit number section
        const goToEditHeader = document.createElement('div');
        goToEditHeader.textContent = 'Go to edit number:';
        goToEditHeader.style.margin = '8px 0 4px';
        goToEditHeader.style.fontWeight = 'bold';
        popup.appendChild(goToEditHeader);

        const goToEditContainer = document.createElement('div');
        goToEditContainer.className = 'go-to-edit-container';

        const goToEditInput = document.createElement('input');
        goToEditInput.type = 'number';
        goToEditInput.className = 'go-to-edit-input';
        goToEditInput.placeholder = 'Edit #';
        goToEditInput.min = 1;
        goToEditInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const targetNumber = parseInt(goToEditInput.value);
                if (targetNumber) {
                    goToEditNumber(targetNumber);
                    goToEditInput.value = '';
                }
            }
        });

        const goToEditBtn = document.createElement('button');
        goToEditBtn.textContent = 'Go';
        goToEditBtn.className = 'go-to-edit-btn';
        goToEditBtn.addEventListener('click', () => {
            const targetNumber = parseInt(goToEditInput.value);
            if (targetNumber) {
                goToEditNumber(targetNumber);
                goToEditInput.value = '';
            }
        });

        goToEditContainer.appendChild(goToEditInput);
        goToEditContainer.appendChild(goToEditBtn);
        popup.appendChild(goToEditContainer);

        // Edit numbering controls
        const numberingHeader = document.createElement('div');
        numberingHeader.textContent = 'Options: ';
        numberingHeader.style.margin = '8px 0 4px';
        numberingHeader.style.fontWeight = 'bold';
        popup.appendChild(numberingHeader);

        const numberingContainer = document.createElement('div');
        numberingContainer.style.marginBottom = '8px';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = numberingEnabled ? 'Hide Numbers' : 'Show Numbers';
        toggleBtn.className = 'toggle-numbering-btn';
        toggleBtn.style.cssText = `
            background: ${numberingEnabled ? '#ea4335' : '#34a853'};
            border: none;
            border-radius: 4px;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
        `;
        toggleBtn.addEventListener('click', toggleEditNumbering);

        // auto-load button

        const autoLoadBtn = document.createElement('button');
        autoLoadBtn.textContent = autoLoadEnabled ? 'Disable Auto Load' : 'Enable Auto Load';
        autoLoadBtn.className = 'toggle-autoload-btn';
        autoLoadBtn.style.cssText = `
            background: ${autoLoadEnabled ? '#ea4335' : '#34a853'};
            border: none;
            border-radius: 4px;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
            margin-bottom: 8px;
        `;
        autoLoadBtn.addEventListener('click', toggleAutoLoad);

        numberingContainer.appendChild(autoLoadBtn);
        numberingContainer.appendChild(toggleBtn);

        popup.appendChild(numberingContainer);

        document.body.appendChild(popup);
        makeDraggable(popup, '.drag-handle');
    }

    // Updated function to watch for container with better retry logic
    function watchForContainer() {
        let retryCount = 0;
        const maxRetries = 30; // Try for 30 seconds
        const retryDelay = 1000; // 1 second intervals

        function trySetup() {
            console.log(`Attempting to find edits container (attempt ${retryCount + 1}/${maxRetries})`);

            const edits = findEditsContainer();
            if (!edits) {
                retryCount++;
                if (retryCount < maxRetries) {
                    setTimeout(trySetup, retryDelay);
                } else {
                    console.warn('Could not find edits container after maximum retries');
                }
                return false;
            }

            console.log('Found edits container:', edits);
            editsContainer = edits;

            // Find scroll container
            scrollContainer = findScrollContainer();
            if (scrollContainer) {
                console.log('Found scroll container:', scrollContainer);
            }

            updateButtonsAndStats();
            if (currentStatusFilter || currentTypeFilter || currentDateFilter) {
                filterEdits();
            }

            containerObserver = new MutationObserver(() => {
                updateButtonsAndStats();
                if (currentStatusFilter || currentTypeFilter || currentDateFilter) {
                    filterEdits();
                }
            });
            containerObserver.observe(editsContainer, {
                childList: true
            });
            return true;
        }

        trySetup();
    }

    function waitForElementAndClick(className, index = 0) {
        const checkForElement = () => {
            const elements = document.getElementsByClassName(className);

            if (elements.length > index) {
                elements[index].click();
                console.log(`Clicked element: ${className}[${index}]`);
                return;
            }

            setTimeout(checkForElement, 1000); // Check again in 1 second
        };

        checkForElement();
    }

    function checkInitState() {
        if (window.location.href.includes("/contrib/") && !window.location.href.includes("/photos/") && !window.location.href.includes("/answers/") && !window.location.href.includes("/reviews/") && !window.location.href.includes("/contribute/")) {
            if (isInit === false) {
                console.log('Initializing Google Maps Enhanced Edits UI');
                isInit = true;
                createPopup();
                setupAutoCleanup();
                watchForContainer();
            }
        } else {
            // Not on edits page anymore, deinitialize
            if (isInit === true) {
                deinitializeEditsUI();
            }
        }

        if (isEventHandlersInit === false) {
            isEventHandlersInit = true;
            waitForElementAndClick("okDpye PpaGLb", 1);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        var bodyList = document.querySelector('body');

        var observer = new MutationObserver(function(mutations) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                checkInitState();
            }
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
        // Check on window load
        checkInitState();
    });
})();
