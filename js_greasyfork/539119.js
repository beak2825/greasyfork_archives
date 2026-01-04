// ==UserScript==
// @name         Bangumi 关联人物职位查询
// @namespace    https://bangumi.tv
// @version      3.0
// @description  在关联人物编辑页面快速查看人物最近参与的职位信息
// @author       wqahfaoihgfpo
// @match        https://bgm.tv/subject/*/add_related/person
// @match        https://bangumi.tv/subject/*/add_related/person
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539119/Bangumi%20%E5%85%B3%E8%81%94%E4%BA%BA%E7%89%A9%E8%81%8C%E4%BD%8D%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/539119/Bangumi%20%E5%85%B3%E8%81%94%E4%BA%BA%E7%89%A9%E8%81%8C%E4%BD%8D%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .position-helper-container {
            margin: 10px 0;
            display: flex;
            justify-content: flex-start;
        }
        .position-btn {
            padding: 5px 15px;
            font-size: 12px;
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
            box-sizing: border-box;
            height: 28px;
            line-height: 16px;
        }
        .position-btn.fetching {
            background-color: #f5f5f5;
            color: #999;
            border-color: #ddd;
        }
        .position-btn.fetching:hover {
            background-color: #ffebee;
            color: #c62828;
            border-color: #ffcdd2;
        }
        .position-tags {
            display: flex;
            flex-wrap: nowrap;
            margin-left: 5px;
            vertical-align: middle;
            max-width: 70%;
            overflow: hidden;
        }
        .position-tag {
            flex: 0 0 auto;
            padding: 2px 6px;
            background-color: #e6f2ff;
            border-radius: 3px;
            color: #0066cc;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 3px;
            border: 1px solid #b8d9ff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .position-tag.unmatched {
            background-color: #f0f0f0;
            color: #666;
            border-color: #ddd;
        }
        .position-indicator {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 5px;
        }
        .position-indicator.error {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
        }
        .position-indicator.loading {
            background-color: #fff8e1;
            color: #ff8f00;
            border: 1px solid #ffe082;
        }
        .matched-position {
            color: #0066cc;
            font-weight: bold;
        }
        .position-more {
            flex: 0 0 auto;
            padding: 2px 6px;
            background-color: #f0f0f0;
            border-radius: 3px;
            color: #666;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 3px;
            border: 1px solid #ddd;
            cursor: pointer;
            white-space: nowrap;
        }
        .position-popup {
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.5;
        }
        .position-popup ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .position-popup li {
            padding: 3px 0;
            border-bottom: 1px solid #eee;
        }
        .position-popup li:last-child {
            border-bottom: none;
        }
        .crtRelatedLeft li .title {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            position: relative;
        }
    `);

    // 创建辅助容器
    function createHelperContainer() {
        const container = document.createElement('div');
        container.className = 'position-helper-container';
        container.innerHTML = `
            <button id="fetchPositions" class="position-btn inputBtn">获取职位</button>
        `;
        return container;
    }

    // 获取人物ID
    function getPersonId(link) {
        const match = link.href.match(/person\/(\d+)/);
        return match ? match[1] : null;
    }

    // 全局变量存储当前打开的弹出层
    let currentPopup = null;
    // 缓存已请求的人物职位数据
    const positionCache = new Map();

    // 关闭所有弹出层
    function closeAllPopups() {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }
        document.removeEventListener('click', closeAllPopups);
    }

    // 显示职位详情弹出层
    function showPositionPopup(positions, targetElement) {
        closeAllPopups();

        const popup = document.createElement('div');
        popup.className = 'position-popup';

        const list = document.createElement('ul');
        positions.forEach(pos => {
            const item = document.createElement('li');
            item.textContent = `${pos.name} (${pos.count}次)`;
            list.appendChild(item);
        });

        popup.appendChild(list);

        // 定位弹出层
        const rect = targetElement.getBoundingClientRect();
        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.bottom + 5}px`;

        document.body.appendChild(popup);
        currentPopup = popup;

        // 添加全局点击事件关闭弹出层
        setTimeout(() => {
            document.addEventListener('click', closeAllPopups);
        }, 100);

        // 阻止弹出层内部点击事件冒泡
        popup.addEventListener('click', e => {
            e.stopPropagation();
        });
    }

    // 获取人物职位信息
    function fetchPersonPosition(personId, titleElement) {
        return new Promise((resolve) => {
            // 检查是否已有职位信息元素
            let positionSpan = titleElement.querySelector('.position-indicator');
            if (!positionSpan) {
                positionSpan = document.createElement('span');
                positionSpan.className = 'position-indicator loading';
                titleElement.appendChild(positionSpan);
            }

            // 检查缓存
            if (positionCache.has(personId)) {
                const positions = positionCache.get(personId);
                processPositionData(positions, titleElement);
                resolve(positions);
                return;
            }

            // 设置加载状态
            positionSpan.textContent = '加载中...';
            positionSpan.className = 'position-indicator loading';

            // 请求人物作品页面
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://bgm.tv/person/${personId}/works`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            // 创建临时容器解析HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = response.responseText;

                            const positions = parsePositionGroups(tempDiv);
                            positionCache.set(personId, positions); // 缓存结果

                            if (positions.length > 0) {
                                processPositionData(positions, titleElement);
                            } else {
                                positionSpan.textContent = '无职位信息';
                                positionSpan.className = 'position-indicator error';
                            }

                            resolve(positions);
                        } catch (e) {
                            console.error("解析失败:", e);
                            positionSpan.textContent = '解析失败';
                            positionSpan.className = 'position-indicator error';
                            resolve(null);
                        }
                    } else {
                        positionSpan.textContent = '获取失败';
                        positionSpan.className = 'position-indicator error';
                        resolve(null);
                    }
                },
                onerror: function() {
                    positionSpan.textContent = '请求失败';
                    positionSpan.className = 'position-indicator error';
                    resolve(null);
                }
            });
        });
    }

    // 处理职位数据并更新UI
    function processPositionData(positions, titleElement) {
        // 移除加载指示器
        const positionSpan = titleElement.querySelector('.position-indicator');
        if (positionSpan) positionSpan.remove();

        // 创建职位标签容器
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'position-tags';
        titleElement.appendChild(tagsContainer);

        // 获取当前条目的职位备选框
        const liElement = titleElement.closest('li');
        const selectElement = liElement.querySelector('select[name^="infoArr"]');

        // 获取备选框中的所有职位选项的纯文本
        const positionOptions = Array.from(selectElement.options).map(opt => {
            // 提取纯职位名称（去除斜杠后的内容）
            return opt.text.split('/')[0].trim();
        });

        // 分离匹配和非匹配职位
        const matchedPositions = [];
        const unmatchedPositions = [];

        positions.forEach(pos => {
            if (positionOptions.includes(pos.name)) {
                matchedPositions.push(pos);
            } else {
                unmatchedPositions.push(pos);
            }
        });

        // 排序：匹配职位按次数降序，非匹配职位也按次数降序
        matchedPositions.sort((a, b) => b.count - a.count);
        unmatchedPositions.sort((a, b) => b.count - a.count);

        // 合并职位列表：先匹配职位，后非匹配职位
        const allPositions = [...matchedPositions, ...unmatchedPositions];

        // 确定要显示的职位数量
        let displayCount = Math.min(2, allPositions.length);

        // 只取前N个职位
        const displayPositions = allPositions.slice(0, displayCount);

        // 使用文档片段优化DOM操作
        const fragment = document.createDocumentFragment();

        // 添加职位标签
        displayPositions.forEach(pos => {
            const tag = document.createElement('span');
            tag.className = 'position-tag';
            tag.title = pos.name;

            // 检查是否匹配
            if (!positionOptions.includes(pos.name)) {
                tag.className += ' unmatched';
            }

            // 限制显示长度
            let displayText = pos.name;
            if (displayText.length > 20) {
                displayText = displayText.substring(0, 18) + '...';
            }

            tag.textContent = displayText;
            fragment.appendChild(tag);
        });

        // 如果有更多职位，添加"更多"指示器
        if (allPositions.length > displayCount) {
            const moreTag = document.createElement('span');
            moreTag.className = 'position-more';
            moreTag.textContent = `+${allPositions.length - displayCount}更多`;

            // 添加点击事件显示弹出层
            moreTag.addEventListener('click', function(e) {
                e.stopPropagation();
                showPositionPopup(allPositions, moreTag);
            });

            fragment.appendChild(moreTag);
        }

        tagsContainer.appendChild(fragment);

        // 更新备选框顺序
        updatePositionSelect(selectElement, positions, positionOptions);
    }

    // 解析职位组信息（优化版，只保留一种方法）
    function parsePositionGroups(container) {
        const positions = [];

        // 方法：从作品条目中获取职位信息
        const workItems = container.querySelectorAll('#browserItemList > li');
        const positionCounts = {};

        for (const item of workItems) {
            const positionTags = item.querySelectorAll('.badge_job');
            for (const tag of positionTags) {
                const positionName = tag.textContent.trim();
                positionCounts[positionName] = (positionCounts[positionName] || 0) + 1;
            }
        }

        // 转换为数组并按次数排序
        for (const [name, count] of Object.entries(positionCounts)) {
            positions.push({ name, count });
        }

        // 按次数降序排序
        positions.sort((a, b) => b.count - a.count);

        return positions;
    }

    // 更新职位下拉框顺序（保留原有选择）
    function updatePositionSelect(selectElement, positions, positionOptions) {
        // 获取当前选中的值
        const selectedValue = selectElement.value;

        // 获取所有选项
        const options = Array.from(selectElement.options);

        // 创建匹配选项数组
        const matchedOptions = [];
        const optionMap = new Map();

        // 创建选项映射（使用纯职位名称）
        options.forEach(opt => {
            const pureText = opt.text.split('/')[0].trim();
            optionMap.set(pureText, opt);
        });

        // 找出匹配的职位（按次数排序）
        positions.forEach(pos => {
            if (positionOptions.includes(pos.name) && optionMap.has(pos.name)) {
                matchedOptions.push({
                    option: optionMap.get(pos.name),
                    count: pos.count
                });
            }
        });

        // 按出现次数排序匹配的选项
        matchedOptions.sort((a, b) => b.count - a.count);

        // 创建新的选项列表
        const newOptions = [];

        // 第一步：添加当前已选中的选项（如果有）
        if (selectedValue) {
            const selectedOption = options.find(opt => opt.value === selectedValue);
            if (selectedOption) {
                const pureText = selectedOption.text.split('/')[0].trim();
                const isMatched = matchedOptions.some(m => m.option.value === selectedOption.value);

                const option = document.createElement('option');
                option.value = selectedOption.value;
                option.text = selectedOption.text;
                if (isMatched) {
                    option.className = 'matched-position';
                }
                newOptions.push(option);
            }
        }

        // 第二步：添加匹配选项（排除已添加的选中项）
        matchedOptions.forEach(item => {
            if (!selectedValue || item.option.value !== selectedValue) {
                const option = document.createElement('option');
                option.value = item.option.value;
                option.text = item.option.text;
                option.className = 'matched-position';
                newOptions.push(option);
            }
        });

        // 第三步：添加其他选项（排除已添加的选项）
        options.forEach(opt => {
            const pureText = opt.text.split('/')[0].trim();
            if (!matchedOptions.some(m => m.option.value === opt.value) &&
                (!selectedValue || opt.value !== selectedValue)) {
                const option = document.createElement('option');
                option.value = opt.value;
                option.text = opt.text;
                newOptions.push(option);
            }
        });

        // 清空并重新填充下拉框
        selectElement.innerHTML = '';
        newOptions.forEach(opt => selectElement.appendChild(opt));

        // 恢复原始选择
        if (selectedValue) {
            selectElement.value = selectedValue;
        }
    }

    // 获取所有人物职位信息
    async function fetchAllPositions(btn) {
        // 设置按钮状态
        btn.classList.add('fetching');
        btn.textContent = '获取中... (点击停止)';

        // 获取所有人物条目（包括新添加的）
        const items = document.querySelectorAll('#crtRelateSubjects > li');
        let stopRequested = false;

        // 添加停止事件监听
        const stopHandler = () => {
            stopRequested = true;
            btn.textContent = '获取职位';
            btn.classList.remove('fetching');
        };
        btn.addEventListener('click', stopHandler, { once: true });

        for (const item of items) {
            if (stopRequested) break;

            const titleElement = item.querySelector('p.title');
            if (!titleElement) continue;

            const link = titleElement.querySelector('a.l');
            if (!link) continue;

            const personId = getPersonId(link);
            if (!personId) continue;

            // 如果已有职位信息且不是错误状态，则跳过
            const existingIndicator = titleElement.querySelector('.position-tags');
            if (existingIndicator) {
                continue;
            }

            // 获取职位信息
            await fetchPersonPosition(personId, titleElement);

            // 添加延迟避免请求过快（增加延迟到2秒）
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 清理状态
        btn.textContent = '获取职位';
        btn.classList.remove('fetching');
    }

    // 初始化脚本
    function init() {
        // 在编辑摘要输入框下方添加按钮
        const editSummary = document.getElementById('editSummary');
        if (!editSummary) return;

        // 查找编辑摘要容器
        let container = editSummary.parentNode;
        while (container && !container.classList.contains('clearit')) {
            container = container.parentNode;
        }

        if (!container) return;

        // 创建容器并插入到编辑摘要后面
        const helperContainer = createHelperContainer();
        container.appendChild(helperContainer);

        // 添加事件监听
        const fetchBtn = document.getElementById('fetchPositions');
        fetchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!this.classList.contains('fetching')) {
                fetchAllPositions(this);
            }
        });
    }


    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听新添加的人物
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                const fetchBtn = document.getElementById('fetchPositions');
                if (fetchBtn && fetchBtn.classList.contains('fetching')) {
                    // 如果正在获取中，自动获取新添加人物的职位
                    const newItems = document.querySelectorAll('#crtRelateSubjects > li');
                    const lastItem = newItems[newItems.length - 1];

                    if (lastItem) {
                        const titleElement = lastItem.querySelector('p.title');
                        if (titleElement) {
                            const link = titleElement.querySelector('a.l');
                            if (link) {
                                const personId = getPersonId(link);
                                if (personId) {
                                    fetchPersonPosition(personId, titleElement);
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    // 开始观察关联人物列表的变化
    const crtRelateSubjects = document.getElementById('crtRelateSubjects');
    if (crtRelateSubjects) {
        observer.observe(crtRelateSubjects, {
            childList: true,
            subtree: false
        });
    }
})();