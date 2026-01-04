// ==UserScript==
// @name            Selecting checkboxes on mouse-over
// @name:ru         Выбор чек-боксов при наведении курсора
// @description     "The script performs checkboxes on the site page, over which you move the mouse cursor. Holding down the ALT key and hovering the cursor over any checkbox will select all checkboxes or uncheck all checkboxes that were previously selected."
// @description:ru  "Скрипт выполняет установку флажков в чек-боксах на странице сайта, над которыми проводишь курсором мыши. При удерживании клавиши ALT и наведении курсора на любой чек-бокс, все чек-боксы будут выбраны или сняты все флажки со всех чек-боксов, которые были выбраны ранее."
// @namespace       https://greasyfork.org/users/1221433
// @icon            https://vse-tv.net/img/scripts/check_boxes.png
// @author          Sitego
// @date            2023-12-02
// @version         1.1
// @match           *://*/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/481220/Selecting%20checkboxes%20on%20mouse-over.user.js
// @updateURL https://update.greasyfork.org/scripts/481220/Selecting%20checkboxes%20on%20mouse-over.meta.js
// ==/UserScript==

(function () {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('mouseover', function (event) {
            if (event.altKey) {
                checkboxes.forEach(function (cb) {
                    cb.checked = !cb.checked;
                });
            } else {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            }
        });
    });
})();
