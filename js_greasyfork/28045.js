// ==UserScript==
// @name         WME El Paso County GIS Map
// @namespace    https://greasyfork.org/users/45389
// @version      0.3.2
// @description  Open an El Paso County GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       jcloudm for localization, MapOMatic original
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @include     /^http:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html\?*/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/28045/WME%20El%20Paso%20County%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/28045/WME%20El%20Paso%20County%20GIS%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var debugLevel = 0;
    var mapWindow;
    var Extent;
    var SpatialReference;
    var receiverAdded = false;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('WV GIS:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'http://www.arcgis.com/home/webmap/viewer.html?url=http://gis2.asr.elpasoco.com/ArcGIS/rest/services/JavaScript-512-Road-Map/MapServer&source=sd&extent=';
        url += wazeExt.left + '%2C' + wazeExt.bottom + '%2C' + wazeExt.right + '%2C' + wazeExt.top + '%2C102113';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'wv_gis_map');
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
        syncGISMapExtent();
    }

    function syncGISMapExtent() {
        if (mapWindow && !mapWindow.closed) {
            var wazeExt = W.map.getExtent();
            mapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'http://www.arcgis.com');
        }
    }

    function init() {
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',display:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'wv-gis-button',title:'Open the El Paso County GIS map in a new window', href:'javascript:void(0)'})
                .text('EPCGIS')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#wv-gis-button');
            if ($btn.length > 0) {
                $btn.css('color', (mapWindow && !mapWindow.closed) ? '#1e9d12' : '#000000');
            }
        }, 500);

        /* Event listeners */
        W.map.events.register('moveend',null, syncGISMapExtent);

        log('Initialized.', 1);
    }

    function receiveMessageGIS(event) {
        var data = event.data;
        if (!Extent) {
            Extent = unsafeWindow.require('esri/geometry/Extent');
            SpatialReference = unsafeWindow.require('esri/SpatialReference');
        }
        switch (data.type) {
            case 'setExtent':
        }
        var map = unsafeWindow.arcgisonline.map.main.map;
        var ext = new Extent({xmin:data.xmin, xmax:data.xmax, ymin:data.ymin, ymax:data.ymax, spatialReference:new SpatialReference({wkid:data.spatialReference})});
        unsafeWindow.arcgisonline.map.main.map.setExtent(ext);
    }

    function receiveMessageWME(event) {
        // TBD
    }

    function bootstrap() {
        if (window.location.host.toLowerCase() === "www.arcgis.com") {
            window.addEventListener("message", receiveMessageGIS, false);
        } else {
            if (!receiverAdded) {
                window.addEventListener("message", receiveMessageWME, false);
                receiverAdded = true;
            }
            if (W && W.loginManager &&
                W.loginManager.events.register &&
                W.map) {
                log('Initializing...', 1);
                init();
            } else {
                log('Bootstrap failed. Trying again...', 1);
                window.setTimeout(function () {
                    bootstrap();
                }, 200);
            }
        }
    }

    log('Bootstrap...', 1);
    bootstrap();
})();