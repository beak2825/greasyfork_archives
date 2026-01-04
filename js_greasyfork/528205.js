// ==UserScript==
// @name         图片批量下载脚本（带尺寸过滤，支持滑动调整和实时显示匹配图片数量）
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  点击图标批量下载网页中的图片，并支持尺寸过滤调节，显示匹配图片数量
// @author       You
// @match        *://*/htm_data/*
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528205/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E5%B0%BA%E5%AF%B8%E8%BF%87%E6%BB%A4%EF%BC%8C%E6%94%AF%E6%8C%81%E6%BB%91%E5%8A%A8%E8%B0%83%E6%95%B4%E5%92%8C%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E5%8C%B9%E9%85%8D%E5%9B%BE%E7%89%87%E6%95%B0%E9%87%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528205/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E5%B0%BA%E5%AF%B8%E8%BF%87%E6%BB%A4%EF%BC%8C%E6%94%AF%E6%8C%81%E6%BB%91%E5%8A%A8%E8%B0%83%E6%95%B4%E5%92%8C%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E5%8C%B9%E9%85%8D%E5%9B%BE%E7%89%87%E6%95%B0%E9%87%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮并加入到页面
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = '下载图片';
    downloadBtn.style.position = 'fixed';
    downloadBtn.style.top = '10px';
    downloadBtn.style.right = '10px';
    downloadBtn.style.zIndex = '9999';
    downloadBtn.style.backgroundColor = '#4CAF50';
    downloadBtn.style.color = 'white';
    downloadBtn.style.padding = '10px 20px';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '5px';
    downloadBtn.style.cursor = 'pointer';
    document.body.appendChild(downloadBtn);

    // 创建配置面板
    const configPanel = document.createElement('div');
    configPanel.style.position = 'fixed';
    configPanel.style.top = '50px';
    configPanel.style.right = '10px';
    configPanel.style.zIndex = '9999';
    configPanel.style.backgroundColor = '#f1f1f1';
    configPanel.style.padding = '15px';
    configPanel.style.borderRadius = '5px';
    configPanel.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
    configPanel.style.fontSize = '14px';
    configPanel.style.display = 'none'; // 默认隐藏
    document.body.appendChild(configPanel);

    // 添加最小宽度和高度的滑动条
    const minWidthLabel = document.createElement('label');
    minWidthLabel.textContent = '最小宽度：';
    const minWidthSlider = document.createElement('input');
    minWidthSlider.type = 'range';
    minWidthSlider.min = '100';
    minWidthSlider.max = '2000';
    minWidthSlider.value = '500';
    minWidthSlider.style.width = '200px';
    const minWidthValue = document.createElement('span');
    minWidthValue.textContent = '500px';
    minWidthLabel.appendChild(minWidthSlider);
    minWidthLabel.appendChild(minWidthValue);
    configPanel.appendChild(minWidthLabel);

    const minHeightLabel = document.createElement('label');
    minHeightLabel.textContent = '最小高度：';
    const minHeightSlider = document.createElement('input');
    minHeightSlider.type = 'range';
    minHeightSlider.min = '100';
    minHeightSlider.max = '2000';
    minHeightSlider.value = '500';
    minHeightSlider.style.width = '200px';
    const minHeightValue = document.createElement('span');
    minHeightValue.textContent = '500px';
    minHeightLabel.appendChild(minHeightSlider);
    minHeightLabel.appendChild(minHeightValue);
    configPanel.appendChild(minHeightLabel);

    // 显示匹配的图片数量
    const matchCountLabel = document.createElement('div');
    matchCountLabel.style.marginTop = '10px';
    matchCountLabel.textContent = '匹配的图片数量：0';
    configPanel.appendChild(matchCountLabel);

    // 显示和隐藏配置面板的按钮
    const toggleConfigBtn = document.createElement('button');
    toggleConfigBtn.innerHTML = '设置过滤条件';
    toggleConfigBtn.style.position = 'fixed';
    toggleConfigBtn.style.top = '10px';
    toggleConfigBtn.style.right = '100px';
    toggleConfigBtn.style.zIndex = '9999';
    toggleConfigBtn.style.backgroundColor = '#2196F3';
    toggleConfigBtn.style.color = 'white';
    toggleConfigBtn.style.padding = '10px 20px';
    toggleConfigBtn.style.border = 'none';
    toggleConfigBtn.style.borderRadius = '5px';
    toggleConfigBtn.style.cursor = 'pointer';
    document.body.appendChild(toggleConfigBtn);

    toggleConfigBtn.addEventListener('click', function() {
        configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
    });

    // 更新最小宽度和最小高度的显示值
    minWidthSlider.addEventListener('input', function() {
        minWidthValue.textContent = minWidthSlider.value + 'px';
        updateMatchCount();
    });
    minHeightSlider.addEventListener('input', function() {
        minHeightValue.textContent = minHeightSlider.value + 'px';
        updateMatchCount();
    });

    // 更新匹配的图片数量
    function updateMatchCount() {
        const images = Array.from(document.querySelectorAll('img'));  // 获取所有图片元素
        const minWidth = parseInt(minWidthSlider.value);
        const minHeight = parseInt(minHeightSlider.value);
        let matchCount = 0;

        images.forEach((img) => {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            if (imgWidth >= minWidth && imgHeight >= minHeight) {
                matchCount++;
            }
        });

        matchCountLabel.textContent = `匹配的图片数量：${matchCount}`;
    }

    // 给下载按钮绑定点击事件
    downloadBtn.addEventListener('click', function() {
        const images = Array.from(document.querySelectorAll('img'));  // 获取所有图片元素
        const pageTitle = document.title.replace(/[\\\/:*?"<>|]/g, '');  // 获取页面标题并清除非法字符
        const folderName = pageTitle || 'images';  // 如果没有标题，默认用 'images'

        // 获取用户设置的尺寸过滤值
        const minWidth = parseInt(minWidthSlider.value);
        const minHeight = parseInt(minHeightSlider.value);

        let downloadCount = 0;  // 记录下载的图片数量

        images.forEach((img, index) => {
            const imgSrc = img.src;
            if (imgSrc) {
                // 获取图片尺寸
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;

                // 只下载符合尺寸过滤条件的图片
                if (imgWidth >= minWidth && imgHeight >= minHeight) {
                    // 使用 GM_download 下载图片
                    GM_download({
                        url: imgSrc,
                        name: `${folderName}/image_${index + 1}.jpg`,  // 使用文件夹名作为下载路径
                        onload: function() {
                            console.log(`图片 ${index + 1} 下载成功！`);
                        },
                        onerror: function() {
                            console.log(`图片 ${index + 1} 下载失败！`);
                        }
                    });
                    downloadCount++;
                } else {
                    console.log(`图片 ${index + 1} 被过滤，尺寸不符合要求：${imgWidth}x${imgHeight}`);
                }
            }
        });

        if (downloadCount > 0) {
            alert(`下载任务已开始，共下载 ${downloadCount} 张符合条件的图片！`);
        } else {
            alert('没有符合尺寸要求的图片！');
        }
    });

    // 页面加载后立即更新匹配图片数量
    updateMatchCount();
})();
