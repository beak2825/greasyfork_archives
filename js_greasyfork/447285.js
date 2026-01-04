// ==UserScript==
// @name         Ruanyifeng No Block AdBlock
// @namespace    https://www.ruanyifeng.com/
// @version      0.1
// @description  防止阮一峰博客屏蔽AdBlock
// @author       You
// @match        https://www.ruanyifeng.com/*
// @icon         https://ruanyifeng.com/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/447285/Ruanyifeng%20No%20Block%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/447285/Ruanyifeng%20No%20Block%20AdBlock.meta.js
// ==/UserScript==

window.getComputedStyle = function() { return { "display": "block" }; }
