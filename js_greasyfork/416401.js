// ==UserScript==
// @name         mTurk Frame->Parent Interface Library
// @namespace    salembeats
// @version      5.2
// @description  Library to make it easier to send messages to mTurk parent windows from the worker iFrames.
// @author       Cuyler Stuwe (salembeats)
// @grant        GM_xmlhttpRequest
// @include      *
// @icon         http://ez-link.us/sb-png
// @downloadURL https://update.greasyfork.org/scripts/416401/mTurk%20Frame-%3EParent%20Interface%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/416401/mTurk%20Frame-%3EParent%20Interface%20Library.meta.js
// ==/UserScript==

let mTurkParentWindow = (function() {

    var parentWindow = window.parent;
    var parentWindowAccepted;
    var parentWindowLocation;
    var parentWindowHitDetails;

    var parentParametersKnownCallbackHasRun = false;
    var parentParametersKnownCallback = () => {};

    window.addEventListener('message', function(event) {

        let receivedObject = event.data;

        if(receivedObject.hasOwnProperty("mTurkParentWindowResponse")) {

            switch(receivedObject.mTurkParentWindowResponse) {
                case "accepted":
                    parentWindowAccepted = true;
                    break;
                case "notAccepted":
                    parentWindowAccepted = false;
                    break;
                default:
                    break;
            }
        }

        if(receivedObject.hasOwnProperty("urlResponse")) {
            parentWindowLocation = receivedObject.urlResponse;
        }

        if(receivedObject.hasOwnProperty("hitDetails")) {
            parentWindowHitDetails = JSON.parse(receivedObject.hitDetails);
        }

        runParamsKnownCallbackIfAppropriate();

    });

    parentWindow.postMessage({mTurkParentWindowQuery: "accepted"},"*");
    parentWindow.postMessage({mTurkParentWindowQuery: "url"},"*");
    parentWindow.postMessage({mTurkParentWindowQuery: "hitDetails"},"*");

    function allParamsKnown() {
        return (isAcceptedStatusKnown() && isURLKnown() && areHitDetailsKnown());
    }

    function runParamsKnownCallbackIfAppropriate() {
        if(!parentParametersKnownCallbackHasRun && allParamsKnown()) {
            parentParametersKnownCallback();
            parentParametersKnownCallbackHasRun = true;
        }
    }

    function acceptHit() {
        parentWindow.postMessage({mTurkParentWindowAction: "accept"},"*");
    }

    function returnHit() {
        parentWindow.postMessage({mTurkParentWindowAction: "return"},"*");
    }

    function isAccepted() {
        return parentWindowAccepted;
    }

    function isAcceptedStatusKnown() {
        return parentWindowAccepted !== undefined;
    }

    function isURLKnown() {
        return parentWindowLocation !== undefined;
    }

    function areHitDetailsKnown() {
        return parentWindowHitDetails !== undefined;
    }

    function runOnParentParametersKnown(func) {
        parentParametersKnownCallback = func;
        runParamsKnownCallbackIfAppropriate();
    }

    function navigateToURL(url) {
        parentWindow.postMessage({mTurkParentWindowAction: "navigate", url: url},"*");
    }

    function getURL() {
        return parentWindowLocation;
    }

    function getHitDetails() {
        return parentWindowHitDetails;
    }

    function getHitTitle() {
        return parentWindowHitDetails.projectTitle;
    }

    function getHitDescription() {
        return parentWindowHitDetails.description;
    }

    function getRequesterName() {
        return parentWindowHitDetails.requesterName;
    }

    function getRID() {
        return parentWindowHitDetails.contactRequesterUrl.match(/requester_id%5D=([^&]*)/)[1];
    }

    function getGID() {
        return parentWindowHitDetails.contactRequesterUrl.match(/hit_type_id%5D=([^&]*)/)[1];
    }

    function getHitValueAsDollars() {
        return parentWindowHitDetails.monetaryReward.amountInDollars;
    }

    function getHitValueAsCents() {
        return getHitValueAsDollars() * 100;
    }

    function getNumberOfHitsRemaining() {
        return parentWindowHitDetails.assignableHitsCount;
    }

    function getTimeAllowedAsSeconds() {
        return parentWindowHitDetails.assignmentDurationInSeconds;
    }

    function getTimeAllowedAsMinutes() {
        return getTimeAllowedAsSeconds() / 60;
    }

    function getTimeAllowedAsHours() {
        return getTimeAllowedAsMinutes() / 60;
    }

    function acceptNewHitFromSameGid(callback) {
        let gid = parentWindowLocation.match(/projects\/(3.{29})\//)[1];
        GM_xmlhttpRequest({
            url: `https://worker.mturk.com/projects/${gid}/tasks/accept_random?ref=w_pl_prvw`,
            method: "GET",
            onload: (response) => {
                if(callback) {callback();}
            }
        });
    }

    function rotateDifferentHitFromSameGid() {
        acceptNewHitFromSameGid(() => {returnHit();});
    }

    // Not gonna include this b/c it's misleading.
    // Don't think anyone cares about when the whole set of HITs will expire.
    /*
    function getExpirationTime() {
        return new Date(parentWindowHitDetails.expirationTime);
    }
    */

    return {
        acceptHit : acceptHit,
        acceptHIT: acceptHit,
        returnHit : returnHit,
        returnHIT: returnHit,
        isAccepted : isAccepted,
        isAcceptedStatusKnown : isAcceptedStatusKnown,
        isURLKnown : isURLKnown,
        isUrlKnown: isURLKnown,
        areHitDetailsKnown: areHitDetailsKnown,
        areHITDetailsKnown: areHitDetailsKnown,
        runOnParentParametersKnown : runOnParentParametersKnown,
        navigateToURL : navigateToURL,
        navigateToUrl: navigateToURL,
        getURL : getURL,
        getUrl: getURL,
        getHitDetails: getHitDetails,
        getHITDetails: getHitDetails,
        getHitTitle: getHitTitle,
        getHITTitle: getHitTitle,
        getHitDescription: getHitDescription,
        getHITDescription: getHitDescription,
        getRequesterName: getRequesterName,
        getRID: getRID,
        getRid: getRID,
        getGID: getGID,
        getGid: getGID,
        getHitValueAsDollars: getHitValueAsDollars,
        getHITValueAsDollars: getHitValueAsDollars,
        getHitValueAsCents: getHitValueAsCents,
        getHITValueAsCents: getHitValueAsCents,
        getNumberOfHitsRemaining: getNumberOfHitsRemaining,
        getNumberOfHITsRemaining: getNumberOfHitsRemaining,
        getTimeAllowedAsSeconds: getTimeAllowedAsSeconds,
        getTimeAllowedAsMinutes: getTimeAllowedAsMinutes,
        getTimeAllowedAsHours: getTimeAllowedAsHours,
        acceptNewHitFromSameGid: acceptNewHitFromSameGid,
        rotateDifferentHitFromSameGid: rotateDifferentHitFromSameGid
    };
})();