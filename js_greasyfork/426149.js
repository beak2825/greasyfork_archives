// ==UserScript==
// @name         Download YouTube Subscriptions OPML
// @namespace    https://idaemons.org/
// @version      0.2
// @author       Akinori MUSHA
// @description  adds a "Download OPML" button to your YouTube Channel List page
// @match        https://www.youtube.com/feed/channels
// @match        https://www.youtube.com/feed/channels?*
// @grant        none
// @license      BSD-2-Clause
// @homepage     https://github.com/knu/userjs-youtube_subscriptions_opml
// @downloadURL https://update.greasyfork.org/scripts/426149/Download%20YouTube%20Subscriptions%20OPML.user.js
// @updateURL https://update.greasyfork.org/scripts/426149/Download%20YouTube%20Subscriptions%20OPML.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const loadAll = () =>
    new Promise((resolve) => {
      const initialY = document.documentElement.scrollTop;
      let lastHeight = document.documentElement.scrollHeight;
      const scroller = window.setInterval(
        () => window.scrollTo(0, document.documentElement.scrollHeight),
        100
      );
      const observer = window.setInterval(() => {
        const spinner = document.querySelector("paper-spinner-lite");
        if (spinner && spinner.getAttribute("aria-hidden") !== "true") return;

        const currentHeight = document.documentElement.scrollHeight;
        if (currentHeight !== lastHeight) {
          lastHeight = currentHeight;
          return;
        }

        window.clearInterval(scroller);
        window.clearInterval(observer);
        window.scrollTo(0, initialY);
        resolve();
      }, 1500);
    });

  const div = document.createElement("div");
  const button = document.createElement("button");
  button.textContent = "Download OPML";
  const download = () => {
    const doc = document.implementation.createDocument("", "", null);
    doc.appendChild(doc.createProcessingInstruction("xml", 'version="1.0"'));
    const opml = doc.createElement("opml");
    opml.setAttribute("version", "1.0");
    doc.appendChild(opml);
    const head = doc.createElement("head");
    opml.appendChild(head);
    const title = doc.createElement("title");
    title.textContent = "My YouTube Subscriptions";
    head.appendChild(title);
    const body = doc.createElement("body");
    opml.appendChild(body);
    document.querySelectorAll("ytd-channel-renderer").forEach((li) => {
      const title = li.querySelector("#channel-title #text").textContent;
      const href = li.querySelector("a#main-link").getAttribute("href");
      const id = /\/channel\/([^/]+)/.test(href) && RegExp.$1;
      const url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + id;
      const outline = doc.createElement("outline");
      outline.setAttribute("type", "atom");
      outline.setAttribute("text", title);
      outline.setAttribute("title", title);
      outline.setAttribute("xmlUrl", url);
      body.appendChild(outline);
    });

    const blob = new Blob([new XMLSerializer(doc).serializeToString(doc)], {
      type: "text/x-opml",
    });
    const link = document.createElement("a");
    link.download = "youtube_subscriptions.opml";
    link.href = URL.createObjectURL(blob);
    link.click();
  };
  button.addEventListener("click", (e) => {
    loadAll().then(download);
  });
  div.appendChild(button);
  const topElement = document.querySelector("ytd-section-list-renderer");
  topElement.parentNode.insertBefore(div, topElement);
})();
