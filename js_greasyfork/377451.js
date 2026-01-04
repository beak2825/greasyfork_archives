// ==UserScript==
// @name            VVVVIDepc - Enhanced Player Controls for vvvvid.it
// @name:it         VVVVIDepc - Migliora il player video di vvvvid.it
// @namespace       https://github.com/vuolter/VVVVIDepc
// @match           *://www.vvvvid.it/*
// @version         2.0.2
// @author          Walter Purcaro
// @copyright       2019, Walter Purcaro (https://vuolter.com)
// @description     Add hotkeys support and drastically improve playback UI
// @description:it  Aggiunge diversi tasti di scelta rapida e migliora l'aspetto dell'interfaccia utente
// @license         ISC
// @homepageURL     https://github.com/vuolter/VVVVIDepc
// @supportURL      https://github.com/vuolter/VVVVIDepc/issues
// @run-at          document-idle
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/377451/VVVVIDepc%20-%20Enhanced%20Player%20Controls%20for%20vvvvidit.user.js
// @updateURL https://update.greasyfork.org/scripts/377451/VVVVIDepc%20-%20Enhanced%20Player%20Controls%20for%20vvvvidit.meta.js
// ==/UserScript==

'use strict';


// *** SETTINGS SECTION START ***

// hotkeys (application, system and function keys are not supported)
var PAUSE_KEY = "Space";
var REW_KEY = "ArrowLeft";
var FF_KEY = "ArrowRight";
var VOLUP_KEY = "ArrowUp";
var VOLDOWN_KEY = "ArrowDown";
// var SHARE_KEY = "s";  // NOTE: disabled because breaks texting
var WATCHLATER_KEY = "a";
var PREV_KEY = "b";
var NEXT_KEY = "n";
var MUTE_KEY = "m";
var RATE_KEY = "Enter";
var PLAYLIST_KEY = "p";
var FULLSCREEN_KEY = "f";
var TITLE_KEY = "t";

var SHOW_TITLE = true;  // shows video title within player controls
var SHOW_ACTIONS = false;  // shows video actions within player controls

var VOLUME_INCREMENT = 0.1;  // range 0-1, decimals

var MIN_POSITION_INCREMENT = 10;  // in seconds
var MAX_POSITION_INCREMENT = 120;  // in seconds
var POSITION_INCREMENT_MULTIPLIER = 1.03;  // range 1+

// *** SETTINGS SECTION END ***


var _uiMod = false;
var _timedDelay = 2000;
var _timedId;
var _posInc;

function _changeUI(visibility, height) {
  $('.player-info-container-opaque').css("visibility", visibility);
  $('.menu-bottom-opaque').css("visibility", visibility);
  $('.playerControls-opaque').css("height", height);
  $('#channelsContainer').css("visibility", visibility);
  $('.pull-right').css("visibility", visibility);
}

function _displayElement(element, visible) {
  if (visible)
    $(element).addClass("active").removeClass("inactive");
  else
    $(element).addClass("inactive").removeClass("active");
}

function _displayTitle(visible) {
  _displayElement('#player-video-info', visible);
}

function _displayNavbar(visible) {
  _displayElement('.navbar-bottom', visible);
}

function _displayActions(visible) {
  _displayElement('#player-video-actions', visible);
}

// NOTE: not working, depends just on _displayNavbar :(
function _displayPlayerControls(visible) {
  _displayElement('#playerControls', visible);
}

function _displayUI(showTitle, showPlayer, showActions) {
  _displayTitle(showTitle);
  _displayPlayerControls(showPlayer);
  _displayActions(showActions);
  _displayNavbar(showPlayer || showActions);
}


function customizeUI() {
  var pco_height = $('.playerControls-opaque').css("height");
  var mbo_height = $('.menu-bottom-opaque').css("height");
  var height = parseFloat(pco_height) + parseFloat(mbo_height);
  _changeUI("hidden", height);
  _uiMod = true;
}

function restoreUI() {
  _changeUI("visible", "");
  _uiMod = false;
}

function showUI(showTitle, showPlayer, showActions) {
  if (!_uiMod)
    customizeUI();

  if (showPlayer) {
    showTitle = SHOW_TITLE;
    showActions = SHOW_ACTIONS;
  }

  _displayUI(showTitle, showPlayer, showActions);
}

function hideUI() {
  _displayUI(false, false, false);
}

function getPosInc() {
  _posInc = Math.min(MAX_POSITION_INCREMENT, _posInc * POSITION_INCREMENT_MULTIPLIER);
  return _posInc;
}

function resetPosInc() {
  _posInc = MIN_POSITION_INCREMENT;
  return _posInc;
}


function restoreUIHandler(event) {
  clearTimeout(_timedId);
  if (_uiMod)
    restoreUI();
}

function hideUIHandler(event) {
  _timedId = setTimeout(hideUI, _timedDelay);
}

function hotkeyHandler(event) {
  // console.log("Keydown key: " + event.key);
  // console.log("Keydown repeat: " + event.repeat);

  // skip if application or system key
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
    return;

  // skip if function key
  if (event.key.match(/F\d{1,2}/))
    return;

  var key = event.key == " " ? "Space" : event.key;  // convert " " to "Space"
  var longPress = event.repeat;

  var showTitle = false;
  var showPlayer = false;
  var showActions = false;

  var p = window.vvvvid.playerObj;

  switch (key) {

    case PAUSE_KEY:
      if (!longPress) {
        p.player.setPlayPause();
        showPlayer = true;
      }
      break;

    case TITLE_KEY:
      if (!longPress)
        showTitle = true;
      break;

    case PREV_KEY:
      if (!longPress)
        p.movePrev();
      break;

    case NEXT_KEY:
      if (!longPress)
        p.moveNext();
      break;

    case MUTE_KEY:
      if (!longPress) {
        $(p.player.getVolume() ? ".ppmute" : ".ppunmute").trigger("click");
        showPlayer = true;
      }
      break;

    case RATE_KEY:
      if (!longPress) {
        $(".player-action-rate-image").trigger("click");
        showActions = true;
      }
      break;

    case WATCHLATER_KEY:
      if (!longPress) {
        $(".player-action-addwtl-image").trigger("click");
        showActions = true;
      }
      break;

    // case SHARE_KEY:
      // if (!longPress) {
        // $(".player-action-share-image").trigger("click");
        // showActions = true;
      // }
      // break;

    case PLAYLIST_KEY:
      if (!longPress) {
        $(".playlist-btn").trigger("click");
        showPlayer = true;
      }
      break;

    case FULLSCREEN_KEY:
      if (!longPress)
        p.player.setFullscreen();
      break;

    case REW_KEY:
      var pos = p.player.getPosition();
      var inc = longPress ? getPosInc() : resetPosInc();
      p.player.setSeek(pos - inc);
      showPlayer = true;
      break;

    case FF_KEY:
      var pos = p.player.getPosition();
      var inc = longPress ? getPosInc() : resetPosInc();
      p.player.setSeek(pos + inc);
      showPlayer = true;
      break;

    case VOLUP_KEY:
      var vol = Math.min(100, p.player.getVolume() + VOLUME_INCREMENT);
      p.player.setVolume(vol);
      showPlayer = true;
      break;

    case VOLDOWN_KEY:
      var vol = Math.max(0.001, p.player.getVolume() - VOLUME_INCREMENT);  // NOTE: if volume is set to 0 ui shows wrong value
      p.player.setVolume(vol);
      if (vol == 0.001)
        $(".ppmute").trigger("click");
      showPlayer = true;
      break;

    default:
      showPlayer = true;
  }

  if (!longPress) {
    clearTimeout(_timedId);
    showUI(showTitle, showPlayer, showActions);
  }
}

document.addEventListener('mousemove', restoreUIHandler);
document.addEventListener('keyup', hideUIHandler);
document.addEventListener('keydown', hotkeyHandler);
