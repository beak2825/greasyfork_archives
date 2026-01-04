// ==UserScript==
// @name         what
// @namespace    http://tampermonkey.net/
// @version      1.17
// @license      MIT
// @description  times ur bat intervals.
// @author       YourName
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510771/what.user.js
// @updateURL https://update.greasyfork.org/scripts/510771/what.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForCanvas() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            initializeButtons();
        } else {
            setTimeout(waitForCanvas, 100);
        }
    }

    function initializeButtons() {
        const editorButton = document.querySelector('.editorButton.settingsButton');
        const editorButtonStyles = window.getComputedStyle(editorButton);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = "Toggle Bat Time List";
        toggleButton.style.cssText = `
            position: absolute;
            left: 10px;
            top: 5%;
            transform: translateY(-50%);
            background-color: ${editorButtonStyles.backgroundColor};
            color: ${editorButtonStyles.color};
            border: ${editorButtonStyles.border};
            border-radius: ${editorButtonStyles.borderRadius};
            padding: 15px;
            font-family: ${editorButtonStyles.fontFamily};
            cursor: pointer;
            z-index: 99999;
            height: 50px;
            pointer-events: auto;
        `;

        document.body.appendChild(toggleButton);

        const listContainer = document.createElement('div');
        listContainer.className = 'batTimeListContainer';
        listContainer.style.backgroundColor = '#25262a';
        listContainer.style.width = '300px';
        listContainer.style.height = 'auto';
        listContainer.style.borderRadius = '7px';
        listContainer.style.padding = '10px';
        listContainer.style.display = 'none';
        listContainer.style.position = 'absolute';
        listContainer.style.left = '20%';
        listContainer.style.top = '50%';
        listContainer.style.transform = 'translateY(-50%)';
        listContainer.style.zIndex = '10000';
        document.body.appendChild(listContainer);

        const keyBindingDiv = document.createElement('div');
        keyBindingDiv.style.marginTop = '10px';
        keyBindingDiv.innerHTML = '<strong>Star Key Binding:</strong> <span id="starKey">S</span>';
        listContainer.appendChild(keyBindingDiv);

        const batKeyBindingDiv = document.createElement('div');
        batKeyBindingDiv.style.marginTop = '10px';
        batKeyBindingDiv.innerHTML = '<strong>Bat Key Binding:</strong> <span id="batKey">C</span>';
        listContainer.appendChild(batKeyBindingDiv);

        const normalTab = document.createElement('button');
        normalTab.textContent = "Normal";
        normalTab.style.cssText = `
           text-align: center;
           vertical-align: middle;
           padding-left: 10px;
           font-family: 'Bai Jamjuree', sans-serif;
           padding-right: 10px;
           line-height: 30px;
           font-size: 15px;
           border: none;
           cursor: pointer;
           background-color: #4a7ab1;
           color: #ebebeb;
           border-radius: 2px;
           top: 81%;
        `;
        listContainer.appendChild(normalTab);

        const starredTab = document.createElement('button');
        starredTab.textContent = "Starred";
        starredTab.style.cssText = `
           text-align: center;
           margin: 5px;
           vertical-align: middle;
           padding-left: 10px;
           font-family: 'Bai Jamjuree', sans-serif;
           padding-right: 10px;
           line-height: 30px;
           font-size: 15px;
           border: none;
           cursor: pointer;
           background-color: #4a7ab1;
           color: #ebebeb;
           border-radius: 2px;
           top: 81%;
        `;
        listContainer.appendChild(starredTab);

        const batTimesDiv = document.createElement('div');
        batTimesDiv.style.padding = '10px';
        batTimesDiv.style.maxHeight = '200px';
        batTimesDiv.style.overflowY = 'auto';
        batTimesDiv.style.backgroundColor = '#343a40';
        batTimesDiv.style.borderRadius = '5px';
        listContainer.appendChild(batTimesDiv);

        const starredDiv = document.createElement('div');
        starredDiv.style.padding = '10px';
        starredDiv.style.maxHeight = '200px';
        starredDiv.style.overflowY = 'auto';
        starredDiv.style.backgroundColor = '#343a40';
        starredDiv.style.borderRadius = '5px';
        starredDiv.style.display = 'none';
        listContainer.appendChild(starredDiv);

        let batTimes = JSON.parse(localStorage.getItem('batTimes')) || [];
        let starredTimes = JSON.parse(localStorage.getItem('starredTimes')) || [];

        let batStartTime = null;
        let starKey = localStorage.getItem('starKey') || 'S';
        let batKey = localStorage.getItem('batKey') || 'C';

        function saveBatTimes() {
            localStorage.setItem('batTimes', JSON.stringify(batTimes));
        }

        function saveStarredTimes() {
            localStorage.setItem('starredTimes', JSON.stringify(starredTimes));
        }

        function generateTimeList() {
            batTimesDiv.innerHTML = '';
            if (batTimes.length === 0) {
                const noTimes = document.createElement('p');
                noTimes.textContent = "No bat times recorded yet.";
                batTimesDiv.appendChild(noTimes);
            } else {
                const ul = document.createElement('ul');
                batTimes.forEach((time, index) => {
                    const li = document.createElement('li');
                    li.textContent = `#${index + 1}: ${time.milliseconds} ms (${time.seconds} seconds)`;
                    ul.appendChild(li);
                });
                batTimesDiv.appendChild(ul);
            }
        }

        function generateStarredList() {
            starredDiv.innerHTML = '';
            if (starredTimes.length === 0) {
                starredDiv.innerHTML = "<p>No starred bat times yet.</p>";
            } else {
                const ul = document.createElement('ul');
                starredTimes.forEach((time, index) => {
                    const li = document.createElement('li');
                    li.textContent = `Starred #${index + 1}: ${time.milliseconds} ms (${time.seconds} seconds)`;
                    ul.appendChild(li);
                });
                starredDiv.appendChild(ul);
            }
        }

        function isInputFocused() {
            const activeElement = document.activeElement;
            return activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
        }

        document.addEventListener('keydown', (event) => {
            if (!isInputFocused() && event.key.toUpperCase() === batKey.toUpperCase() && !batStartTime) {
                batStartTime = Date.now();
            }
        });

        document.addEventListener('keyup', (event) => {
            if (!isInputFocused() && event.key.toUpperCase() === batKey.toUpperCase() && batStartTime) {
                const batEndTime = Date.now();
                const elapsedTime = batEndTime - batStartTime;
                const seconds = (elapsedTime / 1000).toFixed(2);
                batTimes.push({ milliseconds: elapsedTime, seconds });
                saveBatTimes();
                generateTimeList();
                batStartTime = null;
            }
        });

        toggleButton.addEventListener('click', () => {
            listContainer.style.display = listContainer.style.display === 'none' ? 'block' : 'none';
            generateTimeList();
            generateStarredList();
        });

        normalTab.addEventListener('click', () => {
            batTimesDiv.style.display = 'block';
            starredDiv.style.display = 'none';
        });

        starredTab.addEventListener('click', () => {
            batTimesDiv.style.display = 'none';
            starredDiv.style.display = 'block';
        });

        document.addEventListener('keydown', (event) => {
            if (!isInputFocused() && event.key.toUpperCase() === starKey.toUpperCase() && batStartTime === null) {
                const lastTime = batTimes[batTimes.length - 1];
                if (lastTime) {
                    starredTimes.push(lastTime);
                    saveStarredTimes();
                    generateStarredList();
                }
            }
        });

        function updateKeyBindings() {
            const newStarKey = prompt("Enter a new key for starring times:", starKey);
            if (newStarKey) {
                starKey = newStarKey.toUpperCase();
                document.getElementById('starKey').textContent = starKey;
                localStorage.setItem('starKey', starKey);
            }

            const newBatKey = prompt("Enter a new key for the Bat button:", batKey);
            if (newBatKey) {
                batKey = newBatKey.toUpperCase();
                document.getElementById('batKey').textContent = batKey;
                localStorage.setItem('batKey', batKey);
            }
        }

        document.getElementById('starKey').addEventListener('click', updateKeyBindings);
        document.getElementById('batKey').addEventListener('click', updateKeyBindings);

        updateKeyBindings();
        generateTimeList();
        generateStarredList();
    }

    waitForCanvas();
})();
