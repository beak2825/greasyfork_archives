// ==UserScript==
// @name         WME-test-API
// @namespace    https://greasyfork.org/en/scripts/
// @version      2023-08-09
// @description  copies 
// @author       ramblinwreck_81
// @match     https://www.waze.com/en-US/editor*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js


// @downloadURL https://update.greasyfork.org/scripts/472796/WME-test-API.user.js
// @updateURL https://update.greasyfork.org/scripts/472796/WME-test-API.meta.js
// ==/UserScript==

/*global W, $, WazeWrap */

(function() {
    'use strict';

    // Your code here...
    function apiBootStrap(){
        console.log ('running bootstrap')
        var wmeState=W.userscripts.state.isReady;
        console.log(wmeState);
    }
})();