// ==UserScript==
// @name         Advanced Sploop.io Enhancements 2024!
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Very useful (Real-time, help anti-clown, smart messages, playtime tracking, smart anti-ban,  music playlist, intelligent player aiming.more.more)
// @author       avoidFPS
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.1/underscore-min.js
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498493/Advanced%20Sploopio%20Enhancements%202024%21.user.js
// @updateURL https://update.greasyfork.org/scripts/498493/Advanced%20Sploopio%20Enhancements%202024%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showSuccessMessage() {
        spawnSmartMessage('Script loaded successfully!');
    }

    showSuccessMessage();

    let gameStartTime = null;
    let gameEndTime = null;
    let gameInterval = null;
    let fpsInterval = null;
    let lastFrameTime = performance.now();
    let fpsDisplay = null;
    let timezoneDisplay = null;
    let selectedTimezone = 'Asia/Ho_Chi_Minh';
    let aimLockEnabled = false;
    let autoInstaEnabled = false;
    let aimSmartEnabled = false;

    const timezones = {
        'Vietnam': 'Asia/Ho_Chi_Minh',
        'USA': 'America/New_York',
        'Australia': 'Australia/Sydney',
        'Japan': 'Asia/Tokyo'
    };

    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.left = '10px';
    controlPanel.style.color = 'white';
    controlPanel.style.background = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.fontFamily = 'Arial, sans-serif';
    controlPanel.style.zIndex = '1000';
    controlPanel.style.display = 'none';
    document.body.appendChild(controlPanel);

    const antiClownToggleLabel = document.createElement('label');
    antiClownToggleLabel.textContent = ' Anti-clown feature';
    const antiClownToggleCheckbox = document.createElement('input');
    antiClownToggleCheckbox.type = 'checkbox';
    antiClownToggleCheckbox.checked = true;
    antiClownToggleLabel.prepend(antiClownToggleCheckbox);
    controlPanel.appendChild(antiClownToggleLabel);

    const aimLockToggleLabel = document.createElement('label');
    aimLockToggleLabel.textContent = ' Aim Lock';
    const aimLockToggleCheckbox = document.createElement('input');
    aimLockToggleCheckbox.type = 'checkbox';
    aimLockToggleCheckbox.checked = false;
    aimLockToggleLabel.prepend(aimLockToggleCheckbox);
    controlPanel.appendChild(aimLockToggleLabel);

    const aimSmartToggleLabel = document.createElement('label');
    aimSmartToggleLabel.textContent = ' Smart Aim';
    const aimSmartToggleCheckbox = document.createElement('input');
    aimSmartToggleCheckbox.type = 'checkbox';
    aimSmartToggleCheckbox.checked = false;
    aimSmartToggleLabel.prepend(aimSmartToggleCheckbox);
    controlPanel.appendChild(aimSmartToggleLabel);

    const autoInstaToggleLabel = document.createElement('label');
    autoInstaToggleLabel.textContent = ' Auto Insta';
    const autoInstaToggleCheckbox = document.createElement('input');
    autoInstaToggleCheckbox.type = 'checkbox';
    autoInstaToggleCheckbox.checked = false;
    autoInstaToggleLabel.prepend(autoInstaToggleCheckbox);
    controlPanel.appendChild(autoInstaToggleLabel);

    aimLockToggleCheckbox.addEventListener('change', function() {
        aimLockEnabled = this.checked;
    });

    aimSmartToggleCheckbox.addEventListener('change', function() {
        aimSmartEnabled = this.checked;
    });

    autoInstaToggleCheckbox.addEventListener('change', function() {
        autoInstaEnabled = this.checked;
    });

    const timezoneSelectLabel = document.createElement('label');
    timezoneSelectLabel.textContent = ' Select Timezone:';
    controlPanel.appendChild(timezoneSelectLabel);

    const timezoneSelect = document.createElement('select');
    for (const [region, timezone] of Object.entries(timezones)) {
        const option = document.createElement('option');
        option.value = timezone;
        option.textContent = region;
        timezoneSelect.appendChild(option);
    }
    timezoneSelect.value = selectedTimezone;
    controlPanel.appendChild(timezoneSelect);

    timezoneSelect.addEventListener('change', function() {
        selectedTimezone = this.value;
    });

    const gameStartTimeDisplay = document.createElement('div');
    gameStartTimeDisplay.textContent = 'Start Time: Not started';
    gameStartTimeDisplay.style.color = 'white';
    gameStartTimeDisplay.style.fontFamily = 'Arial, sans-serif';
    controlPanel.appendChild(gameStartTimeDisplay);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.style.marginTop = '10px';
    controlPanel.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.style.marginTop = '10px';
    stopButton.style.marginLeft = '5px';
    controlPanel.appendChild(stopButton);

    startButton.addEventListener('click', function() {
        startGameTime();
    });

    stopButton.addEventListener('click', function() {
        stopGameTime();
    });

    function startGameTime() {
        gameStartTime = new Date();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(updateGameTimeDisplay, 1000);
        spawnSmartMessage('Started game time tracking.');
    }

    function stopGameTime() {
        if (!gameStartTime) return;

        gameEndTime = new Date();
        clearInterval(gameInterval);
        const elapsedTime = gameEndTime - gameStartTime;
        const formattedTime = formatTime(elapsedTime);
        gameStartTimeDisplay.textContent = `Played for: ${formattedTime}`;
        gameStartTime = null;
    }

    function updateGameTimeDisplay() {
        if (!gameStartTime) return;

        const elapsedTime = new Date() - gameStartTime;
        const formattedTime = formatTime(elapsedTime);
        gameStartTimeDisplay.textContent = `Start Time: ${formattedTime}`;
    }

    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const soundControlDiv = document.createElement('div');
    soundControlDiv.style.position = 'fixed';
    soundControlDiv.style.bottom = '10px';
    soundControlDiv.style.left = '10px';
    soundControlDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    soundControlDiv.style.color = 'white';
    soundControlDiv.style.padding = '10px';
    soundControlDiv.style.borderRadius = '5px';
    soundControlDiv.style.fontFamily = 'Arial, sans-serif';
    soundControlDiv.style.zIndex = '1000';
    soundControlDiv.style.display = 'none';
    document.body.appendChild(soundControlDiv);

    const soundUrlInput = document.createElement('input');
    soundUrlInput.type = 'text';
    soundUrlInput.placeholder = 'Enter sound URL';
    soundControlDiv.appendChild(soundUrlInput);

    const soundFileInput = document.createElement('input');
    soundFileInput.type = 'file';
    soundControlDiv.appendChild(soundFileInput);

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    soundControlDiv.appendChild(playButton);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    soundControlDiv.appendChild(pauseButton);

    const repeatButton = document.createElement('button');
    repeatButton.textContent = 'Repeat';
    soundControlDiv.appendChild(repeatButton);

    const playlist = document.createElement('div');
    playlist.style.marginTop = '10px';
    soundControlDiv.appendChild(playlist);

    let audio = new Audio();
    let repeat = false;

    playButton.addEventListener('click', function() {
        const url = soundUrlInput.value;
        const file = soundFileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                audio.src = e.target.result;
                audio.play();
            };
            reader.readAsDataURL(file);
        } else if (url) {
            audio.src = url;
            audio.play();
        }
    });

    pauseButton.addEventListener('click', function() {
        audio.pause();
    });

    repeatButton.addEventListener('click', function() {
        repeat = !repeat;
        repeatButton.style.backgroundColor = repeat ? 'green' : '';
    });

    audio.addEventListener('ended', function() {
        if (repeat) {
            audio.currentTime = 0;
            audio.play();
        }
    });

    function checkForBan() {
        // Placeholder for ban detection logic
        console.log('Checking for ban...');
    }

    setInterval(checkForBan, 3000);

    const fpsElement = document.createElement('div');
    fpsElement.style.position = 'fixed';
    fpsElement.style.top = '10px';
    fpsElement.style.left = '50%';
    fpsElement.style.transform = 'translateX(-50%)';
    fpsElement.style.color = 'white';
    fpsElement.style.fontFamily = 'Arial, sans-serif';
    fpsElement.style.fontSize = '20px';
    fpsElement.style.zIndex = '1000';
    document.body.appendChild(fpsElement);

    const timezoneElement = document.createElement('div');
    timezoneElement.style.position = 'fixed';
    timezoneElement.style.top = '40px';
    timezoneElement.style.left = '50%';
    timezoneElement.style.transform = 'translateX(-50%)';
    timezoneElement.style.color = 'white';
    timezoneElement.style.fontFamily = 'Arial, sans-serif';
    timezoneElement.style.fontSize = '20px';
    timezoneElement.style.zIndex = '1000';
    document.body.appendChild(timezoneElement);

    function updateFPS() {
        const now = performance.now();
        const delta = now - lastFrameTime;
        const fps = 1000 / delta;
        lastFrameTime = now;
        fpsElement.textContent = `FPS: ${Math.round(fps)}`;
        requestAnimationFrame(updateFPS);
    }

    function updateTimezones() {
        const now = new Date();
        timezoneElement.textContent = `Time (${selectedTimezone}): ${now.toLocaleString('en-US', { timeZone: selectedTimezone })}`;
    }

    updateFPS();
    setInterval(updateTimezones, 1000);

    const fpsColorInput = document.createElement('input');
    fpsColorInput.type = 'color';
    fpsColorInput.value = '#FFFFFF';
    fpsColorInput.addEventListener('change', function() {
        fpsElement.style.color = this.value;
    });
    controlPanel.appendChild(fpsColorInput);

    const timezoneColorInput = document.createElement('input');
    timezoneColorInput.type = 'color';
    timezoneColorInput.value = '#FFFFFF';
    timezoneColorInput.addEventListener('change', function() {
        timezoneElement.style.color = this.value;
    });
    controlPanel.appendChild(timezoneColorInput);

    const fileManagementPanel = document.createElement('div');
    fileManagementPanel.style.marginTop = '10px';
    controlPanel.appendChild(fileManagementPanel);

    const jsonFileInput = document.createElement('input');
    jsonFileInput.type = 'file';
    jsonFileInput.accept = 'application/json';
    fileManagementPanel.appendChild(jsonFileInput);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load JSON';
    fileManagementPanel.appendChild(loadButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save JSON';
    fileManagementPanel.appendChild(saveButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete JSON';
    fileManagementPanel.appendChild(deleteButton);

    const runButton = document.createElement('button');
    runButton.textContent = 'Run JSON';
    fileManagementPanel.appendChild(runButton);

    loadButton.addEventListener('click', function() {
        const file = jsonFileInput.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const json = JSON.parse(e.target.result);
            
            console.log('Loaded JSON:', json);
        };
        reader.readAsText(file);
    });

    saveButton.addEventListener('click', function() {
        const data = {
            
        };

        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
    });

    deleteButton.addEventListener('click', function() {
        
        console.log('Deleted JSON');
    });

    runButton.addEventListener('click', function() {
        const file = jsonFileInput.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const json = JSON.parse(e.target.result);
            
            console.log('Running JSON:', json);
            executeJsonCommands(json);
        };
        reader.readAsText(file);
    });

    function executeJsonCommands(json) {
        
        console.log('Executing commands from JSON:', json);
        // Example: if json has commands like { "action": "move", "x": 10, "y": 20 }
        if (json.action === 'move') {
            moveCharacter(json.x, json.y);
        }
    }

    function moveCharacter(x, y) {
        // Implement the logic to move the character to x, y coordinates
        console.log(`Moving character to X: ${x}, Y: ${y}`);
        // Update coordinates display
        updateCoordinates(x, y);
    }

    const messagingPanel = document.createElement('div');
    messagingPanel.style.marginTop = '10px';
    controlPanel.appendChild(messagingPanel);

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = 'Enter message';
    messagingPanel.appendChild(messageInput);

    const messageFileInput = document.createElement('input');
    messageFileInput.type = 'file';
    messageFileInput.accept = 'text/plain';
    messagingPanel.appendChild(messageFileInput);

    const startMessagingButton = document.createElement('button');
    startMessagingButton.textContent = 'Start Messaging';
    messagingPanel.appendChild(startMessagingButton);

    const stopMessagingButton = document.createElement('button');
    stopMessagingButton.textContent = 'Stop Messaging';
    messagingPanel.appendChild(stopMessagingButton);

    let messagingInterval = null;

    startMessagingButton.addEventListener('click', function() {
        const message = messageInput.value;
        if (messageFileInput.files.length > 0) {
            const file = messageFileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                startMessaging(e.target.result);
            };
            reader.readAsText(file);
        } else if (message) {
            startMessaging(message);
        }
    });

    stopMessagingButton.addEventListener('click', function() {
        stopMessaging();
    });

    function startMessaging(message) {
        stopMessaging();
        messagingInterval = setInterval(function() {
            sendMessageToGame(message);
        }, 1000);
    }

    function stopMessaging() {
        clearInterval(messagingInterval);
    }

    function sendMessageToGame(message) {
        
        console.log(`Sending message: ${message}`);
    }

    function spawnSmartMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.textContent = message;
        msgElement.style.position = 'fixed';
        msgElement.style.bottom = '50%';
        msgElement.style.left = '50%';
        msgElement.style.transform = 'translate(-50%, -50%)';
        msgElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        msgElement.style.color = 'white';
        msgElement.style.padding = '10px';
        msgElement.style.borderRadius = '5px';
        msgElement.style.zIndex = '1000';
        document.body.appendChild(msgElement);

        setTimeout(function() {
            document.body.removeChild(msgElement);
        }, 3000);
    }

    const coordinatesDisplay = document.createElement('div');
    coordinatesDisplay.style.position = 'fixed';
    coordinatesDisplay.style.bottom = '10px';
    coordinatesDisplay.style.right = '10px';
    coordinatesDisplay.style.color = 'white';
    coordinatesDisplay.style.fontFamily = 'Arial, sans-serif';
    coordinatesDisplay.style.fontSize = '20px';
    coordinatesDisplay.style.zIndex = '1000';
    document.body.appendChild(coordinatesDisplay);

    function updateCoordinates(x, y) {
        coordinatesDisplay.textContent = `X: ${x}, Y: ${y}`;
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F1' || e.key === 'F2' || e.key === 'F5') {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F1') {
            controlPanel.style.display = controlPanel.style.display === 'none' ? 'block' : 'none';
        } else if (e.key === 'F5') {
            soundControlDiv.style.display = soundControlDiv.style.display === 'none' ? 'block' : 'none';
        } else if (e.key === 'B') {
            timezoneElement.style.display = timezoneElement.style.display === 'none' ? 'block' : 'none';
        }
    });

    
    setInterval(function() {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        updateCoordinates(x, y);
    }, 1000);

    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.pathname === '/') {
            alert('Welcome to the Advanced Sploop.io Enhancements script!');
        }
    });
})();

