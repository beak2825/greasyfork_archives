// ==UserScript==
// @name                WME Locks Needed Highlighter (LNH)
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         Adds Highlights to segments that need their lock level raised
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.1.4
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/12425/WME%20Locks%20Needed%20Highlighter%20%28LNH%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12425/WME%20Locks%20Needed%20Highlighter%20%28LNH%29.meta.js
// ==/UserScript==
var LNH_version = "0.1.4";

setTimeout(initialiseLNH, 3000);

//var epsg900913 = new OpenLayers.Projection("EPSG:900913");
//var epsg4326 = new OpenLayers.Projection("EPSG:4326");
var LNHLayer;
var LNHlineWidth = [
	[0, 0], //zoom 0
	[0, 0], //zoom 1
	[20, 15], //zoom 2
	[20, 15], //zoom 3
	[20, 15], //zoom 4
	[25, 20], //zoom 5
	[25, 20], //zoom 6
	[25, 20], //zoom 7
	[25, 20], //zoom 8
	[25, 20], //zoom 9
	[25, 20] //zoom 10
];

function drawLine(line, newColor, segid) {
	//LNHConsole(segid);
	var linePoints = [];
	var zoom = Waze.map.getZoom();
	if (zoom > LNHlineWidth.length) {
		zoom = LNHlineWidth.length - 1;
	}
	for (var i = 0; i < line.length; i++) {
		//LNHConsole("livemap: xy " + i + " " + line[i].x + " " + line[i].y);
		var p = new OpenLayers.Geometry.Point(line[i].x, line[i].y);
		linePoints.push(p);
	}
	
	//LNHConsole(segid + " newColor: " + newColor + " " + linePoints);
	
	var strokeOpacity = '1.0';
	var lineString = new OpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new OpenLayers.Feature.Vector(lineString, null, {
		strokeColor: newColor,
		strokeOpacity: strokeOpacity,
		strokeDashstyle: 'solid',
		strokeLinecap: 'round',
		strokeWidth: LNHlineWidth[zoom][0]
	});
	LNHLayer.addFeatures(lineFeature);
	if (newColor == "#909") {
		newColor = '#FFFFFF';
	} else if (newColor == "#E6E600") { //yellow
		newColor = 'orange';
	} else {
		newColor = '#000000';
	}
	lineString = new OpenLayers.Geometry.LineString(linePoints);
	lineFeature = new OpenLayers.Feature.Vector(lineString, null, {
		strokeColor: newColor,
		strokeOpacity: strokeOpacity,
		strokeDashstyle: 'dot',
		strokeLinecap: 'round',
		strokeWidth: LNHlineWidth[zoom][1]
	});
	LNHLayer.addFeatures(lineFeature);

	/*
	var lableFeature = new OpenLayers.Feature.Vector(lineString.getCentroid(true)); //Important pass true parameter otherwise it will return 
	lableFeature.style = {
		label: 'segid ' + segid,
		labelOutlineColor: "black",
		labelOutlineWidth: 5,
		fontSize: 25,
		fontColor: 'RED',
		fontOpacity: 0.85,
		fontWeight: "bold",
		labelAlign: "cm"
	};
	LNHLayer.addFeatures(lableFeature);
*/
}




function drawSegIDs(line, newColor, segid) {
	//LNHConsole(segid);
	var linePoints = [];
	var zoom = Waze.map.getZoom();
	if (zoom > LNHlineWidth.length) {
		zoom = LNHlineWidth.length - 1;
	}
	for (var i = 0; i < line.length; i++) {
		//LNHConsole("livemap: xy " + i + " " + line[i].x + " " + line[i].y);
		var p = new OpenLayers.Geometry.Point(line[i].x, line[i].y);
		linePoints.push(p);
	}
	var strokeOpacity = '1.0';
	var lineString = new OpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new OpenLayers.Feature.Vector(lineString, null, {
		strokeColor: newColor,
		strokeOpacity: strokeOpacity,
		strokeDashstyle: 'solid',
		strokeLinecap: 'round',
		strokeWidth: LNHlineWidth[zoom][0]
	});
	LNHLayer.addFeatures(lineFeature);
	if (newColor == "#909") {
		newColor = '#FFFFFF';
	} else if (newColor == "#E6E600") { //yellow
		newColor = 'orange';
	} else {
		newColor = '#000000';
	}
	lineString = new OpenLayers.Geometry.LineString(linePoints);

	var lableFeature = new OpenLayers.Feature.Vector(lineString.getCentroid(true)); //Important pass true parameter otherwise it will return start point as centroid
	//var length = Math.round(lineString.getLength());
	var rotation = parseFloat(lineString.rotation.value);
	lableFeature.style = {
		label: 'segid ' + segid,
		labelOutlineColor: "black",
		labelOutlineWidth: 5,
		fontSize: 25,
		fontColor: 'RED',
		fontOpacity: 0.85,
		fontWeight: "bold",
		//labelAlign: "tr" //set to top right
		labelXOffset: 0,
		labelYOffset:0,
		rotation: rotation,
		labelAlign: "cm"
	};
	LNHLayer.addFeatures(lableFeature);
}



/* =========================================================================== */
var RampArray = [];

function LNHConsole(message) {
	//console.log("LNH: " + message);
}

function FxRampToRamp(HRCSHigh) {
	//var RampArray = [];
	//RampArray[RampArray.length] = '500914532';
	//var HRCSHigh = 1;
	var ConnectedRoadType, HRCSLock, HRCSAutoLock = "";
	var ConnectedToNonRamp = false;
	var TempSegs = [];
	//LNHConsole("RampArray 1 " + RampArray);
	//LNHConsole("FxRampToRamp: HRCSHigh: " + HRCSHigh);
	for (var RampToRampIndex = 0; RampToRampIndex < RampArray.length; ++RampToRampIndex) {
		ConnectedRoadType = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.roadType;
		
		
		if (ConnectedRoadType == 4) { // is a ramp
			
			var RampToRampSegments = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.toNodeID;
			var RampToRampt = Waze.model.nodes.objects[RampToRampSegments].attributes.segIDs; //node segments
			//LNHConsole("connected segmetns " + RampToRampt);
			
			ConnectedToNonRamp = false;		
			
			for (var RampToRampIndex2 = 0; RampToRampIndex2 < RampToRampt.length; ++RampToRampIndex2) {
				ConnectedRoadType2 = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.roadType;
				if (ConnectedRoadType2 == 4) {
					if (RampArray[RampToRampIndex] !== RampToRampt[RampToRampIndex2]) {
						if ($.inArray(RampToRampt[RampToRampIndex2], RampArray) < 0) { //not in array
							TempSegs[TempSegs.length] = RampToRampt[RampToRampIndex2];
						}
						//LNHConsole("tonodes is a ramp 1 " + RampToRampt[RampToRampIndex2]);
					}
				} else { //not a ramp
				
					//LNHConsole("tonodes not a ramp 1 " + RampToRampt[RampToRampIndex2]);
				
					HRCSLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.lockRank + 1;
					HRCSAutoLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.rank + 1;
					if (HRCSLock > HRCSHigh) {
						HRCSHigh = HRCSLock;
					}
					if (HRCSAutoLock > HRCSHigh) {
						HRCSHigh = HRCSAutoLock;
					}
					/*
					TempSeg = RampArray[0];
					RampArray = [];
					RampArray[RampArray.length] = TempSeg;
					RampToRampIndex = 0;
					*/
					//break;
					ConnectedToNonRamp = true;
					//break;
				}
			}
			
			if (ConnectedToNonRamp === false){
				Array.prototype.push.apply(RampArray, TempSegs);

			}
			TempSegs = [];
			var RampToRampSegments = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.fromNodeID;
			var RampToRampt = Waze.model.nodes.objects[RampToRampSegments].attributes.segIDs; //node segments
			//LNHConsole("connected segmetns " + RampToRampt);
			ConnectedToNonRamp = false;
			for (RampToRampIndex2 = 0; RampToRampIndex2 < RampToRampt.length; ++RampToRampIndex2) {
				ConnectedRoadType2 = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.roadType;
				if (ConnectedRoadType2 == 4) {
					if (RampArray[RampToRampIndex] !== RampToRampt[RampToRampIndex2]) {
						if ($.inArray(RampToRampt[RampToRampIndex2], RampArray) < 0) { //not in array
							TempSegs[TempSegs.length] = RampToRampt[RampToRampIndex2];
						}
						//LNHConsole("tonodes is a ramp 2 " + RampToRampt[RampToRampIndex2]);
					}
				} else { //not a ramp
				
					//LNHConsole("fromNodes not a ramp 2 " + RampToRampt[RampToRampIndex2]);
					
					HRCSLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.lockRank + 1;
					HRCSAutoLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.rank + 1;
					if (HRCSLock > HRCSHigh) {
						HRCSHigh = HRCSLock;
					}
					if (HRCSAutoLock > HRCSHigh) {
						HRCSHigh = HRCSAutoLock;
					}
					//break;
					ConnectedToNonRamp = true;
					//break;
				}
			}
			//LNHConsole("RampArray: " + RampArray);
			
			if (ConnectedToNonRamp === false){
				Array.prototype.push.apply(RampArray, TempSegs);
				TempSegs = [];
			}
			
		} else { //not a ramp
			HRCSLock = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.lockRank + 1;
			HRCSAutoLock = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.rank + 1;
			if (HRCSLock > HRCSHigh) {
				HRCSHigh = HRCSLock;
			}
			if (HRCSAutoLock > HRCSHigh) {
				HRCSHigh = HRCSAutoLock;
			}
			//LNHConsole("non-Ramp " + RampArray[RampToRampIndex] + " HRCSHigh: " + HRCSHigh);
			//return HRCSHigh;
		}
	}
	//LNHConsole("HRCSHigh " + HRCSHigh);
	return HRCSHigh;
}

function CalculateHighlightColor(UsersLockSetting, LockRank, AutoLocksRank, TrackRampToRamp) {
	var newColor = "#dd7700";
	//LNHConsole("UsersLockSetting:" + UsersLockSetting + " LockRank:" + LockRank + " AutoLocksRank:" + AutoLocksRank + " TrackRampToRamp: " + TrackRampToRamp);	
	//UsersLockSetting:3 LockRank:1 AutoLocksRank:3	
	if (TrackRampToRamp === true && UsersLockSetting == LockRank) {
		newColor = "#FFFFFF"; //White ramp to ramp
	} else if (LockRank > 0 && UsersLockSetting > LockRank) {
		newColor = "#990099"; //purple under locked
	} else if (AutoLocksRank > 1 && UsersLockSetting > LockRank && LockRank < AutoLocksRank && UsersLockSetting > AutoLocksRank) {
		newColor = "#990099"; //purple under locked
	} else if (AutoLocksRank == 1 && UsersLockSetting > LockRank && UsersLockSetting > 1) {
		newColor = "#990099"; //purple under locked
	} else if (UsersLockSetting > LockRank && UsersLockSetting < AutoLocksRank && LNHShowHighAutoLocked.checked === true) {
		newColor = "#ff8000"; //orange over locked
	} else if (UsersLockSetting < LockRank) {
		newColor = "#E6E600"; //yellow over locked
	} else if (LockRank > 1 && AutoLocksRank > 1 && LNHShowManualAndAuto.checked) {
		newColor = "#ff99ff"; //pink manual locks are the same as autolocks
	}
	return newColor;
}

function highlightSegments() {
	var roads = Waze.map.getLayersBy('uniqueName', 'roads').first();
	var roadsZIdx = roads.getZIndex();
	var LNHLayerZIdx = LNHLayer.getZIndex();
	if (LNHLayerZIdx > roadsZIdx) {
		LNHLayer.setZIndex(roadsZIdx - 30);
	}
	LNHLayer.setZIndex(roadsZIdx - 30);
	LNHLayer.destroyFeatures();
	if (getId('LNHEnableHighlights').checked === true) {
		for (var seg in Waze.model.segments.objects) {
			RampArray = [];
			var segment = Waze.model.segments.get(seg);
			var attributes = segment.attributes;
			var line = getId(segment.geometry.id);
			if (line !== null) {
				var sid = attributes.primaryStreetID;
				if (sid !== null) {
					
				var hasClosures = attributes.hasClosures; //true false
					if (hasClosures === false) {
						
						
						var roadType = attributes.roadType;
						//Waze.model.segments.get(88163272).hasClosures
						//with closure Waze.model.segments.get(88163272).attributes.allowNoDirection
						
						/*
						1: "Streets",
						2: "Primary Street",
						3: "Freeways",
						4: "Ramps",
						5: "Walking Trails",
						6: "Major Highway",
						7: "Minor Highway",
						8: "Dirt roads",                   
						10: "Boardwalk",   
						16: "Stairway",
						17: "Private Road",
						18: "Railroad",
						19: "Runway",
						20: "Parking Lot Road",
						21: "Service Road",
						--------------
						98: "Non-Routable Roads", // 

						199: "Non-Drivable Roads", // --------------
						*/
						var street = Waze.model.streets.get(sid);
						var LockRank = attributes.lockRank;
						var AutoLocksRank = attributes.rank;
						var cityID = (street !== null) && street.cityID;
						var noCity = false;
						var countryID = 0;
						if (cityID !== null && Waze.model.cities.get(cityID) !== null) {
							noCity = Waze.model.cities.get(cityID).isEmpty;
							countryID = Waze.model.cities.get(cityID).countryID;
						}
						var oneWay = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
						//var noDirection = (!attributes.fwdDirection && !attributes.revDirection); // Could use the .attribute.allowNoDirection?
						//var hasRestrictions = (attributes.fwdRestrictions.length + attributes.revRestrictions.length > 0);
						//var updatedOn = new Date(attributes.updatedOn);
						//var updatedBy = attributes.updatedBy;
						var roundabout = attributes.junctionID !== null;
						var TollRoad = attributes.fwdToll;
						// default colours
						var newColor = "#dd7700";
						var Freway_lvl = $('#LNHFreway').val();
						var Ramp_lvl = $('#LNHRamp').val();
						var MajorHighway_lvl = $('#LNHMajorHighway').val();
						var MinorHighway_lvl = $('#LNHMinorHighway').val();
						var PrimaryStreet_lvl = $('#LNHPrimaryStreet').val();
						var RailRoad_lvl = $('#LNHRailRoad').val();
						var Ferry_lvl = $('#LNHFerry').val();
						var Street_lvl = $('#LNHStreet').val();
						var ParkingLotRoad_lvl = $('#LNHParkingLotRoads').val();
						var Roundabout_lvl = $('#LNHRoundabout').val();
						var fwdToll_lvl = $('#LNHfwdToll').val();
						var Private_lvl = $('#LNHPrivate').val();
						var LNHDirt4x4_lvl = $('#LNHDirt4x4').val();
						var LNHWalkingTrial_lvl = $('#LNHWalkingTrial').val();
						var LNHWBoardwalk_lvl = $('#LNHWBoardwalk').val();
						var LNHRunway_lvl = $('#LNHRunway').val();
						var LNHStairway_lvl = $('#LNHStairway').val();
						
						/*
						//convert locks to waze's format
						Freway_lvl = Freway_lvl - 1;
						Ramp_lvl = Ramp_lvl - 1;
						MajorHighway_lvl = MajorHighway_lvl - 1;
						MinorHighway_lvl = MinorHighway_lvl - 1;
						PrimaryStreet_lvl = PrimaryStreet_lvl - 1;
						RailRoad_lvl = RailRoad_lvl - 1;
						Ferry_lvl = Ferry_lvl - 1;
						Street_lvl = Street_lvl - 1;
						ParkingLotRoad_lvl = ParkingLotRoad_lvl - 1;
						Roundabout_lvl = Roundabout_lvl - 1;
						fwdToll_lvl = fwdToll_lvl - 1;
						Private_lvl = Private_lvl - 1;
						*/
						//normalize lockrank
						if (LockRank === null) {
							LockRank = -1;
						} else {
							LockRank = LockRank + 1;
						}
						//normalize autolock rank
						if (AutoLocksRank === null) {
							AutoLocksRank = -1;
						} else {
							AutoLocksRank = AutoLocksRank + 1;
						}
						var TrackRampToRamp = false;
						//LNHConsole(attributes.id);
						//HRCS
						
						if ((roadType == 4 && LNHEnableRampHRCS.checked === true) || (roundabout === true && LNHEnableRoundaboutsHRCS.checked === true)) {
							//LNHConsole("LNH hrcs: " + attributes.id);
							//ramps =4 	roundabout=true
							var HRCSHigh = 1;
							var HRCS = 0;
							var fromNodeID = "";
							var toNodeID = "";
							var index = 0;
							//var RampToRamp = "";
							if (roadType == 4) { //ramps
								//LNHConsole(attributes.id + " HRCSHigh: " + HRCSHigh + " HRCS: " + HRCS + " Lockrank: " + LockRank + " AutoLocksRank: " + AutoLocksRank);
								//LNHConsole("segid " + attributes.id);
								RampArray = [attributes.id];
								//LNHConsole("segid " + attributes.id + " Built RampArray " + RampArray);
								//call ramp function to get HRCS down the line
								HRCSHigh = FxRampToRamp(HRCSHigh);
							} else if (roundabout === true) { //roundabouts
								//LNHConsole("LNH attributes.id: " + attributes.id);
								var junctionID = attributes.junctionID;
								var RounaboutSegments = Waze.model.junctions.objects[junctionID].segIDs;
								for (var roundaboutindex = 0; roundaboutindex < RounaboutSegments.length; ++roundaboutindex) {
									var RoundaboutSingleSegments = Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex];
									//LNHConsole("LNH roundabout segID: " + Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex]);
									fromNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.fromNodeID;
									//LNHConsole(fromNodeID);
									t = Waze.model.nodes.objects[fromNodeID].attributes.segIDs; //node segments
									//LNHConsole(t);
									for (index = 0; index < t.length; ++index) {
										if (attributes.id !== t[index]) {
											HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
											HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
											if (HRCS > HRCSHigh) {
												HRCSHigh = HRCS;
											}
											if (HRCSAutoLock > HRCSHigh) {
												HRCSHigh = HRCSAutoLock;
											}
											//LNHConsole("" + attributes.id + " fromseg: " + t[index] + " HRCS: " + HRCS + " HRCSAutoLock: " + HRCSAutoLock + " HRCSHigh: " + HRCSHigh);
										}
									}
									toNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.toNodeID;
									t = Waze.model.nodes.objects[toNodeID].attributes.segIDs; //node segments
									//LNHConsole(t);
									for (index = 0; index < t.length; ++index) {
										if (attributes.id !== t[index]) {
											HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
											HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
											if (HRCS > HRCSHigh) {
												HRCSHigh = HRCS;
											}
											if (HRCSAutoLock > HRCSHigh) {
												HRCSHigh = HRCSAutoLock;
											}
											//LNHConsole("" + attributes.id + " fromseg: " + t[index] + " HRCS: " + HRCS + " HRCSAutoLock: " + HRCSAutoLock + " HRCSHigh: " + HRCSHigh);
										}
									}
								} //end of looking up all of the roundabout segemtns
							} //end of roundabouts
							newColor = CalculateHighlightColor(HRCSHigh, LockRank, AutoLocksRank, TrackRampToRamp);
							//end of HRCS ramps and roundabouts 	
						} else if (roundabout === true && Roundabout_lvl > 0 && LNHEnableRoundaboutsHRCS.checked === false) {
							newColor = CalculateHighlightColor(Roundabout_lvl, LockRank, AutoLocksRank);
						} else if (TollRoad === true && fwdToll_lvl > 0) {
							newColor = CalculateHighlightColor(fwdToll_lvl, LockRank, AutoLocksRank);
						} else if (Freway_lvl > 0 && roadType == 3) {
							newColor = CalculateHighlightColor(Freway_lvl, LockRank, AutoLocksRank);
						} else if (Ramp_lvl > 0 && roadType == 4 && LNHEnableRampHRCS.checked === false) {
							newColor = CalculateHighlightColor(Ramp_lvl, LockRank, AutoLocksRank);
						} else if (MajorHighway_lvl > 0 && roadType == 6) {
							newColor = CalculateHighlightColor(MajorHighway_lvl, LockRank, AutoLocksRank);
						} else if (MinorHighway_lvl > 0 && roadType == 7) {
							newColor = CalculateHighlightColor(MinorHighway_lvl, LockRank, AutoLocksRank);
						} else if (PrimaryStreet_lvl > 0 && roadType == 2) {
							if (oneWay === true && PrimaryStreetEnableOnewayPlusOne.checked) {
								PrimaryStreet_lvl = PrimaryStreet_lvl + 1;
							}
							newColor = CalculateHighlightColor(PrimaryStreet_lvl, LockRank, AutoLocksRank);
						} else if (RailRoad_lvl > 0 && roadType == 18) {
							newColor = CalculateHighlightColor(RailRoad_lvl, LockRank, AutoLocksRank);
						} else if (Ferry_lvl > 0 && roadType == 14) {
							newColor = CalculateHighlightColor(Ferry_lvl, LockRank, AutoLocksRank);
						} else if (Street_lvl > 0 && roadType == 1) {
							if (oneWay === true && StreetEnableOnewayPlusOne.checked) {
								Street_lvl = Street_lvl + 1;
							}
							newColor = CalculateHighlightColor(Street_lvl, LockRank, AutoLocksRank);
						} else if (ParkingLotRoad_lvl > 0 && roadType == 20) {
							newColor = CalculateHighlightColor(ParkingLotRoad_lvl, LockRank, AutoLocksRank);
						} else if (Private_lvl > 0 && roadType == 17) {
							newColor = CalculateHighlightColor(Private_lvl, LockRank, AutoLocksRank);
						} else if (LNHDirt4x4_lvl > 0 && roadType == 8) {
							newColor = CalculateHighlightColor(LNHDirt4x4_lvl, LockRank, AutoLocksRank);
						} else if (LNHWalkingTrial_lvl > 0 && roadType == 5) {
							newColor = CalculateHighlightColor(LNHWalkingTrial_lvl, LockRank, AutoLocksRank);
						} else if (LNHWBoardwalk_lvl > 0 && roadType == 10) {
							newColor = CalculateHighlightColor(LNHWBoardwalk_lvl, LockRank, AutoLocksRank);
						} else if (LNHRunway_lvl > 0 && roadType == 19) {
							newColor = CalculateHighlightColor(LNHRunway_lvl, LockRank, AutoLocksRank);
						} else if (LNHStairway_lvl > 0 && roadType == 16) {
							newColor = CalculateHighlightColor(LNHStairway_lvl, LockRank, AutoLocksRank);
						}
						var zoom = Waze.map.getZoom();
						//apply the highlight to teh segment
						if (newColor != "#dd7700" && zoom > 1) { //default
							var Line = Waze.model.segments.objects[seg].attributes.geometry.components;
							drawLine(Line, newColor, attributes.id);
						}
					}
				}
			}
			//LNHConsole(attributes.id + " roadType: " + roadType + " Lockrank: " + LockRank + " AutoLocksRank: " + AutoLocksRank);
			//var Line = Waze.model.segments.objects[seg].attributes.geometry.components;
			//drawLine(Line, '', attributes.id);
		}
	}
}

function LHNSetLocks(UpdateObject, v, UsersLockSetting, LockRank, absolute, AutoLocksRank, count) {
	var UserID = Waze.loginManager.getLoggedInUser().id; //editor's id number
	var UserLevel = W.model.users.objects[UserID].rank + 1; //editor's rank	
	if ((LNHRemoveManualWhereAutoLock.checked && AutoLocksRank > 1 && LockRank > 0) || (absolute && UsersLockSetting == 1)) {
		//remove manual lock reverting back to auto lock
		//LNHConsole("remove manual lock reverting back to auto lock attrib: " + attributes.id + " AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
		count++;
		W.model.actionManager.add(new UpdateObject(v, {
			lockRank: null
		}));
	} else if (LNHDoNotChangeAutoLocks.checked && AutoLocksRank > 1 && LockRank < 0) {
		//do not change auto locked segments
		//LNHConsole("do not change auto locked segments attrib: " + attributes.id + " AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
	} else if ((LockRank < UsersLockSetting && UsersLockSetting > 1 && LockRank != UsersLockSetting) || (absolute && LockRank != UsersLockSetting && UserLevel >= LockRank && UserLevel >= AutoLocksRank)) {
		if (UsersLockSetting > UserLevel) {
			UsersLockSetting = UserLevel;
		}
		//LNHConsole("LHNSetLocks: " + UsersLockSetting);
		//set lock absolute
		//LNHConsole("set lock absolute attrib: " + attributes.id + " AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
		count++;
		W.model.actionManager.add(new UpdateObject(v, {
			lockRank: UsersLockSetting - 1
		}));
	}
	return count;
}

function LHNRaiseLocks() {
	var Freway_lvl = $('#LNHFreway').val();
	var Ramp_lvl = $('#LNHRamp').val();
	var MajorHighway_lvl = $('#LNHMajorHighway').val();
	var MinorHighway_lvl = $('#LNHMinorHighway').val();
	var PrimaryStreet_lvl = $('#LNHPrimaryStreet').val();
	var RailRoad_lvl = $('#LNHRailRoad').val();
	var Ferry_lvl = $('#LNHFerry').val();
	var Street_lvl = $('#LNHStreet').val();
	var ParkingLotRoad_lvl = $('#LNHParkingLotRoads').val();
	var Roundabout_lvl = $('#LNHRoundabout').val();
	var fwdToll_lvl = $('#LNHfwdToll').val();
	var Private_lvl = $('#LNHPrivate').val();
	var LNHDirt4x4_lvl = $('#LNHDirt4x4').val();
	var LNHWalkingTrial_lvl = $('#LNHWalkingTrial').val();
	var LNHWBoardwalk_lvl = $('#LNHWBoardwalk').val();
	var LNHRunway_lvl = $('#LNHRunway').val();
	var LNHStairway_lvl = $('#LNHStairway').val();
	var absolute = "";
	if (LNHEnableAbsolute.checked === true) {
		absolute = true;
		getId('LNHEnableAbsolute').checked = false;
	} else {
		absolute = false;
	}
	var count = 0;
	var thisUser = Waze.loginManager.user;
	if (thisUser === null) return;
	var usrRank = thisUser.normalizedLevel;
	var UpdateObject;
	if (typeof(require) !== "undefined") {
		UpdateObject = require("Waze/Action/UpdateObject");
	} else {
		UpdateObject = Waze.Action.UpdateObject;
	}
	//var trash = "in wazes database the lock starts at 0 so we subtract 1 from each type so the settings above make more sense";
	/*	Freway_lvl = Freway_lvl - 1;
		Ramp_lvl = Ramp_lvl - 1;
		MajorHighway_lvl = MajorHighway_lvl - 1;
		MinorHighway_lvl = MinorHighway_lvl - 1;
		PrimaryStreet_lvl = PrimaryStreet_lvl - 1;
		RailRoad_lvl = RailRoad_lvl - 1;
		Ferry_lvl = Ferry_lvl - 1;
		Street_lvl = Street_lvl - 1;
		ParkingLotRoad_lvl = ParkingLotRoad_lvl - 1;
		//oneWay_lvl = oneWay_lvl - 1;
		Roundabout_lvl = Roundabout_lvl - 1;
		fwdToll_lvl = fwdToll_lvl - 1;
		Private_lvl = Private_lvl - 1;
	*/
	if (Freway_lvl > usrRank) Freway_lvl = usrRank;
	if (Ramp_lvl > usrRank) Ramp_lvl = usrRank;
	if (MajorHighway_lvl > usrRank) MajorHighway_lvl = usrRank;
	if (MinorHighway_lvl > usrRank) MinorHighway_lvl = usrRank;
	if (PrimaryStreet_lvl > usrRank) PrimaryStreet_lvl = usrRank;
	if (RailRoad_lvl > usrRank) RailRoad_lvl = usrRank;
	if (Ferry_lvl > usrRank) Ferry_lvl = usrRank;
	if (Street_lvl > usrRank) Street_lvl = usrRank;
	if (ParkingLotRoad_lvl > usrRank) ParkingLotRoad_lvl = usrRank;
	if (Roundabout_lvl > usrRank) Roundabout_lvl = usrRank;
	if (fwdToll_lvl > usrRank) fwdToll_lvl = usrRank;
	if (Private_lvl > usrRank) Private_lvl = usrRank;
	if (LNHDirt4x4_lvl > usrRank) LNHDirt4x4_lvl = usrRank;
	if (LNHWalkingTrial_lvl > usrRank) LNHWalkingTrial_lvl = usrRank;
	if (LNHWBoardwalk_lvl > usrRank) LNHWBoardwalk_lvl = usrRank;
	if (LNHRunway_lvl > usrRank) LNHRunway_lvl = usrRank;
	if (LNHStairway_lvl > usrRank) LNHStairway_lvl = usrRank;

	function onScreen(obj) {
		if (obj.geometry) {
			return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
		}
		return (false);
	}
	for (var seg in Waze.model.segments.objects) {
		var v = Waze.model.segments.get(seg);
		var attributes = v.attributes;
		var roadType = attributes.roadType;
		var LockRank = attributes.lockRank;
		var AutoLocksRank = attributes.rank;
		//normalize lockrank
		if (LockRank === null) {
			LockRank = -1;
		} else {
			LockRank = LockRank + 1;
		}
		//normalize autolock rank
		if (AutoLocksRank === null) {
			AutoLocksRank = -1;
		} else {
			AutoLocksRank = AutoLocksRank + 1;
		}
		var oneWay = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
		var roundabout = attributes.junctionID !== null;
		var TollRoad = attributes.fwdToll;
		//var hasClosures = attributes.hasClosures; //true false
		if (count < 150 && onScreen(v) && v.isGeometryEditable() ) { //&& v.isGeometryEditable()  && hasClosures === false
			if ((roadType == 4 && LNHEnableRampHRCS.checked === true) || (roundabout === true && LNHEnableRoundaboutsHRCS.checked === true)) { //ramps =4 	roundabout=true
				var HRCSHigh = 1;
				var HRCS = "";
				var fromNodeID = "";
				var toNodeID = "";
				var index = 0;
				if (roadType == 4) { //ramps
					//LNHConsole(attributes.id + " HRCSHigh: " + HRCSHigh + " HRCS: " + HRCS + " Lockrank: " + LockRank + " AutoLocksRank: " + AutoLocksRank);
					//LNHConsole("segid " + attributes.id);
					RampArray = [attributes.id];
					//LNHConsole("segid " + attributes.id + " Built RampArray " + RampArray);
					//call ramp function to get HRCS down the line
					HRCSHigh = FxRampToRamp(HRCSHigh);
				} else if (roundabout === true) { //roundabouts
					//LNHConsole("LNH attributes.id: " + attributes.id);
					var junctionID = attributes.junctionID;
					var RounaboutSegments = Waze.model.junctions.objects[junctionID].segIDs;
					for (var roundaboutindex = 0; roundaboutindex < RounaboutSegments.length; ++roundaboutindex) {
						var RoundaboutSingleSegments = Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex];
						//LNHConsole("LNH roundabout segID: " + Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex]);
						fromNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.fromNodeID;
						//LNHConsole(fromNodeID);
						t = Waze.model.nodes.objects[fromNodeID].attributes.segIDs; //node segments
						//LNHConsole(t);
						for (index = 0; index < t.length; ++index) {
							if (attributes.id !== t[index]) {
								HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
								HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
								//LNHConsole(t[index] + " fromNodeID " + HRCS);
								if (HRCS > HRCSHigh) {
									HRCSHigh = HRCS;
								}
								if (HRCSAutoLock > HRCSHigh) {
									HRCSHigh = HRCSAutoLock;
								}
							}
						}
						toNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.toNodeID;
						t = Waze.model.nodes.objects[toNodeID].attributes.segIDs; //node segments
						//LNHConsole(t);
						for (index = 0; index < t.length; ++index) {
							if (attributes.id !== t[index]) {
								HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
								HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
								//LNHConsole(t[index] + " toNodeID " + HRCS);
								if (HRCS > HRCSHigh) {
									HRCSHigh = HRCS;
								}
								if (HRCSAutoLock > HRCSHigh) {
									HRCSHigh = HRCSAutoLock;
								}
							}
						}
					} //end of looking up all of the roundabout segemtns
				} //end of roundabouts
				//"#909"; //purple "#E6E600"; //yellow
				/*
                if (HRCSHigh == LockRank) {
                    //=lock";
                } else if (HRCSHigh > LockRank) {
                    //"needs raise";
                    W.model.actionManager.add(new UpdateObject(v, {
                        lockRank: HRCSHigh - 1
                    }));
                } else if (HRCSHigh < LockRank && absolute === true) {
                    //"needs lower";
                    W.model.actionManager.add(new UpdateObject(v, {
                        lockRank: HRCSHigh - 1
                    }));
                }
				*/
				//LNHConsole(HRCSHigh);
				LHNSetLocks(UpdateObject, v, HRCSHigh, LockRank, absolute, AutoLocksRank, count);
				// end of ramps and roundabouts HRCS
			} else if (Roundabout_lvl > 0 && LNHEnableRoundaboutsHRCS.checked === false && roundabout === true) {
				LHNSetLocks(UpdateObject, v, Roundabout_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (fwdToll_lvl > 0 && TollRoad === true) {
				LHNSetLocks(UpdateObject, v, fwdToll_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (Freway_lvl > 0 && roadType == 3) {
				LHNSetLocks(UpdateObject, v, Freway_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (Ramp_lvl > 0 && roadType == 4 && LNHEnableRampHRCS.checked === false) {
				LHNSetLocks(UpdateObject, v, Ramp_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (MajorHighway_lvl > 0 && roadType == 6) {
				LHNSetLocks(UpdateObject, v, MajorHighway_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (MinorHighway_lvl > 0 && roadType == 7) {
				LHNSetLocks(UpdateObject, v, MinorHighway_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (PrimaryStreet_lvl > 0 && roadType == 2) {
				if (oneWay === true && PrimaryStreetEnableOnewayPlusOne.checked) {
					PrimaryStreet_lvl = PrimaryStreet_lvl + 1;
				}
				LHNSetLocks(UpdateObject, v, PrimaryStreet_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (RailRoad_lvl > 0 && roadType == 18) {
				LHNSetLocks(UpdateObject, v, RailRoad_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (Ferry_lvl > 0 && roadType == 14) {
				LHNSetLocks(UpdateObject, v, Ferry_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (Street_lvl > 0 && roadType == 1) {
				if (oneWay === true && StreetEnableOnewayPlusOne.checked) {
					Street_lvl = Street_lvl + 1;
				}
				LHNSetLocks(UpdateObject, v, Street_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (ParkingLotRoad_lvl > 0 && roadType == 20) {
				LHNSetLocks(UpdateObject, v, ParkingLotRoad_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (Private_lvl > 0 && roadType == 17) {
				LHNSetLocks(UpdateObject, v, Private_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (LNHDirt4x4_lvl > 0 && roadType == 8) {
				LHNSetLocks(UpdateObject, v, Private_lvl, LockRank, absolute, AutoLocksRank, count);
				newColor = CalculateHighlightColor(LNHDirt4x4_lvl, LockRank, AutoLocksRank);
			} else if (LNHWalkingTrial_lvl > 0 && roadType == 5) {
				LHNSetLocks(UpdateObject, v, LNHWalkingTrial_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (LNHWBoardwalk_lvl > 0 && roadType == 10) {
				LHNSetLocks(UpdateObject, v, LNHWBoardwalk_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (LNHRunway_lvl > 0 && roadType == 19) {
				LHNSetLocks(UpdateObject, v, LNHRunway_lvl, LockRank, absolute, AutoLocksRank, count);
			} else if (LNHStairway_lvl > 0 && roadType == 16) {
				LHNSetLocks(UpdateObject, v, LNHStairway_lvl, LockRank, absolute, AutoLocksRank, count);
			}
		}
	}
}

/*
function toggleOptions() {
    var objStyle = getId('hiliteOptions').style.display;
    if (objStyle == "none") {
        objStyle = "block";
        getId('_btnHide').innerHTML = "hide";
    } else {
        objStyle = "none";
        getId('_btnHide').innerHTML = "show";
    }
    getId('hiliteOptions').style.display = objStyle;
    if (advancedMode)
        getId('advancedOptions').style.display = objStyle;
    getId('hilitePlaces').style.display = objStyle;
    return false;
}
*/
/*
// enable advanced options if user is logged in and at least an AM
function enableAdvancedOptions() {
    //if (advancedMode) return;

    if (typeof Waze == 'undefined')
        Waze = unsafeWindow.Waze;

    if (typeof Waze.loginManager == 'undefined')
        Waze.loginManager = unsafeWindow.Waze.loginManager;

    if (typeof Waze.loginManager == 'undefined')
        Waze.loginManager = unsafeWindow.loginManager;

}
*/
/* helper function */
function getElementsByClassName(classname, node) {
	if (!node) node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i = 0, j = els.length; i < j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function getId(node) {
	return document.getElementById(node);
}
/* =========================================================================== */
function LNHChangeArea() {
	//LNHConsole('' + LNHArea.value);
	/*
	var LNHLevelandSettingArray = {};
	LNHLevelandSettingArray = { LNHFreway:"0", LNHfwdToll:"0", LNHRamp:"0", LNHEnableRampHRCS:"0", LNHMajorHighway:"0", LNHMinorHighway:"0", LNHPrimaryStreet:"0", LNHRailRoad:"0", LNHFerry:"5", LNHStreet:"0", LNHParkingLotRoads:"0", LNHRoundabout:"0",LNHEnableRoundaboutsHRCS:"0", LNHPrivate:"0", LNHDirt4x4:"0", LNHWalkingTrial:"0", LNHWBoardwalk:"0", LNHRunway:"0", LNHStairway:"0" }
   */
   getId('LNHEnableHighlights').checked = true;
   
	switch (LNHArea.value) {
		case "-":
			getId('LNHDoNotChangeAutoLocks').checked = true;
			getId('LNHRemoveManualWhereAutoLock').checked = false;
			getId('LNHShowHighAutoLocked').checked = true;
			getId('LNHShowManualAndAuto').checked = true;
			LNHFreway.value = 0;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 0;
			LNHMinorHighway.value = 0;
			LNHPrimaryStreet.value = 0;
			LNHRailRoad.value = 0;
			LNHFerry.value = 0;
			LNHStreet.value = 0;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 0;
			LNHStairway.value = 0;
			break;
		case "Alabama":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Alaska":
			LNHFreway.value = 0;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 0;
			LNHMinorHighway.value = 0;
			LNHPrimaryStreet.value = 0;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 0;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Arizona":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Arkansas":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "California Metro":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "California Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Colorado":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Connecticut":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Delaware":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Disney World Florida":
			LNHFreway.value = 6;
			LNHfwdToll.value = 6;
			LNHRamp.value = 6;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 6;
			LNHMinorHighway.value = 6;
			LNHPrimaryStreet.value = 6;
			LNHRailRoad.value = 6;
			LNHFerry.value = 6;
			LNHStreet.value = 6;
			LNHParkingLotRoads.value = 6;
			LNHRoundabout.value = 6;
			LNHEnableRoundaboutsHRCS.checked = false;
			LNHPrivate.value = 6;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 6;
			LNHWalkingTrial.value = 6;
			LNHWBoardwalk.value = 6;
			LNHRunway.value = 6;
			LNHStairway.value = 6;
			break;
		case "District Of Columbia":
			LNHFreway.value = 0;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 0;
			LNHMinorHighway.value = 0;
			LNHPrimaryStreet.value = 0;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 0;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Florida":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Georgia":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Hawaii":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Idaho":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Illinois":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 5;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Indiana":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Iowa":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Kansas":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Kentucky":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Louisiana Mature":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 5;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Louisiana Non-Mature ":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 1;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 5;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Maine":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Maryland Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Maryland Rual":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 2;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Massachusetts":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Michigan":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Minnesota Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Minnesota Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Mississippi":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 3;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Missouri":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Montana":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 3;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Nebraska":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Nevada Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Nevada Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "New Hampshire":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "New Jersey":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "New Mexico":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "New York  NYC Only":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "New York":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "North Carolina Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "North Carolina Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "North Dakota":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Ohio":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = true;
			PrimaryStreetEnableOnewayPlusOne.checked = true;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Oklahoma":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 5;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Oregon":
			LNHFreway.value = 0;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 0;
			LNHMinorHighway.value = 0;
			LNHPrimaryStreet.value = 0;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 0;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Pennsylvania":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Rhode Island":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "South Carolina":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			bLNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "South Dakota":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Tennessee":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Texas":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 5;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 3;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Utah Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Utah Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Vermont":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Virginia Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Virginia Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 4;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Washington Urban":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 4;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Washington Rual":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "West Virginia":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 1;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Wisconsin":
			LNHFreway.value = 5;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 3;
			LNHMinorHighway.value = 2;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Wyoming":
			LNHFreway.value = 4;
			LNHfwdToll.value = 0;
			LNHRamp.value = 4;
			LNHEnableRampHRCS.checked = false;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Mexico Metro":
			getId('LNHDoNotChangeAutoLocks').checked = true;
			getId('LNHRemoveManualWhereAutoLock').checked = false;
			getId('LNHShowHighAutoLocked').checked = true;
			getId('LNHShowManualAndAuto').checked = true;
			LNHFreway.value = 5;
			LNHfwdToll.value = 4;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 4;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 4;
			LNHFerry.value = 5;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		case "Mexico":
			getId('LNHDoNotChangeAutoLocks').checked = true;
			getId('LNHRemoveManualWhereAutoLock').checked = false;
			getId('LNHShowHighAutoLocked').checked = true;
			getId('LNHShowManualAndAuto').checked = true;
			LNHFreway.value = 5;
			LNHfwdToll.value = 4;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 4;
			LNHMinorHighway.value = 3;
			LNHPrimaryStreet.value = 2;
			LNHRailRoad.value = 4;
			LNHFerry.value = 5;
			LNHStreet.value = 1;
			LNHParkingLotRoads.value = 1;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 1;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
		default:
			getId('LNHDoNotChangeAutoLocks').checked = true;
			getId('LNHRemoveManualWhereAutoLock').checked = false;
			getId('LNHShowHighAutoLocked').checked = true;
			getId('LNHShowManualAndAuto').checked = true;
			LNHFreway.value = 0;
			LNHfwdToll.value = 0;
			LNHRamp.value = 0;
			LNHEnableRampHRCS.checked = true;
			LNHMajorHighway.value = 0;
			LNHMinorHighway.value = 0;
			LNHPrimaryStreet.value = 0;
			LNHRailRoad.value = 2;
			LNHFerry.value = 0;
			LNHStreet.value = 0;
			LNHParkingLotRoads.value = 0;
			LNHRoundabout.value = 0;
			LNHEnableRoundaboutsHRCS.checked = true;
			LNHPrivate.value = 0;
			StreetEnableOnewayPlusOne.checked = false;
			PrimaryStreetEnableOnewayPlusOne.checked = false;
			LNHDirt4x4.value = 0;
			LNHWalkingTrial.value = 0;
			LNHWBoardwalk.value = 0;
			LNHRunway.value = 5;
			LNHStairway.value = 0;
			break;
	}
	/*
				LNHFreway.value = LNHLevelandSettingArray["LNHFreway"];
				LNHfwdToll.value = LNHLevelandSettingArray["LNHfwdToll"];
				LNHRamp.value = LNHLevelandSettingArray["LNHRamp"];
				LNHEnableRampHRCS.checked = LNHLevelandSettingArray["LNHEnableRampHRCS"];
				LNHMajorHighway.value = LNHLevelandSettingArray["LNHMajorHighway"];
				LNHMinorHighway.value = LNHLevelandSettingArray["LNHMinorHighway"];
				LNHPrimaryStreet.value = LNHLevelandSettingArray["LNHPrimaryStreet"];
				LNHRailRoad.value = LNHLevelandSettingArray["LNHRailRoad"];
				LNHFerry.value = LNHLevelandSettingArray["LNHFerry"];
				LNHStreet.value = LNHLevelandSettingArray["LNHStreet"];
				LNHParkingLotRoads.value = LNHLevelandSettingArray["LNHParkingLotRoads"];
				LNHRoundabout.value = LNHLevelandSettingArray["LNHRoundabout"];
				LNHEnableRoundaboutsHRCS.checked = LNHLevelandSettingArray["LNHEnableRoundaboutsHRCS"];
				LNHPrivate.value = LNHLevelandSettingArray["LNHPrivate"];
				StreetEnableOnewayPlusOne.checked = LNHLevelandSettingArray["StreetEnableOnewayPlusOne"];
				PrimaryStreetEnableOnewayPlusOne.checked = LNHLevelandSettingArray["PrimaryStreetEnableOnewayPlusOne"];
				LNHDirt4x4.value = LNHLevelandSettingArray["LNHDirt4x4"];
				LNHWalkingTrial.value = LNHLevelandSettingArray["LNHWalkingTrial"];
				LNHWBoardwalk.value = LNHLevelandSettingArray["LNHWBoardwalk"];
				LNHRunway.value = LNHLevelandSettingArray["LNHRunway"];
				LNHStairway.value = LNHLevelandSettingArray["LNHStairway"];
		*/
	
	saveHighlightOptions();
	highlightSegments();
	
}


function saveHighlightOptions() {
	if (localStorage) {
		//LNHConsole("WME Highlights: saving options");
		var options = [];
		// preserve previous options which may get lost after logout
		if (localStorage.LNHHighlightScript) options = JSON.parse(localStorage.LNHHighlightScript);
		options[0] = getId('LNHEnableHighlights').checked;
		options[1] = $('#LNHFreway').val();
		options[2] = $('#LNHRamp').val();
		options[3] = $('#LNHMajorHighway').val();
		options[4] = $('#LNHMinorHighway').val();
		options[5] = $('#LNHPrimaryStreet').val();
		options[6] = $('#LNHRailRoad').val();
		options[7] = $('#LNHFerry').val();
		options[8] = $('#LNHStreet').val();
		options[9] = $('#LNHParkingLotRoads').val();
		//	options[10] = $('#LNHoneWay').val();
		options[11] = $('#LNHRoundabout').val();
		options[12] = $('#LNHfwdToll').val();
		options[13] = $('#LNHPrivate').val();
		options[14] = getId('LNHEnableRampHRCS').checked;
		options[15] = getId('LNHEnableRoundaboutsHRCS').checked;
		options[16] = getId('LNHShowHighAutoLocked').checked;
		options[17] = getId('LNHDoNotChangeAutoLocks').checked;
		options[18] = getId('LNHRemoveManualWhereAutoLock').checked;
		options[19] = getId('LNHShowManualAndAuto').checked;
		options[20] = getId('PrimaryStreetEnableOnewayPlusOne').checked;
		options[21] = getId('StreetEnableOnewayPlusOne').checked;
		options[22] = $('#LNHDirt4x4').val();
		options[23] = $('#LNHWalkingTrial').val();
		options[24] = $('#LNHWBoardwalk').val();
		options[25] = $('#LNHRunway').val();
		options[26] = $('#LNHStairway').val();
		localStorage.LNHHighlightScript = JSON.stringify(options);
	}
}




function initialiseLNH() {
	LNHLayer = new OpenLayers.Layer.Vector("LNH", {
		displayInLayerSwitcher: false,
		uniqueName: "__LNH"
	});
	I18n.translations.en.layers.name["__LNH"] = "LNH";
	Waze.map.addLayer(LNHLayer);
	var roads = Waze.map.getLayersBy('uniqueName', 'roads').first();
	var roadsZIdx = roads.getZIndex();
	var LNHLayerZIdx = LNHLayer.getZIndex();
	if (LNHLayerZIdx > roadsZIdx) {
		LNHLayer.setZIndex(roadsZIdx - 30);
	}
	LNHLayer.setZIndex(roadsZIdx - 30);
	var addon = document.createElement('section');
	addon.id = "highlight-addon";
	addon.innerHTML = '<b>' + 'Locks Needed Highlighter (LNH)</u></b> &nbsp; v' + LNH_version;
	// Highlight Locks Needed
	var section = document.createElement('p');
	section.style.paddingTop = "8px";
	//section.style.textIndent = "16px";
	section.id = "LNHOptions";
	//states drop down
	var htmlstring = '<font style="font-size: 12px;">Area </font>';
	htmlstring = htmlstring + '<select id="LNHArea" style="font-size: 12px; margin-top: 5px;">';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="-">-</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Alabama">Alabama</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Alaska">Alaska</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Arizona">Arizona</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Arkansas">Arkansas</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="California Metro">California Metro</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="California Rual">California Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Colorado">Colorado</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Connecticut">Connecticut</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Delaware">Delaware</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Disney World Florida">Disney World Florida</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="District Of Columbia">District Of Columbia</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Florida">Florida</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Georgia">Georgia</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Hawaii">Hawaii</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Idaho">Idaho</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Illinois">Illinois</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Indiana">Indiana</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Iowa">Iowa</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Kansas">Kansas</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Kentucky">Kentucky</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Louisiana Mature ">Louisiana Mature </option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Louisiana Non-Mature ">Louisiana Non-Mature </option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Maine">Maine</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Maryland Urban">Maryland Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Maryland Rual">Maryland Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Massachusetts">Massachusetts</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Michigan">Michigan</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Minnesota Urban">Minnesota Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Minnesota Rual">Minnesota Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Mississippi">Mississippi</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Missouri">Missouri</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Montana">Montana</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Nebraska">Nebraska</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Nevada Urban">Nevada Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Nevada Rual">Nevada Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="New Hampshire">New Hampshire</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="New Jersey">New Jersey</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="New Mexico">New Mexico</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="New York NYC Only">New York NYC Only</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="New York">New York</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="North Carolina Urban">North Carolina Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="North Carolina Rual">North Carolina Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="North Dakota">North Dakota</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Ohio">Ohio</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Oklahoma">Oklahoma</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Oregon">Oregon</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Pennsylvania">Pennsylvania</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Rhode Island">Rhode Island</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="South Carolina">South Carolina</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="South Dakota">South Dakota</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Tennessee">Tennessee</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Texas">Texas</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Utah Urban">Utah Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Utah Rual">Utah Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Vermont">Vermont</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Virginia Urban">Virginia Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Virginia Rual">Virginia Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Washington Urban">Washington Urban</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Washington Rual">Washington Rual</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="West Virginia">West Virginia</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Wisconsin">Wisconsin</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Wyoming">Wyoming</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Mexico Metro">Mexico Metro</option>';
	htmlstring = htmlstring + '<option style="font-size 12px;" value="Mexico">Mexico</option>';
	htmlstring = htmlstring + '</select><br>';
	section.innerHTML = section.innerHTML + htmlstring;
	//options
	var thisUser = Waze.loginManager.user;
	if (thisUser === null) return;
	var usrRank = thisUser.normalizedLevel;
	var thisUserID = thisUser.id;
	if (usrRank >= 1 || thisUserID == "103267873") { //
		//var AbsoluteVisible = "visibility: visible;";
		//raise locks link
		section.innerHTML = section.innerHTML + '<br><a id="LNHRaiseLocks">Set locks </a>';
		section.innerHTML = section.innerHTML + '<br><br><font"><input type="checkbox" id="LNHDoNotChangeAutoLocks" class="URCommentsCheckbox"> Do not change auto locks</font>';
		section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LNHRemoveManualWhereAutoLock" class="URCommentsCheckbox"> Remove manual locks where autolocked</font>';
		section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LNHEnableAbsolute" class="URCommentsCheckbox"> Absolute</font><br>';
	}
	section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LNHShowHighAutoLocked" class="URCommentsCheckbox"> Show High Auto Locks (orange)</font>';
	section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LNHShowManualAndAuto" class="URCommentsCheckbox"> Show segments that have manual and auto locks (pink)</font>';
	section.innerHTML = section.innerHTML + '<br><input type="checkbox" id="LNHEnableHighlights" class="URCommentsCheckbox"> Enable Highlights (purple: low; yellow: high)<br>';
	section.innerHTML = section.innerHTML + '<br><input type="text" id="LNHFreway" style="width: 35px; margin-bottom: 5px;"> Freeway<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHfwdToll" style="width: 35px; margin-bottom: 5px;"> Tolls<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHRamp" style="width: 35px; margin-bottom: 5px;"> Ramp ';
	section.innerHTML = section.innerHTML + '<input type="checkbox" id="LNHEnableRampHRCS" class="URCommentsCheckbox" title="Highest Rank of Connected Segments"> HRCS<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHMajorHighway" style="width: 35px; margin-bottom: 5px;"> Major Highway<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHMinorHighway" style="width: 35px; margin-bottom: 5px;"> Minor Highway<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHPrimaryStreet" style="width: 35px; margin-bottom: 5px;"> Primary Street ';
	section.innerHTML = section.innerHTML + '<input type="checkbox" id="PrimaryStreetEnableOnewayPlusOne" class="URCommentsCheckbox"> One Way +1<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHRailRoad" style="width: 35px; margin-bottom: 5px;"> Railroad<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHFerry" style="width: 35px; margin-bottom: 5px;"> Ferry<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHStreet" style="width: 35px; margin-bottom: 5px;"> Street ';
	section.innerHTML = section.innerHTML + '<input type="checkbox" id="StreetEnableOnewayPlusOne" class="URCommentsCheckbox"> One Way +1<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHParkingLotRoads" style="width: 35px; margin-bottom: 5px;"> Parking Lot Roads<br>';
	//section.innerHTML = section.innerHTML + '<input type="text" id="LNHoneWay" style="width: 35px; margin-bottom: 5px;"> One Way Roads<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHRoundabout" style="width: 35px; margin-bottom: 5px;"> Roundabouts ';
	section.innerHTML = section.innerHTML + '<input type="checkbox" id="LNHEnableRoundaboutsHRCS" class="URCommentsCheckbox" title="Highest Rank of Connected Segments"> HRCS<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHPrivate" style="width: 35px; margin-bottom: 5px;"> Private<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHDirt4x4" style="width: 35px; margin-bottom: 5px;"> Dirt or 4x4<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHWalkingTrial" style="width: 35px; margin-bottom: 5px;"> Walking Trials<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHWBoardwalk" style="width: 35px; margin-bottom: 5px;"> Pedestrian Boardwalk<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHRunway" style="width: 35px; margin-bottom: 5px;"> Runway<br>';
	section.innerHTML = section.innerHTML + '<input type="text" id="LNHStairway" style="width: 35px; margin-bottom: 5px;"> Stairway<br>';
	addon.appendChild(section);
	var userTabs = getId('user-info');
	//var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	//var tabContent = getElementsByClassName('tab-content', userTabs)[0];
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];
	var newtab = document.createElement('li');
	newtab.innerHTML = '<a href="#sidepanel-LNH" data-toggle="tab">LNH</a>';
	//$("#user-tabs ul.nav-tabs").first().append(newtab);
	navTabs.appendChild(newtab);
	addon.id = "sidepanel-LNH";
	addon.className = "tab-pane";
	//$("#user-tabs div.tab-content").first().append(addon);
	tabContent.appendChild(addon);
	/*
	    // setup onclick handlers for instant update:
	    getId('LNHFreway').onchange = highlightSegments;
	    getId('LNHRamp').onchange = highlightSegments;
	    getId('LNHMajorHighway').onchange = highlightSegments;
	    getId('LNHMinorHighway').onchange = highlightSegments;
	    getId('LNHPrimaryStreet').onchange = highlightSegments;
	    getId('LNHRailRoad').onchange = highlightSegments;
	    getId('LNHFerry').onchange = highlightSegments;
	    getId('LNHStreet').onchange = highlightSegments;
	    getId('LNHParkingLotRoads').onchange = highlightSegments;
	    //getId('LNHoneWay').onchange = highlightSegments;
	    getId('LNHPrivate').onchange = highlightSegments;

	    //getId('LNHRaiseLocks').onclick = LHNRaiseLocks;
	    //getId('LNHRaiseLocks').onclick = LHNRaiseLocks;
	*/
	//calback functions
	//setlocks
	$("#LNHRaiseLocks").click(function() {
		var r = confirm("LNH: Please check with your state manager before auto setting the lock levels! If you are not allowed to run this script in your area you may be blocked from editing! \nClick ok to set the lock levels.");
		if (r === true) {
			LHNRaiseLocks();
		}
	});
	//change area drop dodwn
	$("#LNHArea").change(LNHChangeArea);
	/*
    if (usrRank >= 4 || thisUserID == "103267873") { //
	
    	$("#LNHDoNotChangeAutoLocks").click(function() {
    		if (LNHRemoveManualWhereAutoLock.checked == true){
    			LNHRemoveManualWhereAutoLock.checked = false;
    			alert('LNH: disabling Remove manual locks where autolocked');
    		}
    	});
    	
    	$("#LNHRemoveManualWhereAutoLock").click(function() {
    		if (LNHDoNotChangeAutoLocks.checked == true){
    			LNHDoNotChangeAutoLocks.checked = false;
    			alert('LNH: disabling Do not change auto locks');
    		}
    	});

    }
	
    */
	
	// restore saved settings
	if (localStorage.LNHHighlightScript) {
		var options = JSON.parse(localStorage.LNHHighlightScript);
		getId('LNHEnableHighlights').checked = options[0];
		$('#LNHFreway').val(options[1]);
		$('#LNHRamp').val(options[2]);
		$('#LNHMajorHighway').val(options[3]);
		$('#LNHMinorHighway').val(options[4]);
		$('#LNHPrimaryStreet').val(options[5]);
		$('#LNHRailRoad').val(options[6]);
		$('#LNHFerry').val(options[7]);
		$('#LNHStreet').val(options[8]);
		$('#LNHParkingLotRoads').val(options[9]);
		//	$('#LNHoneWay').val(options[10]);
		$('#LNHRoundabout').val(options[11]);
		$('#LNHfwdToll').val(options[12]);
		$('#LNHPrivate').val(options[13]);
		getId('LNHEnableRampHRCS').checked = options[14];
		getId('LNHEnableRoundaboutsHRCS').checked = options[15];
		getId('LNHShowHighAutoLocked').checked = options[16];
		getId('LNHDoNotChangeAutoLocks').checked = options[17];
		getId('LNHRemoveManualWhereAutoLock').checked = options[18];
		getId('LNHShowManualAndAuto').checked = options[19];
		getId('PrimaryStreetEnableOnewayPlusOne').checked = options[20];
		getId('StreetEnableOnewayPlusOne').checked = options[21];
		$('#LNHDirt4x4').val(options[22]);
		$('#LNHWalkingTrial').val(options[23]);
		$('#LNHWBoardwalk').val(options[24]);
		$('#LNHRunway').val(options[25]);
		$('#LNHStairway').val(options[26]);
		/*
		LNHDirt4x4
		LNHWalkingTrial
		LNHWBoardwalk
		LNHRunway
		LNHStairway
		*/
		if (thisUserID == "6945278") {
			getId('LNHEnableAbsolute').checked = true;
		}
		//shortcut
		//W.accelerators.addAction('LNH', {
		//	group: "layers"
		//});
		
		//W.accelerators.events.register('LNH', null, function() { LHNRaiseLocks(); });
		
		Waze.accelerators.Groups['LNH'] = [];
		Waze.accelerators.Groups['LNH'].members = [];
		I18n.translations.en.keyboard_shortcuts.groups['LNH'] = [];
		I18n.translations.en.keyboard_shortcuts.groups['LNH'].description = 'Locks Needed Highlighter';
		I18n.translations.en.keyboard_shortcuts.groups['LNH'].members = [];
		//shorcut 1
		I18n.translations.en.keyboard_shortcuts.groups.LNH.members['LNH'] = 'Sest the locks based on your settings';
		Waze.accelerators.addAction('LNH', {
			group: 'LNH'
		});
		
		W.accelerators.events.register('LNH', null, function() { LHNRaiseLocks(); });
		//Waze.accelerators.events.register('LNH', null, mainNormName);
		Waze.accelerators.registerShortcuts({'A+l': "LNH"}); 
		/*W.accelerators.registerShortcuts({
			'A+l': "LNH"
		});*/
		/*
		Waze.accelerators.Groups['normname']=[];
		Waze.accelerators.Groups['normname'].members=[];
		I18n.translations.en.keyboard_shortcuts.groups['normname'] = [];
		I18n.translations.en.keyboard_shortcuts.groups['normname'].description = 'Norm Name';
		I18n.translations.en.keyboard_shortcuts.groups['normname'].members = [];
		
		I18n.translations.en.keyboard_shortcuts.groups.normname.members['normName'] = 'Normalize street names';
		Waze.accelerators.addAction('normName', {group: 'normname'});
		Waze.accelerators.events.register('normName', null, mainNormName);
		Waze.accelerators.registerShortcuts({nnShortcut: "normName"}); 	
		*/
		
		
		
		/*
				//shorcut 2
				I18n.translations.en.keyboard_shortcuts.groups.LNH.members['LNH1'] = 'Sest the locks based on your settings1';
				Waze.accelerators.addAction('LNH1', {group: 'LNH'});
				W.accelerators.registerShortcuts({'S+l': "LNH1"});
		*/
		saveHighlightOptions();
	}
	// overload the WME exit function

	window.addEventListener("beforeunload", saveHighlightOptions, false);
	// begin periodic updates
	window.setInterval(highlightSegments, 1000);
	// trigger code when page is fully loaded, to catch any missing bits
	window.addEventListener("load", function(e) {
		var mapProblems = getId('map-problems-explanation');
		if (mapProblems !== null) mapProblems.style.display = "none";
		//enableAdvancedOptions();
	});
	// register some events...
	Waze.map.events.register("zoomend", null, highlightSegments);
	Waze.map.events.register("moveend", null, highlightSegments);
	//Waze.selectionManager.events.register("selectionchanged", null, extraDetails);
	highlightSegments();
	//Waze.map.events.register("moveend", null, LHNRaiseLocks);
	//Waze.map.events.register("zoomend", null, highlightPlaces);
	//Waze.map.events.register("zoomend", null, highlightSelectedNodes);
	//Waze.selectionManager.events.register("selectionchanged", null, highlightSelectedNodes);
	//Waze.selectionManager.events.register("selectionchanged", null, extraDetails);
	//Waze.loginManager.events.register("afterloginchanged", null, enableAdvancedOptions);
	//Waze.model.events.register("mergeend", null, initCityList);
}