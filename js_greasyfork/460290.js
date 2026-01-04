// ==UserScript==
// @name         比格设计去水印
// @description  设计工具比格设计去水印
// @namespace    https://greasyfork.org/zh-CN/users/869004
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bigesj.com/bill/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigesj.com
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460290/%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/460290/%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(`.water,.water-tip{display:none!important}`);


const toast = (content, time) => {
  return new Promise((resolve, reject) => {
    let elAlertMsg = document.querySelector("#fehelper_alertmsg");
    if (!elAlertMsg) {
      let elWrapper = document.createElement("div");
      elWrapper.innerHTML =
        '<div id="fehelper_alertmsg" style="position:fixed;top:100px;left:0;right:0;z-index:1000;display:flex">' +
        '<p style="background:#4caf50;display:inline-block;color:#fff;text-align:center;' +
        'padding:10px 10px;margin:0 auto;font-size:14px;border-radius:4px;">' +
        content +
        "</p></div>";
      elAlertMsg = elWrapper.childNodes[0];
      document.body.appendChild(elAlertMsg);
    } else {
      elAlertMsg.querySelector("p").innerHTML = content;
      elAlertMsg.style.display = "flex";
    }

    window.setTimeout(function () {
      elAlertMsg.style.display = "none";
      resolve && resolve();
    }, time || 1000);
  });
};

const headers = {
  Authorization: `Token ${localStorage.getItem("__token__")}`,
};

function requestDownload(id) {
  toast("已加入下载队列，请稍候。", 2000).then(() => {
    $.ajax({
      method: "GET",
      url: `/new/udesign/checkdownload/${id}`,
      headers,
      dataType: "json",
    }).then((res) => {
      if (res.code === 203) {
        requestDownload(id);
        return false;
      }
      window.open(res.data.url, "_blank");
    });
  });
}

setTimeout(() => {
  const container = document.querySelectorAll(".ant-space-item")[10];
  $(container)
    .css({ display: "flex" })
    .append(
      '<buttton id="tm-download" style="margin-left: 8px;align-items: center;display: flex;height: 48px;" class="ant-btn ant-btn-primary">无水印下载</button>'
    );
  $("#tm-download").on("click", () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const bid=urlParams.get('bid')
    $.ajax({
      method: "GET",
      url: `/new/udesign/downloadAsync/${bid}`,
      headers,
      dataType: "json",
      data: {
        width: parseInt($('.canvas-view-item').text()),
        height: parseInt($('.canvas-view-item:eq(1)').text()),
        id: bid,
        format: "png",
        watermark: 0,
        role_type: 3,
        preview_path: "/bill/output",
        fast_download: false,
      },
    }).then((res) => {
      console.log(res);
      requestDownload(res.data.uid);
    });
  });
}, 1000);




})()