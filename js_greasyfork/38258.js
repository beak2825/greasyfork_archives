// ==UserScript==
// @name         YouTube uBlock Whitelist
// @namespace    https://github.com/gorhill/uBlock
// @version      1.7
// @description  To whitelist YouTube channels in uBlock Origin
// @author       Raymond Hill (gorhill)
// @match        https://*.youtube.com/*
// @grant        none
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL  https://github.com/gorhill/uBlock/issues
// @downloadURL https://update.greasyfork.org/scripts/38258/YouTube%20uBlock%20Whitelist.user.js
// @updateURL https://update.greasyfork.org/scripts/38258/YouTube%20uBlock%20Whitelist.meta.js
// ==/UserScript==

// fork of https://greasyfork.org/en/scripts/22308-youtube-whitelist-channels-in-ublock-origin
// based on https://greasyfork.org/en/scripts/13226-youtube-whitelist-channels-in-ublock-origin
// with adaption from https://greasyfork.org/en/forum/discussion/8985

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
    var link = document.querySelector('[id="owner-name"] a[href^="/user/"]');
    if ( link === null ) {
        link = document.querySelector('[id="owner-name"] a[href^="/channel/"]');
        if ( link === null)
            return;
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


(function() {
    'use strict';

    var observer = new MutationObserver(mutationHandler);
    observer.observe(document.body, { childList: true, subtree: true });
})();