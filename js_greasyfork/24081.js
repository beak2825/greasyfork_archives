// ==UserScript==
// @name         Expand Survey Instructions
// @version      0.2.1
// @description  Auto-expand the collapsed survey instructions used in some HITs.
// @author       Kerek
// @namespace    Kerek
// @include      https://s3.amazonaws.com/mturk_bulk/hits*
// @include      https://www.mturkcontent.com/dynamic/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/24081/Expand%20Survey%20Instructions.user.js
// @updateURL https://update.greasyfork.org/scripts/24081/Expand%20Survey%20Instructions.meta.js
// ==/UserScript==

if ($('a#collapseTrigger strong:contains("Survey Link Instructions")').length > 0 && $('.panel-primary span.collapse-text').text() == "(Click to expand)")
{
    setTimeout(function(){ $('a#collapseTrigger')[0].click(); }, 100);  // added a small delay to prevent the template's hiding code sometimes kicking in after this ran, undoing the unhiding; wrapping it in document.ready or/and window.load didn't help, so did this instead
}
