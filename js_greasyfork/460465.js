// ==UserScript==
// @name         华为官网获取产品配置清单
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从华为手机官网获取对应产品的配置清单，导出生成TXT文件。
// @author       Techwb.cn
// @match        https://www.vmall.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460465/%E5%8D%8E%E4%B8%BA%E5%AE%98%E7%BD%91%E8%8E%B7%E5%8F%96%E4%BA%A7%E5%93%81%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/460465/%E5%8D%8E%E4%B8%BA%E5%AE%98%E7%BD%91%E8%8E%B7%E5%8F%96%E4%BA%A7%E5%93%81%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面上的导出按钮容器
    const exportBtnContainer = document.createElement('div');
    exportBtnContainer.style.position = 'fixed';
    exportBtnContainer.style.right = '4%';
    exportBtnContainer.style.bottom = '50%';
    exportBtnContainer.style.transform = 'translateX(50%)';
    document.body.appendChild(exportBtnContainer);

    // 创建导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.innerText = '生成配置清单';
    exportBtn.style.backgroundColor = 'red';
    exportBtn.style.color = 'white';
    exportBtn.style.padding = '10px 20px';
    exportBtn.style.border = 'none';
    exportBtn.style.borderRadius = '5px';
    exportBtn.style.cursor = 'pointer';
    exportBtnContainer.appendChild(exportBtn);

    // 添加事件监听器，当导出按钮被点击时执行
    exportBtn.addEventListener('click', () => {
        // 获取页面上的<div id='productParameter'>标签
        const productParameter = document.getElementById('productParameter');
        if (productParameter) {
            // 查询指定的文本
            const searchTerms = [
                '传播名', '上市时间', 'CPU型号', 'CPU核数', 'CPU主频', 'GPU', 'NPU', '操作系统', '电池容量', '快充',
                '无线充电', '后置摄像头', '前置摄像头', '视频拍摄', '防抖模式', '变焦模式', '照片分辨率', '摄像分辨率',
                '拍摄功能', '屏幕尺寸', '屏幕类型', '分辨率', '屏幕色彩', '机身内存（ROM）', '存储卡类型',
                '最大支持扩展', '双卡', '特色功能', '系统导航方式', '网络制式', '3D人脸识别', '指纹传感器'
            ];
            const labelNodes = Array.from(productParameter.getElementsByTagName('label'));
            const matchingNodes = labelNodes.filter(node => {
                const labelText = node.textContent.trim();
                return searchTerms.includes(labelText);
            });
            const uniqueMatchingText = Array.from(new Set(matchingNodes.map(node => {
                const labelText = node.textContent.trim();
                const spanText = node.nextElementSibling.textContent.trim().replace(/\n/g, '');
                if (labelText === '传播名') {
                    return `【传播名】${spanText}`;
                } else {
                    return `【${labelText}】 ${spanText}`;
                }
            })));
            const outputText = uniqueMatchingText.join('\n');
            const productNameNode = matchingNodes.find(node => node.textContent.trim() === '传播名');
            const productName = productNameNode ? productNameNode.nextElementSibling.textContent.trim() : 'product';
            const blob = new Blob([outputText], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productName}详细配置清单.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
})();
