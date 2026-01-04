// ==UserScript==
// @name Doodle Ad Block
// @namespace Pana
// @match https://doodle.com/*/vote
// @grant none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.js
// @description Removes ads from Doodle.com polls
// @locale en-US
// @version 0.0.1.20231114191705
// @downloadURL https://update.greasyfork.org/scripts/479887/Doodle%20Ad%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/479887/Doodle%20Ad%20Block.meta.js
// ==/UserScript==

var jQ = jQuery.noConflict();

jQ( document ).ready(function() {
  jQ('.AdsSlot').remove();
  jQ('.SubLayout__placement-left').remove();
  jQ('.SubLayout__placement-top').remove();
  jQ('.SubLayout__placement-right').remove();
  jQ('.SubLayout__placement-bottom').remove();

  setInterval(function(){
    jQ('.AdsSlot').remove();
    jQ('.SubLayout__placement-left').remove();
    jQ('.SubLayout__placement-top').remove();
    jQ('.SubLayout__placement-right').remove();
    jQ('.SubLayout__placement-bottom').remove();
  }, 500);

});