// ==UserScript==
// @name        3:3
// @namespace   Violentmonkey Scripts
// @match       http*://*/*
// @grant       none
// @version     0.1.1
// @run-at      document-start
// @author      -
// @description 1:1? more like 3:3
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494771/3%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/494771/3%3A3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const replaceOnDocument = (pattern, string, {target = document.body} = {}) => {
    [
      target,
      ...target.querySelectorAll("*:not(script):not(noscript):not(style)")
    ].forEach(({childNodes: [...nodes]}) => nodes
      .filter(({nodeType}) => nodeType === Node.TEXT_NODE)
      .forEach((textNode) => textNode.textContent = textNode.textContent.replace(pattern, string)));
  };


  window.setInterval(function() {
      replaceOnDocument(/(?<begin>\D?)(1:1)(?<end>\D?)/g, '$<begin>3:3$<end>');
    }, 1000 * 3)

})();