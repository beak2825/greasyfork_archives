// ==UserScript==
// @name     iSAMS Reports Wizard Previous Commends Expand
// @match    *https://isams.abingdon.org.uk/modules/schoolreports/sets/report*
// @grant    none
// @description make isams previous comments height larger
// @version 0.0.1.20190208150128
// @namespace https://greasyfork.org/users/222245
// @downloadURL https://update.greasyfork.org/scripts/377544/iSAMS%20Reports%20Wizard%20Previous%20Commends%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/377544/iSAMS%20Reports%20Wizard%20Previous%20Commends%20Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("imgPreviousComments").click();
    document.getElementById("tblPreviousComments").style.height = "250px";
})();