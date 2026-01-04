// ==UserScript==
// @name         Canvas module page media width and height
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Media videos under the modules for Georgia Tech canvas instructure show up in a mobile size even on the desktop. This script changes that.
// @author       You
// @match        https://gatech.instructure.com/courses/*/pages/*modules*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440317/Canvas%20module%20page%20media%20width%20and%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/440317/Canvas%20module%20page%20media%20width%20and%20height.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementsByTagName("iframe").length > 1) {
        document.getElementsByTagName("iframe")[1].width = "100%";
        document.getElementsByTagName("iframe")[2].width = "100%";
    }
    if (document.getElementsByTagName("iframe").length > 2) {
        document.getElementsByTagName("iframe")[1].height = "1000px";
        document.getElementsByTagName("iframe")[2].height = "1000px";
    }
})();