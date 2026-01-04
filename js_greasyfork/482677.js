// ==UserScript==
// @name         курсор лапка
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  меняет курсор на лапку или любой другой. взять курсор можно тут https://www.cursor.cc/?action=icon_list&order_by_rating=1
// @author       
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482677/%D0%BA%D1%83%D1%80%D1%81%D0%BE%D1%80%20%D0%BB%D0%B0%D0%BF%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482677/%D0%BA%D1%83%D1%80%D1%81%D0%BE%D1%80%20%D0%BB%D0%B0%D0%BF%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        * {
            cursor: url("http://www.cursor.cc/cursor/35/25/cursor.png"), auto !important;
        }
    `);
})();
