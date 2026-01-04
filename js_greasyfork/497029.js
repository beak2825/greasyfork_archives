// ==UserScript==
// @name         Feishu Doc Markdown Scraper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  ⚡功能：以Markdown格式复制文档内容； ⚡使用方法：点击[准备复制]，然后等自动滑动到底部后，点击[复制]即可； ⚡因为飞书文档本身不支持导出Markdown，所以做了本插件，调试时发现飞书的文档加载是随着页面滚动而动态加载的，所以最终只能这么实现了。。
// @author       Yearly
// @match        *://*.feishu.cn/docx/*
// @match        *://*.feishu.cn/wiki/*
// @license      AGPL-v3.0
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @homepage     https://greasyfork.org/zh-CN/scripts/497029-feishu-doc-markdown-scraper
// @icon    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAZlBMVEVHcEwzcP8A17kzcP8zcP8A1rkA1rkzb/8zcP8A17kA1rkKwMgzcP8dptwA1rkzcP8zcP8A1rn///80a/8dZv8A27UMYf/Q2v8pa/8qhPMhoeImkOwJy8K7zf+Lqf/m7P9+of9UhP95OKn5AAAAEHRSTlMALihRmXqzT7BP3kY9r2zZpb+oRwAAAMVJREFUOI2tktkSgjAMRVnKIqASAtiyjf7/T9oBQhmaog+c13uabep5/yBSG+Gb/FmyFJQXfF4KEkKHkJKQXCTULcEL9VgRH1Zot7yaJCfI92tldMwga+JEkCdbzC0m6RaWISlD5Nd8ySVVXacQmUPN82E/NBroHafGroGFOyugohyAEXT3YcvhYQm6vHkPEB8F034liw4CWMR7AfvGNoJfQrRvoRzC9qtxsIVcC37pLpHNawhzp0MNuoQfJithftsReFfwBU5wL6UE2LbbAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/497029/Feishu%20Doc%20Markdown%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/497029/Feishu%20Doc%20Markdown%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToMarkdown(html) {
        // 首先使用正则表达式进行简单的标签替换
        let markdown = html
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<h1.*?>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2.*?>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3.*?>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<h4.*?>(.*?)<\/h3>/gi, '#### $1\n')
        .replace(/<h5.*?>(.*?)<\/h3>/gi, '##### $1\n')
        .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<code>(.*?)<\/code>/gi, '`$1`');

        // 使用DOM解析处理更复杂的标签和结构
        const parser = new DOMParser();
        const doc = parser.parseFromString(markdown, 'text/html');

        // 处理列表嵌套
        function countParents(node) {
            let depth = 0;
            while (node.parentNode) {
                node = node.parentNode;

                if(node.tagName){
                    if (node.tagName.toUpperCase() === 'UL' || node.tagName.toUpperCase() === 'OL') {
                        depth++;
                    }
                }
            }
            return depth;
        }
        // 处理列表
        function processList(element) {
            let md = '';
            let depth = countParents(element);
            let index = null;
            if (element.tagName.toUpperCase() === 'OL'){
                index = 1;
            }
            element.childNodes.forEach(node => {
                if (node.tagName && node.tagName.toLowerCase() === 'li') {
                    if(index != null) {
                        md += '<span> </span>'.repeat(depth*2) + `${index++}\. ${node.textContent.trim()}\n`;
                    } else {
                        md += '<span> </span>'.repeat(depth*2) + `- ${node.textContent.trim()}\n`;
                    }
                }
            });
            return md;
        }
        let listsArray = Array.from( doc.querySelectorAll('ol, ul'));
        listsArray.reverse();
        listsArray.forEach(list => {
            list.outerHTML = processList(list);
        });

        // heading 处理
        doc.querySelectorAll('div.heading').forEach(multifile => {
            if ( multifile.classList.contains("heading-h1") ) {
                multifile.innerHTML = `\n\n# ${multifile.textContent}\n`;
            } else if (multifile.classList.contains("heading-h2")) {
                multifile.innerHTML = `\n\n## ${multifile.textContent}\n`;
            } else if (multifile.classList.contains("heading-h3")) {
                multifile.innerHTML = `\n\n### ${multifile.textContent}\n`;
            } else if (multifile.classList.contains("heading-h4")) {
                multifile.innerHTML = `\n\n#### ${multifile.textContent}\n`;
            } else if (multifile.classList.contains("heading-h5")) {
                multifile.innerHTML = `\n\n##### ${multifile.textContent}\n`;
            }
        });

        // img处理
        doc.querySelectorAll("img[src]").forEach(multifile => {
            multifile.innerHTML = `\n![image](${multifile.src})\n`
        });

        // 文件框处理
        doc.querySelectorAll("div.chat-uikit-multi-modal-file-image-content").forEach(multifile => {
            multifile.innerHTML = multifile.innerHTML
                .replace(/<span class="chat-uikit-file-card__info__size">(.*?)<\/span>/gi, '\n$1');
            multifile.innerHTML = `\n\`\`\`file\n${multifile.textContent}\n\`\`\`\n`;
        });

        // code-block
        doc.querySelectorAll("div.docx-code-block-container > div.docx-code-block-inner-container").forEach(codearea => {
            let header = codearea.querySelector("div.code-block-header .code-block-header-btn-con");
            let language = header.textContent;
            codearea.querySelector("div.code-block-header").remove();
            codearea.querySelectorAll('span[data-enter="true"]').forEach(item_enter => {
                item_enter.outerHTML = "<p>\n</p>";
            });
            let code_content = codearea.innerText.toString();
            codearea.outerHTML = `\n\`\`\`${language}\n${code_content}\n\`\`\`\n`;
        });

        // 获取最终Markdown文本
        markdown = doc.body.innerText ||doc.body.textContent;

        return markdown.replaceAll(":", "\\:");;
    }

    // 等待目标DIV加载完成
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化数据
    const dataBlocks = new Map();
    let isScrolling = false;

    // 获取所有的 data-block-id 元素并存储其内容
    function scrapeDataBlocks() {
        const blocks = document.querySelectorAll('#docx > div  div[data-block-id]');
        blocks.forEach(block => {
            const id = block.getAttribute('data-block-id');
            if (!dataBlocks.has(id)) {

                const type = block.getAttribute('data-block-type');
                //  dataBlocks.set(id, block.innerHTML);
                // dataBlocks.set(id, block.innerText);
                if(type == "page") {
                    dataBlocks.set(id, convertToMarkdown(block.querySelector('div.page-block-content').innerHTML));
                } else if (type != "back_ref_list") {
                    dataBlocks.set(id, convertToMarkdown(block.innerHTML)) ;
                }
                //console.log( "add:" + id);
            }
        });
    }

    // 滚动页面并获取所有的 data-block-id 元素
    function scrollAndScrape(container) {
        if (isScrolling) return;
        isScrolling = true;
        let currentY = 0;
        let percent = 0;

        function scroll() {
            currentY += container.clientHeight / 3;
            container.scrollTo({
                top: currentY,
                behavior: "smooth",
                duration: 333,
            });

            let curPercent = (currentY + container.clientHeight) / container.scrollHeight;
            curPercent = (Math.min(1, curPercent * curPercent) * 100);
            percent = Math.max((curPercent + percent)/2, percent)
            //console.log( container.scrollTop.toFixed() +"+"+ container.clientHeight.toFixed() +" vs "+ container.scrollHeight.toFixed() + ", "+ percent.toFixed(1) + "%" );
            document.querySelector('button#scrollCopyButton').textContent = '请勿操作, 正在扫描内容: ' + percent.toFixed(1) + "%";
            document.querySelector('button#scrollCopyButton').disabled = true;
            document.querySelector('button#scrollCopyButton').style.cursor="not-allowed";
        }

        function scrollData() {
            scrapeDataBlocks();
            console.log( 'scrolling '+ container.scrollTop.toFixed());
            if (Math.max(container.scrollTop,currentY) + container.clientHeight >= container.scrollHeight) {
                isScrolling = true;
                createCopyButton(true);

                return;
            }
            scroll();
            setTimeout(scroll, 500);
            setTimeout(scroll, 1000);
            setTimeout(scrollData, 1600);// 控制滚动速度，防止太快导致页面未加载完
        }
        setTimeout(scrollData, 500);;
    }

    // 点击开始扫描事件
    function SyncListener() {
        console.log("click sync");
        scrollAndScrape(document.querySelector('#docx > div'));
    }

    // 点击复制事件
    function CopyListener() {
        console.log("click copy");
        const allContent = Array.from(dataBlocks.entries())
        .sort((a, b) => a[0] - b[0])
        .map(entry => entry[1])
        .join('\n');
        GM_setClipboard(allContent);
        alert('内容已复制到剪贴板');
    }

    // 创建复制按钮
    function createCopyButton(mode=false) {
        let button = document.querySelector('button#scrollCopyButton');
        const md_icon = '<svg xmlns="http://www.w3.org/2000/svg" style="height:15px; padding-right:5px; fill:#fff; display:inline;" viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>'

        if(!button) {
            button = document.createElement('button');
            button.id = 'scrollCopyButton';
            button.innerHTML = md_icon + '准备复制';
            document.body.appendChild(button);

            GM_addStyle(`
            #scrollCopyButton {
                position: fixed;
                top: 15px;
                right: 40%;
                padding: 6px 18px;
                font-size: 16px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                place-items: center;
                box-shadow: 0 0 3px #1117;
            }
            #scrollCopyButton:hover {
                background: #0056b3;
            }
           `);

            button.addEventListener('click', SyncListener);
        }

        if(!mode) {
            return;
        }

        button.disabled = false;
        button.style.cursor="pointer";
        button.innerHTML = md_icon + '复制';

        button.removeEventListener('click', SyncListener);
        button.addEventListener('click', CopyListener);

    }

    // 主函数
    waitForElement('#docx > div', (container) => {
        createCopyButton(false);
    });

})();
