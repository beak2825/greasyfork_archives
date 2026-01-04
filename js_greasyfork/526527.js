// ==UserScript==
// @name        Timelog Color Invert (DBC Edition)
// @namespace   Violentmonkey Scripts
// @match       https://app.timelog.com/Registration/*
// @grant       none
// @version     1.0
// @author      Christina Sørensen
// @description 2/11/2025, 9:14:35 AM
// @license EUPL-1.2
// @downloadURL https://update.greasyfork.org/scripts/526527/Timelog%20Color%20Invert%20%28DBC%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526527/Timelog%20Color%20Invert%20%28DBC%20Edition%29.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", () => {document.body.style.filter = "invert(1)";});
