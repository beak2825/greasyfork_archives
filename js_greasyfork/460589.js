// ==UserScript==
// @name         sohu Wide Screen Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sohu website Wide Screen Display
// @author       fvydjt
// @match        https://www.sohu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sohu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460589/sohu%20Wide%20Screen%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/460589/sohu%20Wide%20Screen%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
        .left.main {
            width: 1000px !important;
        }
    `;
    GM_addStyle(css);
})();