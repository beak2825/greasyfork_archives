// ==UserScript==
// @name         StratumsShop++
// @version      0.1.2
// @description  Stratums.io Shop++
// @author       Tornamic
// @match        https://stratums.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/944755
// @downloadURL https://update.greasyfork.org/scripts/449232/StratumsShop%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/449232/StratumsShop%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var shopMenu = document.querySelector('#a085ff0ed692f59e3');
    var hatStoreSel = document.querySelector('#hatStoreSel');
    var accStoreSel = document.querySelector('#accStoreSel');
    var descItems = document.querySelector('#a1154c5b99c5dd57d');
    descItems.style.opacity = '0.0';
    descItems.style.position = 'none';
    shopMenu.style.height = '375px';
    hatStoreSel.style.backgroundColor = 'rgba(0, 0, 0, 0.07)';
    accStoreSel.style.backgroundColor = 'rgba(0, 0, 0, 0.07)';
    shopMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.07)';
    hatStoreSel.textContent = 'by';
    accStoreSel.textContent = 'Tornamic';
})();

window.addEventListener('keydown', (e) => {
    if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
    }
});