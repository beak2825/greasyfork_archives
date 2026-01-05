// ==UserScript==
// @name                WME Geo Places
// @version             0.2.2 Alpha
// @description         Import geometry KML files into Waze Map Editor with house numbers displayed as points.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @author              DauserShenkt
// @contributor         Timbones, wlodek76
// @namespace           https://greasyfork.org/en/users/19200
// @downloadURL https://update.greasyfork.org/scripts/13560/WME%20Geo%20Places.user.js
// @updateURL https://update.greasyfork.org/scripts/13560/WME%20Geo%20Places.meta.js
// ==/UserScript==
/*

    Derived work from wlodek76 - WME Road History https://greasyfork.org/en/scripts/8593-wme-road-history & Timbones  WME Geometries https://greasyfork.org/en/scripts/8129-wme-geometries

*/

(function()
{

  var geolist;
  
  var formathelp = 'GeoJSON, GML, WKT';
  var formats = { 'GEOJSON': new OpenLayers.Format.GeoJSON(), 
                  'GML': new OpenLayers.Format.GML(), 
                  'WKT': new OpenLayers.Format.WKT() };
  patchOpenLayers();  // patch adds KML, GPX and TXT formats

  var EPSG_4326 = new OpenLayers.Projection("EPSG:4326");  // lat,lon
  var EPSG_4269 = new OpenLayers.Projection("EPSG:4269");  // NAD 83
  var EPSG_3857 = new OpenLayers.Projection("EPSG:3857");  // WGS 84
  
  var colorlist = [ "navy", "purple", "darkgreen", "darkred", "teal", "darkslategray" ];
  var layerindex = 0;
  
  var namelist = [ "name", "Name", "NAME", "NAME0" ];
  
  // delayed initialisation
  setTimeout(init, 654);
  Waze.loginManager.events.register("login", null, init);

  // add interface to Settings tab
  function init()
  {
    var geobox = document.createElement('div');
    geobox.style.paddingTop = '6px';
    $("#sidepanel-areas").append(geobox);

    var geotitle = document.createElement('h4');
    geotitle.innerHTML = 'Import Geometry File';        
    geobox.appendChild(geotitle);

    geolist = document.createElement('ul');
    geobox.appendChild(geolist);
    
    var geoform = document.createElement('form');
    geobox.appendChild(geoform);
    
    var inputfile = document.createElement('input');
    inputfile.type = 'file';
    inputfile.id = 'GeometryFile';
    inputfile.title = '.geojson, .gml or .wkt';
    inputfile.addEventListener('change', addGeometryLayer, false);
    geoform.appendChild(inputfile);

    var notes = document.createElement('p');
    notes.innerHTML = '<b>Formats:</b> ' + formathelp + '<br> '
                    + '<b>Coordinates:</b> EPSG:4326, EPSG:3857';
    geoform.appendChild(notes);            

    var inputadd = document.createElement('input');
    inputadd.type = 'button';
    inputadd.value = 'Clear All';
    inputadd.onclick = removeGeometryLayers;        
    geoform.appendChild(inputadd);
    
    console.log("WME Geometries initialised");
  }

  // import selected file as a vector layer
  function addGeometryLayer() {
    // get the selected file from user
    var fileList = document.getElementById('GeometryFile');
    file = fileList.files[0];
    fileList.value = '';
    
    var fileext = file.name.split('.').pop();
    var filename = file.name.replace('.' + fileext, '');
    fileext = fileext.toUpperCase();
    
    // add list item
    color = colorlist[(layerindex++) % colorlist.length];
    var fileitem = document.createElement('li');
    fileitem.id = file.name;
    fileitem.style.color = color;
    fileitem.innerHTML = 'Loading...';
    geolist.appendChild(fileitem);

    // check if format is supported
    var parser = formats[fileext];
    if (typeof parser == 'undefined') {
       fileitem.innerHTML = fileext.toUpperCase() + ' format not supported :(';
       fileitem.style.color = 'red';
       return;
    }
    parser.internalProjection = Waze.map.getProjectionObject();
    parser.externalProjection = EPSG_4326;
    
    // add a new layer for the geometry
    var layerid = 'wme_geometry_'+layerindex;
    var WME_Geometry = new OL.Layer.Vector("Geometry: " + filename, 
      { rendererOptions: { zIndexing: true }, 
        uniqueName: layerid,
        shortcutKey: "S+" + layerindex,
        layerGroup: 'wme_geometry'
      }
    ); 
    
    var layerStyle = { 
      strokeColor: color, 
      strokeOpacity: 0.5,
      strokeWidth: 3,
      fillColor: color,
      fillOpacity: 0.02,
      pointRadius: 6,
      fontColor: 'white',
      labelOutlineColor: color,
      labelOutlineWidth: 4,
      labelAlign: 'left'
    };
    WME_Geometry.setZIndex(-9999);
    WME_Geometry.displayInLayerSwitcher = true;
    
    // hack in translation:
    I18n.translations[I18n.locale].layers.name[layerid] = "WME Geometries: " + filename; 
    
    // read the file into the new layer
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        if (/"EPSG:3857"|:EPSG::3857"/.test(e.target.result)) {
          parser.externalProjection = EPSG_3857;
        }
        else if (/"EPSG:4269"|:EPSG::4269"/.test(e.target.result)) {
          parser.externalProjection = EPSG_4269;
        }
       
        // load geometry files
        var features = parser.read(e.target.result);
                       
        // detect bad data
        if (features.length === 0) {
           fileitem.innerHTML = 'No features loaded :(';
           fileitem.style.color = 'red';
           WME_Geometry.destroy();
		   return;
        }

        // check which attribute can be used for labels
        if (features.length < 3000) {
            for (var i = 0; i < namelist.length; i++) {
                var name = namelist[i];
                if (typeof features[0].attributes[name] == 'string') {
                    if (/^Style/.test(features[0].attributes[name]) === false) {
                        layerStyle.label = '${'+name+'}';
                        break;
                    }
                }
            }
        }
        WME_Geometry.styleMap = new OpenLayers.StyleMap(layerStyle);  
        
        // add data to the map
        WME_Geometry.addFeatures(features);
        Waze.map.addLayer(WME_Geometry);
    
        fileitem.innerHTML = filename;
        fileitem.title = fileext.toUpperCase() + " " + parser.externalProjection.projCode
                       + ": " + features.length + " features loaded";

        console.log("WME Geometries: Loaded " + fileitem.title);
      };
    })(file);
    
    reader.readAsText(file);
  }
  
  // clear all
  function removeGeometryLayers() {
    var layers = Waze.map.getLayersBy("layerGroup","wme_geometry");
    for (i = 0; i < layers.length; i++) {
      layers[i].destroy();
    }
    geolist.innerHTML = '';
    layerindex = 0;
    return false;
  }
  
  // ------------------------------------------------------------------------------------
  
  // replace missing functions in OpenLayers 2.12
  function patchOpenLayers() {
    if (OpenLayers.VERSION_NUMBER != 'Release 2.12') {
      console.log("WME Geometries: OpenLayers version mismatch - cannot apply patch");
      return;
    }
    
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
    OpenLayers.Format.GPX=OpenLayers.Class(OpenLayers.Format.XML,{defaultDesc:"No description available",extractWaypoints:!0,extractTracks:!0,extractRoutes:!0,extractAttributes:!0,namespaces:{gpx:"http://www.topografix.com/GPX/1/1",xsi:"http://www.w3.org/2001/XMLSchema-instance"},schemaLocation:"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",creator:"OpenLayers",initialize:function(a){this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,
[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=[];if(this.extractTracks)for(var c=a.getElementsByTagName("trk"),d=0,e=c.length;d<e;d++){var f={};this.extractAttributes&&(f=this.parseAttributes(c[d]));for(var g=this.getElementsByTagNameNS(c[d],c[d].namespaceURI,"trkseg"),h=0,i=g.length;h<i;h++){var j=this.extractSegment(g[h],"trkpt");b.push(new OpenLayers.Feature.Vector(j,f))}}if(this.extractRoutes){e=a.getElementsByTagName("rte");c=0;for(d=
e.length;c<d;c++)f={},this.extractAttributes&&(f=this.parseAttributes(e[c])),g=this.extractSegment(e[c],"rtept"),b.push(new OpenLayers.Feature.Vector(g,f))}if(this.extractWaypoints){a=a.getElementsByTagName("wpt");c=0;for(e=a.length;c<e;c++)f={},this.extractAttributes&&(f=this.parseAttributes(a[c])),d=new OpenLayers.Geometry.Point(a[c].getAttribute("lon"),a[c].getAttribute("lat")),b.push(new OpenLayers.Feature.Vector(d,f))}if(this.internalProjection&&this.externalProjection){f=0;for(a=b.length;f<
a;f++)b[f].geometry.transform(this.externalProjection,this.internalProjection)}return b},extractSegment:function(a,b){for(var c=this.getElementsByTagNameNS(a,a.namespaceURI,b),d=[],e=0,f=c.length;e<f;e++)d.push(new OpenLayers.Geometry.Point(c[e].getAttribute("lon"),c[e].getAttribute("lat")));return new OpenLayers.Geometry.LineString(d)},parseAttributes:function(a){for(var b={},a=a.firstChild,c,d;a;){if(1==a.nodeType&&a.firstChild&&(c=a.firstChild,3==c.nodeType||4==c.nodeType))d=a.prefix?a.nodeName.split(":")[1]:
a.nodeName,"trkseg"!=d&&"rtept"!=d&&(b[d]=c.nodeValue);a=a.nextSibling}return b},write:function(a,b){var a=OpenLayers.Util.isArray(a)?a:[a],c=this.createElementNS(this.namespaces.gpx,"gpx");c.setAttribute("version","1.1");c.setAttribute("creator",this.creator);this.setAttributes(c,{"xsi:schemaLocation":this.schemaLocation});b&&"object"==typeof b&&c.appendChild(this.buildMetadataNode(b));for(var d=0,e=a.length;d<e;d++)c.appendChild(this.buildFeatureNode(a[d]));return OpenLayers.Format.XML.prototype.write.apply(this,
[c])},buildMetadataNode:function(a){for(var b=["name","desc","author"],c=this.createElementNSPlus("gpx:metadata"),d=0;d<b.length;d++){var e=b[d];if(a[e]){var f=this.createElementNSPlus("gpx:"+e);f.appendChild(this.createTextNode(a[e]));c.appendChild(f)}}return c},buildFeatureNode:function(a){var b=a.geometry,b=b.clone();this.internalProjection&&this.externalProjection&&b.transform(this.internalProjection,this.externalProjection);if("OpenLayers.Geometry.Point"==b.CLASS_NAME){var c=this.buildWptNode(b);
this.appendAttributesNode(c,a);return c}c=this.createElementNSPlus("gpx:trk");this.appendAttributesNode(c,a);for(var a=this.buildTrkSegNode(b),a=OpenLayers.Util.isArray(a)?a:[a],b=0,d=a.length;b<d;b++)c.appendChild(a[b]);return c},buildTrkSegNode:function(a){var b,c,d,e;if("OpenLayers.Geometry.LineString"==a.CLASS_NAME||"OpenLayers.Geometry.LinearRing"==a.CLASS_NAME){b=this.createElementNSPlus("gpx:trkseg");c=0;for(d=a.components.length;c<d;c++)e=a.components[c],b.appendChild(this.buildTrkPtNode(e));
return b}b=[];c=0;for(d=a.components.length;c<d;c++)b.push(this.buildTrkSegNode(a.components[c]));return b},buildTrkPtNode:function(a){var b=this.createElementNSPlus("gpx:trkpt");b.setAttribute("lon",a.x);b.setAttribute("lat",a.y);return b},buildWptNode:function(a){var b=this.createElementNSPlus("gpx:wpt");b.setAttribute("lon",a.x);b.setAttribute("lat",a.y);return b},appendAttributesNode:function(a,b){var c=this.createElementNSPlus("gpx:name");c.appendChild(this.createTextNode(b.attributes.name||
b.id));a.appendChild(c);c=this.createElementNSPlus("gpx:desc");c.appendChild(this.createTextNode(b.attributes.description||this.defaultDesc));a.appendChild(c)},CLASS_NAME:"OpenLayers.Format.GPX"});
    OpenLayers.Format.Text=OpenLayers.Class(OpenLayers.Format,{defaultStyle:null,extractStyles:!0,initialize:function(a){a=a||{};!1!==a.extractStyles&&(a.defaultStyle={externalGraphic:OpenLayers.Util.getImageLocation("marker.png"),graphicWidth:21,graphicHeight:25,graphicXOffset:-10.5,graphicYOffset:-12.5});OpenLayers.Format.prototype.initialize.apply(this,[a])},read:function(a){for(var a=a.split("\n"),b,c=[],d=0;d<a.length-1;d++){var e=a[d].replace(/^\s*/,"").replace(/\s*$/,"");if("#"!=e.charAt(0))if(b){for(var e=
e.split("\t"),f=new OpenLayers.Geometry.Point(0,0),g={},h=this.defaultStyle?OpenLayers.Util.applyDefaults({},this.defaultStyle):null,i=!1,j=0;j<e.length;j++)if(e[j])if("point"==b[j])i=e[j].split(","),f.y=parseFloat(i[0]),f.x=parseFloat(i[1]),i=!0;else if("lat"==b[j])f.y=parseFloat(e[j]),i=!0;else if("lon"==b[j])f.x=parseFloat(e[j]),i=!0;else if("title"==b[j])g.title=e[j];else if("image"==b[j]||"icon"==b[j]&&h)h.externalGraphic=e[j];else if("iconSize"==b[j]&&h){var k=e[j].split(",");h.graphicWidth=
parseFloat(k[0]);h.graphicHeight=parseFloat(k[1])}else"iconOffset"==b[j]&&h?(k=e[j].split(","),h.graphicXOffset=parseFloat(k[0]),h.graphicYOffset=parseFloat(k[1])):"description"==b[j]?g.description=e[j]:"overflow"==b[j]?g.overflow=e[j]:g[b[j]]=e[j];i&&(this.internalProjection&&this.externalProjection&&f.transform(this.externalProjection,this.internalProjection),e=new OpenLayers.Feature.Vector(f,g,h),c.push(e))}else b=e.split("\t")}return c},CLASS_NAME:"OpenLayers.Format.Text"});

    formathelp += ', KML, GPX'; //, <span title="Tab Separated Values \nsee OpenLayers.Layer.Text">TXT</span>';
    formats['KML'] = new OpenLayers.Format.KML();
    formats['GPX'] = new OpenLayers.Format.GPX();
    //formats['TXT'] = new OpenLayers.Format.Text(); 
  };

})();
// ------------------------------------------------------------------------------------
