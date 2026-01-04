// ==UserScript==
// @name          B站 Vision OS 首页眼动追踪优化
// @namespace     https://space.bilibili.com/50001745
// @version       0.1.9
// @description  在 Vision OS 用B站时，眼动追踪很难有，本项目尝试做一下优化:消除 Vision OS 上B站首页需要二次点击才能打开视频。（需要进入设置关闭弹出式窗口拦截）
// @author       fwz233
// @match        *://*.bilibili.com/*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494489/B%E7%AB%99%20Vision%20OS%20%E9%A6%96%E9%A1%B5%E7%9C%BC%E5%8A%A8%E8%BF%BD%E8%B8%AA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494489/B%E7%AB%99%20Vision%20OS%20%E9%A6%96%E9%A1%B5%E7%9C%BC%E5%8A%A8%E8%BF%BD%E8%B8%AA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
'use strict';
// Your code here...

   // 假设我们要检查的URL字符串是 "example.com"
var urlToCheck = "https://www.bilibili.com/";

// 获取当前页面的URL
var currentUrl = window.location.href;

// 检查URL是否包含我们要查找的字符串
if (currentUrl!="https://www.bilibili.com/") {
    console.log("不是首页" + urlToCheck);


    // 这里可以执行你的逻辑
} else {
    console.log("是首页 " + urlToCheck);




     var links = document.getElementsByTagName('a');
    // 为每个链接添加mouseover事件监听器
    console.log(links.length);
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('mouseover', function() {
            console.log('link-' + this.href); // 弹出警告显示链接地址
            if(this.href.indexOf("BV")!=-1){
            //alert(this.href);
            window.open(this.href,"_blank");
            }
        });
    }

const dynamicUpdateObserver = new MutationObserver((recordList) => {
  recordList.forEach((record) => {
    record.addedNodes.forEach((addedNode) => {
      // 确保 addedNode 是一个 DOM 元素
      if (addedNode.nodeType === Node.ELEMENT_NODE) {
        const dynamicItem = addedNode;
        // 寻找所有的链接 (<a> 标签)
        const links = dynamicItem.querySelectorAll('a');
        links.forEach((link) => {
          link.addEventListener('mouseover', function() {
            console.log('鼠标悬停在链接上:', link.href);

            if(this.href.indexOf("BV")!=-1){
            //alert(this.href);
            window.open(this.href,"_blank");
            }
          });
        });
        console.log(dynamicItem.innerText + "--------------------" + dynamicItem.outerHTML);
      }
    });
  });
});
dynamicUpdateObserver.observe(document.querySelector(".container.is-version8"), {
  childList: true,
});

    // 执行其他逻辑
}
   

//这里不可以写代码
})();
