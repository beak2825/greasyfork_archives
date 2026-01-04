// ==UserScript==
// @name         CSDN搜索纯净版
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  去除CSDN烦人的广告，一些不必要的功能都已经去掉。屏蔽CSDN、知乎登录窗口，知乎链接直接跳转，去除百度恶心的广告，带给你更纯净的享受。如果有问题请进群qq群 518653812 联系
// @author       等风吹来
// @match        https://www.csdn.net/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        *://*.zhihu.com/*
// @match        *://*.zhihu.com/question/*
// @match        *://www.baidu.com/*
// @license    	 MIT
// @grant        GM_addStyle
// @homepage     https://greasyfork.org/zh-CN/scripts/495165-csdn-%E6%90%9C%E7%B4%A2%E9%97%AE%E9%A2%98%E7%BA%AF%E5%87%80%E7%89%88
// @icon         https://profile-avatar.csdnimg.cn/512b41f7aee14a578fb1be595aedaa9f_qq_72675091.jpg
// @downloadURL https://update.greasyfork.org/scripts/495165/CSDN%E6%90%9C%E7%B4%A2%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495165/CSDN%E6%90%9C%E7%B4%A2%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==


(function () {
  "use strict";

  const localurl = window.location.href;
  if (localurl.includes("csdn.net")) {
    let mm = document.querySelector("#kp_box_www_swiper");
    if (mm) {
      mm.remove();
      console.log(
        "CSDN+搜索问题纯净版，欢迎使用！----等风吹来（仅用于学习和交流，不得用于其他目的）"
      );
    }
    let headlines_left = document.querySelector(
      "#floor-www-index_558 > div > div.www-home-content.active > div.headlines > div.headlines-left > div > h3"
    );
    if (headlines_left) {
      let aa = headlines_left.textContent;
      headlines_left.addEventListener("mouseover", () => {
        headlines_left.textContent = "欢迎进程序员群 518653812 （无门槛）";
      });
      headlines_left.addEventListener("mouseout", () => {
        headlines_left.textContent = aa;
      });
    }
    let top_content = document.querySelector(
      "#floor-www-index_558 > div > div.www-home-content.active"
    );
    if (top_content) {
      top_content.style.justifyContent = "center";
    }
    let right_bob = document.querySelector("#www-home-right");
    if (right_bob) {
      right_bob.style.display = "none";
    }
    const center = document.querySelector(".www-home>div");
    if (center) {
      center.style.justifyContent = "center";
    }
    let f4 = document.querySelector(".passport-login-container");
    if (f4) {
      f4.remove();
    }
    const asideElementsIds = ["asideNewComments", "asideArchive", "asideProfile", "asideNewNps"];
    asideElementsIds.forEach((id) => {
      let element = document.querySelector(`#${id}`);
      if (element) {
        element.style.display = "none";
      }
    });
    console.log(
      "CSDN+搜索问题纯净版，欢迎使用！----等风吹来（仅用于学习和交流，不得用于其他目的）"
    );
    let m12 = document.querySelector("#csdn-toolbar > div.toolbar-advert");
    if (m12) {
      m12.remove();
    }
    const asideelement = [
      "#footerRightAds",
      "#mainBox > aside > div.box-shadow.mb8",
      ".recommend-right_aside",
      "#asideWriteGuide",
      "#asideSearchArticle",
      "#asideCategory",
      "#asideHotArticle",
    ];
    asideelement.forEach((sel) => {
      let element = document.querySelector(sel);
      if (element) {
        element.style.display = "none";
      }
    });
  }

  if (localurl.includes("baidu.com")) {
    GM_addStyle(`
      #content_right{display:none !important;}
      `);
    let counter = 0;
    const maxCount = 9;
    let timerID;
    console.log("CSDN+搜索问题纯净版，欢迎使用！----等风吹来");

    const removeAds = () => {
      Array.from(document.querySelectorAll("#content_left>div")).forEach(
        (el) => />广告</.test(el.innerHTML) && el.parentNode.removeChild(el)
      );
    };

    const startTimer = () => {
      timerID = setInterval(() => {
        removeAds();
        counter++;
        if (counter >= maxCount) {
          clearInterval(timerID);
        }
      }, 800);
    };
    startTimer();
    const searchInput = document.querySelector("#kw");

    if (searchInput) {
      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
          if (timerID) {
            clearInterval(timerID);
            counter = 0;
            startTimer();
          }
        }
      });
    }
  }

  if (localurl.includes("zhihu.com")) {
    const login = document.createElement("style");
    login.innerHTML = "html{overflow: auto !important}.Modal-enter-done{display: none !important}";
    document.head.appendChild(login);
    console.log(
      "CSDN+搜索问题纯净版，欢迎使用！----等风吹来（仅用于学习和交流，不得用于其他目的）"
    );
    document.addEventListener("click", (e) => {
      let now = e.target;
      while (now) {
        if (now.tagName.toLowerCase() === "a" && now.hasAttribute("href")) {
          checkIsZhihuLink(now.getAttribute("href"));
        }
        now = now.parentElement;
      }
    });
    const checkIsZhihuLink = (s) => {
      const matcher = s.match(/https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/);
      if (matcher) {
        console.log("Zhihu link detected: " + decodeURIComponent(matcher[1]));
        let url = decodeURIComponent(matcher[1]);
        window.open(url, "_blank");
      }
    };
  }
})();
