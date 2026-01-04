// ==UserScript==
// @name         Torn Item Market Helper
// @namespace    Nurv.IronNerd.me
// @version      1.1
// @description  Items market 2.0 helper
// @author       Nurv [669537]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @icon         https://img.icons8.com/?size=100&id=NrG0tlrTAiph&format=png&color=000000
// @connect      torn.synclayer.dev
// @license      Copyright SyncLayer.dev
// @downloadURL https://update.greasyfork.org/scripts/520019/Torn%20Item%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520019/Torn%20Item%20Market%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.tornBuyMugInitialized) return;
    window.tornBuyMugInitialized = true;

    const BACKEND_BASE_URL = "https://torn.synclayer.dev";
    const CACHE_DURATION = 5000;
    const dataCache = {};
    let currentPopups = [];
    const processedRows = new Set();

    function setSetting(name, value) {
        GM_setValue(name, value);
    }
    function getSetting(name) {
        return GM_getValue(name, null);
    }

    function addGlobalStyles() {
        const css = `
        .mugButton {
            cursor: pointer;
            margin-right: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            z-index: 1500 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: relative;
        }
        .mugButton svg {
            width: 30px;
            height: 30px;
        }
        .mugPanel {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: linear-gradient(to bottom right, #ffffff, #f7f7f7);
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            font-size: 14px;
            font-family: Arial, sans-serif;
            color: #333;
        }
        .mugPanel label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #222;
        }
        .mugPanel input {
            width: 100%;
            margin-bottom: 15px;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
        }
        .mugPanel .closeButton {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #d9534f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 16px;
            line-height: 25px;
            text-align: center;
        }
        .mugPanel button.saveSettings {
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: bold;
        }
        .mugPanel button.saveSettings:hover {
            background: #218838;
        }
        .infoIcon {
            margin-left: 5px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #007bff;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 12px;
            text-align: center;
            line-height: 16px;
            z-index: 1000 !important;
        }
        .infoPopup {
            position: absolute;
            color: black;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-size: 12px;
            z-index: 2000;
            display: none;
            background-color: white;
        }
        .infoPopup.visible {
            display: block !important;
        }
        .popupCloseButton {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #d9534f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
        }
        .popupCloseButton:hover {
            background: #c9302c;
        }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    function createMugButtonAndPanel() {
        if (document.querySelector('.mugButton')) return;

        const mugButton = document.createElement('div');
        mugButton.className = 'mugButton';
        mugButton.innerHTML = `<svg fill="#ffffff" height="256px" width="256px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#ff0505" stroke-width="13.311974000000001">
                <g><g><path d="M182.705,70.577c-1.157-7.628-8.271-12.872-15.91-11.717c-3.187,0.484-6.377,0.844-9.566,1.137l-3.845-33.66
                    c-0.32-2.804-2.805-4.849-5.618-4.625l-16.658,1.326c-4.652,0.37-9.326-0.326-13.668-2.036l-15.549-6.124
                    c-2.626-1.034-5.599,0.199-6.723,2.787L81.681,48.743c-2.966-1.209-5.913-2.485-8.82-3.875c-6.962-3.33-15.302-0.389-18.633,6.571
                    c-3.33,6.96-0.387,15.301,6.572,18.632c5.719,2.736,11.545,5.157,17.451,7.294c-0.463,1.6-0.836,3.245-1.09,4.937
                    c-3.109,20.68,11.135,39.963,31.815,43.071c20.68,3.109,39.963-11.135,43.071-31.815c0.264-1.751,0.392-3.49,0.413-5.212
                    c6.175-0.328,12.356-0.927,18.529-1.864C178.616,85.327,183.862,78.205,182.705,70.577z"></path></g></g>
                <g><g><path d="M293.065,163.552c-7.081-0.336-22.746-1.078-38.84-1.841v-8.307c0-2.279-1.847-4.126-4.127-4.126h-8.74
                    c-2.279,0-4.127,1.848-4.127,4.126c0,2.777,0,4.715,0,7.501c-0.061-0.002-0.122-0.006-0.184-0.009
                    c0.068-0.023-1.659-0.05-2.815,0.164c-8.75,1.382-14.32,10.182-11.813,18.777l-65.756,23.648l-39.853-38.6l29.359,16.761
                    l0.75-4.992c2.261-15.041-7.307-28.948-21.37-31.062l-33.314-5.663c-5.397-0.918-12.278-1.024-18.744,3.721L6.488,196.082
                    c-5.079,3.974-7.455,10.491-6.124,16.802l18.452,87.497c1.678,7.959,8.702,13.42,16.524,13.42c6.01,0,11.756-3.192,14.827-8.782
                    l9.589,77.436L33.05,469.738c-3.468,11.334,2.91,23.333,14.243,26.8c11.333,3.468,23.333-2.907,26.801-14.244l28.044-91.658
                    c0.882-2.884,1.147-5.921,0.777-8.916l-8.74-70.583l2.063,0.342l27.352,71.832l-4.97,91.54
                    c-0.642,11.835,8.432,21.951,20.267,22.593c11.716,0.666,21.946-8.344,22.593-20.265l5.217-96.088
                    c0.162-2.997-0.305-5.996-1.373-8.801c-25.131-65.865-34.333-89.652-34.333-89.652l4.297-28.584l-41.994-64.881l47.417,45.926
                    c4.665,4.52,11.455,5.932,17.482,3.765l84.144-30.263c6.118-2.201,10.177-7.566,11.017-13.586c2.235,2.491,5.89,3.169,8.883,1.542
                    c3.535-1.919,4.843-6.34,2.924-9.875l-3.049-5.613c2.083-0.099,4.132-0.196,6.134-0.29c10.621-0.504,19.843-0.941,24.817-1.177
                    c2.202-0.105,3.931-1.915,3.931-4.119v-7.815C296.996,165.469,295.264,163.657,293.065,163.552z M46.079,265.805l-10.458-49.587
                    l20.392-15.957L46.079,265.805z"></path></g></g>
                <g><g><path d="M490.36,141.071c-2.138-13.934-14.156-23.324-26.841-20.975l-42.061,7.788c-12.685,2.349-21.235,15.549-19.096,29.483
                    l4.07,26.512l8.565-1.089l10.237-13.234l-14.362,29.01l-36.041,4.174c1.474-3.934-1.448-8.044-5.568-8.044h-27.181
                    c-4.306,0-7.194,4.442-5.444,8.378l2.728,6.137c-5.724,4.003-9.127,10.938-8.266,18.363c0.508,4.393,2.431,8.276,5.258,11.252
                    c-3.445,3.809-7.005,7.992-10.375,12.378c-9.169,11.931-16.91,25.327-16.91,36.572c0,27.595,20.863,49.964,46.6,49.964
                    s46.6-22.37,46.6-49.964c0-9.52-5.547-20.582-12.811-30.989c-3.634-5.206-7.695-10.244-11.711-14.848l48.242-5.587
                    c6.612-0.766,12.386-4.828,15.34-10.794c3.401-6.871,28.329-57.221,31.892-64.417l-17.012,70.989
                    c-2.054,10.326-10.459,18.678-19.509,19.845c-8.37,1.057,0,0-19.441,2.473c1.962,12.783-0.95-6.186,6.563,42.761l-0.102,178.021
                    c0,12.292,9.965,22.256,22.257,22.256s22.257-9.965,22.257-22.256V290.155l17.312-3.206v188.279
                    c0,7.379-2.026,14.283-5.543,20.197c2.835,1.31,5.982,2.061,9.309,2.061c12.292,0,22.257-9.965,22.257-22.256l0.426-193.178
                    L490.36,141.071z M358.695,306.836v1.844c0,0.889-1.207,1.716-2.414,1.716c-1.399,0-2.416-0.827-2.416-1.716v-1.589
                    c-7.627-0.255-13.855-4.195-13.855-8.262c0-2.161,1.906-5.338,4.322-5.338c2.669,0,4.83,3.75,9.533,4.576V287.77
                    c-5.847-2.225-12.711-4.958-12.711-13.092c0-8.071,5.974-11.948,12.711-12.901v-1.779c0-0.89,1.017-1.716,2.416-1.716
                    c1.207,0,2.414,0.827,2.414,1.716v1.588c3.941,0.128,11.377,1.145,11.377,5.53c0,1.716-1.144,5.212-3.941,5.212
                    c-2.097,0-3.305-2.034-7.436-2.351v9.278c5.784,2.161,12.521,5.148,12.521,13.728C371.216,300.862,366.131,305.628,358.695,306.836z"></path></g></g>
                <g><g><circle cx="398.348" cy="78.006" r="37.885"></circle></g></g>
                <g><g><path d="M358.06,289.486v8.516c2.161-0.508,3.876-1.716,3.876-4.004C361.938,291.901,360.348,290.566,358.06,289.486z"></path></g></g>
                <g><g><path d="M350.434,273.724c0,1.844,1.652,2.987,4.068,4.004v-7.564C351.641,270.737,350.434,272.199,350.434,273.724z"></path></g></g>
            </g>
        </svg>`;

        const mugPanel = document.createElement('div');
        mugPanel.className = 'mugPanel';
        mugPanel.innerHTML = `
            <button class="closeButton">&times;</button>
            <label>Enter Torn API Key:</label>
            <input type="text" id="apiKeyInput" placeholder="API Key" />
            <label>Mug Merits (0-10):</label>
            <input type="number" id="mugMeritsInput" placeholder="0 to 10" min="0" max="10" />
            <label>Plunder % (20% to 49%):</label>
            <input type="number" id="plunderInput" placeholder="Plunder %" min="20" max="49" step="0.01" />
            <label>Minimum Threshold ($):</label>
            <input type="number" id="thresholdInput" placeholder="Minimum Threshold" min="0" />
            <button class="saveSettings">Save</button>
        `;

        mugPanel.querySelector('.closeButton').addEventListener('click', () => {
            mugPanel.style.display = 'none';
        });

        const savedApiKey = getSetting('tornBuyMugApiKey');
        if (savedApiKey) mugPanel.querySelector('#apiKeyInput').value = savedApiKey;
        const savedMerits = getSetting('tornBuyMugMerits');
        if (savedMerits) mugPanel.querySelector('#mugMeritsInput').value = savedMerits;
        const savedPlunder = getSetting('tornBuyMugPlunder');
        if (savedPlunder) {
            mugPanel.querySelector('#plunderInput').value = parseFloat(savedPlunder).toFixed(2);
        }
        const savedThreshold = getSetting('tornBuyMugThreshold');
        if (savedThreshold) mugPanel.querySelector('#thresholdInput').value = savedThreshold;

        mugPanel.querySelector('.saveSettings').addEventListener('click', function () {
            const apiKeyVal = mugPanel.querySelector('#apiKeyInput').value.trim();
            const mugMeritsVal = parseInt(mugPanel.querySelector('#mugMeritsInput').value.trim(), 10);
            let plunderInputVal = parseFloat(mugPanel.querySelector('#plunderInput').value.trim());
            const thresholdVal = parseInt(mugPanel.querySelector('#thresholdInput').value.trim(), 10);

            if (!apiKeyVal) {
                alert("API Key cannot be empty.");
                return;
            }
            if (plunderInputVal === '' || parseFloat(plunderInputVal) === 0) {
                plunderInputVal = 0;
            } else {
                plunderInputVal = parseFloat(plunderInputVal);
                if (plunderInputVal < 20 || plunderInputVal > 50) {
                    alert("Plunder percentage must be between 20% and 49%, or leave it empty if not using.");
                    return;
                }
            }
            setSetting('tornBuyMugApiKey', apiKeyVal);
            setSetting('tornBuyMugMerits', isNaN(mugMeritsVal) ? 0 : Math.min(Math.max(mugMeritsVal, 0), 10));
            setSetting('tornBuyMugPlunder', plunderInputVal);
            setSetting('tornBuyMugThreshold', isNaN(thresholdVal) ? 0 : thresholdVal);
            alert("Settings saved successfully!");
            mugPanel.style.display = 'none';
        });

        mugButton.addEventListener('click', () => {
            mugPanel.style.display = (mugPanel.style.display === 'none' || mugPanel.style.display === '') ? 'block' : 'none';
        });

        const appHeader = document.querySelector('.appHeaderWrapper___uyPti .linksContainer___LiOTN');
        if (appHeader) {
            appHeader.prepend(mugPanel);
            appHeader.prepend(mugButton);
        }
    }

    function waitForElements(selector, callback, maxAttempts = 10, interval = 500) {
        let attempts = 0;
        const check = () => {
            attempts++;
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                callback(elements);
            } else if (attempts < maxAttempts) {
                setTimeout(check, interval);
            }
        };
        check();
    }

    function extractUserId(href) {
        const match = href.match(/XID=(\d+)/);
        return match ? match[1] : null;
    }

    function createInfoPopup(data, newCostPerItem) {
        const popup = document.createElement("div");
        popup.className = "infoPopup";
        popup.innerHTML = `
            <button class="popupCloseButton">×</button>
            <strong>Level:</strong> ${data.level}<br>
            <strong>Status:</strong> ${data.status}<br>
            
            <strong>Total Money:</strong> $${data.total_money.toLocaleString()}<br>
            ${data.clothing_note ? `<strong>${data.clothing_note}</strong><br>` : ""}
            <strong>Potential Mug:</strong> ~${data.mug_percentage.toFixed(2)}% ≈ $${data.potential_mug.toLocaleString()}<br>
            <strong>New Cost Per Item:</strong> $${newCostPerItem.toLocaleString()}
        `;
        popup.style.backgroundColor = data.background_color;
        const closeButton = popup.querySelector(".popupCloseButton");
        closeButton.addEventListener("click", () => {
            popup.remove();
            const index = currentPopups.indexOf(popup);
            if (index > -1) {
                currentPopups.splice(index, 1);
            }
        });
        return popup;
    }

    function positionPopup(icon, popup) {
        const rect = icon.getBoundingClientRect();
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;

        popup.style.visibility = 'hidden';
        popup.style.display = 'block';
        const popupHeight = popup.offsetHeight;
        const popupWidth = popup.offsetWidth;
        popup.style.display = '';
        popup.style.visibility = '';

        if (rect.bottom + popupHeight + 5 > window.innerHeight) {
            top = rect.top + window.scrollY - popupHeight - 5;
        }
        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 5;
        }
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    function closeAllPopups() {
        currentPopups.forEach(popup => popup.remove());
        currentPopups = [];
    }

    function fetchUserData(apiKey, playerId, mugMerits, plunderPercent, totalMoney, threshold, available) {
        const requestData = {
            api_key: apiKey,
            player_id: playerId,
            mug_merits: mugMerits,
            plunder_percent: plunderPercent,
            total_money: totalMoney,
            threshold: threshold,
            available: available,
        };
        const cacheKey = `${apiKey}_${playerId}_${mugMerits}_${plunderPercent}_${totalMoney}_${threshold}_${available}`;
        const now = Date.now();
        if (dataCache[cacheKey] && (now - dataCache[cacheKey].timestamp < CACHE_DURATION)) {
            return Promise.resolve(dataCache[cacheKey].data);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${BACKEND_BASE_URL}/api/torn-data`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(requestData),
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            dataCache[cacheKey] = { data: data, timestamp: now };
                            resolve(data);
                        } catch (e) {
                            reject("Invalid backend response");
                        }
                    } else {
                        reject(`Backend error: ${response.status}`);
                    }
                },
                onerror: () => {
                    reject("Network error");
                },
            });
        });
    }

    async function handleMugIconClick(totalMoney, quantity, threshold, sellerLink, icon) {
        const apiKey = getSetting("tornBuyMugApiKey");
        const mugMerits = parseInt(getSetting("tornBuyMugMerits") || "0", 10);
        const plunderPercent = parseFloat(getSetting("tornBuyMugPlunder") || 0);
        try {
            const playerId = extractUserId(sellerLink.href);
            const data = await fetchUserData(apiKey, playerId, mugMerits, plunderPercent, totalMoney, threshold, quantity);
            const newCostPerItem = Math.floor((totalMoney - data.potential_mug) / quantity);
            const popup = createInfoPopup(data, newCostPerItem);
            document.body.appendChild(popup);
            positionPopup(icon, popup);
            popup.classList.add("visible");
            currentPopups.push(popup);
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to fetch user data. Please check your API key.");
        }
    }

    async function attachInfoIconForMarketRow(row) {
        if (processedRows.has(row) && row.querySelector(".infoIcon")) return;
        if (processedRows.has(row) && !row.querySelector(".infoIcon")) {
            processedRows.delete(row);
        }
        const honorElem = row.querySelector('.honorWrap___BHau4 a.linkWrap___ZS6r9');
        const priceElement = row.querySelector(".price___Uwiv2") || row.querySelector(".price___v8rRx");
        if (!honorElem || !priceElement) return;
        const price = parseInt(priceElement.textContent.replace("$", "").replace(/,/g, ""), 10);
        const availableText = row.querySelector(".available___xegv_")?.textContent.replace(/ available|,/g, "") ||
                              row.querySelector(".available___jtANf")?.textContent.replace(/ available|,/g, "") || "0";
        const available = parseInt(availableText, 10);
        const totalMoney = price * available;
        const threshold = parseInt(getSetting("tornBuyMugThreshold") || "0", 10);
        if (totalMoney < threshold) return;
        if (row.querySelector(".infoIcon")) {
            processedRows.add(row);
            return;
        }
        const infoIcon = document.createElement("div");
        infoIcon.className = "infoIcon";
        infoIcon.textContent = "i";
        priceElement.parentNode.insertBefore(infoIcon, priceElement.nextSibling);
        infoIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAllPopups();
            handleMugIconClick(totalMoney, available, threshold, honorElem, infoIcon);
        });
        processedRows.add(row);
    }

    async function attachInfoIconForBazaarRow(row) {
        if (processedRows.has(row) && row.querySelector(".infoIcon")) return;
        if (processedRows.has(row) && !row.querySelector(".infoIcon")) {
            processedRows.delete(row);
        }
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return;
        const priceText = cells[0].innerText;
        const quantityText = cells[1].innerText;
        const price = parseInt(priceText.replace("$", "").replace(/,/g, ""), 10);
        const quantity = parseInt(quantityText.replace(/,/g, ""), 10);
        const totalMoney = price * quantity;
        const threshold = parseInt(getSetting("tornBuyMugThreshold") || "0", 10);
        if (totalMoney < threshold) return;
        const sellerLink = cells[3].querySelector("a[href*='profiles.php?XID=']");
        if (!sellerLink) return;
        if (row.querySelector(".infoIcon")) {
            processedRows.add(row);
            return;
        }
        const infoIcon = document.createElement("div");
        infoIcon.className = "infoIcon";
        infoIcon.textContent = "i";
        cells[3].appendChild(infoIcon);
        infoIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAllPopups();
            handleMugIconClick(totalMoney, quantity, threshold, sellerLink, infoIcon);
        });
        processedRows.add(row);
    }

    function processAllMarketRows() {
        const allRows = document.querySelectorAll('.rowWrapper___me3Ox, .sellerRow___Ca2pK');
        allRows.forEach(row => attachInfoIconForMarketRow(row));
    }

    function observeMarketRows() {
        const container = document.querySelector('.sellerListWrapper___PN32N');
        if (!container) return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('.rowWrapper___me3Ox, .sellerRow___Ca2pK')) {
                            attachInfoIconForMarketRow(node);
                        } else {
                            const newRows = node.querySelectorAll?.('.rowWrapper___me3Ox, .sellerRow___Ca2pK');
                            newRows?.forEach(row => attachInfoIconForMarketRow(row));
                        }
                    }
                });
            });
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    function processAllBazaarRows() {
        const bazaarRows = document.querySelectorAll('#fullListingsView table tbody tr, #topCheapestView table tbody tr');
        bazaarRows.forEach(row => attachInfoIconForBazaarRow(row));
    }

    function observeBazaarRows() {
        const bazaarContainers = document.querySelectorAll('#fullListingsView, #topCheapestView');
        bazaarContainers.forEach(container => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches("table tbody tr")) {
                            attachInfoIconForBazaarRow(node);
                        } else if (node.nodeType === 1) {
                            const newRows = node.querySelectorAll?.("table tbody tr");
                            newRows?.forEach(row => attachInfoIconForBazaarRow(row));
                        }
                    });
                });
            });
            observer.observe(container, { childList: true, subtree: true });
        });
    }

    function setupURLChangeListener() {
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
        window.addEventListener('hashchange', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
        window.addEventListener('locationchange', () => {
            processedRows.clear();
            processAllMarketRows();
        });
    }

    document.addEventListener('click', (e) => {
        if (!currentPopups.some(popup => popup.contains(e.target))) {
            closeAllPopups();
        }
    });
    window.addEventListener('load', () => {
        setTimeout(() => {
            addGlobalStyles();
            createMugButtonAndPanel();
            waitForElements('.rowWrapper___me3Ox, .sellerRow___Ca2pK', () => {
                processAllMarketRows();
                observeMarketRows();
            });
            waitForElements('#fullListingsView, #topCheapestView', () => {
                processAllBazaarRows();
                observeBazaarRows();
            });
            setupURLChangeListener();
            setInterval(processAllMarketRows, 2000);
        }, 1000);
    });
})();