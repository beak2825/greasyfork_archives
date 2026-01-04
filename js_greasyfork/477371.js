// ==UserScript==
// @name         FreeRice Multiplication Script/Bot
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0.3
// @description  Automatically play FreeRice multiplication table
// @author       Abdurazaaq Mohammed
// @match        https://play.freerice.com/categories/multiplication-table*
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @license      The Unlicense
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/477371/FreeRice%20Multiplication%20ScriptBot.user.js
// @updateURL https://update.greasyfork.org/scripts/477371/FreeRice%20Multiplication%20ScriptBot.meta.js
// ==/UserScript==

function getAnswer() {

  const numbers = document.querySelector('.card-title').textContent.split(' x ');

  return numbers[0] * numbers[1];
}

function clickAnswer() {
  const answers = document.querySelectorAll('.card-button');

  for (i = 0; i < answers.length; i++) {
    const ans = answers[i];
    if (ans.textContent == getAnswer()) {
      ans.click();
      break;
    }
  }
}
setInterval(clickAnswer, 1000);
setTimeout(function(){ location.reload(); }, 15000); //When you answer questions too quickly, Freerice starts slowing down the rate at which it gives you new questions. This can simply be reset by refreshing the page every once in a while.