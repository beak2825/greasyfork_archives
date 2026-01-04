// ==UserScript==
// @name               Detect Links in Text
// @name:zh-CN         识别文本中的链接
// @name:zh-TW         識別文本中的鏈接
// @namespace          http://tampermonkey.net/
// @version            0.1.2
// @description        Click on URLs within webpage text and convert them into clickable links.
// @description:zh-CN  点击网页文本中的URL并将其转换为可点击的链接
// @description:zh-TW  點擊網頁文本中的URL並將其轉換為可點擊的鏈接
// @author             yinlili
// @include            *
// @icon               https://img.icons8.com/external-tal-revivo-fresh-tal-revivo/28/external-online-web-link-attach-with-url-information-text-fresh-tal-revivo.png
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/526264/%E8%AD%98%E5%88%A5%E6%96%87%E6%9C%AC%E4%B8%AD%E7%9A%84%E9%8F%88%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/526264/%E8%AD%98%E5%88%A5%E6%96%87%E6%9C%AC%E4%B8%AD%E7%9A%84%E9%8F%88%E6%8E%A5.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const urlPattern = /https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/(?:[-\w.!$&*+~]|%[0-9A-Fa-f]{2})*)*(?:\?(?:[-._~!$&'()*+,;=:@\/?a-zA-Z0-9]|%[0-9A-Fa-f]{2})*)?(?:#(?:[-._~!$&'()*+,;=:@\/?a-zA-Z0-9]|%[0-9A-Fa-f]{2})*)?/g;

    let element;

    function processTextNode(node) {
        const text = node.textContent;

        if (urlPattern.test(text)) {

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            text.replace(urlPattern, (url, index) => {
                if (index > lastIndex) {
                    const nonUrlPart = document.createTextNode(text.slice(lastIndex, index));
                    fragment.appendChild(nonUrlPart);
                }

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = url;
                link.style.color = 'linktext';
                link.style.textDecoration = 'underline';
                fragment.appendChild(link);

                lastIndex = index + url.length;
                return '';
            });

            if (lastIndex < text.length) {
                const remainingText = document.createTextNode(text.slice(lastIndex));
                fragment.appendChild(remainingText);
            }

            node.parentNode.replaceChild(fragment, node);
        }
    }

    document.addEventListener('selectstart', (event) => {
        element = event.target;
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0 && element && element.nodeType === Node.TEXT_NODE && element.textContent.trim()) {
            processTextNode(element);
            element = null;
        }
    });

})();