// ==UserScript==
// @name         知乎沉浸式阅读
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  知乎沉浸式阅读 更加护眼 更加简洁 免登录 去除登录弹窗
// @author       white
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAd9JREFUWEfFl91xwjAQhFdOI6YTqAR4gKQLoAsCD0AlOJXEjWCF1fks/zE4xhZ6YQYw92l1t6wM3rxMo/6XjXHDdBSuD6TYm6T82x5ACp9gRiruq6aIMMPepHzLA6zsNUBxxUhxMBMP8GWnyHAdRfZHPyoqJKLAyi5gcAoKYLHE0Zy7AqT340lgsRgMsjOARYKjmQ2u0j8AnFRY218AcXgFDqbpFUqhowtcHOSj1dZjnRQwOOPbLMFC3L2aCKdG1w0bKIB+rwzCZ3oD5KNSyB/BzS4y8Dj8ynfTOCbdQC8Abb5Peyq6PygAQKusNl1ggGZLBQfgGVqnhKwIl7wH5iW6BSx2raM6SA88G3xOxA3x8ADsgfLuCUJHlIIcPVkG8TgK1Heucq4ti2/HH8M6gM665AamGg8xig/UAdSS6Qt0x7K5BADY4mB2edENIiydLWuKUgAxLbFpqpThxzVnLyf0ChTxqSjIBmWkovfTlhWAz7BY/Y/pBQAGSN1tPTWJKmtr77tOEIGh5eKUEbC5mxCuDHEjb3b4N/TF2zMjx3RXi3LamNUpafOSTgASw3imwwURhekA8MwDX/u8AvCeWD7h5UTiVrhbkaimWaNyMwoH8eBqpkrw9S2X09daqvfTfzCejTD5/vQeAAAAAElFTkSuQmCC
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539169/%E7%9F%A5%E4%B9%8E%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/539169/%E7%9F%A5%E4%B9%8E%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

ZhiHu = {
  article: "article",
  answer: "answer",
};
(function () {
  "use strict";
  class Wonderful {
    constructor() {
      this.backgroundColor = "#557F43";
      // 需要拦截的黑名单事件
      this.winBlackEvenName = ["scroll", "wheel"];
      this.docBlackEvenName = ["scroll"];
      this.log = false;
      this.host = location.host;
      this.width = "1000px";

      this.domTreeChange = [
        () => {
          if (this.answer() == ZhiHu.article) {
            document.querySelector(".Post-Row-Content-right")?.remove();
            document.querySelector(".AppHeader")?.parentElement.remove();
          }
        },
        () => {
          if (this.answer() == ZhiHu.article) {
            // 底部状态栏关闭
            document.querySelector("article > div:nth-child(5)")?.remove();
            // 关闭底部文章推荐
            document.querySelector("div.Post-Sub.Post-NormalSub")?.remove();
          }

          // 关闭返回顶部
          document.querySelector('div[role="complementary"]')?.remove();
          // 关闭弹窗
          document
            .querySelector("div.Modal-wrapper")
            ?.parentElement.parentElement.parentElement.remove();
        },
        () => {
          if (this.answer() == ZhiHu.answer) {
            // 移除侧边
            document.querySelector(".Question-sideColumn")?.remove();
            // 取消宽度限制
            let ele = document.querySelector(".Question-mainColumn");
            if (ele) {
              ele.style.width = "unset";
            }
            // 主体内容
            ele = document.querySelector(".Question-main");
            if (ele) {
              ele.style.width = this.width;
              ele.style.padding = "unset";
              ele.style.margin = "0 auto";
            }
            // 文章信息
            ele = document.querySelector(".QuestionHeader");
            if (ele) {
              ele.style.width = this.width;
              ele.style.margin = "0 auto";
              ele.style.borderRadius = "10px";
            }
            // 文章信息
            ele = document.querySelector(
              "div.QuestionHeader div.QuestionHeader-content"
            );
            if (ele) {
              ele.style.padding = "unset";
              ele.style.width = "unset";
            }
          }
        },
        () => {
          const body = document.querySelector("html");
          body.style.overflowY = "scroll";
          body.style.height = "100vh";
          body.style.margin = "unset";
        },
      ];

      // 添加监听事件
      this.addListentEvent = [
        {
          obj: document,
          whiteName: "WHITE_DOMContentLoaded",
          func: () => {
            if (this.answer() == ZhiHu.article) {
              document.querySelector("#root").style.marginTop = "30px";
              const ele = document.querySelector(".Post-Row-Content-left");
              ele.style.width = "1000px";
              ele.style.margin = "auto";
              ele.style.borderRadius = "10px";
            }
            document.body.style.backgroundColor = this.backgroundColor;

            this.CreateBackTop();
          },
        },
      ];
    }
    answer() {
      // 文章
      let t;
      if (this.host === "zhuanlan.zhihu.com") {
        t = ZhiHu.article;
      } else {
        // www.zhihu.com
        t = ZhiHu.answer;
      }
      return t;
    }
    DomTree() {
      /** 针对dom树进行修改 */
      new MutationObserver((events, observer) => {
        events.forEach((e) => {
          e.addedNodes.forEach((target) => {
            if (target && target.nodeType == 1) {
              this.domTreeChange.forEach((func) => {
                try {
                  func();
                } catch (error) {
                  console.error(error);
                }
              });
            }
          });
        });
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    WindowEvent() {
      // 拦截window事件
      const whiteList = this.addListentEvent.map((item) => item.whiteName);
      window._addEventListener = window.addEventListener;
      Object.defineProperty(window, "addEventListener", {
        value: (name, func) => {
          this.log && console.log(`window 事件名：${name}\t函数：${func}`);
          if (this.winBlackEvenName.includes(name)) {
            this.log && console.log(`取消监听${name}事件！`);
            return;
          }
          if (whiteList.includes(name)) {
            window._addEventListener(name.split("_").at(1), func);
            return;
          }
          window._addEventListener(name, func);
        },
      });
    }
    DocumentEvent() {
      // 拦截document事件
      const whiteList = this.addListentEvent.map((item) => item.whiteName);
      document._addEventListener = document.addEventListener;
      Object.defineProperty(document, "addEventListener", {
        value: (name, func) => {
          this.log && console.log(`document 事件名：${name}\t函数：${func}`);
          if (this.docBlackEvenName.includes(name)) {
            this.log && console.log(`取消监听${name}事件！`);
            return;
          }
          if (whiteList.includes(name)) {
            document._addEventListener(name.split("_").at(1), func);
            return;
          }
          document._addEventListener(name, func);
        },
      });
    }
    AddListenEvent() {
      // 添加监听事件
      this.addListentEvent.forEach((item) => {
        item.obj.addEventListener(item.whiteName, item.func);
      });
    }
    CreateBackTop() {
      const div = document.createElement("div");
      const btnTop = document.createElement("button");
      const btnButtom = document.createElement("button");
      const backTop = `<svg t="1749719721259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1052" width="32" height="32"><path d="M484.538555 297.401434 78.508052 703.407378c-11.784394 11.813047-11.784394 30.912034 0 42.724057 11.81714 11.81407 30.94171 11.81407 42.757826 0l386.211109-386.181433 379.830795 379.806235c11.453866 11.482519 30.039153 11.482519 41.491996 0 11.511171-11.453866 11.511171-30.039153 0-41.516556L534.372543 303.776631c-1.543146-1.539053-3.417843-2.296299-5.200442-3.412726-0.691755-0.935302-1.055029-2.085498-1.933025-2.962471-11.784394-11.784394-30.912034-11.784394-42.695405 0L484.538555 297.401434zM484.538555 297.401434" fill="#1afa29" p-id="1053"></path></svg>`;
      const backButtom = `<svg t="1749719761870" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1082" width="32" height="32"><path d="M539.461445 726.598566L945.491948 320.592622c11.784394-11.813047 11.784394-30.912034 0-42.724057-11.81714-11.81407-30.94171-11.81407-42.757826 0l-386.211109 386.181433-379.83079499-379.806235c-11.453866-11.482519-30.039153-11.482519-41.49199601 0-11.511171 11.453866-11.511171 30.039153 0 41.516556L489.627457 720.223369c1.543146 1.539053 3.417843 2.296299 5.200442 3.412726 0.691755 0.935302 1.055029 2.085498 1.933025 2.962471 11.784394 11.784394 30.912034 11.784394 42.695405 0L539.461445 726.598566zM539.461445 726.598566" fill="#1afa29" p-id="1083"></path></svg>`;
      btnTop.innerHTML = backTop;
      btnButtom.innerHTML = backButtom;

      btnTop.style.backgroundColor = "transparent";
      btnTop.style.transition = "transform 0.3s ease";
      btnTop.onmouseover = () => {
        btnTop.style.transform = "scale(1.1)";
      };
      btnTop.onmouseout = () => {
        btnTop.style.transform = "scale(1)";
      };

      btnButtom.style.backgroundColor = "transparent";
      btnButtom.style.transition = "transform 0.3s ease";
      btnButtom.onmouseover = () => {
        btnButtom.style.transform = "scale(1.1)";
      };
      btnButtom.onmouseout = () => {
        btnButtom.style.transform = "scale(1)";
      };

      btnTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
      btnButtom.addEventListener("click", () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });

      div.style.zIndex = 9999999;
      div.style.position = "fixed";
      div.style.right = "150px";
      div.style.bottom = "50px";
      div.style.textAlign = "center";
      div.style.cursor = "pointer";
      div.style.display = "flex";
      div.style.flexDirection = "column";

      div.appendChild(btnTop);
      div.appendChild(btnButtom);
      document.body.appendChild(div);
    }

    main() {
      this.DomTree();
      this.WindowEvent();
      this.DocumentEvent();
      this.AddListenEvent();
    }
  }
  new Wonderful().main();
})();
