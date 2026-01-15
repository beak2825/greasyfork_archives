// ==UserScript==
// @name         kibana tools v2
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Kibana tools v2 about error review.
// @author       simpleyzh
// @match        https://kibana.remarkablefoods.net/*
// @match        https://kibana.foodtruck-uat.com/*
// @match        https://kibana.foodtruck-qa.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461076/kibana%20tools%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/461076/kibana%20tools%20v2.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
        TARGET_HOST: ['kibana.remarkablefoods.net','kibana.foodtruck-uat.com','kibana.foodtruck-qa.com'].find(host => window.location.host === host) || '',
        ELEMENT_WAIT_TIMEOUT: 50, // Maximum retry attempts
        ELEMENT_WAIT_INTERVAL: 1500, // Milliseconds between retries
        CHART_HEIGHT: 300,
        LAYOUT_OFFSET: 400,
        DEFAULT_TIME_RANGE: 'time:(from:now-24h%2Fh,to:now)',

        STYLES: {
            BUTTON: 'padding:5px 15px; margin:0 10px; font-size:15px; color:white; cursor:pointer; border:solid 1px; border-radius:25px; background-color:#229ffd;',
            LINK: 'padding-left:20px; font-size:15px; color:#a0006b; cursor:pointer;',
            TRACE_BUTTON: 'margin-left:20px; background-color:rgb(204,228,245); color:rgb(0,97,166); padding:2px 10px; border:solid 1px; border-radius:25px;',
            COPY_INPUT: 'position:absolute; top:0; left:0; opacity:0; z-index:-10;'
        },

        SELECTORS: {
            BREADCRUMBS: 'euiBreadcrumbs euiHeaderBreadcrumbs css-1rf186f-euiHeaderBreadcrumbs',
            PRIMARY_BUTTON: 'euiButton css-m9lfq3-euiButtonDisplay-s-defaultMinWidth-base-primary', // Attention button
            PANEL_TITLE: 'embPanel__titleInner',
            REFRESH_BUTTON: 'euiButton euiButton--primary euiButton--fill euiSuperUpdateButton',
            PAGINATION: 'euiDataGrid__pagination',
            TITLE: 'euiTitle',
            CHART_SPLIT: 'tbvChart__split',
            LAYOUT_VIEWING: 'dshLayout--viewing',
            CHART_CELL_CONTENT: 'tbvChartCellContent',
            GRID_ROW_CELL: 'euiDataGridRowCell',
            BREADCRUMB_EXTENSION: 'div.header__breadcrumbsAppendExtension'
        },

        SERVICE_NAMES: [
            'apple-pay-integration-service', 'customer-service-site', 'fulfillment-service',
            'order-eta-service', 'order-number-service', 'order-service', 'tax-service',
            'dbw-order-service', 'gift-card-order-service', 'order-search-service',
            'payment-service', 'stripe-integration-service', 'zendesk-integration-service',
            'forter-integration-service', 'oms-task-service', 'decagon-integration-service',
            'shipping-api', 'shipping-bo-site', 'shipping-scheduler-service',
            'shipping-service', 'shipping-site'
        ].map(name => `app:"${name}"`).join(' or '),

        // Reviewer schedule map - externalized for easier maintenance
        REVIEWER_SCHEDULE: {"2026-01-01":"alex","2026-01-02":"alex","2026-01-03":"alex","2026-01-04":"alex","2026-01-05":"simple","2026-01-06":"ebin","2026-01-07":"alex","2026-01-08":"simple","2026-01-09":"ebin","2026-01-10":"alex","2026-01-11":"alex","2026-01-12":"alex","2026-01-13":"simple","2026-01-14":"ebin","2026-01-15":"alex","2026-01-16":"simple","2026-01-17":"ebin","2026-01-18":"ebin","2026-01-19":"ebin","2026-01-20":"alex","2026-01-21":"simple","2026-01-22":"ebin","2026-01-23":"alex","2026-01-24":"simple","2026-01-25":"simple","2026-01-26":"simple","2026-01-27":"ebin","2026-01-28":"alex","2026-01-29":"simple","2026-01-30":"ebin","2026-01-31":"alex","2026-02-01":"alex","2026-02-02":"alex","2026-02-03":"simple","2026-02-04":"ebin","2026-02-05":"alex","2026-02-06":"simple","2026-02-07":"ebin","2026-02-08":"ebin","2026-02-09":"ebin","2026-02-10":"alex","2026-02-11":"simple","2026-02-12":"ebin","2026-02-13":"alex","2026-02-14":"simple","2026-02-15":"ebin","2026-02-16":"ebin","2026-02-17":"ebin","2026-02-18":"ebin","2026-02-19":"ebin","2026-02-20":"ebin","2026-02-21":"ebin","2026-02-22":"ebin","2026-02-23":"ebin","2026-02-24":"ebin","2026-02-25":"alex","2026-02-26":"simple","2026-02-27":"ebin","2026-02-28":"alex","2026-03-01":"simple","2026-03-02":"simple","2026-03-03":"ebin","2026-03-04":"alex","2026-03-05":"simple","2026-03-06":"ebin","2026-03-07":"alex","2026-03-08":"alex","2026-03-09":"alex","2026-03-10":"simple","2026-03-11":"ebin","2026-03-12":"alex","2026-03-13":"simple","2026-03-14":"ebin","2026-03-15":"ebin","2026-03-16":"ebin","2026-03-17":"alex","2026-03-18":"simple","2026-03-19":"ebin","2026-03-20":"alex","2026-03-21":"simple","2026-03-22":"simple","2026-03-23":"simple","2026-03-24":"ebin","2026-03-25":"alex","2026-03-26":"simple","2026-03-27":"ebin","2026-03-28":"alex","2026-03-29":"alex","2026-03-30":"alex","2026-03-31":"simple","2026-04-01":"ebin","2026-04-02":"alex","2026-04-03":"simple","2026-04-04":"ebin","2026-04-05":"ebin","2026-04-06":"ebin","2026-04-07":"ebin","2026-04-08":"alex","2026-04-09":"simple","2026-04-10":"ebin","2026-04-11":"alex","2026-04-12":"alex","2026-04-13":"alex","2026-04-14":"simple","2026-04-15":"ebin","2026-04-16":"alex","2026-04-17":"simple","2026-04-18":"ebin","2026-04-19":"ebin","2026-04-20":"ebin","2026-04-21":"alex","2026-04-22":"simple","2026-04-23":"ebin","2026-04-24":"alex","2026-04-25":"simple","2026-04-26":"simple","2026-04-27":"simple","2026-04-28":"ebin","2026-04-29":"alex","2026-04-30":"simple","2026-05-01":"ebin","2026-05-02":"ebin","2026-05-03":"ebin","2026-05-04":"ebin","2026-05-05":"ebin","2026-05-06":"ebin","2026-05-07":"alex","2026-05-08":"simple","2026-05-09":"ebin","2026-05-10":"alex","2026-05-11":"alex","2026-05-12":"simple","2026-05-13":"ebin","2026-05-14":"alex","2026-05-15":"simple","2026-05-16":"ebin","2026-05-17":"ebin","2026-05-18":"ebin","2026-05-19":"alex","2026-05-20":"simple","2026-05-21":"ebin","2026-05-22":"alex","2026-05-23":"simple","2026-05-24":"simple","2026-05-25":"simple","2026-05-26":"ebin","2026-05-27":"alex","2026-05-28":"simple","2026-05-29":"ebin","2026-05-30":"alex","2026-05-31":"alex","2026-06-01":"alex","2026-06-02":"simple","2026-06-03":"ebin","2026-06-04":"alex","2026-06-05":"simple","2026-06-06":"ebin","2026-06-07":"ebin","2026-06-08":"ebin","2026-06-09":"alex","2026-06-10":"simple","2026-06-11":"ebin","2026-06-12":"alex","2026-06-13":"simple","2026-06-14":"simple","2026-06-15":"simple","2026-06-16":"ebin","2026-06-17":"alex","2026-06-18":"simple","2026-06-19":"ebin","2026-06-20":"ebin","2026-06-21":"ebin","2026-06-22":"ebin","2026-06-23":"alex","2026-06-24":"simple","2026-06-25":"ebin","2026-06-26":"alex","2026-06-27":"simple","2026-06-28":"simple","2026-06-29":"simple","2026-06-30":"ebin","2026-07-01":"alex","2026-07-02":"simple","2026-07-03":"ebin","2026-07-04":"alex","2026-07-05":"alex","2026-07-06":"alex","2026-07-07":"simple","2026-07-08":"ebin","2026-07-09":"alex","2026-07-10":"simple","2026-07-11":"ebin","2026-07-12":"ebin","2026-07-13":"ebin","2026-07-14":"alex","2026-07-15":"simple","2026-07-16":"ebin","2026-07-17":"alex","2026-07-18":"simple","2026-07-19":"simple","2026-07-20":"simple","2026-07-21":"ebin","2026-07-22":"alex","2026-07-23":"simple","2026-07-24":"ebin","2026-07-25":"alex","2026-07-26":"alex","2026-07-27":"alex","2026-07-28":"simple","2026-07-29":"ebin","2026-07-30":"alex","2026-07-31":"simple","2026-08-01":"ebin","2026-08-02":"ebin","2026-08-03":"ebin","2026-08-04":"alex","2026-08-05":"simple","2026-08-06":"ebin","2026-08-07":"alex","2026-08-08":"simple","2026-08-09":"simple","2026-08-10":"simple","2026-08-11":"ebin","2026-08-12":"alex","2026-08-13":"simple","2026-08-14":"ebin","2026-08-15":"alex","2026-08-16":"alex","2026-08-17":"alex","2026-08-18":"simple","2026-08-19":"ebin","2026-08-20":"alex","2026-08-21":"simple","2026-08-22":"ebin","2026-08-23":"ebin","2026-08-24":"ebin","2026-08-25":"alex","2026-08-26":"simple","2026-08-27":"ebin","2026-08-28":"alex","2026-08-29":"simple","2026-08-30":"simple","2026-08-31":"simple","2026-09-01":"ebin","2026-09-02":"alex","2026-09-03":"simple","2026-09-04":"ebin","2026-09-05":"alex","2026-09-06":"alex","2026-09-07":"alex","2026-09-08":"simple","2026-09-09":"ebin","2026-09-10":"alex","2026-09-11":"simple","2026-09-12":"ebin","2026-09-13":"ebin","2026-09-14":"ebin","2026-09-15":"alex","2026-09-16":"simple","2026-09-17":"ebin","2026-09-18":"alex","2026-09-19":"simple","2026-09-20":"simple","2026-09-21":"ebin","2026-09-22":"alex","2026-09-23":"simple","2026-09-24":"ebin","2026-09-25":"alex","2026-09-26":"alex","2026-09-27":"alex","2026-09-28":"alex","2026-09-29":"simple","2026-09-30":"ebin","2026-10-01":"alex","2026-10-02":"alex","2026-10-03":"alex","2026-10-04":"alex","2026-10-05":"alex","2026-10-06":"alex","2026-10-07":"alex","2026-10-08":"alex","2026-10-09":"simple","2026-10-10":"ebin","2026-10-11":"alex","2026-10-12":"alex","2026-10-13":"simple","2026-10-14":"ebin","2026-10-15":"alex","2026-10-16":"simple","2026-10-17":"ebin","2026-10-18":"ebin","2026-10-19":"ebin","2026-10-20":"alex","2026-10-21":"simple","2026-10-22":"ebin","2026-10-23":"alex","2026-10-24":"simple","2026-10-25":"simple","2026-10-26":"simple","2026-10-27":"ebin","2026-10-28":"alex","2026-10-29":"simple","2026-10-30":"ebin","2026-10-31":"alex","2026-11-01":"alex","2026-11-02":"alex","2026-11-03":"simple","2026-11-04":"ebin","2026-11-05":"alex","2026-11-06":"simple","2026-11-07":"ebin","2026-11-08":"ebin","2026-11-09":"ebin","2026-11-10":"alex","2026-11-11":"simple","2026-11-12":"ebin","2026-11-13":"alex","2026-11-14":"simple","2026-11-15":"simple","2026-11-16":"simple","2026-11-17":"ebin","2026-11-18":"alex","2026-11-19":"simple","2026-11-20":"ebin","2026-11-21":"alex","2026-11-22":"alex","2026-11-23":"alex","2026-11-24":"simple","2026-11-25":"ebin","2026-11-26":"alex","2026-11-27":"simple","2026-11-28":"ebin","2026-11-29":"ebin","2026-11-30":"ebin","2026-12-01":"alex","2026-12-02":"simple","2026-12-03":"ebin","2026-12-04":"alex","2026-12-05":"simple","2026-12-06":"simple","2026-12-07":"simple","2026-12-08":"ebin","2026-12-09":"alex","2026-12-10":"simple","2026-12-11":"ebin","2026-12-12":"alex","2026-12-13":"alex","2026-12-14":"alex","2026-12-15":"simple","2026-12-16":"ebin","2026-12-17":"alex","2026-12-18":"simple","2026-12-19":"ebin","2026-12-20":"ebin","2026-12-21":"ebin","2026-12-22":"alex","2026-12-23":"simple","2026-12-24":"ebin","2026-12-25":"alex","2026-12-26":"simple","2026-12-27":"simple","2026-12-28":"simple","2026-12-29":"ebin","2026-12-30":"alex","2026-12-31":"simple"}
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    // Early return if not on target host
    if (window.location.host !== CONFIG.TARGET_HOST) {
        return;
    }

    // Monitor URL changes for breadcrumb updates
    if (window.location.href.includes('/action-pattern/')) {
        waitElementLoadedBySelector(CONFIG.SELECTORS.BREADCRUMB_EXTENSION, () => handleUrlChange());
    }

    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const url = window.location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handleUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });

    // Auto-click primary button when loaded
    waitElementLoaded(CONFIG.SELECTORS.PRIMARY_BUTTON, (elements) => {
        if (elements[0]) elements[0].click();
    });

    // Initialize UI components
    waitElementLoaded(CONFIG.SELECTORS.PANEL_TITLE, (elements) => {
        if (elements[1]) {
            addFormatBtn(elements[1]);
            addSearchToday(elements[1]);
            addServices(elements[1]);
            addlink(elements[1]);
        }
    }, 2);

    waitElementLoaded(CONFIG.SELECTORS.REFRESH_BUTTON, (elements) => {
        if (elements[0]) {
            elements[0].addEventListener('click', addLinkBtn);
        }
    });

    waitElementLoaded(CONFIG.SELECTORS.PAGINATION, (elements) => {
        Array.from(elements).forEach(el => {
            const nav = el.getElementsByTagName('nav')[0];
            if (nav) {
                nav.addEventListener('click', () => clearSearch(el));
            }
        });
    });

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Pads a number with leading zero if less than 10
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    function formatDate(num) {
        return num >= 10 ? num : '0' + num;
    }

    /**
     * Waits for elements matching className to be loaded in the DOM
     * @param {string} className - CSS class name to search for
     * @param {Function} callback - Function to call when elements are found
     * @param {number} minSize - Minimum number of elements required
     */
    function waitElementLoaded(className, callback, minSize = 1) {
        let attemptCount = 0;
        const timer = setInterval(() => {
            attemptCount++;
            if (attemptCount > CONFIG.ELEMENT_WAIT_TIMEOUT) {
                clearInterval(timer);
                console.warn(`Element wait timeout for class: ${className}`);
                return;
            }

            const elements = document.getElementsByClassName(className);
            if (elements.length >= minSize) {
                clearInterval(timer);
                try {
                    callback(elements);
                } catch (error) {
                    console.error(`Error in callback for ${className}:`, error);
                }
            }
        }, CONFIG.ELEMENT_WAIT_INTERVAL);
    }

    /**
     * Waits for element matching selector to be loaded in the DOM
     * @param {string} selector - CSS selector to search for
     * @param {Function} callback - Function to call when element is found
     */
    function waitElementLoadedBySelector(selector, callback) {
        let attemptCount = 0;
        const timer = setInterval(() => {
            attemptCount++;
            if (attemptCount > CONFIG.ELEMENT_WAIT_TIMEOUT) {
                clearInterval(timer);
                console.warn(`Element wait timeout for selector: ${selector}`);
                return;
            }

            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                try {
                    callback(element);
                } catch (error) {
                    console.error(`Error in callback for ${selector}:`, error);
                }
            }
        }, CONFIG.ELEMENT_WAIT_INTERVAL);
    }

    /**
     * Formats a date object to YYYY-MM-DD string
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    function getDateString(date) {
        const year = date.getFullYear();
        const month = formatDate(date.getMonth() + 1);
        const day = formatDate(date.getDate());
        return `${year}-${month}-${day}`;
    }

    /**
     * Extracts app name from element's text content
     * @param {HTMLElement} element - Element containing app name
     * @returns {string} App name
     */
    function getAppName(element) {
        const text = element.textContent || '';
        const colonIndex = text.indexOf(':');
        return colonIndex > 0 ? text.substring(0, colonIndex) : text;
    }

    /**
     * Checks if a date is a holiday based on reviewer schedule
     * Same reviewer on consecutive days indicates a holiday
     * @param {Date} date - Date to check
     * @param {string} currentReviewer - Current day's reviewer
     * @returns {boolean} True if date is a holiday
     */
    function isHoliday(date, currentReviewer) {
        const dateKey = getDateString(date);
        const dateReviewer = CONFIG.REVIEWER_SCHEDULE[dateKey];
        return dateReviewer && currentReviewer && dateReviewer === currentReviewer;
    }

    /**
     * Finds the last working day before a holiday period
     * @param {Date} date - Starting date
     * @param {string} currentReviewer - Current reviewer
     * @returns {Date} Last working day
     */
    function findLastWorkingDay(date, currentReviewer) {
        let workingDay = new Date(date);
        workingDay.setDate(workingDay.getDate() - 1);

        while (isHoliday(workingDay, currentReviewer)) {
            workingDay.setDate(workingDay.getDate() - 1);
        }
        return workingDay;
    }

    /**
     * Generates time range string for URL based on reviewer schedule
     * @param {Date} date - Reference date
     * @returns {string} Time range parameter string
     */
    function getTimeRangeString(date) {
        const upperDay = new Date();
        const currentReviewer = CONFIG.REVIEWER_SCHEDULE[getDateString(upperDay)];

        let lowerDay = new Date(date);
        lowerDay.setDate(lowerDay.getDate() - 1);

        // If yesterday has same reviewer (holiday), find last working day
        if (isHoliday(lowerDay, currentReviewer)) {
            lowerDay = findLastWorkingDay(lowerDay, currentReviewer);
        }

        const lowerDateStr = getDateString(lowerDay);
        const upperDateStr = getDateString(upperDay);
        return `time:(from:'${lowerDateStr}T05:00:00.000Z',to:'${upperDateStr}T05:00:00.000Z'))`;
    }

    /**
     * Extracts time condition from URL
     * @param {string} url - URL to parse
     * @returns {string} Time condition string or default
     */
    function extractTimeCondition(url) {
        const startIndex = url.indexOf('time:(');
        if (startIndex === -1) {
            return CONFIG.DEFAULT_TIME_RANGE;
        }

        let endIndex = -1;
        for (let i = startIndex; i < url.length; i++) {
            if (url.charAt(i) === ')') {
                endIndex = i + 1;
                break;
            }
        }

        return endIndex > 0 ? url.substring(startIndex, endIndex) : CONFIG.DEFAULT_TIME_RANGE;
    }

    /**
     * Builds discover URL with search parameters
     * @returns {string} Formatted discover URL template
     */
    function buildDiscoverUrl() {
        const template = "https://{host}/app/discover#/?_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!t,value:0),{time_condition})&_a=(columns:!(action,app,result,error_code),filters:!(),index:trace-pattern,interval:auto,query:(language:kuery,query:'action:%22{action}%22%20and%20app:%22{app_name}%22%20and%20error_code:%22{error_code}%22%20and%20result:{result}'),sort:!(!('@timestamp',desc)))";

        const timeCondition = extractTimeCondition(window.location.href);
        return template
            .replace('{host}', window.location.host)
            .replace('{time_condition}', timeCondition);
    }

    // ============================================
    // UI MANIPULATION FUNCTIONS
    // ============================================

    /**
     * Creates and appends a button to an element
     * @param {HTMLElement} parentElement - Element to append button to
     * @param {string} id - Button ID
     * @param {string} text - Button text
     * @param {Function} clickHandler - Click event handler
     * @returns {HTMLElement} Created button element
     */
    function appendButton(parentElement, id, text, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.style.cssText = CONFIG.STYLES.BUTTON;
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        parentElement.appendChild(button);
        return button;
    }

    /**
     * Adds format button to adjust chart heights
     */
    function addFormatBtn(element) {
        appendButton(element, 'format', 'format', formatCharts);
    }

    /**
     * Adds search today button
     */
    function addSearchToday(element) {
        appendButton(element, 'search-today', 'day', searchToday);
    }

    /**
     * Adds services button with clipboard functionality
     */
    function addServices(element) {
        const button = appendButton(element, 'services', 'services', copyServicesToClipboard);

        // Create hidden input for fallback copy method
        const input = document.createElement('input');
        input.id = 'copy-board';
        input.style.cssText = CONFIG.STYLES.COPY_INPUT;
        button.appendChild(input);
    }

    /**
     * Adds link button and initializes link functionality
     */
    function addlink(element) {
        appendButton(element, 'link', 'link', addLinkBtn);
        addLinkBtn();
    }

    /**
     * Adds search links to title elements
     */
    function addLinkBtn() {
        waitElementLoaded(CONFIG.SELECTORS.TITLE, (elements) => {
            Array.from(elements).forEach(element => {
                const existingLink = element.querySelector('.link');

                if (!existingLink) {
                    const link = document.createElement('span');
                    link.className = 'link';
                    link.style.cssText = CONFIG.STYLES.LINK;
                    link.textContent = 'link';
                    link.addEventListener('click', () => addSearchLinks(element));
                    element.appendChild(link);
                } else {
                    existingLink.onclick = () => addSearchLinks(element);
                }
            });
        });
    }

    /**
     * Adds search links to data grid rows
     * @param {HTMLElement} element - Title element containing app name
     */
    function addSearchLinks(element) {
        if (!element) {
            console.warn('addSearchLinks called with undefined element');
            return;
        }

        try {
            const appName = getAppName(element);
            const rowCell = element.parentNode.querySelector(`.${CONFIG.SELECTORS.GRID_ROW_CELL}`);
            if (!rowCell || !rowCell.parentNode || !rowCell.parentNode.parentNode) {
                console.warn('Could not find grid structure');
                return;
            }

            const rows = rowCell.parentNode.parentNode.childNodes;

            Array.from(rows).slice(1).forEach(row => {
                const cells = row.querySelectorAll(`.${CONFIG.SELECTORS.CHART_CELL_CONTENT}`);
                if (cells.length < 4) return;

                const result = cells[0].textContent;
                const errorCode = cells[1].textContent;
                const action = cells[2].textContent;

                const searchUrl = buildDiscoverUrl()
                    .replace('{action}', action.replace(/\//g, '%2F'))
                    .replace('{result}', result)
                    .replace('{app_name}', appName)
                    .replace('{error_code}', errorCode);

                const existingLink = row.querySelector('.search');
                if (!existingLink) {
                    const link = document.createElement('a');
                    link.className = 'search';
                    link.href = searchUrl;
                    link.target = '_blank';
                    link.style.cssText = CONFIG.STYLES.LINK;
                    link.textContent = 'search';
                    cells[3].appendChild(link);
                } else {
                    existingLink.href = searchUrl;
                }
            });
        } catch (error) {
            console.error('Error adding search links:', error);
        }
    }

    /**
     * Formats chart heights for better visibility
     */
    function formatCharts() {
        try {
            const chartSplits = document.querySelectorAll(`.${CONFIG.SELECTORS.CHART_SPLIT}`);
            chartSplits.forEach(chart => {
                chart.style.height = `${CONFIG.CHART_HEIGHT}px`;
                chart.style.flex = 'none';
            });

            const layoutHeight = CONFIG.CHART_HEIGHT * chartSplits.length + CONFIG.LAYOUT_OFFSET;
            const layouts = document.querySelectorAll(`.${CONFIG.SELECTORS.LAYOUT_VIEWING}`);

            if (layouts.length > 0) {
                layouts[0].style.height = `${layoutHeight}px`;
                if (layouts[0].children[1]) {
                    layouts[0].children[1].style.height = `${layoutHeight}px`;
                }
            }
        } catch (error) {
            console.error('Error formatting charts:', error);
        }
    }

    /**
     * Clears all search links from pagination area
     * @param {HTMLElement} element - Pagination element
     */
    function clearSearch(element) {
        try {
            const searchLinks = element.parentNode.querySelectorAll('.search');
            searchLinks.forEach(link => link.remove());
        } catch (error) {
            console.error('Error clearing search links:', error);
        }
    }

    /**
     * Copies service names to clipboard
     */
    function copyServicesToClipboard() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONFIG.SERVICE_NAMES)
                .then(() => alert('Copied successfully'))
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy();
                });
        } else {
            fallbackCopy();
        }

        function fallbackCopy() {
            const input = document.getElementById('copy-board');
            if (input) {
                input.value = CONFIG.SERVICE_NAMES;
                input.select();
                document.execCommand('copy');
                alert('Copied successfully');
            }
        }
    }

    /**
     * Navigates to today's error dashboard with appropriate time range
     */
    function searchToday() {
        try {
            let currentUrl = window.location.href;
            let timeIndex = currentUrl.lastIndexOf('time:(');

            if (timeIndex === -1) {
                if (currentUrl.indexOf('error-dashboard') === -1) {
                    alert('Please navigate to error dashboard first');
                    return;
                }
                currentUrl = `${window.location.protocol}//${window.location.host}/app/dashboards#/view/error-dashboard?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))`;
                timeIndex = currentUrl.lastIndexOf('time:(');
            }

            const newTimeRange = getTimeRangeString(new Date());
            const currentTimeRange = currentUrl.substring(timeIndex);

            if (newTimeRange !== currentTimeRange) {
                window.location.replace(currentUrl.substring(0, timeIndex) + newTimeRange);
            }
        } catch (error) {
            console.error('Error in searchToday:', error);
            alert('Failed to update search time range');
        }
    }

    // ============================================
    // BREADCRUMB MANAGEMENT
    // ============================================

    /**
     * Adds custom breadcrumb with trace button
     */
    function addCustomBreadcrumb() {
        // Check if button already exists
        const existingButton = document.getElementById('trace-button');
        if (existingButton) return;

        // Wait for the breadcrumb extension container to be available
        waitElementLoadedBySelector(CONFIG.SELECTORS.BREADCRUMB_EXTENSION, (div) => {
            // Double check button doesn't exist (in case of race condition)
            if (document.getElementById('trace-button')) return;

            const button = document.createElement('button');
            button.id = 'trace-button';
            button.textContent = 'trace';
            button.className = 'eui-button';
            button.style.cssText = CONFIG.STYLES.TRACE_BUTTON;

            button.addEventListener('click', () => {
                const currentUrl = new URL(window.location.href);
                const queryString = window.location.href.split('?')[1] || '';
                const newUrl = `${currentUrl.protocol}//${currentUrl.host}/app/discover#/doc/trace-pattern/trace-*?${queryString}`;
                window.location.assign(newUrl);
            });

            div.appendChild(button);
        });
    }

    /**
     * Handles URL changes to update breadcrumb button visibility
     */
    function handleUrlChange() {
        const hasActionPattern = window.location.href.includes('/action-pattern/');
        const traceButton = document.getElementById('trace-button');

        if (hasActionPattern) {
            if (!traceButton) {
                addCustomBreadcrumb();
            }
        } else {
            if (traceButton) {
                traceButton.remove();
            }
        }
    }
})();
