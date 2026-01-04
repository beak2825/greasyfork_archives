// ==UserScript==
// @name           Kleinanzeigen Content Cleaner
// @name:de        Kleinanzeigen Content Cleaner
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Removes unneeded content from kleinanzeigen.de
// @description:de Removes unneeded content from kleinanzeigen.de
// @author         inkihh
// @match          *://*.kleinanzeigen.de/*
// @license        AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/489724/Kleinanzeigen%20Content%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/489724/Kleinanzeigen%20Content%20Cleaner.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const unwantedDivClassParts = ["liberty-filled"];
    const unwantenDivIDs = ["site-footer", "srchrslt-shngls"];
    const interval = 500;

    function removeAds()
    {
        const divs = document.getElementsByTagName('div');

        var i;
        for (i = 0; i < divs.length; i++)
        {
            const div = divs[i];

            unwantedDivClassParts.forEach((unwantedDivClassPart) => {

                if (div.className.includes(unwantedDivClassPart)) {
                    div.parentElement.removeChild(div);
                }

            });

        }

        unwantenDivIDs.forEach((unwantenDivID) => {

            const unwantenDiv = document.getElementById(unwantenDivID);
            unwantenDiv.parentElement.removeChild(unwantenDiv);
        });
    }

    removeAds();
    setInterval(removeAds, interval);

})();