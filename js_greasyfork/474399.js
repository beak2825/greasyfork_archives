// ==UserScript==
// @name         Bing简化
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  主要适配vivaldi浏览器 | 点击右上角三横线开启关闭历史记录
// @author       You
// @match        *://*bing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474399/Bing%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474399/Bing%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(async function () {
  ("use strict");

  // 添加一个变量来记录元素的状态
  let isRemoved = true;

  // 添加一个变量用来记录是否是第一次运行
  let isNotOne = false;

  // 添加一个变量用来记忆元素
  let sideParent;
  let side;

  // 将点击代码封装成一个函数
  function clickFunction() {
    let element = document
      .querySelector("#b_sydConvCont > cib-serp")
      .shadowRoot.querySelector("#cib-conversation-main > cib-side-panel");
    if (!sideParent) {
      sideParent = element.parentNode;
      side = element;
    } else {
      element = side;
    }
    let parent = sideParent;

    let bar = document
      .querySelector("#b_sydConvCont > cib-serp")
      .shadowRoot.querySelector("#cib-action-bar-main");

    if (isNotOne) {
      if (isRemoved) {
        // 如果元素已被删除，则恢复它
        parent.appendChild(element);
        isRemoved = false;
        bar.shadowRoot.querySelector("div").style.marginLeft = "20px";
        bar.shadowRoot.querySelector(
          "div > div.main-container.body-2 > div.input-container.as-ghost-placement"
        ).style.width = "600px";
      } else {
        // 如果元素未被删除，则删除它
        parent.removeChild(element);
        isRemoved = true;
        bar.shadowRoot.querySelector("div").style.marginLeft = "300px";
        bar.shadowRoot.querySelector(
          "div > div.main-container.body-2 > div.input-container.as-ghost-placement"
        ).style.width = "900px";
      }
    } else {
      // 第一次点击按钮运行则执行下面语句
      parent.removeChild(element);
      if (document.querySelector("body > div.mfa_rootchat")) {
        document.querySelector("body > div.mfa_rootchat").remove();
      }
      document
        .querySelector("#b_sydConvCont > cib-serp")
        .shadowRoot.querySelector("cib-serp-feedback")
        .remove();
      document.querySelector("#id_rh").remove();
      document.querySelector("#qs_searchBoxOuter").remove();
      bar.shadowRoot.querySelector("div").style.marginLeft = "300px";
      bar.shadowRoot.querySelector(
        // "div > div.main-container.body-2 > div.input-container.as-ghost-placement"
        "div > div.main-container"
      ).style.width = "900px";
      isNotOne = true;
    }
  }

  // 等待页面加载完成
  window.addEventListener("load", function () {
    // 获取<a>标签元素
    let aElement = document.querySelector("#id_sc");
    // 将clickFunction函数绑定到<a>标签的点击事件上
    aElement.addEventListener("click", clickFunction);

    document.querySelector("#id_hbfo").remove();
    document.querySelector("body > div.mfa_rootchat").remove();
    document.querySelector("#id_rh").remove();
    if (document.querySelector("#qs_searchBoxOuter")) {
      document.querySelector("#qs_searchBoxOuter").remove();
    }
  });

  // 监听滚轮事件
  window.addEventListener("wheel", (e) => {
    if (e.target.className.includes("cib-serp-main")) e.stopPropagation();
  });

  // 监听触摸移动事件
  window.addEventListener("touchmove", (e) => {
    e.stopImmediatePropagation();
  });

  // 监听键盘按键事件（"keydown"）
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.stopImmediatePropagation();
    }
  });
})();

let fornum = 1;
// 每隔500毫秒运行一次
setInterval(function () {
  if (document.querySelector("#b_sydConvCont > cib-serp")) {
    // 获取顶层 shadow root
    const serp = document.querySelector("#b_sydConvCont > cib-serp").shadowRoot;

    // 获取第二层 shadow root,并获取所有 turn
    const main = serp.querySelector("#cib-conversation-main").shadowRoot;
    const turns = main.querySelectorAll("#cib-chat-main > cib-chat-turn");

    turns.forEach((turn) => {
      // 获取每个 turn 的 shadow root
      const turnRoot = turn.shadowRoot;

      if (turnRoot.querySelector("cib-message-group.response-message-group")) {
        // 获取 message group
        const messageGroup = turnRoot.querySelector(
          "cib-message-group.response-message-group"
        ).shadowRoot;

        // 获取 message 文本
        const messages = messageGroup.querySelectorAll(
          "cib-message[type='text']"
        );

        messages.forEach((message) => {
          // 获取每个 message 的 shadow root
          const messageRoot = message ? message.shadowRoot : "";

          if (
            messageRoot.innerHTML &&
            messageRoot.innerHTML.includes("cib-feedback")
          ) {
            messageRoot.querySelector("cib-feedback").remove();
            messageRoot.querySelector(".content.footer").remove();
          }

          if (
            messageRoot.innerHTML &&
            messageRoot.innerHTML.includes("cib-shared")
          ) {
            if (messageRoot.querySelectorAll("cib-code-block").length) {
              messageRoot.querySelectorAll("cib-code-block").forEach((item) => {
                if (item.shadowRoot) {
                  const itemNode =
                    item.shadowRoot.querySelector(".code-header");
                  if (itemNode) {
                    itemNode.remove();
                  }
                }
              });
            }
          }
        });

        if (messageGroup.querySelectorAll("cib-message[type='meta']").length != 0) {
          if (fornum == 4) {
            // 两秒后删除元素
            messageGroup
              .querySelectorAll("cib-message[type='meta']")
              .forEach((meta) => {
                meta.remove();
                console.log("删除一个元素")
              });
            fornum = 1;
          } else {
            fornum++;
          }
        }
      }
    });
  }

  // 删除未知元素，适配谷歌浏览器
  if (document.querySelector("#b_content")) {
    document.querySelector("#b_content").remove();
  }
}, 500);
