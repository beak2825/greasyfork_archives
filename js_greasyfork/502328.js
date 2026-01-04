// ==UserScript==
// @name         Remove temporary elements For SingleFile.
// @version      0.0.1
// @description  Remove temporary elements added by browser extensions.
// @author       fengqi
// @license      MIT
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/745108
// @downloadURL https://update.greasyfork.org/scripts/502328/Remove%20temporary%20elements%20For%20SingleFile.user.js
// @updateURL https://update.greasyfork.org/scripts/502328/Remove%20temporary%20elements%20For%20SingleFile.meta.js
// ==/UserScript==

(() => {
  const elements = new Map();
  const keys = ["__hcfy__", "immersive-translate-popup"];

  dispatchEvent(new CustomEvent("single-file-user-script-init"));

  addEventListener("single-file-on-before-capture-request", () => {
    Array.from(keys).forEach((item, index) => {
      var element = document.getElementById(item)
      var placeHolderElement = document.createElement(element.tagName);

      elements.set(placeHolderElement, element);
      element.parentElement.replaceChild(placeHolderElement, element);
    });
  });

  addEventListener("single-file-on-after-capture-request", () => {
    Array.from(elements).forEach(([placeHolderElement, element]) => {
      placeHolderElement.parentElement.replaceChild(element, placeHolderElement);
    });
    elements.clear();
  });

})();