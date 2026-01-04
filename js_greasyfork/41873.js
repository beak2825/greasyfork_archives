// ==UserScript==
// @name         WME Military Bases Overlay
// @namespace    https://greasyfork.org/en/users/166843-wazedev
// @version      2018.05.02.02
// @description  Adds an overlay for military bases
// @author       WazeDev
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41873/WME%20Military%20Bases%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/41873/WME%20Military%20Bases%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _color = '#E6E6E6';
    var _settingsStoreName = '_wme_military_overlay';
    var _settings;
    var _features;
    var _kml;
    var _layerName = 'Military Overlay';
    var _layer = null;
    var defaultFillOpacity = 0.3;

    function loadSettingsFromStorage() {
        _settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
        if(!_settings) {
            _settings = {
                layerVisible: true
                //hiddenAreas: []
            };
        } else {
            _settings.layerVisible = (_settings.layerVisible === true);
            //_settings.hiddenAreas = _settings.hiddenAreas || [];
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                layerVisible: _layer.visibility
                //hiddenAreas: _settings.hiddenAreas
            };
            localStorage.setItem(_settingsStoreName, JSON.stringify(settings));
        }
    }

    function GetFeaturesFromKMLString(strKML) {
        var format = new OpenLayers.Format.KML({
            'internalProjection': Waze.map.baseLayer.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });
        return format.read(strKML);
    }

    function updateDistrictNameDisplay(){
        $('.wmemilitaryoverlay-region').remove();
        if (_layer !== null) {
            var mapCenter = new OpenLayers.Geometry.Point(W.map.center.lon,W.map.center.lat);
            for (var i=0;i<_layer.features.length;i++){
                var feature = _layer.features[i];
                var color;
                var text = '';
                var num;
                var url;
                if(pointInFeature(feature.geometry, mapCenter)){
                    text = feature.attributes.name;
                    color = '#00ffff';
                    var $div = $('<div>', {id:'wmemilitaryoverlay', class:"wmemilitaryoverlay-region", style:'display:inline-block;margin-left:10px;', title:'Click to toggle color on/off for this group'})
                    .css({color:color, cursor:"pointer"})
                    .click(toggleAreaFill);
                    var $span = $('<span>').css({display:'inline-block'});
                    $span.text(text).appendTo($div);
                    $('.location-info-region').parent().append($div);
                    if (color) {
                        break;
                    }
                }
            }
        }
    }

    function pointInFeature(geometry, mapCenter){
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Collection"){
            for(let i=0; i<geometry.components.length; i++){
                if(geometry.components[i].containsPoint(mapCenter))
                    return true;
            }
        }
        else
            return geometry.containsPoint(mapCenter);
        return false;
    }

    function toggleAreaFill() {
        var text = $('#wmemilitaryoverlay span').text();
        if (text) {
            var match = text.match(/WV-(\d+)/);
            if (match.length > 1) {
                var group = parseInt(match[1]);
                var f = _layer.features[group-1];
                var hide = f.attributes.fillOpacity !== 0;
                f.attributes.fillOpacity = hide ? 0 : defaultFillOpacity;
                var idx = _settings.hiddenAreas.indexOf(group);
                if (hide) {
                    if (idx === -1) _settings.hiddenAreas.push(group);
                } else {
                    if (idx > -1) {
                        _settings.hiddenAreas.splice(idx,1);
                    }
                }
                //saveSettingsToStorage();
                _layer.redraw();
            }
        }
    }

    function init() {
        InstallKML();
        loadSettingsFromStorage();
        var layerid = 'wme_military_overlay';
        var _features = GetFeaturesFromKMLString(_kml);
        for(let i=0; i< _features.length; i++){
            _features[i].attributes.name = _features[i].attributes.name.replace('<at><openparen>', '').replace('<closeparen>','');
            _features[i].attributes.labelText = _features[i].attributes.name;
        }

        var layerStyle = new OpenLayers.StyleMap({
            strokeDashstyle: 'solid',
            strokeColor: _color,
            strokeOpacity: 0.4,
            strokeWidth: 2,
            fillOpacity: defaultFillOpacity,
            fillColor: _color, //'#7cb342',
            label : "${labelText}",
            fontColor: '#ffffff',
            labelOutlineColor: '#000000',
            labelOutlineWidth: 4,
            labelAlign: 'cm',
            fontSize: "16px"
        });
        _layer = new OL.Layer.Vector("Military Overlay", {
            rendererOptions: { zIndexing: true },
            uniqueName: layerid,
            shortcutKey: "S+" + 0,
            layerGroup: 'cities_overlay',
            zIndex: -9999,
            displayInLayerSwitcher: true,
            visibility: _settings.layerVisible,
            styleMap: layerStyle
        });
        I18n.translations[I18n.locale].layers.name[layerid] = "Military Overlay";
        _layer.addFeatures(_features);
        W.map.addLayer(_layer);
        W.map.events.register("moveend", null, updateDistrictNameDisplay);
        //window.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        updateDistrictNameDisplay();

        // Add the layer checkbox to the Layers menu.
        WazeWrap.Interface.AddLayerCheckbox("display", "Military Overlay", _settings.layerVisible, layerToggled);
    }

    function layerToggled(visible) {
        _layer.setVisibility(visible);
        saveSettingsToStorage();
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            init();
            console.log('WME Military Overlay:', 'Initialized');
        } else {
            console.log('WME Military Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();

    function InstallKML(){
        _kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>WV Military Bases</name>
<visibility>1</visibility>
<Style id="KMLStyler">
<IconStyle>
<scale>0.8</scale>
</IconStyle>
<LabelStyle>
<scale>1.0</scale>
</LabelStyle>
<LineStyle>
<color>ffbc822f</color>
<width>2</width>
<gx:labelVisibility>0</gx:labelVisibility>
</LineStyle>
<PolyStyle>
<color>7fe1ca9e</color>
</PolyStyle>
</Style>
<Schema name="WV_Military_Bases" id="kml_WV_Military_Bases">
<Folder id="kml_ft_cb_2017_39_place_500k">
<name>WV Military Bases</name>
<Placemark>
	<name>Camp Dawson Cantonement</name>
	<description>Camp Dawson Cantonement</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.68185,39.44086 -79.68029,39.44276 -79.67552,39.44527 -79.67126,39.44797 -79.66746,39.45154 -79.66435,39.4542 -79.65981,39.44754 -79.65773,39.4443 -79.67169,39.44147 -79.68004,39.43571 -79.68159,39.43867 -79.68185,39.44086</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>Volkstone TA</name>
	<description>Volkstone TA</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.68367,39.44686 -79.67572,39.45539 -79.67448,39.4559 -79.67539,39.45971 -79.67365,39.46165 -79.66940,39.46006 -79.66592,39.46175 -79.65753,39.46274 -79.65457,39.46402 -79.65055,39.46393 -79.65007,39.4631 -79.66188,39.45798 -79.66559,39.45381 -79.67476,39.44701 -79.68295,39.44164 -79.68367,39.44686</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>Pringle TA</name>
	<description>Pringle TA</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.70350,39.38503 -79.71419,39.39042 -79.71630,39.39807 -79.72744,39.39983 -79.72743,39.40448 -79.72952,39.40773 -79.72334,39.40766 -79.72332,39.40868 -79.72152,39.41181 -79.71634,39.4149 -79.70888,39.41777 -79.69775,39.42072 -79.68791,39.42128 -79.68818,39.41862 -79.68844,39.41498 -79.68897,39.41186 -79.68744,39.4095 -79.68324,39.40649 -79.68174,39.40396 -79.68129,39.40163 -79.68295,39.39964 -79.68513,39.39824 -79.69020,39.39806 -79.69642,39.39923 -79.70060,39.3974 -79.70240,39.39244 -79.70200,39.38744 -79.70350,39.38503</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>Briery Mountain TA</name>
	<description>Briery Mountain TA</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.64693,39.37979 -79.66188,39.39364 -79.66188,39.40309 -79.67498,39.41058 -79.66906,39.41285 -79.66176,39.40785 -79.65823,39.41303 -79.64936,39.4129 -79.63954,39.40178 -79.64035,39.38674 -79.64693,39.37979</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>Goldmine TA</name>
	<description>Goldmine TA</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.65368,39.38197 -79.65535,39.36854 -79.68065,39.35244 -79.68474,39.35646 -79.6945,39.36717 -79.69925,39.37229 -79.7022,39.37527 -79.70272,39.38133 -79.70086,39.38368 -79.69864,39.38672 -79.69921,39.39084 -79.69857,39.39444 -79.69627,39.39659 -79.68682,39.39589 -79.68302,39.3972 -79.67989,39.40004 -79.65368,39.38197</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>White Hair TA</name>
	<description>White Hair TA</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.61171,39.45336 -79.60546,39.4447 -79.60172,39.44 -79.60519,39.43298 -79.61098,39.43231 -79.63600,39.4071 -79.63964,39.40675 -79.63247,39.44433 -79.62849,39.44774 -79.62754,39.44823 -79.62721,39.44896 -79.62556,39.45003 -79.62240,39.44916 -79.62111,39.44819 -79.61948,39.44779 -79.61171,39.45336</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
<Placemark>
	<name>Camp Tackett</name>
	<description>Camp Tackett</description>
	<Style><LineStyle><color>FF232323</color><width>0.737006</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
      <MultiGeometry><Polygon><outerBoundaryIs><LinearRing><coordinates>-79.52866,39.46356 -79.52280,39.46111 -79.51810,39.45822 -79.51742,39.45762 -79.52537,39.46044 -79.52627,39.45894 -79.53048,39.46036 -79.53017,39.4616 -79.52942,39.4629 -79.52866,39.46356</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry>
</Placemark>
</Folder>
</Document></kml>`;
    }
})();
