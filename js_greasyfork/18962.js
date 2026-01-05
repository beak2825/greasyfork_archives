// ==UserScript==
// @name         Project Endor (Jamelio) Keybinds
// @namespace    https://github.com/Kadauchi/
// @version      2.0.0
// @description  Make keybinds for the Project Endor (Jamelio) voice recording hits.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.google.com/evaluation/endor/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/18962/Project%20Endor%20%28Jamelio%29%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/18962/Project%20Endor%20%28Jamelio%29%20Keybinds.meta.js
// ==/UserScript==

function MOUSEDOWN (element) {
  const event = document.createEvent(`MouseEvents`);
  event.initEvent(`mousedown`, true, true);
  element.dispatchEvent(event);
}

window.addEventListener(`keydown`, function (event) {
  switch(event.key) {
    case `1`:
      MOUSEDOWN(document.querySelectorAll(`div[id^=g]`)[0].children[0].children[0]);
      break;
    case `2`:
      MOUSEDOWN(document.querySelectorAll(`div[id^=g]`)[1].children[0].children[0]);
      break;
    case `3`:
      document.querySelector(`[type='submit']`).click();
      break;
    }
});

window.focus();
