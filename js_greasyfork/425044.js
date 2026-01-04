// ==UserScript==
// @name         JIRA Auto Hide Epic Tasks that are Completed
// @version      0.1
// @description  Auto Hide Epic Tasks that are Completed in JIRA in the Epic View
// @author       Dustin.DeBres@colliercountyfl.gov
// @match        https://ccpsd.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @namespace https://greasyfork.org/users/694988
// @downloadURL https://update.greasyfork.org/scripts/425044/JIRA%20Auto%20Hide%20Epic%20Tasks%20that%20are%20Completed.user.js
// @updateURL https://update.greasyfork.org/scripts/425044/JIRA%20Auto%20Hide%20Epic%20Tasks%20that%20are%20Completed.meta.js
// ==/UserScript==
waitForKeyElements ("h2:contains('Issues in this epic')", actionFunction);

function actionFunction (jNode) {
    console.log("Ready!");
    $('[aria-label="Issue actions"]').trigger('click');
    $("#hideDone").trigger('click');
    $('[aria-label="Issue actions"]').trigger('click');
};