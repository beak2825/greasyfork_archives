// ==UserScript==
// @name        Youtube like/dislike video and skip ad keyboard shortcuts
// @namespace   youtube
// @include     https://www.youtube.com/*
// @description Adds keyboard shortcuts [ and ] for liking and disliking videos, and s for skipping pre-video and banner ads.
// @version     1.3
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/426882/Youtube%20likedislike%20video%20and%20skip%20ad%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/426882/Youtube%20likedislike%20video%20and%20skip%20ad%20keyboard%20shortcuts.meta.js
// ==/UserScript==

// Based on https://greasyfork.org/en/scripts/34049-youtube-like-dislike-video-and-skip-ad-keyboard-shortcuts/ by nerevar009 which hasn't been updated since 2017
//  changed skipad button class, added support for changing button indexed (happens when videos have dynamic buttons like "sponsor" buttons also buttons added by extensions )

var onvideopage, skipad, skipbannerad, videoinfo, buttons, like, dislike, tag;

function findButtons() {
  if(!/^\/watch/.test(location.pathname)) {
    onvideopage = false;
    return;
  }
  onvideopage = true;

  skipad = document.getElementsByClassName("ytp-ad-skip-button ytp-button");
  if(skipad.length == 1)
    skipad = skipad[0];
  else skipad = null;

  skipbannerad = document.getElementsByClassName("close-padding");
  if(skipbannerad.length == 1)
    skipbannerad = skipbannerad[0];
  else skipbannerad = null;
  
  videoinfo = document.getElementsByTagName("ytd-video-primary-info-renderer");
  if(videoinfo.length == 1) {
    buttons = videoinfo[0].getElementsByTagName("button");
      
      for(let i = 0;i < buttons.length; i++) {
          if (buttons[i].className == "style-scope yt-icon-button") {
              var str = buttons[i].parentNode.label;
              if (str.match(/^dislike this video/gi)) {
                  dislike = buttons[i];
              }
              else if (str.match(/^like this video/gi)) {
                  like = buttons[i];
              }
          }
      }
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