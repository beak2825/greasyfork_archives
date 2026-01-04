// ==UserScript==
// @name         Edubaked
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Auto-complete Educake
// @match        https://my.educake.co.uk/my-educake/quiz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529970/Edubaked.user.js
// @updateURL https://update.greasyfork.org/scripts/529970/Edubaked.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function FriedText(encoded) {
    return atob(encoded);
}

    function osmosis(encoded) {
        return JSON.parse(atob(encoded));
    }
    const TOKEN_URL = FriedText("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0F4bVBsYXlzL2VkdWNha2UtYXV0aC9yZWZzL2hlYWRzL21haW4vdG9rZW5zLmpzb24=");

    function createLoginUI() {
        let loginContainer = document.createElement('div');
        loginContainer.style.position = 'fixed';
        loginContainer.style.top = '50%';
        loginContainer.style.left = '50%';
        loginContainer.style.transform = 'translate(-50%, -50%)';
        loginContainer.style.background = 'white';
        loginContainer.style.padding = '20px';
        loginContainer.style.border = '2px solid black';
        loginContainer.style.zIndex = '10000';
        loginContainer.style.textAlign = 'center';

        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your token';
        input.style.display = 'block';
        input.style.marginBottom = '10px';

        let loginButton = document.createElement('button');
        loginButton.textContent = 'Login';

        loginContainer.appendChild(input);
        loginContainer.appendChild(loginButton);
        document.body.appendChild(loginContainer);

        loginButton.addEventListener('click', () => {
            let token = input.value.trim();
            fetch(TOKEN_URL)
                .then(response => response.text())
                .then(encodedData => {
                    let data = osmosis(encodedData);
                    if (data[token]) {
                        let { name, premium } = data[token];
                        let edition = premium ? "Edubaked Premium" : "Edubaked Lite";
                        alert(`Welcome, ${name}!`);
                        document.body.removeChild(loginContainer);
                        createAnswerUI(name, edition, premium);
                    } else {
                        alert("Invalid token. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching token data:", error);
                    alert("Failed to verify token. Try again later.");
                });
        });
    }

    function createAnswerUI(username, edition, premium) {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.background = 'white';
        container.style.padding = '10px';
        container.style.border = '2px solid black';
        container.style.zIndex = '1000';

        let title = document.createElement('h3');
        title.textContent = edition;
        title.style.marginBottom = '5px';
        container.appendChild(title);

        let subtitle = document.createElement('h4');
        subtitle.textContent = `Welcome, ${username}`;
        subtitle.style.marginBottom = '10px';
        subtitle.style.fontSize = '14px';
        container.appendChild(subtitle);

        let textarea = document.createElement('textarea');
        textarea.placeholder = 'Enter answers (e.g. 1. cyclone)';
        textarea.style.width = '250px';
        textarea.style.height = '150px';
        container.appendChild(textarea);

        let button = document.createElement('button');
        button.textContent = 'Fill Answers';
        button.style.display = 'block';
        button.style.marginTop = '10px';
        container.appendChild(button);

        document.body.appendChild(container);

        button.addEventListener('click', function() {
            let lines = textarea.value.split('\n');
            let answers = {};

            lines.forEach(line => {
                let match = line.match(/(\d+)\.\s*(.+)/);
                if (match) {
                    let qNum = match[1];
                    let answer = match[2].replace(/"/g, '');
                    answers[qNum] = answer;
                }
            });

            let processQuestion = () => {
                let questionHeader = document.querySelector('h3.text-white.fs-4.my-0');
                if (!questionHeader) return;

                let match = questionHeader.textContent.match(/Question\s(\d+)\sof/);
                if (!match) return;

                let currentQuestionNum = match[1];
                let answerToFill = answers[currentQuestionNum];
                if (!answerToFill) return;

                let inputField = document.querySelector('input[name="answer"], input[placeholder="Enter your answer as a number"]');
                if (inputField && !inputField.value) {
                    inputField.value = answerToFill;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    document.querySelectorAll('li[role="option"]').forEach(el => {
                        if (el.textContent.trim() === answerToFill) {
                            el.click();
                        }
                    });
                }

                setTimeout(() => {
                    let submitButton = document.querySelector('button.arrow-right');
                    if (submitButton) {
                        submitButton.click();
                        setTimeout(processQuestion, premium ? 500 : 2000);
                    }
                }, 500);
            };

            processQuestion();
        });
    }

    createLoginUI();
})();
