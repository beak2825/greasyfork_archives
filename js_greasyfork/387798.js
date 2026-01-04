// ==UserScript==
// @name         Travaux Mayenne GIS Map
// @namespace    Travaux Mayenne GIS Map
// @version      0.1
// @description  Open a Travaux Mayenne GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include     /^https?:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html\?webmap=8e1997359ffa4a58b1b78ff9e79e027e.*/
// @license      GNU GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAbCAYAAACEP1QvAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAiRJREFUSIm1lr9rFEEUxz8jC/am8oSoIISrU0T8B1IFchhMIQdp9hqLWFkoIqSwiE0am1xxh0cCuXC5QJr0QYj/QCAQEIWcTU5IaRGexdy6Mzuze7OLeXDMz3uf9337ZnYjKtrZ2ZHU60u0201arZ6q4iOqCq9/WIJ9iB/2aFX0UQkugpBo/aHHSlFafTXlWUylpFeAW6olBVdRXwq+tfVcUAM9eDaZbAI9HcTa2hPpdi+CAygFX18fwOvJ4Ouk/TKBA53OBd1uuL9guJNuaxGdflUu/eHKHwXuexrsMQxeqBpjXgHfwtWHKQ8tofvAr/D9U+F5qpWy9mgbUeroFcIXFgzwe/+eTiczcQk80EE0GshwmB9AIfz0lDSFG7rp92F1VffF9/xraffgwM5QMNyX7qwjpXICCDx6+cpn3Km5OTg/z/2H317kL3nheapFUvVm32uJ+v189Q78+PijoN76Aipv94DfOojt7aZkPzoc+OKiAS4AJqprNRiN/GtivPXiuEcr89VhwW9ujHRvuMCVldSpWWxJf3kZDg/tIOQ78Bhv8VnwO/PGwHOuBwN/+s3nn62Dl+9gJxm8sdf+wafd34XFVWC7u7CTpP+TrT5VPsV5owHDoRvQ1KpP9t0F/ticCFzV47HroN3Wv2Tt6kq343HaL7QZnHs/ur7+KahZI0zv/fJ/TcHJyWeJ4niWvduGeWxz8xVRv4/ak6ITfTt2pFB/AQZryd3Ep014AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/387798/Travaux%20Mayenne%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/387798/Travaux%20Mayenne%20GIS%20Map.meta.js
// ==/UserScript==
// contibutorFR: laurenthembord
(function() {
    'use strict';

    var debugLevel = 0;
    var mapWindow;
    var Extent;
    var SpatialReference;
    var receiverAdded = false;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('PA GIS:', message);
        }
    }

    function onButtonClick() {
        var wazeExt = W.map.getExtent();
        var url = 'https://www.arcgis.com/home/webmap/viewer.html?webmap=8e1997359ffa4a58b1b78ff9e79e027e&extent=';
        url += wazeExt.left + '%2C' + wazeExt.bottom + '%2C' + wazeExt.right + '%2C' + wazeExt.top + '%2C102113';
        if (!mapWindow || mapWindow.closed) {
            mapWindow = window.open(null, 'tma_gis_map');
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
                $('<a>',{id:'tma-gis-button',title:'Ouvre la carte des travaux de la Mayenne dans une nouvelle fenêtre', href:'javascript:void(0)'})
                .text('Ma')
                .css({float:'left',textDecoration:'none', color:'#000000', fontWeight:'bold'})
                .click(onButtonClick)
            )
        );

        setInterval(function() {
            var $btn = $('#tm-gis-button');
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