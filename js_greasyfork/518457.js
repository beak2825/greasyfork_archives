// ==UserScript==
// @name         蓝鲸平台新建任务自动填充脚本
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  自动填充数据脚本
// @author       weiningzhang
// @include      /^http:\/\/paas(\.infra)?\.yunzhoutimes\.net\/o\/bk_sops\/taskflow\/newtask\/\d+\/paramfill\/\?template_id=\d+&entrance=templateView$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518457/%E8%93%9D%E9%B2%B8%E5%B9%B3%E5%8F%B0%E6%96%B0%E5%BB%BA%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518457/%E8%93%9D%E9%B2%B8%E5%B9%B3%E5%8F%B0%E6%96%B0%E5%BB%BA%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }

  function deleteCookie(name, domain = "yunzhoutimes.net", path = "/") {
    document.cookie = `${name}=; path=${path}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  const cookieKey = "lanjing_auto_input_data";
  const sharedData = getCookie(cookieKey);
  if (!sharedData) {
    console.warn("No autoinput values found in cookies!");
    return;
  }
  deleteCookie(cookieKey);
  console.log("Cookie deleted");

  const data = JSON.parse(sharedData);
  const { Bastion, WeChatMachineKey, ImportFile, TaskName } = data;
  const taskInfoValues = [TaskName];
  const paramValues = [Bastion, "", WeChatMachineKey, ImportFile];

  function fillInputs() {
    const taskNameEl = document.querySelectorAll(
      ".task-basic-info .bk-form-input"
    );
    const paramElements = document.querySelectorAll(
      ".render-form .el-input__inner"
    );
    if (taskNameEl.length === 0) return;
    if (paramElements.length === 0) return;

    taskNameEl.forEach((input, index) => {
      input.value = taskInfoValues[index];
      input.dispatchEvent(new Event("input"));
    });
    paramElements.forEach((input, index) => {
      input.value = paramValues[index];
      input.dispatchEvent(new Event("input"));
    });

    console.log("Inputs filled automatically done！");
  }

  const observer = new MutationObserver(() => {
    const taskNameEl = document.querySelectorAll(
      ".task-basic-info .bk-form-input"
    );
    const paramElements = document.querySelectorAll(
      ".render-form .el-input__inner"
    );
    if (taskNameEl.length > 0 && paramElements.length > 0) {
      fillInputs();
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
