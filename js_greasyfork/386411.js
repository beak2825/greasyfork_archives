// ==UserScript==
// @name         Alabout bypasser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass the external link checker.
// @author       PartMent
// @match        http://www.alabout.com/j.phtml?url=*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386411/Alabout%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/386411/Alabout%20bypasser.meta.js
// ==/UserScript==

$(document).ready(function () {
    var link = $("a").attr("href");
    $("body").html("");
    window.location = link;
});