// ==UserScript==
// @name         AudioBookBay - Add download links on list
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds torrent file download links directly on list of audiobooks
// @author       UnderMan4
// @license      GPL-3.0 License
// @match        https://audiobookbay.is/*
// @match        https://audiobookbay.se/*
// @match        https://audiobookbay.nl/*
// @match        https://theaudiobookbay.se/*
// @match        https://theaudiobookbay.net/*
// @match        https://audiobookbay.lu/*
// @match        http://audiobookbay.is/*
// @match        http://audiobookbay.se/*
// @match        http://audiobookbay.nl/*
// @match        http://theaudiobookbay.se/*
// @match        http://theaudiobookbay.net/*
// @match        http://audiobookbay.lu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audiobookbay.is
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468083/AudioBookBay%20-%20Add%20download%20links%20on%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/468083/AudioBookBay%20-%20Add%20download%20links%20on%20list.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //adding styles

  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  const css = `
      .torrentDownloadLink {
          margin-left: 0.5rem;
      }

      .torrentDownloadLink svg {
        transform: translateY(2px);
      }
  `;

  style.innerHTML = css;
  head.appendChild(style);

  //creating download link template

  const downloadLink = document.createElement("a");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  icon.setAttribute("viewBox", "0 0 256 256");
  icon.setAttribute("width", "25");
  icon.setAttribute("height", "25");

  iconPath.setAttribute("fill", "#333");
  iconPath.setAttribute(
    "d",
    "M228 152v56a20 20 0 0 1-20 20H48a20 20 0 0 1-20-20v-56a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0Zm-108.49 8.49a12 12 0 0 0 17 0l40-40a12 12 0 0 0-17-17L140 123V40a12 12 0 0 0-24 0v83l-19.51-19.49a12 12 0 0 0-17 17Z"
  );

  icon.appendChild(iconPath);

  downloadLink.appendChild(icon);

  //adding link for each post

  for (const postIterator of document.querySelectorAll("div.post").entries()) {
    const post = postIterator[1];

    const downloadNowLink = post.querySelector("span.postComments>a");
    const href = `${window.location.origin}/download${downloadNowLink
      .getAttribute("href")
      .slice(10)}`;

    const title = post.querySelector("div.postTitle h2");

    const downloadLinkWithHref = downloadLink.cloneNode(true);

    downloadLinkWithHref.setAttribute("href", href);

    const span = document.createElement("span");

    span.className = "torrentDownloadLink";

    span.appendChild(downloadLinkWithHref);

    title.appendChild(span);
  }
})();
