// ==UserScript==
// @name         51larger
// @namespace    https://v6.51.la/
// @version      1.0.11
// @description  Remove the advertisement and increase the font to display 100 items per page
// @author       Your Name
// @license      MIT
// @match        https://v6.51.la/user/application
// @icon         https://img.logojiang.com/wp-content/uploads/2021/08/2021080664849logojiang.jpg
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463312/51larger.user.js
// @updateURL https://update.greasyfork.org/scripts/463312/51larger.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("mousemove", function (event) {
    var element = document.querySelector('.la-ad-main[data-v-7ccdbbc1=""]');
    if (element) {
      element.remove();
    }
  });

  GM_addStyle(`
  .el-table--fit {
    width: 100%;
    display: block;
    margin: 0 auto;
  }
  .application-index .main-content-container {
      position: relative;
      max-width: 1920px;
      min-width: 1080px;
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
  }
  .el-table .col-first {
    width: 60%;
    max-width: 80%;
  }
     .text-ellipsis, .text-ellipsis a {
      /* overflow: hidden; */
      text-overflow: inherit;
      display: block;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
  }
  .c-table .el-table .cell {
      line-height: normal;
      padding-left: 20px;
      font-size: 15px;
      color: #333;
      font-family: 微软雅黑,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
  }
  `);
  setTimeout(function () {
    document.querySelector(".main-content").style.width = "100%";
    document.querySelector('.la-ad-main[data-v-7ccdbbc1=""]').remove();

    //document.querySelector('th.el-table_1_column_7').remove();
    //document.querySelector('td.el-table_1_column_7').remove();
  }, 1500);
  /*window.onload = () => {
    document.querySelector('input.el-input__inner[placeholder=请选择]').click();

document.querySelectorAll('.el-select-dropdown__item')[5].click();

setTimeout(() => {
  document.querySelector('input.el-input__inner[placeholder=请选择]').click();
}, 1000);

setTimeout(() => {
  document.querySelectorAll('.el-select-dropdown__item')[5].click();
}, 1001);
}*/
  function checkElement() {
    var element = document.querySelector(
      "input.el-input__inner[placeholder=请选择]"
    );
    if (element) {
      clearInterval(timer);
      element.click();
      document.querySelectorAll(".el-select-dropdown__item")[5].click();
    }
  }
  var timer = setInterval(checkElement, 300);
    function scrollToTop() {
    setTimeout(function() {
    window.scrollTo(0, 0);
  }, 500);
}

scrollToTop();
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
