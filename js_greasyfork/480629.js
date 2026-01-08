// ==UserScript==
// @name            report button for partnerhub
// @description     Adds a beautiful purple report button using internal projection conversion (Turf-style).
// @namespace       https://greasyfork.org/en/users/715686-aseele-h
// @version         2026.01.08.13
// @author          aseele
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/480629/report%20button%20for%20partnerhub.user.js
// @updateURL https://update.greasyfork.org/scripts/480629/report%20button%20for%20partnerhub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Internal conversion function (Matches Turf.js projection logic)
    function toWGS84(x, y) {
        var lon = (x * 180) / 20037508.34;
        var lat = (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
        return { lon: lon.toFixed(6), lat: lat.toFixed(6) };
    }

    function generateURL() {
        var zoom = W.map.getZoom();
        var center = W.map.getCenter();

        // Convert WME Mercator to Standard Lat/Lon
        var coords = toWGS84(center.lon, center.lat);

        return `https://www.waze.com/partnerhub/map-tool/alerts?lon=${coords.lon}&lat=${coords.lat}&initialZoom=${zoom}`;
    }

    function openRT(e) {
        if (e) e.preventDefault();
        window.open(generateURL(), "_blank");
    }

    function init_OPEN_REPORTING_TOOL() {
        // Wait for Waze to be ready
        if (typeof W === 'undefined' || !W.map || !W.map.getCenter) {
            setTimeout(init_OPEN_REPORTING_TOOL, 500);
            return;
        }

        var toolbarWrap = document.querySelector('.WazeControlPermalink');
        if (toolbarWrap !== null) {
            if (document.getElementById("btn-openrt")) return;

            var container = document.createElement('div');
            container.id = "WME_PH_REPORT";
            container.style.display = "inline-block";
            container.style.marginLeft = "10px";
            container.style.verticalAlign = "middle";

            container.innerHTML = `
                <a href="#" id="btn-openrt" style="
                    display: flex;
                    align-items: center;
                    background-color: #6500ff;
                    color: white;
                    padding: 5px 14px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-family: 'Rubik', sans-serif;
                    font-weight: 500;
                    font-size: 13px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 7px;">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    REPORT
                </a>
            `;

            toolbarWrap.after(container);

            var btn = document.getElementById("btn-openrt");
            btn.onmouseover = function() { 
                this.style.backgroundColor = "#5200cc"; 
                this.style.transform = "scale(1.05)";
            };
            btn.onmouseout = function() { 
                this.style.backgroundColor = "#6500ff"; 
                this.style.transform = "scale(1)";
            };

            btn.addEventListener("click", openRT, false);
            console.info('Partnerhub Button: Fixed & Ready');
        } else {
            setTimeout(init_OPEN_REPORTING_TOOL, 1000);
        }
    }

    init_OPEN_REPORTING_TOOL();
})();