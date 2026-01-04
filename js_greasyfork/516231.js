// ==UserScript==
// @name         Premiumize.me Premium Link Converter
// @version      3.1.2
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @run-at       document-end
// @include      *://*
// @match        https://www.premiumize.me/
// @description  Convert standard links into premium links using premiumize.me
// @icon         https://icons.duckduckgo.com/ip2/Premiumize.me.ico
// @author       JRem
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516231/Premiumizeme%20Premium%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/516231/Premiumizeme%20Premium%20Link%20Converter.meta.js
// ==/UserScript==

let regexPattern = null;
const processedURLs = new Set();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Determine if the pattern should be refreshed
function shouldUpdateWildcards() {
    const lastUpdated = GM_getValue("lastUpdated", 0);
    const now = Date.now();
    return !regexPattern || regexPattern.source === '' || (now - lastUpdated > ONE_DAY_MS);
}

// Fetch new regex wildcards from Premiumize API
function updateLinkWildcards() {
    console.log("Fetching Premiumize Wildcards...");
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://www.premiumize.me/addonapi",
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                console.log("API Wildcard Response:", data);

                if (data.linkwildcards && Array.isArray(data.linkwildcards)) {
                    const escapedWildcards = data.linkwildcards.map(pattern =>
                        pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')
                    );

                    regexPattern = new RegExp(escapedWildcards.join('|'), 'i');
                    GM_setValue("regexPatternSource", regexPattern.source);
                    GM_setValue("lastUpdated", Date.now());
                    if (data.apipass) {
                        GM_setValue("apikey", data.apipass);
                    }

                    showToast("✅ Premiumize domains and API key updated!");
                } else {
                    throw new Error("Invalid wildcard data.");
                }
            } catch (err) {
                console.error("Failed to parse wildcard response:", err);
                showToast("Error: could not parse Premiumize wildcard response.");
            }
        },
        onerror: (err) => {
            console.error("Request error:", err);
            showToast("Failed to fetch Premiumize link wildcards.");
        }
    });
}

// Load stored regex on startup
function loadStoredRegex() {
    const source = GM_getValue("regexPatternSource", null);
    if (source) {
        regexPattern = new RegExp(source, 'i');
    }
}

// Check if current URL matches Premiumize wildcard pattern
function matchesPremiumizeLink(url) {
    return regexPattern && regexPattern.test(url);
}

// Create menu command
function createMenu() {
    GM_registerMenuCommand("Update Premiumize Domains", updateLinkWildcards);
    console.log("Menu command registered.");
}

// Display a toast message in the center of the screen
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '16px';
    toast.style.textAlign = 'center';
    toast.style.animation = 'fadeOut 3s ease forwards';

    document.body.appendChild(toast);

    // Remove the toast after the animation
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);

    // Add fade-out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 0.8; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Create button for direct download links
function createFastDownloadButton(linkElement, fileURL) {
    let button = document.createElement('button');
    button.innerHTML = 'Send to Premiumize';
    button.style.marginLeft = '2px';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.borderRadius = '5px';
    button.onclick = () => {
        window.open(`https://www.premiumize.me/transfers?url=${encodeURIComponent(fileURL)}`, '_blank');
    };
    linkElement.setAttribute('premiumize', 'true');
    linkElement.insertAdjacentElement('afterend', button);
}

// Create button for magnet links
function createMagnetButton(linkElement, magnetURL) {
    let button = document.createElement('button');
    button.innerHTML = 'Send to Premiumize';
    button.style.marginLeft = '2px';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.borderRadius = '5px';
    button.onclick = () => {
        sendMagnetToPremiumize(magnetURL);
    };
    linkElement.setAttribute('premiumize', 'true');
    linkElement.insertAdjacentElement('afterend', button);
}

function sendMagnetToPremiumize(magnetURL) {
    const apikey = GM_getValue("apikey", null);
    if (!apikey) {
        showToast("Premiumize API key not set. Please run 'Update Premiumize Domains' first.");
        return;
    }

    const formData = new FormData();
    formData.append("src", magnetURL);

    GM.xmlHttpRequest({
        method: "POST",
        url: `https://www.premiumize.me/api/transfer/create?apikey=${apikey}`,
        data: formData,
        headers: {
            "accept": "application/json"
        },
        onload: (response) => {
            try {
                const res = JSON.parse(response.responseText);
                if (res.status === "success") {
                    showToast(`✅ Magnet sent successfully!\nName: ${res.name}`);
                } else {
                    showToast(`❌ Failed to send magnet: ${res.message}`);
                }
            } catch (err) {
                console.error("Error parsing magnet response:", err);
                showToast("❌ Failed to send magnet: Invalid server response.");
            }
        },
        onerror: (err) => {
            console.error("Magnet send error:", err);
            showToast("❌ Failed to send magnet: Network error.");
        }
    });
}

// Process HTTP-based links
function processHttpLinks() {
    if (!regexPattern) return;

    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        const href = link.href;
        if (!processedURLs.has(href) && matchesPremiumizeLink(href)) {
            createFastDownloadButton(link, href);
            processedURLs.add(href);
        }
    });
}

// Process magnet links
function processMagnetLinks() {
    const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
    magnetLinks.forEach(link => {
        const href = link.href;
        if (!processedURLs.has(href)) {
            createMagnetButton(link, href);
            processedURLs.add(href);
        }
    });
}

// Observe and process links
function observeLinks() {
    processHttpLinks();
    processMagnetLinks();
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const observer = new MutationObserver(debounce(observeLinks, 500));
observer.observe(document.body, { childList: true, subtree: true });

window.onload = () => {
    loadStoredRegex();
    createMenu();

    // ✅ Auto-update if regex is missing or too old
    if (shouldUpdateWildcards()) {
        console.log("Auto-updating Premiumize linkwildcards...");
        updateLinkWildcards();
    }

    observeLinks();
};
