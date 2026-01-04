// ==UserScript==
// @name         Dress to Impress Wishlist Link
// @namespace    Flordibel@Clraik
// @version      1.0
// @description  Inserts a link at the top of the Dress to Impress (DTI) userbar that contains a direct link to your Wishlist.
// @author       Ostensibly Flordibel but mostly Bat
// @match        http://impress.openneo.net/*
// @match        https://impress.openneo.net/*
// @downloadURL https://update.greasyfork.org/scripts/401354/Dress%20to%20Impress%20Wishlist%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/401354/Dress%20to%20Impress%20Wishlist%20Link.meta.js
// ==/UserScript==

var $ = window.jQuery;
$("div#userbar > span").append("&nbsp;&nbsp;");
$("div#userbar > span").append("<a href=\"//impress.openneo.net/users/current-user/closet#closet-hangers-group-false\"></>Wishlist</a>");