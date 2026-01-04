// ==UserScript==
// @name         掘金 Plus
// @namespace    pionxzh
// @version      1.0.1
// @author       pionxzh
// @description  掘金Plus - 去广告 · 去弹窗 · 还你清爽的阅读体验
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAByFBMVEUAAAAegP8fgP8egf8eev8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP////9x6/jYAAAAlnRSTlMAAAAAAAZdWwUQhvTzhA8lq/ypJHH5C3PsBAJO2dghl2AqYZg7yBGIe/itJq96CGrozkMBRdDnaQwDaAfPN7ZwCfaUlnK3OGPeGP4Z8rww4+JeMr3xWt/aUjzHU9tYw+55IKSiHw3vwjYdn/qhCh6eHHfEOsbtdVDg4ddPL7qDhbkuF/cjrJMWbOnR0mtGKLD9JxKK9Ym9ME1eAAAAAWJLR0SX5m4brwAAAAd0SU1FB+UGEgMGHcgXPyMAAAHTSURBVDjLrVNpV1JRFH1bk55AISFPAVEQQXEgFTWQVDBDUsws5yErc8rU5tGZyjFNsvt7PfcBLizAtVqeD3fdu+9+5+6z3zmCcMkBioz3OYqrIjJ8nqtUqa9dT5cE0ORpGdPe0KVhAPl6RqHPT0uQCgoZKyyQUhAAgxECjKYis0neGM6TgOISC8kHrFa6gVhqK05mAGV2plY6YhjgKFcxe1kSA8YKJ8mv1HAMqKqmYpw1xuQUrpu1pL+u3g24Gxpp23TLhUR6j5dejcPNPp9MvU1UAQYPF9TS2uZHInGg/U4g8Rj8HXeDEDpDzFlyj/8kLo11dbGYXKDb5mShTqE8TGjPfbk4Sy938kGfXPDDR8TtVwriwCCBQ8NcCEbsjI3y+uAdGyc4NCEKyGp5TNvJJx5kA0+fTT3n6acrZgicnYvVPf9igbGFl/P8Rlrk69IUIfrlV3GvIL2eJP6b4JW4k2/f0fH9B+nMKXg/mgn6JHcTRMVnOnz5es5JrKyS5vBaLnXVuprq2tj8+3dutUfIobxvuu/kV+TH9j89AdfOLmXe26el9sCVoqfg/rnH5GhscKfsOeDw6Bc9U32cvq2jv09Uf6IZZocGR5GTebQuGL3/iVNGTHdSXGp/KgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xOFQwMzowNjoyOSswMDowMBW0AwoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMThUMDM6MDY6MjkrMDA6MDBk6bu2AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @match        https://juejin.cn/*
// @exclude      https://juejin.cn/oauth-result/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452385/%E6%8E%98%E9%87%91%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/452385/%E6%8E%98%E9%87%91%20Plus.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const e=document.createElement("style");e.textContent=n,document.head.append(e)})(` @charset "UTF-8";
.tablead,
.creator-item,
.vip-entry,
.special-activity,
.sidebar-bd-entry,
.app-download-sidebar-block,
.login-guide-popup,
.recommend-box,
button[title=\u5EFA\u8BAE\u53CD\u9988] {
  display: none !important;
}

body[data-juejin-page=main] .item-login-wrap,
body[data-juejin-page=main] .banner-block,
body[data-juejin-page=main] .sticky-block,
body[data-juejin-page=main] .entry-list > .item > .advertisement {
  display: none !important;
}

body[data-juejin-page=article] .wechat-banner,
body[data-juejin-page=article] .extension-banner,
body[data-juejin-page=article] .guide-collect-popover {
  display: none !important;
}

body[data-juejin-page=search] a.search[data-book-id] {
  display: none !important;
} `);

(function () {
  'use strict';

  function detectPage() {
    const url = new URL(window.location.href);
    let page = "main";
    if (url.pathname === "/post")
      page = "post";
    else if (url.pathname === "/search") {
      const type = url.searchParams.get("type") ?? "0";
      if (type === "12")
        page = "search-course";
      else
        page = "search";
    }
    document.body.setAttribute("data-juejin-page", page);
  }
  (() => {
    console.log(`[Juejin Plus] v${"1.0.1"}`);
    detectPage();
    window.addEventListener("popstate", () => {
      detectPage();
    });
  })();

})();