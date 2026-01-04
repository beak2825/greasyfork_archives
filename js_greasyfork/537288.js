// ==UserScript==
// @name         1heo's Dice Color Prediction (V1.0)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Predicts next color with manual input for 6-color dice system
// @author       1heo
// @match        https://www.online-dice.com/roll-color-dice/3/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537288/1heo%27s%20Dice%20Color%20Prediction%20%28V10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537288/1heo%27s%20Dice%20Color%20Prediction%20%28V10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    GM_addStyle(`
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .heo-ui-container {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background-color: #301934;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
            width: 220px;
            text-align: center;
        }
        .heo-title {
            margin-top: 0;
            margin-bottom: 15px;
            background: linear-gradient(to right, red, orange, yellow, green, blue, purple);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
            animation: rainbow 2s linear infinite;
            background-size: 600% 100%;
        }
        .heo-prediction {
            color: white;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
            min-height: 24px;
        }
        .heo-input-container {
            margin-bottom: 15px;
        }
        .heo-color-select {
            width: 100%;
            padding: 5px;
            margin-bottom: 5px;
            border-radius: 5px;
            border: none;
        }
        .heo-submit-btn {
            background: linear-gradient(to right, #ff5e62, #ff9966);
            border: none;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .heo-submit-btn:hover {
            transform: scale(1.05);
        }
        .heo-discord-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .heo-discord-icon:hover {
            transform: scale(1.1);
        }
    `);

    // Create the main UI container
    const uiContainer = document.createElement('div');
    uiContainer.className = 'heo-ui-container';

    // Create the title with rainbow effect
    const title = document.createElement('h2');
    title.className = 'heo-title';
    title.textContent = "1heo's userscript";

    // Create input containers
    const inputContainer = document.createElement('div');
    inputContainer.className = 'heo-input-container';

    // Create 3 color select inputs
    const colorOptions = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];
    const selects = [];

    for (let i = 0; i < 3; i++) {
        const select = document.createElement('select');
        select.className = 'heo-color-select';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `Dice ${i+1}`;
        select.appendChild(defaultOption);

        // Add color options
        colorOptions.forEach(color => {
            const option = document.createElement('option');
            option.value = color.toLowerCase();
            option.textContent = color;
            select.appendChild(option);
        });

        inputContainer.appendChild(select);
        selects.push(select);
    }

    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'heo-submit-btn';
    submitBtn.textContent = 'Predict Next Color';

    // Create prediction display
    const predictionText = document.createElement('div');
    predictionText.className = 'heo-prediction';
    predictionText.textContent = "Select colors and click predict";

    // Create Discord icon/link
    const discordLink = document.createElement('a');
    discordLink.href = 'https://discord.gg/x3aUjnwbMt';
    discordLink.target = '_blank';
    discordLink.style.display = 'block';
    discordLink.style.marginTop = '10px';

    const discordIcon = document.createElement('img');
    discordIcon.className = 'heo-discord-icon';
    discordIcon.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png';
    discordIcon.alt = 'Discord';

    discordLink.appendChild(discordIcon);

    // Prediction logic
    function predictNextColor() {
        const colors = selects.map(select => select.value).filter(Boolean);

        if (colors.length !== 3) {
            predictionText.textContent = "Please select all 3 colors";
            predictionText.style.color = 'white';
            return;
        }

        // Simple prediction algorithm (replace with your own logic)
        const colorCount = {};
        colorOptions.forEach(color => {
            colorCount[color.toLowerCase()] = 0;
        });

        colors.forEach(color => {
            colorCount[color]++;
        });

        let prediction;

        // If two colors are the same, predict the third might come next
        for (const color in colorCount) {
            if (colorCount[color] >= 2) {
                // Find a color that hasn't appeared yet
                const missingColor = colorOptions.find(c =>
                    colorCount[c.toLowerCase()] === 0
                );
                prediction = missingColor ? missingColor.toLowerCase() : color;
                break;
            }
        }

        // If all colors are different, pick one randomly
        if (!prediction) {
            const options = colorOptions.map(c => c.toLowerCase());
            prediction = options[Math.floor(Math.random() * options.length)];
        }

        predictionText.textContent = `Next color: ${prediction}`;
        predictionText.style.color = prediction;
    }

    submitBtn.addEventListener('click', predictNextColor);

    // Assemble the UI
    uiContainer.appendChild(title);
    uiContainer.appendChild(inputContainer);
    uiContainer.appendChild(submitBtn);
    uiContainer.appendChild(predictionText);
    uiContainer.appendChild(discordLink);
    document.body.appendChild(uiContainer);
})();