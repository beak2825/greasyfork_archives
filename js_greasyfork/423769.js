// ==UserScript==
// @name         Instagram to greatfon Instagram Viewer link replacer
// @namespace    http://instagram.com/
// @version      0.2
// @description  Replace all instagram profile links with greatfon instagram viewer, allowing viewing of Instagram links without an account
// @author       nascent
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423769/Instagram%20to%20greatfon%20Instagram%20Viewer%20link%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/423769/Instagram%20to%20greatfon%20Instagram%20Viewer%20link%20replacer.meta.js
// ==/UserScript==

/*Changelog
 
* 0.1 Initial Release
* 0.2 regex fix
*/

(function() {
    'use strict';
    var anchors = document.getElementsByTagName("a");

    for (var i = 0; i < anchors.length; i++) {
        var link = anchors[i].href
        var newlink = link.replace(/instagram.com\//g, "greatfon.com/v/");
        anchors[i].href = newlink;
    }
})();