// ==UserScript==
// @name         Forgejo owner search support
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Support search owners while creating repos on Forgejo/Gogs pages.
// @author       Scruel Tao
// @match        http*://*/repo/create
// @match        http*://*/repo/migrate*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470516/Forgejo%20owner%20search%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/470516/Forgejo%20owner%20search%20support.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if (document.querySelector('footer').textContent.indexOf('Powered by Gitea') !== -1) {
        alert('Gitea is a commercial project and has the worst open-source community now, use Forgejo instead.');
        return;
    }
    const ownerMenuElement = document.querySelector('div.ui.selection.owner.dropdown div.menu');
    const itemElements = Array.from(ownerMenuElement.querySelectorAll('div.item'));
    const inputElement = document.createElement('input');
    inputElement.setAttribute("type", "search");
    inputElement.setAttribute("placeholder", "Search...");
    inputElement.setAttribute("aria-label", "Search");
    inputElement.style.setProperty("width", "100%", "important");
    inputElement.style.setProperty("position", "sticky");
    inputElement.style.setProperty("top", "0");
    inputElement.style.setProperty("z-index", "16");
    ownerMenuElement.prepend(inputElement);

    function filterItems() {
        itemElements.forEach(item => {
            const itemText = item.innerText.trim().toLowerCase();
            if (itemText.indexOf(inputElement.value) == -1) {
                item.style.setProperty("display", "none", "important");
                return;
            }
            item.style.removeProperty("display");
        });
    }

    inputElement.onkeydown = (e) => {
        e.stopPropagation();
        return true;
    }
    inputElement.addEventListener('input', filterItems);
})();