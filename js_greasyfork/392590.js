// ==UserScript==
// @name         Whitelist YouTube channels ads
// @namespace    https://github.com/gorhill/uBlock
// @version      1.10
// @description  Whitelist YouTube channels in uBlock Origin
// @author       Thomas Couchoud (raksrinana)
// @match        https://*.youtube.com/*
// @grant        none
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL   https://github.com/gorhill/uBlock/issues
// @downloadURL https://update.greasyfork.org/scripts/392590/Whitelist%20YouTube%20channels%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/392590/Whitelist%20YouTube%20channels%20ads.meta.js
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/22308-youtube-whitelist-channels-in-ublock-origin

let mutationHandlerTimer = null;

let exposeUserInURL = function() {
    'use strict';

    const reloadPage = true;

    const link = document.querySelector('#upload-info ytd-channel-name yt-formatted-string.ytd-channel-name a.yt-simple-endpoint.yt-formatted-string');
    if ( link === null ) {
        mutationHandlerTimer = null;
        return;
    }
    const linkHref = link.getAttribute('href');
    const linkmatch = linkHref.match(/\/(user\/|channel\/|@)(.+)|/);
    if (linkmatch === null) {
        return;
    }
    const channelId = linkmatch[2];

    const newArg = channelId !== '' ? 'user=' + encodeURIComponent(channelId) : '';
    const matches = location.hash.match(/(?:[#&])(user=(?:[^&]+|$))/);
    const oldArg = matches !== null ? matches[1] : '';
    if ( newArg === oldArg ) {
        return;
    }
    const href = location.href;

    let urlPath = '';
    if ( oldArg === '' ) {
        urlPath = href + (location.hash=== '' ? '?' : '&') + newArg;
    }
    else {
        urlPath = href.replace(oldArg, newArg)
    }
    if(reloadPage) {
        window.location.replace(urlPath);
    }
    else {
        window.history.pushState(null, document.title, urlPath);
    }
};

setTimeout(exposeUserInURL, 25);

// DOM modifications

var mutationHandler = function(mutations) {
    'use strict';

    if ( mutationHandlerTimer !== null ) {
        return;
    }

    for ( var i = 0; i < mutations.length; i++ ) {
        if ( mutations[i].addedNodes ) {
            mutationHandlerTimer = setTimeout(exposeUserInURL, 25);
            break;
        }
    }
};

var observer = new MutationObserver(mutationHandler);
observer.observe(document.body, { childList: true, subtree: true });