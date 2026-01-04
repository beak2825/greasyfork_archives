// ==UserScript==
// @name         Infornia FR Skribbl Pro
// @namespace    https://greasyfork.org/en/users/1084087-fermion
// @version      2.0.0
// @description  Script amélioré pour Skribbl.io avec 336k+ mots français et gestion des mots composés
// @author       fermion
// @match        http*://www.skribbl.io/*
// @match        http*://skribbl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539030/Infornia%20FR%20Skribbl%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/539030/Infornia%20FR%20Skribbl%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class InforniaSkribblPro {
        constructor() {
            // Configuration
            this.config = {
                maxDisplayWords: 150,
                cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 jours
                wordSources: [
                    'https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json',
                    'https://raw.githubusercontent.com/gameyoga/open-skribbl-io/master/resources/words/fr'
                ]
            };

            // État du jeu
            this.correctAnswers = GM_getValue('correctAnswers', []);
            this.allFrenchWords = GM_getValue('allFrenchWords', []);
            this.lastUpdate = GM_getValue('lastWordUpdate', 0);
            this.possibleWords = [];
            this.tempWords = [];
            this.alreadyGuessed = [];
            this.closeWord = '';
            this.myName = '';
            this.players = {};

            // Interface
            this.visibilityState = GM_getValue('parentElementVisible', true);
            this.adminList = [1416559798, 2091817853];

            // Initialisation
            this.init();
        }

        async init() {
            this.createInterface();
            await this.loadWordDictionary();
            this.setupObservers();
            this.setupEventListeners();
            this.updateInterfaceVisibility();
        }

        // === GESTION DES MOTS ===
        async loadWordDictionary() {
            const now = Date.now();

            // Vérifier si une mise à jour est nécessaire
            if (this.allFrenchWords.length === 0 || (now - this.lastUpdate) > this.config.cacheExpiry) {
                console.log('📚 Chargement du dictionnaire français...');
                await this.fetchAllWords();
            } else {
                console.log('📚 Dictionnaire chargé depuis le cache (' + this.allFrenchWords.length + ' mots)');
            }
        }

        async fetchAllWords() {
            const allWords = new Set(this.correctAnswers);

            for (const source of this.config.wordSources) {
                try {
                    const words = await this.fetchWordsFromSource(source);
                    words.forEach(word => {
                        if (this.isValidFrenchWord(word)) {
                            allWords.add(word.toLowerCase());
                        }
                    });
                    console.log(`✅ Chargé ${words.length} mots depuis ${source}`);
                } catch (error) {
                    console.warn(`❌ Erreur lors du chargement depuis ${source}:`, error);
                }
            }

            this.allFrenchWords = Array.from(allWords).sort();
            GM_setValue('allFrenchWords', this.allFrenchWords);
            GM_setValue('lastWordUpdate', Date.now());

            console.log(`🎯 Dictionnaire final: ${this.allFrenchWords.length} mots français`);
        }

        fetchWordsFromSource(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            let words;
                            if (url.includes('.json')) {
                                words = JSON.parse(response.responseText);
                            } else {
                                words = response.responseText.split('\n').map(w => w.trim()).filter(w => w);
                            }
                            resolve(words);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: reject,
                    ontimeout: reject,
                    timeout: 10000
                });
            });
        }

        isValidFrenchWord(word) {
            if (!word || word.length < 2) return false;

            // Autoriser lettres françaises, traits d'union, espaces et apostrophes
            const frenchPattern = /^[a-zàâäéèêëîïôöùûüÿç\s\-']+$/i;

            if (!frenchPattern.test(word)) return false;

            // Filtrer les mots trop techniques ou inappropriés
            const blacklist = ['http', 'www', '.com', '.fr', 'admin', 'password'];
            return !blacklist.some(banned => word.toLowerCase().includes(banned));
        }

        isCompoundWord(word) {
            // Détection des mots composés français
            const compoundPatterns = [
                /\w+-\w+/,           // trait d'union
                /\w+'\w+/,           // apostrophe
                /\w+\s+\w+/,         // espace
                /^(après|arrière|avant|demi|mi|outre|sans|semi|sous|sur)-/i,  // préfixes courants
                /-(ci|là|même|moi|toi|lui|elle|nous|vous)$/i                   // suffixes courants
            ];

            return compoundPatterns.some(pattern => pattern.test(word));
        }

        // === INTERFACE UTILISATEUR ===
        createInterface() {
            this.createParentContainer();
            this.createControlPanel();
            this.createWordDisplay();
            this.createStatsPanel();
        }

        createParentContainer() {
            this.parentElement = document.createElement('div');
            this.parentElement.style.cssText = `
                position: fixed;
                bottom: 0;
                right: 0;
                width: 100%;
                height: auto;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            document.body.appendChild(this.parentElement);
        }

        createControlPanel() {
            this.controlPanel = document.createElement('div');
            this.controlPanel.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
            `;

            // Titre et stats
            this.titleElement = document.createElement('div');
            this.titleElement.style.cssText = `
                color: white;
                font-weight: bold;
                font-size: 14px;
            `;
            this.titleElement.innerHTML = '🎨 Infornia FR Skribbl Pro';

            this.statsElement = document.createElement('div');
            this.statsElement.style.cssText = `
                color: rgba(255,255,255,0.9);
                font-size: 12px;
            `;

            // Boutons de contrôle
            this.controlButtons = document.createElement('div');
            this.createControlButtons();

            this.controlPanel.appendChild(this.titleElement);
            this.controlPanel.appendChild(this.statsElement);
            this.controlPanel.appendChild(this.controlButtons);
            this.parentElement.appendChild(this.controlPanel);
        }

        createControlButtons() {
            const buttons = [
                { text: '📥', title: 'Exporter mots', action: () => this.exportNewWords() },
                { text: '🔄', title: 'Actualiser dictionnaire', action: () => this.refreshDictionary() },
                { text: '👁️', title: 'Masquer/Afficher (F2)', action: () => this.toggleVisibility() }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.style.cssText = `
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 6px 10px;
                    margin-left: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                `;
                button.innerHTML = btn.text;
                button.title = btn.title;
                button.addEventListener('click', btn.action);
                button.addEventListener('mouseenter', () => {
                    button.style.background = 'rgba(255,255,255,0.3)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.background = 'rgba(255,255,255,0.2)';
                });
                this.controlButtons.appendChild(button);
            });
        }

        createWordDisplay() {
            this.wordContainer = document.createElement('div');
            this.wordContainer.style.cssText = `
                background: linear-gradient(to bottom, #fafafa, #f0f0f0);
                max-height: 250px;
                overflow-y: auto;
                padding: 12px;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            `;
            this.parentElement.appendChild(this.wordContainer);
        }

        createStatsPanel() {
            this.updateStats();
        }

        updateStats() {
            if (this.statsElement) {
                const stats = `📚 ${this.allFrenchWords.length.toLocaleString()} mots | 🎯 ${this.possibleWords.length} suggestions`;
                this.statsElement.innerHTML = stats;
            }
        }

        // === GÉNÉRATION DES SUGGESTIONS ===
        generateGuesses() {
            const hintElements = Array.from(document.querySelectorAll('.hints .hint'));
            const inputElement = document.querySelector('#game-chat input[data-translate="placeholder"]');

            if (!hintElements.length) return;

            const pattern = this.buildPatternFromHints(hintElements);
            const inputText = inputElement?.value || '';

            this.filterWordsByPattern(pattern, inputText);
            this.applyCloseWordFilter();
            this.removeGuessedWords();
            this.sortWordsByRelevance(inputText);

            this.displayWords();
            this.updateStats();
        }

        buildPatternFromHints(hintElements) {
            return hintElements.map(elem => {
                const text = elem.textContent;
                return text === '_' ? '.' : text;
            }).join('').split(' ');
        }

        filterWordsByPattern(pattern, inputText) {
            this.tempWords = this.allFrenchWords.filter(word => {
                // Filtrer les mots déjà devinés
                if (this.alreadyGuessed.includes(word)) return false;

                // Vérifier la correspondance avec le pattern
                const wordParts = word.split(' ');
                if (wordParts.length !== pattern.length) return false;

                // Vérifier chaque partie
                for (let i = 0; i < wordParts.length; i++) {
                    if (wordParts[i].length !== pattern[i].length) return false;

                    const regex = new RegExp(`^${pattern[i]}$`, 'i');
                    if (!regex.test(wordParts[i])) return false;
                }

                return true;
            });

            // Filtrer par saisie utilisateur
            if (inputText.trim()) {
                const inputRegex = new RegExp(`^${inputText}`, 'i');
                this.possibleWords = this.tempWords.filter(word => inputRegex.test(word));
            } else {
                this.possibleWords = [...this.tempWords];
            }
        }

        applyCloseWordFilter() {
            if (this.closeWord && this.closeWord.length > 0) {
                this.possibleWords = this.possibleWords.filter(word =>
                    this.levenshteinDistance(word.toLowerCase(), this.closeWord.toLowerCase()) <= 2
                );
            }
        }

        removeGuessedWords() {
            this.possibleWords = this.possibleWords.filter(word =>
                !this.alreadyGuessed.some(guessed =>
                    guessed.toLowerCase() === word.toLowerCase()
                )
            );
        }

        sortWordsByRelevance(inputText) {
            this.possibleWords.sort((a, b) => {
                // Priorité aux mots composés si approprié
                const aIsCompound = this.isCompoundWord(a);
                const bIsCompound = this.isCompoundWord(b);

                // Si l'un est composé et l'autre non
                if (aIsCompound && !bIsCompound) return -1;
                if (!aIsCompound && bIsCompound) return 1;

                // Priorité à la longueur similaire à la saisie
                if (inputText) {
                    const aDiff = Math.abs(a.length - inputText.length);
                    const bDiff = Math.abs(b.length - inputText.length);
                    if (aDiff !== bDiff) return aDiff - bDiff;
                }

                // Alphabétique
                return a.localeCompare(b, 'fr');
            });
        }

        displayWords() {
            this.wordContainer.innerHTML = '';

            if (this.possibleWords.length === 0) {
                this.showNoResultsMessage();
                return;
            }

            const displayWords = this.possibleWords.slice(0, this.config.maxDisplayWords);
            displayWords.forEach((word, index) => this.createWordElement(word, index, displayWords.length));

            if (this.possibleWords.length > this.config.maxDisplayWords) {
                this.showMoreResultsIndicator();
            }
        }

        createWordElement(word, index, total) {
            const element = document.createElement('div');

            // Calcul de la couleur basée sur la position
            const hue = total > 1 ? Math.floor(240 * (1 - index / (total - 1))) : 240; // Du bleu au rouge
            const isCompound = this.isCompoundWord(word);

            element.style.cssText = `
                background: ${isCompound ?
                    `linear-gradient(45deg, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 60%))` :
                    `hsl(${hue}, 70%, 60%)`
                };
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: ${isCompound ? 'bold' : '500'};
                font-size: 13px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
                border: ${isCompound ? '2px solid rgba(255,255,255,0.3)' : 'none'};
                position: relative;
            `;

            element.textContent = word;

            // Indicateur de mot composé
            if (isCompound) {
                const indicator = document.createElement('span');
                indicator.style.cssText = `
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: #ff6b6b;
                    color: white;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                `;
                indicator.textContent = '✦';
                element.appendChild(indicator);
            }

            this.addWordElementEvents(element, word, hue, isCompound);
            this.wordContainer.appendChild(element);
        }

        addWordElementEvents(element, word, hue, isCompound) {
            // Hover effects
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px) scale(1.02)';
                element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                element.style.background = isCompound ?
                    `linear-gradient(45deg, hsl(${hue}, 80%, 70%), hsl(${hue + 30}, 80%, 70%))` :
                    `hsl(${hue}, 80%, 70%)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = 'none';
                element.style.background = isCompound ?
                    `linear-gradient(45deg, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 60%))` :
                    `hsl(${hue}, 70%, 60%)`;
            });

            // Click pour soumettre
            element.addEventListener('click', () => this.submitWord(word));
        }

        submitWord(word) {
            const inputElement = document.querySelector('#game-chat input[data-translate="placeholder"]');
            const formElement = document.querySelector('#game-chat form');

            if (inputElement && formElement) {
                inputElement.value = word;
                formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }

        showNoResultsMessage() {
            const message = document.createElement('div');
            message.style.cssText = `
                text-align: center;
                color: #666;
                font-style: italic;
                padding: 20px;
                width: 100%;
            `;
            message.innerHTML = '🤔 Aucun mot trouvé. Essayez de modifier votre saisie.';
            this.wordContainer.appendChild(message);
        }

        showMoreResultsIndicator() {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                background: #6c757d;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                text-align: center;
                cursor: pointer;
            `;
            indicator.textContent = `... et ${this.possibleWords.length - this.config.maxDisplayWords} autres mots`;
            this.wordContainer.appendChild(indicator);
        }

        // === OBSERVATEURS ===
        setupObservers() {
            this.observeHints();
            this.observeChat();
            this.observePlayers();
            this.observeInput();
        }

        observeHints() {
            const targetNodes = [
                document.querySelector('.hints .container'),
                document.querySelector('.words'),
                document.querySelector('#game-word')
            ].filter(Boolean);

            const observer = new MutationObserver(() => {
                this.checkRevealedHints();
                this.checkWordsElement();
                this.generateGuesses();
            });

            targetNodes.forEach(node => {
                observer.observe(node, { childList: true, subtree: true });
            });
        }

        observeChat() {
            const chatContainer = document.querySelector('.chat-content');
            if (!chatContainer) return;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        this.processChatMessage(mutation.addedNodes[0]);
                    }
                });
            });

            observer.observe(chatContainer, { childList: true });
        }

        observePlayers() {
            const playersContainer = document.querySelector(".players-list");
            if (!playersContainer) return;

            const observer = new MutationObserver(() => this.updatePlayersList());
            observer.observe(playersContainer, { childList: true, subtree: true });
        }

        observeInput() {
            const inputElement = document.querySelector('#game-chat input[data-translate="placeholder"]');
            if (!inputElement) return;

            inputElement.addEventListener('input', () => this.generateGuesses());
            inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // === GESTION DES ÉVÉNEMENTS ===
        setupEventListeners() {
            // Raccourci clavier F2
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F2') {
                    e.preventDefault();
                    this.toggleVisibility();
                }
            });
        }

        handleKeyDown(event) {
            if (event.key === 'Tab' && this.possibleWords.length > 0) {
                event.preventDefault();
                const inputElement = document.querySelector('#game-chat input[data-translate="placeholder"]');
                inputElement.value = this.possibleWords[0];
                this.generateGuesses();
            }
        }

        // === TRAITEMENT DES MESSAGES ===
        processChatMessage(messageNode) {
            const message = messageNode.textContent;
            const style = window.getComputedStyle(messageNode);

            // Message "is close!"
            if (style.color === 'rgb(226, 203, 0)' && message.includes('is close!')) {
                this.closeWord = message.split(' ')[0];
            }

            // Nouveau round
            if (style.color === 'rgb(57, 117, 206)') {
                this.resetRoundState();
            }

            // Message de joueur
            if (message.includes(': ')) {
                const [username, guess] = message.split(': ');
                this.processPlayerGuess(username, guess, messageNode);
            }

            this.generateGuesses();
        }

        processPlayerGuess(username, guess, messageNode) {
            if (!this.alreadyGuessed.includes(guess)) {
                this.alreadyGuessed.push(guess);
            }

            // Vérification admin
            for (const playerId in this.players) {
                if (this.players[playerId]?.name === username &&
                    this.adminList.includes(Number(playerId))) {

                    this.styleAdminMessage(messageNode);

                    // Protection anti-ban
                    if (this.messageSearch(guess).toLowerCase().includes(this.myName.toLowerCase())) {
                        this.handleAdminThreat();
                    }
                    break;
                }
            }
        }

        styleAdminMessage(messageNode) {
            messageNode.style.cssText = `
                background: linear-gradient(to right, #fc2d2d 40%, #750000 60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            `;
        }

        handleAdminThreat() {
            if (confirm('⚠️ Un administrateur vous a mentionné. Quitter la partie ?')) {
                window.location.href = 'https://skribbl.io/';
            }
        }

        resetRoundState() {
            this.tempWords = [...this.allFrenchWords];
            this.alreadyGuessed = [];
            this.closeWord = '';
        }

        // === VÉRIFICATIONS ===
        checkRevealedHints() {
            const hintElements = Array.from(document.querySelectorAll('.hints .hint'));

            if (hintElements.every(elem => elem.classList.contains('uncover'))) {
                const answer = hintElements.map(elem => elem.textContent).join('').trim().toLowerCase();

                if (answer && this.isValidFrenchWord(answer) && !this.correctAnswers.includes(answer)) {
                    this.correctAnswers.push(answer);
                    GM_setValue('correctAnswers', this.correctAnswers);
                }
            }
        }

        checkWordsElement() {
            const wordElements = Array.from(document.querySelectorAll('.words.show .word'));

            wordElements.forEach(elem => {
                const word = elem.textContent.trim().toLowerCase();

                if (this.isValidFrenchWord(word) && !this.correctAnswers.includes(word)) {
                    this.correctAnswers.push(word);
                    GM_setValue('correctAnswers', this.correctAnswers);
                }
            });
        }

        // === UTILITAIRES ===
        levenshteinDistance(a, b) {
            const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

            for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
            for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

            for (let j = 1; j <= b.length; j++) {
                for (let i = 1; i <= a.length; i++) {
                    matrix[j][i] = b[j-1] === a[i-1] ?
                        matrix[j-1][i-1] :
                        Math.min(matrix[j-1][i-1] + 1, matrix[j][i-1] + 1, matrix[j-1][i] + 1);
                }
            }

            return matrix[b.length][a.length];
        }

        messageSearch(str) {
            return str.toUpperCase().replace(/[A-Z]/g, char => {
                const code = char.charCodeAt(0);
                return String.fromCharCode(((code + 13) <= 90) ? code + 13 : (code + 13) % 90 + 64);
            });
        }

        generateID(inputString) {
            let hash = 0;
            for (let i = 0; i < inputString.length; i++) {
                hash = ((hash << 5) - hash) + inputString.charCodeAt(i);
                hash |= 0;
            }
            return Math.abs(hash).toString();
        }

        // === GESTION DES JOUEURS ===
        updatePlayersList() {
            const playerElements = document.querySelectorAll(".player");

            playerElements.forEach(playerElem => {
                const colorElem = playerElem.querySelector(".color");
                const eyesElem = playerElem.querySelector(".eyes");
                const mouthElem = playerElem.querySelector(".mouth");
                const nameElem = playerElem.querySelector(".player-name");

                if (!colorElem || !eyesElem || !mouthElem || !nameElem) return;

                let playerName = nameElem.textContent;
                const isMe = nameElem.classList.contains("me");

                if (isMe) {
                    playerName = playerName.replace(" (You)", "");
                    this.myName = playerName;
                }

                const playerId = this.generateID(
                    window.getComputedStyle(colorElem).backgroundPosition +
                    window.getComputedStyle(eyesElem).backgroundPosition +
                    window.getComputedStyle(mouthElem).backgroundPosition
                );

                if (this.adminList.includes(parseInt(playerId))) {
                    playerElem.style.background = "linear-gradient(to right, red, yellow)";
                    nameElem.style.fontWeight = "bold";
                }

                this.players[playerId] = {
                    element: playerElem,
                    name: playerName.trim()
                };
            });
        }

        // === CONTRÔLES ===
        toggleVisibility() {
            this.visibilityState = !this.visibilityState;
            this.updateInterfaceVisibility();
        }

        updateInterfaceVisibility() {
            this.parentElement.style.display = this.visibilityState ? 'block' : 'none';
            GM_setValue('parentElementVisible', this.visibilityState);
        }

        async refreshDictionary() {
            this.allFrenchWords = [];
            GM_setValue('lastWordUpdate', 0);
            await this.loadWordDictionary();
            this.generateGuesses();
            alert('✅ Dictionnaire actualisé avec succès !');
        }

        exportNewWords() {
            const newWords = this.correctAnswers.filter(word =>
                !this.allFrenchWords.includes(word)
            );

            if (newWords.length === 0) {
                alert('ℹ️ Aucun nouveau mot à exporter.');
                return;
            }

            const blob = new Blob([newWords.join('\n')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nouveaux_mots_${new Date().toISOString().split('T')[0]}.txt`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log(`📥 Exporté ${newWords.length} nouveaux mots`);
        }
    }

    // Initialisation du script
    console.log('🚀 Initialisation d\'Infornia FR Skribbl Pro...');
    new InforniaSkribblPro();

})();