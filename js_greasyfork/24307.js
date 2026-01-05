// ==UserScript==
// @name         Steam Community - Group Members Blocker
// @namespace    Royalgamer06
// @version      1.0
// @description  Adds an option to block all members of a steam community group.
// @author       Royalgamer06
// @include      /^http(s)*\:\/\/steamcommunity\.com\/groups\/(?!.+(\#|\/)).*$/
// @grant        unsafeWindow
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24307/Steam%20Community%20-%20Group%20Members%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/24307/Steam%20Community%20-%20Group%20Members%20Blocker.meta.js
// ==/UserScript==

var members = [],
    total = 0,
    modal = null;

unsafeWindow.initBlocking = function() {
    if (confirm("Are you sure you want to block all members of this group?")) {
        total = parseInt($(".members .count").first().text().match(/[0-9]+/g).join(""));
        modal = ShowBlockingWaitDialog("Executing...", "Gathered " + members.length + "/" + total + " steamID's of " + g_strGroupName + " members.");
        getMembers(1);
    }
};

function getMembers(p) {
    $.get(g_strGroupURL + "/memberslistxml/?xml=1&p=" + p, function(xml) {
        var xmlmembers = Array.from($("steamID64", xml));
        xmlmembers.forEach(function(member) {
            members.push(member.innerHTML);
        });
        modal.Dismiss();
        modal = ShowBlockingWaitDialog("Executing...", "Gathered " + members.length + "/" + total + " steamID's of " + g_strGroupName + " members.");
        if (xmlmembers.length == 1000) {
            getMembers(p+1);
        } else {
            blockMembers();
        }
    });
}

function blockMembers() {
    var blocked = 0;
    var n = 0;
    members.forEach(function(member) {
        $.post("//steamcommunity.com/actions/BlockUserAjax", { sessionID: g_sessionID, steamid: member, block: 1 }, function() {
            blocked++;
            modal.Dismiss();
            modal = ShowBlockingWaitDialog("Executing...", "Blocked " + blocked + "/" + members.length + " members of " + g_strGroupName + ".");
        }).always(function() {
            n++;
            if (n == members.length) {
                modal.Dismiss();
                ShowAlertDialog("All done!", "Blocked " + blocked + " members of " + g_strGroupName + ".<br>" + (n-blocked) + " Members failed to block.<br><br>I hope you found this userscript useful.<br>Please rate this userscript.<br>Feedback is also appreciated.<br>Thank you");
            }
        });
    });
}

jQuery(document).ready(function() {
    if (location.href.match(/^http(s)*\:\/\/steamcommunity\.com\/groups\/(?!.+(\#|\/)).*$/)) $(".responsive_hidden~ .rightbox .weblink").last().after('<div class="weblink"><a href="javascript:initBlocking();">Block All Members</a></div>');
});