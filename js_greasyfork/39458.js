// ==UserScript==
// @name         YouTube Non Material
// @namespace    http://ajayinkingston.com
// @version      1.0
// @description  Remove the new polymer theme
// @author       Ajay Ramachandran
// @match        https://*.youtube.com/*
// @grant        none
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL   http://ajayinkingston.com
// @downloadURL https://update.greasyfork.org/scripts/39458/YouTube%20Non%20Material.user.js
// @updateURL https://update.greasyfork.org/scripts/39458/YouTube%20Non%20Material.meta.js
// ==/UserScript==

var exposeUserInURL = function() {
    'use strict';
 
    var link = document.querySelector('[id^="watch"][id$="-container"] [itemprop="channelId"][content]');
    if ( link === null ) {
       return;
    }
    var channelId = '1';
    var newArg = channelId !== '' ? 'disable_polymer=' + encodeURIComponent(channelId) : '';
    var matches = location.search.match(/(?:[?&])(disable_polymer=(?:[^&]+|$))/);
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