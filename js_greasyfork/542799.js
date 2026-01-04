// ==UserScript==
// @name         gamekee 棕色尘埃2wiki免登陆查看live2d
// @namespace    http://tampermonkey.net/
// @version      2025-07-17
// @description  gamekee 棕色尘埃2wiki 网站  https://www.gamekee.com/zsca2 ，解决部分涩涩立绘需要登陆查看live2d 无需登录也可查看立绘
// @author       oOtroyOo
// @match         *://*.gamekee.com/zsca2/*
// @icon         https://www.gamekee.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542799/gamekee%20%E6%A3%95%E8%89%B2%E5%B0%98%E5%9F%832wiki%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8Blive2d.user.js
// @updateURL https://update.greasyfork.org/scripts/542799/gamekee%20%E6%A3%95%E8%89%B2%E5%B0%98%E5%9F%832wiki%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8Blive2d.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
  .blur-bg1 {
    filter: none !important;
  }

  .blur-bg2 {
    backdrop-filter: none !important;
    filter: none !important;
  }

    .limit-box {
   visibility:hidden
  }
`;
    document.head.appendChild(style);

    let live2d;
    let init;
    const init_new = function(){
        live2d.isLimitAge = false
        live2d.isOpenBlur = true
        init()
    }
    window.addEventListener('load', function() {

    });

    // 定义回调函数，处理节点变化
    const callback = function(mutationsList) {
        console.log(mutationsList)
        live2d = document.querySelector('.live2d').__vue__;

        if(live2d.init!=null && live2d.init!=init_new){

            init = live2d.init

            live2d.init=init_new

        }
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 处理 .change-live2d 元素
                const changeLive2dElements = document.querySelectorAll('.change-live2d');
                changeLive2dElements.forEach(element => {
                    element.style.cssText = '';
                });

                // 处理包含 blur-bg1 或 blur-bg2 类的元素
                //                 const blurBg1Elements = document.querySelectorAll('.blur-bg1');
                //                 blurBg1Elements.forEach(element => {
                //                     element.classList.remove('blur-bg1');
                //                 });

                //                 const blurBg2Elements = document.querySelectorAll('.blur-bg2');
                //                 blurBg2Elements.forEach(element => {
                //                     element.classList.remove('blur-bg2');
                //                 });


            }
        }
    };

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(callback);

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察 document 节点的变化
    observer.observe(document, config);



})();