// ==UserScript==
// @name          WME GIS Buttons
// @author        @Philistine11
// @namespace     https://greasyfork.org/en/users/53803
// @description   Displays the locality of the current map location and provides links to open GIS if available
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @grant         GM.xmlHttpRequest
// @connect       script.google.com
// @connect       script.googleusercontent.com
// @connect       maps.googleapis.com
// @version       1.7.0
// @downloadURL https://update.greasyfork.org/scripts/21228/WME%20GIS%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/21228/WME%20GIS%20Buttons.meta.js
// ==/UserScript==
/* global $, W, OpenLayers */

function gm_get(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: e => resolve(e.response),
            onerror: reject,
            ontimeout: reject,
        });
    });
}

async function gis_init() {
    let gisButtonsOn = JSON.parse(localStorage.getItem('gisButtonsOn'));
    let gisButtonsApiKey = localStorage.getItem('gisButtonsApiKey');
    let gisButtonsDefaultGoogle = JSON.parse(localStorage.getItem('gisButtonsDefaultGoogle'));
    const gisButtons = $('<div style="display:flex; gap:2px; padding-left:2rem;"><div class="btn btn-default" style="padding:5px;"><span id="gisStatus" class="fa fa-spinner fa-pulse" style="font-size:x-large;"></span></div><a id="gisSubLocality" class="btn btn-default disabled hide" target="_blank" href="#">Sublocality</a><a id="gisLocality" class="btn btn-default disabled hide" target="_blank" href="#">Locality</a><a id="gisCounty" class="btn btn-default disabled hide" target="_blank" href="#">County</a><a id="gisState" class="btn btn-default disabled hide" target="_blank" href="#">State</a></div>');

    gisButtons.find('#gisStatus').click(() => {
        gisButtonsOn = !gisButtonsOn;
        localStorage.setItem('gisButtonsOn', gisButtonsOn);
        start();
    }).contextmenu(() => {
        do {
            gisButtonsApiKey = prompt("Enter your Google Maps API key:", gisButtonsApiKey || "").trim();
        } while (gisButtonsApiKey && gisButtonsApiKey.length != 39);
        localStorage.setItem('gisButtonsApiKey', gisButtonsApiKey);
        if (gisButtonsApiKey) {
            gisButtonsDefaultGoogle = confirm("Use Google Maps API by default ('OK'), or only when Census data is not available ('Cancel')?");
            localStorage.setItem('gisButtonsDefaultGoogle', gisButtonsDefaultGoogle);
        }
        start();
        return false;
    });

    let trigger;
    const setTrigger = () => {trigger = setTimeout(update, 1000);}
    const clearTrigger = () => clearTimeout(trigger);

    const states = {};
    const rows = await gm_get('https://script.google.com/macros/s/AKfycbx2bytvT5Un0TWcaU7BpVkauqeE8zqt8Mek7Zq-OF-bznGYDyZw/exec?link=10dR8z16eKPHeI-ywLcHh2UNS3enQ7gt36Hhzm9nOJbA');
    for (let row in rows) states[rows[row][0]] = rows[row][1];

    const update = async () => {
        $('#gisStatus').removeClass().addClass('fa fa-spinner fa-pulse').css('color','').attr('title','');
        $('#gisSubLocality, #gisLocality, #gisCounty, #gisState').addClass('hide');
        let sublocality = '', locality = '', county = '', state = '';

        const center = W.map.getOLMap().getCenter().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
        const censusData = gisButtonsDefaultGoogle ? {} : await $.getJSON(`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?benchmark=Public_AR_Current&vintage=Current_Current&format=jsonp&callback=?&x=${center.lon}&y=${center.lat}`);
        if (censusData.result && Object.keys(censusData.result.geographies).length) {
            if (censusData.result.geographies.hasOwnProperty('States')) {
                state = censusData.result.geographies['States'][0].NAME;
                $('#gisState').removeClass('hide').text(state);
            }
            if (censusData.result.geographies.hasOwnProperty('Counties')) {
                county = censusData.result.geographies['Counties'][0].NAME;
                $('#gisCounty').removeClass('hide').text(county);
            }
            if (censusData.result.geographies.hasOwnProperty('Incorporated Places')) {
                locality = censusData.result.geographies['Incorporated Places'][0].BASENAME;
                $('#gisLocality').removeClass('hide').text(locality);
            }
        } else {
            if (!gisButtonsApiKey)
                return $('#gisStatus').removeClass().addClass('fa fa-key').css('color','red').attr('title',"Right-click to set Google Maps API Key");

            const googleData = await gm_get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${center.lat},${center.lon}&key=${gisButtonsApiKey}`);
            if (googleData.status === 'OK') {
                const locs = googleData.results.find((result) => !result.types.includes("point_of_interest")).address_components || [];
                for (let loc = 0; loc < locs.length; loc++)
                    if (locs[loc].types.indexOf('administrative_area_level_1') !== -1) {
                        state = locs[loc].long_name;
                        $('#gisState').removeClass('hide').text(state);
                    } else if (locs[loc].types.indexOf('administrative_area_level_2') !== -1) {
                        county = locs[loc].long_name;
                        $('#gisCounty').removeClass('hide').text(county);
                    } else if (locs[loc].types.indexOf('locality') !== -1) {
                        locality = locs[loc].long_name;
                        $('#gisLocality').removeClass('hide').text(locality);
                    } else if (locs[loc].types.indexOf('sublocality') !== -1 || locs[loc].types.indexOf('neighborhood') !== -1) {
                        sublocality = locs[loc].long_name;
                        $('#gisSubLocality').removeClass('hide').text(sublocality);
                    }
            } else {
                $('#gisStatus').removeClass().addClass('fa fa-exclamation-circle').css('color','red').attr('title', "Check console for errors");
                return console.error("GIS Buttons", censusData, googleData);
            }
        }

        $('#gisLocality, #gisCounty, #gisState').prop('href', '#').addClass('disabled');
        if (states.hasOwnProperty(state)) {
            if (typeof (states[state]) === 'string')
                states[state] = await gm_get(`https://script.google.com/macros/s/AKfycbx2bytvT5Un0TWcaU7BpVkauqeE8zqt8Mek7Zq-OF-bznGYDyZw/exec?link=${states[state]}`);
            for (let row in states[state])
                if (states[state][row][2] !== '')
                    if (states[state][row][1] === 'State') {
                        $('#gisState').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom())).removeClass('disabled');
                    } else if (states[state][row][1] === 'County') {
                        if (county.indexOf(states[state][row][0]) != -1)
                            $('#gisCounty').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom())).removeClass('disabled');
                    } else if (states[state][row][0] === locality)
                        $('#gisLocality').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom())).removeClass('disabled');
        }
        $('#gisStatus').removeClass().addClass('fa fa-power-off').css('color','green').attr('title',"Click to turn off GIS Buttons");
    };

    function start() {
        const location = $('div.topbar:not(.topbar-mte) > div.location-info-region');
        if (location.length === 0) return setTimeout(start, 500);
        location.after(gisButtons);

        const mapEvents = W.map.events;
        if (gisButtonsOn) {
            mapEvents.register('movestart', null, clearTrigger);
            mapEvents.register('moveend', null, setTrigger);
            update();
        } else {
            clearTrigger();
            mapEvents.unregister('movestart', null, clearTrigger);
            mapEvents.unregister('moveend', null, setTrigger);
            $('#gisSubLocality, #gisLocality, #gisCounty, #gisState').addClass('hide');
            $('#gisStatus').removeClass().addClass('fa fa-power-off').css('color','red').attr('title',"Click to turn on GIS Buttons");
        }
    }

    start();
}

gis_init();