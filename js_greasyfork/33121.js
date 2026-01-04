// ==UserScript==
// @name         Megaserial sidebar killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  kills the sidebar containing adds
// @author       Wise Koala
// @match        *://megaserial.net/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33121/Megaserial%20sidebar%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/33121/Megaserial%20sidebar%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var jQuery = window.jQuery;

    setTimeout(function() {
        var $sidebar = $(".left-block-bg-content noindex");
        $sidebar.remove();
    }, 1000);
})();