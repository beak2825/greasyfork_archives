// ==UserScript==
// @name         关闭抖音更多作品二维码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音关闭二维码
// @author       You
// @match        https://www.douyin.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462986/%E5%85%B3%E9%97%AD%E6%8A%96%E9%9F%B3%E6%9B%B4%E5%A4%9A%E4%BD%9C%E5%93%81%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/462986/%E5%85%B3%E9%97%AD%E6%8A%96%E9%9F%B3%E6%9B%B4%E5%A4%9A%E4%BD%9C%E5%93%81%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择要监视的节点
    const targetNode = document.querySelector('body');

    // 配置 Mutation Observer
    const observerOptions = { attributes: true };

    // 回调函数
    const observerCallback = function(mutationsList, observer) {

        let trg=function(){

            // 点击头像时,关闭二维码
            let close = document.querySelector('.related-video-card-login-guide__footer-close');
            if(!!close){
                close.click()
            }

            // 出现异常,这点击返回
            let err = document.querySelector('.WqAiN5_C.SfAaypl3');
            if(!!err){
                document.querySelector('.ArbenARZ.LRb_a2W3.ZG4qVNxS').click();
            }
        };
        setTimeout(trg,200);
        setTimeout(trg,500);
        setTimeout(trg,1000);

    };

    // 创建 Mutation Observer
    const observer = new MutationObserver(observerCallback);

    // 开始监听
    observer.observe(targetNode, observerOptions);

})();