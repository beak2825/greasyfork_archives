// ==UserScript==
// @name          WME Closure Buttons
// @author        hijacked from @Philistine11
// @namespace     https://greasyfork.org/en/users/142632
// @description   Displays the locality of the current location and provides links to open closure if available
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @version       0.5.10
// @downloadURL https://update.greasyfork.org/scripts/407740/WME%20Closure%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/407740/WME%20Closure%20Buttons.meta.js
// ==/UserScript==
/* global $, W, OL */

async function closure_init() {
    let closureButtonsOn = JSON.parse(localStorage.getItem('closureButtonsOn'));
    let closureButtonsApiKey = localStorage.getItem('closureButtonsApiKey');
    const closureButtons = $('<div class="input-group input-group-sm" style="float:left; padding-left:2rem;"><span class="input-group-addon" style="display:table-cell; font-size:2rem; line-height:0; width:0;"><span id="closureStatus" class="fa fa-spinner fa-pulse" style="line-height:0;"></span></span><div class="input-group-btn" style="width:0;"><a id="closureLocality" class="btn btn-default disabled hidden" style="border:1px solid" target="_blank" href="#">Locality</a><a id="closureCounty" class="btn btn-default disabled hidden" style="border:1px solid" target="_blank" href="#">County</a><a id="closureState" class="btn btn-default disabled hidden" style="border:1px solid" target="_blank" href="#">State</a></span></div>');

    closureButtons.find('#closureStatus').click(() => {
        closureButtonsOn = !closureButtonsOn;
        localStorage.setItem('closureButtonsOn', closureButtonsOn);
        start();
    }).contextmenu(() => {
        do {
            closureButtonsApiKey = prompt("Enter your closure Buttons API key:", closureButtonsApiKey || "").trim();
        } while (!closureButtonsApiKey || closureButtonsApiKey.length != 39);
        localStorage.setItem('closureButtonsApiKey', closureButtonsApiKey);
        start();
        return false;
    });

    let trigger;
    const setTrigger = () => {if (closureButtonsApiKey) trigger = setTimeout(update, 1000);}
    const clearTrigger = () => clearTimeout(trigger);

    const states = {};
    const rows = await $.getJSON('https://script.google.com/macros/s/AKfycbxCC15khLP8llc2wADooE3GeVWJDHqxDxCttbEQK1Q7u0VEajY/exec?link=10JedimAhFICW2TYLZh12Wv-XIzNqeBRP9HVP-nhOxOc');
    for (let row in rows) states[rows[row][0]] = rows[row][1];

    const update = async () => {
        $('#closureStatus').removeClass().addClass('fa fa-spinner fa-pulse').css('color','').attr('title','');
        const center = W.map.getCenter().transform(new OL.Projection('EPSG:900913'), new OL.Projection('EPSG:4326'));
        const data = await $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${center.lat},${center.lon}&key=${closureButtonsApiKey}`);
        if (data.status !== 'OK') {
            $('#closureStatus').removeClass().addClass('fa fa-exclamation-circle').css('color','red').attr('title', "Check console for errors");
            return console.error("closure Buttons", data);
        }

        let locs = data.results.find((result) => !result.types.includes("point_of_interest")).address_components || [];
        let locality = '', county = '', state = '';
        $('#closureLocality, #closureCounty, #closureState').addClass('hidden');
        for (let loc = 0; loc < locs.length; loc++)
            if (locs[loc].types.indexOf('administrative_area_level_1') !== -1) {
                state = locs[loc].long_name;
                $('#closureState').removeClass('hidden').text(state);
            } else if (locs[loc].types.indexOf('administrative_area_level_2') !== -1) {
                county = locs[loc].long_name;
                $('#closureCounty').removeClass('hidden').text(county);
            } else if (locs[loc].types.indexOf('locality') !== -1) {
                locality = locs[loc].long_name;
                $('#closureLocality').removeClass('hidden').text(locality);
            }

        $('#closureLocality, #closureCounty, #closureState').prop('href', '#').addClass('disabled');
        if (states.hasOwnProperty(state)) {
            if (typeof (states[state]) === 'string')
                states[state] = await $.getJSON(`https://script.google.com/macros/s/AKfycbxCC15khLP8llc2wADooE3GeVWJDHqxDxCttbEQK1Q7u0VEajY/exec?link=${states[state]}`);
            for (let row in states[state])
                if (states[state][row][2] !== '')
                    if (states[state][row][1] === 'State') {
                        $('#closureState').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom()+12)).removeClass('disabled');
                    } else if (states[state][row][1] === 'County') {
                        if (county.indexOf(states[state][row][0]) != -1)
                            $('#closureCounty').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom()+12)).removeClass('disabled');
                    } else if (states[state][row][0] === locality)
                        $('#closureLocality').prop('href', states[state][row][2].replace('<lat>',center.lat).replace('<lon>',center.lon).replace('<zoom>',W.map.getZoom()+12)).removeClass('disabled');
        }
        $('#closureStatus').removeClass().addClass('fa fa-power-off').css('color','green').attr('title',"Click to turn off closure Buttons");
    };

    function start(model, modeId) {
        const mapEvents = W.map.events || W.map.getMapEventsListener();
        if (modeId === 1) {
            clearTrigger();
            mapEvents.unreclosureter('movestart', null, clearTrigger);
            mapEvents.unreclosureter('moveend', null, setTrigger);
            return;
        }

        const location = $('div.topbar:not(.topbar-mte) > div.location-info-region');
        if (location.length === 0) return setTimeout(start, 500);
        location.after(closureButtons);

        if (closureButtonsOn) {
            if (closureButtonsApiKey) {
                mapEvents.reclosureter('movestart', null, clearTrigger);
                mapEvents.reclosureter('moveend', null, setTrigger);
                update();
            } else
                $('#closureStatus').removeClass().addClass('fa fa-key').css('color','red').attr('title',"Right-click to set closure Buttons API Key");
        } else {
            clearTrigger();
            mapEvents.unreclosureter('movestart', null, clearTrigger);
            mapEvents.unreclosureter('moveend', null, setTrigger);
            $('#closureLocality, #closureCounty, #closureState').addClass('hidden');
            $('#closureStatus').removeClass().addClass('fa fa-power-off').css('color','red').attr('title',"Click to turn on closure Buttons");
        }
    }

    W.app.modeController.model.bind('change:mode', start);
    start();
}

closure_init();