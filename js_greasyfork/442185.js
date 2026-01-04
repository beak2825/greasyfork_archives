// ==UserScript==
// @name         REMARKABLE Markers - Icon Progress Tracking for Fextralife Elden Ring Interactive Map
// @description  Enables icon-based progress tracking to mark & hide explored locations (pickups, bosses, etc.) manually. Works on Fextralife Elden Ring map only. Legal notice: This userscript runs in parallel with Fextralife's own progress tracking feature, and does not seek to hack & unlock Fextralife's VIP functions. Warning: All user data are stored locally using the GM_setValue feature, Handle your saved progress with care!
// @namespace    https://tonkovski.github.io/
// @version      0.3
// @match        *://eldenring.wiki.fextralife.com/file/Elden-Ring/*
// @license      GPL-3.0-or-later
// @author       Evan Tonkovski
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAbNQTFRFq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5Zvq5ZvAAAAq5ZvcfDRDwAAAJF0Uk5Td3GEqrYkg3jO3jVZcoVIvbFHxX98WKVWTvR74NqKOG5wt5FgbZSXfSAqy4/Y+yhCgVx+c1egMZUUvjJ6Ioh0SWpeYqNdkGeOjWkrOiOZRmx5NxxrQ5wMCzRTHloHJUyLW3ZSNkGCH28pPRoYSxGMFmYvSjthOS4XLRkmEj8QZCEbCQ1NFRMPDgYKCAQDBQIAAdYamOwAAAIiSURBVDjLfZNVl9wwDIW3zMy4ZaZlZmbm3WFmZg6DLf/kJulOZ5LpqZ98rz5bsnzUBtrCRJIJASAYiKqJamm7NlUpS5SwRjJJLU4wKxGNOAWwTLBwWDtGtDsv1oJV1dABknIh2kzFv3757kz84LSoDqjLvZ1vjN5pBlTHc6CTrYA/p1b0HyC5qkj5XwD+YwQ+1LXcAmACwuDQ64Os5sjYCMgcFF+MPzVH3scAKZ3VpwCBEyHd3ltxT/nBciQifQ0KLUmYfxm93z17173ieFcGPSBiXlG7sRHzYvSGq+t5yWUAQEYIeMEZGov1XOm+M/7sFYjYUAPKI9PtMPRfu2xOw+OBSTAUKUH2kXcN8vFkp2eUTE9szcqgA/i9rDNz0ZGm7Vawpx6Gtt8yeoD02xIXutqG+KudUOgZmaFtAq92rgHATUuvZbDj/LmB630T1n1mPksMwOZktdJBRW1nM9ZEACpzSJ8CaHY1LOciG0lK3EkAUAHW8FkI4qHUMJyZmw95WZf9Y5UYP4uAo+/SkunWkykPNfqGk5obJWN1CLgi8+BexDRTWl+IF31aFNVvSJ8ofUNBAddQeYHxDVcqWpj7mwKfFHkAnkUILU/7wjlKGSLhqCQ0JgtweaOmNFdml8eqflGJe39RAuj6QO9HP+c+VcMxoGv5pZ8ZpB1segWAdLhW2t5aWY9kCoXj02Mtk7W7WEiV5cbT9QDGRBSDzXOiBH8Dvw37Rr97UUUAAAAASUVORK5CYII=
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/442185/REMARKABLE%20Markers%20-%20Icon%20Progress%20Tracking%20for%20Fextralife%20Elden%20Ring%20Interactive%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/442185/REMARKABLE%20Markers%20-%20Icon%20Progress%20Tracking%20for%20Fextralife%20Elden%20Ring%20Interactive%20Map.meta.js
// ==/UserScript==

(function() {
    var markAsFoundButtonHTML = '<a href="#" id="foundButton" class="wiki_link">Mark as found</a>';
    var markAsNotFoundButtonHTML = '<a href="#" id="notFoundButton" class="wiki_link">Mark as not found</a>';
    var foundItems = new Set(GM_getValue("foundItems"));

    function markAsFound() {
        var currMarkID = parseInt($(".leaflet-popup-content").children().attr("data"));
        var tempStr;
        var layerID;
        for (var i in map._layers) {
            tempStr = map._layers[i]._popup;
            if (tempStr === undefined) continue;
            tempStr = map._layers[i]._popup._content;
            layerID = parseInt(parseInt(tempStr.slice(tempStr.indexOf("=")+2, tempStr.indexOf(">")-1)));
            if (layerID == currMarkID) {
                map._layers[i].setOpacity(0.3);
            }
        }
        foundItems.add(currMarkID);
        GM_setValue("foundItems", [...foundItems]);
    }

    function markAsNotFound() {
        var currMarkID = parseInt($(".leaflet-popup-content").children().attr("data"));
        var tempStr;
        var layerID;
        for (var i in map._layers) {
            tempStr = map._layers[i]._popup;
            if (tempStr === undefined) continue;
            tempStr = map._layers[i]._popup._content;
            layerID = parseInt(parseInt(tempStr.slice(tempStr.indexOf("=")+2, tempStr.indexOf(">")-1)));
            if (layerID == currMarkID) {
                map._layers[i].setOpacity(1);
            }
        }
        foundItems.delete(currMarkID);
        GM_setValue("foundItems", [...foundItems]);
    }

    function refreshFoundItems() {
        var tempStr;
        var layerID;
        for (var i in map._layers) {
            tempStr = map._layers[i]._popup;
            if (tempStr === undefined) continue;
            tempStr = map._layers[i]._popup._content;
            layerID = parseInt(parseInt(tempStr.slice(tempStr.indexOf("=")+2, tempStr.indexOf(">")-1)));
            if (foundItems.has(layerID)) map._layers[i].setOpacity(0.3);
        }
    }

    $("body").on("click", function() {
        console.log(foundItems);
        refreshFoundItems();
    })

    $("body").on("click", ".leaflet-marker-icon", function() {
        var currMarkID = parseInt($(".leaflet-popup-content").children().attr("data"));
        if (foundItems.has(currMarkID)) $(".leaflet-popup-content").append(markAsNotFoundButtonHTML);
        else $(".leaflet-popup-content").append(markAsFoundButtonHTML);
    })

    $("body").on("click", "#foundButton", function() {
        markAsFound();
        map.closePopup();
    })

    $("body").on("click", "#notFoundButton", function() {
        markAsNotFound();
        map.closePopup();
    })
})();