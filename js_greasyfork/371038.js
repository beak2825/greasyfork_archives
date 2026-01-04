// ==UserScript==
// @name         WME Street Name Check
// @namespace    https://greasyfork.org/en/scripts/371038-wme-street-name-check
// @version      2.31.4
// @description  Highlight unknown street name suffixes
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARVSURBVFhH7VZbTBxVGMY3fakPGpNK61MT44tJ1VRECjuzM7OzC0qEatVatUZr0gvWRI3x8mJiYgWMBqyWh8YmWMKL2aYEWmoDNanBlkJDUx+0hkTFlp37ZXdnL/D5n+FQDUG6S6C8+CV/dnZm9vu+81/O2YqVQkaVHk+rUls6Jo55csR35UiOrn/NqtGj6Xi0aWrz5jv4qysLUxa2BglpBGoUiFQjT+EpAtyYiKxQA9RWAfQ9iEt/kKHd/GcrAzMm7skn5FDYeTIO6+AnMAZOQr9wEfrFcRhDwzAPfw1753MobH0UqJfhqdI3H1RU3MYplg9LEV5Gg4KgZgus99+F/stVpPwAZjqAQ+FSWBRaOgftWgpm12G4LCMJCbYqHuU0y4Or1N2fiUu5HK3KbD0IzcvCdHzksgFmZ2ZQLBZRLBQxw67zBTiOh1S2APNE35yJegW0gFc5XfmwFTEJsQbWG/ug2T4sy8Xs7CyCDBlJGdBpxdpf0zCmNaRdDwy+68+Z6OpCnoxTj2izzc23c8rS4UjSJl8RZtJSHYzzo9Bo5RaJupYDbep6KMwMzJtI0T1bN+GYNjRmbloPewIx1qjCU5y2dDhydD+kWlgte6HbHvTrWiikTf0jvDDC5/PGMvmwH9h0ODGxm9OWDlcRjqDuMZhfdkKnBlsodtOgjBlnf0BAJXSUyCSnLR1U/77QQE8PdD+7uMhSYTowLk3ApX3DkeoKnLZ02IpwPDTwbTcZCBYXWSqYgbFxUCaZgSynLR2OInayjcdqb11eCdwMjFOD4Y7pxIQJTls6HFXcATkCe9eL0DUz7OpFhf4rqAmt1k/D3ZOy+TmnLR1uQ+1djiJ4AZXB6B8gQsrCv0ZvyTBd6Fcn4TQmwM4OOrCqOW15oEZsY3NsP7sN+u9TNI7+zU2wbLHt+cP3wHrIjokT4Hxlw4xG1/m1VZfz1Y/A3rN7zgTLxKLl0Gj00lT7NMz2NmTp7CjQAebS8c3plge9u/sA9r6OAjNBmTAHqBzhKskImw42ouyazf3oGKw3W8KDix1gpiLs4zTLA6W72Q4Knt/b845TU3WFlYP1hP3KS7A+a4d57BjM3l5YXx2CdWA/fGpadnbkElLWVqOvcZrycG5wUBnq63uBxHf6tpc3rqW2s/tWY+Od2YTURv98DDYdrLtZjW8EbdsZRSiS+HfTivBgSFYuRoeHv5gY+QmXzv2IySs/48/fJnfxRzfgNYj35BLyjowa7fBUMUlxIq1Gj9A/oZZAFR/gr5WPh5ue6RgaPI1x2r/PnjwVmjidTD7PH68uKgWp425BxkNNT2MgeRxjZOLyyHkM9/fH+SurBya+MdaADaKCdVU1oYmhwe8xcuZMJ39l9TAvXkmrZ8FMsExs2bb9EH9l9bBQnEWYCUFZO3H6/F989VAZkT5aM3GGSurwDWJsbcQZ1gvyW/epT4Qmbrn4PNZH5Lc3xur1eyPKx/zWLUJFxd/1s79Tvhm24gAAAABJRU5ErkJggg==
// @author       OneCheapDrunk. From Aug 2018, Keilorcam
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/371038/WME%20Street%20Name%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/371038/WME%20Street%20Name%20Check.meta.js
// ==/UserScript==

/**
  This script was built from WME Color Highlights. Much respect to the original author for their great work. :D
  Layers menu bit taken from WME Junction Angle Info.
*/

(function()
 {
    // globals
    var SCRIPT_VERSION = "2.31.4";
    var INIT_COMPLETE = false;
    var sncLayer;
    var EDITORLEVEL = 0;
    var MODE_DEFAULT = 0;

    // regexes
    var INVALID_PREFIXES = new RegExp(/^Mt.|Mt /);
    var VALID_ABBRS = new RegExp(/ (Ally|App|Arc|Av|Bwlk|Bvd|Brk|Bypa|Ch|Cct|Cl|Con|Ct|Cr|Crst|Dr|Ent|Esp|Exp|Ftrl|Fwy|Glde|Gra|Gr|Hwy|Mwy|Pde|Pwy|Psge|Pl|Plza|Prom|Qys|Rtt|Rdge|Rd|Sq|Stps|St|Sbwy|Tce|Trk|Trl|Vsta)$/);
    var VALID_SUFFIXES = new RegExp(/ (Dale|Elbow|Copse|Wynd|Gateway|Ford|Cross|Pursuit|Quadrant|Waters|Common|Hill|Turn|Nook|Run|Green|Arterial|Access|Alleyway|Amble|Approach|Artery|Basin|Beach|Bend|Block|Bluff|Brace|Branch|Bridge|Broadway|Busway|Byway|Canyon|Causeway|Centre|Centreway|Circle|Circlet|Circus|Colonnade|Concord|Common|Copse|Corner|Corso|Course|Courtyard|Cove|Creek|Cross|Crossing|Crossroad|Crossway|Cruiseway|Cul-De-Sac|Cutting|Deviation|Distributor|Divide|Driveway|Estate|Fairway|Fire Track|Follow|Footway|Foreshore|Formation|Front|Frontage|Garden|Gardens|Gate|Gates|Glen|Green|Ground|Gully|Haven|Harbour|Heights|Highroad|Interchange|Intersection|Junction|Key|Lagoon|Landing|Lane|Laneway|Link|Little|Lookout|Loop|Lower|Mall|Meadow|Mews|Meander|Mount|Mountain|Outlook|Overpass|Park|Parklands|Pass|Path|Piazza|Plain|Plateau|Point|Quay|Ramp|Ramble|Range|Reach|Reserve|Ridge|Ridgeway|Right Of Way|Rise|River|Riverway|Riviera|Ronde|Round|Route|Row|Service Way|Siding|Slope|Sound|Stairs|Station|State Highway|Straight|Strand|Subway|Summit|Thoroughfare|Throughway|Tollway|Towers|Trafficway|Trailer|Triangle|Trunkway|Tunnel|Turnpike|Underpass|Upper|Vale|Valley|Viaduct|View|Views|Villa|Village|Villas|Walk|Walkway|Water|Way|Wharf)$/);
    var VALID_EXTS = new RegExp(/ (North|South|East|West|Central|Upper|Lower|Connection|Service (Road|Lane))$/);
    //var INVALID_EXTS = new RegExp(/ (Service Rd)$/);
    var IGNORE_LIST = new RegExp(/ (Ave|Blvd|Circuit|Close|Cres|Esplanade|Grv|Parade|Pkwy|Plaza)$/);

    // colours
    var HIGHLIGHT_ORANGE = "#ff5000";
    var HIGHLIGHT_MAGENTA = "#ff00dd";
    var HIGHLIGHT_RED = "#ff0000";
    var HIGHLIGHT_BLACK = "#000000";
    var HIGHLIGHT_DASHES = "10 10";
    var HIGHLIGHT_OPACITY = 0.7;

    // road types
    var ROAD_STREET = 1;
    var ROAD_PRIMARY_STREET = 2;
    var ROAD_FREEWAY = 3;
    var ROAD_RAMP = 4;
    var ROAD_MAJOR_HIGHWAY = 6;
    var ROAD_MINOR_HIGHWAY = 7;
    var ROAD_PRIVATE = 17;
    var ROAD_PARKING_LOT = 20;
    var ROAD_NARROW = 22;

    var sncIcon = '<img height="16" width="16"src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARVSURBVFhH7VZbTBxVGMY3fakPGpNK61MT44tJ1VRECjuzM7OzC0qEatVatUZr0gvWRI3x8mJiYgWMBqyWh8YmWMKL2aYEWmoDNanBlkJDUx+0hkTFlp37ZXdnL/D5n+FQDUG6S6C8+CV/dnZm9vu+81/O2YqVQkaVHk+rUls6Jo55csR35UiOrn/NqtGj6Xi0aWrz5jv4qysLUxa2BglpBGoUiFQjT+EpAtyYiKxQA9RWAfQ9iEt/kKHd/GcrAzMm7skn5FDYeTIO6+AnMAZOQr9wEfrFcRhDwzAPfw1753MobH0UqJfhqdI3H1RU3MYplg9LEV5Gg4KgZgus99+F/stVpPwAZjqAQ+FSWBRaOgftWgpm12G4LCMJCbYqHuU0y4Or1N2fiUu5HK3KbD0IzcvCdHzksgFmZ2ZQLBZRLBQxw67zBTiOh1S2APNE35yJegW0gFc5XfmwFTEJsQbWG/ug2T4sy8Xs7CyCDBlJGdBpxdpf0zCmNaRdDwy+68+Z6OpCnoxTj2izzc23c8rS4UjSJl8RZtJSHYzzo9Bo5RaJupYDbep6KMwMzJtI0T1bN+GYNjRmbloPewIx1qjCU5y2dDhydD+kWlgte6HbHvTrWiikTf0jvDDC5/PGMvmwH9h0ODGxm9OWDlcRjqDuMZhfdkKnBlsodtOgjBlnf0BAJXSUyCSnLR1U/77QQE8PdD+7uMhSYTowLk3ApX3DkeoKnLZ02IpwPDTwbTcZCBYXWSqYgbFxUCaZgSynLR2OInayjcdqb11eCdwMjFOD4Y7pxIQJTls6HFXcATkCe9eL0DUz7OpFhf4rqAmt1k/D3ZOy+TmnLR1uQ+1djiJ4AZXB6B8gQsrCv0ZvyTBd6Fcn4TQmwM4OOrCqOW15oEZsY3NsP7sN+u9TNI7+zU2wbLHt+cP3wHrIjokT4Hxlw4xG1/m1VZfz1Y/A3rN7zgTLxKLl0Gj00lT7NMz2NmTp7CjQAebS8c3plge9u/sA9r6OAjNBmTAHqBzhKskImw42ouyazf3oGKw3W8KDix1gpiLs4zTLA6W72Q4Knt/b845TU3WFlYP1hP3KS7A+a4d57BjM3l5YXx2CdWA/fGpadnbkElLWVqOvcZrycG5wUBnq63uBxHf6tpc3rqW2s/tWY+Od2YTURv98DDYdrLtZjW8EbdsZRSiS+HfTivBgSFYuRoeHv5gY+QmXzv2IySs/48/fJnfxRzfgNYj35BLyjowa7fBUMUlxIq1Gj9A/oZZAFR/gr5WPh5ue6RgaPI1x2r/PnjwVmjidTD7PH68uKgWp425BxkNNT2MgeRxjZOLyyHkM9/fH+SurBya+MdaADaKCdVU1oYmhwe8xcuZMJ39l9TAvXkmrZ8FMsExs2bb9EH9l9bBQnEWYCUFZO3H6/F989VAZkT5aM3GGSurwDWJsbcQZ1gvyW/epT4Qmbrn4PNZH5Lc3xur1eyPKx/zWLUJFxd/1s79Tvhm24gAAAABJRU5ErkJggg==">';
    var roadTypes = I18n.translations[I18n.locale].segment.road_types;
    var roadCarPark = roadTypes[ROAD_PARKING_LOT];
    var roadRamp = roadTypes[ROAD_RAMP];
    var roadPrivate = roadTypes[ROAD_PRIVATE];
    var roadFreeway = roadTypes[ROAD_FREEWAY];

    //console.debug(carParkRoad);

    function restoreSavedSettings(){
        if (localStorage.WMEStreetNameCheck) {
            //console.debug("WME Street Name Check: loading options");
            var options = JSON.parse(localStorage.WMEStreetNameCheck);

            getId('_cbHighlightUnknown').checked = options[1];
            getId('_cbHighlightPrivate').checked = options[3];
            getId('_cbHighlightRamp').checked = options[5];
            getId('_cbHighlightNamedParking').checked = options[4];
            getId('_cbHighlightOnlyEditable').checked = options[2];
            getId('_cbShowDashed').checked = options[6];
            getId('_rbHilightOrange').checked = options[7];
            getId('_rbHilightMagenta').checked = options[8];
            getId('_cbHighlightIgnore').checked = options[9];
            getId('_cbHighlightL1').checked = options[10];
            getId('_cbHighlightPLR').checked = options[11];
            getId('_txtDaysOld').value = options[12];
            getId('_cbHighlightFreeway').checked = options[13];
            getId('_cbHighlightNoName').checked = options[14];
            getId('_cbSncHighlightNoCity').checked = options[15];
            getId('_cbSncHighlightPrimary').checked = options[16];
        }
    }

    function sncHighlightSegments(event) {
        if (!INIT_COMPLETE) return;

        var showUnknown = getId('_cbHighlightUnknown').checked;
        var showPrivate = getId('_cbHighlightPrivate').checked;
        var showRamp = getId('_cbHighlightRamp').checked;
        var showPLR = getId('_cbHighlightPLR').checked;
        var showFreeway = getId('_cbHighlightFreeway').checked;
        var showNamedParking = getId('_cbHighlightNamedParking').checked;
        var showOnlyEditable = getId('_cbHighlightOnlyEditable').checked;
        var showDashed = getId('_cbShowDashed').checked;
        var isMagenta = getId('_rbHilightMagenta').checked;
        var showL1 = getId('_cbHighlightL1').checked;
        var daysOld = getId('_txtDaysOld').value;
        var showUnnamed = getId('_cbHighlightNoName').checked;
        var showNoCity = getId('_cbSncHighlightNoCity').checked;
        var showPrimaryOnly = getId('_cbSncHighlightPrimary').checked;

        var features = [];

        if(!showNoCity) {
            getId('_cbSncHighlightPrimary').disabled = true;
        }
        else {
            getId('_cbSncHighlightPrimary').disabled = false;
        }
        if (!showUnknown) {
            getId('_cbHighlightPrivate').disabled = true;
            getId('_cbHighlightRamp').disabled = true;
            getId('_cbHighlightIgnore').disabled = true;
            getId('_cbHighlightPLR').disabled = true;
            getId('_cbHighlightFreeway').disabled = true;
        }
        else {
            getId('_cbHighlightPrivate').disabled = false;
            getId('_cbHighlightRamp').disabled = false;
            getId('_cbHighlightIgnore').disabled = false;
            getId('_cbHighlightPLR').disabled = false;
            getId('_cbHighlightFreeway').disabled = false;
        }

        // master switch when all options are off
        if (event && event.type && event.type == 'click') {
            if ((showUnknown | showNamedParking | showL1 | showUnnamed) === false) {
                sncLayer.removeAllFeatures();
                return;
            }
        }

        for (var seg in W.model.segments.objects) { // segment processing loop
            var segment = W.model.segments.getObjectById(seg);
            var attributes = segment.attributes;
            var line = getId(segment.geometry.id);

            if (!segment.arePropertiesEditable() && showOnlyEditable) continue;
            if (line === null) continue;

            var sid = attributes.primaryStreetID;
            // check WME has not already highlighted this segment
            if (line.getAttribute("stroke-opacity") == 1 || line.getAttribute("stroke-width") == 9) continue;

            var roadType = attributes.roadType;

            // turn off highlights when roads are no longer visible
            if (W.map.zoom <= 3 && (roadType < ROAD_PRIMARY_STREET || roadType > ROAD_MINOR_HIGHWAY) ) {
                sncLayer.removeAllFeatures();
                continue;
            }

            // if segment is part of a roundabout, abort.
            if (attributes.junctionID !== null) continue;

            // only check these road types:
            if (!(roadType >= ROAD_STREET && roadType <= ROAD_RAMP)
                && roadType != ROAD_MAJOR_HIGHWAY
                && roadType != ROAD_MINOR_HIGHWAY
                && roadType != ROAD_PRIVATE
                && roadType != ROAD_PARKING_LOT
                && roadType != ROAD_NARROW)
                continue;

            var street = W.model.streets.getObjectById(sid);
            var showHighlight = false;

            if (street !== null && street.name !== null && street.name !== "") {
                if(showUnknown){
                    if (!/\bThe\s\w+/.test(street.name)) {      // ignore names like "The Boulevard".
                        var testName = ' ' + street.name;       // prepend whitespace to capture street names made entirely from valid extensions.
                        while (testName != (testName = testName.replace(VALID_EXTS, '')));
                        testName = testName.trim();
                        if (testName === '' || (getId('_cbHighlightIgnore').checked && IGNORE_LIST.test(testName))) continue;
                        if (INVALID_PREFIXES.test(testName) || (!VALID_ABBRS.test(testName) && !VALID_SUFFIXES.test(testName))) showHighlight = true;
                        if (!/^[A-Z]/.test(testName)) showHighlight = true;
                    }
                }
                if (roadType == ROAD_PARKING_LOT && showNamedParking) showHighlight = true;
            }

/*///////////////////////////////////// Left this bit in here so I don't forget where it came from
                var roadeditor = parseInt(attributes.updatedBy);
                var user = W.model.users.getObjectById(roadeditor);
                if (user === null || typeof(user) === "undefined")
                    roadeditor = '-';
                else
                    roadeditor = user.userName + '(' + user.normalizedLevel + ')';

			var sid = segment.attributes.primaryStreetID;
            var street = W.model.streets.getObjectById(sid);
                W.model.cities.objects[street.cityID].attributes.name;

////////////////////////////////////////*/


            var updatedDays;
			if (typeof(segment.attributes.updatedOn) === 'undefined') {
				updatedDays = 0;
			} else {
				updatedDays = Math.floor((new Date().getTime() - segment.attributes.updatedOn) / 86400000);
			}

            if (roadType == ROAD_PRIVATE && !showPrivate) showHighlight = false;
            if (roadType == ROAD_RAMP && !showRamp) showHighlight = false;
            if (roadType == ROAD_FREEWAY && !showFreeway) showHighlight = false;
            if (roadType == ROAD_PARKING_LOT && !showNamedParking && !showPLR) showHighlight = false;

            if(daysOld == 0) daysOld = 999;

            //If the 'Edited by L1' box is checked and the last editor was L1 but not inactive highlight segment.
            if(showL1){
                var user = W.model.users.getObjectById(parseInt(attributes.updatedBy));
                if(user !== null){
                    if(user.userName != 'Inactive User'
                       && user.rank == EDITORLEVEL
                       && updatedDays < daysOld) showHighlight = true;
                }
            }

            // Don't check for city or name if segment already highlighted.
            var noName = false;
            var noCity = false;
            if(!showHighlight){
                if(street !== null){
                    if(street.name === null && roadType <= ROAD_MINOR_HIGHWAY && roadType != ROAD_RAMP && showUnnamed) {
                        showHighlight = true;
                        noName = true;
                    }

                    var hasNoCity = W.model.cities.getObjectById(street.cityID).attributes.isEmpty;
                    if(showNoCity && hasNoCity) {
                        if(roadType <= ROAD_PRIMARY_STREET){
                            showHighlight = true;
                            noCity = true;
                        }
                        else{
                            if(!showPrimaryOnly){
                                showHighlight = true;
                                noCity = true;
                            }
                        }
                    }
                }
            }

            if (showHighlight) {
                var newColor = HIGHLIGHT_ORANGE;
                var newDashes = "0";
                var strkWidth = 8;

                if(isMagenta) newColor = HIGHLIGHT_MAGENTA;
                if(showDashed) newDashes = HIGHLIGHT_DASHES;
                if(noName){
                    newColor = HIGHLIGHT_RED;
                    newDashes = "4 20";
                    strkWidth = 4;
                }
                else{
                    if(noCity){
                        newColor = HIGHLIGHT_BLACK;
                        newDashes = "4 20";
                        strkWidth = 4;
                    }

                }

                features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
                    strokeColor: newColor,
                    strokeWidth: strkWidth,
                    strokeDashstyle: newDashes,
                    strokeOpacity: HIGHLIGHT_OPACITY
                }));
            }


        } // end of segment processing loop.

        sncLayer.removeAllFeatures();
        sncLayer.addFeatures(features);
    }

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

    function InitialiseSNC() {
        if (INIT_COMPLETE) return;

        // init shortcuts
        if (!window.W.map) {
            window.console.warn("WME Street Name Check: waiting for WME ...");
            setTimeout(InitialiseSNC, 789);
            return;
        }
//
//
//
        if(drawTab()) {

            sncLayer = new OpenLayers.Layer.Vector("sncLayer", {
                displayInLayerSwitcher: true,
                uniqueName: "__sncLayer"
            });

            W.map.addLayer(sncLayer);

            // restore saved settings
            restoreSavedSettings();

            // overload the WME exit function
            var sncSaveHighlightOptions = function() {
                if (localStorage) {
                    //console.debug("WME Street Name Check: saving options");
                    var options = [];

                    // preserve previous options which may be lost after logout
                    if (localStorage.WMEStreetNameCheck) {
                        options = JSON.parse(localStorage.WMEStreetNameCheck);

                        options[1] = getId('_cbHighlightUnknown').checked;
                        options[3] = getId('_cbHighlightPrivate').checked;
                        options[5] = getId('_cbHighlightRamp').checked;
                        options[4] = getId('_cbHighlightNamedParking').checked;
                        options[2] = getId('_cbHighlightOnlyEditable').checked;
                        options[6] = getId('_cbShowDashed').checked;
                        options[7] = getId('_rbHilightOrange').checked;
                        options[8] = getId('_rbHilightMagenta').checked;
                        options[9] = getId('_cbHighlightIgnore').checked;
                        options[10] = getId('_cbHighlightL1').checked;
                        options[11] = getId('_cbHighlightPLR').checked;
                        options[12] = getId('_txtDaysOld').value;
                        options[13] = getId('_cbHighlightFreeway').checked;
                        options[14] = getId('_cbHighlightNoName').checked;
                        options[15] = getId('_cbSncHighlightNoCity').checked;
                        options[16] = getId('_cbSncHighlightPrimary').checked;
                    }

                    localStorage.WMEStreetNameCheck = JSON.stringify(options);
                }
            };

            // setup onclick handlers for instant update:
            getId('_cbHighlightUnknown').onclick = sncHighlightSegments;
            getId('_cbHighlightPrivate').onclick = function(e) {getId('_cbHighlightUnknown').checked=1; sncHighlightSegments(e);};
            getId('_cbHighlightRamp').onclick = function(e) {getId('_cbHighlightUnknown').checked=1; sncHighlightSegments(e);};
            getId('_cbHighlightNamedParking').onclick = sncHighlightSegments;
            getId('_cbHighlightOnlyEditable').onclick = sncHighlightSegments;
            getId('_cbShowDashed').onclick = sncHighlightSegments;
            getId('_rbHilightOrange').onclick = sncHighlightSegments;
            getId('_rbHilightMagenta').onclick = sncHighlightSegments;
            getId('_cbHighlightIgnore').onclick = sncHighlightSegments;
            getId('_cbHighlightL1').onclick = sncHighlightSegments;
            getId('_cbHighlightPLR').onclick = sncHighlightSegments;
            getId('_cbHighlightFreeway').onclick = sncHighlightSegments;
            getId('_cbHighlightNoName').onclick = sncHighlightSegments;
            getId('_cbSncHighlightNoCity').onclick = sncHighlightSegments;
            getId('_cbSncHighlightPrimary').onclick = sncHighlightSegments;


            window.addEventListener("beforeunload", sncSaveHighlightOptions, false);

            // trigger code when page is fully loaded, to catch any missing bits
            window.addEventListener("load", function(e) {
                var mapProblems = getId('map-problems-explanation');
                if (mapProblems !== null) mapProblems.style.display = "none";
            });

            // register some events...
            W.map.events.register("zoomend", null, sncHighlightSegments);
            W.map.events.register("moveend", null, sncHighlightSegments);
            W.map.events.register("addlayer", null, sncHighlightSegments);
            W.map.events.register("click", null, sncHighlightSegments);
            W.map.events.register("changelayer", null, changeLayer);
            W.model.events.register("mergeend", null, sncHighlightSegments);

            createToggler();

            INIT_COMPLETE = true;
        }
    }

    // recreate tab when MTE mode is exited
    function onModeChange(model, modeId) {
        INIT_COMPLETE = false;
        //console.debug(modeId);
        if(modeId == MODE_DEFAULT){
            setTimeout(InitialiseSNC, 789);
        } else {
            sncLayer.removeAllFeatures();

        }

    }

    function drawTab(){
                // check if sidebar is hidden
        var sidebar = getId('sidebar');
        if (sidebar.style.display == 'none') {
            console.warn("WME Street Name Check: not logged in yet - will initialise at login");
            W.loginManager.events.register("login", null, InitialiseSNC);
            return false;
        }

        // check that user-info section is defined
        var userTabs = getId('user-info');
        if (userTabs === null) {
            console.warn("WME Street Name Check: editor not initialised yet - trying again in a bit ...");
            setTimeout(InitialiseSNC, 789);
            return false;
        }

        console.group("Oz Street Name Check: " + SCRIPT_VERSION);

        // add new box to left of the map
        var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];

        var tabContent = getElementsByClassName('tab-content', userTabs)[0];
        var addon = document.createElement('section');

        addon.id = "snc-highlight-addon";

        var section = document.createElement('p');

        section.style.paddingTop = "0px";
        //------------------
        section.id = "sncHiliteOptions";
        section.className = 'checkbox';
        section.innerHTML = '<label style="margin-left: 12px">' + sncIcon + '<b> Oz Street Name Check</b></label><br>'
            + '<br><b>Highlight:</b><br>'
            + '<label style="font-weight:normal"><input type="checkbox" id="_cbHighlightUnknown" />'
            + 'Invalid street name formats</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal;"><input type="checkbox" id="_cbHighlightPrivate" /> '
            + 'Check ' + roadPrivate + 's</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal;"><input type="checkbox" id="_cbHighlightRamp" /> '
            + 'Check ' + roadRamp + 's</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal"><input type="checkbox" id="_cbHighlightPLR" />'
            + 'Check ' + roadCarPark + 's</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal"><input type="checkbox" id="_cbHighlightFreeway" />'
            + 'Check ' + roadFreeway + 's</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal"><input type="checkbox" id="_cbHighlightIgnore" /> '
            + '<span title="Currently under discussion">Ignore Ave Blvd Circuit Close Cres Esplanade Grv Parade Pkwy Plaza</span></label>'
            + '<br>'
            + '<br><label style="font-weight:normal;"><input type="checkbox" id="_cbHighlightNamedParking" /> '
            + 'Named ' + roadCarPark + 's</label><br>'
            + '<label style="font-weight:normal;"><input type="checkbox" id="_cbHighlightNoName" /> '
            + 'Unnamed streets (Red dots)</label><br>'
            + '<label style="font-weight:normal;"><input type="checkbox" id="_cbSncHighlightNoCity" /> '
            + 'Streets with no city (Black dots)</label><br>'
            + '<label style="margin-left: 12px; font-weight:normal;"><input type="checkbox" id="_cbSncHighlightPrimary" /> '
            + 'Limit to Streets and Primary Streets.</label><br>'
            + '<label style=font-weight:normal"><input type="checkbox" id="_cbHighlightL1" /> '
            + '<span title="Segments last edited by an L1 editor">Edited by L1. Less than'
            + '<input type="number" min="0" max="999" step="1" style="width:45px; height:20px; margin-left: 6px; margin-right: 6px;" id="_txtDaysOld">day(s) ago</span></label><br>'
            + '<br>'
            + '<b>Options:</b><br>'
            + '<label style="font-weight:normal;"><input type="checkbox" id="_cbHighlightOnlyEditable" /> '
            + 'Only show editable roads</label><br>'
            + '<label style="font-weight:normal;"><input type="checkbox" id="_cbShowDashed" /> '
            + 'Dashed highlight</label><br>'
            + '<br>'
            + '<b>Highlight Colour:</b><br>'
            + '<label style=font-weight:normal;"><input type="radio" name = "colour" checked="checked" id="_rbHilightOrange" /> '
            + 'Orange</label><br>'
            + '<label style=font-weight:normal;"><input type="radio" name = "colour" id="_rbHilightMagenta" /> '
            + 'Magenta</label><br>'
            + '<br>'
        ;

        addon.appendChild(section);
        //------------------

        addon.innerHTML += 'Ref: <a href="https://wazeopedia.waze.com/wiki/Australia/Abbreviations_and_Acronyms" target="_blank">'
            + 'Australian abbreviations and acronyms</a><p>';

        addon.innerHTML += '<b><a href=https://greasyfork.org/en/scripts/371038-wme-street-name-check>'
            + 'Oz Street Name Check</a></b> &nbsp; v' + SCRIPT_VERSION;

        //------------------
        var newtab = document.createElement('li');
        newtab.innerHTML = '<a title="SNC" href="#sncSidepanel" data-toggle="tab">' + sncIcon + '</a>';
        navTabs.appendChild(newtab);
        //------------------
        addon.id = "sncSidepanel";
        addon.className = "tab-pane";
        tabContent.appendChild(addon);
        //------------------

        console.groupEnd();

        return true;
    }

    function changeLayer() {
        var scriptsGroupSelector = document.getElementById('layer-switcher-group_scripts');
        if(scriptsGroupSelector === null) return;

        var layerSelector = document.getElementById('layer-switcher-item_SNC');

        if (scriptsGroupSelector.checked && layerSelector.checked) {
            sncHighlightSegments();
        } else {
            sncLayer.removeAllFeatures();
        }

        if (layerSelector.checked) {
            localStorage.WMEDrawSncRoads = true;
        }
        else {
            localStorage.WMEDrawSncRoads = false;
        }
    }

    // launch
    setTimeout(InitialiseSNC, 789);

	function createToggler(){
		// script group's toggler----------------
  	var oldTogglers = document.querySelectorAll('.togglers');
    oldTogglers.forEach(function(elt,idx){
        if(elt.id != "toolboxUl"){
        // if script group dosn't exist we create them.
          if (oldTogglers[idx].querySelector('.layer-switcher-group_scripts') === null)
          {
            var newScriptsToggler = document.createElement('li');
            newScriptsToggler.className = 'group';
            newScriptsToggler.innerHTML = '<div class="controls-container main toggler">\
																		          <input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">\
																		          <label for="layer-switcher-group_scripts">\
																		          <span class="label-text">Scripts</span>\
																		          </label>\
																			      </div>\
																			      <ul class="children">\
										                        </ul>';
            oldTogglers[idx].appendChild(newScriptsToggler);

          }

          // SNC toggler
          var newToggler = document.createElement('li');
          newToggler.innerHTML = '<div class="controls-container toggler">\
                                        <input class="layer-switcher-item_SNC toggle" id="layer-switcher-item_SNC" type="checkbox">\
                                        <label for="layer-switcher-item_SNC">\
                                          <span class="label-text">SNC</span>\
                                        </label>\
                                      </div>';


          var groupScripts = document.querySelector('.layer-switcher-group_scripts').parentNode.parentNode;
          var newScriptsChildren = groupScripts.getElementsByClassName("children")[0];
          // insert SNC toggler at the end of children of "group_scripts"
          newScriptsChildren.appendChild(newToggler);


          var toggler = document.getElementById('layer-switcher-item_SNC');
          var groupToggler = document.getElementById('layer-switcher-group_scripts');

          // restore old state
          groupToggler.checked = (typeof(localStorage.groupScriptsToggler) !=="undefined" ?
          	JSON.parse(localStorage.groupScriptsToggler) : true);

          //Set toggler according to user preference
          //toggler.checked = ja_getOption("defaultOn");
          toggler.checked = JSON.parse(localStorage.WMEDrawSncRoads); //localStorage.WMEDrawSncRoads;
          //console.debug(toggler.checked);
          toggler.disabled = !groupToggler.checked;

          // togglers events
          toggler.addEventListener('click', function(e) {
              sncLayer.setVisibility(e.target.checked);
          });

          groupToggler.addEventListener('click', function(e) {
              toggler.disabled = !e.target.checked;
              sncLayer.setVisibility(toggler.checked ? e.target.checked : toggler.checked);
              localStorage.setItem('groupScriptsToggler', e.target.checked);
          });

          //Set visibility according SNC's toggler and scripts group's toggler state
          sncLayer.setVisibility(toggler.checked ? groupToggler.checked : toggler.checked);
        }
    });
  }

})();
