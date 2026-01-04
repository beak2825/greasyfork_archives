// ==UserScript==
// @name         知网-文献-bibtex提取
// @namespace    https://github.com/BNDou/getCnkiLiteratureBibTex
// @description  从知网文献中直接复制引文，支持多种引文格式：BibTeX、GB/T 7714-2015、知网研学、CAJ-CD、MLA、APA、Refworks、EndNote、NoteExpress、NodeFirst
// @license      AGPL License
// @version      4.2.1
// @author       BN_Dou
// @match        *://kns.cnki.net/kcms2/article/abstract*
// @match        *://kns.cnki.net/kcms/detail*
// @match        *://kns.cnki.net/kns8s/defaultresult/index*
// @match        *://kns.cnki.net/kns8s/search*
// @match        *://kns.cnki.net/kns8s/AdvSearch*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.cnki.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/541386/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541386/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 引文类型定义
    const CITATION_TYPES = {
        'BibTeX': 'BibTex',
        'GB/T 7714-2015': 'GBTREFER',
        '知网研学': 'elearning',
        'CAJ-CD': 'REFER',
        'MLA': 'MLA',
        'APA': 'APA',
        'Refworks': 'Refworks',
        'EndNote': 'EndNote',
        'NoteExpress': 'NoteExpress',
        'NodeFirst': 'NodeFirst'
    };

    // 获取当前引文类型
    let currentCitationType = GM_getValue('citationType', 'BibTeX');

    // 更新按钮文本
    function updateButtonText() {
        // 更新普通按钮
        const buttons = document.querySelectorAll('[id^="bibbtn"]');
        buttons.forEach(button => {
            if (button.querySelector('span')) {
                button.querySelector('span').textContent = currentCitationType;
            }
        });

        // 更新批量复制按钮
        const batchLink = document.querySelector('#batch_bibbtn_li a');
        if (batchLink) {
            batchLink.textContent = `批量复制${currentCitationType}`;
        }
    }

    // 更新菜单项
    function updateMenuItems() {
        // 添加菜单项
        for (const [typeName, _] of Object.entries(CITATION_TYPES)) {
            GM_registerMenuCommand(`🔄 切换到 ${typeName}`, () => switchCitationType(typeName));
        }
    }

    // 切换引文类型
    function switchCitationType(type) {
        currentCitationType = type;
        GM_setValue('citationType', type);
        updateButtonText();
    }

    // 样式定义
    const STYLES = {
        button: `
            width: 65px;
            height: 25px;
            border-radius: 12px;
            background-color: #0f5de5;
            border: none;
            color: white;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(15, 93, 229, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            position: relative;
            z-index: 1;
        `,
        advSearchButton: `
            width: 100%;
            height: 24px;
            padding: 0 8px;
            border-radius: 8px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            color: #0f5de5;
            font-size: 12px;
            font-weight: normal;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin: 4px 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
        `,
        successAnimation: `
            @keyframes successPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `
    };

    let citationText = '';

    // 创建并注入样式
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES.successAnimation;
        document.head.appendChild(styleSheet);
    }

    // 创建按钮
    function createButton(isAdvSearch = false) {
        const button = document.createElement('button');
        button.id = "bibbtn";
        button.title = "点击复制引文";
        button.innerHTML = `<span>${currentCitationType}</span>`;
        button.style.cssText = isAdvSearch ? STYLES.advSearchButton : STYLES.button;

        if (isAdvSearch) {
            // 高级检索页面的悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#e8e8e8';
                button.style.borderColor = '#ccc';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#f0f0f0';
                button.style.borderColor = '#ddd';
            });
        } else {
            // 原有页面的悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#0d4fc3';
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 12px rgba(15, 93, 229, 0.4)';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#0f5de5';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 8px rgba(15, 93, 229, 0.3)';
            });
        }

        return button;
    }

    // 显示复制成功提示
    function showCopySuccess(button) {
        const element = document.getElementById(button);
        if (!element) return;

        if (button === 'batch_bibbtn_li') {
            // 批量复制按钮的处理
            const batchLink = element.querySelector('a');
            if (!batchLink) return;

            const originalText = batchLink.textContent;
            batchLink.textContent = '✅ 已复制';
            batchLink.style.animation = 'successPulse 0.5s ease';

            setTimeout(() => {
                batchLink.textContent = originalText;
                batchLink.style.animation = '';
            }, 1500);
        } else {
            // 普通按钮的处理
            const originalText = element.innerHTML;
            // 检查是否为检索页面的按钮
            const isSearchPageButton = button.startsWith('bibbtn_');
            element.innerHTML = `<span style="color: ${isSearchPageButton ? '#0f5de5' : 'white'};">✅ 已复制</span>`;
            element.style.animation = 'successPulse 0.5s ease';

            setTimeout(() => {
                element.innerHTML = originalText;
                element.style.animation = '';
            }, 1500);
        }
    }

    // 获取引文数据
    async function getCitationText(filename = null) {
        try {
            let params;
            if (filename) {
                // 高级检索页面的情况
                params = {
                    FileName: filename,
                    DisplayMode: CITATION_TYPES[currentCitationType],
                    OrderParam: 0,
                    OrderType: 'desc',
                };
            } else {
                // 默认情况
                params = {
                    FileName: document.getElementById("paramdbname").getAttribute("value") + '!' +
                        document.getElementById("paramfilename").getAttribute("value") + '!1!0',
                    DisplayMode: CITATION_TYPES[currentCitationType],
                    OrderParam: 0,
                    OrderType: 'desc',
                };
            }
            // const response = await fetch('https://kns.cnki.net/dm/api/ShowExport', {
            const response = await fetch('https://kns.cnki.net/dm8/api/ShowExport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://kns.cnki.net/dm/manage/export.html',
                },
                body: new URLSearchParams(params),
            });

            const data = await response.text();

            // 创建一个临时的div来解析HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            let sText = '';
            const displayMode = CITATION_TYPES[currentCitationType].toUpperCase();

            // 使用类似官方的提取逻辑
            if (displayMode === 'MLA' || displayMode === 'APA') {
                // 对于MLA和APA格式，直接获取文本内容
                const items = tempDiv.querySelectorAll('ul.literature-list li');
                sText = Array.from(items)
                    .map(item => item.textContent
                        .replace(/\r/g, '')
                        .replace(/\n/g, '')
                        .replace(/      /g, '')
                        .replace(/  /g, ''))
                    .join('\n');
            } else if (displayMode === "NODEFIRST") {
                // 对于NODEFIRST格式，直接获取文本内容
                const items = tempDiv.querySelectorAll('ul.literature-list li');
                sText = Array.from(items)
                    .map(item => item.innerHTML
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/\r/g, "")
                        .replace(/\n/g, "")
                        .replace(/<BR>/g, "\r\n")
                        .replace(/<br>/g, "\r\n"))
                    .join('\n');
            } else {
                // 对于其他格式
                const items = tempDiv.querySelectorAll('ul.literature-list>li');
                sText = Array.from(items)
                    .map(item => {
                        let text = item.innerHTML
                            .replace(/\r/g, '')
                            .replace(/\n/g, '')
                            .replace(/<BR>/g, '\n')
                            .replace(/<br>/g, '\n')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/      {/g, '{')
                            .replace(/      /g, '');

                        // 根据不同格式处理空格
                        if (displayMode === 'GBTREFER') {
                            text = text.replace(/  /g, '');
                        } else if (displayMode === 'REFER' || displayMode === 'NEW' || displayMode === 'NEWDEFINE') {
                            text = text.replace(/    /g, '');
                        } else if (displayMode === 'SELFDEFINE') {
                            text = text.replace(/   /g, '');
                        } else if (displayMode === 'BIBTEX') {
                            text = text.replace(/author = \{(\s+)/g, 'author = {').replace(/(\s+)and(\s+)/g, ' and ');
                        }

                        // 移除所有HTML标签
                        text = text.replace(/<\/?.+?\/?>/g, '');
                        return text;
                    })
                    .join('\n');
            }

            if (!sText) {
                throw new Error('未找到引文数据');
            }

            return sText;
        } catch (error) {
            console.error('获取引文失败:', error);
            return null;
        }
    }

    // 复制引文到剪贴板
    //async function copyText(buttonId = 'bibbtn', filename = null) {
    //    const citationContent = await getCitationText(filename);
    //    if (citationContent) {
    //        GM_setClipboard(citationContent);
    //        showCopySuccess(buttonId);
    //    }
    //}
    function cleanCitationText(rawText) {
    return rawText
        .split('\n')
        .map(line => {
            // 去除行首空格（尤其是 tab），只保留字段标记和后面的值
            return line.replace(/^\s*%([A-Z0-9])\s*/, '%$1 ');
        })
        .join('\r\n'); // 确保使用 Windows 兼容换行
    }


    async function copyText(buttonId = 'bibbtn', filename = null) {
    const citationContentRaw = await getCitationText(filename);
    const citationContent = cleanCitationText(citationContentRaw); // 清洗格式
    if (!citationContent) return;


    if (currentCitationType === 'EndNote') {
        // 生成 RIS 文件并下载
        const blob = new Blob([citationContent], { type: 'application/x-research-info-systems' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 默认文件名
        const timestamp = new Date().getTime();
        link.download = `citation_${timestamp}.ris`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showCopySuccess(buttonId);
    } else {
        // 默认复制到剪贴板
        GM_setClipboard(citationContent);
        showCopySuccess(buttonId);
    }
    }


    // 初始化
    function initialize() {
        injectStyles();

        // 初始化菜单
        updateMenuItems();

        // 根据页面URL决定按钮添加位置
        const currentURL = window.location.href;

        if (currentURL.includes('https://kns.cnki.net/kns8s/defaultresult/index') ||
            currentURL.includes('https://kns.cnki.net/kns8s/AdvSearch') ||
            currentURL.includes('https://kns.cnki.net/kns8s/search')) {
            // 高级检索页面 - 添加定时检测

            // 添加批量操作按钮
            function addBatchButton() {
                const batchOpsBox = document.getElementById('batchOpsBox');
                if (batchOpsBox && !batchOpsBox.querySelector('li[id="batch_bibbtn_li"]')) {
                    // 创建新的li元素
                    const batchLi = document.createElement('li');
                    batchLi.id = 'batch_bibbtn_li';
                    batchLi.className = 'export';

                    // 创建链接
                    const batchLink = document.createElement('a');
                    batchLink.href = 'javascript:void(0)';
                    batchLink.textContent = `批量复制${currentCitationType}`;
                    batchLink.style.color = '#0f5de5';

                    // 为链接绑定点击事件
                    batchLink.addEventListener('click', () => {
                        const checkedBoxes = document.querySelectorAll('.cbItem:checked');
                        if (checkedBoxes.length === 0) {
                            alert('请先选择要复制的文献');
                            return;
                        }
                        const values = Array.from(checkedBoxes).map(cb => cb.value).join(',');
                        copyText('batch_bibbtn_li', values);
                    });

                    // 组装元素
                    batchLi.appendChild(batchLink);
                    batchOpsBox.appendChild(batchLi);
                }
            }

            // 定义检测和添加按钮的函数
            function checkAndAddButtons() {
                // 添加批量操作按钮
                addBatchButton();

                // 添加单个操作按钮
                const operatElements = document.querySelectorAll('.operat, .opts ul.opts-btn');

                Array.from(operatElements).forEach((element, index) => {
                    // 检查该行是否已有按钮
                    if (element.querySelector('button[id^="bibbtn_"]')) return;

                    const button = createButton(true);  // 传入true表示是高级检索页面
                    button.id = `bibbtn_${index}`;

                    // 为opts创建li元素
                    if (element.classList.contains('opts-btn')) {
                        const li = document.createElement('li');
                        li.appendChild(button);
                        element.insertBefore(li, element.firstChild);
                    } else {
                        element.insertBefore(button, element.firstChild);
                    }

                    let filename_param = '';
                    if (element.classList.contains('opts-btn')) {
                        // 对于opts情况，从父级dd中查找cbItem
                        const dd = element.closest('dd');
                        if (dd) {
                            const cbItem = dd.querySelector('.cbItem');
                            if (cbItem) {
                                filename_param = cbItem.value;
                            }
                        }
                    } else {
                        // 对于operat情况，从tr中查找cbItem
                        const resultItem = element.closest('tr');
                        if (resultItem) {
                            const cbItem = resultItem.querySelector('.cbItem');
                            if (cbItem) {
                                filename_param = cbItem.value;
                            }
                        }
                    }

                    if (filename_param) {
                        // 为按钮绑定点击事件
                        $(`#bibbtn_${index}`).click(() => {
                            copyText(`bibbtn_${index}`, filename_param);
                        });
                    }
                });
            }

            // 启动定时检测
            setInterval(checkAndAddButtons, 1000);

        } else {
            // 默认处理
            const otherButtons = document.getElementsByClassName('other-btns')[0];
            if (otherButtons) {
                // 创建按钮元素
                const li = document.createElement('li');
                li.className = 'btn-bibtex';
                li.style.cssText = `
                    width: 65px;
                    height: 25px;
                `;
                const button = createButton();
                li.appendChild(button);

                // 插入到第一个位置
                otherButtons.insertBefore(li, otherButtons.firstChild);

                // 绑定点击事件
                $("#bibbtn").click(() => copyText());
            }
        }
    }

    // 启动脚本
    initialize();
})();
