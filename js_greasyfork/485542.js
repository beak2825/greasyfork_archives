// ==UserScript==
// @name         ChatGLM 插嘴功能
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  当你在chatglm的对话框里按下enter建时，如果ai仍在说话，会自动停止ai发言并发送你的消息
// @author       You
// @match        https://chatglm.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485542/ChatGLM%20%E6%8F%92%E5%98%B4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/485542/ChatGLM%20%E6%8F%92%E5%98%B4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //点击新建对话也终止输出
  const hookNewButton = () => {
    {
      const element = document.getElementsByClassName("add-session-icon")[0];
      if (!element) {
        setTimeout(() => hookNewButton(), 0);
        return;
      }

      element.style.pointEvents = "none"
      const cover = document.createElement("div");
      cover.className = "el-tooltip add-session-icon";
      cover.setAttribute("tabindex", "0");
      cover.setAttribute("aria-describedby", element.getAttribute("aria-describedby"));
      let dataTag = "";
      {
        const dataTagStart = element.outerHTML.indexOf("data-v-");
        const dataTagEnd = element.outerHTML.indexOf("=", dataTagStart);
        dataTag = element.outerHTML.substring(dataTagStart, dataTagEnd)
      }
      cover.setAttribute(dataTag, "1");
      element.parentElement.appendChild(cover);
      cover.onclick = () => {
        stopOutput()
        setTimeout(() => element.click(), 0);
      }
    }
  };




  hookNewButton();
  function bindEventToTextarea() {
    // 获取页面中的第一个<textarea>元素
    var textarea = document.querySelector("textarea");
    if (textarea) {
      // 清除之前可能绑定的事件监听器
      textarea.removeEventListener("keydown", handleKeyDown);
      // 重新绑定事件监听器
      textarea.addEventListener("keydown", handleKeyDown);
    }
  }

  function handleKeyDown(event) {
    // 检查是否是单个Enter键按下，并且事件的目标元素是<textarea>
    if (
      event.key === "Enter" &&
      event.keyCode === 13 &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      event.target.tagName === "TEXTAREA"
    ) {
      console.debug(event);
      stopOutput();
    }
  }
  function stopOutput() {
    // 查找类名为"btn stop"的按钮
    var stopButton = document.querySelector(".btn.stop");
    // 如果找到了按钮，并且按钮文本包含"停止生成"，则触发click事件
    if (stopButton && stopButton.textContent.includes("停止生成")) {
      stopButton.click();
    }
  }
  // 使用setInterval每隔一秒重新绑定事件监听器
  setInterval(bindEventToTextarea, 1000);

  // 初始绑定
  bindEventToTextarea();
})();
