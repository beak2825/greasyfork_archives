// ==UserScript==
// @name         CVAT helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  cvat helper
// @match        http://10.31.131.40:8082/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502759/CVAT%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/502759/CVAT%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let container = null;

  function createPromptEditor() {
    container = document.createElement("div");
    container.style.cssText = `
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 9999;
          background-color: white;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          cursor: move;
      `;

    // 创建多行文本框
    const promptInput = document.createElement("textarea");
    promptInput.id = "prompt_input";
    promptInput.style.cssText = `
            width: 300px;
            height: 100px;
            margin-bottom: 5px;
            padding: 5px;
            resize: both;
            overflow: auto;
            word-wrap: break-word;
        `;

    const promptButton = document.createElement("button");
    promptButton.textContent = "Update Prompt";
    promptButton.style.cssText = `
          display: block;
          width: 100%;
          padding: 5px;
      `;

    promptButton.addEventListener("click", function () {
      alert(promptInput.value);
    });

    container.appendChild(promptInput);
    container.appendChild(promptButton);
    document.body.appendChild(container);

    // 添加拖拽功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    container.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === container) {
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, container);
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
  }

  function updatePromptContent() {
    if (container) {
      const input = container.querySelector("#prompt_input");
      const targetInput = document.querySelector("input.ant-input-number-input");
      if (input && targetInput) {
        input.value = "url=" + window.location.href + "\nindex=" + targetInput.value;
      }
    }
  }

  function setupPromptEditor() {
    console.log("cvat helper: craete or update UI");
    const currentURL = window.location.href;
    const urlPattern = /^http:\/\/10\.31\.131\.40:8082\/tasks\/\d+\/jobs\/\d+$/;

    if (urlPattern.test(currentURL)) {
      console.log("url matched");
      if (!container) {
        createPromptEditor();
      }
      updatePromptContent();
    } else if (container) {
      container.remove();
      container = null;
    }
  }

  function waitForElement(selector, callback, maxAttempts = 60) {
    let attempts = 0;

    const intervalId = setInterval(() => {
      attempts++;
      const element = document.querySelector(selector);

      if (element) {
        clearInterval(intervalId);
        callback(element);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        console.log(`元素 ${selector} 在 ${maxAttempts} 秒内未找到`);
      }
    }, 1000);
  }

  function scheduleSetup() {
    waitForElement(
      "input.ant-input-number-input",
      (element) => {
        const targetInput = document.querySelector("input.ant-input-number-input");
        console.log("ant-input-number-input", targetInput);
        if (targetInput) {
          new MutationObserver(() => {
            updatePromptContent();
          }).observe(targetInput, { attributes: true, attributeFilter: ["value"] });

          // 监听输入事件
          targetInput.addEventListener("input", updatePromptContent);
          setupPromptEditor();
        }
      },
      10
    ); // 最多等待30秒
  }

  scheduleSetup();

  // 监听URL变化
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setupPromptEditor();
    }
  }).observe(document, { subtree: true, childList: true });

  /////////////////////// Follow DIV

  // 添加样式
  const style = document.createElement("style");
  style.textContent = `
          #kv_div {
              width: 300px;
              border: 1px solid gray;
              position: absolute;
              background-color: white;
              z-index: 9998;

          }
          .kv-pair {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
          }
          .kv-pair label {
              font-weight: bold;
          }
          .kv-pair select {
              width: 200px;
          }
      `;
  document.head.appendChild(style);

  let kvDiv = null;

  // 创建跟随的 div
  function createKvDiv() {
    console.log("create kvDiv")
    kvDiv = document.createElement("div");
    kvDiv.id = "kv_div";

    kvDiv.innerHTML = `
        <div class="kv-pair">
            <label for="color">颜色</label>
            <select id="color">
                <option value="red">红色</option>
                <option value="green">绿色</option>
                <option value="blue">蓝色</option>
            </select>
        </div>
        <div class="kv-pair">
            <label for="size">尺寸</label>
            <select id="size">
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
            </select>
        </div>
    `;
    document.body.appendChild(kvDiv);
  }

  // 更新跟随 div 的位置
  function updateKvDivPosition(contextMenu) {
    console.log("update kv pos")
    const rect = contextMenu.getBoundingClientRect();
    kvDiv.style.left = rect.left + "px";
    kvDiv.style.top = rect.bottom + 10 + "px";
  }

  // 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        const contextMenu = document.querySelector(".cvat-canvas-context-menu");
        if (contextMenu) {
          console.log("has contextMenu")
          if (!kvDiv) {
            createKvDiv();
          }
          updateKvDivPosition(contextMenu);

          // 监听上下文菜单的位置变化
          const menuObserver = new MutationObserver(() => {
            updateKvDivPosition(contextMenu);
          });
          menuObserver.observe(contextMenu, { attributes: true, attributeFilter: ["style"] });
        } else if (kvDiv) {
          console.log("has not contextMenu")

          kvDiv.remove();
          kvDiv = null;
        }
      }
    }
  });

  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
