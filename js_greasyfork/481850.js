// ==UserScript==
// @name         JKLM Bomb Party: view opponent bonus letter status
// @namespace    http://tampermonkey.net/
// @version      2023-12-10.1
// @description  Displays the status of bonus letter use for opponents.
// @author       luphoria
// @match        https://*.jklm.fun/*
// @grant        none
// @run-at       document-start
// @license      GPL-3
// @downloadURL https://update.greasyfork.org/scripts/481850/JKLM%20Bomb%20Party%3A%20view%20opponent%20bonus%20letter%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/481850/JKLM%20Bomb%20Party%3A%20view%20opponent%20bonus%20letter%20status.meta.js
// ==/UserScript==

// TODO: clean this up. it's not great.

(function() {
    'use strict';
    const _WebSocket = window.WebSocket; // Create a copy of WebSocket
    window.webSocketInstances = []; // will be used because there are two concurrent connections

    // hook onto websocket function
    const WebSocketProxy = new Proxy(_WebSocket, {
        construct(WS, args) {
            const instance = new WS(...args);
            instance.addEventListener('message', (event) => {

                // console.log(event.data);

                // Initial set up alphabet and player list
                if (event.data.includes("\"setup\"")) {
                    console.log("--DEBUG-- Setting up...");
                    this.setup = JSON.parse(event.data.replace(/.*?\["set/g, "[\"set"))[1];
                    console.log("--DEBUG-- Setup message from server parsed:");
                    console.log(this.setup);
                    this.alphabet = Object.keys(this.setup.rules.customBonusAlphabet.value); // do we really need this?
                    this.players = {};
                    console.log("--DEBUG-- Active player state object");
                    console.log(this.setup.milestone.playerStatesByPeerId);
                    Object.keys(this.setup.milestone.playerStatesByPeerId).forEach(player => {
                        console.log(`--DEBUG-- setting bonus letter state for peer id ${player}...`);
                        console.log(this.setup.milestone.playerStatesByPeerId[player]);
                        this.players[player] = this.setup.milestone.playerStatesByPeerId[player].bonusLetters;
                    });
                    console.log("--DEBUG-- players list initialized.");
                    console.log(this.players);
                    createUI(this.alphabet.join(""));
                }

                //  setup for new games starting, setMilestone
                if (event.data.includes("\"setMilestone\",{\"name\":\"round\"")) {
                    console.log("--DEBUG-- Setting up new game from Milestone...");
                    this.setup = JSON.parse(event.data.replace(/.*?\["set/g, "[\"set"))[1];
                    console.log("--DEBUG-- Setup message from server parsed:");
                    console.log(this.setup);
                    this.alphabet = Object.keys(this.setup.dictionaryManifest.bonusAlphabet);
                    this.players = {};
                    console.log("--DEBUG-- Active player state object");
                    console.log(this.setup.playerStatesByPeerId);
                    Object.keys(this.setup.playerStatesByPeerId).forEach(player => {
                        console.log(`--DEBUG-- setting bonus letter state for peer id ${player}...`);
                        console.log(this.setup.playerStatesByPeerId[player]);
                        this.players[player] = this.setup.playerStatesByPeerId[player].bonusLetters;
                    });
                    console.log("--DEBUG-- players list initialized.");
                    console.log(this.players);
                    createUI(this.alphabet.join(""));
                }

                // Handle each play
                else if (event.data.includes("\"correctWord\"")) {
                    let correctWord = JSON.parse(event.data.split('correctWord",')[1].slice(0, -1));
                    // Set player ID letter info for next time it goes to their character
                    this.players[correctWord.playerPeerId] = correctWord.bonusLetters;
                    let text = correctWord.playerPeerId + " updated state:\n\n";
                    this.alphabet.forEach(letter => {
                        text += `${letter}: ${(correctWord.bonusLetters[letter] > 0 ? correctWord.bonusLetters[letter] : " ")}\n`;
                    });
                    console.log(text);
                    console.log("--DEBUG-- full players state object");
                    console.log(this.players);
                }

                // Handle turn switch
                else if (event.data.includes("\"nextTurn\"")) {
                    let nextPlayer = JSON.parse("[" + event.data.split("[")[1])[1];
                    console.log(`--DEBUG-- next up ${nextPlayer}. current state:`);
                    console.log(this.players[nextPlayer]);
                    // init if not already there (TODO: handle milestone events for new games in one session)
                    if (!this.players[nextPlayer]) {
                        this.players[nextPlayer] = {};
                        this.alphabet.forEach(letter => {
                            this.players[nextPlayer][letter] = 1; // TODO: custom alphabet handling
                        });
                    }
                    // Change UI letter box
                    this.alphabet.forEach(letter => {
                        // TODO: error handling. lol
                        document.getElementById(`box${letter.toUpperCase()}`).style.backgroundColor = (this.players[nextPlayer][letter] > 0 ? "yellow" : "gray");
                        document.getElementById(`number${letter.toUpperCase()}`).innerText = this.players[nextPlayer][letter].toString();
                    });
                }
            });
            window.webSocketInstances.push(instance);
            return instance;
        }
    });

    window.WebSocket = WebSocketProxy;


    // UI
    const createUI = (alphabet) => {
        if (document.domain !== "jklm.fun") { // This whole user script actually executes both on parent and frame, but we only want DOM on iframe.
            if (document.getElementById("usLetters")) document.getElementById("usLetters").parentNode.removeChild(document.getElementById("usLetters"));
            const boxWidth = 35;
            const boxHeight = 35;
            const padding = 7;
            const maxBoxes = Math.floor((window.innerHeight - 150) / (boxHeight + padding));

            const letterHolder = document.createElement('div');
            letterHolder.id = 'usLetters';
            document.body.appendChild(letterHolder);

            for (let i = 0; i < alphabet.length; i++) {
                const letter = alphabet[i].toUpperCase();

                const col = Math.floor(i / maxBoxes);
                const row = i % maxBoxes;

                const letterBox = document.createElement('div');
                letterBox.style.cssText = `width:${boxWidth}px;height:${boxHeight}px;background-color:yellow;position:absolute;top:${70 + row * (boxHeight + padding)}px;left:${10 + col * (boxWidth + padding)}px;z-index:9999;`;
                letterBox.id = `box${letter}`;

                const textElement = document.createElement('span');
                textElement.innerText = letter;
                textElement.style.cssText = 'display:flex;justify-content:center;align-items:center;width:100%;height:100%;';

                const number = document.createElement('span');
                number.style.cssText = 'position:absolute;top:0;right:0;font-size:12px;';
                number.id = `number${letter}`;

                letterBox.appendChild(textElement);
                letterBox.appendChild(number);
                document.getElementById("usLetters").appendChild(letterBox);
            }

        }
    }
    console.log("Initialized.");

})();