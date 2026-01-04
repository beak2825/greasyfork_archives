// ==UserScript==
// @name        Youtube Screenshot Button
// @namespace   http://tampermonkey.net/
// @match       https://www.youtube.com/*
// @version     1.01
// @author      LeKAKiD, Yukiteru
// @description Add a screenshot button for YouTube. Originally created by LeKAKiD, modified by me.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/508678/Youtube%20Screenshot%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/508678/Youtube%20Screenshot%20Button.meta.js
// ==/UserScript==

function handleYTFrame() {
  // Player elements
  let settingButton = undefined;
  let player = undefined;
  let video = undefined;
  const tooltip = {
    element: undefined,
    text: undefined,
  };

  // Initialize element;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });
  const anchor = document.createElement("a");

  // Render buttons
  const screenshotButton = document.createElement("button");
  screenshotButton.classList.add("ytp-button");

  // Create the SVG element. Can't use innerHTML due to security update
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("fill", "none");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "-4 -4 28 28");
  svg.setAttribute("width", "100%");

  // Path elements
  const pathData = [
    "M6.5 5C5.67157 5 5 5.67157 5 6.5V8.5C5 8.77614 5.22386 9 5.5 9C5.77614 9 6 8.77614 6 8.5V6.5C6 6.22386 6.22386 6 6.5 6H8.5C8.77614 6 9 5.77614 9 5.5C9 5.22386 8.77614 5 8.5 5H6.5Z",
    "M11.5 5C11.2239 5 11 5.22386 11 5.5C11 5.77614 11.2239 6 11.5 6H13.5C13.7761 6 14 6.22386 14 6.5V8.5C14 8.77614 14.2239 9 14.5 9C14.7761 9 15 8.77614 15 8.5V6.5C15 5.67157 14.3284 5 13.5 5H11.5Z",
    "M6 11.5C6 11.2239 5.77614 11 5.5 11C5.22386 11 5 11.2239 5 11.5V13.5C5 14.3284 5.67157 15 6.5 15H8.5C8.77614 15 9 14.7761 9 14.5C9 14.2239 8.77614 14 8.5 14H6.5C6.22386 14 6 13.7761 6 13.5V11.5Z",
    "M15 11.5C15 11.2239 14.7761 11 14.5 11C14.2239 11 14 11.2239 14 11.5V13.5C14 13.7761 13.7761 14 13.5 14H11.5C11.2239 14 11 14.2239 11 14.5C11 14.7761 11.2239 15 11.5 15H13.5C14.3284 15 15 14.3284 15 13.5V11.5Z",
    "M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5ZM4 5V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V5C16 4.44772 15.5523 4 15 4H5C4.44772 4 4 4.44772 4 5Z"
  ];

  pathData.forEach(d => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "#fff");
    svg.appendChild(path);
  });

  // Append the SVG to the button
  screenshotButton.appendChild(svg);

  // Capture function
  function capture() {
    if (!video) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob));
    });
  }

  // Tooltip control
  function showTooltip(text, referenceButton, withoutEvent) {
    // Borrow existing button event for animation
    if (!withoutEvent) settingButton.dispatchEvent(new MouseEvent("mouseover"));
    if (!player) {
      player = document.querySelector("#player:not(.skeleton)");
      tooltip.element = document.querySelector(".ytp-tooltip-text-wrapper").parentElement;
      tooltip.text = tooltip.element.querySelector(".ytp-tooltip-text");
    }
    tooltip.text.textContent = text;
    tooltip.element.style.left = "0px";
    const buttonRect = referenceButton.getBoundingClientRect();
    const tooltipRect = tooltip.element.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const buttonRelativePos = buttonRect.x - playerRect.x;
    const buttonRelativeCenter = buttonRelativePos + buttonRect.width / 2;
    const left = buttonRelativeCenter - tooltipRect.width / 2;
    tooltip.element.style.left = `${left}px`;
  }

  function hideTooltip() {
    // Borrow existing button event for animation
    settingButton.dispatchEvent(new MouseEvent("mouseout"));
  }

  screenshotButton.addEventListener("click", async e => {
    const blob = await capture();
    if (!blob) return;

    // copy image to clipboard
    const item = new window.ClipboardItem({ [blob.type]: blob });
    navigator.clipboard.write([item]);

    // save image locally
    const url = URL.createObjectURL(blob);
    const ext = blob.type.split("/")[1];
    const filename = getFilename(ext);
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  });

  function detectUserLanguage() {
    const language = navigator.language || navigator.userLanguage;
    return language.split("-")[0];
  }

  function getTooltip() {
    const language = detectUserLanguage();
    const tooltipTexts = {
      en: "Screenshot",
      zh: "截图",
      ja: "スクリーンショット",
      ko: "스크린샷",
    };

    return tooltipTexts[language];
  }

  screenshotButton.addEventListener("mouseover", () => {
    const tooltip = getTooltip();
    showTooltip(tooltip, screenshotButton);
  });

  screenshotButton.addEventListener("mouseout", () => {
    hideTooltip();
  });

  // Observer
  const observer = new MutationObserver(() => {
    settingButton = document.querySelector(".ytp-right-controls > .ytp-settings-button");
    if (settingButton) {
      video = document.querySelector("video");
      settingButton.insertAdjacentElement("beforebegin", screenshotButton);
      observer.disconnect();
      return;
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function getFilename(ext) {
  // can't use #title directly since there might be a mini player with a h1 element
  const title = document
    .querySelector(".ytd-watch-metadata")
    .querySelector("#title")
    .textContent.trim();
  const time = new Date().toLocaleString().replaceAll("/", "-");
  const progress = document.querySelector("video.video-stream").currentTime.toFixed(2);
  return (filename = `${title} ${progress} ${time} screenshot.${ext}`);
}

const urlRegex = /https:\/\/(.+\.)?youtube\.com\/embed\/.+/;
function addAllowClipboard() {
  document.querySelectorAll("iframe").forEach(e => {
    if (urlRegex.test(e.src) && e.allow.indexOf("clipboard-write") === -1) {
      e.allow += "clipboard-write;";
      e.src = e.src;
    }
  });
}

if (window.self === window.top) addAllowClipboard();

const ytRegex = /https:\/\/(.+\.)?youtube\.com(\/(embed|watch).+)?/;
if (ytRegex.test(location.href)) handleYTFrame();
