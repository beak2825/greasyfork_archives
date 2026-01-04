// ==UserScript==
// @name         [GC] - Stock Enhancements
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/games/stockmarket/portfolio/*
// @match        https://www.grundos.cafe/games/stockmarket/stocks/*
// @version      86
// @license      MIT
// @description  Sort stocks listed on the portfolio page in descending order by percentage with highest profit percentages first. Original highlight script by Shalane., edited for compatibility after CSS changes.
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/510368/%5BGC%5D%20-%20Stock%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/510368/%5BGC%5D%20-%20Stock%20Enhancements.meta.js
// ==/UserScript==



if (!localStorage.getItem('scriptAlert-510368')) {
    alert("Stock Enhancements script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-510368', 'true');
}