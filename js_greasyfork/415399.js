// ==UserScript==
// @name         Testportal cheat
// @version      0.1
// @description  a simple Testportal hack
// @include      *testportal.pl/exam/*
// @grant        none
// @namespace https://greasyfork.org/users/700932
// @downloadURL https://update.greasyfork.org/scripts/415399/Testportal%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/415399/Testportal%20cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.blurSpy != null) {
        window.blurSpy.stop();
    }
    document.hasFocus = () => true;
})();