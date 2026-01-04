// ==UserScript==
// @name         下载即梦无水印图片
// @namespace    https://github.com/xiaowang96-github/jimengNoWatermark
// @version     1.0
// @description  通过F12控制台即梦生成的图片的无水印图片
// @author       xiaowang
// @match       *://jimeng.jianying.com/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/532480/%E4%B8%8B%E8%BD%BD%E5%8D%B3%E6%A2%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/532480/%E4%B8%8B%E8%BD%BD%E5%8D%B3%E6%A2%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义下载文件的函数
    async function downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error('下载失败:', error);
        }
    }

    // 定义一个函数来查找图片并添加下载按钮
    function findImageAndAddButton() {
        // 查找图片容器
        const imageContainer = document.querySelector('.container-Sq_B8G');
        if (!imageContainer) return;

         // 查找图片元素
        const imgElement = imageContainer.querySelector('img');
        if (!imgElement) return;

        // 获取图片地址
        const imageUrl = imgElement.src;

        // 查找顶部操作栏
        const topActionBar = document.querySelector('.topActionBar-v7_WTk');
        if (!topActionBar) return;

        // 检查下载按钮是否已经存在
        const existingButton = topActionBar.querySelector('.mweb-button-tertiary.mwebButton-vwzuXc.operationBtnItem-_GEqBw[data-download-button]');
        if (existingButton) return;

        // 创建下载按钮
        const downloadButton = document.createElement('div');
        downloadButton.className = 'mweb-button-tertiary mwebButton-vwzuXc operationBtnItem-_GEqBw';
        downloadButton.setAttribute('data-download-button', '');
         downloadButton.setAttribute('title', '下载无水印图');
        downloadButton.innerHTML = `
        <svg t="1744247415791" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6974" width="16" height="16"><path d="M422.167273 549.85697V37.143273l77.575757-34.769455v512.729212l-77.575757 34.78497z" fill="#f46708" p-id="6975"></path><path d="M422.167273 37.127758l88.064 13.172363 77.575757-34.784969L499.74303 2.358303l-77.575757 34.769455z" fill="#f46708" p-id="6976"></path><path d="M510.231273 50.300121v512.775758l77.575757-34.78497V15.515152l-77.575757 34.784969z" fill="#f46708" p-id="6977"></path><path d="M510.231273 563.075879l124.648727-117.496243 77.575758-34.769454-124.648728 117.480727-77.575757 34.78497z" fill="#f46708" p-id="6978"></path><path d="M634.88 445.595152l62.308848 77.327515 77.575758-34.769455-62.308848-77.34303-77.575758 34.769454z" fill="#f46708" p-id="6979"></path><path d="M697.188848 522.938182L466.199273 740.677818l77.575757-34.769454 230.989576-217.755152-77.575758 34.78497z" fill="#f46708" p-id="6980"></path><path d="M466.199273 740.677818L235.411394 453.926788l77.575758-34.78497 230.787878 286.766546-77.575757 34.753939z" fill="#f46708" p-id="6981"></path><path d="M235.411394 453.926788l62.107151-58.755879 77.575758-34.769454-62.107151 58.755878-77.575758 34.769455z" fill="#f46708" p-id="6982"></path><path d="M297.518545 395.170909l124.633213 154.686061 77.575757-34.769455-124.633212-154.68606-77.575758 34.769454zM422.167273 549.85697l77.575757-34.769455-77.575757 34.78497zM157.897697 815.58497v-96.22497l77.575758-34.769455v96.22497l-77.575758 34.769455z" fill="#f46708" p-id="6983"></path><path d="M157.897697 719.36L69.818182 706.203152l77.575757-34.78497 88.079516 13.172363-77.575758 34.769455z" fill="#f46708" p-id="6984"></path><path d="M69.818182 706.203152V898.637576l77.575757-34.769455V671.418182l-77.575757 34.78497zM69.818182 898.653091l792.762182 118.473697 77.575757-34.78497L147.393939 863.883636 69.818182 898.637576z" fill="#f46708" p-id="6985"></path><path d="M862.580364 1017.111273V824.676848l77.575757-34.769454v192.449939l-77.575757 34.78497zM862.580364 824.661333l-88.095031-13.156848 77.575758-34.78497 88.09503 13.172364-77.575757 34.769454z" fill="#f46708" p-id="6986"></path><path d="M774.485333 811.504485v96.22497l77.575758-34.78497v-96.22497l-77.575758 34.78497z" fill="#f46708" p-id="6987"></path><path d="M774.485333 907.729455l-616.572121-92.12897 77.575758-34.78497 616.572121 92.12897-77.575758 34.78497zM157.897697 815.600485l77.575758-34.78497-77.575758 34.78497z" fill="#f46708" p-id="6988"></path><path d="M422.167273 549.85697V37.143273l88.064 13.172363v512.775758l124.648727-117.496242 62.308848 77.358545-230.989575 217.739636-230.787879-286.75103 62.107151-58.755879 124.633213 154.686061zM157.882182 815.616v-96.240485L69.818182 706.203152V898.637576l792.762182 118.473697V824.645818l-88.095031-13.156848v96.224969l-616.572121-92.128969z" fill="#f46708" p-id="6989"></path></svg>
        `;

        // 为按钮添加点击事件
        downloadButton.addEventListener('click', function() {
            downloadFile(imageUrl, "imageOrgin_jimeng.png");
        });

        // 将按钮添加到顶部操作栏
        topActionBar.appendChild(downloadButton);
    }

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                findImageAndAddButton();
            }
        }
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察整个文档的变化
    observer.observe(document.body, config);

    // 页面加载完成后也尝试查找一次
    window.addEventListener('load', findImageAndAddButton);
})();