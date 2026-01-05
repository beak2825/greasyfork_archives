// ==UserScript==
// @name        (mTurk) ProductRnR School Appropriate HIT Helper
// @namespace   taylus-mturk-productrnr-school-appropriate
// @description Defaults all images in the ProductRnR "Identify these images as School appropriate" HITs as "OK to show" so that you only have to glance at and change the ones that aren't.
// @grant       none
// @match       https://s3.amazonaws.com/mturk_bulk/hits/*
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/13059/%28mTurk%29%20ProductRnR%20School%20Appropriate%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/13059/%28mTurk%29%20ProductRnR%20School%20Appropriate%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("input[value='AdultImageV2_OkToShow']").prop('checked', true);         
});