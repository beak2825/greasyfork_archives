// ==UserScript==
// @name         色花堂-屏蔽搜索结果中的求片问答悬赏区帖子标题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在搜索结果中屏蔽“求片问答悬赏区”帖子标题及“内容隐藏需要，请点击进去查看”提示，替换为█████████。
// @author       南竹 & ChatGPT
// @match        https://www.sehuatang.org/search.php?mod=forum&searchid=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534264/%E8%89%B2%E8%8A%B1%E5%A0%82-%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E6%B1%82%E7%89%87%E9%97%AE%E7%AD%94%E6%82%AC%E8%B5%8F%E5%8C%BA%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/534264/%E8%89%B2%E8%8A%B1%E5%A0%82-%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E6%B1%82%E7%89%87%E9%97%AE%E7%AD%94%E6%82%AC%E8%B5%8F%E5%8C%BA%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标文字替换符号
    const MASK_TEXT = '█████████';

    // 获取搜索结果列表中所有的<li class="pbw">元素
    // 每个<li>代表一个帖子条目
    const items = document.querySelectorAll('li.pbw');

    items.forEach(item => {
        // 判断该帖子是否属于“求片问答悬赏区”
        // 通过查找item内部是否有 a.xi1 且文本为“求片问答悬赏区”
        const categoryLink = item.querySelector('span > a.xi1');
        if (categoryLink && categoryLink.textContent.trim() === '求片问答悬赏区') {
            // 屏蔽帖子的标题，通常在 h3.xs3 > a 中
            const titleLink = item.querySelector('h3.xs3 > a');
            if (titleLink) {
                titleLink.textContent = MASK_TEXT;
            }

            // 屏蔽“内容隐藏需要，请点击进去查看”所在的<p>标签
            // 该文字是单独的一段<p>节点
            // 在当前帖子的li元素中的所有<p>中查找匹配文本
            const paragraphList = item.querySelectorAll('p');
            paragraphList.forEach(p => {
                if(p.textContent.trim() === '内容隐藏需要，请点击进去查看') {
                    p.textContent = MASK_TEXT;
                }
            });
        }
    });

})();
