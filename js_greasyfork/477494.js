// ==UserScript==
// @name         YouTube2Piped
// @namespace    YouTube
// @version      1.4.2
// @description  Redirect YouTube to chosen Piped instance
// @author       SinTan
// @match        *://*.youtube.com/*
// @match        *://youtu.be/*
// @icon         https://raw.githubusercontent.com/TeamPiped/Piped/32e7ddaaff22f4a6c0d7f6359400323da7fefd69/public/img/icons/logo.svg
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/477494/YouTube2Piped.user.js
// @updateURL https://update.greasyfork.org/scripts/477494/YouTube2Piped.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Do not execute inside embedded players
  if (window.location !== window.parent.location) {
    exit;;
  }

  // Use #no-piped as an escape term
  if (location.href.endsWith('#no-piped')) {
    exit;
  }

  // Edit instance url here to go to any instance of choice
  const instance = "https://piped.video";

  const url = new URL(window.location.href.replace('/shorts/','/watch?v=').replace('?si=','&si='));
  let url_new = null;

  let id = url.searchParams.get('v');
  let ts = url.searchParams.get('t');
  let listId = url.searchParams.get('list');


  if (id) {
    url_new = instance + '/watch?v=' + id;
    if (ts) {
      url_new += '&t=' + ts;
    }
    if (listId) {
      url_new += '&list=' + listId;
    }
  }

  if (!(url_new)) {
    if (listId) {
      url_new = instance + '/playlist?list=' + listId;
    }
  }

  if (!(url_new)) {
    let pattern = /https:\/\/www\.youtube\.com\/((?:(?:channel\/)|\@)[A-Za-z0-9\_\-]+).*/;
    let channelAddr = pattern.exec(url)[1];

    if (channelAddr) {
      url_new = instance + '/' + channelAddr;
    }
  }

  if (url_new) {
    window.location.replace(url_new);
  }
}
)();
