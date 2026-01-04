// ==UserScript==
// @name         Auto Video
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动刷网课
// @author       DT
// @match        ://180.101.236.114:8283/*
// @match        ://m.mynj.cn:11188/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489852/Auto%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/489852/Auto%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const movietargetElement = document.querySelector('.menuBody');

    function playplayer(){
        const playerzt = movietargetElement.querySelector('.vjs-control-bar');

        const bigbutton = movietargetElement.querySelector('button.vjs-big-play-button');

        if(bigbutton){
            if(bigbutton.getAttribute('aria-disabled')==='ture'){
                const vjsposter=document.querySelector('.vjs-poster')

                vjsposter.click();
            }
        }

        if (playerzt){
            const firstchild= playerzt.firstElementChild;
            if(firstchild.getAttribute('title')==='播放'||firstchild.getAttribute('title')==='Play')
            {
                // 模拟按下 Enter 键
                console.warn('暂停时点击了:');
                const vjsposter=document.querySelector('.vjs-poster')
                vjsposter.click();
            }
        }
        const Movie=document.querySelector('.vjs-poster');
        if(!Movie){
            console.warn('播放器没了:');
            handleElements();
        }

    }
    function handleElements() {
        console.warn('点击下一个:');
        const unfinishedElements = document.querySelectorAll('span.content-unstart');
        if (unfinishedElements.length > 0) {
            console.warn('这是未开始的:');
            const clickE=unfinishedElements[0].parentElement.querySelector('.append-plugin-tip');
            if(clickE){
                clickE.click();
            }
            const clickEE=unfinishedElements[0].parentElement;
            if(clickEE){
                clickEE.click();
            }

        } else {
            // 列表不存在的情况下执行的操作
            const unStarElements = document.querySelectorAll('span.content-learning');
            if (unStarElements.length > 0) {
                console.warn('这是未结束的:');
                var tdElement = document.getElementsByClassName('backClass2td')[0];
                // 在<td>元素中查找<a>元素
                var value = tdElement.innerText.trim();
                const biaoti=value
                const xiayige=unStarElements[0].parentElement.getAttribute(('title'))
                if(!biaoti.includes(xiayige)){
                    unStarElements[0]
                    unStarElements[0].click();
                    const clickunfinfish=unStarElements[0].parentElement;
                    if(clickunfinfish){
                        clickunfinfish.click();
                    }

                }
                else{
                    if(unStarElements[1]){
                        unStarElements[1].click();
                        const clickunfinfish=unStarElements[1].parentElement;
                        if(clickunfinfish){
                            clickunfinfish.click();
                        }

                    }

                }

            }
        }
    }

    setInterval(playplayer, 5000);
    //playplayer();
    // 监视新增的div元素
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查新增的节点是否为目标div元素
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('div.dialog-button.messager-button')) {
                        // 点击确定按钮
                        const confirmButton = node.querySelector('a[href="javascript:;"]');
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    }
                });
            }
        });
    });

    // 监视学习进度信息
    const progressObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查学习进度信息是否已完成
            const finishelement=targetElement.outerText;
            console.warn('当前进度:', finishelement);
            if(finishelement.includes('已完成'))
            {
                console.warn('准备点击下一个:', finishelement);
                handleElements();
            }

            //const progressElement = mutation.target.textContent;

            /*if (progressElement && progressElement === '已完成') {
                // 触发新的事件
                // TODO: 在这里添加你要触发的事件逻辑
                const unfinishedElements = document.querySelectorAll('span.content-unstart');
                if (unfinishedElements.length > 0) {
                    unfinishedElements[0].click();
                } else {
                    // 列表不存在的情况下执行的操作
                    const unStarElements = document.querySelectorAll('span.content-learning');
                    debugger;
                    if (unStarElements.length > 0) {
                        unStarElements[0].click();
                    }
                }
            }*/
        });
    });


    // 创建MutationObserver实例
    const movieobserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查是否有子节点删除
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                // 遍历删除的子节点
                mutation.removedNodes.forEach(removedNode => {
                    if (removedNode.nodeType === Node.ELEMENT_NODE) {
                        const divElement = removedNode.querySelector('.tcplayer.video-js.player-container-id-dimensions.tcp-skin.vjs-controls-enabled.vjs-workinghover.vjs-user-active.vjs-errors.vjs-playing.vjs-has-started');
                        if (divElement) {
                            // 找到了匹配的<div>元素
                            console.log('找到匹配的<div>元素:', divElement);
                            // 在这里执行你的操作...
                            handleElements()
                        }
                    }
                });
            }

        });
    });
    // 获取<span id="askTime">00:37:19</span>元素
    const askTimeElement = document.getElementById('askTime');
    // 获取时间文本
    const timeText = askTimeElement.textContent;
    // 将时间文本转换为秒数
    const timeParts = timeText.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // 设置定时器，在指定时间后执行内容
    setTimeout(() => {
        // 在这里执行你的内容
        handleElements();
        console.log('经过一段时间后执行的内容');
    }, totalSeconds * 1000);

    // 启动观察器
    const config = {
        attributes: true, // 监视属性的变化
        attributeFilter: ['class'], // 仅关注class属性的变化
        childList: true, // 监视子节点的添加或删除
        subtree: true // 观察整个文档树
    };

    movieobserver.observe(movietargetElement, config);

    observer.observe(document.documentElement, { childList: true, subtree: true });

    const targetElement = document.querySelector('td.learnpercent');
    progressObserver.observe(targetElement, { childList: true, subtree: true });
})();