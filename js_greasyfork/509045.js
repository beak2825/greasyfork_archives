// ==UserScript==
// @name         Cookie Clicker Mod Menu
// @namespace    https://orteil.dashnet.org/cookieclicker/
// @version      1.3Beta
// @description  Mod menu for Cookie Clicker.
// @author       DarkDeath
// @match        https://orteil.dashnet.org/cookieclicker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509045/Cookie%20Clicker%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/509045/Cookie%20Clicker%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    let clickInterval;
    const style = document.createElement('style');
    style.textContent = `
        #cookie-clicker-menu {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 1000000;
            font-family: Arial, sans-serif;
            width: 200px;
        }
        #cookie-clicker-menu h3 {
            margin: 0;
            padding-bottom: 10px;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid #ccc;
            margin-bottom: 10px;
        }
        #cookie-clicker-menu button {
            display: block;
            width: 100%;
            margin-bottom: 5px;
            padding: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #cookie-clicker-menu button:hover {
            background-color: #0056b3;
        }
        #ruin-the-fun {
            background-color: #dc3545 !important;
        }
        #ruin-the-fun:hover {
            background-color: #c82333 !important;
        }
        .custom-window {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 1000001;
            font-family: Arial, sans-serif;
            width: 300px;
            text-align: center;
        }
        .custom-window input {
            width: 100%;
            padding: 5px;
            margin: 10px 0;
            box-sizing: border-box;
        }
        .custom-window button {
            margin: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .custom-window button:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'cookie-clicker-menu';
    menu.innerHTML = `
        <h3>Cookie Clicker Mod Menu</h3>
        <button id="start-auto-click">Start Auto Click</button>
        <button id="stop-auto-click">Stop Auto Click</button>
        <button id="gain-lumps">Gain Lumps</button>
        <button id="buy-times">Buy All</button>
        <button id="set-cookies">Set Cookies</button>
        <button id="ruin-the-fun">Ruin The Fun</button>
    `;
    document.body.appendChild(menu);

    // Make the menu draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    menu.querySelector('h3').addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, menu);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Custom input window function
    function createInputWindow(title, placeholder, callback) {
        const inputWindow = document.createElement('div');
        inputWindow.className = 'custom-window';
        inputWindow.innerHTML = `
            <h3>${title}</h3>
            <input type="text" placeholder="${placeholder}">
            <button class="confirm">Confirm</button>
            <button class="cancel">Cancel</button>
        `;
        document.body.appendChild(inputWindow);

        const input = inputWindow.querySelector('input');
        const confirmBtn = inputWindow.querySelector('.confirm');
        const cancelBtn = inputWindow.querySelector('.cancel');

        confirmBtn.addEventListener('click', () => {
            const value = input.value;
            document.body.removeChild(inputWindow);
            callback(value);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(inputWindow);
        });
    }

    // Custom alert window function
    function createAlertWindow(message) {
        const alertWindow = document.createElement('div');
        alertWindow.className = 'custom-window';
        alertWindow.innerHTML = `
            <p>${message}</p>
            <button class="ok">OK</button>
        `;
        document.body.appendChild(alertWindow);

        const okBtn = alertWindow.querySelector('.ok');
        okBtn.addEventListener('click', () => {
            document.body.removeChild(alertWindow);
        });
    }

    // Auto-click functionality
    function autoClickCookie(interval) {
        if (typeof interval !== 'number' || interval <= 0) {
            console.error("Please provide a valid interval in milliseconds.");
            return;
        }
        if (!clickInterval) {
            clickInterval = setInterval(() => {
                Game.ClickCookie();
            }, interval);
        } else {
            createAlertWindow("Auto clicker is already running.");
        }
    }

    function stopAutoClickCookie() {
        if (clickInterval) {
            clearInterval(clickInterval);
            clickInterval = null;
            console.log("Auto clicker stopped.");
        } else {
            console.warn("Auto clicker is not currently running.");
        }
    }

    // Gain lumps functionality
    function getLumps() {
        createInputWindow("Gain Lumps", "Enter number of lumps", (lumps) => {
            if (lumps && !isNaN(Number(lumps))) {
                Game.gainLumps(Number(lumps));
                createAlertWindow(`Gained ${lumps} lumps`);
            } else {
                createAlertWindow("Please enter a valid number.");
            }
        });
    }

    // Ruin The Fun functionality
    function ruinTheFun() {
        if (confirm("Are you sure you want to ruin the fun? This action cannot be undone!")) {
            Game.RuinTheFun(1);
            createAlertWindow("The fun has been ruined!");
        }
    }

    function buyAll() {
        Game.storeBuyAll();
        createInputWindow("Buy All", "How much do you want to buy?", (times) => {
            if (times && !isNaN(Number(times))) {
                for (let i in Game.Objects) {
                    Game.Objects[i].getFree(Number(times));
                }
                createAlertWindow(`Bought all objects ${times} times.`);
            } else {
                createAlertWindow("Please enter a valid number.");
            }
        });
    }

    function setCookies() {
        createInputWindow("Set Cookies", "Enter number of cookies", (cookies) => {
            if (cookies && !isNaN(Number(cookies))) {
                Game.cookies = Number(cookies);
                createAlertWindow(`Successfully set your cookies to ${cookies}`);
            } else {
                createAlertWindow("Please enter a valid number.");
            }
        });
    }

    // Event listeners for buttons
    document.getElementById('start-auto-click').addEventListener('click', () => autoClickCookie(10));
    document.getElementById('stop-auto-click').addEventListener('click', stopAutoClickCookie);
    document.getElementById('gain-lumps').addEventListener('click', getLumps);
    document.getElementById('buy-times').addEventListener('click', buyAll);
    document.getElementById('ruin-the-fun').addEventListener('click', ruinTheFun);
    document.getElementById('set-cookies').addEventListener('click', setCookies);
    console.log("Cookie Clicker mod menu added. Drag the title to move the menu.");
})();