// ==UserScript==
// @name         HeroesWM - Replace the chat button on the inventory
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Заменяет кнопку чата на кнопку инвентаря в шапке HeroesWM
// @author       omni
// @match        https://www.heroeswm.ru/*
// @match        https://heroeswm.ru/*
// @match        https://mirror.heroeswm.ru/*
// @match        https://my.lordswm.com/*
// @match        https://www.lordswm.com/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547358/HeroesWM%20-%20Replace%20the%20chat%20button%20on%20the%20inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/547358/HeroesWM%20-%20Replace%20the%20chat%20button%20on%20the%20inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const menuPanel = document.querySelector('.sh_MenuPanel');
        if (!menuPanel) return;

        const chatButton = document.querySelector('.mm_item a[href="frames.php"]');
        if (!chatButton) return;

        const chatItem = chatButton.closest('.mm_item');
        if (!chatItem) return;

        const inventoryItem = chatItem.cloneNode(true);
        const inventoryLink = inventoryItem.querySelector('a');
        inventoryLink.href = 'inventory.php';
        inventoryLink.removeAttribute('target');

        const inventoryImg = inventoryItem.querySelector('img');
        inventoryImg.src = 'https://dcdn.heroeswm.ru/i/mobile_view/icons/_panelInventory.png';
        inventoryImg.alt = 'Инвентарь';

        const insideDiv = inventoryItem.querySelector('.mm_item_inside');
        insideDiv.id = 'MenuInventory';
        insideDiv.setAttribute('hwm_label', 'Инвентарь');

        chatItem.remove();

        const menuItems = menuPanel.querySelectorAll('.mm_item');
        if (menuItems.length >= 6) {
            menuItems[6].after(inventoryItem);
        } else {
            menuPanel.insertBefore(inventoryItem, menuPanel.firstChild);
        }
    }
})();