// ==UserScript==
// @name         Musicbrainz : SC link
// @namespace    mb-sc-link
// @version      0.4
// @description  Bingo.
// @author       Kazaam
// @match        https://musicbrainz.org/release/*
// @match        https://musicbrainz.org/release-group/*
// @match        https://musicbrainz.org/recording/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/24566/Musicbrainz%20%3A%20SC%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/24566/Musicbrainz%20%3A%20SC%20link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var path = window.location.href.split("/");
  var mbzid;

  switch(path[3]) {
    case 'release':
      var json = JSON.parse($('script[type="application/ld+json"]').html());
      mbzid = json['releaseOf']['@id'].split('/')[4];
    break;
    case 'release-group':
    case 'recording':
      mbzid = path[4];
    break;
  }

  if (!mbzid) {
    console.error("MBZ ID was not found.");
    return;
  }

  $('.release-information, .release-group-information, .recording-information').before(`
    <h2>SensCritique</h2>
    <ul class="links">
      <li>
        <img src="https://www.senscritique.com/app-icons/android-chrome-192x192.png" style="height:16px;width:16px;vertical-align:middle;margin-right:6px;">
        <a href="http://admin.senscritique.com/queries/view/254/${mbzid}" target="_blank">Check in SC database</a>
      </li>
    </ul>`);

})();