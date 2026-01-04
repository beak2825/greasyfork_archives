// ==UserScript==
// @name         TORN: Display Crime Chain
// @namespace    http://torn.city.com.dot.com.com
// @version      1.0.5
// @description  Calculates and displays your current crime chain
// @author       Ironhydedragon[2428902]
// @match        https://www.torn.com/page.php?sid=crimes*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/481776/TORN%3A%20Display%20Crime%20Chain.user.js
// @updateURL https://update.greasyfork.org/scripts/481776/TORN%3A%20Display%20Crime%20Chain.meta.js
// ==/UserScript==

let crimeChain = 0;

const redFlame = '#e64d1a';

const PDA_API_KEY = '###PDA-APIKEY###';
function isPDA() {
  const PDATestRegex = !/^(###).+(###)$/.test(PDA_API_KEY);
  console.log('REGEX', PDATestRegex); // TEST
  return PDATestRegex;
}

function setApiKey(apiKey) {
  localStorage.setItem('ihdScriptApiKey', apiKey);
}
function getApiKey() {
  return localStorage.getItem('ihdScriptApiKey');
}

const stylesheet = `
  <style>
  #crime-chain {
    cursor: unset;
  }

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
    background: linear-gradient(0deg, #111, #000);
    border-radius: 5px;
    box-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.102);
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

  @media screen and (max-width: 1000px) {
    #api-form.header-wrapper-top h2 {
      width: 148px;
    }
    #api-form.header-wrapper-top input {
      margin-left: 10px;
    }
  }
  @media screen and (max-width: 784px) {
    #api-form.header-wrapper-top h2 {
      font-size: 16px;
      width: 80px;
    }

    #crime-chain .linkTitle____NPyM {
      display: block;
    }
    #body.r .linksContainer___LiOTN {
      margin-left: 8px;
    }
  }

  </style>`;
function renderStylesheet() {
  document.head.insertAdjacentHTML('beforeend', stylesheet);
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
  if (document.querySelector('#api-form')) return;
  topHeaderBannerEl.insertAdjacentHTML('afterbegin', apiFormHTML);
}
function dismountApiForm() {
  document.querySelector('#api-form').remove();
}

function renderCrimeChainHTML() {
  console.log('🖼️ RENDERING CHAIN HTML'); // TEST
  const crimeChainHTML = `
    <div class="linksContainer___LiOTN">
      <span aria-labelledby="crime-chain" class="linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP link-container-CrimesHub" target="_self" id="crime-chain"
        ><span class="iconContainer___D5z6F linkIconContainer___Ep0LO"
          ><svg fill="#777777" height="17px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.891 31.891" xml:space="preserve">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  d="M30.543,5.74l-4.078-4.035c-1.805-1.777-4.736-1.789-6.545-0.02l-4.525,4.414c-1.812,1.768-1.82,4.648-0.02,6.424 l2.586-2.484c-0.262-0.791,0.061-1.697,0.701-2.324l2.879-2.807c0.912-0.885,2.375-0.881,3.275,0.01l2.449,2.42 c0.9,0.891,0.896,2.326-0.01,3.213l-2.879,2.809c-0.609,0.594-1.609,0.92-2.385,0.711l-2.533,2.486 c1.803,1.781,4.732,1.789,6.545,0.02l4.52-4.41C32.34,10.396,32.346,7.519,30.543,5.74z"
                ></path>
                <path
                  d="M13.975,21.894c0.215,0.773-0.129,1.773-0.752,2.381l-2.689,2.627c-0.922,0.9-2.414,0.895-3.332-0.012l-2.498-2.461 c-0.916-0.906-0.91-2.379,0.012-3.275l2.691-2.627c0.656-0.637,1.598-0.961,2.42-0.689l2.594-2.57 c-1.836-1.811-4.824-1.82-6.668-0.02l-4.363,4.26c-1.846,1.803-1.855,4.734-0.02,6.549l4.154,4.107 c1.834,1.809,4.82,1.818,6.668,0.018l4.363-4.26c1.844-1.805,1.852-4.734,0.02-6.547L13.975,21.894z"
                ></path>
                <path d="M11.139,20.722c0.611,0.617,1.611,0.623,2.234,0.008l7.455-7.416c0.621-0.617,0.625-1.615,0.008-2.234 c-0.613-0.615-1.611-0.619-2.23-0.006l-7.457,7.414C10.529,19.103,10.525,20.101,11.139,20.722z"></path>
              </g>
            </g></svg></span
        ><span class="linkTitle____NPyM"><span aria-label="current crime chain" id="crime-chain__current">###</span></span></span
      >
    </div>
    `;
  const titleContainerEl = document.querySelector('.crimes-app .heading___dOsMq');
  // const titleContainerEl = document.querySelector('.crimes-app .titleContainer___QrlWP');
  if (document.querySelector('#crime-chain')) return;
  titleContainerEl.insertAdjacentHTML('afterend', crimeChainHTML);
}

function renderCrimeChainCurrent() {
  console.log('⛓️', crimeChain); // TEST
  document.querySelector('#crime-chain__current').textContent = Math.floor(crimeChain);
}

async function fetchCrimes(toTimestamp) {
  const response = await fetch(`https://api.torn.com/user/?selections=log&cat=136${toTimestamp ? '&to=' + toTimestamp : ''}&key=${getApiKey()}`);
  const data = await response.json();
  return data;
}

async function calcCrimeChain() {
  try {
    let dataCollector = [];

    const initialData = await fetchCrimes();
    function dataCollectorUnshifter(fetchData) {
      for (const log in fetchData.log) {
        if (fetchData.log[log].title.match(/Crime (success|fail|critical fail)/gi)) {
          dataCollector.unshift(fetchData.log[log]);
        }
      }
    }
    dataCollectorUnshifter(initialData);
    while (dataCollector.filter((log) => log.title.match(/Crime critical fail/i)).length < 1) {
      const data = await fetchCrimes(dataCollector[0].timestamp - 1);
      dataCollectorUnshifter(data);
    }

    for (const d of dataCollector) {
      if (d.title.match(/Crime success/i)) {
        crimeChain++;
      }
      if (d.title.match(/Crime fail/i)) {
        crimeChain = crimeChain ? crimeChain / 2 : 0;
      }
      if (d.title.match(/Crime critical fail/i)) {
        crimeChain = 0;
      }
    }
  } catch (error) {
    console.error(error); // TEST
  }
}

//// Callbacks
function submitFormCallback() {
  const inputEl = document.querySelector('#api-form__input');
  const submitBtnEl = document.querySelector('#api-form__submit');

  const apiKey = inputEl.value;
  if (apiKey.length !== 16) {
    inputEl.style.border = `2px solid ${redFlame}`;
    submitBtnEl.disabled = true;
    return;
  }
  setApiKey(apiKey);
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

function updateCrimeCallback(mutationList) {
  for (const mutation of mutationList) {
    if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList && [...mutation.addedNodes[0].classList].join(' ').match(/crimes-outcome-/)) {
      const outcome = [...mutation.addedNodes[0].classList].join(' ').match(/(?<=crimes-outcome-)\w+/gi)[0];
      console.log('👀', outcome); // TEST

      if (outcome === 'success') {
        crimeChain++;
      }
      if (outcome === 'failure') {
        crimeChain = crimeChain / 2;
      }
      if (outcome === 'criticalFailure') {
        crimeChain = crimeChain / 2;
      }

      renderCrimeChainCurrent();
    }
  }
}

//////// CONTROLLERS ////////
function apiKeyFormController() {
  renderApiForm();

  // set event liseners
  //// Event listeners
  document.querySelector('#api-form__submit').addEventListener('click', submitFormCallback);
  document.querySelector('#api-form__input').addEventListener('input', inputValidatorCallback);
  document.querySelector('#api-form__input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      submitFormCallback();
    }
  });
  return;
}

function initController() {
  renderStylesheet();

  if (isPDA()) {
    console.log('🌟 IS PDA!!!!!', PDA_API_KEY); // TEST
    setApiKey(PDA_API_KEY);
  }

  if (!getApiKey()) {
    console.log('noAPIKey found'); // TEST
    apiKeyFormController();
    return;
  }

  renderCrimeChainHTML();
}

async function loadController() {
  await calcCrimeChain();
  renderCrimeChainCurrent();
}

function updateCrimeChainController() {
  const updateCrimeObserver = new MutationObserver(updateCrimeCallback);
  updateCrimeObserver.observe(document, { attributes: false, childList: true, subtree: true });
}

//// Promise race conditions
// necessary as PDA scripts are inject after window.onload
const PDAPromise = new Promise((res, rej) => {
  if (document.readyState === 'complete') res();
});

const browserPromise = new Promise((res, rej) => {
  window.addEventListener('load', () => res());
});

(async () => {
  try {
    console.log('⛓️ Crime chain script ON!'); // TEST
    await Promise.race([PDAPromise, browserPromise]);
    initController();
    if (getApiKey()) {
      await loadController();
      updateCrimeChainController();
    }
  } catch (error) {
    console.error(error); // TEST
  }
})();
