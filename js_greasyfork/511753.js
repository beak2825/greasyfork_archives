// ==UserScript==
// @name            HoholDetector
// @name:ru         Обнаружитель мовы
// @namespace       Violentmonkey Scripts
// @match           *://*/*
// @grant           none
// @version         1.0
// @author          -
// @description     Helps you detect Ukrainian text
// @description:ru  Помогает в обнаружении украинского языка в тексте
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511753/HoholDetector.user.js
// @updateURL https://update.greasyfork.org/scripts/511753/HoholDetector.meta.js
// ==/UserScript==

const ukrainianSymbols = /[ґєії]/i;

const replaceMovaString = (s) => {
  if (s.includes("🐷") || !ukrainianSymbols.test(s)) {
    return s;
  }

  return `🐷${s}🐷`;
};

const replaceMovaHTML = (element) => {
  element.childNodes.forEach((node) => replaceMovaHTML(node));
  if (element.nodeType == Node.TEXT_NODE) {
    const newValue = replaceMovaString(element.nodeValue);
    if (element.nodeValue !== newValue) {
      element.nodeValue = newValue;
    }
  }
};

const observer = new MutationObserver(
  (mutationList, observer) => {
    for (const mutation of mutationList) {
      switch (mutation.type) {
        case 'childList':
          mutation.addedNodes.forEach(replaceMovaHTML);
          break;
        case 'attributes':
          break;
        case 'characterData':
          replaceMovaHTML(mutation.target);
          break;
        case 'subtree':
          break;
      }
    }
  }
);

observer.observe(document, {
  childList: true,
  // attributes: true,
  characterData: true,
  subtree: true
});

const onLoad = () => {
  replaceMovaHTML(document.getElementsByTagName('html')[0]);
};

window.addEventListener('load', onLoad, false);