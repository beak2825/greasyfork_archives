// ==UserScript==
// @name         SteamGifts - Hide Blacklist Giveaways
// @namespace    https://www.steamgifts.com/discussion/SYViX/need-a-script#IY9MFzT
// @version      0.2
// @description  Hide Giveaways on SteamGifts created by users you blacklisted.
// @author       Royalgamer06
// @match        https://www.steamgifts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24485/SteamGifts%20-%20Hide%20Blacklist%20Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/24485/SteamGifts%20-%20Hide%20Blacklist%20Giveaways.meta.js
// ==/UserScript==

var oncePerDay = true;
var currentDate = new Date().toJSON().slice(0,10).replace(/\-/g, "");
var oldDate = localStorage.getItem("bldate");

$(document).ready(function() {
    if (currentDate > oldDate || oldDate === undefined || !oncePerDay) {
        var blusers = [];
        $.get("/account/manage/blacklist", function(data) {
            $(".table__column__heading", data).each(function() {
                blusers.push($(this).text());
            });
            var lastpage = $(".fa-angle-double-right").parent().first().length > 0 ? $(".fa-angle-double-right").parent().first().attr('href').split("page=")[1] : 0;
            for (var p = 2; p <= lastpage; p++) {
                (function(p, blusers, lastpage) {
                    $.get("https://www.steamgifts.com/account/manage/blacklist/search?page=" + p, function(data) {
                        $(".table__column__heading", data).each(function() {
                            blusers.push($(this).text());
                        });
                        if (p == lastpage) {
                            setTimeout(function() {
                                localStorage.setItem("blusers", JSON.stringify(blusers));
                                localStorage.setItem("bldate", currentDate);
                                main(blusers);
                            }, 666);
                        }
                    });
                })(p, blusers, lastpage);
            }
            if (lastpage === 0) {
                localStorage.setItem("blusers", JSON.stringify(blusers));
                localStorage.setItem("bldate", currentDate);
                main(blusers);
            }
        });
    } else {
        main(JSON.parse(localStorage.getItem("blusers")));
    }
});

function main(blusers) {
    var visited = [];
    $("a").each(function() {
        var ga = this;
        if (ga.href.indexOf("/giveaway/") > -1) {
            var visit = ga.href.split("/")[4];
            if ($.inArray(visit, visited) == -1) {
                visited.push(visit);
                $.get(ga.href, function(data) {
                    var creator = $(".text-right a", data).text();
                    if ($.inArray(creator, blusers) > -1) {
                        if ($(ga).hasClass("giveaway__heading__name")) {
                            $(ga).parent().parent().parent().parent().hide();
                        } else {
                            $(ga).hide();
                        }
                    }
                });
            }
        }
    });
}