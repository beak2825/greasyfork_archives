// ==UserScript==
// @name         程序员文档选中美化
// @namespace    https://greasyfork.org/zh-CN/scripts/446417-%E7%A8%8B%E5%BA%8F%E5%91%98%E6%96%87%E6%A1%A3%E9%80%89%E4%B8%AD%E7%BE%8E%E5%8C%96
// @version      2.0.7
// @description  MDN/Mysql 文档选中美化
// @author       itxve
// @repo         https://github.com/itxve/doc-menu-selected-focus
// @match        *://developer.mozilla.org/*
// @match        *://dev.mysql.com/*
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446417/%E7%A8%8B%E5%BA%8F%E5%91%98%E6%96%87%E6%A1%A3%E9%80%89%E4%B8%AD%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446417/%E7%A8%8B%E5%BA%8F%E5%91%98%E6%96%87%E6%A1%A3%E9%80%89%E4%B8%AD%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

const commTop = 50;

function Load(predicate, fn) {
    predicate() && fn();
}
//平滑滚动至浏览目录
const scrollRootElement = (rootEle, top) => {
    rootEle.scrollTo({ top, behavior: "smooth" });
};

const MysqlDocSelct = (cssText) => {
    let path = location.pathname.split("/");
    let dom = document.querySelector("a[href='" + path[path.length - 1] + "']");
    dom.style.cssText = cssText;
    let doc = document.querySelector("#docs-sidebar-toc");
    doc.style.cssText = "max-height:600px;overflow-y: auto;";
    scrollRootElement(doc, dom.offsetTop - doc.offsetTop - 20);
};

const BookSelect = (cssText) => {
    let rootDoc = document.querySelector("div.book-summary");
    if (rootDoc) {
        const task=()=>{
            // fix bug
            let rootDoc = document.querySelector("div.book-summary");
            let path = location.pathname.split("/");
            let dom = rootDoc.querySelector(
                "a[href='" + path[path.length - 1] + "']"
            );
            rootDoc.path=path[path.length - 1];
            dom.style.cssText = cssText;
            scrollRootElement(rootDoc, dom.offsetTop - rootDoc.offsetTop - 20);
        }
        task();
        const pushState = history.pushState;
        history.pushState = (...args) => {
            if (typeof history.onpushstate == "function") {
                history.onpushstate(args);
            }
            return pushState.apply(history, args);
        };
        //声明onpushstate
        window.onpopstate = history.onpushstate = function (e) {
            setTimeout(() => {
                task();
            }, 100);
        };
    } else {
        console.log("location:", location);
    }
};

const MDnDocSelect = () => {
    const getPath = (href) => {
        const path = new URL(href).pathname
        .split("/")
        .filter((_, i) => i > 1)
        .join("/");
        return "/" + path;
    };

    const task = () => {
        // Your code here...
        const activeStyle = `color: var(--text-primary);font-weight: 600;
       border-left: 4px solid #1870F0;
       background-color: var(--category-color-background);`;

      const detailsStyle = `color: var(--text-primary);font-weight: 800;
       border-left: 3px solid var(--text-link);
       background-color: var(--category-color-background);`;

      const rootElement = document.querySelector("#sidebar-quicklinks");

      //展开
      const openTheParent = (adom) => {
          const maxFind = 5;
          let findCOunt = 0;
          while (findCOunt < maxFind) {
              if (adom && adom.tagName !== "DETAILS") {
                  adom = adom.parentElement;
              }
              findCOunt++;
          }
          if (adom == rootElement) return;
          //没有DETAILS的不做open
          if (adom && adom.tagName == "DETAILS") {
              adom.setAttribute("open", "open");
              adom.style = detailsStyle;
          }
      };

      const as = rootElement.querySelectorAll("li a");
      for (var i = 0; i < as.length; i++) {
          const adom = as[i];
          const domHref = getPath(adom.href);
          const localHref = getPath(location.href);
          if (!~adom.href.indexOf("#") && domHref === localHref) {
              adom.style = activeStyle;
              openTheParent(adom);
              scrollRootElement(
                  rootElement,
                  adom.offsetTop - rootElement.offsetTop - commTop
              );
              break;
          }
      }

      //非A标签的选中MDN的接口属性（event）
      const emDom = rootElement.querySelector("li em");
      if (emDom) {
          emDom.style = activeStyle;
          scrollRootElement(
              rootElement,
              emDom.offsetTop - rootElement.offsetTop - commTop
          );
      }
  };

    setTimeout(() => task());
    //切换语言不选中
    const pushState = window.history.pushState;
    window.history.pushState = (...args) => {
        pushState(args);
        task();
    };
};

(function () {
    "use strict";

    console.log("load .....");
    // mysql
    Load(
        () => ["dev.mysql.com"].includes(location.host),
        () => MysqlDocSelct("font-size:16px;color:#f29221;")
    );

    // *
    Load(
        () => true,
        () => BookSelect("font-size:18px;color:#f29221;")
    );

    //mdn
    Load(
        () => location.host == "developer.mozilla.org",
        () => MDnDocSelect()
    );
})();
