// ==UserScript==
// @name         derStandard DSGVO ismawurscht
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world (and read derStandard without the annoying popup)!
// @author       You
// @match        *://*.derstandard.at/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422680/derStandard%20DSGVO%20ismawurscht.user.js
// @updateURL https://update.greasyfork.org/scripts/422680/derStandard%20DSGVO%20ismawurscht.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "DSGVO_ZUSAGE_V1=true;domain=.derstandard.at;path=/";
    if (location.href.includes("/consent/tcf/")) {
        location.replace(location.href.replace("/consent/tcf/", "/"));
    }

})();