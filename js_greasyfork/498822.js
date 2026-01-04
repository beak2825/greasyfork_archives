// ==UserScript==
// @name         快捷交叉验证搜索
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  输入你检索的主题+选择默认的交叉验证关键词，辅助你快速交叉验证。支持双语
// @author       awyugan
// @match        https://www.google.com/search?q=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498822/%E5%BF%AB%E6%8D%B7%E4%BA%A4%E5%8F%89%E9%AA%8C%E8%AF%81%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/498822/%E5%BF%AB%E6%8D%B7%E4%BA%A4%E5%8F%89%E9%AA%8C%E8%AF%81%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 中英文词汇
    const zhWords = {
        actionPhrases: ['评论', '批评', '回应', '反对', '真实吗', '靠谱吗', '可信吗', '不能', '不要', '不会'],
        negativeTerms: ['错误', '缺陷', '不足', '问题', '失败', '误解', '骗子', '骗局', '非法', '假的', '欺骗', '圈套', '陷阱'],
        title: '快捷交叉验证搜索',
        examples: [
            '最好 vs 最差',
            '裁员 vs 扩招',
            '倒闭 vs 扩张'
        ]
    };

    const enWords = {
        actionPhrases: ['Comment', 'Reply to', 'criticize', 'is real', 'is true', 'why not'],
        negativeTerms: ['bad', 'worst', 'terrible', 'awful', 'believable', 'likely'],
        title: 'Negation Cross Validation',
        examples: [
            'best vs worst',
            'layoff vs hire',
            'collapse vs expand'
        ]
    };

    let currentLang = 'zh';
    let words = zhWords;

    // 添加快捷搜索按钮
    const searchButton = document.createElement('button');
    searchButton.innerText = '快捷搜索';
    searchButton.style.position = 'fixed';
    searchButton.style.bottom = '10px';
    searchButton.style.right = '10px';
    searchButton.style.zIndex = 1000;
    searchButton.style.padding = '10px';
    searchButton.style.backgroundColor = '#007BFF';
    searchButton.style.color = '#FFFFFF';
    searchButton.style.border = 'none';
    searchButton.style.borderRadius = '5px';
    searchButton.style.cursor = 'pointer';

    document.body.appendChild(searchButton);

    // 创建高级搜索框
    const searchPanel = document.createElement('div');
    searchPanel.style.position = 'fixed';
    searchPanel.style.bottom = '100px';
    searchPanel.style.right = '10px';
    searchPanel.style.zIndex = 1000;
    searchPanel.style.padding = '20px';
    searchPanel.style.backgroundColor = '#f8f9fa';
    searchPanel.style.border = '1px solid #ced4da';
    searchPanel.style.borderRadius = '5px';
    searchPanel.style.display = 'none';
    searchPanel.style.width = '300px';
    searchPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

    // 标题和语言切换按钮
    const panelHeader = document.createElement('div');
    panelHeader.style.display = 'flex';
    panelHeader.style.justifyContent = 'space-between';
    panelHeader.style.alignItems = 'center';
    const panelTitle = document.createElement('h4');
    panelTitle.innerText = words.title;
    panelHeader.appendChild(panelTitle);
    const langButton = document.createElement('button');
    langButton.innerText = 'Switch to English';
    langButton.style.padding = '5px';
    langButton.style.backgroundColor = '#28a745';
    langButton.style.color = '#FFFFFF';
    langButton.style.border = 'none';
    langButton.style.borderRadius = '5px';
    langButton.style.cursor = 'pointer';
    panelHeader.appendChild(langButton);
    searchPanel.appendChild(panelHeader);

    // 关键词输入框
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.placeholder = currentLang === 'zh' ? '请输入搜索关键词' : 'Please enter a search keyword';
    keywordInput.style.width = '100%';
    keywordInput.style.padding = '10px';
    keywordInput.style.margin = '10px 0';
    keywordInput.style.border = '1px solid #ced4da';
    keywordInput.style.borderRadius = '5px';
    searchPanel.appendChild(keywordInput);

    // 词汇选择容器
    const wordContainer = document.createElement('div');
    searchPanel.appendChild(wordContainer);

    // 生成词汇选择按钮
    let selectedWords = [];
    function generateWordButtons() {
        wordContainer.innerHTML = '';
        ['actionPhrases', 'negativeTerms'].forEach(type => {
            words[type].forEach(word => {
                const wordButton = document.createElement('button');
                wordButton.innerText = word;
                wordButton.style.margin = '5px';
                wordButton.style.padding = '5px';
                wordButton.style.border = '1px solid #007BFF';
                wordButton.style.borderRadius = '5px';
                wordButton.style.cursor = 'pointer';
                wordButton.addEventListener('click', () => {
                    if (!selectedWords.includes(word)) {
                        selectedWords.push(word);
                        wordButton.disabled = true;
                    }
                });
                wordContainer.appendChild(wordButton);
            });
        });
    }

    // 添加词汇按钮
    const addWordButton = document.createElement('button');
    addWordButton.innerText = '+';
    addWordButton.style.margin = '5px';
    addWordButton.style.padding = '5px';
    addWordButton.style.border = '1px solid #007BFF';
    addWordButton.style.borderRadius = '5px';
    addWordButton.style.cursor = 'pointer';
    addWordButton.addEventListener('click', () => {
        const newWord = prompt(currentLang === 'zh' ? '请输入新词汇:' : 'Please enter a new word:');
        if (newWord) {
            selectedWords.push(newWord);
            generateWordButtons(); // 重新生成词汇选择按钮，避免重复添加
        }
    });
    wordContainer.appendChild(addWordButton);

    // 添加反义词提示
    const oppositeWordsDiv = document.createElement('div');
    oppositeWordsDiv.innerHTML = `<p>反义词举例:</p><ul>${words.examples.map(example => `<li>${example}</li>`).join('')}</ul>`;
    oppositeWordsDiv.style.marginTop = '10px';
    oppositeWordsDiv.style.padding = '10px';
    oppositeWordsDiv.style.backgroundColor = '#f8f9fa';
    oppositeWordsDiv.style.border = '1px solid #ced4da';
    oppositeWordsDiv.style.borderRadius = '5px';
    searchPanel.appendChild(oppositeWordsDiv);

    // 搜索按钮
    const submitButton = document.createElement('button');
    submitButton.innerText = currentLang === 'zh' ? '执行搜索' : 'Perform Search';
    submitButton.style.marginTop = '10px';
    submitButton.style.padding = '10px';
    submitButton.style.backgroundColor = '#007BFF';
    submitButton.style.color = '#FFFFFF';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '5px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.width = '100%';
    submitButton.addEventListener('click', () => {
        const userInput = keywordInput.value;
        if (userInput) {
            const queries = generateSearchQueries(userInput);
            queries.forEach(query => performSearch(query));
            searchPanel.style.display = 'none';
        }
    });
    searchPanel.appendChild(submitButton);

    document.body.appendChild(searchPanel);

    // 切换语言
    langButton.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        words = currentLang === 'zh' ? zhWords : enWords;
        langButton.innerText = currentLang === 'zh' ? 'Switch to English' : '切换到中文';
        panelTitle.innerText = words.title;
        keywordInput.placeholder = currentLang === 'zh' ? '请输入搜索关键词' : 'Please enter a search keyword';
        oppositeWordsDiv.innerHTML = `<p>反义词举例:</p><ul>${words.examples.map(example => `<li>${example}</li>`).join('')}</ul>`;
        generateWordButtons();
    });

    // 显示高级搜索框
    searchButton.addEventListener('click', () => {
        selectedWords = [];
        keywordInput.value = '';
        searchPanel.style.display = 'block';
        generateWordButtons();
    });

    // 搜索表达式和关键词
    function generateSearchQueries(userInput) {
        let queries = [];
        if (selectedWords.length > 0) {
            const combinedWords = selectedWords.join(' OR ');
            queries.push(`"${userInput}" AND (${combinedWords})`);
        } else {
            queries.push(`"${userInput}"`);
        }
        return queries;
    }

    function performSearch(query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
    }
})();
