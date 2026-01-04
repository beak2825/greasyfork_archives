// ==UserScript==
// @name         Hamster Destroyer
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Auto-clicker with a simple UI for Hamster Kombat game
// @author       OutlawRGB
// @match        *://hamsterkombatgame.io/clicker*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507412/Hamster%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/507412/Hamster%20Destroyer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a draggable element
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const newLeft = event.clientX - offsetX;
                const newTop = event.clientY - offsetY;

                const uiWidth = element.offsetWidth;
                const uiHeight = element.offsetHeight;

                const maxLeft = window.innerWidth - uiWidth;
                const maxTop = window.innerHeight - uiHeight;

                const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
                const clampedTop = Math.max(0, Math.min(newTop, maxTop));

                element.style.left = clampedLeft + 'px';
                element.style.top = clampedTop + 'px';
            }
        });
    }

    // Function to apply a theme to the UI elements
    function applyTheme(theme) {
        const root = document.documentElement;
        const energyUI = document.getElementById('energy-ui');
        const settingsWindow = document.getElementById('settings-window');

        root.style.setProperty('--bg-color', theme.bgColor);
        root.style.setProperty('--text-color', theme.textColor);
        root.style.setProperty('--border-color', theme.borderColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        root.style.setProperty('--button-hover-color', theme.buttonHoverColor);

        if (energyUI) {
            energyUI.style.boxShadow = `0 4px 8px ${theme.shadowColor}`;
        }
        if (settingsWindow) {
            settingsWindow.style.boxShadow = `0 4px 8px ${theme.shadowColor}`;
        }
    }

    const themes = {
	  default: {
		name: 'Default',
		bgColor: '#333',
		textColor: '#fff',
		borderColor: '#444',
		accentColor: '#28a745',
		buttonHoverColor: '#218838',
		shadowColor: 'rgba(0, 0, 0, 0.3)',
	  },

	  // ----- LIGHT THEMES -----
	  light: {
		name: 'Light',
		bgColor: '#f8f9fa',
		textColor: '#343a40',
		borderColor: '#ced4da',
		accentColor: '#007bff',
		buttonHoverColor: '#0069d9',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },
	  light2: {
		name: 'Pastel Light',
		bgColor: '#f2f2f2',
		textColor: '#555',
		borderColor: '#ddd',
		accentColor: '#e83e8c',
		buttonHoverColor: '#c82333',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },
	  light3: {
		name: 'Creamy',
		bgColor: '#fff5e6',
		textColor: '#333',
		borderColor: '#ddd',
		accentColor: '#008CBA',
		buttonHoverColor: '#006080',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },
	  light4: {
		name: 'Vanilla',
		bgColor: '#fffdf7', 
		textColor: '#444',
		borderColor: '#eee',
		accentColor: '#f0ad4e',
		buttonHoverColor: '#ec971f', 
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },
	  light5: {
		name: 'Aqua',
		bgColor: '#e0ffff',
		textColor: '#333',
		borderColor: '#aeeeee',
		accentColor: '#00cccc',
		buttonHoverColor: '#00aaaa',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },
	  light6: {
		name: 'Lavender',
		bgColor: '#f8f4ff',
		textColor: '#555',
		borderColor: '#ddd',
		accentColor: '#9370db',
		buttonHoverColor: '#8a2be2',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
	  },

	  // ----- DARK THEMES -----
	  dark: {
		name: 'Dark',
		bgColor: '#212529',
		textColor: '#e9ecef',
		borderColor: '#343a40',
		accentColor: '#28a745', 
		buttonHoverColor: '#218838',
		shadowColor: 'rgba(255, 255, 255, 0.1)',
	  },
	  dark2: {
		name: 'Darker',
		bgColor: '#1a1a1a',
		textColor: '#ddd',
		borderColor: '#333',
		accentColor: '#5cb85c',
		buttonHoverColor: '#4cae4c', 
		shadowColor: 'rgba(255, 255, 255, 0.05)',
	  },
	  dark3: {
		name: 'Slate',
		bgColor: '#34495e', 
		textColor: '#bdc3c7',
		borderColor: '#2c3e50',
		accentColor: '#e74c3c',
		buttonHoverColor: '#c0392b', 
		shadowColor: 'rgba(0, 0, 0, 0.2)',
	  },
	  dark4: {
		name: 'Midnight Blue',
		bgColor: '#2c3e50', 
		textColor: '#eaeaea', 
		borderColor: '#34495e',
		accentColor: '#3498db', 
		buttonHoverColor: '#2980b9', 
		shadowColor: 'rgba(0, 0, 0, 0.3)',
	  },
	  dark5: {
		name: 'Deep Purple',
		bgColor: '#4b0082',
		textColor: '#d2b4de', 
		borderColor: '#663399',
		accentColor: '#da70d6',
		buttonHoverColor: '#ba55d3',
		shadowColor: 'rgba(255, 255, 255, 0.15)', 
	  },
	  dark6: {
		name: 'Cyberpunk',
		bgColor: '#120424',
		textColor: '#00ffea', 
		borderColor: '#081224',
		accentColor: '#00ffea',
		buttonHoverColor: '#00bfff',
		shadowColor: 'rgba(0, 255, 255, 0.2)', 
	  },

	  // ----- CONTRAST THEMES -----
	  contrast: {
		name: 'Green Contrast',
		bgColor: '#000',
		textColor: '#0f0',
		borderColor: '#0f0',
		accentColor: '#0f0',
		buttonHoverColor: '#0a0',
		shadowColor: 'rgba(0, 255, 0, 0.2)',
	  },
	  contrast2: {
		name: 'Red Contrast',
		bgColor: '#000',
		textColor: '#f00',
		borderColor: '#f00',
		accentColor: '#f00',
		buttonHoverColor: '#c00',
		shadowColor: 'rgba(255, 0, 0, 0.2)',
	  },
	  contrast3: {
		name: 'Blue Contrast',
		bgColor: '#000',
		textColor: '#08f', 
		borderColor: '#08f',
		accentColor: '#08f',
		buttonHoverColor: '#05a',
		shadowColor: 'rgba(0, 0, 255, 0.2)',
	  },
	  contrast4: {
		name: 'Yellow Contrast',
		bgColor: '#000',
		textColor: '#ff0', 
		borderColor: '#ff0', 
		accentColor: '#ff0',
		buttonHoverColor: '#cc0', 
		shadowColor: 'rgba(255, 255, 0, 0.2)',
	  },
	  contrast5: {
		name: 'Orange Contrast',
		bgColor: '#000',
		textColor: '#ffa500',
		borderColor: '#ffa500',
		accentColor: '#ffa500',
		buttonHoverColor: '#cc8400', 
		shadowColor: 'rgba(255, 165, 0, 0.2)',
	  }
    };

    // Function to initialize the settings window
    function initSettingsWindow() {
        const settingsWindow = document.createElement('div');
        settingsWindow.id = 'settings-window';

        // Generate HTML for theme options dynamically
        let themeOptionsHTML = '';

        // Add the default theme as a standalone option
        themeOptionsHTML +=
            '<div class="theme-column" style="width: calc(25% - 20px); margin-bottom: 15px;">' +
            '<h4>Default</h4>' +
            '<div class="theme-preview" data-theme="default" style="background-color: ' +
            themes.default.bgColor +
            '; border-color: ' +
            themes.default.accentColor +
            '; color: ' +
            themes.default.textColor +
            '"></div>' +
            '</div>';

        // Add Light themes
        themeOptionsHTML += '<div class="theme-column"><h4>Light</h4>';
        for (const themeKey in themes) {
            if (themeKey.includes('light') && themeKey !== 'default') {
                const theme = themes[themeKey];
                themeOptionsHTML +=
                    '<div class="theme-preview" data-theme="' +
                    themeKey +
                    '" style="background-color: ' +
                    theme.bgColor +
                    '; border-color: ' +
                    theme.accentColor +
                    ';"></div>' +
                    '<span>' +
                    theme.name +
                    '</span>';
            }
        }
        themeOptionsHTML += '</div>';

        // Add Dark themes
        themeOptionsHTML += '<div class="theme-column"><h4>Dark</h4>';
        for (const themeKey in themes) {
            if (themeKey.includes('dark') && themeKey !== 'default') {
                const theme = themes[themeKey];
                themeOptionsHTML +=
                    '<div class="theme-preview" data-theme="' +
                    themeKey +
                    '" style="background-color: ' +
                    theme.bgColor +
                    '; border-color: ' +
                    theme.accentColor +
                    ';"></div>' +
                    '<span>' +
                    theme.name +
                    '</span>';
            }
        }
        themeOptionsHTML += '</div>';

        // Add Contrast themes
        themeOptionsHTML += '<div class="theme-column"><h4>Contrast</h4>';
        for (const themeKey in themes) {
            if (themeKey.includes('contrast') && themeKey !== 'default') {
                const theme = themes[themeKey];
                themeOptionsHTML +=
                    '<div class="theme-preview" data-theme="' +
                    themeKey +
                    '" style="background-color: ' +
                    theme.bgColor +
                    '; border-color: ' +
                    theme.accentColor +
                    ';"></div>' +
                    '<span>' +
                    theme.name +
                    '</span>';
            }
        }
        themeOptionsHTML += '</div>';

        settingsWindow.innerHTML = `
			<div id="settings-header">
			  <span>Settings</span>
			  <button id="close-settings-button">✖︎</button>
			</div>
			<div id="settings-content">
			  <div class="settings-section">
				<div class="themes-header-container">
				  <h3>Themes</h3>
				  <hr class="section-line">
				  <div id="theme-options">
					${themeOptionsHTML}
				  </div>
				</div>
			  </div>
			</div>
		  `;

        // Style the settings window
        settingsWindow.style.position = 'absolute';
        settingsWindow.style.top = '50px';
        settingsWindow.style.left = '20px';
        settingsWindow.style.width = 'auto';
        settingsWindow.style.backgroundColor = 'var(--bg-color)';
        settingsWindow.style.color = 'var(--text-color)';
        settingsWindow.style.border = '1px solid var(--border-color)';
        settingsWindow.style.padding = '20px';
        settingsWindow.style.borderRadius = '8px';
        settingsWindow.style.boxShadow = '0 4px 8px var(--shadow-color)';
        settingsWindow.style.fontFamily = 'Arial, sans-serif';
        settingsWindow.style.zIndex = '10001';
        settingsWindow.style.display = 'none';
        settingsWindow.style.userSelect = 'none';

        makeDraggable(settingsWindow);

        const settingsHeader = settingsWindow.querySelector('#settings-header');
        settingsHeader.style.display = 'flex';
        settingsHeader.style.justifyContent = 'space-between';
        settingsHeader.style.alignItems = 'center';
        settingsHeader.style.marginBottom = '10px';

        const settingsHeaderText = settingsWindow.querySelector(
            '#settings-header > span',
        );
        settingsHeaderText.style.font = 'bold 16px Arial, sans-serif';
        settingsHeaderText.style.marginBottom = '10px';

        const closeSettingsButton = settingsWindow.querySelector(
            '#close-settings-button',
        );
        closeSettingsButton.style.padding = '6px 8px';
        closeSettingsButton.style.backgroundColor = 'var(--bg-color)';
        closeSettingsButton.style.color = 'var(--text-color)';
        closeSettingsButton.style.border = '1px solid var(--border-color)';
        closeSettingsButton.style.borderRadius = '4px';
        closeSettingsButton.style.cursor = 'pointer';
        closeSettingsButton.style.fontSize = '12px';
        closeSettingsButton.style.textAlign = 'center';
        closeSettingsButton.style.font = 'bold 14px Arial, sans-serif';

        const settingsContent = settingsWindow.querySelector('#settings-content');
        settingsContent.style.display = 'flex';
        settingsContent.style.flexDirection = 'column';

        const settingsSections =
              settingsWindow.querySelectorAll('.settings-section');
        settingsSections.forEach((section) => {
            section.style.marginBottom = '20px';
            section.style.textAlign = 'center';

            // Add lines above and below the header
            section.innerHTML = `
				<hr class="section-line">
				${section.innerHTML}
				<hr class="section-line">
			`;
        });

        const themeOptions = settingsWindow.querySelector('#theme-options');
        themeOptions.style.display = 'flex';
        themeOptions.style.flexWrap = 'wrap';
        themeOptions.style.justifyContent = 'space-between';
        themeOptions.style.gap = '20px';

        const themeColumns = settingsWindow.querySelectorAll('.theme-column');
        themeColumns.forEach((column) => {
            column.style.textAlign = 'center';
            column.style.width = 'calc(25% - 20px)';
            column.style.marginBottom = '30px';
            column.style.userSelect = 'none';
        });

        // Store original border colors
        const originalBorderColors = {};

        // Select themePreviews after innerHTML is set
        const themePreviews = settingsWindow.querySelectorAll('.theme-preview');
        themePreviews.forEach((preview) => {
            originalBorderColors[preview.dataset.theme] =
                themes[preview.dataset.theme].accentColor;

            preview.style.width = '100%';
            preview.style.height = '50px';
            preview.style.border = '2px solid';
            preview.style.borderRadius = '4px';
            preview.style.cursor = 'pointer';
            preview.style.marginBottom = '15px';

            // Apply the gradient and border for each preview based on its theme
            const themeName = preview.dataset.theme;
            const theme = themes[themeName];

            preview.style.setProperty(
                'background',
                `linear-gradient(to right, ${theme.bgColor} 0%, ${theme.bgColor} 50%, ${theme.accentColor} 50%, ${theme.accentColor} 100%)`,
            );
            preview.style.borderColor = originalBorderColors[themeName];
            preview.style.userSelect = 'none';

            // Save theme and update UI on theme preview click
            preview.addEventListener('click', () => {
                // Apply the selected theme
                applyTheme(themes[themeName]);

                // Save the theme to localStorage
                localStorage.setItem('hamsterDestroyerTheme', themeName);

                // Restore original border colors for all previews
                themePreviews.forEach((p) => {
                    p.style.borderColor = originalBorderColors[p.dataset.theme];
                });
            });
        });

        // Close settings button functionality
        closeSettingsButton.addEventListener('click', () => {
            settingsWindow.style.display = 'none';
        });

        document.body.appendChild(settingsWindow);
    }

    // Function to initialize the main script
    function initScript() {
        // Create the global <style> tag and add CSS
        const style = document.createElement('style');
        style.innerHTML = `
		  :root {
			--bg-color: ${themes.default.bgColor};
			--text-color: ${themes.default.textColor};
			--border-color: ${themes.default.borderColor};
			--accent-color: ${themes.default.accentColor};
			--button-hover-color: ${themes.default.buttonHoverColor};
			--shadow-color: ${themes.default.shadowColor};
		  }

		  .section-line {
			border: none;
			height: 1px;
			background-color: var(--border-color);
			margin: 15px 0;
		  }

		  .themes-header-container {
			display: block;
			width: 100%;
		  }

		  .theme-preview {
			margin-bottom: 5px;
		  }

		  .theme-column span {
			display: block;
			margin-top: -10px;
			margin-bottom: 15px;
		  }

		  .theme-column h4 {
			margin-bottom: 15px;
		  }

		  .settings-buttons {
			margin-top: 20px; /* Add some spacing above the buttons */
			display: flex;
			justify-content: space-around; /* Space buttons evenly */
		  }

		  .settings-buttons button {
			padding: 8px 16px;
			background-color: var(--accent-color);
			color: #fff;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			font-size: 14px;
		  }

		  .settings-buttons button:hover {
			background-color: var(--button-hover-color);
		  }
		`;
        document.head.appendChild(style);

        // Create the main UI (energyUI)
        const energyUI = document.createElement('div');
        energyUI.id = 'energy-ui';
        energyUI.innerHTML = `
		  <div id="header">
			Hamster Destroyer v1.3a
			<button id="settings-button">✎</button>
		  </div>
		  <div id="buttons-container">
			<button id="toggle-button" class="off">START</button>
			<button id="close-button">✖︎</button>
		  </div>
		  <div id="credits">Created by <a href="https://github.com/RGB-Outl4w" target="_blank">OutlawRGB</a></div>
		`;

        // Style the energyUI
        energyUI.style.position = 'absolute';
        energyUI.style.top = '10px';
        energyUI.style.right = '20px';
        energyUI.style.backgroundColor = 'var(--bg-color)';
        energyUI.style.color = 'var(--text-color)';
        energyUI.style.border = '1px solid var(--border-color)';
        energyUI.style.padding = '10px';
        energyUI.style.borderRadius = '8px';
        energyUI.style.boxShadow = '0 4px 8px var(--shadow-color)';
        energyUI.style.fontFamily = 'Arial, sans-serif';
        energyUI.style.zIndex = '10000';
        energyUI.style.width = '300px';

        const header = energyUI.querySelector('#header');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.font = 'bold 14px Arial, sans-serif';
        header.style.marginBottom = '5px';
        header.style.userSelect = 'none';

        const settingsButton = energyUI.querySelector('#settings-button');
        settingsButton.style.padding = '0';
        settingsButton.style.backgroundColor = 'transparent';
        settingsButton.style.border = 'none';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.fontSize = '16px';
        settingsButton.style.color = 'var(--accent-color)';

        const buttonsContainer = energyUI.querySelector('#buttons-container');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.alignItems = 'center';

        const toggleButton = energyUI.querySelector('#toggle-button');
        toggleButton.style.padding = '8px 16px';
        toggleButton.style.backgroundColor = 'var(--accent-color)';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.width = '70%';
        toggleButton.style.height = '30px';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.fontVariant = 'small-caps';

        const closeButton = energyUI.querySelector('#close-button');
        closeButton.style.padding = '6px 8px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = 'var(--text-color)';
        closeButton.style.border = '1px solid var(--border-color)';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '12px';
        closeButton.style.textAlign = 'center';
        closeButton.style.marginLeft = '5px';
        closeButton.style.width = '30%';
        closeButton.style.font = 'bold 14px Arial, sans-serif';
        closeButton.style.height = '30px';

        const credits = energyUI.querySelector('#credits');
        credits.style.marginTop = '10px';
        credits.style.fontSize = '12px';
        credits.style.color = 'var(--text-color)';
        credits.style.textAlign = 'center';
        credits.style.width = '100%';
        credits.style.display = 'block';
        credits.style.userSelect = 'none';

        const link = credits.querySelector('a');
        link.style.color = 'var(--accent-color)';

        document.body.appendChild(energyUI);
        makeDraggable(energyUI);

        // Event listener for the settings button
        settingsButton.addEventListener('click', () => {
            const settingsWindow = document.getElementById('settings-window');
            settingsWindow.style.display =
                settingsWindow.style.display === 'none' ? 'block' : 'none';
        });

        // Initialize the settings window
        initSettingsWindow();

        // Load saved theme on script initialization
        const savedTheme = localStorage.getItem('hamsterDestroyerTheme') || 'default';
        applyTheme(themes[savedTheme]);

        // Update theme preview borders on load to reflect the saved theme
        const themePreviews = document.querySelectorAll('.theme-preview');
        themePreviews.forEach((preview) => {
            if (preview.dataset.theme === savedTheme) {
                preview.style.borderColor = themes[savedTheme].accentColor;
            }
        });

        let outOfEnergy = false;
        let loopActive = false;

        // Latencies for random delays between clicks
        const latencies = [127, 83, 146, 98, 131];

        function getRandomLatency() {
            return latencies[Math.floor(Math.random() * latencies.length)];
        }

        // Function to get random coordinates within a button
        function getRandomCoordinates(button) {
            const rect = button.getBoundingClientRect();
            const randomX = rect.left + Math.random() * rect.width;
            const randomY = rect.top + Math.random() * rect.height;
            return { x: randomX, y: randomY };
        }

        // Toggle button click event listener
        toggleButton.addEventListener('click', () => {
            loopActive = !loopActive;
            toggleButton.classList.toggle('off', !loopActive);
            toggleButton.textContent = loopActive ? 'STOP' : 'START';
            toggleButton.style.backgroundColor = loopActive ? '#dc3545' : 'var(--accent-color)';
            if (loopActive) {
                mainLoop();
            }
        });

        // Close button click event listener
        closeButton.addEventListener('click', () => {
            energyUI.remove();
        });

        // Main loop function for auto-clicking
        function mainLoop() {
            if (!loopActive) return;
            try {
                const targetButton = document.querySelector('.user-tap-button');
                const energy = document.querySelector('.user-tap-energy > p');
                if (energy && targetButton) {
                    const energyString = energy.innerText;
                    const currentEnergy = Number(energyString.split('/')[0]);
                    const maxEnergy = Number(energyString.split('/')[1]);

                    if (!outOfEnergy) {
                        const { x, y } = getRandomCoordinates(targetButton);
                        const pointerEvent = new PointerEvent('pointerup', {
                            bubbles: true,
                            clientX: x,
                            clientY: y,
                        });
                        targetButton.dispatchEvent(pointerEvent);
                    }
                    if (currentEnergy <= 10) {
                        outOfEnergy = true;
                    }
                    if (currentEnergy >= maxEnergy - 10) {
                        outOfEnergy = false;
                    }
                }
            } catch (e) {
                console.log(e);
            }
            setTimeout(mainLoop, getRandomLatency());
        }
    }

    // Function to wait for necessary game elements to load
    function waitForElements() {
        const targetButton = document.querySelector('.user-tap-button');
        const energy = document.querySelector('.user-tap-energy > p');
        if (targetButton && energy) {
            initScript();
        } else {
            setTimeout(waitForElements, 500);
        }
    }
    waitForElements();
})();