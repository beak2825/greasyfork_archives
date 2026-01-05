// ==UserScript==
// @name         WME WV MapRaid Overlay
// @namespace    https://greasyfork.org/users/45389
// @version      2018.08.18.001
// @description  Adds a WV MapRaid area overlay.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25897/WME%20WV%20MapRaid%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/25897/WME%20WV%20MapRaid%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter the state abbreviation:
    var _stateAbbr = "WV";

    // Enter the MapRaid area names and the desired fill colors, in order they appear in the original map legend:
    var _areas = {
        'WV-1':{fillColor:'#7cb342'},
        'WV-2':{fillColor:'#f57c00'},
        'WV-3':{fillColor:'#ffea00'},
        'WV-4':{fillColor:'#01579b'}
    };

    var _settingsStoreName = '_wme_' + _stateAbbr + '_mapraid';
    var _settings;
    var _features;
    var _kml;
    var _layerName = _stateAbbr + ' MapRaid';
    var _layer = null;
    var defaultFillOpacity = 0.3;

    function loadSettingsFromStorage() {
        _settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
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
        $('.mapraid-region').remove();
        if (_layer !== null) {
            var mapCenter = new OpenLayers.Geometry.Point(W.map.center.lon,W.map.center.lat);
            for (var i=0;i<_layer.features.length;i++){
                var feature = _layer.features[i];
                var color;
                var text = '';
                var num;
                var url;
                if(feature.geometry.containsPoint(mapCenter)) {
                    text = feature.attributes.name;
                    color = '#00ffff';
                    var $div = $('<div>', {id:'mapraid', class:"mapraid-region", style:'display:inline-block;margin-left:10px;', title:'Click to toggle color on/off for this group'})
                    .css({color:color, cursor:"pointer"})
                    .click(toggleAreaFill);
                    var $span = $('<span>').css({display:'inline-block'});
                    $span.text('MapRaid Area: ' + text).appendTo($div);
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
                saveSettingsToStorage();
                _layer.redraw();
            }
        }
    }


    function init() {
        InstallKML();
        loadSettingsFromStorage();
        var layerid = 'wme_' + _stateAbbr + '_mapraid';
        var _features = GetFeaturesFromKMLString(_kml);
        var i = 0;
        for(var areaName in _areas) {
            _features[i].attributes.name = areaName;
            _features[i].attributes.fillColor = _areas[areaName].fillColor;
            _features[i].attributes.fillOpacity = _settings.hiddenAreas.indexOf(i+1) > -1 ? 0 : defaultFillOpacity;
            i++;
        }
        var layerStyle = new OpenLayers.StyleMap({
            strokeDashstyle: 'solid',
            strokeColor: '#ff0000',
            strokeOpacity: 0.4,
            strokeWidth: 2,
            fillOpacity: '${fillOpacity}',
            fillColor: '${fillColor}'
        });
        _layer = new OL.Layer.Vector(_stateAbbr + " MapRaid", {
            rendererOptions: { zIndexing: true },
            uniqueName: layerid,
            shortcutKey: "S+" + 0,
            layerGroup: _stateAbbr + '_mapraid',
            zIndex: -9999,
            displayInLayerSwitcher: true,
            visibility: _settings.layerVisible,
            styleMap: layerStyle
        });
        I18n.translations[I18n.locale].layers.name[layerid] = _stateAbbr + " MapRaid";
        _layer.addFeatures(_features);
        W.map.addLayer(_layer);
        W.map.events.register("moveend", null, updateDistrictNameDisplay);
        window.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        updateDistrictNameDisplay();

        // Add the layer checkbox to the Layers menu.
        WazeWrap.Interface.AddLayerCheckbox("display", "WV MapRaid", _settings.layerVisible, layerToggled);
    }

    function layerToggled(visible) {
        _layer.setVisibility(visible);
        saveSettingsToStorage();
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user) {
            init();
            console.log('WV MR Overlay:', 'Initialized');
        } else {
            console.log('WV MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();

    function InstallKML(){
        OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{kml:"http://www.opengis.net/kml/2.2",gx:"http://www.google.com/kml/ext/2.2"},kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date,extractAttributes:!0,kvpAttributes:!1,extractStyles:!1,extractTracks:!1,trackAttributes:null,internalns:null,features:null,styles:null,styleBaseUrl:"",fetched:null,maxDepth:0,initialize:function(a){this.regExes=
            {trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g,kmlColor:/(\w{2})(\w{2})(\w{2})(\w{2})/,kmlIconPalette:/root:\/\/icons\/palette-(\d+)(\.\w+)/,straightBracket:/\$\[(.*?)\]/g};this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){this.features=[];this.styles={};this.fetched={};return this.parseData(a,{depth:0,styleBaseUrl:this.styleBaseUrl})},parseData:function(a,b){"string"==typeof a&&
                (a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var c=["Link","NetworkLink","Style","StyleMap","Placemark"],d=0,e=c.length;d<e;++d){var f=c[d],g=this.getElementsByTagNameNS(a,"*",f);if(0!=g.length)switch(f.toLowerCase()){case "link":case "networklink":this.parseLinks(g,b);break;case "style":this.extractStyles&&this.parseStyles(g,b);break;case "stylemap":this.extractStyles&&this.parseStyleMaps(g,b);break;case "placemark":this.parseFeatures(g,b)}}return this.features},parseLinks:function(a,
b){if(b.depth>=this.maxDepth)return!1;var c=OpenLayers.Util.extend({},b);c.depth++;for(var d=0,e=a.length;d<e;d++){var f=this.parseProperty(a[d],"*","href");f&&!this.fetched[f]&&(this.fetched[f]=!0,(f=this.fetchLink(f))&&this.parseData(f,c))}},fetchLink:function(a){if(a=OpenLayers.Request.GET({url:a,async:!1}))return a.responseText},parseStyles:function(a,b){for(var c=0,d=a.length;c<d;c++){var e=this.parseStyle(a[c]);e&&(this.styles[(b.styleBaseUrl||"")+"#"+e.id]=e)}},parseKmlColor:function(a){var b=
                null;a&&(a=a.match(this.regExes.kmlColor))&&(b={color:"#"+a[4]+a[3]+a[2],opacity:parseInt(a[1],16)/255});return b},parseStyle:function(a){for(var b={},c=["LineStyle","PolyStyle","IconStyle","BalloonStyle","LabelStyle"],d,e,f=0,g=c.length;f<g;++f)if(d=c[f],e=this.getElementsByTagNameNS(a,"*",d)[0])switch(d.toLowerCase()){case "linestyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.strokeColor=d.color,b.strokeOpacity=d.opacity;(d=this.parseProperty(e,"*","width"))&&(b.strokeWidth=
d);break;case "polystyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.fillOpacity=d.opacity,b.fillColor=d.color;"0"==this.parseProperty(e,"*","fill")&&(b.fillColor="none");"0"==this.parseProperty(e,"*","outline")&&(b.strokeWidth="0");break;case "iconstyle":var h=parseFloat(this.parseProperty(e,"*","scale")||1);d=32*h;var i=32*h,j=this.getElementsByTagNameNS(e,"*","Icon")[0];if(j){var k=this.parseProperty(j,"*","href");if(k){var l=this.parseProperty(j,"*","w"),m=this.parseProperty(j,
"*","h");OpenLayers.String.startsWith(k,"http://maps.google.com/mapfiles/kml")&&(!l&&!m)&&(m=l=64,h/=2);l=l||m;m=m||l;l&&(d=parseInt(l)*h);m&&(i=parseInt(m)*h);if(m=k.match(this.regExes.kmlIconPalette))l=m[1],m=m[2],k=this.parseProperty(j,"*","x"),j=this.parseProperty(j,"*","y"),k="http://maps.google.com/mapfiles/kml/pal"+l+"/icon"+(8*(j?7-j/32:7)+(k?k/32:0))+m;b.graphicOpacity=1;b.externalGraphic=k}}if(e=this.getElementsByTagNameNS(e,"*","hotSpot")[0])k=parseFloat(e.getAttribute("x")),j=parseFloat(e.getAttribute("y")),
                    l=e.getAttribute("xunits"),"pixels"==l?b.graphicXOffset=-k*h:"insetPixels"==l?b.graphicXOffset=-d+k*h:"fraction"==l&&(b.graphicXOffset=-d*k),e=e.getAttribute("yunits"),"pixels"==e?b.graphicYOffset=-i+j*h+1:"insetPixels"==e?b.graphicYOffset=-(j*h)+1:"fraction"==e&&(b.graphicYOffset=-i*(1-j)+1);b.graphicWidth=d;b.graphicHeight=i;break;case "balloonstyle":(e=OpenLayers.Util.getXmlNodeValue(e))&&(b.balloonStyle=e.replace(this.regExes.straightBracket,"${$1}"));break;case "labelstyle":if(d=this.parseProperty(e,
"*","color"),d=this.parseKmlColor(d))b.fontColor=d.color,b.fontOpacity=d.opacity}!b.strokeColor&&b.fillColor&&(b.strokeColor=b.fillColor);if((a=a.getAttribute("id"))&&b)b.id=a;return b},parseStyleMaps:function(a,b){for(var c=0,d=a.length;c<d;c++)for(var e=a[c],f=this.getElementsByTagNameNS(e,"*","Pair"),e=e.getAttribute("id"),g=0,h=f.length;g<h;g++){var i=f[g],j=this.parseProperty(i,"*","key");(i=this.parseProperty(i,"*","styleUrl"))&&"normal"==j&&(this.styles[(b.styleBaseUrl||"")+"#"+e]=this.styles[(b.styleBaseUrl||
"")+i])}},parseFeatures:function(a,b){for(var c=[],d=0,e=a.length;d<e;d++){var f=a[d],g=this.parseFeature.apply(this,[f]);if(g){this.extractStyles&&(g.attributes&&g.attributes.styleUrl)&&(g.style=this.getStyle(g.attributes.styleUrl,b));if(this.extractStyles){var h=this.getElementsByTagNameNS(f,"*","Style")[0];if(h&&(h=this.parseStyle(h)))g.style=OpenLayers.Util.extend(g.style,h)}if(this.extractTracks){if((f=this.getElementsByTagNameNS(f,this.namespaces.gx,"Track"))&&0<f.length)g={features:[],feature:g},
                    this.readNode(f[0],g),0<g.features.length&&c.push.apply(c,g.features)}else c.push(g)}else throw"Bad Placemark: "+d;}this.features=this.features.concat(c)},readers:{kml:{when:function(a,b){b.whens.push(OpenLayers.Date.parse(this.getChildValue(a)))},_trackPointAttribute:function(a,b){var c=a.nodeName.split(":").pop();b.attributes[c].push(this.getChildValue(a))}},gx:{Track:function(a,b){var c={whens:[],points:[],angles:[]};if(this.trackAttributes){var d;c.attributes={};for(var e=0,f=this.trackAttributes.length;e<
f;++e)d=this.trackAttributes[e],c.attributes[d]=[],d in this.readers.kml||(this.readers.kml[d]=this.readers.kml._trackPointAttribute)}this.readChildNodes(a,c);if(c.whens.length!==c.points.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:coord ("+c.points.length+") elements.");var g=0<c.angles.length;if(g&&c.whens.length!==c.angles.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:angles ("+c.angles.length+") elements.");for(var h,
i,e=0,f=c.whens.length;e<f;++e){h=b.feature.clone();h.fid=b.feature.fid||b.feature.id;i=c.points[e];h.geometry=i;"z"in i&&(h.attributes.altitude=i.z);this.internalProjection&&this.externalProjection&&h.geometry.transform(this.externalProjection,this.internalProjection);if(this.trackAttributes){i=0;for(var j=this.trackAttributes.length;i<j;++i)h.attributes[d]=c.attributes[this.trackAttributes[i]][e]}h.attributes.when=c.whens[e];h.attributes.trackId=b.feature.id;g&&(i=c.angles[e],h.attributes.heading=
parseFloat(i[0]),h.attributes.tilt=parseFloat(i[1]),h.attributes.roll=parseFloat(i[2]));b.features.push(h)}},coord:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/),d=new OpenLayers.Geometry.Point(c[0],c[1]);2<c.length&&(d.z=parseFloat(c[2]));b.points.push(d)},angles:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/);b.angles.push(c)}}},parseFeature:function(a){for(var b=["MultiGeometry","Polygon","LineString","Point"],
c,d,e,f=0,g=b.length;f<g;++f)if(c=b[f],this.internalns=a.namespaceURI?a.namespaceURI:this.kmlns,d=this.getElementsByTagNameNS(a,this.internalns,c),0<d.length){if(b=this.parseGeometry[c.toLowerCase()])e=b.apply(this,[d[0]]),this.internalProjection&&this.externalProjection&&e.transform(this.externalProjection,this.internalProjection);else throw new TypeError("Unsupported geometry type: "+c);break}var h;this.extractAttributes&&(h=this.parseAttributes(a));c=new OpenLayers.Feature.Vector(e,h);a=a.getAttribute("id")||
                    a.getAttribute("name");null!=a&&(c.fid=a);return c},getStyle:function(a,b){var c=OpenLayers.Util.removeTail(a),d=OpenLayers.Util.extend({},b);d.depth++;d.styleBaseUrl=c;!this.styles[a]&&!OpenLayers.String.startsWith(a,"#")&&d.depth<=this.maxDepth&&!this.fetched[c]&&(c=this.fetchLink(c))&&this.parseData(c,d);return OpenLayers.Util.extend({},this.styles[a])},parseGeometry:{point:function(a){var b=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),a=[];if(0<b.length)var c=b[0].firstChild.nodeValue,
                    c=c.replace(this.regExes.removeSpace,""),a=c.split(",");b=null;if(1<a.length)2==a.length&&(a[2]=null),b=new OpenLayers.Geometry.Point(a[0],a[1],a[2]);else throw"Bad coordinate string: "+c;return b},linestring:function(a,b){var c=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),d=null;if(0<c.length){for(var c=this.getChildValue(c[0]),c=c.replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),d=c.split(this.regExes.splitSpace),e=d.length,f=Array(e),g,h,i=0;i<e;++i)if(g=
d[i].split(","),h=g.length,1<h)2==g.length&&(g[2]=null),f[i]=new OpenLayers.Geometry.Point(g[0],g[1],g[2]);else throw"Bad LineString point coordinates: "+d[i];if(e)d=b?new OpenLayers.Geometry.LinearRing(f):new OpenLayers.Geometry.LineString(f);else throw"Bad LineString coordinates: "+c;}return d},polygon:function(a){var a=this.getElementsByTagNameNS(a,this.internalns,"LinearRing"),b=a.length,c=Array(b);if(0<b)for(var d=0,e=a.length;d<e;++d)if(b=this.parseGeometry.linestring.apply(this,[a[d],!0]))c[d]=
                        b;else throw"Bad LinearRing geometry: "+d;return new OpenLayers.Geometry.Polygon(c)},multigeometry:function(a){for(var b,c=[],d=a.childNodes,e=0,f=d.length;e<f;++e)a=d[e],1==a.nodeType&&(b=this.parseGeometry[(a.prefix?a.nodeName.split(":")[1]:a.nodeName).toLowerCase()])&&c.push(b.apply(this,[a]));return new OpenLayers.Geometry.Collection(c)}},parseAttributes:function(a){var b={},c=a.getElementsByTagName("ExtendedData");c.length&&(b=this.parseExtendedData(c[0]));for(var d,e,f,a=a.childNodes,c=0,g=
a.length;c<g;++c)if(d=a[c],1==d.nodeType&&(e=d.childNodes,1<=e.length&&3>=e.length)){switch(e.length){case 1:f=e[0];break;case 2:f=e[0];e=e[1];f=3==f.nodeType||4==f.nodeType?f:e;break;default:f=e[1]}if(3==f.nodeType||4==f.nodeType)if(d=d.prefix?d.nodeName.split(":")[1]:d.nodeName,f=OpenLayers.Util.getXmlNodeValue(f))f=f.replace(this.regExes.trimSpace,""),b[d]=f}return b},parseExtendedData:function(a){var b={},c,d,e,f,g=a.getElementsByTagName("Data");c=0;for(d=g.length;c<d;c++){e=g[c];f=e.getAttribute("name");
var h={},i=e.getElementsByTagName("value");i.length&&(h.value=this.getChildValue(i[0]));this.kvpAttributes?b[f]=h.value:(e=e.getElementsByTagName("displayName"),e.length&&(h.displayName=this.getChildValue(e[0])),b[f]=h)}a=a.getElementsByTagName("SimpleData");c=0;for(d=a.length;c<d;c++)h={},e=a[c],f=e.getAttribute("name"),h.value=this.getChildValue(e),this.kvpAttributes?b[f]=h.value:(h.displayName=f,b[f]=h);return b},parseProperty:function(a,b,c){var d,a=this.getElementsByTagNameNS(a,b,c);try{d=OpenLayers.Util.getXmlNodeValue(a[0])}catch(e){d=
    null}return d},write:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=this.createElementNS(this.kmlns,"kml"),c=this.createFolderXML(),d=0,e=a.length;d<e;++d)c.appendChild(this.createPlacemarkXML(a[d]));b.appendChild(c);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFolderXML:function(){var a=this.createElementNS(this.kmlns,"Folder");if(this.foldersName){var b=this.createElementNS(this.kmlns,"name"),c=this.createTextNode(this.foldersName);b.appendChild(c);a.appendChild(b)}this.foldersDesc&&
        (b=this.createElementNS(this.kmlns,"description"),c=this.createTextNode(this.foldersDesc),b.appendChild(c),a.appendChild(b));return a},createPlacemarkXML:function(a){var b=this.createElementNS(this.kmlns,"name");b.appendChild(this.createTextNode(a.style&&a.style.label?a.style.label:a.attributes.name||a.id));var c=this.createElementNS(this.kmlns,"description");c.appendChild(this.createTextNode(a.attributes.description||this.placemarksDesc));var d=this.createElementNS(this.kmlns,"Placemark");null!=
        a.fid&&d.setAttribute("id",a.fid);d.appendChild(b);d.appendChild(c);b=this.buildGeometryNode(a.geometry);d.appendChild(b);a.attributes&&(a=this.buildExtendedData(a.attributes))&&d.appendChild(a);return d},buildGeometryNode:function(a){var b=a.CLASS_NAME,b=this.buildGeometry[b.substring(b.lastIndexOf(".")+1).toLowerCase()],c=null;b&&(c=b.apply(this,[a]));return c},buildGeometry:{point:function(a){var b=this.createElementNS(this.kmlns,"Point");b.appendChild(this.buildCoordinatesNode(a));return b},multipoint:function(a){return this.buildGeometry.collection.apply(this,
[a])},linestring:function(a){var b=this.createElementNS(this.kmlns,"LineString");b.appendChild(this.buildCoordinatesNode(a));return b},multilinestring:function(a){return this.buildGeometry.collection.apply(this,[a])},linearring:function(a){var b=this.createElementNS(this.kmlns,"LinearRing");b.appendChild(this.buildCoordinatesNode(a));return b},polygon:function(a){for(var b=this.createElementNS(this.kmlns,"Polygon"),a=a.components,c,d,e=0,f=a.length;e<f;++e)c=0==e?"outerBoundaryIs":"innerBoundaryIs",
        c=this.createElementNS(this.kmlns,c),d=this.buildGeometry.linearring.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},multipolygon:function(a){return this.buildGeometry.collection.apply(this,[a])},collection:function(a){for(var b=this.createElementNS(this.kmlns,"MultiGeometry"),c,d=0,e=a.components.length;d<e;++d)(c=this.buildGeometryNode.apply(this,[a.components[d]]))&&b.appendChild(c);return b}},buildCoordinatesNode:function(a){var b=this.createElementNS(this.kmlns,"coordinates"),
        c;if(c=a.components){for(var d=c.length,e=Array(d),f=0;f<d;++f)a=c[f],e[f]=this.buildCoordinates(a);c=e.join(" ")}else c=this.buildCoordinates(a);c=this.createTextNode(c);b.appendChild(c);return b},buildCoordinates:function(a){this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));return a.x+","+a.y},buildExtendedData:function(a){var b=this.createElementNS(this.kmlns,"ExtendedData"),c;for(c in a)if(a[c]&&"name"!=c&&"description"!=
c&&"styleUrl"!=c){var d=this.createElementNS(this.kmlns,"Data");d.setAttribute("name",c);var e=this.createElementNS(this.kmlns,"value");if("object"==typeof a[c]){if(a[c].value&&e.appendChild(this.createTextNode(a[c].value)),a[c].displayName){var f=this.createElementNS(this.kmlns,"displayName");f.appendChild(this.getXMLDoc().createCDATASection(a[c].displayName));d.appendChild(f)}}else e.appendChild(this.createTextNode(a[c]));d.appendChild(e);b.appendChild(d)}return this.isSimpleContent(b)?null:b},
                                                                      CLASS_NAME:"OpenLayers.Format.KML"});

        _kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>WVMR2018</name>
    <description/>
    <Style id="poly-000000-1200-77-nodesc-normal">
      <LineStyle>
        <color>ff000000</color>
        <width>1.2</width>
      </LineStyle>
      <PolyStyle>
        <color>4d000000</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="poly-000000-1200-77-nodesc-highlight">
      <LineStyle>
        <color>ff000000</color>
        <width>1.8</width>
      </LineStyle>
      <PolyStyle>
        <color>4d000000</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="poly-000000-1200-77-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-000000-1200-77-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-000000-1200-77-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="poly-000000-2000-0-normal">
      <LineStyle>
        <color>ff000000</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>00000000</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <Style id="poly-000000-2000-0-highlight">
      <LineStyle>
        <color>ff000000</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>00000000</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <StyleMap id="poly-000000-2000-0">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-000000-2000-0-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-000000-2000-0-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="poly-A1C2FA-1200-77-nodesc-normal">
      <LineStyle>
        <color>fffac2a1</color>
        <width>1.2</width>
      </LineStyle>
      <PolyStyle>
        <color>4dfac2a1</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="poly-A1C2FA-1200-77-nodesc-highlight">
      <LineStyle>
        <color>fffac2a1</color>
        <width>1.8</width>
      </LineStyle>
      <PolyStyle>
        <color>4dfac2a1</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="poly-A1C2FA-1200-77-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-A1C2FA-1200-77-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-A1C2FA-1200-77-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="poly-CE93D8-1200-77-nodesc-normal">
      <LineStyle>
        <color>ffd893ce</color>
        <width>1.2</width>
      </LineStyle>
      <PolyStyle>
        <color>4dd893ce</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="poly-CE93D8-1200-77-nodesc-highlight">
      <LineStyle>
        <color>ffd893ce</color>
        <width>1.8</width>
      </LineStyle>
      <PolyStyle>
        <color>4dd893ce</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="poly-CE93D8-1200-77-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-CE93D8-1200-77-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-CE93D8-1200-77-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="poly-F48FB1-1200-77-nodesc-normal">
      <LineStyle>
        <color>ffb18ff4</color>
        <width>1.2</width>
      </LineStyle>
      <PolyStyle>
        <color>4db18ff4</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="poly-F48FB1-1200-77-nodesc-highlight">
      <LineStyle>
        <color>ffb18ff4</color>
        <width>1.8</width>
      </LineStyle>
      <PolyStyle>
        <color>4db18ff4</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="poly-F48FB1-1200-77-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-F48FB1-1200-77-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-F48FB1-1200-77-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="poly-FADA80-1200-77-nodesc-normal">
      <LineStyle>
        <color>ff80dafa</color>
        <width>1.2</width>
      </LineStyle>
      <PolyStyle>
        <color>4d80dafa</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="poly-FADA80-1200-77-nodesc-highlight">
      <LineStyle>
        <color>ff80dafa</color>
        <width>1.8</width>
      </LineStyle>
      <PolyStyle>
        <color>4d80dafa</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="poly-FADA80-1200-77-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#poly-FADA80-1200-77-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#poly-FADA80-1200-77-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Folder>
      <name>Group 1</name>
      <Placemark>
        <name>Morgantown</name>
        <styleUrl>#poly-CE93D8-1200-77-nodesc</styleUrl>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing>
              <tessellate>1</tessellate>
              <coordinates>
                -81.0790092,39.5070295,0
                -79.9754089,38.7940213,0
                -78.8874035,39.270106,0
                -79.1536834,39.4112557,0
                -79.4869571,39.205194,0
                -79.4767589,39.720313,0
                -80.5194274,39.720636,0
                -80.5190792,40.638034,0
                -80.6659783,40.5869608,0
                -80.6044787,40.4490158,0
                -80.8760748,39.6263313,0
                -81.0790092,39.5070295,0
              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    </Folder>
    <Folder>
      <name>Group 2</name>
      <Placemark>
        <name>Parkersburg</name>
        <styleUrl>#poly-A1C2FA-1200-77-nodesc</styleUrl>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing>
              <tessellate>1</tessellate>
              <coordinates>
                -81.8379481,38.9340525,0
                -80.934687,38.3298255,0
                -80.6540282,38.2133711,0
                -79.9754947,38.7940046,0
                -81.0790092,39.5070295,0
                -81.356986,39.3424096,0
                -81.4466171,39.4096054,0
                -81.5572929,39.3391523,0
                -81.5699866,39.2680526,0
                -81.6558789,39.277728,0
                -81.6955432,39.2529737,0
                -81.6900035,39.2348238,0
                -81.6940772,39.2219922,0
                -81.7200707,39.2170724,0
                -81.7332712,39.197386,0
                -81.7555478,39.1808917,0
                -81.7432943,39.1423013,0
                -81.7469782,39.0957461,0
                -81.7725312,39.0779451,0
                -81.7812876,39.0334831,0
                -81.7648248,39.0192196,0
                -81.765888,38.9906842,0
                -81.7815337,38.9653013,0
                -81.7558418,38.9339127,0
                -81.762369,38.9244883,0
                -81.7848637,38.9256894,0
                -81.812257,38.9453254,0
                -81.8284509,38.944563,0
                -81.8379481,38.9340525,0
              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    </Folder>
    <Folder>
      <name>Group 3</name>
      <Placemark>
        <name>Charleston</name>
        <styleUrl>#poly-F48FB1-1200-77-nodesc</styleUrl>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing>
              <tessellate>1</tessellate>
              <coordinates>
                -81.8379481,38.9340525,0
                -81.8420086,38.9281314,0
                -81.8473525,38.9067202,0
                -81.8655693,38.8862796,0
                -81.8951048,38.8741184,0
                -81.9251772,38.8892154,0
                -81.9280603,38.8957294,0
                -81.9242145,38.9044413,0
                -81.911646,38.9159233,0
                -81.975164,38.991981,0
                -82.0067826,39.0299322,0
                -82.0239137,39.0296405,0
                -82.0397344,39.0209434,0
                -82.0445864,39.0022186,0
                -82.0734372,38.9831024,0
                -82.1457839,38.8864052,0
                -82.1392102,38.8716187,0
                -82.1398478,38.8517534,0
                -82.153478,38.831004,0
                -82.1905091,38.8132907,0
                -82.2216301,38.7864173,0
                -82.2163125,38.768693,0
                -82.197372,38.7568171,0
                -82.1819978,38.7069224,0
                -82.1910634,38.6842728,0
                -82.1721304,38.6183804,0
                -82.1767502,38.6004038,0
                -82.220535,38.5912344,0
                -82.2715331,38.5944793,0
                -82.324061,38.4483641,0
                -82.5498581,38.4022978,0
                -82.5937316,38.4209048,0
                -82.5906938,38.3408231,0
                -82.5773293,38.328798,0
                -82.5713497,38.3154255,0
                -82.5825247,38.2989656,0
                -82.5784387,38.2819365,0
                -82.5742561,38.2749108,0
                -82.5737519,38.2659327,0
                -82.5848394,38.2461818,0
                -82.6022928,38.2470457,0
                -82.6118749,38.2317862,0
                -82.5980882,38.2175815,0
                -82.5993723,38.1968869,0
                -82.6038089,38.1887891,0
                -82.6127825,38.1706357,0
                -82.6377165,38.171305,0
                -82.6436858,38.1676497,0
                -82.6419772,38.1611169,0
                -82.6386717,38.153243,0
                -82.634208,38.1376736,0
                -82.6211184,38.1329934,0
                -82.6176412,38.1208307,0
                -82.6043366,38.1205408,0
                -82.5854528,38.1079057,0
                -82.5846328,38.1024229,0
                -82.5847092,38.0966236,0
                -82.5840038,38.0919822,0
                -82.5731097,38.0823265,0
                -82.5668569,38.0816257,0
                -82.5639634,38.0792445,0
                -82.5604946,38.0737387,0
                -82.5504669,38.0701591,0
                -82.5489579,38.0635215,0
                -82.5445311,38.0590462,0
                -82.5444159,38.0544534,0
                -82.5371437,38.0431414,0
                -82.5378379,38.0361264,0
                -82.5340334,38.0313907,0
                -82.5260819,38.0265837,0
                -82.525971,38.0203833,0
                -82.5215439,38.0112272,0
                -82.5162083,38.0068779,0
                -82.5154935,38.0051448,0
                -82.5189111,38.0021642,0
                -82.5168355,37.9996909,0
                -82.5005832,37.9989369,0
                -82.4873469,37.998139,0
                -82.486838,37.9921808,0
                -82.4828171,37.9839165,0
                -82.474175,37.9864633,0
                -82.4654292,37.984251,0
                -82.4643316,37.9810439,0
                -82.4687459,37.9732092,0
                -82.4830666,37.9720187,0
                -82.4842854,37.9640548,0
                -82.4717037,37.9596294,0
                -82.4734473,37.9567336,0
                -82.4777068,37.9525662,0
                -82.4819337,37.9485624,0
                -82.4870403,37.9455292,0
                -82.4975964,37.9458923,0
                -82.4965639,37.9414745,0
                -82.4909812,37.9390016,0
                -82.4917464,37.9358836,0
                -82.4986836,37.9370938,0
                -82.4982243,37.9280065,0
                -82.4892814,37.9264504,0
                -82.4803643,37.9252333,0
                -82.4881939,37.9178571,0
                -82.4804223,37.9150208,0
                -82.4746919,37.909433,0
                -82.4747328,37.9051646,0
                -82.4700944,37.9007248,0
                -82.4693139,37.9110778,0
                -82.4675805,37.9135673,0
                -82.4630833,37.9147541,0
                -82.459582,37.910085,0
                -82.4530941,37.9088721,0
                -82.4380551,37.8996099,0
                -82.434604,37.8947492,0
                -82.4317354,37.8901074,0
                -82.4229236,37.8858282,0
                -82.4189317,37.8828316,0
                -82.4190164,37.8781933,0
                -82.4184996,37.8737943,0
                -82.4180616,37.8713741,0
                -82.4148392,37.8689781,0
                -82.4101578,37.8684791,0
                -82.4085199,37.8670744,0
                -82.4121821,37.8647772,0
                -82.4237101,37.8632348,0
                -82.4231328,37.8605109,0
                -82.416715,37.8555511,0
                -82.417847,37.8514254,0
                -82.3576905,37.7938226,0
                -82.3482912,37.7878115,0
                -82.3395366,37.7848606,0
                -82.3379916,37.7767203,0
                -82.3335288,37.7745496,0
                -82.3264045,37.7757708,0
                -82.3234857,37.7750922,0
                -82.3229696,37.7733281,0
                -82.325886,37.7706142,0
                -82.3303453,37.7687145,0
                -82.3334275,37.7655937,0
                -82.3306737,37.762882,0
                -82.3269672,37.762436,0
                -82.3190484,37.764995,0
                -82.3127444,37.7652079,0
                -82.311123,37.7631233,0
                -82.3127724,37.7615325,0
                -82.3174445,37.7598437,0
                -82.3204799,37.7572802,0
                -82.3217443,37.7510846,0
                -82.3274915,37.7489061,0
                -82.3214372,37.734664,0
                -82.3187414,37.7321055,0
                -82.3164643,37.7228815,0
                -82.3113123,37.7176363,0
                -82.3110958,37.7131379,0
                -82.3059637,37.706364,0
                -82.301493,37.7059211,0
                -82.2974223,37.7029643,0
                -82.2968339,37.7012268,0
                -82.2978244,37.6995513,0
                -82.3012644,37.6974738,0
                -82.3032091,37.6943543,0
                -82.3013373,37.6903394,0
                -82.2974005,37.6871654,0
                -82.2969942,37.6848673,0
                -82.2993143,37.6822662,0
                -82.2973241,37.6775735,0
                -82.294851,37.6778611,0
                -82.2943092,37.6764505,0
                -82.2946848,37.6712853,0
                -82.2903939,37.6687038,0
                -82.2876911,37.6683642,0
                -82.2821813,37.6745637,0
                -82.2698292,37.6644953,0
                -82.2584304,37.6579462,0
                -82.2541726,37.6577574,0
                -82.247714,37.6602339,0
                -82.2402895,37.6619248,0
                -82.2348441,37.6600433,0
                -82.2274262,37.6542733,0
                -82.2239188,37.6508876,0
                -82.2230843,37.6453393,0
                -82.2154079,37.641174,0
                -82.2155893,37.637057,0
                -82.2174972,37.6334447,0
                -82.2141037,37.6266277,0
                -82.2109219,37.6253653,0
                -82.2038723,37.6267825,0
                -82.1966401,37.6277129,0
                -82.1923042,37.6264462,0
                -82.1872374,37.6285345,0
                -82.1903162,37.6465127,0
                -82.1873763,37.6489555,0
                -82.1780628,37.649762,0
                -82.1743704,37.6482482,0
                -82.1740244,37.6459,0
                -82.1753934,37.6432425,0
                -82.176446,37.6395188,0
                -82.1720063,37.6337553,0
                -82.173255,37.6303848,0
                -82.1826185,37.6247318,0
                -82.1777415,37.6190665,0
                -82.1755406,37.6191571,0
                -82.1663317,37.622057,0
                -82.164222,37.6199705,0
                -82.1713331,37.6123985,0
                -82.1671884,37.6067722,0
                -82.1576957,37.6075551,0
                -82.1575936,37.5922563,0
                -82.1479489,37.5898112,0
                -82.1463404,37.5911778,0
                -82.1408917,37.5943183,0
                -82.1341986,37.5927788,0
                -82.1311123,37.5909238,0
                -82.1266586,37.5763306,0
                -82.1309694,37.5719028,0
                -82.1057812,37.5565136,0
                -80.934687,38.3298255,0
                -81.8379481,38.9340525,0
              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    </Folder>
    <Folder>
      <name>Group 4</name>
      <Placemark>
        <name>Beckley</name>
        <styleUrl>#poly-FADA80-1200-77-nodesc</styleUrl>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing>
              <tessellate>1</tessellate>
              <coordinates>
                -80.934687,38.3298255,0
                -82.1058668,37.5567155,0
                -82.077558,37.5394584,0
                -81.969343,37.5335557,0
                -81.9957126,37.4690636,0
                -81.9840722,37.4547942,0
                -81.9780325,37.45662,0
                -81.9752422,37.4563344,0
                -81.9737816,37.4551669,0
                -81.9728775,37.4535134,0
                -81.9692242,37.4513647,0
                -81.9704459,37.4493448,0
                -81.9707007,37.4479797,0
                -81.969365,37.4466462,0
                -81.9674232,37.446773,0
                -81.9569947,37.4477248,0
                -81.9486909,37.4442964,0
                -81.945859,37.4401824,0
                -81.9421479,37.4393652,0
                -81.9370428,37.4391959,0
                -81.9366602,37.4385166,0
                -81.9355947,37.4378736,0
                -81.9359239,37.4366939,0
                -81.9376264,37.4362638,0
                -81.9384283,37.4347482,0
                -81.9370281,37.4329435,0
                -81.9382189,37.4326055,0
                -81.9394417,37.4308732,0
                -81.9407285,37.4288739,0
                -81.9393111,37.4220978,0
                -81.9329364,37.4152589,0
                -81.9313829,37.4146926,0
                -81.9283274,37.4144839,0
                -81.9279326,37.4130481,0
                -81.9245088,37.4104989,0
                -81.9246041,37.4095517,0
                -81.9250093,37.4075552,0
                -81.9278367,37.4070392,0
                -81.9303584,37.4054618,0
                -81.9312176,37.4016761,0
                -81.9283444,37.3986216,0
                -81.930194,37.3974902,0
                -81.929387,37.3939999,0
                -81.9300904,37.393054,0
                -81.9327753,37.3918959,0
                -81.8620981,37.30493,0
                -81.8539667,37.3007305,0
                -81.815946,37.2806163,0
                -81.8150039,37.2803221,0
                -81.8134838,37.2810033,0
                -81.8101001,37.2825363,0
                -81.807195,37.2832802,0
                -81.8054616,37.2849386,0
                -81.8041406,37.2859336,0
                -81.7931299,37.2832449,0
                -81.7896279,37.2849011,0
                -81.7826926,37.2830059,0
                -81.7795332,37.2802672,0
                -81.776889,37.2762992,0
                -81.7692823,37.2738061,0
                -81.7549183,37.2766852,0
                -81.7553776,37.2700144,0
                -81.7545811,37.2681474,0
                -81.7456777,37.2640248,0
                -81.7400487,37.257888,0
                -81.7411063,37.2507233,0
                -81.7435699,37.242956,0
                -81.7364408,37.2385263,0
                -81.7334305,37.2382366,0
                -81.7308492,37.2402018,0
                -81.7295492,37.2401689,0
                -81.7282365,37.2396931,0
                -81.7245384,37.2406208,0
                -81.722807,37.240426,0
                -81.7221766,37.2387382,0
                -81.72083,37.2390868,0
                -81.7196817,37.2386223,0
                -81.7184151,37.2355751,0
                -81.7165687,37.234674,0
                -81.7162234,37.233965,0
                -81.7163054,37.2315906,0
                -81.7156112,37.2305319,0
                -81.7159393,37.2290296,0
                -81.7116321,37.2273617,0
                -81.7107153,37.2257279,0
                -81.7085385,37.2254673,0
                -81.707704,37.223921,0
                -81.7062066,37.2243822,0
                -81.7041562,37.2230492,0
                -81.7040895,37.2216134,0
                -81.699236,37.2189466,0
                -81.6888777,37.2135162,0
                -81.687255,37.2134692,0
                -81.6867563,37.2132386,0
                -81.6865098,37.2123845,0
                -81.5584228,37.2074359,0
                -81.4735258,37.2563969,0
                -81.4735778,37.2569195,0
                -81.4732837,37.2570711,0
                -81.4726387,37.2570312,0
                -81.4720193,37.2569055,0
                -81.4714227,37.2569076,0
                -81.4713126,37.256955,0
                -81.4706211,37.2572567,0
                -81.4702487,37.2574069,0
                -81.4595199,37.2635416,0
                -81.4605463,37.2654128,0
                -81.4603879,37.2656101,0
                -81.4597224,37.2655307,0
                -81.4588849,37.2665333,0
                -81.4570061,37.2669246,0
                -81.4563277,37.2668706,0
                -81.4553035,37.2671125,0
                -81.454239,37.2670385,0
                -81.4535286,37.2673573,0
                -81.4526664,37.2684574,0
                -81.4508776,37.2691121,0
                -81.4490546,37.2696537,0
                -81.4482777,37.2706308,0
                -81.4482366,37.2712787,0
                -81.448455,37.2717633,0
                -81.4483337,37.2720752,0
                -81.4476727,37.2723063,0
                -81.4469515,37.2720172,0
                -81.4463246,37.2721048,0
                -81.4460041,37.2722971,0
                -81.4454167,37.272434,0
                -81.4449287,37.2723665,0
                -81.4446928,37.2718814,0
                -81.4021023,37.296043,0
                -81.4047762,37.2986855,0
                -81.4024742,37.3008638,0
                -81.402065,37.30167,0
                -81.3983178,37.3029579,0
                -81.3967243,37.3045524,0
                -81.3971635,37.3063247,0
                -81.3985355,37.3079749,0
                -81.3979323,37.3093636,0
                -81.3983672,37.3104428,0
                -81.3964046,37.3112699,0
                -81.3951616,37.3128047,0
                -81.3952291,37.3144747,0
                -81.3925532,37.3159119,0
                -81.3909322,37.3168215,0
                -81.3894935,37.3177139,0
                -81.3895774,37.3182531,0
                -81.3895122,37.318541,0
                -81.3884598,37.3196309,0
                -81.3880718,37.319763,0
                -81.387124,37.3203344,0
                -81.3865857,37.3205087,0
                -81.3858631,37.3201662,0
                -81.3857268,37.3196688,0
                -81.3847963,37.3185697,0
                -81.3834903,37.3186906,0
                -81.3808462,37.3178831,0
                -81.3764056,37.3178602,0
                -81.3700964,37.3219095,0
                -81.3624476,37.3377904,0
                -81.321265,37.3003758,0
                -81.2936713,37.2817961,0
                -81.225152,37.2350517,0
                -81.1731459,37.2597867,0
                -81.0984513,37.2797135,0
                -80.8609857,37.3238232,0
                -80.8452759,37.3964369,0
                -80.7620393,37.3655397,0
                -80.5170821,37.4953096,0
                -80.4695127,37.4226185,0
                -80.2824999,37.5328063,0
                -80.3201035,37.5623936,0
                -80.2149516,37.6240074,0
                -80.2923732,37.6830213,0
                -80.1624209,37.8744793,0
                -80.6540282,38.2133711,0
                -80.934687,38.3298255,0
              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    </Folder>
  </Document>
</kml>`;
    }
})();
