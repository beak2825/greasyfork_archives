// ==UserScript==
// @name         按 / 回到搜索框
// @version      0.2.4
// @description  想要输入新的搜索内容时，按下 ` / ` 键，光标焦点就会自动跳转到搜索框中，接下来就可以愉快的输入新的搜索内容啦！
// @author       missiont522
// @license      MIT
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @match        *://*.baidu.com/*
// @match        *://*.sogou.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.greasyfork.org/*
// @match        *://*.douban.com/*
// @match        *://fanyi.sogou.com/*
// @match        *://share.dmhy.org/*
// @match        *://*.weibo.com/*
// @match        *://*.shanbay.com/*
// @match        *://*.jd.com/*
// @match        *://*.cnki.net/*
// @match        *://developers.weixin.qq.com/*
// @match        *://*.ixigua.com/*
// @match        *://kimi.moonshot.cn/*
// @match        *://*.toutiao.com/*
// @match        *://*.xiaohongshu.com/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/429436/%E6%8C%89%20%20%E5%9B%9E%E5%88%B0%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/429436/%E6%8C%89%20%20%E5%9B%9E%E5%88%B0%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

const siteList = [
  { id: 0, name: "baidu", query: "#kw" },
  // { id: 1, name: "google", query: "没有" },
  { id: 3, name: "sogou", query: `#upquery.query` },
  {
    id: 4,
    name: ["taobao", "tmall", "jd", "bilibili"],
    query: `[accesskey="s"]`,
  },
  {
    id: 5,
    name: "search.bilibili",
    query: `.search-input-el`,
  },
  {
    id: 7,
    name: ["greasyfork", "toutiao", "ixigua", "developers.weixin.qq.com"],
    query: '[type="search"]',
  },
  { id: 8, name: "douban", query: "#inp-query" },
  { id: 10, name: "fanyi.sogou", query: "#trans-input" },
  { id: 11, name: "dmhy", query: "input#keyword" },
  { id: 12, name: "weibo", query: "input.woo-input-main" },
  { id: 13, name: "shanbay", query: "#search .input" },
  { id: 14, name: ["cnki", "xiaohongshu"], query: ".search-input" },
  { id: 15, name: "baike.baidu", query: ".searchInput" },
  { id: 16, name: "tieba.baidu", query: "#wd1" },
  { id: 17, name: "kimi.moonshot", query: `div[contenteditable="true"]` },
  // { id: 99, name: '', query: ``,},
];

siteList.forEach((item) => {
  const names = Array.isArray(item.name) ? item.name : [item.name];
  const isMatched = names.some((name) => location.host.includes(name));
  if (!isMatched) {
    return;
  }

  /** @type {HTMLInputElement} */
  let form = document.querySelector(item.query);
  // console.log("|", item.name, form);
  document.documentElement.addEventListener("keydown", (event) => {
    if (event.key !== "/") return;
    if (!form) {
      form = document.querySelector(item.query);
    }

    if (document.activeElement === form) {
      return;
    }

    form.focus();
    event.preventDefault();

    if (form.value) {
      const contentLen = form.value.length;
      form.setSelectionRange(contentLen, contentLen);
    }
  });
});
