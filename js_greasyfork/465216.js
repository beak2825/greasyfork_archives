// ==UserScript==
// @name         Torn Territory War Time Left
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shows time left until territory is captured given the current or bestcase attackers & defenders count right underneath war timeout ticker.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465216/Torn%20Territory%20War%20Time%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/465216/Torn%20Territory%20War%20Time%20Left.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetElementSelector = '.f-war-list.war-new';
    const observerOptions = { childList: true, subtree: true };

    const observerCallback = async function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const targetElement = document.querySelector(targetElementSelector);
                if (targetElement) {
                    let territoryWars = mutation.target.querySelectorAll(".f-war-list.war-new div[class^='status-wrap territoryBox']");
                    if (territoryWars.length > 0) {
                        console.log('Target element found!');
                        territoryWars.forEach(war => {
                            war.querySelector('.info .faction-progress-wrap').style.paddingTop = '0px';
                            let timeLeftElement = document.createElement('div');
                            timeLeftElement.classList.add('time-left', 'timer');
                            let timeLeftBestElement = document.createElement('div');
                            timeLeftBestElement.classList.add('time-left-best', 'timer');
                            war.querySelector('.info .faction-progress-wrap').append(timeLeftElement, timeLeftBestElement);
                        });
                        territoryWars.forEach(war => {
                            let enemyCountDiv = war.querySelector('.info .member-count.enemy-count .count');
                            let allyCountDiv = war.querySelector('.info .member-count.your-count .count');

                            renderTimeLeft(war);

                            // Set up a MutationObserver on the added child element
                            const childObserver = new MutationObserver(function(childMutations) {
                                childMutations.forEach(function(childMutation) {
                                    if (childMutation.type === 'characterData') {
                                        let territoryWar = childMutation.target.parentNode.parentNode.parentNode.parentNode;
                                        renderTimeLeft(territoryWar);
                                    }
                                });
                            });

                            setInterval(renderTimeLeft, 1000 + Math.floor(Math.random() * 10) + 1, war);

                            childObserver.observe(enemyCountDiv, { characterData: true, subtree: true });
                            childObserver.observe(allyCountDiv, { characterData: true, subtree: true });
                        });
                        observer.disconnect();
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.documentElement, observerOptions);
    console.log('Observer started. Waiting for target element to appear...');

    function renderTimeLeft(war) {
        let enemyCountDiv = war.querySelector('.info .member-count.enemy-count .count');
        let allyCountDiv = war.querySelector('.info .member-count.your-count .count');
        let enemyCount = Number(enemyCountDiv.innerText);
        let allyCount = Number(allyCountDiv.innerText);
        let isAllyAttack = war.querySelector('.info .member-count.your-count .count i').classList.contains('swords-icon');
        let remainder = isAllyAttack ? allyCount - enemyCount : enemyCount - allyCount;
        let timeLeft = '??:??:??:??';
        let timeLeftBest = '??:??:??:??';
        let scoreText = war.querySelector('.info .faction-progress-wrap .score').innerText;
        let score = scoreText.replaceAll(',', '').split('/');
        let pointsLeft = Number(score[1]) - Number(score[0]);
        let maximumSlots = Number(score[1]) / 50000;
        if (remainder > 0) {
            let secondsUntilGoal = pointsLeft / remainder;
            timeLeft = convertSecondsToDHMS(secondsUntilGoal);
        }
        timeLeftBest = convertSecondsToDHMS(pointsLeft / maximumSlots);
        let timeLeftDiv = war.querySelector('.info .faction-progress-wrap .time-left');
        let timeLeftBestDiv = war.querySelector('.info .faction-progress-wrap .time-left-best');
        const timeLeftCharacters = timeLeft.split('');
        const timeLeftBestCharacters = timeLeftBest.split('');
        const timeLeftSpanArray = ['CURRENT '];
        timeLeftCharacters.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            timeLeftSpanArray.push(span);
        });
        timeLeftDiv.replaceChildren(...timeLeftSpanArray);
        const timeLeftBestSpanArray = ['BESTCASE '];
        timeLeftBestCharacters.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            timeLeftBestSpanArray.push(span);
        });
        timeLeftBestDiv.replaceChildren(...timeLeftBestSpanArray);
    }

    function convertSecondsToDHMS(seconds) {
        if (seconds === Infinity){
            return '??:??:??:??';
        }

        const oneDay = 86400; // number of seconds in a day
        const oneHour = 3600; // number of seconds in an hour
        const oneMinute = 60; // number of seconds in a minute

        // Calculate the number of days, hours, minutes, and seconds
        const days = Math.floor(seconds / oneDay);
        const hours = Math.floor((seconds % oneDay) / oneHour);
        const minutes = Math.floor((seconds % oneHour) / oneMinute);
        const remainingSeconds = Math.round(seconds % oneMinute);

        // Construct a formatted string with the results
        let output = '';
        output += `${days.toString().padStart(2, '0')}:`;
        output += `${hours.toString().padStart(2, '0')}:`;
        output += `${minutes.toString().padStart(2, '0')}:`;
        output += `${remainingSeconds.toString().padStart(2, '0')}`;

        return output;
    }
})();