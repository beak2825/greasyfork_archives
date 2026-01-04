// ==UserScript==
// @name            ZOVspeak
// @name:ru         ZOVspeak
// @namespace       Violentmonkey Scripts
// @match           *://*/*
// @grant           none
// @version         1.0
// @author          -
// @description     Makes every webpage go full ZOV
// @description:ru  Этот скрипт сделает любую веб-страницу чуточку уютнее и роднее, если Vы пOнимаете, O чём я.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480489/ZOVspeak.user.js
// @updateURL https://update.greasyfork.org/scripts/480489/ZOVspeak.meta.js
// ==/UserScript==

const replaceZOVString = (s) => {
  return s
    .replace(/[Зз]/g, 'Z')
    .replace(/[Вв]/g, 'V')
    .replace(/[Оо]/g, 'O');
}

const replaceZOVHTML = (element) => {
  element.childNodes.forEach((node) => replaceZOVHTML(node));
  if (element.nodeType == Node.TEXT_NODE) {
    const newValue = replaceZOVString(element.nodeValue);
    if (element.nodeValue !== newValue) {
      element.nodeValue = newValue;
    }
  }
}

const observer = new MutationObserver(
  (mutationList, observer) => {
    for (const mutation of mutationList) {
      switch (mutation.type) {
        case 'childList':
          mutation.addedNodes.forEach(replaceZOVHTML);
          break;
        case 'attributes':
          break;
        case 'characterData':
          replaceZOVHTML(mutation.target);
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
  replaceZOVHTML(document.getElementsByTagName('html')[0]);
}

window.addEventListener('load', onLoad, false);