// ==UserScript==
// @name         百度首页定制：移除热搜并直达我的关注 (v1.3 - 模拟完整点击)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  访问百度首页时，自动删除热搜模块、特定菜单项，并模拟完整点击“我的关注”以显示内容
// @author       ai
// @match        https://www.baidu.com/
// @match        http://www.baidu.com/
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535450/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%AE%9A%E5%88%B6%EF%BC%9A%E7%A7%BB%E9%99%A4%E7%83%AD%E6%90%9C%E5%B9%B6%E7%9B%B4%E8%BE%BE%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%20%28v13%20-%20%E6%A8%A1%E6%8B%9F%E5%AE%8C%E6%95%B4%E7%82%B9%E5%87%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535450/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%AE%9A%E5%88%B6%EF%BC%9A%E7%A7%BB%E9%99%A4%E7%83%AD%E6%90%9C%E5%B9%B6%E7%9B%B4%E8%BE%BE%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%20%28v13%20-%20%E6%A8%A1%E6%8B%9F%E5%AE%8C%E6%95%B4%E7%82%B9%E5%87%BB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("百度首页定制脚本开始运行 (v1.3)...");

    // 目标元素选择器
    const hotSearchSelector = '#s-hotsearch-wrapper';
    const menuItem99Selector = 'span.s-menu-item[data-id="99"]'; // 通常是 "hao123"
    const myFollowMenuItemSelector = '#s_menu_mine'; // "我的关注" 的 ID
    const activeFollowClass = 'current'; // "我的关注" 激活时的 class

    function customizeBaidu() {
        // 1. 删除 <div id="s-hotsearch-wrapper">
        const hotSearchDiv = document.querySelector(hotSearchSelector);
        if (hotSearchDiv) {
            hotSearchDiv.remove();
            console.log("已删除热搜模块:", hotSearchSelector);
        } else {
            console.log("未找到热搜模块:", hotSearchSelector);
        }

        // 2. 删除 <span class="s-menu-item" data-id="99">
        const menuItem99 = document.querySelector(menuItem99Selector);
        if (menuItem99) {
            menuItem99.remove();
            console.log("已删除菜单项:", menuItem99Selector);
        } else {
            console.log("未找到菜单项:", menuItem99Selector);
        }

        // 3. 模拟点击 <span id="s_menu_mine">
        const myFollowLink = document.querySelector(myFollowMenuItemSelector);
        if (myFollowLink) {
            // 增加延迟确保页面JS逻辑处理完毕
            // 即使是模拟完整事件，适当的延迟仍然有益
            setTimeout(() => {
                if (myFollowLink.offsetParent !== null) { // 检查元素是否可见
                    console.log("准备通过模拟完整事件点击“我的关注”...");

                    // 创建 MouseEvent 的参数对象
                    const eventInit = {
                        bubbles: true,    // 事件是否应该冒泡
                        cancelable: true, // 事件是否可以被取消
                        view: window      // 指定事件的 EventView
                        // 可以根据需要添加其他属性，如 clientX, clientY 等，但通常以上足够
                    };

                    // 模拟 mousedown 事件
                    const eventDown = new MouseEvent('mousedown', eventInit);
                    myFollowLink.dispatchEvent(eventDown);
                    console.log("已派发 mousedown 事件");

                    // 模拟 mouseup 事件
                    const eventUp = new MouseEvent('mouseup', eventInit);
                    myFollowLink.dispatchEvent(eventUp);
                    console.log("已派发 mouseup 事件");

                    // 模拟 click 事件 (虽然mousedown和mouseup通常会触发click，但显式派发更保险)
                    const eventClick = new MouseEvent('click', eventInit);
                    myFollowLink.dispatchEvent(eventClick);
                    console.log("已派发 click 事件");

                    console.log("已尝试通过模拟完整事件点击“我的关注”:", myFollowMenuItemSelector);

                    // 再次延迟后检查 "我的关注" 是否获得了 active class ('current')
                    setTimeout(() => {
                        if (myFollowLink.classList.contains(activeFollowClass)) {
                            console.log(`“我的关注”标签已激活 (包含 '${activeFollowClass}' class)。内容应已显示。`);
                        } else {
                            console.warn(`“我的关注”标签未激活 (未找到 '${activeFollowClass}' class)，内容可能未显示。当前类名:`, myFollowLink.className);
                            // 进一步调试信息：可以看看它旁边兄弟元素（比如“推荐”）的class是什么
                            const prevSibling = myFollowLink.previousElementSibling;
                            if (prevSibling) {
                                console.log("“我的关注”的上一个兄弟元素 class:", prevSibling.className);
                            }
                        }
                    }, 500); // 点击后稍等片刻检查状态 (500ms)

                } else {
                    console.log("“我的关注”链接在延迟后仍然不可见。");
                }
            }, 1000); // 延迟1秒后再尝试点击 (1000ms)
        } else {
            console.log("未找到“我的关注”链接:", myFollowMenuItemSelector);
        }
        console.log("百度首页定制脚本主要操作已提交。");
    }

    // 确保在DOM内容加载完成后执行，或者在整个页面加载完成后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        customizeBaidu();
    } else {
        // 使用 'load' 事件确保所有资源（包括可能影响JS行为的）都已加载
        window.addEventListener('load', customizeBaidu);
    }

})();