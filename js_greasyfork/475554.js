// ==UserScript==
// @name         Auto Correct Answers - Premium
// @namespace    http://greasyfork.org/
// @version      1.22
// @description  Automatically select correct answers on Blooket when the wrong answer is chosen, toggle GUI with 'Q' key. Premium package includes Chest ESP
// @author       john1632
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @icon         https://cdn.discordapp.com/attachments/1067759266313797672/1136272264334151780/jhb3D4f5cKy61xX1P9PJVyVxVbGeAAAAAElFTkSuQmCC.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475554/Auto%20Correct%20Answers%20-%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/475554/Auto%20Correct%20Answers%20-%20Premium.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isEnabled = true;
    let isGuiVisible = true;
    let isEspEnabled = true;

    function toggleAutoCorrect() {
        isEnabled = !isEnabled;
        updateToggleButton();
    }

    function toggleEsp() {
        isEspEnabled = !isEspEnabled;
        updateEspButton();
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
        const espButton = document.getElementById('toggleEspButton');
        autoCorrectButton.style.display = isGuiVisible ? 'block' : 'none';
        espButton.style.display = isGuiVisible ? 'block' : 'none';
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
        if (isEspEnabled) {
            const choices = Object.values(document.querySelector('body div[class*="camelCase"]'))[1].children[0]._owner["stateNode"].state.choices;

            choices.forEach(({ text: e }, t) => {
                const choiceElement = document.querySelector(`div[class^='styles__choice${t + 1}']`);
                if (choiceElement) {

                    const existingCheckmarks = choiceElement.querySelectorAll('.checkmark');
                    existingCheckmarks.forEach(checkmark => {
                        choiceElement.removeChild(checkmark);
                    });

                    if (e.toLowerCase().includes("triple")) {
                        const divElement = document.createElement("div");
                        divElement.className = "checkmark";
                        divElement.style.color = "yellow";
                        divElement.style.fontSize = "2em";
                        divElement.style.display = "flex";
                        divElement.style.justifyContent = "center";
                        divElement.style.transform = "translateY(200px)";
                        divElement.style.opacity = "0.6"; // Increase opacity
                        divElement.innerHTML = '<span style="font-size: 0.5em;">&#10003;</span>';
                        choiceElement.appendChild(divElement);
                    }

                    if (e.toLowerCase().includes("double")) {
                        const divElement = document.createElement("div");
                        divElement.className = "checkmark";
                        divElement.style.color = "yellow";
                        divElement.style.fontSize = "2em";
                        divElement.style.display = "flex";
                        divElement.style.justifyContent = "center";
                        divElement.style.transform = "translateY(200px)";
                        divElement.style.opacity = "0.6"; // Increase opacity
                        divElement.innerHTML = '<span style="font-size: 0.5em;">&#10003;</span>';
                        choiceElement.appendChild(divElement);
                    }

                    if (e.toLowerCase().includes("swap!")) {
                        const divElement = document.createElement("div");
                        divElement.className = "checkmark";
                        divElement.style.color = "green";
                        divElement.style.fontSize = "2em";
                        divElement.style.display = "flex";
                        divElement.style.justifyContent = "center";
                        divElement.style.transform = "translateY(200px)";
                        divElement.style.opacity = "0.6"; // Increase opacity
                        divElement.innerHTML = '<span style="font-size: 0.5em;">&#10003;</span>';
                        choiceElement.appendChild(divElement);
                    }

                    if (e.toLowerCase().includes("lose")) {
                        const divElement = document.createElement("div");
                        divElement.className = "checkmark";
                        divElement.style.color = "grey";
                        divElement.style.fontSize = "1em";
                        divElement.style.display = "flex";
                        divElement.style.justifyContent = "center";
                        divElement.style.transform = "translateY(200px)";
                        divElement.style.opacity = "0.6"; // Increase opacity
                        divElement.innerHTML = '<span style="font-size: 0.5em;">&#10060;</span>';
                        choiceElement.appendChild(divElement);
                    }
                }
            });
        }
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

    const toggleEspButton = document.createElement('button');
    toggleEspButton.id = 'toggleEspButton';
    toggleEspButton.style.position = 'fixed';
    toggleEspButton.style.top = '40px';
    toggleEspButton.style.right = '10px';
    toggleEspButton.style.zIndex = '9999';
    toggleEspButton.textContent = 'ESP: ON';
    toggleEspButton.addEventListener('click', toggleEsp);
    document.body.appendChild(toggleEspButton);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'q' || event.key === 'Q') {
            toggleGUIVisibility();
        }
    });

    toggleGUIVisibility();
    setInterval(executeScript, 100);
})();