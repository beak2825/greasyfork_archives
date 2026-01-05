// ==UserScript==
// @name         Report thread spammers
// @namespace    pxgamer
// @version      0.4
// @description  Adds button to report thread and user.
// @author       pxgamer
// @include      *kat.cr/community/show/*
// @require      https://greasyfork.org/scripts/19550-get-user-hash/code/Get%20User%20Hash.js?version=124786
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19607/Report%20thread%20spammers.user.js
// @updateURL https://update.greasyfork.org/scripts/19607/Report%20thread%20spammers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a.ka.ka16.ka-report.ka-red[title="Report thread"]').after(' <a class="ka ka16 ka-report reportSpammer" style="background: #8B0000;" title="Report thread spammer"></a>');
    var threadRep = $('#report_thread_div form').attr('action');
    var username  = $('div[id^="post"]:first .commentbody div.userPicSize100px .badge .badgeInfo .badgeUsernamejs a.plain[href^="/user/"]').text();
    var userHash  = guh(username);

    $('.reportSpammer').on('click', function() {
        // Report thread
        $.ajax({
            type: "POST",
            url: threadRep,
            data: { reason: "Thread Spammer" }
        });

        // Report user
        $.ajax({
            type: "POST",
            url: "/account/report/"+userHash+"/",
            data: { reason: "Thread Spammer" }
        });

        //Refresh to complete.
        location.refresh();
    });

})();
