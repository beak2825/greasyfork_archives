// ==UserScript==
// @name         Gartic IO Word Collector with Auto Skip
// @namespace    http://tampermonkey.net/
// @version      2025-03-06
// @description  Collects words presented during the game, saves them to a file, and auto-skips
// @author       anonimbiri
// @license      MIT
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529007/Gartic%20IO%20Word%20Collector%20with%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/529007/Gartic%20IO%20Word%20Collector%20with%20Auto%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Modify appendChild to intercept and alter the game's script
    Node.prototype.appendChild = new Proxy(Node.prototype.appendChild, {
        apply: function(target, thisArg, argumentsList) {
            const node = argumentsList[0];
            if (node.nodeName.toLowerCase() === 'script' && node.src && node.src.includes('room')) {
                console.log('Hedef script algılandı:', node.src);
                fetch(node.src)
                    .then(response => response.text())
                    .then(scriptContent => {
                        let modifiedContent = scriptContent
                            .replace(
                                'r.created||c?Rt("input",{type:"text",name:"chat",className:"mousetrap",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",value:i,placeholder:this._lang.chatHere,maxLength:100,enterKeyHint:"send",onChange:this.handleText,ref:this._ref}):Rt("input",{type:"text",name:"chat",className:"mousetrap",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",value:this._lang.loginChat,maxLength:100,ref:this._ref,disabled:!0})',
                                'Rt("input",{type:"text",name:"chat",className:"mousetrap",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",value:i,placeholder:this._lang.chatHere,maxLength:100,enterKeyHint:"send",onChange:this.handleText,ref:this._ref})'
                            )
                            .replace(
                                'this._timerAtivo=setInterval((function(){Date.now()-e._ativo>15e4&&(O(Object(f.a)(n.prototype),"emit",e).call(e,"avisoInativo"),e._ativo=Date.now())}),1e3)',
                                'this._timerAtivo=setInterval((function(){Date.now()-e._ativo>15e4&&e.active()}),1e3)'
                            )
                            .replace(
                                'e.unlock()}',
                                'e.unlock();window.game=e;setInterval(()=>{window.game=e},1000);}'
                            );
                        let blob = new Blob([modifiedContent], { type: 'application/javascript' });
                        let blobUrl = URL.createObjectURL(blob);
                        node.src = blobUrl;
                        node.textContent = '';
                        return target.apply(thisArg, [node]);
                    })
                    .catch(error => {
                        console.error('Failed to fetch/modify script:', error);
                        return target.apply(thisArg, argumentsList);
                    });
                return node;
            }
            return target.apply(thisArg, argumentsList);
        }
    });

    // Define wordList globally on window object
    window.wordList = {
        "custom": [],
        "General (en)": [],
        "General (tr)": [],
        "Anime (en)": []
    };

    // Function to save wordList to a file
    function saveWordListToFile() {
        const theme = window.game && window.game._dadosSala && window.game._dadosSala.tema ? window.game._dadosSala.tema : "custom";
        const words = window.wordList[theme].join('\n');
        const blob = new Blob([words], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${theme}_words.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Inject UI for the word collector (right side, vertical)
    const collectorHTML = `
        <div id="wordCollector" style="position: fixed; top: 20px; right: 20px; width: 200px; background: rgba(30, 30, 47, 0.9); padding: 15px; border-radius: 8px; color: #fff; z-index: 1000; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
            <h3 style="margin: 0; color: #ff69b4; font-size: 16px; text-align: center;">Word Collector</h3>
            <p style="margin: 0; font-size: 12px; text-align: center;">Collects words and skips turn</p>
            <button id="saveWordsBtn" style="background: #ff69b4; border: none; padding: 8px; border-radius: 5px; color: #1e1e2f; cursor: pointer; font-size: 14px;">Save Words</button>
            <label for="importWords" style="background: #a5e2fe; border: none; padding: 8px; border-radius: 5px; color: #1e1e2f; cursor: pointer; font-size: 14px; text-align: center;">Import Words</label>
            <input type="file" id="importWords" accept=".txt" style="display: none;">
            <div id="wordCount" style="font-size: 12px; text-align: center;"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', collectorHTML);

    // Update word count display
    function updateWordCount() {
        const theme = window.game && window.game._dadosSala && window.game._dadosSala.tema ? window.game._dadosSala.tema : "custom";
        const count = window.wordList[theme].length;
        document.getElementById('wordCount').textContent = `Words (${theme}): ${count}`;
    }

    // Add save button event listener
    document.getElementById('saveWordsBtn').addEventListener('click', () => {
        saveWordListToFile();
    });

    // Add import functionality
    document.getElementById('importWords').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            const themeMatch = fileName.match(/^(.+)_words\.txt$/);
            const theme = themeMatch ? themeMatch[1] : "custom"; // Extract theme from filename, e.g., "General (tr)"

            // Check if the theme exists in wordList, if not, create it
            if (!window.wordList[theme]) {
                window.wordList[theme] = [];
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const text = event.target.result;
                const importedWords = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);

                // Add imported words to the extracted theme category, avoiding duplicates
                importedWords.forEach(word => {
                    if (!window.wordList[theme].includes(word)) {
                        window.wordList[theme].push(word);
                    }
                });

                // Update the word count display (uses current room theme)
                updateWordCount();
                alert(`Imported ${importedWords.length} words into "${theme}" category. Total unique words in "${theme}": ${window.wordList[theme].length}`);
            };
            reader.readAsText(file);
        }
    });

    // Check for game object and collect words + auto-skip
    const checkGame = setInterval(() => {
        if (window.game && window.game._socket) {
            clearInterval(checkGame);

            // Collect words when your turn comes (event 16) and auto-skip
            window.game._socket.on(16, (word1, hints1, word2, hints2) => {
                const theme = window.game._dadosSala.tema || "custom";

                // Add words to the appropriate category if not already present
                if (!window.wordList[theme].includes(word1)) {
                    window.wordList[theme].push(word1);
                }
                if (!window.wordList[theme].includes(word2)) {
                    window.wordList[theme].push(word2);
                }

                // Update the word count display
                updateWordCount();

                // Auto-skip after collecting words
                setTimeout(() => {
                    if (window.game && window.game._socket && window.game._codigo) {
                        window.game._socket.emit(25, window.game._codigo);
                    }
                }, 500); // 500ms delay to ensure words are processed
            });

            // Collect the word when a turn ends and the answer is revealed (event 18 - intervalo)
            window.game._socket.on(18, (answer) => {
                if (answer) { // Only collect if answer is provided (not null/undefined)
                    const theme = window.game._dadosSala.tema || "custom";

                    // Add the word if not already present
                    if (!window.wordList[theme].includes(answer)) {
                        window.wordList[theme].push(answer);
                    }

                    // Update the word count display
                    updateWordCount();
                }
            });

            // Initial word count update
            updateWordCount();
        }
    }, 100);

})();