// ==UserScript==
// @name         南+图片信息 统计/计数 链接 图床域名
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  不计表情图，并列出图片域名
// @author       vvei
// @match        https://www.south-plus.net/read.php?tid*
// @match        https://south-plus.net/read.php?tid*
// @icon         http://south-plus.net/favicon.ico
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/543627/%E5%8D%97%2B%E5%9B%BE%E7%89%87%E4%BF%A1%E6%81%AF%20%E7%BB%9F%E8%AE%A1%E8%AE%A1%E6%95%B0%20%E9%93%BE%E6%8E%A5%20%E5%9B%BE%E5%BA%8A%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/543627/%E5%8D%97%2B%E5%9B%BE%E7%89%87%E4%BF%A1%E6%81%AF%20%E7%BB%9F%E8%AE%A1%E8%AE%A1%E6%95%B0%20%E9%93%BE%E6%8E%A5%20%E5%9B%BE%E5%BA%8A%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 添加CSS样式
    $('<style>').text(`
        #统计, #图床 {
            position: fixed;
            top: 90px;
            padding: 0.5em;
            background-color: #FFFD;
            z-index: 1000;
        }
        #countSpan {
            font-size: 2em;
            font-weight: bold;
        }
        #图床 {
            right: 0;
            ul{
                padding: 0;
                li {
                    margin: 5px 0;
                    list-style: none;
                }
            }
            button {
                display: inline;       /* 使其表现得像一个行内元素*/
                padding: unset;        /* 移除内边距*/
                border: unset;         /* 移除边框*/
                background-color: unset; /* 背景透明*/
                cursor: unset;         /* 默认鼠标指针样式*/
                color: inherit;        /* 继承文本颜色*/
                font: inherit;         /* 继承字体*/
                text-align: inherit;   /* 继承文本对齐方式*/
                line-height: inherit;  /* 继承行高*/
                white-space: inherit;  /* 继承空白处理方式*/
                letter-spacing: unset; /* 继承字母间距*/
                word-spacing: unset;   /* 继承单词间距*/
                text-transform: none;  /* 移除文本转换*/
                overflow: unset;       /* 设置溢出为可见*/
                box-sizing: inherit;   /* 继承盒模型大小计算方式*/
                margin: unset;         /* 移除外边距*/
                outline: unset;        /* 移除外轮廓*/
                &:not(:last-child):after {
                    content: '.';
                }
            }
        }
    `).appendTo('head');
    // 统计满足条件的img元素
    const images = document.querySelectorAll('img[loading="lazy"][onclick]');
    const count = images.length;
    // 创建一个div元素并添加到body中
    const countDiv = $('<div>')
        .attr('id', '统计')
        .append(
            $('<span>').text('图片'),
            $('<span>').attr('id', 'countSpan').text(count),
            $('<span>').text('张')
        );
    $('body').append(countDiv);
    // 创建图床div元素
    const galleryDiv = $('<div>')
        .attr('id', '图床');
    const galleryListP = $('<p>').text('图床列表：');
    galleryDiv.append(galleryListP);
    const ul = $('<ul>');
    // 去重后的完全限定域名
    const FQDNSet = new Set();
    images.forEach(img => {
        const url = new URL(img.src);
        FQDNSet.add(url.hostname);
    });
    // 将Set转换为Array并遍历
    Array.from(FQDNSet).forEach(FQDN => {
        const li = $('<li>');
        // 分割域名以便分级，并反转顺序方便调用
        const labels = FQDN.split('.').reverse()
        let hostName = '' // 重新初始化hostName
        labels.forEach((l, index) => {
            if (labels.length > 2 && labels[0].length === 2 && ['com', 'net', 'org', 'edu'].includes(labels[1])) {
                index === 2 && (l = hostName = [labels[2], labels[1], labels[0]].join('.'),createButton(hostName))
                index > 2 && (hostName = `${l}.${hostName}`,createButton(hostName))
            } else if (labels.length > 1) {
                index === 1 && (l = hostName = [labels[1], labels[0]].join('.'),createButton(hostName))
                index > 1 && (hostName = `${l}.${hostName}`,createButton(hostName))
            } else {
                li.append(`<span style="color: red;">只有根域名！</span>`)
            }			
            function createButton(hostName) {
                try {
                    const button = $('<button>', {type: 'button'});
                    button
                        .text(l)
                        .on('click', function () {
                            GM_setClipboard(hostName, 'text');
                            alert(`已复制域名: ${hostName}`);
                        });
                    li.prepend(button);
                } catch (error) {
                    console.error(`创建按钮时出错: ${error}`);
                    li.html(`<span style="color: red;">创建按钮时出错: ${error}</span>`); // 替换li的内容
                    return; // 退出 forEach((l, index) => {...}) 循环
                }
            };
        });
        ul.append(li);
    });
    // 将无序列表添加到galleryDiv中
    galleryDiv.append(ul);
    // 将图床div添加到body中
    $('body').append(galleryDiv);
})();