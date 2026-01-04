// ==UserScript==
// @name         摸鱼助手-知乎
// @namespace    https://lichuanyang.top/
// @version      1.3
// @description  摸鱼辅助工具，移除知乎logo, 移除问题页面的大标题
// @author       流沙
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         http://zhihu.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483047/%E6%91%B8%E9%B1%BC%E5%8A%A9%E6%89%8B-%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/483047/%E6%91%B8%E9%B1%BC%E5%8A%A9%E6%89%8B-%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
      .PageHeader .QuestionHeader-title {
        display: none;
      }
      .css-1hlrcxk {
        display: none;
      }
      .css-olurbu img.content_image[data-size="normal"], .css-olurbu img.origin_image[data-size="normal"] {
        width: 50%;
      }
      .css-1em8ozd img.content_image[data-size="normal"], .css-1em8ozd img.origin_image[data-size="normal"] {
        width: 50%;
      }
      .css-jflero img.content_image[data-size="normal"], .css-jflero img.origin_image[data-size="normal"] {
        width: 50%;
      }
      .test1 {}
    `);


})();

