// ==UserScript==
// @name                WME Route Checker
// @namespace           http://userscripts.org/users/419370
// @description         Allows editors to check the route between two segments
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.66
// @grant               GM_xmlhttpRequest
// @connect             waze.com
// @downloadURL https://update.greasyfork.org/scripts/3202/WME%20Route%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/3202/WME%20Route%20Checker.meta.js
// ==/UserScript==

// globals
var wmerc_version = "1.65";

var AVOID_TOLLS = 1;
var AVOID_FREEWAYS = 2;
var AVOID_DIRT = 4;
var ALLOW_UTURNS = 16;
var VEHICLE_TAXI = 64;
var VEHICLE_BIKE = 128;

var route_options = ALLOW_UTURNS; // default

var routeColors = ["#8309e1", "#52BAD9", "#888800" ];

var WMERC_lineLayer_route;
var WMERC_lineLayer_markers;

function addRouteCheckerTab(tabPane) {
  tabPane.id = 'route-checker';

  // listen for the new tab become visible, or invisible
  new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.intersectionRatio > 0) {
        fetchRoute();
      }
      else {
        clearRoute();
      }
    });
  }).observe(tabPane.parentElement);

  // add routing options
  var routeOptions = document.createElement('div');
  routeOptions.id = "routeOptions";
  routeOptions.style.borderTop = "solid 2px #E9E9E9";
  routeOptions.style.borderBottom = "solid 2px #E9E9E9";
  tabPane.appendChild(routeOptions);

  var lang = I18n.translations[I18n.locale];

  if (location.hostname.match(/editor.*.waze.com/)) {
    var coords1 = getCoords(W.selectionManager.getSelectedWMEFeatures()[0]);
    var coords2 = getCoords(W.selectionManager.getSelectedWMEFeatures()[1]);
    var url = getLivemap()
            + `&from_lon=${coords1.lon}&from_lat=${coords1.lat}`
            + `&to_lon=${coords2.lon}&to_lat=${coords2.lat}`;

    routeOptions.innerHTML = '<p><b><a href="'+url+'" title="Opens in new tab" target="LiveMap" style="color:#8309e1">Show routes in LiveMap</a> &raquo;</b></p>';
  } else {
    routeOptions.innerHTML = `<p><b><a href="#" id="goroutes" title="WME Route Checker v${wmerc_version}" style="color:#8309e1">`
                    + 'Show routes between these 2 segments</a></b><br>'
                    + '<b>'+lang.restrictions.editing.driving.dropdowns.vehicle_type+':</b>'
                    + ' <span style="white-space: nowrap;"><input type="radio" name="_vehicleType" id="_vehicleType_private" value="0" checked> '
                    + lang.restrictions.vehicle_types.PRIVATE + '</span>'
                    + ' <span style="white-space: nowrap;"><input type="radio" name="_vehicleType" id="_vehicleType_taxi" value="1"> '
                    + lang.restrictions.vehicle_types.TAXI + '</span>'
                    + ' <span style="white-space: nowrap;"><input type="radio" name="_vehicleType" id="_vehicleType_bike" value="1"> '
                    + lang.restrictions.vehicle_types.MOTORCYCLE + '</span>'
                    + '<br>'
                    + '<b>Avoid:</b>'
                    + ' <span style="white-space: nowrap;"><input type="checkbox" id="_avoidTolls" /> ' + lang.edit.segment.fields.toll_road + '</span>'
                    + ' <span style="white-space: nowrap;"><input type="checkbox" id="_avoidFreeways" /> ' + lang.segment.road_types[3] + '</span>'
                    + ' <span style="white-space: nowrap;"><input type="checkbox" id="_avoidDirt" /> ' + lang.edit.segment.fields.unpaved + '</span>'
                    + '<br>'
                    + '<b>Allow:</b>'
                    + ' <input type="checkbox" id="_allowUTurns" /> U-Turns</p>';

     getId('_avoidTolls').checked              = route_options & AVOID_TOLLS;
     getId('_avoidFreeways').checked           = route_options & AVOID_FREEWAYS;
     getId('_avoidDirt').checked               = route_options & AVOID_DIRT;
     getId('_allowUTurns').checked             = route_options & ALLOW_UTURNS;
     getId('_vehicleType_taxi').checked        = route_options & VEHICLE_TAXI;
     getId('_vehicleType_bike').checked        = route_options & VEHICLE_BIKE;

     // automatically start getting route when user clicks on link
     getId('goroutes').onclick = fetchRoute;
  }

  // create empty div ready for instructions
  var routeTest = document.createElement('div');
  routeTest.id = "routeTest";
  tabPane.appendChild(routeTest);
}

function saveOptions() {
  route_options = (getId('_avoidTolls').checked    ? AVOID_TOLLS    : 0)
                + (getId('_avoidFreeways').checked ? AVOID_FREEWAYS : 0)
                + (getId('_avoidDirt').checked     ? AVOID_DIRT     : 0)
                + (getId('_allowUTurns').checked   ? ALLOW_UTURNS   : 0)
                + (getId('_vehicleType_taxi').checked ? VEHICLE_TAXI : 0)
                + (getId('_vehicleType_bike').checked ? VEHICLE_BIKE : 0);

  console.log("WME Route Checker: saving options: " + route_options);
  localStorage.WMERouteChecker = JSON.stringify(route_options);
}

function getOptions() {
  var list = 'AVOID_TOLL_ROADS' + (route_options & AVOID_TOLLS    ? ':t' : ':f') + ','
           + 'AVOID_PRIMARIES'  + (route_options & AVOID_FREEWAYS ? ':t' : ':f') + ','
           + 'AVOID_TRAILS'     + (route_options & AVOID_DIRT     ? ':t' : ':f') + ','
           + 'ALLOW_UTURNS'     + (route_options & ALLOW_UTURNS   ? ':t' : ':f');
  return list;
}

function getCoords(segment) {
  var numpoints = segment.geometry.coordinates.length;
  var middle = Math.floor(numpoints / 2);

  var seglat, seglon;
  if (numpoints % 2 == 1 || numpoints < 2) { // odd number, middle point
    seglat = segment.geometry.coordinates[middle][1];
    seglon = segment.geometry.coordinates[middle][0];
  }
  else { // even number - take average of middle two points
    seglat = (segment.geometry.coordinates[middle][1]
           +  segment.geometry.coordinates[middle-1][1]) / 2.0;
    seglon = (segment.geometry.coordinates[middle][0]
           +  segment.geometry.coordinates[middle-1][0]) / 2.0;
  }
  return {"lon": seglon, "lat": seglat};
}

function clearRoute() {
  getId('routeTest').innerHTML = "";
  WMERC_lineLayer_route.destroyFeatures();
  WMERC_lineLayer_route.setVisibility(false);
  WMERC_lineLayer_markers.destroyFeatures();
  WMERC_lineLayer_markers.setVisibility(false);
}

function fetchRoute(reverse) {
  // requires two segments to be selected
  if (W.selectionManager.getSelectedWMEFeatures().length != 2) {
    return;
  }

  // don't do fetch route if tab is not active
  if (!getId('route-checker').parentElement.classList.contains('active')){
    return;
  }

  saveOptions();

  var coords1, coords2;
  reverse = (reverse !== false);
  var selected = W.selectionManager.getSelectedWMEFeatures();
  if (reverse) {
    coords1 = getCoords(selected[0]);
    coords2 = getCoords(selected[1]);
  } else {
    coords1 = getCoords(selected[1]);
    coords2 = getCoords(selected[0]);
  }

  // get the route, fix and parse the json
  getId('routeTest').innerHTML = "<p><b>Fetching route from LiveMap...</b></p>";
  var url = getRoutingManager();
  var data = {
    from: `x:${coords1.lon} y:${coords1.lat} bd:true`,
    to: `x:${coords2.lon} y:${coords2.lat} bd:true`,
    returnJSON: true,
    returnGeometries: true,
    returnInstructions: true,
    type: 'HISTORIC_TIME',
    clientVersion: '4.0.0',
    timeout: 60000,
    nPaths: 3,
    options: getOptions()};

  if (route_options & VEHICLE_TAXI) {
    data.vehicleType = 'TAXI';
  }
  else if (route_options & VEHICLE_BIKE) {
    data.vehicleType = 'MOTORCYCLE';
  }
  if (window.location.hostname == "beta.waze.com") {
    data.id = "beta";
  }

  GM_xmlhttpRequest({
    method: "GET",
    url: url + "?" + jQuery.param(data),
    headers: {
      "Content-Type": "application/json"
    },
    nocache: true,
    responseType: "json",
    onload: function(details) {
      if (details.response.error === undefined) {
         showNavigation(details.response, reverse);
      }
    }
  });
  return false;
}

function getLivemap() {
  var center_lonlat=new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
  center_lonlat.transform(new OpenLayers.Projection ("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
  var coords = `?lon=${center_lonlat.lon}&lat=${center_lonlat.lat}`;

  if (route_options & VEHICLE_TAXI) {
    coords += "&rp_vehicleType=TAXI";
  }
  else if (route_options & VEHICLE_BIKE) {
    coords += "&rp_vehicleType=MOTORCYCLE";
  }
  if (window.location.hostname == "beta.waze.com") {
    coords += "&rp_id=beta";
  }
  coords += "&rp_options=" + getOptions();

  return `https://www.waze.com/livemap${coords}&overlay=false`;
}

function getRoutingManager() {
  if (W.model.topCountry.attributes.env == "NA") { // Canada, Puerto Rico & US
    return 'https://routing-livemap-am.waze.com/RoutingManager/routingRequest';
  } else if (W.model.topCountry.attributes.env == "IL") { // Israel
    return 'https://routing-livemap-il.waze.com/RoutingManager/routingRequest';
  } else { // ROW
    return 'https://routing-livemap-row.waze.com/RoutingManager/routingRequest'; // ROW
  }
}

function plotRoute(coords, index) {
  var points = [];
  for (var i in coords) {
    if (i > 0) {
      var point = OpenLayers.Layer.SphericalMercator.forwardMercator(coords[i].x, coords[i].y);
      points.push(new OpenLayers.Geometry.Point(point.lon,point.lat));
    }
  }
  var newline = new OpenLayers.Geometry.LineString(points);

  var style = {
    strokeColor: routeColors[index],
    strokeOpacity: 0.7,
    strokeWidth: 8 - index * 2
  };
  var lineFeature = new OpenLayers.Feature.Vector(newline, {type: "routeArrow"}, style);

  // Display new segment
  WMERC_lineLayer_route.addFeatures([lineFeature]);
}

function showNavigation(nav_json, reverse) {
  WMERC_lineLayer_route.destroyFeatures();
  WMERC_lineLayer_route.setVisibility(true);
  WMERC_lineLayer_markers.destroyFeatures();
  WMERC_lineLayer_markers.setVisibility(true);

  // write instructions
  var instructions = getId('routeTest');
  instructions.innerHTML = '';
  instructions.style.display = 'block';
  instructions.style.height = document.getElementById('map').style.height;

  var nav_coords;
  if (typeof nav_json.alternatives !== "undefined") {
    for (var r = 0; r < nav_json.alternatives.length && r < 3; r++) {
      showInstructions(instructions, nav_json.alternatives[r], r);
      plotRoute(nav_json.alternatives[r].coords, r);
  }
    nav_coords = nav_json.alternatives[0].coords;
  } else {
    showInstructions(instructions, nav_json, 0);
    plotRoute(nav_json.coords, 0);
    nav_coords = nav_json.coords;
  }

  // zoom to show the primary route
  //var box = geom.getBounds();
  //box = box.transform(W.map.olMap.displayProjection, W.map.getProjectionObject());
  //W.map.zoomToExtent(box);

  var lon1 = nav_coords[0].x;
  var lat1 = nav_coords[0].y;

  var end = nav_coords.length - 1;
  var lon2 = nav_coords[end].x;
  var lat2 = nav_coords[end].y;

  var rerouteArgs = `{lon:${lon1},lat:${lat1}},{lon:${lon2},lat:${lat2}}`;

  // footer for extra links
  var footer = document.createElement('div');
  footer.className = 'routes_footer';

  // create link to reverse the route
  var reverseLink = document.createElement('a');
  reverseLink.innerHTML = '&#8646; Reverse Route';
  reverseLink.href = '#';
  reverseLink.setAttribute('onClick', 'fetchRoute('+!reverse+');');
  reverseLink.addEventListener('click', function() { fetchRoute(!reverse); }, false);
  footer.appendChild(reverseLink);

  footer.appendChild(document.createTextNode(' | '));

  var url = getLivemap()
          + `&from=ll.${lat1},${lon1}`
          + `&to=ll.${lat2},${lon2}`;

  // create link to view the navigation instructions
  var livemapLink = document.createElement('a');
  livemapLink.innerHTML = 'View in LiveMap &raquo;';
  livemapLink.href = url;
  livemapLink.target="LiveMap";
  footer.appendChild(livemapLink);

  footer.appendChild(document.createElement('br'));

  // add link to script homepage and version
  var scriptLink = document.createElement('a');
  scriptLink.innerHTML = `WME Route Checker v${wmerc_version}`;
  scriptLink.href = 'https://www.waze.com/forum/viewtopic.php?t=64777';
  scriptLink.style.fontStyle = 'italic';
  scriptLink.target="_blank";
  footer.appendChild(scriptLink);

  instructions.appendChild(footer);

  return false;
}

function showInstructions(instructions, nav_json, r) {
  // for each route returned by Waze...
  var route = nav_json.response;
  var streetNames = route.streetNames;

  if (r > 0) { // divider
    instructions.appendChild(document.createElement('p'));
  }

  // name of the route, with coloured icon
  var route_name = document.createElement('p');
  route_name.className = 'route';
  route_name.style.borderColor = routeColors[r];
  route_name.innerHTML = `<b style="color:${routeColors[r]}">Via ${route.routeName}</b>`;
  if (route.dueToOverride != null) {
    route_name.innerHTML += `<br><i>${route.dueToOverride}</i>`;
  }
  else if (route.isRestricted) {
    route_name.innerHTML += `<br><i style="color: darkorange">Restricted Areas: ${route.areas}</i>`;
  }
  else {
    route_name.innerHTML += `<br><i>${route.routeType} Route</i>`;
  }
  instructions.appendChild(route_name);

  if (route.tollMeters > 0) {
    route_name.innerHTML = '<span style="float: right; background: #88f; color: white; font-size: small">&nbsp;TOLL&nbsp;</span>' + route_name.innerHTML;
  }

  var optail = '';
  var prevStreet = '';
  var currentItem = null;
  var totalDist = 0;
  var totalTime = 0;
  var isToll = false;
  var isRestricted = 0;
  //var detourSaving = 0;

  // street name at starting point
  var streetName = streetNames[route.results[0].street];
  var departFrom = 'depart';
  if (!streetName || streetName === null) {
    streetName = '';
  }
  else {
    departFrom = `depart from ${streetName}`;
    streetName = ` from <span style="color: blue">${streetName}<span>`;
  }

  // turn icon at starting coordinates
  if (r === 0) {
    addTurnArrowToMap(nav_json.coords[0], getTurnArrow('BEGIN'), departFrom);
  }

  // add first instruction (depart)
  currentItem = document.createElement('a');
  currentItem.className = 'step';
  currentItem.innerHTML = `<b>${getTurnArrow('BEGIN')}</b> depart ${streetName}`;
  instructions.appendChild(currentItem);

  var segments = [];
  // iterate over all the steps in the list
  for (var i = 0; i < route.results.length; i++) {
    totalDist += route.results[i].length;
    totalTime += route.results[i].crossTime;
    //detourSaving += route.results[i].detourSavings;

    segments.push(route.results[i].path.segmentId);

    if (route.results[i].isToll) {
      if (!isToll) {
        addMarkerToMap(route.results[i].path, "blue", "Toll");
        isToll = true;
      }
    }
    else {
      if (isToll) {
        addMarkerToMap(route.results[i].path, "blue", "End");
        isToll = false;
      }
    }

    if (route.results[i].avoidStatus == "AVOID") {
      if (isRestricted != route.results[i].areas.length) {
        addMarkerToMap(route.results[i].path, 'darkorange', `${route.results[i].areas}`);
        isRestricted = route.results[i].areas.length;
      }
    }
    else {
      if (isRestricted > 0) {
        addMarkerToMap(route.results[i].path, 'darkorange', 'End')
        isRestricted = 0;
      }
    }

    if (!route.results[i].instruction) {
      continue;
	}
    var opcode = route.results[i].instruction.opcode;
    if (!opcode) {
      continue;
	}

    // ignore these
    if (opcode.match(/ROUNDABOUT_EXIT|NONE/) && route.results[i].instruction.laneGuidance == null) {
      continue;
    }

    if (opcode == 'NONE' && !route.results[i].instruction.laneGuidance.enable_display && !route.results[i].instruction.laneGuidance.enable_voice) {
      continue; // straight-on is set to 'Waze selected'
    }

    // the arrow symbol for the turn
    var turnArrow = getTurnArrow(opcode, route.results[i].instruction.arg);

    // the name that TTS will read out (in blue)
    streetName = getNextStreetName(route.results, i, route.streetNames);

    // roundabouts with nth exit instructions
    if (opcode == 'ROUNDABOUT_ENTER') {
      opcode += route.results[i].instruction.arg + 'th exit';
      opcode = opcode.replace(/1th/, '1st');
      opcode = opcode.replace(/2th/, '2nd');
      opcode = opcode.replace(/3th/, '3rd');
    }

    // convert opcode to pretty text
    opcode = opcode.replace(/APPROACHING_DESTINATION/, 'arrive');
    opcode = opcode.replace(/ROUNDABOUT_(EXIT_)?LEFT/, 'at the roundabout, turn left');
    opcode = opcode.replace(/ROUNDABOUT_(EXIT_)?RIGHT/, 'at the roundabout, turn right');
    opcode = opcode.replace(/ROUNDABOUT_(EXIT_)?STRAIGHT/, 'at the roundabout, continue straight');
    opcode = opcode.replace(/ROUNDABOUT_ENTER/, 'at the roundabout, take ');
    opcode = opcode.toLowerCase().replace(/_/, ' ');
    opcode = opcode.replace(/uturn/, 'make a U-turn');
    opcode = opcode.replace(/roundabout u/, 'at the roundabout, make a U-turn');

    // convert keep to exit if needed
    var keepSide = W.model.isLeftHand ? /keep left/ : /keep right/;
    if (opcode.match(keepSide) && i+1 < route.results.length &&
        isKeepForExit(route.results[i].roadType, route.results[i+1].roadType)) {
      opcode = opcode.replace(/keep (.*)/, 'exit $1');
    }

    var laneInfo = "";
    var laneIcon = "";
    if (route.results[i].clientLaneSet != null) {
      var lanes = route.results[i].clientLaneSet.clientLane;
      var guide = route.results[i].instruction.laneGuidance;
      laneInfo += " |";
      for (var l = 0; l < lanes.length; l++) {
        if (l > 0) {
          laneInfo += "\u2506"; // dashed line
        }
        var laneArrow = "\u2001"; // space \u00A0
        for (var a = 0; a < lanes[l].angleObject.length; a++) {
          var lane = lanes[l].angleObject[a];
          if (lane.selected) {
            laneArrow = getLaneArrow(lane.angle);
          }
        }
        laneInfo += ` ${laneArrow} `;
        laneIcon += laneArrow != '\u2001' ? laneArrow : '.';
      }
      laneInfo += "| ";
      if (guide != null && opcode == 'none') {
        if (lanes.enable_voice_for_instruction) {
          laneInfo += "\uD83D\uDD08\uD83D\uDD08"; // View and hear
        }
        if (guide.enable_voice) {
          laneInfo += "\uD83D\uDD08"; // View and hear
        }
        else if (guide.enable_display) {
          laneInfo += "\uD83D\uDC41"; // View only
        }
      }
    }

    // show turn symbol on the map (for first route only)
    if (r === 0) {
	  var title;
      if (opcode == 'arrive') {
        var end = nav_json.coords.length - 1;
        title = 'arrive at ' + (streetName !== '' ? streetName : 'destination');
        addTurnArrowToMap(nav_json.coords[end], turnArrow, title);
      }
      else if (opcode != 'none') {
        title = opcode.replace(/at the roundabout, /, '');
        if (streetName !== '') title += ` onto ${streetName}`;
        if (laneIcon !== '') title = ` \u2502${laneIcon}\u2502 \u00A0 ${title}`;
        addTurnArrowToMap(route.results[i+1].path, turnArrow, title);
      }
      else if (laneInfo != '') {
        addTurnArrowToMap(route.results[i+1].path, null, `\u2502${laneIcon}\u2502`);
      }
    }

    // pretty street name
    if (streetName !== '') {
      if (opcode == 'arrive') {
        streetName = ` at <span style="color: blue">${streetName}</span>`;
      }
      else if (opcode != 'none') {
        streetName = ` onto <span style="color: blue">${streetName}</span>`;
      }
    }

    if (laneInfo != '') {
      laneInfo = "<div align='center'>" + laneInfo + "</div>";
    }

    // display new instruction
    currentItem = document.createElement('a');
    currentItem.className = 'step';
    if (opcode != 'none') {
      currentItem.innerHTML = `<b>${turnArrow}</b> ${opcode} ${streetName} ${laneInfo}`;
    }
    else {
      currentItem.innerHTML = laneInfo;
    }
    if (opcode.match(/0th exit/)) {
      currentItem.style.color = 'red';
    }
    instructions.appendChild(currentItem);
  }

  // append distance and time to last instruction
  currentItem.title = `${(totalDist/1609).toFixed(3)} miles`;
  currentItem.innerHTML += ` - ${totalDist/1000} km`;
  currentItem.innerHTML += ` - ${timeFromSecs(totalTime)}`;
  //if (detourSaving > 0) {
  //  currentItem.innerHTML += '<br>&nbsp; <i>detour saved ' + timeFromSecs(detourSaving) + '</i>';
  //}

  var selectAll = document.createElement('a');
  selectAll.className = 'step select';
  selectAll.innerHTML = 'Select route segments &#8605;';
  selectAll.href = "#";
  selectAll.addEventListener('click', function() { selectSegmentIDs(segments); }, false);
  instructions.appendChild(selectAll);
}

function getLaneArrow(angle)
{
  switch (angle) {
    case -180: return "\u21B6";
    case -135: return "\u2199";
    case -90: return "\u21B0";
    case -45: return "\u2196";
    case -0: return "\u2191";
    case 45: return "\u2197";
    case 90: return "\u21B1";
    case 135: return "\u2198";
    case 180: return "\u21B7";
    default: return angle;
  }
}

function selectSegmentIDs(segments) {
  var objects = [];
  for (var i = 0; i < segments.length; i++) {
    var segment = W.model.segments.getObjectById(segments[i]);
    if (segment != null) {
      objects.push(segment);
    }
  }
  W.selectionManager.setSelectedModels(objects);
  return false;
}

function getNextStreetName(results, index, streetNames) {
  var streetName = '';
  var unnamedCount = 0;
  var unnamedLength = 0;

  // destination
  if (index == results.length-1) {
    streetName = streetNames[results[index].street];
    if (!streetName || streetName === null) {
      streetName = '';
    }
  }

  // look ahead to next street name
  while (++index < results.length && streetName === '') {
    streetName = streetNames[results[index].street];
    if (!streetName || streetName === null) {
      streetName = '';
    }

    // "Navigation instructions for unnamed segments" <- in the Wiki
    if (streetName === '' && !isFreewayOrRamp(results[index].roadType)
		&& !isRoundabout(results[index].path.segmentId)) {
      unnamedLength += length;
      unnamedCount++;
      if (unnamedCount >= 4 || unnamedLength >= 400) {
        //console.log("- unnamed segments too long; break");
        break;
      }
    }
  }

  return streetName;
}

function getTurnArrow(opcode, nth = 0) {
  switch (opcode) {
    case "BEGIN":       return "\uD83D\uDD88";
    case "CONTINUE":
    case "NONE":        return getLaneArrow(0);
    case "TURN_LEFT":   return getLaneArrow(-90);
    case "TURN_RIGHT":  return getLaneArrow(+90);
    case "KEEP_LEFT":
    case "EXIT_LEFT":   return getLaneArrow(-45);
    case "KEEP_RIGHT":
    case "EXIT_RIGHT":  return getLaneArrow(+45);
    case "UTURN":       return getLaneArrow(-180);
    case "APPROACHING_DESTINATION":   return "\u2691"; // black flag
    case "ROUNDABOUT_LEFT":
    case "ROUNDABOUT_EXIT_LEFT":      return "\u24C1"; // (L)
    case "ROUNDABOUT_RIGHT":
    case "ROUNDABOUT_EXIT_RIGHT":     return "\u24C7"; // (R)
    case "ROUNDABOUT_STRAIGHT":
    case "ROUNDABOUT_EXIT_STRAIGHT":  return "\u24C8"; // (S)
    case "ROUNDABOUT_ENTER":
    case "ROUNDABOUT_EXIT":           return String.fromCharCode(0x24F5 + nth - 1);
    case "ROUNDABOUT_U":              return "\u24CA"; // (U)
  }
  return '';
}

function isKeepForExit(fromType, toType) {
  // primary to non-primary
  if (isPrimaryRoad(fromType) && !isPrimaryRoad(toType)) {
    return true;
  }
  // ramp to non-primary or non-ramp
  if (isRamp(fromType) && !isPrimaryRoad(toType) && !isRamp(toType)) {
    return true;
  }
  return false;
}

function isFreewayOrRamp(t) {
  return t === 3 /*FREEWAY*/ || t === 4 /*RAMP*/;
}

function isPrimaryRoad(t) {
  return t === 3 /*FREEWAY*/ || t === 6 /*MAJOR_HIGHWAY*/ || t === 7 /*MINOR_HIGHWAY*/;
}

function isRamp(t) {
  return t === 4 /*RAMP*/;
}

function isRoundabout(id) {
  var segment = W.model.segments.getObjectById(id);
  if (segment != null) {
    return segment.attributes.junctionId !== null;
  }
  return false;
}

function timeFromSecs(seconds)
{
  var hh = '00'+Math.floor(((seconds/86400)%1)*24);
  var mm = '00'+Math.floor(((seconds/3600)%1)*60);
  var ss = '00'+Math.round(((seconds/60)%1)*60);
  return hh.slice(-2) + ':' + mm.slice(-2) + ':' + ss.slice(-2);
}

function addTurnArrowToMap(location, arrow, title) {
  if (arrow === '') return;

  var coords = OpenLayers.Layer.SphericalMercator.forwardMercator(location.x, location.y);
  var point = new OpenLayers.Geometry.Point(coords.lon,coords.lat);

  var style = {
    label: arrow + " " + title,
    labelXOffset: -6,
    labelAlign: 'left',
    labelOutlineColor: 'white',
    labelOutlineWidth: 5,
    fontWeight: 'bold',
    fontColor: routeColors[0]
  };

  if (title.match(/0th exit/)) {
    style.fontColor = 'red';
  }

  var imageFeature = new OpenLayers.Feature.Vector(point, null, style);
  WMERC_lineLayer_markers.addFeatures([imageFeature]);

  if (arrow === null || arrow === '') {
    style = {
      label: '●',
      labelAlign: 'center',
      labelOutlineColor: 'white',
      labelOutlineWidth: 3,
      fontWeight: 'bold',
      fontColor: routeColors[0],
      fontSize: '20pt'
    };

    imageFeature = new OpenLayers.Feature.Vector(point, null, style);
    WMERC_lineLayer_route.addFeatures([imageFeature]);
  }
}

function addMarkerToMap(location, color, title) {
  var coords = OpenLayers.Layer.SphericalMercator.forwardMercator(location.x, location.y);
  var point = new OpenLayers.Geometry.Point(coords.lon,coords.lat);

  var style = {
    label: title,
    labelAlign: 'right',
    labelOutlineColor: color,
    labelOutlineWidth: 3,
    labelXOffset: -16,
    fontWeight: 'bold',
    fontColor: 'white',
    strokeColor: color,
    strokeWidth: 2,
    fillColor: 'white'
  };

  if (color == 'blue') {
    style.labelAlign = 'center';
    style.labelXOffset = 0;
    style.labelYOffset = -20;
  }

  var imageFeature = new OpenLayers.Feature.Vector(point, null, style);
  WMERC_lineLayer_route.addFeatures([imageFeature]);

  style = {
    labelAlign: 'center',
    labelOutlineColor: color,
    labelOutlineWidth: 3,
    fontWeight: 'bold',
    fontColor: 'white'
  };

  if (title != 'End') {
    style.label = '●';
    style.fontSize = '20pt';
  }
  else {
    style.label = '⊘';
  }

  imageFeature = new OpenLayers.Feature.Vector(point, null, style);
  WMERC_lineLayer_route.addFeatures([imageFeature]);
}

/* helper function */
function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
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

function getId(node) {
  return document.getElementById(node);
}

function initialiseRouteChecker() {
  console.log("WME Route Checker: initialising v" + wmerc_version);

  if (localStorage.WMERouteChecker) {
    route_options = JSON.parse(localStorage.WMERouteChecker);
    console.log("WME Route Checker: loaded options: " + route_options);
  }

  /* dirty hack to inject stylesheet in to the DOM */
  var style = document.createElement('style');
  style.innerHTML = "#routeTest {padding: 0 4px 0 0; overflow-y: auto;}\n"
                  + "#routeTest p.route {margin: 0; padding: 4px 8px; border-bottom: silver solid 3px; background: #eee}\n"
                  + "#routeTest a.step {display: block; margin: 0; padding: 3px 8px; text-decoration: none; color:black;border-bottom: silver solid 1px;}\n"
                  + "#routeTest a.step:hover {background: #ffd;}\n"
                  + "#routeTest a.step:active {background: #dfd;}\n"
                  + "#routeTest a.select {color: #00f; text-align: right}\n"
                  + "#routeTest div.routes_footer {text-align: center; margin-bottom: 25px;}\n";
  (document.body || document.head || document.documentElement).appendChild(style);

  // add a new layer for routes
  WMERC_lineLayer_route = new OpenLayers.Layer.Vector("Route Checker Script",
    { displayInLayerSwitcher: false,
      uniqueName: 'route_checker' }
  );
  W.map.addLayer(WMERC_lineLayer_route);

  // add a new layer for markers
  WMERC_lineLayer_markers = new OpenLayers.Layer.Vector("Route Checker Script Markers",
    { displayInLayerSwitcher: false,
      uniqueName: 'route_checker2' }
  );
  W.map.addLayer(WMERC_lineLayer_markers);

  // add tab to userscripts area
  var tab = W.userscripts.registerSidebarTab("wmeRouteChecker");
  tab.tabLabel.innerText = "Routes";
  tab.tabLabel.title = "Route Checker";

  W.userscripts.waitForElementConnected(tab.tabPane).then(() => {
    addRouteCheckerTab(tab.tabPane);
  });
}

// bootstrap!
if (W?.userscripts?.state?.isInitialized) {
  initialiseRouteChecker();
} else {
  document.addEventListener("wme-initialized", initialiseRouteChecker, {
    once: true,
  });
}
/* end ======================================================================= */