// ==UserScript==
// @name         SteamGifts - Better Steam Profile Autosync
// @namespace    https://greasyfork.org/users/13642
// @version      4.0.1
// @description  Automatically sync your steam profile (every set period), when visiting steamgifts.com and/or marking your winning(s) as received. Now will also hide owned DLC.
// @author       Royalgamer06
// @include      *steamgifts.com*
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @connect      royalgamer06.ga
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14592/SteamGifts%20-%20Better%20Steam%20Profile%20Autosync.user.js
// @updateURL https://update.greasyfork.org/scripts/14592/SteamGifts%20-%20Better%20Steam%20Profile%20Autosync.meta.js
// ==/UserScript==

// ==Configuration==
const syncDelay = 86400000; // Sync every 86400000 = 24 * 60 * 60 * 1000 = 24 hours / 43200000 = 12 hours / 3600000 = 1 hour / 600000 = 10 mins.
const syncOnReceived = true; // Sync when marking a won steam key as received? Yes = true, no = false.
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
    const lastSyncDate = parseInt(localStorage.getItem("lastSyncDate")) || 1;
    if (Date.now() - lastSyncDate > syncDelay) {
        setTimeout(doSync, 0);
    } else if (location.href.indexOf("/giveaways/won") > -1 && syncOnReceived) {
        $(".table__gift-feedback-awaiting-reply").click(doSync);
    }
});

function doSync() {
    var xsrfToken = $(".js__logout").data("form").split("xsrf_token=")[1];
    if (xsrfToken.length > 0) {
        var data =  "xsrf_token=" + xsrfToken  + "&do=sync";
        var prevHidden = localStorage.getItem("prevHidden");
        var v = parseInt(localStorage.getItem("v")) || 2;
        if (!prevHidden) {
            prevHidden = [];
            localStorage.setItem("prevHidden", prevHidden.join(","));
        } else {
            prevHidden = prevHidden.split(",");
        }
        $.ajax({
            url: "/ajax.php",
            type: "POST",
            dataType: "json",
            data: data,
            success: function() {
                console.log("Native sync on SteamGifts completed");
            }
        });
        console.log("Adding owned games and DLC to Hidden Giveaways...");
        console.log("Already hidden:", prevHidden);
        console.log("Gathering owned Steam AppID's...");
        v++;
        localStorage.setItem("v", v);
        GM_xmlhttpRequest({
            method: "GET",
            ignoreCache: true,
            url: "http://store.steampowered.com/dynamicstore/userdata/?v=" + v,
            onload: function(response) {
                const ownedApps = JSON.parse(response.responseText).rgOwnedApps;
                console.log("Successfully gathered owned Steam AppID's:", ownedApps);
                console.log("Hiding not yet hidden owned games and DLC...");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://royalgamer06.ga/sgdb.json",
                    ignoreCache: true,
                    onload: function(response) {
                        const sgdb = JSON.parse(response.responseText);
                        const appsToHide = ownedApps.filter(appid => sgdb.appids.hasOwnProperty(appid) && !prevHidden.includes(appid.toString()));
                        if (appsToHide.length > 0) {
                            var ajaxDone = 0;
                            appsToHide.forEach(function(a) {
                                let appid = a;
                                console.log("Hiding AppID " + appid + "...");
                                $.post("/ajax.php", { xsrf_token: xsrfToken , game_id: sgdb.appids[appid], do: "hide_giveaways_by_game_id" }, function() {
                                    ajaxDone++;
                                    prevHidden.push(appid);
                                    localStorage.setItem("prevHidden", prevHidden.join(","));
                                    console.log("Successfully added AppID " + appid + " to Hidden Giveaways!");
                                    if (ajaxDone === appsToHide.length) {
                                        localStorage.setItem("lastSyncDate", Date.now());
                                        console.log("All done! Successfully added " + ajaxDone + " games to Hidden Giveaways!");
                                    }
                                });
                            });
                        } else {
                            console.log("No games needs to be hidden! All done! :)");
                        }
                    }
                });
            }
        });
    } else {
        console.log("Unable to synchronize: missing user token.");
    }
}
// ==/Code==