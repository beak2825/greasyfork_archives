// ==UserScript==
// @name         InsertLatLongCoord
// @namespace    Munzee
// @version      1.1
// @description  Make coordinates insert earier :)
// @author       CzPeet
// @license      MIT
// @match        https://www.munzee.com/m/*/*/admin/map/
// @update       https://greasyfork.org/hu/scripts/373967-insertlatlongcoord
// @downloadURL https://update.greasyfork.org/scripts/373967/InsertLatLongCoord.user.js
// @updateURL https://update.greasyfork.org/scripts/373967/InsertLatLongCoord.meta.js
// ==/UserScript==

var lat = document.getElementById("latitude");
var lng = document.getElementById("longitude");

var btn = lat.parentNode.parentNode.children[3];

lat.addEventListener('keyup', latKeyUp, false);

function latKeyUp(e)
{
    var coords = lat.value.split(/[\s]+/).filter(String);

    if (coords.length == 2)
    {
        lat.value = coords[0];
        lng.value = coords[1];

        btn.click();
    }
}