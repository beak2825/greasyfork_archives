// ==UserScript==
// @name            Torn - Hide Upgrade
// @author          FrogKnight
// @namespace       http://www.torn.com/profiles.php?XID=1659259
// @description     Hide your upgrade link and upgrade message hint
// @version	        1.0
// @match           *://www.torn.com/*
// @released        2016-11-09
// @updated         2016-11-09
// @compatible      Greasemonkey
// @downloadURL https://update.greasyfork.org/scripts/24684/Torn%20-%20Hide%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/24684/Torn%20-%20Hide%20Upgrade.meta.js
// ==/UserScript==

(function(){
    'use strict';
    $('div.upgrade-level').remove();
    $('div.msg.right-round').find('li:contains("You have enough experience to go up to level")').remove();

    if ($('div.msg.right-round').text().trim().length === 0) {
        $("div.info-msg-cont").remove();
        $('hr.page-head-delimiter.m-top10.m-bottom10').remove();
    }
})();