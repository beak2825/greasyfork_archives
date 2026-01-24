// ==UserScript==
// @license MIT
// @name         Youtube Save/Resume Progress
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  Have you ever closed a YouTube video by accident, or have you gone to another one and when you come back the video starts from 0? With this extension it won't happen anymore
// @author       Costin Alexandru Sandu
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/SaurusLex/YoutubeSaveResumeProgress/refs/heads/master/youtube_save_resume_progress_icon.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
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
    currentVideoId: null,
    lastSaveTime: 0,
    dependenciesURLs: {
      fontAwesomeIcons:
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    },
    userSettings: {
      minDuration: 0,
      enableMinDuration: false,
      blacklistedVideos: [],
      savingInterval: 2,
      uiVisible: true,
    },
  };

  var saveTimerId = null;
  var menuCommandId = null;

  const CONFIG_KEY = "Youtube_SaveResume_Progress_Config";
  const moviePlayerSelector = "#movie_player";
  const FontAwesomeIcons = {
    trash: ["fa-solid", "fa-trash-can"],
    xmark: ["fa-solid", "fa-xmark"],
    video: ["fa-solid", "fa-clapperboard"],
    gear: ["fa-solid", "fa-gear"],
    currentVideo: ["fa-solid", "fa-circle-play"],
  };

  const CSS_STYLES = `
    .last-save-info-container {
      all: initial;
      font-family: inherit;
      font-size: 1.3rem;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
    }
    .last-save-info {
      text-shadow: none;
      background: white;
      color: black;
      padding: .5rem;
      border-radius: .5rem;
    }
    .ysrp-dashboard-button {
      background: white;
      border: rgba(0, 0, 0, 0.3) 1px solid;
      border-radius: .5rem;
      margin-left: 1rem;
      cursor: pointer;
    }
    .dashboard-container {
      all: initial;
      position: absolute;
      font-family: inherit;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border: 1px solid #d5d5d5;
      width: 50rem;
      height: 25rem;
      border-radius: .5rem;
      background: white;
      z-index: 3000;
      display: flex;
      flex-direction: row;
      overflow: hidden;
    }
    .ysrp-sidebar {
      background-color: #f9f9f9;
      border-right: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }

    .ysrp-menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 15px;
      cursor: pointer;
      color: #333;
      font-size: 14px;
    }
    .ysrp-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      min-width: 0;
    }
    .ysrp-menu-item:hover {
      background: #eaeaea;
    }
    .ysrp-menu-item.active {
      background: #e0e0e0;
      font-weight: bold;
    }
    .ysrp-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    .ysrp-dashboard-title {
      margin: 0;
    }
    .ysrp-close-button {
      background: transparent;
      border: none;
      cursor: pointer;
    }
    .ysrp-view-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ysrp-videos-list-container {
      flex: 1;
      overflow: auto;
    }
    .ysrp-videos-list {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .ysrp-video-item {
      display: flex;
      align-items: flex-start;
      background: #fff;
      padding: 0.8rem;
      border-bottom: 1px solid #f0f0f0;
      gap: 1rem;
    }
    .ysrp-video-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow: hidden;
    }
    .ysrp-video-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
      color: #333;
      text-decoration: none;
    }
    .ysrp-video-name:hover {
      text-decoration: underline;
      color: #000;
    }
    .ysrp-video-meta {
      font-size: 12px;
      color: #777;
      display: flex;
      gap: 15px;
    }
    .ysrp-delete-button {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      padding: 4px 8px;
    }
    .ysrp-config-container {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .ysrp-config-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .ysrp-button-group {
      display: flex;
      gap: 0.5rem;
      background: #f1f1f1;
      padding: 4px;
      border-radius: 8px;
    }
    .ysrp-toggle-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      font-size: 1.25rem;
      color: #666;
      transition: all 0.2s;
    }
    .ysrp-toggle-btn.active {
      background: white;
      color: #333;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .ysrp-current-video-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
    }
    .ysrp-current-video-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    .ysrp-current-video-progress {
      font-size: 2rem;
      color: #333;
      font-family: monospace;
      text-align: center;
      background: #f1f1f1;
      padding: 1rem;
      border-radius: 0.5rem;
    }
    .ysrp-toggle-button {
      padding: 0.8rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: bold;
      border: 1px solid #ddd;
      transition: background 0.3s;
      text-align: center;
    }
    .ysrp-toggle-button.enabled {
      background: #4caf50;
      color: white;
      border-color: #388e3c;
    }
    .ysrp-toggle-button.disabled {
      background: #9e9e9e;
      color: white;
      border-color: #757575;
    }
    .ysrp-hidden {
      display: none !important;
    }
  `;

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = CSS_STYLES;
    document.head.appendChild(style);
  }

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
    const previousInterval = configData.userSettings.savingInterval;
    Object.assign(configData.userSettings, merged);

    if (newConfig.savingInterval && newConfig.savingInterval !== previousInterval) {
      startSavingTimer();
    }
  }

  // Load initial settings
  Object.assign(configData.userSettings, getUserConfig());

  var state = {
    floatingUi: {
      cleanUpFn: null,
      dashboardContainer: null,
    },
    moviePlayer: null,
  };

  function getMoviePlayer() {
    if (!state.moviePlayer || !document.contains(state.moviePlayer)) {
      state.moviePlayer = document.querySelector(moviePlayerSelector);
    }
    return state.moviePlayer;
  }

  function startSavingTimer() {
    if (saveTimerId) {
      clearInterval(saveTimerId);
    }
    const intervalMs = configData.userSettings.savingInterval * 1000;
    saveTimerId = setInterval(saveVideoProgress, intervalMs);
  }

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

  function getVideoCurrentTime() {
    const player = getMoviePlayer();
    const currentTime = player ? player.getCurrentTime() : 0;

    return currentTime;
  }

  function getVideoDuration() {
    const player = getMoviePlayer();
    return player ? player.getDuration() : 0;
  }

  function getVideoName() {
    const player = getMoviePlayer();
    const videoData = player ? player.getVideoData() : null;
    const videoName = videoData ? videoData.title : "";

    return videoName;
  }

  function getVideoId() {
    if (configData.currentVideoId) {
      return configData.currentVideoId;
    }
    const player = getMoviePlayer();
    const videoData = player ? player.getVideoData() : null;
    const id = videoData ? videoData.video_id : null;

    return id;
  }

  function playerExists() {
    const player = getMoviePlayer();
    const exists = Boolean(player);

    return exists;
  }

  function setVideoProgress(progress) {
    const player = getMoviePlayer();

    if (player) {
      player.seekTo(progress);
    }
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

    const isBlacklisted = configData.userSettings.blacklistedVideos.includes(videoId);
    if (isBlacklisted) {
      updateInfoText("Saving: Disabled (Manual)");
      return;
    }

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
  function updateFloatingDashboardUi() {
    const dashboardButton = document.querySelector(".ysrp-dashboard-button");
    const dashboardContainer = document.querySelector(".dashboard-container");
    const { flip, computePosition } = window.FloatingUIDOM;
    computePosition(dashboardButton, dashboardContainer, {
      placement: "top",
      middleware: [flip()],
    }).then(({ x, y }) => {
      Object.assign(dashboardContainer.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  function setFloatingDashboardUi() {
    const dashboardButton = document.querySelector(".ysrp-dashboard-button");
    const dashboardContainer = state.floatingUi.dashboardContainer;
    const { autoUpdate } = window.FloatingUIDOM;

    dashboardButton.addEventListener("click", () => {
      const exists = document.body.contains(dashboardContainer);
      if (exists) {
        closeFloatingDashboardUi();
      } else {
        document.body.appendChild(dashboardContainer);
        updateFloatingDashboardUi();
        state.floatingUi.cleanUpFn = autoUpdate(
          dashboardButton,
          dashboardContainer,
          updateFloatingDashboardUi
        );
        document.addEventListener(
          "click",
          closeFloatingDashboardUiOnClickOutside
        );
      }
    });
  }

  function closeFloatingDashboardUiOnClickOutside(event) {
    const dashboardButton = document.querySelector(".ysrp-dashboard-button");
    const dashboardContainer = state.floatingUi.dashboardContainer;
    if (
      dashboardContainer &&
      !dashboardContainer.contains(event.target) &&
      !dashboardButton.contains(event.target)
    ) {
      closeFloatingDashboardUi();
      document.removeEventListener(
        "click",
        closeFloatingDashboardUiOnClickOutside
      );
    }
  }

  function closeFloatingDashboardUi() {
    const dashboardContainer = state.floatingUi.dashboardContainer;
    dashboardContainer.remove();
    state.floatingUi.cleanUpFn();
    state.floatingUi.cleanUpFn = null;
  }

  function createDashboard() {
    const infoElContainer = document.querySelector(".last-save-info-container");
    const infoElContainerPosition = infoElContainer.getBoundingClientRect();
    const dashboardContainer = document.createElement("div");
    dashboardContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    state.floatingUi.dashboardContainer = dashboardContainer;
    dashboardContainer.classList.add("dashboard-container");

    dashboardContainer.classList.add("dashboard-container");

    // Sidebar
    const sidebar = document.createElement("div");
    sidebar.classList.add("ysrp-sidebar");

    // Main Content
    const mainContent = document.createElement("div");
    mainContent.classList.add("ysrp-main-content");

    dashboardContainer.appendChild(sidebar);
    dashboardContainer.appendChild(mainContent);

    function renderCurrentVideoView() {
      const body = document.createElement("div");
      body.classList.add("ysrp-current-video-container");

      const titleLabel = document.createElement("h4");
      titleLabel.textContent = getVideoName();
      titleLabel.classList.add("ysrp-current-video-title");

      const progressDisplay = document.createElement("div");
      progressDisplay.classList.add("ysrp-current-video-progress");

      const updateProgress = () => {
        const videoId = getVideoId();
        const isBlacklisted = configData.userSettings.blacklistedVideos.includes(videoId);
        const duration = getVideoDuration();
        
        if (isBlacklisted) {
          progressDisplay.textContent = `- / ${fancyTimeFormat(duration)}`;
          return;
        }

        const currentTime = getVideoCurrentTime();
        progressDisplay.textContent = `${fancyTimeFormat(
          currentTime
        )} / ${fancyTimeFormat(duration)}`;
      };

      updateProgress();
      const intervalId = setInterval(updateProgress, 1000);
      body.dataset.intervalId = intervalId; // Store to clear later

      body.appendChild(titleLabel);
      body.appendChild(progressDisplay);

      const toggleButton = document.createElement("div");
      toggleButton.classList.add("ysrp-toggle-button");

      const updateToggleButton = () => {
        const videoId = getVideoId();
        const isBlacklisted = configData.userSettings.blacklistedVideos.includes(videoId);
        
        if (isBlacklisted) {
          toggleButton.textContent = "Enable auto-save";
          toggleButton.classList.remove("enabled");
          toggleButton.classList.add("disabled");
        } else {
          toggleButton.textContent = "Disable auto-save";
          toggleButton.classList.remove("disabled");
          toggleButton.classList.add("enabled");
        }
      };

      toggleButton.addEventListener("click", () => {
        const videoId = getVideoId();
        let blacklisted = [...configData.userSettings.blacklistedVideos];
        
        if (blacklisted.includes(videoId)) {
          blacklisted = blacklisted.filter(id => id !== videoId);
        } else {
          blacklisted.push(videoId);
        }
        
        setUserConfig({ blacklistedVideos: blacklisted });
        updateToggleButton();
      });

      updateToggleButton();
      body.appendChild(toggleButton);

      return body;
    }

    function renderSavedVideosView(onTitleUpdate) {
      const videos = getSavedVideoList();
      
      // Sort videos by most recent save date
      const sortedVideos = videos
        .map(([key, value]) => ({ key, data: JSON.parse(value) }))
        .sort((a, b) => (b.data.saveDate || 0) - (a.data.saveDate || 0));

      const body = document.createElement("div");
      body.classList.add("ysrp-videos-list-container");

      const videosList = document.createElement("ul");
      videosList.classList.add("ysrp-videos-list");

      const updateTitle = () => {
        onTitleUpdate(`Saved Videos - (${videosList.children.length})`);
      };

      sortedVideos.forEach(({ key, data }) => {
        const { videoName, videoProgress, saveDate } = data;
        const videoId = key.replace("Youtube_SaveResume_Progress-", "");
        
        const videoEl = document.createElement("li");
        videoEl.classList.add("ysrp-video-item");

        const infoContainer = document.createElement("div");
        infoContainer.classList.add("ysrp-video-info");

        const videoLink = document.createElement("a");
        videoLink.textContent = videoName;
        videoLink.classList.add("ysrp-video-name");
        videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;
        videoLink.target = "_blank";
        videoLink.rel = "noopener noreferrer";

        const metaContainer = document.createElement("div");
        metaContainer.classList.add("ysrp-video-meta");

        const progressSpan = document.createElement("span");
        progressSpan.textContent = `Progress: ${fancyTimeFormat(videoProgress)}`;

        const dateSpan = document.createElement("span");
        const dateObj = new Date(saveDate);
        dateSpan.textContent = `Saved: ${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        metaContainer.append(progressSpan, dateSpan);
        infoContainer.append(videoLink, metaContainer);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("ysrp-delete-button");
        const trashIcon = createIcon("trash", "#e74c3c");

        deleteButton.addEventListener("click", () => {
          window.localStorage.removeItem(key);
          videosList.removeChild(videoEl);
          updateTitle();
        });

        deleteButton.appendChild(trashIcon);
        videoEl.append(infoContainer, deleteButton);
        videosList.appendChild(videoEl);
      });

      body.appendChild(videosList);
      updateTitle();

      return body;
    }

    function renderConfigurationView() {
      const body = document.createElement("div");
      body.classList.add("ysrp-config-container");

      const configContainer = document.createElement("div");
      configContainer.classList.add("ysrp-config-container");

      // Minimum Duration Section
      const minDurationSection = document.createElement("div");
      minDurationSection.style.display = "flex";
      minDurationSection.style.flexDirection = "column";
      minDurationSection.style.gap = "0.8rem";

      const label = document.createElement("label");
      label.textContent = "Minimum video duration to save";
      label.style.fontWeight = "normal";
      label.style.fontSize = "14px";
      label.style.color = "#555";

      const controlsRow = document.createElement("div");
      controlsRow.classList.add("ysrp-config-row");

      const buttonGroup = document.createElement("div");
      buttonGroup.classList.add("ysrp-button-group");

      const alwaysBtn = document.createElement("button");
      alwaysBtn.textContent = "Always";
      alwaysBtn.classList.add("ysrp-toggle-btn");

      const customBtn = document.createElement("button");
      customBtn.textContent = "Custom";
      customBtn.classList.add("ysrp-toggle-btn");

      const customInputRow = document.createElement("div");
      customInputRow.classList.add("ysrp-config-row");
      customInputRow.style.marginLeft = "1rem";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = configData.userSettings.minDuration;
      input.style.width = "60px";

      const suffix = document.createElement("span");
      suffix.textContent = "minutes";

      customInputRow.append(input, suffix);

      const updateUIStates = () => {
        const isCustom = configData.userSettings.enableMinDuration;
        if (isCustom) {
          customBtn.classList.add("active");
          alwaysBtn.classList.remove("active");
          customInputRow.style.display = "flex";
        } else {
          alwaysBtn.classList.add("active");
          customBtn.classList.remove("active");
          customInputRow.style.display = "none";
        }
      };

      alwaysBtn.addEventListener("click", () => {
        setUserConfig({ enableMinDuration: false });
        updateUIStates();
      });

      customBtn.addEventListener("click", () => {
        setUserConfig({ enableMinDuration: true });
        updateUIStates();
        input.focus();
      });

      input.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          setUserConfig({ minDuration: val });
        }
      });

      updateUIStates();

      buttonGroup.append(alwaysBtn, customBtn);
      controlsRow.append(buttonGroup, customInputRow);
      minDurationSection.append(label, controlsRow);

      // Saving Interval Section
      const intervalSection = document.createElement("div");
      intervalSection.style.display = "flex";
      intervalSection.style.flexDirection = "column";
      intervalSection.style.gap = "0.8rem";

      const intervalLabel = document.createElement("label");
      intervalLabel.textContent = "Save progress every";
      intervalLabel.style.fontWeight = "normal";
      intervalLabel.style.fontSize = "14px";
      intervalLabel.style.color = "#555";

      const intervalInputContainer = document.createElement("div");
      intervalInputContainer.classList.add("ysrp-config-row");

      const intervalInput = document.createElement("input");
      intervalInput.type = "number";
      intervalInput.min = "1";
      intervalInput.max = "60";
      intervalInput.value = configData.userSettings.savingInterval;
      intervalInput.style.width = "60px";

      const intervalSuffix = document.createElement("span");
      intervalSuffix.textContent = "seconds";

      intervalInput.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1) {
          setUserConfig({ savingInterval: val });
        }
      });

      intervalInputContainer.append(intervalInput, intervalSuffix);
      intervalSection.append(intervalLabel, intervalInputContainer);

      // Visibility Section
      const visibilitySection = document.createElement("div");
      visibilitySection.style.display = "flex";
      visibilitySection.style.flexDirection = "column";
      visibilitySection.style.gap = "0.8rem";

      const visibilityLabel = document.createElement("label");
      visibilityLabel.textContent = "Visibility";
      visibilityLabel.style.fontWeight = "normal";
      visibilityLabel.style.fontSize = "14px";
      visibilityLabel.style.color = "#555";

      const hideButton = document.createElement("button");
      hideButton.textContent = "Hide extension";
      hideButton.classList.add("ysrp-toggle-button", "enabled");
      hideButton.style.width = "fit-content";
      hideButton.style.padding = "0.5rem 1rem";
      hideButton.style.fontSize = "12px";

      hideButton.addEventListener("click", () => {
        toggleUiVisibility();
        // Since we are hiding it, we should also close the dashboard
        closeFloatingDashboardUi();
      });

      const visibilityInfo = document.createElement("p");
      visibilityInfo.textContent = "You can always show it again from the Userscript manager menu (e.g. Tampermonkey icon).";
      visibilityInfo.style.fontSize = "11px";
      visibilityInfo.style.color = "#888";
      visibilityInfo.style.margin = "0";
      visibilityInfo.style.lineHeight = "1.4";

      visibilitySection.append(visibilityLabel, hideButton, visibilityInfo);

      const createDivider = () => {
        const hr = document.createElement("hr");
        hr.style.border = "none";
        hr.style.borderTop = "1px solid #eee";
        hr.style.margin = "0.5rem 0";
        return hr;
      };

      configContainer.style.gap = "1rem";

      configContainer.appendChild(minDurationSection);
      configContainer.appendChild(createDivider());
      configContainer.appendChild(intervalSection);
      configContainer.appendChild(createDivider());
      configContainer.appendChild(visibilitySection);
      body.appendChild(configContainer);

      return body;
    }

    function renderContent(viewId) {
      if (viewBody.children[0]?.dataset?.intervalId) {
        clearInterval(viewBody.children[0].dataset.intervalId);
      }
      viewBody.innerHTML = "";

      const views = {
        currentVideo: () => {
          title.textContent = "Current Video";
          viewBody.appendChild(renderCurrentVideoView());
        },
        savedVideos: () =>
          viewBody.appendChild(
            renderSavedVideosView((newTitle) => (title.textContent = newTitle))
          ),
        configuration: () => {
          title.textContent = "Configuration";
          viewBody.appendChild(renderConfigurationView());
        },
      };

      views[viewId]?.();
    }

    // Header structure
    const header = document.createElement("div");
    header.classList.add("ysrp-header");

    const title = document.createElement("h3");
    title.classList.add("ysrp-dashboard-title");

    const closeButton = document.createElement("button");
    closeButton.classList.add("ysrp-close-button");
    closeButton.appendChild(createIcon("xmark", "#e74c3c"));
    closeButton.addEventListener("click", closeFloatingDashboardUi);

    header.append(title, closeButton);

    const viewBody = document.createElement("div");
    viewBody.classList.add("ysrp-view-body");

    mainContent.append(header, viewBody);

    const menuItems = [
      { id: "currentVideo", label: "Current Video", icon: "currentVideo" },
      { id: "savedVideos", label: "Saved Videos", icon: "video" },
      { id: "configuration", label: "Configuration", icon: "gear" },
    ];

    let activeItem = null;

    menuItems.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("ysrp-menu-item");

      const icon = createIcon(item.icon, "inherit");
      const label = document.createElement("span");
      label.textContent = item.label;

      itemEl.append(icon, label);

      itemEl.addEventListener("click", () => {
        if (activeItem) {
          activeItem.classList.remove("active");
        }
        activeItem = itemEl;
        activeItem.classList.add("active");
        renderContent(item.id);
      });

      sidebar.appendChild(itemEl);

      if (item.id === "currentVideo") {
        activeItem = itemEl;
        activeItem.classList.add("active");
      }
    });

    renderContent("currentVideo");
  }
  function applyUiVisibility() {
    const infoElContainers = document.querySelectorAll(".last-save-info-container");
    infoElContainers.forEach((container) => {
      if (configData.userSettings.uiVisible) {
        container.classList.remove("ysrp-hidden");
      } else {
        container.classList.add("ysrp-hidden");
      }
    });
  }

  function toggleUiVisibility() {
    const newValue = !configData.userSettings.uiVisible;
    setUserConfig({ uiVisible: newValue });
    applyUiVisibility();
    registerMenuCommands();
  }

  function registerMenuCommands() {
    if (typeof GM_registerMenuCommand !== "undefined") {
      if (menuCommandId !== null && typeof GM_unregisterMenuCommand !== "undefined") {
        GM_unregisterMenuCommand(menuCommandId);
      }

      const isVisible = configData.userSettings.uiVisible;
      const label = isVisible ? "🚫 Hide Extension UI" : "👁️ Show Extension UI";

      menuCommandId = GM_registerMenuCommand(label, () => {
        toggleUiVisibility();
      });
    }
  }


  function createInfoUI() {
    const infoElContainer = document.createElement("div");
    const infoEl = document.createElement("div");
    const infoElText = document.createElement("span");
    const dashboardButton = document.createElement("button");

    infoElContainer.classList.add("last-save-info-container");
    infoEl.classList.add("last-save-info");
    infoElText.classList.add("last-save-info-text");
    infoElText.textContent = "Last save: Loading...";
    dashboardButton.classList.add("ysrp-dashboard-button");

    infoEl.append(infoElText, dashboardButton);
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

      const dashboardButton = document.querySelector(".ysrp-dashboard-button");
      dashboardButton.appendChild(icon);
      icon.classList.add("fa-solid");
      icon.classList.add("fa-gear");
    });
  }

  function initializeDependencies() {
    injectStyles();
    addFontawesomeIcons();
    setFloatingDashboardUi();
  }

  function initializeUI() {
    const infoEl = createInfoUI();
    insertInfoElement(infoEl);
    createDashboard();

    initializeDependencies();
    applyUiVisibility();

    onChaptersReadyToMount(() => {
      insertInfoElementInChaptersContainer(infoEl);
      createDashboard();
      applyUiVisibility();
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

    registerMenuCommands();
    startSavingTimer();
  }

  initialize();
})();
