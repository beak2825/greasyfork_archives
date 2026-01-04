// ==UserScript==
// @name       Page Limit Punisher
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://www.mturkcontent.com/dynamic/*
// @match      https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/32724/Page%20Limit%20Punisher.user.js
// @updateURL https://update.greasyfork.org/scripts/32724/Page%20Limit%20Punisher.meta.js
// ==/UserScript==

if ($('td:contains("You have exceeded the maximum allowed page request")').length > 0) {
    location.reload();
}