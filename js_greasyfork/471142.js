// ==UserScript==
// @name         autosimp1
// @match        https://zelenka.guru/*
// @description  666
// @version 0.0.1.20230718181250
// @namespace https://greasyfork.org/users/1061164
// @downloadURL https://update.greasyfork.org/scripts/471142/autosimp1.user.js
// @updateURL https://update.greasyfork.org/scripts/471142/autosimp1.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const likeButton = document.querySelector('a.LikeLink');
  const moneyContest = document.querySelector('span.prefix.general.moneyContestWithValue');
  const closedTopic = document.querySelector('h1 > i.fa-lock');

  const likeFlag = 'zelenka_like_' + window.location.href;
  const scriptExecutedFlag = 'zelenka_script_executed_' + window.location.href;

  if (closedTopic) {
    console.log('Тема закрыта, лайк не ставим');
  } else if (likeButton && moneyContest && !localStorage.getItem(likeFlag) && !localStorage.getItem(scriptExecutedFlag)) {
    likeButton.click();
    localStorage.setItem(likeFlag, true);
  }

  localStorage.setItem(scriptExecutedFlag, true);
})();