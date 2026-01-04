// ==UserScript==
// @name         Youtube Show Channel Name In Title
// @icon         https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @namespace    https://github.com/tkhquang
// @version      1.501
// @description  Show channel's name (username) in title page
// @author       Quang Trinh
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/368421-youtube-show-channel-name-in-title
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/368421/Youtube%20Show%20Channel%20Name%20In%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/368421/Youtube%20Show%20Channel%20Name%20In%20Title.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let channelName;
  function setTitle() {
    const ownerName = document.getElementById("owner-container") || document.querySelector("#upload-info #container #text-container #text a");
    if (!(/^\/watch?/).test(window.location.pathname)) {
      return;
    }
    if (!ownerName || !ownerName.innerText.trim().length) {
      return;
    }
    channelName = ownerName.innerText.trim();
    if (document.title.startsWith(channelName + " | ")) {
      return;
    }
    document.title = channelName + " | " + document.title;
  }
  const observer = new MutationObserver(setTitle);
  document.addEventListener("yt-navigate-finish", function () {
    if (/^\/watch?/.test(window.location.pathname)) {
      observer.observe(document.getElementsByTagName("title")[0], {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
      });
    } else {
      observer.disconnect();
      if (document.title.startsWith(channelName + " | ")) {
        document.title = document.title.replace(channelName + " | ", "");
      }
    }
  }, false);
}());
