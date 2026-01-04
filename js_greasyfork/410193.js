// ==UserScript==
// @name         Отключение autocomplete у search
// @namespace    http://tampermonkey.net/
// @version      0.1.5.1
// @description  try to take over the world!
// @author       You
// @match        <all_urls>
// @match        https://foodex24.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/410193/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20autocomplete%20%D1%83%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/410193/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20autocomplete%20%D1%83%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("input[type='search']").forEach(w => {
        w.autocomplete = "off"
    })
})();