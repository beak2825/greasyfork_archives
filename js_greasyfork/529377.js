// ==UserScript==
// @name         Mapbox-GeoJson-Censor-Tool
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Censor the map content!
// @author       You
// @match        https://geojson.io/*
// @icon         https://geojson.io/img/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529377/Mapbox-GeoJson-Censor-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/529377/Mapbox-GeoJson-Censor-Tool.meta.js
// ==/UserScript==

(function(){

    const censor_script=`

            window.api.map.on('style.load', () => {
                    censorContent();
                    add3DTerrainSource();
                    removeNonVehicleLayers();
                });

            function censorContent() {
                window.api.map.setFilter('admin-0-boundary-disputed', [
                    'all',
                    ['==', ['get', 'disputed'], 'true'],
                    ['==', ['get', 'admin_level'], 0],
                    ['==', ['get', 'maritime'], 'false'],
                    ['match', ['get', 'worldview'], ['all', 'CN'], true, false],
                  ]);
                window.api.map.setFilter('admin-0-boundary', [
                  'all',
                  ['==', ['get', 'admin_level'], 0],
                  ['==', ['get', 'disputed'], 'false'],
                  ['==', ['get', 'maritime'], 'false'],
                  ['match', ['get', 'worldview'], ['all', 'CN'], true, false],
                ]);
                window.api.map.setFilter('admin-0-boundary-bg', [
                  'all',
                  ['==', ['get', 'admin_level'], 0],
                  ['==', ['get', 'maritime'], 'false'],
                  ['match', ['get', 'worldview'], ['all', 'CN'], true, false],
                ]);

                window.api.map.setLayoutProperty('state-label', 'text-field', [
                  'case',
                  ['==', ['get', 'name_en'], 'Arunachal Pradesh'],
                  '',
                  ['get', 'name_en'],
                ]);

                window.api.map.setLayoutProperty('country-label', 'text-field', [
                  'case',
                  ['==', ['get', 'name_en'], 'China'],
                  'People\\'s Republic of China',
                  ['==', ['get', 'name_en'], 'Hong Kong'],
                  ['concat', ['get', 'name_en'], ', SAR of China'],
                  ['==', ['get', 'name_en'], 'Macau'],
                  ['concat', ['get', 'name_en'], ', SAR of China'],
                  ['==', ['get', 'name_en'], 'Taiwan'],
                  '',
                  ///['concat', ['get', 'name_en'], ', Province of China'],
                  ['get', 'name_en'],

                ]);
            }

            function add3DTerrainSource() {
                window.api.map.addSource('mapbox-dem', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    tileSize: 512,
                });

                window.api.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.1 });
            }

            function removeNonVehicleLayers() {{
                if (window.api.map.getLayer('road-path')) window.api.map.removeLayer('road-path');
                if (window.api.map.getLayer('road-steps')) window.api.map.removeLayer('road-steps');
                if (window.api.map.getLayer('road-pedestrian')) window.api.map.removeLayer('road-pedestrian');
                if (window.api.map.getLayer('tunnel-path')) window.api.map.removeLayer('tunnel-path');
                if (window.api.map.getLayer('tunnel-steps')) window.api.map.removeLayer('tunnel-steps');
                if (window.api.map.getLayer('tunnel-pedestrian')) window.api.map.removeLayer('tunnel-pedestrian');
                if (window.api.map.getLayer('bridge-path')) window.api.map.removeLayer('bridge-path');
                if (window.api.map.getLayer('bridge-steps')) window.api.map.removeLayer('bridge-steps');
                if (window.api.map.getLayer('bridge-pedestrian')) window.api.map.removeLayer('bridge-pedestrian');
            }}


        `;

    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.innerHTML = censor_script;
    document.body.appendChild( scriptElement );
})();

