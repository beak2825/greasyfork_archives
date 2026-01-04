// ==UserScript==
// @name         YouTube - whitelist channels in uBlock Origin
// @namespace    https://github.com/gorhill/uBlock
// @version      1.77
// @description  To whitelist YouTube channels in uBlock Origin
// @author       Raymond Hill (gorhill)
// @match        https://*.youtube.com/*
// @grant        none
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL  https://github.com/gorhill/uBlock/issues
// @downloadURL https://update.greasyfork.org/scripts/32276/YouTube%20-%20whitelist%20channels%20in%20uBlock%20Origin.user.js
// @updateURL https://update.greasyfork.org/scripts/32276/YouTube%20-%20whitelist%20channels%20in%20uBlock%20Origin.meta.js
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/13226-youtube-whitelist-channels-in-ublock-origin
// with adaption from https://greasyfork.org/en/forum/discussion/8985
// further updates to enable compatibility with "material design" by burretploof

// First page load
//

var exposeUserInURL = function() {
    'use strict';

    // To fix issue with user name, parse it from a different query, so
    // the following method works currently. Variable channelId will thus
    // contain the Youtube user name.
    // Replace lines from "var link = document.querySelector ..." to
    // "var channelId = ..." with the following code (within "// ---"):
    // ---
    if(window.location.href.indexOf("/watch") > -1) {
       var link = document.querySelector('[id="watch7-user-header"] a[href^="/user/"]');
        if ( link === null ) {
            link = document.querySelector('[id="watch7-user-header"] a[href^="/channel/"]');
            if ( link === null)
                //return;
                link = document.querySelector('[id="top-row"] a[href^="/user/"]');
            if ( link === null ) {
                link = document.querySelector('[id="top-row"] a[href^="/channel/"]');
                if ( link === null)
                    return;
            }
        }
    }
    
    var linkHref = link.getAttribute('href');
    var linkmatch = linkHref.match(/\/(user|channel)\/(.+)/);
    if (linkmatch === null)
        return;
    var channelId = linkmatch[2];
    // ---

    // Code below need not be changed
    var newArg = channelId !== '' ? 'user=' + encodeURIComponent(channelId) : '';
    var matches = location.search.match(/(?:[?&])(user=(?:[^&]+|$))/);
    var oldArg = matches !== null ? matches[1] : '';
    if ( newArg === oldArg ) {
        return;
    }
    var href = location.href;
    if ( oldArg === '' ) {
        location.replace(href + (location.search === '' ? '?' : '&') + newArg);
        return;
    }
    location.replace(href.replace(oldArg, newArg));
};

setTimeout(exposeUserInURL, 25);

// DOM modifications

var mutationHandlerTimer = null;

var mutationHandlerAsync = function() {
    'use strict';

    mutationHandlerTimer = null;
    exposeUserInURL();
};

var mutationHandler = function(mutations) {
    'use strict';

    if ( mutationHandlerTimer !== null ) {
        return;
    }

    for ( var i = 0; i < mutations.length; i++ ) {
        if ( mutations[i].addedNodes ) {
            mutationHandlerTimer = setTimeout(mutationHandlerAsync, 25);
            break;
        }
    }
};

var observer = new MutationObserver(mutationHandler);
observer.observe(document.body, { childList: true, subtree: true });