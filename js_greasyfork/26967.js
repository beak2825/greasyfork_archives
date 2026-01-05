// ==UserScript==
// @name        Show coordinates on LandAndFarm.com
// @namespace   shawndellysse.com
// @include     http://www.landandfarm.com/property/*
// @version     1
// @grant       none
// @esversion   6
// @description Adds a row to the http://landandfarm.com property pages showing the latitude / longitude and a link to google maps at that location
// @downloadURL https://update.greasyfork.org/scripts/26967/Show%20coordinates%20on%20LandAndFarmcom.user.js
// @updateURL https://update.greasyfork.org/scripts/26967/Show%20coordinates%20on%20LandAndFarmcom.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
  const geoSpan = document.querySelector("span[itemtype='http://schema.org/GeoCoordinates']");
  if (geoSpan) {
    const latitude  = geoSpan.querySelector("meta[itemprop='latitude']").content;
    const longitude = geoSpan.querySelector("meta[itemprop='longitude']").content;
    
    const tableBody = document.querySelector(".additionalInfo .infoSection table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="infoLabel">Location:</td>
      <td class="infoValue">
       ${ latitude }, ${ longitude }
       <em><a href="https://maps.google.com/maps?z=16&t=h&q=loc:${ latitude }+${ longitude }" target="_blank">(gmaps)</a></em>
      </td>
    `
    tableBody.append(row);
  }
}).call(this);