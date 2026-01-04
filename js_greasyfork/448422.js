// ==UserScript==
// @name         Navigator.getGamepads Polyfill
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @version      1.0.0
// @description  Navigator.getGamepads Polyfill for gamepad-tester.com
// @author       pana
// @match        *://gamepad-tester.com/*
// @icon         https://icons.duckduckgo.com/ip2/gamepad-tester.com.ico
// @run-at       document-start
// @compatible   chrome version < 99
// @license      GNU General Public License v3.0 or later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448422/NavigatorgetGamepads%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/448422/NavigatorgetGamepads%20Polyfill.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const oriGamepads = navigator.getGamepads.bind(navigator);
  navigator.getGamepads = () => {
    const gameTemp = oriGamepads.call() || {};
    let res = [];
    if (Array.isArray(gameTemp)) {
      res = gameTemp;
    } else {
      res = Array.from(gameTemp);
    }
    return res;
  };
})();
