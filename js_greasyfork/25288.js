// ==UserScript==
// @name         SteamGifts & SteamTrades - Notification Merger
// @namespace    Royalgamer06
// @version      0.2
// @description  Merge notifications of both steamgifts and steamtrades
// @author       Royalgamer06
// @include      https://www.steamgifts.com/*
// @include      https://www.steamtrades.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25288/SteamGifts%20%20SteamTrades%20-%20Notification%20Merger.user.js
// @updateURL https://update.greasyfork.org/scripts/25288/SteamGifts%20%20SteamTrades%20-%20Notification%20Merger.meta.js
// ==/UserScript==

var color = "red";

$(document).ready(function() {
    if (location.host == "www.steamtrades.com") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.steamgifts.com",
            onload: function(response) {
                if ($(".nav__notification", response.responseText).length > 0) {
                    var not = $(".nav__notification", response.responseText).text();
                    $(".header_inner_wrap > nav > div:nth-child(4)").after('<div class="nav_btn_container"><a href="https://www.steamgifts.com/messages" class="nav_btn"><i class="fa fa-envelope" style="color: ' + color + '"></i><span>Messages <span class="message_count">' + not + '</span></span></a></div>');
                }
            }
        });

    } else if (location.host == "www.steamgifts.com") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.steamtrades.com",
            onload: function(response) {
                if ($(".message_count", response.responseText).length > 0) {
                    var not = $(".message_count", response.responseText).text();
                    $("[title=Messages]").parent().after('<div class="nav__button-container nav__button-container--notification nav__button-container--active"><a title="Messages" class="nav__button" href="https://www.steamtrades.com/messages"><i class="fa fa-envelope" style="color: ' + color + '"></i><div class="nav__notification">' + not + '</div></a></div>');
                }
            }
        });
    }
});