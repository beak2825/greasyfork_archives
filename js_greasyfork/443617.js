// ==UserScript==
// @name         GeoFS Attribute Editor
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Edit attributes of your plane, like Max Throttle, Scale, and Mass.
// @author       You
// @match        https://www.geo-fs.com/geofs.php
// @icon         https://www.geo-fs.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443617/GeoFS%20Attribute%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/443617/GeoFS%20Attribute%20Editor.meta.js
// ==/UserScript==

/* FEATURES */
/*
Set minimum RPM to 10000. Sliders will be implemented later as i've already tried using them and it didn't work :/

*/






// document.getElementById("geofs-ui-3dview").innerHTML += dragWin;



var rpmhax = `<div style="width:100px;height:200px;background-color:grey;">
  <button onclick="geofs.aircraft.instance.setup.minRPM = 10000;geofs.aircraft.instance.setup.maxRPM = 100000">RPM 10000</button>
</div>`

document.body.innerHTML += rpmhax;