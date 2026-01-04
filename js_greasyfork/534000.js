// ==UserScript==
// @name         MZ - Unlucky
// @namespace    douglaskampl
// @version      2.767
// @description  Finds unlucky teams
// @author       Douglas
// @match        https://www.managerzone.com/?p=league&type*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534000/MZ%20-%20Unlucky.user.js
// @updateURL https://update.greasyfork.org/scripts/534000/MZ%20-%20Unlucky.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'); @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap'); @keyframes textGlitch { 0% { transform: translate(0); text-shadow: 0 0 8px rgba(255, 106, 193, 0.8); } 25% { text-shadow: -1px 1px 8px rgba(22, 242, 242, 0.8), 1px -1px 8px rgba(255, 106, 193, 0.8); } 50% { text-shadow: 1px -1px 8px rgba(22, 242, 242, 0.8), -1px 1px 8px rgba(255, 106, 193, 0.8); } 75% { text-shadow: -1px 0 8px rgba(22, 242, 242, 0.8), 1px 0 8px rgba(255, 106, 193, 0.8); } 100% { transform: translate(0); text-shadow: 0 0 8px rgba(255, 106, 193, 0.8); } } .pulse-dot { display: inline-block; width: 8px; height: 8px; background-color: #ff6ac1; border-radius: 50%; margin-right: 10px; animation: pulse 1.5s infinite ease-in-out; } @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } } @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } @keyframes glow { 0% { box-shadow: 0 0 5px rgba(255, 0, 255, 0.5); } 50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); } 100% { box-shadow: 0 0 5px rgba(255, 0, 255, 0.5); } } @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } #unluckyModal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; opacity: 0; animation: modalFadeIn 0.3s ease-out forwards; font-size: 16px; font-family: 'Inter', sans-serif; } #unluckyModalContent { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); background-size: 200% 200%; animation: gradientShift 15s ease infinite; padding: 25px; border-radius: 10px; width: 700px; max-width: 90vw; max-height: 85vh; overflow-y: auto; box-shadow: 0 0 30px rgba(138, 43, 226, 0.6); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); transform: translateY(20px); transition: transform 0.3s ease-out; box-sizing: border-box; } #unluckyModal:hover #unluckyModalContent { transform: translateY(0); } #unluckyModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 105, 180, 0.3); padding-bottom: 10px; } #unluckyModalTitle { font-size: 24px; font-weight: bold; color: #ff6ac1; text-shadow: 0 0 10px rgba(255, 105, 180, 0.7); font-family: 'Orbitron', sans-serif; letter-spacing: 2px; text-transform: uppercase; } #unluckyModalClose { cursor: pointer; font-size: 24px; color: #16f2f2; transition: all 0.2s; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; } #unluckyModalClose:hover { color: #ff6ac1; transform: rotate(90deg); background-color: rgba(255, 255, 255, 0.1); } .unluckyOption { margin: 15px 0; padding: 12px 20px; width: 100%; box-sizing: border-box; text-align: center; background: linear-gradient(to right, #614385, #516395); border: none; border-radius: 5px; cursor: pointer; color: white; font-weight: 500; font-size: 17px; transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); max-width: 100%; font-family: 'Inter', sans-serif; } .unluckyOption:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transition: 0.5s; } .unluckyOption:hover { transform: translateY(-3px); box-shadow: 0 7px 14px rgba(0, 0, 0, 0.4); animation: glow 1.5s infinite; } .unluckyOption:hover:before { left: 100%; } .unluckyOption:active { transform: translateY(1px); } #unluckyResults { margin-top: 20px; max-height: 550px; overflow-y: auto; padding: 15px; border: 1px solid rgba(85, 213, 219, 0.3); display: none; background-color: rgba(0, 0, 0, 0.3); border-radius: 5px; color: #f0f0f0; font-family: 'Inter', sans-serif; transition: all 0.3s ease; } #unluckyResults p { margin: 5px 0; line-height: 1.5; } #unluckyResults::-webkit-scrollbar { width: 8px; } #unluckyResults::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; } #unluckyResults::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #ff6ac1, #7a4feb); border-radius: 10px; } #leftmenu_unlucky a { transition: all 0.3s ease; display: inline-block; font-family: 'Inter', sans-serif; } #leftmenu_unlucky a:hover { color: #ff6ac1 !important; text-shadow: 0 0 5px rgba(255, 105, 180, 0.7); transform: translateX(3px); } .team-stats { margin-bottom: 12px; padding: 10px; border-radius: 4px; border-left: 3px solid #ff6ac1; background-color: rgba(255, 255, 255, 0.05); font-size: 15px; font-family: 'Inter', sans-serif; } .stat-card { margin-bottom: 15px; padding: 15px; border-radius: 8px; background-color: rgba(0, 0, 0, 0.3); box-shadow: 0 0 10px rgba(138, 43, 226, 0.3); font-family: 'Inter', sans-serif; } .stat-card-title { margin-bottom: 10px; padding-bottom: 8px; font-size: 19px; font-weight: bold; color: #16f2f2; border-bottom: 1px solid rgba(255, 106, 193, 0.5); } .stat-item { margin: 10px 0; padding: 10px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; background-color: rgba(255, 255, 255, 0.05); font-size: 15px; flex-wrap: wrap; } .stat-item:hover { background-color: rgba(255, 255, 255, 0.1); } .stat-value { font-weight: bold; color: #ff6ac1; margin-left: auto; padding-left: 10px; flex-shrink: 0; } .stat-rank { display: inline-block; width: 24px; height: 24px; margin-right: 10px; background: linear-gradient(to right, #614385, #516395); border-radius: 50%; text-align: center; line-height: 24px; font-size: 13px; } .back-button { margin-top: 15px; padding: 8px 15px; background: linear-gradient(to right, #516395, #614385); border: none; border-radius: 4px; color: white; cursor: pointer; transition: all 0.3s ease; font-size: 15px; font-family: 'Inter', sans-serif; } .back-button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); } .pagination { display: flex; justify-content: center; margin-top: 15px; } .pagination-button { padding: 6px 12px; margin: 0 5px; border: none; border-radius: 4px; background: linear-gradient(to right, #516395, #614385); color: white; cursor: pointer; transition: all 0.3s ease; font-family: 'Inter', sans-serif; } .pagination-button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); } .pagination-button.active { background: linear-gradient(to right, #ff6ac1, #ff6ac1); } .league-selector { padding: 10px; margin-bottom: 10px; background-color: rgba(0, 0, 0, 0.2); border-radius: 5px; } .league-selector-title { margin-bottom: 10px; color: #16f2f2; font-size: 17px; } .league-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; } .league-item { padding: 5px 8px; text-align: center; background-color: rgba(255, 255, 255, 0.1); border-radius: 4px; cursor: pointer; transition: all 0.2s; font-size: 15px; display: flex; align-items: center; justify-content: center; } .league-item:hover { background-color: rgba(255, 106, 193, 0.3); } .league-item.active { background-color: rgba(255, 106, 193, 0.5); } .tab-container { display: flex; margin-bottom: 15px; } .tab { padding: 10px 20px; background: rgba(255, 255, 255, 0.1); border: none; color: white; cursor: pointer; transition: all 0.3s ease; font-size: 16px; font-family: 'Inter', sans-serif; } .tab:first-child { border-radius: 5px 0 0 5px; } .tab:last-child { border-radius: 0 5px 5px 0; } .tab.active { background: linear-gradient(to right, #ff6ac1, #7a4feb); } .tab-content { display: none; } .tab-content.active { display: block; } .toggle-matches { cursor: pointer; color: #16f2f2; text-decoration: underline; margin-left: 5px; font-size: 0.95em; } .toggle-matches:hover { color: #ff6ac1; } .match-list { display: none; margin-top: 10px; padding: 8px; background-color: rgba(0, 0, 0, 0.2); border-radius: 5px; } .match-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 5px; border-radius: 3px; background-color: rgba(255, 255, 255, 0.05); transition: all 0.2s; font-size: 14px; } .match-item:hover { background-color: rgba(255, 255, 255, 0.1); } .match-link { color: #fff; text-decoration: none; flex-grow: 1; } .match-link:hover { color: #ff6ac1; } .match-result { font-weight: bold; margin-left: 10px; } .match-result.win { color: #2ecc71; } .match-result.draw { color: #f39c12; } .match-result.loss { color: #e74c3c; } .match-stats { font-size: 0.9em; color: #bbb; } .league-link { color: #16f2f2; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; } .league-link:hover { color: #ff6ac1; text-decoration: none; } .league-link:hover .league-label { background-color: rgba(255, 106, 193, 0.4); border-color: rgba(255, 106, 193, 0.7); } .loading-stage { margin-left: 10px; color: #ff6ac1; font-style: italic; font-size: 0.9em; } .loading-progress { margin-left: 10px; color: #16f2f2; } .league-range-input { display: flex; margin: 15px 0; gap: 10px; align-items: center; } .league-range-input input { flex: 1; padding: 8px; border-radius: 4px; border: none; background-color: rgba(255, 255, 255, 0.1); color: white; outline: none; } .league-input { width: 100%; padding: 10px; border-radius: 4px; margin-bottom: 15px; border: none; background-color: rgba(255, 255, 255, 0.1); color: white; outline: none; font-family: 'Inter', sans-serif; } .league-entry-container { margin-bottom: 20px; } .league-entry-form { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; } .league-entry-form input, .league-entry-form select { flex: 1; padding: 8px 12px; border: none; border-radius: 4px; background-color: rgba(255, 255, 255, 0.1); color: #FF4B33; font-weight: bold; outline: none; } .league-entry-form select { cursor: pointer; } .league-entry-form .add-button { width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; background: linear-gradient(to right, #614385, #516395); border: none; border-radius: 50%; color: white; font-size: 20px; cursor: pointer; transition: all 0.3s ease; flex-shrink: 0; } .league-entry-form .add-button:hover { transform: scale(1.1); box-shadow: 0 0 10px rgba(138, 43, 226, 0.5); } .league-list { max-height: 200px; overflow-y: auto; padding: 10px; background-color: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-bottom: 15px; } .league-list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; background-color: rgba(255, 255, 255, 0.05); border-radius: 4px; } .league-list-item:last-child { margin-bottom: 0; } .league-list-item .remove-button { background: none; border: none; color: #ff6ac1; cursor: pointer; font-size: 16px; transition: all 0.2s; } .league-list-item .remove-button:hover { transform: scale(1.2); } .league-label { background-color: rgba(22, 242, 242, 0.15); border: 1px solid rgba(22, 242, 242, 0.4); color: #e0e0e0; padding: 2px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 500; margin-left: 6px; white-space: nowrap; transition: all 0.2s; display: inline-block; }`);

    const LEAGUE_TYPES = [
        { value: "senior", label: "Senior" },
        { value: "u23", label: "U23" },
        { value: "u23_world", label: "U23 World" },
        { value: "u21", label: "U21" },
        { value: "u21_world", label: "U21 World" },
        { value: "u18", label: "U18" },
        { value: "u18_world", label: "U18 World" }
    ];

    const REGIONAL_LEAGUE_NAMES = {
        727: "Americas", 1: "Argentina", 122: "Brazil", 848: "Central Europe",
        969: "Iberia", 1090: "Mediterranean", 1211: "Northern Europe",
        243: "Poland", 364: "Romania", 485: "Sweden", 606: "Turkey",
        1332: "World"
    };

    const CURRENCIES = {
        "R$": 2.62589,    EUR: 9.1775,      USD: 7.4234,      "点": 1,
        SEK: 1,           NOK: 1.07245,     DKK: 1.23522,     GBP: 13.35247,
        CHF: 5.86737,     RUB: 0.26313,     CAD: 5.70899,     AUD: 5.66999,
        MZ: 1,            MM: 1,            PLN: 1.95278,     ILS: 1.6953,
        INR: 0.17,        THB: 0.17079,     ZAR: 1.23733,     SKK: 0.24946,
        BGN: 4.70738,     MXN: 0.68576,     ARS: 2.64445,     BOB: 0.939,
        UYU: 0.256963,    PYG: 0.001309,    ISK: 0.10433,     SIT: 0.03896,
        JPY: 0.06,
    };

    const BATCH_SIZE = 5;
    const MAX_GK_LOOKUP_ATTEMPTS = 10;

    const DEBUG = false;

    const LOG_COLORS = {
        info: "#16f2f2",
        warn: "#ff6ac1",
        error: "#ff0000",
        success: "#00ff00",
        debug: "#f39c12",
        gk: "#7a4feb"
    };

    const gkLogging = {
        attempts: 0,
        successes: 0,
        failures: 0,
        reasons: {},
        teamDetails: {},
        conversionDetails: {},
        processedTeams: new Set(),
        teamsWithGk: new Set(),
        matchesUsed: new Set()
    };

    const teamPlayersCache = {};
    const teamGoalkeeperCache = {};
    const xmlCache = {};
    const matchCache = {};

    let currentLeagueId = null;

    function log(msg, type = "info", obj = null) {
        if (!DEBUG) return;
        const style = `color: ${LOG_COLORS[type] || LOG_COLORS.info}; font-weight: bold;`;
        if (obj !== null) {
            console.log(`%c[MZ-UNLUCKY] ${msg}`, style, obj);
        } else {
            console.log(`%c[MZ-UNLUCKY] ${msg}`, style);
        }
    }

    function displayGkDebugInfo() {
        log("===== GOALKEEPER DEBUGGING INFORMATION =====", "gk");
        log(`Total attempts: ${gkLogging.attempts}`, "gk");
        log(`Successes: ${gkLogging.successes}`, "gk");
        log(`Failures: ${gkLogging.failures}`, "gk");
        log(`Success rate: ${((gkLogging.successes / Math.max(gkLogging.attempts, 1)) * 100).toFixed(2)}%`, "gk");
        log(`Teams processed: ${gkLogging.processedTeams.size}`, "gk");
        log(`Teams with goalkeeper data: ${gkLogging.teamsWithGk.size}`, "gk");
        log(`Total matches used: ${gkLogging.matchesUsed.size}`, "gk");
        log("Failure reasons:", "gk", gkLogging.reasons);
        log("Team details:", "gk", gkLogging.teamDetails);
        log("Currency conversion details:", "gk", gkLogging.conversionDetails);
        const currencyCount = {};
        for (const teamId in gkLogging.teamDetails) {
            const details = gkLogging.teamDetails[teamId];
            if (details.success && details.currency) {
                currencyCount[details.currency] = (currencyCount[details.currency] || 0) + 1;
            }
        }
        log("GKs by currency:", "gk", currencyCount);
        const currencyAvg = {};
        for (const teamId in gkLogging.teamDetails) {
            const details = gkLogging.teamDetails[teamId];
            if (details.success && details.currency) {
                if (!currencyAvg[details.currency]) {
                    currencyAvg[details.currency] = { count: 0, total: 0, totalUsd: 0 };
                }
                currencyAvg[details.currency].count++;
                currencyAvg[details.currency].total += details.originalValue;
                currencyAvg[details.currency].totalUsd += details.valueInUsd;
            }
        }
        for (const currency in currencyAvg) {
            const data = currencyAvg[currency];
            data.average = data.total / data.count;
            data.averageUsd = data.totalUsd / data.count;
        }
        log("Average GK values by currency:", "gk", currencyAvg);
        const topGks = Object.entries(gkLogging.teamDetails)
        .filter(([_, details]) => details.success)
        .sort((a, b) => b[1].valueInUsd - a[1].valueInUsd)
        .slice(0, 5);
        log("Top 5 most valuable goalkeepers:", "gk", topGks);
        log("================================================", "gk");
    }

    function getLeagueIdFromPage() {
        const livescoresImg = document.querySelector('img[id^="livescores_img_"]');
        if (livescoresImg) {
            const idParts = livescoresImg.id.split('_');
            const leagueId = idParts[idParts.length - 1];
            if (leagueId && /^\d+$/.test(leagueId)) {
                log(`Found league ID from page: ${leagueId}`, "success");
                currentLeagueId = leagueId;
                return leagueId;
            }
        }
        log("Could not find league ID from livescores image.", "warn");
        return null;
    }

    function getCurrentLeagueId() {
        if (currentLeagueId) {
            return currentLeagueId;
        }
        const url = window.location.href;
        const match = url.match(/sid=(\d+)/);
        return match ? match[1] : null;
    }

    function getCurrentLeagueType() {
        const url = window.location.href;
        const match = url.match(/type=([^&]+)/);
        return match ? match[1] : null;
    }

    function getDivisionDisplayName(sid, leagueType) {
        const sidNum = parseInt(sid);
        if (!sidNum) return `League ${sid}`;

        if (leagueType && leagueType.includes('world')) {
            if (sidNum === 1) return "Top Series";

            let level = 0;
            let levelStartSid = 1;
            let leaguesInLevel = 1;

            while (sidNum >= levelStartSid + leaguesInLevel) {
                levelStartSid += leaguesInLevel;
                level++;
                leaguesInLevel *= 3;
            }

            if (level > 0) {
                const indexInLevel = sidNum - levelStartSid + 1;
                return `Div ${level}.${indexInLevel}`;
            }
        } else {
            const regionalName = REGIONAL_LEAGUE_NAMES[sidNum];
            if (regionalName) {
                return regionalName;
            }
        }

        return `League ${sid}`;
    }

    function makeRequest(url) {
        log(`Making request to: ${url}`, "debug");
        return fetch(url)
            .then(response => {
            if (!response.ok) {
                log(`Request failed with status ${response.status}`, "error");
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.text();
        });
    }

    function convertToUsd(value, currency) {
        gkLogging.conversionDetails[currency] = gkLogging.conversionDetails[currency] || [];
        log(`Converting value from ${currency}: ${value}`, "debug");
        if (currency === 'USD') {
            log(`No conversion needed for USD value: ${value}`, "gk");
            gkLogging.conversionDetails[currency].push({ original: value, converted: value, rate: 1, formula: 'No conversion (USD)' });
            return value;
        }
        const conversionRate = CURRENCIES[currency] || 1;
        if (!CURRENCIES[currency]) {
            log(`Unknown currency: ${currency}, defaulting rate to 1`, "warn");
        }
        let valueInUsd;
        if (currency === 'SEK') {
            valueInUsd = (value / CURRENCIES.USD);
            log(`Converting from SEK: ${value} SEK = ${valueInUsd} USD (${value} / ${CURRENCIES.USD})`, "gk");
        } else {
            const valueInSek = value * conversionRate;
            valueInUsd = valueInSek / CURRENCIES.USD;
            log(`Converting from ${currency}: ${value} ${currency} = ${valueInSek} SEK = ${valueInUsd} USD (${value} * ${conversionRate} / ${CURRENCIES.USD})`, "gk");
        }
        gkLogging.conversionDetails[currency].push({ original: value, converted: valueInUsd, rate: conversionRate, usdRate: CURRENCIES.USD, formula: `(${value} * ${conversionRate}) / ${CURRENCIES.USD} = ${valueInUsd}` });
        return valueInUsd;
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'unluckyModal';
        modal.style.display = 'none';
        const modalContent = document.createElement('div');
        modalContent.id = 'unluckyModalContent';
        const modalHeader = document.createElement('div');
        modalHeader.id = 'unluckyModalHeader';
        const modalTitle = document.createElement('div');
        modalTitle.id = 'unluckyModalTitle';
        modalTitle.innerHTML = '<span style="background: linear-gradient(to right, #ff6ac1, #16f2f2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">アンラッキー 運命</span>';
        const modalClose = document.createElement('div');
        modalClose.id = 'unluckyModalClose';
        modalClose.textContent = '×';
        modalClose.addEventListener('click', closeModal);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalClose);
        const currentOption = document.createElement('div');
        currentOption.className = 'unluckyOption';
        currentOption.innerHTML = '<span style="font-size:18px;margin-right:8px;">🔍</span> Current League';
        currentOption.addEventListener('click', function() { findUnluckyTeams('current'); });
        const specificOption = document.createElement('div');
        specificOption.className = 'unluckyOption';
        specificOption.innerHTML = '<span style="font-size:18px;margin-right:8px;">🎯</span> Specific League';
        specificOption.addEventListener('click', function() { findUnluckyTeams('specific'); });
        const allOption = document.createElement('div');
        allOption.className = 'unluckyOption';
        allOption.innerHTML = '<span style="font-size:18px;margin-right:8px;">🌐</span> All Leagues';
        allOption.addEventListener('click', function() { findUnluckyTeams('all'); });
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'unluckyResults';
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(currentOption);
        modalContent.appendChild(specificOption);
        modalContent.appendChild(allOption);
        modalContent.appendChild(resultsDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        log("Modal created successfully", "success");
    }

    function openUnluckyModal() {
        document.getElementById('unluckyModal').style.display = 'flex';
        document.getElementById('unluckyResults').style.display = 'none';
        document.getElementById('unluckyResults').innerHTML = '';
        log("Modal opened", "info");
    }

    function closeModal() {
        document.getElementById('unluckyModal').style.display = 'none';
        const resultsDiv = document.getElementById('unluckyResults');
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        document.querySelectorAll('.unluckyOption').forEach(option => {
            option.style.display = 'block';
        });
        log("Modal closed", "info");
    }

    function showBackButton(resultsDiv) {
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = '← Back to Options';
        backButton.addEventListener('click', function() {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
            document.querySelectorAll('.unluckyOption').forEach(option => {
                option.style.display = 'block';
            });
        });
        resultsDiv.appendChild(backButton);
    }

    function addUnluckyButton() {
        const leftNav = document.querySelector('ul.leftnav');
        if (leftNav) {
            const li = document.createElement('li');
            li.id = 'leftmenu_unlucky';
            const button = document.createElement('a');
            button.href = '#';
            button.innerHTML = 'Unlucky <span style="color:#ff6ac1">☯</span>';
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openUnluckyModal();
            });
            li.appendChild(button);
            leftNav.appendChild(li);
            log("Added Unlucky button to left navigation", "success");
        } else {
            const expanderMenuList = document.querySelector('#nmenu');
            if (expanderMenuList) {
                const dt = document.createElement('dt');
                dt.className = 'news';
                dt.innerHTML = `
                <table>
                    <tbody>
                        <tr>
                            <td align="right"><i class="fa" aria-hidden="true"></i></td>
                            <td><a href="#" style="text-decoration:none"><b>Unlucky <span style="color:#ff6ac1">☯</span></b></a></td>
                        </tr>
                    </tbody>
                </table>
            `;
                dt.querySelector('a').addEventListener('click', function(e) {
                    e.preventDefault();
                    openUnluckyModal();
                });
                expanderMenuList.appendChild(dt);
                log("Added Unlucky button to expander menu", "success");
            } else {
                log("Could not find any navigation to add button", "error");
            }
        }
    }

    async function fetchTeamPlayers(teamId) {
        log(`Fetching team players for team ID: ${teamId}`, "info");
        if (teamPlayersCache[teamId]) {
            log(`Cache hit for team ${teamId}`, "success");
            return teamPlayersCache[teamId];
        }
        const cacheKey = `team_${teamId}`;
        if (xmlCache[cacheKey]) {
            log(`XML cache hit for team ${teamId}`, "success");
            return xmlCache[cacheKey];
        }
        try {
            const url = `https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`;
            log(`API request to: ${url}`, "debug");
            const response = await fetch(url);
            if (!response.ok) {
                log(`API response not OK: ${response.status} ${response.statusText}`, "error");
                return null;
            }
            const text = await response.text();
            log(`Received ${text.length} bytes of XML data`, "debug");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const parserError = xmlDoc.querySelector("parsererror");
            if (parserError) {
                log(`XML parsing error: ${parserError.textContent}`, "error");
                return null;
            }
            const teamPlayersElement = xmlDoc.querySelector('TeamPlayers');
            if (!teamPlayersElement) {
                log(`No TeamPlayers element found in XML for team ${teamId}`, "error");
                return null;
            }
            const teamCurrency = teamPlayersElement.getAttribute('teamCurrency') || 'USD';
            log(`Team ${teamId} currency: ${teamCurrency}`, "info");
            const players = [];
            let players18Count = 0;
            const playerElements = xmlDoc.querySelectorAll('Player');
            log(`Found ${playerElements.length} players for team ${teamId}`, "info");
            playerElements.forEach(player => {
                const id = player.getAttribute('id');
                const name = player.getAttribute('name');
                const value = parseInt(player.getAttribute('value')) || 0;
                const junior = player.getAttribute('junior') === '1';
                const shirtNo = player.getAttribute('shirtNo');
                const age = parseInt(player.getAttribute('age')) || 0;
                if (age === 18) {
                    players18Count++;
                }
                players.push({ id, name, value, junior, shirtNo, age });
                if (shirtNo === "1") {
                    log(`Potential GK detected in XML: ${name} (#${shirtNo})`, "gk", { id, name, value, teamCurrency });
                }
            });
            log(`Found ${players18Count} players aged 18 for team ${teamId}`, "info");
            const result = { teamCurrency, players, players18Count };
            teamPlayersCache[teamId] = result;
            xmlCache[cacheKey] = result;
            log(`Successfully processed team data for ${teamId}`, "success");
            return result;
        } catch (error) {
            log(`Error fetching team players for ${teamId}: ${error.message}`, "error");
            return null;
        }
    }

    async function processMatchComplete(matchId, teamIdMap = null) {
        log(`Processing match ${matchId} for complete data`, "info");
        if (matchCache[matchId]) {
            log(`Cache hit for match ${matchId}`, "success");
            return matchCache[matchId];
        }
        try {
            const matchUrl = `https://www.managerzone.com/?p=match&sub=result&mid=${matchId}`;
            log(`Fetching match page: ${matchUrl}`, "debug");
            const response = await fetch(matchUrl);
            if (!response.ok) {
                log(`Match page fetch failed: ${response.status} ${response.statusText}`, "error");
                return null;
            }
            const html = await response.text();
            log(`Received ${html.length} bytes of match HTML`, "debug");
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const matchInfoWrapper = doc.getElementById('match-info-wrapper');
            if (!matchInfoWrapper) {
                log(`No match info wrapper found for match ${matchId}`, "error");
                return null;
            }
            const teamElements = matchInfoWrapper.querySelectorAll('a[href*="/?p=team&tid="]');
            if (teamElements.length < 2) {
                log(`Not enough team links found for match ${matchId}, found ${teamElements.length}`, "error");
                return null;
            }
            const homeTeamHref = teamElements[0].getAttribute('href') || '';
            const awayTeamHref = teamElements[1].getAttribute('href') || '';
            const homeTeamMatch = homeTeamHref.match(/tid=(\d+)/);
            const awayTeamMatch = awayTeamHref.match(/tid=(\d+)/);
            if (!homeTeamMatch || !awayTeamMatch) {
                log(`Failed to extract team IDs from match ${matchId}`, "error");
                return null;
            }
            const homeTeam = { name: teamElements[0].textContent.trim(), id: homeTeamMatch[1] };
            const awayTeam = { name: teamElements[1].textContent.trim(), id: awayTeamMatch[1] };
            log(`Match: ${homeTeam.name} (${homeTeam.id}) vs ${awayTeam.name} (${awayTeam.id})`, "debug");
            const teamTables = doc.querySelectorAll('.team-table.block');
            log(`Found ${teamTables.length} team tables in match page`, "debug");
            if (!teamTables || teamTables.length < 2) {
                log(`Insufficient team tables (${teamTables?.length || 0}) found for match ${matchId}`, "error");
                return null;
            }
            const teamsInMatch = [];
            teamTables.forEach((table, index) => {
                const teamLink = table.querySelector('a[href*="tid="]');
                if (teamLink) {
                    const href = teamLink.getAttribute('href');
                    const tidMatch = href.match(/tid=(\d+)/);
                    if (tidMatch) {
                        const teamId = tidMatch[1];
                        const teamName = teamLink.textContent.trim();
                        teamsInMatch.push({ id: teamId, name: teamName, table: table, isHome: index === 0 });
                    }
                }
            });
            const tacticBoard = matchInfoWrapper.querySelector('#tactic-board');
            let matchFactsTable = null;
            if (tacticBoard && tacticBoard.nextElementSibling) {
                matchFactsTable = tacticBoard.nextElementSibling.querySelector('table.hitlist.statsLite.marker');
            }
            if (!matchFactsTable) {
                log(`No match facts table found for match ${matchId}`, "error");
                return null;
            }
            let homeGoals = 0, awayGoals = 0;
            let homeSoT = 0, awaySoT = 0;
            let homePossession = 0, awayPossession = 0;
            const statsRows = matchFactsTable.querySelectorAll('tbody tr');
            if (statsRows.length > 0) {
                const homeTd = statsRows[0].querySelector('td:nth-child(2)');
                const awayTd = statsRows[0].querySelector('td:nth-child(3)');
                if (homeTd && awayTd) {
                    homeGoals = parseInt(homeTd.textContent.trim()) || 0;
                    awayGoals = parseInt(awayTd.textContent.trim()) || 0;
                }
            }
            if (statsRows.length > 7) {
                const homeTd = statsRows[7].querySelector('td:nth-child(2)');
                const awayTd = statsRows[7].querySelector('td:nth-child(3)');
                if (homeTd && awayTd) {
                    homeSoT = parseInt(homeTd.textContent.trim()) || 0;
                    awaySoT = parseInt(awayTd.textContent.trim()) || 0;
                }
            }
            if (statsRows.length > 8) {
                const homeTd = statsRows[8].querySelector('td:nth-child(2)');
                const awayTd = statsRows[8].querySelector('td:nth-child(3)');
                if (homeTd && awayTd) {
                    const homeMatch = homeTd.textContent.trim().match(/(\d+)%/);
                    const awayMatch = awayTd.textContent.trim().match(/(\d+)%/);
                    homePossession = homeMatch ? parseInt(homeMatch[1]) : 50;
                    awayPossession = awayMatch ? parseInt(awayMatch[1]) : 50;
                }
            }
            let homeResult = homeGoals > awayGoals ? 'W' : (homeGoals < awayGoals ? 'L' : 'D');
            let awayResult = awayGoals > homeGoals ? 'W' : (awayGoals < homeGoals ? 'L' : 'D');
            const homeUnlucky = homeSoT > awaySoT && homeResult !== 'W';
            const awayUnlucky = awaySoT > homeSoT && awayResult !== 'W';
            const homeLucky = homeSoT < awaySoT && homeResult === 'W';
            const awayLucky = awaySoT < homeSoT && awayResult === 'W';
            const homeConversion = homeSoT > 0 ? (homeGoals / homeSoT * 100).toFixed(1) : 0;
            const awayConversion = awaySoT > 0 ? (awayGoals / awaySoT * 100).toFixed(1) : 0;
            const matchData = {
                mid: matchId,
                teams: teamsInMatch,
                homeTeam: { ...homeTeam, goals: homeGoals, shotsOnTarget: homeSoT, possession: homePossession, conversionRate: homeConversion, result: homeResult, unlucky: homeUnlucky, lucky: homeLucky },
                awayTeam: { ...awayTeam, goals: awayGoals, shotsOnTarget: awaySoT, possession: awayPossession, conversionRate: awayConversion, result: awayResult, unlucky: awayUnlucky, lucky: awayLucky },
                doc: doc
            };
            matchCache[matchId] = matchData;
            return matchData;
        } catch (error) {
            log(`Error processing match ${matchId}: ${error.message}`, "error");
            return null;
        }
    }

    async function extractGoalkeeperData(matchData, teamIdMap) {
        if (!matchData) return null;
        gkLogging.attempts++;
        gkLogging.matchesUsed.add(matchData.mid);
        try {
            for (const team of matchData.teams) {
                if (teamGoalkeeperCache[team.id]) {
                    log(`Team ${team.id} already has goalkeeper data, skipping`, "debug");
                    continue;
                }
                if (teamIdMap && !teamIdMap[team.id]) {
                    log(`Team ${team.id} not in current league's team map, skipping`, "debug");
                    continue;
                }
                gkLogging.processedTeams.add(team.id);
                const teamData = await fetchTeamPlayers(team.id);
                if (!teamData) {
                    log(`Failed to fetch team data for team ${team.id}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "no_team_data" };
                    continue;
                }
                const lineupTable = team.table.querySelector('table.hitlist.soccer.statsLite.marker');
                if (!lineupTable) {
                    log(`Lineup table not found for team ${team.id}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "lineup_table_not_found" };
                    continue;
                }
                const rows = lineupTable.querySelectorAll('tbody tr');
                if (!rows || rows.length === 0) {
                    log(`No player rows found in lineup table for team ${team.id}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "no_player_rows" };
                    continue;
                }
                const firstRow = rows[0];
                const playerLink = firstRow.querySelector('td:nth-child(3) a');
                if (!playerLink) {
                    log(`No player link found in first row for team ${team.id}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "no_player_link" };
                    continue;
                }
                const playerHref = playerLink.getAttribute('href');
                const pidMatch = playerHref.match(/pid=(\d+)/);
                if (!pidMatch) {
                    log(`No player ID found in player link for team ${team.id}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "no_player_id" };
                    continue;
                }
                const goalkeeperId = pidMatch[1];
                log(`Found goalkeeper ID ${goalkeeperId} for team ${team.id}`, "gk");
                const goalkeeper = teamData.players.find(p => p.id === goalkeeperId);
                if (goalkeeper) {
                    const currencyValue = teamData.teamCurrency;
                    const originalValue = goalkeeper.value;
                    log(`Goalkeeper found: ${goalkeeper.name} (ID: ${goalkeeper.id})`, "gk", { team: team.id, teamName: team.name, currency: currencyValue, value: originalValue });
                    const valueInUsd = convertToUsd(originalValue, currencyValue);
                    log(`Goalkeeper value: ${originalValue} ${currencyValue} = ${valueInUsd.toFixed(2)} USD`, "gk");
                    const result = { ...goalkeeper, valueInUsd };
                    teamGoalkeeperCache[team.id] = result;
                    gkLogging.successes++;
                    gkLogging.teamsWithGk.add(team.id);
                    gkLogging.teamDetails[team.id] = { success: true, goalkeeper: goalkeeper.name, originalValue: originalValue, currency: currencyValue, valueInUsd: valueInUsd };
                    log(`Successfully cached goalkeeper data for team ${team.id}`, "success");
                } else {
                    log(`Goalkeeper not found in team data for ID ${goalkeeperId}`, "error");
                    gkLogging.teamDetails[team.id] = { success: false, reason: "goalkeeper_not_in_team_data", goalkeeperId: goalkeeperId };
                }
            }
            return true;
        } catch (error) {
            log(`Error extracting goalkeeper data from match: ${error.message}`, "error");
            gkLogging.failures++;
            gkLogging.reasons["exception"] = (gkLogging.reasons["exception"] || 0) + 1;
            return false;
        }
    }

    async function fetchGoalkeepersMultiMatches(teams, matches, loadingEl = null) {
        log(`Starting goalkeeper data fetch using ${matches.length} matches for ${teams.length} teams`, "info");
        gkLogging.processedTeams.clear();
        gkLogging.teamsWithGk.clear();
        gkLogging.matchesUsed.clear();
        const teamIdMap = {};
        teams.forEach(team => { teamIdMap[team.id] = team; });
        log(`Team ID map created with ${Object.keys(teamIdMap).length} teams`, "debug");
        const teamsNeedingGkData = teams.filter(team => !teamGoalkeeperCache[team.id]).map(team => team.id);
        if (teamsNeedingGkData.length === 0) {
            log("All teams already have goalkeeper data in cache", "success");
            return;
        }
        log(`Teams needing goalkeeper data: ${teamsNeedingGkData.length}`, "info", teamsNeedingGkData);
        let matchesAttempted = 0;
        for (const match of matches) {
            if (gkLogging.teamsWithGk.size >= teams.length) {
                log(`Found goalkeeper data for all ${teams.length} teams, stopping match processing`, "success");
                break;
            }
            if (matchesAttempted >= MAX_GK_LOOKUP_ATTEMPTS) {
                log(`Hit maximum match lookup limit (${MAX_GK_LOOKUP_ATTEMPTS})`, "warn");
                break;
            }
            matchesAttempted++;
            if (loadingEl) {
                loadingEl.innerHTML = `
                <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
                <span style="color: #16f2f2; font-size: 18px;">Fetching goalkeeper data</span>
                <span class="loading-stage">Match ${matchesAttempted}/${Math.min(matches.length, MAX_GK_LOOKUP_ATTEMPTS)}</span>
                <span class="loading-progress">(Found: ${gkLogging.teamsWithGk.size}/${teams.length} goalkeepers)</span>`;
            }
            const homeTeamId = match.homeTeam.id;
            const awayTeamId = match.awayTeam.id;
            if (teamGoalkeeperCache[homeTeamId] && teamGoalkeeperCache[awayTeamId]) {
                log(`Skipping match ${match.mid}: both teams already have GK data`, "debug");
                continue;
            }
            const matchData = await processMatchComplete(match.mid, teamIdMap);
            if (matchData) {
                await extractGoalkeeperData(matchData, teamIdMap);
            }
            log(`After processing match ${match.mid}: Found GK data for ${gkLogging.teamsWithGk.size}/${teams.length} teams`, "info");
        }
        if (loadingEl) {
            loadingEl.innerHTML = `
            <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
            <span style="color: #16f2f2; font-size: 18px;">Goalkeeper data collection complete</span>
            <span class="loading-progress">(Found: ${gkLogging.teamsWithGk.size}/${teams.length} goalkeepers)</span>`;
        }
        log(`Goalkeeper lookup complete. Processed ${matchesAttempted} matches.`, "success");
        log(`Found goalkeeper data for ${gkLogging.teamsWithGk.size}/${teams.length} teams (${((gkLogging.teamsWithGk.size / teams.length) * 100).toFixed(1)}%)`, gkLogging.teamsWithGk.size > 0 ? "success" : "warn");
    }

    function extractTeamData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const teams = [];
        const rows = doc.querySelectorAll('table.nice_table tbody tr');
        log(`Found ${rows.length} team rows in league table`, "debug");
        rows.forEach(row => {
            const teamLinkElement = row.querySelector('td:nth-child(2) a[href*="tid="]');
            if (teamLinkElement) {
                const teamName = teamLinkElement.textContent.trim();
                const hrefMatch = teamLinkElement.getAttribute('href').match(/tid=(\d+)/);
                const teamId = hrefMatch ? hrefMatch[1] : null;
                if (teamId) {
                    const positionElement = row.querySelector('td:first-child');
                    const position = positionElement ? positionElement.textContent.trim() : '';
                    const matches = row.querySelector('td:nth-child(3)').textContent.trim();
                    const wins = row.querySelector('td:nth-child(4)').textContent.trim();
                    const draws = row.querySelector('td:nth-child(5)').textContent.trim();
                    const losses = row.querySelector('td:nth-child(6)').textContent.trim();
                    const goalsFor = row.querySelector('td:nth-child(7)').textContent.trim();
                    const goalsAgainst = row.querySelector('td:nth-child(8)').textContent.trim();
                    const goalDiff = row.querySelector('td:nth-child(9)').textContent.trim();
                    const points = row.querySelector('td:nth-child(10)').textContent.trim();
                    const last6Element = row.querySelector('td:nth-child(11)');
                    const last6Results = [];
                    if (last6Element) {
                        const matchLinks = last6Element.querySelectorAll('a');
                        matchLinks.forEach(link => {
                            const imgElement = link.querySelector('img');
                            if (imgElement) {
                                const resultType = imgElement.getAttribute('src').includes('green') ? 'W' : imgElement.getAttribute('src').includes('yellow') ? 'D' : 'L';
                                const matchTitle = link.getAttribute('title') || '';
                                last6Results.push({ result: resultType, match: matchTitle });
                            }
                        });
                    }
                    teams.push({
                        id: teamId, name: teamName, position,
                        matches: parseInt(matches) || 0, wins: parseInt(wins) || 0, draws: parseInt(draws) || 0, losses: parseInt(losses) || 0,
                        goalsFor: parseInt(goalsFor) || 0, goalsAgainst: parseInt(goalsAgainst) || 0, goalDiff: parseInt(goalDiff) || 0, points: parseInt(points) || 0,
                        last6: last6Results
                    });
                    log(`Extracted team: ${teamName} (ID: ${teamId})`, "debug");
                }
            }
        });
        log(`Total teams extracted: ${teams.length}`, "info");
        return teams;
    }

    function extractScheduleData(html, teams) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const matches = [];
        const teamNameToId = {};
        teams.forEach(team => { teamNameToId[team.name] = team.id; });
        const matchRows = doc.querySelectorAll('.hitlist tr');
        log(`Found ${matchRows.length} match rows in schedule`, "debug");
        matchRows.forEach(row => {
            const homeTeamCell = row.querySelector('td:nth-child(1)');
            const resultCell = row.querySelector('td:nth-child(2) a');
            const awayTeamCell = row.querySelector('td:nth-child(3)');
            if (homeTeamCell && resultCell && awayTeamCell) {
                const homeTeamName = homeTeamCell.textContent.trim();
                const awayTeamName = awayTeamCell.textContent.trim();
                const result = resultCell.textContent.trim();
                const matchHref = resultCell.getAttribute('href');
                const midMatch = matchHref.match(/mid=(\d+)/);
                const mid = midMatch ? midMatch[1] : null;
                if (mid) {
                    const homeTeamId = teamNameToId[homeTeamName] || null;
                    const awayTeamId = teamNameToId[awayTeamName] || null;
                    matches.push({ mid: mid, homeTeam: { name: homeTeamName, id: homeTeamId }, awayTeam: { name: awayTeamName, id: awayTeamId }, result: result });
                    if (!homeTeamId || !awayTeamId) {
                        log(`Warning: Team ID missing for match ${mid}: ${homeTeamName} vs ${awayTeamName}`, "warn");
                    }
                }
            }
        });
        log(`Total matches extracted: ${matches.length}`, "info");
        return matches;
    }

    function generateStatLeaders(validTeams) {
        return {
            bestOffensiveConversion: [...validTeams].sort((a, b) => parseFloat(b.offensiveConversionRate) - parseFloat(a.offensiveConversionRate)).slice(0, 3),
            worstOffensiveConversion: [...validTeams].sort((a, b) => parseFloat(a.offensiveConversionRate) - parseFloat(b.offensiveConversionRate)).slice(0, 3),
            bestDefensiveConversion: [...validTeams].sort((a, b) => parseFloat(a.defensiveConversionRate) - parseFloat(b.defensiveConversionRate)).slice(0, 3),
            worstDefensiveConversion: [...validTeams].sort((a, b) => parseFloat(b.defensiveConversionRate) - parseFloat(a.defensiveConversionRate)).slice(0, 3),
            luckiest: [...validTeams].sort((a, b) => parseFloat(b.luckIndex) - parseFloat(a.luckIndex)).slice(0, 3),
            unluckiest: [...validTeams].sort((a, b) => parseFloat(a.luckIndex) - parseFloat(b.luckIndex)).slice(0, 3),
            mostUnluckyMatches: validTeams.filter(t => t.dominatingMatches > 0).sort((a, b) => parseFloat(b.weightedUnluckyScore) - parseFloat(a.weightedUnluckyScore)).slice(0, 3),
            mostLuckyWins: validTeams.filter(t => t.outshot > 0).sort((a, b) => parseFloat(b.weightedLuckyScore) - parseFloat(a.weightedLuckyScore)).slice(0, 3),
        };
    }

    async function analyzeAndProcessLeague(leagueId, leagueType, loadingEl) {
        if (loadingEl) {
            loadingEl.innerHTML = `
            <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
            <span style="color: #16f2f2; font-size: 18px;">Loading league data</span>
            <span class="loading-stage">Step 1/3: Fetching league information</span>`;
        }

        const tableUrl = `https://www.managerzone.com/ajax.php?p=league&type=${leagueType}&sid=${leagueId}&tid=1&sport=soccer&sub=table`;
        const scheduleUrl = `https://www.managerzone.com/ajax.php?p=league&type=${leagueType}&sid=${leagueId}&tid=1&sport=soccer&sub=schedule`;
        const [tableHTML, scheduleHTML] = await Promise.all([makeRequest(tableUrl), makeRequest(scheduleUrl)]);

        if (loadingEl) {
            loadingEl.innerHTML = `
            <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
            <span style="color: #16f2f2; font-size: 18px;">Processing league data</span>
            <span class="loading-stage">Step 2/3: Processing teams and schedule</span>`;
        }

        const teams = extractTeamData(tableHTML);
        const allMatches = extractScheduleData(scheduleHTML, teams);
        const playedMatches = allMatches.filter(match => /^\d+\s*-\s*\d+$/.test(match.result));
        log(`Found ${teams.length} teams and ${playedMatches.length} played matches in league ${leagueId}`, "info");

        if (playedMatches.length === 0) {
            return { teams: [], statLeaders: generateStatLeaders([]) };
        }

        const teamStats = {};
        teams.forEach(team => {
            teamStats[team.id] = {
                name: team.name, shotsOnTarget: 0, goalsScored: 0, shotsOnTargetReceived: 0, goalsConceded: 0, matchesPlayed: 0,
                unluckyMatches: 0, dominatingMatches: 0, luckyWins: 0, outshot: 0, unluckyMatchDetails: [], luckyMatchDetails: [],
                goalkeeper: null, players18Count: 0
            };
        });

        gkLogging.processedTeams.clear();
        gkLogging.teamsWithGk.clear();
        gkLogging.matchesUsed.clear();

        const teamIdMap = {};
        teams.forEach(team => { teamIdMap[team.id] = team; });

        for (let i = 0; i < playedMatches.length; i += BATCH_SIZE) {
            if (loadingEl) {
                loadingEl.innerHTML = `
                <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
                <span style="color: #16f2f2; font-size: 18px;">Analyzing match data</span>
                <span class="loading-stage">Step 3/3: Processing matches</span>
                <span class="loading-progress">(${Math.min(i + BATCH_SIZE, playedMatches.length)}/${playedMatches.length})</span>
                <span class="loading-progress">(Found: ${gkLogging.teamsWithGk.size}/${teams.length} goalkeepers)</span>`;
            }

            const batch = playedMatches.slice(i, i + BATCH_SIZE);
            const matchPromises = batch.map(match => processMatchComplete(match.mid, teamIdMap));
            const matchResults = await Promise.all(matchPromises);

            if (i < MAX_GK_LOOKUP_ATTEMPTS * BATCH_SIZE) {
                const gkPromises = matchResults.filter(Boolean).map(matchData => extractGoalkeeperData(matchData, teamIdMap));
                await Promise.all(gkPromises);
            }

            matchResults.forEach(matchData => {
                if (!matchData) return;
                updateTeamStatsFromMatch(teamStats, matchData);
            });
        }

        const validTeams = finalizeTeamMetrics(teams, teamStats);
        const statLeaders = generateStatLeaders(validTeams);
        log(`League ${leagueId} processed successfully`, "success");
        return { teams: validTeams, statLeaders };
    }

    function updateTeamStatsFromMatch(teamStats, matchData) {
        const { homeTeam, awayTeam } = matchData;

        if (teamStats[homeTeam.id]) {
            const stats = teamStats[homeTeam.id];
            stats.shotsOnTarget += homeTeam.shotsOnTarget;
            stats.goalsScored += homeTeam.goals;
            stats.shotsOnTargetReceived += awayTeam.shotsOnTarget;
            stats.goalsConceded += awayTeam.goals;
            stats.matchesPlayed++;
            if (homeTeam.shotsOnTarget > awayTeam.shotsOnTarget) {
                stats.dominatingMatches++;
                if (homeTeam.result !== 'W') {
                    stats.unluckyMatches++;
                    stats.unluckyMatchDetails.push({ mid: matchData.mid, opponent: awayTeam.name, homeTeam: true, result: homeTeam.result, score: `${homeTeam.goals}-${awayTeam.goals}`, shotsOnTarget: `${homeTeam.shotsOnTarget}-${awayTeam.shotsOnTarget}` });
                }
            }
            if (homeTeam.shotsOnTarget < awayTeam.shotsOnTarget) {
                stats.outshot++;
                if (homeTeam.result === 'W') {
                    stats.luckyWins++;
                    stats.luckyMatchDetails.push({ mid: matchData.mid, opponent: awayTeam.name, homeTeam: true, result: homeTeam.result, score: `${homeTeam.goals}-${awayTeam.goals}`, shotsOnTarget: `${homeTeam.shotsOnTarget}-${awayTeam.shotsOnTarget}` });
                }
            }
        }

        if (teamStats[awayTeam.id]) {
            const stats = teamStats[awayTeam.id];
            stats.shotsOnTarget += awayTeam.shotsOnTarget;
            stats.goalsScored += awayTeam.goals;
            stats.shotsOnTargetReceived += homeTeam.shotsOnTarget;
            stats.goalsConceded += homeTeam.goals;
            stats.matchesPlayed++;
            if (awayTeam.shotsOnTarget > homeTeam.shotsOnTarget) {
                stats.dominatingMatches++;
                if (awayTeam.result !== 'W') {
                    stats.unluckyMatches++;
                    stats.unluckyMatchDetails.push({ mid: matchData.mid, opponent: homeTeam.name, homeTeam: false, result: awayTeam.result, score: `${homeTeam.goals}-${awayTeam.goals}`, shotsOnTarget: `${homeTeam.shotsOnTarget}-${awayTeam.shotsOnTarget}` });
                }
            }
            if (awayTeam.shotsOnTarget < homeTeam.shotsOnTarget) {
                stats.outshot++;
                if (awayTeam.result === 'W') {
                    stats.luckyWins++;
                    stats.luckyMatchDetails.push({ mid: matchData.mid, opponent: homeTeam.name, homeTeam: false, result: awayTeam.result, score: `${homeTeam.goals}-${awayTeam.goals}`, shotsOnTarget: `${homeTeam.shotsOnTarget}-${awayTeam.shotsOnTarget}` });
                }
            }
        }
    }

    function finalizeTeamMetrics(teams, teamStats) {
        const validTeams = [];
        teams.forEach(team => {
            const stats = teamStats[team.id];
            if (!stats || stats.shotsOnTarget === 0 || stats.shotsOnTargetReceived === 0) {
                log(`Excluding team ${team.name} (${team.id}) - Has 0 shots on target (for: ${stats.shotsOnTarget}, against: ${stats.shotsOnTargetReceived})`, "warn");
                return;
            }

            Object.assign(team, stats);
            team.goalkeeper = teamGoalkeeperCache[team.id] || null;
            team.players18Count = teamPlayersCache[team.id]?.players18Count || 0;

            team.offensiveConversionRate = stats.shotsOnTarget > 0 ? (stats.goalsScored / stats.shotsOnTarget * 100).toFixed(1) : '0.0';
            team.defensiveConversionRate = stats.shotsOnTargetReceived > 0 ? (stats.goalsConceded / stats.shotsOnTargetReceived * 100).toFixed(1) : '0.0';
            let luckIndex = parseFloat(team.offensiveConversionRate) - parseFloat(team.defensiveConversionRate);

            if (team.goalkeeper?.valueInUsd) {
                const gkValueFactor = Math.min(team.goalkeeper.valueInUsd / 1000000, 5) * 0.5;
                luckIndex -= gkValueFactor;
            }

            team.luckIndex = luckIndex.toFixed(1);
            team.unluckyIndex = stats.dominatingMatches > 0 ? ((stats.unluckyMatches / stats.dominatingMatches) * 100).toFixed(1) : '0.0';
            team.luckyWinPct = stats.outshot > 0 ? ((stats.luckyWins / stats.outshot) * 100).toFixed(1) : '0.0';

            const calculateWeightedScore = (successes, attempts) => {
                if (attempts <= 0) return '0.0';
                const percentage = successes / attempts;
                const sampleWeight = 1 + Math.log(Math.max(attempts, 1)) / 10;
                return (percentage * sampleWeight * 100).toFixed(1);
            };

            team.weightedUnluckyScore = calculateWeightedScore(stats.unluckyMatches, stats.dominatingMatches);
            team.weightedLuckyScore = calculateWeightedScore(stats.luckyWins, stats.outshot);
            validTeams.push(team);
        });

        log(`Goalkeeper data coverage: ${gkLogging.teamsWithGk.size}/${teams.length} teams (${((gkLogging.teamsWithGk.size / teams.length) * 100).toFixed(1)}%)`, gkLogging.teamsWithGk.size > 0 ? "success" : "warn");
        return validTeams;
    }

    async function processLeagueData(leagueId, resultsDiv, allLeaguesData = null, leagueType = null) {
        if (!leagueType) {
            leagueType = getCurrentLeagueType();
            if (!leagueType) {
                resultsDiv.innerHTML = `<p><span style="color:#ff6ac1">Error:</span> League type not found.</p>`;
                showBackButton(resultsDiv);
                return;
            }
        }
        const loadingEl = document.createElement('div');
        loadingEl.style.cssText = 'display: flex; justify-content: center; align-items: center; margin: 30px 0;';
        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(loadingEl);
        try {
            log(`Processing league ID: ${leagueId} (Type: ${leagueType})`, "info");
            const { teams, statLeaders } = await analyzeAndProcessLeague(leagueId, leagueType, loadingEl);

            displayGkDebugInfo();
            if (allLeaguesData !== null) {
                allLeaguesData[leagueId] = { teams, statLeaders, leagueType };
                updateGlobalLeaders(allLeaguesData);
                renderMultiLeagueView(allLeaguesData, resultsDiv, leagueId);
            } else {
                displayLeagueData(teams, statLeaders, leagueId, leagueType, resultsDiv);
            }

        } catch (error) {
            log(`Error processing league ${leagueId}: ${error.message}`, "error");
            if (resultsDiv) {
                resultsDiv.innerHTML = `<p><span style="color:#ff6ac1">Error:</span> Failed to process league data: ${error.message}</p>`;
                showBackButton(resultsDiv);
            }
        }
    }

    function updateGlobalLeaders(allLeaguesData) {
        const allTeams = Object.entries(allLeaguesData)
        .filter(([key]) => key !== 'globalLeaders')
        .flatMap(([leagueId, data]) =>
                 data.teams.map(team => ({
            ...team,
            leagueId: leagueId,
            leagueType: data.leagueType
        }))
                );

        if (allTeams.length === 0) {
            allLeaguesData.globalLeaders = {
                bestOffensiveConversion: [], worstOffensiveConversion: [],
                bestDefensiveConversion: [], worstDefensiveConversion: [],
                luckiest: [], unluckiest: [],
                mostUnluckyMatches: [], mostLuckyWins: []
            };
            return;
        }

        allLeaguesData.globalLeaders = {
            bestOffensiveConversion: [...allTeams].sort((a, b) => parseFloat(b.offensiveConversionRate) - parseFloat(a.offensiveConversionRate)).slice(0, 5),
            worstOffensiveConversion: [...allTeams].sort((a, b) => parseFloat(a.offensiveConversionRate) - parseFloat(b.offensiveConversionRate)).slice(0, 5),
            bestDefensiveConversion: [...allTeams].sort((a, b) => parseFloat(a.defensiveConversionRate) - parseFloat(b.defensiveConversionRate)).slice(0, 5),
            worstDefensiveConversion: [...allTeams].sort((a, b) => parseFloat(b.defensiveConversionRate) - parseFloat(a.defensiveConversionRate)).slice(0, 5),
            luckiest: [...allTeams].sort((a, b) => parseFloat(b.luckIndex) - parseFloat(a.luckIndex)).slice(0, 5),
            unluckiest: [...allTeams].sort((a, b) => parseFloat(a.luckIndex) - parseFloat(b.luckIndex)).slice(0, 5),
            mostUnluckyMatches: allTeams.filter(t => t.dominatingMatches > 0).sort((a, b) => parseFloat(b.weightedUnluckyScore) - parseFloat(a.weightedUnluckyScore)).slice(0, 5),
            mostLuckyWins: allTeams.filter(t => t.outshot > 0).sort((a, b) => parseFloat(b.weightedLuckyScore) - parseFloat(a.weightedLuckyScore)).slice(0, 5)
        };
        log("Global leaders calculated", "success");
    }

    function createMatchListElement(matchDetails, teamName) {
        const matchesDiv = document.createElement('div');
        matchesDiv.className = 'match-list';
        if (matchDetails && matchDetails.length > 0) {
            matchDetails.forEach(match => {
                const matchItem = document.createElement('div');
                matchItem.className = 'match-item';
                const resultClass = match.result === 'W' ? 'win' : (match.result === 'D' ? 'draw' : 'loss');
                const matchInfo = match.homeTeam ? `${teamName} vs ${match.opponent}` : `${match.opponent} vs ${teamName}`;
                matchItem.innerHTML = `
                    <a href="https://www.managerzone.com/?p=match&sub=result&mid=${match.mid}" target="_blank" class="match-link">${matchInfo}</a>
                    <span class="match-stats">SoT: ${match.shotsOnTarget}</span>
                    <span class="match-result ${resultClass}">${match.score} (${match.result})</span>`;
                matchesDiv.appendChild(matchItem);
            });
        } else {
            matchesDiv.innerHTML = '<p>No matches to show.</p>';
        }
        return matchesDiv;
    }

    function addToggleMatchListeners(container, teamsData) {
        container.querySelectorAll('.toggle-matches').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const teamId = this.dataset.teamId;
                const matchType = this.dataset.matchType;
                const parentStatItem = this.closest('.stat-item') || this.closest('.team-stats');
                if (!parentStatItem) return;

                let matchList = parentStatItem.querySelector(`.match-list`);
                if (matchList) {
                    matchList.remove();
                }

                const team = teamsData.find(t => t.id === teamId);
                if (!team) return;

                const matchDetails = matchType === 'unlucky' ? team.unluckyMatchDetails : team.luckyMatchDetails;

                if (this.textContent === "View matches") {
                    matchList = createMatchListElement(matchDetails, team.name);
                    matchList.style.display = 'block';
                    matchList.style.width = '100%';
                    parentStatItem.appendChild(matchList);
                    this.textContent = "Hide matches";
                } else {
                    this.textContent = "View matches";
                }
            });
        });
    }

    function displayLeagueData(teams, statLeaders, leagueId, leagueType, resultsDiv) {
        resultsDiv.innerHTML = '';
        const contentDiv = document.createElement('div');

        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        const summaryTabBtn = document.createElement('button');
        summaryTabBtn.className = 'tab active';
        summaryTabBtn.textContent = 'Statistics Summary';
        const teamsTabBtn = document.createElement('button');
        teamsTabBtn.className = 'tab';
        teamsTabBtn.textContent = 'All Teams';
        tabContainer.append(summaryTabBtn, teamsTabBtn);

        const summaryContent = document.createElement('div');
        summaryContent.className = 'tab-content active';
        const teamsContent = document.createElement('div');
        teamsContent.className = 'tab-content';

        const leagueUrl = `https://www.managerzone.com/?p=league&type=${leagueType}&sid=${leagueId}`;
        const divisionName = getDivisionDisplayName(leagueId, leagueType);
        const headerInfoHTML = `
            <div style="margin-bottom: 20px; padding: 10px; border-radius: 5px; background: rgba(0,0,0,0.2);">
                <p><span style="color:#16f2f2">League:</span> <a href="${leagueUrl}" target="_blank" class="league-link"><span class="league-label">${divisionName} (ID: ${leagueId})</span></a></p>
                <p><span style="color:#16f2f2">League Type:</span> ${leagueType}</p>
                <p><span style="color:#16f2f2">Teams Found:</span> ${teams.length}</p>
                <p><span style="color:#ff6ac1">GK Data Coverage: </span>${teams.filter(t => t.goalkeeper).length}/${teams.length}</p>
            </div>`;
        summaryContent.innerHTML = headerInfoHTML;
        teamsContent.innerHTML = headerInfoHTML;

        summaryContent.append(
            createStatCard('Best Conversion Rate', statLeaders.bestOffensiveConversion, team => `${team.name}: ${team.offensiveConversionRate}% (${team.goalsScored}/${team.shotsOnTarget} SoT)${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Worst Conversion Rate', statLeaders.worstOffensiveConversion, team => `${team.name}: ${team.offensiveConversionRate}% (${team.goalsScored}/${team.shotsOnTarget} SoT)${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Best GKs', statLeaders.bestDefensiveConversion, team => {
                let value = team.goalkeeper?.valueInUsd;
                let gkInfo = '';
                if (value) {
                    const formatted = value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `${(value / 1000).toFixed(0)}k`;
                    gkInfo = ` | GKValue: $${formatted}`;
                }
                return `${team.name}: ${team.defensiveConversionRate}% (${team.goalsConceded}/${team.shotsOnTargetReceived} SoT Against)${gkInfo}${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`;
            }, true),
            createStatCard('Worst GKs', statLeaders.worstDefensiveConversion, team => {
                let value = team.goalkeeper?.valueInUsd;
                let gkInfo = '';
                if (value) {
                    const formatted = value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `${(value / 1000).toFixed(0)}k`;
                    gkInfo = ` | GK: $${formatted}`;
                }
                return `${team.name}: ${team.defensiveConversionRate}% (${team.goalsConceded}/${team.shotsOnTargetReceived} SoT Against)${gkInfo}${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`;
            }, true),
            createStatCard('Luckiest Teams (Overall)', statLeaders.luckiest, team => `${team.name}: +${team.luckIndex}${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Unluckiest Teams (Overall)', statLeaders.unluckiest, team => `${team.name}: ${team.luckIndex}${team.players18Count ? ` | 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Teams with Most Unlucky Matches', statLeaders.mostUnluckyMatches, team => `${team.name}: ${team.unluckyIndex}% (${team.unluckyMatches}/${team.dominatingMatches})${team.players18Count ? ` | 18: ${team.players18Count}` : ''}<br><span style="font-size: 0.9em; color: #ff6ac1;">${team.weightedUnluckyScore}</span><span class="toggle-matches" data-team-id="${team.id}" data-match-type="unlucky">View matches</span>`, true),
            createStatCard('Teams with Most Lucky Wins', statLeaders.mostLuckyWins, team => `${team.name}: ${team.luckyWinPct}% (${team.luckyWins}/${team.outshot})${team.players18Count ? ` | 18: ${team.players18Count}` : ''}<br><span style="font-size: 0.9em; color: #ff6ac1;">${team.weightedLuckyScore}</span><span class="toggle-matches" data-team-id="${team.id}" data-match-type="lucky">View matches</span>`, true)
        );

        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team-stats';
            let gkInfo = '';
            if (team.goalkeeper) {
                const value = team.goalkeeper.valueInUsd;
                const formatted = value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `${(value / 1000).toFixed(0)}k`;
                gkInfo = `<div style="color: #16f2f2;">Goalkeeper: ${team.goalkeeper.name} (Value: USD ${formatted})</div>`;
            }
            const players18Info = team.players18Count !== undefined ? `<div style="color: #16f2f2;">Players Aged 18: ${team.players18Count}</div>` : '';
            teamDiv.innerHTML = `
                <div class="team-stats-title">${team.name}</div>
                ${gkInfo}
                ${players18Info}
                <div>Position: ${team.position} | Stats: ${team.wins}W-${team.draws}D-${team.losses}L | Points: ${team.points}</div>
                <div>Goals: ${team.goalsFor}-${team.goalsAgainst} (${team.goalDiff})</div>
                <div style="color: #ff6ac1;">
                    <div>Offensive: SoT ${team.shotsOnTarget || 0} | Goals ${team.goalsScored || 0} | Conversion ${team.offensiveConversionRate}%</div>
                    <div>Defensive: SoT Against ${team.shotsOnTargetReceived || 0} | Goals Against ${team.goalsConceded || 0} | Conversion Against ${team.defensiveConversionRate}%</div>
                    <div><strong>Luck Index: ${team.luckIndex}</strong> (higher is better)</div>
                    <div>Dominating Matches: ${team.dominatingMatches} (had more SoT than opponent)</div>
                    <div>Unlucky Matches: ${team.unluckyIndex}% (${team.unluckyMatches}/${team.dominatingMatches})<br>${team.weightedUnluckyScore} ${team.unluckyMatches > 0 ? `<span class="toggle-matches" data-team-id="${team.id}" data-match-type="unlucky">View matches</span>` : ''}</div>
                    <div>Lucky Wins: ${team.luckyWinPct}% (${team.luckyWins}/${team.outshot})<br>${team.weightedLuckyScore} ${team.luckyWins > 0 ? `<span class="toggle-matches" data-team-id="${team.id}" data-match-type="lucky">View matches</span>` : ''}</div>
                </div>
                <div>Last 6 matches: ${(team.last6 || []).map(m => `<span class="match-result" title="${m.match}">${m.result}</span>`).join('')}</div>`;
            teamsContent.appendChild(teamDiv);
        });

        const allTeamData = statLeaders.mostUnluckyMatches.concat(statLeaders.mostLuckyWins);
        addToggleMatchListeners(summaryContent, allTeamData);
        addToggleMatchListeners(teamsContent, teams);

        contentDiv.append(tabContainer, summaryContent, teamsContent);
        resultsDiv.appendChild(contentDiv);

        summaryTabBtn.addEventListener('click', () => {
            summaryTabBtn.classList.add('active');
            teamsTabBtn.classList.remove('active');
            summaryContent.classList.add('active');
            teamsContent.classList.remove('active');
        });
        teamsTabBtn.addEventListener('click', () => {
            summaryTabBtn.classList.remove('active');
            teamsTabBtn.classList.add('active');
            summaryContent.classList.remove('active');
            teamsContent.classList.add('active');
        });
    }

    function createStatCard(title, teams, formatter, showRank = false) {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `<div class="stat-card-title">${title}</div>`;

        teams.forEach((team, index) => {
            const item = document.createElement('div');
            item.className = 'stat-item';
            let content = showRank ? `<span class="stat-rank">${index + 1}</span> ` : '';
            content += formatter(team);

            const itemContentDiv = document.createElement('div');
            itemContentDiv.innerHTML = content;
            item.appendChild(itemContentDiv);

            if (team.leagueId && team.leagueType) {
                const divisionName = getDivisionDisplayName(team.leagueId, team.leagueType);
                const leagueUrl = `https://www.managerzone.com/?p=league&type=${team.leagueType}&sid=${team.leagueId}`;
                const leagueInfoDiv = document.createElement('div');
                leagueInfoDiv.className = 'stat-value';
                leagueInfoDiv.innerHTML = `<a href="${leagueUrl}" target="_blank" class="league-link"><span class="league-label">${divisionName}</span></a>`;
                item.appendChild(leagueInfoDiv);
            }
            card.appendChild(item);
        });
        return card;
    }

    function renderGlobalLeadersView(allLeaguesData, container) {
        container.innerHTML = '';
        const globalLeaders = allLeaguesData.globalLeaders;
        if (!globalLeaders) return;

        const allTeams = Object.values(allLeaguesData)
            .filter(data => data.teams)
            .flatMap(data => data.teams);

        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'tab-content active';
        summaryContainer.innerHTML = `
            <h2 style="color: #ff6ac1; text-align: center; margin-bottom: 20px;">Global Statistics Leaders</h2>
            <p style="text-align: center; margin-bottom: 20px;">Showing the best and worst teams across all analyzed leagues</p>`;

        summaryContainer.append(
            createStatCard('Best Offensive Conversion (Global)', globalLeaders.bestOffensiveConversion, team => `${team.name}: ${team.offensiveConversionRate}% (${team.goalsScored}/${team.shotsOnTarget} SoT)${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Worst Offensive Conversion (Global)', globalLeaders.worstOffensiveConversion, team => `${team.name}: ${team.offensiveConversionRate}% (${team.goalsScored}/${team.shotsOnTarget} SoT)${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Best GKs (Global)', globalLeaders.bestDefensiveConversion, team => {
                let value = team.goalkeeper?.valueInUsd;
                let gkInfo = value ? ` | GK: $${value >= 1000000 ? `${(value/1000000).toFixed(2)}M` : `${(value/1000).toFixed(0)}k`}` : '';
                return `${team.name}: ${team.defensiveConversionRate}% (${team.goalsConceded}/${team.shotsOnTargetReceived} SoT Against)${gkInfo}${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`;
            }, true),
            createStatCard('Worst GKs (Global)', globalLeaders.worstDefensiveConversion, team => {
                let value = team.goalkeeper?.valueInUsd;
                let gkInfo = value ? ` | GK: $${value >= 1000000 ? `${(value/1000000).toFixed(2)}M` : `${(value/1000).toFixed(0)}k`}` : '';
                return `${team.name}: ${team.defensiveConversionRate}% (${team.goalsConceded}/${team.shotsOnTargetReceived} SoT Against)${gkInfo}${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`;
            }, true),
            createStatCard('Luckiest Teams (Global)', globalLeaders.luckiest, team => `${team.name}: +${team.luckIndex}${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Unluckiest Teams (Global)', globalLeaders.unluckiest, team => `${team.name}: ${team.luckIndex}${team.players18Count ? ` | Players 18: ${team.players18Count}` : ''}`, true),
            createStatCard('Teams with Most Unlucky Matches (Global)', globalLeaders.mostUnluckyMatches, team => `${team.name}: ${team.unluckyIndex}% (${team.unluckyMatches}/${team.dominatingMatches})<br><span style="font-size: 0.9em; color: #ff6ac1;">${team.weightedUnluckyScore}</span> <span class="toggle-matches" data-team-id="${team.id}" data-match-type="unlucky">View matches</span>`, true),
            createStatCard('Teams with Most Lucky Wins (Global)', globalLeaders.mostLuckyWins, team => `${team.name}: ${team.luckyWinPct}% (${team.luckyWins}/${team.outshot})<br><span style="font-size: 0.9em; color: #ff6ac1;">${team.weightedLuckyScore}</span> <span class="toggle-matches" data-team-id="${team.id}" data-match-type="lucky">View matches</span>`, true)
        );

        addToggleMatchListeners(summaryContainer, allTeams);
        container.appendChild(summaryContainer);
    }

    function renderMultiLeagueView(allLeaguesData, resultsDiv, currentLeagueId) {
        resultsDiv.innerHTML = '';

        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = '← Back to Options';
        backButton.style.marginBottom = '15px';
        backButton.addEventListener('click', () => {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
            document.querySelectorAll('.unluckyOption').forEach(option => option.style.display = 'block');
        });

        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        const globalTab = document.createElement('button');
        globalTab.className = 'tab active';
        globalTab.textContent = 'Global Leaders';
        const leagueTab = document.createElement('button');
        leagueTab.className = 'tab';
        leagueTab.textContent = 'League View';
        tabContainer.append(globalTab, leagueTab);

        const globalContent = document.createElement('div');
        globalContent.className = 'tab-content active';
        const leagueContent = document.createElement('div');
        leagueContent.className = 'tab-content';

        renderGlobalLeadersView(allLeaguesData, globalContent);

        const leagueIds = Object.keys(allLeaguesData).filter(key => key !== 'globalLeaders').sort((a, b) => parseInt(a) - parseInt(b));
        let currentActiveLeagueIndex = leagueIds.indexOf(currentLeagueId);
        if (currentActiveLeagueIndex === -1 && leagueIds.length > 0) currentActiveLeagueIndex = 0;

        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'league-selector';
        selectorContainer.innerHTML = `<div class="league-selector-title">Select a League:</div>`;
        const leagueGrid = document.createElement('div');
        leagueGrid.className = 'league-grid';
        selectorContainer.appendChild(leagueGrid);
        leagueContent.appendChild(selectorContainer);

        const leagueDataContainer = document.createElement('div');
        leagueContent.appendChild(leagueDataContainer);

        const displayLeagueContent = (leagueId) => {
            const leagueData = allLeaguesData[leagueId];
            if (!leagueData) return;

            displayLeagueData(leagueData.teams, leagueData.statLeaders, leagueId, leagueData.leagueType, leagueDataContainer);
            resultsDiv.scrollTop = 0;
            currentActiveLeagueIndex = leagueIds.indexOf(leagueId);

            leagueGrid.querySelectorAll('.league-item').forEach(item => {
                item.classList.toggle('active', item.dataset.leagueId === leagueId);
            });
        };

        leagueIds.forEach(leagueId => {
            const leagueType = allLeaguesData[leagueId].leagueType;
            const divisionName = getDivisionDisplayName(leagueId, leagueType);
            const leagueButton = document.createElement('div');
            leagueButton.className = 'league-item';
            leagueButton.classList.toggle('active', leagueId === leagueIds[currentActiveLeagueIndex]);
            leagueButton.dataset.leagueId = leagueId;
            leagueButton.innerHTML = `<a href="?p=league&type=${leagueType}&sid=${leagueId}" target="_blank" class="league-link" title="View ${divisionName}"><span class="league-label">${divisionName}</span></a>`;
            leagueButton.addEventListener('click', (e) => {
                if (e.target.closest('.league-link')) return;
                e.preventDefault();
                displayLeagueContent(e.currentTarget.dataset.leagueId);
            });
            leagueGrid.appendChild(leagueButton);
        });

        displayLeagueContent(leagueIds[currentActiveLeagueIndex]);

        globalTab.addEventListener('click', () => {
            globalTab.classList.add('active');
            leagueTab.classList.remove('active');
            globalContent.classList.add('active');
            leagueContent.classList.remove('active');
        });
        leagueTab.addEventListener('click', () => {
            globalTab.classList.remove('active');
            leagueTab.classList.add('active');
            globalContent.classList.remove('active');
            leagueContent.classList.add('active');
        });

        resultsDiv.append(backButton, tabContainer, globalContent, leagueContent);
    }

    async function processMultipleLeagues(leagueEntries, resultsDiv) {
        const allLeaguesData = {};
        const loadingEl = document.createElement('div');
        loadingEl.style.cssText = 'display: flex; justify-content: center; align-items: center; margin: 30px 0;';
        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(loadingEl);

        for (let i = 0; i < leagueEntries.length; i++) {
            const entry = leagueEntries[i];
            const { id: leagueId, type: leagueType } = entry;
            const divisionName = getDivisionDisplayName(leagueId, leagueType);

            loadingEl.innerHTML = `
            <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
            <span style="color: #16f2f2; font-size: 18px;">Processing <span class="league-label" style="vertical-align: middle;">${divisionName}</span> (${i + 1}/${leagueEntries.length}) - Type: ${leagueType}</span>`;

            try {
                const { teams, statLeaders } = await analyzeAndProcessLeague(leagueId, leagueType, null);
                if (teams.length > 0) {
                    allLeaguesData[leagueId] = { teams, statLeaders, leagueType };
                }
            } catch (error) {
                log(`Error processing league ${leagueId} (Type: ${leagueType}): ${error.message}`, "error");
            }
        }

        loadingEl.innerHTML = `
        <div class="pulse-dot" style="width: 20px; height: 20px;"></div>
        <span style="color: #16f2f2; font-size: 18px;">Finalizing global statistics...</span>`;

        displayGkDebugInfo();
        updateGlobalLeaders(allLeaguesData);
        const leagueIds = Object.keys(allLeaguesData).filter(key => key !== 'globalLeaders').sort((a, b) => parseInt(a) - parseInt(b));

        if (leagueIds.length > 0) {
            renderMultiLeagueView(allLeaguesData, resultsDiv, leagueIds[0]);
        } else {
            resultsDiv.innerHTML = '<p>No leagues with valid match data found in the specified leagues.</p>';
            showBackButton(resultsDiv);
        }
    }

    function showLeagueInputForm(resultsDiv) {
        resultsDiv.innerHTML = '';
        const formDiv = document.createElement('div');
        formDiv.style.marginBottom = '20px';
        formDiv.innerHTML = '<p>Add leagues (by ID & Type) to analyze:</p>';

        const leagueEntryContainer = document.createElement('div');
        leagueEntryContainer.className = 'league-entry-container';
        const entryForm = document.createElement('div');
        entryForm.className = 'league-entry-form';
        const sidInput = document.createElement('input');
        sidInput.type = 'text';
        sidInput.placeholder = 'League IDs (e.g., 1, 2, 3)';
        sidInput.autocomplete = 'off';
        const typeSelect = document.createElement('select');
        typeSelect.innerHTML = LEAGUE_TYPES.map(lt => `<option value="${lt.value}">${lt.label}</option>`).join('');
        const addButton = document.createElement('button');
        addButton.className = 'add-button';
        addButton.innerHTML = '+';
        addButton.title = 'Add Leagues';
        entryForm.append(sidInput, typeSelect, addButton);

        const leagueList = document.createElement('div');
        leagueList.className = 'league-list';
        leagueList.style.display = 'none';
        leagueEntryContainer.append(entryForm, leagueList);

        const submitButton = document.createElement('button');
        submitButton.className = 'unluckyOption';
        submitButton.style.marginTop = '15px';
        submitButton.textContent = 'Analyze Leagues';

        let leagues = [];

        const updateSubmitButtonState = () => {
            submitButton.disabled = leagues.length === 0;
            submitButton.style.opacity = submitButton.disabled ? 0.6 : 1;
            submitButton.style.cursor = submitButton.disabled ? 'not-allowed' : 'pointer';
        };

        const updateLeagueListView = () => {
            if (leagues.length === 0) {
                leagueList.style.display = 'none';
                updateSubmitButtonState();
                return;
            }
            leagueList.style.display = 'block';
            leagueList.innerHTML = '';
            leagues.forEach((league, index) => {
                const item = document.createElement('div');
                item.className = 'league-list-item';
                const divName = getDivisionDisplayName(league.id, league.type);
                const typeLabel = LEAGUE_TYPES.find(lt => lt.value === league.type)?.label || league.type;
                item.innerHTML = `<div><span class="league-label">${divName}</span> (${typeLabel})</div>`;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-button';
                removeBtn.textContent = '×';
                removeBtn.onclick = () => {
                    leagues.splice(index, 1);
                    updateLeagueListView();
                };
                item.appendChild(removeBtn);
                leagueList.appendChild(item);
            });
            updateSubmitButtonState();
        };

        const addLeagues = () => {
            const rawIds = sidInput.value.trim();
            if (!rawIds) return;
            const selectedType = typeSelect.value;
            const ids = rawIds.split(/[\s,]+/).filter(id => /^\d+$/.test(id));
            ids.forEach(id => {
                if (!leagues.some(l => l.id === id && l.type === selectedType)) {
                    leagues.push({ id, type: selectedType });
                }
            });
            sidInput.value = '';
            sidInput.focus();
            updateLeagueListView();
        };

        addButton.addEventListener('click', addLeagues);
        sidInput.addEventListener('keypress', e => { if (e.key === 'Enter') addLeagues(); });
        submitButton.addEventListener('click', () => {
            if (leagues.length > 0) {
                resultsDiv.innerHTML = `<p><span class="pulse-dot"></span> <span style="color:#16f2f2">Processing ${leagues.length} leagues...</span></p>`;
                processMultipleLeagues(leagues, resultsDiv);
            }
        });

        updateSubmitButtonState();
        formDiv.append(leagueEntryContainer, submitButton);
        resultsDiv.appendChild(formDiv);
        showBackButton(resultsDiv);
        setTimeout(() => sidInput.focus(), 100);
    }

    function showSidPrompt(resultsDiv, isSpecificOption = false) {
        if (isSpecificOption) {
            resultsDiv.innerHTML = '';
            const currentLeagueId = getCurrentLeagueId() || '';
            const currentLeagueType = getCurrentLeagueType();
            const formDiv = document.createElement('div');
            formDiv.style.marginBottom = '20px';
            formDiv.innerHTML = `
                <p>Please enter a <span style="color: #FF4B33">league ID</span> and select type:</p>
                <div class="league-entry-form" style="margin-top: 15px; margin-bottom: 15px;">
                    <input type="text" id="sid-input" placeholder="Enter league ID..." autocomplete="off" spellcheck="false" value="${currentLeagueId}" style="width: 20%;">
                    <select id="type-select" style="flex-grow: 1;">
                        ${LEAGUE_TYPES.map(lt => `<option value="${lt.value}" ${currentLeagueType === lt.value ? 'selected' : ''}>${lt.label}</option>`).join('')}
                    </select>
                </div>
                <button id="sid-submit" class="unluckyOption" style="width: 20%; margin-top: 0; margin-bottom: 15px;">Submit</button>`;
            resultsDiv.appendChild(formDiv);

            const sidInput = formDiv.querySelector('#sid-input');
            const typeSelect = formDiv.querySelector('#type-select');
            const submitBtn = formDiv.querySelector('#sid-submit');

            const handleSubmit = () => {
                const sid = sidInput.value.trim();
                const type = typeSelect.value;
                if (sid && /^\d+$/.test(sid)) {
                    const divName = getDivisionDisplayName(sid, type);
                    resultsDiv.innerHTML = `<p><span class="pulse-dot"></span> <span style="color:#16f2f2">Loading data for <span class="league-label">${divName}</span> (Type: ${type})...</span></p>`;
                    processLeagueData(sid, resultsDiv, null, type);
                } else {
                    formDiv.insertAdjacentHTML('afterbegin', `<p style="color:#ff6ac1; margin-bottom: 10px;">Please enter a valid league ID (numbers only).</p>`);
                }
            };

            submitBtn.addEventListener('click', handleSubmit);
            sidInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSubmit(); });
            showBackButton(resultsDiv);
            setTimeout(() => sidInput.focus(), 100);

        } else {
            const leagueId = getCurrentLeagueId();
            const leagueType = getCurrentLeagueType();
            if (!leagueId || !leagueType) {
                resultsDiv.innerHTML = `<p><span style="color:#ff6ac1">Error:</span> Could not detect league ID or type from URL or page content.</p>`;
                showBackButton(resultsDiv);
                return;
            }
            const divisionName = getDivisionDisplayName(leagueId, leagueType);
            resultsDiv.innerHTML = `<p><span class="pulse-dot"></span> <span style="color:#16f2f2">Loading data for <span class="league-label">${divisionName}</span> (Type: ${leagueType})...</span></p>`;
            processLeagueData(leagueId, resultsDiv, null, leagueType);
        }
    }

    function findUnluckyTeams(scope) {
        document.querySelectorAll('.unluckyOption').forEach(option => {
            option.style.display = 'none';
        });
        const resultsDiv = document.getElementById('unluckyResults');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '';
        if (scope === 'all') {
            showLeagueInputForm(resultsDiv);
        } else if (scope === 'current') {
            showSidPrompt(resultsDiv, false);
        } else if (scope === 'specific') {
            showSidPrompt(resultsDiv, true);
        }
    }

    function initializeScript() {
        getLeagueIdFromPage();
        createModal();
        addUnluckyButton();
        log("MZ-Unlucky - 私たちは最高の防御を持っています", "success");
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeScript, 500);
    } else {
        window.addEventListener('load', () => { setTimeout(initializeScript, 500); });
    }
})();
