// ==UserScript==
// @name         BangumiLazyPreviewLinkForWiki
// @namespace    https://github.com/Adachi-Git/BangumiLazyPreviewLink
// @version      0.8
// @description  Lazy load links and show their titles
// @author       Jirehlov (Original Author), Adachi (Current Author)
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @downloadURL https://update.greasyfork.org/scripts/490175/BangumiLazyPreviewLinkForWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/490175/BangumiLazyPreviewLinkForWiki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化 localForage
    localforage.config({
        driver: localforage.INDEXEDDB, // 使用 IndexedDB 存储
        name: 'localforage', // 指定数据库名称
        version: 1.0, // 数据库版本
        storeName: 'keyvaluepairs' // 存储链接的对象存储空间名称
    });

    // 删除可视区域内的零宽空格字符
    function removeZeroWidthSpacesInView() {
        document.querySelectorAll('*').forEach(element => {
            const rect = element.getBoundingClientRect();
            // 检查元素是否在可视区域内
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                element.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = node.textContent.replace(/\u200B/g, ''); // 替换零宽空格字符
                    }
                });
            }
        });
    }

    // 替换链接文本为链接指向页面的标题
    async function replaceLinkText(link) {
        try {
            let linkURL = link.href;
            if (window.location.href.includes('bangumi.tv')) {
                linkURL = linkURL.replace('bgm.tv', 'bangumi.tv');
            } else if (window.location.href.includes('chii.in')) {
                linkURL = linkURL.replace(/bangumi\.tv|bgm\.tv/, 'chii.in');
            }

            if (link.textContent === link.href) {
                console.log(`Processing link: ${linkURL}`);
                const cachedTitle = await localforage.getItem(linkURL);
                console.log(`Cached title for ${linkURL}: ${cachedTitle}`);
                if (cachedTitle) {
                    link.textContent = cachedTitle + ',';
                } else {
                    console.log('Fetching data from network...');
                    const response = await fetch(linkURL);
                    const data = await response.text();
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(data, 'text/html');
                    const title = htmlDoc.querySelector('h1.nameSingle a');
                    let titleText = title ? title.textContent : '';
                    if (link.href.includes('subject') || link.href.includes('ep')) {
                        const chineseName = title ? title.getAttribute('title') : '';
                        if (chineseName) {
                            if (titleText) {
                                titleText += ' | ' + chineseName;
                            } else {
                                titleText = chineseName;
                            }
                        }
                    }
                    if (link.href.includes('ep')) {
                        const epTitle = htmlDoc.querySelector('h2.title');
                        if (epTitle) {
                            epTitle.querySelectorAll('small').forEach(small => small.remove());
                            const epTitleText = epTitle.textContent;
                            if (epTitleText) {
                                if (titleText) {
                                    titleText += ' | ' + epTitleText;
                                } else {
                                    titleText = epTitleText;
                                }
                            }
                        }
                    }
                    if (titleText) {
                        link.textContent = titleText + ',';
                        console.log(`Title for ${linkURL} retrieved from network: ${titleText}`);
                        await localforage.setItem(linkURL, titleText);
                        console.log(`Cached title for ${linkURL}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error in replaceLinkText:', error);
        }
    }

    // 获取页面上的所有链接
    const allLinks = document.querySelectorAll('a[href^="https://bgm.tv/subject/"], a[href^="https://chii.in/subject/"], a[href^="https://bangumi.tv/subject/"], a[href^="https://bgm.tv/ep/"], a[href^="https://chii.in/ep/"], a[href^="https://bangumi.tv/ep/"], a[href^="https://bgm.tv/character/"], a[href^="https://chii.in/character/"], a[href^="https://bangumi.tv/character/"], a[href^="https://bgm.tv/person/"], a[href^="https://chii.in/person/"], a[href^="https://bangumi.tv/person/"]');

    // 懒加载链接的函数
    function lazyLoadLinks() {
        allLinks.forEach(link => {
            const rect = link.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                replaceLinkText(link);
            }
        });
    }

    // 在滚动事件中触发懒加载
    window.addEventListener('scroll', () => {
        // 当页面滚动停止一段时间后再执行懒加载
        clearTimeout(window.timer);
        window.timer = setTimeout(() => {
            lazyLoadLinks();
        }, 200); // 等待200毫秒
    });

    // 监听文本选中事件
    let selectionTimeout;
    document.addEventListener('selectionchange', () => {
        clearTimeout(selectionTimeout);
        selectionTimeout = setTimeout(() => {
            const selection = window.getSelection();
            let selectedText = selection.toString().trim();
            selectedText = selectedText.replace(/,$/, ''); // 去除选定文本末尾的逗号
            if (selectedText) {
                const selectedWords = selectedText.split(/,\s*/); // 使用逗号和可能的空格进行分词
                const selectedIDs = [];
                allLinks.forEach(link => {
                    const linkText = link.textContent.trim().replace(/,$/, ''); // 去除链接文本末尾的逗号
                    if (selectedWords.some(word => linkText.includes(word))) {
                        const id = link.href.match(/\d+/)[0];
                        selectedIDs.push(id);
                    }
                });
                if (selectedIDs.length > 0) {
                    showFloatingDiv(selectedIDs);
                }
            } else {
                hideFloatingDiv();
            }
        }, 500); // 等待500毫秒
    });

    // 创建浮动窗口元素
    const floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '50px';
    floatingDiv.style.left = '50px';
    floatingDiv.style.padding = '10px';
    floatingDiv.style.background = '#fff';
    floatingDiv.style.border = '1px solid #ccc';
    floatingDiv.style.borderRadius = '5px';
    floatingDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.display = 'none';
    document.body.appendChild(floatingDiv);

    // 显示浮动窗口
    function showFloatingDiv(ids) {
        floatingDiv.innerHTML = ''; // 清空浮动窗口内容
        const uniqueIDs = [...new Set(ids)]; // 使用 Set 来获取唯一的 ID
        uniqueIDs.forEach(id => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = id + ',';
            floatingDiv.appendChild(itemDiv);
        });
        floatingDiv.style.display = 'block';

        // 添加点击事件监听器
        floatingDiv.addEventListener('click', () => {
            copyAllToClipboard(uniqueIDs);
        });
    }

    // 复制全部文本到剪贴板，并隐藏浮动窗口
    function copyAllToClipboard(ids) {
        const clipboardText = ids.join(',');
        navigator.clipboard.writeText(clipboardText)
            .then(() => {
            console.log('Copied to clipboard:', clipboardText);
            hideFloatingDiv(); // 复制完成后隐藏悬浮框
        })
            .catch(err => console.error('Failed to copy to clipboard:', err));
    }

    // 隐藏浮动窗口
    function hideFloatingDiv() {
        floatingDiv.style.display = 'none';
    }

    // 页面加载完成时立即执行一次懒加载
    window.addEventListener('DOMContentLoaded', lazyLoadLinks);

    // 页面完全加载后再执行一次删除零宽空格字符
    window.addEventListener('load', removeZeroWidthSpacesInView);
})();