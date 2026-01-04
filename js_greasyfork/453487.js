// ==UserScript==
// @name        SpellJournal - Stable Diffusion UI
// @namespace   Violentmonkey Scripts
// @match       *://localhost:9000/*
// @grant       none
// @version     1.1
// @author      Sidem
// @license     MIT
// @description 10/21/2022, 7:42:01 AM
// @downloadURL https://update.greasyfork.org/scripts/453487/SpellJournal%20-%20Stable%20Diffusion%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/453487/SpellJournal%20-%20Stable%20Diffusion%20UI.meta.js
// ==/UserScript==

var styles = `
      #historyContainer {
        background: var(--background-color2);
        border: 1px solid var(--background-color3);
        border-radius: 7px;
        padding: 5px;
        margin: 5px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 20px 0 rgba(0, 0, 0, 0.15);
        max-width: 30%;
        max-height: 800px;
        overflow:hidden;
        overflow-y: auto;
        display:none;
      }
      .history-item {
        color: var(--button-text-color);
        padding: 5px;
        cursor: pointer;
        border: 1px solid black;
        margin: 2px;
        border-radius: 3px;
        background-color: hsl(var(--accent-hue), 100%, var(--accent-lightness));
      }
      .history-item:hover {
        background: hsl(var(--accent-hue), 100%, calc(var(--accent-lightness) + 6%));
      }
      .history-prompt {
      font-size: 0.7rem;
      }
      .history-infos {
      font-size: 0.7rem;
      }
      .history-btn {
        margin: 5px 5px 5px 0px;
      }
    `;
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerHTML = styles;
document.head.appendChild(styleSheet);


const toggleHistory = document.createElement('button');

function setSetup(stateObject) {
    promptField.value = stateObject.prompt;
    seedField.value = stateObject.seed;
    seedField.disabled = stateObject.random;
    randomSeedField.checked = stateObject.random;
    stableDiffusionModelField.value = stateObject.model;
    samplerField.value = stateObject.sampler;
    widthField.value = stateObject.width;
    heightField.value = stateObject.height;
    numInferenceStepsField.value = stateObject.steps;
    guidanceScaleField.value = stateObject.guidance;
    outputFormatField.value = stateObject.format;
    negativePromptField.value = stateObject.negative;
    streamImageProgressField.checked = stateObject.preview;
    useFaceCorrectionField.checked = stateObject.facefix;
    useUpscalingField.checked = stateObject.useUpscaling;
    upscaleModelField.value = stateObject.upscale;
    upscaleModelField.disabled = !stateObject.useUpscaling;
    guidanceScaleSlider.value = stateObject.guidance * 10;
    document.getElementById('prompt').dispatchEvent(new Event('input', {bubbles:true}));
}

function getSetup() {
    let stateObject = {
        prompt: promptField.value,
        seed: seedField.value,
        random: randomSeedField.checked,
        model: stableDiffusionModelField.value,
        sampler: samplerField.value,
        width: widthField.value,
        height: heightField.value,
        steps: numInferenceStepsField.value,
        guidance: guidanceScaleField.value,
        format: outputFormatField.value,
        negative: negativePromptField.value,
        preview: streamImageProgressField.checked,
        facefix: useFaceCorrectionField.checked,
        useUpscaling: useUpscalingField.checked,
        upscale: upscaleModelField.value,
    };
    return stateObject;
    //stateCodeField.value = btoa(JSON.stringify(stateObject));
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const buildHistoryItem = (timestamp, item) => {
  return `
  <div class="history-datetime">${new Date(timestamp).toLocaleString()}</div>
  <div class="history-prompt">${item.prompt}</div>
  <div class="history-infos">
    <span>negative: '${item.negative}'</span><br/>
    <span>sampler: '${item.sampler}'</span> <span>w: '${item.width}'</span> <span>h: '${item.height}'</span> <span>steps: '${item.steps}'</span> <span>scale: '${item.guidance}'</span><br/>
    <span>facefix: '${item.facefix}'</span> <span>upscale: '${item.useUpscaling}'</span> <span>seed: ${item.random ? 'random' : item.seed}</span>
  </div>
  `;
}

const loadHistory = () => {
  let historyContainer = document.getElementById('historyContainer');
  historyContainer.innerHTML = "";
  let historyItems = JSON.parse(localStorage.getItem('history'));
  console.log(historyItems);
  let currentItem = null;
  for (let item of historyItems) {
    currentItem = document.createElement('div');
    currentItem.id = 'history-item-'+item.id;
    currentItem.classList.add('history-item');
    currentItem.innerHTML = buildHistoryItem(item.timestamp, item.setup);
    currentItem.addEventListener('click', () => {setSetup(item.setup);});
    currentItem.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if(confirm("Are you sure you want to delete this history item?")) {
        for(let i = 0; i < historyItems.length; i++){
            if (historyItems[i].id === item.id) {
              historyItems.splice(i, 1);
              break;
            }
        }
        localStorage.setItem('history', JSON.stringify(historyItems));
        loadHistory();
      }
    });
    historyContainer.appendChild(currentItem);
  }
};

const saveHistoryItem = () => {
  let currentHistory = JSON.parse(localStorage.getItem('history'));
  if (currentHistory.length > 0) {
    let lastItem = currentHistory.at(0);
    let newId = lastItem.id + 1;
    let newItem = {
      id: newId,
      timestamp: Date.now(),
      setup: getSetup()
    };
    let a = {...lastItem.setup};
    let b = {...newItem.setup};
    if (JSON.stringify(a) !== JSON.stringify(b)) localStorage.setItem('history', JSON.stringify([newItem, ...currentHistory]));
  } else {
    let newItem = {
      id: 0,
      timestamp: Date.now(),
      setup: getSetup()
    };
    localStorage.setItem('history', JSON.stringify([newItem]));
  }
  loadHistory();
};

const toggleHistoryAction = () => {
  let historyContainer = document.getElementById('historyContainer');
  if (historyContainer.style.display == 'block') {
    historyContainer.style.display = 'none';
    toggleHistory.innerText = 'show history';
  } else {
    historyContainer.style.display = 'block';
    toggleHistory.innerText = 'hide history';
  }
};


window.addEventListener('load', () => {
    if (localStorage.getItem("history") === null) localStorage.setItem('history', "[]");
    let historyContainer = document.createElement('div');
    historyContainer.id = 'historyContainer';
    const editor = document.getElementById('editor');
    editor.parentNode.insertBefore(historyContainer, editor);
    let save = document.createElement('button');
    save.innerText = "save";
    save.addEventListener('click', saveHistoryItem);
    let makeImage = document.getElementById('makeImage');
    makeImage.addEventListener('click', saveHistoryItem);
    insertAfter(save, makeImage);
    toggleHistory.innerText = "show history";
    toggleHistory.classList.add("history-btn");
    save.classList.add("history-btn");
    toggleHistory.addEventListener('click', toggleHistoryAction);
    insertAfter(toggleHistory, save);
    loadHistory();
}, false);
