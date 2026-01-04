// ==UserScript==
// @name         Open in Steam
// @namespace    https://github.com/RedCommander735
// @version      0.1
// @description  Open Steam links in desktop client
// @author       RedCommander735
// @match        *.steampowered.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/451907/Open%20in%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/451907/Open%20in%20Steam.meta.js
// ==/UserScript==




(function() {
    'use strict';

    window.location.replace(`steam://openurl/${window.location.href}`);
    history.go(-1);
})();