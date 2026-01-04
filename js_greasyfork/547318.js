// ==UserScript==
// @name         [GC] - Scorchy Slots Keyboard Controls
// @description  Enables keyboard navigation for GC's Scorchy Slots.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @match        https://www.grundos.cafe/games/play_slots/
// @match        https://www.grundos.cafe/games/slots/
// @author       aether
// @namespace    https://github.com/hlmartin/gc-userscripts/
// @version      1.0.1
// @license      MIT
// @supportURL   https://github.com/hlmartin/gc-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/547318/%5BGC%5D%20-%20Scorchy%20Slots%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/547318/%5BGC%5D%20-%20Scorchy%20Slots%20Keyboard%20Controls.meta.js
// ==/UserScript==

const submit = () => {
  const button = document.querySelector('input[type="submit"][value="Click Here to Play"], input[type="submit"][value="Play Again"], input[type="submit"][value="Collect Winnings"]');
  if (button) {
    button.click();
  }
}

const hold = (key) => {
  const index = key - 1;
  const checkbox = document.querySelector(`#scorchy-hold input[type="checkbox"][name="scorchy_hold_${index}"]`);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case 'Enter':
      submit();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
      hold(parseInt(event.key));
      break;
  }
});
