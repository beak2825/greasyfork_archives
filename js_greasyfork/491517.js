// ==UserScript==
// @name         Modao Menu Parser
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  modao menu parser
// @author       飞天小猪
// @match        http*://modao.cc/*
// @icon https://gongjux.com/files/3/4453uhm5937m/32/favicon.ico
// @grant        none
// @require https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491517/Modao%20Menu%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/491517/Modao%20Menu%20Parser.meta.js
// ==/UserScript==


// 判断modao版本
function parserVersion() {
    return location.href.includes('proto')
}

// 解析函数
function parser() {
    const res = parserVersion()
    !res && layer.load(2, {shade: [0.5, '#393D49']})
    // 1. 获取ul元素
    const liElArr = findUlElememt()
    // 2. 整理数据
    if (!liElArr) return res ? alert('解析失败！') :layer.msg('解析失败！')
    const nodeList = getNodeList(liElArr)
    const result = toContent(flattenTreeWithLevels(nodeList))
    // 3. 将整理好的数据复制到剪贴板
    copyTextToClipboard(result)
    !res && layer.closeAll('loading');
}
function findUlElememt() {
    const res = parserVersion()
    return res ? ($('ul').children().toArray() || undefined) : ($('ul[class*="iAsEgD"]').children().toArray() || undefined)
}
function getNodeList(li) {
    const arr = []
    li.forEach(i => {
        const temp = {}
        const children = Array.from(i.children)
        temp.name = children.find(j => j.className.includes('rn-list-item')).innerText
        const list = Array.from(children.find(j => j.className.includes('child-screens'))?.children || [])
        if (list.length) {
            temp.children = getNodeList(list)
        } else {
            temp.children = []
        }
        arr.push(temp)
    })
    return arr
}

function flattenTreeWithLevels(tree, levels = [], arr = []) {
    for (const node of tree) {
        const item = { ...levels };
        item[levels.length] = node.name;
        arr.push(item);
        if (node.children) {
            flattenTreeWithLevels(node.children, [...levels, node.name], arr);
        }
    }
    return arr;
}
function toContent(arr) {
    let str = ''
    const strArr = arr.map(i => {
        const itemArr = Object.values(i)
        return itemArr.join('\t')
    })
    str = strArr.join('\n')
    return str
}
async function copyTextToClipboard(text) {
    const res = parserVersion()
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            res ? alert('复制成功') :layer.msg('复制成功');
            return;
        } catch (err) {
            console.error('使用 Clipboard API 复制失败: ', err);
        }
    }

    // 如果 Clipboard API 不可用，尝试使用 execCommand 方法
    const textArea = document.createElement('textarea');
    document.body.appendChild(textArea);
    textArea.value = text;
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('使用 execCommand 复制成功');
        } else {
            console.log('使用 execCommand 复制失败');
        }
    } catch (err) {
        console.error('使用 execCommand 复制失败: ', err);
    } finally {
        document.body.removeChild(textArea);
    }
}
(function() {
    'use strict';

    function setButton() {
        // 创建一个新的button元素
        var button = document.createElement('button');
        button.textContent = '解析菜单'; // 设置按钮文字

        // 设置按钮的基本样式（包括固定定位与默认透明度）
        button.style.cssText = `
position: fixed; /* 或者 absolute，取决于您的布局需求 */
top: 88px; /* 举例位置，您可以自定义 */
right: 10px; /* 举例位置，您可以自定义 */
z-index: 999;
background-color: #007bff;
color: white;
padding: 6px 12px;
border: none;
border-radius: 5px;
cursor: pointer;
opacity: 0.3;
transition: opacity 0.3s ease;
`;


        // 添加鼠标悬浮时的透明度变化
        button.addEventListener('mouseover', function () {
            this.style.opacity = 1;
        });

        // 添加鼠标离开时的透明度变化
        button.addEventListener('mouseout', function () {
            this.style.opacity = 0.3;
        });
        button.addEventListener('click', parser)
        // 将按钮添加到文档中
        document.body.appendChild(button);
    }
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }
    async function init() {
        const res = parserVersion()
        if (res) {
            setButton()
        } else {
            $('head').append($('<link rel="stylesheet" href="https://www.layuicdn.com/layui/css/layui.css">')) // 名称：layui，版本：2.7.6，原始地址：https://www.layuicdn.com/#Layui
            if (typeof layer == 'undefined') {
                $('head').append('<script src="https://www.layuicdn.com/layer-v3.5.1/layer.js"></script>') // 名称：layer，版本：3.5.1，原始地址：https://www.layuicdn.com/#Layer
            }
            // 等待layer加载成功
            while (true) {
                const loadEl = document.getElementById('loading')
                const loadElStyle = loadEl && window.getComputedStyle(loadEl)
                if (typeof layer != 'undefined' && loadElStyle && loadElStyle.display === 'none') {
                    break
                }
                await sleep(0.5)
            }
            setButton()

        }
    }
    init()
})();