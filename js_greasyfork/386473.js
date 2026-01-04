// ==UserScript==
// @name         WME Google Maps
// @description  Shows a Google Maps icon in WME bottom right corner. When clicked, opens Google Maps on the same WME location, zoom and language (satellite).
// @namespace    https://greasyfork.org/users/gad_m/wme_google_maps
// @version      0.2.14
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico
// @downloadURL https://update.greasyfork.org/scripts/386473/WME%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/386473/WME%20Google%20Maps.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global I18n */

(function() {

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-google-maps: WME is ready.');
        init();
    } else {
        console.debug('wme-google-maps: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function convertZoom(editorZoom) {
        //let newZoom = /* 12 + */ editorZoom;
        let result = editorZoom + 'z';
        console.log('wme-google-maps: convertZoom() converting: ' + editorZoom + ' returning: ' + result);
        return result;
    }

    function convertLocale(editorLocale) {
        // does nothing (for now).
        let result = editorLocale;
        console.log('wme-google-maps: convertLocale() converting: ' + editorLocale + ' returning: ' + result);
        return result;
    }

    function init() {
        console.log('wme-google-maps: init()');
        let controlPermalink = jQuery('.WazeControlPermalink');
        let googleMapsLink = document.createElement('a');
        googleMapsLink.id = 'wme-google-maps-a';
        googleMapsLink.title = 'Google Maps';
        googleMapsLink.style.display = "inline-block";
        googleMapsLink.style.marginRight = "2px";
        googleMapsLink.href = 'https://www.google.com/maps';
        googleMapsLink.target = '_blank';
        let googleMapsDiv = document.createElement('div');
        googleMapsDiv.class = 'icon';
        googleMapsDiv.style.width = "20px";
        googleMapsDiv.style.height = "20px";
        googleMapsDiv.style.backgroundImage = "url(https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico)";
        googleMapsDiv.style.backgroundSize = "20px 20px";
        googleMapsLink.appendChild(googleMapsDiv);
        controlPermalink.append(googleMapsLink);
        jQuery('#wme-google-maps-a').click(function () {
            console.log('wme-google-maps: click() map center: ' + W.map.getCenter());
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
            console.log('wme-google-maps: click() centerLonLat: ' + centerLonLat);
            let zoom = convertZoom(parseInt(W.map.getZoom()));
            let locale = convertLocale(I18n.locale);
            let href = 'https://www.google.com/maps/@' + centerLonLat.lat + ',' + centerLonLat.lon + ',' + zoom + '/data=!3m1!1e3?hl=' + locale;
            console.log('wme-google-maps: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-google-maps: init() done!');
    } // end init()
}.call(this));