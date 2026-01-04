// ==UserScript==
// @name         Button Deleter
// @namespace    LordBusiness.DB
// @version      1.0
// @description  Removes all buttons but the reviving button.
// @author       LordBusiness [2052465], Sid [2081212]
// @match        https://www.torn.com/profiles.php?XID=*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/386051/Button%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/386051/Button%20Deleter.meta.js
// ==/UserScript==

GM_addStyle(`
.user-information,
.buttons-list > a:not(.profile-button-revive) {
    display: none !important;
}
`);