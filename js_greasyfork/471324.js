// ==UserScript==
// @name         ChatGPT Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve ChatGPT experience
// @author       Charles
// @run-at       document-end
// @match        https://chat.openai.com/*
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471324/ChatGPT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/471324/ChatGPT%20Helper.meta.js
// ==/UserScript==

var buttonList = [
    {Name: "翻譯成繁體中文", Message: "翻譯成繁體中文"},
    {Name: "繼續", Message: "繼續"}
];

(function () {
    "use strict";

    // Your code here...

    createHelperDiv();
})();

// 傳送指定訊息
function sendMessage(message) {
    // 取得用來確認目前是否可傳送的按鈕
    let checkButton = document.querySelector(
        '.relative[role="presentation"] > div > div > button > div'
    );
    if (checkButton !== null && checkButton.innerText !== "Regenerate response") return;
    //   copy text
    let inputArea = document.querySelector("#prompt-textarea");
    let sendButton = document.querySelector("#prompt-textarea + button");
    let origin = inputArea.value;
    inputArea.value = message;
    let inputEventSimulator = new InputEvent("input", {bubbles: true});
    inputArea.dispatchEvent(inputEventSimulator);
    inputArea.value = origin;
    setTimeout(() => {
        sendButton.click();
    }, 300);
}

// 創建輔助工具的UI
function createHelperDiv() {
    let div = document.createElement("div");
    div.id = "gpt_helper";
    div.innerHTML = `
    <div class="gpt_helper_buttons">
    </div>
  `;
    let insertDiv = document.querySelector("#__next");
    insertDiv.appendChild(div);
    let buttonBar = div.querySelector(".gpt_helper_buttons");

    for (let i = 0; i < buttonList.length; i++) {
        let button = document.createElement("button");
        button.className = "gpt_helper_button";
        button.innerText = buttonList[i].Name;
        button.addEventListener("click", () => sendMessage(buttonList[i].Message));
        buttonBar.appendChild(button);
    }

    addStyle();
}

// 加入CSS
function addStyle() {
    GM_addStyle(
        `#gpt_helper {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        justify-content: end;
        align-items: center;
        pointer-events: none;
      }
      
      #gpt_helper > .gpt_helper_buttons {
        width: 150px;
        height: 300px;
        pointer-events: all;
      }
      
      #gpt_helper > .gpt_helper_buttons .gpt_helper_button {
        appearance: none;
        background-color: #2ea44f;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-radius: 6px;
        box-shadow: rgba(27, 31, 35, 0.1) 0 1px 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
          sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        padding: 6px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: middle;
        white-space: nowrap;
        width: 100%;
        margin: 5px;
      }
      
      #gpt_helper
        > .gpt_helper_buttons
        .gpt_helper_button:focus:not(:focus-visible):not(.focus-visible) {
        box-shadow: none;
        outline: none;
      }
      
      #gpt_helper > .gpt_helper_buttons .gpt_helper_button:hover {
        background-color: #2c974b;
      }
      
      #gpt_helper > .gpt_helper_buttons .gpt_helper_button:focus {
        box-shadow: rgba(46, 164, 79, 0.4) 0 0 0 3px;
        outline: none;
      }
      
      #gpt_helper > .gpt_helper_buttons .gpt_helper_button:disabled {
        background-color: #94d3a2;
        border-color: rgba(27, 31, 35, 0.1);
        color: rgba(255, 255, 255, 0.8);
        cursor: default;
      }
      
      #gpt_helper > .gpt_helper_buttons .gpt_helper_button:active {
        background-color: #298e46;
        box-shadow: rgba(20, 70, 32, 0.2) 0 1px 0 inset;
      }
      `
    );
}
