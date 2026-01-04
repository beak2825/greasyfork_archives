// ==UserScript==
// @name         WME OpenStreetMap
// @description  Shows a OpenStreetMap icon in WME bottom right corner. When clicked, opens OpenStreetMap on the same WME location and zoom.
// @namespace    https://greasyfork.org/users/gad_m/wme_openstreetmap
// @version      1.0.1
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/464797/WME%20OpenStreetMap.user.js
// @updateURL https://update.greasyfork.org/scripts/464797/WME%20OpenStreetMap.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global I18n */

(function() {

    let imageUrl = 'data:image/png;base64,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';

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-openstreetmap: WME is ready.');
        init();
    } else {
        console.debug('wme-openstreetmap: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", function () {
            console.debug('wme-openstreetmap: Got "wme-ready" event.');
            init();
        }, {
            once: true,
        });
    }

    function init() {
        console.log('wme-openstreetmap: init()');
        let controlPermalink = jQuery('.WazeControlPermalink');
        let openstreetmapLink = document.createElement('a');
        openstreetmapLink.id = 'wme-openstreetmap-a';
        openstreetmapLink.title = 'OpenStreetMap';
        openstreetmapLink.style.display = "inline-block";
        openstreetmapLink.style.marginRight = "2px";
        openstreetmapLink.href = 'https://www.openstreetmap.org/';
        openstreetmapLink.target = '_blank';
        let openstreetmapDiv = document.createElement('div');
        openstreetmapDiv.class = 'icon';
        openstreetmapDiv.style.width = "20px";
        openstreetmapDiv.style.height = "20px";
        openstreetmapDiv.style.backgroundImage = 'url(' + imageUrl + ')';
        openstreetmapDiv.style.backgroundSize = "20px 20px";
        openstreetmapLink.appendChild(openstreetmapDiv);
        controlPermalink.append(openstreetmapLink);
        jQuery('#wme-openstreetmap-a').on("click", function () {
            console.log('wme-openstreetmap: click() map center: ' + W.map.getCenter());
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
            console.log('wme-openstreetmap: click() centerLonLat: ' + centerLonLat);
            let zoom = W.map.getZoom();
            let href = 'https://www.openstreetmap.org/#map=' + zoom + '/' + centerLonLat.lat.toFixed(5) + '/' + centerLonLat.lon.toFixed(5) + '&layers=G';
            console.log('wme-openstreetmap: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-openstreetmap: init() done!');
    } // end init()
}.call(this));