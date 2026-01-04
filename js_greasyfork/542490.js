// ==UserScript==
// @name          Cytos Color Manager
// @namespace     https://tampermonkey.net/
// @version       1.6
// @description   Unique color modes
// @author        dakovisuals
// @match         https://cytos.io
// @icon          https://github.com/dakovisuals/CytosColorManager/blob/main/tampermonkey/favicon.jpg?raw=true
// @license       MIT

// @downloadURL https://update.greasyfork.org/scripts/542490/Cytos%20Color%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/542490/Cytos%20Color%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const token = localStorage.getItem('cytos-token');
    let isRunning = false; // To control the perk update loop

    localStorage.setItem('cytosPerkManagerActive', 'true');
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('cytosPerkManagerActive');
    });

    function generateRandomColor() {
        return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    const sliderConfig = {
        values: [
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1' },
            { value: 1.5, label: '1.5' },
            { value: 2, label: '2' },
            { value: 2.5, label:'2.5' }
        ],
        step: 0.5
    };

    (function createUI() {
        //div
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '50vw';
        container.style.height = '50vh';
        container.style.background = '#121212';
        container.style.color = 'white';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.fontFamily = 'Poppins, sans-serif';
        container.style.zIndex = '1000';
        container.style.boxShadow = '0 0 20px rgba(52, 77, 187, 0.7)';

        //h1
        const title = document.createElement('h1');
        title.innerText = 'Cytos Color Manager';
        title.style.marginBottom = '25px';
        title.style.color = '#00aaff';
        title.style.textShadow = '0 0 10px #00aaff';
        container.appendChild(title);

        //perk
        const perkLabel = document.createElement('label');
        perkLabel.innerText = 'Perk Name:';
        perkLabel.style.marginBottom = '10px'; 
        container.appendChild(perkLabel);

        const perkInput = document.createElement('input');
        perkInput.type = 'text';
        perkInput.placeholder = 'Enter a username';
        perkInput.value = '';
        perkInput.style.padding = '10px';
        perkInput.style.width = '250px';
        perkInput.style.border = '2px solid #00aaff';
        perkInput.style.borderRadius = '5px';
        perkInput.style.background = '#222';
        perkInput.style.color = 'white';
        perkInput.style.fontSize = '16px';
        perkInput.style.marginBottom = '15px'; 
        container.appendChild(perkInput);

        //color selection
        const colorModeLabel = document.createElement('label');
        colorModeLabel.innerText = 'Color Mode:';
        colorModeLabel.style.marginBottom = '10px';
        colorModeLabel.style.fontSize = '16px';
        container.appendChild(colorModeLabel);

        const colorModeSelect = document.createElement('select');
        colorModeSelect.style.padding = '10px';
        colorModeSelect.style.width = '250px';
        colorModeSelect.style.border = '2px solid #00aaff';
        colorModeSelect.style.borderRadius = '5px';
        colorModeSelect.style.background = '#222';
        colorModeSelect.style.color = '#00aaff'; 
        colorModeSelect.style.fontSize = '16px';
        colorModeSelect.style.fontWeight = 'bold';
        colorModeSelect.style.marginBottom = '25px';

        const randomColorOption = document.createElement('option');
        randomColorOption.value = 'random';
        randomColorOption.innerText = 'Random Color';
        colorModeSelect.appendChild(randomColorOption);

        const glowyBlackOption = document.createElement('option');
        glowyBlackOption.value = 'glowyBlack';
        glowyBlackOption.innerText = 'Glowly Color';
        colorModeSelect.appendChild(glowyBlackOption);

        container.appendChild(colorModeSelect);


        //slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = sliderConfig.values[0].value;
        slider.max = sliderConfig.values[sliderConfig.values.length - 1].value;
        slider.step = sliderConfig.step;
        slider.value = sliderConfig.values[0].value;


        // Create selected value label
        const selectedValueLabel = document.createElement('div');
        selectedValueLabel.id = 'selected-value';
        selectedValueLabel.textContent = `Selected: ${sliderConfig.values[0].label}`;
        selectedValueLabel.style.marginBottom = '7px';
        container.appendChild(selectedValueLabel);

        // Add an event listener to update when the slider changes
        slider.addEventListener('input', () => {
            const selectedValue = sliderConfig.values.find(opt => opt.value == slider.value).label
            selectedValueLabel.textContent = `Selected: ${selectedValue}`;
        });

        container.appendChild(slider);

        //slider delay label
        const delayLabel = document.createElement('label');
        delayLabel.innerText = '(delay in seconds):';
        delayLabel.style.color = '#888';
        delayLabel.style.marginTop = '7px';
        container.appendChild(delayLabel);

        //start/stop button
        const startStopButton = document.createElement('button');
        startStopButton.innerText = 'Start';
        startStopButton.style.padding = '12px 20px';
        startStopButton.style.border = '2px solid #00aaff';
        startStopButton.style.background = '#222'; 
        startStopButton.style.color = 'white'; 
        startStopButton.style.fontSize = '18px';
        startStopButton.style.cursor = 'pointer';
        startStopButton.style.borderRadius = '5px';
        startStopButton.style.marginTop = '20px';
        startStopButton.addEventListener('click', () => {
            if (!isRunning) {
                let color;
                const delay = slider.value * 1000;
                isRunning = true;
                startStopButton.innerText = 'Stop';
                startStopButton.style.backgroundColor = '#00aaff';
                startStopButton.style.color = 'white';
                sendRequest(perkInput.value, delay, colorModeSelect.value);
            } else {
                isRunning = false;
                startStopButton.innerText = 'Start';
                startStopButton.style.backgroundColor = '#222';
                startStopButton.style.color = 'white';
                }
            }
        );
        container.appendChild(startStopButton);


        const playAnotherTab = document.createElement('p');
        playAnotherTab.innerText = '▶ Play in Another Tab';
        playAnotherTab.style.fontSize = '16px';
        playAnotherTab.style.color = '#00aaff';
        playAnotherTab.style.marginTop = '15px';
        playAnotherTab.style.marginBottom = '20px';
        playAnotherTab.style.cursor = 'pointer';
        playAnotherTab.addEventListener('click', () => {
            window.open('https://cytos.io', '_blank'); // Open in a new tab
        });
        container.appendChild(playAnotherTab);

        // Show the note only once
        if (!localStorage.getItem('dataNoticeShown')) {
            const dataNotice = document.createElement('p');
            dataNotice.innerText = "Notation: We're not collecting data for security and functionality purposes.";
            dataNotice.style.fontSize = '12px';
            dataNotice.style.color = '#888';
            dataNotice.style.marginTop = '25px';
            container.appendChild(dataNotice);
            localStorage.setItem('dataNoticeShown', 'true');
        }

        const copyrights = document.createElement('p');
        copyrights.innerText = "Copyright © 2025, dakovisuals. All Rights Reserved.";
        copyrights.style.fontSize = '12px';
        copyrights.style.color = '#888';
        copyrights.style.marginTop = '10px';
        container.appendChild(copyrights);

        document.body.appendChild(container);

    })();


    async function sendRequest(perkName, delay, colorMode) {
        const url = 'https://cytos.io/api/skin/list';

        const headers = {
            'authorization': `${token}`,
            'content-type': 'application/json',
            'user-agent': navigator.userAgent
        };

        let colorToggle = false;
        while (isRunning) {
            let color;
            if (colorMode === 'random') {
                color = generateRandomColor();
                localStorage.setItem('cytos-settings-activeTabBorder', `#${color}`);
            } else if (colorMode === 'glowyBlack') {
                color = colorToggle ? 'c11212' : '000000';
                localStorage.setItem('cytos-settings-activeTabBorder', `#${color}`);
                colorToggle = !colorToggle;

            }
            const payload = {
                "perk_name_picked": perkName,
                "perk_color_picked": color
            };

    
            await fetch(url, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(payload)
            });

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    

    // Suppress errors from logging
    window.onerror = () => true;
})();