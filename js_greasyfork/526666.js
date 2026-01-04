// ==UserScript==
// @name         谷歌学术在当前页按照被引用次数排序
// @namespace    http://tampermonkey.net/
// @version      2025.02.13.005
// @description  当前页!当前页!当前页!只处理当前页信息。建议打开每页20条记录
// @author       You
// @include      https://scholar.google.com.*/*
// @match        https://scholar.google.com/scholar?*
// @match        https://sc.panda985.com/scholar?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526666/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%8C%89%E7%85%A7%E8%A2%AB%E5%BC%95%E7%94%A8%E6%AC%A1%E6%95%B0%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526666/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%8C%89%E7%85%A7%E8%A2%AB%E5%BC%95%E7%94%A8%E6%AC%A1%E6%95%B0%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    /**
     * 从节点中提取引用次数和 rimf 值，并计算综合得分
     * @param {HTMLElement} node - 要处理的节点
     * @returns {number} 综合得分
     */
    function getCiteCount(node) {
        const citeText = node.querySelector('a[href*="cites"]')?.textContent || "0";
        const citeInt = parseInt(citeText.match(/(\d+)/)?.[1], 10) || 0;
        const rimf = parseInt(node.querySelector('.rimf')?.getAttribute("val"), 10) || 0;
        return citeInt * 1000 + rimf;
    }
    let sortCount = 0
    /**
     * 对元素进行排序
     */
    function sortElements() {
        const gsResCclMid = document.getElementById('gs_res_ccl_mid');
        if (!gsResCclMid) {
            console.error('未找到 gs_res_ccl_mid 元素');
            return;
        }

        const gsOrElements = [...gsResCclMid.querySelectorAll('.gs_or')]
            .map(node => ({ node, citeCount: getCiteCount(node) }));

        const gsOrElementsSorted = [...gsOrElements].sort((a, b) => b.citeCount - a.citeCount);

        // 检查是否需要重新排序
        const needResort = gsOrElements.some((element, index) => element.node !== gsOrElementsSorted[index].node);

        if (needResort) {
            console.log("重排", ++sortCount)
            gsResCclMid.innerHTML = '';
            gsResCclMid.append(...gsOrElementsSorted.map(item => item.node)); // 重新添加排序后的节点
            setTimeout(sortElements, 1000);
        } else {
            setTimeout(sortElements, 5000);
        }
    }

    sortElements();

})();