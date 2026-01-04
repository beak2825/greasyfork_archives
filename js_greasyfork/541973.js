// ==UserScript==
// @name         Speed Limits Viewer
// @license MIT
// @namespace    https://shryder.me/
// @version      2025-07-07
// @description  A visualizer for the GPS Speed Limits Logger app
// @author       Shryder
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @icon            https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://update.greasyfork.org/scripts/509664/1461898/WME%20Utils%20-%20Bootstrap.js
// @require         https://greasyfork.org/scripts/389765-common-utils/code/CommonUtils.js?version=1090053
// @require         https://greasyfork.org/scripts/450160-wme-bootstrap/code/WME-Bootstrap.js?version=1090054
// @require         https://greasyfork.org/scripts/452563-wme/code/WME.js?version=1101598
// @require         https://greasyfork.org/scripts/450221-wme-base/code/WME-Base.js?version=1101617
// @require         https://greasyfork.org/scripts/450320-wme-ui/code/WME-UI.js?version=1101616
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541973/Speed%20Limits%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/541973/Speed%20Limits%20Viewer.meta.js
// ==/UserScript==

var SpeedLimitReports_Layer;
const icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiMwMDdiZmYiIHN0cm9rZT0iIzAwNTZiMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjAiIHk9IjI1IiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xPC90ZXh0Pjwvc3ZnPg==';

const speedLimitIcon = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" fill="white" stroke="red" stroke-width="4"/>
  <text x="50" y="60" text-anchor="middle" font-size="36" font-family="Arial, sans-serif" fill="black">##speedlimit##</text>
</svg>
`;

const icon0 = `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#007bff" stroke="#0056b3" stroke-width="2"/>
  <text x="20" y="25" font-size="20" font-family="Arial, sans-serif" fill="white" text-anchor="middle">1</text>
</svg>
`;

const icon1 = `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#007bff" stroke="#0056b3" stroke-width="2"/>
  <text x="20" y="25" font-size="20" font-family="Arial, sans-serif" fill="white" text-anchor="middle">2</text>
</svg>
`;

const icon2 = `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#007bff" stroke="#0056b3" stroke-width="2"/>
  <text x="20" y="25" font-size="20" font-family="Arial, sans-serif" fill="white" text-anchor="middle">3</text>
</svg>
`;
(async function() {
    'use strict';

    let helper, tab, uuidInput;

    let sdk = await bootstrap();

    function setupTab() {
        const BUTTONS = {
            A: {
                title: "Fetch",
                description: "Desc",
                callback: function() {
                    console.log('[GPSSpeedLimitsLogger] Fetching...');
                    let uuidInput = document.getElementById("speed-limits-reports-viewer-speed-limit-log-id");

                    fetchReports(uuidInput.value);

                    return false;
                }
            },
            ClearUI: {
                title: "Clear",
                description: "Clear Speed Limit logger UI elements",
                callback: function() {
                    SpeedLimitReports_Layer.removeAllFeatures();

                    return false;
                }
            },
        };

        console.log("Hello", sdk.State.getUserInfo().userName, WazeWrap);

        let helper = new WMEUIHelper("Speed Limits Reports Viewer");
        let tab = helper.createTab("Speed Limit Reports");
        tab.addButtons(BUTTONS);
        tab.addInput("speed-limit-log-id", "UUID to Fetch", "", () => {}, "30-06-2025-19_21_32___bce7c826-13bf-425d-8890-9254f5b3d7ee");

        tab.inject();
    }

    function buildReport(report) {
        let style = {
            externalGraphic: icon,
            graphicWidth: 32,
            graphicHeight: 38,
            graphicYOffset: -42,
            fillOpacity: 1,
            title: 'LiveMap',
            cursor: 'help'
        };

        const reportLocation_icon = "data:image/svg+xml;base64," + btoa(speedLimitIcon.replaceAll("##speedlimit##", report.speedLimit));
        let coords = OpenLayers.Layer.SphericalMercator.forwardMercator(report.gpsLocation.long, report.gpsLocation.lat);
        let reportLocation = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(coords.lon,coords.lat), { speedLimit: report.speedLimit }, { ...style, externalGraphic: reportLocation_icon });

        /*
        TODO
        const prev0_icon = "data:image/svg+xml;base64," + btoa(icon0);
        let prev0_location = report.previousGpsLocations[0];
        let prev0_coords = OpenLayers.Layer.SphericalMercator.forwardMercator(prev0_location.long, prev0_location.lat);
        let prev0 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(prev0_coords.lon,prev0_coords.lat), { speedLimit: 0 }, { ...style, externalGraphic: prev0_icon })

        const prev1_icon = "data:image/svg+xml;base64," + btoa(icon1);
        let prev1_location = report.previousGpsLocations[1];
        let prev1_coords = OpenLayers.Layer.SphericalMercator.forwardMercator(prev1_location.long, prev1_location.lat);
        let prev1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(prev1_coords.lon,prev1_coords.lat), { speedLimit: 0 }, { ...style, externalGraphic: prev1_icon })

        const prev2_icon = "data:image/svg+xml;base64," + btoa(icon2);
        let prev2_location = report.previousGpsLocations[2];
        let prev2_coords = OpenLayers.Layer.SphericalMercator.forwardMercator(prev2_location.long, prev2_location.lat);
        let prev2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(prev2_coords.lon,prev2_coords.lat), { speedLimit: 0 }, { ...style, externalGraphic: prev2_icon })
        */
        return [ reportLocation ];
    }

    function fetchReports(filename) {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://speedlimits.shryder.me/api/logs/${filename}.json`,
        onload: function(response){
            if (response.status < 200 || response.status > 300) {
                console.log("[GPSSpeedLimitsLogger] Error fetching speed limit logs", response);
                return;
            }

            let response_json = JSON.parse(response.response);
            console.log("[GPSSpeedLimitsLogger] Loaded report logs:", response, response_json);

            if (!("success" in response_json) || !response_json.success) {
                console.log("[GPSSpeedLimitsLogger] Error fetching", response);
                return;
            }

            SpeedLimitReports_Layer.removeAllFeatures();
            for (let i = 0; i < response_json.data.length; i++) {
                SpeedLimitReports_Layer.addFeatures(buildReport(response_json.data[i]));
            }

            console.log("[GPSSpeedLimitsLogger] Finished loading reports into layer");
            SpeedLimitReports_Layer.redraw();
        },
        onerror: (error) => {
            console.log("[GPSSpeedLimitsLogger] Error loading speed limit reports", error);
        }
      });
    }

    function main() {
        setupTab();

        // TODO: titles and labels
        let styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                // fillColor: '${fillColor}',
                // fillOpacity: '${opacity}',
                fontColor: '#111111',
                fontWeight: 'bold',
                strokeColor: '#ffffff',
                // strokeOpacity: '${opacity}',
                strokeWidth: 2,
                // pointRadius: '${radius}',
                label: '${title}',
                title: '${title}'
            }, {
                context: {
                    title: (feature) => {
                        if (feature.attributes && feature.attributes.speedLimit) return `${feature.speedLimit} km/h`;

                        return "N/A";
                    }
                }
            })
        });

        SpeedLimitReports_Layer = new OpenLayers.Layer.Vector("Speed Limit Reports", {
            uniqueName: "__speedlimit_reports",
            styleMap: styleMap
        });

        SpeedLimitReports_Layer.setVisibility(true);

        W.map.addLayer(SpeedLimitReports_Layer);

        console.log("[GPSSpeedLimitsLogger] Ready.");
    }

    main();
})();