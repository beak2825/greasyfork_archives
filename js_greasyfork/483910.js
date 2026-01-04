// ==UserScript==
// @name         Transfer Wordle to Scoredle
// @namespace    https://mathemaniac.org/
// @version      1.0.4
// @description  Adds a button to the Wordle completion screen, to transfer today's game into Scoredle in a new tab.
// @match        https://www.nytimes.com/games/wordle/index.html*
// @match        https://scoredle.com/*
// @copyright    2024, Sebastian Paaske Tørholm
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483910/Transfer%20Wordle%20to%20Scoredle.user.js
// @updateURL https://update.greasyfork.org/scripts/483910/Transfer%20Wordle%20to%20Scoredle.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

if (document.location.host === 'www.nytimes.com') {
    // Wordle
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var config = { childList: true, characterData: false, attributes: false, subtree: true };
    var observer = new MutationObserver( function (mutations) {
        mutations.forEach( function (mutation) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) continue;

                let shareButton = node.querySelector('[class^="Footer-module_shareButton"]');
                if (shareButton) {
                    let newButton = shareButton.cloneNode(true);
                    newButton.querySelector('svg').remove();
                    newButton.querySelector('span').innerHTML = "Open in Scoredle";
                    newButton.setAttribute('style', 'margin-top: 0.25em;');
                    newButton.setAttribute('id', 'export-to-scoredle-btn');
                    newButton.onclick = async function () {
                        let userid = 1*document.cookie.match(/(?<=nyt-jkidd=uid=)\d+/)[0];
                        if (! userid) { userid = 'ANON'; }

                        let data = JSON.parse( localStorage.getItem(`games-state-wordleV2/${userid}`) );

                        let state = data.states[0].data;
                        let guesses = state.boardState.filter((e) => e);

                        let solution;
                        if (state.status === 'WIN') {
                            solution = guesses[guesses.length-1];
                        } else {
                            const todayDate = new Date();
                            const dateString = (1900 + todayDate.getYear()) + '-' + ((todayDate.getMonth()+1)+"").padStart(2, '0') + '-' + (todayDate.getDate()+"").padStart(2, '0');
                            const response = await fetch(`https://www.nytimes.com/svc/wordle/v2/${dateString}.json`)
                            const result = await response.json();

                            solution = result.solution;
                        }

                        guesses = guesses.join(",");

                        window.open(`https://scoredle.com/#guesses=${guesses};solution=${solution}`, '_blank');
                    };
                    shareButton.after(newButton);
                }
            }
        });
    });

    observer.observe(document.querySelector('body'), config);
} else {
    // Scoredle

    let matches = document.location.hash.match(/^#guesses=([^;]+);solution=(.*)$/);
    if (! matches) return;

    let guesses = matches[1].split(',');
    let solution = matches[2];

    function inputValue(id, value) {
        let answerBox = document.querySelector(`#${id}`);

        answerBox.value = value;
        answerBox._valueTracker.setValue('');
        answerBox.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function fillOutForm() {
        let answerBox = document.querySelector(`#answer`);
        if (! answerBox) {
            setTimeout(fillOutForm, 100);
            return;
        }

        inputValue('answer', solution);
        for (var i = 0; i < guesses.length; i++) {
            inputValue(`guess${i}`, guesses[i]);
        }
    }

    fillOutForm();
}
