// ==UserScript==
// @name         Youtube/Twitch to streamlink
// @namespace    fke9fgjew89gjwe89
// @version      1.2
// @description  Add button to youtube and twitch player to watch the video/stream in streamlink
// @author       https://greasyfork.org/en/users/432346-fke9fgjew89gjwe89
// @match        https://*.youtube.com/*
// @match        https://*.twitch.tv/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416791/YoutubeTwitch%20to%20streamlink.user.js
// @updateURL https://update.greasyfork.org/scripts/416791/YoutubeTwitch%20to%20streamlink.meta.js
// ==/UserScript==
(function () {
  'use strict';

  if (location.href.includes("youtube.com/watch")) {
    var button_list = document.getElementsByClassName('ytp-right-controls')[0];
    var directdl = '<a href="streamlink://' + window.location + '" class="ytp-play-button ytp-button" aria-label="Play in streamlink" title="Play in streamlink"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-42"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-42"></path></svg></a>';
    button_list.insertAdjacentHTML('afterbegin', directdl);
  }

  if (location.host.includes("twitch.tv")) {
    window.onload = function () {
      var button_list_tw = document.getElementsByClassName('player-controls__right-control-group')[0];
      var directdltw = '<div class="tw-inline-flex tw-relative tw-tooltip-wrapper"><a href="streamlink://' + window.location + '" class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" aria-label="Play in streamlink"><span class="tw-button-icon__icon"><div style="width: 2rem; height: 2rem;"><div class="tw-icon"><div class="tw-aspect"></div><svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" style="fill: currentcolor"><g><path d="M5 17.066V2.934a.5.5 0 01.777-.416L17 10 5.777 17.482A.5.5 0 015 17.066z"></path></g></svg></div></div></span></a><div class="tw-tooltip tw-tooltip--align-right tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip">Play in streamlink</div></div>';
      button_list_tw.insertAdjacentHTML('beforeend', directdltw);
    }
  }
}());