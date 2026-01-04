// ==UserScript==
// @name           漫画社写真浏览增强
// @namespace      mh4_cc_img_helper
// @version        1.1.1
// @description    功能如下：1、为具体写真内增加跳页
// @author         therdes
// @match          https://www.mh4.cc/*/1-*.html
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452539/%E6%BC%AB%E7%94%BB%E7%A4%BE%E5%86%99%E7%9C%9F%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452539/%E6%BC%AB%E7%94%BB%E7%A4%BE%E5%86%99%E7%9C%9F%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取唯一标识
    function getHashId(url) {
        const backIdx = url.lastIndexOf('/');
        const frontIdx = url.lastIndexOf('/', backIdx - 1);
        return url.substring(frontIdx + 1, backIdx);
    }

    // 获取当前页码
    function getCurrentPage(url) {
        return parseInt(url.substring(url.indexOf('1-') + 2, url.indexOf('.html')));
    }

    // 对于首页和中间页，获取总页数
    function findTotalPageForFirstAndInnerPage(nextPageEle) {
        const hrefEle = nextPageEle.children[0];
        const hrefEleText = hrefEle.innerText;
        return parseInt(hrefEleText.substring(hrefEleText.indexOf('/') + 1, hrefEleText.length - 1))
    }

    // 对于尾页，获取总页数
    function findTotalPageForLastPage(prevPageEle) {
        const hrefEle = prevPageEle.children[0];
        const hrefEleHref = hrefEle.href;
        return getCurrentPage(hrefEleHref) + 1;
    }

    // 构建跳页按钮
    function buildJumpElement(bottomReadmenuDiv, hashId, totalPage, curPage) {
        const jumpDiv = document.createElement('div');
        jumpDiv.className = 'readmenu';

        for (let i = 0; i < totalPage; ++i) {
            const curEle = document.createElement('b');
            curEle.className = 'wave wave-effect';

            const curHref = document.createElement('a');
            curHref.href = '/' + hashId + '/' + '1-' + (i+1) + '.html';
            curHref.innerText = '第' + (i+1) + '页';
            if (curPage && curPage === (i + 1)) {
                curHref.style.color = 'red';
            }

            curEle.appendChild(curHref);
            jumpDiv.appendChild(curEle);
        }

        bottomReadmenuDiv.insertAdjacentElement('afterend', jumpDiv);
    }

    // 获取当前页面地址
    const curPageUrl = window.location.href;

    // 获取 readmenu 元素列表
    const readmenuEle = document.getElementsByClassName('readmenu');
    // 仅需处理顶部的元素
    const topReadmenuDiv = readmenuEle[0];

    // 顶部 readmenu 中有多少个子元素
    const topReadmenuDivChildEleCount = topReadmenuDiv.childElementCount;
    let totalPage = -1;
    if (topReadmenuDivChildEleCount === 1) {
        // 当前页可能是首页或尾页
        // 获取仅有的元素的文字进行判断
        const topReadmenuDivChildInnerText = topReadmenuDiv.children[0].innerText;
        if (topReadmenuDivChildInnerText === '上一页') {
            // 表示为尾页
            totalPage = findTotalPageForLastPage(topReadmenuDiv.children[0]);
        } else if (topReadmenuDivChildInnerText.startsWith('下一页')) {
            // 表示为首页
            totalPage = findTotalPageForFirstAndInnerPage(topReadmenuDiv.children[0]);
        }
    } else if (topReadmenuDivChildEleCount === 2) {
        // 当前页可能为：1.包含回起点的首页；2.包含回起点的尾页；3.无回起点的中间页
        // 判断第一个按钮的文字
        const topReadmenuDivChildInnerText = topReadmenuDiv.children[0].innerText;
        if (topReadmenuDivChildInnerText === '回起点') {
            // 判断第二个按钮的文字
            const topReadmenuDivSecondChildInnerText = topReadmenuDiv.children[1].innerText;
            if (topReadmenuDivSecondChildInnerText === '上一页') {
                totalPage = findTotalPageForLastPage(topReadmenuDiv.children[1]);
            } else if (topReadmenuDivSecondChildInnerText.startsWith('下一页')) {
                totalPage = findTotalPageForFirstAndInnerPage(topReadmenuDiv.children[1]);
            }
        } else if (topReadmenuDivChildInnerText === '上一页') {
            totalPage = findTotalPageForFirstAndInnerPage(topReadmenuDiv.children[1]);
        }
    } else if (topReadmenuDivChildEleCount === 3) {
        // 当前页为中间页
        totalPage = findTotalPageForFirstAndInnerPage(topReadmenuDiv.children[2]);
    }

    if (totalPage > 0) {
        const hashId = getHashId(curPageUrl);
        const curPage = getCurrentPage(curPageUrl);
        buildJumpElement(readmenuEle[1], hashId, totalPage, curPage);
    }
})();