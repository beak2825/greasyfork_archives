// ==UserScript==
// @name         Infornia FR Skribbl Pro v4.0
// @namespace    https://greasyfork.org/en/users/1084087-fermion
// @version      4.0.0
// @description  Script optimisé pour Skribbl.io avec interface compacte et mots basiques
// @author       fermion
// @match        http*://www.skribbl.io/*
// @match        http*://skribbl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539045/Infornia%20FR%20Skribbl%20Pro%20v40.user.js
// @updateURL https://update.greasyfork.org/scripts/539045/Infornia%20FR%20Skribbl%20Pro%20v40.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class InforniaSkribblProV3 {
        constructor() {
            this.config = {
                maxDisplayWords: 50, // Réduit pour une meilleure lisibilité
                maxInterfaceHeight: 25, // 25% de l'écran maximum
                cacheExpiry: 7 * 24 * 60 * 60 * 1000,
                sharedDatabaseURL: 'https://api.jsonbin.io/v3/b/your-bin-id', // Remplacer par votre URL
                basicWordsOnly: true
            };

            // Mots de base français (sans racines répétées)
            this.basicWords = [
                'chat', 'chien', 'oiseau', 'maison', 'voiture', 'arbre', 'fleur', 'soleil',
                'lune', 'eau', 'feu', 'terre', 'air', 'livre', 'table', 'chaise',
                'porte', 'fenêtre', 'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc',
                'grand', 'petit', 'haut', 'bas', 'vite', 'lent', 'bon', 'mal',
                'jour', 'nuit', 'matin', 'soir', 'pain', 'lait', 'pomme', 'orange',
                'main', 'pied', 'tête', 'corps', 'yeux', 'nez', 'bouche', 'oreille'
            ];

            this.correctAnswers = GM_getValue('correctAnswers', []);
            this.sharedWords = GM_getValue('sharedWords', []);
            this.allWords = [...new Set([...this.basicWords, ...this.correctAnswers, ...this.sharedWords])];
            this.possibleWords = [];
            this.alreadyGuessed = [];
            this.closeWord = '';
            this.isMinimized = GM_getValue('isMinimized', false);

            this.init();
        }

        async init() {
            this.createCompactInterface();
            await this.syncWithSharedDatabase();
            this.setupObservers();
            this.setupEventListeners();
        }

        createCompactInterface() {
            // Container principal - interface compacte
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                max-height: ${this.config.maxInterfaceHeight}vh;
                min-height: 40px;
                z-index: 10000;
                font-family: 'Segoe UI', system-ui, sans-serif;
                transition: all 0.3s ease;
                ${this.isMinimized ? 'height: 40px;' : 'height: auto;'}
            `;

            // Barre de contrôle compacte
            this.controlBar = document.createElement('div');
            this.controlBar.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                cursor: pointer;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
            `;

            // Informations sur la barre
            this.infoElement = document.createElement('div');
            this.infoElement.style.cssText = `
                color: white;
                font-size: 12px;
                font-weight: 500;
            `;
            this.infoElement.innerHTML = '🎨 Infornia Pro | 📚 Chargement...';

            // Boutons de contrôle
            this.controls = document.createElement('div');
            this.controls.style.cssText = 'display: flex; gap: 8px;';
            this.createControlButtons();

            this.controlBar.appendChild(this.infoElement);
            this.controlBar.appendChild(this.controls);

            // Zone de mots (collapsible)
            this.wordsArea = document.createElement('div');
            this.wordsArea.style.cssText = `
                background: #f8f9fa;
                max-height: calc(${this.config.maxInterfaceHeight}vh - 40px);
                overflow-y: auto;
                padding: 12px;
                display: ${this.isMinimized ? 'none' : 'flex'};
                flex-wrap: wrap;
                gap: 6px;
                border-top: 1px solid rgba(255,255,255,0.2);
            `;

            // Assemblage
            this.container.appendChild(this.controlBar);
            this.container.appendChild(this.wordsArea);
            document.body.appendChild(this.container);

            // Click pour minimiser/maximiser
            this.controlBar.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    this.toggleMinimize();
                }
            });
        }

        createControlButtons() {
            const buttons = [
                { icon: '🔄', title: 'Synchroniser', action: () => this.syncWithSharedDatabase() },
                { icon: '📥', title: 'Exporter', action: () => this.exportWords() },
                { icon: this.isMinimized ? '⬆️' : '⬇️', title: 'Réduire/Agrandir', action: () => this.toggleMinimize() }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.style.cssText = `
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s;
                `;
                button.innerHTML = btn.icon;
                button.title = btn.title;
                button.addEventListener('click', btn.action);
                this.controls.appendChild(button);
            });
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.wordsArea.style.display = this.isMinimized ? 'none' : 'flex';
            this.container.style.height = this.isMinimized ? '40px' : 'auto';
            GM_setValue('isMinimized', this.isMinimized);
            
            // Mettre à jour l'icône du bouton
            const toggleBtn = this.controls.children[2];
            toggleBtn.innerHTML = this.isMinimized ? '⬆️' : '⬇️';
        }

        // Filtrage intelligent des mots basiques
        filterBasicWords(words) {
            return words.filter(word => {
                // Garder seulement les mots courts et simples
                if (word.length > 10) return false;
                
                // Éviter les mots composés complexes
                if (word.includes('-') && word.split('-').length > 2) return false;
                
                // Éviter les variations trop similaires
                const rootPatterns = [
                    /^(.+)(er|ir|re|oir)$/, // verbes
                    /^(.+)(tion|sion|ment)$/, // suffixes communs
                    /^(.+)(ique|able|ible)$/ // adjectifs
                ];
                
                const root = this.extractRoot(word, rootPatterns);
                return !words.some(other => 
                    other !== word && 
                    this.extractRoot(other, rootPatterns) === root
                );
            });
        }

        extractRoot(word, patterns) {
            for (const pattern of patterns) {
                const match = word.match(pattern);
                if (match && match[1].length > 2) {
                    return match[1];
                }
            }
            return word;
        }

        async syncWithSharedDatabase() {
            try {
                // Simulation d'une base de données partagée
                // En production, remplacer par un vrai service
                const response = await this.makeRequest(this.config.sharedDatabaseURL);
                
                if (response && response.words) {
                    this.sharedWords = this.filterBasicWords(response.words);
                    GM_setValue('sharedWords', this.sharedWords);
                    this.updateWordList();
                }
                
                // Envoyer nos nouveaux mots
                if (this.correctAnswers.length > 0) {
                    await this.uploadNewWords();
                }
            } catch (error) {
                console.log('Synchronisation en mode hors ligne');
            }
        }

        makeRequest(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject,
                    timeout: 5000
                });
            });
        }

        updateWordList() {
            this.allWords = [...new Set([
                ...this.basicWords,
                ...this.correctAnswers,
                ...this.sharedWords
            ])];
            
            if (this.config.basicWordsOnly) {
                this.allWords = this.filterBasicWords(this.allWords);
            }
            
            this.updateInfo();
        }

        updateInfo() {
            const totalWords = this.allWords.length;
            const suggestions = this.possibleWords.length;
            this.infoElement.innerHTML = `🎨 Infornia Pro | 📚 ${totalWords} mots | 🎯 ${suggestions} suggestions`;
        }

        generateGuesses() {
            const hintElements = Array.from(document.querySelectorAll('.hints .hint'));
            if (!hintElements.length) return;

            const pattern = this.buildPattern(hintElements);
            this.filterByPattern(pattern);
            this.removeGuessedWords();
            this.sortByLength();
            
            // Limiter à 50 mots max
            this.possibleWords = this.possibleWords.slice(0, this.config.maxDisplayWords);
            
            this.displayWords();
            this.updateInfo();
        }

        buildPattern(hints) {
            return hints.map(elem => elem.textContent === '_' ? '.' : elem.textContent).join('');
        }

        filterByPattern(pattern) {
            const regex = new RegExp(`^${pattern}$`, 'i');
            this.possibleWords = this.allWords.filter(word => 
                regex.test(word) && !this.alreadyGuessed.includes(word.toLowerCase())
            );
        }

        removeGuessedWords() {
            this.possibleWords = this.possibleWords.filter(word =>
                !this.alreadyGuessed.includes(word.toLowerCase())
            );
        }

        sortByLength() {
            this.possibleWords.sort((a, b) => a.length - b.length);
        }

        displayWords() {
            this.wordsArea.innerHTML = '';
            
            if (this.possibleWords.length === 0) {
                const noResult = document.createElement('div');
                noResult.style.cssText = 'color: #666; font-style: italic; text-align: center; width: 100%; padding: 20px;';
                noResult.innerHTML = '🤔 Aucun mot trouvé';
                this.wordsArea.appendChild(noResult);
                return;
            }

            this.possibleWords.forEach((word, index) => {
                const wordElement = document.createElement('div');
                const hue = 240 - (index * 240 / Math.max(this.possibleWords.length - 1, 1));
                
                wordElement.style.cssText = `
                    background: hsl(${hue}, 70%, 60%);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                `;
                
                wordElement.textContent = word;
                wordElement.addEventListener('click', () => this.submitWord(word));
                wordElement.addEventListener('mouseenter', () => {
                    wordElement.style.transform = 'translateY(-2px)';
                    wordElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                });
                wordElement.addEventListener('mouseleave', () => {
                    wordElement.style.transform = 'translateY(0)';
                    wordElement.style.boxShadow = 'none';
                });
                
                this.wordsArea.appendChild(wordElement);
            });
        }

        submitWord(word) {
            const input = document.querySelector('#game-chat input[data-translate="placeholder"]');
            const form = document.querySelector('#game-chat form');
            
            if (input && form) {
                input.value = word;
                form.dispatchEvent(new Event('submit', { bubbles: true }));
            }
        }

        setupObservers() {
            // Observer les indices
            const hintsContainer = document.querySelector('.hints .container');
            if (hintsContainer) {
                new MutationObserver(() => this.generateGuesses())
                    .observe(hintsContainer, { childList: true, subtree: true });
            }

            // Observer le chat
            this.observeChat();
        }

        observeChat() {
            const chatContainer = document.querySelector('.chat-content');
            if (!chatContainer) return;

            new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0) {
                        this.processChatMessage(mutation.addedNodes[0]);
                    }
                });
            }).observe(chatContainer, { childList: true });
        }

        processChatMessage(messageNode) {
            const message = messageNode.textContent;
            
            // Nouveau round
            if (message.includes('The word was')) {
                const answer = message.match(/The word was (.+)!/);
                if (answer && answer[1]) {
                    this.addNewWord(answer[1].toLowerCase());
                }
                this.resetRound();
            }
            
            // Guess proche
            if (message.includes('is close!')) {
                this.closeWord = message.split(' ')[0];
            }
            
            // Guess de joueur
            if (message.includes(': ')) {
                const guess = message.split(': ')[1];
                if (guess && !this.alreadyGuessed.includes(guess.toLowerCase())) {
                    this.alreadyGuessed.push(guess.toLowerCase());
                }
            }
            
            this.generateGuesses();
        }

        addNewWord(word) {
            if (this.isValidWord(word) && !this.correctAnswers.includes(word)) {
                this.correctAnswers.push(word);
                GM_setValue('correctAnswers', this.correctAnswers);
                this.updateWordList();
            }
        }

        isValidWord(word) {
            return word && 
                   word.length >= 2 && 
                   word.length <= 15 && 
                   /^[a-zàâäéèêëîïôöùûüÿç\s\-']+$/i.test(word);
        }

        resetRound() {
            this.alreadyGuessed = [];
            this.closeWord = '';
            this.possibleWords = [];
        }

        setupEventListeners() {
            // F2 pour toggle interface
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F2') {
                    e.preventDefault();
                    this.toggleMinimize();
                }
            });

            // Tab pour auto-complétion
            const input = document.querySelector('#game-chat input[data-translate="placeholder"]');
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' && this.possibleWords.length > 0) {
                        e.preventDefault();
                        input.value = this.possibleWords[0];
                    }
                });
            }
        }

        exportWords() {
            const newWords = this.correctAnswers.filter(word => 
                !this.basicWords.includes(word)
            );
            
            if (newWords.length === 0) {
                alert('Aucun nouveau mot à exporter.');
                return;
            }
            
            const blob = new Blob([newWords.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nouveaux_mots_${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // Initialisation
    console.log('🚀 Infornia FR Skribbl Pro v3.0 - Version Optimisée');
    new InforniaSkribblProV3();

})();