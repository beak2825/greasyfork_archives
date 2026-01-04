// ==UserScript==
// @name         GP2-Revived
// @namespace    https://2.gangsterparadise.co.uk
// @version      1.4
// @description  Updated Styling for https://2.gangsterparadise.co.uk with enhanced functionality and performance.
// @author       null
// @match        https://2.gangsterparadise.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gangsterparadise.co.uk
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544539/GP2-Revived.user.js
// @updateURL https://update.greasyfork.org/scripts/544539/GP2-Revived.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("loggedin") && !window.location.href.includes("3.php")) {
        window.location.href += "3.php";
    }

    const settingsManager = {
        defaults: {
            useCustomBackground: true,
            backgroundUrl: 'https://i.imgur.com/rxzPC7E.jpeg',
            defaultShipToLocation: '1',
            defaultGta: '0'
        },
        load: function() {
            const saved = localStorage.getItem('GP2_Theme_Settings');
            return saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
        },
        save: function(settings) {
            localStorage.setItem('GP2_Theme_Settings', JSON.stringify(settings));
        }
    };

    const settings = settingsManager.load();

    const gameData = {
        countries: {'1': 'London', '2': 'New York', '3': 'Rotterdam', '4': 'Tokyo', '5': 'Havana', '6': 'Cape Town', '7': 'Moscow', '8': 'Sydney', '9': 'Las Vegas', '10': 'Madrid'},
        gtas: {'0': '(CAR FACTORY) - Super Cars', '1': '(CAR DEALER) - Convertibles, Coupes and GTs', '2': '(GARAGE) - MPVs and Sport Saloons', '3': '(STREET) - Sports Cars and Small Coupes', '4': '(PARKING LOT) - Hot Hatches'}
    };

    const createOptionsHTML = (options, selectedValue) => {
        return Object.entries(options)
            .map(([value, name]) => `<option value="${value}" ${selectedValue === value ? 'selected' : ''}>${name}</option>`)
            .join('');
    };

    function createSettingsModal(title, contentHTML) {
        closeSettingsModal();

        const overlay = document.createElement('div');
        overlay.id = 'gp2SettingsModalOverlay';
        overlay.onclick = closeSettingsModal;

        const modal = document.createElement('div');
        modal.id = 'gp2SettingsModal';
        modal.innerHTML = `
            <div id="gp2SettingsModalHeader">
                <span id="gp2SettingsModalTitle">${title}</span>
                <span id="gp2SettingsModalClose" title="Close">&times;</span>
            </div>
            <div id="gp2SettingsModalContent">${contentHTML}</div>`;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        document.getElementById('gp2SettingsModalClose').onclick = closeSettingsModal;
    }

    function closeSettingsModal() {
        document.getElementById('gp2SettingsModalOverlay')?.remove();
        document.getElementById('gp2SettingsModal')?.remove();
    }

    function saveAndApplySettings() {
        try {
            const newSettings = {
                useCustomBackground: document.getElementById('setting_useCustomBackground').checked,
                backgroundUrl: document.getElementById('setting_backgroundUrl').value,
                defaultShipToLocation: document.getElementById('setting_defaultShipToLocation').value,
                defaultGta: document.getElementById('setting_defaultGta').value
            };
            settingsManager.save(newSettings);
            document.getElementById('save_confirm').innerText = "Saved!";

            setTimeout(() => {
                closeSettingsModal();
                alert("Saving and refreshing page to apply new settings!");
                location.reload();

            }, 500);
        } catch (e) {
            console.error("GP2-Revived: Error saving settings:", e);
        }
    }

    function openSettingsModal() {
        const currentSettings = settingsManager.load();
        const settingsHTML = `
            <div id="opts" style="font-family: Arial, sans-serif;">
                <div style="margin-bottom: 15px;">
                    <label><input type="checkbox" id="setting_useCustomBackground" ${currentSettings.useCustomBackground ? 'checked' : ''}> Enable Custom Background</label>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="setting_backgroundUrl">Background Image URL:</label><br>
                    <input type="text" id="setting_backgroundUrl" value="${currentSettings.backgroundUrl}" style="width: 98%; margin-top: 5px; background-color: #333; border: 1px solid #555; color: #eee; padding: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="setting_defaultShipToLocation">Default 'Send All' Location:</label><br>
                    <select id="setting_defaultShipToLocation" style="width: 100%; margin-top: 5px; background-color: #333; border: 1px solid #555; color: #eee; padding: 5px;">${createOptionsHTML(gameData.countries, currentSettings.defaultShipToLocation)}</select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="setting_defaultGta">Default GTA:</label><br>
                    <select id="setting_defaultGta" style="width: 100%; margin-top: 5px; background-color: #333; border: 1px solid #555; color: #eee; padding: 5px;">${createOptionsHTML(gameData.gtas, currentSettings.defaultGta)}</select>
                </div>
                <hr style="border-color: #444;">
                <button id="saveSettingsBtn" class="formbutton" style="background-color: #4CAF50;">Save and Close</button>
                <span id="save_confirm" style="margin-left: 10px; color: green; font-weight: bold;"></span>
            </div>`;

        createSettingsModal('GP2-Revived Theme Settings', settingsHTML);
        document.getElementById('saveSettingsBtn').addEventListener('click', saveAndApplySettings);
    }

    const customStyles = `
    ::-webkit-scrollbar { width: 12px; } ::-webkit-scrollbar-track { background: #2c2c2c; } ::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
    body { scrollbar-color: #555 #2c2c2c; } #crime_form img { border-radius: 7px; } .one, .ones, .mDiv, .refresh { filter: grayscale(1); }
    .ones .two { background-image: none; } #two { margin-top: 10% !important; } #world > img { background: linear-gradient(to bottom, #004466, #002233); border-radius: 10px; }
    #newClock { font-family: Arial Black, Helvetica, sans-serif; font-size: 18px; color: #666666; } #pgeDwn { color: lightblue; } #gpbar { border: 1px solid #454545; }
    #mainNavigation { background-color: black; } #refreshBtn { margin-left: 0 !important; }
    #gp2RSettings { color: red !important; }
    #updateWarning { box-shadow: inset 0 0 10px rgba(0,0,0,0.4); color: white; background: repeating-linear-gradient(45deg, #e74c3c, #e74c3c 15px, #c0392b 15px, #c0392b 30px); }
    #stats { background-image: none !important; background-color: rgba(0,0,0,0.75); height: auto; color: #fff; border-radius: 0 0 10px 10px; border: 1px solid #454545; border-top: none; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
    #dhtmltooltip > #stats { background-color: rgba(0, 0, 0, 0); border: none; !important; box-shadow: none !important; }
    #mainFrame { min-width: 56%; height: 85%; background-color: rgba(0,0,0,0.75); border-radius: 10px; border: 1px solid #454545; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
    #readyBar { font-size: 1.3em; width: 100%; background-color: rgba(0,0,0,0.75); color: #fff; margin-left: 2em; padding: 2px 20px; box-sizing: border-box; border-radius: 0 0 10px 10px; border: 1px solid #454545; border-top: none; display: flex; justify-content: space-around; align-items: center; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
    #readyBar > span { margin: 0 15px; white-space: nowrap; font-weight: bold; cursor: pointer; }
    .formbutton { color:#fff; background:#8D8D8D; transition:all 150ms; font-size:12px; padding:0 15px; } .formbutton:hover { box-shadow:rgba(0,1,0,.2) 0 2px 8px; opacity:.85; }
    .car { display: inline-block; margin-right: 10px; } #carsTable { margin: 0 auto; } #chopList { width: 100%; max-width: 620px; background-color: #000; margin: 20px 0 0 10px; }
    iframe body { color: #ccc !important; font-family: Arial, sans-serif !important; } iframe table { background-color: #1a1a1a !important; } iframe a { color: #99CCFF !important; }
    iframe input[type="text"], iframe textarea { background-color: #333 !important; border: 1px solid #555 !important; color: #eee !important; }
    iframe .tdh { background-image: linear-gradient(to bottom, #333, #111) !important; color: #fff !important; }
    #rrRdy { color: white; animation: rrBlink 1s linear infinite; } @keyframes rrBlink { 50% { opacity: 0; } }
    #gp2SettingsModalOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9998; }
    #gp2SettingsModal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; max-width: 90%; background: #2c2c2c; border: 1px solid #454545; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 9999; color: #eee; }
    #gp2SettingsModalHeader { padding: 10px 15px; background: #333; border-bottom: 1px solid #454545; border-radius: 10px 10px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; }
    #gp2SettingsModalTitle { font-size: 1.2em; font-weight: bold; }
    #gp2SettingsModalClose { font-size: 1.5em; font-weight: bold; cursor: pointer; color: #ccc; } #gp2SettingsModalClose:hover { color: white; }
    #gp2SettingsModalContent { padding: 20px; max-height: 70vh; overflow-y: auto; }`;

    function injectStyles(targetDoc) {
        if (!targetDoc.getElementById('gp2_custom_theme_styles')) {
            const style = targetDoc.createElement('style');
            style.id = 'gp2_custom_theme_styles';
            style.textContent = customStyles;
            targetDoc.head.appendChild(style);
        }
    }

    const countdownIntervals = {};

    async function fetchAndParseHtml(url) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) return null;
            const text = await response.text();
            return new DOMParser().parseFromString(text, "text/html");
        } catch (error) {
            console.error(`Fetch error for ${url}:`, error);
            return null;
        }
    }

    function parseTimeToSeconds(timeString) {
        if (!timeString) return 0;
        let totalSeconds = 0;
        const cleanString = timeString.toLowerCase();
        const hourMatch = cleanString.match(/(\d+)\s*(h|hour)/);
        if (hourMatch) totalSeconds += parseInt(hourMatch[1], 10) * 3600;
        const minMatch = cleanString.match(/(\d+)\s*(m|minute)/);
        if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60;
        const secMatch = cleanString.match(/(\d+)\s*(s|second)/);
        if (secMatch) totalSeconds += parseInt(secMatch[1], 10);
        return totalSeconds;
    }

    function startCountdown(element, seconds, readyText, destUrl) {
        if (countdownIntervals[element.id]) clearInterval(countdownIntervals[element.id]);
        let timeLeft = seconds;
        const update = () => {
            if (timeLeft <= 0) {
                clearInterval(countdownIntervals[element.id]);
                delete countdownIntervals[element.id];
                element.style.color = "green";
                element.innerText = readyText;
                element.onclick = () => { document.getElementById("mainFrame").src = destUrl; };
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const secs = timeLeft % 60;
                element.innerText = `${readyText.replace(/ Ready| Available/, '')} in: ${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                timeLeft--;
            }
        };
        element.style.color = "red";
        element.onclick = null;
        update();
        countdownIntervals[element.id] = setInterval(update, 1000);
    }

    async function applyDomManipulations(targetDoc) {
        const pagePath = targetDoc.location.pathname;

        if (pagePath.includes("garage.php")) {
            const garageForm = targetDoc.getElementById("garage_form");
            if (garageForm) {
                const timeHeader = Array.from(garageForm.querySelectorAll('div.ones')).find(h => h.textContent.trim() === 'Time Stolen');
                if (timeHeader) timeHeader.textContent = 'Days Left';
                const carRows = Array.from(garageForm.querySelectorAll('tr')).filter(tr => tr.querySelector('input[name="select[]"]'));
                const today = new Date();
                carRows.forEach(row => {
                    const timestampEl = row.querySelector('td:nth-child(2) i');
                    if (timestampEl) {
                        const stolenDate = new Date(timestampEl.textContent.trim());
                        const expiryDate = new Date(stolenDate);
                        expiryDate.setDate(stolenDate.getDate() + 30);
                        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 3600 * 24));
                        const displayCell = row.querySelector('td:nth-child(2) div');
                        displayCell.innerHTML = `${daysLeft} days`;
                        row.dataset.daysLeft = daysLeft;
                        if (daysLeft <= 3) displayCell.style.cssText = 'color: red; font-weight: bold;';
                        else if (daysLeft <= 7) displayCell.style.color = 'orange';
                    }
                });
                carRows.sort((a, b) => (a.dataset.daysLeft || 99) - (b.dataset.daysLeft || 99));
                const fragment = targetDoc.createDocumentFragment();
                carRows.forEach(row => fragment.appendChild(row));
                garageForm.querySelector('a[href="gta.php"]')?.closest('tr').after(fragment);
                const tableBody = garageForm.querySelector('table > tbody');
                if (tableBody) {
                    const carRowsForPagination = Array.from(tableBody.querySelectorAll('tr')).filter(tr => tr.querySelector('input[name="select[]"]'));
                    const itemsPerPage = 12;
                    const numPages = Math.ceil(carRowsForPagination.length / itemsPerPage);
                    if (numPages > 1) {
                        let currentPage = 1;
                        const paginationContainer = targetDoc.createElement('div');
                        paginationContainer.id = 'pagination_controls';
                        paginationContainer.style.textAlign = 'center';
                        paginationContainer.style.padding = '10px 0';
                        const updatePaginationUI = () => {
                            paginationContainer.innerHTML = '';
                            const prevButton = targetDoc.createElement('input');
                            prevButton.type = 'button';
                            prevButton.value = '« Previous';
                            prevButton.className = 'formbutton';
                            prevButton.disabled = currentPage === 1;
                            prevButton.onclick = () => showPage(currentPage - 1);
                            paginationContainer.appendChild(prevButton);
                            const pageInfo = targetDoc.createElement('span');
                            pageInfo.innerText = ` Page ${currentPage} of ${numPages} `;
                            pageInfo.style.margin = '0 15px';
                            pageInfo.style.color = 'white';
                            pageInfo.style.fontWeight = 'bold';
                            paginationContainer.appendChild(pageInfo);
                            const nextButton = targetDoc.createElement('input');
                            nextButton.type = 'button';
                            nextButton.value = 'Next »';
                            nextButton.className = 'formbutton';
                            nextButton.disabled = currentPage === numPages;
                            nextButton.onclick = () => showPage(currentPage + 1);
                            paginationContainer.appendChild(nextButton);
                        };
                        const showPage = (page) => {
                            currentPage = page;
                            carRowsForPagination.forEach((row, index) => {
                                const isVisible = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage);
                                row.style.display = isVisible ? '' : 'none';
                            });
                            updatePaginationUI();
                        };
                        if (!targetDoc.getElementById('pagination_controls')) {
                            const buttonRow = targetDoc.querySelector('#Repair')?.closest('tr');
                            if (buttonRow) {
                                const paginationRow = targetDoc.createElement('tr');
                                const paginationCell = targetDoc.createElement('td');
                                paginationCell.colSpan = 6;
                                paginationCell.appendChild(paginationContainer);
                                paginationRow.appendChild(paginationCell);
                                buttonRow.parentNode.insertBefore(paginationRow, buttonRow);
                            }
                        }
                        showPage(1);
                    }
                }
                const buttonContainer = targetDoc.getElementById('Repair').parentNode;
                if (!targetDoc.getElementById('sendAllToLocationBtn')) {
                    const sendAllButton = targetDoc.createElement('input');
                    sendAllButton.type = 'button';
                    const locationName = gameData.countries[settings.defaultShipToLocation] || 'N/A';
                    sendAllButton.value = `Send all to ${locationName}`;
                    sendAllButton.className = 'formbutton';
                    sendAllButton.id = 'sendAllToLocationBtn';
                    sendAllButton.style = "margin-left: 1em;";
                    sendAllButton.onclick = () => {
                        garageForm.querySelectorAll('input[name="select[]"]').forEach(cb => cb.checked = true);
                        targetDoc.getElementById('shipto').value = settings.defaultShipToLocation;
                        targetDoc.getElementById('Send').click();
                    };
                    buttonContainer.appendChild(sendAllButton);
                }
            }
        }

        if (pagePath.includes("gta.php")) {
            const defaultGtaIndex = parseInt(settings.defaultGta, 10);
            const gtaRadios = targetDoc.getElementsByName('choose');
            if (gtaRadios[defaultGtaIndex]) gtaRadios[defaultGtaIndex].checked = true;
            (async () => {
                let chopList = targetDoc.getElementById("chopList");
                if (!chopList) {
                    const referenceNode = targetDoc.querySelector("#gta_form");
                    if (!referenceNode) return;
                    chopList = targetDoc.createElement("div");
                    chopList.id = "chopList";
                    chopList.innerHTML = `<div class="one"> <div class="two">Cars needed for chopshop</div></div>`;
                    referenceNode.after(chopList);
                }
                const getChopTable = async () => {
                    const remoteDoc = await fetchAndParseHtml("../chop.php");
                    if (!remoteDoc) return null;
                    const table = remoteDoc.querySelector("#carsTable");
                    return table ? table.cloneNode(true) : null;
                };
                const newChopTable = await getChopTable();
                if (newChopTable) {
                    newChopTable.querySelector("tbody > tr:first-child > td > div")?.remove();
                    const oldChopTable = chopList.querySelector("#carsTable");
                    if (oldChopTable) oldChopTable.replaceWith(newChopTable);
                    else chopList.appendChild(newChopTable);
                }
            })();
        }

        if (pagePath.includes("crime.php")) {
            const crimeRadios = targetDoc.getElementsByName('choose');
            if (crimeRadios[0]) crimeRadios[0].checked = true;
        }
    }

    function createStatusUpdater(config) {
        const { elementId, fetchUrl, readyText, destinationUrl, textSelector, jailSelector } = config;

        return async function updateStatus() {
            const element = document.getElementById(elementId);
            if (!element || countdownIntervals[element.id]) return;

            const doc = await fetchAndParseHtml(fetchUrl);
            if (!doc) {
                element.innerText = "Error";
                element.style.color = "orange";
                return;
            }

            if (doc.querySelector(jailSelector)) {
                element.innerText = "In Jail";
                element.style.color = "red";
                element.onclick = null;
                return;
            }

            const timeInfoEl = doc.querySelector(textSelector);
            if (!timeInfoEl) return;

            const text = timeInfoEl.innerText;
            const isWaiting = text.includes("You must wait") || text.includes("Come back in") || text.includes("purchase another scratchcard in");

            if (isWaiting) {
                const timeNode = timeInfoEl.querySelector("b") || timeInfoEl;
                const seconds = parseTimeToSeconds(timeNode.innerText);
                if (seconds > 0) {
                    startCountdown(element, seconds, readyText, destinationUrl);
                } else {
                    element.style.color = "green";
                    element.innerText = readyText;
                    element.onclick = () => { document.getElementById("mainFrame").src = destinationUrl; };
                }
            } else {
                element.style.color = "green";
                element.innerText = readyText;
                element.onclick = () => { document.getElementById("mainFrame").src = destinationUrl; };
            }
        };
    }

    function initializeTheme() {
        injectStyles(document);
        document.querySelector("#one")?.remove();

        const gpbar = document.getElementById("gpbar");
        if(gpbar) {
            if (settings.useCustomBackground && settings.backgroundUrl) {
                if (!document.getElementById('winter')) {
                    const bgDiv = document.createElement('div');
                    bgDiv.id = 'winter';
                    bgDiv.style.cssText = `background: url("${settings.backgroundUrl}") no-repeat center center fixed; background-size: cover; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;`;
                    document.body.prepend(bgDiv);
                }
            }

            document.getElementById("clock")?.remove();

            if (!document.getElementById("readyBar")) {
                const readyBar = document.createElement("div");
                readyBar.id = "readyBar";
                document.getElementById("iframe")?.prepend(readyBar);

                readyBar.innerHTML = `
                    <span id="newClock"></span>
                    <span id="scratchRdy">Loading...</span>
                    <span id="travelRdy">Loading...</span>
                    <span id="crimeRdy">Loading...</span>
                    <span id="gtaRdy">Loading...</span>
                    <span id="rrRdy"></span>
                    <span id="butcherRdy">Loading...</span>
                    <span id="refreshBtn" title="Refresh all timers">↻</span>`;
                document.getElementById("refreshBtn").onclick = refreshAllStatuses;
            }

            if (!document.getElementById("gp2RSettings")) {
                const h1 = document.createElement("h1");
                h1.style.cssText = "cursor: pointer; border-top: 1px solid #666; margin-top: 10px; padding-top: 5px;";
                const link = document.createElement("a");
                link.id = "gp2RSettings";
                link.innerText = "GP2-R Settings";
                link.href = "#";
                link.onclick = (e) => { e.preventDefault(); openSettingsModal(); };
                h1.appendChild(link);
                document.querySelector("#options > br:nth-child(8)")?.before(h1);
            }

            const updaters = {
                scratch: createStatusUpdater({ elementId: 'scratchRdy', fetchUrl: '../scratchcard.php', readyText: 'Scratchcard Available', destinationUrl: '../scratchcard.php', textSelector: '#kiosk', jailSelector: '#jail_form' }),
                travel: createStatusUpdater({ elementId: 'travelRdy', fetchUrl: '../travel.php', readyText: 'Travel Ready', destinationUrl: '../travel.php', textSelector: '.pad5', jailSelector: '#jail_form' }),
                crime: createStatusUpdater({ elementId: 'crimeRdy', fetchUrl: '../crime.php', readyText: 'Crime Ready', destinationUrl: '../crime.php', textSelector: '#crime_form tr:nth-child(2) > td', jailSelector: '#jail_form' }),
                gta: createStatusUpdater({ elementId: 'gtaRdy', fetchUrl: '../gta.php', readyText: 'GTA Ready', destinationUrl: '../gta.php', textSelector: '#gta_form tr:nth-child(2) > td > div', jailSelector: '#jail_form' })
            };

            function refreshAllStatuses() {
                Object.values(updaters).forEach(update => update());
                updateButcherStatus();
                updateRussianRouletteStatus();
            }

            refreshAllStatuses();

            setInterval(updaters.crime, 30000);
            setInterval(updaters.gta, 30000);
            setInterval(updaters.scratch, 60000);
            setInterval(updaters.travel, 60000);
            setInterval(updateButcherStatus, 60000);
            setInterval(updateRussianRouletteStatus, 10000);
            setInterval(updateClock, 1000);
        }
    }

    async function updateRussianRouletteStatus() {
        const element = document.getElementById("rrRdy");
        if (!element) return;

        element.onclick = () => { document.getElementById("mainFrame").src = "../russian_roulette.php"; element.style.display = "none"; };

        try {
            const response = await fetch('../russian_roulette.php?status=1', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const status = await response.text();

            if (status.trim() === 'wait') {
                element.style.display = "none";
            } else if (status.trim() === 'turn') {
                element.style.display = "block";
                element.style.color = "white";
                element.innerText = "RR: Its your shot 🔫";
            } else {
                element.style.display = "none";
            }
        } catch (error) {
            console.error("GP2-Revived: Error checking Russian Roulette status:", error);
            element.style.color = "orange";
            element.innerText = "RR Status Error";
        }
    }

    async function updateButcherStatus() {
        const element = document.getElementById("butcherRdy");
        if (!element) return;
        element.onclick = () => { document.getElementById("mainFrame").src = "../butcher.php"; };

        const doc = await fetchAndParseHtml('../butcher.php');
        if (doc) {
            if(doc.body.innerText.includes("You're not a butcher!")) {
                element.remove();
            } else {
                const info = doc.querySelector("#table tr:nth-child(4) > td:nth-child(2)");
                if (info) {
                    const isSearching = !info.innerText.includes("Nothing");
                    element.style.color = isSearching ? "red" : "#99CCFF";
                    element.innerText = isSearching ? `Butcher: ${info.querySelector('a')?.innerText} is searching` : "Butcher: Clear";
                }
            }
        }
    }

    function updateClock() {
        const clockEl = document.getElementById('newClock');
        if (clockEl) clockEl.innerText = new Date().toLocaleTimeString('en-GB');
    }

    function onReady() {
        initializeTheme();

        const mainFrame = document.getElementById('mainFrame');
        if (mainFrame) {
            const handleIframeLoad = () => {
                try {
                    const frameDoc = mainFrame.contentDocument;
                    if (frameDoc) {
                        injectStyles(frameDoc);
                        applyDomManipulations(frameDoc);
                    }
                } catch (e) { }
            };
            mainFrame.addEventListener('load', handleIframeLoad);
            handleIframeLoad();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

})();