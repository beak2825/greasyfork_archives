// ==UserScript==
// @name         Get lost giphy!
// @namespace    http://ergonlogic.com/
// @version      0.0.2
// @description  Remove giphy from slack
// @author       Christopher Gervais
// @match        https://*.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17869/Get%20lost%20giphy%21.user.js
// @updateURL https://update.greasyfork.org/scripts/17869/Get%20lost%20giphy%21.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function($) {
  // On page load
  $("*[data-real-src*='giphy']").css('display', 'none');

  // When new post is added
  $("#msgs_div").on('DOMSubtreeModified propertychange', function() {
    $("*[data-real-src*='giphy']").css('display', 'none');
  })

})