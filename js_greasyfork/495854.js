// ==UserScript==
// @name         开源阅读web端快捷键
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  开源阅读web服务添加wasd快捷键支持，ws键滚动，ad键切换章节
// @author       coccvo
// @match        http://*/vue/index.html
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEX////29/fu7u7o5+ff39/W1tfnycXvyKzNzc7pu6XCwsLjppaop6eVlZWJiYl3d3dmZmZZWVlPT08qay0aAAABTklEQVR42pWQW47DIAxFwYaGJvi5/8VOzKRMafozR4oUwfG1TfoP0DoxU2+QvlFJ/UKp3qvZ/A3jj5Sm/oG29MZubmyqYu4qpmzmtr/Vm7sIGwu7G6l2NXebGRD5xCwsFKYyxY8rXAJ7CCTGTJEgTBqC87WfDUH6b6GSSJdxZjUFIYdASjwE407mMwLUA1Y3IXG3zuTCHijGCv6J+SRW7T4RY4slfNLHCBM1CUE8mEOwDW59BpxTAsgZAEvbO2t4Qv14btuGcXom5DwELKXU1lV3BNxOQgBchFpr21scP4NICAEWoeEQjuOYwtLiEo4gBAgB7gln/RBKTidDgCHMhAc+DowOQcZXi5nwQIDzqzkNMLotCRBgwXRRcJnhAmt6kQsuW4yQEg2mUcuSgDDvZ0b7mwEjPjZcgPP2SsBTxXQjh7Lv9aRATl8Z7wHr7Q+/8x1ulTnfVgAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495854/%E5%BC%80%E6%BA%90%E9%98%85%E8%AF%BBweb%E7%AB%AF%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/495854/%E5%BC%80%E6%BA%90%E9%98%85%E8%AF%BBweb%E7%AB%AF%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const SCROLL_FRACTION = 0.9; // 设置滚动距离为视口高度的百分比

    document.addEventListener('keydown', function(e) {
        // 定义一个数组包含需要处理的按键
        const keysToHandle = ['w', 's'];

        // 检查按键是否在需要处理的列表中
        if (keysToHandle.includes(e.key)) {
            // 计算滚动距离
            let distance = e.key === 's' ? window.innerHeight * SCROLL_FRACTION : -window.innerHeight * SCROLL_FRACTION;

            // 执行平滑滚动
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollBy({
                    top: distance,
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                window.scrollBy(0, distance);
            }
            // 阻止按键的默认行为，以允许脚本完全控制滚动（这将改变上下箭头的默认滚动行为）
            e.preventDefault();
        }
    }, false);

// 等待页面加载完成
window.addEventListener('load', function() {
    // 上次点击时间的标志位
    var lastClickTime = 0;
    // 设置冷却时间（以毫秒为单位）
    var cooldown = 600;

    document.addEventListener('keydown', function(event) {
        // 获取按键代码
        var keyCode = event.keyCode || event.which;

        // 查找包含特定图标的元素
        function findElementByIcon(icon) {
            var elements = document.querySelectorAll('div.tool-icon .iconfont');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].textContent.includes(icon)) {
                    return elements[i].parentElement; // 返回父元素以触发点击事件
                }
            }
            return null;
        }

        // 模拟点击 content 元素
        function clickContent() {
            var contentDiv = document.querySelector('.tool-bar');
            if (contentDiv) {
                contentDiv.click();
            }
        }

        // 获取当前时间
        var now = Date.now();

        // 检查是否按下了 'a' 键或 'd' 键，并且距离上次点击时间大于冷却时间
        if (keyCode === 65 && now - lastClickTime > cooldown) { // 'a' 键
            var prevChapter = findElementByIcon(''); // 使用特定图标
            if (prevChapter) {
                prevChapter.click();
                lastClickTime = now; // 更新上次点击时间
                 clickContent(); // 执行一次 content 点击
            }
        } else if (keyCode === 68 && now - lastClickTime > cooldown) { // 'd' 键
            var nextChapter = findElementByIcon(''); // 使用特定图标
            if (nextChapter) {
                nextChapter.click();
                lastClickTime = now; // 更新上次点击时间
                 clickContent(); // 执行一次 content 点击
            }
        }
    });
}, false);


})();