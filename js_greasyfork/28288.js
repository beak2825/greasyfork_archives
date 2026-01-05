// ==UserScript==
// @name        Enable Matterhorn Downloads for TU Vienna
// @description Enable Matterhorn downloads for TU Vienna.
// @namespace   https://mh-engage.ltcc.tuwien.ac.at
// @include     https://mh-engage.ltcc.tuwien.ac.at/engage/ui/watch.html?id=*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28288/Enable%20Matterhorn%20Downloads%20for%20TU%20Vienna.user.js
// @updateURL https://update.greasyfork.org/scripts/28288/Enable%20Matterhorn%20Downloads%20for%20TU%20Vienna.meta.js
// ==/UserScript==

// Matterhorn Engage supports downloading of streams but it's disabled in the front end.

// Opencast.download.showLinks() fills #oc_client_downloads with download links during
// page load. The function, however, checks if a certain attribute is set and if yes it
// doesn't show certain links. We disable that check so that it always evaluates to true.
var showLinks = Opencast.download.showLinks.toString();
showLinks = showLinks.replace("media[i][\"tags\"][\"tag\"].indexOf('engage')", '-1');
Opencast.download.showLinks = eval('(' + showLinks + ')');

// Fix the icon of the download button.
$("<style> \
  #oc_player-head-right #oc_download-button { \
    background-position: -180px -125px; \
  } \
  #oc_player-head-right #oc_download-button:hover, #oc_player-head-right #oc_download-button:focus { \
    background-position: -180px -155px; \
  } \
</style>").appendTo("head");

// Save the state of the download button so we can restore it once it has been removed.
var download_button = null;
$(function () {
  download_button = $('#oc_download-button');
});

// #oc_download-button is detached() from an asynchronous AJAX call.
// So we've to readd it once all AJAX calls have been finished.
$(document).ajaxStop(function () {
  if ($('#oc_download-button').parent().html() === null) {
    $('#oc_player-head-right').append(download_button);
  }
});