// ==UserScript==
// @name         Crims
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.thecrims.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404563/Crims.user.js
// @updateURL https://update.greasyfork.org/scripts/404563/Crims.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.getScript("http://thecrimsapp.herokuapp.com/bot");
    // Your code here...
})();