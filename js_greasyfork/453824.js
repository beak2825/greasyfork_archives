// ==UserScript==
// @name         山月记资源破解
// @namespace    https://greasyfork.org/zh-CN/scripts/453824-%E5%B1%B1%E6%9C%88%E8%AE%B0%E8%B5%84%E6%BA%90%E7%A0%B4%E8%A7%A3
// @version      1.1
// @description  破解山月记（https://www.syjshare.com/）付费网盘资源
// @author       clown(clownvay@gmail.com)
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match       *www.syjshare.com/res/*
// @run-at      document-end
// @license      GNU LGPLv3
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/453824/%E5%B1%B1%E6%9C%88%E8%AE%B0%E8%B5%84%E6%BA%90%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/453824/%E5%B1%B1%E6%9C%88%E8%AE%B0%E8%B5%84%E6%BA%90%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==
(async function () {
  "use strict";
  const requestPromise = (method, url, data) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: method,
        data,
        url,
        success: (res) => {
          return resolve(res);
        },
        error: (res) => {
          return reject(res);
        },
      });
    });
  };
  const resourceId = $("#rid").val();
  const postData = {
    payWay: "Alipay",
    rid: resourceId,
    type: "RES",
  };
  const createTradeApi = "https://www.syjshare.com/ajax-create-res-pay-trade";
  const {tid: tradeNo} = await requestPromise('post', createTradeApi, postData);
  const resApi = `https://www.syjshare.com/ajax-get-res-info-by-mytradeno/${tradeNo}`;
  const res = await requestPromise('get',resApi)
  const { resInfo, state } = JSON.parse(res);
  if (state === 1) {
    const { address, description='', filename='' } = resInfo;
    const ele = $("#payTitleTextDiv");
    const value = `<div>地址已白嫖<br><a href=${address}>${address}</a><br>${description}<br>${filename}</div>`;
    ele.html(value);
  }

})();