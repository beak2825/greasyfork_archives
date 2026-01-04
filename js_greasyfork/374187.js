// ==UserScript==
// @name         Leynar's missing avatar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ...
// @author       W. D. Gaster
// @match        https://animebytes.tv/forums.php*action=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374187/Leynar%27s%20missing%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/374187/Leynar%27s%20missing%20avatar.meta.js
// ==/UserScript==
 var avatarURL = $(".user_41236 .signature span a").attr("href");
    $(".user_41236 .avatar img").attr({src: avatarURL, title: "Leynar's avatar"});