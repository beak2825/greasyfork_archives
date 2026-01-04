// ==UserScript==
// @name        STM - streamingcommunity.live -Adblock Killer
// @description adblock per stm che elimina pubblicità godendo del film o serie
// @version     0.10
// @namespace   https://github.com/drakesgg
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match       *://www.streamingcommunity.boston/*
// @exclude     *://www.streamingcommunity.boston/adblock.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/498755/STM%20-%20streamingcommunitylive%20-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/498755/STM%20-%20streamingcommunitylive%20-Adblock%20Killer.meta.js
// ==/UserScript==

'use strict';

function keyboardShortcuts(e) {
  if ((e.keyCode == 13 || e.keyCode == 32) && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setPlayPause();
  if (e.keyCode == 39 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setPlayhead('+5');
  if (e.keyCode == 37 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setPlayhead('-5');
  if (e.keyCode == 38 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setVolume('+0.05');
  if (e.keyCode == 40 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setVolume('-0.05');
  if (e.keyCode == 160 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setFrame('+1');
  if (e.keyCode == 222 && $('#player-video-info').hasClass('inactive'))
    window.stremingcommunity.player.setFrame('-1');
}

function checkAdv () {
  this.play1Ads = false;
  if (typeof exportFunction === 'function') {
    window.eval('window.stremingcommunity.imaPlayer.off(\'mediaError\')');
  } else {
    window.stremingcommunity.imaPlayer.off('mediaError');
  }
}

if (typeof exportFunction === 'function') {
  exportFunction(checkAdv, window.wrappedJSObject.stremingcommunity.models.PlayerObj.prototype, {defineAs: 'checkAdv'});
  window.eval('Object.defineProperty(window, \'jhenobdjh\', { value: window.stremingcommunity.models.PlayerObj.prototype.checkAdv, writable: false })');
  window.eval('window[qnejh7HJ] = window.streamingcommunity.models.PlayerObj.prototype.checkAdv');
  window.eval('window.stremingcommunity.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY');
  window.eval('$(document).keydown(' + keyboardShortcuts + ')');
} else {
  window.stremingcommunity.models.PlayerObj.prototype.checkAdv = checkAdv;
  Object.defineProperty(window, 'jhenobdjh', { value: window.stremingcommunity.models.PlayerObj.prototype.checkAdv, writable: false });
  window[qnejh7HJ] = window.stremingcommunity.models.PlayerObj.prototype.checkAdv;
  window.stremingcommunity.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY;
  $(document).keydown(keyboardShortcuts);
}
window.sessionStorage.stremingcommunity.logoPlayed = '1';