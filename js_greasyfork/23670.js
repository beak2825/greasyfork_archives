// ==UserScript==
// @name         Steam Store - Wishlist Exporter
// @icon         http://store.steampowered.com/favicon.ico
// @namespace    Royalgamer06
// @version      1.2
// @description  Export your wishlist in a raw text list (applies chosen filters)
// @author       Royalgamer06
// @match        *://store.steampowered.com/wishlist/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/23670/Steam%20Store%20-%20Wishlist%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/23670/Steam%20Store%20-%20Wishlist%20Exporter.meta.js
// ==/UserScript==

jQuery(".controls").prepend('<div class="settings_tab" title="Show raw wishlist titles"><a href="javascript:exportWishlist();"><img src="//steamcommunity-a.akamaihd.net/public/images/skin_1/notification_icon_guide.png"></a></div>');

unsafeWindow.exportWishlist = function() {
    var win = window.open("", "", "width=480,height=640");
    unsafeWindow.g_Wishlist.rgVisibleApps.forEach(appid => {
        win.document.write(unsafeWindow.g_rgAppInfo[appid].name + "<br>");
    });
    var range = win.document.createRange();
    range.selectNodeContents(win.document.body);
    var selection = win.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};