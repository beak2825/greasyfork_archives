// ==UserScript==
// @name         屏蔽链滴用户
// @namespace    Violentmonkey Scripts
// @version      0.1.5
// @description  屏蔽指定链滴用户的帖子
// @author       zxkmm
// @author       frostime
// @author       TCOTC
// @homepage     https://github.com/zxkmm/ld246_blacklist
// @supportURL   https://github.com/zxkmm/ld246_blacklist/issues
// @match        https://ld246.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503258/%E5%B1%8F%E8%94%BD%E9%93%BE%E6%BB%B4%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/503258/%E5%B1%8F%E8%94%BD%E9%93%BE%E6%BB%B4%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

/*notes
 * 头像区块 style class：article-list__user fn__flex fn__flex-center
 * 帖子作者div style class：avatar-small tooltipped__user
 * 帖子协作人 style class：avatar-small tooltipped__user article-list__participant      （！！！！！query不article-list__participant
 *
 *
 * */

(function () {
  "use strict";

  const blockedUsersKey = "blockedUsers";
  const remindWayKey = "remindWay";
  let blockedUsers = GM_getValue(blockedUsersKey, []);
  let remindWay = GM_getValue(remindWayKey, "opacity"); // init var aka default as opa

  //public shame list
  const publicShameUser = [];
  // const publicShameUser = ["science"];
  //public shame end
  //Main style
  const customStyle = `
  .block-it.block-it__hide {
    display: none;
  }

  .block-it.block-it__opacity {
    opacity: 0.1;
  }
  .block-it.block-it__opacity .article-list__abstract {
    display: none;
  }

  .block-it.block-it__blur {
    filter: blur(5px);
  }
  .block-it.block-it__blur:hover {
    filter: none;
  }

  .block-it .article-list__panel {
    padding: 5px 15px;
  }
  .block-it .article-list__title--view, .block-it .article-list__title>a {
    font-size: 14px;
  }
  .block-it .article-list__abstract {
    font-size: 12px;
  }
  .block-it .tooltipped__user {
    height: 12px;
    width: 12px;
  }
  .blocked-users-list {
    max-height: 400px;
    overflow-y: auto;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  }
  `;
  GM_addStyle(customStyle);

  // 创建用户界面
  const createUI = () => {
    const styles = `
      .modern-ui {
        background-color: #000000;
        border: 1px solid #e3e3e3;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 15px;
        width: 280px;
      }
      .modern-ui input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #000000;
        border-radius: 3px;
        box-sizing: border-box;
        background-color: #333333 !important;
        color: #e0e0e0 !important;
      }
      .modern-ui button, .modern-ui select {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #000000;
        border-radius: 3px;
        box-sizing: border-box;
      }
      .modern-ui select {
        background-color: #333333;
        color: #e0e0e0;
      }
      .modern-ui button {
        background-color: #FFA500;
        color: #000000;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .modern-ui button:hover {
        background-color: #FF8C00;
      }
      .modern-ui ul {
        list-style-type: none;
        padding: 0;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #000000;
        border-radius: 3px;
      }
      .modern-ui li {
        background-color: #505050;
        border-bottom: 1px solid #e0e0e0;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #e0e0e0;
      }
      .modern-ui li:last-child {
        border-bottom: none;
      }
      .modern-ui li button {
        width: auto;
        padding: 3px 8px;
        margin: 0;
        background-color: #FFA500;
        color: #000000;
      }
      .modern-ui li button:hover {
        background-color: #FF8C00;
      }
      .toggle-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #FFA500;
        color: #000000;
        border: none;
        padding: 8px 15px;
        border-radius: 3px;
        cursor: pointer;
        z-index: 1001;
      }
      .toggle-button:hover {
        background-color: #FF8C00;
      }
      .modern-ui label {
        color: #e0e0e0;
      }
      `;

    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    const uiContainer = document.createElement("div");
    uiContainer.className = "modern-ui";
    uiContainer.style.position = "fixed";
    uiContainer.style.bottom = "80px";
    uiContainer.style.right = "20px";
    uiContainer.style.zIndex = "1000";
    uiContainer.style.display = "none";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "黑名单管理";
    toggleButton.className = "toggle-button";

    toggleButton.addEventListener("click", () => {
      uiContainer.style.display =
        uiContainer.style.display === "none" ? "block" : "none";
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "留空自动加当前人";

    const addButton = document.createElement("button");
    addButton.textContent = "添加到黑名单";
    addButton.addEventListener("click", () => {
      var username = input.value.trim();
      if (!username) {
        username = autoFetchUsername();
      }
      if (username && !blockedUsers.includes(username)) {
        blockedUsers.push(username);
        GM_setValue(blockedUsersKey, blockedUsers);
        updateBlockedUsersList();
        input.value = "";
      }
    });

    const blockedUsersList = document.createElement("ul");

    const updateBlockedUsersList = () => {
      blockedUsersList.innerHTML = "";

      publicShameUser.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${user} <span style="color: #888;">（这位是🤡，无法删除）</span>`;
        blockedUsersList.appendChild(listItem);
      });

      blockedUsers.forEach((user, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${user}</span>
            <button class="delete-button">删除</button>
          `;
        const deleteButton = listItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
          blockedUsers.splice(index, 1);
          GM_setValue(blockedUsersKey, blockedUsers);
          updateBlockedUsersList();
        });
        blockedUsersList.appendChild(listItem);
      });
    };

    const remindWaySelect = document.createElement("select");
    const remindWays = [
      { value: "hide", text: "隐藏" },
      { value: "blur", text: "模糊(悬浮时取消)" },
      { value: "opacity", text: "白雾" },
    ];
    remindWays.forEach((way) => {
      const option = document.createElement("option");
      option.value = way.value;
      option.text = way.text;
      if (way.value === remindWay) {
        option.selected = true;
      }
      remindWaySelect.appendChild(option);
    });

    remindWaySelect.addEventListener("change", () => {
      remindWay = remindWaySelect.value;
      GM_setValue(remindWayKey, remindWay);
    });

    const label = document.createElement("label");
    label.textContent = "标记帖子方式: ";
    label.appendChild(remindWaySelect);
    label.style.color = "#e0e0e0";

    uiContainer.appendChild(input);
    uiContainer.appendChild(addButton);
    uiContainer.appendChild(label);
    uiContainer.appendChild(blockedUsersList);
    document.body.appendChild(uiContainer);
    document.body.appendChild(toggleButton);

    updateBlockedUsersList();
  };

  createUI();

  const autoFetchUsername = () => {
    /**
     * notes

     *
     *
     * style class  `article__sideuser`
     * string elem `a`
     *
     */
    const sideuserElement = document.querySelector(".article__sideuser");

    if (sideuserElement) {
      const linkElement = sideuserElement.querySelector("a");

      if (linkElement) {
        const username = linkElement.textContent.trim();

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.backgroundColor = "rgba(0, 0, 0)";
        overlay.style.color = "white";
        overlay.style.padding = "10px";
        overlay.style.borderRadius = "5px";
        overlay.style.zIndex = "9999";
        overlay.style.fontSize = "32px";
        overlay.style.textAlign = "center";
        overlay.textContent = `自动获取到这位用户: ${username}，请核实，已添加`;

        document.body.appendChild(overlay);

        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 1000);

        //^ overlay

        return username;
      }
    }

    return null;
  };

  const blockPosts = () => {
    const posts = document.querySelectorAll(".article-list__item");
    // console.log(!posts);
    if (!posts) return;
    posts.forEach((post) => {
      const authorElement = post.querySelector(
        ".article-list__user .tooltipped__user",
      );
      if (!authorElement) return;

      const authorName = authorElement.getAttribute("aria-name"); //fetch username
      if (!authorName) return;

      if (
        blockedUsers.includes(authorName) ||
        publicShameUser.includes(authorName)
      ) {
        post.classList.toggle("block-it", true);
        switch (remindWay) {
          case "hide":
            post.classList.toggle("block-it__hide", true);
            break;
          case "blur":
            post.classList.toggle("block-it__blur", true);
            /*
            post.style.filter = "blur(5px)";
            post.addEventListener("mouseenter", () => {
              post.style.filter = "none";
            });
            post.addEventListener("mouseleave", () => {
              post.style.filter = "blur(5px)";
            });*/
            break;
          case "opacity":
            post.classList.toggle("block-it__opacity", true);
        }
      }
    });
  };

  // 使用 MutationObserver 监听页面变化
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        blockPosts();
        // console.log("------blocked------");
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始执行一次
  blockPosts();
})();
