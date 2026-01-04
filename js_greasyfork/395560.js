// ==UserScript==
// @name         Skip redirect
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Skips the redirecting page on Flight Rising
// @author       You
// @match        https://www1.flightrising.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395560/Skip%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/395560/Skip%20redirect.meta.js
// ==/UserScript==


$("a[href*='forums/link?url=']").each(function(){
    var url = $(this).attr("href");
    var directURL = url.substring(url.indexOf('forums/link?url=') + 16);
    var decodeURL = decodeURIComponent(directURL);
    $(this).attr("href",decodeURL);
});