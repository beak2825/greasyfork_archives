// ==UserScript==
// @license MIT
// @name         Youtube Save/Resume Progress
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Have you ever closed a YouTube video by accident, or have you gone to another one and when you come back the video starts from 0? With this extension it won't happen anymore
// @author       Costin Alexandru Sandu
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/SaurusLex/YoutubeSaveResumeProgress/refs/heads/master/youtube_save_resume_progress_icon.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487305/Youtube%20SaveResume%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/487305/Youtube%20SaveResume%20Progress.meta.js
// ==/UserScript==

(function () {
  "strict";
  var configData = {
    sanitizer: null,
    savedProgressAlreadySet: false,
    savingInterval: 2000,
    currentVideoId: null,
    lastSaveTime: 0,
    dependenciesURLs: {
      floatingUiCore: "https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.0",
      floatingUiDom: "https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.3",
      fontAwesomeIcons:
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    }
  };

  var state = {
    floatingUi: {
      cleanUpFn: null,
      settingsContainer: null,
    }
  }

  var FontAwesomeIcons = {
    trash: ["fa-solid", "fa-trash-can"],
    xmark: ["fa-solid", "fa-xmark"],
  };

  function createIcon(iconName, color) {
    const icon = document.createElement("i");
    const cssClasses = FontAwesomeIcons[iconName];
    icon.classList.add(...cssClasses);
    icon.style.color = color;
    icon.style.fontSize = "16px";

    return icon;
  }
  // ref: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }

  /*function executeFnInPageContext(fn) {
    const fnStringified = fn.toString()
    return window.eval('(' + fnStringified + ')' + '()')
  }*/

  function getVideoCurrentTime() {
    const player = document.querySelector("#movie_player");
    const currentTime = player.getCurrentTime();

    return currentTime;
  }

  function getVideoName() {
    const player = document.querySelector("#movie_player");
    const videoName = player.getVideoData().title;

    return videoName;
  }

  function getVideoId() {
    if (configData.currentVideoId) {
      return configData.currentVideoId;
    }
    const player = document.querySelector("#movie_player");
    const id = player.getVideoData().video_id;

    return id;
  }

  function playerExists() {
    const player = document.querySelector("#movie_player");
    const exists = Boolean(player);

    return exists;
  }

  function setVideoProgress(progress) {
    const player = document.querySelector("#movie_player");

    player.seekTo(progress);
  }

  function updateLastSaved(videoProgress) {
    const lastSaveEl = document.querySelector(".last-save-info-text");
    const lastSaveText = `Last save: ${fancyTimeFormat(videoProgress)}`;
    // This is for browsers that support Trusted Types
    const lastSaveInnerHtml = configData.sanitizer
      ? configData.sanitizer.createHTML(lastSaveText)
      : lastSaveText;

    if (lastSaveEl) {
      lastSaveEl.innerHTML = lastSaveInnerHtml;
    }
  }

  function saveVideoProgress() {
    const videoProgress = getVideoCurrentTime();
    updateLastSaved(videoProgress);
    const videoId = getVideoId();

    configData.currentVideoId = videoId;
    configData.lastSaveTime = Date.now();
    const idToStore = "Youtube_SaveResume_Progress-" + videoId;
    const progressData = {
      videoProgress,
      saveDate: Date.now(),
      videoName: getVideoName(),
    };

    window.localStorage.setItem(idToStore, JSON.stringify(progressData));
  }
  function getSavedVideoList() {
    const savedVideoList = Object.entries(window.localStorage).filter(
      ([key, value]) => key.includes("Youtube_SaveResume_Progress-")
    );
    return savedVideoList;
  }

  function getSavedVideoProgress() {
    const videoId = getVideoId();
    const idToStore = "Youtube_SaveResume_Progress-" + videoId;
    const savedVideoData = window.localStorage.getItem(idToStore);
    const { videoProgress } = JSON.parse(savedVideoData) || {};

    return videoProgress;
  }

  function videoHasChapters() {
    const chaptersSection = document.querySelector(
      '.ytp-chapter-container[style=""]'
    );
    const chaptersSectionDisplay = getComputedStyle(chaptersSection).display;
    return chaptersSectionDisplay !== "none";
  }

  function setSavedProgress() {
    const savedProgress = getSavedVideoProgress();
    setVideoProgress(savedProgress);
    configData.savedProgressAlreadySet = true;
  }

  // code ref: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async function onPlayerElementExist(callback) {
    await waitForElm("#movie_player");
    callback();
  }

  function isReadyToSetSavedProgress() {
    return (
      !configData.savedProgressAlreadySet &&
      playerExists() &&
      getSavedVideoProgress()
    );
  }
  function insertInfoElement(element) {
    const leftControls = document.querySelector(".ytp-left-controls");
    leftControls.appendChild(element);
    const chaptersContainerElelement = document.querySelector(
      ".ytp-chapter-container"
    );
    chaptersContainerElelement.style.flexBasis = "auto";
  }
  function insertInfoElementInChaptersContainer(element) {
    const chaptersContainer = document.querySelector(
      '.ytp-chapter-container[style=""]'
    );
    chaptersContainer.style.display = "flex";
    chaptersContainer.appendChild(element);
  }
  function updateFloatingSettingsUi() {
    const settingsButton = document.querySelector(".ysrp-settings-button");
    const settingsContainer = document.querySelector(".settings-container");
    const { flip, computePosition } = window.FloatingUIDOM;
    computePosition(settingsButton, settingsContainer, {
      placement: "top",
      middleware: [flip()],
    }).then(({ x, y }) => {
      Object.assign(settingsContainer.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  function setFloatingSettingsUi() {
    const settingsButton = document.querySelector(".ysrp-settings-button");
    const settingsContainer = state.floatingUi.settingsContainer
    const { autoUpdate } = window.FloatingUIDOM;

    settingsButton.addEventListener("click", () => {
      const exists = document.body.contains(settingsContainer)
      if (exists) {
        closeFloatingSettingsUi()
      } else {
          document.body.appendChild(settingsContainer);
          updateFloatingSettingsUi();
          state.floatingUi.cleanUpFn = autoUpdate(settingsButton, settingsContainer, updateFloatingSettingsUi);
          document.addEventListener('click', closeFloatingSettingsUiOnClickOutside)
      }

    });
  }

  function closeFloatingSettingsUiOnClickOutside(event) {
      const settingsButton = document.querySelector(".ysrp-settings-button");
      const settingsContainer = state.floatingUi.settingsContainer
      if (settingsContainer && !settingsContainer.contains(event.target) && !settingsButton.contains(event.target)) {
          closeFloatingSettingsUi();
          document.removeEventListener('click', closeFloatingSettingsUiOnClickOutside);
      }
  }

  function closeFloatingSettingsUi() {
      const settingsContainer = state.floatingUi.settingsContainer
      settingsContainer.remove()
      state.floatingUi.cleanUpFn()
      state.floatingUi.cleanUpFn = null
  }

  function createSettingsUI() {
    const videos = getSavedVideoList();
    const videosCount = videos.length;
    const infoElContainer = document.querySelector(".last-save-info-container");
    const infoElContainerPosition = infoElContainer.getBoundingClientRect();
    const settingsContainer = document.createElement("div");
    settingsContainer.addEventListener('click', (event) => {event.stopPropagation()})
    state.floatingUi.settingsContainer = settingsContainer
    settingsContainer.classList.add("settings-container");

    const settingsContainerHeader = document.createElement("div");
    const settingsContainerHeaderTitle = document.createElement("h3");
    settingsContainerHeaderTitle.textContent =
      "Saved Videos - (" + videosCount + ")";
    settingsContainerHeader.style.display = "flex";
    settingsContainerHeader.style.justifyContent = "space-between";

    const settingsContainerBody = document.createElement("div");
    settingsContainerBody.classList.add("settings-container-body");
    const settingsContainerBodyStyle = {
      display: "flex",
      flex: "1",
      minHeight: "0",
      overflow: "auto",
    };
    Object.assign(settingsContainerBody.style, settingsContainerBodyStyle);

    const videosList = document.createElement("ul");
    videosList.style.display = "flex";
    videosList.style.flexDirection = "column";
    videosList.style.rowGap = "1rem";
    videosList.style.listStyle = "none";
    videosList.style.marginTop = "1rem";
    videosList.style.flex = "1";

    videos.forEach((video) => {
      const [key, value] = video;
      const { videoName } = JSON.parse(value);
      const videoEl = document.createElement("li");
      const videoElText = document.createElement("span");
      videoEl.style.display = "flex";
      videoEl.style.alignItems = "center";

      videoElText.textContent = videoName;
      videoElText.style.flex = "1";

      const deleteButton = document.createElement("button");
      const trashIcon = createIcon("trash", "#e74c3c");
      deleteButton.style.background = "white";
      deleteButton.style.border = "rgba(0, 0, 0, 0.3) 1px solid";
      deleteButton.style.borderRadius = ".5rem";
      deleteButton.style.marginLeft = "1rem";
      deleteButton.style.cursor = "pointer";

      deleteButton.addEventListener("click", () => {
        window.localStorage.removeItem(key);
        videosList.removeChild(videoEl);
        settingsContainerHeaderTitle.textContent =
          "Saved Videos - (" + videosList.children.length + ")";
      });

      deleteButton.appendChild(trashIcon);
      videoEl.appendChild(videoElText);
      videoEl.appendChild(deleteButton);
      videosList.appendChild(videoEl);
    });

    const settingsContainerCloseButton = document.createElement("button");
    settingsContainerCloseButton.style.background = "transparent";
    settingsContainerCloseButton.style.border = "none";
    settingsContainerCloseButton.style.cursor = "pointer";

    const xmarkIcon = createIcon("xmark", "#e74c3c");
    settingsContainerCloseButton.appendChild(xmarkIcon);
    settingsContainerCloseButton.addEventListener("click", () => {
        closeFloatingSettingsUi()
    });

    const settingsContainerStyles = {
      all: "initial",
      position: "absolute",
      fontFamily: "inherit",
      flexDirection: "column",
      top: "0",
      display: "flex",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      border: "1px solid #d5d5d5",
      top: infoElContainerPosition.bottom + "px",
      left: infoElContainerPosition.left + "px",
      padding: "1rem",
      width: "50rem",
      height: "25rem",
      borderRadius: ".5rem",
      background: "white",
      zIndex: "3000",
    };

    Object.assign(settingsContainer.style, settingsContainerStyles);
    settingsContainerBody.appendChild(videosList);
    settingsContainerHeader.appendChild(settingsContainerHeaderTitle);
    settingsContainerHeader.appendChild(settingsContainerCloseButton);
    settingsContainer.appendChild(settingsContainerHeader);
    settingsContainer.appendChild(settingsContainerBody);

    const savedVideos = getSavedVideoList();
    const savedVideosList = document.createElement("ul");
  }

  function createInfoUI() {
    const infoElContainer = document.createElement("div");
    infoElContainer.classList.add("last-save-info-container");
    const infoElText = document.createElement("span");
    const settingsButton = document.createElement("button");
    settingsButton.classList.add("ysrp-settings-button");

    settingsButton.style.background = "white";
    settingsButton.style.border = "rgba(0, 0, 0, 0.3) 1px solid";
    settingsButton.style.borderRadius = ".5rem";
    settingsButton.style.marginLeft = "1rem";

    const infoEl = document.createElement("div");
    infoEl.classList.add("last-save-info");
    infoElText.textContent = "Last save: Loading...";
    infoElText.classList.add("last-save-info-text");
    infoEl.appendChild(infoElText);
    infoEl.appendChild(settingsButton)

    infoElContainer.style.all = "initial";
    infoElContainer.style.fontFamily = "inherit";
    infoElContainer.style.fontSize = "1.3rem";
    infoElContainer.style.marginLeft = "0.5rem";
    infoElContainer.style.display = "flex";
    infoElContainer.style.alignItems = "center";

    infoEl.style.textShadow = "none";
    infoEl.style.background = "white";
    infoEl.style.color = "black";
    infoEl.style.padding = ".5rem";
    infoEl.style.borderRadius = ".5rem";

    infoElContainer.appendChild(infoEl);

    return infoElContainer;
  }

  async function onChaptersReadyToMount(callback) {
    await waitForElm('.ytp-chapter-container[style=""]');
    callback();
  }

  function addFontawesomeIcons() {
    const head = document.getElementsByTagName("HEAD")[0];
    const iconsUi = document.createElement("link");
    Object.assign(iconsUi, {
      rel: "stylesheet",
      type: "text/css",
      href: configData.dependenciesURLs.fontAwesomeIcons,
    });

    head.appendChild(iconsUi);
    iconsUi.addEventListener("load", () => {
      const icon = document.createElement("span");

      const settingsButton = document.querySelector('.ysrp-settings-button')
      settingsButton.appendChild(icon)
      icon.classList.add('fa-solid')
      icon.classList.add('fa-gear')
    });
  }

  function sanitizeScriptUrl(url) {
    return configData.sanitizer ? configData.sanitizer.createScriptURL(url) : url;
  }

  function addFloatingUIDependency() {
    const floatingUiCore = document.createElement("script");
    const floatingUiDom = document.createElement("script");
    floatingUiCore.src = sanitizeScriptUrl(configData.dependenciesURLs.floatingUiCore);
    floatingUiDom.src = sanitizeScriptUrl(configData.dependenciesURLs.floatingUiDom);
    document.body.appendChild(floatingUiCore);
    document.body.appendChild(floatingUiDom);
    let floatingUiCoreLoaded = false;
    let floatingUiDomLoaded = false;


    floatingUiCore.addEventListener("load", () => {
      floatingUiCoreLoaded = true;
      if (floatingUiCoreLoaded && floatingUiDomLoaded) {
        setFloatingSettingsUi();
      }
    });
    floatingUiDom.addEventListener("load", () => {
      floatingUiDomLoaded = true;
      if (floatingUiCoreLoaded && floatingUiDomLoaded) {
        setFloatingSettingsUi();
      }
    });
  }
  function initializeDependencies() {
    addFontawesomeIcons();
    // FIXME: floating ui is not working for now
    addFloatingUIDependency()
  }

  function initializeUI() {
    const infoEl = createInfoUI();
    insertInfoElement(infoEl);
    createSettingsUI()

    initializeDependencies();

    onChaptersReadyToMount(() => {
      insertInfoElementInChaptersContainer(infoEl);
      createSettingsUI();
    });
  }

  function initialize() {
    if (
      window.trustedTypes &&
      window.trustedTypes.createPolicy &&
      !window.trustedTypes.defaultPolicy
    ) {
      const sanitizer = window.trustedTypes.createPolicy("default", {
        createHTML: (string, sink) => string,
        createScript: (string, sink) => string,
        createScriptURL: (string, sink) => string,
      });

      configData.sanitizer = sanitizer;
    }

    onPlayerElementExist(() => {
      initializeUI();
      if (isReadyToSetSavedProgress()) {
        setSavedProgress();
      }
    });

    setInterval(saveVideoProgress, configData.savingInterval);
  }

  initialize();
})();
