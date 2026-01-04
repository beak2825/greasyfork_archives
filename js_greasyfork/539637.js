// ==UserScript==
// @name         知乎，谢谢我不想分享
// @namespace    https://github.com/YanxinTang/zhihu-i-dont-want-to-share-my-thoughts
// @version      0.0.1
// @description  隐藏知乎首页“分享此刻的想法”部件
// @author       tyx1703
// @license      MIT
// @noframes
// @run-at      document-start
// @grant       GM_addStyle
// @match       https://www.zhihu.com
// @match       https://www.zhihu.com/follow
// @match       https://www.zhihu.com/hot
// @match       https://www.zhihu.com/column-square
// @downloadURL https://update.greasyfork.org/scripts/539637/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E8%B0%A2%E8%B0%A2%E6%88%91%E4%B8%8D%E6%83%B3%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/539637/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E8%B0%A2%E8%B0%A2%E6%88%91%E4%B8%8D%E6%83%B3%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(() => {
  GM_addStyle(`
    #root .Topstory-container > .Topstory-mainColumn > .WriteArea.Card {
      display: none !important;
    }
  `)
})();
