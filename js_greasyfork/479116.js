// ==UserScript==
// @name          Udvash Embed
// @namespace     raiyansarker
// @version       1.0
// @description   Get rid of the annoying embed and open the actual page in a new tab
// @author        raiyansarker
// @match         *://online.udvash-unmesh.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/479116/Udvash%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/479116/Udvash%20Embed.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", () => {
    const url = `https://youtube.com/watch?v=${youtubeVideoId}`;
    GM_setClipboard(url, "text");
    alert("Link copied to clipboard");
  });
})();
