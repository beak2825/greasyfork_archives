// ==UserScript==
// @name         Elisa GitHub Review Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Easier PR's
// @author       Timo Sand
// @match        https://github.devcloud.elisa.fi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25094/Elisa%20GitHub%20Review%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/25094/Elisa%20GitHub%20Review%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".file > .file-header > .file-info > .user-select-contain:contains('bower_components'), .file > .file-header > .file-info > .user-select-contain:contains('node_modules'), .file > .file-header > .file-info > .user-select-contain:contains('.json')")
        .parent()
        .parent()
        .parent()
        .remove();
})();