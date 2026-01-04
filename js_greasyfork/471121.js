// ==UserScript==
// @name        autolike
// @namespace   autolike
// @match       https://lolz.guru/*
// @match       https://zelenka.guru/*
// @grant       none
// @version     1.0
// @author      OlegBekker
// @icon        https://zelenka.guru/favicon.ico
// @description автосимпа на розыгрыши
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471121/autolike.user.js
// @updateURL https://update.greasyfork.org/scripts/471121/autolike.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const likeButton = document.querySelector('a.LikeLink');
  const moneyContest = document.querySelector('span.prefix.general.moneyContestWithValue');
  const closedTopic = document.querySelector('h1 > i.fa-lock');

  const likeFlag = 'zelenka_like_' + window.location.href;
  const scriptExecutedFlag = 'zelenka_script_executed_' + window.location.href;

  const likeProbability = 0.5; // вероятность лайка 50%

  if (closedTopic) {
    console.log('Тема закрыта, лайк не ставим');
  } else if (likeButton && moneyContest && !localStorage.getItem(likeFlag) && !localStorage.getItem(scriptExecutedFlag)) {
    const randomValue = Math.random(); // генерируем случайное число от 0 до 1
    if (randomValue <= likeProbability) { // сравниваем с вероятностью лайка
      likeButton.click(); // если число меньше или равно вероятности лайка, ставим лайк
      localStorage.setItem(likeFlag, true);
    }
  }

  localStorage.setItem(scriptExecutedFlag, true);
})();