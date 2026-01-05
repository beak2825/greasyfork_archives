// ==UserScript==
// @name         WME Simple UR
// @namespace    https://greasyfork.org/users/gad_m/wme_simple_ur
// @version      0.2.11
// @description  A hardcoded UR,MP,Place filter
// @author       gad_m
// @include      https://beta.waze.com/*editor/*
// @include      https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24861/WME%20Simple%20UR.user.js
// @updateURL https://update.greasyfork.org/scripts/24861/WME%20Simple%20UR.meta.js
// ==/UserScript==

/* global W */

(function() {

	function bootstrap(tries) {
		tries = tries || 1;
		if (window.W &&
			window.W.map &&
			window.W.model &&
			window.W.loginManager &&
			$) {
			init();
		} else if (tries < 1000) {
			setTimeout(function () { bootstrap(tries++); }, 200);
		} else {
			console.log('WME_Simple_UR failed to load');
		}
	}

    bootstrap();
    
    function init() {
        for (var i=0; i<W.map.layers.length; i++) {
            if (W.map.layers[i].uniqueName == "place_updates" || W.map.layers[i].uniqueName == "update_requests") {
                W.map.layers[i].events.register('moveend', this, hideElements);
                W.map.layers[i].events.register('zoomend', this, hideElements);
            }
            if (W.map.layers[i].events.listeners["loadend"]) {
                W.map.layers[i].events.register('loadend', this, hideElements);
            }
        }
        $('.loading-indicator').bind("DOMSubtreeModified",function(e) {
            if (e.target.textContent === '') {
                hideElements();
                // let URO+ load, and then hide elements
                setTimeout(hideElements,3000);
            }
        });
    }
    
    function hideElements(e) {
        // hide locked places (add or lock level is higher than current user level)
        var placeUpdate = $('.place-update').filter(function() {
                return $(this).css('visibility') != 'hidden';
            });
        for(var i=0; (placeUpdate && i< placeUpdate.length); i++) {
            var venueAttributes = W.model.venues.objects[placeUpdate[i].getAttribute("data-id")].attributes;
            if (venueAttributes.adLocked || venueAttributes.lockRank > W.loginManager.user.normalizedLevel) {
                placeUpdate[i].style.visibility = "hidden";
            }
        }
        // hide update request if has comments and
        // 1. last comment posted by current user and last comment is not older than 5 days
        // or
        // 2. last comment posted by user with rank > 2
        var userMapProblem = $('.map-problem.user-generated.has-comments').filter(function() {
                return $(this).css('visibility') != 'hidden';
            });
        for(var j=0; (userMapProblem && j< userMapProblem.length); j++) {
            var problemAttributes = W.model.mapUpdateRequests.objects[userMapProblem[j].getAttribute("data-id")].attributes;
            // if last comment posted by current user
            if (problemAttributes.updatedBy == W.loginManager.user.id) {
                var curTime = new Date().getTime();
                // last comment posted less than 5 days ago
                if ((curTime - problemAttributes.updatedOn) < (1000 * 60 * 60 * 24 * 5)) {
                    userMapProblem[j].style.visibility = "hidden";
                }
            } else if (W.model.users.objects[problemAttributes.updatedBy] && W.model.users.objects[problemAttributes.updatedBy].normalizedLevel > 2) {
                // check if last comment by manager
                userMapProblem[j].style.visibility = "hidden";
            }
        }

    }
}.call(this));