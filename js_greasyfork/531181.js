// ==UserScript==
// @name         MZ - Carrapichel
// @namespace    douglaskampl
// @version      4.4
// @description  Tracks season cups, WL performance and U18 cup performance by country
// @author       Douglas
// @match        https://www.managerzone.com/?p=team
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531181/MZ%20-%20Carrapichel.user.js
// @updateURL https://update.greasyfork.org/scripts/531181/MZ%20-%20Carrapichel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.body.classList.add('mzstyle');

    const SCRIPT_NAME = 'MZ Carrapichel';
    const SEASON_CUP_CONSTANTS = {
        STORAGE_KEY_CUP_ID: 'mz_carrapichl_cupid'
    };
    const WORLD_LEAGUE_CONSTANTS = {
        COUNTRY_CODES: {
            brazil: 'br',
            sweden: 'se',
            poland: 'pl',
            turkey: 'tr',
            italy: 'it',
            spain: 'es',
            argentina: 'ar'
        }
    };
    const SPECIAL_CUPS = ['Seasons Greetings U18 Cup 2024'];

    let currentYear = new Date().getFullYear();
    let currentSeason = detectCurrentSeason();

    function detectCurrentSeason() {
        const fallback = 93;
        try {
            const headerStatsWrapper = document.getElementById('header-stats-wrapper');
            if (headerStatsWrapper) {
                const seasonElement = headerStatsWrapper.querySelectorAll('h5')[2];
                if (seasonElement) {
                    const seasonText = seasonElement.innerText;
                    const firstNumberMatch = seasonText.match(/\d+/);
                    if (firstNumberMatch) {
                        return parseInt(firstNumberMatch[0], 10);
                    }
                }
            }
        } catch (error) {
            console.error(`${SCRIPT_NAME}: Error detecting current season:`, error);
        }
        console.warn(`${SCRIPT_NAME}: Could not detect current season, will use ${fallback}`);
        return fallback;
    }

    function log(message) {
        console.log(`[${SCRIPT_NAME}] ${message}`);
    }

    log(`Detected Current Season: ${currentSeason}, Current Year: ${currentYear}`);

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;600&display=swap');

        body.mzstyle .mz-btn {
            background: linear-gradient(to bottom, #ffffff 0%, #d8e9f6 50%, #b6d5f1 51%, #c8def7 100%);
            color: #336699;
            border: 1px solid #A5BDDD;
            padding: 6px 12px;
            border-radius: 12px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            cursor: pointer;
            margin: 5px 0;
            transition: all 0.2s ease;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.8);
        }

        body.mzstyle .mz-btn:hover {
            background: linear-gradient(to bottom, #ffffff 0%, #e9f3fc 50%, #cadff3 51%, #d8eafa 100%);
            transform: translateY(-1px);
            box-shadow: 0 3px 5px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,1);
        }

        body.mzstyle .mz-select {
            appearance: none;
            background: linear-gradient(to bottom, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
            color: #336699;
            border: 1px solid #A5BDDD;
            padding: 8px 35px 8px 15px;
            border-radius: 8px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-right: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23336699%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 12px top 50%;
            background-size: 12px auto;
        }

        body.mzstyle .mz-select:hover {
            background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 47%, #f0f0f0 100%);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }

        body.mzstyle .mz-select option {
            background: #FFFFFF;
            color: #336699;
        }

        body.mzstyle .mz-input {
            background: linear-gradient(to bottom, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
            color: #336699;
            border: 1px solid #A5BDDD;
            padding: 8px 15px;
            border-radius: 8px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            font-size: 13px;
            transition: all 0.3s ease;
            margin-right: 10px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }

        body.mzstyle .mz-input::placeholder {
            color: #87B5EB;
            opacity: 0.7;
        }

        body.mzstyle .mz-input:focus {
            outline: none;
            border-color: #3BA3D0;
            box-shadow: 0 0 5px rgba(59,163,208,0.5), inset 0 1px 3px rgba(0,0,0,0.05);
        }

        body.mzstyle .mz-control-group {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
            background: rgba(216,233,246,0.5);
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.05);
            flex-wrap: wrap;
        }

        body.mzstyle .mz-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background: rgba(171,205,239,0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
        }

        body.mzstyle .mz-modal-content {
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(230,240,250,0.9) 100%);
            margin: 20px auto;
            padding: 30px;
            width: 95%;
            max-width: 1200px;
            border-radius: 18px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.9);
            position: relative;
            min-height: min-content;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            color: #336699;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            border: 1px solid rgba(255,255,255,0.8);
        }

        body.mzstyle .mz-modal-content::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        body.mzstyle .mz-modal-content::-webkit-scrollbar-track {
            background: rgba(230,240,250,0.5);
            border-radius: 10px;
        }

        body.mzstyle .mz-modal-content::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #87B5EB 0%, #3BA3D0 100%);
            border-radius: 10px;
            border: 2px solid rgba(255,255,255,0.5);
        }

        body.mzstyle .mz-modal-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #6AA3E9 0%, #2A93C0 100%);
        }

        body.mzstyle .mz-loading-spinner {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
        }

        @keyframes mz-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        body.mzstyle .mz-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(200,222,247,0.4);
            border-top: 5px solid #3BA3D0;
            border-radius: 50%;
            animation: mz-spin 1s linear infinite;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(59,163,208,0.5);
        }

        body.mzstyle .mz-no-data {
            text-align: center;
            color: #87B5EB;
            font-size: 20px;
            padding: 40px;
            background: rgba(255,255,255,0.5);
            border-radius: 12px;
            box-shadow: inset 0 1px 5px rgba(0,0,0,0.05);
        }

        body.mzstyle .mz-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 20px 0;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid #C0D9E6;
            background: rgba(255,255,255,0.7);
        }

        body.mzstyle .mz-table th,
        body.mzstyle .mz-table td {
            padding: 12px 15px;
            text-align: left;
            border: 1px solid #E1EDF7;
            color: #336699;
            vertical-align: middle;
        }

        body.mzstyle .mz-table tr:hover:not(.mz-header):not(.mz-champion):not(.mz-first-place):not(.mz-second-place):not(.mz-third-place):not(.promotion):not(.relegation):not(.stay) {
            background: linear-gradient(to bottom, rgba(230,240,250,0.5) 0%, rgba(240,247,252,0.5) 100%);
        }

        body.mzstyle .mz-header {
            background: linear-gradient(to bottom, #ABCDEF 0%, #8AB5E2 100%);
            color: white !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }

        body.mzstyle .mz-champion,
        body.mzstyle .mz-first-place {
            background: linear-gradient(to bottom, #FFF7AE 0%, #FFEC80 100%);
            color: #8B7900 !important;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: inset 0 0 15px rgba(255,255,255,0.8);
        }

        body.mzstyle .mz-second-place {
            background: linear-gradient(to bottom, #E0E0E0 0%, #C0C0C0 100%);
            color: #4F4F4F !important;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        body.mzstyle .mz-third-place {
            background: linear-gradient(to bottom, #FFDAB9 0%, #CD853F 100%);
            color: #6B4423 !important;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        body.mzstyle .mz-champion:hover,
        body.mzstyle .mz-first-place:hover,
        body.mzstyle .mz-second-place:hover,
        body.mzstyle .mz-third-place:hover {
            transform: scale(1.005);
            box-shadow: 0 2px 8px rgba(59,163,208,0.2), inset 0 0 20px rgba(255,255,255,1);
        }

        body.mzstyle .promotion {
            background: linear-gradient(to bottom, #D8F0FF 0%, #B8E2F8 100%);
            font-weight: bold;
        }

        body.mzstyle .relegation {
            background: linear-gradient(to bottom, #FFE8E8 0%, #FFCDD2 100%);
            font-weight: bold;
        }

        body.mzstyle .stay {
            background: linear-gradient(to bottom, #E8F5E9 0%, #C8E6C9 100%);
            font-weight: normal;
        }

        body.mzstyle #wl-data-container .mz-table tbody tr.promotion {
             background: linear-gradient(to bottom, #D8F0FF 0%, #B8E2F8 100%);
             font-weight: bold;
        }
        body.mzstyle #wl-data-container .mz-table tbody tr.relegation {
             background: linear-gradient(to bottom, #FFE8E8 0%, #FFCDD2 100%);
             font-weight: bold;
        }
         body.mzstyle #wl-data-container .mz-table tbody tr.stay {
             background: linear-gradient(to bottom, #E8F5E9 0%, #C8E6C9 100%);
             font-weight: normal;
        }


        body.mzstyle .the-flag {
            margin-left: 5px;
            vertical-align: middle;
            border-radius: 3px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        body.mzstyle h3 {
            color: #3BA3D0;
            margin: 25px 0 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #C0D9E6;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            font-weight: 600;
            text-shadow: 0 1px 1px rgba(255,255,255,1);
        }

        body.mzstyle h3 a {
            color: #3BA3D0;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        body.mzstyle h3 a:hover {
            color: #1A6796;
        }

        body.mzstyle .champions-section,
        body.mzstyle .u18-ranking-section {
            margin-top: 40px;
            padding: 30px;
            background: linear-gradient(135deg, rgba(213,235,251,0.8) 0%, rgba(166,209,237,0.8) 100%);
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9);
        }

        body.mzstyle .champions-title,
        body.mzstyle .u18-ranking-title {
            color: #1A6796;
            text-align: center;
            font-size: 28px;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            text-shadow: 0 1px 1px rgba(255,255,255,1);
            font-weight: 600;
        }

        body.mzstyle .champions-table,
        body.mzstyle .u18-ranking-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 20px 0;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            background: rgba(255,255,255,0.7);
        }

        body.mzstyle .champions-table th,
        body.mzstyle .champions-table td,
        body.mzstyle .u18-ranking-table th,
        body.mzstyle .u18-ranking-table td {
            padding: 12px 15px;
            text-align: left;
            border: 1px solid #E1EDF7;
            color: #336699;
            vertical-align: middle;
        }

        body.mzstyle .champions-table .mz-champion,
        body.mzstyle .u18-ranking-table .mz-first-place {
            background: linear-gradient(to bottom, #FFF7AE 0%, #FFEC80 100%);
            color: #8B7900 !important;
            transition: all 0.3s ease;
        }

        body.mzstyle #wl-data-container .mz-table tbody tr.promotion {
             background: linear-gradient(to bottom, #D8F0FF 0%, #B8E2F8 100%);
             font-weight: bold;
        }
        body.mzstyle #wl-data-container .mz-table tbody tr.relegation {
             background: linear-gradient(to bottom, #FFE8E8 0%, #FFCDD2 100%);
             font-weight: bold;
        }
        body.mzstyle #wl-data-container .mz-table tbody tr.stay {
             background: linear-gradient(to bottom, #E8F5E9 0%, #C8E6C9 100%);
             font-weight: normal;
        }

        body.mzstyle .champions-table .mz-champion:hover,
        body.mzstyle .u18-ranking-table .mz-first-place:hover {
            transform: scale(1.01);
            box-shadow: 0 2px 8px rgba(59,163,208,0.3), inset 0 0 20px rgba(255,255,255,1);
        }

        body.mzstyle .champions-table .mz-champion a,
        body.mzstyle .u18-ranking-table .mz-first-place a {
            color: #8B7900;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        body.mzstyle .champions-table .mz-champion a:hover,
        body.mzstyle .u18-ranking-table .mz-first-place a:hover {
            color: #B8860B;
        }

        body.mzstyle .leftnav li.my-world-mz-extension-li {
            text-align: center;
            background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(240,247,252,0.7) 100%);
            border-radius: 8px;
            margin: 5px 0;
            padding: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        body.mzstyle .leftnav li.my-world-mz-extension-li button {
            display: inline-block;
            margin: 0 auto;
        }

        body.mzstyle .mz-current-cupid {
            background: rgba(216,233,246,0.8);
            padding: 8px 15px;
            border-radius: 8px;
            margin: 10px 0;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
        }

        body.mzstyle .country-champions-section {
            margin-top: 30px;
            padding: 25px;
            background: linear-gradient(135deg, rgba(232,245,253,0.8) 0%, rgba(186,229,247,0.8) 100%);
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9);
        }

        body.mzstyle .country-champions-title {
            color: #1A6796;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            text-shadow: 0 1px 1px rgba(255,255,255,1);
            font-weight: 600;
        }

         body.mzstyle .u18-overall-section {
            margin-top: 30px;
            padding: 25px;
            background: linear-gradient(135deg, rgba(235,250,235,0.8) 0%, rgba(200,230,200,0.8) 100%);
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9);
        }

        body.mzstyle .u18-overall-title {
            color: #2E8B57;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            text-shadow: 0 1px 1px rgba(255,255,255,1);
            font-weight: 600;
        }
    `);

    async function fetchWithRetry(url, options = {}, retries = 3, initialDelay = 1000) {
        let delay = initialDelay;
        const timeout = options.timeout || 15000;

        for (let attempt = 1; attempt <= retries; attempt++) {
            log(`Fetch attempt ${attempt} for ${url}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const fetchOptions = {
                    method: options.method || 'GET',
                    headers: options.headers || {},
                    body: options.body,
                    signal: controller.signal
                };

                const response = await fetch(url, fetchOptions);
                clearTimeout(timeoutId);

                const responseText = await response.text();

                if (response.ok) {
                    log(`Fetch success for ${url} (Status: ${response.status})`);
                    return {
                        ok: true,
                        status: response.status,
                        statusText: response.statusText,
                        text: async () => responseText,
                        json: async () => JSON.parse(responseText)
                    };
                } else {
                    console.error(`${SCRIPT_NAME}: HTTP error! status: ${response.status} for ${url}. Response: ${responseText?.substring(0, 500)}`);
                    if (attempt === retries) {
                        throw new Error(`HTTP error! status: ${response.status} after ${retries} attempts.`);
                    }
                }
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                     console.error(`${SCRIPT_NAME}: Request timed out for ${url}`);
                     if (attempt === retries) {
                         throw new Error(`Request timed out for ${url} after ${retries} attempts.`);
                     }
                } else {
                    console.error(`${SCRIPT_NAME}: Network error during fetch for ${url}:`, error.message || 'Unknown error', error);
                     if (attempt === retries) {
                         throw new Error(`Network error for ${url} after ${retries} attempts: ${error.message || 'Unknown error'}`);
                     }
                }
            }
            console.warn(`${SCRIPT_NAME}: Retrying fetch for ${url} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
        throw new Error(`Fetch failed for ${url} after ${retries} attempts.`);
    }


    function displayLoadingMessage(containerElement) {
        containerElement.innerHTML = `
            <div class='mz-loading-spinner'>
                <div class='mz-spinner'></div>
                <div style='color: #3BA3D0; margin-top: 15px;'>Fetching data...</div>
            </div>
        `;
    }

    function displayErrorMessage(containerElement, message) {
        containerElement.innerHTML = `
            <div class='mz-no-data' style='color: #D32F2F; background: rgba(255,235,238,0.7);'>
                Error: ${message}
            </div>
        `;
    }

    function displayNoDataMessage(containerElement, message = 'No data found.') {
        containerElement.innerHTML = `
            <div class='mz-no-data'>
                ${message}
            </div>
        `;
    }

    class SeasonCupTracker {
        constructor() {
            this.seasonCupModal = null;
            this.seasonCupDataContainer = null;
            this.cupIdDisplayElement = null;
            this.currentSeason = currentSeason;
            this.champions = [];
            this.baseCupId = this.loadBaseCupId();
            this.selectedCountryCode = '';
            this.createUI();
            log('Season Cup Tracker initialized.');
        }

        loadBaseCupId() {
            return GM_getValue(SEASON_CUP_CONSTANTS.STORAGE_KEY_CUP_ID, null);
        }

        saveBaseCupId(id) {
            if (id && !isNaN(id)) {
                GM_setValue(SEASON_CUP_CONSTANTS.STORAGE_KEY_CUP_ID, id);
                this.baseCupId = id;
                log(`Saved Season Cup Base CID: ${id}`);
                if (this.cupIdDisplayElement) {
                    this.cupIdDisplayElement.textContent = `Base CID: ${id}`;
                    this.cupIdDisplayElement.style.display = 'inline-block';
                    this.cupIdDisplayElement.style.fontStyle = 'normal';
                    this.cupIdDisplayElement.style.color = '#336699';
                }
            } else {
                log(`Invalid CID provided for saving: ${id}`);
            }
        }

        async fetchSeasonData(season, countryCode) {
            if (!this.baseCupId) {
                log(`Cannot fetch Season ${season} data: Base CID not set.`);
                return '';
            }
            const isEarlySeason = season <= 6;
            const cupId = isEarlySeason ? this.baseCupId : this.baseCupId + (season - 6);
            const seasonName = isEarlySeason ? 'Season 1-6 Cup' : `Season ${season} Cup`;
            const url = `https://www.managerzone.com/ajax.php?p=cups&sub=playoff&cid=${cupId}&sport=soccer`;
            log(`Fetching Season Cup data for Season ${season} (CID: ${cupId}, URL: ${url})`);

            try {
                const response = await fetchWithRetry(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                return this.processSeasonData(doc, seasonName, cupId, countryCode.toLowerCase(), season);
            } catch (error) {
                console.error(`Failed to fetch season ${season} (CID: ${cupId}):`, error);
                return `<div style='color: red; margin: 10px 0;'>Failed to load data for ${seasonName}. Error: ${error.message}</div>`;
            }
        }

        processSeasonData(doc, seasonName, cupId, targetCountryCode, season) {
            log(`Processing data for Season ${season} (CID: ${cupId})`);
            const finalStandingsTableElement = doc.querySelector('#final_standings');
            if (!finalStandingsTableElement) {
                log(`No final standings table found for Season ${season} (CID: ${cupId}).`);
                return `
                    <h3>
                        <a href='https://www.managerzone.com/?p=cup&sub=info&cid=${cupId}' target='_blank'>
                            ${seasonName}
                        </a>
                    </h3>
                    <div class='mz-no-data' style='font-size: 14px; padding: 15px;'>Playoffs not started or no data available.</div>
                `;
            }

            const rows = finalStandingsTableElement.querySelectorAll('tbody tr');
            let tableHtml = `
                <h3>
                    <a href='https://www.managerzone.com/?p=cup&sub=info&cid=${cupId}' target='_blank'>
                        ${seasonName}
                    </a>
                </h3>
                <table class='mz-table'>
                    <tr class='mz-header'>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Manager</th>
                        <th>Country</th>
                    </tr>
            `;
            let countryTeamsFoundCount = 0;

            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) return;

                const position = cells[0].textContent.trim();
                const managerLinkElement = cells[1].querySelector('a');
                const teamLinkElement = cells[2].querySelector('a');
                const flagImgElement = cells[1].querySelector('img[src^="img/flags/12/"]');

                if (!position || !managerLinkElement || !teamLinkElement || !flagImgElement) return;

                const teamName = teamLinkElement.innerText.trim();
                const username = managerLinkElement.textContent.trim();
                const managerProfileLink = managerLinkElement.href;
                const teamPageLink = teamLinkElement.href;
                const flagSrc = flagImgElement.src;
                const countryMatch = flagSrc.match(/flags\/12\/([a-z]{2})\.png/i);
                const teamCountry = countryMatch ? countryMatch[1].toLowerCase() : '??';

                if (position === '1') {
                    this.champions.push({
                        season: seasonName,
                        name: teamName,
                        manager: username,
                        link: teamPageLink,
                        country: teamCountry,
                        cid: cupId,
                        seasonNum: season
                    });
                    log(`Champion found for Season ${season}: ${teamName} (${teamCountry.toUpperCase()})`);
                }

                if (teamCountry === targetCountryCode) {
                    countryTeamsFoundCount++;
                    const rowHtml = `
                        <tr class='${position === '1' ? 'mz-champion' : ''}'>
                            <td>${position}º</td>
                            <td>
                                <a href='${teamPageLink}' target='_blank'>
                                    ${teamName}
                                </a>
                            </td>
                            <td><a href='${managerProfileLink}' target='_blank'>${username}</a></td>
                            <td>
                                <img src='img/flags/12/${teamCountry}.png' class='the-flag' title='${teamCountry.toUpperCase()}'>
                            </td>
                        </tr>
                    `;
                    tableHtml += rowHtml;
                }
            });

            if (countryTeamsFoundCount === 0) {
                tableHtml += `<tr><td colspan="4" style="text-align: center; font-style: italic;">No teams found from ${targetCountryCode.toUpperCase()} in the final standings.</td></tr>`;
            }
            tableHtml += '</table>';
            return tableHtml;
        }

        async fetchAllSeasons(countryCode) {
            this.selectedCountryCode = countryCode;
            this.seasonCupModal.style.display = 'block';
            displayLoadingMessage(this.seasonCupDataContainer);
            this.champions = [];

            if (!this.baseCupId) {
                log('Cannot fetch all seasons: Base CID not set.');
                displayErrorMessage(this.seasonCupDataContainer, 'Please set the Base Season Cup CID first using the \'Set Base CID\' button.');
                return;
            }
            log(`Fetching all Season Cup data for country: ${countryCode.toUpperCase()}. Base CID: ${this.baseCupId}`);

            const promises = [];
            promises.push(this.fetchSeasonData(6, countryCode));
            for (let season = 7; season <= this.currentSeason; season++) {
                promises.push(this.fetchSeasonData(season, countryCode));
            }

            try {
                const results = await Promise.all(promises);
                const mainContentHtml = results.reverse().join('');
                this.seasonCupDataContainer.innerHTML = mainContentHtml;
                this.buildAndAppendChampionsSections(countryCode);
                log(`Successfully displayed all Season Cup data for ${countryCode.toUpperCase()}.`);
            } catch (error) {
                console.error('Error fetching all season cup data:', error);
                displayErrorMessage(this.seasonCupDataContainer, `Failed to fetch all season data. Error: ${error.message}`);
            }
        }

        buildAndAppendChampionsSections(countryCode) {
            log(`Building champions sections for country: ${countryCode.toUpperCase()}`);
            this.champions.sort((a, b) => b.seasonNum - a.seasonNum);

            const countryChampions = this.champions.filter(champ =>
                                                           champ.country.toLowerCase() === countryCode.toLowerCase()
                                                          );
            log(`Found ${this.champions.length} total champions, ${countryChampions.length} from ${countryCode.toUpperCase()}.`);

            let countryChampionsHtml = '';
            if (countryChampions.length > 0) {
                countryChampionsHtml = `
                    <div class='country-champions-section'>
                        <h2 class='country-champions-title'>🏆 Champions from ${countryCode.toUpperCase()} 🏆</h2>
                        <table class='champions-table'>
                            <tr class='mz-header'><th>Season</th><th>Champion Team</th><th>Manager</th><th>Country</th></tr>
                            ${countryChampions.map(champ => `
                                <tr class='mz-champion'>
                                    <td><a href='https://www.managerzone.com/?p=cup&sub=info&cid=${champ.cid}' target='_blank'>${champ.season}</a></td>
                                    <td><a href='${champ.link}' target='_blank'>${champ.name}</a></td>
                                    <td>${champ.manager}</td>
                                    <td><img src='img/flags/12/${champ.country}.png' class='the-flag' title='${champ.country.toUpperCase()}'></td>
                                </tr>`).join('')}
                        </table>
                    </div>`;
            } else {
                countryChampionsHtml = `
                    <div class='country-champions-section'>
                        <h2 class='country-champions-title'>🏆 Champions from ${countryCode.toUpperCase()} 🏆</h2>
                        <div class='mz-no-data' style='font-size: 16px;'>No champions found for ${countryCode.toUpperCase()}.</div>
                    </div>`;
            }

            let allChampionsHtml = '';
            if (this.champions.length > 0) {
                allChampionsHtml = `
                    <div class='champions-section'>
                        <h2 class='champions-title'>🏆 Hall of Champions (All Season Cups) 🏆</h2>
                        <table class='champions-table'>
                             <tr class='mz-header'><th>Season</th><th>Champion Team</th><th>Manager</th><th>Country</th></tr>
                             ${this.champions.map(champ => `
                                <tr class='mz-champion'>
                                    <td><a href='https://www.managerzone.com/?p=cup&sub=info&cid=${champ.cid}' target='_blank'>${champ.season}</a></td>
                                    <td><a href='${champ.link}' target='_blank'>${champ.name}</a></td>
                                    <td>${champ.manager}</td>
                                    <td><img src='img/flags/12/${champ.country}.png' class='the-flag' title='${champ.country.toUpperCase()}'></td>
                                </tr>`).join('')}
                        </table>
                    </div>`;
            }
            this.seasonCupDataContainer.insertAdjacentHTML('beforeend', countryChampionsHtml + allChampionsHtml);
            log('Champions sections added to the modal.');
        }

        createUI() {
            const button = document.createElement('button');
            button.className = 'mz-btn';
            button.textContent = 'SeasonCups';
            button.onclick = () => {
                log('Season Cup button clicked.');
                if (!this.baseCupId && this.seasonCupDataContainer) {
                    displayErrorMessage(this.seasonCupDataContainer, 'Please set the Base Season Cup CID first using the \'Set Base CID\' button.');
                } else if (this.selectedCountryCode && this.seasonCupDataContainer) {
                } else if (this.seasonCupDataContainer) {
                    this.seasonCupDataContainer.innerHTML = `<div class='mz-no-data'>Select a country and click 'Fetch Season Cups'.</div>`;
                }
                this.seasonCupModal.style.display = 'block';
            };

            const leftNav = document.querySelector('.leftnav');
            if (leftNav) {
                const li = document.createElement('li');
                li.className = 'my-world-mz-extension-li';
                li.appendChild(button);
                leftNav.appendChild(li);
            } else {
                console.error(`${SCRIPT_NAME}: Could not find .leftnav element.`);
                return;
            }

            this.seasonCupModal = document.createElement('div');
            this.seasonCupModal.className = 'mz-modal';
            this.seasonCupModal.id = 'mz-sc-modal';
            this.seasonCupModal.onclick = (e) => {
                if (e.target === this.seasonCupModal) {
                    this.seasonCupModal.style.display = 'none';
                    log('Season Cup modal closed.');
                }
            };

            const modalContent = document.createElement('div');
            modalContent.className = 'mz-modal-content';
            const controlGroup = document.createElement('div');
            controlGroup.className = 'mz-control-group';

            const setCupIdButton = document.createElement('button');
            setCupIdButton.className = 'mz-btn';
            setCupIdButton.textContent = 'Set Base CID';
            setCupIdButton.title = 'Set the Cup ID (CID) for the Season 1-6 Cup';
            setCupIdButton.onclick = () => {
                const value = prompt('Enter the Cup ID (CID) for the Season 1-6 Cup:', this.baseCupId || '');
                if (value !== null) {
                    const trimmedValue = value.trim();
                    if (trimmedValue !== '' && !isNaN(trimmedValue)) {
                        this.saveBaseCupId(parseInt(trimmedValue));
                        if (this.seasonCupDataContainer) this.seasonCupDataContainer.innerHTML = `<div class='mz-no-data'>Base CID set. Select a country and click 'Fetch Season Cups'.</div>`;
                    } else if (trimmedValue !== '') {
                        alert('Invalid CID. Please enter a number.');
                        log(`Invalid CID entered: ${value}`);
                    }
                }
            };

            this.cupIdDisplayElement = document.createElement('div');
            this.cupIdDisplayElement.className = 'mz-current-cupid';
            if (this.baseCupId) {
                this.cupIdDisplayElement.textContent = `Base CID: ${this.baseCupId}`;
                this.cupIdDisplayElement.style.display = 'inline-block';
            } else {
                this.cupIdDisplayElement.textContent = 'Base CID not set';
                this.cupIdDisplayElement.style.fontStyle = 'italic';
                this.cupIdDisplayElement.style.color = '#888';
                this.cupIdDisplayElement.style.display = 'inline-block';
            }

            const countrySelect = document.createElement('select');
            countrySelect.className = 'mz-select';
            const countryOptions = [
                { code: 'br', name: 'Brazil 🇧🇷' }, { code: 'pl', name: 'Poland 🇵🇱' },
                { code: 'se', name: 'Sweden 🇸🇪' }, { code: 'tr', name: 'Turkey 🇹🇷' },
                { code: 'it', name: 'Italy 🇮🇹' }, { code: 'es', name: 'Spain 🇪🇸' },
                { code: 'ar', name: 'Argentina 🇦🇷' }
            ];
            countryOptions.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.code;
                el.textContent = opt.name;
                countrySelect.appendChild(el);
            });
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom…';
            countrySelect.appendChild(customOption);

            const customInput = document.createElement('input');
            customInput.className = 'mz-input';
            customInput.placeholder = 'Country code (e.g., us)';
            customInput.maxLength = 2;
            customInput.style.display = 'none';
            customInput.style.textTransform = 'lowercase';

            countrySelect.onchange = () => {
                customInput.style.display = (countrySelect.value === 'custom') ? 'inline-block' : 'none';
                if (countrySelect.value !== 'custom') customInput.value = '';
            };

            const fetchButton = document.createElement('button');
            fetchButton.className = 'mz-btn';
            fetchButton.textContent = 'Fetch Season Cups';
            fetchButton.onclick = () => {
                if (!this.baseCupId) {
                    alert('Please set the Base Season Cup CID first using the \'Set Base CID\' button.');
                    log('Fetch button clicked but Base CID not set.');
                    return;
                }
                const selectedValue = countrySelect.value;
                let countryCode = '';

                if (selectedValue === 'custom') {
                    countryCode = customInput.value.trim().toLowerCase();
                    if (countryCode.length !== 2 || !/^[a-z]{2}$/.test(countryCode)) {
                        alert('Please enter a valid two-letter lowercase country code.');
                        log(`Invalid custom country code entered: ${customInput.value}`);
                        return;
                    }
                } else {
                    countryCode = selectedValue;
                }

                if (countryCode && countryCode !== 'custom') {
                    this.fetchAllSeasons(countryCode);
                } else if (selectedValue !== 'custom') {
                    alert('Please select a country.');
                    log('Fetch button clicked without selecting a country.');
                }
            };

            this.seasonCupDataContainer = document.createElement('div');
            this.seasonCupDataContainer.id = 'sc-data-container';

            if (!this.baseCupId) {
                displayErrorMessage(this.seasonCupDataContainer, 'Please set the Base Season Cup CID first using the \'Set Base CID\' button.');
            } else {
                this.seasonCupDataContainer.innerHTML = `<div class='mz-no-data'>Select a country and click 'Fetch Season Cups'.</div>`;
            }

            controlGroup.appendChild(setCupIdButton);
            controlGroup.appendChild(countrySelect);
            controlGroup.appendChild(customInput);
            controlGroup.appendChild(fetchButton);

            modalContent.appendChild(controlGroup);
            modalContent.appendChild(this.cupIdDisplayElement);
            modalContent.appendChild(this.seasonCupDataContainer);

            this.seasonCupModal.appendChild(modalContent);
            document.body.appendChild(this.seasonCupModal);
            log('Season Cup UI created.');
        }
    }

    class WorldLeagueTracker {
        constructor() {
            this.worldLeagueModal = null;
            this.worldLeagueResultsContainer = null;
            this.divisionResults = new Map();
            this.allProcessedTeams = [];
            this.countryTeamsData = [];
            this.promotionCandidates = new Map();
            this.relegationCandidates = new Map();
            this.stayCandidates = new Map();
            this.selectedCountryCode = '';
            this.selectedLeagueType = '';
            this.createUI();
            log('World League Tracker initialized.');
        }

        createUI() {
            const button = document.createElement('button');
            button.className = 'mz-btn';
            button.textContent = 'WorldLeague';
            button.onclick = () => {
                log('World League button clicked.');
                if (this.worldLeagueResultsContainer && !this.selectedCountryCode) {
                    this.worldLeagueResultsContainer.innerHTML = `<div class='mz-no-data'>Select league type, country, and click 'Fetch World League'.</div>`;
                }
                this.worldLeagueModal.style.display = 'block';
            };

            const leftNav = document.querySelector('.leftnav');
            if (leftNav) {
                const li = document.createElement('li');
                li.className = 'my-world-mz-extension-li';
                li.appendChild(button);
                leftNav.appendChild(li);
            } else {
                console.error(`${SCRIPT_NAME}: Could not find .leftnav element.`);
                return;
            }

            this.worldLeagueModal = document.createElement('div');
            this.worldLeagueModal.className = 'mz-modal';
            this.worldLeagueModal.id = 'mz-wl-modal';
            this.worldLeagueModal.onclick = (e) => {
                if (e.target === this.worldLeagueModal) {
                    this.worldLeagueModal.style.display = 'none';
                    log('World League modal closed.');
                }
            };

            const modalContent = document.createElement('div');
            modalContent.className = 'mz-modal-content';
            const controls = document.createElement('div');
            controls.className = 'mz-control-group';

            const typeSelectElement = document.createElement('select');
            typeSelectElement.className = 'mz-select';
            ['world', 'u18_world', 'u21_world', 'u23_world'].forEach((type) => {
                const option = document.createElement('option');
                option.value = type;
                const label = type.toUpperCase().replace('_WORLD', '');
                option.textContent = label === 'WORLD' ? 'SENIOR' : label;
                typeSelectElement.appendChild(option);
            });

            const countrySelectElement = document.createElement('select');
            countrySelectElement.className = 'mz-select';
            Object.entries(WORLD_LEAGUE_CONSTANTS.COUNTRY_CODES).forEach(([name, code]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name.charAt(0).toUpperCase() + name.slice(1) + ` (${code.toUpperCase()})`;
                countrySelectElement.appendChild(option);
            });
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom…';
            countrySelectElement.appendChild(customOption);

            const customInputElement = document.createElement('input');
            customInputElement.className = 'mz-input';
            customInputElement.placeholder = 'Enter 2-letter code (e.g., us)';
            customInputElement.style.display = 'none';
            customInputElement.maxLength = 2;
            customInputElement.style.textTransform = 'lowercase';

            countrySelectElement.onchange = () => {
                customInputElement.style.display = (countrySelectElement.value === 'custom') ? 'inline-block' : 'none';
                if (countrySelectElement.value !== 'custom') customInputElement.value = '';
            };

            const fetchButton = document.createElement('button');
            fetchButton.className = 'mz-btn';
            fetchButton.textContent = 'Fetch World League';
            fetchButton.onclick = () => {
                const selectedType = typeSelectElement.value;
                const selectedCountryValue = countrySelectElement.value;
                let countryCode = '';

                if (selectedCountryValue === 'custom') {
                    countryCode = customInputElement.value.trim().toLowerCase();
                    if (countryCode.length !== 2 || !/^[a-z]{2}$/.test(countryCode)) {
                        alert('Please enter a valid two-letter lowercase country code.');
                        log(`Invalid custom country code entered for WL: ${customInputElement.value}`);
                        return;
                    }
                } else {
                    countryCode = selectedCountryValue;
                }

                if (!countryCode || countryCode === 'custom') {
                    alert('Please select a country.');
                    log('WL Fetch button clicked without valid country selection.');
                    return;
                }
                this.fetchAllDivisions(selectedType, countryCode);
            };

            controls.append(typeSelectElement, countrySelectElement, customInputElement, fetchButton);

            this.worldLeagueResultsContainer = document.createElement('div');
            this.worldLeagueResultsContainer.id = 'wl-data-container';
            this.worldLeagueResultsContainer.innerHTML = `<div class='mz-no-data'>Select league type, country, and click 'Fetch World League'.</div>`;

            modalContent.appendChild(controls);
            modalContent.appendChild(this.worldLeagueResultsContainer);
            this.worldLeagueModal.appendChild(modalContent);
            document.body.appendChild(this.worldLeagueModal);
            log('World League UI created.');
        }

        async fetchAllDivisions(leagueType, countryCode) {
            this.selectedCountryCode = countryCode;
            this.selectedLeagueType = leagueType;
            displayLoadingMessage(this.worldLeagueResultsContainer);
            log(`Fetching all WL divisions for type: ${leagueType}, country: ${countryCode.toUpperCase()}`);

            this.divisionResults.clear();
            this.allProcessedTeams = [];
            this.countryTeamsData = [];
            this.promotionCandidates.clear();
            this.relegationCandidates.clear();
            this.stayCandidates.clear();

            const divisionLevels = ['top', 'div1', 'div2', 'div3', 'div4'];
            divisionLevels.forEach(level => {
                this.promotionCandidates.set(level, []);
                this.relegationCandidates.set(level, []);
                this.stayCandidates.set(level, []);
            });

            const maxDivisions = 121;
            const divisionsToFetch = Array.from({ length: maxDivisions }, (_, i) => i + 1);
            log(`Queueing ${divisionsToFetch.length} division fetches (up to SID ${maxDivisions}).`);

            const BATCH_SIZE = 10;
            let fetchResults = [];

            log(`Starting fetches in batches of ${BATCH_SIZE}...`);
            for (let i = 0; i < divisionsToFetch.length; i += BATCH_SIZE) {
                const batchSIDs = divisionsToFetch.slice(i, i + BATCH_SIZE);
                log(`Fetching batch: SIDs ${batchSIDs[0]} to ${batchSIDs[batchSIDs.length - 1]}`);
                const batchPromises = batchSIDs.map(sid => {
                    const url = `https://www.managerzone.com/ajax.php?p=league&type=${leagueType}&sid=${sid}&tid=0&sport=soccer&sub=table`;
                    return new Promise(resolve => setTimeout(resolve, Math.random() * 100))
                        .then(() => this.fetchAndProcessDivision(url, sid, countryCode));
                });

                const batchResults = await Promise.allSettled(batchPromises);
                fetchResults = fetchResults.concat(batchResults);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            try {
                let successfulFetches = 0;
                let failedFetches = 0;
                fetchResults.forEach(result => {
                    if (result.status === 'fulfilled') {
                        successfulFetches++;
                    } else {
                        failedFetches++;
                        console.error('A division fetch failed:', result.reason);
                    }
                });
                log(`Finished fetching divisions: ${successfulFetches} succeeded, ${failedFetches} failed.`);

                if (this.allProcessedTeams.length === 0) {
                    if (failedFetches > 0) {
                        displayErrorMessage(this.worldLeagueResultsContainer, `Failed to fetch any division data. ${failedFetches} requests failed. The service might be unavailable or the league structure changed. Please try again later.`);
                    } else {
                        displayNoDataMessage(this.worldLeagueResultsContainer, `No teams found for ${countryCode.toUpperCase()} in any ${leagueType.toUpperCase().replace('_WORLD','')} World League division. The league might be empty or inactive.`);
                    }
                    return;
                }

                if (this.countryTeamsData.length === 0) {
                    log(`No teams found for country ${countryCode.toUpperCase()}. Displaying empty results.`);
                    displayNoDataMessage(this.worldLeagueResultsContainer, `No teams found for ${countryCode.toUpperCase()} in any ${leagueType.toUpperCase().replace('_WORLD','')} World League division.`);
                    this.processTeamsForPromotionRelegationStay();
                    const promoRelegHtml = this.generatePromotionRelegationSection();
                    this.worldLeagueResultsContainer.innerHTML += promoRelegHtml;
                } else {
                    log(`Found ${this.allProcessedTeams.length} teams total, ${this.countryTeamsData.length} teams for country ${countryCode.toUpperCase()}.`);
                    this.processTeamsForPromotionRelegationStay();
                    this.displayResults();
                }
            } catch (error) {
                console.error('Unexpected error during WL fetch process:', error);
                displayErrorMessage(this.worldLeagueResultsContainer, `An unexpected error occurred: ${error.message}`);
            }
        }

        async fetchAndProcessDivision(url, sid, targetCountryCode) {
            try {
                const response = await fetchWithRetry(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const tableElement = doc.querySelector('table.nice_table');
                if (!tableElement) return;

                const tableBody = tableElement.querySelector('tbody');
                if (!tableBody) return;
                const tableRows = Array.from(tableBody.querySelectorAll('tr'));
                if (!tableRows.length) return;

                const divisionLevel = this.getDivisionLevel(sid);
                const divisionName = this.getDivisionName(sid);
                let countryRowsInDivision = [];
                let teamsFoundInDivisionCount = 0;
                let countryTeamsFoundInDivisionCount = 0;

                for (const rowElement of tableRows) {
                    try {
                        const cells = rowElement.querySelectorAll('td');
                        if (cells.length < 10) continue;

                        const positionCell = cells[0];
                        const position = parseInt(positionCell?.textContent.trim(), 10);
                        if (isNaN(position)) continue;

                        const teamCell = cells[1];
                        if (!teamCell) continue;

                        const flagImgElement = teamCell.querySelector('img[src*="/flags/12/"]');
                        if (!flagImgElement) continue;
                        const flagSrc = flagImgElement.src;
                        const countryMatch = flagSrc.match(/flags\/12\/([a-z]{2})/i);
                        if (!countryMatch) continue;
                        const teamCountry = countryMatch[1].toLowerCase();

                        const teamLinkElement = teamCell.querySelector('a[href*="&tid="]:not([onclick^="purchaseChallenge"])');
                        if (!teamLinkElement) continue;
                        const teamName = teamLinkElement.textContent.trim();
                        if (!teamName) continue;

                        const leagueLinkHref = teamLinkElement.href;
                        const tidMatch = leagueLinkHref.match(/tid=(\d+)/);
                        let teamUrl = leagueLinkHref;
                        if (tidMatch && tidMatch[1]) {
                            teamUrl = `https://www.managerzone.com/?p=team&tid=${tidMatch[1]}`;
                        } else {
                            console.warn(`Could not extract tid for team ${teamName} (SID ${sid}, Pos ${position}) from href: ${leagueLinkHref}. Using league link.`);
                        }

                        const played = parseInt(cells[2]?.textContent.trim() || '0', 10);
                        const wins = parseInt(cells[3]?.textContent.trim() || '0', 10);
                        const draws = parseInt(cells[4]?.textContent.trim() || '0', 10);
                        const losses = parseInt(cells[5]?.textContent.trim() || '0', 10);
                        const goalsFor = parseInt(cells[6]?.textContent.trim() || '0', 10);
                        const goalsAgainst = parseInt(cells[7]?.textContent.trim() || '0', 10);
                        const points = parseInt(cells[9]?.textContent.trim() || '0', 10);

                        let goalDifference = 0;
                        const gdCell = cells[8];
                        if (gdCell) {
                            const nobrElement = gdCell.querySelector('nobr');
                            const gdText = (nobrElement || gdCell).textContent.trim();
                            const gdMatch = gdText.match(/(-?\+?\d+)/);
                            if (gdMatch) {
                                goalDifference = parseInt(gdMatch[1].replace('+', ''), 10);
                            } else {
                                goalDifference = goalsFor - goalsAgainst;
                            }
                            if (isNaN(goalDifference)) {
                                goalDifference = goalsFor - goalsAgainst;
                            }
                        } else {
                            goalDifference = goalsFor - goalsAgainst;
                        }

                        teamsFoundInDivisionCount++;

                        const teamData = {
                            name: teamName, link: teamUrl, position: position, division: divisionName,
                            level: divisionLevel, sid: sid, country: teamCountry, points: points,
                            goalDifference: goalDifference, goalsFor: goalsFor, played: played,
                            wins: wins, draws: draws, losses: losses
                        };
                        this.allProcessedTeams.push(teamData);

                        if (teamCountry === targetCountryCode.toLowerCase()) {
                            countryTeamsFoundInDivisionCount++;
                            this.countryTeamsData.push(teamData);

                            rowElement.querySelectorAll('a.help_button, span.fa-stack.challenge, input[type="hidden"]').forEach(el => el.remove());
                            rowElement.querySelectorAll('td a').forEach(a => {
                                a.style.color = '#3BA3D0';
                                a.target = '_blank';
                                if (a.href.includes('&tid=')) {
                                    const linkTidMatch = a.href.match(/tid=(\d+)/);
                                    if (linkTidMatch && linkTidMatch[1]) {
                                        a.href = `https://www.managerzone.com/?p=team&tid=${linkTidMatch[1]}`;
                                    }
                                }
                            });
                            if (flagImgElement) flagImgElement.title = teamCountry.toUpperCase();

                            if (rowElement.querySelectorAll('td').length >= 10) {
                                countryRowsInDivision.push(rowElement.cloneNode(true));
                            } else {
                                console.warn(`Row for ${teamName} (SID ${sid}) has < 10 cells after cleanup, not adding to display.`);
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing team row in division ${sid}:`, error, rowElement.innerHTML);
                    }
                }

                if (teamsFoundInDivisionCount > 0 || countryTeamsFoundInDivisionCount > 0) {
                    log(`Division ${sid} (${divisionName}): Found ${teamsFoundInDivisionCount} teams total, ${countryTeamsFoundInDivisionCount} teams for ${targetCountryCode.toUpperCase()}`);
                } else if (tableRows.length > 0) {
                }

                if (countryRowsInDivision.length > 0) {
                    this.divisionResults.set(sid, {
                        divisionName: divisionName,
                        rows: countryRowsInDivision
                    });
                }
            } catch (error) {
                console.error(`Error fetching or processing division ${sid} (${url}):`, error);
                this.divisionResults.set(sid, {
                    divisionName: this.getDivisionName(sid),
                    rows: [],
                    error: `Failed to load: ${error.message}`
                });
            }
        }

        getDivisionName(sid) {
            if (sid === 1) return 'Top Series';
            if (sid >= 2 && sid <= 4) return `1.${sid - 1}`;
            if (sid >= 5 && sid <= 13) return `2.${sid - 4}`;
            if (sid >= 14 && sid <= 40) return `3.${sid - 13}`;
            if (sid >= 41 && sid <= 121) return `4.${sid - 40}`;
            return `Unknown Division (${sid})`;
        }

        getDivisionLevel(sid) {
            if (sid === 1) return 'top';
            if (sid >= 2 && sid <= 4) return 'div1';
            if (sid >= 5 && sid <= 13) return 'div2';
            if (sid >= 14 && sid <= 40) return 'div3';
            if (sid >= 41 && sid <= 121) return 'div4';
            return 'unknown';
        }

        processTeamsForPromotionRelegationStay() {
            log('Processing all teams for promotion/relegation/stay determination...');
            if (this.allProcessedTeams.length === 0) {
                log('No teams processed, skipping promotion/relegation/stay calculation.');
                return;
            }

            this.allProcessedTeams.forEach(team => {
                delete team.promoted;
                delete team.relegated;
                delete team.stay;
            });

            for (const list of this.promotionCandidates.values()) { list.length = 0; }
            for (const list of this.relegationCandidates.values()) { list.length = 0; }
            for (const list of this.stayCandidates.values()) { list.length = 0; }

            const promoPositions = [1, 2];
            const relegPositions = [9, 10, 11, 12];
            const stayPositionsTop = [1, 2, 3, 4, 5, 6, 7, 8];
            const stayPositionsDiv1 = [2, 3, 4, 5, 6, 7, 8];
            const stayPositionsDiv2 = [2, 3, 4, 5, 6, 7, 8];

            for (const team of this.allProcessedTeams) {
                const level = team.level;
                if (level === 'unknown') continue;
                if (level === 'top' && stayPositionsTop.includes(team.position)) {
                    team.stay = true;
                    this.stayCandidates.get(level)?.push(team);
                } else if (level === 'div1' && stayPositionsDiv1.includes(team.position)) {
                    team.stay = true;
                    this.stayCandidates.get(level)?.push(team);
                } else if (level === 'div2' && stayPositionsDiv2.includes(team.position)) {
                    team.stay = true;
                    this.stayCandidates.get(level)?.push(team);
                } else if (level !== 'top' && promoPositions.includes(team.position)) {
                    this.promotionCandidates.get(level)?.push(team);
                } else if (level !== 'div4' && relegPositions.includes(team.position)) {
                    this.relegationCandidates.get(level)?.push(team);
                }
            }

            const secondPlacePromotionsNeeded = { div1: 1, div2: 3, div3: 9, div4: 27 };

            for (const [level, teams] of this.promotionCandidates.entries()) {
                if (level === 'top') continue;
                teams.forEach(team => { if (team.position === 1) team.promoted = true; });
                const secondPlaceTeams = teams.filter(team => team.position === 2);
                if (secondPlaceTeams.length > 0) {
                    secondPlaceTeams.sort((a, b) =>
                                          (b.points - a.points) || (b.goalDifference - a.goalDifference) || (b.goalsFor - a.goalsFor)
                                         );
                    const promotionCount = secondPlacePromotionsNeeded[level] || 0;
                    for (let i = 0; i < Math.min(promotionCount, secondPlaceTeams.length); i++) {
                        secondPlaceTeams[i].promoted = true;
                    }
                }
            }

            for (const [level, teams] of this.relegationCandidates.entries()) {
                if (level === 'div4') continue;
                teams.forEach(team => team.relegated = true);
            }
            log('Finished processing promotions/relegations/stay.');
        }

        displayResults() {
            log(`Displaying WL results for ${this.selectedCountryCode.toUpperCase()}. ${this.divisionResults.size} divisions with matching teams or errors.`);

            const divisionsWithRows = Array.from(this.divisionResults.values()).filter(data => data.rows && data.rows.length > 0);
            if (divisionsWithRows.length === 0 && this.countryTeamsData.length === 0) {
                displayNoDataMessage(this.worldLeagueResultsContainer, `No teams found for ${this.selectedCountryCode.toUpperCase()} in any ${this.selectedLeagueType.toUpperCase().replace('_WORLD','')} World League division.`);
                this.worldLeagueResultsContainer.innerHTML += this.generatePromotionRelegationSection();
                return;
            }

            const sortedResults = Array.from(this.divisionResults.entries()).sort(([sidA], [sidB]) => sidA - sidB);
            let resultsHtml = '';
            const leagueTypeName = this.selectedLeagueType.toUpperCase().replace('_WORLD','');

            resultsHtml += `<h2>World League Results (${leagueTypeName} - ${this.selectedCountryCode.toUpperCase()})</h2>`;

            sortedResults.forEach(([sid, data]) => {
                if ((data.rows && data.rows.length > 0) || data.error) {
                    const tableRowsHtml = data.rows?.map(rowElement => {
                        const teamLinkElement = rowElement.querySelector('td:nth-child(2) a[href*="p=team"]');
                        const teamLink = teamLinkElement?.href;
                        const teamData = this.countryTeamsData.find(t => t.link === teamLink && t.sid === sid);

                        let rowClass = '';
                        if (teamData?.promoted) rowClass = 'promotion';
                        else if (teamData?.relegated) rowClass = 'relegation';
                        else if (teamData?.stay) rowClass = 'stay';

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = rowElement.outerHTML.trim();
                        const tr = tempDiv.firstChild;
                        if(tr && tr.tagName === 'TR') {
                            tr.className = rowClass;
                            if (tr.querySelectorAll('td').length >= 10) {
                                return tr.outerHTML;
                            } else {
                                console.warn(`Skipping display row for SID ${sid}: Incorrect cell count after processing. HTML:`, tr.outerHTML);
                                return '';
                            }
                        }
                        console.warn(`Could not parse stored row outerHTML for SID ${sid}: `, rowElement.outerHTML);
                        return '';
                    }).join('') || '';

                    let tableBodyHtml = '';
                    if (data.error) {
                        tableBodyHtml = `<tr><td colspan="10" style='text-align: center; color: red;'>Error loading division: ${data.error}</td></tr>`;
                    } else if (tableRowsHtml) {
                        tableBodyHtml = tableRowsHtml;
                    } else {
                        tableBodyHtml = `<tr><td colspan="10" style="text-align: center; font-style: italic;">No teams from ${this.selectedCountryCode.toUpperCase()} found in this division.</td></tr>`;
                    }

                    const finalHtml = `
                         <h3><a href="https://www.managerzone.com/?p=league&type=${this.selectedLeagueType}&sid=${sid}" target="_blank">${data.divisionName}</a></h3>
                         <table class="mz-table">
                              <thead>
                                   <tr class="mz-header">
                                       <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   ${tableBodyHtml}
                              </tbody>
                         </table>
                    `
                }
            });

            resultsHtml += this.generatePromotionRelegationSection();
            this.worldLeagueResultsContainer.innerHTML = resultsHtml;
            log('WL results displayed.');
        }

        generatePromotionRelegationSection() {
            log(`Generating Promotion/Relegation/Stay section for ${this.selectedCountryCode.toUpperCase()}.`);

            const createTeamRowHtml = (team, status) => {
                let statusClass = '';
                let statusText = '';
                let statusColor = '';
                let details = '';

                if (status === 'promoted') {
                    statusClass = 'promotion';
                    statusText = '↑ Promoted';
                    statusColor = '#3BA3D0';
                    if (team.position === 2) {
                        details = `(Pts: ${team.points}, GD: ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}, GF: ${team.goalsFor})`;
                    }
                } else if (status === 'relegated') {
                    statusClass = 'relegation';
                    statusText = '↓ Relegated';
                    statusColor = '#E57373';
                    details = `(Pts: ${team.points}, GD: ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference})`;
                } else if (status === 'stay') {
                    statusClass = 'stay';
                    statusText = '↔ Stay';
                    statusColor = '#66BB6A';
                    details = `(Pts: ${team.points}, GD: ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference})`;
                }

                return `
                    <tr class='${statusClass}'>
                        <td>${team.division}</td>
                        <td>
                            <a href='${team.link}' target='_blank'>${team.name}</a>
                            <img src='img/flags/12/${team.country}.png' class='the-flag' title='${team.country.toUpperCase()}'>
                        </td>
                        <td style='text-align: center;'>${team.position}º</td>
                        <td>${details}</td>
                        <td style='color: ${statusColor}; font-weight: bold;'>${statusText}</td>
                    </tr>
                `;
            };

            const countryPromotedTeams = this.countryTeamsData.filter(team => team.promoted);
            const countryStayTeams = this.countryTeamsData.filter(team => team.stay);
            const countryRelegatedTeams = this.countryTeamsData.filter(team => team.relegated);
            log(`Found ${countryPromotedTeams.length} promoted, ${countryStayTeams.length} stay, and ${countryRelegatedTeams.length} relegated teams for ${this.selectedCountryCode.toUpperCase()}.`);

            const promoStayTeams = [...countryPromotedTeams, ...countryStayTeams];
            const levelSortOrder = { 'top': 0, 'div1': 1, 'div2': 2, 'div3': 3, 'div4': 4 };
            promoStayTeams.sort((a, b) => {
                const levelA = levelSortOrder[a.level] ?? 99;
                const levelB = levelSortOrder[b.level] ?? 99;
                if (levelA !== levelB) return levelA - levelB;
                if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
                if (a.stay !== b.stay) return a.stay ? -1 : 1;
                if (a.position !== b.position) return a.position - b.position;
                if (a.promoted && a.position === 2 && b.promoted && b.position === 2) {
                    return (b.points - a.points) || (b.goalDifference - a.goalDifference) || (b.goalsFor - a.goalsFor);
                }
                return (b.points - a.points) || (b.goalDifference - a.goalDifference);
            });

            const relegationLevelSortOrder = { 'top': 1, 'div1': 2, 'div2': 3, 'div3': 4 };
            countryRelegatedTeams.sort((a, b) => {
                const levelA = relegationLevelSortOrder[a.level] || 99;
                const levelB = relegationLevelSortOrder[b.level] || 99;
                if (levelA !== levelB) return levelA - levelB;
                return b.position - a.position;
            });

            let sectionHtml = `
                <div class='champions-section'>
                    <h2 class='champions-title'>🔄 League Movements (${this.selectedCountryCode.toUpperCase()}) 🔄</h2>`;

            if (promoStayTeams.length === 0 && countryRelegatedTeams.length === 0) {
                sectionHtml += `<div class='mz-no-data'>No teams from ${this.selectedCountryCode.toUpperCase()} changed status (promoted, relegated, or stayed in top tiers).</div>`;
            } else {
                if (promoStayTeams.length > 0) {
                    sectionHtml += `
                        <h3>Promoted / Staying</h3>
                        <table class='champions-table'>
                            <thead><tr class='mz-header'><th>Division</th><th>Team</th><th style='text-align: center;'>Position</th><th>Details</th><th>Status</th></tr></thead>
                            <tbody>${promoStayTeams.map(team => createTeamRowHtml(team, team.promoted ? 'promoted' : 'stay')).join('')}</tbody>
                        </table>`;
                }
                if (countryRelegatedTeams.length > 0) {
                    sectionHtml += `
                        <h3>Relegated Teams</h3>
                        <table class='champions-table'>
                             <thead><tr class='mz-header'><th>From Division</th><th>Team</th><th style='text-align: center;'>Position</th><th>Details</th><th>Status</th></tr></thead>
                             <tbody>${countryRelegatedTeams.map(team => createTeamRowHtml(team, 'relegated')).join('')}</tbody>
                        </table>`;
                }
            }
            sectionHtml += `</div>`;
            return sectionHtml;
        }
    }

    class U18CupTracker {
        constructor() {
            this.u18CupsModal = null;
            this.u18CupsResultsContainer = null;
            this.allCupResults = [];
            this.selectedCountryCode = '';
            this.cupExceptions = SPECIAL_CUPS;
            this.createUI();
            log('U18 Cup Tracker initialized.');
        }

        isPoolCup(cupName) {
            const poolKeywords = ['pool', 'poule', 'grupo', 'qualifying', 'classificatória'];
            const lowercaseName = cupName.toLowerCase();
            return poolKeywords.some(keyword => lowercaseName.includes(keyword));
        }

        shouldIncludeCup(cupName) {
            if (this.cupExceptions.some(exception => cupName.includes(exception))) return true;
            if (this.isPoolCup(cupName)) return true;
            const nextYear = currentYear + 1;
            return cupName.includes(currentSeason.toString()) || cupName.includes(currentYear.toString()) || cupName.includes(nextYear.toString());
        }

        createUI() {
            const button = document.createElement('button');
            button.className = 'mz-btn';
            button.textContent = 'U18Cups';
            button.onclick = () => {
                log('U18 Cups button clicked.');
                if (this.u18CupsResultsContainer && !this.selectedCountryCode) {
                    this.u18CupsResultsContainer.innerHTML = `<div class='mz-no-data'>Select country/all and click 'Fetch U18 Cups'.</div>`;
                }
                this.u18CupsModal.style.display = 'block';
            };

            const leftNav = document.querySelector('.leftnav');
            if (leftNav) {
                const li = document.createElement('li');
                li.className = 'my-world-mz-extension-li';
                li.appendChild(button);
                leftNav.appendChild(li);
            } else {
                console.error(`${SCRIPT_NAME}: Could not find .leftnav element.`);
                return;
            }

            this.u18CupsModal = document.createElement('div');
            this.u18CupsModal.className = 'mz-modal';
            this.u18CupsModal.id = 'mz-u18-modal';
            this.u18CupsModal.onclick = (e) => {
                if (e.target === this.u18CupsModal) {
                    this.u18CupsModal.style.display = 'none';
                    log('U18 Cups modal closed.');
                }
            };

            const modalContent = document.createElement('div');
            modalContent.className = 'mz-modal-content';
            const controls = document.createElement('div');
            controls.className = 'mz-control-group';

            const countrySelectElement = document.createElement('select');
            countrySelectElement.className = 'mz-select';
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'All Countries 🌍';
            countrySelectElement.appendChild(allOption);
            const defaultOptions = [
                { code: 'br', name: 'Brazil 🇧🇷' }, { code: 'pl', name: 'Poland 🇵🇱' },
                { code: 'se', name: 'Sweden 🇸🇪' }, { code: 'tr', name: 'Turkey 🇹🇷' },
                { code: 'it', name: 'Italy 🇮🇹' }, { code: 'es', name: 'Spain 🇪🇸' },
                { code: 'ar', name: 'Argentina 🇦🇷' }
            ];
            defaultOptions.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.code;
                el.textContent = opt.name;
                countrySelectElement.appendChild(el);
            });
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom…';
            countrySelectElement.appendChild(customOption);

            const customInputElement = document.createElement('input');
            customInputElement.className = 'mz-input';
            customInputElement.placeholder = 'Enter 2-letter code (e.g., us)';
            customInputElement.style.display = 'none';
            customInputElement.maxLength = 2;
            customInputElement.style.textTransform = 'lowercase';

            countrySelectElement.onchange = () => {
                customInputElement.style.display = (countrySelectElement.value === 'custom') ? 'inline-block' : 'none';
                if (countrySelectElement.value !== 'custom') customInputElement.value = '';
            };

            const fetchButton = document.createElement('button');
            fetchButton.className = 'mz-btn';
            fetchButton.textContent = 'Fetch U18 Cups';
            fetchButton.onclick = () => {
                const selectedCountryValue = countrySelectElement.value;
                let countryCode = '';

                if (selectedCountryValue === 'custom') {
                    countryCode = customInputElement.value.trim().toLowerCase();
                    if (countryCode.length !== 2 || !/^[a-z]{2}$/.test(countryCode)) {
                        alert('Please enter a valid two-letter lowercase country code.');
                        log(`Invalid custom country code entered for U18: ${customInputElement.value}`);
                        return;
                    }
                } else {
                    countryCode = selectedCountryValue;
                }

                if (!countryCode) {
                    alert('Please select a country or "All Countries".');
                    log('U18 Fetch button clicked without valid country selection.');
                    return;
                }
                this.fetchAndDisplayU18Data(countryCode);
            };

            controls.append(countrySelectElement, customInputElement, fetchButton);

            this.u18CupsResultsContainer = document.createElement('div');
            this.u18CupsResultsContainer.id = 'u18-data-container';
            this.u18CupsResultsContainer.innerHTML = `<div class='mz-no-data'>Select country/all and click 'Fetch U18 Cups'.</div>`;

            modalContent.appendChild(controls);
            modalContent.appendChild(this.u18CupsResultsContainer);
            this.u18CupsModal.appendChild(modalContent);
            document.body.appendChild(this.u18CupsModal);
            log('U18 Cups UI created.');
        }

        async fetchAndDisplayU18Data(countryCode) {
            this.selectedCountryCode = countryCode;
            displayLoadingMessage(this.u18CupsResultsContainer);
            log(`Starting U18 cup data fetch for country: ${countryCode.toUpperCase()}.`);

            this.allCupResults = [];
            const fetchedCupsMap = new Map();

            try {
                log('Fetching U18 cup lists...');
                const cupSources = [
                    { url: 'https://www.managerzone.com/ajax.php?p=cups&sub=ended&state=joined&type=club&sport=soccer&search_string=u18', type: 'club', limit: 20, name: 'Ended Joined Club' },
                    { url: 'https://www.managerzone.com/ajax.php?p=cups&sub=running&state=all&type=club&sport=soccer&search_string=u18', type: 'club', limit: 20, name: 'Running Club' },
                    { url: 'https://www.managerzone.com/ajax.php?p=cups&sub=ended&state=all&type=partner&sport=soccer&search_string=u18', type: 'partner', limit: 20, name: 'Ended Partner' },
                    { url: 'https://www.managerzone.com/ajax.php?p=cups&sub=running&state=all&type=partner&sport=soccer&search_string=u18', type: 'partner', limit: 10, name: 'Running Partner' },
                    { url: 'https://www.managerzone.com/ajax.php?p=cups&sub=ended&state=all&type=club&sport=soccer&search_string=u18%20generations', type: 'club', limit: 5, name: 'Ended Generations Club' }
                ];

                let countryNameForURL = '';
                if (countryCode !== 'all' && countryCode !== 'custom') {
                    const countryEntry = Object.entries(WORLD_LEAGUE_CONSTANTS.COUNTRY_CODES).find(([name, code]) => code === countryCode);
                    if (countryEntry) {
                        countryNameForURL = countryEntry[0].charAt(0).toUpperCase() + countryEntry[0].slice(1);
                    }
                } else if (countryCode === 'custom') {
                }

                if (countryNameForURL) {
                    const nationalCupSearchString = encodeURIComponent(`u18 - National Cup ${countryNameForURL}`);
                    const nationalCupUrlEnded = `https://www.managerzone.com/ajax.php?p=cups&sub=ended&state=all&type=club&sport=soccer&search_string=${nationalCupSearchString}`;
                    const nationalCupUrlRunning = `https://www.managerzone.com/ajax.php?p=cups&sub=running&state=all&type=club&sport=soccer&search_string=${nationalCupSearchString}`;
                    cupSources.push({ url: nationalCupUrlEnded, type: 'club', limit: 3, name: `Ended National Cup ${countryNameForURL}` });
                    cupSources.push({ url: nationalCupUrlRunning, type: 'club', limit: 3, name: `Running National Cup ${countryNameForURL}` });
                    log(`Added national cup URLs for ${countryNameForURL}`);
                }

                for (const source of cupSources) {
                    log(`Fetching cup list: ${source.name} (Limit: ${source.limit}) from ${source.url}`);
                    try {
                        const response = await fetchWithRetry(source.url);
                        const jsonText = await response.text();
                        this.parseCupListResponse(jsonText, source.type, source.limit, fetchedCupsMap);
                    } catch (error) {
                        console.warn(`Failed to fetch/parse cup list from ${source.name}:`, error);
                    }
                }


                if (fetchedCupsMap.size === 0) {
                    log('No U18 cups found from any source matching criteria.');
                    displayNoDataMessage(this.u18CupsResultsContainer, 'No relevant U18 cups found to analyze (Current Season/Year or Exceptions).');
                    return;
                }
                log(`Found ${fetchedCupsMap.size} unique relevant U18 cups to check playoffs for.`);

                log('Fetching playoff data for each cup...');
                const BATCH_SIZE = 10;
                const cupEntries = Array.from(fetchedCupsMap.entries());
                let playoffResults = [];

                for(let i = 0; i < cupEntries.length; i += BATCH_SIZE) {
                    const batch = cupEntries.slice(i, i + BATCH_SIZE);
                    log(`Fetching playoff batch: ${i+1} to ${i + batch.length} of ${cupEntries.length}`);
                    const playoffPromises = batch.map(([cid, cupInfo]) => {
                        const playoffUrl = cupInfo.type === 'partner'
                        ? `https://www.managerzone.com/ajax.php?p=cups&sub=playoff&cid=${cid}&cuptype=partner&cuptype=user&sport=soccer`
                        : `https://www.managerzone.com/ajax.php?p=cups&sub=playoff&cid=${cid}&sport=soccer`;

                        return new Promise(resolve => setTimeout(resolve, Math.random() * 50))
                            .then(() => fetchWithRetry(playoffUrl))
                            .then(response => response.text())
                            .then(html => ({ cid, cupName: cupInfo.name, cupType: cupInfo.type, html }))
                            .catch(error => {
                            console.warn(`Failed to fetch playoff for CID ${cid} (${cupInfo.name}):`, error.message);
                            return { cid, cupName: cupInfo.name, cupType: cupInfo.type, html: null, error: `Fetch failed: ${error.message}` };
                        });
                    });
                    const batchResults = await Promise.all(playoffPromises);
                    playoffResults = playoffResults.concat(batchResults);
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                log('Finished fetching playoff data.');
                log('Processing playoff data...');
                playoffResults.forEach(result => {
                    if (result.html && !result.error) {
                        this.parsePlayoffResponse(result.cid, result.cupName, result.cupType, result.html);
                    } else if (result.error) {
                        this.allCupResults.push({
                            cid: result.cid, cupName: result.cupName, cupType: result.cupType,
                            isPool: this.isPoolCup(result.cupName), teams: [], error: result.error
                        });
                        log(`Stored error state for CID ${result.cid} (${result.cupName}): ${result.error}`);
                    } else {
                        this.allCupResults.push({
                            cid: result.cid, cupName: result.cupName, cupType: result.cupType,
                            isPool: this.isPoolCup(result.cupName), teams: [], error: 'Received empty playoff data.'
                        });
                        log(`Stored empty data state for CID ${result.cid} (${result.cupName}).`);
                    }
                });
                this.displayResults();
            } catch (error) {
                console.error('Error in fetchAndDisplayU18Data:', error);
                displayErrorMessage(this.u18CupsResultsContainer, `An unexpected error occurred: ${error.message}`);
            }
        }

        parseCupListResponse(jsonText, cupType, limit, cupMap) {
            let data;
            try {
                data = JSON.parse(jsonText);
            } catch (parseError) {
                console.error(`Error parsing JSON for cup list type ${cupType}:`, parseError, jsonText.substring(0, 300));
                return;
            }

            try {
                if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'string') {
                    log(`Invalid or empty JSON structure received for cup list type ${cupType}. JSON: ${JSON.stringify(data)?.substring(0,100)}`);
                    return;
                }

                const htmlString = data[0]
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\&/g, '&')
                .replace(/\\</g, '<')
                .replace(/\\>/g, '>')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const links = doc.querySelectorAll('a[href*="p=cup"][href*="cid="], a[href*="p=private_cup"][href*="cid="]');
                let count = 0;

                for (const link of links) {
                    if (count >= limit) break;
                    const href = link.getAttribute('href');
                    const cidMatch = href?.match(/cid=(\d+)/);
                    const name = link.textContent?.replace(/\s+/g, ' ').trim();

                    if (cidMatch && name && name.length > 0) {
                        const cid = cidMatch[1];
                        if (name.includes('U18 Season') || name.includes('Season Cup')) {
                            continue;
                        }
                        if (!this.shouldIncludeCup(name)) {
                            continue;
                        }
                        if (!cupMap.has(cid)) {
                            cupMap.set(cid, { name: name, type: cupType });
                            count++;
                        }
                    }
                }
                log(`Finished parsing list for type ${cupType}. Added ${count} new relevant cups.`);
            } catch (error) {
                console.error(`Error processing parsed HTML for cup list type ${cupType}:`, error);
            }
        }


        parsePlayoffResponse(cid, cupName, cupType, html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const finalStandingsTableElement = doc.querySelector('#final_standings');
            const cupResult = {
                cid: cid, cupName: cupName, cupType: cupType,
                isPool: this.isPoolCup(cupName), teams: []
            };

            if (!finalStandingsTableElement) {
                const noPlayoffsMessage = doc.body.textContent.match(/playoffs have not started/i) || doc.body.textContent.match(/final standings are not available/i);
                if (noPlayoffsMessage) {
                    cupResult.error = 'Playoffs not started or final standings unavailable.';
                } else {
                     const cupNotFinishedMessage = doc.body.textContent.match(/Cup is not finished yet/i);
                     if (cupNotFinishedMessage) {
                         cupResult.error = 'Cup is not finished yet.';
                     } else {
                        cupResult.error = 'Final standings table not found.';
                     }
                }
                this.allCupResults.push(cupResult);
                return;
            }

            const tableBody = finalStandingsTableElement.querySelector('tbody');
            if (!tableBody) {
                cupResult.error = 'Final standings table found, but no tbody inside.';
                log(`No tbody found inside #final_standings for CID ${cid}.`);
                this.allCupResults.push(cupResult);
                return;
            }

            const rows = tableBody.querySelectorAll('tr');
            let teamsProcessedCount = 0;
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) return;

                const positionStr = cells[0]?.textContent.trim().replace('º','');
                const position = parseInt(positionStr, 10);
                if (isNaN(position)) return;

                const managerCell = cells[1];
                const teamCell = cells[2];
                if (!managerCell || !teamCell) return;

                const managerLinkElement = managerCell.querySelector('a');
                const teamLinkElement = teamCell.querySelector('a');
                const flagImgElement = managerCell.querySelector('img[src*="/flags/12/"]');
                if (!managerLinkElement || !teamLinkElement || !flagImgElement) return;

                const managerName = managerLinkElement.textContent.trim();
                const teamName = teamLinkElement.innerText.trim();
                const teamPageLink = teamLinkElement.href;
                const flagSrc = flagImgElement.src;
                const countryMatch = flagSrc.match(/flags\/12\/([a-z]{2})/i);
                const countryCode = countryMatch ? countryMatch[1].toLowerCase() : '??';

                if (teamName && teamPageLink && countryCode !== '??') {
                    cupResult.teams.push({
                        position: position, name: teamName, manager: managerName,
                        link: teamPageLink, country: countryCode
                    });
                    teamsProcessedCount++;
                }
            });
            this.allCupResults.push(cupResult);
        }

        displayResults() {
            log(`Displaying U18 cup results for: ${this.selectedCountryCode.toUpperCase()}`);
            this.allCupResults.sort((a, b) => {
                if (a.isPool !== b.isPool) return a.isPool ? 1 : -1;
                const yearA = a.cupName.match(/\b(20\d{2})\b/);
                const yearB = b.cupName.match(/\b(20\d{2})\b/);
                if (yearA && yearB && yearA[1] !== yearB[1]) {
                    return parseInt(yearB[1], 10) - parseInt(yearA[1], 10);
                }
                const seasonA = a.cupName.match(/\bSeason (\d+)\b/i);
                const seasonB = b.cupName.match(/\bSeason (\d+)\b/i);
                if (seasonA && seasonB && seasonA[1] !== seasonB[1]) {
                    return parseInt(seasonB[1], 10) - parseInt(seasonA[1], 10);
                }
                return b.cupName.localeCompare(a.cupName);
            });

            let resultsHtml = this.generateCupSectionsHTML();
            resultsHtml += this.generateRankingHTML();
            if (this.selectedCountryCode !== 'all') {
                resultsHtml += this.generateOverallPerformanceHTML();
            }

            if (!resultsHtml.trim() || this.allCupResults.length === 0) {
                displayNoDataMessage(this.u18CupsResultsContainer, `No U18 cup data found matching the selected criteria (${this.selectedCountryCode.toUpperCase()}).`);
            } else {
                this.u18CupsResultsContainer.innerHTML = resultsHtml;
            }
            log('U18 results displayed.');
        }

        generateCupSectionHTML(cup) {
            const cupLink = `https://www.managerzone.com/?p=${cup.cupType === 'partner' ? 'private_cup' : 'cup'}&sub=info&cid=${cup.cid}`;
            let tableContentHtml = '';
            let teamsInThisCupCount = 0;
            let hasRelevantTeams = false;
            let errorMessage = cup.error;

            if (errorMessage === 'Final standings table not found.') {
                 errorMessage = 'This cup has not finished yet.';
            }

            if (cup.teams && cup.teams.length > 0) {
                cup.teams.forEach(team => {
                    if (this.selectedCountryCode === 'all' || team.country === this.selectedCountryCode) {
                        hasRelevantTeams = true;
                        teamsInThisCupCount++;
                        const positionClass = this.getPositionClass(team.position);
                        tableContentHtml += `
                            <tr class='${positionClass}'>
                                <td>${team.position}º</td>
                                <td><a href='${team.link}' target='_blank'>${team.name}</a></td>
                                <td>${team.manager}</td>
                                <td><img src='img/flags/12/${team.country}.png' class='the-flag' title='${team.country.toUpperCase()}'></td>
                            </tr>`;
                    }
                });
            }

            let shouldDisplayCup = false;
            if (errorMessage) {
                shouldDisplayCup = true;
                tableContentHtml = `<div class='mz-no-data' style='font-size: 14px; padding: 15px; color: #aaa;'>Status: ${errorMessage}</div>`;
            } else if (cup.teams.length === 0) {
                shouldDisplayCup = true;
                tableContentHtml = `<div class='mz-no-data' style='font-size: 14px; padding: 15px;'>No final standings available yet.</div>`;
            } else if (this.selectedCountryCode === 'all' && cup.teams.length > 0) {
                shouldDisplayCup = true;
            } else if (this.selectedCountryCode !== 'all' && hasRelevantTeams) {
                shouldDisplayCup = true;
            } else if (this.selectedCountryCode !== 'all' && !hasRelevantTeams && cup.teams.length > 0) {
                shouldDisplayCup = true;
                tableContentHtml = `<tr><td colspan="4" style="text-align: center; font-style: italic;">No teams from ${this.selectedCountryCode.toUpperCase()} found in the final standings.</td></tr>`;
            }

            if (shouldDisplayCup) {
                const poolIndicator = cup.isPool ? `<span style="color:#888;font-style:italic;font-size:0.8em;"> (Pool)</span>` : '';
                const cupTitle = `<a href='${cupLink}' target='_blank'>${cup.cupName}</a> (CID: ${cup.cid})${poolIndicator}`;

                return `
                    <div>
                        <h3>${cupTitle}</h3>
                        ${(errorMessage || (cup.teams.length === 0 && !cup.error)) ? tableContentHtml : `
                        <table class='mz-table'>
                            <tr class='mz-header'><th>Pos</th><th>Team</th><th>Manager</th><th>Country</th></tr>
                            <tbody>${tableContentHtml}</tbody>
                        </table>`}
                    </div>`;
            }
            return '';
        }

        generateCupSectionsHTML() {
            log('Generating HTML for U18 cup sections...');
            let mainCupsHtml = '';
            let poolCupsHtml = '';
            let mainCupsDisplayedCount = 0;
            let poolCupsDisplayedCount = 0;

            const mainCups = this.allCupResults.filter(cup => !cup.isPool);
            const poolCups = this.allCupResults.filter(cup => cup.isPool);

            mainCups.forEach(cup => {
                 const cupHtml = this.generateCupSectionHTML(cup);
                 if (cupHtml) {
                     mainCupsHtml += cupHtml;
                     mainCupsDisplayedCount++;
                 }
            });

            poolCups.forEach(cup => {
                const cupHtml = this.generateCupSectionHTML(cup);
                 if (cupHtml) {
                     poolCupsHtml += cupHtml;
                     poolCupsDisplayedCount++;
                 }
            });

            let sectionHtml = mainCupsHtml;

            if (poolCupsDisplayedCount > 0) {
                sectionHtml += `
                    <div style="margin-top: 20px; margin-bottom: 10px;">
                         <button class="mz-btn" style="font-size: 12px;"
                                 onclick="var section = document.getElementById('u18-pool-cups-section'); var btn = this; if (section.style.display === 'none') { section.style.display = 'block'; btn.textContent = 'Hide Pool Cups (${poolCupsDisplayedCount})'; } else { section.style.display = 'none'; btn.textContent = 'Show Pool Cups (${poolCupsDisplayedCount})'; }">
                             Show Pool Cups (${poolCupsDisplayedCount})
                         </button>
                    </div>
                    <div id="u18-pool-cups-section" style="display: none; border-left: 3px solid #87B5EB; padding-left: 15px; margin-top: 10px;">
                        <h3 style="color: #87B5EB; border-color: #87B5EB;">Pool/Qualifying Cups</h3>
                        ${poolCupsHtml}
                    </div>
                `;
            }

            if (mainCupsDisplayedCount === 0 && poolCupsDisplayedCount === 0) {
                 log('No U18 cups met display criteria.');
                 return `<div class='mz-no-data'>No U18 cups found matching the filter criteria (Country: ${this.selectedCountryCode.toUpperCase()}, Season/Year/Exceptions).</div>`;
            }

            log(`Generated HTML for ${mainCupsDisplayedCount} main U18 cup sections and ${poolCupsDisplayedCount} pool cup sections.`);
            return sectionHtml;
        }

        generateOverallPerformanceHTML() {
            if (this.selectedCountryCode === 'all') return '';
            log(`Generating overall performance section for ${this.selectedCountryCode.toUpperCase()}.`);

            let allPerformances = [];
            this.allCupResults.forEach(cup => {
                if (cup.teams && cup.teams.length > 0 && !cup.error) {
                    cup.teams.forEach(team => {
                        if (team.country === this.selectedCountryCode) {
                            allPerformances.push({
                                ...team,
                                cupName: cup.cupName,
                                cid: cup.cid,
                                isPool: cup.isPool || false,
                                cupType: cup.cupType
                            });
                        }
                    });
                }
            });

            if (allPerformances.length === 0) {
                log(`No finished performances found for ${this.selectedCountryCode.toUpperCase()}.`);
                return `
                     <div class='u18-overall-section'>
                         <h2 class='u18-overall-title'>📈 Overall Performance (${this.selectedCountryCode.toUpperCase()}) 📈</h2>
                         <div class='mz-no-data'>No finishes found for ${this.selectedCountryCode.toUpperCase()} in the analyzed finished cups.</div>
                     </div>`;
            }

            allPerformances.sort((a, b) =>
                                 (a.position - b.position) ||
                                 (a.isPool === b.isPool ? 0 : a.isPool ? 1 : -1) ||
                                 b.cupName.localeCompare(a.cupName)
                                );
            log(`Found ${allPerformances.length} performances for ${this.selectedCountryCode.toUpperCase()}, sorted.`);

            const html = `
                <div class='u18-overall-section'>
                    <h2 class='u18-overall-title'>📈 Overall Performance (${this.selectedCountryCode.toUpperCase()}) 📈</h2>
                    <p style="text-align: center; font-style: italic; margin-bottom: 15px;">All finishes by teams from ${this.selectedCountryCode.toUpperCase()} in analyzed cups, ordered by best position.</p>
                    <table class='mz-table'>
                         <thead><tr class='mz-header'><th>Pos</th><th>Team</th><th>Manager</th><th>Cup</th><th>Type</th></tr></thead>
                        <tbody>
                        ${allPerformances.map(perf => {
                            const positionClass = this.getPositionClass(perf.position);
                            const cupLink = `https://www.managerzone.com/?p=${perf.cupType === 'partner' ? 'private_cup' : 'cup'}&sub=info&cid=${perf.cid}`;
                            const cupTypeHtml = perf.isPool ? '<span style="color:#888;font-style:italic;">Pool</span>' : '<span style="color:#336699;font-weight:bold;">Main</span>';
                            return `
                            <tr class='${positionClass}'>
                                <td>${perf.position}º</td>
                                <td><a href='${perf.link}' target='_blank'>${perf.name}</a></td>
                                <td>${perf.manager}</td>
                                <td><a href='${cupLink}' target='_blank' title='${perf.cupName}'>${perf.cupName.length > 40 ? perf.cupName.substring(0, 37) + '...' : perf.cupName}</a></td>
                                <td>${cupTypeHtml}</td>
                            </tr>`;
                        }).join('')}
                        </tbody>
                    </table>
                </div>`;
            log('Generated overall performance HTML.');
            return html;
        }

        generateRankingHTML() {
            log(`Generating ranking section for country: ${this.selectedCountryCode.toUpperCase()}.`);
            const teamPointsMap = new Map();

            this.allCupResults.forEach(cup => {
                if (this.selectedCountryCode === 'all' && cup.cupName.toLowerCase().includes('national cup')) {
                    return;
                }
                if (cup.teams && cup.teams.length > 0 && !cup.error && !cup.isPool) {
                    cup.teams.forEach(team => {
                        if (this.selectedCountryCode === 'all' || team.country === this.selectedCountryCode) {
                            const points = this.getPointsForPosition(team.position);
                            if (points > 0) {
                                const teamId = team.link;
                                if (!teamPointsMap.has(teamId)) {
                                    teamPointsMap.set(teamId, { name: team.name, country: team.country, link: team.link, points: 0, finishes: [] });
                                }
                                const teamData = teamPointsMap.get(teamId);
                                teamData.points += points;
                                teamData.finishes.push({ cup: cup.cupName, pos: team.position, cid: cup.cid, cupType: cup.cupType });
                            }
                        }
                    });
                }
            });

            const rankedTeams = Array.from(teamPointsMap.values()).sort((a, b) => b.points - a.points);
            const countryHeader = this.selectedCountryCode === 'all' ? '<th>Country</th>' : '';
            const rankingTitleCountry = this.selectedCountryCode === 'all' ? 'All Countries' : this.selectedCountryCode.toUpperCase();
            const sectionTitle = `🏆 U18 Cup Ranking (${rankingTitleCountry}) 🏆`;

            let rankingTableHtml = '';
            if (rankedTeams.length === 0) {
                log('No teams earned ranking points.');
                rankingTableHtml = `<div class='mz-no-data'>No teams finished in the Top 10 in non-pool cups to earn ranking points.</div>`;
            } else {
                log(`Calculated points for ${rankedTeams.length} teams.`);
                rankingTableHtml = `
                     <p style="text-align: center; font-style: italic; margin-bottom: 15px;">Ranking based on points awarded for Top 10 finishes in non-pool cups (1st=25...10th=1).</p>
                     <table class='u18-ranking-table'>
                         <thead><tr class='mz-header'><th>Rank</th><th>Team</th>${countryHeader}<th>Points</th><th style="width: 40%;">Top Finishes (Cup: Pos)</th></tr></thead>
                         <tbody>
                         ${rankedTeams.map((team, index) => {
                    const topFinishesHtml = team.finishes
                    .sort((a, b) => a.pos - b.pos)
                    .slice(0, 5)
                    .map(f => `<a href="https://www.managerzone.com/?p=${f.cupType === 'partner' ? 'private_cup' : 'cup'}&sub=info&cid=${f.cid}" target="_blank" title="${f.cup}">${f.cup.length > 30 ? f.cup.substring(0, 27)+'...' : f.cup}</a>: ${f.pos}º`)
                    .join('<br>');
                    const rankClass = this.getPositionClass(index + 1);
                    const countryCell = this.selectedCountryCode === 'all' ? `<td><img src='img/flags/12/${team.country}.png' class='the-flag' title='${team.country.toUpperCase()}'></td>` : '';
                    return `
                                 <tr class="${rankClass}">
                                     <td style="text-align: center;">${index + 1}</td>
                                     <td><a href="${team.link}" target="_blank">${team.name}</a></td>
                                     ${countryCell}
                                     <td style="font-weight: bold; text-align: center;">${team.points}</td>
                                     <td style="font-size: 11px; line-height: 1.4;">${topFinishesHtml}${team.finishes.length > 5 ? '<br>...' : ''}</td>
                                 </tr>`;
                }).join('')}
                         </tbody>
                     </table>`;
            }

            const html = `
                 <div class='u18-ranking-section'>
                     <h2 class='u18-ranking-title'>${sectionTitle}</h2>
                     ${rankingTableHtml}
                 </div>`;
            log('Generated ranking HTML.');
            return html;
        }

        getPointsForPosition(position) {
            if (position === 1) return 25;
            if (position === 2) return 18;
            if (position === 3) return 15;
            if (position === 4) return 12;
            if (position === 5) return 10;
            if (position === 6) return 8;
            if (position === 7) return 6;
            if (position === 8) return 4;
            if (position === 9) return 2;
            if (position === 10) return 1;
            return 0;
        }

        getPositionClass(position) {
            if (position === 1) return 'mz-first-place';
            if (position === 2) return 'mz-second-place';
            if (position === 3) return 'mz-third-place';
            return '';
        }
    }

    try {
        new SeasonCupTracker(); new WorldLeagueTracker(); new U18CupTracker();
        log('All trackers initialized successfully.');
    } catch (error) {
        console.error(`${SCRIPT_NAME}: Error initializing trackers:`, error);
        alert(`Failed to initialize ${SCRIPT_NAME} components. Check console for details.`);
    }
})();
