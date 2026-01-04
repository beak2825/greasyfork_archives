// ==UserScript==
// @name         Tiktok Timeline Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Download entier profile timeline
// @match        https://www.tiktok.com/@*
// @match        tiktok.com/@*
// @match        https://discord.com/channels/*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://tikwm.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/523900/Tiktok%20Timeline%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523900/Tiktok%20Timeline%20Downloader.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const tikTokVideoIdRegex = /\/video\/(\d+)(\/|$)/;
  const discordTikTokUrlRegex = /https:\/\/www.tiktok.com\/(\w+)\/video\/(\d+)/;
  const tikTokPhotoIdRegex = /\/@[\w.]+\/photo\/(\d+)/;
  const tikwmRegex = /https:\/\/.*tiktokcdn\.com.*/;
  const username = window.location.href.match(/\/@([\w.]+)/)[1];

  async function getPhotoLinks(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            const anchors = doc.querySelectorAll(
              'a[target="_blank"][href*="tiktokcdn.com"]'
            );
            const links = Array.from(anchors);
            const urls = links.map((link) => link.href);
            resolve(urls); // Return the array of links
          } else {
            console.error(`Failed to fetch ${url}: ${response.status}`);
            resolve([]); // Return empty array on error
          }
        },
        onerror: function (err) {
          console.error(`Error fetching ${url}:`, err);
          resolve([]); // Return empty array on error
        },
      });
    });
  }

  async function download(url) {
    return new Promise(async (resolve) => {
      let isImage = url.match(tikwmRegex);
      if (isImage) {
        let fileName = url.split("/").pop().split("?")[0];
        let name = `@${username}-${fileName}`;
        GM_download({
          url,
          name,
          onload: () => {
            resolve(true);
          },
          onerror: () => {
            resolve(false);
          },
        });
        const delay = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        let tikTokVideoIdMatch = url.match(tikTokVideoIdRegex);
        let discordTikTokUrlMatch = url.match(discordTikTokUrlRegex);
        let fileName = "";
        let newUrl = "";
        if (tikTokVideoIdMatch) {
          let videoId = tikTokVideoIdMatch[1];
          fileName = `@${username}-${videoId}.mp4`;
          newUrl = `https://tikwm.com/video/media/hdplay/${videoId}.mp4`;
        } else if (discordTikTokUrlMatch) {
          let videoId = discordTikTokUrlMatch[2];
          fileName = `@${username}-${videoId}.mp4`;
          newUrl = `https://tikwm.com/video/media/hdplay/${videoId}.mp4`;
        }
        GM_download({
          url: newUrl,
          name: fileName,
          onload: () => {
            resolve(true);
          },
          onerror: () => {
            resolve(false);
          },
        });
      }
    });
  }

  // Function to scroll to the bottom of the page slowly
  async function scrollToBottom() {
    return new Promise((resolve) => {
      const interval = 1000; // Time between scrolls (ms)
      const scrollStep = window.innerHeight; // Scroll by one viewport height
      const maxScrollRetries = 50; // Maximum attempts to prevent infinite loop
      let retries = 0;

      const scrollInterval = setInterval(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (isAtBottom || retries >= maxScrollRetries) {
          clearInterval(scrollInterval);
          resolve();
          console.log("Reached the bottom of the page.");
        } else {
          window.scrollBy(0, scrollStep);
          retries++;
        }
      }, interval);
    });
  }

  // Create "Download Timeline" button
  const button = document.createElement("button");
  button.textContent = "Download Timeline";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "#007BFF";
  button.style.color = "#FFF";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.fontSize = "16px";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  button.addEventListener(
    "mouseover",
    () => (button.style.backgroundColor = "#0056b3")
  );
  button.addEventListener(
    "mouseout",
    () => (button.style.backgroundColor = "#007BFF")
  );

  document.body.appendChild(button);

  button.addEventListener("click", async function () {
    button.disabled = true;
    button.textContent = "Scrolling to the bottom of the page...";
    await scrollToBottom();

    button.textContent = "Collecting post items...";
    const postItems = document.querySelectorAll('[data-e2e="user-post-item"]');
    const hrefs = Array.from(postItems).map((post) => {
      const anchor = post.querySelector("a");
      return anchor ? anchor.href : null;
    });

    const urls = [];

    for (const href of hrefs) {
      const isImageUrl = href.match(tikTokPhotoIdRegex);
      if (isImageUrl) {
        const photos = await getPhotoLinks(
          `https://tikwm.com/video/${isImageUrl}.html`
        );
        urls.push(...photos);
        const delay = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        urls.push(href);
      }
    }

    let remaining = urls.length;
    let downloaded = 0;
    let failed = 0;

    if (urls.length > 0) {
      console.log(`Found ${postItems.length} user post items.`);
      let i = 1;
      for (const href of urls) {
        button.textContent = `${remaining} Remaining | ${downloaded} Downloaded | ${failed} Failed`;
        console.log(`Downloading ${i} of ${urls.length}`);
        const success = await download(href);
        if (success) {
          downloaded++;
        } else {
          failed++;
        }
        remaining--;
        const delay = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        i++;
      }

      postItems.forEach((item, index) => {
        console.log(`Post ${index + 1}:`, item);
      });
    } else {
      alert("No user post items found.");
    }

    // Reset button text after all downloads are complete
    button.disabled = false;
    button.textContent = "Download Timeline";
  });
})();
