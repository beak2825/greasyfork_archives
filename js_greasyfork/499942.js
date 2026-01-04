// ==UserScript==
// @name         Press Slash to Search
// @namespace    impossible98/press-slash-to-search
// @version      0.0.4
// @author       impossible98
// @description  After pressing slash, you can enter slash to search.
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @homepageURL  https://github.com/impossible98/press-slash-to-search-extension
// @match        https://search.bilibili.com/*
// @match        https://www.bilibili.com/*
// @match        https://psnine.com/psngame
// @match        https://www.douyin.com/*
// @downloadURL https://update.greasyfork.org/scripts/499942/Press%20Slash%20to%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/499942/Press%20Slash%20to%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function printError(text) {
    console.log(
      `%c ${text}`,
      "color: #fff; background-color: #F44336; padding: 10px; border-radius: 5px;"
    );
  }
  function printSuccess(text) {
    console.log(
      `%c ${text}`,
      "color: #fff; background-color: #4CAF50; padding: 10px; border-radius: 5px;"
    );
  }
  function handleKeydown(query) {
    if (!query || typeof query !== "string" || query.trim() === "") {
      printError("输入的查询字符串无效。");
      return;
    }
    const cleanedQuery = query.trim();
    if (document.querySelectorAll(query).length > 1) {
      printError(`指定的输入框: ${query} 不是唯一的输入框`);
      return;
    }
    let form = document.querySelector(
      cleanedQuery
    );
    if (!form || form.tagName !== "INPUT") {
      printError(`无法找到指定的输入框: ${cleanedQuery}`);
      return;
    }
    document.documentElement.removeEventListener("keydown", handleKeyDownEvent);
    document.documentElement.addEventListener("keydown", handleKeyDownEvent);
    function handleKeyDownEvent(event) {
      if (event.key === "/") {
        if (form) {
          form.focus();
          printSuccess(`已聚焦到输入框${cleanedQuery}`);
          const tempv = form.value;
          form.value = "";
          form.value = tempv;
        }
        event.preventDefault();
      }
    }
  }
  const eventBound = /* @__PURE__ */ new WeakMap();
  function handleEsc() {
    if (!eventBound.has(document.documentElement)) {
      document.documentElement.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
          return;
        }
        try {
          if (document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
          }
        } catch (error) {
          printError("Error while blurring the active element.");
        }
      });
      eventBound.set(document.documentElement, true);
    }
  }
  function handleSlash() {
    if (location.href.includes("search.bilibili.com/")) {
      handleKeydown("input.search-input-el");
    } else if (location.href.includes("www.bilibili.com")) {
      handleKeydown("input.nav-search-input");
    } else if (location.href.includes("https://psnine.com/psngame")) {
      handleKeydown("input.btn-large");
    } else if (location.href.includes("https://www.douyin.com/search/")) {
      handleKeydown("input.igFQqPKs");
    } else if (location.href.includes("https://www.douyin.com")) {
      handleKeydown("input.st2xnJtZ.YIde9aUh");
    }
  }
  function main() {
    handleSlash();
    handleEsc();
  }
  main();

})();