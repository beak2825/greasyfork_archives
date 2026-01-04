// ==UserScript==
// @name          YT pause video on comment
// @description   Youtube video is paused if you have opened the url with link to comment
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.0
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/492683/YT%20pause%20video%20on%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/492683/YT%20pause%20video%20on%20comment.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var urlAtLastCheck = "";
  var divVideo0 = null;
  var divVideo1 = null;
  var waitVideo;

  //Check URL changes
  const rootCallback = function (mutationsList, observer) {
    if (urlAtLastCheck != document.location.href) {
      urlAtLastCheck = document.location.href;
      clearInterval(waitVideo);
      if (urlAtLastCheck.search("/watch?") > 0 && urlAtLastCheck.search("&lc=") > 0) {
        pauseVideo();
      }
    }
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true, attributes: true, characterData: false});
  }

  function pauseVideo() {
    waitVideo = setInterval(function() {
      var vCount0 = 0;
      var vCount1 = 0;
      var i;

      divVideo0 = document.querySelectorAll("div.playing-mode video:not([paused-by-script])");
      if (divVideo0 != null) {
        for (i = 0; i < divVideo0.length; i++) {
          divVideo0[i].pause();
          divVideo0[i].setAttribute("paused-by-script", "i1");
          vCount0++;
        }
      }

      divVideo1 = document.querySelectorAll("div.playing-mode video[paused-by-script='i1']");
      if (divVideo1 != null) {
        for (i = 0; i < divVideo1.length; i++) {
          divVideo1[i].pause();
          vCount1++;
        }
      }

      if (vCount0 == 0 && vCount1 > 0) clearInterval(waitVideo);

    }, 100);
  }

})();
