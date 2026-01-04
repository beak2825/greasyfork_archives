// ==UserScript==
// @name         Youtube Watch Page Fix
// @namespace    lightbeam
// @version      1.0.1
// @description  Removes the recent changes to YouTube's watch page
// @author       lightbeam
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/445015/Youtube%20Watch%20Page%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/445015/Youtube%20Watch%20Page%20Fix.meta.js
// ==/UserScript==

(function() {
ApplyCSS();

function ApplyCSS() {
var styles = document.createElement("style");
styles.innerHTML=`
/* Temporary fixes. THESE WILL NOT WORK THE NEXT TIME YOUTUBE UPDATES ITS CODE. */
ytd-watch-metadata {
  display: none !important;
}
#meta-contents[hidden], #info-contents[hidden] {
  display: block !important;
}


/* Permanent fixes. For when the temporary fixes stop working. */
/* Removes second comment section, */
#comment-teaser.ytd-watch-metadata {
display: none;
}
/* Removes border around creator's name and sub button. NOTE: This part doesn't work anymore, but keeping it for now just in case it starts working again. */
#owner.ytd-watch-metadata {
border: none;
}
/* Removes border around creator's name and sub button. */
ytd-watch-metadata:not([modern-metapanel]) #owner.ytd-watch-metadata {
border: none;
}
/* Reverts the video title font. */
ytd-watch-metadata[smaller-yt-sans-light-title] h1.ytd-watch-metadata {
  font-family: "Roboto",sans-serif;
  font-weight: 400;
  font-size: 18px;
}
ytd-video-primary-info-renderer[use-yt-sans20-light] .title.ytd-video-primary-info-renderer {
  font-family: "Roboto",sans-serif;
  font-weight: 400;
  font-size: 18px;
}
/* Removes the bold letters on upload date and view count. */
.yt-formatted-string[style-target="bold"] {
  font-weight: 400;
}`
document.head.appendChild(styles);
}
})();