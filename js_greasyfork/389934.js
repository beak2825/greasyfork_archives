// ==UserScript==
// @name         WME SER_Outreach
// @namespace    https://greasyfork.org/en/scripts/389934-wme-ser-outreach
// @version      2020.02.28
// @description  captures editor information from WME for addition to SER outreach database
// @author       ramblinwreck_81
// @include      https://www.waze.com/en-US/editor*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js


// @downloadURL https://update.greasyfork.org/scripts/389934/WME%20SER_Outreach.user.js
// @updateURL https://update.greasyfork.org/scripts/389934/WME%20SER_Outreach.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var SO_Name = GM_info.script.name;
    var SO_Version = GM_info.script.version;
    var settings = {};
    var venuesObject;
    var eID;
    var rank;
    var geoOffset = 'nada';

    function SO_log(message) {
        console.log(`SER Outreach: ${message}`);
    }
    function bootstrap(tries) {
        SO_log(`bootstrap`);
        tries = tries || 1;

        if (W && W.map &&
            W.model && W.loginManager.user &&
            $ ) {
            SO_init();
//            tabBuilder();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function SO_init() {
        // Check document elements are ready
        var userInfo = document.getElementById("user-info");
        var newEdName = "";
        if (userInfo === null) {
            window.setTimeout(SO_init, 500);
            return;
        }
        var userTabs = document.getElementById("user-tabs");
        if (userTabs === null) {
            window.setTimeout(SO_init, 500);
            return;
        }
        var navTab = userInfo.getElementsByTagName("ul");
        if (navTab.length === 0) {
            window.setTimeout(SO_init, 500);
            return;
        }
        if (typeof navTab[0] === "undefined") {
            window.setTimeout(SO_init, 500);
            return;
        }
        var tabContent = userInfo.getElementsByTagName("div");
        if (tabContent.length === 0) {
            window.setTimeout(SO_init, 500);
            return;
        }
        if (typeof tabContent[0] === "undefined") {
            window.setTimeout(SO_init, 500);
            return;
        }
        var editorURL = '';
        SO_addUserTab();
        SO_addFormBtn();
        function SO_addFormBtn() {
            SO_log(`adding form button`);
            var selection = W.selectionManager.getSelectedFeatures();
            var SODiv = document.createElement("div"),
                SOMnu = document.createElement("select"),
                SOBtn = document.createElement("button");
            var formWindowName = "SER Outreach result",
                formWindowSpecs = "resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0";
            var editPanel,
                selElem,
                formLink;
           SODiv.id = "SER Outreach Div";
            editPanel = document.getElementById("edit-panel");
            selElem = editPanel.getElementsByClassName("selection");
            if (selection.length === 0) { // || selection[0].model.type !== "segment") {
                //formfiller_log("No segments selected.");
                return;
            }
            if (document.getElementById("SEROutreachDiv")) {
                //formfiller_log("Div already created");
                return;
            }

           var forms = [{
                name: "SER Outreach",
                // testing url: "https://docs.google.com/forms/d/e/1FAIpQLSd1Pb1wMLrzKRaXTfQMW1t4FP976WxuPVHognsGrEX4tjis3g/viewform",
                url: "https://docs.google.com/forms/d/e/1FAIpQLSeZ41NxN-kBQmCvvmMtmqLFYPVOGMmCRgZHnLhgofSHKTPY8A/viewform",
                fields: {
                    reporter: "1640561694",
                    profileLink: "37823008",
                    permalink: "1104282593",
                    state: "1743717821",
                    //ed: "343499315",
                    //nameOfVenue: "418181794",
                    editorRank: "1217937573"
                }
            }];

            forms.forEach(function (key, i) {
                SOMnu.options.add(new Option(forms[i].name, i));
            });
            SOBtn.innerHTML = "Go to Form";
            SOBtn.onclick = function () {
                //alert(ffMnu.options[ffMnu.selectedIndex].value+": "+forms[ffMnu.options[ffMnu.selectedIndex].value].name);
                SO_saveSettings();
                formLink = SO_createFormLink(forms[SOMnu.options[SOMnu.selectedIndex].value]);
                if (typeof formLink === "undefined") {
                    return;
                }

                if ($("#SO-open-in-tab").prop("checked")) {
                    window.open(formLink, "_blank");
                } else {
                    window.open(formLink, formWindowName, formWindowSpecs);
                }
            };
            SODiv.appendChild(SOMnu);
            SODiv.appendChild(SOBtn);
            selElem[0].appendChild(SODiv);

            return;
    } // end of SO_addFormBtn


        function createURL(selection)
        {
            var permalink = "https://www.waze.com/en-US/editor?",
            segIDs = [];
            var latLon;
            var lat;
            var lon;
            var env = W.location ? W.location.code : W.app.getAppRegionCode();
            var zoom = W.map.olMap.zoom;
 //           var latOffset;
//            var lonOffset;
//            var zoomOffset;
            var type;
            var rank = venuesObject.rank + 1;
//            geoOffset = setGeoOffset(rank);
//            zoomOffset = setZoom(rank);
            if (W.selectionManager.getSelectedFeatures()[0].model.type === "venue") { // code for selection is a place venue
                if(W.selectionManager.getSelectedFeatures()[0].model.isPoint())

                { // get lat and lon for point place
                    latLon = selection[0].geometry.transform(W.map.olMap.projection.projCode, W.map.olMap.displayProjection.projCode);
                    lat = latLon.y;
                    lon = latLon.x;
                    // lon = selection[0].geometry.transform(W.map.displayProjection.projCode).x;

                } else

                { // get lat and lon for area place
                    latLon = W.map.center.clone().transform(W.map.olMap.projection.projCode, W.map.olMap.displayProjection.projCode);
                    lat = latLon.lat;
                    lon = latLon.lon;
                }
                permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoom=" + zoom.toString() + "&venues=" + W.selectionManager.getSelectedFeatures()[0].model.attributes.id;
//                permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoom=" + zoom.toString() + "&venues=" + W.selectionManager.getSelectedFeatures()[0].model.attributes.id;

            } else { // code for if selection is a segment(s)
                type = 'segments'
 //               var zoomToRoadType = W.Config.segments.zoomToRoadType;
                var i;
                //To get lat and long centered on segment
                if (selection.length === 1) {
                    latLon = selection[0].model.getCenter().clone();
                    latLon.transform(W.map.olMap.projection.projCode, W.map.olMap.displayProjection.projCode);
                    lat = latLon.y;
                    lon = latLon.x;
                }
                               var zoomToRoadType = function (e)
                {
                    switch (e)
                    {
                        case 0:
                        case 1:
                            return [];
                        case 2:
                            return [2, 3, 4, 6, 7, 15];
                        case 3:
                            return [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        default:
                            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                   }
                };
                for (i = 0; i < selection.length; i += 1) {
                    var segment = selection[i].model;
                    if (segment.type === "segment")
                    {
                        segIDs.push(segment.attributes.id);
                        if (zoomToRoadType(zoom) === 0 || zoomToRoadType(zoom).indexOf(segment.attributes.roadType) === -1)
                        {
                            alert("This zoom level (" + zoom.toString() + ") cannot be used for this road type! Please increase your zoom:\n" +
                                  "Streets: 4+\nOther drivable and Non-drivable: 3+\nHighways and PS: 2+");
                            SO_log("Zoom level not correct for segment: " + zoom.toString() + " " + segment.attributes.roadType.toString());
                            return;
                        }
                    }
                }
                permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoom=" + zoom.toString() + "&" + type + "=" + segIDs.join();
            } // end of model.type if test
            return permalink;
        } // end of createURL function

        function SO_getLastEditor(selection) {
            var editorNames = "";
            if(selection[0].model.type === "venue") {
                if(selection[0].model.attributes.residential) {
                    return venuesObject.userName;

                } else { // it's a venue but not an RPP
 //                   editorNameConcat(selection);
                    return venuesObject.userName;
                }
            } else { // it's not a venue, it's a segment or segments
                editorNameConcat(selection)
                return editorNames;
            }

            function editorNameConcat(mapObject){
    debugger;
                mapObject.forEach(function (selected) {
                    eID = selected.model.attributes.updatedBy;
                    if (typeof eID === "undefined" || eID < 0)
                    {
                        SO_log(`Unable to get updatedBy on ${selected.model.attributes.id}`);
                        eID = selected.model.attributes.createdBy;
                    }
                    newEdName = W.model.users.getObjectById(eID).userName;
                    if (editorNames.indexOf(newEdName) === -1) {
                        editorNames += ", " + newEdName;
                    }
                });
                editorNames = editorNames.substr(2);
                return editorNames;
            }
        }
        function SO_createFormLink(formSel) {
        var selection = W.selectionManager.getSelectedFeatures();
        var formValues = {};
        var formFields = formSel.fields;
        var formLink = formSel.url + "?entry.";
        var formArgs = [];
        if (selection.length === 0) { // || selection[0].model.type !== "segment") {
            SO_log(`Nothing selected.`);
            return;
        } else
        {
            venuesObject = obtainVenuesObject();
   debugger;
            checkForVenue();
        }
        function checkForVenue()
        {
            if (venuesObject === undefined)
            {
                setTimeout (function()
                            {
                               checkForVenue();
                            }, 200);
            } else
            {
                completeForm();
                return;
            }
        }

        function obtainVenuesObject()
        {
           var venueEditor;
           var a;
           var selection = W.selectionManager.getSelectedFeatures();
           var eID;
           if(selection[0].model.type === "venue" && (selection[0].model.attributes.residential)) {
               console.log('RPP');
               var objId = selection[0].model.attributes.id;
               var objUrl = "https://www.waze.com/Descartes/app/ElementHistory?objectType=venue&objectID=" + objId;
               a = $.ajax({
                   url:objUrl,
                   datatype: 'json',
                   success: function(data) {
                       SO_log(`Descartes API call complete`)
                   },
                   async: false
               }).responseJSON.users.objects[0];
               console.log(a);
               return a;
            } else { // it's either a point place, area place or segment but not an RPP
                eID = selection[0].model.attributes.updatedBy;
                if (typeof eID === "undefined") {
                    SO_log(`Unable to get updatedBy on ${selection[0].model.attributes.id}`);
                    eID = selection[0].model.attributes.createdBy;
                }
                venueEditor = W.model.users.getObjectById(eID);
                return venueEditor;
           }
        }
        function SO_getState(selection) {
            var stateName = "",
                i;
            var venueStreetId;
            var cID;
            for (i = 0; i < selection.length; i += 1) {
                debugger;
                if(selection[0].model.type === "venue")
                {
                    venueStreetId = selection[i].model.attributes.streetID;
                    cID = W.model.streets.getObjectById(venueStreetId).cityID;ß
                } else
                {
                    if(W.model.streets.getObjectById(selection[i].model.attributes.primaryStreetID) !== null)
                       {
                           cID = W.model.streets.getObjectById(selection[i].model.attributes.primaryStreetID).cityID;
                       } else
                       {
                           alert('Since this is a red road, the script is unable to add the State name to the form.  Please manually add this information.');
                           return stateName;
                       }

                }
                var sID = W.model.cities.getObjectById(cID).attributes.stateID;
                var newState = W.model.states.getObjectById(sID).name;

                if (newState === "") {
                    sID = W.model.cities.getObjectById(cID).attributes.countryID;
                    newState = W.model.countries.getObjectById(sID).name;
                    SO_log("cID: " + cID);
                    SO_log("sID: " + sID);
                    SO_log("newState: " + newState);
                }

                if (stateName === "") {
                    stateName = newState;
                } else if (stateName !== newState) {
                    stateName = "";
                    break;
                }
            }
            return stateName;
        }
        function completeForm()
        {
            var edName = "";
  debugger;
            Object.keys(formFields).forEach(function (key, index) {
                switch (key) {

                    case "reporter":
                        debugger;
                        formValues[key] = W.loginManager.user.userName;
                        break;
                    case "profileLink":
                        edName = SO_getLastEditor(selection);
                        formValues[key] = "https://www.waze.com/user/editor/" + edName;
                        break;
                    case "permalink":
    debugger;
                        formValues[key] = createURL(selection);
                        if (typeof formValues.permalink === "undefined") {
                            SO_log(`No permalink generated`);
                            return;
                        }
                        break;
                    case "state":
                        formValues[key] = SO_getState(selection);
                        break;

                    case "editorRank":
                        if(selection[0].model.type === 'venue')
                        {
                            formValues[key] = venuesObject.rank + 1;
                        } else
                        {
                            formValues[key] = W.model.users.getObjectById(eID).rank + 1;
                        }
                        break;
                    default:
                        SO_log(`Nothing defined for ${key}`);
                        break;
                }

                //Add entry to form URL, if there's something to add
                if (typeof formValues[key] !== "undefined" && formValues[key] !== "") {
                    formArgs[index] = formFields[key] + "=" + encodeURIComponent(formValues[key]);
                }
            });
        }
        formLink += formArgs.join("&entry.");

        SO_log(`${formLink}`);
            debugger;
            console.log('formLink: ', formLink);
        return formLink;
    }  // end of createFormLink

        var SEROutreachObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // Mutation is a NodeList and doesn't support forEach like an array
                for (var i = 0; i < mutation.addedNodes.length; i += 1) {
                    var addedNode = mutation.addedNodes[i];

                    // Only fire up if it's a node
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        var selectionDiv = addedNode.querySelector("div.selection");

                        if (selectionDiv) {
                            SO_addFormBtn();
                        }
                    }
                }
            });
        });
        SEROutreachObserver.observe(document.getElementById("edit-panel"), {
            childList: true,
            subtree: true
        });
        debugger;
        if (W.app.modeController) {
            W.app.modeController.model.bind("change:mode", function (model, modeId) {
                if (modeId === 0) {
                   SO_addUserTab();
                }
            });
        }

        // Unit switched (imperial/metric)
        if (W.prefs) {
            W.prefs.on("change:isImperial", SO_addUserTab);
        }

        if (!W.selectionManager.getSelectedFeatures) {
            W.selectionManager.getSelectedFeatures = W.selectionManager.getSelectedItems;
        }
        SO_log(`Init done`);
        return;
    } //end of SO_init

    function tabBuilder()
    {
        var $section = $("<div>");
        $section.html([
            '<div>',
            '<h2>SO_Tab</h2>',
            '<input type="checkbox" id="SO_Enabled" class="SO_SettingsCheckbox"><label for="SO_Enabled">Enable This Script</label>',
            '<hr>',
            '<hr>',
            '<div>',
            '</div>',
            '</div>'
        ].join(' '));
    } // end of tabBuilder function
    function SO_addUserTab()
    {
        SO_log(`adding tab`);
        var userInfo = document.getElementById("user-info"),
            userTabs = document.getElementById("user-tabs"),
            navTabs = userTabs.getElementsByClassName("nav-tabs"),
            tabContent = userInfo.getElementsByClassName("tab-content");
        var SOTab = document.createElement("li"),
            SOPanel = document.createElement("div"),
            SONewTabBox = document.createElement("input"),
            SONewTabLabel = document.createElement("label"),
            SOTabInfo = document.createElement("div");
debugger;
        SOTab.innerHTML = '<a title="SER Outreach" href="#sidepanel-SER_Outreach" data-toggle="tab">SER Outreach</a>';
        SOPanel.id = "sidepanel-SER_Outreach";
        SOPanel.className = "tab-pane";
        SO_log(`name: ${SO_Name}, Version: ${SO_Version}`);
        SOTabInfo.innerHTML = '<b>' + SO_Name + '</b> v' + SO_Version;
        SONewTabBox.id = "SO-open-in-tab";
        SONewTabBox.type = "checkbox";
        SONewTabBox.name = "SO_open_tab";
        SONewTabLabel.innerHTML = "Open form in new tab";
        SONewTabLabel.for = "SO_open_tab";
        SOPanel.appendChild(SOTabInfo);
        SOPanel.appendChild(SONewTabBox);
        SOPanel.appendChild(SONewTabLabel);
        navTabs[0].appendChild(SOTab);
        tabContent[0].appendChild(SOPanel);
        SO_loadSettings();

    }
    function SO_loadSettings()
    {

        var SOOpenInTab = localStorage.getItem("SO-open-in-tab");
        if (SOOpenInTab === "1") {
            $("#SO-open-in-tab").trigger("click");
        }
        return;
    }

    function SO_saveSettings()
    {
        if ($("#SO-open-in-tab").prop("checked")) {
            localStorage.setItem("SO-open-in-tab", "1");
        } else {
            localStorage.setItem("SO-open-in-tab", "0");
        }
        return;
    }

})();