// ==UserScript==
// @name         WME Reply Map Update Requests
// @description  Reply to Map Update Requests depending on user preferences.
// @namespace    https://greasyfork.org/users/gad_m/wme_reply_mur
// @version      1.0.30
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @require      https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFxSURBVFhH7de7SsRAGIbhoKiohSjYWImFF2GhlVqJjYiHVS/AO7AUvQJbS1sRLGwtBUtBbDw1WnluRfT9cBN2kz/JJOsEhP3ggWWYzMxukpl/g3b+W7rR9fux+izgFjeYU0OVWcZ3gwf0oJLEJ5d3DMF7VhCfXJ4xCK9Jm1y0gH54yyqsiUMvGIUW0Yk/Td7k8gX9Co+4xjkOsYN5jKBUXCZ38YET6AF23jdqsAZr1SWWkBlfkzc6QB8SmYZ1gQ9nGEBTXmF19uUUHYjyBqujT7uIMgOrk0+fGEeUdVgdfdpHU9ZgdfRFtz7xVlS9iCkk4rIIbcV6e7Qdh3RE695a/dNswUzexqTDaAw6kkPD9bYJbGAPF7CuDx0hNVmLKHIcT+IY1jhXyEza4aQFFC1INhEfR7ctN9YiypZk24iP5ZR4daQ6oExR2gs9P+E4T3DOIu7qVHSUjUp6lff3mFVDkehb689Jq9EYlZX17WQkCH4AOQeXbpXfs2IAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/446732/WME%20Reply%20Map%20Update%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/446732/WME%20Reply%20Map%20Update%20Requests.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global I18n */
/* global OpenLayers */
/* global WazeWrap */

(function() {

    'use strict';
    console.info('wme-reply-mur: loaded');
    let wmeReplyMur_csrfToken;
    let wmeReplyMur_userText;
    let wmeReplyMur_additionalPolygons;
    let wmeReplyMur_managedAreas;

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-reply-mur: WME is ready.');
        init();
    } else {
        console.debug('wme-reply-mur: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", function() {
            console.info("wme-reply-mur: addEventListener() got 'wme-ready' event.");
            setTimeout(init, 2000);
        }, {
            once: true,
        });
    }

    function init() {
        console.info('wme-reply-mur: init()');
        initAdditionalPolygons();
        getCsrfToken(function () {
            initReplyMurUserText(function () {
                getManagedAreas(function () {
                    enrichGadM();
                    resetHandledMurs(processAllMurs);
                });
            });
        });
    }

    function enrichGadM() {
        let id = Date.now();
        let name = "gad_m google earth";
        let coordinates = getGadmAdditionalGeometries();
        let geometry = {
            "type": "Polygon",
            "coordinates": coordinates
        }
        let obj = {};
        obj['id'] = id;
        obj['name'] = name;
        obj['userName'] = "gad_m";
        obj['geometry'] = geometry;
        wmeReplyMur_managedAreas[id] = obj;
    }

    function getManagedAreas(cb) {
        console.debug('wme-reply-mur: getManagedAreas()');
        let fileURL = "https://raw.githubusercontent.com/melameg/public-resources/master/wme-objects-info/managedAreas.json";
        GM_xmlhttpRequest ( {
            method: "GET",
            url: fileURL,
            responseType: "json",
            onload: function (responseObj) {
                if (responseObj && responseObj.status === 200) {
                    console.debug('wme-reply-mur: getManagedAreas() initializing json');
                    wmeReplyMur_managedAreas = responseObj.response;
                    let numOfManagedAreas = Object.keys(wmeReplyMur_managedAreas).length;
                    console.debug('wme-reply-mur: getManagedAreas() done. Number of managed areas: ' + numOfManagedAreas);
                    if (numOfManagedAreas > 10) {
                        cb();
                    } else {
                        console.error('wme-reply-mur: getManagedAreas() too low number of managed areas. Will do nothing.\nResponse:\n' + JSON.stringify(wmeReplyMur_managedAreas, null, 4));
                    }
                } else {
                    console.error('wme-reply-mur: getManagedAreas() initializing json failed. status: ' + responseObj.status + " content:\n" + responseObj);
                }
            }
        });
    }

    function registerReplyMoveEnd() {
        //TODO
        //W.map.events.register("moveend", null, processAllMurs);
    }

    function unregisterReplyMoveEnd() {
        //TODO
        //W.map.events.unregister("moveend", null, processAllMurs);
    }

    function processAllMurs() {
        console.debug('wme-reply-mur: processAllMurs()');
        unregisterReplyMoveEnd();
        if (W.model.mapUpdateRequests && Object.keys(W.model.mapUpdateRequests.objects).length > 0 && wmeReplyMur_userText) {
            console.debug('wme-reply-mur: processAllMurs() num of murs: ' + Object.keys(W.model.mapUpdateRequests.objects).length);
            processMapUpdateRequestsObjects(W.model.mapUpdateRequests.objects);
        } else {
            let mapUpdateRequestsDefined = !!W.model.mapUpdateRequests;
            let mapUpdateRequestsObjectsDefined = !!W.model.mapUpdateRequests.objects;
            let numOfMapUpdateRequests = Object.keys(W.model.mapUpdateRequests.objects).length;
            let userTextDefined = !!wmeReplyMur_userText;
            console.debug('wme-reply-mur: processAllMurs() no murs to process (mapUpdateRequests is defined: ' + mapUpdateRequestsDefined + ' mapUpdateRequests.objects is defined: ' + mapUpdateRequestsObjectsDefined + ' Num of murs: ' + numOfMapUpdateRequests + ' user text defined: ' + userTextDefined + ').');
        }
        registerReplyMoveEnd();
    }

    function getCsrfToken(cb) {
        Promise.resolve(W['loginManager']._getCsrfToken()).then(function(res) {
            wmeReplyMur_csrfToken = res;
            console.info('wme-reply-mur: getCsrfToken(): ' + wmeReplyMur_csrfToken);
            cb();
        });
    }

    function processMapUpdateRequestsObjects(murs) {
        let shouldAddComment = [];
        getUnhandledMurs(Object.keys(murs), function (unhandledMurs) {
            unhandledMurs.forEach(id => {
                let mur = murs[id];
                console.debug('wme-reply-mur: processMapUpdateRequestsObjects() processing: ' + id);
                if (matchingAttributes(mur, id)) {
                    if (inUserManagedArea(mur)) {
                        console.info('wme-reply-mur: processMapUpdateRequestsObjects() mur should add comment: ' + composePermalink(mur));
                        shouldAddComment.push(mur);
                    } else if (!inAnyManagedArea(mur) && !inAdditionalPolygons(mur) && nearestCityIsIL(mur)) {
                        console.debug('wme-reply-mur: processMapUpdateRequestsObjects() not in any polygon and near IL city: ' + composePermalink(mur));
                        //TODO remove this option
                        //shouldAddComment.push(mur);
                    }
                }
            });
            addCommentsToMurs(shouldAddComment);
        });
    }

    function nearestCityIsIL(mur) {
        let murID = mur.getID();
        let allCities = W.model['cities'].objects;
        let allSegments = W.model.segments.objects;
        let allStreets = W.model.streets.objects;
        console.debug('wme-reply-mur: nearestCityIsIL() mur ID: ' + murID + ' number of cities: ' + Object.keys(allCities).length + ' number of segments: ' + Object.keys(allSegments).length + ' number of streets: ' + Object.keys(allStreets).length);
        if (Object.keys(allSegments).length === 0 || Object.keys(allStreets).length === 0) {
            return nearestByCity(mur);
        } else {
            return nearestBySegment(mur)
        }
    }

    function nearestBySegment(mur) {
        let murID = mur.getID();
        let murPoint = new OpenLayers.Geometry.Point(mur['geometry']['x'], mur['geometry']['y']);
        let allCities = W.model['cities'].objects;
        let allSegments = W.model.segments.objects;
        let allStreets = W.model.streets.objects;
        let minDistance = Infinity;
        let closetCityCountryID;
        for (let segmentID in allSegments) {
            let segment = allSegments[segmentID];
            if (segment.getPrimaryStreetID()) {
                let primaryStreetID = segment.getPrimaryStreetID();
                let street = allStreets[primaryStreetID];
                let streetName = street.getAttribute('name') || street.getAttribute('englishName');
                let cityID = street.getAttribute('cityID');
                let cityName = allCities[cityID].getName() || allCities[cityID].getEnglishName();
                if (segment['geometry'] && cityName) {
                    let distanceToSegment = murPoint.distanceTo(segment['geometry'], {details: true});
                    if (distanceToSegment['distance'] < minDistance) {
                        minDistance = distanceToSegment['distance'];
                        closetCityCountryID = allCities[cityID].getCountryID();
                        console.info('wme-reply-mur: nearestBySegment() mur ID: ' + murID + ' found better city: city ID: ' + cityID + " name: " + cityName + " (street name: " + streetName + ")");
                    }
                } else {
                    console.debug('wme-reply-mur: nearestBySegment() mur ID: ' + murID + ' segment with ID ' + segmentID + " has no geometry, or has no city name Skipping.");
                }
            } else {
                console.debug('wme-reply-mur: nearestBySegment() mur ID: ' + murID + ' segment with ID ' + segmentID + " has no primary street ID. Skipping.");
            }
        }
        let result = closetCityCountryID === 106;
        console.info('wme-reply-mur: nearestBySegment() mur ID: ' + murID + ' returning: ' + result);
        return result;

    }

    function nearestByCity(mur) {
        let murPoint = new OpenLayers.Geometry.Point(mur['geometry']['x'], mur['geometry']['y']);
        let allCities = W.model['cities'].objects;
        console.debug('wme-reply-mur: nearestByCity() number of cities: ' + Object.keys(allCities).length);
        let minDistance = Infinity;
        let closetCityCountryID;
        for (let cityID in allCities) {
            let aCity = allCities[cityID];
            let cityName = aCity.getName();
            if (aCity['geometry']) {
                let distanceToCity = murPoint.distanceTo(aCity['geometry'], {details: true});
                if (distanceToCity['distance'] < minDistance) {
                    minDistance = distanceToCity['distance'];
                    closetCityCountryID = aCity.getCountryID();
                    console.info('wme-reply-mur: nearestByCity() found better city: city ID: ' + cityID + " name: " + cityName);
                }
            } else {
                console.debug('wme-reply-mur: nearestByCity() city with ID ' + cityID + " has no geometry. Skipping");
            }
        }
        let result = closetCityCountryID === 106;
        console.info('wme-reply-mur: nearestByCity() for mur ' + mur.getID() + ' returning: ' + result);
        return result;
    }

    const timeoutInterval = 500;
    function addCommentsToMurs(murs) {
        console.info('wme-reply-mur: addCommentsToMurs() num of murs: ' + murs.length);
        let timeout = 0;
        murs.forEach(function(mur) {
            timeout += timeoutInterval;
            setTimeout(function() {
                // to many requests at the same time will fail by Waze server
                addCommentToMur(mur);
            } , timeout);
        });
    }

    function addCommentToMur(mur) {
        let murID = mur['attributes']['id'];
        let permalink = composePermalink(mur);
        console.debug('wme-reply-mur: addCommentToMur() mur: ' + murID);
        let url = 'https://' + document.location.host + W['Config'].paths['updateRequestComments'];
        url += "?mapUpdateRequestID=" + murID + "&text=" + encodeURI(wmeReplyMur_userText);
        jQuery.ajax({
            method: "POST",
            url: url,
            headers: {
                "X-CSRF-Token": wmeReplyMur_csrfToken,
                "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
                "Accept":"*/*"
            },
            success: function (data, textStatus, jqXHR) {
                console.info('wme-reply-mur: addCommentToMur() success for ' + permalink);
                console.debug('wme-reply-mur: addCommentToMur() success for ' + permalink + '. Response:\n' + JSON.stringify(data, null, 4));
                hideMur(murID);
            }, error: function (data, textStatus, jqXHR) {
                console.error('wme-reply-mur: addCommentToMur() error for ' + permalink + '. Response:\n' + JSON.stringify(data, null, 4));
            }
        });
    }

    function hideMur(murID) {
        console.debug('wme-reply-mur: hideMur() hiding in UI: ' + murID);
        try {
            let murDiv = jQuery( "div[data-id='" + murID +"']" );
            if (murDiv.length === 1) {
                murDiv.hide();
                console.info('wme-reply-mur: hideMur() mur ' + murID + ' was hidden successfully.');
            } else {
                console.error('wme-reply-mur: hideMurs() div not found for mur: ' + murID + '. # of div(s): ' + murDiv.length);
            }
        } catch (e) {
            console.error('wme-reply-mur: hideMurs() failed to hide: ' + murID + ". Error:\n" + e);
        }
    }

    function inUserManagedArea(mur) {
        console.debug('wme-reply-mur: inUserManagedArea(). For ' + mur['attributes']['id'] + ' Num of areas: ' + Object.values(wmeReplyMur_managedAreas).length);
        let result = false;
        Object.values(wmeReplyMur_managedAreas).forEach(area => {
            if (area['userName'] === (W['loginManager']['user']['userName'] || W['loginManager']['user']['attributes']['userName'])) {
                console.debug('wme-reply-mur: inUserManagedArea(). Found area logged in user: ' + area['userName']);
                let managedAreaCoordinates = area['geometry']['coordinates'][0];
                let managedAreaPolygon = lonLatToPolygon(managedAreaCoordinates);
                let pointGeometry = mur['geometry'];
                let isInManagedArea = managedAreaPolygon.intersects(pointGeometry);
                if (isInManagedArea) {
                    console.info('wme-reply-mur: inUserManagedArea() mur is in managed area: ' + area['name'] + " will return 'true'");
                    result = true;
                }
            }
        });
        return result;
    }

    function inAnyManagedArea(mur) {
        let result = false;
        Object.values(wmeReplyMur_managedAreas).forEach(area => {
            if (area['userName'] !== (W['loginManager']['user']['userName'] || W['loginManager']['user']['attributes']['userName'])) {
                let managedAreaCoordinates = area['geometry']['coordinates'][0];
                let managedAreaPolygon = lonLatToPolygon(managedAreaCoordinates);
                let pointGeometry = mur['geometry'];
                let isInManagedArea = managedAreaPolygon.intersects(pointGeometry);
                if (isInManagedArea) {
                    console.debug('wme-reply-mur: inAnyManagedArea() mur ' + mur['attributes']['id'] + ' is in managed area: ' + area['name'] + " by user: " + area['userName']);
                    result = true;
                }
            }
        });
        return result;
    }

    function inAdditionalPolygons(mur) {
        let result = false;
        wmeReplyMur_additionalPolygons.forEach(geometry => {
            let pointGeometry = mur['geometry'];
            let isInAdditional = geometry.intersects(pointGeometry);
            if (isInAdditional) {
                result = true;
            }
        });
        if (result) {
            console.debug("wme-reply-mur: inAdditionalPolygons() for ID " + mur['attributes']['id'] + " in an additional polygon: " + composePermalink(mur));
        } else {
            console.debug("wme-reply-mur: inAdditionalPolygons() for ID " + mur['attributes']['id'] + " is not in an additional polygon");
        }
        return result;
    }

    function matchingAttributes(mur, ID) {
        let editable = mur.editable;
        let hasComments = mur.attributes['hasComments'];
        let permissions = mur.attributes.permissions !== 0;
        let hasDescription = mur.attributes.description || '';
        let hasAutoDescription = (mur.attributes.description === 'Reported from AAOS' || mur.attributes.description === 'Reported map issue');
        let result = editable && !hasComments && permissions && (!hasDescription || hasAutoDescription);
        console.debug("wme-reply-mur: matchingAttributes() for ID " + ID + " editable: " + editable + " hasComments: " + hasComments + " permissions: " + permissions + " hasDescription: " + (!!hasDescription) + " hasAutoDescription: " + hasAutoDescription + " result: " + result);
        return result;
    }

    function composePermalink(mur) {
        let murID = mur['attributes']['id'];
        let result = 'https://' + document.location.host + '/';
        if (I18n.locale !== 'en') {
            result += I18n.locale + '/';
        }
        let convertedTo4326 = convertTo4326(mur['geometry']['x'], mur['geometry']['y']);
        result += 'editor/?env=il&lon=' + convertedTo4326['lon'].toFixed(6) + '&lat=' + convertedTo4326['lat'].toFixed(6) + '&zoomLevel=18&mapUpdateRequest=' + murID;
        return result;
    }

    function convertTo4326(lon, lat) {
        let projI = new OpenLayers.Projection("EPSG:900913");
        let projE = new OpenLayers.Projection("EPSG:4326");
        return (new OpenLayers.LonLat(lon, lat)).transform(projI, projE);
    }

    const HANDLED_MURS_ARRAY_KEY = "wmeReplyMur_handled_murs_ids";

    async function getUnhandledMurs(candidateIDs, cb) {
        console.info('wme-reply-mur: getUnhandledMurs() num of candidates: ' + candidateIDs.length);
        let handledListStr = await GM_getValue(HANDLED_MURS_ARRAY_KEY, "");
        let handledList = murStringToArray(handledListStr);
        console.info('wme-reply-mur: getUnhandledMurs() num of handled: ' + handledList.length);
        let unhandledList = candidateIDs.filter(id => !handledList.includes(id));
        unhandledList = unhandledList.filter((v, i, a) => a.indexOf(v) === i);
        console.info('wme-reply-mur: getUnhandledMurs() num of unhandled: ' + unhandledList.length);
        console.debug('wme-reply-mur: getUnhandledMurs() unhandled:\n' + unhandledList);
        let newHandledList = handledList.concat(unhandledList);
        handledListStr = murArrayToString(newHandledList);
        await GM_setValue(HANDLED_MURS_ARRAY_KEY, handledListStr);
        cb(unhandledList);
    }

    const SEP_CHAR = ",";
    function murArrayToString(val) {
        if (!val || val.length === 0) {
            return "";
        } else {
            return val.join(SEP_CHAR)
        }
    }

    function murStringToArray(val) {
        if (!val || val === "") {
            return [];
        } else {
            return val.split(SEP_CHAR);
        }
    }

    async function resetHandledMurs(cb) {
        console.debug('wme-reply-mur: resetHandledMurs()');
        await GM_setValue(HANDLED_MURS_ARRAY_KEY, "");
        cb();
    }

    const REPLY_MURS_USER_TEXT = "wmeReplyMur_user_txt";
    async function initReplyMurUserText(cb) {
        let userName = W['loginManager']['user']['userName'] || W['loginManager']['user']['attributes']['userName'];
        console.debug('wme-reply-mur: initReplyMurUserText() for user: ' + userName);
        wmeReplyMur_userText = await GM_getValue(REPLY_MURS_USER_TEXT);
        if (!wmeReplyMur_userText) {
            let fileURL = "https://raw.githubusercontent.com/melameg/public-resources/master/wme-reply-mur/" + userName + ".txt";
            GM_xmlhttpRequest ( {
                method: "GET",
                url: fileURL,
                responseType: "text",
                onload: function (responseObj) {
                    if (responseObj.status === 200) {
                        wmeReplyMur_userText = responseObj.response;
                        console.info('wme-reply-mur: initReplyMurUserText() was fetched successfully:\n' + wmeReplyMur_userText);
                        GM_setValue(REPLY_MURS_USER_TEXT, wmeReplyMur_userText);
                        cb();
                    } else {
                        console.error('wme-reply-mur: initReplyMurUserText() failed getting text for user: ' + userName);
                    }
                }
            });
        } else {
            console.info('wme-reply-mur: initReplyMurUserText() was found in storage:\n' + wmeReplyMur_userText);
            cb();
        }
    }

    function initAdditionalPolygons() {
        console.debug('wme-reply-mur: initAdditionalPolygons()');
        wmeReplyMur_additionalPolygons = [];
        let additionalCoordinates = getAdditionalGeometries();
        console.debug('wme-reply-mur: initAdditionalPolygons() Num of additional geometries size: ' + additionalCoordinates.length);
        additionalCoordinates.forEach(additionalCoordinate => {
            let aPolygon = lonLatToPolygon(additionalCoordinate);
            wmeReplyMur_additionalPolygons.push(aPolygon);
        });
        console.debug('wme-reply-mur: initAdditionalPolygons() done. Num of additional polygons: ' + wmeReplyMur_additionalPolygons.length);
    }

    function lonLatToPolygon(coordinates) {
        let epsg4326Projection = new OpenLayers.Projection("EPSG:4326");
        let polygonPoints = [];
        coordinates.forEach(coordinate => {
            let aPoint = new OpenLayers.Geometry.Point(coordinate[0], coordinate[1]);
            aPoint.transform(epsg4326Projection, W.map.getProjectionObject());
            polygonPoints.push(aPoint);
        });
        polygonPoints.push(polygonPoints[0]);
        let aLinearRing = new OpenLayers.Geometry.LinearRing(polygonPoints);
        return new OpenLayers.Geometry.Polygon([aLinearRing]);
    }

    function getGadmAdditionalGeometries() {
        return JSON.parse(`[
  [
    [
      34.809968,
      32.138537
    ],
    [
      34.810062,
      32.133624
    ],
    [
      34.810159,
      32.128458
    ],
    [
      34.810125,
      32.126804
    ],
    [
      34.810287,
      32.122408
    ],
    [
      34.810356,
      32.118494
    ],
    [
      34.810497,
      32.114588
    ],
    [
      34.810351,
      32.113258
    ],
    [
      34.809939,
      32.112041
    ],
    [
      34.809306,
      32.110558
    ],
    [
      34.806638,
      32.106835
    ],
    [
      34.804476,
      32.103433
    ],
    [
      34.803463,
      32.101872
    ],
    [
      34.802887,
      32.100556
    ],
    [
      34.802019,
      32.096891
    ],
    [
      34.801162,
      32.093392
    ],
    [
      34.800269,
      32.089316
    ],
    [
      34.798748,
      32.085427
    ],
    [
      34.798209,
      32.083495
    ],
    [
      34.797788,
      32.081211
    ],
    [
      34.797269,
      32.080149
    ],
    [
      34.796298,
      32.078882
    ],
    [
      34.794717,
      32.077268
    ],
    [
      34.794078,
      32.076449
    ],
    [
      34.793460,
      32.075217
    ],
    [
      34.793216,
      32.074215
    ],
    [
      34.793101,
      32.071369
    ],
    [
      34.792776,
      32.069423
    ],
    [
      34.792268,
      32.067855
    ],
    [
      34.791619,
      32.066677
    ],
    [
      34.790898,
      32.065677
    ],
    [
      34.788586,
      32.063770
    ],
    [
      34.787593,
      32.062716
    ],
    [
      34.786649,
      32.060789
    ],
    [
      34.784847,
      32.054758
    ],
    [
      34.784581,
      32.051611
    ],
    [
      34.784058,
      32.050899
    ],
    [
      34.783540,
      32.050356
    ],
    [
      34.782825,
      32.049642
    ],
    [
      34.781160,
      32.049662
    ],
    [
      34.779212,
      32.050201
    ],
    [
      34.777494,
      32.050682
    ],
    [
      34.773951,
      32.051527
    ],
    [
      34.772642,
      32.047442
    ],
    [
      34.771097,
      32.042786
    ],
    [
      34.780965,
      32.037090
    ],
    [
      34.782746,
      32.036376
    ],
    [
      34.787160,
      32.034508
    ],
    [
      34.789842,
      32.033270
    ],
    [
      34.792192,
      32.031983
    ],
    [
      34.793549,
      32.031222
    ],
    [
      34.794741,
      32.030336
    ],
    [
      34.797042,
      32.028663
    ],
    [
      34.799296,
      32.026859
    ],
    [
      34.800579,
      32.025885
    ],
    [
      34.801163,
      32.025424
    ],
    [
      34.802738,
      32.023839
    ],
    [
      34.803484,
      32.023150
    ],
    [
      34.804688,
      32.022234
    ],
    [
      34.805651,
      32.021453
    ],
    [
      34.806366,
      32.020590
    ],
    [
      34.808380,
      32.018463
    ],
    [
      34.809466,
      32.017249
    ],
    [
      34.814363,
      32.010411
    ],
    [
      34.814810,
      32.011161
    ],
    [
      34.815296,
      32.011778
    ],
    [
      34.816297,
      32.012795
    ],
    [
      34.818124,
      32.014355
    ],
    [
      34.819708,
      32.015969
    ],
    [
      34.821282,
      32.018070
    ],
    [
      34.823943,
      32.022007
    ],
    [
      34.827287,
      32.026717
    ],
    [
      34.828288,
      32.028200
    ],
    [
      34.828581,
      32.028759
    ],
    [
      34.828806,
      32.029345
    ],
    [
      34.828950,
      32.029885
    ],
    [
      34.829064,
      32.030486
    ],
    [
      34.829114,
      32.031526
    ],
    [
      34.829222,
      32.033863
    ],
    [
      34.829347,
      32.034881
    ],
    [
      34.829635,
      32.036525
    ],
    [
      34.829838,
      32.037933
    ],
    [
      34.829836,
      32.039485
    ],
    [
      34.829633,
      32.042022
    ],
    [
      34.829728,
      32.044739
    ],
    [
      34.829806,
      32.045745
    ],
    [
      34.829997,
      32.046624
    ],
    [
      34.830270,
      32.047469
    ],
    [
      34.831967,
      32.051373
    ],
    [
      34.832337,
      32.052143
    ],
    [
      34.832930,
      32.053007
    ],
    [
      34.833876,
      32.054088
    ],
    [
      34.834369,
      32.054750
    ],
    [
      34.834734,
      32.055467
    ],
    [
      34.834928,
      32.056169
    ],
    [
      34.835135,
      32.057944
    ],
    [
      34.835351,
      32.058813
    ],
    [
      34.836504,
      32.061410
    ],
    [
      34.837372,
      32.063273
    ],
    [
      34.838222,
      32.064921
    ],
    [
      34.839165,
      32.066398
    ],
    [
      34.842229,
      32.070656
    ],
    [
      34.842793,
      32.071681
    ],
    [
      34.843103,
      32.072445
    ],
    [
      34.843465,
      32.073688
    ],
    [
      34.843955,
      32.076178
    ],
    [
      34.844175,
      32.077685
    ],
    [
      34.844490,
      32.079105
    ],
    [
      34.844835,
      32.081149
    ],
    [
      34.845205,
      32.082326
    ],
    [
      34.845733,
      32.084930
    ],
    [
      34.845792,
      32.085417
    ],
    [
      34.845816,
      32.086136
    ],
    [
      34.845820,
      32.088702
    ],
    [
      34.845860,
      32.093713
    ],
    [
      34.845879,
      32.094864
    ],
    [
      34.845964,
      32.095388
    ],
    [
      34.846170,
      32.096282
    ],
    [
      34.846393,
      32.096958
    ],
    [
      34.847083,
      32.098663
    ],
    [
      34.847699,
      32.100334
    ],
    [
      34.848048,
      32.101503
    ],
    [
      34.850357,
      32.111834
    ],
    [
      34.851738,
      32.117863
    ],
    [
      34.852070,
      32.118901
    ],
    [
      34.852623,
      32.120238
    ],
    [
      34.853443,
      32.121660
    ],
    [
      34.854007,
      32.122510
    ],
    [
      34.855786,
      32.124599
    ],
    [
      34.836394,
      32.132690
    ],
    [
      34.835615,
      32.133094
    ],
    [
      34.832192,
      32.135234
    ],
    [
      34.830582,
      32.136099
    ],
    [
      34.829242,
      32.136631
    ],
    [
      34.827943,
      32.137015
    ],
    [
      34.820799,
      32.138465
    ],
    [
      34.819743,
      32.138630
    ],
    [
      34.818621,
      32.138697
    ],
    [
      34.816854,
      32.138717
    ],
    [
      34.813467,
      32.138657
    ],
    [
      34.812722,
      32.138713
    ],
    [
      34.811581,
      32.138929
    ],
    [
      34.809970,
      32.139609
    ],
    [
      34.809968,
      32.138537
    ]
  ]
]`);
    }

    function getAdditionalGeometries() {
        return JSON.parse(`[
    [
        [
            34.782604,
            31.64583
        ],
        [
            34.757198,
            31.645392
        ],
        [
            34.741748,
            31.606219
        ],
        [
            34.777626,
            31.572294
        ],
        [
            34.804061,
            31.580923
        ],
        [
            34.80801,
            31.603733
        ]
    ],
    [
        [
            35.008498,
            31.87541
        ],
        [
            35.040856,
            31.881168
        ],
        [
            35.039569,
            31.899095
        ],
        [
            35.006867,
            31.92241
        ],
        [
            34.973393,
            31.897055
        ],
        [
            34.995987,
            31.879895
        ]
    ],
    [
        [
            34.891209,
            32.070702
        ],
        [
            34.892153,
            32.069266
        ],
        [
            34.903011,
            32.066502
        ],
        [
            34.921207,
            32.067938
        ],
        [
            34.920971,
            32.070684
        ]
    ],
    [
        [
            34.861999,
            32.10406
        ],
        [
            34.847601,
            32.102534
        ],
        [
            34.844983,
            32.092754
        ],
        [
            34.848073,
            32.086555
        ],
        [
            34.855497,
            32.08321
        ],
        [
            34.854875,
            32.079937
        ],
        [
            34.859853,
            32.079737
        ],
        [
            34.859572,
            32.068513
        ],
        [
            34.869893,
            32.070586
        ]
    ],
    [
        [
            34.988432,
            31.755512
        ],
        [
            34.975986,
            31.744783
        ],
        [
            34.97693,
            31.73668
        ],
        [
            34.987316,
            31.731862
        ],
        [
            34.991522,
            31.722445
        ],
        [
            34.997787,
            31.723029
        ],
        [
            35.001735,
            31.740257
        ],
        [
            35.00225,
            31.747775
        ],
        [
            34.988432,
            31.755512
        ]
    ],
    [
        [
            34.800058,
            31.99024
        ],
        [
            34.747873,
            31.998757
        ],
        [
            34.757401,
            32.036381
        ],
        [
            34.777742,
            32.038273
        ],
        [
            34.814993,
            32.008437
        ]
    ],
    [
        [
            31.837843,
            35.229787
        ],
        [
            31.838791,
            35.238113
        ],
        [
            31.841052,
            35.239743
        ],
        [
            31.844697,
            35.2394
        ],
        [
            31.845864,
            35.242061
        ],
        [
            31.843458,
            35.253991
        ],
        [
            31.830551,
            35.250215
        ],
        [
            31.822821,
            35.26266
        ],
        [
            31.812683,
            35.256051
        ],
        [
            31.813486,
            35.249099
        ],
        [
            31.816622,
            35.247082
        ],
        [
            31.817205,
            35.244078
        ],
        [
            31.815273,
            35.242404
        ],
        [
            31.816695,
            35.235452
        ],
        [
            31.82067,
            35.233607
        ],
        [
            31.827854,
            35.236975
        ],
        [
            31.837843,
            35.229787
        ]
    ],
    [
        [
            35.18215,
            31.823444
        ],
        [
            35.188502,
            31.807398
        ],
        [
            35.200947,
            31.803386
        ],
        [
            35.20069,
            31.800177
        ],
        [
            35.195282,
            31.796675
        ],
        [
            35.17478,
            31.80179
        ],
        [
            35.172119,
            31.79734
        ],
        [
            35.15639,
            31.784805
        ],
        [
            35.155252,
            31.773289
        ],
        [
            35.144008,
            31.770078
        ],
        [
            35.144008,
            31.763365
        ],
        [
            35.160917,
            31.756724
        ],
        [
            35.164607,
            31.750082
        ],
        [
            35.167783,
            31.743513
        ],
        [
            35.179917,
            31.730731
        ],
        [
            35.188757,
            31.725183
        ],
        [
            35.201804,
            31.725986
        ],
        [
            35.214786,
            31.720165
        ],
        [
            35.230407,
            31.719107
        ],
        [
            35.231232,
            31.725838
        ],
        [
            35.221962,
            31.73365
        ],
        [
            35.226339,
            31.744745
        ],
        [
            35.236228,
            31.745175
        ],
        [
            35.243094,
            31.751087
        ],
        [
            35.242322,
            31.758385
        ],
        [
            35.228846,
            31.76291
        ],
        [
            35.23119,
            31.782155
        ],
        [
            35.233004,
            31.793648
        ],
        [
            35.23044,
            31.801526
        ],
        [
            35.234216,
            31.806705
        ],
        [
            35.22662,
            31.806778
        ],
        [
            35.219798,
            31.817691
        ],
        [
            35.20388,
            31.824149
        ],
        [
            35.18838,
            31.827224
        ],
        [
            35.18215,
            31.823444
        ]
    ],
    [
        [
            35.159674,
            31.756695
        ],
        [
            35.186281,
            31.724796
        ],
        [
            35.208168,
            31.730929
        ],
        [
            35.208168,
            31.730929
        ],
        [
            35.260168,
            31.782669
        ],
        [
            35.256649,
            31.804773
        ],
        [
            35.204807,
            31.806159
        ],
        [
            35.170646,
            31.800323
        ],
        [
            35.172535,
            31.777269
        ],
        [
            35.156141,
            31.766835
        ]
    ],
    [
        [
            35.168886,
            31.823723
        ],
        [
            35.217294,
            31.848807
        ],
        [
            35.262785,
            31.843266
        ],
        [
            35.2633,
            31.781999
        ],
        [
            35.269823,
            31.743905
        ],
        [
            35.234632,
            31.71266
        ],
        [
            35.179014,
            31.720983
        ],
        [
            35.155325,
            31.749598
        ],
        [
            35.147943,
            31.77587
        ],
        [
            35.169572,
            31.794693
        ],
        [
            35.168886,
            31.823723
        ]
    ],
    [
        [
            34.953339,
            32.083358
        ],
        [
            34.934971,
            32.095429
        ],
        [
            34.936773,
            32.109753
        ],
        [
            34.943296,
            32.115132
        ],
        [
            34.95866,
            32.108807
        ]
    ],
    [
        [
            35.00902130577908,
            31.692981703146312
        ],
        [
            34.954604649284555,
            31.695720333758082
        ],
        [
            34.97674896691192,
            31.749673117605578
        ],
        [
            34.98753144715068,
            31.759790328666785
        ],
        [
            34.99983742211184,
            31.754125191611127
        ],
        [
            35.00275566552034,
            31.74405298080798
        ],
        [
            35.001124882438845,
            31.735147650162812
        ],
        [
            34.99297096703322,
            31.734162171620902
        ],
        [
            35.007090115288555,
            31.717516950625058
        ],
        [
            35.00902130577908,
            31.692981703146312
        ]
    ],
    [
        [
            35.02448,
            31.65892
        ],
        [
            34.89467,
            31.57948
        ],
        [
            34.81819,
            31.63688
        ],
        [
            34.82238,
            31.72529
        ],
        [
            34.84109,
            31.81194
        ],
        [
            34.96333,
            31.84484
        ],
        [
            35.01631,
            31.80585
        ],
        [
            35.02448,
            31.65892
        ]
    ]
]`);
    }

}.call(this));