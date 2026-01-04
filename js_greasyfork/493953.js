// ==UserScript==
// @name         DUP辅助脚本（种子展示相关种子并高亮关键词 + DUPE辅助）
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  高亮关键词并展示相关种子，以及DUPE相关功能。
// @author       您的名字
// @match        https://springsunday.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493953/DUP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%88%E7%A7%8D%E5%AD%90%E5%B1%95%E7%A4%BA%E7%9B%B8%E5%85%B3%E7%A7%8D%E5%AD%90%E5%B9%B6%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D%20%2B%20DUPE%E8%BE%85%E5%8A%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493953/DUP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%88%E7%A7%8D%E5%AD%90%E5%B1%95%E7%A4%BA%E7%9B%B8%E5%85%B3%E7%A7%8D%E5%AD%90%E5%B9%B6%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D%20%2B%20DUPE%E8%BE%85%E5%8A%A9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 高亮关键词并展示相关种子的功能
    function highlightAndDisplayKeywords() {
        const keywordGroups = [
            { keywords: ['720'], color: 'gray' },
            { keywords: ['1080'], color: 'gray' },
            { keywords: ['2160', '4k'], color: 'gray' },
            { keywords: ['264', 'avc'], color: 'orange' },
            { keywords: ['265', 'hevc'], color: 'orange' },
            { keywords: ['diy'], color: 'Cyan' },
            { keywords: ['remux'], color: 'Cyan' },
            { keywords: ['web'], color: 'Cyan' },
        ];

        function getActiveKeywordsFromH1() {
            const h1Text = document.querySelector('h1 #torrent-name').textContent.toLowerCase();
            return keywordGroups.reduce((acc, group) => {
                if (group.keywords.some(keyword => h1Text.includes(keyword.toLowerCase()))) {
                    acc.push({ keywords: group.keywords, color: group.color });
                }
                return acc;
            }, []);
        }

        function highlightKeywords(text, activeKeywordsGroups) {
            activeKeywordsGroups.forEach(group => {
                group.keywords.forEach(keyword => {
                    const regex = new RegExp(`(${keyword})`, 'gi');
                    text = text.replace(regex, `<span style="background-color: ${group.color}">\$1</span>`);
                });
            });
            return text;
        }

        function processLinks(activeKeywordsGroups) {
            const rowTitles = document.querySelectorAll('.row-title');
            const linksDisplayDiv = document.createElement('div');
            linksDisplayDiv.id = 'linksDisplayDiv';
            linksDisplayDiv.style.display = 'flex';
            linksDisplayDiv.style.flexDirection = 'column';

            rowTitles.forEach(rowTitle => {
                const link = rowTitle.querySelector('a');
                if (link) {
                    const newLink = document.createElement('a');
                    newLink.href = link.href;
                    newLink.innerHTML = highlightKeywords(link.textContent.trim(), activeKeywordsGroups);
                    newLink.style.marginBottom = '5px';

                    // 获取 row-smalldescr 的文本（不包括 span 内的文本）并添加到超链接的 title 属性
                    const smallDescr = rowTitle.closest('td').querySelector('.row-smalldescr');
                    if (smallDescr) {
                        // 获取所有子节点
                        const nodes = Array.from(smallDescr.childNodes);
                        let descrText = '';
                        nodes.forEach(node => {
                            // 只添加文本节点的内容
                            if (node.nodeType === Node.TEXT_NODE) {
                                descrText += node.textContent.trim();
                            }
                        });
                        newLink.title = descrText;
                    }

                    linksDisplayDiv.appendChild(newLink);
                }
            });

            const topH1 = document.getElementById('top');
            if (topH1) {
                const toggleButton = document.createElement('button');
                toggleButton.textContent = '展开/折叠';
                toggleButton.onclick = () => {
                    const displayDiv = document.getElementById('linksDisplayDiv');
                    displayDiv.style.display = displayDiv.style.display === 'none' ? 'flex' : 'none';
                };
                topH1.parentNode.insertBefore(toggleButton, topH1.nextSibling);
                topH1.parentNode.insertBefore(linksDisplayDiv, toggleButton.nextSibling);
            }
        }


        function highlightH1(activeKeywordsGroups) {
            const torrentNameSpan = document.querySelector('h1 #torrent-name');
            if (torrentNameSpan) {
                torrentNameSpan.innerHTML = highlightKeywords(torrentNameSpan.textContent, activeKeywordsGroups);
            }
        }

        function main() {
            const activeKeywordsGroups = getActiveKeywordsFromH1();
            highlightH1(activeKeywordsGroups);
            processLinks(activeKeywordsGroups);
        }

        if (window.location.href.includes("/details.php")) {
            main();
        }
    }

    // 添加隐藏已审按钮和torrents.php页面下的功能
    function enhanceTorrentsPage() {
        if (!window.location.href.includes("/torrents.php")) {
            return;
        }

        let buttonTop = 10; // 初始按钮位置
        const buttonSpacing = 30; // 按钮间隔

        // 按钮配置
        const buttons = [
            { text: '隐藏已审', action: () => jQuery('span.bi.bi-check2.torrent-icon, span.bi.bi-heart-fill.torrent-icon, span.bi.bi-fire.torrent-icon, span.bi.bi-award-fill.torrent-icon').closest('table').closest('tr').hide()},
            { text: '显示所有', action: () => jQuery('table.torrents tr').show() },
            { text: '隐藏中性', action: () => jQuery('span[title="中性"]').closest('table').closest('tr').hide() },
            { text: '隐藏可替代', action: () => jQuery('span[title="可替代"]').closest('table').closest('tr').hide() },
            { text: '隐藏匹配项', action: () => toggleVisibility(true) },
            { text: '隐藏非匹配项', action: () => toggleVisibility(false) },
            { text: '选中复选框', action: () => jQuery('table.torrents input[type="checkbox"]:visible').prop('checked', true) }
        ];

        // 创建按钮和输入框
        buttons.forEach(btn => createButton(btn.text, btn.action));
        const mainInput = createInput('匹配标题', 'savedMainRegex');
        const subtitleInput = createInput('匹配副标题', 'savedSubtitleRegex');

        // 切换行的可见性
        function toggleVisibility(match) {
            const mainRegex = new RegExp(mainInput.value, 'i');
            const subtitleRegex = new RegExp(subtitleInput.value, 'i');
            jQuery('table.torrents tr:visible').each(function (index) {
                if (index === 0) return; // 跳过表头
                const title = jQuery(this).find('div.torrent-title a[title]').attr('title');
                const subtitle = jQuery(this).find('div.torrent-smalldescr span:last').text();
                const regexToUse = mainInput.value ? mainRegex : subtitleRegex;
                const textToMatch = mainInput.value ? title : subtitle;
                const shouldHide = match ? regexToUse.test(textToMatch) : !regexToUse.test(textToMatch);
                jQuery(this).toggle(!shouldHide);
            });
        }

        function createButton(text, onClickFunction) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;`;
            document.body.appendChild(button);
            button.onclick = onClickFunction;
            buttonTop += buttonSpacing;
        }

        function createInput(placeholder, localStorageKey) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholder;
            input.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;width:120px;`;
            document.body.appendChild(input);
            input.value = localStorage.getItem(localStorageKey) || '';
            input.addEventListener('input', () => {
                localStorage.setItem(localStorageKey, input.value);
            });
            buttonTop += buttonSpacing;
            return input;
        }
    }




    if (window.location.href.includes("/details.php")) {
        highlightAndDisplayKeywords();
    } else if (window.location.href.includes("/torrents.php")) {
        enhanceTorrentsPage();
    }
})();
