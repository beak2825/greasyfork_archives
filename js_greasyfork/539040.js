// ==UserScript==
// @name         Infornia FR Skribbl Optimisé
// @namespace    https://greasyfork.org/en/users/1084087-fermion
// @version      0.2.0
// @description  Script optimisé avec mots classiques et interface compacte
// @author       fermion
// @match        http*://www.skribbl.io/*
// @match        http*://skribbl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539040/Infornia%20FR%20Skribbl%20Optimis%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/539040/Infornia%20FR%20Skribbl%20Optimis%C3%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class OptimizedWordSleuth {
        constructor() {
            // Liste de mots classiques français distincts et courants
            this.baseWords = [
                // Animaux
                'chat', 'chien', 'oiseau', 'poisson', 'lapin', 'souris', 'lion', 'tigre', 'éléphant', 
                'girafe', 'singe', 'ours', 'loup', 'renard', 'cerf', 'cochon', 'vache', 'mouton', 
                'cheval', 'âne', 'coq', 'poule', 'canard', 'cygne', 'aigle', 'hibou', 'serpent',
                
                // Objets du quotidien
                'table', 'chaise', 'lit', 'porte', 'fenêtre', 'lampe', 'livre', 'stylo', 'téléphone',
                'ordinateur', 'télévision', 'voiture', 'vélo', 'train', 'avion', 'bateau', 'maison',
                'école', 'hôpital', 'église', 'magasin', 'restaurant', 'cinéma', 'théâtre', 'musée',
                
                // Nourriture
                'pain', 'fromage', 'pomme', 'banane', 'orange', 'fraise', 'cerise', 'raisin', 'carotte',
                'tomate', 'salade', 'poulet', 'bœuf', 'porc', 'poisson', 'œuf', 'lait', 'eau', 'café',
                'thé', 'chocolat', 'gâteau', 'biscuit', 'bonbon', 'glace', 'pizza', 'hamburger',
                
                // Actions
                'courir', 'marcher', 'sauter', 'danser', 'chanter', 'dessiner', 'écrire', 'lire',
                'dormir', 'manger', 'boire', 'jouer', 'travailler', 'étudier', 'rire', 'pleurer',
                'parler', 'écouter', 'regarder', 'toucher', 'sentir', 'conduire', 'voler', 'nager',
                
                // Couleurs et formes
                'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'orange', 'violet', 'rose', 'gris',
                'rond', 'carré', 'triangle', 'rectangle', 'cercle', 'étoile', 'cœur', 'losange',
                
                // Nature
                'soleil', 'lune', 'étoile', 'nuage', 'pluie', 'neige', 'vent', 'orage', 'arc-en-ciel',
                'montagne', 'mer', 'océan', 'rivière', 'lac', 'forêt', 'arbre', 'fleur', 'herbe',
                
                // Corps humain
                'tête', 'cheveux', 'yeux', 'nez', 'bouche', 'oreille', 'main', 'pied', 'bras', 'jambe',
                'dos', 'ventre', 'cœur', 'cerveau', 'dent', 'langue', 'doigt', 'ongle',
                
                // Vêtements
                'chemise', 'pantalon', 'robe', 'jupe', 'veste', 'manteau', 'chaussure', 'chaussette',
                'chapeau', 'écharpe', 'gant', 'ceinture', 'lunettes', 'montre', 'bijou', 'bague',
                
                // Sports et loisirs
                'football', 'tennis', 'basketball', 'volleyball', 'natation', 'course', 'vélo',
                'ski', 'pêche', 'chasse', 'musique', 'guitare', 'piano', 'violon', 'tambour'
            ];
            
            this.learnedWords = GM_getValue('learnedWords', []);
            this.allWords = [...this.baseWords, ...this.learnedWords];
            this.possibleWords = [];
            this.alreadyGuessed = [];
            this.closeWord = '';
            this.myName = '';
            
            this.createCompactInterface();
            this.fetchLatestWordlist();
            this.observeHintsAndInput();
            this.observePlayers();

            this.visibilityState = GM_getValue('interfaceVisible', true);
            this.updateInterfaceVisibility();

            document.addEventListener('keydown', (e) => {
                if (e.key === 'F2') {
                    this.toggleInterfaceVisibility();
                }
            });
        }

        createCompactInterface() {
            // Interface compacte positionnée en bas à droite
            this.parentElement = document.createElement('div');
            this.parentElement.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 300px;
                max-height: 150px;
                background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(30,30,30,0.9));
                border-radius: 12px;
                border: 2px solid rgba(100,200,255,0.3);
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                z-index: 9999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            
            // En-tête compact
            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(90deg, #4f46e5, #7c3aed);
                color: white;
                padding: 8px 12px;
                border-radius: 10px 10px 0 0;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            header.innerHTML = `
                🎨 Infornia FR
                📁
            `;
            
            // Zone des mots
            this.guessElement = document.createElement('div');
            this.guessElement.style.cssText = `
                padding: 8px;
                max-height: 100px;
                overflow-y: auto;
                overflow-x: hidden;
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                font-size: 11px;
            `;
            
            this.parentElement.appendChild(header);
            this.parentElement.appendChild(this.guessElement);
            document.body.appendChild(this.parentElement);
            
            // Event listener pour l'export
            document.getElementById('exportBtn').addEventListener('click', () => this.exportLearnedWords());
        }

        updateInterfaceVisibility() {
            this.parentElement.style.display = this.visibilityState ? 'block' : 'none';
            GM_setValue('interfaceVisible', this.visibilityState);
        }

        toggleInterfaceVisibility() {
            this.visibilityState = !this.visibilityState;
            this.updateInterfaceVisibility();
        }

        exportLearnedWords() {
            if (this.learnedWords.length === 0) {
                alert('Aucun nouveau mot appris pour le moment !');
                return;
            }
            
            const blob = new Blob([this.learnedWords.join('\n')], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `mots_appris_${new Date().toISOString().split('T')[0]}.txt`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        fetchLatestWordlist() {
            // Récupération optionnelle de mots supplémentaires
            fetch('https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json')
                .then(response => response.json())
                .then(words => {
                    // Filtre pour ne garder que les mots courants (3-12 lettres, sans caractères spéciaux)
                    const filteredWords = words.filter(word => 
                        word.length >= 3 && 
                        word.length <= 12 && 
                        /^[a-zà-ÿ\s-]+$/i.test(word) &&
                        !this.allWords.includes(word)
                    ).slice(0, 1000); // Limite à 1000 mots supplémentaires
                    
                    this.allWords.push(...filteredWords);
                })
                .catch(() => {
                    console.log('Utilisation de la liste de base uniquement');
                });
        }

        observePlayers() {
            const playersContainer = document.querySelector(".players-list");
            if (playersContainer) {
                const observer = new MutationObserver(() => this.updatePlayersList());
                observer.observe(playersContainer, { childList: true, subtree: true });
            }
        }

        updatePlayersList() {
            const playerElems = document.querySelectorAll(".player");
            playerElems.forEach(playerElem => {
                const playerNameElem = playerElem.querySelector(".player-name");
                if (playerNameElem) {
                    let playerName = playerNameElem.textContent;
                    const isMe = playerNameElem.classList.contains("me");
                    if (isMe) {
                        this.myName = playerName.replace(" (You)", "").trim();
                    }
                }
            });
        }

        observeHintsAndInput() {
            this.observeHints();
            this.observeInput();
            this.observeChat();
        }

        observeHints() {
            const targetNodes = [
                document.querySelector('.hints .container'),
                document.querySelector('.words'),
                document.querySelector('#game-word'),
            ];
            
            const observer = new MutationObserver(() => this.hintObserverCallback());
            targetNodes.forEach(targetNode => {
                if (targetNode) {
                    observer.observe(targetNode, { childList: true, subtree: true });
                }
            });
        }

        hintObserverCallback() {
            const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
            if (inputElem && inputElem.value) return;

            this.checkIfAllHintsRevealed();
            this.checkWordsElement();
            this.generateGuesses();
        }

        checkIfAllHintsRevealed() {
            const hintElems = Array.from(document.querySelectorAll('.hints .hint'));
            
            if (hintElems.length > 0 && hintElems.every(elem => elem.classList.contains('uncover'))) {
                const correctAnswer = hintElems.map(elem => elem.textContent).join('').trim().toLowerCase();
                
                if (correctAnswer && /^[a-zà-ÿ\s-]+$/i.test(correctAnswer)) {
                    this.addLearnedWord(correctAnswer);
                }
            }
        }

        checkWordsElement() {
            const wordElems = Array.from(document.querySelectorAll('.words.show .word'));
            wordElems.forEach(elem => {
                const word = elem.textContent.trim().toLowerCase();
                if (word && /^[a-zà-ÿ\s-]+$/i.test(word)) {  
                    this.addLearnedWord(word);
                }
            });
        }

        addLearnedWord(word) {
            if (!this.allWords.includes(word) && !this.learnedWords.includes(word)) {
                this.learnedWords.push(word);
                this.allWords.push(word);
                GM_setValue('learnedWords', this.learnedWords);
            }
        }

        observeChat() {
            const chatContainer = document.querySelector('.chat-content');
            if (chatContainer) {
                const observer = new MutationObserver((mutationsList) => this.chatObserverCallback(mutationsList));
                observer.observe(chatContainer, { childList: true });
            }
        }

        chatObserverCallback(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    let messageNode = mutation.addedNodes[0];
                    let message = messageNode.textContent;
                    let computedStyle = window.getComputedStyle(messageNode);

                    if (computedStyle.color === 'rgb(226, 203, 0)' && message.includes('is close!')) {
                        this.closeWord = message.split(' ')[0];
                    }

                    if (computedStyle.color === 'rgb(57, 117, 206)') {
                        this.alreadyGuessed = [];
                        this.closeWord = '';
                    }

                    if (message.includes(': ')) {
                        let guess = message.split(': ')[1];
                        if (!this.alreadyGuessed.includes(guess)) {
                            this.alreadyGuessed.push(guess);
                        }
                    }

                    this.generateGuesses();
                }
            }
        }

        observeInput() {
            const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
            if (inputElem) {
                inputElem.addEventListener('input', () => this.generateGuesses());
                inputElem.addEventListener('keydown', (event) => this.handleKeyDown(event));
            }

            const formElem = document.querySelector('#game-chat form');
            if (formElem) {
                formElem.addEventListener('submit', () => this.generateGuesses());
            }
        }

        handleKeyDown(event) {
            if (event.key === 'Tab' && this.possibleWords.length > 0) {
                event.preventDefault();
                const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
                inputElem.value = this.possibleWords[0];
                inputElem.focus();
                this.generateGuesses();
            }
        }

        levenshteinDistance(a, b) {
            const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
            
            for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
            for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
            
            for (let j = 1; j <= b.length; j++) {
                for (let i = 1; i <= a.length; i++) {
                    if (a[i-1] === b[j-1]) {
                        matrix[j][i] = matrix[j-1][i-1];
                    } else {
                        matrix[j][i] = Math.min(
                            matrix[j-1][i-1] + 1,
                            matrix[j][i-1] + 1,
                            matrix[j-1][i] + 1
                        );
                    }
                }
            }
            
            return matrix[b.length][a.length];
        }

        generateGuesses() {
            const hintElems = Array.from(document.querySelectorAll('.hints .hint'));
            const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
            
            if (hintElems.length === 0) return;
            
            const hintParts = hintElems.map(elem => elem.textContent === '_' ? '.' : elem.textContent).join('');
            const inputText = inputElem ? inputElem.value || '' : '';

            // Filtre les mots possibles
            this.possibleWords = this.allWords.filter(word => {
                // Exclure les mots déjà devinés
                if (this.alreadyGuessed.includes(word)) return false;
                
                // Vérifier la proximité si un mot proche est indiqué
                if (this.closeWord.length > 0 && this.levenshteinDistance(word, this.closeWord) > 2) {
                    return false;
                }
                
                // Vérifier la correspondance avec les indices
                if (hintParts.length > 0) {
                    const wordParts = word.split(' ');
                    const hintWords = hintParts.split(' ');
                    
                    if (wordParts.length !== hintWords.length) return false;
                    
                    for (let i = 0; i < wordParts.length; i++) {
                        if (wordParts[i].length !== hintWords[i].length) return false;
                        
                        const hintRegex = new RegExp(`^${hintWords[i].replace(/\./g, '.')}$`, 'i');
                        if (!hintRegex.test(wordParts[i])) return false;
                    }
                }
                
                // Vérifier la correspondance avec la saisie
                if (inputText) {
                    const inputRegex = new RegExp(`^${inputText}`, 'i');
                    if (!inputRegex.test(word)) return false;
                }
                
                return true;
            }).slice(0, 20); // Limite à 20 suggestions

            this.renderGuesses();
        }

        renderGuesses() {
            this.guessElement.innerHTML = '';
            
            if (this.possibleWords.length === 0) {
                this.guessElement.innerHTML = 'Aucun mot trouvé';
                return;
            }

            this.possibleWords.forEach((word, index) => {
                const wordElem = document.createElement('div');
                wordElem.textContent = word;
                wordElem.style.cssText = `
                    display: inline-block;
                    padding: 4px 8px;
                    margin: 2px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(255,255,255,0.1);
                `;

                // Effets de survol
                wordElem.addEventListener('mouseenter', function() {
                    this.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                    this.style.transform = 'translateY(-1px)';
                    this.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
                });

                wordElem.addEventListener('mouseleave', function() {
                    this.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });

                // Clic pour saisir le mot
                wordElem.addEventListener('click', () => {
                    const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
                    const formElem = document.querySelector('#game-chat form');
                    if (inputElem && formElem) {
                        inputElem.value = word;
                        formElem.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    }
                });

                this.guessElement.appendChild(wordElem);
            });
        }
    }

    // Initialisation du script
    new OptimizedWordSleuth();
})();