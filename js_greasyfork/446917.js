// ==UserScript==
// @name         强制所有链接在当前标签打开
// @namespace    https://greasyfork.org/zh-CN/scripts/446917-%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80
// @version      0.33
// @license MIT
// @description  强制所有链接在当前标签打开，本脚本采用白名单机制，需手动点击油猴脚本的菜单生效
// @grant unsafeWindow
// @author       meteora
// @match *://*/*
// @grant        GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/446917/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/446917/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
// ==UserScript==
// @name         强制所有链接在当前标签打开
// @namespace    https://greasyfork.org/zh-CN/scripts/446917-%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80
// @version      0.29
// @license MIT
// @description  强制所有链接在当前标签打开，本脚本采用白名单机制，需手动点击油猴脚本的菜单生效
// @grant unsafeWindow
// @author       meteora
// @match *://*/*
// @grant        GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/446917/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/446917/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 白名单管理
  function whiteList() {
    let domainEnable;
    let subDomainEnable;
    //一级域名，例如：baidu.com
    let currentDomain = location.hostname.split(".").slice(-2).join(".");
    //二级域名，例如 www.baidu.com
    let currentSubDomain = location.hostname;
    let domainList = GM_getValue("n2GndfLDBAh_domainList");
    let subDomainList = GM_getValue("n2GndfLDBAh_subDomainList");
    if (domainList) {
      domainList = JSON.parse(domainList);
      for (let i = 0; i < domainList.length; i++) {
        const item = domainList[i];
        if (item === currentDomain) {
          domainEnable = true;
          GM_registerMenuCommand("排除 " + currentDomain, () => {
            domainList.splice(i, 1);
            GM_setValue("n2GndfLDBAh_domainList", JSON.stringify(domainList));
            unsafeWindow.location.reload();
          });
          break;
        }
      }
    }
    if (!domainEnable) {
      GM_registerMenuCommand("添加 " + currentDomain, () => {
        if (!domainList) {
          domainList = [];
        }
        domainList.push(currentDomain);
        GM_setValue("n2GndfLDBAh_domainList", JSON.stringify(domainList));
        unsafeWindow.location.reload();
      });
    }
    if (subDomainList) {
      subDomainList = JSON.parse(subDomainList);
      for (let i = 0; i < subDomainList.length; i++) {
        const item = subDomainList[i];
        if (item === currentSubDomain) {
          subDomainEnable = true;
          GM_registerMenuCommand("排除 " + currentSubDomain, () => {
            subDomainList.splice(i, 1);
            GM_setValue(
              "n2GndfLDBAh_subDomainList",
              JSON.stringify(subDomainList),
            );
            unsafeWindow.location.reload();
          });
          break;
        }
      }
    }
    if (!subDomainEnable && currentSubDomain !== currentDomain) {
      GM_registerMenuCommand("添加 " + currentSubDomain, () => {
        if (!subDomainList) {
          subDomainList = [];
        }
        subDomainList.push(currentSubDomain);
        GM_setValue("n2GndfLDBAh_subDomainList", JSON.stringify(subDomainList));
        unsafeWindow.location.reload();
      });
    }
    return domainEnable || subDomainEnable;
  }
  // const listener = function (e) {
  //   let dom = e.target;
  //   if (dom.nodeName === "A") {
  //     dom.target = "_self";
  //     return;
  //   }
  //   //循环迭代获取父节点
  //   for (let i = 0; i < 5; i++) {
  //     dom = dom.parentNode;
  //     //如果是a标签
  //     if (dom.nodeName === "A") {
  //       dom.target = "_self";
  //       return;
  //     }
  //   }
  // };
  // document.body.addEventListener("click", listener, true);

  //hook页面
  function hookPage() {
    document.head.appendChild(document.createElement("base")).target = "_self";
    //替换form标签里面的target属性
    let domList = document.querySelectorAll("form");
    for (let i = 0; i < domList.length; i++) {
      domList[i].target = "_self";
    }
    //替换a标签里面的target属性
    domList = document.querySelectorAll("a");
    for (let i = 0; i < domList.length; i++) {
      domList[i].target = "_self";
    }
    //对于调用window.open跳转的
    const open = unsafeWindow.open;
    const newOpen = function (
      url = false,
      target = "_self",
      windowFeatures = false,
    ) {
      if (url && windowFeatures) {
        open(url, "_self", windowFeatures);
      } else if (url) {
        open(url, "_self");
      } else {
        open();
      }
    };
    Object.defineProperty(unsafeWindow, "open", {
      value: newOpen,
    });
  }

  function main() {
    //排除iframe
    if (window.self !== window.top) {
      return;
    }
    //白名单管理
    if (!whiteList()) return false;
    hookPage();
    // 监听页面url变化
    unsafeWindow.addEventListener("popstate", function (event) {
      console.log("URL changed to: " + document.location.href);
      hookPage();
    });
    unsafeWindow.addEventListener("hashchange", function () {
      console.log("URL changed to: " + document.location.href);
      hookPage();
    });
    //覆写 window.top.history.pushState 方法
    let originalPushState = unsafeWindow.top.history.pushState;
    unsafeWindow.top.history.pushState = function () {
      originalPushState.apply(this, arguments);
      hookPage();
    };
  }
  const oldOnloadFun = window.onload;
  unsafeWindow.onload = function () {
    if (oldOnloadFun) {
      oldOnloadFun();
    }
    main();
  };
})();
