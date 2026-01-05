// ==UserScript==
// @name                WME FC Color Highlights
// @description         Adds colors to road segments to show their Functional Classification
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.7.1
// @grant               none
// @namespace           https://greasyfork.org/users/5252
// @downloadURL https://update.greasyfork.org/scripts/5010/WME%20FC%20Color%20Highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/5010/WME%20FC%20Color%20Highlights.meta.js
// ==/UserScript==

var wmefcch_version = "0.7.1"

var FWColour = "#007aff"; // and #ffba00
var MHColour = "#ff3511";
var mHColour = "#39ad00";
var PSColour = "#be3eec"; // and #ffff3e
var STColour = "#ffffff";
var RAColour = "#dd7701";

/* bootstrap, will call initialiseHighlights() */
function bootstrapFCHighlights()
{
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  }
  catch (err) { /* Ignore */ }

  if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    }) ();
  }

  /* begin running the code! */
  setTimeout(initialiseFCHighlights, 999);
}

/* =========================================================================== */
function FChighlightSegments() {
    
  var currentZoom = Waze.map.zoom;
  
  //if(currentZoom < 4){
      WMEFC_lineLayer.destroyFeatures();
  //}
    
  var roadTypeLabels = getId('_cbChangeRoadTypeLabels').checked;
    if(roadTypeLabels){
		// change road type labels to FC
  		I18n.translations.en.segment.road_types["2"] = "Collector";
  		I18n.translations.en.segment.road_types["6"] = "Principal Arterial (or US-# minimum)";
  		I18n.translations.en.segment.road_types["7"] = "Minor Arterial (or SR-# minimum)";
    }
    else{
        I18n.translations.en.segment.road_types["2"] = "Primary Street";
  		I18n.translations.en.segment.road_types["6"] = "Major Highway";
  		I18n.translations.en.segment.road_types["7"] = "Minor Highway";
    }
    
    
  var roadTypes = new Array(2, 4, 3, 6, 7, 1);
    
  var segStrokeWidth = null;
  switch(currentZoom){
      case 0: segStrokeWidth = 5; break;
      case 1: segStrokeWidth = 5; break;
      case 2: segStrokeWidth = 5; break;    
      case 3: segStrokeWidth = 5; break;
      case 4: segStrokeWidth = 5; break;
      case 5: segStrokeWidth = 5; break;   
      case 6: segStrokeWidth = 15; break;    
      case 7: segStrokeWidth = 15; break;
      case 8: segStrokeWidth = 20; break;
      case 9: segStrokeWidth = 20; break;
      case 10: segStrokeWidth = 20; break;
  };

  for (var seg in W.model.segments.objects) {
    var segment = W.model.segments.get(seg);
    var attributes = segment.attributes;
    var segRoadType = attributes.roadType;
    var segGeo = segment.geometry.components;
    var segCenter = segment.getCenter();
      //console.log('WME FC: ' + segCenter);
     
    var street = W.model.streets.get(attributes.primaryStreetID);
    var streetName = street.name;
      
    var segStrokeColor = null;  
    switch(segRoadType){
    	case roadTypes[2]: segStrokeColor = getId('_txtFCFreewayColor').value; break;
        case roadTypes[3]: segStrokeColor = getId('_txtFCMHColor').value; break;
        case roadTypes[4]: segStrokeColor = getId('_txtFCmHColor').value; break;
        case roadTypes[0]: segStrokeColor = getId('_txtFCPSColor').value; break;
        case roadTypes[1]: segStrokeColor = getId('_txtFCRAColor').value; break;
        case roadTypes[5]: segStrokeColor = getId('_txtFCSTColor').value; break;
        default: segStrokeColor = 'white';
    }; 
      
    var segDashStyle = 'solid';
    var test = getId('_cbDashFreeway').checked;
    switch(segRoadType){
        case roadTypes[2]: if(getId('_cbDashFreeway').checked){segDashStyle = 'dash'}; break;
        case roadTypes[3]: if(getId('_cbDashMH').checked){segDashStyle = 'dash'}; break;
        case roadTypes[4]: if(getId('_cbDashmH').checked){segDashStyle = 'dash'}; break;
        case roadTypes[0]: if(getId('_cbDashPS').checked){segDashStyle = 'dash'}; break;
        case roadTypes[1]: if(getId('_cbDashRA').checked){segDashStyle = 'dash'}; break;
        case roadTypes[5]: if(getId('_cbDashST').checked){segDashStyle = 'dash'}; break;
        default: var segDashStyle = 'solid';
    }; 
      
    var segLineStyle = {
                strokeColor: segStrokeColor,
        		strokeOpacity: .8,
                strokeWidth: segStrokeWidth,
        		strokeLinecap: "butt",
        		strokeDashstyle: segDashStyle,
                pointRadius: 6,
                pointerEvents: "visiblePainted",
        		//label: streetName,
        		labelAlign: "cm",
        		labelOutlineColor: "white",
        		labelOutlineWidth: 2,
        		labelXOffset: 0,
        		labelYOffset: 0,
        		fontWeight: "bold"
            };
    if(segRoadType == 1 || segRoadType == 2 || segRoadType == 3 || segRoadType == 4 || segRoadType == 6 || segRoadType == 7){
    	var lineFeature = new OL.Feature.Vector(new OL.Geometry.LineString(segGeo),null,segLineStyle);
    	WMEFC_lineLayer.addFeatures([lineFeature]);
    }
  }
}


/* =========================================================================== */
/* helper function */

function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

/* =========================================================================== */

function initialiseFCHighlights()
{
  // global variables
  betaMode = location.hostname.match(/editor-beta.waze.com/);
  lastSelected = null;
  lastModified = false;
  selectedLines = [];
  fcVisibility = true;

  // add new box to left of the map
  var addon = document.createElement('section');
  addon.id = "fchighlight-addon";

  if (navigator.userAgent.match(/Chrome/)) {
    addon.innerHTML  = '<b><a href="http://wiki.waze.com/wiki/National_resources/USA/Functional_classification" target="_blank"><u>'
                     + 'WME FC Colour Highlights</u></a></b> &nbsp; v' + wmefcch_version;
  } else {
    addon.innerHTML  = '<b><a href="http://wiki.waze.com/wiki/National_resources/USA/Functional_classification" target="_blank"><u>'
                     + 'WME FC Colour Highlights</u></a></b> &nbsp; v' + wmefcch_version;
  }

  // segment color selection textboxes
  var section = document.createElement('p');
  section.style.paddingTop = "8px";
  section.style.textIndent = "16px";
  section.id = "FChighlightOptions";
  section.innerHTML  = '<b>Highlight FC Segments</b><br>'
  					 + '<br><input type="checkbox" id="_cbChangeRoadTypeLabels"/>Change road type labels<br>'
  					 + '<br><a href="https://wiki.waze.com/wiki/Road_types/USA#Quick_reference_chart" target="_blank">Wiki: Road Types USA</a><br>'
                     + '<br>Freeway/Other Expy<br>'
  					 + '<input type="textbox" id="_txtFCFreewayColor" value=' + FWColour + '><input type="checkbox" id="_cbDashFreeway"/>dash<br> '
  				     + 'Principal Arterial<br>'
  					 + '<input type="textbox" id="_txtFCMHColor" value=' + MHColour + '><input type="checkbox" id="_cbDashMH"/>dash<br> '
  					 + 'Minor Arterial<br>'
  					 + '<input type="textbox" id="_txtFCmHColor" value=' + mHColour + '><input type="checkbox" id="_cbDashmH"/>dash<br> '
  					 + 'Collector<br>'
  					 + '<input type="textbox" id="_txtFCPSColor" value=' + PSColour + '><input type="checkbox" id="_cbDashPS"/>dash<br> '
  					 + 'Local<br>'
  					 + '<input type="textbox" id="_txtFCSTColor" value=' + STColour + '><input type="checkbox" id="_cbDashST"/>dash<br> '
  					 + 'Ramp<br>'
  					 + '<input type="textbox" id="_txtFCRAColor" value=' + RAColour + '><input type="checkbox" id="_cbDashRA"/>dash<br> '
  					 + '<input type="button" id="_btnFCRefresh" value="Refresh"/><br>'
                     ;
  addon.appendChild(section);

  var userTabs = getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-fchighlights" data-toggle="tab">FC Highlight</a>';
  navTabs.appendChild(newtab);

  addon.id = "sidepanel-fchighlights";
  addon.className = "tab-pane";
  tabContent.appendChild(addon);

  // setup onclick handlers for instant update:
  getId('_cbChangeRoadTypeLabels').onclick = FChighlightSegments;
  getId('_btnFCRefresh').onclick = FChighlightSegments;
  
  // restore saved settings
  if (localStorage.WMEFCHighlightScript) {
    console.log("WME FC Highlights: loading options");
    var options = JSON.parse(localStorage.getItem("WMEFCHighlightScript"));

    fcVisibility 							= options[1];
    getId('_txtFCFreewayColor').value    	= options[2];
    getId('_txtFCMHColor').value    		= options[3];
    getId('_txtFCmHColor').value    		= options[4];
    getId('_txtFCPSColor').value    		= options[5];
    getId('_txtFCRAColor').value    		= options[6];
    getId('_cbChangeRoadTypeLabels').checked  = options[7];
    getId('_txtFCSTColor').value    		= options[8];
  }

  // overload the WME exit function
  saveFCHighlightOptions = function() {
    if (localStorage) {
      console.log("WME FC Highlights: saving options");
      var options = [];
	  
      fcVisibility = WMEFC_lineLayer.visibility;
      options[1] = fcVisibility;
      options[2] = getId('_txtFCFreewayColor').value;
      options[3] = getId('_txtFCMHColor').value;
      options[4] = getId('_txtFCmHColor').value;
      options[5] = getId('_txtFCPSColor').value;
      options[6] = getId('_txtFCRAColor').value;
      options[7] = getId('_cbChangeRoadTypeLabels').checked;
      options[8] = getId('_txtFCSTColor').value;  

      //localStorage.WMEFCHighlightScript = JSON.stringify(options);
      localStorage.setItem("WMEFCHighlightScript", JSON.stringify(options));
    }
  }
  window.addEventListener("beforeunload", saveFCHighlightOptions, false);
  
  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener("load", function(e) {
    var mapProblems = getId('map-problems-explanation')
    if (mapProblems !== null) mapProblems.style.display = "none";
  });

  // add a new FC layer
  WMEFC_lineLayer = new OL.Layer.Vector("Functional Classification", 
    { rendererOptions: { zIndexing: true }, 
      uniqueName: '__functional_classification' }
  ); 
  I18n.translations.en.layers.name["__functional_classification"] = "Functional Classification";  
  
  WMEFC_lineLayer.setZIndex(50);
  Waze.map.addLayer(WMEFC_lineLayer);
  Waze.map.addControl(new OL.Control.DrawFeature(WMEFC_lineLayer, OL.Handler.Path));
  WMEFC_lineLayer.setVisibility(fcVisibility);
    
  window.setTimeout(FChighlightSegments,2000);
    
  Waze.map.events.register("zoomend", Waze.map, FChighlightSegments);
  Waze.map.events.register("moveend", Waze.map, FChighlightSegments);
  Waze.map.events.register("mergeend", Waze.map, FChighlightSegments);
  
}

/* engage! =================================================================== */
bootstrapFCHighlights();

/* end ======================================================================= */