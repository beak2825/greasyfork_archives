// ==UserScript==
// @name         Filter Out Rotten Tomatoes
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @license      GNU AGPLv3
// @description  Removes links, images, and text which refer to Rotten Tomatoes or its rottentomatoes.com website, on any website.
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371839/Filter%20Out%20Rotten%20Tomatoes.user.js
// @updateURL https://update.greasyfork.org/scripts/371839/Filter%20Out%20Rotten%20Tomatoes.meta.js
// ==/UserScript==

(function() {
  var
    rxText   = /\bRT\b.*?\d+%|\d+%.*?\bRT\b|rotten\W?tomatoes|(?:https?:\/\/)?(?:[a-z][a-z0-9-]*?\.)?rottentomatoes\.com[^,. ]+/gi,
    rxPercent= /\d+(?:\.\d+)?%/gi,
    rxDomain = /(?:[a-z][a-z0-9-]*?\.)?rottentomatoes\.com/i;

  function processElement(node, url, nextNode, styles) {
    if (rxDomain.test(node.href) || rxDomain.test(node.src) || ((styles = getComputedStyle(node)) && rxText.test(styles.backgroundImage))) {
      if (rxPercent.test(node.parentNode.textContent)) {
        node.parentNode.innerHTML = "";
      } else node.remove();
    } else {
      for (node = node.childNodes[0]; node; node = nextNode) {
        nextNode = node.nextSibling;
        processNode(node);
      }
    }
  }

  function processNode(node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        processElement(node);
        break;
      case Node.TEXT_NODE:
        if (rxText.test(node.nodeValue) && rxPercent.test(node.parentNode.textContent)) {
          node.parentNode.innerHTML = "";
        } else node.nodeValue = node.nodeValue.replace(rxText, "");
        break;
    }
  }

  processNode(document.body);

  (new MutationObserver(function(records) {
    records.forEach(function(record) {
      if (record.type === "characterData") {
        if (rxText.test(record.target.nodeValue)) record.target.nodeValue = record.target.nodeValue.replace(rxText, "");
      } else record.addedNodes.forEach(processNode);
    });
  })).observe(document.body, {childList: true, characterData: true, subtree: true});
})();
