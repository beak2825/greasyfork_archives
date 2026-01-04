// ==UserScript==
// @name         WME AK GIS Map
// @namespace    https://greasyfork.org/users/166860
// @version      0.6
// @description  Open a AK GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic, MacroNav
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include     /^https?:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html\?webmap=05cd5840750740ab94fad8ae268edf82.*/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/368419/WME%20AK%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/368419/WME%20AK%20GIS%20Map.meta.js
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
            console.log('AK GIS:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'http://www.arcgis.com/home/webmap/viewer.html?webmap=05cd5840750740ab94fad8ae268edf82&extent=';
        url += wazeExt.left + '%2C' + wazeExt.bottom + '%2C' + wazeExt.right + '%2C' + wazeExt.top + '%2C102113';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'ak_gis_map');
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
        syncGISMapExtent(mapWindow);
    }

    function syncGISMapExtent(myMapWindow) {
      if (myMapWindow && !myMapWindow.closed) {
            var wazeExt = W.map.getExtent();
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'http://www.arcgis.com');
            } catch (ex) {
                log(ex, 0);
            }
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'https://www.arcgis.com');
            } catch (ex) {
                log(ex, 0);
            }
        }
    }

    function init() {
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',display:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'ak-gis-button',title:'Open the AK GIS map in a new window', href:'javascript:void(0)'})
                .text('AKGIS')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#ak-gis-button');
            if ($btn.length > 0) {
                $btn.css('color', (mapWindow && !mapWindow.closed) ? '#1e9d12' : '#000000');
            }
        }, 500);

        /* Event listeners */
        W.map.events.register('moveend',null, function(){syncGISMapExtent(mapWindow);});

        log('Initialized.', 1);
    }

    function receiveMessageGIS(event) {
        log(event, 1);
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
