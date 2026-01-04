// ==UserScript==
// @name         巴哈姆特動畫瘋自動播放
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  自动同意動畫瘋的年龄协议并在视频结束后自动播放下一集
// @author       luosansui
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484045/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/484045/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

'use strict';
(async function() {

    const videoJSElement = await waitForElement('.video-js')
    const videoElement = videoJSElement.querySelector('video');

    observeLoading(videoJSElement, async ()=>{
        const agreeButton = await waitForElement('#adult');
        agreeButton.click();
        console.log('已同意年龄限制');
    })

    // 等待视频结束
    videoElement.addEventListener('ended', async () => {
        const nextButton = await waitForElement('.vjs-next-button');
        nextButton.click();
        console.log("已自动播放下一集");
    });

})();


function waitForElement(selector, timeout = 30){
  return new Promise((resolve, reject) => {

     // 立刻检查, 如果元素存在就不启用定时器
     const element = document.querySelector(selector);
     if (element) {
         resolve(element);
         return
     }

    const interval = 50; // 检查间隔

    const checkExist = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkExist);
        resolve(element);
      }
    }, interval);

    // 设置超时
    setTimeout(() => {
      clearInterval(checkExist);
      reject(new Error(`Element not found: ${selector}`));
    }, timeout * 1000);
  });
};


function observeLoading(targetNode , callback) {

    const callFunc = ()=>{
        // 调用回调函数
        callback();
    }

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && Array.from(mutation.addedNodes).find(e=>e.tagName === 'DIV' && Array.from(e.classList).includes('R18'))) {
                callFunc()
            }
        });
    });

    // 配置观察选项
    const config = {
        attributes: false, // 观察属性变化
        childList: true, // 不观察子节点变化
        subtree: false // 不观察子树变化
    };


    // 开始观察
    observer.observe(targetNode, config);
}
