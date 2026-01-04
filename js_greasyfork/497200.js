// ==UserScript==
// @name         TORN: No Enemy Delete
// @namespace    dekleinekobini.private.no-enemy-delete
// @version      1.0.0
// @author       DeKleineKobini [2114440]
// @description  Remove the delete button on the enemy page.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/blacklist.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497200/TORN%3A%20No%20Enemy%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/497200/TORN%3A%20No%20Enemy%20Delete.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(`
        .user-info-blacklist-wrap .delete {
            display: none;
        }
    `);
})();