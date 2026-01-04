// ==UserScript==
// @name         Store Opener
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Permanent Shop Opener!
// @author       AxxlJGR
// @match        https://tankionline.com
// @icon         https://cdn.discordapp.com/attachments/782975004065136710/985329244039180348/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446382/Store%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/446382/Store%20Opener.meta.js
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
  }, 10);
}