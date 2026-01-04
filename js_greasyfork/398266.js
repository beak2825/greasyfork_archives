// ==UserScript==
// @name         bangumiHider Ultra Compact Mode with Clickable Title
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  收藏过的条目默认隐藏并显示为更紧凑的一行，标题可点击，点击 Rank 区域填写隐藏原因
// @author       雨夜
// @match        *://bgm.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398266/bangumiHider%20Ultra%20Compact%20Mode%20with%20Clickable%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/398266/bangumiHider%20Ultra%20Compact%20Mode%20with%20Clickable%20Title.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义隐藏/显示函数
    function toggleHiddenItems() {
        const list = document.getElementById('browserItemList');
        if (list) {
            Array.from(list.children).forEach(n => {
                const itemId = n.id.replace('item_', ''); // 获取条目 ID
                const isCollected = n.getElementsByClassName('collectModify').length !== 0;
                const customReason = localStorage.getItem(`bangumiHiderReason_${itemId}`);

                if (isCollected || customReason) {
                    // 隐藏封面图片
                    const cover = n.getElementsByClassName('subjectCover')[0];
                    if (cover) cover.style.display = "none";

                    // 隐藏收藏按钮
                    const collectBlock = n.getElementsByClassName('collectBlock')[0];
                    if (collectBlock) collectBlock.style.display = "none";

                    // 隐藏信息
                    const info = n.getElementsByClassName('info tip')[0];
                    if (info) info.style.display = "none";

                    // 隐藏评分信息
                    const rateInfo = n.getElementsByClassName('rateInfo')[0];
                    if (rateInfo) rateInfo.style.display = "none";

                    // 只显示标题和自定义原因
                    const title = n.getElementsByTagName('h3')[0];
                    if (title) {
                        title.style.margin = '0'; // 去掉多余的边距
                        title.style.fontSize = '12px'; // 调整字体大小
                        title.style.lineHeight = '20px'; // 设置行高
                        title.style.display = 'inline'; // 让标题和 Rank 在同一行
                    }

                    // 显示自定义原因（如果有）
                    const reasonText = customReason ? `（原因：${customReason}）` : '';
                    if (title) {
                        const titleLink = title.getElementsByTagName('a')[0];
                        if (titleLink) {
                            titleLink.style.color = 'inherit'; // 保持标题颜色一致
                            titleLink.style.textDecoration = 'none'; // 去掉下划线
                            titleLink.innerHTML = `${titleLink.innerText} ${reasonText}`;
                        }
                    }

                    // 设置条目高度为更紧凑模式
                    n.style.height = '20px'; // 调整为更紧凑的高度
                    n.style.overflow = 'hidden'; // 隐藏超出部分
                    n.style.lineHeight = '20px'; // 设置行高
                } else {
                    // 显示所有内容
                    const cover = n.getElementsByClassName('subjectCover')[0];
                    if (cover) cover.style.display = "";

                    const collectBlock = n.getElementsByClassName('collectBlock')[0];
                    if (collectBlock) collectBlock.style.display = "";

                    const info = n.getElementsByClassName('info tip')[0];
                    if (info) info.style.display = "";

                    const rateInfo = n.getElementsByClassName('rateInfo')[0];
                    if (rateInfo) rateInfo.style.display = "";

                    // 恢复标题样式
                    const title = n.getElementsByTagName('h3')[0];
                    if (title) {
                        title.style.margin = '';
                        title.style.fontSize = '';
                        title.style.lineHeight = '';
                        title.style.display = '';
                        const titleLink = title.getElementsByTagName('a')[0];
                        if (titleLink) {
                            titleLink.style.color = '';
                            titleLink.style.textDecoration = '';
                        }
                    }

                    // 恢复条目高度
                    n.style.height = '';
                    n.style.overflow = '';
                    n.style.lineHeight = '';
                }
            });
        }
    }

    // 为每个条目的 Rank 区域添加点击事件
    function addRankClickHandler() {
        const list = document.getElementById('browserItemList');
        if (list) {
            Array.from(list.children).forEach(n => {
                const itemId = n.id.replace('item_', ''); // 获取条目 ID
                const rank = n.getElementsByClassName('rank')[0];

                if (rank) {
                    // 设置 Rank 区域的样式，使其可点击
                    rank.style.cursor = 'pointer';
                    rank.title = '点击填写隐藏原因';

                    // 点击 Rank 区域时弹出输入框
                    rank.addEventListener('click', () => {
                        const reason = prompt('请输入隐藏原因（留空则清除原因）：', localStorage.getItem(`bangumiHiderReason_${itemId}`) || '');
                        if (reason !== null) { // 用户点击了“确定”或“取消”
                            if (reason.trim()) {
                                localStorage.setItem(`bangumiHiderReason_${itemId}`, reason.trim());
                            } else {
                                localStorage.removeItem(`bangumiHiderReason_${itemId}`);
                            }
                            toggleHiddenItems(); // 更新隐藏状态
                        }
                    });
                }
            });
        }
    }

    // 初始化
    function init() {
        toggleHiddenItems(); // 根据收藏状态和自定义原因隐藏内容
        addRankClickHandler(); // 为 Rank 区域添加点击事件
    }

    // 等待页面加载完成后执行
    window.onload = init;
})();