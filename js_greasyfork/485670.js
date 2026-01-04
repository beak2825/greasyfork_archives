// ==UserScript==
// @name         Better Resolution Terrain
// @namespace    http://tampermonkey.net/
// @version      2024-01-21
// @description  Gets higher resolution images and blocks ads
// @author       drakeerv
// @match        https://www.geo-fs.com/geofs.php?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485670/Better%20Resolution%20Terrain.user.js
// @updateURL https://update.greasyfork.org/scripts/485670/Better%20Resolution%20Terrain.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const provider = "google";

    window.geofsNewHDState = true;
    window.geofs.geoIpUpdate = function() {
        document.body.classList.add("geofs-hd");

        switch (provider) {
            case "cache":
                window.geofs.api.imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
                    maximumLevel: 21,
                    hasAlphaChannel: false,
                    url: "http://localhost/map/{z}/{x}/{y}"
                });
                break;
            case "google":
                window.geofs.api.imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
                    maximumLevel: 21,
                    hasAlphaChannel: false,
                    subdomains: ["mt0", "mt1", "mt2", "mt3"],
                    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                });
                break;
            case "apple":
                window.geofs.api.imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
                    maximumLevel: 21,
                    hasAlphaChannel: false,
                    subdomains: ["sat-cdn1", "sat-cdn2", "sat-cdn3", "sat-cdn4"],
                    url: "https://{s}.apple-mapkit.com/tile?style=7&size=1&scale=1&z={z}&x={x}&y={y}&v=9651&accessKey=1705988638_4603104305979553294_%2F_Qvq1XXyXG5w0IUYlFOsIQsxLt2ALxm32i%2BAMbLIFD5s%3D"
                });
                break;
            case "bing":
                window.geofs.api.imageryProvider = new window.Cesium.BingMapsImageryProvider({
                    url: "https://dev.virtualearth.net",
                    key: "AjrgR5TNicgFReuFwvNH71v4YeQNkXIB20l63ZMm86mVuBGZPhTHMkdiVq2_9L7x",
                    mapStyle: window.Cesium.BingMapsStyle.AERIAL
                });
                break;
            default: break
        }

        window.geofs.api.setImageryProvider(window.geofs.api.imageryProvider, false);
        window.geofs.api.viewer.terrainProvider = window.geofs.api.flatRunwayTerrainProviderInstance = new window.geofs.api.FlatRunwayTerrainProvider({
            baseProvider: new window.Cesium.CesiumTerrainProvider({
                url: "https://data.geo-fs.com/srtm/",
                requestWaterMask: false,
                requestVertexNormals: true
            }),
            bypass: false,
            maximumLevel: 12
        });
    };
    window.executeOnEventDone("geofsStarted", function() {
        if (window.geofs.api.hdOn === window.geofsNewHDState) return;
        window.jQuery("body").trigger("terrainProviderWillUpdate");
        window.geofs.geoIpUpdate();
        window.geofs.api.hdOn = window.geofsNewHDState;
        window.geofs.api.renderingQuality();
        window.jQuery("body").trigger("terrainProviderUpdate");
    });
    window.executeOnEventDone("afterDeferredload", function() {
        window.geofs.mapXYZ = "https://data.geo-fs.com/osm/{z}/{x}/{y}.png";
    });

    document.querySelectorAll("body > div.geofs-adbanner.geofs-adsense-container")[0].remove();
})();