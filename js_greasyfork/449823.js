// ==UserScript==
// @name        自动切换详情页为 f 参数
// @namespace   Violentmonkey Scripts
// @match       https://growth.duolainc.com/growth-data-service/index.html*post*
// @match       https://growth.duolainc.com/#/admin/ad/post/*
// @match       https://growth.duolainc.com/#/create_ad*
// @match       https://growth.duolainc.com/growth-data-service/index.html#/create_ad*
// @match       https://growth.duolainc.com/#/edit_ad*
// @match       https://growth.duolainc.com/growth-data-service/index.html#/edit_ad/*
// @grant       none
// @version     1.3
// @author      -
// @description 240805，修复最新订单时间
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449823/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%BA%20f%20%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/449823/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%BA%20f%20%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

console.log('油猴脚本-切换f参数+添加最新订单时间');

var interval = setInterval(function() {
  ChangeTabTitleWithf();
}, 3000);

var currentURL = window.location.href;
var post = /post/;
var TimeCount = 0; // 尝试判断两次，改名两次

function ChangeTabTitleWithf() {
  currentURL = window.location.href; // 更新当前的 url
  console.log('尝试判断url');
  if (post.test(currentURL)) { // 确保是广告详情页
    for (var i = 0; i < document.getElementsByClassName("el-input__inner").length; i++) {
      if (document.getElementsByClassName("el-input__inner")[i].value.search("target_f=p") != -1) {
        var f_para = document.getElementsByClassName("el-input__inner")[i].value.replace(/target_f=/, "");
        document.title = f_para; // 完成改名工作
        console.log(TimeCount + "st:" + document.getElementsByClassName("el-input__inner")[i].value);

        // 尝试获取最新订单时间
        var latestOrderTimeElement = document.querySelector("#pane-orders > div > div > div > div > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr:nth-child(1) > td.el-table_5_column_38.is-center > div");
        if (latestOrderTimeElement) {
          document.querySelector("#tab-client").innerText = '最新订单时间：' + latestOrderTimeElement.innerText;
        }

        TimeCount++;
        if (TimeCount == 2) {
          clearInterval(interval);
          console.log("完成重命名工作");
        }
        break;
      }
    }
  }
}

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    console.log('页面加载完成');
    interval;
  }
}