// ==UserScript==
// @name        MTurk Research Project HELP US IMPROVE AN EXCITING NEW SYSTEM! Helper
// @namespace   starvingstatic
// @description Auto-selects "United States" for country and "Yes" for English language query. Also auto-scrolls to the bottom of the page.
// @version     1.0
// @include https://www.mturkcontent.com/dynamic/*
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/11224/MTurk%20Research%20Project%20HELP%20US%20IMPROVE%20AN%20EXCITING%20NEW%20SYSTEM%21%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11224/MTurk%20Research%20Project%20HELP%20US%20IMPROVE%20AN%20EXCITING%20NEW%20SYSTEM%21%20Helper.meta.js
// ==/UserScript==



$("#countrySelect option[value='US']").prop('selected',true);
$('select:eq(1)>option:eq(1)').prop('selected', true);
$(document).scrollTop($(document).height());
$("#correctionText").focus();