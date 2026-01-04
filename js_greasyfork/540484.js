// ==UserScript==
// @name         ZYB 下一步校验
// @description  用于 ZYB OP 镜像的校验离线包～～
// @namespace    http://tampermonkey.net/
// @version      0.6
// @author       PsiloLau
// @match        https://op.zuoyebang.cc/static/odin/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540484/ZYB%20%E4%B8%8B%E4%B8%80%E6%AD%A5%E6%A0%A1%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/540484/ZYB%20%E4%B8%8B%E4%B8%80%E6%AD%A5%E6%A0%A1%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let domTimer;
  let maxTimes = 10;
  let loadTimes = 0;

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

  function onWaitLoaded() {
    console.log("%c 💯 ", "background:#eee;", "等待加载");
    loadTimes++;
    if (loadTimes === maxTimes) {
      clearInterval(domTimer);
    }
    // 判断是否需要按钮
    const isDeployJob = onCheckHref();
    if (!isDeployJob) {
      return;
    }

    if (!location.href.includes("?")) {
      const href = location.href.split("#");

      location.href = `${href[0]}?#${href[1]}`;
    }

    const target = document.querySelector(".el-form");
    if (!target) {
      return;
    }

    onBindEvent();
  }

  function onBindEvent() {
    const nodeList = document.querySelectorAll(".el-form-item__content");
    const parent = nodeList[nodeList.length - 1];

    if (parent.children && parent.children.length) {
      const anchor = Array.prototype.slice
        .call(parent.children)
        .filter((v) => v.tagName === "SPAN")[0];
      if (anchor.children.length) {
        for (let i = 0; i < anchor.children.length; i++) {
          const item = anchor.children[i];
          if (item.innerText.includes("下一步")) {
            // 给按钮加事件
            console.log("%c 💯 ", "background:#eee;", "下一步按钮事件绑定");
            item.addEventListener("click", onShowConfirm, true);
          }
        }
        clearInterval(domTimer);
      }
    }
  }

  function onShowConfirm(e) {
    const isSealed = onSealLineHandle();
    if (isSealed) {
      return;
    }

    const noMoreConfirm = sessionStorage.getItem("no-confirm");

    if (noMoreConfirm) {
      if (noMoreConfirm === "TRUE") {
        return;
      }
    } else {
      if (
        window.confirm(
          "确认最新的应用离线包强制走线上，是否跳转FE项目发布系统，点击取消则本次部署不在弹窗提示"
        )
      ) {
        e.stopPropagation();
        window.open(
          "https://iot-admin.zuoyebang.cc/static/pad/local-zip-admin/#/localization/version-List-v2",
          "_blank"
        );
      } else {
        sessionStorage.setItem("no-confirm", "TRUE");
      }
    }
  }

  function onCheckHref() {
    const href = location.href;
    if (!href.includes("deployDetail")) {
      return false;
    } else {
      return true;
    }
  }

  // 封线处理
  function onSealLineHandle() {
    const sealed = document.querySelectorAll(".show-peak-dialog");
    return sealed.length !== 0;
  }
})();
