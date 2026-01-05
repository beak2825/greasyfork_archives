// ==UserScript==
// @name        TeleSpam
// @namespace   de.rasmusantons
// @description Spam Tele
// @include     https://www.cubecraft.net/members/telegamer.45478/
// @version     2
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/30211/TeleSpam.user.js
// @updateURL https://update.greasyfork.org/scripts/30211/TeleSpam.meta.js
// ==/UserScript==

var time = 60;
function postSpam() {
  var spamno = GM_getValue("spamno", 5685);
  GM_setValue("spamno", spamno - 1);
  $('textarea[placeholder="Write something..."]').get(0).value = ("Spam " + spamno);
  $('.button[value=Post]').get(0).click();
  setTimeout(function() {
    window.location.href = 'https://www.cubecraft.net/members/telegamer.45478/';
    setTimeout(postSpam, 60000);
    time = 60;
    setTimeout(function() {console.log("next spam in " + (time--) + " seconds");}, 60000 - (i * 1000));
  }, 1000);
}
setTimeout(postSpam, 60000);
for (var i = 60; i > 0; i--)
  setTimeout(function() {console.log("next spam in " + (time--) + " seconds");}, 60000 - (i * 1000));