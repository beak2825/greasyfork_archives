// ==UserScript==
// @name                WME Color Highlights SE Region FL
// @namespace           http://userscripts.org/users/
// @description         Adds colours to road segments to show their status
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             1.98 SE0.02
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/12278/WME%20Color%20Highlights%20SE%20Region%20FL.user.js
// @updateURL https://update.greasyfork.org/scripts/12278/WME%20Color%20Highlights%20SE%20Region%20FL.meta.js
// ==/UserScript==

(function()
 {

     // global variables
     var wmech_version = "1.98 SE0.02"

     var advancedMode = false;
     var betaMode = /editor-beta.waze.com/.test(location.hostname);
     var lastSelected = null;
     var lastModified = false;
     var selectedLines = [];
     var wmechinit = false;

     // set of 'bad names' to flag on UK roads only
     // if editing for another country, search for 234
     var badNames = [
         ' (Av|Avenue)$',
         ' Ch$',                    // chase
         ' (Crt|Court|Close|Cls)$',
         ' (Cres|Crescent|Crs)$',
         ' (Drv|Drive)$',
         ' (Gardens?|Grdns?)$',     // optional s
         ' (Grn|Green|Grove)$',
         ' (Grv|Grove|Place)$',
         ' (Lane|Road|Street)$',
         ' (Te|Tce|Terr|Terrace)$',
         ' (Wk|Wy)$',               // Walk|Way

         '[.]$',                    // anything ending in .
         '^[a-z]+| [a-z]{3}',       // missing capitals
         ' By-[Pp]ass',             // Bypass
         '^([AB]\\d+ - )?St ',      // Saint (St.)
         '^[AB]\\d+ : ',            // Colon instead of dash
         '^[AB]\\d+(  |-| -?[A-Za-z])', // double or missing space, or missing hyphen
         ' \\([AB]\\d+\\)$'         // ending in (A123)
     ];
     var reBadNames = new RegExp(badNames.join('|'), '');

     var goodNames = [
         '^([AB]\\d+.* - )?The (Avenue|Boulevard|Broadway|Bypass|Circus|Close|Court|Crescent|Drive)$',
         '^([AB]\\d+.* - )?The (Gardens?|Green|Groves?|Lane|Mount|Place|Park|Ridge|Square|Street|Terrace|Valley)$'
     ];
     var reGoodNames = new RegExp(goodNames.join('|'), '');


     /* =========================================================================== */
     function highlightSegments(event) {
         var showLocked = getId('_cbHighlightLocked').checked;
         var showToll   = getId('_cbHighlightToll').checked;
         var showNoCity = getId('_cbHighlightNoCity').checked;
         var showAltName = getId('_cbHighlightAltName').checked;
         var showNoName = getId('_cbHighlightUnnamed').checked;
         var showOneWay = getId('_cbHighlightOneWay').checked;
         var showNoDirection = getId('_cbHighlightNoDirection').checked;
         var showRestrictions = getId('_cbHighlightRestrictions').checked;
         var specificCity = getId('_cbHighlightCity').checked;
         var specificCityInvert = getId('_cbHighlightCityInvert').checked;
         var specificRoadType = getId('_cbHighlightRoadType').checked;
         var showNoTerm = getId('_cbHighlightNoTerm').checked;

         var showRecent = advancedMode ? getId('_cbHighlightRecent').checked : false;
         var specificEditor = advancedMode ? getId('_cbHighlightEditor').checked : false;

         // master switch when all options are off
         if (event && event.type && event.type == 'click') {
             if ( (showLocked | showToll | showNoCity | showNoName | showOneWay | showNoDirection | showRestrictions
                   | specificCity | specificEditor | specificRoadType | showNoTerm | showRecent) == false) {
                 for (var seg in Waze.model.segments.objects) {
                     var segment = Waze.model.segments.get(seg);
                     var line = getId(segment.geometry.id);

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

         var showPlaces = getId('_cbHighlightPlaces').checked;

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

         if (specificRoadType) {
             var selectRoadType = getId('_selectRoadType');
             if (selectRoadType.selectedIndex >= 0)
                 selectedRoadType = selectRoadType.options[selectRoadType.selectedIndex].value;
             else
                 specificRoadType = false;
         }

         if (showRecent) {
             recentDays = getId('_numRecentDays').value;
             if (recentDays === undefined) recentDays = 0;
         }

         // counters
         var numUserHighlighted = 0;
         var numCityHighlighted = 0;

         for (var seg in Waze.model.segments.objects) {
             var segment = Waze.model.segments.get(seg);
             var attributes = segment.attributes;
             var line = getId(segment.geometry.id);

             if (line === null) {
                 continue;
             }

             var sid = attributes.primaryStreetID;

             // check that WME hasn't highlighted this segment
             var opacity = line.getAttribute("stroke-opacity");
             var lineWidth = line.getAttribute("stroke-width");
             if (opacity == 1 || lineWidth == 9)
                 continue;

             // turn off highlights when roads are no longer visible
             var roadType = attributes.roadType;
             if (Waze.map.zoom <= 3 && (roadType < 2 || roadType > 7) ) {
                 if (opacity > 0.1) {
                     line.setAttribute("stroke","#dd7700");
                     line.setAttribute("stroke-opacity",0.001);
                     line.setAttribute("stroke-dasharray", "none");
                 }
                 continue;
             }

             // highlight all newly paved roads (or roads without any nodes)
             if (sid === null || (attributes.toNodeID === null && attributes.fromNodeID === null && roadType < 9)) {
                 if (opacity < 0.1) {
                     line.setAttribute("stroke","#f00");
                     line.setAttribute("stroke-opacity",0.75);
                     line.setAttribute("stroke-width", 10);
                 }
                 continue;
             }
             var street = Waze.model.streets.get(sid);

             // get attributes for this segment
             var toll        = attributes.fwdToll;
             var locked      = attributes.lockRank !== null;
             var ranked      = attributes.rank > 0 && attributes.lockRank === null;
             var noEdit      = attributes.permissions == 0;
             var noName      = (street != null) && street.isEmpty;
             var badName     = !noName && reBadNames.test(street.name) && !reGoodNames.test(street.name);
             var cityID      = (street != null) && street.cityID;
             var noCity      = false;
             var countryID   = 0;
             if (cityID != null && Waze.model.cities.get(cityID) != null) {
                 noCity = Waze.model.cities.get(cityID).isEmpty;
                 countryID = Waze.model.cities.get(cityID).countryID;
             }
             var oneWay      = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
             var noDirection = (!attributes.fwdDirection && !attributes.revDirection); // Could use the .attribute.allowNoDirection?
             var hasRestrictions = (attributes.fwdRestrictions.length + attributes.revRestrictions.length > 0);
             var updatedBy   = attributes.updatedBy;
             var roundabout  = attributes.junctionID !== null;

             // get current state of the line
             var lineColor = line.getAttribute("stroke");

             // default colours
             var newColor = "#dd7700";
             var newOpacity = 0.001;
             var newDashes = "none";
             var newWidth = 8;

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
             }

             // Toll = Dashed
             else if (toll && showToll) {
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

             // bad roundabouts = Lime
             //else if (roundabout && (!oneWay || !noName) && showNoTerm) {
             //  newColor = "#BE0";
             //  newOpacity = 0.5;
             //}

             // alternate names
             else if (showAltName && attributes.streetIDs.length > 0) {
                 newColor = "#9C0";
                 newOpacity = 0.75;
                 if (noName) {
                     newDashes = "10 10";
                 }
             }

             // Unnamed (No Name) = Orange
             // except roundabouts and non-Streets
             else if (noName && showNoName && !roundabout && attributes.roadType < 8) {
                 newColor = "#fb0";
                 newOpacity = 0.5;
             }

             // bad names (UK only) = Orange dashed
             else if ((badName || !noName && roundabout) && showNoName && countryID == 234 && attributes.roadType != 4) {
                 newColor = "#fb0";
                 newOpacity = 0.5;
                 newDashes = "10 10";
                 newWidth = 6;
             }

             // No City = Gray
             else if (noCity && showNoCity) {
                 newColor = "#888";
                 newOpacity = 0.5;
             }

             // No Direction = Cyan
             else if (noDirection && showNoDirection) {
                 newColor = "#0ff";
                 newOpacity = 0.3;
             }

             // One Way = Blue
             else if (oneWay && showOneWay) {
                 newColor = "#00f";
                 newOpacity = 0.2;
             }

             // Unterminated segments: no end node or not connected = Lime
             else if (showNoTerm && (attributes.toNodeID === null || attributes.fromNodeID === null || attributes.toNodeID === attributes.fromNodeID) && attributes.length > 10) {
                 newColor = "#BE0";
                 newOpacity = 0.5;
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


             // highlight segments by selected user, unless already highlighted
             if (specificEditor && !showRecent) {
                 if (updatedBy == selectedUserId && newColor == "#dd7700") {
                     newColor = "#00ff00";
                     newOpacity = 0.5;
                     numUserHighlighted++;
                 } else if (updatedBy != selectedUserId) {
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
                         var currentStreet = Waze.model.streets.get(streetID);
                         if (currentStreet == null)
                             continue;
                         var cityMatch = (currentStreet.cityID == selectedCityId);
                         if (specificCityInvert)
                             cityMatch = !cityMatch
                             if (cityMatch) {
                                 altCityMatch = true;
                                 break;
                             }
                     }
                 }

                 if (specificCityMatch && (newColor == "#dd7700" || newColor == "#888")) {
                     newColor = "#ff0";
                     newOpacity = 0.75;
                     newDashes = "none";
                     numCityHighlighted++;
                 } else if (altCityMatch && (newColor == "#dd7700" || newColor == "#888")) {
                     newColor = "#ffff01";
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

             // highlight railroads (as Places)
             if (showPlaces && attributes.roadType == 18) {
                 newColor = "#444";
                 newOpacity = 0.8;
                 newDashes = "4 12";
                 newWidth = 3;
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

         numUserHighlightedText = getId('_numUserHighlighted');
         if (specificEditor)
             numUserHighlightedText.innerHTML = ' = ' + numUserHighlighted;
         else
             numUserHighlightedText.innerHTML = '';

         numCityHighlightedText = getId('_numCityHighlighted');
         if (specificCity)
             numCityHighlightedText.innerHTML = ' = ' + numCityHighlighted;
         else
             numCityHighlightedText.innerHTML = '';
     } // end of function

     function highlightPlaces(event) {
         if (typeof Waze.model.venues == "undefined") {
             return;
         }

         if (Waze.model.active == false) {
             return;
         }

         // refreshing, reset places to original style
         if (event && event.type && /click|change/.test(event.type)) {
             for (var mark in Waze.model.venues.objects) {
                 var venue = Waze.model.venues.get(mark);
                 var poly = getId(venue.geometry.id);
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
                 getId('_cbHighlightLockedPlacesHi').disabled = true;
                 getId('_cbHighlightIncompletePlaces').disabled = true;
             }
             return;
         } else {
             if (event && event.type && event.type == 'click') {
                 getId('_cbHighlightLockedPlaces').disabled = false;
                 getId('_cbHighlightLockedPlacesHi').disabled = false;
                 getId('_cbHighlightIncompletePlaces').disabled = false;
             }
         }

         var showLocked = getId('_cbHighlightLockedPlaces').checked;
         var showLockedHi = getId('_cbHighlightLockedPlacesHi').checked;
         var showIncomplete = getId('_cbHighlightIncompletePlaces').checked;
         var specificCity = getId('_cbHighlightCity').checked;
         var specificCityInvert = getId('_cbHighlightCityInvert').checked;
         var showRecent = advancedMode ? getId('_cbHighlightRecent').checked : false;

         if (specificCity) {
             var selectCity = getId('_selectCity');
             if (selectCity.selectedIndex >= 0) {
                 selectedCityId = selectCity.options[selectCity.selectedIndex].value;
             } else
                 specificCity = false;
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
             recentDays = getId('_numRecentDays').value;
             if (recentDays === undefined) recentDays = 0;
             if (recentDays == 0) showRecent = false;
         }

         var updates = 0;
         for (var mark in Waze.model.venues.objects) {
             var venue = Waze.model.venues.get(mark);
             var poly = getId(venue.geometry.id);

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

             var categories   = venue.attributes.categories;

             if (showIncomplete) {
                 venueStreet = Waze.model.streets.get(venue.attributes.streetID);
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
                 else if (venue.attributes.houseNumber == null) {
                     incomplete = true;
                     colorhilite = true;
                 }

                 // check for category group used as category
                 else if (categories.length == 0
                          || categories.indexOf("CAR_SERVICES") > -1
                          || categories.indexOf("TRANSPORTATION") > -1
                          || categories.indexOf("PROFESSIONAL_AND_PUBLIC") > -1
                          //                        || categories.indexOf("SHOPPING_AND_SERVICES") > -1
                          || categories.indexOf("FOOD_AND_DRINK") > -1
                          || categories.indexOf("CULTURE_AND_ENTERTAINMENT") > -1
                          || categories.indexOf("OTHER") > -1
                          || categories.indexOf("LODGING") > -1
                          || categories.indexOf("OUTDOORS") > -1
                          || categories.indexOf("NATURAL_FEATURES") > -1) {
                     incomplete = (venue.attributes.lockRank == 0);
                 }

                 //                 if (incomplete && 
                 //                     (categories.indexOf("RIVER_STREAM") > -1
                 //                      || categories.indexOf("SEA_LAKE_POOL") > -1
                 //                      || categories.indexOf("PARK") > -1
                 //                      || categories.indexOf("FARM") > -1
                 //                      || categories.indexOf("FOREST_GROVE") > -1
                 //                      || categories.indexOf("GOLF_COURSE") > -1) ) {
                 //                     incomplete = false;
                 //                     colorhilite = false;
                 //                 }

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
                 venueStreet = Waze.model.streets.get(venue.attributes.streetID);
                 selectedCityMatch = (specificCity && venueStreet.cityID == selectedCityId);
                 if (specificCityInvert) selectedCityMatch = !selectedCityMatch;

                 if (selectedCityMatch) {
                     highlightAPlace(venue, "#cc0", "#ff8");
                     continue;
                 }
             }

             // highlight places which have been edited by selected editor = green
             if (specificEditor) {
                 var selectedEditorMatch = (selectedEditorId == venue.attributes.updatedBy);
                 if (typeof venue.attributes.updatedBy == 'undefined') {
                     selectedEditorMatch = (selectedEditorId == venue.attributes.createdBy);
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
                 highlightAPlace(venue, "#44afcf", "4ac");
             }

             // gas station = orange
             else if (categories.indexOf("GAS_STATION") > -1) {
                 highlightAPlace(venue, "#f90", "#f91");
             }

             // parking lot = cyan
             else if (categories.indexOf("PARKING_LOT") > -1) {
                 highlightAPlace(venue, "#099", "#0cc");
             }

             // water = blue
             else if (categories.indexOf("RIVER_STREAM") > -1 ||
                      categories.indexOf("SEA_LAKE_POOL") > -1) {
                 highlightAPlace(venue, "#06c", "#09f");
                 poly.setAttribute("stroke-dasharray", "none");
             }

             // park/grass/trees = green
             else if (!showRecent && !specificEditor && (
                 categories.indexOf("PARK") > -1 ||
                 categories.indexOf("FARM") > -1 ||
                 categories.indexOf("FOREST_GROVE") > -1 ||
                 categories.indexOf("GOLF_COURSE") > -1) ) {
                 highlightAPlace(venue, "#0b0", "#4f4");
                 //  poly.setAttribute("stroke-dasharray", "none");
             }

             // SE unmapped = Black
             if (venue.attributes.lockRank < 2 && 
                 (categories.indexOf("JUNCTION_INTERCHANGE") > -1 ||
                 categories.indexOf("TRANSPORTATION") > -1 ||
                 categories.indexOf("BEACH") > -1 ||
                 categories.indexOf("CANAL") > -1 ||
                 categories.indexOf("RIVER_STREAM") > -1 ||
                 categories.indexOf("SEA_LAKE_POOL") > -1 ||
                 categories.indexOf("ISLAND") > -1)
                ) {
                 poly.setAttribute("fill", "black");
             }

             // locked venues have red border (overrides all other options)

             if (showLocked && venue.attributes.lockRank > 3 && (categories.indexOf("HOSPITAL_MEDICAL_CARE") > -1 ||
                                                                 categories.indexOf("COLLEGE_UNIVERSITY") > -1 ||
                                                                 categories.indexOf("STADIUM_ARENA") > -1 ||
                                                                 categories.indexOf("FIRE_DEPARTMENT") > -1 ||
                                                                 categories.indexOf("POLICE_STATION") > -1 ||
                                                                 categories.indexOf("PARK") > -1 ||
                                                                 categories.indexOf("SCHOOL") > -1 ||
                                                                 categories.indexOf("AIRPORT") > -1) ) {
                 poly.setAttribute("stroke", "red");
             }

             else if (showLocked && venue.attributes.lockRank > 1 && !(categories.indexOf("HOSPITAL_MEDICAL_CARE") > -1 ||
                                                                       categories.indexOf("COLLEGE_UNIVERSITY") > -1 ||
                                                                       categories.indexOf("STADIUM_ARENA") > -1 ||
                                                                       categories.indexOf("FIRE_DEPARTMENT") > -1 ||
                                                                       categories.indexOf("POLICE_STATION") > -1 ||
                                                                       categories.indexOf("PARK") > -1 ||
                                                                       categories.indexOf("SCHOOL") > -1 ||
                                                                       categories.indexOf("AIRPORT") > -1) ) {
                 poly.setAttribute("stroke", "red");
             }


             // venues locked above editor's level have blue border (overrides all other options)

             if (showLockedHi && venue.attributes.lockRank > thisUser.normalizedLevel-1) {
                 poly.setAttribute("stroke", "blue");
             }








         } // for

         //if (updates > 0)
         //  getId("wmedebug").innerText = updates;
     }

     function highlightAPlace(venue, fg, bg) {
         var poly = getId(venue.geometry.id);
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
         highlightSegments(event);
         highlightPlaces(event);
     }


     function highlightSelectedNodes() {
         if (Waze.map.zoom <= 3 || !advancedMode)
             return true;

         var showTurns = advancedMode ? getId('_cbHighlightTurns').checked : false;

         // look for a selected node or segment (there can only be 1)
         var currentNodes = [];
         var selectType = '';
         if (Waze.selectionManager.selectedItems.length == 1){
             var selection = Waze.selectionManager.selectedItems[0].model;
             var selAttr = selection.attributes;

             if (selection !== null){
                 if (selection.state == "Update" && lastModified == false){
                     lastSelected = null;
                     lastModified = true;
                 } else if (selection.state != "Update" && lastModified == true){
                     lastSelected = null;
                     lastModified = false;
                 }
                 selectType = selection.type;
                 if (selection.type == "node"){
                     currentNodes.push(selAttr.id);
                 }else if (selection.type == "segment"){
                     if (selAttr.fromNodeID !== null)
                         currentNodes.push(selAttr.fromNodeID);
                     if (selAttr.toNodeID !== null)
                         currentNodes.push(selAttr.toNodeID);
                 }
             }
         }

         // selection changed, then reset previous highlights | selectType == 'node'
         if ((lastSelected != currentNodes[0] || !showTurns) && selectedLines.length > 0){
             for (var i = 0; i < selectedLines.length; i++){
                 line = getId(selectedLines[i]);
                 if (line !== null && line.getAttribute("stroke-width") == 8)
                     line.setAttribute("stroke-opacity", 0.0001);
             }
             selectedLines = [];
         }

         // no node selected, quit now
         if (currentNodes.length === 0){
             lastSelected = null;
             lastModified = false;
             return true;
         }

         var numSoftTurns = 0;
         var numRevConns = 0;
         var numUTurns = 0;
         var showWarning = false;


         for (var i = 0; i < currentNodes.length; i++){
             var currentNode = currentNodes[i];
             var node = Waze.model.nodes.get(currentNode);
             var nodeAttr = node.attributes;

             if (node === undefined) continue;

             // ignore dead-end nodes
             if (nodeAttr.segIDs.length <= 1){
                 lastSelected = currentNode[0];
                 continue;
             }
             var newColor = null;
             var segmentColor = [];
             var segment1, segment2, seg1Attr, seg2Attr;

             // find segments that connect to this node
             for (var j = 0; j < nodeAttr.segIDs.length; j++){
                 segment1 = Waze.model.segments.get(node.attributes.segIDs[j]);
                 seg1Attr = segment1.attributes;

                 if (segment1 === undefined)
                     continue;
                 if (nonDrivableTypes.indexOf(seg1Attr.roadType) != -1)
                     continue; // For look at all drivable road 

                 // highlight U-turns
                 if(segment1.isTurnAllowed(segment1, node)){
                     segmentColor[j] = "#0ff";
                     numUTurns++;
                 }

                 // highlight soft-turns
                 if (nodeAttr.id == seg1Attr.fromNodeID){
                     var nodeLocked = (seg1Attr.revTurnsLocked);
                 }else if (nodeAttr.id == seg1Attr.toNodeID){
                     var nodeLocked = (seg1Attr.fwdTurnsLocked);
                 }
                 if (nodeLocked === false){
                     segmentColor[j] = "#ff0";
                     numSoftTurns++;
                 }
             }
             for (var j = 0; j < nodeAttr.segIDs.length - 1; j++){
                 segment1 = Waze.model.segments.get(node.attributes.segIDs[j]);
                 seg1Attr = segment1.attributes;

                 if (nonDrivableTypes.indexOf(seg1Attr.roadType) != -1)
                     continue; // For look at all drivable road 

                 for (var k = 1; k < nodeAttr.segIDs.length; k++){
                     segment2 = Waze.model.segments.get(node.attributes.segIDs[k]);
                     seg2Attr = segment2.attributes;

                     if (nonDrivableTypes.indexOf(seg2Attr.roadType) != -1)
                         continue; // For look at all drivable road 

                     // highlight RevCons
                     /******************************************************************************************************************
|   segment1.isTurnAllowed(segment2, node):      --> Test if Turn to segment1 into segment2 at node is allowed               |
| node.isTurnAllowedBySegDirections(segment1, segment2):  --> Test if Direction of segment1 into segment2 at node   |
******************************************************************************************************************/
                     if (seg1Attr.id != seg2Attr.id){
                         if (segment1.isTurnAllowed(segment2, node) && !node.isTurnAllowedBySegDirections(segment1, segment2)){
                             segmentColor[j] = "#f0f";
                             numRevConns++;
                         }
                         if (segment2.isTurnAllowed(segment1, node) && !node.isTurnAllowedBySegDirections(segment2, segment1)){
                             segmentColor[j] = "#f0f";
                             numRevConns++;
                         }
                     }
                 }
             }
             for (var j = 0; j < nodeAttr.segIDs.length; j++){
                 var segment = Waze.model.segments.get(node.attributes.segIDs[j]);
                 var segAttr = segment.attributes;
                 var line = getId(segAttr.geometry.id);
                 if (line === null) return;

                 if (segmentColor[j]){
                     newColor = segmentColor[j];
                 } else newColor = null;

                 var oldOpacity = line.getAttribute("stroke-opacity");
                 if (newColor !== null && oldOpacity < 1 && showTurns){
                     line.setAttribute("stroke", newColor);
                     line.setAttribute("stroke-opacity", 1);
                     line.setAttribute("stroke-width", 8);
                     line.setAttribute("stroke-dasharray", "none");
                     selectedLines.push(segAttr.geometry.id);
                 }
                 if (newColor !== null) {
                     showWarning = true;
                 }
             }
         }

         if (currentNodes.length > 0){
             var currentNode = currentNodes[0];

             if (showWarning === true){
                 // setup new box for warnings about this node
                 var selectionBox;
                 if (selectType == 'segment')
                     selectionBox = getId('segment-edit-general');
                 else
                     selectionBox = getId('node-edit-general');

                 var nodeDetails = getId('nodeTipsBox');
                 if (!nodeDetails){
                     nodeDetails = document.createElement('div');
                     nodeDetails.id = 'nodeTipsBox';
                     selectionBox.appendChild(nodeDetails);
                 } else{
                     return;
                     nodeDetails.innerHTML = '';
                 }

                 if (numSoftTurns > 0){
                     nodeText = document.createElement('div');
                     if (selectType == 'node')
                         nodeText.title = "Press Q and then re-enable each allowed turn.";
                     else
                         nodeText.title = "Select individual nodes to see details.";

                     nodeText.style.padding = "4px 2px";
                     nodeText.innerHTML = "<b>Warning:</b> " + selectType + " has " + numSoftTurns + " soft turns.";
                     nodeText.style.backgroundColor = '#ffc';
                     nodeDetails.appendChild(nodeText);
                 }
                 if (numRevConns > 0){
                     nodeText = document.createElement('div');
                     if (selectType == 'node')
                         nodeText.title = "Press Q and then re-enable each allowed turn.";
                     else
                         nodeText.title = "Select individual nodes to see details.";

                     nodeText.style.padding = "4px 2px";
                     nodeText.innerHTML = "<b>Warning:</b> " + selectType + " has " + numRevConns + " reverse connections.";
                     nodeText.style.backgroundColor = '#fcf';
                     nodeDetails.appendChild(nodeText);
                 }
                 if (numUTurns > 0){
                     nodeText = document.createElement('div');
                     nodeText.title = "Use the U-Turn arrows to set when a U-Turn is allowed.";
                     nodeText.style.padding = "4px 2px";
                     nodeText.innerHTML = "<b>Notice:</b> " + selectType + " has " + numUTurns + " U-Turns.";
                     nodeText.style.backgroundColor = '#cff';
                     nodeDetails.appendChild(nodeText);
                 }

                 if (selectType == 'node'){
                     nodeText = document.createElement('div');
                     nodeText.style.padding = "4px 2px";
                     nodeText.innerHTML = '<br>';
                     if (typeof unsafeWindow.WME_JNF_Version != "undefined"){
                         nodeText.innerHTML += '<span style="float:right">[<a href="http://userscripts.org/scripts/show/144939" target="_blank">JNF '+unsafeWindow.WME_JNF_Version+'</a>]</span>';
                         if (typeof unsafeWindow.WME_JNF_FixNode == "function" || typeof unsafeWindow.WMETB_JNF_FixNode == "function"){
                             nodeText.innerHTML += '<i><a href="#" id="_autoFixLink">'
                             +  'Automatically fix node</a></i> (Q)<br>';
                         }else{
                             nodeText.innerHTML += "<i style='color: red'>JNF script not active. Upgrade!</i><br>";
                         }
                     }else{
                         nodeText.innerHTML += '<i>Hover over text above for help.</i><br>';
                     }
                     nodeText.innerHTML += '<i>For a full explanation, <a href="http://waze.cryosphere.co.uk/node-help" target="_blank">see this page</a>.</i><br>';
                     nodeDetails.appendChild(nodeText);

                     autoFixLink = getId('_autoFixLink');
                     if (autoFixLink != null){
                         var currentNodeObject = wazeModel.nodes.objects[currentNode];
                         if (typeof unsafeWindow.WME_JNF_FixNode == "function")
                         {
                             autoFixLink.onclick = function(){
                                 unsafeWindow.WME_JNF_FixNode(currentNodeObject, true);
                             };
                         }
                         else if(typeof unsafeWindow.WMETB_JNF_FixNode == "function")
                         {
                             autoFixLink.onclick = function(){
                                 unsafeWindow.WMETB_JNF_FixNode(currentNodeObject, true);
                             };
                         }
                     }
                 }
             }
         }
         lastSelected = currentNodes[0];
         return true;
     }

     function highlightBadNodes() {
         if (Waze.map.zoom <= 3 || !advancedMode)
             return true;

         var showTurns = advancedMode ? getId('_cbHighlightTurns').checked : false;
         var showRestrictions = getId('_cbHighlightRestrictions').checked;

         for (var currentNode in Waze.model.nodes.objects){
             var node = Waze.model.nodes.get(currentNode);
             var nodeAttr = node.attributes;
             if (node === undefined) continue;

             var numRestrictions = 0;
             var numSoftTurns = 0;
             var numRevConns = 0;
             var numUTurns = 0;
             var segment1, segment2, seg1Attr, seg2Attr;

             // ignore dead-end nodes
             if (nodeAttr.segIDs.length <= 1) {
                 continue;
             }

             // find segments that connect to this node
             /******************************************************************************************************************
|   highlight RevCons                                                                                             |
|                                                                                                                 |
|   segment1.isTurnAllowed(segment2, node):      --> Test if Turn to segment1 into segment2 at node is allowed    |
| node.isTurnAllowedBySegDirections(segment1, segment2):  --> Test if Direction of segment1 into segment2 at node |
******************************************************************************************************************/
             for (var j = 0; j < nodeAttr.segIDs.length - 1; j++){
                 segment1 = Waze.model.segments.get(node.attributes.segIDs[j]);
                 seg1Attr = segment1.attributes;
                 if (nonDrivableTypes.indexOf(seg1Attr.roadType) == -1)
                     continue;

                 for (var k = 1; k < nodeAttr.segIDs.length; k++){
                     segment2 = Waze.model.segments.get(node.attributes.segIDs[k]);
                     seg2Attr = segment2.attributes;
                     if (nonDrivableTypes.indexOf(seg2Attr.roadType) == -1)
                         continue; // For look at all drivable road 

                     if (seg1Attr.id != seg2Attr.id){
                         if (segment1.isTurnAllowed(segment2, node) && !node.isTurnAllowedBySegDirections(segment1, segment2)){
                             numRevConns++;
                         }
                         if (segment2.isTurnAllowed(segment1, node) && !node.isTurnAllowedBySegDirections(segment2, segment1)){
                             numRevConns++;
                         }
                     }
                 }
             }
             //******************************************************************************************************************
             for (var j = 0; j < nodeAttr.segIDs.length; j++){
                 segment1 = Waze.model.segments.get(node.attributes.segIDs[j]);
                 seg1Attr = segment1.attributes;
                 // count restictions
                 if (showRestrictions) {
                     if (nodeAttr.id == seg1Attr.fromNodeID){
                         if (seg1Attr.fromRestrictions){
                             for (key in seg1Attr.fromRestrictions){
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

                 if (majorRoadTypes.indexOf(seg1Attr.roadType) == -1)
                     continue; // For look at all drivable road 

                 // highlight U-turns
                 if(segment1.isTurnAllowed(segment1, node)){
                     numUTurns++;
                 }

                 // highlight soft-turns
                 if (nodeAttr.id == seg1Attr.fromNodeID){
                     var nodeLocked = (seg1Attr.revTurnsLocked);
                 } else if (nodeAttr.id == seg1Attr.toNodeID){
                     var nodeLocked = (seg1Attr.fwdTurnsLocked);
                 }
                 if (nodeLocked === false){
                     numSoftTurns++;
                 }
             }
             var newColor = null;
             if (numUTurns > 0)      newColor = "#0ff";
             else if (numSoftTurns > 0)   newColor = "#ff0"; // yellow
             else if (numRevConns > 0)   newColor = "#f0f";
             else if (numRestrictions > 0)   newColor = "#909";

             var circle = getId(nodeAttr.geometry.id);
             if (newColor != null && circle != null) {
                 opacity = circle.getAttribute("fill-opacity");
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
         if (!advancedMode) return;

         var thisUser = Waze.loginManager.user;
         if (thisUser === null) return;

         var selectUser = getId('_selectUser');
         var usrOption = document.createElement('option');
         var usrRank = thisUser.normalizedLevel;
         var usrText = document.createTextNode(thisUser.userName + " (" + usrRank + ")");
         usrOption.setAttribute('value',thisUser.id);
         usrOption.appendChild(usrText);
         selectUser.appendChild(usrOption);
         console.log("WME Highlights: Init User list: " + thisUser.userName);
     }

     // add current city in to drop-down list
     function initCityList() {
         var locationInfo = Waze.map.getControlsByClass('Waze.Control.LocationInfo')[0];
         if (locationInfo === null || locationInfo.location === null)
             return;

         var cityName = locationInfo.location.city;
         var thisCity = null;
         for (var city in Waze.model.cities.objects) {
             var cityObj = Waze.model.cities.get(city);
             if (cityObj.name == cityName) {
                 thisCity = cityObj.id;
                 break;
             }
         }
         if (thisCity === null)
             return;

         var selectCity = getId('_selectCity');
         var cityOption = document.createElement('option');
         var cityText = document.createTextNode(cityName);
         cityOption.appendChild(cityText);
         cityOption.setAttribute('value',thisCity);
         selectCity.appendChild(cityOption);
         console.log("WME Highlights: Init City list: " + cityName);

         // stop listening for this event
         Waze.model.events.unregister("mergeend", null, initCityList);
     }

     // populate drop-down list of editors
     function updateUserList() {
         // update list of users - for high zoom and AMs only
         if (!advancedMode)
             return;

         var selectUser = getId('_selectUser');
         var numUsers = Waze.model.users.objects.length;
         if (numUsers === 0)
             return;

         // preserve current selection
         var currentId = null;
         if (selectUser.selectedIndex >= 0)
             currentId = selectUser.options[selectUser.selectedIndex].value;

         // collect array of users who have edited segments
         var editorIds = [];
         for (var seg in Waze.model.segments.objects) {
             var segment = Waze.model.segments.get(seg);
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
         for (var ven in Waze.model.venues.objects) {
             var venue = Waze.model.venues.get(ven);
             if (typeof venue == 'undefined')
                 continue;
             var editedBy = venue.attributes.createdBy;
             if (typeof venue.attributes.updatedBy != 'undefined') {
                 editedBy = venue.attributes.updatedBy;
             }
             if (editorIds.indexOf(editedBy) == -1)
                 editorIds.push(editedBy);
         }
         editorIds.sort();

         if (editorIds.length === 0)
             return;

         // reset list
         selectUser.options.length = 0;

         // add all users in field of view
         for (var i = 0; i < editorIds.length; i++) {
             var id = editorIds[i];
             var user = Waze.model.users.get(id);
             if (user === null || typeof(user) === "undefined")
                 continue;

             var usrOption = document.createElement('option');
             var usrRank = user.normalizedLevel;
             var usrText = document.createTextNode(user.userName + " (" + usrRank + ")");
             if (currentId !== null && id == currentId)
                 usrOption.setAttribute('selected',true);
             usrOption.setAttribute('value',id);
             usrOption.appendChild(usrText);
             selectUser.appendChild(usrOption);
         }
     }

     // populate drop-down list of Cities
     function updateCityList() {
         var selectCity = getId('_selectCity');
         var numCities = Waze.model.cities.objects.length;

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
         for (var sid in Waze.model.streets.objects) {
             var cid = Waze.model.streets.get(sid).cityID;
             var city = Waze.model.cities.get(cid);
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
         for (var obj in Waze.model.states.objects) {
             state = Waze.model.states.get(obj);
             if (state.id != 1 && state.name != "")
                 numStates++;
         }

         // count how many countries there are here
         var numCountries = 0;
         for (var obj in Waze.model.countries.objects) {
             numCountries++;
         }

         // add all cities in field of view
         cityObjs.sort(function(a,b) {return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;});
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

             var stateObj = Waze.model.states.get(stateID);
             var countryObj = Waze.model.countries.get(countryID);

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
                         cityName += ", " + stateObj.name;
                     }
                 }

                 // If we have more than one country and are in the US, append the state for sanity.
                 if (numStates == 1 && numCountries > 1) {
                     cityName += ", " + stateObj.name;
                 }
             }

             // If we're on a non-US street, state should always be 99, 'Other/none'.
             // Append if this is the case. Otherwise don't add anything.
             else if (stateID != 99 && stateID > 1) {
                 cityName += ", INVALID STATE";
             }

             if (numCountries > 1) {
                 cityName += ", " + countryObj.name.replace('United States', 'U.S.');
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

     var RoadTypes = {
         1: "Streets",
         98: "Non-Routable Roads",    // --------------
         108: "- Dirt roads",
         120: "- Parking Lot Road",
         117: "- Private Road",
         114: "- Ferry",
         199: "Non-Drivable Roads",    // --------------
         210: "- Pedestrian Bw",
         205: "- Walking Trails",
         216: "- Stairway",
         219: "- Runway/Taxiway"
         //  2: "Primary Street",
         //  3: "Freeways",
         //  4: "Ramps",
         //  6: "Major Highway",
         //  7: "Minor Highway",
         // 18: "Railroad",
         // 14: "Ferry',
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

     function toggleOptions () {
         var objStyle = getId('hiliteOptions').style.display;
         if  (objStyle == "none") {
             objStyle = "block";
             getId('_btnHide').innerHTML = "hide";
         }
         else {
             objStyle = "none";
             getId('_btnHide').innerHTML = "show";
         }
         getId('hiliteOptions').style.display = objStyle;
         if (advancedMode)
             getId('advancedOptions').style.display = objStyle;
         getId('hilitePlaces').style.display = objStyle;
         return false;
     }

     // enable advanced options if user is logged in and at least an AM
     function enableAdvancedOptions()
     {
         if (advancedMode) return;

         if (typeof Waze == 'undefined')
             Waze = unsafeWindow.Waze;

         if (typeof Waze.loginManager == 'undefined')
             Waze.loginManager = unsafeWindow.Waze.loginManager;

         if (typeof Waze.loginManager == 'undefined')
             Waze.loginManager = unsafeWindow.loginManager;

         if (Waze.loginManager !== null && Waze.loginManager.isLoggedIn()) {
             thisUser = Waze.loginManager.user;
             if (thisUser !== null && (thisUser.normalizedLevel >= 3 || thisUser.isAreaManager)) {
                 Waze.loginManager.events.unregister("afterloginchanged", null, enableAdvancedOptions);
                 console.log('WME Highlights: Advanced Options enabled for ' + thisUser.userName);
                 getId('advancedOptions').style.display = 'block';
                 advancedMode = true;
                 initUserList();
                 initCityList();
             }
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
         if(!window.Waze.map)
         {
             window.console.log("WME Color Highlights "
                                + ": waiting for WME...");
             setTimeout(initialiseHighlights, 555);
             return;
         }

         // add new box to left of the map
         var addon = document.createElement('section');
         addon.id = "highlight-addon";

         // highlight segements
         var section = document.createElement('p');
         section.style.paddingTop = "0px";
         //section.style.textIndent = "16px";
         section.id = "hiliteOptions";
         section.innerHTML  = '<b>Highlight Segments</b><br>'
         + '<input type="checkbox" id="_cbHighlightLocked" title="Locked Segments" /> '
         + '<span title="Dotted = Automatic Locks (if available)">Locks*</span> (Red)<br>'
         + '<input type="checkbox" id="_cbHighlightToll" /> '
         + 'Toll (Dashed)<br>'
         + '<input type="checkbox" id="_cbHighlightAltName" /> '
         + '<span title="Dotted = No Name">Alternate Name</span> (Lime)<br>'
         + '<input type="checkbox" id="_cbHighlightUnnamed" /> '
         + 'No Name (Orange)<br>'
         + '<input type="checkbox" id="_cbHighlightNoCity" /> '
         + 'No City (Gray)<br>'
         + '<input type="checkbox" id="_cbHighlightOneWay" /> '
         + 'One Way (Blue)<br>'
         + '<input type="checkbox" id="_cbHighlightNoDirection" /> '
         + 'Unknown Direction (Cyan)<br>'
         + '<input type="checkbox" id="_cbHighlightRestrictions" /> '
         + 'Time/Vehicle Restrictions (Purple)<br>'
         + '<input type="checkbox" id="_cbHighlightNoTerm" /> '
         + '<span title="*Dead-end roads should have terminating nodes on the end, or Waze cannot route to or from them.">Unterminated Roads* (Lime)</span><br>'
         + '<input type="checkbox" id="_cbHighlightCity" /> '
         + 'Filter by City (Yellow) &nbsp;'
         + '  <input type="checkbox" id="_cbHighlightCityInvert" /> invert <br> '
         + '  <select id="_selectCity" name="_selectCity" style="margin: 0 0 4px 16px"></select>'
         + '<span id="_numCityHighlighted"></span><br>'
         + '<input type="checkbox" id="_cbHighlightRoadType" /> Highlight a Road Type (Purple)<br> '
         + '  <select id="_selectRoadType" name="_selectRoadType" style="margin: 0 0 4px 16px"></select><br>'
         ;
         addon.appendChild(section);

         // advanced options
         section = document.createElement('p');
         section.style.paddingTop = "0px";
         section.style.textIndent = "16px";
         section.style.display = "none";
         section.id = 'advancedOptions';
         section.innerHTML  = '<b>Advanced Options</b><br>'
         + '<input type="checkbox" id="_cbHighlightRecent" /> Recently Edited (Green)<br> '
         + '  <input type="number" min="0" max="365" size="3" id="_numRecentDays"  style="margin: 0 0 4px 16px"/> days<br>'
         + '<input type="checkbox" id="_cbHighlightEditor" /> Filter by Editor (Green)<br> '
         + '  <select id="_selectUser" name="_selectUser" style="margin: 0 0 4px 16px"></select>'
         + '<span id="_numUserHighlighted"></span><br>'
         + '<input type="checkbox" id="_cbHighlightTurns" /> <span title="*Highlight turn errors when a segment or node is selected, and on mjor roads">Turn Warnings for Selected Nodes*</span><br>'
         ;
         addon.appendChild(section);

         // highlight places
         section = document.createElement('p');
         section.id = "hilitePlaces";
         section.innerHTML  = '<input type="checkbox" id="_cbHighlightPlaces" /> <b title="'
         + 'parks/trees = green, water = blue, parking lot = cyan, '
         + 'everything else = pink">Highlight Places</b> '
         + '<span id="wmedebug" style="color: gray"></span><br>'
         + '<input type="checkbox" id="_cbHighlightLockedPlaces" /> Locked Places (Red)<br>'
         + '<input type="checkbox" id="_cbHighlightLockedPlacesHi" /> Places locked above your level (Dark Blue)<br>'
         + '<input type="checkbox" id="_cbHighlightIncompletePlaces" /> '
         +    '<span title="If blank name or street, or wrong category">Incomplete Places</span> (Dashed Orange)<br>'
         ;
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

         var userTabs = getId('user-info');
         var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
         var tabContent = getElementsByClassName('tab-content', userTabs)[0];

         if (typeof navTabs === "undefined") {
             console.log("WME Highlights: not logged in - will initialise later");
             Waze.loginManager.events.register("login", null, initialiseHighlights);
             return;
         }

         newtab = document.createElement('li');
    //     newtab.innerHTML = '<a href="#sidepanel-highlights" data-toggle="tab">Highlight</a>';
         newtab.innerHTML = '<a href="#sidepanel-highlights" data-toggle="tab">SE-Highlight</a>';
         navTabs.appendChild(newtab);

         addon.id = "sidepanel-highlights";
         addon.className = "tab-pane";
         tabContent.appendChild(addon);

         // check for AM or CM, and unhide Advanced options
         enableAdvancedOptions();

         // always populate road types
         populateRoadTypes();

         // setup onclick handlers for instant update:
         getId('_cbHighlightLocked').onclick = highlightSegments;
         getId('_cbHighlightToll').onclick = highlightSegments;
         getId('_cbHighlightUnnamed').onclick = highlightSegments;
         getId('_cbHighlightNoCity').onclick = highlightSegments;
         getId('_cbHighlightOneWay').onclick = highlightSegments;
         getId('_cbHighlightNoDirection').onclick = highlightSegments;
         getId('_cbHighlightRestrictions').onclick = highlightSegments;


         getId('_cbHighlightRecent').onclick = highlightSegmentsAndPlaces;
         getId('_cbHighlightEditor').onclick = highlightSegmentsAndPlaces;
         getId('_cbHighlightCity').onclick = highlightSegmentsAndPlaces;
         getId('_cbHighlightCityInvert').onclick = highlightSegmentsAndPlaces;
         getId('_cbHighlightRoadType').onclick = highlightSegments;
         getId('_cbHighlightNoTerm').onclick = highlightSegments;
         getId('_cbHighlightTurns').onclick = highlightSelectedNodes;

         getId('_selectUser').onfocus = updateUserList;
         getId('_selectUser').onchange = highlightSegmentsAndPlaces;

         getId('_selectCity').onfocus = updateCityList;
         getId('_selectCity').onchange = highlightSegmentsAndPlaces;

         getId('_numRecentDays').onchange = highlightSegmentsAndPlaces;
         getId('_selectRoadType').onchange = highlightSegments;

         getId('_cbHighlightPlaces').onclick = highlightPlaces;
         getId('_cbHighlightLockedPlaces').onclick = highlightPlaces;
         getId('_cbHighlightLockedPlacesHi').onclick = highlightPlaces;
         getId('_cbHighlightIncompletePlaces').onclick = highlightPlaces;


         // restore saved settings
         if (localStorage.WMEHighlightScript) {
             console.log("WME Highlights: loading options");
             options = JSON.parse(localStorage.WMEHighlightScript);

             getId('_cbHighlightLocked').checked       = (options[1] % 2 == 1);
             getId('_cbHighlightToll').checked         = options[2];
             getId('_cbHighlightAltName').checked      = options[22];
             getId('_cbHighlightUnnamed').checked      = options[3];
             getId('_cbHighlightNoCity').checked       = options[4];
             getId('_cbHighlightOneWay').checked       = options[5];
             getId('_cbHighlightNoDirection').checked  = options[6];
             getId('_cbHighlightNoTerm').checked       = options[14];
             getId('_cbHighlightCity').checked         = options[15];
             getId('_cbHighlightRoadType').checked     = options[16];
             getId('_selectRoadType').selectedIndex    = options[17];
             getId('_cbHighlightPlaces').checked       = options[7];
             getId('_cbHighlightRestrictions').checked = options[19];
             getId('_cbHighlightLockedPlaces').checked = options[20]; //(options[1] > 1);
             getId('_cbHighlightLockedPlacesHi').checked = options[23]; //(options[1] > 1);
             getId('_cbHighlightIncompletePlaces').checked = options[21];

             if (options[12] === undefined) options[12] = 7;
             getId('_cbHighlightRecent').checked   = options[11];
             getId('_numRecentDays').value         = options[12];
             getId('_cbHighlightEditor').checked   = options[13];
             getId('_cbHighlightTurns').checked    = options[18];
         } else {
             getId('_cbHighlightPlaces').checked = true;
             getId('_cbHighlightPlacesHi').checked = true;
             getId('_cbHighlightTurns').checked    = true;
         }

         if (typeof Waze.model.venues == "undefined") {
             getId('_cbHighlightPlaces').checked = false;
             getId('_cbHighlightPlaces').disabled = true;
         }

         if (!getId('_cbHighlightPlaces').checked) {
             getId('_cbHighlightLockedPlaces').disabled = true;
             getId('_cbHighlightLockedPlacesHi').disabled = true;
             getId('_cbHighlightIncompletePlaces').disabled = true;
         }

         // overload the WME exit function
         saveHighlightOptions = function() {
             if (localStorage) {
                 console.log("WME Highlights: saving options");
                 var options = [];

                 // preserve previous options which may get lost after logout
                 if (localStorage.WMEHighlightScript)
                     options = JSON.parse(localStorage.WMEHighlightScript);

                 options[1] = 1 * getId('_cbHighlightLocked').checked + 2 * getId('_cbHighlightLockedPlaces').checked;
                 options[2] = getId('_cbHighlightToll').checked;
                 options[22]= getId('_cbHighlightAltName').checked;
                 options[3] = getId('_cbHighlightUnnamed').checked;
                 options[4] = getId('_cbHighlightNoCity').checked;
                 options[5] = getId('_cbHighlightOneWay').checked;
                 options[6] = getId('_cbHighlightNoDirection').checked;
                 options[14] = getId('_cbHighlightNoTerm').checked;
                 options[15] = getId('_cbHighlightCity').checked;
                 options[16] = getId('_cbHighlightRoadType').checked;
                 options[17] = getId('_selectRoadType').selectedIndex;
                 options[7] = getId('_cbHighlightPlaces').checked;
                 options[19] = getId('_cbHighlightRestrictions').checked;
                 options[20] = getId('_cbHighlightLockedPlaces').checked;
                 options[21] = getId('_cbHighlightIncompletePlaces').checked;
                 options[23] = getId('_cbHighlightLockedPlacesHi').checked;

                 if (advancedMode) {
                     options[11] = getId('_cbHighlightRecent').checked;
                     options[12] = getId('_numRecentDays').value;
                     options[13] = getId('_cbHighlightEditor').checked;
                     options[18] = getId('_cbHighlightTurns').checked;
                 }

                 localStorage.WMEHighlightScript = JSON.stringify(options);
             }
         }
         window.addEventListener("beforeunload", saveHighlightOptions, false);

         // begin periodic updates
         window.setInterval(highlightSegments,333);
         window.setInterval(highlightPlaces,500);
         window.setInterval(highlightBadNodes,444);
         window.setInterval(highlightSelectedNodes,250);

         // trigger code when page is fully loaded, to catch any missing bits
         window.addEventListener("load", function(e) {
             var mapProblems = getId('map-problems-explanation')
             if (mapProblems !== null) mapProblems.style.display = "none";
             enableAdvancedOptions();
         });

         // register some events...
         Waze.map.events.register("zoomend", null, highlightSegments);
         Waze.map.events.register("zoomend", null, highlightPlaces);
         Waze.map.events.register("zoomend", null, highlightSelectedNodes);

         Waze.selectionManager.events.register("selectionchanged", null, highlightSelectedNodes);

         //Waze.loginManager.events.register("afterloginchanged", null, enableAdvancedOptions);
         Waze.model.events.register("mergeend", null, initCityList);

         wmechinit = true;
     }

     /* engage! =================================================================== */
     initialiseHighlights();

 })();
/* end ======================================================================= */
