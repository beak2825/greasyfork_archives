// ==UserScript==
// @name         WME - RTC Solucoes
// @namespace    http://www.rtcsolucoes.com/
// @version      0.03
// @description  Fix e recursos para o WME
// @author       @rtcoelho - waze.rtcoelho@gmail.com
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @run-at document-end
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34559/WME%20-%20RTC%20Solucoes.user.js
// @updateURL https://update.greasyfork.org/scripts/34559/WME%20-%20RTC%20Solucoes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fix para o Script WMEMagic
    GM_addStyle("#magic_todo { width: 285px !important; height: 85px !important; overflow-x: hidden; overflow-y: scroll; }");

})();