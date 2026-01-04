// ==UserScript==
// @name         HLTV Forum Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Forums from the front page
// @match        https://www.hltv.org/*
// @downloadURL https://update.greasyfork.org/scripts/389720/HLTV%20Forum%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/389720/HLTV%20Forum%20Remover.meta.js
// ==/UserScript==

document.getElementsByClassName('right2Col')[0].remove()