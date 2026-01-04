// ==UserScript==
// @name       ei sono il tuo salvatore 
// @namespace   https://github.com/chamu6_/
// @description Mantieni il tuo Ad-Blocker attivo mentre ti guardi il tuo anime preferito
// @author      chamu6_
// @version     1.7.5
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright   2016+, chamu6_ (https://github.com/chamu6_/)
// @match       *://www.vvvvid.it/*
// @exclude     *://www.vvvvid.it/adblock.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423973/ei%20sono%20il%20tuo%20salvatore.user.js
// @updateURL https://update.greasyfork.org/scripts/423973/ei%20sono%20il%20tuo%20salvatore.meta.js
// ==/UserScript==

'use strict';

function keyboardShortcuts(e) {
  if ((e.keyCode == 13 || e.keyCode == 32) && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setPlayPause();
  if (e.keyCode == 39 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setPlayhead('+5');
  if (e.keyCode == 37 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setPlayhead('-5');
  if (e.keyCode == 38 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setVolume('+0.05');
  if (e.keyCode == 40 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setVolume('-0.05');
  if (e.keyCode == 160 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setFrame('+1');
  if (e.keyCode == 222 && $('#player-video-info').hasClass('inactive'))
    window.vvvvid.player.setFrame('-1');
}

function checkAdv () {
  this.play9Ads = false;
  if (typeof exportFunction === 'function') {
    window.eval('window.vvvvid.imaPlayer.off(\'mediaError\')');
  } else {
    window.vvvvid.imaPlayer.off('mediaError');
  }
}

if (typeof exportFunction === 'function') {
  exportFunction(checkAdv, window.wrappedJSObject.vvvvid.models.PlayerObj.prototype, {defineAs: 'checkAdv'});
  window.eval('Object.defineProperty(window, \'jheboadjh\', { value: window.vvvvid.models.PlayerObj.prototype.checkAdv, writable: false })');
  window.eval('window[qnejh7HJ] = window.vvvvid.models.PlayerObj.prototype.checkAdv');
  window.eval('window.vvvvid.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY');
  window.eval('$(document).keydown(' + keyboardShortcuts + ')');
} else {
  window.vvvvid.models.PlayerObj.prototype.checkAdv = checkAdv;
  Object.defineProperty(window, 'jheboadjh', { value: window.vvvvid.models.PlayerObj.prototype.checkAdv, writable: false });
  window[qnejh7HJ] = window.vvvvid.models.PlayerObj.prototype.checkAdv;
  window.vvvvid.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY;
  $(document).keydown(keyboardShortcuts);
}
window.sessionStorage.vvvvid.logoPlayed = '1';

/**
* ciao?
*/