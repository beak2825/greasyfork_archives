// ==UserScript==
// @name         코네 : 단축키
// @namespace    http://tampermonkey.net/
// @description  코네 단축키
// @version      2.01
// @author       유령
// @match        https://kone.gg/*
// @icon         https://kone.gg/favicon.ico
// @license      MIT
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536518/%EC%BD%94%EB%84%A4%20%3A%20%EB%8B%A8%EC%B6%95%ED%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/536518/%EC%BD%94%EB%84%A4%20%3A%20%EB%8B%A8%EC%B6%95%ED%82%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function injectJSZip(callback) {
    if (window.JSZip) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  let articleSection = null, commentSection = null, articlelistSection = null;
  let nevbar = null, articleList = null, activePostTitle = null, activePostCategory = null, activePostNum = null, allArticlePost = null, allSubscribeSub = null, commentList = null, channelHref = null, pagInation = null, rateUpButton = null, rateDownButton = null, activePostCheck = false, activePostIndex = 0, isMoveArticleNext = false, isMoveArticlePrevious = false, subCategory = null, activeSubCheck = false, activeSubIndex = 0, waitingCheck = null, writePostButton = null, category = null, title = null, num = null, channel = null, zipNameTemp = null, zipName = null, imageNameTemp = null, imageName = null;
  const defaultShortcuts = { writePost: null, refresh: null, scrollTop: null, scrollBottom: null, scrollToArticles: null, prevPost: null, nextPost: null, changeSub: null ,prevSub: null, nextSub: null, channelMove: null, writeComment: null, rateUp: null, rateDown: null, fileDownload: null };
  const shortcutsToKorean = { writePost: "글쓰기", refresh: "새로고침", scrollTop: "상단으로 이동", scrollBottom: "하단으로 이동", scrollToArticles: "게시물 목록으로 이동", prevPost: "이전 글/페이지로 이동", nextPost: "다음 글/페이지로 이동", changeSub: "서브 목록 변경", prevSub: "이전 서브로 이동", nextSub: "다음 서브로 이동", channelMove: "채널 첫 화면으로 이동", writeComment: "댓글로 이동", rateUp: "추천", rateDown: "비추천", fileDownload: "이미지 다운로드" };
  const defaultKoneShortcuts = { Q: true, W: true, E: true, R: true, A: true, S: true, D: true, F: true, Z: false, X: false, C: true, V: false, "/": true };
  const koneShortcutsToKorean = { Q: "서브 페이지 [ Q ]", W: "글쓰기 [ W ]", E: "맨 위로 [ E ]", R: "새로고침 [ R ]", A: "이전 글/페이지 [ A ]", S: "다음 글/페이지 [ S ]", D: "댓글 [ D ]", F: "게시물 저장 [ F ]", Z: "", X: "", C: "게시글 리스트 [ C ]", V: "", "/": "도움말 [ / ]" };
  const defaultFileNames = { fileZipName: "[%category%] %title%_%num%", fileImageName: "[%category%] %title%_%num%" };
  const defaultSetting = { shortcutsUse: true, koneShortcutsUse: true, themaChangeUse: false };
  const defaultThemaColors = { "--color-zinc-50": "#fafafa", "--color-zinc-100": "#f4f4f5", "--color-zinc-200": "#e4e4e7", "--color-zinc-300": "#d4d4d8", "--color-zinc-400": "#a1a1aa", "--color-zinc-500": "#71717a", "--color-zinc-600": "#52525b", "--color-zinc-700": "#3f3f46", "--color-zinc-800": "#27272a", "--color-zinc-900": "#18181b", "--color-black": "#000", "--color-white": "#fff", "--color-red-100": "oklch(93.6% .032 17.717)", "--color-red-300": "oklch(80.8% .114 19.571)", "--color-red-400": "oklch(70.4% .191 22.216)", "--color-red-500": "oklch(63.7% .237 25.331)", "--color-red-600": "oklch(57.7% .245 27.325)", "--color-red-700": "oklch(50.5% .213 27.518)", "--color-red-800": "oklch(44.4% .177 26.899)", "--color-red-900": "oklch(39.6% .141 25.723)", "--color-orange-400": "oklch(75% .183 55.934)", "--color-orange-500": "oklch(70.5% .213 47.604)", "--color-amber-500": "oklch(76.9% .188 70.08)", "--color-yellow-400": "oklch(85.2% .199 91.936)", "--color-yellow-500": "oklch(79.5% .184 86.047)", "--color-yellow-600": "oklch(68.1% .162 75.834)", "--color-yellow-700": "oklch(55.4% .135 66.442)", "--color-green-100": "oklch(96.2% .044 156.743)", "--color-green-400": "oklch(79.2% .209 151.711)", "--color-green-500": "oklch(72.3% .219 149.579)", "--color-green-600": "oklch(62.7% .194 149.214)", "--color-green-700": "oklch(52.7% .154 150.069)", "--color-green-800": "oklch(44.8% .119 151.328)", "--color-green-900": "oklch(39.3% .095 152.535)", "--color-blue-50": "oklch(97% .014 254.604)", "--color-blue-100": "oklch(93.2% .032 255.585)", "--color-blue-300": "oklch(80.9% .105 251.813)", "--color-blue-400": "oklch(70.7% .165 254.624)", "--color-blue-500": "oklch(62.3% .214 259.815)", "--color-blue-600": "oklch(54.6% .245 262.881)", "--color-blue-700": "oklch(48.8% .243 264.376)", "--color-blue-800": "oklch(42.4% .199 265.638)", "--color-blue-900": "oklch(37.9% .146 265.522)", "--color-purple-400": "oklch(71.4% .203 305.504)", "--color-purple-500": "oklch(62.7% .265 303.9)", "--color-rose-400": "oklch(71.2% .194 13.428)", "--color-rose-500": "oklch(64.5% .246 16.439)", "--color-rose-600": "oklch(58.6% .253 17.585)", "--color-rose-700": "oklch(51.4% .222 16.935)", "--color-gray-100": "oklch(96.7% .003 264.542)", "--color-gray-300": "oklch(87.2% .01 258.338)", "--color-gray-400": "oklch(70.7% .022 261.325)", "--color-gray-500": "oklch(55.1% .027 264.364)", "--color-gray-600": "oklch(44.6% .03 256.802)", "--color-gray-800": "oklch(27.8% .033 256.848)" };
  let shortcutKeysTemp = JSON.parse(localStorage.getItem("kone_shortcuts")) || defaultShortcuts, koneShortcutKeysTemp = JSON.parse(localStorage.getItem("kone_koneshortcuts")) || defaultKoneShortcuts, fileNamesTemp = JSON.parse(localStorage.getItem("kone_filenames")) || defaultFileNames, settingsTemp = JSON.parse(localStorage.getItem("kone_settings")) || defaultSetting, themaChnageColorsTemp = JSON.parse(localStorage.getItem("kone_themachangecolors")) || defaultThemaColors;
  let shortcutKeys = { ...defaultShortcuts, ...shortcutKeysTemp }, koneShortcutKeys = { ...defaultKoneShortcuts, ...koneShortcutKeysTemp }, fileNames = { ...defaultFileNames, ...fileNamesTemp }, settings = { ...defaultSetting, ...settingsTemp }, themaChangeColors = { ...defaultThemaColors, ...themaChnageColorsTemp };
  let fileZipName = fileNames.fileZipName, fileImageName = fileNames.fileImageName;
  let shortcutsUse = settings.shortcutsUse, koneShortcutsUse = settings.koneShortcutsUse, themaChangeUse = settings.themaChangeUse;

  function resetVar() {
    articleSection = null; commentSection = null; articlelistSection = null; nevbar = null; articleList = null; activePostTitle = null; activePostCategory = null; activePostNum = null; allArticlePost = null; allSubscribeSub = null; commentList = null; channelHref = null; pagInation = null; rateUpButton = null; rateDownButton = null; activePostCheck = false; activePostIndex = 0; isMoveArticleNext = false; isMoveArticlePrevious = false; subCategory = null; activeSubCheck = false; activeSubIndex = 0; waitingCheck = null; writePostButton = null; category = null; title = null; num = null; channel = null; zipNameTemp = null; zipName = null; imageNameTemp = null; imageName = null;
  }

  let ToastCount = 0;
  const ToastHeight = 50, ToastGap = 10, ToastStyle = document.createElement('style');
  ToastStyle.textContent = ` .Toast { background-color: #333; color: white; position: fixed; width: 400px; top: 20px; right: 20px; padding: 10px 20px; border-radius: 5px; opacity: 0; transition: opacity 0.3s ease-in-out; box-sizing: border-box; z-index: 9999; } .Toast.show { opacity: 1; } `;
  document.head.appendChild(ToastStyle);

  function showToast(message, toastColor = null, onComplete = null) {
    const Toast = document.createElement('div');
    Toast.className = 'Toast';
    Toast.textContent = `${message}`;
    if (onComplete) Toast.textContent = "[시작] " + Toast.textContent;
    document.body.appendChild(Toast);
    if (toastColor) Toast.style.backgroundColor = toastColor;

    Toast.style.top = `${20 + ToastCount * (ToastHeight + ToastGap)}px`;
    ToastCount++;

    setTimeout(() => {
      Toast.classList.add('show');
    }, 100);

    if (onComplete) {
      onComplete(Toast).then(() => {
        Toast.style.backgroundColor = "#008000";
        Toast.textContent = `[완료] ${message}`;
        setTimeout(() => {
          Toast.classList.remove('show');
          setTimeout(() => {
            Toast.remove();
            ToastCount--;
             updateToastPositions();
          }, 300);
        }, 3000);
      }).catch((err) => {
        Toast.style.backgroundColor = "#800000";
        Toast.textContent = `[실패 : ${err.message}] ${message}`;
        setTimeout(() => {
          Toast.classList.remove('show');
          setTimeout(() => {
            Toast.remove();
            ToastCount--;
            updateToastPositions();
          }, 300);
        }, 3000);
      });
    }
    else {
      setTimeout(() => {
        Toast.classList.remove('show');
        setTimeout(() => {
          Toast.remove();
          ToastCount--;
            updateToastPositions();
        }, 300);
      }, 3000);
    }
  }

  function updateToastPositions() {
    const Toasts = document.querySelectorAll('.Toast');
    Toasts.forEach((toast, index) => {
      toast.style.top = `${20 + index * (ToastHeight + ToastGap)}px`;
    });
  }

  function truncateMessage(message, truncateLength = 18) {
    if (message.length > truncateLength) {
      return message.slice(0, truncateLength - 3) + '...';
    }
    return message;
  }

  const downloadButton = document.createElement('button');
  downloadButton.innerText = '이미지 다운로드';
  downloadButton.style.cssText = ` background-color: #4CAF50; padding: 10px 20px; color: white; border: none; border-radius: 5px; cursor: pointer; `;
  downloadButton.className = 'downloadButton';

  function replaceFilename(str) {
    const replaceMap = {'\\': '＼', '/': '／', ':': '꞉', '*': '＊', '?': '？', '"': '＂', '<': '＜', '>': '＞', '|': '￨'};
    return str.replace(/[\/\?:\|"*<>\\]/g, x => replaceMap[x]);
  }

  function getExt(url, contentType) {
    const mimeToExt = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm' };
    if (contentType && mimeToExt[contentType.toLowerCase()]) {
      return mimeToExt[contentType.toLowerCase()];
    }
    else {
      try {
        const pathname = new URL(url).pathname;
        const ext = pathname.split('.').pop().toLowerCase();
        if (ext && ext.match(/^[a-z0-9]+$/)) {
          return ext;
        }
      } catch (e) {
        console.log("error: " + e);
      }
    }
    return "jpg";
  }

  function configRender() {

    koneShortcutKeys = JSON.parse(localStorage.getItem("kone_koneshortcuts")) || defaultKoneShortcuts;
    Object.entries(koneShortcutKeys).forEach(([action, key]) => {
      let selector = "koneShortcutkey-" + action;
      if (action === "/") selector = "koneShortcutkey-\\" + action;
      const checkbox = document.querySelector(`input.${selector}`);
      checkbox.checked = key;
    });

    shortcutKeys = JSON.parse(localStorage.getItem("kone_shortcuts")) || defaultShortcuts;
    Object.entries(shortcutKeys).forEach(([action, key]) => {
      const keySpan = document.querySelector(`span.shortcutKey-${action}`);
      keySpan.textContent = `[ ${key || "비활성화"} ]`;
    });

    fileNames = JSON.parse(localStorage.getItem("kone_filenames")) || defaultFileNames;
    fileZipName = fileNames.fileZipName;
	  fileImageName = fileNames.fileImageName;
    fileZipNameInput.value = fileZipName;
    fileImageNameInput.value = fileImageName;

    settings = JSON.parse(localStorage.getItem("kone_settings")) || defaultSetting;
    shortcutsUse = settings.shortcutsUse;
    document.querySelector(`input[id = 'shortcutsUse-switch'`).checked = shortcutsUse;

    themaChangeColors = JSON.parse(localStorage.getItem("kone_themachangecolors")) || defaultThemaColors;
    rootStyleTag.textContent = "";
    Object.entries(themaChangeColors).forEach(([name, color]) => {
      const themaName = document.querySelector(`span.themaChange-${name}`);
      const themaColor = document.querySelector(`div.themaChange-${name}`);
      themaName.textContent = color;
      themaColor.style.background = color;
      document.documentElement.style.setProperty(name, color);
    });
  }

  const configSync = new BroadcastChannel("kone_config_channel");
  configSync.onmessage = (event) => {
    const configSyncMsg = event.data;
    if (configSyncMsg.type === "update_config") {
      configRender();
    }
  };

  let rootStyleTag = document.querySelector("style[data-theme-overwrite]");
  if (!rootStyleTag) {
    rootStyleTag = document.createElement("style");
    rootStyleTag.setAttribute("data-theme-overwrite", "true");
    rootStyleTag.textContent = `:root {\n}`;
    document.head.appendChild(rootStyleTag);
  }

  const configPanelStyle = document.createElement('style');
  configPanelStyle.textContent = ` .config-hover1, .config-hover2 { transition: background 0.2s ease; } .config-hover1:hover { background: #222 !important; } .config-hover2:hover { background: #666 !important; } input:checked + .config-switch { background: green !important; } input:checked + .config-switch span { transform: translateX(20px); } `;
  document.head.appendChild(configPanelStyle);

  const configPanelButton = document.createElement('button');
  configPanelButton.textContent = '⚙️';
  configPanelButton.style.cssText = ` cursor: pointer; font-size: 25px; `;
  configPanelButton.className = "configButton";

  configPanelButton.addEventListener("click", function () {
    configDiv.style.display = "block";
    document.body.style.overflow = "hidden";

    document.addEventListener("mousedown", closeConfigMousedown);
    document.addEventListener("keydown", closeConfigKeydown);
  });

  const configDiv = document.createElement("div");
  configDiv.style.cssText = ` position: fixed; width: 100vw; height: 100vh; display: none; z-index: 9600; user-select: none; color: white !important; `;
  configDiv.className = "configDiv";
  document.body.appendChild(configDiv);

  const configBackground = document.createElement("div");
  configBackground.style.cssText = ` background: black; opacity: 0.6; width: 100vw; height: 100vh; z-index: 9700; `;
  configDiv.appendChild(configBackground);

  const configPanel = document.createElement("div");
  configPanel.style.cssText = ` background: #333; border: 1px solid black; position: fixed; display: flex; top: 50%; left: 50%; width: 60vw; height: 75vh; min-width: 600px; min-height: 300px; transform: translate(-50%, -50%); padding: 5px 10px 10px 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; z-index: 9800; flex-direction: column; `;
  configDiv.appendChild(configPanel);

  const configForeground = document.createElement("div");
  configForeground.style.cssText = ` width: 100vw; height: 100vh; z-index: 9999; `;
  configDiv.appendChild(configForeground);

  const configPanelTitleBar = document.createElement("div");
  configPanelTitleBar.textContent = "설정";
  configPanelTitleBar.style.cssText = ` background: #333; border-bottom: 1px solid #888; display: flex; justify-content: space-between; padding: 10px; align-items: center; font-weight: bold; font-size: 25px; `;
  configPanel.appendChild(configPanelTitleBar);

  const configPanelTitleBarCloseButton = document.createElement("button");
  configPanelTitleBarCloseButton.style.cssText = ` display: flex; width: 45px; height: 45px; justify-content: center; align-items: center; cursor: pointer; font-size: 25px; border-radius: 50%; margin-right: 5px; `;
  configPanelTitleBarCloseButton.innerHTML = ` <svg class="svg-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2-1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6L199.4,255.4L68.4,386.5c-5.4,5.4-5.4,14.2,0,19.6l37.4,37.6c2.6,2.6,6.1,4,9.8,4c3.7,0,7.2-1.5,9.8-4l131.5-130.7l131.1,130.7c2.6,2.6,6.1,4,9.8,4c3.7,0,7.2-1.5,9.8-4l37.4-37.6c5.4-5.4,5.4-14.2,0-19.6L443.6,387.1z" fill="white"/></svg> `;
  configPanelTitleBarCloseButton.classList.add("config-hover2");
  configPanelTitleBar.appendChild(configPanelTitleBarCloseButton);

  configPanelTitleBarCloseButton.addEventListener("click", () => {
    configDiv.style.display = "none";
    document.body.style.overflow = "auto";

    document.removeEventListener("keydown", closeConfigKeydown);
    document.removeEventListener("mousedown", closeConfigMousedown);
  });

  const closeConfigMousedown = (event) => {
    if (waitingCheck) return;
    else if (fileNameInputDrop.style.display === "block") {
      if (!fileNameInputDrop.contains(event.target)) {
        fileNameInputDrop.style.display = "none";
        document.removeEventListener("keydown", closeConfigKeydown);
        document.removeEventListener("keydown", closeConfigMousedown);
      }
    }
    else if (configDiv.style.display === "block") {
      if (!configPanel.contains(event.target)) {
        configDiv.style.display = "none";
        document.body.style.overflow = "auto";
        fileZipName = fileZipNameInput.value;
        localStorage.setItem("kone_filename", fileZipNameInput.value);
        document.removeEventListener("keydown", closeConfigKeydown);
        document.removeEventListener("keydown", closeConfigMousedown);
      }
    }
  };
  const closeConfigKeydown = (event) => {
    if (waitingCheck) return;
    else if (configDiv.style.display === "block") {
      const key = event.key;
      if (key === "Escape") {
        if (fileNameInputDrop.style.display === "block") {
          fileNameInputDrop.style.display = "none";
          document.removeEventListener("keydown", closeConfigKeydown);
          document.removeEventListener("mousedown", closeConfigMousedown);
        }
        else {
          configDiv.style.display = "none";
          document.body.style.overflow = "auto";
          document.removeEventListener("keydown", closeConfigKeydown);
          document.removeEventListener("mousedown", closeConfigMousedown);
        }
      }
    }
  };

  const configPanelMainDiv = document.createElement("div");
  configPanelMainDiv.style.cssText = ` display: flex; flex: 1; overflow: hidden; `;
  configPanel.appendChild(configPanelMainDiv);

  const configContentPanels = {};

  const configMenuItems = ["단축키", "다운로드", "테마"];
  const contentCreators = {
    "단축키": () => {
      const panel = document.createElement("div");
      panel.appendChild(koneShortcutsContainer);
      panel.appendChild(shortcutsContainer);
      if (shortcutsUse) {
        shortcutsButtonContainer.style.display = "block";
        shortcutsResetButton.style.display = "block";
      }
      if (koneShortcutsUse) {
        koneShortcutsButtonContainer.style.display = "block";
        koneShortcutsResetButton.style.display = "block";
      }
      return panel;
    },
    "다운로드": () => {
      const panel = document.createElement("div");
      panel.appendChild(fileZipNameDiv);
      panel.appendChild(fileImageNameDiv);
      return panel;
    },
    "테마": () => {
      const panel = document.createElement("div");
      panel.appendChild(themaChangeDiv);
      if (themaChangeUse) {
        themaChangeButtonContainer.style.display = "block";
        themaChangeResetButton.style.display = "block";
      }
      return panel;
    }
  };

  const configContentPanelDiv = document.createElement("div");
  configContentPanelDiv.style.cssText = ` flex: 1; padding: 20px; overflow-y: auto; `;
  configPanelMainDiv.appendChild(configContentPanelDiv);

  const koneShortcutsContainer = document.createElement("div");
  koneShortcutsContainer.style.cssText = ` background: black; display: flex; flex-direction: column; padding: 3px; margin-bottom:20px; `;

  const koneShortcutsLabel = document.createElement("div");
  koneShortcutsLabel.textContent = "코네 단축키 설정";
  koneShortcutsLabel.style.cssText = ` width: 100%; height: 50px; display: flex; position: relative; align-items: center; padding: 0px 12px; font-weight: bold; font-size: 25px; `;
  koneShortcutsContainer.appendChild(koneShortcutsLabel);

  const koneShortcutsResetButton = document.createElement("button");
  koneShortcutsResetButton.style.cssText = ` display: flex; width: 45px; height: 45px; position: absolute; right: 135px; justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; display: none; `;
  koneShortcutsResetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
  koneShortcutsResetButton.classList.add("config-hover2");
  koneShortcutsLabel.appendChild(koneShortcutsResetButton);

  const koneShortcutsUseButton = document.createElement("button");
  koneShortcutsUseButton.classList.add("config-hover1");
  koneShortcutsUseButton.style.cssText = ` background: #333; border: 1px solid #555; border-radius: 20px; position: absolute; right: 10px; width: 120px; height: 35px; display: flex; cursor: pointer; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 18px; `;
  koneShortcutsLabel.appendChild(koneShortcutsUseButton);

  const koneShortcutsUseButtonLabel = document.createElement("span");
  koneShortcutsUseButtonLabel.textContent = "사용";
  koneShortcutsUseButtonLabel.style.cssText = `font-size: 20px; font-weight: bold;`;
  koneShortcutsUseButton.appendChild(koneShortcutsUseButtonLabel);

  const koneShortcutsUseCheck = document.createElement("input");
  koneShortcutsUseCheck.type = "checkbox";
  koneShortcutsUseCheck.id = "koneShortcutsUse-switch";
  koneShortcutsUseCheck.checked = koneShortcutsUse;
  koneShortcutsUseCheck.style.cssText = ` display: none; `;
  koneShortcutsUseButton.appendChild(koneShortcutsUseCheck);

  const koneShortcutsUseSwitchLabel = document.createElement("label");
  koneShortcutsUseSwitchLabel.htmlFor = "koneShortcutsUse-switch";
  koneShortcutsUseSwitchLabel.classList.add("config-switch", "config-hover2");
  koneShortcutsUseSwitchLabel.style.cssText = ` background: #303030;  border: 1px solid white; position: relative; width: 40px; height: 20px; border-radius: 20px; cursor: pointer; display: inline-block; margin-right: 4px; `;
  const koneShortcutsUseSwitchButton = document.createElement("span");
  koneShortcutsUseSwitchButton.style.cssText = ` background: #808080; position: absolute; top: 1px; left: 2px; width: 16px; height: 16px; border-radius: 50%; transition: transform 0.2s ease; `;
  koneShortcutsUseSwitchLabel.appendChild(koneShortcutsUseSwitchButton);
  koneShortcutsUseButton.appendChild(koneShortcutsUseSwitchLabel);

  const koneShortcutsButtonContainer = document.createElement("div");
  koneShortcutsButtonContainer.style.cssText = ` display: flex; flex-direction: column; display: none; `;
  koneShortcutsContainer.appendChild(koneShortcutsButtonContainer);

  Object.entries(koneShortcutKeys).forEach(([action, key]) => {

    const button = document.createElement("button");
    button.style.cssText = ` background: #333; border: 1px solid #555; display: flex; cursor: pointer; justify-content: space-between; align-items: center; width: 100%; padding: 8px 12px; font-size: 18px; `;
    button.classList.add("config-hover1");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = koneShortcutsToKorean[action] || action;
    nameSpan.style.cssText = `font-size: 20px; font-weight: bold;`;
    button.appendChild(nameSpan);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "koneShortcutkey-" + action;
    checkbox.classList.add("koneShortcutkey-" + action);
    checkbox.checked = key;
    checkbox.style.cssText = ` display: none; `;
    button.appendChild(checkbox);

    const switchLabel = document.createElement("label");
    switchLabel.htmlFor = "koneShortcutkey-" + action;
    switchLabel.classList.add("config-switch", "config-hover2");
    switchLabel.style.cssText = ` background: #303030;  border: 1px solid white; position: relative; width: 40px; height: 20px; border-radius: 20px; cursor: pointer; display: inline-block; margin-right: 4px; `;
    const switchButton = document.createElement("span");
    switchButton.style.cssText = ` background: #808080; position: absolute; top: 1px; left: 2px; width: 16px; height: 16px; border-radius: 50%; transition: transform 0.2s ease; `;
    switchLabel.appendChild(switchButton);
    button.appendChild(switchLabel);
    koneShortcutsButtonContainer.appendChild(button);

    function checkboxChange() {
      koneShortcutKeys[action] = checkbox.checked;
      localStorage.setItem("kone_koneshortcuts", JSON.stringify(koneShortcutKeys));
      configSync.postMessage({ type: "update_config" });
    }
    button.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      checkboxChange();
    });
    checkbox.addEventListener("change", function() {
      checkboxChange();
    });
  });

  const shortcutsContainer = document.createElement("div");
  shortcutsContainer.style.cssText = ` background: black; display: flex; flex-direction: column; padding: 3px; `;

  const shortcutsLabel = document.createElement("div");
  shortcutsLabel.textContent = "단축키 설정";
  shortcutsLabel.style.cssText = ` width: 100%; height: 50px; display: flex; position: relative; align-items: center; padding: 0px 12px; font-weight: bold; font-size: 25px; `;
  shortcutsContainer.appendChild(shortcutsLabel);

  const shortcutsResetButton = document.createElement("button");
  shortcutsResetButton.style.cssText = ` display: flex; width: 45px; height: 45px; position: absolute; right: 135px; justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; display: none; `;
  shortcutsResetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
  shortcutsResetButton.classList.add("config-hover2");
  shortcutsLabel.appendChild(shortcutsResetButton);

  const shortcutsUseButton = document.createElement("button");
  shortcutsUseButton.classList.add("config-hover1");
  shortcutsUseButton.style.cssText = ` background: #333; border: 1px solid #555; border-radius: 20px; position: absolute; right: 10px; width: 120px; height: 35px; display: flex; cursor: pointer; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 18px; `;
  shortcutsLabel.appendChild(shortcutsUseButton);

  const shortcutsUseButtonLabel = document.createElement("span");
  shortcutsUseButtonLabel.textContent = "사용";
  shortcutsUseButtonLabel.style.cssText = `font-size: 15; font-weight: bold;`;
  shortcutsUseButton.appendChild(shortcutsUseButtonLabel);

  const shortcutsUseCheck = document.createElement("input");
  shortcutsUseCheck.type = "checkbox";
  shortcutsUseCheck.id = "shortcutsUse-switch";
  shortcutsUseCheck.checked = shortcutsUse;
  shortcutsUseCheck.style.cssText = ` display: none; `;
  shortcutsUseButton.appendChild(shortcutsUseCheck);

  const shortcutsUseSwitchLabel = document.createElement("label");
  shortcutsUseSwitchLabel.htmlFor = "shortcutsUse-switch";
  shortcutsUseSwitchLabel.classList.add("config-switch", "config-hover2");
  shortcutsUseSwitchLabel.style.cssText = ` background: #303030;  border: 1px solid white; position: relative; width: 40px; height: 20px; border-radius: 20px; cursor: pointer; display: inline-block; margin-right: 10px; `;
  const shortcutsUseSwitchButton = document.createElement("span");
  shortcutsUseSwitchButton.style.cssText = ` background: #808080; position: absolute; top: 1px; left: 2px; width: 16px; height: 16px; border-radius: 50%; transition: transform 0.2s ease; `;
  shortcutsUseSwitchLabel.appendChild(shortcutsUseSwitchButton);
  shortcutsUseButton.appendChild(shortcutsUseSwitchLabel);

  const shortcutsButtonContainer = document.createElement("div");
  shortcutsButtonContainer.style.cssText = ` display: flex; flex-direction: column; display: none; `;
  shortcutsContainer.appendChild(shortcutsButtonContainer);

  Object.entries(shortcutKeys).forEach(([action, key]) => {

    const button = document.createElement("button");
    button.style.cssText = ` background: #333; border: 1px solid #555; display: flex; cursor: pointer; justify-content: space-between; align-items: center; width: 100%; padding: 8px 12px; font-size: 18px; `;
    button.classList.add("config-hover1");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = shortcutsToKorean[action] || action;
    nameSpan.style.cssText = `font-size: 20px; font-weight: bold;`;
    button.appendChild(nameSpan);

    const keySpan = document.createElement("span");
    keySpan.classList.add("shortcutKey-" + action);
    keySpan.textContent = `[ ${key || "비활성화"} ]`;
    button.appendChild(keySpan);
    shortcutsButtonContainer.appendChild(button);

    button.addEventListener("click", async () => {
      waitingCheck = action;
      keySpan.textContent = "[ 입력 대기 중... ]";
      const newKey = await waitForKeyInput();
      let keyCheck = false;
      if (newKey === null) {
        keySpan.textContent = `[ ${shortcutKeys[action] || "비활성화"} ]`;
        waitingCheck = null;
        return;
      }
      if (newKey === "DELETE") {
        waitingCheck = null;
        shortcutKeys[action] = null;
        keySpan.textContent = "[ 비활성화 ]";
      } else {
        for (const [otherAction, otherKey] of Object.entries(shortcutKeys)) {
          if (otherAction !== action && otherKey === newKey) {
            shortcutKeys[otherAction] = null;
            showToast(`[${shortcutsToKorean[otherAction]}] 키가 비활성화 되었습니다.`, "#400000");
            keyCheck = true;
            break;
          }
        }
        waitingCheck = null;
        shortcutKeys[action] = newKey;
        keySpan.textContent = `[ ${newKey} ]`;
      }
      localStorage.setItem("kone_shortcuts", JSON.stringify(shortcutKeys));
      configSync.postMessage({ type: "update_config" });
      if (keyCheck) configRender();
    });
  });

  const fileZipNameDiv = document.createElement("div");
  fileZipNameDiv.style.cssText = ` background: black; display: flex; flex-direction: column; padding: 3px; margin-bottom:20px; `;

  const fileZipNameDivLabel = document.createElement("div");
  fileZipNameDivLabel.textContent = "압축 파일명 변경";
  fileZipNameDivLabel.style.cssText = ` width: 100%; height: 50px; display: flex; position: relative; align-items: center; padding: 0px 12px; font-weight: bold; font-size: 25px; `;
  fileZipNameDiv.appendChild(fileZipNameDivLabel);

  const fileZipNameResetButton = document.createElement("button");
  fileZipNameResetButton.style.cssText = ` display: flex; width: 45px; height: 45px; position: absolute; right: 5px; justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; `;
  fileZipNameResetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
  fileZipNameResetButton.classList.add("config-hover2");
  fileZipNameDivLabel.appendChild(fileZipNameResetButton);

  const fileZipNameInputDiv = document.createElement("div");
  fileZipNameInputDiv.style.cssText = ` display: flex; flex-direction: column; position: relative; width: 100%; `;
  fileZipNameDiv.appendChild(fileZipNameInputDiv);

  const fileZipNameInput = document.createElement("input");
  fileZipNameInput.style.cssText = ` background: #333; border: 1px solid #555; width: 100%; height: 45px; font-size: 16px; padding: 8px 48px 8px 8px; box-sizing: border-box; font-size: 18px; `;
  fileZipNameInput.value = fileZipName;
  fileZipNameInput.classList.add("config-hover1");
  fileZipNameInputDiv.appendChild(fileZipNameInput);

  const fileZipNameDropButton = document.createElement("button");
  fileZipNameDropButton.style.cssText = ` display: flex; justify-content: center; align-items: center; width: 35px; height: 35px; position: absolute; top: 50%; right: 8px; transform: translateY(-50%); cursor: pointer; border-radius: 50%; `;
  fileZipNameDropButton.innerHTML = ` <svg class="svg-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M128 256h256M256 128v256" stroke="white" stroke-width="60" stroke-linecap="round"/></svg> `;
  fileZipNameDropButton.classList.add("config-hover2");
  fileZipNameInputDiv.appendChild(fileZipNameDropButton);

  const fileImageNameDiv = document.createElement("div");
  fileImageNameDiv.style.cssText = ` background: black; display: flex; flex-direction: column; padding: 3px; margin-bottom:20px; `;

  const fileImageNameDivLabel = document.createElement("div");
  fileImageNameDivLabel.textContent = "이미지 파일명 변경";
  fileImageNameDivLabel.style.cssText = ` width: 100%; height: 50px; display: flex; position: relative; align-items: center; padding: 0px 12px; font-weight: bold; font-size: 25px; `;
  fileImageNameDiv.appendChild(fileImageNameDivLabel);

  const fileImageNameResetButton = document.createElement("button");
  fileImageNameResetButton.style.cssText = ` display: flex; width: 45px; height: 45px; position: absolute; right: 5px; justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; `;
  fileImageNameResetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
  fileImageNameResetButton.classList.add("config-hover2");
  fileImageNameDivLabel.appendChild(fileImageNameResetButton);

  const fileImageNameInputDiv = document.createElement("div");
  fileImageNameInputDiv.style.cssText = ` display: flex; flex-direction: column; position: relative; width: 100%; `;
  fileImageNameDiv.appendChild(fileImageNameInputDiv);

  const fileImageNameInput = document.createElement("input");
  fileImageNameInput.style.cssText = ` background: #333; border: 1px solid #555; width: 100%; height: 45px; font-size: 16px; padding: 8px 48px 8px 8px; box-sizing: border-box; font-size: 18px; `;
  fileImageNameInput.value = fileImageName;
  fileImageNameInput.classList.add("config-hover1");
  fileImageNameInputDiv.appendChild(fileImageNameInput);

  const fileImageNameDropButton = document.createElement("button");
  fileImageNameDropButton.style.cssText = ` display: flex; justify-content: center; align-items: center; width: 35px; height: 35px; position: absolute; top: 50%; right: 8px; transform: translateY(-50%); cursor: pointer; border-radius: 50%; `;
  fileImageNameDropButton.innerHTML = ` <svg class="svg-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M128 256h256M256 128v256" stroke="white" stroke-width="60" stroke-linecap="round"/></svg> `;
  fileImageNameDropButton.classList.add("config-hover2");
  fileImageNameInputDiv.appendChild(fileImageNameDropButton);

  const fileNameInputDrop = document.createElement("div");
  fileNameInputDrop.style.cssText = ` background: #333; border: 1px solid #555; display: none; position: absolute; border-radius: 6px; z-index: 9950; `;
  configForeground.appendChild(fileNameInputDrop);

  const fileNameInputDropItems = [ { label: "카테고리", value: "%category%" }, { label: "제목", value: "%title%" }, { label: "게시물 번호", value: "%num%" }, { label: "채널명", value: "%channel%" }, ];
  fileNameInputDropItems.forEach((Item, index, array) => {
    const option = document.createElement("div");
    option.textContent = Item.label;
    option.classList.add("config-hover1");
    option.style.cssText = `padding: 6px 12px; cursor: pointer; font-size: 14px;${index !== array.length - 1 ? ' border-bottom: 1px solid #555;' : ''}`;
    fileNameInputDrop.appendChild(option);
  });

  const themaChangeDiv = document.createElement("div");
  themaChangeDiv.style.cssText = ` background: black; display: flex; flex-direction: column; padding: 3px; margin-bottom:20px; `;

  const themaChangeDivLabel = document.createElement("div");
  themaChangeDivLabel.textContent = "테마 변경";
  themaChangeDivLabel.style.cssText = ` width: 100%; height: 50px; display: flex; position: relative; align-items: center; padding: 0px 12px; font-weight: bold; font-size: 25px; `;
  themaChangeDiv.appendChild(themaChangeDivLabel);

  const themaChangeResetButton = document.createElement("button");
  themaChangeResetButton.style.cssText = ` display: flex; width: 45px; height: 45px; position: absolute; right: 135px; justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; display: none; `;
  themaChangeResetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
  themaChangeResetButton.classList.add("config-hover2");
  themaChangeDivLabel.appendChild(themaChangeResetButton);

  const themaChangeUseButton = document.createElement("button");
  themaChangeUseButton.classList.add("config-hover1");
  themaChangeUseButton.style.cssText = ` background: #333; border: 1px solid #555; border-radius: 20px; position: absolute; right: 10px; width: 120px; height: 35px; display: flex; cursor: pointer; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 18px; `;
  themaChangeDivLabel.appendChild(themaChangeUseButton);

  const themaChangeUseButtonLabel = document.createElement("span");
  themaChangeUseButtonLabel.textContent = "사용";
  themaChangeUseButtonLabel.style.cssText = `font-size: 20px; font-weight: bold;`;
  themaChangeUseButton.appendChild(themaChangeUseButtonLabel);

  const themaChangeUseCheck = document.createElement("input");
  themaChangeUseCheck.type = "checkbox";
  themaChangeUseCheck.id = "themaChangeUse-switch";
  themaChangeUseCheck.checked = themaChangeUse;
  themaChangeUseCheck.style.cssText = ` display: none; `;
  themaChangeUseButton.appendChild(themaChangeUseCheck);

  const themaChangeUseSwitchLabel = document.createElement("label");
  themaChangeUseSwitchLabel.htmlFor = "themaChangeUse-switch";
  themaChangeUseSwitchLabel.classList.add("config-switch", "config-hover2");
  themaChangeUseSwitchLabel.style.cssText = ` background: #303030;  border: 1px solid white; position: relative; width: 40px; height: 20px; border-radius: 20px; cursor: pointer; display: inline-block; margin-right: 4px; `;
  const themaChangeUseSwitchButton = document.createElement("span");
  themaChangeUseSwitchButton.style.cssText = ` background: #808080; position: absolute; top: 1px; left: 2px; width: 16px; height: 16px; border-radius: 50%; transition: transform 0.2s ease; `;
  themaChangeUseSwitchLabel.appendChild(themaChangeUseSwitchButton);
  themaChangeUseButton.appendChild(themaChangeUseSwitchLabel);

  const themaChangeButtonContainer = document.createElement("div");
  themaChangeButtonContainer.style.cssText = ` display: flex; flex-direction: column; display: none; `;
  themaChangeDiv.appendChild(themaChangeButtonContainer);

  Object.entries(themaChangeColors).forEach(([name, defaultColor]) => {

    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("config-hover1");
    button.style.cssText = ` background: #333; border: 1px solid #555; display: flex; cursor: pointer; justify-content: space-between; align-items: center; width: 100%; padding: 8px 12px; font-size: 18px; `;
    themaChangeButtonContainer.appendChild(button);

    const preview = document.createElement("div");
    preview.style.cssText = ` display: inline-flex; align-items: center; gap: 6px; `;
    button.appendChild(preview);

    const colorBox = document.createElement("div");
    colorBox.classList.add("themaChange-" + name);
    colorBox.style.cssText = ` background: ${defaultColor}; border: 1px solid #999; width: 20px; height: 20px; border-radius: 4px; `;
    preview.appendChild(colorBox);

    const colorCode = document.createElement("span");
    colorCode.textContent = defaultColor;
    colorCode.classList.add("themaChange-" + name);
    colorCode.style.fontSize = "14px";
    preview.appendChild(colorCode);

    const resetButton = document.createElement("button");
    resetButton.style.cssText = ` width: 30px; height: 30px; cursor: pointer; border-radius: 50%; `;
    resetButton.innerHTML = ` <svg class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden; margin: auto;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M524.8 106.666667c-106.666667 0-209.066667 42.666667-285.866667 110.933333l-8.533333-68.266667c0-25.6-21.333333-42.666667-46.933333-38.4-25.6 0-42.666667 21.333333-38.4 46.933334l8.533333 115.2c4.266667 55.466667 51.2 98.133333 106.666667 98.133333h8.533333L384 362.666667c25.6 0 42.666667-21.333333 38.4-46.933334 0-25.6-21.333333-42.666667-46.933333-38.4l-85.333334 4.266667c64-55.466667 145.066667-89.6 230.4-89.6 187.733333 0 341.333333 153.6 341.333334 341.333333s-153.6 341.333333-341.333334 341.333334-341.333333-153.6-341.333333-341.333334c0-25.6-17.066667-42.666667-42.666667-42.666666s-42.666667 17.066667-42.666666 42.666666c0 234.666667 192 426.666667 426.666666 426.666667s426.666667-192 426.666667-426.666667c4.266667-234.666667-187.733333-426.666667-422.4-426.666666z"/></svg> `;
    resetButton.classList.add("config-hover2");
    preview.appendChild(resetButton);

    button.addEventListener("click", () => {

      const fallbackColor = colorCode.textContent.startsWith("#") ? colorCode.textContent : "#ffffff";

      const themaChangeColorPickerOverlay = document.createElement("div");
      themaChangeColorPickerOverlay.style.cssText = ` position: fixed; width: 100vw; height: 100vh; z-index: 9998; user-select: none; color: white !important; `;
      document.body.appendChild(themaChangeColorPickerOverlay);

      const themaChangeColorPickerDiv = document.createElement("div");
      themaChangeColorPickerDiv.style.cssText = ` background: #808080; border: 1px solid #000; padding: 8px; width: fit-content; position: fixed; left: 20px; top: 30%; display: flex; gap: 8px; align-items: center; border-radius: 6px; z-index: 9999; `;
      document.body.appendChild(themaChangeColorPickerDiv);

      const themaChangeColorPicker = document.createElement("input");
      themaChangeColorPicker.type = "color";
      themaChangeColorPicker.style.cssText = ` width: 40px; height: 40px; cursor: pointer; `;
      themaChangeColorPickerDiv.appendChild(themaChangeColorPicker);

      const themaChangeColorPickerOkButton = document.createElement("button");
      themaChangeColorPickerOkButton.textContent = "확인";
      themaChangeColorPickerOkButton.style.cssText = ` background: #303030; color: white; border: 1px solid #000; padding: 6px 10px; cursor: pointer; font-size: 14px; border-radius: 4px; `;
      themaChangeColorPickerDiv.appendChild(themaChangeColorPickerOkButton);

      const themaChangeColorPickerCancleButton = document.createElement("button");
      themaChangeColorPickerCancleButton.textContent = "취소";
      themaChangeColorPickerCancleButton.style.cssText = ` background: #303030; color: white; border: 1px solid #000; padding: 6px 10px; cursor: pointer; font-size: 14px; border-radius: 4px; `;
      themaChangeColorPickerDiv.appendChild(themaChangeColorPickerCancleButton);

      themaChangeColorPicker.value = fallbackColor;
      configDiv.style.display = "none";

      const removeThemaChangeColorPicker = (event) => {
        const key = event.key;
        if (key === "Escape") {
          themaChangeColorPickerCancleButton.click();
        }
      };

      themaChangeColorPicker.oninput = () => {
        const newColor = themaChangeColorPicker.value;
        rootStyleTag.textContent = `:root { ${((rootStyleTag.textContent.match(/:root\s*{([^}]*)}/)?.[1] || "").replace(new RegExp(`--${name.slice(2)}\\s*:\\s*[^;]+;?`, "g"), "").split(";").map(s => s.trim()).filter(Boolean).concat(`${name}: ${newColor}`)).join("; ")}; }`;
        document.documentElement.style.setProperty(name, newColor);
      };

      themaChangeColorPickerOkButton.addEventListener("click", () => {

        const newColor = themaChangeColorPicker.value;

        themaChangeColorPickerOverlay.remove();
        themaChangeColorPickerDiv.remove();
        configDiv.style.display = "block";
        document.removeEventListener("keydown", removeThemaChangeColorPicker);

        rootStyleTag.textContent = `:root { ${((rootStyleTag.textContent.match(/:root\s*{([^}]*)}/)?.[1] || "").replace(new RegExp(`--${name.slice(2)}\\s*:\\s*[^;]+;?`, "g"), "").split(";").map(s => s.trim()).filter(Boolean).concat(`${name}: ${newColor}`)).join("; ")}; }`;
        colorBox.style.background = newColor;
        colorCode.textContent = newColor;
        themaChangeColors[name] = newColor;
        localStorage.setItem("kone_themachangecolors", JSON.stringify(themaChangeColors));
        configSync.postMessage({ type: "update_config" });
      });

      themaChangeColorPickerCancleButton.addEventListener("click", () => {

        themaChangeColorPickerOverlay.remove();
        themaChangeColorPickerDiv.remove();
        configDiv.style.display = "block";
        document.removeEventListener("keydown", removeThemaChangeColorPicker);

        rootStyleTag.textContent = `:root { ${((rootStyleTag.textContent.match(/:root\s*{([^}]*)}/)?.[1] || "").replace(new RegExp(`--${name.slice(2)}\\s*:\\s*[^;]+;?`, "g"), "").split(";").map(s => s.trim()).filter(Boolean).concat(`${name}: ${fallbackColor}`)).join("; ")}; }`;
        document.documentElement.style.setProperty(name, fallbackColor);
      });
      document.addEventListener("keydown", removeThemaChangeColorPicker);
    });

    resetButton.addEventListener("click", (e) => {

      e.stopPropagation();

      colorBox.style.background = defaultThemaColors[name];
      colorCode.textContent = defaultThemaColors[name];
      themaChangeColors[name] = defaultThemaColors[name];
      localStorage.setItem("kone_themachangecolors", JSON.stringify(themaChangeColors));
      configSync.postMessage({ type: "update_config" });
      document.documentElement.style.setProperty(name, defaultThemaColors[name]);
    });
  });

  function waitForKeyInput() {
    return new Promise((resolve) => {
      function waitClean() {
        document.removeEventListener("keypress", onKeyPress);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("mousedown", onClickOutside);
      }
      function onKeyDown(event) {
        event.preventDefault();
        const key = event.key;
        if (key === "Escape") {
          waitClean();
          resolve(null);
        } else {
          waitClean();
          resolve(key.toUpperCase());
        }
      }
      function onKeyPress(event) {
        event.preventDefault();
        const key = event.key;
        if (key === "Escape") {
          waitClean();
          resolve(null);
        } else {
          waitClean();
          resolve(key.toUpperCase());
        }
      }
      function onClickOutside() {
        waitClean();
        resolve(null);
      }
      document.addEventListener("keypress", onKeyPress);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClickOutside);
    });
  };

  let currentInput = null;
  [fileZipNameDropButton, fileImageNameDropButton].forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const input = index === 0 ? fileZipNameInput : fileImageNameInput;
      const rect = button.getBoundingClientRect();
      fileNameInputDrop.style.display = fileNameInputDrop.style.display === "block" ? "none" : "block";
      fileNameInputDrop.style.top = `${e.clientY + window.scrollY}px`;
      fileNameInputDrop.style.left = `${e.clientX + window.scrollX}px`;
      currentInput = input;
    });
  });

  fileNameInputDrop.addEventListener("click", (e) => {
    if (e.target.classList.contains("config-hover1")) {
      const selectedValue = fileNameInputDropItems.find(item => item.label === e.target.textContent).value;
      const cursorPos = currentInput.selectionStart;
      const value = currentInput.value;
      currentInput.value = value.slice(0, cursorPos) + selectedValue + value.slice(cursorPos);
      currentInput.focus();
      currentInput.selectionEnd = cursorPos + selectedValue.length;
      fileNameInputDrop.style.display = "none";
      currentInput = null;
    }
  });

  fileZipNameInput.addEventListener("blur", function(event) {
    fileZipName = fileZipNameInput.value;
	  fileNames.fileZipName = fileZipNameInput.value;
    localStorage.setItem('kone_filenames', JSON.stringify(fileNames));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  fileImageNameInput.addEventListener("blur", function(event) {
    fileImageName = fileImageNameInput.value;
	  fileNames.fileImageName = fileImageNameInput.value;
    localStorage.setItem('kone_filenames', JSON.stringify(fileNames));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  koneShortcutsResetButton.addEventListener("click", () => {
    koneShortcutKeys = { ...defaultKoneShortcuts };
    localStorage.setItem('kone_koneshortcuts', JSON.stringify(koneShortcutKeys));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  shortcutsResetButton.addEventListener("click", () => {
    shortcutKeys = { ...defaultShortcuts };
    localStorage.setItem('kone_shortcuts', JSON.stringify(shortcutKeys));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  fileZipNameResetButton.addEventListener("click", () => {
    fileZipName = defaultFileNames.fileZipName;
	  fileNames.fileZipName = fileZipName;
    localStorage.setItem('kone_filenames', JSON.stringify(fileNames));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  fileImageNameResetButton.addEventListener("click", () => {
    fileImageName = defaultFileNames.fileImageName;
	  fileNames.fileImageName = fileImageName;
    localStorage.setItem('kone_filenames', JSON.stringify(fileNames));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  themaChangeResetButton.addEventListener("click", () => {
    themaChangeColors = { ...defaultThemaColors };
    localStorage.setItem('kone_themachangecolors', JSON.stringify(themaChangeColors));
    configRender();
    configSync.postMessage({ type: "update_config" });
  });

  function shortcutsUseChange() {
    shortcutsUse = shortcutsUseCheck.checked;
    settings.shortcutsUse = shortcutsUse;
    localStorage.setItem("kone_settings", JSON.stringify(settings));
    configSync.postMessage({ type: "update_config" });
    if (shortcutsUse) {
      shortcutsButtonContainer.style.display = "block";
      shortcutsResetButton.style.display = "block";
    }
    else {
      shortcutsButtonContainer.style.display = "none";
      shortcutsResetButton.style.display = "none";
    }
  }
  shortcutsUseButton.addEventListener("click", () => {
    shortcutsUseCheck.checked = !shortcutsUseCheck.checked;
    shortcutsUseChange();
  });
  shortcutsUseCheck.addEventListener("change", function() {
    shortcutsUseChange();
  });

  function koneShortcutsUseChange() {
    koneShortcutsUse = koneShortcutsUseCheck.checked;
    settings.koneShortcutsUse = koneShortcutsUse;
    localStorage.setItem("kone_settings", JSON.stringify(settings));
    configSync.postMessage({ type: "update_config" });
    if (koneShortcutsUse) {
      koneShortcutsButtonContainer.style.display = "block";
      koneShortcutsResetButton.style.display = "block";
    }
    else {
      koneShortcutsButtonContainer.style.display = "none";
      koneShortcutsResetButton.style.display = "none";
    }
  }
  koneShortcutsUseButton.addEventListener("click", () => {
    koneShortcutsUseCheck.checked = !koneShortcutsUseCheck.checked;
    koneShortcutsUseChange();
  });
  koneShortcutsUseCheck.addEventListener("change", function() {
    koneShortcutsUseChange();
  });

  function themaChangeUseChange() {
    themaChangeUse = themaChangeUseCheck.checked;
    settings.themaChangeUse = themaChangeUse;
    localStorage.setItem("kone_settings", JSON.stringify(settings));
    configSync.postMessage({ type: "update_config" });
    if (themaChangeUse) {
      themaChangeButtonContainer.style.display = "block";
      themaChangeResetButton.style.display = "block";
    }
    else {
      themaChangeButtonContainer.style.display = "none";
      themaChangeResetButton.style.display = "none";
    }
  }
  themaChangeUseButton.addEventListener("click", () => {
    themaChangeUseCheck.checked = !themaChangeUseCheck.checked;
    themaChangeUseChange();
  });
  themaChangeUseCheck.addEventListener("change", function() {
    themaChangeUseChange();
  });

  const configMenuPanel = document.createElement("div");
  let configMenuPanelWidth = 100;
  configMenuPanel.style.cssText = ` border-right: 1px solid #ccc; position: relative; width: ${configMenuPanelWidth}px; overflow-y: auto; `;
  configPanelMainDiv.insertBefore(configMenuPanel, configContentPanelDiv);

  const configMenuList = document.createElement("ul");
  configMenuList.style.cssText = `list-style: none;`;
  configMenuPanel.appendChild(configMenuList);

  configMenuItems.forEach((item, index) => {

    const li = document.createElement("li");
    li.textContent = item;
    li.style.cssText = ` padding: 10px; cursor: pointer; border-bottom: 1px solid #eee; ${index === 0 ? "background: #555555;" : ""} `;
    configMenuList.appendChild(li);
    li.classList.add("config-hover1");

    const configContentPanel = document.createElement("div");
    configContentPanel.style.cssText = `display: ${index === 0 ? "block" : "none"};`;
    configContentPanel.appendChild(contentCreators[item]());
    configContentPanels[item] = configContentPanel;
    configContentPanelDiv.appendChild(configContentPanel);

    li.onclick = () => {
      configMenuList.querySelectorAll("li").forEach(el => el.style.background = "");
      li.style.background = "#555555";
      Object.values(configContentPanels).forEach(panel => panel.style.display = "none");
      configContentPanels[item].style.display = "block";
    };
  });

  const configMenuDragHandle = document.createElement("div");
  let configMenuDragging = false;
  configMenuDragHandle.style.cssText = ` background: #808080; position: absolute; right: 0; top: 0; width: 5px; height: 100%; cursor: col-resize; `;
  configMenuPanel.appendChild(configMenuDragHandle);

  function configMenuDragonMouseMove(e) {
    if (configMenuDragging) {
      const panelRect = configPanel.getBoundingClientRect();
      const newWidth = e.clientX - panelRect.left;
      if (newWidth >= 100 && newWidth <= panelRect.width * 0.5) {
        configMenuPanelWidth = newWidth;
        configMenuPanel.style.width = `${configMenuPanelWidth}px`;
      }
    }
  }
  function configMenuDragonMouseUp() {
    configMenuDragging = false;
    document.removeEventListener("mousemove", configMenuDragonMouseMove);
    document.removeEventListener("mouseup", configMenuDragonMouseUp);
  }

  configMenuDragHandle.addEventListener("mousedown", (e) => {
    configMenuDragging = true;
    document.addEventListener("mousemove", configMenuDragonMouseMove);
    document.addEventListener("mouseup", configMenuDragonMouseUp);
  });

  const targetNode = document.querySelector('#__next') || document.body;
  const nextObs = new MutationObserver((mutations, obs) => {
    if (!document.querySelector("button.configButton")) {
      initObserver();
    }
    if (/^https:\/\/kone\.gg\/s\/[^\/]+\/[^\/\?]+(\?.+)?$/.test(window.location.href) && !document.querySelector("button.downloadButton")) {
      downloadButtonObserver();
    }
  });
  nextObs.observe(targetNode, { childList: true, subtree: true });

  function initObserver() {
    if (!document.querySelector("button.configButton")) {
      const initObs = new MutationObserver((mutations, obs) => {
        nevbar = document.querySelector('header.sticky.top-0.z-50.border-b');
        if (nevbar && nevbar.querySelector('div > div')){
          const configPanelButtonTarget = nevbar.querySelector('div > div.gap-2 > a');
          configPanelButtonTarget.insertAdjacentElement('beforebegin', configPanelButton);
          if (nevbar.querySelector("button.configButton")) {
            if (!document.querySelector('body div.configDiv')) {
              document.body.appendChild(configDiv);
            }
            configRender();
            obs.disconnect();
          }
        }
      });
      initObs.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  function downloadButtonObserver() {
    if (/^https:\/\/kone\.gg\/s\/[^\/]+\/[^\/\?]+(\?.+)?$/.test(window.location.href)) {
      downloadButton.disabled = false;
      downloadButton.innerText = '이미지 다운로드';
      downloadButton.style.cursor = 'pointer';
      downloadButton.style.opacity = '1';
      const downloadButtonObs = new MutationObserver((mutations, obs) => {
        activePost("rate");
        if (rateUpButton) {
          rateUpButton.parentElement.insertAdjacentElement('afterend', downloadButton);
          obs.disconnect();
        }
      });
      downloadButtonObs.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  injectJSZip(() => {
    function fetchImageAsBlob(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'blob',
          onload: res => {
            const contentType = res.responseHeaders.split('\r\n').find(h => h.toLowerCase().startsWith('content-type:'))?.split(':')[1]?.trim() || '';
            if (res.response && res.response.size > 0) {
              resolve({ blob: res.response, contentType });
            } else {
              reject(new Error('빈 blob 또는 실패'));
            }
          },
          onerror: err => reject(err)
        });
      });
    }
    async function downloadImages(toast) {
      let category = "None";
      if (activePostCategory) {
        category = replaceFilename(activePostCategory.textContent);
      }
      const title = replaceFilename(activePostTitle.textContent);
      const num = replaceFilename(activePostNum[1]);
      const channel = replaceFilename(channelHref.textContent);
      const imageNameTemp = fileImageName.replace(/%category%/g, category).replace(/%title%/g, title).replace(/%num%/g, num).replace(/%channel%/g, channel);
      const imageName = replaceFilename(imageNameTemp);
      const zipNameTemp = fileZipName.replace(/%category%/g, category).replace(/%title%/g, title).replace(/%num%/g, num).replace(/%channel%/g, channel);
      const zipName = replaceFilename(zipNameTemp);

      downloadButton.disabled = true;
      downloadButton.innerText = "다운로드 중...";
      downloadButton.style.cursor = 'not-allowed';
      downloadButton.style.opacity = '0.6';

      const images = document.querySelector('div.relative.min-h-60 div.prose-container').shadowRoot.querySelectorAll('img[src]');
      toast.textContent = `[이동 가능] ${truncateMessage(title, 18)} (0 / ${images.length})`;
      toast.style.background = "#003000";
      if (images.length===0) {
        downloadButton.disabled = true;
        downloadButton.innerText = '이미지 없음';
        downloadButton.style.cursor = 'not-allowed';
        downloadButton.style.opacity = '0.6';
        throw new Error('이미지 없음');
      }
      setTimeout(() => {
        downloadButton.disabled = false;
        downloadButton.innerText = '이미지 다운로드';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.opacity = '1';
      }, 1000);

      const zip = new unsafeWindow.JSZip();
      let successCount = 0;

      for (let i=0; i < images.length; i++) {
        const img_url=images[i].src;
        try {
          const { blob , contentType } = await fetchImageAsBlob(img_url);
          const ext = getExt(img_url, contentType);
          const numberIndex = String(i + 1).padStart(4, "0");
          const fileImageName = `${imageName}_${numberIndex}.${ext}`;
          zip.file(fileImageName, blob);
          successCount++;
          toast.textContent = `[이동 가능] ${truncateMessage(title, 18)} (${successCount} / ${images.length})`;
        } catch (e) {
          console.log(`${zipName} 추가 실패`, e);
        }
      }
      if (successCount === 0) {
        console.log(`이미지 로딩 실패`);
        return;
      }

      try {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');

        toast.textContent = `[이동 가능] ${truncateMessage(title, 18)} (압축 중)`;
        toast.style.background = "#005000";

        link.href = zipUrl;
        link.download = `${zipName}.zip`;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(zipUrl);
        }, 1000);
      } catch (err) {
        throw new Error(`압축 실패 : ${err.message}`);
      }
    }
    downloadButton.addEventListener('click', () => {
      activePost("article");
      title = truncateMessage(replaceFilename(activePostTitle.textContent), 18);
      const toast = showToast(title, null, (toast) => {
        return new Promise((resolve, reject) => {
          downloadImages(toast)
            .then(() => resolve())
            .catch(err => reject(err));
        });
      });
    });
  });


  (function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function(...args) {
      const result = pushState.apply(history, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    history.replaceState = function(...args) {
      const result = replaceState.apply(history, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('hashchange', () => {
      window.dispatchEvent(new Event('locationchange'));
    });
  })(window.history);

  window.addEventListener('locationchange', function() {
    initObserver();
    downloadButtonObserver();
  });

  function activePost(type = null) {
    if (type === "articleMove") {
      activePostCheck = false; activePostIndex = 0;
      channelHref = document.querySelector('div.flex.grow.items-start div div a:has(h1)');
      allArticlePost = document.querySelectorAll("div.grow.flex.flex-col.rounded-b-lg div.grow div.grow div div a");
      if (allArticlePost.length === 0) allArticlePost = document.querySelectorAll("div.grow.flex.flex-col.rounded-b-lg div.grow div.grow div a");
      articleList = document.querySelector("div.grow.flex.flex-col.rounded-b-lg");
      pagInation = document.querySelector('nav a[data-active="true"]');
      activePostNum = window.location.href.match(/^https:\/\/kone\.gg\/s\/[^\/]+\/([^\/\?\#]+)/);
      if (allArticlePost && activePostNum) {
        for (const post of allArticlePost) {
          if (activePostCheck) {
            break;
          }
          if (post.href.includes(activePostNum[1])) {
            activePostCheck = true;
          }
          else {
            activePostIndex++;
          }
        }
      }
    }
    else if (type === "article") {
      channelHref = document.querySelector('div.flex.grow.items-start div div a:has(h1)');
      activePostTitle = document.querySelector("h1.flex.items-center.gap-1\\.5.py-2.text-2xl.font-bold");
      activePostCategory = document.querySelector('span[data-slot="badge"]');
      activePostNum = window.location.href.match('^https:\/\/kone\.gg\/s\/[^\/]+\/([^\/\?\#]+)');
    }
    else if (type === "scroll") {
      articleSection = document.querySelector('#article');
      commentSection = document.querySelector('#comment');
      articlelistSection = document.querySelector('#posts');
      commentList = document.querySelector("h2.p-4.text-lg.font-medium");
      writePostButton = Array.from(document.querySelectorAll('button[data-slot="button"]')).find(btn => btn.textContent.trim() === "글쓰기");
    }
    else if (type === "rate") {
      rateUpButton = document.querySelector('button[data-slot="button"]:has(svg.size-4[icon-name="upvote-outline"])');
      rateDownButton = document.querySelector('button[data-slot="button"]:has(svg.size-4[icon-name="downvote-outline"])');
    }
    else if (type === "changeSub") {
      subCategory = document.querySelector('div.overflow-hidden div.flex button.\\!border-transparent');
    }
    else if (type === "subMove") {
      activeSubCheck = false; activeSubIndex = 0;
      allSubscribeSub = document.querySelectorAll('div.overflow-hidden div:not([class]) a');
      if (allSubscribeSub) {
        const activeSub = window.location.href.match(/s\/([^\/?#]+)/);
        if (activeSub) {
          for (const sub of allSubscribeSub) {
            if (activeSubCheck) {
              break;
            }
            if (sub.href.includes(activeSub[0])) {
              activeSubCheck = true;
            }
            else {
              activeSubIndex++;
            }
          }
        }
        else {
          activeSubIndex = -1;
        }
      }
    }
    else if (type === "themaChange") {
      nevbar = document.querySelector('header.sticky.top-0.z-50.border-b');
    }
  }

  window.addEventListener("load", function () {

    initObserver();
    downloadButtonObserver();

    ['keydown'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        if (event.target.matches('input, textarea, [contenteditable]')) return;
        const key = event.key.toUpperCase();
        if (shortcutsUse && !waitingCheck && configDiv.style.display !== "block") {
          if ((event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) || /write#editor?$/.test(window.location.href)) return;

          if (key === shortcutKeys.scrollTop) {
            window.scrollTo(0, 0);
          }

          else if (key === shortcutKeys.scrollBottom) {
            window.scrollTo(0, document.documentElement.scrollHeight);
          }

          else if (key === shortcutKeys.refresh) {
            window.location.reload();
          }

          else if (key === shortcutKeys.changeSub) {
            activePost("changeSub");
            subCategory.click();
          }

          else if (key === shortcutKeys.prevSub) {
            activePost("subMove");
            if (!allSubscribeSub) {
              showToast("목록에 서브가 없습니다.", "#400000");
            }
            else if (activeSubIndex === -1) {
              allSubscribeSub[allSubscribeSub.length - 1].click();
            }
            else if (activeSubIndex === 0) {
              showToast("첫 서브입니다.", "#400000");
            }
            else if (activeSubIndex) {
              allSubscribeSub[activeSubIndex - 1].click();
            }
          }

          else if (key === shortcutKeys.nextSub) {
            activePost("subMove");
            if (!allSubscribeSub) {
              showToast("목록에 서브가 없습니다.", "#400000");
            }
            else if (activeSubIndex === -1) {
              allSubscribeSub[0].click();
            }
            else if (activeSubIndex === allSubscribeSub.length - 1) {
              showToast("마지막 서브입니다.", "#400000");
            }
            else if (activeSubIndex !== -1) {
              allSubscribeSub[activeSubIndex + 1].click();
            }
          }

          if (/^https:\/\/kone\.gg\/s\/[^\/]+\/?$/.test(window.location.href))
          {

            if (key === shortcutKeys.scrollToArticles) {
              activePost("scroll");
              articlelistSection.scrollIntoView();
            }

            else if (key === shortcutKeys.prevPost) {
              activePost("articleMove");
              if (pagInation.textContent !== "1") {
                pagInation.previousElementSibling.click();
              } else {
                showToast("첫 페이지입니다.", "#400000");
              }
            }

            else if (key === shortcutKeys.nextPost) {
              activePost("articleMove");
              if (allArticlePost.length - 1 === 29) {
                pagInation.nextElementSibling.click();
              } else {
                showToast("마지막 페이지입니다.", "#400000");
              }
            }
          }

          if (/^https:\/\/kone\.gg\/s\/[^\/\?]+(\?.*)?/.test(window.location.href))
          {

            if (key === shortcutKeys.writePost) {
              activePost("scroll");
              writePostButton.click();
            }

            else if (key === shortcutKeys.channelMove) {
              activePost("articleMove");
              channelHref.click();
            }
          }

          if (/^https:\/\/kone\.gg\/s\/[^\/]+\/[^\/\?]+(\?.+)?$/.test(window.location.href))
          {

            if (key === shortcutKeys.scrollToArticles) {
              activePost("scroll");
              articlelistSection.scrollIntoView();
            }

            else if (key === shortcutKeys.prevPost) {
              activePost("articleMove");
              if (isMoveArticlePrevious) {
                isMoveArticlePrevious = false;
                allArticlePost[allArticlePost.length - 1].click();
              }
              else if (activePostIndex === 0) {
                if (pagInation.textContent !== "1") {
                  isMoveArticlePrevious = true;
                  pagInation.previousElementSibling.click();
                }
                else {
                  showToast("첫 게시글입니다.", "#400000");
                }
              }
              else if (activePostCheck) {
                allArticlePost[activePostIndex - 1].click();
                window.scrollTo(0, 0);
              }
            }

            else if (key === shortcutKeys.nextPost) {
              activePost("articleMove");
              if (isMoveArticleNext) {
                isMoveArticleNext = false;
                allArticlePost[0].click();
              }
              else if (activePostIndex === allArticlePost.length - 1 && activePostCheck && allArticlePost.length - 1 === 29) {
                isMoveArticleNext = true;
                pagInation.nextElementSibling.click();
              }
              else if (activePostCheck && activePostIndex < allArticlePost.length - 1) {
                allArticlePost[activePostIndex + 1].click();
                window.scrollTo(0, 0);
              }
              else if (allArticlePost.length !== 30) {
                showToast("마지막 게시글입니다.", "#400000");
              }
            }

            else if (key === shortcutKeys.writeComment) {
              activePost("scroll");
              commentSection.scrollIntoView();
            }

            else if (key === shortcutKeys.rateUp) {
              activePost("article");
              rateUpButton.click();
            }

            else if (key === shortcutKeys.rateDown) {
              activePost("article");
              rateDownButton.click();
            }

            else if (key === shortcutKeys.fileDownload) {
              downloadButton.click();
            }
          }
        }
        if (koneShortcutsUse && key in defaultKoneShortcuts && koneShortcutKeys[key] === false) {
          event.stopImmediatePropagation();
        }
        if ((!koneShortcutsUse || configDiv.style.display === "block") && key in defaultKoneShortcuts) {
          if ((event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) || /write#editor?$/.test(window.location.href)) return;
          event.stopImmediatePropagation();
        }
      }, { capture: true, priority: 5 });
    });
    ['keydown'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        if (event.target.matches('input, textarea, [contenteditable]')) return;
        const key = event.key.toUpperCase();
        if ((!koneShortcutsUse || configDiv.style.display === "block") && key in defaultKoneShortcuts) {
          if ((event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) || /write#editor?$/.test(window.location.href)) return;
          event.preventDefault();
        }
      }, { capture: true, priority: 6 });
    });
  });
})();