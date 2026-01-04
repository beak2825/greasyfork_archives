// ==UserScript==
// @name        Mail.com faster link click
// @namespace   mail_com_faster_link_click
// @description Clicking on a link in email will stupidly make you wait. This script skips the "you will be redirected to a webpage in 3 seconds" -screen
// @include     https://deref-mail.com/mail/client/*
// @version     0.2
// @icon        https://www.mail.com/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/372326/Mailcom%20faster%20link%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/372326/Mailcom%20faster%20link%20click.meta.js
// ==/UserScript==

var page_links = document.getElementsByTagName('a');
var x;

for(x in page_links){
  if(page_links[x].className == "text-link"){
    document.location = page_links[x].href;
  }
}
