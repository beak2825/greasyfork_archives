// ==UserScript==
// @name         [AoR] Отключение невидимости
// @namespace    tuxuuman:aor:disable-invisible
// @version      0.1
// @description  Позволяет видеть игроков в плаще инвиза и ассасинов
// @author       tuxuuman
// @match        *://game.aor-game.ru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371594/%5BAoR%5D%20%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B5%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/371594/%5BAoR%5D%20%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B5%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8.meta.js
// ==/UserScript==

(function(d) {
    // делаем челов в инвизе, видимыми
    GM_addStyle(`
.playerOnLocation:not([data-invisible="0"]) {
display: block !important;
background-color: #900000;
}
`);
})();