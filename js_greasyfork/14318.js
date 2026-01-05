// ==UserScript==
// @name         wololo stopper
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  Bans wololo instantly
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14318/wololo%20stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/14318/wololo%20stopper.meta.js
// ==/UserScript==

var empty = [];
data = JSON.stringify(empty);

setInterval(function() {
    GM_xmlhttpRequest({
        url: "https://api.myjson.com/bins/lqru",
        method:"GET",
        onload: function(res) {
            names = JSON.parse(res.responseText);
            var id;
            for (var name in names) {
                id = names[name][0];
                $.get("/moderator/action/ban/user/" + id, function() {
                    $.get("/moderator/action/suspend_account_all/user/" + id, function() {
                        $.get("/moderator/action/force_logout/user/" + id, function() {
                            GM_xmlhttpRequest({
                                url:"https://api.myjson.com/bins/lqru",
                                method:"PUT",
                                data: data,
                                headers:{"Content-Type": "application/json; charset=utf-8"}
                            });
                            alert(names[name][1] + "  has been destroyed");
                        });
                    });
                });
            }
        }
    });
}, 5000);