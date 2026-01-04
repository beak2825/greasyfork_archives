// ==UserScript==
// @name         laravel-china docs alter
// @namespace    http://github.com/shamiao/
// @version      0.1.2
// @description  N/A
// @author       shamiao
// @match        https://d.laravel-china.org/docs/5.5/*
// @match        https://d.laravel-china.org/docs/5.4/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33349/laravel-china%20docs%20alter.user.js
// @updateURL https://update.greasyfork.org/scripts/33349/laravel-china%20docs%20alter.meta.js
// ==/UserScript==

(function() {
    document.title = document.title.replace(/^Laravel\s*(的|)/, "");
})();
