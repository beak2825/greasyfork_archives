// ==UserScript==
// @name         Tanki Online Store Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A hands off tool to keep the store opened in the tanki online test servers
// @author       0xE3
// @match        https://*.test-eu.tankionline.com/*
// @icon         https://www.google.com/s2/favicons?domain=tankionline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425826/Tanki%20Online%20Store%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/425826/Tanki%20Online%20Store%20Opener.meta.js
// ==/UserScript==

const root = document.getElementById('root');

const startupLoop = () => {
  try {
    init(root._reactRootContainer._internalRoot.current.memoizedState.element.type.prototype.store)
  } catch (e) {
    requestAnimationFrame(() => startupLoop());
  }
}

startupLoop();

const init = (store) => {
  setInterval(() => {
    store.state.shop.enabled = true;
  }, 100);
}