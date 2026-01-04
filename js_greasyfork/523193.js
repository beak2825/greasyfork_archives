// ==UserScript==
// @name         豆瓣图书文件名生成
// @namespace    https://github.com/NanamiMio/UserScripts
// @version      0.1
// @description  在豆瓣图书页面提取图书信息并生成格式化文件名
// @author       Mio (with ChatGPT and DeepSeek)
// @match        https://book.douban.com/subject/*
// @icon         https://book.douban.com/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523193/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E6%96%87%E4%BB%B6%E5%90%8D%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/523193/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E6%96%87%E4%BB%B6%E5%90%8D%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

// 参考：电子书文件命名风格(https://github.com/bingmaxx/0x07/blob/master/2023/ebook-rename.md)

(function() {
    'use strict';

    // 获取图书信息
    const getBookInfo = () => {
        const info = {};
        const infoDiv = document.querySelector('#info');

        if (!infoDiv) return info; // 如果找不到 #info，直接返回空对象

        // 获取 #info 的所有子节点
        const nodes = infoDiv.childNodes;
        let currentLine = '';
        const lines = [];

        // 遍历子节点
        nodes.forEach(node => {
            if (node.nodeName === 'BR') {
                // 遇到 <br>，将当前行的文本添加到 lines 中
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = ''; // 重置当前行
                }
            } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                // 如果是文本节点或元素节点，提取其文本内容并添加到当前行
                currentLine += node.textContent.replace(/\s+/g, ' ').trim();
            }
        });

        // 处理最后一行（如果没有以 <br> 结尾）
        if (currentLine) {
            lines.push(currentLine);
        }

        console.debug(lines);

        // 定义信息的映射关系
        const keyMap = {
            '作者': 'author',
            '出版社': 'publisher',
            '副标题': 'subtitle',
            '译者': 'translator',
            '出版年': 'year',
            'ISBN': 'isbn'
        };

        // 逐行处理
        lines.forEach(line => {
            for (const [key, value] of Object.entries(keyMap)) {
                if (line.startsWith(key)) {
                    info[value] = line.replace(`${key}:`, '').trim();
                    break; // 找到匹配项后跳出循环
                }
            }
        });

        // 获取书名
        const titleElement = document.querySelector('h1 span');
        info.title = titleElement ? titleElement.textContent.trim() : '';

        return info;
    };

    // 格式化作者名
    const formatAuthor = (author) => {
        // 正则表达式匹配国别符号（如 [、【、(、（）以及括号内容，并提取第一个作者名
        const regex = /(?:\[[^\]]+\]|【[^】]+】|\([^\)]+\)|（[^）]+）)?\s*([^\/（）()，]+)/;
        const match = author.match(regex);
        let formattedAuthor = match ? match[1].trim() : '';

        // 如果作者名以 " 著"、" 译"、" 主编" 结尾，删去最后一个空格和之后的字
        const suffixRegex = /(\s著|\s译|\s主编)$/;
        if (suffixRegex.test(formattedAuthor)) {
            formattedAuthor = formattedAuthor.replace(suffixRegex, '');
        }

        return formattedAuthor;
    };

    // 格式化出版年
    const formatYear = (year) => {
        const [yy, mm] = year.split('-');
        const YY = yy.trim();
        const MM = mm ? mm.trim() : '';
        return MM ? `${YY}-${MM}` : YY;
    };

    // 处理特定的出版社替换
    const formatPublisher = (publisher) => {
        // 如果出版社以“三联书店”结尾，则替换为“三联书店”
        if (publisher.endsWith('三联书店')) {
            return '三联书店';
        }
        return publisher;
    };

    // 生成文件名
    const generateFileName = (info) => {
        const author = info.author ? formatAuthor(info.author) : '';
        const title = info.title + (info.subtitle ? `：${info.subtitle}` : '');
        const translator = info.translator ? `${formatAuthor(info.translator)}译_`: '';
        const publisher = formatPublisher(info.publisher);
        const year = info.year ? `_${formatYear(info.year)}` : '';
        const isbn = info.isbn ? `[${info.isbn}]` : '';
        return `${author}《${title}》${translator}${publisher}${year}${isbn}`;
    };

    // 创建文件名展示区域
    const createFileNameDisplay = (fileName) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.width = '100%';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = fileName;
        input.style.border = 'none';
        input.style.padding = '1px 0px';
        input.style.whiteSpace = 'nowrap';

        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'nowrap';
        span.style.fontFamily = getComputedStyle(input).fontFamily;
        span.style.fontSize = getComputedStyle(input).fontSize;
        document.body.appendChild(span);

        const adjustInputWidth = () => {
            span.textContent = input.value || ' ';
            input.style.width = `${span.offsetWidth + 1}px`;
        };

        adjustInputWidth();
        input.addEventListener('input', adjustInputWidth);

        const copyButton = document.createElement('button');
        copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyButton.style.border = 'none';
        copyButton.style.background = 'none';
        copyButton.style.cursor = 'pointer';
        copyButton.style.padding = '5px';
        copyButton.style.fontSize = '16px';
        copyButton.style.color = '#666';
        copyButton.style.flexShrink = '0';
        copyButton.style.display = 'flex';
        copyButton.style.alignItems = 'center';
        copyButton.style.justifyContent = 'center';
        // copyButton.style.height = '20px'; // 设置按钮高度
        copyButton.title = '复制';

        const tooltip = document.createElement('div');
        tooltip.textContent = '已复制';
        tooltip.style.position = 'fixed';
        tooltip.style.color = '#42bd56';
        tooltip.style.fontSize = '12px';
        tooltip.style.display = 'none';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
        document.body.appendChild(tooltip);

        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .fade-in {
            animation: fadeIn 0.2s ease-in-out;
            opacity: 1;
          }
          .fade-out {
            animation: fadeOut 0.2s ease-in-out;
            opacity: 0;
          }
        `;
        document.head.appendChild(style);

        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(input.value).then(() => {
            const buttonRect = copyButton.getBoundingClientRect();
            tooltip.style.left = `${buttonRect.right + 5}px`;
            tooltip.style.top = `${buttonRect.top - 15}px`;

            // 重置动画状态
            tooltip.style.display = 'block';
            tooltip.classList.remove('fade-out'); // 确保没有淡出的状态
            void tooltip.offsetWidth; // 强制重绘，确保重新触发动画
            tooltip.classList.add('fade-in');

            setTimeout(() => {
              tooltip.classList.remove('fade-in');
              tooltip.classList.add('fade-out');
            }, 1000);

            tooltip.addEventListener('animationend', (event) => {
              if (event.animationName === 'fadeOut') {
                tooltip.style.display = 'none';
                tooltip.classList.remove('fade-out');
              }
            }, { once: true }); // 确保只触发一次
          });
        });

        container.appendChild(input);
        container.appendChild(copyButton);

        return container;
    };

    // 主函数
    const main = (subjectWrapDiv) => {
        const bookInfo = getBookInfo();
        if (bookInfo.title && bookInfo.publisher) {
            const fileName = generateFileName(bookInfo);
            const fileNameDisplay = createFileNameDisplay(fileName);
            console.log(JSON.stringify(bookInfo));
            subjectWrapDiv.appendChild(fileNameDisplay);
        }
    };

    // 使用 MutationObserver 监听页面变化，找到 .subjectwrap 后再检查图书信息
    const observer = new MutationObserver((mutations, obs) => {

        mutations.forEach(mutation => {
            // 检查新增的节点
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.subjectwrap')) {
                    main(node);
                    obs.disconnect(); // 停止观察
                }
            });
        });
    });

    // 开始观察页面变化
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
