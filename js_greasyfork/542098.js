// ==UserScript==
// @name         ZYB 自动审批通过
// @description  用于 ZYB OP 镜像的自动审批通过～～
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       PsiloLau
// @match        https://op.zuoyebang.cc/static/odin/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542098/ZYB%20%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%89%B9%E9%80%9A%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/542098/ZYB%20%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%89%B9%E9%80%9A%E8%BF%87.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let domTimer;
  let autoApprovalEnabled = true; // 自动审批开关
  let token = getToken();

  window.addEventListener(
    "hashchange",
    () => {
      clearInterval(domTimer);
      domTimer = setInterval(() => {
        onWaitLoaded();
      }, 2000);
    },
    false
  );

  window.addEventListener(
    "load",
    () => {
      clearInterval(domTimer);
      domTimer = setInterval(() => {
        onWaitLoaded();
      }, 2000);
    },
    false
  );

  function createMessage(type, message, duration = 3000) {
    const messageEl = document.createElement("div");
    messageEl.className = `el-message el-message--${type}`;
    messageEl.style.zIndex = "2000";

    const textEl = document.createElement("p");
    textEl.innerHTML = message;
    textEl.className = "el-message__content";
    messageEl.appendChild(textEl);

    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, duration);
  }

  function onWaitLoaded() {
    const hash = location.hash;
    if (!hash.includes("order/detail")) {
      clearInterval(domTimer);
      return;
    }

    if (!token) {
      autoApprovalEnabled = false;
      console.log("%c 💯 ", "background:#eee;", "未找到token，自动审批关闭");
      createMessage("warning", "未找到token，自动审批关闭");
    }

    // 执行自动审批检查
    if (autoApprovalEnabled) {
      const rootId = hash.split("/").slice(-1)[0];
      checkAndAutoApprove(rootId);
    }

    clearInterval(domTimer);
  }

  // 获取详情信息
  async function getOrderDetail(rootId) {
    try {
      const response = await fetch(
        `https://cm.op.zuoyebang.cc/auth/v1/order/detail?rootId=${rootId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            origin: "https://op.zuoyebang.cc",
            referer: "https://op.zuoyebang.cc/",
            token,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("%c 💯 ", "background:#eee;", "获取订单详情失败:", error);
      return null;
    }
  }

  // 获取token
  function getToken() {
    // 1. 从 cookie 拿
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "odin-1.0.0-token") {
        return value;
      }
    }

    // 2. 从 storage 拿，自行配置
    const token = localStorage.getItem("__zyb_auto_pass_token__");
    if (token) {
      return token;
    }

    return "";
  }
  // 自动审批
  async function autoApprove(processId) {
    try {
      const response = await fetch(
        "https://cm.op.zuoyebang.cc/auth/v1/event/verify",
        {
          method: "POST",
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            origin: "https://op.zuoyebang.cc",
            referer: "https://op.zuoyebang.cc/",
            token,
          },
          body: `processId=${processId}&verifyStep=1&status=1&remark=审批通过`,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("%c 💯 ", "background:#eee;", "审批结果:", result);
      createMessage("success", "自动审批成功");
      return result;
    } catch (error) {
      console.error("%c 💯 ", "background:#eee;", "自动审批失败:", error);
      createMessage("error", error.message);
      return null;
    }
  }

  // 检查并执行自动审批
  async function checkAndAutoApprove(rootId) {
    if (!rootId.startsWith("CM")) {
      console.log("%c 💯 ", "background:#eee;", "未找到rootId，跳过自动审批");
      return;
    }

    const orderDetail = await getOrderDetail(rootId);
    console.log("%c 💯 ", "background:#eee;", orderDetail);
    if (
      !orderDetail ||
      !orderDetail.data ||
      !orderDetail.data.eventList ||
      !orderDetail.data.eventList[0]
    ) {
      console.log(
        "%c 💯 ",
        "background:#eee;",
        "获取订单详情失败或数据格式不正确"
      );
      return;
    }

    const event = orderDetail.data.eventList[0];
    if (!event.checkList || !event.checkList[0]) {
      console.log("%c 💯 ", "background:#eee;", "未找到审批列表");
      return;
    }

    const checkItem = event.checkList[0];
    const processId = checkItem.processId;
    const status = checkItem.verifyDetail?.firstVerify?.status;

    if (status === "wait" && processId) {
      const result = await autoApprove(processId);
      if (result) {
        console.log("%c 💯 ", "background:#eee;", "自动审批成功！");
      }
    } else if (status === "success") {
      console.log("%c 💯 ", "background:#eee;", "审批已完成，无需自动审批");
    }
  }
})();
