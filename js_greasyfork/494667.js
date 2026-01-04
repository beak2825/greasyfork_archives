// ==UserScript==
// @name         Verify kour.io made by Snomy
// @namespace    Snomy
// @version      0.1
// @description  Verify script made by Snomy
// @author       Snomy
// @license CC BY-ND 4.0
// @match        https://kour.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494667/Verify%20kourio%20made%20by%20Snomy.user.js
// @updateURL https://update.greasyfork.org/scripts/494667/Verify%20kourio%20made%20by%20Snomy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Einblenden des Popups
    function showPopup() {
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div id="popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 2px solid black; border-radius: 10px; z-index: 10000;">
                <p>Please join the Discord to use this script</p>
                <button id="discordButton" style="display: block; width: 100px; margin: 0 auto; padding: 10px; background-color: blue; color: white; text-decoration: none; border-radius: 5px;">OK</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Funktion zum Entfernen des Popups nach dem Klick auf OK und Öffnen eines neuen Tabs für Discord
        document.getElementById('discordButton').addEventListener('click', function() {
            window.open('https://discord.gg/fGmYbhZAnN', '_blank');
            document.getElementById('popup').remove();
        });
    }

    // Pop-up nach dem Laden der Seite einblenden
    window.addEventListener('load', function() {
        showPopup();
    });

    var style = `
        <style>
            #snomyMenu {
                position: absolute;
                top: 0;
                left: 0;
                width: 5cm;
                height: 1cm;
                background-image: url('https://i.imgur.com/iqq5Voh.png'); /* Link zum Bild */
                background-size: cover;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
                border-bottom: 1px solid black;
            }

            #dividerLine {
                width: 100%;
                height: 1px;
                background-color: black;
                margin: 5px 0;
            }

            .toggleButton {
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
            }

            #toggleOn {
                background-color: green;
            }

            #toggleOff {
                background-color: red;
                display: none;
            }

            #settingsMenu {
                position: absolute;
                top: calc(1cm + 1px + 1cm);
                left: 0;
                width: 5cm;
                background-image: url('https://i.imgur.com/d7GhsKj.png'); /* Link zum Bild */
                background-size: cover;
                border: 1px solid black;
                z-index: 9999;
                display: none;
                padding: 10px;
            }

            .menuHeader {
                padding-bottom: 5px;
                font-weight: bold;
                font-size: 18px; /* Größere Schrift */
            }

            .menuItem {
                padding-bottom: 10px;
            }
        </style>
    `;

    var menuHTML = `
        <div id="snomyMenu">
            <span style="margin-right: 10px; font-size: 20px; font-weight: bold;">Snomy Menu</span> <!-- Größere und fettere Schrift -->
            <button id="toggleOn" class="toggleButton">An</button>
            <button id="toggleOff" class="toggleButton" style="display: none;">Aus</button>
        </div>
        <div id="dividerLine"></div>
        <div id="settingsMenu">
            <div class="menuHeader">Menu Settings</div>
            <div class="menuItem">
                Verify User
                <button id="verifyUserOn" class="toggleButton" style="display: inline-block; background-color: green;">An</button>
                <button id="verifyUserOff" class="toggleButton" style="display: none; background-color: red;">Aus</button>
            </div>
        </div>
    `;

    document.head.insertAdjacentHTML('beforeend', style);
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const snomyMenu = document.getElementById('snomyMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    let isDragging = false;
    let offsetX, offsetY;

    snomyMenu.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - snomyMenu.getBoundingClientRect().left;
        offsetY = e.clientY - snomyMenu.getBoundingClientRect().top;
    }

    function drag(e) {
        if (isDragging) {
            snomyMenu.style.left = e.clientX - offsetX + 'px';
            snomyMenu.style.top = e.clientY - offsetY + 'px';
            settingsMenu.style.left = snomyMenu.style.left;
            settingsMenu.style.top = e.clientY - offsetY + snomyMenu.offsetHeight + 'px';
        }
    }

    function endDrag() {
        isDragging = false;
    }

    const toggleOnButton = document.getElementById('toggleOn');
    const toggleOffButton = document.getElementById('toggleOff');
    const verifyUserOnButton = document.getElementById('verifyUserOn');
    const verifyUserOffButton = document.getElementById('verifyUserOff');

    toggleOnButton.addEventListener('click', () => {
        toggleOnButton.style.display = 'none';
        toggleOffButton.style.display = 'inline-block';
        toggleOffButton.style.backgroundColor = 'red';
        settingsMenu.style.display = 'block';
    });

    toggleOffButton.addEventListener('click', () => {
        toggleOffButton.style.display = 'none';
        toggleOnButton.style.display = 'inline-block';
        toggleOnButton.style.backgroundColor = 'green';
        settingsMenu.style.display = 'none';
    });

    verifyUserOnButton.addEventListener('click', () => {
        verifyUserOnButton.style.display = 'none';
        verifyUserOffButton.style.display = 'inline-block';
        verifyUserOnButton.style.backgroundColor = 'red';

        // Befehl, den du ausführen möchtest
        var command = `
            firebase.database().goOffline();
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).child('verified').set('1');
            showUserDetails(firebase.auth().currentUser.email, firebase.auth().currentUser);
            firebase.database().goOnline();
        `;

        // Führe den Befehl in der Konsole aus
        setTimeout(function() {
            eval(command);
        }, 2000); // Zeitverzögerung, falls notwendig
    });

    verifyUserOffButton.addEventListener('click', () => {
        verifyUserOffButton.style.display = 'none';
        verifyUserOnButton.style.display = 'inline-block';
        verifyUserOnButton.style.backgroundColor = 'green';
    });
})();
