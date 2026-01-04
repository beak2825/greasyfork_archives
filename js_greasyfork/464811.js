// ==UserScript==
// @name         ChatGPT Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a float button to open ChatGPT window in any web page.
// @author       hua03
// @match        https://www.google.com
// @icon         https://chat.openai.com/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464811/ChatGPT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464811/ChatGPT%20Helper.meta.js
// ==/UserScript==


(function () {
  // ChatGPT地址
  const ChatGPTServer = 'https://chat.openai.com/';
  // 交互窗口宽度
  const windowWidth = 480;
  // 交互窗口高度
  const windowHeight = 800;

  // 是否已经打开交互弹窗
  let isOpenChatGPTHelperWindow = false;
  // 是否已经初始化弹窗
  let isInitChatGPTHelperWindow = false;

  addChatButton();

  // 打开或关闭弹窗
  function toggleChatGPTHelperWindow() {
    if (!isInitChatGPTHelperWindow) {
      addChatGPTWidow()
      isInitChatGPTHelperWindow = true;
      isOpenChatGPTHelperWindow = true
    } else {
      if (isOpenChatGPTHelperWindow) {
        closeChatGPTWidow()
        isOpenChatGPTHelperWindow = false
      } else {
        openChatGPTWidow()
        isOpenChatGPTHelperWindow = true
      }
    }
  }

  /**
   * 添加ChatGPT按钮
   */
  function addChatButton() {
    const icon = document.createElement('img')
    icon.src = 'https://chat.openai.com/favicon-32x32.png'
    icon.style = `width: 32px; height:32px; position: fixed;right: 40px;bottom: 40px;z-index:999;cursor: pointer`
    icon.ondragstart = function () {
      return false
    }
    icon.onclick = toggleChatGPTHelperWindow
    document.body.appendChild(icon)
  }

  function addChatGPTWidow() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'ChatGPTHelperWindow')
    iframe.src = ChatGPTServer;
    iframe.style = `display:block;width: ${windowWidth}px; height:${windowHeight}px; position: fixed;right: 40px;bottom: 90px;z-index:999;cursor: pointer;border: none;border-radius: 5px;`;
    document.body.appendChild(iframe);
  }

  function openChatGPTWidow() {
    const iframe = document.getElementById('ChatGPTHelperWindow')
    iframe.style = `${iframe.getAttribute('style')}; display:block;`
  }

  function closeChatGPTWidow() {
    const iframe = document.getElementById('ChatGPTHelperWindow')
    iframe.style = `${iframe.getAttribute('style')}; display:none;`
  }
})();