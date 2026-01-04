// ==UserScript==
// @name         WME Amudanan (IL)
// @description  Shows an Amudanan icon in WME bottom right corner. When clicked, opens Amudanan on the same WME location and zoom (satellite).
// @namespace    https://greasyfork.org/users/gad_m/wme_amudanan
// @version      1.0.13
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.2/proj4.js
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/387949/WME%20Amudanan%20%28IL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387949/WME%20Amudanan%20%28IL%29.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global I18n */
/* global proj4 */

(function() {

    let imageUrl = 'data:image/png;base64,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';
    console.debug('wme-amudanan: loading script...');

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-amudanan: WME is ready.');
        init();
    } else {
        console.debug('wme-amudanan: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function convertZoom(editorZoom) {
        //let newZoom = /* 12 + */ editorZoom;
        let result = editorZoom;
        console.log('wme-amudanan: convertZoom() converting: ' + editorZoom + ' returning: ' + result);
        return result;
    }

    function init() {
        console.log('wme-amudanan: init()...');
        // Define EPSG:2039 as Israeli Transverse Mercator
        proj4.defs("EPSG:2039", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-24.0024,-17.1032,-17.8444,-0.33077,-1.85269,1.66969,5.4248 +units=m +no_defs");
        let controlPermalink = jQuery('.WazeControlPermalink');
        let amudananLink = document.createElement('a');
        amudananLink.id = 'wme-amudanan-a';
        amudananLink.title = "\u05e2\u05de\u05d5\u05d3 \u05e2\u05e0\u05df";
        amudananLink.style.display = "inline-block";
        amudananLink.style.marginRight = "2px";
        amudananLink.href = 'https://amudanan.co.il/';
        amudananLink.target = '_blank';
        let amudananDiv = document.createElement('div');
        amudananDiv.class = 'icon';
        amudananDiv.style.width = "20px";
        amudananDiv.style.height = "20px";
        amudananDiv.style.backgroundImage = "url(" + imageUrl + ")";
        amudananDiv.style.backgroundSize = "20px 20px";
        amudananLink.appendChild(amudananDiv);
        controlPermalink.append(amudananLink);
        jQuery('#wme-amudanan-a').click(function () {
            console.log('wme-amudanan: click() map center: ' + JSON.stringify(W.map.getCenter()));
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map.projection.remote));
            console.log('wme-amudanan: click() centerLonLat: ' + centerLonLat);
            let sourceCoords = [centerLonLat.lon, centerLonLat.lat];
            let targetCoords = proj4("EPSG:4326", "EPSG:2039", sourceCoords);
            let x = targetCoords[0].toFixed(2);
            let y = targetCoords[1].toFixed(2);
            console.log('wme-amudanan: click() transform to ITM (x,y): (' + x + ',' + y + ')');
            let zoom = convertZoom(parseInt(W.map.getZoom()));
            let href = 'https://amudanan.co.il/?map=Satelite&zoom=' + zoom + '#lat=' + y + '&lon=' + x;
            console.log('wme-amudanan: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-amudanan: init() done!');
    } // end init()
}.call(this));