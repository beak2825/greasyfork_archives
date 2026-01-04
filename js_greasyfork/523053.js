// ==UserScript==
// @name         Poker Muggy
// @namespace    heartflower.torn
// @version      1.1
// @description  Adds an "Mug Time!" button when a player leaves a poker table, and a 5 minute timer when they start sitting out.
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=holdem*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/523053/Poker%20Muggy.user.js
// @updateURL https://update.greasyfork.org/scripts/523053/Poker%20Muggy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPage = window.location.href;

    // Create a mutation observer to watch for changes on the page
    function createObserver(element) {
        // console.log('Creating observer');
        // console.log('element observer' + element);

        let target;
        target = element;

        if (!target) {
            console.error(`Target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Handle removed nodes
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList && Array.from(node.classList).some(className => className.includes('playerPositioner'))) {
                            // console.log('Node removed', node);
                            // console.log('Node with playerpositioner class removed');
                            let opponent = node.querySelector('.opponent___ZyaTg');
                            if (!opponent) {
                                return;
                            }

                            let playerId = opponent.id;
                            if (playerId) {
                                playerId = playerId.replace('player-','');
                                // console.log('Player with ID ' + playerId + ' left the table');
                            }

                            createAttackLink(playerId);
                        }
                    });

                    mutation.addedNodes.forEach(node => {
                        if (node.textContent?.trim() === 'Sitting out') {
                            let state;
                            if (node.parentNode.classList.contains('state___Bf8_1')) {
                                state = node.parentNode;
                            } else if (node.parentNode.parentNode.classList.contains('state___Bf8_1')) {
                                state = node.parentNode.parentNode;
                            }

                            let details = state.parentNode;
                            createTimeoutTimer(details);

                            createObserver(state);
                        }
                    });

                } else if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    if (element.classList.contains('state___Bf8_1')) {
                        if (mutation.target.textContent !== 'Sitting out') {
                            let existingContainer = element.parentNode.querySelector('.hf-timeout-timer');
                            let existingDiv = element.parentNode.querySelector('.hf-timeout-container');
                            if (existingDiv) {
                                existingContainer.remove();
                                existingDiv.remove();
                            }
                        }
                    }

                    if (mutation.target.textContent === 'Sitting out') {
                        let state;
                        if (mutation.target.parentNode.classList.contains('state___Bf8_1')) {
                            state = mutation.target.parentNode;
                        } else if (mutation.target.parentNode.parentNode.classList.contains('state___Bf8_1')) {
                            state = mutation.target.parentNode.parentNode;
                        }

                        let details = state.parentNode;

                        createTimeoutTimer(details);
                        createObserver(state);
                    }
                }

            }

        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    function createTimeoutTimer(detailsBox) {
        let existingDiv = detailsBox.querySelector('.hf-timeout-timer');
        if (existingDiv) {
            return;
        }

        let opponent;
        if (currentPage.includes('Full')) {
            opponent = detailsBox.parentNode;
        } else {
            opponent = detailsBox.parentNode.parentNode;
        }

        let userId = opponent.id;
        userId = userId.replace('player-','');

        let name = opponent.querySelector('.name___cESdZ');
        name.style.zIndex = '999999';

        let state = detailsBox.querySelector('.state___Bf8_1');
        state.style.zIndex = '999999';

        let div = document.createElement('div');
        div.className = 'hf-timeout-container';
        div.style.position = 'absolute';
        div.style.background = 'black';
        div.style.opacity = '80%';
        div.style.zIndex = '99999';
        div.style.borderRadius = '5px';

        let anchor = document.createElement('a');
        anchor.className = 'hf-timeout-timer';
        anchor.style.position = 'absolute';
        anchor.style.display = 'flex';
        anchor.style.alignItems = 'center';
        anchor.style.justifyContent = 'center';
        anchor.style.zIndex = '999999';
        anchor.style.color = 'cyan';
        anchor.textContent = '05:00';
        anchor.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
        anchor.target = '_blank';

        if (currentPage.includes('Full')) {
            div.style.width = '145px';
            div.style.height = '140px';
            div.style.marginLeft = '10px';
            div.style.marginTop = '6px';

            anchor.style.width = '145px';
            anchor.style.height = '140px';
            anchor.style.marginLeft = '10px';
            anchor.style.marginTop = '6px';
            anchor.style.fontSize = 'xx-large';

            let money = detailsBox.querySelector('.money___jzo69');
            money.style.zIndex = '999999';
        } else {
            div.style.width = '106px';
            div.style.height = '80px';
            div.style.marginLeft = '-7px';
            div.style.marginTop = '-7px';

            anchor.style.width = '106px';
            anchor.style.height = '80px';
            anchor.style.marginLeft = '-7px';
            anchor.style.marginTop = '-7px';
            anchor.style.fontSize = 'x-large';
        }

        detailsBox.appendChild(div);
        detailsBox.appendChild(anchor);

        startCountdown(anchor, userId);
    }

    function startCountdown(element, userId) {
        let timeLeft = 5 * 60;

        let countdownInterval = setInterval(() => {
            if (!element) {
                clearInterval(countdownInterval);
            }

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;

            // Display the time in the format MM:SS
            element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                element.textContent = '00:00';
            }

            timeLeft--;
        }, 1000); // Update every 1 second
    }

    // Find an element based on className
    function findElement(parent, className) {
        // console.log('Finding element');
        // console.log('Parent:' + parent + 'classname' + className);

        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }
        // console.log('Element found', element);

        if (className === '.players___U6bQr') {
            // console.log('Element is players');

            // Find opponents
            findElements(element, 'div');

            // Watch for opponents to change or get removed
            createObserver(element);
        }
    }

    function findElements(parent, className) {
        // console.log('Finding elements');
        // console.log('Parent:' + parent + 'classname' + className);

        let elements = parent.querySelectorAll(className);
        if (!elements || elements.length < 1) {
            setTimeout(() => findElements(parent, className), 100);
            return;
        }

        if (className === 'div') {
            elements.forEach(element => {
                // Watch for them to disappear
                createObserver(element);
            });
        }
    }

    function createAttackLink(playerId) {
        let oldLink = document.body.querySelector('.hf-poker-mug');
        if(oldLink) {
            // High chances of switching tables, so remove prev link
            // console.log('old link found');
            oldLink.remove();
        }

        let attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=` + playerId;

        let holdemWrapper = document.body.querySelector('.holdemWrapper___D71Gy');
        if (!holdemWrapper) {
            console.error('Holdem wrapper not found');
            return;
        }

        let button = document.createElement('button');
        button.textContent = 'MUG TIME';
        button.className = 'torn-btn hf-poker-mug';
        button.style.position = 'absolute';
        button.style.fontSize = '30px';
        button.style.color = 'white';
        button.style.background = 'var(--default-bg-17-gradient)';
        button.style.borderRadius = '50px';
        button.style.padding = '25px 50px';
        button.style.lineHeight = '4px';

        if (currentPage.includes('Full')) {
            button.style.left = '380px';
            button.style.top = '370px';
        } else {
            button.style.left = '280px';
            button.style.top = '350px';
        }

        button.addEventListener('click', () => {
            window.open(attackLink, '_blank');
            button.remove();
        });

        if (oldLink) {
            // If changing tables, remove button link
            setTimeout(() => {
                button.remove();
            }, 0);
        } else {
            // Set a timeout to remove the button after 5 seconds
            setTimeout(() => {
                button.remove();
            }, 5000); // 5 seconds in milliseconds
        }

        holdemWrapper.appendChild(button);
    }

    // Find the players element
    findElement(document.body, '.players___U6bQr');
})();