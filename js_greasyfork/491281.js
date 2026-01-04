// ==UserScript==
// @name         Copy Challenge Results
// @namespace    https://github.com/veotaar
// @version      0.1.4
// @description  Challenge result copying for geoguessr
// @author       Veotaar
// @match        https://www.geoguessr.com/results/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491281/Copy%20Challenge%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/491281/Copy%20Challenge%20Results.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const myUserId = '5dcff60ddb02e103c4316b1d';

  const button = document.createElement('button');

  let resultJSONString = '';

  const ignoreList = [
    '65318104d772a5c4bcbfb0c1',
    '631366d735017f385c3ce274',
    '65d8b6b19017ab757bb3ba67',
    '6331f2c82f49322c0a4d56bc',
    '632c8d516b2f1ece3e9c56db',
    '65705e35af2c2f81028d7c13',
    '65356736884b107b4fd0522f',
    '65995dd27b5c33db180355f4',
  ];

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(resultJSONString);
      button.innerText = 'Kopyalandı';
      setTimeout(() => {
        button.innerText = 'Sonuçları Kopyala';
      }, 1000);
    } catch (err) {
      console.error(err);
      button.innerText = 'Bir hata oluştu';
    }
  };

  function getUsers() {
    const resultsTable = document.querySelector('div[class^="coordinate-results_table"]');
    if (!resultsTable) {
      console.log('no results yet, retrying...');
      return setTimeout(getUsers, 800);
    }
    const resultRows = Array.from(
      resultsTable.querySelectorAll('div[class^="coordinate-results_row_"]')
    );
    resultRows.shift(); // remove header row
    const data = resultRows
      .map((row) => {
        const userId = row
          .querySelector('a')
          .getAttribute('href')
          .split('/')
          .at(-1);
        const playerName = row
          .querySelector('div[class^="user-nick_nick_"]')
          .innerText.trim();
        const score = Number(
          Array.from(row.querySelectorAll('div[class^="score-cell_score_"]'))
            .at(-1)
            .innerText.split(' ')
            .at(0)
            .replace(',', '')
        );
        return {
          userId: userId === 'profile' ? myUserId : userId,
          playerName,
          score,
        };
      })
      .filter((result) => !ignoreList.includes(result.userId))
      .sort((a, b) => a.score - b.score);

    let prevScore = null;
    let sameScoreCount = 0;

    // Calculate points for each player
    const result = data
      .map((player, index) => {
        if (player.score !== prevScore) {
          prevScore = player.score;
          sameScoreCount = 0;
        } else {
          sameScoreCount++;
        }

        return {
          playerName: player.playerName,
          userId: player.userId,
          score: index - sameScoreCount + 1,
        };
      })
      .toReversed();

    const resultString = JSON.stringify(result);

    resultJSONString = resultString;
    button.removeAttribute('disabled');
    button.addEventListener('click', handleClick);
    button.innerText = 'Sonuçları Kopyala';
    button.style.cursor = 'pointer';
    console.clear();
    console.table(JSON.parse(resultString));
    console.log(resultString);
  }

  function waitForShowButton() {
    const showMoreButton = document.querySelector('[class^="results_center"]');
    if (!showMoreButton) {
      return setTimeout(waitForShowButton, 500);
    }
    showMoreButton.addEventListener('click', function () {
      button.setAttribute('disabled', '');
      button.innerText = 'Hazırlanıyor...';
      button.style.cursor = 'default';
      setTimeout(getUsers, 2000);
    });
  }

  function waitForResultSwitch() {
    const switchButton = document.querySelector('[class^="results_switch"]');
    if (!switchButton) {
      return setTimeout(waitForResultSwitch, 500);
    }
    switchButton.addEventListener('click', function () {
      button.setAttribute('disabled', '');
      button.innerText = 'Hazırlanıyor...';
      button.style.cursor = 'default';
      setTimeout(getUsers, 500);
      waitForShowButton();
    });
  }

  button.innerText = 'Hazırlanıyor...';
  button.setAttribute('disabled', '');
  button.style.position = 'fixed';
  button.style.top = '80px';
  button.style.left = '80px';
  button.style.transform = 'translateX(-50%)';
  button.style.cursor = 'default';
  button.style.color = 'white';

  button.style.zIndex = '9999';

  document.body.appendChild(button);

  getUsers();
  waitForShowButton();
  waitForResultSwitch();
})();