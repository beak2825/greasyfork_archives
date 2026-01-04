// ==UserScript==
// @name Dumpert Legacy
// @namespace Violentmonkey Scripts
// @run-at document-start
// @match http*://www.dumpert.nl/*
// @grant none
// @description dumpert legacy 2019-10
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/390994/Dumpert%20Legacy.user.js
// @updateURL https://update.greasyfork.org/scripts/390994/Dumpert%20Legacy.meta.js
// ==/UserScript==

/* Dumpert.nl Legacy 2019-10
 * Want reaguurders en verandering enzo, en vroeger was alles beter. 
 * www.dumpert.nl -> legacy.dumpert.nl
 * www.dumpert.nl/item/[1]_[2] -> legacy.dumpert.nl/mediabase/[1]/[2]
 * 
 * voor hoelang dit nog blijft werken...
 * 
 */

if (window.location.pathname == "/") {
    location.hostname = "legacy.dumpert.nl";  
} else if (window.location.pathname.includes("/item/")) {
    var old = window.location.href;
    var newUrl = old.replace("/item/", "/mediabase/").replace("_", "/").replace("//www.", "//legacy.");
    // console.log("redirect to " + newUrl);
    window.location = newUrl;
}


