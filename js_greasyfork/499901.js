// ==UserScript==
// @name         小报童悬浮目录
// @namespace    http://tampermonkey.net/
// @version      2024-07-06
// @description  为小报童文章生成目录
// @author       Huazi
// @match        https://xiaobot.net/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaobot.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499901/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499901/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toc;

    function generateTOC() {
        toc = document.createElement('div');
        toc.id = 'table-of-contents';
        toc.style.padding = '10px';
        toc.style.background = '#fffdfc';
        toc.style.borderRadius = '6px';
        toc.style.fontSize = '14px';
        toc.style.position = '-webkit-sticky'; // Safari 兼容
        toc.style.position = 'sticky'; // 粘性布局
        toc.style.top = '10px';
        toc.style.marginLeft = '15px';
        toc.style.width = '95%'; // 宽度与父元素相同
        toc.style.maxWidth = '90%'; // 宽度与父元素相同
        toc.style.marginTop = '20px'; // 初始位置，略低于 share-paper
        toc.style.transition = 'top 0.3s ease-out'; // 添加过渡效果

        const tocTitle = document.createElement('h2');
        tocTitle.innerText = '目录';
        tocTitle.style.fontSize = '16px';
        toc.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.style.listStyle = 'none';
        tocList.style.paddingLeft = '0';
        toc.appendChild(tocList);

        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            const anchor = document.createElement('a');
            const anchorName = `toc-${index}`;
            anchor.name = anchorName;
            heading.insertAdjacentElement('beforebegin', anchor);

            const tocItem = document.createElement('li');
            tocItem.style.marginLeft = `${(parseInt(heading.tagName[1]) - 1) * 20}px`;
            const tocLink = document.createElement('a');
            tocLink.href = `#${anchorName}`;
            tocLink.innerText = heading.innerText;
            tocLink.style.textDecoration = 'none';
            tocLink.style.color = '#000';
            switch (heading.tagName.toLowerCase()) {
                case 'h1':
                    tocLink.style.fontSize = '14px';
                    tocLink.style.lineHeight = '2.0';
                    tocLink.style.fontWeight = '1000';
                    tocLink.style.color = '#000000';
                    break;
                case 'h2':
                    tocLink.style.fontSize = '12px';
                    tocLink.style.lineHeight = '1.5';
                    tocLink.style.color = '#9d9d9d';
                    break;
                default:
                    tocLink.style.fontSize = '12px';
                    tocLink.style.lineHeight = '1.2';
                    tocLink.style.color = '#9d9d9d';
                    break;
            }
            tocLink.addEventListener('mouseover', () => {
                tocLink.style.color = '#B14B43';
            });
            tocLink.addEventListener('mouseout', () => {
                switch (heading.tagName.toLowerCase()) {
                    case 'h1':
                        tocLink.style.color = '#000000'; // 确保 H1 标题恢复正确的颜色
                        break;
                    case 'h2':
                        tocLink.style.color = '#9d9d9d';
                        break;
                    default:
                        tocLink.style.color = '#9d9d9d';
                        break;
                }
            });
            tocItem.appendChild(tocLink);
            tocList.appendChild(tocItem);
        });

        const sharePaper = document.querySelector('.share-paper');
        if (sharePaper) {
            sharePaper.style.position = 'relative'; // share-paper 设置为相对定位
            sharePaper.parentNode.insertBefore(toc, sharePaper.nextSibling); // 将目录添加到 share-paper 的下方
        } else {
            console.error('Share paper element not found.');
        }
    }

    function initTOC() {
        if (document.querySelector('.share-paper')) {
            generateTOC();
        } else {
            setTimeout(initTOC, 500); // 如果没找到元素，500毫秒后重试
        }
    }

    window.addEventListener('DOMContentLoaded', initTOC);
    window.addEventListener('load', initTOC);
})();