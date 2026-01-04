// ==UserScript==
// @name         网盘批量重命名脚本
// @namespace    http://tampermonkey.net/
// @version      4.7.3c
// @description  批量重命名网盘文件，支持剧集模式和正则模式，实时预览文件名更改
// @match        *://pan.baidu.com/*
// @match        *://pan.quark.cn/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515401/%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515401/%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // 创建触发按钮
    const triggerButton = document.createElement('button');
    triggerButton.innerText = '批量重命名';
    triggerButton.style = 'position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 10px 20px; background-color: #007ACC; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;';
    document.body.appendChild(triggerButton);
  
    // 模态弹窗结构
    const modal = document.createElement('div');
    modal.style = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1000; justify-content: center; align-items: center;';
    modal.innerHTML = `
        <div style="background: #fefefe; padding: 20px; border-radius: 8px; width: 900px; max-height: 90%; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); overflow-y: auto; font-family: Arial, sans-serif;">
            <h2 style="font-size: 18px; color: #333; margin-bottom: 20px;">批量重命名</h2>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <div>
                    <label><input type="radio" name="mode" value="series" checked> 剧集模式</label>
                    <label style="margin-left: 15px;"><input type="radio" name="mode" value="regex"> 正则模式</label>
                </div>
                <div id="seriesOptions" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <label>剧名：<input type="text" id="seriesName" style="width: 120px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;"></label>
                    <label>季数：<input type="number" id="seasonNumber" value="1" style="width: 50px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;"></label>
                    <label><input type="checkbox" id="autoSeasonEpisode" checked> 自动季集</label>
                    <label>自定义起始集数：<input type="number" id="customStartEpisode" value="1" style="width: 50px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;"></label>
                </div>
                <div id="regexOptions" style="display: none; margin-top: 10px;">
                    <label>匹配：<input type="text" id="regexPattern" placeholder="输入正则表达式" style="width: 150px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;"></label>
                    <label style="margin-left: 10px;">替换：<input type="text" id="replacePattern" placeholder="替换内容" style="width: 150px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;"></label>
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="applyRenameButton" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">应用重命名</button>
                <button id="closeModalButton" style="padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <div style="flex: 1; margin-right: 20px;">
                    <strong>文件列表:</strong>
                    <div><label><input type="checkbox" id="selectAllCheckbox"> 全选</label></div>
                    <ul id="fileList" style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; list-style: none; margin-top: 5px;"></ul>
                    <div id="selectionCount" style="margin-top: 5px; color: green;">已选中 0/0 文件</div>
                </div>
                <div style="flex: 1;">
                    <strong>修改后名称预览:</strong>
                    <ul id="previewList" style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; list-style: none; margin-top: 5px;"></ul>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  
    // 打开模态弹窗
    triggerButton.onclick = () => {
        console.log("批量重命名按钮已点击");
        modal.style.display = 'flex';
        loadFileList();
    };
  
    // 关闭模态弹窗
    document.getElementById('closeModalButton').onclick = () => {
        console.log("关闭模态弹窗");
        modal.style.display = 'none';
    };
  
    // 切换模式显示
    document.querySelectorAll('input[name="mode"]').forEach((radio) => {
        radio.onclick = () => {
            const regexMode = (radio.value === 'regex');
            console.log("模式切换:", regexMode ? "正则模式" : "剧集模式");
            document.getElementById('seriesOptions').style.display = regexMode ? 'none' : 'flex';
            document.getElementById('regexOptions').style.display = regexMode ? 'block' : 'none';
            updatePreview();
        };
    });

    // Quark 网盘重命名请求函数
    async function renameFileOnQuark(fileId, newFileName) {
        console.log("尝试重命名文件 ID:", fileId, "到新文件名:", newFileName);
        try {
            const cookies = document.cookie; // 获取当前页面的 Cookies
            const response = await fetch("https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookies  // 添加 Cookies
                },
                body: JSON.stringify({ fid: fileId, file_name: newFileName })
            });
            
            if (!response.ok) {
                console.error("重命名失败，状态码:", response.status);
                const errorText = await response.text();
                console.error("错误信息:", errorText);
                return;
            }
            
            const result = await response.json();
            console.log("重命名响应成功:", result);
        } catch (error) {
            console.error("请求执行异常:", error);
        }
    }

    // 应用重命名
    document.getElementById('applyRenameButton').onclick = async () => {
        console.log("应用重命名按钮已点击");
        const fileList = document.getElementById('fileList');
        document.querySelectorAll(".ant-table-row-selected").forEach(async (el, index) => {
            const fileId = el.getAttribute("data-row-key");
            const fileNameElement = el.querySelector(".filename-text");
            const originalFileName = fileNameElement ? fileNameElement.textContent : "";

            console.log(`处理文件: ${originalFileName}，文件 ID: ${fileId}`);

            const previewList = document.getElementById('previewList');
            const previewItem = Array.from(previewList.children)[index];
            const newFileName = previewItem ? previewItem.innerText : originalFileName;

            if (fileId && newFileName && fileNameElement) {
                console.log(`正在重命名文件 "${originalFileName}" 为 "${newFileName}"`);
                fileNameElement.innerText = newFileName;  // 更新本地显示
                await renameFileOnQuark(fileId, newFileName);  // 调用 API 重命名文件
            } else {
                console.warn("跳过文件，缺少数据:", { fileId, newFileName, originalFileName });
            }
        });

        alert('重命名已应用，页面即将自动刷新。');
        setTimeout(() => {
            location.reload();
        }, 1000);  // 延迟 1 秒后自动刷新页面
        modal.style.display = 'none';
    };

    // 加载文件列表和其他代码保持不变
    // ... 省略了重复的其他代码部分


    // 加载文件列表
    function loadFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = ''; // 清空文件列表
        const fileElements = document.querySelectorAll('.filename-text.editable-cell.editable-cell-allow');
        if (fileElements.length === 0) {
            console.warn("未找到任何文件名元素，请检查选择器。");
        }
        fileElements.forEach((element, index) => {
            const fileName = element.innerText;
            const listItem = document.createElement('li');
            listItem.style = 'display: flex; align-items: center; margin-bottom: 5px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.onchange = () => updateSelectionCount();
            const fileLabel = document.createElement('span');
            fileLabel.innerText = fileName;
            fileLabel.style = 'margin-left: 10px;';
            listItem.appendChild(checkbox);
            listItem.appendChild(fileLabel);
            fileList.appendChild(listItem);
        });
        console.log("文件列表加载完成，共", fileElements.length, "个文件");
        updateSelectionCount(); // 更新初始选择计数
        updatePreview();
    }

    function updateSelectionCount() {
        const fileList = document.getElementById('fileList');
        const total = fileList.children.length;
        const selected = Array.from(fileList.querySelectorAll('input[type="checkbox"]:checked')).length;
        console.log(`已选择 ${selected} 个文件，共 ${total} 个文件`);
        document.getElementById('selectionCount').innerText = `已选中 ${selected}/${total} 文件`;
    }

    function updatePreview() {
        const fileList = document.getElementById('fileList');
        const previewList = document.getElementById('previewList');
        previewList.innerHTML = ''; // 清空预览列表
        const seriesName = document.getElementById('seriesName').value;
        const seasonNumber = parseInt(document.getElementById('seasonNumber').value);
        const customStartEpisode = parseInt(document.getElementById('customStartEpisode').value) || 1;
        const autoSeasonEpisode = document.getElementById('autoSeasonEpisode').checked;
        const regexPattern = document.getElementById('regexPattern').value;
        const replacePattern = document.getElementById('replacePattern').value;
        const regexMode = document.querySelector('input[name="mode"]:checked').value === 'regex';
        let currentEpisode = customStartEpisode;
        Array.from(fileList.children).forEach((item, index) => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const fileLabel = item.querySelector('span');
            const originalFileName = fileLabel.innerText;
            const previewItem = document.createElement('li');
            previewItem.style = 'margin-bottom: 5px;';
            let newFileName;
            if (checkbox.checked) {
                if (regexMode) {
                    try {
                        const regex = new RegExp(regexPattern, 'g');
                        newFileName = regex.test(originalFileName) ? originalFileName.replace(regex, replacePattern) : originalFileName;
                    } catch (e) {
                        newFileName = '正则表达式错误';
                    }
                } else {
                    if (autoSeasonEpisode) {
                        const fileParts = originalFileName.split('.');
                        const extension = fileParts.pop();
                        const seriesPrefix = seriesName ? `${seriesName}.` : '';
                        newFileName = `${fileParts.join('.')}.${seriesPrefix}S${String(seasonNumber).padStart(2, '0')}E${String(currentEpisode).padStart(2, '0')}.${extension}`;
                        currentEpisode++;
                    } else {
                        newFileName = seriesName ? `${seriesName}.${originalFileName}` : originalFileName;
                    }
                }
            } else {
                newFileName = originalFileName;
            }
            previewItem.innerText = newFileName ? newFileName : '';
            previewList.appendChild(previewItem);
        });
        console.log("预览更新完成");
        updateSelectionCount();
    }

    document.getElementById('seriesName').addEventListener('input', updatePreview);
    document.getElementById('seasonNumber').addEventListener('input', updatePreview);
    document.getElementById('customStartEpisode').addEventListener('input', updatePreview);
    document.getElementById('autoSeasonEpisode').addEventListener('change', updatePreview);
    document.getElementById('regexPattern').addEventListener('input', updatePreview);
    document.getElementById('replacePattern').addEventListener('input', updatePreview);
    document.querySelectorAll('input[name="mode"]').forEach((radio) => {
        radio.addEventListener('change', updatePreview);
    });
})();
