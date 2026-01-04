// ==UserScript==
// @name         Boss直聘职位描述远程兼职关键词高亮显示
// @namespace    http://tampermonkey.net/
// @version      2024-04-02-1653
// @description  有问题联系：qq183180915
// @author       余默
// @match        https://www.zhipin.com/*
// @icon         https://img.bosszhipin.com/beijin/mcs/banner/3e9d37e9effaa2b6daf43f3f03f7cb15cfcd208495d565ef66e7dff9f98764da.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491337/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%8F%8F%E8%BF%B0%E8%BF%9C%E7%A8%8B%E5%85%BC%E8%81%8C%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491337/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%8F%8F%E8%BF%B0%E8%BF%9C%E7%A8%8B%E5%85%BC%E8%81%8C%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        // 在这里编写需要在页面加载完毕后执行的 JavaScript 代码

        setInterval(() => {
            const desc = document.querySelector('p.desc');
            let txt = desc.innerHTML;
            // console.log(txt);
            // 获取文本内容
            // const textContent = document.getElementById('content').innerHTML;

            // 匹配包含“远程”的关键词
            // const keywords = txt.match(/远程/g);
            // const keywords2 = txt.match(/兼职/g);

            // const regex = /兼([\s\S]*?)职/g;
            // const matches = txt.match(regex);
            // 输出匹配到的内容
            // console.log(matches);
            txt = txt.replace(/兼<span class="(.*?)">(.*?)<\/span>职/g, '兼职');
            txt = txt.replace(/远<span class="(.*?)">(.*?)<\/span>程/g, '远程');
            txt = txt.replace(/线<span class="(.*?)">(.*?)<\/span>上/g, '线上');
            txt = txt.replace(/副<span class="(.*?)">(.*?)<\/span>业/g, '副业');

            txt = txt.replace(/兼<span class="(.*?)">职<\/span>/g, '兼职');
            txt = txt.replace(/远<span class="(.*?)">程<\/span>/g, '远程');
            txt = txt.replace(/线<span class="(.*?)">上<\/span>/g, '线上');
            txt = txt.replace(/副<span class="(.*?)">业<\/span>/g, '副业');

            txt = txt.replace(/<span class="(.*?)">兼<\/span>职/g, '兼职');
            txt = txt.replace(/<span class="(.*?)">远<\/span>程/g, '远程');
            txt = txt.replace(/<span class="(.*?)">线<\/span>上/g, '线上');
            txt = txt.replace(/<span class="(.*?)">副<\/span>业/g, '副业');

            // 高亮显示关键词
            const highlightedContent = txt.replace(/远程/g, '<span style="background-color:yellow;">远程</span>');
            const highlightedContent1 = highlightedContent.replace(/家/g, '<span style="background-color:yellow;">家</span>');
            const highlightedContent2 = highlightedContent1.replace(/兼职/g, '<span style="background-color:yellow;">兼职</span>');
            const highlightedContent3 = highlightedContent2.replace(/线上/g, '<span style="background-color:yellow;">线上</span>');
            const highlightedContent4 = highlightedContent3.replace(/副业/g, '<span style="background-color:yellow;">副业</span>');

            // 更新文本内容
            desc.innerHTML = highlightedContent4;
        }, 1200);
    };
})();