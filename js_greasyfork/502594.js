// ==UserScript==
// @name         GeoFSMax-破解GeoFS，免费解锁GeoFS高清地景，极限优化GeoFS建筑，替换地图使用Google Earth（geo-fs）
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  全网第一个GeoFS（www.geo-fs.com）破解脚本，永久免费使用GeoFS付费高清地景，帮你节省近80元/年订阅费。告别GeoFS的纸盒子建筑，体验Google Earth的超细节建筑。
// @author       MelonFish
// @match        https://www.geo-fs.com/geofs.php*
// @match        http://www.geo-fs.com/geofs.php*
// @icon         https://www.geo-fs.com/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502594/GeoFSMax-%E7%A0%B4%E8%A7%A3GeoFS%EF%BC%8C%E5%85%8D%E8%B4%B9%E8%A7%A3%E9%94%81GeoFS%E9%AB%98%E6%B8%85%E5%9C%B0%E6%99%AF%EF%BC%8C%E6%9E%81%E9%99%90%E4%BC%98%E5%8C%96GeoFS%E5%BB%BA%E7%AD%91%EF%BC%8C%E6%9B%BF%E6%8D%A2%E5%9C%B0%E5%9B%BE%E4%BD%BF%E7%94%A8Google%20Earth%EF%BC%88geo-fs%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502594/GeoFSMax-%E7%A0%B4%E8%A7%A3GeoFS%EF%BC%8C%E5%85%8D%E8%B4%B9%E8%A7%A3%E9%94%81GeoFS%E9%AB%98%E6%B8%85%E5%9C%B0%E6%99%AF%EF%BC%8C%E6%9E%81%E9%99%90%E4%BC%98%E5%8C%96GeoFS%E5%BB%BA%E7%AD%91%EF%BC%8C%E6%9B%BF%E6%8D%A2%E5%9C%B0%E5%9B%BE%E4%BD%BF%E7%94%A8Google%20Earth%EF%BC%88geo-fs%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        //geofsNewHDState = true;
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
})();