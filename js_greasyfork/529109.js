// ==UserScript==
// @name         Agency Auxiliary Destroyer A/A/D
// @namespace    Des.G_company
// @version      2024-11-07
// @description  Zalgo is coming...
// @author       Dez x Muda
// @match        https://drawaria.online/*
// @icon         https://media.tenor.com/RmH2Tgg1dAwAAAAM/cherub-biblically-accurate-angel.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529109/Agency%20Auxiliary%20Destroyer%20AAD.user.js
// @updateURL https://update.greasyfork.org/scripts/529109/Agency%20Auxiliary%20Destroyer%20AAD.meta.js
// ==/UserScript==
(function() {
'use strict';
setInterval(() => {
const button = document.querySelector('.btn-primary:disabled');
if (button) button.disabled = false;
}, 1);
})();