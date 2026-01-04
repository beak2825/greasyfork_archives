// ==UserScript==
// @name         BiliBili 消息清理助手（清理 回复，@ 我的））
// @namespace    charlesr
// @version      0.1
// @description  清理b站私信
// @author       charlesr
// @match        *://message.bilibili.com/
// @match        *://message.bilibili.com/?spm_id_from=*
// @contributionURL https://www.tore.moe/post/bilibili-massage-cleaner
// @grant        none
// @run-at       context-end
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/447857/BiliBili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B8%85%E7%90%86%20%E5%9B%9E%E5%A4%8D%EF%BC%8C%40%20%E6%88%91%E7%9A%84%EF%BC%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447857/BiliBili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B8%85%E7%90%86%20%E5%9B%9E%E5%A4%8D%EF%BC%8C%40%20%E6%88%91%E7%9A%84%EF%BC%89%EF%BC%89.meta.js
// ==/UserScript==

(async function() {
  "use strict";
  /**
   * @param number interval 每次请求间隔时间
   */
  const options = {
    interval: 500
  };
  let isLoaded = false;
  let isActive = false;
  let routerMenu = document.querySelector(".list");
  let activeMenu = document.querySelector(".router-link-exact-active");
  let actionButton;

  const isEmpty = val => {
    // null or undefined
    if (val == null) return true;

    if (typeof val === "boolean") return false;

    if (typeof val === "number") return !val;

    if (val instanceof Error) return val.message === "";

    switch (Object.prototype.toString.call(val)) {
      // String or Array
      case "[object String]":
      case "[object Array]":
        return !val.length;

      // Map or Set or File
      case "[object File]":
      case "[object Map]":
      case "[object Set]": {
        return !val.size;
      }
      // Plain Object
      case "[object Object]": {
        return !Object.keys(val).length;
      }
    }

    return false;
  };

  const createActionButton = () => {
    actionButton = document.createElement("div");
    actionButton.classList.add("moecasts-bilibili-message-cleaner-button");
    actionButton.innerText = "启动清理功能";
    actionButton.style =
      "color: rgb(255, 255, 255);background: #f45a8d;position: absolute;z-index: 99999;right: 10px;top: 45vh;height: 20px;line-height: 20px;padding: 8px;border-radius: 5px;cursor: pointer;";
    document.body.appendChild(actionButton);

    actionButton.addEventListener("click", () => {
      if (isActive) {
        isActive = false;
        actionButton.innerText = "启动清理功能";
        console.log("关闭");
      } else {
        if (confirm("确认要开启功能吗？")) {
          console.log("正在清理。。。");
          isActive = true;
          actionButton.innerText = "暂停清理";
          clean();
        }
      }
    });
  };

  const sleep = (fn, times) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(fn()), times);
    });
  };

  const clean = async () => {
    let deleteButton = document.querySelector(".action-button.del-button");
    let scrollPane = document.querySelector(".space-right-bottom");
    let panel = scrollPane.querySelector(".router-view");

    while (isActive && !isEmpty(deleteButton)) {
      scrollPane.scrollTop = panel.offsetHeight - scrollPane.offsetHeight;
      scrollPane.scrollTop = 0;
      try {
        deleteButton.click();
        await sleep(() => {
          if (isActive) {
            try {
              let confirmButton = document.querySelector(
                ".popup-btn-ctnr .bl-button:first-child"
              );
              if (!isEmpty(confirmButton)) {
                confirmButton.click();
              }
            } catch (e) {
              console.log("清理错误，正在重试。。。");
            }
          }
        }, 1000);
      } catch (e) {
        console.log("清理错误，正在重试。。。");
      }
      deleteButton = document.querySelector(".action-button.del-button");
      await sleep(() => {}, options.interval);
    }

    isActive = false;
    actionButton.innerText = "启动清理功能";

    if (isEmpty(deleteButton)) {
      console.log("清理完毕。");
      alert("清理完毕。");
    }
  };

  const init = () => {
    if (
      activeMenu &&
      (activeMenu.href.indexOf("reply") > -1 ||
        activeMenu.href.indexOf("at") > -1)
    ) {
      if (!actionButton) {
        createActionButton();
      } else {
        actionButton.style.display = "block";
      }
    } else {
      if (actionButton) {
        actionButton.style.display = "none";
      }
    }
  };

  const load = async () => {
    console.log("脚本启动中。。。");
    while (isEmpty(activeMenu)) {
      await sleep(() => {}, 1000);
      routerMenu = document.querySelector(".list");
      activeMenu = document.querySelector(".router-link-exact-active");
      if (!isEmpty(activeMenu)) {
        break;
      }
      console.log(document.body);
      console.log("正在重试");
    }
    init();

    routerMenu.addEventListener("click", e => {
      activeMenu = document.querySelector(".router-link-exact-active");
      init();
    });

    console.log("脚本启动完毕！");
  };

  await load();
})();
