
// ==UserScript==
// @name         Truffle TV Channel Points Claimer
// @namespace    https://greasyfork.org/users/649
// @version      3.0
// @description  Auto claim point on Truffle TV enabled streams.
// @author       Adrien Pyke
// @match        *://new.ludwig.social/channel-points
// @match        *://*.spore.build/component-instance/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439389/Truffle%20TV%20Channel%20Points%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/439389/Truffle%20TV%20Channel%20Points%20Claimer.meta.js
// ==/UserScript==

(() => {
  'use strict';

  setInterval(() => {
    const root = document.getElementById('root');
    const shadowRoot = root && root.firstChild.shadowRoot;
    const node = shadowRoot
      ? shadowRoot.querySelector('.claim')
      : document.querySelector('.claim.is-visible');
    if (node) node.click();
  }, 1000);
})();
