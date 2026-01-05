// ==UserScript==
// @name         Get lost gif emojis!
// @namespace    https://xd.cm/
// @version      0.0.2
// @description  Remove gif emojis from slack
// @author       Alex Nordlund
// @match        https://*.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24287/Get%20lost%20gif%20emojis%21.user.js
// @updateURL https://update.greasyfork.org/scripts/24287/Get%20lost%20gif%20emojis%21.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function($) {
  // On page load
  $("#msgs_div").find(".emoji").filter(
    function() { return $(this).css('background-image').endsWith('.gif")')}
  ).css('display', 'none');

  // When new post is added
  $("#msgs_div").on('DOMSubtreeModified propertychange', function() {
    $("#msgs_div").find(".emoji").filter(
      function() { return $(this).css('background-image').endsWith('.gif")')}
    ).css('display', 'none');
  });

});