// ==UserScript==
// @name         Munzee Location Address
// @version      0.1
// @description  Add Address back to Munzee Page
// @author       sohcah
// @match        https://www.munzee.com/m/*/*/
// @match        https://www.munzee.com/m/*/*
// @match        https://www.munzee.com/m/*/*/*
// @match        https://www.munzee.com/m/*/*/*/
// @grant        none
// @namespace https://greasyfork.org/users/398283
// @downloadURL https://update.greasyfork.org/scripts/393524/Munzee%20Location%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/393524/Munzee%20Location%20Address.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lat = $('#locationtext').attr('data-latitude')
    var lon = $('#locationtext').attr('data-longitude')
    $.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18`,function(data){
        $('#locationtext').text(data.display_name)
    })
    //https://nominatim.openstreetmap.org/reverse?format=json&lat=52.5487429714954&lon=-1.81602098644987&zoom=18
    // Your code here...
})();