// ==UserScript==
// @name         Steam Community - All Workshop Items Subscriber
// @namespace    Royalgamer06
// @version      0.4.1
// @description  Subscribes or unsubscribes to all workshop items from a particular AppID
// @author       Royalgamer06
// @include      *://steamcommunity.com/workshop/browse/?appid=*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19598/Steam%20Community%20-%20All%20Workshop%20Items%20Subscriber.user.js
// @updateURL https://update.greasyfork.org/scripts/19598/Steam%20Community%20-%20All%20Workshop%20Items%20Subscriber.meta.js
// ==/UserScript==

this.$ = this.$ = $.noConflict(true);
$(document).ready(function() {
    var html = '<div class="rightSectionTopTitle">Subscriptions:</div> <div class="rightDetailsBlock"> <div style="position:relative;"> <img class="browseOptionImage" src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/filterselect_blue.png?v=1"> <div class="browseOption mostrecent"><a id="suball">Subscribe All</a></div> </div> <div style="position:relative;"> <img class="browseOptionImage" src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/filterselect_blue.png?v=1"> <div class="browseOption mostrecent"><a id="unsuball">Unsubscribe All</a></div> </div><hr> </div> </div>';
    $(".panel:first").prepend(html);
    $("#suball").click(function() { subAll("subscribe"); });
    $("#unsuball").click(function() { subAll("unsubscribe"); });
});

function subAll(method) {
    var modal = ShowBlockingWaitDialog("Executing…", "Please wait until all requests finish. \nThe page will automatically reload when it is finished.");
    const appid = location.href.split("appid=")[1].split("&")[0];
    var pageinfo = $(".workshopBrowsePagingInfo").text().replace(",", "");
    var split = pageinfo.split(" ");
    var total = 0;
    for (var i = 0; i < split.length; i++) {
        if (split[i].match(/^[0-9]+$/) !== null) {
            total = parseInt(split[i]);
        }
    }
    var loaded = 1;
    const lastpage = Math.ceil(total/30);
    for (var p = 1; p <= lastpage; p++) {
        var url = location.href;
        if (url.indexOf("p=") > -1) {
            url = url.split("p=")[0] + "p=" + p + url.split("p=")[1].replace(url.split("p=")[1].split("&")[0], "");
        } else {
            url = url + "&p=" + p;
        }
        setTimeout(function() {
            $.get(url, function(data) {
                data = data.replace(/src="[^"]*"/ig, "");
                $(".workshopItemPreviewHolder", data).each(function() {
                    let wsid = $(this).attr("id").replace("sharedfile_","");
                    setTimeout(function() {
                        $.post("//steamcommunity.com/sharedfiles/" + method, { id: wsid, appid: appid, sessionid: g_sessionID }).always(function() {
                            loaded++;
                            modal.Dismiss();
                            if( loaded >= total ) {
                                location.reload();
                            } else {
                                modal = ShowBlockingWaitDialog( 'Executing…', 'Loaded <b>' + loaded + '</b>/' + total + '.' );
                            }
                        });
                    }, 0);
                });
                delete data;
            });
        }, 0);
    }
}