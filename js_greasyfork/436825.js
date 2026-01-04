// ==UserScript==
// @name         PR Helper for Workplace
// @namespace    https://github.com/Hephaest/helper-scripts
// @version      1.0
// @description  Pre-filled PR info in Workplace
// @author       Hephaest
// @icon         https://avatars.githubusercontent.com/u/37981444?v=4
// @match        https://www.workplace.com/
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/436825/PR%20Helper%20for%20Workplace.user.js
// @updateURL https://update.greasyfork.org/scripts/436825/PR%20Helper%20for%20Workplace.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var whiteList = [];
  var messageDivElement = null;
  var dataTransfer = new DataTransfer();

  var timer = setInterval(function () {
    messageDivElement = document.querySelector('div[contenteditable]');
    if (!messageDivElement || messageDivElement.onkeyup) return;
    messageDivElement.onkeyup = setUpMessageListener;
  }, 3000);

  function setUpMessageListener(event) {
    var input = event.target.innerText;
    if (!isInWhiteList() || !hasPRCmdTriggered(input)) return;
    setUpPRTemplate(event);
    //clearInterval(timer);
  }

  function isInWhiteList() {
    var pathname = window.location.pathname;
    var regex = /\/chat\/t\//gm;
    var chatId = pathname.replace(regex, '');
    var result = whiteList.includes(chatId);
    return result;
  }

  function hasPRCmdTriggered(input) {
    return input === 'PRT' || input === 'prt';
  }

  function setUpPRTemplate(event) {
    var templateText =
      ':\n' +
      'PR:\n' +
      'ChangeLog:\n' +
      'Reviewers:\n' +
      '辛苦各位有空的时候帮忙看一下🙏';
    dispatchPaste(event.target, templateText);
  }

  function dispatchPaste(target, text) {
    dataTransfer.setData('text/plain', text);

    target.dispatchEvent(
      new ClipboardEvent('paste', {
        clipboardData: dataTransfer,
        // need these for the event to reach Draft paste handler
        bubbles: true,
        cancelable: true,
      })
    );

    // clear DataTransfer Data
    dataTransfer.clearData();
  }
})();