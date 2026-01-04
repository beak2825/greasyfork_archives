// ==UserScript==
// @name         WME Unlimited Map Viewport Size
// @namespace    https://github.com/WazeDev/wme-unlimited-map-viewport-size
// @version      0.0.1
// @description  Allows WME's map viewport size to be unlimited.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/546866/WME%20Unlimited%20Map%20Viewport%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/546866/WME%20Unlimited%20Map%20Viewport%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style");
    style.innerText = `
    #editor-container #WazeMap {
       max-height: none !important;
       max-width: none !important;
       height: 100% !important;
       width: 100% !important
    }`
    document.head.appendChild(style);
})();
