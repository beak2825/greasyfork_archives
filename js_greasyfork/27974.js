// ==UserScript==
// @name         WME TX FC Map
// @namespace    https://greasyfork.org/users/45389
// @version      0.1
// @description  Open a TX FC  map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @include     /^https:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html.*/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/27974/WME%20TX%20FC%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/27974/WME%20TX%20FC%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var debugLevel = 0;
    var mapWindow;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('TxDOT-FC:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'https://www.arcgis.com/home/webmap/viewer.html?useExisting=1&layers=b553554a0a0842928936cf41e0721bc5';
        url += '&extent=' + wazeExt.left + '%2C' + wazeExt.bottom + '%2C' + wazeExt.right + '%2C' + wazeExt.top + '%2C102113';
        if (!mapWindow || mapWindow.closed) {
            setTimeout(function(){mapWindow = window.open(url, '_blank'); syncGISMapExtent();}, 5);
        } else {
            mapWindow.focus();
            syncGISMapExtent();
        }
    }

    function syncGISMapExtent() {
        if (mapWindow && !mapWindow.closed) {
            var wazeExt = W.map.getExtent();
            mapWindow.postMessage({xmin:wazeExt.left, xmax:wazeExt.right, ymin:wazeExt.bottom, ymax:wazeExt.top}, 'https://www.arcgis.com');
        }
    }

    function init() {
        console.log('OK!!!!!!!!!!!!!');
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',display:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'gis-button',title:'Open the external map in a new window'})
                .text('TxDOT-FC').attr('href','javascript:void(0)')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#gis-button');
            if ($btn.length > 0) {
                $btn.css('color', (mapWindow && !mapWindow.closed) ? '#1e9d12' : '#000000');
            }
        }, 500);

        /* Event listeners */
        W.map.events.register('moveend',null, syncGISMapExtent);

        log('Initialized.', 1);
    }

    function receiveMessage(event) {
        var extentData = event.data;
        var Extent = unsafeWindow.require('esri/geometry/Extent');
        var SpatialReference = unsafeWindow.require('esri/SpatialReference');
        var map = unsafeWindow.arcgisonline.map.main.map;
        var ext = new Extent({xmin:extentData.xmin, xmax:extentData.xmax, ymin:extentData.ymin, ymax:extentData.ymax, spatialReference:new SpatialReference({wkid:102113})});
        unsafeWindow.arcgisonline.map.main.map.setExtent(ext);
    }

    function bootstrap() {
        if (window.location.host.toLowerCase() === "www.arcgis.com") {
            window.addEventListener("message", receiveMessage, false);
        } else if (W && W.loginManager &&
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

    log('Bootstrap...', 1);
    bootstrap();
})();