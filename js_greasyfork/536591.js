// ==UserScript==
// @name         复制货件信息到剪切板
// @namespace    http://wukui.fun
// @version      2025-05-20
// @description  在货件列表创建复制货件信息的按钮
// @license      MIT license
// @author       吴奎
// @match        https://sellercentral.amazon.com/gp/ssof/shipping-queue.html/ref=xx_fbashipq_favb_xx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536591/%E5%A4%8D%E5%88%B6%E8%B4%A7%E4%BB%B6%E4%BF%A1%E6%81%AF%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/536591/%E5%A4%8D%E5%88%B6%E8%B4%A7%E4%BB%B6%E4%BF%A1%E6%81%AF%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建“添加”按钮
    const addButton = document.createElement("button");
    addButton.textContent = "添加";
    addButton.style.position = "fixed";
    addButton.style.bottom = "20px";
    addButton.style.left = "20px";
    addButton.style.padding = "10px";
    addButton.style.backgroundColor = "#00a4b4";
    addButton.style.color = "#fff";
    addButton.style.border = "none";
    addButton.style.borderRadius = "5px";
    addButton.style.cursor = "pointer";
    addButton.style.zIndex = "1000";
    document.body.appendChild(addButton);

    // 添加按钮点击事件
    addButton.onclick = function() {
        // 选择所有包含货件ID的元素
        const shipmentIdElements = document.querySelectorAll('div[id="shipment_id_text"]');

        // 遍历这些元素，为每个元素添加点击复制功能
        shipmentIdElements.forEach(function(shipmentIdElement) {
            // 修改样式使其看起来像按钮
            shipmentIdElement.style.cursor = "pointer";
            shipmentIdElement.style.padding = "2px 10px"; // 调整上下边距为2px
            shipmentIdElement.style.border = "1px solid rgba(0, 164, 180, 0.5)"; // 边框颜色稍微透明
            shipmentIdElement.style.borderRadius = "5px";
            shipmentIdElement.style.backgroundColor = "rgb(0, 164, 180)"; // 背景色设置为指定的RGB值
            shipmentIdElement.style.color = "#ffffff"; // 文字颜色设置为白色
            shipmentIdElement.style.marginTop = "2px"; // 调整上边距为2px
            shipmentIdElement.style.display = "inline-block";

            // 获取仓库代码
            const warehouseCodeElement = shipmentIdElement.closest('kat-table-row').querySelector('kat-table-cell:nth-child(4)');
            let warehouseCode = warehouseCodeElement ? warehouseCodeElement.textContent.trim() : '仓库代码未找到';

            // 正则表达式匹配仓库代码格式
            const warehouseCodeMatch = warehouseCode.match(/[A-Z0-9]+/);
            if (warehouseCodeMatch) {
                warehouseCode = warehouseCodeMatch[0];
            }

            // 为元素添加点击事件，实现复制功能
            shipmentIdElement.onclick = function() {
                // 构造要复制的文本
                const shipmentIdText = shipmentIdElement.textContent.trim();
                const copyText = `${shipmentIdText}, ${warehouseCode}`;
                // 复制到剪贴板
                navigator.clipboard.writeText(copyText).then(() => {
                    // 显示复制成功信息的悬浮div
                    const successDiv = document.createElement("div");
                    successDiv.textContent = "货件信息已复制";
                    successDiv.style.position = "fixed";
                    successDiv.style.bottom = "20px";
                    successDiv.style.left = "20px";
                    successDiv.style.padding = "10px";
                    successDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                    successDiv.style.color = "#fff";
                    successDiv.style.borderRadius = "5px";
                    successDiv.style.zIndex = "1000";
                    document.body.appendChild(successDiv);

                    // 2秒后消失
                    setTimeout(() => {
                        document.body.removeChild(successDiv);
                    }, 2000);
                }).catch(err => {
                    console.error("复制失败: ", err);
                });
            };
        });
    };

    // Your code here...
})();
