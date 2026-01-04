// ==UserScript==
// @name        image view fit-height furaffinity.net
// @namespace   Violentmonkey Scripts
// @match       https://www.furaffinity.net/view*
// @grant       none
// @version     1.2.0
// @author      justrunmyscripts
// @license     MIT
// @description make the submission image fit the height of the screen
// @downloadURL https://update.greasyfork.org/scripts/494519/image%20view%20fit-height%20furaffinitynet.user.js
// @updateURL https://update.greasyfork.org/scripts/494519/image%20view%20fit-height%20furaffinitynet.meta.js
// ==/UserScript==
const element = document.querySelector('#submissionImg');
element.setAttribute('style', `
  max-height: calc(100vh - 110px);
`);

// NOTE: while this _does_ technically remove an ad
// which shouldn't be the responsibility of this script
// (get an ad blocker instead)
// this one ad still takes up a lot of vertial
// viewport space, pushing the main submission down...
const ad_el = document.querySelector('.leaderboardAd');
ad_el.remove();

// try to preserve system message, but move it to unused part of page header
// that way we free up even more vertial space.
let system_message_element = document.querySelector('.news-block');
let system_message = system_message_element.innerText;
system_message_element.remove();
let message_bar_desktop_element = document.querySelector('#ddmenu .message-bar-desktop');
message_bar_desktop_element.innerText = system_message;
message_bar_desktop_element.setAttribute('style', 'user-select: text;');

let header_element = document.querySelector('#header.has-adminmessage');
header_element.removeClassName('has-adminmessage');

