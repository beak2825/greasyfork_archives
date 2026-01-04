// ==UserScript==
// @name         Retrieve Ehentai Torrent Resource Sizes and Magnet Links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Retrieve torrent resource sizes and magnet links from Ehentai galleries and display them below the "Torrent Download" section. Click to copy to clipboard.
// @author       Neko_Aria
// @include      https://e-hentai.org/g/*
// @include      https://exhentai.org/g/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/372788/Retrieve%20Ehentai%20Torrent%20Resource%20Sizes%20and%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/372788/Retrieve%20Ehentai%20Torrent%20Resource%20Sizes%20and%20Magnet%20Links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getGalleryId() {
    const match = location.pathname.match(/\/g\/(\d+)/);
    return match ? match[1] : null;
  }

  function getToken() {
    const match = location.pathname.match(/\/(\w{10})\/?$/);
    return match ? match[1] : null;
  }

  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function createInfoNode(text, isMagnetLink = false) {
    const infoNode = document.createElement("p");
    infoNode.style.wordBreak = "break-all";
    infoNode.innerText = text;
    if (isMagnetLink) {
      infoNode.style.cursor = "pointer";
      infoNode.addEventListener("click", () => {
        copyToClipboard(text);
        alert("Copied to clipboard.");
      });
    }
    return infoNode;
  }

  function createSeparatorNode() {
    const separator = document.createElement("hr");
    return separator;
  }

  function displayInfo(container, text, isMagnetLink = false) {
    const infoNode = createInfoNode(text, isMagnetLink);
    container.appendChild(infoNode);
  }

  function parseResponse(response, container) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.responseText, "text/html");
    const tables = doc.getElementsByTagName("table");

    if (tables.length === 0) {
      displayInfo(container, "0 torrents were found for this gallery.");
    } else {
      Array.from(tables).forEach((table) => {
        const cells = table.getElementsByTagName("td");
        if (cells.length > 1) {
          const separator = createSeparatorNode();
          container.appendChild(separator);

          const sizeText = cells[1].innerText;
          const magnetLink = table.querySelector("a").href;
          const magnetHash = magnetLink.match(/[\w\d]{40}/)[0];
          const magnetText = `magnet:?xt=urn:btih:${magnetHash}`;

          displayInfo(container, sizeText);
          displayInfo(container, magnetText, true);
        }
      });
    }
  }

  function main() {
    const galleryId = getGalleryId();
    const token = getToken();
    const targetNode = document.querySelector("p.g2:not(.gsp)");

    if (galleryId && token && targetNode) {
      targetNode.style.paddingBottom = "20px";

      const container = document.createElement("div");
      container.style.maxHeight = "120px";
      container.style.overflowY = "auto";
      targetNode.insertAdjacentElement("afterend", container);

      const baseURL = `https://${location.hostname}/gallerytorrents.php?gid=${galleryId}&t=${token}`;

      GM_xmlhttpRequest({
        method: "GET",
        url: baseURL,
        overrideMimeType: "text/html; charset=UTF-8",
        onload: (response) => parseResponse(response, container),
      });
    }
  }

  main();
})();
