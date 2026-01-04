// ==UserScript==
// @name         TORN: Dowload WarReport as CSV
// @namespace    http://torn.city.com.dot.com.com
// @version      1.0.3
// @description  Displays a button that allows users to download a csv version of their war report
// @author       Ironhydedragon[2428902]
// @match        https://www.torn.com/war.php?step=rankreport*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/481989/TORN%3A%20Dowload%20WarReport%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/481989/TORN%3A%20Dowload%20WarReport%20as%20CSV.meta.js
// ==/UserScript==

//////// GLOBAL VARIABLES ////////
const PDA_API_KEY = '###PDA-APIKEY###';
function isPDA() {
  const PDATestRegex = !/^(###).+(###)$/.test(PDA_API_KEY);

  return PDATestRegex;
}

let GLOBAL_STATE = {
  // userId: USER_ID,
  factionId: undefined,
  reportId: undefined,
};

//////// MODEL /////////
function getGlobalState() {
  return GLOBAL_STATE;
}
function setGlobalState(newState) {
  GLOBAL_STATE = { ...getGlobalState(), ...newState };
}

function getApiKey() {
  return localStorage.getItem('tornDownloadCsvApiKey');
}
function setApikey(apiKey) {
  localStorage.setItem('tornDownloadCsvApiKey', apiKey);
}

// function getUserId() {
//   return getGlobalState().userId;
// }
// function setUserId(value, currentState) {
//   currentState = currentState || getGlobalState();
//   const newState = { ...currentState, userId: value };
//   return setGlobalState(newState);
// }

function getFactionId() {
  return getGlobalState().factionId;
}
function setFactionId(value, currentState) {
  currentState = currentState || getGlobalState();
  const newState = { ...currentState, factionId: value };
  return setGlobalState(newState);
}

function getReportId() {
  return getGlobalState().reportId;
}
function setReportId(value, currentState) {
  currentState = currentState || getGlobalState();
  const newState = { ...currentState, reportId: value[0] };
  return setGlobalState(newState);
}

async function fetchPlayerData(apiKey) {
  try {
    const response = await fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`);
    const data = await response.json();

    if (data.error && (data.error.error === 'Incorrect key' || data.error.error === 'Access level of this key is not high enough')) {
      throw new Error(`Something went wrong: ${data.error.error}`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

//////// UTIL FUNCITONS ////////
async function requireElement(selectors, conditionsCallback) {
  try {
    await new Promise((res, rej) => {
      maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (document.querySelector(selectors)) {
          if (conditionsCallback === undefined) {
            clearInterval(interval);
            return res();
          }
          if (conditionsCallback(document.querySelector(selectors))) {
            clearInterval(interval);
            return res();
          }
        }
        if (current === maxCycles) {
          clearInterval(interval);
          rej('Timeout: Could not find element on page');
        }
        current++;
      }, 10);
    });
  } catch (err) {
    console.error(err);
  }
}

//////// API FORM CODE ////////
function submitFormCallback() {
  const inputEl = document.querySelector('#api-form__input');
  const submitBtnEl = document.querySelector('#api-form__submit');

  const apiKey = inputEl.value;
  if (apiKey.length !== 16) {
    inputEl.style.border = `2px solid ${red}`;
    submitBtnEl.disabled = true;
    return;
  }
  setApikey(apiKey);
  dismountApiForm();
  window.location.reload();
}

function inputValidatorCallback(event) {
  const inputEl = document.querySelector('#api-form__input');
  const submitBtnEl = document.querySelector('#api-form__submit');
  if (event.target.value.length === 16) {
    submitBtnEl.disabled = false;
    inputEl.style.border = '1px solid #444';
  }
  if (event.target.value.length !== 16) {
    submitBtnEl.disabled = true;
  }
}

function renderApiFormStylesheet() {
  const apiFormStylesheetHTML = `
    <style>
      #api-form.header-wrapper-top {
        display: flex;
      }
      #api-form.header-wrapper-top .container {
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 20px;
      }

      #api-form.header-wrapper-top h2 {
        display: block;
        text-align: center;
        margin: 0;
        width: 172px;
      }

      #api-form.header-wrapper-top input {
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
      #api-form.header-wrapper-top a {
        margin: 0 8px;
      }
    </style>`;
  document.head.insertAdjacentHTML('beforeend', apiFormStylesheetHTML);
}

function renderApiForm() {
  const topHeaderBannerEl = document.querySelector('#topHeaderBanner');
  const apiFormHTML = `
        <div id="api-form" class="header-wrapper-top">
          <div class="container clear-fix"> 
            <h2>API Key</h2>
            <input
              id="api-form__input"
              type="text"
              placeholder="Enter a full-acces API key..."
            />
            <a href="#" id="api-form__submit"  type="btn" disabled><span class="link-text">Submit</span</button>
          </div>
        </div>`;

  topHeaderBannerEl.insertAdjacentHTML('afterbegin', apiFormHTML);

  // set event liseners
  //// Event listeners
  document.querySelector('#api-form__submit').addEventListener('click', submitFormCallback);
  document.querySelector('#api-form__input').addEventListener('input', inputValidatorCallback);
  document.querySelector('#api-form__input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      submitFormCallback();
    }
  });
}
function dismountApiForm() {
  document.querySelector('#api-form').remove();
}

function apiFormController() {
  renderApiFormStylesheet();
  renderApiForm();
}

//////// CSV RELATED CODE ////////
async function fetchRankedWarReport(reportID, apiKey) {
  const response = await fetch(`https://api.torn.com/torn/${reportID}?selections=rankedwarreport&key=${apiKey}`);
  return await response.json();
}

function createWarReportContent(dataObject) {
  let rows = [];

  dataObject = dataObject.rankedwarreport.factions;

  for (const faction in dataObject) {
    const factionName = dataObject[faction].name;
    rows.push(factionName);

    // const first = Object.keys(dataObject[faction].members)[0];
    // const headerRow = Object.keys(dataObject[faction].members[first]);
    const headerRow = ['Members', 'Level', 'Attacks', 'Score'];
    rows.push(headerRow);

    for (const member in dataObject[faction].members) {
      // rows.push(Object.values(dataObject[faction].members[member]));
      const rawRow = Object.values(dataObject[faction].members[member]);
      const customRow = rawRow
        .filter((item, index) => index !== 1)
        .map((item, index) => {
          if (index === 0) {
            return `${item} [${member}]`;
          }
          return item;
        });
      rows.push(customRow);
      console.log(member, customRow); // TEST
    }
  }

  return rows.map((row) => (Array.isArray(row) ? row.map((value) => `"${value}"`).join(';') : `"${row}"`)).join('\r\n');
}

function downloadCsv(data, fileName) {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.addEventListener('click', () => {});
  a.click();
}

// async function copyToClipBoard(data) {
//   try {
//     console.log('copyCSV'); // TEST

//     const blob = new Blob([data], { type: 'text/csv' });
//     // const clipboardItem = new ClipboardItem({
//     //   'text/plain': await new Promise((res) => {
//     //     res(blob);
//     //   }),
//     // });
//     navigator.clipboard.writeText([await blob.text()]);
//   } catch (error) {
//     console.error(error); // TEST
//   }
// }

async function exportCsvClickHandler(e) {
  try {
    const warReportData = await fetchRankedWarReport(getReportId(), getApiKey());
    const warReportContent = createWarReportContent(warReportData);

    downloadCsv(warReportContent, `Ranked War Report [${getReportId()}]`);
    // copyToClipBoard(warReportContent);

    e.target.classList.add('disable');
  } catch (error) {
    console.error(error); // TEST
  }
}

//////// VIEW ////////

function renderStylesheet() {
  const stylesheetHTML = `
    <style>
      #export-csv {
        float: right; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        margin-right: 10px
      }
      #export-csv:hover {
        cursor: pointer;
      }
      #export-csv.disable {
        color: #999;
      }
      #export-csv svg {
        padding-right: 2px
        fill: currentcolor;
        width: 15px;
        height: 16px;
      }
      #export-csv.disable csv {
        fill: #999;
      }
    </style>`;
  const headEl = document.querySelector('head');
  headEl.insertAdjacentHTML('beforeend', stylesheetHTML);
}

function renderExportCsvEl() {
  const linkHTML = `
    <span id="export-csv">
        <svg
          viewBox="0 0 64 64"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xml:space="preserve"
          xmlns:serif="http://www.serif.com/"
          style="fill: currentcolor; /* fill-rule: evenodd; */ /* clip-rule: evenodd; */ /* stroke-linejoin: round; */ /* stroke-miterlimit: 2; */"
          stroke="currentcolor"
        >
          <g id="SVGRepo_iconCarrier">
            <rect id="Icons" x="-576" y="-128" width="1280" height="800" style="fill: none"></rect>
            <path id="download" d="M48.089,52.095l0,4l-32.049,0l0,-4l32.049,0Zm-16.025,-4l-16.024,-16l8.098,0l-0.049,-24l15.975,0l0.048,24l7.977,0l-16.025,16Z"></path>
          </g>
          </svg>
          Export CSV
        </span>`;

  const titleContainerEl = document.querySelector('.war-report-wrap .title-black');
  titleContainerEl.insertAdjacentHTML('beforeend', linkHTML);

  document.querySelector('#export-csv').addEventListener('click', exportCsvClickHandler);
}

// function apiFormController() {} // TODO

//////// CONTROLLERS ////////
async function initController() {
  try {
    renderStylesheet();

    if (!getApiKey() && !isPDA()) {
      renderApiFormStylesheet();
      renderApiForm();
      return;
    }

    if (isPDA()) {
      setApikey(PDA_API_KEY);
    }

    const playerData = await fetchPlayerData(getApiKey());
    const factionId = playerData.faction.faction_id;
    setFactionId(factionId);

    const urlParams = new URLSearchParams(window.location.href);
    const reportId = urlParams.get('rankID').match(/\d*/);
    setReportId(reportId);
  } catch (error) {
    console.error(error);
  }
}

async function rankedWarCsvController() {
  try {
    await requireElement('.war-report-wrap .title-black');
    renderExportCsvEl();
  } catch (error) {
    console.error(error); // TEST
  }
}

//// Promise race conditions
// necessary as PDA scripts are inject after window.onload
// const PDAPromise = new Promise((res, rej) => {
//   if (document.readyState === 'complete') res();
// });

// const browserPromise = new Promise((res, rej) => {
//   window.addEventListener('load', () => res());
// });

(async () => {
  try {
    console.log('🔫 WarReport CSV script is on!'); // TEST
    // await Promise.race([PDAPromise, browserPromise]);
    await initController();
    if (getApiKey()) {
      await rankedWarCsvController();
    }
  } catch (error) {
    console.error(error); // TEST
  }
})();
