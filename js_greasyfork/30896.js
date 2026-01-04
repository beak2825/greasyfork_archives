// ==UserScript==
// @name         Google Play Music Autoplay
// @namespace    https://play.google.com/music
// @version      0.1
// @description  Provides autoplay options via url parameters on song or playlist URLs
// @author       https://gist.github.com/baisong/fdf8df8ebd7e4852a2b8d5cacb373418
// @require       http://code.jquery.com/jquery-1.11.3.min.js
// @include       http://play.google.com/music/listen*
// @include       https://play.google.com/music/listen*
// @include       http://music.google.com/music/listen*
// @include       https://music.google.com/music/listen*
// @match         http://play.google.com/music/listen*
// @match         https://play.google.com/music/listen*
// @match         http://music.google.com/music/listen*
// @match         https://music.google.com/music/listen*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30896/Google%20Play%20Music%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/30896/Google%20Play%20Music%20Autoplay.meta.js
// ==/UserScript==
/**
 * Usage:
 * On a single song URL (generate by selecting "Share" on a song), add ?autoplay=true
 *
 * On a playlist URL, add ?autoplay=true&index={X}, where {X} is the offset of the
 * song you wish to play on the playlist.
 */
console.log('Running Google Play Music Autoplay');
console.log('View source:');
console.log('https://gist.github.com/baisong/fdf8df8ebd7e4852a2b8d5cacb373418');
/**
 * Fetch a URL parameter by name if it exists, otherwise return null.
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
/**
 * Scroll and wait, then scroll again recursively until item is reached.
 *
 * Emulates a while loop with successive conditional setTimeout() calls
 */
function scroll($, index) {
  var selector = ".song-row[data-index='" + index + "'] button";
  var enough = false;
  console.log('Checking for selector "' + selector + '"...');
  var foundItem = $(selector).length;
  console.log(foundItem);
  if (foundItem) {
    enough = true;
    console.log('[*] Clicking item in playlist.');
    $(selector).click();
  }
  var nextScroll = ($('#mainContainer').scrollTop() + $('#mainPanel').height());
  var remainingScroll = $('#mainContainer').prop('scrollHeight');
  console.log('Checking for room to scroll... Is (' + nextScroll + ' < ' + remainingScroll + ')');
  var stillRoomToScroll = nextScroll < remainingScroll;
  console.log(stillRoomToScroll);
  if (!enough && stillRoomToScroll) {
    console.log('Scrolling...');
    $('#mainContainer').scrollTop(nextScroll);
    setTimeout(function() {
      scroll($, index);
    }, 500);
  }
  console.log('Scroll complete');
}
/**
 * Helper function to only execute a callback after an element exists.
 */
function initAfter(selector, callback) {
  var enough = false;
  if (($(selector) !== null) && $(selector).length) {
    console.log('Initializing.');
    enough = true;
    callback(selector);
  }
  if (!enough) {
    setTimeout(function() {
      console.log('Waiting...');
      initAfter(selector, callback);
    }, 500);
  }
}
/**
 * Only clicks on the selected song after it exists on the page.
 */
function clickAfter(selector) {
  console.log('Found selected row');
  $(selector).click();
}
/**
 * Only checks for URL parameters after song table exists on the page.
 */
function googleAutoPlay() {
  if (getParameterByName('autoplay') == 'true') {
    console.log('Found autoplay param');
    initAfter('.selected-song-row button', clickAfter);
    if ((getParameterByName('index') !== null) && getParameterByName('index').length) {
      console.log('Found index param');
      var index = parseInt(getParameterByName('index')) - 1;
      scroll($, index);
    }
  }
}
$(document).ready(function() {
  console.log('Document ready');
  initAfter('.song-table', googleAutoPlay);
});
