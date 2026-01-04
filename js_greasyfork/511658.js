// ==UserScript==
// @name        becoder
// @namespace   Violentmonkey Scripts
// @match       https://www.becoder.com.cn/*
// @grant       none
// @version     1.10
// @author      EarthMessenger
// @description 2024/1/23 15:25:23
// @grant       GM.getValue
// @grant       unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511658/becoder.user.js
// @updateURL https://update.greasyfork.org/scripts/511658/becoder.meta.js
// ==/UserScript==

(() => {
  // utilities BEGIN

  const removeNode = (element) => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };

  // utilities END

  const fixRightClick = () => {
    unsafeWindow.oncontextmenu = null;
    document.oncontextmenu = null;
  };

  const fixPDF = () => {
    const iframes = document.querySelectorAll("iframe");
    const pat =
      /https:\/\/www\.becoder\.com\.cn\/js\/pdf\/web\/viewer\.html\?file=(\S*)/gm;
    for (const oldPdf of iframes) {
      const res = pat.exec(oldPdf.src);
      if (res == null) continue;
      const url = res[1];
      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => blob.slice(0, blob.size, "application/pdf"))
        .then((blob) => {
          const newPdf = document.createElement("iframe");
          newPdf.src = URL.createObjectURL(blob);
          newPdf.width = oldPdf.width;
          newPdf.height = oldPdf.height;
          const parent = oldPdf.parentNode;
          parent.replaceChild(newPdf, oldPdf);
        });
    }
  };

  const fixHomePage = () => {
    if (window.location.pathname !== "/index") return;

    const mainContent = document.querySelector("body > main.main-content");
    removeNode(mainContent.querySelector(".carousel")); // AI 頭圖
    removeNode(mainContent.querySelector(".side-column > div:nth-child(2)")); // 提交統計


    Array.from(document.querySelectorAll("body > nav")) // NodeList is not array
      .slice(0, -1)
      .forEach((ele) => {
        removeNode(ele);
      });

    document.body.style["background"] = "#f0f2f5";
  };

  const redirectHomePage = () => {
    if (window.location.pathname === "/") {
      window.location.replace(new URL("/index", location.href).toString());
    }
  };

  const fillLoginCredentials = async () => {
    if (window.location.pathname !== "/login") return;

    // 根據 https://wiki.greasespot.net/GM.getValue，GM.getValue 應該是不支持 object 的，
    // 但是相信 2025 年不會有人使用 Greasemonkey 的。而且 Tampermonkey 和 Violentmonkey 都支持，
    // 那就假裝它確實是可行的。
    const credentials = await GM.getValue("credentials");

    if (credentials === undefined) return;

    try {
      const {username, password} = credentials;

      document.getElementById("username").value = username;
      document.getElementById("password").value = password;

      const captcha = document.getElementById("captcha");

      const autoSubmitCaptcha = (ev) => {
        if (ev.target.value.length !== 4) return ;
        unsafeWindow.login();
      };

      captcha.addEventListener("input", autoSubmitCaptcha);

      captcha.focus();
    } catch (error) {
      console.error("填寫的憑據無效。");
    }
  };

  const fixNavbar = () => {
    const body = document.body;
    const navbar = document.querySelector("body > nav > div");

    if (navbar === null) return;

    navbar.children[0].href = "/index"; // 舊主頁

    const navbarNav = navbar.children[1];
    removeNode(navbarNav.children[6]); // 工具
    removeNode(navbarNav.children[0]); // 首頁

    navbar.children[0].href = "/index"; // 使用舊首頁
  };

  if (location.pathname.startsWith('/courses')) return;

  redirectHomePage();
  fixRightClick();
  fixPDF();
  fixHomePage();
  fillLoginCredentials();
  fixNavbar();
})();
