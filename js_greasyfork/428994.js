// ==UserScript==
// @name         Yahoo Finance Full Screen Chart
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Makes the Yahoo Finance chart larger
// @match        *.finance.yahoo.com/chart/*
// @match        finance.yahoo.com/chart/*
// @downloadURL https://update.greasyfork.org/scripts/428994/Yahoo%20Finance%20Full%20Screen%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/428994/Yahoo%20Finance%20Full%20Screen%20Chart.meta.js
// ==/UserScript==


setTimeout(() => {
    // maximize chart
    document.querySelector("section > section").style.height="80%"
    // collapse watchlist
    document.querySelector("button[data-reactid='73']").click()
}, 1000)