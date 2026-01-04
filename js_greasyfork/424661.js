// ==UserScript==
// @name     MangaReader
// @description Utility created for a better reading experience.
// @version  1.5.1
// @author              Midefos
// @namespace           https://github.com/Midefos
// @match               https://lectortmo.com/*
// @match               https://*.com/news/*
// @match               https://*.com/viewer/*
// @downloadURL https://update.greasyfork.org/scripts/424661/MangaReader.user.js
// @updateURL https://update.greasyfork.org/scripts/424661/MangaReader.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// PAGE

function isTMO() {
  const url = extractUrl();
  return url.includes('lectortmo');
}

function redirectTMO() {
  if (isReader && !isTMO()) {
    window.history.back();
  }
}

function isReader() {
  const url = extractUrl();
  return url.includes('viewer') || url.includes('news');
}

// INITIATOR

function bind() {
  bindMangaReader();
  bindNavigation();

  bindDashboard();
  bindConfiguration();
  bindStats();
}

function bindDashboard() {
  bindFollow();
  bindEpisode();
}

function bindConfiguration() {
  bindDark();
  bindCascade();
  bindStepper();
  bindAutoscroll();
  bindShortcuts();
  bindContactMe();
}

function bindStats() {
  startStats();
}

function app() {
  redirectTMO();

  createMenu();
  bind();
  toggleWelcome();

  scrollToFollow();
}

// HTML AND CSS TEMPLATE

function createMenu() {
  document.querySelector('#app').insertAdjacentHTML(
    'afterbegin',
    `<nav id="midefos-manga-reader">
        <div id="menu">
          <button class="primary" title="Toggle menu" id="toggleMangaReader">🗙</button>
          <button class="primary" title="Previous episode" id="prevChapter">⬅</button>
          <button class="primary" title="Next episode" id="nextChapter">➡</button>
          <button id="autoscrollState" title="Autoscroll state" class="off">🖱</button>
          <button id="saveFollow" title="Follow serie" class="off">❤️</button>
          <button id="saveEpisode" title="Save episode" class="off">⭐</button>
        </div>
      
        <div id="content">
          <div id="dashboard">
            <div id="welcome">
              <span>
                <h5>Welcome to the app!</h5> 
                Here will be appear:
                <ul>
                  <li>Your favorite episodes.</li>
                  <li>Your following series.</li>
                  <li>Some functionalities!</li>
                </ul>
                Please contact me if you find any bugs or have suggestions!
              </span>
            </div>

            <div id="autoscrollForm">
              <span>Autoscroll: </span>
              <select id="autoscrollVelocity">
                <option value="15">Slow</option>
                <option value="25">Normal</option>
                <option value="35">Fast</option>
              </select>
              <button id="toggleScroll" class="on">Enable</button>
            </div>

            <div id="followsContainer">
              <h5>❤️ Following:</h5>
              <ul id="followsList">
              </ul>
            </div>

            <div id="episodesContainer">
              <h5>⭐ Favorite episodes:</h5>
              <ul id="episodesList">
              </ul>
            </div>
          </div>

          <div id="configuration">
            <div>
              <input id="toggleDark" type="checkbox"><span>Always dark</span>
            </div>
      
            <div>
              <input id="toggleCascade" type="checkbox"><span>Always cascade</span>
            </div>
      
            <div>
              <input id="toggleStepper" type="checkbox"><span>Stepper</span>
            </div>
    
            <div>
              <input id="toggleAutoscroll" type="checkbox"><span>Autoscroll</span>
            </div>

            <div>
              <input id="toggleShortcuts" type="checkbox"><span>Shortcuts</span>
                <ul id="shortcutsInfo">
                  <li>esc: menu</li>
                  <li id="autoscrollShortcutInfo">space: autoscroll</li>
                  <li id="stepperShortcutInfo">tab: step</li>
                </ul>
            </div>

            <div>
              <button id="contactMe" class="primary">Contact me!</button>
            </div>
          </div>

          <div id="stats">
            <div>
              <h5>Current stats:</h5>
              <ul>
                <li id="totalTime">Time reading: <span id="totalTimeQuantity">Loading...</span></li>
                <li id="currentTime">Current serie: <span id="currentTimeQuantity">Loading...</span></li>
              </ul>
            </div>

            <div>
              <h5>All stats:</h5>
              <ul id="statsContainer"></ul>
            </div>
          </div>
        </div>

        <div id="footer">
          <button class="primary" title="Dashboard" id="toggleDashboard">📑</button>
          <button class="primary" title="Configuration" id="toggleConfiguration">🔧</button>
          <button class="primary" title="Stats" id="toggleStats">📊</button>
        </div>
    </nav>
      
      <style>
      #midefos-manga-reader {
        background: rgba(52, 58, 64, 0.9);
        position: fixed;
        color: white;
        margin: 15px;
        z-index: 5;
        border-radius: 10px;
        border: 2px solid rgb(34, 34, 34);
        width: 225px;
      }
      #midefos-manga-reader div {
        font-size: 12px;
      }
      #midefos-manga-reader ul {
        font-size: 11px;
        margin-bottom: 0;
        padding-left: 20px;
      }
      #menu, #footer{
        display: flex;
        justify-content: center;
        padding: 5px 0;
      }
      #footer[style*='display: block'] {
        display: flex !important;
      }
      #menu button, #footer button {
        margin: 0px 3px;
        padding: 0px;
        min-width: 30px;
        font-size: 16px;
      }
      #midefos-manga-reader h5 {
        color: white;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        margin-bottom: 3px;
      }
      #content{
          border-top: 2px solid rgb(34, 34, 34);
          border-bottom: 2px solid rgb(34, 34, 34);
      }
      #content > div > div {
          padding: 3px 0;
      }
      #content > div > div:not(:last-of-type) {
          border-bottom: 1px solid rgb(34, 34, 34);
      }
      #content #dashboard > div,
      #content #configuration > div,
      #content #stats > div {
        padding: 4px 10px;
      }
      #midefos-manga-reader input {
        position: relative;
        top: 1px;
      }
      #midefos-manga-reader input + span {
        margin-left: 5px;
      }
      #midefos-manga-reader input[type="text"] {
        width: 75px;
      }
      button.primary, button.off, button.on {
        cursor: pointer;
      }
      button.primary {
        color: white;
        background: rgb(41, 87, 186);
        border-color: rgb(41, 87, 186);
        transition: all ease-out 150ms;
      }
      button.primary:hover {
        background: rgb(34, 72, 155);
        border-color: rgb(34, 72, 155);
      }
      .on {
        color: white;
        background: green;
        border-color: green;
      }
      .off {
        color: white;
        background: darkred;
        border-color: darkred;
      }
      #midefos-manga-reader li[style*='display: block'] {
        display: list-item !important;
      }
      #episodesContainer, #followsContainer {
        display: none;
      }
      #episodesContainer a, .removeEpisode,
      #followsContainer a, .removeFollow,
      .removeStat{
          color: white;
          font-size: 11px;
      }
      #episodesContainer a, #followsContainer a {
          text-decoration: underline;
      }
      .removeEpisode, .removeFollow, .removeStat {
          margin: 0;
          padding: 0;
      }
      </style>`,
  );
}

// SETTINGS

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function saveCurrentSettings() {
  const settings = {
    settings: {
      displayMenu: isVisibleMangaReader(),
      toggleDark: getToggleDark().checked,
      toggleCascade: getToggleCascade().checked,
      toggleStepper: getToggleStepper().checked,
      toggleAutoscroll: getToggleAutoscroll().checked,
      autoscrollVelocity: getAutoscrollVelocityValue(),
      toggleShortcuts: getToggleShortcuts().checked,
    },
    episodes: getEpisodes(),
    follows: getFollows(),
    stats: getStatsData(),
  };
  saveSettings(settings);
}

function getDefaultSettings() {
  return {
    settings: {
      displayMenu: true,
      toggleDark: true,
      toggleCascade: true,
      toggleStepper: true,
      toggleAutoscroll: false,
      autoscrollVelocity: 25,
      toggleShortcuts: true,
    },
    episodes: new Map(),
    follows: new Map(),
    stats: new Map(),
  };
}

function saveSettings(settings) {
  localStorage.setItem('midefos-manga-reader', JSON.stringify(settings, replacer));
}

function getSettings() {
  const settings = JSON.parse(localStorage.getItem('midefos-manga-reader'), reviver);
  if (settings) return settings;

  const defaultSettings = getDefaultSettings();
  saveSettings(defaultSettings);
  return defaultSettings;
}

function getSetting(settingName) {
  const settings = getSettings();
  return settings.settings[settingName];
}

// EPISODE

function getEpisodesContainer() {
  return document.querySelector('#episodesContainer');
}

function getEpisodesList() {
  return document.querySelector('#episodesList');
}

function getEpisodes() {
  const settings = getSettings();
  return settings.episodes;
}

function getEpisodeTemplate(id, episode) {
  return `<li>
            <a data-id="${id}" href="${episode.url}">${trim(episode.manga, 26)} - ${episode.number}</a>
            <button class='off removeEpisode' title='Remove favorite'>🗙</button>
          </li>`;
}

function printEpisode(id, episode) {
  const episodesContainer = getEpisodesContainer();
  showElement(episodesContainer);

  const episodesList = getEpisodesList();
  episodesList.insertAdjacentHTML('beforeend', getEpisodeTemplate(id, episode));

  if (isCurrentEpisode(id)) {
    getSaveEpisode().classList.replace('off', 'on');
  }
}

function isCurrentEpisode(id) {
  return extractId() === id;
}

function printEpisodes() {
  const episodes = getEpisodes();
  episodes.forEach((episode, id) => {
    printEpisode(id, episode);
  });
}

function removeEpisode(id) {
  const episodeAnchor = document.querySelector(`a[data-id="${id}"]`);
  episodeAnchor.parentNode.remove();

  if (isCurrentEpisode(id)) {
    getSaveEpisode().classList.replace('on', 'off');
  }
  const removeEpisode = document.querySelector('.removeEpisode');
  if (!removeEpisode) {
    const episodesContainer = getEpisodesContainer();
    hideElement(episodesContainer);
  }
}

function saveEpisode(id, episode) {
  if (!existEpisode(id)) {
    const settings = getSettings();
    settings.episodes.set(id, episode);
    saveSettings(settings);
    printEpisode(id, episode);
  }
}

function existEpisode(id) {
  const episodes = getEpisodes();
  return episodes.has(id);
}

function deleteEpisode(id) {
  if (existEpisode(id)) {
    const settings = getSettings();
    settings.episodes.delete(id);
    saveSettings(settings);
    removeEpisode(id);
  }
}

function extractId() {
  const url = extractUrl();
  let id = url.substr(url.indexOf('/viewer/') + '/viewer/'.length);
  id = id.substr(0, id.indexOf('/'));
  return id;
}

function extractManga() {
  return document.querySelector('section h1').textContent;
}

function extractEpisodeNumber() {
  let mangaEpisode = document.querySelector('section h2').textContent;
  mangaEpisode = mangaEpisode.substr(
    mangaEpisode.indexOf(' Capítulo ') + ' Capítulo '.length,
  );
  mangaEpisode = mangaEpisode.substr(0, mangaEpisode.indexOf(' Subido'));
  mangaEpisode = mangaEpisode.trim();
  return Number(mangaEpisode);
}

function extractUrl() {
  return window.location.href;
}

function toggleWelcome() {
  const contentElements = Array.from(
    document.querySelectorAll('#dashboard > div:not(#welcome)'),
  ).find((element) => getComputedStyle(element).display !== 'none');

  const welcomeInfo = document.querySelector('#welcome');
  if (contentElements) {
    hideElement(welcomeInfo);
  } else {
    showElement(welcomeInfo);
  }
}

function extractEpisode() {
  return {
    url: cleanUrl(),
    manga: extractManga(),
    number: extractEpisodeNumber(),
  };
}

function extractIdRemove(element) {
  return element.parentNode.querySelector('a').getAttribute('data-id');
}

function getSaveEpisode() {
  return document.querySelector('#saveEpisode');
}

function getPrevChapter() {
  return document.querySelector('.chapter-prev a');
}

function getNextChapter() {
  return document.querySelector('.chapter-next a');
}

function bindEpisode() {
  const prevChapterButton = document.querySelector('#prevChapter');
  const prevChapter = getPrevChapter();
  if (prevChapter) {
    prevChapterButton.addEventListener('click', () => {
      prevChapter.click();
    });
  } else {
    hideElement(prevChapterButton);
  }

  const nextChapterButton = document.querySelector('#nextChapter');
  const nextChapter = getNextChapter();
  if (nextChapter) {
    nextChapterButton.addEventListener('click', () => {
      nextChapter.click();
    });
  } else {
    hideElement(nextChapterButton);
  }

  const saveEpisodeButton = getSaveEpisode();
  saveEpisodeButton.addEventListener('click', () => {
    const id = extractId();
    const episode = extractEpisode();
    saveEpisode(id, episode);
    toggleWelcome();
  });
  printEpisodes();

  if (!isReader()) {
    hideElement(prevChapterButton);
    hideElement(nextChapterButton);
    hideElement(saveEpisodeButton);
  }

  document.querySelector('body').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeEpisode')) {
      const id = extractIdRemove(event.target);
      deleteEpisode(id);
      toggleWelcome();
    }
  });
}

// FOLLOWS

function bindBeforeUnload() {
  window.addEventListener('beforeunload', saveFollowScroll);
}

function saveFollowScroll() {
  const name = extractManga();
  if (existFollow(name)) {
    const currentScroll = window.scrollY;
    const follow = getFollow(name);
    follow.scrollY = currentScroll;

    const settings = getSettings();
    settings.follows.set(name, follow);
    saveSettings(settings);
  }
}

function removeBeforeUnload() {
  window.addEventListener('beforeunload', saveFollowScroll);
}

function scrollToFollow() {
  const name = extractManga();
  if (existFollow(name)) {
    const follow = getFollow(name);
    const scroll = follow.scrollY || 0;
    window.scroll({
      top: scroll,
      left: 0,
      behavior: 'smooth',
    });
  }
}

function getFollowsList() {
  return document.querySelector('#followsList');
}

function getFollowsContainer() {
  return document.querySelector('#followsContainer');
}

function getFollowTemplate(episode) {
  return `<li>
            <a data-name="${episode.manga}" href="${episode.url}">${trim(episode.manga, 26)} - ${episode.number}</a>
            <button class='off removeFollow' title='Remove follow'>🗙</button>
          </li>`;
}

function printFollow(episode) {
  const followsContainer = getFollowsContainer();
  showElement(followsContainer);
  const existEpisode = followsContainer.querySelector(
    `a[data-name="${episode.manga}"]`,
  );
  if (existEpisode) existEpisode.parentNode.remove();
  const followsList = getFollowsList();
  followsList.insertAdjacentHTML('beforeend', getFollowTemplate(episode));

  if (isCurrentFollow(episode.manga)) {
    getSaveFollow().classList.replace('off', 'on');
    bindBeforeUnload();
  }
}

function isCurrentFollow(name) {
  if (!isReader()) {
    return false;
  }
  return extractManga() === name;
}

function printFollows() {
  const follows = getFollows();
  follows.forEach((episode, name) => {
    printFollow(episode);
  });
}

function removeFollow(name) {
  const followsContainer = getFollowsContainer();
  const episodeAnchor = followsContainer.querySelector(`a[data-name="${name}"]`);
  episodeAnchor.parentNode.remove();

  if (isCurrentFollow(name)) {
    getSaveFollow().classList.replace('on', 'off');
    removeBeforeUnload();
  }

  const removeFollow = document.querySelector('.removeFollow');
  if (!removeFollow) {
    hideElement(followsContainer);
  }
}

function getFollows() {
  const settings = getSettings();
  return settings.follows;
}

function getFollow(name) {
  if (existFollow(name)) {
    return getFollows().get(name);
  }
  return null;
}

function existFollow(name) {
  const follows = getFollows();
  return follows.has(name);
}

function saveFollow() {
  const episode = extractEpisode();
  const mangaName = episode.manga;
  if (!existFollow(mangaName)) {
    const settings = getSettings();
    settings.follows.set(mangaName, episode);
    saveSettings(settings);
    printFollow(episode);
  }
}

function deleteFollow(name) {
  if (existFollow(name)) {
    const settings = getSettings();
    settings.follows.delete(name);
    saveSettings(settings);
    removeFollow(name);
  }
}

function updateFollow() {
  const name = extractManga();
  if (existFollow(name)) {
    const settings = getSettings();
    const savedFollow = settings.follows.get(name);
    const currentEpisodeNumber = extractEpisodeNumber();
    if (currentEpisodeNumber > savedFollow.number) {
      const currentEpisode = extractEpisode();
      settings.follows.set(name, currentEpisode);
      saveSettings(settings);
      printFollow(currentEpisode);
    }
  }
}

function getSaveFollow() {
  return document.querySelector('#saveFollow');
}

function extractNameRemove(element) {
  return element.parentNode
    .querySelector('*[data-name]')
    .getAttribute('data-name');
}

function bindFollow() {
  const followButton = getSaveFollow();
  followButton.addEventListener('click', () => {
    saveFollow();
    toggleWelcome();
  });

  if (!isReader()) {
    hideElement(followButton);
  } else {
    updateFollow();
  }
  printFollows();

  document.querySelector('body').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeFollow')) {
      const name = extractNameRemove(event.target);
      deleteFollow(name);
      toggleWelcome();
    }
  });
}

// DARK

function setDarkTheme() {
  localStorage.setItem('theme', 'dark');
  document.querySelector('body').classList.add('dark-mode');
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.remove('navbar-light', 'bg-light');
    navbar.classList.add('navbar-dark', 'bg-dark');
  }
}

function getToggleDark() {
  return document.querySelector('#toggleDark');
}

function performDark() {
  if (getToggleDark().checked) {
    setDarkTheme();
  }
}

function bindDark() {
  const toggleDark = getToggleDark();
  toggleDark.addEventListener('change', () => {
    performDark();
    saveCurrentSettings();
  });

  toggleDark.checked = getSetting('toggleDark');
  performDark();
}

// CASCADE

const cascadeText = 'cascade';
function isCascade() {
  return window.location.href.includes(cascadeText);
}

function cleanUrl() {
  let url = extractUrl();
  url = url.replace('paginated', cascadeText);
  url = url.substr(0, url.lastIndexOf(cascadeText) + cascadeText.length);
  return url;
}

function navigateToCascade() {
  if (!isCascade()) {
    window.location.href = cleanUrl();
  }
}

function getToggleCascade() {
  return document.querySelector('#toggleCascade');
}

function performToggleCascade() {
  if (!isReader()) {
    return;
  }

  if (getToggleCascade().checked) {
    navigateToCascade();
  }
}

function bindCascade() {
  const toggleCascade = getToggleCascade();
  toggleCascade.addEventListener('change', (event) => {
    performToggleCascade();
    saveCurrentSettings();
  });

  toggleCascade.checked = getSetting('toggleCascade');
  performToggleCascade();
}

// STEPPER

function getStepperShortcutInfo() {
  return document.querySelector('#stepperShortcutInfo');
}

function performToggleStepper() {
  const body = document.querySelector('body');
  const enabled = getToggleStepper().checked;
  if (enabled && isReader()) {
    if (getToggleShortcuts().checked) {
      body.addEventListener('keydown', _keyStepper);
    }
  }
  const stepperShortcutInfo = getStepperShortcutInfo();
  if (enabled) {
    showElement(stepperShortcutInfo);
  } else {
    hideElement(stepperShortcutInfo);
    body.removeEventListener('keydown', _keyStepper);
  }
}

function getToggleStepper() {
  return document.querySelector('#toggleStepper');
}

function bindStepper() {
  const toggleStepper = getToggleStepper();
  toggleStepper.addEventListener('click', () => {
    performToggleStepper();
    saveCurrentSettings();
  });
  toggleStepper.checked = getSetting('toggleStepper');
  performToggleStepper();
}

// AUTOSCROLL

function getAutoscrollShortcutInfo() {
  return document.querySelector('#autoscrollShortcutInfo');
}

function getAutoscrollForm() {
  return document.querySelector('#autoscrollForm');
}

function toggleScroll() {
  if (isAutoscrollRunning()) {
    clearAutoscroll();
  } else {
    initAutoscroll();
  }
}

function performToggleAutoscroll() {
  const body = document.querySelector('body');
  const enabled = getToggleAutoscroll().checked;

  const autoscrollForm = getAutoscrollForm();
  const autoscrollState = getAutoscrollState();
  if (enabled && isReader()) {
    showElement(autoscrollState);
    showElement(autoscrollForm);
    if (getToggleShortcuts().checked) {
      body.addEventListener('keypress', _keyAutoscroll);
    }
  } else {
    hideElement(autoscrollState);
    hideElement(autoscrollForm);
  }

  const autoscrollShortcutInfo = getAutoscrollShortcutInfo();
  if (enabled) {
    showElement(autoscrollShortcutInfo);
  } else {
    hideElement(autoscrollShortcutInfo);
    body.removeEventListener('keypress', _keyAutoscroll);
  }
}

function getToggleScroll() {
  return document.querySelector('#toggleScroll');
}

function clearAutoscroll() {
  clearInterval(autoscrollInterval);
  autoscrollInterval = null;

  getAutoscrollState().classList.replace('on', 'off');
  const toggleScroll = getToggleScroll();
  toggleScroll.classList.replace('off', 'on');
  toggleScroll.textContent = 'Enable';
}

function isAutoscrollRunning() {
  return autoscrollInterval !== null;
}

function initAutoscroll() {
  autoscrollInterval = setInterval(() => {
    window.scroll({
      top: window.scrollY + getAutoscrollVelocityValue(),
      left: 0,
      behavior: 'smooth',
    });
  }, 150);

  getAutoscrollState().classList.replace('off', 'on');
  const toggleScroll = getToggleScroll();
  toggleScroll.classList.replace('on', 'off');
  toggleScroll.textContent = 'Disable';
}

function getAutoscrollState() {
  return document.querySelector('#autoscrollState');
}

function getToggleAutoscroll() {
  return document.querySelector('#toggleAutoscroll');
}

function getAutoscrollVelocity() {
  return document.querySelector('#autoscrollVelocity');
}

function getAutoscrollVelocityValue() {
  return (
    Number(document.querySelector('#autoscrollVelocity').value)
    || getDefaultSettings().autoscrollVelocity
  );
}

let autoscrollInterval = null;
function bindAutoscroll() {
  const autoscrollVelocity = getAutoscrollVelocity();
  autoscrollVelocity.addEventListener('change', (event) => {
    if (!Number.isNaN(event.target.value)) saveCurrentSettings();
  });
  autoscrollVelocity.value = getSetting('autoscrollVelocity');

  const toggleScrollButton = getToggleScroll();
  toggleScrollButton.addEventListener('click', () => {
    toggleScroll();
  });

  const toggleAutoscroll = getToggleAutoscroll();
  toggleAutoscroll.addEventListener('click', () => {
    performToggleAutoscroll();
    saveCurrentSettings();
    toggleWelcome();
  });
  toggleAutoscroll.checked = getSetting('toggleAutoscroll');
  performToggleAutoscroll();
}

// DISPLAY MENU

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

function isVisible(element) {
  return element.style.display !== 'none';
}

function toggleDisplay(element) {
  if (!isVisible(element)) {
    showElement(element);
  } else {
    hideElement(element);
  }
}

function isVisibleMangaReader() {
  return isVisible(getContent());
}

function getContent() {
  return document.querySelector('#midefos-manga-reader #content');
}

function getFooter() {
  return document.querySelector('#midefos-manga-reader #footer');
}

function toggleMangaReader() {
  const mangaElements = [getContent(), getFooter()];
  mangaElements.forEach((element) => {
    toggleDisplay(element);
  });
}

function bindMangaReader() {
  const mangaReaderButton = document.querySelector('#toggleMangaReader');
  mangaReaderButton.addEventListener('click', () => {
    toggleMangaReader();
    saveCurrentSettings();
  });

  if (!getSetting('displayMenu')) toggleMangaReader();
}

// NAVIGATION

function getDashboard() {
  return document.querySelector('#midefos-manga-reader #dashboard');
}

function getConfiguration() {
  return document.querySelector('#midefos-manga-reader #configuration');
}

function getStats() {
  return document.querySelector('#midefos-manga-reader #stats');
}

function getContentElements() {
  return [getConfiguration(), getDashboard(), getStats()];
}

function hideContentElements() {
  const elements = getContentElements();
  elements.forEach((element) => {
    hideElement(element);
  });
}

function showDashboard() {
  hideContentElements();
  const dashboard = getDashboard();
  showElement(dashboard);
}

function showConfiguration() {
  hideContentElements();
  const configuration = getConfiguration();
  showElement(configuration);
}

function showStats() {
  hideContentElements();
  const stats = getStats();
  showElement(stats);
}

function bindNavigation() {
  showDashboard();

  const dashboardButton = document.querySelector('#toggleDashboard');
  dashboardButton.addEventListener('click', () => {
    showDashboard();
  });

  const configurationButton = document.querySelector('#toggleConfiguration');
  configurationButton.addEventListener('click', () => {
    showConfiguration();
  });

  const statsButton = document.querySelector('#toggleStats');
  statsButton.addEventListener('click', () => {
    showStats();
  });
}

// SHORTCUTS

function getToggleShortcuts() {
  return document.querySelector('#toggleShortcuts');
}

function clearShortcuts() {
  const body = document.querySelector('body');
  body.removeEventListener('keyup', _keyMangaReader);
  body.removeEventListener('keydown', _keyStepper);
  body.removeEventListener('keypress', _keyAutoscroll);
  hideElement(document.querySelector('#shortcutsInfo'));
}

function _keyAutoscroll(event) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    toggleScroll();
  }
}

function _keyMangaReader(event) {
  if (event.key === 'Escape') {
    toggleMangaReader();
  }
}

function _keyStepper(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    event.stopPropagation();
    performStep();
  }
}

function performStep() {
  const percentage = 0.7;
  window.scroll({
    top: window.scrollY + Math.floor(window.innerHeight * percentage),
    left: 0,
    behavior: 'smooth',
  });
}

function initShortcuts() {
  const body = document.querySelector('body');
  body.addEventListener('keyup', _keyMangaReader);

  const shortcutsInfo = document.querySelector('#shortcutsInfo');
  showElement(shortcutsInfo);

  if (isReader()) {
    if (getToggleStepper().checked) {
      body.addEventListener('keydown', _keyStepper);
    }
    if (getToggleAutoscroll().checked) {
      body.addEventListener('keypress', _keyAutoscroll);
    }
  }
}

function performToggleShortcuts() {
  if (getToggleShortcuts().checked) {
    initShortcuts();
  } else {
    clearShortcuts();
  }
}

function bindShortcuts() {
  const toggleShortcuts = getToggleShortcuts();
  toggleShortcuts.addEventListener('change', (event) => {
    performToggleShortcuts();
    saveCurrentSettings();
  });
  toggleShortcuts.checked = getSetting('toggleShortcuts');
  performToggleShortcuts();
}

// CONTACT ME

function bindContactMe() {
  const contactMeButton = document.querySelector('#contactMe');
  contactMeButton.addEventListener('click', (event) => {
    contactMe();
  });
}

function contactMe() {
  const email = 'midefos@gmail.com';
  const subject = 'About your MangaReader script';
  window.open(`mailto:${email}?subject=${subject}`, '_self');
}

// STATS

function createDefaultStats() {
  return {
    manga: extractManga(),
    milliseconds: 0,
  };
}

function getStatsData() {
  const settings = getSettings();
  return settings.stats;
}

function getCurrentStats() {
  const stats = getStatsData();
  const name = extractManga();
  const mangaStats = stats.get(name);
  if (mangaStats) {
    return mangaStats;
  }
  return createDefaultStats();
}

function isTabActive() {
  return !document.hidden;
}

function printStats() {
  const stats = getStatsData();

  if (isReader()) {
    const name = extractManga();
    stats.delete(name);
  }
  stats.forEach((stat, name) => printStat(stat));
}

function getStatTemplate(stat) {
  return `<li>
            <span data-name="${stat.manga}">${trim(stat.manga)} - ${formatMilliseconds(stat.milliseconds)}</span>
            <button class='off removeStat' title='Remove stat'>🗙</button
          </li>`;
}

function printStat(stat) {
  const statsContainer = document.querySelector('#statsContainer');
  statsContainer.insertAdjacentHTML('beforeend', getStatTemplate(stat));
}

function removeStat(name) {
  const episodeAnchor = document.querySelector(`#statsContainer *[data-name="${name}"]`);
  episodeAnchor.parentNode.remove();
}

function printTotalTimeStats() {
  const totalTimeQuantity = document.querySelector('#totalTimeQuantity');
  totalTimeQuantity.innerText = formatMilliseconds(computeTotalTime());
}

function printCurrentStats() {
  if (isReader()) {
    const stats = getCurrentStats();
    const currentTimeQuantity = document.querySelector('#currentTimeQuantity');
    currentTimeQuantity.innerText = formatMilliseconds(stats.milliseconds);
  } else {
    hideElement(document.querySelector('#currentTime'));
  }
  printTotalTimeStats();
}

function computeTotalTime() {
  const stats = getStatsData();
  let totalMilliseconds = 0;
  stats.forEach((stat, name) => {
    totalMilliseconds += stat.milliseconds;
  });
  return totalMilliseconds;
}

function formatMilliseconds(milliseconds) {
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}

function addZero(number) {
  const formattedNumber = number.toString();
  if (formattedNumber.length === 1) {
    return `0${formattedNumber}`;
  }
  return formattedNumber;
}

function trim(string, length = 20) {
  return string.length >= length ? `${string.substring(0, length - 3)}...` : string;
}

function startStats() {
  if (isReader()) {
    saveUsage();
  }

  printStats();
  printCurrentStats();
  bindStatsData();
}

function saveUsage() {
  const milliseconds = 1000;
  setInterval(() => {
    if (isTabActive()) {
      const settings = getSettings();
      const mangaStats = getCurrentStats();
      const name = extractManga();
      mangaStats.milliseconds += milliseconds;
      settings.stats.set(name, mangaStats);
      saveSettings(settings);
      printCurrentStats();
    }
  }, milliseconds);
}

function deleteStat(name) {
  const settings = getSettings();
  settings.stats.delete(name);
  saveSettings(settings);
  removeStat(name);
}

function bindStatsData() {
  document.querySelector('body').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeStat')) {
      const name = extractNameRemove(event.target);
      deleteStat(name);
      printCurrentStats();
    }
  });
}

app();
