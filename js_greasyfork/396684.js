// ==UserScript==
// @name         LingoDeer Auto Write Myself
// @namespace    https://greasyfork.org/users/649
// @version      1.0.3
// @description  Auto switch to "Write Myself", and adds press enter to continue.
// @author       Adrien Pyke
// @match        *://www.lingodeer.com/learn-languages/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/396684/LingoDeer%20Auto%20Write%20Myself.user.js
// @updateURL https://update.greasyfork.org/scripts/396684/LingoDeer%20Auto%20Write%20Myself.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let helpClicked = false;
  waitForElems({
    sel: '.switchBtn',
    onmatch: btn => {
      if (
        btn.textContent.trim() === 'I want to write it myself' &&
        !helpClicked
      )
        btn.click();
      else btn.addEventListener('click', () => (helpClicked = true));
      helpClicked = false;
    }
  });
  waitForElems({
    sel: '.textAreaInput textarea',
    onmatch: input => (
      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const btn = document.querySelector(
          '.checkBtn.active, .continueBtn:not(.wrong)'
        );
        btn && btn.click();
        e.preventDefault();
        return false;
      }),
      input.focus()
    )
  });
  waitForElems({
    sel: '.signBtn',
    stop: true,
    onmatch: btn => btn.click()
  });
})();
