// ==UserScript==
// @name         jsoneditoronline AD remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       gonex45
// @match        https://jsoneditoronline.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393325/jsoneditoronline%20AD%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/393325/jsoneditoronline%20AD%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("#ad").remove();
})();