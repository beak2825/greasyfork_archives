// ==UserScript==
// @name         WME Missing External Provider Highlighter
// @namespace    https://greasyfork.org/users/45389
// @version      0.2
// @description  Adds an orange highlight to places that don't have an external provider linked to them.
// @author       mapomatic
// @include      https://editor-beta.waze.com/*editor/*
// @include      https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26045/WME%20Missing%20External%20Provider%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/26045/WME%20Missing%20External%20Provider%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _alertUpdate = false;
    var _debugLevel = 0;
    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------',
    ].join('');

    var _mapLayer = null;

    function log(message, level) {
        if (message && (!level || (level <= _debugLevel))) {
            console.log('MEPH: ', message);
        }
    }

    function processPlaces() {
        //debugger;
        _mapLayer.removeAllFeatures();
        var features = [];
        W.model.venues.getObjectArray().forEach(function(venue) {
            if (venue.attributes.externalProviderIDs.length === 0 && !venue.isResidential() && venue.attributes.categories.indexOf('PARKING_LOT') === -1) {
                var feature;
                if (venue.isPoint()) {
                    var pt = venue.geometry.getCentroid();
                    feature = new OpenLayers.Feature.Vector(pt, {strokeWidth: '4'} );
                } else {
                    feature = new OpenLayers.Feature.Vector(venue.geometry.clone(), {strokeWidth: '12'});
                }
                features.push(feature);
            }
        });
        _mapLayer.addFeatures(features);
        log('Places processed.');
    }

    function initLayer(){
        var defaultStyle = {
            strokeColor: '#ffff00',
            strokeWidth: '${strokeWidth}',
            strokeDashstyle: 'solid',
            fillColor: '#ffff00',
            pointRadius: '15',
            fillOpacity: '0'
        };
        _mapLayer = new OpenLayers.Layer.Vector("Missing Ext. Prov.", {
            uniqueName: "___missingGLinks",
            displayInLayerSwitcher: true,
            styleMap: new OpenLayers.StyleMap({
                default: defaultStyle,
            })
        });

        _mapLayer.setOpacity(0.6);

        I18n.translations[I18n.locale].layers.name.__missingGLinks = "Missing Ext. Prov.";

        _mapLayer.displayInLayerSwitcher = true;
        //_mapLayer.events.register('visibilitychanged',null,onLayerVisibilityChanged);

        Waze.map.addLayer(_mapLayer);

        Waze.model.events.register("mergeend",null,function(e){
            processPlaces();
            return true;
        },true);
        Waze.map.events.register("moveend",Waze.map,function(e){
            processPlaces();
            return true;
        },true);
        W.accelerators.events.registerPriority('save',null,function(e){
            console.log('saved');
            processPlaces();
            return true;
        },true);
    }

    function initGui() {
        initLayer();
    }

    function init() {
        initGui();
        processPlaces();
        log('Initialized.', 0);
    }

    function bootstrap() {
        if (Waze && Waze.loginManager &&
            Waze.loginManager.events &&
            Waze.loginManager.events.register &&
            Waze.model && Waze.model.venues &&
            Waze.map && Waze.loginManager.isLoggedIn()) {
            log('Initializing...', 1);

            init();
        } else {
            log('Bootstrap failed. Trying again...', 1);
            setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();