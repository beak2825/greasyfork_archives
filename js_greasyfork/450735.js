// ==UserScript==
// @name        YouTube - put upload date and views in title heading (in description)
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      -
// @description If you're zoomed in above 100%, YouTube hides the upload date and amount of views. Fuck YouTube. 9/4/2022, 10:03:31 AM
// @downloadURL https://update.greasyfork.org/scripts/450735/YouTube%20-%20put%20upload%20date%20and%20views%20in%20title%20heading%20%28in%20description%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450735/YouTube%20-%20put%20upload%20date%20and%20views%20in%20title%20heading%20%28in%20description%29.meta.js
// ==/UserScript==

siId = setInterval(function () {
  const dateElement = document.querySelector("div#info-strings yt-formatted-string.ytd-video-primary-info-renderer");
  const viewsElement = document.querySelector("span.view-count");
  var titleElement = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer yt-formatted-string.style-scope.ytd-video-primary-info-renderer");
  if((dateElement !== null) && (viewsElement !== null) && (titleElement !== null)) {
    date = dateElement.innerText.trim();
    views = viewsElement.innerText.trim();
    title = titleElement.innerText.trim();
    if( (date != "") && (views != "") && (title != "")) {
      const newTitle = title + " - " + date + " - " + views;
      titleElement.innerText = newTitle;
      clearInterval(siId);
    }
  }
}, 500)