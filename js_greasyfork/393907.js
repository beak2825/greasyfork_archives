// ==UserScript==
// @name         Munzee Map Pin Stacking
// @version      1.0.2
// @description  Fixed Pin Stacking on New OSM Maps on Munzee's Website. Also removes outer zoom limit.
// @author       sohcah
// @match        https://www.munzee.com/*
// @grant        none
// @namespace https://greasyfork.org/users/398283
// @downloadURL https://update.greasyfork.org/scripts/393907/Munzee%20Map%20Pin%20Stacking.user.js
// @updateURL https://update.greasyfork.org/scripts/393907/Munzee%20Map%20Pin%20Stacking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(map){
        setInterval(function(){
            var x = $('.mapboxgl-marker');
            for(var i = 0;i < x.length;i++){
                x[i].style.zIndex = x[i].getBoundingClientRect().top * 1 + 1;
            }
            map.setMinZoom(0);
            $('.mapboxgl-popup').css('z-index',10000000)
        });
    }
})();