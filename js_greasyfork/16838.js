// ==UserScript==
// @name        Twitch HTML5 player
// @namespace   Revolution
// @description:en Replaces Twitch's flash player by a HTML5 one
// @include     http://*.twitch.tv/*
// @exclude     http://api.twitch.tv/*
// @exclude     http://tmi.twitch.tv/*
// @exclude     http://chatdepot.twitch.tv/*
// @require     https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @version     1
// @grant       none
// @description Replaces Twitch's flash player by a HTML5 one
// @downloadURL https://update.greasyfork.org/scripts/16838/Twitch%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/16838/Twitch%20HTML5%20player.meta.js
// ==/UserScript==

waitForKeyElements('.js-player', function () {
  $('.js-player').html($('<iframe>').attr('src', 'http://player.twitch.tv/?branding=false&showInfo=false&html5&'
  + (window.location.pathname.indexOf('/v/') > 0
    ? 'video=v' + window.location.pathname.split('/') [3] 
    : 'channel=' + window.location.pathname.substr(1)))
    .attr('width', '100%').attr('height', '100%').css('border', 0)
  );
});