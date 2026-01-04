// ==UserScript==
// @name         Kirka FPS Counter, FPS Booster, View Touched Keys Mouse/Keyboard, Stretched canvas, IP Catcher
// @namespace    http://tampermonkey.net/
// @version      05124.1
// @description  See IP's of the players (with name and 50%), FPS Counter, FPS Booster, View Keyboard/Mouse touchs etc..
// @author       WHOAMI?
// @match        *://kirka.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506164/Kirka%20FPS%20Counter%2C%20FPS%20Booster%2C%20View%20Touched%20Keys%20MouseKeyboard%2C%20Stretched%20canvas%2C%20IP%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/506164/Kirka%20FPS%20Counter%2C%20FPS%20Booster%2C%20View%20Touched%20Keys%20MouseKeyboard%2C%20Stretched%20canvas%2C%20IP%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const button = document.createElement('button');
    button.innerHTML = 'Menu';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    document.body.appendChild(button);

    // Create the menu
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.bottom = '50px';
    menu.style.right = '10px';
    menu.style.padding = '15px';
    menu.style.backgroundColor = 'black';
    menu.style.color = 'white';
    menu.style.border = '1px solid #fff';
    menu.style.borderRadius = '5px';
    menu.style.display = 'none';
    menu.style.zIndex = '1000';
    menu.style.width = '250px';

    // Create menu options
    const options = [
        { label: 'Esticar Tela', id: 'stretchScreen' },
        { label: 'FPS Booster', id: 'fpsBooster' },
        { label: 'FPS Counter', id: 'fpsCounter' },
        { label: 'Mostrar KeyBoard', id: 'showKeyboard' },
        { label: 'Logar IPs', id: 'logIPs' }
    ];

    options.forEach(option => {
        const container = document.createElement('div');
        container.style.padding = '5px 0';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = option.id;
        checkbox.style.marginRight = '10px';

        const label = document.createElement('label');
        label.htmlFor = option.id;
        label.innerText = option.label;

        container.appendChild(checkbox);
        container.appendChild(label);
        menu.appendChild(container);
    });

    document.body.appendChild(menu);

    // Toggle menu display
    button.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // Function to stretch the screen
    function stretchScreen() {
        document.documentElement.style.width = '100vw';
        document.documentElement.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
    }

    // Function to boost FPS
    function boostFPS() {
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.imageRendering = 'pixelated';
            canvas.width = canvas.width / 2;
            canvas.height = canvas.height / 2;
        });
    }

    // Function to show FPS counter
    function showFPSCounter() {
        const script = document.createElement('script');
        script.innerHTML = `
            (function() {
                let lastFrameTime = performance.now();
                let frameCount = 0;
                let fpsDisplay = document.createElement('div');
                fpsDisplay.style.position = 'fixed';
                fpsDisplay.style.top = '10px';
                fpsDisplay.style.right = '10px';
                fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                fpsDisplay.style.color = 'white';
                fpsDisplay.style.padding = '5px';
                fpsDisplay.style.borderRadius = '5px';
                fpsDisplay.style.zIndex = '1000';
                document.body.appendChild(fpsDisplay);

                function updateFPS() {
                    let now = performance.now();
                    frameCount++;
                    if (now >= lastFrameTime + 1000) {
                        fpsDisplay.innerHTML = frameCount + ' FPS';
                        lastFrameTime = now;
                        frameCount = 0;
                    }
                    requestAnimationFrame(updateFPS);
                }
                updateFPS();
            })();
        `;
        document.body.appendChild(script);
    }

    // Function to show keyboard and mouse activity
    function showKeyboard() {
        const keyDisplay = document.createElement('div');
        keyDisplay.style.position = 'fixed';
        keyDisplay.style.bottom = '10px';
        keyDisplay.style.left = '10px';
        keyDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        keyDisplay.style.color = 'white';
        keyDisplay.style.padding = '10px';
        keyDisplay.style.borderRadius = '5px';
        keyDisplay.style.zIndex = '1000';
        keyDisplay.style.width = '300px';
        keyDisplay.style.height = '100px';
        keyDisplay.style.overflowY = 'auto';
        keyDisplay.style.fontFamily = 'monospace';
        document.body.appendChild(keyDisplay);

        const mouseDisplay = document.createElement('div');
        mouseDisplay.style.position = 'fixed';
        mouseDisplay.style.top = '10px';
        mouseDisplay.style.left = '10px';
        mouseDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        mouseDisplay.style.color = 'white';
        mouseDisplay.style.padding = '10px';
        mouseDisplay.style.borderRadius = '5px';
        mouseDisplay.style.zIndex = '1000';
        mouseDisplay.style.width = '150px';
        mouseDisplay.style.fontFamily = 'monospace';
        document.body.appendChild(mouseDisplay);

        document.addEventListener('keydown', (e) => {
            keyDisplay.innerText += `Key: ${e.key} (${e.code})\n`;
            keyDisplay.scrollTop = keyDisplay.scrollHeight;
        });

        document.addEventListener('mousedown', (e) => {
            mouseDisplay.innerText = `Mouse: Button ${e.button} Clicked\n`;
        });
    }

    // Function to log IPs
    function logIPs() {
        const logBox = document.createElement('div');
        logBox.style.position = 'fixed';
        logBox.style.bottom = '50px';
        logBox.style.left = '10px';
        logBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        logBox.style.color = 'white';
        logBox.style.padding = '10px';
        logBox.style.borderRadius = '5px';
        logBox.style.zIndex = '1000';
        logBox.style.width = '300px';
        logBox.style.height = '400px';
        logBox.style.overflowY = 'auto';
        logBox.style.fontFamily = 'monospace';
        document.body.appendChild(logBox);

        const instructions = document.createElement('p');
        instructions.innerText = 'Press "O" to log IPs';
        instructions.style.color = 'green';
        logBox.appendChild(instructions);

        // Function to add IPs to the log
        function addIp(addr) {
            logBox.innerHTML += `<p style="color: white;">Got IP address: ${addr}</p>`;
            logBox.scrollTop = logBox.scrollHeight;
        }

        // Override RTCPeerConnection method to capture IP addresses
        const originalAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
        RTCPeerConnection.prototype.addIceCandidate = function(...args) {
            if (args[0] && args[0].address && !args[0].address.includes(".local")) {
                addIp(args[0].address);
            }
            return originalAddIceCandidate.apply(this, args);
        };

        // Listen for keypress
        document.addEventListener('keydown', (e) => {
            if (e.key === 'O') {
                logBox.style.display = logBox.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Event listeners for the options
    document.getElementById('stretchScreen').addEventListener('change', (e) => {
        if (e.target.checked) {
            stretchScreen();
        } else {
            location.reload();
        }
    });

    document.getElementById('fpsBooster').addEventListener('change', (e) => {
        if (e.target.checked) {
            boostFPS();
        } else {
            location.reload();
        }
    });

    document.getElementById('fpsCounter').addEventListener('change', (e) => {
        if (e.target.checked) {
            showFPSCounter();
        } else {
            location.reload();
        }
    });

    document.getElementById('showKeyboard').addEventListener('change', (e) => {
        if (e.target.checked) {
            showKeyboard();
        } else {
            location.reload();
        }
    });

    document.getElementById('logIPs').addEventListener('change', (e) => {
        if (e.target.checked) {
            logIPs();
        } else {
            location.reload();
        }
    });

})();
