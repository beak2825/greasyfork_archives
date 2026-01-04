// ==UserScript==
// @name         网易buff饰品比例计算
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网易buff饰品市场列表页显示余额比例
// @author       MarchWinds
// @match        *://buff.163.com/*
// @match        *://segmentfault.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @connect      steamcommunity.com
// @supportURL   https://steamcn.com/t331397-1-1
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @run-at      document-start
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436181/%E7%BD%91%E6%98%93buff%E9%A5%B0%E5%93%81%E6%AF%94%E4%BE%8B%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/436181/%E7%BD%91%E6%98%93buff%E9%A5%B0%E5%93%81%E6%AF%94%E4%BE%8B%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==
const $ = window.jQuery;
const ah = window.ah;
// const originFetch = fetch;
// console.log("unsafeWindow", unsafeWindow);
// console.log("window", window);
// Object.defineProperty(unsafeWindow, "fetch", {
//   configurable: true,
//   enumerable: true,
//   // writable: true,
//   get() {
//     return (url, options) => {
//       return originFetch(url, {
//         ...options
//       }).then(response => {
//         checkStatus(response)
//         response.json()
//       })
//     }
//   }
// })

// function checkStatus(response) {
//   console.log("---------fetch返回的值：", response);
//   return response;
// }
ah.proxy({
  //请求发起前进入
  onRequest: (config, handler) => {
    handler.next(config);
  },
  //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    console.log(err.type)
    handler.next(err)
  },
  //请求成功后进入
  onResponse: (response, handler) => {
    console.log("请求结束", response)
    let matchReg = /market\/goods\?/g
    if (matchReg.test(response.config.url)) {
      buffSellOrder(response.response);
    }
    handler.next(response)
  }
});

function buffSellOrder(res) {
  res = JSON.parse(res);
  let data = res && res.data;
  // 计算当前页面所有商品比例数组
  let saleRatioArr = [];
  if (!data || !data.items) {
    return;
  }
  saleRatioArr = data.items.map(item => {
    let price = item.sell_min_price;
    let steamPriceCNY = item['goods_info']['steam_price_cny'];
    let saleRatio = ( price/(steamPriceCNY / 1.15)).toFixed(2);
    return saleRatio;
  });
  let index = 0
  let timer = setInterval(() => {
    index++;
    let buffSellPriceDomList = $("strong.f_Strong");

    if (buffSellPriceDomList.length > 0) {
      clearInterval(timer);
      buffSellPriceDomList.each((index, item) => {
          let ratio = saleRatioArr[index];
        let ratioHtml = $(`<span style='position:absolute;top:10px;right:15px;color:${ratio>0.82?'green':ratio>0.8?'origin':'red'};'>${ratio}<sapn>`)[0]
        item && item.append(ratioHtml);
      })
    } else if (index > 500) {
      clearInterval(timer);
      alert("请刷新页面");
    }
  }, 100);
}
(function () {
  'use strict';

})();