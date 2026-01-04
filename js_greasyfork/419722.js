// ==UserScript==
// @name Return WATCHED badge on Youtube (with custom text)
// @namespace q1k
// @version 1.3.0
// @description Bring back the WATCHED overlay to the videos you have already watched on youtube.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/419722/Return%20WATCHED%20badge%20on%20Youtube%20%28with%20custom%20text%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419722/Return%20WATCHED%20badge%20on%20Youtube%20%28with%20custom%20text%29.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  
/*
Bring back the WATCHED badge to the videos you have already watched on youtube.
In a recent update youtube removed the watched tag, and added a red progression bar on the bottom that doesn't function properly.
With this style you will get the WATCHED tag back.
*/
  #progress.ytd-thumbnail-overlay-resume-playback-renderer,
  .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
    height: 3px !important;
    bottom: 0px !important;
    position: absolute !important;
    background: red;
  }
  #overlays > *, .ytThumbnailBottomOverlayViewModelBadgeContainer { z-index: 13; }
  #hover-overlays ytd-thumbnail-overlay-toggle-button-renderer {
    z-index: 13;
  }
  .ytThumbnailBottomOverlayViewModelHost {
    position:absolute; top: 0; bottom: 0; left: 0; right: 0;
  }
  
/*[[watched_badge_style]]*/
  
  /* return the progressbar background */
  .resume-playback-background::after,
  ytd-thumbnail-overlay-resume-playback-renderer::after,
  .ytThumbnailOverlayProgressBarHostWatchedProgressBar::after {
    background: rgba(255, 255, 255, 0.5);
    content: "";
    position: absolute;
    display: block;
    right: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    z-index: 12;
  }
  
  /*[[remove_red_bar]]*/
  
  /* */
  .watched-badge,
  .ytd-thumbnail-overlay-playback-status-renderer {
    display: none !important;
  }
  .watched .video-thumb, .watch-sidebar-body .yt-uix-simple-thumb-wrap.watched > img {
    opacity: 1 !important;
  }
  
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
