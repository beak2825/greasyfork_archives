// ==UserScript==
// @name         Torn Gaming Terminology Tooltips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds tooltips for gaming terminology in Torn faction chat
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529894/Torn%20Gaming%20Terminology%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/529894/Torn%20Gaming%20Terminology%20Tooltips.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dictionary of gaming terms and their explanations
    // Each term can have multiple variations that map to the same explanation
    const gamingTerms = {
        // Format: { variations: [array of variations], explanation: "explanation text" }
        "turtle": {
            variations: ["turtle", "turtling", "turtled"],
            explanation: "You wait until you can get a wave of good hits in, usually using teamwork tactics"
        },
        "bleed": {
            variations: ["bleed", "bleeding", "bleeds"],
            explanation: "Losing respect to the enemy faction with/without purpose"
        },
        "buff": {
            variations: ["buff", "buffed", "buffing"],
            explanation: "A temporary enhancement or beneficial effect on a character or unit."
        },
        "nerf": {
            variations: ["nerf", "nerfed", "nerfing"],
            explanation: "When developers reduce the effectiveness of an item, character, or strategy that was deemed too powerful."
        },
        "aggro": {
            variations: ["aggro", "aggros", "aggroed"],
            explanation: "The attention of enemies or monsters, often used in the context of who they are attacking."
        },
        "tank": {
            variations: ["tank", "tanking", "tanked"],
            explanation: "A player who specializes in absorbing damage and protecting teammates."
        },
        "kite": {
            variations: ["kite", "kiting", "kited"],
            explanation: "A tactic where a player keeps their distance from enemies while attacking them."
        },
        "meta": {
            variations: ["meta"],
            explanation: "Most Effective Tactics Available - refers to the most optimal strategies in the current game state."
        }
    };

    // Function to create a flat mapping of all variations to their explanations
    function createTermsMap() {
        const termsMap = {};
        Object.values(gamingTerms).forEach(term => {
            term.variations.forEach(variation => {
                termsMap[variation.toLowerCase()] = term.explanation;
            });
        });
        return termsMap;
    }

    // Create the flat map for easier lookup
    let termsMap = createTermsMap();

    // Function to check for gaming terms in messages and add tooltips
    function addTooltipsToMessages() {
        // Target the chat messages in Torn's faction chat based on the provided HTML structure
        const chatMessages = document.querySelectorAll('.chat-box-message__box___i2Jal .chat-box-message__message___SldE8 .text-message___gcG6e');

        chatMessages.forEach(message => {
            // Skip messages that have already been processed
            if (message.dataset.tooltipsAdded) return;

            // Mark as processed
            message.dataset.tooltipsAdded = 'true';

            // Get the text content of the message
            let messageText = message.innerHTML;

            // Check for each term variation
            Object.keys(termsMap).forEach(variation => {
                // Case-insensitive search for the variation
                const regex = new RegExp(`\\b${variation}\\b`, 'gi');

                // Replace the variation with a span that has a tooltip
                messageText = messageText.replace(regex, match => {
                    return `<span class="gaming-term-tooltip" title="${termsMap[variation.toLowerCase()]}">${match}</span>`;
                });
            });

            message.innerHTML = messageText;
        });
    }

    // Style for the tooltip terms
    const style = document.createElement('style');
    style.textContent = `
        .gaming-term-tooltip {
            text-decoration: underline dotted;
            cursor: help;
            color: #4a90e2;
        }
    `;
    document.head.appendChild(style);

    // Run the function periodically to check for new messages
    setInterval(addTooltipsToMessages, 1000);

    // Create a MutationObserver to detect new chat messages
    const chatObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                addTooltipsToMessages();
            }
        });
    });

    // Start observing the chat container for new messages
    function startObserving() {
        const chatContainer = document.querySelector('.chat-box-content__scrollable___vIdgs');
        if (chatContainer) {
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
            console.log('Torn Gaming Terminology Tooltips: Observer started');
        } else {
            setTimeout(startObserving, 1000);
        }
    }

    startObserving();

    // Add a configuration panel to easily add new terms
    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.id = 'tooltip-config-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #000;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 350px;
            display: none;
        `;

        panel.innerHTML = `
            <h3 style="margin-top: 0; cursor: move;">Gaming Term Tooltips</h3>
            <div style="margin-bottom: 10px;">
                <input type="text" id="new-term-group" placeholder="Term group name" style="width: 120px; margin-right: 5px;">
                <input type="text" id="new-variations" placeholder="Variations (comma-separated)" style="width: 200px;">
            </div>
            <div style="margin-bottom: 10px;">
                <textarea id="new-explanation" placeholder="Explanation" style="width: 100%; height: 50px;"></textarea>
            </div>
            <button id="add-term" style="margin-right: 5px;">Add Term</button>
            <button id="hide-panel">Close</button>
            <div id="terms-list" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('add-term').addEventListener('click', () => {
            const termGroup = document.getElementById('new-term-group').value.trim();
            const variationsText = document.getElementById('new-variations').value.trim();
            const explanation = document.getElementById('new-explanation').value.trim();

            if (termGroup && variationsText && explanation) {
                const variations = variationsText.split(',').map(v => v.trim()).filter(v => v);

                gamingTerms[termGroup] = {
                    variations: variations,
                    explanation: explanation
                };

                // Update the terms map
                termsMap = createTermsMap();

                updateTermsList();
                document.getElementById('new-term-group').value = '';
                document.getElementById('new-variations').value = '';
                document.getElementById('new-explanation').value = '';

                // Save to localStorage
                localStorage.setItem('tornGamingTerms', JSON.stringify(gamingTerms));
            }
        });

        document.getElementById('hide-panel').addEventListener('click', () => {
            panel.style.display = 'none';
            toggleButton.style.display = 'block';
        });

        // Function to update the terms list
        function updateTermsList() {
            const termsList = document.getElementById('terms-list');
            termsList.innerHTML = '';

            Object.keys(gamingTerms).sort().forEach(termGroup => {
                const termDiv = document.createElement('div');
                termDiv.style.cssText = 'margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;';

                const variations = gamingTerms[termGroup].variations.join(', ');
                const explanation = gamingTerms[termGroup].explanation;

                termDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <strong>${termGroup}</strong>
                        <button class="remove-term" data-term="${termGroup}" style="font-size: 10px;">Remove</button>
                    </div>
                    <div style="margin-top: 3px; font-style: italic; font-size: 12px;">Variations: ${variations}</div>
                    <div style="margin-top: 3px; font-size: 12px;">${explanation.substring(0, 50)}${explanation.length > 50 ? '...' : ''}</div>
                `;

                termsList.appendChild(termDiv);
            });

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-term').forEach(button => {
                button.addEventListener('click', function() {
                    const term = this.getAttribute('data-term');
                    delete gamingTerms[term];

                    // Update the terms map
                    termsMap = createTermsMap();

                    updateTermsList();

                    // Save to localStorage
                    localStorage.setItem('tornGamingTerms', JSON.stringify(gamingTerms));
                });
            });
        }

        // Load terms from localStorage
        const savedTerms = localStorage.getItem('tornGamingTerms');
        if (savedTerms) {
            try {
                const parsedTerms = JSON.parse(savedTerms);
                Object.keys(parsedTerms).forEach(term => {
                    gamingTerms[term] = parsedTerms[term];
                });
                // Update the terms map
                termsMap = createTermsMap();
            } catch (e) {
                console.error('Error loading saved terms:', e);
                // If there's an error with the saved format, clear it
                localStorage.removeItem('tornGamingTerms');
            }
        }

        updateTermsList();

        // Create a button to toggle the config panel
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Term Tooltips';
        toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9998;
            padding: 5px 10px;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        toggleButton.addEventListener('click', () => {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                toggleButton.style.display = 'none';
            }
        });
        document.body.appendChild(toggleButton);

        // Make the config panel draggable
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        panel.querySelector('h3').addEventListener('mousedown', (e) => {
            isDragging = true;
            offset = {
                x: panel.offsetLeft - e.clientX,
                y: panel.offsetTop - e.clientY
            };
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX + offset.x) + 'px';
                panel.style.top = (e.clientY + offset.y) + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Create the configuration panel
    setTimeout(createConfigPanel, 2000);
})();