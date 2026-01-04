// ==UserScript==
// @name        Youtube like/dislike video and skip ad keyboard shortcuts (fork from nerevar009)
// @namespace   nerevar009
// @include     https://www.youtube.com/*
// @description Adds keyboard shortcuts [ and ] for liking and disliking videos, and s for skipping pre-video and banner ads.
// @version     1.1
// @grant       none
// @author nerevar009
// @downloadURL https://update.greasyfork.org/scripts/413965/Youtube%20likedislike%20video%20and%20skip%20ad%20keyboard%20shortcuts%20%28fork%20from%20nerevar009%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413965/Youtube%20likedislike%20video%20and%20skip%20ad%20keyboard%20shortcuts%20%28fork%20from%20nerevar009%29.meta.js
// ==/UserScript==

var onvideopage, skipad, skipbannerad, videoinfo, buttons, like, dislike, tag;

function findButtons() {
  if(!/^\/watch/.test(location.pathname)) {
    onvideopage = false;
    return;
  }
  onvideopage = true;

  skipad = document.getElementsByClassName("videoAdUiSkipButton");
  if(skipad.length == 1) {
    skipad = skipad[0];
  }
  else skipad = null;

  skipbannerad = document.getElementsByClassName("close-padding");
  if(skipbannerad.length == 1) {
    skipbannerad = skipbannerad[0];
  }
  else skipbannerad = null;

  videoinfo = document.getElementsByTagName("ytd-video-primary-info-renderer");
  if(videoinfo.length == 1) {
    buttons = videoinfo[0].getElementsByTagName("button");
    like = buttons[0];
    dislike = buttons[1];
  }
  else {
    like = null;
    dislike = null;
  }
}

findButtons();
var observer = new MutationObserver(findButtons);
observer.observe(document.documentElement, {childList: true, subtree: true});

// add keybindings
addEventListener("keypress", function(e) {
  if(!onvideopage)
    return;

  if(e.target.getAttribute("contenteditable") == "true")
    return;

  tag = e.target.tagName.toLowerCase();
  if(tag == "input" || tag == "textarea")
    return;

  if(e.code == "BracketLeft" && like)
    like.click();
  else if(e.code == "BracketRight" && dislike)
    dislike.click();
  else if(e.code == "KeyS") {
    if(skipad)
      skipad.click();
    else if(skipbannerad)
      skipbannerad.click();
  }
});