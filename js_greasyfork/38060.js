// ==UserScript==
// @name         Mefi OSM
// @namespace    exp?zworp!
// @version      0.667
// @description  Replace Google Maps with OpenStreetMap on Metafilter
// @author       farlukar
// @match        https://www.metafilter.com/user/*
// @match        https://irl.metafilter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38060/Mefi%20OSM.user.js
// @updateURL https://update.greasyfork.org/scripts/38060/Mefi%20OSM.meta.js
// ==/UserScript==


// link in user profile
if (document.URL.match(/https:\/\/www.metafilter.com\/user\/*/)) {

    let mapLink = document.querySelector("a[title='View on Google Maps']");
    let coordinates = mapLink.href.replace(/.*ll=([^&]*)&.*/,"\$1").split(',');
    mapLink.href = "https://www.openstreetmap.org/?mlat=" + coordinates[0] + "&mlon=" + coordinates[1] + "#map=4/" + coordinates[0] + "/" + coordinates[1];
    mapLink.title = "View on OpenStreetMap";

}


// map in irl
if (document.URL.match(/https:\/\/irl.metafilter.com\/*/)) {

    let address = document.querySelector("div#address a");
    let ll = address.href.split('@');
    let coordinates = ll[1].split(',');
    let lat = Number(coordinates[0]);
    let lon = Number(coordinates[1]);
    let toplat = String(lat + 0.005);
    let bottomlat = String(lat - 0.005);
    let leftlon = String(lon - 0.013);
    let rightlon = String(lon + 0.013);
    lat = String(lat);
    lon = String(lon);
    let showMap = document.getElementById("map");
    showMap.innerHTML = "<iframe width='580' height='200' frameborder='0' scrolling='no' style='margin:0' src='https://www.openstreetmap.org/export/embed.html?bbox=" + leftlon + "," + bottomlat + "," + rightlon +"," + toplat + "&amp;marker=" + lat + "," + lon + "'></iframe>";
    address.href = "https://www.openstreetmap.org/directions?engine=osrm_car&route=;" + lat + "," + lon + "#map=12/" + lat + "/" +lon;

}