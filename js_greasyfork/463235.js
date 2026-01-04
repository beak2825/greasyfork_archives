// ==UserScript==
// @name         budgetspelenweg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  weg met de budgetspelen-link
// @author       UltraTiger
// @match        https://www.budgetgaming.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=budgetgaming.nl
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463235/budgetspelenweg.user.js
// @updateURL https://update.greasyfork.org/scripts/463235/budgetspelenweg.meta.js
// ==/UserScript==

var deletelogo = document.getElementById('spelenlogo');
if (deletelogo) { deletelogo.parentNode.removeChild(deletelogo); }