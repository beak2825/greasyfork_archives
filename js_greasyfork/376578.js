// ==UserScript==
// @name         DECIPHER - AlwaysGoToFavourites
// @namespace    https://greasyfork.org/en/scripts/376578-decipher-alwaysgotofavourites
// @version      1.1
// @description  Defaults to the Favourites list on the portal.
// @include      https://survey-*.researchnow.com/apps/*
// @exclude      *:edit
// @exclude      *:xmledit
// @exclude      /selfserve/
// @author       Scott
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376578/DECIPHER%20-%20AlwaysGoToFavourites.user.js
// @updateURL https://update.greasyfork.org/scripts/376578/DECIPHER%20-%20AlwaysGoToFavourites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery; //Need for Tampermonkey or it raises warnings.

    var stringURL = $(location).attr('href')
    console.log(stringURL)

    if((stringURL == "https://survey-d.researchnow.com/apps/portal/#/projects/list") || (stringURL == "https://survey-d.researchnow.com/apps/portal#/projects/list")) {       //-D
        console.log("Survey-d");
        window.location.replace("https://survey-d.researchnow.com/apps/portal/#/results?q=my:favorite");
    }

    if((stringURL == "https://survey-ca.researchnow.com/apps/portal/#/projects/list") || (stringURL == "https://survey-ca.researchnow.com/apps/portal#/projects/list")) {       //-CA
        console.log("Survey-ca");
        window.location.replace("https://survey-ca.researchnow.com/apps/portal/#/results?q=my:favorite");
    }

    if((stringURL == "https://survey-uk.researchnow.com/apps/portal/#/projects/list") || (stringURL == "https://survey-uk.researchnow.com/apps/portal#/projects/list")) {       //-UK
        console.log("Survey-uk");
        window.location.replace("https://survey-uk.researchnow.com/apps/portal/#/results?q=my:favorite");
    }

    if((stringURL == "https://survey-au.researchnow.com/apps/portal/#/projects/list") || (stringURL == "https://survey-au.researchnow.com/apps/portal#/projects/list")) {       //-AU
        console.log("Survey-au");
        window.location.replace("https://survey-au.researchnow.com/apps/portal/#/results?q=my:favorite");
    }
})();