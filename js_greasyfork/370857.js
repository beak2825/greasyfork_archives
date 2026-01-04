// ==UserScript==
// @name         WME Brooklyn UR Project Overlay
// @namespace    WazeDev
// @version      2019.02.26.01
// @description  Adds a group area overlay for the Brooklyn UR Project (2018).
// @author       MapOMatic, Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370857/WME%20Brooklyn%20UR%20Project%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/370857/WME%20Brooklyn%20UR%20Project%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROJECT_NAME = 'NY UR Project';
    const STATE_ABBR = 'Brooklyn';
    const VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    const UPDATE_NOTES = 'Fixed code that Waze broke to jump between areas in the drop down.';

    // Enter the MapRaid area names and the desired fill colors, in order they appear in the original map legend:
    const GROUPS = [
        {name: '1', fillColor:'#ff99e6', zoomTo: 3},
        {name: '2', fillColor:'#FF0000', zoomTo: 3},
        {name: '3', fillColor:'#01579b', zoomTo: 3},
        {name: '4', fillColor:'#7cb342', zoomTo: 2},
        {name: '5', fillColor:'#f57c00', zoomTo: 2},
        {name: '6', fillColor:'#ffcc33', zoomTo: 3},
        {name: '7', fillColor:'#b84dff', zoomTo: 3},
        {name: '8', fillColor:'#80d4ff', zoomTo: 2},
    ];

    // There must be a GROUP above for each WKT_STRING below
    const WKT_STRINGS = [
        'POLYGON((-73.9904330486728 40.70549262317117,-73.982364963956 40.69264088276152,-73.90621168560517 40.70023835045976,-73.92108185238368 40.72351341822026,-73.94811851925385 40.737887521686716,-73.96262390560639 40.74191951783877,-73.96502716488374 40.72279788398495,-73.97712929195893 40.71043744237824,-73.9904330486728 40.70549262317117))',
        'POLYGON((-73.96871788448823 40.672951764600896,-73.982364963956 40.69264088276152,-73.90253169483674 40.70057183829086,-73.89399154133326 40.679575117124344,-73.9228413814975 40.6682320210483,-73.95565016216767 40.670331534429955,-73.96871788448823 40.672951764600896))',
        'POLYGON((-73.84889824337495 40.64391191093184,-73.85461810922197 40.66140089151345,-73.8740708852252 40.69437533937751,-73.89564936699549 40.68364455309436,-73.89399126307762 40.67957692098405,-73.9228413814975 40.6682320210483,-73.88698561138642 40.62305206652372,-73.84889824337495 40.64391191093184))',
        'POLYGON((-73.92391426510346 40.633751489330514,-73.95687604193296 40.62959257536632,-73.96873243172479 40.67293649646323,-73.9556379897706 40.670330176220006,-73.9228413814975 40.6682320210483,-73.88698561138642 40.62305206652372,-73.89618022388947 40.62175727124528,-73.92391426510346 40.633751489330514))',
        'POLYGON((-73.92391426510346 40.633751489330514,-73.95687604193296 40.62959257536632,-73.94675977547479 40.57464813420046,-73.88104183620942 40.57376700856745,-73.86775953716767 40.592686991724484,-73.89618022388947 40.62175727124528,-73.92391426510346 40.633751489330514))',
        'POLYGON((-73.99042231983674 40.70548403890334,-73.9822975053138 40.6925472355467,-73.96871659850649 40.672941881184975,-73.95687604193296 40.62959257536632,-73.97946126778436 40.63694407719938,-74.03330547756684 40.6686877349959,-74.01216967052949 40.68732051277307,-73.99748189396394 40.70452476197392,-73.99042231983674 40.70548403890334))',
        'POLYGON((-74.04810054249299 40.632309891249044,-74.0375724686927 40.602939093514834,-74.01781175231508 40.59738589064224,-73.95687604193296 40.62959257536632,-73.97946126778436 40.63694407719938,-74.02457220501435 40.66352822013939,-74.04810054249299 40.632309891249044))',
        'POLYGON((-73.94678596378611 40.574754788886835,-74.01353987591926 40.56434974042763,-74.01781175231508 40.59738589064224,-73.95687604193296 40.62959257536632,-73.94678596378611 40.574754788886835))',
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
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/370857-wme-brooklyn-ur-project-overlay", "");
        } else {
            console.log(STATE_ABBR + ' MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();
})();
