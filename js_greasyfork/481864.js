// ==UserScript==
// @name         bili_optimizer
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  1.自动展开视频简介 2.点击宽屏模式自动将播放器和页面下边沿对齐
// @author       Han Shuwang
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481864/bili_optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/481864/bili_optimizer.meta.js
// ==/UserScript==
// 添加WEBHOOK
(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
        // 获取播放器容器元素
        const playerContainer = document.getElementById('bilibili-player');

        // 获取目标按钮
        const targetButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide');

        if (playerContainer && targetButton) {
            targetButton.addEventListener('click', () => {
                // console.log("点击了宽屏模式");
                // 获取播放器容器的位置和尺寸
                let rect = playerContainer.getBoundingClientRect();

                // 获取浏览器窗口的高度
                let viewportHeight = window.innerHeight;

                // 检查播放器下边沿是否在浏览器下边沿之上
                if (rect.bottom > viewportHeight) {
                    // 计算需要滚动的偏移量
                    const offset = rect.bottom - viewportHeight;

                    // 使用 smooth 滚动到目标位置
                    window.scrollBy({
                        top: offset,
                        behavior: 'smooth'
                    });
                    console.log("已对齐");
                }
            });
        }
        unfold_discription();

    }, 4000);//延时4秒，可自己修改，单位ms

function unfold_discription(){
    var unfold_flag = 0;
    let desciption_unfold = document.getElementsByClassName('toggle-btn');
    if(desciption_unfold&&unfold_flag==0){
        if(desciption_unfold[0].textContent == '展开更多')
        {
            desciption_unfold[0].click();
            unfold_flag = 1;
            console.log("已展开");
        }
    }
}
})();

