// ==UserScript==
// @name         哔哩哔哩视频背景变白,按减号关灯模式,G键切宽屏/网页全屏,播放列表拉长变宽
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  按0旁边的减号
// @author       cjm
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462902/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%83%8C%E6%99%AF%E5%8F%98%E7%99%BD%2C%E6%8C%89%E5%87%8F%E5%8F%B7%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F%2CG%E9%94%AE%E5%88%87%E5%AE%BD%E5%B1%8F%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%2C%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E6%8B%89%E9%95%BF%E5%8F%98%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/462902/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%83%8C%E6%99%AF%E5%8F%98%E7%99%BD%2C%E6%8C%89%E5%87%8F%E5%8F%B7%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F%2CG%E9%94%AE%E5%88%87%E5%AE%BD%E5%B1%8F%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%2C%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E6%8B%89%E9%95%BF%E5%8F%98%E5%AE%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找并删除具有指定类名的元素
    function removeElementsByClassName(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    // 延迟执行删除元素的操作
    function removeElementsAfterDelay() {
        // 删除具有类名 "ad-report" 的元素
        removeElementsByClassName('ad-report');

        // 删除具有类名 "ad-floor-exp" 的元素
        removeElementsByClassName('ad-floor-exp');
    }

    // 延迟3秒后执行删除元素的操作
    setTimeout(removeElementsAfterDelay, 3000);



    function addCSS(cssText) {
        var style = document.createElement('style')
        , //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0];
        //获取head元素
        style.type = 'text/css';
        //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if (style.styleSheet) {
            //IE
            var func = function() {
                try {
                    //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                } catch (e) {}
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            } else {
                func();
            }
        } else {
            //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style);
        //把创建的style元素插入到head中
    }

    //视频背景变白
    false && addCSS(`
    #bilibili-player-placeholder-top,.bpx-player-video-area {background-color:white;}.111bpx-player-video-wrap{width:65%;}.ad-report.ad-floor-exp{display:none !important;}
    `)
    //播放列表拉长,变宽
    addCSS(`
    .video-sections-content-list,.multi-page-v1 .cur-list {  height: auto !important; max-height: initial !important; } .right-container,.video-episode-card__info-title{width:400px !important;}
    `)

    let currentStateIndex = 0; // 当前状态的索引
    const actions = [
        ()=>{document.querySelector('div[aria-label="宽屏"]')?.click();},
        ()=>{document.querySelector('div[aria-label="网页全屏"]')?.click()},
    ]; // 所有的状态

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 189/*减号*/||event.keyCode === 109/*小键盘减号*/) {
            document.querySelector('input[aria-label="关灯模式"]').click();
            // 删除具有类名 "ad-report" 的元素
            removeElementsByClassName('ad-report');
            // 删除具有类名 "ad-floor-exp" 的元素
            removeElementsByClassName('ad-floor-exp');
        }else if(event.keyCode === 71/*G*/){
            const currentAction = actions[currentStateIndex % actions.length]; // 获取当前状态
            currentAction();
            currentStateIndex++; // 切换到下一个状态
        }
    });


})();