// ==UserScript==
// @name         扇贝工具集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  扇贝工具集!
// @author       You
// @include      https://*.shanbay.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419109/%E6%89%87%E8%B4%9D%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/419109/%E6%89%87%E8%B4%9D%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('注入成功!');
    const tDom = document.getElementsByClassName('Layout_main__2_zw8')[0]
    if (tDom) {
        // 观察器的配置（需要观察什么变动）
        const config = { attributes: true, childList: true, subtree: true };
        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList, observer) {
            console.log('检测到dom发生改变');
            mutationsList.forEach(item => {
                if (item.type === 'childList') {
                    const progressBar1Dom = document.getElementsByClassName('index_progressBox__14Xo5')[0];
                    const progressBar2Dom = document.getElementsByClassName('index_progress__1aCBt')[0];
                    if (progressBar1Dom) {
                        progressBar1Dom.style.display = 'none'
                    }
                    if (progressBar2Dom) {
                        progressBar2Dom.style.display = 'none'
                    }
                }
            })
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 以上述配置开始观察目标节点
        observer.observe(tDom, config);
    }
})();