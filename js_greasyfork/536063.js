// ==UserScript==
// @name         Insales Select All Variants
// @description  Insales Select All Variants!
// @namespace    http://tampermonkey.net/
// @version      2025-05-15
// @author       You
// @match        https://edgecomics.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edgecomics.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536063/Insales%20Select%20All%20Variants.user.js
// @updateURL https://update.greasyfork.org/scripts/536063/Insales%20Select%20All%20Variants.meta.js
// ==/UserScript==

    'use strict';

    function addSelectButtons() {
        $('tr').each(function () {
            const $row = $(this);
            const idAttr = $row.find('td[id^="product-"][id$="-image"]').attr('id');

            if (idAttr && !$row.find('.select-all-link').length) {
                const match = idAttr.match(/^product-(\d+)-image$/);
                if (!match) return;

                const productId = match[1];
                const $nextRows = $row.nextAll();

                let hasSelectableVariants = false;

                // Проверяем, есть ли у этого товара выбираемые варианты
                for (let i = 0; i < $nextRows.length; i++) {
                    const $next = $($nextRows[i]);
                    if ($next.find(`td[id^="product-"][id$="-image"]`).length > 0) break;

                    if ($next.is('[data-add-element]')) {
                        const $checkbox = $next.find('input[type="checkbox"][id^="toggle-control-"]');
                        if ($checkbox.length) {
                            hasSelectableVariants = true;
                            break;
                        }
                    }
                }

                if (hasSelectableVariants) {
                    const $button = $('<a href="#" class="select-all-link" style="margin-left: 10px; font-size: 12px; white-space: nowrap;">[выбрать все]</a>');
                    $button.data('selected', false); // начальное состояние: ничего не выбрано
                    $row.find('td.image').append($button);

                    $button.on('click', function (e) {
                        e.preventDefault();

                        const isSelected = $button.data('selected');
                        const $checkboxes = [];

                        $nextRows.each(function () {
                            const $next = $(this);
                            if ($next.find(`td[id^="product-"][id$="-image"]`).length > 0) return false;

                            if ($next.is('[data-add-element]')) {
                                const $checkbox = $next.find('input[type="checkbox"][id^="toggle-control-"]');
                                if ($checkbox.length) {
                                    $checkboxes.push($checkbox[0]);
                                }
                            }
                        });

                        $checkboxes.forEach(cb => {
                            const shouldBeChecked = !isSelected;
                            if (cb.checked !== shouldBeChecked) {
                                cb.click(); // эмулируем клик
                            }
                        });

                        $button.data('selected', !isSelected);
                        $button.text(!isSelected ? '[снять выбор]' : '[выбрать все]');
                    });
                }
            }
        });
    }

    const observer = new MutationObserver(() => {
        addSelectButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    $(document).ready(addSelectButtons);



