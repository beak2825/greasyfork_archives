// ==UserScript==
// @name         Genshin Cloud Mouse Fix
// @namespace    https://www.bilibili.com/read/cv26576757/
// @version      0.1
// @description  Fix a Genshin cloud game mouse move bug
// @match        https://ys.mihoyo.com/cloud/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502400/Genshin%20Cloud%20Mouse%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/502400/Genshin%20Cloud%20Mouse%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const origin = HTMLElement.prototype.requestPointerLock
  HTMLElement.prototype.requestPointerLock = function () {
    return origin.call(this)
  }
})();
