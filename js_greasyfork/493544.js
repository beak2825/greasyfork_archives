// ==UserScript==
// @name         b站自动删除空白视频格
// @namespace    https://greasyfork.org/zh-CN/scripts
// @version      2024.11.24
// @description  净化b站 AdGuard拦截广告后的空白格子
// @author       cccq
// @match        https://www.bilibili.com/
// @icon         https://ts1.cn.mm.bing.net/th?id=OIP-C.t_km_I0O-asr3a-bNrejjQHaHa&w=204&h=204&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2
// @grant        none
// @license      cccq
// @downloadURL https://update.greasyfork.org/scripts/493544/b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%A9%BA%E7%99%BD%E8%A7%86%E9%A2%91%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/493544/b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%A9%BA%E7%99%BD%E8%A7%86%E9%A2%91%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    // 观察container是否新增dom
    const container = document.querySelector('.container');

    // 删除元素函数
    function removeHiddenElements() {
        // 查找所有推荐视频卡片
        let allElements = document.querySelectorAll('.bili-video-card.is-rcmd');

        // 筛选出包含隐藏广告的元素
        let adElements = Array.from(allElements).filter(el => {
            // 检查是否存在带有display: none !important样式的wrap元素
            const wrapElement = el.querySelector('.bili-video-card__wrap.__scale-wrap');
            return wrapElement && wrapElement.style.display === 'none';
        });

        // 删除广告元素
        adElements.forEach(el => {
            // 找到广告的父元素
            let biliVideoCard = el.closest('.bili-video-card');
            // 如果广告父元素上还有一层则删除最上层的dom
            if (biliVideoCard) {
                let feedCard = biliVideoCard.closest('.feed-card');
                if (feedCard) {
                    feedCard.remove();
                } else {
                    biliVideoCard.remove();
                }
            }
        });
    }

    // 创建观察器
    const observer = new MutationObserver((mutationsList, observer) => {
        // 当子节点发生变动时
        mutationsList.forEach((mutationRecord) => {
            if (mutationRecord.type === 'childList') {
                mutationRecord.addedNodes.forEach((addedNode) => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        // 执行删除元素
                        removeHiddenElements();
                        // 退出foreach循环,等待下次节点新增
                        return;
                    }
                });
            }
        });
    });

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
    };

    // 开始观察
    observer.observe(container, config);
})();