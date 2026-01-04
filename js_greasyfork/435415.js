// ==UserScript==
// @name         Synology Router — Enable text selection
// @description  Enable text selection in Synology SRM (router).
// @author       Rafal Enden
// @namespace    https://github.com/rafenden
// @homepageURL  https://github.com/rafenden/userscripts/blob/master/synology-router-text-selection
// @supportURL   https://github.com/rafenden/userscripts/issues
// @license      MIT
// @version      1.0
// @match        *://*/webman/index.cgi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435415/Synology%20Router%20%E2%80%94%20Enable%20text%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/435415/Synology%20Router%20%E2%80%94%20Enable%20text%20selection.meta.js
// ==/UserScript==

'use strict'

document.querySelector('body').style.userSelect = 'text'
