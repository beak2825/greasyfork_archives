// ==UserScript==
// @name         WME Segment Select
// @description  Sets city name when selecting a segment
// @namespace    https://greasyfork.org/users/gad_m/wme_segment_select
// @version      0.0.12
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @downloadURL https://update.greasyfork.org/scripts/423768/WME%20Segment%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/423768/WME%20Segment%20Select.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function() {

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-segment-select: WME is ready.');
        init();
    } else {
        console.debug('wme-segment-select: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function init() {
        console.info("wme-segment-select: init()");
        W['selectionManager'].events.register("selectionchanged", null ,segmentSelectionChanged);
    } // end init()

    function segmentSelectionChanged(event) {
        if (W['selectionManager'].getSelectedFeatures().length === 1) {
            W['selectionManager'].getSelectedFeatures().forEach(function(element) {
                if (element.attributes['wazeFeature']['_wmeObject'].type === 'segment') {
                    console.log('wme-segment-select: segmentSelectionChanged() element is segment');
                    let segmentID = element.attributes['wazeFeature']['_wmeObject'].attributes.id;
                    if (segmentID === -100) {
                        console.log('wme-segment-select: segmentSelectionChanged() new segment. nothing to do');
                    } else {
                        let cityName = null;
                        if (element.attributes['wazeFeature']['_wmeObject'].getAddress() && element.attributes['wazeFeature']['_wmeObject'].getAddress().getCity()) {
                            cityName = element.attributes['wazeFeature']['_wmeObject'].getAddress().getCity().getName();
                        } else {
                            console.debug('wme-segment-select: segmentSelectionChanged() segment has no city');
                        }
                        if (cityName) {
                            console.debug('wme-segment-select: segmentSelectionChanged() segment ' + segmentID + ' has city name');
                            let currentCityId = W.model.getTopCityId();
                            let segmentCityId = element.attributes['wazeFeature']['_wmeObject'].getAddress().getCity().getID();
                            if (currentCityId !== segmentCityId) {
                                let countryName = element.attributes['wazeFeature']['_wmeObject'].getAddress().getCountry().name;
                                let label = cityName + ", " + countryName;
                                console.log('wme-segment-select: segmentSelectionChanged() setting city: ' + label);
                                W.model.topCityId = segmentCityId;
                                jQuery('.location-info-region > .location-info').html(label);
                            } else {
                                console.log('wme-segment-select: segmentSelectionChanged() currentCityId == segmentCityId');
                            }
                        } else {
                            setByClosestSegment(segmentID);
                        }
                    }
                }
            });
        }
        return true;
    }
    
    function setByClosestSegment(segmentID) {
        console.debug('wme-segment-select: setByClosestSegment() segmentID: ' + segmentID + ' has no city name. Finding closest segment with city name...');
        let segmentGeometry = W.model.segments.objects[segmentID].geometry;
        let allSegments = W.model.segments.objects;
        let minDistance = Infinity;
        let closetCountryName;
        let closetCityName;
        let closetCityId;

        for (let aSegID in allSegments) {
            let aSegment = allSegments[aSegID];
            let distanceToSegment = segmentGeometry.distanceTo(aSegment.geometry, { details: true });
            let cityID = getPrimaryStreetCityID(aSegment);
            if (cityID) {
                let cityName = getObjectName(W.model['cities'], cityID);
                if (cityName) {
                    if (distanceToSegment.distance < minDistance) {
                        minDistance = distanceToSegment.distance;
                        closetCityId = cityID;
                        closetCityName = cityName;
                        let countryID = getCityCountryID(cityID);
                        closetCountryName = getObjectName(W.model['countries'], countryID);
                        console.debug('wme-segment-select: setByClosestSegment() found better segment: city ID: ' + closetCityId + ' City Name: ' + closetCityName + ' Country Name: ' + closetCountryName);
                    }
                }
            }
        }
        if (closetCityId) {
            console.log('wme-segment-select: setByClosestSegment() found best: city ID: ' + closetCityId + ' City Name: ' + closetCityName + ' Country Name: ' + closetCountryName);
            let label = closetCityName + ", " + closetCountryName;
            W.model.topCityId = closetCityId;
            jQuery('.location-info-region > .location-info').html(label);
        } else {
            console.info('wme-segment-select: setByClosestSegment() segmentID: ' + segmentID + ' has no city name. No result found');
        }
    }

    function getObjectName(objects, id) {
        let object = objects.getObjectById(id);
        return object.name || object.attributes.name;
    }

    function getPrimaryStreetCityID(segment) {
        let primaryStreet = W.model.streets.getObjectById(segment.getPrimaryStreetID());
        return primaryStreet.cityID || primaryStreet.attributes.cityID;
    }

    function getCityCountryID(cityID) {
        let city = W.model['cities'].getObjectById(cityID);
        return city.countryID || city.attributes.countryID;
    }

}.call(this));