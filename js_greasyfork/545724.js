// ==UserScript==
// @name         wplace - simple map browser
// @namespace    http://pawing.cv
// @version      v1.2
// @description  use openstreetmap to navigate wplace faster! press M to pull up the map, and right click to visit that place
// @author       cv
// @match        https://wplace.live/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/545724/wplace%20-%20simple%20map%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/545724/wplace%20-%20simple%20map%20browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// i promise the comment hiding the actual html is eye candy and not done with malicious intent 😇 (i mean, you can see the exact code it's inserting below)
    function openmap() {
        let popupcode = `<!--wplace.live-map----------------------------------------------------------------------------------->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>OpenStreetMap</title>
    <meta charset="utf-8">
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap");
        html, body {
            height: 100%; line-height: 1; margin: 0; padding: 0;
            font-family: "Geist", ui-sans-serif, system-ui, sans-serif !important;
        }

        #loading {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #f2f7fe; padding: 20px; border-radius: 32px;
            font-size: 16px; font-weight: 500; color: #394e6a;
            box-shadow: 0 5px 16px 0 rgba(0,0,0,0.1); z-index: 1000;
        }

        .map {
            height: 100%; width: 100%; display: none;
        }

        a, span, p, li, input, ul {
            font-family: Geist, ui-sans-serif, system-ui, sans-serif !important;
            user-select: none;
        }
        .coords, .small {user-select: all !important}

        .info {
            display: flex; flex-direction: row; position: fixed;
            justify-content: center; align-items: center;
            top: 1em; left: 50%; transform: translateX(-50%);
            background: #f2f7fe; padding: 10px; border-radius: 32px;
            font-size: 13.5px; font-weight: 700; z-index: 1000;
            box-shadow: 0 5px 16px 0 rgba(0,0,0,0.1); color: #394e6a;
            pointer-events: none; user-select: none; display: none;
        }
        .info svg {
            padding-left: 3px; padding-right: 2px; width: 15px;
        }
        .coords {
            display: flex; flex-direction: column; position: fixed; width: 300px;
            bottom: 1em; left: 50%; transform: translateX(-50%);
            background: #f2f7fe; display: none;
            padding: 20px; border-radius: 32px;
            font-size: 18px; z-index: 1000; font-weight: 500;
            box-shadow: 0 5px 16px 0 rgba(0,0,0,0.1); color: #394e6a;
        }
        .small {
            font-size: 13px; color: #394e6a; opacity: 0.5;
        }

        /* Leaflet control styling */
        div.leaflet-control-container > div.leaflet-top.leaflet-left > div {
            border: none;
        }
        div.leaflet-control-container > div.leaflet-top.leaflet-left > div > a {
            display: flex; flex-direction: column; background: #f2f7fe;
            border-radius: 32px; margin-bottom: 3px; font-size: 13px;
            box-shadow: 0 5px 16px 0 rgba(0,0,0,0.1); color: #394e6a;
        }

        div.leaflet-top.leaflet-right * { border: none; }
        div.leaflet-top.leaflet-right > div > button,
        div.leaflet-top.leaflet-right > div {
            display: flex; flex-direction: column; background: #f2f7fe;
            border-radius: 32px; margin-bottom: 3px; color: #394e6a;
        }
        div.leaflet-top.leaflet-right > div > button { display: none; }
        div.leaflet-top.leaflet-right > div > div.leaflet-control-geocoder-form {
            display: inline-block; width: 200px; padding: 10px;
            box-shadow: 0 5px 16px 0 rgba(0,0,0,0.1);
        }
        div.leaflet-top.leaflet-right > div > .leaflet-control-geocoder-alternatives {
            border-radius: 1px; padding: 10px;
        }
        div.leaflet-top.leaflet-right > div:has(.leaflet-control-geocoder-alternatives:not([style*="display: none"])) > .leaflet-control-geocoder-form {
            box-shadow: none !important;
        }
        body > div.map.leaflet-container.leaflet-touch.leaflet-fade-anim.leaflet-grab.leaflet-touch-drag.leaflet-touch-zoom > div.leaflet-control-container > div.leaflet-bottom.leaflet-right {
            display: none !important;
        }
        .leaflet-control-geocoder-form-no-error {
            text-align: center; color: rgb(179, 97, 97) !important;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div id="loading">Loading map...</div>
    <div class="info">Choose a location with <svg alt="Right Click" fill="#394e6a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path d="M38 0h4v6h-4V0Zm9 1 4 2c-2 4-2 4-7 5 1-5 1-5 3-7ZM36 5c8 6 9 12 9 22v6c-2 10-5 14-14 19-10 1-16 1-23-6-4-7-5-11-5-19v-6C5 4 21-3 36 5ZM9 17l-1 9h14V7c-7 0-10 5-13 10ZM8 30c2 9 3 13 11 17 11 0 14-1 20-10l1-7H8Zm38-20h6v4h-6v-4Z"/></svg>!</div>
    <div class="coords"></div>
    <div class="map" style="width:100%;height:100%"></div>

    <script>
        function newcss(url) {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
        function newjs(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        async function bootmap() {
            try {
                await newcss('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css');
                await newjs('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js');
                await newcss('https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css');
                await newjs('https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js');

                document.getElementById('loading').style.display = 'none';
                document.querySelector('.map').style.display = 'block';
                document.querySelector('.info').style.display = 'flex';
                document.addEventListener("contextmenu", function(e) {e.preventDefault()});

                var map = L.map(document.querySelector(".map"), {
                    worldCopyJump: false,
                    continuousWorld: false
                }).setView([0, 0], 1);

                map.setMaxBounds([[-85.05112878, -180], [85.05112878, 180]]);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {noWrap: true}).addTo(map);

                map.on('drag', function() {
                    if (!map.getBounds().intersects(map.options.maxBounds)) {
                        map.panInsideBounds(map.options.maxBounds, { animate: false });
                    }
                });

                L.Control.geocoder({
                    geocoder: L.Control.Geocoder.nominatim()
                }).addTo(map);

                var lastlatlng = null;

                map.on("mousemove", function(e) {
                    lastlatlng = e.latlng;
                    var lat = e.latlng.lat;
                    var lng = e.latlng.lng;
                    var zoom = map.getZoom();

                    var tile_count = 2048;
                    var tile_size = 1000;
                    var pixel_count = tile_count * tile_size;

                    var x = (lng + 180) / 360;
                    var sinlat = Math.sin(lat * Math.PI / 180);
                    var y = 0.5 - Math.log((1 + sinlat) / (1 - sinlat)) / (4 * Math.PI);

                    x = Math.min(1, Math.max(0, x));
                    y = Math.min(1, Math.max(0, y));

                    var px = x * (pixel_count - 1);
                    var py = y * (pixel_count - 1);
                    var t_x = Math.floor(px / tile_size);
                    var t_y = Math.floor(py / tile_size);
                    var p_x = Math.floor(px % tile_size);
                    var p_y = Math.floor(py % tile_size);

                    document.querySelector(".coords").innerHTML =
                        lat.toFixed(6) + ", " + lng.toFixed(6) + " [x" + zoom + "] " +
                        "<br><span class='small'>" + t_x + ", " + t_y + " // " + p_x + ", " + p_y + "</span>";

                    var coords = document.querySelector(".coords");
                    if (coords.innerHTML.trim() !== "") {
                        coords.style.display = "flex";
                    } else {
                        coords.style.display = "none";
                    }
                });

                document.querySelector(".map").addEventListener("contextmenu", function(ev) {
                    ev.preventDefault();
                    if (lastlatlng) {
                        var osmzoom = map.getZoom();
                        var wplacezoom = Math.max(1, Math.min(19, osmzoom));

                        var wplaceUrl = 'https://wplace.live/?lat=' + lastlatlng.lat + '&lng=' + lastlatlng.lng + '&zoom=' + wplacezoom;
                        window.open(wplaceUrl, '_blank');
                        window.close();
                    }
                });

            } catch (error) {
                document.getElementById('loading').textContent = 'Error loading map: ' + error.message;
                console.error('map load error!', error);
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootmap);
        } else {bootmap()}
    </script>
</body>
</html>`;

	// the ENTIRE page has to fit inside a data url, since:
	// - blob:https://wplace.live inherits wplace.live's csp
	// - about:blank, uh, doesn't work either, fuck
        if (typeof GM_openInTab !== 'undefined') {
            const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(popupcode);
            GM_openInTab(dataUrl, { active: true });
        } else {
            const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(popupcode);
            const newTab = window.open(dataUrl, '_blank');

            if (!newTab) {
                alert("please allow popups for wplace.live..");
            }
        }
    }
	// that isn't an absurd workaround, is it? no? thank god

    function cleanlink() {
        const cleanlink = new URL(window.location.href);
        cleanlink.searchParams.delete('lat');
        cleanlink.searchParams.delete('lng');
        cleanlink.searchParams.delete('zoom');
        window.history.replaceState({}, '', cleanlink.pathname + cleanlink.search + cleanlink.hash);
    }
    window.addEventListener('DOMContentLoaded', function() {
        const url = new URL(window.location.href);
        if (url.searchParams.has('lat') || url.searchParams.has('lng') || url.searchParams.has('zoom')) {
            cleanlink();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'M' || e.key === 'm') {
            openmap();
        }
    });
})();
