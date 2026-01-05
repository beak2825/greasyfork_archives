// ==UserScript==
// @name       Github Contribution Activity Removal
// @version    1.0
// @description  Removes the Github Contribution activity statistics for those who may not wish to see it. This is useful for people who may feel down for not contributing anything to a codebase for some time.
// @match      https://*github.com/*
// @copyright  2015+, AJ
// @namespace https://greasyfork.org/users/10111
// @downloadURL https://update.greasyfork.org/scripts/11501/Github%20Contribution%20Activity%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/11501/Github%20Contribution%20Activity%20Removal.meta.js
// ==/UserScript==



$('.contributions-tab > .boxed-group.flush').remove();
$('.contributions-tab > .activity-listing').remove();