// ==UserScript==
// @name         Comikey Fit
// @namespace    https://greasyfork.org/scripts/438970-comikey-fit
// @version      1.0
// @description  Fit Comikey single page view
// @author       Australis
// @match        https://comikey.com/read/*
// @icon         https://www.google.com/s2/favicons?domain=comikey.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438970/Comikey%20Fit.user.js
// @updateURL https://update.greasyfork.org/scripts/438970/Comikey%20Fit.meta.js
// ==/UserScript==

GM_addStyle(`.single div div {height: auto !important; width: 100vw !important; text-align: center;}
.single div div canvas {display: inline; min-width: 100vw; height: auto;}`)