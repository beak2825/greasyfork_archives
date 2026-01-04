// ==UserScript==
// @name        loop video files
// @namespace   hvideolooper
// @author      h
// @description enables looping when you've opened a video file
// @include     *.webm
// @include     *.mp4
// @run-at      document-start
// @version     0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35702/loop%20video%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/35702/loop%20video%20files.meta.js
// ==/UserScript==

document.getElementsByTagName("video")[0].setAttribute("loop", "true");