// ==UserScript==
// @name           YouTube Redirect Shorts
// @namespace      https://github.com/sapondanaisriwan/youtube-anti-shorts
// @match          https://www.youtube.com/*
// @grant          none
// @version        1.0.2
// @author         sapondanaisriwan
// @description    Redirects youtube shorts to the normal player
// @license        MIT
// @run-at         document-start
// @icon           https://i.imgur.com/I9uDrsq.png
// @homepageURL https://github.com/sapondanaisriwan/youtube-anti-shorts
// @supportURL  https://github.com/sapondanaisriwan/youtube-anti-shorts/issues
// @downloadURL https://update.greasyfork.org/scripts/465491/YouTube%20Redirect%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/465491/YouTube%20Redirect%20Shorts.meta.js
// ==/UserScript==
 
/*
If you want to submit a bug or request a feature please report via github issue. Since I receive so many emails, I can't reply to them all.
Contact: sapondanaisriwan@gmail.com
Support me: https://ko-fi.com/sapondanaisriwan 
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
*/
 
"use strict";
 
function redirectToWatchPage() {
  const { origin, pathname } = location;
  const isShorts = pathname.startsWith("/shorts/");
  const newURL = `${origin}${pathname.replace("shorts", "watch")}`;
  isShorts && location.replace(newURL);
}
 
function run() {
  redirectToWatchPage();
  document.addEventListener("yt-navigate-start", redirectToWatchPage);
}
 
run();