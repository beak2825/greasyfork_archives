// ==UserScript==
// @name         哔哩哔哩合集管理-置顶视频
// @namespace    http://tampermonkey.net/
// @version      2025-04-20
// @description  点击“正常显示”，会置顶该视频。
// @author       You
// @match        https://member.bilibili.com/platform/upload-manager/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533379/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%88%E9%9B%86%E7%AE%A1%E7%90%86-%E7%BD%AE%E9%A1%B6%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533379/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%88%E9%9B%86%E7%AE%A1%E7%90%86-%E7%BD%AE%E9%A1%B6%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let want_to_top = false;
    function clickElement(ele, selector) {
        ele.querySelector(selector).click();
    }

    function input_number(intput_ele, number) {
        intput_ele.value = number;
    }
    // 流程
    // 1. 手动点击“正常显示”，脚本点击“编辑”按钮
    // 2. 在排序输入框输入 1，点击 完成 按钮

    document.addEventListener('click', function(event) {
        // 检查点击的目标是否是特定的子元素
        if (event.target.matches('.ep-tag')) {
            // console.log('点击了.ep-tag');
            want_to_top = true;
            let ep_table_tr = null;
            let count = 5;
            let ele = event.target.parentNode;
            while (count-- > 0) {
                // console.log('父节点: ', ele);
                ele = ele.parentNode;
                if (ele.matches('.ep-table-tr')) {
                    ep_table_tr = ele;
                    break;
                }
            }
            if (ep_table_tr) {
                clickElement(ep_table_tr, '.ep-section-edit-video-list-item-operate-btn');
            } else {
                console.log('未找到.ep-table-tr');
            }
        }
    });

    const callback = (mutationRecordList) => {
        for (const mutationRecord of mutationRecordList) {
            for (const addedNode of mutationRecord.addedNodes) {
                // 使用该行观察新增的节点
                // console.log(addNode);
                if (addedNode.className === 'ep-modal') {
                    if (want_to_top) {
                        // 置顶
                        want_to_top = false;
                        const inputs = addedNode.querySelectorAll('input');
                        inputs[1].value = 1;
                        const event = new Event('input', { bubbles: true });
                        inputs[1].dispatchEvent(event);
                        setTimeout(() => {
                            clickElement(addedNode, '.ep-button-primary');
                        }, 100); // 等待 filter 网络请求完成，卡顿可适当增加，单位 ms
                    }
                    return;
                }
            }
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true, });

})();