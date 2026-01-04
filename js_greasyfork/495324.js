// ==UserScript==
// @name         s01论坛帖子一行显示多图
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在论坛帖子中一行显示多张图片。
// @author       Your name
// @match        http://23.225.255.80/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495324/s01%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E4%B8%80%E8%A1%8C%E6%98%BE%E7%A4%BA%E5%A4%9A%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495324/s01%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E4%B8%80%E8%A1%8C%E6%98%BE%E7%A4%BA%E5%A4%9A%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：在一行中显示图片
    function displayImagesInRow(rowCount, postContent) {
        // 选择帖子内容中的所有图片
        let images = postContent.querySelectorAll('img');

        // 计算每行要显示的图片数量
        let imagesPerRow = Math.min(images.length, rowCount);

        // 设置每个图片的宽度
        let imageWidth = `${100 / imagesPerRow}%`;

        // 设置父容器的样式以允许图片在一行中显示
        postContent.style.display = 'flex';
        postContent.style.flexWrap = 'wrap';

        images.forEach(image => {
            // 设置图片样式
            image.style.width = imageWidth;
            image.style.maxWidth = '100%'; // 确保图片不超出容器宽度
            image.style.height = 'auto'; // 保持图片原始高度
            image.style.objectFit = 'contain'; // 缩放图片以保持原始比例
            image.style.marginRight = '10px'; // 图片之间添加一些间距
        });
    }

    // 函数：添加下拉框以选择每行图片的数量
    function addDropdown() {
        let dropdownHTML = `
            <div id="tutu-dropdown" style="position: fixed; right: 10px; bottom: 10px; z-index: 9999;">
                <select id="tutu-select">
                    <option value="1">1 图片每行</option>
                    <option value="2">2 图片每行</option>
                    <option value="3">3 图片每行</option>
                    <option value="4">4 图片每行</option>
                    <option value="5">5 图片每行</option>
                    <option value="6">6 图片每行</option>
                    <option value="7">7 图片每行</option>
                    <option value="8">8 图片每行</option>
                    <option value="9">9 图片每行</option>
                    <option value="10">10 图片每行</option>
                    <option value="11">11 图片每行</option>
                    <option value="12">12 图片每行</option>
                    <option value="13">13 图片每行</option>
                    <option value="14">14 图片每行</option>
                    <option value="15">15 图片每行</option>
                    <option value="16">16 图片每行</option>
                    <option value="17">17 图片每行</option>
                    <option value="18">18 图片每行</option>
                    <option value="19">19 图片每行</option>
                    <option value="20">20 图片每行</option>
                </select>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dropdownHTML);

        // 获取上次选择的图片数量
        let lastSelected = GM_getValue('lastSelected', 4);
        document.getElementById('tutu-select').value = lastSelected;

        // 添加下拉框变化的事件监听器
        document.getElementById('tutu-select').addEventListener('change', function() {
            let rowCount = parseInt(this.value);
            // 查找当前帖子的内容元素并应用样式
            let postContent = document.querySelector('.t_msgfont'); // 修改选择器以匹配帖子内容元素
            displayImagesInRow(rowCount, postContent);
            // 保存选择的图片数量
            GM_setValue('lastSelected', rowCount);
        });
    }

    // 初始化脚本
    function init() {
        // 默认显示4张图片每行
        // 查找当前帖子的内容元素并应用样式
        let postContent = document.querySelector('.t_msgfont'); // 修改选择器以匹配帖子内容元素
        let lastSelected = GM_getValue('lastSelected', 4);
        displayImagesInRow(lastSelected, postContent);

        // 添加下拉框以选择每行图片的数量
        addDropdown();

        // 设置帖子内容<div>标签的宽度为原来的120%
        postContent.style.width = '120%';
    }

    // 运行脚本
    init();
})();
