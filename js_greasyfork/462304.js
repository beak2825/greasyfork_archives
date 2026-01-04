// ==UserScript==
// @name         Crime Map Addons
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.2
// @description  Adds searchbox and churches to crime map, syncs with realtor addon
// @author       FXZFun
// @match        https://crimegrade.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crimegrade.org
// @grant        none
// @require      https://greasyfork.org/scripts/462303-crime-map-churches-layer-data/code/Crime%20Map%20Churches%20Layer%20Data.js?version=1210010
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462304/Crime%20Map%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/462304/Crime%20Map%20Addons.meta.js
// ==/UserScript==
 
/* global churchesDb, mapboxgl, jQuery, StyleLink1, PlaceLng, PlaceLat, placeZoom */
 
(function() {
    'use strict';
 
    var map;
    function initMap() {
        const params = new URLSearchParams(location.search);
        window.churchesDb = churchesDb;
        window.loadMap2 = function () {
            map = new mapboxgl.Map({
                container: 'map-1',
                style: StyleLink1,
                center: [params?.get("lng")?.replace("/", "") ?? PlaceLng, params?.get("lat")?.replace("/", "") ?? PlaceLat],
                zoom: 12
            });
            window.map = map;
 
            // Resize on load to accurately fit into its container
            map.on('load', function () {
                map.resize();
                map.addControl(new mapboxgl.NavigationControl(), 'top-left');
                window.top?.postMessage({"sender": "crime map addons", "message": "loaded"});
                if (params?.has("lat") && params?.has("lng")) {
                    const marker1 = new mapboxgl.Marker()
                    .setLngLat([params?.get("lng")?.replace("/", "") ?? PlaceLng, params?.get("lat")?.replace("/", "") ?? PlaceLat])
                    .addTo(map);
                    document.querySelector(".et_pb_tab_0 a").href = `/safest-places-in-conroe-tx/?lat=${params?.get("lat")?.replace("/", "") ?? PlaceLat}&lng=${params?.get("lng")?.replace("/", "") ?? PlaceLng}`;
                    document.querySelector(".et_pb_tab_1 a").href = `/property-crime-conroe-tx/?lat=${params?.get("lat")?.replace("/", "") ?? PlaceLat}&lng=${params?.get("lng")?.replace("/", "") ?? PlaceLng}`;
                    document.querySelector(".et_pb_tab_2 a").href = `/violent-crime-conroe-tx/?lat=${params?.get("lat")?.replace("/", "") ?? PlaceLat}&lng=${params?.get("lng")?.replace("/", "") ?? PlaceLng}`;
                }
                if (!params.has("noChurches")) {
                    map.addSource('places', { 'type': 'geojson', 'data': churchesDb });
                    // Add a layer showing the places.
                    map.addLayer({
                        'id': 'places',
                        'type': 'circle',
                        'source': 'places',
                        'paint': {
                            'circle-color': 'darkred',
                            'circle-radius': 8,
                            'circle-stroke-width': 3,
                            'circle-stroke-color': '#ffffff'
                        }
                    });
                    // Create a popup, but don't add it to the map yet.
                    const popup = new mapboxgl.Popup({
                        closeOnClick: false
                    });
 
                    map.on('mouseover', 'places', (e) => {
                        map.getCanvas().style.cursor = 'pointer';
                    });
 
                    map.on('click', 'places', (e) => {
 
                        // Copy coordinates array.
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        const name = e.features[0].properties.Name;
                        const description = e.features[0].properties.description;
                        const properties = e.features[0].properties;
 
                        // Ensure that if the map is zoomed out such that multiple
                        // copies of the feature are visible, the popup appears
                        // over the copy being pointed to.
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
 
                        // Populate the popup and set its coordinates
                        // based on the feature found.
                        var address = `${properties.Address}, ${properties.City}, ${properties.State_Province}`;
                        popup.setLngLat(coordinates).setHTML(`
                        <h4>${properties.Name}</h4>
                        <b>Address:</b> <a href="https://www.google.com/maps/search/?api=1&query=${address}" target="_blank">${address}</a><br>
                        <b>Affiliation:</b> ${properties.Affiliation}<br>
                        <b>Type:</b> ${properties.Type}<br>
                        <b>More Info:</b> <a href="${properties.More_Info}" target="_blank">${properties.More_Info}</a><br>
                    `).addTo(map);
                    });
                }
 
                if (params.has("fullscreen")) {
                    jQuery('#map-1').addClass('map--fullscreen');
                    map.resize();
                    document.querySelector(".mapboxgl-control-container").remove?.()
                    document.querySelector(".mapboxgl-control-container").remove?.()
                    document.body.style.overflow = "hidden";
                    document.querySelector(".et_pb_tab_2").click();
                }
 
                const div = document.createElement("div");
                div.innerHTML = `<form class="searchField" onsubmit="return false">
                                     <input id="searchTextField" type="text" size="50" class="pac-target-input" placeholder="Enter a location" autocomplete="off">
                                     <button onclick="changePlace()" type="submit" class="btn" style="display: none;">Find</button>
                                 </form>
                                 <style>
                                     #searchTextField {
    width: 25%;
    padding: 10px;
    transition: 0.25s;
                                     }
                                     #searchTextField:focus { width: 75%; }
                                     form input,
        form textarea {
            width: 100%;
            background-color: #fafafa;
            margin: 2vh 1vw;
            padding: 10px 10px 10px 5px;
            border: none;
            border-radius: .2em .2em 0 0;
            font-family: "Open Sans", sans-serif;
            font-size: 1em;
            border-bottom: 1.5px solid #757575;
            box-shadow: 0px 0px 5px #2121218a;
        }
 
        form input:focus,
        form textarea:focus {
            outline: none;
            border-bottom: 1.5px solid #2196F3;
        }
        .searchField {
            position: absolute;
    top: 10px;
    left: 50px;
    width: 100%;
    display: inline-block;
    z-index: 1;
        }
                                 </style>`;
                const script = document.createElement("script");
                script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDuDBm96B82JKMvrKPy1GHuGCRavIXiuLs&libraries=places&v=weekly&callback=loadAutocomplete";
                div.appendChild(script);
                document.querySelector(".mapboxgl-ctrl-top-left").insertAdjacentElement("afterEnd", div);
 
                if (params.has("removeLayers")) map.style.stylesheet.layers.forEach(l => (l.type === "line" || l.type === "symbol") && map.removeLayer(l.id));
            });
        }
        window.loadMap2();
    }
 
    window.loadAutocomplete = () => {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['(cities)'],
            componentRestrictions: { country: "us" }
        };
        let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setFields(['geometry']);
        google.maps.event.addListener(autocomplete, "place_changed", () => {
            var place = autocomplete.getPlace();
            if (place !== null) {
                history.replaceState({}, null, `?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`);
                map.flyTo({center:[place.geometry.location.lng(), place.geometry.location.lat()]});
                const marker1 = new mapboxgl.Marker()
                .setLngLat([place.geometry.location.lng(), place.geometry.location.lat()])
                .addTo(map);
                document.querySelector(".et_pb_tab_0 a").href = `/safest-places-in-conroe-tx/?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`;
                document.querySelector(".et_pb_tab_1 a").href = `/property-crime-conroe-tx/?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`;
                document.querySelector(".et_pb_tab_2 a").href = `/violent-crime-conroe-tx/?lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`;
            }
        });
    };
 
    window.addEventListener("message", (event) => {
        if (event.data &&
            event.data.sender == "realtor addons") {
            let pos = event.data.message;
            map?.fitBounds([[pos[1], pos[0]], [pos[3], pos[2]]])
        }
    });
 
    var i = setInterval(() => {
        if (typeof mapboxgl !== 'undefined') {
            clearInterval(i);
            initMap();
        }
    }, 500);
    var j = setInterval(() => {
        if (!!document.querySelector(".triggerWrapper")) {
            clearInterval(j);
            document.querySelector(".triggerWrapper").click();
        }
        console.log("run");
    }, 500);
})();
