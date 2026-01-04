// ==UserScript==
// @name        civitai.com heart react all
// @namespace   Violentmonkey Scripts
// @match       https://civitai.com/images*
// @grant       none
// @version     1.1
// @author      tryitandsee
// @license     MIT
// @description Press "1" to click all heart reaction buttons on civitai.com image pages.
// @downloadURL https://update.greasyfork.org/scripts/510663/civitaicom%20heart%20react%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/510663/civitaicom%20heart%20react%20all.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
  if (event.key === '1') {
    const heartButtons = Array.from(document.querySelectorAll('button')).filter(button =>
      button.textContent.includes('❤️')
    );

    if (heartButtons.length > 0) {
      heartButtons.forEach(button => button.click());
      console.log(`Clicked ${heartButtons.length} heart button(s)!`);
    } else {
      console.log('No heart buttons found.');
    }
  }
});
