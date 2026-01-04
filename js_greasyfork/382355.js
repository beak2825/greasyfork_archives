// ==UserScript==
// @name         Sync OSM and Smith County Maps
// @namespace    Misc scripts
// @version      2019.04.29.003
// @description  Keeps the location of an ArcGIS map synced to an OpenStreetMap.
// @author       MapOMatic
// @include      https://www.openstreetmap.org/*
// @include      https://www.smithcountymapsite.org/gallery/maps/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382355/Sync%20OSM%20and%20Smith%20County%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/382355/Sync%20OSM%20and%20Smith%20County%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var debugLevel = 0;
    var map;
    var mapWindow;
    var Extent;
    var SpatialReference;
    var receiverAdded = false;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('GIS:', message);
        }
    }

    function getWindow() {
        return typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    }

    function onButtonClick() {
        var url = 'https://www.smithcountymapsite.org/gallery/maps/';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'gis_map');
            try {
                if (mapWindow.location && mapWindow.location.href) {
                    mapWindow.location.assign(url);
                }
            } catch (ex) {
                if (ex.code === 18) {
                    // Ignore if accessing location.href is blocked by cross-domain.
                } else {
                    throw ex;
                }
            }
        }
        mapWindow.focus();
    }

    function syncGISMapExtent() {
      if (map && mapWindow && !mapWindow.closed) {
             var bounds = map.getBounds();
             try {
                 mapWindow.postMessage({xmin:bounds.getWest(), xmax:bounds.getEast(), ymin:bounds.getSouth(), ymax:bounds.getNorth()}, '*');
             } catch (ex) {
                 log(ex, 0);
             }
        }
    }

    function init() {
        $('nav.secondary > ul').first().prepend(
            $('<li>', {class: 'compact-hide'}).append(
                $('<button>',{id:'gis-button',title:'Open the GIS map in a new window'})
                .text('Smith County')
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#gis-button');
            if ($btn.length > 0) {
                if (mapWindow && !mapWindow.closed) {
                    $btn.css({fontWeight: 'bold', color: '#1e9d12'});
                } else {
                    $btn.css({fontWeight: '', color: ''});
                }
            }
        }, 500);

        log('Initialized.', 1);
    }

    function receiveMessageGIS(event) {
        log(event, 1);
        var data = event.data;
        console.log(event.data);
        if (!Extent) {
            var w = getWindow();
            Extent = w.require('esri/geometry/Extent');
            SpatialReference = w.require('esri/SpatialReference');
        }
        var ext = new Extent({xmin:data.xmin, xmax:data.xmax, ymin:data.ymin, ymax:data.ymax, spatialReference:new SpatialReference({wkid: 4326})});
        _viewerMap.setExtent(ext);
    }


    function bootstrap2() {
        if (window.location.host === 'www.openstreetmap.org') {
            if (typeof $ !== 'undefined' && $('nav.secondary').length) {
                init();
            } else {
                setTimeout(bootstrap2, 500);
            }
        } else {
            var w = getWindow();
            if (typeof w.require !== 'undefined') {
                window.addEventListener("message", receiveMessageGIS, false);
            } else {
                setTimeout(bootstrap2, 500);
            }
        }
    }

    function bootstrap1() {
        if (window.location.host === 'www.openstreetmap.org') {
            var w = getWindow();
            if (w.L) {
                w.L.Map.addInitHook(function () {
                    if (!map) {
                        map = this;
                        map.on('moveend', syncGISMapExtent)
                    }
                });
            } else {
                setTimeout(bootstrap1, 10);
            }
        }
    }

    bootstrap1();
    bootstrap2();
})();