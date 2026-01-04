// ==UserScript==
// @name         DECIPHER - Always show debug comments
// @version      1.0
// @description  Automatically expands debug comments when using print() in Decipher.
// @include      https://survey-*.dynata.com/survey/selfserve/*
// @exclude      *:edit
// @exclude      *:xmledit
// @author       Scott
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/390674/DECIPHER%20-%20Always%20show%20debug%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/390674/DECIPHER%20-%20Always%20show%20debug%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery; //Need for Tampermonkey or it raises warnings.

    jQuery(".survey-info").show();

})();