// ==UserScript==
// @name          MZ - Transfer Market/Rare Countries
// @namespace     douglaskampl
// @version       1.9.2
// @description   Monitors the transfer market for players from a specific country and clicks age 19 button on specific search page
// @author        Douglas
// @match         https://www.managerzone.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/528086/MZ%20-%20Transfer%20MarketRare%20Countries.user.js
// @updateURL https://update.greasyfork.org/scripts/528086/MZ%20-%20Transfer%20MarketRare%20Countries.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        :root {
            --dk-bg-dark: #120c1e;
            --dk-bg-medium: #23193b;
            --dk-bg-light: #3e2c6b;
            --dk-text-primary: #e8e0ff;
            --dk-text-secondary: #a094c0;
            --dk-accent-primary: #00f6ff;
            --dk-accent-secondary: #ff00ff;
            --dk-border-color: #5a4888;
            --dk-font: 'Segoe UI', 'Roboto', sans-serif;
            --dk-glow-primary: rgba(0, 246, 255, 0.7);
            --dk-glow-secondary: rgba(255, 0, 255, 0.6);
        }

        #country-monitor-wrapper {
            display: inline-flex;
            align-items: center;
            margin-left: 10px;
            position: relative;
            font-family: var(--dk-font);
            background-color: var(--dk-bg-medium);
            padding: 4px 8px;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0,0,0,0.2);
            border: 1px solid var(--dk-border-color);
            vertical-align: middle;
        }
        #country-monitor-flag {
            width: 20px;
            height: 15px;
            object-fit: cover;
            vertical-align: middle;
            border: 1px solid var(--dk-border-color);
            border-radius: 3px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
            box-shadow: 0 0 3px rgba(0,0,0,0.4);
            flex-shrink: 0;
        }
        #country-monitor-flag:hover {
            transform: scale(1.15);
            box-shadow: 0 0 10px var(--dk-glow-primary);
        }
        #country-monitor-name {
            margin-left: 6px;
            font-size: 12px;
            color: var(--dk-text-primary);
            font-weight: 500;
            text-shadow: 0 0 3px rgba(0,0,0,0.5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
            flex-shrink: 1;
        }
        #rare-finder-btn {
            margin-left: 8px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(145deg, var(--dk-accent-primary), #00c4cc);
            color: var(--dk-bg-dark);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
            text-shadow: 0 0 5px var(--dk-glow-primary);
            flex-shrink: 0;
        }
        #rare-finder-btn:hover {
            background: linear-gradient(145deg, #33ffff, var(--dk-accent-primary));
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 0 12px var(--dk-glow-primary), 0 2px 5px rgba(0,0,0,0.5);
        }
        #rare-finder-btn.scanning {
             opacity: 0.6;
             cursor: default;
             animation: pulse 1.5s infinite ease-in-out;
        }
         @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 5px var(--dk-glow-primary);}
            50% { transform: scale(1.05); box-shadow: 0 0 15px var(--dk-glow-primary); }
            100% { transform: scale(1); box-shadow: 0 0 5px var(--dk-glow-primary);}
        }

        #search-status {
            margin-left: 8px;
            font-size: 11px;
            color: var(--dk-text-secondary);
            font-style: italic;
            white-space: nowrap;
            cursor: default;
            flex-shrink: 0;
        }
         #search-status.has-results {
             cursor: pointer;
             color: var(--dk-accent-primary);
             text-decoration: underline;
             text-decoration-style: dotted;
         }
          #search-status.has-results:hover {
              color: #64ffff;
              text-shadow: 0 0 5px var(--dk-glow-primary);
          }

        #country-selector, #rare-scan-results-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            z-index: 10000;
            background: var(--dk-bg-dark);
            color: var(--dk-text-primary);
            border: 1px solid var(--dk-accent-primary);
            border-radius: 8px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5), 0 0 15px var(--dk-glow-primary) inset;
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            padding: 12px;
            display: none;
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
            transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: var(--dk-font);
        }
        #country-selector.visible, #rare-scan-results-dropdown.visible {
            display: block;
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        #country-selector::-webkit-scrollbar, #rare-scan-results-dropdown::-webkit-scrollbar {
            width: 6px;
        }
        #country-selector::-webkit-scrollbar-track, #rare-scan-results-dropdown::-webkit-scrollbar-track {
            background: var(--dk-bg-medium);
            border-radius: 3px;
        }
        #country-selector::-webkit-scrollbar-thumb, #rare-scan-results-dropdown::-webkit-scrollbar-thumb {
            background: var(--dk-accent-primary);
            border-radius: 3px;
            border: 1px solid var(--dk-bg-medium);
        }
        #country-selector::-webkit-scrollbar-thumb:hover, #rare-scan-results-dropdown::-webkit-scrollbar-thumb:hover {
            background: #64ffff;
            box-shadow: 0 0 5px var(--dk-glow-primary);
        }
        #country-search {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 10px;
            border: 1px solid var(--dk-border-color);
            background-color: var(--dk-bg-medium);
            color: var(--dk-text-primary);
            border-radius: 5px;
            font-size: 13px;
            box-sizing: border-box;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        #country-search::placeholder {
            color: var(--dk-text-secondary);
            opacity: 0.7;
        }
        #country-search:focus {
            outline: none;
            border-color: var(--dk-accent-primary);
            box-shadow: 0 0 10px var(--dk-glow-primary);
            background-color: var(--dk-bg-light);
        }
        .country-option, .rare-result-option {
            display: flex;
            align-items: center;
            padding: 6px 10px;
            cursor: pointer;
            border-radius: 5px;
            color: var(--dk-text-primary);
            margin-bottom: 3px;
            transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
            border: 1px solid transparent;
        }
        .country-option:hover, .rare-result-option:hover {
            background: var(--dk-bg-light);
            transform: translateX(3px);
            border-color: var(--dk-border-color);
        }
        .country-option img, .rare-result-option img {
            width: 20px;
            height: 14px;
            margin-right: 10px;
            object-fit: cover;
            border: 1px solid var(--dk-border-color);
            border-radius: 3px;
             flex-shrink: 0;
        }
         .country-option span, .rare-result-option .rare-name {
            font-size: 13px;
            flex-grow: 1;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
         }
         .rare-result-option .rare-count {
             font-size: 11px;
             font-weight: bold;
             color: var(--dk-accent-secondary);
             margin-left: 8px;
             text-shadow: 0 0 4px var(--dk-glow-secondary);
             flex-shrink: 0;
         }
        .country-option.selected {
            background: linear-gradient(90deg, var(--dk-accent-primary), var(--dk-accent-secondary));
            color: var(--dk-bg-dark);
            font-weight: 600;
            border-color: transparent;
            box-shadow: 0 0 8px var(--dk-glow-secondary);
        }
         .country-option.selected:hover {
             background: linear-gradient(90deg, #33ffff, #ff33ff);
             transform: translateX(0);
         }

        #dk-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 12, 30, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px) saturate(150%);
            pointer-events: none;
        }
        #dk-modal-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        #dk-modal-content {
            background: var(--dk-bg-dark);
            color: var(--dk-text-primary);
            padding: 20px 25px;
            border-radius: 10px;
            width: 90%;
            max-width: 420px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px var(--dk-glow-primary);
            border: 1px solid var(--dk-accent-primary);
            font-family: var(--dk-font);
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
            opacity: 0;
        }
         #dk-modal-overlay.visible #dk-modal-content {
             transform: scale(1) translateY(0);
             opacity: 1;
         }
        #dk-modal-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--dk-accent-primary);
            border-bottom: 1px solid var(--dk-border-color);
            padding-bottom: 8px;
            text-shadow: 0 0 8px var(--dk-glow-primary);
        }
        #dk-modal-body {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
            max-height: 55vh;
            overflow-y: auto;
            color: var(--dk-text-secondary);
            padding-right: 5px;
        }
         #dk-modal-body p {
             margin: 0 0 8px 0;
              color: var(--dk-text-primary);
         }
         #dk-modal-body strong {
             color: var(--dk-accent-secondary);
             font-weight: 600;
         }
        #dk-modal-body::-webkit-scrollbar {
            width: 5px;
        }
        #dk-modal-body::-webkit-scrollbar-track {
            background: var(--dk-bg-medium);
            border-radius: 2px;
        }
        #dk-modal-body::-webkit-scrollbar-thumb {
            background: var(--dk-accent-secondary);
            border-radius: 2px;
        }
         #dk-modal-body::-webkit-scrollbar-thumb:hover {
             background: #ff33ff;
             box-shadow: 0 0 5px var(--dk-glow-secondary);
         }
        #dk-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        .dk-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
             box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .dk-modal-btn:active {
            transform: scale(0.96);
             box-shadow: 0 0 1px rgba(0,0,0,0.2);
        }
        .dk-modal-btn-confirm {
            background: linear-gradient(145deg, var(--dk-accent-primary), #00c4cc);
            color: var(--dk-bg-dark);
             text-shadow: 0 0 3px var(--dk-glow-primary);
        }
        .dk-modal-btn-confirm:hover {
            background: linear-gradient(145deg, #33ffff, var(--dk-accent-primary));
            box-shadow: 0 0 12px var(--dk-glow-primary), 0 2px 4px rgba(0,0,0,0.4);
        }
        .dk-modal-btn-cancel {
            background-color: var(--dk-bg-light);
            color: var(--dk-text-primary);
        }
        .dk-modal-btn-cancel:hover {
            background-color: var(--dk-border-color);
            color: #fff;
             box-shadow: 0 0 5px rgba(160, 148, 192, 0.5);
        }
    `);

    const CONFIG = {
        CHECK_INTERVAL_HOURS: 6,
        DEFAULT_COUNTRY_NAME: 'Select Country',
        DEFAULT_COUNTRY_CID: null,
        COUNTRIES_JSON_URL: 'https://pub-02de1c06eac643f992bb26daeae5c7a0.r2.dev/json/countries.json',
        MAX_RARE_PLAYERS: 5
    };

    let countries = [];
    let selectedCountry = {
        cid: GM_getValue('selectedCountryCid', CONFIG.DEFAULT_COUNTRY_CID),
        name: GM_getValue('selectedCountryName', CONFIG.DEFAULT_COUNTRY_NAME),
        code: GM_getValue('selectedCountryCode', '')
    };

    let knownPlayers = GM_getValue('knownPlayers', {});
    let lastChecked = GM_getValue('lastChecked', 0);
    let isScanning = false;
    let modalConfirmCallback = null;
    let modalCancelCallback = null;
    let rareCountriesCache = [];
    let ageButtonObserver = null;
    let ageButtonClicked = false;
    let uiInitialized = false;

    function createModalElements() {
        if (document.getElementById('dk-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'dk-modal-overlay';
        const content = document.createElement('div');
        content.id = 'dk-modal-content';
        const title = document.createElement('div');
        title.id = 'dk-modal-title';
        const body = document.createElement('div');
        body.id = 'dk-modal-body';
        const buttons = document.createElement('div');
        buttons.id = 'dk-modal-buttons';
        const confirmBtn = document.createElement('button');
        confirmBtn.id = 'dk-modal-btn-confirm';
        confirmBtn.className = 'dk-modal-btn dk-modal-btn-confirm';
        confirmBtn.textContent = 'Confirm';
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'dk-modal-btn-cancel';
        cancelBtn.className = 'dk-modal-btn dk-modal-btn-cancel';
        cancelBtn.textContent = 'Cancel';

        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);
        content.appendChild(title);
        content.appendChild(body);
        content.appendChild(buttons);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideModal();
                if (modalCancelCallback) modalCancelCallback();
            }
        });
        confirmBtn.addEventListener('click', () => {
            hideModal();
            if (modalConfirmCallback) modalConfirmCallback();
        });
        cancelBtn.addEventListener('click', () => {
            hideModal();
            if (modalCancelCallback) modalCancelCallback();
        });
    }

    function showModal(title, html, confirmText = 'OK', cancelText = 'Close', onConfirm = null, onCancel = null) {
        createModalElements();
        const overlay = document.getElementById('dk-modal-overlay');
        document.getElementById('dk-modal-title').textContent = title;
        document.getElementById('dk-modal-body').innerHTML = html;
        document.getElementById('dk-modal-btn-confirm').textContent = confirmText;
        document.getElementById('dk-modal-btn-cancel').textContent = cancelText;
        document.getElementById('dk-modal-btn-confirm').style.display = onConfirm ? 'inline-block' : 'none';
        document.getElementById('dk-modal-btn-cancel').style.display = cancelText ? 'inline-block' : 'none';
        modalConfirmCallback = onConfirm;
        modalCancelCallback = onCancel;

        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
             overlay.classList.add('visible');
        });
    }

    function hideModal() {
        const overlay = document.getElementById('dk-modal-overlay');
        if (overlay) {
             overlay.classList.remove('visible');
             setTimeout(() => {
                 if (overlay && !overlay.classList.contains('visible')) {
                     overlay.style.display = 'none';
                 }
            }, 300);
        }
    }

    function getFlagUrl(code) {
        const upperCode = (code || '').toUpperCase();
        const bgColor = '23193b';
        const textColor = 'e8e0ff';
        const accentColor = '3e2c6b';

        if (!code) return `https://placehold.co/20x15/${bgColor}/${textColor}/png?text=?`;
        if (upperCode === 'SC') return 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb-sct.svg';
        if (upperCode === 'WL') return 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb-wls.svg';
        if (upperCode === 'NI') return 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb-nir.svg';
        if (upperCode === 'EN') return 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb-eng.svg';
        if (upperCode === 'DC') return `https://placehold.co/20x15/${accentColor}/${textColor}/png?text=MZ`;
        return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    }

    function cleanupKnownPlayers() {
        const now = Date.now();
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
        let modified = false;
        Object.keys(knownPlayers).forEach(playerId => {
            if (!knownPlayers[playerId] || typeof knownPlayers[playerId].firstSeen !== 'number') {
                 delete knownPlayers[playerId];
                 modified = true;
                 return;
            }
            if (now - knownPlayers[playerId].firstSeen > threeDaysInMs) {
                delete knownPlayers[playerId];
                modified = true;
            }
        });
        if (modified) {
            GM_setValue('knownPlayers', knownPlayers);
        }
    }

    function fetchCountries() {
         fetch(CONFIG.COUNTRIES_JSON_URL)
             .then(response => {
                  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                  return response.json();
              })
             .then(data => {
                 if (!Array.isArray(data)) throw new Error('Fetched data is not an array');
                 countries = data;
                 countries.sort((a, b) => a.name.localeCompare(b.name));
                 attemptBuildUI();
             })
             .catch(error => {
                  showModal('Error', `<p>Could not load country list.</p><p><i>${error.message}</i></p>`, null, 'Close');
              });
     }

     function attemptBuildUI() {
         if (isTransferPage() && !uiInitialized) {
             buildUI();
         }
     }

    function buildUI() {
        if (document.getElementById('country-monitor-wrapper')) return;

        let insertTarget = null;
        const searchForm = document.getElementById('transferSearchForm');
        const panelSearch = document.querySelector('.panel.panel-dark.search');
        const tdsContainer = document.querySelector('#tds')?.closest('.transfertabs') || document.querySelector('#tds')?.parentElement;

        if (searchForm && searchForm.querySelector('.flex.justify-end')) {
            insertTarget = searchForm.querySelector('.flex.justify-end');
        } else if (tdsContainer) {
            insertTarget = tdsContainer;
        } else if (panelSearch && panelSearch.querySelector('.panel-body > div:first-child')) {
            insertTarget = panelSearch.querySelector('.panel-body > div:first-child');
        } else if (panelSearch && panelSearch.querySelector('.panel-body')) {
            insertTarget = panelSearch.querySelector('.panel-body');
        }

        if (!insertTarget) {
             return;
        }

        const monitorWrapper = document.createElement('div');
        monitorWrapper.id = 'country-monitor-wrapper';

        const flagImg = document.createElement('img');
        flagImg.id = 'country-monitor-flag';
        flagImg.src = getFlagUrl(selectedCountry.code);
        flagImg.alt = selectedCountry.name;
        flagImg.title = selectedCountry.cid ? `Monitoring: ${selectedCountry.name}` : "Select country to monitor";
        flagImg.onerror = () => { flagImg.src = getFlagUrl(null); };

        const countryName = document.createElement('span');
        countryName.id = 'country-monitor-name';
        countryName.textContent = '';

        const rareFinderBtn = document.createElement('div');
        rareFinderBtn.id = 'rare-finder-btn';
        rareFinderBtn.innerHTML = '💎';
        rareFinderBtn.title = `Find countries with < ${CONFIG.MAX_RARE_PLAYERS} 19yo players`;

        const searchStatus = document.createElement('span');
        searchStatus.id = 'search-status';
        searchStatus.style.display = 'none';

        monitorWrapper.appendChild(flagImg);
        monitorWrapper.appendChild(countryName);
        monitorWrapper.appendChild(rareFinderBtn);
        monitorWrapper.appendChild(searchStatus);

        const selector = document.createElement('div');
        selector.id = 'country-selector';
        const search = document.createElement('input');
        search.id = 'country-search';
        search.type = 'text';
        search.placeholder = 'Search country...';
        selector.appendChild(search);

        countries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'country-option';
            if (selectedCountry.cid === country.cid) option.classList.add('selected');
            const optionImg = document.createElement('img');
            optionImg.src = getFlagUrl(country.code);
            optionImg.alt = country.name;
            optionImg.onerror = () => { optionImg.src = getFlagUrl('DC'); };
            const optionName = document.createElement('span');
            optionName.textContent = country.name;
            option.appendChild(optionImg);
            option.appendChild(optionName);
            option.addEventListener('click', () => {
                selectCountry(country);
                hideDropdowns();
            });
            selector.appendChild(option);
        });
        search.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            Array.from(selector.querySelectorAll('.country-option')).forEach(option => {
                const name = option.querySelector('span').textContent.toLowerCase();
                option.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
        monitorWrapper.appendChild(selector);

        const rareDropdown = document.createElement('div');
        rareDropdown.id = 'rare-scan-results-dropdown';
        monitorWrapper.appendChild(rareDropdown);

        flagImg.addEventListener('click', (e) => {
             e.stopPropagation();
             toggleDropdown(selector.id);
        });
        rareFinderBtn.addEventListener('click', () => {
            findRareCountriesInline();
        });
        searchStatus.addEventListener('click', (e) => {
             if (searchStatus.classList.contains('has-results')) {
                 e.stopPropagation();
                 toggleDropdown(rareDropdown.id);
             }
        });

        document.addEventListener('click', (e) => {
            if (!monitorWrapper.contains(e.target)) {
                 hideDropdowns();
            }
        });

        insertTarget.appendChild(monitorWrapper);
        uiInitialized = true;

        if (selectedCountry.cid) {
            checkTransferMarket(false);
        }
    }

    function toggleDropdown(dropdownId) {
        const countrySelector = document.getElementById('country-selector');
        const rareDropdown = document.getElementById('rare-scan-results-dropdown');
        const isCountrySelectorTarget = dropdownId === countrySelector.id;
        const isRareDropdownTarget = dropdownId === rareDropdown.id;

        if (isCountrySelectorTarget) {
            if (countrySelector.classList.contains('visible')) {
                hideDropdown(countrySelector);
            } else {
                showDropdown(countrySelector);
                hideDropdown(rareDropdown);
                const searchInput = countrySelector.querySelector('#country-search');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
            }
        } else if (isRareDropdownTarget) {
             if (rareDropdown.classList.contains('visible')) {
                 hideDropdown(rareDropdown);
             } else {
                 showDropdown(rareDropdown);
                 hideDropdown(countrySelector);
             }
        }
    }

    function showDropdown(dropdown) {
        if (!dropdown) return;
        dropdown.style.display = 'block';
        requestAnimationFrame(() => {
             dropdown.classList.add('visible');
        });
    }

    function hideDropdown(dropdown) {
         if (!dropdown) return;
        dropdown.classList.remove('visible');
        setTimeout(() => {
            if (dropdown && !dropdown.classList.contains('visible')) {
                dropdown.style.display = 'none';
            }
        }, 300);
    }

    function hideDropdowns() {
         hideDropdown(document.getElementById('country-selector'));
         hideDropdown(document.getElementById('rare-scan-results-dropdown'));
    }

    function selectCountry(country) {
        selectedCountry = { cid: country.cid, name: country.name, code: country.code };
        GM_setValue('selectedCountryCid', country.cid);
        GM_setValue('selectedCountryName', country.name);
        GM_setValue('selectedCountryCode', country.code);

        const flagImg = document.getElementById('country-monitor-flag');
        if (flagImg) {
            flagImg.src = getFlagUrl(country.code);
            flagImg.alt = country.name;
            flagImg.title = "Monitoring: " + country.name;
            flagImg.onerror = () => { flagImg.src = getFlagUrl(null); };
        }
        const countryName = document.getElementById('country-monitor-name');
        if (countryName) countryName.textContent = country.name;

        const selector = document.getElementById('country-selector');
        if(selector){
            Array.from(selector.querySelectorAll('.country-option')).forEach(opt => opt.classList.remove('selected'));
            const selectedOption = Array.from(selector.querySelectorAll('.country-option')).find(opt => opt.querySelector('span').textContent === country.name);
             if(selectedOption) selectedOption.classList.add('selected');
        }

        knownPlayers = {};
        GM_setValue('knownPlayers', knownPlayers);
        checkTransferMarket(true);
    }

    function isTransferPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('p') === 'transfer';
    }


    function checkTransferMarket(forced = false) {
        if (!selectedCountry.cid) return;
        const now = Date.now();
        const checkIntervalMs = CONFIG.CHECK_INTERVAL_HOURS * 60 * 60 * 1000;
        if (!forced && (now - lastChecked < checkIntervalMs)) return;

        cleanupKnownPlayers();
        const url = `https://www.managerzone.com/ajax.php?p=transfer&sub=transfer-search&sport=soccer&issearch=true&u=&nationality=${selectedCountry.cid}&deadline=0&category=&valuea=&valueb=&bida=&bidb=&agea=19&ageb=37&tot_low=0&tot_high=110&s0a=0&s0b=10&s1a=0&s1b=10&s2a=0&s2b=10&s3a=0&s3b=10&s4a=0&s4b=10&s5a=0&s5b=10&s6a=0&s6b=10&s7a=0&s7b=10&s8a=0&s8b=10&s9a=0&s9b=10&s10a=0&s10b=10&s11a=0&s11b=10&s12a=0&s12b=10`;

        fetch(url)
            .then(response => {
                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                 return response.json();
             })
            .then(data => {
                lastChecked = now;
                GM_setValue('lastChecked', lastChecked);
                if (data?.totalHits && parseInt(data.totalHits) > 0) {
                    processPlayers(data);
                }
            })
            .catch(error => {});
    }

    function processPlayers(data) {
        if (!data?.players || typeof data.players !== 'string' || data.players.includes("No players found")) return 0;

        let players = [];
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.players, 'text/html');
            const playerRows = doc.querySelectorAll('.player');

            playerRows.forEach((row) => {
                const link = row.querySelector('a[href*="pid="]');
                const nameSpan = row.querySelector('.player_name, span[id^="player_name_"]');
                const idSpan = row.querySelector('span[id^="player_id_"]');
                let id = null, name = null;

                if (link) {
                    const urlParams = new URLSearchParams(link.getAttribute('href'));
                    id = urlParams.get('pid');
                } else if(idSpan) {
                    id = idSpan.id.replace('player_id_', '');
                }
                if (nameSpan) name = nameSpan.textContent.trim();

                if (id && name && !players.some(p => p.id === id)) {
                    players.push({ id: id, name: name });
                }
            });

             if (players.length === 0) {
                 const pidRegex = /pid=(\d{9,})/g;
                 let match;
                 while ((match = pidRegex.exec(data.players)) !== null) {
                     const fallbackId = match[1];
                     const contextRegex = new RegExp(`pid=${fallbackId}[^>]*>[^>]*>([^<]+)<`);
                     const nameMatch = data.players.match(contextRegex);
                     const fallbackName = nameMatch ? nameMatch[1].trim() : `Player ${fallbackId}`;
                     if (!players.some(p => p.id === fallbackId)) {
                         players.push({ id: fallbackId, name: fallbackName });
                     }
                 }
             }
        } catch (e) {}

        if (!isScanning) {
            const newPlayers = players.filter(player => !knownPlayers[player.id]);
            if (newPlayers.length > 0) {
                showPlayerNotification(newPlayers);
                let updatedKnownPlayers = { ...knownPlayers };
                newPlayers.forEach(player => {
                    updatedKnownPlayers[player.id] = { name: player.name, firstSeen: Date.now() };
                });
                knownPlayers = updatedKnownPlayers;
                GM_setValue('knownPlayers', knownPlayers);
            }
        }
        return players.length;
    }

    function showPlayerNotification(players) {
        const htmlContent = `<p>Found ${players.length} new player(s) from <strong>${selectedCountry.name}</strong>.</p>`;
        showModal('✨ New Players Found!', htmlContent, 'View', 'Close',
            () => { window.location.href = `https://www.managerzone.com/?p=transfer&sub=search&sport=soccer&nationality=${selectedCountry.cid}`; }
        );
    }

    function countPlayersFromCountry(country) {
        const url = `https://www.managerzone.com/ajax.php?p=transfer&sub=transfer-search&sport=soccer&issearch=true&u=&nationality=${country.cid}&deadline=0&category=&valuea=&valueb=&bida=&bidb=&agea=19&ageb=19&tot_low=0&tot_high=110&s0a=0&s0b=10&s1a=0&s1b=10&s2a=0&s2b=10&s3a=0&s3b=10&s4a=0&s4b=10&s5a=0&s5b=10&s6a=0&s6b=10&s7a=0&s7b=10&s8a=0&s8b=10&s9a=0&s9b=10&s10a=0&s10b=10&s11a=0&s11b=10&s12a=0&s12b=10`;
        return new Promise((resolve) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    let playerCount = (data?.totalHits) ? parseInt(data.totalHits) : 0;
                    if (isNaN(playerCount)) playerCount = 0;
                    resolve({ cid: country.cid, name: country.name, code: country.code, playerCount: playerCount });
                })
                .catch((error) => {
                    resolve({ cid: country.cid, name: country.name, code: country.code, playerCount: -1 });
                });
        });
    }

    function findRareCountriesInline() {
        if (isScanning || !uiInitialized) return;
        isScanning = true;
        rareCountriesCache = [];

        const searchStatus = document.getElementById('search-status');
        const rareFinderBtn = document.getElementById('rare-finder-btn');
        const rareDropdown = document.getElementById('rare-scan-results-dropdown');

        if (!searchStatus || !rareFinderBtn || !rareDropdown) {
            isScanning = false;
            return;
        }

        hideDropdowns();
        rareDropdown.innerHTML = '';
        searchStatus.textContent = 'Scanning 0% ...';
        searchStatus.style.display = 'inline';
        searchStatus.classList.remove('has-results');
        rareFinderBtn.classList.add('scanning');
        rareFinderBtn.disabled = true;

        let processed = 0;
        const totalCountries = countries.length;
        const batchSize = 5;
        const delayBetweenBatches = 400;

        async function runBatch(startIdx) {
            if (!isScanning || startIdx >= totalCountries) {
                 if (startIdx >= totalCountries) finishScanning();
                 return;
             }

            const endIdx = Math.min(startIdx + batchSize, totalCountries);
            const batch = countries.slice(startIdx, endIdx);
            const promises = batch.map(country => countPlayersFromCountry(country));

            try {
                const results = await Promise.all(promises);
                processed += results.length;
                const percentage = totalCountries > 0 ? Math.round((processed / totalCountries) * 100) : 0;
                if(searchStatus) searchStatus.textContent = `Scanning ${percentage}% ...`;

                results.forEach(result => {
                    if (result.playerCount !== -1 && result.playerCount > 0 && result.playerCount < CONFIG.MAX_RARE_PLAYERS) {
                        rareCountriesCache.push(result);
                    }
                });
                setTimeout(() => runBatch(endIdx), delayBetweenBatches);
            } catch (error) {
                 setTimeout(() => runBatch(endIdx), delayBetweenBatches * 2);
            }
        }

        function finishScanning() {
            isScanning = false;
            if(rareFinderBtn) {
                 rareFinderBtn.classList.remove('scanning');
                 rareFinderBtn.disabled = false;
             }

            rareCountriesCache.sort((a, b) => a.playerCount - b.playerCount || a.name.localeCompare(b.name));

            if (rareDropdown) {
                 rareDropdown.innerHTML = '';
                 if (rareCountriesCache.length > 0) {
                      rareCountriesCache.forEach(result => {
                          const option = document.createElement('div');
                          option.className = 'rare-result-option';
                          option.title = `${result.name} (${result.playerCount} U19 players)`;
                          option.dataset.cid = result.cid;
                          const flagImg = document.createElement('img');
                          flagImg.src = getFlagUrl(result.code);
                          flagImg.alt = result.name;
                          flagImg.onerror = () => { flagImg.src = getFlagUrl('DC'); };
                          const nameSpan = document.createElement('span');
                          nameSpan.className = 'rare-name';
                          nameSpan.textContent = result.name;
                          const countSpan = document.createElement('span');
                          countSpan.className = 'rare-count';
                          countSpan.textContent = result.playerCount;
                          option.appendChild(flagImg);
                          option.appendChild(nameSpan);
                          option.appendChild(countSpan);
                          option.addEventListener('click', () => {
                               const url = `https://www.managerzone.com/?p=transfer&sub=search&sport=soccer&nationality=${result.cid}&agea=19&ageb=19`;
                               window.open(url, '_blank');
                               // hideDropdowns();
                           });
                          rareDropdown.appendChild(option);
                      });
                 } else {
                      const noResult = document.createElement('div');
                      noResult.textContent = 'No rare countries found.';
                      noResult.style.padding = '10px';
                      noResult.style.textAlign = 'center';
                      noResult.style.color = 'var(--dk-text-secondary)';
                      rareDropdown.appendChild(noResult);
                 }
            }

            if(searchStatus) {
                 if (rareCountriesCache.length === 0) {
                     searchStatus.textContent = 'No rare U19';
                     searchStatus.classList.remove('has-results');
                 } else {
                     searchStatus.textContent = `Found ${rareCountriesCache.length} rare U19 ▼`;
                     searchStatus.classList.add('has-results');
                 }
                 setTimeout(() => {
                      if(searchStatus && !searchStatus.classList.contains('has-results') && !isScanning) {
                           searchStatus.style.display = 'none';
                       }
                 }, 5000);
             }
        }
        runBatch(0);
    }

    function checkUrlAndSetUpObserver() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const isCorrectPage =
            url.hostname === 'www.managerzone.com' &&
            params.get('p') === 'transfer' &&
            params.get('sub') === 'search' &&
            params.get('sport') === 'soccer' &&
            params.has('nationality') &&
            params.get('agea') === '19' &&
            params.get('ageb') === '19';

        if (isCorrectPage) {
            ageButtonClicked = false;
            startAgeButtonObserver();
        } else {
            stopAgeButtonObserver();
        }
    }

    function startAgeButtonObserver() {
        if (ageButtonObserver) return;

        const observerCallback = (mutationsList, observer) => {
            if (ageButtonClicked) return;

            const button = document.getElementById('ageButton19');
            if (button) {
                button.click();
                ageButtonClicked = true;
            }
        };

        ageButtonObserver = new MutationObserver(observerCallback);
        ageButtonObserver.observe(document.body, { childList: true, subtree: true });

        if (!ageButtonClicked) {
             const initialButton = document.getElementById('ageButton19');
             if (initialButton) {
                  initialButton.click();
                  ageButtonClicked = true;
             }
        }
    }

    function stopAgeButtonObserver() {
        if (ageButtonObserver) {
            ageButtonObserver.disconnect();
            ageButtonObserver = null;
        }
        ageButtonClicked = false;
    }


    function initializeScript() {
         uiInitialized = false;
         fetchCountries();
         checkUrlAndSetUpObserver();
     }

    setTimeout(initializeScript, 500);

    setInterval(() => {
        if (selectedCountry.cid && !isScanning) {
            checkTransferMarket(false);
        }
    }, 30 * 60 * 1000);

    let lastUrl = location.href;
    const urlChangeObserver = new MutationObserver(() => {
         const currentUrl = location.href;
         if (currentUrl !== lastUrl) {
             lastUrl = currentUrl;

             const oldWrapper = document.getElementById('country-monitor-wrapper');
             if (oldWrapper) {
                 oldWrapper.remove();
             }
             hideModal();
             hideDropdowns();
             stopAgeButtonObserver();
             isScanning = false;

             setTimeout(() => {
                 initializeScript();
             }, 750);
         }
    });
    urlChangeObserver.observe(document.body, { subtree: true, childList: true });
})();
