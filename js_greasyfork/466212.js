// ==UserScript==
// @name         for qiping
// @namespace    http://tampermonkey.net/ibean.love
// @version      0.2
// @license MIT
// @description  点击继续的插件
// @author       1542226831@qq.com
// @match        https://zhdj-cumtb-edu-cn-s.vpn.cumtb.edu.cn:8118/*
// @match        https://www.baidu.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/466212/for%20qiping.user.js
// @updateURL https://update.greasyfork.org/scripts/466212/for%20qiping.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count = 0
    GM_log("Hello World");


    // 选择弹窗元素
    //  let targetNode = document.getElementById('app');
    // let targetNode = document.getElementsByClassName('pageLayout Login');
      setTimeout(function() {
          GM_log("setTimeoutstart ");
          // 创建一个MutationObserver实例
          const observer = new MutationObserver(function(mutationsList, observer) {
              let targetNode = document.querySelectorAll('body > div.el-overlay.is-message-box > div > div > div.el-message-box__btns > button');
               console.log('弹窗未出现！' + targetNode[0]);
              if (targetNode.length != 0){
                      count++
                      console.log('弹窗出现了！' + count + targetNode[0]);
                      targetNode[0].click();
               }
          });
          // 配置观察选项
          const config = { childList: true, subtree: true };
          // 开始观察目标节点
          observer.observe(document.body, config);
      }, 10000);


})();
