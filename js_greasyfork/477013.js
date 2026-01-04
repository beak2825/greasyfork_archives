// ==UserScript==
// @name         data-testid-log
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  用于E2E提效
// @author       You
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=byted.org
// @grant        none
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/477013/data-testid-log.user.js
// @updateURL https://update.greasyfork.org/scripts/477013/data-testid-log.meta.js
// ==/UserScript==
let tree = {};
let counter = {};
let preEventTarget = undefined
function traverseDOM(element) {
    tree = {};
    counter = {};

    // 深度优先搜索子元素
    function DFS(node, tree) {
        // 检查元素是否有 data-testid 属性
        if (node.dataset && node.dataset.testid) {
            const testid = node.dataset.testid;

            // 计数器：统计各个 data-testid 的出现次数
            if (!counter[testid]) {
                counter[testid] = 0;
            }
            counter[testid]++;

            // 如果有，先初始化为一个空数组
            if (!tree[testid]) {
                tree[testid] = [];
            }

            // 遍历该元素的所有子元素
            Array.from(node.children).forEach((childNode) => {
                // 创建对象存储子元素的树结构
                let subtree = {};
                DFS(childNode, subtree);
                // 如果子树不为空，将其添加到 tree 的当前 testid 下
                if (Object.keys(subtree).length > 0) {
                    tree[testid].push(subtree);
                }
            });
        } else {
            // 如果元素没有 data-testid 属性, 遍历其所有子元素
            Array.from(node.children).forEach((childNode) => {
                DFS(childNode, tree);
            });
        }
    }

    DFS(element, tree);
    return { tree, counter };
}

function bindTestIdClickEvents() {
    $('[data-testid]').each((index, element) => {
        const jqueryElement = $(element);
        if (!jqueryElement.data('isClickedEventBound')){
            jqueryElement.on('click', buildClickHandler(jqueryElement));
            jqueryElement.data('isClickedEventBound', true);
        }
    });
}

function buildClickHandler(jqueryElement) {
    return function (event) {
        if(preEventTarget === event.target){
            return
        }
        printSelector(jqueryElement,event);
    };
}

function printSelector(jqueryElement,event) {
    const selector = [];
    let el = jqueryElement;
    while (el.length > 0 && el.prop('tagName').toLowerCase() !== 'body') {
        const testid = el.attr('data-testid');
        if (testid) {
            const selectorStr = `[data-testid="${testid}"]`
            selector.unshift(selectorStr);
            if (counter[testid] <= 1) {
                break;
            }
        }
        el = el.parent();
    }
    console.log(selector.join(' '));
    preEventTarget = event.target
}

(function () {
    'use strict';
    window.setInterval(() => {
        traverseDOM(document.body);
        bindTestIdClickEvents();
    }, 1000);
})();
