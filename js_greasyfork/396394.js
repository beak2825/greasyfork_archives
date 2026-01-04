// ==UserScript==
// @name         eBay.com NO sponsored ads
// @version      20200213
// @description  No more sponsored ad blocks on ebay.com
// @author       commensal
// @match        https://www.ebay.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/209860
// @downloadURL https://update.greasyfork.org/scripts/396394/eBaycom%20NO%20sponsored%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/396394/eBaycom%20NO%20sponsored%20ads.meta.js
// ==/UserScript==

$('div[id^="merch_"]').remove();
$('span:contains("S")').closest('li.s-item').remove();