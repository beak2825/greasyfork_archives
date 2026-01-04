// ==UserScript==
// @name         GeoFS免费HD，新版本（3.9）可用
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  GeoFS HD 破解，新版本（3.9）可用。
// @author       Fly_Computer
// @match        https://www.geo-fs.com/geofs.php*
// @match        http://www.geo-fs.com/geofs.php*
// @icon         https://www.geo-fs.com/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518317/GeoFS%E5%85%8D%E8%B4%B9HD%EF%BC%8C%E6%96%B0%E7%89%88%E6%9C%AC%EF%BC%8839%EF%BC%89%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518317/GeoFS%E5%85%8D%E8%B4%B9HD%EF%BC%8C%E6%96%B0%E7%89%88%E6%9C%AC%EF%BC%8839%EF%BC%89%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        geofsNewHDState = true;
        geofs.geoIpUpdate = async function() {
            document.body.classList.add('geofs-hd');
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MGYwZGY2Yy04MjhjLTRiZGYtYWI2MS00ZTdiYjdjYjZiNTAiLCJpZCI6MjE5Mzk5LCJpYXQiOjE3MTczMTcxMDV9.TlcOjfjsc7-hIIiy7ReCyM_2mJ5gyMGIAN77g3qE-Kg'
            geofs.api.imageryProvider = new Cesium.IonImageryProvider({assetId:2});
            geofs.api.setImageryProvider(geofs.api.imageryProvider, false, null, null, null, 'bing');
            geofs.api.setTerrainProvider(new geofs.api.FlatRunwayTerrainProvider({
                baseProvider: new Cesium.CesiumTerrainProvider({
                    url: 'https://data2.geo-fs.com/srtm/',
                    requestWaterMask: false,
                    requestVertexNormals: true
                }),
                bypass: false,
                maximumLevel: 12
            }), 'geofs');
            geofs.api.analytics.event('geofs', 'mode', 'hd', 1);
        };
        geofs.geoIpUpdate();
        //geofs.api.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({url:Cesium.IonResource.fromAssetId(2275207)}))
    }

    function executeFunctionUntilSuccess(func) {
        let intervalId;
        function tryExecute() {
            try {
                func();
                clearInterval(intervalId);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
        intervalId = setInterval(tryExecute, 3000);
    }
    executeFunctionUntilSuccess(main)
    "use strict";

    const provider = "google";
    const multiplayerServer = "default"

    window.geofsNewHDState = true;
    window.geofs.geoIpUpdate = function() {
        delete window.geofs.api.analytics;
        document.body.classList.add("geofs-hd");

        if (multiplayerServer !== "default") {
            window.geofs.multiplayerHost = multiplayerServer;
        }

        switch (provider) {
            case "cache":
                window.geofs.api.imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
                    maximumLevel: 21,
                    hasAlphaChannel: false,
                    subdomains: "abcdefghijklmnopqrstuvwxyz".split(""),
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

    //document.querySelectorAll("body > div.geofs-adbanner.geofs-adsense-container")[0].remove();
})();