// ==UserScript==
// @name         知网检索增强
// @name:zh-CN   知网检索增强
// @name:en      CNKI Search Enhancer
// @version      0.3.0
// @namespace    https://greasyfork.org/users/808185
// @description  新标签页打开高级检索……
// @description:en   The new tab opens advanced retrieval and automatically generates retrieval.
// @icon         https://www.cnki.net/favicon.ico
// @author       shujuecn
// @match        *://*/kns8s/AdvSearch*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/490258/%E7%9F%A5%E7%BD%91%E6%A3%80%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490258/%E7%9F%A5%E7%BD%91%E6%A3%80%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const isNewTabSearchEnabled = 1; // 设置为1时启用新标签页检索功能, 设置为0时禁用
    const isCopyAsSearchEnabled = 0; // 设置为1时启用复制为检索式功能, 设置为0时禁用

    const styles = `
        .custom-menu-list {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            display: inline-block;
            width: 460px;
            margin-top: -24px;
        }

        .custom-tab {
            float: right;
            height: 43px;
            padding: 0 20px;
            font-size: 15px;
            line-height: 43px;
            color: #2b2b2b;
            cursor: pointer;
        }

        .custom-tab:hover {
            color: red;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const tabs = [
        {
            text: '新标签页检索',
            action: () => {
                const currentUrl = new URL(window.location.href);
                let newUrl;

                if (currentUrl.hostname.includes('kns.cnki.net')) {
                    newUrl = new URL(`${currentUrl.protocol}//${currentUrl.hostname}/kns8s/AdvSearch`);
                }

                if (newUrl) {
                    window.open(newUrl.href, '_blank');
                }
            },
            enabled: isNewTabSearchEnabled
        },
        {
            text: '复制为检索式',
            action: () => {
                const tabElement = event.currentTarget;
                const originalText = tabElement.textContent;

                const fieldList = document.querySelector("#ModuleSearch > div.search-box > div > div.search-classify > div > div.grade-search-content > div.search-mainbox.is-off > div.search-middle > div:nth-child(1) > div.gradeSearch");

                if (fieldList) {
                    const ddElements = fieldList.querySelectorAll('dd');
                    const fieldCount = ddElements.length;
                    const ddIndices = Array.from({ length: fieldCount }, (_, i) => i * 2 + 2);

                    const fieldNames = [];
                    const fieldValues = [];
                    const fieldOptions = [];
                    const logicalOperators = [];

                    ddIndices.forEach((index) => {
                        const nameElement = fieldList.querySelector(`#gradetxt > dd:nth-child(${index}) > div.input-box > div.sort.reopt > div.sort-default > span`);
                        const valueElement = fieldList.querySelector(`#gradetxt > dd:nth-child(${index}) > div.input-box > input[type=text]`);
                        const optionElement = fieldList.querySelector(`#gradetxt > dd:nth-child(${index}) > div.input-box > div.sort.special > div > span`);

                        if (nameElement && valueElement && optionElement) {
                            fieldNames.push(nameElement.textContent);
                            fieldValues.push(valueElement.value);
                            fieldOptions.push(optionElement.textContent);
                        }
                    });

                    const operatorIndices = ddIndices.slice(1);
                    operatorIndices.forEach((index) => {
                        const operatorElement = fieldList.querySelector(`#gradetxt > dd:nth-child(${index}) > div.sort.logical > div > span`);
                        if (operatorElement) {
                            logicalOperators.push(operatorElement.textContent);
                        }
                    });

                    // 1. 替换字段名称中的中文
                    const fieldNameReplacements = {
                        '主题': 'SU %= ', '篇关摘': 'TKA %= ', '关键词': 'KY = ', '篇名': 'TI %= ', '全文': 'FT %= ',
                        '作者': 'AU = ', '第一作者': 'FI = ', '通讯作者': 'RP = ', '作者单位': 'AF = ', '基金': 'FU = ',
                        '摘要': 'AB %= ', '小标题': 'CO %= ', '参考文献': 'RF %= ', '分类号': 'CLC = ', '文献来源': 'LY %= ',
                        'DOI': 'DOI = ', '被引频次': 'CF = ',
                        '题名': 'TI %= ', '导师': 'TU = ', '第一导师': 'FTU = ', '学位授予单位': 'LY %= ',
                        '目录': 'CO %= ', '中图分类号': 'CLC = ', '学科专业名称': 'XF = ', '发表时间': 'PT = '
                    };


                    // 2. 构造检索键值表
                    const searchKeyValues = [];
                    const specialChars = /[*+\-]/; // 定义特殊字符

                    fieldValues.forEach((value, index) => {
                        if (value) {
                            const words = value.split(' '); // 按空格分词
                            const quotedWords = words.map((word, idx) => {
                                if (specialChars.test(word)) { // 如果是特殊字符,直接返回
                                    return word;
                                } else if (/^['"].*['"]$/.test(word)) { // 如果已被引号包裹,直接返回
                                    return word;
                                } else if (/^\(.*\)$/.test(word)) { // 如果被小括号包裹
                                    const subWords = word.slice(1, -1).split('+');
                                    const quotedSubWords = subWords.map(subWord => {
                                        if (specialChars.test(subWord)) {
                                            return subWord;
                                        } else if (/^['"].*['"]$/.test(subWord)) {
                                            return subWord;
                                        } else {
                                            return `'${subWord}'`;
                                        }
                                    });
                                    return `(${quotedSubWords.join(' + ')})`;
                                } else { // 否则在两侧添加单引号,但首位元素如果开头字符为(或末尾元素如果结尾字符为)则处理括号和文字
                                    if (word[0] === '(') { // 首位元素以 ( 开头
                                        const bracketContent = word.slice(1);
                                        const quotedContent = /^['"].*['"]$/.test(bracketContent) ? bracketContent : `'${bracketContent}'`;
                                        return `(${quotedContent}`;
                                    } else if (word[word.length - 1] === ')') { // 末位元素以 ) 结尾
                                        const bracketContent = word.slice(0, -1);
                                        const quotedContent = /^['"].*['"]$/.test(bracketContent) ? bracketContent : `'${bracketContent}'`;
                                        return `${quotedContent})`;
                                    } else {
                                        return `'${word}'`;
                                    }
                                }
                            });
                            const quotedValue = quotedWords.join(' '); // 用空格连接子元素
                            const replacedName = fieldNameReplacements[fieldNames[index]] || fieldNames[index];
                            searchKeyValues.push(`${replacedName}${quotedValue}`);
                        }
                    });

                    // 3. 插入逻辑运算符
                    const searchQuery = searchKeyValues.reduce((acc, curr, index) => {
                        if (index < searchKeyValues.length - 1) {
                            return `${acc}${curr} ${logicalOperators[index]} `;
                        } else {
                            return `${acc}${curr}`;
                        }
                    }, '');

                    // console.log('字段名称:', fieldNames);
                    // console.log('字段值:', fieldValues);
                    // console.log('字段选项:', fieldOptions);
                    // console.log('逻辑运算符:', logicalOperators);
                    // console.log('检索键值表:', searchKeyValues);
                    // console.log('搜索查询字符串:', searchQuery);

                    // 4. 复制到剪切板
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(searchQuery)
                            .then(() => {
                            console.log('已复制搜索查询字符串到剪切板');
                            tabElement.textContent = '复制成功！';

                            // 鼠标脱离时恢复原始文本
                            const handleMouseLeave = () => {
                                tabElement.textContent = originalText;
                                tabElement.removeEventListener('mouseleave', handleMouseLeave);
                            };
                            tabElement.addEventListener('mouseleave', handleMouseLeave, { once: true });
                        })
                            .catch((err) => {
                            console.error('复制到剪切板时出错:', err);
                            // 使用备用方案进行复制
                            copyTextToClipboard(searchQuery, tabElement, originalText);
                        });
                    } else {
                        // 浏览器不支持 Clipboard API,直接使用备用方案进行复制
                        copyTextToClipboard(searchQuery, tabElement, originalText);
                    }
                } else {
                    console.log('未找到检索字段列表元素');
                }
            },
            enabled: isCopyAsSearchEnabled
        }
    ];

    // 备用方案: 创建临时文本区域
    function copyTextToClipboard(text, tabElement, originalText) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('已复制搜索查询字符串到剪切板');
                tabElement.textContent = '复制成功！';

                // 鼠标脱离时恢复原始文本
                const handleMouseLeave = () => {
                    tabElement.textContent = originalText;
                    tabElement.removeEventListener('mouseleave', handleMouseLeave);
                };
                tabElement.addEventListener('mouseleave', handleMouseLeave, { once: true });
            } else {
                console.error('无法复制到剪切板');
            }
        } catch (err) {
            console.error('无法访问剪贴板:', err);
        }

        document.body.removeChild(textArea);
    }

    // 高级检索页面插入已启用新标签
    window.addEventListener('load', function () {
        const menuList = document.querySelector("#ModuleSearch > div.search-box > div > div.search-classify > ul.search-classify-menu");

        tabs.forEach(tab => {
            if (tab.enabled) {
                const newTab = document.createElement('li');
                newTab.className = 'custom-tab';
                newTab.textContent = tab.text;
                newTab.addEventListener('click', tab.action);
                menuList.appendChild(newTab);
            }
        });
    });

})();
