// ==UserScript==
// @name         Bing Dict Wide Screen Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bing Dict website Wide Screen Display
// @author       fvydjt
// @match        https://*.bing.com/dict/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cn.bing.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460590/Bing%20Dict%20Wide%20Screen%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/460590/Bing%20Dict%20Wide%20Screen%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
        .lf_area {
            width: 890px !important;
        }
    `;
    GM_addStyle(css);
})();