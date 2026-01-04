// ==UserScript==
// @name        HubSpot Linkify
// @namespace   Violentmonkey Scripts
// @match       https://app.hubspot.com/*
// @grant       none
// @version     4.0
// @author      koverholt
// @description Generate Direct Links to HubSpot Engagements
// @license     MIT
// @require http://code.jquery.com/jquery-latest.js
/* jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/431891/HubSpot%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/431891/HubSpot%20Linkify.meta.js
// ==/UserScript==

setInterval(function() {

  $(".align-center.justify-between").find("[data-selenium-test|=timeline-type]").each(function() {
    var timeline_id = $(this).attr("data-selenium-test");
    var engagement_id = timeline_id.replace(/\D+/g, "");
    var engagement_url = $(location).attr("href").concat("?engagement=", engagement_id);
    classId = "HubSpotLinks-" + engagement_id
    $("." + classId).remove();
    var templateString = `<div class="` + classId + `"><a href="` + engagement_url + `" style="color:#0066ff;" target="_blank">PermaLink</a>&nbsp;</div>`;
    $(this).closest("[role=presentation]").append(templateString);
  });


}, 1000);
