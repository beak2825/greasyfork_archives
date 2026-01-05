// ==UserScript==
// @name         ROBLOX Group Invite Archiver
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Filter out spammy messages about group invites.
// @author       samfun123
// @match        *.roblox.com/My/Messages
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19268/ROBLOX%20Group%20Invite%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/19268/ROBLOX%20Group%20Invite%20Archiver.meta.js
// ==/UserScript==

(function() {
    $.fn.exists = function () {
        return this.length !== 0;
    };

    function getCookie(c_name)
    {
        if (document.cookie.length > 0)
        {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1)
            {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }

    function getMessages(page, callback) {
        $.ajax({
            url: "https://www.roblox.com/messages/api/get-messages?messageTab=0&pageNumber=" + page + "&pageSize=20",
            success: callback
        });
    }

    function archiveInvites() {
        getMessages(0, function(total) {
            var invites = [];
            var counted = 0;

            for (n = 0; n < total.TotalPages; n++) {
                getMessages(n, function(messages) {
                    for (i = 0; i < messages.Collection.length; i++) {
                        var message = messages.Collection[i];
                        var matches = message.Body.match(/\.roblox\.com\/My\/Groups\.aspx\?gid=\d+/);
                        if (matches) {
                            if (matches.length > 0) {
                                invites.push(message.Id);
                            }
                        }
                    }

                    counted++;
                    if (counted == total.TotalPages) {
                        if (invites.length > 0) {
                            console.log("Archived " + invites.length + " potential group invites.");
                            $.ajax({
                                url: "https://www.roblox.com/messages/api/archive-messages",
                                method: "POST",
                                headers: { "X-CSRFToken": getCookie("csrftoken") },
                                data: {
                                    "messageIds": invites
                                },
                                success: function() {
                                    window.location.reload();
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    var checker = new MutationObserver(function() {
        var archive = $('.roblox-archiveButton');
        var custom = $('.custom-archiveInvites');

        if (archive.exists() && !custom.exists()) {
            $('<button class="custom-archiveInvites roblox-message-large-btn btn-control">Archive Group Invites</button>').insertBefore(archive).click(archiveInvites);
        }
    });

    checker.observe(document, {childList:true, subtree: true});
})();