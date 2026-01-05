// ==UserScript==
// @name         Munzee Specials Map filter
// @namespace    http://lakrisoft.com/
// @author       Lars Haugaard Kristensen
// @version      1.0
// @description  Filter the Munzee specials map by type
// @match        https://www.munzee.com/specials*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27576/Munzee%20Specials%20Map%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/27576/Munzee%20Specials%20Map%20filter.meta.js
// ==/UserScript==

var currentType = null;

(function() {
    'use strict';
    var version = '1.0';
    console.log("Munzee Specials Map filter version: " + version);
    $("img[src^='https://munzee.global.ssl.fastly.net/images/pins/']").click(specialIconClicked);
    $("th:contains('Captures')").text('Captures - click special icon to filter');
})();

function specialIconClicked(e) {
    var clickedImage = e.target.src;

    // Clear the 'selected' border on all special icons
    $("img[src^='https://munzee.global.ssl.fastly.net/images/pins/']").css({
        "border": "0px",
        "border-radius": "0"
    });

    if (clickedImage == currentType) {
        currentType = null;
        filterMarkers(null);
    } else {
        currentType = clickedImage;

        $(e.target).css({
            "border": "3px solid green",
            "border-radius": "3"
        });

        filterMarkers(clickedImage);
    }
}

filterMarkers = function(type) {
    for (i = 0; i < map.markers.length; i++) {
        marker = map.markers[i];
        marker.setVisible(type === null || marker.icon.url == type);
    }
};