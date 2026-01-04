// ==UserScript==
// @name         Trophy Manager Tactical Lens
// @namespace      *trophymanager.com/matches*
// @include        *trophymanager.com/matches*
// @version      0.11
// @description  Read match data from Trophy Manager and send to the Tactical Lens analyzer
// @author       Willians Echart
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547412/Trophy%20Manager%20Tactical%20Lens.user.js
// @updateURL https://update.greasyfork.org/scripts/547412/Trophy%20Manager%20Tactical%20Lens.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    function sendToAnalyzer(matchData) {
      fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      })
        .then((res) => res.json())
        .then((data) => console.log('[TM Analyzer] Sent successfully:', data))
        .catch((err) => console.error('[TM Analyzer] Error sending data:', err));
    }
  
    /**
     * Inject the form to send the match data to the analyzer
     */
    function injectForm() {
        const form = document.createElement('form');
        form.id = 'tm-analyzer-form';
        form.action = '/api/matches';
        form.method = 'POST';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'match_data';
        input.value = JSON.stringify(matchData);
        form.appendChild(input);

        document.body.appendChild(form);
    }
    

    function injectButton() {
        const ui = document.createElement('div');
        ui.id = 'tm-analyzer-ui';
        ui.innerHTML = `
            <button id="tm-analyzer-button">Send to Tactical Lens</button>
        `;

        document.body.appendChild(ui);

        const button = document.getElementById('tm-analyzer-button');
        button.addEventListener('click', () => {
            sendToAnalyzer(match_data); // match_data is a global variable that contains the entire match report
        });
    }
  
    window.addEventListener('load', () => {
        injectButton();
        injectForm();
    });
  })();