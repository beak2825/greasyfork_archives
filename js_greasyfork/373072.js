// ==UserScript==
// @name         WME Texas PUR Raid Overlay
// @namespace    WazeDev
// @version      2018.10.09.002
// @description  Adds a group area overlay for the Texas PUR Raid (2018).
// @author       MapOMatic, Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373072/WME%20Texas%20PUR%20Raid%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/373072/WME%20Texas%20PUR%20Raid%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROJECT_NAME = 'PUR Raid 2018';
    const STATE_ABBR = 'Texas';
    const VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    const UPDATE_ALERT = false;
    const UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
    ].join('\n');

    const GROUPS = [
        {name: 'Western Division', fillColor:'#ff99e6', zoomTo: 0},
        {name: 'Eastern Division', fillColor:'#FF0000', zoomTo: 0},
    ];

    const WKT_STRINGS = [
        'POLYGON((-103.07433598219268 36.51617152487984,-103.05236332594268 31.99633816485509,-106.65587895094268 32.05222496018145,-106.67785160719268 31.828473434585696,-106.30431645094268 31.491827381929784,-105.97472660719268 31.37934142521581,-105.35949223219268 30.833763224128585,-104.92003910719268 30.550341802926432,-104.65636723219268 30.152158584453833,-104.67833988844268 29.77143575899671,-104.37072270094268 29.523186196143918,-104.12902348219268 29.408403332584417,-103.71154301344268 29.1784486399968,-103.29406254469268 29.005643526263025,-102.96447270094268 29.12087916350459,-102.78869145094268 29.427542829490623,-102.63488285719268 29.73328339001792,-102.30529301344268 29.866753099790245,-101.71203129469268 29.752361389705097,-101.38244145094268 29.73328339001792,-101.09679691969268 29.446678720476086,-100.72326176344268 29.140072573369583,-100.45958988844268 28.601307863716855,-100.22222342717174 28.09696467614576,-99.87066092717174 27.805823446051065,-99.69487967717174 27.49441068335823,-99.56304373967174 27.18211453048693,-99.23345389592174 26.633491122910563,-99.10161795842174 26.27940439230814,-98.26665702092174 26.00325376251035,-97.29986014592174 25.726452351164426,-97.05816092717174 25.924233836497038,-97.43169608342174 26.84933954087214,-97.38310273072864 27.290014984776075,-97.84452851197864 27.34370134791689,-97.92622205701116 29.617483911668888,-98.1853258662735 29.94296729451834,-98.6435386137241 34.155005472363875,-98.7643882230991 34.136820664682354,-98.9511558012241 34.200450361733374,-99.1763755277866 34.209536402077944,-99.2752524809116 34.41371313255305,-99.3851157621616 34.4590182616235,-99.4345542387241 34.386518267752145,-99.5718833402866 34.41824475068284,-99.6872397855991 34.372917521444165,-99.91025863630489 34.5868894985865,-100.01462875349239 34.591411712276845,-99.99629935638603 36.50553189336133,-103.07433598219268 36.51617152487984))',
        'POLYGON((-98.66120489953965 34.16662372100617,-98.2025257003209 29.926646866697805,-97.93061407922715 29.578508131542065,-97.83723029016465 27.328134673707055,-97.06818732141465 27.28908714246825,-96.62873419641465 27.95101665967423,-96.03547247766465 28.319165899889576,-94.56330450891465 28.974781792397675,-93.83820685266465 29.49248020453784,-93.83820685266465 29.87426504269192,-93.72834357141465 30.349447616469256,-93.50861700891465 31.029670968840716,-93.75031622766465 31.55540183743336,-93.92609747766465 31.947768206061628,-93.92609747766465 33.57370023656958,-94.47541388391465 33.59200536673878,-94.84894904016465 33.774842902155044,-95.24445685266465 33.95729105010073,-95.72785529016465 33.86611571353214,-96.38703497766465 33.7200324804802,-96.60676154016465 33.90259755224774,-97.04621466516465 33.86611571353214,-97.22199591516465 33.774842902155044,-97.50764044641465 33.88435858289584,-97.70539435266465 33.95729105010073,-97.90314825891465 33.86611571353214,-98.03498419641465 34.06657260915332,-98.29865607141465 34.12116061622305,-98.49640997766465 34.13934879379409,-98.66120489953965 34.16662372100617))',
    ];
    const SETTINGS_STORE_NAME = '_wme_' + STATE_ABBR + '_mapraid';
    const DEFAULT_FILL_OPACITY = 0.3;

    var _settings;
    var _layer;

    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + 'VERSION';
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        }
    }

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
            label: '${name}',
            fontOpacity: 0.9,
            fontSize: '20px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontColor: '#fff',
            labelOutlineColor: '#000',
            labelOutlineWidth: 2
        });
        _layer = new OL.Layer.Vector(STATE_ABBR + ' PUR Raid', {
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
        WazeWrap.Interface.AddLayerCheckbox('display', STATE_ABBR + ' PUR Raid', _settings.layerVisible, layerToggled);

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
                return $('<option>', {value: STATE_ABBR + group.name}).text(group.name);
            }))
        );

        // Handle a group selection.
        $areaJumper.change(function() {
            let value = $(this).val();
            let group = GROUPS.find(group => STATE_ABBR + group.name === value);
            if (group) {
                W.map.moveTo(group.feature.geometry.getCentroid().toLonLat(), group.zoomTo);
                $areaJumper.val('0');
            }
        });
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && $('#topbar-container > div > div > div.location-info-region > div').length && $('#layer-switcher-group_display').length && WazeWrap.Interface) {
            init();
            console.log(STATE_ABBR + ' Area Overlay:', 'Initialized');
        } else {
            console.log(STATE_ABBR + ' MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();
})();
