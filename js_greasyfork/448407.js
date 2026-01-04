// ==UserScript==
// @name         获取网页TDK和标记链接
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  获取网页TDK和标记链接 :)
// @author       syczuan
// @include      *
// @grant        GM_addStyle
// @grant        window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448407/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5TDK%E5%92%8C%E6%A0%87%E8%AE%B0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/448407/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5TDK%E5%92%8C%E6%A0%87%E8%AE%B0%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
let showLinkMark = false;
let observer;
(function () {
  "use strict";
  let seoStyle = `
      .custom_seo_showbtn {
        padding: 0px;
        position: fixed;
        bottom: 100px;
        left: -120px;
        background: #ffffff;
        transition: 0.3s;
        z-index: 2147483647;
        border-right: 20px solid #2e7cee;
        box-sizing: border-box;
        box-shadow: 0 3px 6px 1px rgba(0, 21, 31, 0.28);
      }
      .custom_seo_showbtn div {
        width: 120px;
        display: block;
        color: #000000;
        border: none;
        background: transparent;
        font-size: 14px;
        line-height: 18px;
        cursor: pointer;
        background: #ffffff;
        padding: 10px 8px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .custom_seo_showbtn div:hover {
        background: #2e7cee;
        color: #ffffff;
      }
      .custom_seo_showbtn:hover {
        left: 0px;
        border-right: 3px solid #2e7cee;
      }
      .custom_seo_tdkinfo {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
      }
      .custom_seo_tdkinfo .custom_seo_tdkinfo_view {
        width: 50%;
        background: #ffffff;
        border-radius: 4px;
        padding: 0px 10px;
        box-sizing: border-box;
      }
      .custom_seo_tdkinfo_view .custom_seo_tdkinfo_head {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0px 10px;
        box-sizing: border-box;
      }
      .custom_seo_tdkinfo_head .custom_seo_tdkinfo_close {
        width: 30px;
        height: 30px;
        position: relative;
        cursor: pointer;
      }
      .custom_seo_tdkinfo_close::before,
      .custom_seo_tdkinfo_close::after {
        content: "";
        position: absolute;
        top: 14px;
        left: 3px;
        width: 80%;
        height: 2px;
        background-color: #000000;
      }
      .custom_seo_tdkinfo_close::before {
        transform: rotate(45deg);
      }
      .custom_seo_tdkinfo_close::after {
        transform: rotate(-45deg);
      }
      .custom_seo_tdkinfo_view .custom_seo_tdkinfo_list_box {
        width: 100%;
        overflow-y: auto;
        min-height: 240px;
        max-height: 500px;
        padding: 0px 10px;
        box-sizing: border-box;
      }
      .custom_seo_tdkinfo_list_box .custom_seo_tdkinfo_list {
        border-bottom: 1px solid #bcbcbc;
        padding: 10px 0px;
        margin-bottom: 10px;
      }
      .custom_seo_tdkinfo_list:last-child {
        border: none;
      }

      .custom_seo_tdkinfo_list .custom_seo_tdkinfo_list_key {
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 5px;
        word-break: break-word;
        color: #727272;
      }
      .custom_seo_tdkinfo_list .custom_seo_tdkinfo_list_value {
        font-size: 16px;
        line-height: 24px;
        color: #000000;
        word-break: break-word;
        position: relative;
      }

      a .custom_seo_link_mark {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: rgba(255, 255, 0, 0.6);
      }
    `;
  GM_addStyle(seoStyle);

  initLayout();

  if (window.onurlchange === null) {
    window.addEventListener("urlchange", () => {
      disconnectObserver();
      if (showLinkMark) {
        initMutationObserver();
      }
    });
  }
})();

function initLayout() {
  let showButton = document.createElement("div");
  let tdkButton = document.createElement("div");
  let linkButton = document.createElement("div");
  showButton.className = "custom_seo_showbtn";
  tdkButton.className = "custom_seo_tdk";
  linkButton.className = "custom_seo_link";

  tdkButton.innerText = "获取TDK";
  tdkButton.onclick = () => {
    showTDKInfo(false);
  };

  linkButton.innerText = "显示链接标记";
  linkButton.onclick = () => {
    showTDKInfo(true);
    if (showLinkMark) {
      linkButton.innerText = "显示链接标记";
      markLink(true);
    } else {
      linkButton.innerText = "隐藏链接标记";
      markLink(false);
    }
  };
  showButton.append(tdkButton);
  showButton.append(linkButton);
  document.body.append(showButton);
}

function getTDKData() {
  let meta = document.getElementsByTagName("meta");
  let title = document.getElementsByTagName("title")[0];
  let arr = [
    {
      name: "title",
      content: title.innerText,
      code: title.outerHTML,
    },
  ];
  for (let i = 0; i < meta.length; i++) {
    let e = meta[i];
    if (e.name == "description" || e.name == "keywords") {
      arr.push({
        name: e.name,
        content: e.content,
        code: e.outerHTML,
      });
    }
    let a = e.outerHTML.split("property=");
    if (a[1]) {
      let b = a[1].split('"');
      arr.push({
        name: b[1],
        content: e.content,
        code: e.outerHTML,
      });
    }
  }
  return arr;
}

function showTDKInfo(hide) {
  console.clear();
  let customSeo = document.querySelector(".custom_seo_tdkinfo");
  if (customSeo) {
    customSeo.remove();
  }
  if (hide) {
    return;
  }
  let tdkData = getTDKData();
  console.table(tdkData);
  createTdkInfo(tdkData);
}

function createTdkInfo(tdkData) {
  let listHtml = "";
  for (let i = 0; i < tdkData.length; i++) {
    listHtml += `
      <div class="custom_seo_tdkinfo_list">
        <div class="custom_seo_tdkinfo_list_key">${tdkData[i].name}</div>
        <div class="custom_seo_tdkinfo_list_value">${tdkData[i].content}</div>
      </div>
    `;
  }
  let tdkinfo = document.createElement("div");
  tdkinfo.className = "custom_seo_tdkinfo";
  tdkinfo.innerHTML = `
    <div class="custom_seo_tdkinfo_view">
      <div class="custom_seo_tdkinfo_head">
        <div class="custom_seo_tdkinfo_close"></div>
      </div>
      <div class="custom_seo_tdkinfo_list_box">${listHtml}</div>
    </div>
  `;
  document.body.append(tdkinfo);
  document.body.style.overflow = "hidden";

  let closeFunc = () => {
    let box = document.querySelector(".custom_seo_tdkinfo");
    box && box.remove();
    document.body.style.overflow = "";
  };
  let closeBtn = document.querySelector(".custom_seo_tdkinfo_close");
  let customSeo = document.querySelector(".custom_seo_tdkinfo");
  let customSeoTdkView = document.querySelector(".custom_seo_tdkinfo_view");

  closeBtn.onclick = closeFunc;
  customSeo.onclick = closeFunc;
  customSeoTdkView.onclick = (e) => {
    e.stopPropagation();
  };
}

function markLink(hide) {
  let linkList = document.getElementsByTagName("a");
  showLinkMark = !hide;

  for (let i = 0; i < linkList.length; i++) {
    const link = linkList[i];
    if (hide) {
      link.style.position = "";
    } else {
      link.style.position = "relative";
    }

    let oldLinkEl = link.querySelector(".custom_seo_link_mark");
    if (oldLinkEl) {
      oldLinkEl.remove();
    }
    if (showLinkMark) {
      let markMask = document.createElement("div");
      markMask.className = "custom_seo_link_mark";
      link.appendChild(markMask);
    }
  }
}

function initMutationObserver(time = 500) {
  let count = 0;
  // 创建防抖函数
  const debouncedMarkLinkChange = debounce(() => {
    observer.disconnect();
    let linkButton = document.createElement("div");
    // if (showLinkMark) {
    //   linkButton.innerText = "显示链接标记";
    //   markLink(false);
    // } else {
    //   linkButton.innerText = "隐藏链接标记";
    //   markLink(true);
    // }
    linkButton.innerText = "显示链接标记";
    markLink(false);
    count++;
    console.log("MarkLinkChange:" + count);
  }, time);

  observer = new MutationObserver(function () {
    // 使用已创建的防抖函数
    debouncedMarkLinkChange();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function disconnectObserver() {
  if (observer) {
    observer.disconnect();
  }
}

function debounce(func, delay) {
  let timeout;

  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
