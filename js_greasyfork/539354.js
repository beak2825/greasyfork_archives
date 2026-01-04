// ==UserScript==
// @name         青蛙种子标题快修
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  种子标题智能编辑工具：支持方块化拖拽重组、在线保存、多种显示模式、错误方块检测、种子列表页快捷编辑，让标题修复变得简单高效。
// @author       You
// @match        *://www.qingwapt.com/details.php*
// @match        *://new.qingwa.pro/details.php*
// @match        *://www.qingwapt.org/details.php*
// @match        *://www.qingwapt.com/torrents.php*
// @match        *://new.qingwa.pro/torrents.php*
// @match        *://www.qingwapt.org/torrents.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539354/%E9%9D%92%E8%9B%99%E7%A7%8D%E5%AD%90%E6%A0%87%E9%A2%98%E5%BF%AB%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539354/%E9%9D%92%E8%9B%99%E7%A7%8D%E5%AD%90%E6%A0%87%E9%A2%98%E5%BF%AB%E4%BF%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 显示模式：0=标题下方（紧凑）, 1=右侧悬浮, 2=收起图标
    let displayMode = 0;
    let canEdit = false; // 是否可以编辑（能否访问edit页面）
    let torrentId = null; // 种子ID
    let isBlockMode = false; // 是否处于方块编辑模式
    let isDeleteMode = false; // 是否处于删除模式
    let isErrorDetectionEnabled = true; // 是否启用错误检测（默认开启）
    let hasErrors = false; // 是否有错误
    let isListPage = false; // 是否是种子列表页面
    let easterEggEnabled = true; // 设置为 false 可禁用彩蛋

    // 种子列表页面相关状态
    let activeListEditor = null; // 当前活跃的列表编辑器ID

    // 两层方块结构
    let rawBlocks = []; // 原始方块：最基础的单元
    let finalBlocks = []; // 最终方块：用于显示的方块，每个都包含原始方块数组

    let dragState = {
        isDragging: false,
        dragElement: null,
        dragIndex: -1,
        placeholder: null,
        currentContainer: null,
        originalNextSibling: null
    };

    // 定义元素类型和颜色
    const ELEMENT_TYPES = {
        SERIES_NAME: { color: '#d1ecf1', textColor: '#0c5460', name: '剧名' },
        SEASON_EPISODE: { color: '#d4edda', textColor: '#155724', name: '季集' },
        YEAR: { color: '#fff3cd', textColor: '#856404', name: '年份' },
        RESOLUTION: { color: '#f8d7da', textColor: '#721c24', name: '分辨率' },
        REGION_CODE: { color: '#e2e3e5', textColor: '#383d41', name: '地区码' },
        SOURCE_TYPE: { color: '#cce5ff', textColor: '#004085', name: '片源' },
        SPEC: { color: '#ffeaa7', textColor: '#b7651d', name: '规格' },
        HDR_TYPE: { color: '#fdcae1', textColor: '#6f1734', name: 'HDR' },
        VIDEO_CODEC: { color: '#c3e6cb', textColor: '#155724', name: '视频编码' },
        PROFILE: { color: '#a8e6cf', textColor: '#2d5016', name: 'Profile' },
        AUDIO_CODEC: { color: '#bee5eb', textColor: '#0c5460', name: '音频编码' },
        CHANNEL_INFO: { color: '#d4f6ff', textColor: '#0c5460', name: '声道数' },
        OBJECT_AUDIO: { color: '#f3e5f5', textColor: '#6a1b9a', name: '对象信息' },
        STREAMING_SERVICE: { color: '#e1d5e7', textColor: '#6f1734', name: '流媒体' },
        DISC_BRAND: { color: '#ffe6cc', textColor: '#cc5500', name: '碟片品牌' },
        TV_STATION: { color: '#e6f3ff', textColor: '#0066cc', name: '电视台' },
        RELEASE_GROUP: { color: '#e1ecf4', textColor: '#0c5460', name: '制作组' },
        TRACK_INFO: { color: '#ffe4b5', textColor: '#8b5c2a', name: '音轨数' },
        OTHER: { color: '#f8f9fa', textColor: '#6c757d', name: '其他' }
    };

    // 检测方块错误
    function detectBlockErrors(blocks) {
        hasErrors = false; // 重置错误状态

        let allFalse = blocks.map(block => ({ ...block, renderError: false }));

        let result = allFalse;

        const firstSourceOrSpecIndex = result.findIndex(block => block.type === 'SOURCE_TYPE' || block.type === 'SPEC');

        // 检查每个方块类型是否属于不应单独出现的类型
        result.forEach((block, idx) => {
            const errorTypes = [
                'TV_STATION',
                'DISC_BRAND',
                'PROFILE',
                'CHANNEL_INFO',
                'OBJECT_AUDIO'
            ];

            if (errorTypes.includes(block.type)) {
                block.renderError = true;
                return;
            }
            if (block.type == 'RESOLUTION' && firstSourceOrSpecIndex < idx) {
                block.renderError = true; // 分辨率必须在片源或规格之前
                return;
            }
            if (block.type == 'SEASON_EPISODE' && blocks.at(idx - 1)?.type === 'YEAR') {
                block.renderError = true;
                return;
            }
            if (block.type === 'YEAR' && blocks.at(idx + 1)?.type === 'SEASON_EPISODE') {
                block.renderError = true;
                return;
            }
            if (block.type === 'HDR_TYPE' && blocks.at(idx + 1)?.type !== 'VIDEO_CODEC') {
                block.renderError = true;
                return;
            }

            if (block.type === 'VIDEO_CODEC' && blocks.at(idx + 1)?.type !== 'AUDIO_CODEC') {
                block.renderError = true;
                return;
            }
            if (block.type === 'AUDIO_CODEC' && blocks.at(idx - 1)?.type !== 'VIDEO_CODEC') {
                block.renderError = true;
                return;
            }

            if (block.type === 'TRACK_INFO' && blocks.at(idx - 1)?.type !== 'AUDIO_CODEC') {
                block.renderError = true;
                return;
            }
        });

        hasErrors = result.some(block => block.renderError);
        if (!isErrorDetectionEnabled || isDeleteMode)
            return allFalse; // 如果禁用错误检测或处于删除模式，返回所有方块不显示错误
        return result;

    }

    // 检查当前是否有错误方块
    function hasErrorBlocks() {
        return hasErrors;
    }

    // 切换错误检测模式
    function toggleErrorDetection() {
        isErrorDetectionEnabled = !isErrorDetectionEnabled;

        // 更新错误检测按钮状态
        updateErrorDetectionButtons();

        // 重新渲染方块以显示/隐藏错误提示
        renderTitleBlocks(finalBlocks);
    }

    // 更新错误检测按钮的显示状态
    function updateErrorDetectionButtons() {
        const errorBtn = document.getElementById('toggleErrorDetection');
        const errorBtnFloat = document.getElementById('toggleErrorDetectionFloat');
        const hasErrors = hasErrorBlocks();

        // 紧凑模式按钮
        if (errorBtn) {
            if (!hasErrors) {
                // 无错误时：绿色背景，禁用
                errorBtn.textContent = '✓';
                errorBtn.title = '未检测到错误';
                errorBtn.style.background = '#28a745';
                errorBtn.style.color = 'white';
                errorBtn.disabled = true;
                errorBtn.style.opacity = '0.6';
                errorBtn.style.cursor = 'not-allowed';
            } else if (isErrorDetectionEnabled) {
                errorBtn.textContent = '🙈';
                errorBtn.title = '隐藏错误提示';
                errorBtn.style.background = '#fd7e14';
                errorBtn.style.color = 'white';
                errorBtn.disabled = false;
                errorBtn.style.opacity = '1';
                errorBtn.style.cursor = 'pointer';
            } else {
                errorBtn.textContent = '⚠️';
                errorBtn.title = '显示错误提示';
                errorBtn.style.background = '#6c757d';
                errorBtn.style.color = 'white';
                errorBtn.disabled = false;
                errorBtn.style.opacity = '1';
                errorBtn.style.cursor = 'pointer';
            }
        }

        // 悬浮模式按钮
        if (errorBtnFloat) {
            if (!hasErrors) {
                errorBtnFloat.textContent = '✓ 无错误';
                errorBtnFloat.title = '未检测到错误';
                errorBtnFloat.style.background = '#28a745';
                errorBtnFloat.style.color = 'white';
                errorBtnFloat.disabled = true;
                errorBtnFloat.style.opacity = '0.6';
                errorBtnFloat.style.cursor = 'not-allowed';
            } else if (isErrorDetectionEnabled) {
                errorBtnFloat.textContent = '🙈 隐藏错误';
                errorBtnFloat.title = '隐藏错误提示';
                errorBtnFloat.style.background = '#fd7e14';
                errorBtnFloat.style.color = 'white';
                errorBtnFloat.disabled = false;
                errorBtnFloat.style.opacity = '1';
                errorBtnFloat.style.cursor = 'pointer';
            } else {
                errorBtnFloat.textContent = '⚠️ 显示错误';
                errorBtnFloat.title = '显示错误提示';
                errorBtnFloat.style.background = '#6c757d';
                errorBtnFloat.style.color = 'white';
                errorBtnFloat.disabled = false;
                errorBtnFloat.style.opacity = '1';
                errorBtnFloat.style.cursor = 'pointer';
            }
        }
    }

    // 创建占位符元素（改进版）
    function createPlaceholder(width, height) {
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            background: #e3f2fd;
            border: 2px dashed #2196f3;
            border-radius: 6px;
            margin: 2px;
            transition: all 0.2s ease;
        `;
        return placeholder;
    }

    // 改进的拖拽开始处理
    function handleDragStart(e) {
        const target = e.target.closest('.title-block');
        if (!target) return;

        dragState.isDragging = true;
        dragState.dragElement = target;
        dragState.dragIndex = parseInt(target.dataset.index);
        dragState.currentContainer = target.parentElement;
        dragState.originalNextSibling = target.nextSibling;

        // 创建占位符
        const rect = target.getBoundingClientRect();
        dragState.placeholder = createPlaceholder(rect.width, rect.height);

        // 延迟一点添加样式，避免影响拖拽图像
        setTimeout(() => {
            target.classList.add('dragging');
            target.style.opacity = '0.4';

            // 插入占位符到原位置
            target.parentElement.insertBefore(dragState.placeholder, target);
            // 暂时隐藏原元素（但不移除，以保持拖拽）
            target.style.display = 'none';
        }, 0);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(target, e.offsetX, e.offsetY);
    }

    // 改进的拖拽结束处理
    function handleDragEnd(e) {
        if (!dragState.isDragging) return;

        const target = e.target.closest('.title-block');
        if (!target) return;

        // 在移除占位符之前，先记录它的位置
        let newPosition = -1;
        if (dragState.placeholder && dragState.placeholder.parentElement) {
            // 获取占位符在容器中的位置
            const allChildren = Array.from(dragState.currentContainer.children);
            newPosition = allChildren.indexOf(dragState.placeholder);

            // 移除占位符
            dragState.placeholder.remove();
        }

        // 恢复元素显示
        target.style.display = '';
        target.style.opacity = '';
        target.classList.remove('dragging');

        // 如果位置改变了，更新方块顺序
        if (newPosition !== -1 && newPosition !== dragState.dragIndex) {
            // 重新排序 finalBlocks
            const draggedBlock = finalBlocks[dragState.dragIndex];
            finalBlocks.splice(dragState.dragIndex, 1);

            // 计算新索引（考虑移除元素后的位置调整）
            let newIndex = newPosition;
            if (dragState.dragIndex < newPosition) {
                newIndex--;
            }

            // 确保索引在有效范围内
            newIndex = Math.max(0, Math.min(finalBlocks.length, newIndex));

            finalBlocks.splice(newIndex, 0, draggedBlock);

            // 重组并更新
            recombineBlocks();
            renderTitleBlocks(finalBlocks);
            updateTitleFromBlocks();
            updateErrorDetectionButtons();
        }

        // 重置状态
        dragState.isDragging = false;
        dragState.dragElement = null;
        dragState.dragIndex = -1;
        dragState.placeholder = null;
        dragState.currentContainer = null;
    }

    // 改进的拖拽悬停处理
    function handleDragOver(e) {
        e.preventDefault();
        if (!dragState.isDragging || !dragState.placeholder) return;

        const container = e.currentTarget;
        const afterElement = getDragAfterElement(container, e.clientX);

        if (afterElement == null) {
            // 放在最后
            container.appendChild(dragState.placeholder);
        } else if (afterElement !== dragState.placeholder) {
            // 插入到特定位置
            container.insertBefore(dragState.placeholder, afterElement);
        }
    }

    // 获取应该插入的位置
    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.title-block:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // 简化的拖拽放下处理
    function handleDrop(e) {
        e.preventDefault();
        // 实际的重排序已经在 handleDragEnd 中处理
    }

    // 将标题分割成原始方块（最基础单元）
    function splitTitleIntoRawBlocks(title) {
        if (!title) return [];

        // 只用正则识别跨空格的完整词组
        const crossSpacePatterns = [
            // 音频编码跨空格组合
            /\b(DTS-HD\s+MA)\b/gi,
            /\b(DTS-HD\s+HRA)\b/gi,

            // HDR格式跨空格组合
            /\b((DV|DoVi)\s+HDR10\+)(?=\s|$)/gi,
            /\b((DV|DoVi)\s+HDR)\b/gi,
            /\b(HDR\s+vivid)\b/gi,

            // 片源类型跨空格组合
            /\b(UHD\s+Blu-ray)\b/gi,
            /\b(UHD\s+BluRay)\b/gi,
            /\b(3D\s+Blu-ray)\b/gi,
            /\b(3D\s+BluRay)\b/gi,
            /\b(HD\s+DVD)\b/gi,

            // 碟片品牌跨空格组合
            /\b(Masters\s+of\s+Cinema)\b/gi,
            /\b(Warner\s+Archive\s+Collection)\b/gi,
            /\b(Criterion\s+Collection)\b/gi,

            // 电视台跨空格组合
            /\b(HOY\s+TV)\b/gi,
            /\b(PHOENIX\s+HK)\b/gi,
        ];

        let segments = [];
        let matches = [];

        // 收集所有跨空格词组的匹配
        crossSpacePatterns.forEach(pattern => {
            let match;
            pattern.lastIndex = 0;
            while ((match = pattern.exec(title)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0].trim()
                });
            }
        });

        // 按位置排序并去重叠
        matches.sort((a, b) => a.start - b.start);
        let cleanMatches = [];
        let lastEnd = 0;

        matches.forEach(match => {
            if (match.start >= lastEnd) {
                cleanMatches.push(match);
                lastEnd = match.end;
            }
        });

        // 提取文本片段
        let currentPos = 0;
        cleanMatches.forEach(match => {
            // 添加匹配前的普通文本
            if (match.start > currentPos) {
                const beforeText = title.substring(currentPos, match.start).trim();
                if (beforeText) {
                    beforeText.split(/\s+/).forEach(word => {
                        if (word.trim()) segments.push(word.trim());
                    });
                }
            }
            // 添加跨空格的完整词组
            segments.push(match.text);
            currentPos = match.end;
        });

        // 添加最后剩余的文本
        if (currentPos < title.length) {
            const remainingText = title.substring(currentPos).trim();
            if (remainingText) {
                remainingText.split(/\s+/).forEach(word => {
                    if (word.trim()) segments.push(word.trim());
                });
            }
        }

        // 如果没有跨空格词组，就简单按空格分割
        if (segments.length === 0) {
            segments = title.split(/\s+/).filter(word => word.trim());
        }

        // 在原始方块生成阶段进行制作组分离处理（只对最后一个segment）
        const separatedSegments = [];
        segments.forEach((segment, index) => {
            if (index === segments.length - 1) {
                // 只对最后一个segment进行制作组分离
                const separated = separateReleaseGroupInSegment(segment);
                separatedSegments.push(...separated);
            } else {
                separatedSegments.push(segment);
            }
        });

        // 生成原始方块（简单结构）
        return separatedSegments.map((segment, index) => ({
            id: `raw_${Date.now()}_${index}`,
            text: segment,
            type: identifyElementType(segment)
        }));
    }

    // 在单个片段中分离制作组（处理类似 "10bit-BeiTai" 的情况）
    function separateReleaseGroupInSegment(segment) {
        const lastDashIndex = segment.lastIndexOf('-');

        // 如果包含-且不是开头，且后面还有内容，且不是年份范围或DTS-HD等固定格式
        if (lastDashIndex > 0 && lastDashIndex < segment.length - 1 &&
            !isYearRange(segment) && !segment.includes('DTS-HD') && !segment.includes('Blu-ray')) {

            const beforeDash = segment.substring(0, lastDashIndex);
            const afterDash = segment.substring(lastDashIndex); // 包含-

            const result = [];
            if (beforeDash.trim()) {
                result.push(beforeDash.trim());
            }
            if (afterDash.trim()) {
                result.push(afterDash.trim());
            }
            return result;
        } else {
            return [segment];
        }
    }

    // 基于原始方块生成最终方块（用于显示）
    function combineRawBlocks(rawBlocksArray) {
        // 先进行组合处理
        let processedBlocks = combineAdjacentElements([...rawBlocksArray]);
        processedBlocks = combineSeriesName(processedBlocks);

        return processedBlocks;
    }

    // 检测标题中是否包含HDTV或UHDTV规格
    function hasHDTVorUHDTV(blocks) {
        return blocks.some(block =>
            block.type === 'SPEC' && (block.text === 'HDTV' || block.text === 'UHDTV')
        );
    }

    // 组合季数或年份前的剧名
    function combineSeriesName(blocks) {
        if (blocks.length <= 1) return blocks;

        const result = [];
        let seriesNameParts = [];
        let foundBreakPoint = false;
        let skipFirstBlock = false;

        // 检查是否需要跳过第一个方块（电视台 + HDTV/UHDTV 的情况）
        if (hasHDTVorUHDTV(blocks) && blocks.length > 0 && blocks[0].type === 'TV_STATION') {
            skipFirstBlock = true;
            result.push(ensureFinalBlock(blocks[0])); // 直接添加电视台方块到结果
        }

        // 从第二个方块开始处理（如果需要跳过第一个）或从第一个开始
        const startIndex = skipFirstBlock ? 1 : 0;

        for (let i = startIndex; i < blocks.length; i++) {
            const block = blocks[i];
            const currentFinal = ensureFinalBlock(block);

            // 如果遇到季数或年份，停止收集剧名
            if (!foundBreakPoint && (block.type === 'SEASON_EPISODE' || block.type === 'YEAR')) {
                foundBreakPoint = true;

                // 如果有收集到的剧名部分，组合它们
                if (seriesNameParts.length > 0) {
                    result.push({
                        id: `final_series_${Date.now()}_${i}`,
                        text: seriesNameParts.map(p => p.text).join(' '),
                        type: 'SERIES_NAME',
                        rawBlocks: seriesNameParts.flatMap(p => p.rawBlocks)
                    });
                }

                // 清空收集器并添加当前元素
                seriesNameParts = [];
                result.push(currentFinal);
            } else if (!foundBreakPoint &&
                // 只排除绝对确定的技术参数，其他都可能是剧名
                !['RESOLUTION', 'SOURCE_TYPE', 'SPEC', 'HDR_TYPE', 'VIDEO_CODEC',
                    'PROFILE', 'AUDIO_CODEC', 'OBJECT_AUDIO'].includes(block.type)) {
                // 收集剧名候选（包括可能被误识别的 STREAMING_SERVICE, REGION_CODE, RELEASE_GROUP, OTHER 等）
                seriesNameParts.push(currentFinal);
            } else {
                // 如果已经遇到断点，或者是绝对的技术类型，直接添加
                if (seriesNameParts.length > 0) {
                    result.push({
                        id: `final_series_${Date.now()}_${i}`,
                        text: seriesNameParts.map(p => p.text).join(' '),
                        type: 'SERIES_NAME',
                        rawBlocks: seriesNameParts.flatMap(p => p.rawBlocks)
                    });
                    seriesNameParts = [];
                }
                result.push(currentFinal);
                foundBreakPoint = true;
            }
        }

        // 处理末尾剩余的剧名部分
        if (seriesNameParts.length > 1) {
            result.push({
                id: `final_series_${Date.now()}_end`,
                text: seriesNameParts.map(p => p.text).join(' '),
                type: 'SERIES_NAME',
                rawBlocks: seriesNameParts.flatMap(p => p.rawBlocks)
            });
        } else if (seriesNameParts.length === 1) {
            result.push(seriesNameParts[0]);
        }

        return result;
    }

    // 判断是否是年份范围
    function isYearRange(text) {
        return /^(\d{4}-\d{4}|\d{8}-\d{8})$/.test(text);
    }

    // 组合相邻的相关元素
    function combineAdjacentElements(blocks) {
        const result = [];
        let i = 0;

        while (i < blocks.length) {
            const current = blocks[i];
            const next = blocks[i + 1];
            const next2 = blocks[i + 2];

            // 确保当前方块是最终方块格式
            const currentFinal = ensureFinalBlock(current);

            // 三元组合优先检查

            // 音频编码 + 声道数 + 对象音频
            if (next && next2 && current.type === 'AUDIO_CODEC' && next.type === 'CHANNEL_INFO' && next2.type === 'OBJECT_AUDIO') {
                const nextFinal = ensureFinalBlock(next);
                const next2Final = ensureFinalBlock(next2);

                result.push({
                    id: `final_audio_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text} ${next2.text}`,
                    type: 'AUDIO_CODEC',
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks, ...next2Final.rawBlocks]
                });
                i += 3;
                continue;
            }


            // 二元组合

            // (音频编码 + 声道数) + 对象音频
            if (next && current.type === 'AUDIO_CODEC' && next.type === 'OBJECT_AUDIO' && /(\d\.\d)$/.match(current.text)) {
                const nextFinal = ensureFinalBlock(next);
                const currentFinal = ensureFinalBlock(current);

                result.push({
                    id: `final_audio_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'AUDIO_CODEC',
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // 流媒体厂商 + WEB-DL
            if (next && current.type === 'STREAMING_SERVICE' && next.type === 'SPEC' && next.text === 'WEB-DL') {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_streaming_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'SOURCE_TYPE',  // 组合后归类为片源
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // 碟片品牌 + 片源（新增）
            if (next && current.type === 'DISC_BRAND' && next.type === 'SOURCE_TYPE') {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_disc_source_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'SOURCE_TYPE',  // 组合后归类为片源
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // 电视台 + 规格（HDTV/UHDTV）（新增）
            if (next && current.type === 'TV_STATION' && next.type === 'SPEC' && (next.text === 'HDTV' || next.text === 'UHDTV')) {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_tv_spec_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'SOURCE_TYPE',  // 组合后归类为片源
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // Profile + 视频编码
            if (next && current.type === 'PROFILE' && next.type === 'VIDEO_CODEC') {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_video_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'VIDEO_CODEC',  // 组合后归类为视频编码
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // 地区码 + 片源
            if (next && current.type === 'REGION_CODE' && next.type === 'SOURCE_TYPE') {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_source_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'SOURCE_TYPE',  // 组合后归类为片源
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            // 音频编码 + 声道数
            if (next && current.type === 'AUDIO_CODEC' && next.type === 'CHANNEL_INFO') {
                const nextFinal = ensureFinalBlock(next);

                result.push({
                    id: `final_audio_${Date.now()}_${i}`,
                    text: `${current.text} ${next.text}`,
                    type: 'AUDIO_CODEC',
                    rawBlocks: [...currentFinal.rawBlocks, ...nextFinal.rawBlocks]
                });
                i += 2;
                continue;
            }

            result.push(currentFinal);
            i++;
        }

        return result;
    }

    // 确保方块是最终方块格式
    function ensureFinalBlock(block) {
        if (block.rawBlocks) {
            // 已经是最终方块
            return block;
        } else {
            // 是原始方块，转换为最终方块
            return {
                id: `final_${block.id}`,
                text: block.text,
                type: block.type,
                rawBlocks: [block]
            };
        }
    }

    function identifyElementType(text) {
        if (!text) return 'OTHER';
        if (text.startsWith('-')) return 'RELEASE_GROUP';
        if (isSeasonEpisode(text)) return 'SEASON_EPISODE';
        if (isYear(text)) return 'YEAR';
        if (isResolution(text)) return 'RESOLUTION';
        if (isProfile(text)) return 'PROFILE';
        if (isChannelInfo(text)) return 'CHANNEL_INFO';
        if (isTrackInfo(text)) return 'TRACK_INFO';
        if (isRegionCode(text)) return 'REGION_CODE';
        if (isSourceType(text)) return 'SOURCE_TYPE';
        if (isSpec(text)) return 'SPEC';
        if (isHDRType(text)) return 'HDR_TYPE';
        if (isVideoCodec(text)) return 'VIDEO_CODEC';
        if (isObjectAudio(text)) return 'OBJECT_AUDIO';
        if (isAudioCodec(text)) return 'AUDIO_CODEC';
        if (isDiscBrand(text)) return 'DISC_BRAND';
        if (isTVStation(text)) return 'TV_STATION';
        if (isStreamingService(text)) return 'STREAMING_SERVICE';
        return 'OTHER';
    }

    // 各种类型检测函数
    function isSeasonEpisode(text) {
        return /^S\d+(E\d+)?(-S\d+)?(-E\d+)?$/i.test(text) || /^S\d+E\d+E\d+$/i.test(text);
    }

    function isYear(text) {
        return /^(\d{4}|\d{8}|\d{4}-\d{4}|\d{8}-\d{8})$/.test(text);
    }

    function isResolution(text) {
        const resolutions = ['4320p', '2160p', '1080p', '1080i', '720p', '576p', '576i', '480p', '480i', 'SD', 'NTSC', 'PAL'];
        return resolutions.includes(text);
    }

    function isRegionCode(text) {
        const regions = ['ITA', 'USA', 'JPN', 'HKG', 'TWN', 'GBR', 'FRA', 'GER', 'KOR', 'CHN', 'AUS', 'NLD', 'CZE', 'CEE'];
        return regions.includes(text);
    }

    function isSourceType(text) {
        const sources = ['Blu-ray', '3D Blu-ray', 'UHD Blu-ray', 'Modded Blu-ray', 'Custom BluRay',
            'NTSC DVD5', 'NTSC DVD9', 'PAL DVD5', 'PAL DVD9', 'HD DVD', 'BluRay',
            '3D BluRay', 'UHD BluRay', 'DVDRip', 'HDDVDRip'];
        return sources.some(source => text.includes(source));
    }

    function isSpec(text) {
        const specs = ['Remux', 'REMUX', 'WEB-DL', 'WEBRip', 'HDTV', 'UHDTV', 'HOU', 'HSBS'];
        return specs.includes(text);
    }

    function isHDRType(text) {
        const hdrTypes = ['HDR', 'HDR10+', 'HDR10', 'DV', 'HLG', 'PQ10', 'DV HDR', 'DV HDR10+', 'DoVi HDR', 'DoVi HDR10+', 'HDR vivid'];
        return hdrTypes.includes(text);
    }

    function isVideoCodec(text) {
        const codecs = ['AVC', 'HEVC', 'MPEG-2', 'VC-1', 'H.264', 'H.265', 'VP9', 'AVS+', 'AVS3',
            'AV1', 'H264', 'H265', 'MPEG2', 'x264', 'x265'];
        return codecs.includes(text);
    }

    function isProfile(text) {
        return /^(Hi10P|Hi422P|Hi444PP)$/i.test(text);
    }

    function isAudioCodec(text) {
        // 首先检查是否以声道格式结尾（如 X.X）
        const channelSuffix = /(\d\.\d)$/;
        const channelMatch = text.match(channelSuffix);

        if (channelMatch) {
            // 如果以声道格式结尾，检查前面部分是否是音频编码
            const codecPart = text.substring(0, text.length - channelMatch[1].length);

            const singleWordCodecs = [
                'DTS-X', 'DTS:X', 'TrueHD', 'LPCM', 'FLAC',
                'DDP', 'AAC', 'MP2', 'MP3', 'OPUS', 'DTS', 'DD'
            ];

            return singleWordCodecs.includes(codecPart);
        }

        // 检查标准的音频编码（包括跨空格的格式，这些必须保持空格）
        const standardCodecs = [
            'DTS-HD MA', 'DTS-HD HRA', 'DTS:X', 'DTS-X', 'TrueHD', 'LPCM', 'FLAC',
            'DDP', 'AAC', 'MP2', 'MP3', 'OPUS', 'DTS', 'DD'
        ];

        return standardCodecs.includes(text);
    }

    function isChannelInfo(text) {
        return /^\d\.\d$/.test(text); // 如 7.1, 5.1
    }

    function isTrackInfo(text) {
        return /^\d+Audios?$/.test(text);
    }

    function isObjectAudio(text) {
        // 对象音频格式（目前主要是Atmos）
        return text.toLowerCase() === 'atmos';
    }

    function isStreamingService(text) {
        // 主流流媒体厂商简称（选择比较安全、不易误识别的）
        const streamingServices = [
            // 主流国际平台
            'NF', 'AMZN', 'DSNP', 'HMAX', 'HBO', 'HULU', 'ATVP', 'PMTP', 'PCOK', 'DSCP', 'SHO', 'STZ',
            // 数字商店
            'iT', 'PLAY', 'VMEO', 'YHOO',
            // 主流电视网络
            'ESPN', 'NBC', 'CBS', 'FOX', 'AMBC', 'MTV', 'CW',
            // 专业频道
            'FOOD', 'HGTV', 'TLC', 'DISC', 'ANPL', 'HIST', 'NATG', 'SYFY', 'NICK', 'FREE', 'LIFE',
            // 国际平台
            'iP', 'ALL4', 'ITV', 'CBC', 'SBS', 'SVT', 'ZDF', 'ARD', 'NRK', 'RTE',
            // 其他知名平台
            'TUBI', 'ROKU', 'PLUZ', 'STAN', 'BNGE', 'CRAV', 'EPIX', 'CMAX', 'SHDR',
            // 体育平台
            'KAYO', 'UFC', 'NBA', 'NFL', 'NFLN', 'SNET',
            // 动画/娱乐平台
            'CR', 'FUNI', 'HIDI', 'VRV', 'BOOM', 'TFOU', 'ANLB',
            // 新闻平台
            'CNBC', 'MNBC', 'CSPN', 'AJAZ',
            // 亚洲平台
            'TVING', 'VIKI', 'GYAO', 'Baha', 'Hami', 'HTSR', 'PUHU',
            // 其他
            'COOK', 'TRVL', 'DIY', 'FYI', 'VH1', 'TBS', 'OXGN', 'VLCT'
        ];

        // 精确匹配，保持大小写敏感（因为有些简称如iP需要保持特定大小写）
        return streamingServices.includes(text);
    }

    // 新增：碟片品牌识别函数
    function isDiscBrand(text) {
        const discBrands = [
            'Criterion', 'CC', 'Criterion Collection',
            'Masters of Cinema', 'MoC',
            'Warner Archive Collection', 'WAC',
            'Arrow',
            'WCL',
            'BFI'
        ];

        return discBrands.includes(text);
    }

    // 新增：电视台识别函数
    function isTVStation(text) {
        if (/^CCTV-?\d+[K]?$/i.test(text)) {
            return true;
        }

        // 其他电视台
        const tvStations = [
            'DragonTV', 'ZJTV', 'HNTV', 'HNSTV', 'GDTV', 'JSTV', 'BRTV',
            'Jade', 'Pearl', 'MATV', 'HOY TV', 'PHOENIX HK', 'TVB', 'ViuTV',
            'RTHK31', 'CWJDTV'
        ];

        return tvStations.includes(text);
    }

    // 从标题更新方块
    function updateBlocksFromTitle(title) {
        rawBlocks = splitTitleIntoRawBlocks(title);
        finalBlocks = combineRawBlocks(rawBlocks);
        renderTitleBlocks(finalBlocks);
        // 更新错误检测按钮状态
        updateErrorDetectionButtons();
    }

    // 切换删除模式
    function toggleDeleteMode() {
        isDeleteMode = !isDeleteMode;

        // 更新删除按钮状态
        updateDeleteButtons();

        // 重新渲染方块以显示/隐藏删除按钮
        renderTitleBlocks(finalBlocks);

        // 如果退出删除模式，确保没有方块处于晃动状态
        if (!isDeleteMode) {
            document.querySelectorAll('.title-block').forEach(block => {
                block.classList.remove('delete-mode');
            });
        }
    }

    // 更新删除按钮的显示状态
    function updateDeleteButtons() {
        const deleteBtn = document.getElementById('toggleDeleteMode');
        const deleteBtnFloat = document.getElementById('toggleDeleteModeFloat');

        if (deleteBtn) {
            if (isDeleteMode) {
                deleteBtn.textContent = '✅';
                deleteBtn.title = '退出删除模式';
                deleteBtn.style.background = '#dc3545';
                deleteBtn.style.color = 'white';
            } else {
                deleteBtn.textContent = '🗑️';
                deleteBtn.title = '进入删除模式';
                deleteBtn.style.background = '#6c757d';
                deleteBtn.style.color = 'white';
            }
        }

        if (deleteBtnFloat) {
            if (isDeleteMode) {
                deleteBtnFloat.textContent = '✅ 退出删除';
                deleteBtnFloat.style.background = '#dc3545';
                deleteBtnFloat.style.color = 'white';
            } else {
                deleteBtnFloat.textContent = '🗑️ 删除模式';
                deleteBtnFloat.style.background = '#6c757d';
                deleteBtnFloat.style.color = 'white';
            }
        }
    }

    // 删除指定的方块
    function deleteBlock(blockId) {
        // 找到要删除的方块索引
        const blockIndex = finalBlocks.findIndex(block => block.id === blockId);

        if (blockIndex !== -1) {
            // 从finalBlocks中移除
            finalBlocks.splice(blockIndex, 1);

            recombineBlocks();
            renderTitleBlocks(finalBlocks);
            updateTitleFromBlocks();
            updateErrorDetectionButtons();

            // 如果删除后没有方块了，自动退出删除模式
            if (finalBlocks.length === 0) {
                isDeleteMode = false;
                updateDeleteButtons();
            }
        }
    }
    function updateTitleFromBlocks() {
        let title = buildTitleFromBlocks(finalBlocks);

        // 更新输入框
        const compactInput = document.getElementById('titleInput');
        const floatInput = document.getElementById('titleInputFloat');
        if (compactInput) compactInput.value = title;
        if (floatInput) floatInput.value = title;

        return title;
    }

    // 渲染标题方块
    function renderTitleBlocks(blocks) {
        // 渲染到紧凑模式
        const container = document.getElementById('titleBlocks');
        if (container) {
            renderBlocksToContainer(container, blocks);
        }

        // 渲染到悬浮模式
        const floatContainer = document.getElementById('titleBlocksFloat');
        if (floatContainer) {
            renderBlocksToContainer(floatContainer, blocks);
        }
    }

    // 在指定容器中渲染方块（使用改进的拖拽功能）
    function renderBlocksToContainer(container, blocks) {
        container.innerHTML = '';

        // 为整个容器添加 dragover 和 drop 事件
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        // 应用错误检测
        const blocksWithErrors = detectBlockErrors(blocks);

        blocksWithErrors.forEach((block, index) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'title-block';
            blockEl.dataset.index = index;
            blockEl.dataset.blockId = block.id;
            blockEl.dataset.type = block.type;
            blockEl.dataset.typeName = ELEMENT_TYPES[block.type]?.name || '其他'; // 添加中文名称
            blockEl.textContent = block.text;
            blockEl.draggable = !isDeleteMode; // 删除模式下禁用拖拽

            // 根据方块类型设置样式
            const typeInfo = ELEMENT_TYPES[block.type] || ELEMENT_TYPES.OTHER;

            let baseStyle = `
                display: inline-flex;
                align-items: center;
                padding: 6px 10px;
                margin: 2px;
                background: ${typeInfo.color};
                color: ${typeInfo.textColor};
                border: 1px solid ${typeInfo.textColor}40;
                border-radius: 6px;
                font-size: 13px;
                cursor: ${isDeleteMode ? 'default' : 'grab'};
                user-select: none;
                transition: all 0.2s ease;
                min-width: 20px;
                text-align: center;
                font-family: "Segoe UI", Arial, sans-serif;
                font-weight: 500;
                position: relative;
            `;

            // 如果有错误且错误检测开启，添加错误样式
            if (block.renderError && isErrorDetectionEnabled && !isDeleteMode) {
                baseStyle += `
                    background-image:
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 4px,
                            rgba(220, 53, 69, 0.3) 4px,
                            rgba(220, 53, 69, 0.3) 8px
                        );
                    border: 2px solid #dc3545;
                    box-shadow: 0 0 0 1px rgba(220, 53, 69, 0.2);
                `;
            }

            blockEl.style.cssText = baseStyle;

            // 添加类型标签（hover时显示）
            blockEl.title = `${typeInfo.name}: ${block.text}\n${isDeleteMode ? '点击右上角X删除' : '拖拽可移动位置'}`;

            // 删除模式下添加晃动效果
            if (isDeleteMode) {
                blockEl.classList.add('delete-mode');
            }

            // 删除模式下添加删除按钮
            if (isDeleteMode) {
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'block-delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 18px;
                    height: 18px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 1002;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                `;

                // 删除按钮悬停效果
                deleteBtn.addEventListener('mouseenter', () => {
                    deleteBtn.style.background = '#a71e2a';
                    deleteBtn.style.transform = 'scale(1.1)';
                });

                deleteBtn.addEventListener('mouseleave', () => {
                    deleteBtn.style.background = '#dc3545';
                    deleteBtn.style.transform = 'scale(1)';
                });

                // 删除按钮点击事件
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                });

                blockEl.appendChild(deleteBtn);
            } else {
                // 非删除模式下的悬停效果
                blockEl.addEventListener('mouseenter', () => {
                    if (!dragState.isDragging) {
                        blockEl.style.transform = 'translateY(-2px) scale(1.05)';
                        blockEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        blockEl.style.zIndex = '1000';
                    }
                });

                blockEl.addEventListener('mouseleave', () => {
                    if (!dragState.isDragging) {
                        blockEl.style.transform = 'translateY(0) scale(1)';
                        blockEl.style.boxShadow = block.renderError && isErrorDetectionEnabled ? '0 0 0 1px rgba(220, 53, 69, 0.2)' : 'none';
                        blockEl.style.zIndex = 'auto';
                    }
                });

                // 拖拽事件（只在非删除模式下）
                blockEl.addEventListener('dragstart', handleDragStart);
                blockEl.addEventListener('dragend', handleDragEnd);
            }

            container.appendChild(blockEl);
        });

        // 更新动画样式
        if (!document.getElementById('blockAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'blockAnimationStyle';
            style.textContent = `
                .title-block {
                    transition: all 0.2s ease;
                }

                .title-block.dragging {
                    opacity: 0.4 !important;
                    cursor: grabbing !important;
                }

                .title-block.delete-mode {
                    animation: blockShake 0.5s ease-in-out infinite;
                }

                @keyframes blockShake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-1deg); }
                    75% { transform: rotate(1deg); }
                }

                .drag-placeholder {
                    transition: all 0.2s ease;
                    animation: placeholderPulse 1s ease-in-out infinite;
                }

                @keyframes placeholderPulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                #titleBlocks, #titleBlocksFloat {
                    transition: all 0.2s ease;
                }

                .title-block::before {
                    content: attr(data-type-name);
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    z-index: 1001;
                }

                .title-block:hover::before {
                    opacity: 1;
                }

                /* 删除模式下隐藏类型标签 */
                .title-block.delete-mode::before {
                    display: none !important;
                }

                .title-block.delete-mode:hover::before {
                    display: none !important;
                }

                .block-delete-btn {
                    transition: all 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 切换方块编辑模式（紧凑模式）
    function toggleBlockMode() {
        const titleInput = document.getElementById('titleInput');
        const titleBlocksContainer = document.getElementById('titleBlocksContainer');
        const toggleBtn = document.getElementById('toggleBlockMode');

        if (!titleInput || !titleBlocksContainer || !toggleBtn) return;

        isBlockMode = !isBlockMode;

        if (isBlockMode) {
            // 开启方块模式 - 显示方块区域
            const currentTitle = titleInput.value;
            updateBlocksFromTitle(currentTitle);

            titleBlocksContainer.style.display = 'block';
            toggleBtn.textContent = '📝';
            toggleBtn.title = '关闭方块模式';
            toggleBtn.style.background = '#28a745';
            toggleBtn.style.color = 'white';

            // 输入框变为只读提示
            titleInput.style.background = '#f8f9fa';
            titleInput.style.color = '#6c757d';
            titleInput.style.fontStyle = 'italic';
        } else {
            // 关闭方块模式 - 隐藏方块区域
            titleBlocksContainer.style.display = 'none';
            toggleBtn.textContent = '🧩';
            toggleBtn.title = '开启方块模式';
            toggleBtn.style.background = '#ffc107';
            toggleBtn.style.color = '#212529';

            // 恢复输入框正常状态
            titleInput.style.background = '#ffffff';
            titleInput.style.color = '#495057';
            titleInput.style.fontStyle = 'normal';
        }

        // 同步悬浮模式的方块状态
        syncFloatBlockMode();
    }

    // 切换方块编辑模式（悬浮模式）
    function toggleBlockModeFloat() {
        const titleInputFloat = document.getElementById('titleInputFloat');
        const titleBlocksContainerFloat = document.getElementById('titleBlocksContainerFloat');
        const toggleBtnFloat = document.getElementById('toggleBlockModeFloat');

        if (!titleInputFloat || !titleBlocksContainerFloat || !toggleBtnFloat) return;

        isBlockMode = !isBlockMode;

        if (isBlockMode) {
            // 开启方块模式
            const currentTitle = titleInputFloat.value;
            updateBlocksFromTitle(currentTitle);

            titleBlocksContainerFloat.style.display = 'block';
            toggleBtnFloat.textContent = '📝 文本模式';
            toggleBtnFloat.style.background = '#28a745';
            toggleBtnFloat.style.color = 'white';

            // 输入框变为只读提示
            titleInputFloat.style.background = '#f8f9fa';
            titleInputFloat.style.color = '#6c757d';
            titleInputFloat.style.fontStyle = 'italic';
        } else {
            // 关闭方块模式
            titleBlocksContainerFloat.style.display = 'none';
            toggleBtnFloat.textContent = '🧩 方块模式';
            toggleBtnFloat.style.background = '#ffc107';
            toggleBtnFloat.style.color = '#212529';

            // 恢复输入框正常状态
            titleInputFloat.style.background = '#ffffff';
            titleInputFloat.style.color = '#495057';
            titleInputFloat.style.fontStyle = 'normal';
        }

        // 同步紧凑模式的方块状态
        syncCompactBlockMode();
    }

    // 同步悬浮模式的方块状态
    function syncFloatBlockMode() {
        const titleBlocksContainerFloat = document.getElementById('titleBlocksContainerFloat');
        const toggleBtnFloat = document.getElementById('toggleBlockModeFloat');

        if (titleBlocksContainerFloat && toggleBtnFloat) {
            if (isBlockMode) {
                titleBlocksContainerFloat.style.display = 'block';
                toggleBtnFloat.textContent = '📝 文本模式';
                toggleBtnFloat.style.background = '#28a745';
                toggleBtnFloat.style.color = 'white';
            } else {
                titleBlocksContainerFloat.style.display = 'none';
                toggleBtnFloat.textContent = '🧩 方块模式';
                toggleBtnFloat.style.background = '#ffc107';
                toggleBtnFloat.style.color = '#212529';
            }
        }
    }

    // 同步紧凑模式的方块状态
    function syncCompactBlockMode() {
        const titleBlocksContainer = document.getElementById('titleBlocksContainer');
        const toggleBtn = document.getElementById('toggleBlockMode');

        if (titleBlocksContainer && toggleBtn) {
            if (isBlockMode) {
                titleBlocksContainer.style.display = 'block';
                toggleBtn.textContent = '📝';
                toggleBtn.style.background = '#28a745';
                toggleBtn.style.color = 'white';
            } else {
                titleBlocksContainer.style.display = 'none';
                toggleBtn.textContent = '🧩';
                toggleBtn.style.background = '#ffc107';
                toggleBtn.style.color = '#212529';
            }
        }
    }

    // 通用的从方块数组生成标题文本的函数
    function buildTitleFromBlocks(blocks) {
        let title = '';
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            if (i === 0) {
                title += block.text;
            } else {
                if (block.text.startsWith('-') && i == blocks.length - 1) {
                    title += block.text;
                } else {
                    title += ' ' + block.text;
                }
            }
        }
        return title;
    }

    // 从方块重新组合标题（使用通用函数）
    function rebuildTitleFromBlocks() {
        return buildTitleFromBlocks(finalBlocks);
    }

    // 重组：拆解最终方块为原始方块，然后重新组合
    function recombineBlocks() {
        rawBlocks = [];
        finalBlocks.forEach(finalBlock => {
            rawBlocks.push(...finalBlock.rawBlocks);
        });

        finalBlocks = combineRawBlocks(rawBlocks);
    }

    // 从当前URL解析种子ID
    function getTorrentId() {
        const url = window.location.href;
        const match = url.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    // 获取edit页面URL
    function getEditUrl() {
        const id = getTorrentId();
        if (!id) return null;

        const baseUrl = window.location.origin + window.location.pathname.replace('details.php', 'edit.php');
        return `${baseUrl}?id=${id}`;
    }

    // 从edit页面获取标题
    async function fetchTitleFromEdit() {
        const editUrl = getEditUrl();
        if (!editUrl) {
            console.warn('无法构造edit页面URL');
            return null;
        }

        try {
            const response = await fetch(editUrl, {
                method: 'GET',
                credentials: 'same-origin', // 包含cookies
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 尝试多种可能的标题字段选择器
            const selectors = [
                'input[name="name"]',
                'input[name="title"]',
                'textarea[name="name"]',
                'textarea[name="title"]',
                '#name',
                '#title'
            ];

            for (let selector of selectors) {
                const element = doc.querySelector(selector);
                if (element && element.value) {
                    return element.value.trim();
                }
            }

            throw new Error('未找到标题字段');

        } catch (error) {
            console.error('获取edit页面标题失败:', error);
            return null;
        }
    }

    // 从详情页重新抓取标题并更新当前页面显示（保持HTML结构）
    async function refreshPageTitle() {
        try {
            const currentUrl = window.location.href;
            const response = await fetch(currentUrl, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 查找新页面中的标题元素
            const newTitleElement = doc.querySelector('h1') || doc.querySelector('.title') || doc.querySelector('#title') || doc.querySelector('h2');

            if (newTitleElement) {
                // 更新当前页面的标题元素 - 使用 innerHTML 保持HTML结构
                const currentTitleElement = getTitleElement();
                if (currentTitleElement) {
                    // 使用 innerHTML 而不是 textContent，这样可以保持HTML结构和样式
                    currentTitleElement.innerHTML = newTitleElement.innerHTML;

                    // 更新页面标题（浏览器标签） - 这里用纯文本
                    document.title = newTitleElement.textContent.trim();
                }

                // 更新输入框内容 - 这里用纯文本
                const newTitleText = newTitleElement.textContent.trim();
                const compactInput = document.getElementById('titleInput');
                const floatInput = document.getElementById('titleInputFloat');
                if (compactInput) compactInput.value = newTitleText;
                if (floatInput) floatInput.value = newTitleText;

                // 如果当前是方块模式，重新生成方块
                if (isBlockMode) {
                    updateBlocksFromTitle(newTitleText);
                }

                return newTitleText;
            } else {
                throw new Error('未能从新页面中找到标题');
            }

        } catch (error) {
            console.error('刷新页面标题失败:', error);
            throw error;
        }
    }
    async function saveTitleToEdit(newTitle) {
        const editUrl = getEditUrl();
        if (!editUrl) {
            throw new Error('无法构造edit页面URL');
        }

        try {
            // 首先获取edit页面以获取表单数据和CSRF token等
            const getResponse = await fetch(editUrl, {
                method: 'GET',
                credentials: 'same-origin',
            });

            if (!getResponse.ok) {
                throw new Error(`无法访问edit页面: ${getResponse.status}`);
            }

            const html = await getResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 查找表单
            const form = doc.querySelector('form[name="edittorrent"]');
            if (!form) {
                throw new Error('未找到编辑表单');
            }

            // 获取表单的action属性，应该是takeedit.php
            const formAction = form.getAttribute('action');
            const submitUrl = new URL(formAction, window.location.origin + window.location.pathname.replace('details.php', '')).href;

            // 构造表单数据
            const formData = new FormData();

            // 复制所有现有的表单字段
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.name && input.type !== 'file') {
                    if (input.name === 'name') {
                        // 使用新标题
                        formData.append(input.name, newTitle);
                    } else if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) {
                            formData.append(input.name, input.value);
                        }
                    } else if (input.type === 'submit' || input.type === 'reset' || input.type === 'button') {
                        // 跳过按钮类型的input
                        return;
                    } else {
                        formData.append(input.name, input.value || '');
                    }
                }
            });

            // 特别处理复选框数组（如tags[]）
            const checkboxArrays = {};
            form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                if (checkbox.name.endsWith('[]')) {
                    if (!checkboxArrays[checkbox.name]) {
                        checkboxArrays[checkbox.name] = [];
                    }
                    checkboxArrays[checkbox.name].push(checkbox.value);
                }
            });

            // 将复选框数组添加到FormData中
            Object.keys(checkboxArrays).forEach(name => {
                // 先删除之前可能添加的同名字段
                formData.delete(name);
                checkboxArrays[name].forEach(value => {
                    formData.append(name, value);
                });
            });

            console.log('提交到URL:', submitUrl);
            console.log('表单数据:', Array.from(formData.entries()));

            // 提交表单到正确的action URL (takeedit.php)
            const postResponse = await fetch(submitUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });

            if (!postResponse.ok) {
                throw new Error(`保存失败: ${postResponse.status}`);
            }

            return true;

        } catch (error) {
            console.error('保存标题到edit页面失败:', error);
            throw error;
        }
    }

    // 创建编辑框容器
    function createEditBox() {
        const editBox = document.createElement('div');
        editBox.id = 'titleEditBox';
        editBox.innerHTML = `
        <!-- 紧凑模式（标题下方） -->
        <div id="compactMode" style="
            margin: 15px 0;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            max-width: 800px;
        ">
            <!-- 标题方块区域 -->
            <div id="titleBlocksContainer" style="
                margin-bottom: 10px;
                display: none;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <div id="titleBlocks" style="
                        flex: 1;
                        min-height: 40px;
                        border: 1px solid #ced4da;
                        border-radius: 4px;
                        padding: 8px;
                        background: #fff;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        align-items: center;
                        align-content: center;
                    "></div>

                    <!-- 方块操作按钮区域（右侧） -->
                    <div style="
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    ">
                        <button id="toggleErrorDetection" style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            transition: background 0.2s;
                            font-weight: bold;
                            white-space: nowrap;
                            line-height: 1.2;
                        " title="隐藏错误提示">⚠️</button>
                        <button id="toggleDeleteMode" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            transition: background 0.2s;
                            font-weight: bold;
                            white-space: nowrap;
                            line-height: 1.2;
                        " title="进入删除模式">🗑️</button>
                    </div>
                </div>
            </div>

            <!-- 输入框和按钮行 -->
            <div style="
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <input type="text" id="titleInput" placeholder="编辑标题..." style="
                    flex: 1;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                " />

                <button id="saveTitle" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                ">保存</button>

                <button id="loadTitle" style="
                    background: #17a2b8;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                ">载入</button>

                <button id="toggleBlockMode" style="
                    background: #ffc107;
                    color: #212529;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                    font-weight: bold;
                " title="开启/关闭方块模式">🧩</button>

                <button id="switchMode" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s;
                " title="切换到右侧悬浮模式">→</button>
            </div>
        </div>

        <!-- 悬浮模式（右侧） -->
        <div id="floatingMode" style="
            position: fixed !important;
            top: 120px !important;
            right: 20px !important;
            width: 350px;
            background: #ffffff;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999 !important;
            font-family: Arial, sans-serif;
            display: none;
        ">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            ">
                <h3 style="margin: 0; color: #333; font-size: 16px;">标题编辑器</h3>
                <button id="switchModeFloat" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s;
                " title="收起为图标">●</button>
            </div>

            <!-- 悬浮模式的方块区域 -->
            <div id="titleBlocksContainerFloat" style="
                margin-bottom: 10px;
                display: none;
            ">
                <div id="titleBlocksFloat" style="
                    min-height: 45px;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    padding: 8px;
                    background: #fff;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    align-items: flex-start;
                    align-content: flex-start;
                    margin-bottom: 8px;
                "></div>

                <!-- 方块操作按钮区域 -->
                <div style="
                    text-align: right;
                    margin-bottom: 8px;
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                ">
                    <button id="toggleErrorDetectionFloat" style="
                        background: #fd7e14;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                        font-weight: bold;
                    " title="隐藏错误提示">🙈 隐藏错误</button>
                    <button id="toggleDeleteModeFloat" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                        font-weight: bold;
                    " title="进入删除模式">🗑️ 删除模式</button>
                </div>
            </div>

            <!-- 文本框 -->
            <textarea id="titleInputFloat" placeholder="在此输入或编辑标题..." style="
                width: 100%;
                height: 80px;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px;
                font-size: 14px;
                resize: vertical;
                box-sizing: border-box;
                margin-bottom: 10px;
                outline: none;
            "></textarea>

            <!-- 按钮（垂直布局） -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 10px;">
                    <button id="saveTitleFloat" style="
                        flex: 1;
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s;
                    ">保存标题</button>

                    <button id="loadTitleFloat" style="
                        flex: 1;
                        background: #17a2b8;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s;
                    ">载入标题</button>
                </div>

                <button id="toggleBlockModeFloat" style="
                    background: #ffc107;
                    color: #212529;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                    font-weight: bold;
                " title="开启/关闭方块模式">🧩 方块模式</button>
            </div>

            <div id="statusMessage" style="
                margin-top: 10px;
                padding: 5px;
                border-radius: 3px;
                font-size: 12px;
                text-align: center;
                display: none;
            "></div>
        </div>

        <!-- 图标模式 -->
        <div id="iconMode" style="
            position: fixed !important;
            top: 120px !important;
            right: 20px !important;
            width: 50px;
            height: 50px;
            background: #28a745;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 99999 !important;
            transition: all 0.3s;
        " title="展开标题编辑器">
            <span style="color: white; font-size: 20px; font-weight: bold;">✏️</span>
        </div>
    `;

        return editBox;
    }

    // 显示状态消息（仅悬浮模式使用）
    function showStatus(message, type = 'success') {
        const statusDiv = document.getElementById('statusMessage');
        if (!statusDiv) return;

        statusDiv.style.display = 'block';
        statusDiv.textContent = message;

        if (type === 'success') {
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
        }

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    // 获取页面标题元素
    function getTitleElement() {
        const selectors = [
            'h1',
            '.title',
            '#title',
            'h2',
            '.torrent-title',
            '.detail-title'
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element;
            }
        }
        return null;
    }

    // 载入当前页面标题
    async function loadCurrentTitle() {
        // 重置状态
        setEditStatus(true, '正在载入...');

        try {
            const titleValue = await fetchTitleFromEdit();

            if (titleValue) {
                // 成功获取标题
                const compactInput = document.getElementById('titleInput');
                const floatInput = document.getElementById('titleInputFloat');

                if (compactInput) compactInput.value = titleValue;
                if (floatInput) floatInput.value = titleValue;

                // 如果当前是方块模式，重新生成方块
                if (isBlockMode) {
                    updateBlocksFromTitle(titleValue);
                }

                setEditStatus(true, '载入成功');
                canEdit = true;

                if (displayMode === 1) {
                    showStatus('已从edit页面载入标题');
                }
            } else {
                // 无法获取标题
                setEditStatus(false, '无法从edit页面读取标题');
                canEdit = false;

                if (displayMode === 1) {
                    showStatus('无法访问edit页面', 'error');
                }
            }
        } catch (error) {
            setEditStatus(false, `载入失败: ${error.message}`);
            canEdit = false;

            if (displayMode === 1) {
                showStatus('载入失败', 'error');
            }
        }
    }

    // 保存标题 - 智能更新版本：保存后智能更新页面标题，保持HTML结构
    async function saveTitle() {
        if (!canEdit) {
            if (displayMode === 1) {
                showStatus('无法保存：edit页面不可访问', 'error');
            }
            return;
        }

        let newTitle = '';

        // 根据当前模式获取标题
        if (displayMode === 0) {
            if (isBlockMode) {
                newTitle = rebuildTitleFromBlocks();
            } else {
                newTitle = document.getElementById('titleInput').value.trim();
            }
        } else if (displayMode === 1) {
            if (isBlockMode) {
                newTitle = rebuildTitleFromBlocks();
            } else {
                newTitle = document.getElementById('titleInputFloat').value.trim();
            }
        }

        if (!newTitle) {
            if (displayMode === 1) {
                showStatus('标题不能为空', 'error');
            }
            return;
        }

        // 保存用户编辑的内容，用于保存后恢复
        const userEditedTitle = newTitle;

        // 获取页面标题元素，准备添加视觉效果
        const titleElement = getTitleElement();
        let originalStyle = null;

        // 显示保存中状态
        setEditStatus(true, '正在保存...');
        if (displayMode === 1) {
            showStatus('正在保存...');
        }

        try {
            // 添加半透明效果表示标题正在更新
            if (titleElement) {
                originalStyle = {
                    opacity: titleElement.style.opacity,
                    transition: titleElement.style.transition
                };

                titleElement.style.transition = 'all 0.3s ease';
                titleElement.style.opacity = '0.5';
            }

            // 保存到edit页面
            await saveTitleToEdit(newTitle);

            // 保存成功，智能更新页面标题（保持HTML结构）
            setEditStatus(true, '正在更新显示...');
            if (displayMode === 1) {
                showStatus('保存成功，正在更新页面标题...');
            }

            // 从详情页重新抓取标题并更新当前页面显示（保持HTML结构）
            const refreshedTitle = await refreshPageTitle();

            // 恢复正常显示
            if (titleElement && originalStyle) {
                // 恢复透明度
                titleElement.style.opacity = '1';

                // 添加短暂的绿色光晕表示更新成功
                titleElement.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.5)';

                setTimeout(() => {
                    // 恢复原始样式
                    titleElement.style.opacity = originalStyle.opacity;
                    titleElement.style.transition = originalStyle.transition;
                    titleElement.style.boxShadow = '';
                }, 1000);
            }

            // 保持编辑器中的内容为用户编辑的内容（不变）
            const compactInput = document.getElementById('titleInput');
            const floatInput = document.getElementById('titleInputFloat');
            if (compactInput) compactInput.value = userEditedTitle;
            if (floatInput) floatInput.value = userEditedTitle;

            // 如果当前是方块模式，确保方块显示用户编辑的内容
            if (isBlockMode) {
                updateBlocksFromTitle(userEditedTitle);
            }

            setEditStatus(true, '保存成功');

            if (displayMode === 1) {
                showStatus('标题已保存并更新页面显示！');
            }

            console.log('标题保存成功，页面标题已更新为:', refreshedTitle);
            console.log('编辑器保持显示用户内容:', userEditedTitle);

        } catch (error) {
            // 发生错误时，恢复标题样式
            if (titleElement && originalStyle) {
                titleElement.style.opacity = originalStyle.opacity;
                titleElement.style.transition = originalStyle.transition;

                // 添加红色光晕表示保存失败
                titleElement.style.boxShadow = '0 0 8px rgba(220, 53, 69, 0.5)';
                setTimeout(() => {
                    titleElement.style.boxShadow = '';
                }, 2000);
            }

            setEditStatus(false, `保存失败: ${error.message}`);

            if (displayMode === 1) {
                showStatus(`保存失败: ${error.message}`, 'error');
            }
        }
    }

    // 设置编辑状态（可用/不可用）
    function setEditStatus(canEditFlag, statusText) {
        canEdit = canEditFlag;

        // 更新按钮状态
        const saveBtn = document.getElementById('saveTitle');
        const saveBtnFloat = document.getElementById('saveTitleFloat');
        const loadBtn = document.getElementById('loadTitle');
        const loadBtnFloat = document.getElementById('loadTitleFloat');
        const blockModeBtn = document.getElementById('toggleBlockMode');
        const blockModeBtnFloat = document.getElementById('toggleBlockModeFloat');

        // 更新输入框状态
        const compactInput = document.getElementById('titleInput');
        const floatInput = document.getElementById('titleInputFloat');
        const titleBlocksContainer = document.getElementById('titleBlocksContainer');
        const titleBlocksContainerFloat = document.getElementById('titleBlocksContainerFloat');

        if (canEditFlag) {
            // 可编辑状态 - 绿色
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.style.background = '#28a745';
                saveBtn.style.opacity = '1';
                saveBtn.style.cursor = 'pointer';
            }
            if (saveBtnFloat) {
                saveBtnFloat.disabled = false;
                saveBtnFloat.style.background = '#28a745';
                saveBtnFloat.style.opacity = '1';
                saveBtnFloat.style.cursor = 'pointer';
            }
            if (compactInput) {
                compactInput.style.borderColor = '#28a745';
                if (!isBlockMode) {
                    compactInput.style.background = '#ffffff';
                }
                compactInput.disabled = false;
            }
            if (floatInput) {
                floatInput.style.borderColor = '#28a745';
                if (!isBlockMode) {
                    floatInput.style.background = '#ffffff';
                }
                floatInput.disabled = false;
            }
            if (titleBlocksContainer) {
                titleBlocksContainer.querySelector('#titleBlocks').style.borderColor = '#28a745';
                titleBlocksContainer.querySelector('#titleBlocks').style.background = '#ffffff';
            }
            if (titleBlocksContainerFloat) {
                titleBlocksContainerFloat.querySelector('#titleBlocksFloat').style.borderColor = '#28a745';
                titleBlocksContainerFloat.querySelector('#titleBlocksFloat').style.background = '#ffffff';
            }
            if (blockModeBtn) {
                blockModeBtn.disabled = false;
                blockModeBtn.style.opacity = '1';
                blockModeBtn.style.cursor = 'pointer';
            }
            if (blockModeBtnFloat) {
                blockModeBtnFloat.disabled = false;
                blockModeBtnFloat.style.opacity = '1';
                blockModeBtnFloat.style.cursor = 'pointer';
            }
        } else {
            // 不可编辑状态 - 红色
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.style.background = '#dc3545';
                saveBtn.style.opacity = '0.6';
                saveBtn.style.cursor = 'not-allowed';
            }
            if (saveBtnFloat) {
                saveBtnFloat.disabled = true;
                saveBtnFloat.style.background = '#dc3545';
                saveBtnFloat.style.opacity = '0.6';
                saveBtnFloat.style.cursor = 'not-allowed';
            }
            if (compactInput) {
                compactInput.style.borderColor = '#dc3545';
                compactInput.style.background = '#f8f9fa';
                compactInput.placeholder = statusText || '无法编辑';
            }
            if (floatInput) {
                floatInput.style.borderColor = '#dc3545';
                floatInput.style.background = '#f8f9fa';
                floatInput.placeholder = statusText || '无法编辑';
            }
            if (titleBlocksContainer) {
                titleBlocksContainer.querySelector('#titleBlocks').style.borderColor = '#dc3545';
                titleBlocksContainer.querySelector('#titleBlocks').style.background = '#f8f9fa';
            }
            if (titleBlocksContainerFloat) {
                titleBlocksContainerFloat.querySelector('#titleBlocksFloat').style.borderColor = '#dc3545';
                titleBlocksContainerFloat.querySelector('#titleBlocksFloat').style.background = '#f8f9fa';
            }
            if (blockModeBtn) {
                blockModeBtn.disabled = true;
                blockModeBtn.style.opacity = '0.6';
                blockModeBtn.style.cursor = 'not-allowed';
            }
            if (blockModeBtnFloat) {
                blockModeBtnFloat.disabled = true;
                blockModeBtnFloat.style.opacity = '0.6';
                blockModeBtnFloat.style.cursor = 'not-allowed';
            }
        }

        // 载入按钮始终可用
        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.style.opacity = '1';
        }
        if (loadBtnFloat) {
            loadBtnFloat.disabled = false;
            loadBtnFloat.style.opacity = '1';
        }
    }

    function switchMode() {
        const compactMode = document.getElementById('compactMode');
        const floatingMode = document.getElementById('floatingMode');
        const iconMode = document.getElementById('iconMode');
        const switchBtn = document.getElementById('switchMode');
        const switchBtnFloat = document.getElementById('switchModeFloat');
        const editBox = document.getElementById('titleEditBox');

        displayMode = (displayMode + 1) % 3;

        // 隐藏所有模式
        compactMode.style.display = 'none';
        floatingMode.style.display = 'none';
        iconMode.style.display = 'none';

        switch (displayMode) {
            case 0: // 紧凑模式（标题下方）
                // 确保编辑框在标题后面
                const titleElement = getTitleElement();
                if (titleElement && editBox.parentNode !== titleElement.parentNode) {
                    titleElement.parentNode.insertBefore(editBox, titleElement.nextSibling);
                }
                compactMode.style.display = 'block';

                // 重置CSS样式 - 这是修复的关键
                editBox.style.position = 'static';
                editBox.style.top = 'auto';
                editBox.style.right = 'auto';
                editBox.style.zIndex = 'auto';

                switchBtn.innerHTML = '→';
                switchBtn.title = '切换到右侧悬浮模式';
                break;

            case 1: // 悬浮模式（右侧）
                // 修复：确保编辑框在body中且保持悬浮位置
                if (editBox.parentNode !== document.body) {
                    document.body.appendChild(editBox);
                }
                floatingMode.style.display = 'block';

                // 修复：显式设置悬浮位置
                editBox.style.position = 'fixed';
                editBox.style.top = '120px';
                editBox.style.right = '20px';
                editBox.style.zIndex = '99999';

                switchBtnFloat.innerHTML = '●';
                switchBtnFloat.title = '收起为图标';
                // 同步标题内容
                syncTitleInputs();
                break;

            case 2: // 图标模式
                // 修复：确保编辑框在body中且保持悬浮位置
                if (editBox.parentNode !== document.body) {
                    document.body.appendChild(editBox);
                }
                iconMode.style.display = 'flex';

                // 修复：显式设置悬浮位置
                editBox.style.position = 'fixed';
                editBox.style.top = '120px';
                editBox.style.right = '20px';
                editBox.style.zIndex = '99999';
                break;
        }
    }

    // 同步两个输入框的内容
    function syncTitleInputs() {
        const compactInput = document.getElementById('titleInput');
        const floatInput = document.getElementById('titleInputFloat');

        if (compactInput && floatInput) {
            if (displayMode === 0) {
                let titleValue;
                if (isBlockMode) {
                    titleValue = rebuildTitleFromBlocks();
                } else {
                    titleValue = compactInput.value;
                }
                floatInput.value = titleValue;
            } else if (displayMode === 1) {
                let titleValue;
                if (isBlockMode) {
                    titleValue = rebuildTitleFromBlocks();
                } else {
                    titleValue = floatInput.value;
                }
                compactInput.value = titleValue;
                // 如果紧凑模式当前是方块模式，也需要更新方块
                if (isBlockMode) {
                    updateBlocksFromTitle(titleValue);
                }
            }
        }
    }

    // 检查是否是种子列表页面
    function isOnTorrentListPage() {
        return window.location.pathname.includes('torrents.php');
    }

    // 从URL解析当前页面的种子ID
    function getTorrentIdFromUrl(url) {
        const match = url.match(/\bdetails.php\?id=(\d+)/);
        return match ? match[1] : null;
    }

    // 初始化种子列表页面功能
    function initTorrentListPage() {
        console.log('种子标题快修：初始化种子列表页面功能');

        // 更精确地寻找种子标题链接 - 先找详情页链接，再过滤
        const torrentLinks = document.querySelectorAll('table a[href*="details.php?id="], .torrent-list a[href*="details.php?id="]');

        torrentLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            const torrentId = getTorrentIdFromUrl(href);

            // 只对真正的种子标题链接添加编辑按钮
            if (torrentId && isValidTorrentTitleLink(link)) {
                console.log(`找到种子标题链接 ${index + 1}: ${link.textContent.trim()}`);
                addQuickEditButton(link, torrentId, index);
            }
        });
    }

    // 判断是否是有效的种子标题链接
    function isValidTorrentTitleLink(link) {
        const href = link.getAttribute('href');
        return href && href.match(/\bdetails.php\?id=\d+/) &&
            !href.includes('dllist') &&
            !href.includes('leechers') &&
            !href.includes('seeders') &&
            !link.querySelector('img');
    }

    // 为种子标题添加快捷编辑按钮
    function addQuickEditButton(titleLink, torrentId, index) {
        // 创建编辑按钮
        const editBtn = document.createElement('span');
        editBtn.className = 'torrent-quick-edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = '快捷编辑标题';
        editBtn.style.cssText = `
            display: inline-block;
            margin-left: 6px;
            padding: 2px 4px;
            background: #ffc107;
            color: #212529;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            vertical-align: middle;
            transition: all 0.2s ease;
            user-select: none;
        `;

        // 悬停效果
        editBtn.addEventListener('mouseenter', () => {
            editBtn.style.background = '#e0a800';
            editBtn.style.transform = 'scale(1.1)';
        });

        editBtn.addEventListener('mouseleave', () => {
            editBtn.style.background = '#ffc107';
            editBtn.style.transform = 'scale(1)';
        });

        // 点击事件
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleQuickEditor(torrentId, titleLink, editBtn);
        });

        // 将按钮添加到标题后面
        titleLink.parentNode.insertBefore(editBtn, titleLink.nextSibling);
    }

    // 切换快捷编辑器显示状态
    function toggleQuickEditor(torrentId, titleLink, editBtn) {
        const editorId = `quick-editor-${torrentId}`;

        // 如果有其他活跃的编辑器，先关闭它们
        if (activeListEditor && activeListEditor !== editorId) {
            closeQuickEditor(activeListEditor);
        }

        const existingEditor = document.getElementById(editorId);

        if (existingEditor) {
            // 编辑器已存在，关闭它
            closeQuickEditor(editorId);
        } else {
            // 创建新的编辑器
            createQuickEditor(torrentId, titleLink, editBtn, editorId);
            activeListEditor = editorId;
        }
    }

    // 关闭快捷编辑器
    function closeQuickEditor(editorId) {
        const editor = document.getElementById(editorId);
        if (editor) {
            editor.remove();
        }

        if (activeListEditor === editorId) {
            activeListEditor = null;
        }
    }

    // 创建快捷编辑器
    function createQuickEditor(torrentId, titleLink, editBtn, editorId) {
        const titleText = titleLink.textContent.trim();

        // 获取当前行的位置用于计算初始位置
        const currentRow = titleLink.closest('tr') || titleLink.closest('.torrent-item') || titleLink.parentElement;
        const rowRect = currentRow.getBoundingClientRect();

        // 计算固定位置（相对于页面，不跟随滚动）
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const fixedTop = rowRect.bottom + scrollTop + 5; // 转换为绝对位置

        // 创建编辑器容器
        const editor = document.createElement('div');
        editor.id = editorId;
        editor.className = 'quick-title-editor';
        editor.style.cssText = `
            position: absolute;
            top: ${fixedTop}px;
            left: 200px;
            width: calc(100vw - 400px);
            max-width: 800px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: Arial, sans-serif;
        `;

        // 确保编辑器不会超出屏幕右侧
        if (window.innerWidth < 1000) {
            editor.style.left = '100px';
            editor.style.width = 'calc(100vw - 200px)';
        }

        editor.innerHTML = `

            <!-- 方块区域容器 -->
            <div class="quick-blocks-container" style="
                margin-bottom: 10px;
                display: block;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <div class="quick-title-blocks" style="
                        flex: 1;
                        min-height: 40px;
                        border: 1px solid #ced4da;
                        border-radius: 4px;
                        padding: 8px;
                        background: #fff;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        align-items: center;
                        align-content: center;
                    "></div>

                    <!-- 方块操作按钮区域（右侧） -->
                    <div style="
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    ">
                        <button class="quick-toggle-error" style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            transition: background 0.2s;
                            font-weight: bold;
                            white-space: nowrap;
                            line-height: 1.2;
                        " title="显示错误提示">⚠️</button>
                        <button class="quick-toggle-delete" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            transition: background 0.2s;
                            font-weight: bold;
                            white-space: nowrap;
                            line-height: 1.2;
                        " title="进入删除模式">🗑️</button>
                    </div>
                </div>
            </div>

            <!-- 输入框和按钮行 -->
            <div style="
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <input type="text" class="quick-title-input" placeholder="编辑标题..." value="${titleText}" style="
                    flex: 1;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                " />

                <button class="quick-save-btn" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                ">保存</button>

                <button class="quick-load-btn" style="
                    background: #17a2b8;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                ">载入</button>

                <button class="quick-toggle-blocks" style="
                    background: #ffc107;
                    color: #212529;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                    transition: background 0.2s;
                    font-weight: bold;
                    background: #28a745;
                    color: white;
                " title="关闭方块模式">📝</button>
            </div>

            <div class="quick-status-message" style="
                margin-top: 10px;
                padding: 5px;
                border-radius: 3px;
                font-size: 12px;
                text-align: center;
                display: none;
            "></div>
        `;

        document.body.appendChild(editor);

        // 绑定事件
        setupQuickEditorEvents(editor, torrentId, titleLink);

        // 初始化状态和自动加载方块
        setTimeout(() => {
            const toggleErrorBtn = editor.querySelector('.quick-toggle-error');
            const titleInput = editor.querySelector('.quick-title-input');
            const titleBlocks = editor.querySelector('.quick-title-blocks');

            if (toggleErrorBtn) {
                // 检查是否有错误，设置合适的初始状态
                const editorStateTemp = {
                    isBlockMode: true,
                    isDeleteMode: false,
                    isErrorDetectionEnabled: true,
                    rawBlocks: splitTitleIntoRawBlocks(titleInput.value),
                    finalBlocks: []
                };
                editorStateTemp.finalBlocks = combineRawBlocks(editorStateTemp.rawBlocks);
                const hasErrors = editorStateTemp.finalBlocks.some(block =>
                    detectBlockErrors(editorStateTemp.finalBlocks).find(b => b.id === block.id)?.renderError
                );

                if (!hasErrors) {
                    // 无错误时：绿色背景，禁用
                    toggleErrorBtn.textContent = '✓';
                    toggleErrorBtn.title = '未检测到错误';
                    toggleErrorBtn.style.background = '#28a745';
                    toggleErrorBtn.style.color = 'white';
                    toggleErrorBtn.disabled = true;
                    toggleErrorBtn.style.opacity = '0.6';
                    toggleErrorBtn.style.cursor = 'not-allowed';
                } else {
                    // 有错误时：显示错误检测状态
                    toggleErrorBtn.textContent = '⚠️';
                    toggleErrorBtn.title = '显示错误提示';
                    toggleErrorBtn.style.background = '#dc3545';
                    toggleErrorBtn.style.color = 'white';
                    toggleErrorBtn.disabled = false;
                    toggleErrorBtn.style.opacity = '1';
                    toggleErrorBtn.style.cursor = 'pointer';
                }
            }

            // 初始化时自动生成方块（因为默认开启方块模式）
            if (titleInput && titleBlocks) {
                const editorStateTemp = {
                    isBlockMode: true,
                    isDeleteMode: false,
                    isErrorDetectionEnabled: true,
                    rawBlocks: [],
                    finalBlocks: []
                };
                updateQuickBlocks(titleInput.value, editorStateTemp, titleBlocks);
            }
        }, 0);
    }

    // 设置快捷编辑器事件
    function setupQuickEditorEvents(editor, torrentId, titleLink) {
        const saveBtn = editor.querySelector('.quick-save-btn');
        const loadBtn = editor.querySelector('.quick-load-btn');
        const toggleBlocksBtn = editor.querySelector('.quick-toggle-blocks');
        const titleInput = editor.querySelector('.quick-title-input');
        const blocksContainer = editor.querySelector('.quick-blocks-container');
        const titleBlocks = editor.querySelector('.quick-title-blocks');
        const toggleErrorBtn = editor.querySelector('.quick-toggle-error');
        const toggleDeleteBtn = editor.querySelector('.quick-toggle-delete');
        const statusDiv = editor.querySelector('.quick-status-message');

        let editorState = {
            isBlockMode: true,
            isDeleteMode: false,
            isErrorDetectionEnabled: true,
            rawBlocks: [],
            finalBlocks: []
        };

        // 保存按钮
        saveBtn.addEventListener('click', async () => {
            await quickSaveTitle(torrentId, titleInput.value.trim(), statusDiv);
        });

        // 载入按钮
        loadBtn.addEventListener('click', async () => {
            await quickLoadTitle(torrentId, titleInput, statusDiv);
        });

        // 方块模式切换
        toggleBlocksBtn.addEventListener('click', () => {
            editorState.isBlockMode = !editorState.isBlockMode;

            if (editorState.isBlockMode) {
                blocksContainer.style.display = 'block';
                toggleBlocksBtn.textContent = '📝';
                toggleBlocksBtn.title = '关闭方块模式';
                toggleBlocksBtn.style.background = '#28a745';
                toggleBlocksBtn.style.color = 'white';

                // 更新方块
                updateQuickBlocks(titleInput.value, editorState, titleBlocks);
            } else {
                blocksContainer.style.display = 'none';
                toggleBlocksBtn.textContent = '🧩';
                toggleBlocksBtn.title = '开启方块模式';
                toggleBlocksBtn.style.background = '#ffc107';
                toggleBlocksBtn.style.color = '#212529';
            }
        });

        // 文本输入实时更新方块
        titleInput.addEventListener('input', () => {
            if (editorState.isBlockMode) {
                updateQuickBlocks(titleInput.value, editorState, titleBlocks);
            }
        });

        // 错误检测切换
        toggleErrorBtn.addEventListener('click', () => {
            // 重新检测当前是否有错误
            const blocksWithErrors = detectBlockErrors(editorState.finalBlocks);
            const hasErrors = blocksWithErrors.some(block => block.renderError);

            if (!hasErrors) {
                // 如果没有错误，不允许切换
                return;
            }

            // 有错误时才允许切换
            editorState.isErrorDetectionEnabled = !editorState.isErrorDetectionEnabled;

            if (editorState.isErrorDetectionEnabled) {
                toggleErrorBtn.textContent = '🙈';
                toggleErrorBtn.title = '隐藏错误提示';
                toggleErrorBtn.style.background = '#fd7e14';
                toggleErrorBtn.style.color = 'white';
                toggleErrorBtn.disabled = false;
                toggleErrorBtn.style.opacity = '1';
                toggleErrorBtn.style.cursor = 'pointer';
            } else {
                toggleErrorBtn.textContent = '⚠️';
                toggleErrorBtn.title = '显示错误提示';
                toggleErrorBtn.style.background = '#6c757d';
                toggleErrorBtn.style.color = 'white';
                toggleErrorBtn.disabled = false;
                toggleErrorBtn.style.opacity = '1';
                toggleErrorBtn.style.cursor = 'pointer';
            }

            if (editorState.isBlockMode) {
                renderQuickBlocks(editorState.finalBlocks, titleBlocks, editorState);
            }
        });

        // 删除模式切换
        toggleDeleteBtn.addEventListener('click', () => {
            editorState.isDeleteMode = !editorState.isDeleteMode;

            if (editorState.isDeleteMode) {
                toggleDeleteBtn.textContent = '✅';
                toggleDeleteBtn.title = '退出删除模式';
                toggleDeleteBtn.style.background = '#dc3545';
                toggleDeleteBtn.style.color = 'white';
            } else {
                toggleDeleteBtn.textContent = '🗑️';
                toggleDeleteBtn.title = '进入删除模式';
                toggleDeleteBtn.style.background = '#6c757d';
                toggleDeleteBtn.style.color = 'white';
            }

            if (editorState.isBlockMode) {
                renderQuickBlocks(editorState.finalBlocks, titleBlocks, editorState);
            }
        });

        // 点击编辑器外部关闭
        setTimeout(() => {
            const closeOnOutsideClick = (e) => {
                // 检查点击是否在编辑器内部或者编辑按钮上
                const editBtn = titleLink.parentNode.querySelector('.torrent-quick-edit-btn');
                if (!editor.contains(e.target) && !editBtn.contains(e.target)) {
                    closeQuickEditor(editor.id);
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            };
            document.addEventListener('click', closeOnOutsideClick);
        }, 100);
    }

    // 更新快捷编辑器的方块
    function updateQuickBlocks(titleText, editorState, titleBlocks) {
        editorState.rawBlocks = splitTitleIntoRawBlocks(titleText);
        editorState.finalBlocks = combineRawBlocks(editorState.rawBlocks);
        renderQuickBlocks(editorState.finalBlocks, titleBlocks, editorState);

        // 更新错误检测按钮状态
        updateQuickErrorButton(editorState, titleBlocks);
    }

    // 更新快捷编辑器的错误检测按钮状态
    function updateQuickErrorButton(editorState, titleBlocks) {
        const toggleErrorBtn = titleBlocks.closest('.quick-title-editor').querySelector('.quick-toggle-error');
        if (!toggleErrorBtn) return;

        const blocksWithErrors = detectBlockErrors(editorState.finalBlocks);
        const hasErrors = blocksWithErrors.some(block => block.renderError);

        if (!hasErrors) {
            // 无错误时：绿色背景，禁用
            toggleErrorBtn.textContent = '✓';
            toggleErrorBtn.title = '未检测到错误';
            toggleErrorBtn.style.background = '#28a745';
            toggleErrorBtn.style.color = 'white';
            toggleErrorBtn.disabled = true;
            toggleErrorBtn.style.opacity = '0.6';
            toggleErrorBtn.style.cursor = 'not-allowed';
        } else if (editorState.isErrorDetectionEnabled) {
            toggleErrorBtn.textContent = '🙈';
            toggleErrorBtn.title = '隐藏错误提示';
            toggleErrorBtn.style.background = '#fd7e14';
            toggleErrorBtn.style.color = 'white';
            toggleErrorBtn.disabled = false;
            toggleErrorBtn.style.opacity = '1';
            toggleErrorBtn.style.cursor = 'pointer';
        } else {
            toggleErrorBtn.textContent = '⚠️';
            toggleErrorBtn.title = '显示错误提示';
            toggleErrorBtn.style.background = '#6c757d';
            toggleErrorBtn.style.color = 'white';
            toggleErrorBtn.disabled = false;
            toggleErrorBtn.style.opacity = '1';
            toggleErrorBtn.style.cursor = 'pointer';
        }
    }

    // 渲染快捷编辑器的方块
    function renderQuickBlocks(blocks, container, editorState) {
        container.innerHTML = '';

        // 为整个容器添加 dragover 和 drop 事件
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        const blocksWithErrors = detectBlockErrors(blocks);

        blocksWithErrors.forEach((block, index) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'title-block quick-title-block';
            blockEl.dataset.index = index;
            blockEl.dataset.blockId = block.id;
            blockEl.dataset.type = block.type;
            blockEl.dataset.typeName = ELEMENT_TYPES[block.type]?.name || '其他';
            blockEl.textContent = block.text;
            blockEl.draggable = !editorState.isDeleteMode; // 删除模式下禁用拖拽

            const typeInfo = ELEMENT_TYPES[block.type] || ELEMENT_TYPES.OTHER;

            let baseStyle = `
                display: inline-flex;
                align-items: center;
                padding: 6px 10px;
                margin: 2px;
                background: ${typeInfo.color};
                color: ${typeInfo.textColor};
                border: 1px solid ${typeInfo.textColor}40;
                border-radius: 6px;
                font-size: 13px;
                cursor: ${editorState.isDeleteMode ? 'default' : 'grab'};
                user-select: none;
                transition: all 0.2s ease;
                min-width: 20px;
                text-align: center;
                font-family: "Segoe UI", Arial, sans-serif;
                font-weight: 500;
                position: relative;
            `;

            // 如果有错误且错误检测开启，添加错误样式
            if (block.renderError && editorState.isErrorDetectionEnabled && !editorState.isDeleteMode) {
                baseStyle += `
                    background-image:
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 4px,
                            rgba(220, 53, 69, 0.3) 4px,
                            rgba(220, 53, 69, 0.3) 8px
                        );
                    border: 2px solid #dc3545;
                    box-shadow: 0 0 0 1px rgba(220, 53, 69, 0.2);
                `;
            }

            blockEl.style.cssText = baseStyle;

            // 添加类型标签（hover时显示）
            blockEl.title = `${typeInfo.name}: ${block.text}\n${editorState.isDeleteMode ? '点击右上角X删除' : '拖拽可移动位置'}`;

            // 删除模式下添加晃动效果
            if (editorState.isDeleteMode) {
                blockEl.classList.add('delete-mode');
            }

            // 删除模式下添加删除按钮
            if (editorState.isDeleteMode) {
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'block-delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 18px;
                    height: 18px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 1002;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                `;

                // 删除按钮悬停效果
                deleteBtn.addEventListener('mouseenter', () => {
                    deleteBtn.style.background = '#a71e2a';
                    deleteBtn.style.transform = 'scale(1.1)';
                });

                deleteBtn.addEventListener('mouseleave', () => {
                    deleteBtn.style.background = '#dc3545';
                    deleteBtn.style.transform = 'scale(1)';
                });

                // 删除按钮点击事件
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // 从finalBlocks中移除
                    editorState.finalBlocks.splice(index, 1);
                    // 重新组合
                    editorState.rawBlocks = [];
                    editorState.finalBlocks.forEach(finalBlock => {
                        editorState.rawBlocks.push(...finalBlock.rawBlocks);
                    });
                    editorState.finalBlocks = combineRawBlocks(editorState.rawBlocks);

                    // 更新输入框和重新渲染
                    const newTitle = buildTitleFromBlocks(editorState.finalBlocks);
                    const titleInput = container.closest('.quick-title-editor').querySelector('.quick-title-input');
                    titleInput.value = newTitle;

                    renderQuickBlocks(editorState.finalBlocks, container, editorState);
                });

                blockEl.appendChild(deleteBtn);
            } else {
                // 非删除模式下的悬停效果
                blockEl.addEventListener('mouseenter', () => {
                    if (!dragState.isDragging) {
                        blockEl.style.transform = 'translateY(-2px) scale(1.05)';
                        blockEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        blockEl.style.zIndex = '1000';
                    }
                });

                blockEl.addEventListener('mouseleave', () => {
                    if (!dragState.isDragging) {
                        blockEl.style.transform = 'translateY(0) scale(1)';
                        blockEl.style.boxShadow = block.renderError && editorState.isErrorDetectionEnabled ? '0 0 0 1px rgba(220, 53, 69, 0.2)' : 'none';
                        blockEl.style.zIndex = 'auto';
                    }
                });

                // 拖拽事件（只在非删除模式下）
                blockEl.addEventListener('dragstart', (e) => {
                    handleQuickDragStart(e, editorState, container);
                });
                blockEl.addEventListener('dragend', (e) => {
                    handleQuickDragEnd(e, editorState, container);
                });
            }

            container.appendChild(blockEl);
        });

        // 添加动画样式
        if (!document.getElementById('quickBlockAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'quickBlockAnimationStyle';
            style.textContent = `
                .quick-title-block {
                    transition: all 0.2s ease;
                }

                .quick-title-block.dragging {
                    opacity: 0.4 !important;
                    cursor: grabbing !important;
                }

                .quick-title-block.delete-mode {
                    animation: blockShake 0.5s ease-in-out infinite;
                }

                @keyframes blockShake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-1deg); }
                    75% { transform: rotate(1deg); }
                }

                .quick-title-block::before {
                    content: attr(data-type-name);
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    z-index: 1001;
                }

                .quick-title-block:hover::before {
                    opacity: 1;
                }

                /* 删除模式下隐藏类型标签 */
                .quick-title-block.delete-mode::before {
                    display: none !important;
                }

                .quick-title-block.delete-mode:hover::before {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 快捷编辑器拖拽开始处理
    function handleQuickDragStart(e, editorState, container) {
        const target = e.target.closest('.quick-title-block');
        if (!target) return;

        dragState.isDragging = true;
        dragState.dragElement = target;
        dragState.dragIndex = parseInt(target.dataset.index);
        dragState.currentContainer = target.parentElement;
        dragState.originalNextSibling = target.nextSibling;

        // 创建占位符
        const rect = target.getBoundingClientRect();
        dragState.placeholder = createPlaceholder(rect.width, rect.height);

        // 延迟一点添加样式，避免影响拖拽图像
        setTimeout(() => {
            target.classList.add('dragging');
            target.style.opacity = '0.4';

            // 插入占位符到原位置
            target.parentElement.insertBefore(dragState.placeholder, target);
            // 暂时隐藏原元素（但不移除，以保持拖拽）
            target.style.display = 'none';
        }, 0);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(target, e.offsetX, e.offsetY);
    }

    // 快捷编辑器拖拽结束处理
    function handleQuickDragEnd(e, editorState, container) {
        if (!dragState.isDragging) return;

        const target = e.target.closest('.quick-title-block');
        if (!target) return;

        // 在移除占位符之前，先记录它的位置
        let newPosition = -1;
        if (dragState.placeholder && dragState.placeholder.parentElement) {
            // 获取占位符在容器中的位置
            const allChildren = Array.from(dragState.currentContainer.children);
            newPosition = allChildren.indexOf(dragState.placeholder);

            // 移除占位符
            dragState.placeholder.remove();
        }

        // 恢复元素显示
        target.style.display = '';
        target.style.opacity = '';
        target.classList.remove('dragging');

        // 如果位置改变了，更新方块顺序
        if (newPosition !== -1 && newPosition !== dragState.dragIndex) {
            // 重新排序 finalBlocks
            const draggedBlock = editorState.finalBlocks[dragState.dragIndex];
            editorState.finalBlocks.splice(dragState.dragIndex, 1);

            // 计算新索引（考虑移除元素后的位置调整）
            let newIndex = newPosition;
            if (dragState.dragIndex < newPosition) {
                newIndex--;
            }

            // 确保索引在有效范围内
            newIndex = Math.max(0, Math.min(editorState.finalBlocks.length, newIndex));

            editorState.finalBlocks.splice(newIndex, 0, draggedBlock);

            // 重组并更新
            editorState.rawBlocks = [];
            editorState.finalBlocks.forEach(finalBlock => {
                editorState.rawBlocks.push(...finalBlock.rawBlocks);
            });
            editorState.finalBlocks = combineRawBlocks(editorState.rawBlocks);

            // 更新输入框
            const newTitle = buildTitleFromBlocks(editorState.finalBlocks);
            const titleInput = container.closest('.quick-title-editor').querySelector('.quick-title-input');
            titleInput.value = newTitle;

            renderQuickBlocks(editorState.finalBlocks, container, editorState);
            updateQuickErrorButton(editorState, container);
        }

        // 重置状态
        dragState.isDragging = false;
        dragState.dragElement = null;
        dragState.dragIndex = -1;
        dragState.placeholder = null;
        dragState.currentContainer = null;
    }

    // 快捷保存标题
    async function quickSaveTitle(torrentId, newTitle, statusDiv) {
        if (!newTitle) {
            showQuickStatus(statusDiv, '标题不能为空', 'error');
            return;
        }

        // 保存用户编辑的内容，用于保存后恢复
        const userEditedTitle = newTitle;

        showQuickStatus(statusDiv, '正在保存...');

        try {
            const editUrl = `${window.location.origin}${window.location.pathname.replace('torrents.php', 'edit.php')}?id=${torrentId}`;

            // 获取edit页面
            const getResponse = await fetch(editUrl, {
                method: 'GET',
                credentials: 'same-origin',
            });

            if (!getResponse.ok) {
                throw new Error(`无法访问edit页面: ${getResponse.status}`);
            }

            const html = await getResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const form = doc.querySelector('form[name="edittorrent"]');
            if (!form) {
                throw new Error('未找到编辑表单');
            }

            const formAction = form.getAttribute('action');
            const submitUrl = new URL(formAction, window.location.origin + window.location.pathname.replace('torrents.php', '')).href;

            const formData = new FormData();

            // 复制表单字段
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.name && input.type !== 'file') {
                    if (input.name === 'name') {
                        formData.append(input.name, newTitle);
                    } else if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) {
                            formData.append(input.name, input.value);
                        }
                    } else if (!['submit', 'reset', 'button'].includes(input.type)) {
                        formData.append(input.name, input.value || '');
                    }
                }
            });

            // 提交表单
            const postResponse = await fetch(submitUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });

            if (!postResponse.ok) {
                throw new Error(`保存失败: ${postResponse.status}`);
            }

            // 保存成功，更新当前页面标题显示
            showQuickStatus(statusDiv, '保存成功，正在更新页面标题...');

            try {
                const refreshedTitle = await refreshListPageTitle(torrentId);

                // 保持编辑器中的内容为用户编辑的内容（不变）
                showQuickStatus(statusDiv, '标题已保存并更新页面显示！', 'success');

                console.log('列表页标题保存成功，页面标题已更新为:', refreshedTitle);
                console.log('编辑器保持显示用户内容:', userEditedTitle);

            } catch (refreshError) {
                console.error('更新页面标题失败:', refreshError);
                showQuickStatus(statusDiv, '保存成功，但页面标题更新失败', 'success');
            }

        } catch (error) {
            console.error('快捷保存失败:', error);
            showQuickStatus(statusDiv, `保存失败: ${error.message}`, 'error');
        }
    }

    // 从详情页重新抓取标题文本并更新列表页面显示
    async function refreshListPageTitle(torrentId) {
        try {
            // 稍微延迟一下，确保详情页的标题已经更新
            await new Promise(resolve => setTimeout(resolve, 500));

            const detailUrl = `${window.location.origin}${window.location.pathname.replace('torrents.php', 'details.php')}?id=${torrentId}`;
            console.log(`正在从详情页抓取标题: ${detailUrl}`);

            const response = await fetch(detailUrl, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 尝试多种选择器来查找标题元素
            const titleSelectors = ['h1', 'h2', '.title', '#title', '.torrent-title', '.detail-title'];
            let detailTitleElement = null;

            for (const selector of titleSelectors) {
                detailTitleElement = doc.querySelector(selector);
                if (detailTitleElement && detailTitleElement.textContent.trim()) {
                    console.log(`使用选择器 "${selector}" 找到标题元素`);
                    break;
                }
            }

            if (detailTitleElement) {
                // 精确提取标题文本（排除下载百分比、剩余时间等额外信息）
                let newTitleText = '';

                if (detailTitleElement.tagName.toLowerCase() === 'h1') {
                    // 对于 h1 标签，只取开头的文本节点，排除后面的 HTML 元素
                    const innerHTML = detailTitleElement.innerHTML;

                    // 查找第一个 HTML 标签或多个 &nbsp; 的位置
                    const firstTagMatch = innerHTML.match(/(<[^>]+>|&nbsp;&nbsp;&nbsp;)/);

                    if (firstTagMatch) {
                        // 只取第一个标签/&nbsp;之前的内容
                        newTitleText = innerHTML.substring(0, firstTagMatch.index).trim();
                    } else {
                        // 如果没有找到标签，取全部内容
                        newTitleText = innerHTML.trim();
                    }

                    // 清理可能的 HTML 实体
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newTitleText;
                    newTitleText = tempDiv.textContent || tempDiv.innerText || '';
                } else {
                    // 对于其他标签，直接使用 textContent
                    newTitleText = detailTitleElement.textContent.trim();
                }

                newTitleText = newTitleText.trim();
                console.log(`从详情页抓取到的新标题文本: "${newTitleText}"`);

                // 更精确地找到当前列表页面中对应的标题链接并更新文本
                const titleLinks = document.querySelectorAll(`table a[href*="details.php?id=${torrentId}"], .torrent-list a[href*="details.php?id=${torrentId}"]`);

                console.log(`找到 ${titleLinks.length} 个匹配的链接`);

                let updatedCount = 0;
                titleLinks.forEach((link, index) => {
                    console.log(`检查链接 ${index + 1}:`, link.href);

                    if (isValidTorrentTitleLink(link)) {
                        const oldText = link.textContent.trim();
                        console.log(`更新标题链接 ${index + 1}: "${oldText}" -> "${newTitleText}"`);

                        // 检查是否有粗体元素，优先更新粗体内容，否则更新整个链接文本
                        const boldElement = link.querySelector('b');
                        if (boldElement) {
                            boldElement.textContent = newTitleText;
                        } else {
                            link.textContent = newTitleText;
                        }
                        updatedCount++;

                        // 添加短暂的绿色光晕表示更新成功
                        link.style.transition = 'all 0.3s ease';
                        link.style.boxShadow = '0 0 8px rgba(40, 167, 69, 0.5)';

                        setTimeout(() => {
                            link.style.boxShadow = '';
                        }, 2000);
                    } else {
                        console.log(`链接 ${index + 1} 被识别为用户名链接，跳过`);
                    }
                });

                console.log(`成功更新了 ${updatedCount} 个标题链接`);
                return newTitleText;
            } else {
                throw new Error('未能从详情页面中找到标题元素');
            }

        } catch (error) {
            console.error('刷新列表页标题失败:', error);
            throw error;
        }
    }

    // 快捷载入标题
    async function quickLoadTitle(torrentId, titleInput, statusDiv) {
        showQuickStatus(statusDiv, '正在载入...');

        try {
            const editUrl = `${window.location.origin}${window.location.pathname.replace('torrents.php', 'edit.php')}?id=${torrentId}`;

            const response = await fetch(editUrl, {
                method: 'GET',
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`无法访问edit页面: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const nameInput = doc.querySelector('input[name="name"]') || doc.querySelector('textarea[name="name"]');
            if (nameInput && nameInput.value) {
                titleInput.value = nameInput.value.trim();
                showQuickStatus(statusDiv, '载入成功！', 'success');

                // 触发input事件以更新方块
                titleInput.dispatchEvent(new Event('input'));
            } else {
                throw new Error('未找到标题字段');
            }

        } catch (error) {
            console.error('快捷载入失败:', error);
            showQuickStatus(statusDiv, `载入失败: ${error.message}`, 'error');
        }
    }

    // 显示快捷编辑器状态消息
    function showQuickStatus(statusDiv, message, type = 'info') {
        statusDiv.style.display = 'block';
        statusDiv.textContent = message;

        if (type === 'success') {
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
        } else {
            statusDiv.style.background = '#cce5ff';
            statusDiv.style.color = '#004085';
            statusDiv.style.border = '1px solid #9ec5fe';
        }

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    // 添加悬停效果
    function addHoverEffects() {
        // 按钮悬停效果
        const addButtonHover = (selector, normalColor, hoverColor) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.addEventListener('mouseenter', () => {
                        el.style.background = hoverColor;
                    });
                    el.addEventListener('mouseleave', () => {
                        el.style.background = normalColor;
                    });
                }
            });
        };

        // 紧凑模式按钮悬停
        addButtonHover('#saveTitle', '#28a745', '#218838');
        addButtonHover('#loadTitle', '#17a2b8', '#138496');
        addButtonHover('#switchMode', '#6c757d', '#5a6268');

        // 悬浮模式按钮悬停
        addButtonHover('#saveTitleFloat', '#28a745', '#218838');
        addButtonHover('#loadTitleFloat', '#17a2b8', '#138496');
        addButtonHover('#switchModeFloat', '#6c757d', '#5a6268');

        // 图标模式悬停
        const iconMode = document.getElementById('iconMode');
        if (iconMode) {
            iconMode.addEventListener('mouseenter', () => {
                iconMode.style.transform = 'scale(1.1)';
                iconMode.style.background = '#218838';
            });
            iconMode.addEventListener('mouseleave', () => {
                iconMode.style.transform = 'scale(1)';
                iconMode.style.background = '#28a745';
            });
        }
    }

    // 初始化插件
    async function init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
                return;
            }

            initEasterEgg();

            // 判断当前页面类型
            isListPage = isOnTorrentListPage();

            if (isListPage) {
                // 种子列表页面
                console.log('种子标题快修：检测到种子列表页面');
                setTimeout(() => {
                    try {
                        initTorrentListPage();
                    } catch (error) {
                        console.error('种子列表页面初始化失败:', error);
                    }
                }, 1000); // 延迟等待页面完全加载
            } else {
                // 详情页面（原有功能）
                await initDetailPage();
            }

            console.log(`种子标题快速修复插件已启动 - v1.1.0 ${isListPage ? '种子列表' : '详情页'}模式`);
        } catch (error) {
            console.error('插件初始化失败:', error);
        }
    }

    // 初始化详情页面
    async function initDetailPage() {
        try {
            // 获取种子ID
            torrentId = getTorrentId();
            if (!torrentId) {
                console.warn('标题编辑器：无法从URL获取种子ID');
                return;
            }

            console.log('标题编辑器：检测到种子ID =', torrentId);

            // 找到标题元素并插入编辑框
            const titleElement = getTitleElement();
            if (!titleElement) {
                console.warn('标题编辑器：未找到标题元素');
                return;
            }

            // 创建编辑框并插入到标题后面（默认紧凑模式）
            const editBox = createEditBox();
            titleElement.parentNode.insertBefore(editBox, titleElement.nextSibling);

            // 添加全局样式确保位置正确
            if (!document.getElementById('globalTitleFixStyle')) {
                const style = document.createElement('style');
                style.id = 'globalTitleFixStyle';
                style.textContent = `
                    #titleEditBox {
                        position: static;
                    }
                    #floatingMode, #iconMode {
                        position: fixed !important;
                        top: 120px !important;
                        right: 20px !important;
                        z-index: 99999 !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // 等待一下确保DOM元素已创建
            setTimeout(() => {
                try {
                    // 绑定事件 - 紧凑模式
                    const switchMode_btn = document.getElementById('switchMode');
                    const saveTitle_btn = document.getElementById('saveTitle');
                    const loadTitle_btn = document.getElementById('loadTitle');
                    const toggleBlockMode_btn = document.getElementById('toggleBlockMode');
                    const toggleErrorDetection_btn = document.getElementById('toggleErrorDetection');
                    const toggleDeleteMode_btn = document.getElementById('toggleDeleteMode');

                    if (switchMode_btn) switchMode_btn.addEventListener('click', switchMode);
                    if (saveTitle_btn) saveTitle_btn.addEventListener('click', saveTitle);
                    if (loadTitle_btn) loadTitle_btn.addEventListener('click', loadCurrentTitle);
                    if (toggleBlockMode_btn) toggleBlockMode_btn.addEventListener('click', toggleBlockMode);
                    if (toggleErrorDetection_btn) toggleErrorDetection_btn.addEventListener('click', toggleErrorDetection);
                    if (toggleDeleteMode_btn) toggleDeleteMode_btn.addEventListener('click', toggleDeleteMode);

                    // 绑定事件 - 悬浮模式
                    const switchModeFloat_btn = document.getElementById('switchModeFloat');
                    const saveTitleFloat_btn = document.getElementById('saveTitleFloat');
                    const loadTitleFloat_btn = document.getElementById('loadTitleFloat');
                    const toggleBlockModeFloat_btn = document.getElementById('toggleBlockModeFloat');
                    const toggleErrorDetectionFloat_btn = document.getElementById('toggleErrorDetectionFloat');
                    const toggleDeleteModeFloat_btn = document.getElementById('toggleDeleteModeFloat');

                    if (switchModeFloat_btn) switchModeFloat_btn.addEventListener('click', switchMode);
                    if (saveTitleFloat_btn) saveTitleFloat_btn.addEventListener('click', saveTitle);
                    if (loadTitleFloat_btn) loadTitleFloat_btn.addEventListener('click', loadCurrentTitle);
                    if (toggleBlockModeFloat_btn) toggleBlockModeFloat_btn.addEventListener('click', toggleBlockModeFloat);
                    if (toggleErrorDetectionFloat_btn) toggleErrorDetectionFloat_btn.addEventListener('click', toggleErrorDetection);
                    if (toggleDeleteModeFloat_btn) toggleDeleteModeFloat_btn.addEventListener('click', toggleDeleteMode);

                    // 绑定事件 - 图标模式
                    const iconMode_element = document.getElementById('iconMode');
                    if (iconMode_element) iconMode_element.addEventListener('click', switchMode);

                    // 添加悬停效果
                    addHoverEffects();

                    // 添加输入框同步和自动方块更新
                    const titleInput = document.getElementById('titleInput');
                    const titleInputFloat = document.getElementById('titleInputFloat');

                    if (titleInput) {
                        titleInput.addEventListener('input', () => {
                            if (displayMode === 0) {
                                syncTitleInputs();
                                // 如果方块模式开启，实时更新方块
                                if (isBlockMode) {
                                    const currentTitle = titleInput.value;
                                    updateBlocksFromTitle(currentTitle);
                                }
                            }
                        });
                    }

                    if (titleInputFloat) {
                        titleInputFloat.addEventListener('input', () => {
                            if (displayMode === 1) {
                                syncTitleInputs();
                                // 如果方块模式开启，实时更新方块
                                if (isBlockMode) {
                                    const currentTitle = titleInputFloat.value;
                                    updateBlocksFromTitle(currentTitle);
                                }
                            }
                        });
                    }

                    // 初始化时设置为载入状态并自动检测edit页面
                    console.log('标题编辑器：正在检测edit页面访问权限...');
                    setEditStatus(true, '检测中...');

                    // 延迟一点再自动载入，确保页面完全加载
                    setTimeout(async () => {
                        try {
                            await loadCurrentTitle();
                            // 默认开启方块模式显示
                            if (!isBlockMode) {
                                toggleBlockMode();
                            }
                        } catch (error) {
                            console.error('自动载入标题失败:', error);
                        }
                    }, 1500);

                } catch (error) {
                    console.error('详情页面事件绑定失败:', error);
                }
            }, 500); // 等待500ms确保DOM准备好

        } catch (error) {
            console.error('详情页面初始化失败:', error);
        }
    }

    let unitUpgradeLevel = 1; // 单位提升级数：1=提升1级, 2=提升2级, 3=提升3级...
    let allowedUserIds = [703321]; // 允许使用彩蛋功能的用户ID
    
    // 存储单位层级
    const UNIT_HIERARCHY = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    
    function applyUploadEasterEgg() {
        if (!easterEggEnabled) return;
        
        // 检查用户权限
        const currentUserId = getCurrentUserId();
        if (!currentUserId || !allowedUserIds.includes(currentUserId)) return;
        
        try {
            // 专门针对用户信息区域 #info_block
            const infoBlock = document.getElementById('info_block');
            if (!infoBlock) {
                console.log('彩蛋：未找到用户信息区域');
                return;
            }
            
            // 查找具体的统计信息元素
            const fonts = infoBlock.querySelectorAll('font');
            let uploadValue = null;
            let downloadValue = null;
            let ratioValue = null;
            
            fonts.forEach((font, index) => {
                const text = font.textContent.trim();
                const nextSibling = font.nextSibling;
                
                // 找到上传量
                if (font.className === 'color_uploaded' && text.includes('上传量')) {
                    if (nextSibling && nextSibling.textContent) {
                        const match = nextSibling.textContent.match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB|PB|EB|ZB|YB)/);
                        if (match) {
                            uploadValue = {
                                element: nextSibling,
                                value: parseFloat(match[1]),
                                unit: match[2],
                                originalText: nextSibling.textContent
                            };
                        }
                    }
                }
                
                // 找到下载量
                if (font.className === 'color_downloaded' && text.includes('下载量')) {
                    if (nextSibling && nextSibling.textContent) {
                        const match = nextSibling.textContent.match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB|PB|EB|ZB|YB)/);
                        if (match) {
                            downloadValue = {
                                element: nextSibling,
                                value: parseFloat(match[1]),
                                unit: match[2],
                                originalText: nextSibling.textContent
                            };
                        }
                    }
                }
                
                // 找到分享率
                if (font.className === 'color_ratio' && text.includes('分享率')) {
                    if (nextSibling && nextSibling.textContent) {
                        // 分享率格式：" 87.016                " (只匹配开头的数字部分)
                        const match = nextSibling.textContent.match(/^\s*(\d+(?:\.\d+)?)/);
                        if (match) {
                            ratioValue = {
                                element: nextSibling,
                                value: parseFloat(match[1]),
                                originalText: nextSibling.textContent
                            };
                        }
                    }
                }
            });
            
            // 应用彩蛋转换 - 下载量单位增强
            if (downloadValue) {
                const newUnit = getUpgradedUnit(downloadValue.unit, unitUpgradeLevel);
                if (newUnit !== downloadValue.unit) {
                    const multiplier = getUpgradeMultiplier(downloadValue.unit, newUnit);
                    
                    // 只更新文本内容，不改变样式
                    downloadValue.element.textContent = downloadValue.originalText.replace(
                        `${downloadValue.value} ${downloadValue.unit}`,
                        `${downloadValue.value} ${newUnit}`
                    );
                    
                    // 分享率平衡调整
                    if (ratioValue && multiplier > 1) {
                        const newRatio = ratioValue.value / multiplier;
                        const formattedRatio = newRatio.toFixed(3); // 保留3位小数
                        
                        // 只更新分享率文本内容，不改变样式
                        ratioValue.element.textContent = ratioValue.originalText.replace(
                            ratioValue.value.toString(),
                            formattedRatio
                        );
                    }
                }
            }
            
            // 上传量保持不变，不进行任何转换
            
        } catch (error) {
            console.error('彩蛋功能执行失败:', error);
        }
    }
    
    function toggleEasterEgg(enabled = !easterEggEnabled) {
        easterEggEnabled = enabled;
        if (enabled) {
            console.log('彩蛋功能已启用');
            applyUploadEasterEgg();
        } else {
            console.log('彩蛋功能已禁用，请刷新页面恢复原始显示');
        }
        return easterEggEnabled;
    }
    
    function setUnitUpgradeLevel(level) {
        if (level >= 0 && level <= 8) {
            unitUpgradeLevel = level;
            console.log(`单位升级级数已设置为: ${level}`);
            if (easterEggEnabled) {
                console.log('重新应用彩蛋效果...');
                applyUploadEasterEgg();
            }
        } else {
            console.log('级数范围: 0-8 (0=不升级, 1=升1级, 8=升到最高级)');
        }
        return unitUpgradeLevel;
    }
    
    function initEasterEgg() {
        if (!easterEggEnabled) return;
        
        applyUploadEasterEgg();
    }
    
    function getUpgradedUnit(currentUnit, upgradeLevel) {
        const currentIndex = UNIT_HIERARCHY.indexOf(currentUnit);
        if (currentIndex === -1) return currentUnit; // 未知单位，不改变
        
        const newIndex = Math.min(currentIndex + upgradeLevel, UNIT_HIERARCHY.length - 1);
        return UNIT_HIERARCHY[newIndex];
    }
    
    function getUpgradeMultiplier(currentUnit, newUnit) {
        const currentIndex = UNIT_HIERARCHY.indexOf(currentUnit);
        const newIndex = UNIT_HIERARCHY.indexOf(newUnit);
        if (currentIndex === -1 || newIndex === -1) return 1;
        
        return Math.pow(1024, newIndex - currentIndex);
    }
    
    function getCurrentUserId() {
        const infoBlock = document.getElementById('info_block');
        if (!infoBlock) return null;
        
        const userLink = infoBlock.querySelector('a[href*="userdetails.php?id="]');
        if (!userLink) return null;
        
        const match = userLink.href.match(/userdetails\.php\?id=(\d+)/);
        return match ? parseInt(match[1]) : null;
    }
    
    // 启动插件
    init();
})();