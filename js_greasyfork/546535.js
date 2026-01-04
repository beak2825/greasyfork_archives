// ==UserScript==
// @name         BUSTR: Busting Reminder + PDA (modded for EZ api key settings)
// @namespace    http://torn.city.com.dot.com.com
// @version      1.0.11
// @description  Guess how many busts you can do without getting jailed
// @author       Adobi & Ironhydedragon (modded by GFOUR)
// @match        https://www.torn.com/*
// @license      MIT
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/546535/BUSTR%3A%20Busting%20Reminder%20%2B%20PDA%20%28modded%20for%20EZ%20api%20key%20settings%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546535/BUSTR%3A%20Busting%20Reminder%20%2B%20PDA%20%28modded%20for%20EZ%20api%20key%20settings%29.meta.js
// ==/UserScript==

console.log('😎 BUSTR-SCRIPT ON!!!!'); // TEST

////////  GLOBAL VARIABLES
////  State
let GLOBAL_BUSTR_STATE = {
  userSettings: {
    reminderLimits: {
      redLimit: 0, // will be red at this number and under
      greenLimit: 3, // will be green at this number and over
    },
    statsRefreshRate: 60, // time in seconds
    customPenaltyThreshold: 0, // leave at 0 if you want to use the prediction algorithm
    // quickBust: true,
    // quickBail: false,
    showHardnessScore: true, // set to 'false' to remove hardnessScore rendering and reordering
  },
  penaltyScore: 0,
  penaltyThreshold: 0,
  availableBusts: 0,
  timestampsArray: [],
  lastFetchTimestampMs: 0,
  renderedView: undefined,
};


const PDA_API_KEY = '###PDA-APIKEY###';
function isPDA() {
  const PDATestRegex = !/^(###).+(###)$/.test(PDA_API_KEY);
  return PDATestRegex;
}

// GM helpers availability
const GM_AVAILABLE = typeof GM_registerMenuCommand === 'function';
const GM_STORE = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

function setApiKey(apiKey) {
  try {
    if (GM_STORE) GM_setValue('bustrApiKey', apiKey);
  } catch {}
  try {
    localStorage.setItem('bustrApiKey', JSON.stringify(apiKey));
  } catch {}
}

function getApiKey() {
  // 1) Prefer GM storage
  try {
    if (GM_STORE) {
      const gmKey = GM_getValue('bustrApiKey', null);
      if (gmKey) return gmKey;
    }
  } catch {}

  // 2) Fallback to localStorage
  try {
    const lsKey = localStorage.getItem('bustrApiKey');
    if (lsKey) return JSON.parse(lsKey);
  } catch {}

  // 3) Fallback to embedded/PDA key
  if (isPDA()) return PDA_API_KEY;

  return undefined;
}

function deleteApiKey() {
  try {
    if (typeof GM_deleteValue === 'function') GM_deleteValue('bustrApiKey');
  } catch {}
  try {
    localStorage.removeItem('bustrApiKey');
  } catch {}
}

function registerScriptMenu() {
  if (!GM_AVAILABLE) return;

  const currentKey = getApiKey();
  const masked = currentKey ? `${String(currentKey).slice(0, 4)}••••••••${String(currentKey).slice(-4)}` : 'none';

  GM_registerMenuCommand(`Set API key`, () => {
    const newKey = prompt('Enter your Torn full-access API key:', '');
    if (!newKey) return;
    setApiKey(newKey.trim());
    alert('API key saved. Reloading…');
    window.location.reload();
  });

  if (currentKey) {
    GM_registerMenuCommand('Clear saved API key', () => {
      if (!confirm('Remove the saved API key and fall back to the embedded/PDA key if available?')) return;
      deleteApiKey();
      alert('Saved API key cleared. Reloading…');
      window.location.reload();
    });
  }
}


////  Colors
const greenMossDark = '#4b5738';
const greenMossDarkTranslucent = 'rgb(75, 87, 56, 0.9)';
const greenMoss = '#57693a';
const greenMossTranslucent = 'rgb(87, 105, 58, 0.9)';
const greenApple = '#85b200';
const greenAppleTranslucent = 'rgba(134, 179, 0, 0.4)';

const orangeFulvous = '#d08000';
const orangeFulvousTranslucent = 'rgba(209, 129, 0, 0.3)';
const orangeAmber = '#ffbf00';
const orangeAmberTranslucent = 'rgba(255, 191, 0, 0.4)';

const redFlame = '#e64d1a';
const redFlameTranslucent = 'rgba(230, 77, 25, 0.3)';
const redMelon = '#ffa8a8';
const redMelonTranslucent = 'rgba(255, 168, 168, 0.3)';

////  Utils Functions

function createTimestampsArray(data) {
  let timestamps = [];

  for (const entry in data.log) {
    timestamps.push(data.log[entry].timestamp);
  }

  return timestamps;
}

function calcTenHours(hours) {
  return hours / 7.2;
}

function calcPenaltyScore(timestampsArray) {
  const currentTime = Date.now() / 1000;

  let score = 0;
  let localScore = 0;
  for (const ts of timestampsArray) {
    const hours = (currentTime - ts) / 60 / 60;
    const tenHours = calcTenHours(hours);
    if (hours <= 72) {
      localScore = 128 / Math.pow(2, tenHours);
      score += localScore;
    }
  }
  return Math.floor(score);
}

function calcPenaltyThreshold(timestampsArray) {
  if (getUserSettings().customPenaltyThreshold && typeof getUserSettings().customPenaltyThreshold === 'number') return getUserSettings().customPenaltyThreshold;
  const period = 24 * 60 * 60 * 3;
  let longestSequence = 0;
  let currentSequence = 1;
  let currentMin = timestampsArray[0];
  let currentMax = timestampsArray[0];
  let firstTimestamp;

  for (let i = 1; i < timestampsArray.length; i++) {
    const TS = timestampsArray[i];
    if (currentMin - TS <= period && currentMax - TS <= period) {
      currentSequence++;
      currentMin = Math.min(currentMin, TS);
      currentMax = Math.max(currentMax, TS);
    } else {
      if (longestSequence < currentSequence) {
        firstTimestamp = currentMin;
      }
      longestSequence = Math.max(longestSequence, currentSequence);
      currentSequence = 1;
      currentMin = TS;
      currentMax = TS;
    }
  }

  let currentMaxScore = 0;
  for (let i = 0; i < timestampsArray.length - longestSequence; i++) {
    let score = 0;
    let localScore = 0;
    const initial_timestamp = timestampsArray[i];
    for (let j = 0; j < longestSequence; j++) {
      const hours = (initial_timestamp - timestampsArray[i + j]) / 60 / 60;
      const tenHours = calcTenHours(hours);
      localScore = 128 / Math.pow(2, tenHours);
      score += localScore;
    }
    currentMaxScore = Math.max(currentMaxScore, score);
  }
  return Math.floor(currentMaxScore);
}

function calcAvailableBusts(penaltyScore, penaltyThreshold) {
  return Math.floor((penaltyThreshold - penaltyScore) / 128);
}

async function fetchBustsData(apiKey) {
  try {
    const url = `https://api.torn.com/user/?selections=log&log=5360&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    setLastFecthTimestampMs();

    if (data.error) {
      if (data.error.error === 'Incorrect key' || data.error.error === 'Access level of this key is not high enough') {
        throw new Error(`Error: ${data.error.error}`);
      }
      throw new Error('Something went wrong');
    }
    return data;
  } catch (err) {
    console.error(err);
  }
}

function calcBustrStats(timestampsArray) {
  const penaltyScore = calcPenaltyScore(timestampsArray);

  const penaltyThreshold = calcPenaltyThreshold(timestampsArray);

  const availableBusts = calcAvailableBusts(penaltyScore, penaltyThreshold);

  return { penaltyScore, penaltyThreshold, availableBusts };
}

function getLevelJailDurationInfo(playerEl) {
  const levelEl = playerEl.querySelector('.level');
  const durationEl = playerEl.querySelector('.time');

  const level = +levelEl.innerText.match(/\d+/)[0];
  const hours = +durationEl.innerText.match(/\d+(?=h)/) || 0;
  const mins = +durationEl.innerText.match(/\d+(?=m)/) || 0;
  const durationInHours = hours + mins / 60;

  return [level, +durationInHours];
}

function calcHardnessScore(level, durationInHours) {
  return Math.floor(level * (durationInHours + 3));
}

function renderHardnessScore(playerEl, hardnessScore) {
  playerEl.querySelector('.bustr-hardness-score').textContent = hardnessScore;
}

function sortByHardnessScore(playerEl, hardnessScore) {
  playerEl.style.order = hardnessScore;
}

//// Callback functions
function submitFormCallback() {
  const inputEl = document.querySelector('#bustr-form__input');
  const submitBtnEl = document.querySelector('#bustr-form__submit');

  const apiKey = inputEl.value;
  if (apiKey.length !== 16) {
    inputEl.style.border = `2px solid ${redFlame}`;
    submitBtnEl.disabled = true;
    return;
  }
  setApiKey(apiKey);
  dismountBustrForm();
  window.location.reload();
}

function inputValidatorCallback(event) {
  const inputEl = document.querySelector('#bustr-form__input');
  const submitBtnEl = document.querySelector('#bustr-form__submit');
  if (event.target.value.length === 16) {
    submitBtnEl.disabled = false;
    inputEl.style.border = '1px solid #444';
  }
  if (event.target.value.length !== 16) {
    submitBtnEl.disabled = true;
  }
}

async function successfulBustMutationCallback(mutationList, observer) {
  try {
    for (const mutation of mutationList) {
      if (!mutation.target.innerText) return;
      if (mutation.target.innerText.match(/^(You busted ).+/) && mutation.removedNodes.length > 0) {
        observer.disconnect();
        console.log('SuccessfulBust', Date.now()); // TEST

        const newPenaltyScore = getPenaltyScore() + 128;
        setPenaltyScore(newPenaltyScore);

        const newAvailableBusts = calcAvailableBusts(getPenaltyScore(), getPenaltyThreshold());
        setAvailableBusts(newAvailableBusts);
        renderBustrStats({ availableBusts: getAvailableBusts(), penaltyScore: getPenaltyScore() });

        successfulBustUpdateController();
        renderBustrColorClass();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function hardnessScoreCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.target.classList.contains('user-info-list-wrap') && mutation.addedNodes.length > 1) {
      hardnessScoreController();
      observer.disconnect();
    }
  }
}

//// Observers
function createJailMutationObserver() {
  const jailObserver = new MutationObserver(successfulBustMutationCallback);
  jailObserver.observe(document, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

function createHardnessScoreObserver() {
  const harnessScoreObserver = new MutationObserver(hardnessScoreCallback);
  harnessScoreObserver.observe(document, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

////////  MODEL ////////
////  Getters and Setters
function setGlobalBustrState(newState) {
  GLOBAL_BUSTR_STATE = { ...GLOBAL_BUSTR_STATE, ...newState };
  localStorage.setItem('globalBustrState', JSON.stringify(GLOBAL_BUSTR_STATE));
  saveGlobalBustrState();
}
function getGlobalBustrState() {
  return GLOBAL_BUSTR_STATE;
}
function loadGlobalBustrState() {
  if (!localStorage.getItem('globalBustrState')) return;
  const loadedState = JSON.parse(localStorage.getItem('globalBustrState'));
  GLOBAL_BUSTR_STATE = { ...GLOBAL_BUSTR_STATE, ...loadedState };
  return localStorage.getItem('globalBustrState');
}
function saveGlobalBustrState() {
  localStorage.setItem('globalBustrState', JSON.stringify(getGlobalBustrState()));
}
function deleteGlobalBustrState() {
  GLOBAL_BUSTR_STATE = {
    userSettings: {
      reminderLimits: {
        redLimit: 0,
        greenLimit: 3,
      },
    },
    penaltyScore: 0,
    penaltyThreshold: 0,
    availableBusts: 0,
    timestampsArray: [],
  };
  localStorage.removeItem('bustrGlobalState');
}

function getMyViewportWidthType() {
  let width = visualViewport.width;

  if (width > 1000) return 'Desktop';
  if (width < 1000 || width) return 'Mobile';
  throw new Error('Visual viewport not loaded');
}





function setUserSettings(newUserSettings, currentState) {
  currentState = currentState || getGlobalBustrState();

  const newState = { ...currentState, userSettings: newUserSettings };
  setGlobalBustrState(newState);
}
function getUserSettings() {
  return getGlobalBustrState().userSettings;
}

function setRenderedView(newRenderedView, currentState) {
  currentState = currentState || getGlobalBustrState();

  const newState = { ...currentState, renderedView: newRenderedView };
  setGlobalBustrState(newState);
}
function getRenderedView(newRenderedView, currentState) {
  return getGlobalBustrState().renderedView;
}

function setTimestampsArray(newTimestampsArr, currentState) {
  currentState = currentState || getGlobalBustrState();

  return setGlobalBustrState({
    ...currentState,
    timestampsArray: newTimestampsArr,
  });
}
function getTimestampsArray() {
  return getGlobalBustrState().timestampsArray;
}

function setLastFecthTimestampMs(currentState) {
  currentState = currentState || getGlobalBustrState();

  const currentTimestampMs = Date.now();
  setGlobalBustrState({
    ...currentState,
    lastFetchTimestampMs: currentTimestampMs,
  });
}
function getLastFecthTimestampMs() {
  return getGlobalBustrState().lastFetchTimestampMs;
}

function setPenaltyThreshold(newPenaltyThreshold, currentState) {
  currentState = currentState || getGlobalBustrState();

  const newState = { ...currentState, penaltyThreshold: newPenaltyThreshold };
  setGlobalBustrState(newState);
}
function getPenaltyThreshold() {
  return getGlobalBustrState().penaltyThreshold;
}

function setPenaltyScore(newPenaltyScore, currentState) {
  currentState = currentState || getGlobalBustrState();

  const newState = { ...currentState, penaltyScore: newPenaltyScore };
  setGlobalBustrState(newState);
}
function getPenaltyScore() {
  return getGlobalBustrState().penaltyScore;
}

function setAvailableBusts(newAvailableBusts, currentState) {
  currentState = currentState || getGlobalBustrState();

  const newState = { ...currentState, availableBusts: newAvailableBusts };
  setGlobalBustrState(newState);
}
function getAvailableBusts() {
  return getGlobalBustrState().availableBusts;
}

////////  VIEW  ////////
////  Stylesheet
const bustrStylesheetHTML = `<style>
  .bustr--green {
    --color: ${greenApple}
  }
  .bustr--orange {
    --color: ${orangeFulvous}
  }
  .bustr--red {
    --color: ${redFlame}
  }
  .dark-mode.bustr--green,
  .bustr--green .swiper-slide {
    --color: ${greenApple}
  }
  .dark-mode.bustr--orange,
  .bustr--orange .swiper-slide {
    --color: ${orangeAmber}
  }
  .dark-mode.bustr--red,
  .bustr--red .swiper-slide {
    --color: ${redMelon}
  }

  #bustr-form.header-wrapper-top {
    display: flex;
  }
  #bustr-form.header-wrapper-top .container {
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 20px;
  }

  #bustr-form.header-wrapper-top h2 {
    display: block;
    text-align: center;
    margin: 0;
    width: 172px;
  }

  #bustr-form.header-wrapper-top input {
    background: linear-gradient(0deg,#111,#000);
    border-radius: 5px;
    box-shadow: 0 1px 0 hsla(0,0%,100%,.102);
    box-sizing: border-box;
    color: #9f9f9f;
    display: inline;
    font-weight: 400;
    height: 24px;
    width: clamp(170px, 50%, 250px);
    margin: 0 0 0 21px;
    outline: none;
    padding: 0 10px 0 10px;
    
    font-size: 12px;
    font-style: italic; 
    vertical-align: middle;
    border: 0;
    text-shadow: none;
    z-index: 100;
  }
  #bustr-form.header-wrapper-top a {
    margin: 0 8px;
  }

  #nav-jail .bustr-stats,
  #bustr-context .bustr-stats {
    color: var(--color, inherit);
  }
  #nav-jail .bustr-stats span {
    margin-left: unset;
  }

  #bustr-context.contextMenu___bjhoL {
    display: none;
    left: unset;
    right: -92px;
    padding: 0 8px;
    z-index: 9999;
  }
  .contextMenuActive___e6i_B #bustr-context.contextMenu___bjhoL {
    display: flex;
  }
  #bustr-context.contextMenu___bjhoL .arrow___tKP13 {
    right: unset;
    left: -6px;
    border-width: 8px 6px 8px 0;
    border-color: transparent #444 transparent transparent;
  }
  #bustr-context.contextMenu___bjhoL .arrow___tKP13:before {
    border-color: transparent #373636 transparent transparent;
    border-width: 6px 5px 6px 0;
    content: "";
    left: unset;
    right: -6px;
    top: -6px;
  }

  #prefs-tab-menu #bustr-settings {
    display: none;
  }
  #prefs-tab-menu #bustr-settings.active {
    display: block;
  }
  #bustr-settings input[type="number"] {
    height: 24px;
    width: 48px;
    padding: 1px 5px;
    text-align: center;
  }

  #bustr-settings-dropdown:hover {
    background: #fff;
  }
  .dark-mode #prefs-tab-menu #bustr-settings-dropdown:hover {
    background: #444;
  }
  #prefs-tab-menu #bustr-settings-sidetab.active {
    background: #fff;
    color: #999
  }
  .dark-mode #prefs-tab-menu #bustr-settings-sidetab.active {
    background: #444;
    color: #999
  }

  #body .users-list-title {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  #body .users-list-title .title{
    width: 269px;
  }
  #body .users-list-title .time{
    width: 50px;
  }
  #body .users-list-title .level{
    width: 53px;
  }
  #body .users-list-title .reason{
    width: 205px;
  }
  #body .users-list-title .hardness{
    display: block;
    width: 79px;
    text-align: center;
  }

  #body .user-info-list-wrap > li .info-wrap .hardness {
    display: block; 
    text-align: center;
  }
  #body .user-info-list-wrap > li .info-wrap .hardness span.title {
    display: none;
  }

  #body .user-info-list-wrap {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
  #body .user-info-list-wrap > li  {
    display: flex; 
    flex-wrap: wrap; 
    justify-content: start; 
    align-items: center;
  }

  #body .user-info-list-wrap > li .info-wrap {
    display: flex; 
    flex-wrap: wrap;
    justify-content: start; 
    align-items: center;
  }
  #body .user-info-list-wrap > li .info-wrap .time {
    width: 54px;
  }
  #body .user-info-list-wrap > li .info-wrap .level {
    width: 57px;
  }
  #body .user-info-list-wrap > li .info-wrap .reason {
    width: 193px;
  }
  #body .user-info-list-wrap > li .info-wrap .hardness {
    width: 50px;
  }

  @media screen and (max-width:1000px) {
    #bustr-form.header-wrapper-top h2 {
      width: 148px;
    }
    #bustr-form.header-wrapper-top input {
      margin-left: 10px;
    }
  }
  @media screen and (max-width:784px) {
    #bustr-form.header-wrapper-top h2 {
      font-size: 16px;
      width: 80px;
    }
    #body .users-list-title .hardness{
      display: none;
    }
    #body .user-info-list-wrap > li .info-wrap .hardness span.title{
      display: block;
    }
    #body .user-info-list-wrap > li .info-wrap .reason {
      width: 164px;
      border-right: 1px solid rgb(34, 34, 34);
    }
    #body .user-info-list-wrap > li .info-wrap .hardness {
      width: 64px;
    }
  }
    @media screen and (max-width:386px) {
      
      #body .user-info-list-wrap > li .info-wrap .time {
        width: 98px;
        height: 37px;
      }
      #body .user-info-list-wrap > li .info-wrap .level {
        width: 91px;
        height: 37px;
      }
      #body .user-info-list-wrap > li .info-wrap .reason {
        width: 171px;
        height: 24px;
        border-right: 1px solid rgb(34, 34, 34);
      }
      #body .user-info-list-wrap > li .info-wrap .hardness {
        width: 107px;
      }
    }
  }
    </style>`;
function renderBustrStylesheet() {
  const headEl = document.querySelector('head');
  headEl.insertAdjacentHTML('beforeend', bustrStylesheetHTML);
}

function renderBustrColorClass(availableBusts) {
  const redLimit = typeof getUserSettings().reminderLimits.redLimit === 'number' ? getUserSettings().reminderLimits.redLimit : 0;
  const greenLimit = typeof getUserSettings().reminderLimits.greenLimit === 'number' ? getUserSettings().reminderLimits.greenLimit : 3;

  if (+availableBusts <= redLimit) {
    if (document.body.classList.contains('bustr--red')) return;
    document.body.classList.add('bustr--red');
    document.body.classList.remove('available___ZS04X', 'bustr--green', 'bustr--orange');
    return;
  }

  if (+availableBusts >= greenLimit) {
    if (document.body.classList.contains('bustr--green')) return;
    document.body.classList.add('available___ZS04X', 'bustr--green');
    document.body.classList.remove('bustr--orange', 'bustr--red');
    return;
  }

  if (availableBusts > redLimit && availableBusts < greenLimit) {
    if (document.body.classList.contains('bustr--orange')) return;
    document.body.classList.add('bustr--orange');
    document.body.classList.remove('available___ZS04X', 'bustr--green', 'bustr--red');
  }
}
//// Init form view
function renderBustrForm() {
  const topHeaderBannerEl = document.querySelector('#topHeaderBanner');
  const bustrFormHTML = `
      <div id="bustr-form" class="header-wrapper-top">
        <div class="container clear-fix">
          <h2>Bustr API</h2>
          <input
            id="bustr-form__input"
            type="text"
            placeholder="Enter a full-acces API key..."
          />
          <a href="#" id="bustr-form__submit"  type="btn" disabled><span class="link-text">Submit</span</button>
        </div>
      </div>`;

  topHeaderBannerEl.insertAdjacentHTML('afterbegin', bustrFormHTML);
}

function dismountBustrForm() {
  document.querySelector('#bustr-form').remove();
}

function renderBustrStats(statsObj) {
  for (const [key, value] of Object.entries(statsObj)) {
    const statsElArr = [...document.querySelectorAll(`.bustr-stats__${key}`)];
    statsElArr.forEach((el) => (el.textContent = value));
  }
}

async function requireElement(selectors) {
  try {
    await new Promise((res, rej) => {
      if (document.querySelector(selectors)) res();

      maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (document.querySelector(selectors)) {
          clearInterval(interval);
          res();
        }
        if (current === maxCycles) {
          clearInterval(interval);
          rej('Timeout: Could not find jail link');
        }
        current++;
      }, 10);
    });
  } catch (err) {
    console.error(err);
  }
}

//// Desktop view
async function renderBustrDesktopView() {
  try {
    await requireElement('#nav-jail a');
    const jailLinkEl = document.querySelector('#nav-jail a');
    if (jailLinkEl.querySelector('.bustr-stats')) return;

    const statsHTML = `
        <span class="amount___p8QZX bustr-stats">
          <span class="bustr-stats__penaltyScore">#</span> / <span class="bustr-stats__penaltyThreshold">#</span> : <span class="bustr-stats__availableBusts">#</span>
        </span>`;

    jailLinkEl.insertAdjacentHTML('beforeend', statsHTML);
  } catch (err) {
    console.error(err);
  }
}

//// Mobile view
function renderMobileBustrNotification() {
  const jailLinkEl = document.querySelector('#nav-jail a');

  const notificationHTML = `
    <div class="mobileAmount___ua3ye bustr-stats"><span class="bustr-stats__availableBusts">#</span></div>`;
  jailLinkEl.insertAdjacentHTML('beforebegin', notificationHTML);
}

async function renderBustrMobileView() {
  try {
    await requireElement('#nav-jail a');
    const jailLinkEl = document.querySelector('#nav-jail');
    if (jailLinkEl.querySelector('.bustr-stats')) return;

    renderMobileBustrNotification();

    const bustrContextMenuHTML = `
      <div id="bustr-context" class='contextMenu___bjhoL bustr-context-menu'>
        <span class='linkName___FoKha bustr-stats'>
        <span class="bustr-stats__penaltyScore">#</span> / <span class="bustr-stats__penaltyThreshold">#</span> : <span class="bustr-stats__availableBusts">#</span>
        </span>
        <span class='arrow___tKP13 bustr-arrow'></span>
      </div>`;

    jailLinkEl.insertAdjacentHTML('afterend', bustrContextMenuHTML);
  } catch (err) {
    console.err(err);
  }
}

function renderHardnessJailView() {
  const headingsContainerEl = document.querySelector('.users-list-title');
  const hardnessTitleHTML = `
    <span class="hardness title-divider divider-spiky">Hardness</span>`;
  if (!headingsContainerEl.querySelector('span.hardness')) {
    headingsContainerEl.children[3].insertAdjacentHTML('afterend', hardnessTitleHTML);
  }

  const playerRowsArr = [...document.querySelectorAll('.user-info-list-wrap > li')];
  playerRowsArr.forEach((el) => {
    const playerInfoContainerEl = el.querySelector('.info-wrap');
    const hardnessScoreHTML = `
      <span class="hardness reason">
        <span class="title bold">HARDNESS</span>
        <span class="bustr-hardness-score">#####</span>
      </span>`;

    if (!playerInfoContainerEl) return;
    if (!playerInfoContainerEl.querySelector('.hardness.reason')) {
      playerInfoContainerEl.children[2].insertAdjacentHTML('afterend', hardnessScoreHTML);
    }
  });
}

////////  CONTROLLERS  ////////
async function initController() {
  try {
    renderBustrStylesheet();

    if (isPDA() && !getApiKey()) {
      setApiKey(PDA_API_KEY);
    }

    if (getMyViewportWidthType() === 'Desktop') {
      await renderBustrDesktopView();
      setRenderedView('Desktop');
    }
    if (getMyViewportWidthType() === 'Mobile') {
      await renderBustrMobileView();
      setRenderedView('Mobile');
    }

    if (getApiKey()) return;

    // if not saved render bustr form
    renderBustrForm();

    // set event liseners
    //// Event listeners
    document.querySelector('#bustr-form__submit').addEventListener('click', submitFormCallback);
    document.querySelector('#bustr-form__input').addEventListener('input', inputValidatorCallback);
    document.querySelector('#bustr-form__input').addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        submitFormCallback();
      }
    });
  } catch (err) {
    console.error(err);
  }
}

//// load
async function loadController() {
  try {
    // guard clause if no api key
    if (!getApiKey()) return;

    if (loadGlobalBustrState()) {
      loadGlobalBustrState();
    }

    // fetch data
    const data = await fetchBustsData(getApiKey());
    setTimestampsArray(createTimestampsArray(data));

    const statsObj = calcBustrStats(getTimestampsArray());
    setPenaltyScore(statsObj.penaltyScore);
    setPenaltyThreshold(statsObj.penaltyThreshold);
    setAvailableBusts(statsObj.availableBusts);

    // render color class
    renderBustrColorClass(getAvailableBusts());

    // render stats
    renderBustrStats(statsObj);
  } catch (err) {
    // deleteApiKey();
    console.error(err);
  }
}

function successfulBustUpdateController() {
  createJailMutationObserver();
}

function refreshStatsController() {
  const statsRefreshRate = typeof getUserSettings().statsRefreshRate === 'number' && getUserSettings().statsRefreshRate > 0 ? getUserSettings().statsRefreshRate : 60;
  setInterval(async () => {
    await loadController();
  }, statsRefreshRate * 1000 || 60000);
}

async function viewportResizeController() {
  try {
    visualViewport.addEventListener('resize', async (e) => {
      if (!getRenderedView()) return;

      const viewportWidthType = getMyViewportWidthType();
      if (viewportWidthType !== getRenderedView()) {
        initController();
        await loadController();
      }
    });
  } catch (error) {
    console.error(error); // TEST
  }
}

function hardnessScoreController() {
  if (window.location.pathname !== '/jailview.php') return;
  createHardnessScoreObserver();

  renderHardnessJailView();
  const playersArr = [...document.querySelectorAll('ul.user-info-list-wrap > li')];

  if (playersArr[0].classList.contains('last')) return;
  for (const playerEl of playersArr) {
    const [level, durationInHours] = getLevelJailDurationInfo(playerEl);
    const hardnessScore = calcHardnessScore(level, durationInHours);
    renderHardnessScore(playerEl, hardnessScore);
    sortByHardnessScore(playerEl, hardnessScore);
  }
}

//// Promise race conditions
// necessary as PDA scripts are inject after window.onload
const PDAPromise = new Promise((res, rej) => {
  if (document.readyState === 'complete') res();
});

const browserPromise = new Promise((res, rej) => {
  window.addEventListener('load', () => res());
});

(async function () {
  try {
      registerScriptMenu();
    await Promise.race([PDAPromise, browserPromise]);
    await initController();
    await loadController();
    if (getUserSettings().showHardnessScore) {
      hardnessScoreController();
    }
    successfulBustUpdateController();
    refreshStatsController();
    viewportResizeController();
  } catch (err) {
    console.error(err);
  }
})();
