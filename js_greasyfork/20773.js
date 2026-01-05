// ==UserScript==
// @name         Steam Community - All Greenlight Items Voter
// @namespace    Royalgamer06
// @version      1.0.0
// @description  Votes yes or no to all greenlight items (you can set your own filters)
// @author       Royalgamer06
// @include      *://steamcommunity.com/workshop/browse/?appid=*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/20773/Steam%20Community%20-%20All%20Greenlight%20Items%20Voter.user.js
// @updateURL https://update.greasyfork.org/scripts/20773/Steam%20Community%20-%20All%20Greenlight%20Items%20Voter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    var html = '<div class="rightSectionTopTitle">Greenlight Items:</div> <div class="rightDetailsBlock"> <div style="position:relative;"> <img class="browseOptionImage" src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/filterselect_blue.png?v=1"> <div class="browseOption mostrecent"><a id="allyes">Vote All Yes</a></div> </div> <div style="position:relative;"> <img class="browseOptionImage" src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/filterselect_blue.png?v=1"> <div class="browseOption mostrecent"><a id="allno">Vote All No</a></div> </div><hr> </div> </div>';
    $(".panel:first").prepend(html);
    $("#allyes").click(function() { voteAll("voteup"); });
    $("#allno").click(function() { voteAll("votedown"); });
});

function voteAll(method) {
    var modal = window.ShowBlockingWaitDialog("Executing…", "Please wait until all requests finish. \nThe page will automatically reload when it is finished.");
    var appid = location.href.split("appid=")[1].split("&")[0];
    var pageinfo = $(".workshopBrowsePagingInfo").text().replace(",", "");
    var split = pageinfo.split(" ");
    var total = 0;
    for (var i = 0; i < split.length; i++) {
        if (split[i].match(/^[0-9]+$/) !== null) {
            total = parseInt(split[i]);
        }
    }
    var loaded = 1;
    var lastpage = Math.ceil(total/30);
    for (var p = 1; p <= lastpage; p++) {
        var url = location.href;
        if (url.indexOf("p=") > -1) {
            url = url.split("p=")[0] + "p=" + p + url.split("p=")[1].replace(url.split("p=")[1].split("&")[0], "");
        } else {
            url = url + "&p=" + p;
        }
        $.get(url, function(data) {
        data = data.replace(/<img\b[^>]*>/ig, "");
            var s = $(data).find(".workshopItemPreviewHolder");
            for (var i = 0; i < s.length; i++) {
                var wsid = s[i].getAttribute("id").replace("sharedfile_","");
                $.post("//steamcommunity.com/sharedfiles/" + method, { id: wsid, sessionid: window.g_sessionID }).always(function() {
                    loaded++;
                    modal.Dismiss();
                    if( loaded >= total ) {
                        location.reload();
                    } else {
                        modal = ShowBlockingWaitDialog( 'Executing…', 'Loaded <b>' + loaded + '</b>/' + total + '.' );
                    }
                });
            }
        });
    }
}