// ==UserScript==
// @name         Start page remove add banner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the add banner
// @author       You
// @match        https://vivaldi.start.me/*
// @match        https://start.me/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416385/Start%20page%20remove%20add%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/416385/Start%20page%20remove%20add%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //see require using above to bring in jquery
    var $ = window.jQuery;

    $("aside.widget-page__ads").hide();
})();