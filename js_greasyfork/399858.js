// ==UserScript==
// @name            Make Anilibria Great Again
// @name:ru         Make Anilibria Great Again
// @namespace       makeAnilibriaGreatAgain
// @version         0.2
// @description     Returns missing videos
// @description:ru  Возвращает пропавшие видео
// @author          Blank
// @match           *://*.anilibria.tv/*
// @run-at          document-end
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/399858/Make%20Anilibria%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/399858/Make%20Anilibria%20Great%20Again.meta.js
// ==/UserScript==

(function main() {
  'use strict';

  const log = (...args) => console.log(`${GM.info.script.name}:`, ...args);
  log('start');

  if (document.querySelector('#anilibriaPlayer') === null) {
    const posterSrc = document.querySelector('#adminPoster').src;
    const animeId = posterSrc.substring(posterSrc.lastIndexOf('/') + 1, posterSrc.lastIndexOf('.'));
    const tabSwitcher = document.querySelector('.tab-switcher');
    tabSwitcher.innerHTML = '<div class="tab-content"> <button>Make Anilibria Great Again</button> <button data-light="" class="xdark z-fix" style="background: transparent;">Свет</button> <div class="block_fix"></div></div>';
    tabSwitcher.insertAdjacentHTML('afterend', `<div class="z-fix"><iframe src="https://www.anilibria.tv/public/iframe.php?id=${animeId}" width="840" height="515" allow="fullscreen"></iframe></div>`);
  }
}());
