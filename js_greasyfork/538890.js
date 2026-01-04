// ==UserScript==
// @name         51CTO博客沉浸式阅读
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  51CTO博客 免登录复制 一键复制 沉浸式阅读 护眼模式
// @author       white
// @match        https://blog.51cto.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAAAXNSR0IArs4c6QAAAVFJREFUOE+NVEFywjAMlDyF6SMKDSeSV5S8pPAS2pfAT6CvCD3VE/qITihWK9fyOEak+JSJN6uVdhUEAHifjjcEsOTngWPLtpsF/FrD481kRPvyeKoZf5iOPwCgyApbT3aYjHaAuBiShQDbedutAhnlWL7/I8sq8UUOdkRv1fG0bYr7wjj3zMrSVnWypJ0hpc1ktETEjWCIaCXKUtkWiCyDENGKopw4N+0amSbIkjF1Zb98Ec00MmaGPAN0jt3578RoaHOOZHA+95w0iE9ajsi5uvr83muOlm2Hfmba0RT/gl/mbfd6QRZM822ms0iJ8/xJ1pqHuwUasxOsvEd2BQCsVBRAUMYfxKSzYz5rWSwiWRJYS0S+BYP4GGbWWxkeMnehZYyL4JU9U+ORLHrvxyCKbyXrxeIisEGxN4Cj4eNAVISFj+EM8/DtJ4Fdp7OUH8AP7ara7/cMNWcAAAAASUVORK5CYII=
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538890/51CTO%E5%8D%9A%E5%AE%A2%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/538890/51CTO%E5%8D%9A%E5%AE%A2%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
  "use strict";

  class Wonderful {
    constructor() {
      this.backgroundColor = "#557F43";
      // 需要拦截的黑名单事件
      this.winBlackEvenName = ["scroll", "wheel"];
      this.docBlackEvenName = ["scroll", "wheel"];
      this.log = false;
      this.domTreeChange = [
        () => {
          document.querySelector(".Header")?.remove();
          document.querySelector("header")?.remove();
          document.querySelector(".detail-content-right")?.remove();
          document.querySelector(".action-aside")?.remove();
          document.querySelector(".action-box")?.remove();
          document.querySelector("article>section")?.remove();
          document.querySelector("aside.minmenu")?.remove();
          document.querySelector("div.Footer")?.remove();
          document.querySelector("div.comment-textarea")?.remove();
          document.querySelector("#comment")?.remove();
        },
      ];
      this.style = `.copy_btn { font-size: 0 !important; }
                    .copy_btn:before { content: "一键复制"; font-size: 12px; vertical-align: middle; }
                    .copy_btn_copy:before { content: "已复制"; font-size: 12px; vertical-align: middle; }
                    a.downloadCode {display: none !important;}`;
      // 修改监听事件
      this.changeAttr = [
        {
          obj: window,
          name: "articleCopy",
          func: () => {
            $(".article-content-wrap").unbind("keydown").unbind("copy");
            $("body").off("click", ".copy_btn");
            $(".copy_btn").bind("click", function (e) {
              let idNumber = e.target.dataset.clipboardTarget;
              idNumber = idNumber.match(/\d+/).at(0);
              const value = $("#code_id_" + idNumber).text();
              navigator.clipboard.writeText(value);
              $(e.target).toggleClass("copy_btn_copy");
            });
          },
        },
      ];
      // 添加监听事件
      this.addListentEvent = [
        {
          obj: document,
          whiteName: "WHITE_DOMContentLoaded",
          func: () => {
            document.body.style.backgroundColor = this.backgroundColor;

            const ele = document.querySelector(".Content.detail-content-new");
            ele.style.padding = "0px";
            ele.style.marginTop = "30px";
            ele.style.backgroundColor = this.backgroundColor;

            const article = document.querySelector(
              "article.detail-content-left"
            );
            article.style.setProperty("float", "none");
            article.style.setProperty("width", "unset");

            const next_div = article.firstElementChild;
            next_div.style.borderRadius = " 10px";

            const ele_center = document.querySelector("#page_center");
            ele_center.style.width = "1000px";
            ele_center.style.margin = "auto";

            this.CreateBackTop();
          },
        },
      ];
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
    ChangeAttr() {
      // 修改对象属性
      this.changeAttr.forEach((item) => {
        Object.defineProperty(item.obj, item.name, {
          value: item.func,
          writable: false,
        });
      });
    }
    AddListenEvent() {
      // 添加监听事件
      this.addListentEvent.forEach((item) => {
        item.obj.addEventListener(item.whiteName, item.func);
      });
    }
    CreateStyle(text) {
      const sheet = document.createTextNode(text);
      const el = document.createElement("style");
      el.appendChild(sheet);
      document.getElementsByTagName("head")[0].appendChild(el);
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
      this.CreateStyle(this.style);
      this.ChangeAttr();
      this.AddListenEvent();
    }
  }

  new Wonderful().main();
})();
