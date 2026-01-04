// ==UserScript==
// @name         [GC] - Virtupets.net Quest Calculator
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @grant        GM.getValue
// @grant        GM.setValue
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @version      86
// @license      MIT
// @description  Calculate cost of quests using Virtupets API without having to check each item and do mental math. Staff approved script via ticket.
// @author       Cupkait
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/512409/%5BGC%5D%20-%20Virtupetsnet%20Quest%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/512409/%5BGC%5D%20-%20Virtupetsnet%20Quest%20Calculator.meta.js
// ==/UserScript==


if (!localStorage.getItem('scriptAlert-512409')) {
    alert("The Quest Calculator script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-512409', 'true');
}