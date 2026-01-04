// ==UserScript==
// @name         Settings of Last.fm nowplaying on Discord
// @namespace    http://1mu.info/
// @version      0
// @author       ayaya_bun2maru
// @match        https://discordapp.com/*
// @include      https://discordapp.com/*
// @grant        none
// @description  none
// @downloadURL https://update.greasyfork.org/scripts/372272/Settings%20of%20Lastfm%20nowplaying%20on%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/372272/Settings%20of%20Lastfm%20nowplaying%20on%20Discord.meta.js
// ==/UserScript==
/*
  Last.fm API Terms of Service
  https://www.last.fm/api/tos

  Install lastfmnowplayingondiscord together
*/
window.SettingsOfNowplayingOnDiscord = {
  //Set your API key of Last.fm
  API_KEY : '24d8dab3bb07aa34d5da6e49802eacaa',

  //Set your ID of Last.fm
  USER_ID : 'ayaya_bun2maru',

  //See 4.4 of https://www.last.fm/api/tos
  CHECK_INTERVAL : 15 * 1000,
  DURATION_TIME : (3 * 60 + 30) * 1000,

  //If Enforce DURATION_TIME, set 1.
  ENFORCE_DURATION_TIME : 0,

  //Available : artist,title,album
  FORMAT : 'title - artist',

  //Status type : 0 is "Playing foobar". 2 is "Listening to foobar".
  STATUS_TYPE : 0,

  //If you want to disable POLLING_TIMEOUT, set Infinity. Default value is 10mins.
  POLLING_TIMEOUT : 10 * 60 * 1000
};

