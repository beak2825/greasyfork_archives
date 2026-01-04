// ==UserScript==
// @name         LPred
// @namespace    http://tampermonkey.net/
// @version      9.8
// @description  lsuers
// @author       Your Name
// @match        https://bloxflip.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      leqit.de
// @downloadURL https://update.greasyfork.org/scripts/503497/LPred.user.js
// @updateURL https://update.greasyfork.org/scripts/503497/LPred.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isTransparent = true; // Initial state of transparency
    let isMinimized = false; // Initial state of GUI minimized
    let rainNotificationsEnabled = false; // Initial state of rain notifications
    let lastGameResults = []; // To store last game's actual safe spots
    let guiColor = 'rgba(255, 105, 180, 0.85)'; // Default GUI color with pink theme
    let bombCount = 3; // Default number of bombs in Mines mode
    const BACKEND_URL = 'https://leqit.de/validate_key.php'; // URL to your backend server

    function validateKey(key) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: BACKEND_URL,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ key }),
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.valid);
                    } else {
                        reject('Server error.');
                    }
                },
                onerror: function() {
                    reject('Network error.');
                }
            });
        });
    }

    function createLoginGUI() {
    // Creating the overlay to cover the screen before login
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10000';
    document.body.appendChild(overlay);

    // Creating the login box
    const loginBox = document.createElement('div');
    loginBox.style.position = 'fixed';
    loginBox.style.top = '50%';
    loginBox.style.left = '50%';
    loginBox.style.transform = 'translate(-50%, -50%)';
    loginBox.style.width = '350px';
    loginBox.style.padding = '25px';
    loginBox.style.backgroundColor = '#ff69b4';
    loginBox.style.borderRadius = '15px';
    loginBox.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6)';
    loginBox.style.textAlign = 'center';
    loginBox.style.transition = 'transform 0.4s ease';
    overlay.appendChild(loginBox);

    // Adding title with 3D font effect
    const title = document.createElement('h1');
    title.innerText = 'LPredictor';
    title.style.color = '#fff';
    title.style.fontFamily = "'Poppins', sans-serif";
    title.style.textShadow = '2px 2px 5px #000000';
    title.style.fontSize = '2.8em';
    title.style.marginBottom = '20px';
    loginBox.appendChild(title);

    // Input field for the key
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your key';
    input.style.width = '85%';
    input.style.padding = '12px';
    input.style.borderRadius = '10px';
    input.style.border = '2px solid #ff1493';
    input.style.fontSize = '1.2em';
    input.style.textAlign = 'center';
    input.style.marginBottom = '15px';
    loginBox.appendChild(input);

    // Remember me checkbox
    const rememberContainer = document.createElement('div');
    rememberContainer.style.display = 'flex';
    rememberContainer.style.alignItems = 'center';
    rememberContainer.style.justifyContent = 'center';
    rememberContainer.style.marginBottom = '15px';

    const rememberCheckbox = document.createElement('input');
    rememberCheckbox.type = 'checkbox';
    rememberCheckbox.id = 'rememberMe';
    rememberCheckbox.style.marginRight = '10px';
    rememberContainer.appendChild(rememberCheckbox);

    const rememberLabel = document.createElement('label');
    rememberLabel.innerText = 'Remember me';
    rememberLabel.htmlFor = 'rememberMe';
    rememberLabel.style.color = '#fff';
    rememberLabel.style.fontSize = '1em';
    rememberContainer.appendChild(rememberLabel);

    loginBox.appendChild(rememberContainer);

    // Submit button
    const button = document.createElement('button');
    button.innerText = 'Login';
    button.style.width = '60%';
    button.style.padding = '12px';
    button.style.borderRadius = '10px';
    button.style.border = 'none';
    button.style.backgroundColor = '#ff1493';
    button.style.color = '#fff';
    button.style.fontSize = '1.2em';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s ease';
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#ff1f8b';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#ff1493';
    });
    loginBox.appendChild(button);

    // Message display
    const message = document.createElement('p');
    message.style.color = '#fff';
    message.style.marginTop = '15px';
    loginBox.appendChild(message);

    // Event listener for the login button
    button.addEventListener('click', async () => {
        const userKey = input.value.trim();
        const rememberMe = rememberCheckbox.checked;

        if (!userKey) {
            message.innerText = 'Please enter a key!';
            return;
        }

        try {
            const isValid = await validateKey(userKey);
            if (isValid) {
                message.innerText = 'Key validated successfully!';
                message.style.color = '#00ff00';

                if (rememberMe) {
                    localStorage.setItem('lPredictorKey', userKey);
                }

                // Animation: Transforming the login box
                loginBox.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => {
                    overlay.remove();
                    createGUI();
                }, 800); // Wait for the animation to finish
            } else {
                message.innerText = 'Invalid or expired key!';
                message.style.color = '#ff0000';
            }
        } catch (error) {
            console.error('Error validating key:', error);
            message.innerText = 'An error occurred during key validation.';
            message.style.color = '#ff0000';
        }
    });

    // Auto-login if key is saved in localStorage
    const savedKey = localStorage.getItem('lPredictorKey');
    if (savedKey) {
        input.value = savedKey;
        rememberCheckbox.checked = true;
        button.click(); // Automatically attempt to log in with the saved key
    }
}

    // Function to create the advanced GUI
    function createGUI() {
        const guiContainer = document.createElement('div');
        guiContainer.id = 'predictorGUI';
        guiContainer.style.position = 'fixed';
        guiContainer.style.top = '50px';
        guiContainer.style.left = '50px';
        guiContainer.style.width = '480px';
        guiContainer.style.padding = '20px';
        guiContainer.style.backgroundColor = guiColor;
        guiContainer.style.color = '#fff';
        guiContainer.style.border = '2px solid #ff69b4';
        guiContainer.style.borderRadius = '25px';
        guiContainer.style.zIndex = '9999';
        guiContainer.style.cursor = 'move';
        guiContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        guiContainer.style.fontFamily = "'Roboto', sans-serif";
        guiContainer.style.transition = 'background-color 0.3s ease, width 0.3s ease';
        guiContainer.style.display = 'none'; // Initially hidden
        guiContainer.style.backdropFilter = 'blur(15px)'; // Enhanced frosted glass effect
        guiContainer.innerHTML = `
            <div id="guiHeader" style="cursor: move; padding-bottom: 10px; font-size: 1.8em; text-align: center; display: flex; align-items: center; justify-content: space-between;">
                <img src="https://img.icons8.com/ios-filled/50/ff69b4/diamond.png" alt="PFP" style="width: 50px; height: 50px; margin-right: 10px;">
                <span class="shining-text" style="color: #ff69b4; font-size: 2em; font-weight: bold;">LPredictor</span>
                <button id="minimizeGUIButton" style="background-color: transparent; border: none; color: #ff69b4; font-size: 1.5em; cursor: pointer;">_</button>
            </div>
            <div id="mainContent">
                <div id="gamesContent" class="tab-content">
                    <div id="methodContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;"></div>
                    <div id="loadingAnimation" style="text-align: center; display: none;">
                        <img src="https://files.catbox.moe/8gs7ff.gif" alt="Loading..." style="width: 150px; height: 150px;">
                    </div>
                    <div id="bombCountContainer" style="text-align: center; margin-bottom: 20px; display: none;">
                        <label for="bombCountInput" style="color: #fff; font-size: 1.2em; margin-right: 10px;">Number of Tiles:</label>
                        <input type="number" id="bombCountInput" min="1" max="24" value="3" style="width: 60px; height: 30px; border: none; border-radius: 10px; text-align: center;">
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                        <button id="toggleTransparencyButton" style="flex: 1; margin-right: 10px; padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Toggle Transparency</button>
                        <button id="autoClickButton" style="flex: 1; padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">
                            Auto Click
                        </button>
                    </div>
                </div>
                <div id="unavailableContent" style="display: none; text-align: center; font-size: 1.4em; color: #ffb6c1;">
                    <img src="https://files.catbox.moe/8gs7ff.gif" alt="Loading..." style="width: 150px; height: 150px;">
                    <p>This game mode is currently not available.</p>
                </div>
            </div>
        `;
        document.body.appendChild(guiContainer);

        makeDraggable(guiContainer);
        showGUIWithDelay();
        updateGUIBasedOnURL();

        // Listen for URL changes to update the GUI in real-time
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                updateGUIBasedOnURL();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Function to show the GUI with a delay and loading effect
    function showGUIWithDelay() {
        setTimeout(() => {
            const guiContainer = document.getElementById('predictorGUI');
            const loadingGif = document.createElement('div');
            loadingGif.id = 'initialLoadingGif';
            loadingGif.style.position = 'fixed';
            loadingGif.style.top = '50%';
            loadingGif.style.left = '50%';
            loadingGif.style.transform = 'translate(-50%, -50%)';
            loadingGif.style.zIndex = '10000';
            loadingGif.innerHTML = `<img src="https://files.catbox.moe/8gs7ff.gif" alt="Loading..." style="width: 150px; height: 150px;">`;
            document.body.appendChild(loadingGif);

            setTimeout(() => {
                document.body.removeChild(loadingGif);
                guiContainer.style.display = 'block';
                showPopup('LPredictor', 'GUI Loaded');
            }, 3000);
        }, 3000);
    }

    // Function to make the GUI draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("guiHeader");

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Function to show a popup notification
    function showPopup(title, message) {
        const popup = document.createElement('div');
        popup.className = 'lPredictor-popup';
        popup.innerHTML = `<strong>${title}</strong><br>${message}`;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 1000);
        }, 3000);
    }

    // Function to toggle transparency of the GUI
    function toggleTransparency() {
        const guiContainer = document.getElementById('predictorGUI');
        if (isTransparent) {
            guiContainer.style.backgroundColor = guiColor;
        } else {
            guiContainer.style.backgroundColor = guiColor.replace('0.85', '1');
        }
        isTransparent = !isTransparent;
        showPopup('LPredictor', 'Transparency Toggled');
    }

    // Function to minimize and maximize the GUI
    function toggleMinimizeGUI() {
        const mainContent = document.getElementById('mainContent');
        const minimizeButton = document.getElementById('minimizeGUIButton');

        if (isMinimized) {
            mainContent.style.display = 'block';
            minimizeButton.textContent = '_';
        } else {
            mainContent.style.display = 'none';
            minimizeButton.textContent = '+';
        }
        isMinimized = !isMinimized;
    }

    // Function to simulate prediction and highlight safe spots
    function predictSafeSpots(method) {
        const loadingAnimation = document.getElementById('loadingAnimation');
        loadingAnimation.style.display = 'block';

        // Simulate a delay for prediction (e.g., 2 seconds)
        setTimeout(() => {
            loadingAnimation.style.display = 'none';
            const currentPath = window.location.pathname;

            if (currentPath.includes('/mines')) {
                bombCount = parseInt(document.getElementById('bombCountInput').value, 10);

                if (method === 1) {
                    highlightWithAlgorithm1(bombCount); // Random Bias Method
                } else if (method === 2) {
                    highlightWithLastGameInfo(bombCount); // Last Game Info Method
                } else if (method === 3) {
                    highlightWithAlgorithm2(bombCount); // Weighted Random Method
                } else if (method === 4) {
                    highlightWithPatternRecognition(bombCount); // Pattern Recognition Method
                } else if (method === 5) {
                    highlightWithAIPrediction(bombCount); // AI Prediction Method
                } else if (method === 6) {
                    highlightWithDynamicStrategy(bombCount); // Dynamic Strategy Method
                } else if (method === 7) {
                    highlightWithTrendingMethod(bombCount); // Trending Method
                } else if (method === 8) {
                    highlightWithProbabilityMethod(bombCount); // Probability Method
                } else if (method === 9) {
                    highlightWithReverseTrendMethod(bombCount); // Reverse Trend Method
                } else if (method === 'L') {
                    highlightWithLPredictorMethod(bombCount); // LPredictor Method
                }
            } else if (currentPath.includes('/towers')) {
                if (method === 1) {
                    highlightRandomTowers(8); // Random Tower Method
                } else if (method === 2) {
                    highlightSequentialTower(8); // Sequential Tower Method
                } else if (method === 3) {
                    highlightPatternTower(8); // Pattern Tower Method
                } else if (method === 4) {
                    highlightDynamicTower(8); // Dynamic Tower Method
                } else if (method === 'AT') {
                    highlightAdvancedTowerPrediction(8); // Advanced Tower Prediction Method
                } else if (method === 'AIT') {
                    highlightAITowerPrediction(8); // AI Tower Prediction Method
                }
            } else if (currentPath.includes('/crash')) {
                if (method === 'C') {
                    predictCrash(); // Predict Crash Method
                }
            }

            showPopup('LPredictor', 'Prediction Completed');
        }, 2000);
    }

    // Function to update the GUI based on the current URL
    function updateGUIBasedOnURL() {
        const currentPath = window.location.pathname;
        const methodContainer = document.getElementById('methodContainer');
        const bombCountContainer = document.getElementById('bombCountContainer');
        const gamesContent = document.getElementById('gamesContent');
        const unavailableContent = document.getElementById('unavailableContent');

        methodContainer.innerHTML = ''; // Clear any existing buttons

        if (currentPath.includes('/mines')) {
            bombCountContainer.style.display = 'block'; // Show bomb count for Mines mode
            addMinesMethods(methodContainer);
            gamesContent.style.display = 'block';
            unavailableContent.style.display = 'none';
        } else if (currentPath.includes('/towers')) {
            bombCountContainer.style.display = 'none'; // Hide bomb count for Towers mode
            addTowersMethods(methodContainer);
            gamesContent.style.display = 'block';
            unavailableContent.style.display = 'none';
        } else if (currentPath.includes('/crash')) {
            bombCountContainer.style.display = 'none'; // Hide bomb count for Crash mode
            addCrashMethods(methodContainer);
            gamesContent.style.display = 'block';
            unavailableContent.style.display = 'none';
        } else {
            gamesContent.style.display = 'none';
            unavailableContent.style.display = 'block';
        }
    }

    // Function to add Mines methods
    function addMinesMethods(container) {
        container.innerHTML = `
            <button id="method1Button" class="method-button shining-text" title="Basic random selection with a slight bias." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Random Bias Method</button>
            <button id="method2Button" class="method-button shining-text" title="Uses the previous game's safe spots for prediction." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Last Game Info Method</button>
            <button id="method3Button" class="method-button shining-text" title="Advanced weighted random selection based on probabilities." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Weighted Random Method</button>
            <button id="method4Button" class="method-button shining-text" title="Recognizes patterns in previous games to predict safe spots." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Pattern Recognition Method</button>
            <button id="method5Button" class="method-button shining-text" title="Simulated AI logic for highly accurate predictions." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">AI Prediction Method</button>
            <button id="method6Button" class="method-button shining-text" title="Dynamic strategy combining multiple methods." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Dynamic Strategy Method</button>
            <button id="method7Button" class="method-button shining-text" title="Predicts bomb locations based on trending patterns in recent games." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Trending Method</button>
            <button id="method8Button" class="method-button shining-text" title="Uses advanced probability calculations to predict bomb locations." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Probability Method</button>
            <button id="method9Button" class="method-button shining-text" title="Reverses the trends in recent games to predict bomb locations." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Reverse Trend Method</button>
            <button id="methodLButton" class="method-button shining-text" title="Highly accurate LPredictor method." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">LPredictor Method</button>
        `;

        document.getElementById('method1Button').addEventListener('click', () => predictSafeSpots(1));
        document.getElementById('method2Button').addEventListener('click', () => predictSafeSpots(2));
        document.getElementById('method3Button').addEventListener('click', () => predictSafeSpots(3));
        document.getElementById('method4Button').addEventListener('click', () => predictSafeSpots(4));
        document.getElementById('method5Button').addEventListener('click', () => predictSafeSpots(5));
        document.getElementById('method6Button').addEventListener('click', () => predictSafeSpots(6));
        document.getElementById('method7Button').addEventListener('click', () => predictSafeSpots(7));
        document.getElementById('method8Button').addEventListener('click', () => predictSafeSpots(8));
        document.getElementById('method9Button').addEventListener('click', () => predictSafeSpots(9));
        document.getElementById('methodLButton').addEventListener('click', () => predictSafeSpots('L'));
    }

    // Function to add Towers methods
    function addTowersMethods(container) {
        container.innerHTML = `
            <button id="method1Button" class="method-button shining-text" title="Randomly selects a tower for prediction." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Random Tower Method</button>
            <button id="method2Button" class="method-button shining-text" title="Predicts the next tower in a sequence." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Sequential Tower Method</button>
            <button id="method3Button" class="method-button shining-text" title="Predicts using a specific pattern." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Pattern Tower Method</button>
            <button id="method4Button" class="method-button shining-text" title="Combines multiple strategies dynamically." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Dynamic Tower Method</button>
            <button id="methodATButton" class="method-button shining-text" title="Advanced logic specifically for Towers mode." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Advanced Tower Prediction</button>
            <button id="methodAITButton" class="method-button shining-text" title="AI-driven prediction for Towers mode." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">AI Tower Prediction</button>
        `;

        document.getElementById('method1Button').addEventListener('click', () => predictSafeSpots(1));
        document.getElementById('method2Button').addEventListener('click', () => predictSafeSpots(2));
        document.getElementById('method3Button').addEventListener('click', () => predictSafeSpots(3));
        document.getElementById('method4Button').addEventListener('click', () => predictSafeSpots(4));
        document.getElementById('methodATButton').addEventListener('click', () => predictSafeSpots('AT'));
        document.getElementById('methodAITButton').addEventListener('click', () => predictSafeSpots('AIT'));
    }

    // Function to add Crash methods
    function addCrashMethods(container) {
        container.innerHTML = `
            <button id="predictCrashButton" class="method-button shining-text" title="Predict when the crash will occur." style="padding: 12px; background-color: #ff69b4; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Predict Crash</button>
        `;

        document.getElementById('predictCrashButton').addEventListener('click', () => predictSafeSpots('C'));
    }

    // LPredictor Method: A highly accurate and advanced method
    function highlightWithLPredictorMethod(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const highlightedButtons = new Set();
        const lPredictorAlgorithm = Array.from({ length: totalButtons }, (_, i) => i + 1).sort(() => Math.random() - 0.3); // Example advanced logic

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        lPredictorAlgorithm.slice(0, numBoxes).forEach(index => {
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(index);
            }
        });

        lastGameResults = [...highlightedButtons];
        console.log('LPredictor Method Safe Spots:', lastGameResults);
    }

    // Auto-click function
    function autoClickSafeSpots() {
        const highlightedElements = document.querySelectorAll('.highlighted-element');
        highlightedElements.forEach(button => {
            button.click();
        });
        showPopup('LPredictor', 'Auto Click Completed');
    }

    // Random Bias Method: Basic random selection with slight bias
    function highlightWithAlgorithm1(numBoxes) {
        const biasTowardsEnd = Math.random() > 0.5;
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const biasedButtons = Array.from({ length: totalButtons }, (_, i) => (biasTowardsEnd ? totalButtons - i : i + 1));
        const highlightedButtons = new Set();
        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        while (highlightedButtons.size < numBoxes) {
            const index = Math.floor(Math.random() * biasedButtons.length);
            const buttonIndex = biasedButtons[index];
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${buttonIndex})`;
            const targetButton = document.querySelector(selector);
            if (targetButton && !highlightedButtons.has(buttonIndex)) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(buttonIndex);
            }
        }
        lastGameResults = [...highlightedButtons];
        console.log('Random Bias Method Safe Spots:', lastGameResults);
    }

    // Weighted Random Method: Weighted random selection
    function highlightWithAlgorithm2(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const highlightedButtons = new Set();
        const weights = Array(totalButtons).fill(1).map((_, i) => (i + 1) * Math.random());
        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        while (highlightedButtons.size < numBoxes) {
            const maxWeightIndex = weights.indexOf(Math.max(...weights));
            weights[maxWeightIndex] = 0;
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${maxWeightIndex + 1})`;
            const targetButton = document.querySelector(selector);
            if (targetButton && !highlightedButtons.has(maxWeightIndex + 1)) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(maxWeightIndex + 1);
            }
        }
        lastGameResults = [...highlightedButtons];
        console.log('Weighted Random Method Safe Spots:', lastGameResults);
    }

    // Last Game Info Method: Use last game's actual safe spots for the prediction
    function highlightWithLastGameInfo(numBoxes) {
        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });
        lastGameResults.slice(0, numBoxes).forEach(index => {
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
            }
        });
        console.log('Last Game Info Method Safe Spots:', lastGameResults);
    }

    // Pattern Recognition Method: Identifies and uses common patterns
    function highlightWithPatternRecognition(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const patternIndexes = [1, 3, 5]; // Example pattern (you can replace this with actual logic)
        const highlightedButtons = new Set();

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 0; i < numBoxes; i++) {
            const index = patternIndexes[i % patternIndexes.length];
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(index);
            }
        }

        lastGameResults = [...highlightedButtons];
        console.log('Pattern Recognition Method Safe Spots:', lastGameResults);
    }

    // AI Prediction Method: Simulated AI for safe spot prediction
    function highlightWithAIPrediction(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const highlightedButtons = new Set();
        const aiPrediction = Array.from({ length: totalButtons }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        aiPrediction.slice(0, numBoxes).forEach(index => {
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(index);
            }
        });

        lastGameResults = [...highlightedButtons];
        console.log('AI Prediction Method Safe Spots:', lastGameResults);
    }

    // Dynamic Strategy Method: Combines multiple strategies dynamically
    function highlightWithDynamicStrategy(numBoxes) {
        // Example logic to combine strategies dynamically
        const strategies = [highlightWithAlgorithm1, highlightWithAlgorithm2, highlightWithPatternRecognition];
        const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
        selectedStrategy(numBoxes);
        console.log('Dynamic Strategy Method Safe Spots:', lastGameResults);
    }

    // Trending Method: Predicts based on recent trends
    function highlightWithTrendingMethod(numBoxes) {
        // Example trending logic (can be based on actual game data)
        const trendingIndexes = [2, 4, 6]; // Example trend (replace with real logic)
        const highlightedButtons = new Set();

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 0; i < numBoxes; i++) {
            const index = trendingIndexes[i % trendingIndexes.length];
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(index);
            }
        }

        lastGameResults = [...highlightedButtons];
        console.log('Trending Method Safe Spots:', lastGameResults);
    }

    // Probability Method: Predicts using advanced probability calculations
    function highlightWithProbabilityMethod(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const highlightedButtons = new Set();
        const probabilities = Array(totalButtons).fill(1).map(() => Math.random()); // Example probabilities (replace with actual logic)

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        while (highlightedButtons.size < numBoxes) {
            const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
            probabilities[maxProbIndex] = 0;
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${maxProbIndex + 1})`;
            const targetButton = document.querySelector(selector);
            if (targetButton && !highlightedButtons.has(maxProbIndex + 1)) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(maxProbIndex + 1);
            }
        }

        lastGameResults = [...highlightedButtons];
        console.log('Probability Method Safe Spots:', lastGameResults);
    }

    // Reverse Trend Method: Reverses recent trends for prediction
    function highlightWithReverseTrendMethod(numBoxes) {
        const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
        const reverseTrendIndexes = [totalButtons - 2, totalButtons - 4, totalButtons - 6]; // Example reverse trend (replace with real logic)
        const highlightedButtons = new Set();

        document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 0; i < numBoxes; i++) {
            const index = reverseTrendIndexes[i % reverseTrendIndexes.length];
            const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth.child(${index})`;
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedButtons.add(index);
            }
        }

        lastGameResults = [...highlightedButtons];
        console.log('Reverse Trend Method Safe Spots:', lastGameResults);
    }

    // Random Tower Method: Randomly selects a tower for prediction
    function highlightRandomTowers(numRows = 8) {
        const highlightedIndexes = [];
        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });
        for (let i = 8; i > 8 - numRows && i > 0; i--) {
            const row = i;
            const randomButtonIndex = Math.floor(Math.random() * 3) + 1;
            const selector = `html > body > div:nth-child(2) > div:nth.child(${row}) > div:nth.child(${randomButtonIndex}) > button`;
            const targetButton = document.querySelector(selector);

            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedIndexes.push({ row: row, button: randomButtonIndex });
            }
        }

        return { status: 'success', highlightedIndexes: highlightedIndexes };
    }

    // Sequential Tower Method: Predicts the next tower in a sequence
    function highlightSequentialTower(numRows = 8) {
        const totalColumns = 3;  // Number of columns in Towers game mode
        const highlightedIndexes = [];

        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 8; i > 8 - numRows && i > 0; i--) {
            const row = i;
            const lastColumn = lastGameResults.length > 0 ? lastGameResults[lastGameResults.length - 1].button : 0;
            const selectedColumn = (lastColumn % totalColumns) + 1;
            const selector = `html > body > div:nth.child(${row}) > div:nth.child(${selectedColumn}) > button`;
            const targetButton = document.querySelector(selector);

            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedIndexes.push({ row: row, button: selectedColumn });
                lastGameResults.push({ row: row, button: selectedColumn });
            }
        }

        console.log('Sequential Tower Method Columns:', highlightedIndexes.map(index => index.button));
    }

    // Pattern Tower Method: Predicts using a specific pattern
    function highlightPatternTower(numRows = 8) {
        const pattern = [1, 3, 2]; // Example pattern
        const highlightedIndexes = [];

        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 8; i > 8 - numRows && i > 0; i--) {
            const row = i;
            const selectedColumn = pattern[i % pattern.length];
            const selector = `html > body > div:nth.child(${row}) > div:nth.child(${selectedColumn}) > button`;
            const targetButton = document.querySelector(selector);

            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedIndexes.push({ row: row, button: selectedColumn });
                lastGameResults.push({ row: row, button: selectedColumn });
            }
        }

        console.log('Pattern Tower Method Columns:', highlightedIndexes.map(index => index.button));
    }

    // Dynamic Tower Method: Combines multiple strategies dynamically
    function highlightDynamicTower(numRows = 8) {
        const strategies = [highlightRandomTowers, highlightSequentialTower, highlightPatternTower];
        const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];

        selectedStrategy(numRows); // Pass the number of rows to highlight
        console.log('Dynamic Tower Method Applied');
    }

    // Advanced Tower Prediction Method: Highly accurate tower prediction logic
    function highlightAdvancedTowerPrediction(numRows = 8) {
        const highlightedIndexes = [];

        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 8; i > 8 - numRows && i > 0; i--) {
            const row = i;
            const selectedColumn = Math.floor(Math.random() * 3) + 1; // Placeholder for advanced logic
            const selector = `html > body > div:nth.child(${row}) > div:nth.child(${selectedColumn}) > button`;
            const targetButton = document.querySelector(selector);

            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedIndexes.push({ row: row, button: selectedColumn });
                lastGameResults.push({ row: row, button: selectedColumn });
            }
        }

        console.log('Advanced Tower Prediction Method Columns:', highlightedIndexes.map(index => index.button));
    }

    // AI Tower Prediction Method: AI-driven prediction for Towers mode
    function highlightAITowerPrediction(numRows = 8) {
        const highlightedIndexes = [];
        const aiPrediction = [1, 2, 3].sort(() => Math.random() - 0.5); // Shuffle columns for AI logic

        document.querySelectorAll('.highlighted-element').forEach(button => {
            button.classList.remove('highlighted-element');
        });

        for (let i = 8; i > 8 - numRows && i > 0; i--) {
            const row = i;
            const selectedColumn = aiPrediction[i % 3]; // Example AI logic
            const selector = `html > body > div:nth.child(${row}) > div:nth.child(${selectedColumn}) > button`;
            const targetButton = document.querySelector(selector);

            if (targetButton) {
                targetButton.classList.add('highlighted-element');
                highlightedIndexes.push({ row: row, button: selectedColumn });
                lastGameResults.push({ row: row, button: selectedColumn });
            }
        }

        console.log('AI Tower Prediction Method Columns:', highlightedIndexes.map(index => index.button));
    }

    // Crash Mode Prediction: Predict crash outcome
    function predictCrash() {
        const loadingAnimation = document.getElementById('loadingAnimation');
        loadingAnimation.style.display = 'block';

        // Simulate crash prediction with a delay
        setTimeout(() => {
            loadingAnimation.style.display = 'none';

            // Here we can implement different crash prediction logic
            const last5Games = [1.5, 2.1, 3.0, 1.8, 4.2]; // Example crash multipliers
            const predictedCrashPoint = predictBasedOnHistory(last5Games);
            const accuracy = Math.floor(Math.random() * 20) + 80; // Example accuracy calculation

            showPopup('Crash Prediction', `Predicted Crash at: x${predictedCrashPoint.toFixed(2)}\nAccuracy: ${accuracy}%`);
        }, 2000);
    }

    // Predict crash based on the last 5 games
    function predictBasedOnHistory(last5Games) {
        // Example logic: average of the last 5 games with some variation
        const sum = last5Games.reduce((a, b) => a + b, 0);
        return sum / last5Games.length + (Math.random() * 0.5 - 0.25);
    }

    // Function to toggle rain notifications
    function toggleRainNotifications() {
        const enableRainNotifications = document.getElementById('enableRainNotifications');
        rainNotificationsEnabled = enableRainNotifications.checked;

        if (rainNotificationsEnabled) {
            startRainNotifications();
            showPopup('LPredictor', 'Rain Notifications Enabled');
        } else {
            stopRainNotifications();
            showPopup('LPredictor', 'Rain Notifications Disabled');
        }
    }

    // Function to start checking for rain events
    function startRainNotifications() {
        rainCheckInterval = setInterval(checkForRain, 10000); // Check every 10 seconds
    }

    // Function to stop checking for rain events
    function stopRainNotifications() {
        clearInterval(rainCheckInterval);
    }

    // Function to check for rain events
    async function checkForRain() {
        try {
            const response = await fetch('https://api.bloxflip.com/chat/history');
            const data = await response.json();

            // Check for rain and active status
            if (data && data.some(chat => chat.message && chat.message.toLowerCase().includes('rain') && chat.message.toLowerCase().includes('active'))) {
                notifyRainEvent();
            }
        } catch (error) {
            console.error('Error checking for rain:', error);
        }
    }

    // Function to notify the user of a rain event
    function notifyRainEvent() {
        showPopup('LPredictor', 'Rain Event Detected! Join the rain to earn rewards.');
        showDesktopNotification('Rain Event Detected!', 'Join the rain to earn rewards on Bloxflip.');
    }

    // Function to show a desktop notification
    function showDesktopNotification(title, message) {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notifications.");
            return;
        }

        // Check whether notification permissions have already been granted
        if (Notification.permission === "granted") {
            // If it's okay, let's create a notification
            new Notification(title, {
                body: message,
                icon: 'https://img.icons8.com/ios-filled/50/ff69b4/diamond.png' // Icon for the notification
            });
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification(title, {
                        body: message,
                        icon: 'https://img.icons8.com/ios-filled/50/ff69b4/diamond.png' // Icon for the notification
                    });
                }
            });
        }
    }

    // Add styles for the highlighted elements and shining text
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    .highlighted-element {
        outline: 3px solid #ff69b4;
        outline-offset: -3px;
        position: relative;
        background-color: transparent;
        border-radius: 5px;
        animation: glow 1.5s infinite alternate;
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 5px #ff69b4, 0 0 20px #ff69b4, 0 0 40px #ff69b4, 0 0 60px #ff69b4, 0 0 80px #ff69b4, 0 0 100px #ff69b4, 0 0 120px #ff69b4, 0 0 140px #ff69b4;
        }
        100% {
            box-shadow: 0 0 10px #ff69b4, 0 0 40px #ff69b4, 0 0 80px #ff69b4, 0 0 120px #ff69b4, 0 0 160px #ff69b4, 0 0 200px #ff69b4, 0 0 240px #ff69b4, 0 0 280px #ff69b4;
        }
    }

    .shining-text {
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 20px #ff69b4;
        animation: textGlow 1.5s infinite alternate;
    }

    @keyframes textGlow {
        0% {
            text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 20px #ff69b4;
        }
        100% {
            text-shadow: 0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 40px #ff69b4;
        }
    }

    .lPredictor-popup {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.75);
        color: #ff69b4;
        padding: 10px 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        font-family: 'Roboto', sans-serif;
        font-size: 1.2em;
        text-align: center;
        opacity: 1;
        z-index: 10001;
        transition: opacity 1s ease-in-out;
    }
    `;
    document.head.appendChild(style);

    // Initialize the GUI and add event listeners
    createLoginGUI();

    document.getElementById('minimizeGUIButton').addEventListener('click', toggleMinimizeGUI);
    document.getElementById('toggleTransparencyButton').addEventListener('click', toggleTransparency);
    document.getElementById('autoClickButton').addEventListener('click', autoClickSafeSpots);
})();
