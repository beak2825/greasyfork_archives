// ==UserScript==
// @name        Snapchat Score Booster Pro
// @namespace   bat_888
// @match       https://www.snapchat.com/web*
// @grant       none
// @version     1.0
// @author      d0m1n4t3
// @description Advanced Snapchat score automation tool with modern UI
// @supportURL  https://t.me/bat_888
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542413/Snapchat%20Score%20Booster%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/542413/Snapchat%20Score%20Booster%20Pro.meta.js
// ==/UserScript==

//
// ░▒▓███████▓▒░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░
//░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
//░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
// ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░
//       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
//       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
//░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░       ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░

// Advanced Snapchat Score Booster Pro
// Contact: https://t.me/bat_888

(function () {
    // Core Variables
    let clickCounter = 0;
    let isClicking = false;
    let clickTimeouts = [];
    let currentLoop = 0;
    let startTime = null;
    let totalClicks = 0;
    let errorCount = 0;
    let lastClickTime = 0;
    let successRate = 0;

    // Create Main UI Container
    const uiContainer = document.createElement('div');
    uiContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 13px;
        min-width: 320px;
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255,255,255,0.2);
        animation: slideIn 0.5s ease-out;
    `;

    // Add CSS animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
            50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }
        .pulse { animation: pulse 2s infinite; }
        .glow { animation: glow 2s infinite; }
    `;
    document.head.appendChild(styleSheet);
    document.body.appendChild(uiContainer);

    // Header Section
    const headerSection = document.createElement('div');
    headerSection.style.cssText = `
        text-align: center;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    uiContainer.appendChild(headerSection);

    const titleElement = document.createElement('div');
    titleElement.style.cssText = `
        font-size: 16px;
        font-weight: 800;
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 5px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    `;
    titleElement.textContent = '🚀 Score Booster Pro';
    headerSection.appendChild(titleElement);

    const subtitleElement = document.createElement('div');
    subtitleElement.style.cssText = `
        font-size: 11px;
        opacity: 0.8;
        font-weight: 500;
    `;
    subtitleElement.textContent = 'Advanced Automation Tool';
    headerSection.appendChild(subtitleElement);

    // Stats Dashboard
    const statsContainer = document.createElement('div');
    statsContainer.style.cssText = `
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        font-size: 12px;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    uiContainer.appendChild(statsContainer);

    const createStatCard = (label, value, icon) => {
        const statCard = document.createElement('div');
        statCard.style.cssText = `
            text-align: center;
            padding: 10px;
            background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
        `;
        statCard.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">${icon}</div>
            <div style="font-weight: bold; color: #ffd700; font-size: 16px; margin-bottom: 3px;">${value}</div>
            <div style="opacity: 0.9; font-size: 10px; font-weight: 500;">${label}</div>
        `;
        return statCard;
    };

    const currentClicksCard = createStatCard('Current Loop', '0', '🔄');
    const totalClicksCard = createStatCard('Total Clicks', '0', '💯');
    const loopCountCard = createStatCard('Loops', '0', '🔁');
    const successRateCard = createStatCard('Success Rate', '0%', '✅');

    statsContainer.appendChild(currentClicksCard);
    statsContainer.appendChild(totalClicksCard);
    statsContainer.appendChild(loopCountCard);
    statsContainer.appendChild(successRateCard);

    // Performance Monitor
    const performanceContainer = document.createElement('div');
    performanceContainer.style.cssText = `
        background: rgba(255,255,255,0.1);
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 15px;
        font-size: 12px;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    uiContainer.appendChild(performanceContainer);

    const uptimeElement = document.createElement('div');
    uptimeElement.textContent = '⏱️ Runtime: 00:00:00';
    uptimeElement.style.cssText = `
        font-weight: 600;
        margin-bottom: 5px;
        color: #4CAF50;
    `;
    performanceContainer.appendChild(uptimeElement);

    const cpsElement = document.createElement('div');
    cpsElement.textContent = '⚡ Speed: 0.0 clicks/sec';
    cpsElement.style.cssText = `
        font-weight: 600;
        color: #FF9800;
    `;
    performanceContainer.appendChild(cpsElement);

    // Status Display
    const statusElement = document.createElement('div');
    statusElement.style.cssText = `
        padding: 12px;
        border-radius: 8px;
        text-align: center;
        font-size: 12px;
        margin-bottom: 15px;
        background: rgba(220,53,69,0.2);
        color: #ff6b6b;
        font-weight: bold;
        border: 1px solid rgba(220,53,69,0.3);
        transition: all 0.3s ease;
    `;
    statusElement.textContent = '⏸️ Idle';
    uiContainer.appendChild(statusElement);

    // Control Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    `;
    uiContainer.appendChild(buttonContainer);

    const createButton = (text, color, hoverColor, icon) => {
        const button = document.createElement('button');
        button.innerHTML = `${icon} ${text}`;
        button.style.cssText = `
            flex: 1;
            padding: 12px 15px;
            background: linear-gradient(135deg, ${color}, ${hoverColor});
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        return button;
    };

    const startButton = createButton('Start', '#28a745', '#218838', '▶️');
    const stopButton = createButton('Stop', '#dc3545', '#c82333', '⏹️');
    const resetButton = createButton('Reset', '#ffc107', '#e0a800', '🔄');

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(stopButton);
    buttonContainer.appendChild(resetButton);

    // Settings Panel
    const settingsContainer = document.createElement('div');
    settingsContainer.style.cssText = `
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 15px;
        font-size: 12px;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    uiContainer.appendChild(settingsContainer);

    const settingsTitle = document.createElement('div');
    settingsTitle.textContent = '⚙️ Settings';
    settingsTitle.style.cssText = `
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
        font-size: 14px;
        color: #ffd700;
    `;
    settingsContainer.appendChild(settingsTitle);

    // Speed Setting
    const speedContainer = document.createElement('div');
    speedContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
    `;
    settingsContainer.appendChild(speedContainer);

    const speedLabel = document.createElement('label');
    speedLabel.textContent = '⚡ Speed (ms):';
    speedLabel.style.fontWeight = '600';
    speedContainer.appendChild(speedLabel);

    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.value = '300';
    speedInput.min = '100';
    speedInput.max = '5000';
    speedInput.style.cssText = `
        width: 70px;
        padding: 6px;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 5px;
        background: rgba(255,255,255,0.2);
        color: white;
        font-size: 12px;
        font-weight: 600;
    `;
    speedContainer.appendChild(speedInput);

    // Loop Delay Setting
    const loopDelayContainer = document.createElement('div');
    loopDelayContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
    `;
    settingsContainer.appendChild(loopDelayContainer);

    const loopDelayLabel = document.createElement('label');
    loopDelayLabel.textContent = '⏱️ Loop Delay (s):';
    loopDelayLabel.style.fontWeight = '600';
    loopDelayContainer.appendChild(loopDelayLabel);

    const loopDelayInput = document.createElement('input');
    loopDelayInput.type = 'number';
    loopDelayInput.value = '2';
    loopDelayInput.min = '1';
    loopDelayInput.max = '60';
    loopDelayInput.style.cssText = speedInput.style.cssText;
    loopDelayContainer.appendChild(loopDelayInput);

    // Telegram Button
    const telegramContainer = document.createElement('div');
    telegramContainer.style.cssText = `
        margin-bottom: 15px;
    `;
    uiContainer.appendChild(telegramContainer);

    const telegramButton = document.createElement('button');
    telegramButton.innerHTML = '📱 Contact Developer';
    telegramButton.style.cssText = `
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #0088cc, #0077bb);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,136,204,0.3);
        border: 1px solid rgba(255,255,255,0.2);
    `;

    telegramButton.addEventListener('click', () => {
        window.open('https://t.me/bat_888', '_blank');
    });

    telegramButton.addEventListener('mouseenter', () => {
        telegramButton.style.transform = 'translateY(-2px)';
        telegramButton.style.boxShadow = '0 6px 20px rgba(0,136,204,0.4)';
    });

    telegramButton.addEventListener('mouseleave', () => {
        telegramButton.style.transform = 'translateY(0)';
        telegramButton.style.boxShadow = '0 4px 15px rgba(0,136,204,0.3)';
    });

    telegramContainer.appendChild(telegramButton);

    // Activity Log
    const logContainer = document.createElement('div');
    logContainer.style.cssText = `
        background: rgba(0,0,0,0.4);
        padding: 12px;
        border-radius: 8px;
        max-height: 120px;
        overflow-y: auto;
        font-size: 11px;
        font-family: 'Courier New', monospace;
        line-height: 1.5;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    uiContainer.appendChild(logContainer);

    // Draggable functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    headerSection.style.cursor = 'move';
    headerSection.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffset.x = e.clientX - uiContainer.offsetLeft;
        dragOffset.y = e.clientY - uiContainer.offsetTop;
        uiContainer.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            uiContainer.style.left = (e.clientX - dragOffset.x) + 'px';
            uiContainer.style.top = (e.clientY - dragOffset.y) + 'px';
            uiContainer.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        uiContainer.style.transition = 'all 0.3s ease';
    });

    // Utility Functions
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logElement = document.createElement('div');
        const colors = {
            info: '#61dafb',
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336'
        };

        logElement.style.color = colors[type] || colors.info;
        logElement.textContent = `[${timestamp}] ${message}`;
        logContainer.appendChild(logElement);
        logContainer.scrollTop = logContainer.scrollHeight;

        if (logContainer.children.length > 25) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    function updateStats() {
        successRate = totalClicks > 0 ? ((totalClicks - errorCount) / totalClicks * 100).toFixed(1) : 0;

        currentClicksCard.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">🔄</div>
            <div style="font-weight: bold; color: #ffd700; font-size: 16px; margin-bottom: 3px;">${clickCounter}</div>
            <div style="opacity: 0.9; font-size: 10px; font-weight: 500;">Current Loop</div>
        `;

        totalClicksCard.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">💯</div>
            <div style="font-weight: bold; color: #ffd700; font-size: 16px; margin-bottom: 3px;">${totalClicks}</div>
            <div style="opacity: 0.9; font-size: 10px; font-weight: 500;">Total Clicks</div>
        `;

        loopCountCard.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">🔁</div>
            <div style="font-weight: bold; color: #ffd700; font-size: 16px; margin-bottom: 3px;">${currentLoop}</div>
            <div style="opacity: 0.9; font-size: 10px; font-weight: 500;">Loops</div>
        `;

        successRateCard.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">✅</div>
            <div style="font-weight: bold; color: #ffd700; font-size: 16px; margin-bottom: 3px;">${successRate}%</div>
            <div style="opacity: 0.9; font-size: 10px; font-weight: 500;">Success Rate</div>
        `;

        if (startTime) {
            const elapsed = (Date.now() - startTime) / 1000;
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = Math.floor(elapsed % 60);
            uptimeElement.textContent = `⏱️ Runtime: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            const cps = elapsed > 0 ? (totalClicks / elapsed).toFixed(1) : '0.0';
            cpsElement.textContent = `⚡ Speed: ${cps} clicks/sec`;
        }
    }

    function clearAllTimeouts() {
        clickTimeouts.forEach(timeout => clearTimeout(timeout));
        clickTimeouts = [];
    }

    function updateStatus(message, isRunning = false) {
        statusElement.textContent = isRunning ? '▶️ ' + message : '⏸️ ' + message;
        statusElement.style.background = isRunning ? 'rgba(40,167,69,0.2)' : 'rgba(220,53,69,0.2)';
        statusElement.style.color = isRunning ? '#4caf50' : '#ff6b6b';
        statusElement.style.borderColor = isRunning ? 'rgba(40,167,69,0.3)' : 'rgba(220,53,69,0.3)';

        if (isRunning) {
            statusElement.classList.add('pulse');
        } else {
            statusElement.classList.remove('pulse');
        }
    }

    function isElementVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
               rect.top >= 0 && rect.left >= 0 &&
               rect.bottom <= window.innerHeight &&
               rect.right <= window.innerWidth;
    }

    function getElementByXPath(xpath) {
        try {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return result.singleNodeValue;
        } catch (error) {
            log(`XPath Error: ${error.message}`, 'error');
            return null;
        }
    }

    function safeClick(element, description = 'Element') {
        try {
            if (!element) {
                log(`${description} not found`, 'warning');
                errorCount++;
                return false;
            }

            if (!isElementVisible(element)) {
                log(`${description} not visible`, 'warning');
                errorCount++;
                return false;
            }

            element.click();
            clickCounter++;
            totalClicks++;
            lastClickTime = Date.now();
            log(`${description} clicked successfully`, 'success');
            return true;
        } catch (error) {
            log(`${description} click error: ${error.message}`, 'error');
            errorCount++;
            return false;
        }
    }

    function clickElementsInSequence(xpaths, delay, callback) {
        let currentIndex = 0;

        function processNext() {
            if (!isClicking || currentIndex >= xpaths.length) {
                if (callback && isClicking) callback();
                return;
            }

            const element = getElementByXPath(xpaths[currentIndex]);
            safeClick(element, `Element ${currentIndex + 1}`);

            currentIndex++;

            if (currentIndex < xpaths.length) {
                const timeout = setTimeout(processNext, delay);
                clickTimeouts.push(timeout);
            } else {
                if (callback && isClicking) callback();
            }
        }

        processNext();
    }

    function clickAllSpecificElements(callback) {
        try {
            const ewflrElements = document.querySelectorAll('.Ewflr');
            const totalElements = [];

            ewflrElements.forEach(ewflrElement => {
                const hSQnCElements = ewflrElement.querySelectorAll('.hSQnC');
                hSQnCElements.forEach(hSQnCElement => {
                    totalElements.push(hSQnCElement);
                });
            });

            log(`Found ${totalElements.length} special elements`, 'info');
            let clickIndex = 0;

            function processNextSpecific() {
                if (!isClicking || clickIndex >= totalElements.length) {
                    if (callback && isClicking) callback();
                    return;
                }

                const element = totalElements[clickIndex];
                const svg = element.querySelector('svg');

                if (svg && svg.classList.contains('DYSLz')) {
                    safeClick(element, `Special element ${clickIndex + 1}`);
                } else {
                    log(`Special element ${clickIndex + 1} condition not met`, 'warning');
                }

                clickIndex++;

                if (clickIndex < totalElements.length) {
                    const timeout = setTimeout(processNextSpecific, parseInt(speedInput.value));
                    clickTimeouts.push(timeout);
                } else {
                    if (callback && isClicking) callback();
                }
            }

            processNextSpecific();
        } catch (error) {
            log(`Special elements error: ${error.message}`, 'error');
            errorCount++;
            if (callback && isClicking) callback();
        }
    }

    function performClicks() {
        if (!isClicking) return;

        clickCounter = 0;
        currentLoop++;
        updateStatus('Loop running...', true);

        log(`Loop ${currentLoop} started`, 'info');

        const xpaths = [
            "/html/body/main/div[1]/div[3]/div/div/div/div[1]/div[1]/div/div/div/div/div/button",
            "/html/body/main/div[1]/div[3]/div/div/div/div[1]/div[1]/div/div/div/div/div/div[2]/div/div/div/div[2]/div/button[1]/div",
            "/html/body/main/div[1]/div[3]/div/div/div/div[1]/div[1]/div/div/div/div/div[2]/div[2]/button[2]"
        ];

        const delay = parseInt(speedInput.value);

        clickElementsInSequence(xpaths, delay, () => {
            if (!isClicking) return;

            clickAllSpecificElements(() => {
                if (!isClicking) return;

                const finalElement = getElementByXPath("/html/body/main/div[1]/div[3]/div/div/div/div[1]/div[1]/div/div/div/div/div[1]/div/form/div[2]/button");
                safeClick(finalElement, 'Final element');

                log(`Loop ${currentLoop} completed`, 'success');
                updateStatus('Waiting for next loop...', true);

                const loopDelay = parseInt(loopDelayInput.value) * 1000;
                const timeout = setTimeout(() => {
                    if (isClicking) {
                        log('Starting new loop...', 'info');
                        performClicks();
                    }
                }, loopDelay);
                clickTimeouts.push(timeout);
            });
        });
    }

    function resetStats() {
        clickCounter = 0;
        totalClicks = 0;
        currentLoop = 0;
        errorCount = 0;
        successRate = 0;
        startTime = null;
        logContainer.innerHTML = '';
        updateStats();
        log('Statistics reset', 'info');
    }

    // Event Listeners
    startButton.addEventListener('click', () => {
        if (isClicking) return;

        isClicking = true;
        startTime = Date.now();
        startButton.disabled = true;
        stopButton.disabled = false;
        resetButton.disabled = true;
        startButton.classList.add('glow');

        log('Automation started', 'success');
        performClicks();
    });

    stopButton.addEventListener('click', () => {
        if (!isClicking) return;

        isClicking = false;
        clearAllTimeouts();
        startButton.disabled = false;
        stopButton.disabled = true;
        resetButton.disabled = false;
        startButton.classList.remove('glow');

        updateStatus('Stopped', false);
        log('Automation stopped', 'warning');
    });

    resetButton.addEventListener('click', () => {
        if (isClicking) {
            isClicking = false;
            clearAllTimeouts();
            startButton.disabled = false;
            stopButton.disabled = true;
            startButton.classList.remove('glow');
        }

        resetStats();
        updateStatus('Reset', false);
    });

    // Initialize
    stopButton.disabled = true;
    updateStats();
    log('Score Booster Pro initialized', 'info');
    log('Ready to start automation', 'success');

    // Update stats every second
    setInterval(updateStats, 1000);

})();