// ==UserScript==
// @name         收集表信息一键复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  此脚本通过添加按钮来增强使用，单击该按钮时，会自动触发对指定元素的点击。然后，它会从后续元素中提取数据，将这些数据格式化为 JSON，并将其复制到剪贴板。
// @author       饼干Biscuits
// @match        https://docs.qq.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/508440/%E6%94%B6%E9%9B%86%E8%A1%A8%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/508440/%E6%94%B6%E9%9B%86%E8%A1%A8%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // 定位要插入按钮的目标位置
        const target = document.querySelector('.titlebar_titlebar-pusher__2dcNp');
        if (target) {
            const triggerButton = document.createElement('div');
            triggerButton.textContent = '请单击这里喵~';
            triggerButton.style.position = 'relative';
            triggerButton.style.display = 'inline-block';
            triggerButton.style.marginRight = '10px';
            triggerButton.style.padding = '8px 16px';
            triggerButton.style.fontSize = '14px';
            triggerButton.style.background = '#0078D7';  // QQ文档的蓝色调
            triggerButton.style.color = 'white';
            triggerButton.style.border = 'none';
            triggerButton.style.borderRadius = '4px';
            triggerButton.style.cursor = 'pointer';

            // 创建二级菜单容器
            const dropdownMenu = document.createElement('div');
            dropdownMenu.style.display = 'none';
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.top = '100%';
            dropdownMenu.style.left = '0';
            dropdownMenu.style.background = '#fff';
            dropdownMenu.style.border = '1px solid #ccc';
            dropdownMenu.style.borderRadius = '4px';
            dropdownMenu.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            dropdownMenu.style.zIndex = '1000';

            triggerButton.appendChild(dropdownMenu);

            // 将按钮插入到指定位置
            target.parentNode.insertBefore(triggerButton, target);

            let allResults = []; // 用于存储所有提取的数据
            let groupedResults = []; // 用于存储分组后的数据

            triggerButton.addEventListener('click', function(event) {
                event.stopPropagation(); // 阻止事件冒泡
                // 如果已经生成了分组数据，则显示或隐藏二级菜单
                if (groupedResults.length > 1) {
                    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
                } else {
                    // 否则执行默认的点击逻辑
                    startDataExtraction();
                }
            });

            // 点击页面其他地方时，关闭二级菜单
            document.addEventListener('click', function(event) {
                if (!triggerButton.contains(event.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });

            async function startDataExtraction() {
                const statsItem = Array.from(document.querySelectorAll('.dui-tabs-bar-item.dui-tabs-bar-item-medium')).find(item => item.textContent.trim() === '统计');
                if (statsItem) {
                    simulateClick(statsItem);
                    console.log('"统计" has been auto-clicked.');

                    setTimeout(() => {
                        const filledItem = Array.from(document.querySelectorAll('.category-child-name')).find(item => item.textContent.includes('已填写'));
                        if (filledItem) {
                            simulateClick(filledItem);
                            console.log('"已填写" has been auto-clicked.');
                            setTimeout(async () => {
                                const scrollableElement = document.querySelector('.result-layout-pc-wrap.filled');
                                if (scrollableElement) {
                                    await scrollToBottom(scrollableElement);
                                    console.log('Scrolled to bottom.');
                                    extractData(); // 提取数据但不立即复制
                                    if (allResults.length <= 30) {
                                        // 如果用户数量不超过30，直接复制
                                        copyDataToClipboard(allResults);
                                    } else {
                                        // 用户数量超过30，进行分组并生成二级菜单
                                        groupData();
                                        // 显示提醒
                                        alert(`当前收集表投票人数过多（${allResults.length} 人），需要分开复制。`);
                                        createDropdownMenu();
                                        dropdownMenu.style.display = 'block';
                                    }
                                } else {
                                    console.log('Scrollable element not found.');
                                    alert('未找到可滚动的元素。');
                                }
                            }, 1000);  // 延迟确保数据加载
                        } else {
                            console.log('No element with text "已填写" found.');
                            alert('没有找到文本为 "已填写" 的元素。');
                        }
                    }, 1000); // 延迟确保数据加载
                } else {
                    console.log('No element with text "统计" found.');
                    alert('没有找到文本为 "统计" 的元素。');
                }
            }

            function simulateClick(element) {
                let evt = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(evt);
            }

            function scrollToBottom(element) {
                return new Promise((resolve) => {
                    const distance = 100; // 每次滚动的距离
                    const delay = 200;    // 每次滚动后的等待时间（毫秒）

                    const timer = setInterval(() => {
                        const previousScrollTop = element.scrollTop;
                        element.scrollBy(0, distance);

                        // 检查是否已到达底部
                        if (element.scrollTop === previousScrollTop || element.scrollTop + element.clientHeight >= element.scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, delay);
                });
            }

            function extractData() {
                allResults = []; // 清空之前的数据
                const triggers = document.querySelectorAll('.dui-trigger');
                triggers.forEach(trigger => {
                    const img = trigger.querySelector('.lazy-img');
                    const name = trigger.querySelector('.item-name');
                    if (img && name) {
                        allResults.push({
                            imageUrl: img.src,
                            userName: name.textContent.trim().replace('（我）', '') // 去掉“（我）”的后缀
                        });
                    }
                });
            }

            function groupData() {
                groupedResults = []; // 清空之前的分组数据
                const groupSize = 30;
                for (let i = 0; i < allResults.length; i += groupSize) {
                    groupedResults.push(allResults.slice(i, i + groupSize));
                }
            }

            function createDropdownMenu() {
                dropdownMenu.innerHTML = ''; // 清空之前的菜单项
                groupedResults.forEach((group, index) => {
                    const menuItem = document.createElement('div');
                    menuItem.textContent = `复制第 ${index + 1} 组 (${group.length} 条)`;
                    menuItem.style.padding = '8px 16px';
                    menuItem.style.cursor = 'pointer';
                    menuItem.style.whiteSpace = 'nowrap';
                    menuItem.style.color = '#333'; // 设置字体颜色为深灰色
                    menuItem.style.background = '#fff';

                    // 鼠标悬停效果
                    menuItem.addEventListener('mouseenter', function() {
                        menuItem.style.background = '#f5f5f5';
                    });
                    menuItem.addEventListener('mouseleave', function() {
                        menuItem.style.background = '#fff';
                    });

                    menuItem.addEventListener('click', function(event) {
                        event.stopPropagation(); // 阻止事件冒泡
                        copyDataToClipboard(group);
                        dropdownMenu.style.display = 'none'; // 复制后关闭菜单
                    });

                    dropdownMenu.appendChild(menuItem);
                });
            }

            function copyDataToClipboard(data) {
                const jsonString = `qqGet ${JSON.stringify(data, null, 2)}`;
                navigator.clipboard.writeText(jsonString).then(() => {
                    alert('数据已复制到剪切板。');
                }).catch(err => {
                    console.error('Failed to copy data to clipboard:', err);
                    alert('复制到剪切板失败。');
                });
            }
        }
    });
})();