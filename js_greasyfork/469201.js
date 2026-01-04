// ==UserScript==
// @name         Dancing Purple Ballsack
// @description  Intended only for Xander. It basically adds a crown to anyone named "Purple Ballsack".
// @icon         https://www.blooket.com/improvetools.svg
// @namespace    https://tampermonkey.net/
// @version      1.4
// @author       Generic Human
// @license      Ask for permission in the Greasy Fork comments before copying.
// @match        https://*.blooket.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469201/Dancing%20Purple%20Ballsack.user.js
// @updateURL https://update.greasyfork.org/scripts/469201/Dancing%20Purple%20Ballsack.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var searchText = ['Purple BaIlsack', 'Purple BalIsack', 'Purple Ballsack👑', '👑Purple Ballsack'];
  var replacementText1 = 'Purple Ballsack👑';
  var replacementText2 = '👑Purple Ballsack';
  var intervalId;
  var replaceIndex = 0;

  function checkForText() {
    var textNodes = document.evaluate(
      '//text()[normalize-space(.) != ""]',
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (var i = 0; i < textNodes.snapshotLength; i++) {
      var node = textNodes.snapshotItem(i);
      var text = node.textContent.trim();

      if (searchText.includes(text)) {
        clearInterval(intervalId);
        startChangingText(node);
        break;
      }
    }
  }

  function startChangingText(node) {
    intervalId = setInterval(function() {
      if (replaceIndex % 2 === 0) {
        node.textContent = replacementText1;
      } else {
        node.textContent = replacementText2;
      }
      replaceIndex++;
    }, 250);
  }

  intervalId = setInterval(checkForText, 250);
})();