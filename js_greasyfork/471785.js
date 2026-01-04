// ==UserScript==
// @name           Rest Score Input for lidarts
// @name:de        Rest-Betrag Eingabe für lidarts
// @version        0.6.1
// @description    adding restscore functionalty to lidarts
// @description:de fügt in lidarts die Rest-Betrag Eingabe hinzu
// @author         AlexisDot
// @license        MIT
// @match          https://lidarts.org/game/*
// @namespace      https://greasyfork.org/en/users/913506-alexisdot
// @downloadURL https://update.greasyfork.org/scripts/471785/Rest%20Score%20Input%20for%20lidarts.user.js
// @updateURL https://update.greasyfork.org/scripts/471785/Rest%20Score%20Input%20for%20lidarts.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function () {
  'use strict';

  let scoreSelfElement = null;
  const scoreInputForm = document.querySelector('#score_input');
  const scoreInput = scoreInputForm.querySelector('#score_value');
  const chatInput = document.querySelector('#message');
  const isNotCricket = document.querySelector('#cricket_scoreboard')
    ? false
    : true;
  let isLocalGame = false;
  let isComputerGame = false;

  async function initRestScoreInput() {
    let url = `https://lidarts.org/api${window.location.pathname}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const responseJson = await response.json();
    window['myJson'] = responseJson;
    isLocalGame = responseJson.p1_name == responseJson.p2_name;
    isComputerGame = responseJson.p2_name == null;

    function restScoreSubmit() {
      let restScore = scoreInput.value;
      let scoreSelf = isLocalGame
        ? document.querySelector('.player_turn.border-light [id$=_score]')
            .innerText
        : scoreSelfElement.innerText;
      let currentScore = parseInt(scoreSelf);
      let thrownScore = currentScore - restScore;

      scoreInput.value = thrownScore;
      scoreInput.focus();

      $(scoreInputForm).submit();
    }

    if (scoreInput && isNotCricket) {
      document.head.insertAdjacentHTML(
        'beforeend',
        /*html*/ `
        <style>
          .p1_turn_name_card .card-body.select-highlight, .p2_turn_name_card .card-body.select-highlight{
              background: red;
              animation: mymove 3s infinite;
              cursor: pointer;
            }

            @keyframes mymove {
              from {background-color: inherit;}
              50% {background-color: rgb(227,172,17);}
              to {background-color: inherit;}
            }
        </style>`
      );

      if (!isLocalGame && !isComputerGame) {
        let userId = document.querySelector('#user_id').dataset.id;
        let player1Id = document.querySelector('#player1_id').dataset.id;
        let player2Id = document.querySelector('#player2_id').dataset.id;

        if (userId == player1Id) {
          scoreSelfElement = document.querySelector('#p1_score');
        } else if (userId == player2Id) {
          scoreSelfElement = document.querySelector('#p2_score');
        }
      }

      if (isComputerGame) {
        scoreSelfElement = document.querySelector('#p1_score');
      }

      let dummyDiv = document.createElement('div');
      dummyDiv.innerHTML = /*html*/ `
        <button type="button" class="mt-3 btn btn-lg btn-outline-info btn-block" id="rest-score-input">Rest</button>
      `;

      let restScoreInput = dummyDiv
        .querySelector('#rest-score-input')
        .cloneNode(true);

      dummyDiv.innerHTML = /*html*/ `
        <div id="keyboard-notice" class="mt-3 alert alert-info small text-center alert-dismissible fade show" role="alert">
          Keyboard controls:<br>
          <hr>
          undo: <kbd>c</kbd> or <kbd>-</kbd><br>
          <hr>
          rest: <kbd>r</kbd> or <kbd>/</kbd>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>
        </div>`;

      let keyboardNotice = dummyDiv
        .querySelector('#keyboard-notice')
        .cloneNode(true);

      scoreInputForm.insertAdjacentElement('afterend', keyboardNotice);
      scoreInputForm.insertAdjacentElement('afterend', restScoreInput);

      restScoreInput.addEventListener('click', (e) => {
        e.preventDefault();
        restScoreSubmit();
      });

      document.addEventListener('keydown', (e) => {
        const isNotChat = e.target === chatInput ? false : true;
        if (isNotChat && (e.key === '/' || e.key === 'r')) {
          e.preventDefault();
          restScoreSubmit();
        }
        if (isNotChat  && (e.key === '-' || e.key === 'c')) {
          e.preventDefault();
          document.querySelector('#undo-button').click();
          scoreInput.focus()
        }
      });
    }
  }

  initRestScoreInput();
})();
