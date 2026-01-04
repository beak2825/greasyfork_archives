// ==UserScript==
// @name         BiliBili 消息清理助手
// @namespace    moecasts
// @version      0.3
// @description  清理 B站 消息（回复我的，@ 我的）
// @author       Caster
// @match        *://message.bilibili.com/
// @match        *://message.bilibili.com/?spm_id_from=*
// @contributionURL https://www.tore.moe/post/bilibili-massage-cleaner
// @grant        none
// @run-at       context-end
// @downloadURL https://update.greasyfork.org/scripts/398464/BiliBili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398464/BiliBili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
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
    let deleteButton = document.querySelector(".action-button>.action-delete");
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
        }, 100);
      } catch (e) {
        console.log("清理错误，正在重试。。。");
      }
      deleteButton = document.querySelector(".action-button>.action-delete");
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
