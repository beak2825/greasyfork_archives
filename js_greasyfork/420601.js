// ==UserScript==
// @name        Favorites enumerator
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/favorites.php*
// @require     http://code.jquery.com/jquery-3.5.1.min.js
// @grant       none
// @version     1.0
// @author      Smelly Stinkowitz
// @description 1/23/2021
// @downloadURL https://update.greasyfork.org/scripts/420601/Favorites%20enumerator.user.js
// @updateURL https://update.greasyfork.org/scripts/420601/Favorites%20enumerator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rows = $(".glink");
    var page = $(location).attr("href");
    var num  = page.indexOf("page");
    var mult = 0;
    if (num > -1)
    {
        var argu = page.substring(num);
        var eqp  = argu.indexOf("=");
        var ns   = argu.substring(eqp+1);
        mult     = parseInt(ns);
    }

    for (var i = 0; i < rows.length; i++)
    {
        var s = rows[i].innerHTML;
        var t = "{" + (50*mult + (i+1)).toString() + "} -- " + s;
        rows[i].innerHTML = t;
    }
})();