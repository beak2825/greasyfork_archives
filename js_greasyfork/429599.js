// ==UserScript==
// @name         谷歌翻译忽略代码块和指定元素
// @namespace    https://github.com/wangrongding/ding-script.git
// @version      2.0
// @description  使用谷歌翻译插件翻译网页时，忽略代码块和一些指定的无需翻译的元素(Use Google translation plugin page, ignore the code block and some elements of the specified without translation.)
// @author       汪荣顶
// @homeurl      https://github.com/wangrongding/ding-script/blob/main/githubNoTranslate.js
// @homeurl      https://greasyfork.org/zh-CN/scripts/429599
// @match        https://github.com/*
// @match        https://npmjs.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.google.com/*
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429599/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%BF%BD%E7%95%A5%E4%BB%A3%E7%A0%81%E5%9D%97%E5%92%8C%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/429599/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%BF%BD%E7%95%A5%E4%BB%A3%E7%A0%81%E5%9D%97%E5%92%8C%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
  "use strict";
  // 翻译忽略的元素
  const passTransList = ["pre"];
  if (window.location.hostname.indexOf("github") !== -1) {
    // 以下为github中不需要翻译的元素,可根据需求自定义配置
    const githubSelector = [
      ".bg-gray-light.pt-3.hide-full-screen.mb-5",
      "summary.btn.css-truncate",
      ".commit-author",
      ".js-navigation-open.link-gray-dark",
      ".Box-title",
      ".BorderGrid-cell > div.mt-3 > a.muted-link",
      ".BorderGrid-cell > ul.list-style-none",
      ".hx_page-header-bg",
      ".list-style-none", //仓库名
      ".text-bold", //首页人名,仓库名
      "div[data-repository-hovercards-enabled] .body > div .flex-items-baseline",
      ".js-header-wrapper", //nav
      ".file-navigation", //代码仓库按钮
      ".Details:not(.Details--on) .Details-content--hidden-not-important", //代码仓库和顶部导航
      //对于github的插件(我使用的octotree)👇
      ".github-repo-size-div",
      ".octotree-tree-view",
    ];
    //对于github的插件(我使用的octotree)
    passTransList.push(...githubSelector);
  } else {
    passTransList.push(
      ...[
        // 以下为 eslint-plugin-vue 中不需要翻译的元素,可根据需求自定义配置
        ".eslint-code-container",
      ],
    );
  }
  // 添加忽略的属性
  function addNoTranslateAttr(array) {
    array.forEach((name) => {
      [...document.querySelectorAll(name)].forEach((node) => {
        if (node.className.indexOf("notranslate") === -1) {
          node.classList.add("notranslate");
        }
      });
    });
  }

  window.onload = () => {
    setTimeout(function () {
      addNoTranslateAttr(passTransList);
      console.log("🚀🚀🚀 / passTransList", passTransList);
    }, 1500);
  };
})();
