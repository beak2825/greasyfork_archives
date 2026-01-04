// ==UserScript==
// @name         WME govmap (IL)
// @description  Shows a govmap icon in WME bottom right corner. When clicked, opens govmap on the same WME location and zoom.
// @namespace    https://greasyfork.org/users/gad_m/wme_govmap
// @version      1.0.15
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.2/proj4.js
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/387730/WME%20govmap%20%28IL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387730/WME%20govmap%20%28IL%29.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global proj4 */
/* global I18n */

(function() {

    let imageUrl = 'data:image/png;base64,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';

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-govmap: WME is ready.');
        init();
    } else {
        console.debug('wme-govmap: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    /*function convertLocale(editorLocale) {
        // does nothing (for now).
        let result = editorLocale;
        console.log('wme-govmap: convertLocale() converting: ' + editorLocale + ' returning: ' + result);
        return result;
    }*/

    function init() {
        console.log('wme-govmap: init()');
        // Define EPSG:2039 as Israeli Transverse Mercator
        proj4.defs("EPSG:2039", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-24.0024,-17.1032,-17.8444,-0.33077,-1.85269,1.66969,5.4248 +units=m +no_defs");
        let controlPermalink = jQuery('.WazeControlPermalink');
        let govmapLink = document.createElement('a');
        govmapLink.id = 'wme-govmap-a';
        govmapLink.title = 'Gov Map';
        govmapLink.style.display = "inline-block";
        govmapLink.style.marginRight = "2px";
        govmapLink.href = 'https://www.govmap.gov.il/';
        govmapLink.target = '_blank';
        let govmapDiv = document.createElement('div');
        govmapDiv.class = 'icon';
        govmapDiv.style.width = "20px";
        govmapDiv.style.height = "20px";
        govmapDiv.style.backgroundImage = 'url(' + imageUrl + ')';
        govmapDiv.style.backgroundSize = "20px 20px";
        govmapLink.appendChild(govmapDiv);
        controlPermalink.append(govmapLink);
        jQuery('#wme-govmap-a').click(function () {
            console.log('wme-govmap: click() W map center: ' + JSON.stringify(W.map.getCenter()));
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
            console.log('wme-govmap: click() transform to Lon/Lat: ' + centerLonLat);
            let sourceCoords = [centerLonLat.lon, centerLonLat.lat];
            let targetCoords = proj4("EPSG:4326", "EPSG:2039", sourceCoords);
            let x = targetCoords[0].toFixed(2);
            let y = targetCoords[1].toFixed(2);
            console.log('wme-govmap: click() transform to ITM (x,y): (' + x + ',' + y + ')');
            let zoom = parseInt(W.map.getZoom()) - 7;
            //let locale = convertLocale(I18n.locale);
            let href = 'https://www.govmap.gov.il/?c=' + x + ',' + y + '&b=2&z=' + zoom;
            console.log('wme-govmap: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-govmap: init() done!');
    } // end init()
}.call(this));
