// ==UserScript==
// @name        YouTube Shorts To Normal video
// @namespace   lii
// @description Redirects to normal YT
// @include     https://www.youtube.com/shorts/
// @version     1
// @author      BaneSRB
// @match       https://www.youtube.com/shorts/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/442196/YouTube%20Shorts%20To%20Normal%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/442196/YouTube%20Shorts%20To%20Normal%20video.meta.js
// ==/UserScript==

window.location.href = window.location.href.replace("shorts/","watch?v=")
