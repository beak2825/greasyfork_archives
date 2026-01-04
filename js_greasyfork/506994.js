// ==UserScript==
// @name         Use item after a fight
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a custom menu to item after clicking RMC. This extends the menu with "Use after a fight" button.
// @author       Satiel
// @match        *://*.margonem.pl/*
// @grant        none
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/506994/Use%20item%20after%20a%20fight.user.js
// @updateURL https://update.greasyfork.org/scripts/506994/Use%20item%20after%20a%20fight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedItemId = null;
    let battleIntervalId = null;
    const INTERVAL_DELAY = 100; // Interval for checking fight status

    function getBattleStatus() {
        const battle = window.Engine.battle || {};
        return !!battle && !battle.endBattle && battle.show;
    }

    function useItem() {
        if (selectedItemId) {
            window._g(`moveitem&st=1&id=${selectedItemId}`);
        }
    }

    //Check fight status
    function checkBattleStatus() {
        if (getBattleStatus()) {
            window.message("Przedmiot zostanie użyty po walce");
            if (!battleIntervalId) {
                battleIntervalId = setInterval(() => {
                    if (!getBattleStatus()) {
                        clearInterval(battleIntervalId);
                        battleIntervalId = null;
                        useItem();
                    }
                }, INTERVAL_DELAY);
            }
        } else {
            window.message("Nie jesteś w walce!");
        }
    }

    //Cutom menu with new button
    function addCustomMenuItem(menu) {
        if (!document.querySelector('#custom-menu-item')) {
            const newMenuItem = document.createElement('div');
            newMenuItem.id = 'custom-menu-item';
            newMenuItem.className = 'menu-item';
            newMenuItem.textContent = 'Użyj po walce';
            newMenuItem.style.backgroundColor = '#352a52';
            newMenuItem.style.color = 'white';
            newMenuItem.style.cursor = 'pointer';

            newMenuItem.onclick = () => {
                checkBattleStatus();
                menu.classList.remove('show');
            };

            menu.prepend(newMenuItem);
        }
    }

    function handleItemContextMenu(event) {
        event.preventDefault();

        const itemIdMatch = event.currentTarget.className.match(/item-id-(\d+)/);
        if (itemIdMatch) {
            selectedItemId = itemIdMatch[1];
            const menu = document.querySelector('.popup-menu.show');
            if (menu) {
                addCustomMenuItem(menu);
            }
        }
    }

    //Event listener
    function observeItems() {
        document.querySelectorAll('.inventory-item').forEach(item => {
            if (!item.dataset.listenerAdded) {
                item.addEventListener('contextmenu', handleItemContextMenu);
                item.dataset.listenerAdded = 'true';
            }
        });
    }

    //Dom Observer
    new MutationObserver(observeItems).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', observeItems);

})();
