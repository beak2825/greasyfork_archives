// ==UserScript==
// @name         Rugplay Coin Flip Predictor
// @version      1.0.0
// @description  AI-powered coin flip predictor with auto-training for Rugplay
// @author       pompompur.in (pomsaddons.xyz)
// @match        https://rugplay.com/gambling
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace hjusuihsduifsdhuisdfhuisdfhsdfuihfsdui@pomsaddons.xyz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541305/Rugplay%20Coin%20Flip%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/541305/Rugplay%20Coin%20Flip%20Predictor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the UI container
    const coinFlipUI = document.createElement('div');
    coinFlipUI.id = 'coinFlipPredictor';
    coinFlipUI.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: #1a1a1a;
        border: 2px solid #333;
        border-radius: 12px;
        padding: 15px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        color: white;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;

    coinFlipUI.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div style="font-weight:bold; font-size:18px; color:#FFD700;">🎲 Coin Flip Predictor</div>
            <button id="minimizeBtn" style="background:#444; color:white; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;">–</button>
        </div>
        
        <div id="botContent">
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Current Prediction:</div>
                <div id="prediction" style="font-size:24px; font-weight:bold; text-align:center; padding:10px; background:#222; border-radius:8px; margin-bottom:8px;">---</div>
                <div id="confidence" style="font-size:16px; text-align:center; color:#FFD700;">Confidence: ---</div>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Record Result:</div>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <button id="headsBtn" style="flex:1; padding:12px; background:#4CAF50; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px; font-weight:bold;">HEADS</button>
                    <button id="tailsBtn" style="flex:1; padding:12px; background:#2196F3; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px; font-weight:bold;">TAILS</button>
                </div>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Statistics:</div>
                <div style="background:#222; padding:10px; border-radius:8px; font-size:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Total Flips:</span>
                        <span id="totalFlips">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Heads:</span>
                        <span id="headsCount">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Tails:</span>
                        <span id="tailsCount">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Heads %:</span>
                        <span id="headsPercent">0%</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Tails %:</span>
                        <span id="tailsPercent">0%</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Recent History:</div>
                <div id="history" style="background:#222; padding:10px; border-radius:8px; font-size:12px; max-height:100px; overflow-y:auto; font-family:monospace;">
                    No history yet
                </div>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Training Log:</div>
                <div id="logArea" style="background:#222; padding:10px; border-radius:8px; font-size:11px; max-height:120px; overflow-y:auto; font-family:monospace;">
                    Ready for training...
                </div>
            </div>
            
            <div style="margin-bottom:15px;">
                <div style="font-size:14px; color:#CCC; margin-bottom:8px;">Auto Training:</div>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <button id="startTrainingBtn" style="flex:1; padding:10px; background:#4CAF50; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:bold;">Start Training</button>
                    <button id="stopTrainingBtn" style="flex:1; padding:10px; background:#F44336; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:bold;" disabled>Stop Training</button>
                </div>
                <div style="background:#222; padding:10px; border-radius:8px; font-size:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Training Status:</span>
                        <span id="trainingStatus">Stopped</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Total Bets:</span>
                        <span id="totalBets">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>Wins:</span>
                        <span id="winsCount">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Win Rate:</span>
                        <span id="winRate">0%</span>
                    </div>
                </div>
            </div>
            
            <div style="display:flex; gap:10px;">
                <button id="clearBtn" style="flex:1; padding:8px; background:#F44336; color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Clear Data</button>
                <button id="exportBtn" style="flex:1; padding:8px; background:#9C27B0; color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Export Data</button>
            </div>
        </div>
    `;

    document.body.appendChild(coinFlipUI);

    // Data storage
    let flipHistory = [];
    let totalFlips = 0;
    let headsCount = 0;
    let tailsCount = 0;

    // Auto training variables
    let isTraining = false;
    let trainingInterval = null;
    let totalBets = 0;
    let winsCount = 0;

    // Load data from localStorage
    function loadData() {
        const saved = localStorage.getItem('coinFlipData');
        if (saved) {
            const data = JSON.parse(saved);
            flipHistory = data.history || [];
            totalFlips = data.totalFlips || 0;
            headsCount = data.headsCount || 0;
            tailsCount = data.tailsCount || 0;
            totalBets = data.totalBets || 0;
            winsCount = data.winsCount || 0;
            updateDisplay();
        }
    }

    // Save data to localStorage
    function saveData() {
        const data = {
            history: flipHistory,
            totalFlips: totalFlips,
            headsCount: headsCount,
            tailsCount: tailsCount,
            totalBets: totalBets,
            winsCount: winsCount
        };
        localStorage.setItem('coinFlipData', JSON.stringify(data));
    }

    // Update all display elements
    function updateDisplay() {
        // Update statistics
        document.getElementById('totalFlips').textContent = totalFlips;
        document.getElementById('headsCount').textContent = headsCount;
        document.getElementById('tailsCount').textContent = tailsCount;
        
        const headsPercent = totalFlips > 0 ? ((headsCount / totalFlips) * 100).toFixed(1) : '0';
        const tailsPercent = totalFlips > 0 ? ((tailsCount / totalFlips) * 100).toFixed(1) : '0';
        
        document.getElementById('headsPercent').textContent = headsPercent + '%';
        document.getElementById('tailsPercent').textContent = tailsPercent + '%';
        
        // Update training statistics
        document.getElementById('totalBets').textContent = totalBets;
        document.getElementById('winsCount').textContent = winsCount;
        const winRate = totalBets > 0 ? ((winsCount / totalBets) * 100).toFixed(1) : '0';
        document.getElementById('winRate').textContent = winRate + '%';
        
        // Update history display
        updateHistoryDisplay();
        
        // Update prediction
        updatePrediction();
    }

    // Update history display
    function updateHistoryDisplay() {
        const historyDiv = document.getElementById('history');
        if (flipHistory.length === 0) {
            historyDiv.innerHTML = 'No history yet';
            return;
        }
        
        const recentHistory = flipHistory.slice(-20); // Show last 20 flips
        const historyText = recentHistory.map(flip => flip.result).join(' ');
        historyDiv.innerHTML = historyText;
    }

    // Predict next outcome based on patterns
    function predictNextOutcome() {
        if (flipHistory.length < 3) {
            return { prediction: 'INSUFFICIENT DATA', confidence: 0 };
        }
        
        // Analyze recent patterns
        const recentFlips = flipHistory.slice(-10); // Last 10 flips
        const headsInRecent = recentFlips.filter(f => f.result === 'H').length;
        const tailsInRecent = recentFlips.filter(f => f.result === 'T').length;
        
        // Check for current streak
        let currentStreak = 0;
        let lastResult = flipHistory[flipHistory.length - 1].result;
        
        // Count consecutive same results from the end
        for (let i = flipHistory.length - 1; i >= 0; i--) {
            if (flipHistory[i].result === lastResult) {
                currentStreak++;
            } else {
                break;
            }
        }
        
        // Calculate probabilities
        const overallHeadsProb = headsCount / totalFlips;
        const overallTailsProb = tailsCount / totalFlips;
        const recentHeadsProb = headsInRecent / recentFlips.length;
        const recentTailsProb = tailsInRecent / recentFlips.length;
        
        // Initialize scores
        let headsScore = 0;
        let tailsScore = 0;
        
        // Overall probability weight
        headsScore += overallHeadsProb * 0.3;
        tailsScore += overallTailsProb * 0.3;
        
        // Recent probability weight
        headsScore += recentHeadsProb * 0.4;
        tailsScore += recentTailsProb * 0.4;
        
        // Streak analysis - bet on current streak continuing
        let streakWeight = 0.3;
        if (currentStreak > 3) {
            // Bet on current streak continuing (same result)
            if (lastResult === 'H') {
                headsScore += streakWeight;
            } else {
                tailsScore += streakWeight;
            }
        } else {
            // For shorter streaks, still bet on continuation but with less weight
            const streakContinuationProb = Math.min(0.6, currentStreak * 0.15);
            if (lastResult === 'H') {
                headsScore += streakContinuationProb * streakWeight;
            } else {
                tailsScore += streakContinuationProb * streakWeight;
            }
        }
        
        // Determine prediction
        let prediction, confidence;
        if (headsScore > tailsScore) {
            prediction = 'HEADS';
            confidence = Math.min(95, (headsScore / (headsScore + tailsScore)) * 100);
        } else {
            prediction = 'TAILS';
            confidence = Math.min(95, (tailsScore / (headsScore + tailsScore)) * 100);
        }
        
        // Adjust confidence based on data amount
        const dataConfidence = Math.min(1, totalFlips / 50);
        confidence *= dataConfidence;
        
        return { prediction, confidence: Math.round(confidence) };
    }

    // Update prediction display
    function updatePrediction() {
        const predictionDiv = document.getElementById('prediction');
        const confidenceDiv = document.getElementById('confidence');
        
        if (totalFlips < 3) {
            predictionDiv.textContent = 'NEED MORE DATA';
            predictionDiv.style.color = '#FFA500';
            confidenceDiv.textContent = 'Confidence: Low (Need at least 3 flips)';
            confidenceDiv.style.color = '#FFA500';
            return;
        }
        
        const { prediction, confidence } = predictNextOutcome();
        
        predictionDiv.textContent = prediction;
        confidenceDiv.textContent = 'Confidence: ' + confidence + '%';
        
        // Color coding based on confidence
        if (confidence >= 70) {
            predictionDiv.style.color = '#4CAF50';
            confidenceDiv.style.color = '#4CAF50';
        } else if (confidence >= 50) {
            predictionDiv.style.color = '#FFD700';
            confidenceDiv.style.color = '#FFD700';
        } else {
            predictionDiv.style.color = '#FFA500';
            confidenceDiv.style.color = '#FFA500';
        }
    }

    // Record a flip result
    function recordFlip(result) {
        const timestamp = new Date().toLocaleTimeString();
        flipHistory.push({ result, timestamp });
        
        if (result === 'H') {
            headsCount++;
        } else {
            tailsCount++;
        }
        
        totalFlips++;
        
        saveData();
        updateDisplay();
        
        // Show feedback
        const predictionDiv = document.getElementById('prediction');
        const originalText = predictionDiv.textContent;
        const originalColor = predictionDiv.style.color;
        
        predictionDiv.textContent = result === 'H' ? 'HEADS' : 'TAILS';
        predictionDiv.style.color = result === 'H' ? '#4CAF50' : '#2196F3';
        
        setTimeout(() => {
            updatePrediction();
        }, 1500);
    }

    // Auto training functions
    async function makeCoinFlipBet() {
        try {
            // Get prediction before betting
            let betSide = "tails"; // default
            let confidence = 0;
            
            if (totalFlips >= 3) {
                const prediction = predictNextOutcome();
                betSide = prediction.prediction.toLowerCase();
                confidence = prediction.confidence;
            }
            
            const response = await fetch("https://rugplay.com/api/gambling/coinflip", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0"
                },
                "referrer": "https://rugplay.com/gambling",
                "body": JSON.stringify({"side": betSide, "amount": 1}),
                "method": "POST",
                "mode": "cors"
            });

            if (!response.ok) {
                logMsg('Bet failed: ' + response.status);
                return;
            }

            const result = await response.json();
            totalBets++;
            
            // Determine the actual result from the API response
            const actualResult = result.result; // "heads" or "tails"
            const won = result.won;
            
            if (won) {
                winsCount++;
            }
            
            // Convert to our format (H/T) and record
            const resultCode = actualResult === 'heads' ? 'H' : 'T';
            recordFlip(resultCode);
            
            // Log the result with prediction info
            const status = won ? 'WON' : 'LOST';
            const predictionText = totalFlips >= 3 ? ' (Prediction: ' + betSide.toUpperCase() + ' @ ' + confidence + '%)' : ' (No prediction yet)';
            logMsg(status + ' - Result: ' + actualResult.toUpperCase() + predictionText);
            
            // Update training status
            document.getElementById('trainingStatus').textContent = 'Training (' + totalBets + ' bets)';
            
        } catch (error) {
            logMsg('Training error: ' + error.message);
        }
    }

    function startTraining() {
        if (isTraining) return;
        
        isTraining = true;
        document.getElementById('startTrainingBtn').disabled = true;
        document.getElementById('stopTrainingBtn').disabled = false;
        document.getElementById('trainingStatus').textContent = 'Training (0 bets)';
        
        // Start making bets every 500ms
        trainingInterval = setInterval(() => {
            if (isTraining) {
                makeCoinFlipBet();
            }
        }, 500);
        
        logMsg("Auto training started - betting based on predictions every 500ms");
    }

    function stopTraining() {
        if (!isTraining) return;
        
        isTraining = false;
        if (trainingInterval) {
            clearInterval(trainingInterval);
            trainingInterval = null;
        }
        
        document.getElementById('startTrainingBtn').disabled = false;
        document.getElementById('stopTrainingBtn').disabled = true;
        document.getElementById('trainingStatus').textContent = 'Stopped';
        
        logMsg("Auto training stopped");
    }

    // Add log function for training messages
    function logMsg(msg) {
        const log = document.getElementById("logArea");
        const time = new Date().toLocaleTimeString();
        log.innerHTML = '[' + time + '] ' + msg + '<br>' + log.innerHTML;
        
        // Keep only last 50 messages
        const messages = log.innerHTML.split('<br>');
        if (messages.length > 50) {
            log.innerHTML = messages.slice(0, 50).join('<br>');
        }
    }

    // Event handlers
    document.getElementById("minimizeBtn").onclick = () => {
        const content = document.getElementById("botContent");
        const btn = document.getElementById("minimizeBtn");
        if (content.style.display === "none") {
            content.style.display = "block";
            btn.textContent = "–";
        } else {
            content.style.display = "none";
            btn.textContent = "+";
        }
    };

    document.getElementById("headsBtn").onclick = () => {
        recordFlip('H');
    };

    document.getElementById("tailsBtn").onclick = () => {
        recordFlip('T');
    };

    document.getElementById("clearBtn").onclick = () => {
        if (confirm('Are you sure you want to clear all data?')) {
            flipHistory = [];
            totalFlips = 0;
            headsCount = 0;
            tailsCount = 0;
            saveData();
            updateDisplay();
        }
    };

    document.getElementById("exportBtn").onclick = () => {
        const data = {
            history: flipHistory,
            totalFlips: totalFlips,
            headsCount: headsCount,
            tailsCount: tailsCount,
            totalBets: totalBets,
            winsCount: winsCount,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coinflip-data-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    document.getElementById("startTrainingBtn").onclick = () => {
        startTraining();
    };

    document.getElementById("stopTrainingBtn").onclick = () => {
        stopTraining();
    };

    // Initialize
    loadData();
    updateDisplay();

    // Add some styling to make it look better
    const style = document.createElement('style');
    style.textContent = `
        #headsBtn:hover { background: #45a049 !important; }
        #tailsBtn:hover { background: #1976D2 !important; }
        #clearBtn:hover { background: #d32f2f !important; }
        #exportBtn:hover { background: #7B1FA2 !important; }
        #minimizeBtn:hover { background: #666 !important; }
    `;
    document.head.appendChild(style);

})();
