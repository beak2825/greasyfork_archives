// ==UserScript==
// @name         eBay.com remove Price from-to
// @namespace    KarlBaumann
// @version      1.0
// @description  Removes ebay listings where sellers cheat by setting price ranges
// @author       Karlis Baumanis
// @match        https://www.ebay.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392478/eBaycom%20remove%20Price%20from-to.user.js
// @updateURL https://update.greasyfork.org/scripts/392478/eBaycom%20remove%20Price%20from-to.meta.js
// ==/UserScript==

$(".DEFAULT,.prRange").parents("li.s-item,li.sresult").remove()