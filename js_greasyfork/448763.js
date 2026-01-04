// ==UserScript==
// @name        Enlarge Instagram Following Dialog
// @namespace   pootz10
// @description Resizes / Enlarge Ig following dialog
// @include     https://instagram.com/*/
// @include     https://instagram.com/*/following/
// @include     https://www.instagram.com/*/
// @include     https://www.instagram.com/*/following/
// @exclude     https://www.instagram.com/p/*/
// @exclude     https://instagram.com/p/*/
// @version     1.3
// @history     1.3 - new fix
// @history     1.2 - fix [obsolete]
// @history     1.1 - enlarge text window [obsolete]
// @license     MIT
// @require     https://code.jquery.com/jquery-2.2.3.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448763/Enlarge%20Instagram%20Following%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/448763/Enlarge%20Instagram%20Following%20Dialog.meta.js
// ==/UserScript==

GM_addStyle(`
div.j4yusqav, .h6an9nv3, .od1n8kyl, .pi61vmqs, .e793r6ar, .h98he7qt, .kzt5xp73, .flebnqrf, .qg4pu3sx {
    min-height: 9500px !important;
}
div._aano {
    min-height: 9500px !important;
}
`);
