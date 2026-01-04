// ==UserScript==
// @name             WME Enhanced Search
// @namespace        https://greasyfork.org/en/users/166843-wazedev
// @version          2025.08.21.01
// @description      Enhances the search box to parse WME PLs and URLs from other maps to move to the location & zoom
// @author           WazeDev
// @match            https://www.waze.com/editor*
// @match            https://www.waze.com/*/editor*
// @match            https://beta.waze.com/editor*
// @match            https://beta.waze.com/*/editor*
// @exclude          https://www.waze.com/*user/editor*
// @exclude          https://www.waze.com/discuss/*
// @grant            GM_xmlhttpRequest
// @grant            unsafeWindow
// @connect          c.gle
// @require          https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require          https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/381111/WME%20Enhanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/381111/WME%20Enhanced%20Search.meta.js
// ==/UserScript==

/* global W */
/* ecmaVersion 2017 */
/* global $ */
/* global _ */
/* global WazeWrap */
/* global require */
/* global turf */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    const scriptName = 'Enhanced Search';
    const scriptId = 'enh-search';
    const updateMessage = "Removing What3Words handling - free support is no longer offered.";

    var searchBoxTarget = "#search-autocomplete";

    let wmeSDK;
    unsafeWindow.SDK_INITIALIZED.then(() => {
        wmeSDK = getWmeSdk({ scriptId, scriptName });
        wmeSDK.Events.once({ eventName: 'wme-ready' }).then(async () => {
            for (let initCount = 1; initCount <= 100; initCount++) {
                if (WazeWrap?.Ready && $(`${searchBoxTarget}`).length > 0) return init();
                else if (initCount === 1) console.log('Enhanced Search: Waiting for WazeWrap...');

                await new Promise(r => setTimeout(r, 200));
            }
            console.error('Enhanced Search: WazeWrap loading failed. Giving up.');
        });
    });

    function init(){
        wmeSDK.Map.addLayer({
            layerName: scriptName,
            styleRules: [
                {
                    style: {
                        strokeColor: "#ee9900",
                        strokeDashstyle: "none",
                        strokeLinecap: "round",
                        strokeWidth: 18,
                        strokeOpacity: 0.55,
                        fill: false,
                        pointRadius: 6
                    },
                },
            ]
        });

        //init function in case we need to set up a tab for configuration.  I don't want to do it.  Don't make me.
        enhanceSearch();

        WazeWrap.Interface.ShowScriptUpdate("WME Enhanced Search", GM_info.script.version, updateMessage, "https://greasyfork.org/en/scripts/381111-wme-enhanced-search", "https://www.waze.com/discuss/t/script-wme-enhanced-search/208815");
    }

    var regexs = {
        'wazeurl': new RegExp('(?:http(?:s):\/\/)?(?:www\.|beta\.)?waze\.com\/(?:.*?\/)?(editor|livemap)[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*', "ig"),
        'gmapurl': new RegExp('(?:http(?:s):\/\/)?(?:www)?google\.com\/(?:.*?\/)?maps[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*', "ig"),
        'gmapurlold': new RegExp('(?:http(?:s):\\/\\/)?maps.google\\.com\\/(?:.*?\\/)?maps\\?ll=(-?\\d*.\\d*),(-?\\d*.\\d*)'),
        'bingurl': new RegExp('(?:http(?:s):\/\/)?(?:www)?bing\.com\/(?:.*?\/)?maps[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*'),
        'openstreetmapurl': new RegExp('(?:http(?:s):\/\/)?(?:www)?openstreetmap\.org\/(?:.*?\/)?#map[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*'),
        'openstreetmapurlold': new RegExp('(?:http(?:s):\\/\\/)?(?:www)?openstreetmap\\.org\\/index\\.html\\?mlat=(-?\\d*.\\d*)&mlon=(-?\\d*.\\d*)&zoom=(\\d+)'),
        'pluscodeurl': new RegExp('(?:http(?:s):\\/\\/)?plus\\.codes\\/([a-zA-Z0-9+]*)'),
        'place_mc_id': new RegExp('\d*\.\d*\.\d*', "ig"),
        'segmentid': new RegExp('\d*'),
        'mandrillappurl': new RegExp('(?:http(?:s):\/\/)?(?:www\.)?mandrillapp\.com\/(?:.*?\/)?www\.waze\.com[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*_(.*)', "ig"),
        'pluscode': new RegExp('[23456789CFGHJMPQRVWX]{2,8}\\+[23456789CFGHJMPQRVWX]{0,2}'),
        'regexHighlight': new RegExp('^(\\/.*?\\/i?)'),
        'livemapshareurlold' : new RegExp('(?:http(?:s):\\/\\/)?www.waze\\.com\/ul\\?ll=(-?\\d*.\\d*)(?:(?:%2C)|,)(-?\\d*.\\d*).*'),
        'livemapshareurl' : new RegExp('(?:http(?:s):\\/\\/)?www.waze\\.com\/.*\\?latlng=(-?\\d*.\\d*)(?:(?:%2C)|,)(-?\\d*.\\d*).*'),
        'ohgo': new RegExp('(?:http(?:s):\\/\\/)?(?:www\\.)?ohgo\\.com\\/.*\\?lt=(-?\\d*.\\d*)&ln=(-?\\d*.\\d*)&z=(\\d+)'),
        'viewissue': new RegExp('(?:http(?:s):\\/\\/)?(?:www\\.)?c\\.gle\\/([-a-zA-Z0-9]*)'),
   };

    function enhanceSearch(){
        $(`${searchBoxTarget}`)[0].removeEventListener('paste', readPaste, false);
        $(`${searchBoxTarget}`)[0].addEventListener('paste', readPaste, false);
        $(`${searchBoxTarget}`).css({"border": "#2f799b 2px solid", "margin-right":"2px"});
        $(`${searchBoxTarget}`).on("dragover", function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(`${searchBoxTarget}`)[0].value="";
        });
        $(`${searchBoxTarget}`).on("drop", function(event) {
            event.preventDefault();
            event.stopPropagation();
            drop(event);
        });

        $(`${searchBoxTarget}`).keyup(regexHighlight);
    }

    function onScreen(obj) {
        const bbPoly = turf.bboxPolygon(wmeSDK.Map.getMapExtent());
        return turf.booleanIntersects(obj.geometry,bbPoly);
    }

    let placesHighlighted = { ids: [], objectType: "venue" };
    let segmentsHighlighted = { ids: [], objectType: "segment" };
    function regexHighlight(){
        let query = $(`${searchBoxTarget}`)[0].shadowRoot.querySelector('#text-input').value;
        if(query?.length > 0 && query.match(regexs.regexHighlight)){
            let highlights=[];
            let regexFlag = "";

            if(query[query.length-1] === "i"){
                regexFlag = "i";
                query=query.slice(0, -1);
            }
            query = query.substring(1, query.length-1);

            if(query.length < 2)
                return;
            WazeWrap.Events.unregister('moveend', window, regexHighlight);
            WazeWrap.Events.register('moveend', window, regexHighlight);
            WazeWrap.Events.unregister('zoomend', window, regexHighlight);
            WazeWrap.Events.register('zoomend', window, regexHighlight);

            placesHighlighted.ids = [];
            segmentsHighlighted.ids = [];

            let onscreenSegments = [];
            $.each(wmeSDK.DataModel.Segments.getAll(), function(k, v){
                if(onScreen(v))
                    onscreenSegments.push(v);
            });

            for(let i = 0; i < onscreenSegments.length; i++){
                if(onscreenSegments[i].primaryStreetId){
                    const st = wmeSDK.DataModel.Streets.getById( { streetId: onscreenSegments[i].primaryStreetId } );
                    if(st?.name?.match(new RegExp(query, regexFlag))){
                        highlights.push( { type: 'Feature', geometry: onscreenSegments[i].geometry, id: onscreenSegments[i].id });
                        segmentsHighlighted.ids.push(onscreenSegments[i].id);
                    }
                    else{
                        if(onscreenSegments[i].alternateStreetIds){
                            let alts = onscreenSegments[i].alternateStreetIds;
                            for(let j=0; j < alts.length; j++){
                                const altSt = wmeSDK.DataModel.Streets.getById( { streetId: alts[j] } );
                                if(altSt?.name?.match(new RegExp(query, regexFlag))){
                                    highlights.push( { type: 'Feature', geometry: onscreenSegments[i].geometry, id: onscreenSegments[i].id });
                                    segmentsHighlighted.ids.push(onscreenSegments[i].id);
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            let onscreenVenues = [];
            $.each(wmeSDK.DataModel.Venues.getAll(), function(k, v){
                if(onScreen(v))
                    onscreenVenues.push(v);
            });

            for(let i = 0; i < onscreenVenues.length; i++){
                if(onscreenVenues[i].name?.match(new RegExp(query, regexFlag))){
                    highlights.push( { type: 'Feature', geometry: onscreenVenues[i].geometry, id: 0 });
                    placesHighlighted.ids.push(onscreenVenues[i].id);
                }
                else if(onscreenVenues[i].aliases){
                    let aliases = onscreenVenues[i].aliases;
                    for(let j=0; j< aliases.length; j++){
                        if(aliases[j].match(new RegExp(query, regexFlag))){
                            highlights.push( { type: 'Feature', geometry: onscreenVenues[i].geometry, id: 0 });
                            placesHighlighted.ids.push(onscreenVenues[i].id);
                            break;
                        }
                    }
                }
            }

            if($('#WMEES_regexCounts').length === 0){
                const counts = `<div id="WMEES_regexCounts" class="fa" style="background-color:white; top:${$(`${searchBoxTarget}`).height()}; width:100%; font-size:14px;"><span id="WMEES_roadcount" style="cursor:pointer;" class="fa-road">0</span><span id="WMEES_placecount" style="margin-left:8px; cursor:pointer;" class="fa-map-marker">0</span></div>`;
                //const el = $(`${searchBoxTarget}`)[0];
                const el = $('.secondary-toolbar')[0];
                $(el).prepend(counts);
                $('#WMEES_placecount').click(function(){
                    if(placesHighlighted.ids.length > 0)
                        wmeSDK.Editing.setSelection( { selection: placesHighlighted } );
                });

                $('#WMEES_roadcount').click(function(){
                    if(segmentsHighlighted.ids.length > 0)
                        wmeSDK.Editing.setSelection( { selection: segmentsHighlighted } );
                });
            }

            $('#WMEES_placecount').html(placesHighlighted.ids.length);
            $('#WMEES_roadcount').html(segmentsHighlighted.ids.length);

            if(highlights.length > 0) {
                wmeSDK.Map.removeAllFeaturesFromLayer( { layerName: scriptName });
                wmeSDK.Map.addFeaturesToLayer( { features: highlights, layerName: scriptName });
                }
            else {
                wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: scriptName });
                WazeWrap.Events.unregister('moveend', window, regexHighlight);
                WazeWrap.Events.unregister('zoomend', window, regexHighlight);
                //$('#WMEES_regexCounts').remove();
                }
        }
        else{
            WazeWrap.Events.unregister('moveend', window, regexHighlight);
            WazeWrap.Events.unregister('zoomend', window, regexHighlight);
            wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: scriptName });
            $('#WMEES_regexCounts').remove();
        }
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.originalEvent.dataTransfer.getData("text");
        parsePaste(data);
    }

    async function readPaste(e){
        let pasteVal = e.clipboardData.getData('text'); //await navigator.clipboard.readText();
        if(!pasteVal.match(regexs.regexHighlight)) //don't try and parse if it matches the regex highlight format - it will match some weird stuff
            parsePaste(pasteVal);
    }

    async function parsePaste(pasteVal){
        let processed = false;
        let selection = { ids: [] };
        if(pasteVal.match(regexs.viewissue)){
            // the View Issue link in new UR emails is a c.gle URL. Fetch that to get the finalUrl, which should be a WME PL
            GM_xmlhttpRequest({
                method: 'GET',
                url: pasteVal,
                onload: function(res) {
                    parsePaste(res.finalUrl);
                },
                onError: function(err) {
                    console.error('ES req: ' + err); }
            });
            processed = true;
        }
        else if(pasteVal.match(regexs.wazeurl)){
            let params = pasteVal.match(/lon=(-?\d*.\d*)&lat=(-?\d*.\d*)&zoom(?:Level)?=(\d+)/);
            let lon = pasteVal.match(/lon=(-?\d*.\d*)/)[1];
            let lat = pasteVal.match(/lat=(-?\d*.\d*)/)[1];
            let zoom = parseInt(pasteVal.match(/zoom(?:Level)?=(\d+)/)[1]);
            if(pasteVal.match(/zoom=/))
                zoom += 12;
            zoom = (Math.max(12,Math.min(22,zoom)));
            jump4326(lon, lat, zoom);
            if(pasteVal.match(/&segments=(.*)(?:&|$)/)){
                if(!$('#layer-switcher-group_road').prop('checked'))
                    $('#layer-switcher-group_road').click();
                if(!$('#layer-switcher-item_road').prop('checked'))
                    $('#layer-switcher-item_road').click();
            }
            if(pasteVal.match(/&segmentSuggestions=(.*)(?:&|$)/)){
                if(!$('#layer-switcher-group_road').prop('checked'))
                    $('#layer-switcher-group_road').click();
                if(!$('#layer-switcher-item_road').prop('checked'))
                    $('#layer-switcher-item_road').click();
            }
            if(pasteVal.match(/&venues=(.*)(?:&|$)/)){
                if(!$('#layer-switcher-group_places').prop('checked'))
                    $('#layer-switcher-group_places').click();
                if(!$('#layer-switcher-item_venues').prop('checked'))
                    $('#layer-switcher-item_venues').click();
                if(!$('#layer-switcher-item_residential_places').prop('checked'))
                    $('#layer-switcher-item_residential_places').click();
                if(!$('#layer-switcher-item_parking_places').prop('checked'))
                    $('#layer-switcher-item_parking_places').click();
            }
            if(pasteVal.match(/&mapUpdateRequest=(\d*)/)){
                if(!$('#layer-switcher-group_issues_tracker').prop('checked'))
                    $('#layer-switcher-group_issues_tracker').click();
            }
            if(pasteVal.match(/&mapProblem=(\d%2[a-zA-Z]\d*)/)){
                if(!$('#layer-switcher-group_issues_tracker').prop('checked'))
                    $('#layer-switcher-group_issues_tracker').click();
            }
            if(pasteVal.match(/&mapComments=(.*)(?:&|$)/)){
                if(!$('#layer-switcher-group_display').prop('checked'))
                    $('#layer-switcher-group_display').click();
                if(!$('#layer-switcher-item_map_comments').prop('checked'))
                    $('#layer-switcher-item_map_comments').click();
            }
            if(pasteVal.match(/&permanentHazards=(\d*)/)){
                if(!$('#layer-switcher-group_permanent_hazards').prop('checked'))
                    $('#layer-switcher-group_permanent_hazards').click();
            }

            WazeWrap.Model.onModelReady(async function(){
                await waitFeaturesLoaded();
                //Check for selected objects
                if(pasteVal.match(/&segments=(.*?)(?:$|&)/)){
                    let segs = pasteVal.match(/&segments=(.*?)(?:$|&)/)[1];
                    segs = segs.split(',');
                    selection.objectType = "segment";
                    for(let i=0; i <segs.length; i++) {
                        const s = wmeSDK.DataModel.Segments.getById( { segmentId: +segs[i] } );
                        if (s) { selection.ids.push(+segs[i]); }
                    }
                }
                if(pasteVal.match(/&segmentSuggestions=(.*?)(?:$|&)/)){
                    let segs = pasteVal.match(/&segmentSuggestions=(.*?)(?:$|&)/)[1];
                    selection.objectType = "segmentSuggestion";
                    segs = segs.split(',');
                    for(let i=0; i <segs.length; i++) {
                        if (W.model.segmentSuggestions.getObjectById(segs[i])) { selection.ids.push(+segs[i]); }
                    }
                }

                if(pasteVal.match(/&venues=(.*?)(?:&|$)/)){
                    let venues = pasteVal.match(/&venues=(.*?)(?:&|$)/)[1];
                    venues = venues.split(',');
                    selection.objectType = "venue";
                    for(let i=0; i <venues.length; i++) {
                        const v = wmeSDK.DataModel.Venues.getById( { venueId: venues[i] } );
                        if (v) { selection.ids.push(venues[i]); }
                    }
                }

                if(pasteVal.match(/&mapUpdateRequest=(\d*)/)){
                    const urid = pasteVal.match(/&mapUpdateRequest=(\d*)/)[1];
                    const ur = W.model.mapUpdateRequests.getObjectById(urid)
                    if (ur != null) {
                       W.problemsController.showProblem(ur, { showNext: false })
                    }
                }

                if(pasteVal.match(/&mapProblem=(\d%2[a-zA-Z]\d*)/)){
                    let mpid = pasteVal.match(/&mapProblem=(\d%2[a-zA-Z]\d*)/)[1];
                    mpid = decodeURIComponent(mpid);
                    const mp = W.model.mapProblems.getObjectById(mpid)
                    if (mp != null) {
                       W.problemsController.showProblem(mp, { showNext: false })
                    }
                }

                if(pasteVal.match(/&mapComments=(.*)(?:&|$)/)){
                    const mc = pasteVal.match(/&mapComments=(.*)(?:&|$)/)[1];
                    const m = wmeSDK.DataModel.MapComments.getById( { mapCommentId: mc } );
                    selection.objectType = "mapComment";
                    if (m) { selection.ids.push(mc); }
                }

                if(pasteVal.match(/&permanentHazards=(\d*)/)){
                    const hzid = pasteVal.match(/&permanentHazards=(\d*)/)[1];
                    selection.objectType = "permanentHazard";
                    // SDK - need way to verify its a valid hazard on screen
                    //const h = wmeSDK.DataModel.PermanentHazards.getById( { xxxId: +hzid } );
                    selection.ids.push(+hzid);

                }

                if (selection.ids.length > 0 ) {
                    wmeSDK.Editing.setSelection( { selection } );
                }

                setTimeout(() => {$(`${searchBoxTarget}`)[0].value = '';}, 100);
            }, true, this);
        }
        else if(pasteVal.match(regexs.livemapshareurlold)){
            let params = pasteVal.match(regexs.livemapshareurlold);
            jump4326(params[2], params[1], 6);
            processed = true;
        }
        else if(pasteVal.match(regexs.livemapshareurl)){
            let params = pasteVal.match(regexs.livemapshareurl);
            jump4326(params[2], params[1], 18);
            processed = true;
        }
        else if(pasteVal.match(regexs.gmapurlold)){
            let params = pasteVal.match(/maps\?ll=(-?\d*.\d*),(-?\d*.\d*)/);
            jump4326(params[2], params[1], 6);
            processed = true;
        }
        else if(pasteVal.match(regexs.gmapurl)){
            let zoom;
            let params = pasteVal.split('@').pop().split(',');
            zoom = parseInt(params[2]);
            if (zoom > 50) { zoom = 18; } // if zoom arg is in meters, just use 18
            zoom = (Math.max(12,Math.min(22,zoom)));
            jump4326(params[1], params[0], zoom);
            processed = true;
        }
        else if(pasteVal.match(regexs.bingurl)){
            let params = pasteVal.match(/&cp=(-?\d*.\d*)~(-?\d*.\d*)&lvl=(\d+)/);
            let zoom = (Math.max(12,Math.min(22,(parseInt(params[3])))));
            jump4326(params[2], params[1], zoom);
            processed = true;
        }
        else if(pasteVal.match(regexs.openstreetmapurl)){
            let params = pasteVal.match(/#map=(\d+)\/(-?\d*.\d*)\/(-?\d*.\d*)/);
            let zoom = (Math.max(12,Math.min(22,(parseInt(params[1])))));
            jump4326(params[3], params[2], zoom);
            processed = true;
        }
        else if(pasteVal.match(regexs.openstreetmapurlold)){
            let params = pasteVal.match(/mlat=(-?\d*.\d*)&mlon=(-?\d*.\d*)&zoom=(\d+)/);
            jump4326(params[2], params[1], (Math.max(12,Math.min(22,(parseInt(params[3]))))));
            processed = true;
        }
        else if(pasteVal.match(regexs.ohgo)){
            let params = pasteVal.match(regexs.ohgo);
            jump4326(params[2], params[1], params[3]);
            processed = true;
        }
        else if(pasteVal.match(regexs.pluscodeurl)){
            let code = pasteVal.match(regexs.pluscodeurl)[1];
            try{
                let result = await $.get(`https://plus.codes/api?address=${encodeURIComponent(code)}`);
                let loc = result.plus_code.geometry.location;
                jump4326(loc.lng, loc.lat);
                processed = true;
            } catch(err){
                console.log(err);
            }
        }
        else if(pasteVal.match(regexs.pluscode)){ //plus code directly pasted
            try{
                let result = await $.get(`https://plus.codes/api?address=${encodeURIComponent(pasteVal)}`);
                let loc = result.plus_code.geometry.location;
                jump4326(loc.lng, loc.lat);
                processed = true;
            } catch(err){
                console.log(err);
            }
        }
        else if(pasteVal.match(regexs.mandrillappurl)){
            let decoded = pasteVal.match(/(?:http(?:s):\/\/)?(?:www\.)?mandrillapp\.com\/(?:.*?\/)?www\.waze\.com[-a-zA-Z0-9@:%_\+,.~#?&\/\/=]*_(.*)/)[1];
            let url = atob(decoded).split(",")[0];
            processed = true;
            parsePaste(`https://www.waze.com/editor/${url}`);
        }
        else if(pasteVal.match(/\d*\.\d*\.\d*/)){ //Waze Place/mapComment id pasted directly
            const landmark = wmeSDK.DataModel.Venues.getById( { venueId: pasteVal } );
            const mapcomment = wmeSDK.DataModel.MapComments.getById( { mapCommentId: pasteVal } );
            if (landmark) {
                wmeSDK.Editing.setSelection( { selection: { ids: [pasteVal], objectType: 'venue' } } )
                processed = true;
            }
            else if(mapcomment){
                wmeSDK.Editing.setSelection( { selection: { ids: [pasteVal], objectType: 'mapComment' } } )
                processed = true;
            }
            else{ //use segmentFinder to find the venue, jump there & select
                try{
                    let result = await WazeWrap.Util.findVenue(wmeSDK.Settings.getRegionCode(), pasteVal);
                    if(result){
                        jump4326(result.x, result.y, 18); //jumping to z18 to try and ensure all places are on screen, without zooming out too far
                        WazeWrap.Model.onModelReady(async function(){
                            await waitFeaturesLoaded();
                            $(`${searchBoxTarget}`)[0].value = '';
                            wmeSDK.Editing.setSelection( { selection: { ids: [pasteVal], objectType: 'venue' } } )
                        }, true, this);
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else if(pasteVal.match(regexs.segmentid)){
            let segsArr = pasteVal.split(',');
            selection.objectType = "segment";
            for(let i=0; i <segsArr.length; i++) {
                const s = wmeSDK.DataModel.Segments.getById( { segmentId: +segsArr[i] } );
                if (s) { selection.ids.push(+segsArr[i]); }
            }
            if (selection.ids.length > 0 ) {
                wmeSDK.Editing.setSelection( { selection } );
            }
            else{
                //Couldn't find segment(s) - try to locate the first one and then select them all
                try{
                    let result = await WazeWrap.Util.findSegment(wmeSDK.Settings.getRegionCode(), segsArr[0]); //await $.get(`https://w-tools.org/api/SegmentFinder?find=${segsArr[0]}`);
                    if(result){
                        jump4326(result.x, result.y, 18); //jumping to z18 to try and ensure all segments are on screen, without zooming out too far
                        WazeWrap.Model.onModelReady(async () =>{
                            await waitFeaturesLoaded();
                            for(let i=0; i <segsArr.length; i++) {
                                const s = wmeSDK.DataModel.Segments.getById( { segmentId: +segsArr[i] } );
                                if (s) { selection.ids.push(+segsArr[i]); }
                            }
                            $(`${searchBoxTarget}`)[0].value = '';
                            wmeSDK.Editing.setSelection( { selection } );
                        }, true, this);
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
        }

        if(processed)
            setTimeout(function(){$(`${searchBoxTarget}`)[0].value = '';}, 50);
    }

/* waitFeaturesLoaded
   when the map is moved and data needs to be loaded for the newly displayed area, WME makes a "Features" call to get specified
   map data to be displayed. When the features call is made, the "loadingFeatures" flag is set true and will turn false when the
   Features data is received and processed into the map data model.
*/
    async function waitFeaturesLoaded() {
        var count = 1;
        return new Promise(function (resolve) {
            var interval = setInterval(function () {
                const ldf = W.app.layout.model.attributes.loadingFeatures; // SDK - need access to this status
                count++;

                if (!ldf) {
                    clearInterval(interval);
                    resolve(null);
                }
                else if (count > 100) {
                    clearInterval(interval);;
                    console.warn('ESrch - timeout waiting for features loaded');
                    resolve(null)
                }
            }, 100);
        });
    }

    function jump4326(lon, lat, zoom){
        const lonLat = { lat: +lat, lon: +lon };
        if(zoom)
            wmeSDK.Map.setMapCenter({ lonLat, zoomLevel: zoom} );
        else
            wmeSDK.Map.setMapCenter({ lonLat} );

    }

})();
