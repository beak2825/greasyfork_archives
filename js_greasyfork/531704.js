// ==UserScript==
// @name         Toggle Parent Checkbox for Kazakhstan
// @namespace    https://dodopizza.design-terminal.io
// @version      1.1
// @description  Waits for the "Kazakhstan 🇰🇿" container to appear and toggles the parent checkbox if necessary.
// @author       YourName
// @match        https://dodopizza.design-terminal.io/admin/packs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531704/Toggle%20Parent%20Checkbox%20for%20Kazakhstan.user.js
// @updateURL https://update.greasyfork.org/scripts/531704/Toggle%20Parent%20Checkbox%20for%20Kazakhstan.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (window.location.hash === "#ToggleKazakhstan") {
        console.log("Хеш #ToggleKazakhstan найден. Выполняем действия...");

        function toggleKazakhstanCheckbox() {
            const kazakhstanGroup = Array.from(document.querySelectorAll(".branch-checkbox-groups__group")).find((group) => {
                const summary = group.querySelector("summary");
                return summary && summary.textContent.trim() === "Kazakhstan 🇰🇿";
            });

            if (kazakhstanGroup) {
                console.log('Группа "Kazakhstan 🇰🇿" найдена.');

                const parentCheckbox = kazakhstanGroup.querySelector('input[type="checkbox"]');
                if (parentCheckbox) {
                    console.log("Общий чекбокс найден.");
                    const checkedChildCheckboxes = kazakhstanGroup.querySelectorAll('details label input[type="checkbox"][checked]');

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
                console.log('Группа "Kazakhstan 🇰🇿" пока не найдена, продолжаем искать...');
            }
        }

        let checkInterval = setInterval(toggleKazakhstanCheckbox, 500);
    } else {
        console.log("Хеш #ToggleKazakhstan не найден.");
    }
})();
