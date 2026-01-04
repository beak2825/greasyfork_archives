// ==UserScript==
// @name         Youtube Stream Spamer
// @version      2.0.3
// @author       The Legion
// @description  Youtube stream chat spam tool
// @include      *//www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    Youtube_Stream_Spamer
// @downloadURL https://update.greasyfork.org/scripts/485179/Youtube%20Stream%20Spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/485179/Youtube%20Stream%20Spamer.meta.js
// ==/UserScript==

const storage = GM_getValue('storage') || {};
const elements = {};

var settingsBox;

var chatBox;
var chatDocument;
var chatInput;
var sendButton;

var refreshTimer;
var spamTimer;

var tagsVisible;
var isEnabled;

var delay;
var randomDelay;

function main() {
  initStatsViewHidder();
  buildElements();
  refreshTimer = setInterval(refresh, 2 * 1000);
}

function saveStorage() {
  GM_setValue('storage', storage);
}

function buildElements() {
  let styleTag = document.createElement('style');
  styleTag.innerHTML = styleTagCss;

  let box = document.createElement('div');
  box.style.display = 'none';
  box.id = "youtube-stream-spamer-box";
  box.innerHTML = settingsTagHtml;

  elements.spamBox = box.querySelector('#spam-box');
  elements.spamBoxHeader = box.querySelector('#spam-box-header');
  elements.spamBoxHeaderArrow = box.querySelector('#spam-box-header-arrow');
  elements.spamBoxHeaderText = box.querySelector('#spam-box-header-text');
  elements.spamBoxBodyWrapper = box.querySelector('#spam-box-body-wrapper');
  elements.spamBoxBody = box.querySelector('#spam-box-body');
  elements.spamBoxDelay = box.querySelector('#spam-box-delay');
  elements.spamBoxRandom = box.querySelector('#spam-box-random');
  elements.spamBoxText = box.querySelector('#spam-box-text');
  elements.spamBoxEnable = box.querySelector('#spam-box-enable');

  elements.utilsBox = box.querySelector('#utils-box');
  elements.utilsBoxHeader = box.querySelector('#utils-box-header');
  elements.utilsBoxHeaderArrow = box.querySelector('#utils-box-header-arrow');
  elements.utilsBoxHeaderText = box.querySelector('#utils-box-header-text');
  elements.utilsBoxBodyWrapper = box.querySelector('#utils-box-body-wrapper');
  elements.utilsBoxBody = box.querySelector('#utils-box-body');
  elements.utilsBoxHideView = box.querySelector('#utils-box-hide-view');
  elements.utilsBoxHideViewBox = box.querySelector('#utils-box-hide-view-box');

  initCollapsibleView(elements.spamBoxBodyWrapper, elements.spamBoxHeader, elements.spamBoxHeaderArrow);
  initCollapsibleView(elements.utilsBoxBodyWrapper, elements.utilsBoxHeader, elements.utilsBoxHeaderArrow);
  initInputValueAutosave(elements.spamBoxText);
  initInputValueAutosave(elements.spamBoxDelay);
  initInputValueAutosave(elements.spamBoxRandom);

  elements.spamBoxEnable.onclick = onSpamSwitchClick;
  elements.utilsBoxHideViewBox.onchange = onUtilsBoxHideViewBoxChecked;

  elements.utilsBoxHideViewBox.checked = storage["utilsBoxHideViewBox_checked"];

  settingsBox = box;
  document.head.appendChild(styleTag);
}

function onUtilsBoxHideViewBoxChecked() {
  storage["utilsBoxHideViewBox_checked"] = elements.utilsBoxHideViewBox.checked;
  saveStorage();
}

function initStatsViewHidder() {
  let open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    const isStatEnpoint = /\.youtube.com\/api\/stats\/watchtime.*/.test(arguments[1])
    // При 'return;' ломается воспроизведение роликов
    if(isStatEnpoint && elements.utilsBoxHideViewBox?.checked) arguments[1] = '//www.youtube.com/';
    open.apply(this, arguments)
  };
}

function initCollapsibleView(view, button, arrow) {
  view.style.display = storage[view.id + '_is_displayed'] ? '' : 'none';
  arrow.textContent = view.style.display ? '►' : '▼';

  button.onclick = e => {
    let collapsed = view.style.display == 'none';
    view.style.display = collapsed ? '' : 'none';
    arrow.textContent = collapsed ? '▼' : '►';
    storage[view.id + '_is_displayed'] = collapsed;
    saveStorage();
  };
}

function initInputValueAutosave(input) {
  input.value = storage[input.id + "_value"] || '';
  input.onchange = e => {
    storage[input.id + "_value"] = input.value;
    saveStorage();
  };
}

function refresh() {
  var previousChatBox = document.getElementById("chat-container");

  if (previousChatBox && chatBox !== previousChatBox) previousChatBox.appendChild(settingsBox);

  chatBox = previousChatBox;
  chatDocument = chatBox?.childNodes[2]?.childNodes[2]?.contentWindow.document;

  refreshTags();
}

function refreshTags() {
  refreshChatTags();
  
  var hasChatBox =
    chatBox &&
    chatDocument/* &&
    chatInput &&
    chatInput.style.display != 'none'*/;

  if (tagsVisible && !hasChatBox) hideTags();
  else if (!tagsVisible && hasChatBox) showTags();
}

function hideTags() {
  settingsBox.style.display = "none";
  tagsVisible = false;
}

function showTags() {
  settingsBox.style.display = "";
  tagsVisible = true;
}

function onSpamSwitchClick() {
  if (isEnabled) {
    elements.spamBoxDelay.disabled = elements.spamBoxRandom.disabled = undefined;

    if (spamTimer) clearTimeout(spamTimer);
  }
  else {
    delay = elements.spamBoxDelay.value ? parseInt(elements.spamBoxDelay.value) : 20;
    randomDelay = elements.spamBoxRandom.value ? parseInt(elements.spamBoxRandom.value) : 5;

    if (!delay || delay <= 0) { alert("Неверная задержка"); return; }
    if ((!randomDelay && randomDelay !== 0) || randomDelay < 0) { alert("Неверная случайная задержка"); return; }

    elements.spamBoxDelay.disabled = elements.spamBoxRandom.disabled = "disabled";

    spamTimer = setTimeout(onSpamTimer, (delay + Math.random() * randomDelay) * 1000);
  }

  isEnabled = !isEnabled;
  elements.spamBoxEnable.textContent = isEnabled ? "Выключить" : "Включить";
}

function onSpamTimer() {
  if (isEnabled) {
    sendMessage();
    spamTimer = setTimeout(onSpamTimer, (delay + Math.random() * randomDelay) * 1000);
  }
}

function refreshChatTags() {
  chatInput = chatDocument?.getElementsByClassName("yt-live-chat-text-input-field-renderer")[1];
  sendButton = chatDocument?.getElementById("send-button")?.getElementsByClassName("yt-spec-button-shape-next")[0];
}

function sendMessage() {
  if (!chatInput || !sendButton) return;
  chatInput.focus();
  chatInput.textContent = elements.spamBoxText.value;
  chatInput.dispatchEvent(new Event('input', {bubles:true, cancelable:true}));
  setTimeout(() => sendButton.click(), 100);
}

const styleTagCss = `
  #youtube-stream-spamer-box span, label {
    color: var(--yt-spec-text-primary);
    font-size: 10pt;
  }

  #youtube-stream-spamer-box input, button {
    color: var(--ytd-searchbox-text-color);
    background-color: var(--yt-spec-additive-background);
    border: none;
    border-radius: 8px;
  }

  #youtube-stream-spamer-box button {
    background-color: var(--ytd-searchbox-legacy-button-color);
  }

  #youtube-stream-spamer-box button:hover {
    background-color: var(--ytd-searchbox-legacy-button-hover-border-color);
  }

  #youtube-stream-spamer-box button:active {
    background-color: var(--ytd-searchbox-legacy-border-shadow-color);
  }

  #spam-box, #utils-box {
    margin: 8px 0px 8px 0px;
  }

  #spam-box-header, #utils-box-header {
    border-bottom: 1px dotted var(--yt-spec-text-primary);
    cursor: pointer;
    user-select: none;
  }

  #spam-box-header-arrow, #utils-box-header-arrow {
    user-select: none;
    position: absolute;
  }

  #spam-box-header-text, #utils-box-header-text {
    display: block;
    position: relative;
    text-align: center;
  }

  #spam-box-body, #utils-box-body {
    display: grid;
    margin-top: 2px;
  }

  #spam-box-body > *, #utils-box-body > * {
    margin: 2px;
  }

  #spam-box-delay {
    grid-column: 1;
  }

  #spam-box-random {
    grid-column: 2;
  }

  #spam-box-text {
    grid-column: 1 / 3;
    grid-row: 2;
  }

  #spam-box-enable {
    grid-column: 1 / 3;
    grid-row: 3;
  }
`;

const settingsTagHtml = `
  <div id="spam-box">
    <div id="spam-box-header">
      <span id="spam-box-header-arrow">►</span>
      <span id="spam-box-header-text">Спам в чате</span>
    </div>
    <div id="spam-box-body-wrapper">
      <div id="spam-box-body">
        <input id="spam-box-delay"
               placeholder="Задержка (20 сек)"
               title="Задержка между отправлениями сообщений в чате"/>
        <input id="spam-box-random"
               placeholder="Случайная задержка (5 сек)"
               title="К основной задержке прибавляется случайное от нуля до указанного значения количество секунд"/>
        <input id="spam-box-text"
               placeholder="Текст"
               title="Текст, который будет спамиться в чате"/>
        <button id="spam-box-enable">Включить</button>
      </div>
    </div>
  </div>
  <div id="utils-box">
    <div id="utils-box-header">
      <span id="utils-box-header-arrow">►</span>
      <span id="utils-box-header-text">Утилиты</span>
    </div>
    <div id="utils-box-body-wrapper">
      <div id="utils-box-body">
        <div id="utils-box-hide-view">
          <input id="utils-box-hide-view-box" type="checkbox"/>
          <label for="utils-box-hide-view-box">Скрыть просмотр</label>
        </div>
      </div>
    </div>
  </div>
`;

main();