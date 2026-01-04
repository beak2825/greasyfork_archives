// ==UserScript==
// @name         Shinoa Logs Helper
// @namespace    https://shinoa.tech/
// @version      1.0
// @description  helper shinoa
// @author       [02] Mikki Tyler
// @match        https://logs.shinoa.tech/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532739/Shinoa%20Logs%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/532739/Shinoa%20Logs%20Helper.meta.js
// ==/UserScript==

(async function () {
    let globalHeaders = {};
    let blockedCount = 0;
    let unblockedCount = 0;
    let isRetryInProgress = false;
    let retryQueue = [];

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._headers = {};
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._headers[header] = value;
        return originalSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (this._method === 'POST') {
            globalHeaders = { ...this._headers };
        }
        return originalSend.apply(this, arguments);
    };

    function sendPostRequest(url, data) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            for (const key in globalHeaders) {
                xhr.setRequestHeader(key, globalHeaders[key]);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        });
    }

    const processedIds = new Set();
    const requestQueue = [];
    let isProcessing = false;
    const batchSize = 10;

    function processRequestQueue() {
        if (isProcessing || requestQueue.length === 0 || isRetryInProgress) return;

        isProcessing = true;
        let batch = requestQueue.splice(0, batchSize);

        Promise.all(batch.map(({ id, server, nicknameCell }) => {
            const data = { name: id, server: parseInt(server) };
            return sendPostRequest('../api/v1/punish', data)
                .then((response) => {
                    processResponse(response, nicknameCell, id, server);
                })
                .catch((error) => {
                    console.error(`Ошибка при запросе для ID ${id}:`, error);
                    if (error.includes('Too Many Attempts')) {
                        handleTooManyAttempts(id, server, nicknameCell);
                    }
                });
        })).finally(() => {
            setTimeout(() => {
                isProcessing = false;
                processRequestQueue();
            }, 3000);
        });
    }

    function handleTooManyAttempts(id, server, nicknameCell) {
        isRetryInProgress = true;
        retryQueue.push({ id, server, nicknameCell });
        retryRequest();
    }

    function retryRequest() {
        if (retryQueue.length === 0) {
            isRetryInProgress = false;
            processRequestQueue();
            return;
        }

        const { id, server, nicknameCell } = retryQueue[0];
        const data = { name: id, server: parseInt(server) };

        sendPostRequest('../api/v1/punish', data)
            .then((response) => {
                processResponse(response, nicknameCell, id, server);
                retryQueue.shift();
                retryRequest();
            })
            .catch((error) => {
                console.error(`Ошибка при повторном запросе для ID ${id}:`, error);
                setTimeout(retryRequest, 10000);
            });
    }

    function processResponse(response, nicknameCell, id, server) {
        if (response.ban === null) {
            if (!nicknameCell.textContent.includes('Не заблокирован')) {
                nicknameCell.textContent += ' -> ✅ | Не заблокирован';
                unblockedCount++;
            }
        } else {
            const reason = response.ban.reason;
            const date = response.ban.bandate;
            const admin = response.ban.admin;
            const nickname = response.ban.nickname;

            if (!nicknameCell.textContent.includes('❌')) {
                nicknameCell.textContent += ` -> ❌ | ${reason} || ${date}`;
                blockedCount++;
            }
        }
        updateBlockedCount();

        if (!nicknameCell.textContent.includes('✅') && !nicknameCell.textContent.includes('❌')) {
            requestQueue.push({ id, server, nicknameCell });
            processRequestQueue();
        }
    }

    function processRow(rowElement) {
        const nicknameCell = rowElement.querySelector('p.mb-0');
        const infoCell = rowElement.querySelector('small');
        if (!nicknameCell || !infoCell) return;

        const nickname = nicknameCell.textContent.trim();
        const infoMatch = infoCell.textContent.match(/Сервер: (\d+).*ID: (\d+)/);
        if (!infoMatch) return;

        const server = infoMatch[1];
        const id = infoMatch[2];

        if (processedIds.has(id)) return;
        processedIds.add(id);

        requestQueue.push({ id, server, nicknameCell });
        processRequestQueue();
    }

    function processNewRow(rowElement) {
        const nicknameCell = rowElement.querySelector('td[data-v-3996b970][data-v-409bd455]');
        const idCell = rowElement.querySelectorAll('td[data-v-3996b970][data-v-409bd455]')[1];
        const serverCell = rowElement.querySelectorAll('td[data-v-3996b970][data-v-409bd455]')[2];

        if (!nicknameCell || !idCell || !serverCell) return;

        const nickname = nicknameCell.textContent.trim();
        const id = idCell.textContent.trim();
        const server = serverCell.textContent.trim();

        if (processedIds.has(id)) return;
        processedIds.add(id);

        requestQueue.push({ id, server, nicknameCell });
        processRequestQueue();
    }

    function observeTableRows() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches('tr[data-v-409bd455]')) {
                        processRow(node);
                        processNewRow(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function updateTable() {
        const playerCell = document.querySelector('td[data-v-81416ece][data-v-409bd455].text-right');
        if (!playerCell) {
            return false;
        }

        const tableWrappers = document.querySelectorAll('.v-data-table.text-no-wrap.mx-auto.mt-10.theme--dark');
        if (tableWrappers.length > 0) {
            tableWrappers.forEach(tableWrapper => {
                const rows = tableWrapper.querySelectorAll('table tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach(cell => {
                    });
                });
            });
        }

        const rows = document.querySelectorAll('table tr');

        let lastIp = null;
        let regIp = null;
        let tradeacceptIp = null;
        let lastIpCell = null;
        let regIpCell = null;
        let tradeacceptIpCell = null;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                if (cell.textContent.includes('Last IP')) {
                    lastIpCell = cell;
                    const match = cell.nextElementSibling.textContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
                    if (match) {
                        lastIp = match[0];
                    }
                }
                if (cell.textContent.includes('Reg IP')) {
                    regIpCell = cell;
                    const match = cell.nextElementSibling.textContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
                    if (match) {
                        regIp = match[0];
                    }
                }
                if (cell.textContent.includes('Tradeaccept IP')) {
                    tradeacceptIpCell = cell;
                    const match = cell.nextElementSibling.textContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
                    if (match) {
                        tradeacceptIp = match[0];
                    }
                }
            });
        });

        const addIpEventListeners = (ipCell, ip) => {
            const ipSpan = document.createElement('span');
            ipSpan.textContent = ip;
            ipSpan.style.cursor = 'pointer';
            ipSpan.style.color = '#2196f3';
            ipCell.innerHTML = '';
            ipCell.appendChild(ipSpan);

            ipSpan.addEventListener('click', (event) => {
                if (event.target.tagName === 'SPAN') {
                    window.open(`https://ip-api.com/#${ip}`, '_blank');
                }
            });
        };

        if (lastIpCell && lastIpCell.nextElementSibling) {
            addIpEventListeners(lastIpCell.nextElementSibling, lastIp);
        }
        if (regIpCell && regIpCell.nextElementSibling) {
            addIpEventListeners(regIpCell.nextElementSibling, regIp);
        }
        if (tradeacceptIpCell && tradeacceptIpCell.nextElementSibling) {
            addIpEventListeners(tradeacceptIpCell.nextElementSibling, tradeacceptIp);
        }

        return true;
    }

    function checkPageLoad() {
        const intervalId = setInterval(async () => {
            if (await updateTable()) {
                clearInterval(intervalId);
                startMutationObserver();
            }
        }, 1000);
    }

    function startMutationObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const playerCell = document.querySelector('td[data-v-81416ece][data-v-409bd455].text-right');
                    if (!playerCell) {
                        observer.disconnect();
                        checkPageLoad();
                        break;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function updateDataOnPage() {
        const cities = [
            "Phoenix", "Tucson", "Scottdale", "Chandler", "Brainburg", "Saint-Rose",
            "Mesa", "Red-Rock", "Yuma", "Surprise", "Prescott", "Glendale",
            "Kingman", "Winslow", "Payson", "Gilbert", "Show-Low", "Casa-Grande",
            "Page", "Sun-City", "Queen-Creek", "Sedona", "Holiday", "Wednesday", "Yava",
            "Faraway", "Bumble Bee", "Christmas", "Mirage", "Love", "Drake"
        ];

        const updateElements = () => {
            const elements = document.querySelectorAll('.v-list-item__title');
            elements.forEach((element) => {
                const text = element.textContent.trim();
                if (text.startsWith('Mobile ')) {
                    const mobileNumber = parseInt(text.split(' ')[1], 10);
                    if (!isNaN(mobileNumber)) {
                        element.textContent = `[${100 + mobileNumber}] ${text}`;
                    }
                } else {
                    const cityIndex = cities.indexOf(text);
                    if (cityIndex !== -1) {
                        element.textContent = `[${cityIndex + 1}] ${text}`;
                    }
                }
            });
        };

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    updateElements();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        updateElements();
    }

    function updateIdsInTables() {
        const tableWrappers = document.querySelectorAll('.v-data-table__wrapper');

        tableWrappers.forEach(tableWrapper => {
            const headers = tableWrapper.querySelectorAll('th');
            let hasTenantsColumn = false;
            let hasTypeColumn = false;

            headers.forEach(header => {
                if (header.querySelector('span[data-v-409bd455]').textContent.trim() === 'ЖИЛЬЦЫ') {
                    hasTenantsColumn = true;
                }
                if (header.querySelector('span[data-v-409bd455]').textContent.trim() === 'ТИП') {
                    hasTypeColumn = true;
                }
            });

            if (hasTenantsColumn || hasTypeColumn) {
                const rows = tableWrapper.querySelectorAll('table tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        const idCell = cells[0];
                        const id = parseInt(idCell.textContent.trim(), 10);
                        if (!isNaN(id) && id < 2000) {
                            idCell.textContent = (id - 1).toString();
                        } else {

                        }
                    }
                });
            }
        });
    }

    function searchAndUpdateIds() {
        const intervalId = setInterval(() => {
            const playerCell = document.querySelector('td[data-v-81416ece][data-v-409bd455].text-right');
            if (playerCell) {
                clearInterval(intervalId);
                updateIdsInTables();
                startMutationObserverForPlayerCell();
            }
        }, 0);
    }

    function startMutationObserverForPlayerCell() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const playerCell = document.querySelector('td[data-v-81416ece][data-v-409bd455].text-right');
                    if (!playerCell) {
                        observer.disconnect();
                        searchAndUpdateIds();
                        break;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function insertFixText() {
        const spacerElement = document.querySelector('div[data-v-409bd455].spacer');
        if (spacerElement) {
            spacerElement.textContent = 'addition by [02] Mikki Tyler';
            spacerElement.style.display = 'flex';
            spacerElement.style.justifyContent = 'center';
            spacerElement.style.alignItems = 'center';
            spacerElement.style.height = '100%';
            spacerElement.style.textAlign = 'center';
        }
    }

    function startMutationObserverForSpacer() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    insertFixText();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function updateBlockedCount() {
        const blockedCountElement = document.querySelector('div[data-v-409bd455].v-card__text.d-flex.align-center.flex-wrap.pb-0');
        if (blockedCountElement) {
            const countElement = blockedCountElement.querySelector('div[data-blocked-count]');
            if (countElement) {
                countElement.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <span style="color: red; font-weight: bold;">Заблокировано: ${blockedCount}</span>
                        <span style="color: green; font-weight: bold; margin-left: 10px;">Не заблокировано: ${unblockedCount}</span>
                    </div>
                `;
            } else {
                blockedCountElement.insertAdjacentHTML('beforeend', `
                    <div data-blocked-count style="margin-left: 20px; display: flex; justify-content: center; align-items: center;">
                        <span style="color: red; font-weight: bold;">Заблокировано: ${blockedCount}</span>
                        <span style="color: green; font-weight: bold; margin-left: 10px;">Не заблокировано: ${unblockedCount}</span>
                    </div>
                `);
            }
        }
    }

    function resetBlockedCount() {
        blockedCount = 0;
        unblockedCount = 0;
        updateBlockedCount();
    }

    window.addEventListener('load', () => {
        updateDataOnPage();
        checkPageLoad();
        searchAndUpdateIds();
        startMutationObserverForSpacer();
        observeTableRows();
        updateBlockedCount();

        const searchButton = document.querySelector('button[data-v-409bd455][data-v-3996b970]');
        if (searchButton) {
            searchButton.addEventListener('click', resetBlockedCount);
        }
    });
})();