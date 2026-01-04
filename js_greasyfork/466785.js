// ==UserScript==
// @name         Speech Synthesis for MonkeyType
// @namespace    http://github.com/mefengl
// @version      0.0.2
// @description  A userscript that uses speech synthesis to read out the words on monkeytype.com. This is helpful for improving typing speed while listening to the words.
// @author       mefengl
// @match        https://monkeytype.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeytype.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466785/Speech%20Synthesis%20for%20MonkeyType.user.js
// @updateURL https://update.greasyfork.org/scripts/466785/Speech%20Synthesis%20for%20MonkeyType.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let lastSpoken = '';

  const targetNode = document.getElementById('words');

  const pollElement = () => {
    const text = targetNode.innerText.replace(/\n/g, ' ');
    if (text !== lastSpoken) {
      if (lastSpoken !== '') {
        speechSynthesis.cancel();
      }
      lastSpoken = text;
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  setInterval(pollElement, 500);
})();
