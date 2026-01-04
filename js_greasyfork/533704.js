// ==UserScript==
// @name         知网国自科基委认定期刊30本
// @namespace    http://tampermonkey.net/
// @version      2025-04-23
// @description  做了个动画来显示
// @author       You
// @match        https://vpn.zknu.edu.cn/https/*
// @match        https://*.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zknu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533704/%E7%9F%A5%E7%BD%91%E5%9B%BD%E8%87%AA%E7%A7%91%E5%9F%BA%E5%A7%94%E8%AE%A4%E5%AE%9A%E6%9C%9F%E5%88%8A30%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533704/%E7%9F%A5%E7%BD%91%E5%9B%BD%E8%87%AA%E7%A7%91%E5%9F%BA%E5%A7%94%E8%AE%A4%E5%AE%9A%E6%9C%9F%E5%88%8A30%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义期刊列表
    const JOURNALS_A = [
        "Journal of Management Science and Engineering", "管理科学学报", "系统工程理论与实践",
        "管理世界", "数量经济技术经济研究", "中国软科学", "金融研究",
        "中国管理科学", "系统工程学报", "会计研究", "系统管理学报",
        "管理评论", "管理工程学报", "南开管理评论", "科研管理",
        "情报学报", "公共管理学报", "管理科学", "预测", "运筹与管理",
        "科学学研究", "中国工业经济", "农业经济问题"
    ];
    const JOURNALS_B = [
        "管理学报", "工业工程与管理", "系统工程",
        "科学学与科学技术管理", "研究与发展管理",
        "中国人口、资源与环境", "数理统计与管理", "中国农村经济"
    ];
    const ALL_JOURNALS = [...JOURNALS_A, ...JOURNALS_B];

    // 切换样式的函数
    function toggleStyles() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const text = link.textContent;
            if (ALL_JOURNALS.includes(text)) {
                if (link.style.color === 'yellow') {
                    link.style.color = 'green';
                    link.style.backgroundColor = 'yellow';
                } else {
                    link.style.color = 'yellow';
                    link.style.backgroundColor = 'green';
                }
                if (JOURNALS_A.includes(text)) {
                    link.style.borderBottom = '3px solid black';
                } else {
                    link.style.borderBottom = '';
                }
            }
        });
    }

    // 定时切换样式
    setInterval(toggleStyles, 1000);
})();    