// ==UserScript==
// @name         YouTube Shorts Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect to regular videos
// @author       Zach Kosove
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/497770/YouTube%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/497770/YouTube%20Shorts%20Redirect.meta.js
// ==/UserScript==

const redirect = () => {
  if (location.pathname.startsWith('/shorts/')) {
    location.replace(location.href.replace('/shorts/', '/watch?v='));
  }
};

redirect();
document.addEventListener('yt-navigate-start', redirect);
