// ==UserScript==
// @name         小红书自动评论
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     1.0.5
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



// @description 小红书自动评论和@
// @downloadURL https://update.greasyfork.org/scripts/480335/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480335/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  "use strict";

  let index = 0;

  setInterval(() => {
    if (index > 0 && !document.querySelectorAll(".cover.ld.mask")[index]) {
      index = 0;
      document.querySelector(".reload").click();
    }
    console.log(index);

    document.querySelectorAll(".cover.ld.mask")[index].click();

    setTimeout(() => {
      if (Number(document.querySelector(".chat-wrapper").innerText) < 8000) {
        //进入第index个作品
        setTimeout(() => {
          document.querySelector(".chat-wrapper").click();
        }, 1000);

        setTimeout(() => {
          //评论并@
          document.querySelector("#content-textarea").innerHTML = "465";
          document
            .querySelector("#content-textarea")
            .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));

          // 获取输入框元素

          document.querySelector("#content-textarea").innerHTML +=
            "@不吃晚饭啊啊我aa";
          document
            .querySelector("#content-textarea")
            .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));
          document.querySelector("#content-textarea").focus();
          document.execCommand("selectAll", false, null);
          document.getSelection().collapseToEnd();

          var inputElement = document.querySelector("#content-textarea");
          // 模拟键盘输入@
          var event = new Event("keydown", { key: "@" });
          inputElement.dispatchEvent(event);

          // 模拟键盘输入@
          var event = new Event("keyup", { key: "@" });
          inputElement.dispatchEvent(event);

          setTimeout(() => {
            document
              .querySelector(".mention-select-container ul li")
              .dispatchEvent(
                new Event("mousedown", { bubbles: !0, cancelable: !0 })
              );
          }, 2000);

          setTimeout(() => {
            document.querySelector(".submit").click();
            setTimeout(() => {
              //退出作品
              try {
                document.querySelector(".close.close-mask-dark").click();
              } catch (error) {
                window.location.href="https://www.xiaohongshu.com/explore"
              }
            }, 3000);
          }, 4000);
        }, 3000);
      } else {
        try {
          document.querySelector(".close.close-mask-dark").click();
        } catch (error) {
          window.location.href="https://www.xiaohongshu.com/explore"
        }
      }

      index++;
    }, 2000);
  }, 14000);

  // Your code here...
})();
