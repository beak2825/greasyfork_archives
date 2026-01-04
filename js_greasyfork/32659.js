// ==UserScript==
// @name         Alegion - Song Comparison for Copyright Research 2017
// @namespace    https://github.com/Kadauchi
// @version      1.0.4
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://app.alegion.com/worker-portal/mturk/tasks?*
// @include      https://work.alegion.com/worker-portal/mturk/tasks?*
// @downloadURL https://update.greasyfork.org/scripts/32659/Alegion%20-%20Song%20Comparison%20for%20Copyright%20Research%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/32659/Alegion%20-%20Song%20Comparison%20for%20Copyright%20Research%202017.meta.js
// ==/UserScript==

let i = 0, first = true;

function main() {
  preselect();
  keybinds();
}

function choose(val) {
  if (first) {
    first = false;
    scrollAndPlay();
    return;
  }

  document.querySelectorAll(`input[value="${val}"]`)[i ++].click();
  document.querySelectorAll('audio').forEach((audio) => audio.pause());
  scrollAndPlay();
}

function scrollAndPlay() {
  const next =  document.querySelectorAll(`[id^="root_inputData"]`)[i];

  if (next) {
    next.scrollIntoView();
    document.querySelectorAll('audio')[i].play();
  }
}

function keybinds() {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case '1':
        choose('YES');
        break;
      case '2':
        choose('NO');
        break;
      case '3':
      case 'Enter':
        document.querySelector('[type="button"]').click();
        break;
    }
  });
}

function preselect() {
  document.querySelectorAll('input').forEach((input, i) => {
    if (input.value === 'YES' || input.value === 'HIGH') {
      input.click();
    }
  });
}

setTimeout(main, 500);
