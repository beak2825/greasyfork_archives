// ==UserScript==
// @name         Toggle Parent Checkbox for Russia
// @namespace    https://dodopizza.design-terminal.io
// @version      1.1
// @description  Waits for the "Russia 🇷🇺" container to appear and toggles the parent checkbox if necessary.
// @author       YourName
// @match        https://dodopizza.design-terminal.io/admin/packs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531698/Toggle%20Parent%20Checkbox%20for%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/531698/Toggle%20Parent%20Checkbox%20for%20Russia.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (window.location.hash === "#ToggleRussia") {
        console.log("Хеш #ToggleRussia найден. Выполняем действия...");

        function toggleRussiaCheckbox() {
            const russiaGroup = Array.from(document.querySelectorAll(".branch-checkbox-groups__group")).find((group) => {
                const summary = group.querySelector("summary");
                return summary && summary.textContent.trim() === "Russia 🇷🇺";
            });

            if (russiaGroup) {
                console.log('Группа "Russia 🇷🇺" найдена.');

                const parentCheckbox = russiaGroup.querySelector('input[type="checkbox"]');
                if (parentCheckbox) {
                    console.log("Общий чекбокс найден.");
                    const checkedChildCheckboxes = russiaGroup.querySelectorAll('details label input[type="checkbox"][checked]');

                    if (checkedChildCheckboxes.length > 0 && !parentCheckbox.checked) {
                        console.log(`Найдено ${checkedChildCheckboxes.length} отмеченных дочерних чекбоксов. Переключаем родительский чекбокс.`);
                        parentCheckbox.click();
                        parentCheckbox.click();
                        parentCheckbox.click();

                        const updateButton = Array.from(document.querySelectorAll('button[type="submit"]')).find((button) => button.textContent.trim() === "Update");
                        if (updateButton) {
                            console.log('Кнопка "Update" найдена. Нажимаем на неё...');
                            updateButton.click();
                        }
                    }
                }
                clearInterval(checkInterval);
            } else {
                console.log('Группа "Russia 🇷🇺" пока не найдена, продолжаем искать...');
            }
        }

        let checkInterval = setInterval(toggleRussiaCheckbox, 500);
    } else {
        console.log("Хеш #ToggleRussia не найден.");
    }
})();
