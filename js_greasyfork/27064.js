// ==UserScript==
// @name         Steam Community - Group Announcements Remover
// @namespace    Royalgamer06
// @version      1.0
// @description  Delete all announcements in your steam community group
// @author       Royalgamer06
// @include      /^https?\:\/\/steamcommunity\.com\/(gid|groups)\/.+/
// @grant        unsafeWindow
// @run-at       document-idle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/27064/Steam%20Community%20-%20Group%20Announcements%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/27064/Steam%20Community%20-%20Group%20Announcements%20Remover.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    if ($(".rightbox:contains('ADMIN TOOLS')").length > 0) {
        unsafeWindow.DeleteAllAnnouncements = function() {
            var groupurl = location.href.split("/").slice(0, 5).join("/").split("#")[0].split("?")[0];
            $.get(groupurl + "/announcements", function(data) {
                if ($(".group_paging", data).length > 0) {
                    var postcount = parseInt($(".group_paging", data).text().split(" posts")[0].split("of ")[1].replace(/\.|\,/g, ""));
                    var pagecount = Math.ceil(postcount / 5);
                    var deleted = 0;
                    var modal = ShowBlockingWaitDialog("Executing...", "Deleted " + deleted + "/" + postcount + " group announcements.");
                    for (var p = 1, hidden = false; p <= pagecount && !hidden; p++) {
                        let page = p;
                        $.get(groupurl + "/announcements?p=" + page, function(data) {
                            $("[href*=ConfirmDeleteAnnouncement]", data).each(function() {
                                $.get(this.href.split("'")[1]).always(function() {
                                    deleted++;
                                    modal.Dismiss();
                                    modal = ShowBlockingWaitDialog("Executing...", "Deleted " + deleted + "/" + postcount + " group announcements.");
                                    if (deleted >= postcount) {
                                        modal.Dismiss();
                                        ShowAlertDialog("All done!", "Deleted " + deleted + "/" + postcount + " group announcements.<br><br>I hope you found this userscript useful.<br>Please rate this userscript.<br>Feedback is also appreciated.<br>Thank you");
                                    }
                                });
                            });
                            if ($("[href*=ConfirmDeleteAnnouncement]", data).length < 5) {
                                hidden = true;
                                pagecount = pagecount - page + 1;
                                for (var pa = 1; pa <= pagecount; pa++) {
                                    let hiddenpage = pa;
                                    $.get(groupurl + "/announcements/hidden?p=" + hiddenpage, function(data) {
                                        $("[href*=ConfirmDeleteAnnouncement]", data).each(function() {
                                            $.get(this.href.split("'")[1]).always(function() {
                                                deleted++;
                                                modal.Dismiss();
                                                modal = ShowBlockingWaitDialog("Executing...", "Deleted " + deleted + "/" + postcount + " group announcements.");
                                                if (deleted >= postcount) {
                                                    modal.Dismiss();
                                                    ShowAlertDialog("All done!", "Deleted " + deleted + "/" + postcount + " group announcements.<br><br>I hope you found this userscript useful.<br>Please rate this userscript.<br>Feedback is also appreciated.<br>Thank you");
                                                }
                                            });
                                        });
                                    });
                                }
                            }
                        });
                    }
                } else {
                    alert("No announcements!");
                }
            });
        };
        $(".rightbox:contains('ADMIN TOOLS') .content").append('<div class="weblink"><img class="admin_option_icon" src="http://steamcommunity-a.akamaihd.net/public/images/skin_1/admin_iconAnnouncement.png"><a href="javascript:DeleteAllAnnouncements()"> Delete All Announcements</a></div>');
    }
});