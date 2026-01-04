// ==UserScript==
// @name         Itálie Serie A2 - přesměrování
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměrování na live netcasting
// @author       Michal
// @match        https://netcasting3.webpont.com/?ita2_*
// @icon         https://netcasting3.webpont.com/art/league/ita/lnp.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478660/It%C3%A1lie%20Serie%20A2%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/478660/It%C3%A1lie%20Serie%20A2%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL = window.location.href;
    var match = currentURL.match(/https:\/\/netcasting3\.webpont\.com\/\?ita2_(a|b)_(\d+)/);
    if (match) {
        var itaType = match[1];
        var id = match[2];
        var newURL = "https://netcasting.webpont.com/?ita2_" + itaType + "_" + id;
        window.location.replace(newURL);
    }
})();
