// ==UserScript==
// @name         Confluence Jira Title Copy
// @name:en      Confluence Jira Title Copy
// @name:ja      Confluence Jira タイトルコピー
// @name:zh-CN   Confluence Jira 复制标题和链接
// @description  Add buttons to copy title and link of a Confluence/Jira page, and to copy as filename
// @description:en Add buttons to copy title and link of a Confluence/Jira page, and to copy as filename
// @description:ja ボタンをクリックして、タイトルテキスト+リンクをマークダウン形式でコピーし、ファイル名としてコピーします。
// @description:zh-CN 点击按钮以markdown格式复制标题文本+链接，以及复制为文件名
// @namespace    https://github.com/CheerChen
// @version      0.8.2
// @author      cheerchen37
// @license     MIT
// @match        *://*.atlassian.net/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/512684/Confluence%20Jira%20Title%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/512684/Confluence%20Jira%20Title%20Copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize script
    function initScript() {
        // Add button styles
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .custom-copy-button {
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                padding: 6px 12px;
                background-color: #0052CC;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                vertical-align: middle;
            }
            .custom-copy-button:hover {
                background-color: #003380;
            }
            #copyFeedback {
                position: absolute;
                margin-top: 5px;
                background-color: #000;
                color: #fff;
                padding: 5px 10px;
                border-radius: 5px;
                display: none;
                z-index: 1001;
            }
        `;
        document.head.appendChild(style);

        // Initial check for buttons
        addButtons();

        // Set up a timer to check for the elements periodically
        setInterval(addButtons, 2000);
    }

    // Get Confluence page title
    function getConfluenceTitle() {
        const selectors = [
            '#title-text',
            'h1.css-1xrg2ua',
            'h1[data-test-id="content-title"]',
            'h1.PageTitle',
            '.confluence-page-title',
            '.aui-page-header-main h1',
            '#content-header-container h1',
            // Additional Confluence selectors
            '.css-1mpsox7 h1', // New Confluence cloud
            '#main-content h1:first-child',
            '.wiki-content .confluenceTitle',
            'h1.pagetitle'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return document.title.split(' - ')[0].trim();
    }

    // Get Jira page title
    function getJiraTitle() {
        const mainSelector = 'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]';
        const mainElement = document.querySelector(mainSelector);

        if (mainElement && mainElement.textContent.trim()) {
            return mainElement.textContent.trim();
        }

        const backupSelectors = [
            'h1[data-test-id="issue-title"]',
            'h1.issue-title',
            'h1.ghx-summary',
            '.issue-header h1',
            '.jira-issue-header h1',
            // Additional selectors for backlog view
            '.ghx-issue-title',
            '[data-testid="rapid-board-issue.ui.issue-card.title-container"]',
            '[role="heading"][aria-level="3"]' // Often used in backlog
        ];

        for (const selector of backupSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                // Return the one that's visible or the first one
                for (const element of elements) {
                    if (element && element.textContent.trim() && isElementVisible(element)) {
                        return element.textContent.trim();
                    }
                }
                // If no visible element found, return the first one
                if (elements[0].textContent.trim()) {
                    return elements[0].textContent.trim();
                }
            }
        }

        return document.title.split(' - ')[0].trim();
    }

    // Check if element is visible
    function isElementVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    // Get Jira ticket ID from URL or page
    function getJiraTicketId() {
        // 1. Try to extract ticket ID from URL parameters (backlog, modal, etc.)
        const urlParams = new URLSearchParams(window.location.search);
        for (const param of ['selectedIssue', 'modal', 'issueKey']) {
            const value = urlParams.get(param);
            if (value && /^[A-Z][A-Z0-9]+-\d+$/i.test(value)) {
                return value;
            }
        }

        // 2. Try to extract ticket ID from /browse/ URL
        const urlMatch = window.location.href.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }

        // 3. Try to extract from DOM elements (list view, board, etc.)
        const selectors = [
            'a[data-testid*="issue-key"]',
            'a[data-testid*="issuekey"]',
            '[data-testid*="issue-key"] a[href*="/browse/"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                // Try text content first
                const text = element.textContent.trim();
                if (/^[A-Z][A-Z0-9]+-\d+$/i.test(text)) {
                    return text;
                }
                // Try href attribute
                const href = element.getAttribute('href');
                if (href) {
                    const hrefMatch = href.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i);
                    if (hrefMatch && hrefMatch[1]) {
                        return hrefMatch[1];
                    }
                }
            }
        }

        return '';
    }

    // Sanitize string for use as filename
    function sanitizeFilename(input) {
        return input.replace(/[\\/:*?"<>|[\]{}#%&+,;=@^`~]/g, '-')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Add copy buttons to page
    function addButtons() {
        // Check if we're in Jira
        if (document.location.href.includes("/browse/") ||
            document.location.href.includes("/jira/") ||
            document.location.href.includes("/backlog")) {
            addJiraButtons();
        }
        // Check if we're in Confluence
        else if (document.location.href.includes("/wiki/") ||
            document.location.href.includes("/confluence/") ||
            document.location.href.includes("/display/")) {
            addConfluenceButtons();
        }
    }

    // Add buttons to Jira pages
    function addJiraButtons() {
        if (document.getElementById('customCopyButton')) {
            return; // Buttons already exist
        }

        let titleElement = null;

        // Try to find the title element using various selectors
        const titleSelectors = [
            'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]',
            '.issue-header h1',
            '.jira-issue-header h1',
            '.ghx-detail-title h1',
            // For backlog view
            '[data-testid="rapid-board-issue.ui.issue-card.title-container"]',
            '.ghx-selected .ghx-summary'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                titleElement = element;
                break;
            }
        }

        // If we found a title element, add buttons next to it
        if (titleElement) {
            insertButtonsNextToElement(titleElement);
        } else {
            // For backlog, try to add to a visible container
            const backlogContainers = [
                '[data-test-id="platform-board.ui.board.board-container"]',
                '.ghx-detail-view',
                '.ghx-detail-contents',
                '[data-testid="software-board.board.board.container"]'
            ];

            for (const selector of backlogContainers) {
                const container = document.querySelector(selector);
                if (container && isElementVisible(container)) {
                    // Create floating buttons for backlog
                    insertFloatingButtons(container);
                    break;
                }
            }
        }
    }

    // Add buttons to Confluence pages
    function addConfluenceButtons() {
        if (document.getElementById('customCopyButton')) {
            return; // Buttons already exist
        }

        let titleElement = null;

        // Try to find the confluence title using various selectors
        const titleSelectors = [
            '#title-text',
            'h1.css-1xrg2ua',
            'h1[data-test-id="content-title"]',
            'h1.PageTitle',
            '.confluence-page-title',
            '.aui-page-header-main h1',
            '#content-header-container h1',
            // Additional Confluence selectors
            '.css-1mpsox7 h1',
            '#main-content h1:first-child',
            '.wiki-content .confluenceTitle',
            'h1.pagetitle',
            // Generic h1 as last resort
            '#main-content h1'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                titleElement = element;
                break;
            }
        }

        // If we found a title element, add buttons next to it
        if (titleElement) {
            insertButtonsNextToElement(titleElement);
        } else {
            // Try adding to a container
            const containers = [
                '#main-content',
                '.confluence-information-macro-body',
                '.wiki-content',
                '.content-body',
                '#content'
            ];

            for (const selector of containers) {
                const container = document.querySelector(selector);
                if (container && isElementVisible(container)) {
                    insertFloatingButtons(container);
                    break;
                }
            }
        }
    }

    // Insert buttons next to an element
    function insertButtonsNextToElement(element) {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'inline-flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginLeft = '10px';

        // Create markdown button
        const button = document.createElement('button');
        button.id = 'customCopyButton';
        button.className = 'custom-copy-button';
        button.textContent = 'Copy Title & Link';
        buttonContainer.appendChild(button);

        // Create filename button
        const filenameButton = document.createElement('button');
        filenameButton.id = 'customCopyFilenameButton';
        filenameButton.className = 'custom-copy-button';
        filenameButton.style.marginLeft = '5px';
        filenameButton.textContent = 'Copy as Filename';
        buttonContainer.appendChild(filenameButton);

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.id = 'copyFeedback';
        feedback.textContent = 'Copied!';
        buttonContainer.appendChild(feedback);

        // Insert container after the element
        if (element.nextSibling) {
            element.parentNode.insertBefore(buttonContainer, element.nextSibling);
        } else {
            element.parentNode.appendChild(buttonContainer);
        }

        // Add event listeners
        button.addEventListener('click', copyAsMarkdown);
        filenameButton.addEventListener('click', copyAsFilename);
    }

    // Insert floating buttons in a container
    function insertFloatingButtons(container) {
        // Create floating button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.display = 'flex';

        // Create markdown button
        const button = document.createElement('button');
        button.id = 'customCopyButton';
        button.className = 'custom-copy-button';
        button.textContent = 'Copy Title & Link';
        buttonContainer.appendChild(button);

        // Create filename button
        const filenameButton = document.createElement('button');
        filenameButton.id = 'customCopyFilenameButton';
        filenameButton.className = 'custom-copy-button';
        filenameButton.style.marginLeft = '5px';
        filenameButton.textContent = 'Copy as Filename';
        buttonContainer.appendChild(filenameButton);

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.id = 'copyFeedback';
        feedback.textContent = 'Copied!';
        feedback.style.position = 'absolute';
        feedback.style.top = '40px';
        feedback.style.right = '0';
        buttonContainer.appendChild(feedback);

        // Make sure container has position relative
        const currentPosition = window.getComputedStyle(container).position;
        if (currentPosition === 'static') {
            container.style.position = 'relative';
        }

        // Add to container
        container.appendChild(buttonContainer);

        // Add event listeners
        button.addEventListener('click', copyAsMarkdown);
        filenameButton.addEventListener('click', copyAsFilename);
    }

    // Copy title and link as Markdown
    function copyAsMarkdown() {
        let titleText = '';
        if (document.location.href.includes("wiki") || document.location.href.includes("confluence")) {
            titleText = getConfluenceTitle();
            console.log("Got Confluence title:", titleText);
        } else {
            titleText = getJiraTitle();
            console.log("Got Jira title:", titleText);
        }

        if (!titleText) {
            titleText = document.title;
            console.log("Using document title:", titleText);
        }

        const pageLink = window.location.href;
        const copyText = `[${titleText}](${pageLink})`;
        console.log("Copying as Markdown:", copyText);

        copyToClipboard(copyText);
    }

    // Copy as filename format
    function copyAsFilename() {
        let titleText = '';
        let ticketId = '';

        if (document.location.href.includes("wiki") || document.location.href.includes("confluence")) {
            titleText = getConfluenceTitle();
        } else {
            titleText = getJiraTitle();
            ticketId = getJiraTicketId();
            console.log("Extracted ticket ID:", ticketId);
        }

        if (!titleText) {
            titleText = document.title;
        }

        // Sanitize title to be safe for filenames
        titleText = sanitizeFilename(titleText);

        // Create filename format: {ticket-id} {title}
        let filename = titleText;
        if (ticketId) {
            filename = `${ticketId} ${titleText}`;
        }

        console.log("Copying as filename:", filename);
        copyToClipboard(filename);
    }

    // Copy text to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showFeedback();
            }).catch(err => {
                console.error("Clipboard API failed:", err);
                copyWithFallback(text);
            });
        } else {
            copyWithFallback(text);
        }
    }

    // Fallback copy method
    function copyWithFallback(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.top = '0';
        tempTextarea.style.left = '0';
        tempTextarea.style.width = '2em';
        tempTextarea.style.height = '2em';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);
        tempTextarea.value = text;
        tempTextarea.select();

        try {
            const success = document.execCommand('copy');
            if (success) {
                showFeedback();
            } else {
                console.error("execCommand copy failed");
            }
        } catch (err) {
            console.error('Copy error:', err);
        }

        document.body.removeChild(tempTextarea);
    }

    // Show copy success feedback
    function showFeedback() {
        const feedback = document.getElementById('copyFeedback');
        if (feedback) {
            feedback.style.display = 'block';
            setTimeout(() => { feedback.style.display = 'none'; }, 2000);
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initScript, 500));
    } else {
        setTimeout(initScript, 500);
    }

    // Watch for DOM changes
    const observer = new MutationObserver(function (mutations) {
        if (!document.getElementById('customCopyButton')) {
            addButtons();
        }
    });

    // Start observing after initialization
    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
})();