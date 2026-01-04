// ==UserScript==
// @name         Show Inventories
// @namespace    github.com/matt-rj
// @version      1.0
// @description  Open all premium search item owners' backpacks with one button.
// @author       MAtt-RJ
// @match        https://backpack.tf/premium/search*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/425058/Show%20Inventories.user.js
// @updateURL https://update.greasyfork.org/scripts/425058/Show%20Inventories.meta.js
// ==/UserScript==

const openAllInventories = () => {
    document.querySelectorAll('.description > .buttons > .btn:first-of-type').forEach(button => {
        GM_openInTab('http://www.backpack.tf' + button.getAttribute('href'));
    });
};

const createButton = () => {
    const button = document.createElement('button');
    button.innerHTML = 'Open all BPs (' + document.querySelectorAll('.description > .buttons > .btn:first-of-type').length + ' tabs!)';
    button.className = 'btn btn-block btn-lg';
    button.style['background-color'] = '#664580';
    button.style['border-color'] = '#593c6f';
    button.style['color'] = '#fff';
    button.addEventListener('click', openAllInventories);
    document.querySelector('.premium-search-form').appendChild(button);
}

(function() {
    'use strict';
    createButton();
})();