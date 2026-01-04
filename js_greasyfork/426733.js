// ==UserScript==
// @name                WME Bad Suffixes
// @description         Find roads with incorrect suffix abbrevations
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.03
// @grant               none
// @namespace https://greasyfork.org/users/774005
// @downloadURL https://update.greasyfork.org/scripts/426733/WME%20Bad%20Suffixes.user.js
// @updateURL https://update.greasyfork.org/scripts/426733/WME%20Bad%20Suffixes.meta.js
// ==/UserScript==
 
(function()
{
 
// global variables
var wmebs_version = "1.03"
var wmenfinit = false;
var _badSuffLayer
 
 
/*
var advancedMode = false;
var lastModified = false;
var selectedLines = [];
*/
 
/* =========================================================================== */
 
 
function destroyBSLabels() {
	_badSuffLayer.destroyFeatures();
	//_badSuffLayer.setVisibility(false);
}
 
// When a dupe is deleted, delete the dupe label
function deleteBSLabel() {
	setTimeout(() => {
		const actionsList = W.model.actionManager.getActions();
		const lastAction = actionsList[actionsList.length - 1];
		if (typeof lastAction !== 'undefined' && lastAction._actionId === 7) {
			_badSuffLayer.destroyFeatures();
			//_badSuffLayer.setVisibility(false);
		console.log('Delete bs layer');
		}
	}, 20);
}
 
//var bsList;
//bsListJSON = $.getJSON("https://spreadsheets.google.com/feeds/list/1HVJOHUxSAqMuS-tfoky6UEoGaMl28LhYvC0uoScYTcQ/od6/public/values?alt=json").done( function() {bsList = bsListJSON.responseJSON.feed.entry}); 
var bsList;
bsListJSON = $.getJSON("https://spreadsheets.google.com/feeds/list/1HVJOHUxSAqMuS-tfoky6UEoGaMl28LhYvC0uoScYTcQ/od6/public/values?alt=json"); 
 
 
function findBS(event) {
	//console.log('Find BS started')
	if (!wmenfinit) {
		console.log('WMEBS quit')
		return;
	}
	let textPos;
 
	var showSuffixes = getId('_cbSuffixes').checked;
 
	// 1HVJOHUxSAqMuS-tfoky6UEoGaMl28LhYvC0uoScYTcQ
	if (showSuffixes && W.map.getZoom()>2) {
		
		let labelFeatures = [];
 
		for (var seg in W.model.segments.objects) {
			var segment = W.model.segments.getObjectById(seg);
			var attributes = segment.attributes;
			var sid = attributes.primaryStreetID;
			var street = W.model.streets.getObjectById(sid);
            if (street && street.name && segment.attributes.roadType !== 4) {
                //console.log(street.name)
                //console.log(segment.roadType)
                for (let si = 0; si < bsList.length; si++) {
                    var streetName = street.name;
                    if (streetName.endsWith(' ' + bsList[si].gsx$bad.$t)) {

                        if (attributes.geometry.components.length == 2) {
                            let point1 = attributes.geometry.components[0].getCentroid();
                            let point2 = attributes.geometry.components[1].getCentroid();
                            textPos = attributes.geometry.components[0].getCentroid();
                            textPos.x = 0.5 * (point1.x + point2.x);
                            textPos.y = 0.5 * (point1.y + point2.y);
                        } else if (attributes.geometry.components.length > 2) {
                            textPos = attributes.geometry.components[Math.floor(attributes.geometry.components.length/2)].getCentroid();
                        } else {
                            textPos = attributes.geometry.getCentroid();
                        }


                        labelFeatures.push(new OpenLayers.Feature.Vector(
                            textPos,
                            {
                                labelText: bsList[si].gsx$good.$t,
                                fontColor: '#ff0',
                                strokeColor: '#ff0',
                                labelAlign: 'cm',
                                pointRadius: 5,
                            }
                        ));
                    };
                    //console.log(streetName)
                } // end for-loop for suffix list
            } else if (!street) {
                if (attributes.geometry.components.length == 2) {
                    let point1 = attributes.geometry.components[0].getCentroid();
                    let point2 = attributes.geometry.components[1].getCentroid();
                    textPos = attributes.geometry.components[0].getCentroid();
                    textPos.x = 0.5 * (point1.x + point2.x);
                    textPos.y = 0.5 * (point1.y + point2.y);
                } else if (attributes.geometry.components.length > 2) {
                    textPos = attributes.geometry.components[Math.floor(attributes.geometry.components.length/2)].getCentroid();
                } else {
                    textPos = attributes.geometry.getCentroid();
                }
                labelFeatures.push(new OpenLayers.Feature.Vector(
                    textPos,
                    {
                        labelText: 'Red Rd',
                        fontColor: '#f00',
                        strokeColor: '#f00',
                        labelAlign: 'cm',
                        pointRadius: 5,
                    }
                ));

            }
            // endif
        } // end for-loop thru segments
        _badSuffLayer.removeAllFeatures();
        _badSuffLayer.addFeatures(labelFeatures);
	} // endif show suffixes  
} // end of function
 
 
 
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
function initialiseBS() {
  if (wmenfinit) {
    return;
  }
 
  // init shortcuts
  if(!window.W.map) {
      window.console.warn("WME Bad Suffixes "
          + ": waiting for WME...");
      setTimeout(initialiseBS, 789);
      return;
  }
 
  // check if sidebar is hidden
  var sidebar = getId('sidebar');
  if (sidebar.style.display == 'none') {
    console.warn("WME Bad Suffixes: not logged in yet - will initialise at login");
    W.loginManager.events.register("login", null, initialiseBS);
    return;
  }
 
  // check that user-info section is defined
  var userTabs = getId('user-info');
  if (userTabs === null) {
    console.warn("WME Bad Suffixes: editor not initialised yet - trying again in a bit...");
    setTimeout(initialiseBS, 789);
    return;
  }
  
  // JSON wait
  if(!bsListJSON) {
      window.console.warn("WME Bad Suffixes "
          + ": waiting for JSON...");
      setTimeout(initialiseBS, 789);
      return;
  }
bsList = bsListJSON.responseJSON.feed.entry;
 
 
  console.group("WME Bad Suffixes: " + wmebs_version);
 
  // add new box to left of the map
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];
  var addon = document.createElement('section');
  addon.id = "wmebs-addon";
 
  // highlight segements
  var section = document.createElement('p');
  section.style.paddingTop = "0px";
  //section.style.textIndent = "16px";
  section.id = "bsOptions";
  section.className = 'checkbox';
  section.innerHTML  = '<b>Find Suffixes</b><br>'
                     + '<label title="Bad Suffixes"><input type="checkbox" id="_cbSuffixes" title="Road suffixes" />Road Suffixes </label><br>'
                     ;
  addon.appendChild(section);
 
  var newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-wmebs" data-toggle="tab">WMEBS</a>';
    // icon: <span class="fa fa-tint" title="Highlight"></span>
  navTabs.appendChild(newtab);
 
  addon.id = "sidepanel-wmebs";
  addon.className = "tab-pane";
  tabContent.appendChild(addon);
   
  // setup onclick handlers for instant update:
  getId('_cbSuffixes').onclick = findBS;
  
 	// restore saved settings
	if (localStorage.WMEBadSuffixes) {
		//console.debug("WME Highlights: loading options");
		var options = JSON.parse(localStorage.WMEBadSuffixes);
 
		getId('_cbSuffixes').checked         = options[1];
	}
   
  // overload the WME exit function
  var saveBSOptions = function() {
    if (localStorage) {
      //console.debug("WME Highlights: saving options");
      var options = [];
 
      // preserve previous options which may get lost after logout
      if (localStorage.WMEBadSuffixes)
        options = JSON.parse(localStorage.WMEBadSuffixes);
 
		options[1] = getId('_cbSuffixes').checked;
      
      localStorage.WMEBadSuffixes = JSON.stringify(options);
    }
  }
  window.addEventListener("beforeunload", saveBSOptions, false);
 
  // begin periodic updates
  window.setInterval(findBS,2000);
  
  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener("load", function(e) {
    var mapProblems = getId('map-problems-explanation')
    if (mapProblems !== null) mapProblems.style.display = "none";
  });
 
  // register some events...
 // W.map.events.register("zoomend", null, findBS);
  // W.map.events.register("moveend", null, findBS);
//WazeWrap.Events.register("zoomend", null, findBS);
    WazeWrap.Events.register("moveend", null, findBS);
	const lname = 'WMEBS Bad Suffixes';
	const style = new OpenLayers.Style({
		label: '${labelText}',
		labelOutlineColor: '#333',
		labelOutlineWidth: 3,
		labelAlign: '${labelAlign}',
		fontColor: '${fontColor}',
		fontOpacity: 1.0,
		fontSize: '14px',
		fontWeight: 'bold',
		labelYOffset: -30,
		labelXOffset: 0,
		fill: false,
		strokeColor: '${strokeColor}',
		strokeWidth: 10,
		pointRadius: '${pointRadius}'
	});
	_badSuffLayer = new OpenLayers.Layer.Vector(lname, { displayInLayerSwitcher: false, uniqueName: '__badSuffLayer', styleMap: new OpenLayers.StyleMap(style) });
	W.map.addLayer(_badSuffLayer);
	_badSuffLayer.setVisibility(true);
	
	
  
  wmenfinit = true;
  console.groupEnd();
  console.log('WMEBS end init')
}
 
/* engage! =================================================================== */
setTimeout(initialiseBS, 789);
 
})();
/* end ======================================================================= */