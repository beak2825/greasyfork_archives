// ==UserScript==
// @name         lodash左侧滚动条滚动到当前查看方法的位置
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.lodashjs.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @icon         https://www.lodashjs.com/icons/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/403383/lodash%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E6%9F%A5%E7%9C%8B%E6%96%B9%E6%B3%95%E7%9A%84%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/403383/lodash%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E6%9F%A5%E7%9C%8B%E6%96%B9%E6%B3%95%E7%9A%84%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const name = location.pathname.split('.')[1]; // 当前页面展示的方法名

    $(function(){


    // document.querySelectorAll('.toc-container code')
    $('.toc-container code').each((index, item) => {
        // 获取code标签下的文本
        const text = $(item).text();

        if (text.includes('_.')) {
            // 只获取文本中方法名的字段
            const str = text.replace(/_./, '');

            // 若当前方法和页面url的方法名一致，则设置样式，并让左侧列表容器的滚动条滚动到当前元素
            if (str === name) {
                $(item).css({
                    'color': '#00bfff',
                    'font-size': '1.2em'
                });

                $(item)[0].scrollIntoView({
                    block: 'center'
                });
            }
        }
    });

         })
    // Your code here...
})();