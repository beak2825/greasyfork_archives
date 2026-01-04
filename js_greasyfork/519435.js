// ==UserScript==
// @name         必应搜索Bing精简加样式优化加去广告
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  只有3kb,必应搜索Bing精简加样式优化加去广告。
// @author       极简实用
// @match        https://cn.bing.com/search?*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/519435/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2Bing%E7%B2%BE%E7%AE%80%E5%8A%A0%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%E5%8A%A0%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519435/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2Bing%E7%B2%BE%E7%AE%80%E5%8A%A0%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%E5%8A%A0%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改 h2 标签字体大小
    const h2Elements = document.querySelectorAll('h2');
    for (const h2 of h2Elements) {
        h2.style.fontSize = '18px'; // 设置字体大小为18px
    }

    // 删除所有 class 为 b_ad 的 li 元素
    const adElements = document.querySelectorAll('li.b_ad');
    for (const li of adElements) {
        li.remove();
    }

    // 删除 class 为 b_rs 的 div 元素
    const rsElements = document.querySelectorAll('div.b_rs');
    rsElements.forEach(div => div.remove());

    // 删除 id 为 df_listaa 的 div 元素
    const dfListaaElement = document.getElementById('df_listaa');
    if (dfListaaElement) {
        dfListaaElement.remove();
    }

    // 删除 class 为 b_msg 的 li 元素
    const msgElements = document.querySelectorAll('li.b_msg');
    msgElements.forEach(li => li.remove());

    // 删除不必要的 div 元素
    const divIDsToRemove = ['b_pole', 'b_tween', 'est_switch', 'id_h', 'b_footer'];
    divIDsToRemove.forEach(id => {
        const div = document.getElementById(id);
        if (div) {
            div.remove();
        }
    });

    // 删除所有 class 为 b_tpcn 的 div
    const b_tpcnElements = document.querySelectorAll('div.b_tpcn');
    b_tpcnElements.forEach(div => {
        const tpttElement = div.querySelector('div.tptt');
        if (tpttElement) {
            const tpttText = tpttElement.textContent.trim(); // 获取tptt的文本内容

            // 找到对应的 h2 标签并检查内容
            const h2 = div.closest('li.b_algo').querySelector('h2 a');
            if (h2) {
                // 检查 a 标签内容中是否已有 tptt 的内容
                if (!h2.innerHTML.includes(tpttText)) { // 使用 innerHTML 检查
                    h2.innerHTML += ' ' + tpttText; // 使用 innerHTML 添加内容
                }
            }
        }
        div.remove(); // 删除 b_tpcn 元素
    });

    // 删除所有包含 data-partnertag 的 ul 元素
    const partnerTagElements = document.querySelectorAll('ul[data-partnertag]');
    partnerTagElements.forEach(ul => ul.remove());

    // 删除所有包含 p class="b_lineclamp2 b_algoSlug" 的 li class="b_algo" 的元素
    const algoElements = document.querySelectorAll('li.b_algo');
    algoElements.forEach(li => {
        const pElement = li.querySelector('p.b_lineclamp2.b_algoSlug');
        if (pElement) {
            li.remove();
        }
    });

    // 添加自定义样式以隐藏水平滚动条
    const style = document.createElement('style');
    style.textContent = `
        #b_results > .b_algo {
            padding: 0px; /* 设置 .b_algo 的 padding 为 0 */
        }
        #b_content {
            padding-top: 0px !important; /* 设置 b_content 的顶部内边距为 0 */
            padding-bottom: 0px !important; /* 设置 b_content 的底部内边距为 0 */
        }
        body, html {
            overflow-x: hidden; /* 隐藏水平滚动条 */
        }
    `;
    document.head.appendChild(style);
})();
