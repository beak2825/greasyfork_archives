// ==UserScript==
// @name         DECIPHER - CollapseFieldReportQuotas
// @version      1.1
// @description  Collapses all the quotas in the field report, quota tab
// @author       Scott Searle
// @match        https://survey-d.researchnow.com/
// @match        https://survey-ca.researchnow.com/
// @match        https://survey-uk.researchnow.com/
// @match        https://survey-au.researchnow.com/
// @include      *dashboard*
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/377551/DECIPHER%20-%20CollapseFieldReportQuotas.user.js
// @updateURL https://update.greasyfork.org/scripts/377551/DECIPHER%20-%20CollapseFieldReportQuotas.meta.js
// ==/UserScript==

(function() {
    'use strict';

var myInitTimer = setInterval(myInitFunction,50);
function myInitFunction()
  {
       if ( document.location.href.indexOf('tab=quota') > -1 )
       {
         jQuery(".quota-sheet-toggle.on").click()
         console.log("All quotas collapsed");   //Tell the annoying user
         clearInterval(myInitTimer);            //Stop the annoying script
       }
  }
})();