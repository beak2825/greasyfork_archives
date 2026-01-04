// ==UserScript==
// @name        Invidious Dislike Counter
// @match       *://*/watch?v=*
// @connect     ryd-proxy.kavin.rocks
// @grant       none
// @version     1.0.0
// @author      NoUser
// @description Displays the dislike count on Invidious videos using a privacy preserving proxy to the Return YouTube Dislike API.
// @run-at      document-end
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @namespace   https://greasyfork.org/en/scripts/461909-invidious-dislike-counter
// @homepage    https://greasyfork.org/en/scripts/461909-invidious-dislike-counter
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461909/Invidious%20Dislike%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/461909/Invidious%20Dislike%20Counter.meta.js
// ==/UserScript==

// This script is based on
// https://codeberg.org/sun/userscripts/src/branch/main/user/ReturnInvidiousDislike.user.js

// Instead of using the official Return YouTube Dislike API it uses a privacy
// preserving proxy which can be found here: https://github.com/TeamPiped/RYD-Proxy

(function () {
  "use strict";

  const video = new URLSearchParams(window.location.search).get("v");
  const likes = document.getElementById("likes")?.childNodes[1];
  const dislikes = document.getElementById("dislikes")?.childNodes[1];

  if (video) {
    GM.xmlHttpRequest({
      url: "https://ryd-proxy.kavin.rocks/votes/" + video,
      onload: (response) => {
        const data = JSON.parse(response.responseText);
        if (dislikes) {
          dislikes.textContent = " " + data.dislikes.toLocaleString();
        } else {
          const clone = likes.parentElement.cloneNode(true);
          const icon = clone.getElementsByClassName("icon")[0];
          const text = clone.childNodes[1];

          icon.classList.replace("ion-ios-thumbs-up", "ion-ios-thumbs-down");
          text.textContent = " " + data.dislikes.toLocaleString();
          likes.parentElement.insertAdjacentElement("afterend", clone);
        }
      },
    });
  }
})();