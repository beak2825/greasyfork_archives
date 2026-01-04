// ==UserScript==
// @name         获取并复制指定百度网盘当前页面资源名字
// @namespace    http://tampermonkey.net/
// @version      1.5
// @match        *.pan.baidu.com/*
// @description  获取所有具有特定类名的a标签的title属性内容并复制到剪贴板
// @author       你的名字
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522678/%E8%8E%B7%E5%8F%96%E5%B9%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9A%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%B5%84%E6%BA%90%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/522678/%E8%8E%B7%E5%8F%96%E5%B9%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9A%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%B5%84%E6%BA%90%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮函数
    function createButton(text, top, right, backgroundColor, callback) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'absolute';
        button.style.top = top + 'px';
        button.style.right = right + 'px';
        button.style.zIndex = 9999;
        button.style.padding = '10px';
        button.style.backgroundColor = backgroundColor;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', callback);
        return button;
    }

    // 提取文件资源链接和标题的通用函数
    function extractTitlesAndLinks() {
        const parentElements = document.querySelectorAll('dd.g-clearfix.AuPKyz.open-enable.hqfKOlB');
        const titles = [];
        const links = new Set(); // 使用 Set 去重
        const matchedIds = []; // 用来保存匹配到的ID

        const idRegex = /(\d{6,})/;

        parentElements.forEach(parent => {
            const elements = parent.querySelectorAll('a.mivggPoZ'); // 获取每个指定父元素下的mivggPoZ

            elements.forEach(element => {
                if (element.title) {
                    const match = element.title.match(idRegex);
                    if (match) {
                        const result = `https://booth.pm/en/items/${match[1]}`;
                        titles.push(`${element.title} -> ${result}`);
                        links.add(result); // 添加到 Set 以去重
                        matchedIds.push(match[1]); // 保存匹配到的数字ID
                    }
                }
            });
        });

        return { titles, links, matchedIds }; // 返回包含匹配到的ID的结果
    }


    function extractAllTitlesAndLinks() {
        const elements = document.querySelectorAll('a.mivggPoZ'); // 直接查询所有a.mivggPoZ
        const titles = [];
        const links = new Set(); // 使用 Set 去重

        const idRegex = /(\d{6,})/;

        elements.forEach(element => {
            if (element.title) {
                const match = element.title.match(idRegex);
                const result = match ? `https://booth.pm/en/items/${match[1]}` : '无';
                titles.push(`${element.title} -> ${result}`);
                if (match) links.add(result); // 添加到 Set 以去重
            }
        });

        return { titles, links };
    }

    // 复制到剪贴板的函数
    function copyToClipboard(content) {
        const tempInput = document.createElement('textarea');
        tempInput.value = content; // 用换行符分隔
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // 按钮1：跳转所有Booth链接
    const button1 = createButton('跳转所有Booth链接', 10, 10, '#00a1d6', () => {
        const { titles, links } = extractAllTitlesAndLinks();

        if (titles.length === 0) {
            alert('未找到任何匹配的title内容！');
            return;
        }

        copyToClipboard(titles.join('\n')); // 复制结果到剪贴板
        //alert('已复制以下内容到剪贴板：\n' + titles.join('\n'));

        links.forEach(link => {
            window.open(link, '_blank'); // 逐个打开去重后的链接
        });
    });

    // 按钮2：跳转选定文件的Booth链接
    const button2 = createButton('跳转选定文件的Booth链接', 10, 140, '#ff5722', () => {
        const { titles, links } = extractTitlesAndLinks();

        if (titles.length === 0) {
            alert('未找到任何匹配的title内容！');
            return;
        }

        copyToClipboard(titles.join('\n')); // 复制结果到剪贴板
        //alert('已复制以下内容到剪贴板：\n' + titles.join('\n'));

        links.forEach(link => {
            window.open(link, '_blank'); // 逐个打开去重后的链接
        });
    });

    // 按钮3：获取bID链接
    const button3 = createButton('获取bID链接', 100, 10, '#ff5722', () => {
        const { links } = extractTitlesAndLinks();

        if (links.size === 0) {
            alert('未找到任何匹配的bID！');
            return;
        }

        copyToClipboard(Array.from(links).join('\n')); // 复制结果到剪贴板
        //alert('已复制以下内容到剪贴板：\n' + Array.from(links).join('\n'));
    });

    const button4 = createButton('获取bID', 150, 10, '#00a1d6', () => {
        const { matchedIds } = extractTitlesAndLinks();

        if (matchedIds.size === 0) {
            alert('未找到任何匹配的bID！');
            return;
        }

        copyToClipboard(Array.from(matchedIds).join('\n')); // 复制结果到剪贴板
        //alert('已复制以下内容到剪贴板：\n' + Array.from(matchedIds).join('\n'));
    });

    // 添加按钮到页面
    document.body.appendChild(button1);
    document.body.appendChild(button2);
    document.body.appendChild(button3);
    document.body.appendChild(button4);
})();
