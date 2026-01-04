// ==UserScript==
// @name         sally.txt重新排版
// @version      2024-02-20
// @description  none
// @author       You
// @match        https://www.yzyhq.cc/sally.txt
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yzyhq.cc
// @grant        none
// @namespace https://greasyfork.org/users/258372
// @downloadURL https://update.greasyfork.org/scripts/487831/sallytxt%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487831/sallytxt%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==



// 创建悬浮按钮元素
var button = document.createElement('button');
button.innerText = '一键排版';
button.style.position = 'fixed';
button.style.top = '100px';
button.style.right = '100px';
button.style.zIndex = '999';
button.style.padding = '5px 5px';
button.style.backgroundColor = 'red';
button.style.fontFamily = '微软雅黑';
button.style.fontWeight = 'bold';
button.style.fontSize = '28px';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

// 添加点击事件监听器
button.addEventListener('click', function() {
    chongxinpaibang();
});

// 将按钮添加到文档中
document.body.appendChild(button);



function chongxinpaibang() {
    // 获取body元素
    var body = document.querySelector('body');

    // 获取所有包含"||"的文本节点
    var textNodes = getTextNodes(body);

    // 遍历文本节点，进行回车换行
    textNodes.forEach(function(node) {
        if(node.nodeValue.includes("||")) {
            var lines = node.nodeValue.split("||"); // 按"||"分割文本
            var fragment = document.createDocumentFragment();

            // 创建每行文本的文本节点和换行节点
            lines.forEach(function(line, index) {
                fragment.appendChild(document.createTextNode(line));

                if(index < lines.length - 1) { // 最后一行不需要换行
                    fragment.appendChild(document.createElement('br'));
                }
            });

            // 替换原来的文本节点
            node.parentNode.replaceChild(fragment, node);
        }
    });

    // 获取所有文本节点的函数
    function getTextNodes(element) {
        var textNodes = [];

        function traverse(element) {
            if (element.nodeType === Node.TEXT_NODE) {
                textNodes.push(element);
            }

            if (element.nodeType === Node.ELEMENT_NODE) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    traverse(element.childNodes[i]);
                }
            }
        }

        traverse(element);
        return textNodes;
    }
}