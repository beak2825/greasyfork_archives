// ==UserScript==
// @name         Unfilter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  disable chat filter
// @author       Klystro
// @match        http://moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28719/Unfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/28719/Unfilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    profanityList.length = 0;
    profanityList[0] = "starve.io";
})();