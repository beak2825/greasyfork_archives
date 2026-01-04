// ==UserScript==
// @name         forced mobile display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Forces mobile display on dotv site
// @author       infinity
// @match        https://play.dragonsofthevoid.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475069/forced%20mobile%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/475069/forced%20mobile%20display.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
parent.innerWidth=1
parent.innerHeight=1
})();