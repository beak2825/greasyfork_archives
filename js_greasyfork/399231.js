// ==UserScript==
// @name         Clear Ivelt Subject Line Before Post
// @version      0.3
// @description  Make things less annoying...
// @author       Knaper Yaden
// @match        *.ivelt.com/*
// @exclude      *.ivelt.com/forum/ucp.php?i=pm*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/473330
// @downloadURL https://update.greasyfork.org/scripts/399231/Clear%20Ivelt%20Subject%20Line%20Before%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/399231/Clear%20Ivelt%20Subject%20Line%20Before%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#subject').val('');
})();