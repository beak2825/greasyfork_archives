// ==UserScript==
// @name               『小助手』COZE - Free GPT4
// @name:zh-CN         『小助手』扣子 COZE - 免费GPT4
// @namespace          ttps://github.com/Hunlongyu
// @version            0.8.11
// @author             Hunlongyu
// @description        Hide the left Prompt panel and the middle Skills panel with just one click, and expand the chat panel.
// @description:zh-CN  一键隐藏左侧 Prompt 面板 和中间 Skills 面板，扩大聊天面板。
// @license            MIT
// @copyright          Copyright (c) [2024] [hunlongyu]
// @icon               https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @homepage           https://github.com/Hunlongyu/userscript
// @supportURL         https://github.com/Hunlongyu/userscript/issues
// @match              *://www.coze.com/*
// @match              *://www.coze.cn/*
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_notification
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_unregisterMenuCommand
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/485618/%E3%80%8E%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%8FCOZE%20-%20Free%20GPT4.user.js
// @updateURL https://update.greasyfork.org/scripts/485618/%E3%80%8E%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%8FCOZE%20-%20Free%20GPT4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  const cssDefault = `
    html{
      min-width: 600px !important;
    }
    body{
      min-width: 600px !important;
    }
    .pStAbHgTdAlDVUlpMOGP{
      display: none !important;
    }
    @media (max-width: 900px) {
      .autboP_xS3EJZt4GoTeY{
        display: none !important;
      }
      .PSi8HVjhxY0hsgUZGaKG{
        display: none !important;
      }
    }
`;
  const cssExpand = `
    .UMf9npeM8cVkDi0CDqZ0{
        grid-template-columns: 0 1fr !important;
    }
    .wrapper-single--UMf9npeM8cVkDi0CDqZ0{
        grid-template-columns: 0 1fr !important;
    }
`;
  const cssShrink = `
    .UMf9npeM8cVkDi0CDqZ0{
        grid-template-columns: 26fr 14fr !important;
    }
    .wrapper-single--UMf9npeM8cVkDi0CDqZ0{
        grid-template-columns: 26fr 14fr !important;
    }
`;
  const buttonExpand = `
    <button id="button_expand" style="margin-left: 10px;" class="semi-button semi-button-primary" type="button" aria-disabled="false"><span class="semi-button-content" x-semi-prop="children">展开</span></button>
`;
  const buttonShrink = `
    <button id="button_shrink" style="margin-left: 10px; display: none;" class="semi-button semi-button-primary" type="button" aria-disabled="false"><span class="semi-button-content" x-semi-prop="children">恢复</span></button>
`;
  const task = () => {
    let parentFlag = false;
    let textareaFlag = false;
    const timer = setInterval(() => {
      const parent = document.querySelector(".semi-spin-children");
      if (parent) {
        const firstChild = parent.children[0];
        if (firstChild && !parentFlag) {
          const btnExpand = document.querySelector("#button_expand");
          if (btnExpand) {
            parentFlag = true;
          } else {
            firstChild.insertAdjacentHTML("beforeend", buttonExpand);
            firstChild.insertAdjacentHTML("beforeend", buttonShrink);
            toggleHandle();
            parentFlag = true;
          }
        }
      }
      const textareas = document.querySelectorAll(".rc-textarea");
      if (textareas) {
        const lastTextarea = textareas[textareas.length - 1];
        if (lastTextarea && !textareaFlag) {
          const style = window.getComputedStyle(lastTextarea);
          const maxHeight = style.getPropertyValue("max-height");
          if (maxHeight === "78px") {
            lastTextarea.style.maxHeight = "300px";
          }
          textareaFlag = true;
        }
      }
      if (parentFlag && textareaFlag) {
        _GM_addStyle(cssDefault);
        if (!_GM_getValue("is_expand")) {
          _GM_setValue("is_expand", false);
          _GM_addStyle(cssShrink);
          document.querySelector("#button_expand").style.display = "";
          document.querySelector("#button_shrink").style.display = "none";
        } else {
          _GM_addStyle(cssExpand);
          document.querySelector("#button_expand").style.display = "none";
          document.querySelector("#button_shrink").style.display = "";
        }
        clearInterval(timer);
      }
    }, 500);
  };
  const toggleHandle = () => {
    const btnExpand = document.querySelector("#button_expand");
    btnExpand.addEventListener("click", () => {
      _GM_addStyle(cssExpand);
      document.querySelector("#button_expand").style.display = "none";
      document.querySelector("#button_shrink").style.display = "";
    });
    const btnShrink = document.querySelector("#button_shrink");
    btnShrink.addEventListener("click", () => {
      _GM_addStyle(cssShrink);
      document.querySelector("#button_expand").style.display = "";
      document.querySelector("#button_shrink").style.display = "none";
    });
  };
  let expandId = null;
  const registerExpandId = () => {
    if (expandId) _GM_unregisterMenuCommand(expandId);
    expandId = _GM_registerMenuCommand(`${_GM_getValue("is_expand") ? "✅" : "❌"}${_GM_getValue("is_expand") ? "已开启自动展开功能（点击关闭）" : "已关闭自动展开功能（点击打开）"}`, () => {
      if (_GM_getValue("is_expand") === true) {
        _GM_setValue("is_expand", false);
        _GM_notification({ text: "已关闭自动展开功能", timeout: 3500, onclick: function() {
          location.reload();
        } });
      } else {
        _GM_setValue("is_expand", true);
        _GM_notification({ text: "已开启自动展开功能", timeout: 3500, onclick: function() {
          location.reload();
        } });
      }
      registerExpandId();
    });
  };
  registerExpandId();
  function registerEventHandler(target) {
    return function registerTargetEventHandler(methodName) {
      const originMethod = target[methodName];
      return function eventHandler(...args) {
        const event = new Event(methodName.toLowerCase());
        originMethod.apply(target, args);
        window.dispatchEvent(event);
        return originMethod;
      };
    };
  }
  const registerHistoryEventHandler = registerEventHandler(window.history);
  window.history.pushState = registerHistoryEventHandler("pushState");
  function main() {
    const url = window.location.href;
    const botReg = /^https:\/\/www\.coze\.(?:com|cn)\/.*\/bot\/.*$/;
    if (botReg.test(url)) {
      if (!url.includes("analysis")) {
        task();
      }
    }
    const exploreReg = /^https:\/\/www\.coze\.(?:com|cn)\/explore\/.*$/;
    if (exploreReg.test(url)) {
      task();
    }
  }
  window.addEventListener("pushstate", main, false);
  main();

})();