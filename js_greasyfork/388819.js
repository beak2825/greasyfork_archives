// ==UserScript==
// @name         Remove Dot Blogs Search Bar AutoFocus
// @namespace    https://github.com/livinginpurple
// @version      2018.04.20.1
// @description  Remove Dot Blogs Search Bar Auto Focus
// @author       livinginpurple
// @match        https://dotblogs.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388819/Remove%20Dot%20Blogs%20Search%20Bar%20AutoFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/388819/Remove%20Dot%20Blogs%20Search%20Bar%20AutoFocus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Loading Disable Autofocus Script.");
    $(function () {
        $('input').blur();
    });
    console.log("Autofocus Disabled.");
})();