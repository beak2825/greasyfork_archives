// ==UserScript==
// @name         Bypass FileCrypt (New)
// @namespace    Bhunter
// @version      1.0.3
// @description  Bypass FileCrypt
// @author       Bhunter
// @license      MIT
// @match        http://filecrypt.cc/*
// @match        http://www.filecrypt.cc/*
// @match        http://filecrypt.co/*
// @match        http://www.filecrypt.co/*
// @match        https://filecrypt.cc/*
// @match        https://www.filecrypt.cc/*
// @match        https://filecrypt.co/*
// @match        https://www.filecrypt.co/*
// @run-at       document-end
// @connect      dcrypt.it
// @connect      self
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529129/Bypass%20FileCrypt%20%28New%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529129/Bypass%20FileCrypt%20%28New%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Determine if dark theme is used
    const isDarkTheme = document.head.querySelector('meta[name="theme-color"]') !== null ||
                       document.body.classList.contains('dark') ||
                       window.getComputedStyle(document.body).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)/)?.[1] < 100;
    
    // Add stylesheet to document
    addStylesheet(isDarkTheme);
    
    // Remove ads
    removeAds();
    
    // Apply main functionality based on URL
    if (document.location.href.includes("/Link/")) {
        processSingleLink();
    } else if (document.location.href.includes("/Container/")) {
        waitForCaptchaSolved();
    }
})();

// Add stylesheet to document
function addStylesheet(isDarkTheme) {
    const style = document.createElement('style');
    
    // Define the colors based on theme
    const colors = isDarkTheme ? {
        background: '#1e1e2e',
        text: '#cdd6f4',
        accent: '#cba6f7',
        border: '#313244',
        itemBg: '#181825',
        itemHover: '#11111b',
        actionBg: '#45475a',
        actionText: '#cdd6f4'
    } : {
        background: '#ffffff',
        text: '#333333',
        accent: '#4f46e5',
        border: '#e5e7eb',
        itemBg: '#f9fafb',
        itemHover: '#f3f4f6',
        actionBg: '#e0e7ff',
        actionText: '#4f46e5'
    };
    
    // Stylesheet content
    style.textContent = `
        /* Main container */
        .fc-container {
            background-color: ${colors.background};
            color: ${colors.text};
            border: 1px solid ${colors.border};
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px ${isDarkTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
            max-width: 560px;
            margin: 40px auto 30px;
            overflow: hidden;
            font-size: 14px;
            line-height: 1.5;
            position: relative;
            z-index: 10;
        }
        
        /* Header */
        .fc-header {
            padding: 14px 18px;
            border-bottom: 1px solid ${colors.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .fc-title {
            margin: 0;
            font-weight: 600;
            font-size: 16px;
        }
        
        .fc-counter {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            background-color: ${colors.actionBg};
            color: ${colors.actionText};
        }
        
        /* Content area */
        .fc-content {
            max-height: 250px;
            overflow-y: auto;
            padding: 4px 0;
            scrollbar-width: thin;
            scrollbar-color: ${colors.border} transparent;
        }
        
        .fc-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .fc-content::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .fc-content::-webkit-scrollbar-thumb {
            background-color: ${colors.border};
            border-radius: 3px;
        }
        
        /* Loading */
        .fc-loading {
            padding: 16px;
            text-align: center;
        }
        
        .fc-loading p {
            margin-top: 12px;
            font-size: 14px;
        }
        
        .fc-spinner {
            animation: fc-rotate 2s linear infinite;
        }
        
        .fc-spinner-path {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
            animation: fc-dash 1.5s ease-in-out infinite;
            stroke: ${colors.accent};
        }
        
        @keyframes fc-rotate {
            100% {
                transform: rotate(360deg);
            }
        }
        
        @keyframes fc-dash {
            0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -35px;
            }
            100% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -124px;
            }
        }
        
        /* Domain headers */
        .fc-domain-header {
            padding: 6px 16px;
            font-size: 13px;
            font-weight: 500;
            color: ${colors.accent};
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .fc-domain-header:not(:first-child) {
            margin-top: 10px;
        }
        
        .fc-domain-count {
            background-color: ${colors.actionBg};
            border-radius: 10px;
            padding: 1px 6px;
            font-size: 11px;
        }
        
        /* Link items */
        .fc-link-item {
            padding: 8px 16px;
            margin: 4px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            border-radius: 4px;
            transition: background-color 0.2s;
            cursor: pointer;
        }
        
        .fc-link-item:hover {
            background-color: ${colors.itemHover};
        }
        
        .fc-link-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            font-size: 14px;
            color: white !important;
            opacity: 0.9;
        }
        
        /* Copy button */
        .fc-copy-btn {
            width: 28px;
            height: 28px;
            min-width: 28px;
            background-color: transparent;
            color: ${colors.accent};
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: background-color 0.2s;
            margin: 0;
        }
        
        .fc-copy-btn:hover {
            background-color: ${colors.actionBg};
        }
        
        /* Footer */
        .fc-footer {
            padding: 12px 16px;
            border-top: 1px solid ${colors.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .fc-info-text {
            opacity: 0.7;
            font-size: 12px;
        }
        
        .fc-copy-all {
            padding: 8px 12px;
            background-color: ${colors.accent};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .fc-copy-all:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .fc-copy-all:hover:not(:disabled) {
            filter: brightness(1.1);
        }
    `;
    
    document.head.appendChild(style);
}

// Remove ads
function removeAds() {
    const usenetAds = document.querySelectorAll('a[href*="/pink/"]');
    for (const ad of usenetAds) {
        if (ad.parentNode) {
            ad.parentNode.remove();
        }
    }
}

// Check if captcha is solved by looking for download buttons
function waitForCaptchaSolved() {

    // Function to check if captcha is solved based on visible elements
    function isCaptchaSolved() {
        // Look for download buttons or elements that appear after captcha
        return document.querySelectorAll('.dlcdownload').length > 0;
    }

    // If captcha is already solved, proceed immediately
    if (isCaptchaSolved()) {
        processContainerPage();
        return;
    }

    // Otherwise, wait for captcha to be solved
    const captchaObserver = new MutationObserver((mutations, observer) => {
        if (isCaptchaSolved()) {
            observer.disconnect();
            processContainerPage();
        }
    });

    captchaObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Process single link page
async function processSingleLink() {
    if (document.body.getElementsByTagName("SCRIPT").length === 0) {
        window.stop();
        
        let htmlContent = document.body.innerHTML;
        if (!htmlContent || document.body.children.length === 0) {
            try {
                const response = await fetch(document.location.href);
                htmlContent = await response.text();
            } catch (error) {
                console.error("Failed to fetch page content:", error);
                return;
            }
        }
        
        const httpIndex = htmlContent.lastIndexOf("http");
        if (httpIndex !== -1) {
            const endIndex = htmlContent.indexOf('id=', httpIndex) + 43;
            let finalUrl = htmlContent.substring(httpIndex, endIndex).replace(/&amp;/g, '&');
            window.location.href = finalUrl;
        }
    }
}

// Process container page
function processContainerPage() {
    // Find the best container to insert our link box
    const containerSection = findBestContainer();
    
    // Create container elements
    const { container, content, counter, copyAllBtn } = createLinkBox();
    
    // Insert the box at the appropriate location
    containerSection.insertBefore(container, containerSection.firstChild);
    
    // Try to get DLC file
    const dlcButtons = document.getElementsByClassName("dlcdownload");
    if (dlcButtons.length > 0) {
        const dlcId = dlcButtons[0].getAttribute("onclick")?.split("'")[1];
        if (dlcId) {
            fetchDlcAndDecrypt(dlcId, { content, counter, copyAllBtn });
            return;
        }
    }
    
    // Fall back to manual link extraction
    extractLinks({ content, counter, copyAllBtn });
}

// Find the best container for inserting our box
function findBestContainer() {
    // Try various selectors in order of preference
    const selectors = [
        '.content .window', 
        '.download', 
        '.content', 
        'main',
        'article', 
        '.container', 
        '#container'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
    }
    
    // Fallback to body if no suitable container found
    return document.body;
}

// Create DOM structure for the link box
function createLinkBox() {
    // Create container
    const container = document.createElement("div");
    container.className = "fc-container";
    
    // Create header
    const header = document.createElement("div");
    header.className = "fc-header";
    
    const title = document.createElement("h3");
    title.className = "fc-title";
    title.innerHTML = "🔓 Decrypted Links";
    
    const counter = document.createElement("span");
    counter.className = "fc-counter";
    counter.id = "fc-counter";
    counter.textContent = "Loading...";
    
    header.appendChild(title);
    header.appendChild(counter);
    container.appendChild(header);
    
    // Create content area
    const content = document.createElement("div");
    content.className = "fc-content";
    content.id = "fc-content";
    
    // Add loading animation
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "fc-loading";
    loadingDiv.id = "fc-loading";
    
    loadingDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="fc-spinner fc-spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="2" />
        </svg>
        <p>Decrypting links...</p>
    `;
    
    content.appendChild(loadingDiv);
    container.appendChild(content);
    
    // Create footer
    const footer = document.createElement("div");
    footer.className = "fc-footer";
    
    // Add info text
    const infoText = document.createElement("small");
    infoText.className = "fc-info-text";
    infoText.textContent = "Click link to open, or use copy button";
    
    // Add copy all button
    const copyAllBtn = document.createElement("button");
    copyAllBtn.className = " fc-copy-all";
    copyAllBtn.id = "fc-copy-all";
    copyAllBtn.textContent = "Copy All";
    copyAllBtn.disabled = true;
    
    footer.appendChild(infoText);
    footer.appendChild(copyAllBtn);
    container.appendChild(footer);
    
    return { container, content, counter, copyAllBtn };
}

// Fetch DLC file and decrypt it
async function fetchDlcAndDecrypt(dlcId, elements) {
    try {
        // Update the loading message
        const loadingDiv = document.getElementById("fc-loading");
        const loadingText = loadingDiv.querySelector("p");
        loadingText.textContent = "Fetching DLC file...";
        
        // Fetch the DLC file
        const response = await fetch(`https://${document.location.hostname}/DLC/${dlcId}.dlc`);
        if (!response.ok) throw new Error('Failed to fetch DLC file');
        const dlcContent = await response.text();
        
        loadingText.textContent = "Decrypting links via dcrypt.it...";
        
        // Use GM.xmlHttpRequest for dcrypt.it (since it may require CORS handling)
        GM.xmlHttpRequest({
            method: "POST",
            url: "http://dcrypt.it/decrypt/paste",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "content=" + encodeURIComponent(dlcContent),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.response);
                    
                    if (result.success && result.success.links && result.success.links.length > 0) {
                        displayLinks(result.success.links, elements);
                    } else {
                        throw new Error("No links were found in the dcrypt.it response");
                    }
                } catch (error) {
                    console.error("Error parsing dcrypt.it response:", error);
                    extractLinks(elements);
                }
            },
            onerror: function() {
                console.error("Error connecting to dcrypt.it");
                extractLinks(elements);
            }
        });
    } catch (error) {
        console.error("Error fetching DLC:", error);
        extractLinks(elements);
    }
}

// Extract links directly from page
function extractLinks(elements) {
    const loadingDiv = document.getElementById("fc-loading");
    const loadingText = loadingDiv.querySelector("p");
    loadingText.textContent = "Extracting links directly..."; 
    
    const encLinks = document.querySelectorAll("[onclick^=openLink]");
    if (encLinks.length === 0) {
        showError("No links found on this page.");
        return;
    }
    
    // Update counter to show progress
    elements.counter.textContent = `0/${encLinks.length}`;
    
    let completedLinks = 0;
    const validLinks = [];
    
    // Process each link with a small delay between requests to avoid overloading
    const processLink = (index) => {
        if (index >= encLinks.length) {
            if (validLinks.length > 0) {
                displayLinks(validLinks, elements);
            } else {
                showError("Failed to extract any valid links.");
            }
            return;
        }
        
        const link = encLinks[index];
        const onclick = link.getAttribute("onclick");
        const encParam = onclick.split("'")[1];
        const encValue = link.getAttribute(encParam);
        const linkUrl = `http://${document.location.hostname}/Link/${encValue}.html`;
        
        fetchFinalLink(linkUrl)
            .then(finalLink => {
                completedLinks++;
                elements.counter.textContent = `${completedLinks}/${encLinks.length}`;
                
                if (finalLink) {
                    validLinks.push(finalLink);
                }
                
                // Process next link with a small delay
                setTimeout(() => processLink(index + 1), 100);
            })
            .catch(() => {
                completedLinks++;
                elements.counter.textContent = `${completedLinks}/${encLinks.length}`;
                setTimeout(() => processLink(index + 1), 100);
            });
    };
    
    // Start processing links
    processLink(0);
}

// Show error message
function showError(message) {
    const loadingDiv = document.getElementById("fc-loading");
    loadingDiv.innerHTML = `
        <div style="color:var(--fc-accent,#4f46e5);font-size:24px;margin-bottom:10px">❌</div>
        <p style="margin:0">${message}</p>
    `;
    
    const counter = document.getElementById("fc-counter");
    if (counter) counter.textContent = "Error";
}

// Fetch a single link's destination
async function fetchFinalLink(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        // Try to find the redirect URL in scripts
        const scripts = doc.querySelectorAll("script");
        for (const script of scripts) {
            if (script.textContent.includes("top.location.href=")) {
                const matches = script.textContent.match(/top\.location\.href\s*=\s*['"]([^'"]+)['"]/);
                if (matches && matches[1]) {
                    return await resolveRedirect(matches[1]);
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching link:", error);
        return null;
    }
}

// Resolve final URL from redirect
async function resolveRedirect(url) {
    try {
        // Using fetch with HEAD method to get the final URL
        const controller = new AbortController();
        const signal = controller.signal;
        
        // Set a timeout to abort the request
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { 
            method: 'HEAD',
            signal,
            redirect: 'follow'
        });
        
        clearTimeout(timeoutId);
        return response.url;
    } catch (error) {
        // If HEAD fails, try GET with GM.xmlHttpRequest
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onreadystatechange: function(response) {
                    if (response.readyState === 2) {  // HEADERS_RECEIVED
                        resolve(response.finalUrl);
                        this.abort();
                    }
                },
                onerror: function() {
                    resolve(url); // Return original URL if everything fails
                }
            });
        });
    }
}

// Display links with modern UI
function displayLinks(links, elements) {
    // Update counter
    elements.counter.textContent = `${links.length} Links`;
    
    // Clear loading indicator
    elements.content.innerHTML = '';
    
    // Enable copy all button
    elements.copyAllBtn.disabled = false;
    elements.copyAllBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(links.join('\n'))
            .then(() => {
                const originalText = elements.copyAllBtn.textContent;
                elements.copyAllBtn.textContent = "✓ Copied";
                setTimeout(() => {
                    elements.copyAllBtn.textContent = originalText;
                }, 2000);
            });
    });
    
    // Group links by domain for better organization
    const linksByDomain = {};
    links.forEach(link => {
        try {
            const url = new URL(link);
            const domain = url.hostname;
            if (!linksByDomain[domain]) {
                linksByDomain[domain] = [];
            }
            linksByDomain[domain].push(link);
        } catch (e) {
            // If parsing fails, put in "Other" category
            if (!linksByDomain["Other"]) {
                linksByDomain["Other"] = [];
            }
            linksByDomain["Other"].push(link);
        }
    });
    
    // Sort domains alphabetically
    const domains = Object.keys(linksByDomain).sort();
    
    // Create link items by domain
    domains.forEach((domain, domainIndex) => {
        // Add domain header if multiple domains exist
        if (domains.length > 1) {
            const domainHeader = document.createElement("div");
            domainHeader.className = "fc-domain-header";
            
            domainHeader.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                </svg>
                <span>${domain}</span>
                <span class="fc-domain-count">${linksByDomain[domain].length}</span>
            `;
            
            elements.content.appendChild(domainHeader);
        }
        
        // Add links for this domain
        linksByDomain[domain].forEach(link => {
            const linkItem = createLinkItem(link);
            elements.content.appendChild(linkItem);
        });
    });
}

// Create a link item element
function createLinkItem(link) {
    const linkItem = document.createElement("div");
    linkItem.className = "fc-link-item";
    
    // Link text container
    const linkText = document.createElement("a");
    linkText.className = "fc-link-text";
    linkText.href = link;
    linkText.textContent = link;
    linkText.title = link;
    linkText.rel = "noopener";
    linkText.target = "_blank";
    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "fc-copy-btn";
    copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;
    
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link)
            .then(() => {
                // Visual feedback when copied
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 1500);
            });
    });
    
    linkItem.appendChild(linkText);
    linkItem.appendChild(copyBtn);
    
    return linkItem;
}