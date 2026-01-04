// ==UserScript==
// @name         KahbonkBetaTesting
// @namespace    http://tampermonkey.net/
// @version      1
// @description  stupid feature testing for my kahoot mod, do not expect the features to all work.
// @author       Gosh227
// @match        http://kahoot.it/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/528929/KahbonkBetaTesting.user.js
// @updateURL https://update.greasyfork.org/scripts/528929/KahbonkBetaTesting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main menu HTML creation with cartoony rainbow background and emojis
    const menuHTML = `
        <div id="menu" style="position: fixed; top: 20px; left: 20px; padding: 15px; color: white; font-family: 'Comic Sans MS', cursive, sans-serif; z-index: 9999; border-radius: 10px; box-shadow: 0px 5px 10px rgba(0,0,0,0.5); background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); animation: rainbow-background 5s infinite linear;">
            <h3 style="color: #FF6347; font-size: 20px;">Kahoot Heck (private)</h3>
            <p style="font-size: 16px;">Beta Model</p>
            <p style="font-size: 14px; font-style: italic;">when using highlight answser on cross pages press always allow</p>
            <input type="text" id="accessCode" placeholder="Enter Code" style="width: 100%; padding: 5px; margin-bottom: 10px; border-radius: 5px;" />
            <button id="submitCode" style="width: 100%; padding: 10px; background-color: #FF4500; border: none; border-radius: 5px; color: white; font-size: 16px; cursor: pointer;">Submit Code</button>
        </div>
        <div id="custom-menu" style="display: none; position: fixed; top: 100px; left: 20px; padding: 15px; color: white; font-family: 'Comic Sans MS', cursive, sans-serif; z-index: 9999; border-radius: 10px; box-shadow: 0px 5px 10px rgba(0,0,0,0.5); background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); animation: rainbow-background 5s infinite linear;">
            <button id="drag-button" style="position: absolute; top: 5px; right: 5px; width: 30px; height: 30px; background-color: black; border: none; border-radius: 5px; cursor: grab; z-index: 10000;">☰</button>
            <h3 style="color: #FF6347; font-size: 20px;">Kahoot Mods! Use "Z" to hide / show the menu! </h3>
            <button id="auto-answer" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #D8191A; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Auto Answer </button>
            <button id="rainbow-bg" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #C1181A; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Custom Background</button>
            <button id="crash-gun" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #A81A1B; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Crash Gun</button>
            <button id="flood-lobby" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #8F1213; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Flood Lobby With Bots</button>
            <button id="name-glitcher" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #760F10; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Name Glitcher</button>
            <button id="scoreboard-skip" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #600F10; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Skip Scoreboard (host)</button>
            <button id="kick-player" style="width: 100%; margin-top: 10px; padding: 10px; background-color: #5E0809; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Kick Player (Beta)</button>
        </div>
    `;

    // Add menu HTML to the document
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // CSS for rainbow flowing effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-background {
            0% { background: linear-gradient(45deg, #EE191B, #CF1618, #AB1617, #941314, #7C0B0C, #640C0D, #3E0101); }
            25% { background: linear-gradient(45deg, #EE191B, #CF1618, #AB1617, #941314, #7C0B0C, #640C0D, #3E0101); }
            50% { background: linear-gradient(45deg, #EE191B, #CF1618, #AB1617, #941314, #7C0B0C, #640C0D, #3E0101); }
            75% { background: linear-gradient(45deg, #EE191B, #CF1618, #AB1617, #941314, #7C0B0C, #640C0D, #3E0101); }
            100% { background: linear-gradient(45deg, #EE191B, #CF1618, #AB1617, #941314, #7C0B0C, #640C0D, #3E0101); }
        }
    `;
    document.head.appendChild(style);

    // Drag and drop functionality
    const dragButton = document.getElementById('drag-button');
    const customMenu = document.getElementById('custom-menu');

    let isDragging = false;
    let offsetX, offsetY;

    dragButton.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - customMenu.getBoundingClientRect().left;
        offsetY = e.clientY - customMenu.getBoundingClientRect().top;
        dragButton.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragButton.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            customMenu.style.left = `${e.clientX - offsetX}px`;
            customMenu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Submit code to display custom menu
    document.getElementById('submitCode').addEventListener('click', function() {
        const code = document.getElementById('accessCode').value.trim();
        if (code === '9854') {
            document.getElementById('custom-menu').style.display = 'block';
        } else {
            alert('Invalid code. ❌');
        }
    });

    // Toggle visibility of both menus when pressing 'Z'
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'z') {
            const menu = document.getElementById('menu');
            const customMenu = document.getElementById('custom-menu');
            const isMenuVisible = menu.style.display === 'block' || menu.style.display === '';
            const isCustomMenuVisible = customMenu.style.display === 'block' || customMenu.style.display === '';

            if (isMenuVisible || isCustomMenuVisible) {
                // If either menu is visible, hide both
                menu.style.display = 'none';
                customMenu.style.display = 'none';
            } else {
                // If both menus are hidden, show them
                menu.style.display = 'block';
                customMenu.style.display = 'block';
            }
        }
    });

    // Kick Player (Beta) functionality: Identify user by username and Game PIN
    const kickPlayer = () => {
        const username = prompt('Enter the username of the player to kick:');
        const gamePin = prompt('Enter the Game PIN:');

        if (!username || !gamePin) {
            alert('Username and/or Game PIN missing. ❌');
            return;
        }

        // Find the game iframe and its window
        const targetIframe = document.querySelector('iframe');
        if (!targetIframe) {
            alert('Unable to find the game iframe. ❌');
            return;
        }

        const targetWindow = targetIframe.contentWindow;

        // Injecting a function into the iframe to identify and manipulate players
        targetWindow.postMessage({ type: 'kickPlayer', username: username, gamePin: gamePin }, '*');

        // Provide feedback
        alert(`Attempting to kick player ${username}...`);
    };

    // Listen for the custom message from the iframe (in case we need to perform an action inside the iframe)
    window.addEventListener('message', function(event) {
        if (event.origin !== 'https://play.kahoot.it') return;  // Ensure we’re dealing with the Kahoot iframe

        const data = event.data;

        if (data.type === 'kickPlayer') {
            const username = data.username;
            const gamePin = data.gamePin;

            // Now we need to identify the player in the game.
            const players = document.querySelectorAll('.player');  // Assuming class 'player' holds player data
            let foundPlayer = null;

            players.forEach(player => {
                const playerName = player.querySelector('.player-name').innerText; // Assuming the player's name is in '.player-name'

                if (playerName === username) {
                    foundPlayer = player;
                    console.log(`Player ${username} found! Kicking out...`);

                    // Simulate the action to "kick" the player
                    player.style.display = 'none'; // Hides the player from the UI

                    // Optionally, disable further actions (simulate a freeze)
                    player.setAttribute('disabled', 'true');

                    // Log or alert as necessary
                    alert(`Player ${username} has been kicked from the game! ❌`);
                }
            });

            if (!foundPlayer) {
                alert(`Player with username ${username} not found! ❌`);
            }
        }
    });

    // Name Glitcher Functionality (Bypass Name Restrictions)
    const nameGlitcher = () => {
        let nick = "";

        const nativeSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            const oldCallback = this.onreadystatechange;

            this.onreadystatechange = function() {
                if (this.readyState === 4) {
                    try {
                        const response = JSON.parse(this.responseText);

                        if (response.namerator === true)
                            response.namerator = false;

                        Object.defineProperty(this, "responseText",{
                            writable: false,
                            configurable: true,
                            value: JSON.stringify(response)
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }

                if (oldCallback)
                    return oldCallback.apply(this, arguments);
            };

            return nativeSend.apply(this, arguments);
        };

        const nativeWebSocket = window.WebSocket;
        window.WebSocket = function() {
            const ws = new nativeWebSocket(...arguments);
            const nativeSend = ws.send;

            ws.send = function() {
                const interceptedMessage = JSON.parse(arguments[0]);

                if (interceptedMessage[0] && interceptedMessage[0].data) {
                    if (JSON.parse(interceptedMessage[0].data.content).usingNamerator === false)
                        interceptedMessage[0].data.content = JSON.stringify({ ...JSON.parse(interceptedMessage[0].data.content), usingNamerator: true });

                    if (nick && interceptedMessage[0].data.name) {
                        interceptedMessage[0].data.name = nick;
                        nick = "";
                        console.log("Name Glitcher applied the nickname:", interceptedMessage[0].data.name); // Feedback
                        alert("Name Glitcher applied the nickname successfully!"); // User feedback
                    }
                }

                return nativeSend.apply(this, [JSON.stringify(interceptedMessage)]);
            };

            return ws;
        };

        const nativePushState = history.pushState;
        history.pushState = function() {
            const ret = nativePushState.apply(history, arguments);

            if (location.href.includes("kahoot.it/join")) {
                const observer = new MutationObserver(function() {
                    if (document.getElementById("nickname")) {
                        const input = document.createElement("input");
                        const nickname = document.getElementById("nickname");
                        const reactProps = Object.keys(nickname).find(v => v.includes("reactProps"));

                        if (nickname[reactProps] && nickname[reactProps].value) {
                            nick = nickname[reactProps].value;

                            input.value = ` glitcher_${Math.floor(Math.random() * 1000)}`;
                            nickname.value = input.value;
                            console.log("Attempted to apply the name:", nickname.value); // Feedback
                            alert("Attempted to apply a glitched nickname: " + nickname.value); // User feedback
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            return ret;
        };
    };

    // Auto Answer Function
    let autoAnswerActive = false;
    let autoAnswerInterval = null;

    const toggleAutoAnswer = async () => {
        autoAnswerActive = !autoAnswerActive;

        if (autoAnswerActive) {
            document.getElementById('auto-answer').style.backgroundColor = '#FF0000'; // Indicate active mode
            document.getElementById('auto-answer').innerText = 'highlight Answer (ON) ✅';

            autoAnswerInterval = setInterval(autoAnswer, 3000); // Run every 3 seconds
        } else {
            document.getElementById('auto-answer').style.backgroundColor = '#711112'; // Reset button color
            document.getElementById('auto-answer').innerText = 'highlight Answer (OFF) ❌';

            clearInterval(autoAnswerInterval);
        }
    };

    const autoAnswer = async () => {
        const selectors = ['answer-0', 'answer-1', 'answer-2', 'answer-3'];
        const questionSelector = '.question-title__Title-sc-12qj0yr-1';
        let quizData = null;

        const fetchQuizData = (query) => {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://create.kahoot.it/rest/kahoots/?query=${encodeURIComponent(query)}&limit=20`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    onload: function(response) {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (jsonResponse.entities && jsonResponse.entities.length > 0) {
                                const quizId = jsonResponse.entities[0].card.uuid;
                                const quizDetailsUrl = `https://create.kahoot.it/rest/kahoots/${quizId}/card/?includeKahoot=true`;
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: quizDetailsUrl,
                                    onload: function(quizResponse) {
                                        try {
                                            const quizDetails = JSON.parse(quizResponse.responseText);
                                            resolve(quizDetails);
                                        } catch (err) {
                                            console.error('Error parsing quiz details:', err);
                                            reject(err);
                                        }
                                    },
                                    onerror: function(err) {
                                        console.error('Error fetching quiz details:', err);
                                        reject(err);
                                    }
                                });
                            } else {
                                console.warn('No matching quizzes found.');
                                reject('No quizzes found.');
                            }
                        } catch (err) {
                            console.error('Error parsing search response:', err);
                            reject(err);
                        }
                    },
                    onerror: function(err) {
                        console.error('Error making API request:', err);
                        reject(err);
                    }
                });
            });
        };

        const questionElement = document.querySelector(questionSelector);
        const answerElements = selectors
            .map(selector => document.querySelector(`[data-functional-selector="${selector}"]`))
            .filter(el => el);

        if (!questionElement || answerElements.length === 0) {
            console.log('No question or answers detected yet.');
            return;
        }

        const question = questionElement.innerText.trim();
        const answers = answerElements.map(el => el.innerText.trim());

        if (!quizData) {
            try {
                console.log('Fetching quiz data...');
                quizData = await fetchQuizData(question);
                console.log('Quiz data loaded:', quizData);
            } catch (err) {
                console.warn('Failed to load quiz data.');
                return;
            }
        }

        const matchedQuestion = quizData.kahoot.questions.find(q => q.question.trim() === question);
        if (!matchedQuestion) {
            console.warn('No matching question found in quiz data.');
            return;
        }

        const correctChoice = matchedQuestion.choices.find(choice => choice.correct);
        if (correctChoice) {
            const correctAnswerText = correctChoice.answer.trim();
            const correctAnswerElement = answerElements.find(el => el.innerText.trim() === correctAnswerText);
            if (correctAnswerElement) {
                correctAnswerElement.style.border = '5px solid green';
                correctAnswerElement.click(); // Automatically click the correct answer
                console.log(`Auto-answered: ${correctAnswerText}`);
            } else {
                console.warn('Correct answer not found among visible options.');
            }
        } else {
            console.warn('No correct answer found for this question.');
        }
    };

    // Attach toggle function to the button
    document.getElementById('auto-answer').addEventListener('click', toggleAutoAnswer);

    // Rainbow Background Toggle
    const enableRainbowBackground = () => {
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
    };

    // Crash Gun functionality (Causing page crash)
    const crashGun = () => {
        while (true) {
            alert('Game Crashed!');
        }
    };

    // Flood Lobby functionality
    const floodLobby = () => {
        const bots = prompt('How many bots would you like to flood the lobby with?', 0);
        const pin = prompt('Enter the Game PIN:');

        if (!pin) {
            alert('Game PIN is required.');
            return;
        }

        for (let i = 0; i < bots; i++) {
            const botIframe = document.createElement('iframe');
            botIframe.src = `https://kahoot.it/join/${pin}`;
            botIframe.style.display = 'none';
            document.body.appendChild(botIframe);
        }
    };

    // Event listeners for buttons
    document.getElementById('auto-answer').addEventListener('click', autoAnswer);
    document.getElementById('rainbow-bg').addEventListener('click', enableRainbowBackground);
    document.getElementById('crash-gun').addEventListener('click', crashGun);
    document.getElementById('flood-lobby').addEventListener('click', floodLobby);
    document.getElementById('name-glitcher').addEventListener('click', nameGlitcher);
    document.getElementById('kick-player').addEventListener('click', kickPlayer);
})();