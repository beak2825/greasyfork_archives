// ==UserScript==
// @name         Youtube -- publicationDate + Channel Name In Title
// @icon         https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @namespace    https://github.com/tkhquang
// @version      1.501
// @description  Show channel's name (username) in title page + Channel Name In Title
// @author       bonnebulle
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/368421-youtube-show-channel-name-in-title_fork_add_date
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545029/Youtube%20--%20publicationDate%20%2B%20Channel%20Name%20In%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/545029/Youtube%20--%20publicationDate%20%2B%20Channel%20Name%20In%20Title.meta.js
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
    const sanitizedChannelName = channelName.replace(/ /g, "_");

    // Récupérer la date de publication
    const dateMeta = document.querySelector('meta[itemprop="datePublished"]');
    let publicationDate = "";
    if (dateMeta && dateMeta.content) {
      const date = new Date(dateMeta.content);
      publicationDate = " | " + date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }

    const prefixToCheck = "@" + sanitizedChannelName + " | ";
    if (document.title.startsWith(prefixToCheck)) {
      return;
    }
    const cleanedTitle = document.title.replace(/\(\d+\)\s*/g, "").trim();
    document.title = "@" + sanitizedChannelName + " | " + cleanedTitle + publicationDate;
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
      if (channelName) {
        const sanitizedChannelName = channelName.replace(/ /g, "_");

        // Récupérer la date de publication pour la suppression
        const dateMeta = document.querySelector('meta[itemprop="datePublished"]');
        let publicationDate = "";
        if (dateMeta && dateMeta.content) {
          const date = new Date(dateMeta.content);
          publicationDate = " | " + date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }

        const prefixToRemove = "@" + sanitizedChannelName + " | ";
        const suffixToRemove = publicationDate;

        if (document.title.startsWith(prefixToRemove)) {
          let newTitle = document.title.replace(prefixToRemove, "");
          if (suffixToRemove && newTitle.endsWith(suffixToRemove)) {
            newTitle = newTitle.slice(0, -suffixToRemove.length);
          }
          document.title = newTitle;
        }
      }
    }
  }, false);
}());
