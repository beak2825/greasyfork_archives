// ==UserScript==
// @name         Quiz House Answer Local Database
// @namespace    http://tampermonkey.net/
// @version      1.0.4b
// @description  After every round, correct answer is saving to local database. You can use that later with "Pick Correct Answer" button. You can also save image answers.
// @author       Meffiu
// @match        https://app.quizhouse.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizhouse.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496246/Quiz%20House%20Answer%20Local%20Database.user.js
// @updateURL https://update.greasyfork.org/scripts/496246/Quiz%20House%20Answer%20Local%20Database.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastQuestion = '',
        instantPickEnabled = false,
        pickRandomAnswer = false,
        instantPickInterval = null,
        playAgainInterval = null,
        alertOffset = 0;

    function initDatabase() {
        let data = loadData('qh_answers');
        let dataImg = loadData('qh_answers_imgs');
        console.log(data);

        if (!data) {
            data = {};
            saveData('qh_answers', data);
        }
        if (!dataImg) {
            dataImg = {};
            saveData('qh_answers_imgs', dataImg)
        }
    }

    function createInstantPickButton() {
        const instantPickButton = document.createElement('button');
        instantPickButton.textContent = 'Instant Pick Correct Answer';
        instantPickButton.style.backgroundColor = 'red';
        instantPickButton.style.color = 'white';
        instantPickButton.style.marginTop = '10px';
        instantPickButton.style.padding = '5px';
        instantPickButton.style.borderRadius = '5px';
        instantPickButton.style.fontSize = '12px';
        instantPickButton.style.marginRight = '5px';
        instantPickButton.addEventListener('click', function() {
            instantPickEnabled = !instantPickEnabled;
            instantPickButton.style.backgroundColor = instantPickEnabled ? 'green' : 'red';
            if (instantPickEnabled) {
                instantPickAnswer();
                updateStatsBox();
            } else {
                clearInterval(instantPickInterval);
            }
        });
        return instantPickButton;
    }

    function createCheckButton() {
        const checkButton = document.createElement('button');
        checkButton.textContent = 'Pick Correct Answer';
        checkButton.style.backgroundColor = 'green';
        checkButton.style.color = 'white';
        checkButton.style.marginTop = '10px';
        checkButton.style.padding = '5px';
        checkButton.style.borderRadius = '5px';
        checkButton.style.fontSize = '12px';
        checkButton.addEventListener('click', checkQuestion);
        return checkButton;
    }

    function createAutoPlayAgainButton() {
        const autoPlayAgainButton = document.createElement('button');
        autoPlayAgainButton.textContent = 'Auto Play Again';
        autoPlayAgainButton.style.backgroundColor = 'red';
        autoPlayAgainButton.style.color = 'white';
        autoPlayAgainButton.style.marginTop = '10px';
        autoPlayAgainButton.style.padding = '5px';
        autoPlayAgainButton.style.borderRadius = '5px';
        autoPlayAgainButton.style.fontSize = '12px';
        autoPlayAgainButton.style.marginRight = '5px';
        let autoPlayAgainEnabled = false;
        autoPlayAgainButton.addEventListener('click', function() {
            autoPlayAgainEnabled = !autoPlayAgainEnabled;
            autoPlayAgainButton.style.backgroundColor = autoPlayAgainEnabled ? 'green' : 'red';
            if (autoPlayAgainEnabled) {
                autoPlayAgain();
            } else {
                clearInterval(playAgainInterval);
            }
        });
        return autoPlayAgainButton;
    }

    function createPickRandomAnswerButton() {
        const pickRandomAnswerButton = document.createElement('button');
        pickRandomAnswerButton.textContent = 'Pick Random Answer If Correct Not Found';
        pickRandomAnswerButton.style.backgroundColor = 'red';
        pickRandomAnswerButton.style.color = 'white';
        pickRandomAnswerButton.style.marginTop = '10px';
        pickRandomAnswerButton.style.padding = '5px';
        pickRandomAnswerButton.style.borderRadius = '5px';
        pickRandomAnswerButton.style.fontSize = '12px';
        pickRandomAnswerButton.addEventListener('click', function() {
            pickRandomAnswer = !pickRandomAnswer;
            pickRandomAnswerButton.style.backgroundColor = pickRandomAnswer ? 'green' : 'red';
        });
        return pickRandomAnswerButton;
    }

    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle StatsBox';
        toggleButton.style.backgroundColor = 'blue';
        toggleButton.style.color = 'white';
        toggleButton.style.marginTop = '10px';
        toggleButton.style.padding = '5px';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.display = 'block';
        toggleButton.addEventListener('click', function() {
            const statsBox = document.getElementById('statsBox');
            if (statsBox.style.display === 'none') {
                statsBox.style.display = 'block';
            } else {
                statsBox.style.display = 'none';
            }
        });
        return toggleButton;
    }

    function autoPlayAgain() {
        playAgainInterval = setInterval(() => {
            const button = document.querySelector('button.css-1tom5sh');
            if (button) {
                button.click();
            }
        }, 3000);
    }

    function instantPickAnswer() {
        instantPickInterval = setInterval(() => {
            checkQuestion();
        }, 1000);
    }

    function updateStatsBox() {
        const data = loadData('qh_answers');
        const dataImg = loadData('qh_answers_imgs');

        let totalAnswers = 0;
        for (let key in data) {
            totalAnswers += data[key].length;
        }

        let totalImgAnswers = 0;
        for (let key in dataImg) {
            totalImgAnswers += dataImg[key].length;
        }

        let statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.id = 'statsContainer';
            statsContainer.style.position = 'fixed';
            statsContainer.style.bottom = '20px';
            statsContainer.style.left = '20px';
            document.body.appendChild(statsContainer);
        }

        let buttonsContainer = document.getElementById('buttonsContainer');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.id = 'buttonsContainer';
            buttonsContainer.style.display = 'flex';
            statsContainer.appendChild(buttonsContainer);
        }

        let secondButtonsContainer = document.getElementById('secondButtonsContainer');
        if (!secondButtonsContainer) {
            secondButtonsContainer = document.createElement('div');
            secondButtonsContainer.id = 'secondButtonsContainer';
            secondButtonsContainer.style.display = 'flex';
            statsContainer.appendChild(secondButtonsContainer);
        }

        let instantPickButton = document.getElementById('instantPickButton');
        if (!instantPickButton) {
            instantPickButton = createInstantPickButton();
            instantPickButton.id = 'instantPickButton';
            buttonsContainer.appendChild(instantPickButton);
        }

        let checkButton = document.getElementById('checkButton');
        if (!checkButton) {
            checkButton = createCheckButton();
            checkButton.id = 'checkButton';
            buttonsContainer.appendChild(checkButton);
        }

        checkButton.style.display = instantPickEnabled ? 'none' : 'block';

        let autoPlayAgainButton = document.getElementById('autoPlayAgainButton');
        if (!autoPlayAgainButton) {
            autoPlayAgainButton = createAutoPlayAgainButton();
            autoPlayAgainButton.id = 'autoPlayAgainButton';
            secondButtonsContainer.appendChild(autoPlayAgainButton);
        }

        let pickRandomAnswerButton = document.getElementById('pickRandomAnswerButton');
        if (!pickRandomAnswerButton) {
            pickRandomAnswerButton = createPickRandomAnswerButton();
            pickRandomAnswerButton.id = 'pickRandomAnswerButton';
            secondButtonsContainer.appendChild(pickRandomAnswerButton);
        }

        pickRandomAnswerButton.style.display = instantPickEnabled ? 'block' : 'none';

        let toggleButton = document.getElementById('toggleButton');
        if (!toggleButton) {
            toggleButton = createToggleButton();
            toggleButton.id = 'toggleButton';
            statsContainer.appendChild(toggleButton);
        }

        let statsBox = document.getElementById('statsBox');
        if (!statsBox) {
            statsBox = document.createElement('div');
            statsBox.id = 'statsBox';
            statsBox.style.padding = '10px';
            statsBox.style.color = 'white';
            statsBox.style.backgroundColor = 'black';
            statsContainer.appendChild(statsBox);
        }
        statsBox.innerHTML = `QH Answer Local Database v${GM_info.script.version}<br>Answers: ${totalAnswers}<br>Image Answers: ${totalImgAnswers}`;
    }

    function showAlert(message, color, duration) {
        const alertBox = document.createElement('div');

        const formattedMessage = message.replace(/\n/g, '<br>');

        alertBox.innerHTML = formattedMessage;
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = `${20 + alertOffset}px`;
        alertBox.style.right = '20px';
        alertBox.style.padding = '10px';
        alertBox.style.color = 'white';
        alertBox.style.backgroundColor = color;
        alertBox.style.maxWidth = '400px';
        alertBox.style.whiteSpace = 'nowrap';
        alertBox.style.overflow = 'auto';

        document.body.appendChild(alertBox);

        setTimeout(() => {
            document.body.removeChild(alertBox);
            alertOffset -= 50;
        }, duration);

        alertOffset += 50;
    }

    function saveData(key, data) {
        GM_setValue(key, JSON.stringify(data));
    }

    function loadData(key) {
        const data = GM_getValue(key, null);
        return data ? JSON.parse(data) : null;
    }

    function saveQuestion() {
        const data = loadData('qh_answers');
        const dataImg = loadData('qh_answers_imgs')
        const question = document.querySelector('div.css-219n91 p').textContent;
        const answer = document.querySelector('div.css-1wxx39n')?.textContent || document.querySelector('div.css-91izyb')?.textContent;
        const image = document.querySelector('img.css-18a88ps')?.getAttribute('src');

        if (!question || !answer) {
            return showAlert('Could not extract question or answer!', 'red', 3000);
        }

        if (image) {
            dataImg[question] = dataImg[question] || [];
            if (!dataImg[question]?.some(i => i.src === image)) {
                dataImg[question].push({ src: image, answer: answer });
                saveData('qh_answers_imgs', dataImg);
                showAlert(`Saved answer "${answer}" to question "${question}"`, 'green', 3000);
            }
        }

        else {
            data[question] = data[question] || [];
            if (!data[question].includes(answer)) {
                data[question].push(answer);
                saveData('qh_answers', data);
                showAlert(`Saved answer "${answer}" to question "${question}"`, 'green', 3000);
            }
        }

        updateStatsBox();
    }

    function checkQuestion() {
        const data = loadData('qh_answers');
        const dataImg = loadData('qh_answers_imgs');
        const question = document.querySelector('div.css-219n91 p').textContent;
        const image = document.querySelector('img.css-18a88ps')?.getAttribute('src');

        if (image) {
            if (dataImg[question]) {
                const imgAnswer = dataImg[question].find(i => i.src === image)?.answer;
                if (imgAnswer) {
                    const divs = Array.from(document.querySelectorAll('div'));
                    const targetDiv = divs.find(div => div.innerText === imgAnswer);
                    if (targetDiv) {
                        return targetDiv.click();
                    } else {
                        showAlert(`No div with the saved answer found!\n\nAnswer: ${imgAnswer}`, 'red', 5000);
                    }
                } else {
                    showAlert('No answer to that question with image in database!', 'red', 3000);
                }
            } else {
                showAlert('No data for this question in database!', 'red', 3000);
            }
        }

        else if (data[question] && data[question].length > 0) {
            const divs = Array.from(document.querySelectorAll('div'));
            let targetDiv = null;
            for (let i = 0; i < data[question].length; i++) {
                targetDiv = divs.find(div => div.innerText === data[question][i]);
                if (targetDiv) {
                    return targetDiv.click();
                }
            }
            if (!targetDiv) {
                showAlert(`No answer to that question in database!`, 'red', 3000);
            }
        } else {
            showAlert('No answer to that question in database!', 'red', 3000);
        }

        if (pickRandomAnswer) {
            const parentDiv = document.querySelector('.css-12zg2fx') || document.querySelector('.css-1dkyqax');
            if (parentDiv) {
                const divs = Array.from(parentDiv.querySelectorAll('div'));
                if (divs.length > 0) {
                    const randomDiv = divs[Math.floor(Math.random() * divs.length)];
                    randomDiv.click();
                }
            }
        }
    }

    const qhObserver = new MutationObserver((qhMutationsList, qhObserver) => {
        for (let mutation of qhMutationsList) {
            if(mutation.type === 'attributes') {
                if(mutation.attributeName === 'class') {
                    const targetElement = mutation.target;
                    if(targetElement.classList.contains('css-1wxx39n') || targetElement.classList.contains('css-91izyb')) {
                        saveQuestion();
                    }
                }
            }
        }
    });
    const qhConfig = { attributes: true, attributeFilter: ['class'], subtree: true };
    qhObserver.observe(document, qhConfig);

    initDatabase();

    updateStatsBox();

    showAlert('Quiz House Answer Local Database loaded!\n\nClick that green "Pick Corrent Answer" button to guess answer to actual question.', 'green', 8000);
})();