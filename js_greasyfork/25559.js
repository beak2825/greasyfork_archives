// ==UserScript==
// @name         Steam Store - Removed App/Sub Redirect To SteamDB
// @icon         http://store.steampowered.com/favicon.ico
// @namespace    Royalgamer06
// @version      1.5
// @description  If the Steam Store app/sub doesn't exist, is removed or is region-locked, redirect to steamdb.info instead of store.steampowered.com.
// @author       Royalgamer06 <https://royalgamer06.ga>
// @include      *
// @exclude      file://*
// @connect      store.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/25559/Steam%20Store%20-%20Removed%20AppSub%20Redirect%20To%20SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/25559/Steam%20Store%20-%20Removed%20AppSub%20Redirect%20To%20SteamDB.meta.js
// ==/UserScript==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);
var CtrlIsPressed = false;
$(document).ready(function() {
    if (/^https?:\/\/store\.steampowered.com\/(app|sub)\/.+$/.test(location.href)) {
        if (document.getElementById("error_box")) location.href = location.href.replace("store.steampowered.com", "steamdb.info");
    }
}).on("keydown", function(event) {
    if (event.which == "17") CtrlIsPressed = true;
}).on("keyup", function() {
    CtrlIsPressed = false;
}).on("mousedown", "a[href*='://store.steampowered.com/app/'], a[href*='://store.steampowered.com/sub/']", function(event) {
    event.preventDefault();
    event.returnValue = false;
    event.stopPropagation();
    var href = event.currentTarget.href;
    var target = event.currentTarget.target ? event.currentTarget.target : "_self";
    var w;
    var opened = false;
    switch (event.which) {
        case 1:
            if (CtrlIsPressed) {
                w = unsafeWindow.open(href, "_blank");
                unsafeWindow.focus();
            } else {
                w = unsafeWindow.open(href, target);
            }
            opened = true;
            break;
        case 2:
            w = unsafeWindow.open(href, "_blank");
            unsafeWindow.focus();
            opened = true;
            break;
        default:
            break;
    }
    if (opened) {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: href,
            onload: function(response) {
                if (/^https?:\/\/store\.steampowered.com\/?$/.test(response.finalUrl)) {
                    w.location.href = href.replace("store.steampowered.com", "steamdb.info");
                }
            }
        });
    }
    return false;
});
// ==/Code==