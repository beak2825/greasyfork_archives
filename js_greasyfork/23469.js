// ==UserScript==
// @name         WME WI Emergency Management Closures
// @namespace    https://greasyfork.org/users/45389
// @version      0.2
// @description  Adds a road closure layer for Wisconsin Emergency Management
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @connect      wi.us
// @connect      vernoncounty.org
// @downloadURL https://update.greasyfork.org/scripts/23469/WME%20WI%20Emergency%20Management%20Closures.user.js
// @updateURL https://update.greasyfork.org/scripts/23469/WME%20WI%20Emergency%20Management%20Closures.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _settingsStoreName = 'wme_wi_emergency_management_closures';
    var _alertUpdate = false;
    var _debugLevel = 3;
    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------\n',
        '\n- .',
    ].join('');
    var _tabDiv = {};  // stores the user tab div so it can be restored after switching back from Events mode to Default mode
    var _mapLayer = null;
    var _styles = {};
    var _settings = {};
    var _statesHash = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'American Samoa': 'AS',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'District Of Columbia': 'DC',
        'Federated States Of Micronesia': 'FM',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Guam': 'GU',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Marshall Islands': 'MH',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Northern Mariana Islands': 'MP',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Palau': 'PW',
        'Pennsylvania': 'PA',
        'Puerto Rico': 'PR',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virgin Islands': 'VI',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    };
    var _stateSettings = {
        WI: {
            baseUrl: '',
            mapLayers: [
                { layerID:'http://www.vernoncounty.org/arcgis/rest/services/VCGISEOC/VC_Closed_Rds_Service/MapServer/1', outFields:[''] },
                { layerID:'http://lrs.co.columbia.wi.us/arcgis/rest/services/WEM_Road_Closures/MapServer/0', outFields:[''] },
            ],
            colors: {closure:'#ff0000'}
        }
    };

    function log(message, level) {
        if (message && level <= _debugLevel) {
            console.log('WME WEM: ' + message);
        }
    }

    function loadSettingsFromStorage() {
        var settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        if(!settings) {
            settings = {
                lastVersion:null,
                layerVisible:true
            };
        } else {
            settings.layerVisible = (settings.layerVisible === true);
        }
        _settings = settings;
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                lastVersion: _scriptVersion,
                layerVisible: _mapLayer.visibility,
            };
            localStorage.setItem(_settingsStoreName, JSON.stringify(settings));
            log('Settings saved', 1);
        }
    }

    function getLineWidth() {
        return 8 * Math.pow(1.15, (W.map.getZoom()-1));
    }

    function draw(buckets) {
        _mapLayer.removeAllFeatures();
        for(var i=buckets.length-1; i>-1; i--) {
            _mapLayer.addFeatures(buckets[i]);
        }
    }

    function processFeatures(data,context) {
        var layer = context.layer;
        var stateSettings = context.stateSettings;
        var styles = {};
        for (var prefix in stateSettings.colors) {
            var color = stateSettings.colors[prefix];
            styles[prefix] = {
                strokeColor: color,
                strokeDashstyle: "solid",
                strokeOpacity: 0.6,
                strokeWidth: getLineWidth()
            };
        }

        data.features.forEach(function(feature) {
            var style = styles.closure;
            var lineFeatures = [];
            feature.geometry.paths.forEach(function(path){
                var pointList = [];
                var newPoint = null;
                path.forEach(function(point){
                    pointList.push(new OpenLayers.Geometry.Point(point[0],point[1]));
                });
                context.buckets[0].push( new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.LineString(pointList),null,style
                ));
            });
        });

        context.callCount.count -= 1;
        if (context.callCount.count === 0) {
            //console.log(context.buckets);
            draw(context.buckets);
        }
        if (data.exceededTransferLimit) {
            console.log('WMEDRL: Exceeded server\'s feature transfer limit.  Some features may not be drawn.');
        }
    }

    function fetchFeatures() {
        var visibleStates = [];
        
        W.model.states.additionalInfo.forEach(function(state) {
            visibleStates.push(_statesHash[state.name]);
        });

        var zoom = W.map.getZoom();
        var ext = W.map.getExtent();

        var geometry = {
            xmin: ext.left,
            ymin: ext.bottom,
            xmax: ext.right,
            ymax: ext.top
        };

        var geometryStr = JSON.stringify(geometry).replaceAll('{','%7B').replaceAll('}','%7D').replaceAll('"','%22').replaceAll(':','%3A').replaceAll(',','%2C');
        var callCount = 0;
        var buckets = [];
        var urls = [];
        var contexts = [];

        visibleStates.forEach(function(stateAbbr) {
            var state = _stateSettings[stateAbbr];
            if (state) {
                for(var i=0; i<7; i++) {buckets.push([]);}
                state.mapLayers.forEach(function(layer) {
                    if (!layer.zoomLevels || layer.zoomLevels.indexOf(zoom) !== -1) {
                        var context = {
                            stateSettings: state,
                            layer: layer,
                            buckets: buckets
                        };
                        var url = state.baseUrl + layer.layerID + '/query?';
                        url += 'geometry=' + geometryStr;
                        url += '&outFields=' + layer.outFields.join('%2C');
                        url += '&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
                        urls.push(url);
                        console.log(url);
                        contexts.push(context);
                        callCount += 1;

                    }
                });
            }
        });
        var countObj = {count: callCount};
        for (var j=0; j<urls.length; j++) {
            contexts[j].callCount = countObj;
            GM_xmlhttpRequest({
                context: contexts[j],
                method: "GET",
                url: urls[j],
                onload: function(res) {
                    processFeatures($.parseJSON(res.responseText), res.context);
                }
            });
        }
    }

    function onLayerVisibilityChanged(evt) {
        saveSettingsToStorage();
    }

    function restoreUserTab() {
        // $('#user-tabs > .nav-tabs').append(_tabDiv.tab);
        // $('#user-info > .flex-parent > .tab-content').append(_tabDiv.panel);
        // $('#fcl-state-select').change(function () {
        //     _settings.activeStateAbbr = this.value;
        //     saveSettingsToStorage();
        //     fetchFeatures();
        // });
    }

    function onModeChanged(model, modeId, context) {
        if(!modeId || modeId === 1) {
            restoreUserTab();
        }
    }

    function showScriptInfoAlert() {
        /* Check version and alert on update */
        if (_alertUpdate && _scriptVersion !== _settings.lastVersion) {
            alert(_scriptVersionChanges);
        }
    }

    function initLayer(){
        var mapLayerZIndex = 334;
        _mapLayer = new OpenLayers.Layer.Vector("WI Emergency Closures ", {
            uniqueName: "__DOTRoadsLayer",
            displayInLayerSwitcher: false
        });
        I18n.translations.en.layers.name.__FCLayer = "WI Emergency Closures";
        W.map.addLayer(_mapLayer);
        _mapLayer.setZIndex(mapLayerZIndex);

        _mapLayer.displayInLayerSwitcher = true;
        _mapLayer.events.register('visibilitychanged',null,onLayerVisibilityChanged);
        _mapLayer.setVisibility(_settings.layerVisible);
        // Hack to fix layer zIndex.  Some other code is changing it sometimes but I have not been able to figure out why.
        // It may be that the FC layer is added to the map before some Waze code loads the base layers and forces other layers higher.
        var checkLayerZIndex = function(layerZIndex) {
            if (_mapLayer.getZIndex() != mapLayerZIndex)  {
                //log("ADJUSTED LAYER Z-INDEX",1);
                _mapLayer.setZIndex(mapLayerZIndex);
            }
        };

        setInterval(function(){checkLayerZIndex(mapLayerZIndex);}, 200);

        W.map.events.register("moveend",W.map,function(e){
            fetchFeatures();
            return true;
        },true);

        // for(var i=0; i<_activeState.defaultColors.length; i++) {
        //     var color = _activeState.defaultColors[i];
        //     var fc = i + 1;
        //     _styles[fc] = {
        //         strokeColor: color,
        //         strokeDashstyle: "solid",
        //         strokeOpacity: 0.5,
        //         strokeWidth: getLineWidth()
        //     };
        // }
    }

    function initUserPanel() {
        //         _tabDiv.tab = $('<li>').append(
        //             $('<a>', {'data-toggle':'tab', href:'#sidepanel-fc-layer'}).text('FC Layer')
        //         );

        //         _tabDiv.panel = $('<div>', {class:'tab-pane', id:'sidepanel-fc-layer'});/*.append(
        //             $('<div>',  {class:'side-panel-section>'}).append(
        //                 $('<div>', {class:'form-group'}).append(
        //                     $('<label>', {class:'control-label'}).text('Select a state')
        //                 ).append(
        //                     $('<div>', {class:'controls', id:'fcl-state-select-container'}).append(
        //                         $('<div>').append(
        //                             $('<select>', {id:'fcl-state-select',class:'form-control disabled',style:'disabled'})
        //                             .append($('<option>', {value:'IN'}).text('Indiana'))
        //                             //.append($('<option>', {value:'KY'}).text('Kentucky'))
        //                             .append($('<option>', {value:'MD'}).text('Maryland'))
        //                             .append($('<option>', {value:'MI'}).text('Michigan'))
        //                             .append($('<option>', {value:'NC'}).text('North Carolina'))
        //                             .append($('<option>', {value:'VA'}).text('Virginia'))
        //                             .val(_settings.activeStateAbbr)
        //                             // ).append(
        //                             //     $('<div>',{class:'controls-container'})
        //                             //     .append($('<input>', {type:'checkbox',class:'csSettingsCheckBox',name:'csDirectionButtonsCheckBox',id:'csDirectionButtonsCheckBox'}))
        //                             //     .append($('<label>', {for:'csDirectionButtonsCheckBox'}).text('Add road direction buttons'))
        //                             // ).append(
        //                             //     $('<input class="jscolor" value="ab2567">').change(function(evt) {console.log(evt);})
        //                         )
        //                     )
        //                 )
        //             )
        //         );*/

        //         restoreUserTab();
    }

    function initGui() {
        initLayer();
        initUserPanel();
        showScriptInfoAlert();
    }

    function init() {
        loadSettingsFromStorage();
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        //_activeState = _stateSettings[_settings.activeStateAbbr];
        initGui();
        unsafeWindow.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        Waze.app.modeController.model.bind('change:mode', onModeChanged);
        fetchFeatures();
        log('Initialized.', 0);
    }

    function bootstrap() {
        if (W && W.loginManager &&
            W.loginManager.events.register &&
            W.map && W.loginManager.isLoggedIn()) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();