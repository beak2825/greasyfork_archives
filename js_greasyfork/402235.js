// ==UserScript==
// @name         Durian : Detect Zawgyi and convert it to Unicode
// @description  Durian is a userscript which detects Zawgyi texts in a webpage and convert them into Unicode compatible texts so that Unicode users can read texts written with Zawgyi.
// @namespace    https://github.com/purinpurin/Durian
// @version      1.0.0
// @author       Purin <acclotepho@gmail.com>
// @license      MIT
// @include        *
// @icon         data:image/png;base64,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
// @installURl   https://raw.githubusercontent.com/purinpurin/Durian/master/userscript/release/durian.user.js
// @require      https://ajax.googleapis.com/ajax/libs/myanmar-tools/1.1.3/zawgyi_detector.js
// @require      https://ajax.googleapis.com/ajax/libs/myanmar-tools/1.1.3/zawgyi_converter.js
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/402235/Durian%20%3A%20Detect%20Zawgyi%20and%20convert%20it%20to%20Unicode.user.js
// @updateURL https://update.greasyfork.org/scripts/402235/Durian%20%3A%20Detect%20Zawgyi%20and%20convert%20it%20to%20Unicode.meta.js
// ==/UserScript==

(function() {

    "use strict";

var detector = new google_myanmar_tools.ZawgyiDetector();
var converter = new google_myanmar_tools.ZawgyiConverter();
/** 
 * Check the probablity of the input text being Zawgyi.
 * Treshold is 0.95
 * @param   {string} text     - Input text
 * @return          
 */

function isZawgyi(text) {
  if (text) return detector.getZawgyiProbability(text) > 0.95;else return false;
}
/**
 * Replace Zawgyi texts with Unicode texts.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the emoji substitution is done inline.
 */


function replaceText(node) {
  var content = node.textContent;

  if (isZawgyi(content)) {
    node.textContent = converter.zawgyiToUnicode(content);
  }
}
/**
 * Get all text nodes under given element.
 * @param {Element} element         - Parent element that we want to filter for text nodes.
 * @returns {Node}                  - Text nodes
 */


function getTextNodesUnder(element) {
  var node,
      textNodes = [],
      walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

  while (node = walk.nextNode()) {
    textNodes.push(node);
  }

  return textNodes;
}
/**
 * Look for Zawgyi font in the page
 * @returns {Boolean}   - If found return true else false
 */


function isZawgyiFontLoaded() {
  var isLoaded = false;
  document.fonts.forEach(function (font) {
    if (/.*zawgyi.*/i.test(font.family)) isLoaded = true;
  });
  return isLoaded;
} // Wait until all fonts are loaded before looking for Zawgyi


document.fonts.ready.then(function () {
  // We only need to convert if the page is not using Zawgyi webfont
  if (!isZawgyiFontLoaded()) {
    var textNodesUnderBody = getTextNodesUnder(document.body);
    textNodesUnderBody.forEach(function (textNode) {
      replaceText(textNode);
    }); // Monitor for new nodes

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function (newNode) {
            var textNodes = getTextNodesUnder(newNode);
            textNodes.forEach(function (textNode) {
              replaceText(textNode);
            });
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

})();