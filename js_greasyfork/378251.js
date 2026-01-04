// ==UserScript==
// @name         Trello - hide annoying card badges
// @description  Hide card badges for watching, comments and description. {Modified "Trello Improved" script by Skilling to only hide badges}
// @author       kms
// @version      0.1.2
// @match        https://trello.com/*
// @grant        none
// @namespace https://greasyfork.org/users/2465
// @downloadURL https://update.greasyfork.org/scripts/378251/Trello%20-%20hide%20annoying%20card%20badges.user.js
// @updateURL https://update.greasyfork.org/scripts/378251/Trello%20-%20hide%20annoying%20card%20badges.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(`
    <style>
      * {
        -webkit-font-smoothing: antialiased;
      }
      .badges .badge[title="You are watching this card."],
      .badges .badge[title="You are subscribed to this card."],
      .badges .badge[title="This card has a description."],
      .badges .badge[title="Comments"],
      .badges .badge[title="Attachments"],
      .badges .badge[title="Trello attachments"],
      .badges .badge .icon-sm {
        display: none;
      }
      .canonical-card > div > a > div:nth-child(3),
      .canonical-card > div > a > div:nth-child(4) {
        display: none;
      }
    </style>
  `).appendTo('head');

  var tweakCardBadge = function(badge) {
    var value = badge.innerHTML.split(': ');

    if (value[1]) {
      badge.innerHTML = value[1];
    }
  };

  setInterval(function() {
    document.querySelectorAll('.custom-field-front-badges .badge .badge-text').forEach(tweakCardBadge);
  }, 500);
})();