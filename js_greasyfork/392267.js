// ==UserScript==
// @name         WME City Merge Place Address Fixer
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2020.05.27.01
// @description  Helps fix the address on places missing an address in WME after a city name merge
// @author       Joyriding
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/forum/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392267/WME%20City%20Merge%20Place%20Address%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/392267/WME%20City%20Merge%20Place%20Address%20Fixer.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global $ */
/* golbal _ */
/* global WazeWrap */
/* global Backbone */
/* global require */

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if (W && W.map &&
            W.model && W.loginManager.user &&
            WazeWrap.Ready && $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log('Place address fixer init');
        let updateDesc = 'Initial release.<br><br>';
        //WazeWrap.Interface.ShowScriptUpdate('City Merge Place Address Fixer', GM_info.script.version, updateDesc);

        W.selectionManager.events.register("selectionchanged", null, checkForAddress);
        if(W.selectionManager.hasSelectedFeatures())
        {
            checkForAddress();
        }
    }

    function checkForAddress()
    {
        if(W.selectionManager.hasSelectedFeatures() && W.selectionManager.getSelectedFeatures()[0].model.type =="venue")
        {
            var venue = W.selectionManager.getSelectedFeatures()[0].model.attributes;
            var link = {};

            var venuePt = new OpenLayers.Geometry.Point(0,0);

            if (venue.entryExitPoints.length > 0)
            {
                venuePt = venue.entryExitPoints[0]._point;
            } else
            {
                venuePt = venue.geometry.getCentroid();
            }

            var venuePtLatLon = venuePt.clone();
            venuePtLatLon.transform(W.map.projection, W.map.displayProjection);

            if (typeof W.model.streets.objects[venue.streetID] === 'undefined') {
                console.log('Address fixed: Bad address found');

                $.getJSON(`https://${window.location.host}/SearchServer/mozi?lon=${venuePtLatLon.x}&lat=${venuePtLatLon.y}&format=PROTO_JSON_FULL&venue_id=venues.${venue.id}`).then(json => {
                    if (json.status==='NOT_FOUND') {
                        link = {notFound: true};
                    } else {
                        var newStreetObject = getStreetIDFromName(json.venue.street, venuePt);

                        /*
                        var oldAddress = "<br>" + json.venue.house_number + "<br>" + json.venue.street  + "<br>" + json.venue.city;
                        $('.element-history-region').before("<div><h2>Old Address</h2>" + oldAddress + "<br></div>");

                        var newAddress = "<br>" + json.venue.house_number + "<br>" + newStreetObject.name  + "<br>" + W.model.cities.objects[newStreetObject.cityID].attributes.name;
                        $('.element-history-region').before("<div><h2>New Address</h2>" + newAddress + "<br></div>");
                        */

                        var displayPlaceName = venue.name;
                        if (venue.name == '') {
                            displayPlaceName = `${json.venue.house_number} ${json.venue.street}`;
                        }

                        if (newStreetObject != null) {
                            updateAddress(venue, newStreetObject);
                            WazeWrap.Alerts.info(GM_info.script.name, `Fixed address for ${displayPlaceName}`);
                        } else {
                            WazeWrap.Alerts.error(GM_info.script.name, `Could not automatically fix address for ${displayPlaceName}<br><br>Old Address:<br>${json.venue.house_number} ${json.venue.street}, ${json.venue.city}`);
                        }
                    }
                }).fail(res => {
                    //reject(res);
                });
            }
        }
    }

    function getStreetIDFromName(streetName, point) {
        let streetIDs = [];
        let foundStreetObject = null;
        if (Object.keys(W.model.segments.objects).length > 0) {
            // Get unique primary street IDs from all segments on screen
            Object.keys(W.model.segments.objects).forEach(function (segmentID) {
                let segment = W.model.segments.objects[segmentID].attributes;
                if (segment.primaryStreetID != null) {
                    streetIDs[segment.primaryStreetID] = true;
                }
            });

            let possibleMatch = [];
            Object.keys(streetIDs).forEach(function (streetID) {
                let streetObject = W.model.streets.objects[streetID];
                if (streetObject.name != null && streetObject.name == streetName) {
                    possibleMatch.push(streetObject);
                }
            });

            if (possibleMatch.length == 1) {
                foundStreetObject = possibleMatch[0];
            } else {
                // This is if nearby segments with the same primary name are in different cities
                // We should take the city from the closest segment with a matching primary name

                let closestSegment = WazeWrap.Geometry.findClosestSegment(point, true, false);
                let closestCityID = WazeWrap.Model.getCityID(closestSegment.attributes.primaryStreetID);
                _.each(possibleMatch, function (streetObject) {
                    if (streetObject.cityID == closestCityID) {
                        foundStreetObject = streetObject;
                    }
                });
            }
        }

        return foundStreetObject;
    }

    function updateAddress(venue, street) {
        const UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
        let newAttributes;
        let cityID = street.cityID;
        let city = W.model.cities.objects[cityID].attributes;
        if (venue && street) {
            newAttributes = {
                streetName: street.name,
                emptyStreet: false,
                cityName: city.name,
                emptyCity: false,
                streetID: street.id,
                stateID: city.stateID,
                countryID: city.countryID,
                addressFormShown: false,
                editable: true,
                fullAddress: "",
                ttsLocales: [W.Config.tts.default_locale],
                altStreets: new Backbone.Collection,
                newAltStreets: new Backbone.Collection
            };
            const action = new UpdateFeatureAddress(W.model.venues.objects[venue.id], newAttributes);
            W.model.actionManager.add(action);
        }
    }

    bootstrap();
})();
