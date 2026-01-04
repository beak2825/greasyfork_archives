// ==UserScript==
// @name            WME US Government Boundaries Timezone
// @namespace       https://greasyfork.org/users/45389
// @version         2018.08.18.001
// @description     Adds a layer to display US (federal, state, and/or local) boundaries.
// @author          MapOMatic
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require         https://cdnjs.cloudflare.com/ajax/libs/Turf.js/4.7.3/turf.min.js
// @grant           GM_xmlhttpRequest
// @license         GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @connect         census.gov
// @connect         wazex.us
// @connect         arcgis.com
// @downloadURL https://update.greasyfork.org/scripts/373121/WME%20US%20Government%20Boundaries%20Timezone.user.js
// @updateURL https://update.greasyfork.org/scripts/373121/WME%20US%20Government%20Boundaries%20Timezone.meta.js
// ==/UserScript==

/* global $ */
/* global OL */
/* global GM_info */
/* global W */
/* global GM_xmlhttpRequest */
/* global unsafeWindow */
/* global Components */
/* global I18n */
/* global turf */

(function() {
    'use strict';

    var SETTINGS_STORE_NAME = 'wme_us_government_boundaries';
    var DEBUG_LEVEL = 0;
    var ALERT_UPDATE = false;
    var ZIPS_LAYER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/4/';
    var COUNTIES_LAYER_URL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Time_Zones/FeatureServer/0/';
    //var COUNTIES_LAYER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2010/State_County/MapServer/1/';

    var _scriptVersion = GM_info.script.version;
    var _scriptVersionChanges = [
        GM_info.script.name + '\nv' + _scriptVersion + '\n\nWhat\'s New\n------------------------------\n',
        '\n- Restored zip->city lookup.'
    ].join('');
    var _zipsLayer;
    var _countiesLayer;
    var _settings = {};

    function log(message, level) {
        if (message && (!level || (level <= DEBUG_LEVEL))) {
            console.log('US Boundaries: ', message);
        }
    }

    // Recursively checks the settings object and fills in missing properties from the default settings object.
    function checkSettings(obj, defaultObj) {
        Object.keys(defaultObj).forEach(key => {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = defaultObj[key];
            } else if (defaultObj[key] && (defaultObj[key].constructor === {}.constructor)) {
                checkSettings(obj[key], defaultObj[key]);
            }
        });
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
        var defaultSettings = {
            lastVersion:null,
            layers: {
                zips: { visible: true, dynamicLabels: false, junk:123.42 },
                counties: { visible: true, dynamicLabels: true }
            }
        };
        if (loadedSettings) {
            _settings = loadedSettings;
            checkSettings(_settings, defaultSettings);
        } else {
            _settings = defaultSettings;
        }
    }

    function saveSettings() {
        if (localStorage) {
            _settings.lastVersion = _scriptVersion;
            _settings.layers.zips.visible = _zipsLayer.visibility;
            _settings.layers.counties.visible = _countiesLayer.visibility;
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(_settings));
            log('Settings saved', 1);
        }
    }

    function getUrl(baseUrl, extent, zoom, outFields) {
        var geometry = { xmin:extent.left, ymin:extent.bottom, xmax:extent.right, ymax:extent.top, spatialReference: {wkid: 102100, latestWkid: 3857} };
        var geometryStr = JSON.stringify(geometry);
        var url = baseUrl + 'query?geometry=' + encodeURIComponent(geometryStr);
        url += '&returnGeometry=true';
        url += '&outFields=' + encodeURIComponent(outFields.join(','));
        url += '&quantizationParameters={tolerance:100}';
        url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        return url;
    }

    var _zipCities = {};
    function appendCityToZip(zip, cityState, context) {
        if (!context.cancel) {
            if (!cityState.error) {
                _zipCities[zip] = cityState;
                $('#zip-text').append(' (' + cityState.city + ', ' + cityState.state + ')');
            }
        }
    }

    function updateNameDisplay(context){
        var center = W.map.getCenter();
        var mapCenter = new OL.Geometry.Point(center.lon,center.lat);
        var feature;
        var text = '';
        var label;
        var url;
        var i;
        if (context.cancel) return;
        if (_zipsLayer && _zipsLayer.visibility) {
            for (i=0;i<_zipsLayer.features.length;i++){
                feature = _zipsLayer.features[i];

                if(feature.geometry.containsPoint && feature.geometry.containsPoint(mapCenter)) {
                    text = feature.attributes.name;
                    url = 'https://tools.usps.com/go/ZipLookupResultsAction!input.action?resultMode=2&companyName=&address1=&address2=&city=&state=Select&urbanCode=&postalCode=' + text + '&zip=';
                    $('<span>', {id:'zip-text'}).empty().css({display:'inline-block'}).append(
                        $('<a>', {href:url, target:'__blank', title:'Look up USPS zip code'})
                        .text(text)
                        .css({color:'white',display:'inline-block'})
                    ).appendTo($('#zip-boundary'));
                    if (!context.cancel) {
                        if (_zipCities[text]) {
                            appendCityToZip(text, _zipCities[text], context);
                        } else {
                            GM_xmlhttpRequest({
                                url: 'https://wazex.us/zips/ziptocity2.php?zip=' + text,
                                context: context,
                                method: 'GET',
                                onload: function(res) {appendCityToZip(text, $.parseJSON(res.responseText), res.context);}
                            });
                        }
                    }
                }
            }
        }
        if (_countiesLayer && _countiesLayer.visibility) {
            for (i=0;i<_countiesLayer.features.length;i++){
                feature = _countiesLayer.features[i];
                if(feature.attributes.type !== 'label' && feature.geometry.containsPoint(mapCenter)) {
                    label = feature.attributes.name;
                    $('<span>', {id:'county-text'}).css({display:'inline-block'})
                        .text(label)
                        .appendTo($('#county-boundary'));
                }
            }
        }
    }

    function arcgisFeatureToOLFeature(feature, attributes) {
        var rings = [];
        feature.geometry.rings.forEach(function(ringIn) {
            var pnts= [];
            for(var i=0;i<ringIn.length;i++){
                pnts.push(new OL.Geometry.Point(ringIn[i][0], ringIn[i][1]));
            }
            rings.push(new OL.Geometry.LinearRing(pnts));
        });
        var polygon = new OL.Geometry.Polygon(rings);
        return new OL.Feature.Vector(polygon, attributes);
    }

    function getRingArrayFromFeature(feature) {
        var rings = [];
        feature.geometry.components.forEach(function(featureRing) {
            var ring = [];
            featureRing.components.forEach(function(pt) {
                ring.push([pt.x, pt.y]);
            });
            rings.push(ring);
        });
        return rings;
    }

    function getLabelPoints(feature) {
        var e = W.map.getExtent();
        var screenPoly = turf.polygon([[[e.left, e.top], [e.right, e.top], [e.right, e.bottom], [e.left, e.bottom], [e.left, e.top]]]);
        // The intersect function doesn't seem to like holes in polygons, so assume the first ring is the outer boundary and ignore any holes.
        var featurePoly = turf.polygon([getRingArrayFromFeature(feature)[0]]);
        var intersection = turf.intersect(screenPoly, featurePoly);

        if (intersection && intersection.geometry && intersection.geometry.coordinates) {
            var turfPt = turf.centerOfMass(intersection);
            if (!turf.inside(turfPt,intersection)) {
                turfPt = turf.pointOnSurface(intersection);
            }
            var turfCoords = turfPt.geometry.coordinates;
            var pt = new OL.Geometry.Point(turfCoords[0], turfCoords[1]);
            var attributes = feature.attributes;
            attributes.label = feature.attributes.name; //featureArea/screenArea;
            return [new OL.Feature.Vector(pt, attributes)];
        }
    }

    function processBoundaries(boundaries, context, type, nameField, labelField) {
        var layer;
        var layerSettings;
        switch(type) {
            case 'zip':
                layerSettings = _settings.layers.zips;
                layer = _zipsLayer;
                break;
            case 'county':
                layerSettings = _settings.layers.counties;
                layer = _countiesLayer;
                break;
        }

        if (context.cancel || !layerSettings.visible) {
            // do nothing
        } else {
            layer.removeAllFeatures();
            if (!context.cancel) {
                boundaries.forEach(function(boundary) {
                    var attributes = {
                        name: boundary.attributes[nameField],
                        label: layerSettings.dynamicLabels ? '' : boundary.attributes[nameField],
                        type: type
                    };

                    if (!context.cancel) {
                        var feature = arcgisFeatureToOLFeature(boundary, attributes);
                        layer.addFeatures([feature]);
                        if (layerSettings.dynamicLabels) {
                            var labels = getLabelPoints(feature);
                            if (labels) {
                                labels.forEach(function(labelFeature) {
                                    labelFeature.attributes.type='label';
                                });
                                layer.addFeatures(labels);
                            }
                        }
                    }
                });
            }
        }

        context.callCount--;
        if (context.callCount === 0) {
            updateNameDisplay(context);
            var idx = _processContexts.indexOf(context);
            if (idx > -1) {
                _processContexts.splice(idx, 1);
            }
        }
    }

    var _processContexts = [];

    function fetchBoundaries() {
        if (_processContexts.length > 0) {
            _processContexts.forEach(function(context) {context.cancel = true;});
        }

        var extent = W.map.getExtent();
        var zoom = W.map.getZoom();
        var url;
        var context = {callCount:0, cancel:false};
        _processContexts.push(context);
        $('.us-boundary-region').remove();
        $('.loading-indicator-region').before(
            $('<div>', {id:'county-boundary', class:"us-boundary-region"}).css({color:'white', float:'left', marginLeft:'10px'}),
            $('<div>', {id:'zip-boundary', class:"us-boundary-region"}).css({color:'white', float:'left', marginLeft:'10px'})
        );
        if (_settings.layers.zips.visible) {
            url = getUrl(ZIPS_LAYER_URL, extent, zoom, ['ZCTA5']);
            context.callCount++;
            $.ajax({
                url: url,
                context: context,
                method: 'GET',
                datatype: 'json',
                success: function(data) {processBoundaries($.parseJSON(data).features, this, 'zip', 'ZCTA5', 'ZCTA5'); }
            });
        }
        if (_settings.layers.counties.visible) {
            url = getUrl(COUNTIES_LAYER_URL, extent, zoom, ['ZONE']);
            context.callCount++;
            $.ajax({
                url: url,
                context: context,
                method: 'GET',
                datatype: 'json',
                success: function(data) {processBoundaries($.parseJSON(data).features, this, 'county', 'ZONE', 'ZONE'); }
            });
        }
    }

    // function fetchTimeZone() {
    //     let center = W.map.getCenter();
    //     center.transform(W.map.projection, W.map.displayProjection);
    //     var dt = new Date();
    //     $.ajax({
    //         url: 'https://maps.googleapis.com/maps/api/timezone/json?location=' + center.lat + ',' + center.lon + '&timestamp=' + (dt.getTime() / 1000),
    //         method: 'GET',
    //         success: function(data) {
    //             console.log(data);
    //         }
    //     });
    // }

    function onZipsLayerVisibilityChanged(evt) {
        _settings.layers.zips.visible = _zipsLayer.visibility;
        saveSettings();
        fetchBoundaries();
    }
    function onCountiesLayerVisibilityChanged(evt) {
        _settings.layers.counties.visible = _countiesLayer.visibility;
        saveSettings();
        fetchBoundaries();
    }

    function onModeChanged(model, modeId, context) {
        if(!modeId || modeId === 1) {
            initUserPanel();
        }
    }

    function onZipsLayerToggleChanged(checked) {
        _zipsLayer.setVisibility(checked);
    }
    function onCountiesLayerToggleChanged(checked) {
        _countiesLayer.setVisibility(checked);
    }

    function showScriptInfoAlert() {
        /* Check version and alert on update */
        if (ALERT_UPDATE && _scriptVersion !== _settings.lastVersion) {
            alert(_scriptVersionChanges);
        }
    }

    var _zipsStyle;
    var _countiesStyle;
    function initLayer(){
        _zipsStyle = {
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWidth: 3,
            strokeDashstyle: 'solid',
            fillOpacity: 0,
            fontSize: "16px",
            fontFamily: "Arial",
            fontWeight: "bold",
            fontColor: "red",
            label: '${label}',
            labelYOffset: "-20",
            labelOutlineColor: "white",
            labelOutlineWidth: 2
        };
        _countiesStyle =  {
            strokeColor: 'yellow',
            strokeOpacity: 1,
            strokeWidth: 6,
            strokeDashstyle: 'solid',
            fillOpacity: 0,
            fontSize: "22px",
            fontFamily: "Arial",
            fontWeight: "bold",
            fontColor: "yellow",
            labelYOffset: -35,
            label: '${label}',
            labelOutlineColor: "black",
            labelOutlineWidth: 2
        };

        _zipsLayer = new OL.Layer.Vector("US Gov't Boundaries - Zip Codes", {
            uniqueName: "__WMEUSBoundaries_Zips",
            styleMap: new OL.StyleMap({
                default: _zipsStyle
            })
        });
        _countiesLayer = new OL.Layer.Vector("US Gov't Boundaries - Timezone", {
            uniqueName: "__WMEUSBoundaries_Timezone",
            styleMap: new OL.StyleMap({
                default: _countiesStyle
            })
        });


        _zipsLayer.setOpacity(0.6);
        _countiesLayer.setOpacity(0.6);

        _zipsLayer.setVisibility(_settings.layers.zips.visible);
        _countiesLayer.setVisibility(_settings.layers.counties.visible);

        W.map.addLayers([_countiesLayer, _zipsLayer]);

        _zipsLayer.events.register('visibilitychanged',null,onZipsLayerVisibilityChanged);
        _countiesLayer.events.register('visibilitychanged',null,onCountiesLayerVisibilityChanged);
        W.map.events.register("moveend",W.map,function(e){
            fetchBoundaries();
            // fetchTimeZone();
            return true;
        },true);

        // Add the layer checkbox to the Layers menu.
        AddLayerCheckbox("display", "Zip Codes", _settings.layers.zips.visible, onZipsLayerToggleChanged);
        AddLayerCheckbox("display", "Timezone", _settings.layers.counties.visible, onCountiesLayerToggleChanged);
    }

    function appendTab(name, content) {
        var TAB_SELECTOR = '#user-tabs ul.nav-tabs';
        var CONTENT_SELECTOR = '#user-info div.tab-content';
        var $content;
        var $tab;

        var idName, i = 0;
        if (name && 'string' === typeof name &&  content && 'string' === typeof content) {
            /* Sanitize name for html id attribute */
            idName = name.toLowerCase().replace(/[^a-z-_]/g, '');
            /* Make sure id will be unique on page */
            while (
                $('#sidepanel-' + (i ? idName + i : idName)).length > 0) {
                i++;
            }
            if (i) {
                idName = idName + i;
            }
            /* Create tab and content */
            $tab = $('<li/>')
                .append($('<a/>')
                        .attr({
                'href': '#sidepanel-' + idName,
                'data-toggle': 'tab'
            })
                        .text(name));
            $content = $('<div/>')
                .addClass('tab-pane')
                .attr('id', 'sidepanel-' + idName)
                .html(content);

            $(TAB_SELECTOR).append($tab);
            $(CONTENT_SELECTOR).first().append($content);
        }
    }

    function initTab() {
        var $content = $('<div>').append(
            $('<fieldset>', {style:'border:1px solid silver;padding:8px;border-radius:4px;'}).append(
                $('<legend>', {style:'margin-bottom:0px;borer-bottom-style:none;width:auto;'}).append(
                    $('<h4>').text('ZIP Codes')
                ),
                $('<div>', {class:'controls-container', style:'padding-top:0px'}).append(
                    $('<input>', {type:'checkbox', id:'usgb-zips-dynamicLabels'}),
                    $('<label>', {for:'usgb-zips-dynamicLabels'}).text('Dynamic label positions')
                )
            ),
            $('<fieldset>', {style:'border:1px solid silver;padding:8px;border-radius:4px;'}).append(
                $('<legend>', {style:'margin-bottom:0px;borer-bottom-style:none;width:auto;'}).append(
                    $('<h4>').text('Timezone')
                ),
                $('<div>', {class:'controls-container', style:'padding-top:0px'}).append(
                    $('<input>', {type:'checkbox', id:'usgb-timezone-dynamicLabels'}),
                    $('<label>', {for:'usgb-timezone-dynamicLabels'}).text('Dynamic label positions')
                )
            )
        );
        appendTab('USGBT', $content.html());

        $('#usgb-zips-dynamicLabels').prop('checked', _settings.layers.zips.dynamicLabels).change(function() {
            _settings.layers.zips.dynamicLabels = $('#usgb-zips-dynamicLabels').is(':checked');
            saveSettings();
            fetchBoundaries();
        });
        $('#usgb-timezone-dynamicLabels').prop('checked', _settings.layers.counties.dynamicLabels).change(function() {
            _settings.layers.counties.dynamicLabels = $('#usgb-timezone-dynamicLabels').is(':checked');
            saveSettings();
            fetchBoundaries();
        });
    }

    function init() {
        loadSettings();
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        initLayer();
        initTab();
        showScriptInfoAlert();
        fetchBoundaries();

        log('Initialized.', 1);
    }

    function bootstrap() {
        if (W && W.loginManager &&
            W.loginManager.events &&
            W.loginManager.events.register &&
            W.model && W.model.states && W.model.states.additionalInfo &&
            W.map && W.loginManager.user) {
            log('Initializing...', 1);

            init();
        } else {
            log('Bootstrap failed. Trying again...', 1);
            setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 1);
    bootstrap();

    // "Borrowed" from WazeWrap until it works with sandboxed scripts:
    function AddLayerCheckbox(group, checkboxText, checked, callback) {
        group = group.toLowerCase();
        var normalizedText = checkboxText.toLowerCase().replace(/\s/g, '_');
        var checkboxID = "layer-switcher-item_" + normalizedText;
        var groupPrefix = 'layer-switcher-group_';
        var groupClass = groupPrefix + group.toLowerCase();
        sessionStorage[normalizedText] = checked;

        var CreateParentGroup = function(groupChecked){
            var groupList = $('.layer-switcher').find('.list-unstyled.togglers');
            var checkboxText = group.charAt(0).toUpperCase() + group.substr(1);
            var newLI = $('<li class="group">');
            newLI.html([
                '<div class="controls-container toggler">',
                '<input class="' + groupClass + '" id="' + groupClass + '" type="checkbox" ' + (groupChecked ? 'checked' : '') +'>',
                '<label for="' + groupClass + '">',
                '<span class="label-text">'+ checkboxText + '</span>',
                '</label></div>',
                '<ul class="children"></ul>'
            ].join(' '));

            groupList.append(newLI);
            $('#' + groupClass).change(function(){sessionStorage[groupClass] = this.checked;});
        };

        if(group !== "issues" && group !== "places" && group !== "road" && group !== "display") //"non-standard" group, check its existence
            if($('.'+groupClass).length === 0){ //Group doesn't exist yet, create it
                var isParentChecked = (typeof sessionStorage[groupClass] == "undefined" ? true : sessionStorage[groupClass]=='true');
                CreateParentGroup(isParentChecked);  //create the group
                sessionStorage[groupClass] = isParentChecked;

                W.app.modeController.model.bind('change:mode', function(model, modeId, context){ //make it reappear after changing modes
                    CreateParentGroup((sessionStorage[groupClass]=='true'));
                });
            }

        var buildLayerItem = function(isChecked){
            var groupChildren = $("."+groupClass).parent().parent().find('.children').not('.extended');
            let $li = $('<li>');
            $li.html([
                '<div class="controls-container toggler">',
                '<input type="checkbox" id="' + checkboxID + '"  class="' + checkboxID + ' toggle">',
                '<label for="' + checkboxID + '"><span class="label-text">' + checkboxText + '</span></label>',
                '</div>',
            ].join(' '));

            groupChildren.append($li);
            $('#' + checkboxID).prop('checked', isChecked);
            $('#' + checkboxID).change(function(){callback(this.checked); sessionStorage[normalizedText] = this.checked;});
            if(!$('#' + groupClass).is(':checked')){
                $('#' + checkboxID).prop('disabled', true);
                callback(false);
            }

            $('#' + groupClass).change(function(){$('#' + checkboxID).prop('disabled', !this.checked); callback(!this.checked ? false : sessionStorage[normalizedText]=='true');});
        };


        W.app.modeController.model.bind('change:mode', function(model, modeId, context){
            buildLayerItem((sessionStorage[normalizedText]=='true'));
        });

        buildLayerItem(checked);
    }
})();
