// ==UserScript==
// @name        YouTube Channel Whitelister
// @namespace   https://tekno.pw
// @author      teknogeek
// @description Helps whitelist YouTube channels in uBlock Origin
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @version     2.2
// @grant       none
// @license     http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/30528/YouTube%20Channel%20Whitelister.user.js
// @updateURL https://update.greasyfork.org/scripts/30528/YouTube%20Channel%20Whitelister.meta.js
// ==/UserScript==


function setChannelName(elem) {
    // use regex to get the channel name or user ID from the element data (thanks @Google for the __data__ :D)
    var channelID = elem.__data__.data.owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.canonicalBaseUrl;
    channelID = channelID.match(/\/(?:user|channel)\/(.*)/);

    if(channelID !== null) {
        // check that the channel ID hasn't been added to the URL already
        if(location.href.search('&user=') == -1) {
            // if not, add it now
            history.pushState({}, null, `${location.href}&user=${channelID[1]}`);
            window.location.reload();
        }
    }
}

// add an observer to the page that will wait for dynamic page updates in order to properly work when a video is being loaded by JS
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes !== null) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var elem = mutation.addedNodes[i];
                if(elem !== undefined && elem.tagName !== undefined) {
                    var elemTag = elem.tagName.toLowerCase();
                    if(elemTag == 'ytd-video-secondary-info-renderer') {
                        setChannelName(elem);
                    }
                }
            }
        }
    });
});

// add the observer to the document body
observer.observe(document.body, {childList: true, subtree: true});