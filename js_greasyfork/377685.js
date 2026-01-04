// ==UserScript==
// @name         Avanza tidy and keepalive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tigther table style on Avanza and never get logged out!
// @author       You
// @match        https://www.avanza.se/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377685/Avanza%20tidy%20and%20keepalive.user.js
// @updateURL https://update.greasyfork.org/scripts/377685/Avanza%20tidy%20and%20keepalive.meta.js
// ==/UserScript==

setInterval(function() {
    window.location.reload();
}, 3600000);

GM_addStyle(".tableV2 thead {background-color: #fafafa;}.tableV2 thead th {font-weight: bold;}.tableV2 td {padding: 0.25rem;} .componentBottomToolbar.tableV2 a::after {padding-left: 0.25rem;content: '\00bb';}");