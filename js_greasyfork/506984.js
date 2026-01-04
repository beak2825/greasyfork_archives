// ==UserScript==
// @name         Margonem Custom Menu Item with Dynamic Item ID
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Używa przedmiotu o dynamicznym ID po walce w grze Margonem
// @author       YourName
// @match        *://*.margonem.pl/*
// @grant        none
// @license      self
// @downloadURL https://update.greasyfork.org/scripts/506984/Margonem%20Custom%20Menu%20Item%20with%20Dynamic%20Item%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/506984/Margonem%20Custom%20Menu%20Item%20with%20Dynamic%20Item%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedItemId = null;  // Przechowuje dynamicznie wybrany item ID
    const battleInterval = 150;

    let itemUsed = false;
    let battleIntervalId = null;
    let alertShown = false;

    // Funkcja pobierająca status walki
    function getBattleStatus() {
        const battle = window.Engine.battle || {};
        return {
            inBattle: !!battle && !battle.endBattle && battle.show,
            battleEnded: battle.endBattle || false
        };
    }

    // Używanie przedmiotu o zapisanym dynamicznie ID
    function useItem() {
        if (selectedItemId) {
            window._g(`moveitem&st=1&id=${selectedItemId}`);
            itemUsed = true;
            clearInterval(battleIntervalId);
            battleIntervalId = null;
        } else {
            if (!alertShown) {
                window.message("Nie wybrano przedmiotu!");
                alertShown = true;
            }
        }
    }

    // Funkcja sprawdzająca status walki
    function checkBattleStatus() {
        const { inBattle, battleEnded } = getBattleStatus();

        if (inBattle) {
            if (!battleIntervalId) {
                battleIntervalId = setInterval(() => {
                    const { inBattle } = getBattleStatus();
                    if (!inBattle) {
                        clearInterval(battleIntervalId);
                        battleIntervalId = null;
                        useItem();
                    }
                }, battleInterval);
            }
        } else {
            if (battleEnded && !itemUsed) {
                useItem();
            }
        }
    }

    // Funkcja dodająca opcję w menu kontekstowym
    function addCustomMenuItem(menu) {
        if (!document.querySelector('#custom-menu-item')) {
            const newMenuItem = document.createElement('div');
            newMenuItem.id = 'custom-menu-item';
            newMenuItem.className = 'menu-item';
            newMenuItem.textContent = 'Użyj po walce';
            newMenuItem.style.backgroundColor = '#352a52';
            newMenuItem.style.color = 'white';

            newMenuItem.onclick = () => {
                checkBattleStatus();
                const menu = document.querySelector('.popup-menu.show');
                if (menu) {
                    menu.classList.remove('show');
                }
                window.message("Opcja 'Użyj po walce' została aktywowana.");
            };

            menu.prepend(newMenuItem);
        }
    }

    // Obsługa kliknięcia prawym przyciskiem myszy na przedmiot
    const handleItemContextMenu = (event) => {
        const itemId = event.currentTarget.className.match(/item-id-(\d+)/)?.[1];
        if (itemId) {
            selectedItemId = itemId;
            console.log('Wybrano przedmiot o ID:', itemId);
        }
    };

    // Dodanie nasłuchiwaczy do elementów .item
    function observeItems() {
        document.querySelectorAll('.item').forEach(item =>
            item.addEventListener('contextmenu', handleItemContextMenu)
        );
    }

    // Obserwowanie zmian w DOM i dodawanie nasłuchiwaczy
    new MutationObserver(() => observeItems()).observe(document.body, { childList: true, subtree: true });

    // Po załadowaniu strony
    document.addEventListener('DOMContentLoaded', observeItems);

    // Obserwowanie i dodawanie przycisku do menu kontekstowego
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const menu = document.querySelector('.popup-menu.show');
            if (menu) {
                addCustomMenuItem(menu);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
