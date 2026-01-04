// ==UserScript==
// @name Search Date Fix
// @namespace Violentmonkey Scripts
// @include http://192.168.1.182/inventory/bom/bom_search_form.asp?*
// @grant none
// @run-at            document-end
// @description Violentmonkey Scripts
// @version 0.0.1.20210619071016
// @downloadURL https://update.greasyfork.org/scripts/428168/Search%20Date%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428168/Search%20Date%20Fix.meta.js
// ==/UserScript==

document.getElementById('txtFromDate').value = document.getElementById('txtFromDate').value.replace("2018","2000");