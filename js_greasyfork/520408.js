// ==UserScript==
// @name        隐藏标题栏
// @namespace   Violentmonkey Scripts
// @match       https://pychina.org/*
// @match       https://*.pychina.org/*
// @match       https://realpython.com/*
// @match       https://*.realpython.com/*
// @match       https://v2ex.com/*
// @match       https://*.v2ex.com/*
// @match       https://pycoders.com/*
// @match       https://*.pycoders.com/*
// @match       https://airflow.apache.org/*
// @match       https://*.airflow.apache.org/*
// @match       https://zhihu.com/*
// @match       https://*.zhihu.com/*
// @match       https://ddys.pro/*
// @grant       none
// @version     1.2
// @author      cichine
// @license     GPL3
// @run-at      document-start
// @description 隐藏网站的标题栏
// @downloadURL https://update.greasyfork.org/scripts/520408/%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/520408/%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==

(() => {
    const host = window.location.host;
    // const url = window.location.href;
    // const protocol = window.location.protocol;
    // const port = window.location.port;
    // const path = window.location.pathname;
    // const search = window.location.search;

    const styleMap = {
        "pychina.org": `
        /* 清除顶栏固定 */
        .navbar-fixed-top {
          top: unset;
          z-index: unset;
          position: unset;
        }
        body{
          padding-top: unset;
        }
    `,
        "realpython.com": `
        /* 清除顶栏固定 */
        .fixed-top {
          position: unset;
        }
        /* 隐藏右下角Help */
        #beacon-container {
          display: none;
        }
    `,
        "v2ex.com": `
        /* 隐藏背景 */
        #Wrapper {
          background-color: #fff !important;
          background-image: unset !important;
        }
        /* 隐藏头像 */
        .avatar {
          display: none;
        }`,
        "pycoders.com": `
        .bg-brand-gradient {
          background-image: unset !important;
        }
    `,
        "airflow.apache.org": `
        .navbar {
          position: unset;
          padding: unset;
        }
        .base-layout--button {
          display: none;
        }
        .base-layout {
          padding: unset;
        }
        .roadmap .td-sidebar {
          top: unset;
        }
    `,
        "zhihu.com": `
        .Sticky.is-fixed {
          position: unset;
        }
    `,
        "ddys.pro": `
        body {
          background-color: unset;
        }
        .hthb-notification {
          display: none;
        }
        .pagination a, .pagination span {
          background-color: unset;
          border: unset;
          color: unset;
        }
    `,
    };

    // 查找匹配的域名样式
    let s = "";
    for (const domain in styleMap) {
        if (host.endsWith(domain)) {
            s = styleMap[domain];
            break;
        }
    }
    console.log(`host: ${host}, style: ${s}`);

    const style = document.createElement("style");
    style.innerHTML = s;
    document.head.appendChild(style);
})();

