// ==UserScript==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @name         Skin Changer for agarplus.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes your skin in agarplus per given interval from skins array.
// @author       master2500
// @match        http*://agar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14512/Skin%20Changer%20for%20agarplusio.user.js
// @updateURL https://update.greasyfork.org/scripts/14512/Skin%20Changer%20for%20agarplusio.meta.js
// ==/UserScript==


//CHANGE INTERVAL (in milliseconds)
var interval = 3000;


//SKINS LIST
var skins = ["http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/08/cute-anime-girl-background-hd-wallpapers.jpg",
    "http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/08/Cute-Anime-Baby-Girl-HD-Wallpapers.jpg",
    "http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/08/Cute-Anime-Girl-Blue-Eyes-HD-Wallpapers.jpg",
    "http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/08/Cute-Anime-Girl-Desktop-HD-Wallpapers.jpg",
    "http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/08/Cute-Anime-Girl-Desktop-Wallpapers-HD.jpg"
];

















for(var i = 0; i < skins.length; i++) {
    var img = new Image();
    img.src = skins[i];
}
var current = 0;
setInterval(function() {
    $("#customskin").val(skins[current]);
    if ($("#gameStats").css("display") == "block") {
        $("button[data-itr='play']").trigger("onclick");
    }
    current++;
    if (current == skins.length) {
        current = 0;
    }
}, interval);