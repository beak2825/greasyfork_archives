// ==UserScript==
// @name         WME Manhattan UR Project Overlay
// @namespace    WazeDev
// @version      2019.02.26.01
// @description  Adds a group area overlay for the Manhattan UR Project (2018).
// @author       MapOMatic, Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369292/WME%20Manhattan%20UR%20Project%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/369292/WME%20Manhattan%20UR%20Project%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROJECT_NAME = 'NY UR Project';
    const STATE_ABBR = 'Manhattan';
    const VERSION = GM_info.script.version;
    const SCRIPT_NAME = GM_info.script.name;
    const UPDATE_ALERT = false;
    const UPDATE_NOTES = 'Fixed code that Waze broke to jump between areas in the drop down.';

    // Enter the MapRaid area names and the desired fill colors, in order they appear in the original map legend:
    const GROUPS = [
        {name: '1', fillColor:'#ff99e6', zoomTo: 3},
        {name: '2', fillColor:'#FF0000', zoomTo: 4},
        {name: '3', fillColor:'#01579b', zoomTo: 5},
        {name: '4', fillColor:'#7cb342', zoomTo: 2},
        {name: '5', fillColor:'#f57c00', zoomTo: 4},
        {name: '6', fillColor:'#7cb342', zoomTo: 4},
        {name: '7', fillColor:'#f57c00', zoomTo: 4},
        {name: '8', fillColor:'#FF0000', zoomTo: 4},
        {name: '9', fillColor:'#01579b', zoomTo: 4},
        {name: '10', fillColor:'#FF0000', zoomTo: 3},
    ];

    // There must be a GROUP above for each WKT_STRING below
    const WKT_STRINGS = [
        'POLYGON((-73.9314651 40.87834789999999,-73.9465714 40.8525789,-73.9360781 40.848959699999995,-73.9282894 40.84608639999999,-73.9242554 40.851475300000004,-73.9141273 40.86329020000001,-73.9101791 40.86926179999999,-73.9106941 40.874064600000004,-73.9203072 40.87549239999998,-73.9223671 40.877828799999996,-73.9314651 40.87834789999999))',
        'POLYGON((-73.9577293 40.853617699999994,-73.9580297 40.85176740000001,-73.9482021 40.8502417,-73.9493394 40.846662599999995,-73.9397903 40.8429294,-73.9360781 40.848959699999995,-73.9465714 40.8525789,-73.9577293 40.853617699999994))',
        'POLYGON((-73.9282894 40.84608639999999,-73.9360781 40.848959699999995,-73.9397903 40.8429294,-73.9318943 40.8398368,-73.9282894 40.84608639999999))',
        'POLYGON((-73.9539957 40.76147969999999,-73.9419593 40.774861800000004,-73.9383316 40.78392099999999,-73.9298344 40.792986299999974,-73.9276457 40.800588600000005,-73.9327097 40.80861229999998,-73.9344908 40.83205050000001,-73.9318943 40.8398368,-73.9397903 40.8429294,-73.9493394 40.846662599999995,-73.9688873 40.8152383,-73.9931506 40.77659710000001,-73.9539957 40.76147969999999))',
        'POLYGON((-73.9623213 40.75141850000001,-73.9539957 40.76147969999999,-73.9931506 40.77659710000001,-74.0017176 40.766826600000016,-73.9623213 40.75141850000001))',
        'POLYGON((-73.9712048 40.73919330000002,-73.9623213 40.75141850000001,-74.0017176 40.766826600000016,-74.0089273 40.75466940000002,-73.9712048 40.73919330000002))',
        'POLYGON((-74.0089273 40.75466940000002,-74.0162659 40.747191899999976,-73.9693165 40.72761650000001,-73.9712048 40.73919330000002,-74.0089273 40.75466940000002))',
        'POLYGON((-74.015193 40.73129140000002,-73.9728785 40.71662309999999,-73.9693165 40.72761650000001,-74.0162659 40.747191899999976,-74.015193 40.73129140000002))',
        'POLYGON((-74.015193 40.73129140000002,-74.0190125 40.71792429999999,-73.9884567 40.70647379999999,-73.9728785 40.71662309999999,-74.015193 40.73129140000002))',
        'POLYGON((-74.0196991 40.696973700000015,-74.0280247 40.68870870000001,-74.0287543 40.68385969999999,-74.0204716 40.683111399999994,-74.0087986 40.69014049999997,-74.0006447 40.70439170000001,-73.9884567 40.70647379999999,-74.0190125 40.71792429999999,-74.0196991 40.696973700000015))'
    ];
    const SETTINGS_STORE_NAME = '_wme_' + STATE_ABBR + '_mapraid';
    const DEFAULT_FILL_OPACITY = 0.3;

    var _settings;
    var _layer;

    function loadSettingsFromStorage() {
        _settings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
        if(!_settings) {
            _settings = {
                layerVisible: true,
                hiddenAreas: []
            };
        } else {
            _settings.layerVisible = (_settings.layerVisible === true);
            _settings.hiddenAreas = _settings.hiddenAreas || [];
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                layerVisible: _layer.visibility,
                hiddenAreas: _settings.hiddenAreas
            };
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        }
    }

    function updateDistrictNameDisplay(){
        $('.mapraid-region').remove();
        if (_layer !== null) {
            var mapCenter = new OpenLayers.Geometry.Point(W.map.center.lon,W.map.center.lat);
            for (var i=0;i<_layer.features.length;i++){
                var feature = _layer.features[i];
                var color;
                var text = '';
                if(feature.geometry.containsPoint(mapCenter)) {
                    text = feature.attributes.name;
                    color = '#ff0';
                    var $div = $('<div>', {id:'mapraid', class:'mapraid-region', style:'display:inline-block;margin-left:10px;', title:'Click to toggle color on/off for this group'})
                    .css({color:color, cursor:'pointer', fontWeight:'bold', fontSize:'14px'})
                    .click(toggleAreaFill);
                    var $span = $('<span>').css({display:'inline-block'});
                    $span.text('Group: ' + text).appendTo($div);
                    $('.location-info-region').parent().append($div);
                    if (color) {
                        break;
                    }
                }
            }
        }
    }

    function toggleAreaFill() {
        var text = $('#mapraid span').text();
        if (text) {
            var match = text.match(/^Group: (.*)/);
            if (match.length > 1) {
                var areaName = match[1];
                var f = _layer.getFeaturesByAttribute('name', areaName)[0];
                var hide = f.attributes.fillOpacity !== 0;
                f.attributes.fillOpacity = hide ? 0 : DEFAULT_FILL_OPACITY;
                var idx = _settings.hiddenAreas.indexOf(areaName);
                if (hide) {
                    if (idx === -1) _settings.hiddenAreas.push(areaName);
                } else {
                    if (idx > -1) {
                        _settings.hiddenAreas.splice(idx,1);
                    }
                }
                saveSettingsToStorage();
                _layer.redraw();
            }
        }
    }

    function layerToggled(visible) {
        _layer.setVisibility(visible);
        saveSettingsToStorage();
    }

    function init() {
        loadSettingsFromStorage();
        let layerid = 'wme_' + STATE_ABBR + '_mapraid';
        let wkt = new OL.Format.WKT();
        let features = WKT_STRINGS.map(polyString => {
            var f = wkt.read(polyString);
            f.geometry.transform(W.map.displayProjection, W.map.projection);
            return f;
        });
        GROUPS.forEach((group, i) => {
            let f = features[i];
            f.attributes.name = group.name;
            f.attributes.fillColor = group.fillColor;
            f.attributes.fillOpacity = _settings.hiddenAreas.indexOf(group.name) > -1 ? 0 : DEFAULT_FILL_OPACITY;
            group.feature = f;
        });

        let layerStyle = new OpenLayers.StyleMap({
            strokeDashstyle: 'solid',
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWidth: 3,
            fillOpacity: '${fillOpacity}',
            fillColor: '${fillColor}',
            label: 'Group ${name}',
            fontOpacity: 0.9,
            fontSize: '20px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontColor: '#fff',
            labelOutlineColor: '#000',
            labelOutlineWidth: 2
        });
        _layer = new OL.Layer.Vector(STATE_ABBR + ' UR Project', {
            rendererOptions: { zIndexing: true },
            uniqueName: layerid,
            shortcutKey: 'S+' + 0,
            layerGroup: STATE_ABBR + '_mapraid',
            zIndex: -9999,
            displayInLayerSwitcher: true,
            visibility: _settings.layerVisible,
            styleMap: layerStyle
        });
        I18n.translations[I18n.locale].layers.name[layerid] = STATE_ABBR + ' MapRaid';
        _layer.addFeatures(features);
        W.map.addLayer(_layer);
        W.map.events.register('moveend', null, updateDistrictNameDisplay);
        window.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        updateDistrictNameDisplay();

        // Add the layer checkbox to the Layers menu.
        WazeWrap.Interface.AddLayerCheckbox('display', STATE_ABBR + ' UR Project', _settings.layerVisible, layerToggled);

        initAreaJumper();
    }

    function initAreaJumper() {
        let $areaJumper = $('#mapraidDropdown');

        // If another script hasn't already created the dropdown, create it now.
        if (!$areaJumper.length) {
            let $areaJumperContainer = $('<div style="flex-grow: 1;padding-top: 6px;">').insertBefore('#edit-buttons');
            $areaJumper = $('<select id=mapraidDropdown style="margin-top: 4px;display: block;width: 80%;margin: 0 auto;">')
                .appendTo($areaJumperContainer)
                .append($('<option>', {value: 0}).text(PROJECT_NAME));
        }

        // Append the groups to the dropdown.
        $areaJumper.append(
            $('<optgroup>', {label: STATE_ABBR}).append(GROUPS.map(group => {
                return $('<option>', {value: STATE_ABBR + group.name}).text('Group ' + group.name);
            }))
        );

        // Handle a group selection.
        $areaJumper.change(function() {
            let value = $(this).val();
            let group = GROUPS.find(group => STATE_ABBR + group.name === value);
            if (group) {
                var pt = group.feature.geometry.getCentroid();
                W.map.moveTo(new OL.LonLat(pt.x, pt.y), group.zoomTo);
                $areaJumper.val('0');
            }
        });
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && $('#topbar-container > div > div > div.location-info-region > div').length && $('#layer-switcher-group_display').length && WazeWrap.Interface) {
            init();
            console.log(STATE_ABBR + ' Area Overlay:', 'Initialized');
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/369292-wme-manhattan-ur-project-overlay", "");
        } else {
            console.log(STATE_ABBR + ' MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();
})();
