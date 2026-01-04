// ==UserScript==
// @name         Better-Wangdoc
// @namespace    https://wangdoc.com/
// @version      0.1
// @description  make wangdoc better
// @author       WitchElaina
// @match        https://wangdoc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wangdoc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462591/Better-Wangdoc.user.js
// @updateURL https://update.greasyfork.org/scripts/462591/Better-Wangdoc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeFont() {
        var style = document.createElement("style");
        style.innerHTML = "code,pre { font-family:source code pro; }";
        document.head.appendChild(style);
    }
    changeFont();

})();