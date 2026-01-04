// ==UserScript==
// @name        Mail.com skip the logout notification
// @description Skips the notification 'remember to log out the next time'
// @namespace   mail_com_skip_logout_notice
// @include     https://navigator-lxa.mail.com/remindlogout*
// @version     0.2
// @grant       none
// @icon        https://www.mail.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/372324/Mailcom%20skip%20the%20logout%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/372324/Mailcom%20skip%20the%20logout%20notification.meta.js
// ==/UserScript==

var valid_class = new RegExp('^button cta large$');
var page_links = document.getElementsByTagName('button');

for(let x in page_links){
  var cur_link = page_links[x];
  var link_class = cur_link.className;

  if(valid_class.test(link_class)){
    // the button has javascript, so we have to lure the onclick() to fire
    cur_link.click();
  }
}
