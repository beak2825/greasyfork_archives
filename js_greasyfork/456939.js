// ==UserScript==
// @name         v2ex 快速屏蔽用户和帖子
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在用户评论区域添加一个 block 按钮，不用点进用户主页，点击即可 block 用户。
// @author       3989364
// @match        *://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @note         0.3 实现屏蔽帖子功能
// @note         0.2 扩展 v2ex.com 的域名匹配规则
// @downloadURL https://update.greasyfork.org/scripts/456939/v2ex%20%E5%BF%AB%E9%80%9F%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%92%8C%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/456939/v2ex%20%E5%BF%AB%E9%80%9F%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%92%8C%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

// TODO:
// 1. 帖子外面加个屏蔽用户按钮
// 2. 直接在用户头像链接里面取 userID
// 3. 判断用户是否登录，如果没登录直接跳过所有功能

const BASE_URL = window.location.origin;

if (!BASE_URL.includes("v2ex.com")) {
  throw Error("This script only works at v2ex.com, " + BASE_URL);
}

class OnceCode {
  /**
   * onceCode 类似验证码，目测用一次就会失效；目前获取 once code 的方式是请求设置页面提取出 once code
   */
  static async getOnceCode() {
    const resp = await fetch(`/settings/block`);
    const text = await resp.text();
    const html = document.createElement("html");
    html.innerHTML = text;

    const fn = html
      .querySelector('input[value="一键清除所有忽略主题"]')
      .onclick.toString();

    return this.parseOnceCode(fn);
  }

  static parseOnceCodeURL(text) {
    return text.match("location.href ?= ?'(.+)'")[1];
  }

  static parseOnceCode(text) {
    return text.match(/once=(\d+)/)[1];
  }
}

class User {
  async fetchUserPage(username) {
    const resp = await fetch(`/member/${username}`);
    return await resp.text();
  }

  parseBlockURL(page) {
    const html = document.createElement("html");
    html.innerHTML = page;
    const fn = html.querySelector('input[value="Block"]').onclick;

    if (fn) {
      // /block/xxxx?once=19604
      return OnceCode.parseOnceCodeURL(fn.toString());
    }

    return null;
  }

  async blockUser(username) {
    const page = await this.fetchUserPage(username);
    const url = await this.parseBlockURL(page);

    if (url) {
      // just dont redirect
      try {
        await fetch(url, {
          redirect: "error",
        });
      } catch {}
    }
  }

  hideUserAllReply(username) {
    if (!username) {
      return;
    }

    document.querySelectorAll("#Main .cell").forEach((cell) => {
      const u = cell.querySelector("strong> a")?.textContent;
      if (u === username) {
        cell.remove();
      }
    });
  }
}

class Topic {
  async ignoreTopic(topicId) {
    const onceCode = await OnceCode.getOnceCode();
    try {
      await fetch(`/ignore/topic/${topicId}?once=${onceCode}`, {
        redirect: "error",
      });
    } catch {}
  }
}

function createBlockButton(
  text = "block",
  className = "thank",
  styleText = ""
) {
  const blockButton = document.createElement("a");
  blockButton.textContent = text;
  blockButton.className = className;
  blockButton.style.marginLeft = "0.5rem";
  styleText && (blockButton.style = styleText);

  blockButton.href = "#;";

  return blockButton;
}

function initUserBlockFunction() {
  function addChildInThankArea(node, thankArea) {
    thankArea.appendChild(node, thankArea);
  }

  const user = new User();

  document.querySelectorAll(".thank_area").forEach((thankArea) => {
    const blockButton = createBlockButton();

    addChildInThankArea(blockButton, thankArea);

    blockButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const wrapper = thankArea.parentNode.parentNode;
      const username = wrapper.querySelector("strong > a").textContent;

      if (username && confirm(`确认要屏蔽 ${username} ?`)) {
        await user.blockUser(username);
        user.hideUserAllReply(username);
      }
    });
  });
}

function initTopicBlockFunction() {
  const topic = new Topic();

  document
    .querySelectorAll('#Main .cell.item td[valign="middle"]')
    .forEach((cell) => {
      const titleElement = cell.querySelector(".item_title > a");
      const infoElement = cell.querySelector(".topic_info");

      if (!titleElement) {
        return;
      }

      const topicId = titleElement.href.match(/\/t\/(\d+)/)[1];
      const ignoreButton = createBlockButton(
        "忽略",
        "title",
        "color: #ccc; float: right;"
      );

      infoElement.appendChild(ignoreButton);

      ignoreButton.addEventListener("click", async function () {
        if (confirm("确定不想再看到这个主题？")) {
          // debugger
          await topic.ignoreTopic(topicId);

          // delete this topic
          let element = cell.parentElement;
          const body = document.body;

          // 向上找到 className = "cell item" 的元素即认为找到了帖子元素
          while (element.className !== "cell item" && element !== body) {
            element = element.parentElement;
          }

          if (element !== body) {
            element.remove();
          } else {
            throw Error("Can't find topic cell");
          }
        }
      });
    });
}

(function () {
  "use strict";
  if (location.href.match(/\/t\/\d+/)) {
    console.log("Init user block function");
    initUserBlockFunction();
  }

  initTopicBlockFunction();
})();
