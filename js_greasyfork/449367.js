// ==UserScript==
// @name         DaShu Ext
// @namespace    https://dashu.houtar.eu.org/
// @version      0.1
// @description  A more comfortable viewer.
// @author       Houtar
// @match        *://www.dashuhuwai.com/comic/*/read-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashuhuwai.com
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449367/DaShu%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/449367/DaShu%20Ext.meta.js
// ==/UserScript==

(function () {
    "use strict";
    /* global $ */

    GM_addStyle(
        ".setnmh-seebookpage .setnmh-seebox img {margin: 0; box-shadow: none;}"
    );
    $("body > div > header").remove();
    $("body > div > div.setnmh-controlbottom.freebottom").remove();
    setInterval(function () {
        $(".img_info").remove();
    }, 500);
})();
