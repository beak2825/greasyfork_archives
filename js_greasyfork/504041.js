// ==UserScript==
// @name         Heart Clicker Cheat Panel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a modern cheat panel to the Heart Clicker game with draggable functionality and additional features
// @match        https://heart-io.github.io/Heart/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504041/Heart%20Clicker%20Cheat%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/504041/Heart%20Clicker%20Cheat%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles for the cheat panel and buttons
    const style = document.createElement('style');
    style.innerHTML = `
        #cheat-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            background: #fff;
            border: 1px solid #333;
            padding: 15px;
            border-radius: 10px;
            width: 350px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }
        #cheat-panel h2 {
            margin: 0;
            font-size: 1.2em;
            color: #333;
        }
        .item {
            margin-bottom: 15px;
        }
        .item label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .item input, .item select, .item button {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            font-size: 1em;
        }
        #close-cheat-panel, #reopen-cheat-panel {
            background: #ff4d4d;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 10px;
            cursor: pointer;
            font-size: 1em;
        }
        #reopen-cheat-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
        }
        #warning-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            display: none;
            z-index: 1001;
        }
        #warning-panel button {
            margin: 5px;
            padding: 10px;
            font-size: 1em;
        }
        .bounce {
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-30px);
            }
            60% {
                transform: translateY(-15px);
            }
        }
    `;
    document.head.appendChild(style);

    // Create cheat panel HTML
    const panelHtml = `
        <div id="cheat-panel">
            <h2>Cheat Panel</h2>
            <div class="item">
                <label for="set-hearts">Set Hearts:</label>
                <input type="number" id="set-hearts" placeholder="Enter hearts" />
                <button id="apply-hearts">Apply</button>
            </div>
            <div class="item">
                <label for="heart-selection">Change Heart Character:</label>
                <select id="heart-selection">
                    <!-- Dynamically filled with heart options -->
                </select>
                <button id="change-heart">Change</button>
            </div>
            <div class="item">
                <button id="unlock-admin">Unlock Admin Character</button>
            </div>
            <div class="item">
                <button id="realistic-mode">Realistic Mode</button>
            </div>
            <button id="close-cheat-panel">X</button>
        </div>
        <div id="warning-panel">
            <p>This might disturb you. Are you sure you want it realistic?</p>
            <button id="confirm-realistic">Yes</button>
            <button id="cancel-realistic">No</button>
        </div>
        <button id="reopen-cheat-panel">Show Cheat Panel</button>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHtml);

    // Initialize heart characters
    const heartCharacters = [
        { symbol: '💙', name: 'Blue Heart', cost: 100 },
        { symbol: '💚', name: 'Green Heart', cost: 150 },
        { symbol: '💛', name: 'Yellow Heart', cost: 200 },
        { symbol: '💜', name: 'Purple Heart', cost: 250 },
        { symbol: '🤍', name: 'White Heart', cost: 300 },
        { symbol: '🖤', name: 'Black Heart', cost: 350 },
        { symbol: '💖', name: 'Sparkling Heart', cost: 400 },
        { symbol: '💗', name: 'Growing Heart', cost: 450 },
        { symbol: '💝', name: 'Heart with Ribbon', cost: 500 },
        { symbol: '💘', name: 'Heart with Arrow', cost: 550 },
        { symbol: '❤️‍🔥', name: 'Heart on Fire', cost: 600 },
        { symbol: '💞', name: 'Revolving Hearts', cost: 650 },
        { symbol: '💕', name: 'Two Hearts', cost: 700 },
        { symbol: '💟', name: 'Heart Decoration', cost: 750 },
        { symbol: '❣️', name: 'Heavy Heart Exclamation', cost: 800 },
        { symbol: '❤️‍🩹', name: 'Heart with Bandage', cost: 850 }
    ];

    // Populate heart selection
    const heartSelection = document.getElementById('heart-selection');
    heartCharacters.forEach(heart => {
        const option = document.createElement('option');
        option.value = heart.symbol;
        option.text = heart.name;
        heartSelection.add(option);
    });

    let heartCount = parseInt(localStorage.getItem('heartCount')) || 0;
    let currentHeart = localStorage.getItem('currentHeart') || '❤️';
    let realisticMode = false;

    function updateHeartCount() {
        const clicker = document.getElementById('clicker');
        if (clicker) {
            clicker.innerText = heartCount;
        }
    }

    function saveGameState() {
        localStorage.setItem('heartCount', heartCount);
        localStorage.setItem('currentHeart', currentHeart);
    }

    document.getElementById('apply-hearts').addEventListener('click', () => {
        const hearts = parseInt(document.getElementById('set-hearts').value);
        if (!isNaN(hearts) && hearts >= 0) {
            heartCount = hearts;
            updateHeartCount();
            saveGameState();
        } else {
            alert('Invalid heart count!');
        }
    });

    document.getElementById('change-heart').addEventListener('click', () => {
        const selectedHeart = document.getElementById('heart-selection').value;
        currentHeart = selectedHeart;
        const clicker = document.getElementById('clicker');
        if (clicker) {
            clicker.innerHTML = `<img src="${currentHeart}" style="width: 50px; height: 50px;">`;
            updateHeartCount();
            saveGameState();
        }
    });

    document.getElementById('unlock-admin').addEventListener('click', () => {
        currentHeart = 'https://i.ibb.co/txJkfHz/Untitled181-20240817233140.png'; // Admin Heart
        heartCount = 10000;
        const clicker = document.getElementById('clicker');
        if (clicker) {
            clicker.innerHTML = `<img src="${currentHeart}" style="width: 50px; height: 50px;">`;
            updateHeartCount();
            saveGameState();
        }
    });

    document.getElementById('realistic-mode').addEventListener('click', () => {
        document.getElementById('warning-panel').style.display = 'block';
    });

    document.getElementById('confirm-realistic').addEventListener('click', () => {
        realisticMode = true;
        currentHeart = 'https://i.ibb.co/xSVZBZq/IMG-7404.png'; // Realistic Heart
        const clicker = document.getElementById('clicker');
        if (clicker) {
            clicker.innerHTML = `<img src="${currentHeart}" style="width: 50px; height: 50px;">`;
            updateHeartCount();
            startRealisticMode();
            saveGameState();
            document.getElementById('warning-panel').style.display = 'none';
        }
    });

    document.getElementById('cancel-realistic').addEventListener('click', () => {
        document.getElementById('warning-panel').style.display = 'none';
    });

    function startRealisticMode() {
        setInterval(() => {
            if (realisticMode) {
                const clicker = document.getElementById('clicker');
                if (clicker) {
                    clicker.classList.toggle('bounce');
                    playHeartPumpSound();
                }
            }
        }, 2000);
    }

    function playHeartPumpSound() {
        const audio = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3'); // Replace with heart pump sound URL
        audio.play();
    }

    // Draggable functionality
    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - parseInt(window.getComputedStyle(element).left);
            offsetY = e.clientY - parseInt(window.getComputedStyle(element).top);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    makeDraggable(document.getElementById('cheat-panel'));

    document.getElementById('close-cheat-panel').addEventListener('click', () => {
        document.getElementById('cheat-panel').style.display = 'none';
        document.getElementById('reopen-cheat-panel').style.display = 'block';
    });

    document.getElementById('reopen-cheat-panel').addEventListener('click', () => {
        document.getElementById('cheat-panel').style.display = 'block';
        document.getElementById('reopen-cheat-panel').style.display = 'none';
    });

    // Initialize
    updateHeartCount();
})();
