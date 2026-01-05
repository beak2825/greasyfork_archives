// ==UserScript==
// @name        NO PicCLips on 20min
// @description Removes PicClip Articles from 20min.ch
// @namespace   ch.monkee
// @include     http://www.20min.ch/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js?0.1
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27826/NO%20PicCLips%20on%2020min.user.js
// @updateURL https://update.greasyfork.org/scripts/27826/NO%20PicCLips%20on%2020min.meta.js
// ==/UserScript==


$( document ).ready(function() {
  $(".box div.teaser_title h3 a:contains('PicClip')").closest(".box").hide();
});