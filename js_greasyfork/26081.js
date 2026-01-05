// ==UserScript==
// @name         WME SL Layer (beta)
// @namespace    https://greasyfork.org/users/45389
// @version      0.3
// @description  Adds a speed limit layer for states that publish ArcGIS SL data.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @license      GPLv3
// @require      https://cdn.jsdelivr.net/bluebird/latest/bluebird.min.js
// @grant        GM_xmlhttpRequest
// @connect      idaho.gov
// @connect      ky.gov
// @connect      virginia.gov
// @downloadURL https://update.greasyfork.org/scripts/26081/WME%20SL%20Layer%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26081/WME%20SL%20Layer%20%28beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _settingsStoreName = 'wme_sl_layer';
    var _alertUpdate = false;
    var _debugLevel = 3;
    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------\n'
    ].join('');
    var _mapLayer = null;
    var _isAM = false;
    var _uid;
    var _styles = {};
    var _settings = {};
    var _r;
    var _mapLayerZIndex = 334;
    var _columnSortOrder = [];
    var _statesHash = {
        'Alabama':'AL','Alaska':'AK','American Samoa':'AS','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','District of Columbia':'DC',
        'Federated States Of Micronesia':'FM','Florida':'FL','Georgia':'GA','Guam':'GU','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
        'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Marshall Islands':'MH','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
        'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',
        'Northern Mariana Islands':'MP','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Palau':'PW','Pennsylvania':'PA','Puerto Rico':'PR','Rhode Island':'RI','South Carolina':'SC',
        'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virgin Islands':'VI','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
    };

    function reverseStatesHash(stateAbbr) {
        for (var stateName in _statesHash) {
            if (_statesHash[stateName] == stateAbbr) return stateName;
        }
    }
    var _stateSettings = {
        global: {
            isPermitted: function(stateAbbr) {var state=_stateSettings[stateAbbr];if(state.isPermitted){return state.isPermitted();}else{return(_r>=2&&_isAM)||(_r>=3);}},
            getMapLayer: function(stateAbbr, layerID) {
                var returnValue;
                _stateSettings[stateAbbr].slMapLayers.forEach(function(layer) {
                    if (layer.layerID === layerID) {
                        returnValue = layer;
                    }
                });
                return returnValue;
            }
        },
        ID: {
            baseUrl: 'https://gis.itd.idaho.gov/arcgisprod/rest/services/ArcGISOnline/IdahoTransportationLayers/MapServer/',
            supportsPagination: false,
            defaultColors: {20:'#002474',
                            25:'#1f66ae',
                            30:'#4593c3',
                            35:'#91c5df',
                            40:'#d3ffbe',
                            45:'#ffff00',
                            50:'#ffd37f',
                            55:'#e69900',
                            60:'#a86f00',
                            65:'#b31227',
                            70:'#870053',
                            75:'#6900b0',
                            80:'#00744d'},
            zoomSettings: { maxOffset: [30,15,8,4,2,1,1,1,1,1]},
            fetchAllSL: true,
            slMapLayers: [
                { layerID:68, slPropName:'SpeedLimit', idPropName:'OBJECTID', outFields:['OBJECTID', 'SpeedLimit', 'ZoneDirection'], maxRecordCount:1000, supportsPagination:false },
            ],
            getFeatureSL: function(feature, layer) {
                return feature.attributes[layer.slPropName];
            },
            getWhereClause: function(context) {
                // Zone type of 'PZ' is the permanent speed zone limit.  'PT' is truck speed limits and should be ignored for now.
                return "ZoneType = 'PZ'";
            }
        },
        KY: {
            baseUrl: 'https://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/',
            supportsPagination: false,
            defaultColors: {
                10:'#ffff00',
                15:'#ffffff',
                20:'#002474',
                25:'#1f66ae',
                30:'#4593c3',
                35:'#91c5df',
                40:'#d3ffbe',
                45:'#ffff00',
                50:'#ffd37f',
                55:'#e69900',
                60:'#a86f00',
                65:'#b31227',
                70:'#870053',
                75:'#6900b0',
                80:'#00744d'
            },
            zoomSettings: { maxOffset: [30,15,8,4,2,1,1,1,1,1]},
            fetchAllSL: true,
            slMapLayers: [
                { layerID:6, slPropName:'SPEEDLIM', idPropName:'OBJECTID', outFields:['OBJECTID', 'SPEEDLIM'], maxRecordCount:1000, supportsPagination:false },
            ],
            getFeatureSL: function(feature, layer) {
                return feature.attributes[layer.slPropName];
            },
            getWhereClause: function(context) {
                return null;
            }
        },
        VA: {
            baseUrl: 'http://gis.vdot.virginia.gov/arcgis/rest/services/varoads/SpeedZones/MapServer/',
            supportsPagination: false,
            defaultColors: {
                10:'#ffff00',
                15:'#ffffff',
                20:'#002474',
                25:'#1f66ae',
                30:'#4593c3',
                35:'#91c5df',
                40:'#d3ffbe',
                45:'#ffff00',
                50:'#ffd37f',
                55:'#e69900',
                60:'#a86f00',
                65:'#b31227',
                70:'#870053',
                75:'#6900b0',
                80:'#00744d'
            },
            zoomSettings: { maxOffset: [30,15,8,4,2,1,1,1,1,1]},
            fetchAllSL: true,
            slMapLayers: [
                { layerID:0, slPropName:'CAR_SPEED_LIMIT', idPropName:'OBJECTID', outFields:['OBJECTID', 'CAR_SPEED_LIMIT'], maxRecordCount:1000, supportsPagination:false },
                { layerID:1, slPropName:'CAR_SPEED_LIMIT', idPropName:'OBJECTID', outFields:['OBJECTID', 'CAR_SPEED_LIMIT'], maxRecordCount:1000, supportsPagination:false },
                { layerID:2, slPropName:'CAR_SPEED_LIMIT', idPropName:'OBJECTID', outFields:['OBJECTID', 'CAR_SPEED_LIMIT'], maxRecordCount:1000, supportsPagination:false },
            ],
            getFeatureSL: function(feature, layer) {
                return feature.attributes[layer.slPropName];
            },
            getWhereClause: function(context) {
                return null;
            }
        }
    };

    function log(message, level) {
        if (message && (!level || (level <= _debugLevel))) {
            console.log('SL Layer: ', message);
        }
    }

    function loadSettingsFromStorage() {
        var loadedSettings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        var defaultSettings = {
            lastVersion:null,
            layerVisible:true,
            activeStateAbbr:'ALL',
            hideStreet:false
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

    function getLineWidth() {
        return 12 * Math.pow(1.15, (Waze.map.getZoom()-1));
    }

    function sortArray(array) {
        array.sort(function(a, b){if (a < b)return -1;if (a > b)return 1;else return 0;});
    }

    function getVisibleStateAbbrs() {
        var visibleStates = [];
        Waze.model.states.additionalInfo.forEach(function(state) {
            var stateAbbr = _statesHash[state.name];
            var activeStateAbbr = _settings.activeStateAbbr;
            if(_stateSettings[stateAbbr] && _stateSettings.global.isPermitted(stateAbbr) && (!activeStateAbbr || activeStateAbbr === 'ALL' || activeStateAbbr === stateAbbr)) {
                visibleStates.push(stateAbbr);
            }
        });
        return visibleStates;
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
    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }
    function getUrl(context, queryType, queryParams) {
        var extent = context.mapContext.extent,
            zoom = context.mapContext.zoom,
            layer = context.layer,
            state = context.state;

        var whereParts = [];
        var geometry = { xmin:extent.left, ymin:extent.bottom, xmax:extent.right, ymax:extent.top, spatialReference: {wkid: 102100, latestWkid: 3857} };
        var geometryStr = JSON.stringify(geometry);
        var stateWhereClause = state.getWhereClause(context);
        var url = state.baseUrl + layer.layerID + '/query?geometry=' + encodeURIComponent(geometryStr);

        if (queryType === 'countOnly') {
            url += '&returnCountOnly=true';
        } else if (queryType === 'idsOnly') {
            url += '&returnIdsOnly=true';
        } else if (queryType === 'paged') {
            // TODO
        } else {
            url += '&returnGeometry=true&maxAllowableOffset=' + state.zoomSettings.maxOffset[zoom];
            url += '&outFields=' + encodeURIComponent(layer.outFields.join(','));
            if (queryType === 'idRange') {
                var idPropName = context.layer.idPropName;
                whereParts.push('(' + queryParams.idFieldName + '>=' + queryParams.range[0] + ' AND ' + queryParams.idFieldName + '<=' + queryParams.range[1] + ')');
            }
        }
        if (stateWhereClause) whereParts.push(stateWhereClause);
        if (whereParts.length > 0 ) url += '&where=' + encodeURIComponent(whereParts.join(' AND '));
        url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        //wait(500);
        return url;
    }

    function convertSlToVectors(feature, state, stateAbbr, layer, zoom) {
        var sl = state.getFeatureSL(feature, layer);
        log(feature,3);
        var zIndex = 0; //_stateSettings.global.roadTypes.indexOf(roadType) * 100;
        var vectors = [];
        var lineFeatures = [];
        var attr = {
            state: stateAbbr,
            layerID: layer.layerID,
            sl: sl,
            dotAttributes: $.extend({}, feature.attributes),
            color: state.defaultColors[sl],
            strokeWidth: getLineWidth,
            zIndex: zIndex
        };

        feature.geometry.paths.forEach(function(path){
            var pointList = [];
            var newPoint = null;
            var lastPoint = null;
            path.forEach(function(point){
                pointList.push(new OpenLayers.Geometry.Point(point[0],point[1]));
            });
            var vectorFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList),attr);
            vectors.push(vectorFeature);
        });

        return vectors;
    }

    function fetchLayerSL(context) {
        var url = getUrl(context, 'idsOnly');
        log(url,2);
        if (!context.parentContext.cancel) {
            return getAsync(url, context).bind(context).then(function(res) {
                var ids = $.parseJSON(res.responseText);
                if(!ids.objectIds) ids.objectIds = [];
                sortArray(ids.objectIds);
                log(context.layer.layerID);
                log(ids,2);
                return ids;
            }).then(function(res) {
                var context = this;
                var idRanges = [];
                if (res.objectIds) {
                    var len = res.objectIds ? res.objectIds.length : 0;
                    var currentIndex = 0;
                    var offset = Math.min(this.layer.maxRecordCount,1000);
                    while (currentIndex < len) {
                        var nextIndex = currentIndex + offset;
                        if (nextIndex >= len) nextIndex = len - 1;
                        idRanges.push({range:[res.objectIds[currentIndex], res.objectIds[nextIndex]], idFieldName:res.objectIdFieldName});
                        currentIndex = nextIndex + 1;
                    }
                    log(context.layer.layerID, 2);
                    log(idRanges,2);
                }
                return idRanges;
            }).map(function(idRange) {
                var context = this;
                if(!context.parentContext.cancel) {
                    var url = getUrl(this, 'idRange', idRange);
                    log(url,2);
                    return getAsync(url, context).then(function(res) {
                        var context = res.context;
                        if(!context.parentContext.cancel) {
                            var features = $.parseJSON(res.responseText).features;
                            // if (context.parentContext.callCount === 0 ) {
                            //     _mapLayer.removeAllFeatures();
                            // }
                            context.parentContext.callCount++;
                            log('Feature Count=' + (features ? features.length : 0),2);
                            features = features ? features : [];
                            var vectors = [];
                            features.forEach(function(feature) {
                                if(!res.context.parentContext.cancel) {
                                    var vector = convertSlToVectors(feature, context.state, context.stateAbbr, context.layer, context.mapContext.zoom);
                                    //if (!(vector[0].attributes.roadType === 'St' && _settings.hideStreet)) {
                                    vectors.push(vector);
                                    //}
                                }
                            });
                            return vectors;
                        }
                    });
                } else {
                    log('Async call cancelled',1);
                }
            });
        }
    }

    function fetchStateSL(context) {
        var state = _stateSettings[context.stateAbbr];
        var contexts = [];
        state.slMapLayers.forEach(function(layer) {
            contexts.push({parentContext:context.parentContext, layer:layer, state:state, stateAbbr:context.stateAbbr, mapContext:context.mapContext});
        });
        return Promise.map(contexts, function(context) {
            return fetchLayerSL(context);
        });
    }

    var _lastPromise = null;
    var _lastContext = null;
    var _slCallCount = 0;
    function fetchAllSL() {
        if (_lastPromise) { _lastPromise.cancel(); }
        $('#sl-loading-indicator').text('Loading SL...');

        var mapContext = { zoom:Waze.map.getZoom(), extent:Waze.map.getExtent() };
        var contexts = [];
        var parentContext = {callCount:0, startTime:Date.now()};
        if (_lastContext) _lastContext.cancel = true;
        _lastContext = parentContext;
        getVisibleStateAbbrs().forEach(function(stateAbbr) {
            contexts.push({ parentContext:parentContext, stateAbbr:stateAbbr, mapContext:mapContext});
        });
        var map = Promise.map(contexts, function(context) {
            return fetchStateSL(context);
        }).bind(parentContext).then(function(statesVectorArrays) {
            if (!this.cancel) {
                _mapLayer.removeAllFeatures();
                statesVectorArrays.forEach(function(vectorsArray) {
                    vectorsArray.forEach(function(vectors) {
                        vectors.forEach(function(vector) {
                            vector.forEach(function(vectorFeature) {
                                _mapLayer.addFeatures(vectorFeature);
                            });
                        });
                    });
                });
                log('TOTAL RETRIEVAL TIME = ' + (Date.now() - parentContext.startTime),1);
                log(statesVectorArrays,1);
            }
            return statesVectorArrays;
        }).catch(function(e) {
            $('#sl-loading-indicator').text('SL Error! (check console for details)');
            log(e,0);
        }).finally(function() {
            _slCallCount -= 1;
            if (_slCallCount === 0) {
                $('#sl-loading-indicator').text('');
            }
        });

        _slCallCount += 1;
        _lastPromise = map;
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
        var defaultStyle = new OpenLayers.Style({
            strokeColor: '${color}', //'#00aaff',
            strokeDashstyle: "solid",
            strokeOpacity: 1.0,
            strokeWidth: '${strokeWidth}',
            graphicZIndex: '${zIndex}'
        });

        var selectStyle = new OpenLayers.Style({
            //strokeOpacity: 1.0,
            strokeColor: '#000000'
        });

        _mapLayer = new OpenLayers.Layer.Vector("SL Layer", {
            uniqueName: "__SLLayer",
            displayInLayerSwitcher: false,
            rendererOptions: { zIndexing: true },
            styleMap: new OpenLayers.StyleMap({
                'default': defaultStyle,
                'select': selectStyle
            })
        });

        _mapLayer.setOpacity(1);

        I18n.translations.en.layers.name.__SLLayer = "SL Layer";

        _mapLayer.displayInLayerSwitcher = true;
        _mapLayer.events.register('visibilitychanged',null,onLayerVisibilityChanged);
        _mapLayer.setVisibility(_settings.layerVisible);

        Waze.map.addLayer(_mapLayer);
        _mapLayer.setZIndex(_mapLayerZIndex);

        // Hack to fix layer zIndex.  Some other code is changing it sometimes but I have not been able to figure out why.
        // It may be that the SL layer is added to the map before some Waze code loads the base layers and forces other layers higher. (?)

        var checkLayerZIndex = function(layerZIndex) {
            if (_mapLayer.getZIndex() != _mapLayerZIndex)  {
                log("ADJUSTED SL LAYER Z-INDEX",1);
                _mapLayer.setZIndex(_mapLayerZIndex);
            }
        };

        setInterval(function(){checkLayerZIndex(_mapLayerZIndex);}, 200);

        Waze.map.events.register("moveend",Waze.map,function(e){
            fetchAllSL();
            return true;
        },true);
    }

    function initUserPanel() {
        var $tab = $('<li>').append($('<a>', {'data-toggle':'tab', href:'#sidepanel-sl-layer'}).text('SL'));
        var $panel = $('<div>', {class:'tab-pane', id:'sidepanel-sl-layer'});
        var $stateSelect = $('<select>', {id:'sll-state-select',class:'form-control disabled',style:'disabled'}).append($('<option>', {value:'ALL'}).text('All'));
        for (var stateAbbr in _stateSettings) {
            if (stateAbbr !== 'global') {
                $stateSelect.append($('<option>', {value:stateAbbr}).text(reverseStatesHash(stateAbbr)));
            }
        }

        var $hideStreet =  $('<div>',{id: 'sll-hide-street-container', class:'controls-container'})
        .append($('<input>', {type:'checkbox',name:'sll-hide-street',id:'sll-hide-street'}).prop('checked', _settings.hideStreet).click(function() {
            _settings.hideStreet = $(this).is(':checked');
            saveSettingsToStorage();
            _mapLayer.removeAllFeatures();
            fetchAllSL();
        }))
        .append($('<label>', {for:'sll-hide-street'}).text('Hide street highlights'));

        $stateSelect.val(_settings.activeStateAbbr ? _settings.activeStateAbbr : 'ALL');

        $panel.append(
            $('<div>', {class:'form-group'}).append(
                $('<label>', {class:'control-label'}).text('Select a state')
            ).append(
                $('<div>', {class:'controls', id:'sll-state-select-container'}).append(
                    $('<div>').append($stateSelect)
                )
            ),
            $hideStreet ,
            $('<div>', {id:'sll-table-container'})
        );

        $panel.append(
            $('<div>',{style:'margin-top:10px;font-size:10px;color:#999999;'})
            .append($('<div>').text('version ' + _scriptVersion))
            .append(
                $('<div>').append(
                    $('<a>',{href:'#' /*, target:'__blank'*/}).text('Discussion Forum (currently n/a)')
                )
            )
        );

        $('#user-tabs > .nav-tabs').append($tab);
        $('#user-info > .flex-parent > .tab-content').append($panel);
        $('#sll-state-select').change(function () {
            _settings.activeStateAbbr = this.value;
            saveSettingsToStorage();
            fetchAllSL();
        });
    }

    function addLoadingIndicator() {
        $('.loading-indicator').after($('<div class="loading-indicator" style="margin-right:10px" id="sl-loading-indicator">'));
    }

    function initGui() {
        addLoadingIndicator();
        initLayer();
        initUserPanel();
        showScriptInfoAlert();
    }

    function processText(text) {
        return new Promise(function(resolve, reject) {
            var newText = text.replace(/(e)/,'E');
            resolve(newText);
        });
    }

    function init() {
        if (_debugLevel > 0 && Promise.config) {
            Promise.config({
                warnings: true,
                longStackTraces: true,
                cancellation: true,
                monitoring: true
            });
        }

        var u = Waze.loginManager.user;
        _uid = u.id;
        _r = u.rank;
        _isAM = u.isAreaManager;
        loadSettingsFromStorage();
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        initGui();
        Waze.app.modeController.model.bind('change:mode', onModeChanged);
        Waze.prefs.on("change:isImperial", function() {initUserPanel();loadSettingsFromStorage();});
        fetchAllSL();
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