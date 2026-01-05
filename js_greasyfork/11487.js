// ==UserScript==
// @name         Twitch.tv chat only on right side
// @version      0.1
// @description  Useful if you are watching stream in a mediaplayer. Works on twitch.tv/your_channel/chat.
// @author       nyaa11
// @match        http://www.twitch.tv/*/chat*
// @grant        none
// @namespace https://greasyfork.org/users/6507
// @downloadURL https://update.greasyfork.org/scripts/11487/Twitchtv%20chat%20only%20on%20right%20side.user.js
// @updateURL https://update.greasyfork.org/scripts/11487/Twitchtv%20chat%20only%20on%20right%20side.meta.js
// ==/UserScript==


  var el = document.querySelector('.ember-chat');
  el.style.width = '340px';
  el.style.float = 'right';
