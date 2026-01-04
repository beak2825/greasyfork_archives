// ==UserScript==
// @name         finviz quote assistant
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  insert a link go tradingview chart link
// @author       goodzhuwang
// @match        https://finviz.com/quote.ashx?t=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509175/finviz%20quote%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/509175/finviz%20quote%20assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ext_name = "finviz_quote_assistant";

  console.debug(`${ext_name} running`);

  let links = document.querySelectorAll(".fullview-links a");

  if (!links || !links.length) {
    console.debug(`没有找到链接`);
    return;
  }

  let exchange_symbol = "";

  links.forEach((e) => {
    let link = e.getAttribute("href");
    let m = link.match(/(\w+):(\w+)$/);
    if (m) {
      exchange_symbol = `${m[2]}%3A${m[1]}`;
    }
  });

  if (!exchange_symbol) {
    console.debug(`没有找到包含交易所和代码的链接`);
    return;
  }

  // 移除广告的逻辑
  let max_times = 10;
  let times = 0;
  let _interval = setInterval(function () {
    console.debug(`${ext_name}定时检测广告是否存在...`);

    // 达到最大次数，就算了。
    if (times >= max_times) {
      console.debug(`${ext_name}达到最大检测次数，算了`);
      if (_interval) {
        clearInterval(_interval);
        _interval = null;
      }
    }

    // 已经删除了广告，就结束了
    let ads_ids = [
      "IC_D_970x91_1",
      "IC_D_728x90_1",
      "IC_D_3x6_1",
      "IC_D_3x3_1",
    ];

    let found_and_remove_ads_flag = false;

    ads_ids.forEach((id, i) => {
      let ads = document.getElementById(`${id}`);
      if (i == ads_ids.length - 1 && ads) {
        found_and_remove_ads_flag = true;
      }
      if (ads) {
        ads.remove();
      }
    });

    if (found_and_remove_ads_flag) {
      console.debug(`${ext_name}成功清除广告`);
      if (_interval) {
        clearInterval(_interval);
        _interval = null;
      }
    }

    // 在特定的的位置插入一个a
    const domElement = document.querySelector(".js-quote-navigation-root div");
    if (!domElement) {
      console.debug(`没有找到插入位置`);
    } else {
      let tradingview_link = `https://cn.tradingview.com/chart/700qUKjc/?symbol=${exchange_symbol}`;
      let tvlink = document.querySelector("._FQA_tradingview-link");
      if (!tvlink) {
        const aTag = document.createElement("a");
        aTag.href = tradingview_link;
        aTag.textContent = "TradingView Chart";
        aTag.classList.add("tab-link");
        aTag.classList.add("_FQA_tradingview-link");

        aTag.target = "_blank";
        aTag.style.marginRight = "10px";
        domElement.insertBefore(aTag, domElement.firstChild);
      }
    }

    times++;
  }, 5000);
})();
