// ==UserScript==
// @name           WME Venue Editor
// @description    Search and replace city or street names in venues, or add parking
// @namespace      russblau.waze@gmail.com
// @grant          none
// @version        2025.08.20.01
// @require        https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @match          https://www.waze.com/editor*
// @match          https://beta.waze.com/editor*
// @match          https://www.waze.com/*/editor*
// @match          https://beta.waze.com/*/editor*
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @author         russblau
// @license        MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/488580/WME%20Venue%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/488580/WME%20Venue%20Editor.meta.js
// ==/UserScript==

/* global jQuery, getWmeSdk, turf */
/* jslint esversion: 11 */

(function($) {
    'use strict';

    if (window.location.href.includes("showpur=")) {
        let newloc = window.location.href
                .replace("showpur=", "venues=")
                .replace("&endshow=", "")
                .replace("&endshow", "")
                .replace("/?", "?")
                .replace("zoom=5", "zoomLevel=19");
        if (! newloc.includes("env=usa")) {
            newloc = `${newloc}&env=usa`;
        }
        window.location.href = newloc;
    }

    window.SDK_INITIALIZED.then(WMEVE_init);

    function WMEVE_init() {

        function WMEVE_log(message) {
            if (typeof message === 'string') {
                console.log('WMEVE: ' + message);
            } else {
                console.log('WMEVE: ', message);
            }
        }

        function updateCityandStreetLists(e) {
            function fullStreetName(street) {
                const name = street.name;
                if (street.cityId) {
                    const cityname = WME.DataModel.Cities.getById({cityId: street.cityId})?.name;
                    if (cityname) {
                        return `${name}, ${cityname}`;
                    }
                }
                return `${name} [no city]`;
            }

            const cities = WME.DataModel.Cities.getAll();
            cities.sort(c => c.name);
            cityids = {};
            let name;
            const cityitems = ["<option>  </option>"];
            const citynames = cities.map(c => c.name);
            for (let c of cities) {
                name = c.name;
                if (name == '') {
                    name = " No city, " + WME.DataModel.States.getById({stateId: c.stateId}).name;
                } else if (citynames.filter(y => y == name).length > 1) {
                    name = name + ", " + WME.DataModel.States.getById({stateId: c.stateId}).name;
                }
                cityitems.push(`<option>${name}</option>`);
                cityids[name.trimStart()] = c.id;
            }
            cityitems.sort();
            $('#VEOldCity').empty().append(cityitems);
            $('#VENewCity').empty().append(cityitems.filter(z => ! z.includes("No city, ")));

            const streets = WME.DataModel.Streets.getAll();
            streetids = {};
            const streetitems = ["<option>  </option>"];
            const streetnames = streets.map(fullStreetName);
            for (let s of streets) {
                name = fullStreetName(s);
                if (name == '') {
                    name = "[unnamed]";
                } else if (streetnames.filter(y => y == name).length > 1) {
                    name = name + ", " + WME.DataModel.States.getById({stateId: WME.DataModel.Cities.getById({cityId: s.cityId})?.stateId}).name;
                }
                streetitems.push(`<option>${name}</option>`);
                streetids[name.trimStart()] = s.id;
            }
            streetitems.sort();
            $('#VEOldStreet').empty().append(streetitems);
            $('#VENewStreet').empty().append(streetitems.filter(z => ! z.includes("[unnamed]")));
        }

        function selectionchanged() {
            // check whether there is currently a selected area place
            const selection = WME.Editing.getSelection();
            if (selection === null || selection.ids.length === 0) {
                $('#VEarea').prop('checked', false).attr('disabled', true);
            } else {
                if (selection.objectType === "venue" && WME.DataModel.Venues.getById({venueId: selection.ids[0]}).geometry.type === "Polygon") {
                    $('#VEarea').attr('disabled', false);
                } else if (selection.objectType === "mapComment" && WME.DataModel.MapComments.getById({mapCommentId: String(selection.ids[0])}).geometry.type === "Polygon") {
                    $('#VEarea').attr('disabled', false);
                } else {
                    $('#VEarea').prop('checked', false).attr('disabled', true);
                }
            }
        }

        function onsubmit(e) {
            if ($("#VEcity").prop("checked")) {
                const oldcityval = $('#VEOldCity').val();
                var oldcityId = cityids[oldcityval];
                const newcityval = $('#VENewCity').val();
                var newcityId = cityids[newcityval];
                $('#VEError').text('');
                // validate
                if (!oldcityId || !newcityId || oldcityId == newcityId) {
                    $('#VEError').text('Error: Must provide two distinct city names.');
                    return;
                }
            }
            if ($("#VEstreet").prop("checked")) {
                const oldstreetval = $('#VEOldStreet').val();
                var oldstreetId = streetids[oldstreetval];
                const newstreetval = $('#VENewStreet').val();
                var newstreetId = streetids[newstreetval];
                $('#VEError').text('');
                if (!oldstreetId || !newstreetId || oldstreetId == newstreetId) {
                    $('#VEError').text('Error: Must provide two distinct street names.');
                    return;
                }
            }

            const view = turf.bboxPolygon(WME.Map.getMapExtent());
            const area = function () {
                if ($('#VEarea').prop("checked")) {
                    const selected = WME.Editing.getSelection();
                    if (selected.objectType === "venue") {
                        return WME.DataModel.Venues.getById({venueId: selected.ids[0]});
                    } else if (selected.objectType === "mapComment") {
                        return WME.DataModel.MapComments.getById({mapCommentId: String(selected.ids[0])});
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }();
            let newAttrs;
            let addr;
            let street;

            function within(feature, boundary) {
                // feature: Point|Polygon; boundary: Polygon
                if (boundary.type !== "Polygon") {
                    throw new Error("within: boundary must be Polygon");
                }
                if (feature.type === "Point") {
                    return turf.pointsWithinPolygon(turf.feature(feature), boundary).features.length > 0;
                }
                if (feature.type === "Polygon") {
                    return turf.intersect(turf.featureCollection([turf.feature(feature), turf.feature(boundary)])) !== null;
                }
                throw new Error("within: feature must be Point or Polygon");
            }

            // loop through all venues
            for (const venue of WME.DataModel.Venues.getAll()) {
                if ($('#VEvisible').prop("checked") && !within(venue.geometry, view.geometry)) {
                    // skip venue not on screen
                    continue;
                }
                if (area !== null && !within(venue.geometry, area.geometry)) {
                    // skip venue not in selected area
                    continue;
                }
                addr = WME.DataModel.Venues.getAddress({venueId: venue.id});
                if (addr.isEmpty) {
                    continue;
                }
                if ($('#VEcity').prop("checked") && (addr.city.id === oldcityId) && (addr.street !== null)) {
                    newAttrs = { venueId: venue.id };
                    if (addr.houseNumber) {
                        newAttrs.houseNumber = addr.houseNumber;
                    }
                    street = WME.DataModel.Streets.getStreet(
                            {cityId: newcityId, streetName: addr.street.name}
                        ) ?? WME.DataModel.Streets.addStreet({cityId: newcityId, streetName: addr.street.name});
                    newAttrs.streetId = street.id;
                    WME.DataModel.Venues.updateAddress(newAttrs);
                }
                if ($('#VEstreet').prop("checked") && (addr.street.id === oldstreetId)) {
                    newAttrs = { venueId: venue.id, streetId: newstreetId };
                    if (addr.houseNumber) {
                        newAttrs.houseNumber = addr.houseNumber;
                    }
                    WME.DataModel.Venues.updateAddress(newAttrs);
                }
                if ($('#VEparking').prop("checked")) {
                    if (! (venue.categories.includes("RESIDENTIAL") || venue.categories.includes("PARKING_LOT"))) {
                        const svcs = Array.from(venue.services);
                        if (! svcs.includes("PARKING_FOR_CUSTOMERS")) {
                            svcs.push("PARKING_FOR_CUSTOMERS");
                            WME.DataModel.Venues.updateVenue( { venueId: venue.id, services: svcs });
                        }
                    }
                }
            }
        }

        function togglecity() {
            if ($("#VEcity").prop("checked")) {
                $("#VECityDiv").show();
            } else {
                $("#VECityDiv").hide();
            }
        }

        function togglestreet() {
            if ($("#VEstreet").prop("checked")) {
                $("#VEStreetDiv").show();
            } else {
                $("#VEStreetDiv").hide();
            }
        }

        WMEVE_log("Script loaded.");
        let cityids, streetids;
        const WME = getWmeSdk({scriptId: "WMEVE", scriptName: "Venue Editor"});

        WME.Events.once({ eventName: "wme-ready" }).then(() => {
            WME.Sidebar.registerScriptTab().then(r => {
                // build a dialog box
                r.tabLabel.innerText = 'VE';
                r.tabLabel.title = 'Venue Editor';
                $(r.tabLabel).on("click", updateCityandStreetLists);
                r.tabPane.innerHTML = '<h1>Venue Editor</h1>' +
                    '<div id="VEdiv">' +
                    '<div id="VEError" style="color:red"></div>' +
                    '<input type="checkbox" id="VEcity" unchecked>' +
                    '<label for="VEcity">City</label>' +
                    '<div id="VECityDiv">' +
                    '<label for="VEOldCity">Old city name</label>' +
                    '<select name="oldcity" id="VEOldCity"></select>' +
                    '<br><label for="VENewCity">New city name</label>' +
                    '<select name="newcity" id="VENewCity"></select>' +
                    '</div>' +
                    '<br><input type="checkbox" id="VEstreet" unchecked>' +
                    '<label for="VEstreet">Street</label>' +
                    '<div id="VEStreetDiv">' +
                    '<label for="VEOldStreet">Old street name</label>' +
                    '<select name="oldstreet" id="VEOldStreet"></select>' +
                    '<br><label for="VENewStreet">New street name</label>' +
                    '<select name="newstreet" id="VENewStreet"></select>' +
                    '</div>' +
                    '<br><input type="checkbox" id="VEparking" unchecked>' +
                    '<label for="VEparking">Add customer parking</label>' +
                    '<br><input type="checkbox" id="VEvisible" name="visible" checked>' +
                    '<label for="VEvisible">On screen only</label>' +
                    '<br><input type="checkbox" id="VEarea" name="area" disabled>' +
                    '<label for="VEarea">Within selected area only</label>' +
                    '<br><button type="button" id="VEsubmit">Edit</button>' +
                    '</div>';
                $('#VEsubmit').on("click", onsubmit);
                $('#VEcity').on("change", togglecity);
                togglecity();
                $('#VEstreet').on("change", togglestreet);
                togglestreet();
                WME.Events.on({eventName:'wme-selection-changed', eventHandler:selectionchanged});
                WMEVE_log("Tab initialized.");
            });
            if (window.location.href.includes("venues=")) {
                const venueInfo = window.location.href.match(/venues=([0-9.]*)&/);
                const showVenue = function (tries=1) {
                    if (tries > 1000) {
                        return;
                    }
                    try {
                        WME.DataModel.Venues.showVenueUpdateRequestDialog({venueId: venueInfo[1]});
                    } catch (e) {
                        setTimeout(() => showVenue(tries++), 100);
                    }
                };
                if (venueInfo) {
                    showVenue();
                }
            }
        });
    }

})(jQuery);