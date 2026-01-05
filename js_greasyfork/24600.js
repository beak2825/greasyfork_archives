// ==UserScript==
// @name        Doulou Dalu
// @namespace   jessrobe@gmail.com
// @description Brings in iframe into div
// @include     https://bluesilvertranslations.wordpress.com/*
// @version     0.3
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24600/Doulou%20Dalu.user.js
// @updateURL https://update.greasyfork.org/scripts/24600/Doulou%20Dalu.meta.js
// ==/UserScript==

(function () {
  'use strict';
  $('.entry-content').prepend('<div id="iframe-content"></div>');
  var frame = $('.entry-content > iframe:first');
  var frameUrl = frame[0].src;
  //console.log(frameUrl);
  $.get(frameUrl, function (data) {
    $('#iframe-content').html(data);
    //console.log("data");
    //console.log(data);
  });
  $('.entry-content > iframe:first').delay(500).remove();
}) ();
