// ==UserScript==
// @name         copy-chatgpt-input
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  chatgpt发送前自动复制输入框内容到剪切板
// @author       SeekingLight233
// @match        https://chat.openai.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487837/copy-chatgpt-input.user.js
// @updateURL https://update.greasyfork.org/scripts/487837/copy-chatgpt-input.meta.js
// ==/UserScript==

(function () {
  'use strict';

  main()

  let copyTmp = "";

  function main() {
    console.log("init copy-input");
    const sendBtn = getSendBtn();
    const textAreaNode = getTextAreaNode();

    textAreaNode.addEventListener("input", (e) => {
      const val = e.target.value;
      copyTmp = val;
    })

    document.body.addEventListener("click", (event) => {
      const sendBtn = event.target.closest('[data-testid="send-button"]');
      if (sendBtn) {
        copyValue(copyTmp);
      }
    });

    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        copyValue(copyTmp)
      }
    })
  }

  function copyValue(value) {
    navigator.clipboard.writeText(value).then(() => {
      // console.log('copy input:', value);
    }).catch(err => {
      // console.error('copy failed', err);
    });
  }

  function getTextAreaNode() {
    return document.getElementsByTagName("textarea")?.[0];
  }

  function getTextAreaValue() {
    const node = getTextAreaNode();
    return node?.value ?? ""
  }

  function getSendBtn() {
    const textAreaNode = getTextAreaNode();
    const pNode = textAreaNode.parentElement;
    const sendBtn = pNode.querySelector('[data-testid="send-button"]');
    return sendBtn;
  }

})();