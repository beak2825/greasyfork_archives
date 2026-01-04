// ==UserScript==
// @name         掘金复制功能防篡改
// @namespace 	 czzonet
// @version      1.0.7
// @description  回归单纯的复制
// @author       czzonet
// @include      *://juejin.im/*
// @exclude      *://*.eggvod.cn/*
// @connect      juejin.im
// @license      MIT License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/416176/%E6%8E%98%E9%87%91%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD%E9%98%B2%E7%AF%A1%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/416176/%E6%8E%98%E9%87%91%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD%E9%98%B2%E7%AF%A1%E6%94%B9.meta.js
// ==/UserScript==

/** 执行 */
addEventLoad(clipboardGuard);

/**
 * 附加一层函数包裹，打包新旧处理函数到window.onload一起执行
 * @param {*} func
 */
function addEventLoad(func) {
  const oldOnload = window.onload;
  if (typeof window.onload != "function") {
    window.onload = func;
  } else {
    window.onload = function () {
      oldOnload();
      func();
    };
  }
}

/**
 * dom元素的复制处理
 */
function clipboardGuard() {
  console.log("Call clipboardGuard.");
  /** 选出对应dom元素 */
  let con = document.querySelector(
    "#juejin > div.view-container > main > div.view.column-view"
  );
  if (!con) {
    console.log("[clipboardGuard] Dom target not found.");
    return;
  }

  setTimeout(() => {
    /** 覆盖copy事件 */
    con.addEventListener("copy", copyOverride);
  }, 1000);
}

/**
 * 覆盖copy行为，直接复制选中文字
 * @param {*} event
 */
function copyOverride(event) {
  event.preventDefault();
  event.stopPropagation();
  /** 读取选中文字 */
  const selectedData = window.getSelection(0).toString();
  /** 读取选中html */
  const node = document.createElement("div");
  node.appendChild(window.getSelection().getRangeAt(0).cloneContents());

  /** 直接写入剪贴板 判断兼容IE */
  if (event.clipboardData) {
    /** 两种格式都进行覆盖 */
    event.clipboardData.setData("text/plain", selectedData);
    event.clipboardData.setData("text/html", node.innerHTML);
  } else {
    window.clipboardData.setData("text", selectedData);
  }
}
