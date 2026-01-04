// ==UserScript==
// @name                WME UR Minus (UR-)
// @namespace           https://greasyfork.org/users/gad_m/wme_ur_minus
// @description         Adds minimum UR filtering.
// @include 	        /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @author              gad_m
// @license             MIT
// @grant               GM_addStyle
// @version             1.33
// @grant               GM_xmlhttpRequest
// @connect             raw.githubusercontent.com
//noinspection SpellCheckingInspection
// @icon                data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/467396/WME%20UR%20Minus%20%28UR-%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467396/WME%20UR%20Minus%20%28UR-%29.meta.js
// ==/UserScript==

/* global W */
/* global I18n */
/* global jQuery */
/* global OpenLayers */
/* global GM_addStyle */
/* global GM_xmlhttpRequest */

(function() {

    'use strict';
    console.info('wme-ur-minus: loading...');
    let wMethods = {};
    let LonLat;
    let Projection;
    let Point;
    let LinearRing;
    let Polygon;
    const SCRIPT_ID = "ur_minus";
    const UR_MINUS_PREFIX = 'wme-ur-minus_';
    const USER_PREF_ACTIVE = UR_MINUS_PREFIX + 'user_preferences_active';

    const USER_PREF_ALL_URS = UR_MINUS_PREFIX + 'user_preferences_all_urs';
    const USER_PREF_NO_COMMENTS = UR_MINUS_PREFIX + 'user_preferences_no_comments';
    const USER_PREF_HAS_COMMENTS = UR_MINUS_PREFIX + 'user_preferences_has_comments';
    const USER_PREF_LAST_COMMENT_BY_ME = UR_MINUS_PREFIX + 'user_preferences_last_comment_by_me';
    const USER_PREF_LAST_COMMENT_BEFORE = UR_MINUS_PREFIX + 'user_preferences_last_comment_before';
    const USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS = UR_MINUS_PREFIX + 'user_preferences_last_comment_before_num_of_days';
    const USER_PREF_WITH_COMMENTS_NOT_MINE = UR_MINUS_PREFIX + 'user_preferences_with_comments_not_mine';
    const USER_PREF_OUTSIDE_MY_AREAS_UR = UR_MINUS_PREFIX + 'user_preferences_outside_my_areas_ur';
    const USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_UR = UR_MINUS_PREFIX + 'user_preferences_inside_other_managers_ur';

    const USER_PREF_ALL_PURS = UR_MINUS_PREFIX + 'user_preferences_all_purs';
    const USER_PREF_ABOVE_MY_RANK = UR_MINUS_PREFIX + 'user_preferences_above_my_rank';
    const USER_PREF_OUTSIDE_MY_AREAS_PUR = UR_MINUS_PREFIX + 'user_preferences_outside_my_areas_pur';
    const USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_PUR = UR_MINUS_PREFIX + 'user_preferences_inside_other_managers_pur';
    const USER_PREF_CHARGING_STATIONS = UR_MINUS_PREFIX + 'user_preferences_charging_stations_pur';
    const WME_UR_MINUS_DIV_TOOLTIP_ID = UR_MINUS_PREFIX + 'DivTooltip';
    const ALL_USER_PERF_CHECKBOXES_IDS = [USER_PREF_ALL_URS, USER_PREF_NO_COMMENTS, USER_PREF_HAS_COMMENTS, USER_PREF_LAST_COMMENT_BY_ME, USER_PREF_LAST_COMMENT_BEFORE, USER_PREF_WITH_COMMENTS_NOT_MINE, USER_PREF_OUTSIDE_MY_AREAS_UR, USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_UR, USER_PREF_ALL_PURS, USER_PREF_ABOVE_MY_RANK, USER_PREF_OUTSIDE_MY_AREAS_PUR, USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_PUR, USER_PREF_CHARGING_STATIONS];
    const STORAGE_KEY_MY_MANAGED_AREAS = UR_MINUS_PREFIX + "my-managed-areas";
    let urMinus_csrfToken;

    if (typeof OpenLayers != 'undefined' && W && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-ur-minus: WME is ready.');
        init();
    } else {
        console.debug('wme-ur-minus: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function getCsrfToken(cb) {
        console.debug('wme-ur-minus: getCsrfToken()');
        let url = "https://" + document.location.host + W['Config'].paths['configurationInfo'];
        GM_xmlhttpRequest({
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01"            },
            onload: function(response) {
                if (response.status === 200) {
                    let cookies = response['responseHeaders'].match(/_csrf_token=(.*); Path/i);
                    if (cookies && cookies.length >= 2) {
                        let csrfToken = cookies[1];
                        console.debug('wme-ur-minus: getCsrfToken() returning: ' + csrfToken);
                        cb(csrfToken);
                    } else {
                        console.error('wme-ur-minus: getCsrfToken() responseHeaders: ' + response['responseHeaders']);
                    }
                } else {
                    console.error('wme-ur-minus: getCsrfToken() response status: ' + response.status);
                }
            }
        });
    }


    function init() {
        console.info('wme-ur-minus: init()');
        document.addEventListener("wme-map-data-loaded", dataLoadedEvent);
        //noinspection JSUnresolvedVariable
        LonLat = OpenLayers.LonLat.bind(OpenLayers);
        //noinspection JSUnresolvedVariable
        Projection = OpenLayers.Projection.bind(OpenLayers);
        //noinspection JSUnresolvedVariable
        Point = OpenLayers.Geometry.Point.bind(OpenLayers);
        //noinspection JSUnresolvedVariable
        LinearRing = OpenLayers.Geometry.LinearRing.bind(OpenLayers);
        //noinspection JSUnresolvedVariable
        Polygon = OpenLayers.Geometry.Polygon.bind(OpenLayers);
        //noinspection JSUnresolvedVariable
        wMethods["getAppRegionCode"] = W['app'].getAppRegionCode;
        //noinspection JSUnresolvedVariable
        wMethods["waitForElementConnected"] = W['userscripts'].waitForElementConnected.bind(W['userscripts']);
        //noinspection JSUnresolvedVariable
        wMethods["registerSidebarTab"] = W['userscripts'].registerSidebarTab.bind(W['userscripts']);
        //noinspection JSUnresolvedVariable
        //wMethods["getLayerByName"] = W['map'].getLayerByName.bind(W['map']);
        getCsrfToken(function (val) {
            urMinus_csrfToken = val;
            afterGettingCsrfToken();
        })
    }

    function afterGettingCsrfToken() {
        setTimeout(function () {
            handleUI();
            processFilters();
        }, 1000)
    }

    function processFilters() {
        console.info('wme-ur-minus: processFilters()');
        let userPrefActive = localStorage.getItem(USER_PREF_ACTIVE) === "true";
        let managedAreas = getManagedAreas();
        processMurFilters(userPrefActive, managedAreas);
        processVenueFilters(userPrefActive, managedAreas);
        addTooltipEvents();
    }

    function processVenueFilters(userPrefActive, managedAreas) {
        console.debug('wme-ur-minus: processVenueFilters()');
        if (W.model['venues'] && W.model['venues'].objects) {
            let allPlaceUpdateRequestIDs = Object.values(W.model['venues'].objects).filter(venue => venue.attributes['venueUpdateRequests'].length > 0).map(venue => venue.attributes.id);
            /*
            let allPlaceUpdateRequestIDs = jQuery("div").map(function () {
                if (parseInt($(this).attr("data-update-count")) > 0) {
                    return $(this).attr("data-id");
                }
            }).get();
            */
            let userID = W['loginManager']['user']['id'] || W['loginManager']['user']['attributes']['id'];
            let userRank = W['loginManager']['user']['rank'] || W['loginManager']['user']['attributes']['rank'];
            let userPrefAllPurs = localStorage.getItem(USER_PREF_ALL_PURS) === "true";
            let userPrefAboveMyRank = localStorage.getItem(USER_PREF_ABOVE_MY_RANK) === "true";
            let userPrefOutsideMyAreasPur = localStorage.getItem(USER_PREF_OUTSIDE_MY_AREAS_PUR) === "true";
            let userPrefInsideOtherManagersAreasPur = localStorage.getItem(USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_PUR) === "true";
            let userPrefChargingStations = localStorage.getItem(USER_PREF_CHARGING_STATIONS) === "true";
            let allVenues = W.model['venues'].objects;
            console.info('wme-ur-minus: processVenueFilters() processing ' + allPlaceUpdateRequestIDs.length + ' venues update requests...');
            allPlaceUpdateRequestIDs.forEach(id => {
                let venue = allVenues[id];
                let hideBecauseAllPurs = shouldHBecauseAllPurs(userPrefActive, venue, userPrefAllPurs);
                let hideBecauseAboveMyRank = shouldHBecauseAboveMyRank(userPrefActive, venue, userPrefAboveMyRank, userRank);
                let hideBecauseOutsideMyAreaPur = shouldHideBecauseOutsideMyArea(userPrefActive, venue, userID, userPrefOutsideMyAreasPur, managedAreas["my"]);
                let hideBecauseInsideOtherManagersAreasPur = shouldHideBecauseInsideOtherManagersAreas(userPrefActive, venue, userID, userPrefInsideOtherManagersAreasPur, managedAreas);
                let hideBecauseChargingStationsPur = shouldHideBecauseChargingStationsPur(userPrefActive, venue, userPrefChargingStations);
                let hide = hideBecauseAllPurs || hideBecauseAboveMyRank || hideBecauseOutsideMyAreaPur || hideBecauseInsideOtherManagersAreasPur || hideBecauseChargingStationsPur;
                if (hide) {
                    hideMUR({id:venue['attributes']['id']});
                } else {
                    showMUR({id:venue['attributes']['id']});
                }
            });
        }
    }

    function processMurFilters(userPrefActive, managedAreas) {
        console.debug('wme-ur-minus: processMurFilters()');
        if (W.model.mapUpdateRequests && W.model.mapUpdateRequests.objects) {
            getUrComments(userPrefActive, function (urWithCommentsResponse) {
                let userID = W['loginManager']['user']['id'] || W['loginManager']['user']['attributes']['id'];
                let userPrefAllUrs = localStorage.getItem(USER_PREF_ALL_URS) === "true";
                let userPrefNoComments = localStorage.getItem(USER_PREF_NO_COMMENTS) === "true";
                let userPrefHasComments = localStorage.getItem(USER_PREF_HAS_COMMENTS) === "true";
                let userPrefLastCommentByMe = localStorage.getItem(USER_PREF_LAST_COMMENT_BY_ME) === "true";
                let now = (new Date()).getTime();
                let userPrefLastCommentBefore = localStorage.getItem(USER_PREF_LAST_COMMENT_BEFORE) === "true";
                let userPrefLastCommentBeforeNumOfDays = parseInt(localStorage.getItem(USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS));
                let userPrefWithCommentsNotMine = localStorage.getItem(USER_PREF_WITH_COMMENTS_NOT_MINE) === "true";
                let userPrefOutsideMyAreasUr = localStorage.getItem(USER_PREF_OUTSIDE_MY_AREAS_UR) === "true";
                let userPrefInsideOtherManagersAreasUr = localStorage.getItem(USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_UR) === "true";
                let users = urWithCommentsResponse['users']['objects'];
                console.info('wme-ur-minus: processMurFilters() processing ' + Object.keys(W.model.mapUpdateRequests.objects).length + ' map update requests...');
                Object.values(W.model.mapUpdateRequests.objects).forEach(mur => {
                    let murID = mur['attributes']['id'];
                    console.debug('wme-ur-minus: processMurFilters() checking map update request ' + murID);
                    let murComments = urWithCommentsResponse['updateRequestSessions']['objects'].find(obj => obj.id === murID);
                    let hideBecauseAllUrs = shouldHideBecauseAllUrs(userPrefActive, mur, userID, userPrefAllUrs);
                    let hideBecauseNoComments = shouldHideBecauseNoComments(userPrefActive, mur, murComments, userPrefNoComments);
                    let hideBecauseHasComments = shouldHideBecauseHasComments(userPrefActive, mur, murComments, userPrefHasComments);
                    let hideBecauseLastCommentByMe = shouldHideBecauseLastCommentByMe(userPrefActive, mur, userID, userPrefLastCommentByMe, murComments);
                    let hideBecauseLastCommentTooNew = shouldHideBecauseLastCommentTooNew(userPrefActive, mur, userPrefLastCommentBefore, userPrefLastCommentBeforeNumOfDays, now);
                    let hideBecauseWithCommentsNotMine = shouldHideBecauseWithCommentsNotMine(userPrefActive, mur, userPrefWithCommentsNotMine, murComments, users, userID);
                    let hideBecauseOutsideMyAreaUr = shouldHideBecauseOutsideMyArea(userPrefActive, mur, userID, userPrefOutsideMyAreasUr, managedAreas["my"]);
                    let hideBecauseInsideOtherManagersAreasUr = shouldHideBecauseInsideOtherManagersAreas(userPrefActive, mur, userID, userPrefInsideOtherManagersAreasUr, managedAreas);
                    let hide = hideBecauseAllUrs || hideBecauseNoComments || hideBecauseHasComments || hideBecauseLastCommentByMe || hideBecauseLastCommentTooNew || hideBecauseWithCommentsNotMine || hideBecauseOutsideMyAreaUr || hideBecauseInsideOtherManagersAreasUr;
                    if (hide) {
                        hideMUR({id:murID});
                    } else {
                        showMUR({id:murID, murComments:murComments});
                    }
                });
            });
        }
    }

    const DUMMY_RESPONSE = {"updateRequestSessions":{"objects":[]},"users":{"objects":[]}};
    function getUrComments(userPrefActive, cb) {
        console.debug('wme-ur-minus: getUrComments()');
        if (userPrefActive) {
            let hasCommentsIDs = Object.values(W.model.mapUpdateRequests.objects).filter(mur => mur.attributes['hasComments']).map(mur => mur.attributes.id)
            if (hasCommentsIDs.length > 0) {
                getUpdateRequestSessions(hasCommentsIDs, function (response) {
                    if (response) {
                        console.debug('wme-ur-minus: getUrComments() got ' + response['updateRequestSessions']['objects'].length + ' URs with comments and ' + response['users']['objects'].length + " users");
                        cb(response);
                    } else {
                        console.error('wme-ur-minus: getUrComments() no response');
                    }
                });
            } else {
                cb(DUMMY_RESPONSE);
            }
        } else {
            cb(DUMMY_RESPONSE);
        }
    }

    function shouldHBecauseAllPurs(userPrefActive, venue, userPrefAllPurs) {
        let result = userPrefActive && userPrefAllPurs;
        console.debug('wme-ur-minus: shouldHBecauseAllPurs() venue: ' + venue['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHBecauseAboveMyRank(userPrefActive, venue, userPrefAboveMyRank, userRank) {
        let result = false;
        if (userPrefActive && userPrefAboveMyRank) {
            result = (userRank < venue.attributes['lockRank'] || venue.attributes['adLocked']);
        }
        console.debug('wme-ur-minus: shouldHBecauseAboveMyRank() venue: ' + venue['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseLastCommentTooNew(userPrefActive, mur, userPrefLastCommentBefore, userPrefLastCommentBeforeNumOfDays, now) {
        let result = false;
        if (userPrefActive && userPrefLastCommentBefore) {
            result = (now - mur.attributes['updatedOn']) < 1000 * 60 * 60 * 24 * userPrefLastCommentBeforeNumOfDays;
        }
        console.debug('wme-ur-minus: shouldHideBecauseLastCommentTooNew() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseWithCommentsNotMine(userPrefActive, mur, userPrefWithCommentsNotMine, murComments, users, userID) {
        let result = false;
        if (userPrefActive && userPrefWithCommentsNotMine) {
            if (murComments && murComments.comments.length) {
                // has comments
                result = true;
                murComments.comments.forEach(comment => {
                    if (comment['userID'] === userID) {
                        console.debug('wme-ur-minus: shouldHideBecauseWithCommentsNotMine() mur: ' + mur['attributes']['id'] + " found 'mine' comment: " + comment.text);
                        result = false;
                    }
                })
            }
        }
        console.debug('wme-ur-minus: shouldHideBecauseWithCommentsNotMine() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseAllUrs(userPrefActive, mur, userID, userPrefAllUrs) {
        let result = userPrefActive && userPrefAllUrs;
        console.debug('wme-ur-minus: shouldHideBecauseAllUrs() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseLastCommentByMe(userPrefActive, mur, userID, userPrefLastCommentByMe, murComments) {
        let result = false;
        if (userPrefActive && userPrefLastCommentByMe) {
            if (murComments && murComments.comments && murComments.comments.length > 0) {
                result = (userID === murComments.comments[murComments.comments.length-1]['userID']);
            }
        }
        console.debug('wme-ur-minus: shouldHideBecauseLastCommentByMe() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseNoComments(userPrefActive, mur, murComments, userPrefNoComments) {
        let result = false;
        if (userPrefActive && userPrefNoComments) {
            result = !murComments || !murComments.comments || murComments.comments.length === 0;
        }
        console.debug('wme-ur-minus: shouldHideBecauseNoComments() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseHasComments(userPrefActive, mur, murComments, userPrefHasComments) {
        let result = false;
        if (userPrefActive && userPrefHasComments) {
            result = murComments && murComments.comments && murComments.comments.length > 0;
        }
        console.debug('wme-ur-minus: shouldHideBecauseHasComments() mur: ' + mur['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseOutsideMyArea(userPrefActive, obj, userID, userPrefOutsideMyAreasUr, myManagedAreas) {
        let result = false;
        if (userPrefActive && userPrefOutsideMyAreasUr) {
            result = true;
            Object.values(myManagedAreas).forEach(managedArea => {
                let geometry = obj['attributes']['geometry'];
                if (geometry instanceof OpenLayers['Geometry']['Polygon']) {
                    // noinspection JSUnresolvedFunction
                    geometry = geometry.getCentroid();
                }
                // noinspection JSUnresolvedFunction
                if (managedArea['geometry'].containsPoint(geometry)) {
                    result = false;
                }
            });
        }
        console.debug('wme-ur-minus: shouldHideBecauseOutsideMyArea() obj: ' + obj['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseInsideOtherManagersAreas(userPrefActive, obj, userID, userPrefInsideOtherManagersAreasUr, managedAreas) {
        let result = false;
        if (userPrefActive && userPrefInsideOtherManagersAreasUr) {
            // check if inside others managed area:
            Object.values(managedAreas["others"]).forEach(managedArea => {
                let geometry = obj['attributes']['geometry'];
                if (geometry instanceof OpenLayers['Geometry']['Polygon']) {
                    // noinspection JSUnresolvedFunction
                    geometry = geometry.getCentroid();
                }
                // noinspection JSUnresolvedFunction
                if (managedArea['geometry'].containsPoint(geometry)) {
                    result = true;
                    // inside others managers area. check if not in mine
                    Object.values(managedAreas["my"]).forEach(managedArea => {
                        let geometry = obj['attributes']['geometry'];
                        if (geometry instanceof OpenLayers['Geometry']['Polygon']) {
                            // noinspection JSUnresolvedFunction
                            geometry = geometry.getCentroid();
                        }
                        // noinspection JSUnresolvedFunction
                        if (managedArea['geometry'].containsPoint(geometry)) {
                            console.debug('wme-ur-minus: shouldHideBecauseInsideOtherManagersAreas() obj: ' + obj['attributes']['id'] + " is in both other and mine areas. Will not hide");
                            result = false;
                        }
                    });
                }
            });
        }
        console.debug('wme-ur-minus: shouldHideBecauseInsideOtherManagersAreas() obj: ' + obj['attributes']['id'] + ": " + result);
        return result;
    }

    function shouldHideBecauseChargingStationsPur(userPrefActive, venue, userPrefChargingStations) {
        let result = false;
        if (userPrefActive && userPrefChargingStations) {
            if (venue.attributes.categories.includes("CHARGING_STATION")) {
                result = true;
            }
        }
        console.debug('wme-ur-minus: shouldHideBecauseChargingStationsPur() obj: ' + venue['attributes']['id'] + ": " + result);
        return result;
    }

    function hideMUR(params) {
        console.debug('wme-ur-minus: hideMUR() id: ' + params.id);
        let olID = getOlID(params.id);
        if (olID) {
            jQuery('image[id="' + olID +'"]').hide();
        } else {
            console.warn('wme-ur-minus: hideMUR() id: ' + params.id + ' olID not found.');
        }
    }

    function showMUR(params) {
        console.debug('wme-ur-minus: showMUR() id: ' + params.id);
        let olID = getOlID(params.id);
        if (olID) {
            let images = jQuery('image[id="' + olID +'"]');
            images.show();
            if (params.murComments) {
                if (images.length === 1) {
                    addCommentsCounter(images[0], params.murComments);
                } else {
                    console.debug('wme-ur-minus: showMUR() id: ' + params.id + ' not found with olID ' + olID);
                }
            }
        } else {
            console.warn('wme-ur-minus: showMUR() id: ' + params.id + ' not found.');
        }
    }

    function getOlID(murID) {
        let olID = W.map.mapUpdateRequestsLayer.featureMap.get(murID)?.geometry.id;
        if (olID) {
            return olID;
        } else {
            console.warn('wme-ur-minus: getOlID() id: ' + murID + ' not found.');
            return null;
        }
    }

    function addCommentsCounter(imageElement, murComments) {
        console.debug('wme-ur-minus: addCommentsCounter() id: ' + murComments.id);
        let commentsCounter = murComments?.comments?.length || 0;
        const uniqueGroupId = `speech-bubble-group-${imageElement.id}`;
        const existingGroup = imageElement.parentNode.querySelector(`#${uniqueGroupId}`);
        if (existingGroup) {
            existingGroup.remove();
        }
        const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        groupElement.setAttribute('id', uniqueGroupId);
        const imageX = parseFloat(imageElement.getAttribute('x'));
        const imageY = parseFloat(imageElement.getAttribute('y'));
        const imageWidth = parseFloat(imageElement.getAttribute('width'));
        //const imageHeight = parseFloat(imageElement.getAttribute('height'));
        const centerX = imageX + imageWidth - 7; // Adjusted to align with the bubble
        const centerY = imageY + 7; // Adjusted to center vertically
        const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleElement.setAttribute('cx', centerX);
        circleElement.setAttribute('cy', centerY);
        circleElement.setAttribute('r', '7'); // Radius to fully cover the three dots
        circleElement.setAttribute('fill', '#ffffff'); // Match the speech bubble's white background
        circleElement.setAttribute('stroke', '#000000'); // Optional border for visibility
        circleElement.setAttribute('stroke-width', '1');
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', centerX);
        textElement.setAttribute('y', centerY);
        textElement.setAttribute('dy', '3'); // Fine-tune vertical centering
        textElement.setAttribute('font-size', '10'); // Slightly larger for readability
        textElement.setAttribute('fill', '#000000'); // Black text
        textElement.setAttribute('font-family', 'Arial, sans-serif');
        textElement.setAttribute('text-anchor', 'middle'); // Center horizontally
        textElement.textContent = commentsCounter.toString();
        groupElement.appendChild(circleElement);
        groupElement.appendChild(textElement);
        imageElement.parentNode.appendChild(groupElement);
    }

    function handleUI() {
        console.info('wme-ur-minus: handleUI()');
        let registerSidebarTabResult = wMethods["registerSidebarTab"](SCRIPT_ID);
        wMethods["waitForElementConnected"](registerSidebarTabResult['tabLabel']).then(() => {
            registerSidebarTabResult['tabLabel'].innerText = "UR-";
        });
        wMethods["waitForElementConnected"](registerSidebarTabResult['tabPane']).then(() => {
            drawUI(registerSidebarTabResult['tabPane']);
        });
    }

    function drawUI(tabPane) {
        console.debug('wme-ur-minus: drawUI()');
        addUserScriptTab(tabPane);
        addTooltips();
        addStyle();
        // register for new events. to invoke only once on startup, make a short delay
        setTimeout(function () {
            document.addEventListener("wme-map-data-loaded", processFilters)
        }, 1000);
        // refresh filters on panel close
        document.body.addEventListener('click', function(event) {
            if (event.target.classList.contains('close-panel')) {
                console.debug('wme-ur-minus: click() on close-panel');
                processFilters();
            }
        });
        console.info('wme-ur-minus: drawUI() done');
    }

    function addStyle() {
        GM_addStyle(`.ur-minus-comments-tooltip {
            background: white;
            border-radius: 50%;
            padding: 8px;
            border: 1px solid black;
            width: 4px;
            height: 4px;
            position: absolute;
            top: -8px;
            left: 20px;
            justify-content: center;
            align-items: center;
            display: flex;
            font-size: 10px;
        }`);
        GM_addStyle(`.ur-minus-remove-after-background-image::after {
            background-image: none !important;
        }`);
    }

    function addUserScriptTab(tabPane) {
        console.debug('wme-ur-minus: addUserScriptTab()');
        let aSection = document.createElement('section');
        aSection.id = 'close-mur';
        aSection.className = 'tab-pane';
        let section = document.createElement('p');
        aSection.appendChild(section);
        let userPrefActive = localStorage.getItem(USER_PREF_ACTIVE) === "true" ? ' checked' : '';
        let userPrefActiveStr = userPrefActive ? '':' disabled';
        let userPrefAllUrsStr = localStorage.getItem(USER_PREF_ALL_URS) === "true" ? ' checked' : '';
        let userPrefNoCommentsStr = localStorage.getItem(USER_PREF_NO_COMMENTS) === "true" ? ' checked' : '';
        let userPrefHasCommentsStr = localStorage.getItem(USER_PREF_HAS_COMMENTS) === "true" ? ' checked' : '';
        let userPrefLastCommentByMeStr = localStorage.getItem(USER_PREF_LAST_COMMENT_BY_ME) === "true" ? ' checked' : '';
        let userPrefLastCommentBefore = localStorage.getItem(USER_PREF_LAST_COMMENT_BEFORE) === "true" ? ' checked' : '';
        let userPrefWithCommentsNotMine = localStorage.getItem(USER_PREF_WITH_COMMENTS_NOT_MINE) === "true" ? ' checked' : '';
        let userPrefOutsideMyAreasUr = localStorage.getItem(USER_PREF_OUTSIDE_MY_AREAS_UR) === "true" ? ' checked' : '';
        let userPrefInsideOtherManagersAreasUr = localStorage.getItem(USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_UR) === "true" ? ' checked' : '';
        let userPrefAllPurs = localStorage.getItem(USER_PREF_ALL_PURS) === "true" ? ' checked' : '';
        let userPrefAboveMyRank = localStorage.getItem(USER_PREF_ABOVE_MY_RANK) === "true" ? ' checked' : '';
        let userPrefOutsideMyAreasPur = localStorage.getItem(USER_PREF_OUTSIDE_MY_AREAS_PUR) === "true" ? ' checked' : '';
        let userPrefInsideOtherManagersAreasPur = localStorage.getItem(USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_PUR) === "true" ? ' checked' : '';
        let userPrefChargingStationsPur = localStorage.getItem(USER_PREF_CHARGING_STATIONS) === "true" ? ' checked' : '';
        section.innerHTML = '<b>When active, filter user reports</b><br/>' +
            '<br/>Active:&nbsp;<input type="checkbox" id="WME_ur_minus_active"' + userPrefActive + '/><br/>' +
            '<br/><b>Hide Map Update Requests:</b><br/>' +
            '<input type="checkbox" id="' + USER_PREF_ALL_URS +'"' + userPrefAllUrsStr + userPrefActiveStr + '/>  All<br/>' +
            '<input type="checkbox" id="' + USER_PREF_HAS_COMMENTS +'"' + userPrefHasCommentsStr + userPrefActiveStr + '/>  Have comments<br/>' +
            '<input type="checkbox" id="' + USER_PREF_NO_COMMENTS +'"' + userPrefNoCommentsStr + userPrefActiveStr + '/>  Have no comments<br/>' +
            '<input type="checkbox" id="' + USER_PREF_LAST_COMMENT_BY_ME +'"' + userPrefLastCommentByMeStr + userPrefActiveStr + '/>  Last comment by me<br/>' +
            '<input type="checkbox" id="' + USER_PREF_LAST_COMMENT_BEFORE + '"' + userPrefLastCommentBefore + userPrefActiveStr + '/>  Last comment at least <select id="' + USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS + '"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="12">12</option><option value="14">14</option></select>&nbsp;days old.<br/>' +
            '<input type="checkbox" id="' + USER_PREF_WITH_COMMENTS_NOT_MINE +'"' + userPrefWithCommentsNotMine + userPrefActiveStr + '/>  With comments - not mine<br/>' +
            '<input type="checkbox" id="' + USER_PREF_OUTSIDE_MY_AREAS_UR +'"' + userPrefOutsideMyAreasUr + userPrefActiveStr + '/>  Outside my managed area(s)<br/>' +
            '<input type="checkbox" id="' + USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_UR +'"' + userPrefInsideOtherManagersAreasUr + userPrefActiveStr + '/>  Inside other managers areas<br/>' +
            '<br/><b>Hide Place Update Requests:</b><br/>' +
            '<input type="checkbox" id="' + USER_PREF_ALL_PURS + '"' + userPrefAllPurs + userPrefActiveStr + '/>  All<br/>' +
            '<input type="checkbox" id="' + USER_PREF_ABOVE_MY_RANK + '"' + userPrefAboveMyRank + userPrefActiveStr + '/>  Above my rank<br/>' +
            '<input type="checkbox" id="' + USER_PREF_OUTSIDE_MY_AREAS_PUR +'"' + userPrefOutsideMyAreasPur + userPrefActiveStr + '/>  Outside my managed area(s)<br/>' +
            '<input type="checkbox" id="' + USER_PREF_INSIDE_OTHERS_MANAGERS_AREAS_PUR +'"' + userPrefInsideOtherManagersAreasPur + userPrefActiveStr + '/>  Inside other managers areas<br/>' +
            '<input type="checkbox" id="' + USER_PREF_CHARGING_STATIONS +'"' + userPrefChargingStationsPur + userPrefActiveStr + '/>  ' + I18n.lookup("venues.categories.CHARGING_STATION") + '<br/>';
        tabPane.append(aSection);
        // set values from storage and register events
        jQuery("#WME_ur_minus_active").on("change", urMinusActiveChange);
        ALL_USER_PERF_CHECKBOXES_IDS.forEach(id => {
            jQuery("#" + id).on("change", urMinusUserPerfCheckboxChange);
        })
        let numOfDaysItem = jQuery("#" + USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS);
        numOfDaysItem.val(localStorage.getItem(USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS));
        numOfDaysItem.on("change", urMinusNumOfDaysChange);
        console.info('wme-ur-minus: addUserScriptTab() done');
    }

    function addTooltipEvents() {
        console.debug('wme-ur-minus: addTooltipEvents()');
        // mur
        //let urLayerId = wMethods["getLayerByName"]("update_requests").id;
        let allUpdateRequestsSelector = "div.map-marker.user-generated.map-problem";
        jQuery(allUpdateRequestsSelector).on( "mouseenter", {type:"mur"}, urMouseEnter ).on( "mouseleave", urMouseOut );
        //console.debug('wme-ur-minus: addTooltipEvents() number of mur: ' + jQuery(allUpdateRequestsSelector).length + " murs: " + Object.keys(W.model.mapUpdateRequests.objects).length);
        // pur
        let allPlaceUpdateRequests = jQuery("div.map-marker.place-update").filter(function () {
            return parseInt(jQuery(this).attr("data-update-count")) > 0;
        });
        jQuery(allPlaceUpdateRequests).on( "mouseenter", {type:"venue"} , urMouseEnter).on( "mouseleave", urMouseOut );
        // mp
        //let mpLayerId = wMethods["getLayerByName"]("mapProblems").id;
        let allMapProblemsSelector = "div.map-marker:not(.user-generated).map-problem";
        jQuery(allMapProblemsSelector).on( "mouseenter", {type:"mp"} , urMouseEnter).on( "mouseleave", urMouseOut );
        // segments suggestions
        //let ssLayerId = wMethods["getLayerByName"]("segment_suggestions_markers").id;
        let allSSSelector = "div.map-marker.segment-suggestion-marker";
        jQuery(allSSSelector).on( "mouseenter", {type:"ss"} , urMouseEnter).on( "mouseleave", urMouseOut );
    }

    function urMouseEnter(event) {
        console.debug('wme-ur-minus: urMouseEnter()');
        let toolTipDiv = jQuery('#' + WME_UR_MINUS_DIV_TOOLTIP_ID);
        if (toolTipDiv.css("visibility") === "hidden") {
            toolTipDiv.css('visibility', 'visible');
            toolTipDiv.css('top', jQuery(event.currentTarget).offset().top);
            toolTipDiv.css('left', jQuery(event.currentTarget).offset().left + 25);
            toolTipDiv.css('display', 'block');
            if (event.data.type === "mur") {
                let murID = this.getAttribute('data-id');
                let mur = W.model.mapUpdateRequests.objects[murID]
                if (mur) {
                    toolTipDiv.html(getUrTooltipText(mur));
                } else {
                    console.error('wme-ur-minus: urMouseEnter() mur not found: ' + murID);
                }
            } else if (event.data.type === "venue") {
                let venueID = this.getAttribute('data-id');
                let venue = W.model['venues'].objects[venueID]
                if (venue) {
                    toolTipDiv.html(getPurTooltipText(venue));
                } else {
                    console.error('wme-ur-minus: urMouseEnter() mur venue found: ' + venueID);
                }
            } else if (event.data.type === "mp") {
                let mpID = this.getAttribute('data-id');
                let mp = W.model['mapProblems'].objects[mpID]
                if (mp) {
                    toolTipDiv.html(getMpTooltipText(mp));
                } else {
                    console.error('wme-ur-minus: urMouseEnter() mp not found: ' + mpID);
                }
            } else if (event.data.type === "ss") {
                let mousePosition = jQuery('.wz-map-ol-control-span-mouse-position').text().split(" ");
                let lat = mousePosition[0];
                let lon = mousePosition[1];
                let ssID;
                let candidateDistance = 1000000;
                Object.keys(W.model['segmentSuggestions'].objects).forEach(id => {
                    let segmentSuggestion = W.model['segmentSuggestions'].objects[id];
                    //let centroid2 = segmentSuggestion.attributes.geometry.getCentroid();
                    let center = segmentSuggestion.getCenter();
                    let segmentSuggestionCentroid = convertTo4326(center.x,center.y);
                    let latDistance = Math.round(Math.abs(lat * 1000000 - segmentSuggestionCentroid.lat * 1000000));
                    let lonDistance = Math.round(Math.abs(lon * 1000000 - segmentSuggestionCentroid.lon * 1000000));
                    const expectedGap = Math.pow(2, 24 - W.map.getZoom()) * 1.5; //  14=1000; 15=500; 16=250; 17=125; 18= 64; 19=32; 2^(23-W.map.getZoom())
                    let maxDistance = Math.max(latDistance, lonDistance)
                    if (maxDistance < expectedGap && maxDistance < candidateDistance) {
                        console.debug('wme-ur-minus: urMouseEnter() for ss ID: ' + id + ' max distance is: ' + maxDistance + " less than expected: " + expectedGap + " and less than candidate: " + candidateDistance);
                        ssID = id;
                        candidateDistance = maxDistance;
                    } else {
                        console.debug('wme-ur-minus: urMouseEnter() for ss ID: ' + id + ' max distance is: ' + maxDistance + " more than expected: " + expectedGap);
                    }
                });
                if (ssID) {
                    let ss = W.model['segmentSuggestions'].objects[ssID]
                    if (ss) {
                        toolTipDiv.html(getSsTooltipText(ss));
                    } else {
                        console.error('wme-ur-minus: urMouseEnter() ss not found for ID ' + ssID + '. No tooltip will be generated');
                    }
                } else {
                    console.error('wme-ur-minus: urMouseEnter() No ID was found as candidate. No tooltip will be generated');
                }
            }
        }
    }

    function getPurTooltipText(venue) {
        let attributes = venue.attributes;
        console.debug('wme-ur-minus: getPurTooltipText() venue ID: ' + attributes.id);
        let venueName = getVenueName(attributes);
        let result = '<p style="text-align: center"><b>' + venueName + '</b></p>';
        // open
        result += "<b><u>Open in:</u></b> ";
        result += "<a target='_blank' href='" + getPurURL(attributes) + "'>new tab</a>";
        result += "<br/>";
        // update type
        let updateTypeValue;
        let updateType = venue.attributes['venueUpdateRequests'][0].attributes['updateType'];
        if (updateType === 'flag') {
            let subject = venue.attributes['venueUpdateRequests'][0].attributes['subject'];
            updateTypeValue = I18n.lookup("venues.update_requests.panel.flag_title." + subject);
        } else {
            updateTypeValue = I18n.lookup("venues.update_requests.panel.title." + updateType);
        }
        result += "<b><u>Reason:</u></b> ";
        result += escapeTooltipText(updateTypeValue);
        result += "<br/>";
        // description
        result += "<b><u>Description:</u></b> ";
        result += attributes.description?escapeTooltipText(attributes.description):"(none)";
        result += "<br/>";
        // categories
        result += "<b><u>Categories:</u></b> ";
        let translatedCategories = attributes.categories.map(category => I18n.lookup("venues.categories." + category));
        result += escapeTooltipText(translatedCategories.join(","));
        result += "<br/>";
        return result;
    }

    function getVenueName(attributes) {
        if (attributes['residential']) {
            let houseNumber = attributes['houseNumber'];
            let streetID = attributes['streetID'];
            if (streetID) {
                let streenName = W.model.streets.objects[streetID].name || W.model.streets.objects[streetID].attributes.name;
                let cityID = W.model.streets.objects[streetID].cityID || W.model.streets.objects[streetID].attributes.cityID;
                let cityName = W.model['cities'].objects[cityID].attributes.name;
                return streenName + " " + houseNumber + ", " + cityName;
            } else {
                // TODO: I18n.lookup("");
                return I18n.lookup("edit.venue.no_address");
            }
        } else {
            return attributes['name'];
        }
    }

    function getUrTooltipText(mur) {
        let attributes = mur.attributes;
        console.debug('wme-ur-minus: getUrTooltipText() murID: ' + attributes.id);
        let result = '<p style="text-align: center"><b>' + attributes['typeText'] + '</b></p>';
        // open
        result += "<b><u>Open in:</u></b> ";
        result += "<a target='_blank' href='" + getMurURL(attributes) + "'>new tab</a>";
        result += "<br/>";
        // ID
        result += "<b><u>ID:</u></b> ";
        result += attributes.id;
        result += "<br/>";
        // description
        result += "<b><u>Description:</u></b> ";
        result += attributes.description?escapeTooltipText(attributes.description):"(none)";
        result += "<br/>";
        // driveDate
        result += "<b><u>Drive Date:</u></b> ";
        result += new Date(attributes.driveDate).toLocaleString(I18n.locale, {year: '2-digit', month: '2-digit',day: '2-digit', hour:'numeric', minute:'2-digit'});
        result += "<br/>";
        // Source
        if (attributes.source) {
            result += "<b><u>Source:</u></b> ";
            result += I18n.lookup(`issue_tracker.filters.UPDATE_REQUESTS.sources.${attributes.source}.title`);
            result += "<br/>";
        }
        return result;
    }

    function getMpTooltipText(mp) {
        let attributes = mp.attributes;
        console.debug('wme-ur-minus: getMpTooltipText() murID: ' + attributes.id);
        let subType = attributes['subType'];
        let texts = I18n.lookup(`problems.types.${subType}`);
        let result = '<p style="text-align: center"><b>' + texts['title'] + '</b></p>';
        // open
        result += "<b><u>Open in:</u></b> ";
        result += "<a target='_blank' href='" + getMpURL(attributes) + "'>new tab</a>";
        result += "<br/>";
        // ID
        result += "<b><u>ID:</u></b> ";
        result += attributes.id;
        result += "<br/>";
        // description
        result += "<b><u>Description:</u></b> ";
        result += texts['description'];
        result += "<br/>";
        // solution
        result += "<b><u>Solution:</u></b> ";
        result += texts['solution'];
        result += "<br/>";
        return result;
    }

    function getSsTooltipText(ss) {
        let attributes = ss.attributes;
        console.debug('wme-ur-minus: getSsTooltipText() murID: ' + attributes.id);
        let texts = I18n.lookup(`edit.segment_suggestion`);
        let result = '<p style="text-align: center"><b>' + texts['title'] + '</b></p>';
        // open
        result += "<b><u>Open in:</u></b> ";
        result += "<a target='_blank' href='" + getSsURL(ss) + "'>new tab</a>";
        result += "<br/>";
        // ID
        result += "<b><u>ID:</u></b> ";
        result += attributes.id;
        result += "<br/>";
        return result;
    }

    function getPurURL(purAttributes) {
        let id = purAttributes.id;
        let boundsCenterLonLat = purAttributes.geometry.getBounds().getCenterLonLat();
        let x = purAttributes.geometry.x?purAttributes.geometry.x:boundsCenterLonLat.lon;
        let y = purAttributes.geometry.y?purAttributes.geometry.y:boundsCenterLonLat.lat;
        let convertedTo4326 = convertTo4326(x, y);
        return document.location.origin + "/" + I18n.locale + "/editor?env=" + wMethods["getAppRegionCode"]() + "&lon=" + convertedTo4326.lon.toFixed(6) + "&lat=" + convertedTo4326.lat.toFixed(6) + "&zoomLevel=19&venueUpdateRequest=" + id;
    }

    function getMurURL(murAttributes) {
        let id = murAttributes.id;
        let x = murAttributes.geometry.x;
        let y = murAttributes.geometry.y;
        let convertedTo4326 = convertTo4326(x, y);
        return document.location.origin + "/" + I18n.locale + "/editor?env=" + wMethods["getAppRegionCode"]() + "&lon=" + convertedTo4326.lon.toFixed(6) + "&lat=" + convertedTo4326.lat.toFixed(6) + "&zoomLevel=19&mapUpdateRequest=" + id;
    }

    function getMpURL(mpAttributes) {
        let id = mpAttributes.id;
        let x = mpAttributes.geometry.x;
        let y = mpAttributes.geometry.y;
        let convertedTo4326 = convertTo4326(x, y);
        return document.location.origin + "/" + I18n.locale + "/editor?env=" + wMethods["getAppRegionCode"]() + "&lon=" + convertedTo4326.lon.toFixed(6) + "&lat=" + convertedTo4326.lat.toFixed(6) + "&zoomLevel=19&mapProblem=" + id;
    }

    function getSsURL(ss) {
        let ssAttributes = ss.attributes;
        let id = ssAttributes.id;
        let center = ss.getCenter();
        let convertedTo4326 = convertTo4326(center.x,center.y);
        return document.location.origin + "/" + I18n.locale + "/editor?env=" + wMethods["getAppRegionCode"]() + "&lon=" + convertedTo4326.lon.toFixed(6) + "&lat=" + convertedTo4326.lat.toFixed(6) + "&zoomLevel=19&segmentSuggestions=" + id;
    }

    function convertTo4326(x, y) {
        let projI = new Projection("EPSG:900913");
        let projE = new Projection("EPSG:4326");
        return (new LonLat(x, y)).transform(projI, projE);
    }

    function escapeTooltipText(str) {
        return (str||'').replace('%20', '"').replace('%27', "'").replace('%28', "(").replace('%29', ")");
    }

    function urMouseOut() {
        console.debug('wme-ur-minus: urMouseOut()');
        let tooltipDiv = jQuery('#' + WME_UR_MINUS_DIV_TOOLTIP_ID + ':hover');
        if (tooltipDiv.length > 0) {
            tooltipDiv.on("mouseleave", function () {
                jQuery('#' + WME_UR_MINUS_DIV_TOOLTIP_ID).css('visibility', 'hidden');
            });
        } else {
            jQuery('#' + WME_UR_MINUS_DIV_TOOLTIP_ID).css('visibility', 'hidden');
        }
    }

    function urMinusActiveChange() {
        console.info('wme-ur-minus: urMinusActiveChange() new value: ' + this.checked);
        localStorage.setItem(USER_PREF_ACTIVE, this.checked);
        if (this.checked) {
            setEnabled();
        } else {
            setDisabled();
        }
        processFilters();
    }

    function setEnabled() {
        console.info('wme-ur-minus: setEnabled()');
        ALL_USER_PERF_CHECKBOXES_IDS.forEach(id => {
            jQuery("#" + id).removeAttr("disabled");
        });
    }

    function setDisabled() {
        console.info('wme-ur-minus: setDisabled()');
        ALL_USER_PERF_CHECKBOXES_IDS.forEach(id => {
            jQuery("#" + id).attr("disabled", "true");
        });
        jQuery("div.ur-minus-comments-tooltip").remove();
        jQuery("div.has-comments").removeClass('ur-minus-remove-after-background-image');
    }

    function urMinusUserPerfCheckboxChange() {
        console.info('wme-ur-minus: urMinusUserPerfCheckboxChange() for ID: "' + this.id+ '" new value: ' + this.checked);
        localStorage.setItem(this.id, this.checked);
        processFilters();
    }

    function urMinusNumOfDaysChange() {
        console.info('wme-ur-minus: urMinusNumOfDaysChange() new value: ' + this.value);
        localStorage.setItem(USER_PREF_LAST_COMMENT_BEFORE_NUM_OF_DAYS, this.value);
        processFilters();
    }

    function addTooltips() {
        console.debug('wme-ur-minus: addTooltips()');
        let urTooltipDiv = document.createElement('div');
        urTooltipDiv.id = WME_UR_MINUS_DIV_TOOLTIP_ID;
        urTooltipDiv.setAttribute("style", "position: absolute; visibility: hidden; top: 107px; left: 1040px; z-index: 10000; background-color: aliceblue; border-width: 3px; border-style: solid; border-radius: 10px; box-shadow: silver 5px 5px 10px; padding: 4px; height: auto; width: auto; overflow: auto; max-width: 300px; word-wrap: break-word");
        document.body.appendChild(urTooltipDiv);
        urTooltipDiv.addEventListener("mouseover", function () {
            this.style.visibility = 'visible';
        }, false);
        urTooltipDiv.addEventListener("mouseout", function () {
            this.style.visibility = 'hidden';
        }, false);
        urTooltipDiv.addEventListener("dblclick", function () {
            this.style.visibility = 'hidden';
        }, false);
        console.debug('wme-ur-minus: addTooltips() done');
    }

    function getUpdateRequestSessions(ids, cb) {
        console.info('wme-ur-minus: getUpdateRequestSessions() for ' + ids.length + ' IDs.');
        let url = "https://" + document.location.host + W['Config'].paths['updateRequestSessions'] + "?ids=" + ids.join(",");
        fetch(url, {
            headers: {
                "X-CSRF-Token": urMinus_csrfToken,
                "Accept": "application/json"
            }
        }).then(response => {
            if (response.ok && response.status === 200) {
                console.info('wme-ur-minus: getUpdateRequestSessions() response OK');
                response.json().then(json => cb(json));
            } else {
                console.error('wme-ur-minus: getUpdateRequestSessions() failed with status: ' + response.status);
            }
        }).catch(error => {
            console.error('wme-ur-minus: getUpdateRequestSessions() failed with error: ' + error);
        });
    }

    function getManagedAreasWme() {
        let userID = W['loginManager']['user']['id'] || W['loginManager']['user']['attributes']['id'];
        let userName = W['loginManager']['user']['userName'] || W['loginManager']['user']['attributes']['userName'];
        console.debug('wme-ur-minus: getManagedAreasWme() for ' + userName);
        let my = {};
        let others = {};
        if (W.model['managedAreas'] && W.model['managedAreas'].objects) {
            Object.values(W.model['managedAreas'].objects).forEach(managedArea => {
                if ((managedArea['userID'] || managedArea.attributes['userID']) === userID) {
                    my[managedArea['id']] = managedArea;
                } else {
                    others[managedArea['id'] || managedArea.attributes['id']] = managedArea;
                }
            });
        }
        console.info('wme-ur-minus: getManagedAreasWme() for ' + userName + ' returning my ' + Object.keys(my).length + " areas");
        console.info('wme-ur-minus: getManagedAreasWme() for ' + userName + ' returning others ' + Object.keys(others).length + " areas");
        return {my:my, others:others};
    }

    function storeAreaGeomenty(managedArea) {
        let id = managedArea['id'];
        console.debug('wme-ur-minus: storeAreaGeomenty() id: ' + id);
        // noinspection JSUnresolvedFunction
        let vertices = managedArea['geometry'].getVertices();
        let pointsArray = vertices.map(vertice => [vertice['x'],vertice['y']]);
        let fromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY_MY_MANAGED_AREAS) || "{}");
        fromStorage[id] = pointsArray;
        localStorage.setItem(STORAGE_KEY_MY_MANAGED_AREAS, JSON.stringify(fromStorage));
        console.info('wme-ur-minus: storeAreaGeomenty() id: ' + id + " done.");
    }

    function getManagedAreas() {
        console.debug('wme-ur-minus: getManagedAreas()');
        let my = {};
        // get from WME:
        let fromWME = getManagedAreasWme();
        // get from storage:
        let myFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY_MY_MANAGED_AREAS) || "{}");
        // convert ones from storage from string into objects:
        Object.entries(myFromStorage).forEach(([id, xyArray]) => {
            let pointsArray = xyArray.map(xy => new Point(xy[0], xy[1]));
            let linearRing = new LinearRing(pointsArray)
            let polygon = new Polygon([linearRing]);
            my[id] = { geometry:polygon };
        });
        // find which of my areas was found in WME but not yet in storage, and store them.
        let needToStore = Object.keys(fromWME['my']).filter(key => !myFromStorage[key]);
        needToStore.forEach(key => {
            console.debug('wme-ur-minus: getManagedAreas() area ' + key + ' found in WME but not in storage.');
            storeAreaGeomenty(fromWME['my'][key]);
            my[key] = fromWME[key];
        });
        return {my:my, "others":fromWME["others"]};
    }

    function dataLoadedEvent() {
        console.debug('wme-ur-minus: dataLoadedEvent()');
        addTooltipEvents();
    }

})();
