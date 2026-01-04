// ==UserScript==
// @name         Youtube Downloader
// @version      0.1.11
// @namespace    sparrow-design--youtube-downloader
// @description  Download videos directly through Youtube with no external services.
// @author       sparrow-design
// @include      *://www.youtube.com/**
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      AGPL-3.0
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/525097/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/525097/Youtube%20Downloader.meta.js
// ==/UserScript==

/**
 * Renders a "Download" button under the more options list.
 */
(async () => {
  "use strict";

  urlListener({
    onChange: () => {
      injectDownloadProcess = false;
      createButton();
    },
    onInit: () => createButton(),
  });

  pipeVideoToDownload();

  const createButton = () => {
    const isWatchPage = "/watch";
    if (!isWatchPage) return;
    createDownloadButton({
      onClick: () => {
        skimThroughVideo({
          onBegin: () => {
            injectDownloadProcess = true;
          },
        });
      },
    });
  };
})();

async function urlListener(options) {
  let previousUrl = location.href;

  const app = document.querySelector("ytd-app");
  await waitForElementExists("ytd-app yt-page-navigation-progress", {
    target: app,
    subtree: false,
  });
  const navigationProgress = document.querySelector(
    "ytd-app yt-page-navigation-progress",
  );

  const observerFn = () => {
    if (location.href === previousUrl) return;

    if (options.unsubscribeOnChange) observer.disconnect();
    options.onChange();
    previousUrl = location.href;
  };
  const observer = new MutationObserver(observerFn);
  const config = {
    attributeFilter: ["hidden"],
    attributeOldValue: true,
  };

  observer.observe(navigationProgress, config);
  observerFn();

  options.onInit?.();
}

async function createDownloadButton(options) {
  const startUrl = location.href;
  await waitForElementExists("ytd-popup-container tp-yt-paper-listbox", {
    subtree: false,
  });
  if (startUrl !== location.href) return;

  const list = document.querySelector(
    "ytd-popup-container tp-yt-paper-listbox",
  );

  const popup = list.closest("ytd-menu-popup-renderer");
  popup.style.setProperty("overflow-x", "hidden");

  const item = document.createElement("ytd-menu-service-item-renderer");
  item.className = "style-scope ytd-menu-popup-renderer iron-selected";
  item.role = "menuitem";
  item.tabindex = "-1";
  item.setAttribute("use-icons", "");
  list.appendChild(item);

  // Create the text "Download"
  const text = item.querySelector("yt-formatted-string");
  text.removeAttribute("is-empty");
  text.innerText = "Download";

  // Create the download icon
  const iconComponent = item.querySelector("yt-icon");
  const icon = document.createElement("span");
  icon.className = "yt-icon-shape style-scope yt-icon yt-spec-icon-shape";
  iconComponent.appendChild(icon);

  const iconInline = document.createElement("div");
  iconInline.style.setProperty("width", "100%");
  iconInline.style.setProperty("height", "100%");
  iconInline.style.setProperty("display", "block");
  iconInline.style.setProperty("fill", "currentcolor");
  iconInline.innerHTML = createHtml(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 180"><path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg>',
  );
  icon.appendChild(iconInline);

  item.addEventListener("click", () => {
    item.setAttribute("disabled", "true");
    item.setAttribute("aria-disabled", "true");
    item.style.setProperty("opacity", "0.6");
    item.style.setProperty("pointer-events", "none");

    text.innerText = "Downloading";
    iconInline.innerHTML = createHtml(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.994 20.95q-1.707-.18-3.162-.957t-2.52-1.978q-1.066-1.203-1.667-2.755q-.6-1.552-.6-3.266q0-3.471 2.273-6.03Q7.592 3.407 11.02 3.04v1q-3.005.425-4.99 2.677t-1.985 5.278t1.975 5.278t4.975 2.678zm1-4.642l-4.313-4.32l.713-.713l3.1 3.1V7.692h1v6.683l3.095-3.094l.713.719zm1 4.642v-1q1.075-.15 2.063-.546q.987-.396 1.837-1.065l.758.719q-1.04.77-2.218 1.237q-1.176.467-2.44.655m3.95-15.261q-.875-.65-1.862-1.075t-2.063-.575v-1q1.264.169 2.431.645t2.202 1.247zm2.108 11.919l-.708-.714q.65-.85 1.05-1.837t.55-2.063h1.012q-.162 1.264-.644 2.444t-1.26 2.17m.892-6.614q-.15-1.075-.55-2.062t-1.05-1.838l.747-.752q.738 1.03 1.207 2.209t.658 2.443z"/></svg>',
    );

    options.onClick();
  });

  urlListener({
    onChange: () => item.remove(),
    unsubscribeOnChange: true,
  });

  return item;
}

async function skimThroughVideo(options) {
  const video = document.querySelector("video.html5-main-video");
  video.currentTime = 0;
  video.pause();

  const videoProgressFn = () => {
    const buffered = video.buffered.end(0);
    video.currentTime = Math.floor(buffered);
  };

  setTimeout(async () => {
    await resetVideo();
    options.onBegin();
    video.addEventListener("progress", videoProgressFn);
  }, 250);

  urlListener({
    onChange: () => video.removeEventListener("progress", videoProgressFn),
    unsubscribeOnChange: true,
  });
}

async function resetVideo() {
  document.querySelector(".ytp-button.ytp-settings-button").click();
  const settingsMenu = document.querySelector(".ytp-popup.ytp-settings-menu");
  const allItems = settingsMenu.querySelectorAll(".ytp-menuitem");
  let stableVolumeItem;
  let qualityItem;
  allItems.forEach((item) => {
    const label = item.querySelector(".ytp-menuitem-label");
    if (label.innerHTML === "Stable Volume") stableVolumeItem = item;
    if (label.innerHTML === "Quality") qualityItem = item;
  });

  if (
    stableVolumeItem &&
    stableVolumeItem.getAttribute("aria-disabled") !== "true"
  ) {
    stableVolumeItem.click();
    stableVolumeItem.click();
  }
  // If the "Stable Volume" button is disabled, we toggle between the volume.
  else {
    qualityItem.click();
    await sleep(1000);
    const settingsMenu = document.querySelector(".ytp-popup.ytp-settings-menu");
    await waitForElementExists(".ytp-panel-header", { target: settingsMenu });
    const qualityList = settingsMenu.querySelector(".ytp-panel-menu");

    let selectedQualityItem = qualityList.querySelector(
      '.ytp-menuitem[aria-checked="true"]',
    );
    let otherQualityItem = qualityList.querySelectorAll(
      '.ytp-menuitem[aria-checked="false"]',
    );

    otherQualityItem.item(otherQualityItem.length - 1).click();
    otherQualityItem.item(otherQualityItem.length - 2).click();
    selectedQualityItem.click();
  }
}

/**
 * Wait for element to be placed in the DOM.
 * Code sourced from {@link https://stackoverflow.com/a/61511955/13463861 Stack Overflow}.
 */
function waitForElementExists(selector, options) {
  return new Promise((resolve) => {
    document.querySelector(selector);
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      document.querySelector(selector);
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(options?.target ?? document.body, {
      childList: true,
      subtree: options?.subtree ?? true,
    });
  });
}

let audio = [];
let video = [];
let injectDownloadProcess = false;
let complete = false;

function pipeVideoToDownload() {
  const _endOfStream = window.MediaSource.prototype.endOfStream;
  window.MediaSource.prototype.endOfStream = function () {
    if (injectDownloadProcess) {
      log("isComplete");
      complete = true;
    }
    return _endOfStream.apply(this, arguments);
  };
  window.MediaSource.prototype.endOfStream.toString = function () {
    if (injectDownloadProcess) {
      log("endOfStream hook is detecting!");
    }
    return _endOfStream.toString();
  };

  const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer;
  window.MediaSource.prototype.addSourceBuffer = function (mime) {
    if (injectDownloadProcess) {
      log("MediaSource.addSourceBuffer ", mime);
      if (mime.toString().indexOf("audio") !== -1) {
        audio = [];
        log("audio array cleared.");
      } else if (mime.toString().indexOf("video") !== -1) {
        video = [];
        log("video array cleared.");
      }
    }
    let sourceBuffer = _addSourceBuffer.call(this, mime);
    if (injectDownloadProcess) {
      const _append = sourceBuffer.appendBuffer;
      sourceBuffer.appendBuffer = function (buffer) {
        log(mime, buffer);
        if (mime.toString().indexOf("audio") !== -1) {
          audio.push(buffer);
        } else if (mime.toString().indexOf("video") !== -1) {
          video.push(buffer);
        }
        _append.call(this, buffer);
      };

      sourceBuffer.appendBuffer.toString = function () {
        log("appendSourceBuffer hook is detecting!");
        return _append.toString();
      };
    }
    return sourceBuffer;
  };

  window.MediaSource.prototype.addSourceBuffer.toString = function () {
    if (injectDownloadProcess) {
      log("addSourceBuffer hook is detecting!");
    }
    return _addSourceBuffer.toString();
  };

  async function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(audio));
    a.download = "audio_" + document.title + ".mp4";
    a.click();
    a.href = URL.createObjectURL(new Blob(video));
    a.download = "video_" + document.title + ".mp4";
    a.click();
    complete = false;
    injectDownloadProcess = false;
  }

  setInterval(() => {
    if (complete === true) {
      download();
    }
  }, 2000);
}

function log(...args) {
  console.log("YTDOWNLOADER:\n", ...args);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function createHtml(html) {
  if (window.trustedTypes) {
    const policy = trustedTypes.createPolicy("forceInner", {
      createHTML: (to_escape) => to_escape,
    });
    return policy.createHTML(html);
  } else {
    return html;
  }
}