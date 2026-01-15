// ==UserScript==
// @name         北京交通大学智慧课程平台无限制补交作业
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  延长作业截止时间到一百年后，可以补交作业
// @author       上条当咩
// @match        http://study.bjtu.top:88/ve/back/coursePlatform/coursePlatform.shtml*
// @match        http://123.121.147.7:88/ve/back/coursePlatform/coursePlatform.shtml*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520572/%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E6%99%BA%E6%85%A7%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E6%97%A0%E9%99%90%E5%88%B6%E8%A1%A5%E4%BA%A4%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/520572/%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E6%99%BA%E6%85%A7%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E6%97%A0%E9%99%90%E5%88%B6%E8%A1%A5%E4%BA%A4%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个mutation观察器来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processNodes();
            }
        });
    });

    // 开始观察整个文档树的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 处理页面上的节点
    function processNodes() {
        // 获取所有包含'listBtn'类的div元素
        const submitButtons = document.querySelectorAll('div.listBtn');

        submitButtons.forEach(button => {
            if (button.textContent === '提交') {
                // 获取原始的onclick属性值
                const originalOnclick = button.getAttribute('onclick');
                if (originalOnclick && originalOnclick.includes('jiaozuoye')) {
                    // 提取原始参数
                    const params = originalOnclick.match(/jiaozuoye\((.*?)\)/)[1].split(',');

                    // 计算100年后的日期
                    const futureDate = new Date();
                    futureDate.setFullYear(futureDate.getFullYear() + 100);
                    const futureDateStr = futureDate.toISOString().split('T')[0] + ' 00:00';

                    // 替换最后的时间参数（倒数第二个参数）
                    params[params.length - 2] = `'${futureDateStr}'`;

                    // 创建新的onclick函数，移除alert并更新时间
                    const newOnclick = `jiaozuoye(${params.join(',')})`;

                    // 更新按钮的onclick属性
                    button.setAttribute('onclick', newOnclick);
                    button.textContent = '无限制提交'
                }
            }
        });
    }

    // 初始运行一次以处理页面上已有的元素
    processNodes();
})();