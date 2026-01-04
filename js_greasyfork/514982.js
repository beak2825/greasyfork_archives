// ==UserScript==
// @name         Seshatia's Help
// @description  Adds hint buttons to Faerie Crossword clues
// @version      2025.12.30
// @license      GNU GPLv3
// @match        https://www.neopets.com/games/crossword/*
// @author       Posterboy
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514982/Seshatia%27s%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/514982/Seshatia%27s%20Help.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log("Neopets Crossword 'Hint' version is running...");

    // =========================
    // STYLING
    // =========================
    function createHintButton(clueElement) {
        const button = document.createElement('button');
        button.textContent = 'Hint';
        button.className = 'hint-button';

        button.style.marginLeft = '8px';
        button.style.backgroundColor = '#ffd700';
        button.style.border = '1px solid #888';

        button.addEventListener('click', () => {
            const clueText = clueElement.innerText.trim().replace(/^\d+\.\s*/, '').toLowerCase();
            const answer = clueMap.get(clueText);

            const onclickCode = clueElement.getAttribute('onclick');
            const match = onclickCode?.match(/set_clue\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const [_, row, col, dir, len] = match.map(Number);
                if (typeof set_clue === 'function') {
                    set_clue(row, col, dir, len);
                }
            }

            if (!answer) {
                console.warn("Answer not found for clue:", clueText);
                return;
            }

            const xWordInput = document.querySelector('input[name="x_word"]');
            if (xWordInput) {
                xWordInput.value = answer;
            }
        });

        return button;
    }

    // =========================
    // SCRIPTING
    // =========================
    let data;
    const clueMap = new Map();

    try {
        const response = await fetch('https://raw.githubusercontent.com/unoriginality786/NeopetsFaerieCrosswordJSON/refs/heads/main/ClueMapAlpha.json');
        data = await response.json();

        Object.entries(data.clues).forEach(([clue, answer]) => {
            const normalizedClue = clue.toLowerCase().trim();
            if (normalizedClue) {
                clueMap.set(normalizedClue, answer);
            }
        });
    } catch (error) {
        console.error("Failed to fetch crossword data:", error);
        return;
    }

    function injectHintButtons() {
        const clueLinks = document.querySelectorAll('a[href="javascript:;"]');

        clueLinks.forEach(clue => {
            if (!clue.getAttribute('onclick')?.includes('set_clue')) return;

            if (clue.nextSibling && clue.nextSibling.classList?.contains('hint-button')) return;

            const hintButton = createHintButton(clue);
            clue.parentNode.insertBefore(hintButton, clue.nextSibling);

            const lineBreak = document.createElement('br');
            clue.parentNode.insertBefore(lineBreak, hintButton.nextSibling);
        });
    }

    // =========================
    // EVENT HANDLERS
    // =========================
    const observer = new MutationObserver(() => {
        injectHintButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        injectHintButtons();
    });

})();