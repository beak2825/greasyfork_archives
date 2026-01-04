// ==UserScript==
// @name         Trophy Manager Tactical Lens
// @namespace      *trophymanager.com/matches*
// @include        *trophymanager.com/matches*
// @version      0.1.1
// @description  Read match data from Trophy Manager and send to the Tactical Lens analyzer
// @author       Willians Echart
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547523/Trophy%20Manager%20Tactical%20Lens.user.js
// @updateURL https://update.greasyfork.org/scripts/547523/Trophy%20Manager%20Tactical%20Lens.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TACTICAL_LENS_URL = 'https://trophy-manager-tactical-lens.onrender.com/api/analyze';

  function sendToAnalyzer() {
    if (!end_of_game) alert('Wait for match to end');
    else {
      const form = document.getElementById('tm-tactical-lens-form');
      const formMatchData = document.getElementById('match_data');
      formMatchData.value = JSON.stringify(match_data);

      form.submit();
    }
  }

  /**
   * Inject the form to send the match data to the analyzer
   */
  function injectForm() {
    const form = document.createElement('form');
    form.id = 'tm-tactical-lens-form';
    form.action = TACTICAL_LENS_URL;
    form.method = 'POST';

    const formMatchData = document.createElement('input');
    formMatchData.id = 'match_data';
    formMatchData.type = 'hidden';
    formMatchData.name = 'match_data';
    form.appendChild(formMatchData);

    const formMatchId = document.createElement('input');
    formMatchId.type = 'hidden';
    formMatchId.name = 'match_id';
    formMatchId.value = match_id;
    form.appendChild(formMatchId);

    const formSeason = document.createElement('input');
    formSeason.type = 'hidden';
    formSeason.name = 'season';
    const seasonText = document.querySelector('a[title="Home"').textContent;
    let seasonNumber;

    if (seasonText) {
      const match = seasonText.match(/Season\s+(\d+)/i);
      if (match) {
        seasonNumber = parseInt(match[1]);
      }
    }
    formSeason.value = seasonNumber;
    form.appendChild(formSeason);

    document.body.appendChild(form);
  }

  function injectStyles() {
    const styles = document.createElement('style');
    styles.innerHTML = `
            #tm-tactical-lens-ui {
                position: fixed;
                bottom: 0;
                left: 16px;
                background: rgba(13, 120, 56, 0.95);
                padding: 16px;
                font-size: 12px !important;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                border: 3px solid #e5d72f;
                border-bottom: 0px;
            }

            #tm-tactical-lens-ui h3{
                margin: 8px 0;
            }

            #tm-tactical-lens-button {
                background-color: #226750;
                border: 0;
                padding: 8px 12px;
                color: #226750;
                background: #e5d72f;
                border-radius: 4px;
                cursor: pointer;
                color: #226750;
                font-weight: 700;
                font-size: 14px;
            }

            #tm-tactical-lens-button:hover {
                opacity: 0.7;
            }
        `;

    document.head.appendChild(styles);
  }

  function injectContent() {
    const ui = document.createElement('div');
    ui.id = 'tm-tactical-lens-ui';
    ui.innerHTML = `
            <h3>TM Tactical Lens</h3>
            <p>Send the match data to the Tactical Lens analyzer</p>
            <button id="tm-tactical-lens-button">Analyze</button>
        `;

    document.body.appendChild(ui);

    const button = document.getElementById('tm-tactical-lens-button');
    button.addEventListener('click', () => {
      sendToAnalyzer();
    });
  }

  function init() {
    injectForm();
    injectContent();
    injectStyles();
  }

  window.addEventListener('load', () => {
    init();
  });
})();
