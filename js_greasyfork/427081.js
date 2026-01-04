// ==UserScript==
// @name         Firewall Links
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds firewall links to the building overview tab
// @author       Wes R
// @match        http*://*.pardus.at/overview_buildings.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/427081/Firewall%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/427081/Firewall%20Links.meta.js
// ==/UserScript==


(function() {
   var buildingExpression = /building_message/;
   for(var count = 0; count <= document.getElementsByTagName("a").length; ++count){
       if(buildingExpression.exec(document.getElementsByTagName("a")[count])){
           document.getElementsByTagName('a')[count].insertAdjacentHTML('afterend', '<br><a href="' + document.getElementsByTagName('a')[count].href.replace('building_message', 'building_firewall_settings') + '"><font size="1">Building firewall</font></a>');
       }
   }
})();