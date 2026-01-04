// ==UserScript==
// @name         作品收集
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     1.0.2
// @license MIT
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
// @connect eeapi.cn
// @run-at      document-body
// @author      zhizhu

// @description 收集链接
// @downloadURL https://update.greasyfork.org/scripts/481057/%E4%BD%9C%E5%93%81%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/481057/%E4%BD%9C%E5%93%81%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
(function () {
  "use strict";
  let zuopinList = [];
  let text = "";

  GM_registerMenuCommand("导出作品", exportZuopin);

  function exportZuopin() {
    let interval = setInterval(() => {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight + 1500;

      if (
        document.querySelector(".OodIpDwK") &&
        document.querySelector(".OodIpDwK").innerHTML == "刷新"
      ) {
        document.querySelector(".OodIpDwK").click();
      }

      if (
        document.querySelector(".Bllv0dx6") &&
        document.querySelector(".Bllv0dx6").innerHTML == "暂时没有更多了"
      ) {
        clearInterval(interval);
        interval = null;

        let i = 0;

        for (const item of document.querySelectorAll(
          ".B3AsdZT9.chmb2GX8.DiMJX01_"
        )) {
          i++;

          console.log(i);

          // text += `${item.href}`;
          // text += `\r\n`;
          // if (
          //   item ==
          //   document.querySelectorAll(".B3AsdZT9.chmb2GX8.DiMJX01_")[
          //     document.querySelectorAll(".B3AsdZT9.chmb2GX8.DiMJX01_").length -
          //       1
          //   ]
          // ) {
          //   // 创建一个Blob对象表示文本内容
          //   const blob = new Blob([text], {
          //     type: "text/plain;charset=utf-8",
          //   });
          //   // 创建一个下载链接
          //   const url = URL.createObjectURL(blob);
          //   // 创建一个隐藏的a标签并设置下载属性
          //   const a = document.createElement("a");
          //   a.href = url;
          //   a.download = "my-document.txt";
          //   a.style.display = "none";
          //   // 将a标签添加到DOM中，并触发点击事件
          //   document.body.appendChild(a);
          //   a.click();
          //   // 从DOM中移除a标签并释放URL对象
          //   document.body.removeChild(a);
          //   URL.revokeObjectURL(url);
          // }

          GM_xmlhttpRequest({
            method: "GET",
            url: `https://eeapi.cn/api/video/32BA6AAD06C4E5FF5A2F1BEF0285F02F8F53FEF1514E6BADB2/4775/?url=${item.href}`,
            onload: function (response) {
              text += `${JSON.parse(response.responseText).data.video}`;
              text += `\r\n`;

              zuopinList.push({
                title: JSON.parse(response.responseText).data.title,
                url: JSON.parse(response.responseText).data.video,
              });
              console.log(text);
              if (
                item == document.querySelectorAll(
                    ".B3AsdZT9.chmb2GX8.DiMJX01_"
                  )[document.querySelectorAll(
                    ".B3AsdZT9.chmb2GX8.DiMJX01_"
                  ).length-1]
              ) {
                setTimeout(() => {
                   // 创建一个Blob对象表示文本内容
                const blob = new Blob([text], {
                  type: "text/plain;charset=utf-8",
                });
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
                }, 15000);
               
              }
            },
          });
        }
      }
    }, 2000);
  }

  // Your code here...
})();
