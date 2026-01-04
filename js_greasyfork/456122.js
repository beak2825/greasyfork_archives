// ==UserScript==
// @name         去filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  colorful web page
// @author       redfish
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=segmentfault.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456122/%E5%8E%BBfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/456122/%E5%8E%BBfilter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let html = document.querySelector('html')
    html.style.setProperty("filter", "none", 'important')

    // Your code here...
})();