// ==UserScript==
// @name                WME Color Highlights Mod
// @namespace           https://greasyfork.org/fr/scripts/35181-wme-color-highlights-mod
// @description         Adds colours to road segments to show their status
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             2.38.1
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/35181/WME%20Color%20Highlights%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/35181/WME%20Color%20Highlights%20Mod.meta.js
// ==/UserScript==
(function()
 {
    // global variables
    var wmech_version = "2.38.1";
    var advancedMode = false;
    var lastModified = false;
    var selectedLines = [];
    var wmechinit = false;

    /* =========================================================================== */
    function highlightSegments(event) {
        if (!wmechinit) return;

        var showLocked = getId('_cbHighlightLocked').checked;
        var showToll = getId('_cbHighlightToll').checked;
        var showTunnel = getId('_cbHighlightTunnel').checked;
        var showUnpaved = getId('_cbHighlightUnpaved').checked;
        var showHeadlights = getId('_cbHighlightHeadlights').checked;
        var showNearbyHOV = getId('_cbHighlightNearbyHOV').checked;
        var showNoCity = getId('_cbHighlightNoCity').checked;
        var showAltName = getId('_cbHighlightAltName').checked;
        var showNoName = getId('_cbHighlightUnnamed').checked;
        var showOneWay = getId('_cbHighlightOneWay').checked;
        var showRestrictions = getId('_cbHighlightRestrictions').checked;
        var showSpeedLimits = getId('_cbHighlightSpeedLimits').checked;
        var showAvgSpeedCams = getId('_cbHighlightAvgSpeedCams').checked;
        var showLanes = getId('_cbHighlightLanes').checked;
        var plusRamps = getId('_cbHighlightPlusRampLimits').checked;
        var plusStreets = getId('_cbHighlightPlusStreetLimits').checked;
        var specificCity = getId('_cbHighlightCity').checked;
        var specificCityInvert = getId('_cbHighlightCityInvert').checked;
        var specificState = getId('_cbHighlightState').checked;
        var specificStateInvert = getId('_cbHighlightStateInvert').checked;
        var specificRoadType = getId('_cbHighlightRoadType').checked;
        var showNoHNs = getId('_cbHighlightNoHN').checked;
        var showRoutingPref = getId('_cbHighlightRoutingPref').checked;
        var showOtherLevel = getId('_cbHighlightOtherLevel').checked;
        var showRoadShield = getId('_cbHighlightRoadShields').checked;
        var showRecent = getId('_cbHighlightRecent').checked;
        var specificEditor = getId('_cbHighlightEditor').checked;
        var showSpeed = getId('_cbHighlightSpeed').checked;
        var showUSpeed = getId('_cbHighlightUSpeed').checked;
        // master switch when all options are off
        if (event && event.type && event.type == 'click') {
            if ( (showLocked | showToll | showNoCity | showNoName | showAltName | showOneWay | showRestrictions
                  | specificCity | specificState | specificEditor | specificRoadType | showRecent | showSpeedLimits | showAvgSpeedCams | showLanes | showNoHNs | showUnpaved | showHeadlights | showNearbyHOV | showSpeed | showUSpeed | showTunnel
                 ) == false) {
                for (var seg in W.model.segments.objects) {
                    var segment = W.model.segments.getObjectById(seg);
                    var line = W.userscripts.getFeatureElementByDataModel(segment);

                    if (line === null) {
                        continue;
                    }

                    // turn off all highlights
                    var opacity = line.getAttribute("stroke-opacity");
                    if (opacity > 0.1 && opacity < 1) {
                        line.setAttribute("stroke","#dd7700");
                        line.setAttribute("stroke-opacity",0.001);
                        line.setAttribute("stroke-dasharray", "none");
                    }
                }
                return;
            }
        }

        var today = new Date();
        var recentDays;
        var selectedUserId = null;
        var selectedCityId = null;

        if (specificEditor) {
            var selectUser = getId('_selectUser');
            if (selectUser.selectedIndex >= 0)
                selectedUserId = selectUser.options[selectUser.selectedIndex].value;
            else
                specificEditor = false;
        }

        if (specificCity) {
            var selectCity = getId('_selectCity');
            if (selectCity.selectedIndex >= 0)
                selectedCityId = selectCity.options[selectCity.selectedIndex].value;
            else
                specificCity = false;
        }
        if (specificState) {
            var selectState = getId('_selectState');
            if (selectState.selectedIndex >= 0)
                selectedStateId = selectState.options[selectState.selectedIndex].value;
            else
                specificState = false;
        }
        if (specificRoadType) {
            var selectedRoadType = false;
            var selectRoadType = getId('_selectRoadType');
            if (selectRoadType.selectedIndex >= 0)
                selectedRoadType = selectRoadType.options[selectRoadType.selectedIndex].value;
        }

        if (showRecent) {
            recentDays = getId('_numRecentDays').value;
            if (recentDays === undefined) recentDays = 0;
        }

        // counters
        var numUserHighlighted = 0;
        var numCityHighlighted = 0;
        var numStateHighlighted = 0;
        var numTotalSeg = 0, numMaxSpeed = 0, numMaxUSpeed = 0, numClosed = 0, numUClosed = 0;
        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            var attributes = segment.attributes;
            var line = W.userscripts.getFeatureElementByDataModel(segment);

            if (line === null) {
                continue;
            }

            var sid = attributes.primaryStreetID;
            numTotalSeg++;
            // check that WME hasn't highlighted this segment
            var opacity = line.getAttribute("stroke-opacity");
            var lineWidth = line.getAttribute("stroke-width");
            if (opacity == 1 || lineWidth == 9)
                continue;

            // turn off highlights when roads are no longer visible
            var roadType = attributes.roadType;
            if (W.map.getZoom() <= 3 && (roadType < 2 || roadType > 7)) {
                if (opacity > 0.1) {
                    line.setAttribute("stroke","#dd7700");
                    line.setAttribute("stroke-opacity",0.001);
                    line.setAttribute("stroke-dasharray", "none");
                }
                continue;
            }

            // highlight all newly paved roads (or roads without any nodes)
            if (sid === null || (attributes.toNodeID === null && attributes.fromNodeID === null && (roadType < 9 || roadType == 22))) {
                if (opacity < 0.1 && showNoName) {
                    line.setAttribute("stroke","#f00");
                    line.setAttribute("stroke-opacity",0.75);
                    line.setAttribute("stroke-width", 10);
                }
                continue;
            }
            var street = W.model.streets.getObjectById(sid);

            // get attributes for this segment
            var toll        = attributes.fwdToll;
            var fwdspeed    = attributes.fwdMaxSpeed;
            var revspeed    = attributes.revMaxSpeed;
            var fwduspeed   = attributes.fwdMaxSpeedUnverified;
            var revuspeed   = attributes.revMaxSpeedUnverified;
            var fwddir      = attributes.fwdDirection;
            var revdir      = attributes.revDirection;
            var locked      = attributes.lockRank !== null;
            var ranked      = attributes.rank > 0 && attributes.lockRank === null;
            var noEdit      = attributes.permissions == 0;
            var noName      = (street != null) && street.attributes.isEmpty;
            var cityID      = (street != null) && street.attributes.cityID;
            var noCity      = false;
            var countryID   = 0;
            var stateID     = 0;
            var streetName  = 0;
            if (cityID != null && W.model.cities.getObjectById(cityID) != null) {
                noCity = W.model.cities.getObjectById(cityID).attributes.isEmpty;
                countryID = W.model.cities.getObjectById(cityID).attributes.countryID;
                stateID = W.model.cities.getObjectById(cityID).attributes.stateID;
            }
            var oneWay = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
            var hasRestrictions = (attributes.restrictions.length > 0);
            var updatedBy = attributes.updatedBy;
            var roundabout = attributes.junctionID !== null;
            var hasHouseNumbers = attributes.hasHNs;
            if (attributes.level != 0) {
                var otherLevel = attributes.level;
            } else {
                var otherLevel = '';
            }
            var salt = attributes.streetIDs[0];
            var streetalt = W.model.streets.getObjectById(salt);
            if (streetalt) {
                var altname = streetalt.attributes.name;
            } else {
                var altname = '';
            }

            // get current state of the line
            var lineColor = line.getAttribute("stroke");

            // default colours
            var newColor = "#dd7700";
            var newOpacity = 0.001;
            var newDashes = "none";
            var newWidth = 6;
            var flags = Number(attributes.flags).toString(2);
            flags = flags.split('').reverse().join('');
            // Count segments w/wout speed
            if (!revuspeed && !fwduspeed) {
                if (attributes.hasClosures) {
                    numClosed++;
                }
                else {
                    numMaxSpeed++;
                }
            }
            // Recent Edits within X days, with decaying green opacity
            if (showRecent) {
                var editDays = (today.getTime() - attributes.createdOn) / 86400000;
                if (attributes.updatedOn !== null) {
                    editDays = (today.getTime() - attributes.updatedOn) / 86400000;
                }
                if (recentDays >= 0 && editDays <= recentDays) {
                    if ((updatedBy == selectedUserId) || (!specificEditor)) {
                        //var heatScale = 0.75 / recentDays;
                        //newColor = "#0f0";
                        var shade = Math.floor(editDays * 128 / recentDays);
                        newColor = "rgb(" + (0) + ", " + (255-shade) + ", " + (0) + ")";
                        newOpacity = 0.5;
                        //newOpacity = Math.min(0.999999, 1 - (editDays * heatScale));
                    }
                }
            } // Unverified Speed = Red Dashed
            if (flags != 0) {
                if (showTunnel && flags.charAt(0) === "1") { // Tunnel = Dashed Orange
                    newColor = "#f70";
                    newOpacity = 0.6;
                    newDashes = "10 10";
                }
                else if (showUnpaved && flags.charAt(4) === "1") { // Unpaved = Dashed Brown
                    newColor = "#940";
                    newOpacity = 0.6;
                    newDashes = "10 10";
                }
                else if (showHeadlights && flags.charAt(5) === "1") { // Headlights = Dashed Blue
                    newColor = "#0ff";
                    newOpacity = 0.6;
                    newDashes = "10 10";
                }
                else if (showNearbyHOV && flags.charAt(7) === "1") { // NearbyHOV = Dashed Brown
                    newColor = "#82f";
                    newOpacity = 0.6;
                    newDashes = "10 10";
                }
            }
            if ((revuspeed || fwduspeed) && showUSpeed) {
                newColor = "#ff0000";
                newWidth = 3;
                newOpacity = 0.95;
                newDashes = "2 10";
                var BadroadType = [4,5,8,10,14,16,17,19,20,22];
                if (!roundabout && BadroadType.indexOf(roadType) == - 1) {
                    if (attributes.hasClosures) {
                        numUClosed++;
                    }
                    else {
                        numMaxUSpeed++;
                    }
                }
            }
            else if ((fwdspeed || revspeed) && showSpeed) { // Colorize Speeds
                newColor = "";
                newWidth = 6;
                newOpacity = 0.8;
                if ((fwdspeed >= 5 && fwdspeed <= 25) || (revspeed >= 5 && revspeed <= 25)) {
                    newColor = "#fc328a";
                }
                else if (fwdspeed == 30 || revspeed == 30) {
                    newColor = "#ff6232";
                }
                else if (fwdspeed == 40 || revspeed == 40) {
                    newColor = "#fc9a3c";
                } // f9805a
                else if (fwdspeed == 45 || revspeed == 45) {
                    newColor = "#fc9a3c";
                }
                else if (fwdspeed == 50 || revspeed == 50) {
                    newColor = "#ffad2d";
                }
                else if (fwdspeed == 60 || revspeed == 60) {
                    newColor = "#fffc28";
                }
                else if (fwdspeed == 70 || revspeed == 70) {
                    newColor = "#afff23";
                }
                else if (fwdspeed == 80 || revspeed == 80) {
                    newColor = "#09ff34";
                }
                else if (fwdspeed == 90 || revspeed == 90) {
                    newColor = "#14ff88";
                }
                else if (fwdspeed == 100 || revspeed == 100) {
                    newColor = "#0fffdf";
                }
                else if (fwdspeed == 110 || revspeed == 110) {
                    newColor = "#0ac2ff";
                }
                else if (fwdspeed == 130 || revspeed == 130) {
                    newColor = "#076aff";
                }
                else if (fwdspeed || revspeed) {
                    newColor = "#ff0000";
                } // Verified Speed = Large Dashed

                if (fwddir && fwdspeed && revdir && revspeed) {
                    newDashes = "5 10";
                } // 2 ways + speed
                else if ((fwddir && fwdspeed && revdir == false) || (revdir && revspeed && fwddir == false)) {
                    newDashes = "5 10";
                } // 1 Way + speed
                else {
                    newDashes = "10 20";
                }
                if (newColor == "#f00") {
                    newDashes = "10 20";
                }
            }
            else if (toll && showToll) { // Toll = Dashed blue
                newColor = "#00f";
                newOpacity = 0.5;
                newDashes = "10 10";
            }

            // No Edit = Black
            else if (noEdit && showLocked) {
                newColor = "#000";
                newOpacity = 0.75;
                newWidth = 3;
            }

            // Locked = Red
            else if (locked && showLocked) {
                newColor = "#f00";
                newWidth = 6;
                newOpacity = 0.2 * Math.min(5, attributes.lockRank);
            }

            else if (ranked && showLocked) {
                newColor = "#f00";
                newWidth = 6;
                newDashes = "2 8";
                newOpacity = 0.2 * Math.min(5, attributes.rank);
            }

            else if (hasRestrictions && showRestrictions) {
                newColor = "#909";
                newDashes = "10 10";
                newOpacity = 0.5;
            }

            // alternate names
            else if (showAltName && attributes.streetIDs.length > 0) {
                newColor = "#9C0";
                newOpacity = 0.75;
                if (noName) {
                    newDashes = "10 10";
                }
            }

            // No Speed Limits = Orange
            else if (showSpeedLimits && (plusStreets && attributes.roadType == 1 || plusRamps && attributes.roadType == 4 || attributes.roadType > 1 && attributes.roadType != 4)
                     && attributes.roadType < 8 && attributes.roadType != 5
                     && (plusStreets || attributes.junctionID == null)
                     && ((attributes.fwdDirection && (attributes.fwdMaxSpeed == null || attributes.fwdMaxSpeedUnverified)) ||
                         (attributes.revDirection && (attributes.revMaxSpeed == null || attributes.revMaxSpeedUnverified)) )) {
                newColor = "#f80";
                newOpacity = 0.8;
                newWidth = 4;
            }

            // Average Speed Cameras = Blue
            else if (showAvgSpeedCams && (attributes.fwdFlags & 1 || attributes.revFlags & 1)) {
                newColor = "#00f";
                newOpacity = 0.4;
                newWidth = 4;
            }

            // Lane guidance = Cyan
            else if (showLanes && (attributes.fwdFlags & 4 || attributes.revFlags & 4)) {
                newColor = "#0ff";
                newOpacity = 0.8;
                newWidth = 4;
            }

            // Unnamed (No Name) = Orange
            // except roundabouts and non-Streets
            else if (noName && showNoName && !roundabout && (attributes.roadType < 8 || attributes.roadType == 22)) {
                newColor = "#fb0";
                newOpacity = 0.6;
            }

            // No City = Gray
            else if (noCity && showNoCity) {
                newColor = "#888";
                newOpacity = 0.5;
            }

            // One Way = Blue
            else if (oneWay && showOneWay) {
                newColor = "#00f";
                newOpacity = 0.4;
                newWidth = 4;
            }

            // RoadShields = Dxxx/Nxxx
            else if (street && (street.attributes.name || altname) && showRoadShield) {
                var streetRS = street.attributes.name.split(' - ');
                var altRS = altname.split(' - ');
                if (/^[A|C|D|N|M|R][0-9]+[a-z]?[0-9]?/.test(streetRS[0].replace('.', '')) === true || /^[A|C|D|N|M|R][0-9]+[a-z]?[0-9]?/.test(altRS[0].replace('.', '')) === true) {
                    newColor = '#FF768C';
                    newWidth = 8;
                    newOpacity = 0.6;
                }
            }
            // Level not Ground = Pink to purple
            else if (otherLevel != 0 && showOtherLevel) {
                switch (otherLevel) {
                    case null:
                        newColor = '#ff3f3f';
                        break;
                    case 9:
                        newColor = '#FFFAFF';
                        break;
                    case 8:
                        newColor = '#FFEAFF';
                        break;
                    case 7:
                        newColor = '#FFDAFF';
                        break;
                    case 6:
                        newColor = '#FFCAFF';
                        break;
                    case 5:
                        newColor = '#FFBAFF';
                        break;
                    case 4:
                        newColor = '#FFAAFF';
                        break;
                    case 3:
                        newColor = '#FF8AFF';
                        break;
                    case 2:
                        newColor = '#FF4AFF';
                        break;
                    case 1:
                        newColor = '#FF0AFF';
                        break;
                    case - 1:
                        newColor = '#B300FF';
                        break;
                    case - 2:
                        newColor = '#8F00DF';
                        break;
                    case - 3:
                        newColor = '#64009F';
                        break;
                    case - 4:
                        newColor = '#50007F';
                        break;
                    case - 5:
                        newColor = '#34005F';
                        break;
                    default:
                        newColor = '#D300FF';
                        break;
                }
                newOpacity = 0.5;
            }
            // segment with special flags
            else if (specificRoadType && (selectedRoadType & 64) > 0) {
                // - any flags
                if (selectedRoadType == 64 && attributes.flags > 0) {
                    newColor = "#909";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
                // - tunnel
                else if (selectedRoadType == 65 && attributes.flags & 1) {
                    newColor = "#909";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
                // - tunnel and elevation
                else if (selectedRoadType == 66 && attributes.flags & 1) {
                    newColor = "teal";
                    // Railway tunnels
                    newOpacity = (attributes.roadType == 18) ? 0.4 : 0.8;

                    switch (attributes.level){
                        case -1:
                            newColor = "green";
                            break;
                        case -2:
                            newColor = "blue";
                            break;
                        case -3:
                            newColor = "purple";
                            break;
                        case -4:
                            newColor = "red";
                            break;
                        case -5:
                            newColor = "darkblue";
                            break;
                        case -6:
                            newColor = "black";
                            break;
                        case -7:
                            newColor = "darkblue";
                            newDashes = "6 10";
                            break;
                        case -8:
                            newColor = "black";
                            newDashes = "6 10";
                    }
                }
                // - unpaved
                else if (selectedRoadType == 67 && attributes.flags & 16) {
                    newColor = "#900";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
                // - headlights required
                else if (selectedRoadType == 68 && attributes.flags & 32) {
                    newColor = "#909";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
                // - beacons
                else if (selectedRoadType == 69 && attributes.flags & 64) {
                    newColor = "#909";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
                // - nearbyHOV
                else if (selectedRoadType == 70 && attributes.flags & 128) {
                    newColor = "#909";
                    newOpacity = 0.5;
                    newWidth = 4;
                }
            }

            // selected road type = purple
            else if (specificRoadType && attributes.roadType == selectedRoadType) {
                newColor = "#909";
                newOpacity = 0.5;
                newWidth = 4;
            }

            // special road types: non-drivable / non-routable
            else if (specificRoadType && selectedRoadType == 98 && nonRoutableTypes.contains(attributes.roadType)) {
                newColor = "#909";
                newOpacity = 0.5;
                newWidth = 4;
            }
            else if (specificRoadType && selectedRoadType == 99 && nonDrivableTypes.contains(attributes.roadType)) {
                newColor = "#909";
                newOpacity = 0.5;
                newWidth = 4;
            }

            // highlight roads with a routing preferrence set
            else if (showRoutingPref && attributes.routingRoadType != null) {
                switch (attributes.routingRoadType) {
                    case 1: // St
                        newColor = "#ffffeb";
                        break;
                    case 2: // PS
                        newColor = "#f0ea58";
                        break;
                    case 3: // FW
                        newColor = "#c577d2";
                        break;
                    case 6: // MH
                        newColor = "#45b8d1";
                        break;
                    case 7: // mH
                        newColor = "#69bf88";
                }
                newOpacity = 0.5;
                newWidth = 6;
            }

            // highlight roads with no house numbers (except Roundabouts, Freeways, Ramps and Walking Trails)
            else if (!hasHouseNumbers && showNoHNs && attributes.junctionID == null && attributes.roadType < 8 && (attributes.roadType < 3 || attributes.roadType > 5)) {
                newColor = "#800000";
                newOpacity = 0.5;
                newDashes = "10 10";
            }

            // highlight segments by selected user, unless already highlighted
            if (specificEditor && !showRecent) {
                if (updatedBy == selectedUserId && newColor == "#dd7700") {
                    newColor = "#00ff00";
                    newOpacity = 0.5;
                    numUserHighlighted++;
                }
                else if (selectedUserId < -1 && updatedBy != -selectedUserId && newColor == "#dd7700") {
                    newColor = "#00ff00";
                    newOpacity = 0.5;
                    numUserHighlighted++;
                }
                else if (updatedBy != selectedUserId) {
                    newColor = "#dd7700";
                    newOpacity = 0.001;
                    newDashes = "none";
                }
            }

            // highlight segments by selected City, unless already highlighted
            // if city is only on an alternate street highlight it with dashes
            if (specificCity) {
                var altCityMatch = false;
                var specificCityMatch = (cityID == selectedCityId);
                if (specificCityInvert)
                    specificCityMatch = (cityID != selectedCityId && !noCity);

                if (!specificCityMatch) {
                    // look for matching city in alternate streets
                    for (var i in attributes.streetIDs) {
                        var streetID = attributes.streetIDs[i];
                        var currentStreet = W.model.streets.getObjectById(streetID);
                        if (currentStreet == null)
                            continue;
                        var cityMatch = (currentStreet.attributes.cityID == selectedCityId);
                        if (specificCityInvert)
                            cityMatch = !cityMatch
                        if (cityMatch) {
                            altCityMatch = true;
                            break;
                        }
                    }
                }

                if (specificCityMatch && (newColor == "#dd7700" || newColor == "#888")) {
                    newColor = "#f90";
                    newOpacity = 0.75;
                    newDashes = "none";
                    numCityHighlighted++;
                } else if (altCityMatch && (newColor == "#dd7700" || newColor == "#888")) {
                    newColor = "#f90";
                    newOpacity = 0.75;
                    newDashes = "10 10";
                    newWidth = 6;
                    numCityHighlighted++;
                } else if (!specificCityMatch && !altCityMatch && !noCity) {
                    newColor = "#dd7700";
                    newOpacity = 0.001;
                    newDashes = "none";
                }
            }
            // highlight segments by selected State, unless already highlighted
            // if state is only on an alternate street highlight it with dashes

            if (specificState) {
                var altStateMatch = false;
                var specificStateMatch = (stateID == selectedStateId);
                if (specificStateInvert) {
                    specificStateMatch = (stateID != selectedStateId);
                }
                if (specificStateMatch && (newColor == "#dd7700" || newColor == "#888")) {
                    newColor = "#f90";
                    newOpacity = 0.75;
                    newDashes = "none";
                    numStateHighlighted++;
                }
                else if (!specificStateMatch && !noCity) {
                    newColor = "#dd7700";
                    newOpacity = 0.001;
                    newDashes = "none";
                }
            }
            // if colour has changed, update the line attributes
            if (lineColor != newColor) {
                line.setAttribute("stroke", newColor);
                line.setAttribute("stroke-opacity", newOpacity);
                line.setAttribute("stroke-dasharray", newDashes);
                if (newColor != "#dd7700") { //default
                    line.setAttribute("stroke-width", newWidth);
                } else {
                    line.setAttribute("stroke-width", 6);
                }
            }
        } // end of loop

        var numUserHighlightedText = getId('_numUserHighlighted');
        if (specificEditor)
            numUserHighlightedText.innerHTML = ' = ' + numUserHighlighted;
        else
            numUserHighlightedText.innerHTML = '';

        var numCityHighlightedText = getId('_numCityHighlighted');
        var numStateHighlightedText = getId('_numStateHighlighted');
        if (specificCity) {
            numCityHighlightedText.innerHTML = ' = ' + numCityHighlighted;
        } else {
            numCityHighlightedText.innerHTML = '';
        }
        if (specificState) {
            numStateHighlightedText.innerHTML = ' = ' + numStateHighlighted;
        } else {
            numStateHighlightedText.innerHTML = '';
        }
        numMaxSpeedText = getId('_numMaxSpeed');
        numMaxSpeedText.innerHTML = ' = <b>' + numMaxSpeed + '</b> verified';
        numClosedText = getId('_numClosed');
        numClosedText.innerHTML = ' = <b>' + numClosed + '</b>';
        numMaxUSpeedText = getId('_numMaxUSpeed');
        numMaxUSpeedText.innerHTML = ' = <b>' + numMaxUSpeed + '</b>';
        numUClosedText = getId('_numUClosed');
        numUClosedText.innerHTML = ' = <b>' + numUClosed + '</b>';
        getId('_numTotalSeg').innerHTML = '<b>' + numTotalSeg + '</b>';
    } // end of function

    function highlightMapComments(event) {
        if (!wmechinit) {
            return;
        }
        if (typeof W.model.mapComments == "undefined") {
            return;
        }
        if (W.model.active == false) {
            return;
        }
        if (getId('_cbHighlightMapComments').checked === true) {
            for (var mark in W.model.mapComments.objects) {
                var mapComments = W.model.mapComments.getObjectById(mark);
                var poly = getId(getGeoIdFromFeatures(mark, W.map.commentLayer));
                if (poly == null || poly.getAttribute("stroke-opacity") == 0.5 || mark.state == "Update" || mapComments.selected) {
                    continue;
                }
                poly.setAttribute("stroke-opacity", 0.5);
                poly.setAttribute("stroke", "#fff53f");
                poly.setAttribute("stroke-width", 12);
                poly.setAttribute("r", 12);
            }
        } else {
            for (var mark in W.model.mapComments.objects) {
                var mapComments = W.model.mapComments.getObjectById(mark);
                var poly = getId(getGeoIdFromFeatures(mark, W.map.commentLayer));
                if (poly == null || poly.getAttribute("stroke-opacity") == 1 || mark.state == "Update" || mapComments.selected) {
                    continue;
                }
                poly.setAttribute("stroke-opacity", 1);
                poly.setAttribute("stroke", "#ffffff");
                poly.setAttribute("stroke-width", 2);
                poly.setAttribute("r", 6);
            }
        }
    }

    function getGeoIdFromFeatures(featureID, featureArray) {
        var array = featureArray.features;
        for (var i = 0; i < array.length; i++) {
            if (array[i].attributes.wazeFeature.id == featureID) {
                return array[i].geometry.id;
            }
        }
    }

    function highlightPlaces(event) {
        if (!wmechinit) return;

        if (typeof W.model.venues == "undefined") {
            return;
        }

        if (W.model.active == false) {
            return;
        }

        // refreshing, reset places to original style
        if (event && event.type && /click|change/.test(event.type)) {
            for (var mark in W.model.venues.objects) {
                var venue = W.model.venues.getObjectById(mark);
                var poly = W.userscripts.getFeatureElementByDataModel(venue);
                //alert(poly);
                if (poly !== null && poly.getAttribute("stroke-opacity") == 0.987) {
                    if (venue.isPoint()) {
                        poly.setAttribute("stroke","white");
                    } else {
                        poly.setAttribute("stroke","#ca9ace");
                        poly.setAttribute("stroke-width",2);
                        poly.setAttribute("stroke-dash-array","none");
                    }
                    poly.setAttribute("fill","#c290c6");
                    poly.setAttribute("stroke-opacity", 1)
                }
            }
        }

        // if option is disabled, stop now
        if (!getId('_cbHighlightPlaces').checked) {
            if (event && event.type && event.type == 'click') {
                getId('_cbHighlightLockedPlaces').disabled = true;
                getId('_cbHighlightIncompletePlaces').disabled = true;
            }
            return;
        } else {
            if (event && event.type && event.type == 'click') {
                getId('_cbHighlightLockedPlaces').disabled = false;
                getId('_cbHighlightIncompletePlaces').disabled = false;
            }
        }

        var showLocked = getId('_cbHighlightLockedPlaces').checked;
        var showIncomplete = getId('_cbHighlightIncompletePlaces').checked;
        var specificCity = getId('_cbHighlightCity').checked;
        var specificCityInvert = getId('_cbHighlightCityInvert').checked;
        var specificState = getId('_cbHighlightState').checked;
        var specificStateInvert = getId('_cbHighlightStateInvert').checked;
        var showRecent = getId('_cbHighlightRecent').checked;

        if (specificCity) {
            var selectCity = getId('_selectCity');
            if (selectCity.selectedIndex >= 0) {
                var selectedCityId = selectCity.options[selectCity.selectedIndex].value;
            } else
                specificCity = false;
        }
        if (specificState) {
            var selectState = getId('_selectState');
            if (selectState.selectedIndex >= 0) {
                selectedStateId = selectState.options[selectState.selectedIndex].value;
            } else
                specificState = false;
        }
        var specificEditor = getId('_cbHighlightEditor').checked;

        if (specificEditor) {
            var selectEditor = getId('_selectUser');
            var selectedEditorId = 0;
            if (selectEditor.selectedIndex >= 0) {
                selectedEditorId = selectEditor.options[selectEditor.selectedIndex].value;
            } else
                specificEditor = false;
        }

        if (showRecent) {
            var recentDays = getId('_numRecentDays').value;
            if (recentDays === undefined) recentDays = 0;
            if (recentDays == 0) showRecent = false;
        }

        var updates = 0;
        for (mark in W.model.venues.objects) {
            venue = W.model.venues.getObjectById(mark);
            poly = W.userscripts.getFeatureElementByDataModel(venue);
            // check that WME hasn't highlighted this object already
            if (poly == null || mark.state == "Update" || venue.selected) {
                continue;
            }

            // if highlighted by mouse over, skip this one
            if (poly.getAttribute("fill") == poly.getAttribute("stroke")) {
                continue;
            }

            // if already highlighted by us, skip
            if (poly.getAttribute("stroke-opacity") == 0.987) {
                continue;
            }

            // flag this venue as highlighted so we don't update it next time
            poly.setAttribute("stroke-opacity", 0.987);
            updates++;

            var categories = venue.attributes.categories;

            if (showIncomplete) {
                venueStreet = W.model.streets.getObjectById(venue.attributes.streetID);
                var incomplete = false;
                var colorhilite = false;

                // check for missing venue name
                if (venue.attributes.name == null || venue.attributes.name == "") {
                    incomplete = !venue.attributes.residential;
                    colorhilite = true;
                }

                // check for missing street name
                if (venueStreet == null || venueStreet.name == null || venueStreet.name == "") {
                    incomplete = true;
                    colorhilite = true;
                }

                // check for missing house number
                else if (venue.attributes.residential && venue.attributes.houseNumber == null) {
                    incomplete = true;
                    colorhilite = true;
                }

                // check for category group used as category
                else if (categories.length == 0
                         || categories.indexOf("CAR_SERVICES") > -1
                         || categories.indexOf("TRANSPORTATION") > -1
                         || categories.indexOf("PROFESSIONAL_AND_PUBLIC") > -1
                         || categories.indexOf("SHOPPING_AND_SERVICES") > -1
                         || categories.indexOf("FOOD_AND_DRINK") > -1
                         || categories.indexOf("CULTURE_AND_ENTERTAINMENT") > -1
                         || categories.indexOf("OTHER") > -1
                         || categories.indexOf("LODGING") > -1
                         || categories.indexOf("OUTDOORS") > -1
                         || categories.indexOf("NATURAL_FEATURES") > -1) {
                    incomplete = (venue.attributes.lockRank == 0);
                }

                else if (typeof venue.attributes.externalProviderIDs === 'undefined' || venue.attributes.externalProviderIDs.length === 0) {
                    incomplete = true;
                }

                if (incomplete &&
                    (categories.indexOf("JUNCTION_INTERCHANGE") >  -1
                     || categories.indexOf("CANAL") > -1
                     || categories.indexOf("RIVER_STREAM") > -1
                     || categories.indexOf("SEA_LAKE_POOL") > -1
                     || categories.indexOf("PARK") > -1
                     || categories.indexOf("SWAMP_MARSH") > -1
                     || categories.indexOf("FOREST_GROVE") > -1
                     || categories.indexOf("GOLF_COURSE") > -1) ) {
                    incomplete = false;
                    colorhilite = false;
                }

                if (incomplete) {
                    if (colorhilite) {
                        highlightAPlace(venue, "orange", "white");
                    }
                    if (venue.isPoint())
                        poly.setAttribute("stroke-dasharray", "3 3");
                    else {
                        poly.setAttribute("stroke-dasharray", "3 6");
                        poly.setAttribute("stroke-width", "3");
                    }
                }
            }

            // highlight places which have the City field set in the address = yellow
            if (specificCity) {
                if (venue.attributes.streetID === undefined) continue;
                var venueStreet = W.model.streets.getObjectById(venue.attributes.streetID);
                if (venueStreet === undefined) continue;
                var selectedCityMatch = (specificCity && venueStreet.attributes.cityID == selectedCityId);
                if (specificCityInvert) selectedCityMatch = !selectedCityMatch;

                if (selectedCityMatch) {
                    highlightAPlace(venue, "#cc0", "#ff8");
                    continue;
                }
            }

            // highlight places which have the State field set in the address = yellow
            if (specificState) {
                if (venue.attributes.streetID === undefined) continue;
                venueStreet = W.model.streets.getObjectById(venue.attributes.streetID);
                if (venueStreet === undefined) continue;
                selectedStateMatch = (specificState && W.model.cities.getObjectById(venueStreet.attributes.cityID).attributes.stateID == selectedStateId);
                if (specificStateInvert) selectedStateMatch = !selectedStateMatch;
                if (selectedStateMatch) {
                    highlightAPlace(venue, "#cc0", "#ff8");
                    continue;
                }
            }

            // highlight places which have been edited by selected editor = green
            if (specificEditor) {
                var selectedEditorMatch = false
                if (selectedEditorId >= -1) {
                    selectedEditorMatch = (selectedEditorId == venue.attributes.createdBy);
                    if (typeof venue.attributes.updatedBy != 'undefined') {
                        selectedEditorMatch = (selectedEditorId == venue.attributes.updatedBy);
                    }
                }
                else {
                    selectedEditorMatch = (selectedEditorId != -venue.attributes.createdBy);
                    if (typeof venue.attributes.updatedBy != 'undefined') {
                        selectedEditorMatch = (selectedEditorId != -venue.attributes.updatedBy);
                    }
                }

                if (selectedEditorMatch) {
                    highlightAPlace(venue, "#0f0", "#8f8");
                    continue;
                }
            }

            // highlight places that have been edited recently
            if (showRecent) {
                var today = new Date();
                var editDays = (today.getTime() - venue.attributes.createdOn) / 86400000;
                if (typeof venue.attributes.updatedOn != 'undefined') {
                    editDays = (today.getTime() - venue.attributes.updatedOn) / 86400000;
                }
                if (editDays <= recentDays) {
                    var shade = Math.floor(editDays * 128 / recentDays);
                    var colour = "rgb(" + (0) + ", " + (255-shade) + ", " + (0) + ")";
                    highlightAPlace(venue, colour, colour);
                    continue;
                }
            }

            // residential = cyan edges, like house numbers
            if (venue.attributes.residential) {
                highlightAPlace(venue, "#44afcf", "#4ac");
            }
            // construction site = brown
            else if (categories.indexOf("CONSTRUCTION_SITE") > -1) {
                highlightAPlace(venue, "#b40", "#940");
            }
            // gas station = orange
            else if (categories.indexOf("GAS_STATION") > -1) {
                highlightAPlace(venue, "#f90", "#f91");
            }

            // parking lot = cyan
            else if (categories.indexOf("PARKING_LOT") > -1) {
                var catAttribs = venue.attributes.categoryAttributes["PARKING_LOT"];
                if (catAttribs == null || catAttribs.parkingType == null) {
                    highlightAPlace(venue, "#099", "#0cc");
                    poly.setAttribute("stroke-dasharray", "3 6");
                }
                else if (catAttribs.parkingType == "PUBLIC") {
                    highlightAPlace(venue, "#090", "#0cc");
                }
                else if (catAttribs.parkingType == "RESTRICTED") {
                    highlightAPlace(venue, "#aa0", "#0cc");
                }
                else if (catAttribs.parkingType == "PRIVATE") {
                    highlightAPlace(venue, "#a50", "#0cc");
                }
            }

            // water = blue
            else if (categories.indexOf("RIVER_STREAM") > -1 || categories.indexOf("CANAL") > -1) {
                if (getId('_cbHideRivers').checked && categories.indexOf("RIVER_STREAM") > -1) {
                    poly.setAttribute("display","none");
                }  else {
                    highlightAPlace(venue, "#06c", "#09f");
                    poly.setAttribute("stroke-dasharray", "none");
                    poly.setAttribute("display","block");
                }
            }

            // sea = dark blue
            else if (categories.indexOf("SEA_LAKE_POOL") > -1 || categories.indexOf("POOL") > -1 || categories.indexOf("SWAMP_MARSH") > -1) {
                if (getId('_cbHideSeas').checked && categories.indexOf("SEA_LAKE_POOL") > -1) {
                    poly.setAttribute("display","none");
                }  else {
                    highlightAPlace(venue, "#04c", "#04f");
                    poly.setAttribute("stroke-dasharray", "none");
                    poly.setAttribute("display","block");
                }
            }

            // park/grass = green
            else if (!showRecent && !specificEditor && (
                categories.indexOf("PARK") > -1 ||
                categories.indexOf("SWAMP_MARSH") > -1 ||
                categories.indexOf("GOLF_COURSE") > -1)) {
                highlightAPlace(venue, "#0b0", "#4f4");
                poly.setAttribute("stroke-dasharray", "none");
            }

            // tree = green
            else if (!showRecent && !specificEditor && (categories.indexOf("FOREST_GROVE") > -1)) {
                if (getId('_cbHideForests').checked && categories.indexOf("FOREST_GROVE") > -1) {
                    poly.setAttribute("display","none");
                } else {
                    highlightAPlace(venue, "#0b0", "#1A561A");
                    poly.setAttribute("stroke-dasharray", "none");
                    poly.setAttribute("display","block");
                }
            }

            // island = white
            else if (!showRecent && !specificEditor && (categories.indexOf("ISLAND") > -1)) {
                if (getId('_cbHideIsland').checked && categories.indexOf("ISLAND") > -1) {
                    poly.setAttribute("display","none");
                } else {
                    highlightAPlace(venue, "#EEE", "#EEE");
                    poly.setAttribute("stroke-dasharray", "none");
                    //poly.setAttribute("stroke-opacity", "0.3");
                    poly.setAttribute("display","block");
                }
            }

            // Cemetery /other = dark gray
            else if (!showRecent && !specificEditor && (categories.indexOf("CEMETERY") > -1 || categories.indexOf("OTHER") > -1)) {
                highlightAPlace(venue, "#111", "#1A1B1F");
                poly.setAttribute("stroke-dasharray", "none");
            }
            // locked venues have red border (overrides all other options)
            if (showLocked && venue.attributes.lockRank > 0) {
                poly.setAttribute("stroke", "red");
            }
        } // for

        //if (updates > 0)
        //  getId("wmedebug").innerText = updates;
    }

    function highlightAPlace(venue, fg, bg) {
        var poly = W.userscripts.getFeatureElementByDataModel(venue);
        if (venue.isPoint()) {
            poly.setAttribute("fill", fg);
        }

        else { // area
            poly.setAttribute("stroke", fg);
            poly.setAttribute("fill", bg);
        }
    }

    // used when clicking an option that affects both Segments and Places
    function highlightSegmentsAndPlaces(event) {
        if (!wmechinit) return;

        highlightSegments(event);
        highlightPlaces(event);
    }

    function highlightNodes() {
        if (!wmechinit || W.map.getZoom() <= 3)
            return true;

        var showRestrictions = getId('_cbHighlightRestrictions').checked;

        for (var currentNode in W.model.nodes.objects){
            var node = W.model.nodes.getObjectById(currentNode);
            var nodeAttr = node.attributes;
            if (node === undefined) continue;

            var numRestrictions = 0;
            var segment1, segment2, seg1Attr, seg2Attr;

            // ignore dead-end nodes
            if (nodeAttr.segIDs.length <= 1) {
                continue;
            }

            try {
                for (var j = 0; j < nodeAttr.segIDs.length; j++){
                    segment1 = W.model.segments.getObjectById(node.attributes.segIDs[j]);
                    seg1Attr = segment1.attributes;
                    // count restictions
                    if (showRestrictions) {
                        if (nodeAttr.id == seg1Attr.fromNodeID){
                            if (seg1Attr.fromRestrictions){
                                for (var key in seg1Attr.fromRestrictions){
                                    numRestrictions++;
                               }
                            }
                        }
                        if (nodeAttr.id == seg1Attr.toNodeID){
                            if (seg1Attr.toRestrictions){
                                for (key in seg1Attr.toRestrictions){
                                    numRestrictions++;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log("error ",e);
            }

            var newColor = null;
            if (numRestrictions > 0)   newColor = "#909"; // purple

            var circle = W.userscripts.getFeatureElementByDataModel(node);
            if (newColor != null && circle != null) {
                var opacity = circle.getAttribute("fill-opacity");
                if (opacity < 0.1) {
                    circle.setAttribute("fill-opacity", 0.75);
                    circle.setAttribute("fill", newColor);
                }
            }
        }
        return true;
    }

    // add logged in user to drop-down list
    function initUserList() {
        var thisUser = W.loginManager.user;
        if (thisUser === null) return;

        var selectUser = getId('_selectUser');
        var usrOption = document.createElement('option');
        var usrRank = thisUser.attributes.rank + 1;
        var usrText = document.createTextNode(thisUser.attributes.userName + " (" + usrRank + ")");
        usrOption.setAttribute('value',thisUser.attributes.id);
        usrOption.appendChild(usrText);
        selectUser.appendChild(usrOption);
        console.info("WME Highlights: Init User list: " + thisUser.attributes.userName);
    }

    // add current city in to drop-down list
    function initCityList() {
        var thisCity = W.model.getTopCityId();
        if (thisCity === null) return;
        thisCity = W.model.cities.getObjectById(thisCity);
        if (typeof thisCity == "undefined") return;
        var thisName = thisCity.attributes.name;

        var selectCity = getId('_selectCity');
        var cityOption = document.createElement('option');
        var cityText = document.createTextNode(thisName);
        cityOption.appendChild(cityText);
        cityOption.setAttribute('value',thisCity.attributes.id);
        selectCity.appendChild(cityOption);
        console.info("WME Highlights: Init City list: " + thisName);

        // stop listening for this event
        W.model.events.unregister("mergeend", null, initCityList);
    }

    // add current state in to drop-down list
    function initStateList() {
        if(typeof(W.model.getTopState()) === 'undefined' || W.model.getTopState() === null) {
            setTimeout(initStateList, 500);
            return;
        }
        var thisState = W.model.getTopState().attributes.id;
        if (thisState === null) return;
        var thisStateName = W.model.getTopState().attributes.name;
        if (thisStateName === null) return;
        var selectState = getId("_selectState");
        var stateOption = document.createElement("option");
        stateOption.appendChild(document.createTextNode(thisStateName));
        stateOption.setAttribute("value", thisState);
        selectState.appendChild(stateOption);
        console.info("WME Highlights: Init State list: " + thisStateName);
        // stop listening for this event
        W.model.events.unregister("mergeend", null, initStateList);
    } // populate drop-down list of editors

    // populate drop-down list of editors
    function updateUserList() {
        var selectUser = getId('_selectUser');
        var numUsers = W.model.users.objects.length;
        if (numUsers === 0)
            return;

        // preserve current selection
        var currentId = null;
        if (selectUser.selectedIndex >= 0)
            currentId = selectUser.options[selectUser.selectedIndex].value;

        // collect array of users who have edited segments
        var editorIds = [];
        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (typeof segment == 'undefined')
                continue;
            var editedBy = segment.attributes.createdBy;
            if (typeof segment.attributes.updatedBy != 'undefined') {
                editedBy = segment.attributes.updatedBy;
            }
            if (editorIds.indexOf(editedBy) == -1)
                editorIds.push(editedBy);
        }
        // collect array of users who have edited places
        for (var ven in W.model.venues.objects) {
            var venue = W.model.venues.getObjectById(ven);
            if (typeof venue == 'undefined')
                continue;
            editedBy = venue.attributes.createdBy;
            if (typeof venue.attributes.updatedBy != 'undefined') {
                editedBy = venue.attributes.updatedBy;
            }
            if (editorIds.indexOf(editedBy) == -1)
                editorIds.push(editedBy);
        }
        if (editorIds.length === 0)
            return;

        // sort IDs by name
        var editorList = [];
        for (var i = 0; i < editorIds.length; i++) {
            var id = editorIds[i];
            var user = W.model.users.getObjectById(id);
            if (user === null || typeof user === "undefined" || typeof user.attributes.userName === "undefined")
                continue;
            editorList.push({ id: id, name: user.attributes.userName});
        }

        editorList.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        // reset list
        selectUser.options.length = 0;

        // add all users in field of view
        for (i = 0; i < editorList.length; i++) {
            id = editorList[i].id;
            user = W.model.users.getObjectById(id);
            if (user === null || typeof(user) === "undefined")
                continue;

            var usrOption = document.createElement('option');
            var usrRank = user.attributes.rank + 1;
            var usrText = document.createTextNode(user.attributes.userName + " (" + usrRank + ")");
            if (currentId !== null && id == currentId)
                usrOption.setAttribute('selected',true);
            usrOption.setAttribute('value',id);
            usrOption.appendChild(usrText);
            selectUser.appendChild(usrOption);
        }

        var thisUser = W.loginManager.user;
        if (thisUser !== null) {
            usrOption = document.createElement('option');
            usrText = document.createTextNode("(all except me)");
            if (currentId !== null && -thisUser.attributes.id == currentId)
                usrOption.setAttribute('selected',true);
            usrOption.setAttribute('value',-thisUser.attributes.id);
            usrOption.appendChild(usrText);
            selectUser.appendChild(usrOption);
        }
    }

    // populate drop-down list of Cities
    function updateCityList() {
        var selectCity = getId('_selectCity');
        var numCities = W.model.cities.objects.length;

        if (numCities === 0)
            return;

        // preserve current selection
        var currentId = null;
        if (selectCity.selectedIndex >= 0)
            currentId = selectCity.options[selectCity.selectedIndex].value;

        // collect array of Cities
        var cityIds = [];
        var cityObjs = [];

        //=========================================================================================
        // This new block of code checks the following assumed conditions:
        // * Every U.S. city should have an associated state
        // * Every 'No city' U.S. city should be properly numbered (not an orphan blank city)
        // * We only care about states if get.cities shows us close enough to the U.S. to matter
        // * Any non US's city state code should be 99 (None/other)
        //========================================================================================

        // collect list if unique cities from the segments
        for (var sid in W.model.streets.objects) {
            var cid = W.model.streets.getObjectById(sid).attributes.cityID;
            var city = W.model.cities.getObjectById(cid).attributes;
            if (cityIds.indexOf(cid) == -1) {
                cityIds.push(cid);
                cityObjs.push({id: city.id, name: city.name, state: city.stateID, country: city.countryID});
            }
        }

        if (cityIds.length === 0)
            return;

        // reset list
        selectCity.options.length = 0;

        // count how many (non empty) states there are here
        var numStates = 0
        for (var obj in W.model.states.objects) {
            var state = W.model.states.getObjectById(obj);
            if (state.id != 1 && state.attributes.name != "")
                numStates++;
        }

        // count how many countries there are here
        var numCountries = 0;
        for (obj in W.model.countries.objects) {
            numCountries++;
        }

        // add all cities in field of view
        cityObjs.sort(function(a,b) {return a.name.localeCompare(b.name)});
        for (var i = 0; i < cityObjs.length; i++) {
            var cityID = cityObjs[i].id;
            // "State-like CityIDs" to ignore. These are consistently over 100,000,000.
            if (cityID > 100000000) continue;
            var cityName  = cityObjs[i].name;
            var stateID   = cityObjs[i].state;
            var countryID = cityObjs[i].country;

            if (countryID == 235) {  // for U.S. only
                // 'No City' segments in the U.S. should have an assigned state.
                // This ID has a prescribed range. If not in this range, we get 'other' state pollution in map,
                // or a bogus blank city associated to the state.

                if (cityName === "") {
                    if (cityID >= 999900 && cityID <= 999999) {
                        cityName = "No City";
                    } else {
                        cityName = "EMPTY CITY";
                    }
                }
            }

            else { // for non U.S. segments
                if (cityName === "") cityName = "No City";
            }

            var stateObj = W.model.states.getObjectById(stateID);
            var countryObj = W.model.countries.getObjectById(countryID);

            // State handling. All cities should have an associated state. Throw an error if not.
            if (numStates > 0) {
                // If more than one state, we're appending it. No brainer.
                if (numStates > 1) {
                    // ... and, if one of those states is 'Other', that's an error. Report it.
                    if (stateObj.id === 99) {
                        cityName += ", " + "NO STATE";
                    }
                    // If we get here, the state ID should be fine. Append it.
                    else {
                        cityName += ", " + stateObj.attributes.name;
                    }
                }

                // If we have more than one country and are in the US, append the state for sanity.
                if (numStates == 1 && numCountries > 1) {
                    cityName += ", " + stateObj.attributes.name;
                }
            }

            // If we're on a non-US street, state should always be 99, 'Other/none'.
            // Append if this is the case. Otherwise don't add anything.
            else if (stateID != 99 && stateID > 1) {
                cityName += ", INVALID STATE";
            }

            if (numCountries > 1) {
                cityName += ", " + countryObj.attributes.name.replace('United States', 'U.S.');
            }

            // create option in select menu
            var cityOption = document.createElement('option');
            var cityText = document.createTextNode(cityName);

            if (currentId !== null && cityID == currentId)
                cityOption.setAttribute('selected',true);

            cityOption.setAttribute('value',cityID);
            cityOption.appendChild(cityText);
            selectCity.appendChild(cityOption);
        }
    }
    function updateStateList() {
        var selectState = getId("_selectState");
        var numStates = W.model.states.objects.length;
        if (numStates === 0)
            return;
        // preserve current selection
        var currentStateId = null;
        if (selectState.selectedIndex >= 0)
            currentStateId = selectState.options[selectState.selectedIndex].value;
        // collect array of States
        var stateIds = [];
        var stateObjs = [];
        // collect list if unique state
        for (var ssid in W.model.states.objects) {
            var csid = W.model.states.getObjectById(ssid).attributes.id;
            if (stateIds.indexOf(csid) == - 1) {
                stateIds.push(csid);
                stateObjs.push({id: csid, name: W.model.states.getObjectById(ssid).attributes.name, country: W.model.states.getObjectById(ssid).attributes.countryID});
            }
        }
        if (stateIds.length === 0)
            return;
        // reset list
        selectState.options.length = 0;
        // count how many countries there are here
        var numCountries = 0;
        for (var obj in W.model.countries.objects) {
            numCountries++;
        } // add all cities in field of view

        stateObjs.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        });
        for (var i = 0; i < stateObjs.length; i++) {
            var stateID = stateObjs[i].id;
            // "State-like StateIDs" to ignore. These are consistently over 100,000,000.
            if (stateID > 100000000) continue;
            var stateName = stateObjs[i].name;
            var countryID = stateObjs[i].country;
            if (numCountries > 1) {
                stateName += ', ' + W.model.countries.getObjectById(countryID).attributes.name.replace('United States', 'U.S.');
            } // create option in select menu

            var stateOption = document.createElement('option');
            if (currentStateId !== null && stateID == currentStateId)
                stateOption.setAttribute('selected', true);
            stateOption.setAttribute('value', stateID);
            stateOption.appendChild(document.createTextNode(stateName));
            selectState.appendChild(stateOption);
        }
    }
    var RoadTypes = {
        1: I18n.translations[I18n.locale].segment.road_types[1],                     // Street
        22: "- " + I18n.translations[I18n.locale].segment.road_types[22],                    // Narrow Street
        98: I18n.translations[I18n.locale].segment.categories.other_drivable,    // --------------
        108: "- " + I18n.translations[I18n.locale].segment.road_types[8],              // Off-Road / Not Maintained
        120: "- " + I18n.translations[I18n.locale].segment.road_types[20],             // Parking Lot Road
        117: "- " + I18n.translations[I18n.locale].segment.road_types[17],             // Private Road
        115: "- " + I18n.translations[I18n.locale].segment.road_types[15],             // Ferry
        199: I18n.translations[I18n.locale].segment.categories.non_drivable,    // --------------
        210: "- " + I18n.translations[I18n.locale].segment.road_types[10],             // Pedestrian Bw
        205: "- " + I18n.translations[I18n.locale].segment.road_types[5],              // Walking Trails
        216: "- " + I18n.translations[I18n.locale].segment.road_types[16],             // Stairway
        219: "- " + I18n.translations[I18n.locale].segment.road_types[19],             // Runway/Taxiway
        //  2: "Primary Street",
        //  3: "Freeways",
        //  4: "Ramps",
        //  6: "Major Highway",
        //  7: "Minor Highway",
        // 18: "Railroad",
        // 14: "Ferry',
        364: "Special Flags",    // --------------
        365: "- " + I18n.translations[I18n.locale].edit.segment.fields.tunnel,
        366: "- " + I18n.translations[I18n.locale].edit.segment.fields.tunnel
        + " / " + I18n.translations[I18n.locale].edit.segment.fields.level,
        367: "- " + I18n.translations[I18n.locale].edit.segment.fields.unpaved,
        368: "- " + I18n.translations[I18n.locale].edit.segment.fields.headlights,
        369: "- " + I18n.translations[I18n.locale].edit.segment.fields.beacons,
        370: "- " + I18n.translations[I18n.locale].edit.segment.fields.nearbyHOV.substring(0, 23)
    };

    var majorRoadTypes = new Array(2, 3, 4, 6, 7);
    var nonRoutableTypes = new Array(8, 20, 17);
    var nonDrivableTypes = new Array(5, 10, 16, 18, 19, 14);

    // populate drop-down list of editors
    function populateRoadTypes() {
        var selectRoadType = getId('_selectRoadType');

        for (var id in RoadTypes) {
            var type = RoadTypes[id]
            var usrOption = document.createElement('option');
            var usrText = document.createTextNode(type);
            if (id == 1)
                usrOption.setAttribute('selected',true);
            usrOption.setAttribute('value',id % 100);
            usrOption.appendChild(usrText);
            selectRoadType.appendChild(usrOption);
        }
    }

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
    function initialiseHighlights()
    {
        if (wmechinit) {
            return;
        }

        // init shortcuts
        if(!window.W.map)
        {
            window.console.warn("WME Color Highlights "
                                + ": waiting for WME...");
            setTimeout(initialiseHighlights, 789);
            return;
        }

        // check if sidebar is hidden
        var sidebar = getId('sidebar');
        if (sidebar.style.display == 'none') {
            console.warn("WME Highlights: not logged in yet - will initialise at login");
            W.loginManager.events.register("login", null, initialiseHighlights);
            return;
        }

        // check that user-info section is defined
        var userTabs = getId('user-info');
        if (userTabs === null) {
            console.warn("WME Highlights: editor not initialised yet - trying again in a bit...");
            setTimeout(initialiseHighlights, 789);
            return;
        }

        console.group("WME Color Highlights: " + wmech_version);

        // add new box to left of the map
        var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
        var tabContent = getElementsByClassName('tab-content', userTabs)[0];
        var addon = document.createElement('section');
        addon.id = "highlight-addon";

        // highlight segments
        var section = document.createElement('p');
        section.style.paddingTop = "0px";
        //section.style.textIndent = "16px";
        section.id = "hiliteOptions";
        section.className = 'checkbox';
        section.innerHTML = '<b>Highlight Segments</b><br>'
            + '<label title="Dotted = Automatic Locks (if available)"><input type="checkbox" id="_cbHighlightLocked" title="Locked Segments" /> Locks* (Red)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightToll" /> Toll (Dashed)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightTunnel" /> Tunnel (Orange Dashed)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightUnpaved" /> Unpaved (Brown Dashed)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightHeadlights" /> Headlights (Blue Dashed)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightNearbyHOV" /> Near by HOV (Purple Dashed)</label><br>'
            + '<label title="Dotted = No Name"><input type="checkbox" id="_cbHighlightAltName" /> Alternate Name (Lime)</label><br>'
            + '<label title="Roadshield"><input type="checkbox" id="_cbHighlightRoadShields" /> Roadshield (+ alt) (pink)</label><br>'
            + '<label title="Segments with unverified speed limits (Orange)"><input type="checkbox" id="_cbHighlightSpeedLimits" /> No Speed Limit</label>'
            + '&nbsp; <label><input type="checkbox" id="_cbHighlightPlusRampLimits" />+Ramps</label>'
            + '&nbsp; <label><input type="checkbox" id="_cbHighlightPlusStreetLimits" />+Streets</label><br>'
            + '<label title="Average Speed Camera Zone"><input type="checkbox" id="_cbHighlightAvgSpeedCams" /> Avg Speed Cams (Blue)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightUnnamed" /> No Name (Orange)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightNoCity" /> No City (Gray)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightOneWay" /> One Way (Blue)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightRestrictions" /> Time/Vehicle Restrictions (Purple)</label><br>'
            + '<label title="excluding Freeways and Ramps"><input type="checkbox" id="_cbHighlightNoHN" /> No House Numbers* (Dashed Maroon)</label><br />'
            + '<label><input type="checkbox" id="_cbHighlightOtherLevel" /> Level != 0 (Pink) Level = -1 (Purple)</label><br>'
            + '<label><input type="checkbox" id="_cbHighlightCity" /> Filter by City (Yellow)</label> &nbsp;'
            + '  <label><input type="checkbox" id="_cbHighlightCityInvert" /> invert</label><br> '
            + '  <select id="_selectCity" name="_selectCity" style="margin: 0 0 4px 20px"></select><span id="_numCityHighlighted"></span><br>'
            + '<label><input type="checkbox" id="_cbHighlightState" /> Filter by State (Yellow)</label> &nbsp;'
            + '  <label><input type="checkbox" id="_cbHighlightStateInvert" /> invert</label><br> '
            + '  <select id="_selectState" name="_selectState" style="margin: 0 0 4px 16px"></select><span id="_numStateHighlighted"></span><br>'
            + '<label><input type="checkbox" id="_cbHighlightRoadType" /> Highlight a Road Type (Purple)</label><br> '
            + '  <select id="_selectRoadType" name="_selectRoadType" style="margin: 0 0 4px 20px"></select><br>'
        ;
        addon.appendChild(section);
        // more options
        section = document.createElement('p');
        section.style.padding = '0px';
        section.style.marginBottom = '0px';
        section.id = 'SpeedOptions';
        section.innerHTML = '<b>Speed Options</b><br>'
            + '<span id="_numTotalSeg"></span> segments on screen<br>'
            + '<input type="checkbox" id="_cbHighlightSpeed" /> '
            + 'Speed <span id="_numMaxSpeed"></span> / Closed <span id="_numClosed"></span><div id="colorspeed" style="display:none;"><table style="height:20px; font-size:10px; text-align:center;"><tr>'
            + '<td style="width:6px; background-color:#f00;">&nbsp;</td>'
            + '<td style="width:36px; background-color:#fc328a;">5-25</td>'
            + '<td style="width:20px; background-color:#ff6232;">30</td>'
            + '<td style="width:20px; background-color:#f9805a;">40</td>'
            + '<td style="width:20px; background-color:#fc9a3c;">45</td>'
            + '<td style="width:20px; background-color:#ffad2d;">50</td>'
            + '<td style="width:20px; background-color:#fffc28;">60</td>'
            + '<td style="width:20px; background-color:#afff23;">70</td>'
            + '<td style="width:20px; background-color:#09ff34;">80</td>'
            + '<td style="width:20px; background-color:#14ff88;">90</td>'
            + '<td style="width:22px; background-color:#0fffdf;">100</td>'
            + '<td style="width:22px; background-color:#0ac2ff;">110</td>'
            + '<td style="width:22px; background-color:#076aff;">130</td>'
            + '<td style="width:6px; background-color:#f00;">&nbsp;</td></tr></table></div>'
            + '<input type="checkbox" id="_cbHighlightUSpeed" /> '
            + 'Unverified (Red dashed) <span id="_numMaxUSpeed"></span> / Closed <span id="_numUClosed"></span><br>'
        ;
        addon.appendChild(section);
        // advanced options
        section = document.createElement('p');
        section.style.paddingTop = "0px";
        section.className = 'checkbox';
        section.id = 'advancedOptions';
        section.innerHTML = '<b>Advanced Options</b><br>'
            + '<label><input type="checkbox" id="_cbHighlightRecent" /> Recently Edited (Green)</label><br> '
            + '  <input type="number" min="0" max="365" size="3" id="_numRecentDays"  style="margin: 0 0 4px 20px" /> days<br>'
            + '<label><input type="checkbox" id="_cbHighlightEditor" /> Filter by Editor (Green)</label><br> '
            + '  <select id="_selectUser" name="_selectUser" style="margin: 0 0 4px 20px"></select>'
            + '<span id="_numUserHighlighted"></span><br>'
            + '<label><input type="checkbox" id="_cbHighlightRoutingPref" /> Routing Preference (Cyan)</label><br>'
            + '<label title="Lane Guidance"><input type="checkbox" id="_cbHighlightLanes" /> Lane Guidance (Cyan)</label><br>'
        ;
        addon.appendChild(section);
        // highlight MapComments
        section = document.createElement('p');
        section.id = "hiliteMapComments";
        section.innerHTML = '<label><input type="checkbox" id="_cbHighlightMapComments" /> <b>Highlight MapComments</b></label><br>';
        addon.appendChild(section);
        // highlight places
        section = document.createElement('p');
        section.id = "hilitePlaces";
        section.className = 'checkbox';
        section.innerHTML = '<label title="parks/trees = green, water = blue, parking lot = cyan, everything else = pink">'
            + ' <input type="checkbox" id="_cbHighlightPlaces" /><b>Highlight Places</b>*</label>'
            + ' <span id="wmedebug" style="color: gray"></span><br>'
            + '<label><input type="checkbox" id="_cbHighlightLockedPlaces" /> Locked Places (Red)</label><br>'
            + '<label title="If blank name or street, or wrong category"><input type="checkbox" id="_cbHighlightIncompletePlaces" /> '
            +    'Incomplete Places (Dashed Orange)</label><br>'
        ;
        addon.appendChild(section);

        // hide places
        section = document.createElement('p');
        section.style.paddingTop = "0px";
        section.className = 'checkbox';
        section.id = "hideLandmarks";
        section.innerHTML  = '<b>Hide Landmarks</b><br>'
            + '<label><input type="checkbox" id="_cbHideForests" /> '+I18n.translations[I18n.locale].venues.categories.FOREST_GROVE+'</label><br>'
            + '<label><input type="checkbox" id="_cbHideSeas" /> '+I18n.translations[I18n.locale].venues.categories.SEA_LAKE_POOL+'</label><br>'
            + '<label><input type="checkbox" id="_cbHideRivers" /> '+I18n.translations[I18n.locale].venues.categories.RIVER_STREAM+'</label><br>'
            + '<label><input type="checkbox" id="_cbHideIsland" /> '+I18n.translations[I18n.locale].venues.categories.ISLAND+'</label><br>';
        addon.appendChild(section);

        if (/Chrome/.test(navigator.userAgent)) {
            addon.innerHTML  += '<b><a href="https://chrome.google.com/webstore/detail/wme-color-highlights/ijnldkoicbhinlgnoigchihmegdjobjc" target="_blank"><u>'
                + 'WME Color Highlights</u></a></b> &nbsp; v' + wmech_version;
        } else {
            addon.innerHTML  += '<b><a href="https://greasyfork.org/scripts/3206-wme-color-highlights" target="_blank"><u>'
                + 'WME Color Highlights</u></a></b> &nbsp; v' + wmech_version;
            + ' <a href="https://greasyfork.org/scripts/3206-wme-color-highlights" target="_blank">'
                + '<img src="http://waze.cryosphere.co.uk/scripts/update.php?version=' + wmech_version + '" /></a>';
        }

        var newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#sidepanel-highlights" data-toggle="tab"><span class="fa fa-tint" title="Highlight"></span></a>';
        navTabs.appendChild(newtab);

        addon.id = "sidepanel-highlights";
        addon.className = "tab-pane";
        tabContent.appendChild(addon);

        // initialise drop-downs
        initUserList();
        initCityList();
        populateRoadTypes();

        // setup onclick handlers for instant update:
        getId('_cbHighlightLocked').onclick = highlightSegments;
        getId('_cbHighlightToll').onclick = highlightSegments;
        getId('_cbHighlightTunnel').onclick = highlightSegments;
        getId('_cbHighlightUnpaved').onclick = highlightSegments;
        getId('_cbHighlightHeadlights').onclick = highlightSegments;
        getId('_cbHighlightNearbyHOV').onclick = highlightSegments;
        getId('_cbHighlightSpeed').onclick = (function () {
            if (getId('_cbHighlightSpeed').checked) {
                getId('colorspeed').style.display = 'block';
            }
            else {
                getId('colorspeed').style.display = 'none';
            }
            highlightSegments;
        });
        getId('_cbHighlightUSpeed').onclick = highlightSegments;
        getId('_cbHighlightUnnamed').onclick = highlightSegments;
        getId('_cbHighlightNoCity').onclick = highlightSegments;
        getId('_cbHighlightOneWay').onclick = highlightSegments;
        getId('_cbHighlightRestrictions').onclick = highlightSegments;
        getId('_cbHighlightSpeedLimits').onclick = highlightSegments;
        getId('_cbHighlightPlusRampLimits').onclick = highlightSegments;
        getId('_cbHighlightPlusStreetLimits').onclick = highlightSegments;
        getId('_cbHighlightAvgSpeedCams').onclick = highlightSegments;
        getId('_cbHighlightLanes').onclick = highlightSegments;
        getId('_cbHighlightRoutingPref').onclick = highlightSegments;
        getId('_cbHighlightNoHN').onclick = highlightSegments;
        getId('_cbHighlightOtherLevel').onclick = highlightSegments;
        getId('_cbHighlightRoadShields').onclick = highlightSegments;
        getId('_cbHighlightRecent').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightEditor').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightCity').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightCityInvert').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightState').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightStateInvert').onclick = highlightSegmentsAndPlaces;
        getId('_cbHighlightRoadType').onclick = highlightSegments;

        getId('_selectUser').onfocus = updateUserList;
        getId('_selectUser').onclick = function(e) {getId('_cbHighlightEditor').checked=1; highlightSegmentsAndPlaces(e);};

        getId('_selectCity').onfocus = updateCityList;
        getId('_selectCity').onclick = function(e) {getId('_cbHighlightCity').checked=1; highlightSegmentsAndPlaces(e);};

        getId('_selectState').onfocus = updateCityList;
        getId('_selectState').onclick = function(e) {getId('_cbHighlightState').checked=1; highlightSegmentsAndPlaces(e);};

        getId('_selectRoadType').onclick = function(e) {getId('_cbHighlightRoadType').checked=1; highlightSegments(e);};

        getId('_numRecentDays').onchange = highlightSegmentsAndPlaces;
        getId('_numRecentDays').onclick = function(e) {getId('_cbHighlightRecent').checked=1; highlightSegmentsAndPlaces(e);};

        getId('_cbHighlightPlaces').onclick = highlightPlaces;
        getId('_cbHighlightLockedPlaces').onclick = highlightPlaces;
        getId('_cbHighlightIncompletePlaces').onclick = highlightPlaces;
        getId('_cbHighlightMapComments').onclick = highlightMapComments;

        getId('_cbHideForests').onclick = highlightPlaces;
        getId('_cbHideSeas').onclick = highlightPlaces;
        getId('_cbHideRivers').onclick = highlightPlaces;
        getId('_cbHideIsland').onclick = highlightPlaces;

        // restore saved settings
        if (localStorage.WMEHighlightScript) {
            //console.debug("WME Highlights: loading options");
            var options = JSON.parse(localStorage.WMEHighlightScript);

            getId('_cbHighlightLocked').checked       = (options[1] % 2 == 1);
            getId('_cbHighlightToll').checked         = options[2];
            getId('_cbHighlightUnnamed').checked      = options[3];
            getId('_cbHighlightNoCity').checked       = options[4];
            getId('_cbHighlightOneWay').checked       = options[5];
            getId('_cbHighlightCity').checked         = options[15];
            getId('_cbHighlightState').checked        = options[50];
            getId('_cbHighlightRoadType').checked     = options[16];
            getId('_selectRoadType').selectedIndex    = options[17];
            getId('_cbHighlightPlaces').checked       = options[7];
            getId('_cbHighlightRestrictions').checked = options[19];
            getId('_cbHighlightLockedPlaces').checked = options[20]; //(options[1] > 1);
            getId('_cbHighlightIncompletePlaces').checked = options[21];
            getId('_cbHighlightAltName').checked      = options[22];
            getId('_cbHighlightSpeedLimits').checked  = options[23];
            getId('_cbHighlightPlusRampLimits').checked  = options[26];
            getId('_cbHighlightPlusStreetLimits').checked  = options[24];
            getId('_cbHighlightAvgSpeedCams').checked  = options[27];
            getId('_cbHighlightNoHN').checked = options[28];
            getId('_cbHighlightOtherLevel').checked = options[101];
            getId('_cbHighlightRoadShields').checked = options[102];
            getId('_cbHighlightTunnel').checked = options[103];
            getId('_cbHighlightUnpaved').checked = options[104];
            getId('_cbHighlightHeadlights').checked = options[108];
            getId('_cbHighlightNearbyHOV').checked = options[109];
            getId('_cbHighlightMapComments').checked = options[105];
            getId('_cbHighlightSpeed').checked = options[106];
            getId('_cbHighlightUSpeed').checked = options[107];
            //hide Landmarks
            getId('_cbHideForests').checked = options[110];
            getId('_cbHideSeas').checked = options[111];
            getId('_cbHideRivers').checked = options[112];
            getId('_cbHideIsland').checked = options[113];

            if (options[12] === undefined) options[12] = 7;
            getId('_cbHighlightRecent').checked   = options[11];
            getId('_numRecentDays').value         = options[12];
            getId('_cbHighlightEditor').checked   = options[13];
            getId('_cbHighlightRoutingPref').checked  = options[25];
        } else {
            getId('_cbHighlightPlaces').checked = true;
        }

        if (typeof W.model.venues == "undefined") {
            getId('_cbHighlightPlaces').checked = false;
            getId('_cbHighlightPlaces').disabled = true;
        }

        if (!getId('_cbHighlightPlaces').checked) {
            getId('_cbHighlightLockedPlaces').disabled = true;
            getId('_cbHighlightIncompletePlaces').disabled = true;
        }
        if (getId('_cbHighlightSpeed').checked) {
            getId('colorspeed').style.display = 'block';
        } else {
            getId('colorspeed').style.display = 'none';
        }

        // overload the WME exit function
        var saveHighlightOptions = function() {
            if (localStorage) {
                //console.debug("WME Highlights: saving options");
                var options = [];

                // preserve previous options which may get lost after logout
                if (localStorage.WMEHighlightScript)
                    options = JSON.parse(localStorage.WMEHighlightScript);

                options[1] = 1 * getId('_cbHighlightLocked').checked + 2 * getId('_cbHighlightLockedPlaces').checked;
                options[2] = getId('_cbHighlightToll').checked;
                options[3] = getId('_cbHighlightUnnamed').checked;
                options[4] = getId('_cbHighlightNoCity').checked;
                options[5] = getId('_cbHighlightOneWay').checked;
                options[7] = getId('_cbHighlightPlaces').checked;
                options[15] = getId('_cbHighlightCity').checked;
                options[16] = getId('_cbHighlightRoadType').checked;
                options[17] = getId('_selectRoadType').selectedIndex;
                options[19] = getId('_cbHighlightRestrictions').checked;
                options[20] = getId('_cbHighlightLockedPlaces').checked;
                options[21] = getId('_cbHighlightIncompletePlaces').checked;
                options[22] = getId('_cbHighlightAltName').checked;
                options[23] = getId('_cbHighlightSpeedLimits').checked;
                options[24] = getId('_cbHighlightPlusStreetLimits').checked;
                options[26] = getId('_cbHighlightPlusRampLimits').checked;
                options[27] = getId('_cbHighlightAvgSpeedCams').checked;
                options[28] = getId('_cbHighlightNoHN').checked;
                options[29] = getId('_cbHighlightLanes').checked;
                options[50] = getId('_cbHighlightState').checked;
                options[101] = getId('_cbHighlightOtherLevel').checked;
                options[102] = getId('_cbHighlightRoadShields').checked;
                options[103] = getId('_cbHighlightTunnel').checked;
                options[104] = getId('_cbHighlightUnpaved').checked;
                options[105] = getId('_cbHighlightMapComments').checked;
                options[106] = getId('_cbHighlightSpeed').checked;
                options[107] = getId('_cbHighlightUSpeed').checked;
                options[108] = getId('_cbHighlightHeadlights').checked;
                options[109] = getId('_cbHighlightNearbyHOV').checked;
                // advanced
                options[11] = getId('_cbHighlightRecent').checked;
                options[12] = getId('_numRecentDays').value;
                options[13] = getId('_cbHighlightEditor').checked;
                options[25] = getId('_cbHighlightRoutingPref').checked;
                //hide Landmarks
                options[110] = getId('_cbHideForests').checked;
                options[111] = getId('_cbHideSeas').checked;
                options[112] = getId('_cbHideRivers').checked;
                options[113] = getId('_cbHideIsland').checked;

                localStorage.WMEHighlightScript = JSON.stringify(options);
            }
        }
        window.addEventListener("beforeunload", saveHighlightOptions, false);

        // begin periodic updates
        window.setInterval(highlightSegments,333);
        window.setInterval(highlightNodes,444);
        window.setInterval(highlightPlaces,500);

        // trigger code when page is fully loaded, to catch any missing bits
        window.addEventListener("load", function(e) {
            var mapProblems = getId('map-problems-explanation')
            if (mapProblems !== null) mapProblems.style.display = "none";
        });

        // register some events...
        W.map.events.register("zoomend", null, highlightSegments);
        W.map.events.register("zoomend", null, highlightNodes);
        W.map.events.register("zoomend", null, highlightPlaces);
        W.map.events.register("zoomend", null, highlightMapComments);
        W.model.events.register("mergeend", null, initCityList);
        W.model.events.register("mergeend", null, initStateList);

        wmechinit = true;
        console.groupEnd();
    }

    /* engage! =================================================================== */
    setTimeout(initialiseHighlights, 789);

})();
/* end ======================================================================= */