// ==UserScript==
// additional copyright/license info:
//© All Rights Reserved
//
//Chess.com Enhanced Experience © 2024 by Akashdeep
//
// ==UserScript
// @name         Chess.com UltraX bot with Panel
// @namespace    Akashdeep
// @version      1.0.1.1
// @description  Enhances your Chess.com experience with move suggestions, UI enhancements, and customizable features.  Credits to GoodtimeswithEno for the initial move highlighting and basic chess engine implementation.
// @author       Akashdeep
// @license      Chess.com Enhanced Experience © 2024 by Akashdeep, © All Rights Reserved
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @match       https://www.chess.com/puzzles/*
// @match       https://www.chess.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource    stockfish.js        https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-start
// @liscense MIT

// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/531100/Chesscom%20UltraX%20bot%20with%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/531100/Chesscom%20UltraX%20bot%20with%20Panel.meta.js
// ==/UserScript==
(() => {
  // config.js
  var currentVersion = "1.0.1.1";
  function getRandomTacticalStrength() {
    const strengths = [
      "fork",
      "pin",
      "skewer",
      "discovery",
      "zwischenzug",
      "removing-defender",
      "attraction"
    ];
    return strengths[Math.floor(Math.random() * strengths.length)];
  }
  function getRandomTacticalWeakness() {
    const weaknesses = [
      "long-calculation",
      "quiet-moves",
      "backward-moves",
      "zugzwang",
      "prophylaxis",
      "piece-coordination"
    ];
    return weaknesses[Math.floor(Math.random() * weaknesses.length)];
  }

  // variables.js
  function initializeVariables() {
    const myVars = {
      autoMovePiece: false,
      autoRun: false,
      delay: 0.1,
      loaded: false,
      lastValue: 11,
      playStyle: {
        aggressive: Math.random() * 0.5 + 0.3,
        // 0.3-0.8 tendency for aggressive moves
        defensive: Math.random() * 0.5 + 0.3,
        // 0.3-0.8 tendency for defensive moves
        tactical: Math.random() * 0.6 + 0.2,
        // 0.2-0.8 tendency for tactical moves
        positional: Math.random() * 0.6 + 0.2
        // 0.2-0.8 tendency for positional moves
      },
      preferredOpenings: [
        "e4",
        "d4",
        "c4",
        "Nf3"
        // Just examples, could be expanded
      ].sort(() => Math.random() - 0.5),
      // Randomize the order
      playerFingerprint: GM_getValue("playerFingerprint", {
        favoredPieces: Math.random() < 0.5 ? "knights" : "bishops",
        openingTempo: Math.random() * 0.5 + 0.5,
        // 0.5-1.0 opening move speed
        tacticalAwareness: Math.random() * 0.4 + 0.6,
        // 0.6-1.0 tactical vision
        exchangeThreshold: Math.random() * 0.3 + 0.1,
        // When to accept exchanges
        attackingStyle: ["kingside", "queenside", "central"][Math.floor(Math.random() * 3)]
      }),
      tacticalProfile: GM_getValue("tacticalProfile", {
        strengths: [
          getRandomTacticalStrength(),
          getRandomTacticalStrength()
        ],
        weaknesses: [
          getRandomTacticalWeakness(),
          getRandomTacticalWeakness()
        ]
      }),
      psychologicalState: {
        confidence: 0.7 + Math.random() * 0.3,
        // 0.7-1.0
        tiltFactor: 0,
        // 0-1, increases with blunders
        focus: 0.8 + Math.random() * 0.2,
        // 0.8-1.0, decreases with time
        playTime: 0
        // tracks continuous play time
      }
    };
    if (!GM_getValue("playerFingerprint")) {
      GM_setValue("playerFingerprint", myVars.playerFingerprint);
    }
    if (!GM_getValue("tacticalProfile")) {
      GM_setValue("tacticalProfile", myVars.tacticalProfile);
    }
    return myVars;
  }

  // engine.js
  function setupEngine(myVars, myFunctions) {
    const engine = {
      engine: null
    };
    myFunctions.loadChessEngine = function() {
      if (!engine.stockfishObjectURL) {
        engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
      }
      console.log(engine.stockfishObjectURL);
      if (engine.stockfishObjectURL) {
        engine.engine = new Worker(engine.stockfishObjectURL);
        engine.engine.onmessage = (e) => {
          myFunctions.parser(e);
        };
        engine.engine.onerror = (e) => {
          console.log("Worker Error: " + e);
        };
        engine.engine.postMessage("ucinewgame");
      }
      console.log("loaded chess engine");
    };
    myFunctions.reloadChessEngine = function() {
      console.log(`Reloading the chess engine!`);
      engine.engine.terminate();
      window.isThinking = false;
      myFunctions.loadChessEngine();
    };
    myFunctions.runChessEngine = function(depth) {
      var adjustedDepth = myFunctions.getAdjustedDepth();
      var fen = window.board.game.getFEN();
      var positionType = myFunctions.analyzePositionType(fen);
      console.log(`Original depth: ${depth}, Adjusted for time/position: ${adjustedDepth}`);
      engine.engine.postMessage(`position fen ${fen}`);
      console.log(`updated: position fen ${fen}`);
      window.isThinking = true;
      if (depth >= 15) {
        engine.engine.postMessage(`setoption name MultiPV value 5`);
      } else {
        engine.engine.postMessage(`setoption name MultiPV value 1`);
      }
      engine.engine.postMessage(`go depth ${adjustedDepth}`);
      myVars.lastValue = depth;
    };
    myFunctions.autoRun = function(lstValue) {
      if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
        myFunctions.runChessEngine(lstValue);
      }
    };
    return engine;
  }

  // ui/html.js
  var mainTemplate = `
<div class="chess-bot-container">
    <div class="bot-header">
        <div class="bot-logo">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19,22H5V20H19V22M17,10C15.58,10 14.26,10.77 13.55,12H13V7H16V5H13V2H11V5H8V7H11V12H10.45C9.74,10.77 8.42,10 7,10A5,5 0 0,0 2,15A5,5 0 0,0 7,20H17A5,5 0 0,0 22,15A5,5 0 0,0 17,10M7,18A3,3 0 0,1 4,15A3,3 0 0,1 7,12A3,3 0 0,1 10,15A3,3 0 0,1 7,18M17,18A3,3 0 0,1 14,15A3,3 0 0,1 17,12A3,3 0 0,1 20,15A3,3 0 0,1 17,18Z" />
            </svg>
        </div>
        <h3 class="bot-title">Panel Pro By @akashdeep</h3>
        <div id="thinking-indicator" class="thinking-indicator">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>
            <span class="dot dot3"></span>
        </div>
    </div>

    <div class="bot-tabs">
        <button class="tab-button active" data-tab="main-settings">Main</button>
        <button class="tab-button" data-tab="style-settings">Play Style</button>
        <button class="tab-button" data-tab="advanced-settings">Advanced</button>
    </div>

    <div class="bot-tabs-content">
        <div class="tab-content active" id="main-settings">
            <div class="bot-info">
                <div class="depth-card">
                    <p id="depthText" class="depth-display">Current Depth: <strong>11</strong></p>
                    <p class="key-hint">Press a key (Q-Z) to change depth</p>

                    <div class="depth-control">
                        <label for="depthSlider">Depth/ELO:</label>
                        <div class="slider-controls">
                            <button class="depth-button" id="decreaseDepth">-</button>
                            <input type="range" id="depthSlider" min="1" max="21" value="11" class="depth-slider">
                            <button class="depth-button" id="increaseDepth">+</button>
                        </div>
                        <span id="depthValue">11</span>
                    </div>
                </div>
            </div>

            <div class="bot-controls">
                <div class="control-group">
                    <div class="control-item toggle-container">
                        <input type="checkbox" id="autoRun" name="autoRun" class="toggle-input" value="false">
                        <label for="autoRun" class="toggle-label">
                            <span class="toggle-button"></span>
                            <span class="toggle-text">Auto Run</span>
                        </label>
                    </div>

                    <div class="control-item toggle-container">
                        <input type="checkbox" id="autoMove" name="autoMove" class="toggle-input" value="false">
                        <label for="autoMove" class="toggle-label">
                            <span class="toggle-button"></span>
                            <span class="toggle-text">Auto Move</span>
                        </label>
                    </div>
                </div>

                <div class="control-group">
                    <div class="control-item slider-container">
                        <label for="timeDelayMin">Min Delay (sec)</label>
                        <input type="number" id="timeDelayMin" name="timeDelayMin" min="0.1" value="0.1" step="0.1" class="number-input">
                    </div>

                    <div class="control-item slider-container">
                        <label for="timeDelayMax">Max Delay (sec)</label>
                        <input type="number" id="timeDelayMax" name="timeDelayMax" min="0.1" value="1" step="0.1" class="number-input">
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content" id="style-settings">
            <div class="playStyle-controls">
                <h4 class="settings-section-title">Playing Style Settings</h4>

                <div class="style-slider-container">
                    <label for="aggressiveSlider">Aggressive Play:</label>
                    <input type="range" id="aggressiveSlider" min="1" max="10" value="5" class="style-slider">
                    <span id="aggressiveValue">5</span>
                </div>

                <div class="style-slider-container">
                    <label for="defensiveSlider">Defensive Play:</label>
                    <input type="range" id="defensiveSlider" min="1" max="10" value="5" class="style-slider">
                    <span id="defensiveValue">5</span>
                </div>

                <div class="style-slider-container">
                    <label for="tacticalSlider">Tactical Play:</label>
                    <input type="range" id="tacticalSlider" min="1" max="10" value="5" class="style-slider">
                    <span id="tacticalValue">5</span>
                </div>

                <div class="style-slider-container">
                    <label for="positionalSlider">Positional Play:</label>
                    <input type="range" id="positionalSlider" min="1" max="10" value="5" class="style-slider">
                    <span id="positionalValue">5</span>
                </div>

                <div class="style-slider-container">
                    <label for="blunderRateSlider">Blunder Rate:</label>
                    <input type="range" id="blunderRateSlider" min="0" max="10" value="2" class="style-slider">
                    <span id="blunderRateValue">2</span>
                </div>
            </div>
        </div>

        <div class="tab-content" id="advanced-settings">
            <div class="advanced-controls">
                <h4 class="settings-section-title">Advanced Settings</h4>

                <div class="control-item toggle-container">
                    <input type="checkbox" id="adaptToRating" name="adaptToRating" class="toggle-input" value="true" checked>
                    <label for="adaptToRating" class="toggle-label">
                        <span class="toggle-button"></span>
                        <span class="toggle-text">Adapt to opponent rating</span>
                    </label>
                </div>

                <div class="control-item toggle-container">
                    <input type="checkbox" id="useOpeningBook" name="useOpeningBook" class="toggle-input" value="true" checked>
                    <label for="useOpeningBook" class="toggle-label">
                        <span class="toggle-button"></span>
                        <span class="toggle-text">Use personalized openings</span>
                    </label>
                </div>

                <div class="highlight-color-picker">
                    <label for="highlightColor">Move highlight color:</label>
                    <input type="color" id="highlightColor" value="#eb6150" class="color-input">
                </div>

                <div class="opening-selection">
                    <label for="preferredOpeningSelect">Preferred Opening:</label>
                    <select id="preferredOpeningSelect" class="select-input">
                        <option value="random">Random</option>
                        <option value="e4">e4 (King's Pawn)</option>
                        <option value="d4">d4 (Queen's Pawn)</option>
                        <option value="c4">c4 (English)</option>
                        <option value="Nf3">Nf3 (R\xE9ti)</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="bot-actions">
        <button type="button" id="relEngBut" class="action-button primary-button" onclick="document.myFunctions.reloadChessEngine()">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
            Reload Engine
        </button>

        <button type="button" id="isBut" class="action-button secondary-button" onclick="window.confirm('Can I take you to the issues page?') ? document.location = 'https://github.com/egsakash/chess.comPanelPro/issues' : console.log('canceled')">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            Report Issue
        </button>
    </div>
</div>`;
  var advancedSettingsTemplate = `
<div class="advanced-section">
    <div class="control-item toggle-container">
        <input type="checkbox" id="enableHotkeys" name="enableHotkeys" class="toggle-input" checked>
        <label for="enableHotkeys" class="toggle-label">
            <span class="toggle-button"></span>
            <span class="toggle-text">Enable keyboard shortcuts</span>
        </label>
    </div>

    <div class="control-item toggle-container">
        <input type="checkbox" id="randomizeTiming" name="randomizeTiming" class="toggle-input" checked>
        <label for="randomizeTiming" class="toggle-label">
            <span class="toggle-button"></span>
            <span class="toggle-text">Randomize thinking time</span>
        </label>
    </div>

    <div class="style-slider-container">
        <label for="mouseMovementSlider">Mouse Movement Realism:</label>
        <input type="range" id="mouseMovementSlider" min="1" max="10" value="7" class="style-slider">
        <span id="mouseMovementSliderValue">7</span>
    </div>

    <div class="profile-selection">
        <label for="playingProfileSelect">Playing Profile:</label>
        <select id="playingProfileSelect" class="select-input">
            <option value="custom">Custom Settings</option>
            <option value="beginner">Beginner (\u2248800)</option>
            <option value="intermediate">Intermediate (\u22481200)</option>
            <option value="advanced">Advanced (\u22481600)</option>
            <option value="expert">Expert (\u22482000)</option>
            <option value="master">Master (\u22482400+)</option>
        </select>
    </div>
</div>
`;
  var spinnerTemplate = `
<div style="display:none;" id="overlay">
    <div style="
        margin: 0 auto;
        height: 40px;
        width: 40px;
        animation: rotate 0.8s infinite linear;
        border: 4px solid #89b4fa;
        border-right-color: transparent;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(137, 180, 250, 0.4);
    "></div>
</div>
`;

  // ui/styles.js
  var mainStyles = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

#settingsContainer {
    background-color: #1e1e2e;
    color: #cdd6f4;
    border-radius: 12px;
    padding: 20px;
    margin-top: 15px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    font-family: 'Roboto', sans-serif;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #313244;
}

.chess-bot-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.bot-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 5px;
    position: relative;
}

.bot-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #89b4fa;
}

.bot-title {
    margin: 0;
    color: #89b4fa;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.thinking-indicator {
    position: absolute;
    right: 0;
    display: none;
    align-items: center;
}

.thinking-indicator.active {
    display: flex;
}

.dot {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: #89b4fa;
    border-radius: 50%;
    opacity: 0.6;
}

.dot1 {
    animation: pulse 1.5s infinite;
}

.dot2 {
    animation: pulse 1.5s infinite 0.3s;
}

.dot3 {
    animation: pulse 1.5s infinite 0.6s;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.3);
        opacity: 1;
    }
}

.bot-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: -15px;
}

.tab-button {
    background-color: #313244;
    color: #a6adc8;
    border: none;
    border-radius: 8px 8px 0 0;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    flex: 1;
    text-align: center;
}

.tab-button:hover {
    background-color: #45475a;
    color: #cdd6f4;
}

.tab-button.active {
    background-color: #45475a;
    color: #cdd6f4;
}

.bot-tabs-content {
    background-color: #45475a;
    border-radius: 0 8px 8px 8px;
    padding: 16px;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.settings-section-title {
    margin-top: 0;
    margin-bottom: 12px;
    color: #89b4fa;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
}

.bot-info {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
}

.depth-card {
    background-color: #313244;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    width: 100%;
    border: 1px solid #45475a;
}

.depth-display {
    font-size: 16px;
    margin: 0 0 5px 0;
    font-weight: 400;
}

.depth-display strong {
    color: #89b4fa;
    font-weight: 600;
}

.key-hint {
    font-size: 12px;
    color: #a6adc8;
    margin: 0;
    font-weight: 300;
}

.bot-controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.control-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.control-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.toggle-container {
    position: relative;
}

.toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.toggle-button {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    background-color: #45475a;
    border-radius: 20px;
    transition: all 0.3s;
}

.toggle-button:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #cdd6f4;
    top: 2px;
    left: 2px;
    transition: all 0.3s;
}

.toggle-input:checked + .toggle-label .toggle-button {
    background-color: #89b4fa;
}

.toggle-input:checked + .toggle-label .toggle-button:before {
    transform: translateX(20px);
}

.toggle-text {
    font-size: 14px;
}

.slider-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.slider-container label {
    font-size: 13px;
    color: #a6adc8;
}

.number-input {
    width: 100%;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 6px;
    color: #cdd6f4;
    padding: 8px 10px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.number-input:focus {
    outline: none;
    border-color: #89b4fa;
}

.bot-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 5px;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.primary-button {
    background-color: #89b4fa;
    color: #1e1e2e;
}

.primary-button:hover {
    background-color: #b4befe;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(137, 180, 250, 0.3);
}

.secondary-button {
    background-color: #45475a;
    color: #cdd6f4;
}

.secondary-button:hover {
    background-color: #585b70;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(69, 71, 90, 0.3);
}

.action-button:active {
    transform: translateY(0);
}

.depth-control {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.depth-control label {
    font-size: 13px;
    color: #a6adc8;
}

.slider-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.depth-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #45475a;
    border-radius: 3px;
    outline: none;
}

.depth-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #89b4fa;
    cursor: pointer;
}

.depth-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #89b4fa;
    cursor: pointer;
}

.depth-button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #45475a;
    color: #cdd6f4;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.2s;
}

.depth-button:hover {
    background: #585b70;
}

#depthValue {
    font-size: 14px;
    font-weight: 500;
    color: #89b4fa;
    text-align: center;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
`;
  var advancedStyles = `
.advanced-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #313244;
}

.profile-selection {
    margin-top: 15px;
}

.playStyle-controls, .advanced-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.style-slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.style-slider-container label {
    font-size: 13px;
    color: #cdd6f4;
    width: 120px;
}

.style-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #313244;
    border-radius: 3px;
    outline: none;
}

.style-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #89b4fa;
    cursor: pointer;
}

.style-slider-container span {
    font-size: 14px;
    font-weight: 500;
    color: #89b4fa;
    width: 20px;
    text-align: center;
}

.highlight-color-picker {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.highlight-color-picker label {
    font-size: 13px;
    color: #cdd6f4;
}

.color-input {
    -webkit-appearance: none;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: none;
    cursor: pointer;
}

.color-input::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #45475a;
}

.opening-selection {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.opening-selection label {
    font-size: 13px;
    color: #cdd6f4;
}

.select-input {
    flex: 1;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 6px;
    color: #cdd6f4;
    padding: 8px 10px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.select-input:focus {
    outline: none;
    border-color: #89b4fa;
}
`;

  // ui.js
  function setupUI(myVars, myFunctions) {
    let dynamicStyles = null;
    function addAnimation(body) {
      if (!dynamicStyles) {
        dynamicStyles = document.createElement("style");
        dynamicStyles.type = "text/css";
        document.head.appendChild(dynamicStyles);
      }
      dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }
    myFunctions.spinner = function() {
      if (window.isThinking == true) {
        $("#thinking-indicator").addClass("active");
      }
      if (window.isThinking == false) {
        $("#thinking-indicator").removeClass("active");
      }
    };
    myFunctions.loadEx = function() {
      try {
        window.board = $("chess-board")[0] || $("wc-chess-board")[0];
        myVars.board = window.board;
        var div = document.createElement("div");
        div.setAttribute("id", "settingsContainer");
        div.innerHTML = mainTemplate;
        div.prepend($(spinnerTemplate)[0]);
        window.board.parentElement.parentElement.appendChild(div);
        var botStyles = document.createElement("style");
        botStyles.innerHTML = mainStyles + advancedStyles;
        document.head.appendChild(botStyles);
        addAnimation(`@keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`);
        $("#advanced-settings .advanced-controls").append(advancedSettingsTemplate);
        myFunctions.loadSettings();
        applySettingsToUI(myVars);
        myVars.loaded = true;
      } catch (error) {
        console.log(error);
      }
    };
    function applySettingsToUI(myVars2) {
      $("#autoRun").prop("checked", myVars2.autoRun);
      $("#autoMove").prop("checked", myVars2.autoMove);
      $("#adaptToRating").prop("checked", myVars2.adaptToRating !== void 0 ? myVars2.adaptToRating : true);
      $("#useOpeningBook").prop("checked", myVars2.useOpeningBook !== void 0 ? myVars2.useOpeningBook : true);
      $("#enableHotkeys").prop("checked", myVars2.enableHotkeys !== void 0 ? myVars2.enableHotkeys : true);
      $("#randomizeTiming").prop("checked", myVars2.randomizeTiming !== void 0 ? myVars2.randomizeTiming : true);
      $("#depthSlider").val(myVars2.lastValue);
      $("#depthValue").text(myVars2.lastValue);
      $("#depthText").html("Current Depth: <strong>" + myVars2.lastValue + "</strong>");
      $("#timeDelayMin").val(GM_getValue("timeDelayMin", 0.1));
      $("#timeDelayMax").val(GM_getValue("timeDelayMax", 1));
      if (myVars2.highlightColor) {
        $("#highlightColor").val(myVars2.highlightColor);
      }
      if (myVars2.playStyle) {
        const aggressiveValue = Math.round((myVars2.playStyle.aggressive - 0.3) / 0.5 * 10);
        $("#aggressiveSlider").val(aggressiveValue);
        $("#aggressiveValue").text(aggressiveValue);
        const defensiveValue = Math.round((myVars2.playStyle.defensive - 0.3) / 0.5 * 10);
        $("#defensiveSlider").val(defensiveValue);
        $("#defensiveValue").text(defensiveValue);
        const tacticalValue = Math.round((myVars2.playStyle.tactical - 0.2) / 0.6 * 10);
        $("#tacticalSlider").val(tacticalValue);
        $("#tacticalValue").text(tacticalValue);
        const positionalValue = Math.round((myVars2.playStyle.positional - 0.2) / 0.6 * 10);
        $("#positionalSlider").val(positionalValue);
        $("#positionalValue").text(positionalValue);
      }
      if (myVars2.blunderRate !== void 0) {
        const blunderValue = Math.round(myVars2.blunderRate * 10);
        $("#blunderRateSlider").val(blunderValue);
        $("#blunderRateValue").text(blunderValue);
      }
      if (myVars2.mouseMovementRealism !== void 0) {
        const movementValue = Math.round(myVars2.mouseMovementRealism * 10);
        $("#mouseMovementSlider").val(movementValue);
        $("#mouseMovementSliderValue").text(movementValue);
      }
      if (myVars2.preferredOpenings && myVars2.preferredOpenings.length === 1) {
        $("#preferredOpeningSelect").val(myVars2.preferredOpenings[0]);
      }
      console.log("Settings applied to UI");
    }
    return myFunctions;
  }

  // events/ui-events.js
  function setupUIEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#depthSlider", function() {
      const depth = parseInt($(this).val());
      $("#depthValue").text(depth);
      myVars.lastValue = depth;
      $("#depthText")[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";
      myFunctions.saveSettings();
    });
    $(document).on("click", "#decreaseDepth", function() {
      const currentDepth = parseInt($("#depthSlider").val());
      if (currentDepth > 1) {
        const newDepth = currentDepth - 1;
        $("#depthSlider").val(newDepth).trigger("input");
      }
    });
    $(document).on("click", "#increaseDepth", function() {
      const currentDepth = parseInt($("#depthSlider").val());
      if (currentDepth < 26) {
        const newDepth = currentDepth + 1;
        $("#depthSlider").val(newDepth).trigger("input");
      }
    });
    $(document).on("click", ".tab-button", function() {
      $(".tab-button").removeClass("active");
      $(this).addClass("active");
      const tabId = $(this).data("tab");
      $(".tab-content").removeClass("active");
      $(`#${tabId}`).addClass("active");
    });
  }

  // events/style-events.js
  function setupStyleEventHandlers(myVars, myFunctions) {
    $(document).on("input", ".style-slider", function() {
      const value = $(this).val();
      $(`#${this.id}Value`).text(value);
      const styleType = this.id.replace("Slider", "");
      if (styleType === "blunderRate") {
        myVars.blunderRate = parseFloat(value) / 10;
      } else if (myVars.playStyle && styleType in myVars.playStyle) {
        if (styleType === "aggressive" || styleType === "defensive") {
          myVars.playStyle[styleType] = 0.3 + parseFloat(value) / 10 * 0.5;
        } else {
          myVars.playStyle[styleType] = 0.2 + parseFloat(value) / 10 * 0.6;
        }
      }
      myFunctions.saveSettings();
    });
    $(document).on("change", "#autoRun, #autoMove, #adaptToRating, #useOpeningBook, #enableHotkeys, #randomizeTiming", function() {
      const id = $(this).attr("id");
      myVars[id] = $(this).prop("checked");
      if (id === "autoMove") {
        console.log(`Auto move set to: ${myVars.autoMove}`);
      }
      myFunctions.saveSettings();
    });
    $(document).on("input", "#highlightColor", function() {
      myVars.highlightColor = $(this).val();
      myFunctions.saveSettings();
    });
  }

  // events/advanced-events.js
  function setupAdvancedEventHandlers(myVars, myFunctions) {
    $(document).on("change", "#preferredOpeningSelect", function() {
      const selectedOpening = $(this).val();
      if (selectedOpening === "random") {
        myVars.preferredOpenings = ["e4", "d4", "c4", "Nf3"].sort(() => Math.random() - 0.5);
      } else {
        myVars.preferredOpenings = [selectedOpening];
      }
      myFunctions.saveSettings();
    });
    $(document).on("input", "#mouseMovementSlider", function() {
      const value = $(this).val();
      $("#mouseMovementSliderValue").text(value);
      myVars.mouseMovementRealism = parseFloat(value) / 10;
      myFunctions.saveSettings();
    });
    $(document).on("change", "#playingProfileSelect", function() {
      const profile = $(this).val();
      if (profile !== "custom") {
        switch (profile) {
          case "beginner":
            $("#depthSlider").val(3).trigger("input");
            $("#blunderRateSlider").val(7).trigger("input");
            $("#aggressiveSlider").val(Math.floor(3 + Math.random() * 5)).trigger("input");
            $("#tacticalSlider").val(3).trigger("input");
            break;
          case "intermediate":
            $("#depthSlider").val(6).trigger("input");
            $("#blunderRateSlider").val(5).trigger("input");
            $("#tacticalSlider").val(5).trigger("input");
            break;
          case "advanced":
            $("#depthSlider").val(9).trigger("input");
            $("#blunderRateSlider").val(3).trigger("input");
            $("#tacticalSlider").val(7).trigger("input");
            break;
          case "expert":
            $("#depthSlider").val(12).trigger("input");
            $("#blunderRateSlider").val(2).trigger("input");
            $("#tacticalSlider").val(8).trigger("input");
            $("#positionalSlider").val(8).trigger("input");
            break;
          case "master":
            $("#depthSlider").val(15).trigger("input");
            $("#blunderRateSlider").val(1).trigger("input");
            $("#tacticalSlider").val(9).trigger("input");
            $("#positionalSlider").val(9).trigger("input");
            break;
        }
        setTimeout(myFunctions.saveSettings, 100);
      }
    });
    $(document).on("change", "#timeDelayMin, #timeDelayMax", function() {
      myFunctions.saveSettings();
    });
  }

  // events.js
  function setupEventHandlers(myVars, myFunctions, engine) {
    document.onkeydown = function(e) {
      if (!myVars.enableHotkeys) return;
      switch (e.keyCode) {
        case 81:
          myFunctions.runChessEngine(1);
          break;
        case 87:
          myFunctions.runChessEngine(2);
          break;
        case 69:
          myFunctions.runChessEngine(3);
          break;
        case 82:
          myFunctions.runChessEngine(4);
          break;
        case 84:
          myFunctions.runChessEngine(5);
          break;
        case 89:
          myFunctions.runChessEngine(6);
          break;
        case 85:
          myFunctions.runChessEngine(7);
          break;
        case 73:
          myFunctions.runChessEngine(8);
          break;
        case 79:
          myFunctions.runChessEngine(9);
          break;
        case 80:
          myFunctions.runChessEngine(10);
          break;
        case 65:
          myFunctions.runChessEngine(11);
          break;
        case 83:
          myFunctions.runChessEngine(12);
          break;
        case 68:
          myFunctions.runChessEngine(13);
          break;
        case 70:
          myFunctions.runChessEngine(14);
          break;
        case 71:
          myFunctions.runChessEngine(15);
          break;
        case 72:
          myFunctions.runChessEngine(16);
          break;
        case 74:
          myFunctions.runChessEngine(17);
          break;
        case 75:
          myFunctions.runChessEngine(18);
          break;
        case 76:
          myFunctions.runChessEngine(19);
          break;
        case 90:
          myFunctions.runChessEngine(20);
          break;
        case 88:
          myFunctions.runChessEngine(21);
          break;
        case 67:
          myFunctions.runChessEngine(22);
          break;
        case 86:
          myFunctions.runChessEngine(23);
          break;
        case 66:
          myFunctions.runChessEngine(24);
          break;
        case 78:
          myFunctions.runChessEngine(25);
          break;
        case 77:
          myFunctions.runChessEngine(26);
          break;
        case 187:
          myFunctions.runChessEngine(100);
          break;
      }
    };
    $(document).ready(function() {
      setupUIEventHandlers(myVars, myFunctions);
      setupStyleEventHandlers(myVars, myFunctions);
      setupAdvancedEventHandlers(myVars, myFunctions);
    });
  }

  // parser.js
  function setupParser(myVars, myFunctions) {
    myFunctions.parser = function(e) {
      if (e.data.includes("bestmove")) {
        const bestMove = e.data.split(" ")[1];
        let alternativeMoves = [bestMove];
        try {
          if (e.data.includes("pv")) {
            const lines = e.data.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
              const pvIndex = line.indexOf(" pv ");
              return line.substring(pvIndex + 4).split(" ")[0];
            });
            if (lines.length > 1) {
              alternativeMoves = lines;
            }
          }
        } catch (error) {
          console.log("Error extracting alternative moves", error);
        }
        let moveToPlay = bestMove;
        const currentDepth = myVars.lastValue;
        if (currentDepth >= 15 && alternativeMoves.length > 1 && Math.random() < 0.35) {
          const maxIndex = Math.min(5, alternativeMoves.length);
          const randomIndex = Math.floor(Math.random() * (maxIndex - 1)) + 1;
          moveToPlay = alternativeMoves[randomIndex] || bestMove;
          console.log(`Using alternative move ${moveToPlay} instead of best move ${bestMove}`);
        } else if (Math.random() < myFunctions.getBlunderProbability()) {
          moveToPlay = myFunctions.generateHumanLikeMove(bestMove, e.data);
          console.log(`Using human-like move ${moveToPlay} instead of best move ${bestMove}`);
        }
        myFunctions.color(moveToPlay);
        window.isThinking = false;
      }
    };
    myFunctions.getBlunderProbability = function() {
      const userBlunderRate = myVars.blunderRate !== void 0 ? myVars.blunderRate : 0.05;
      const gamePhase = myFunctions.estimateGamePhase();
      const timeRemaining = myFunctions.estimateTimeRemaining();
      const complexity = myFunctions.estimatePositionComplexity();
      let baseProb = userBlunderRate;
      if (timeRemaining < 30) {
        baseProb += 0.1 * (1 - timeRemaining / 30);
      }
      if (complexity > 0.6) {
        baseProb += 0.05 * (complexity - 0.6) * 2;
      }
      if (gamePhase > 30) {
        baseProb += 0.03 * ((gamePhase - 30) / 10);
      }
      return Math.min(0.4, baseProb * (0.7 + Math.random() * 0.6));
    };
    myFunctions.generateHumanLikeMove = function(bestMove, engineData) {
      if (engineData.includes("pv") && Math.random() < 0.4) {
        try {
          const lines = engineData.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
            const pvIndex = line.indexOf(" pv ");
            return line.substring(pvIndex + 4).split(" ")[0];
          });
          if (lines.length > 1) {
            const moveIndex = Math.floor(Math.pow(Math.random(), 2.5) * Math.min(lines.length, 4));
            return lines[moveIndex] || bestMove;
          }
        } catch (e) {
          console.log("Error extracting alternative moves", e);
        }
      }
      if (Math.random() < 0.15) {
        const fromSquare = bestMove.substring(0, 2);
        const toSquare = bestMove.substring(2, 4);
        if (Math.random() < 0.7) {
          const files = "abcdefgh";
          const ranks = "12345678";
          const fromFile = fromSquare.charAt(0);
          const fromRank = fromSquare.charAt(1);
          const toFile = toSquare.charAt(0);
          const toRank = toSquare.charAt(1);
          const fileDiff = files.indexOf(toFile) - files.indexOf(fromFile);
          const rankDiff = ranks.indexOf(toRank) - ranks.indexOf(fromRank);
          if (Math.abs(fileDiff) > 1 || Math.abs(rankDiff) > 1) {
            const newToFile = files[files.indexOf(fromFile) + (fileDiff > 0 ? Math.max(1, fileDiff - 1) : Math.min(-1, fileDiff + 1))];
            const newToRank = ranks[ranks.indexOf(fromRank) + (rankDiff > 0 ? Math.max(1, rankDiff - 1) : Math.min(-1, rankDiff + 1))];
            if (newToFile && newToRank) {
              const alternativeMove = fromSquare + newToFile + newToRank;
              for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
                if (window.board.game.getLegalMoves()[each].from === fromSquare && window.board.game.getLegalMoves()[each].to === newToFile + newToRank) {
                  return alternativeMove;
                }
              }
            }
          }
        }
      }
      return bestMove;
    };
  }

  // utilities.js
  function setupUtilities(myVars) {
    const myFunctions = {};
    let stop_b = stop_w = 0;
    let s_br = s_br2 = s_wr = s_wr2 = 0;
    let obs = "";
    setupParser(myVars, myFunctions);
    myFunctions.rescan = function(lev) {
      var ari = $("chess-board").find(".piece").map(function() {
        return this.className;
      }).get();
      jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));
      function removeWord(arr, word) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          arr[i2] = arr[i2].replace(word, "");
        }
      }
      removeWord(ari, "square-");
      jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));
      for (var i = 0; i < jack.length; i++) {
        jack[i] = jack[i].replace("br", "r").replace("bn", "n").replace("bb", "b").replace("bq", "q").replace("bk", "k").replace("bb", "b").replace("bn", "n").replace("br", "r").replace("bp", "p").replace("wp", "P").replace("wr", "R").replace("wn", "N").replace("wb", "B").replace("br", "R").replace("wn", "N").replace("wb", "B").replace("wq", "Q").replace("wk", "K").replace("wb", "B");
      }
      str2 = "";
      var count = 0, str = "";
      for (var j = 8; j > 0; j--) {
        for (var i = 1; i < 9; i++) {
          (str = jack.find((el) => el.includes([i] + [j]))) ? str = str.replace(/[^a-zA-Z]+/g, "") : str = "";
          if (str == "") {
            count++;
            str = count.toString();
            if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
            else {
              count = 1;
              str = count.toString();
            }
          }
          str2 += str;
          if (i == 8) {
            count = 0;
            str2 += "/";
          }
        }
      }
      str2 = str2.slice(0, -1);
      color = "";
      wk = wq = bk = bq = "0";
      const move = $("vertical-move-list").children();
      if (move.length < 2) {
        stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
      }
      if (stop_b != 1) {
        if (move.find(".black.node:contains('K')").length) {
          bk = "";
          bq = "";
          stop_b = 1;
          console.log("debug secb");
        }
      } else {
        bq = "";
        bk = "";
      }
      if (stop_b != 1) (bk = move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "k") ? bq = move.find(".black.node:contains('O-O-O')").length ? bk = "" : "q" : bq = "";
      if (s_br != 1) {
        if (move.find(".black.node:contains('R')").text().match("[abcd]+")) {
          bq = "";
          s_br = 1;
        }
      } else bq = "";
      if (s_br2 != 1) {
        if (move.find(".black.node:contains('R')").text().match("[hgf]+")) {
          bk = "";
          s_br2 = 1;
        }
      } else bk = "";
      if (stop_b == 0) {
        if (s_br == 0) {
          if (move.find(".white.node:contains('xa8')").length > 0) {
            bq = "";
            s_br = 1;
            console.log("debug b castle_r");
          }
        }
        if (s_br2 == 0) {
          if (move.find(".white.node:contains('xh8')").length > 0) {
            bk = "";
            s_br2 = 1;
            console.log("debug b castle_l");
          }
        }
      }
      if (stop_w != 1) {
        if (move.find(".white.node:contains('K')").length) {
          wk = "";
          wq = "";
          stop_w = 1;
          console.log("debug secw");
        }
      } else {
        wq = "";
        wk = "";
      }
      if (stop_w != 1) (wk = move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "K") ? wq = move.find(".white.node:contains('O-O-O')").length ? wk = "" : "Q" : wq = "";
      if (s_wr != 1) {
        if (move.find(".white.node:contains('R')").text().match("[abcd]+")) {
          wq = "";
          s_wr = 1;
        }
      } else wq = "";
      if (s_wr2 != 1) {
        if (move.find(".white.node:contains('R')").text().match("[hgf]+")) {
          wk = "";
          s_wr2 = 1;
        }
      } else wk = "";
      if (stop_w == 0) {
        if (s_wr == 0) {
          if (move.find(".black.node:contains('xa1')").length > 0) {
            wq = "";
            s_wr = 1;
            console.log("debug w castle_l");
          }
        }
        if (s_wr2 == 0) {
          if (move.find(".black.node:contains('xh1')").length > 0) {
            wk = "";
            s_wr2 = 1;
            console.log("debug w castle_r");
          }
        }
      }
      if ($(".coordinates").children().first().text() == 1) {
        str2 = str2 + " b " + wk + wq + bk + bq;
        color = "white";
      } else {
        str2 = str2 + " w " + wk + wq + bk + bq;
        color = "black";
      }
      return str2;
    };
    myFunctions.color = function(dat) {
      response = dat;
      var res1 = response.substring(0, 2);
      var res2 = response.substring(2, 4);
      if (myVars.autoMove === true) {
        console.log(`Auto move enabled, moving from ${res1} to ${res2}`);
        myFunctions.movePiece(res1, res2);
      } else {
        console.log(`Auto move disabled, highlighting ${res1} to ${res2}`);
      }
      window.isThinking = false;
      res1 = res1.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
      res2 = res2.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
      const highlightColor = myVars.highlightColor || "rgb(235, 97, 80)";
      $(window.board.nodeName).prepend(`<div class="highlight square-${res2} bro" style="background-color: ${highlightColor}; opacity: 0.71;" data-test-element="highlight"></div>`).children(":first").delay(1800).queue(function() {
        $(this).remove();
      });
      $(window.board.nodeName).prepend(`<div class="highlight square-${res1} bro" style="background-color: ${highlightColor}; opacity: 0.71;" data-test-element="highlight"></div>`).children(":first").delay(1800).queue(function() {
        $(this).remove();
      });
    };
    myFunctions.movePiece = function(from, to) {
      let isLegalMove = false;
      let moveObject = null;
      for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
        if (window.board.game.getLegalMoves()[each].from === from && window.board.game.getLegalMoves()[each].to === to) {
          isLegalMove = true;
          moveObject = window.board.game.getLegalMoves()[each];
          break;
        }
      }
      if (!isLegalMove) {
        console.log(`Attempted illegal move: ${from} to ${to}`);
        return;
      }
      setTimeout(() => {
        try {
          window.board.game.move({
            ...moveObject,
            promotion: moveObject.promotion || "q",
            // Default to queen for simplicity
            animate: true,
            userGenerated: true
          });
          console.log(`Successfully moved from ${from} to ${to}`);
        } catch (error) {
          console.error("Error making move:", error);
        }
      }, 100 + Math.random() * 300);
    };
    myFunctions.other = function(delay) {
      const gamePhase = myFunctions.estimateGamePhase();
      const positionComplexity = myFunctions.estimatePositionComplexity();
      let naturalDelay = delay;
      if (gamePhase < 10) {
        naturalDelay *= 0.6 + Math.random() * 0.4;
      }
      if (positionComplexity > 0.7) {
        naturalDelay *= 1 + Math.random() * 1.5;
      }
      naturalDelay *= 0.85 + Math.random() * 0.3;
      var endTime = Date.now() + naturalDelay;
      var timer = setInterval(() => {
        if (Date.now() >= endTime) {
          myFunctions.autoRun(myFunctions.getAdjustedDepth());
          window.canGo = true;
          clearInterval(timer);
        }
      }, 10);
    };
    myFunctions.getAdjustedDepth = function() {
      const timeRemaining = myFunctions.estimateTimeRemaining();
      const gamePhase = myFunctions.estimateGamePhase();
      const positionType = myFunctions.analyzePositionType(window.board.game.getFEN());
      const isPositionCritical = myFunctions.isPositionCriticalNow();
      let baseDepth = myVars.lastValue;
      if (timeRemaining < 10) {
        return Math.floor(Math.random() * 3) + 1;
      } else if (timeRemaining < 30) {
        return Math.floor(Math.random() * 4) + 4;
      } else if (timeRemaining < 60) {
        return Math.floor(Math.random() * 7) + 6;
      } else if (timeRemaining < 120) {
        return Math.floor(Math.random() * 7) + 9;
      } else {
        if (!isPositionCritical && Math.random() < 0.07) {
          return Math.floor(Math.random() * 4) + 2;
        }
        return Math.floor(Math.random() * 9) + 11;
      }
    };
    myFunctions.analyzePositionType = function(fen) {
      const piecesCount = fen.split(" ")[0].match(/[pnbrqkPNBRQK]/g).length;
      if (piecesCount > 25) return "opening";
      if (piecesCount < 12) return "endgame";
      return "middlegame";
    };
    myFunctions.isPositionCriticalNow = function() {
      try {
        const inCheck = window.board.game.inCheck();
        const fen = window.board.game.getFEN();
        const whiteMaterial = myFunctions.countMaterial(fen, true);
        const blackMaterial = myFunctions.countMaterial(fen, false);
        const materialDifference = Math.abs(whiteMaterial - blackMaterial);
        return inCheck || materialDifference < 2;
      } catch (e) {
        return false;
      }
    };
    myFunctions.countMaterial = function(fen, isWhite) {
      const position = fen.split(" ")[0];
      let material = 0;
      const pieces = isWhite ? "PNBRQK" : "pnbrqk";
      const values = {
        "P": 1,
        "N": 3,
        "B": 3,
        "R": 5,
        "Q": 9,
        "K": 0,
        "p": 1,
        "n": 3,
        "b": 3,
        "r": 5,
        "q": 9,
        "k": 0
      };
      for (let char of position) {
        if (pieces.includes(char)) {
          material += values[char];
        }
      }
      return material;
    };
    myFunctions.estimateGamePhase = function() {
      try {
        const moveList = $("vertical-move-list").children().length;
        return moveList / 2;
      } catch (e) {
        return 15;
      }
    };
    myFunctions.estimateTimeRemaining = function() {
      let remainingTime = 600;
      try {
        const clockEl = document.querySelector(".clock-component.clock-bottom");
        if (clockEl) {
          const timeText = clockEl.textContent;
          if (timeText.includes(":")) {
            const parts = timeText.split(":");
            if (parts.length === 2) {
              const minutes = parseInt(parts[0]);
              const seconds = parseInt(parts[1]);
              if (!isNaN(minutes) && !isNaN(seconds)) {
                remainingTime = minutes * 60 + seconds;
              } else {
                console.log("Error parsing time:", timeText);
              }
            }
          } else {
            const seconds = parseInt(timeText);
            if (!isNaN(seconds)) {
              remainingTime = seconds;
            } else {
              console.log("Error parsing time:", timeText);
            }
          }
        } else {
          console.log("Clock element not found with selector '.clock-component.clock-bottom'");
        }
      } catch (e) {
        console.log("Error getting time remaining:", e);
      }
      console.log("Remaining time:", remainingTime);
      return remainingTime;
    };
    myFunctions.estimatePositionComplexity = function() {
      return Math.random() * 0.8 + 0.2;
    };
    myFunctions.saveSettings = function() {
      try {
        GM_setValue("autoRun", myVars.autoRun);
        GM_setValue("autoMove", myVars.autoMove);
        GM_setValue("timeDelayMin", $("#timeDelayMin").val());
        GM_setValue("timeDelayMax", $("#timeDelayMax").val());
        GM_setValue("depthValue", myVars.lastValue);
        GM_setValue("highlightColor", myVars.highlightColor);
        GM_setValue("playStyle", myVars.playStyle);
        GM_setValue("blunderRate", myVars.blunderRate);
        GM_setValue("adaptToRating", myVars.adaptToRating);
        GM_setValue("useOpeningBook", myVars.useOpeningBook);
        GM_setValue("preferredOpenings", myVars.preferredOpenings);
        GM_setValue("enableHotkeys", myVars.enableHotkeys);
        GM_setValue("randomizeTiming", myVars.randomizeTiming);
        GM_setValue("mouseMovementRealism", myVars.mouseMovementRealism);
        console.log("Settings saved successfully");
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };
    myFunctions.loadSettings = function() {
      try {
        myVars.autoRun = GM_getValue("autoRun", false);
        myVars.autoMove = GM_getValue("autoMove", false);
        myVars.lastValue = GM_getValue("depthValue", 11);
        myVars.highlightColor = GM_getValue("highlightColor", "rgb(235, 97, 80)");
        myVars.blunderRate = GM_getValue("blunderRate", 0.05);
        myVars.adaptToRating = GM_getValue("adaptToRating", true);
        myVars.useOpeningBook = GM_getValue("useOpeningBook", true);
        myVars.preferredOpenings = GM_getValue("preferredOpenings", ["e4", "d4", "c4", "Nf3"]);
        myVars.enableHotkeys = GM_getValue("enableHotkeys", true);
        myVars.randomizeTiming = GM_getValue("randomizeTiming", true);
        myVars.mouseMovementRealism = GM_getValue("mouseMovementRealism", 0.7);
        const savedPlayStyle = GM_getValue("playStyle", null);
        if (savedPlayStyle) {
          myVars.playStyle = savedPlayStyle;
        }
        console.log("Settings loaded successfully");
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    return myFunctions;
  }

  // main.js
  window.isThinking = false;
  window.canGo = true;
  window.myTurn = false;
  window.board = null;
  function main() {
    const myVars = initializeVariables();
    const myFunctions = setupUtilities(myVars);
    myFunctions.loadSettings();
    const engine = setupEngine(myVars, myFunctions);
    document.engine = engine;
    document.myVars = myVars;
    document.myFunctions = myFunctions;
    setupUI(myVars, myFunctions, engine);
    setupEventHandlers(myVars, myFunctions, engine);
    console.log("Chess.com UltraX bot initialized with version:", currentVersion);
  }
  window.addEventListener("load", (event) => {
    main();
  });
  var waitForChessBoard = setInterval(() => {
    if (!document.myVars || !document.myFunctions) return;
    const myVars = document.myVars;
    const myFunctions = document.myFunctions;
    if (myVars.loaded) {
      window.board = $("chess-board")[0] || $("wc-chess-board")[0];
      myVars.autoRun = $("#autoRun")[0].checked;
      myVars.autoMove = $("#autoMove")[0].checked;
      let minDel = parseFloat($("#timeDelayMin")[0].value);
      let maxDel = parseFloat($("#timeDelayMax")[0].value);
      myVars.delay = Math.random() * (maxDel - minDel) + minDel;
      myVars.isThinking = window.isThinking;
      myFunctions.spinner();
      if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
        window.myTurn = true;
      } else {
        window.myTurn = false;
      }
      $("#depthText")[0].innerHTML = "Current Depth: <strong>" + myVars.lastValue + "</strong>";
    } else {
      myFunctions.loadEx();
    }
    if (!document.engine.engine) {
      myFunctions.loadChessEngine();
    }
    if (myVars.autoRun == true && window.canGo == true && window.isThinking == false && window.myTurn) {
      window.canGo = false;
      var currentDelay = myVars.delay != void 0 ? myVars.delay * 1e3 : 10;
      myFunctions.other(currentDelay);
    }
  }, 100);
})();
