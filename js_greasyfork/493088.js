// ==UserScript==
// @name         Path of Exile Challenges Filter Replacement
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace "Show Incomplete Challenges" checkbox with a dropdown to filter challenges on Path of Exile profile pages
// @author       You
// @match        https://www.pathofexile.com/account/view-profile/*/challenges
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493088/Path%20of%20Exile%20Challenges%20Filter%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/493088/Path%20of%20Exile%20Challenges%20Filter%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set this to true if you want challenges and sub-challenges to be numbered; otherwise false
    const shouldNumberChallenges = true;

    // Function to replace the checkbox with a dropdown and setup filtering
    function setupFilterDropdown() {
        const originalButton = document.querySelector('.btn-show-achievements');
        if (originalButton && !document.getElementById('challengeFilterDropdown')) {
            // Create the dropdown to replace the button
            const filterDropdown = document.createElement('select');
            filterDropdown.innerHTML = `
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
                <option value="all">All</option>
            `;
            filterDropdown.id = 'challengeFilterDropdown';
            filterDropdown.style.marginLeft = '10px';

            // Replace the original button with the dropdown
            originalButton.parentNode.replaceChild(filterDropdown, originalButton);

            // Function to number challenges
            const numberChallenges = () => {
                const challenges = document.querySelectorAll('.achievement');
                challenges.forEach((challenge, index) => {
                    // Number each challenge
                    let challengeTitle = challenge.querySelector('h2:first-of-type');
                    if (challengeTitle && !challengeTitle.dataset.numbered) {
                        challengeTitle.innerText = `{${(index + 1).toString().padStart(2, '0')}} ${challengeTitle.innerText}`;
                        challengeTitle.dataset.numbered = true;
                    }

                    // Number each sub-challenge
                    let subItems = challenge.querySelectorAll('.detail .items li');
                    subItems.forEach((item, subIndex) => {
                        if (!item.dataset.numbered) {
                            item.innerText = `#${subIndex + 1} ${item.innerText}`;
                            item.dataset.numbered = true;
                        }
                    });
                });
            };

            // Define how to filter challenges
            const filterChallenges = () => {
                const option = filterDropdown.value;
                const challenges = document.querySelectorAll('.achievement');
                challenges.forEach(challenge => {
                    const isComplete = challenge.querySelector('img.completion').src.includes('Tick.png');
                    switch(option) {
                        case 'all':
                            challenge.style.display = '';
                            break;
                        case 'complete':
                            challenge.style.display = isComplete ? '' : 'none';
                            break;
                        case 'incomplete':
                            challenge.style.display = isComplete ? 'none' : '';
                            break;
                    }
                });
                if (shouldNumberChallenges) {
                    numberChallenges();
                }
            };

            // Event listener for changes on the dropdown
            filterDropdown.addEventListener('change', filterChallenges);
            filterChallenges(); // Initially filter based on the default selection
        }
    }

    // Use a MutationObserver to watch for when the checkbox is added to the DOM
    const observer = new MutationObserver(function(mutations, obs) {
        const originalButton = document.querySelector('.btn-show-achievements');
        if (originalButton) {
            setupFilterDropdown();
            obs.disconnect(); // Stop observing once we have made our modification
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
