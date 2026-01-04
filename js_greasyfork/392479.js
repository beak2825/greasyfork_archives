// ==UserScript==
// @name         eBay.com remove sponsored
// @namespace    KarlBaumann
// @version      1.0
// @description  Removes Sponsored listings from ebay.com
// @author       Karlis Baumanis
// @match        https://www.ebay.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392479/eBaycom%20remove%20sponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/392479/eBaycom%20remove%20sponsored.meta.js
// ==/UserScript==

$("li.s-item .s-item__title--tagblock span:contains('S')").closest("li.s-item").remove();