// ==UserScript==
// @name         Invidious Redirect with always-dash
// @description  Redirect YouTube to Invidious and appends "quality=dash" to URL.
// @version      0.2
// @author       SilentFlick
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://www.youtube.com/watch?v=*
// @match        *://youtube.com/watch?v=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/950251
// @downloadURL https://update.greasyfork.org/scripts/450092/Invidious%20Redirect%20with%20always-dash.user.js
// @updateURL https://update.greasyfork.org/scripts/450092/Invidious%20Redirect%20with%20always-dash.meta.js
// ==/UserScript==

/*
Sources:
  + https://greasyfork.org/en/scripts/406370-invidious-always-dash/code
  + https://greasyfork.org/en/scripts/414414-invidious-redirect/code
*/

var url = new URL(window.location);
const instances = ["https://vid.puffyan.us", "https://yewtu.be", "https://invidious.sethforprivacy.com"];
var redirectURL = new URL(instances[Math.floor(Math.random()*instances.length)]);
var path = url.pathname;
var videoID = url.searchParams.get("v");
var time = url.searchParams.get("t");
var searchStr = url.searchParams.get("search_query");

if(path) {
    redirectURL.pathname = path;
}
if(searchStr) {
  redirectURL.searchParams.set("q", searchStr);
} else if(videoID) {
  redirectURL.searchParams.set("v", videoID);
  if(time) {
    redirectURL.searchParams.set("t", time);
  }
  redirectURL.searchParams.set("quality", "dash");
}
console.log("Redirect to: " + redirectURL.toString());
location.href = redirectURL;
