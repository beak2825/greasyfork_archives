// ==UserScript==
// @name         Torn Remove Logo
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.0
// @description  Don't look at it!
// @author       Mike Pence
// @match        https://www.torn.com/*
// @match        http://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387032/Torn%20Remove%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/387032/Torn%20Remove%20Logo.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("#tcLogo").remove();
});