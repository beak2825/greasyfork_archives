// ==UserScript==
// @name         SCM Seller Profile Checker
// @namespace    https://steamcommunity.com/profiles/76561198081082634
// @version      1.2
// @description  Uses steamid.uk/avatar-finder avatar database as to find seller profiles on SCM. Credit to Mew2! https://steamcommunity.com/profiles/76561198321556119
// @author       Mengh.
// @match        https://steamcommunity.com/market/listings/*/*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/372333/SCM%20Seller%20Profile%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/372333/SCM%20Seller%20Profile%20Checker.meta.js
// ==/UserScript==

var $ = window.jQuery;
var $ = window.$;

$(document).on("mouseenter", ".playerAvatar > img", function() { // For each of the avatar images on the page,
    $(this).css("cursor", "pointer"); // Let's make the images appear clickable!
    var imgString = $(this).attr("src").substring(69); // We chop off the required string for their avatar image
    imgString = imgString.substring(0, imgString.length - 4); // Take off the .jpg part
    $(this).attr("imgString", imgString); // And make it a part of that image's properties.
});

$(document).on("click", ".playerAvatar > img", function() { // The program waits for our action and when we click on the image,
    window.open("https://steamid.uk/avatar-finder/" + $(this).attr("imgString")); // We open the Steamid.uk page in a new tab, hopefully showing us the seller
})

