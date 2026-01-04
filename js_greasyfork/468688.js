// ==UserScript==
// @name         清爽知乎【PC端】
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  精简知乎网页元素，移除不必要的信息，更清爽的浏览体验
// @author       Ant
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/question/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468688/%E6%B8%85%E7%88%BD%E7%9F%A5%E4%B9%8E%E3%80%90PC%E7%AB%AF%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/468688/%E6%B8%85%E7%88%BD%E7%9F%A5%E4%B9%8E%E3%80%90PC%E7%AB%AF%E3%80%91.meta.js
// ==/UserScript==

const domain = "https://res.laomayi.link/tm/zhihu/";

const element = {
  // 选择dom+隐藏(del=true时，则删除)
  remove(ele, del = false) {
    if (typeof ele != "object") ele = document.querySelector(ele);

    if (ele) {
      if (del) ele.remove();
      else ele.className += " a-hidden";
    }
  },
};

function get_css(url) {
  fetch(url, { method: "GET" })
    .then((response) => response.text())
    .then((res) => {
      // 添加CSS到页面中
      let style = document.createElement("style");
      style.innerHTML = res;
      document.querySelector("head").appendChild(style);
    })
    .catch((error) => {
      console.error(error);
    });
}

// 隐藏视频信息，传入Feed元素，判断是否为视频，是则隐藏
function h_video(com) {
  if (com.className == "Feed") {
    if (
      com.querySelector(".ZVideoItem") ||
      com.querySelector(".VideoAnswerPlayer")
    ) {
      element.remove(com.parentNode);
    }
  }
}

// 执行某个任务，直到完成
function keep_check(func) {
  let check = false;
  let t = setInterval(() => {
    check = func();
    if (check) {
      clearInterval(t);
    }
  }, 1000);
}

// 主页
function home() {
  get_css(domain + "zhihu_home.css");
  // 删除顶部横幅
  let Topstory = document.querySelector(".Topstory");
  if (Topstory) {
    for (const item of document.querySelector(".Topstory").childNodes) {
      if (item.className != "Topstory-container") element.remove(item);
    }
  }

  // 首次隐藏视频信息
  for (const item of document.querySelectorAll(".Feed")) {
    h_video(item);
  }

  // 监听信息dom更新
  let trc = document.querySelector(".Topstory-recommend .Card");
  if (trc) {
    trc.parentNode.addEventListener("DOMSubtreeModified", (params) => {
      h_video(params.target);
    });
  }

  keep_check(() => {
    // 移动用户栏到其他导航栏中
    let 父对象 = document.querySelector(".TopstoryPageHeader"),
      移动元素 = document.querySelector(".AppHeader-userInfo"),
      目标位置 = document.querySelector(".TopstoryPageHeader-aside");

    if (父对象 && 移动元素 && 目标位置) {
      父对象.insertBefore(移动元素, 目标位置.nextSibling);
      element.remove(".AppHeader-inner", true);
      return true;
    } else {
      return false;
    }
  });
}

// 问题页
function question() {
  get_css(domain + "zhihu_question.css");
}

(function () {
  "use strict";

  // 不允许缩放
  for (const meta of document.querySelectorAll("meta")) {
    if (meta.getAttribute("name") == "viewport") {
      let c = meta.getAttribute("content") + ",user-scalable=no";
      meta.setAttribute("content", c);
    }
  }
  get_css(domain + "zhihu_global.css");

  let path = window.location.pathname;
  if (path == "/") {
    home();
  }
  if (path.match("/question")) {
    question();
  }
})();
