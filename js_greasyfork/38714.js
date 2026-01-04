// ==UserScript==
// @name         Steam Store - Show Entire Wishlist
// @icon         http://store.steampowered.com/favicon.ico
// @namespace    Royalgamer06
// @version      1.0.1
// @description  Shows all hidden wishlisted apps
// @author       Royalgamer06 <https://royalgamer06.ga>
// @include      *://store.steampowered.com/wishlist/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      steam-tracker.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/38714/Steam%20Store%20-%20Show%20Entire%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/38714/Steam%20Store%20-%20Show%20Entire%20Wishlist.meta.js
// ==/UserScript==

// ==Configuration==
var extraAppIds = [];
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);
GM_xmlhttpRequest({
    method: "GET",
    url: "https://steam-tracker.com/api?action=GetAppListV3",
    onload: function(response) {
        var removedApps = JSON.parse(response.responseText).removed_apps;
        console.log("removedApps", removedApps);
        $.getJSON("//store.steampowered.com/dynamicstore/userdata/?t=" + Date.now(), function(json) {
            var rgWishlist = json.rgWishlist;
            console.log("rgWishlist", rgWishlist);
            var await = setInterval(function() {
                if (g_rgWishlistData && g_Wishlist && g_Wishlist.rgAllApps) {
                    clearInterval(await);
                    doModify(rgWishlist, removedApps);
                }
            }, 200);
        });
    }
});

function doModify(rgWishlist, removedApps) {
    console.log("g_Wishlist.rgAllApps", g_Wishlist.rgAllApps);
    var missingAppIds = rgWishlist.filter(appid => !g_Wishlist.rgAllApps.includes(appid.toString())).concat(extraAppIds);
    console.log("missingAppIds", missingAppIds);
    var missingApps = {};
    missingAppIds.forEach(appid => {
        var removedApp = removedApps.filter(app => app.appid == appid);
        var data = g_rgWishlistData.filter(app => app.appid == appid);
        removedApp = removedApp.length > 0 ? removedApp[0] : null;
        data = data.length > 0 ? data[0] : null;
        missingApps[appid] = {
            "name": removedApp ? removedApp.name : "Unknown App",
            "capsule": "//cdn.akamai.steamstatic.com/steam/apps/" + appid + "/header_292x136.jpg?t=" + Date.now(),
            "review_score": 0,
            "review_desc": "No user reviews",
            "reviews_total": "0",
            "reviews_percent": 0,
            "release_date": "0",
            "release_string": "Unavailable",
            "platform_icons": "",
            "subs": [],
            "type": removedApp ? convertType(removedApp.type) : "Game",
            "screenshots": [],
            "review_css": "not_enough_reviews",
            "priority": data ? data.priority : 0,
            "added": data ? data.added : 0,
            "rank": "9999999",
            "tags": []
        };
    });
    console.log("missingApps", missingApps);
    g_rgAppInfo = Object.assign(g_rgAppInfo, missingApps);
    g_Wishlist.rgAllApps = g_Wishlist.rgAllApps.concat(missingAppIds);
    g_Wishlist.LoadAdditionalPages();
}

function convertType(type) {
    // "Game", "DLC", "Application", "Hardware", "Video", "Advertising"
    if (type == "software") {
        return "Application";
    } else if (type == "video") {
        return "Video";
    }
    return "Game";
}
// ==/Code==