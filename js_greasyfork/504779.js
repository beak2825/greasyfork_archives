// ==UserScript==
// @name         WaniKani - Script loading fix
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically reload page when WaniKani updates it to force reloading of scripts.
// @author       Angelodmage
// @match        https://www.wanikani.com
// @match        https://www.wanikani.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504779/WaniKani%20-%20Script%20loading%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/504779/WaniKani%20-%20Script%20loading%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(run);
    observer.observe (document.body, {
        subtree: false,
        childList: true,
    });

    function run(mutations)
    {
        for (let mutation of mutations)
        {
            for (let node of mutation.removedNodes)
            {
                if (node.id == 'turbo-body')
                {
                    let url = new URL(window.location.href);
                    url.searchParams.set ('forceReload', Date.now().toString());
                    window.history.replaceState (null, null, url.toString());

                    url.searchParams.delete ('forceReload');
                    window.location.href = url.toString ();
                    return;
                }
            }
        }
    }
})();
