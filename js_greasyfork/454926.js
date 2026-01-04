// ==UserScript==
// @name         Invidious Redirect channel to playlist
// @description  Redirect YouTube to Invidious and appends "quality=dash" to URL.
// @version      0.1
// @author       SilentFlick
// @match        *://yewtu.be/channel/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/950251
// @downloadURL https://update.greasyfork.org/scripts/454926/Invidious%20Redirect%20channel%20to%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/454926/Invidious%20Redirect%20channel%20to%20playlist.meta.js
// ==/UserScript==

var url = new URL(window.location);
var channelID = url.pathname.split('/')[2];

if(channelID) {
  url.pathname = "/playlist";
  url.searchParams.set("list", channelID);
  console.log("Redirect to: " + url.toString());
  location.href = url;
}