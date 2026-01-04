// ==UserScript==
// @name     Cobalt Tools Video Downloader
// @description  Adds a context menu item that downloads the current page's video.
// @version  1.0.3
// @author       yodaluca23
// @license      GNU GPLv3
// @grant    GM_registerMenuCommand
// @grant     GM_openInTab
// @run-at   document-idle
// @inject-into content
// @match *://*cobalt.tools/*
// @match *://*.bilibili.com/*
// @match *://app.bsky.social/*
// @match *://www.dailymotion.com/*
// @match *://*.facebook.com/*
// @match *://fb.watch/*
// @match *://*.instagram.com/*
// @match *://ddinstagram.com/*
// @match *://www.loom.com/*
// @match *://ok.ru/*
// @match *://www.pinterest.com/*
// @match *://*.reddit.com/*
// @match *://rutube.ru/*
// @match *://*.snapchat.com/*
// @match *://soundcloud.com/*
// @match *://streamable.com/*
// @match *://*.tiktok.com/*
// @match *://*.tumblr.com/*
// @match *://*.twitch.tv/*
// @match *://twitter.com/*
// @match *://mobile.twitter.com/*
// @match *://x.com/*
// @match *://vxtwitter.com/*
// @match *://fixvx.com/*
// @match *://vine.co/*
// @match *://vimeo.com/*
// @match *://*.vk.com/*
// @match *://www.youtube.com/*
// @match *://music.youtube.com/*
// @match *://m.youtube.com/*
// @match *://*.xiaohongshu.com/*
// @match *://*.xhslink.com/*
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/516921/Cobalt%20Tools%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516921/Cobalt%20Tools%20Video%20Downloader.meta.js
// ==/UserScript==

let cobaltInitialInjectDelay = 2000; // Cobalt Initial delay in milliseconds

function isCobaltURL() {
  return (window.location.href.includes("cobalt.tools"));
}

function waitForLoadingComplete(element) {
  return new Promise((resolve) => {
      const checkLoadingState = setInterval(() => {
          const icon = document.querySelector(element);

          if (icon && !icon.className.includes("loading")) {
              clearInterval(checkLoadingState);
              resolve();
          }
      }, 100);
  });
}

function waitForSaveDownloadButton() {
  return new Promise((resolve) => {
      const checkButtonState = setInterval(() => {
          const button = document.querySelector("#button-save-download");

          if (button) {
              clearInterval(checkButtonState);
              resolve();
          }
      }, 100);
  });
}

function cobaltWebsiteSimulation() {
  // Function to check if input length is greater than 5
  if (window.document.getElementById('link-area').value.length > 5) {
    document.getElementById('download-button').click();
    waitForSaveDownloadButton().then(() => {
        document.querySelector("#button-save-download").click()
        // close the cobalt tab
        setTimeout(() => {
            window.close();
        }, 1000);
    });
  }
}

if (isCobaltURL()) {
  setTimeout(() => {
      waitForLoadingComplete("#input-icons").then(() => {
        cobaltWebsiteSimulation();
      });
  }, cobaltInitialInjectDelay);
}

function openCobalt() {
    GM_openInTab("https://cobalt.tools/#" + window.location.href, true);
    alert("Loading, please wait... \nOpening cobalt tools website and automating download actions.")
}

GM_registerMenuCommand("Download this video with Cobalt Tools", openCobalt);