// ==UserScript==
// @name         Munzee Map Fixes
// @namespace    MunzeeMap
// @version      1.0.2
// @description  Munzee Website Map fixes for September 2018. Adds Satellite Toggle, Fixes Pin Stacking and Removes Outer Zoom Limit
// @author       MOBlox
// @match        https://www.munzee.com/map/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372571/Munzee%20Map%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/372571/Munzee%20Map%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var x = $('.mapboxgl-marker');
        for(var i = 0;i < x.length;i++){
            x[i].style.zIndex = x[i].getBoundingClientRect().top * 1 + 1;
        }
        map.setMinZoom(0);
        $('.mapboxgl-popup').css('z-index',10000000)
    });
    $('.map-box-right-side-menu')[0].innerHTML += '<div id="togsat"><input style="margin-top: 10px; margin-right: 5px; width: 115px;" class="btn btn-success btn-medium-green btn-xs" id="togglesatellite" type="button" value="Toggle Satellite" onclick="toggleSat()"></div>'
    // Your code here...
})();
window.satell = false;
window.toggleSat = function(){
    if(satell){
        streets();
    } else {
        satellite();
    }
    satell =  !satell;
}
window.satellite = function(){
    map.setStyle('https://maps.tilehosting.com/styles/hybrid/style.json?key=2corAGubIXz12RsQ6GGt')
}
window.streets = function(){
    map.setStyle('https://maps.tilehosting.com/styles/streets/style.json?key=2corAGubIXz12RsQ6GGt')
}