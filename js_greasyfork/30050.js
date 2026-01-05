// ==UserScript==
// @name         WME WI GIS Map
// @namespace    https://greasyfork.org/users/45389
// @version      2018.06.19.001
// @description  Open a WI GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include     /^https?:\/\/maps\.sco\.wisc\.edu\/Parcels.*/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/369628/WME%20WI%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/369628/WME%20WI%20GIS%20Map.meta.js
// ==/UserScript==

// NOTE: As of July 2023, the WI parcel viewer was changed so that it no longer works with this code.
// There is not "map" object to manipulate. So this script is broken, probably for good...

(function() {
    'use strict';

    var debugLevel = 0;
    var mapWindow;
    var Extent;
    var SpatialReference;
    var receiverAdded = false;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('WI GIS:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'http://maps.sco.wisc.edu/Parcels/';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'wi_gis_map');
            try {
                if (mapWindow.location && mapWindow.location.href) {
                    mapWindow.location.assign(url);
                    setTimeout(function() {syncGISMapExtent(mapWindow); }, 1000);
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
        console.log('sync message sent');
        if (myMapWindow && !myMapWindow.closed) {
            var wazeExt = W.map.getExtent();
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'http://maps.sco.wisc.edu');
            } catch (ex) {
                log(ex, 0);
            }
            try {
                myMapWindow.postMessage({type:'setExtent', xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top, spatialReference: 102113}, 'https://maps.sco.wisc.edu');
            } catch (ex) {
                log(ex, 0);
            }
        }
    }

    function init() {
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',display:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'wi-gis-button',title:'Open the WI GIS map in a new window', href:'javascript:void(0)'})
                .text('WI-GIS')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#wi-gis-button');
            if ($btn.length > 0) {
                $btn.css('color', (mapWindow && !mapWindow.closed) ? '#1e9d12' : '#000000');
            }
        }, 500);

        /* Event listeners */
        W.map.events.register('moveend',null, function(){syncGISMapExtent(mapWindow);});

        log('Initialized.', 1);
    }

    function receiveMessageGIS(event) {
        if (unsafeWindow._viewerMap) {
            log(event, 1);
            var data = event.data;
            if (!Extent) {
                Extent = unsafeWindow.require('esri/geometry/Extent');
                SpatialReference = unsafeWindow.require('esri/SpatialReference');
            }
            switch (data.type) {
                case 'setExtent':
            }
            //var map = unsafeWindow.arcgisonline.map.main.map;
            var ext = new Extent({xmin:data.xmin, xmax:data.xmax, ymin:data.ymin, ymax:data.ymax, spatialReference:new SpatialReference({wkid:data.spatialReference})});
            unsafeWindow._viewerMap.setExtent(ext);
        } else {
            setTimeout(function() {receiveMessageGIS(event);}, 1000);
        }
    }

    function receiveMessageWME(event) {
        // TBD
    }

    function bootstrap() {
        if (window.location.host.toLowerCase() === "maps.sco.wisc.edu") {
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
