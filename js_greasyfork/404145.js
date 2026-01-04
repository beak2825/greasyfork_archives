// ==UserScript==
// @name         Evalbox Check bypass
// @namespace    https://www.evalbox.com/
// @version      0.1
// @description  ...
// @author       You
// @match        https://www.evalbox.com/
// @grant        none
// @include https://examinee.evalbox.com/*
// @downloadURL https://update.greasyfork.org/scripts/404145/Evalbox%20Check%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/404145/Evalbox%20Check%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).ready(function() {
        $(window).unbind();
    });
})();