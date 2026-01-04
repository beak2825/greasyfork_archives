// ==UserScript==
// @name         Torn Chain Timer - Enhanced
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Chain timer with reliable updates, better UI, and sound alerts
// @author       lilha [2630451] & KillerCleat [2842410]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534314/Torn%20Chain%20Timer%20-%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/534314/Torn%20Chain%20Timer%20-%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        minSize: 20,
        maxSize: 200,
        defaultSize: 40,
        updateInterval: 250,
        criticalThreshold: 45,
        warningThreshold: 90,
        soundEnabled: GM_getValue('soundEnabled', true),
        fontSize: GM_getValue('fontSize', 40),
        boxPosition: GM_getValue('boxPosition', { left: 20, top: 20 })
    };

    // Hitting 1 Sound
    let beepAudio = new Audio('https://www.myinstants.com/media/sounds/hitting-1.mp3');

    // Add base CSS
    GM_addStyle(`
        #chain-timer-container {
            position: fixed;
            left: ${config.boxPosition.left}px;
            top: ${config.boxPosition.top}px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-weight: bold;
            border-radius: 5px;
            z-index: 9999;
            cursor: move;
            user-select: none;
            transition: all 0.3s ease;
            min-width: 120px;
        }
        #chain-timer {
            font-size: ${config.fontSize}px;
            text-align: center;
            margin-bottom: 5px;
            transition: font-size 0.2s ease;
        }
        .timer-controls {
            display: flex;
            gap: 5px;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        }
        .timer-btn {
            cursor: pointer;
            padding: 2px 5px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            font-size: 12px;
        }
        .timer-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        #size-slider {
            width: 80px;
            margin: 0 5px;
            cursor: pointer;
            accent-color: #ffffff;
        }
        #chain-timer-container.warning {
            background: orange;
        }
        #chain-timer-container.critical {
            background: red;
            animation: flashScreen 0.5s infinite alternate;
        }
        @keyframes flashScreen {
            0% { opacity: 1; }
            100% { opacity: 0.3; }
        }
        .size-control {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 5px;
            border-radius: 3px;
        }
        .size-label {
            font-size: 10px;
            opacity: 0.8;
            margin-right: 5px;
        }
        #chain-timer-container.fullscreen {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            padding: 20px;
        }
        #chain-timer-container.fullscreen #chain-timer {
            font-size: calc(min(120px, 15vh)) !important;
        }
    `);

    // Create timer container
    const timerContainer = document.createElement('div');
    timerContainer.id = 'chain-timer-container';
    timerContainer.innerHTML = `
        <div id="chain-timer">--:--</div>
        <div class="timer-controls">
            <div class="size-control">
                <span class="size-label">Size</span>
                <input type="range" id="size-slider"
                       min="${config.minSize}"
                       max="${config.maxSize}"
                       value="${config.fontSize}">
            </div>
            <span class="timer-btn" id="timer-fullscreen">⛶</span>
            <span class="timer-btn" id="timer-minimize">_</span>
            <span class="timer-btn" id="toggle-sound">${config.soundEnabled ? '🔊' : '🔇'}</span>
        </div>
    `;
    document.body.appendChild(timerContainer);

    let lastTime = '';
    let observer;
    let interval;
    let warningBeepPlayed = false;
    let criticalBeepPlayed = false;
    let isMinimized = false;
    let isFullscreen = false;

    function initObserver() {
        if (observer) observer.disconnect();
        clearInterval(interval);

        // Try both old and new selectors
        const timerElement = document.querySelector('.chain-box-timeleft, .bar-timeleft___B9RGV');

        if (timerElement) {
            observer = new MutationObserver(() => updateTimer());
            observer.observe(timerElement, { characterData: true, childList: true, subtree: true });
            interval = setInterval(updateTimer, config.updateInterval);
            updateTimer();
        } else {
            setTimeout(initObserver, 1000);
            document.getElementById('chain-timer').textContent = '--:--';
        }
    }

    function updateTimer() {
        const timerElement = document.querySelector('.chain-box-timeleft, .bar-timeleft___B9RGV');
        const displayElement = document.getElementById('chain-timer');

        if (timerElement) {
            const newTime = timerElement.textContent.trim();

            if (!/^\d+:\d{2}$/.test(newTime)) return;

            if (newTime !== lastTime) {
                lastTime = newTime;
                displayElement.textContent = newTime;

                const [mins, secs] = newTime.split(':').map(Number);
                const totalSeconds = mins * 60 + secs;

                timerContainer.classList.remove('warning', 'critical');

                if (totalSeconds <= config.criticalThreshold) {
                    timerContainer.classList.add('critical');
                    if (config.soundEnabled && !criticalBeepPlayed) {
                        beepAudio.play().catch(err => console.error("Beep failed to play:", err));
                        criticalBeepPlayed = true;
                    }
                } else if (totalSeconds <= config.warningThreshold) {
                    timerContainer.classList.add('warning');
                    if (config.soundEnabled && !warningBeepPlayed) {
                        beepAudio.play().catch(err => console.error("Beep failed to play:", err));
                        warningBeepPlayed = true;
                    }
                } else {
                    warningBeepPlayed = false;
                    criticalBeepPlayed = false;
                }
            }
        } else {
            displayElement.textContent = '--:--';
            timerContainer.classList.remove('warning', 'critical');
        }
    }

    // Size slider functionality
    const sizeSlider = document.getElementById('size-slider');
    const timerDisplay = document.getElementById('chain-timer');

    sizeSlider.addEventListener('input', (e) => {
        const newSize = parseInt(e.target.value);
        config.fontSize = newSize;
        GM_setValue('fontSize', newSize);

        if (!isFullscreen) {
            timerDisplay.style.fontSize = `${newSize}px`;
        }
    });

    // Fullscreen toggle
    document.getElementById('timer-fullscreen').addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        timerContainer.classList.toggle('fullscreen');
        document.getElementById('timer-fullscreen').textContent = isFullscreen ? '⮌' : '⛶';

        if (!isFullscreen) {
            // Only update font size when exiting fullscreen
            timerDisplay.style.fontSize = `${config.fontSize}px`;
        }
    });

    // Minimize button
    document.getElementById('timer-minimize').addEventListener('click', () => {
        const controls = timerContainer.querySelector('.timer-controls');
        isMinimized = !isMinimized;

        if (isMinimized) {
            controls.style.display = 'none';
            document.getElementById('timer-minimize').textContent = '□';
        } else {
            controls.style.display = 'flex';
            document.getElementById('timer-minimize').textContent = '_';
        }
    });

    // Sound toggle
    document.getElementById('toggle-sound').addEventListener('click', () => {
        config.soundEnabled = !config.soundEnabled;
        GM_setValue('soundEnabled', config.soundEnabled);
        document.getElementById('toggle-sound').textContent = config.soundEnabled ? '🔊' : '🔇';
        if (config.soundEnabled) {
            beepAudio.play().catch(err => console.error("Beep failed to play:", err));
        }
    });

    // Make the timer draggable
    timerContainer.onmousedown = function(event) {
        if (event.target.classList.contains('timer-btn') ||
            event.target.id === 'size-slider' ||
            isFullscreen) return;

        let shiftX = event.clientX - timerContainer.getBoundingClientRect().left;
        let shiftY = event.clientY - timerContainer.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            config.boxPosition = {
                left: Math.max(0, Math.min(pageX - shiftX, window.innerWidth - timerContainer.offsetWidth)),
                top: Math.max(0, Math.min(pageY - shiftY, window.innerHeight - timerContainer.offsetHeight))
            };
            timerContainer.style.left = `${config.boxPosition.left}px`;
            timerContainer.style.top = `${config.boxPosition.top}px`;
            GM_setValue('boxPosition', config.boxPosition);
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    timerContainer.ondragstart = () => false;

    // Initialize
    initObserver();

    // Handle page navigation
    setInterval(() => {
        if (!document.querySelector('.chain-box-timeleft, .bar-timeleft___B9RGV')) {
            initObserver();
        }
    }, 3000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) initObserver();
    });

    // Handle SPA navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(initObserver, 500);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(initObserver, 500);
    };
})();