// ==UserScript==
// @name         Hide help button
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.1
// @description  hide that uthing
// @author       Zuzana Nyiri
// @match        https://www.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458315/Hide%20help%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/458315/Hide%20help%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
var div = document.getElementById("J_xiaomi_dialog");
    div.style.visibility = "hidden";
})();