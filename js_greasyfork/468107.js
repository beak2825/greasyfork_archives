// ==UserScript==
// @name         美图秀秀-美图设计室去水印
// @namespace    https://ymjin.blog.csdn.net/
// @version      0.2.5
// @license      AGPL License
// @description  删除美图秀秀-美图设计室水印
// @match       *://*.meitu.com/*
// @match       *://*.x-design.com/*
// @match       *://*.818ps.com/*
// @grant       none
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/468107/%E7%BE%8E%E5%9B%BE%E7%A7%80%E7%A7%80-%E7%BE%8E%E5%9B%BE%E8%AE%BE%E8%AE%A1%E5%AE%A4%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468107/%E7%BE%8E%E5%9B%BE%E7%A7%80%E7%A7%80-%E7%BE%8E%E5%9B%BE%E8%AE%BE%E8%AE%A1%E5%AE%A4%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
   // 定义一个函数清除元素样式
    function clearDivStyles() {
        let watermark = document.querySelector('.l-global-watermark');  // 获取元素'.l-global-watermark'
        if (watermark) {
            let divs = watermark.querySelectorAll('div');  // 获取元素'.l-global-watermark'下的所有'div'元素
            divs.forEach((div) => {
                div.style = "";  // 清空每个'div'的样式
            });
        }
    }
   // AI消除中的样式
    function clearDivStyles_Ai() {
        // 删除美图秀秀水印
        let DesignRoomWatermarkView = document.querySelector('.DesignRoomWatermarkView');
        if (DesignRoomWatermarkView) {
            document.querySelector(".DesignRoomWatermarkView").style = "";
        }
        // 删除美图秀秀移除水印按钮
        let BuyVIPButtonInCanvas = document.querySelector('.BuyVIPButtonInCanvas');
        if (BuyVIPButtonInCanvas) {
            document.querySelector(".BuyVIPButtonInCanvas").style = "";
        }

    }

    // 定义一个函数，延时来移除水印容器
    function removeWatermarkContainer() {
        let watermarkContainer = document.querySelector('.watermark-container');  // 获取元素'.watermark-container'
        if (watermarkContainer) {
            watermarkContainer.remove();  // 如果元素存在，则删除它
        }
        // 删除美图秀秀的【开通会员去广告图标】
        let buyVipBtn = document.querySelector('.buy-vip-btn');
        if (buyVipBtn) {
            buyVipBtn.remove();
        }

        // 删除图怪兽中的水印
        let TgsWatermark = document.querySelector('.image-watermark');
        if (TgsWatermark) {
            // document.querySelector(".TgsWatermark").style = "";
            TgsWatermark.remove();
        }
    }

    // 当页面加载时，清除div样式和删除水印容器
    window.addEventListener('load', function() {
        clearDivStyles();
        removeWatermarkContainer();
    });

    // 监听click事件，如果水印容器出现，就删除它
    window.addEventListener('click', function() {
        setTimeout(removeWatermarkContainer, 100); // 延时100毫秒以允许完全插入节点
    }, true);

    // 设置MutationObserver来清除div样式和删除水印容器，如果它们稍后出现
    let observer = new MutationObserver(function(mutations) {
        // 只处理添加节点的变动
        let hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
        if (hasAddedNodes) {
            setTimeout(function() {
                clearDivStyles();
                removeWatermarkContainer();
                clearDivStyles_Ai();
            }, 100); // 延时100毫秒以允许完全插入节点
        }
    });

    // 开始监视文档的子节点或者后代节点的变动
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();
