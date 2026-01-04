// ==UserScript==
// @name        Enable PDF downloads - mocbay.com
// @namespace   https://github.com/florensie
// @include     https://mocbay.com/*
// @grant       none
// @version     1.0
// @author      Florens Pauwels
// @description Enables downloading of PDFs on Mocbay
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470968/Enable%20PDF%20downloads%20-%20mocbaycom.user.js
// @updateURL https://update.greasyfork.org/scripts/470968/Enable%20PDF%20downloads%20-%20mocbaycom.meta.js
// ==/UserScript==

jQuery(".pdfemb-viewer").data("download", "on")
