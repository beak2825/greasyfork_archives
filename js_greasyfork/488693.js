// ==UserScript==
// @name        添加/移除触发人可跳过
// @namespace   Violentmonkey Scripts
// @match       https://data.bytedance.net/dorado/settings/project/pipeline/edit
// @grant       none
// @version     1.0
// @author      -
// @description 2024/3/1 11:13:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488693/%E6%B7%BB%E5%8A%A0%E7%A7%BB%E9%99%A4%E8%A7%A6%E5%8F%91%E4%BA%BA%E5%8F%AF%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/488693/%E6%B7%BB%E5%8A%A0%E7%A7%BB%E9%99%A4%E8%A7%A6%E5%8F%91%E4%BA%BA%E5%8F%AF%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==


//自动点击流程
const tagAllCases = async(need_checked) => {
  //增加触发人跳过
  document.querySelectorAll('.arco-tabs-header-title')[5].click();
  await delay(200);
  document.querySelectorAll('.arco-radio')[ document.querySelectorAll('.arco-radio').length - 2 ].click();
  await delay(200);
  if(document.querySelectorAll('.arco-checkbox')[1].className.endsWith('checked') === need_checked){
    //取消
    document.querySelectorAll('.arco-btn')[ document.querySelectorAll('.arco-btn').length - 3 ].click()
  }else {
    //修改+确认
    document.querySelectorAll('.arco-checkbox')[1].click();
    await delay(200);
    document.querySelectorAll('.arco-btn')[ document.querySelectorAll('.arco-btn').length - 1 ].click()
  }
  await delay(500);
  //刷新页面
  //location.reload();
}

//等待X（毫秒）
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//为页面添加ctrl+A事件
window.onkeydown = function (event) {
  'use strict';
  //按ctrl+A 勾选触发人跳过
  if(event.ctrlKey && event.keyCode === 65){
    tagAllCases(true);
  }
  //按ctrl+A 取消勾选触发人跳过
  if(event.ctrlKey && event.keyCode === 83){
    tagAllCases(false);
  }
}