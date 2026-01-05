// ==UserScript==
// @name                WME Permalink Selector
// @description         Shows Permalinks or Segments ID's on the map and colorizes a level of segments.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             1.0.5.1
// @grant               none
// @namespace           https://greasyfork.org/scripts/3931-wme-permalink-selector
// @downloadURL https://update.greasyfork.org/scripts/5404/WME%20Permalink%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/5404/WME%20Permalink%20Selector.meta.js
// ==/UserScript==


/* Original wlodek76's version 1.0.5 adapted to WME v1.6-297 by FZ69617 */


var wmech_version = "1.0.5.1"

var loadcount = 0;

//------------------------------------------------------------------------------------------------
function bootstrapPermalinkSelector()
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
    
    setTimeout(initialisePermalinkHighlight, 999);

	window.addEventListener("beforeunload", savePermalink, false);
}
//------------------------------------------------------------------------------------------------
function savePermalink() {
    var segobj = document.getElementById('permalink_id_content');
    if (segobj != null) {
    	var segstr = segobj.value;
        
        localStorage.setItem("PermalinkSegmentContent", segstr);
	}
}
//---------------------------------------------------------------------------------------
function loadPermalink() {
    var segobj = document.getElementById('permalink_id_content');
    if (segobj != null) {
        if (loadcount == 0) {
            loadcount++;
            if (localStorage.PermalinkSegmentContent) segobj.value = localStorage.PermalinkSegmentContent;
        }
    }
}
//---------------------------------------------------------------------------------------
function highlightPermalink() {
    
    var showLevels = getId('_cbShowRoadLevels').checked;
    
    var segobj = document.getElementById('permalink_id_content');

    loadPermalink();

    var segstr = segobj.value;
    var seglines = new Array();
    if (segstr.length > 0) {

        var obj = document.getElementById('sidepanel-permalink-tab');
        if (obj.innerHTML == "Permalink") obj.innerHTML = "Permalink*";
        
        var p = segstr.indexOf("segments=");
        if (p >= 0) {
            
            var newstr = "";
            
            var q = segstr.indexOf("segments=");
            while (q >= 0) {
                var q1 = segstr.indexOf("\n", q + 1);
                var q2 = segstr.indexOf("http", q + 1);
                var q3 = segstr.indexOf('&', q + 1);
                
                var qmax = 99999999;
                if (q1 >=0 && q1 < qmax) qmax = q1;
                if (q2 >=0 && q2 < qmax) qmax = q2;
                if (q3 >=0 && q3 < qmax) qmax = q3;
                if (q1 == -1 && q2 == -1 && q3 == -1) qmax = segstr.length;
                
                //console.log(q, qmax, q1, q2, q3);
                
                newstr += segstr.substr(q+9, qmax - (q+9)) + ",";
                
                q = segstr.indexOf("segments=", q + 1);
            }
            
            segstr = newstr;
        }
        
        segstr = segstr.replace(/\n/g, ",");
        segstr = segstr.replace(/\s+/g, '');
        seglines = segstr.split(",");
    }
    else {
        var obj = document.getElementById('sidepanel-permalink-tab');
        if (obj.innerHTML == "Permalink*") obj.innerHTML = "Permalink";
    }        
    
    var numDays    = 0;

    var objnumRecentDays   = getId('permalink_numRecentDays');
    
    if (objnumRecentDays != undefined) {
        var numDays = objnumRecentDays.value;
        if (numDays === undefined) numDays = 0;
    }

    var tNow = new Date();
    var before = tNow.getTime() - (numDays * 86400000);
    before = before - ( before % 3600000 );
    var beforeTime = new Date();
    beforeTime.setTime(before /*+ tNow.getTimezoneOffset() * 60 * 1000*/ );
    if (numDays == 0) 	getId('permalink_date_before').innerHTML = '';
    else 				getId('permalink_date_before').innerHTML = 'After: ' + beforeTime.toLocaleString().trim();

    for (var seg in Waze.model.segments.objects) {
        var segment = Waze.model.segments.get(seg);
        var attributes = segment.attributes;
        var line = getId(segment.geometry.id);
        
        if (line !== null) {
            var sid 		= attributes.primaryStreetID;
            var street 		= Waze.model.streets.get(sid);
            var level   	= attributes.level;
            var segid 		= segment.attributes.id;
            
            var lineColor 	= line.getAttribute("stroke");
            var lineWidth 	= line.getAttribute("stroke-width");
            var opacity 	= line.getAttribute("stroke-opacity");
            
            var newColor 	= lineColor;
            var newWidth 	= lineWidth;
            var newOpacity 	= opacity;
            
            var reset = 0;
            var RecentlyUpdatedGreen = 0;
            var RecentlyCreatedGreen = 0;
            
           
			var updatedOn   = new Date(attributes.updatedOn);
			var createdOn   = new Date(attributes.createdOn);
            if (numDays > 0 && updatedOn.getTime() >= before) RecentlyUpdatedGreen = 1;
            if (numDays > 0 && createdOn.getTime() >= before) RecentlyCreatedGreen = 1;
            
            // check that WME hasn't highlighted this segment (better method)
            var selected = 0;
            if (segment.renderIntent == "highlight") 		 selected = 1;
            if (segment.renderIntent == "select")    		 selected = 1;
            if (segment.renderIntent == "highlightselected") selected = 1;
            
            // check for WME Highlights errors and do not affect their colors
            if (lineColor == "#ff0") selected = 1;  //segments has soft-turns (yellow)
            if (lineColor == "#f0f") selected = 1;  //segment has reverse connections (purple)
            if (lineColor == "#0ff") selected = 1;
            
            if (selected) {
                continue;
            }

            if (showLevels) {
                newWidth = 9;
                if (level == null || level == undefined) newColor = "#40C040";
                else {
                    level = parseInt(level);
                    if (level <= -3)   newColor = "#040484";
                    if (level == -2)   newColor = "#0404C4";
                    if (level == -1)   newColor = "#0404FC";
                    if (level == 0)  { newColor = "#848484"; newWidth = 4; }
                    if (level == 1)    newColor = "#FC8404";
                    if (level == 2)    newColor = "#FC0404";
                    if (level == 3)    newColor = "#FC04FC";
                    if (level >= 4)    newColor = "#840484";
                }
                newOpacity = 1;
            }
            else {
                if (newColor == "#040484") reset = 1;
                if (newColor == "#0404C4") reset = 1;
                if (newColor == "#0404FC") reset = 1;
                if (newColor == "#848484") reset = 1;
                if (newColor == "#FC8404") reset = 1;
                if (newColor == "#FC0404") reset = 1;
                if (newColor == "#FC04FC") reset = 1;
                if (newColor == "#840484") reset = 1;
            }
            
            var nsel = 0;
            
            if (seglines.length > 0) {
                for(var i=0; i<seglines.length; i++) {
                    if (seglines[i] == segid) { nsel++; }
                }
			}
            
            if (nsel == 0) {
                if (newColor == "#f1125c") reset = 1;
                if (newColor == "#0056ff") reset = 1;
                if (newColor == "#ff7802") reset = 1;
                if (newColor == "#ff02f0") reset = 1;
            }
            else if (nsel == 1) {
                if (RecentlyUpdatedGreen == 0) newColor = "#0056ff";
                if (RecentlyUpdatedGreen == 1) newColor = "#ff7802";
                if (RecentlyCreatedGreen == 1) newColor = "#ff02f0";
                newWidth = 9;
                newOpacity = 0.8;
            }
            else if (nsel >= 2) {
                newColor = "#f1125c";
                newWidth = 9;
                newOpacity = 0.8;
            }

                
            if (reset) {
                newColor 	= "#dd7700";
                newWidth 	= 8;            
                newOpacity 	= 0.001;
            }
            
            if (newColor != lineColor) {
                line.setAttribute("stroke", newColor);
                line.setAttribute("stroke-width", newWidth);
                line.setAttribute("stroke-opacity", newOpacity);
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
        return a;
}
//--------------------------------------------------------------------------------------------------------
function getId(node) {
    return document.getElementById(node);
}
//--------------------------------------------------------------------------------------------------------
function initialisePermalinkHighlight()
{
    var addon 		= document.createElement('section');
    addon.id 		= "permalink-addon";
    addon.innerHTML = '<b style="margin:0px; padding:0px;"><a href="https://greasyfork.org/scripts/5404-wme-permalink-selector" target="_blank"><u>WME Permalink Selector</u></a></b> &nbsp; v' + wmech_version;
    var tooltip1 = 'title="Selects segments or permalinks on the map."';
    var tooltip2 = 'title="Selects segments edited before specified date."';
    var tooltip3 = 'title="Selects segments created before specified date."';
    var tooltip4 = 'title="Marks ID of segments which exists more then once on the list."';
    
    var section = document.createElement('p');
    section.id 					= "permalinkSection";
    section.innerHTML  			= ''
    + '<input type="checkbox" id="_cbShowRoadLevels" style="margin-left:8px; margin-top:16px;" > Road Levels</input>'
    + '<br><br>'
    + '<b>Permalink Selector:</b>'
    + '<textarea   id="permalink_id_content"    style="width:280px; height:150px; " placeholder="Paste Segments ID\'s or Permalinks here" ></textarea>'
    + '<br><div ' + tooltip1 + ' style="margin-left:4px;position:relative;top:+3px;display:inline-block;width:16px;height:16px;background-color:#0056ff;"></div> - selected segments'
    + '<br><div ' + tooltip2 + ' style="margin-left:4px;position:relative;top:+3px;display:inline-block;width:16px;height:16px;background-color:#ff7802;"></div> - recently edited segments'
    + '<br><div ' + tooltip3 + ' style="margin-left:4px;position:relative;top:+3px;display:inline-block;width:16px;height:16px;background-color:#ff02f0;"></div> - recently created segments'
    + '<br><div ' + tooltip4 + ' style="margin-left:4px;position:relative;top:+3px;display:inline-block;width:16px;height:16px;background-color:#f1125c;"></div> - doubled segments'
    + '<br><br>Recently Edited/Created: <input type="number" step="1" min="0" max="30" size="2" value="5" id="permalink_numRecentDays" style=""/> days'
    + '<div id="permalink_date_before" style="xborder: 1px solid red; margin:0px; padding:0px; text-align:left; " ><div>'
    ;
    addon.appendChild(section);
    
    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];
    
    newtab = document.createElement('li');
    newtab.innerHTML = '<a id=sidepanel-permalink-tab href="#sidepanel-permalink" data-toggle="tab">Permalink</a>';
    navTabs.appendChild(newtab);
    
    addon.id = "sidepanel-permalink";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);
    
    window.setInterval(highlightPermalink, 333);
    
    Waze.map.events.register("zoomend", null, highlightPermalink);
}
//--------------------------------------------------------------------------------------------------------------
bootstrapPermalinkSelector();