// ==UserScript==
// @name         ULR multilingual support
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Add multilingual support to ULR on DMM in the game's option
// @author       Me
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529785/ULR%20multilingual%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/529785/ULR%20multilingual%20support.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitOptionScene() {
    const intervalID = setInterval(() => {
      const option = window.game?.scene?.keys?.Option
      if (option) {
        option.constructor.LANGUAGE = [
          { text: '日本語', value: 'ja' },
          { text: 'English', value: 'en' },
          { text: '한국어', value: 'kr' },
          { text: '简体中文', value: 'scn' },
          { text: '繁體中文', value: 'tcn' }
        ];
        clearInterval(intervalID);
      }
    }, 100);
  }
  waitOptionScene()
})();