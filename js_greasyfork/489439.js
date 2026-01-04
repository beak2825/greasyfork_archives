// ==UserScript==
// @name        Codenames AI Assistant
// @namespace   Freebee1693
// @match       https://codenames.game/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.2.2-GitHub
// @author      Freebee1693
// @license     Apache License 2.0
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://codenames.game&size=256
// @description A script that uses AI to assist with both guessing words and generating hints for Codenames
// @downloadURL https://update.greasyfork.org/scripts/489439/Codenames%20AI%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/489439/Codenames%20AI%20Assistant.meta.js
// ==/UserScript==

// API URL
const API_URL = "https://cng.flawcra.cc";

// Store reference to popup window
let aiPopup = null;

// Store the last known hint to detect changes
let lastHint = {
    text: '',
    count: 0
};

// Track the last game state for detecting changes
let lastGameState = {
    role: '',
    team: '',
    hasHint: false,
    turnPhase: ''
};

// HTML Content for the popup window
const popupHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Codenames AI Assistant</title>
    <style>
        :root {
            --bg-dark: #1e1e2e;
            --bg-darker: #181825;
            --bg-section: #313244;
            --text: #cdd6f4;
            --accent: #cba6f7;
            --highlight: #94e2d5;
            --btn-color: #74c7ec;
            --team-color: #a6e3a1;
            --opponent-color: #f38ba8;
            --assassin-color: #fab387;
            --warning: #f38ba8;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text);
            margin: 0;
            padding: 16px;
            overflow-y: auto;
            max-height: 100vh;
            box-sizing: border-box;
        }

        #app {
            max-width: 800px;
            margin: 0 auto;
        }

        #title {
            font-size: 18px;
            font-weight: bold;
            color: var(--accent);
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--bg-section);
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--highlight);
            font-size: 16px;
        }

        .section-content {
            background-color: var(--bg-section);
            border-radius: 6px;
            padding: 12px;
            font-size: 14px;
            word-break: break-word;
        }

        .highlight {
            color: var(--accent);
            font-weight: bold;
        }

        .word-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }

        .word-tag {
            background-color: #45475a;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
        }

        .word-tag.team {
            background-color: var(--team-color);
            color: var(--bg-dark);
        }

        .word-tag.opponent {
            background-color: var(--opponent-color);
            color: var(--bg-dark);
        }

        .word-tag.assassin {
            background-color: var(--assassin-color);
            color: var(--bg-dark);
        }

        .guess-tag {
            background-color: var(--btn-color);
            color: var(--bg-dark);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
            margin-right: 6px;
            margin-bottom: 6px;
            display: inline-block;
        }

        .warning {
            color: var(--warning);
        }

        button {
            padding: 10px 16px;
            border-radius: 4px;
            border: none;
            background-color: var(--btn-color);
            color: var(--bg-dark);
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 14px;
            width: 100%;
        }

        button:hover {
            background-color: #89dceb;
        }

        #loading {
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            color: var(--team-color);
        }

        #loading::after {
            content: '';
            width: 20px;
            height: 20px;
            margin-left: 10px;
            border: 2px solid var(--team-color);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spinner 1s linear infinite;
        }

        @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .explanation {
            border-left: 3px solid var(--highlight);
            padding-left: 10px;
            margin-top: 10px;
        }

        .target-list {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div id="app">
        <div id="title">Codenames AI Assistant</div>
        <div id="content">
            <!-- Dynamic content will be loaded here -->
            <div class="section">
                <div class="section-title">Status</div>
                <div class="section-content">
                    Waiting for game data...
                </div>
            </div>
        </div>
        <div id="loading">Generating suggestions</div>
    </div>

    <script>
        // This script will be replaced with actual implementation in the popup
    </script>
</body>
</html>
`;

// Function to create and open the popup window
const openAiPopup = () => {
    // Close existing popup if any
    if (aiPopup && !aiPopup.closed) {
        aiPopup.focus();
        return aiPopup;
    }

    // Create new popup
    aiPopup = window.open('', 'CodeNamesAI', 'width=500,height=700,resizable=yes,scrollbars=yes');

    if (aiPopup) {
        // Write HTML content to the popup
        aiPopup.document.write(popupHTML);
        aiPopup.document.close();

        // Add event listener for popup close
        aiPopup.addEventListener('beforeunload', () => {
            aiPopup = null;
        });

        // Initialize popup data
        updatePopupContent();
    } else {
        alert('Popup blocked! Please allow popups for this site.');
    }

    return aiPopup;
};

// Function to determine if user is a spymaster
const isSpymaster = () => {
    // Check for the presence of the clue input field which is only visible to spymasters
    return document.querySelector('input[name="clue"]') !== null;
};

// Function to get all words on the board
const getAllWords = () => {
    const words = [];
    document.querySelectorAll(".cardImage").forEach((it) => {
        words.push(it.parentElement.innerText.trim());
    });
    return words;
};

// Function to determine the current team color
const getCurrentTeamColor = () => {
    const viewElement = document.getElementById("view");
    if (!viewElement || !viewElement.firstElementChild) return "red"; // Default to red if can't determine

    const backgroundStyle = window.getComputedStyle(viewElement.firstElementChild).background;

    // Check for red-ish colors in the gradient
    if (backgroundStyle.includes("radial-gradient")) {
        // Red team has colors like rgb(231, 102, 60) or rgb(72, 12, 2)
        if (backgroundStyle.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/)) {
            const matches = [...backgroundStyle.matchAll(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/g)];

            // Check the first color in the gradient (usually the more vivid one)
            if (matches.length > 0) {
                const [_, r, g, b] = matches[0];
                // If red value is significantly higher than blue, it's likely red team
                if (parseInt(r) > parseInt(b) + 50) {
                    return "red";
                } else {
                    return "blue";
                }
            }
        }
    }

    // Fallback detection if the gradient approach fails
    return document.querySelector(".team-name.current")?.classList.contains("red") ? "red" : "blue";
};

// Function to get team words, opponent words, and assassin word for spymaster
const getSpymasterWords = () => {
    const teamColor = getCurrentTeamColor();
    const opponentColor = teamColor === "red" ? "blue" : "red";
    const teamWords = [];
    const avoidWords = [];
    let assassinWord = null;

    document.querySelectorAll(".cardImage").forEach((it) => {
        const word = it.parentElement.innerText.trim();

        // Check for red/blue classes directly
        if ((teamColor === "red" && it.classList.contains("red")) ||
            (teamColor === "blue" && it.classList.contains("blue"))) {
            teamWords.push(word);
        } else if ((opponentColor === "red" && it.classList.contains("red")) ||
                  (opponentColor === "blue" && it.classList.contains("blue"))) {
            avoidWords.push(word);
        } else if (it.classList.contains("black")) {
            assassinWord = word;
        }
    });

    return {
        teamWords,
        avoidWords,
        assassinWord
    };
};

// Get the current hint if available
const getCurrentHint = () => {
    const hintElement = document.querySelector("#layoutRoot > .bottom .button")?.parentElement?.parentElement?.querySelector("article")?.children;

    if (hintElement && hintElement.length >= 2) {
        return {
            text: hintElement[0].innerText.trim(),
            count: parseInt(hintElement[1].innerText.trim())
        };
    }

    return { text: '', count: 0 };
};

// Check if the hint has changed
const hasHintChanged = () => {
    const currentHint = getCurrentHint();

    // Check if the hint has changed
    if (currentHint.text !== lastHint.text || currentHint.count !== lastHint.count) {
        lastHint = currentHint;
        return true;
    }

    return false;
};

// Get current game phase
const getGamePhase = () => {
    // This is a simple proxy for the game phase - it checks if it's your turn to give a hint or guess
    const isYourTurn = document.querySelector(".team-name.current") &&
                      document.querySelector(".team-name.current").classList.contains(getCurrentTeamColor());

    if (!isYourTurn) {
        return "opponent-turn";
    }

    if (isSpymaster()) {
        return "give-hint";
    } else {
        // Check if there's a hint displayed
        const hint = getCurrentHint();
        return hint.text ? "make-guess" : "waiting-for-hint";
    }
};

// Check if game state has meaningfully changed
const hasGameStateChanged = () => {
    const currentRole = isSpymaster() ? 'spymaster' : 'guesser';
    const currentTeam = getCurrentTeamColor();
    const currentHint = getCurrentHint();
    const currentPhase = getGamePhase();

    // Check if any important state has changed
    if (currentRole !== lastGameState.role ||
        currentTeam !== lastGameState.team ||
        (currentHint.text !== '' && !lastGameState.hasHint) ||
        currentPhase !== lastGameState.turnPhase) {

        // Update last state
        lastGameState = {
            role: currentRole,
            team: currentTeam,
            hasHint: currentHint.text !== '',
            turnPhase: currentPhase
        };

        return true;
    }

    return false;
};

// Generate a cache breaker string based on the game state
const getCacheBreaker = () => {
  let cacheBreaker = "";
  for(const color of ['red', 'blue']) {
    cacheBreaker += document.querySelector(`#teamBoard-${color} article`).innerText.trim();
  }
  return cacheBreaker;
};

// Update content in the popup window
const updatePopupContent = () => {
    if (!aiPopup || aiPopup.closed) return;

    let contentHTML = '';

    // Role Section
    const teamColor = getCurrentTeamColor();
    const role = isSpymaster() ? 'Spymaster' : 'Guesser';

    contentHTML += `
        <div class="section">
            <div class="section-title">Current Role</div>
            <div class="section-content">
                You are the <span class="highlight">${role}</span> for the <span class="highlight">${teamColor}</span> team.
            </div>
        </div>
    `;

    // Role-specific content
    if (isSpymaster()) {
        // Spymaster View
        const { teamWords, avoidWords, assassinWord } = getSpymasterWords();

        // Words Section
        contentHTML += `
            <div class="section">
                <div class="section-title">Your Board</div>
                <div class="section-content">
                    <div>Your Team (${teamWords.length}):</div>
                    <div class="word-group">
                        ${teamWords.map(word => `<span class="word-tag team">${word}</span>`).join('')}
                    </div>

                    <div style="margin-top: 12px;">Opponent (${avoidWords.length}):</div>
                    <div class="word-group">
                        ${avoidWords.map(word => `<span class="word-tag opponent">${word}</span>`).join('')}
                    </div>

                    <div style="margin-top: 12px;">Assassin:</div>
                    <div class="word-group">
                        ${assassinWord ? `<span class="word-tag assassin">${assassinWord}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Results Section (initially empty)
        contentHTML += `
            <div class="section">
                <div class="section-title">AI Suggestion</div>
                <div class="section-content" id="results-container">
                    No hint generated yet. Click the button below to get an AI hint.
                </div>
            </div>
        `;

        // Button
        contentHTML += `
            <button id="generate-btn" onclick="window.generateHint()">Generate Hint</button>
        `;
    } else {
        // Guesser View

        // Current Hint
        const currentHint = getCurrentHint();
        const hint = currentHint.text;
        const targets = currentHint.count;

        contentHTML += `
            <div class="section">
                <div class="section-title">Current Hint</div>
                <div class="section-content">
                    ${hint ? `<span class="highlight">"${hint}"</span> for <span class="highlight">${targets}</span> word(s)` : 'No active hint found.'}
                </div>
            </div>
        `;

        // Available Words
        let availableWords = [];
        document.querySelectorAll(".cardImage").forEach((it) => {
            if (it.classList.contains("gray")) {
                availableWords.push(it.parentElement.innerText.trim());
            }
        });

        contentHTML += `
            <div class="section">
                <div class="section-title">Available Words</div>
                <div class="section-content">
                    ${availableWords.length > 0 ?
                        `<div class="word-group">
                            ${availableWords.map(word => `<span class="word-tag">${word}</span>`).join('')}
                        </div>` :
                        'No available words to guess.'}
                </div>
            </div>
        `;

        // Results Section (initially empty)
        contentHTML += `
            <div class="section">
                <div class="section-title">AI Suggestions</div>
                <div class="section-content" id="results-container">
                    ${hint ? 'No guesses generated yet. Click the button below to get AI suggestions.' :
                           'Waiting for a hint from your Spymaster.'}
                </div>
            </div>
        `;

        // Button (only if there's a hint)
        if (hint) {
            contentHTML += `
                <button id="generate-btn" onclick="window.generateGuess()">Generate Guesses</button>
            `;
        }
    }

    // Update content in popup
    const contentElement = aiPopup.document.getElementById('content');
    if (contentElement) {
        contentElement.innerHTML = contentHTML;
    }

    // Define functions in popup context
    aiPopup.generateHint = () => {
        generate_hint();
    };

    aiPopup.generateGuess = () => {
        guess_answer();
    };

    // Update title with current role
    aiPopup.document.title = `Codenames AI - ${role} (${teamColor})`;
};

// Function to handle AI guessing
const guess_answer = async () => {
    if (!aiPopup || aiPopup.closed) {
        openAiPopup();
        setTimeout(guess_answer, 500); // Try again after popup opens
        return;
    }

    let list = [];
    // Query all elements with the class 'cardImage'
    document.querySelectorAll(".cardImage").forEach((it) => {
        // Check if the element contains the class 'gray'
        if (!it.classList.contains("gray")) return;
        // Push the parent element's innerText to the list
        list.push(it.parentElement.innerText.trim());
    });

    // Access elements for hint and targets
    const currentHint = getCurrentHint();
    if (!currentHint.text) return;

    let hint = currentHint.text;
    let targets = currentHint.count;
    let lang = window.localStorage.lang;

    // Show loading state
    const loadingElement = aiPopup.document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }

    // Disable button
    const generateBtn = aiPopup.document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
    }

    // Update title
    aiPopup.document.title = 'Codenames AI Assistant (Loading...)';

    const cacheBreaker = getCacheBreaker();

    // Create the JSON object
    let jObj = { words: list, hint, targets, lang, cacheBreaker };

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jObj)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let result = await response.json();

            // Reset title
            aiPopup.document.title = `Codenames AI - Guesser (${getCurrentTeamColor()})`;

            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // Reset button
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate Guesses';
            }

            if(result.hasOwnProperty("error")) {
                console.log(result.error);

                const resultsContainer = aiPopup.document.getElementById('results-container');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `<div class="warning">Error: ${result.error}</div>`;
                }
                return;
            }

            // Show results in the popup
            const resultsContainer = aiPopup.document.getElementById('results-container');
            if (resultsContainer && result.answers && result.answers.length > 0) {
                let resultsHTML = `<div>Suggested guesses:</div>
                                   <div style="margin-top: 8px;">`;

                // Add the guesses
                result.answers.forEach(answer => {
                    resultsHTML += `<span class="guess-tag">${answer}</span>`;
                });

                resultsHTML += `</div>`;

                // Add explanations if available
                if (result.explanations && result.explanations.length > 0) {
                    resultsHTML += `<div style="margin-top: 16px; font-weight: bold;">Explanations:</div>
                                    <ul style="margin-top: 8px; padding-left: 20px;">`;

                    result.answers.forEach((answer, index) => {
                        if (index < result.explanations.length) {
                            resultsHTML += `<li><b>${answer}:</b> ${result.explanations[index]}</li>`;
                        }
                    });

                    resultsHTML += `</ul>`;
                }

                resultsContainer.innerHTML = resultsHTML;
            } else if (resultsContainer) {
                resultsContainer.textContent = 'No suggestions found. Try a different hint.';
            }
        }
    } catch (error) {
        console.error('Error during fetch operation:', error);

        // Reset title
        aiPopup.document.title = `Codenames AI - Guesser (${getCurrentTeamColor()})`;

        // Hide loading
        const loadingElement = aiPopup.document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Reset button
        const generateBtn = aiPopup.document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Guesses';
        }

        // Show error
        const resultsContainer = aiPopup.document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="warning">Error: ${error.message}</div>`;
        }
    }
};

// Function to handle AI hint generation
const generate_hint = async () => {
    if (!aiPopup || aiPopup.closed) {
        openAiPopup();
        setTimeout(generate_hint, 500); // Try again after popup opens
        return;
    }

    // Get all words on the board
    const allWords = getAllWords();

    // Get team words, avoid words, and assassin word
    const { teamWords, avoidWords, assassinWord } = getSpymasterWords();

    // Debug logging for troubleshooting
    console.log("All Words:", allWords);
    console.log("Team Words:", teamWords);
    console.log("Avoid Words:", avoidWords);
    console.log("Assassin Word:", assassinWord);

    const lang = window.localStorage.lang;

    // Show loading state
    const loadingElement = aiPopup.document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }

    // Disable button
    const generateBtn = aiPopup.document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
    }

    // Update title
    aiPopup.document.title = 'Codenames AI Assistant (Loading...)';

    const cacheBreaker = getCacheBreaker();

    // Create the JSON object for spymaster request
    const jObj = {
        mode: "spymaster",
        allWords,
        teamWords,
        avoidWords,
        assassinWord,
        lang,
        cacheBreaker
    };

    try {
        console.log("Sending spymaster request:", jObj);
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jObj)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let result = await response.json();

            // Reset title
            aiPopup.document.title = `Codenames AI - Spymaster (${getCurrentTeamColor()})`;

            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // Reset button
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate Hint';
            }

            if(result.hasOwnProperty("error")) {
                console.log("API error:", result.error);

                const resultsContainer = aiPopup.document.getElementById('results-container');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `<div class="warning">Error: ${result.error}</div>`;
                }
                return;
            }

            console.log("API response:", result);

            // Show results in the popup
            const resultsContainer = aiPopup.document.getElementById('results-container');
            if (resultsContainer) {
                let resultsHTML = `<div>
                                      <span class="highlight">Suggested Hint:</span>
                                      <span style="font-size: 18px; font-weight: bold;">"${result.hint}"</span>
                                      <span>(${result.targetWords.length})</span>
                                  </div>`;

                // Add target words
                resultsHTML += `<div class="target-list">
                                    <span class="highlight">Target Words:</span>
                                    <div class="word-group">`;

                result.targetWords.forEach(word => {
                    resultsHTML += `<span class="word-tag team">${word}</span>`;
                });

                resultsHTML += `</div></div>`;

                // Add explanation
                resultsHTML += `<div class="explanation">
                                    <span class="highlight">Explanation:</span>
                                    <div style="margin-top: 5px;">${result.explanation}</div>
                                </div>`;

                resultsContainer.innerHTML = resultsHTML;
            }
        }
    } catch (error) {
        console.error('Error during fetch operation:', error);

        // Reset title
        aiPopup.document.title = `Codenames AI - Spymaster (${getCurrentTeamColor()})`;

        // Hide loading
        const loadingElement = aiPopup.document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Reset button
        const generateBtn = aiPopup.document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Hint';
        }

        // Show error
        const resultsContainer = aiPopup.document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="warning">Error: ${error.message}</div>`;
        }
    }
};

// Add popup toggle button
const addPopupButton = () => {
    // Check if button already exists
    if (document.getElementById('ai-popup-btn')) return;

    // Create button
    const popupBtn = document.createElement('button');
    popupBtn.id = 'ai-popup-btn';
    popupBtn.textContent = 'Open AI Assistant';
    popupBtn.style.position = 'fixed';
    popupBtn.style.bottom = '10px';
    popupBtn.style.right = '10px';
    popupBtn.style.zIndex = '9999';
    popupBtn.style.backgroundColor = '#cba6f7';
    popupBtn.style.color = '#1e1e2e';
    popupBtn.style.border = 'none';
    popupBtn.style.borderRadius = '4px';
    popupBtn.style.padding = '8px 12px';
    popupBtn.style.fontWeight = 'bold';
    popupBtn.style.cursor = 'pointer';

    // Add click handler
    popupBtn.addEventListener('click', () => {
        openAiPopup();
    });

    document.body.appendChild(popupBtn);
};

// Set up a mutation observer to detect game changes
const setupGameObserver = () => {
    const targetNode = document.body;
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        // Check for specific hint changes
        if (hasHintChanged()) {
            console.log("Hint changed detected!");
            if (aiPopup && !aiPopup.closed) {
                updatePopupContent();
            }
            return;
        }

        // Check for broader game state changes
        if (hasGameStateChanged()) {
            console.log("Game state change detected!");
            if (aiPopup && !aiPopup.closed) {
                updatePopupContent();
            }
            return;
        }

        // As a fallback, check specific mutations
        for (const mutation of mutationsList) {
            // Detect role changes (spymaster toggle)
            if (mutation.type === 'attributes' &&
                mutation.target.classList &&
                mutation.target.classList.contains('spymaster-button')) {
                console.log("Role change detected!");
                if (aiPopup && !aiPopup.closed) {
                    updatePopupContent();
                }
                break;
            }

            // Detect hint-related changes - check for multiple selectors that might contain hints
            if (!isSpymaster() &&
                ((mutation.target.classList &&
                  (mutation.target.classList.contains('clue') ||
                   mutation.target.classList.contains('article'))) ||
                 (mutation.type === 'childList' &&
                  mutation.target.querySelector &&
                  mutation.target.querySelector('.clue, article')))) {
                console.log("Hint UI change detected!");
                if (aiPopup && !aiPopup.closed) {
                    updatePopupContent();
                }
                break;
            }

            // Detect turn changes
            if (mutation.type === 'attributes' &&
                mutation.target.classList &&
                mutation.target.classList.contains('team-name')) {
                console.log("Team turn change detected!");
                if (aiPopup && !aiPopup.closed) {
                    updatePopupContent();
                }
                break;
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // Add periodic checks as a fallback for any missed changes
    setInterval(() => {
        if (aiPopup && !aiPopup.closed && (hasHintChanged() || hasGameStateChanged())) {
            console.log("Periodic check detected change!");
            updatePopupContent();
        }
    }, 2000);
};

// Initialize everything
const initInterval = setInterval(() => {
    const gameScene = document.getElementById("gamescene");
    if (gameScene) {
        // Initialize state tracking
        lastHint = getCurrentHint();
        lastGameState = {
            role: isSpymaster() ? 'spymaster' : 'guesser',
            team: getCurrentTeamColor(),
            hasHint: lastHint.text !== '',
            turnPhase: getGamePhase()
        };

        addPopupButton();
        setupGameObserver();
        clearInterval(initInterval);

        // Continue checking for button in case it gets removed
        setInterval(addPopupButton, 2000);
    }
}, 500);
