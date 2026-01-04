// ==UserScript==
// @name         WME Bronx UR Project Overlay
// @namespace    WazeDev
// @version      2019.02.26.01
// @description  Adds a group area overlay for the Bronx UR Project (2018).
// @author       MapOMatic, Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40567/WME%20Bronx%20UR%20Project%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/40567/WME%20Bronx%20UR%20Project%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROJECT_NAME = 'NY UR Project';
    const STATE_ABBR = 'Bronx';
    const VERSION = GM_info.script.version;
    const SCRIPT_NAME = GM_info.script.name;
    const UPDATE_ALERT = false;
    const UPDATE_NOTES = 'Fixed code that Waze broke to jump between areas in the drop down.';

    // Enter the MapRaid area names and the desired fill colors, in order they appear in the original map legend:
    const GROUPS = [
        {name: '1', fillColor:'#FF0000', zoomTo: 4},
        {name: '2', fillColor:'#FF0000', zoomTo: 5},
        {name: '3', fillColor:'#01579b', zoomTo: 5},
        {name: '4', fillColor:'#7cb342', zoomTo: 3},
        {name: '5', fillColor:'#f57c00', zoomTo: 4},
        {name: '6', fillColor:'#7cb342', zoomTo: 4},
        {name: '7', fillColor:'#f57c00', zoomTo: 4},
        {name: '8', fillColor:'#FF0000', zoomTo: 4},
        {name: '9', fillColor:'#01579b', zoomTo: 2},
        {name: '10', fillColor:'#FF0000', zoomTo: 3},
        {name: '11', fillColor:'#01579b', zoomTo: 3},
        {name: '12', fillColor:'#7cb342', zoomTo: 3},
        {name: '13', fillColor:'#f57c00', zoomTo: 4},
        {name: '14', fillColor:'#7cb342', zoomTo: 3},
        {name: '15', fillColor:'#f57c00', zoomTo: 3},
        {name: '16', fillColor:'#FF0000', zoomTo: 3},
        {name: '17', fillColor:'#01579b', zoomTo: 3},
        {name: '18', fillColor:'#01579b', zoomTo: 3},
        {name: '19', fillColor:'#7cb342', zoomTo: 3}
    ];

    // There must be a GROUP above for each WKT_STRING below
    const WKT_STRINGS = [
        'POLYGON((-73.85507583618163 40.91558813293605,-73.83242726325989 40.90838015784857,-73.83790969848631 40.89436735747279,-73.86104106903075 40.90062807267998,-73.85507583618163 40.91558813293605))',
        'POLYGON((-73.91860127449036 40.91705557713718,-73.88242363929747 40.90640978718602,-73.89030933380127 40.889947195242996,-73.92637968063354 40.89977658534929,-73.91860127449036 40.91705557713718))',
        'POLYGON((-73.88242363929747 40.90640978718602,-73.84918570518494 40.89741669174711,-73.85698556900024 40.8808950792166,-73.89030933380127 40.889947195242996,-73.88242363929747 40.90640978718602))',
        'POLYGON((-73.84918570518494 40.89741669174711,-73.81447792053223 40.88849537111659,-73.8227391242981 40.87156588656279,-73.85698556900024 40.8808950792166,-73.84918570518494 40.89741669174711))',
        'POLYGON((-73.81447792053223 40.88849537111659,-73.74794840812682 40.87185795078844,-73.75353813171385 40.857967248129,-73.8227391242981 40.87156588656279,-73.81447792053223 40.88849537111659))',
        'POLYGON((-73.92637968063354 40.89977658534929,-73.89030933380127 40.889947195242996,-73.89975070953368 40.870137998469346,-73.93526315689087 40.8798243169399,-73.92637968063354 40.89977658534929))',
        'POLYGON((-73.89030933380127 40.889947195242996,-73.85698556900024 40.8808950792166,-73.86634111404418 40.86105071641589,-73.89975070953368 40.870137998469346,-73.89030933380127 40.889947195242996))',
        'POLYGON((-73.85698556900024 40.8808950792166,-73.8227391242981 40.87156588656279,-73.83241653442381 40.85183234227608,-73.86634111404418 40.86105071641589,-73.85698556900024 40.8808950792166))',
        'POLYGON((-73.8227391242981 40.87156588656279,-73.75353813171385 40.857967248129,-73.77010345458986 40.827806609491034,-73.83241653442381 40.85183234227608,-73.8227391242981 40.87156588656279))',
        'POLYGON((-73.90893459320068 40.872604331289665,-73.88432264328003 40.86595151271601,-73.89535188674927 40.84604585892748,-73.92253875732422 40.8537799929847,-73.90893459320068 40.872604331289665))',
        'POLYGON((-73.88432264328003 40.86595151271601,-73.85320901870726 40.85748037159408,-73.86370182037354 40.837028325869056,-73.89535188674927 40.84604585892748,-73.88432264328003 40.86595151271601))',
        'POLYGON((-73.85320901870726 40.85748037159408,-73.81885528564452 40.84813164819528,-73.82959485054015 40.82730327467911,-73.86370182037354 40.837028325869056,-73.85320901870726 40.85748037159408))',
        'POLYGON((-73.81885528564452 40.84813164819528,-73.77010345458986 40.827806609491034,-73.77743124961853 40.812428818592366,-73.82959485054015 40.82730327467911,-73.81885528564452 40.84813164819528))',
        'POLYGON((-73.92253875732422 40.8537799929847,-73.89535188674927 40.84604585892748,-73.90869855880737 40.8219855525646,-73.93432974815367 40.829056811687195,-73.93472671508789 40.83459313808024,-73.92253875732422 40.8537799929847))',
        'POLYGON((-73.89535188674927 40.84604585892748,-73.86370182037354 40.837028325869056,-73.87606143951415 40.812972866741916,-73.90869855880737 40.8219855525646,-73.89535188674927 40.84604585892748))',
        'POLYGON((-73.86370182037354 40.837028325869056,-73.82959485054015 40.82730327467911,-73.84537696838377 40.798671850266516,-73.87606143951415 40.812972866741916,-73.86370182037354 40.837028325869056))',
        'POLYGON((-73.82959485054015 40.82730327467911,-73.77743124961853 40.812428818592366,-73.78169059753418 40.80367471415383,-73.84537696838377 40.798671850266516,-73.82959485054015 40.82730327467911))',
        'POLYGON((-73.93432974815367 40.829056811687195,-73.90103816986085 40.819874582820034,-73.91781806945801 40.79490321029863,-73.92811775207521 40.79964646371417,-73.9321517944336 40.806663258110945,-73.93432974815367 40.829056811687195))',
        'POLYGON((-73.90103816986085 40.819874582820034,-73.87606143951415 40.812972866741916,-73.84537696838377 40.798671850266516,-73.87867927551268 40.7801514760161,-73.91781806945801 40.79490321029863,-73.90103816986085 40.819874582820034))'
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
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/40567-wme-bronx-ur-project-overlay", "");
        } else {
            console.log(STATE_ABBR + ' MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();
})();
