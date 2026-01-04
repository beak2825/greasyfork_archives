    // ==UserScript==
    // @name           WME EmptyStreet
    // @description    Makes creating new streets in developing areas faster
    // @grant          none
    // @grant          GM_info
    // @version        3.1.2
    // @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
    // @author         BertZZZZ '2017
    // @license        MIT/BSD/X11
    // @icon
    // @require https://greasyfork.org/scripts/16071-wme-keyboard-shortcuts/code/WME%20Keyboard%20Shortcuts.js
// @namespace bert@schoofs-ven.com
// @downloadURL https://update.greasyfork.org/scripts/31557/WME%20EmptyStreet.user.js
// @updateURL https://update.greasyfork.org/scripts/31557/WME%20EmptyStreet.meta.js
    // ==/UserScript==
    // Some code reused from MapOMatic, GertBroos, Glodenox, Eduardo Carvajal, vtnerd91

    /* Changelog
    v3.1.2
    - remove depreciated getMethod

    v3.1.1
    - made the unpaved option more robust against unexpected drawing abend.

    v3.1
    - added support for unpaved

    v3.0.2
    - Replace .selectedItems by .getSelectedFeatures()

    v3.0.1
    - Remove dependency on Waze object

    v3.0.0
    Added features for city boundary cleaning
    - j functions resets cityassignment when no street selected OR uses city from selectedSegment as new assignment
    - applying "Alt+u" will now assign also on existing streets.  u remains only active on new streets
    warning: no testing done on streets with alternate names.

    v2.2.2
    Changed behaviour in case connections are made to different cities. Now an alert is given - yet the script continues.

    v2.2.1
    Added some state support

    v2.2.0
    Now displays default city on top + help
    bugfixing of the "U" functionality - disabled on existing segments - retains city
    changed log behaviour
    contains uncompleted features ()

    v0.2.0
    Script now detects if a city can be reused and prompts the user if this becomes the default selection. If cancelled, the city will be set as empty.
    New segments are created using this city until 'l' is pressed or the segment is connected to another city.
    If cancelled, the city will be emptied.
    When no "empty cities" exists in the area, then an error is given.

    v0.1.0
    Drawing a lot of streets in not yet developed Waze countries?  Then save some time and energy by drawing empty streets i.o. unnamed streets.
    Using shortcut 'k' io 'i' will draw a segment with emptyStreet and emptyCity checkbox set.
    Alternatively, when 1 segement is unnamed, a button (or shortcut 'u') will empty the street and city checkboxes

    Only tested in Chrome
    Be careful around country borders - not tested there
    Happy to get some feedback - It's my first public user script  (and coding in javascript in general) - so constructive suggestions welcome.

    */



    var VERSION = '3.1.2';
    var shortcutEmptyStreet = "u",
        shortcutEmptyStreetDesc = "emptyStreet"; // to move to a config panel, once...
    var shortcutDrawAndEmptyStreet = "k",
        shortcutDrawAndEmptyStreetDesc = "drawEmptyStreet"; // to move to a config panel, once...
    var shortcutDrawAndEmptyStreetUnpaved = "y",
        shortcutDrawAndEmptyStreetUnpavedDesc = "drawESUnpaved"; // to move to a config panel, once...
    var shortcutResetCityAssignment = "j",
        shortcutResetCityAssignmentDesc = "pickCityAssignment"; // to move to a config panel, once...
    var shortcutApplyCitySegment = "A+u",
        shortcutApplyCitySegmentDesc = "applyCityAssignments"; // to move to a config panel, once...
    var selectedItems;
    var UpdateSegmentAddress;
    var UpdateObject,
        AddOrGetCity,
        AddOrGetStreet,
        MultiAction;

    var emptyStreetHelp = shortcutEmptyStreetDesc + ": " + shortcutEmptyStreet + " / " +
        shortcutDrawAndEmptyStreetDesc + ": " + shortcutDrawAndEmptyStreet + " / " +
        shortcutDrawAndEmptyStreetUnpaved + ": " + shortcutDrawAndEmptyStreetUnpavedDesc + " / " +
        shortcutResetCityAssignmentDesc + ": " + shortcutResetCityAssignment + " / " +
        shortcutApplyCitySegmentDesc + ": " + shortcutApplyCitySegment;

    function log(message) {
        if (typeof message === 'string') {
            console.log('WMEEmptyStreet: ' + message);
        } else {
            console.log('WMEEmptyStreet: ', message);
        }
    }

    // initialize WMEEmptyStreet and do some checks
    function WMEEmptyStreet_bootstrap() {
        if (!window.W.map) {
            setTimeout(WMEEmptyStreet_bootstrap, 1000);
            return;
        }

        // from bestpractice advice on https://wiki.waze.com/wiki/Scripts/WME_JavaScript_development
        var bGreasemonkeyServiceDefined = false;

        try {
            if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
                bGreasemonkeyServiceDefined = true;
            }
        } catch (err) {
            //Ignore.
        }
        if ("undefined" === typeof unsafeWindow || !bGreasemonkeyServiceDefined) {
            unsafeWindow = (function() {
                var dummyElem = document.createElement('p');
                dummyElem.setAttribute('onclick', 'return window;');
                return dummyElem.onclick();
            })();
        }
        // own code here

        if (typeof(require) !== "undefined") {
            UpdateObject = require("Waze/Action/UpdateObject");
            AddOrGetCity = require("Waze/Action/AddOrGetCity");
            AddOrGetStreet = require("Waze/Action/AddOrGetStreet");
            MultiAction = require("Waze/Action/MultiAction");

            // from streettoriver script
            try {
                UpdateSegmentAddress = require("Waze/Action/UpdateSegmentAddress");
            } catch (e) {}
            if (typeof(UpdateSegmentAddress) != "function") {
                UpdateSegmentAddress = require("Waze/Action/UpdateFeatureAddress");
            }
        }

        WMEEmptyStreet_init();
        log("Initalised");
    }

    function WMEEmptyStreet_init() {

        var WMEEmptyStreet = {},
            editpanel = $("#edit-panel");

        var emptyStreetToggle = false;
        var emptyStreetUnpavedToggle = false;
        var invokeEmptyStreetToggle = false;
        var cityIDAssigned = null; // null = to be set, 0 = keep city empty , other number = use city

        // Check initialisation
        if (typeof Waze == 'undefined' || typeof I18n == 'undefined') {
            setTimeout(WMEEmptyStreet_init, 660);
            log('Waze object unavailable, map still loading');
            return;
        }
        if (editpanel === undefined) {
            setTimeout(WMEEmptyStreet_init, 660);
            log('edit-panel info unavailable, map still loading');
            return;
        }

        function drawEmptyStreet() {
            invokeEmptyStreetToggle = true;
            emptyStreetUnpavedToggle = false;
            W.accelerators.events.triggerEvent("drawSegment", this);
        }

        function drawEmptyStreetUnpaved() {
            invokeEmptyStreetToggle = true;
            emptyStreetUnpavedToggle = true;
            W.accelerators.events.triggerEvent("drawSegment", this);
        }

        function setEmptyStreetAndCityKey() {
            if (W.selectionManager.getSelectedFeatures().length == 1) {
                setEmptyStreetAndCity(W.selectionManager.getSelectedFeatures()[0]);
            } else {
                log("emptyStreetAndCity should not have been invoked - expecting 1 segment");
            }
        }

        function countNewSegments() {
            var segments = W.selectionManager.getSelectedFeatures();
            var segmentCount = 0;
            if (segments.length === 0 || segments[0].model.type !== 'segment') {
                //            log("No segments selected");
                return 0;
            }
            segments.forEach(function(segment) {
                var segModel = segment.model;
                if (segModel.attributes.primaryStreetID === null) {
                    segmentCount += 1;
                }
            });
            return segmentCount;
        }


        function displayCurrentEmptyCityLocation() {
            var locationDiv = document.querySelector('#topbar-container > div > div > div.location-info-region > div');
            var emptyStreetDiv = locationDiv.querySelector('small');
            var defaultCityDisplay;

            if (emptyStreetDiv == null) {
                emptyStreetDiv = document.createElement('small');
                emptyStreetDiv.style.marginLeft = '5px';
                locationDiv.appendChild(emptyStreetDiv);
            }
            switch (cityIDAssigned) { // null = to be set, 0 = keep city empty , other number = use city
                case null:
                    defaultCityDisplay = "to set";
                    break;
                case 0:
                    defaultCityDisplay = "empty";
                    break;
                default:
                    defaultCityDisplay = getCity(cityIDAssigned).attributes.name;
                    defaultCityDisplay = (defaultCityDisplay == "") ? "Empty" : defaultCityDisplay;
            }
            emptyStreetDiv.textContent = '[Default ES City: ' + defaultCityDisplay + ']' + " " + emptyStreetHelp;
        }

        //Look if a connected segment has already a city assigned
        //This version only looks at directly connected segments

        function getConnectedSegmentIDs(segmentToSearch) {
            var IDs = [];
            var segmentID = segmentToSearch.attributes.id;
            var segment = W.model.segments.getObjectById(segmentID);
            [W.model.nodes.getObjectById(segment.attributes.fromNodeID), W.model.nodes.getObjectById(segment.attributes.toNodeID)].forEach(function(node) {
                if (node) {
                    node.attributes.segIDs.forEach(function(segID) {
                        if (segID !== segmentID) {
                            IDs.push(segID);
                        }
                    });
                }
            });
            return IDs;
        }

        function warnAndResetCityAssignment() {
            log("Different cities detected, resetting city assignment");
            resetCityAssignment();
            alert("EmptyStreet connected to different cities. Please assign cities manually");
            displayCurrentEmptyCityLocation();
        }

        function warnCityAssignment() {
            log("Different cities detected!");
            alert("The segment is connected to different cities. Using last selected default city - please check / undo if needed");
            displayCurrentEmptyCityLocation();
        }

        function getFirstConnectedStateID(startSegment) {
            var stateID = null;
            var nonMatches = [];
            var segmentIDsToSearch = [startSegment.attributes.id];
            while (stateID === null && segmentIDsToSearch.length > 0) {
                var startSegmentID = segmentIDsToSearch.pop();
                startSegment = W.model.segments.getObjectById(startSegmentID);
                var connectedSegmentIDs = getConnectedSegmentIDs(startSegment);
                for (var i = 0; i < connectedSegmentIDs.length; i++) {
                    var streetID = W.model.segments.getObjectById(connectedSegmentIDs[i]).attributes.primaryStreetID;
                    if (streetID !== null && typeof(streetID) !== 'undefined') {
                        var cityID = W.model.streets.getObjectById(streetID).cityID;
                        stateID = W.model.cities.getObjectById(cityID).attributes.stateID;
                        break;
                    }
                }

                if (stateID === null) {
                    nonMatches.push(startSegmentID);
                    connectedSegmentIDs.forEach(function(segmentID) {
                        if (nonMatches.indexOf(segmentID) === -1 && segmentIDsToSearch.indexOf(segmentID) === -1) {
                            segmentIDsToSearch.push(segmentID);
                        }
                    });
                } else {
                    return stateID;
                }
            }
            return null;
        }

        function getConnectedCityID(segmentSelected, stateID) {
            var cityID = null;
            var emptyCityID = null;
            var connectedSegmentIDs = getConnectedSegmentIDs(segmentSelected);
            var emptyCity = getEmptyCity(stateID);
            if (emptyCity != null) { emptyCityID = emptyCity.attributes.id; }
            for (var i = 0; i < connectedSegmentIDs.length; i++) {
                var streetID = W.model.segments.getObjectById(connectedSegmentIDs[i]).attributes.primaryStreetID;
                if (streetID !== null && typeof(streetID) !== 'undefined') {
                    var currentCityID = W.model.streets.getObjectById(streetID).cityID;
                    if (currentCityID != emptyCityID) {
                        if (cityID === null) {
                            cityID = currentCityID;
                            var cityNameFound = getCity(cityID).attributes.name;
                            log("City found:" + cityNameFound);
                        } else if (cityID !== currentCityID) {
                            // log("getConnectedCityID():Different Cities found:" + cityID + " & " + currentCityID);
                            return -999;
                        }
                    }
                }
            }
            return cityID;
        }

        function getCity(cityID) {
            var cities = W.model.cities.getByIds([cityID]);
            if (cities.length > 0) {
                return cities[0];
            } else {
                return null;
            }
        }

        function getEmptyCity(stateID) {
            var emptyCity = null;
            W.model.cities.getObjectArray().forEach(function(city) {
                if (city.attributes.stateID === stateID && city.attributes.isEmpty) {
                    emptyCity = city;
                }
            });
            return emptyCity;
        }

        function attrToString(attr) {
            var txt = "";
            for (var x in attr) {
                txt += attr[x];
            }
            return txt;
        }

        function updateCity(seg, streetId, newCityID, isAlt) { // adapted from city remover of vtnerd91
            var street = W.model.streets.getObjectById(streetId);
            if (street != null) {
                var cityID = street.cityID;
                if (cityID != null && cityID != newCityID) {
                    var city = W.model.cities.getObjectById(cityID);
                    if (!seg.isGeometryEditable()) {
                        console.log("Cannot edit segment " + seg.attributes.id);
                        return false;
                    } else {
                        var attr;
                        if (!isAlt) {
                            attr = {
                                countryID: city.attributes.countryID,
                                stateID: city.attributes.stateID
                            };
                            if (newCityID == null || newCityID == 0) {
                                attr.emptyCity = true;
                            } else {
                                attr.cityName = W.model.cities.getObjectById(newCityID).attributes.name
                            }
                            if (street.name == null) {
                                attr.emptyStreet = true;
                            } else {
                                attr.streetName = street.name;
                            }

                            //Update the city for an existing segment.
//                            log("1:" + attrToString(attr));
                            var u = new UpdateSegmentAddress(seg, attr, {
                                streetIDField: "primaryStreetID"
                            });
                            W.model.actionManager.add(u);
                        } else {
                            //Remove the alternate street for this segment
                            var u = new UpdateObject(seg, {
                                streetIDs: seg.attributes.streetIDs.remove(street.id)
                            });
                            W.model.actionManager.add(u);
                            if (newCityID == null || newCityID == 0) {
                                attr = {
                                    emptyCity: true
                                };
                            } else {
                                attr = {
                                    cityName: W.model.cities.getObjectById(newCityID).attributes.name
                                };
                            }
                            if (street.name == null) {
                                attr.emptyStreet = true;
                            } else {
                                attr.streetName = street.name;
                            }
                            //Add a new alternate street with a blank city
//                            log("2:" + attrToString(attr));
                            var addAlt = new AddAlternateStreet(seg, attr);
                            W.model.actionManager.add(addAlt);
                        }
                    }
                }
            }

            return true;
        }

        function updateSegmentCity(segmentToUpdate, cityIDToSet) { // returns name of city removed
            if (segmentToUpdate !== null) {
                var segModel = segmentToUpdate.model;
                if (segModel.attributes.primaryStreetID == null) {
                    log("Processing new street");
                    setEmptyStreetAndCity(segmentToUpdate);
                    return "New Street";
                }

                var oldCityID = W.model.streets.getObjectById(segModel.attributes.primaryStreetID).cityID;
                var oldCityName = getCity(oldCityID).attributes.name;
                oldCityName = (oldCityName == "") ? "Empty" : oldCityName;
                log("oldcityID: " + oldCityID + " : " + oldCityName);

                var newCityName = (cityIDToSet == 0 || cityIDToSet == null) ? "Empty" : getCity(cityIDToSet).attributes.name;
                log("cityIDtoset: " + cityIDToSet + " : " + newCityName);

                if (oldCityID == cityIDToSet) {
                    return "N/A";
                }
                var sid = segModel.attributes.primaryStreetID;
                if (updateCity(segModel, sid, cityIDToSet, false)) {
                    if (segModel.attributes.streetIDs != null) {
                        for (var ix = 0; ix < segModel.attributes.streetIDs.length; ix++) {
                            updateCity(segModel, segModel.attributes.streetIDs[ix], cityIDToSet, true);
                        }
                    }

                }
                return oldCityName;
            }
        }

        function getStateID(segModel) {
            if (W.model.hasStates()) {
                if (segModel.attributes.id == -100) {
                    alert("Using state: " + W.model.states.top.name + ". Do not save if not correct!");
                } else {
                    return getFirstConnectedStateID(segModel);
                }
            }
            return W.model.states.top.id;
        }

        // code MapOMatic until here

        function setEmptyStreetAndCity(segment) {
            var cityIDToSet, state, stateID, country, addCityAction, suggestedCity, segModel;
            var addStreetAction, addEsCity, action3, targetStreet, newStreet;
            var unPavedAttribute;

            unPavedAttribute = 0;
            emptyStreetToggle = false; //Only run once
            if (emptyStreetUnpavedToggle == true) {
                unPavedAttribute = 16;
                emptyStreetUnpavedToggle = false;
            }

            segModel = segment.model;
            stateID = getStateID(segModel);
            state = W.model.states.getObjectById(stateID);


            if (segment == null || Array.isArray(segment) || segment.model.type !== 'segment') {
                log("emptyStreetAndCity should not have been invoked");
                console.log(segment);
                return;
            }

            suggestedCity = getConnectedCityID(segment.model, stateID);

            if (suggestedCity == -999) {
                warnCityAssignment();
                //return;
            } else if (suggestedCity == null) {
                log("No connected cities detected");
            } else if (cityIDAssigned === null) { // no choice is made if city is to be reused.
                // dialog to accept new city as default
                var cityNameFound = getCity(suggestedCity).attributes.name;
                if (confirm("Continue using city:" + cityNameFound + "?")) {
                    cityIDAssigned = suggestedCity;
                } else {
                    cityIDAssigned = 0; // next edits remain empty
                }
                displayCurrentEmptyCityLocation();
                // log("cityIDAssigned=" + cityIDAssigned);
            } else if (cityIDAssigned != suggestedCity) {
                log("setEmptyStreetAndCity(): warnCityAssignment");
                warnCityAssignment();
                // return;
            }

            // Most code reused from WME ClickSaver 0.8.2 script from MapOMatic

            if (cityIDAssigned === 0 || cityIDAssigned === null) { // make it empty
                cityIDToSet = getEmptyCity(stateID).attributes.id;
                // log("EmptyCity used:" + cityIDToSet);
            } else {
                cityIDToSet = cityIDAssigned;
                // log("Reusing saved cityID:" + cityIDToSet);
            }

            var m_action = new MultiAction();
            m_action.setModel(W.model);

            if (W.model.hasStates()) {
                country = W.model.countries.getObjectById(state.countryID);
            } else {
                country = W.model.countries.getObjectById(W.model.countries.top.id);
            }
            addCityAction = new AddOrGetCity(state, country, ""); //why a true here in orginal script?
            m_action.doSubAction(addCityAction);

            if (segModel.attributes.primaryStreetID === null) { // process a new street
                addEsCity = W.model.cities.objects[cityIDToSet];
                newStreet = {
                    isEmpty: true,
                    cityID: cityIDToSet
                };
                targetStreet = W.model.streets.getByAttributes(newStreet)[0];
                if (!targetStreet) {
                    addStreetAction = new AddOrGetStreet("", addEsCity, true);
                    m_action.doSubAction(addStreetAction);
                    targetStreet = W.model.streets.getByAttributes(newStreet)[0];
                    if (!targetStreet) {
                        alert("No emptyStreet found in the model. Aborting edit.");
                        return;
                    }
                }
                action3 = new UpdateObject(segModel, {
                    primaryStreetID: targetStreet.id,
                    flags: unPavedAttribute
                });
                m_action.doSubAction(action3);
                W.model.actionManager.add(m_action);
                log("emptyStreet added");

            } else { // process an existing street
                alert("Processing existing streets function not yet implemented");
                return;
            }

        }

        function applyCitySegment() {
            var changedCities = [];
            var segments = W.selectionManager.getSelectedFeatures() ;

            segments.forEach(function(segment) {
                var updatedCity = updateSegmentCity(segment, cityIDAssigned);
                changedCities.push((updatedCity == "") ? "Empty" : updatedCity);
            });

            var cityIDAssginedName = W.model.cities.getObjectById(cityIDAssigned).attributes.name ;
            cityIDAssginedName = (cityIDAssginedName == "") ? "Empty" : cityIDAssginedName;
            alert("Cities: " + changedCities.join(" ; ") + " updated to " + cityIDAssginedName ); //here move to a count function e.g. x empty, x Leuven

        }

        WMEEmptyStreet.makeButton = function(receiver) {
            var _button = document.createElement("button");
            _button.id = "emptyStreetButton";
            _button.className = "btn btn-default";
            _button.style = "float: right; height: 20px;line-height: 20px;padding-left: 4px;padding-right: 4px;margin-right: 4px;padding-top: 2px; margin-top:2px";
            _button.title = "Check the emptyStreet and emptyCity checkboxes";
            _button.innerHTML = shortcutEmptyStreet;
            _button.onclick = function() {
                setEmptyStreetAndCity(W.selectionManager.getSelectedFeatures()[0]);
            };
            receiver.append(_button);
        };

        // check for changes in the edit-panel
        var emptyStreetObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Mutation is a NodeList and doesn't support forEach like an array
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    // Only fire up if it's a node
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        var emptyStreetDiv = addedNode.querySelector('div.clearfix.preview');
                        if (emptyStreetDiv) {
                            // intent is to process 1 street at a time, just after creation for multi selections please use other scripts or upgrade this one .
                            var newSegmentCount = countNewSegments();
                            var selectionlength = W.selectionManager.getSelectedFeatures().length;
                            if (newSegmentCount == 1 && selectionlength == 1) {
                                WMEEmptyStreet.makeButton(emptyStreetDiv);
                            }
                        }

                    }
                }
            });
        });


        function emptyStreetPatchDrawSegment(t) {
            // Make sure the emptyStreet does not run after a cancelled edit event.
            var newFunction = {
                func: function() {
                    if (invokeEmptyStreetToggle) {
                        emptyStreetToggle = true;
                        invokeEmptyStreetToggle = false;
                    } else {
                        emptyStreetToggle = false;
                    }
                }
            };
            var orginalFunction = W.accelerators.events.listeners.drawSegment[0];
            W.accelerators.events.listeners.drawSegment.unshift(newFunction);
        }

        function resetCityAssignment() {
            var segments = W.selectionManager.getSelectedFeatures();

            switch (segments.length) {
                case 0:
                    cityIDAssigned = null;
                    log("Default City " + cityIDAssigned + " reset to null");
                    break;
                case 1:
                    cityIDAssigned = W.model.streets.getObjectById(segments[0].model.attributes.primaryStreetID).cityID;
                    log("Default City changed to " + cityIDAssigned);
                    break;
                default:
                    alert("Please select zero or one segment to empty or pickup the default city");
            }
            displayCurrentEmptyCityLocation();
        }

        function WMEEmptyStreet_onSelectionChanged() {
            var suggestedCity = null;
            if (W.selectionManager.getSelectedFeatures().length == 1) {
                if (emptyStreetToggle) {
                    setEmptyStreetAndCity(W.selectionManager.getSelectedFeatures()[0]);
                }
            }
        }

        function WMEEmptyStreet_Hook() {
            emptyStreetPatchDrawSegment();
            // event on selection change
            W.selectionManager.events.register("selectionchanged", this, WMEEmptyStreet_onSelectionChanged);
            console.log("WMEEmptyStreet: Hook");
        }

        WMEKSRegisterKeyboardShortcut('WMEEmptyStreet', 'WME emptyStreet', 'emptyStreetSegment', 'Set street and city to empty', setEmptyStreetAndCityKey, shortcutEmptyStreet);
        WMEKSRegisterKeyboardShortcut('WMEEmptyStreet', 'WME emptyStreet', 'drawEmptyStreet', 'Draw street and city to empty', drawEmptyStreet, shortcutDrawAndEmptyStreet);
        WMEKSRegisterKeyboardShortcut('WMEEmptyStreet', 'WME emptyStreet', 'drawEmptyStreetUnpaved', 'Draw street and city to empty', drawEmptyStreetUnpaved, shortcutDrawAndEmptyStreetUnpaved);
        WMEKSRegisterKeyboardShortcut('WMEEmptyStreet', 'WME emptyStreet', 'resetCityAssignment', 'Reset default city', resetCityAssignment, shortcutResetCityAssignment);
        WMEKSRegisterKeyboardShortcut('WMEEmptyStreet', 'WME emptyStreet', 'applyCitySegment', 'Apply default to City', applyCitySegment, shortcutApplyCitySegment);

        WMEEmptyStreet_Hook();

        // A button for the edit panel as well
        emptyStreetObserver.observe(document.getElementById('edit-panel'), {
            childList: true,
            subtree: true
        });

        // Display the default location on top
        displayCurrentEmptyCityLocation();

    }
    setTimeout(WMEEmptyStreet_bootstrap, 3000);
