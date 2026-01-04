// ==UserScript==
// @name         Page Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      GNU AGPLv3
// @description  Removes links, images, and text which refer to specific keywords. When a keyword is found in an URL of a link or image, the link/image will be removed. When a keyword is found in a text, the whole text in its container element, will be removed.
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377328/Page%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/377328/Page%20Filter.meta.js
// ==/UserScript==

(function() {

  //*** CONFIGURATION BEGIN ***

  //Below regular expression will be compared against URLs and text.
  //Put anything there to remove them from the page.
  var rx = /\b(removeme|deleteme)\b/gi;

  //*** CONFIGURATION END ***

  function processElement(node, url, nextNode, styles) {
    if (rx.test(node.href || node.src) || ((styles = getComputedStyle(node)) && rx.test(styles.backgroundImage))) {
      if (rx.test(node.parentNode.textContent)) {
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
        if (rx.test(node.nodeValue)) node.nodeValue = "";
        break;
    }
  }

  processNode(document.body);

  (new MutationObserver(function(records) {
    records.forEach(function(record) {
      if (record.type === "characterData") {
        if (rx.test(record.target.nodeValue)) record.target.nodeValue = "";
      } else record.addedNodes.forEach(processNode);
    });
  })).observe(document.body, {childList: true, characterData: true, subtree: true});
})();
