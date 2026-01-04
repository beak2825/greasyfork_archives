// ==UserScript==
// @name        OpenStreetMap IP Geolocation
// @namespace   Violentmonkey Scripts
// @match       *://www.openstreetmap.org/*
// @grant       GM.xmlhttpRequest
// @connect     ip-api.com
// @version     1.5
// @author      CyrilSLi
// @description Overrides the "Show My Location" button to provide location from IP geolocation
// @license     MIT
// @require     https://update.greasyfork.org/scripts/533461/1652653/Get%20OpenStreetMap%20Leaflet%20object.js
// @downloadURL https://update.greasyfork.org/scripts/523523/OpenStreetMap%20IP%20Geolocation.user.js
// @updateURL https://update.greasyfork.org/scripts/523523/OpenStreetMap%20IP%20Geolocation.meta.js
// ==/UserScript==

unsafeWindow.onOSMReady(() => {
    if (!unsafeWindow.userscriptMap) {
        return;
    }
    GM.xmlhttpRequest({
        method: "GET",
        url: "http://ip-api.com/json/",
        onload: function(response) {
            ipJSON = JSON.parse(response.responseText);
            geoButton = document.getElementsByClassName("control-locate")[0].children[0];
            geoButton.parentNode.replaceChild(geoButton.cloneNode(true), geoButton);
            tooltips = document.getElementsByClassName("tooltip-inner");
            while(tooltips[0]) {
                container = tooltips[0].parentNode;
                container.parentNode.removeChild(container);
            }
            geoButton = document.getElementsByClassName("control-locate")[0].children[0];
            geoButton.addEventListener("click", ev => {
                unsafeWindow.userscriptMap.setView([ipJSON["lat"], ipJSON["lon"]], 12);
            });
            keyButton = document.getElementsByClassName("control-legend")[0].children[0];
            keyButton.click();
            keyButton.click();
        }
    });
});