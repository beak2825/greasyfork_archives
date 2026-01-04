// ==UserScript==
// @name         RoyalRoad Leads to Chapter Filter
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  Customizable chapter filter with user input, link check, and setup.
// @author       Byakuran
// @match        https://www.royalroad.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/515830/RoyalRoad%20Leads%20to%20Chapter%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/515830/RoyalRoad%20Leads%20to%20Chapter%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object with defaults
    const DEFAULT_CONFIG = {
        showField: null,
        optionalTimeout: 5,
        keywords: ['chapter-1', 'chapter-one', 'prologue', 'amazon', 'www.audible.com', 'podiumentertainment', '/chapter/', '%2Fchapter%2F', '%2Fgeni.us%2F'],
        replacements: ['Leads to chapter 1', 'Leads to chapter 1', 'Leads to prologue', 'Leads to amazon.', 'Leads to Audible', 'Leads to Podium Entertainment', 'Leads to a chapter', 'Leads to a chapter', 'Amazon'],
        showAdButton: false,
        darkMode: false,
        maxHistorySessions: 5, // Default number of sessions to save
        saveHistory: true, // Whether to save history at all
        lastPosition: { x: 20, y: 20 }
    };

    // Helper functions for settings management
    const settings = {
        get: function(key) {
            return GM_getValue(key, DEFAULT_CONFIG[key]);
        },

        set: function(key, value) {
            GM_setValue(key, value);
        },

        reset: function() {
            Object.keys(DEFAULT_CONFIG).forEach(key => {
                this.set(key, DEFAULT_CONFIG[key]);
            });
            return DEFAULT_CONFIG;
        },

        getAll: function() {
            const config = {};
            Object.keys(DEFAULT_CONFIG).forEach(key => {
                config[key] = this.get(key);
            });
            return config;
        }
    };

    // Initialize config from settings
    let config = settings.getAll();

    // Register Tampermonkey menu commands
    GM_registerMenuCommand('Open Settings', showSetupWizard);
    GM_registerMenuCommand('Reset Settings', () => {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            config = settings.reset();
            alert('Settings have been reset. Refreshing page...');
            location.reload();
        }
    });

    // Add keyboard shortcut handler
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            showSetupWizard();
        }
    });

    // Modified showSetupWizard function
    function showSetupWizard() {
        const wizard = document.createElement('div');
        wizard.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        z-index: 10000;
        width: 400px;
        color: #000000;
        font-weight: 500;
    `;

        wizard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #000000;">RoyalRoad Filter Setup</h2>
            <button id="closeSetup" style="
                background: none;
                border: none;
                color: #000000;
                cursor: pointer;
                font-size: 20px;
                padding: 0 5px;
                line-height: 1;
            ">×</button>
        </div>
        <p style="color: #000000;">How would you like to display the filter input field?</p>
        <div style="display: flex; flex-direction: column; gap: 10px; color: #000000;">
            <label style="color: #000000;">
                <input type="radio" name="displayMode" value="always"> Always show
            </label>
            <label style="color: #000000;">
                <input type="radio" name="displayMode" value="optional"> Show toggle button
                <input type="number" id="timeout" value="${config.optionalTimeout}" min="1" style="width: 60px; margin-left: 10px;"> seconds
            </label>
            <label style="color: #000000;">
                <input type="radio" name="displayMode" value="never"> Never show
                <span style="font-size: 0.8em; margin-left: 10px;">(Use Ctrl+Shift+S to reopen)</span>
            </label>
            <label style="margin-top: 10px; color: #000000;">
                <input type="checkbox" id="showAdButton" ${config.showAdButton ? 'checked' : ''}> Enable "Show Ad" button
            </label>
            <label style="margin-top: 10px; color: #000000;">
                <input type="checkbox" id="darkMode" ${config.darkMode ? 'checked' : ''}> Enable dark mode
            </label>
        </div>
		<div style="margin-top: 15px; border-top: 1px solid #ccc; padding-top: 15px;">
			<h3 style="margin: 0 0 10px 0; color: #000000;">History Settings</h3>
			<label style="color: #000000;">
				<input type="checkbox" id="saveHistory" ${config.saveHistory ? 'checked' : ''}>
				Enable history saving
			</label>
			<div style="margin-top: 10px;">
				<label style="color: #000000;">
					Number of sessions to save:
					<input type="number" id="maxHistorySessions"
						   value="${config.maxHistorySessions}"
						   min="1" max="20" style="width: 60px; margin-left: 10px;">
				</label>
			</div>
		</div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button id="saveSetup" style="
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Save Settings</button>
            <button id="resetSetup" style="
                padding: 8px 16px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Reset to Default</button>
        </div>
        <p style="margin-top: 15px; font-size: 0.8em; color: #666;">
            Tip: Access settings anytime with Ctrl+Shift+S or through the Tampermonkey menu
        </p>
    `;

        document.body.appendChild(wizard);

        // Set the initial radio button state
        if (config.showField) {
            const radio = wizard.querySelector(`input[value="${config.showField}"]`);
            if (radio) radio.checked = true;
        }

        // Add event listeners
        document.getElementById('closeSetup').addEventListener('click', () => {
            wizard.remove();
        });

        document.getElementById('saveSetup').addEventListener('click', () => {
            const displayMode = document.querySelector('input[name="displayMode"]:checked').value;
            const timeout = document.getElementById('timeout').value;
            const darkMode = document.getElementById('darkMode').checked;
            const showAdButton = document.getElementById('showAdButton').checked; // New line

            // Update config and save settings
            config.showField = displayMode;
            config.optionalTimeout = parseInt(timeout);
            config.darkMode = darkMode;
            config.showAdButton = showAdButton; // New line

            Object.keys(config).forEach(key => {
                settings.set(key, config[key]);
            });

            wizard.remove();
            initializeUI();
        });

        document.getElementById('resetSetup').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                config = settings.reset();
                wizard.remove();
                alert('Settings have been reset. Refreshing page...');
                location.reload();
            }
        });
    }

    // Enhanced UI creation function with filter list
    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: ${config.lastPosition.y}px;
            right: ${config.lastPosition.x}px;
            background-color: ${config.darkMode ? '#333' : '#f0f0f0'};
            color: ${config.darkMode ? '#fff' : '#000'};
            padding: 10px;
            border: 1px solid ${config.darkMode ? '#555' : '#ccc'};
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
            min-width: 220px;
        `;

        // Make container draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        container.addEventListener('mousedown', e => {
            if (e.target === container) {
                isDragging = true;
                initialX = e.clientX - container.offsetLeft;
                initialY = e.clientY - container.offsetTop;
            }
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                container.style.right = `${window.innerWidth - currentX - container.offsetWidth}px`;
                container.style.bottom = `${window.innerHeight - currentY - container.offsetHeight}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                config.lastPosition = {
                    x: parseInt(container.style.right),
                    y: parseInt(container.style.bottom)
                };
                GM_setValue('lastPosition', config.lastPosition);
            }
        });

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;

        const title = document.createElement('span');
        title.textContent = 'Filter Settings';
        title.style.fontWeight = 'bold';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 5px;
        `;

        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        settingsButton.title = 'Settings';
        settingsButton.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 0 5px;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: ${config.darkMode ? '#fff' : '#000'};
            cursor: pointer;
            font-size: 16px;
            padding: 0 5px;
        `;

        // Create filter list container
        const filterList = document.createElement('div');
        filterList.style.cssText = `
            margin-bottom: 10px;
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid ${config.darkMode ? '#555' : '#ccc'};
            border-radius: 3px;
            padding: 5px;
            background-color: ${config.darkMode ? '#444' : '#fff'};
        `;

		const historyButtonContainer = document.createElement('div');
		historyButtonContainer.style.cssText = `
			display: flex;
			gap: 2px;
		`;

		const backButton = document.createElement('button');
		backButton.innerHTML = '↩️';
		backButton.title = 'Previous State';
		backButton.style.cssText = `
			background: none;
			border: none;
			cursor: pointer;
			font-size: 16px;
			padding: 0 5px;
		`;

		const forwardButton = document.createElement('button');
		forwardButton.innerHTML = '↪️';
		forwardButton.title = 'Next State';
		forwardButton.style.cssText = backButton.style.cssText;
		forwardButton.style.display = 'none'; // Initially hidden

		backButton.addEventListener('click', () => {
			const previousState = historyManager.loadPreviousState();
			if (previousState) {
				const elements = document.querySelectorAll('.img-creat');
				elements.forEach((el, index) => {
					if (previousState.elements[index]) {
						el.innerHTML = previousState.elements[index].html;
						el.setAttribute('data-original-content',
									  previousState.elements[index].originalHtml);
					}
				});
				// Show forward button when we have a state to go forward to
				forwardButton.style.display = 'block';
			}

			// Hide back button if we're at index 0
			if (historyManager.currentHistoryIndex === 0) {
				backButton.style.display = 'none';
			}
		});

		forwardButton.addEventListener('click', () => {
			const nextState = historyManager.loadNextState();
			if (nextState) {
				const elements = document.querySelectorAll('.img-creat');
				elements.forEach((el, index) => {
					if (nextState.elements[index]) {
						el.innerHTML = nextState.elements[index].html;
						el.setAttribute('data-original-content',
									  nextState.elements[index].originalHtml);
					}
				});
                backButton.style.display = 'block';
			}
            else {
				alert('No next state available');
				forwardButton.style.display = 'none';
			}
		});

        // Function to update filter list
        function updateFilterList() {
            filterList.innerHTML = '';
            config.keywords.forEach((keyword, index) => {
                const filterItem = document.createElement('div');
                filterItem.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 3px;
                    border-bottom: 1px solid ${config.darkMode ? '#555' : '#eee'};
                `;

                const filterText = document.createElement('span');
                filterText.style.cssText = `
                    color: ${config.darkMode ? '#fff' : '#000'};
                    font-size: 0.9em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;
                filterText.textContent = `${keyword} → ${config.replacements[index]}`;

                const removeButton = document.createElement('button');
                removeButton.textContent = '×';
                removeButton.style.cssText = `
                    background: none;
                    border: none;
                    color: ${config.darkMode ? '#fff' : '#000'};
                    cursor: pointer;
                    padding: 0 5px;
                    font-size: 14px;
                `;

                removeButton.addEventListener('click', () => {
                    config.keywords.splice(index, 1);
                    config.replacements.splice(index, 1);
                    saveSettings();
                    updateFilterList();
                    filterChapterAds();
                });

                filterItem.appendChild(filterText);
                filterItem.appendChild(removeButton);
                filterList.appendChild(filterItem);
            });

            if (config.keywords.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.cssText = `
                    padding: 5px;
                    color: ${config.darkMode ? '#aaa' : '#666'};
                    text-align: center;
                    font-style: italic;
                `;
                emptyMessage.textContent = 'No filters added yet';
                filterList.appendChild(emptyMessage);
            }
        }

        const inputs = document.createElement('div');
        inputs.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = 'Keyword (e.g., chapter-2)';
        keywordInput.style.cssText = `
            width: 200px;
            padding: 5px;
            border: 1px solid ${config.darkMode ? '#555' : '#ccc'};
            background-color: ${config.darkMode ? '#444' : '#fff'};
            color: ${config.darkMode ? '#fff' : '#000'};
            border-radius: 3px;
        `;

        const replacementInput = document.createElement('input');
        replacementInput.type = 'text';
        replacementInput.placeholder = 'Replacement Text';
        replacementInput.style.cssText = keywordInput.style.cssText;

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 5px;
        `;

        settingsButton.addEventListener('click', () => {
            showSetupWizard();
        });

        addButton.addEventListener('click', () => {
            const keyword = keywordInput.value.trim();
            const replacement = replacementInput.value.trim();
            if (keyword && replacement) {
                addKeywordReplacement(keyword, replacement);
                keywordInput.value = '';
                replacementInput.value = '';
                updateFilterList();
            }
        });

        closeButton.addEventListener('click', () => {
            container.remove();
            if (config.showField === 'optional') {
                createToggleButton();
            }
        });

        historyButtonContainer.appendChild(backButton);
        historyButtonContainer.appendChild(forwardButton);
        buttonContainer.appendChild(historyButtonContainer);
        buttonContainer.appendChild(settingsButton);
        buttonContainer.appendChild(closeButton);
        header.appendChild(title);
        header.appendChild(buttonContainer);
        inputs.appendChild(keywordInput);
        inputs.appendChild(replacementInput);
        inputs.appendChild(addButton);

        container.appendChild(header);
        container.appendChild(filterList);
        container.appendChild(inputs);
        document.body.appendChild(container);

        // Initialize the filter list
        updateFilterList();
    }

    // Rest of the functions remain the same...
    function createToggleButton() {
        const button = document.createElement('div');
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${config.darkMode ? '#333' : '#f0f0f0'};
            color: ${config.darkMode ? '#fff' : '#000'};
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        `;
        button.textContent = 'Show Filter';
        button.addEventListener('click', () => {
            createUI();
            button.remove();
        });

        document.body.appendChild(button);

        if (config.showField === 'optional') {
            setTimeout(() => {
                if (button.parentNode) {
                    button.remove();
                }
            }, config.optionalTimeout * 1000);
        }
    }

    function addKeywordReplacement(keyword, replacement) {
        config.keywords.push(keyword);
        config.replacements.push(replacement);
        saveSettings();
        filterChapterAds();
    }

    function filterChapterAds() {
        const elements = document.querySelectorAll('.img-creat');
        elements.forEach(element => {

            if (!element.hasAttribute('data-original-content')) {
            element.setAttribute('data-original-content', element.innerHTML);
            }

            const aTag = element.querySelector('a');
            if (aTag) {
                const href = aTag.getAttribute('href');
                if (href) {
                    const index = config.keywords.findIndex(keyword => href.includes(keyword));
                    if (index !== -1) {
                        // Store the original content
                        const originalContent = element.innerHTML;

                        // Clear and set new content
                        element.innerHTML = '';
                        const container = document.createElement('div');
                        container.style.display = 'flex';
                        container.style.flexDirection = 'column';
                        container.style.alignItems = 'center';
                        container.style.gap = '5px';

                        const textSpan = document.createElement('span');
                        textSpan.textContent = config.replacements[index];
                        container.appendChild(textSpan);

                        if (config.showAdButton) {
                            const showButton = document.createElement('button');
                            showButton.textContent = 'Show Ad';
                            showButton.style.cssText = `
                            padding: 2px 6px;
                            font-size: 12px;
                            background-color: ${config.darkMode ? '#444' : '#eee'};
                            border: 1px solid ${config.darkMode ? '#666' : '#ccc'};
                            border-radius: 3px;
                            cursor: pointer;
                            color: ${config.darkMode ? '#fff' : '#000'};
                            margin-top: 3px;
                        `;

                            showButton.addEventListener('click', (e) => {
                                e.preventDefault();
                                element.innerHTML = originalContent;
                            });

                            container.appendChild(showButton);
                        }

                        element.appendChild(container);
                    }
                }
            }
        });

        historyManager.saveState(Array.from(elements));
    }

    function saveSettings() {
        GM_setValue('keywords', config.keywords);
        GM_setValue('replacements', config.replacements);
    }

    function initializeUI() {
        if (config.showField === 'always') {
            createUI();
        } else if (config.showField === 'optional') {
            createToggleButton();
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.querySelectorAll) {
                        const newElements = node.querySelectorAll('.img-creat');
                        if (newElements.length > 0) {
                            filterChapterAds();
                        }
                    }
                });
            }
        });
    });

	const historyManager = {
		currentSession: null,
		currentHistoryIndex: -1,

		init: function() {
			this.currentSession = Date.now();
			const savedSessions = GM_getValue('historySessions', {});

			// Clean up old sessions if exceeding max limit
			const sessions = Object.keys(savedSessions).sort();
			while (sessions.length > config.maxHistorySessions) {
				delete savedSessions[sessions[0]];
				sessions.shift();
			}

			// Set initial index to the last session
			this.currentHistoryIndex = sessions.length > 0 ? sessions.length - 1 : 0;
			GM_setValue('historySessions', savedSessions);
		},

		saveState: function(elements) {
			if (!config.saveHistory) return;

			const savedSessions = GM_getValue('historySessions', {});
			savedSessions[this.currentSession] = {
				timestamp: new Date().toISOString(),
				elements: elements.map(el => ({
					html: el.innerHTML,
					originalHtml: el.getAttribute('data-original-content')
				}))
			};

			GM_setValue('historySessions', savedSessions);
			this.currentHistoryIndex = Object.keys(savedSessions).sort().length - 1;
		},

		loadPreviousState: function() {
			const savedSessions = GM_getValue('historySessions', {});
			const sessions = Object.keys(savedSessions).sort();

			// Adjust index to skip current state on first click
			if (this.currentHistoryIndex === sessions.length - 1) {
				this.currentHistoryIndex--;
			}

			if (this.currentHistoryIndex > 0) {
				this.currentHistoryIndex--;
				return savedSessions[sessions[this.currentHistoryIndex]];
			}

			// Hide back button when reaching index 0
			if (this.currentHistoryIndex === 0) {
				const backButton = document.querySelector('[title="Previous State"]');
				if (backButton) backButton.style.display = 'none';
			}

			return null;
		},

		loadNextState: function() {
			const savedSessions = GM_getValue('historySessions', {});
            const sessions = Object.keys(savedSessions).sort();
            const length = sessions.length - 1;

			if (this.currentHistoryIndex < length) {
				this.currentHistoryIndex++;
                if (this.currentHistoryIndex >= length-1) {
					const forwardButton = document.querySelector('[title="Next State"]');
					if (forwardButton) forwardButton.style.display = 'none';
				}
				return savedSessions[sessions[this.currentHistoryIndex]];
			}
			return null;
		}
	};

    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

    if (config.showField === null) {
        showSetupWizard();
    } else {
        initializeUI();
    }
    filterChapterAds();
    if (config.saveHistory === true){
        historyManager.init();
    }

})();