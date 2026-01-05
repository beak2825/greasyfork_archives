// ==UserScript==
// @name           New Tab Autofocus Respect
// @description    Forces Firefox to Respect new tabs autofocus.
// @author         Dylan Langston
// @version        1.0
// @run-at         document-start
// @include        about:blank?newtabpage
// @grant          none
// @namespace https://greasyfork.org/users/49926
// @downloadURL https://update.greasyfork.org/scripts/20758/New%20Tab%20Autofocus%20Respect.user.js
// @updateURL https://update.greasyfork.org/scripts/20758/New%20Tab%20Autofocus%20Respect.meta.js
// ==/UserScript==
document.body.innerHTML = '<!DOCTYPE html><html><body><form><input type="1" name="2" value=Please Wait..."" autofocus style="color:transparent;border: 0px solid;"></form><img alt="" id="logo" src="http://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" srcset="http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png 1x, http://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png 2x" style="display: block;margin-left: auto;margin-right: auto;padding-top:159px;" onload="window.lol&amp;&amp;lol()" height="92" width="272"></img></body></html>';
var img = document.getElementById('logo');
img.onerror = function () {
  this.style.display = 'none';
}
window.location.replace('https://www.google.com');