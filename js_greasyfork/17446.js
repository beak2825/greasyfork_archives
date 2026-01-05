// ==UserScript==
// @name        KAADIVVVV - vvvvid.it Anti-Adblock Killer
// @namespace   https://github.com/Robotex/
// @description Mantieni il tuo Ad-Blocker attivo mentre ti guardi il tuo anime preferito
// @author      Robotex
// @version     1.7.8
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright   2016+, Robotex (https://github.com/Robotex/)
// @homepage    https://github.com/Robotex/kaadivvvv/
// @supportURL  https://github.com/Robotex/kaadivvvv/issues
// @match       *://www.vvvvid.it/*
// @exclude     *://www.vvvvid.it/adblock.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17446/KAADIVVVV%20-%20vvvvidit%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/17446/KAADIVVVV%20-%20vvvvidit%20Anti-Adblock%20Killer.meta.js
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
  this.play1Ads = false;
  if (typeof exportFunction === 'function') {
    window.eval('window.vvvvid.imaPlayer.off(\'mediaError\')');
  } else {
    window.vvvvid.imaPlayer.off('mediaError');
  }
}

if (typeof exportFunction === 'function') {
  exportFunction(checkAdv, window.wrappedJSObject.vvvvid.models.PlayerObj.prototype, {defineAs: 'checkAdv'});
  window.eval('Object.defineProperty(window, \'sdhdfygfjk\', { value: window.vvvvid.models.PlayerObj.prototype.checkAdv, writable: false })');
  window.eval('window[qnejh7HJ] = window.vvvvid.models.PlayerObj.prototype.checkAdv');
  window.eval('window.vvvvid.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY');
  window.eval('$(document).keydown(' + keyboardShortcuts + ')');
} else {
  window.vvvvid.models.PlayerObj.prototype.checkAdv = checkAdv;
  Object.defineProperty(window, 'sdhdfygfjk', { value: window.vvvvid.models.PlayerObj.prototype.checkAdv, writable: false });
  window[qnejh7HJ] = window.vvvvid.models.PlayerObj.prototype.checkAdv;
  window.vvvvid.lastPlayedPreCommunityTime = Number.POSITIVE_INFINITY;
  $(document).keydown(keyboardShortcuts);
}
window.sessionStorage.vvvvid.logoPlayed = '1';

/**
* A colui che sta analizzando questo script per commessa, se posso darti del tu, ti ringrazio per le sfide che avanzi.
* Anche se la programmazione web non e il mio forte, chissa che magari un giorno ci troveremo seduti intorno ad un tavolo
* a parlare di algoritmi e bere in compagnia :) E se sei una lei, tanto di cappello!
*/
