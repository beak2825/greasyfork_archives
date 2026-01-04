// ==UserScript==
// @name           去除网页标题条数消息通知提醒
// @version        0.2
// @author         cooper1x
// @description    去除CSDN、知乎等网页标题消息通知提醒
// @match          *://blog.csdn.net/*
// @match          *://*.zhihu.com/*
// @run-at         document-end
// @namespace      https://greasyfork.org/zh-CN/scripts/452154
// @downloadURL https://update.greasyfork.org/scripts/452154/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9D%A1%E6%95%B0%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/452154/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9D%A1%E6%95%B0%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
 
window.onload = () => {
  let timer = setInterval(removeMessageNotification, 300);
  function removeMessageNotification() {
    const regRule = {
      common: /^\(.*\)\s*/,
    }
    let currentTitle = document.title
    if (regRule.common.test(currentTitle)) {
      document.title = currentTitle.replace(regRule.common,"")
    }else{
      clearInterval(timer)
    }
  }
}