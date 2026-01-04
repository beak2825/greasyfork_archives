// ==UserScript==
// @name         夸克/百度云盘 剧情批量重命名（实时预览优化版）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  批量重命名为剧情命名格式，包含实时预览
// @match        https://pan.quark.cn/*
// @match        https://pan.baidu.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515571/%E5%A4%B8%E5%85%8B%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%20%E5%89%A7%E6%83%85%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%EF%BC%88%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515571/%E5%A4%B8%E5%85%8B%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%20%E5%89%A7%E6%83%85%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%EF%BC%88%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'white';
    panel.style.padding = '10px';
    panel.style.zIndex = 1000;
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '5px';
    panel.innerHTML = `
        <h3>剧情批量重命名</h3>
        <label>剧名: <input type="text" id="seriesName" placeholder="请输入剧名"></label><br>
        <label>起始季: <input type="number" id="startSeason" value="1" min="1"></label><br>
        <label>起始集: <input type="number" id="startEpisode" value="1" min="1"></label><br>
        <button id="renameFilesBtn">读取文件列表</button>
        <div id="fileList" style="margin-top: 10px; max-height: 300px; overflow-y: auto;"></div>
        <button id="applyRenameBtn" style="margin-top: 10px;">批量重命名</button>
    `;
    document.body.appendChild(panel);

    // 文件预览更新逻辑
    function updatePreview() {
        const seriesName = document.getElementById('seriesName').value.trim();
        const startSeason = parseInt(document.getElementById('startSeason').value);
        let currentEpisode = parseInt(document.getElementById('startEpisode').value);

        const checkboxes = document.querySelectorAll('#fileList input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const oldName = checkbox.value;
                const fileExt = oldName.split('.').pop();
                const previewName = `${seriesName}.S${String(startSeason).padStart(2, '0')}E${String(currentEpisode).padStart(2, '0')}.${fileExt}`;

                // 显示预览名称
                const previewSpan = document.getElementById(`preview_${index}`);
                previewSpan.textContent = ` -> ${previewName}`;
                currentEpisode += 1;
            }
        });
    }

    // 添加输入框事件监听器，实时更新预览
    document.getElementById('seriesName').addEventListener('input', updatePreview);
    document.getElementById('startSeason').addEventListener('input', updatePreview);
    document.getElementById('startEpisode').addEventListener('input', updatePreview);

    // 获取文件列表并展示
    function displayFileList() {
        const fileListDiv = document.getElementById('fileList');
        fileListDiv.innerHTML = ''; // 清空之前的文件列表

        // 尝试获取文件项
        const files = document.querySelectorAll('div, span, li'); // 使用通用选择器尝试获取所有潜在文件名元素

        files.forEach((file, index) => {
            const fileName = file.textContent ? file.textContent.trim() : '';
            const isFile = fileName && fileName.match(/\.\w{2,4}$/); // 检查文件名是否包含扩展名

            if (isFile) {
                const fileExt = fileName.split('.').pop();
                const baseName = fileName.slice(0, fileName.lastIndexOf('.'));

                // 创建复选框和文件名展示
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'fileCheckbox_' + index;
                checkbox.value = baseName + '.' + fileExt;
                checkbox.addEventListener('change', updatePreview);

                const label = document.createElement('label');
                label.for = checkbox.id;
                label.textContent = fileName;

                // 预览标签
                const previewSpan = document.createElement('span');
                previewSpan.id = `preview_${index}`;
                previewSpan.style.color = 'blue';

                fileListDiv.appendChild(checkbox);
                fileListDiv.appendChild(label);
                fileListDiv.appendChild(previewSpan);
                fileListDiv.appendChild(document.createElement('br'));
            }
        });
    }

    // 监听 DOM 变化，但使用防抖来避免频繁触发
    let timeoutId;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(displayFileList, 500); // 防抖，500ms后执行，避免频繁触发
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 手动触发文件列表显示
    document.getElementById('renameFilesBtn').onclick = displayFileList;

    // 批量重命名
    document.getElementById('applyRenameBtn').onclick = function() {
        const seriesName = document.getElementById('seriesName').value.trim();
        const startSeason = parseInt(document.getElementById('startSeason').value);
        let currentEpisode = parseInt(document.getElementById('startEpisode').value);

        const checkboxes = document.querySelectorAll('#fileList input[type="checkbox"]:checked');
        checkboxes.forEach((checkbox) => {
            const oldName = checkbox.value;
            const fileExt = oldName.split('.').pop();
            const newName = `${seriesName}.S${String(startSeason).padStart(2, '0')}E${String(currentEpisode).padStart(2, '0')}.${fileExt}`;

            // 修改文件名显示，假设文件名直接展示在页面上
            const fileItem = [...document.querySelectorAll('div, span, li')].find(el => el.textContent.trim() === oldName);
            if (fileItem) {
                fileItem.textContent = newName; // 更新文件名
            }

            currentEpisode += 1; // 增加集数
        });
        alert('重命名完成');
    };
})();
