// ==UserScript==
// @name         Yandex Mail Enhancer
// @description  Корректировка дизайна Яндекс.Почты под деловой стиль
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @author       Aligotr
// @match        https://mail.yandex.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524523/Yandex%20Mail%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/524523/Yandex%20Mail%20Enhancer.meta.js
// ==/UserScript==

(function() {
    // Замена разноцветных иконок контактов рядом с письмом на цвет, соответствующий выбранной теме
    GM_addStyle(`
        .mail-User-Avatar {
            background-color: var(--liza-theme-accent-color) !important;
        }
     `);

    // Выделение цветом писем, находящихся в фокусе и помеченных как важные
    GM_addStyle(`
        .mail-MessageSnippet-Wrap:not(.is-checked) .is-focused .mail-MessageSnippet.is-important .mail-MessageSnippet-Item_body,
        .mail-MessageSnippet-Wrap:not(.is-checked) .is-focused .mail-MessageSnippet.is-important .mail-MessageSnippet-Item_misc,
        .mail-MessageSnippet-Wrap:not(.is-checked) .is-focused .mail-MessageSnippet.is-important .mail-MessageSnippet-Item_left:not(.mail-MessageSnippet-Item_WidgetColorful) {
            background: var(--color-mg-tint-light) !important;
        }
    `);
})();
