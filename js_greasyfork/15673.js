// ==UserScript==
// @name         WarforumFix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix temporary unavailability of warforum.cz
// @author       t00r
// @match        http://www.warforum.cz/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/15673/WarforumFix.user.js
// @updateURL https://update.greasyfork.org/scripts/15673/WarforumFix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(document).ready(function() {
    var htmlString = $("html").html().toString();

    var oldNginx = htmlString.indexOf("temporarily unavailable.<br/>");
    var newNginx = htmlString.indexOf("currently unavailable.<br/>");

    if (oldNginx != -1 || newNginx != -1) {
        if (GM_getValue("reload", false)) {
            alert("Looks like site is really temporarily unavailable. Please try again later :-)");
        } else {
            $.removeCookie("warforum_t", { domain: ".www.warforum.cz", path: "/" });
            GM_setValue("reload", true);
            location.reload();
        }
    }
    
    GM_deleteValue("reload");
});