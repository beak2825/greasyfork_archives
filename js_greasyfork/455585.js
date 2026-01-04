// ==UserScript==
// @name         Disable window.open
// @namespace    https://greasyfork.org/en/scripts/455585-disable-window-open
// @version      0.1
// @description  Disable window.open function and Disable popup window
// @author       TechComet
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455585/Disable%20windowopen.user.js
// @updateURL https://update.greasyfork.org/scripts/455585/Disable%20windowopen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.open = function() {};

})();