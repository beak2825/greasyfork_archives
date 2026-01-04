// ==UserScript==
// @name         Cosmo V2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cosmo V2 ESP
// @author       Frost
// @match        https://bloxflip.com/*
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/504186/Cosmo%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/504186/Cosmo%20V2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoMinesActive = false;
    let bombminesKey = 'b';
    let minesKey = 'm';
    let isAdmin = false;
    let adminKey = 'admin';
    let loggedIn = false;

    let predictionResult = [];

    GM_addStyle(`
        /* Add global styles here */

        /* Make the background darker */
        body {
            background-color: #000;
        }

        /* Add a glow effect to the title */
        .glow {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
        }

        /* Style the login panel */
        #loginPanel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1002;
            background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://your-image-url.com'); /* Replace with your background image URL */
            background-size: cover;
        }

        /* Style the login form */
        .login-form {
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
            text-align: center;
            position: relative;
        }

        /* Style the login title */
        .login-title {
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
        }

        /* Style the login input */
        .login-input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 2px solid #800080;
            border-radius: 10px;
            background-color: #333;
            color: #fff;
            font-size: 16px;
            outline: none;
        }

        /* Style the login button */
        .login-button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        /* Style the main UI panel */
        #bloxflipESP {
            position: fixed;
            top: 70px;
            left: 20px; /* Adjust the left position for a more vertical layout */
            background-color: #000;
            border: none;
            z-index: 999;
            color: #fff;
            width: 500px;
            max-width: 200px; /* Set a maximum width to limit stretching */
            height: 350px; /* Allow vertical expansion */
            display: flex;
            flex-direction: column; /* Change to vertical layout */
            align-items: center; /* Center items vertically */
            justify-content: flex-start; /* Align items to the top */
            box-shadow: 0 5px 30px rgb(160 0 249);
            background: linear-gradient(rgb(101 5 230 / 80%), rgba(0,0,0,0.8)), url(https://your-image-url.com);+
    border-radius: 10px;
        }

        /* Style the futuristic buttons */
        .futuristic-button {
            width: 150px;
            background-color: transparent;
            color: #fff;
            border: 2px solid #c51bff; /* Set the border color to a futuristic color */
            border-radius: 10px;
            font-size: 18px;
            margin: 5px;
            padding: 10px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        .futuristic-button:hover {
            background-color: #900dff; /* Change this to your desired hover color */
            color: #fff;
            border-color: 2px solid #b40aee; /* Change border color on hover */
        }
    `);

    function createLoginUI() {
        const loginHTML = `
            <div id="loginPanel" class="light-mode">
                <div class="login-form">
                    <h2 class="login-title">Login</h2>
                    <input type="text" class="login-input" id="uid-input" placeholder="Enter your key">
                    <button type="submit" class="login-button" id="login-button">Login</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', loginHTML);

        const loginButton = document.getElementById('login-button');

        loginButton.addEventListener('click', function () {
            const uid = document.getElementById('uid-input').value;

            // Replace 'cosmo-4983135698' with your allowed UIDs
            const allowedUIDs = [
                'cosmo-4983135698',
                'tester',
                'spacepredictor1',
                'TRIAL-1',
            ];

            if (allowedUIDs.includes(uid)) {
                loggedIn = true;
                document.getElementById('loginPanel').remove();
                createGUI();
            } else {
                showAlert('Invalid UID. Please try again.');
            }
        });
    }

    function createGUI() {
        if (!loggedIn) {
            createLoginUI();
            return;
        }

        const guiHTML = `
            <div id="bloxflipESP" class="light-mode">
                <button id="bombminesButton" class="futuristic-button">QuaMines</button>
                <button id="minesButton" class="futuristic-button">FrostMines</button>
                <button id="algorithm2MethodButton" class="futuristic-button"></button>
                <button id="unriggerButton" class="futuristic-button">Unrig</button>
                <button id="bombminesButton" class="futuristic-button">Luck+++</button>
                <button id="algorithm2MethodButton" class="futuristic-button">Activate ESP</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', guiHTML);

        const draggableElement = document.getElementById('bloxflipESP');
        makeDraggable(draggableElement);

        document.getElementById('minesButton').addEventListener('click', function () {
            clearPrediction();
            predictMines(3, '#00A36C');
        });

        document.getElementById('bombminesButton').addEventListener('click', function () {
            clearPrediction();
            predictMines(12, '#FF0000');
        });

        document.getElementById('unriggerButton').addEventListener('click', function () {
            const serverHash = prompt("Please enter your server hash:");
            if (serverHash !== null && serverHash !== '') {
                showNotification(`Server hash submitted: ${serverHash}`, 'Server Hash');
            }
        });

        document.getElementById('algorithm2MethodButton').addEventListener('click', function () {
            showNotification('ESP  is activated. [made by Frost] ', 'Algorithm');
        });
    }

    function predictMines(maxSpots, color) {
        // Generate and display new prediction
        predictionResult = [];

        for (let i = 0; i < maxSpots; i++) {
            predictionResult.push({
                index: Math.floor(Math.random() * 25),
                isGreen: color === '#00A36C',
                isRed: color === '#FF0000',
            });
        }

        predictionResult.forEach((result) => {
            const targetButton = document.querySelector(`div.mines_minesGameContainer__Ih15s > button:nth-child(${result.index + 1})`);

            if (targetButton) {
                if (result.isGreen) {
                    targetButton.style.border = "5px solid #FFFFFF";
                    targetButton.style.filter = "brightness(150%)";
                }
                if (result.isRed) {
                    targetButton.style.border = "5px solid #FF0000";
                    targetButton.style.filter = "brightness(150%)";
                }
            }
        });
    }

    function clearPrediction() {
        const buttons = document.querySelectorAll("button[style*=\"border-color\"]");

        buttons.forEach((button) => {
            button.style.border = "2px solid #fff";
            button.style.filter = "brightness(100%)";
        });
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + '-header')) {
            document.getElementById(element.id + '-header').onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function showAlert(message) {
        showNotification(message, 'Alert');
    }

    function showNotification(message, title) {
        GM_notification({
            text: message,
            title: title,
            timeout: 5000,
            image: 'https://i.imgur.com/mTrrb6f.png',
            onclick: () => {
                console.log(message);
            },
        });
    }

    createGUI();
})();