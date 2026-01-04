// ==UserScript==
// @name         MZ - Saul Goodman
// @namespace    douglaskampl
// @version      4.01
// @description  Displays leagues and world leagues, grouped by div and/or region, in a single view
// @author       Douglas
// @match        https://www.managerzone.com/?p=team
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     standingsv4 https://mzdv.me/mz/userscript/other/standings_v4.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469016/MZ%20-%20Saul%20Goodman.user.js
// @updateURL https://update.greasyfork.org/scripts/469016/MZ%20-%20Saul%20Goodman.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('standingsv4'));

    /**
     * @typedef {Object} CountryData
     * @property {string} name
     * @property {number} start
     */

    /**
     * @typedef {Object} TeamData
     * @property {number} position
     * @property {string} name
     * @property {string} tid
     * @property {number} points
     * @property {number} goalDifference
     * @property {number} goalsFor
     */

    /**
     * @typedef {Object} LeagueEntry
     * @property {number} sid
     * @property {string} region
     */

    const CONSTANTS = {
        REGIONS: {
            SOCCER: {
                COUNTRIES: [
                    { name: 'Argentina', start: 16096 }, { name: 'Brazil', start: 26187 }, { name: 'China', start: 70847 },
                    { name: 'Germany', start: 12086 }, { name: 'Italy', start: 10625 }, { name: 'Netherlands', start: 15004 },
                    { name: 'Portugal', start: 17566 }, { name: 'Spain', start: 10746 }, { name: 'Poland', start: 13181 },
                    { name: 'Romania', start: 17929 }, { name: 'Sweden', start: 43 }, { name: 'Turkey', start: 20356 }
                ],
                UXX_REGIONS: [
                    { name: 'Argentina', start: 1 }, { name: 'Brazil', start: 122 }, { name: 'Latin America, USA and Canada', start: 727 },
                    { name: 'Central Europe', start: 848 }, { name: 'Iberia', start: 969 }, { name: 'Mediterranean', start: 1090 },
                    { name: 'Northern Europe', start: 1211 }, { name: 'Poland', start: 243 }, { name: 'Romania', start: 364 },
                    { name: 'Sweden', start: 485 }, { name: 'Turkey', start: 606 }, { name: 'World (Asia, Oceania and Africa)', start: 1332 }
                ]
            },
            HOCKEY: {
                COUNTRIES: [
                    { name: 'Brazil', start: 7900 }, { name: 'Sweden', start: 1 }, { name: 'Argentina', start: 2 },
                    { name: 'Poland', start: 23 }, { name: 'Portugal', start: 24 }, { name: 'Spain', start: 12 },
                    { name: 'Romania', start: 25 }, { name: 'Turkey', start: 27 }, { name: 'China', start: 13727 }
                ],
                UXX_REGIONS: [
                    { name: 'Northern Europe', start: 1 }, { name: 'Southern Europe', start: 122 }, { name: 'Rest of the World', start: 243 }
                ]
            }
        },
        LEAGUE_TYPES: {
            SENIOR: 'senior', U18: 'u18', U21: 'u21', U23: 'u23',
            WORLD: 'world', U18_WORLD: 'u18_world', U21_WORLD: 'u21_world', U23_WORLD: 'u23_world',
            get ALL_WORLD() { return [this.WORLD, this.U18_WORLD, this.U21_WORLD, this.U23_WORLD]; },
            get ALL_YOUTH() { return [this.U18, this.U21, this.U23, this.U18_WORLD, this.U21_WORLD, this.U23_WORLD]; }
        },
        LEAGUE_TYPE_LABELS: {
            'Senior Leagues': 'senior',
            'U18 Leagues': 'u18',
            'U21 Leagues': 'u21',
            'U23 Leagues': 'u23',
            'Senior World Leagues': 'world',
            'U18 World Leagues': 'u18_world',
            'U21 World Leagues': 'u21_world',
            'U23 World Leagues': 'u23_world'
        },
        DIVISION: {
            NAMES: { TOP: 'Top Division', TOP_SERIES: 'Top Series', DIV_1: 'Division 1', DIV_2: 'Division 2' },
            STRUCTURE: { BASE_DIVISIONS: 3, MAX_LEVEL: 4 }
        },
        SELECTORS: {
            TEAM_INFO: '#infoAboutTeam',
            STADIUM_WRAPPER: '#team-stadium-wrapper',
            SHORTCUT_LINK: '#shortcut_link_thezone',
            COUNTRY_DROPDOWN: '#country-dropdown',
            PROMOTION_BLOCK: '#promotion-block',
            LEAGUES_MODAL: '#leagues-modal',
            MODAL_CONTENT: '.leagues-modal-content',
            MODAL_HEADER: '.modal-header',
            MODAL_TITLE: '#leagues-modal-title',
            MODAL_CLOSE_BUTTON: '.modal-close-button',
            MODAL_PLACEHOLDER: '#c-placeholder',
            LEAGUE_TYPE_SELECTOR: '#league-type-selector',
            DYNAMIC_CONTENT_CONTAINER: '#dynamic-modal-content',
            TABLES_CONTAINER: '#league-tables-container',
            TAB_CONTAINER: '#league-tabs',
            LOADING_OVERLAY: '.loading-overlay',
            NICE_TABLE: '.nice_table',
            NICE_TABLE_BODY_ROWS: '.nice_table tbody tr',
            TEAM_LINK: 'a[href*="p=team"]',
            LEAGUE_LINK: 'a[href*="?p=league"]',
            TRIGGER_CONTAINER: '#standings-modal-trigger-container',
            TRIGGER_BUTTON: '#standings-modal-trigger'
        },
        TEXTS: {
            LOADING: 'Loading ロード中…',
            NO_PROMOTION_DATA: 'Promotion data could not be calculated.',
            PROMOTIONS: 'Promotions',
            MODAL_TITLE: 'League Standings',
            MODAL_CLOSE: '×',
            PLACEHOLDER_DEFAULT: 'Select a league type to begin',
            PLACEHOLDER_IMG_ALT: 'A random image waiting for you to select a league type.',
            SELECT_LEAGUE_TYPE: 'Select a league type…',
            ALL_REGIONS: 'All Regions',
            PROMOTION_HEADING: 'Going up: ',
            TRIGGER_BUTTON: '<i class="fa-solid fa-table-list"></i> Standings順位表'
        },
        CSS_CLASSES: {
            MODAL_OPEN: 'loaded',
            TAB_ACTIVE: 'active',
            LEAGUES_MODAL: 'leagues-modal'
        },
        API: {
            BASE_URL: 'https://www.managerzone.com/ajax.php',
            LEAGUE_TABLE_PARAMS: (type, sid, tid, sport) => `?p=league&type=${type}&sid=${sid}&tid=${tid}&sport=${sport}&sub=table`
        },
        REGEX: {
            TEAM_ID: /tid=(\d+)/
        }
    };

    /**
     * Manages the retrieval and structuring of league data.
     */
    class LeagueManager {
        constructor() {
            const shortcutLink = document.querySelector(CONSTANTS.SELECTORS.SHORTCUT_LINK);
            this.sport = new URL(shortcutLink.href).searchParams.get('sport');

            const teamInfo = document.querySelector(CONSTANTS.SELECTORS.TEAM_INFO);
            this.teamId = CONSTANTS.REGEX.TEAM_ID.exec(teamInfo.querySelector('a').href)[1];

            this.seniorLeagues = this.getSeniorLeagues();
            this.worldLeagues = { World: this.getWorldLeaguesObj() };
            this.uxxLeagues = this.getUxxLeagues();
        }

        /**
         * Generates the league object for national senior leagues.
         * @returns {Object<string, Object>} An object mapping country names to their league structures.
         */
        getSeniorLeagues() {
            const countries = this.sport === 'soccer' ? CONSTANTS.REGIONS.SOCCER.COUNTRIES : CONSTANTS.REGIONS.HOCKEY.COUNTRIES;
            return countries.reduce((acc, { name, start }) => ({ ...acc, [name]: { [CONSTANTS.DIVISION.NAMES.TOP]: [start] } }), {});
        }

        /**
         * Generates the league object for world leagues (Senior and Uxx).
         * @returns {Object<string, number[]>} An object mapping division names to league ID arrays.
         */
        getWorldLeaguesObj() {
            const leagues = {};
            let leagueId = 1;
            for (let i = 0; i <= CONSTANTS.DIVISION.STRUCTURE.MAX_LEVEL; i++) {
                const divisionName = i === 0 ? CONSTANTS.DIVISION.NAMES.TOP_SERIES : `Division ${i}`;
                const numLeagues = Math.pow(CONSTANTS.DIVISION.STRUCTURE.BASE_DIVISIONS, i);
                const divisionLeagues = [];
                for (let j = 0; j < numLeagues; j++) {
                    divisionLeagues.push(leagueId++);
                }
                leagues[divisionName] = divisionLeagues;
            }
            return leagues;
        }

        /**
         * Generates the league object for regional Uxx leagues.
         * @returns {Object<string, Object>} An object mapping region names to their league structures.
         */
        getUxxLeagues() {
            const regions = this.sport === 'soccer' ? CONSTANTS.REGIONS.SOCCER.UXX_REGIONS : CONSTANTS.REGIONS.HOCKEY.UXX_REGIONS;
            return regions.reduce((acc, region) => {
                acc[region.name] = {
                    [CONSTANTS.DIVISION.NAMES.TOP]: [region.start],
                    [CONSTANTS.DIVISION.NAMES.DIV_1]: Array.from({ length: 3 }, (_, i) => region.start + i + 1),
                    [CONSTANTS.DIVISION.NAMES.DIV_2]: Array.from({ length: 9 }, (_, i) => region.start + i + 4)
                };
                return acc;
            }, {});
        }

        /**
         * Flattens a league object, grouping all leagues by division name, regardless of country/region.
         * Used for the 'All Regions' view.
         * @param {Object<string, Object>} leaguesObj - The structured league object (e.g., this.seniorLeagues).
         * @returns {Object<string, LeagueEntry[]>} An object mapping division names to arrays of LeagueEntry objects.
         */
        getAllLeagues(leaguesObj) {
            const allLeagues = {};
            for (const [country, leagues] of Object.entries(leaguesObj)) {
                for (const [leagueName, ids] of Object.entries(leagues)) {
                    if (!allLeagues[leagueName]) allLeagues[leagueName] = [];
                    ids.forEach(id => allLeagues[leagueName].push({ sid: id, region: country }));
                }
            }
            return allLeagues;
        }

        /**
         * Retrieves the correct league data structure based on the selected league type and country.
         * @param {string} leagueType - A value from CONSTANTS.LEAGUE_TYPES.
         * @param {string} country - The selected country/region name, or 'All'.
         * @returns {Object} The corresponding league structure.
         */
        getLeaguesObjFromLeagueType(leagueType, country) {
            switch (leagueType) {
                case CONSTANTS.LEAGUE_TYPES.SENIOR:
                    return country === CONSTANTS.TEXTS.ALL_REGIONS ? this.getAllLeagues(this.seniorLeagues) : this.seniorLeagues[country];
                case CONSTANTS.LEAGUE_TYPES.WORLD:
                case CONSTANTS.LEAGUE_TYPES.U18_WORLD:
                case CONSTANTS.LEAGUE_TYPES.U21_WORLD:
                case CONSTANTS.LEAGUE_TYPES.U23_WORLD:
                    return this.worldLeagues.World;
                case CONSTANTS.LEAGUE_TYPES.U18:
                case CONSTANTS.LEAGUE_TYPES.U21:
                case CONSTANTS.LEAGUE_TYPES.U23:
                    return country === CONSTANTS.TEXTS.ALL_REGIONS ? this.getAllLeagues(this.uxxLeagues) : this.uxxLeagues[country];
                default:
                    return {};
            }
        }

        /**
         * Gets the list of available countries/regions for a given league type.
         * @param {string} leagueType - A value from CONSTANTS.LEAGUE_TYPES.
         * @returns {string[]} An array of country/region names.
         */
        getCountries(leagueType) {
            if (CONSTANTS.LEAGUE_TYPES.ALL_WORLD.includes(leagueType)) return ['World'];
            return leagueType === CONSTANTS.LEAGUE_TYPES.SENIOR ? Object.keys(this.seniorLeagues) : Object.keys(this.uxxLeagues);
        }
    }

    /**
     * Manages the creation, manipulation, and data loading for the UI modal.
     */
    class UIManager {
        constructor(leagueManager) {
            this.leagueManager = leagueManager;
            this.activeTab = null;
            this.state = {
                leagueType: null,
                country: null,
                leagueName: null,
            };
        }

        /**
         * Creates the main "Standings" button and injects it into the page.
         */
        initializeInterface() {
            const mainContainer = document.createElement('div');
            mainContainer.id = CONSTANTS.SELECTORS.TRIGGER_CONTAINER.slice(1);

            const triggerButton = document.createElement('button');
            triggerButton.id = CONSTANTS.SELECTORS.TRIGGER_BUTTON.slice(1);
            triggerButton.innerHTML = CONSTANTS.TEXTS.TRIGGER_BUTTON;
            triggerButton.onclick = () => this.createLeaguesModal();

            mainContainer.appendChild(triggerButton);
            document.querySelector(CONSTANTS.SELECTORS.STADIUM_WRAPPER).appendChild(mainContainer);
        }

        /**
         * Creates and displays the main league standings modal.
         * This method orchestrates the creation of modal components.
         */
        createLeaguesModal() {
            document.querySelector(CONSTANTS.SELECTORS.LEAGUES_MODAL)?.remove();

            const modal = document.createElement('div');
            modal.id = CONSTANTS.SELECTORS.LEAGUES_MODAL.slice(1);
            modal.className = CONSTANTS.CSS_CLASSES.LEAGUES_MODAL;
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

            const content = document.createElement('div');
            content.className = CONSTANTS.SELECTORS.MODAL_CONTENT.slice(1);

            const header = this._createModalHeader(CONSTANTS.TEXTS.MODAL_TITLE, () => modal.remove());
            const placeholder = this._createModalPlaceholder();
            const leagueTypeSelector = this.createLeagueTypeSelector(
                header.querySelector(CONSTANTS.SELECTORS.MODAL_TITLE),
                placeholder
            );
            const dynamicContentContainer = this._createModalDynamicContent();

            content.append(header, leagueTypeSelector, placeholder, dynamicContentContainer);
            modal.appendChild(content);
            document.body.appendChild(modal);
        }

        /**
         * Creates the modal header element.
         * @param {string} titleText - The text for the modal title.
         * @param {Function} closeCallback - The function to call when the close button is clicked.
         * @returns {HTMLElement} The header element.
         */
        _createModalHeader(titleText, closeCallback) {
            const header = document.createElement('div');
            header.className = CONSTANTS.SELECTORS.MODAL_HEADER.slice(1);

            const title = document.createElement('h2');
            title.id = CONSTANTS.SELECTORS.MODAL_TITLE.slice(1);
            title.textContent = titleText;

            const closeButton = document.createElement('button');
            closeButton.className = CONSTANTS.SELECTORS.MODAL_CLOSE_BUTTON.slice(1);
            closeButton.id = 'leagues-modal-close-button';
            closeButton.innerHTML = CONSTANTS.TEXTS.MODAL_CLOSE;
            closeButton.onclick = closeCallback;

            header.append(title, closeButton);
            return header;
        }

        /**
         * Creates the placeholder element shown before a league type is selected.
         * @returns {HTMLElement} The placeholder element.
         */
        _createModalPlaceholder() {
            const placeholderContainer = document.createElement('div');
            placeholderContainer.id = CONSTANTS.SELECTORS.MODAL_PLACEHOLDER.slice(1);

            const img = document.createElement('img');
            img.src = 'https://picsum.photos/300/200';
            img.alt = CONSTANTS.TEXTS.PLACEHOLDER_IMG_ALT;

            const p = document.createElement('p');
            p.textContent = CONSTANTS.TEXTS.PLACEHOLDER_DEFAULT;

            placeholderContainer.append(img, p);
            return placeholderContainer;
        }

        /**
         * Creates the container for dynamic content (country dropdown, tabs, tables).
         * @returns {HTMLElement} The dynamic content container.
         */
        _createModalDynamicContent() {
            const dynamicContentContainer = document.createElement('div');
            dynamicContentContainer.id = CONSTANTS.SELECTORS.DYNAMIC_CONTENT_CONTAINER.slice(1);
            return dynamicContentContainer;
        }

        /**
         * Creates the primary "League Type" dropdown selector.
         * @param {HTMLElement} titleElement - The modal title element (H2) to update on change.
         * @param {HTMLElement} placeholderContainer - The placeholder element to hide/show.
         * @returns {HTMLSelectElement} The configured <select> element.
         */
        createLeagueTypeSelector(titleElement, placeholderContainer) {
            const selector = document.createElement('select');
            selector.id = CONSTANTS.SELECTORS.LEAGUE_TYPE_SELECTOR.slice(1);
            selector.add(new Option(CONSTANTS.TEXTS.SELECT_LEAGUE_TYPE, ''));

            Object.keys(CONSTANTS.LEAGUE_TYPE_LABELS).forEach(name => {
                selector.add(new Option(name, CONSTANTS.LEAGUE_TYPE_LABELS[name]));
            });

            selector.onchange = () => {
                const selectedType = selector.value;
                const selectedText = selector.options[selector.selectedIndex].text;
                titleElement.textContent = selectedType ? selectedText : CONSTANTS.TEXTS.MODAL_TITLE;
                this.state.leagueType = selectedType;

                const dynamicContentContainer = document.getElementById(CONSTANTS.SELECTORS.DYNAMIC_CONTENT_CONTAINER.slice(1));
                dynamicContentContainer.innerHTML = '';
                dynamicContentContainer.classList.remove(CONSTANTS.CSS_CLASSES.MODAL_OPEN);

                if (selectedType) {
                    placeholderContainer.style.display = 'none';
                    this.loadModalContent(selectedType, dynamicContentContainer);
                    setTimeout(() => dynamicContentContainer.classList.add(CONSTANTS.CSS_CLASSES.MODAL_OPEN), 50);
                } else {
                    placeholderContainer.style.display = 'flex';
                }
            };
            return selector;
        }

        /**
         * Populates the dynamic content container with controls (dropdown, tabs) for the selected league type.
         * @param {string} leagueType - The selected league type.
         * @param {HTMLElement} container - The dynamic content container.
         */
        loadModalContent(leagueType, container) {
            const tablesContainer = document.createElement('div');
            tablesContainer.id = CONSTANTS.SELECTORS.TABLES_CONTAINER.slice(1);

            const countryDropdown = this.createCountryDropdown(leagueType, tablesContainer);
            const tabContainer = this.createTabContainer(leagueType, countryDropdown.value, tablesContainer);

            container.append(countryDropdown, tabContainer, tablesContainer);

            if (tabContainer.firstChild) {
                setTimeout(() => tabContainer.firstChild.click(), 50);
            }
        }

        /**
         * Creates the country/region dropdown selector.
         * @param {string} leagueType - The selected league type.
         * @param {HTMLElement} tablesContainer - The container for league tables, to be cleared on change.
         * @returns {HTMLSelectElement} The configured <select> element.
         */
        createCountryDropdown(leagueType, tablesContainer) {
            const dropdown = document.createElement('select');
            dropdown.id = CONSTANTS.SELECTORS.COUNTRY_DROPDOWN.slice(1);

            if (!CONSTANTS.LEAGUE_TYPES.ALL_WORLD.includes(leagueType)) {
                dropdown.add(new Option(CONSTANTS.TEXTS.ALL_REGIONS, CONSTANTS.TEXTS.ALL_REGIONS));
            }

            this.leagueManager.getCountries(leagueType).forEach(country => dropdown.add(new Option(country, country)));
            this.state.country = dropdown.value;

            dropdown.onchange = () => {
                this.state.country = dropdown.value;
                const newTabs = this.createTabContainer(leagueType, dropdown.value, tablesContainer);
                document.getElementById(CONSTANTS.SELECTORS.TAB_CONTAINER.slice(1)).replaceWith(newTabs);
                tablesContainer.innerHTML = '';
                if (newTabs.firstChild) newTabs.firstChild.click();
            };
            return dropdown;
        }

        /**
         * Creates the container with division tabs (e.g., "Top Division", "Division 1").
         * @param {string} leagueType - The selected league type.
         * @param {string} country - The selected country/region.
         * @param {HTMLElement} tablesContainer - The container for league tables, passed to tab click handlers.
         * @returns {HTMLElement} The tab container element.
         */
        createTabContainer(leagueType, country, tablesContainer) {
            const container = document.createElement('div');
            container.id = CONSTANTS.SELECTORS.TAB_CONTAINER.slice(1);
            const leagues = this.leagueManager.getLeaguesObjFromLeagueType(leagueType, country);

            Object.keys(leagues).forEach(leagueName => {
                const tab = document.createElement('button');
                tab.textContent = leagueName;
                tab.onclick = () => {
                    if (this.activeTab) this.activeTab.classList.remove(CONSTANTS.CSS_CLASSES.TAB_ACTIVE);
                    this.activeTab = tab;
                    tab.classList.add(CONSTANTS.CSS_CLASSES.TAB_ACTIVE);
                    this.state.leagueName = leagueName;
                    this.updateLeagueData(leagueType, country, leagueName, leagues[leagueName], tablesContainer);
                };
                container.appendChild(tab);
            });
            return container;
        }

        /**
         * Fetches and renders the league tables for the selected tab.
         * @param {string} leagueType - The selected league type.
         * @param {string} country - The selected country/region.
         * @param {string} leagueName - The name of the active division/tab.
         * @param {Array<number|LeagueEntry>} leagueEntries - Array of league IDs or LeagueEntry objects.
         * @param {HTMLElement} tablesContainer - The container to render tables into.
         */
        async updateLeagueData(leagueType, country, leagueName, leagueEntries, tablesContainer) {
            this.renderLoading(tablesContainer);
            document.querySelector(CONSTANTS.SELECTORS.PROMOTION_BLOCK)?.remove();

            const tableData = await Promise.all(leagueEntries.map((entry, index) => {
                const { sid, region } = (typeof entry === 'object') ? entry : { sid: entry, region: country };
                const divisionCount = this.calculateDivisionCount(leagueName, index);
                return this.fetchLeagueTable(sid, leagueType, divisionCount, region);
            }));

            const fragment = document.createDocumentFragment();
            tableData.filter(Boolean).forEach(data => {
                fragment.append(this.createLeagueTitle(leagueName, data.divisionCount, leagueType, data.region, data.sid), data.table);
            });

            tablesContainer.innerHTML = '';
            tablesContainer.appendChild(fragment);

            const promotionRules = this.getPromotionRules(leagueType, leagueName);
            if (promotionRules.apply && country !== CONSTANTS.TEXTS.ALL_REGIONS) {
                this.calculateAndDisplayPromotions(tablesContainer, promotionRules.secondPlaceSlots);
            }
        }

        /**
         * Gathers team data from rendered tables and displays the promotion block.
         * @param {HTMLElement} tablesContainer - The container holding the league tables.
         * @param {number} secondPlaceSlots - The number of promotion slots for 2nd place teams.
         */
        calculateAndDisplayPromotions(tablesContainer, secondPlaceSlots) {
            const allTeamsData = [];
            tablesContainer.querySelectorAll(CONSTANTS.SELECTORS.NICE_TABLE_BODY_ROWS).forEach(row => {
                const teamData = this.parseTeamDataFromRow(row);
                if (teamData) {
                    allTeamsData.push(teamData);
                }
            });

            const firstPlaceTeams = allTeamsData.filter(team => team.position === 1);
            const secondPlaceTeams = allTeamsData.filter(team => team.position === 2);
            secondPlaceTeams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);

            const promotionData = { firstPlaceTeams, bestSecondPlaceTeams: secondPlaceTeams.slice(0, secondPlaceSlots) };
            const promotionBlock = this.createPromotionBlockUI(promotionData);
            document.querySelector(CONSTANTS.SELECTORS.DYNAMIC_CONTENT_CONTAINER).insertBefore(promotionBlock, tablesContainer);
        }

        /**
         * Creates the promotion block UI element (Regra 11: No innerHTML).
         * @param {Object} promotionData - Object containing arrays of promoting teams.
         * @param {TeamData[]} promotionData.firstPlaceTeams
         * @param {TeamData[]} promotionData.bestSecondPlaceTeams
         * @returns {HTMLElement} The promotion block element.
         */
        createPromotionBlockUI({ firstPlaceTeams, bestSecondPlaceTeams }) {
            const container = document.createElement('div');
            container.id = CONSTANTS.SELECTORS.PROMOTION_BLOCK.slice(1);

            const list = document.createElement('p');
            list.textContent = CONSTANTS.TEXTS.PROMOTION_HEADING;

            const teamsWithStatus = [
                ...firstPlaceTeams.map(t => ({ ...t, status: '(1st)' })),
                ...bestSecondPlaceTeams.map(t => ({ ...t, status: '(Best 2nd)' }))
            ];

            if (teamsWithStatus.length === 0) {
                list.appendChild(document.createTextNode(CONSTANTS.TEXTS.NO_PROMOTION_DATA));
            } else {
                teamsWithStatus.forEach((t, index) => {
                    const teamLink = document.createElement('a');
                    teamLink.href = `/?p=team&tid=${t.tid}`;
                    teamLink.target = '_blank';
                    teamLink.textContent = t.name;

                    const statusText = document.createTextNode(` ${t.status}`);

                    list.appendChild(teamLink);
                    list.appendChild(statusText);

                    if (index < teamsWithStatus.length - 1) {
                        list.appendChild(document.createTextNode(', '));
                    }
                });
            }

            container.appendChild(list);
            return container;
        }

        /**
         * Determines promotion rules based on league type and division.
         * @param {string} leagueType - The selected league type.
         * @param {string} tabName - The name of the active division/tab.
         * @returns {Object} An object { apply: boolean, secondPlaceSlots: number }.
         */
        getPromotionRules(leagueType, tabName) {
            if (CONSTANTS.LEAGUE_TYPES.ALL_YOUTH.includes(leagueType)) {
                if (tabName === CONSTANTS.DIVISION.NAMES.DIV_1) return { apply: true, secondPlaceSlots: 1 };
                if (tabName === CONSTANTS.DIVISION.NAMES.DIV_2) return { apply: true, secondPlaceSlots: 3 };
            }
            return { apply: false, secondPlaceSlots: 0 };
        }

        /**
         * Parses a table row (TR) into a standardized TeamData object.
         * @param {HTMLTableRowElement} row - The <tr> element.
         * @returns {TeamData | null} A TeamData object or null if parsing fails.
         */
        parseTeamDataFromRow(row) {
            if (!row || row.cells.length < 10) return null;
            try {
                const cells = row.cells;
                const link = cells[1]?.querySelector(CONSTANTS.SELECTORS.TEAM_LINK);
                if (!link) return null;

                const teamData = {
                    position: parseInt(cells[0]?.textContent.trim(), 10),
                    name: link.textContent.trim(),
                    tid: link.href.match(CONSTANTS.REGEX.TEAM_ID)[1],
                    points: parseInt(cells[9]?.textContent.trim(), 10),
                    goalDifference: parseInt(cells[8]?.textContent.trim(), 10),
                    goalsFor: parseInt(cells[6]?.textContent.trim(), 10)
                };

                for (const key in teamData) {
                    if (key !== 'name' && key !== 'tid' && isNaN(teamData[key])) return null;
                }
                return teamData;
            } catch {
                return null;
            }
        }

        /**
         * Renders a loading animation overlay inside a container.
         * @param {HTMLElement} container - The element to clear and append the loader to.
         * @param {boolean} [isFullscreen=false] - Whether the overlay should cover the full screen.
         * @returns {HTMLElement} The loading overlay element.
         */
        renderLoading(container, isFullscreen = false) {
            const overlay = document.createElement('div');
            overlay.className = CONSTANTS.SELECTORS.LOADING_OVERLAY.slice(1);
            if (isFullscreen) {
                overlay.classList.add('fullscreen');
            }
            overlay.innerHTML = `<div class="loader"></div><div class="loading-text">${CONSTANTS.TEXTS.LOADING}</div>`;

            if (container) {
                container.innerHTML = '';
                container.appendChild(overlay);
            } else {
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        /**
         * Fetches the HTML for a single league table from the MZ AJAX endpoint.
         * @param {number} sid - The league series ID.
         * @param {string} leagueType - The league type.
         * @param {number} divisionCount - The sub-division number (e.g., 1 for Div 1.1).
         * @param {string} region - The region/country name.
         * @returns {Promise<Object | null>} A promise resolving to table data or null on failure.
         */
        async fetchLeagueTable(sid, leagueType, divisionCount, region) {
            try {
                const url = CONSTANTS.API.BASE_URL + CONSTANTS.API.LEAGUE_TABLE_PARAMS(leagueType, sid, this.leagueManager.teamId, this.leagueManager.sport);
                const response = await fetch(url);
                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                const table = doc.querySelector(CONSTANTS.SELECTORS.NICE_TABLE);
                if (!table) return null;

                table.querySelectorAll(CONSTANTS.SELECTORS.LEAGUE_LINK).forEach(link => {
                    const tidMatch = link.href.match(CONSTANTS.REGEX.TEAM_ID);
                    if (tidMatch) {
                        link.href = `/?p=team&tid=${tidMatch[1]}`;
                        link.target = '_blank';
                    }
                });
                return { table, divisionCount, region, sid };
            } catch {
                return null;
            }
        }

        /**
         * Calculates the sub-division number for Uxx leagues.
         * @param {string} leagueName - The name of the division (e.g., "Division 1").
         * @param {number} index - The index of the league in the array.
         * @returns {number} The calculated sub-division number.
         */
        calculateDivisionCount(leagueName, index) {
            if (leagueName === CONSTANTS.DIVISION.NAMES.DIV_1) return (index % 3) + 1;
            if (leagueName === CONSTANTS.DIVISION.NAMES.DIV_2) return (index % 9) + 1;
            return index + 1;
        }

        /**
         * Creates the <p> element used as a title above each league table.
         * @param {string} selectedLeague - The name of the division (e.g., "Division 1").
         * @param {number} divisionCount - The sub-division number (e.g., 3 for Div 1.3).
         * @param {string} leagueType - The league type.
         * @param {string} region - The region/country name.
         * @param {number} sid - The league series ID.
         * @returns {HTMLElement} The configured <p> element.
         */
        createLeagueTitle(selectedLeague, divisionCount, leagueType, region, sid) {
            const p = document.createElement('p');
            p.className = 'league-table-title';

            const leagueName = !selectedLeague.startsWith('Division') ? selectedLeague : `${selectedLeague.replace('Division', 'Div')}.${divisionCount}`;
            const typeName = leagueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let finalTitle = `${leagueName} ${typeName}`;
            if (region && region !== 'World' && region !== CONSTANTS.TEXTS.ALL_REGIONS) {
                finalTitle += ` - ${region}`;
            }

            const a = document.createElement('a');
            a.textContent = finalTitle;
            a.href = `https://www.managerzone.com/?p=league&type=${leagueType}&sid=${sid}`;
            a.target = '_blank';

            p.appendChild(a);
            return p;
        }
    }

    if (document.querySelector(CONSTANTS.SELECTORS.TEAM_INFO)) {
        const leagueManager = new LeagueManager();
        const uiManager = new UIManager(leagueManager);
        uiManager.initializeInterface();
    }
})();