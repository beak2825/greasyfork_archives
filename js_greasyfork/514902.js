// ==UserScript==
// @name         Confrérie des Traducteurs - NexusMods Redirector
// @namespace    https://discord.gg/sJDzeCZCa3
// @version      1.3.0
// @description  Find French translations of NexusMods mods on Confrérie des Traducteurs
// @author       chunchunmaru (alexbdka)
// @icon         https://i.ibb.co/55r0z7m/confrerie-des-traducteurs-small.png
// @match        https://www.nexusmods.com/skyrimspecialedition/*
// @match        https://www.nexusmods.com/skyrim/*
// @match        https://www.nexusmods.com/oblivion/*
// @match        https://www.nexusmods.com/morrowind/*
// @match        https://www.nexusmods.com/fallout4/*
// @match        https://www.nexusmods.com/newvegas/*
// @match        https://www.nexusmods.com/fallout3/*
// @grant        GM_xmlhttpRequest
// @connect      www.confrerie-des-traducteurs.fr
// @downloadURL https://update.greasyfork.org/scripts/514902/Confr%C3%A9rie%20des%20Traducteurs%20-%20NexusMods%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/514902/Confr%C3%A9rie%20des%20Traducteurs%20-%20NexusMods%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        // Search parameters
        levenshteinRatio: 0.30,
        searchOrder: ['authors', 'uploader', 'title'],
        debugMode: true,

        // Author parsing
        authorSeparators: ['-', ',', ' and ', '&', '+'],
        createdByText: 'Created by',

        // DOM Selectors
        selectors: {
            modTitle: "#pagetitle > h1",
            uploader: "#fileinfo > div:nth-child(5) > a",
        },

        // UI configuration
        button: {
            position: { bottom: '20px', right: '20px' },
            colors: {
                default: '#e6ccaa',
                success: '#5cb85c',
                warning: '#f0ad4e',
                error: '#d9534f'
            },
            text: {
                default: 'Traduction<br>Française',
                success: 'Traduction trouvée !',
                notFound: 'Pas de traduction',
                error: 'Erreur'
            }
        },

        // Game specific URLs
        gameUrls: {
            'skyrimspecialedition': "https://www.confrerie-des-traducteurs.fr/skyrim/recherche/simple",
            'skyrim': "https://www.confrerie-des-traducteurs.fr/skyrim/recherche/simple",
            'oblivion': "https://www.confrerie-des-traducteurs.fr/oblivion/recherche/simple",
            'morrowind': "https://www.confrerie-des-traducteurs.fr/morrowind/recherche/simple",
            'fallout4': "https://www.confrerie-des-traducteurs.fr/fallout4/recherche/simple",
            'newvegas': "https://www.confrerie-des-traducteurs.fr/fallout-new-vegas/recherche/simple",
            'fallout3': "https://www.confrerie-des-traducteurs.fr/fallout3/recherche/simple"
        }
    };

    class Logger {
        static info(message, data = null) {
            if (CONFIG.debugMode) {
                console.log(`[CdT] 📘 ${message}`, data || '');
            }
        }

        static warning(message, data = null) {
            if (CONFIG.debugMode) {
                console.warn(`[CdT] ⚠️ ${message}`, data || '');
            }
        }

        static error(message, error = null) {
            if (CONFIG.debugMode) {
                console.error(`[CdT] 🔴 ${message}`, error || '');
            }
        }

        static success(message, data = null) {
            if (CONFIG.debugMode) {
                console.log(`[CdT] ✅ ${message}`, data || '');
            }
        }
    }

    class ModInfoExtractor {
        static getModInfo() {
            const modTitle = document.querySelector(CONFIG.selectors.modTitle)?.innerText.trim();
            const uploader = document.querySelector(CONFIG.selectors.uploader)?.innerText.trim();
            const authors = this.extractAuthors();

            Logger.info('Extracted mod information', {
                title: modTitle,
                uploader: uploader,
                authors: authors
            });

            return { modTitle, uploader, authors };
        }

        static extractAuthors() {
            // Trouver tous les éléments .sideitem
            const sideItems = document.querySelectorAll('.sideitem');
            let authors = [];

            // Parcourir les éléments pour trouver celui qui contient "Created by"
            for (const item of sideItems) {
                const h3 = item.querySelector('h3');
                if (h3 && h3.textContent.trim() === CONFIG.createdByText) {
                    // Obtenir le texte qui suit le h3
                    const authorsText = item.textContent
                        .replace(h3.textContent, '') // Enlever le "Created by"
                        .trim();

                    // Diviser par les séparateurs possibles
                    authors = CONFIG.authorSeparators.reduce((acc, separator) => {
                        return acc.flatMap(author => author.split(separator));
                    }, [authorsText]);

                    // Nettoyer les résultats
                    authors = authors
                        .map(author => author.trim())
                        .filter(author => author.length > 0);

                    break;
                }
            }

            Logger.info('Extracted authors', { authors });
            return authors;
        }
    }

    class ModSearcher {
        constructor() {
            this.gameCategory = window.location.pathname.split('/')[1];
            this.searchBaseUrl = this.getSearchBaseUrl();
            this.gameParams = this.getGameParams();
            const { modTitle, uploader, authors } = ModInfoExtractor.getModInfo();

            this.modTitle = modTitle;
            this.uploader = uploader;
            this.authors = authors;

            if (!this.modTitle) {
                Logger.error('Failed to extract mod title from page');
            }
        }

        getSearchBaseUrl() {
            return CONFIG.gameUrls[this.gameCategory] || CONFIG.gameUrls['skyrim'];
        }

        getGameParams() {
            if (this.gameCategory.includes("skyrimspecialedition")) {
                return { skyrim: 0, skyrimSE: 1 };
            } else if (this.gameCategory.includes("skyrim")) {
                return { skyrim: 1, skyrimSE: 0 };
            }
            return {};
        }

        async startSearch() {
            Logger.info('Starting search process with strategy order:', CONFIG.searchOrder);

            for (const strategy of CONFIG.searchOrder) {
                let result = null;

                switch (strategy) {
                    case 'authors':
                        if (this.authors.length > 0) {
                            Logger.info('Trying authors search', { authors: this.authors });
                            // Try each author until we find a match
                            for (const author of this.authors) {
                                result = await this.searchByCreator(author, 'author');
                                if (result) break;
                            }
                        }
                        break;

                    case 'uploader':
                        if (this.uploader) {
                            Logger.info('Trying uploader search', { uploader: this.uploader });
                            result = await this.searchByCreator(this.uploader, 'uploader');
                        }
                        break;

                    case 'title':
                        Logger.info('Trying title search', { title: this.modTitle });
                        result = await this.searchByTitle();
                        break;
                }

                if (result) {
                    Logger.success(`Found match using ${strategy} search`);
                    return result;
                }
                Logger.warning(`No match found using ${strategy} search`);
            }

            return null;
        }

        async searchByCreator(creator, type) {
            Logger.info(`Searching by ${type}`, { creator });

            const params = new URLSearchParams({
                term: creator.replace(/\s+/g, "_"),
                authors: 1,
                name: 0,
                nameVO: 0,
                description: 0,
                ...this.gameParams
            });

            try {
                const response = await this.makeRequest(params);
                const data = JSON.parse(response.responseText);
                const creatorMods = data.Entries.map(entry => ({
                    name: entry.OriginalName,
                    link: entry.Link
                }));

                Logger.info(`${type} search results`, {
                    modsFound: creatorMods.length
                });

                return this.findBestMatch(creatorMods);
            } catch (error) {
                Logger.error(`${type} search failed`, error);
                return null;
            }
        }

        async searchByTitle() {
            const params = new URLSearchParams({
                term: this.modTitle.replace(/\s+/g, "_"),
                authors: 0,
                name: 1,
                nameVO: 1,
                description: 0,
                ...this.gameParams
            });

            try {
                const response = await this.makeRequest(params);
                const data = JSON.parse(response.responseText);
                const titleMods = data.Entries.map(entry => ({
                    name: entry.OriginalName,
                    link: entry.Link
                }));

                return this.findBestMatch(titleMods);
            } catch (error) {
                Logger.error('Title search failed', error);
                return null;
            }
        }

        makeRequest(params) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: this.searchBaseUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'User-Agent': 'Mozilla/5.0',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: params.toString(),
                    onload: resolve,
                    onerror: reject
                });
            });
        }

        findBestMatch(possibleMods) {
            let bestMatch = null;
            let lowestRatio = 1;
            const normalizedModTitle = this.normalizeString(this.modTitle);

            for (const mod of possibleMods) {
                const normalizedModName = this.normalizeString(mod.name);
                const distance = this.levenshteinDistance(normalizedModTitle, normalizedModName);
                const ratio = distance / Math.max(normalizedModTitle.length, normalizedModName.length);

                Logger.info('Comparing titles', {
                    original: mod.name,
                    normalized: normalizedModName,
                    ratio: ratio.toFixed(3)
                });

                if (ratio <= CONFIG.levenshteinRatio && ratio < lowestRatio) {
                    lowestRatio = ratio;
                    bestMatch = mod;
                }
            }

            if (bestMatch) {
                Logger.success('Found best match', {
                    name: bestMatch.name,
                    ratio: lowestRatio.toFixed(3)
                });
            }

            return bestMatch;
        }

        normalizeString(str) {
            return str.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, '')
                .trim();
        }

        levenshteinDistance(a, b) {
            const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
            for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    matrix[i][j] = b[i - 1] === a[j - 1]
                        ? matrix[i - 1][j - 1]
                        : Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                }
            }

            return matrix[b.length][a.length];
        }
    }

    /**
     * UI class handling the button creation and state management
     */
    class UI {
        constructor() {
            this.container = this.createButtonContainer();
            this.button = this.container.querySelector('button');
            document.body.appendChild(this.container);

            // Initialize search functionality
            const searcher = new ModSearcher();
            this.button.addEventListener('click', async () => {
                this.setButtonState('loading');
                const result = await searcher.startSearch();

                if (result) {
                    const translationLink = "https://www.confrerie-des-traducteurs.fr" + result.link;
                    window.open(translationLink, "_blank");
                    this.setButtonState('success');
                } else {
                    this.setButtonState('not-found');
                }
            });
        }

        /**
         * Create the button container with styling
         */
        createButtonContainer() {
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed',
                bottom: CONFIG.button.position.bottom,
                right: CONFIG.button.position.right,
                zIndex: '1000'
            });

            const button = document.createElement('button');
            button.innerHTML = `
                <span style="display: flex; align-items: center; font-family: 'Brush Script MT', cursive; color: #4b3929;">
                    <img src="https://i.ibb.co/55r0z7m/confrerie-des-traducteurs-small.png"
                         alt="Confrérie"
                         style="vertical-align: middle; width: 40px; height: 40px; margin-right: 10px;">
                    ${CONFIG.button.text.default}
                </span>
            `;

            Object.assign(button.style, {
                margin: '5px',
                padding: '15px 20px',
                backgroundColor: CONFIG.button.colors.default,
                color: '#4b3929',
                border: '2px solid #4b3929',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
            });

            container.appendChild(button);
            return container;
        }

        /**
         * Update button state and appearance
         */
        setButtonState(state) {
            this.button.disabled = state === 'loading';

            switch (state) {
                case 'loading':
                    this.button.style.backgroundColor = CONFIG.button.colors.default;
                    this.button.innerHTML = 'Recherche...';
                    break;
                case 'success':
                    this.button.style.backgroundColor = CONFIG.button.colors.success;
                    this.button.innerHTML = CONFIG.button.text.success;
                    break;
                case 'not-found':
                    this.button.style.backgroundColor = CONFIG.button.colors.warning;
                    this.button.innerHTML = CONFIG.button.text.notFound;
                    break;
                case 'error':
                    this.button.style.backgroundColor = CONFIG.button.colors.error;
                    this.button.innerHTML = CONFIG.button.text.error;
                    break;
            }
        }
    }

    // Initialize the UI when the document is ready
    new UI();
})();
