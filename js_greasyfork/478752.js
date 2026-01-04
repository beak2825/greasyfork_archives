// ==UserScript==
// @name         抖音喜欢文档
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.0.0
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-body
// @author      zhizhu

// @description 抖音喜欢下载
// @downloadURL https://update.greasyfork.org/scripts/478752/%E6%8A%96%E9%9F%B3%E5%96%9C%E6%AC%A2%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/478752/%E6%8A%96%E9%9F%B3%E5%96%9C%E6%AC%A2%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  "use strict";

  console.log(1132);

  let douyinList = [];
  let text = ""

  var addScrollTopVal = setInterval(() => {
    if (document.querySelector(".kwodhZJl .Bllv0dx6")) {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight + 1500;
      clearInterval(addScrollTopVal);
      addScrollTopVal = null;

      for (const item of document.querySelectorAll(
        ".Eie04v01._Vm86aQ7.PISbKxf7 .B3AsdZT9.chmb2GX8.DiMJX01_"
      )) {
        douyinList.push({
          id: `https://www.douyin.com/user/self?modal_id=${
            item.href.split("/")[item.href.split("/").length - 1]
          }&showTab=like`,
          title: item.children[1].innerHTML,
        });
      }

      douyinList.forEach((item)=>{
        text += `${item.id}\r\n`;
        text += `${item.title}\r\n`;

      })

        // 创建一个Blob对象表示文本内容
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    // 创建一个下载链接
    const url = URL.createObjectURL(blob);
    // 创建一个隐藏的a标签并设置下载属性
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-document.txt";
    a.style.display = "none";
    // 将a标签添加到DOM中，并触发点击事件
    document.body.appendChild(a);
    a.click();
    // 从DOM中移除a标签并释放URL对象
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
      console.log(douyinList);


    } else {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight + 1500;
    }
  }, 2000);
  // Your code here...
})();
