// ==UserScript==
// @name         Wordle Unlimited Solver
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  shows the correct word
// @author       find
// @match        https://wordleunlimited.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordleunlimited.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544226/Wordle%20Unlimited%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/544226/Wordle%20Unlimited%20Solver.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function revealTheWord() {
        const gameApp = document.querySelector('game-app');

        if (gameApp && gameApp.solution) {
            clearInterval(checkInterval);

            const correctWord = gameApp.solution;
            const solutionDisplay = document.createElement('div');
            solutionDisplay.id = 'wordle-solver-display';

            solutionDisplay.style.position = 'fixed';
            solutionDisplay.style.top = '8px';
            solutionDisplay.style.left = '50%';
            solutionDisplay.style.transform = 'translateX(-50%)';
            solutionDisplay.style.padding = '12px 24px';
            solutionDisplay.style.backgroundColor = '#4CAF50';
            solutionDisplay.style.color = 'white';
            solutionDisplay.style.border = '2px solid #388E3C';
            solutionDisplay.style.borderRadius = '8px';
            solutionDisplay.style.zIndex = '99999';
            solutionDisplay.style.fontSize = '24px';
            solutionDisplay.style.fontWeight = 'bold';
            solutionDisplay.style.fontFamily = 'Arial, sans-serif';
            solutionDisplay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            solutionDisplay.style.textAlign = 'center';
            solutionDisplay.style.cursor = 'pointer';

            solutionDisplay.innerHTML = `Today's Word: <span style="text-decoration: underline;">${correctWord.toUpperCase()}</span>`;

            solutionDisplay.addEventListener('click', () => {
                solutionDisplay.style.display = 'none';
            });

            document.body.appendChild(solutionDisplay);
        }
    }

    const checkInterval = setInterval(revealTheWord, 500);
})();