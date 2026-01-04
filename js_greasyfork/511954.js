// ==UserScript==
// @name         Coze 工作流模式切换
// @namespace    https://github.com/Ocyss
// @version      2024-10-10
// @description  切换 Coze 工作流模式
// @author       Ocyss_04
// @run-at       document-start
// @match        https://www.coze.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.cn
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/511954/Coze%20%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/511954/Coze%20%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 全局变量
  const WORKFLOW_MODE = "workflow_mode";
  const SCRIPT_ENABLED = "script_enabled";
  let workflowMode = GM_getValue(WORKFLOW_MODE, 0);
  let scriptEnabled = GM_getValue(SCRIPT_ENABLED, true);
  const workflowData = {};
  unsafeWindow.workflowData = workflowData;

  // 劫持 XMLHttpRequest
  function interceptXHR() {
    const originalXHR = unsafeWindow.XMLHttpRequest;

    unsafeWindow.XMLHttpRequest = function () {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;

      xhr.open = function () {
        this._url = arguments[1];
        this._openargs = arguments;
        return originalOpen.apply(this, arguments);
      };

      xhr.send = function (body) {
        const self = this;
        const originalOnReadyStateChange = this.onreadystatechange;
        this._sendargs = arguments;
        this.onreadystatechange = function () {
          this._readystatechangeargs = arguments;
          // console.log(
          //   "!!! Coze 工作流debug: ",
          //   self.readyState,
          //   self.status,
          //   self._url,
          //   self
          // );
          if (self.readyState === 4 && self.status === 200) {
            if (
              scriptEnabled &&
              self._url.includes("/api/workflow_api/canvas")
            ) {
              let data = JSON.parse(self.responseText);
              console.log(
                "!!! Coze 工作流debug: ",
                self.readyState,
                self.status,
                self._url,
                data
              );
              if (data && data.data.workflow) {
                data.data.workflow.flow_mode = workflowMode;
                Object.defineProperty(self, "responseText", {
                  get: function () {
                    return JSON.stringify(data);
                  },
                });
                console.log("!!! Coze 工作流劫持: ", data);
              }
            } else if (self._url.includes("api/workflow_api/save")) {
              try {
                workflowData.data = JSON.parse(body);
                console.log(
                  "!!! Coze 工作流劫持[api/workflow_api/save]: ",
                  self
                );
              } catch (e) {
                console.log(
                  "!!! Coze 工作流劫持[api/workflow_api/save]: ",
                  e,
                  self,
                  body
                );
              }
            }
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };

        return originalSend.apply(this, arguments);
      };

      return xhr;
    };
  }

  // 初始化劫持
  function initInterception() {
    console.log("!!! Coze 工作流劫持: ", scriptEnabled);

    interceptXHR();
  }

  // 执行初始化
  initInterception();

  // 注册菜单命令
  GM_registerMenuCommand(`导入`, () => {
    const data = prompt("请输入工作流数据: ");
    if (data && workflowData && workflowData.data) {
      workflowData.data.schema = data;
      fetch("https://www.coze.cn/api/workflow_api/save", {
        method: "POST",
        body: JSON.stringify(workflowData.data),
      });
      console.log("!!! Coze 工作流导入: ", workflowData);
      window.location.reload();
    } else {
      alert("当前没有工作流数据, 请先拖动保存下");
    }
  });

  GM_registerMenuCommand(`导出`, () => {
    if (workflowData && workflowData.data) {
      console.log("!!! Coze 工作流导出: ", workflowData);
      GM_setClipboard(workflowData.data.schema);
    } else {
      alert("当前没有工作流数据, 请先拖动保存下");
    }
  });

  GM_registerMenuCommand(
    `${workflowMode === 1 ? "🔄" : "🔁"} 切换工作流模式 (当前: ${
      workflowMode === 1 ? "图像" : "普通"
    })`,
    toggleWorkflowMode
  );

  GM_registerMenuCommand(
    `${scriptEnabled ? "🔴" : "🟢"} ${scriptEnabled ? "禁用" : "启用"}脚本`,
    toggleScriptEnabled
  );

  function toggleWorkflowMode() {
    workflowMode = workflowMode === 1 ? 0 : 1;
    GM_setValue(WORKFLOW_MODE, workflowMode);
    window.location.reload();
  }

  function toggleScriptEnabled() {
    scriptEnabled = !scriptEnabled;
    GM_setValue(SCRIPT_ENABLED, scriptEnabled);
    window.location.reload();
  }
})();
