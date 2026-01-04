// ==UserScript==
// @name         GeoFS Ad Remover
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Simple script to remove ads in GeoFS
// @author       dazachknow
// @match        https://www.geo-fs.com/geofs.php
// @icon         https://www.geo-fs.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443618/GeoFS%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/443618/GeoFS%20Ad%20Remover.meta.js
// ==/UserScript==

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
removeElementsByClass("geofs-adbanner geofs-adsense-container");
