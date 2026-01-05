// ==UserScript==
// @name				WME Road Selector
// @description 		Makes selection of multiple roads based on given condition
// @match 				https://www.waze.com/*editor*
// @match 				https://beta.waze.com/*editor*
// @version 			1.50.5
// @copyright			2014-2025, pvo11 (HTML design by bures)
// @namespace			https://greasyfork.org/scripts/3462-wme-road-selector
// @icon				data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAAB3RJTUUH4AsBDQ0yYF1byAAAAAlwSFlzAAALEQAACxEBf2RfkQAAAARnQU1BAACxjwv8YQUAAAKQSURBVHjazVe/TxRBFH57hwngXTyEBCQSExsvkT/AktLe1oLOAhoqryBAYUJrAbWY8CeYWGoCiZYWGGqzGDFZ5EgWcol7LO/b2bmbnf01dzf++JI3s7cz33tv3rx5O0dUhJDR/+W5Yc6IBieTkgRG8kd7kzblRCdXi8BqiqHPrcT9Vtwvkx2UrWTx/DQMEC7PfeNksI+5fRRFbWbBSQ967kGezW7e4AdsT+3spCC8RvE3W/5jlk9R5IeNHdC6bIfx7xfOAAquEbqGU6F2eC3fzpkQj2NrB1nDY4VEoibLYXrDdAUIDtERHhUXgyKihEzX52h2bjfIuztf7l2B29ss71keDE7+K8jwcJA80FN5mYP8tmJI3kaHIAfT9+XbPTRmCoiW0KyM16jKfc3pO26q4GW03rMTqv/6Tr4orm2zGHjuLLen2luf118vV5Ak15h0qU9xRiHnKzAk9xV4LoLboXT+F5IBuQsRea5SVccelpFVBWOL1Vv0Y+qemigbZWRVAR11f0f9+tWFfPXZRIGMAarsVmLEoJgkMVLJ/ocYcJlGkUAqrMeip5XP0uLw7v4ZB8TH4YtqGKnZ4cOvfMsAFIImO/LTtJqYYkcaR1qHnNJI7XP+0CC9lTLWYHmNB9sO9FIfx2K340fPXRLHw0/eMT+isbcFov5AadNgdvQ5seNAtuFDljWWZyxPlBXvseFvKn14B/INPzWpgcM7YMlwsQPiOOG6tETiyCC53rHs2zKc7UBWTc7GyIYl+sdQ3F16xnGHwTnG+W1N1HXevg3jSQfiuw+AIoI7EIC6+mryTuIupM4dFep/zFQZxV07oFAvIL0yajcCMwtfuR0nsQ1BZInrt2IcZW2V503ZMv5f4AazFTZB3RZIZwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/3462/WME%20Road%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/3462/WME%20Road%20Selector.meta.js
// ==/UserScript==

var StringOps = {
	0: "=",
	1: "!=",
	2: "contains",
	3: "! contains",
	4: "~"
};

var IntegerOps = {
	0: "=",
	1: "!=",
	2: ">",
	3: ">=",
	4: "<",
	5: "<="
};


var EqualOps = {
	0: "=",
	1: "!="
};

var RestrDirs = {
	0: "---",
	1: "Two way",
	2: "A > B",
	3: "B > A"
};

var RestrLanes = {
	0: "---",
	1: "Entire",
	2: "Left",
	3: "Middle",
	4: "Right"
};

var RestrCars = {
	0: "---",
	9: "None",
	4: "Bus",
	3: "Express",
	5: "Fast",
	2: "HOT",
	1: "HOV"
};
var RestrCarsOrder = [0, 9, 4, 3, 5, 2, 1];

var RestrTypes = {
	0: "---",
	1: "allowed for",
	2: "toll free for",
	3: "prohibited for All vehicles",
	4: "prohibited for Only"
}

var RestrSelOps = {
	0: "---",
	1: "ANY",
	2: "ALL"
}

var RestrCarTypes = {
	0: "BUS",
	1: "CAV",
	2: "CLEAN_FUEL",
	3: "EV",
	4: "HAZARDOUS_MATERIALS",
	5: "HYBRID",
	6: "MOTORCYCLE",
	7: "PRIVATE",
	8: "PUBLIC_TRANSPORTATION",
	9: "RV",
	10: "TAXI",
	11: "TOWING_VEHICLE",
	12: "TRUCK"
}

var RestrCarTypesN = {
	0: 288,
	1: 1792,
	2: 1840,
	3: 1808,
	4: 1536,
	5: 1824,
	6: 1024,
	7: 1280,
	8: 256,
	9: 512,
	10: 272,
	11: 768,
	12: 0
}

var Directions = {
	0: "Two way (=)",
	1: "One way (A›B)",
	2: "One way (B›A)",
	3: "Unknown"
};

var uOpenLayers;
var uWaze;

function populateOptions(sel, tbl)
{
	var selId = getId(sel);

	for (var id in tbl) {
		var txt = tbl[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selId.appendChild(usrOption);
	}
}

function populateLocalizedOptions(sel, tbl, loc)
{
	var selId = getId(sel);

	for (var id in tbl) {
		var txt = tbl[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(loc[txt]);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selId.appendChild(usrOption);
	}
}

function populateOrderedOptions(sel, tbl, ord)
{
	var selId = getId(sel);

	for (var i = 0; i < ord.length; i++) {
		var id = ord[i];
		var txt = tbl[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selId.appendChild(usrOption);
	}
}

function populateObjectOptions(sel, obj)
{
	var selId = getId(sel);

	var usrOption = document.createElement('option');
	var usrText = document.createTextNode("---");
	usrOption.setAttribute('selected',true);
	usrOption.setAttribute('value','-');
	usrOption.appendChild(usrText);
	selId.appendChild(usrOption);

	for (var id in obj) {
		usrOption = document.createElement('option');
		usrText = document.createTextNode(obj[id]);
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selId.appendChild(usrOption);
	}
}

var DirOps = {
	0: "none",
	1: "any",
	2: "both",
	3: "A›B",
	4: "B›A",
	5: "hidden",
	6: "unverified",
	7: "only one"
};

function populateDirOps(sel, unver)
{
	var selectDirOp = getId(sel);
	for (var id in DirOps) {
		if (unver || id !== '6') {
			var txt = DirOps[id];
			var usrOption = document.createElement('option');
			var usrText = document.createTextNode(txt);
			if (id === 0) {
				usrOption.setAttribute('selected',true);
			}
			usrOption.setAttribute('value',id);
			usrOption.appendChild(usrText);
			selectDirOp.appendChild(usrOption);
		}
	}
}

var Countries = {};

function populateCountries()
{
	var selectCountry = getId("selRSCountry");

	for (var countryID in uWaze.model.countries.objects) {
		if (typeof Countries[countryID] === 'undefined') {
			Countries[countryID] = uWaze.model.countries.getObjectById(countryID).attributes.name;
			var txt = Countries[countryID];
			var usrOption = document.createElement('option');
			var usrText = document.createTextNode(txt);
			usrOption.setAttribute('value',countryID);
			usrOption.appendChild(usrText);
			selectCountry.appendChild(usrOption);
		}
	}
}


var RoadTypeCategories = {
	101: "highways",
	102: "streets",
	103: "other_drivable",
	104: "non_drivable",
};
var RoadTypesOrder = [101, 3, 6, 7, 4, 102, 2, 1, 22, 103, 8, 20, 17, 15, 104, 5, 10, 16, 18, 19];

function populateRoadTypes(sel)
{
	var selectRoadType = getId(sel);

	for (var i = 0; i < RoadTypesOrder.length; i++) {
		var id = RoadTypesOrder[i];
		var txt
		if (id > 100) {
			txt = "-- " + I18n.translations[I18n.currentLocale()].segment.categories[RoadTypeCategories[id]] + " --";
		} else {
			txt = I18n.translations[I18n.currentLocale()].segment.road_types[id];
		}
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id == 1) {
			usrOption.setAttribute('selected',true);
		}
		if (id > 100) {
			usrOption.setAttribute('disabled',true);
			usrOption.setAttribute('style','font-weight: bold');
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectRoadType.appendChild(usrOption);
	}
}


function populateElevations(sel)
{
	var selectElevation = getId(sel);

	for (var id = 9; id >= -5; id--) {
		var txt;
		if (id === 0) {
			txt = "Ground";
		} else {
			txt = String(id);
		}
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectElevation.appendChild(usrOption);
	}
}


function populateLocks(sel)
{
	var selectLock = getId(sel);

	for (var id = 1; id <= 6; id++) {
		var txt = String(id);
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 1) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectLock.appendChild(usrOption);
	}
}


var milesConst = 1.609344;

function km2miles(km) {
	return Math.round(km / milesConst);
}


function miles2km(m) {
	return Math.round(m * milesConst);
}


function decimalRound(value, exp) {
	if (typeof exp === 'undefined' || +exp === 0) {
		return Math.round(value);
	}
	value = +value;
	exp = +exp;
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
		return NaN;
	}
	value = value.toString().split('e');
	value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}


var ExprStatus = 0;
var ExprTree = {};
var BktTrees = {};
var BktOps = {};
var BktCount = 0;
var hasStates;
var speedInMiles;
var hasSubcriptions;
var Subscriptions = {};

function getSubscriptions()
{
	for (var countryID in uWaze.model.countries.objects) {
		for (var subscr in uWaze.model.countries.getObjectById(countryID).restrictionSubscriptions) {
			hasSubcriptions = true;
			Subscriptions[subscr] = uWaze.model.countries.getObjectById(countryID).restrictionSubscriptions[subscr];
		}
	}
}


function checkExpr(tree, segment)
{
	if (typeof (tree.type) === 'undefined') {
		return false;
	}

	var result;
	switch (tree.type) {
		case "Country":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' || sid === null) {
				result = false;
			} else {
				var street = uWaze.model.streets.getObjectById(sid);
				if (typeof(street) === 'undefined') {
					result = false;
				} else {
					var countryID = uWaze.model.cities.objects[street.attributes.cityID].attributes.countryID;
					if (tree.op === "0") {
						result = tree.id == countryID;
					} else {
						result = tree.id != countryID;
					}
				}
			}
			break;
		case "State":
		case "XState":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' || sid === null) {
				result = false;
			} else {
				var street = uWaze.model.streets.getObjectById(sid);
				if (typeof(street) === 'undefined') {
					result = false;
				} else {
					var stateID = uWaze.model.cities.objects[street.attributes.cityID].attributes.stateID;
					if (typeof(stateID) === 'undefined') {
						result = false;
					} else {
						var stateName = uWaze.model.states.getObjectById(stateID).attributes.name;
						if (stateName === null) {
							stateName = "";
						}
						var condTxt = tree.txt;
						if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
							condTxt = condTxt.toLowerCase();
							stateName = stateName.toLowerCase();
						}
						switch (tree.op) {
							case "0":
								result = stateName == condTxt;
								break;
							case "1":
								result = stateName != condTxt;
								break;
							case "2":
								result = stateName.indexOf(condTxt) >= 0;
								break;
							case "3":
								result = stateName.indexOf(condTxt) < 0;
								break;
							default:
								var re;
								if (getId("cbRSCaseSens").checked) {
									re = new RegExp(condTxt);
								} else {
									re = new RegExp(condTxt, "i");
								}
								result = stateName.search(re) >= 0;
								break;
						}
					}
				}
			}
			if (tree.type === "State") {
				break;
			}
		case "AState":
			if (tree.type === "AState") {
				result = false;
			}
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' || sid === null) {
				result = false;
			} else {
				var street = uWaze.model.streets.getObjectById(sid);
				if (typeof(street) === 'undefined') {
					result = false;
				} else {
					var stateID = uWaze.model.cities.objects[street.attributes.cityID].attributes.stateID;
					if (typeof(street) === 'undefined') {
						result = false;
					} else {
						var stateName = uWaze.model.states.getObjectById(stateID).attributes.name;
						if (stateName === null) {
							stateName = "";
						}
						for(i = 0; i < segment.attributes.streetIDs.length; i++){
							var sid = segment.attributes.streetIDs[i];
							if (sid !== null) {
								var street = uWaze.model.streets.getObjectById(sid);
								if (typeof(street) === 'undefined') {
									result = false;
								} else {
									var stateID = uWaze.model.cities.objects[street.attributes.cityID].attributes.stateID;
									if (typeof(stateID) === 'undefined') {
										result = false;
									} else {
										var stateName = uWaze.model.states.getObjectById(stateID).attributes.name;
										if (stateName === null) {
											stateName = "";
										}
										var condTxt = tree.txt;
										if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
											condTxt = condTxt.toLowerCase();
											stateName = cityName.toLowerCase();
										}
										switch (tree.op) {
											case "0":
												result = result || (stateName == condTxt);
												break;
											case "1":
												result = result || (stateName != condTxt);
												break;
											case "2":
												result = result || (stateName.indexOf(condTxt) >= 0);
												break;
											case "3":
												result = result || (stateName.indexOf(condTxt) < 0);
												break;
											default:
												var re;
												if (getId("cbRSCaseSens").checked) {
													re = new RegExp(condTxt);
												} else {
													re = new RegExp(condTxt, "i");
												}
												result = result || (stateName.search(re) >= 0);
												break;
										}
									}
								}
							}
						}
					}
				}
			}
			break;
		case "City":
		case "XCity":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' || sid === null) {
				result = false;
			} else {
				var street = uWaze.model.streets.getObjectById(sid);
				if (typeof(street) === 'undefined') {
					result = false;
				} else {
					var cityName = uWaze.model.cities.objects[street.attributes.cityID].attributes.name;
					if (cityName === null) {
						cityName = "";
					}
					var condTxt = tree.txt;
					if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
						condTxt = condTxt.toLowerCase();
						cityName = cityName.toLowerCase();
					}
					switch (tree.op) {
						case "0":
							result = cityName == condTxt;
							break;
						case "1":
							result = cityName != condTxt;
							break;
						case "2":
							result = cityName.indexOf(condTxt) >= 0;
							break;
						case "3":
							result = cityName.indexOf(condTxt) < 0;
							break;
						default:
							var re;
							if (getId("cbRSCaseSens").checked) {
								re = new RegExp(condTxt);
							} else {
								re = new RegExp(condTxt, "i");
							}
							result = cityName.search(re) >= 0;
							break;
					}
				}
			}
			if (tree.type === "City") {
				break;
			}
		case "ACity":
			if (tree.type === "ACity") {
				result = false;
			}
			for(i = 0; i < segment.attributes.streetIDs.length; i++){
				var sid = segment.attributes.streetIDs[i];
				if (sid !== null) {
					var street = uWaze.model.streets.getObjectById(sid);
					if (typeof(street) === 'undefined') {
						result = false;
					} else {
						var cityName = uWaze.model.cities.objects[street.attributes.cityID].attributes.name;
						if (cityName === null) {
							cityName = "";
						}
						var condTxt = tree.txt;
						if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
							condTxt = condTxt.toLowerCase();
							cityName = cityName.toLowerCase();
						}
						switch (tree.op) {
							case "0":
								result = result || (cityName == condTxt);
								break;
							case "1":
								result = result || (cityName != condTxt);
								break;
							case "2":
								result = result || (cityName.indexOf(condTxt) >= 0);
								break;
							case "3":
								result = result || (cityName.indexOf(condTxt) < 0);
								break;
							default:
								var re;
								if (getId("cbRSCaseSens").checked) {
									re = new RegExp(condTxt);
								} else {
									re = new RegExp(condTxt, "i");
								}
								result = result || (cityName.search(re) >= 0);
								break;
						}
					}
				}
			}
			break;
		case "Street":
		case "XStreet":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' || sid === null) {
				result = false;
			} else {
				var street = uWaze.model.streets.getObjectById(sid);
				if (typeof(street) === 'undefined') {
					result = false;
				} else {
					var streetName = street.attributes.name;
					if (streetName === null) {
						streetName = "";
					}
					var condTxt = tree.txt;
					if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
						condTxt = condTxt.toLowerCase();
						streetName = streetName.toLowerCase();
					}
					switch (tree.op) {
						case "0":
							result = streetName == condTxt;
							break;
						case "1":
							result = streetName != condTxt;
							break;
						case "2":
							result = streetName.indexOf(condTxt) >= 0;
							break;
						case "3":
							result = streetName.indexOf(condTxt) < 0;
							break;
						default:
							var re;
							if (getId("cbRSCaseSens").checked) {
								re = new RegExp(condTxt);
							} else {
								re = new RegExp(condTxt, "i");
							}
							result = streetName.search(re) >= 0;
							break;
					}
				}
			}
			if (tree.type === "Street") {
				break;
			}
		case "AStreet":
			if (tree.type === "AStreet") {
				result = false;
			}
			for(i = 0; i < segment.attributes.streetIDs.length; i++){
				var sid = segment.attributes.streetIDs[i];
				if (sid !== null) {
					var street = uWaze.model.streets.getObjectById(sid);
					if (typeof(street) === 'undefined') {
						result = false;
					} else {
						var streetName = street.attributes.name;
						if (streetName === null) {
							streetName = "";
						}
						var condTxt = tree.txt;
						if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
							condTxt = condTxt.toLowerCase();
							streetName = streetName.toLowerCase();
						}
						switch (tree.op) {
							case "0":
								result = result || (streetName == condTxt);
								break;
							case "1":
								result = result || (streetName != condTxt);
								break;
							case "2":
								result = result || (streetName.indexOf(condTxt) >= 0);
								break;
							case "3":
								result = result || (streetName.indexOf(condTxt) < 0);
								break;
							default:
								var re;
								if (getId("cbRSCaseSens").checked) {
									re = new RegExp(condTxt);
								} else {
									re = new RegExp(condTxt, "i");
								}
								result = result || (streetName.search(re) >= 0);
								break;
						}
					}
				}
			}
			break;
		case "NoName":
			if (tree.op) {
				result = typeof(segment.attributes.primaryStreetID) === 'undefined' || segment.attributes.primaryStreetID === null;
			} else {
				result = typeof(segment.attributes.primaryStreetID) !== 'undefined' && segment.attributes.primaryStreetID !== null;
			}
			break;
		case "ANoName":
			if (tree.op) {
				result = segment.attributes.streetIDs.length === 0;
			} else {
				result = segment.attributes.streetIDs.length > 0;
			}
			break;
		case "RoadType":
			if (tree.op === "0") {
				result = tree.id == segment.attributes.roadType;
			} else {
				result = tree.id != segment.attributes.roadType;
			}
			break;
		case "IsRound":
			if (tree.op) {
				result = segment.attributes.junctionID !== null;
			} else {
				result = segment.attributes.junctionID === null;
			}
			break;
		case "IsToll":
			if (tree.op) {
				result = segment.attributes.fwdToll || segment.attributes.revToll;
			} else {
				result = !(segment.attributes.fwdToll || segment.attributes.revToll);
			}
			break;
		case "Direction":
			var dir = 0;
			if (!segment.attributes.fwdDirection) {
				dir += 2;
			}
			if (!segment.attributes.revDirection) {
				dir += 1;
			}
			if (tree.op === "0") {
				result = tree.id == dir;
			} else {
				result = tree.id != dir;
			}
			break;
		case "Elevation":
			switch (tree.op) {
				case "0":
					result = parseInt(tree.id, 10) === segment.attributes.level;
					break;
				case "1":
					result = parseInt(tree.id, 10) !== segment.attributes.level;
					break;
				case "2":
					result = parseInt(tree.id, 10) < segment.attributes.level;
					break;
				case "3":
					result = parseInt(tree.id, 10) <= segment.attributes.level;
					break;
				case "4":
					result = parseInt(tree.id, 10) > segment.attributes.level;
					break;
				default:
					result = parseInt(tree.id, 10) >= segment.attributes.level;
					break;
			}
			break;
		case "Tunnel":
			if (tree.op) {
				result = (segment.attributes.flags & 1) !== 0;
			} else {
				result = (segment.attributes.flags & 1) === 0;
			}
			break;
		case "Unpaved":
			if (tree.op) {
				result = (segment.attributes.flags & 16) !== 0;
			} else {
				result = (segment.attributes.flags & 16) === 0;
			}
			break;
		case "HOV":
			if (tree.op) {
				result = (segment.attributes.flags & 128) !== 0;
			} else {
				result = (segment.attributes.flags & 128) === 0;
			}
			break;
		case "Headlights":
			if (tree.op) {
				result = (segment.attributes.flags & 32) !== 0;
			} else {
				result = (segment.attributes.flags & 32) === 0;
			}
			break;
		case "ManLock":
			if	(segment.attributes.lockRank === null) {
				result = false;
			} else {
				switch (tree.op) {
					case "0":
						result = parseInt(tree.id, 10) === segment.attributes.lockRank + 1;
						break;
					case "1":
						result = parseInt(tree.id, 10) !== segment.attributes.lockRank + 1;
						break;
					case "2":
						result = parseInt(tree.id, 10) < segment.attributes.lockRank + 1;
						break;
					case "3":
						result = parseInt(tree.id, 10) <= segment.attributes.lockRank + 1;
						break;
					case "4":
						result = parseInt(tree.id, 10) > segment.attributes.lockRank + 1;
						break;
					default:
						result = parseInt(tree.id, 10) >= segment.attributes.lockRank + 1;
						break;
				}
			}
			break;
		case "TrLock":
			if	(segment.attributes.lockRank === null) {
				switch (tree.op) {
					case "0":
						result = parseInt(tree.id, 10) === segment.attributes.rank + 1;
						break;
					case "1":
						result = parseInt(tree.id, 10) !== segment.attributes.rank + 1;
						break;
					case "2":
						result = parseInt(tree.id, 10) < segment.attributes.rank + 1;
						break;
					case "3":
						result = parseInt(tree.id, 10) <= segment.attributes.rank + 1;
						break;
					case "4":
						result = parseInt(tree.id, 10) > segment.attributes.rank + 1;
						break;
					default:
						result = parseInt(tree.id, 10) >= segment.attributes.rank + 1;
						break;
				}
			} else {
				result = false;
			}
			break;
		case "Speed":
			var spdDir = tree.op % 10;
			var spdCond = Math.floor(tree.op / 10);
			var fwdRes;
			var revRes;
			if (tree.txt === '') {
				fwdRes = typeof(segment.attributes.fwdMaxSpeed) !== 'undefined' && segment.attributes.fwdMaxSpeed !== null;
				revRes = typeof(segment.attributes.revMaxSpeed) !== 'undefined' && segment.attributes.revMaxSpeed !== null;
			} else {
				switch (spdCond) {
					case 0: // "="
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) === parseInt(tree.txt, 10) || parseInt(segment.attributes.fwdMaxSpeed, 10) === parseInt(tree.txt, 10) - 1;
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) === parseInt(tree.txt, 10) || parseInt(segment.attributes.revMaxSpeed, 10) === parseInt(tree.txt, 10) - 1;
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) === parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) === parseInt(tree.txt, 10);
						}
						break;
					case 1: // "!="
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) !== parseInt(tree.txt, 10) && parseInt(segment.attributes.fwdMaxSpeed, 10) !== parseInt(tree.txt, 10) - 1;
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) !== parseInt(tree.txt, 10) && parseInt(segment.attributes.revMaxSpeed, 10) !== parseInt(tree.txt, 10) - 1;
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) !== parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) !== parseInt(tree.txt, 10);
						}
						break;
					case 2: // ">"
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) > parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) > parseInt(tree.txt, 10);
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) > parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) > parseInt(tree.txt, 10);
						}
						break;
					case 3: // ">="
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) >= parseInt(tree.txt, 10) - 1;
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) >= parseInt(tree.txt, 10) - 1;
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) >= parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) >= parseInt(tree.txt, 10);
						}
						break;
					case 4: // "<"
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) < parseInt(tree.txt, 10) - 1;
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) < parseInt(tree.txt, 10) - 1;
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) < parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) < parseInt(tree.txt, 10);
						}
						break;
					default: // "<="
						if (speedInMiles) {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) <= parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) <= parseInt(tree.txt, 10);
						} else {
							fwdRes = parseInt(segment.attributes.fwdMaxSpeed, 10) <= parseInt(tree.txt, 10);
							revRes = parseInt(segment.attributes.revMaxSpeed, 10) <= parseInt(tree.txt, 10);
						}
						break;
				}
			}
			if (spdDir === 5) {
				fwdRes = fwdRes && !segment.attributes.fwdDirection;
				revRes = revRes && !segment.attributes.revDirection;
			} else {
				fwdRes = fwdRes && segment.attributes.fwdDirection;
				revRes = revRes && segment.attributes.revDirection;
			}
			switch (spdDir) {
				case 0: // "none"
					result = !fwdRes && !revRes;
					break;
				case 1: // "any"
					result = fwdRes || revRes;
					break;
				case 2: // "both"
					result = fwdRes && revRes;
					break;
				case 3: // "A->B"
					result = fwdRes;
					break;
				case 4: // "B->A"
					result = revRes;
					break;
				case 5: // "hidden"
					result = fwdRes || revRes;
					break;
				case 6: // "unverified"
					result = (fwdRes && segment.attributes.fwdMaxSpeedUnverified) || (revRes && segment.attributes.revMaxSpeedUnverified);
					break;
				default: // "only one"
					result = fwdRes !== revRes;
					break;
			}
			break;
		case "SpdC":
			switch (tree.op) {
				case "0":
					result = (!segment.attributes.fwdDirection || (segment.attributes.fwdFlags & 1) !== 1) &&
						(!segment.attributes.revDirection || (segment.attributes.revFlags & 1) !== 1);
					break;
				case "1":
					result = (segment.attributes.fwdDirection && (segment.attributes.fwdFlags & 1) === 1) ||
						(segment.attributes.revDirection && (segment.attributes.revFlags & 1) === 1);
					break;
				case "2":
					result = (segment.attributes.fwdDirection && (segment.attributes.fwdFlags & 1) === 1) &&
						(segment.attributes.revDirection && (segment.attributes.revFlags & 1) === 1);
					break;
				case "3":
					result = segment.attributes.fwdDirection && (segment.attributes.fwdFlags & 1) === 1;
					break;
				case "4":
					result = segment.attributes.revDirection && (segment.attributes.revFlags & 1) === 1;
					break;
				case "5":
					result = (!segment.attributes.fwdDirection && (segment.attributes.fwdFlags & 1) === 1) ||
						(!segment.attributes.revDirection && (segment.attributes.revFlags & 1) === 1);
					break;
				default:
					result = (segment.attributes.fwdDirection && (segment.attributes.fwdFlags & 1) === 1) !=
						(segment.attributes.revDirection && (segment.attributes.revFlags & 1) === 1);
					break;
			}
			break;
		case "IsNew":
			if (tree.op) {
				result = segment.isNew();
			} else {
				result = !segment.isNew();
			}
			break;
		case "IsChngd":
			if (tree.op) {
				result = !segment.isUnchanged();
			} else {
				result = segment.isUnchanged();
			}
			break;
		case "OnScr":
			var eg = uWaze.map.getExtent().toGeometry();
			var os = eg.intersects(segment.getOLGeometry());
			if (tree.op) {
				result = os;
			} else {
				result = !os;
			}
			break;
		case "Restr":
			if (tree.op) {
				result = segment.getDrivingRestrictionCount() !== 0;
			} else {
				result = segment.getDrivingRestrictionCount() === 0;
			}
			break;
		case "HNs":
			if (tree.op) {
				result = segment.attributes.hasHNs;
			} else {
				result = !segment.attributes.hasHNs;
			}
			break;
		case "Restr2":
			var opDir = tree.op % 10;
			var x = Math.floor(tree.op / 10);
			var opLane = x % 10;
			var x = Math.floor(x / 10);
			var opCar = x % 10;
			var x = Math.floor(x / 10);
			var opType = x % 10;
			var x = Math.floor(x / 10);
			var opNum = x % 10;
			var x = Math.floor(x / 10);
			var opSel = x % 10;
			var x = Math.floor(x / 10);
			var opSubscr = x % 10;
			var x = Math.floor(x / 10);
			var opDays = x % 10;
			var x = Math.floor(x / 10);
			var opHours = x % 10;
			var x = Math.floor(x / 10);
			var opRange = x % 10;
			result = false;
			var restr = segment.attributes.restrictions;
			for(var i = 0; i < restr.length; i++) {
				var rtmp = true;

				switch(opDir) {
					case 1:
						if (restr[i]._direction !== 'BOTH') {
							rtmp = false;
						}
						break;
					case 2:
						if (restr[i]._direction !== 'FWD') {
							rtmp = false;
						}
						break;
					case 3:
						if (restr[i]._direction !== 'REV') {
							rtmp = false;
						}
						break;
					default:
						break;
				}
				if (opLane !== 0 && restr[i]._disposition !== opLane) {
					rtmp = false;
				}
				if (opCar === 9 && restr[i]._laneType !== null) {
					rtmp = false;
				}
				if (opCar !== 0 && opCar !== 9 && restr[i]._laneType !== opCar) {
					rtmp = false;
				}
				if (opDays !== 0 && restr[i]._timeFrames[0]._weekdays === 127) {
					rtmp = false;
				}
				if (opHours !== 0 && restr[i]._timeFrames[0]._fromTime === null) {
					rtmp = false;
				}
				if (opRange !== 0 && restr[i]._timeFrames[0]._startDate === null) {
					rtmp = false;
				}
				switch(opType) {
					case 1:
						if (restr[i]._defaultType !== 'BLOCKED' || !restr[i]._driveProfiles.has('FREE')) {
							rtmp = false;
						} else {
							if (opNum !== 0) {
								for (var j = 0; j < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; j++) {
									if (restr[i]._driveProfiles.get('FREE')._driveProfiles[j]._numPassengers === opNum) {
										break;
									}
								}
								if (j === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
									rtmp = false;
								}
							}
							switch (opSel) {
								case 1: // ANY
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; k++) {
											if (restr[i]._driveProfiles.get('FREE')._driveProfiles[k]._vehicleTypes[0] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
											break;
										}
									}
									if (j === tree.sel.length) {
										rtmp = false;
									}
									break;
								case 2: // ALL
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; k++) {
											if (restr[i]._driveProfiles.get('FREE')._driveProfiles[k]._vehicleTypes[0] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
											rtmp = false
											break;
										}
									}
									break;
								default:
									break;
							}
							if (opSubscr !== 0) {
								for (var j = 0; j < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; j++) {
									if (restr[i]._driveProfiles.get('FREE')._driveProfiles[j]._subscriptions[0] === tree.subscr) {
										break;
									}
								}
								if (j === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
									rtmp = false;
								}
							}
						}
						break;
					case 2:
						if (restr[i]._defaultType !== 'TOLL') {
							rtmp = false;
						} else {
							if (opNum !== 0) {
								for (var j = 0; j < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; j++) {
									if (restr[i]._driveProfiles.get('FREE')._driveProfiles[j]._numPassengers === opNum) {
										break;
									}
								}
								if (j === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
									rtmp = false;
								}
							}
							switch (opSel) {
								case 1: // ANY
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; k++) {
											if (restr[i]._driveProfiles.get('FREE')._driveProfiles[k]._vehicleTypes[0] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
											break;
										}
									}
									if (j === tree.sel.length) {
										rtmp = false;
									}
									break;
								case 2: // ALL
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; k++) {
											if (restr[i]._driveProfiles.get('FREE')._driveProfiles[k]._vehicleTypes[0] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
											rtmp = false
											break;
										}
									}
									break;
								default:
									break;
							}
							if (opSubscr !== 0) {
								for (var j = 0; j < restr[i]._driveProfiles.get('FREE')._driveProfiles.length; j++) {
									if (restr[i]._driveProfiles.get('FREE')._driveProfiles[j]._subscriptions[0] === tree.subscr) {
										break;
									}
								}
								if (j === restr[i]._driveProfiles.get('FREE')._driveProfiles.length) {
									rtmp = false;
								}
							}
						}
						break;
					case 3:
						if (restr[i]._defaultType !== 'BLOCKED' ||  restr[i]._driveProfiles.has('FREE')) {
							rtmp = false;
						}
						break;
					case 4:
						if (restr[i]._defaultType !== 'FREE') {
							rtmp = false;
						} else {
							switch (opSel) {
								case 1: // ANY
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes.length; k++) {
											if (restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes[k] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k < restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes.length) {
											break;
										}
									}
									if (j === tree.sel.length) {
										rtmp = false;
									}
									break;
								case 2: // ALL
									for (var j = 0; j < tree.sel.length; j++) {
										for (var k = 0; k < restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes.length; k++) {
											if (restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes[k] === RestrCarTypesN[tree.sel[j]]) {
												break;
											}
										}
										if (k === restr[i]._driveProfiles.get('BLOCKED')._driveProfiles[0]._vehicleTypes.length) {
											rtmp = false
											break;
										}
									}
									break;
								default:
									break;
							}
						}
						break;
					default:
						break;
				}
				if (rtmp) {
					result = true;
					break;
				}
			}
			break;
		case "Clsr":
			if (typeof(tree.op) === "boolean") {
				if (tree.op) {
					result = segment.hasClosures();
				} else {
					result = !segment.hasClosures();
				}
			} else {
				if (segment.hasClosures()) {
					result = false;
					for (var closure in uWaze.model.roadClosures.objects) {
						if (uWaze.model.roadClosures.objects[closure].segID === segment.attributes.id) {
							var cmpDateTxt;
							if (tree.op >= 6) {
								cmpDateTxt = uWaze.model.roadClosures.objects[closure].endDate;
							} else {
								cmpDateTxt = uWaze.model.roadClosures.objects[closure].startDate;
							}
							var cmpDateArr = cmpDateTxt.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
							var cmpDate = new Date(parseInt(cmpDateArr[1], 10), parseInt(cmpDateArr[2], 10) - 1, parseInt(cmpDateArr[3], 10), parseInt(cmpDateArr[4], 10), parseInt(cmpDateArr[5], 10), 0, 0);
							var cmpDays = Math.floor((cmpDate.getTime() - new Date().getTime()) / 86400000);
							switch (tree.op) {
								case 0:
								case 6:
									result = parseInt(tree.txt, 10) > cmpDays;
									break;
								case 1:
								case 7:
									result = parseInt(tree.txt, 10) <= cmpDays;
									break;
								case 2:
								case 8:
									result = parseInt(tree.txt, 10) < cmpDays;
									break;
								case 3:
								case 9:
									result = parseInt(tree.txt, 10) >= cmpDays;
									break;
								case 4:
								case 10:
									result = parseInt(tree.txt, 10) === cmpDays;
									break;
								case 5:
								case 11:
									result = parseInt(tree.txt, 10) !== cmpDays;
									break;
								default:
									result = false;
									break;
							}
						}
					}
				} else {
					result = false;
				}
			}
			break;
		case "ClReas":
			if (segment.hasClosures()) {
				for (var closure in uWaze.model.roadClosures.objects) {
					if (uWaze.model.roadClosures.objects[closure].attributes.segID === segment.attributes.id) {
						var condTxt = tree.txt;
						var reason = uWaze.model.roadClosures.objects[closure].attributes.reason;
						if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
							condTxt = condTxt.toLowerCase();
							reason = reason.toLowerCase();
						}
						switch (tree.op) {
							case "0":
								result = reason == condTxt;
								break;
							case "1":
								result = reason != condTxt;
								break;
							case "2":
								result = reason.indexOf(condTxt) >= 0;
								break;
							case "3":
								result = reason.indexOf(condTxt) < 0;
								break;
							default:
								var re;
								if (getId("cbRSCaseSens").checked) {
									re = new RegExp(condTxt);
								} else {
									re = new RegExp(condTxt, "i");
								}
								result = reason.search(re) >= 0;
								break;
						}
					}
				}
			} else {
				result = false;
			}
			break;
		case "ClEvent":
			if (segment.hasClosures()) {
				for (var closure in uWaze.model.roadClosures.objects) {
					if (uWaze.model.roadClosures.objects[closure].attributes.segID === segment.attributes.id) {
						var condTxt = tree.txt;
						var eventId = uWaze.model.roadClosures.objects[closure].attributes.eventId;
						var eventNames;
						if (eventId == null) {
							eventNames = [{value: "None"}];
						} else {
							eventNames = uWaze.model.majorTrafficEvents.objects[eventId].attributes.names;
						}
						for(i = 0; i < eventNames.length; i++){
							var name = eventNames[i].value;
							if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
								condTxt = condTxt.toLowerCase();
								reason = reason.toLowerCase();
							}
							switch (tree.op) {
								case "0":
									result = result || name == condTxt;
									break;
								case "1":
									result = result || name != condTxt;
									break;
								case "2":
									result = result || name.indexOf(condTxt) >= 0;
									break;
								case "3":
									result = result || name.indexOf(condTxt) < 0;
									break;
								default:
									var re;
									if (getId("cbRSCaseSens").checked) {
										re = new RegExp(condTxt);
									} else {
										re = new RegExp(condTxt, "i");
									}
									result = result || name.search(re) >= 0;
									break;
							}
						}
					}
				}
			} else {
				result = false;
			}
			break;
		case "ClWho":
			if (segment.hasClosures()) {
				for (var closure in uWaze.model.roadClosures.objects) {
					if (uWaze.model.roadClosures.objects[closure].attributes.segID === segment.attributes.id) {
						var condTxt = tree.txt;
						var userId;
						var opCmp = tree.op % 10;
						var opType = Math.floor(tree.op / 10);
						if (opType === 0) {
							userId = uWaze.model.roadClosures.objects[closure].attributes.createdBy;
						} else {
							userId = uWaze.model.roadClosures.objects[closure].attributes.updatedBy;
						}
						if (typeof(userId) === 'undefined' || userId === null) {
							name = '';
						} else {
							name = uWaze.model.users.getObjectById(userId).attributes.userName;
							if ((typeof(name) === "undefined") || (name === null)) {
								return false;
							}
						}
						if ((!getId("cbRSCaseSens").checked) && (tree.op != 4)) {
							condTxt = condTxt.toLowerCase();
							name = name.toLowerCase();
						}
						switch (opCmp) {
							case 0:
								result = name == condTxt;
								break;
							case 1:
								result = name != condTxt;
								break;
							case 2:
								result = name.indexOf(condTxt) >= 0;
								break;
							case 3:
								result = name.indexOf(condTxt) < 0;
								break;
							default:
								var re;
								if (getId("cbRSCaseSens").checked) {
									re = new RegExp(condTxt);
								} else {
									re = new RegExp(condTxt, "i");
								}
								result = name.search(re) >= 0;
								break;
						}
					}
				}
			} else {
				result = false;
			}
			break;
		case "Updtd":
			var name;
			if (typeof(segment.attributes.updatedBy) === 'undefined' || segment.attributes.updatedBy === null) {
				name = '';
			} else {
				name = uWaze.model.users.getObjectById(segment.attributes.updatedBy).attributes.userName;
				if ((typeof(name) === "undefined") || (name === null)) {
					return false;
				}
			}
			var condTxt = tree.txt;
			if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
				condTxt = condTxt.toLowerCase();
				name = name.toLowerCase();
			}
			switch (tree.op) {
				case "0":
					result = name == condTxt;
					break;
				case "1":
					result = name != condTxt;
					break;
				case "2":
					result = name.indexOf(condTxt) >= 0;
					break;
				case "3":
					result = name.indexOf(condTxt) < 0;
					break;
				default:
					var re;
					if (getId("cbRSCaseSens").checked) {
						re = new RegExp(condTxt);
					} else {
						re = new RegExp(condTxt, "i");
					}
					result = name.search(re) >= 0;
					break;
			}
			break;
		case "UpLev":
			var lev;
			if (typeof(segment.attributes.updatedBy) === 'undefined' || segment.attributes.updatedBy === null) {
				return false;
			}
			lev = uWaze.model.users.getObjectById(segment.attributes.updatedBy).attributes.rank;
			if (typeof(lev) !== "number") {
				return false;
			}
			lev += 1;
			switch (tree.op) {
				case "0":
					result = parseInt(tree.id, 10) === lev;
					break;
				case "1":
					result = parseInt(tree.id, 10) !== lev;
					break;
				case "2":
					result = parseInt(tree.id, 10) < lev;
					break;
				case "3":
					result = parseInt(tree.id, 10) <= lev;
					break;
				case "4":
					result = parseInt(tree.id, 10) > lev;
					break;
				default:
					result = parseInt(tree.id, 10) >= lev;
					break;
			}
			break;
		case "Crtd":
			var name;
			if (typeof(segment.attributes.createdBy) === 'undefined' || segment.attributes.createdBy === null) {
				name = '';
			} else {
				name = uWaze.model.users.getObjectById(segment.attributes.createdBy).attributes.userName;
				if ((typeof(name) === "undefined") || (name === null)) {
					return false;
				}
			}
			var condTxt = tree.txt;
			if ((!getId("cbRSCaseSens").checked) && (tree.op != "4")) {
				condTxt = condTxt.toLowerCase();
				name = name.toLowerCase();
			}
			switch (tree.op) {
				case "0":
					result = name == condTxt;
					break;
				case "1":
					result = name != condTxt;
					break;
				case "2":
					result = name.indexOf(condTxt) >= 0;
					break;
				case "3":
					result = name.indexOf(condTxt) < 0;
					break;
				default:
					var re;
					if (getId("cbRSCaseSens").checked) {
						re = new RegExp(condTxt);
					} else {
						re = new RegExp(condTxt, "i");
					}
					result = name.search(re) >= 0;
					break;
			}
			break;
		case "CrLev":
			var lev;
			if (typeof(segment.attributes.createdBy) === 'undefined' || segment.attributes.createdBy === null) {
				return false;
			}
			lev = uWaze.model.users.getObjectById(segment.attributes.createdBy).attributes.rank;
			if (typeof(lev) !== "number") {
				return false;
			}
			lev += 1;
			switch (tree.op) {
				case "0":
					result = parseInt(tree.id, 10) === lev;
					break;
				case "1":
					result = parseInt(tree.id, 10) !== lev;
					break;
				case "2":
					result = parseInt(tree.id, 10) < lev;
					break;
				case "3":
					result = parseInt(tree.id, 10) <= lev;
					break;
				case "4":
					result = parseInt(tree.id, 10) > lev;
					break;
				default:
					result = parseInt(tree.id, 10) >= lev;
					break;
			}
			break;
		case "LastU":
			var updatedDays;
			if (typeof(segment.attributes.updatedOn) === 'undefined' || sid === null) {
				updatedDays = 0;
			} else {
				updatedDays = Math.floor((new Date().getTime() - segment.attributes.updatedOn) / 86400000);
			}
			switch (tree.op) {
				case "0":
					result = parseInt(tree.txt, 10) === updatedDays;
					break;
				case "1":
					result = parseInt(tree.txt, 10) !== updatedDays;
					break;
				case "2":
					result = parseInt(tree.txt, 10) < updatedDays;
					break;
				case "3":
					result = parseInt(tree.txt, 10) <= updatedDays;
					break;
				case "4":
					result = parseInt(tree.txt, 10) > updatedDays;
					break;
				default:
					result = parseInt(tree.txt, 10) >= updatedDays;
					break;
			}
			break;
		case "Length":
			switch (tree.op) {
				case "0":
					result = parseInt(tree.txt, 10) === segment.attributes.length;
					break;
				case "1":
					result = parseInt(tree.txt, 10) !== segment.attributes.length;
					break;
				case "2":
					result = parseInt(tree.txt, 10) < segment.attributes.length;
					break;
				case "3":
					result = parseInt(tree.txt, 10) <= segment.attributes.length;
					break;
				case "4":
					result = parseInt(tree.txt, 10) > segment.attributes.length;
					break;
				default:
					result = parseInt(tree.txt, 10) >= segment.attributes.length;
					break;
			}
			break;
		case "RoutePrf":
			switch (tree.op) {
				case "0":
					if (typeof(segment.attributes.routingRoadType) !== 'number') {
						result = false;
					} else {
						result = (segment.attributes.roadType === 3 && segment.attributes.routingRoadType === 6) ||
							(segment.attributes.roadType === 6 && segment.attributes.routingRoadType === 7) ||
							(segment.attributes.roadType === 7 && segment.attributes.routingRoadType === 2) ||
							(segment.attributes.roadType === 2 && segment.attributes.routingRoadType === 1);
					};
					break;
				case "1":
					result = typeof(segment.attributes.routingRoadType) !== 'number';
					break;
				default:
					if (typeof(segment.attributes.routingRoadType) !== 'number') {
						result = false;
					} else {
						result = (segment.attributes.roadType === 6 && segment.attributes.routingRoadType === 3) ||
							(segment.attributes.roadType === 7 && segment.attributes.routingRoadType === 6) ||
							(segment.attributes.roadType === 2 && segment.attributes.routingRoadType === 7) ||
							(segment.attributes.roadType === 1 && segment.attributes.routingRoadType === 2);
					};
					break;
			}
			break;
		case "RouteRoadType":
			var rrt;
			if (typeof(segment.attributes.routingRoadType) === 'number') {
				rrt = segment.attributes.routingRoadType;
			} else {
				rrt = segment.attributes.roadType;
			}
			if (tree.op === "0") {
				result = tree.id == rrt;
			} else {
				result = tree.id != rrt;
			}
			break;
		case "SegId":
			var ids = tree.txt.replace(/[^\d]/g,',');
			var idsArr = ids.split(',');
			switch (tree.op) {
				case "0":
					result = false;
					break;
				default:
					result = true;
					break;
			}
			for(i = 0; i < idsArr.length; i++){
				if (idsArr[i] !== '') {
					switch (tree.op) {
						case "0":
							result = result || idsArr[i] == segment.attributes.id;
							break;
						default:
							result = result && idsArr[i] != segment.attributes.id;
							break;
					}
				}
			}
			break;
		case "PlaceId":
			var place = uWaze.model.venues.objects[tree.txt];
			if (typeof(place) === 'undefined' || place.isPoint()) {
				result = false;
			} else {
				var polygon = uWaze.userscripts.toOLGeometry(place.getPolygonGeometry());
				var points = segment.getOLGeometry().getSortedSegments();
				switch (tree.op) {
					case "0":
						result = true;
						break;
					default:
						result = false;
						break;
				}
				for (i = 0; i < points.length; i++) {
					var p1 = new uOpenLayers.Geometry.Point(points[i].x1, points[i].y1);
					var p2 = new uOpenLayers.Geometry.Point(points[i].x2, points[i].y2);
					switch (tree.op) {
						case "0":
							result = result && polygon.containsPoint(p1) && polygon.containsPoint(p2);
							break;
						default:
							result = result || polygon.containsPoint(p1) || polygon.containsPoint(p2);
							break;
					}
				}
			}
			break;
		case "CommentId":
			var comment = uWaze.model.mapComments.objects[tree.txt];
			if (typeof(comment) === 'undefined' || comment.isPoint()) {
				result = false;
			} else {
				var polygon = uWaze.userscripts.toOLGeometry(comment.getPolygonGeometry());
				var points = segment.getOLGeometry().getSortedSegments();
				switch (tree.op) {
					case "0":
						result = true;
						break;
					default:
						result = false;
						break;
				}
				for (i = 0; i < points.length; i++) {
					var p1 = new uOpenLayers.Geometry.Point(points[i].x1, points[i].y1);
					var p2 = new uOpenLayers.Geometry.Point(points[i].x2, points[i].y2);
					switch (tree.op) {
						case "0":
							result = result && polygon.containsPoint(p1) && polygon.containsPoint(p2);
							break;
						default:
							result = result || polygon.containsPoint(p1) || polygon.containsPoint(p2);
							break;
					}
				}
			}
			break;
		case "Edtbl":
			if (tree.op) {
				result = segment.arePropertiesEditable();
			} else {
				result = !segment.arePropertiesEditable();
			}
			break;
		case "Inbj":
			if (tree.op) {
				result = segment.isInBigJunction();
			} else {
				result = !segment.isInBigJunction();
			}
			break;
		case "UTurn":
			result = false;
			for(var seg2 in uWaze.model.turnGraph.adjacencyList.get(segment.attributes.id + 'f')) {
				seg2 = seg2.substring(0, seg2.length-1);
				if (seg2 == segment.attributes.id) {
					result = true;
					break;
				}
				if (!result) {
					for(var seg2 in uWaze.model.turnGraph.adjacencyList.get(segment.attributes.id + 'r')) {
						seg2 = seg2.substring(0, seg2.length-1);
						if (seg2 != segment.attributes.id) {
							result = true;
							break;
						}
					}
				}
			}
			if (!tree.op) {
				result = !result;
			}
			break;
		case "LWidth":
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			var opValue = Math.round(tree.txt * 100);
			var fwdValue;
			if (segment.attributes.fromLanesInfo === null) {
				fwdValue = 0;
			} else {
				if (segment.attributes.fromLanesInfo.laneWidth === null) {
					fwdValue = -1;
				} else {
					fwdValue = segment.attributes.fromLanesInfo.laneWidth;
				}
			}
			var revValue;
			if (segment.attributes.toLanesInfo === null) {
				revValue = 0;
			} else {
				if (segment.attributes.toLanesInfo.laneWidth === null) {
					revValue = -1;
				} else {
					revValue = segment.attributes.toLanesInfo.laneWidth;
				}
			}
			var fwdRes;
			var revRes;
			switch (opCond) {
				case 0: // "="
					if (speedInMiles) {
						fwdRes = fwdValue === opValue || fwdValue === opValue - 1;
						revRes = revValue === opValue || revValue === opValue - 1;
					} else {
						fwdRes = fwdValue === opValue;
						revRes = revValue === opValue;
					}
					break;
				case 1: // "!="
					if (speedInMiles) {
						fwdRes = fwdValue !== opValue && fwdValue !== opValue - 1;
						revRes = revValue !== opValue && revValue !== opValue - 1;
					} else {
						fwdRes = fwdValue !== opValue;
						revRes = revValue !== opValue;
					}
					break;
				case 2: // ">"
					if (speedInMiles) {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					} else {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					}
					break;
				case 3: // ">="
					if (speedInMiles) {
						fwdRes = fwdValue >= opValue - 1;
						revRes = revValue >= opValue - 1;
					} else {
						fwdRes = fwdValue >= opValue;
						revRes = revValue >= opValue;
					}
					break;
				case 4: // "<"
					if (speedInMiles) {
						fwdRes = fwdValue < opValue - 1;
						revRes = revValue < opValue - 1;
					} else {
						fwdRes = fwdValue < opValue;
						revRes = revValue < opValue;
					}
					break;
				case 5: // "<="
					if (speedInMiles) {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					} else {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					}
					break;
				default: // "is default"
					fwdRes = fwdValue === -1;
					revRes = revValue === -1;
			}
			if (opDir === 5) {
				fwdRes = fwdRes && !segment.attributes.fwdDirection;
				revRes = revRes && !segment.attributes.revDirection;
			} else {
				fwdRes = fwdRes && segment.attributes.fwdDirection;
				revRes = revRes && segment.attributes.revDirection;
			}
			switch (opDir) {
				case 0: // "none"
					result = !fwdRes && !revRes;
					break;
				case 1: // "any"
					result = fwdRes || revRes;
					break;
				case 2: // "both"
					result = fwdRes && revRes;
					break;
				case 3: // "A->B"
					result = fwdRes;
					break;
				case 4: // "B->A"
					result = revRes;
					break;
				case 5: // "hidden"
					result = fwdRes || revRes;
					break;
				case 6: // "unverified"
					result = (fwdRes && segment.attributes.fwdMaxSpeedUnverified) || (revRes && segment.attributes.revMaxSpeedUnverified);
					break;
				default: // "only one"
					result = fwdRes !== revRes;
					break;
			}
			break;
		case "NrLanesW":
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			var opValue = parseInt(tree.txt, 10);
			var fwdValue;
			if (segment.attributes.fromLanesInfo === null) {
				fwdValue = 0;
			} else {
				fwdValue = segment.attributes.fromLanesInfo.numberOfLanes;
			}
			var revValue;
			if (segment.attributes.toLanesInfo === null) {
				revValue = 0;
			} else {
				revValue = segment.attributes.toLanesInfo.numberOfLanes;
			}
			var fwdRes;
			var revRes;
			switch (opCond) {
				case 0: // "="
					if (speedInMiles) {
						fwdRes = fwdValue === opValue || fwdValue === opValue - 1;
						revRes = revValue === opValue || revValue === opValue - 1;
					} else {
						fwdRes = fwdValue === opValue;
						revRes = revValue === opValue;
					}
					break;
				case 1: // "!="
					if (speedInMiles) {
						fwdRes = fwdValue !== opValue && fwdValue !== opValue - 1;
						revRes = revValue !== opValue && revValue !== opValue - 1;
					} else {
						fwdRes = fwdValue !== opValue;
						revRes = revValue !== opValue;
					}
					break;
				case 2: // ">"
					if (speedInMiles) {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					} else {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					}
					break;
				case 3: // ">="
					if (speedInMiles) {
						fwdRes = fwdValue >= opValue - 1;
						revRes = revValue >= opValue - 1;
					} else {
						fwdRes = fwdValue >= opValue;
						revRes = revValue >= opValue;
					}
					break;
				case 4: // "<"
					if (speedInMiles) {
						fwdRes = fwdValue < opValue - 1;
						revRes = revValue < opValue - 1;
					} else {
						fwdRes = fwdValue < opValue;
						revRes = revValue < opValue;
					}
					break;
				default: // "<="
					if (speedInMiles) {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					} else {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					}
					break;
			}
			if (opDir === 5) {
				fwdRes = fwdRes && !segment.attributes.fwdDirection;
				revRes = revRes && !segment.attributes.revDirection;
			} else {
				fwdRes = fwdRes && segment.attributes.fwdDirection;
				revRes = revRes && segment.attributes.revDirection;
			}
			switch (opDir) {
				case 0: // "none"
					result = !fwdRes && !revRes;
					break;
				case 1: // "any"
					result = fwdRes || revRes;
					break;
				case 2: // "both"
					result = fwdRes && revRes;
					break;
				case 3: // "A->B"
					result = fwdRes;
					break;
				case 4: // "B->A"
					result = revRes;
					break;
				case 5: // "hidden"
					result = fwdRes || revRes;
					break;
				case 6: // "unverified"
					result = (fwdRes && segment.attributes.fwdMaxSpeedUnverified) || (revRes && segment.attributes.revMaxSpeedUnverified);
					break;
				default: // "only one"
					result = fwdRes !== revRes;
					break;
			}
			break;
		case "NrLanesG":
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			var opValue = parseInt(tree.txt, 10);
			var fwdValue = segment.attributes.fwdLaneCount;
			var revValue = segment.attributes.revLaneCount;;
			var fwdRes;
			var revRes;
			switch (opCond) {
				case 0: // "="
					if (speedInMiles) {
						fwdRes = fwdValue === opValue || fwdValue === opValue - 1;
						revRes = revValue === opValue || revValue === opValue - 1;
					} else {
						fwdRes = fwdValue === opValue;
						revRes = revValue === opValue;
					}
					break;
				case 1: // "!="
					if (speedInMiles) {
						fwdRes = fwdValue !== opValue && fwdValue !== opValue - 1;
						revRes = revValue !== opValue && revValue !== opValue - 1;
					} else {
						fwdRes = fwdValue !== opValue;
						revRes = revValue !== opValue;
					}
					break;
				case 2: // ">"
					if (speedInMiles) {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					} else {
						fwdRes = fwdValue > opValue;
						revRes = revValue > opValue;
					}
					break;
				case 3: // ">="
					if (speedInMiles) {
						fwdRes = fwdValue >= opValue - 1;
						revRes = revValue >= opValue - 1;
					} else {
						fwdRes = fwdValue >= opValue;
						revRes = revValue >= opValue;
					}
					break;
				case 4: // "<"
					if (speedInMiles) {
						fwdRes = fwdValue < opValue - 1;
						revRes = revValue < opValue - 1;
					} else {
						fwdRes = fwdValue < opValue;
						revRes = revValue < opValue;
					}
					break;
				default: // "<="
					if (speedInMiles) {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					} else {
						fwdRes = fwdValue <= opValue;
						revRes = revValue <= opValue;
					}
					break;
			}
			if (opDir === 5) {
				fwdRes = fwdRes && !segment.attributes.fwdDirection;
				revRes = revRes && !segment.attributes.revDirection;
			} else {
				fwdRes = fwdRes && segment.attributes.fwdDirection;
				revRes = revRes && segment.attributes.revDirection;
			}
			switch (opDir) {
				case 0: // "none"
					result = !fwdRes && !revRes;
					break;
				case 1: // "any"
					result = fwdRes || revRes;
					break;
				case 2: // "both"
					result = fwdRes && revRes;
					break;
				case 3: // "A->B"
					result = fwdRes;
					break;
				case 4: // "B->A"
					result = revRes;
					break;
				case 5: // "hidden"
					result = fwdRes || revRes;
					break;
				case 6: // "unverified"
					result = (fwdRes && segment.attributes.fwdMaxSpeedUnverified) || (revRes && segment.attributes.revMaxSpeedUnverified);
					break;
				default: // "only one"
					result = fwdRes !== revRes;
					break;
			}
			break;
		case "Bool":
			if (tree.op === "0") {
				result = true;
			} else {
				result = false;
			}
			break;
		case "And":
			if (checkExpr (tree.L, segment)) {
				result = checkExpr (tree.R, segment);
			} else {
				result = false;
			}
			break;
		case "Or":
			if (checkExpr (tree.L, segment)) {
				result = true;
			} else {
				result = checkExpr (tree.R, segment);
			}
			break;
		case "Not":
			result = !checkExpr (tree.R, segment);
			break;
		case "Bkt":
			result = checkExpr (tree.L, segment);
			break;
		case "Connect":
			result = false;
			switch (tree.op) {
				case "0":
					if (segment.attributes.fromNodeID !== null) {
						var segIDs = uWaze.model.nodes.getObjectById(segment.attributes.fromNodeID).attributes.segIDs;
						for(var i = 0; i < segIDs.length; i++) {
							if (segIDs[i] !== segment.attributes.id) {
								var segment2 = uWaze.model.segments.getObjectById(segIDs[i]);
								if (typeof(segment2) !== 'undefined') {
									result = checkExpr (tree.L, segment2);
									if (result) {
										break;
									}
								}
							}
						}
					}
					if (!result) {
						if (segment.attributes.toNodeID !== null) {
							var segIDs = uWaze.model.nodes.getObjectById(segment.attributes.toNodeID).attributes.segIDs;
							for(var i = 0; i < segIDs.length; i++) {
								if (segIDs[i] !== segment.attributes.id) {
									var segment2 = uWaze.model.segments.getObjectById(segIDs[i]);
									if (typeof(segment2) !== 'undefined') {
										result = checkExpr (tree.L, segment2);
										if (result) {
											break;
										}
									}
								}
							}
						}
					}
					break;
				default:
					for(var seg2 in uWaze.model.turnGraph.adjacencyList.get(segment.attributes.id + 'f')) {
						seg2 = seg2.substring(0, seg2.length-1);
						if (seg2 != segment.attributes.id) {
							var segment2 = uWaze.model.segments.getObjectById(seg2);
							if (typeof(segment2) !== 'undefined') {
								result = checkExpr (tree.L, segment2);
								if (result) {
									break;
								}
							}
						}
					}
					if (!result) {
						for(var seg2 in uWaze.model.turnGraph.adjacencyList.get(segment.attributes.id + 'r')) {
							seg2 = seg2.substring(0, seg2.length-1);
							if (seg2 != segment.attributes.id) {
								var segment2 = uWaze.model.segments.getObjectById(seg2);
								if (typeof(segment2) !== 'undefined') {
									result = checkExpr (tree.L, segment2);
									if (result) {
										break;
									}
								}
							}
						}
					}
					break;
			}
			break;
		default:
			result = false;
			break;
	}
	return result;
}


function genExptrTxt(tree)
{
	if (typeof (tree.type) === 'undefined') {
		return "";
	}

	var result;
	switch (tree.type) {
		case "Country":
			result = 'Country ' + EqualOps[tree.op] + ' "' + Countries[tree.id] + '"';
			break;
		case "State":
		case "City":
		case "Street":
		case "AState":
		case "XState":
		case "ACity":
		case "XCity":
		case "AStreet":
		case "XStreet":
			switch (tree.type) {
				case "AState":
					result = 'Alt. State ';
					break;
				case "XState":
					result = 'Prim. or Alt. State ';
					break;
				case "ACity":
					result = 'Alt. City ';
					break;
				case "XCity":
					result = 'Prim. or Alt. City ';
					break;
				case "AStreet":
					result = 'Alt. Street ';
					break;
				case "XStreet":
					result = 'Prim. or Alt. Street ';
					break;
				default:
					result = tree.type + ' ';
					break;
			}
			switch (tree.op) {
				case "0":
				case "1":
				case "4":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "NoName":
			if (tree.op) {
				result = 'Unnamed';
			} else {
				result = 'Has name';
			}
			break;
		case "ANoName":
			if (tree.op) {
				result = 'NO Alt. names';
			} else {
				result = 'Has Alt. name(s)';
			}
			break;
		case "RoadType":
			result = 'Road Type ' + EqualOps[tree.op] + ' "' + I18n.translations[I18n.currentLocale()].segment.road_types[tree.id] + '"';
			break;
		case "IsToll":
			if (tree.op) {
				result = 'Is Toll Road';
			} else {
				result = 'Is NOT Toll Road';
			}
			break;
		case "IsRound":
			if (tree.op) {
				result = 'Is Roundabout';
			} else {
				result = 'Is NOT Roundabout';
			}
			break;
		case "Direction":
			result = 'Direction ' + EqualOps[tree.op] + ' "' + Directions[tree.id] + '"';
			break;
		case "Elevation":
			if (tree.id == 0) {
				result = 'Elevation ' + IntegerOps[tree.op] + ' "Ground"';
			} else {
				result = 'Elevation ' + IntegerOps[tree.op] + ' ' + tree.id;
			}
			break;
		case "Tunnel":
			if (tree.op) {
				result = 'Is Tunnel';
			} else {
				result = 'Is NOT Tunnel';
			}
			break;
		case "Unpaved":
			if (tree.op) {
				result = 'Is Unpaved';
			} else {
				result = 'Is NOT Unpaved';
			}
			break;
		case "HOV":
			if (tree.op) {
				result = 'Is next to carpool/HOV/bus lane';
			} else {
				result = 'Is NOT next to carpool/HOV/bus lane';
			}
			break;
		case "Headlights":
			if (tree.op) {
				result = 'Headlights are required';
			} else {
				result = 'Headlights are NOT required';
			}
			break;
		case "ManLock":
			result = 'Manual Locks ' + IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "TrLock":
			result = 'Traffic Locks ' + IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "Speed":
			if (typeof(tree.op) === "boolean") {
				if (tree.op) {
					tree.op = '1';
					tree.txt = '';
				} else {
					tree.op = '0';
					tree.txt = '';
				}
			}
			if (typeof(tree.op) === "string") {
				if (tree.op === '8') {
					tree.op = 1;
				} else {
					tree.op = parseInt(tree.op, 10);
				}
			}
			var spdDir = tree.op % 10;
			var spdCond = Math.floor(tree.op / 10);
			if (spdDir === 0) {
				result = 'Has NO speed limit';
			} else if (spdDir !== 6) {
				result = 'Has speed limit';
			} else {
				result = 'Has unverified speed limit';
			}
			if (tree.txt !== '') {
				result += ' ' + IntegerOps[spdCond] + ' ';
				if (speedInMiles) {
					result += km2miles(parseInt(tree.txt, 10)) + ' mph';
				} else {
					result += tree.txt + ' km/h';
				}
			}
			if (spdDir !== 6) {
				if (spdDir === 0) {
					if (tree.txt !== '') {
						result += ' in any direction';
					}
				} else {
					result += ' in ' + DirOps[spdDir] + ' direction';

					if (spdDir === 2) {
						result += 's';
					}
				}
			}
			break;
		case "SpdC":
			if (tree.op === '0') {
				result = 'Has NO avg. speed cam';
			} else {
				result = 'Has avg. speed cam';
			}
			if (tree.op === '0') {
				if (tree.txt !== '') {
					result += ' in any direction';
				}
			} else {
				result += ' in ' + DirOps[tree.op] + ' direction';
				if (tree.op === '2') {
					result += 's';
				}
			}
			break;
		case "IsNew":
			if (tree.op) {
				result = 'Is New';
			} else {
				result = 'Is NOT New';
			}
			break;
		case "IsChngd":
			if (tree.op) {
				result = 'Is Changed';
			} else {
				result = 'Is NOT Changed';
			}
			break;
		case "OnScr":
			if (tree.op) {
				result = 'On Screen';
			} else {
				result = 'OUT of Screen';
			}
			break;
		case "Restr":
			if (tree.op) {
				result = 'Has restriction';
			} else {
				result = 'Has NO restriction';
			}
			break;
		case "HNs":
			if (tree.op) {
				result = 'Has house numbers';
			} else {
				result = 'Has NO house numbers';
			}
			break;
		case "Restr2":
			var opDir = tree.op % 10;
			var x = Math.floor(tree.op / 10);
			var opLane = x % 10;
			var x = Math.floor(x / 10);
			var opCar = x % 10;
			var x = Math.floor(x / 10);
			var opType = x % 10;
			var x = Math.floor(x / 10);
			var opNum = x % 10;
			var x = Math.floor(x / 10);
			var opSel = x % 10;
			var x = Math.floor(x / 10);
			var opSubscr = x % 10;
			var x = Math.floor(x / 10);
			var opDays = x % 10;
			var x = Math.floor(x / 10);
			var opHours = x % 10;
			var x = Math.floor(x / 10);
			var opRange = x % 10;
			result = 'Restriction';
			if (opDir !== 0) {
				result += ' in ' + RestrDirs[opDir] + ' dir.';
			}
			if (opLane !== 0) {
				if (opLane === 1) {
					result += ' ' + RestrLanes[opLane] + ' seg.';
				} else {
					result += ' ' + RestrLanes[opLane] + ' lane';
				}
			}
			if (opCar !== 0) {
				result += ' ' + RestrCars[opCar];
			}
			if (opType !== 0) {
				result += ' driving is ' + RestrTypes[opType];
			}
			if (opNum !== 0) {
				result += ' min. ' + opNum + ' passengers';
			}
			if (opSel !== 0) {
				result += ' ' + RestrSelOps[opSel] + '(';
				for (var i = 0; i < tree.sel.length; i++) {
					if (i > 0) {
						result += ',';
					}
					result += '"' + I18n.translations[I18n.currentLocale()].restrictions.vehicle_types[RestrCarTypes[tree.sel[i]]] + '"';
				}
				result += ')';
			}
			if (opSubscr !== 0) {
				result += ' ' + Subscriptions[tree.subscr];
			}
			if (opDays !== 0) {
				result += ' Days';
			}
			if (opHours !== 0) {
				result += ' Hours';
			}
			if (opRange !== 0) {
				result += ' Date Range';
			}
			break;
		case "Clsr":
			if (typeof(tree.op) === "boolean") {
				if (tree.op) {
					result = 'Has closure';
				} else {
					result = 'Has NO closure';
				}
			} else {
				switch (tree.op) {
					case 0:
						result = "Closure starts before";
						break;
					case 1:
						result = "Closure doesn't start before";
						break;
					case 2:
						result = "Closure starts after";
						break;
					case 3:
						result = "Closure doesn't start after";
						break;
					case 4:
						result = "Closure starts in";
						break;
					case 5:
						result = "Closure doesn't start in";
						break;
					case 6:
						result = "Closure ends before";
						break;
					case 7:
						result = "Closure doesn't end before";
						break;
					case 8:
						result = "Closure ends after";
						break;
					case 9:
						result = "Closure doesn't end after";
						break;
					case 10:
						result = "Closure ends in";
						break;
					case 11:
						result = "Closure doesn't end in";
						break;
					default:
						result = "Error";
						break;
				}
				result += ' ' + tree.txt + ' day';
				if (tree.txt !== '1') {
					result += 's';
				}
			}
			break;
		case "ClReas":
			result = 'Closure reason  ';
			switch (tree.op) {
				case "0":
				case "1":
				case "4":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "ClEvent":
			result = 'Closure event  ';
			switch (tree.op) {
				case "0":
				case "1":
				case "4":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "ClWho":
			var opCmp = tree.op % 10;
			var opType = Math.floor(tree.op / 10);
			result = 'Closure  ';
			if (opType === 0) {
				result += 'created by ';
			} else {
				result += 'updated by ';
			}
			switch (opCmp) {
				case 0:
				case 1:
				case 4:
					result += StringOps[String(opCmp)] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[String(opCmp)] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "Updtd":
			result = 'Updated by ';
			switch (tree.op) {
				case "0":
				case "1":
				case "4":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "UpLev":
			result = 'Updated by level ' + IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "Crtd":
			result = 'Created by ';
			switch (tree.op) {
				case "0":
				case "1":
				case "4":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "CrLev":
			result = 'Created by level ' + IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "LastU":
			result = 'Last update  ' + IntegerOps[tree.op] + ' ' + tree.txt + ' days ago';
			break;
		case "Length":
			result = 'Length ' + IntegerOps[tree.op] + ' ';
			if (speedInMiles) {
				if (tree.txt >= 1609) {
					result += decimalRound(tree.txt/1609.344, -2) + ' miles';
				} else {
					result += Math.round(tree.txt/0.3048) + ' feet';
				}
			} else {
				if (tree.txt >= 1000) {
					result += decimalRound(tree.txt/1000.0, -2) + ' km';
				} else {
					result += tree.txt + ' m';
				}
			}
			break;
		case "RoutePrf":
			result = 'Routing preference ';
			switch (tree.op) {
				case "0":
					result += 'Unfavored';
					break;
				case "1":
					result += 'Neutral';
					break;
				default:
					result += 'Preferred';
					break;
			}
			break;
		case "RouteRoadType":
			result = 'Routing type ' + EqualOps[tree.op] + ' "' + I18n.translations[I18n.currentLocale()].segment.road_types[tree.id] + '"';
			break;
		case "SegId":
			result = 'ID ' + StringOps[tree.op] + ' "' + tree.txt + '"';
			break;
		case "PlaceId":
			switch (tree.op) {
				case "0":
					result = 'fully';
					break;
				default:
					result = 'partially';
					break;
			}
			result += ' inside Place ID "' + tree.txt + '"';
			break;
		case "CommentId":
			switch (tree.op) {
				case "0":
					result = 'fully';
					break;
				default:
					result = 'partially';
					break;
			}
			result += ' inside Comment ID "' + tree.txt + '"';
			break;
		case "Edtbl":
			if (tree.op) {
				result = 'Is Editable';
			} else {
				result = 'Is NOT Editable';
			}
			break;
		case "Inbj":
			if (tree.op) {
				result = 'Is in Junction Box';
			} else {
				result = 'Is NOT in Junction Box';
			}
			break;
		case "UTurn":
			if (tree.op) {
				result = 'Has U-Turn';
			} else {
				result = 'Has NO U-Turns';
			}
			break;
		case "LWidth":
			result = 'Lane width in ';
			tree.op = parseInt(tree.op, 10);
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			result += DirOps[opDir] + ' direction';
			if (opDir === 2) {
				result += 's';
			}
			if (opCond == 9) {
				result += ' is default';
			} else {
				result += ' ' + IntegerOps[opCond] + ' ';
				if (speedInMiles) {
					result += Math.round(tree.txt*100/0.3048)/100.0 + ' feet';
				} else {
					result += Math.round(tree.txt*100)/100.0 + ' m';
				}
			}
			break;
		case "NrLanesW":
			result = 'Nr. of lanes for width in ';
			tree.op = parseInt(tree.op, 10);
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			result += DirOps[opDir] + ' direction';
			if (opDir === 2) {
				result += 's';
			}
			result += ' ' + IntegerOps[opCond] + ' ' + tree.txt;
			break;
		case "NrLanesG":
			result = 'Nr. of lanes for guidance in ';
			tree.op = parseInt(tree.op, 10);
			var opDir = tree.op % 10;
			var opCond = Math.floor(tree.op / 10);
			result += DirOps[opDir] + ' direction';
			if (opDir === 2) {
				result += 's';
			}
			result += ' ' + IntegerOps[opCond] + ' ' + tree.txt;
			break;
		case "Bool":
			if (tree.op === "0") {
				result = 'True';
			} else {
				result = 'False';
			}
			break;
		case "And":
			result = genExptrTxt(tree.L) + ' AND ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Or":
			result = genExptrTxt(tree.L) + ' OR ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Not":
			result = '! ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Bkt":
			result = '(' + genExptrTxt(tree.L) + ')';
			break;
		case "Connect":
			switch (tree.op) {
				case "0":
					result = 'Connected to (';
					break;
				default:
					result = 'Allowed to (';
					break;
			}
			result += genExptrTxt(tree.L) + ')';
			break;
		default:
			result = "";
			break;
	}
	return result;
}


function displayExpr()
{
	var ExprTxt = "";
	for (var i = 0; i < BktCount; i ++) {
		ExprTxt += genExptrTxt(BktTrees[i]);
		switch (BktOps[i].type) {
			case "Connect":
				switch (BktOps[i].op) {
					case "0":
						ExprTxt += 'Connected to (';
						break;
					default:
						ExprTxt += 'Allowed to (';
						break;
				}
				break;
			default:
				ExprTxt += "(";
				break;
		}

	}
	ExprTxt += genExptrTxt(ExprTree);
	getId("outRSExpr").value = ExprTxt;
}


function displayStatus()
{
	if (ExprStatus === 0 || ExprStatus === 2) {
		getId("btnRSAnd").disabled = true;
		getId("btnRSOr").disabled = true;
		if (ExprStatus === 2) {
			getId("btnRSNot").disabled = true;
		} else {
			getId("btnRSNot").disabled = false;
		}
		getId("btnRSRBkt").disabled = true;
		getId("btnRSSelect").disabled = true;
	} else {
		getId("btnRSAnd").disabled = false;
		getId("btnRSOr").disabled = false;
		getId("btnRSNot").disabled = true;
		if (BktCount === 0) {
			getId("btnRSRBkt").disabled = true;
			getId("btnRSSelect").disabled = false;
		} else {
			getId("btnRSRBkt").disabled = false;
			getId("btnRSSelect").disabled = true;
		}
	}

	getId("outRSNumBkt").value = BktCount;
	displayExpr();
}


function addCondition(cond)
{
	if (ExprStatus === 1) {
		makeAnd();
	}
	if (typeof (ExprTree.type) === 'undefined') {
		ExprTree = cond;
	} else {
		if (typeof (ExprTree.R) === 'undefined') {
			ExprTree.R = cond;
		} else {
			ExprTree.R.R = cond;
		}
	}
	ExprStatus = 1;
	displayStatus ();
}


function makeCountry(ev)
{
	var cond = {};
	cond.type = "Country";
	cond.op = getId("opRSCountry").value;
	cond.id = getId("selRSCountry").value;
	addCondition(cond);
}


function makeState(ev)
{
	var cond = {};
	cond.type = "State";
	switch (getId("selRSAltState").value) {
		case "0":
			cond.type = "State";
			break;
		case "1":
			cond.type = "AState";
			break;
		default:
			cond.type = "XState";
			break;
	}
	cond.op = getId("opRSState").value;
	cond.txt = getId("inRSState").value;
	addCondition(cond);
}


function makeCity(ev)
{
	var cond = {};
	switch (getId("selRSAltCity").value) {
		case "0":
			cond.type = "City";
			break;
		case "1":
			cond.type = "ACity";
			break;
		default:
			cond.type = "XCity";
			break;
	}
	cond.op = getId("opRSCity").value;
	cond.txt = getId("inRSCity").value;
	addCondition(cond);
}


function makeStreet(ev)
{
	var cond = {};
	switch (getId("selRSAlttStreet").value) {
		case "0":
			cond.type = "Street";
			break;
		case "1":
			cond.type = "AStreet";
			break;
		default:
			cond.type = "XStreet";
			break;
	}
	cond.op = getId("opRSStreet").value;
	cond.txt = getId("inRSStreet").value;
	addCondition(cond);
}


function makeNoName(ev)
{
	var cond = {};
	if (getId("cbRSAltNoName").checked) {
		cond.type = "ANoName";
	} else {
		cond.type = "NoName";
	}
	cond.op = getId("cbRSNoName").checked;
	addCondition(cond);
}


function makeRoadType(ev)
{
	var cond = {};
	cond.type = "RoadType";
	cond.op = getId("opRSRoadType").value;
	cond.id = getId("selRSRoadType").value;
	addCondition(cond);
}


function makeIsRound(ev)
{
	var cond = {};
	cond.type = "IsRound";
	cond.op = getId("cbRSIsRound").checked;
	addCondition(cond);
}


function makeIsToll(ev)
{
	var cond = {};
	cond.type = "IsToll";
	cond.op = getId("cbRSIsToll").checked;
	addCondition(cond);
}


function makeDirection(ev)
{
	var cond = {};
	cond.type = "Direction";
	cond.op = getId("opRSDirection").value;
	cond.id = getId("selRSDirection").value;
	addCondition(cond);
}


function makeElevation(ev)
{
	var cond = {};
	cond.type = "Elevation";
	cond.op = getId("opRSElevation").value;
	cond.id = getId("selRSElevation").value;
	addCondition(cond);
}


function makeTunnel(ev)
{
	var cond = {};
	cond.type = "Tunnel";
	cond.op = getId("cbRSTunnel").checked;
	addCondition(cond);
}


function makeUnpaved(ev)
{
	var cond = {};
	cond.type = "Unpaved";
	cond.op = getId("cbRSUnpaved").checked;
	addCondition(cond);
}


function makeHOV(ev)
{
	var cond = {};
	cond.type = "HOV";
	cond.op = getId("cbRSHOV").checked;
	addCondition(cond);
}


function makeHeadlights(ev)
{
	var cond = {};
	cond.type = "Headlights";
	cond.op = getId("cbRSHeadlights").checked;
	addCondition(cond);
}


function makeManLock(ev)
{
	var cond = {};
	cond.type = "ManLock";
	cond.op = getId("opRSManLock").value;
	cond.id = getId("selRSManLock").value;
	addCondition(cond);
}


function makeTrLock(ev)
{
	var cond = {};
	cond.type = "TrLock";
	cond.op = getId("opRSTrLock").value;
	cond.id = getId("selRSTrLock").value;
	addCondition(cond);
}


function makeSpeed(ev)
{
	var cond = {};
	cond.type = "Speed";
	cond.op = parseInt(getId("opRSSpeed").value, 10) + 10 * parseInt(getId("opRSSpeedComp").value, 10);
	var val = getId("inRSSpeed").value;
	if (isNaN(val) || val === '') {
		cond.txt = '';
	} else {
		val = parseInt(val, 10);
		if (speedInMiles) {
			val = miles2km(val);
		}
		cond.txt = val;
	}
	addCondition(cond);
}


function makeSpdC(ev)
{
	var cond = {};
	cond.type = "SpdC";
	cond.op = getId("opRSSpdC").value;
	addCondition(cond);
}


function makeIsNew(ev)
{
	var cond = {};
	cond.type = "IsNew";
	cond.op = getId("cbRSIsNew").checked;
	addCondition(cond);
}


function makeIsChngd(ev)
{
	var cond = {};
	cond.type = "IsChngd";
	cond.op = getId("cbRSIsChngd").checked;
	addCondition(cond);
}


function makeOnScr(ev)
{
	var cond = {};
	cond.type = "OnScr";
	cond.op = getId("cbRSOnScr").checked;
	addCondition(cond);
}


function makeRestr(ev)
{
	var cond = {};
	cond.type = "Restr";
	cond.op = getId("cbRSRestr").checked;
	addCondition(cond);
}

function makeHNs(ev)
{
	var cond = {};
	cond.type = "HNs";
	cond.op = getId("cbRSHNs").checked;
	addCondition(cond);
}

function makeRestr2(ev)
{
	var cond = {};
	cond.type = "Restr2";
	var opType = parseInt(getId("opRSResType").value, 10)
	cond.op = parseInt(getId("opRSResDir").value, 10) + parseInt(getId("opRSResLane").value, 10) * 10 + parseInt(getId("opRSResCar").value, 10) * 100 + opType * 1000;
	if ((opType === 1 || opType === 2)) {
		cond.op += parseInt(getId("opRSNumPass").value, 10) * 10000;
		if (hasSubcriptions) {
			if (getId("opRSRestrSubscr").value !== '-') {
				cond.op += 1000000;
				cond.subscr = getId("opRSRestrSubscr").value;
			}
		}
	}
	if (opType === 1 || opType === 2 || opType === 4) {
		cond.op += parseInt(getId("opRSRestrOp").value, 10) * 100000;
		var selectedValues = [];
		$("#opRSCarType :selected").each(function(){
			selectedValues.push(parseInt($(this).val(), 10));
		});
		cond.sel = selectedValues;
	}
	if (getId("cbRSRestrDays").checked) {
		cond.op += 10000000;
	}
	if (getId("cbRSRestrHours").checked) {
		cond.op += 100000000;
	}
	if (getId("cbRSRestrRange").checked) {
		cond.op += 1000000000;
	}
	addCondition(cond);
}


function makeClsr(ev)
{
	var cond = {};
	cond.type = "Clsr";
	if (parseInt(getId("opRSClsrStrtEnd").value, 10) === 0) {
		cond.op = getId("cbRSClsr").checked;
	} else {
		cond.op = (parseInt(getId("opRSClsrStrtEnd").value, 10) - 1) * 6 + parseInt(getId("opRSClsrBeforeAter").value, 10) * 2 + (getId("cbRSClsr").checked?0:1);
	}
	cond.txt = getId("inRSClsrDays").value;
	addCondition(cond);
}


function makeClReas(ev)
{
	var cond = {};
	cond.type = "ClReas";
	cond.op = getId("opRSClReas").value;
	cond.txt = getId("inRSClReas").value;
	addCondition(cond);
}


function makeClEvent(ev)
{
	var cond = {};
	cond.type = "ClEvent";
	cond.op = getId("opRSClEvent").value;
	cond.txt = getId("inRSClEvent").value;
	addCondition(cond);
}


function makeClWho(ev)
{
	var cond = {};
	cond.type = "ClWho";
	cond.op = parseInt(getId("opRSClWho").value, 10) + 10 * parseInt(getId("opRSClWhoType").value, 10);
	cond.txt = getId("inRSClWho").value;
	addCondition(cond);
}


function makeUpdtd(ev)
{
	var cond = {};
	cond.type = "Updtd";
	cond.op = getId("opRSUpdtd").value;
	cond.txt = getId("inRSUpdtd").value;
	addCondition(cond);
}


function makeUpLev(ev)
{
	var cond = {};
	cond.type = "UpLev";
	cond.op = getId("opRSUpLev").value;
	cond.id = getId("selRSUpLev").value;
	addCondition(cond);
}


function makeCrtd(ev)
{
	var cond = {};
	cond.type = "Crtd";
	cond.op = getId("opRSCrtd").value;
	cond.txt = getId("inRSCrtd").value;
	addCondition(cond);
}


function makeCrLev(ev)
{
	var cond = {};
	cond.type = "CrLev";
	cond.op = getId("opRSCrLev").value;
	cond.id = getId("selRSCrLev").value;
	addCondition(cond);
}


function makeLastU(ev)
{
	var cond = {};
	cond.type = "LastU";
	cond.op = getId("opRSLastU").value;
	cond.txt = getId("inRSLastU").value;
	if (isNaN(parseInt(cond.txt, 10))) {
		cond.txt = '1';
	}
	addCondition(cond);
}


function makeLength(ev)
{
	var cond = {};
	cond.type = "Length";
	cond.op = getId("opRSLength").value;
	var val = parseFloat(getId("inRSLength").value);
	if (isNaN(val)) {
		cond.txt = 0;
	} else {
		if (speedInMiles) {
			if (getId("unitRSLength").value === '0') {
				val *= 0.3048;
			} else {
				val *= 1609.344;
			}
		} else if (getId("unitRSLength").value === '1') {
			val *= 1000;
		}
		cond.txt = Math.round(val);
	}
	addCondition(cond);
}


function makeRoutePrf(ev)
{
	var cond = {};
	cond.type = "RoutePrf";
	cond.op = getId("opRSRoutePrf").value;
	addCondition(cond);
}


function makeRouteRoadType(ev)
{
	var cond = {};
	cond.type = "RouteRoadType";
	cond.op = getId("opRSRouteRoadType").value;
	cond.id = getId("selRSRouteRoadType").value;
	addCondition(cond);
}


function makeSegId(ev)
{
	var cond = {};
	cond.type = "SegId";
	cond.op = getId("opRSSegId").value;
	cond.txt = getId("inRSSegId").value;
	addCondition(cond);
}


function makePlaceId(ev)
{
	var cond = {};
	cond.type = "PlaceId";
	cond.op = getId("opRSPlaceId").value;
	cond.txt = getId("inRSPlaceId").value;
	addCondition(cond);
}


function makeCommentId(ev)
{
	var cond = {};
	cond.type = "CommentId";
	cond.op = getId("opRSCommentId").value;
	cond.txt = getId("inRSCommentId").value;
	addCondition(cond);
}


function makeEdtbl(ev)
{
	var cond = {};
	cond.type = "Edtbl";
	cond.op = getId("cbRSEdtbl").checked;
	addCondition(cond);
}


function makeInbj(ev)
{
	var cond = {};
	cond.type = "Inbj";
	cond.op = getId("cbRSInbj").checked;
	addCondition(cond);
}


function makeUTurn(ev)
{
	var cond = {};
	cond.type = "UTurn";
	cond.op = getId("cbRSUTurn").checked;
	addCondition(cond);
}

function makeLWidth(ev)
{
	var cond = {};
	cond.type = "LWidth";
	cond.op = parseInt(getId("opRSLWidth").value, 10) + 10 * parseInt(getId("opRSLWidthComp").value, 10);
	var val = parseFloat(getId("inRSLWidth").value);
	if (isNaN(val)) {
		cond.txt = 0;
	} else {
		if (speedInMiles) {
			val *= 0.3048;
		}
		cond.txt = val;
	}
	addCondition(cond);
}


function makeNrLanesW(ev)
{
	var cond = {};
	cond.type = "NrLanesW";
	cond.op = parseInt(getId("opRSNrLanesW").value, 10) + 10 * parseInt(getId("opRSNrLanesWComp").value, 10);
	var val = parseFloat(getId("inRSNrLanesW").value);
	if (isNaN(val)) {
		cond.txt = 0;
	} else {
		cond.txt = Math.round(val);
	}
	addCondition(cond);
}


function makeNrLanesG(ev)
{
	var cond = {};
	cond.type = "NrLanesG";
	cond.op = parseInt(getId("opRSNrLanesG").value, 10) + 10 * parseInt(getId("opRSNrLanesGComp").value, 10);
	var val = parseFloat(getId("inRSNrLanesG").value);
	if (isNaN(val)) {
		cond.txt = 0;
	} else {
		cond.txt = Math.round(val);
	}
	addCondition(cond);
}


function makeBool(ev)
{
	var cond = {};
	cond.type = "Bool";
	cond.op = getId("opRSBool").value;
	addCondition(cond);
}


function makeAnd(ev)
{
	var op = {};
	op.type = "And";
	if (ExprTree.type === "Or") {
		if (typeof (ExprTree.R) !== 'undefined') {
			op.L = ExprTree.R;
		}
		ExprTree.R = op;
	} else {
		op.L = ExprTree;
		ExprTree = op;
	}
	ExprStatus = 0;
	displayStatus ();
}


function makeOr(ev)
{
	var op = {};
	op.type = "Or";
	op.L = ExprTree;
	ExprTree = op;
	ExprStatus = 0;
	displayStatus ();
}


function makeNot(ev)
{
	var op = {};
	op.type = "Not";
	if (typeof (ExprTree.type) === 'undefined') {
		ExprTree = op;
	} else {
		if (typeof (ExprTree.R) === 'undefined') {
			ExprTree.R = op;
		} else {
			ExprTree.R.R = op;
		}
	}
	ExprStatus = 2;
	displayStatus ();
}


function makeLBkt(ev)
{
	if (ExprStatus === 1) {
		makeAnd();
	}
	BktTrees[BktCount] = ExprTree;
	var cond = {};
	cond.type = "Bkt";
	BktOps[BktCount] = cond;
	ExprTree = new Object;
	BktCount ++;
	ExprStatus = 0;
	displayStatus ();
}


function makeConnect(ev)
{
	if (ExprStatus === 1) {
		makeAnd();
	}
	BktTrees[BktCount] = ExprTree;
	var cond = {};
	cond.type = "Connect";
	cond.op = getId("opRSConnect").value;
	BktOps[BktCount] = cond;
	ExprTree = new Object;
	BktCount ++;
	ExprStatus = 0;
	displayStatus ();
}


function makeRBkt(ev)
{
	BktCount --;
	var cond = BktOps[BktCount];
	cond.L = ExprTree;
	ExprTree = BktTrees[BktCount];
	ExprStatus = 0;
	addCondition(cond);
}


function selectRoads()
{
	getId("btnRSSelect").disabled = true;
	setTimeout(selectRoads2, 100);
}


function selectRoads2()
{
	var foundSegs = [];
	var selected = 0;
	var max_sel_txt = getId("inRSLimit").value;
	var max_sel = parseInt(max_sel_txt, 10);


	var eg = uWaze.map.getExtent().toGeometry();

	for (var seg in uWaze.model.segments.objects) {
		var segment = uWaze.model.segments.getObjectById(seg);
		if ((segment.arePropertiesEditable() || !getId("cbRSEditable").checked) && (eg.intersects(segment.getOLGeometry()) || !getId("cbRSOnScreen").checked)) {
			if (checkExpr(ExprTree, segment)) {
				foundSegs.push(segment);
				selected++;
				if ((getId("cbRSLimit").checked) && (selected === max_sel)) {
					break;
				}
			}
		}
	}
	uWaze.selectionManager.setSelectedModels(foundSegs);

	getId("btnRSSelect").disabled = false;
}


function clearExpr(ev)
{
	ExprStatus = 0;
	ExprTree = {};
	BktCount = 0;
	displayStatus ();
}

function delLast(ev)
{
	if (typeof (ExprTree.type) === 'undefined') {
		if (BktCount > 0) {
			BktCount--;
			ExprTree = BktTrees[BktCount];
			if (ExprTree.type === "Not") {
				ExprStatus = 2;
			} else {
				ExprStatus = 0;
			}
		}
	} else {
		switch (ExprTree.type) {
			case "And":
				if (typeof (ExprTree.R) === 'undefined') {
					ExprTree = ExprTree.L;
					ExprStatus = 1;
				} else {
					if (ExprTree.R.type === "Bkt") {
						BktTrees[BktCount] = ExprTree;
						ExprTree = ExprTree.R.L;
						delete BktTrees[BktCount].R;
						BktCount ++;
						ExprStatus = 1;
					} else if (ExprTree.R.type === "Not") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							delete ExprTree.R;
							ExprStatus = 0;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 2;
						}
					} else {
						delete ExprTree.R;
						ExprStatus = 0;
					}
				}
				break;
			case "Or":
				if (typeof (ExprTree.R) === 'undefined') {
					ExprTree = ExprTree.L;
					ExprStatus = 1;
				} else {
					if (ExprTree.R.type === "Bkt") {
						BktTrees[BktCount] = ExprTree;
						ExprTree = ExprTree.R.L;
						delete BktTrees[BktCount].R;
						BktCount ++;
						ExprStatus = 1;
					} else if (ExprTree.R.type === "Not") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							delete ExprTree.R;
							ExprStatus = 0;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 2;
						}
					} else if (ExprTree.R.type === "And") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							ExprTree.R = ExprTree.R.L;
							ExprStatus = 1;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 0;
						}
					} else {
						delete ExprTree.R;
						ExprStatus = 0;
					}
				}
				break;
			case "Bkt":
			case "Connect":
				BktTrees[BktCount] = {};
				ExprTree = ExprTree.L;
				BktCount ++;
				ExprStatus = 1;
				break;
			default:
				ExprTree = {};
				ExprStatus = 0;
				break;
		}
	}
	displayStatus ();
}


var icon_delete ="iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggaDwcglEfa9wAAAftJREFUOMvNks1qFEEUhb+q7uqedNMdTJwJdjBRdBYG/4MEsgiGBAIuBBF8D8GXcO/LuHAjQkQJoglOFiN0YH4MKBomM3a6a6rcTOvEyQNYUHA5de5368CF/+Z0CABoU6m3qdRL7a/u19v49XEvgBiHdJ0okUo1AExRXLsw7HUAuipOpF9p4EjMcf+PDiDLooVXla67X1tdiWqrK5FwZKOFWmghF6TyGrUnj6PaveVIuu5+C686ARDIEPDRQ0x/IKp3bsfKD7dVOLtdfbAVm88NQZ4D+CPvZISOCNek6748f+tGBUAIgaxfZdhsgrF8+7ibGa23Ett/PQHoEJAwoE1l2VH+q9mb16etMWAtwnH4/mnvaFicbMyT7ZTeUxESBnQImCfbkWHYtkWBLQqs1litAdr/Np8ClA+HYbU7u762NMwyjLVYaxme5Exfubz01Y275aCJCCl4U9HcQe3Rw7nB23cCY+ilBz8sEF9aPAcglbJHzeZhURwvXsTkp36g8BLhyJlf73cQ1tpemmZG5xtW5xu9NM2EENZqDZYZiZ+cuY2pCO533TjrunG2J4LN0QC5K4LNUv8igvXxnjKCkDBlIHqBt55h1TOKD4A38uTPUXc9hH5K/kbAwMJPoBBjIAVEgA+4o+YyogX02O0DA0CLM5KIs5ZsBJmofwPkNtFJWyXQAQAAAABJRU5ErkJggg==";

function loadCss() {
	var cssEl = document.createElement("style");
	cssEl.type = "text/css";
	var css = ".divRSRow, .divRSRow0 { clear: both; line-height: 25px; height: 25px; padding: 0 5px; border: 1px solid #CCC; }";
	css += ".divRSRow a, .divRSRow0 a { display: block; width: 95%; }";
	css += ".divRSRow { border-top: none; }";
	css += ".divRSName { float: left; text-align: left; padding-left: 0; width: 250px; font-weight: 600; }";
	css += ".divRSDel { float: right; width: 20px; }";
	css += "#RSconditions .table { margin: 0; padding: 0; font-size: 11px; font-weight: 600; }";
	css += "#RSconditions .table-condensed>tbody>tr>td {padding: 2px 0;}";
	css += "input[type=checkbox] { margin-top: -.2em; margin-right: .3em; padding: 0; vertical-align:middle; }";
	css += "#RSselection, #roadselector-tabs-editor, #RSoperations, #RSconditions, #RSsavedHdr { margin: 8px 0; padding: 0; }";
	css += "#RSconditions input[type=text], #RSconditions input[type=number], #RSselection input[type=text], #RSselection input[type=number] { margin: 0 2px; padding: 0; height: 20px; border: 1px solid #CCC; font-weight: 700; }";
	css += "#RSconditions input[type=number], #RSselection input[type=number] { text-align: right; }";
	css += "#RSconditions label, #RSselection label { margin-right: 6px; font-size: 11px; font-weight: 600; }";
	css += "#RSselection>button { margin: 10px 2px 0; padding: 0 15px; }";
	css += "#RSoperations button { margin: 0 2px; padding: 0 10px; height: 20px; }";
	css += "#RSconditions button, #RSconditions select:not([multiple]) { padding: 0 8px; height: 20px; }";
	css += "#RSconditions select { margin: 0 2px; padding: 0; }";
	css += "#roadselector-tabs li { width: 50%; text-align: center; height: 30px; }";
	css += "#roadselector-tabs a { height: 30px; }";
	cssEl.innerHTML = css;
	document.body.appendChild(cssEl);
}

function genSavedHTML ()
{
	getId('RSsavedTable').innerHTML="";
	for (var i = 0; i < SavedQueries.length; i++) {
		var savedRow = document.createElement('div');
		if (i == 0) {
			savedRow.className="divRSRow0";
		} else {
			savedRow.className="divRSRow";
		}
		savedRow.id="RSsavedRow_"+i;

		var namediv = document.createElement('div');
		namediv.className="divRSName";

		var namea = document.createElement('a');
		namea.innerHTML=SavedQueries[i].name;
		namea.href = "#";
		namea.onclick = getFunctionWithArgs(selectRow, [i]);
		namediv.appendChild(namea);
		savedRow.appendChild(namediv);

		var deletediv = document.createElement('div');
		deletediv.className="divRSDel";
		var deletea = document.createElement('a');
		deletea.innerHTML="<img title='Delete' src='data:image/png;base64," +icon_delete +"'>";
		deletea.href = "#";
		deletea.onclick = getFunctionWithArgs(deleteRow, [i]);
		deletediv.appendChild(deletea);
		savedRow.appendChild(deletediv);

		getId('RSsavedTable').appendChild(savedRow);
	}
}

var SavedQueries = [];

function makeSave(ev)
{
	var name = getId("inRSSaveName").value.substring(0,40);
	var query = {
		name: name,
		ExprStatus: ExprStatus,
		ExprTree: clone(ExprTree),
		BktTrees: clone(BktTrees),
		BktOps: clone(BktOps),
		BktCount: BktCount
	};
	var done = false;
	for (var i = 0; i < SavedQueries.length; i++) {
		if (SavedQueries[i].name === name) {
			SavedQueries[i] = query;
			done = true;
			break;
		}
		if (SavedQueries[i].name > name) {
			SavedQueries.splice(i, 0, query);
			done = true;
			break;
		}
	}
	if (!done) {
		SavedQueries.push(query);
	}
	localStorage.WMERoadSelector = JSON.stringify(SavedQueries);
	genSavedHTML();
}


function saveOptions(ev)
{
	var options = {};
	options.cbRSEditable = getId("cbRSEditable").checked;
	options.cbRSCaseSens = getId("cbRSCaseSens").checked;
	options.cbRSOnScreen = getId("cbRSOnScreen").checked;
	options.cbRSLimit = getId("cbRSLimit").checked;
	options.inRSLimit = getId("inRSLimit").value;
	localStorage.WMERoadSelectorOptions = JSON.stringify(options);

}


function selectRow(id)
{
	ExprStatus = SavedQueries[id].ExprStatus;
	ExprTree = clone(SavedQueries[id].ExprTree);
	BktTrees = clone(SavedQueries[id].BktTrees);
	BktCount = SavedQueries[id].BktCount;
	if (typeof(SavedQueries[id].BktOps) !== "undefined") {
		BktOps = clone(SavedQueries[id].BktOps);
	} else {
		BktOps = {};
		for (var i = 0; i < BktCount; i++) {
			var cond = {};
			cond.type = "Bkt";
			BktOps[i] = cond;
		}
	}
	getId("inRSSaveName").value = SavedQueries[id].name;
	displayStatus ();
}


function deleteRow(id)
{
	SavedQueries.splice(id, 1);
	localStorage.WMERoadSelector = JSON.stringify(SavedQueries);
	genSavedHTML();
}


function getElementsByClassName(classname, node)
{
	if(!node) {
		node = document.getElementsByTagName("body")[0];
	}
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++) {
		if (re.test(els[i].className)) {
			a.push(els[i]);
		}
	}
	return a;
}


function getFunctionWithArgs(func, args) {
	return (
		function () {
			var json_args = JSON.stringify(args);
			return function() {
				var args = JSON.parse(json_args);
				func.apply(this, args);
			};
		}
	)();
}


function getId(node)
{
	return document.getElementById(node);
}


function clone(obj) {
	var copy;
	if (null == obj || "object" != typeof obj) return obj;
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}


async function roadSelector_init()
{
	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OpenLayers;

	hasStates = uWaze.model.hasStates();
	speedInMiles = uWaze.model.isImperial;
	getSubscriptions();

	if (localStorage.WMERoadSelector) {
		SavedQueries = JSON.parse(localStorage.WMERoadSelector);
	}
	loadCss();

	var addon = document.createElement('section');

	var lang = unsafeWindow.I18n.locale;
	if (lang === 'cs' || lang === 'sk') {
		addon.innerHTML = '<b><u><a href="https://www.waze.com/forum/viewtopic.php?f=22&t=101365" target="_blank">WME Road Selector</a></u></b> &nbsp; v' + GM_info.script.version;
	} else {
		addon.innerHTML = '<b><u><a href="https://www.waze.com/forum/viewtopic.php?f=819&t=112497" target="_blank">WME Road Selector</a></u></b> &nbsp; v' + GM_info.script.version;
	}

	var section = document.createElement('section');
	section.style.fontSize = "11px";
	section.style.width = "95%";
	section.id = "RSselection";
	section.style.marginBottom = "15px";
	section.innerHTML = '<font style="float:right;"></font><h3>Selection</h3>'
		+ '<output id="outRSExpr" class="well well-sm"></output>'
		+ '<label><input type="checkbox" id="cbRSEditable" checked>Editable only</label>'
		+ '<label><input type="checkbox" id="cbRSCaseSens" checked>Case sensitive</label>'
		+ '<label><input type="checkbox" id="cbRSOnScreen">On screen</label><br>'
		+ '<label><input type="checkbox" id="cbRSLimit">Limit # of segs</label>'
		+ '<input type="number" min="1" max="999" value="100" id="inRSLimit" style="width: 40px; display: inline-block"><br>'
		+ '<button class="btn btn-success" id="btnRSSelect">Select roads</button>'
		+ '<button class="btn btn-primary" id="btnRSClear">Clear</button>'
		+ '<button class="btn btn-danger" id="btnRSDel">Delete last</button>'
	;
	addon.appendChild(section);

	var tabs = document.createElement("ul");
	addon.appendChild(tabs);
	tabs.id = "roadselector-tabs";
	tabs.style.width = "92%";
	tabs.className = "nav nav-tabs";
	tabs.innerHTML = '<li class="active"><a href="#roadselector-tabs-editor" data-toggle="tab">Editor</a></li>';
	tabs.innerHTML += '<li class=""><a href="#roadselector-tabs-saved" data-toggle="tab">Saved</a></li>';
	var tabcont = document.createElement("div");
	tabcont.className = "tab-content";
	tabcont.id = "roadselector-tab-content";
	tabcont.style.padding = "0";
	tabcont.style.margin = "0";
	addon.appendChild(tabcont);
	var tabpane = document.createElement("section");
	tabpane.className = "tab-pane active";
	tabpane.id = "roadselector-tabs-editor";
	tabcont.appendChild(tabpane);

	section = document.createElement('section');
	section.style.fontSize = "11px";
	section.id = "RSoperations";
	section.innerHTML = '<h3>Operations</h3>'
		+ '<button class="btn btn-warning" id="btnRSAnd">AND</button>'
		+ '<button class="btn btn-warning" id="btnRSOr">OR</button>'
		+ '<button class="btn btn-pastrama" id="btnRSNot" style="padding: 0 20px;">!</button>'
		+ '<button class="btn btn-primary" id="btnRSLBkt" style="padding-left: 20px;">(</button>'
		+ '<output id="outRSNumBkt" style="padding: 0; height: 20px; display: inline-block;">0</output>'
		+ '<button class="btn btn-primary" id="btnRSRBkt" style="padding-right: 20px">)</button>'
	;
	tabpane.appendChild(section);

	section = document.createElement('section');
	section.style.fontSize = "10px";
	section.style.width = "92%";
	section.id = "RSconditions";
	var str = '<h3>Conditions</h3>'
	+ '<table class="table table-condensed table-striped table-hover">'
	+ '<tr><td><label for="selRSCountry">Country</label><select id="opRSCountry"></select>'
	+ '<select id="selRSCountry"></select></td>'
	+ '<td><button class="btn btn-default" id="btnRSAddCountry">+</button></td></tr>';
	if (hasStates) {
		str += '<tr><td><label>State<select id="opRSState"></select></label>'
			+ '<input  type="text" id="inRSState" onclick="this.focus();this.select()" size="10">'
			+ '<select id="selRSAltState"><option value="0">prim.</option><option value="1">alt.</option><option value="2">any</option></select></td>'
			+ '<td><button class="btn btn-default" id="btnRSAddState">+</button></td></tr>';
	}
	str += '<tr><td><label for="inRSCity">City</label><select id="opRSCity"></select>'
		+ '<input  type="text" id="inRSCity" onclick="this.focus();this.select()" size="10">'
		+ '<select id="selRSAltCity"><option value="0">prim.</option><option value="1">alt.</option><option value="2">any</option></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddCity">+</button></td></tr>'
		+ '<tr><td><label for="inRSStreet">Street</label><select id="opRSStreet"></select>'
		+ '<input type="text" id="inRSStreet" onclick="this.focus();this.select()" size="9">'
		+ '<select id="selRSAlttStreet"><option value="0">prim.</option><option value="1">alt.</option><option value="2">any</option></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddStreet">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSNoName" checked>Unnamed segment</label> <label><input type="checkbox" id="cbRSAltNoName">alt.</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddNoName">+</button></td></tr>'
		+ '<tr><td><label for="selRSRoadType">Road type</label><select id="opRSRoadType"></select>'
		+ '<select id="selRSRoadType" style="width:50%"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddRoadType">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSIsRound" checked>Roundabout</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddIsRound">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSIsToll" checked>Toll Road</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddIsToll">+</button></td></tr>'
		+ '<tr><td><label for="selRSDirection">Direction</label><select id="opRSDirection"></select>'
		+ '<select id="selRSDirection"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddDirection">+</button>'
		+ '<tr><td><label for="selRSElevation">Elevation</label><select id="opRSElevation"></select>'
		+ '<select id="selRSElevation"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddElevation">+</button>'
		+ '<tr><td><label><input type="checkbox" id="cbRSTunnel" checked>Tunnel</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddTunnel">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSUnpaved" checked>Unpaved</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddUnpaved">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSHOV" checked>Next to carpool/HOV/bus lane</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddHOV">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSHeadlights" checked>Headlights required</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddHeadlights">+</button></td></tr>'
		+ '<tr><td><label for="selRSManLock">Manual Lock</label><select id="opRSManLock"></select>'
		+ '<select id="selRSManLock"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddManLock">+</button>'
		+ '<tr><td><label for="selRSTrLock">Traffic Lock</label><select id="opRSTrLock"></select>'
		+ '<select id="selRSTrLock"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddTrLock">+</button></td></tr>'
		+ '<tr><td><label for="inRSSpeed">Spd. limit in</label><select id="opRSSpeed"></select>direction<br>'
		+ '<select id="opRSSpeedComp"></select>'
		+ '<input  type="text" id="inRSSpeed" onclick="this.focus();this.select()" size="6"> ' + (speedInMiles?'mph':'km/h') +'</td>'
		+ '<td><button class="btn btn-default" id="btnRSAddSpeed">+</button></td></tr>'
		+ '<tr><td><label for="opRSSpdC">Avg. speed cam</label><select id="opRSSpdC"></select>dir.'
		+ '<td><button class="btn btn-default" id="btnRSAddSpdC">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSIsNew" checked>New</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddIsNew">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSIsChngd" checked>Changed</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddIsChngd">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSOnScr" checked>On Screen</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddOnScr">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSRestr" checked>Has restriction</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddRestr"">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSHNs" checked>Has house numbers</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddHNs"">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSClsr" checked>Has closure</label>'
		+ '<select id="opRSClsrStrtEnd"><option value="0">---</option><option value="1">starts</option><option value="2">ends</option></select><br>'
		+ '<select id="opRSClsrBeforeAter"><option value="0">before</option><option value="1">after</option><option value="2">in</option></select>'
		+ '<input type="number" min="-365" max="365" value="1" id="inRSClsrDays" style="width:40px;">days</td>'
		+ '<td><button class="btn btn-default" id="btnRSAddClsr"">+</button></td></tr>'
		+ '<tr><td><label for="inRSClReas">Closure reason</label><select id="opRSClReas"></select>'
		+ '<input type="text" id="inRSClReas" onclick="this.focus();this.select()" size="9"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddClReas">+</button></td></tr>'
		+ '<tr><td><label for="inRSClEvent">Closure event</label><select id="opRSClEvent"></select>'
		+ '<input type="text" id="inRSClEvent" onclick="this.focus();this.select()" size="9"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddClEvent">+</button></td></tr>'
		+ '<tr><td><label for="inRSClWho">Closure</label><select id="opRSClWhoType"><option value="0">crtd by</option><option value="1">upd. by</option></select>'
		+ '<select id="opRSClWho"></select>'
		+ '<input type="text" id="inRSClWho" onclick="this.focus();this.select()" size="4"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddClWho">+</button></td></tr>'
		+ '<tr><td><label for="inRSUpdtd">Updated by</label><select id="opRSUpdtd"></select>'
		+ '<input  type="text" id="inRSUpdtd" onclick="this.focus();this.select()" size="8"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddUpdtd">+</button></td></tr>'
		+ '<tr><td><label for="inRSUpLev">Updated by level</label><select id="opRSUpLev"></select>'
		+ '<select id="selRSUpLev"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddUpLev">+</button></td></tr>'
		+ '<tr><td><label for="inRSCrtd">Created by</label><select id="opRSCrtd"></select>'
		+ '<input  type="text" id="inRSCrtd" onclick="this.focus();this.select()" size="8"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddCrtd">+</button></td></tr>'
		+ '<tr><td><label for="inRSCrLev">Created by level</label><select id="opRSCrLev"></select>'
		+ '<select id="selRSCrLev"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddCrLev">+</button></td></tr>'
		+ '<tr><td><label for="inRSLastU">Last update</label><select id="opRSLastU"></select>'
		+ '<input  type="number" min="0" max="365" value="1" id="inRSLastU" size="3" style="width:40px;">days ago</td>'
		+ '<td><button class="btn btn-default" id="btnRSAddLastU">+</button></td></tr>'
		+ '<tr><td><label for="inRSLength">Length</label><select id="opRSLength"></select>'
		+ '<input  type="text" id="inRSLength" onclick="this.focus();this.select()" size="10">'
		+ '<select id="unitRSLength"><option value="0">' + (speedInMiles?'feet':'m') + '</option><option value="1">' + (speedInMiles?'miles':'km') + '</option></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddLength">+</button></td></tr>'
		+ '<tr><td><label for="opRSRoutePrf">Routing preference</label><select id="opRSRoutePrf"><option value="0">Unfavored</option><option selected="true" value="1">Neutral</option><option value="2">Preferred</option></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddRoutePrf">+</button></td></tr>'
		+ '<tr><td><label for="selRSRouteRoadType">Routing type</label><select id="opRSRouteRoadType"></select>'
		+ '<select id="selRSRouteRoadType" style="width:45%"></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddRouteRoadType">+</button></td></tr>'
		+ '<tr><td><select id="opRSConnect"><option value="0">Connected</option><option value="1">Allowed</option></select><label for="opRSConnect">to (&hellip;)</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddConnect">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSUTurn" checked>Has U-Turn</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddUTurn">+</button></td></tr>'
		+ '<tr><td><label for="inRSSegId">ID</label><select id="opRSSegId"></select>'
		+ '<input type="text" id="inRSSegId" onclick="this.focus();this.select()" style="width:80px;"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddSegId">+</button></td></tr>'
		+ '<tr><td><select id="opRSPlaceId"><option value="0">fully</option><option value="1">partially</option></select><label for="inRSPlaceId">inside Place ID</label>'
		+ '<input type="text" id="inRSPlaceId" onclick="this.focus();this.select()" style="width:80px;"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddPlaceId">+</button></td></tr>'
		+ '<tr><td><select id="opRSCommentId"><option value="0">fully</option><option value="1">partially</option></select><label for="inRSCommentId">inside Comment ID</label>'
		+ '<input type="text" id="inRSCommentId" onclick="this.focus();this.select()" style="width:70px;"></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddCommentId">+</button></td></tr>'
		+ '<tr><td><select id="opRSBool"><option value="0">True</option><option value="1">False</option></select></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddBool">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSEdtbl" checked>Editable</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddEdtbl">+</button></td></tr>'
		+ '<tr><td><label><input type="checkbox" id="cbRSInbj" checked>In Junction Box</label></td>'
		+ '<td><button class="btn btn-default" id="btnRSAddInbj">+</button></td></tr>'
		+ '<tr><td><label for="inRSLWidth">Lane width in </label><select id="opRSLWidth"></select>direction<br>'
		+ '<select id="opRSLWidthComp"></select>'
		+ '<input  type="text" id="inRSLWidth" onclick="this.focus();this.select()" size="10">' + (speedInMiles?'feet':'m')
		+ '<td><button class="btn btn-default" id="btnRSAddLWidth">+</button></td></tr>'
		+ '<tr><td><label for="inRSNrLanesW">Nr. of lanes for width</label><br>in<select id="opRSNrLanesW"></select>direction <br>'
		+ '<select id="opRSNrLanesWComp"></select>'
		+ '<input  type="text" id="inRSNrLanesW" onclick="this.focus();this.select()" size="10">'
		+ '<td><button class="btn btn-default" id="btnRSAddNrLanesW">+</button></td></tr>'
		+ '<tr><td><label for="inRSNrLanesG">Nr. of lanes for guidance</label><br>in<select id="opRSNrLanesG"></select>direction <br>'
		+ '<select id="opRSNrLanesGComp"></select>'
		+ '<input  type="text" id="inRSNrLanesG" onclick="this.focus();this.select()" size="10">'
		+ '<td><button class="btn btn-default" id="btnRSAddNrLanesG">+</button></td></tr>'
		+ '<tr><td><label>Restriction</label><select id="opRSResDir"></select>'
		+'<select id="opRSResLane"></select>'
		+'<select id="opRSResCar"></select>'
		+'<select id="opRSResType"></select>'
		+'<select id="opRSRestrOp"></select>'
		+'<select multiple id="opRSCarType"></select>'
		+'<select id="opRSNumPass"><option value="0">---</option><option value="2">min. 2 passengers</option><option value="3">min. 3 passengers</option><option value="4">min. 4 passengers</option></select>';
	if (hasSubcriptions) {
		str += '<select id="opRSRestrSubscr"></select>';
	}
	str += '<label><input type="checkbox" id="cbRSRestrDays">Days</label>'
		+'<label><input type="checkbox" id="cbRSRestrHours">Hours</label>'
		+'<label><input type="checkbox" id="cbRSRestrRange">Date Range</label>';
	str += '</td>'
		+ '<td><button class="btn btn-default" id="btnRSAddRestr2"">+</button></td></tr>'
		+ '</table>';
	section.innerHTML = str;
	tabpane.appendChild(section);

	tabpane = document.createElement("section");
	tabpane.className = "tab-pane";
	tabpane.id = "roadselector-tabs-saved";
	tabcont.appendChild(tabpane);

	section = document.createElement('p');
	section.style.fontSize = "11px";
	section.style.width = "92%";
	section.id = "RSsavedHdr";
	section.innerHTML = '<div class="input-group">'
		+ '<input type="text" id="inRSSaveName" class="form-control" placeholder="Type name&hellip;" onclick="this.focus();this.select()">'
		+ '<span class="input-group-btn"><button class="btn btn-info"id="btnRSSave">Save</button></span>'
		+ '</div>';
	tabpane.appendChild(section);

	section = document.createElement('p');
	section.style.paddingTop = "8px";
	section.style.fontSize = "12px";
	section.id = "RSsaved";
	var savedTable = "<div id='RSsavedTable'></div>";
	section.innerHTML = savedTable;
	tabpane.appendChild(section);

	const { tabLabel, tabPane } = uWaze.userscripts.registerSidebarTab("roadselector");
	tabLabel.innerHTML = '<img src="' + GM_info.script.icon + '" width="16" height="16" style="margin-top: -2px;">';;
	tabLabel.title = 'Road Selector';
	tabLabel.id = "sidepanel-roadselector";
	tabPane.appendChild(addon);

	await uWaze.userscripts.waitForElementConnected(tabPane);

	genSavedHTML();

	populateOptions("opRSCountry", EqualOps);
	//populateCountries("selRSCountry");
	document.addEventListener("wme-map-data-loaded", populateCountries);
	if (hasStates) {
		populateOptions("opRSState", StringOps);
	}
	populateOptions("opRSCity", StringOps);
	populateOptions("opRSStreet", StringOps);
	populateOptions("opRSRoadType", EqualOps);
	populateRoadTypes("selRSRoadType");
	populateOptions("opRSDirection", EqualOps);
	populateOptions("selRSDirection", Directions);
	populateOptions("opRSElevation", IntegerOps);
	populateElevations("selRSElevation");
	populateOptions("opRSManLock", IntegerOps);
	populateLocks("selRSManLock");
	populateOptions("opRSTrLock", IntegerOps);
	populateLocks("selRSTrLock");
	populateDirOps("opRSSpeed", true);
	populateOptions("opRSSpeedComp", IntegerOps);
	populateDirOps("opRSSpdC", false);
	populateOptions("opRSClReas", StringOps);
	populateOptions("opRSClEvent", StringOps);
	populateOptions("opRSClWho", StringOps);
	populateOptions("opRSUpdtd", StringOps);
	populateOptions("opRSUpLev", IntegerOps);
	populateLocks("selRSUpLev");
	populateOptions("opRSCrtd", StringOps);
	populateOptions("opRSCrLev", IntegerOps);
	populateLocks("selRSCrLev");
	populateOptions("opRSLastU", IntegerOps);
	populateOptions("opRSSegId", EqualOps);
	populateOptions("opRSLength", IntegerOps);
	populateOptions("opRSRouteRoadType", EqualOps);
	populateRoadTypes("selRSRouteRoadType");
	populateDirOps("opRSLWidth", false);
	populateOptions("opRSLWidthComp", IntegerOps);
	populateDirOps("opRSNrLanesW", false);
	populateOptions("opRSNrLanesWComp", IntegerOps);
	populateDirOps("opRSNrLanesG", false);
	populateOptions("opRSNrLanesGComp", IntegerOps);
	populateOptions("opRSResDir", RestrDirs);
	populateOptions("opRSResLane", RestrLanes);
	populateOrderedOptions("opRSResCar", RestrCars, RestrCarsOrder);
	populateOptions("opRSResType", RestrTypes);
	populateOptions("opRSRestrOp", RestrSelOps);
	populateLocalizedOptions("opRSCarType", RestrCarTypes, I18n.translations[I18n.currentLocale()].restrictions.vehicle_types);
	if (hasSubcriptions) {
		populateObjectOptions('opRSRestrSubscr', Subscriptions);
	}

	var selId = getId("opRSLWidthComp");
	var usrOption = document.createElement('option');
	var usrText = document.createTextNode("is default");
	usrOption.setAttribute('value', 9);
	usrOption.appendChild(usrText);
	selId.appendChild(usrOption);

	displayStatus ();


	getId("btnRSAddCountry").onclick = makeCountry;
	if (hasStates) {
		getId("btnRSAddState").onclick = makeState;
	}
	getId("btnRSAddCity").onclick = makeCity;
	getId("btnRSAddStreet").onclick = makeStreet;
	getId("btnRSAddNoName").onclick = makeNoName;
	getId("btnRSAddRoadType").onclick = makeRoadType;
	getId("btnRSAddIsRound").onclick = makeIsRound;
	getId("btnRSAddIsToll").onclick = makeIsToll;
	getId("btnRSAddDirection").onclick = makeDirection;
	getId("btnRSAddElevation").onclick = makeElevation;
	getId("btnRSAddTunnel").onclick = makeTunnel;
	getId("btnRSAddUnpaved").onclick = makeUnpaved;
	getId("btnRSAddHOV").onclick = makeHOV;
	getId("btnRSAddHeadlights").onclick = makeHeadlights;
	getId("btnRSAddManLock").onclick = makeManLock;
	getId("btnRSAddTrLock").onclick = makeTrLock;
	getId("btnRSAddSpeed").onclick = makeSpeed;
	getId("btnRSAddSpdC").onclick = makeSpdC;
	getId("btnRSAddIsNew").onclick = makeIsNew;
	getId("btnRSAddIsChngd").onclick = makeIsChngd;
	getId("btnRSAddOnScr").onclick = makeOnScr;
	getId("btnRSAddRestr").onclick = makeRestr;
	getId("btnRSAddHNs").onclick = makeHNs;
	getId("btnRSAddClsr").onclick = makeClsr;
	getId("btnRSAddClReas").onclick = makeClReas;
	getId("btnRSAddClEvent").onclick = makeClEvent;
	getId("btnRSAddClWho").onclick = makeClWho;
	getId("btnRSAddUpdtd").onclick = makeUpdtd;
	getId("btnRSAddUpLev").onclick = makeUpLev;
	getId("btnRSAddCrtd").onclick = makeCrtd;
	getId("btnRSAddCrLev").onclick = makeCrLev;
	getId("btnRSAddLastU").onclick = makeLastU;
	getId("btnRSAddLength").onclick = makeLength;
	getId("btnRSAddRoutePrf").onclick = makeRoutePrf;
	getId("btnRSAddRouteRoadType").onclick = makeRouteRoadType;
	getId("btnRSAddConnect").onclick = makeConnect;
	getId("btnRSAddSegId").onclick = makeSegId;
	getId("btnRSAddPlaceId").onclick = makePlaceId;
	getId("btnRSAddCommentId").onclick = makeCommentId;
	getId("btnRSAddRestr2").onclick = makeRestr2;
	getId("btnRSAddEdtbl").onclick = makeEdtbl;
	getId("btnRSAddInbj").onclick = makeInbj;
	getId("btnRSAddUTurn").onclick = makeUTurn;
	getId("btnRSAddLWidth").onclick = makeLWidth;
	getId("btnRSAddNrLanesW").onclick = makeNrLanesW;
	getId("btnRSAddNrLanesG").onclick = makeNrLanesG;
	getId("btnRSAddBool").onclick = makeBool;
	getId("btnRSAnd").onclick = makeAnd;
	getId("btnRSOr").onclick = makeOr;
	getId("btnRSNot").onclick = makeNot;
	getId("btnRSLBkt").onclick = makeLBkt;
	getId("btnRSRBkt").onclick = makeRBkt;
	getId("btnRSSelect").onclick = selectRoads;
	getId("btnRSClear").onclick = clearExpr;
	getId("btnRSDel").onclick = delLast;
	getId("btnRSSave").onclick = makeSave;

	if (localStorage.WMERoadSelectorOptions) {
		var options = JSON.parse(localStorage.WMERoadSelectorOptions);
		getId("cbRSEditable").checked = options.cbRSEditable;
		getId("cbRSCaseSens").checked = options.cbRSCaseSens;
		getId("cbRSOnScreen").checked = options.cbRSOnScreen;
		getId("cbRSLimit").checked = options.cbRSLimit;
		getId("inRSLimit").value = options.inRSLimit;
	}
	saveOptions();
	getId("cbRSEditable").onchange = saveOptions;
	getId("cbRSCaseSens").onchange = saveOptions;
	getId("cbRSOnScreen").onchange = saveOptions;
	getId("cbRSLimit").onchange = saveOptions;
	getId("inRSLimit").onchange = saveOptions;

	if (SavedQueries.length > 0) {
		$('#roadselector-tabs a[href="#roadselector-tabs-saved"]').tab('show');
	}

	unsafeWindow.RoadSelector = {
		checkSegment: function(expression, segment) {
			if (typeof(expression) === 'undefined' || expression === null) {
				return false;
			} else {
				return checkExpr(expression, segment);
			}
		},
		getCurrentExpression: function() {
			if (ExprStatus === 1 && BktCount === 0) {
				var e = clone(ExprTree);
				return e;
			} else {
				return null;
			}
		},
		getSavedNames: function() {
			var lst = [];
			for (var i = 0; i < SavedQueries.length; i++) {
				if (SavedQueries[i].ExprStatus === 1) {
					lst.push(SavedQueries[i].name);
				}
			}
			return lst;
		},
		getSavedExpression: function(name) {
			for (var i = 0; i < SavedQueries.length; i++) {
				if (SavedQueries[i].ExprStatus === 1 && SavedQueries[i].BktCount === 0 && SavedQueries[i].name === name) {
					var e = clone(SavedQueries[i].ExprTree);
					return e;
				}
			}
			return null;
		},
		getExpressionText: function(expression) {
			if (typeof(expression) === 'undefined' || expression === null) {
				return 'Wrong expression!';
			} else {
				return genExptrTxt(expression);
			}
		}
	};

}


document.addEventListener("wme-ready", roadSelector_init, {once: true});
