// ==UserScript==
// @name         Google搜索仅显示中文页面的结果【在任意位置四击鼠标左键跳转(包括四击以上)】
// @namespace    https://github.com/dadaewqq/fun
// @version      0.9
// @description  通过跳转页面增加`lr=lang_zh-CN|lang_zh-TW`参数实现谷歌搜索仅显示中文页面的结果(现在已去除zh-tw的结果，因zh-tw质量似乎并不是很好)
// @author       dadaewqq
// @match        https://www.google.com*search?q=*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460990/Google%E6%90%9C%E7%B4%A2%E4%BB%85%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E9%A1%B5%E9%9D%A2%E7%9A%84%E7%BB%93%E6%9E%9C%E3%80%90%E5%9C%A8%E4%BB%BB%E6%84%8F%E4%BD%8D%E7%BD%AE%E5%9B%9B%E5%87%BB%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E8%B7%B3%E8%BD%AC%28%E5%8C%85%E6%8B%AC%E5%9B%9B%E5%87%BB%E4%BB%A5%E4%B8%8A%29%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/460990/Google%E6%90%9C%E7%B4%A2%E4%BB%85%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E9%A1%B5%E9%9D%A2%E7%9A%84%E7%BB%93%E6%9E%9C%E3%80%90%E5%9C%A8%E4%BB%BB%E6%84%8F%E4%BD%8D%E7%BD%AE%E5%9B%9B%E5%87%BB%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E8%B7%B3%E8%BD%AC%28%E5%8C%85%E6%8B%AC%E5%9B%9B%E5%87%BB%E4%BB%A5%E4%B8%8A%29%E3%80%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Set the time frame in which clicks are counted
const clickTimeFrame = 800; // 500 milliseconds

// Initialize click count and timer variables
let clickCount = 0;
let clickTimer = null;

// Add event listener to the body element
document.querySelector('body').addEventListener("click", function (event) {
  // If the click target is not the search input box, start counting clicks
  // event.target.closest('.gLFyf') 是聚焦到google的搜索框 现在版本的代码不需要
  if (111 != !event.target.closest('.gLFyf')) {
    // If the click timer is running, increment the click count
    if (clickTimer !== null) {
      clickCount++;
    } else {
      // Otherwise, start the click timer and reset the click count
      clickTimer = setTimeout(() => {
        if (clickCount > 3) {
          window.location = (`${location.href}&lr=lang_zh-CN`);
        }
        clickCount = 0;
        clickTimer = null;
      }, clickTimeFrame);
      clickCount++;
    }
  }
});

})();
