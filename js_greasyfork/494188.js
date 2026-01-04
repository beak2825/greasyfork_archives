// ==UserScript==
// @name         MZ - Youth Exchange/16
// @namespace    douglaskampl
// @version      3.8
// @description  Persists new player data when exchanging youth players
// @author       Douglas
// @match        https://www.managerzone.com/?p=youth_academy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494188/MZ%20-%20Youth%20Exchange16.user.js
// @updateURL https://update.greasyfork.org/scripts/494188/MZ%20-%20Youth%20Exchange16.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        USERS: {
            douglaskampl: 'Brazil', /* You can put your username and country here. */
        },
        YOUTH_EXCHANGE_PLAYER_AGE: 16,
        ENDPOINTS: {
            WORKER: 'https://youth-exchange-worker.douglasdotv.workers.dev/',
            SCOUT: 'https://www.managerzone.com/ajax.php?p=players&sub=scout_report&pid=null&sport=soccer',
            MANAGER: 'http://www.managerzone.com/xml/manager_data.php',
            COUNTRIES: 'https://u18mz.vercel.app/mz/countriesData.json'
        },
        SKILLS: [
            'speed', 'stamina', 'playIntelligence', 'passing', 'shooting',
            'heading', 'keeping', 'ballControl', 'tackling', 'aerialPassing', 'setPlays',
            'experience', 'form'
        ]
    };

    const state = {
        username: 'Unknown',
        nationality: 'Unknown',
        storedPlayerData: null,
        dataReady: false,
        lastPlayerID: null,
        currentSeason: document.querySelector('#header-stats-wrapper h5.linked')?.textContent.match(/(\d+)/)?.[1],
        countries: null
    };

    function showToast(color, message) {
        const icons = { blue: 'info', green: 'success', orange: 'warning', red: 'error' };
        Swal.fire({
            toast: true,
            position: 'bottom-right',
            iconColor: color,
            icon: icons[color] || 'error',
            title: message,
            showConfirmButton: false,
            timer: 3000,
            background: color,
            color: 'white'
        });
    }

    async function request(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://www.managerzone.com',
                    ...options.headers
                },
                data: options.data,
                onload: resolve,
                onerror: reject
            });
        });
    }

    function handleApiError(error, message) {
        console.error(message, error);
        showToast('red', message);
        return null;
    }

    async function fetchCountries() {
        if (state.countries) return state.countries;

        try {
            const response = await request(CONFIG.ENDPOINTS.COUNTRIES);
            const countries = JSON.parse(response.responseText);
            state.countries = new Map(
                countries.map(country => [country.code, country.name])
            );
            return state.countries;
        } catch (error) {
            handleApiError(error, 'Failed to fetch countries data');
            return new Map();
        }
    }

    async function getCountryName(countryCode) {
        if (!countryCode) return null;

        const countries = await fetchCountries();
        return countries.get(countryCode) || countryCode;
    }

    function getPlayerData(container) {
        if (!container) return null;
        const stats = {};
        CONFIG.SKILLS.forEach((skill, index) => {
            const row = container.querySelectorAll('.player_skills tr')[index];
            const val = row?.querySelector('.skillval span')?.textContent.trim();
            stats[skill] = val ? parseInt(val, 10) : 0;
        });
        const id = container.querySelector('.player_id_span')?.textContent;
        const name = container.querySelector('.player_name')?.textContent;
        const totalBalls = container.querySelectorAll('tbody > tr')[6]?.querySelector('.bold')?.textContent;
        if (!id || !name) return null;
        return { id, name, totalBalls, stats };
    }

    function extractSkills(doc) {
        const dataList = doc.querySelectorAll('dl > dd');
        const getSkills = (c) =>
            Array.from(c.querySelectorAll('li > span:last-child')).map(span => span.textContent.trim());
        const [hpSkills = [], lpSkills = []] = [dataList[0], dataList[1]].map(el => el ? getSkills(el) : []);
        return {
            hp: dataList[0]?.querySelectorAll('.lit')?.length || 0,
            lp: dataList[1]?.querySelectorAll('.lit')?.length || 0,
            trainingSpeed: dataList[2]?.querySelectorAll('.lit')?.length || 0,
            firstHpSkill: hpSkills[0] || '',
            secondHpSkill: hpSkills[1] || '',
            firstLpSkill: lpSkills[0] || '',
            secondLpSkill: lpSkills[1] || ''
        };
    }

    async function extractPlayerData() {
        const container = document.getElementById('thePlayers_x');
        const currentID = container?.querySelector('.player_id_span')?.textContent;
        if (!container || (currentID === state.lastPlayerID && state.storedPlayerData)) return;
        state.lastPlayerID = currentID;
        state.dataReady = false;
        showToast('orange', 'Extracting player data');
        try {
            const response = await request(CONFIG.ENDPOINTS.SCOUT);
            if (!response || !response.responseText) return;
            const cleanText = response.responseText.replace(/Trzxyvopaxis/g, '');
            const doc = new DOMParser().parseFromString(cleanText, 'text/html');
            const basicData = getPlayerData(container);
            if (!basicData) return;
            const skills = extractSkills(doc);
            state.storedPlayerData = {
                ...basicData,
                ...skills,
                age: CONFIG.YOUTH_EXCHANGE_PLAYER_AGE,
                country: state.nationality,
                owner: state.username,
                season: parseInt(state.currentSeason, 10)
            };
            state.dataReady = true;
            showToast('green', 'Player data is ready for submission.');
        } catch (error) {
            handleApiError(error, 'Failed to retrieve player data');
        }
    }

    async function sendData() {
        if (!state.dataReady) {
            showToast('red', 'Data is not ready yet. Please wait.');
            return false;
        }
        try {
            showToast('blue', 'Sending data...');
            const payload = { ...state.storedPlayerData };
            const response = await request(CONFIG.ENDPOINTS.WORKER, {
                method: 'POST',
                data: JSON.stringify(payload)
            });
            if (response.status >= 200 && response.status < 300) {
                showToast('green', 'Data sent successfully.');
                return true;
            }
            if (response.status === 409) {
                showToast('orange', 'This player is already submitted. Data was not sent.');
                return false;
            }
            throw new Error(`HTTP ${response.status}: ${response.responseText}`);
        } catch (error) {
            handleApiError(error, 'Failed to send data');
            return false;
        }
    }

    function attachButtonListeners() {
        ['#exchange_button', '#discard_youth_button'].forEach(selector => {
            const button = document.querySelector(selector);
            if (button && !button.dataset.listenerAdded) {
                button.addEventListener('click', async (e) => {
                    if (!state.dataReady) {
                        e.preventDefault();
                        showToast('red', 'Data is not ready yet. Please wait before proceeding.');
                        return;
                    }
                    await sendData();
                });
                button.dataset.listenerAdded = true;
            }
        });
    }

    function observeContainer() {
        const container = document.getElementById('thePlayers_x');

        const handleContainerChanges = (mutations) => {
            const container = document.getElementById('thePlayers_x');
            if (container) {
                const currentID = container.querySelector('.player_id_span')?.textContent;
                if (currentID && currentID !== state.lastPlayerID) {
                    extractPlayerData();
                }
                attachButtonListeners();
            }
        };

        if (container) {
            const observer = new MutationObserver(handleContainerChanges);
            observer.observe(container, { childList: true, subtree: true });
            handleContainerChanges();
        } else {
            const bodyObserver = new MutationObserver((mutations) => {
                const newContainer = document.getElementById('thePlayers_x');
                if (newContainer) {
                    bodyObserver.disconnect();
                    const observer = new MutationObserver(handleContainerChanges);
                    observer.observe(newContainer, { childList: true, subtree: true });
                    handleContainerChanges();
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    async function init() {
        state.username = document.getElementById('header-username')?.textContent || 'Unknown';
        state.nationality = CONFIG.USERS[state.username] || 'Unknown';

        if (!state.nationality || state.nationality === 'Unknown') {
            try {
                const response = await request(`${CONFIG.ENDPOINTS.MANAGER}?sport_id=1&username=${state.username}`);
                const doc = new DOMParser().parseFromString(response.responseText, 'text/xml');
                const countryCode = doc.querySelector('UserData')?.getAttribute('countryShortname');

                if (countryCode) {
                    state.nationality = await getCountryName(countryCode) || 'Unknown';
                }
            } catch (error) {
                handleApiError(error, 'Failed to fetch nationality');
            }
        }

        observeContainer();
    }

    init();
})();
