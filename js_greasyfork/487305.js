// ==UserScript==
// @license MIT
// @name         Youtube Save/Resume Progress
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  Have you ever closed a YouTube video by accident, or have you gone to another one and when you come back the video starts from 0? With this extension it won't happen anymore
// @author       Costin Alexandru Sandu
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/SaurusLex/YoutubeSaveResumeProgress/refs/heads/master/youtube_save_resume_progress_icon.jpg
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.0/dist/floating-ui.core.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.3/dist/floating-ui.dom.umd.min.js
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
      fontAwesomeIcons:
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    },
    userSettings: {
      minDuration: 0,
      enableMinDuration: false,
    },
  };

  const CONFIG_KEY = "Youtube_SaveResume_Progress_Config";

  function getUserConfig() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CONFIG_KEY));
      return saved || {};
    } catch {
      return {};
    }
  }

  function setUserConfig(newConfig) {
    const current = getUserConfig();
    const merged = { ...current, ...newConfig };
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(merged));
    Object.assign(configData.userSettings, merged);
  }

  // Load initial settings
  Object.assign(configData.userSettings, getUserConfig());

  var state = {
    floatingUi: {
      cleanUpFn: null,
      settingsContainer: null,
    },
  };

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

  function getVideoDuration() {
    const player = document.querySelector("#movie_player");
    return player ? player.getDuration() : 0;
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

  function updateInfoText(text) {
    const lastSaveEl = document.querySelector(".last-save-info-text");

    // This is for browsers that support Trusted Types
    const innerHtml = configData.sanitizer
      ? configData.sanitizer.createHTML(text)
      : text;

    if (lastSaveEl) {
      lastSaveEl.innerHTML = innerHtml;
    }
  }

  function saveVideoProgress() {
    const videoProgress = getVideoCurrentTime();
    const videoId = getVideoId();

    // Check configuration constraints
    if (
      configData.userSettings.enableMinDuration &&
      configData.userSettings.minDuration > 0
    ) {
      const duration = getVideoDuration();
      const minDurationSec = configData.userSettings.minDuration * 60;

      if (duration < minDurationSec) {
        updateInfoText("Not saving (Too short)");
        return;
      }
    }

    updateInfoText(`Last save: ${fancyTimeFormat(videoProgress)}`);

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
    const settingsContainer = state.floatingUi.settingsContainer;
    const { autoUpdate } = window.FloatingUIDOM;

    settingsButton.addEventListener("click", () => {
      const exists = document.body.contains(settingsContainer);
      if (exists) {
        closeFloatingSettingsUi();
      } else {
        document.body.appendChild(settingsContainer);
        updateFloatingSettingsUi();
        state.floatingUi.cleanUpFn = autoUpdate(
          settingsButton,
          settingsContainer,
          updateFloatingSettingsUi
        );
        document.addEventListener(
          "click",
          closeFloatingSettingsUiOnClickOutside
        );
      }
    });
  }

  function closeFloatingSettingsUiOnClickOutside(event) {
    const settingsButton = document.querySelector(".ysrp-settings-button");
    const settingsContainer = state.floatingUi.settingsContainer;
    if (
      settingsContainer &&
      !settingsContainer.contains(event.target) &&
      !settingsButton.contains(event.target)
    ) {
      closeFloatingSettingsUi();
      document.removeEventListener(
        "click",
        closeFloatingSettingsUiOnClickOutside
      );
    }
  }

  function closeFloatingSettingsUi() {
    const settingsContainer = state.floatingUi.settingsContainer;
    settingsContainer.remove();
    state.floatingUi.cleanUpFn();
    state.floatingUi.cleanUpFn = null;
  }

  function createSettingsUI() {
    const infoElContainer = document.querySelector(".last-save-info-container");
    const infoElContainerPosition = infoElContainer.getBoundingClientRect();
    const settingsContainer = document.createElement("div");
    settingsContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    state.floatingUi.settingsContainer = settingsContainer;
    settingsContainer.classList.add("settings-container");

    const settingsContainerStyles = {
      all: "initial",
      position: "absolute",
      fontFamily: "inherit",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      border: "1px solid #d5d5d5",
      top: infoElContainerPosition.bottom + "px",
      left: infoElContainerPosition.left + "px",
      width: "50rem",
      height: "25rem",
      borderRadius: ".5rem",
      background: "white",
      zIndex: "3000",
      display: "flex",
      flexDirection: "row",
      overflow: "hidden",
    };

    Object.assign(settingsContainer.style, settingsContainerStyles);

    // Sidebar
    const sidebar = document.createElement("div");
    Object.assign(sidebar.style, {
      width: "120px",
      backgroundColor: "#f9f9f9",
      borderRight: "1px solid #ddd",
      display: "flex",
      flexDirection: "column",
      padding: "1rem 0",
    });

    // Main Content
    const mainContent = document.createElement("div");
    Object.assign(mainContent.style, {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      minWidth: "0",
    });

    settingsContainer.appendChild(sidebar);
    settingsContainer.appendChild(mainContent);

    function renderContent(viewId) {
      mainContent.innerHTML = "";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "1rem";
      header.style.alignItems = "center";
      header.style.borderBottom = "1px solid #eee";
      header.style.paddingBottom = "0.5rem";

      const title = document.createElement("h3");
      title.style.margin = "0";
      header.appendChild(title);

      const closeButton = document.createElement("button");
      closeButton.style.background = "transparent";
      closeButton.style.border = "none";
      closeButton.style.cursor = "pointer";
      const xmarkIcon = createIcon("xmark", "#e74c3c");
      closeButton.appendChild(xmarkIcon);
      closeButton.addEventListener("click", () => {
        closeFloatingSettingsUi();
      });
      header.appendChild(closeButton);

      mainContent.appendChild(header);

      const body = document.createElement("div");
      Object.assign(body.style, {
        flex: "1",
        overflow: "auto",
      });
      mainContent.appendChild(body);

      if (viewId === "savedVideos") {
        const videos = getSavedVideoList();
        title.textContent = "Saved Videos - (" + videos.length + ")";

        const videosList = document.createElement("ul");
        videosList.style.display = "flex";
        videosList.style.flexDirection = "column";
        videosList.style.rowGap = "1rem";
        videosList.style.listStyle = "none";
        videosList.style.padding = "0";
        videosList.style.margin = "0";

        videos.forEach((video) => {
          const [key, value] = video;
          const { videoName } = JSON.parse(value);
          const videoEl = document.createElement("li");

          videoEl.style.display = "flex";
          videoEl.style.alignItems = "center";
          videoEl.style.background = "#fff";
          videoEl.style.padding = "0.5rem";
          videoEl.style.borderBottom = "1px solid #f0f0f0";

          const videoElText = document.createElement("span");
          videoElText.textContent = videoName;
          videoElText.style.flex = "1";
          videoElText.style.whiteSpace = "nowrap";
          videoElText.style.overflow = "hidden";
          videoElText.style.textOverflow = "ellipsis";
          videoElText.style.marginRight = "1rem";

          const deleteButton = document.createElement("button");
          const trashIcon = createIcon("trash", "#e74c3c");
          deleteButton.style.background = "white";
          deleteButton.style.border = "1px solid #ddd";
          deleteButton.style.borderRadius = "4px";
          deleteButton.style.cursor = "pointer";
          deleteButton.style.padding = "4px 8px";

          deleteButton.addEventListener("click", () => {
            window.localStorage.removeItem(key);
            videosList.removeChild(videoEl);
            title.textContent =
              "Saved Videos - (" + videosList.children.length + ")";
          });

          deleteButton.appendChild(trashIcon);
          videoEl.appendChild(videoElText);
          videoEl.appendChild(deleteButton);
          videosList.appendChild(videoEl);
        });
        body.appendChild(videosList);
      } else if (viewId === "configuration") {
        title.textContent = "Configuration";
        body.innerHTML = ""; // Clear previous content
        body.style.padding = "1rem";

        const configContainer = document.createElement("div");
        configContainer.style.display = "flex";
        configContainer.style.flexDirection = "column";
        configContainer.style.gap = "1rem";

        // Min Duration Setting Wrapper
        const minDurationRow = document.createElement("div");
        minDurationRow.style.display = "flex";
        minDurationRow.style.alignItems = "center";
        minDurationRow.style.gap = "0.5rem";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "enable-min-duration";
        checkbox.checked = configData.userSettings.enableMinDuration;

        // Label
        const label = document.createElement("label");
        label.textContent = "Save only when videos are longer than";
        label.htmlFor = "enable-min-duration";

        // Input
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.value = configData.userSettings.minDuration;
        input.style.width = "60px";
        input.disabled = !checkbox.checked;

        // "minutes" text
        const suffix = document.createElement("span");
        suffix.textContent = "minutes";

        // Events
        checkbox.addEventListener("change", (e) => {
          input.disabled = !e.target.checked;
          setUserConfig({ enableMinDuration: e.target.checked });
        });

        input.addEventListener("change", (e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) {
            setUserConfig({ minDuration: val });
          }
        });

        minDurationRow.appendChild(checkbox);
        minDurationRow.appendChild(label);
        minDurationRow.appendChild(input);
        minDurationRow.appendChild(suffix);

        configContainer.appendChild(minDurationRow);
        body.appendChild(configContainer);
      }
    }

    const menuItems = [
      { id: "savedVideos", label: "Saved Videos" },
      { id: "configuration", label: "Configuration" },
    ];

    let activeItem = null;

    menuItems.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.textContent = item.label;
      itemEl.style.padding = "10px 15px";
      itemEl.style.cursor = "pointer";
      itemEl.style.color = "#333";
      itemEl.style.fontSize = "14px";

      itemEl.addEventListener("mouseenter", () => {
        if (activeItem !== itemEl) itemEl.style.background = "#eaeaea";
      });
      itemEl.addEventListener("mouseleave", () => {
        if (activeItem !== itemEl) itemEl.style.background = "transparent";
      });

      itemEl.addEventListener("click", () => {
        if (activeItem) {
          activeItem.style.background = "transparent";
          activeItem.style.fontWeight = "normal";
        }
        activeItem = itemEl;
        activeItem.style.background = "#e0e0e0";
        activeItem.style.fontWeight = "bold";
        renderContent(item.id);
      });

      sidebar.appendChild(itemEl);

      if (item.id === "savedVideos") {
        activeItem = itemEl;
        itemEl.style.background = "#e0e0e0";
        itemEl.style.fontWeight = "bold";
      }
    });

    renderContent("savedVideos");
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
    infoEl.appendChild(settingsButton);

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

      const settingsButton = document.querySelector(".ysrp-settings-button");
      settingsButton.appendChild(icon);
      icon.classList.add("fa-solid");
      icon.classList.add("fa-gear");
    });
  }

  function initializeDependencies() {
    addFontawesomeIcons();
    setFloatingSettingsUi();
  }

  function initializeUI() {
    const infoEl = createInfoUI();
    insertInfoElement(infoEl);
    createSettingsUI();

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
