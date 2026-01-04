// ==UserScript==
// @name         Github code review page formatter
// @version      1.0
// @description  Automatically set split and ignore whitespace mode on github
// @author       Me
// @match        https://github.com/*/pull/*/files
// @grant        none
// @run-at document-start
// @namespace https://greasyfork.org/users/671379
// @downloadURL https://update.greasyfork.org/scripts/448243/Github%20code%20review%20page%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/448243/Github%20code%20review%20page%20formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(! /\bdiff=split&w=1\b/.test(location.search))
    {
        document.location.href = document.location.href + "?diff=split&w=1";
    }
})();