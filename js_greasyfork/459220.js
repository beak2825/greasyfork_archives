// ==UserScript==
// @name   Bypass DiffChecker Limit
// @match   *://www.diffchecker.com/*
// @match   *://diffchecker.com/*
// @match        https://diffchecker.com/*
// @match /^https:\/\/diffchecker\.com\/(1|2|3|4|5|6|7|8|9)/
// @description   Bypass DiffCheckers merge limit
// @version 0.0.1.20231004231342
// @namespace https://greasyfork.org/users/1019668
// @downloadURL https://update.greasyfork.org/scripts/459220/Bypass%20DiffChecker%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/459220/Bypass%20DiffChecker%20Limit.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', () => {
  const modalCloseButton = document.querySelector('.modal_closeButton__6_K1B');

    if (modalCloseButton) {
        modalCloseButton.click();
        console.log('clicked');
    }
})

localStorage.clear();
console.log('cleared');
localStorage.setItem('alreadySawHomepageModal', true);

setInterval(() => {
  localStorage.clear()
}, 5000)