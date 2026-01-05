// ==UserScript==
// @name         PowerBi Refresh Dataset
// @namespace    http://tampermonkey.net/
// @version      1.0.0.38
// @description  Refresh the dataset every 3 minutes
// @author       Tuval
// @match        https://app.powerbi.com/featureddashboard
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/23994/PowerBi%20Refresh%20Dataset.user.js
// @updateURL https://update.greasyfork.org/scripts/23994/PowerBi%20Refresh%20Dataset.meta.js
// ==/UserScript==

(function ()  {
    'use strict';
   setInterval(function() {
      confirm("yolo");
    },3 * 1000);
    
    

})();