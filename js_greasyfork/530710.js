// ==UserScript==
// @name         位导の自动分镜助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为创景平台添加自动分镜头功能，支持DeepSeek智能分镜
// @author       Your name
// @match        https://www.chanjing.cc/worktable*
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530710/%E4%BD%8D%E5%AF%BC%E3%81%AE%E8%87%AA%E5%8A%A8%E5%88%86%E9%95%9C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530710/%E4%BD%8D%E5%AF%BC%E3%81%AE%E8%87%AA%E5%8A%A8%E5%88%86%E9%95%9C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更新样式
    const style = document.createElement('style');
    style.textContent = `
        .director-entry {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            top: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }

        .director-entry img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;  /* 确保图片比例正确 */
        }

        .auto-shot-panel {
            position: fixed;
            right: 20px;
            top: 20px;
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            width: 800px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
        }

        .shot-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .shot-table tr {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            width: 100%;
        }

        .shot-table td {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 12px;
        }

        .shot-input {
            width: 80px;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
        }

        .text-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
        }

        .row-controls {
            display: flex;
            gap: 4px;
            flex-shrink: 0;
        }

        .row-btn {
            padding: 4px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #f0f0f0;
            transition: background 0.2s;
        }

        .row-btn:hover {
            background: #e0e0e0;
        }

        .action-btn {
            width: 100%;
            padding: 12px;
            background: #FC885E;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: opacity 0.2s;
        }

        .action-btn:hover {
            opacity: 0.9;
        }

        .auto-shot-step1 {
            position: fixed;
            right: 20px;
            top: 20px;
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            width: 800px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
        }

        .script-input {
            width: 100%;
            height: 300px;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin-bottom: 15px;
            resize: vertical;
            font-family: inherit;
        }

        .shot-settings {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 15px;
        }

        .shot-setting-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .shot-setting-group label {
            min-width: 80px;
            font-weight: 500;
        }

        .shot-setting-group select {
            flex: 1;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
        }

        .shot-controls {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 10px;
        }

        .shot-control-btn {
            padding: 4px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #f0f0f0;
            transition: background 0.2s;
        }

        .shot-control-btn:hover {
            background: #e0e0e0;
        }

        .next-btn {
            width: 100%;
            padding: 12px;
            background: #FC885E;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: opacity 0.2s;
        }

        .next-btn:hover {
            opacity: 0.9;
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            display: none;
        }

        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 6px solid #f3f3f3;
            border-top: 6px solid #FC885E;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .shot-preview-container {
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
        }

        .shot-preview-item {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .shot-preview-item.selected {
            border-color: #FC885E;
            background: rgba(252, 136, 94, 0.05);
        }

        .shot-preview-img {
            width: 100%;
            height: 80px;
            object-fit: contain;
            border-radius: 4px;
            background: #f5f5f5;
        }

        .shot-preview-caption {
            font-size: 12px;
            color: #333;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // 获取本地存储的数据
    function getStoredData() {
        const stored = localStorage.getItem('autoShotData');
        if (stored) {
            return JSON.parse(stored);
        }
        return [
            { shot: 1, text: '大家好我是位毛，这是我的新呆毛，功能是自动添加分镜头脚本' },
            { shot: 2, text: '目前仅支持新建全新的数字人，不能打开老工程使用' },
            { shot: 3, text: '我也不想把功能搞得太完善，不然产品化后我的外挂失效了，我会很失落（bushi）' }
        ];
    }

    // 保存数据到本地存储
    function saveData() {
        const rows = Array.from(document.querySelectorAll('#shotTable tr')).map(row => ({
            shot: row.querySelector('.shot-input').value,
            text: row.querySelector('.text-input').value
        }));
        localStorage.setItem('autoShotData', JSON.stringify(rows));
    }

    // 获取下一个分镜号
    function getNextShotNumber(currentShot) {
        const nextShot = (parseInt(currentShot) % 15) + 1;
        return nextShot;
    }

    // 修改行创建函数
    function createRow(shotNum = '', text = '') {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <select class="shot-input">
                    ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n =>
                        `<option value="${n}" ${n === parseInt(shotNum) ? 'selected' : ''}>${n}</option>`
                    ).join('')}
                </select>
                <input type="text" class="text-input" placeholder="请输入台词" value="${text.replace(/"/g, '&quot;')}">
                <div class="row-controls">
                    <button class="row-btn add-row">+</button>
                    <button class="row-btn remove-row">-</button>
                </div>
            </td>
        `;
        return tr;
    }

    // 创建入口按钮
    const entry = document.createElement('div');
    entry.className = 'director-entry';
    entry.innerHTML = `
        <img src="https://img.weimao.me/ipic/2025-03-21-GIF%20%E5%A4%B4%E5%83%8F%20600k.gif" alt="导演图标">
        <span>导演台本输入</span>
    `;
    document.body.appendChild(entry);

    // 重要：创建第二步界面（原始分镜界面）
    const panel = document.createElement('div');
    panel.className = 'auto-shot-panel';
    panel.innerHTML = `
        <table class="shot-table" id="shotTable">
            <tbody></tbody>
        </table>
        <div style="display: flex; gap: 10px;">
            <button class="action-btn" id="backBtn" style="flex: 1; background: #4A89DC;">返回</button>
            <button class="action-btn" id="actionBtn" style="flex: 2;">Action！</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 初始化第二步界面中的表格内容
    const tbody = panel.querySelector('#shotTable tbody');
    getStoredData().forEach(row => {
        tbody.appendChild(createRow(row.shot, row.text));
    });

    // 存储机位配置
    let cameraPositions = [
        { name: '机位1', shotNumber: 1 },
        { name: '机位2', shotNumber: 2 },
        { name: '机位3', shotNumber: 3 }
    ];

    // 创建第一步界面
    const step1Panel = document.createElement('div');
    step1Panel.className = 'auto-shot-step1';
    step1Panel.innerHTML = `
        <h2 style="margin-top: 0; margin-bottom: 15px;">台本自动分镜</h2>
        <textarea class="script-input" placeholder="请输入完整台本..."></textarea>
        <div id="shotSettings" class="shot-settings">
            ${generateShotSettingsHTML()}
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="next-btn" id="autoShotBtn" style="flex: 1;">智能分镜</button>
            <button class="next-btn" id="manualShotBtn" style="flex: 1; background: #4A89DC;">手动分镜</button>
        </div>
    `;
    document.body.appendChild(step1Panel);

    // 生成机位设置的HTML
    function generateShotSettingsHTML() {
        let html = '';

        cameraPositions.forEach((position, index) => {
            html += `
            <div class="shot-setting-group" data-index="${index}">
                <label>${position.name}</label>
                <select class="shot-select" data-position="${index}">
                    ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n =>
                        `<option value="${n}" ${n === position.shotNumber ? 'selected' : ''}>${n}</option>`
                    ).join('')}
                </select>
                <button class="shot-control-btn remove-position-btn" data-index="${index}">删除</button>
            </div>`;
        });

        // 添加控制按钮区域
        html += `
        <div class="shot-controls">
            ${cameraPositions.length < 5 ? '<button class="shot-control-btn add-position-btn">添加机位</button>' : ''}
        </div>`;

        return html;
    }

    // 更新机位设置区域
    function updateShotSettings() {
        const shotSettingsContainer = document.getElementById('shotSettings');
        shotSettingsContainer.innerHTML = generateShotSettingsHTML();
    }

    // 创建loading遮罩
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `<div class="loading-spinner"></div>`;
    document.body.appendChild(loadingOverlay);

    // 事件处理
    document.addEventListener('click', async function(e) {
        // 处理添加行
        if (e.target.classList.contains('add-row')) {
            const currentRow = e.target.closest('tr');
            const currentShot = currentRow.querySelector('.shot-input').value;
            const nextShot = getNextShotNumber(currentShot);
            const newRow = createRow(nextShot, '');
            currentRow.after(newRow);
            saveData(); // 保存更新后的数据
        }

        // 处理删除行
        if (e.target.classList.contains('remove-row')) {
            const tbody = document.querySelector('#shotTable tbody');
            // 修改条件，最少保留一行
            if (tbody.children.length > 1) {
                e.target.closest('tr').remove();
                saveData(); // 保存更新后的数据
            } else {
                alert('至少需要保留一行');
            }
        }

        // 处理返回按钮
        if (e.target.id === 'backBtn') {
            // 隐藏第二步界面，显示第一步界面
            panel.style.display = 'none';
            step1Panel.style.display = 'block';

            // 刷新第一步界面的镜头预览
            setTimeout(() => {
                updateStepOneWithPreviews();
            }, 300);
        }

        // Action按钮处理
        if (e.target.id === 'actionBtn') {
            // 保存当前数据
            saveData();

            // 隐藏面板
            document.querySelector('.auto-shot-panel').style.display = 'none';

            const rows = Array.from(document.querySelectorAll('#shotTable tr')).map(row => ({
                shot: row.querySelector('.shot-input').value,
                text: row.querySelector('.text-input').value
            }));

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const isLastRow = i === rows.length - 1;  // 判断是否是最后一行

                // 选择对应的镜头
                const shots = document.querySelectorAll('.custom-list.pack-up .custom-img.drag-child');
                const targetShot = shots[row.shot - 1];
                if (targetShot) {
                    targetShot.click();

                    // 等待编辑器加载
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // 填入台词
                    const editor = document.querySelector('.com-script-editor .ProseMirror');
                    if (editor) {
                        editor.innerHTML = `<p>${row.text}</p>`;
                        const event = new Event('input', { bubbles: true });
                        editor.dispatchEvent(event);
                    }

                    // 收起时间轴
                    const unfoldBtn = document.querySelector('.unfold-label.unfold');
                    if (unfoldBtn) unfoldBtn.click();

                    await new Promise(resolve => setTimeout(resolve, 300));

                    // 只在不是最后一行时添加新镜头
                    if (!isLastRow) {
                        const addBtn = document.querySelector('.add-button');
                        if (addBtn) addBtn.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
        }

        // 智能分镜按钮处理
        if (e.target.id === 'autoShotBtn') {
            const script = document.querySelector('.script-input').value.trim();
            if (!script) {
                alert('请输入台本内容');
                return;
            }

            // 获取所有机位的镜头号
            const shotPositions = cameraPositions.map(position => position.shotNumber);

            const results = await callDeepSeekAPI(script, shotPositions);

            if (results && results.length > 0) {
                console.log('填充结果到第二步界面:', results);
                fillStepTwoWithResults(results);

                // 隐藏第一步，显示第二步
                step1Panel.style.display = 'none';
                panel.style.display = 'block';
            } else {
                alert('分镜结果为空，请重试');
            }
        }

        // 手动分镜按钮处理
        if (e.target.id === 'manualShotBtn') {
            const script = document.querySelector('.script-input').value.trim();

            // 获取主机位
            const mainShot = cameraPositions[0].shotNumber;

            // 处理脚本内容
            let results = [];

            if (script) {
                // 如果有内容，按行分割
                const lines = script.split('\n').filter(line => line.trim());
                results = lines.map(line => ({
                    shot: mainShot,
                    text: line.trim()
                }));
            }

            // 如果没有内容或内容为空，创建一个默认行
            if (results.length === 0) {
                results = [{ shot: mainShot, text: '' }];
            }

            // 填充结果到第二步界面
            fillStepTwoWithResults(results);

            // 隐藏第一步，显示第二步
            step1Panel.style.display = 'none';
            panel.style.display = 'block';
        }

        // 添加机位按钮处理
        if (e.target.classList.contains('add-position-btn')) {
            if (cameraPositions.length < 5) {
                const newPosition = {
                    name: `机位${cameraPositions.length + 1}`,
                    shotNumber: cameraPositions.length + 1
                };
                cameraPositions.push(newPosition);
                updateShotSettings();
                updatePreviewSelection();
            }
        }

        // 删除机位按钮处理
        if (e.target.classList.contains('remove-position-btn')) {
            if (cameraPositions.length > 1) {
                const index = parseInt(e.target.getAttribute('data-index'));
                cameraPositions.splice(index, 1);

                // 更新剩余机位的名称
                cameraPositions.forEach((position, i) => {
                    position.name = `机位${i + 1}`;
                });

                updateShotSettings();
                updatePreviewSelection();
            } else {
                alert('至少需要保留一个机位');
            }
        }
    });

    // 监听输入变化，实时保存
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('shot-input') ||
            e.target.classList.contains('text-input')) {
            saveData();
        }

        // 监听机位镜头选择器的变化
        if (e.target.classList.contains('shot-select')) {
            const positionIndex = parseInt(e.target.getAttribute('data-position'));
            const newShotNumber = parseInt(e.target.value);
            cameraPositions[positionIndex].shotNumber = newShotNumber;
            updatePreviewSelection();
        }
    });

    // 修改入口按钮的点击事件，显示第一步界面
    entry.addEventListener('click', function() {
        step1Panel.style.display = 'block';
        panel.style.display = 'none'; // 确保第二步界面隐藏
        // 延迟获取镜头预览，确保DOM已加载
        setTimeout(() => {
            updateStepOneWithPreviews();
        }, 500);
    });

    // 调用DeepSeek API进行自动分镜 - 使用优化后的prompt
    async function callDeepSeekAPI(script, shotPositions) {
        loadingOverlay.style.display = 'flex';

        // 构建机位描述
        let positionsDesc = '';
        cameraPositions.forEach((pos, index) => {
            positionsDesc += `- ${pos.name}(镜头${pos.shotNumber})：${getPositionDescription(index)}\n`;
        });

        const prompt = `请以专业导演的视角，将以下台本进行分句并安排合适的镜头，确保内容生动有趣且信息传递高效。

【角色设定】
在分镜过程中，请同时以两种视角思考：
1. 热情引导者：关注台词的情感表达和观众体验，选择能引起共鸣的镜头
2. 冷静分析者：关注信息传递的逻辑和节奏，确保镜头安排合理高效

【分镜规则】
${positionsDesc}

【重要限制】
你只能在以下镜头号中选择：${cameraPositions.map(pos => pos.shotNumber).join('、')}
不允许使用其他任何镜头号，必须严格遵守这一限制。

【注意事项】
1. 不要修改任何原始台词内容
2. 根据台词内容、表达情感和信息重要性选择合适的机位
3. 确保分镜安排与内容节奏相匹配，不要过于频繁切换机位
4. 为观众营造专业、有趣且易于理解的视觉体验
5. 输出格式必须严格遵守：分镜号 + 空格 + 台词，每行一句

台本内容：
${script}`;

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-d4102372de644218bc71c6c59ddcdeb7'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            console.log('DeepSeek API 响应:', data);

            if (data.choices && data.choices.length > 0) {
                const parsedResults = parseDeepSeekResponse(data.choices[0].message.content);
                console.log('解析结果:', parsedResults);
                return parsedResults;
            } else {
                console.error('DeepSeek API 返回异常:', data);
                throw new Error('获取DeepSeek响应失败');
            }
        } catch (error) {
            console.error('调用DeepSeek API出错:', error);
            alert('自动分镜失败，请检查网络或重试: ' + error.message);
            return null;
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    // 获取不同机位的描述
    function getPositionDescription(index) {
        const descriptions = [
            '用于常规表达和基础信息传递',
            '用于转场、过渡或辅助说明',
            '用于强调重点、情感表达或关键内容',
            '用于对话场景和互动表现',
            '用于特殊视角和氛围营造'
        ];

        return descriptions[index] || '用于内容展示';
    }

    // 解析DeepSeek响应
    function parseDeepSeekResponse(content) {
        console.log('解析原始响应:', content);

        const lines = content.split('\n').filter(line => line.trim());
        const result = [];

        // 获取有效的镜头号列表
        const validShotNumbers = cameraPositions.map(pos => pos.shotNumber.toString());
        // 默认使用第一个机位的镜头号
        const defaultShotNumber = validShotNumbers[0];

        for (const line of lines) {
            // 尝试匹配 "数字 文本" 的格式
            const match = line.match(/^(\d+)\s+(.+)$/);
            if (match) {
                let shotNumber = match[1];

                // 检查镜头号是否在有效列表中，如果不在则使用默认镜头号
                if (!validShotNumbers.includes(shotNumber)) {
                    console.log(`镜头号 ${shotNumber} 不在有效列表中，使用默认镜头号 ${defaultShotNumber}`);
                    shotNumber = defaultShotNumber;
                }

                result.push({
                    shot: shotNumber,
                    text: match[2]
                });
            }
        }

        return result;
    }

    // 用解析的结果填充第二步界面
    function fillStepTwoWithResults(results) {
        const tbody = document.querySelector('#shotTable tbody');
        if (!tbody) {
            console.error('未找到表格主体元素');
            return;
        }

        // 清空现有内容
        tbody.innerHTML = '';

        // 填充新内容
        for (const row of results) {
            const tr = createRow(row.shot, row.text);
            tbody.appendChild(tr);
        }

        // 保存到本地存储
        saveData();
    }

    // 获取镜头缩略图
    function getShotPreviews() {
        const shotImages = document.querySelectorAll('.custom-list.pack-up .custom-img.drag-child');
        const previews = [];

        shotImages.forEach((img, index) => {
            if (index < 15) { // 只取前15个
                const imgSrc = img.src || img.querySelector('img')?.src || '';
                previews.push({
                    index: index + 1,
                    src: imgSrc
                });
            }
        });

        return previews;
    }

    // 创建缩略图HTML
    function createPreviewsHTML(previews) {
        if (!previews || previews.length === 0) {
            return '<div class="shot-preview-container"><p>未找到可用的镜头预览</p></div>';
        }

        let html = '<div class="shot-preview-container">';
        previews.forEach(preview => {
            html += `
                <div class="shot-preview-item" data-shot="${preview.index}">
                    <img src="${preview.src}" class="shot-preview-img" alt="镜头 ${preview.index}">
                    <div class="shot-preview-caption">镜头 ${preview.index}</div>
                </div>
            `;
        });
        html += '</div>';

        return html;
    }

    // 更新第一步界面，添加机位预览
    function updateStepOneWithPreviews() {
        const shotSettingsContainer = document.querySelector('.shot-settings');
        const previewContainer = document.querySelector('.shot-preview-container');

        if (previewContainer) {
            previewContainer.remove();
        }

        const previews = getShotPreviews();
        const previewsHTML = createPreviewsHTML(previews);

        shotSettingsContainer.insertAdjacentHTML('beforebegin', previewsHTML);

        // 添加选中效果
        updatePreviewSelection();
    }

    // 更新缩略图选中状态
    function updatePreviewSelection() {
        // 获取所有机位的镜头号
        const selectedShots = cameraPositions.map(pos => pos.shotNumber.toString());

        document.querySelectorAll('.shot-preview-item').forEach(item => {
            item.classList.remove('selected');
            const shotIndex = item.getAttribute('data-shot');

            // 检查这个镜头是否被任何机位使用
            const positionIndex = selectedShots.indexOf(shotIndex);
            if (positionIndex !== -1) {
                item.classList.add('selected');
                item.querySelector('.shot-preview-caption').textContent = `镜头 ${shotIndex} (${cameraPositions[positionIndex].name})`;
            } else {
                item.querySelector('.shot-preview-caption').textContent = `镜头 ${shotIndex}`;
            }
        });
    }

    // 添加缩略图点击事件
    document.addEventListener('click', function(e) {
        const previewItem = e.target.closest('.shot-preview-item');
        if (previewItem) {
            const shotIndex = previewItem.getAttribute('data-shot');

            // 如果用户点击了预览图，询问设置为哪个机位
            if (cameraPositions.length > 0) {
                const options = cameraPositions.map(pos => pos.name).join('、');
                const selected = window.prompt(`将镜头 ${shotIndex} 设置为哪个机位?\n可选：${options}`, cameraPositions[0].name);

                if (selected) {
                    // 查找匹配的机位
                    for (let i = 0; i < cameraPositions.length; i++) {
                        if (selected.includes(cameraPositions[i].name)) {
                            // 更新机位的镜头号
                            cameraPositions[i].shotNumber = parseInt(shotIndex);
                            // 更新下拉框选项
                            const selectElement = document.querySelector(`.shot-select[data-position="${i}"]`);
                            if (selectElement) {
                                selectElement.value = shotIndex;
                            }
                            updatePreviewSelection();
                            break;
                        }
                    }
                }
            }
        }
    });
})();