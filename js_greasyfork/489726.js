// ==UserScript==
// @name           Reddit Content Cleaner
// @name:de        Reddit Content Cleaner
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Removes unneeded content from reddit.com
// @description:de Removes unneeded content from reddit.com
// @author         inkihh
// @match          *://*.reddit.com/*
// @license        AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/489726/Reddit%20Content%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/489726/Reddit%20Content%20Cleaner.meta.js
// ==/UserScript==

(function()
 {

    'use strict';

    const scriptName = "reddit-content-cleaner"
    const debug = false;

    const unwantedDivClassParts = [];
    const unwantenDivIDs = [];
    const unwantedElements = ["shreddit-ad-post"];

    const interval = 500;

    function logg(...args)
    {
        if (!debug) return
        console.log('[' + scriptName + ']', ...args)
    }

    function removeAds()
    {
        logg("start");

        const divs = document.getElementsByTagName('div');

        var i;
        for (i = 0; i < divs.length; i++)
        {
            const div = divs[i];

            Array.from(unwantedDivClassParts).forEach((unwantedDivClassPart) => {

                if (div.className.includes(unwantedDivClassPart)) {
                    div.parentElement.removeChild(div);
                }

            });

        }

        unwantenDivIDs.forEach((unwantenDivID) => {

            const unwantenDiv = document.getElementById(unwantenDivID);
            unwantenDiv.parentElement.removeChild(unwantenDiv);
        });

        unwantedElements.forEach((unwantedElement) => {

            logg(unwantedElement);

            var elements = document.getElementsByTagName(unwantedElement);

            logg(elements);

            Array.from(elements).forEach((element) => {

                element.parentElement.removeChild(element);

            });
        });

    }

    removeAds();
    setInterval(removeAds, 500);

})();