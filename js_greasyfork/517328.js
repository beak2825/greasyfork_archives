// ==UserScript==
// @name             DblClick to Fullscreen Video on X (formerly Twitter)
// @match            https://x.com/*
// @grant             none
// @version         1.1
// @author          look997
// @description Allows toggling fullscreen mode in the video player on X (formerly Twitter) by double-clicking the video.
// @namespace https://greasyfork.org/users/4353
// @downloadURL https://update.greasyfork.org/scripts/517328/DblClick%20to%20Fullscreen%20Video%20on%20X%20%28formerly%20Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517328/DblClick%20to%20Fullscreen%20Video%20on%20X%20%28formerly%20Twitter%29.meta.js
// ==/UserScript==

document.addEventListener("dblclick", e=>{
  //console.log(e.target.closest('[data-testid="videoPlayer"]').firstElementChild);
  //console.log(e.target.closest('[data-testid="videoPlayer"]').querySelector("video"));
 //console.log(e.target.closest('[data-testid="videoComponent"]'), e.target, e);

  if (!e.target.closest('[data-testid="videoPlayer"]')) { return; }

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    e.target.closest('[data-testid="videoPlayer"]').firstElementChild.requestFullscreen();
  }
})