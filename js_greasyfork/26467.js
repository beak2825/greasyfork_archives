// ==UserScript==
// @name         WME Overlay GA Fulton Co Parcels
// @namespace    https://greasyfork.org/users/
// @version      0.3.3.001
// @description  Adds a layer to display US (federal, state, and/or local) boundaries.
// @author       MapOMatic
// @include      https://beta.waze.com/*editor/*
// @include      https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/editor/*
// @grant        GM_xmlhttpRequest
// @connect      census.gov
// @connect      fultoncountyga.gov

// @downloadURL https://update.greasyfork.org/scripts/26467/WME%20Overlay%20GA%20Fulton%20Co%20Parcels.user.js
// @updateURL https://update.greasyfork.org/scripts/26467/WME%20Overlay%20GA%20Fulton%20Co%20Parcels.meta.js
// ==/UserScript==

/* global $ */
/* global OpenLayers */
/* global GM_info */
/* global W */
/* global GM_xmlhttpRequest */
/* global unsafeWindow */
/* global Waze */
/* global Components */
/* global I18n */

(function() {
    'use strict';

    var _settingsStoreName = 'wme_GA_Fulton_co_Parcels';
    var _alertUpdate = false;
    var _debugLevel = 0;
    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------\n',
        '\n- Everything.'
    ].join('');
    var _mapLayer = null;
    var _settings = {};

    function reverseStatesHash(stateAbbr) {
        for (var stateName in _statesHash) {
            if (_statesHash[stateName] == stateAbbr) return stateName;
        }
    }

    function log(message, level) {
        if (message && (!level || (level <= _debugLevel))) {
            console.log('GA Fulton Co Parcels: ', message);
        }
    }

    function loadSettingsFromStorage() {
        var loadedSettings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        var defaultSettings = {
            lastVersion:null,
            layerVisible:true
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!_settings.hasOwnProperty(prop)) {
                _settings[prop] = defaultSettings[prop];
            }
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            _settings.lastVersion = _scriptVersion;
            localStorage.setItem(_settingsStoreName, JSON.stringify(_settings));
            log('Settings saved', 1);
        }
    }

    function getAsync(url, context) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                context:context, method:"GET", url:url,
                onload:function(res) {
                    if (res.status == 200) {
                        resolve({responseText: res.responseText, context:context});
                    } else {
                        reject({responseText: res.responseText, context:context});
                    }
                },
                onerror: function() {
                    reject(Error("Network Error"));
                }
            });
        });
    }

    function getUrl(extent, zoom) {
        var whereParts = [];
        var geometry = { xmin:extent.left, ymin:extent.bottom, xmax:extent.right, ymax:extent.top, spatialReference: {wkid: 102100, latestWkid: 3857} };
        var geometryStr = JSON.stringify(geometry);
        var offsets = [40,20,10,4,2,1,0.5,0.25,0.125,0.0625,0.03125];
        var url = 'https://gis.fultoncountyga.gov/arcgis/rest/services/MapServices/PropertyMapViewer/MapServer/10/query?geometry=' + encodeURIComponent(geometryStr);  //must be https:// //
        url += '&returnGeometry=True';
        //var url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/4/query?geometry=' + encodeURIComponent(geometryStr);
        url += '&maxAllowableOffset=' + offsets[zoom];
        url += '&outFields=' + encodeURIComponent('Address');
      //url += '&outFields=' + encodeURIComponent('ZCTA5');
        //url += '&quantizationParameters={tolerance:100}';
        url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
      //url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        return url;
    }


    function processStateBorders(states) {
        _mapLayer.removeAllFeatures();
        states.forEach(function(state) {
            var attributes = {
                name: state.attributes.Address
            };

            var rings = [];
            state.geometry.rings.forEach(function(ringIn) {
                var pnts= [];
                for(var i=0;i<ringIn.length;i++){
                    pnts.push(new OpenLayers.Geometry.Point(ringIn[i][0], ringIn[i][1]));
                }
                rings.push(new OpenLayers.Geometry.LinearRing(pnts));
            });
            var polygon = new OpenLayers.Geometry.Polygon(rings);
            var feature = new OpenLayers.Feature.Vector(polygon,attributes);
            console.log(feature);
            _mapLayer.addFeatures([feature]);
        });
        updateNameDisplay();
    }

    function fetchStateBorders(context) {
        var url = getUrl(Waze.map.getExtent(), Waze.map.getZoom());
       $.ajax({
            url: url,
            method: 'GET',
            datatype: 'json',
            success: function(data) {processStateBorders($.parseJSON(data).features); }
        });
    }

    function onLayerVisibilityChanged(evt) {
        _settings.layerVisible = _mapLayer.visibility;
        saveSettingsToStorage();
    }

    function onModeChanged(model, modeId, context) {
        if(!modeId || modeId === 1) {
            initUserPanel();
        }
    }

    function showScriptInfoAlert() {
        /* Check version and alert on update */
        if (_alertUpdate && _scriptVersion !== _settings.lastVersion) {
            alert(_scriptVersionChanges);
        }
    }

    function initLayer(){
        var _drawingContext = {
            getZIndex: function(feature) {
                return feature.attributes.zIndex;
            },
            getStrokeWidth: function() { return getLineWidth(); }
        };

        var defaultStyle = {
            strokeColor: '#ff0000',
            strokeOpacity: 1,
            strokeWidth: 3,
            strokeDashstyle: 'solid',
            fillOpacity: 0,
            label : "${name}",
            fontSize: "20px",
            fontFamily: "Times New Roman",
            fontWeight: "bold",
            fontColor: "white",
            //labelAlign: "${align}",
            //labelXOffset: "${xOffset}",
            //labelYOffset: "${yOffset}",
            labelOutlineColor: "black",
            labelOutlineWidth:10
        };
        _mapLayer = new OpenLayers.Layer.Vector("Overlay - GA Fulton Co Parcels", {
            uniqueName: "__WMEGAfultoncoparcels",
            displayInLayerSwitcher: true,
            styleMap: new OpenLayers.StyleMap({
                default: defaultStyle,
            })
        });

        _mapLayer.setOpacity(0.8);

        I18n.translations.en.layers.name.__FCLayer = "GA Fulton Co Parcels";

        _mapLayer.setOpacity(0.6);
        _mapLayer.displayInLayerSwitcher = true;
        _mapLayer.events.register('visibilitychanged',null,onLayerVisibilityChanged);
        _mapLayer.setVisibility(_settings.layerVisible);

        Waze.map.addLayer(_mapLayer);

        Waze.map.events.register("moveend",Waze.map,function(e){
            fetchStateBorders();
            return true;
        },true);
    }

    function initGui() {
        initLayer();
        showScriptInfoAlert();
    }

    function init() {
        loadSettingsFromStorage();
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        initGui();
        fetchStateBorders();
        log('Initialized.', 0);
    }

    function bootstrap() {
        if (Waze && Waze.loginManager &&
            Waze.loginManager.events &&
            Waze.loginManager.events.register &&
            Waze.model && Waze.model.states && Waze.model.states.additionalInfo &&
            Waze.map && Waze.loginManager.isLoggedIn()) {
            log('Initializing...', 0);

            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            unsafeWindow.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();