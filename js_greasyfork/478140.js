// ==UserScript==
// @name         map-making 按键脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在制作geoguessr地图时，我们可以为map-making增加按键快捷功能，按1即可加入标签，2可加入二号标签，按空格可保存标签，按r键可以删除标签，按q键可以旋转地图180度
// @author       yukejun
// @match        https://map-making.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478140/map-making%20%E6%8C%89%E9%94%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478140/map-making%20%E6%8C%89%E9%94%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function simulateMouseEvents(element, eventName, coord) {
        let event = new MouseEvent(eventName, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: coord.x,
            clientY: coord.y
        });
        element.dispatchEvent(event);
    }

    function rotateView() {
        // 获取 Google 地图的元素
        let mapElem = document.querySelector('.mapsConsumerUiSceneInternalCoreScene__root');

        if (!mapElem) return;

        let rect = mapElem.getBoundingClientRect();
        let centerX = rect.left + rect.width / 2;
        let centerY = rect.top + rect.height / 2;

        // 模拟鼠标按下事件
        simulateMouseEvents(mapElem, "mousedown", {x: centerX, y: centerY});

        // 模拟拖拽效果
        let steps = 5;
        let distancePerStep = 220;

        function simulateStep(i) {
            if (i < steps) {
                simulateMouseEvents(mapElem, "mousemove", {x: centerX + i * distancePerStep, y: centerY});
                setTimeout(() => simulateStep(i + 1), 10);  // 添加10毫秒的延迟
            } else {
                // 模拟鼠标释放事件
                simulateMouseEvents(mapElem, "mouseup", {x: centerX + steps * distancePerStep, y: centerY});
            }
        }

        simulateStep(0);
    }
    // 提取 -item- 后面的数字
    function extractItemNumber(elementId) {
        const match = /-item-(\d+)$/.exec(elementId);
        return match ? parseInt(match[1], 10) : -1;
    }

    // 尝试点击数字最大的选择器
    function clickLargestItemNumber() {
        // 获取所有匹配 '[id^="downshift-"][id*="-item-"]' 选择器的元素
        let elems = Array.from(document.querySelectorAll('[id^="downshift-"][id*="-item-"]'));
        if (!elems.length) return;

        // 从这些元素中找到 id 后缀数字最大的元素
        elems.sort((a, b) => extractItemNumber(b.id) - extractItemNumber(a.id));
        const largestElem = elems[0];

        // 点击该元素
        largestElem.click();
    }

        // 尝试点击给定选择器
    function tryClicking(selector) {
        let elem = document.querySelector(selector);
        if (elem) {
            elem.click();
        }
    }

        // 定义选择器与按键的映射关系
    const SELECTORS = {
        '1': '[id^="downshift-"][id$="-item-0"]',
        '2': 'button[hidden] > font > font',  // 使用属性选择器，匹配以 "downshift-" 开头并以 "-item-1" 结尾的 id

        '4': '[id^="downshift-"][id$="-item-3"]',
         ' ': 'button.button.button--primary[type="button"]', // 按下空格键
         'e': 'button.tag__button.tag__button--delete[type="button"]', // 按下e键
        'r': 'button.button.button--destructive[type="button"]'  //按下删除
    };


    // 监听键盘事件
    document.addEventListener('keydown', event => {
        // 如果事件的目标是文本输入框或文本区域，则不执行任何操作
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // 如果按键对应于 SELECTORS 中的选择器，则尝试点击
        if (SELECTORS[event.key]) {
            tryClicking(SELECTORS[event.key]);
        }

        // 如果按键是 'q'，则尝试旋转视图
        if (event.key === 'q') {
            rotateView();
        }

        // 如果按键是 '3'，则尝试点击数字最大的选择器
        if (event.key === '3') {
            clickLargestItemNumber();
        }
    });

})();
