// ==UserScript==
// @name         GrinchIsChristmas
// @description  Returning achievement for Grinch event its cool background.
// @author       Маг-Лесник
// @include      https://www.heroeswm.ru/pl_info.php*
// @include      https://www.lordswm.com/pl_info.php*
// @version 0.0.1.20190105174512
// @namespace https://greasyfork.org/users/237529
// @downloadURL https://update.greasyfork.org/scripts/376364/GrinchIsChristmas.user.js
// @updateURL https://update.greasyfork.org/scripts/376364/GrinchIsChristmas.meta.js
// ==/UserScript==


    var icons = document.getElementsByTagName("img");


    var i, n = icons.length;
    for (i=0;i<n;i++){
        if (icons[i].src.indexOf("grinch.png") !== -1)
        {
            icons[i].src = "https://i.imgur.com/ZfoMCCW.jpg";
        }
    }