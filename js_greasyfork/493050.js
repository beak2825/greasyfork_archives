// ==UserScript==
// @name        bilibili-filter-roll-ads
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/
// @run-at      document-start
// @grant       none
// @version     1.2
// @author      mesimpler
// @license     MIT
// @description 过滤b站换一换中的广告。(filter bilibili roll ads.)
// @downloadURL https://update.greasyfork.org/scripts/493050/bilibili-filter-roll-ads.user.js
// @updateURL https://update.greasyfork.org/scripts/493050/bilibili-filter-roll-ads.meta.js
// ==/UserScript==

const rmcd = "//api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd";
const feedNum = 12;

window.fetch = new Proxy(window.fetch, {
  apply: function (target, thisArg, argumentsList) {
    const [url, options] = argumentsList;

    // 请求命中
    if (url.includes(rmcd)) {
      const hookUrl = url.replace("ps=10", `ps=${feedNum}`);
      const hookOptions = {
        ...options,
        params: {
          ...options.params,
          ps: feedNum,
        },
      };

      return Reflect.apply(target, thisArg, [hookUrl, hookOptions]).then(
        (response) => {
          return response.json().then((res) => {
            // 过滤广告特征
            res.data.item = res.data.item.filter((video) => video.id !== 0);
            return new Response(JSON.stringify(res), response);
          });
        }
      );
    }

    // 调用原始 fetch
    return Reflect.apply(target, thisArg, argumentsList);
  },
});
