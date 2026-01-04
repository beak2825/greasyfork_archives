// ==UserScript==
// @name         Agency Auxiliary Destroyer by dez
// @namespace    𝙳𝖊ⵢꓸG_company
// @version      2024-11-07
// @description  Zalgo is coming...
// @author       Dez
// @match        https://drawaria.online/*
// @icon         https://media.tenor.com/ZrLYNP6HJ7YAAAAj/deltarune-knight.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543965/Agency%20Auxiliary%20Destroyer%20by%20dez.user.js
// @updateURL https://update.greasyfork.org/scripts/543965/Agency%20Auxiliary%20Destroyer%20by%20dez.meta.js
// ==/UserScript==
(function() {
'use strict';
setInterval(() => {
const button = document.querySelector('.btn-primary:disabled');
if (button) button.disabled = false;
}, 1);
})();