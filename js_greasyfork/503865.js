// ==UserScript==
// @name         Sessionize AI detector
// @namespace    http://tampermonkey.net/
// @version      2024-08-17
// @license      Apache 2.0
// @description  Check if a session is AI generated in Sessionize (using Winston AI)
// @author       Sebastiano Poggi
// @match        https://sessionize.com/app/organizer/event/evaluation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sessionize.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.gowinston.ai
// @downloadURL https://update.greasyfork.org/scripts/503865/Sessionize%20AI%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/503865/Sessionize%20AI%20detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = ""; // <----------------------------------------------------------------------------------- Your API key here

    GM_addStyle(`
        .ai-check {
          background: #ececec;
          border-radius: 4pt;
          padding: 0pt 3pt;
          font-size: small;
          font-weight: 600;
          display: flex;
          align-items: center;
          width: fit-content;
        }
        .ai-check::hover { color: unset; }
        .ai-checking { background: #95a2d3; color: white; }
        .ai-checking::before { content: "⌛"; margin-right: 2pt; }
        .ai-error { background: #c92c2c; color: white; }
        .ai-error::before { content: "❕"; margin-right: 2pt; }
        .ai-likely { background: #890d1d; color: white !important; }
        .ai-likely::before { content: "🚨"; margin-right: 2pt; }
        .ai-maybe { background: #dec7e5; color: #6a3183; }
        .ai-maybe::before { content: "❔"; margin-right: 2pt; }
        .ai-unlikely { background: #c0edbd; color: #358331; }
        .ai-unlikely::before { content: "✔️"; margin-right: 2pt; margin-top: -2pt; }
    `);

    function getSubmissionText(anchor) {
        const container = anchor.parentElement.parentElement.parentElement
            .querySelector('div.evaluation-session > p.es-description');
        const trimmedText = container.textContent.trim();
        const notesIndex = trimmedText.indexOf("Additional notes\n");
        return notesIndex !== -1 ? trimmedText.substring(0, notesIndex).trim() : trimmedText;
    }

    function showScore(anchor, score) {
        anchor.classList.remove('ai-checking');

        const displayScore = Math.round(100 - score);
        if (score < 30) {
            anchor.classList.add('ai-likely');
            anchor.textContent = `Likely LLM (${displayScore}%)`;
        } else if (score < 70) {
            anchor.classList.add('ai-maybe');
            anchor.textContent = `Maybe LLM (${displayScore}%)`;
        } else {
            anchor.classList.add('ai-unlikely');
            anchor.textContent = `Unlikely LLM (${displayScore}%)`;
        }
    }

    function showError(anchor, data) {
        anchor.classList.remove('ai-checking');
        anchor.classList.add('ai-error');
        anchor.textContent = `Error (see console)`;
        console.log(`Error checking for LLM content: ${data.error}\n${data.description}\nRaw response:\n$${data}`);
    }

    function checkIfAi(anchor) {
        anchor.classList.add('ai-checking');
        anchor.classList.remove('ai-error');
        anchor.textContent = 'Checking...';

        const text = getSubmissionText(anchor);

        const dataToSend = JSON.stringify({ 'text': text, 'sentences': false });
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.gowinston.ai/v1/ai-content-detection",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            data: dataToSend,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const score = data.score;
                if (score === null || score === undefined) {
                    showError(anchor, data);
                } else {
                    console.log(`Prediction score: ${score} (used ${data.credits_used} credits, ${data.credits_remaining} remaining)`);
                    showScore(anchor, score);
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
            }
        });
    }

    var elems = document.querySelectorAll("h3.es-title");
    for (let k = 0; k < elems.length; k++) {
        const titleElem = elems[k];
        var outerHtml = titleElem.outerHTML;
        titleElem.outerHTML = `${outerHtml}<p style="margin-top: -.5rem; margin-bottom: 2rem;"><a id='es-ai-check-${k}' class='ai-check' href="javascript:checkIfAi(${k})">Check for LLMs</a></p>`
        const anchor = document.getElementById('es-ai-check-' + k);
        anchor.addEventListener('click', () => checkIfAi(anchor));
    }
})();
