// ==UserScript==
// @name         pcrock WebAstrict
// @description  Astrict
// @match        *
// @version 0.0.1.20220913094629
// @namespace https://greasyfork.org/users/144763
// @downloadURL https://update.greasyfork.org/scripts/451297/pcrock%20WebAstrict.user.js
// @updateURL https://update.greasyfork.org/scripts/451297/pcrock%20WebAstrict.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.oncontextmenu = function() {
        return true
    };
    document.onselectstart = function() {
        return true
    };
    document.oncopy = function() {
        return true
    };
    document.oncut = function() {
        return true
    };
    document.onpaste = function() {
        return true
    }
})();