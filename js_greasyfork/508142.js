// ==UserScript==
// @name         Conceito da biblioteca leaflet do escaladas.com.br
// @namespace    https://etcho.github.io/
// @version      1.0
// @description  Teste de conceito
// @author       You
// @match        https://escaladas.com.br/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=escaladas.com.br
// @require      https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
// @require      https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508142/Conceito%20da%20biblioteca%20leaflet%20do%20escaladascombr.user.js
// @updateURL https://update.greasyfork.org/scripts/508142/Conceito%20da%20biblioteca%20leaflet%20do%20escaladascombr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        @import url('https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css');
        @import url('https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css');
    `);

    let points = [];
    $(document).ready(function() {
        $(markers).each(function(a, b) {
            points.push({title: b.title, lat: b.position.lat(), lng: b.position.lng()});
        });
    });

    $('.mapa').after('<div id="leaflet_map" style="width: 100%; height: 400px; margin-bottom: 20px;"></div>');

    let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
				    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			    }),
			    latlng = L.latLng(-21.943089, -42.040508);

    let leaflet_map = L.map('leaflet_map', {center: latlng, zoom: 4, layers: [tiles]});
    let map_markers = L.markerClusterGroup();

    const meuIcone = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png',
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    for (let i = 0; i < points.length; i++) {
        const title = points[i].title + '<br /><br /> <a href="#">Veja este local</a>';
        let marker = L.marker(new L.LatLng(points[i].lat, points[i].lng), {icon: meuIcone, title: title });
        marker.bindPopup(title);
        map_markers.addLayer(marker);
    }

    leaflet_map.addLayer(map_markers);
})();