// ==UserScript==
// @name         Kahoot Manual Answer Reveal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetches correct answers and displays them in a pop-up.
// @author       You
// @match        *://kahoot.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547517/Kahoot%20Manual%20Answer%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/547517/Kahoot%20Manual%20Answer%20Reveal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addRevealButton() {
        const button = document.createElement('button');
        button.innerText = 'Reveal Answers';
        button.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 9999; padding: 10px; background-color: #4A4A4A; color: white; border: none; border-radius: 5px; cursor: pointer;';

        button.onclick = async () => {
            const pin = document.querySelector('input[name="game-pin"]')?.value;
            if (!pin) {
                alert('Please enter a game PIN first.');
                return;
            }

            try {
                // This fetches the quiz data using a proxy and a specific method found online.
                const response = await fetch(`https://create.kahoot.it/rest/kahoots/${prompt("Enter the Quiz ID (from the Kahoot URL):")}/card/?includeKahoot=true`);
                const data = await response.json();
                const answers = data.kahoot.questions.map((q, index) => {
                    const correctChoice = q.choices.find(c => c.correct);
                    const colorIndex = q.choices.findIndex(c => c.correct);
                    const colors = ['🔴', '🔵', '🟡', '🟢'];
                    return `Q${index + 1}: ${colors[colorIndex]} - ${correctChoice.answer}`;
                }).join('\n');

                if (answers) {
                    alert('Correct Answers:\n\n' + answers);
                } else {
                    alert('Could not find answers for this quiz.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching the answers. Make sure you entered the correct Quiz ID.');
            }
        };

        document.body.appendChild(button);
    }

    // Add the button when the page loads
    window.addEventListener('load', addRevealButton);
})();