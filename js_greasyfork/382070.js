// ==UserScript==
// @name         WME Review Edits
// @namespace    https://greasyfork.org/en/scripts/382070-wme-reviewedits
// @version      2024-09-25
// @description  copies information from WME and adds to google sheet for record of reviewed edits.
// @author       ramblinwreck_81
// @match         https://*.waze.com/*editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js

// @downloadURL https://update.greasyfork.org/scripts/382070/WME%20Review%20Edits.user.js
// @updateURL https://update.greasyfork.org/scripts/382070/WME%20Review%20Edits.meta.js
// ==/UserScript==
//  Much credit to crazycaveman's form filler script where a lot of this code came from./*global W, $, WazeWrap */

(function() {
    'use strict';

    var RE_Name = GM_info.script.name;
    var RE_Version = GM_info.script.version;
    var settings = {};
    var venuesObject;
    var eID;
    var rank;
    var geoOffset = 'nada';
    var objectType = '';
    var RE_Element = "";
    var maxSelectedSegments = 0;

    const objEditor = {
        name: "",
        iD: "",
        rank: "",
        date: ""
    }

    function RE_log(message) {
        console.log(`Review Edits: ${message}`);
    }


    if(W?.userscripts?.state.isReady) {
        console.log("user:", W.loginManager.user);
        console.log("segments", W.model.segments.getObjectArray());
    } else {
        document.addEventListener("wme-ready", RE_init, {
            once: true,})
    }
    getUserName(); // looks on editor profile page for reviewed editor info
    function getUserName(tries = 0) {
        if (window.location.href.indexOf("https://www.waze.com/user/editor/") > -1)
        {
            if ((W.EditorProfile.data == undefined) && tries < 30) {
                setTimeout(() => getUserName(++tries), 100);

            } else {
                localStorage.setItem("reviewEditsEditor", W.EditorProfile.data.username);
                localStorage.setItem("RE_rank", W.EditorProfile.data.rank + 1);
                localStorage.setItem("RE_eID", W.EditorProfile.data.userID);
 //               profilePageTested = true;
            }
        }

    }

    function RE_init(){
        console.log('good results');
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("SER Review Edits");

        tabLabel.innerText = 'SER Review Edits';
        //    tabLabel.title = 'Cool script';
        tabPane.innerHTML = tabBuilder();
        //    tabPane.innerHTML = "<h1>HELLO WORLD!</h1>";

        tabPane.addEventListener("element-connected", () => {
            // at this point the tabPane is in the DOM
            RE_log('tab pane added')
            RE_addUserTab();
        }, { once: true });


        var newEdName = "";
        var editorURL = '';
        var RE_Element;

         W.selectionManager.events.on('selectionchanged', evt => {
             RE_Element = document.getElementById("reviewEditsDiv");
             if(!(RE_Element)) {
                 const model = evt.detail.selected[0]?._wmeObject;
                 if(model?.type === 'segment') {
                     objectType = 'segment';
 //                    if (evt.selected.length === 1){ // && maxSelectedSegments === 1) {
                         RE_waitForSegmentEditDiv(RE_addFormBtn);
//                     } else {
//                     }
                 }
                 if(model?.type === 'venue' || model?.type === 'residential') {

                     if (evt.detail.selected.length === 1) {

                         objectType = 'venue';
                         RE_waitForSegmentEditDiv(RE_addFormBtn);

                     }
                 }
             }
         });
        function RE_waitForSegmentEditDiv(callback, callCount = 0) {
            const div_S = $('div.segment-edit-section');
            const div_V = $('div.venue-edit-section');
            if ((div_S.length) || (div_V.length)) {
                RE_log('div_S: ' + div_S.length + 'div_V.length: ' + div_V.length);
                const selection = W.selectionManager.getSelectedWMEFeatures()[0];
                callback();
                RE_log('callcount: ' + callCount);
            } else if (callCount < 30) {
                setTimeout(() => RE_waitForSegmentEditDiv(callback, ++callCount), 100);
            }
        }
        function RE_addFormBtn() {
            RE_log(`adding form button`);
            const selection = W.selectionManager.getSelectedWMEFeatures();
            var REDiv = document.createElement("div"),
                REMnu = document.createElement("select"),
                REBtn = document.createElement("button");
            var formWindowName = "Review Edits result",
                formWindowSpecs = "resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0";
            var editPanel,
                selElem,
                formLink;
            REDiv.id = "reviewEditsDiv";
            REDiv.className = "reviewEditsWrapper";
            //          REDiv.id = "reviewEditsDiv";
            editPanel = document.getElementById("edit-panel");
            RE_Element = "div." + objectType + "-feature-editor";
            selElem = document.querySelector(RE_Element);
            if (selection.length === 0) {
                console.log('no selection has been made');
            }
            if (document.getElementById("reviewEditsDiv") !='undefined' && document.getElementById("reviewEditsDiv") != null) {
                RE_log('element reviewEditsDiv already exists and you are adding another.')
            }

            var forms = [{
                name: "SER Editor Review",
                // testing url: "https://docs.google.com/forms/d/e/1FAIpQLSepKZpDjeHySl95eArUn5iwTuOTUPvpz0ZvqaHg7LbvmBB1Lw/viewform",
                url: "https://docs.google.com/forms/d/e/1FAIpQLSfc27FGWsN2RoX8WXYAYZ2xVIkJ1cI8u85ezV--AYsBCVuVKg/viewform",
                fields: {
                    editDate: "150500272",
                    specificPermalink: "760385393",
                    reviewingEditor: "1935699410",
                    sentToEditorPL: "325109063",
                    editorName: "343499315",
                    nameOfVenue: "418181794",
                    editorRank: "986567855"
                }
            }];

            forms.forEach(function (key, i) {
                REMnu.options.add(new Option(forms[i].name, i));
            });
            REBtn.innerHTML = "Go to Form";
            REBtn.onclick = function ()
            {
                //alert(ffMnu.options[ffMnu.selectedIndex].value+": "+forms[ffMnu.options[ffMnu.selectedIndex].value].name);
                RE_saveSettings();
                if (localStorage.getItem("reviewEditsEditor") !== "")
                {
                    objEditor.name = localStorage.getItem("reviewEditsEditor");
                    objEditor.iD = localStorage.getItem("RE_eID");
                    objEditor.rank = localStorage.getItem("RE_rank");
                } else
                {
                    alert("No editor information is available.  Before attempting to open the review edits form, open " +
                          "the respective editor profile page. Keep the profile page open while conducting the review." );
                    RE_log("No information available for reviewed editor.");
                    return;
                }
                formLink = RE_createFormLink(forms[REMnu.options[REMnu.selectedIndex].value]);
                if (typeof formLink === "undefined")
                {
                    return;
                }

                if ($("#RE-open-in-tab").prop("checked"))
                {
                    window.open(formLink, "_blank");
                } else
                {
                    window.open(formLink, formWindowName, formWindowSpecs);
                }
            }; // end of onclick function
            if (selection.length > 0)
            {
                REDiv.appendChild(REMnu);
                REDiv.appendChild(REBtn);
                $(RE_Element)[0].prepend(REDiv);

                //                return;
            }
        } // end of RE_addFormBtn
        function createURL(selected)
        {
            var permalink = "https://www.waze.com/en-US/editor?",
            segIDs = [];
            var latLon;
            var lat;
            var lon;
            var glat;
            var glon;
            var env = W.location ? W.location.code : W.app.getAppRegionCode();
            var zoom = W.map.olMap.zoom;
            var latOffset;
            var lonOffset;
            var zoomOffset;
            var type;
//            var rank = venuesObject.rank + 1;
            geoOffset = setGeoOffset(rank);
            zoomOffset = 17;
            if (selected[0]._wmeObject.type === "venue")
                { // code for selection is a place venue
                    RE_log(`Venue selected!`)
                    // works for point and area places
//                     glat = selected[0]._wmeObject.attributes.geometry.y;
//                     glon = selected[0]._wmeObject.attributes.geometry.x;
//                     latLon = WazeWrap.Geometry.ConvertTo4326(glon, glat);
//                     lat = latLon.lat;
//                     lon = latLon.lon;
                    latLon = WazeWrap.Geometry.ConvertTo4326(W.map.getOLMap().center.lon, W.map.getOLMap().center.lat)
                    lat = latLon.lat;
                    lon = latLon.lon;
                    permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoomLevel=" + zoom.toString() + "&venues=" + selected[0].id;
                } else
                { // code for if selection is a segment(s)
                    type = 'segments'
                    var i;

                    latLon = WazeWrap.Geometry.ConvertTo4326(W.map.getOLMap().center.lon, W.map.getOLMap().center.lat);
                    lat = latLon.lat;
                    lon = latLon.lon;
                    //                }

                    var zoomToRoadType = function (e) {
                        switch (e) {
                            case 12:
                            case 13:
                                return [];
                            case 14:
                                return [2, 3, 4, 6, 7, 15];
                            case 15:
                                return [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                            case 16:
                            case 17:
                            case 18:
                            case 19:
                            case 20:
                            case 21:
                            case 22:
                            default:
                                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                   }
                };
                for (i = 0; i < selected.length; i += 1)
                {
                    var segment = selected[i]._wmeObject;
                    if (segment.type === "segment")
                    {
                        segIDs.push(segment.attributes.id);
                        if (zoomToRoadType(zoom) === 0 || zoomToRoadType(zoom).indexOf(segment.attributes.roadType) === -1)
                        {
                            alert("This zoom level (" + zoom.toString() + ") cannot be used for this road type! Please increase your zoom:\n" +
                                  "Streets: 16+\nOther drivable and Non-drivable: 15+\nHighways and PS: 14+");
                            RE_log("Zoom level not correct for segment: " + zoom.toString() + " " + segment.attributes.roadType.toString());
                            return;
                        }
                    }
                }
                permalink += "env=" + env + "&lon=" + lon + "&lat=" + lat + "&zoomLevel=" + zoom.toString() + "&" + type + "=" + segIDs.join();
            } // end of model.type if test
            latOffset = lat + geoOffset;
            lonOffset = lon - geoOffset;
            function setZoom(level)
            {
                switch (level)
                {
                    case 1:
                    case 2:
                        zoomOffset = 7;
                        break;
                    case 3:
                        zoomOffset = 6;
                        break;
                    case 4:
                        zoomOffset = 6;
                        break;
                    case 5:
                    case 6:
                        zoomOffset = 6;
                        break;
                }
                return zoomOffset;
            }
            function setGeoOffset(level)
            {
                // Added 1/3/20
                geoOffset = 0;
                return geoOffset;
                switch (level)
                {
                    case 1:
                    case 2 :
                        geoOffset = .003;
                        break;
                    case 3:
                        geoOffset = .004
                        break;
                    case 4:
                        geoOffset = .005
                        break;
                    case 5:
                    case 6:
                        geoOffset = .006
                        break;
                }
                return geoOffset;
            }
            var strStartURL = 'https://www.waze.com/en-US/editor?env=usa&lon=';
            var correctURL;
            var newURL;
            editorURL = strStartURL + lonOffset + '&lat=' + latOffset + '&zoomLevel=' + zoomOffset;
            return permalink;
        } // end of createURL function

        function RE_createFormLink(formSel)
        {
            const selection = W.selectionManager.getSelectedWMEFeatures();
            var formValues = {};
            var formFields = formSel.fields;
            var formLink = formSel.url + "?entry.";
            var formArgs = [];
            if (selection.length === 0)
            { // || selection[0].model.type !== "segment") {
                RE_log(`Nothing selected.`);
                return;
            } else
            {
                venuesObject = obtainVenuesObject();
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
           var editorActivities = [];
           var lastDate;
           var a;
           var selection = W.selectionManager.getSelectedWMEFeatures();
//           var eID;
           var selectedObject = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.type;
//               console.log('RPP');
               var objId = selection[0]._wmeObject.attributes.id;
               var objUrl = "https://www.waze.com/Descartes/app/ElementHistory?objectType=" + selectedObject + "&objectID=" + objId;
               a = $.ajax(
                   {
                   url:objUrl,
                   datatype: 'json',
                   data: {},
                   success: function(data)
                       {
                          console.log('Descartes API call complete.')
                       },
//                   async: true
                   }).responseJSON.transactions.objects;
               console.log(a);
               // now compare username in "objEditor" to the API returned list of usernames.
               if (objEditor.name !== "")
               {
                   a.forEach((element, index) =>
                         {
                             if ((a[index].userID).toString() === objEditor.iD )
                                 {
                                     editorActivities.push(a[index].date)
                                 }

                        });
                   console.log(editorActivities);
                   switch (editorActivities.length)
                   {
                       case 0:
                       // editor name is not on the Waze map object
                           alert("The editor under review was not located on the selected map object.  Make sure " +
                                 "the editor you are reviewing has an open profile page, and if it is already open, " +
                                 "reload the profile page and try again.  Or, search for this editor on a different map object.")
                           lastDate = 0;
                           break;
                       case 1:
                           lastDate = editorActivities[0];
                           break;
                       default:
                       // editor's name appears more than once so get the most recent edit date
                       lastDate = editorActivities[0]
                       editorActivities.forEach((element, index) =>
                           {
                               if (element > lastDate)
                           {
                               lastDate = element;
                           }
                       });
                   } // end switch
               } // end of if objEditor.name is undefined
               const date = new Date(lastDate);
               const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric'})
               objEditor.date = formattedDate;


//             { // it's either a point place, area place or segment but not an RPP
//                 eID = selection[0].attributes.wazeFeature._wmeObject.attributes.updatedBy;
//                 if (eID === null)
//                 {
//                     RE_log(`Unable to get updatedBy on ${selection[0].attributes.wazeFeature._wmeObject.attributes.id}`);
//                     eID = selection[0].attributes.wazeFeature._wmeObject.attributes.createdBy;
//                 }
//             }
//             objEditor.iD = eID;
//             objEditor.name = W.model.users.getObjectById(eID).attributes.userName;
//             objEditor.rank = W.model.users.getObjectById(eID).attributes.rank + 1;
            return objEditor
        } // end of obtainVenuesObject
        function completeForm()
        {
            var onePL;
            Object.keys(formFields).forEach(function (key, index)
                {
                    switch (key) {

                        case "reviewingEditor":
                            formValues[key] = W.loginManager.user.attributes.userName;
                            break;
                        case "specificPermalink":
                            onePL = createURL(selection);
                            formValues[key] = onePL;
                            if (typeof formValues.specificPermalink === "undefined")
                            {
                                RE_log(`No permalink generated`);
                                return;
                            }
                            break;
                    case "sentToEditorPL":
                        formValues[key] = onePL;
                        break;
                    case "editDate":
//                         var a;
//  //                       if(selection[0].attributes.wazeFeature._wmeObject.attributes.updatedOn === undefined)
//                         if(W.selectionManager.getSelectedFeatures()[0].attributes.wazeFeature._wmeObject.attributes.updatedOn === null)
//                         {
//                             a = W.selectionManager.getSelectedFeatures()[0].attributes.wazeFeature._wmeObject.attributes.createdOn;
//                         } else
//                         {
//                             a = W.selectionManager.getSelectedFeatures()[0].attributes.wazeFeature._wmeObject.attributes.updatedOn;
//                         }
//                         var b = new Date(a).toLocaleDateString();
//  //                       var b = new(Date(a).toLocaleDateString();
                        formValues[key] = objEditor.date;
                        break;
                    case "editorName":
 //                       var c = RE_getLastEditor(selection);
                        formValues[key] = objEditor.name;
                        break;
                    case "nameOfVenue":
                        if(selection[0]._wmeObject.type === 'venue')
                        {
                            if(selection[0]._wmeObject.attributes.residential === true)
                            {
                                formValues[key] = 'RPP';
                            } else
                            {
                                formValues[key] = selection[0]._wmeObject.attributes.name;
                            }
                        } else
                        {
                            formValues[key] = 'N/A';
                        }
                        break;
                    case "editorRank":
                        formValues[key] = objEditor.rank;
//                         if(selection[0].attributes.wazeFeature._wmeObject.type === 'venue')
//                         {
//                             formValues[key] = venuesObject.rank + 1;
//                         } else
//                         {
//                             formValues[key] = W.model.users.getObjectById(eID).rank + 1;
//                         }
                        break;
                    default:
                        RE_log(`Nothing defined for ${key}`);
                        break;
                } // end of switch

                //Add entry to form URL, if there's something to add
                if (typeof formValues[key] !== "undefined" && formValues[key] !== "")
                {
                    formArgs[index] = formFields[key] + "=" + encodeURIComponent(formValues[key]);
                }
            });
        } // end of completeForm
        formLink += formArgs.join("&entry.");
        if (objEditor.date === "12/31/1969")
        {
            return;
        } else
        {
            RE_log(`${formLink}`);
            objEditor.name = '';
            objEditor.rank = '';
            objEditor.iD = '';
            return formLink;
        }
    } // end of createFormLink


        // Unit switched (imperial/metric)
        if (W.prefs)
        {
            W.prefs.on("change:isImperial", RE_addUserTab);
        }

        if (!W.selectionManager.getSelectedWMEFeatures)
        {
            W.selectionManager.getSelectedWMEFeatures = W.selectionManager.getSelectedItems;
        }
        RE_log(`Init done`);
        return;
    } //end of RE_init
    function tabBuilder()
    {
        var $section = $("<div>");
        $section.html([
            '<div id="SER Review Edits">',
            '<h2>Review Edits</h2>',
            '<input type="checkbox" id="RE_Enabled" class="RE_SettingsCheckbox"><label for="RE_Enabled">Enable This Script</label>',
            '<hr>',
            '<hr>',
            '<div>',
            '</div>',
            '</div>'
        ].join(' '));
        return $section.html();
    } // end of tabBuilder function

    function RE_addUserTab()
    {
        RE_log(`adding tab`);
        var userInfo = document.getElementById("SER Review Edits"),
            REPanel = document.createElement("div"),
            RENewTabBox = document.createElement("input"),
            RENewTabLabel = document.createElement("label"),
            RETabInfo = document.createElement("div");
        REPanel.id = "sidepanel-reviewEdits";
        REPanel.className = "tab-pane";
        RE_log(`name: ${RE_Name}, Version: ${RE_Version}`);
        RETabInfo.innerHTML = '<b>' + RE_Name + '</b> v' + RE_Version;
        RENewTabBox.id = "RE-open-in-tab";
        RENewTabBox.type = "checkbox";
        RENewTabBox.name = "RE_open_tab";
        RENewTabLabel.innerHTML = "Open form in new tab";
        RENewTabLabel.for = "RE_open_tab";
        REPanel.appendChild(RETabInfo);
        REPanel.appendChild(RENewTabBox);
        REPanel.appendChild(RENewTabLabel);
        userInfo.appendChild(REPanel);
        RE_loadSettings();

    }
    function RE_loadSettings()
    {

        var REOpenInTab = localStorage.getItem("RE-open-in-tab");
        if (REOpenInTab === "1") {
            $("#RE-open-in-tab").trigger("click");
        }
        return;
    }

    function RE_saveSettings()
    {
        if ($("#RE-open-in-tab").prop("checked"))
        {
            localStorage.setItem("RE-open-in-tab", "1");
        } else {
            localStorage.setItem("RE-open-in-tab", "0");
        }
        return;
    }
})();