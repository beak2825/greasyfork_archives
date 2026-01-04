// ==UserScript==
// @name         steam价格转换 sih 适配
// @version      1.1.0
// @author       marioplus
// @namespace    marioplus/steam-price-converter/sih-adapter
// @description  steam价格转换 sih插件 适配
// @license      AGPL-3.0-or-later
// @icon         https://vitejs.dev/logo.svg
// @homepage     https://github.com/marioplus
// @match        https://store.steampowered.com/search/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452652/steam%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%20sih%20%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/452652/steam%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%20sih%20%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
        .search_result_row .col.search_name {
            width: 208px !important;
        }
        .responsive_search_name_combined .sih-cart {
            margin-left: 0;
        }
    `)
})();