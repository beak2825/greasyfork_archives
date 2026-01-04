// ==UserScript==
// @name            DarkTube
// @name:ru         DarkTube
// @namespace       darktube
// @version         0.2
// @description     Set dark mode on youtube and turn off autoplay next video
// @description:ru  Устанавливает темный режим на ютюбе и выключает автозапуск следующего видео
// @author          Blank
// @match           https://www.youtube.com/*
// @run-at          document-start
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/399863/DarkTube.user.js
// @updateURL https://update.greasyfork.org/scripts/399863/DarkTube.meta.js
// ==/UserScript==

(function main() {
  'use strict';

  const log = (...args) => console.log(`${GM.info.script.name}:`, ...args);
  log('start');

  // set darkmode and autopay off cookie before page loaded

  const cookiePref = document.cookie.replace(/(?:(?:^|.*;\s*)PREF\s*=\s*([^;]*).*$)|^.*$/, '$1');
  const prefDarkAndAutopay = 'f6=400&f5=30000';
  if (!cookiePref.includes(prefDarkAndAutopay)) {
    document.cookie = `PREF=${cookiePref ? `&${cookiePref}` : ''}${prefDarkAndAutopay};path=/;domain=.youtube.com;max-age=315360000`;
    log('cookie injected');
  }

}());