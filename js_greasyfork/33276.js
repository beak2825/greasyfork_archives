// ==UserScript==
// @name         Dailymotion disable autoplay
// @namespace    https://greasyfork.org/users/649
// @version      1.1.4
// @description  Disables autoplay and auto next vid on dailymotion
// @author       Adrien Pyke
// @match        *://www.dailymotion.com/video/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/33276/Dailymotion%20disable%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/33276/Dailymotion%20disable%20autoplay.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Util = {
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    }
  };

  waitForElems({
    sel: 'body.has-skyscraper',
    stop: true,
    context: document,
    onmatch() {
      Util.q('.dmp_PlaybackButton').click();
    }
  });

  waitForElems({
    sel: '.dmp_ComingUpEndScreen:not(.dmp_is-hidden) .dmp_ComingUpEndScreen-cancel',
    stop: true,
    onmatch(cancel) {
      cancel.click();
    }
  });
})();
