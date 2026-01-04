// ==UserScript==
// @name         教师十x五跳过打卡ttcdw.cn
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  每隔一分钟模拟一次点击
// @author       6add
// @match        https://www.ttcdw.cn/p/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttcdw.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518414/%E6%95%99%E5%B8%88%E5%8D%81x%E4%BA%94%E8%B7%B3%E8%BF%87%E6%89%93%E5%8D%A1ttcdwcn.user.js
// @updateURL https://update.greasyfork.org/scripts/518414/%E6%95%99%E5%B8%88%E5%8D%81x%E4%BA%94%E8%B7%B3%E8%BF%87%E6%89%93%E5%8D%A1ttcdwcn.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function clickBtn() {
        //console.log("check")
        // 检查页面中是否存在id为layui-layer1的元素
        var layer = document.getElementById('layui-layer1');
        //console.log(layer)
        if (layer) {
        // 如果存在，查找id为comfirmClock的按钮元素
            var button = document.getElementById('comfirmClock');
            //console.log(button)
            if (button) {
            // 如果按钮存在，模拟点击事件
                button.click();
            }
        }
    }

    setInterval(clickBtn,1000*60)

})();