// ==UserScript==
// @name         贴吧黑名单
// @namespace    http://tampermonkey.net/
// @description:zh-cn 
// @version      2024-11-09
// @description  屏蔽贴吧用户
// @author       You
// @run-at document-start
// @match      *://tieba.baidu.com/*
// @match      *://dq.tieba.com/*
// @match      *://jump2.bdimg.com/*
// @match      *://jump.bdimg.com/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519791/%E8%B4%B4%E5%90%A7%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/519791/%E8%B4%B4%E5%90%A7%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==
(function () {
  "use strict";
  const classBlockLis = [
    "member_thread_title_frs",
    "sign_highlight",
    "icon-crown-super-v2",
      'icon-crown-year-v2',
      'vip_red',
      'icon-member-top',
      'icon-crown-vip'
  ];

  // 等待指定元素加载
  const waitForElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const interval = 100; // 检测间隔
      let elapsed = 0;

      const check = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(check);
          resolve(element);
        } else if (elapsed >= timeout) {
          clearInterval(check);
          reject(`元素 ${selector} 超时未加载`);
        } else {
          elapsed += interval;
        }
      }, interval);
    });
  };
  const waitForAllElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const interval = 100; // 检测间隔
      let elapsed = 0;
      const check = setInterval(() => {
        const element = document.querySelectorAll(selector);
        if (element) {
          clearInterval(check);
          resolve(element);
        } else if (elapsed >= timeout) {
          clearInterval(check);
          reject(`元素 ${selector} 超时未加载`);
        } else {
          elapsed += interval;
        }
      }, interval);
    });
  };
  function removeClassByElement(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    }
  }
  function add_block_user(uid) {
    let key = "block_users";
    let block_users = GM_getValue(key, []);
    block_users.push(uid);
    GM_setValue(key, block_users);
  }
  function get_block_users() {
    let key = "block_users";
    return GM_getValue(key, []);
  }
  async function removeClassByClassBlockList() {
    for (const className of classBlockLis) {
      const elements = await waitForAllElement("." + className);
      elements.forEach((element) => {
        removeClassByElement(element, className);
      });
    }
  }
  async function block_users() {
    let thread_listEl = await waitForElement("#thread_list");
    let id_list = get_block_users();
    if (thread_listEl) {
      for (let child of thread_listEl.children) {
        let nameEl = child.getElementsByClassName("frs-author-name")[0];
        if (!nameEl) continue;
        let data_field = JSON.parse(nameEl.getAttribute("data-field"));
        console.log(data_field);
        if (nameEl.parentElement.getElementsByTagName("button").length === 0) {
          let btnHandle = (uid) => {
            return () => {
              add_block_user(uid);
              block_users();
            };
          };
          let btnEl = document.createElement("button");
          btnEl.innerText = "屏蔽";

          btnEl.onclick = btnHandle(data_field.id);
          nameEl.parentElement.appendChild(btnEl);
        }
        if (id_list.includes(data_field.id)) {
          child.hidden = true;
        }
      }
    }
  }
  async function run(){
    block_users();
    removeClassByClassBlockList();
  }



  document.addEventListener("DOMContentLoaded", function () {
      run()

  });
})();

