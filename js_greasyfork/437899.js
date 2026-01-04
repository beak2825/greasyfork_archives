// ==UserScript==
// @name         Notion.so DOMLock bypass
// @description  Disable notion.so DOMLock, which prevents DOM modification from extensions.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Sophie Saiada (sophies.dev)
// @license MIT
// @include      https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437899/Notionso%20DOMLock%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/437899/Notionso%20DOMLock%20bypass.meta.js
// ==/UserScript==

(function () {
  const lockAfterRenderRegex =
    /\W+at [a-zA-Z]+\.lockAfterRender \(https:\/\/www.notion.so\/app/;
  // eslint-disable-next-line no-proto
  const mutationObserverPrototype = MutationObserver.prototype;
  const originalObserve = mutationObserverPrototype.observe;
  mutationObserverPrototype.observe = function () {
    const stackLines = new Error().stack.split("\n");
    if (
      stackLines.some(function (line) {
        return line.match(lockAfterRenderRegex) !== null;
      })
    ) {
      return;
    }
    originalObserve.call(this, ...arguments);
  };
})();
