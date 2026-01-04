// ==UserScript==
// @name         Auto Correct Answers - Standard
// @namespace    http://greasyfork.org/
// @version      1.16
// @description  Automatically select correct answers on Blooket when the wrong answer is chosen, toggle GUI with 'Q' key. Premium package includes Chest ESP
// @author       john1632
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @icon         https://cdn.discordapp.com/attachments/1067759266313797672/1136272264334151780/jhb3D4f5cKy61xX1P9PJVyVxVbGeAAAAAElFTkSuQmCC.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475555/Auto%20Correct%20Answers%20-%20Standard.user.js
// @updateURL https://update.greasyfork.org/scripts/475555/Auto%20Correct%20Answers%20-%20Standard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isEnabled = true;
    let isGuiVisible = true;

    function toggleAutoCorrect() {
        isEnabled = !isEnabled;
        updateToggleButton();
    }

    function toggleEsp() {
        // not included in standard package
    }

    function toggleGUIVisibility() {
        isGuiVisible = !isGuiVisible;
        updateButtonVisibility();
    }

    function updateToggleButton() {
        const button = document.getElementById('toggleAutoCorrectButton');
        button.textContent = isEnabled ? 'Auto Correct: ON' : 'Auto Correct: OFF';
    }

    function updateEspButton() {
        const button = document.getElementById('toggleEspButton');
        button.textContent = isEspEnabled ? 'ESP: ON' : 'ESP: OFF';
    }

    function updateButtonVisibility() {
        const autoCorrectButton = document.getElementById('toggleAutoCorrectButton');
        autoCorrectButton.style.display = isGuiVisible ? 'block' : 'none';
    }

    function executeScript() {
        if (isEnabled) {
            const { state: o, props: t } = Object.values(document.querySelector('body div[class*="camelCase"]'))[1].children[0]._owner["stateNode"];
            const answerContainers = document.querySelectorAll('[class*="answerContainer"]');

            answerContainers.forEach((container, index) => {
                container.addEventListener('click', () => {
                    if (!(o.question || t.client.question).correctAnswers.includes((o.question || t.client.question).answers[index])) {
                        for (let i = 0; i < (o.question || t.client.question).answers.length; i++) {
                            if ((o.question || t.client.question).correctAnswers.includes((o.question || t.client.question).answers[i])) {
                                answerContainers[i].click();
                                break;
                            }
                        }
                    }
                });
            });
        }

        // Chest ESP
        // RED X = Lose gold
        // GREEN TICK = Swap
        // YELLOW TICK = Double or triple gold

        // NOT INCLUDED IN STANDARD PACKAGE
    }

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleAutoCorrectButton';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.textContent = 'Auto Correct: ON';
    toggleButton.addEventListener('click', toggleAutoCorrect);
    document.body.appendChild(toggleButton);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'q' || event.key === 'Q') {
            toggleGUIVisibility();
        }
    });

    setInterval(executeScript, 100);
})();