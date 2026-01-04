// ==UserScript==
// @name         Chess AI
// @namespace    github.com/longkidkoolstar
// @version      4.1.5
// @description  Chess.com Bot/Cheat that finds the best move with evaluation bar and ELO control!
// @author       longkidkoolstar
// @license      none
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @icon         https://i.imgur.com/Z30WgSo.png
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.getResourceText
// @grant       GM.download
// @resource    stockfish.js        https://raw.githubusercontent.com/longkidkoolstar/stockfish/refs/heads/main/stockfish.js
// @require     https://greasyfork.org/scripts/445697/code/index.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @connect     localhost
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/531171/Chess%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/531171/Chess%20AI.meta.js
// ==/UserScript==


const currentVersion = '4.1.5'; // Updated version number

function main() {

    var stockfishObjectURL;
    var engine = document.engine = {};
    var myVars = document.myVars = {};
    myVars.autoMovePiece = false;
    myVars.autoRun = false;
    myVars.delay = 0.1;
    myVars.eloRating = 1500; // Default ELO rating
    myVars.currentEvaluation = 0; // Current evaluation value
    myVars.useVirtualChessboard = false; // Default to not using virtual chessboard
    myVars.persistentHighlights = true; // Default to persistent highlights
    myVars.moveIndicatorType = 'highlights'; // Default to highlights instead of arrows
    myVars.showMultipleMoves = false; // Default to showing only the best move
    myVars.numberOfMovesToShow = 3; // Default number of top moves to show
    myVars.useMulticolorMoves = false; // Default to using opacity for move strength
    myVars.useExternalWindow = false; // Default to not using external window
    myVars.externalWindowOpen = false; // Track if external window is open
    myVars.externalWindowRef = null; // Reference to external window
    myVars.serverConnected = false; // Track if connected to local server
    myVars.moveIndicatorLocation = 'main'; // Where to show move indicators: 'main', 'external', or 'both'
    myVars.disableMainControls = false; // Option to disable main controls when connected to external window
    myVars.autoQueue = false; // Default to not auto-queuing new games
    myVars.evalAlpha = 0.35;
    myVars.evalEMA = 0;
    myVars.evalBarCurrentPercent = 50;
    myVars.evalBarTargetPercent = 50;
    myVars.evalBarAnimationFrame = null;
    myVars.winProbSlope = 1.4;
    myVars.evalHistory = [];
    myVars.evalHistoryMaxPoints = 60;
    // Clock synchronization variables
    myVars.clockSync = false; // Default to not using clock synchronization
    myVars.lastOpponentTime = null; // Last recorded opponent time in seconds
    myVars.lastPlayerTime = null; // Last recorded player time in seconds
    myVars.clockSyncMinDelay = 0.5; // Minimum delay in seconds when using clock sync
    myVars.clockSyncMaxDelay = 10; // Maximum delay in seconds when using clock sync
    myVars.clockSyncExactMatch = false; // Default to not using exact time matching
    myVars.clockSyncCalculationTime = 0.2; // Estimated time for move calculation and execution
    // Time pressure variables
    myVars.clockSyncTimePressure = true; // Default to enabling time pressure override
    myVars.clockSyncTimePressureThreshold = 20; // Seconds threshold for time pressure mode
    myVars.clockSyncTimePressureActive = false; // Track if time pressure mode is currently active
    // Default colors for multicolor mode
    myVars.moveColors = {
        1: '#F44336', // Red for best move
        2: '#FF9800', // Orange for 2nd best
        3: '#FFEB3B', // Yellow for 3rd best
        4: '#4CAF50', // Green for 4th best
        5: '#2196F3'  // Blue for 5th best
    }
    // Opening display variables
    myVars.currentOpening = null; // Current detected opening information
    myVars.showOpeningDisplay = true; // Whether to show opening names
    var myFunctions = document.myFunctions = {};

    // Clock synchronization functions
    myFunctions.parseTimeString = function(timeString) {
        if (!timeString || typeof timeString !== 'string') return null;

        // Remove any non-digit, non-colon, and non-decimal point characters
        const cleanTime = timeString.replace(/[^\d:.]/g, '');

        // Handle different time formats: MM:SS, H:MM:SS, M:SS, MM:SS.s, etc.
        const parts = cleanTime.split(':');
        let totalSeconds = 0;

        if (parts.length === 2) {
            // MM:SS or MM:SS.s format
            const minutes = parseInt(parts[0]) || 0;
            const secondsPart = parts[1];

            // Handle fractional seconds (e.g., "01.6" -> 1.6 seconds)
            const seconds = parseFloat(secondsPart) || 0;
            totalSeconds = minutes * 60 + seconds;
        } else if (parts.length === 3) {
            // H:MM:SS or H:MM:SS.s format
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;
            const secondsPart = parts[2];

            // Handle fractional seconds
            const seconds = parseFloat(secondsPart) || 0;
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
        } else if (parts.length === 1) {
            // Just seconds (could be fractional)
            totalSeconds = parseFloat(parts[0]) || 0;
        }

        return totalSeconds > 0 ? totalSeconds : null;
    };

    myFunctions.getClockTimes = function() {
        try {
            console.log('Clock Sync: Attempting to detect clocks...');

            // Try multiple possible selectors for chess.com clocks
            const clockSelectors = [
                '.clock-time-monospace[role="timer"]',
                '.clock-time-monospace',
                '.clock-component .clock-time-monospace',
                '#board-layout-player-top .clock-time-monospace',
                '#board-layout-player-bottom .clock-time-monospace'
            ];

            let allClockElements = [];

            // Try each selector to find clock elements
            for (const selector of clockSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`Clock Sync: Found ${elements.length} clock elements with selector: ${selector}`);
                    allClockElements = Array.from(elements);
                    break;
                }
            }

            if (allClockElements.length === 0) {
                console.log('Clock Sync: No clock elements found with any selector');
                return {
                    opponentTime: null,
                    playerTime: null,
                    found: false
                };
            }

            // Log all found clock elements for debugging
            allClockElements.forEach((element, index) => {
                const timeText = element.textContent || element.innerText;
                const parentInfo = element.closest('.player-component, .clock-component, [class*="player"], [class*="clock"]');
                const parentClass = parentInfo ? parentInfo.className : 'no parent found';
                console.log(`Clock Sync: Clock ${index}: "${timeText}" (parent: ${parentClass})`);
            });

            let opponentTime = null;
            let playerTime = null;

            if (allClockElements.length >= 2) {
                // Assume first clock is opponent (top), second is player (bottom)
                const opponentTimeText = allClockElements[0].textContent || allClockElements[0].innerText;
                const playerTimeText = allClockElements[1].textContent || allClockElements[1].innerText;

                console.log(`Clock Sync: Raw opponent time: "${opponentTimeText}"`);
                console.log(`Clock Sync: Raw player time: "${playerTimeText}"`);

                opponentTime = myFunctions.parseTimeString(opponentTimeText);
                playerTime = myFunctions.parseTimeString(playerTimeText);

                console.log(`Clock Sync: Parsed opponent time: ${opponentTime}s`);
                console.log(`Clock Sync: Parsed player time: ${playerTime}s`);
            } else if (allClockElements.length === 1) {
                // Only one clock found - could be either player
                const timeText = allClockElements[0].textContent || allClockElements[0].innerText;
                console.log(`Clock Sync: Only one clock found: "${timeText}"`);

                // Try to determine which player's clock this is based on parent elements
                const parentElement = allClockElements[0].closest('.player-component, [class*="player"], [class*="top"], [class*="bottom"]');
                if (parentElement) {
                    const parentClass = parentElement.className.toLowerCase();
                    console.log(`Clock Sync: Clock parent class: ${parentClass}`);

                    if (parentClass.includes('top') || parentClass.includes('opponent')) {
                        opponentTime = myFunctions.parseTimeString(timeText);
                        console.log(`Clock Sync: Identified as opponent clock: ${opponentTime}s`);
                    } else if (parentClass.includes('bottom') || parentClass.includes('player')) {
                        playerTime = myFunctions.parseTimeString(timeText);
                        console.log(`Clock Sync: Identified as player clock: ${playerTime}s`);
                    }
                }
            }

            const result = {
                opponentTime: opponentTime,
                playerTime: playerTime,
                found: opponentTime !== null || playerTime !== null
            };

            console.log('Clock Sync: Final result:', result);
            return result;

        } catch (error) {
            console.log('Clock Sync: Detection error:', error);
            return {
                opponentTime: null,
                playerTime: null,
                found: false
            };
        }
    };

    myFunctions.calculateClockSyncDelay = function() {
        console.log('Clock Sync: calculateClockSyncDelay called');
        console.log('Clock Sync: clockSync enabled:', myVars.clockSync);
        console.log('Clock Sync: exactMatch mode:', myVars.clockSyncExactMatch);
        console.log('Clock Sync: timePressure enabled:', myVars.clockSyncTimePressure);

        if (!myVars.clockSync) {
            console.log('Clock Sync: Feature disabled, returning 0 delay');
            return 0;
        }

        console.log('Clock Sync: Getting clock times...');
        const clockData = myFunctions.getClockTimes();

        if (!clockData.found) {
            console.log('Clock Sync: No clocks found, using minimal delay');
            return myVars.clockSyncMinDelay * 1000; // Convert to milliseconds
        }

        if (clockData.opponentTime === null || clockData.playerTime === null) {
            console.log('Clock Sync: Incomplete clock data - opponent:', clockData.opponentTime, 'player:', clockData.playerTime);
            console.log('Clock Sync: Using minimal delay due to incomplete data');
            return myVars.clockSyncMinDelay * 1000; // Convert to milliseconds
        }

        const opponentTime = clockData.opponentTime;
        const playerTime = clockData.playerTime;

        console.log(`Clock Sync: Final comparison - Opponent: ${opponentTime}s, Player: ${playerTime}s`);

        // Store current times for reference
        myVars.lastOpponentTime = opponentTime;
        myVars.lastPlayerTime = playerTime;

        // Check for time pressure conditions
        const timePressureThreshold = myVars.clockSyncTimePressureThreshold;
        const opponentInTimePressure = opponentTime <= timePressureThreshold;
        const playerInTimePressure = playerTime <= timePressureThreshold;
        const anyPlayerInTimePressure = opponentInTimePressure || playerInTimePressure;

        console.log(`Clock Sync: Time pressure check - Threshold: ${timePressureThreshold}s`);
        console.log(`Clock Sync: Opponent in time pressure: ${opponentInTimePressure} (${opponentTime}s)`);
        console.log(`Clock Sync: Player in time pressure: ${playerInTimePressure} (${playerTime}s)`);

        // Update time pressure status and provide feedback
        const wasTimePressureActive = myVars.clockSyncTimePressureActive;
        myVars.clockSyncTimePressureActive = anyPlayerInTimePressure && myVars.clockSyncTimePressure;

        if (myVars.clockSyncTimePressureActive && !wasTimePressureActive) {
            console.log('🚨 Clock Sync: TIME PRESSURE MODE ACTIVATED - Switching to minimum delay');
        } else if (!myVars.clockSyncTimePressureActive && wasTimePressureActive) {
            console.log('✅ Clock Sync: Time pressure mode deactivated - Resuming normal timing');
        }

        // Time pressure override - use minimum delay when enabled and triggered
        if (myVars.clockSyncTimePressure && anyPlayerInTimePressure) {
            const emergencyDelay = Math.random() * 0.4 + 0.1; // Random between 0.1-0.5s
            console.log(`Clock Sync: ⚡ TIME PRESSURE OVERRIDE - Using emergency delay: ${emergencyDelay.toFixed(2)}s`);
            return emergencyDelay * 1000; // Convert to milliseconds
        }

        let delay = 0;

        if (myVars.clockSyncExactMatch) {
            // Exact Match Mode: Calculate precise delay to match opponent's time
            console.log('Clock Sync: Using Exact Match mode');

            const timeDifference = playerTime - opponentTime;
            const calculationTime = myVars.clockSyncCalculationTime;

            console.log(`Clock Sync: Time difference: ${timeDifference}s (player - opponent)`);
            console.log(`Clock Sync: Estimated calculation time: ${calculationTime}s`);

            if (timeDifference <= 0) {
                // Opponent has equal or more time - use minimal delay to avoid going below
                delay = Math.random() * 0.4 + 0.1; // Random between 0.1-0.5s
                console.log(`Clock Sync: Opponent has equal/more time, using minimal delay: ${delay.toFixed(2)}s`);
            } else {
                // Player has more time - calculate exact delay to match opponent
                // Target: after delay, both players should have approximately equal time
                // Formula: delay = timeDifference - calculationTime
                delay = Math.max(0.1, timeDifference - calculationTime);

                // Calculate what the times will be after the delay
                const projectedPlayerTime = playerTime - delay - calculationTime;
                const projectedOpponentTime = opponentTime; // Opponent's time doesn't change during our move

                console.log(`Clock Sync: Calculated exact delay: ${delay.toFixed(2)}s`);
                console.log(`Clock Sync: Projected times after move - Player: ${projectedPlayerTime.toFixed(1)}s, Opponent: ${projectedOpponentTime.toFixed(1)}s`);
                console.log(`Clock Sync: Projected difference: ${(projectedPlayerTime - projectedOpponentTime).toFixed(1)}s`);

                // Fallback check: if delay would be too large (>30s), cap it
                const maxReasonableDelay = 30;
                if (delay > maxReasonableDelay) {
                    console.log(`Clock Sync: Delay too large (${delay.toFixed(1)}s), capping at ${maxReasonableDelay}s`);
                    delay = maxReasonableDelay;
                }

                // Ensure minimum delay for natural feel
                delay = Math.max(0.1, delay);
            }

        } else {
            // Standard Range Mode: Use configurable delay ranges
            console.log('Clock Sync: Using Standard Range mode');

            if (opponentTime > playerTime) {
                // Opponent has more time - move quickly
                delay = myVars.clockSyncMinDelay;
                console.log(`Clock Sync: Opponent has more time (${opponentTime}s vs ${playerTime}s), moving quickly with ${delay}s delay`);
            } else if (opponentTime < playerTime) {
                // Player has more time - add delay to match opponent's pace
                const timeDifference = playerTime - opponentTime;

                // Calculate delay based on time difference
                // More time difference = longer delay (up to max)
                const delayFactor = Math.min(timeDifference / 60, 1); // Normalize to 1 minute difference
                delay = myVars.clockSyncMinDelay + (delayFactor * (myVars.clockSyncMaxDelay - myVars.clockSyncMinDelay));

                console.log(`Clock Sync: Player has ${timeDifference}s more time, delay factor: ${delayFactor.toFixed(2)}, calculated delay: ${delay.toFixed(1)}s`);
            } else {
                // Times are equal - use moderate delay
                delay = (myVars.clockSyncMinDelay + myVars.clockSyncMaxDelay) / 2;
                console.log(`Clock Sync: Times are equal (${opponentTime}s), using moderate delay: ${delay}s`);
            }

            // Ensure delay is within bounds for standard mode
            const originalDelay = delay;
            delay = Math.max(myVars.clockSyncMinDelay, Math.min(myVars.clockSyncMaxDelay, delay));

            if (originalDelay !== delay) {
                console.log(`Clock Sync: Delay clamped from ${originalDelay.toFixed(1)}s to ${delay.toFixed(1)}s (bounds: ${myVars.clockSyncMinDelay}s - ${myVars.clockSyncMaxDelay}s)`);
            }
        }

        const delayMs = delay * 1000;
        console.log(`Clock Sync: Final delay: ${delay.toFixed(2)}s (${delayMs}ms)`);

        return delayMs; // Convert to milliseconds
    };

    // Function to download the Python server using GM.download with fallback
    myFunctions.downloadServer = function() {
        const serverUrl = 'https://raw.githubusercontent.com/longkidkoolstar/Chess-AI/refs/heads/main/chess_ai_server.py';
        const filename = 'chess_ai_server.py';

        // Show download notification
        const notification = document.createElement('div');
        notification.textContent = 'Downloading server file...';
        notification.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2196F3;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Try to use GM.download if available
        try {
            if (typeof GM.download === 'function') {
                console.log('Using GM.download to download server file');

                GM.download({
                    url: serverUrl,
                    name: filename,
                    onload: function() {
                        // Update notification to show success
                        notification.textContent = 'Server file downloaded successfully!';
                        notification.style.backgroundColor = '#4CAF50';

                        setTimeout(() => {
                            notification.style.opacity = '0';
                            setTimeout(() => {
                                document.body.removeChild(notification);
                            }, 300);
                        }, 2000);
                    },
                    onerror: function() {
                        console.error('GM.download failed, falling back to direct download');
                        // Fall back to direct download
                        fallbackDownload();
                    }
                });
            } else {
                console.log('GM.download not available, using fallback method');
                fallbackDownload();
            }
        } catch (error) {
            console.error('Error using GM.download:', error);
            fallbackDownload();
        }

        // Fallback download method using window.open
        function fallbackDownload() {
            // Open the URL in a new tab
            window.open(serverUrl, '_blank');

            // Update notification to show instructions
            notification.innerHTML = 'Please save the file as <strong>chess_ai_server.py</strong> when prompted';
            notification.style.backgroundColor = '#FF9800';

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 5000);
        }
    };

    // Create evaluation bar
    var evalBar = null;
    var evalText = null;

    stop_b = stop_w = 0;
    s_br = s_br2 = s_wr = s_wr2 = 0;
    obs = "";
    myFunctions.rescan = function(lev) {
        var ari = $("chess-board")
        .find(".piece")
        .map(function() {
            return this.className;
        })
        .get();
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        function removeWord(arr, word) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].replace(word, '');
            }
        }
        removeWord(ari, 'square-');
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        for (var i = 0; i < jack.length; i++) {
            jack[i] = jack[i].replace('br', 'r')
                .replace('bn', 'n')
                .replace('bb', 'b')
                .replace('bq', 'q')
                .replace('bk', 'k')
                .replace('bb', 'b')
                .replace('bn', 'n')
                .replace('br', 'r')
                .replace('bp', 'p')
                .replace('wp', 'P')
                .replace('wr', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('br', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('wq', 'Q')
                .replace('wk', 'K')
                .replace('wb', 'B')
        }
        str2 = "";
        var count = 0,
            str = "";
        for (var j = 8; j > 0; j--) {
            for (var i = 1; i < 9; i++) {
                (str = (jack.find(el => el.includes([i] + [j])))) ? str = str.replace(/[^a-zA-Z]+/g, ''): str = "";
                if (str == "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString()
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
        //str2=str2+" KQkq - 0"
        color = "";
        wk = wq = bk = bq = "0";
        const move = $('vertical-move-list')
        .children();
        if (move.length < 2) {
            stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
        }
        if (stop_b != 1) {
            if (move.find(".black.node:contains('K')")
                .length) {
                bk = "";
                bq = "";
                stop_b = 1;
                console.log('debug secb');
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stop_b != 1)(bk = (move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "k") ? (bq = (move.find(".black.node:contains('O-O-O')")
                                                             .length) ? bk = "" : "q") : bq = "";
        if (s_br != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                bq = "";
                s_br = 1
            }
        } else bq = "";
        if (s_br2 != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                bk = "";
                s_br2 = 1
            }
        } else bk = "";
        if (stop_b == 0) {
            if (s_br == 0)
                if (move.find(".white.node:contains('xa8')")
                    .length > 0) {
                    bq = "";
                    s_br = 1;
                    console.log('debug b castle_r');
                }
            if (s_br2 == 0)
                if (move.find(".white.node:contains('xh8')")
                    .length > 0) {
                    bk = "";
                    s_br2 = 1;
                    console.log('debug b castle_l');
                }
        }
        if (stop_w != 1) {
            if (move.find(".white.node:contains('K')")
                .length) {
                wk = "";
                wq = "";
                stop_w = 1;
                console.log('debug secw');
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stop_w != 1)(wk = (move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "K") ? (wq = (move.find(".white.node:contains('O-O-O')")
                                                             .length) ? wk = "" : "Q") : wq = "";
        if (s_wr != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                wq = "";
                s_wr = 1
            }
        } else wq = "";
        if (s_wr2 != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                wk = "";
                s_wr2 = 1
            }
        } else wk = "";
        if (stop_w == 0) {
            if (s_wr == 0)
                if (move.find(".black.node:contains('xa1')")
                    .length > 0) {
                    wq = "";
                    s_wr = 1;
                    console.log('debug w castle_l');
                }
            if (s_wr2 == 0)
                if (move.find(".black.node:contains('xh1')")
                    .length > 0) {
                    wk = "";
                    s_wr2 = 1;
                    console.log('debug w castle_r');
                }
        }
        if ($('.coordinates')
            .children()
            .first()
            .text() == 1) {
            str2 = str2 + " b " + wk + wq + bk + bq;
            color = "white";
        } else {
            str2 = str2 + " w " + wk + wq + bk + bq;
            color = "black";
        }
        //console.log(str2);
        return str2;
    }
    myFunctions.calculateHumanLikeDelay = function(skillLevel) {
        let minDelay, maxDelay;

        switch(skillLevel) {
            case 'beginner': minDelay = 3.0; maxDelay = 10.0; break;
            case 'casual': minDelay = 2.0; maxDelay = 7.0; break;
            case 'intermediate': minDelay = 1.5; maxDelay = 5.0; break;
            case 'advanced': minDelay = 1.0; maxDelay = 3.5; break;
            case 'expert': minDelay = 0.6; maxDelay = 2.0; break;
            default: minDelay = 1.5; maxDelay = 5.0;
        }

        // Opening phase speedup (first 10 moves)
        // Humans typically play openings quickly from memory
        try {
            if (typeof board !== 'undefined' && board && board.game) {
                // Try to get move number if available, otherwise assume it's opening if history is short
                let moveNumber = -1;
                if (typeof board.game.getMoveNumber === 'function') {
                    moveNumber = board.game.getMoveNumber();
                }
                
                // If we are in the opening phase (first 8-10 moves)
                if (moveNumber > 0 && moveNumber <= 10) {
                    console.log(`Opening phase (move ${moveNumber}) - speeding up`);
                    // Significant speedup for openings - strictly under 1 second as requested
                    maxDelay = 0.8; 
                    minDelay = 0.1;
                }
            }
        } catch(e) {
            console.log("Error checking opening phase:", e);
        }

        // Check if move is obvious (forced or much better than others)
        let isObvious = false;
        if (myVars.topMoves && myVars.topMoves.length > 0) {
            if (myVars.topMoves.length === 1) {
                isObvious = true; // Only one legal move
            } else if (myVars.topMoves.length >= 2) {
                const bestEval = myVars.topMoves[0].evaluation;
                const secondEval = myVars.topMoves[1].evaluation;
                const diff = Math.abs(bestEval - secondEval);

                // If evaluation difference is significant, it's an obvious choice
                if (diff > 1.5) isObvious = true;

                // Check for Mate in 1 or 2
                if (myVars.topMoves[0].isMate) {
                     const movesToMate = Math.abs(bestEval); // usually stored as +/- moves
                     if (movesToMate <= 2) isObvious = true;
                }
            }
        }

        // Speed up for obvious moves
        if (isObvious) {
            console.log("Move identified as obvious/forced - speeding up");
            maxDelay *= 0.4;
            minDelay = Math.max(0.1, minDelay * 0.4);
        }

        let delay = Math.random() * (maxDelay - minDelay) + minDelay;
        return delay;
    };

    myFunctions.color = function(dat){
        response = dat;
        var res1 = response.substring(0, 2);
        var res2 = response.substring(2, 4);

        // Store the best move for server updates
        myVars.bestMove = res1 + res2;
        console.log('Best move set to:', myVars.bestMove);

        // Add the move to history
        const moveNotation = res1 + '-' + res2;
        myFunctions.addMoveToHistory(moveNotation, myVars.currentEvaluation, lastValue);

        // Clear any existing highlights and arrows before adding new ones
        myFunctions.clearHighlights();
        myFunctions.clearArrows();

        // Also clear virtual chessboard indicators
        myFunctions.clearVirtualMoveIndicators();

        // Update the server if external window is open
        if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
            myFunctions.sendServerUpdate();
        }

        // Determine if we should auto move
        // Case 1: Human Mode is OFF, and Standard Auto Move is ON
        // Case 2: Human Mode is ON, and Human Auto Move is ON
        let shouldAutoMove = false;
        let isHumanAutoMove = false;

        if (myVars.humanMode && myVars.humanMode.active) {
            // Human Mode Active: Check Human Auto Move toggle
            if (myVars.humanAutoMove === true) {
                shouldAutoMove = true;
                isHumanAutoMove = true;
            }
        } else {
            // Standard Mode: Check Standard Auto Move toggle
            if (myVars.autoMove === true) {
                shouldAutoMove = true;
                isHumanAutoMove = false;
            }
        }

        if(shouldAutoMove){
            if (isHumanAutoMove) {
                // Human Auto Move Logic
                const skillLevel = myVars.humanMode.level || 'intermediate';
                const thinkingTime = myFunctions.calculateHumanLikeDelay(skillLevel);
                console.log(`Human Auto Move (${skillLevel}): Delaying for ${thinkingTime.toFixed(1)} seconds...`);

                setTimeout(() => {
                    myFunctions.movePiece(res1, res2);
                    // Reset canGo for next turn
                    setTimeout(() => { canGo = true; }, 500);
                }, thinkingTime * 1000);

            } else {
                // Standard Auto Move Logic
                // Calculate delay based on clock synchronization if enabled
                const clockSyncDelay = myFunctions.calculateClockSyncDelay();

                if (clockSyncDelay > 0) {
                    console.log(`Auto move: Applying clock sync delay of ${clockSyncDelay/1000}s`);
                    setTimeout(() => {
                        myFunctions.movePiece(res1, res2);
                        // After auto move, we need to reset canGo to allow auto run on next turn
                        setTimeout(() => {
                            canGo = true;
                        }, 500);
                    }, clockSyncDelay);
                } else {
                    myFunctions.movePiece(res1, res2);
                    // After auto move, we need to reset canGo to allow auto run on next turn
                    setTimeout(() => {
                        canGo = true;
                    }, 500);
                }
            }
        }
        isThinking = false;

        // Store the best move for reference
        myVars.lastMove = {
            from: res1,
            to: res2,
            algebraic: moveNotation
        };

        // Only show move indicators if the option is enabled
        if(myVars.showArrows !== false) {
            // Debug information
            console.log("Multiple moves enabled:", myVars.showMultipleMoves);
            console.log("Top moves array:", myVars.topMoves);
            console.log("Virtual chessboard enabled:", myVars.useVirtualChessboard);

            // If virtual chessboard is enabled, update it with the current position
            if (myVars.useVirtualChessboard) {
                // Make sure the virtual chessboard container is visible
                const virtualChessboardContainer = document.getElementById('virtualChessboardContainer');
                if (virtualChessboardContainer) {
                    virtualChessboardContainer.style.display = 'block';
                }

                // Update the virtual chessboard with the current position
                myFunctions.updateVirtualChessboard();

                // Show move indicators on the virtual chessboard
                if (myVars.showMultipleMoves && myVars.topMoves && myVars.topMoves.length > 1) {
                    console.log("Showing multiple moves on virtual chessboard:", myVars.topMoves.length);

                    // Show multiple moves with varying opacity on virtual chessboard
                    const movesToShow = Math.min(myVars.numberOfMovesToShow, myVars.topMoves.length);
                    const bestEval = myVars.topMoves[0].evaluation;

                    for (let i = 0; i < movesToShow; i++) {
                        const moveInfo = myVars.topMoves[i];
                        const move = moveInfo.move;

                        // Skip if move is undefined
                        if (!move) continue;

                        const moveRes1 = move.substring(0, 2);
                        const moveRes2 = move.substring(2, 4);

                        // Variables for styling
                        let opacity = 0.9;
                        let moveColor = null;

                        if (myVars.useMulticolorMoves) {
                            // Use different colors for each move
                            moveColor = myVars.moveColors[i + 1] || getDefaultMoveColor(i);
                            opacity = 0.9;
                        } else {
                            // Calculate opacity based on relative strength
                            if (i > 0) {
                                if (!moveInfo.isMate && !myVars.topMoves[0].isMate) {
                                    const relativeStrength = Math.max(0, 1 - Math.abs(bestEval - moveInfo.evaluation) / 3);
                                    opacity = 0.3 + (relativeStrength * 0.6);
                                } else {
                                    opacity = 0.9 - (i * 0.15);
                                }
                            }
                            opacity = Math.max(0.3, Math.min(0.9, opacity));
                        }

                        // Helper function to get default color for a move index
                        function getDefaultMoveColor(index) {
                            const defaultColors = [
                                '#F44336', // Red for best move
                                '#FF9800', // Orange for 2nd best
                                '#FFEB3B', // Yellow for 3rd best
                                '#4CAF50', // Green for 4th best
                                '#2196F3'  // Blue for 5th best
                            ];
                            return defaultColors[index] || '#9C27B0'; // Default to purple if out of range
                        }

                        // Get the color to use
                        let highlightColor = 'rgb(235, 97, 80)'; // Default red color

                        if (myVars.useMulticolorMoves) {
                            // Convert hex color to RGB for highlights
                            const moveColor = myVars.moveColors[i + 1] || getDefaultMoveColor(i);
                            highlightColor = hexToRgb(moveColor);
                        }

                        // Helper function to convert hex color to RGB format
                        function hexToRgb(hex) {
                            // Remove # if present
                            hex = hex.replace('#', '');

                            // Parse the hex values
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);

                            // Return RGB format
                            return `rgb(${r}, ${g}, ${b})`;
                        }

                        // Show the move on the virtual chessboard
                        myFunctions.showVirtualMoveIndicator(moveRes1, moveRes2, opacity, highlightColor);
                    }
                } else {
                    console.log("Showing single move on virtual chessboard");
                    // Show just the best move on virtual chessboard
                    myFunctions.showVirtualMoveIndicator(res1, res2);
                }
            } else {
                // Hide the virtual chessboard container
                const virtualChessboardContainer = document.getElementById('virtualChessboardContainer');
                if (virtualChessboardContainer) {
                    virtualChessboardContainer.style.display = 'none';
                }

                // Show move indicators on the main board as before
                if (myVars.showMultipleMoves && myVars.topMoves && myVars.topMoves.length > 1) {
                    console.log("Showing multiple moves:", myVars.topMoves.length);
                    // Show multiple moves with varying opacity
                    myFunctions.showMultipleMoveIndicators();
                } else {
                    console.log("Showing single move - reason:",
                        !myVars.showMultipleMoves ? "Multiple moves disabled" :
                        !myVars.topMoves ? "No top moves array" :
                        myVars.topMoves.length <= 1 ? "Not enough moves in array" : "Unknown");
                    // Show just the best move (original behavior)
                    myFunctions.showSingleMoveIndicator(res1, res2);
                }
            }
        }
    }

    // Function to show a single move indicator (original behavior)
    myFunctions.showSingleMoveIndicator = function(res1, res2) {
        // Check if player is playing as black
        const isPlayingAsBlack = board.game.getPlayingAs() === 'black';

        // Convert algebraic notation to numeric coordinates
        // The conversion depends on whether we're playing as white or black
        let fromSquare, toSquare;

        if (isPlayingAsBlack) {
            // Inverted mapping for black perspective
            fromSquare = res1.replace(/^a/, "8")
                .replace(/^b/, "7")
                .replace(/^c/, "6")
                .replace(/^d/, "5")
                .replace(/^e/, "4")
                .replace(/^f/, "3")
                .replace(/^g/, "2")
                .replace(/^h/, "1");
            toSquare = res2.replace(/^a/, "8")
                .replace(/^b/, "7")
                .replace(/^c/, "6")
                .replace(/^d/, "5")
                .replace(/^e/, "4")
                .replace(/^f/, "3")
                .replace(/^g/, "2")
                .replace(/^h/, "1");
        } else {
            // Standard mapping for white perspective
            fromSquare = res1.replace(/^a/, "1")
                .replace(/^b/, "2")
                .replace(/^c/, "3")
                .replace(/^d/, "4")
                .replace(/^e/, "5")
                .replace(/^f/, "6")
                .replace(/^g/, "7")
                .replace(/^h/, "8");
            toSquare = res2.replace(/^a/, "1")
                .replace(/^b/, "2")
                .replace(/^c/, "3")
                .replace(/^d/, "4")
                .replace(/^e/, "5")
                .replace(/^f/, "6")
                .replace(/^g/, "7")
                .replace(/^h/, "8");
        }

        // Use arrows or highlights based on user preference
        if (myVars.moveIndicatorType === 'arrows') {
            // Draw an arrow from the source to the destination square
            // Pass the converted square coordinates to ensure consistency with highlights
            myFunctions.drawArrow(fromSquare, toSquare, myVars.persistentHighlights);
        } else {
            // Use the original highlighting method
            if (myVars.persistentHighlights) {
                // Add highlights with custom class for easier removal later
                $(board.nodeName)
                    .prepend('<div class="highlight square-' + toSquare + ' bro persistent-highlight" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>');

                $(board.nodeName)
                    .prepend('<div class="highlight square-' + fromSquare + ' bro persistent-highlight" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>');
            } else {
                // Use the original temporary highlights
                $(board.nodeName)
                    .prepend('<div class="highlight square-' + toSquare + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
                    .children(':first')
                    .delay(1800)
                    .queue(function() {
                    $(this)
                        .remove();
                });

                $(board.nodeName)
                    .prepend('<div class="highlight square-' + fromSquare + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
                    .children(':first')
                    .delay(1800)
                    .queue(function() {
                    $(this)
                        .remove();
                });
            }
        }
    }

    // Function to show multiple move indicators with varying opacity or colors
    myFunctions.showMultipleMoveIndicators = function() {
        // Limit to the number of moves specified in settings
        const movesToShow = Math.min(myVars.numberOfMovesToShow, myVars.topMoves.length);

        console.log("Showing multiple moves:", movesToShow, "out of", myVars.topMoves.length, "available");
        console.log("Using multicolor mode:", myVars.useMulticolorMoves);

        // Get the best evaluation for normalization
        const bestEval = myVars.topMoves[0].evaluation;

        // Check if player is playing as black
        const isPlayingAsBlack = board.game.getPlayingAs() === 'black';

        // Show each move with opacity based on relative strength or different colors
        for (let i = 0; i < movesToShow; i++) {
            const moveInfo = myVars.topMoves[i];
            const move = moveInfo.move;

            // Skip if move is undefined
            if (!move) continue;

            const res1 = move.substring(0, 2);
            const res2 = move.substring(2, 4);

            // Variables for styling
            let opacity = 0.9;
            let moveColor = null;

            if (myVars.useMulticolorMoves) {
                // Use different colors for each move
                // Get the color from settings, or use default if not set
                moveColor = myVars.moveColors[i + 1] || getDefaultMoveColor(i);

                // Use full opacity for multicolor mode
                opacity = 0.9;
            } else {
                // Calculate opacity based on relative strength
                // Best move gets 0.9 opacity, others get progressively lower
                if (i > 0) {
                    // For non-mate positions, calculate relative strength
                    if (!moveInfo.isMate && !myVars.topMoves[0].isMate) {
                        // Calculate relative strength (0.0 to 1.0)
                        const relativeStrength = Math.max(0, 1 - Math.abs(bestEval - moveInfo.evaluation) / 3);
                        // Scale opacity from 0.3 to 0.9 based on strength
                        opacity = 0.3 + (relativeStrength * 0.6);
                    } else {
                        // For mate positions, use fixed opacity values
                        opacity = 0.9 - (i * 0.15);
                    }
                }

                // Ensure opacity is within reasonable bounds
                opacity = Math.max(0.3, Math.min(0.9, opacity));
            }

            // Helper function to get default color for a move index
            function getDefaultMoveColor(index) {
                const defaultColors = [
                    '#F44336', // Red for best move
                    '#FF9800', // Orange for 2nd best
                    '#FFEB3B', // Yellow for 3rd best
                    '#4CAF50', // Green for 4th best
                    '#2196F3'  // Blue for 5th best
                ];
                return defaultColors[index] || '#9C27B0'; // Default to purple if out of range
            }

            // Convert algebraic notation to numeric coordinates
            let fromSquare, toSquare;

            if (isPlayingAsBlack) {
                // Inverted mapping for black perspective
                fromSquare = res1.replace(/^a/, "8")
                    .replace(/^b/, "7")
                    .replace(/^c/, "6")
                    .replace(/^d/, "5")
                    .replace(/^e/, "4")
                    .replace(/^f/, "3")
                    .replace(/^g/, "2")
                    .replace(/^h/, "1");
                toSquare = res2.replace(/^a/, "8")
                    .replace(/^b/, "7")
                    .replace(/^c/, "6")
                    .replace(/^d/, "5")
                    .replace(/^e/, "4")
                    .replace(/^f/, "3")
                    .replace(/^g/, "2")
                    .replace(/^h/, "1");
            } else {
                // Standard mapping for white perspective
                fromSquare = res1.replace(/^a/, "1")
                    .replace(/^b/, "2")
                    .replace(/^c/, "3")
                    .replace(/^d/, "4")
                    .replace(/^e/, "5")
                    .replace(/^f/, "6")
                    .replace(/^g/, "7")
                    .replace(/^h/, "8");
                toSquare = res2.replace(/^a/, "1")
                    .replace(/^b/, "2")
                    .replace(/^c/, "3")
                    .replace(/^d/, "4")
                    .replace(/^e/, "5")
                    .replace(/^f/, "6")
                    .replace(/^g/, "7")
                    .replace(/^h/, "8");
            }

            // Get the color to use (either from multicolor settings or default)
            let highlightColor = 'rgb(235, 97, 80)'; // Default red color

            if (myVars.useMulticolorMoves) {
                // Convert hex color to RGB for highlights
                const moveColor = myVars.moveColors[i + 1] || getDefaultMoveColor(i);
                highlightColor = hexToRgb(moveColor);
            }

            // Helper function to convert hex color to RGB format
            function hexToRgb(hex) {
                // Remove # if present
                hex = hex.replace('#', '');

                // Parse the hex values
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);

                // Return RGB format
                return `rgb(${r}, ${g}, ${b})`;
            }

            // Use arrows or highlights based on user preference
            if (myVars.moveIndicatorType === 'arrows') {
                // Draw an arrow with the calculated opacity and color
                myFunctions.drawArrow(fromSquare, toSquare, myVars.persistentHighlights, opacity, myVars.useMulticolorMoves ? myVars.moveColors[i + 1] : null);
            } else {
                // Use highlighting with the calculated opacity and color
                if (myVars.persistentHighlights) {
                    // Add highlights with custom class for easier removal later
                    $(board.nodeName)
                        .prepend('<div class="highlight square-' + toSquare + ' bro persistent-highlight" style="background-color: ' + highlightColor + '; opacity: ' + opacity + ';" data-test-element="highlight"></div>');

                    $(board.nodeName)
                        .prepend('<div class="highlight square-' + fromSquare + ' bro persistent-highlight" style="background-color: ' + highlightColor + '; opacity: ' + opacity + ';" data-test-element="highlight"></div>');
                } else {
                    // Use temporary highlights with the calculated opacity and color
                    $(board.nodeName)
                        .prepend('<div class="highlight square-' + toSquare + ' bro" style="background-color: ' + highlightColor + '; opacity: ' + opacity + ';" data-test-element="highlight"></div>')
                        .children(':first')
                        .delay(1800)
                        .queue(function() {
                        $(this)
                            .remove();
                    });

                    $(board.nodeName)
                        .prepend('<div class="highlight square-' + fromSquare + ' bro" style="background-color: ' + highlightColor + '; opacity: ' + opacity + ';" data-test-element="highlight"></div>')
                        .children(':first')
                        .delay(1800)
                        .queue(function() {
                        $(this)
                            .remove();
                    });
                }
            }
        }
    }

    // Add a function to clear highlights
    myFunctions.clearHighlights = function() {
        // Remove all persistent highlights
        $('.persistent-highlight').remove();
    }

    // Add a function to clear arrows
    myFunctions.clearArrows = function() {
        // Remove all arrows
        $('.chess-arrow-svg').remove();
    }

    // Function to create and update the virtual chessboard
    myFunctions.updateVirtualChessboard = function() {
        const virtualChessboard = document.getElementById('virtualChessboard');
        if (!virtualChessboard) return;

        // Clear the virtual chessboard
        virtualChessboard.innerHTML = '';

        // Get the current FEN from the board
        const fen = board.game.getFEN();
        const fenParts = fen.split(' ');
        const position = fenParts[0];
        const rows = position.split('/');

        // Create the chessboard squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'virtual-square';
                square.style.position = 'absolute';
                square.style.width = '12.5%';
                square.style.height = '12.5%';
                square.style.top = (row * 12.5) + '%';
                square.style.left = (col * 12.5) + '%';
                square.style.backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';

                // Add coordinates
                if (row === 7) {
                    const fileLabel = document.createElement('div');
                    fileLabel.style.position = 'absolute';
                    fileLabel.style.bottom = '2px';
                    fileLabel.style.right = '2px';
                    fileLabel.style.fontSize = '10px';
                    fileLabel.style.color = (row + col) % 2 === 0 ? '#b58863' : '#f0d9b5';
                    fileLabel.textContent = String.fromCharCode(97 + col); // 'a' to 'h'
                    square.appendChild(fileLabel);
                }

                if (col === 0) {
                    const rankLabel = document.createElement('div');
                    rankLabel.style.position = 'absolute';
                    rankLabel.style.top = '2px';
                    rankLabel.style.left = '2px';
                    rankLabel.style.fontSize = '10px';
                    rankLabel.style.color = (row + col) % 2 === 0 ? '#b58863' : '#f0d9b5';
                    rankLabel.textContent = 8 - row; // '8' to '1'
                    square.appendChild(rankLabel);
                }

                // Add data attributes for easier reference
                const file = String.fromCharCode(97 + col); // 'a' to 'h'
                const rank = 8 - row; // '8' to '1'
                square.dataset.square = file + rank;

                virtualChessboard.appendChild(square);
            }
        }

        // Debug log the FEN string
        console.log("Virtual chessboard FEN:", fen);

        // Place pieces on the board
        let rowIndex = 0;

        for (const row of rows) {
            let colIndex = 0;

            for (let i = 0; i < row.length; i++) {
                const char = row[i];

                if (/[1-8]/.test(char)) {
                    // Skip empty squares
                    colIndex += parseInt(char);
                } else {
                    // Place a piece
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'virtual-piece';
                    pieceElement.style.position = 'absolute';
                    pieceElement.style.width = '12.5%';
                    pieceElement.style.height = '12.5%';
                    pieceElement.style.top = (rowIndex * 12.5) + '%';
                    pieceElement.style.left = (colIndex * 12.5) + '%';
                    pieceElement.style.backgroundSize = 'contain';
                    pieceElement.style.backgroundRepeat = 'no-repeat';
                    pieceElement.style.backgroundPosition = 'center';
                    pieceElement.style.zIndex = '1';

                    // Set the piece image based on the FEN character
                    const pieceType = char.toLowerCase();
                    const pieceColor = char === char.toLowerCase() ? 'b' : 'w';

                    // Map FEN characters to piece types
                    const pieceMap = {
                        'p': 'pawn',
                        'r': 'rook',
                        'n': 'knight',
                        'b': 'bishop',
                        'q': 'queen',
                        'k': 'king'
                    };

                    // Debug log the piece being placed
                    console.log(`Placing ${pieceColor}${pieceMap[pieceType]} at row ${rowIndex}, col ${colIndex}`);

                    // Use chess.com piece style with direct URLs
                    const pieceUrls = {
                        'wp': 'https://www.chess.com/chess-themes/pieces/neo/150/wp.png',
                        'wn': 'https://www.chess.com/chess-themes/pieces/neo/150/wn.png',
                        'wb': 'https://www.chess.com/chess-themes/pieces/neo/150/wb.png',
                        'wr': 'https://www.chess.com/chess-themes/pieces/neo/150/wr.png',
                        'wq': 'https://www.chess.com/chess-themes/pieces/neo/150/wq.png',
                        'wk': 'https://www.chess.com/chess-themes/pieces/neo/150/wk.png',
                        'bp': 'https://www.chess.com/chess-themes/pieces/neo/150/bp.png',
                        'bn': 'https://www.chess.com/chess-themes/pieces/neo/150/bn.png',
                        'bb': 'https://www.chess.com/chess-themes/pieces/neo/150/bb.png',
                        'br': 'https://www.chess.com/chess-themes/pieces/neo/150/br.png',
                        'bq': 'https://www.chess.com/chess-themes/pieces/neo/150/bq.png',
                        'bk': 'https://www.chess.com/chess-themes/pieces/neo/150/bk.png'
                    };

                    const pieceKey = pieceColor + pieceType;
                    pieceElement.style.backgroundImage = `url(${pieceUrls[pieceKey]})`;

                    // Add a fallback in case the direct URL doesn't work
                    pieceElement.onerror = function() {
                        pieceElement.style.backgroundImage = `url(https://www.chess.com/chess-themes/pieces/neo/150/${pieceColor}${pieceMap[pieceType]}.png)`;
                    };

                    // Add a text fallback in case images don't load
                    pieceElement.textContent = char;
                    pieceElement.style.display = 'flex';
                    pieceElement.style.justifyContent = 'center';
                    pieceElement.style.alignItems = 'center';
                    pieceElement.style.fontSize = '20px';
                    pieceElement.style.fontWeight = 'bold';
                    pieceElement.style.color = pieceColor === 'w' ? '#fff' : '#000';
                    pieceElement.style.textShadow = pieceColor === 'w' ? '0 0 2px #000' : '0 0 2px #fff';

                    virtualChessboard.appendChild(pieceElement);

                    colIndex++;
                }
            }

            rowIndex++;
        }
    }

    // Function to show move indicators on the virtual chessboard
    myFunctions.showVirtualMoveIndicator = function(fromSquare, toSquare, opacity = 0.7, color = 'rgb(235, 97, 80)') {
        const virtualChessboard = document.getElementById('virtualChessboard');
        if (!virtualChessboard) return;

        // Convert numeric coordinates to algebraic notation if needed
        let fromAlgebraic = fromSquare;
        let toAlgebraic = toSquare;

        // If fromSquare is numeric (e.g., "11", "22"), convert to algebraic (e.g., "a1", "b2")
        if (/^\d+$/.test(fromSquare)) {
            const file = String.fromCharCode(96 + parseInt(fromSquare[1])); // '1' -> 'a', '2' -> 'b', etc.
            const rank = fromSquare[0];
            fromAlgebraic = file + rank;
        }

        // Same for toSquare
        if (/^\d+$/.test(toSquare)) {
            const file = String.fromCharCode(96 + parseInt(toSquare[1])); // '1' -> 'a', '2' -> 'b', etc.
            const rank = toSquare[0];
            toAlgebraic = file + rank;
        }

        // Use arrows or highlights based on user preference
        if (myVars.moveIndicatorType === 'arrows') {
            // Draw an arrow from 'from' to 'to'
            myFunctions.drawVirtualArrow(fromAlgebraic, toAlgebraic, opacity, color);
        } else {
            // Create highlight for the 'from' square
            const fromHighlight = document.createElement('div');
            fromHighlight.className = 'virtual-highlight';
            fromHighlight.style.position = 'absolute';
            fromHighlight.style.width = '12.5%';
            fromHighlight.style.height = '12.5%';
            fromHighlight.style.backgroundColor = color;
            fromHighlight.style.opacity = opacity;
            fromHighlight.style.zIndex = '2';

            // Create highlight for the 'to' square
            const toHighlight = document.createElement('div');
            toHighlight.className = 'virtual-highlight';
            toHighlight.style.position = 'absolute';
            toHighlight.style.width = '12.5%';
            toHighlight.style.height = '12.5%';
            toHighlight.style.backgroundColor = color;
            toHighlight.style.opacity = opacity;
            toHighlight.style.zIndex = '2';

            // Position the highlights based on the square coordinates
            const squares = virtualChessboard.querySelectorAll('.virtual-square');

            squares.forEach(square => {
                if (square.dataset.square === fromAlgebraic) {
                    fromHighlight.style.top = square.style.top;
                    fromHighlight.style.left = square.style.left;
                    virtualChessboard.appendChild(fromHighlight);
                }

                if (square.dataset.square === toAlgebraic) {
                    toHighlight.style.top = square.style.top;
                    toHighlight.style.left = square.style.left;
                    virtualChessboard.appendChild(toHighlight);
                }
            });
        }
    }

    // Function to draw an arrow on the virtual chessboard
    myFunctions.drawVirtualArrow = function(fromSquare, toSquare, opacity = 0.7, color = 'rgb(235, 97, 80)') {
        const virtualChessboard = document.getElementById('virtualChessboard');
        if (!virtualChessboard) return;

        // Find the positions of the squares
        let fromPos = null;
        let toPos = null;

        const squares = virtualChessboard.querySelectorAll('.virtual-square');

        squares.forEach(square => {
            if (square.dataset.square === fromSquare) {
                const rect = square.getBoundingClientRect();
                const boardRect = virtualChessboard.getBoundingClientRect();
                fromPos = {
                    x: (rect.left - boardRect.left) + (rect.width / 2),
                    y: (rect.top - boardRect.top) + (rect.height / 2)
                };
            }

            if (square.dataset.square === toSquare) {
                const rect = square.getBoundingClientRect();
                const boardRect = virtualChessboard.getBoundingClientRect();
                toPos = {
                    x: (rect.left - boardRect.left) + (rect.width / 2),
                    y: (rect.top - boardRect.top) + (rect.height / 2)
                };
            }
        });

        if (!fromPos || !toPos) return;

        // Create SVG element for the arrow
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('class', 'virtual-arrow');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '3';
        svg.style.pointerEvents = 'none';

        // Calculate the angle and length of the arrow
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);

        // Adjust start and end points to not cover the pieces
        const squareSize = virtualChessboard.getBoundingClientRect().width / 8;
        const margin = squareSize * 0.3;
        const startX = fromPos.x + Math.cos(angle) * margin;
        const startY = fromPos.y + Math.sin(angle) * margin;
        const endX = toPos.x - Math.cos(angle) * margin;
        const endY = toPos.y - Math.sin(angle) * margin;

        // Create the arrow shaft
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', squareSize / 8);
        line.setAttribute('opacity', opacity);

        // Create the arrow head
        const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const arrowSize = squareSize / 3;
        const arrowAngle = Math.PI / 7;

        const point1X = endX;
        const point1Y = endY;
        const point2X = endX - arrowSize * Math.cos(angle - arrowAngle);
        const point2Y = endY - arrowSize * Math.sin(angle - arrowAngle);
        const point3X = endX - arrowSize * 0.6 * Math.cos(angle);
        const point3Y = endY - arrowSize * 0.6 * Math.sin(angle);
        const point4X = endX - arrowSize * Math.cos(angle + arrowAngle);
        const point4Y = endY - arrowSize * Math.sin(angle + arrowAngle);

        arrowHead.setAttribute('points', `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y} ${point4X},${point4Y}`);
        arrowHead.setAttribute('fill', color);
        arrowHead.setAttribute('opacity', opacity);

        // Add elements to the SVG
        svg.appendChild(line);
        svg.appendChild(arrowHead);

        // Add the SVG to the virtual chessboard
        virtualChessboard.appendChild(svg);
    }

    // Function to clear virtual chessboard highlights and arrows
    myFunctions.clearVirtualMoveIndicators = function() {
        const virtualChessboard = document.getElementById('virtualChessboard');
        if (!virtualChessboard) return;

        // Remove all highlights
        const highlights = virtualChessboard.querySelectorAll('.virtual-highlight');
        highlights.forEach(highlight => highlight.remove());

        // Remove all arrows
        const arrows = virtualChessboard.querySelectorAll('.virtual-arrow');
        arrows.forEach(arrow => arrow.remove());
    }

    // Observer instance for auto queue
    myVars.newGameObserver = null;

    // Function to check for and click the "New" button
    myFunctions.clickNewGameButton = function() {
        const buttons = document.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.includes('New')) {
                console.log('Auto Queue: Found "New" button, clicking it');
                buttons[i].click();
                return true;
            }
        }
        return false;
    }

    // Function to start observing for new buttons
    myFunctions.startNewGameObserver = function() {
        // First try to click any existing button
        myFunctions.clickNewGameButton();

        // If observer already exists, disconnect it first
        if (myVars.newGameObserver) {
            myFunctions.stopNewGameObserver();
        }

        // Create a new observer
        myVars.newGameObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    myFunctions.clickNewGameButton();
                }
            });
        });

        // Start observing the document body for changes
        myVars.newGameObserver.observe(document.body, { childList: true, subtree: true });
        console.log('Auto Queue: Started observing for New Game buttons');
    }

    // Function to stop observing
    myFunctions.stopNewGameObserver = function() {
        if (myVars.newGameObserver) {
            myVars.newGameObserver.disconnect();
            myVars.newGameObserver = null;
            console.log('Auto Queue: Stopped observing for New Game buttons');
        }
    }

    // Function to toggle the auto queue observer based on the current setting
    myFunctions.updateAutoQueueObserver = function() {
        if (myVars.autoQueue) {
            myFunctions.startNewGameObserver();
        } else {
            myFunctions.stopNewGameObserver();
        }
    }

    // Function to draw an arrow on the chess board
    myFunctions.drawArrow = function(fromSquare, toSquare, isPersistent, customOpacity, customColor) {
        // Store the move information for the server
        if (!myVars.bestMove) {
            myVars.bestMove = fromSquare + toSquare;
            console.log('Setting best move for server:', myVars.bestMove);
        }

        // Always update the server if external window is open
        if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
            console.log('Sending move to server:', fromSquare + toSquare);
            myFunctions.sendServerUpdate();
        }

        // Check if we should show arrows on the main board
        if (myVars.moveIndicatorLocation !== 'main' && myVars.moveIndicatorLocation !== 'both') {
            return;
        }

        // Get the board element and its dimensions
        const boardElement = $(board.nodeName)[0];
        const boardRect = boardElement.getBoundingClientRect();
        const squareSize = boardRect.width / 8;

        // Use provided opacity or default
        const arrowOpacity = customOpacity !== undefined ? customOpacity : 0.9;

        // Use provided color or default
        const arrowColor = customColor || myVars.arrowColor || "#0077CC";

        // Create a temporary highlight to find the square position
        // This is a reliable way to get the correct position regardless of board orientation
        const tempFromHighlight = document.createElement('div');
        tempFromHighlight.className = 'highlight square-' + fromSquare;
        tempFromHighlight.style.opacity = '0';

        const tempToHighlight = document.createElement('div');
        tempToHighlight.className = 'highlight square-' + toSquare;
        tempToHighlight.style.opacity = '0';

        // Add to board temporarily
        boardElement.appendChild(tempFromHighlight);
        boardElement.appendChild(tempToHighlight);

        // Get positions
        const fromRect = tempFromHighlight.getBoundingClientRect();
        const toRect = tempToHighlight.getBoundingClientRect();

        // Remove temporary elements
        boardElement.removeChild(tempFromHighlight);
        boardElement.removeChild(tempToHighlight);

        // Calculate center coordinates relative to the board
        const fromX = fromRect.left - boardRect.left + fromRect.width / 2;
        const fromY = fromRect.top - boardRect.top + fromRect.height / 2;
        const toX = toRect.left - boardRect.left + toRect.width / 2;
        const toY = toRect.top - boardRect.top + toRect.height / 2;

        // Create SVG element for the arrow
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", boardRect.width);
        svg.setAttribute("height", boardRect.height);
        svg.setAttribute("class", "chess-arrow-svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "100";

        // Calculate the angle and length of the arrow
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);

        // Note: arrowColor is now defined at the top of the function

        // Adjust start and end points to not cover the pieces
        const margin = squareSize * 0.3;
        const startX = fromX + Math.cos(angle) * margin;
        const startY = fromY + Math.sin(angle) * margin;
        const endX = toX - Math.cos(angle) * margin;
        const endY = toY - Math.sin(angle) * margin;

        // Create a group for the arrow (for easier animation)
        const arrowGroup = document.createElementNS(svgNS, "g");

        // Add a filter for drop shadow
        const filterId = `arrow-shadow-${Date.now()}`;
        const filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", filterId);
        filter.setAttribute("x", "-20%");
        filter.setAttribute("y", "-20%");
        filter.setAttribute("width", "140%");
        filter.setAttribute("height", "140%");

        const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
        feGaussianBlur.setAttribute("in", "SourceAlpha");
        feGaussianBlur.setAttribute("stdDeviation", "2");
        feGaussianBlur.setAttribute("result", "blur");

        const feOffset = document.createElementNS(svgNS, "feOffset");
        feOffset.setAttribute("in", "blur");
        feOffset.setAttribute("dx", "1");
        feOffset.setAttribute("dy", "1");
        feOffset.setAttribute("result", "offsetBlur");

        const feFlood = document.createElementNS(svgNS, "feFlood");
        feFlood.setAttribute("flood-color", "rgba(0,0,0,0.5)");
        feFlood.setAttribute("flood-opacity", "0.3");
        feFlood.setAttribute("result", "color");

        const feComposite = document.createElementNS(svgNS, "feComposite");
        feComposite.setAttribute("in", "color");
        feComposite.setAttribute("in2", "offsetBlur");
        feComposite.setAttribute("operator", "in");
        feComposite.setAttribute("result", "shadow");

        const feMerge = document.createElementNS(svgNS, "feMerge");

        const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
        feMergeNode1.setAttribute("in", "shadow");

        const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
        feMergeNode2.setAttribute("in", "SourceGraphic");

        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);

        filter.appendChild(feGaussianBlur);
        filter.appendChild(feOffset);
        filter.appendChild(feFlood);
        filter.appendChild(feComposite);
        filter.appendChild(feMerge);

        svg.appendChild(filter);

        // Apply the filter to the arrow group
        arrowGroup.setAttribute("filter", `url(#${filterId})`);

        // Create the arrow shaft using a path for better control
        const path = document.createElementNS(svgNS, "path");

        // Check if we should use curved or straight arrows
        const arrowStyle = myVars.arrowStyle || 'curved';

        let pathData;
        let ctrlX, ctrlY;

        if (arrowStyle === 'curved') {
            // CURVED ARROW STYLE (Chess.com style)
            // Calculate control points for a slight curve that adapts to the move direction
            // Adjust curve factor based on move length - shorter moves get more curve
            const baseCurveFactor = 0.1;
            const lengthFactor = Math.min(1, 150 / length); // Normalize length factor
            const curveFactor = baseCurveFactor * lengthFactor;

            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            // Determine curve direction based on the move
            // We'll use the board center as a reference point to decide curve direction
            const boardCenterX = boardRect.width / 2;
            const boardCenterY = boardRect.height / 2;

            // Calculate vectors from board center to start and end points
            const startVecX = startX - boardCenterX;
            const startVecY = startY - boardCenterY;
            const endVecX = endX - boardCenterX;
            const endVecY = endY - boardCenterY;

            // Calculate cross product to determine which side to curve
            // This will make the curve direction adapt based on the move's position relative to board center
            const crossProduct = startVecX * endVecY - startVecY * endVecX;

            // Apply curve in appropriate direction based on cross product
            const perpX = Math.sign(crossProduct) * -Math.sin(angle) * length * curveFactor;
            const perpY = Math.sign(crossProduct) * Math.cos(angle) * length * curveFactor;
            ctrlX = midX + perpX;
            ctrlY = midY + perpY;

            // Create a quadratic bezier curve path
            pathData = `M ${startX},${startY} Q ${ctrlX},${ctrlY} ${endX},${endY}`;
        } else {
            // STRAIGHT ARROW STYLE (Classic style)
            // Simple straight line from start to end
            pathData = `M ${startX},${startY} L ${endX},${endY}`;

            // For arrow head calculation later, we still need control points
            // For straight lines, the control point is just the end point
            ctrlX = endX;
            ctrlY = endY;
        }
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", arrowColor);
        path.setAttribute("stroke-width", squareSize / 9);
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", arrowOpacity);
        path.setAttribute("stroke-linecap", "round");

        // Create the arrow head
        const arrowHead = document.createElementNS(svgNS, "polygon");

        // Calculate the direction at the end of the curve/line
        // For a quadratic bezier, the tangent at the end point is from the control point to the end point
        // For straight lines, this will just be the angle of the line
        const endAngle = Math.atan2(endY - ctrlY, endX - ctrlX);

        let point1X, point1Y, point2X, point2Y, point3X, point3Y, point4X, point4Y;

        if (arrowStyle === 'curved') {
            // CURVED ARROW STYLE (Chess.com style)
            // Adjust arrow size based on square size for better proportions
            const arrowSize = squareSize / 3.2;

            // Chess.com style arrow head with sharper angle
            const arrowAngle = Math.PI / 7;

            // Create a more refined arrow head shape with smooth transitions
            point1X = endX; // Tip of the arrow
            point1Y = endY;

            // Left wing of arrow head
            point2X = endX - arrowSize * Math.cos(endAngle - arrowAngle);
            point2Y = endY - arrowSize * Math.sin(endAngle - arrowAngle);

            // Middle indentation (chess.com style)
            const indentFactor = 0.65; // How far back the middle indent goes
            point3X = endX - arrowSize * indentFactor * Math.cos(endAngle);
            point3Y = endY - arrowSize * indentFactor * Math.sin(endAngle);

            // Right wing of arrow head
            point4X = endX - arrowSize * Math.cos(endAngle + arrowAngle);
            point4Y = endY - arrowSize * Math.sin(endAngle + arrowAngle);
        } else {
            // STRAIGHT ARROW STYLE (Classic style)
            // Simpler arrow head for straight arrows
            const arrowSize = squareSize / 3.5;
            const arrowAngle = Math.PI / 6; // Wider angle for classic style

            point1X = endX; // Tip of the arrow
            point1Y = endY;

            // Left wing of arrow head
            point2X = endX - arrowSize * Math.cos(endAngle - arrowAngle);
            point2Y = endY - arrowSize * Math.sin(endAngle - arrowAngle);

            // Right wing of arrow head
            point4X = endX - arrowSize * Math.cos(endAngle + arrowAngle);
            point4Y = endY - arrowSize * Math.sin(endAngle + arrowAngle);

            // For straight arrows, we use a triangular head (no middle indentation)
            point3X = point1X; // Not used for straight arrows
            point3Y = point1Y; // Not used for straight arrows
        }

        // Set the polygon points based on arrow style
        if (arrowStyle === 'curved') {
            // Four-point polygon for curved arrows (with middle indentation)
            arrowHead.setAttribute("points", `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y} ${point4X},${point4Y}`);
        } else {
            // Three-point polygon for straight arrows (triangular head)
            arrowHead.setAttribute("points", `${point1X},${point1Y} ${point2X},${point2Y} ${point4X},${point4Y}`);
        }
        arrowHead.setAttribute("fill", arrowColor);
        arrowHead.setAttribute("opacity", arrowOpacity);

        // Add elements to the arrow group
        arrowGroup.appendChild(path);
        arrowGroup.appendChild(arrowHead);

        // Add the arrow group to the SVG
        svg.appendChild(arrowGroup);

        // Add the SVG to the board
        boardElement.appendChild(svg);

        // Check if animations are enabled
        const animationsEnabled = myVars.arrowAnimation !== undefined ? myVars.arrowAnimation : true;

        // Add entrance animation only if enabled
        if (animationsEnabled) {
            if (typeof anime !== 'undefined') {
                // If anime.js is available, use it for smooth animation
                anime({
                    targets: path,
                    strokeDashoffset: [anime.setDashoffset, 0],
                    easing: 'easeInOutSine',
                    duration: 300,
                    delay: 0
                });

                anime({
                    targets: arrowHead,
                    opacity: [0, arrowOpacity],
                    scale: [0.5, 1],
                    easing: 'easeInOutSine',
                    duration: 300,
                    delay: 200
                });
            } else {
                // Fallback animation using CSS
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.animation = 'arrow-draw 0.3s ease-in-out forwards';

                arrowHead.style.opacity = '0';
                arrowHead.style.animation = 'arrow-fade-in 0.2s ease-in-out 0.2s forwards';

                // Add the animation keyframes if they don't exist
                if (!document.getElementById('arrow-animations')) {
                    const style = document.createElement('style');
                    style.id = 'arrow-animations';
                    style.textContent = `
                        @keyframes arrow-draw {
                            to {
                                stroke-dashoffset: 0;
                            }
                        }
                        @keyframes arrow-fade-in {
                            to {
                                opacity: ${arrowOpacity};
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        } else {
            // If animations are disabled, just show the arrow immediately
            path.style.opacity = arrowOpacity;
            arrowHead.style.opacity = arrowOpacity;
        }

        // If not persistent, remove after delay
        if (!isPersistent) {
            setTimeout(() => {
                if (svg.parentNode) {
                    // Check if animations are enabled
                    if (animationsEnabled) {
                        // Fade out animation
                        const fadeOut = () => {
                            arrowGroup.style.transition = 'opacity 0.3s ease-out';
                            arrowGroup.style.opacity = '0';
                            setTimeout(() => {
                                if (svg.parentNode) {
                                    svg.parentNode.removeChild(svg);
                                }
                            }, 300);
                        };
                        fadeOut();
                    } else {
                        // If animations are disabled, just remove immediately
                        svg.parentNode.removeChild(svg);
                    }
                }
            }, 1800);
        }
    }

    // Modify the movePiece function to clear highlights and arrows when a move is made
    myFunctions.movePiece = function(from, to){
        // Clear any existing highlights and arrows when a move is made
        myFunctions.clearHighlights();
        myFunctions.clearArrows();

        for (var each=0;each<board.game.getLegalMoves().length;each++){
            if(board.game.getLegalMoves()[each].from == from){
                if(board.game.getLegalMoves()[each].to == to){
                    var move = board.game.getLegalMoves()[each];
                    board.game.move({
                        ...move,
                        promotion: 'false',
                        animate: false,
                        userGenerated: true
                    });
                }
            }
        }
    }

    function parser(e){
        // Store alternative moves for human-like play and multiple move suggestions
        if(e.data.includes('info') && e.data.includes('pv') && !e.data.includes('bestmove')) {
            try {
                // Extract the move from the principal variation (pv)
                const parts = e.data.split(' ');
                const pvIndex = parts.indexOf('pv');
                const cpIndex = parts.indexOf('cp');
                const mateIndex = parts.indexOf('mate');
                const depthIndex = parts.indexOf('depth');
                const multipvIndex = parts.indexOf('multipv');

                // Debug the raw engine output to understand what we're getting
                console.log("Engine output:", e.data);

                if(pvIndex !== -1 && parts[pvIndex + 1]) {
                    const move = parts[pvIndex + 1];

                    // Get evaluation for this move
                    let evaluation = 0;
                    let isMate = false;
                    let mateIn = 0;

                    if (cpIndex !== -1 && parts[cpIndex + 1]) {
                        evaluation = parseInt(parts[cpIndex + 1]) / 100; // Convert centipawns to pawns
                    } else if (mateIndex !== -1 && parts[mateIndex + 1]) {
                        isMate = true;
                        mateIn = parseInt(parts[mateIndex + 1]);
                        // Use a large value for mate
                        evaluation = mateIn > 0 ? 20 : -20;
                    }

                    // Get depth for this move
                    let depth = 0;
                    if (depthIndex !== -1 && parts[depthIndex + 1]) {
                        depth = parseInt(parts[depthIndex + 1]);
                    }

                    // Get multipv index if available (for multiple move analysis)
                    let multipvValue = 1; // Default to 1 if not specified
                    if (multipvIndex !== -1 && parts[multipvIndex + 1]) {
                        multipvValue = parseInt(parts[multipvIndex + 1]);
                    }

                    // Initialize topMoves array if it doesn't exist
                    if (!myVars.topMoves) {
                        myVars.topMoves = [];
                    }

                    // Create move info object
                    const moveInfo = {
                        move: move,
                        evaluation: evaluation,
                        isMate: isMate,
                        mateIn: mateIn,
                        depth: depth,
                        multipv: multipvValue
                    };

                    // Check if this move is already in the list
                    const existingIndex = myVars.topMoves.findIndex(m => m.move === move);

                    if (existingIndex !== -1) {
                        // Update existing move info
                        myVars.topMoves[existingIndex] = moveInfo;
                    } else {
                        // Add new move info
                        myVars.topMoves.push(moveInfo);
                    }

                    // Sort moves by evaluation (best first)
                    myVars.topMoves.sort((a, b) => b.evaluation - a.evaluation);

                    // Keep only the top N moves
                    if (myVars.topMoves.length > 5) {
                        myVars.topMoves = myVars.topMoves.slice(0, 5);
                    }

                    // Debug info
                    console.log("Added/updated move in topMoves:", move, "Eval:", evaluation, "Total moves:", myVars.topMoves.length);
                    console.log("Current topMoves:", JSON.stringify(myVars.topMoves));

                    // Also store for human-like play (backward compatibility)
                    if(!myVars.alternativeMoves) {
                        myVars.alternativeMoves = [];
                    }

                    // Only add if not already in the list
                    if(!myVars.alternativeMoves.includes(move)) {
                        myVars.alternativeMoves.push(move);
                    }
                }
            } catch (err) {
                console.log('Error parsing alternative move:', err);
            }
        }

        if(e.data.includes('bestmove')){
            const bestMove = e.data.split(' ')[1];
            console.log('[ENGINE DEBUG] Best move received:', bestMove);
            console.log('[ENGINE DEBUG] Top moves before reset:', myVars.topMoves ? myVars.topMoves.length : 0);

            // Validate that it's still the player's turn before processing the move
            const currentGameTurn = board.game.getTurn();
            const playingAs = board.game.getPlayingAs();
            const isPlayerTurn = currentGameTurn == playingAs;

            console.log(`[ENGINE DEBUG] Turn validation - currentGameTurn: ${currentGameTurn}, playingAs: ${playingAs}, isPlayerTurn: ${isPlayerTurn}`);
            console.log(`[ENGINE DEBUG] myTurn: ${myTurn}, isThinking: ${isThinking}`);

            if (!isPlayerTurn) {
                console.warn('[ENGINE DEBUG] WARNING: Received bestmove but it\'s not player\'s turn! Ignoring move.');
                isThinking = false;
                myVars.engineRunning = false;
                return;
            }

            // Store the best move for server updates
            myVars.bestMove = bestMove;

            // Mark that this move is from the engine, not opening book
            myVars.lastMoveFromBook = false;

            // If human mode is active, simulate human play
            // WAIT! We already handle the delay in myFunctions.color() now for Auto Move.
            // But we still need to delay the "display" of the move or the coloring if we want it to look like thinking?
            // Actually, myFunctions.color() updates the best move and *then* triggers the auto-move.
            // If we delay calling myFunctions.color(), we delay the visual feedback too.
            // If we want instant visual feedback but delayed move, we should call myFunctions.color() immediately.
            // However, the previous logic here was delaying the CALL to color(), which implies delaying the visual feedback.
            // Let's assume the user wants the bot to "think" (no visual update) and then "play" (visual update + move).
            // BUT, if Human Auto Move is ON, myFunctions.color() handles the move delay.
            // If Human Auto Move is OFF, we probably just want to show the best move immediately?
            // The previous logic was: if Human Mode is ON, delay EVERYTHING (visual + move).

            // Let's check if Human Auto Move is enabled.
            // If Human Auto Move is ON, we rely on myFunctions.color() to handle the move delay.
            // But we might still want to delay the *visual* indication of the best move to simulate "finding" it?
            // Actually, usually users want to see the move ASAP but have it PLAYED with a delay.
            // The previous implementation here delayed the whole thing.

            // Let's simplify:
            // 1. Calculate best move.
            // 2. Always show it immediately (so user knows what to play if they are playing manually).
            // 3. Let myFunctions.color() handle the actual execution delay based on settings.

            // So we can remove this big block of "simulate human play" delay logic here,
            // because myFunctions.color() now has the smarts to check for Human Auto Move and delay the execution.
            
            // However, the user might expect the "Human Mode" to also delay the *suggestion*? 
            // Usually cheat users want the info instantly. The "Human Mode" usually refers to the *output* (moves played).

            // So I will revert this section to standard behavior: show immediately, let color() handle execution.
            
            myFunctions.color(bestMove);
            isThinking = false;
            myVars.engineRunning = false;

            // Update auto run status if auto run is enabled
            if (myVars.autoRun) {
                myFunctions.updateAutoRunStatus('on');
            }

            // Reset alternative moves
            myVars.alternativeMoves = [];

            // Update the server if external window is open
            if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                myFunctions.sendServerUpdate();
            }
        }
        // Parse evaluation information
        if(e.data.includes('info') && e.data.includes('score cp')) {
            try {
                const parts = e.data.split(' ');
                const cpIndex = parts.indexOf('cp');
                if(cpIndex !== -1 && parts[cpIndex + 1]) {
                    const evalValue = parseInt(parts[cpIndex + 1]) / 100; // Convert centipawns to pawns
                    myVars.currentEvaluation = evalValue;

                    // Get depth information
                    const depthIndex = parts.indexOf('depth');
                    let currentDepth = '';
                    if(depthIndex !== -1 && parts[depthIndex + 1]) {
                        currentDepth = parts[depthIndex + 1];
                    }

                    // Update depth info in evaluation text
                    updateEvalBar(evalValue, null, currentDepth);

                    // Update the server if external window is open
                    if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                        myFunctions.sendServerUpdate();
                    }
                }
            } catch (err) {
                console.log('Error parsing evaluation:', err);
            }
        }
        // Parse mate information
        if(e.data.includes('info') && e.data.includes('score mate')) {
            try {
                const parts = e.data.split(' ');
                const mateIndex = parts.indexOf('mate');
                if(mateIndex !== -1 && parts[mateIndex + 1]) {
                    const movesToMate = parseInt(parts[mateIndex + 1]);
                    const evalText = movesToMate > 0 ? `Mate in ${movesToMate}` : `Mate in ${Math.abs(movesToMate)}`;
                    myVars.currentEvaluation = evalText; // Store mate text for history

                    // Get depth information
                    const depthIndex = parts.indexOf('depth');
                    let currentDepth = '';
                    if(depthIndex !== -1 && parts[depthIndex + 1]) {
                        currentDepth = parts[depthIndex + 1];
                    }

                    updateEvalBar(movesToMate > 0 ? 20 : -20, evalText, currentDepth); // Use a large value to show mate

                    // Update the server if external window is open
                    if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                        myFunctions.sendServerUpdate();
                    }
                }
            } catch (err) {
                console.log('Error parsing mate:', err);
            }
        }
    }

    // Function to update the evaluation bar (chess.com style)
    function updateEvalBar(evalValue, mateText = null, depth = '') {
        if(!evalBar || !evalText) return;

        // Store the current evaluation for reference
        myVars.currentEvaluation = evalValue;
        var smoothedEval = (typeof myVars.evalEMA === 'number' ? (myVars.evalAlpha * evalValue + (1 - myVars.evalAlpha) * myVars.evalEMA) : evalValue);
        myVars.evalEMA = smoothedEval;

        // Clamp the visual representation between -5 and 5
        const clampedEval = Math.max(-5, Math.min(5, evalValue));
        const percentage = 50 + (clampedEval * 10); // Convert to percentage (0-100)

        // Smoothly animate the height change
        myVars.evalBarTargetPercent = percentage;
        if (typeof myFunctions.animateEvalBar === 'function') {
            myFunctions.animateEvalBar();
        } else {
            evalBar.style.height = `${percentage}%`;
        }

        // Update color based on who's winning with smoother gradients
        let whiteColor = myVars.whiteAdvantageColor || '#4CAF50'; // White advantage
        let blackColor = myVars.blackAdvantageColor || '#F44336'; // Black advantage
        let neutralColor = '#9E9E9E'; // Grey for equal

        // Determine the color based on advantage
        let gradientColor;
        let textColor;

        if(evalValue > 0.2) {
            // White advantage - stronger color for bigger advantage
            const intensity = Math.min(1, Math.abs(evalValue) / 5); // Scale from 0 to 1 based on advantage
            gradientColor = whiteColor;
            textColor = whiteColor;
            // Apply intensity to make stronger advantages more vibrant
            evalBar.style.opacity = 0.7 + (intensity * 0.3);
        } else if(evalValue < -0.2) {
            // Black advantage - stronger color for bigger advantage
            const intensity = Math.min(1, Math.abs(evalValue) / 5); // Scale from 0 to 1 based on advantage
            gradientColor = blackColor;
            textColor = blackColor;
            // Apply intensity to make stronger advantages more vibrant
            evalBar.style.opacity = 0.7 + (intensity * 0.3);
        } else {
            // Near equal position
            gradientColor = neutralColor;
            textColor = '#FFFFFF';
            evalBar.style.opacity = 1;
        }

        // Create chess.com-like gradient effect with subtle patterns
        evalBar.style.backgroundImage = `
            linear-gradient(
                to bottom,
                ${gradientColor}ee,
                ${gradientColor}
            ),
            linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05)),
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)
        `;
        evalBar.style.backgroundSize = '100% 100%, 100% 100%, 100% 5%';

        // Add subtle shadow at the top edge for depth effect
        evalBar.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.15)';

        var sparkEval = Math.max(-5, Math.min(5, smoothedEval));
        myVars.evalHistory.push(sparkEval);
        if (myVars.evalHistory.length > myVars.evalHistoryMaxPoints) {
            myVars.evalHistory.shift();
        }
        if (typeof myFunctions.updateEvalSparkline === 'function') {
            myFunctions.updateEvalSparkline();
        }

        // Update evaluation text with chess.com-like formatting
        if(mateText) {
            // Mate situation
            const mateColor = evalValue > 0 ? whiteColor : blackColor;
            evalText.innerHTML = `<span style="color: ${mateColor}">${mateText}</span>${depth ? `<br><span style="font-size: 10px; color: rgba(255,255,255,0.7)">d${depth}</span>` : ''}`;
            evalText.style.backgroundColor = '#2a2a2a';
        } else {
            const sign = smoothedEval > 0 ? '+' : '';
            const k = myVars.winProbSlope || 1.4;
            const prob = 1/(1+Math.exp(-k*smoothedEval));
            const side = smoothedEval >= 0 ? 'W' : 'B';
            const pct = Math.round((side === 'W' ? prob : (1-prob))*100);
            const depthLine = depth ? `<br><span style="font-size: 10px; color: rgba(255,255,255,0.7)">d${depth}</span>` : '';
            evalText.innerHTML = `<span style="color: ${textColor}">${sign}${Math.abs(smoothedEval).toFixed(1)}</span><br><span style="font-size: 10px; color: rgba(255,255,255,0.8)">${side} ${pct}%</span>${depthLine}`;
            if(Math.abs(evalValue) > 3) {
                evalText.style.backgroundColor = evalValue > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';
                evalText.style.boxShadow = `0 2px 6px ${evalValue > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`;
            } else {
                evalText.style.backgroundColor = '#2a2a2a';
                evalText.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            }
        }

        // Add visual pulse effect on significant changes
        const previousEval = myVars.previousEvaluation || 0;
        if(Math.abs(evalValue - previousEval) > 0.5) {
            // Significant change detected - add pulse animation
            evalBar.style.animation = 'none';
            evalBar.offsetHeight; // Trigger reflow
            evalBar.style.animation = 'evalPulse 0.5s ease-in-out';
        }

        // Store current evaluation for next comparison
        myVars.previousEvaluation = evalValue;
    }

    // Add enhanced pulse animation
    const pulseAnimation = document.createElement('style');
    pulseAnimation.textContent = `
        @keyframes evalPulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(pulseAnimation);

    myFunctions.animateEvalBar = function() {
        if (!evalBar) return;
        if (myVars.evalBarAnimationFrame) {
            cancelAnimationFrame(myVars.evalBarAnimationFrame);
            myVars.evalBarAnimationFrame = null;
        }
        var step = function() {
            var current = myVars.evalBarCurrentPercent;
            var target = myVars.evalBarTargetPercent;
            var diff = target - current;
            if (Math.abs(diff) < 0.2) {
                myVars.evalBarCurrentPercent = target;
                evalBar.style.height = target + '%';
                myVars.evalBarAnimationFrame = null;
                return;
            }
            myVars.evalBarCurrentPercent = current + diff * 0.15;
            evalBar.style.height = myVars.evalBarCurrentPercent + '%';
            myVars.evalBarAnimationFrame = requestAnimationFrame(step);
        };
        myVars.evalBarAnimationFrame = requestAnimationFrame(step);
    }

    myFunctions.updateEvalSparkline = function() {
        var canvas = document.getElementById('evalSparklineCanvas');
        if (!canvas) return;
        var dpr = window.devicePixelRatio || 1;
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
        }
        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(0, 0, w, h);
        var data = myVars.evalHistory;
        if (!data || data.length < 2) return;
        var minY = -5;
        var maxY = 5;
        var xStep = w / (myVars.evalHistoryMaxPoints - 1);
        var yScale = h / (maxY - minY);
        ctx.lineWidth = 2;
        var lastVal = data[data.length - 1] || 0;
        ctx.strokeStyle = lastVal >= 0 ? (myVars.whiteAdvantageColor || '#4CAF50') : (myVars.blackAdvantageColor || '#F44336');
        ctx.beginPath();
        for (var i = 0; i < data.length; i++) {
            var x = i * xStep;
            var y = h - (data[i] - minY) * yScale;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        var midY = h - (0 - minY) * yScale;
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
    }

    myFunctions.reloadChessEngine = function() {
        console.log(`Reloading the chess engine!`);

        engine.engine.terminate();
        isThinking = false;
        myFunctions.loadChessEngine();
    }

    myFunctions.loadChessEngine = async function() {
        if (!stockfishObjectURL) {
            const stockfishText = await GM.getResourceText('stockfish.js'); // Await the async function
            stockfishObjectURL = URL.createObjectURL(new Blob([stockfishText], { type: 'application/javascript' }));
        }
        console.log(stockfishObjectURL);

        if (stockfishObjectURL) {
            engine.engine = new Worker(stockfishObjectURL);

            engine.engine.onmessage = e => {
                parser(e);
            };
            engine.engine.onerror = e => {
                console.log("Worker Error: " + e);
            };

            engine.engine.postMessage('ucinewgame');

            // Set MultiPV mode if multiple moves are enabled
            if (myVars.showMultipleMoves) {
                const multipvValue = myVars.numberOfMovesToShow || 3;
                console.log("Initializing engine with MultiPV:", multipvValue);
                engine.engine.postMessage(`setoption name MultiPV value ${multipvValue}`);
            }

            // Set ELO if specified
            if (myVars.eloRating) {
                setEngineElo(myVars.eloRating);
            }
        }
        console.log('Loaded chess engine');
    };


    // Function to set engine ELO
    function setEngineElo(elo, skipDepthAdjustment = false) {
        if(!engine.engine) return;

        // Stockfish supports UCI_Elo option to limit playing strength
        engine.engine.postMessage(`setoption name UCI_Elo value ${elo}`);

        // Also set UCI_LimitStrength to true to enable ELO limiting
        engine.engine.postMessage('setoption name UCI_LimitStrength value true');

        // Set Skill Level based on ELO (0-20 scale)
        // This helps ensure the engine plays more consistently with the ELO rating
        let skillLevel = Math.max(0, Math.min(20, Math.floor((elo - 1000) / 100)));
        engine.engine.postMessage(`setoption name Skill Level value ${skillLevel}`);

        // Set appropriate depth limits based on ELO
        // Lower ELO should use lower max depth to play more consistently
        let maxDepth;
        if (elo < 1200) {
            maxDepth = 5;  // Beginner level
        } else if (elo < 1500) {
            maxDepth = 8;  // Intermediate level
        } else if (elo < 1800) {
            maxDepth = 12; // Advanced level
        } else if (elo < 2100) {
            maxDepth = 15; // Expert level
        } else if (elo < 2400) {
            maxDepth = 18; // Master level
        } else {
            maxDepth = 22; // Grandmaster level
        }

        // Store the max depth for this ELO
        myVars.maxDepthForElo = maxDepth;

        // Update the depth slider max value based on ELO (unless we're loading settings)
        if ($('#depthSlider')[0] && !skipDepthAdjustment) {
            // Only update the max if the current value is higher than the new max
            if (parseInt($('#depthSlider')[0].value) > maxDepth) {
                $('#depthSlider')[0].value = maxDepth;
                $('#depthText')[0].innerHTML = "Current Depth: <strong>" + maxDepth + "</strong>";
            }

            // Update the slider's max attribute
            $('#depthSlider')[0].max = maxDepth;

            // Add a note about depth limitation
            const depthNote = document.getElementById('depthNote');
            if (depthNote) {
                depthNote.textContent = `(Max depth ${maxDepth} for ELO ${elo})`;
            } else if ($('#depthText')[0]) {
                const note = document.createElement('span');
                note.id = 'depthNote';
                note.style = 'font-size: 12px; color: #666; margin-left: 5px;';
                note.textContent = `(Max depth ${maxDepth} for ELO ${elo})`;
                $('#depthText')[0].appendChild(note);
            }
        } else if ($('#depthSlider')[0] && skipDepthAdjustment) {
            // When loading settings, just update the max attribute without changing the value
            $('#depthSlider')[0].max = maxDepth;

            // Add a note about depth limitation
            const depthNote = document.getElementById('depthNote');
            if (depthNote) {
                depthNote.textContent = `(Max depth ${maxDepth} for ELO ${elo})`;
            } else if ($('#depthText')[0]) {
                const note = document.createElement('span');
                note.id = 'depthNote';
                note.style = 'font-size: 12px; color: #666; margin-left: 5px;';
                note.textContent = `(Max depth ${maxDepth} for ELO ${elo})`;
                $('#depthText')[0].appendChild(note);
            }
        }

        console.log(`Engine ELO set to ${elo} with max depth ${maxDepth} and skill level ${skillLevel}`);
    }

    // Function to set human-like play parameters
    function setHumanMode(level) {
        if(!engine.engine) return;

        // Define human-like play characteristics based on level
        let elo, moveTime, errorRate, blunderRate;

        switch(level) {
            case 'beginner':
                elo = 800;
                moveTime = { min: 1, max: 5 }; // Seconds
                errorRate = 0.3; // 30% chance of suboptimal moves
                blunderRate = 0.15; // 15% chance of blunders
                break;
            case 'casual':
                elo = 1200;
                moveTime = { min: 2, max: 8 };
                errorRate = 0.2;
                blunderRate = 0.1;
                break;
            case 'intermediate':
                elo = 1600;
                moveTime = { min: 3, max: 12 };
                errorRate = 0.15;
                blunderRate = 0.05;
                break;
            case 'advanced':
                elo = 2000;
                moveTime = { min: 5, max: 15 };
                errorRate = 0.1;
                blunderRate = 0.03;
                break;
            case 'expert':
                elo = 2400;
                moveTime = { min: 8, max: 20 };
                errorRate = 0.05;
                blunderRate = 0.01;
                break;
            default:
                elo = 1600; // Default to intermediate
                moveTime = { min: 3, max: 12 };
                errorRate = 0.15;
                blunderRate = 0.05;
        }

        // Store human mode settings
        myVars.humanMode = {
            active: true,
            level: level,
            elo: elo,
            moveTime: moveTime,
            errorRate: errorRate,
            blunderRate: blunderRate
        };

        // Set the engine ELO
        setEngineElo(elo);

        // Update UI to reflect human mode
        if ($('#humanModeLevel')[0]) {
            $('#humanModeLevel')[0].textContent = level.charAt(0).toUpperCase() + level.slice(1);
        }

        // Update the human mode info in the UI
        const humanModeInfo = document.getElementById('humanModeInfo');
        if (humanModeInfo) {
            humanModeInfo.textContent = `Playing like a ${level} human (ELO ~${elo})`;
        }

        console.log(`Human mode set to ${level} (ELO: ${elo}, Error rate: ${errorRate}, Blunder rate: ${blunderRate})`);
    }

    // Function to calculate thinking time based on board position
    function calculateThinkingTime(boardState) {
        // Example logic: You can customize this based on your evaluation of the board
        const complexity = evaluateBoardComplexity(boardState); // Implement this function based on your needs
        const minTime = 100; // Minimum thinking time in milliseconds
        const maxTime = 2000; // Maximum thinking time in milliseconds

        // Scale thinking time based on complexity (this is just an example)
        return Math.min(maxTime, minTime + complexity * 100); // Adjust the scaling factor as needed
    }

    // Function to simulate human-like play
    function simulateHumanPlay(bestMove, alternativeMoves, boardState) {
        if (!myVars.humanMode || !myVars.humanMode.active) {
            return bestMove; // Return the best move if human mode is not active
        }

        // Validate boardState
        if (!Array.isArray(boardState) || boardState.length !== 8 || !boardState.every(row => Array.isArray(row) && row.length === 8)) {
            console.error('Invalid boardState:', boardState);
            return bestMove; // Return the best move if boardState is invalid
        }

        const { errorRate, blunderRate } = myVars.humanMode;

        // Calculate thinking time based on the current board state
        const thinkingTime = calculateThinkingTime(boardState);

        // Function to select a move based on human-like error rates
        const selectMove = () => {
            const random = Math.random();

            // Simulate a blunder (choosing a bad move)
            if (random < blunderRate && alternativeMoves.length > 2) {
                // Pick one of the worst moves
                const worstMoves = alternativeMoves.slice(-2);
                return worstMoves[Math.floor(Math.random() * worstMoves.length)];
            }
            // Otherwise, return the best move
            return bestMove;
        };

        // Return a promise that resolves after the thinking time
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(selectMove());
            }, thinkingTime);
        });
    }

    // Function to extract opponent's rating from the page
    function extractOpponentRating() {
        // Try to find the opponent's rating using the new selector
        try {
            // Try the new selector first
            const ratingElement = document.querySelector("#board-layout-player-top .cc-user-rating-white");
            if (ratingElement) {
                const ratingText = ratingElement.textContent.trim();
                const ratingMatch = ratingText.match(/\((\d+)\)/);
                if (ratingMatch && ratingMatch[1]) {
                    const rating = parseInt(ratingMatch[1]);
                    if (!isNaN(rating)) {
                        console.log(`Opponent rating detected: ${rating}`);
                        return rating;
                    }
                }
            }

            // Fallback to old selector if new one fails
            const ratingElements = document.querySelectorAll('.user-tagline-rating');
            if (ratingElements.length >= 2) {
                // Find the element that doesn't match the player's username
                const playerUsername = document.querySelector('.user-username-component')?.textContent.trim();

                for (const element of ratingElements) {
                    const usernameElement = element.closest('.user-tagline')?.querySelector('.user-username-component');
                    if (usernameElement && usernameElement.textContent.trim() !== playerUsername) {
                        const rating = parseInt(element.textContent.trim());
                        if (!isNaN(rating)) {
                            console.log(`Opponent rating detected (fallback): ${rating}`);
                            return rating;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error extracting opponent rating:', error);
        }

        return null;
    }

    // Function to update fusion mode status
    myFunctions.updateFusionMode = function(enabled) {
        const fusionModeStatus = document.getElementById('fusionModeStatus');
        if (fusionModeStatus) {
            fusionModeStatus.textContent = enabled ? 'On' : 'Off';
            fusionModeStatus.style.color = enabled ? '#4CAF50' : '#666';
        }

        // Store previous ELO when enabling fusion mode
        if (enabled && !myVars.fusionMode) {
            myVars.previousEloRating = myVars.eloRating;
        }

        myVars.fusionMode = enabled;

        if (enabled) {
            // Start polling for opponent ELO changes
            myVars.pollingInterval = setInterval(() => {
                const currentOpponentRating = extractOpponentRating(); // Get the current opponent rating
                if (currentOpponentRating !== myVars.previousOpponentRating) {
                    myVars.isNewGame = true; // Set new game flag
                    myVars.previousOpponentRating = currentOpponentRating; // Update previous opponent rating

                    // Update the ELO slider to match opponent rating
                    if ($('#eloSlider')[0]) {
                        // Clamp the rating to the slider's min/max values
                        const clampedRating = Math.max(1000, Math.min(3000, currentOpponentRating));
                        $('#eloSlider')[0].value = clampedRating;
                        $('#eloValue')[0].textContent = clampedRating;
                        myVars.eloRating = clampedRating;

                        // Set the engine ELO
                        setEngineElo(clampedRating);
                    }
                }
            }, 2000); // Check every 2 seconds
        } else {
            // Stop polling when fusion mode is disabled
            clearInterval(myVars.pollingInterval);

            // Restore previous ELO setting when disabling fusion mode
            if (myVars.previousEloRating) {
                if ($('#eloSlider')[0]) {
                    $('#eloSlider')[0].value = myVars.previousEloRating;
                    $('#eloValue')[0].textContent = myVars.previousEloRating;
                    myVars.eloRating = myVars.previousEloRating;

                    // Set the engine ELO back to previous value
                    setEngineElo(myVars.previousEloRating);
                }
            }

            // Reset the opponent rating info text
            const opponentRatingInfo = document.getElementById('opponentRatingInfo');
            if (opponentRatingInfo) {
                opponentRatingInfo.textContent = 'When enabled, the engine will play at the same rating as your opponent';
            }
        }
    }

    // Function to update human mode status
    myFunctions.updateHumanMode = function(enabled) {
        const humanModeStatus = document.getElementById('humanModeStatus');
        if (humanModeStatus) {
            humanModeStatus.textContent = enabled ? 'On' : 'Off';
            humanModeStatus.style.color = enabled ? '#4CAF50' : '#666';
        }

        // Store previous ELO when enabling human mode
        if (enabled && !myVars.humanMode?.active) {
            myVars.previousEloRating = myVars.eloRating;
        }

        if (enabled) {
            // Apply the selected human mode level
            const level = $('#humanModeSelect').val() || 'intermediate';
            setHumanMode(level);
        } else {
            // Disable human mode
            if (myVars.humanMode) {
                myVars.humanMode.active = false;
            }

            // Restore previous ELO setting when disabling human mode
            if (myVars.previousEloRating) {
                if ($('#eloSlider')[0]) {
                    $('#eloSlider')[0].value = myVars.previousEloRating;
                    $('#eloValue')[0].textContent = myVars.previousEloRating;
                    myVars.eloRating = myVars.previousEloRating;

                    // Set the engine ELO back to previous value
                    setEngineElo(myVars.previousEloRating);
                }
            }

            // Reset the human mode info text
            const humanModeInfo = document.getElementById('humanModeInfo');
            if (humanModeInfo) {
                humanModeInfo.textContent = 'When enabled, the engine will play like a human with realistic mistakes and timing';
            }
        }
    }

    // Function to update engine ELO from UI
    myFunctions.updateEngineElo = function() {
        const eloValue = parseInt($('#eloSlider')[0].value);
        $('#eloValue')[0].textContent = eloValue;
        myVars.eloRating = eloValue;

        if(engine.engine) {
            setEngineElo(eloValue);
        }

        // Update the depth slider if it exists
        if ($('#depthSlider')[0] && myVars.maxDepthForElo !== undefined) {
            // If current depth is higher than max allowed for this ELO, adjust it
            if (parseInt($('#depthSlider')[0].value) > myVars.maxDepthForElo) {
                $('#depthSlider')[0].value = myVars.maxDepthForElo;
                $('#depthText')[0].innerHTML = "Current Depth: <strong>" + myVars.maxDepthForElo + "</strong>";

                // Re-add the depth note
                const depthNote = document.getElementById('depthNote');
                if (depthNote && $('#depthText')[0]) {
                    $('#depthText')[0].appendChild(depthNote);
                }
            }
        }
    }

    var lastValue = 11;
    // Opening book functionality
    myVars.openingBook = null;
    myVars.useOpeningBook = true; // Default to using opening book
    myVars.selectedOpeningRepertoire = 'mixed'; // Default to mixed repertoire
    myVars.lastMoveFromBook = false; // Track if last move was from opening book
    myVars.showOpeningDisplay = true; // Default to showing opening names
    myVars.openingRepertoires = null; // Will store categorized openings
    myVars.maxOpeningBookMoves = 10; // Maximum number of moves to follow from opening book
    
    myFunctions.fetchOpeningBook = async function() {
        try {
            const response = await fetch('https://api.jsonsilo.com/public/0534bf73-ade1-41dc-817d-74581d4b2331');
            const data = await response.json();
            myVars.openingBook = data;
            console.log('Opening book loaded with', Object.keys(data).length, 'positions');

            // Analyze and categorize the openings
            myFunctions.categorizeOpenings(data);

            return data;
        } catch (error) {
            console.error('Failed to fetch opening book:', error);
            myVars.openingBook = null;
            return null;
        }
    };

    // Function to analyze opening book and categorize openings by first moves
    myFunctions.categorizeOpenings = function(openingBook) {
        const repertoires = {
            kings_pawn: [],
            queens_pawn: [],
            english: [],
            flank: [],
            other: []
        };

        // Analyze each opening in the book
        let categorizedCount = 0;
        let kingsePawnCount = 0;
        Object.values(openingBook).forEach(position => {
            if (!position.name || !position.moves) return;

            const openingName = position.name.toLowerCase();
            const moves = position.moves.trim();

            // Extract the first move from the moves string
            const firstMove = myFunctions.extractFirstMove(moves);

            if (firstMove) {
                categorizedCount++;
                // Categorize based on the first move
                if (firstMove === 'e4') {
                    repertoires.kings_pawn.push(openingName);
                    kingsePawnCount++;
                    if (kingsePawnCount <= 5) { // Log first 5 King's Pawn openings for debugging
                        console.log('King\'s Pawn opening categorized:', {
                            name: openingName,
                            moves: moves,
                            firstMove: firstMove
                        });
                    }
                } else if (firstMove === 'd4') {
                    repertoires.queens_pawn.push(openingName);
                } else if (firstMove === 'c4' || firstMove === 'Nf3') {
                    repertoires.english.push(openingName);
                } else if (['g3', 'b3', 'f4', 'Nc3', 'b4'].includes(firstMove)) {
                    repertoires.flank.push(openingName);
                } else {
                    repertoires.other.push(openingName);
                }
            } else {
                console.log('Could not extract first move from:', {
                    name: position.name,
                    moves: moves
                });
            }
        });

        console.log('Opening categorization complete:', {
            totalPositions: Object.keys(openingBook).length,
            categorizedPositions: categorizedCount,
            kingsePawnOpenings: kingsePawnCount
        });

        // Remove duplicates and store
        Object.keys(repertoires).forEach(key => {
            repertoires[key] = [...new Set(repertoires[key])];
        });

        myVars.openingRepertoires = repertoires;

        console.log('Opening repertoires categorized:', {
            'King\'s Pawn (1.e4)': repertoires.kings_pawn.length,
            'Queen\'s Pawn (1.d4)': repertoires.queens_pawn.length,
            'English Opening': repertoires.english.length,
            'Flank Openings': repertoires.flank.length,
            'Other': repertoires.other.length
        });

        // Update the dropdown options with actual counts
        myFunctions.updateRepertoireDropdown();

        // Send repertoires data to server if external window is open
        if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
            myFunctions.sendServerUpdate();
        }
    };

    // Function to extract the first move from a moves string
    myFunctions.extractFirstMove = function(movesString) {
        if (!movesString) return null;

        // Split by spaces and filter out move numbers
        const parts = movesString.trim().split(/\s+/);
        const moves = parts.filter(part => !part.match(/^\d+\.$/));

        if (moves.length === 0) return null;

        // Return the first actual move, cleaned of annotations
        return moves[0].replace(/[+#!?]/g, '');
    };

    // Function to get the next move from an opening sequence based on current position
    myFunctions.getNextMoveFromOpeningSequence = function(movesString, currentFEN) {
        if (!movesString || !currentFEN) return null;

        try {
            // Parse the moves string to get all moves
            const parts = movesString.trim().split(/\s+/);
            const moves = parts.filter(part => !part.match(/^\d+\.$/));

            if (moves.length === 0) return null;

            console.log('Parsing opening sequence:', {
                fullSequence: movesString,
                parsedMoves: moves,
                currentFEN: currentFEN
            });

            // Count the number of moves played so far by analyzing the FEN
            // The FEN format includes the move number at the end
            const fenParts = currentFEN.split(' ');
            const moveNumber = parseInt(fenParts[5]) || 1; // Full move number
            const activeColor = fenParts[1]; // 'w' for white, 'b' for black

            // Calculate the move index in the sequence
            // Move 1: White plays move 0, Black plays move 1
            // Move 2: White plays move 2, Black plays move 3
            // etc.
            let moveIndex;
            if (activeColor === 'w') {
                // It's White's turn, so we need the White move for this move number
                moveIndex = (moveNumber - 1) * 2;
            } else {
                // It's Black's turn, so we need the Black move for this move number
                moveIndex = (moveNumber - 1) * 2 + 1;
            }

            console.log('Move calculation:', {
                moveNumber: moveNumber,
                activeColor: activeColor,
                calculatedMoveIndex: moveIndex,
                totalMovesInSequence: moves.length
            });

            // Check if we've exceeded the maximum opening book moves
            const totalMovesPlayed = Math.floor((moveIndex + 1) / 2) + (moveIndex % 2);
            if (totalMovesPlayed > myVars.maxOpeningBookMoves) {
                console.log(`Reached maximum opening book moves limit (${myVars.maxOpeningBookMoves}), switching to engine`);
                return null;
            }

            // Check if we have a move at this index
            if (moveIndex >= 0 && moveIndex < moves.length) {
                const nextMove = moves[moveIndex].replace(/[+#!?]/g, ''); // Clean annotations
                console.log('Found next move in sequence:', {
                    move: nextMove,
                    moveIndex: moveIndex,
                    totalMovesPlayed: totalMovesPlayed,
                    maxAllowed: myVars.maxOpeningBookMoves
                });
                return nextMove;
            } else {
                console.log('Move index out of bounds, sequence complete or invalid');
                return null;
            }

        } catch (error) {
            console.error('Error parsing opening sequence:', error);
            return null;
        }
    };
    
    // Function to get the first move based on selected repertoire
    myFunctions.getFirstMoveFromRepertoire = function() {
        if (!myVars.selectedOpeningRepertoire || myVars.selectedOpeningRepertoire === 'mixed') {
            // For mixed repertoire, randomly choose between the main opening moves
            const firstMoves = [
                { move: 'e2e4', name: "King's Pawn Opening" },
                { move: 'd2d4', name: "Queen's Pawn Opening" },
                { move: 'g1f3', name: "Réti Opening" },
                { move: 'c2c4', name: "English Opening" }
            ];
            const randomChoice = firstMoves[Math.floor(Math.random() * firstMoves.length)];
            console.log('Mixed repertoire: randomly selected', randomChoice.name, '(' + randomChoice.move + ')');
            return { move: randomChoice.move, name: randomChoice.name };
        }

        // Map repertoire to first move options with names
        const repertoireFirstMoves = {
            'kings_pawn': [
                { move: 'e2e4', name: "King's Pawn Opening" },
                { move: 'e2e4', name: "King's Pawn Opening" }, // Weight e4 more heavily
                { move: 'e2e4', name: "King's Pawn Opening" }
            ],
            'queens_pawn': [
                { move: 'd2d4', name: "Queen's Pawn Opening" },
                { move: 'd2d4', name: "Queen's Pawn Opening" }, // Weight d4 more heavily
                { move: 'g1f3', name: "Queen's Pawn: Réti System" },
                { move: 'c2c4', name: "Queen's Pawn: English Transposition" }
            ],
            'english': [
                { move: 'c2c4', name: "English Opening" },
                { move: 'c2c4', name: "English Opening" }, // Weight c4 more heavily
                { move: 'g1f3', name: "English Opening: Réti System" },
                { move: 'g1f3', name: "English Opening: King's Indian Attack" }
            ],
            'flank': [
                { move: 'g1f3', name: "Réti Opening" },
                { move: 'g1f3', name: "King's Indian Attack" },
                { move: 'b2b3', name: "Nimzo-Larsen Attack" },
                { move: 'f2f4', name: "Dutch Attack" },
                { move: 'g2g3', name: "Benko Opening" },
                { move: 'b1c3', name: "Van't Kruijs Opening" }
            ],
            'other': [
                { move: 'g1f3', name: "Réti Opening" },
                { move: 'b1c3', name: "Van't Kruijs Opening" },
                { move: 'f2f4', name: "Dutch Attack" },
                { move: 'g2g3', name: "Benko Opening" },
                { move: 'b2b3', name: "Nimzo-Larsen Attack" },
                { move: 'h2h3', name: "Clemenz Opening" }
            ]
        };

        const choices = repertoireFirstMoves[myVars.selectedOpeningRepertoire];
        if (!choices || choices.length === 0) {
            // Fallback to Réti Opening if repertoire not found
            const fallback = { move: 'g1f3', name: "Réti Opening" };
            console.log(`Repertoire ${myVars.selectedOpeningRepertoire} not found, using fallback:`, fallback.name, '(' + fallback.move + ')');
            return fallback;
        }

        const choice = choices[Math.floor(Math.random() * choices.length)];
        console.log(`Selected first move for ${myVars.selectedOpeningRepertoire} repertoire:`, choice.name, '(' + choice.move + ')');
        return choice;
    };

    myFunctions.getOpeningMove = function(fen) {
        if (!myVars.useOpeningBook || !myVars.openingBook) {
            console.log('Opening book not available:', {
                useOpeningBook: myVars.useOpeningBook,
                openingBookLoaded: !!myVars.openingBook
            });
            return null;
        }

        // Check if this is the starting position (AI going first)
        const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        if (fen === startingFEN) {
            console.log('Starting position detected, selecting first move from repertoire');
            const firstMoveChoice = myFunctions.getFirstMoveFromRepertoire();
            if (firstMoveChoice) {
                console.log('Using opening book move:', firstMoveChoice.name, '(' + firstMoveChoice.move + ')');
                myVars.lastMoveFromBook = true;
                return firstMoveChoice.move;
            }
        }

        // Check if current position is in opening book
        const position = myVars.openingBook[fen];
        if (position && position.moves) {
            console.log('Position found in opening book:', {
                name: position.name,
                eco: position.eco,
                moves: position.moves,
                selectedRepertoire: myVars.selectedOpeningRepertoire
            });

            // Check if this opening matches the selected repertoire
            const isInRepertoire = myFunctions.isOpeningInRepertoire(position);
            console.log('Repertoire check result:', {
                isInRepertoire: isInRepertoire,
                openingName: position.name,
                selectedRepertoire: myVars.selectedOpeningRepertoire,
                availableRepertoires: myVars.openingRepertoires ? Object.keys(myVars.openingRepertoires) : 'not loaded'
            });

            if (!isInRepertoire) {
                console.log('Opening not in selected repertoire, skipping');
                return null;
            }

            // The opening book structure might contain the full game moves
            // We need to find the next move to play from the current position
            const nextMove = myFunctions.getNextMoveFromOpeningSequence(position.moves, fen);

            if (nextMove) {
                // Convert algebraic notation to UCI format if needed
                const uciMove = myFunctions.algebraicToUci(nextMove, fen);

                // Create a descriptive name for the console log
                const ecoText = position.eco ? ` (${position.eco})` : '';
                console.log('Using opening book move:', `${position.name}${ecoText} - ${nextMove} (${uciMove})`);

                console.log('Opening book move details:', {
                    name: position.name,
                    eco: position.eco,
                    move: nextMove,
                    uci: uciMove,
                    fullSequence: position.moves,
                    repertoire: myVars.selectedOpeningRepertoire
                });

                // Mark that this move is from the opening book
                myVars.lastMoveFromBook = true;

                return uciMove;
            } else {
                console.log('Could not determine next move from opening sequence:', position.moves);
            }
        } else {
            console.log('Position not found in opening book for FEN:', fen);

            // Debug: Show some sample FENs from the opening book to understand the structure
            if (myVars.openingBook && Object.keys(myVars.openingBook).length > 0) {
                const sampleFENs = Object.keys(myVars.openingBook).slice(0, 3);
                console.log('Sample FENs in opening book:', sampleFENs);
            }
        }

        return null;
    };

    // Function to check if an opening matches the selected repertoire
    myFunctions.isOpeningInRepertoire = function(position) {
        console.log('Checking if opening is in repertoire:', {
            selectedRepertoire: myVars.selectedOpeningRepertoire,
            openingName: position.name,
            hasRepertoireData: !!myVars.openingRepertoires
        });

        if (myVars.selectedOpeningRepertoire === 'mixed') {
            console.log('Mixed repertoire selected, allowing all openings');
            return true; // Mixed repertoire includes all openings
        }

        if (!myVars.openingRepertoires || !position.name) {
            console.log('Missing repertoire data or opening name:', {
                hasRepertoires: !!myVars.openingRepertoires,
                hasOpeningName: !!position.name
            });
            return false; // No repertoire data or opening name
        }

        const repertoire = myVars.openingRepertoires[myVars.selectedOpeningRepertoire];
        if (!repertoire) {
            console.log('Selected repertoire not found:', {
                selectedRepertoire: myVars.selectedOpeningRepertoire,
                availableRepertoires: Object.keys(myVars.openingRepertoires)
            });
            return false;
        }

        const openingNameLower = position.name.toLowerCase();
        const isIncluded = repertoire.includes(openingNameLower);

        console.log('Repertoire check details:', {
            openingName: position.name,
            openingNameLower: openingNameLower,
            selectedRepertoire: myVars.selectedOpeningRepertoire,
            repertoireSize: repertoire.length,
            isIncluded: isIncluded,
            repertoireSample: repertoire.slice(0, 5) // Show first 5 entries for debugging
        });

        // Check if this opening is in the selected repertoire
        return isIncluded;
    };

    // Function to update the repertoire dropdown with actual opening counts
    myFunctions.updateRepertoireDropdown = function() {
        const dropdown = document.getElementById('openingRepertoire');
        if (!dropdown || !myVars.openingRepertoires) return;

        const repertoires = myVars.openingRepertoires;
        const totalOpenings = Object.values(repertoires).reduce((sum, arr) => sum + arr.length, 0);

        // Update dropdown options with actual counts
        dropdown.innerHTML = `
            <option value="mixed">Mixed Repertoire (${totalOpenings} openings)</option>
            <option value="kings_pawn">King's Pawn (1.e4) - ${repertoires.kings_pawn.length} openings</option>
            <option value="queens_pawn">Queen's Pawn (1.d4) - ${repertoires.queens_pawn.length} openings</option>
            <option value="english">English Opening (1.c4/1.Nf3) - ${repertoires.english.length} openings</option>
            <option value="flank">Flank Openings - ${repertoires.flank.length} openings</option>
        `;

        // Restore the selected value
        dropdown.value = myVars.selectedOpeningRepertoire;

        console.log('Updated repertoire dropdown with actual opening counts');
    };

    // Function to get the repertoire display name
    myFunctions.getRepertoireName = function(repertoire) {
        if (!myVars.openingRepertoires) {
            const repertoireNames = {
                'mixed': 'Mixed Repertoire',
                'kings_pawn': "King's Pawn (1.e4)",
                'queens_pawn': "Queen's Pawn (1.d4)",
                'english': 'English Opening',
                'flank': 'Flank Openings'
            };
            return repertoireNames[repertoire] || 'Unknown';
        }

        const repertoires = myVars.openingRepertoires;
        const totalOpenings = Object.values(repertoires).reduce((sum, arr) => sum + arr.length, 0);

        switch (repertoire) {
            case 'mixed':
                return `Mixed Repertoire (${totalOpenings} openings)`;
            case 'kings_pawn':
                return `King's Pawn (1.e4) - ${repertoires.kings_pawn.length} openings`;
            case 'queens_pawn':
                return `Queen's Pawn (1.d4) - ${repertoires.queens_pawn.length} openings`;
            case 'english':
                return `English Opening (1.c4/1.Nf3) - ${repertoires.english.length} openings`;
            case 'flank':
                return `Flank Openings - ${repertoires.flank.length} openings`;
            default:
                return 'Unknown';
        }
    };

    myFunctions.algebraicToUci = function(algebraicMove, fen) {
        // Simple conversion for common moves - this is a basic implementation
        // For a complete implementation, you'd need a full chess library
        try {
            // Remove check/checkmate symbols
            let move = algebraicMove.replace(/[+#]/g, '');
            
            // Handle castling
            if (move === 'O-O') {
                // Determine if white or black to move
                const isWhite = fen.includes(' w ');
                return isWhite ? 'e1g1' : 'e8g8';
            }
            if (move === 'O-O-O') {
                const isWhite = fen.includes(' w ');
                return isWhite ? 'e1c1' : 'e8c8';
            }
            
            // For now, return null for complex moves - engine will handle them
            // A full implementation would parse piece moves, captures, etc.
            return null;
        } catch (error) {
            console.error('Error converting algebraic to UCI:', error);
            return null;
        }
    };
    
    myFunctions.updateOpeningBookStatus = function() {
        const statusElement = $('#openingBookLoadStatus');
        if (myVars.openingBook) {
            const count = Object.keys(myVars.openingBook).length;
            statusElement.text(`Opening book loaded (${count} positions)`);
            statusElement.css('color', '#4CAF50');
        } else {
            statusElement.text('Failed to load opening book');
            statusElement.css('color', '#F44336');
        }
    };

    // Function to get opening information for the current position
    myFunctions.getOpeningInfo = function(fen) {
        if (!myVars.useOpeningBook || !myVars.openingBook) {
            return null;
        }

        // Check if current position is in opening book
        const position = myVars.openingBook[fen];
        if (position && position.name) {
            return {
                name: position.name,
                eco: position.eco || '',
                fen: fen
            };
        }

        return null;
    };

    // Debug function to check opening book status
    myFunctions.debugOpeningBook = function() {
        console.log('=== Opening Book Debug Info ===');
        console.log('Opening book loaded:', !!myVars.openingBook);
        console.log('Opening book enabled:', myVars.useOpeningBook);
        console.log('Selected repertoire:', myVars.selectedOpeningRepertoire);

        if (myVars.openingBook) {
            console.log('Total positions in opening book:', Object.keys(myVars.openingBook).length);
        }

        if (myVars.openingRepertoires) {
            console.log('Repertoire sizes:', {
                'King\'s Pawn': myVars.openingRepertoires.kings_pawn?.length || 0,
                'Queen\'s Pawn': myVars.openingRepertoires.queens_pawn?.length || 0,
                'English': myVars.openingRepertoires.english?.length || 0,
                'Flank': myVars.openingRepertoires.flank?.length || 0,
                'Other': myVars.openingRepertoires.other?.length || 0
            });

            if (myVars.selectedOpeningRepertoire !== 'mixed') {
                const selectedRepertoire = myVars.openingRepertoires[myVars.selectedOpeningRepertoire];
                if (selectedRepertoire) {
                    console.log(`Selected repertoire (${myVars.selectedOpeningRepertoire}) contains:`, selectedRepertoire.slice(0, 10));
                }
            }
        } else {
            console.log('Repertoires not loaded');
        }

        // Test first move selection
        const firstMoveChoice = myFunctions.getFirstMoveFromRepertoire();
        console.log('First move for selected repertoire:', firstMoveChoice?.name, '(' + firstMoveChoice?.move + ')');

        if (board) {
            const currentFEN = board.game.getFEN();
            console.log('Current FEN:', currentFEN);

            // Check if this is starting position
            const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            console.log('Is starting position:', currentFEN === startingFEN);

            const position = myVars.openingBook?.[currentFEN];
            if (position) {
                console.log('Current position in opening book:', {
                    name: position.name,
                    eco: position.eco,
                    moves: position.moves
                });
                console.log('Is in selected repertoire:', myFunctions.isOpeningInRepertoire(position));
            } else {
                console.log('Current position not in opening book');
            }

            // Test what move would be selected
            const suggestedMove = myFunctions.getOpeningMove(currentFEN);
            console.log('Suggested opening move:', suggestedMove);
        }
        console.log('=== End Debug Info ===');
    };

    // Function to update the opening display
    myFunctions.updateOpeningDisplay = function(openingInfo) {
        if (!myVars.showOpeningDisplay) return;

        const openingDisplay = document.getElementById('openingDisplay');
        if (!openingDisplay) return;

        if (openingInfo && openingInfo.name) {
            // Store current opening info
            myVars.currentOpening = openingInfo;

            // Determine if we're in book or using engine
            const inBookText = myVars.lastMoveFromBook ?
                '<span style="color: #4CAF50; font-size: 10px;">📖 In Book</span>' :
                '<span style="color: #FF9800; font-size: 10px;">🔧 Engine</span>';

            // Update display content
            const ecoText = openingInfo.eco ? ` (${openingInfo.eco})` : '';
            openingDisplay.innerHTML = `
                <div style="font-weight: 600; font-size: 13px; color: #2c3e50; margin-bottom: 2px;">
                    ${openingInfo.name}
                </div>
                <div style="font-size: 11px; color: #7f8c8d; display: flex; justify-content: space-between; align-items: center;">
                    <span>${ecoText}</span>
                    ${inBookText}
                </div>
            `;
            openingDisplay.style.display = 'block';

            console.log('Opening detected:', openingInfo.name, ecoText, myVars.lastMoveFromBook ? '(In Book)' : '(Engine)');
        } else {
            // Hide display if no opening detected
            openingDisplay.style.display = 'none';
            myVars.currentOpening = null;
        }
    };

    // Function to manually check and update opening display (for testing)
    myFunctions.checkCurrentOpening = function() {
        if (!board || !myVars.useOpeningBook || !myVars.openingBook) {
            console.log('Cannot check opening: board not ready or opening book not loaded');
            return;
        }

        try {
            const currentFEN = board.game.getFEN();
            const openingInfo = myFunctions.getOpeningInfo(currentFEN);
            myFunctions.updateOpeningDisplay(openingInfo);

            if (openingInfo) {
                console.log('Current opening:', openingInfo);
            } else {
                console.log('No opening detected for current position');
            }
        } catch (error) {
            console.error('Error checking current opening:', error);
        }
    };

    myFunctions.runChessEngine = async function(depth){
        // Use the depth from slider if no specific depth is provided
        if (depth === undefined) {
            depth = parseInt($('#depthSlider')[0].value);
        }

        // Ensure depth doesn't exceed the max for current ELO
        if (myVars.maxDepthForElo !== undefined && depth > myVars.maxDepthForElo) {
            depth = myVars.maxDepthForElo;
            console.log(`Depth limited to ${depth} based on current ELO setting`);
        }

        var fen = board.game.getFEN();

        // Check for opening information and update display
        if (myVars.useOpeningBook && myVars.openingBook) {
            const openingInfo = myFunctions.getOpeningInfo(fen);
            myFunctions.updateOpeningDisplay(openingInfo);
        }

        // Check opening book first
        if (myVars.useOpeningBook) {
            // Load opening book if not already loaded
            if (!myVars.openingBook) {
                await myFunctions.fetchOpeningBook();
            }

            const openingMove = myFunctions.getOpeningMove(fen);
            if (openingMove) {
                console.log('Using opening book move:', openingMove);
                // Simulate engine response with opening move
                setTimeout(() => {
                    myVars.bestMove = openingMove;
                    myFunctions.color(openingMove);
                    isThinking = false;
                    myVars.engineRunning = false;

                    // Update auto run status if auto run is enabled
                    if (myVars.autoRun) {
                        myFunctions.updateAutoRunStatus('on');
                    }

                    // Update the server if external window is open
                    if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                        myFunctions.sendServerUpdate();
                    }
                }, 100); // Small delay to simulate thinking
                return;
            }
        }

        // Reset topMoves array before starting a new analysis
        myVars.topMoves = [];
        console.log("Reset topMoves array before analysis");

        // Set MultiPV mode if multiple moves are enabled
        if (myVars.showMultipleMoves) {
            const multipvValue = myVars.numberOfMovesToShow || 3;
            console.log("Setting MultiPV to", multipvValue);
            engine.engine.postMessage(`setoption name MultiPV value ${multipvValue}`);
        } else {
            // Reset to single PV mode
            console.log("Setting MultiPV to 1 (single move mode)");
            engine.engine.postMessage(`setoption name MultiPV value 1`);
        }

        engine.engine.postMessage(`position fen ${fen}`);
        console.log('updated: ' + `position fen ${fen}`);
        isThinking = true;
        myVars.engineRunning = true; // Set engine running flag for server updates
        engine.engine.postMessage(`go depth ${depth}`);
        lastValue = depth;

        // Update the depth text
        if ($('#depthText')[0]) {
            $('#depthText')[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";

            // Re-add the depth note if it exists
            const depthNote = document.getElementById('depthNote');
            if (depthNote && $('#depthText')[0]) {
                $('#depthText')[0].appendChild(depthNote);
            }
        }

        // Update the slider value to match
        if ($('#depthSlider')[0]) {
            $('#depthSlider')[0].value = depth;
        }

        // Update the server if external window is open
        if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
            // Store the current FEN for server updates
            myVars.chess = { fen: function() { return fen; } };
            myVars.bestMove = ''; // Reset best move
            myFunctions.sendServerUpdate();
        }
    }

    myFunctions.autoRun = function(lstValue){
        // Double-check turn state to prevent race conditions
        const currentGameTurn = board.game.getTurn();
        const playingAs = board.game.getPlayingAs();
        const isPlayerTurn = currentGameTurn == playingAs;

        console.log(`[AUTO RUN DEBUG] autoRun called with depth ${lstValue}`);
        console.log(`[AUTO RUN DEBUG] currentGameTurn: ${currentGameTurn}, playingAs: ${playingAs}, isPlayerTurn: ${isPlayerTurn}`);
        console.log(`[AUTO RUN DEBUG] myTurn: ${myTurn}, isThinking: ${isThinking}`);

        // Only run if it's the player's turn and not already thinking
        if(isPlayerTurn && !isThinking){
            console.log(`[AUTO RUN DEBUG] Conditions met, starting engine at depth ${lstValue}`);
            myFunctions.updateAutoRunStatus('running');
            myFunctions.runChessEngine(lstValue);
        } else {
            console.log(`[AUTO RUN DEBUG] Auto run skipped - isPlayerTurn: ${isPlayerTurn}, isThinking: ${isThinking}`);
            if (myVars.autoRun) {
                myFunctions.updateAutoRunStatus('waiting');
            }
        }
    }

    document.onkeydown = function(e) {
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

    myFunctions.spinner = function() {
        if(isThinking == true){
            $('#overlay')[0].style.display = 'block';
        }
        if(isThinking == false) {
            $('#overlay')[0].style.display = 'none';
        }
    }

    let dynamicStyles = null;

    function addAnimation(body) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement('style');
            dynamicStyles.type = 'text/css';
            document.head.appendChild(dynamicStyles);
        }

        dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }


    var loaded = false;
    myFunctions.loadEx = function(){
        try{
            var tmpStyle;
            var tmpDiv;
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            myVars.board = board;

            // Create evaluation bar container with chess.com-like styling
            var evalBarContainer = document.createElement('div');
            evalBarContainer.id = 'evalBarContainer';
            evalBarContainer.style = `
                position: absolute;
                left: -30px;
                top: 0;
                width: 24px;
                height: 100%;
                background-color: #2a2a2a;
                border: none;
                border-radius: 3px;
                overflow: hidden;
                z-index: 100;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;

            // Create the actual evaluation bar with improved styling
            evalBar = document.createElement('div');
            evalBar.id = 'evalBar';
            evalBar.style = `
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 50%;
                background-color: #9E9E9E;
                transition: height 0.25s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.25s ease;
                background-image:
                    linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05)),
                    linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
                background-size: 100% 100%, 100% 5%;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
            `;

            // Create a center line for the evaluation bar
            const centerLine = document.createElement('div');
            centerLine.style = `
                position: absolute;
                top: 50%;
                width: 100%;
                height: 1px;
                background-color: rgba(255,255,255,0.3);
                z-index: 1;
            `;

            // Create evaluation text with improved styling
            evalText = document.createElement('div');
            evalText.id = 'evalText';
            evalText.style = `
                position: absolute;
                top: -30px;
                left: -5px;
                width: 34px;
                text-align: center;
                font-weight: bold;
                font-size: 13px;
                color: #fff;
                background-color: #2a2a2a;
                padding: 4px;
                border-radius: 3px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                z-index: 101;
                font-family: 'Roboto Mono', monospace;
                transition: color 0.25s ease;
            `;
            evalText.textContent = '0.0';

            // Create centipawn scale markers with improved styling
            const scaleMarkers = document.createElement('div');
            scaleMarkers.style = `
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                pointer-events: none;
                font-family: 'Roboto Mono', monospace;
            `;

            // Add more precise scale markers (chess.com style)
            const markerPositions = [
                { value: '+5', position: 0 },      // +5.0
                { value: '+3', position: 20 },     // +3.0
                { value: '+2', position: 30 },     // +2.0
                { value: '+1', position: 40 },     // +1.0
                { value: '0', position: 50 },      // 0.0
                { value: '-1', position: 60 },     // -1.0
                { value: '-2', position: 70 },     // -2.0
                { value: '-3', position: 80 },     // -3.0
                { value: '-5', position: 100 }     // -5.0
            ];

            markerPositions.forEach(marker => {
                // Create tick mark line
                const tick = document.createElement('div');
                tick.style = `
                    position: absolute;
                    left: 0;
                    top: ${marker.position}%;
                    width: 100%;
                    height: 1px;
                    background-color: rgba(255,255,255,0.15);
                    transform: translateY(-50%);
                `;

                // Only add value labels for major ticks
                if (['+5', '+3', '+1', '0', '-1', '-3', '-5'].includes(marker.value)) {
                    const label = document.createElement('span');
                    label.textContent = marker.value;
                    label.style = `
                        position: absolute;
                        right: -20px;
                        top: ${marker.position}%;
                        transform: translateY(-50%);
                        font-size: 9px;
                        color: rgba(255,255,255,0.6);
                        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    `;
                    scaleMarkers.appendChild(label);
                }

                scaleMarkers.appendChild(tick);
            });

            // Create opening display element
            const openingDisplay = document.createElement('div');
            openingDisplay.id = 'openingDisplay';
            openingDisplay.style = `
                position: absolute;
                top: -70px;
                left: -5px;
                min-width: 120px;
                max-width: 200px;
                padding: 8px 10px;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 102;
                font-family: 'Segoe UI', Arial, sans-serif;
                text-align: center;
                display: none;
                transition: opacity 0.3s ease;
                word-wrap: break-word;
                line-height: 1.3;
            `;

            // Add responsive behavior for smaller screens
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            function handleScreenSizeChange(e) {
                if (e.matches) {
                    // Mobile/tablet view - adjust positioning
                    openingDisplay.style.fontSize = '11px';
                    openingDisplay.style.maxWidth = '150px';
                    openingDisplay.style.padding = '6px 8px';
                } else {
                    // Desktop view - normal sizing
                    openingDisplay.style.fontSize = '13px';
                    openingDisplay.style.maxWidth = '200px';
                    openingDisplay.style.padding = '8px 10px';
                }
            }

            // Initial check and add listener
            handleScreenSizeChange(mediaQuery);
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleScreenSizeChange);
            } else {
                // Fallback for older browsers
                mediaQuery.addListener(handleScreenSizeChange);
            }

            // Add elements to the DOM
            evalBarContainer.appendChild(evalBar);
            evalBarContainer.appendChild(centerLine);
            evalBarContainer.appendChild(scaleMarkers);
            board.parentElement.style.position = 'relative';
            board.parentElement.appendChild(evalBarContainer);
            board.parentElement.appendChild(evalText);
            board.parentElement.appendChild(openingDisplay);
            var evalSparklineCanvas = document.createElement('canvas');
            evalSparklineCanvas.id = 'evalSparklineCanvas';
            evalSparklineCanvas.style = 'position: absolute; bottom: -30px; left: -5px; width: 160px; height: 26px; z-index: 101; border-radius: 3px;';
            board.parentElement.appendChild(evalSparklineCanvas);

            // Create main container with header
            var div = document.createElement('div');
            div.setAttribute('style','background-color:white; height:auto; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); padding: 0; max-width: 300px; max-height: 90vh; overflow-y: auto; position: relative; font-family: "Segoe UI", Arial, sans-serif;');
            div.setAttribute('id','settingsContainer');

            // Create header with collapse button
            var header = document.createElement('div');
            header.style = `
                background-color: #2196F3;
                color: white;
                padding: 12px 15px;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                letter-spacing: 0.3px;
            `;
            header.innerHTML = `
                <span style="font-weight: bold; font-size: 15px;">Chess AI Controls</span>
                <span id="collapseBtn" style="transition: transform 0.3s;">▼</span>
            `;
            //div.appendChild(header);


            async function createDraggableHeader(div) {
                // Set initial positioning and z-index
                div.style.position = 'fixed';
                div.style.zIndex = '9999';
                div.style.margin = '0';
                div.style.padding = '0';

                var header = document.createElement('div');
                header.style = `
                    background-color: #2196F3;
                    color: white;
                    padding: 12px 15px;
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    user-select: none;
                `;
                header.innerHTML = `
                    <span id="dragArea" style="font-weight: bold; font-size: 15px; flex-grow: 1; cursor: move;">Chess AI Controls</span>
                    <span id="collapseBtn" style="transition: transform 0.3s;">▼</span>
                `;
                div.appendChild(header);

                // Make the entire div draggable
                let isDragging = false;
                let currentX;
                let currentY;
                let initialX;
                let initialY;
                let xOffset = 0;
                let yOffset = 0;

                // Restore previous position on load
                try {
                    const savedPosition = await GM.getValue('GUI Position', null);
                    if (savedPosition) {
                        xOffset = savedPosition.x;
                        yOffset = savedPosition.y;
                        div.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
                    }
                } catch (error) {
                    console.error('Error loading saved position:', error);
                }

                // Drag area now includes the entire text span
                const dragArea = header.querySelector('#dragArea');

                // Event listeners for dragging
                dragArea.addEventListener('mousedown', dragStart);
                document.addEventListener('mouseup', dragEnd);
                document.addEventListener('mousemove', drag);

                function dragStart(e) {
                    // Prevent default to stop text selection and scrolling
                    e.preventDefault();

                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;

                    isDragging = true;
                }

                function dragEnd(e) {
                    // Prevent default to stop any browser scrolling behavior
                    e.preventDefault();

                    initialX = currentX;
                    initialY = currentY;

                    isDragging = false;

                    // Save the current position
                    try {
                        GM.setValue('GUI Position', { x: xOffset, y: yOffset });
                    } catch (error) {
                        console.error('Error saving position:', error);
                    }
                }

                function drag(e) {
                    if (isDragging) {
                        // Prevent default to stop scrolling and text selection
                        e.preventDefault();

                        // Constrain to viewport
                        currentX = Math.max(0, Math.min(e.clientX - initialX, window.innerWidth - div.offsetWidth));
                        currentY = Math.max(0, Math.min(e.clientY - initialY, window.innerHeight - div.offsetHeight));

                        xOffset = currentX;
                        yOffset = currentY;

                        setTranslate(currentX, currentY, div);
                    }
                }

                function setTranslate(xPos, yPos, el) {
                    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;

                    // After setting position, check if container is too tall for the screen
                    // and adjust position if needed
                    setTimeout(() => {
                        const rect = el.getBoundingClientRect();
                        const windowHeight = window.innerHeight;

                        // If the container extends beyond the bottom of the screen
                        if (rect.bottom > windowHeight) {
                            // Calculate how much we need to move it up
                            const adjustment = Math.min(yPos, rect.bottom - windowHeight + 20);
                            if (adjustment > 0) {
                                yOffset = yPos - adjustment;
                                el.style.transform = `translate3d(${xPos}px, ${yOffset}px, 0)`;

                                // Save the adjusted position
                                try {
                                    GM.setValue('GUI Position', { x: xOffset, y: yOffset });
                                } catch (error) {
                                    console.error('Error saving adjusted position:', error);
                                }
                            }
                        }
                    }, 100);
                }

                return header;
            }

            // Usage example:
             (async () => {
                 //var div = document.createElement('div');
                 await createDraggableHeader(div);
             })();



            // Create content container
            var contentContainer = document.createElement('div');
            contentContainer.id = 'aiControlsContent';
            contentContainer.style = 'padding: 15px; font-family: "Segoe UI", Arial, sans-serif; font-size: 14px; overflow-x: hidden;';

            // Add CSS for tabs
            var tabStyle = document.createElement('style');
            tabStyle.textContent = `
                .tab-container {
                    width: 100%;
                }
                .tab-nav {
                    display: flex;
                    border-bottom: 2px solid #2196F3;
                    margin-bottom: 15px;
                    overflow-x: auto; /* Allow horizontal scrolling if needed */
                    flex-wrap: nowrap; /* Keep tabs in a single row */
                    justify-content: space-between; /* Distribute space evenly */
                    scrollbar-width: thin; /* For Firefox */
                    -ms-overflow-style: none; /* For IE and Edge */
                }
                .tab-nav::-webkit-scrollbar {
                    height: 4px; /* Small scrollbar for webkit browsers */
                }
                .tab-nav::-webkit-scrollbar-thumb {
                    background-color: rgba(33, 150, 243, 0.3);
                    border-radius: 4px;
                }
                .tab-button {
                    padding: 8px 5px; /* Reduce padding to fit all tabs */
                    background-color: #f8f8f8;
                    border: none;
                    border-radius: 8px 8px 0 0;
                    margin-right: 1px; /* Reduce margin between tabs */
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: bold;
                    color: #666;
                    flex: 1;
                    min-width: 60px; /* Ensure minimum width for readability */
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
                    font-size: 12px; /* Reduce font size to fit better */
                    white-space: nowrap; /* Prevent text wrapping */
                }
                .tab-button:hover {
                    background-color: #e9f5ff;
                    color: #2196F3;
                    transform: translateY(-2px);
                }
                .tab-button.active {
                    background-color: #2196F3;
                    color: white;
                    box-shadow: 0 -2px 5px rgba(33,150,243,0.3);
                    transform: translateY(-3px);
                    position: relative;
                }
                .tab-button.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #2196F3;
                }
                .tab-content {
                    display: none;
                    padding: 10px 0;
                }
                .tab-content.active {
                    display: block;
                    animation: fadeIn 0.3s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Responsive design for different screen sizes */
                @media (max-width: 500px) {
                    .tab-button {
                        padding: 8px 5px;
                        font-size: 11px;
                        min-width: 50px;
                    }
                }

                /* Adjust container for different screen heights */
                @media (max-height: 800px) {
                    #settingsContainer {
                        max-height: 80vh !important;
                    }
                }

                @media (max-height: 600px) {
                    #settingsContainer {
                        max-height: 70vh !important;
                    }
                }

                /* Ensure content fits on very small screens */
                @media (max-height: 500px) {
                    #settingsContainer {
                        max-height: 60vh !important;
                    }
                    .tab-content {
                        padding: 5px 0;
                    }
                    input[type="range"] {
                        height: 6px;
                    }
                }

                /* Toggle switch styles */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 46px;
                    height: 24px;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .3s;
                    border-radius: 24px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                input:checked + .slider {
                    background-color: #2196F3;
                }

                input:focus + .slider {
                    box-shadow: 0 0 2px #2196F3;
                }

                input:checked + .slider:before {
                    transform: translateX(22px);
                }

                /* Button styles */
                button {
                    transition: all 0.2s ease;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                button:active {
                    transform: translateY(0);
                }

                /* Input styles */
                input[type="range"] {
                    -webkit-appearance: none;
                    height: 8px;
                    border-radius: 4px;
                    background: #e0e0e0;
                    outline: none;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #2196F3;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #2196F3;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                /* Select styles */
                select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 12px;
                    padding-right: 30px !important;
                    transition: all 0.2s;
                }

                select:focus {
                    border-color: #2196F3;
                    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
                }

                /* Tooltip styles */
                [title] {
                    position: relative;
                }

                [title]:hover::after {
                    content: attr(title);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    white-space: nowrap;
                    z-index: 1000;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(tabStyle);

            var content = `<div style="margin: 0;">
            <!-- Tab Navigation -->
            <div class="tab-container">
                <div class="tab-nav">
                    <button class="tab-button active" data-tab="engine">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Engine
                    </button>
                    <button class="tab-button" data-tab="actions">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Actions
                    </button>
                    <button class="tab-button" data-tab="visual">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Visual
                    </button>
                    <button class="tab-button" data-tab="playstyle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Play
                    </button>
                    <button class="tab-button" data-tab="auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Auto
                    </button>
                </div>

                <!-- Engine Tab -->
                <div id="engine-tab" class="tab-content active">
            <div style="margin-bottom: 15px;">
                        <p id="depthText" style="margin: 0 0 5px 0;">Current Depth: <strong>11</strong></p>
                        <div style="display: flex; align-items: center;">
                            <div style="flex-grow: 1;">
                                <label for="depthSlider" style="display: block; margin-bottom: 5px;">Adjust Depth (1-30):</label>
                <input type="range" id="depthSlider" name="depthSlider" min="1" max="30" step="1" value="11"
                                    oninput="document.getElementById('depthText').innerHTML = 'Current Depth: <strong>' + this.value + '</strong>';"
                                    style="width: 100%;" title="Higher depth = stronger analysis but slower calculation">
                            </div>
                            <button id="applyDepth" style="margin-left: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);" title="Apply the selected depth to the engine">Apply</button>
                        </div>
            </div>

            <div style="margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <label for="eloSlider" style="margin-right: 5px;">Engine ELO Rating: <span id="eloValue">1500</span></label>
                            <button id="eloInfoBtn" title="ELO rating determines the playing strength of the engine" style="margin-left: 5px; padding: 0 5px; background-color: #2196F3; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px;">?</button>
                        </div>
                <input type="range" id="eloSlider" name="eloSlider" min="1000" max="3000" step="50" value="1500"
                               oninput="document.myFunctions.updateEngineElo()" style="width: 100%;">
                        <div id="eloDepthInfo" style="font-size: 12px; color: #666; margin-top: 5px; font-style: italic;">
                    Note: Lower ELO settings will limit the maximum search depth
                        </div>
                </div>
                
                <!-- Opening Book Settings -->
                <div style="margin-bottom: 15px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; border-left: 3px solid #4CAF50;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <label for="useOpeningBook" style="margin-right: 10px; font-weight: bold;">Opening Book:</label>
                        <label class="switch">
                            <input type="checkbox" id="useOpeningBook" checked>
                            <span class="slider"></span>
                        </label>
                        <span id="openingBookStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Enabled</span>
                        <button id="openingBookInfoBtn" title="Opening book provides known good moves for the opening phase of the game" style="margin-left: 5px; padding: 0 5px; background-color: #4CAF50; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px;">?</button>
                    </div>
                    <div id="openingBookInfo" style="font-size: 12px; color: #666; margin-top: 5px;">
                        Uses a database of opening moves to play strong opening theory
                    </div>
                    <div id="openingBookLoadStatus" style="font-size: 11px; color: #999; margin-top: 3px;">
                        Opening book not loaded
                    </div>

                    <!-- Opening Repertoire Selection -->
                    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #ddd;">
                        <label for="openingRepertoire" style="display: block; margin-bottom: 5px; font-weight: bold; color: #2c3e50; font-size: 12px;">Opening Repertoire:</label>
                        <select id="openingRepertoire" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ddd; background-color: black; font-size: 12px;">
                            <option value="mixed">Mixed Repertoire (Loading...)</option>
                            <option value="kings_pawn">King's Pawn (1.e4) - Loading...</option>
                            <option value="queens_pawn">Queen's Pawn (1.d4) - Loading...</option>
                            <option value="english">English Opening (1.c4/1.Nf3) - Loading...</option>
                            <option value="flank">Flank Openings - Loading...</option>
                        </select>
                        <div style="font-size: 10px; color: #666; margin-top: 3px;">
                            Choose which opening style the AI should prioritize when playing as White
                        </div>
                    </div>

                    <!-- Opening Display Toggle -->
                    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #ddd;">
                        <div style="display: flex; align-items: center;">
                            <label for="showOpeningDisplay" style="margin-right: 10px; font-weight: bold; font-size: 12px;">Show Opening Names:</label>
                            <label class="switch" style="transform: scale(0.8);">
                                <input type="checkbox" id="showOpeningDisplay" checked>
                                <span class="slider"></span>
                            </label>
                            <span id="openingDisplayStatus" style="margin-left: 8px; font-size: 11px; color: #666;">Enabled</span>
                        </div>
                        <div style="font-size: 11px; color: #666; margin-top: 3px;">
                            Display detected opening names near the evaluation bar
                        </div>
                    </div>
                </div>
            </div>

                <!-- Play Style Tab -->
                <div id="playstyle-tab" class="tab-content">
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <!-- Fusion Mode -->
                        <div style="border-left: 3px solid #2196F3; padding-left: 10px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <label for="fusionModeToggle" style="margin-right: 10px; font-weight: bold;">Fusion Mode:</label>
                    <label class="switch">
                        <input type="checkbox" id="fusionMode" name="fusionMode" value="false">
                        <span class="slider"></span>
                    </label>
                    <span id="fusionModeStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                </div>
                <div id="opponentRatingInfo" style="font-size: 12px; color: #666; margin-top: 5px;">
                                When enabled, the engine will match your opponent's rating
                </div>
            </div>

                        <!-- Human Mode -->
                        <div style="border-left: 3px solid #9C27B0; padding-left: 10px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <label for="humanModeToggle" style="margin-right: 10px; font-weight: bold;">Human Mode:</label>
                    <label class="switch">
                        <input type="checkbox" id="humanMode" name="humanMode" value="false">
                        <span class="slider"></span>
                    </label>
                    <span id="humanModeStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                </div>

                <div style="margin-top: 10px;">
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <label for="humanModeSelect" style="margin-right: 5px;">Human Skill Level: <span id="humanModeLevel">Intermediate</span></label>
                                    <button id="humanModeInfoBtn" title="Choose how the engine mimics human play" style="margin-left: 5px; padding: 0 5px; background-color: #9C27B0; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px;">?</button>
                                </div>
                                <select id="humanModeSelect" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; border: 1px solid #ddd;">
                        <option value="beginner">Beginner (ELO ~800)</option>
                        <option value="casual">Casual (ELO ~1200)</option>
                        <option value="intermediate" selected>Intermediate (ELO ~1600)</option>
                        <option value="advanced">Advanced (ELO ~2000)</option>
                        <option value="expert">Expert (ELO ~2400)</option>
                    </select>
                </div>

                <div id="humanAutoMoveContainer" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                     <div style="display: flex; align-items: center;">
                        <label for="humanAutoMove" style="margin-right: 10px; font-weight: bold;">Human Auto Move:</label>
                        <label class="switch">
                            <input type="checkbox" id="humanAutoMove" name="humanAutoMove" value="false">
                            <span class="slider"></span>
                        </label>
                     </div>
                     <div style="font-size: 12px; color: #666; margin-top: 5px; font-style: italic;">
                        Automatically plays moves using human-like timing and logic. Disables standard Clock Sync.
                     </div>
                </div>

                            <div id="humanModeInfo" style="font-size: 12px; color: #666; margin-top: 5px; font-style: italic;">
                    When enabled, the engine will play like a human with realistic mistakes and timing
                            </div>
                        </div>
                </div>
            </div>

                <!-- Visual Settings Tab -->
                <div id="visual-tab" class="tab-content">
            <div style="margin-bottom: 15px;">
                        <label for="evalBarColor" style="display: block; margin-bottom: 5px;">Evaluation Bar Color Theme:</label>
                        <select id="evalBarColor" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    <option value="default">Default (Green/Red)</option>
                    <option value="blue">Blue/Orange</option>
                    <option value="purple">Purple/Yellow</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

                    <div id="customColorContainer" style="display: none; margin-bottom: 15px; padding: 10px; border: 1px dashed #ccc; border-radius: 4px;">
                        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                            <label for="whiteAdvantageColor">White Advantage:</label>
                            <input type="color" id="whiteAdvantageColor" value="#4CAF50" style="width: 40px; height: 30px;">
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <label for="blackAdvantageColor">Black Advantage:</label>
                            <input type="color" id="blackAdvantageColor" value="#F44336" style="width: 40px; height: 30px;">
                        </div>
            </div>

            <div style="margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <input type="checkbox" id="showArrows" name="showArrows" value="true" checked style="margin-right: 8px;">
                            <label for="showArrows"> Show move arrows</label>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <input type="checkbox" id="persistentHighlights" name="persistentHighlights" value="true" checked style="margin-right: 8px;">
                            <label for="persistentHighlights"> Keep highlights until next move</label>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 12px; border-top: 1px solid #eee; padding-top: 10px;">
                            <input type="checkbox" id="useVirtualChessboard" name="useVirtualChessboard" value="false" style="margin-right: 8px;">
                            <label for="useVirtualChessboard"> Use virtual chessboard for move suggestions</label>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; margin-bottom: 15px; font-style: italic;">
                            Displays move suggestions on a virtual chessboard in the Actions tab instead of overlaying them on the main board (helps avoid detection)
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 12px; border-top: 1px solid #eee; padding-top: 10px;">
                            <input type="checkbox" id="useExternalWindow" name="useExternalWindow" value="false" style="margin-right: 8px;">
                            <label for="useExternalWindow"> Open GUI in external window</label>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; font-style: italic;">
                            Opens the Chess AI controls in a separate window or tab (requires local Python server)
                            <br><a href="#" id="downloadServerLink" style="color: #2196F3; text-decoration: underline;">Download the chess_ai_server.py file here</a>
                        </div>
                        <div id="externalWindowOptions" style="display: none; margin-top: 10px; padding: 10px; background-color: #f8f8f8; border-radius: 4px;">
                            <button id="startServerBtn" style="padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Start Local Server</button>
                            <button id="openExternalWindowBtn" style="padding: 8px 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Open External Window</button>
                            <div id="serverStatus" style="margin-top: 8px; font-size: 12px; color: #666;">
                                Server Status: <span id="serverStatusText">Not Running</span>
                            </div>

                            <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
                                <div style="font-weight: bold; margin-bottom: 8px;">Move Indicator Location:</div>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="radio" name="moveIndicatorLocation" value="main" checked style="margin-right: 8px;">
                                        Show on main board only
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="radio" name="moveIndicatorLocation" value="external" style="margin-right: 8px;">
                                        Show on external board only
                                    </label>
                                    <label style="display: flex; align-items: center;">
                                        <input type="radio" name="moveIndicatorLocation" value="both" style="margin-right: 8px;">
                                        Show on both boards
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Move Indicator Style:</label>
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <input type="radio" id="moveIndicatorHighlights" name="moveIndicatorType" value="highlights" checked style="margin-right: 8px;">
                                <label for="moveIndicatorHighlights"> Highlights</label>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <input type="radio" id="moveIndicatorArrows" name="moveIndicatorType" value="arrows" style="margin-right: 8px;">
                                <label for="moveIndicatorArrows"> Arrows</label>
                            </div>
                        </div>

                        <!-- Arrow Color Customization -->
                        <div id="arrowCustomizationContainer" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: none;">
                            <div id="arrowCustomizationSection">
                            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Arrow Customization:</label>
                            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                                <label for="arrowColor">Arrow Color:</label>
                                <input type="color" id="arrowColor" value="#0077CC" style="width: 40px; height: 30px;">
                                <span style="font-size: 12px; color: #666; margin-left: 5px;">(Chess.com style)</span>
                            </div>

                            <!-- Arrow Style Options -->
                            <div style="margin-top: 12px; margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 8px;">Arrow Style:</label>
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <input type="radio" id="arrowStyleCurved" name="arrowStyle" value="curved" checked style="margin-right: 8px;">
                                    <label for="arrowStyleCurved"> Curved arrows (Chess.com style)</label>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <input type="radio" id="arrowStyleStraight" name="arrowStyle" value="straight" style="margin-right: 8px;">
                                    <label for="arrowStyleStraight"> Straight arrows (Classic style)</label>
                                </div>
                            </div>

                            <div style="font-size: 12px; color: #666; margin-top: 15px; font-style: italic;">
                                Customize the color and style of the move arrows
                            </div>
                            </div><!-- End of arrowCustomizationSection -->
                        </div>

                        <!-- Arrow Animation Toggle (Separate from arrow customization) -->
                        <div id="arrowAnimationContainer" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: none;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="arrowAnimation" style="font-weight: bold;">Arrow Animation:</label>
                                <label class="switch" style="margin-left: 10px;">
                                    <input type="checkbox" id="arrowAnimation" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                Enable or disable the arrow drawing animation
                            </div>
                        </div>

                        <!-- Multiple Move Suggestions -->
                        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                                <label for="showMultipleMoves" style="font-weight: bold;">Show Multiple Moves:</label>
                                <label class="switch" style="margin-left: 10px;">
                                    <input type="checkbox" id="showMultipleMoves">
                                    <span class="slider round"></span>
                                </label>
                                <span id="showMultipleMovesStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                            </div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 15px;">
                                Show top 3-5 moves instead of just the best move
                            </div>

                            <div id="multipleMovesOptions" style="display: none; margin-top: 10px; padding: 10px; background-color: #f8f8f8; border-radius: 4px;">
                                <label for="numberOfMovesToShow" style="display: block; margin-bottom: 8px;">Number of moves to show:</label>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <input type="range" id="numberOfMovesToShow" min="2" max="5" value="3" style="flex: 1;">
                                    <span id="numberOfMovesValue" style="min-width: 20px; text-align: center;">3</span>
                                </div>

                                <!-- Multicolor option -->
                                <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                                        <label for="useMulticolorMoves" style="font-weight: bold;">Use different colors:</label>
                                        <label class="switch" style="margin-left: 10px;">
                                            <input type="checkbox" id="useMulticolorMoves">
                                            <span class="slider round"></span>
                                        </label>
                                        <span id="useMulticolorMovesStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                                    </div>
                                    <div style="font-size: 12px; color: #666; margin-bottom: 15px;">
                                        Use different colors for each move instead of varying opacity
                                    </div>

                                    <!-- Color pickers for each move -->
                                    <div id="moveColorOptions" style="display: none; margin-top: 10px;">
                                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;">
                                            <label for="moveColor1" style="font-size: 12px;">Best move:</label>
                                            <input type="color" id="moveColor1" value="#F44336" style="width: 100%;">

                                            <label for="moveColor2" style="font-size: 12px;">2nd best:</label>
                                            <input type="color" id="moveColor2" value="#FF9800" style="width: 100%;">

                                            <label for="moveColor3" style="font-size: 12px;">3rd best:</label>
                                            <input type="color" id="moveColor3" value="#FFEB3B" style="width: 100%;">

                                            <label for="moveColor4" style="font-size: 12px;">4th best:</label>
                                            <input type="color" id="moveColor4" value="#4CAF50" style="width: 100%;">

                                            <label for="moveColor5" style="font-size: 12px;">5th best:</label>
                                            <input type="color" id="moveColor5" value="#2196F3" style="width: 100%;">
                                        </div>
                                    </div>
                                </div>

                                <div id="opacityNote" style="font-size: 12px; color: #666; margin-top: 8px; font-style: italic;">
                                    Opacity of move indicators will reflect move strength
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Automation Tab -->
                <div id="auto-tab" class="tab-content">
                    <div style="margin-bottom: 20px; border-left: 3px solid #FF9800; padding-left: 12px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="autoRunToggle" style="margin-right: 10px; font-weight: bold; color: #FF9800;">Auto Run:</label>
                            <label class="switch">
                                <input type="checkbox" id="autoRun" name="autoRun" value="false">
                                <span class="slider" style="background-color: #ccc;"></span>
                            </label>
                            <span id="autoRunStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                            Automatically runs the engine when it's your turn
                        </div>
                    </div>

                    <div style="margin-bottom: 20px; border-left: 3px solid #4CAF50; padding-left: 12px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="autoMove" style="margin-right: 10px; font-weight: bold; color: #4CAF50;">Auto Move:</label>
                            <label class="switch">
                                <input type="checkbox" id="autoMove" name="autoMove" value="false">
                                <span class="slider" style="background-color: #ccc;"></span>
                            </label>
                            <span id="autoMoveStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                            Automatically plays the best move for you
                        </div>
                        <div id="autoMoveNote" style="display: none; font-size: 11px; color: #856404; margin-top: 8px; padding: 6px; background-color: #fff3cd; border-radius: 4px; border: 1px solid #ffeaa7;">
                            ⚠️ Disabled because Human Auto Move is active
                        </div>

                        <!-- Clock Synchronization Sub-section -->
                        <div id="clockSyncSection" style="margin-top: 15px; padding: 10px; background-color: #f8f8f8; border-radius: 6px; border: 1px solid #e0e0e0;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <label for="clockSync" style="margin-right: 10px; font-weight: bold; color: #4CAF50; font-size: 13px;">Clock Sync:</label>
                                <label class="switch" style="transform: scale(0.8);">
                                    <input type="checkbox" id="clockSync" name="clockSync" value="false">
                                    <span class="slider" style="background-color: #ccc;"></span>
                                </label>
                                <span id="clockSyncStatus" style="margin-left: 8px; font-size: 11px; color: #666;">Off</span>
                            </div>
                            <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                                Matches opponent's time usage patterns when auto move is enabled
                            </div>

                            <!-- Exact Match Toggle -->
                            <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
                                <label for="clockSyncExactMatch" style="margin-right: 8px; font-weight: bold; color: #2196F3; font-size: 12px;">Exact Match:</label>
                                <label class="switch" style="transform: scale(0.7);">
                                    <input type="checkbox" id="clockSyncExactMatch" name="clockSyncExactMatch" value="false">
                                    <span class="slider" style="background-color: #ccc;"></span>
                                </label>
                                <span id="clockSyncExactMatchStatus" style="margin-left: 6px; font-size: 10px; color: #666;">Off</span>
                            </div>
                            <div id="exactMatchDescription" style="font-size: 10px; color: #666; margin-bottom: 8px; font-style: italic;">
                                Precisely matches opponent's remaining time instead of using delay ranges
                            </div>

                            <!-- Time Pressure Override -->
                            <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background-color: #fff3cd; border-radius: 4px; border: 1px solid #ffeaa7;">
                                <label for="clockSyncTimePressure" style="margin-right: 8px; font-weight: bold; color: #856404; font-size: 12px;">Time Pressure:</label>
                                <label class="switch" style="transform: scale(0.7);">
                                    <input type="checkbox" id="clockSyncTimePressure" name="clockSyncTimePressure" value="true" checked>
                                    <span class="slider" style="background-color: #ccc;"></span>
                                </label>
                                <span id="clockSyncTimePressureStatus" style="margin-left: 6px; font-size: 10px; color: #856404;">On</span>
                                <div style="flex: 1; margin-left: 10px;">
                                    <label for="clockSyncTimePressureThreshold" style="display: block; font-size: 10px; margin-bottom: 2px; color: #856404;">Threshold (s):</label>
                                    <input type="number" id="clockSyncTimePressureThreshold" name="clockSyncTimePressureThreshold" min="5" max="120" step="5" value="20" style="width: 60px; padding: 2px; border-radius: 3px; border: 1px solid #ddd; font-size: 10px;">
                                </div>
                            </div>
                            <div style="font-size: 10px; color: #856404; margin-bottom: 8px; font-style: italic;">
                                Automatically uses minimum delay when either player has ≤ threshold seconds remaining
                            </div>

                            <!-- Delay Range Controls (hidden in exact match mode) -->
                            <div id="delayRangeControls" style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                <div style="flex: 1;">
                                    <label for="clockSyncMinDelay" style="display: block; font-size: 10px; margin-bottom: 2px; color: #666;">Min Delay (s):</label>
                                    <input type="number" id="clockSyncMinDelay" name="clockSyncMinDelay" min="0.1" max="30" step="0.1" value="0.5" style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #ddd; font-size: 11px;">
                                </div>
                                <div style="flex: 1;">
                                    <label for="clockSyncMaxDelay" style="display: block; font-size: 10px; margin-bottom: 2px; color: #666;">Max Delay (s):</label>
                                    <input type="number" id="clockSyncMaxDelay" name="clockSyncMaxDelay" min="0.5" max="60" step="0.5" value="10" style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #ddd; font-size: 11px;">
                                </div>
                            </div>
                            <div id="delayRangeDescription" style="font-size: 10px; color: #666; margin-top: 6px; font-style: italic;">
                                Delays moves when you have more time than opponent to appear more human-like
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px; border-left: 3px solid #9C27B0; padding-left: 12px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="autoQueue" style="margin-right: 10px; font-weight: bold; color: #9C27B0;">Auto Queue:</label>
                            <label class="switch">
                                <input type="checkbox" id="autoQueue" name="autoQueue" value="false">
                                <span class="slider" style="background-color: #ccc;"></span>
                            </label>
                            <span id="autoQueueStatus" style="margin-left: 10px; font-size: 12px; color: #666;">Off</span>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                            Automatically clicks "New Game" button when a game ends
                        </div>
                    </div>

                    <div id="autoRunDelaySection" style="margin-top: 15px; background-color: #f8f8f8; padding: 12px; border-radius: 6px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: bold;">Auto Run Delay (Seconds):</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="flex: 1;">
                                <label for="timeDelayMin" style="display: block; font-size: 12px; margin-bottom: 3px;">Minimum:</label>
                                <input type="number" id="timeDelayMin" name="timeDelayMin" min="0.1" value="0.1" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                            </div>
                            <span style="color: #666;">to</span>
                            <div style="flex: 1;">
                                <label for="timeDelayMax" style="display: block; font-size: 12px; margin-bottom: 3px;">Maximum:</label>
                                <input type="number" id="timeDelayMax" name="timeDelayMax" min="0.1" value="1" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 8px; font-style: italic;">
                            Random delay between min and max to simulate human thinking time
                        </div>
                        <div id="autoRunDelayNote" style="display: none; font-size: 11px; color: #856404; margin-top: 8px; padding: 6px; background-color: #fff3cd; border-radius: 4px; border: 1px solid #ffeaa7;">
                            ⚠️ Clock Sync is managing timing - these delays are not used when Clock Sync is enabled
                        </div>
                    </div>
                </div>
            </div>

                <!-- Actions Tab -->
                <div id="actions-tab" class="tab-content">
                    <!-- Virtual Chessboard (only shown when enabled) -->
                    <div id="virtualChessboardContainer" style="display: none; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; padding: 10px; background-color: #f9f9f9;">
                        <div style="font-weight: bold; margin-bottom: 8px; color: #2196F3;">Virtual Chessboard</div>
                        <div id="virtualChessboard" style="width: 100%; aspect-ratio: 1; position: relative; margin-bottom: 10px; border: 1px solid #ccc; background-color: #fff;"></div>
                        <div style="font-size: 12px; color: #666; text-align: center;">
                            Move suggestions are shown here instead of on the main board
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button id="runEngineBtn" style="flex: 1; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(76, 175, 80, 0.3);">
                            <span style="display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Run Engine
                            </span>
                        </button>
                        <button id="stopEngineBtn" style="flex: 1; padding: 10px; background-color: #F44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(244, 67, 54, 0.3);">
                            <span style="display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                    <rect x="6" y="6" width="12" height="12"></rect>
                                </svg>
                                Stop Engine
                            </span>
                        </button>
                    </div>

                    <button id="saveSettingsBtn" style="width: 100%; padding: 10px; background-color: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);">
                        <span style="display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Settings
                        </span>
                    </button>

                    <button id="showKeyboardShortcuts" style="width: 100%; padding: 10px; background-color: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(156, 39, 176, 0.3); margin-bottom: 15px;">
                        <span style="display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                                <line x1="6" y1="8" x2="6" y2="8"></line>
                                <line x1="10" y1="8" x2="10" y2="8"></line>
                                <line x1="14" y1="8" x2="14" y2="8"></line>
                                <line x1="18" y1="8" x2="18" y2="8"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                                <line x1="6" y1="16" x2="6" y2="16"></line>
                                <line x1="18" y1="16" x2="18" y2="16"></line>
                                <line x1="10" y1="16" x2="14" y2="16"></line>
                            </svg>
                            Keyboard Shortcuts
                        </span>
                    </button>

                    <!-- Engine Move History Section -->
                    <div id="moveHistoryContainer" style="margin-top: 15px; border: 1px solid #ccc; border-radius: 4px; padding: 10px; max-height: 200px; overflow-y: auto;">
                        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #333;">Engine Move History</h3>
                        <table id="moveHistoryTable" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Move</th>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Eval</th>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Depth</th>
                                </tr>
                            </thead>
                            <tbody id="moveHistoryTableBody">
                                <!-- Move history entries will be added here dynamically -->
                            </tbody>
                        </table>
                        <button id="clearHistoryBtn" style="margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear History</button>
                    </div>
                </div>
            </div>
            </div>`;

            contentContainer.innerHTML = content;
            div.appendChild(contentContainer);

            // Move history will be added later in the code

            // Create keyboard shortcuts modal with improved styling
            var keyboardModal = document.createElement('div');
            keyboardModal.id = 'keyboardShortcutsModal';
            keyboardModal.style = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                z-index: 2000;
                justify-content: center;
                align-items: center;
            `;

            var modalContent = document.createElement('div');
            modalContent.style = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            `;

            var closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&times;';
            closeBtn.style = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: #333;
                transition: color 0.2s;
            `;
            closeBtn.onmouseover = function() {
                this.style.color = '#F44336';
            };
            closeBtn.onmouseout = function() {
                this.style.color = '#333';
            };
            closeBtn.onclick = function() {
                keyboardModal.style.display = 'none';
            };

            modalContent.appendChild(closeBtn);

            var shortcutsTitle = document.createElement('h2');
            shortcutsTitle.textContent = 'Keyboard Shortcuts';
            shortcutsTitle.style = 'margin-top: 0; color: #2196F3; border-bottom: 2px solid #eee; padding-bottom: 10px;';
            modalContent.appendChild(shortcutsTitle);

            // Add a brief description
            var shortcutsDescription = document.createElement('p');
            shortcutsDescription.textContent = 'Press any of these keys to quickly run the engine at different depths. Keys are organized by strength level.';
            shortcutsDescription.style = 'margin-bottom: 20px; color: #666;';
            modalContent.appendChild(shortcutsDescription);

            // Add visual keyboard layout
            var keyboardLayout = document.createElement('div');
            keyboardLayout.style = `
                background-color: #f5f5f5;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: center;
                font-family: monospace;
            `;

            keyboardLayout.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; color: #666;">Visual Keyboard Guide</div>
                <div style="display: flex; justify-content: center; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">Q<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #F44336;">1</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">W<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #F44336;">2</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">E<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #F44336;">3</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">R<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">4</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">T<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">5</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">Y<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">6</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">U<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">7</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">I<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">8</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">O<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #FF9800;">9</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">P<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">10</span></div>
                </div>
                <div style="display: flex; justify-content: center; margin-bottom: 8px; margin-left: 20px;">
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">A<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">11</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">S<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">12</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">D<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">13</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">F<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">14</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">G<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #4CAF50;">15</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">H<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #2196F3;">16</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">J<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #2196F3;">17</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">K<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #2196F3;">18</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">L<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #2196F3;">19</span></div>
                </div>
                <div style="display: flex; justify-content: center; margin-left: 40px;">
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">Z<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">20</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">X<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">21</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">C<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">22</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">V<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">23</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">B<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">24</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">N<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">25</span></div>
                    <div style="width: 40px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">M<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #9C27B0;">26</span></div>
                </div>
                <div style="margin-top: 15px; display: flex; justify-content: center;">
                    <div style="width: 80px; height: 40px; background-color: #e0e0e0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 0 2px; position: relative;">=<span style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: #E91E63;">MAX</span></div>
                </div>
                <div style="margin-top: 15px; font-size: 12px;">
                    <span style="color: #F44336;">■</span> Beginner &nbsp;
                    <span style="color: #FF9800;">■</span> Intermediate &nbsp;
                    <span style="color: #4CAF50;">■</span> Advanced &nbsp;
                    <span style="color: #2196F3;">■</span> Expert &nbsp;
                    <span style="color: #9C27B0;">■</span> Master &nbsp;
                    <span style="color: #E91E63;">■</span> Maximum
                </div>
            `;

            modalContent.appendChild(keyboardLayout);

            var shortcutsTable = document.createElement('table');
            shortcutsTable.style = 'width: 100%; border-collapse: collapse;';

            // Create table header
            var tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr style="background-color: #f5f5f5;">
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd; width: 20%;">Key</th>
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Function</th>
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Strength</th>
                </tr>
            `;
            shortcutsTable.appendChild(tableHeader);

            // Create table body with all keyboard shortcuts
            var tableBody = document.createElement('tbody');

            // Define all shortcuts with strength categories
            const shortcuts = [
                { key: 'Q', function: 'Run engine at depth 1', strength: 'Beginner' },
                { key: 'W', function: 'Run engine at depth 2', strength: 'Beginner' },
                { key: 'E', function: 'Run engine at depth 3', strength: 'Beginner' },
                { key: 'R', function: 'Run engine at depth 4', strength: 'Intermediate' },
                { key: 'T', function: 'Run engine at depth 5', strength: 'Intermediate' },
                { key: 'Y', function: 'Run engine at depth 6', strength: 'Intermediate' },
                { key: 'U', function: 'Run engine at depth 7', strength: 'Intermediate' },
                { key: 'I', function: 'Run engine at depth 8', strength: 'Intermediate' },
                { key: 'O', function: 'Run engine at depth 9', strength: 'Intermediate' },
                { key: 'P', function: 'Run engine at depth 10', strength: 'Advanced' },
                { key: 'A', function: 'Run engine at depth 11', strength: 'Advanced' },
                { key: 'S', function: 'Run engine at depth 12', strength: 'Advanced' },
                { key: 'D', function: 'Run engine at depth 13', strength: 'Advanced' },
                { key: 'F', function: 'Run engine at depth 14', strength: 'Advanced' },
                { key: 'G', function: 'Run engine at depth 15', strength: 'Advanced' },
                { key: 'H', function: 'Run engine at depth 16', strength: 'Expert' },
                { key: 'J', function: 'Run engine at depth 17', strength: 'Expert' },
                { key: 'K', function: 'Run engine at depth 18', strength: 'Expert' },
                { key: 'L', function: 'Run engine at depth 19', strength: 'Expert' },
                { key: 'Z', function: 'Run engine at depth 20', strength: 'Master' },
                { key: 'X', function: 'Run engine at depth 21', strength: 'Master' },
                { key: 'C', function: 'Run engine at depth 22', strength: 'Master' },
                { key: 'V', function: 'Run engine at depth 23', strength: 'Master' },
                { key: 'B', function: 'Run engine at depth 24', strength: 'Master' },
                { key: 'N', function: 'Run engine at depth 25', strength: 'Master' },
                { key: 'M', function: 'Run engine at depth 26', strength: 'Master' },
                { key: '=', function: 'Run engine at maximum depth', strength: 'Maximum' }
            ];

            // Add rows for each shortcut
            shortcuts.forEach((shortcut, index) => {
                const row = document.createElement('tr');
                row.style = index % 2 === 0 ? '' : 'background-color: #f9f9f9;';

                // Set color based on strength
                let strengthColor = '#333';
                switch(shortcut.strength) {
                    case 'Beginner': strengthColor = '#F44336'; break;
                    case 'Intermediate': strengthColor = '#FF9800'; break;
                    case 'Advanced': strengthColor = '#4CAF50'; break;
                    case 'Expert': strengthColor = '#2196F3'; break;
                    case 'Master': strengthColor = '#9C27B0'; break;
                    case 'Maximum': strengthColor = '#E91E63'; break;
                }

                row.innerHTML = `
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <kbd style="background-color: #f1f1f1; border: 1px solid #ccc; border-radius: 4px; padding: 2px 6px; font-family: monospace;">${shortcut.key}</kbd>
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${shortcut.function}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${strengthColor};">${shortcut.strength}</td>
                `;

                tableBody.appendChild(row);
            });

            shortcutsTable.appendChild(tableBody);
            modalContent.appendChild(shortcutsTable);

            // Add a note at the bottom
            var shortcutsNote = document.createElement('p');
            shortcutsNote.innerHTML = '<strong>Note:</strong> Higher depths provide stronger analysis but take longer to calculate. For casual play, depths 1-10 are usually sufficient. For serious analysis, try depths 15+.';
            shortcutsNote.style = 'margin-top: 20px; color: #666; font-size: 13px; background-color: #f5f5f5; padding: 10px; border-radius: 4px;';
            modalContent.appendChild(shortcutsNote);

            keyboardModal.appendChild(modalContent);
            document.body.appendChild(keyboardModal);

            // Function to check and adjust container position if it's too tall for the screen
            function checkAndAdjustPosition() {
                const container = document.getElementById('settingsContainer');
                if (!container) return;

                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // If the container extends beyond the bottom of the screen
                if (rect.bottom > windowHeight) {
                    // Get current transform values
                    const transform = container.style.transform;
                    const match = transform.match(/translate3d\(([^,]+),\s*([^,]+),/);

                    if (match) {
                        const xPos = parseFloat(match[1]);
                        const yPos = parseFloat(match[2]);

                        // Calculate how much we need to move it up
                        const adjustment = Math.min(yPos, rect.bottom - windowHeight + 20);
                        if (adjustment > 0) {
                            const newYPos = yPos - adjustment;
                            container.style.transform = `translate3d(${xPos}px, ${newYPos}px, 0)`;

                            // Update the stored offset if available in the scope
                            if (typeof xOffset !== 'undefined' && typeof yOffset !== 'undefined') {
                                yOffset = newYPos;

                                // Save the adjusted position
                                try {
                                    GM.setValue('GUI Position', { x: xOffset, y: yOffset });
                                } catch (error) {
                                    console.error('Error saving adjusted position:', error);
                                }
                            }
                        }
                    }
                }
            }

            // Add JavaScript for tab switching
            setTimeout(function() {
                const tabButtons = document.querySelectorAll('.tab-button');
                const collapseBtn = document.getElementById('collapseBtn');
                const aiControlsContent = document.getElementById('aiControlsContent');
                const header = document.querySelector('#settingsContainer > div:first-child');

                // Function to toggle content visibility
                const toggleContent = () => {
                    if (aiControlsContent.style.display === 'none') {
                        aiControlsContent.style.display = 'block';
                        collapseBtn.style.transform = 'rotate(0deg)';
                    } else {
                        aiControlsContent.style.display = 'none';
                        collapseBtn.style.transform = 'rotate(180deg)';
                    }
                };

                // Add collapse functionality to button
                if (collapseBtn && aiControlsContent) {
                    collapseBtn.addEventListener('click', function(e) {
                        e.stopPropagation(); // Prevent header click event
                        toggleContent();
                    });
                }

                // Make header clickable
                if (header && aiControlsContent) {
                    header.addEventListener('click', toggleContent);
                }

                // Note: Auto Move and Auto Run toggle event listeners are handled below with jQuery

                // Handle Auto Queue toggle
                const autoQueueCheckbox = document.getElementById('autoQueue');
                const autoQueueStatus = document.getElementById('autoQueueStatus');
                if (autoQueueCheckbox && autoQueueStatus) {
                    autoQueueCheckbox.addEventListener('change', function() {
                        myVars.autoQueue = this.checked;
                        autoQueueStatus.textContent = this.checked ? 'On' : 'Off';
                        autoQueueStatus.style.color = this.checked ? '#9C27B0' : '#666';

                        // Update the observer based on the new setting
                        myFunctions.updateAutoQueueObserver();
                    });
                }


                tabButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        // Remove active class from all tabs
                        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                        // Add active class to clicked tab
                        this.classList.add('active');
                        document.getElementById(this.dataset.tab + '-tab').classList.add('active');

                        // Check and adjust position after tab switch (with a slight delay to allow rendering)
                        setTimeout(checkAndAdjustPosition, 100);
                    });
                });
            }, 500);

            board.parentElement.parentElement.appendChild(div);

            //spinnerContainer
            var spinCont = document.createElement('div');
            spinCont.setAttribute('style','display:none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;');
            spinCont.setAttribute('id','overlay');
            div.prepend(spinCont);
            //spinner
            var spinr = document.createElement('div')
            spinr.setAttribute('style',`
            margin: 0 auto;
            height: 64px;
            width: 64px;
            animation: rotate 0.8s infinite linear;
            border: 5px solid firebrick;
            border-right-color: transparent;
            border-radius: 50%;
            `);
            spinCont.appendChild(spinr);
            addAnimation(`@keyframes rotate {
                           0% {
                               transform: rotate(0deg);
                              }
                         100% {
                               transform: rotate(360deg);
                              }
                                           }`);


            //Reload Button
            var reSty = `
            #relButDiv {
             position: relative;
             text-align: center;
             margin: 0 0 8px 0;
            }
            #relEngBut {
            position: relative;
			color: #ffffff;
			background-color: #3cba2c;
			font-size: 16px;
			border: none;
			border-radius: 4px;
			padding: 10px 20px;
            letter-spacing: 1px;
			cursor: pointer;
            transition: background-color 0.3s;
		    }
		    #relEngBut:hover {
			background-color: #2d8c22;
		    }
            #relEngBut:active {
            background-color: #2d8c22;
            transform: translateY(2px);
       }`;
            var reBut = `<button type="button" name="reloadEngine" id="relEngBut" onclick="document.myFunctions.reloadChessEngine()">Reload Chess Engine</button>`;
            tmpDiv = document.createElement('div');
            var relButDiv = document.createElement('div');
            relButDiv.id = 'relButDiv';
            tmpDiv.innerHTML = reBut;
            reBut = tmpDiv.firstChild;

            tmpStyle = document.createElement('style');
            tmpStyle.innerHTML = reSty;
            document.head.append(tmpStyle);

            relButDiv.append(reBut);
            contentContainer.append(relButDiv);

            // Issue Button
            // var isBut = `<button type="button" name="isBut" onclick="window.confirm('Can I take you to the issues page?') ? document.location = 'https://github.com/Auzgame/userscripts/issues' : console.log('cancled')">Got An Issue/Bug?</button>`;
            // tmpDiv = document.createElement('div');
            // var isButDiv = document.createElement('div');
            // isButDiv.style = `
            //  position: relative;
            //  text-align: center;
            //  margin: 0 0 8px 0;
            // `;
            // tmpDiv.innerHTML = isBut;
            // isBut = tmpDiv.firstChild;
            // isBut.id = 'isBut';
            // isBut.style = `
            // position: relative;
            // color: #ffffff;
            // background-color: #919191;
            // font-size: 16px;
            // border: none;
            // border-radius: 4px;
            // padding: 10px 20px;
            // letter-spacing: 1px;
            // cursor: pointer;
            // transition: background-color 0.3s;
            // `;
            // isButDiv.append(isBut);
            // contentContainer.append(isButDiv);

            // Add event listeners for the new buttons and controls
            $('#applyDepth').on('click', function() {
                myFunctions.runChessEngine();
            });

            $('#runEngineBtn').on('click', function() {
                myFunctions.runChessEngine();
            });

            $('#stopEngineBtn').on('click', function() {
                if (engine.engine) {
                    engine.engine.postMessage('stop');
                    isThinking = false;
                    myFunctions.spinner();
                }
            });

            $('#saveSettingsBtn').on('click', function() {
                myFunctions.saveSettings();
            });

            $('#showKeyboardShortcuts').on('click', function() {
                document.getElementById('keyboardShortcutsModal').style.display = 'flex';
            });

            $('#clearHistoryBtn').on('click', function() {
                document.getElementById('moveHistoryTableBody').innerHTML = '';
            });

            // Add collapse functionality
            header.onclick = function() {
                const content = document.getElementById('aiControlsContent');
                const collapseBtn = document.getElementById('collapseBtn');

                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    collapseBtn.textContent = '▼';

                    // Check and adjust position after expanding
                    setTimeout(checkAndAdjustPosition, 100);
                } else {
                    content.style.display = 'none';
                    collapseBtn.textContent = '▲';
                }
            };

            // Add window resize event listener to adjust position when window is resized
            window.addEventListener('resize', function() {
                // Debounce the resize event to avoid excessive calculations
                if (this.resizeTimeout) {
                    clearTimeout(this.resizeTimeout);
                }
                this.resizeTimeout = setTimeout(function() {
                    checkAndAdjustPosition();
                }, 200);
            });

            $('#evalBarColor').on('change', function() {
                const theme = $(this).val();
                if (theme === 'custom') {
                    $('#customColorContainer').show();
                } else {
                    $('#customColorContainer').hide();

                    // Apply predefined color themes
                    let whiteColor, blackColor;
                    switch(theme) {
                        case 'blue':
                            whiteColor = '#2196F3'; // Blue
                            blackColor = '#FF9800'; // Orange
                            break;
                        case 'purple':
                            whiteColor = '#9C27B0'; // Purple
                            blackColor = '#FFEB3B'; // Yellow
                            break;
                        default: // default
                            whiteColor = '#4CAF50'; // Green
                            blackColor = '#F44336'; // Red
                    }

                    // Store colors in variables for the updateEvalBar function to use
                    myVars.whiteAdvantageColor = whiteColor;
                    myVars.blackAdvantageColor = blackColor;

                    // Update the evaluation bar with current value but new colors
                    updateEvalBar(myVars.currentEvaluation);
                }
            });

            $('#whiteAdvantageColor, #blackAdvantageColor').on('change', function() {
                myVars.whiteAdvantageColor = $('#whiteAdvantageColor').val();
                myVars.blackAdvantageColor = $('#blackAdvantageColor').val();
                updateEvalBar(myVars.currentEvaluation);
            });

            // Initialize color theme variables
            myVars.whiteAdvantageColor = '#4CAF50';
            myVars.blackAdvantageColor = '#F44336';

            // Initialize fusion mode
            myVars.fusionMode = false;

            // Load saved settings
            myFunctions.loadSettings();

            // Check and adjust position after settings are loaded
            setTimeout(checkAndAdjustPosition, 500);

            // Periodically check for opponent rating changes when fusion mode is enabled
            setInterval(function() {
                if (myVars.fusionMode) {
                    extractOpponentRating();
                }
            }, 10000); // Check every 10 seconds

            // Create ELO info modal
            var eloInfoModal = document.createElement('div');
            eloInfoModal.id = 'eloInfoModal';
            eloInfoModal.style = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                z-index: 2000;
                justify-content: center;
                align-items: center;
            `;

            var eloModalContent = document.createElement('div');
            eloModalContent.style = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            `;

            var eloCloseBtn = document.createElement('span');
            eloCloseBtn.innerHTML = '&times;';
            eloCloseBtn.style = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: #333;
            `;
            eloCloseBtn.onclick = function() {
                eloInfoModal.style.display = 'none';
            };

            eloModalContent.appendChild(eloCloseBtn);

            var eloInfoTitle = document.createElement('h2');
            eloInfoTitle.textContent = 'ELO Rating and Depth Relationship';
            eloInfoTitle.style = 'margin-top: 0; color: #2196F3;';
            eloModalContent.appendChild(eloInfoTitle);

            var eloInfoText = document.createElement('div');
            eloInfoText.innerHTML = `
                <p>The ELO rating setting affects how strong the chess engine plays. Lower ELO ratings make the engine play more like a beginner, while higher ratings make it play more like a master.</p>

                <p>To ensure the engine plays consistently with its ELO rating, the maximum search depth is limited based on the selected ELO:</p>

                <ul>
                    <li><strong>1000-1199 ELO:</strong> Maximum depth 5 (Beginner level)</li>
                    <li><strong>1200-1499 ELO:</strong> Maximum depth 8 (Intermediate level)</li>
                    <li><strong>1500-1799 ELO:</strong> Maximum depth 12 (Advanced level)</li>
                    <li><strong>1800-2099 ELO:</strong> Maximum depth 15 (Expert level)</li>
                    <li><strong>2100-2399 ELO:</strong> Maximum depth 18 (Master level)</li>
                    <li><strong>2400+ ELO:</strong> Maximum depth 22 (Grandmaster level)</li>
                </ul>

                <p>If you set a depth higher than the maximum for the current ELO, it will be automatically limited to the maximum allowed depth.</p>

                <p>This ensures that the engine plays consistently with its ELO rating and doesn't make moves that are too strong for the selected rating.</p>
            `;
            eloModalContent.appendChild(eloInfoText);

            eloInfoModal.appendChild(eloModalContent);
            document.body.appendChild(eloInfoModal);

            $('#eloInfoBtn').on('click', function() {
                document.getElementById('eloInfoModal').style.display = 'flex';
            });
            
            // Opening book event handlers
            $('#useOpeningBook').on('change', function() {
                myVars.useOpeningBook = this.checked;
                const status = $('#openingBookStatus');
                status.text(this.checked ? 'Enabled' : 'Disabled');
                status.css('color', this.checked ? '#4CAF50' : '#666');
                
                // Load opening book if enabled and not already loaded
                if (this.checked && !myVars.openingBook) {
                    $('#openingBookLoadStatus').text('Loading opening book...');
                    myFunctions.fetchOpeningBook().then(() => {
                        myFunctions.updateOpeningBookStatus();
                        // Update dropdown with actual counts after loading
                        myFunctions.updateRepertoireDropdown();
                    });
                }
            });
            
            $('#openingBookInfoBtn').on('click', function() {
                const info = `
                    <div style="max-width: 400px; line-height: 1.4;">
                        <h3 style="margin-top: 0; color: #4CAF50;">Opening Book</h3>
                        <p>The opening book contains thousands of known opening positions with the best theoretical moves.</p>
                        <p><strong>Benefits:</strong></p>
                        <ul>
                            <li>Plays strong opening theory</li>
                            <li>Faster than engine calculation</li>
                            <li>Includes opening names and ECO codes</li>
                            <li>Covers popular openings and variations</li>
                        </ul>
                        <p>When enabled, the AI will check the opening book first before using the engine to calculate moves.</p>
                    </div>
                `;
                myFunctions.showModal('Opening Book Information', info);
            });

            // Opening repertoire selection event handler
            $('#openingRepertoire').on('change', function() {
                myVars.selectedOpeningRepertoire = this.value;
                console.log('Opening repertoire changed to:', this.value);

                // Save settings when repertoire changes
                myFunctions.saveSettings();

                // Show a brief notification about the change
                const notification = document.createElement('div');
                notification.textContent = `Opening repertoire set to: ${myFunctions.getRepertoireName(this.value)}`;
                notification.style = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #4CAF50;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    z-index: 9999;
                    font-size: 12px;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.opacity = '1';
                }, 10);

                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                }, 2000);
            });

            // Opening display toggle event handler
            $('#showOpeningDisplay').on('change', function() {
                myVars.showOpeningDisplay = this.checked;
                const status = $('#openingDisplayStatus');
                status.text(this.checked ? 'Enabled' : 'Disabled');
                status.css('color', this.checked ? '#4CAF50' : '#666');

                // Update the display immediately
                if (this.checked && myVars.useOpeningBook && myVars.openingBook && board) {
                    const currentFEN = board.game.getFEN();
                    const openingInfo = myFunctions.getOpeningInfo(currentFEN);
                    myFunctions.updateOpeningDisplay(openingInfo);
                } else {
                    // Hide the display
                    const openingDisplay = document.getElementById('openingDisplay');
                    if (openingDisplay) {
                        openingDisplay.style.display = 'none';
                    }
                }
            });

            // Create Human Mode info modal
            var humanModeInfoModal = document.createElement('div');
            humanModeInfoModal.id = 'humanModeInfoModal';
            humanModeInfoModal.style = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                z-index: 2000;
                justify-content: center;
                align-items: center;
            `;

            var humanModeModalContent = document.createElement('div');
            humanModeModalContent.style = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            `;

            var humanModeCloseBtn = document.createElement('span');
            humanModeCloseBtn.innerHTML = '&times;';
            humanModeCloseBtn.style = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: #333;
            `;
            humanModeCloseBtn.onclick = function() {
                humanModeInfoModal.style.display = 'none';
            };

            humanModeModalContent.appendChild(humanModeCloseBtn);

            var humanModeInfoTitle = document.createElement('h2');
            humanModeInfoTitle.textContent = 'Human Mode: Realistic Chess Play';
            humanModeInfoTitle.style = 'margin-top: 0; color: #2196F3;';
            humanModeModalContent.appendChild(humanModeInfoTitle);

            var humanModeInfoText = document.createElement('div');
            humanModeInfoText.innerHTML = `
                <p>Human Mode makes the chess engine play more like a real human player by introducing:</p>

                <ul>
                    <li><strong>Realistic thinking time</strong> - varies based on skill level</li>
                    <li><strong>Occasional mistakes</strong> - humans don't always find the best move</li>
                    <li><strong>Rare blunders</strong> - even good players make serious mistakes sometimes</li>
                </ul>

                <p>Choose from five different skill levels:</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Skill Level</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">ELO Range</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Characteristics</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Beginner</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">~800</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Quick moves, frequent mistakes, occasional blunders</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Casual</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">~1200</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Moderate thinking time, common mistakes</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Intermediate</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">~1600</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Longer thinking on complex positions, occasional mistakes</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Advanced</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">~2000</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Careful consideration, infrequent mistakes</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Expert</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">~2400</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Deep analysis, rare mistakes, very rare blunders</td>
                    </tr>
                </table>

                <p style="margin-top: 15px;"><strong>Note:</strong> Human Mode and Fusion Mode cannot be active at the same time.</p>
            `;
            humanModeModalContent.appendChild(humanModeInfoText);

            humanModeInfoModal.appendChild(humanModeModalContent);
            document.body.appendChild(humanModeInfoModal);

            // Add CSS for toggle switch
            var toggleStyle = document.createElement('style');
            toggleStyle.innerHTML = `
                /* The switch - the box around the slider */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }

                /* Hide default HTML checkbox */
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                /* The slider */
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }

                input:checked + .slider {
                    background-color: #4CAF50;
                }

                input:focus + .slider {
                    box-shadow: 0 0 1px #4CAF50;
                }

                input:checked + .slider:before {
                    transform: translateX(26px);
                }

                /* Rounded sliders */
                .slider.round {
                    border-radius: 24px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }
            `;
            document.head.appendChild(toggleStyle);

            // Update auto run status when checkbox changes
            $('#autoRun').on('change', function() {
                const isChecked = this.checked;
                myVars.autoRun = isChecked;
                myFunctions.updateAutoRunStatus(isChecked ? 'on' : 'off');
            });

            $('#fusionMode').on('change', function() {
                const isChecked = this.checked;
                myFunctions.updateFusionMode(isChecked);

                // Disable the ELO slider when fusion mode is enabled
                $('#eloSlider').prop('disabled', isChecked);

                // Extract opponent rating immediately when enabled
                if (isChecked) {
                    extractOpponentRating();
                }

                // Disable human mode when fusion mode is enabled
                if (isChecked && $('#humanMode').prop('checked')) {
                    $('#humanMode').prop('checked', false);
                    myFunctions.updateHumanMode(false);
                }
            });

            // Human mode toggle event listener
            $('#humanMode').on('change', function() {
                const isChecked = this.checked;
                myFunctions.updateHumanMode(isChecked);

                // Show/hide Human Auto Move container
                const humanAutoMoveContainer = document.getElementById('humanAutoMoveContainer');
                if (humanAutoMoveContainer) {
                    humanAutoMoveContainer.style.display = isChecked ? 'block' : 'none';
                }

                // If Human Mode is turned OFF, we must also turn off Human Auto Move
                // This ensures that when we turn Human Mode back ON, it starts fresh
                // and also triggers the restoration of standard Auto Move / Clock Sync
                if (!isChecked) {
                    if ($('#humanAutoMove').prop('checked')) {
                        $('#humanAutoMove').prop('checked', false).trigger('change');
                    }
                }

                // Disable the ELO slider when human mode is enabled
                $('#eloSlider').prop('disabled', isChecked);

                // Disable fusion mode when human mode is enabled
                if (isChecked && $('#fusionMode').prop('checked')) {
                    $('#fusionMode').prop('checked', false);
                    myFunctions.updateFusionMode(false);
                }

                // Apply the selected human mode level
                if (isChecked) {
                    const level = $('#humanModeSelect').val();
                    setHumanMode(level);
                }
            });

            // Human Auto Move toggle
            $('#humanAutoMove').on('change', function() {
                myVars.humanAutoMove = this.checked;
                console.log('Human Auto Move set to:', myVars.humanAutoMove);

                const autoMoveNote = $('#autoMoveNote');
                const autoMoveCheckbox = $('#autoMove');
                const clockSyncCheckbox = $('#clockSync');
                const clockSyncContainer = $('#clockSyncSection'); // Use section ID for dimming

                if (this.checked) {
                    // ENABLED: Save states and disable standard controls
                    
                    // Save current states if they haven't been saved yet (precaution)
                    if (myVars.savedAutoMoveState === undefined) {
                        myVars.savedAutoMoveState = autoMoveCheckbox.prop('checked');
                    }
                    if (myVars.savedClockSyncState === undefined) {
                        myVars.savedClockSyncState = clockSyncCheckbox.prop('checked');
                    }

                    // Disable Standard Auto Move
                    if (autoMoveCheckbox.prop('checked')) {
                        // We set it to false but DON'T update the saved state here (we want the original)
                        // Trigger change to update internal vars
                        autoMoveCheckbox.prop('checked', false).trigger('change');
                        // Restore the saved state variable because trigger('change') might have updated it via other listeners if we aren't careful
                        // Actually, the listener just updates myVars.autoMove, which is fine.
                    }
                    autoMoveCheckbox.prop('disabled', true);
                    autoMoveNote.show(); // Show the "Why is this disabled" note

                    // Disable Clock Sync
                    if (clockSyncCheckbox.prop('checked')) {
                        clockSyncCheckbox.prop('checked', false).trigger('change');
                    }
                    clockSyncCheckbox.prop('disabled', true);
                    clockSyncContainer.css('opacity', '0.5'); // Dim the container
                    
                } else {
                    // DISABLED: Restore states and enable standard controls

                    // Re-enable inputs
                    autoMoveCheckbox.prop('disabled', false);
                    clockSyncCheckbox.prop('disabled', false);
                    autoMoveNote.hide();
                    clockSyncContainer.css('opacity', '1');

                    // Restore Standard Auto Move state if it was enabled before
                    if (myVars.savedAutoMoveState) {
                        autoMoveCheckbox.prop('checked', true).trigger('change');
                    }
                    
                    // Restore Clock Sync state if it was enabled before
                    if (myVars.savedClockSyncState) {
                        clockSyncCheckbox.prop('checked', true).trigger('change');
                    }
                    
                    // Clear saved states
                    myVars.savedAutoMoveState = undefined;
                    myVars.savedClockSyncState = undefined;
                }
            });

            // Human mode level select event listener
            $('#humanModeSelect').on('change', function() {
                const level = $(this).val();

                // Only apply if human mode is active
                if ($('#humanMode').prop('checked')) {
                    setHumanMode(level);
                }
            });

            // Human mode info button event listener
            $('#humanModeInfoBtn').on('click', function() {
                document.getElementById('humanModeInfoModal').style.display = 'flex';
            });

            $('#autoMove').on('change', function() {
                myVars.autoMove = this.checked;
                myFunctions.updateAutoMoveStatus(this.checked ? 'on' : 'off');
            });

            // Clock synchronization event handlers
            $('#clockSync').on('change', function() {
                myVars.clockSync = this.checked;
                console.log('Clock sync toggled:', this.checked);

                // Update status indicator
                const statusElement = $('#clockSyncStatus');
                if (this.checked) {
                    statusElement.text('On').css('color', '#4CAF50');
                } else {
                    statusElement.text('Off').css('color', '#666');
                }

                // Update Auto Run Delay section visibility
                updateAutoRunDelayVisibility();
            });

            // Function to update delay controls visibility
            function updateDelayControlsVisibility() {
                const exactMatchEnabled = $('#clockSyncExactMatch').prop('checked');
                const delayControls = $('#delayRangeControls');
                const delayDescription = $('#delayRangeDescription');
                const exactDescription = $('#exactMatchDescription');

                if (exactMatchEnabled) {
                    delayControls.hide();
                    delayDescription.hide();
                    exactDescription.text('Precisely calculates delay to match opponent\'s remaining time after the move');
                } else {
                    delayControls.show();
                    delayDescription.show();
                    exactDescription.text('Precisely matches opponent\'s remaining time instead of using delay ranges');
                }
            }

            // Function to update Auto Run Delay section visibility
            function updateAutoRunDelayVisibility() {
                const clockSyncEnabled = $('#clockSync').prop('checked');
                const autoRunDelaySection = $('#autoRunDelaySection');
                const autoRunDelayNote = $('#autoRunDelayNote');

                if (clockSyncEnabled) {
                    // Show warning note when clock sync is enabled
                    autoRunDelayNote.show();
                    // Optionally dim the controls to show they're not active
                    autoRunDelaySection.css('opacity', '0.6');
                } else {
                    // Hide warning note when clock sync is disabled
                    autoRunDelayNote.hide();
                    // Restore full opacity
                    autoRunDelaySection.css('opacity', '1');
                }
            }

            $('#clockSyncExactMatch').on('change', function() {
                myVars.clockSyncExactMatch = this.checked;
                console.log('Clock sync exact match toggled:', this.checked);

                // Update status indicator
                const statusElement = $('#clockSyncExactMatchStatus');
                if (this.checked) {
                    statusElement.text('On').css('color', '#2196F3');
                } else {
                    statusElement.text('Off').css('color', '#666');
                }

                // Update visibility of delay controls
                updateDelayControlsVisibility();
            });

            $('#clockSyncMinDelay').on('change', function() {
                const value = parseFloat(this.value);
                if (value >= 0.1 && value <= 30) {
                    myVars.clockSyncMinDelay = value;
                    console.log('Clock sync min delay updated:', value);

                    // Ensure min is not greater than max
                    const maxDelay = parseFloat($('#clockSyncMaxDelay').val());
                    if (value > maxDelay) {
                        $('#clockSyncMaxDelay').val(value);
                        myVars.clockSyncMaxDelay = value;
                    }
                }
            });

            $('#clockSyncMaxDelay').on('change', function() {
                const value = parseFloat(this.value);
                if (value >= 0.5 && value <= 60) {
                    myVars.clockSyncMaxDelay = value;
                    console.log('Clock sync max delay updated:', value);

                    // Ensure max is not less than min
                    const minDelay = parseFloat($('#clockSyncMinDelay').val());
                    if (value < minDelay) {
                        $('#clockSyncMinDelay').val(value);
                        myVars.clockSyncMinDelay = value;
                    }
                }
            });

            // Time pressure event handlers
            $('#clockSyncTimePressure').on('change', function() {
                myVars.clockSyncTimePressure = this.checked;
                console.log('Clock sync time pressure toggled:', this.checked);

                // Update status indicator
                const statusElement = $('#clockSyncTimePressureStatus');
                if (this.checked) {
                    statusElement.text('On').css('color', '#856404');
                } else {
                    statusElement.text('Off').css('color', '#666');
                }

                // Reset time pressure active state when disabled
                if (!this.checked) {
                    myVars.clockSyncTimePressureActive = false;
                }
            });

            $('#clockSyncTimePressureThreshold').on('change', function() {
                const value = parseInt(this.value);
                if (value >= 5 && value <= 120) {
                    myVars.clockSyncTimePressureThreshold = value;
                    console.log('Clock sync time pressure threshold updated:', value);
                }
            });

            // Initialize delay controls visibility
            setTimeout(updateDelayControlsVisibility, 100);

            // Initialize Auto Run Delay visibility
            setTimeout(updateAutoRunDelayVisibility, 100);

            $('#showArrows').on('change', function() {
                myVars.showArrows = this.checked;
            });

            $('#persistentHighlights').on('change', function() {
                myVars.persistentHighlights = this.checked;

                // If turning off persistent highlights, clear any existing ones
                if (!myVars.persistentHighlights) {
                    myFunctions.clearHighlights();
                }
            });

            // Add event listener for the virtual chessboard toggle
            $('#useVirtualChessboard').on('change', function() {
                myVars.useVirtualChessboard = this.checked;

                // Show/hide the virtual chessboard container based on the setting
                const virtualChessboardContainer = document.getElementById('virtualChessboardContainer');
                if (virtualChessboardContainer) {
                    virtualChessboardContainer.style.display = this.checked ? 'block' : 'none';
                }

                // If enabled, update the virtual chessboard with the current position
                if (this.checked) {
                    myFunctions.updateVirtualChessboard();

                    // If we have a last move, show it on the virtual chessboard
                    if (myVars.lastMove) {
                        myFunctions.showVirtualMoveIndicator(myVars.lastMove.from, myVars.lastMove.to);
                    }
                }
            });

            // Add event listeners for the move indicator type radio buttons
            $('input[name="moveIndicatorType"]').on('change', function() {
                myVars.moveIndicatorType = this.value;

                // Update timestamp for settings synchronization
                myVars.settings_last_updated = Date.now() / 1000;

                // Clear any existing highlights and arrows when changing the indicator type
                myFunctions.clearHighlights();
                myFunctions.clearArrows();

                // Show/hide arrow customization and animation containers based on selection
                if (this.value === 'arrows') {
                    $('#arrowCustomizationContainer').slideDown(200);
                    $('#arrowAnimationContainer').slideDown(200);
                } else {
                    $('#arrowCustomizationContainer').slideUp(200);
                    $('#arrowAnimationContainer').slideUp(200);
                }

                // Update the server if external window is open
                if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                    myFunctions.sendServerUpdate();
                }
            });

            // Add event listeners for the arrow style radio buttons
            $('input[name="arrowStyle"]').on('change', function() {
                myVars.arrowStyle = this.value;

                // Clear any existing arrows to apply the new style
                myFunctions.clearArrows();

                // If we're currently showing a move, redraw it with the new style
                if (myVars.lastMove && myVars.moveIndicatorType === 'arrows') {
                    myFunctions.drawArrow(myVars.lastMove.from, myVars.lastMove.to, myVars.persistentHighlights);
                }
            });

            // Add event listener for the arrow animation checkbox
            $('#arrowAnimation').on('change', function() {
                myVars.arrowAnimation = this.checked;

                // Clear any existing arrows to apply the new animation setting
                myFunctions.clearArrows();

                // If we're currently showing a move, redraw it with the new animation setting
                if (myVars.lastMove && myVars.moveIndicatorType === 'arrows') {
                    myFunctions.drawArrow(myVars.lastMove.from, myVars.lastMove.to, myVars.persistentHighlights);
                }
            });

            // Add event listener for the multiple moves toggle
            $('#showMultipleMoves').on('change', function() {
                myVars.showMultipleMoves = this.checked;

                // Update timestamp for settings synchronization
                myVars.settings_last_updated = Date.now() / 1000;

                // Update status text
                $('#showMultipleMovesStatus').text(this.checked ? 'On' : 'Off');
                $('#showMultipleMovesStatus').css('color', this.checked ? '#4CAF50' : '#666');

                // Show/hide options
                if (this.checked) {
                    $('#multipleMovesOptions').slideDown(200);

                    // If multicolor is enabled, hide arrow customization but keep animation container visible
                    if (myVars.useMulticolorMoves) {
                        $('#arrowCustomizationSection').slideUp(200);
                        $('#arrowAnimationContainer').slideDown(200);
                    }
                } else {
                    $('#multipleMovesOptions').slideUp(200);

                    // Always show arrow customization when multiple moves is disabled
                    $('#arrowCustomizationSection').slideDown(200);
                }

                // Clear any existing highlights and arrows
                myFunctions.clearHighlights();
                myFunctions.clearArrows();

                // Update the server if external window is open
                if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                    myFunctions.sendServerUpdate();
                }
            });

            // Add event listener for the number of moves slider
            $('#numberOfMovesToShow').on('input', function() {
                const value = $(this).val();
                $('#numberOfMovesValue').text(value);
                myVars.numberOfMovesToShow = parseInt(value);

                // Clear any existing highlights and arrows
                myFunctions.clearHighlights();
                myFunctions.clearArrows();
            });

            // Add event listener for the multicolor moves toggle
            $('#useMulticolorMoves').on('change', function() {
                myVars.useMulticolorMoves = this.checked;

                // Update timestamp for settings synchronization
                myVars.settings_last_updated = Date.now() / 1000;

                // Update status text
                $('#useMulticolorMovesStatus').text(this.checked ? 'On' : 'Off');
                $('#useMulticolorMovesStatus').css('color', this.checked ? '#4CAF50' : '#666');

                // Show/hide color pickers
                if (this.checked) {
                    $('#moveColorOptions').slideDown(200);
                    $('#opacityNote').hide();

                    // Hide arrow customization section when multicolor is enabled
                    // but keep arrow animation container visible
                    $('#arrowCustomizationSection').slideUp(200);
                } else {
                    $('#moveColorOptions').slideUp(200);
                    $('#opacityNote').show();

                    // Show arrow customization section when multicolor is disabled
                    $('#arrowCustomizationSection').slideDown(200);
                }

                // Clear any existing highlights and arrows
                myFunctions.clearHighlights();
                myFunctions.clearArrows();

                // Update the server if external window is open
                if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                    myFunctions.sendServerUpdate();
                }
            });

            // Add event listeners for the color pickers
            for (let i = 1; i <= 5; i++) {
                $(`#moveColor${i}`).on('change', function() {
                    myVars.moveColors[i] = $(this).val();

                    // Clear any existing highlights and arrows
                    myFunctions.clearHighlights();
                    myFunctions.clearArrows();
                });
            }

            // Add event listener for the external window toggle
            $('#useExternalWindow').on('change', function() {
                myVars.useExternalWindow = this.checked;

                // Show/hide external window options
                if (this.checked) {
                    $('#externalWindowOptions').slideDown(200);
                } else {
                    $('#externalWindowOptions').slideUp(200);

                    // Close the external window if it's open
                    if (myVars.externalWindowOpen && myVars.externalWindowRef) {
                        myVars.externalWindowRef.close();
                        myVars.externalWindowOpen = false;
                        myVars.externalWindowRef = null;
                    }
                }
            });

            // Add event listener for the start server button
            $('#startServerBtn').on('click', function() {
                // Attempt to connect to the local server
                myFunctions.checkServerConnection();
            });

            // Add event listener for the open external window button
            $('#openExternalWindowBtn').on('click', function() {
                myFunctions.openExternalWindow();
            });

            // Add event listener for the download server link
            $('#downloadServerLink').on('click', function(e) {
                e.preventDefault();
                myFunctions.downloadServer();
            });

            // Add event listeners for move indicator location radio buttons
            $('input[name="moveIndicatorLocation"]').on('change', function() {
                myVars.moveIndicatorLocation = this.value;
                console.log('Move indicator location set to:', this.value);

                // Update timestamp for settings synchronization
                myVars.settings_last_updated = Date.now() / 1000;

                // Clear any existing highlights and arrows
                myFunctions.clearHighlights();
                myFunctions.clearArrows();

                // If external window is open, update it
                if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                    // Force an immediate update to the server
                    myFunctions.sendServerUpdate();

                    // If we're showing on the external board, run the engine to show the moves
                    if (this.value === 'external' || this.value === 'both') {
                        // Only run if we have a best move already
                        if (myVars.bestMove) {
                            console.log('Updating external board with current best move:', myVars.bestMove);
                        }
                    }
                }
            });

            // Improved visual feedback for toggle switches
            $('.switch input[type="checkbox"]').each(function() {
                const statusElement = $('#' + this.id + 'Status');
                if (statusElement.length) {
                    if (this.checked) {
                        statusElement.text('On');
                        statusElement.css('color', '#4CAF50');
                    } else {
                        statusElement.text('Off');
                        statusElement.css('color', '#666');
                    }
                }
            });

            // Add visual feedback to buttons
            $('#runEngineBtn, #stopEngineBtn, #saveSettingsBtn, #showKeyboardShortcuts, #applyDepth').each(function() {
                $(this).css('transition', 'all 0.2s ease');

                $(this).hover(
                    function() {
                        $(this).css({
                            'opacity': '0.9',
                            'transform': 'translateY(-1px)',
                            'box-shadow': '0 2px 5px rgba(0,0,0,0.2)'
                        });
                    },
                    function() {
                        $(this).css({
                            'opacity': '1',
                            'transform': 'translateY(0)',
                            'box-shadow': 'none'
                        });
                    }
                );

                $(this).mousedown(function() {
                    $(this).css('transform', 'translateY(1px)');
                });

                $(this).mouseup(function() {
                    $(this).css('transform', 'translateY(-1px)');
                });
            });

            // Improve color theme selector
            $('#evalBarColor').on('change', function() {
                if (this.value === 'custom') {
                    $('#customColorContainer').slideDown(200);
                } else {
                    $('#customColorContainer').slideUp(200);
                }
            });

            // Add tooltips to buttons and controls
            $('#runEngineBtn').attr('title', 'Analyze the current position with the chess engine');
            $('#stopEngineBtn').attr('title', 'Stop the engine analysis');
            $('#saveSettingsBtn').attr('title', 'Save your current settings for future sessions');
            $('#depthSlider').attr('title', 'Higher depth = stronger analysis but slower calculation');
            $('#showArrows').attr('title', 'Display arrows showing the best moves on the board');
            $('#persistentHighlights').attr('title', 'Keep move highlights visible until the next move is made');
            $('#autoRun').attr('title', 'Automatically run the engine after each move');
            $('#autoMove').attr('title', 'Automatically make the best move for your side. Enable Clock Sync below for human-like timing.');
            $('#timeDelayMin').attr('title', 'Minimum delay before auto-running the engine');
            $('#timeDelayMax').attr('title', 'Maximum delay before auto-running the engine');

            // Clock sync tooltips
            $('#clockSync').attr('title', 'Synchronize move timing with opponent\'s clock usage to appear more human-like');
            $('#clockSyncExactMatch').attr('title', 'Precisely calculate delays to match opponent\'s remaining time instead of using delay ranges');
            $('#clockSyncMinDelay').attr('title', 'Minimum delay when moving quickly (opponent has more time)');
            $('#clockSyncMaxDelay').attr('title', 'Maximum delay when slowing down (you have more time)');
            $('#clockSyncTimePressure').attr('title', 'Override all delays with minimum timing when either player enters time trouble');
            $('#clockSyncTimePressureThreshold').attr('title', 'Time threshold in seconds - when either player has this much time or less, use emergency timing');

            // Close modals when clicking outside
            $('.modal-container').on('click', function(event) {
                if (event.target === this) {
                    $(this).css('display', 'none');
                }
            });

            // Add escape key to close modals
            $(document).on('keydown', function(event) {
                if (event.key === 'Escape') {
                    $('.modal-container').css('display', 'none');
                }
            });

            // Add class to modals for easier selection
            $('#keyboardShortcutsModal, #eloInfoModal, #humanModeInfoModal').addClass('modal-container');

            loaded = true;
        } catch (error) {console.log(error)}
    }


    function other(delay){
        console.log(`[AUTO RUN DEBUG] Scheduling next auto run in ${delay/1000} seconds`);
        console.log(`[AUTO RUN DEBUG] Current state - myTurn: ${myTurn}, autoRun: ${myVars.autoRun}, canGo: ${canGo}, isThinking: ${isThinking}`);
        myFunctions.updateAutoRunStatus('waiting');

        // Use setTimeout instead of setInterval with constant checking
        setTimeout(() => {
            console.log(`[AUTO RUN DEBUG] Timer fired - checking conditions`);
            console.log(`[AUTO RUN DEBUG] myVars.autoRun: ${myVars.autoRun}, myTurn: ${myTurn}, isThinking: ${isThinking}`);

            // Only proceed if auto run is still enabled
            if(myVars.autoRun && myTurn && !isThinking) {
                console.log(`[AUTO RUN DEBUG] Conditions met, running auto run`);
                myFunctions.autoRun(lastValue);
                // Only reset canGo after successful auto run
                setTimeout(() => {
                    canGo = true;
                    console.log(`[AUTO RUN DEBUG] canGo reset to true after auto run`);
                }, 100);
            } else {
                console.log(`[AUTO RUN DEBUG] Conditions not met, resetting canGo`);
                canGo = true;
            }
        }, delay);
    }


    async function getVersion(){
        try {
            const response = await fetch('https://greasyfork.org/en/scripts/531171-chess-ai');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const versionElement = doc.querySelector('dd.script-show-version span');
            const version = versionElement.textContent;

            console.log("Fetched version:", version);
            console.log("Current version:", currentVersion);

            if(currentVersion !== version){
                console.log("Version mismatch detected!");
                if (document.hasFocus()) {
                    alert('UPDATE THIS SCRIPT IN ORDER TO PROCEED!');
                    window.open('https://greasyfork.org/en/scripts/531171-chess-ai', '_blank');
                }
                // Recursive call to keep displaying the popup
                setTimeout(getVersion, 1000); // Call again after 1 second
            } else {
                console.log("Version check passed");
            }
        } catch (error) {
            console.error("Error fetching version:", error);
            // Recursive call to keep trying to fetch the version
            setTimeout(getVersion, 1000); // Call again after 1 second
        }
    }

    getVersion();


    const waitForChessBoard = setInterval(() => {
        if(loaded) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];

            // Only update these values when needed, not every 100ms
            if($('#autoRun')[0]) myVars.autoRun = $('#autoRun')[0].checked;
            if($('#autoMove')[0]) myVars.autoMove = $('#autoMove')[0].checked;
            if($('#showArrows')[0]) myVars.showArrows = $('#showArrows')[0].checked;

            // Update clock sync settings
            if($('#clockSync')[0]) myVars.clockSync = $('#clockSync')[0].checked;
            if($('#clockSyncExactMatch')[0]) myVars.clockSyncExactMatch = $('#clockSyncExactMatch')[0].checked;
            if($('#clockSyncMinDelay')[0]) myVars.clockSyncMinDelay = parseFloat($('#clockSyncMinDelay')[0].value) || 0.5;
            if($('#clockSyncMaxDelay')[0]) myVars.clockSyncMaxDelay = parseFloat($('#clockSyncMaxDelay')[0].value) || 10;
            if($('#clockSyncTimePressure')[0]) myVars.clockSyncTimePressure = $('#clockSyncTimePressure')[0].checked;
            if($('#clockSyncTimePressureThreshold')[0]) myVars.clockSyncTimePressureThreshold = parseInt($('#clockSyncTimePressureThreshold')[0].value) || 20;

            // Update move indicator type if radio buttons exist
            if($('input[name="moveIndicatorType"]:checked')[0]) {
                myVars.moveIndicatorType = $('input[name="moveIndicatorType"]:checked')[0].value;
            }

            // Check if turn has changed
            const currentTurn = board.game.getTurn() == board.game.getPlayingAs();
            const turnChanged = currentTurn !== myTurn;

            // Enhanced debugging for turn detection
            if (turnChanged) {
                console.log(`[TURN DEBUG] Turn changed: ${myTurn} -> ${currentTurn}`);
                console.log(`[TURN DEBUG] board.game.getTurn(): ${board.game.getTurn()}`);
                console.log(`[TURN DEBUG] board.game.getPlayingAs(): ${board.game.getPlayingAs()}`);
                console.log(`[TURN DEBUG] canGo: ${canGo}, isThinking: ${isThinking}, autoRun: ${myVars.autoRun}`);
            }

            myTurn = currentTurn;

            // Only update delay values when needed
            if($('#timeDelayMin')[0] && $('#timeDelayMax')[0]) {
                let minDel = parseFloat($('#timeDelayMin')[0].value);
                let maxDel = parseFloat($('#timeDelayMax')[0].value);
            myVars.delay = Math.random() * (maxDel - minDel) + minDel;
            }

            myVars.isThinking = isThinking;
            myFunctions.spinner();

            // If turn has changed to player's turn and auto run is enabled, trigger auto run
            if(turnChanged && myTurn && myVars.autoRun && canGo && !isThinking) {
                console.log("[TURN DEBUG] Turn changed to player's turn, triggering auto run");
                canGo = false;
                var currentDelay = myVars.delay != undefined ? myVars.delay * 1000 : 10;
                other(currentDelay);
            }

            // Recovery mechanism: if it's player's turn but auto run is stuck, reset state
            if(myTurn && myVars.autoRun && !canGo && !isThinking) {
                // Check if we've been stuck for too long (more than 10 seconds)
                const now = Date.now();
                if (!myVars.lastAutoRunAttempt) {
                    myVars.lastAutoRunAttempt = now;
                } else if (now - myVars.lastAutoRunAttempt > 10000) {
                    console.warn("[TURN DEBUG] Auto run appears stuck, resetting state");
                    canGo = true;
                    myVars.lastAutoRunAttempt = now;
                }
            } else if (myTurn && myVars.autoRun && canGo) {
                myVars.lastAutoRunAttempt = Date.now();
            }

            // Update evaluation bar position if board size changes
            if(evalBar && evalText && board) {
                evalText.style.left = `${evalBar.offsetLeft}px`;
            }
        } else {
            myFunctions.loadEx();
        }


        if(!engine.engine){
            myFunctions.loadChessEngine();
        }
        
        // Load opening book on startup
        if (myVars.useOpeningBook && !myVars.openingBook) {
            myFunctions.fetchOpeningBook().then(() => {
                if (typeof myFunctions.updateOpeningBookStatus === 'function') {
                    myFunctions.updateOpeningBookStatus();
                }

                // Check for opening on initial load after opening book is loaded
                setTimeout(() => {
                    if (board && myVars.showOpeningDisplay) {
                        myFunctions.checkCurrentOpening();
                    }
                }, 1000);
            });
        }

        // Make opening check function available globally for testing
        window.checkOpening = myFunctions.checkCurrentOpening;

        // Check if the board exists and we haven't set up the move listener yet
        if (board && !board._highlightListenerAdded) {
            // Try to add a listener for moves
            try {
                // Store the current position FEN to detect changes
                myVars.lastPositionFEN = board.game.getFEN();

                // Check for opening information on initial load
                if (myVars.useOpeningBook && myVars.openingBook) {
                    const openingInfo = myFunctions.getOpeningInfo(myVars.lastPositionFEN);
                    myFunctions.updateOpeningDisplay(openingInfo);
                }

                // Mark that we've added the listener
                board._highlightListenerAdded = true;
            } catch (err) {
                console.log('Error setting up move listener:', err);
            }
        }

        // Check if the position has changed (a move was made)
        if (board && myVars.lastPositionFEN) {
            const currentFEN = board.game.getFEN();
            if (currentFEN !== myVars.lastPositionFEN) {
                // Position changed, clear highlights and arrows
                myFunctions.clearHighlights();
                myFunctions.clearArrows();
                myVars.lastPositionFEN = currentFEN;

                // Update opening display when position changes
                if (myVars.useOpeningBook && myVars.openingBook) {
                    const openingInfo = myFunctions.getOpeningInfo(currentFEN);
                    myFunctions.updateOpeningDisplay(openingInfo);
                }

                // No need to check for game end here anymore as we're using MutationObserver
            }
        }
    }, 100);

     // Function to check server connection
    myFunctions.checkServerConnection = function() {
        // Update server status
        $('#serverStatusText').text('Checking...');

        // Try to connect to the local server
        fetch('http://localhost:8765/api/status')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Server not responding');
            })
            .then(data => {
                if (data.status === 'running') {
                    $('#serverStatusText').text('Running');
                    $('#serverStatusText').css('color', '#4CAF50');
                    myVars.serverConnected = true;

                    // Enable the open window button
                    $('#openExternalWindowBtn').prop('disabled', false);

                    // Apply main controls visibility based on current settings
                    myFunctions.updateMainControlsVisibility();

                    // Start sending updates to the server if the external window is open
                    if (myVars.externalWindowOpen) {
                        myFunctions.startServerUpdates();
                    }
                } else {
                    $('#serverStatusText').text('Error: ' + data.status);
                    $('#serverStatusText').css('color', '#F44336');
                    myVars.serverConnected = false;
                }
            })
            .catch(error => {
                console.error('Server connection error:', error);
                $('#serverStatusText').text('Not Running - Start Python Server');
                $('#serverStatusText').css('color', '#F44336');
                myVars.serverConnected = false;

                // Show instructions for starting the server
                const notification = document.createElement('div');
                notification.innerHTML = `
                    <p>To use the external window feature, you need to run the Python server:</p>
                    <ol>
                        <li><a href="#" id="downloadServerLink2" style="color: #2196F3; text-decoration: underline;">Download the chess_ai_server.py file</a> to your computer</li>
                        <li>Open a command prompt or terminal</li>
                        <li>Navigate to the folder containing the file</li>
                        <li>Run: <code>python chess_ai_server.py</code></li>
                    </ol>
                    <p>Then click "Check Server Connection" again.</p>
                `;
                notification.style = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 10000;
                    max-width: 400px;
                    font-family: "Segoe UI", Arial, sans-serif;
                `;

                // Add close button
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Close';
                closeBtn.style = `
                    padding: 8px 16px;
                    background-color: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                `;
                closeBtn.onclick = function() {
                    document.body.removeChild(notification);
                };
                notification.appendChild(closeBtn);

                document.body.appendChild(notification);

                // Add event listener for the second download server link
                $('#downloadServerLink2').on('click', function(e) {
                    e.preventDefault();
                    myFunctions.downloadServer();

                    // Close the notification after starting the download
                    document.body.removeChild(notification);
                });
            });
    };

    // Function to update the visibility of main controls based on settings
    myFunctions.updateMainControlsVisibility = function() {
        // Only apply this when connected to the external window
        if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
            const settingsContainer = $('#settingsContainer');

            if (myVars.disableMainControls) {
                console.log('Disabling main controls as requested by external window');

                // Hide the main controls
                if (settingsContainer.length) {
                    settingsContainer.css('display', 'none');
                }

                // Create or update a notification to inform the user
                let notification = $('#externalControlsNotification');
                if (notification.length === 0) {
                    notification = $('<div id="externalControlsNotification" style="position: fixed; top: 10px; right: 10px; background-color: rgba(33, 150, 243, 0.9); color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-family: Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-width: 300px;">' +
                        '<div style="font-weight: bold; margin-bottom: 5px;">Chess AI Controls Disabled</div>' +
                        '<div style="font-size: 12px;">Main controls are hidden while using the external window. Disable this option in the external window interface settings to show controls here again.</div>' +
                        '</div>');
                    $('body').append(notification);
                } else {
                    notification.show();
                }
            } else {
                console.log('Enabling main controls as requested by external window');

                // Show the main controls
                if (settingsContainer.length) {
                    settingsContainer.css('display', 'block');
                }

                // Hide the notification if it exists
                $('#externalControlsNotification').hide();
            }
        } else {
            // Always show controls when not connected to external window
            const settingsContainer = $('#settingsContainer');
            if (settingsContainer.length) {
                settingsContainer.css('display', 'block');
            }

            // Hide the notification if it exists
            $('#externalControlsNotification').hide();
        }
    };

    // Function to send updates to the server
    myFunctions.sendServerUpdate = function() {
        if (!myVars.serverConnected || !myVars.externalWindowOpen) {
            return;
        }

        // Get the current board position
        const fen = myVars.chess ? myVars.chess.fen() : '';

        // Debug log for top moves
        console.log('Sending top moves to server:', myVars.topMoves);
        if (myVars.topMoves && myVars.topMoves.length > 0) {
            console.log('First move:', myVars.topMoves[0]);
            if (myVars.topMoves.length > 1) {
                console.log('Second move:', myVars.topMoves[1]);
            }
        }

        // Add timestamp for settings synchronization
        if (!myVars.settings_last_updated) {
            myVars.settings_last_updated = Date.now() / 1000; // Convert to seconds to match Python's time.time()
        }

        // Prepare the data to send with all visual settings
        const data = {
            fen: fen,
            evaluation: myVars.currentEvaluation,
            best_move: myVars.bestMove || '',
            engine_running: myVars.engineRunning || false,
            top_moves: myVars.topMoves || [],
            depth: parseInt($('#depthSlider')[0].value) || 11,
            elo: myVars.eloRating || 1500,

            // Opening book settings
            selected_opening_repertoire: myVars.selectedOpeningRepertoire,
            opening_repertoires: myVars.openingRepertoires,

            // Settings synchronization metadata
            settings_last_updated: myVars.settings_last_updated,
            settings_update_source: 'userscript',

            // Automation settings
            auto_move: myVars.autoMove || false,
            auto_run: myVars.autoRun || false,
            auto_run_delay_min: myVars.delayMin || myVars.delay || 0.1,
            auto_run_delay_max: myVars.delayMax || myVars.delay || 1.0,

            // Interface settings
            disable_main_controls: myVars.disableMainControls || false,

            // Move indicator settings
            move_indicator_location: myVars.moveIndicatorLocation || 'main',
            move_indicator_type: myVars.moveIndicatorType || 'highlights',
            persistent_highlights: myVars.persistentHighlights !== undefined ? myVars.persistentHighlights : true,

            // Multiple moves settings
            show_multiple_moves: myVars.showMultipleMoves !== undefined ? myVars.showMultipleMoves : false,
            number_of_moves_to_show: myVars.numberOfMovesToShow || 3,
            use_multicolor_moves: myVars.useMulticolorMoves !== undefined ? myVars.useMulticolorMoves : false,
            move_colors: myVars.moveColors || {},

            // Arrow settings
            arrow_style: myVars.arrowStyle || 'curved',
            arrow_animation: myVars.arrowAnimation !== undefined ? myVars.arrowAnimation : true,
            arrow_color: myVars.arrowColor || '#0077CC',
            arrow_opacity: 0.8,

            // Evaluation bar colors
            white_advantage_color: myVars.whiteAdvantageColor || '#4CAF50',
            black_advantage_color: myVars.blackAdvantageColor || '#F44336'
        };

        // Send the data to the server
        fetch('http://localhost:8765/api/update_state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update server state');
            }
            return response.json();
        })
        .then(data => {
            // Server update successful
            console.log('Server update successful:', data);
        })
        .catch(error => {
            console.error('Error updating server:', error);

            // If we can't connect to the server, mark as disconnected
            if (myVars.serverConnected) {
                myVars.serverConnected = false;
                $('#serverStatusText').text('Connection Lost');
                $('#serverStatusText').css('color', '#F44336');

                // Stop the update interval
                myFunctions.stopServerUpdates();
            }
        });
    };

    // Function to check for pending commands from the server
    myFunctions.checkPendingCommands = function() {
        if (!myVars.serverConnected || !myVars.externalWindowOpen) {
            return;
        }

        // Fetch pending commands from the server
        fetch('http://localhost:8765/api/pending_commands')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch pending commands');
                }
                return response.json();
            })
            .then(data => {
                // Process any pending commands
                if (data.commands && data.commands.length > 0) {
                    console.log('Received pending commands from server:', data.commands);

                    // Process each command in order
                    data.commands.forEach(commandData => {
                        myFunctions.handleServerCommand(commandData.command, commandData.params);
                    });
                }
            })
            .catch(error => {
                console.error('Error checking pending commands:', error);

                // If we can't connect to the server, mark as disconnected
                if (myVars.serverConnected) {
                    myVars.serverConnected = false;
                    $('#serverStatusText').text('Connection Lost');
                    $('#serverStatusText').css('color', '#F44336');

                    // Stop the update intervals
                    myFunctions.stopServerUpdates();
                }
            });
    };

    // Function to start sending updates to the server
    myFunctions.startServerUpdates = function() {
        // Stop any existing interval
        myFunctions.stopServerUpdates();

        // Start a new interval for sending updates
        myVars.serverUpdateInterval = setInterval(myFunctions.sendServerUpdate, 1000);

        // Start a new interval for checking pending commands
        myVars.commandCheckInterval = setInterval(myFunctions.checkPendingCommands, 1000);

        // Send an initial update
        myFunctions.sendServerUpdate();

        // Check for pending commands immediately
        myFunctions.checkPendingCommands();
    };

    // Function to stop sending updates to the server
    myFunctions.stopServerUpdates = function() {
        if (myVars.serverUpdateInterval) {
            clearInterval(myVars.serverUpdateInterval);
            myVars.serverUpdateInterval = null;
        }

        if (myVars.commandCheckInterval) {
            clearInterval(myVars.commandCheckInterval);
            myVars.commandCheckInterval = null;
        }
    };

    // Function to run the engine (wrapper for runChessEngine)
    myFunctions.runEngine = function() {
        myFunctions.runChessEngine();

        // Update the server if external window is open
        if (myVars.useExternalWindow && myVars.externalWindowOpen) {
            myFunctions.sendServerUpdate();
        }
    };

    // Debug function to monitor turn state
    myFunctions.debugTurnState = function() {
        if (!board) return "Board not available";

        const currentGameTurn = board.game.getTurn();
        const playingAs = board.game.getPlayingAs();
        const isPlayerTurn = currentGameTurn == playingAs;

        return {
            timestamp: new Date().toISOString(),
            currentGameTurn: currentGameTurn,
            playingAs: playingAs,
            isPlayerTurn: isPlayerTurn,
            myTurn: myTurn,
            canGo: canGo,
            isThinking: isThinking,
            autoRun: myVars.autoRun,
            engineRunning: myVars.engineRunning
        };
    };

    // Make debug function available globally
    window.debugTurnState = myFunctions.debugTurnState;

    // Function to stop the engine
    myFunctions.stopEngine = function() {
        if (engine.engine) {
            engine.engine.postMessage('stop');
            isThinking = false;
            myFunctions.spinner();

            // Update the server if external window is open
            if (myVars.useExternalWindow && myVars.externalWindowOpen) {
                myFunctions.sendServerUpdate();
            }
        }
    };

    // Function to handle commands from the server
    myFunctions.handleServerCommand = function(command, params) {
        console.log('Received command from server:', command, params);

        switch (command) {
            case 'run_engine':
                // Run the engine with the specified depth
                if (params && params.depth) {
                    $('#depthSlider')[0].value = params.depth;
                    $('#depthValue').text(params.depth);
                }
                myFunctions.runEngine();
                break;

            case 'stop_engine':
                // Stop the engine
                myFunctions.stopEngine();
                break;

            case 'toggle_auto_move':
                // Toggle auto move or set to specific state
                if (params && params.state !== undefined) {
                    // Set to specific state
                    if (myVars.autoMove !== params.state) {
                        $('#autoMove')[0].click();
                    }
                } else {
                    // Just toggle
                    $('#autoMove')[0].click();
                }
                break;

            case 'toggle_auto_run':
                // Toggle auto run or set to specific state
                if (params && params.state !== undefined) {
                    // Set to specific state
                    if (myVars.autoRun !== params.state) {
                        $('#autoRun')[0].click();
                    }
                } else {
                    // Just toggle
                    $('#autoRun')[0].click();
                }
                break;

            case 'update_auto_run_delay':
                // Update the auto run delay
                if (params) {
                    const minDelay = params.min_delay !== undefined ? parseFloat(params.min_delay) : undefined;
                    const maxDelay = params.max_delay !== undefined ? parseFloat(params.max_delay) : undefined;

                    console.log('Updating auto run delay to', minDelay, '-', maxDelay);

                    // Update the delay in myVars
                    if (minDelay !== undefined) {
                        // If we have both min and max, set a random value in between
                        if (maxDelay !== undefined) {
                            // Store both values for future reference
                            myVars.delayMin = minDelay;
                            myVars.delayMax = maxDelay;

                            // Set the current delay to a random value in the range
                            myVars.delay = Math.random() * (maxDelay - minDelay) + minDelay;
                        } else {
                            // If we only have min, use it for both
                            myVars.delay = minDelay;
                            myVars.delayMin = minDelay;
                            myVars.delayMax = minDelay;
                        }
                    } else if (maxDelay !== undefined) {
                        // If we only have max, use it for both
                        myVars.delay = maxDelay;
                        myVars.delayMin = maxDelay;
                        myVars.delayMax = maxDelay;
                    }

                    // Update the UI if the delay inputs exist
                    if ($('#timeDelayMin')[0] && $('#timeDelayMax')[0]) {
                        if (minDelay !== undefined) $('#timeDelayMin')[0].value = minDelay;
                        if (maxDelay !== undefined) $('#timeDelayMax')[0].value = maxDelay;
                    }
                }
                break;

            case 'update_depth':
                // Update the depth
                if (params && params.depth) {
                    $('#depthSlider')[0].value = params.depth;
                    $('#depthValue').text(params.depth);
                }
                break;

            case 'update_elo':
                // Update the ELO rating
                if (params && params.elo) {
                    myVars.eloRating = params.elo;
                    $('#eloValue').text(params.elo);
                }
                break;

            case 'update_opening_repertoire':
                // Update the opening repertoire selection
                if (params) {
                    const selectedRepertoire = params.selected_opening_repertoire;
                    console.log('Updating opening repertoire to:', selectedRepertoire);

                    myVars.selectedOpeningRepertoire = selectedRepertoire;

                    // Update the UI if the element exists
                    if ($('#openingRepertoire')[0]) {
                        $('#openingRepertoire').val(selectedRepertoire);
                    }

                    // Save the settings
                    myFunctions.saveSettings();
                }
                break;

            case 'update_visual_settings':
                // Update visual settings from the external window
                if (params) {
                    console.log('Updating visual settings from server:', params);

                    // Check if we should update based on timestamp
                    const serverTimestamp = params.settings_last_updated || 0;
                    const currentTimestamp = myVars.settings_last_updated || 0;

                    console.log(`Received settings update - Current timestamp: ${currentTimestamp}, Server timestamp: ${serverTimestamp}`);

                    // Only update if the server settings are newer than our current settings
                    if (serverTimestamp > currentTimestamp) {
                        console.log('Applying newer settings from external board');

                        // Update our timestamp to match the server's
                        myVars.settings_last_updated = serverTimestamp;

                        // Update move indicator location
                        if (params.move_indicator_location) {
                            myVars.moveIndicatorLocation = params.move_indicator_location;
                            $('input[name="moveIndicatorLocation"][value="' + params.move_indicator_location + '"]').prop('checked', true);
                        }

                        // Update move indicator type
                        if (params.move_indicator_type) {
                            myVars.moveIndicatorType = params.move_indicator_type;
                            $('input[name="moveIndicatorType"][value="' + params.move_indicator_type + '"]').prop('checked', true);

                            // Show/hide arrow options based on selection
                            if (params.move_indicator_type === 'arrows') {
                                $('#arrowOptions').show();
                            } else {
                                $('#arrowOptions').hide();
                            }
                        }

                        // Update multiple moves settings
                        if (params.show_multiple_moves !== undefined) {
                            myVars.showMultipleMoves = params.show_multiple_moves;
                            $('#showMultipleMoves').prop('checked', params.show_multiple_moves);

                            // Show/hide multiple moves options
                            if (params.show_multiple_moves) {
                                $('#multipleMovesOptions').show();
                            } else {
                                $('#multipleMovesOptions').hide();
                            }
                        }

                        // Update number of moves to show
                        if (params.number_of_moves_to_show) {
                            myVars.numberOfMovesToShow = params.number_of_moves_to_show;
                            $('#numberOfMovesToShow').val(params.number_of_moves_to_show);
                        }

                        // Update multicolor moves setting
                        if (params.use_multicolor_moves !== undefined) {
                            myVars.useMulticolorMoves = params.use_multicolor_moves;
                            $('#useMulticolorMoves').prop('checked', params.use_multicolor_moves);

                            // Show/hide color options
                            if (params.use_multicolor_moves) {
                                $('#moveColorsContainer').show();
                                $('#opacityNote').hide();
                            } else {
                                $('#moveColorsContainer').hide();
                                $('#opacityNote').show();
                            }
                        }

                        // Update arrow style
                        if (params.arrow_style) {
                            myVars.arrowStyle = params.arrow_style;
                            $('input[name="arrowStyle"][value="' + params.arrow_style + '"]').prop('checked', true);
                        }

                        // Update arrow animation
                        if (params.arrow_animation !== undefined) {
                            myVars.arrowAnimation = params.arrow_animation;
                            $('#arrowAnimation').prop('checked', params.arrow_animation);
                        }

                        // Update evaluation bar colors
                        if (params.white_advantage_color) {
                            myVars.whiteAdvantageColor = params.white_advantage_color;
                            $('#whiteAdvantageColor').val(params.white_advantage_color);
                        }

                        if (params.black_advantage_color) {
                            myVars.blackAdvantageColor = params.black_advantage_color;
                            $('#blackAdvantageColor').val(params.black_advantage_color);
                        }

                        // Clear any existing highlights and arrows
                        myFunctions.clearHighlights();
                        myFunctions.clearArrows();

                        // Save the settings
                        myFunctions.saveSettings();

                        // If the engine is running, update the display
                        if (myVars.engineRunning) {
                            myFunctions.runEngine();
                        }

                        // Send an acknowledgment update back to the server with the new timestamp
                        // This prevents update loops by confirming we've received and applied the settings
                        setTimeout(() => {
                            myFunctions.sendServerUpdate();
                        }, 500);
                    } else {
                        console.log('Ignoring older settings from external board');
                    }
                }
                break;

            case 'update_interface_settings':
                // Update interface settings from the external window
                if (params) {
                    console.log('Updating interface settings from server:', params);

                    // Check if we should update based on timestamp
                    const serverTimestamp = params.settings_last_updated || 0;
                    const currentTimestamp = myVars.settings_last_updated || 0;

                    console.log(`Received interface settings update - Current timestamp: ${currentTimestamp}, Server timestamp: ${serverTimestamp}`);

                    // Only update if the server settings are newer than our current settings
                    if (serverTimestamp > currentTimestamp) {
                        console.log('Applying newer interface settings from external board');

                        // Update our timestamp to match the server's
                        myVars.settings_last_updated = serverTimestamp;

                        // Update disable main controls setting
                        if (params.disable_main_controls !== undefined) {
                            myVars.disableMainControls = params.disable_main_controls;

                            // Apply the setting immediately
                            myFunctions.updateMainControlsVisibility();
                        }

                        // Save the settings
                        myFunctions.saveSettings();

                        // Send an acknowledgment update back to the server with the new timestamp
                        // This prevents update loops by confirming we've received and applied the settings
                        setTimeout(() => {
                            myFunctions.sendServerUpdate();
                        }, 500);
                    } else {
                        console.log('Ignoring older interface settings from external board');
                    }
                }
                break;

            default:
                console.warn('Unknown command from server:', command);
        }
    };

    // Function to open the external window
    myFunctions.openExternalWindow = function() {
        // Check if server is connected
        if (!myVars.serverConnected) {
            myFunctions.checkServerConnection();
            return;
        }

        // Check if window is already open
        if (myVars.externalWindowOpen && myVars.externalWindowRef && !myVars.externalWindowRef.closed) {
            // Focus the existing window
            myVars.externalWindowRef.focus();
            return;
        }

        // Open a new window
        myVars.externalWindowRef = window.open('http://localhost:8765', 'ChessAIControls',
            'width=800,height=600,resizable=yes,scrollbars=yes,status=yes');

        if (myVars.externalWindowRef) {
            myVars.externalWindowOpen = true;

            // Set up event listener for when the window is closed
            myVars.externalWindowRef.addEventListener('beforeunload', function() {
                myVars.externalWindowOpen = false;
                myVars.externalWindowRef = null;

                // Stop sending updates to the server
                myFunctions.stopServerUpdates();

                // Always show main controls when external window is closed
                myVars.disableMainControls = false;
                myFunctions.updateMainControlsVisibility();
            });

            // Apply main controls visibility based on current settings
            myFunctions.updateMainControlsVisibility();

            // Start sending updates to the server
            myFunctions.startServerUpdates();
        } else {
            // Window was blocked by popup blocker
            alert('The external window was blocked by your browser. Please allow popups for this site.');
        }
    };

    // Function to save user settings using GM.setValue asynchronously
    myFunctions.saveSettings = async function() {
        // Update timestamp for settings synchronization
        myVars.settings_last_updated = Date.now() / 1000;

        const settings = {
            eloRating: myVars.eloRating,
            depth: parseInt($('#depthSlider')[0].value),
            showArrows: $('#showArrows')[0].checked,
            persistentHighlights: $('#persistentHighlights')[0].checked,
            moveIndicatorType: myVars.moveIndicatorType || 'highlights',
            autoRun: $('#autoRun')[0].checked,
            autoMove: $('#autoMove')[0].checked,
            autoQueue: $('#autoQueue')[0].checked,
            timeDelayMin: parseFloat($('#timeDelayMin')[0].value),
            timeDelayMax: parseFloat($('#timeDelayMax')[0].value),
            // Opening book settings
            useOpeningBook: myVars.useOpeningBook,
            selectedOpeningRepertoire: myVars.selectedOpeningRepertoire,
            showOpeningDisplay: myVars.showOpeningDisplay,
            // Clock synchronization settings
            clockSync: $('#clockSync')[0] ? $('#clockSync')[0].checked : false,
            clockSyncMinDelay: $('#clockSyncMinDelay')[0] ? parseFloat($('#clockSyncMinDelay')[0].value) : 0.5,
            clockSyncMaxDelay: $('#clockSyncMaxDelay')[0] ? parseFloat($('#clockSyncMaxDelay')[0].value) : 10,
            clockSyncExactMatch: $('#clockSyncExactMatch')[0] ? $('#clockSyncExactMatch')[0].checked : false,
            clockSyncTimePressure: $('#clockSyncTimePressure')[0] ? $('#clockSyncTimePressure')[0].checked : true,
            clockSyncTimePressureThreshold: $('#clockSyncTimePressureThreshold')[0] ? parseInt($('#clockSyncTimePressureThreshold')[0].value) : 20,
            evalBarTheme: $('#evalBarColor').val(),
            whiteAdvantageColor: $('#whiteAdvantageColor').val(),
            blackAdvantageColor: $('#blackAdvantageColor').val(),
            arrowColor: $('#arrowColor').val(),
            settings_last_updated: myVars.settings_last_updated,
            arrowStyle: $('input[name="arrowStyle"]:checked').val() || 'curved',
            arrowAnimation: $('#arrowAnimation')[0].checked,
            showMultipleMoves: $('#showMultipleMoves')[0].checked,
            numberOfMovesToShow: parseInt($('#numberOfMovesToShow')[0].value),
            useMulticolorMoves: $('#useMulticolorMoves')[0].checked,
            moveColors: {
                1: $('#moveColor1').val() || '#F44336',
                2: $('#moveColor2').val() || '#FF9800',
                3: $('#moveColor3').val() || '#FFEB3B',
                4: $('#moveColor4').val() || '#4CAF50',
                5: $('#moveColor5').val() || '#2196F3'
            },
            useVirtualChessboard: $('#useVirtualChessboard')[0].checked,
            useExternalWindow: $('#useExternalWindow')[0].checked,
            disableMainControls: myVars.disableMainControls || false,
            useOpeningBook: $('#useOpeningBook')[0].checked,
            showOpeningDisplay: $('#showOpeningDisplay')[0].checked,
            fusionMode: myVars.fusionMode,
            humanMode: myVars.humanMode ? {
                active: myVars.humanMode.active,
                level: myVars.humanMode.level
            } : { active: false, level: 'intermediate' }
        };

        try {
            await GM.setValue('chessAISettings', JSON.stringify(settings));
            // Show saved notification (same as before)
            const notification = document.createElement('div');
            notification.textContent = 'Settings saved!';
            notification.style = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);

            // Update the server if external window is open
            if (myVars.useExternalWindow && myVars.externalWindowOpen && myVars.serverConnected) {
                myFunctions.sendServerUpdate();
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            // Handle error as needed, e.g., show an error notification
        }
    };

    // Function to load user settings using await GM.getValue
    myFunctions.loadSettings = async function() {
        try {
            // First try to load settings from the combined JSON
            const savedSettings = await GM.getValue('chessAISettings', null);

            if (savedSettings) {
                // If settings exist as JSON, parse and apply them
                const settings = JSON.parse(savedSettings);

                // Apply saved settings to myVars
                myVars.eloRating = settings.eloRating || 1500;
                myVars.depth = settings.depth || 11;
                myVars.showArrows = settings.showArrows !== undefined ? settings.showArrows : true;
                myVars.persistentHighlights = settings.persistentHighlights !== undefined ? settings.persistentHighlights : true;
                myVars.moveIndicatorType = settings.moveIndicatorType || 'highlights';
                myVars.autoRun = settings.autoRun !== undefined ? settings.autoRun : false;
                myVars.autoMove = settings.autoMove !== undefined ? settings.autoMove : false;
                myVars.autoQueue = settings.autoQueue !== undefined ? settings.autoQueue : false;
                myVars.fusionMode = settings.fusionMode !== undefined ? settings.fusionMode : false;
                // Clock synchronization settings
                myVars.clockSync = settings.clockSync !== undefined ? settings.clockSync : false;
                myVars.clockSyncMinDelay = settings.clockSyncMinDelay !== undefined ? settings.clockSyncMinDelay : 0.5;
                myVars.clockSyncMaxDelay = settings.clockSyncMaxDelay !== undefined ? settings.clockSyncMaxDelay : 10;
                myVars.clockSyncExactMatch = settings.clockSyncExactMatch !== undefined ? settings.clockSyncExactMatch : false;
                myVars.clockSyncTimePressure = settings.clockSyncTimePressure !== undefined ? settings.clockSyncTimePressure : true;
                myVars.clockSyncTimePressureThreshold = settings.clockSyncTimePressureThreshold !== undefined ? settings.clockSyncTimePressureThreshold : 20;
                myVars.whiteAdvantageColor = settings.whiteAdvantageColor || '#4CAF50';
                myVars.blackAdvantageColor = settings.blackAdvantageColor || '#F44336';
                myVars.arrowColor = settings.arrowColor || '#0077CC';
                myVars.arrowStyle = settings.arrowStyle || 'curved';
                myVars.arrowAnimation = settings.arrowAnimation !== undefined ? settings.arrowAnimation : true;
                myVars.showMultipleMoves = settings.showMultipleMoves !== undefined ? settings.showMultipleMoves : false;
                myVars.numberOfMovesToShow = settings.numberOfMovesToShow || 3;
                myVars.useMulticolorMoves = settings.useMulticolorMoves !== undefined ? settings.useMulticolorMoves : false;
                myVars.useVirtualChessboard = settings.useVirtualChessboard !== undefined ? settings.useVirtualChessboard : false;
                myVars.useExternalWindow = settings.useExternalWindow !== undefined ? settings.useExternalWindow : false;
                myVars.disableMainControls = settings.disableMainControls !== undefined ? settings.disableMainControls : false;
                myVars.useOpeningBook = settings.useOpeningBook !== undefined ? settings.useOpeningBook : true;
                myVars.showOpeningDisplay = settings.showOpeningDisplay !== undefined ? settings.showOpeningDisplay : true;

                // Load settings timestamp if available, or initialize it
                myVars.settings_last_updated = settings.settings_last_updated || (Date.now() / 1000);

                // Load move colors if they exist
                if (settings.moveColors) {
                    myVars.moveColors = {
                        1: settings.moveColors[1] || '#F44336',
                        2: settings.moveColors[2] || '#FF9800',
                        3: settings.moveColors[3] || '#FFEB3B',
                        4: settings.moveColors[4] || '#4CAF50',
                        5: settings.moveColors[5] || '#2196F3'
                    };
                }

                // Set humanMode
                if (settings.humanMode) {
                    myVars.humanMode = {
                        active: settings.humanMode.active,
                        level: settings.humanMode.level
                    };
                } else {
                    myVars.humanMode = { active: false, level: 'intermediate' };
                }

                // Update UI elements
                if ($('#depthSlider')[0]) {
                    $('#depthSlider')[0].value = myVars.depth;
                    $('#depthText').html('Current Depth: <strong>' + myVars.depth + '</strong>');
                }

                if ($('#eloSlider')[0]) {
                    $('#eloSlider')[0].value = myVars.eloRating;
                    $('#eloValue')[0].textContent = myVars.eloRating;
                }

                if ($('#autoMove')[0]) {
                    $('#autoMove')[0].checked = myVars.autoMove;
                }

                if ($('#autoRun')[0]) {
                    $('#autoRun')[0].checked = myVars.autoRun;
                }

                // Apply clock synchronization settings
                if ($('#clockSync')[0]) {
                    $('#clockSync')[0].checked = myVars.clockSync;
                    // Update status indicator
                    const statusElement = $('#clockSyncStatus');
                    if (myVars.clockSync) {
                        statusElement.text('On').css('color', '#4CAF50');
                    } else {
                        statusElement.text('Off').css('color', '#666');
                    }
                }

                if ($('#clockSyncExactMatch')[0]) {
                    $('#clockSyncExactMatch')[0].checked = myVars.clockSyncExactMatch;
                    // Update status indicator
                    const exactStatusElement = $('#clockSyncExactMatchStatus');
                    if (myVars.clockSyncExactMatch) {
                        exactStatusElement.text('On').css('color', '#2196F3');
                    } else {
                        exactStatusElement.text('Off').css('color', '#666');
                    }

                    // Update delay controls visibility
                    setTimeout(() => {
                        const delayControls = $('#delayRangeControls');
                        const delayDescription = $('#delayRangeDescription');
                        const exactDescription = $('#exactMatchDescription');

                        if (myVars.clockSyncExactMatch) {
                            delayControls.hide();
                            delayDescription.hide();
                            exactDescription.text('Precisely calculates delay to match opponent\'s remaining time after the move');
                        } else {
                            delayControls.show();
                            delayDescription.show();
                            exactDescription.text('Precisely matches opponent\'s remaining time instead of using delay ranges');
                        }
                    }, 100);
                }

                if ($('#clockSyncMinDelay')[0]) {
                    $('#clockSyncMinDelay')[0].value = myVars.clockSyncMinDelay;
                }

                if ($('#clockSyncMaxDelay')[0]) {
                    $('#clockSyncMaxDelay')[0].value = myVars.clockSyncMaxDelay;
                }

                if ($('#clockSyncTimePressure')[0]) {
                    $('#clockSyncTimePressure')[0].checked = myVars.clockSyncTimePressure;
                    // Update status indicator
                    const timePressureStatusElement = $('#clockSyncTimePressureStatus');
                    if (myVars.clockSyncTimePressure) {
                        timePressureStatusElement.text('On').css('color', '#856404');
                    } else {
                        timePressureStatusElement.text('Off').css('color', '#666');
                    }
                }

                if ($('#clockSyncTimePressureThreshold')[0]) {
                    $('#clockSyncTimePressureThreshold')[0].value = myVars.clockSyncTimePressureThreshold;
                }

                // Initialize Auto Run Delay visibility after settings are loaded
                setTimeout(() => {
                    updateAutoRunDelayVisibility();
                }, 200);

                if ($('#autoQueue')[0]) {
                    $('#autoQueue')[0].checked = myVars.autoQueue;
                    $('#autoQueueStatus').text(myVars.autoQueue ? 'On' : 'Off');
                    $('#autoQueueStatus').css('color', myVars.autoQueue ? '#9C27B0' : '#666');
                }

                if ($('#showArrows')[0]) {
                    $('#showArrows')[0].checked = myVars.showArrows;
                }

                if ($('#persistentHighlights')[0]) {
                    $('#persistentHighlights')[0].checked = myVars.persistentHighlights;
                }

                if ($('input[name="moveIndicatorType"]').length) {
                    $('input[name="moveIndicatorType"][value="' + myVars.moveIndicatorType + '"]').prop('checked', true);

                    // Show/hide arrow customization and animation containers based on move indicator type
                    if (myVars.moveIndicatorType === 'arrows') {
                        $('#arrowCustomizationContainer').show();
                        $('#arrowAnimationContainer').show();
                    } else {
                        $('#arrowCustomizationContainer').hide();
                        $('#arrowAnimationContainer').hide();
                    }
                }

                if ($('#humanMode')[0] && myVars.humanMode) {
                    $('#humanMode')[0].checked = myVars.humanMode.active;
                }

                if ($('#humanLevelSelect')[0] && myVars.humanMode) {
                    $('#humanLevelSelect')[0].value = myVars.humanMode.level;
                }

                if ($('#fusionMode')[0]) {
                    $('#fusionMode')[0].checked = myVars.fusionMode;
                }

                if ($('#whiteAdvantageColor')[0]) {
                    $('#whiteAdvantageColor')[0].value = myVars.whiteAdvantageColor;
                }

                if ($('#blackAdvantageColor')[0]) {
                    $('#blackAdvantageColor')[0].value = myVars.blackAdvantageColor;
                }

                if ($('#arrowColor')[0]) {
                    $('#arrowColor')[0].value = myVars.arrowColor;
                }

                // Set arrow style radio button
                if (myVars.arrowStyle) {
                    if (myVars.arrowStyle === 'curved' && $('#arrowStyleCurved')[0]) {
                        $('#arrowStyleCurved')[0].checked = true;
                    } else if (myVars.arrowStyle === 'straight' && $('#arrowStyleStraight')[0]) {
                        $('#arrowStyleStraight')[0].checked = true;
                    }
                }

                // Set arrow animation checkbox
                if ($('#arrowAnimation')[0]) {
                    $('#arrowAnimation')[0].checked = myVars.arrowAnimation !== undefined ? myVars.arrowAnimation : true;
                }

                // Set multiple moves toggle
                if ($('#showMultipleMoves')[0]) {
                    $('#showMultipleMoves')[0].checked = myVars.showMultipleMoves;
                    $('#showMultipleMovesStatus').text(myVars.showMultipleMoves ? 'On' : 'Off');
                    $('#showMultipleMovesStatus').css('color', myVars.showMultipleMoves ? '#4CAF50' : '#666');

                    if (myVars.showMultipleMoves) {
                        $('#multipleMovesOptions').show();
                    } else {
                        $('#multipleMovesOptions').hide();
                    }
                }

                // Set number of moves slider
                if ($('#numberOfMovesToShow')[0]) {
                    $('#numberOfMovesToShow')[0].value = myVars.numberOfMovesToShow;
                    $('#numberOfMovesValue').text(myVars.numberOfMovesToShow);
                }

                // Set multicolor moves toggle
                if ($('#useMulticolorMoves')[0]) {
                    $('#useMulticolorMoves')[0].checked = myVars.useMulticolorMoves;
                    $('#useMulticolorMovesStatus').text(myVars.useMulticolorMoves ? 'On' : 'Off');
                    $('#useMulticolorMovesStatus').css('color', myVars.useMulticolorMoves ? '#4CAF50' : '#666');

                    if (myVars.useMulticolorMoves) {
                        $('#moveColorOptions').show();
                        $('#opacityNote').hide();
                        // Hide arrow customization section when multicolor is enabled
                        // but keep arrow animation container visible
                        $('#arrowCustomizationSection').hide();
                    } else {
                        $('#moveColorOptions').hide();
                        $('#opacityNote').show();
                        // Show arrow customization section when multicolor is disabled
                        $('#arrowCustomizationSection').show();
                    }
                }

                // Always show arrow animation container if arrows are enabled
                if (myVars.moveIndicatorType === 'arrows' && $('#arrowAnimationContainer')[0]) {
                    $('#arrowAnimationContainer').show();
                }

                // Set color pickers
                if (myVars.moveColors) {
                    for (let i = 1; i <= 5; i++) {
                        if ($(`#moveColor${i}`)[0] && myVars.moveColors[i]) {
                            $(`#moveColor${i}`)[0].value = myVars.moveColors[i];
                        }
                    }
                }

                // Set virtual chessboard toggle
                if ($('#useVirtualChessboard')[0]) {
                    $('#useVirtualChessboard')[0].checked = myVars.useVirtualChessboard;

                    // Show/hide the virtual chessboard container based on the setting
                    const virtualChessboardContainer = document.getElementById('virtualChessboardContainer');
                    if (virtualChessboardContainer) {
                        virtualChessboardContainer.style.display = myVars.useVirtualChessboard ? 'block' : 'none';
                    }

                    // If enabled, update the virtual chessboard with the current position
                    if (myVars.useVirtualChessboard) {
                        setTimeout(() => {
                            myFunctions.updateVirtualChessboard();
                        }, 500); // Slight delay to ensure the board is ready
                    }
                }

                // Set external window toggle
                if ($('#useExternalWindow')[0]) {
                    $('#useExternalWindow')[0].checked = myVars.useExternalWindow;

                    // Show/hide external window options
                    if (myVars.useExternalWindow) {
                        $('#externalWindowOptions').show();
                    } else {
                        $('#externalWindowOptions').hide();
                    }
                }

                if (settings.timeDelayMin !== undefined && $('#timeDelayMin')[0]) {
                    $('#timeDelayMin')[0].value = settings.timeDelayMin;
                }

                if (settings.timeDelayMax !== undefined && $('#timeDelayMax')[0]) {
                    $('#timeDelayMax')[0].value = settings.timeDelayMax;
                }

                if (settings.evalBarTheme && $('#evalBarColor')[0]) {
                    $('#evalBarColor').val(settings.evalBarTheme);
                    if (settings.evalBarTheme === 'custom') {
                        $('#customColorContainer').show();
                    }
                }

                // Set opening book toggle
                if ($('#useOpeningBook')[0]) {
                    $('#useOpeningBook')[0].checked = myVars.useOpeningBook;
                    const status = $('#openingBookStatus');
                    status.text(myVars.useOpeningBook ? 'Enabled' : 'Disabled');
                    status.css('color', myVars.useOpeningBook ? '#4CAF50' : '#666');
                }

                // Set opening display toggle
                if ($('#showOpeningDisplay')[0]) {
                    $('#showOpeningDisplay')[0].checked = myVars.showOpeningDisplay;
                    const status = $('#openingDisplayStatus');
                    status.text(myVars.showOpeningDisplay ? 'Enabled' : 'Disabled');
                    status.css('color', myVars.showOpeningDisplay ? '#4CAF50' : '#666');
                }

                // Set opening repertoire selection
                if (settings.selectedOpeningRepertoire !== undefined && $('#openingRepertoire')[0]) {
                    myVars.selectedOpeningRepertoire = settings.selectedOpeningRepertoire;
                    $('#openingRepertoire').val(settings.selectedOpeningRepertoire);
                }

                // Set opening book settings
                if (settings.useOpeningBook !== undefined) {
                    myVars.useOpeningBook = settings.useOpeningBook;
                }

                if (settings.showOpeningDisplay !== undefined) {
                    myVars.showOpeningDisplay = settings.showOpeningDisplay;
                }

                // Initialize fusion mode UI after settings are loaded
                if (myVars.fusionMode) {
                    myFunctions.updateFusionMode(true);
                    $('#eloSlider').prop('disabled', true);
                }

                // Initialize human mode UI after settings are loaded
                if (myVars.humanMode && myVars.humanMode.active) {
                    myFunctions.updateHumanMode(true);
                    $('#eloSlider').prop('disabled', true);
                }

                // Initialize auto run status after settings are loaded
                if (myVars.autoRun) {
                    myFunctions.updateAutoRunStatus('on');
                } else {
                    myFunctions.updateAutoRunStatus('off');
                }

                // Initialize auto move status after settings are loaded
                if (myVars.autoMove) {
                    myFunctions.updateAutoMoveStatus('on');
                } else {
                    myFunctions.updateAutoMoveStatus('off');
                }
            } else {
                // Fallback to old method for backward compatibility
                const savedDepth = await GM.getValue('depth', 11);
                const savedElo = await GM.getValue('elo', 1500);
                const savedAutoMove = await GM.getValue('autoMove', false);
                const savedAutoRun = await GM.getValue('autoRun', false);
                const savedAutoQueue = await GM.getValue('autoQueue', false);
                const savedShowArrows = await GM.getValue('showArrows', true);
                const savedPersistentHighlights = await GM.getValue('persistentHighlights', true);
                const savedMoveIndicatorType = await GM.getValue('moveIndicatorType', 'highlights');
                const savedHumanMode = await GM.getValue('humanMode', false);
                const savedHumanLevel = await GM.getValue('humanLevel', 'intermediate');
                const savedFusionMode = await GM.getValue('fusionMode', false);
                const savedWhiteAdvantageColor = await GM.getValue('whiteAdvantageColor', '#4CAF50');
                const savedBlackAdvantageColor = await GM.getValue('blackAdvantageColor', '#F44336');

                // Apply saved settings
                myVars.depth = savedDepth;
                myVars.eloRating = savedElo;
                myVars.autoMove = savedAutoMove;
                myVars.autoRun = savedAutoRun;
                myVars.autoQueue = savedAutoQueue;
                myVars.showArrows = savedShowArrows;
                myVars.persistentHighlights = savedPersistentHighlights;
                myVars.moveIndicatorType = savedMoveIndicatorType;
                myVars.humanMode = { active: savedHumanMode, level: savedHumanLevel };
                myVars.fusionMode = savedFusionMode;
                myVars.whiteAdvantageColor = savedWhiteAdvantageColor;
                myVars.blackAdvantageColor = savedBlackAdvantageColor;

                // Update UI elements to match saved settings
                if ($('#depthSlider')[0]) {
                    $('#depthSlider')[0].value = savedDepth;
                    $('#depthText').html('Current Depth: <strong>' + savedDepth + '</strong>');
                }

                if ($('#eloSlider')[0]) {
                    $('#eloSlider')[0].value = savedElo;
                    $('#eloValue')[0].textContent = savedElo;
                }

                if ($('#autoMove')[0]) {
                    $('#autoMove')[0].checked = savedAutoMove;
                }

                if ($('#autoRun')[0]) {
                    $('#autoRun')[0].checked = savedAutoRun;
                }

                if ($('#autoQueue')[0]) {
                    $('#autoQueue')[0].checked = savedAutoQueue;
                    $('#autoQueueStatus').text(savedAutoQueue ? 'On' : 'Off');
                    $('#autoQueueStatus').css('color', savedAutoQueue ? '#9C27B0' : '#666');
                }

                if ($('#showArrows')[0]) {
                    $('#showArrows')[0].checked = savedShowArrows;
                }

                if ($('#persistentHighlights')[0]) {
                    $('#persistentHighlights')[0].checked = savedPersistentHighlights;
                }

                if ($('input[name="moveIndicatorType"]').length) {
                    $('input[name="moveIndicatorType"][value="' + savedMoveIndicatorType + '"]').prop('checked', true);

                    // Show/hide arrow customization container based on move indicator type
                    if (savedMoveIndicatorType === 'arrows') {
                        $('#arrowCustomizationContainer').show();
                    } else {
                        $('#arrowCustomizationContainer').hide();
                    }
                }

                if ($('#humanMode')[0]) {
                    $('#humanMode')[0].checked = savedHumanMode;
                }

                if ($('#humanLevelSelect')[0]) {
                    $('#humanLevelSelect')[0].value = savedHumanLevel;
                }

                if ($('#fusionMode')[0]) {
                    $('#fusionMode')[0].checked = savedFusionMode;
                }

                if ($('#whiteAdvantageColor')[0]) {
                    $('#whiteAdvantageColor')[0].value = savedWhiteAdvantageColor;
                }

                if ($('#blackAdvantageColor')[0]) {
                    $('#blackAdvantageColor')[0].value = savedBlackAdvantageColor;
                }

                // Initialize fusion mode UI after settings are loaded (legacy format)
                if (myVars.fusionMode) {
                    myFunctions.updateFusionMode(true);
                    $('#eloSlider').prop('disabled', true);
                }

                // Initialize human mode UI after settings are loaded (legacy format)
                if (myVars.humanMode && myVars.humanMode.active) {
                    myFunctions.updateHumanMode(true);
                    $('#eloSlider').prop('disabled', true);
                }

                // Initialize auto run status after settings are loaded (legacy format)
                if (myVars.autoRun) {
                    myFunctions.updateAutoRunStatus('on');
                } else {
                    myFunctions.updateAutoRunStatus('off');
                }

                // Initialize auto move status after settings are loaded (legacy format)
                if (myVars.autoMove) {
                    myFunctions.updateAutoMoveStatus('on');
                } else {
                    myFunctions.updateAutoMoveStatus('off');
                }

                // After loading the settings from individual values, save them as a combined object
                // This will migrate users to the new format
                myFunctions.saveSettings();
            }

            // Check for first run (always use individual setting for this)
            const savedFirstRun = await GM.getValue('firstRun', true);

            // Show welcome modal for first-time users
            if (savedFirstRun) {
                setTimeout(() => {
                    myFunctions.showWelcomeModal();
                    GM.setValue('firstRun', false);
                }, 1000);
            }

            console.log('Settings loaded successfully');

            // Update engine ELO after settings are loaded (skip depth adjustment to preserve saved depth)
            if (engine.engine && myVars.eloRating) {
                setEngineElo(myVars.eloRating, true);
                console.log('Engine ELO updated to:', myVars.eloRating, '(depth preserved)');
            }

            // Initialize auto queue observer if enabled
            myFunctions.updateAutoQueueObserver();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Function to show welcome modal for first-time users
    function showWelcomeModal() {
        // Create welcome modal
        const welcomeModal = document.createElement('div');
        welcomeModal.id = 'welcomeModal';
        welcomeModal.style = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style = `
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #333;
            transition: color 0.2s;
        `;
        closeBtn.onmouseover = function() {
            this.style.color = '#F44336';
        };
        closeBtn.onmouseout = function() {
            this.style.color = '#333';
        };
        closeBtn.onclick = function() {
            welcomeModal.style.display = 'none';
        };

        modalContent.appendChild(closeBtn);

        // Welcome content
        const welcomeTitle = document.createElement('h2');
        welcomeTitle.textContent = 'Welcome to Chess AI!';
        welcomeTitle.style = 'margin-top: 0; color: #2196F3; border-bottom: 2px solid #eee; padding-bottom: 10px;';
        modalContent.appendChild(welcomeTitle);

        const welcomeText = document.createElement('p');
        welcomeText.textContent = 'Thank you for installing Chess AI. This tool helps you analyze chess positions and find the best moves during your games on Chess.com.';
        welcomeText.style = 'margin-bottom: 20px; color: #666;';
        modalContent.appendChild(welcomeText);

        // Quick start guide
        const quickStartTitle = document.createElement('h3');
        quickStartTitle.textContent = 'Quick Start Guide';
        quickStartTitle.style = 'color: #4CAF50; margin-bottom: 15px;';
        modalContent.appendChild(quickStartTitle);

        const steps = [
            { title: 'Run the Engine', content: 'Press any key from Q to M to run the engine at different depths. Higher depths give stronger analysis but take longer.' },
            { title: 'View Best Moves', content: 'The best moves will be highlighted on the board, and the evaluation bar will show who has the advantage.' },
            { title: 'Adjust Settings', content: 'Click the settings icon to customize the engine strength, visual indicators, and auto-play options.' },
            { title: 'Keyboard Shortcuts', content: 'Use keyboard shortcuts for quick access. Press the "Keyboard Shortcuts" button to see all available shortcuts.' }
        ];

        const stepsList = document.createElement('div');
        stepsList.style = 'margin-bottom: 25px;';

        steps.forEach((step, index) => {
            const stepItem = document.createElement('div');
            stepItem.style = 'margin-bottom: 15px; display: flex;';

            const stepNumber = document.createElement('div');
            stepNumber.textContent = (index + 1);
            stepNumber.style = `
                width: 25px;
                height: 25px;
                background-color: #2196F3;
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                flex-shrink: 0;
                font-weight: bold;
            `;

            const stepContent = document.createElement('div');

            const stepTitle = document.createElement('div');
            stepTitle.textContent = step.title;
            stepTitle.style = 'font-weight: bold; margin-bottom: 5px;';

            const stepDescription = document.createElement('div');
            stepDescription.textContent = step.content;
            stepDescription.style = 'color: #666;';

            stepContent.appendChild(stepTitle);
            stepContent.appendChild(stepDescription);

            stepItem.appendChild(stepNumber);
            stepItem.appendChild(stepContent);

            stepsList.appendChild(stepItem);
        });

        modalContent.appendChild(stepsList);

        // Tips section
        const tipsTitle = document.createElement('h3');
        tipsTitle.textContent = 'Pro Tips';
        tipsTitle.style = 'color: #FF9800; margin-bottom: 15px;';
        modalContent.appendChild(tipsTitle);

        const tipsList = document.createElement('ul');
        tipsList.style = 'margin-bottom: 25px; padding-left: 20px;';

        const tips = [
            'Use depths 1-10 for quick analysis and casual play.',
            'Use depths 15+ for serious analysis and difficult positions.',
            'Enable "Auto Move" to automatically play the best move.',
            'Try "Human Mode" to get more natural, human-like suggestions.',
            'Customize the evaluation bar colors in the Visual tab.'
        ];

        tips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipItem.style = 'margin-bottom: 8px; color: #666;';
            tipsList.appendChild(tipItem);
        });

        modalContent.appendChild(tipsList);

        // Get started button
        const getStartedBtn = document.createElement('button');
        getStartedBtn.textContent = 'Get Started';
        getStartedBtn.style = `
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.2s;
        `;
        getStartedBtn.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
        };
        getStartedBtn.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };
        getStartedBtn.onclick = function() {
            welcomeModal.style.display = 'none';
        };

        modalContent.appendChild(getStartedBtn);

        welcomeModal.appendChild(modalContent);
        document.body.appendChild(welcomeModal);
    }

    // The move history display is now embedded directly in the Actions tab HTML

    // Add a move to the history
    myFunctions.addMoveToHistory = function(move, evaluation, depth) {
        const tableBody = document.getElementById('moveHistoryTableBody');
        if (!tableBody) return;

        const row = document.createElement('tr');

        // Format the evaluation
        let evalText = '';
        if (typeof evaluation === 'string' && evaluation.includes('Mate')) {
            evalText = evaluation;
        } else {
            const sign = evaluation > 0 ? '+' : '';
            evalText = `${sign}${parseFloat(evaluation).toFixed(2)}`;
        }

        row.innerHTML = `
            <td style="padding: 5px; border-bottom: 1px solid #ddd;">${move}</td>
            <td style="padding: 5px; border-bottom: 1px solid #ddd;">${evalText}</td>
            <td style="padding: 5px; border-bottom: 1px solid #ddd;">${depth}</td>
        `;

        // Add the new row at the top
        if (tableBody.firstChild) {
            tableBody.insertBefore(row, tableBody.firstChild);
        } else {
            tableBody.appendChild(row);
        }

        // Limit the number of rows to 50
        while (tableBody.children.length > 50) {
            tableBody.removeChild(tableBody.lastChild);
        }
    };

    // Function to update the auto run status indicator
    myFunctions.updateAutoRunStatus = function(status) {
        if (!$('#autoRunStatus')[0]) return;

        switch(status) {
            case 'on':
                $('#autoRunStatus').text('On');
                $('#autoRunStatus').css('color', '#4CAF50');
                break;
            case 'off':
                $('#autoRunStatus').text('Off');
                $('#autoRunStatus').css('color', '#666');
                break;
            case 'waiting':
                $('#autoRunStatus').text('Waiting...');
                $('#autoRunStatus').css('color', '#FFA500');
                break;
            case 'running':
                $('#autoRunStatus').text('Running...');
                $('#autoRunStatus').css('color', '#2196F3');
                break;
        }
    };

    // Function to update the auto move status indicator
    myFunctions.updateAutoMoveStatus = function(status) {
        if (!$('#autoMoveStatus')[0]) return;

        switch(status) {
            case 'on':
                $('#autoMoveStatus').text('On');
                $('#autoMoveStatus').css('color', '#4CAF50');
                break;
            case 'off':
                $('#autoMoveStatus').text('Off');
                $('#autoMoveStatus').css('color', '#666');
                break;
        }
    };

    // Function to evaluate the complexity of the board position
    function evaluateBoardComplexity(boardState) {
        let complexity = 0;

        // Example evaluation criteria
        const pieceValues = {
            'p': 1,   // Pawn
            'r': 5,   // Rook
            'n': 3,   // Knight
            'b': 3,   // Bishop
            'q': 9,   // Queen
            'k': 0,   // King (not counted)
        };

        // Loop through the board state to evaluate material balance
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardState[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()] || 0;
                    complexity += piece === piece.toUpperCase() ? value : -value; // Add for white, subtract for black
                }
            }
        }

        // Additional complexity factors can be added here
        // For example, consider piece activity, control of the center, etc.
        // This is a simple example; you can expand it based on your needs

        // Normalize complexity to a reasonable range
        complexity = Math.abs(complexity); // Ensure it's positive
        return Math.floor(complexity / 10); // Scale down for thinking time calculation
    }

    myFunctions.extractOpponentRating = function() {
        // Try to find the opponent's rating using the new selector
        try {
            // Try the new selector first
            const ratingElement = document.querySelector("#board-layout-player-top .cc-user-rating-white");
            if (ratingElement) {
                const ratingText = ratingElement.textContent.trim();
                const ratingMatch = ratingText.match(/\((\d+)\)/);
                if (ratingMatch && ratingMatch[1]) {
                    const rating = parseInt(ratingMatch[1]);
                    if (!isNaN(rating)) {
                        console.log(`Opponent rating detected: ${rating}`);
                        return rating;
                    }
                }
            }

            // Fallback to old selector if new one fails
            const ratingElements = document.querySelectorAll('.user-tagline-rating');
            if (ratingElements.length >= 2) {
                // Find the element that doesn't match the player's username
                const playerUsername = document.querySelector('.user-username-component')?.textContent.trim();

                for (const element of ratingElements) {
                    const usernameElement = element.closest('.user-tagline')?.querySelector('.user-username-component');
                    if (usernameElement && usernameElement.textContent.trim() !== playerUsername) {
                        const rating = parseInt(element.textContent.trim());
                        if (!isNaN(rating)) {
                            console.log(`Opponent rating detected (fallback): ${rating}`);
                            return rating;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error extracting opponent rating:', error);
        }

        return null;
    }

    // Function to show welcome modal for first-time users
    myFunctions.showWelcomeModal = function() {
        // Create welcome modal
        const welcomeModal = document.createElement('div');
        welcomeModal.id = 'welcomeModal';
        welcomeModal.style = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style = `
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #333;
            transition: color 0.2s;
        `;
        closeBtn.onmouseover = function() {
            this.style.color = '#F44336';
        };
        closeBtn.onmouseout = function() {
            this.style.color = '#333';
        };
        closeBtn.onclick = function() {
            welcomeModal.style.display = 'none';
        };

        modalContent.appendChild(closeBtn);

        // Welcome content
        const welcomeTitle = document.createElement('h2');
        welcomeTitle.textContent = 'Welcome to Chess AI!';
        welcomeTitle.style = 'margin-top: 0; color: #2196F3; border-bottom: 2px solid #eee; padding-bottom: 10px;';
        modalContent.appendChild(welcomeTitle);

        const welcomeText = document.createElement('p');
        welcomeText.textContent = 'Thank you for installing Chess AI. This tool helps you analyze chess positions and find the best moves during your games on Chess.com.';
        welcomeText.style = 'margin-bottom: 20px; color: #666;';
        modalContent.appendChild(welcomeText);

        // Quick start guide
        const quickStartTitle = document.createElement('h3');
        quickStartTitle.textContent = 'Quick Start Guide';
        quickStartTitle.style = 'color: #4CAF50; margin-bottom: 15px;';
        modalContent.appendChild(quickStartTitle);

        const steps = [
            { title: 'Run the Engine', content: 'Press any key from Q to M to run the engine at different depths. Higher depths give stronger analysis but take longer.' },
            { title: 'View Best Moves', content: 'The best moves will be highlighted on the board, and the evaluation bar will show who has the advantage.' },
            { title: 'Adjust Settings', content: 'Click the settings icon to customize the engine strength, visual indicators, and auto-play options.' },
            { title: 'Keyboard Shortcuts', content: 'Use keyboard shortcuts for quick access. Press the "Keyboard Shortcuts" button to see all available shortcuts.' }
        ];

        const stepsList = document.createElement('div');
        stepsList.style = 'margin-bottom: 25px;';

        steps.forEach((step, index) => {
            const stepItem = document.createElement('div');
            stepItem.style = 'margin-bottom: 15px; display: flex;';

            const stepNumber = document.createElement('div');
            stepNumber.textContent = (index + 1);
            stepNumber.style = `
                width: 25px;
                height: 25px;
                background-color: #2196F3;
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                flex-shrink: 0;
                font-weight: bold;
            `;

            const stepContent = document.createElement('div');

            const stepTitle = document.createElement('div');
            stepTitle.textContent = step.title;
            stepTitle.style = 'font-weight: bold; margin-bottom: 5px;';

            const stepDescription = document.createElement('div');
            stepDescription.textContent = step.content;
            stepDescription.style = 'color: #666;';

            stepContent.appendChild(stepTitle);
            stepContent.appendChild(stepDescription);

            stepItem.appendChild(stepNumber);
            stepItem.appendChild(stepContent);

            stepsList.appendChild(stepItem);
        });

        modalContent.appendChild(stepsList);

        // Tips section
        const tipsTitle = document.createElement('h3');
        tipsTitle.textContent = 'Pro Tips';
        tipsTitle.style = 'color: #FF9800; margin-bottom: 15px;';
        modalContent.appendChild(tipsTitle);

        const tipsList = document.createElement('ul');
        tipsList.style = 'margin-bottom: 25px; padding-left: 20px;';

        const tips = [
            'Use depths 1-10 for quick analysis and casual play.',
            'Use depths 15+ for serious analysis and difficult positions.',
            'Enable "Auto Move" to automatically play the best move.',
            'Try "Human Mode" to get more natural, human-like suggestions.',
            'Customize the evaluation bar colors in the Visual tab.'
        ];

        tips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipItem.style = 'margin-bottom: 8px; color: #666;';
            tipsList.appendChild(tipItem);
        });

        modalContent.appendChild(tipsList);

        // Get started button
        const getStartedBtn = document.createElement('button');
        getStartedBtn.textContent = 'Get Started';
        getStartedBtn.style = `
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.2s;
        `;
        getStartedBtn.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
        };
        getStartedBtn.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };
        getStartedBtn.onclick = function() {
            welcomeModal.style.display = 'none';
        };

        modalContent.appendChild(getStartedBtn);

        welcomeModal.appendChild(modalContent);
        document.body.appendChild(welcomeModal);
    }
}

//Touching below may break the script

var isThinking = false
var canGo = true;
var myTurn = false;
var board;

window.addEventListener("load", (event) => {
    // Start the main application
    main();
});
