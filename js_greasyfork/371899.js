// ==UserScript==
// @name          Etherscan - Absolute Times
// @description   Show absolute instead of relative times on Etherscan
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://etherscan.io/address*
// @match         https://etherscan.io/txs*
// @match         https://etherscan.io/token*
// @version       1.8
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/371899/Etherscan%20-%20Absolute%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/371899/Etherscan%20-%20Absolute%20Times.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery, moment */

$('.table th:contains("Age")').css("width","14%");

$('.table span:contains(" ago")').each(function() {
    var relTime = $(this).text();
    var absTime = $(this).attr('title');
    if (!absTime) absTime = $(this).attr('data-original-title');
//    absTime = moment(absTime, "MMM-DD-YYYY hh:mm:ss A", "en").add(1, 'h').format("YYYY-MM-DD HH:mm:ss");
    absTime = moment(absTime).add(1, 'h').format("YYYY-MM-DD HH:mm:ss");
    $(this).attr('title', relTime);
    $(this).attr('data-original-title', relTime);
    $(this).text(absTime);
});
