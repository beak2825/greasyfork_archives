// ==UserScript==
// @name         InstaSaver - Instagram media downloader
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  Add download buttons to Instagram posts and reels to download images or videos from post body.
// @author       Tas33n
// @homepage     https://github.com/tas33n/InstaSaver
// @match        https://www.instagram.com/p/*
// @match        https://www.instagram.com/reel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503877/InstaSaver%20-%20Instagram%20media%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/503877/InstaSaver%20-%20Instagram%20media%20downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to download a file as a Blob
  function downloadFile(url, filename) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => console.error(`Error downloading ${filename}:`, error));
  }

  // Function to create and insert the download button
  function createDownloadButton(type) {
    const button = document.createElement("button");
    button.innerHTML = `
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C11.4477 2 11 2.44772 11 3V15.5858L8.70711 13.2929C8.31658 12.9024 7.68342 12.9024 7.29289 13.2929C6.90237 13.6834 6.90237 14.3166 7.29289 14.7071L11.2929 18.7071C11.6834 19.0976 12.3166 19.0976 12.7071 18.7071L16.7071 14.7071C17.0976 14.3166 17.0976 13.6834 16.7071 13.2929C16.3166 12.9024 15.6834 12.9024 15.2929 13.2929L13 15.5858V3C13 2.44772 12.5523 2 12 2ZM5 20C4.44772 20 4 20.4477 4 21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H5Z"/>
              </svg>`;
    button.style.cssText = `
              float: left;
              padding-right: 15px;
              background: none;
              border: none;
              cursor: pointer;
          `;

    button.addEventListener("click", () => {
      const currentUrl = window.location.href;
      const match = currentUrl.match(
        type === "post" ? /\/p\/([a-zA-Z0-9_-]+)\// : /\/reel\/([a-zA-Z0-9_-]+)/
      );
      let name = match[1] || (type === "post" ? "image" : "video");

      if (type === "post") {
        const imageUrls = getPostImageSrcUrls();
        imageUrls.forEach((url, index) => {
          downloadFile(url, `${name}_${index + 1}.jpg`);
        });
      } else {
        const videoUrl = getReelVideoSrcUrl();
        if (videoUrl) {
          downloadFile(videoUrl, `${name}.mp4`);
        }
      }
    });

    const targetDiv = document.querySelector(".x11i5rnm.x1gryazu");
    if (targetDiv) {
      targetDiv.insertBefore(button, targetDiv.firstChild);
    }
  }

  // Function to extract URLs from JSON data
  function extractUrls(scriptContent, type) {
    try {
      const jsonData = JSON.parse(scriptContent.match(/({.*})/)[1]);
      const mediaItems =
        jsonData.require[0][3][0].__bbox.require[0][3][1].__bbox.result.data
          .xdt_api__v1__media__shortcode__web_info.items[0];
      if (type === "post") {
        const singleMulti = mediaItems?.carousel_media
          ? mediaItems.carousel_media
          : mediaItems;
        return Array.isArray(singleMulti)
          ? singleMulti
              .map((mediaItem) => mediaItem.image_versions2?.candidates[0]?.url)
              .filter((url) => url)
          : [singleMulti.image_versions2?.candidates[0]?.url];
      } else {
        return mediaItems.video_versions[0]?.url;
      }
    } catch (error) {
      console.error(`Error extracting ${type} URLs:`, error);
      return type === "post" ? [] : null;
    }
  }

  function getPostImageSrcUrls() {
    const scriptTag = [
      ...document.querySelectorAll('script[type="application/json"]'),
    ].find((tag) =>
      tag.textContent.includes("xdt_api__v1__media__shortcode__web_info")
    );
    return scriptTag ? extractUrls(scriptTag.textContent, "post") : [];
  }

  function getReelVideoSrcUrl() {
    const scriptTag = [
      ...document.querySelectorAll('script[type="application/json"]'),
    ].find((tag) =>
      tag.textContent.includes("xdt_api__v1__media__shortcode__web_info")
    );
    return scriptTag ? extractUrls(scriptTag.textContent, "reel") : null;
  }

  window.addEventListener("load", () => {
    if (window.location.href.includes("/p/")) {
      setTimeout(() => createDownloadButton("post"), 1000);
    } else if (window.location.href.includes("/reel/")) {
      setTimeout(() => createDownloadButton("reel"), 1000);
    }
  });
})();
