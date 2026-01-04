// ==UserScript==
// @name         Universal Font Changer - Tahoma
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      2.0
// @description  Changes the font of all text on web pages to Tahoma. Edit the script in between the quotes of font-family to select your own desired font.
// @author       Trilla_G
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483887/Universal%20Font%20Changer%20-%20Tahoma.user.js
// @updateURL https://update.greasyfork.org/scripts/483887/Universal%20Font%20Changer%20-%20Tahoma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body, p, span, div, h1, h2, h3, h4, h5, h6, a, li, td, th, strong, em, b, i, u {
            font-family: "Tahoma", sans-serif !important;
        }
    `);
})();
