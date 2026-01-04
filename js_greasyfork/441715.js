// ==UserScript==
// @name            External link new taber
// @version         0.2.14
// @description     this code opens external links in new tab (crude solution)
// @author          jerry
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_openInTab

// @match           https://neurojobs.sfn.org/*
// @match           https://www.higheredjobs.com/*
// @match           https://www.alzforum.org/jobs*
// @match           https://www.higheredjobs.com/*
// @match           https://sprweb.org/networking*
// @match           https://careers.cccu.org/jobs/*
// @match           https://jobs.psychologicalscience.org/jobs/*
// @match           https://chroniclevitae.com/job_search*
// @namespace https://greasyfork.org/users/28298
// @downloadURL https://update.greasyfork.org/scripts/441715/External%20link%20new%20taber.user.js
// @updateURL https://update.greasyfork.org/scripts/441715/External%20link%20new%20taber.meta.js
// ==/UserScript==


// @match           http*://*/*
// var links = document.getElementsByClassName('bti-job-detail-link');
var links = document.links;
for (var i = 0; i < links.length; i++){
    links[i].target="_blank";
}
