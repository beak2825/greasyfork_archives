// ==UserScript==
// @name         知乎专栏发布时间置顶
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将知乎专栏文章的发布时间提前到文章顶部
// @author       mtaech
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/tardis/zm/art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466383/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/466383/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pub_div = document.querySelector(".ContentItem-time");
    console.log('pub_div', pub_div)
    let header = document.querySelector(".Post-Header");
    if (header) {
      console.log('heande', header)
      header.append(pub_div)
    }
    let zm_header = document.querySelector(".AuthorInfo-content");
    if (zm_header) {
      console.log('zm_header', zm_header)
      zm_header.append(pub_div);
    }
})();