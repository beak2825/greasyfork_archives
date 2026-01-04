// ==UserScript==
// @name         [掘金]显示文章收藏数
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @author       sutie
// @description  在文章列表页面展示文章收藏数. 原理是劫持原生的 `fetch` 请求, 在获取文章列表的请求后更改DOM.
// @license      MIT
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @match        https://juejin.cn/recommended
// @match        https://juejin.cn/following
// @match        https://juejin.cn/backend
// @match        https://juejin.cn/frontend
// @match        https://juejin.cn/android
// @match        https://juejin.cn/ios
// @match        https://juejin.cn/ai
// @match        https://juejin.cn/freebie
// @match        https://juejin.cn/career
// @match        https://juejin.cn/article
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/459046/%5B%E6%8E%98%E9%87%91%5D%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459046/%5B%E6%8E%98%E9%87%91%5D%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E6%95%B0.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const apis = [
    "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed",
    // item_info
    "https://api.juejin.cn/recommend_api/v1/article/recommend_follow_feed",
    "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed",
    "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_tag_feed"
  ];
  function callback(list) {
    list.forEach((_item) => {
      const item = "item_info" in _item ? _item.item_info : _item;
      const list2 = document.querySelector(
        `[data-entry-id="${item.article_id}"] .action-list`
      );
      if (!list2) {
        return;
      }
      const firstEle = list2.children[0];
      const dataV = Object.keys(firstEle.dataset).find(
        (k) => k.startsWith("v-") || k.startsWith("v")
      );
      if (!dataV) {
        return;
      }
      const li = document.createElement("li");
      li.dataset[dataV] = "";
      li.classList.add("item");
      const label = document.createElement("span");
      label.innerText = "收藏: ";
      label.dataset[dataV] = "";
      li.appendChild(label);
      const value = document.createElement("span");
      value.innerText = `${item.article_info.collect_count}`;
      value.dataset[dataV] = "";
      li.appendChild(value);
      list2.appendChild(li);
    });
  }
  function main() {
    const originFetch = fetch;
    window.fetch = function(...rest) {
      const url = rest[0];
      if (typeof url === "string" && apis.some((api) => new RegExp(api).test(url))) {
        return new Promise((resolve, reject) => {
          originFetch.bind(this)(...rest).then((res) => {
            if (res.body) {
              const [copyStream, returnStream] = res.body.tee();
              new Response(copyStream, { headers: res.headers }).json().then((result) => {
                if (result && Array.isArray(result.data)) {
                  setTimeout(() => {
                    callback(result.data);
                  }, 1e3);
                }
              });
              resolve(new Response(returnStream, { headers: res.headers }));
            }
          }).catch((err) => reject(err));
        });
      }
      return originFetch.bind(this)(...rest);
    };
  }
  main();
})();
