// ==UserScript==
// @name                ChatGPT Interface Optimization
// @name:zh-CN          ChatGPT 界面优化
// @version             2023.6.18
// @description         Hide sidebar shortcut, input box size, window width can be custom adjusted
// @description:zh-CN   隐藏侧边栏快捷键、输入框大小、窗口宽度自定义调整
// @match               https://chat.openai.com/*
// @grant               GM_addStyle
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @namespace           your-unique-namespace
// @downloadURL https://update.greasyfork.org/scripts/467789/ChatGPT%20Interface%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/467789/ChatGPT%20Interface%20Optimization.meta.js
// ==/UserScript==




(async () => {
  let height = GM_getValue('height', 0);
  let width = GM_getValue('width', 0);
  let windowWidth = GM_getValue('windowWidth', 0);
  let HideTheBottomSisclaimer = GM_getValue('HideTheBottomSisclaimer', true);
  let ThumbsUpFeedback = GM_getValue('ThumbsUpFeedback', true);
  let keyModifier = GM_getValue('keyModifier', 'ctrl');
  let keyLetter = GM_getValue('keyLetter', 'b');
  let NewSessionKey = GM_getValue('NewSessionKey', 'ctrl');
  let NewSessionkeyLetter = GM_getValue('NewSessionkeyLetter', 'q');


  let langText = {
    "zh-CN": {
      "settings": "设置",
      "note": "注意: 0 为官方默认宽度, 100 宽度将占满整个浏览器视口(以全屏为基准), 具体显示效果会因设备的屏幕大小和分辨率而有所差异",
      "textBoxHeight": "文本框高度(0-100):",
      "inputBoxWidth": "输入框宽度(0-100):",
      "dialogWindowWidth": "对话窗口宽度(0-100):",
      "shortcutKeys": "隐藏侧边栏快捷键(a-z):",
      "close": "关闭",
      "hideBottomDisclaimer": "隐藏底部免责声明:",
      "hideFeedbackButtons": "隐藏赞、踩反馈按钮:",
      "importantNote": "!!!请注意: 此脚本提供了隐藏页面底部免责声明和反馈按钮的选项，但这可能不符合 OpenAI 的使用条款。使用者应了解这两个功能的重要性：免责声明是对用户的重要信息提示，而反馈按钮是帮助 OpenAI 收集并改进 ChatGPT 的重要工具。因此，",
      "importantNoteWeight_800": "如果你选择使用这个脚本，我们建议你保留这两个功能。",
      "cancel": "取消",
      "ok": "确定",
      "create": "新建对话快捷键(a-z):",
    },
    "en-US": {
      "settings": "Settings",
      "note": "Note: 0 is the default official width, 100 width will fill the entire browser viewport (based on full screen), the specific display effect will vary due to the screen size and resolution of the device",
      "textBoxHeight": "Text box height(0-100):",
      "inputBoxWidth": "Input box width(0-100):",
      "dialogWindowWidth": "Chat window width(0-100):",
      "shortcutKeys": "Hide sidebar shortcut keys(a-z):",
      "close": "Close",
      "hideBottomDisclaimer": "Hide the bottom disclaimer:",
      "hideFeedbackButtons": "Hide the feedback buttons:",
      "importantNote": "!!!Please note: This script provides the option to hide the bottom disclaimer and feedback buttons, but this may not comply with OpenAI's terms of use. Users should understand the importance of these two features: the disclaimer is an important information prompt for users, and the feedback button is an important tool to help OpenAI collect and improve ChatGPT. Therefore, ",
      "importantNoteWeight_800": "if you choose to use this script, we recommend that you keep these two features.",
      "cancel": "Cancel",
      "ok": "OK",
      "create": "create a conversation shortcut key(a-z):",
    }
  };

  let lang = navigator.language;

  function openDialog() {
    let dialog = document.createElement('div');
    dialog.id = 'Tampermonkey_setting_Box'
    dialog.innerHTML = `
    <div>
    <div id="qwerSettingBox">
      <h2 id="qwerSettingBox_title">${langText[lang]['settings']}</h2>
      <h6 id="qwerSettingBox_hint">${langText[lang]['note']}</h6>
      <label class="qwerSettingBox_label">
        ${langText[lang]['textBoxHeight']}
        <input class="input" min="0" max="100" id="dialogHeight" type="number" value="${height}">
      </label>
      <label class="qwerSettingBox_label">
        ${langText[lang]['inputBoxWidth']}
        <input class="input" min="0" max="100" id="dialogWidth" type="number" value="${width}">
      </label>
      <label class="qwerSettingBox_label">
        ${langText[lang]['dialogWindowWidth']}
        <input class="input" min="0" max="100" id="dialogWindowWidth" type="number" value="${windowWidth}">
      </label>
      <label id="shortcutSetting" class="qwerSettingBox_label">
        ${langText[lang]['shortcutKeys']}
        <div class="FullScreenModeShortcutKeys">
          <select id="keyModifier">
            <option value="ctrl" ${keyModifier === 'ctrl' ? 'selected' : ''}>ctrl</option>
            <option value="alt" ${keyModifier === 'alt' ? 'selected' : ''}>alt</option>
            <option value="shift" ${keyModifier === 'shift' ? 'selected' : ''}>shift</option>
            <option value="null" ${keyModifier === 'null' ? 'selected' : ''}>${langText[lang]['close']}</option>
          </select>
          +
          <input class="input" id="keyLetter" type="text" value="${keyLetter}">
        </div>
      </label>
           <label id="shortcutSetting_new" class="qwerSettingBox_label">
        ${langText[lang]['create']}
        <div class="FullScreenModeShortcutKeys">
          <select id="NewSessionKey">
            <option value="ctrl" ${NewSessionKey === 'ctrl' ? 'selected' : ''}>ctrl</option>
            <option value="alt" ${NewSessionKey === 'alt' ? 'selected' : ''}>alt</option>
            <option value="shift" ${NewSessionKey === 'shift' ? 'selected' : ''}>shift</option>
            <option value="null" ${NewSessionKey === 'null' ? 'selected' : ''}>${langText[lang]['close']}</option>
          </select>
          +
          <input class="input" id="NewSessionkeyLetter" type="text" value="${NewSessionkeyLetter}">
        </div>
      </label>
      <span id="qwerSettingBox_hint_2" style="color: #ff3816d6;">${langText[lang]['importantNote']}<span
          style="font-weight: 800;">${langText[lang]['importantNoteWeight_800']}</span></span>
      <label class="qwerSettingBox_label">
        ${langText[lang]['hideBottomDisclaimer']}
        <input id="HideTheBottomSisclaimer" type="checkbox" ${HideTheBottomSisclaimer ? 'checked' : ''}>
      </label>
      <label class="qwerSettingBox_label">
        ${langText[lang]['hideFeedbackButtons']}
        <input id="ThumbsUpFeedback" type="checkbox" ${ThumbsUpFeedback ? 'checked' : ''}>
      </label>
      <div id="qwerSettingBox_button">
        <button id="dialogCancel" style="background-color: #EA4335;">${langText[lang]['cancel']}</button>
        <button id="dialogOK" style="background-color: #4285F4;">${langText[lang]['ok']}</button>
      </div>
    </div>
  </div>`;
    document.body.appendChild(dialog);

    document.getElementById('dialogOK').onclick = function () {
      let newHeight = document.getElementById('dialogHeight').value;
      let newWidth = document.getElementById('dialogWidth').value;
      let newWindowWidth = document.getElementById('dialogWindowWidth').value;
      let newHideTheBottomSisclaimer = document.getElementById('HideTheBottomSisclaimer').checked;
      let newThumbsUpFeedback = document.getElementById('ThumbsUpFeedback').checked;
      let newKeyModifier = document.getElementById('keyModifier').value;
      let newKeyLetter = document.getElementById('keyLetter').value;
      let newNewSessionKey = document.getElementById('NewSessionKey').value;
      let newNewSessionkeyLetter = document.getElementById('NewSessionkeyLetter').value;

      GM_setValue('height', Number(newHeight));
      GM_setValue('width', Number(newWidth));
      GM_setValue('windowWidth', Number(newWindowWidth));
      GM_setValue('HideTheBottomSisclaimer', newHideTheBottomSisclaimer);
      GM_setValue('ThumbsUpFeedback', newThumbsUpFeedback);
      GM_setValue('keyModifier', newKeyModifier);
      GM_setValue('keyLetter', newKeyLetter);
      GM_setValue('NewSessionKey', newNewSessionKey);
      GM_setValue('NewSessionkeyLetter', newNewSessionkeyLetter);
      location.reload();
    };
    document.getElementById('dialogCancel').onclick = function () {
      document.body.removeChild(dialog);
    };
  }
  GM_registerMenuCommand(`${langText[lang]['settings']}`, openDialog);


  if (keyModifier) {
    const DOMSidebarButtons = 'a[class="flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-11 flex-shrink-0 items-center justify-center"]';

    await isLoaded();
    function isLoaded() {
      return new Promise(resolve => {
        var interval_id = setInterval(() => {
          if (document.querySelector(DOMSidebarButtons)) {
            clearInterval(interval_id);
            resolve();
          }
        }, 100);
      });
    }

    let sidebarButtons = document.querySelector(DOMSidebarButtons);

    var navObserver = new MutationObserver(([{ addedNodes, type }]) => {
      if (type === 'childList' && addedNodes.length) {
        setTimeout(() => {
          sidebarButtons = document.querySelector(DOMSidebarButtons);
        }, 20);
      }
    })

    navObserver.observe(document.documentElement, { childList: true, subtree: true })
    window.addEventListener('keydown', (event) => {
      if (event[`${keyModifier}Key`] && event.key.toLowerCase() === keyLetter.toLowerCase()) {
        sidebarButtons.click();
      }
    });
  }

  if (NewSessionKey) {
    const DOMNewSessionButton = 'a[class="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 flex-shrink-0 flex-grow"]';

    await isLoaded();
    function isLoaded() {
      return new Promise(resolve => {
        var interval_id = setInterval(() => {
          if (document.querySelector(DOMNewSessionButton)) {
            clearInterval(interval_id);
            resolve();
          }
        }, 100);
      });
    }

    let newSessionButton = document.querySelector(DOMNewSessionButton);
    var newSessionObserver = new MutationObserver(([{ addedNodes, type }]) => {
      if (type === 'childList' && addedNodes.length) {
        setTimeout(() => {
          newSessionButton = document.querySelector(DOMNewSessionButton);
        }, 20);
      }
    })

    newSessionObserver.observe(document.documentElement, { childList: true, subtree: true })

    window.addEventListener('keydown', (event) => {
      if (event[`${NewSessionKey}Key`] && event.key.toLowerCase() === NewSessionkeyLetter.toLowerCase()) {
        newSessionButton.click();
      }
    });
  }


  const observer = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        let _aB1cD2eF3 = document.querySelector('div[class="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white"]');
        if (_aB1cD2eF3) {
          let Gh4iJ5kL6m = _aB1cD2eF3.textContent;
          let n7oP8qR9sT = Gh4iJ5kL6m.split("@");
          let uV0wX1yZ2A = n7oP8qR9sT[0];
          let B3C4D5E6F7 = n7oP8qR9sT[1];
          let G8H9I0J1K2 = uV0wX1yZ2A.substring(0, 2) + '***';
          let V3W4X5Y6Z7 = G8H9I0J1K2 + `@${B3C4D5E6F7}`;
          _aB1cD2eF3.textContent = V3W4X5Y6Z7;
        }
      }
    }
  });
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  observer.observe(targetNode, config);




  GM_addStyle(`
  #prompt-textarea {
    max-height: ${20.6 + (0.659 * Number(height))}vh !important;
  }
 
  .stretch {
    max-width: ${48 + (0.72 * Number(width))}rem !important;
  }
 
  .text-base {
    max-width: ${48 + (0.72 * Number(windowWidth))}rem !important
  }
 
  #Tampermonkey_setting_Box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    z-index: 9999;
  }
 
  #qwerSettingBox {
    padding: 20px;
    border-radius: 5px;
    width: 468px;
    height: auto;
    background: rgba(255, 255, 255, 0.93);
    backdrop-filter: blur(25px);
    margin-top: 100px;
  }
 
  #qwerSettingBox_title {
    margin-top: 0;
    color: #5F6368;
    text-align: center;
    margin-bottom: 20px;
  }
 
  #qwerSettingBox_hint,
  #qwerSettingBox_hint_2 {
    margin-top: 0;
    color: #ff9916;
    text-align: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
 
  .qwerSettingBox_label {
    display: block;
    margin-bottom: 10px;
    color: #5F6368;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
 
  .qwerSettingBox_label .input {
    width: 118px;
    height: 31px;
    border-radius: 8px;
  }
 
  .qwerSettingBox_label #HideTheBottomSisclaimer,
  .qwerSettingBox_label #ThumbsUpFeedback {
    margin-right: 76px;
    border-radius: 20px;
    width: 40px;
    height: 20px;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
  }
 
  .qwerSettingBox_label #keyLetter,
  .qwerSettingBox_label #NewSessionkeyLetter {
    width: 25px;
    height: 31px;
    border-radius: 8px;
    padding: 0px 5px;
  }
  .qwerSettingBox_label #keyModifier,
  .qwerSettingBox_label #NewSessionKey {
    width: 69px;
    height: 31px;
    border-radius: 8px;
    padding: 0px 5px;
  }
  .qwerSettingBox_label .FullScreenModeShortcutKeys {
    display: flex;
    align-items: center;
    width: 118px;
    justify-content: space-between;
  }
 
  #qwerSettingBox_button {
    margin-top: 30px;
    display: flex;
    justify-content: space-evenly;
  }
 
  #qwerSettingBox_button button {
    transition: all 0.2s;
    color: white;
    border: none;
    width: 67px;
    height: 38px;
    cursor: pointer;
    border-radius: 4px;
  }
 
  ${HideTheBottomSisclaimer ? `div[class="px-3 pb-3 pt-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-4 md:pb-6 md:pt-3"] {
 display: none !important;
  }
  div[class="relative flex h-full flex-1 items-stretch md:flex-col"] {
    margin-bottom: 45px !important;
  }
  ` : ''
    }
 
  ${ThumbsUpFeedback ? `div [class='flex gap-1'] {
 display: none !important;
  }
  ` : ''
    }
 
  @media (min-width: 1280px) {
    .text-base {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
 
  @media (min-width: 1024px) {
    .text-base {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
 
  @media (min-width: 1280px) {
    .stretch {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
 
  @media (min-width: 1024px) {
    .stretch {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
 
  #dialogCancel:hover {
    box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 28%);
    transform: translateY(-2px);
  }
 
  #dialogOK:hover {
    box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 28%);
    transform: translateY(-2px);
  }`)

})()