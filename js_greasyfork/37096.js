// ==UserScript==
// @name         Show Subscriber-Only Chronicle Articles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allow reading subscriber-only articles on The Chronicle.
// @author       abluescarab
// @match        http*://*.thechronicleonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37096/Show%20Subscriber-Only%20Chronicle%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/37096/Show%20Subscriber-Only%20Chronicle%20Articles.meta.js
// ==/UserScript==

var paragraphs = $(".subscriber-only");
$(".redacted-overlay").remove();

paragraphs.removeClass("hide");
paragraphs.removeClass("subscriber-only");