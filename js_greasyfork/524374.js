// ==UserScript==
// @name         x1080x提取品番并列出缩略图
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  提取品番并列出缩略图
// @author       HX
// @match        https://*.x567x.me/forum.php?mod=viewthread&tid=*
// @match        https://*.x567x.me/home.php?mod=spacecp&ac=pm&from=script
// @match        https://x567x.me/forum.php?mod=viewthread&tid=*
// @match        https://x567x.me/home.php?mod=spacecp&ac=pm&from=script
// @match        https://*.x999x.me/forum.php?mod=viewthread&tid=*
// @match        https://*.x999x.me/home.php?mod=spacecp&ac=pm&from=script
// @match        https://x999x.me/forum.php?mod=viewthread&tid=*
// @match        https://x999x.me/home.php?mod=spacsecp&ac=pm&from=script
// @icon         https://www.google.com/s2/favicons?domain=www.x999x.me
// @grant        GM_xmlhttpRequest
// @connect      av-wiki.net
// @connect      sougouwiki.com
// @connect      google.com
// @license      HX
// @require      https://cdn.jsdelivr.net/npm/encoding-japanese@2.2.0/encoding.min.js
// @downloadURL https://update.greasyfork.org/scripts/524374/x1080x%E6%8F%90%E5%8F%96%E5%93%81%E7%95%AA%E5%B9%B6%E5%88%97%E5%87%BA%E7%BC%A9%E7%95%A5%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/524374/x1080x%E6%8F%90%E5%8F%96%E5%93%81%E7%95%AA%E5%B9%B6%E5%88%97%E5%87%BA%E7%BC%A9%E7%95%A5%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 找到第一个 class="t_f" 的元素
    const targetElement = document.querySelector('.t_f');
    if (targetElement) {
        console.log('找到目标元素:', targetElement);

        const keyword = '品番：';
        const walker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT, null, false);
        let foundTextNode = null;

        while (walker.nextNode()) {
            if (walker.currentNode.nodeValue.includes(keyword)) {
                foundTextNode = walker.currentNode;
                break;
            }
        }

        if (foundTextNode) {
            console.log('找到包含关键词的文本节点:', foundTextNode.nodeValue);

            const keywordIndex = foundTextNode.nodeValue.indexOf(keyword) + keyword.length;
            let value = foundTextNode.nodeValue.slice(keywordIndex).trim(); // 初始提取文本内容

            let nextSibling = foundTextNode.nextSibling;

            // 遍历后续兄弟节点
            while (nextSibling) {
                if (nextSibling.nodeName === 'BR') {
                    break; // 遇到 <br> 标签停止
                } else if (nextSibling.nodeType === Node.TEXT_NODE) {
                    value += nextSibling.nodeValue.trim(); // 追加文本内容
                } else if (nextSibling.nodeType === Node.ELEMENT_NODE) {
                    value += nextSibling.textContent.trim(); // 忽略标签，获取内容
                }
                nextSibling = nextSibling.nextSibling;
            }

            console.log('提取的品番值:', value);

            const searchUrl = `https://av-wiki.net/?s=${encodeURIComponent(value)}`;
            console.log('请求的搜索链接:', searchUrl);

            const dynamicContainer = document.createElement('div');
            dynamicContainer.style.marginTop = '20px';
            targetElement.insertBefore(dynamicContainer, targetElement.firstChild);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: function (response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const actressNameElement = doc.querySelector('.actress-name');

                        if (actressNameElement) {
                            const actressName = actressNameElement.textContent.trim();
                            console.log('演员名字:', actressName);

                            // 使用 Shift-JIS 编码演员名字
                            const encodedActressName = Encoding.urlEncode(
                                Encoding.convert(actressName, 'EUC-JP', 'UNICODE')
                            );
                            const actressLink = document.createElement('a');
                            actressLink.href = `https://seesaawiki.jp/w/sougouwiki/d/${encodedActressName}`;
                            actressLink.textContent = `演员名字: ${actressName}`;
                            actressLink.style.fontSize = '16px';
                            actressLink.style.color = '#333';
                            actressLink.style.display = 'block';
                            actressLink.style.marginTop = '10px';
                            actressLink.target = '_blank'; // 新标签页打开

                            // 检查 sougouwiki 页面内容
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: actressLink.href,
                                onload: function (wikiResponse) {
                                    if (wikiResponse.status === 404) {
                                        console.log('页面未找到，修改链接为 Google 搜索');
                                        actressLink.href = `https://www.google.com/search?q=sougouwiki${actressName}`;
                                    }
                                },
                                onerror: function () {
                                    console.log('检查 sougouwiki 页面失败');
                                }
                            });

                            dynamicContainer.appendChild(actressLink);
                        } else {
                            console.log('未找到 class="actress-name" 的元素');
                        }

                        const eyeCatchElements = doc.querySelectorAll('.eye-catch img');
                        if (eyeCatchElements.length > 0) {
                            console.log('找到的 eye-catch 元素数量:', eyeCatchElements.length);

                            eyeCatchElements.forEach((img) => {
                                const imgSrc = img.getAttribute('data-src');
                                if (imgSrc) {
                                    const newImage = document.createElement('img');
                                    newImage.src = imgSrc;
                                    newImage.alt = img.alt;
                                    newImage.style.width = '150px';
                                    newImage.style.height = 'auto';
                                    newImage.style.margin = '5px';
                                    dynamicContainer.appendChild(newImage);
                                }
                            });
                        } else {
                            console.log('未找到包含 "eye-catch" 的元素');
                        }
                    } else {
                        console.log('请求失败，状态码:', response.status);
                    }
                },
                onerror: function () {
                    console.log('请求失败，请检查网络或链接');
                }
            });
        } else {
            console.log('未找到包含关键词的文本节点');
        }
    } else {
        console.log('未找到 class="t_f" 的元素');
    }
})();
