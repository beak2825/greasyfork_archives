// ==UserScript==
// @name             WME Mapraid Overlays
// @namespace        https://greasyfork.org/en/users/166843-wazedev
// @version          2024.05.29.01
// @description      Mapraid overlays
// @author           JustinS83
// @include          https://www.waze.com/editor*
// @include          https://www.waze.com/*/editor*
// @include          https://beta.waze.com/editor*
// @include          https://beta.waze.com/*/editor*
// @exclude          https://www.waze.com/*user/editor*
// @grant            GM_xmlhttpRequest
// @connect          api.github.com
// @connect          raw.githubusercontent.com
// @require          https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/382883/WME%20Mapraid%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/382883/WME%20Mapraid%20Overlays.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* ecmaVersion 2017 */
/* global $ */
/* global I18n */
/* global _ */
/* global WazeWrap */
/* global require */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    var _settings;
    var _settingsStoreName = '_wme_mapraid_overlays';
    var _kml;
    var _layerName = 'Mapraid Overlay';
    var _layer = null;
    var countryAbbr;
    var _origOpacity;
    var _mapraidNameMap = {};

    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            W.loginManager.user &&
            W.model.getTopCountry() &&
            $ && WazeWrap.Ready)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    bootstrap();

    function isChecked(checkboxId) {
        return $('#' + checkboxId).is(':checked');
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function loadSettings() {
        _settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        let _defaultsettings = {
            layerVisible: true,
            EnabledOverlays: {},
            HideCurrentArea: false
        };
        _settings = $.extend({}, _defaultsettings, _settings);
    }

    function saveSettings() {
        if (localStorage) {
            var settings = {
                layerVisible: _layer.visibility,
                EnabledOverlays: _settings.EnabledOverlays,
                HideCurrentArea: _settings.HideCurrentArea
            };
            localStorage.setItem(_settingsStoreName, JSON.stringify(settings));
        }
    }

    async function getKML(url){
        return await wrapGMXMLHTTP(url); //$.get(url);
    }

    async function wrapGMXMLHTTP(url){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url,
                method: 'GET',
                onload(res) {
                    if (res.status < 400) {
                        resolve(res.responseText);
                    } else {
                        console.log("error");
                        console.log(res.status);
                        // handle errors here
                    }
                },
                onerror(res) {
                    // handle errors here
                    console.log("Error:");
                    console.log(res.text);
                }
            });
        });
    }

    function GetFeaturesFromKMLString(strKML) {
        var format = new OpenLayers.Format.KML({
            'internalProjection': W.map.getProjectionObject(),
            'externalProjection': new OpenLayers.Projection("EPSG:4326"),
            'extractStyles': true
        });
        return format.read(strKML);
    }

    async function init(){
        loadSettings();

        var layerid = 'wme_mapraid_overlays';

        _layer = new OpenLayers.Layer.Vector("Mapraid Overlays", {
            rendererOptions: { zIndexing: true },
            uniqueName: layerid,
            layerGroup: 'mapraid_overlays',
            zIndex: -9999,
            visibility: _settings.layerVisible
        });
        I18n.translations[I18n.locale].layers.name[layerid] = "Mapraid Overlays";
        W.map.addLayer(_layer);

        var $section = $("<div>", {style:"padding:8px 16px", id:"WMEMapraidOverlays"});
        $section.html([
            `<h4 style="margin-bottom:0px;"><b>WME Mapraid Overlays</b></h4>`,
            `<h6 style="margin-top:0px;">${GM_info.script.version}</h6>`,
            `<div><input type="checkbox" id="_cbMROHideCurrentArea" class="wmemroSettingsCheckbox" /><label for="_cbMROHideCurrentArea">Hide fill for current area</label></div>`,
            `<div id="divWMEMROAvailableOverlays"><label>Available overlays</label> <select id="mroOverlaySelect" style="min-width:125px;"></select><i class="fa fa-plus fa-lg" id="mroAddOverlay" aria-hidden="true" style="color:green; cursor:pointer;"></i></div>`,
            '<div id="currOverlays"></div>',
            '<div style="position:absolute; bottom:0;">Generate new mapraid overlays at <a href="http://wazedev.com/mapraidgenerator.html" target="_blank">http://wazedev.com/mapraidgenerator.html</a></div>',
            '</div>'
        ].join(' '));

        WazeWrap.Interface.Tab('MRO', $section.html(), init2, 'MRO');
    }

    async function getAvailableOverlays(){
        $('#mroOverlaySelect').innerHTML = "";
        countryAbbr = W.model.getTopCountry().attributes.abbr;
        let KMLinfoArr = $.parseJSON(await wrapGMXMLHTTP(`https://api.github.com/repos/WazeDev/WME-Mapraid-Overlays/contents/KMLs/${countryAbbr}`));
        let overlaysSelect = $('<div>');

        overlaysSelect.html([
            '<option selected disabled hidden style="display: none" value=""></option>',
            `${KMLinfoArr.map(function(obj){
                let fileName = obj.name.replace(".kml", "");
                if(!_settings.EnabledOverlays[fileName])
                    return `<option value="${fileName}">${fileName}</option>`;
            })}`,
            '</select>'
        ].join(''));
        $('#mroOverlaySelect')[0].innerHTML = overlaysSelect.html();
    }

    function updatePolygons(newKML, mapraidName){
        var _features = GetFeaturesFromKMLString(newKML);

        for(let i=0; i< _features.length; i++){
            _features[i].attributes.name = _features[i].attributes.name.replace('<at><openparen>', '').replace('<closeparen>','');
            _features[i].style.label = _features[i].attributes.name;
            _features[i].style.labelOutlineColor= '#000000';
            _features[i].style.labelOutlineWidth= 4;
            _features[i].style.labelAlign= 'cm';
            _features[i].style.fontSize= "16px";
            _features[i].style.fontColor= _features[i].style.fillColor;//"#ffffff";
            _features[i].attributes.mapraidName = mapraidName;

            if(!_settings.EnabledOverlays[mapraidName].fillAreas){
                if(!_origOpacity)
                    _origOpacity = _features[i].style.fillOpacity;
                _features[i].style.fillOpacity = 0;
            }
        }

        _layer.addFeatures(_features);
    }

    function hex_is_light(color) {
        const hex = color.replace('#', '');
        const c_r = parseInt(hex.substr(0, 2), 16);
        const c_g = parseInt(hex.substr(2, 2), 16);
        const c_b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
        return brightness > 70;
    }

    async function BuildEnabledOverlays(mapraidName){
        let kml;
        try{
            kml = await getKML(encodeURI(`https://raw.githubusercontent.com/WazeDev/WME-Mapraid-Overlays/master/KMLs/${countryAbbr}/${mapraidName}.kml`));
        }
        catch(err){
            return;
            console.error(err);
        }
        let kmlObj = $($.parseXML(kml));
        let RaidAreas = $(kmlObj).find('Placemark');

        let $newRaidSection = $('<div>');
        $newRaidSection.html([
            `<fieldset style="border:1px solid silver; padding:8px; border-radius:4px; position:relative;"><legend style="margin-bottom:0px; borer-bottom-style:none; width:auto;"><h4>${mapraidName}</h4></legend>`,
            `<i class="fa fa-minus fa-lg" id="mroRemoveOverlay${mapraidName.replace(/\s/g, "_")}" aria-hidden="true" style="color:red; position:absolute; cursor:pointer; top:10px; right:5px;"></i>`,
            `<div><input type="checkbox" id="_cbMROFillRaidArea${mapraidName.replace(/\s/g, "_")}" ${_settings.EnabledOverlays[mapraidName].fillAreas ? 'checked' : ''} /><label for="_cbMROFillRaidArea${mapraidName.replace(/\s/g, "_")}">Fill raid area</label></div>`,
            `Jump to <select id="${mapraidName.replace(/\s/g, "_")}_Areas">${
            function(){
                let names = $(RaidAreas).find('name');
                let options = "";
                for(let i=0; i<names.length; i++)
                    options += `<option>${$(names[i]).text()}</option>`;
                return options;
            }()
            }</select>`,
            `<i class="fa fa-share" aria-hidden="true" style="color:green; cursor:pointer;" id="JumpTo${mapraidName.replace(/\s/g, "_")}"></i>`,
            '</fieldset>'
        ].join(''));

        $(`#mroOverlaySelect option[value="${mapraidName}"]`).remove(); //remove this option from the list
        $('#currOverlays').append($newRaidSection.html()); //add the mapraid section

        $('[id^="_cbMROFillRaidArea"]').change(function(){
            let mapraid = this.id.replace("_cbMROFillRaidArea", "");
            _settings.EnabledOverlays[_mapraidNameMap[mapraid]].fillAreas = isChecked(this.id);
            saveSettings();
        });

        $('[id^="mroRemoveOverlay"]').click(function(){
            let mapraid = this.id.replace("mroRemoveOverlay", "");
            $(this).parent().remove();

            delete _settings.EnabledOverlays[_mapraidNameMap[mapraid]];
            saveSettings();

            let deleteFeatures = [];
            for(let i=0; i < _layer.features.length; i++){ //delete the features from the layer
                if(_layer.features[i].attributes.mapraidName === _mapraidNameMap[mapraid])
                    deleteFeatures.push(_layer.features[i]);
            }
            _layer.removeFeatures(deleteFeatures);
            getAvailableOverlays();
        });

        $('[id^=_cbMROFillRaidArea]').change(function(){
            let mapraid = this.id.replace("_cbMROFillRaidArea", "");
            for(let i=0; i<_layer.features.length; i++){
                if(_layer.features[i].attributes.mapraidName.replace(/\s/g, "_") === mapraid){
                    if(!_origOpacity)
                        _origOpacity = _layer.features[i].style.fillOpacity;
                    _layer.features[i].style.fillOpacity = isChecked(this.id) ? _origOpacity : 0;
                    _layer.redraw();
                }
            }
        });

        $('[id^="JumpTo"]').click(function(){
            //jump to the appropriate area - look up the area in the layer features and jump to the centroid.
            let raidArea = this.id.replace("JumpTo", "");
            for(let i=0; i<_layer.features.length; i++){
                if(_layer.features[i].attributes.mapraidName.replace(/\s/g, "_") === raidArea){
                    let selectedArea = $(`#${raidArea.replace(/\s/g, "_")}_Areas`).val();
                    if(_layer.features[i].attributes.name === selectedArea){
                        let centroid = _layer.features[i].geometry.getCentroid();
                        W.map.setCenter(new OL.LonLat(centroid.x, centroid.y), W.map.zoom)
                        break;
                    }
                }
            }

        });

        updatePolygons(kml, mapraidName);
    }

    function HandleMoveZoom(){
        //display the current MR area in the title bar
        //hide the current MR area fill (if setting is enabled)

        if($('#mrodivCurrMapraidArea').length === 0){
            var $section = $("<div>");
            $section.html([
                '<div id="mrodivCurrMapraidArea" style="font-size: 16px; font-weight:bold; margin-left:10px; float:left;">',
                '<span id="mroCurrAreaTopbar"></span>',
                '</div>'
            ].join(' '));

            $('.topbar').append($section.html());
        }

        let center = new OpenLayers.Geometry.Point(W.map.getCenter().lon,W.map.getCenter().lat);
        $('#mroCurrAreaTopbar').text("");
        for (var i=0;i<_layer.features.length;i++){
            var feature = _layer.features[i];
            if(_origOpacity && _settings.EnabledOverlays[feature.attributes.mapraidName].fillAreas)
                feature.style.fillOpacity = _origOpacity;
            if(feature.geometry.intersects(center)){
                $('#mroCurrAreaTopbar').text(feature.attributes.name);
                $('#mroCurrAreaTopbar').css('color', feature.style.fillColor);

                if(!hex_is_light(feature.style.fillColor))
                    $('#mroCurrAreaTopbar').css('text-shadow', '-1px 0 #efefef, 0 1px #efefef, 1px 0 #efefef, 0 -1px #efefef');
                else
                    $('#mroCurrAreaTopbar').css('text-shadow', '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black');


                if(_settings.HideCurrentArea){
                    if(!_origOpacity)
                        _origOpacity = feature.style.fillOpacity;
                    if(feature.style.fillOpacity > 0)
                        feature.style.fillOpacity = 0;
                }
            }
        }
        _layer.redraw();
    }

    function init2(){
        getAvailableOverlays();

        $.each(_settings.EnabledOverlays, function(k, v){
            if(!_mapraidNameMap[k.replace(/\s/g, "_")])
                _mapraidNameMap[k.replace(/\s/g, "_")] = k;
            BuildEnabledOverlays(k);

        });

        $('#mroAddOverlay').click(async function(){
            if($('#mroOverlaySelect').val() !== null){
                let raid = $('#mroOverlaySelect').val();
                _settings.EnabledOverlays[raid] = {fillAreas: true};

                BuildEnabledOverlays(raid);
                if(!_mapraidNameMap[raid.replace(/\s/g, "_")])
                    _mapraidNameMap[raid.replace(/\s/g, "_")] = raid;

                saveSettings();
            }
        });

        $('.wmemroSettingsCheckbox').change(function(){
            var settingName = $(this)[0].id.substr(6);
            _settings[settingName] = this.checked;
            saveSettings();
        });

        $('#_cbMROHideCurrentArea').change(function(){
            HandleMoveZoom();
        });

        WazeWrap.Events.register("zoomend", null, HandleMoveZoom);
        WazeWrap.Events.register("moveend", null, HandleMoveZoom);

        setChecked('_cbMROHideCurrentArea', _settings.HideCurrentArea);
        HandleMoveZoom();
    }

})();
