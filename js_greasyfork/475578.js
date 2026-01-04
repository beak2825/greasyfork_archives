// ==UserScript==
// @name            sentinel map (most updated sattelite image)
// @description     Adds a small button in WME footer to open sentinel satellite image in the same location, DONT FORGET to select the date in top of the page, see attached photo.
// @namespace       https://greasyfork.org/en/users/715686-aseele-h
// @version         2023.09.18.01
// @author          DR.ASEELE
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/475578/sentinel%20map%20%28most%20updated%20sattelite%20image%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475578/sentinel%20map%20%28most%20updated%20sattelite%20image%29.meta.js
// ==/UserScript==

(function() {

    'use strict';
    function generateURL() {
        var segment = W.selectionManager.getSegmentSelection().segments[0];
        var projI = new OpenLayers.Projection("EPSG:900913");
        var projE = new OpenLayers.Projection("EPSG:4326");
        var center_lonlat = (new OpenLayers.LonLat(W.map.olMap.center.lon,W.map.olMap.center.lat)).transform(projI,projE);
        var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        return `https://apps.sentinel-hub.com/sentinel-playground/?source=S2&lat=${lat}&lng=${lon}&zoom=16&preset=1-NATURAL-COLOR&layers=B01,B02,B03&maxcc=0&gain=1.0&gamma=1.0&time=&atmFilter=&showDates=false`;
    }

    function openRT() {
        var rtUrl = generateURL();
        window.open(rtUrl, "_blank");
    }

    function init_OPEN_SENTIL() {
        try {
            var toolbarWrap = document.querySelector('.WazeControlPermalink');
            if (toolbarWrap !== null) {
                toolbarWrap.insertAdjacentHTML('afterend', '<div class="WazeControlORT" id="WME_ORT" style="margin:0 5px;"><a href="#" id="btn-openrt"><strong>sentinel</strong></a></div>');

                document.getElementById("btn-openrt").addEventListener("click", openRT, false);
                console.info('%c%s','background:green;color:white;padding:5px 10px;','[SUCCESS] WME OPEN SENTIL >> INITIALIZED');
            } else {
                setTimeout(init_OPEN_SENTIL, 1000);
                console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] OPEN SENTIL >> Could not find Waze map. Trying again.');
            }
        } catch (err) {
            setTimeout(init_OPEN_SENTIL, 1000);
            console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME OPEN SENTIL >> Failed to initialize.');
            console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME OPEN SENTIL >> Error details: ', err);
        }
    }

    init_OPEN_SENTIL();

})();