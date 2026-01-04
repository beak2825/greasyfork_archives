// ==UserScript==
// @name         Bookwalker Zoom Auto
// @namespace   Bookwalker Zoom Auto
// @version      0.15
// @description  自動にズーム
// @author       Aporiz
// @match        https://viewer-trial.bookwalker.jp/*
// @match        https://viewer.bookwalker.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookwalker.jp
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/459340/Bookwalker%20Zoom%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/459340/Bookwalker%20Zoom%20Auto.meta.js
// ==/UserScript==

GM_addStyle ( `
canvas {
  width: 500px !important;
  height-max: 1000px !important;
  height: 1000px !important;
  position: absolute !important;
top: -140px !important;
}

` );

