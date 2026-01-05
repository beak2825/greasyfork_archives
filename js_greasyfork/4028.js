// ==UserScript==
// @name        WME Speed
// @namespace   WME_SPEED
// @include     https://*.waze.com/editor/*
// @description This script allows you to highlight various issues and properties of road segments.
// @version     0.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4028/WME%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/4028/WME%20Speed.meta.js
// ==/UserScript==


function wmeSpeedBootstrap()
{
	var bGreasemonkeyServiceDefined     = false;

	try
	{
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
		{
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err)
	{
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		unsafeWindow    = ( function ()
		{
			var dummyElem   = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	        setTimeout(function() {
	wmeSpeedInit();
        }, 1500);

}

function wmeSpeedInit() { 
var version = "v0.0.4"; 
//  
// CLASS DEFINITIONS FILE  
//  
var WME_SPEED_UNKNOWN = -987;

var FRONT_ABBREVS = ["S", "N", "E", "W"]
var END_ABBREVS = ["Ave", "Blvd", "Cir", "Ct", "Dr", "Hts", "Ln", "Loop", "Pkwy", "Pl", "Rd", "Rdge", "Rte", "St", "Trl", "Way"]
var InterstateRegEx = /^I-\d\d\d? /;

var ERROR_RGBA = 'rgba(187,0,0,0.7)'
var ERROR_MODS = {color: "#B00", opacity: 0.7 };

function SelectSection(hdr, iD, slctns) {
    this.header = hdr;
    this.id = iD;
    this.selections = slctns;
}

function hasRestrictions(segmentAttr) {
	return ((segmentAttr.fwdRestrictions != null && segmentAttr.fwdRestrictions.length > 0)
        || (segmentAttr.revRestrictions != null && segmentAttr.revRestrictions.length > 0))
}

function getId(name) { return document.getElementById(name); }

function roadTypeToString(roadType) {
    switch(roadType) {
        case 1: return "Street"
        case 2: return "Primary Street"
        case 3: return  "Freeway"
        case 4: return  "Ramps"
        case 5: return  "Walking Trail"
        case 6: return  "Major Highway"
        case 7: return  "Minor Highway"
        case 8: return  "Dirt road"
        case 10: return  "Pedestrian Bw"
        case 16: return  "Stairway"
        case 17: return  "Private Road"
        case 18: return  "Railroad"
        case 19: return  "Runway/Taxiway"
        case 20: return  "Parking Lot Road"
        case 21: return  "Service Road"
        default:
            return "Unknown";
    }
}

function isTrafficRelevant(roadType) {
    switch(roadType) {
        //"Streets"
        case 1:
        //"Primary Street"
        case 2:
        //"Freeways",
        case 3:
        //"Ramps",
        case 4:
        //"Major Highway",
        case 6:
        //"Minor Highway",
        case 7:
        //"Service Road"
        case 21:
            return true;
        default:
            return false;
    }
}

function isOneWay(segment) {
    return ((segment.attributes.fwdDirection + segment.attributes.revDirection) == 1);
}

function isNoDirection(segment) {
    return ((segment.attributes.fwdDirection + segment.attributes.revDirection) == 0);
}

function isInterstate(segment) {
    var sid = segment.attributes.primaryStreetID;
    if(sid) {
        var street = Waze.model.streets.get(sid);
        var streetName = street.name; 
        if(streetName == null || streetName == "") {
            return false;
        }
        return segment.attributes.roadType == 3 && streetName.match(InterstateRegEx) != null;
    }
    return false;
}

function getSegmentSpeed(segment) {
    var speedToUse = 0;
    if(typeof segment.attributes.fwdDirection === "undefined") {
        speedToUse = "NA"
    }
    else {
        var oneWay = isOneWay(segment);
        if (oneWay && segment.attributes.fwdDirection) {
            speedToUse = segment.attributes.fwdCrossSpeed;
        } else if (oneWay && segment.attributes.revDirection) {
            speedToUse = segment.attributes.revCrossSpeed;
        } else {
            // take average?  we could do a max, or a min, or ...
            speedToUse = (segment.attributes.revCrossSpeed + segment.attributes.fwdCrossSpeed) / 2;
        }
        if (!isNaN(speedToUse)) {
            speedToUse *= 0.621;
            // convert from km/h to MPH
            speedToUse = Math.ceil(speedToUse / 5) * 5;
            // round up to the nearest 5 mph
            speedToUse = Math.round(speedToUse);
            // may not be necessary
        }
    }
    return speedToUse;
}

// CLASS DEFINITIONS
function LineBearing(dist, bear) {
    this.distance = dist;
    this.bearing = bear;
}

function getDistance(p1, p2) {

    var y1 = p1.y;
    var x1 = p1.x;

    var y2 = p2.y;
    var x2 = p2.x;

    var dLat = y2 - y1;
    var dLon = x2 - x1;
    var d = Math.sqrt(Math.pow(dLat, 2) + Math.pow(dLon, 2));

    // http://mathforum.org/library/drmath/view/55417.html
    var bearing = 0;
    if (dLon > 0) {
        if (dLat > 0) {
            bearing = calcTan(dLon, dLat);
        }
        if (dLat < 0) {
            bearing = 180 - calcTan(-1 * dLon, dLat);
        }
        if (dLat == 0) {
            bearing = 90;
        }
    }
    if (dLon < 0) {
        if (dLat > 0) {
            bearing = -1 * calcTan(-1 * dLon, dLat);
        }
        if (dLat < 0) {
            bearing = calcTan(dLon, dLat) - 180;
        }
        if (dLat == 0) {
            bearing = 270;
        }
    }
    if (dLon == 0) {
        if (dLat > 0) {
            bearing = 0;
        }
        if (dLat < 0) {
            bearing = 180;
        }
        if (dLat == 0) {
            bearing = 0;
        }
    }
    bearing += 360;
    bearing = bearing % 360;

    return new LineBearing(d, bearing);

}

function getComponentsProperties(comps) {
    var compSegs = [];
    for (var i = 1; i < comps.length; i++) {
        var p1 = compToPoint(comps[i - 1]);
        var p2 = compToPoint(comps[i]);
        var dist = getDistance(p1, p2);
        compSegs.push(dist);
    }
    return compSegs;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function compToPoint(comp) {
    return new Point(comp.x, comp.y);
}

Point.prototype.getLineTo = function(p2) {
    var lat1 = this.latitude;
    var lon1 = this.longitude;

    var lat2 = p2.latitude;
    var lon2 = p2.longitude;

    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var d = Math.sqrt(Math.pow(dLat, 2) + Math.pow(dLon, 2));

    var bearing = 0;
    // North / South
    if (dLon == 0) {
        bearing = dLat < 0 ? 180 : 0;
    } else {
        bearing = (Math.tan(dLat / dLon) / (2 * Math.PI)) * 360;
    }
    //    return new LineBearing(d, bearing);
}
function WazeStreet(streetId) {
    var street = Waze.model.streets.get(streetId);
    this.cityID = street.cityID;
    var city = Waze.model.cities.get(this.cityID);
    this.noCity = city == null || city.isEmpty;
    this.noName = street.isEmpty;
    this.state = this.noCity ? null : Waze.model.states.get(city.stateID);
}

function WazeNode(nodeId) {
  this.id = nodeId;
  this.Node = Waze.model.nodes.objects[nodeId];
  this.attributes = this.Node.attributes;
}

WazeNode.prototype.UTurnAllowed = function(segmentId) {
    if(typeof this.Node === "undefined") return false;
    var connections = this.Node.attributes.connections[segmentId + "," + segmentId];
    return (typeof connections !== "undefined");
};

WazeNode.prototype.isDeadEnd = function() {
    if(typeof this.Node === "undefined") return false;
    return this.Node.attributes.segIDs.length < 2;
};

function WazeLineSegment(segment) {
    this.id = segment.fid;
    this.geometry = segment.geometry;
    this.attributes = segment.attributes;
    var primStrId = this.attributes.primaryStreetID;
    this.primaryStreetInfo = new WazeStreet(primStrId);
    this.ToNode = this.attributes.toNodeID ? new WazeNode(this.attributes.toNodeID) : null;
    this.FromNode = this.attributes.fromNodeID ? new WazeNode(this.attributes.fromNodeID) : null;
    this.secondaryStreetInfos = [];
    if(this.attributes.streetIDs) {
        for(var secStrIdx = 0; secStrIdx < this.attributes.streetIDs.length; secStrIdx++) {
            this.secondaryStreetInfos[secStrIdx] = new WazeStreet(this.attributes.streetIDs[secStrIdx]);
        }
    }
    this.cityID = this.primaryStreetInfo.cityID;
    this.line = getId(segment.geometry.id);
    this.streetName = null;
    this.streetState = null;
    this.noName = this.primaryStreetInfo.noName;
    this.noCity = this.primaryStreetInfo.noCity;
    this.state = this.primaryStreetInfo.state;
    this.oneWay = ((this.attributes.fwdDirection + this.attributes.revDirection) == 1);
    // it is 1-way only if either is true
    this.noDirection = (!this.attributes.fwdDirection && !this.attributes.revDirection);
    // Could use the .attribute.allowNoDirection?
    this.updatedOn = new Date(this.attributes.updatedOn);
    this.updatedBy = this.attributes.updatedBy;
    this.fwdSpeed = Math.abs(this.attributes.fwdCrossSpeed);
    this.revSpeed = Math.abs(this.attributes.revCrossSpeed);
    this.length = this.attributes.length;
    this.roadType = this.attributes.roadType;
    this.segment = segment;
}

WazeLineSegment.prototype.getStreetName = function() {

    if (!this.streetName) {
        var sid = this.segment.attributes.primaryStreetID;
        var street = Waze.model.streets.get(sid);
        if (sid && street.name !== null) {
            this.streetName = street.name;
        } else {
            this.streetName = "";
        }
    }
    return this.streetName;
};

WazeLineSegment.prototype.containsUTurn = function() {
    return this.ToNode.UTurnAllowed(this.id) || this.FromNode.UTurnAllowed(this.id);
};

function WMEFunction(acheckboxId, aText) {
    this.checkboxId = acheckboxId;
    this.text = aText;
}

WMEFunction.prototype.getCheckboxId = function() {
    return this.checkboxId;
};
WMEFunction.prototype.getBackground = function() {
    return '#fff';
};

WMEFunction.prototype.build = function(checkValue) {
    var checkStr = checkValue ? "checked" : "";
    return '<input style="" type="checkbox" id="' + this.getCheckboxId() + '" ' + checkStr + '/> ' + this.text;
};
WMEFunction.prototype.init = function() {
    console.log("init");
    getId(this.getCheckboxId()).onclick = highlightAllSegments;
};
WMEFunction.prototype.getModifiedAttrs = function(wazeLineSegment) {
    return new Object();
};

WMEFunction.prototype.getDetail = function(wazeLineSegment) {
   return;
};

function WMEFunctionExtended(acheckboxId, aText) {
    WMEFunction.call(this, acheckboxId, aText);
}

extend(WMEFunctionExtended.prototype, WMEFunction.prototype);

WMEFunctionExtended.prototype.getSelectId = function() {
    return this.getCheckboxId() + 'Select';
}

WMEFunctionExtended.prototype.buildExtended = function() {
    return '';
}

WMEFunctionExtended.prototype.build = function(checkValue) {
    return WMEFunction.prototype.build.call(this, checkValue) + '<br />' + this.buildExtended();
};

WMEFunctionExtended.prototype.getSelectFieldChangeFunction = function() {
    var that = this;
    return function() {
        getId(that.getCheckboxId()).checked = "checked";
        highlightSegments();
    };
};

function EventPublisher() {
    this.subscribers = [];
}

EventPublisher.prototype = {
    subscribe : function(fn) {
        this.subscribers.push(fn);
    },
    unsubscribe : function(fn) {
    },
    post : function(thisObj) {
        for (var i = 0, j = this.subscribers.length; i < j; i++) {
            this.subscribers[i].call(thisObj);
        };
    }
};

function HighlightSegmentMonitor() {
    var eventPublisher = new EventPublisher();
    var latestSegment = null;
    this.subscribe = function(fn) {
        eventPublisher.subscribe(fn);
    }
    this.updateLatestSegment = function(latest) {
        latestSegment = latest;
        eventPublisher.post(latest);
    }
    this.getLatestSegment = function() {
        return latestSegment;
    }
}

var highlightSegmentMonitor = new HighlightSegmentMonitor();

//  
// UTILITY DEFINITIONS FILE  
//  

////  UTIL FUNCTIONS
function extend(target, source) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    for (var propName in source) {
        // Invoke hasOwnProperty() with this = source
        if (hasOwnProperty.call(source, propName)) {
            target[propName] = source[propName];
        }
    }
    return target;
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

function getScaledHex(index, maximum, startColor, endColor) {
    if (index >= maximum) {
        index = maximum - 1;
    }
    var colorVal = startColor + ((endColor - startColor) * (index / (maximum - 1)));

    colorVal = Math.round(colorVal);

    // convert from decimal to hexadecimal
    var colorHex = colorVal.toString(16);

    // pad the hexadecimal number if required
    if (colorHex.length < 2) {
        colorHex = "0" + colorHex;
    }
    return colorHex;
}

function getScaledColour(index, maximum) {
    var blueHex = "00";

    var startGreen = 0;
    var endGreen = 255;

    var startRed = 255;
    var endRed = 0;

    return "#" + getScaledHex(index, maximum, startRed, endRed) + getScaledHex(index, maximum, startGreen, endGreen) + blueHex;
}

function generateTopDownGradient(top, bottom) {
    var stylizer = "background-color: " + top + ";"
    stylizer += "background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%," + top + "), color-stop(100%, " + bottom + "));";
    stylizer += "background-image: -webkit-linear-gradient(top, " + top + ", " + bottom + ");";
    stylizer += "background-image: -moz-linear-gradient(top, " + top + ", "  + bottom + ");";
    stylizer += "background-image: -ms-linear-gradient(top, " + top + ", " + bottom + ");";
    stylizer += "background-image: -o-linear-gradient(top, " + top + ", " + bottom + ");";
    stylizer += "background-image: linear-gradient(top, " + top + ", " + bottom + ");";
    return stylizer;
}

function padNumber(numDigits, number) {
   var startNum = Math.pow(10, numDigits) / 10;
   var numStr = "" + number;
   while(number < startNum  && startNum > 1) {
	  numStr = "0" + numStr;
	  startNum /= 10;
   }
   return numStr;
}

function dateToDateString(dateVal) {
    return "" + dateVal.getFullYear() + "/" + padNumber(2, dateVal.getMonth()+1) + "/" + padNumber(2, dateVal.getDate());
}

function lengthToString(lengthInMeters) {
    return Math.round(lengthInMeters * 3.28084) + " ft"
}

function calcTan(dLon, dLat) {
 return (Math.atan(dLon/dLat) / (2 * Math.PI)) * 360;
}
//  
// COMPONENT SELECTION CLASS  
//  
/** GEOMETRY **/

function getBearingDiff(bearing1, bearing2) {
    // normalize the first angle to 0, and subtract the same from the second;
    var normalizeAngle = bearing1;
    bearing1 -= normalizeAngle;
    var diffAngle = bearing2 - normalizeAngle;

    if (diffAngle < -180) {
        diffAngle += 360;
    } else if (diffAngle > 180) {
        diffAngle -= 360;
    }
    return diffAngle;
}

function rightTurn(bearing1, bearing2) {
    return getBearingDiff(bearing1, bearing2) > 0;
}

var MIN_DISTANCE_BETWEEN_COMPONENTS = 1.5;
var MIN_LENGTH_DIFF = 0.005;

function between(value, min, max) {
    if (max < min) {
        var temp = min;
        min = max;
        max = temp
    }
    var between = value > min && value < max;
    //    console.log("between? " + min + " " + value + " " + max + " = " + between);
    return between;
}

var ZIG_ZAG_MAX_DIST = 30;
var ZIG_ZAG_MAX_ANGLE = 3;
var negate_ZIG_ZAG_MAX_ANGLE = -1 * ZIG_ZAG_MAX_ANGLE;
var MIN_ANGLE_DIFF = 0.7;

function subtleZigZags(segmentProperties) {
    // detect zig zagging...
    var segmentChain = [];
    for (var i = 0; i < segmentProperties.length; i++) {
        var currentSegment = segmentProperties[i];
        segmentChain.push(currentSegment);
        if (segmentChain.length < 3) {
            continue;
        }
        if (currentSegment.distance > ZIG_ZAG_MAX_DIST) {
            segmentChain = [];
            continue;
        }
        var origSegment = segmentChain[segmentChain.length - 3];
        var pastSegment = segmentChain[segmentChain.length - 2];
        var bearing1 = origSegment.bearing;
        var bearing2 = pastSegment.bearing;
        var bearing3 = currentSegment.bearing;

        var bearDiff1 = getBearingDiff(bearing1, bearing2);
        var bearDiff2 = getBearingDiff(bearing2, bearing3);

        if ((between(bearDiff1, 0, ZIG_ZAG_MAX_ANGLE) && between(bearDiff2, 0, negate_ZIG_ZAG_MAX_ANGLE)) || (between(bearDiff1, 0, negate_ZIG_ZAG_MAX_ANGLE) && between(bearDiff2, 0, ZIG_ZAG_MAX_ANGLE))) {
            return true;
        }
    }
    return false;
}

function checkForLowAngles(segmentProperties) {
    if (segmentProperties.length < 2) {
        return;
    }
    for (var i = 0; i < segmentProperties.length - 1; i++) {
        var currentSegment = segmentProperties[i];
        var nextSegment = segmentProperties[i + 1];
        var bearing1 = currentSegment.bearing;
        var bearing2 = nextSegment.bearing;
        var bearDiff1 = getBearingDiff(bearing1, bearing2);
        if (Math.abs(bearDiff1) < MIN_ANGLE_DIFF) {
            return true;
        }
    }
    return false;
}

// Check for subtle zig-zags on longer components where the end result of the zig-zag is almost nothing

// Check for sharp zig-zags on very short components where the end result of the zig-zag is almost nothing

// OR

// Check for issues when (angle / length) reaches a threshold.  So sharp angles reach the threshold with small lengths;

// --

// Take the difference between the total sum and the sum of the components.  Take the the differene to create an average distance per component. If that average exceeds a trheshoold...

// // //

// On major streets, checks to see that there aren't places where the street can't continue due to turn restrictions.

var highlightLowAngles = new WMEFunction("_cbHighlightLowAngles", "Low Angles");
highlightLowAngles.getModifiedAttrs = function(wazeLineSegment) {
	var components = wazeLineSegment.geometry.components;
	if (components.length <= 2) {
		return new Object();
	}
	var foundIssue = false;
	var segmentProperties = getComponentsProperties(wazeLineSegment.geometry.components);

	if (checkForLowAngles(segmentProperties)) {
		foundIssue = true;
	}

	var modifications = new Object();
	if (foundIssue) {
		modifications.color = "#BE0";
		modifications.opacity = 0.5;
	}
	return modifications;
};
highlightLowAngles.getBackground = function() {
    return 'rgba(187,238,0,0.5)';
};

/*
 *
 */
var highlightExcessComponents = new WMEFunction("_cbHighlightHighExcessComponents", "Excess Components");
highlightExcessComponents.getModifiedAttrs = function(wazeLineSegment) {
	var components = wazeLineSegment.geometry.components;
	if (components.length <= 2) {
		return new Object();
	}
	var foundIssue = false;
	var segmentProperties = getComponentsProperties(wazeLineSegment.geometry.components);

	// If the space between components is really small, we note that as an issue
	var lengthSum = 0;
	for (var i = 0; i < segmentProperties.length; i++) {
		var componentLength = segmentProperties[i].distance;
		lengthSum += componentLength;
	}
	// if there is more than just a beginning and end component, and the difference from the total length is really small, this fits this category.
	var pStart = compToPoint(components[0]);
	var pEnd = compToPoint(components[components.length - 1]);
	var totalDist = getDistance(pStart, pEnd).distance;
	var lengthDiff = lengthSum - totalDist;

	var numXtraComps = components.length - 2;
	// NEW
	var avgDiffPerSeg = lengthDiff / numXtraComps;
	var avgLengthPerSeg = lengthSum / numXtraComps;
	if (avgDiffPerSeg < 0.03) {
		foundIssue = true;
	} else if (avgLengthPerSeg < 3) {
		foundIssue = true;
	} 
	var modifications = new Object();
	if (foundIssue) {
		modifications.color = "#FFD105";
		modifications.opacity = 0.5;
	}
	return modifications;
};
highlightExcessComponents.getBackground = function() {
    return 'rgba(255,209,5,0.5)';
}; 

var highlightCloseComponents = new WMEFunction("_cbHighlightCloseComponents", "Close Components");
highlightCloseComponents.getModifiedAttrs = function(wazeLineSegment) {
    var components = wazeLineSegment.geometry.components;
    if (components.length <= 2) { return }
    var segmentProperties = getComponentsProperties(wazeLineSegment.geometry.components);

    // If the space between components is really small, we note that as an issue
    for (var i = 0; i < segmentProperties.length; i++) {
        var componentLength = segmentProperties[i].distance;
        if (componentLength < MIN_DISTANCE_BETWEEN_COMPONENTS) {
			return ERROR_MODS;
        }
    }
};
highlightCloseComponents.getBackground = function() {
    return ERROR_RGBA;
};

var highlightZigZagsComponents = new WMEFunction("_cbHighlightZigZagsComponents", "Subtle Zig-Zags");
highlightZigZagsComponents.getModifiedAttrs = function(wazeLineSegment) {
    var components = wazeLineSegment.geometry.components;
    if (components.length <= 2) {
        return new Object();
    }
    var foundIssue = false;
    var segmentProperties = getComponentsProperties(wazeLineSegment.geometry.components);
    var issueColor = "#E10";

    if (subtleZigZags(segmentProperties)) {
        foundIssue = true;
    }
    var modifications = new Object();
    if (foundIssue) {
        modifications.color = issueColor;
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightZigZagsComponents.getBackground = function() {
    return 'rgba(238,16,0,0.5)';
};



//  
// USER SELECTIONS DEFINITIONS FILE  
//  
var RoadTypeString = {
    1 : "Streets",
    2 : "Primary Street",
    3 : "Freeways",
    4 : "Ramps",
    5 : "Walking Trails",
    6 : "Major Highway",
    7 : "Minor Highway",
    8 : "Dirt roads",
    10 : "Pedestrian Bw",
    16 : "Stairway",
    17 : "Private Road",
    18 : "Railroad",
    19 : "Runway/Taxiway",
    20 : "Parking Lot Road",
    21 : "Service Road"
};

var speedColor = new WMEFunction("_cbHighlightSpeed", "Speed");
var MAX_THRESHOLD_SPEED = 100;
var MIN_WIDTH_SPEED = 4;
var MAX_WIDTH_SPEED = 10;
var MIN_OPACITY_SPEED = 0.4;
var MAX_OPACITY_SPEED = 0.99;

speedColor.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    var speedToUse = getSegmentSpeed(wazeLineSegment.segment);
    if (isNaN(speedToUse)) {
        speedToUse = 0;
    }
    var percentageWidth = Math.min(speedToUse, MAX_THRESHOLD_SPEED - 1) / MAX_THRESHOLD_SPEED;
    modifications.opacity = ((MAX_OPACITY_SPEED - MIN_OPACITY_SPEED) * percentageWidth) + MIN_OPACITY_SPEED;
    modifications.width = ((MAX_WIDTH_SPEED - MIN_WIDTH_SPEED) * percentageWidth) + MIN_WIDTH_SPEED;
    if (speedToUse < 1) {
        modifications.color = "#000";
        modifications.opacity = 0.2;
    } else {
        modifications.color = getScaledColour(speedToUse, 100);
    }
    return modifications;
};

/*
 * HIGHLIGHT NO CITY
 */
var highlightNoCity = new WMEFunction("_cbHighlightNoCity", "No City");
highlightNoCity.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.noCity) {
        modifications.color = "#ff0";
        modifications.opacity = 0.3;
    }
    return modifications;
};
highlightNoCity.getBackground = function() {
    return 'rgba(255,255,0,0.3)';
};

/*
 * highlight UNNAMED
 */
var highlightNoName = new WMEFunction("_cbHighlightUnnamed", "Unnamed Street");
highlightNoName.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.noName) {
        if (isTrafficRelevant(wazeLineSegment.attributes.roadType)) {
            modifications.color = "#424";
            modifications.opacity = 0.7;
        }
    }
    return modifications;
};
highlightNoName.getBackground = function() {
    return 'rgba(64,32,64,0.7)';
};

/*
 * highlight HOUSE NUMBERS
 */
var highlightHasHNs = new WMEFunction("_cbHighlightHNs", "Has House Numbers");
highlightHasHNs.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.attributes.hasHNs) {
        modifications.color = "#0f0";
        modifications.opacity = 0.4;
        modifications.dasharray = "5 20";
    }
    return modifications;
};
highlightHasHNs.getBackground = function() {
    return 'rgba(0,255,0,0.4)';
};

/*
 * highlight ALTERNATE NAME
 */
var highlightWithAlternate = new WMEFunction("_cbHighlightWithAlternate", "With Alternate Name");
highlightWithAlternate.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.secondaryStreetInfos.length > 0) {
        modifications.color = "#FFFF00";
        modifications.opacity = 0.7;
    }
    return modifications;
};
highlightWithAlternate.getBackground = function() {
    return 'rgba(256,256,0,0.7)';
};

/*
 * highlight Extra Spaces in name
 */
var highlightExtraSpaces = new WMEFunction("_cbhighlightExtraSpaces", "Extra Spaces");
highlightExtraSpaces.getModifiedAttrs = function(wazeLineSegment) {
    if (wazeLineSegment.noName) { return  }
    var streetName = wazeLineSegment.getStreetName();
    if(!streetName) { return  }
    if(streetName.trim() != streetName || streetName.indexOf("  ") != -1) {
        var modifications = new Object();
        modifications.color = "#FF00FF";
        modifications.opacity = 0.7;
        return modifications;
    }
};
highlightExtraSpaces.getBackground = function() {
    return 'rgba(255,0,255,0.7)';
};

/*
 * highlight Empty alternate street
 */
var highlightEmptyAltStreetName = new WMEFunction("_cbighlightEmptyAltStreetName", "Empty alternate street");
highlightEmptyAltStreetName.getModifiedAttrs = function(wazeLineSegment) {
    for(var strIDIndx = 0; strIDIndx < wazeLineSegment.secondaryStreetInfos.length; strIDIndx++) {
        if(wazeLineSegment.secondaryStreetInfos[strIDIndx].noName) {
           var modifications = new Object();
            modifications.color = "#FF00FF";
            modifications.opacity = 0.7;
            return modifications;
        }
    }
};
highlightEmptyAltStreetName.getBackground = function() {
    return 'rgba(255,0,255,0.7)';
};

/*
 * highlight Invalid Abbreviations
 */
var highlightInvalidAbbrevs = new WMEFunction("_cbhighlightInvalidAbbrev", "Invalid Abbreviations");
highlightInvalidAbbrevs.getModifiedAttrs = function(wazeLineSegment) {
    if (wazeLineSegment.noName) { return  }
    var streetName = wazeLineSegment.getStreetName();
    if(!streetName) { return  }
    var idxOfPeriod = streetName.indexOf(".")
    if(idxOfPeriod != -1 && idxOfPeriod == streetName.length - 1) {
        var modifications = new Object();
        modifications.color = "#FF11AA";
        modifications.opacity = 0.7;
        return modifications;
    }
};
highlightInvalidAbbrevs.getBackground = function() {
    return 'rgba(255,17,170,0.7)';
};

/*
 * highlight self connectivity
 */
var highlightSelfConnectivity = new WMEFunction("_cbhighlightSelfConnectivity", "Self connectivity");
highlightSelfConnectivity.getModifiedAttrs = function(wazeLineSegment) {
    if (wazeLineSegment.attributes.fromNodeID == wazeLineSegment.attributes.toNodeID) {
		return ERROR_MODS;
    }
};
highlightSelfConnectivity.getBackground = function() {
    return ERROR_RGBA;
};

/*
 * highlight U-Turn at Dead End
 */
var highlightUTurnAtEnd = new WMEFunction("_cbhighlightUTurnAtEnd", "U-Turn at dead end");
highlightUTurnAtEnd.getModifiedAttrs = function(wazeLineSegment) {
	var toNodeDeadEndUturn = wazeLineSegment.ToNode.UTurnAllowed(wazeLineSegment.id) && wazeLineSegment.ToNode.isDeadEnd();
	var fromNodeDeadEndUturn = wazeLineSegment.FromNode.UTurnAllowed(wazeLineSegment.id) && wazeLineSegment.FromNode.isDeadEnd();
    if (toNodeDeadEndUturn || fromNodeDeadEndUturn) {
        var modifications = new Object();
        modifications.color = "#FF11AA";
        modifications.opacity = 0.7; 
        return modifications;
    }
};
highlightUTurnAtEnd.getBackground = function() {
    return 'rgba(255,17,170,0.7)';
};

/*
 * highlight three point segment
 */
var highlightThreePointSegment = new WMEFunction("_cbhighlightThreePointSegment", "Three Point Segment");
highlightThreePointSegment.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    var toNodeSegIDs = wazeLineSegment.ToNode.attributes.segIDs;
    var fromNodeSegIDs = wazeLineSegment.FromNode.attributes.segIDs;
	var commonNodesFromTo = (toNodeSegIDs.filter(function(n) { return n != wazeLineSegment.id && fromNodeSegIDs.indexOf(n) != -1 }))
	var commonNodesFromFrom = (fromNodeSegIDs.filter(function(n) { return n != wazeLineSegment.id && toNodeSegIDs.indexOf(n) != -1 }))
	var commonSegment = commonNodesFromTo.length > 0 || commonNodesFromFrom.length > 0;
    if(commonSegment) {
        modifications.color = "#FF11AA";
        modifications.opacity = 0.7; 
    }

    return modifications;
};
highlightThreePointSegment.getBackground = function() {
    return 'rgba(255,17,170,0.7)';
};

/*
 * highlight CONST ZN
 */
var highlightConstZn = new WMEFunction("_cbHighlightConstZn", "CONST ZN Street");
highlightConstZn.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();

    if (!wazeLineSegment.noName && wazeLineSegment.getStreetName().indexOf('CONST ZN') != -1) {
        modifications.color = "#FF6600";
        modifications.dasharray = "2 15";
        modifications.opacity = 0.7;
    }
    return modifications;
};
highlightConstZn.getBackground = function() {
    return 'rgba(255,102,0,0.7)';
};

function getCurrentHoverSegment() {
    return highlightSegmentMonitor.getLatestSegment();
}

/*
 * highlight SAME NAME
 */
var highlightSameName = new WMEFunction("_cbHighlightSameName", "Same Street Name");
highlightSameName.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    var segment = getCurrentHoverSegment();
    if (segment != null) {
        var highlightedStreetID = segment.attributes.primaryStreetID;
        if (wazeLineSegment.attributes.primaryStreetID === highlightedStreetID) {
            if (wazeLineSegment.segment.fid !== segment.fid) {
                modifications.dasharray = "5 15";
            }
            modifications.color = "#0ad";
            modifications.opacity = 0.5;
        }
    }
    return modifications;
};
highlightSameName.getBackground = function() {
    return 'rgba(0,160,208,0.5)';
};

/*
 * highlight TOLL
 */
var highlightToll = new WMEFunction("_cbHighlightToll", "Toll");
highlightToll.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.attributes.fwdToll) {
        modifications.color = wazeLineSegment.attributes.locked ? "#ff0000" : "#00f";
        modifications.opacity = 0.5;
        modifications.dasharray = "5 15";
    }
    return modifications;
};
highlightToll.getBackground = function() {
    return 'rgba(0,0,255,0.5)';
};

/*
 * highlight NO DIRECTION
 */
var highlightNoDirection = new WMEFunction("_cbHighlightNoDirection", "Unknown Direction");
highlightNoDirection.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.noDirection) {
        modifications.color = "#100";
        modifications.opacity = 0.8;
    }
    return modifications;
};
highlightNoDirection.getBackground = function() {
    return 'rgba(10,0,0,0.8)';
};

/*
 * highlight ONE WAY
 */
var highlightOneWay = new WMEFunction("_cbHighlightOneWay", "One Way");
highlightOneWay.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.oneWay) {
        modifications.color = "#00f";
        modifications.opacity = 0.2;
    }
    return modifications;
};
highlightOneWay.getBackground = function() {
    return 'rgba(0,0,255,0.2)';
};
highlightOneWay.getDetail = function(segment) {
    return isOneWay(segment);
};

/*
 * highlight NON A->B ONE WAY
 */
var highlightNonABOneWay = new WMEFunction("_cbHighlightNonABOneWay", "Non A&rarr;B One Way");
highlightNonABOneWay.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.oneWay && wazeLineSegment.attributes.revDirection) {
        modifications.color = "#a00";
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightNonABOneWay.getBackground = function() {
    return 'rgba(160,0,0.5)';
};


/*
 * highlight UNTERMINATED
 */

var highlightNoTerm = new WMEFunction("_cbHighlightNoTerm", "Unterminated");
highlightNoTerm.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.attributes.toNodeID == null || wazeLineSegment.attributes.fromNodeID == null) {
        modifications.color = "#FC0";
        modifications.opacity = 0.7;
    }
    return modifications;
};
highlightNoTerm.getBackground = function() {
    return 'rgba(255,208,0,0.7)';
};

var highlightEditor = new WMEFunctionExtended("_cbHighlightEditor", "Specific Editor");
highlightEditor.getModifiedAttrs = function(wazeLineSegment) {
    var selectUser = getId(highlightEditor.getSelectId());
    var selectedUserId = selectUser.options[selectUser.selectedIndex].value;
    var updatedBy = wazeLineSegment.attributes.updatedBy;

    var modifications = new Object();
    if (updatedBy == selectedUserId) {
        modifications.color = "#00ff00";
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightEditor.buildExtended = function() {
    return '<select id="' + this.getSelectId() + '" name="' + this.getSelectId() + '"><br />';
}
highlightEditor.init = function() {
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onchange = this.getSelectFieldChangeFunction();
}
highlightEditor.getBackground = function() {
    return 'rgba(0,255,0,0.5)';
};

/*
 * RECENTLY Edited
 */
var highlightRecent = new WMEFunctionExtended("_cbHighlightRecent", "Recently Edited");
highlightRecent.getModifiedAttrs = function(wazeLineSegment) {
    var numDays = getId(this.getSelectId()).value;
    if (numDays == undefined) {
        numDays = 0;
    }
    var tNow = new Date();
    var tDif = (tNow.getTime() - wazeLineSegment.updatedOn.getTime()) / 86400000;
    var modifications = new Object();

    if (numDays >= 0 && tDif <= numDays) {
        var heatScale = 0.75 / numDays;
        modifications.color = "#0f0";
        modifications.opacity = Math.min(0.999999, 1 - (tDif * heatScale));
    }
    return modifications;
};
highlightRecent.buildExtended = function() {
    return '<input type="number" min="0" max="365" size="3" value="7" id="' + this.getSelectId() + '" /> days';
}
highlightRecent.init = function() {
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onfocus = populateUserList;
    getId(this.getSelectId()).onchange = highlightSegments;
};
highlightRecent.getBackground = function() {
    return 'rgba(0,255,0,0.7)';
};

/*
 * LOCKED segments
 */
var highlightLocked = new WMEFunctionExtended("_cbHighlightLocked", "Locked");
highlightLocked.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (wazeLineSegment.attributes.locked) {
        modifications.color = "#B00";
        modifications.opacity = 0.8;
    }
    return modifications;
};
highlightLocked.getBackground = function() {
    return 'rgba(176,0,0,0.8)';
};

/*
 * highlight RESTRICTIONS
 */
var highlightSegmentRestrictions = new WMEFunction("_cbhighlightSegmentRestrictions", "Segment Restrictions");
highlightSegmentRestrictions.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    if (hasRestrictions(wazeLineSegment.attributes)) {
        modifications.color = "#FAFF00";
        modifications.dasharray = "2 15";
        modifications.opacity = 0.8;
    }
    return modifications;
};
highlightSegmentRestrictions.getBackground = function() {
    return 'rgba(250,255,0,0.8)';
};

/*
 * highlight ROAD TYPE
 */
var highlightRoadType = new WMEFunctionExtended("_cbHighlightRoadType", "Road Type");
highlightRoadType.roadTypeStrings = RoadTypeString;
highlightRoadType.getModifiedAttrs = function(wazeLineSegment) {

    var currentRoadTypeElement = getId(this.getSelectId());
    var currentRoadType = currentRoadTypeElement.options[currentRoadTypeElement.selectedIndex].value;
    if (currentRoadType == undefined) {
        currentRoadType = 0;
    }

    var modifications = new Object();
    if (currentRoadType == wazeLineSegment.attributes.roadType) {
        modifications.color = "#0f0";
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightRoadType.buildExtended = function() {
    return '<select id="' + this.getSelectId() + '" name="' + this.getSelectId() + '">';
}
highlightRoadType.init = function() {
    populateOption(this.getSelectId(), this.roadTypeStrings);
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onchange = this.getSelectFieldChangeFunction();
};
highlightRoadType.getBackground = function() {
    return 'rgba(0,255,0,0.5)';
};

/*
 * highlight City
 */
var highlightCity = new WMEFunctionExtended("_cbHighlightCity", "City");
highlightCity.getModifiedAttrs = function(wazeLineSegment) {

    var currentCityElement = getId(this.getSelectId());
    var currentCity = currentCityElement.options[currentCityElement.selectedIndex].value;
    if (currentCity == undefined) {
        currentCity = 0;
    }

    var modifications = new Object();
    if (currentCity == wazeLineSegment.cityID) {
        modifications.color = "#0f0";
        modifications.opacity = 0.5;
    } else if (currentCity == WME_SPEED_UNKNOWN && wazeLineSegment.noCity) {
        modifications.color = "#0f0";
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightCity.buildExtended = function() {
    return '<select id="' + this.getSelectId() + '" name="' + this.getSelectId() + '">';
}
highlightCity.init = function() {
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onchange = this.getSelectFieldChangeFunction();
};
highlightCity.getBackground = function() {
    return 'rgba(0,255,0,0.5)';
};
highlightCity.getDetail = function(segment) {
    return;
};

/*
 * highlight Street
 */
var highlightStreet = new WMEFunctionExtended("_cbHighlightStreet", "Street");
highlightStreet.getModifiedAttrs = function(wazeLineSegment) {

    var currentCityElement = getId(this.getSelectId());
    var currentCity = currentCityElement.options[currentCityElement.selectedIndex].value;
    if (currentCity == undefined) {
        currentCity = 0;
    }

    var modifications = new Object();
    if (currentCity == wazeLineSegment.cityID) {
        modifications.color = "#0f0";
        modifications.opacity = 0.5;
    } else if (currentCity == WME_SPEED_UNKNOWN && wazeLineSegment.noCity) {
        modifications.color = "#0f0";
        modifications.opacity = 0.5;
    }
    return modifications;
};
highlightStreet.buildExtended = function() {
    return '<select id="' + this.getSelectId() + '" name="' + this.getSelectId() + '">';
}
highlightStreet.init = function() {
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onchange = this.getSelectFieldChangeFunction();
};
highlightStreet.getBackground = function() {
    return 'rgba(0,255,0,0.5)';
};

/*
 * highlight Short Segments
 */
var highlightShortSegments = new WMEFunctionExtended("_cbHighlightShortSegments", "Short");
highlightShortSegments.getModifiedAttrs = function(wazeLineSegment) {
    var length = getId(this.getSelectId()).value;
    if (length == undefined) {
        length = 0;
    }

    var modifications = new Object();
    if (wazeLineSegment.attributes.length < length) {
        modifications.color = "#f33";
        modifications.opacity = 0.8;
        modifications.width = 15;
    }
    return modifications;
};
highlightShortSegments.buildExtended = function() {
    return '<input type="number" min="0" max="100" value="5" size="3" id="' + this.getSelectId() + '" /> meters';
}
highlightShortSegments.init = function() {
    getId(this.getCheckboxId()).onclick = highlightSegments;
    getId(this.getSelectId()).onchange = highlightSegments;
    getId(this.getSelectId()).onchange = highlightSegments;
};
highlightShortSegments.getBackground = function() {
    return 'rgba(255,51,51,0.8)';
};

/*
 * highlight NULL
 */
var highlightNull = new WMEFunction("_cbHighlightNull", "NULL");
highlightNull.getModifiedAttrs = function(wazeLineSegment) {
    var modifications = new Object();
    modifications.color = "#dd7700";
    modifications.opacity = 0.001;
    modifications.dasharray = "none";
    modifications.width = 8;
    return modifications;
};

/* *************************************************** */

/*
 * Sections of highlighters
 */
var highlightSection = new SelectSection("Highlight Segments", 'WME_Segments_section', [highlightOneWay, highlightToll, highlightNoName, highlightWithAlternate, highlightCity, highlightRoadType, highlightSameName, highlightConstZn, highlightSegmentRestrictions]);
// Disabled:
// ----------------
// speedColor


var geometrySection = new SelectSection("Geometry", 'WME_geometry_section', [highlightExcessComponents, highlightLowAngles, highlightZigZagsComponents, highlightCloseComponents, highlightNoTerm, highlightShortSegments]);
var issuesSection = new SelectSection("Potential Issues", 'WME_issues_section', [highlightSelfConnectivity, highlightExtraSpaces, highlightEmptyAltStreetName, highlightInvalidAbbrevs, highlightNoDirection, highlightThreePointSegment]);
// Disabled:
// ----------------
// highlightUTurnAtEnd

var advancedSection = new SelectSection("Advanced", 'WME_Advanced_section', [highlightEditor, highlightRecent, highlightLocked, highlightNonABOneWay, highlightHasHNs]);

var selectSections = [highlightSection, issuesSection, geometrySection, advancedSection];

var allModifiers = [];
/**  The list of all modifiers to display **/
for (var i = 0; i < selectSections.length; i++) {
    allModifiers = allModifiers.concat(selectSections[i].selections);
}

var hoverDependentSections = [highlightSameName];
// var allModifiers = [geometrySection.selections, highlightSection.selections, advancedSection.selections];
//  
// POPUP DIALOG  
//  
var WME_SPEED_Popup = document.createElement('div');
WME_SPEED_Popup.id = 'WME_SPEED_Popup';
getId('editor-container').appendChild(WME_SPEED_Popup);

function getDirectionalSection(segment, isFreeway) {
    var userString = "";
    // Add "One Way" arrow
    if(!isFreeway && isOneWay(segment)) {
        userString += "<div style='background: #000; color:#fff;font-size:.92em;font-weight:bold;line-height:.7em;'>"
        userString += "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAARCAAAAAC6bKD1AAABp0lEQVR4XpXRX0hTcRyH4dfDZDW0CSPWqoVnEQghXfQHodNVXYaRYGAXFVjkRRTBumgjCJMZWkMLgnkRWWIorYZhrVKSwv5ehLnFcSw4DaE11s1ghcnhF4yzc+487Ll/4cvnSyHzfLoGL7K/UXdgwztyBEtrhqfYaRdiYhOmV5KOnflVjqVOYHIAbF7PWtRWPKNdPT8wJIA5IRbiZTEn/n7Uksl3QuS/Lau5rFj8mdJE+bWoKJ2TjMOoeN+ZOMrhZCH4uPfRLCz13rp0b4auwVLH6rUZKhpvv2kBwEjGIveLy86QDh3RMMja289ZOS1N7dt9PhHCsP9LuN5K8s0055v2jsKNtjL4tF87X8qTBz0f+icHXFSt63tYZybeHDkvV2MQTjeAo3HPgeLWuFo34Qm0YdKHTgozOR46s8GPrwfiFy4DsqL4ljY+S07rWNLKxXJ1ZFDGMlFiBA/5tlMP9PsbHjTdwX135aabCv5dj6xYfznlAvqoCmIwjO8CPp1eBCvRWIu7Bf5cGdapJhJ2FCezZ79jSW3BxrYn3RKmgEphYaomX4v/Ae4Q1fDFrZZBAAAAAElFTkSuQmCC' />"
        userString += "</div>"
     }
     // Add "No Entrance" hint
     else if(isNoDirection(segment)) {
        userString += "<div style='max-height:17px;height:17px; background-color:#C00000;padding:0;border:0;'>"
        userString += "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAARCAMAAABdJ4SrAAAAVFBMVEXAAAD////JJCTjjY3yycnLLS389fXNNTXEERHJJibooqLhh4fww8PVVFTHHR3XXl7VV1fTTEzxxsbLKyvrrKzGGhr9+fnjjIzggYHRRUXjjo7QPz/hgZD7AAAAS0lEQVR4Xt3LtwHAMAwDMMnpvff//8zKlfRm7LA0VIFVjNDr0mkd/MZ5LfxH+D38Qfg5/Cnyz5F/Ef4KfxP+Dv84+X8ZuDPW+1kKfk1aBDuOnLwdAAAAAElFTkSuQmCC' style='margin:0; padding:0; border:0;' />"
        userString += "</div>"
    }
    return userString;           
}
function showProps(obj, objName) {
  var result = "";
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
        result += objName + "." + i + " = " + obj[i] + "\n";
    }
  }
  return result;
}

function getPropsHTML(segment, matchingActions, namingMap, otherItemsMap) {
    matchingActions = typeof matchingActions !== 'undefined' ? matchingActions : {};
    namingMap = typeof namingMap !== 'undefined' ? namingMap : {};
    otherItemsMap = typeof otherItemsMap !== 'undefined' ? otherItemsMap : {};
    var userString = ""
    if(true) {
        userString += "<div id='segment_details' style='font-size: 0.6em'>"
        if(false)  {
            userString += "hasEmptyStreet: " + segment.hasEmptyStreet() + "<br />"
            var segAddress = segment.getAddress();
            userString += "getAddress: " + segAddress + "<br />"
            for (var addritem in segAddress) {
                userString += "addr item: " + addritem + "<br />"
            }
            var segAddressDetails = segment.getAddressDetails();
            userString += "getAddressDetails: " + segAddressDetails + "<br />"
            for (var addritemDetail in segAddressDetails) {
                userString += "addr item detail: " + addritemDetail + "<br />"
            }
        }
        if(true) {
//            userString += "getRevHeading: " + segment.getRevHeading() + "<br />"
//            userString += "getFwdHeading: " + segment.getFwdHeading() + "<br />"
            for(var keyname in segment.attributes) {
                var keyNameString = namingMap[keyname] ? namingMap[keyname] : keyname;
                var action = matchingActions[keyname];
                if(action) {
                    var actionResult = action(segment.attributes)
                    if(actionResult) {
                        userString += keyNameString + ": " + actionResult + "<br />"
                    }
                } else {
                    var value = segment.attributes[keyname];
                    if(value != null) {
                        userString += keyNameString + ": " + value + "<br />"
                    }
                }
                
            }
            for(var otherName in otherItemsMap) {
                var action = otherItemsMap[otherName];
                if(action) {
                    var actionResult = action(segment)
                    if(actionResult) {
                        userString += otherName + ": " + actionResult + "<br />"
                    }
                }
            }
        }
        userString += "</div>"
    }
    return userString;
}
function showPopup(segment) {
    var user = Waze.loginManager.getLoggedInUser();
//	var segment = getCurrentHoverSegment();
    if(segment != null && segment.CLASS_NAME == "Waze.Feature.Vector.Segment") {
//       console.log(showProps(segment, "segment"));
//       console.log(showProps(segment.attributes, "segment.attributes"));
//        var cmpnnts = segment.geometry.components;
//        var compSegs = getComponentsProperties(cmpnnts);
        var popupClass = "";
		if(segment.attributes.lockRank > 0) {
            if(segment.attributes.lockRank > user.rank) {
                popupClass += "userlocked";
            }
            else {
                popupClass += "locked";
            }
		}
        var userString = "<div id='popup_container' class='" + popupClass + "'>";
        
        var sid = segment.attributes.primaryStreetID;
        var street = Waze.model.streets.get(sid);
        if(typeof street != 'undefined') {
            var isFreeway = false;
            var streetStyleClass = 'WME_SPEED_streetSign';
			switch(segment.attributes.roadType) {
			case 3 : //freeway
                isFreeway = true;
                break;
			case 17: // Private Road
				streetStyleClass = 'WME_SPEED_privateStreet';
				break;
			case 20: // Parking Lot Road
				streetStyleClass = 'WME_SPEED_parkingLot';
				break;
			case 5:  //Walking Trails
			case 10: //Pedestrian Bw
				streetStyleClass = 'WME_SPEED_trailSign';
                break;
            case 8: // Dirt Road
                streetStyleClass = 'WME_SPEED_dirtRoadSign';
                break;
            case 18: // Railroad
                streetStyleClass = 'WME_SPEED_railroadSign';
                break;
			default: 
				break;
			}
            if(sid) {
                var streetName = street.name; 
                if(streetName == null || streetName == "") {
                   streetName = '[UNKNOWN]';
                   streetStyleClass += " WME_SPEED_unknownName";
                }
                var alternateSection = "";
                if(segment.attributes.streetIDs && segment.attributes.streetIDs.length > 0) {
                    alternateSection += "<div class='WME_SPEED_alternateName'>";
                    for(var i = 0; i < segment.attributes.streetIDs.length; i++) {
                        var altStreet = Waze.model.streets.get(segment.attributes.streetIDs[i]);
                        alternateSection += '<div class="' + streetStyleClass + '">' + altStreet.name + '</div>';
                    }
                    alternateSection += "</div>";
                }
                var isInterstate = false;
                if(isFreeway) { // freeway
                    var regexMatch = streetName.match(InterstateRegEx);
                    if(regexMatch != null) {
                        isInterstate = true;
                        streetStyleClass = 'WME_SPEED_interstate';
                        var interstateNum = regexMatch.first().substr(2).trim();
                        streetName = interstateNum;
                    }
                }
                
                // Add "Toll"
                if(segment.attributes.revToll || segment.attributes.fwdToll) {
                    userString += "<div id='WME_SPEED_tollRoad'>Toll</div>"
                }
                
                userString += getDirectionalSection(segment, isFreeway);

                userString += "<div id='popup_street_name' class='" + streetStyleClass + "'>";
                var streetNamePieces = streetName.split('/');
                for(var snpIndex = 0; snpIndex < streetNamePieces.length; snpIndex++) {
                    var prefixStr = "";
                    var suffixStr = "";
                    var steetNamePiece = streetNamePieces[snpIndex].trim();
                    for(var i = 0; i < FRONT_ABBREVS.length; i++) {
                        var strToMatch = FRONT_ABBREVS[i] + " ";
                        var startIndex = steetNamePiece.search(strToMatch)
                        if(startIndex == 0) {
                            prefixStr = "<span id='street_name_prefix'>" + steetNamePiece.slice(startIndex,strToMatch.length) + "</span>";
                            steetNamePiece = steetNamePiece.slice(strToMatch.length);
                            break;
                        }
                    }
                    for(var i = 0; i < END_ABBREVS.length; i++) {
                        var strToMatch = " " + END_ABBREVS[i];
                        var expectedIndex = steetNamePiece.length - strToMatch.length;
                        if(expectedIndex > 0 && steetNamePiece.search(strToMatch) == expectedIndex) {
                            suffixStr = "<span id='street_name_suffix'>" + steetNamePiece.slice(expectedIndex) + "</span>";
                            steetNamePiece = steetNamePiece.slice(0, expectedIndex);
                            break;
                        }
                    }
                    userString += prefixStr + steetNamePiece + suffixStr;
                    if(snpIndex != streetNamePieces.length - 1) {
                        userString += '<br />';
                    }
                }
                userString += "</div>";
            }
            var city = Waze.model.cities.get(street.cityID);
            if(city && city.name) {
                userString += "<div id='popup_street_city' class='" + streetStyleClass + "'>"
                userString += city.name;
                userString += "</div>"
            }
            userString += alternateSection;
        }
        
        var speedToUse = getSegmentSpeed(segment);
        if(!isNaN(speedToUse) || typeof speedToUse === "string") {
            userString += "<div id='popup_speed'>"
            userString += "<div id='popup_speed_header'>SPEED<br />LIMIT</div><div id='popup_speed_value'>" + speedToUse + "</div>"
            userString += "</div>";
        }
        // roadTypeToString
        userString += getPropsHTML(segment, 
            {
            'createdOn': function(segmentAttr) { 
                var dateVal = new Date(segmentAttr.createdOn)
                return dateToDateString(dateVal);
            }, 
            'updatedOn': function(segmentAttr) { 
                var dateVal = new Date(segmentAttr.updatedOn)
                return dateToDateString(dateVal);
            }, 
            'roadType' : function(segmentAttr) { return roadTypeToString(segmentAttr.roadType); },
            'length' : function(segmentAttr) { return lengthToString(segmentAttr.length); },
            'fwdRestrictions' : function(segmentAttr) { return hasRestrictions(segmentAttr) ? "Yes" : undefined },
            'revRestrictions' : function(segmentAttr) {},
            'version' : function(segmentAttr) {},
            'separator' : function(segmentAttr) {},
            'fromNodeID' : function(segmentAttr) {},
            'toNodeID' : function(segmentAttr) {},
            'level' : function(segmentAttr) {},
            'validated' : function(segmentAttr) {},
            'createdBy' : function(segmentAttr) {},
            'updatedBy' : function(segmentAttr) {},
            'primaryStreetID' : function(segmentAttr) {},
            'streetIDs' : function(segmentAttr) {},
            'permissions' : function(segmentAttr) {},
            'fwdTurnsLocked' : function(segmentAttr) {},
            'revTurnsLocked' : function(segmentAttr) {},
            'fwdToll' : function(segmentAttr) { return undefined  },
            'revToll' : function(segmentAttr) {},
            'allowNoDirection' : function(segmentAttr) {},
            'lockRank' : function(segmentAttr) {},
            'rank' : function(segmentAttr) {},
            'type' : function(segmentAttr) {},
            'fwdDirection' : function(segmentAttr) {},
            'revDirection' : function(segmentAttr) {},
        }, {'hasHNs' : "Has House Numbers",
			'roadType' : "Road Type", 
			'fwdRestrictions' : "Restrictions",
            'fwdToll' : "Toll Road" }, {
            "Segments" : function(segmnt) { return segmnt.geometry.components.length}
            });

        var checkedMods = checkedModifiers()
        for(var i = 0; i < checkedMods.length; i++) {
            var checkedVal = checkedMods[i].getDetail(segment);
            if(typeof checkedVal != 'undefined') {
                userString += checkedMods[i].text + ': ' + checkedVal + '<br />';
            }
        }
        userString += "</div>"

        WME_SPEED_Popup.innerHTML = userString;
    }
    else {
        WME_SPEED_Popup.innerHTML = "";
    }
}//  
// CORE FILE  
//  

var DEBUG = true;
function debug(message) {
    if(DEBUG) {
        console.log(message);
    }
}

var possibleWazeMapEvents = ["mouseout", "zoomend"];
var possibleControllerEvents = ["loadend"];
var possiblePendingControllerEvents = [];
var possibleSelectionModifyEvents = ["deactivate", "featuredeselected"];
var possibleSelectionEvents = ["selectionchanged"];
var possibleSelectionModifyHoverEvents = [];
var possibleActionEvents = [];


var webStorageSupported = ('localStorage' in window) && window['localStorage'] !== null;

function checkedModifiers() {
    var checkedModifiers = [];
	for (var i = 0; i < allModifiers.length; i++) {
		var segModGroup = allModifiers[i];
		var isChecked = getId(segModGroup.getCheckboxId()).checked
		if (isChecked) {
			checkedModifiers[checkedModifiers.length] = segModGroup;
		}
    }
    return checkedModifiers;
}

function highlightAllSegments() {
    modifySegements(highlightNull);
    highlightSegments(allModifiers);
}

function highlightSegments(modifiers) {
    if(!modifiers) {
        modifiers = allModifiers;
    }
	for (var i = 0; i < modifiers.length; i++) {
		var segModGroup = modifiers[i];
		var isChecked = getId(segModGroup.getCheckboxId()).checked
		if (isChecked) {
			modifySegements(segModGroup);
		}
		if(webStorageSupported) {
			if(isChecked) {
				window.localStorage.setItem(segModGroup.checkboxId, 'checked');
			} else {
				window.localStorage.removeItem(segModGroup.checkboxId);
			}
		}
	}
	return true;
}

function enumerateAllModifiers(work) {
    for (var i = 0; i < allModifiers.length; i++) {
        var segModGroup = allModifiers[i];
        work(segModGroup);
    }
}

function modifySegements(modifier) {
    for (var seg in Waze.model.segments.objects) {
        var segment = Waze.model.segments.get(seg);
        var attributes = segment.attributes;
        var line = getId(segment.geometry.id);

        if (line != null) {
            var sid = attributes.primaryStreetID;
            if (sid == null)
                continue;
			if(Waze.model.streets.get(sid) == null) {
				continue;
			}
            var currentColor = line.getAttribute("stroke");
            var currentOpacity = line.getAttribute("stroke-opacity");
            var currentDashes = line.getAttribute("stroke-dasharray");
            var currentWidth = line.getAttribute("stroke-width");

            // check that WME hasn't highlighted this segment
            if (currentOpacity == 1 || currentWidth == 9) {
                continue;
            }

            var roadType = attributes.roadType;
            if (Waze.map.zoom <= 3 && (roadType < 2 || roadType > 7)) {
                if (currentOpacity > 0.1) {
                    line.setAttribute("stroke", "#dd7700");
                    line.setAttribute("stroke-opacity", 0.001);
                    line.setAttribute("stroke-dasharray", "none");
                }
                continue;
            }

            var wazeLineSeg = new WazeLineSegment(segment);
            var lineMods = modifier.getModifiedAttrs(wazeLineSeg);
			
			if((typeof lineMods === "undefined") || lineMods == null) {
				continue;
			}

            var newColor = lineMods.color ? lineMods.color : currentColor;
            line.setAttribute("stroke", newColor);

            if (lineMods.color && lineMods.color != currentColor) {
            }
            if (lineMods.opacity && lineMods.opacity != currentOpacity) {
                line.setAttribute("stroke-opacity", lineMods.opacity);
            }
            if (lineMods.dasharray && lineMods.dasharray != currentDashes) {
                line.setAttribute("stroke-dasharray", lineMods.dasharray);
            }
            if (lineMods.width && lineMods.width != currentWidth) {
                line.setAttribute("stroke-width", lineMods.width);
            }
        }
    }
}

// add logged in user to drop-down list
function initUserList() {
    var thisUser = Waze.loginManager.getLoggedInUser();
    var selectUser = getId(highlightEditor.getSelectId());
    var usrOption = document.createElement('option');
    var usrText = document.createTextNode(thisUser.userName + " (" + thisUser.rank + ")");
    usrOption.setAttribute('value', thisUser.id);
    usrOption.appendChild(usrText);
    selectUser.appendChild(usrOption);
}

function populateOption(selectId, optionsMap) {
    var select = getId(selectId);
    var currentId = null;
    if (select.selectedIndex >= 0) {
        currentId = select.options[select.selectedIndex].value;
    }
    select.options.length = 0;

    var foundSelected = false;
    for (var key in optionsMap) {
        var text = optionsMap[key];
        var selectOption = document.createElement('option');
        var selectText = document.createTextNode(text);
        if (currentId != null && key == currentId) {
            selectOption.setAttribute('selected', true);
            foundSelected = true;
        }
        selectOption.setAttribute('value', key);
        selectOption.appendChild(selectText);
        select.appendChild(selectOption);
    }

}

// populate drop-down list of Cities
function populateCityList() {
    var cityIds = new Object();
    cityIds[WME_SPEED_UNKNOWN] = "No City";
    for (var cit in Waze.model.cities.objects) {
        var city = Waze.model.cities.get(cit);
        if (city && cityIds[city.id] == null && city.name != null && city.name.length > 0) {
            var cityName = city.name;
            var state = Waze.model.states.get(city.stateID);
            if(state && state.name != null && state.name.length > 0) {
                cityName += ', ' + state.name;
            }
            cityIds[city.id] = cityName;
        }
    }
    populateOption(highlightCity.getSelectId(), cityIds);  
}

// populate drop-down list of editors
function populateUserList() {
    var editorIds = new Object();
    for (var seg in Waze.model.segments.objects) {
        var segment = Waze.model.segments.get(seg);
        var updatedBy = segment.attributes.updatedBy;
        if (editorIds[updatedBy] == null) {
            var user = Waze.model.users.get(updatedBy);
            if (user == null || user.userName.match(/^world_|^usa_/) != null) {
                continue;
            }
            editorIds[updatedBy] = user.userName;
        }
    }
    populateOption(highlightEditor.getSelectId(), editorIds);
}

function createSectionHeader(title, opened) {
    var indicator = "&lt;&lt;"
    if(!opened) {
        indicator = "&gt;&gt;"
    }
    return '<span style="font-size:1.2em;"><b>' + title + '</b></span><span style="float:right;padding:0;margin:0 0 0 2px;border: 1px solid #999; background: #aaa; color:#fff;">' + indicator + '</span>'
}

function createSection(sectionItem) {
    var thisSectionItem = sectionItem;
    // advanced options
    var section = document.createElement('div');
    section.style.marginTop = "4px";
    section.style.padding = "4px";
    section.style.borderStyle = "solid";
    section.style.borderWidth = "1px";
    section.style.borderColor = "#aaa";
    section.id = thisSectionItem.id;
    var aheader = document.createElement('div');
    aheader.innerHTML = createSectionHeader(thisSectionItem.header, false);
    aheader.style.display = 'block';
    aheader.style.cursor = 'pointer';

    section.appendChild(aheader);
    
    var segmentsContainer = document.createElement('div');
    segmentsContainer.style.display = 'none';
    aheader.onclick = function() {
        if(segmentsContainer.style.display == 'block') {
            segmentsContainer.style.display = 'none';
            aheader.innerHTML = createSectionHeader(thisSectionItem.header, false);
        } else {
            segmentsContainer.style.display = 'block';
            aheader.innerHTML = createSectionHeader(thisSectionItem.header, true);
        }
    };
    section.appendChild(segmentsContainer);
    
    var modifiers = thisSectionItem.selections;
    for (var i = 0; i < modifiers.length; i++) {
        var segMod = modifiers[i];
        var segmentContainer = document.createElement('div');
        
        var segmentColor = document.createElement('div');
        segmentColor.innerHTML="▶";
        segmentColor.style.color = segMod.getBackground();
        segmentColor.style.textShadow = "1px 1px 2px #333";
        segmentColor.style.cssFloat = "left";
        segmentColor.style.height = "100%";
        segmentColor.style.lineHeight = "100%";
        segmentColor.style.verticalAlign = "middle";
        
        var segmentBuild = document.createElement('div');
		var isChecked = window.localStorage.getItem(segMod.getCheckboxId()) === 'checked';
        segmentBuild.innerHTML = segMod.build(isChecked);
        segmentBuild.style.paddingLeft = "1.5em";
        
        segmentContainer.appendChild(segmentColor);
        segmentContainer.appendChild(segmentBuild);
        //    segmentContainer.style.background = segMod.getBackground();
        segmentsContainer.appendChild(segmentContainer);
    }
    return section;
}

function toggleAddonVisible() {
    var visibleElement = getId("highlight-addon");
    if(visibleElement.style.display == "none") {
        visibleElement.style.display = "block";
    }
    else {
        visibleElement.style.display = "none";
    }
}

var stylizer = document.createElement('style');
stylizer.innerHTML = "#WME_SPEED_addOnToggle{"
stylizer.innerHTML += generateTopDownGradient('#eeeeee', '#cccccc');
stylizer.innerHTML += "border: 1px solid #ccc; \
border-bottom: 1px solid #bbb; \
-webkit-border-radius: 3px; \
-moz-border-radius: 3px; \
-ms-border-radius: 3px; \
-o-border-radius: 3px; \
border-radius: 3px; \
color: #333; \
font: bold 11px 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif;\
padding: 0.1em 0.2em; \
text-shadow: 0 1px 0 #eee; \
width: 120px; } "
stylizer.innerHTML += "#WME_SPEED_addOnToggle:hover{ "
stylizer.innerHTML += generateTopDownGradient('#dddddd', '#bbbbbb');
stylizer.innerHTML += "border: 1px solid #bbb; \
border-bottom: 1px solid #999; \
cursor: pointer; \
text-shadow: 0 1px 0 #ddd; } "
stylizer.innerHTML += 
"#WME_SPEED_addOnToggle:active{ \
    border: 1px solid #aaa; \
    border-bottom: 1px solid #888; \
    -webkit-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee; \
    -moz-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee; \
    box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee; \
} "
stylizer.innerHTML += "#WME_SPEED_Popup {background: #fff;position:absolute;bottom:48px;right:24px;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container {text-align: center;font-size: 1.1em; margin: 1px; border:solid 1px #000;border-radius: 2px;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container.locked {border:dashed 2px #f00;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container.userlocked {border:solid 2px #f00;}"

stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_street_name {font-size:.8em; margin:0;padding:0;line-height:1em;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_street_name #street_name_prefix {font-size: .6em;vertical-align:middle;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_street_name #street_name_suffix {font-size: .65em;vertical-align:top;}"

stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_street_city {font-size:.8em;margin:1px 0 0 0;padding:0;line-height:1em;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_parkingLot, #WME_SPEED_Popup .WME_SPEED_privateStreet { background-color:#aaa;color:#000;font-style:italic;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_streetSign {background: #006F53; color:#fff;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_trailSign {background: #8C6019; color:#000; font-weight:bold;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_dirtRoadSign {background: #754546; color:#E2C99B; font-weight:normal;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_railroadSign {background: #fff; color:#000; font-weight:normal; border: solid 1px #000;}"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_unknownName {font-style:italic; }"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_alternateName {font-style:italic; border: solid 1px white; font-size:.7em;padding:0;line-height:.95em;  }"
stylizer.innerHTML += "#WME_SPEED_Popup .WME_SPEED_parkingLotSign {\
height:21px;\
padding-right:17px;\
background-position:right center;\
background-repeat:no-repeat;\
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAVCAYAAABR915hAAAACXBIWXMAAABPAAAATwFjiv3XAAACQElEQVR42sXWT2iUZxDH8c/srtu4zUGtVrBtpBaEokgNohR7CHjyYkvBkxXU2igpIoIgCB7EevQWxKiotILg0lLspdSqFy+CFMVDS0Gwaq0aSeK/YjTJ9LJqupBVE40Dz+Ed5nm/88wz83vf0OUe3vRs+xdXcRyd2Z5/GIMVXiC2gtn4GudjX6wZL/BwK0v7oiu+GC046kp9GWdGiG3Gx5g0bHe3Ju/nyrz/ouBS3fPpbM8VI2Z5MKZ55CcsAmmaBz7Hd6+01Lk6u7EK+dSpbVzuuNbNvcNcU8YFHPtjXh3s71cOjt3xniGH69rz7GjA9c21JLri1Aj9X1bSiqZh3n80qb4M8HRh+nMOYkobRzNKYxGQ+9LqbM/qaAWk/sT30N0g/pZwUujMtXl1LJJZDz7WSEBephW8Jntt4NIzm3dPzDXBtfwye+JQTPKgptNlF3JNXouuWJDr8mzsjVZFlwx62x1XNJvjLef8ZYKKluzI32N/vGvQfG843vDEUY2igqohm0C/DxVsVvSRAT/G9igLO2NPLMQ3PnBHWq+iRcEuvbaoaFHSEXtjqiFHhXke2tq41H2Woiq1RTXKtfkdlPprKh2oKDiMX7ItB/73x5IWK5pT+5gsEb7FAeGHxuAh67AUM/X5rPaCXsyQvs8N2Y9moQPLnyT3eDcbhJ21hHvxDlqlnwu4iRu1dftJmQ/EDNzSbqGJFkif4hF+028bPontUZL+zK/yVxzRYxnuKhpAn+suSp3SXZOdkGZhG3b8B9u3s4ceFzVrAAAAAElFTkSuQmCC');\
}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_street_name.WME_SPEED_interstate {background-color: #006F53; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAAsTAAALEwEAmpwYAAADPElEQVR42rXWzWsTWxjH8e+cTgiTVNvEoi5sqvW1paCiFBciWKluAiKC4E7c6EKqCK5c+A8IbisqKCJuFAQ3roW6sCAl+NJILDY1jZnO5MWazOT1uYvJrVdvq6jTHwNz5uE5Hw4zzMzRRAQALMvqSCQYGiIQADRN8+rthnqdyUmUYv9+dH2ZhlpN3r5l9+5oNOrVde9ULpfDjx8b588TCjEwQG8vPT2EQjgOts3cHG/eUKkAhMMMDbFpE9EohkGlgmUxO8v0NI7z9e5d59QpwzAA5dFOLmdcuwawdy8bNpBO8/o1a9YwPc3Wreg6Y2Ps2MHZs+zZw65dGAavXvHoEZEIlQoHD3LkCNB59WrZND1TAYVCIXL7NrkcwPAwx49z8SKpFJUKPT0kk+g6tRojIwwOYll8+EAySTzO6CjFIhMT9PczMQGQyXTdv18qldp0q1zuuHWLpSSTbNny7bJYBNi8mRcvuHePkyfb9b4+Bgf594ZSq3nDwM2bDccBdMdxjGfPsKx2UyIBMDWF65JIYNscPcrLl4yPE4mwbx+Tk3z+TKvFgwd0dFCp0GhQLDIywtOnAJ8+BZ4/r584odm2/WWq6M7M419CA7HOgU4WFux16wT8PPr6xLZtlU5rto2/SafJ5zU1M4PvEeHdO1f5vmQvi4sB1WwGV8UmpAKB2mrAuu6qaFRWg167tqr6+/2nNY2dO4MqFmP9ep/p7dvp6kJpmvfN8jMeqILBYDzu+ksfO/Y1HA4jItmstXGjb295LCa5nCUiCggG1diYbw/z8uVmMKi3/2wiMju70Nvrw5K3bZNMZsEz23SpVHr4sPqXrqbJkyfO4uLid7SImKZ57txf0VeuiGmaS+A3utlsZrPW6OgfuvG4ZLMLrVZrGVpEXNf9+LFw6NBvu4cPy9xcoVar/Vf7jvb0TMY+ffo33DNnZH7edl33B+pHWkTq9XouZ46PN7u7f4FGo3LnTsM0zUaj8X9nGdqLbdup1JcLF8QwlkFDIbl0SVKpQj6fX0lYkRaRarVqWVYyWbh+XYaHRSlRSg4ckBs35P37vGVZ9Xr9J9O1pe3kSmk2m95uyLY1pYhEBOju7lZK/XziPwFBIyW1EjjMAAAAAElFTkSuQmCC'); background-repeat: no-repeat; background-position: center center; color:#fff;font-size:.92em;font-weight:bold;min-height:30px;vertical-align: 2px; line-height: 30px;margin: 0 auto;width: 100%}"
stylizer.innerHTML += ".WME_SPEED_interstate#popup_street_city { display: none; }";
stylizer.innerHTML += "#WME_SPEED_Popup #WME_SPEED_tollRoad {background: #FFC500; color:#000;font-size: .8em; text-transform: uppercase; font-weight: bold;}"



stylizer.innerHTML += 
"#WME_SPEED_Popup #popup_container #popup_speed { \
margin:0.2em auto; \
padding: 0.3em; \
text-align:center; \
border:solid 1px #000; \
border-radius: .2em; \
width:3.1em; \
line-height: 1;\
letter-spacing: 0.07em; \
}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_speed #popup_speed_header {font-size:0.65em;line-height:1.2em;margin-bottom:0.1em;padding:0;}"
stylizer.innerHTML += "#WME_SPEED_Popup #popup_container #popup_speed #popup_speed_value {\
font-size:2.0em;\
font-weight:bold;\
margin:0.0em;\
padding:0;\
display:block;}"


// add new box to the map
var addonContainer = document.createElement('section');
var clickBarContainer = document.createElement('div');
var clickBar = document.createElement('a');
clickBar.id = "WME_SPEED_addOnToggle"
clickBar.innerHTML = 'Show / Hide';
clickBar.style.textAlign = 'center';
clickBar.onclick = toggleAddonVisible;
clickBarContainer.style.margin = '0 auto';
clickBarContainer.style.textAlign = 'center';
clickBarContainer.style.minHeight = '1.2em';
clickBarContainer.appendChild(clickBar);
addonContainer.appendChild(clickBarContainer);

var addon = document.createElement('section');
addon.id = "highlight-addon";

addon.innerHTML = '<b>WME Speed</b> ' + version;

for(var i = 0; i < selectSections.length; i++) {
    addon.appendChild(createSection(selectSections[i]));
}

var section = document.createElement('div');
section.innerHTML = '<button type="button" id="_cbRefreshButton">Refresh</button> ';
addon.appendChild(section);

addonContainer.style.fontSize = "0.8em";
addonContainer.style.margin = "8px";
addonContainer.style.background = "#fff"
addonContainer.style.border = "silver solid 1px";
addonContainer.style.position = "absolute";
addonContainer.style.bottom = "24px";
addonContainer.style.clear = "all";
addonContainer.style.padding = "12px";
addonContainer.style.mozBorderRadius = "5px";
addonContainer.style.webkitBorderRadius = "5px";
addonContainer.style.borderRadius = "5px";
addonContainer.style.boxShadow = "2px 2px 5px #000"
addonContainer.appendChild(addon);

getId('editor-container').appendChild(stylizer);
getId('editor-container').appendChild(addonContainer);

debug("Hi There")

// check for AM or CM, and unhide Advanced options
var advancedMode = false;
if (Waze.loginManager != null) {
    thisUser = Waze.loginManager.getLoggedInUser();
    if (thisUser != null && thisUser.normalizedLevel >= 4) {
        advancedMode = true;
//        initUserList();
        populateUserList();
        populateCityList();
    }
}

// setup onclick handlers for instant update:
getId('_cbRefreshButton').onclick = highlightAllSegments;
enumerateAllModifiers(function(seg) {
    seg.init();
});



function createWazeMapEventAction(actionName) {
    debug("register createWazeMapEventAction(actionName)");
    return function() {
        setTimeout(function() {
            highlightAllSegments();
//                    showPopup();

        }, 50);
        return true;
    };
}

function analyzeNodes() {
    var wazeNodes = new Object();
    for (var wazeNode in Waze.model.nodes.objects) {
        var attachedSegments = [];
        for(var wazeSegID in wazeNode.data.segIDs) {
            attachedSegments.push(Waze.model.segments.objects[wazeSegID]);
        }
        wazeNodes[wazeNode.fid] = new WazeNode(wazeNode, attachedSegments);
    }
}

function createEventAction(eventHolderName, actionName) {
    debug("register createEventAction(eventHolderName, actionName)");
    return function() {
        highlightAllSegments();
        populateUserList();
        populateCityList();
//        showPopup();
        return true;
    };
}

function createHighlighAction(eventHolderName, actionName) {
    debug("register createHighlighAction(eventHolderName, actionName)");
    return function(e) {
        if(e.feature)
        {
        highlightSegmentMonitor.updateLatestSegment(e.feature);
        showPopup(e.feature);
        highlightSegments(hoverDependentSections);
        return true;
        }
    };
}

var loadFunction = function(e) {
    debug("event listener for load");
    thisUser = Waze.loginManager.getLoggedInUser();
    if (!advancedMode && thisUser.normalizedLevel >= 4) {
        advancedMode = true;
        populateUserList();
        populateCityList();
    }
    for (var i = 0; i < possibleControllerEvents.length; i++) {
        var eventName = possibleControllerEvents[i];
        Waze.controller.events.register(eventName, this, createEventAction("controller", eventName));
    }
    for (var i = 0; i < possibleWazeMapEvents.length; i++) {
        var eventName = possibleWazeMapEvents[i];
        Waze.map.events.register(eventName, this, createWazeMapEventAction(eventName));
    }
    for (var i = 0; i < possiblePendingControllerEvents.length; i++) {
        var eventName = possiblePendingControllerEvents[i];
        pendingControl.events.register(eventName, this, createEventAction("pendingControl", eventName));
    }
    for (var i = 0; i < possibleSelectionModifyEvents.length; i++) {
        var eventName = possibleSelectionModifyEvents[i];
//        selectionManager.modifyControl.events.register(eventName, this, createEventAction("selectionManager.modifyControl", eventName));
    }
    for (var i = 0; i < possibleSelectionEvents.length; i++) {
        var eventName = possibleSelectionEvents[i];
        Waze.selectionManager.events.register(eventName, this, createEventAction("selectionManager", eventName));
    }
    for (var i = 0; i < possibleSelectionModifyHoverEvents.length; i++) {
        var eventName = possibleSelectionModifyHoverEvents[i];
  //      selectionManager.modifyControl.featureHover.control.events.register(eventName, this, createEventAction("selectionManager.modifyControl.featureHover.control", eventName));
    }
	for (var i = 0; i < possibleActionEvents.length; i++) {
		var eventName = possibleActionEvents[i];
		Waze.model.actionManager.events.register(eventName, this, createEventAction("Waze.model.actionManager", eventName));
	}
	Waze.selectionManager.selectControl.events.register("featurehighlighted", this, createHighlighAction("selectionManager.selectControl", "featurehighlighted"));

    if(DEBUG) {
        Waze.selectionManager.registerModelEvents("selectionChanged", this, function(){console.log("sm.blur")});
        Waze.selectionManager.events.register("touchstart", this, function(){console.log("sm.mc.touchstart")});
        //Waze.selectionManager.layers[0].events.register("beforefeatureselected", this, function(){console.log("sm.mc.beforefeatureselected")});
        // Waze.selectionManager.selectControl.events.register("featurehighlighted", this, function(e){console.log("sm.mc.featurehighlighted : ");});
//        selectionManager.modifyControl.featureHover.control.events.register("activate", this, function(){console.log("sm.mc.fh.c.activate")});
//        selectionManager.modifyControl.featureHover.control.events.register("mouseover", this, function(){console.log("sm.mc.fh.c.mouseover")});
//        selectionManager.modifyControl.featureHover.register("over", this, function(){console.log("sm.mc.fh.-e.over")});
    }
}

debug("registering for events for when window is marked as loaded");
if(document.readyState === "complete") {
    debug("Already Loaded");
    loadFunction("");
}
else {
    window.addEventListener("load", loadFunction);
    Waze.app._events.register("change:loading", loadFunction);
}
// trigger code when page is fully loaded, to catch any missing bits

} 
wmeSpeedBootstrap();  
