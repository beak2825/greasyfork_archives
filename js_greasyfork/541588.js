// ==UserScript==
// @name         115文件完整性批量检查重命名
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  检查115网盘中"全xx集"文件夹的完整性，用绿色圆点标注完整的，红色圆点标注不完整的。支持点击单个绿标或批量重命名为"影视名称 (年份)"格式
// @author       zscc
// @match        https://115.com/*
// @match        https://*.115.com/*
// @grant        none
// @updateURL
// @downloadURL
// @supportURL
// @homepageURL
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541588/115%E6%96%87%E4%BB%B6%E5%AE%8C%E6%95%B4%E6%80%A7%E6%89%B9%E9%87%8F%E6%A3%80%E6%9F%A5%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/541588/115%E6%96%87%E4%BB%B6%E5%AE%8C%E6%95%B4%E6%80%A7%E6%89%B9%E9%87%8F%E6%A3%80%E6%9F%A5%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

/*
 * 115网盘文件完整性检查器增强版
 *
 * 功能说明：
 * 1. 自动检测"全xx集"格式的文件夹完整性
 * 2. 用绿色圆点标注完整的文件夹，红色圆点标注不完整的
 * 3. 点击绿色圆点可一键重命名为"影视名称 (年份)"格式
 * 4. 支持批量重命名所有绿标（完整）文件
 * 5. 智能提取影视剧名称和年份信息
 * 6. 支持多种115网盘页面布局
 * 7. 智能文件数量检测，支持多种115网盘布局
 * 8. 可配置无法确定文件数量时的处理方式（显示为红色/隐藏标注）
 * 9. 严格模式：启用更多文件数量检测方法
 * 10. 优化API调用：参考115pan_aria2脚本的文件获取逻辑
 * 11. 智能文件夹ID提取：支持多种115网盘页面布局和属性
 * 12. 纯API检测：仅使用官方API获取准确的文件数量
 *
 * 重命名规则：
 * • 优先从第一个"】"和"["符号之间提取影视名称
 * • 示例："【高清剧集网发布 www.PTHDTV.com】成家[全36集]..." → "成家 (2025)"
 * • 自动提取年份信息（2000-2039年范围）
 * • 如果没有年份，则只使用影视名称
 *
 * 使用方法：
 * 1. 安装脚本后访问115网盘
 * 2. 脚本会自动在文件夹图标上添加彩色圆点
 * 3. 绿色圆点表示文件完整，可点击进行单个重命名
 * 4. 红色圆点表示文件不完整
 * 5. 点击页面右上角的"批量重命名绿标文件"按钮进行批量操作
 * 6. 重命名前会显示提取信息供确认
 *
 * 支持的文件名格式：
 * • 【发布组】影视名称[集数信息]技术参数
 * • 影视名称.技术参数.年份.格式信息
 * • 其他包含】和[符号的格式
 *
 * 自定义配置：
 * 可以修改下方CONFIG对象中的设置来自定义脚本行为
 *
 * 新增配置选项：
 * • STRICT_FILE_COUNT_CHECK: 启用严格的文件数量检查模式
 * • SHOW_UNKNOWN_AS_INCOMPLETE: 无法确定文件数量时显示为不完整（红色）
 * • HIDE_UNKNOWN_FILES: 隐藏无法确定文件数量的文件（不显示任何标注）
 *
 * 问题修复：
 * • 修复了绿标文件误判问题：当无法获取实际文件数量时，不再错误地使用文件名中的集数
 * • 改进了115网盘文件数量检测算法，支持更多页面布局
 * • 增加了多种文件数量提取方法，提高检测准确性
 *
 * 最新优化（v2.4）：
 * • 修复API调用问题：使用GM.xmlHttpRequest替代fetch，解决CORS跨域限制
 * • 参考115pan_aria2脚本的API调用方法，使用官方API获取准确的文件数量
 * • 智能文件夹ID提取：支持从元素属性、父元素、链接URL、onclick事件等多种方式获取
 * • API调用优化：使用正确的请求头、认证信息和错误处理机制
 * • 文件类型过滤：准确区分文件和文件夹，只统计实际文件数量
 * • 纯API检测：移除所有DOM解析备用方法，确保数据准确性
 * • 增强错误处理：针对权限错误、网络错误等不同情况采用不同的重试策略
 */

(function() {
    'use strict';

    // 脚本配置 - 用户可以根据需要修改这些设置
    const CONFIG = {
        // 调试模式：开启后会在控制台输出详细的调试信息
        // 如果遇到问题，建议开启此选项以便排查
        DEBUG_MODE: true,

        // 自动处理延迟（毫秒）：页面加载后等待多久开始处理文件
        // 如果网络较慢，可以适当增加这个值
        PROCESS_DELAY: 3000,

        // 页面变化检测延迟（毫秒）：检测到页面变化后等待多久重新处理
        // 避免频繁触发，提高性能
        MUTATION_DELAY: 1000,

        // 重命名功能开关：是否启用点击绿色圆点进行重命名的功能
        // 如果只想要完整性检查功能，可以设置为false
        ENABLE_RENAME: true,

        // 文件数量检测超时（毫秒）：获取文件数量的最大等待时间
        FILE_COUNT_TIMEOUT: 5000,

        // 圆点样式配置
        DOT_SIZE: '12px',           // 圆点大小
        DOT_BORDER_RADIUS: '50%',   // 圆点圆角
        DOT_OPACITY: '0.8',         // 圆点透明度

        // 颜色配置
        COMPLETE_COLOR: '#4CAF50',   // 完整文件的圆点颜色（绿色）
        INCOMPLETE_COLOR: '#F44336', // 不完整文件的圆点颜色（红色）

        // 重命名配置
        AUTO_REFRESH_AFTER_RENAME: true,  // 重命名成功后是否自动刷新页面
        SHOW_RENAME_CONFIRMATION: true,   // 是否显示重命名确认对话框
        COPY_TO_CLIPBOARD_ON_ERROR: true, // 重命名失败时是否复制建议名称到剪贴板

        // 批量重命名配置
        ENABLE_BATCH_RENAME: true,        // 是否启用批量重命名功能
        BATCH_RENAME_DELAY: 1000,         // 批量重命名时每个文件之间的延迟（毫秒）
        BATCH_SHOW_PROGRESS: true,        // 是否显示批量重命名进度
        BATCH_CONFIRM_BEFORE_START: true, // 批量重命名前是否显示确认对话框
        BATCH_STOP_ON_ERROR: false,      // 遇到错误时是否停止批量操作

        // 文件数量检测配置
        STRICT_FILE_COUNT_CHECK: true,    // 是否启用严格的文件数量检查
        SHOW_UNKNOWN_AS_INCOMPLETE: true, // 无法确定文件数量时是否显示为不完整（红色）
        HIDE_UNKNOWN_FILES: false        // 是否隐藏无法确定文件数量的文件（不显示任何标注）
    };

    // 调试日志函数
    function debugLog(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log('[115文件检查器]', ...args);
        }
    }

    debugLog('115网盘文件完整性检查器增强版已加载');
    debugLog('配置:', CONFIG);

    // 测试提取函数（仅在调试模式下运行）
    if (CONFIG.DEBUG_MODE) {
        // 测试用户提供的示例
        const testFileName = '【高清剧集网发布 www.PTHDTV.com】成家[全36集][国语配音+中文字幕].Home.About.Us.S01.2025.2160p.WEB-DL.DDP2.0.H265-ZeroTV星标';
        const testResult = extractTitleAndYear(testFileName);
        debugLog('测试提取结果:', testResult);
        debugLog('期望结果: {title: "成家", year: "2025"}');

        // 测试其他常见格式
        const testCases = [
            '【字幕组】电影名称[1080p][中文字幕].Movie.Name.2023.1080p.BluRay.x264',
            '影视剧名称.TV.Show.S01.2024.WEB-DL.1080p.H264',
            '】测试影片[全24集][国语].Test.Movie.2022.720p.WEB-DL'
        ];

        testCases.forEach((testCase, index) => {
            const result = extractTitleAndYear(testCase);
            debugLog(`测试案例${index + 1}: "${testCase}" => `, result);
        });
    }

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    }

    // 创建标注圆点
    function createDot(color, count, episodeNumber, fileName, fileElement) {
        const dot = document.createElement('span');
        dot.style.cssText = `
            display: inline-block;
            width: ${CONFIG.DOT_SIZE};
            height: ${CONFIG.DOT_SIZE};
            border-radius: ${CONFIG.DOT_BORDER_RADIUS};
            background-color: ${color};
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            z-index: 1000;
            cursor: pointer;
            opacity: ${CONFIG.DOT_OPACITY};
            transition: all 0.2s ease;
        `;

        // 添加悬停效果
        dot.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });

        dot.addEventListener('mouseleave', function() {
            this.style.opacity = CONFIG.DOT_OPACITY;
            this.style.transform = 'translateY(-50%) scale(1)';
        });

        // 添加文件数量提示
        if (count !== undefined && episodeNumber !== undefined) {
            const status = count >= episodeNumber ? '完整' : '不完整';
            let tooltip = `文件${status}: ${count}/${episodeNumber}集`;
            if (color === CONFIG.COMPLETE_COLOR && CONFIG.ENABLE_RENAME) {
                tooltip += '\n\n点击进行一键重命名';
            }
            dot.title = tooltip;
        } else if (count !== undefined) {
            dot.title = `文件数量: ${count}`;
        }

        // 如果是绿色圆点（完整）且启用了重命名功能，添加点击事件进行重命名
        if (color === CONFIG.COMPLETE_COLOR && CONFIG.ENABLE_RENAME) {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                renameFolder(fileName, fileElement);
            });

            // 添加特殊样式表示可点击
            dot.style.cursor = 'pointer';
            dot.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.4)';
        }

        return dot;
    }

    // 提取"全xx集"中的数字
    function extractEpisodeNumber(text) {
        const match = text.match(/全(\d+)集/);
        return match ? parseInt(match[1]) : null;
    }

    // 从文件名中提取清晰度信息
    function extractQuality(fileName) {
        debugLog('开始提取清晰度信息:', fileName);

        // 清晰度匹配模式，按优先级排序
        const qualityPatterns = [
            /\b(2160p|4K)\b/i,
            /\b(1080p)\b/i,
            /\b(720p)\b/i,
            /\b(480p)\b/i,
            /\b(UHD)\b/i,
            /\b(HDR)\b/i
        ];

        for (const pattern of qualityPatterns) {
            const match = fileName.match(pattern);
            if (match) {
                const quality = match[1].toLowerCase();
                debugLog('提取到清晰度:', quality);
                return quality === '4k' ? '2160p' : quality; // 统一4K为2160p
            }
        }

        debugLog('未找到清晰度信息');
        return null;
    }

    // 从复杂文件名中提取影视剧名称和年份
    function extractTitleAndYear(fileName) {
        debugLog('开始提取影视剧名称和年份:', fileName);

        let title = '';
        let year = null;

        // 新的提取规则：从第一个"】"和"["符号之间提取影视名称
        // 示例："【高清剧集网发布 www.PTHDTV.com】成家[全36集][国语配音+中文字幕]..."
        // 提取："成家"
        const titleMatch = fileName.match(/】([^\[]+)\[/);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
            debugLog('从】和[之间提取到标题:', title);
        } else {
            // 备用方案：如果没有找到】和[的组合，尝试其他方式
            debugLog('未找到】和[的组合，尝试备用提取方案');

            // 方案1：移除【】内容后，取第一个[前的内容
            let cleanName = fileName.replace(/【[^】]*】/g, '').trim();
            const beforeBracket = cleanName.match(/^([^\[]+)/);
            if (beforeBracket && beforeBracket[1]) {
                title = beforeBracket[1].trim();
                debugLog('备用方案1提取到标题:', title);
            } else {
                // 方案2：传统清理方式
                title = fileName
                    .replace(/【[^】]*】/g, '') // 移除【】内容
                    .replace(/\[[^\]]*\]/g, '') // 移除[]内容
                    .replace(/\([^)]*\)/g, '') // 移除()内容
                    .replace(/\{[^}]*\}/g, '') // 移除{}内容
                    .replace(/www\.[^\s]+/gi, '') // 移除网址
                    .replace(/[\u4e00-\u9fff]+网/g, '') // 移除中文网站名
                    .replace(/发布|字幕组|压制|制作/g, '')
                    .replace(/\b(1080p|720p|480p|2160p|4K|UHD|HDR|WEB-DL|BluRay|BDRip|DVDRip|HDTV|WEBRip)\b/gi, '')
                    .replace(/\b(x264|x265|H264|H265|HEVC|AVC|AAC|AC3|DTS|DD5\.1|DDP2\.0|DDP5\.1)\b/gi, '')
                    .replace(/\b(mkv|mp4|avi|rmvb|flv|wmv|mov)\b/gi, '')
                    .replace(/\b(S\d{2}|Season\s*\d+|第[一二三四五六七八九十\d]+季)\b/gi, '')
                    .replace(/\b(E\d{2}|Episode\s*\d+|第[一二三四五六七八九十\d]+集)\b/gi, '')
                    .replace(/\b(全\d+集|共\d+集|\d+集全)\b/gi, '')
                    .replace(/[\-_\.]+/g, ' ') // 替换连字符、下划线、点为空格
                    .replace(/\s+/g, ' ') // 合并多个空格
                    .trim();
                debugLog('备用方案2提取到标题:', title);
            }
        }

        // 进一步清理标题中的技术参数
        title = title
            .replace(/\b(1080p|720p|480p|2160p|4K|UHD|HDR|WEB-DL|BluRay|BDRip|DVDRip|HDTV|WEBRip)\b/gi, '')
            .replace(/\b(x264|x265|H264|H265|HEVC|AVC|AAC|AC3|DTS|DD5\.1|DDP2\.0|DDP5\.1)\b/gi, '')
            .replace(/\b(S\d{2}|Season\s*\d+)\b/gi, '')
            .replace(/[\-_\.]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // 提取年份 (四位数字，通常在2000-2030之间)
        const yearMatch = fileName.match(/(20[0-3]\d)/g);
        if (yearMatch && yearMatch.length > 0) {
            // 如果有多个年份，选择最后一个（通常是发布年份）
            year = yearMatch[yearMatch.length - 1];
        }

        // 从标题中移除年份（如果存在）
        if (year) {
            title = title.replace(new RegExp(year, 'g'), '').trim();
        }

        // 最终清理标题
        title = title
            .replace(/[\s\-_\.]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        debugLog('最终提取的标题:', title, '年份:', year);

        return {
            title: title || '未知影视剧',
            year: year
        };
    }

    // 检查当前页面是否存在重复的文件名
    function checkDuplicateName(proposedName, currentElement) {
        debugLog('检查重复文件名:', proposedName);

        // 获取当前页面所有文件/文件夹元素
        const allFileElements = document.querySelectorAll('tr[nid], tr[data-id], .file-item, .list-item');

        for (const element of allFileElements) {
            // 跳过当前正在重命名的元素
            if (element === currentElement) continue;

            // 获取元素的文件名
            let existingName = '';
            if (element.title) {
                existingName = element.title.trim();
            } else {
                const nameCell = element.querySelector('td:nth-child(2), .file-name, .name');
                if (nameCell) {
                    existingName = nameCell.textContent.trim();
                }
            }

            // 比较文件名（忽略大小写）
            if (existingName.toLowerCase() === proposedName.toLowerCase()) {
                debugLog('发现重复文件名:', existingName);
                return true;
            }
        }

        debugLog('未发现重复文件名');
        return false;
    }

    // 重命名文件夹
    function renameFolder(fileName, fileElement) {
        debugLog('开始重命名文件夹:', fileName);
        debugLog('文件元素:', fileElement);

        // 提取影视剧名称和年份
        const extracted = extractTitleAndYear(fileName);

        if (!extracted.title) {
            console.log('无法提取有效的影视剧名称');
            alert('无法从文件名中提取有效的影视剧名称\n\n请确保文件名包含有效的影视剧信息');
            return;
        }

        // 验证提取的标题是否有效
        if (!extracted.title || extracted.title === '未知影视剧' || extracted.title.length < 2) {
            alert(`无法从文件名中提取有效的影视剧名称\n\n原文件名: "${fileName}"\n提取结果: "${extracted.title}"\n\n请检查文件名格式是否正确，或手动重命名。`);
            return;
        }

        // 构建基础新文件名："影视名称 (年份)"
        let baseName;
        if (extracted.year) {
            baseName = `${extracted.title} (${extracted.year})`;
        } else {
            // 如果没有年份，只使用影视名称
            baseName = extracted.title;
        }

        let newName = baseName;

        // 检查是否存在重复名称
        const isDuplicate = checkDuplicateName(newName, fileElement.closest('tr') || fileElement);

        if (isDuplicate) {
            // 如果存在重复，尝试添加清晰度信息
            const quality = extractQuality(fileName);
            if (quality) {
                newName = `${baseName} ${quality}`;
                debugLog('检测到重复名称，添加清晰度后缀:', newName);

                // 再次检查添加清晰度后是否还有重复
                const stillDuplicate = checkDuplicateName(newName, fileElement.closest('tr') || fileElement);
                if (stillDuplicate) {
                    // 如果还是重复，添加时间戳
                    const timestamp = new Date().getTime().toString().slice(-4);
                    newName = `${baseName} ${quality} (${timestamp})`;
                    debugLog('添加清晰度后仍重复，添加时间戳:', newName);
                }
            } else {
                // 如果没有清晰度信息，直接添加时间戳
                const timestamp = new Date().getTime().toString().slice(-4);
                newName = `${baseName} (${timestamp})`;
                debugLog('未找到清晰度信息，添加时间戳:', newName);
            }
        }

        debugLog('最终的新文件名:', newName);

        // 弹出确认对话框（如果启用）
        let userConfirmed = true;
        if (CONFIG.SHOW_RENAME_CONFIRMATION) {
            let confirmMessage = `是否将文件夹重命名为:\n\n"${newName}"\n\n原文件名:\n"${fileName}"\n\n提取信息:\n• 影视名称: ${extracted.title}\n• 年份: ${extracted.year || '未检测到'}`;

            const quality = extractQuality(fileName);
            if (quality) {
                confirmMessage += `\n• 清晰度: ${quality}`;
            }

            if (isDuplicate) {
                confirmMessage += `\n\n⚠️ 检测到重复名称，已自动添加区分信息`;
            }

            confirmMessage += `\n\n点击"确定"进行重命名，点击"取消"放弃操作。`;
            userConfirmed = confirm(confirmMessage);
        }

        if (userConfirmed) {
            // 获取文件夹ID
            const folderId = getFolderId(fileElement);
            if (folderId) {
                performRename(folderId, newName, fileName);
            } else {
                console.error('无法获取文件夹ID，元素信息:', {
                    element: fileElement,
                    tagName: fileElement.tagName,
                    className: fileElement.className,
                    id: fileElement.id,
                    attributes: Array.from(fileElement.attributes).map(attr => `${attr.name}="${attr.value}"`),
                    parentElement: fileElement.parentElement,
                    closestTr: fileElement.closest('tr')
                });

                // 提供更详细的错误信息和可能的解决方案
                const errorMessage = `无法获取文件夹ID，重命名失败\n\n可能的原因：\n1. 当前页面结构与脚本不兼容\n2. 115网盘更新了页面结构\n3. 文件夹不是标准的115网盘文件夹\n\n建议：\n- 刷新页面后重试\n- 确保在115网盘的文件列表页面使用\n- 联系脚本开发者更新兼容性`;
                alert(errorMessage);

                // 尝试手动重命名提示
                if (CONFIG.COPY_TO_CLIPBOARD_ON_ERROR) {
                    const manualRename = confirm(`是否要复制建议的文件名到剪贴板？\n您可以手动重命名文件夹\n\n建议文件名："${newName}"`);
                    if (manualRename) {
                        try {
                            navigator.clipboard.writeText(newName).then(() => {
                                alert('文件名已复制到剪贴板！\n您可以手动重命名文件夹');
                            }).catch(() => {
                                // 降级方案：显示文件名让用户手动复制
                                prompt('请复制以下文件名进行手动重命名：', newName);
                            });
                        } catch (error) {
                            // 降级方案：显示文件名让用户手动复制
                            prompt('请复制以下文件名进行手动重命名：', newName);
                        }
                    }
                }
            }
        }
    }

    // 获取文件夹ID
    function getFolderId(fileElement) {
        console.log('开始获取文件夹ID，元素:', fileElement);

        // 尝试从不同的属性中获取文件夹ID
        const row = fileElement.closest('tr');
        console.log('找到的行元素:', row);

        let folderId = null;

        if (row) {
            // 115网盘的文件夹ID通常存储在这些属性中
            const possibleAttributes = ['cate_id', 'data-id', 'nid', 'file_id', 'fid', 'id', 'data-fid', 'data-file-id'];

            for (const attr of possibleAttributes) {
                const value = row.getAttribute(attr);
                if (value) {
                    debugLog(`从行元素的${attr}属性获取到ID:`, value);
                    folderId = value;
                    break;
                }
            }

            // 如果还没找到，尝试从行内的链接或按钮中获取
            if (!folderId) {
                const links = row.querySelectorAll('a[href*="cid="], a[href*="fid="]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const cidMatch = href.match(/cid=([^&]+)/);
                    const fidMatch = href.match(/fid=([^&]+)/);
                    if (cidMatch) {
                        folderId = cidMatch[1];
                        debugLog('从链接href中获取到cid:', folderId);
                        break;
                    } else if (fidMatch) {
                        folderId = fidMatch[1];
                        debugLog('从链接href中获取到fid:', folderId);
                        break;
                    }
                }
            }

            // 尝试从onclick事件中获取ID
            if (!folderId) {
                const clickableElements = row.querySelectorAll('[onclick]');
                for (const element of clickableElements) {
                    const onclick = element.getAttribute('onclick');
                    const idMatch = onclick.match(/['"]([a-zA-Z0-9]+)['"]/);
                    if (idMatch && idMatch[1].length > 5) { // 假设ID长度大于5
                        folderId = idMatch[1];
                        debugLog('从onclick事件中获取到ID:', folderId);
                        break;
                    }
                }
            }
        }

        // 尝试从元素本身获取
        if (!folderId) {
            const possibleAttributes = ['cate_id', 'data-id', 'nid', 'file_id', 'fid', 'id', 'data-fid', 'data-file-id'];

            for (const attr of possibleAttributes) {
                const value = fileElement.getAttribute(attr);
                if (value) {
                    debugLog(`从文件元素的${attr}属性获取到ID:`, value);
                    folderId = value;
                    break;
                }
            }
        }

        // 如果还是没找到，尝试从父元素中查找
        if (!folderId) {
            let parent = fileElement.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
                const possibleAttributes = ['cate_id', 'data-id', 'nid', 'file_id', 'fid', 'id', 'data-fid', 'data-file-id'];

                for (const attr of possibleAttributes) {
                    const value = parent.getAttribute(attr);
                    if (value && value.length > 3) { // 基本的ID长度检查
                        debugLog(`从父元素的${attr}属性获取到ID:`, value);
                        folderId = value;
                        break;
                    }
                }

                if (folderId) break;
                parent = parent.parentElement;
                depth++;
            }
        }

        debugLog('最终获取到的文件夹ID:', folderId);
        return folderId;
    }

    // 批量重命名相关变量
    let batchRenameInProgress = false;
    let batchRenameResults = [];

    // 创建批量重命名按钮
    function createBatchRenameButton() {
        if (!CONFIG.ENABLE_BATCH_RENAME) {
            return;
        }

        // 检查是否有绿标文件
        const completeFiles = collectCompleteFiles();
        const existingButton = document.getElementById('batch-rename-btn');

        if (completeFiles.length === 0) {
            // 如果没有绿标文件，移除按钮（如果存在）
            if (existingButton) {
                existingButton.remove();
                debugLog('没有绿标文件，已移除批量重命名按钮');
            }
            return;
        }

        // 如果按钮已存在且有绿标文件，不重复创建
        if (existingButton) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'batch-rename-btn';
        button.innerHTML = `🔄 批量重命名绿标文件 (${completeFiles.length})`;
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
            min-width: 160px;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
        });

        button.addEventListener('click', startBatchRename);

        document.body.appendChild(button);
        debugLog(`批量重命名按钮已创建，检测到 ${completeFiles.length} 个绿标文件`);
    }

    // 收集所有绿标（完整）文件
    function collectCompleteFiles() {
        const completeFiles = [];
        const greenDots = document.querySelectorAll('.file-status-dot');

        for (const dot of greenDots) {
            // 检查是否是绿色圆点（完整文件）
            const bgColor = window.getComputedStyle(dot).backgroundColor;
            const isGreen = bgColor.includes('76, 175, 80') || bgColor.includes('rgb(76, 175, 80)') ||
                           dot.style.backgroundColor === CONFIG.COMPLETE_COLOR;

            if (isGreen) {
                const fileElement = dot.closest('tr, li, .file-item, .list-item');
                if (fileElement) {
                    let fileName = '';
                    if (fileElement.title) {
                        fileName = fileElement.title;
                    } else if (fileElement.textContent) {
                        fileName = fileElement.textContent.trim();
                    } else if (fileElement.innerText) {
                        fileName = fileElement.innerText.trim();
                    }

                    if (fileName && fileName.includes('集')) {
                        completeFiles.push({
                            element: fileElement,
                            fileName: fileName,
                            dot: dot
                        });
                    }
                }
            }
        }

        debugLog(`收集到 ${completeFiles.length} 个完整文件`);
        return completeFiles;
    }

    // 开始批量重命名
    async function startBatchRename() {
        if (batchRenameInProgress) {
            alert('批量重命名正在进行中，请稍候...');
            return;
        }

        const completeFiles = collectCompleteFiles();

        if (completeFiles.length === 0) {
            alert('未找到可重命名的完整文件（绿标文件）\n\n请确保：\n1. 页面已完全加载\n2. 存在标记为完整的文件夹\n3. 文件夹名称包含"集"字符');
            return;
        }

        // 预处理：检查哪些文件可以成功提取标题，并处理重复名称
        const validFiles = [];
        const invalidFiles = [];
        const usedNames = new Set(); // 用于跟踪已使用的文件名

        for (const file of completeFiles) {
            const extracted = extractTitleAndYear(file.fileName);
            if (extracted.title && extracted.title !== '未知影视剧' && extracted.title.length >= 2) {
                // 构建基础新文件名
                let baseName = extracted.year ? `${extracted.title} (${extracted.year})` : extracted.title;
                let finalName = baseName;

                // 检查是否与已处理的文件名重复
                if (usedNames.has(finalName.toLowerCase())) {
                    // 如果重复，尝试添加清晰度信息
                    const quality = extractQuality(file.fileName);
                    if (quality) {
                        finalName = `${baseName} ${quality}`;
                        debugLog('批量重命名检测到重复名称，添加清晰度后缀:', finalName);

                        // 再次检查添加清晰度后是否还有重复
                        if (usedNames.has(finalName.toLowerCase())) {
                            // 如果还是重复，添加时间戳
                            const timestamp = new Date().getTime().toString().slice(-4);
                            finalName = `${baseName} ${quality} (${timestamp})`;
                            debugLog('批量重命名添加清晰度后仍重复，添加时间戳:', finalName);
                        }
                    } else {
                        // 如果没有清晰度信息，直接添加时间戳
                        const timestamp = new Date().getTime().toString().slice(-4);
                        finalName = `${baseName} (${timestamp})`;
                        debugLog('批量重命名未找到清晰度信息，添加时间戳:', finalName);
                    }
                }

                // 再次检查是否与页面现有文件名重复
                const currentElement = file.element.closest('tr') || file.element;
                if (checkDuplicateName(finalName, currentElement)) {
                    const quality = extractQuality(file.fileName);
                    if (quality && !finalName.includes(quality)) {
                        finalName = `${baseName} ${quality}`;
                        if (checkDuplicateName(finalName, currentElement)) {
                            const timestamp = new Date().getTime().toString().slice(-4);
                            finalName = `${baseName} ${quality} (${timestamp})`;
                        }
                    } else {
                        const timestamp = new Date().getTime().toString().slice(-4);
                        finalName = `${baseName} (${timestamp})`;
                    }
                }

                // 记录已使用的文件名
                usedNames.add(finalName.toLowerCase());

                validFiles.push({
                    ...file,
                    extracted: extracted,
                    newName: finalName,
                    quality: extractQuality(file.fileName)
                });
            } else {
                invalidFiles.push(file);
            }
        }

        let confirmMessage = `准备批量重命名 ${completeFiles.length} 个完整文件\n\n`;
        confirmMessage += `✅ 可重命名: ${validFiles.length} 个\n`;
        if (invalidFiles.length > 0) {
            confirmMessage += `❌ 无法提取标题: ${invalidFiles.length} 个\n\n`;
            confirmMessage += '无法提取标题的文件：\n';
            invalidFiles.slice(0, 3).forEach(file => {
                confirmMessage += `• ${file.fileName.substring(0, 50)}...\n`;
            });
            if (invalidFiles.length > 3) {
                confirmMessage += `• 还有 ${invalidFiles.length - 3} 个文件...\n`;
            }
            confirmMessage += '\n';
        }

        if (validFiles.length > 0) {
            confirmMessage += '预览重命名结果（前3个）：\n';
            validFiles.slice(0, 3).forEach(file => {
                let preview = `• "${file.fileName.substring(0, 30)}..." → "${file.newName}"`;
                if (file.quality) {
                    preview += ` [${file.quality}]`;
                }
                confirmMessage += preview + '\n';
            });
            if (validFiles.length > 3) {
                confirmMessage += `• 还有 ${validFiles.length - 3} 个文件...\n`;
            }

            // 统计清晰度信息
            const qualityCount = validFiles.filter(f => f.quality).length;
            if (qualityCount > 0) {
                confirmMessage += `\n📺 检测到清晰度信息: ${qualityCount} 个文件\n`;
            }
        }

        confirmMessage += '\n是否继续批量重命名？';

        if (CONFIG.BATCH_CONFIRM_BEFORE_START && !confirm(confirmMessage)) {
            return;
        }

        if (validFiles.length === 0) {
            alert('没有可以重命名的文件，操作取消。');
            return;
        }

        // 开始批量重命名
        await performBatchRename(validFiles);
    }

    // 执行批量重命名
    async function performBatchRename(files) {
        batchRenameInProgress = true;
        batchRenameResults = [];

        const button = document.getElementById('batch-rename-btn');
        const originalText = button.innerHTML;

        let successCount = 0;
        let failCount = 0;
        const usedNames = new Set(); // 跟踪已使用的文件名

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // 更新按钮状态
                if (CONFIG.BATCH_SHOW_PROGRESS) {
                    button.innerHTML = `🔄 重命名中... (${i + 1}/${files.length})`;
                    button.style.background = 'linear-gradient(135deg, #FF9800, #F57C00)';
                }

                try {
                    debugLog(`批量重命名 ${i + 1}/${files.length}: ${file.fileName} → ${file.newName}`);

                    const folderId = getFolderId(file.element);
                    if (folderId) {
                        const result = await performRenameAsync(folderId, file.newName, file.fileName, usedNames);
                        if (result.success) {
                            successCount++;
                            batchRenameResults.push({
                                fileName: file.fileName,
                                newName: result.finalName,
                                status: 'success'
                            });
                        } else {
                            failCount++;
                            batchRenameResults.push({
                                fileName: file.fileName,
                                newName: file.newName,
                                status: 'failed',
                                error: result.error || '重命名API调用失败'
                            });

                            if (CONFIG.BATCH_STOP_ON_ERROR) {
                                break;
                            }
                        }
                    } else {
                        failCount++;
                        batchRenameResults.push({
                            fileName: file.fileName,
                            newName: file.newName,
                            status: 'failed',
                            error: '无法获取文件夹ID'
                        });

                        if (CONFIG.BATCH_STOP_ON_ERROR) {
                            break;
                        }
                    }
                } catch (error) {
                    failCount++;
                    batchRenameResults.push({
                        fileName: file.fileName,
                        newName: file.newName,
                        status: 'failed',
                        error: error.message
                    });

                    debugLog(`批量重命名失败: ${file.fileName}`, error);

                    if (CONFIG.BATCH_STOP_ON_ERROR) {
                        break;
                    }
                }

                // 延迟以避免请求过于频繁
                if (i < files.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.BATCH_RENAME_DELAY));
                }
            }
        } finally {
            batchRenameInProgress = false;

            // 恢复按钮状态
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

            // 显示结果
            showBatchRenameResults(successCount, failCount);

            // 如果有成功的重命名且启用了自动刷新
            if (successCount > 0 && CONFIG.AUTO_REFRESH_AFTER_RENAME) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }
    }

    // 异步版本的重命名函数
    function performRenameAsync(folderId, newName, originalName, usedNames = new Set()) {
        return new Promise((resolve) => {
            debugLog('执行异步重命名操作:', { folderId, newName, originalName });

            // 验证文件夹ID
            if (!folderId || folderId.length < 3) {
                debugLog('无效的文件夹ID:', folderId);
                resolve({ success: false, error: '无效的文件夹ID' });
                return;
            }

            // 清理文件名
            const cleanName = newName
                .replace(/\\/g, "")
                .replace(/\//g, " ")
                .replace(/:/g, " ")
                .replace(/\?/g, " ")
                .replace(/"/g, " ")
                .replace(/</g, " ")
                .replace(/>/g, " ")
                .replace(/\|/g, "")
                .replace(/\*/g, " ")
                .trim();

            // 准备API请求参数
            const requestBody = new URLSearchParams({
                fid: folderId,
                file_name: cleanName
            });

            // 调用115的重命名API
            fetch('https://webapi.115.com/files/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: requestBody,
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.state === true || data.state === 1) {
                    debugLog('异步重命名成功:', cleanName);
                    usedNames.add(cleanName.toLowerCase());
                    resolve({ success: true, finalName: cleanName });
                } else {
                    debugLog('异步重命名失败，API返回:', data);
                    const errorMsg = data.error || data.msg || data.message || '未知错误';

                    // 检查是否是重复名称错误，如果是则尝试添加清晰度参数
                    if (errorMsg.includes('已存在') || errorMsg.includes('重复') || errorMsg.includes('duplicate')) {
                        debugLog('检测到重复名称错误，尝试添加清晰度参数重新重命名');

                        // 提取清晰度信息
                        const quality = extractQuality(originalName);
                        if (quality && !cleanName.includes(quality)) {
                            const newNameWithQuality = `${cleanName} ${quality}`;
                            if (!usedNames.has(newNameWithQuality.toLowerCase())) {
                                debugLog('尝试使用带清晰度的文件名重新重命名:', newNameWithQuality);
                                // 递归调用，使用带清晰度的文件名
                                performRenameAsync(folderId, newNameWithQuality, originalName, usedNames)
                                    .then(result => resolve(result));
                                return;
                            }
                        }

                        // 如果没有清晰度信息或已包含清晰度，尝试添加时间戳
                        const timestamp = new Date().getTime().toString().slice(-4);
                        const newNameWithTimestamp = `${cleanName} (${timestamp})`;
                        if (!usedNames.has(newNameWithTimestamp.toLowerCase())) {
                            debugLog('尝试添加时间戳:', newNameWithTimestamp);
                            // 递归调用，使用带时间戳的文件名
                            performRenameAsync(folderId, newNameWithTimestamp, originalName, usedNames)
                                .then(result => resolve(result));
                            return;
                        }
                    }

                    resolve({ success: false, error: errorMsg });
                }
            })
            .catch(error => {
                debugLog('异步重命名请求失败:', error);
                resolve({ success: false, error: error.message });
            });
        });
    }

    // 显示批量重命名结果
    function showBatchRenameResults(successCount, failCount) {
        let message = `批量重命名完成！\n\n`;
        message += `✅ 成功: ${successCount} 个\n`;
        message += `❌ 失败: ${failCount} 个\n\n`;

        if (failCount > 0) {
            message += '失败的文件：\n';
            const failedResults = batchRenameResults.filter(r => r.status === 'failed');
            failedResults.slice(0, 5).forEach(result => {
                message += `• ${result.fileName.substring(0, 30)}... (${result.error})\n`;
            });
            if (failedResults.length > 5) {
                message += `• 还有 ${failedResults.length - 5} 个失败的文件...\n`;
            }
            message += '\n';
        }

        if (successCount > 0) {
            message += '成功重命名的文件：\n';
            const successResults = batchRenameResults.filter(r => r.status === 'success');

            // 统计清晰度信息
            const qualityResults = successResults.filter(r => {
                const quality = extractQuality(r.fileName);
                return quality && r.newName.includes(quality);
            });

            if (qualityResults.length > 0) {
                message += `📺 包含清晰度信息: ${qualityResults.length} 个\n\n`;
            }

            successResults.slice(0, 3).forEach(result => {
                const quality = extractQuality(result.fileName);
                let displayText = `• "${result.fileName.substring(0, 20)}..." → "${result.newName}"`;
                if (quality && result.newName.includes(quality)) {
                    displayText += ` [${quality}]`;
                }
                message += displayText + '\n';
            });
            if (successResults.length > 3) {
                message += `• 还有 ${successResults.length - 3} 个成功的文件...\n`;
            }
        }

        if (successCount > 0 && CONFIG.AUTO_REFRESH_AFTER_RENAME) {
            message += '\n页面将在2秒后自动刷新以显示更改。';
        }

        alert(message);
    }

    // 执行重命名操作
    function performRename(folderId, newName, originalName) {
        debugLog('执行重命名操作:', { folderId, newName, originalName });

        // 验证文件夹ID
        if (!folderId || folderId.length < 3) {
            console.error('无效的文件夹ID:', folderId);
            alert('文件夹ID无效，无法执行重命名操作');
            return;
        }

        // 清理文件名，移除115不支持的字符
        const cleanName = newName
            .replace(/\\/g, "")
            .replace(/\//g, " ")
            .replace(/:/g, " ")
            .replace(/\?/g, " ")
            .replace(/"/g, " ")
            .replace(/</g, " ")
            .replace(/>/g, " ")
            .replace(/\|/g, "")
            .replace(/\*/g, " ")
            .trim();

        debugLog('清理后的文件名:', cleanName);

        // 显示进度提示
        const progressMessage = `正在重命名文件夹...\n\n原文件名: "${originalName}"\n新文件名: "${cleanName}"`;
        console.log(progressMessage);

        // 准备API请求参数
        const requestBody = new URLSearchParams({
            fid: folderId,
            file_name: cleanName
        });

        debugLog('API请求参数:', {
            url: 'https://webapi.115.com/files/edit',
            method: 'POST',
            fid: folderId,
            file_name: cleanName
        });

        // 调用115的重命名API
        fetch('https://webapi.115.com/files/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: requestBody,
            credentials: 'include' // 包含cookies
        })
        .then(response => {
            debugLog('API响应状态:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            debugLog('API响应数据:', data);

            if (data.state === true || data.state === 1) {
                debugLog('重命名成功:', cleanName);
                alert(`重命名成功！\n\n原文件名: "${originalName}"\n新文件名: "${cleanName}"${CONFIG.AUTO_REFRESH_AFTER_RENAME ? '\n\n页面将在1秒后刷新以显示更改' : ''}`);
                // 刷新页面以显示更改（如果启用）
                if (CONFIG.AUTO_REFRESH_AFTER_RENAME) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } else {
                debugLog('重命名失败，API返回:', data);
                const errorMsg = data.error || data.msg || data.message || '未知错误';

                // 检查是否是重复名称错误，如果是则尝试添加清晰度参数
                if (errorMsg.includes('已存在') || errorMsg.includes('重复') || errorMsg.includes('duplicate')) {
                    debugLog('检测到重复名称错误，尝试添加清晰度参数重新重命名');

                    // 提取清晰度信息
                    const quality = extractQuality(originalName);
                    if (quality && !cleanName.includes(quality)) {
                        const newNameWithQuality = `${cleanName} ${quality}`;
                        debugLog('尝试使用带清晰度的文件名重新重命名:', newNameWithQuality);

                        // 确认是否要使用带清晰度的文件名重新尝试
                        const retryConfirm = confirm(`重命名失败：${errorMsg}\n\n检测到文件清晰度信息：${quality}\n\n是否尝试使用以下文件名重新重命名？\n"${newNameWithQuality}"\n\n点击"确定"重新尝试，点击"取消"放弃操作。`);

                        if (retryConfirm) {
                            // 递归调用重命名，使用带清晰度的文件名
                            performRename(folderId, newNameWithQuality, originalName);
                            return; // 避免显示原始错误消息
                        }
                    } else {
                        // 如果没有清晰度信息或已包含清晰度，尝试添加时间戳
                        const timestamp = new Date().getTime().toString().slice(-4);
                        const newNameWithTimestamp = `${cleanName} (${timestamp})`;
                        debugLog('没有清晰度信息或已包含，尝试添加时间戳:', newNameWithTimestamp);

                        const retryConfirm = confirm(`重命名失败：${errorMsg}\n\n是否尝试使用以下文件名重新重命名？\n"${newNameWithTimestamp}"\n\n点击"确定"重新尝试，点击"取消"放弃操作。`);

                        if (retryConfirm) {
                            // 递归调用重命名，使用带时间戳的文件名
                            performRename(folderId, newNameWithTimestamp, originalName);
                            return; // 避免显示原始错误消息
                        }
                    }
                }

                // 显示原始错误消息
                alert(`重命名失败\n\n错误信息: ${errorMsg}\n\n可能的原因：\n1. 没有重命名权限\n2. 文件名包含不支持的字符\n3. 文件夹正在被使用\n4. 网络连接问题\n5. 目录名称已存在`);
            }
        })
        .catch(error => {
            debugLog('重命名请求失败:', error);

            let errorMessage = `重命名请求失败\n\n错误详情: ${error.message}`;

            if (error.message.includes('HTTP错误')) {
                errorMessage += `\n\n可能的原因：\n1. 未登录115网盘\n2. 会话已过期\n3. 网络连接问题\n4. 115服务器暂时不可用`;
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += `\n\n可能的原因：\n1. 网络连接中断\n2. 115网盘服务器无响应\n3. 浏览器阻止了请求`;
            }

            alert(errorMessage);
        });
    }

    // 查找文件夹图标元素
    function findFolderIcon(fileElement) {
        // 115网盘特定的文件夹图标选择器
        const iconSelectors = [
            // 115网盘文件夹图标的常见选择器
            '.list-thumb',
            '.file-icon',
            '.folder-icon',
            'img[src*="folder"]',
            'img[src*="dir"]',
            '.icon',
            'i[class*="folder"]',
            'span[class*="icon"]',
            // 通用图标选择器
            '.fa-folder',
            '.glyphicon-folder'
        ];

        // 首先在当前行元素中查找图标
        const rowElement = fileElement.closest('tr') || fileElement;

        for (const selector of iconSelectors) {
            const icon = rowElement.querySelector(selector);
            if (icon) {
                return icon;
            }
        }

        // 如果没找到，尝试查找第一个td元素（通常包含图标）
        const firstCell = rowElement.querySelector('td:first-child');
        if (firstCell) {
            // 在第一个单元格中查找任何图片或图标元素
            const imgIcon = firstCell.querySelector('img, i, span[class*="icon"], .icon');
            if (imgIcon) {
                return imgIcon;
            }
            // 如果还是没找到，返回第一个单元格本身作为图标容器
            return firstCell;
        }

        return null;
    }

    // 获取文件夹内文件数量
    // 文件数量获取函数 - 使用115官方API
    async function getFileCount(fileElement, retries = 3, delay = 1000) {
        const cid = extractFolderId(fileElement);
        if (!cid) {
            debugLog('无法提取文件夹ID，返回null');
            return null;
        }

        debugLog('使用115官方API获取文件数量，文件夹ID:', cid);
        const apiCount = await getFileCountFromAPI(cid, retries, delay);

        if (apiCount !== null) {
            debugLog('API成功获取文件数量:', apiCount);
            return apiCount;
        }

        debugLog('API获取文件数量失败');
        return null;
    }

    // 提取文件夹ID的函数 - 支持多种115网盘页面布局
    function extractFolderId(fileElement) {
        // 尝试多种方式获取文件夹ID
        let cid = null;

        // 方式1: 从元素属性中获取
        cid = fileElement.getAttribute('cate_id') ||
              fileElement.getAttribute('data-id') ||
              fileElement.getAttribute('data-cid') ||
              fileElement.getAttribute('fid');

        if (cid) {
            debugLog('从元素属性获取到文件夹ID:', cid);
            return cid;
        }

        // 方式2: 从父元素或行元素中获取
        const row = fileElement.closest('tr, li, .file-item, .list-item');
        if (row) {
            cid = row.getAttribute('cate_id') ||
                  row.getAttribute('data-id') ||
                  row.getAttribute('data-cid') ||
                  row.getAttribute('nid') ||
                  row.getAttribute('fid');

            if (cid) {
                debugLog('从行元素获取到文件夹ID:', cid);
                return cid;
            }
        }

        // 方式3: 从文件夹链接中提取
        const folderLink = fileElement.querySelector('a[href*="cid="]') ||
                          fileElement.closest('tr, li')?.querySelector('a[href*="cid="]');

        if (folderLink) {
            const href = folderLink.getAttribute('href');
            const cidMatch = href.match(/cid=([^&]+)/);
            if (cidMatch) {
                cid = cidMatch[1];
                debugLog('从链接URL提取到文件夹ID:', cid);
                return cid;
            }
        }

        // 方式4: 从onclick事件中提取
        const clickableElement = fileElement.querySelector('[onclick*="cid"]') ||
                                fileElement.closest('tr, li')?.querySelector('[onclick*="cid"]');

        if (clickableElement) {
            const onclick = clickableElement.getAttribute('onclick');
            const cidMatch = onclick.match(/cid['"]?\s*[:=]\s*['"]?([^'"\s,)]+)/);
            if (cidMatch) {
                cid = cidMatch[1];
                debugLog('从onclick事件提取到文件夹ID:', cid);
                return cid;
            }
        }

        debugLog('无法提取文件夹ID');
        return null;
    }

    // 使用115 API获取文件数量 - 参考115pan_aria2的实现
    async function getFileCountFromAPI(cid, retries = 3, delay = 1000) {
        if (!cid || cid.length < 3) {
            debugLog('无效的文件夹ID:', cid);
            return null;
        }

        // 使用与115pan_aria2相同的API端点和参数
        const limit = 1000; // 使用较大的limit以获取完整的文件数量
        const url = `https://webapi.115.com/files?aid=1&limit=${limit}&offset=0&show_dir=1&cid=${cid}`;

        for (let i = 0; i < retries; i++) {
            try {
                debugLog(`API调用尝试 ${i + 1}/${retries}:`, url);

                const data = await new Promise((resolve, reject) => {
                    const gmRequest = GM.xmlHttpRequest || GM_xmlhttpRequest;
                    if (!gmRequest) {
                        reject(new Error('GM.xmlHttpRequest 不可用'));
                        return;
                    }

                    gmRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'User-Agent': navigator.userAgent,
                            'Referer': 'https://115.com/',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve(data);
                                } catch (parseError) {
                                    reject(new Error(`JSON解析错误: ${parseError.message}`));
                                }
                            } else {
                                reject(new Error(`HTTP错误: ${response.status} ${response.statusText}`));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error(`网络错误: ${error.message || '未知错误'}`));
                        },
                        ontimeout: function() {
                            reject(new Error('请求超时'));
                        },
                        timeout: 10000
                    });
                });
                debugLog('API响应数据:', data);

                if (data.state === true || data.state === 1) {
                    // 计算实际文件数量（排除文件夹）
                    let fileCount = 0;
                    if (data.data && Array.isArray(data.data)) {
                        // 统计非文件夹项目（有sha值的是文件，没有sha值的是文件夹）
                        fileCount = data.data.filter(item => item.sha && item.sha.length > 0).length;
                        debugLog(`API返回总项目数: ${data.data.length}, 文件数: ${fileCount}`);
                    } else if (typeof data.count === 'number') {
                        // 如果没有详细数据，使用总数作为近似值
                        fileCount = data.count;
                        debugLog(`API返回总数: ${fileCount}`);
                    }

                    return fileCount;
                } else {
                    const errorMsg = data.error || data.msg || data.message || '未知API错误';
                    debugLog('API返回错误状态:', errorMsg);

                    // 如果是权限错误，不重试
                    if (errorMsg.includes('权限') || errorMsg.includes('登录') || errorMsg.includes('认证')) {
                        debugLog('检测到权限错误，停止重试');
                        return null;
                    }
                }
            } catch (error) {
                debugLog(`API调用失败 (尝试 ${i + 1}/${retries}):`, error.message);

                // 如果是网络错误或超时，可以重试
                if (i < retries - 1 && (error.message.includes('网络错误') || error.message.includes('请求超时') || error.message.includes('HTTP错误'))) {
                    debugLog(`等待 ${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            // 如果不是最后一次尝试，等待后重试
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        debugLog('所有API调用尝试均失败');
        return null;
    }




    // 处理iframe内容
    function processIframes() {
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                if (iframe.contentDocument && iframe.contentDocument.body) {
                    debugLog('找到可访问的iframe，开始处理其内容...');
                    processFileItemsInDocument(iframe.contentDocument);
                }
            } catch (error) {
                debugLog('无法访问iframe内容（可能是跨域限制）:', error.message);
            }
        }
    }

    // 在指定文档中处理文件列表项
    async function processFileItemsInDocument(doc = document) {
        debugLog('开始处理文件列表项...');

        // 查找文件列表容器的多种可能选择器
        const possibleSelectors = [
            // 115网盘特定选择器 - 针对文件夹行
            'tr[data-id]',
            '.list-contents tr',
            '.file-opr-wraper',
            '.list-item',
            // 通用选择器
            '.file-item',
            '.file-name',
            '[data-file-name]',
            'a[title]',
            '.filename'
        ];

        let fileItems = [];

        for (const selector of possibleSelectors) {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
                fileItems = Array.from(elements);
                debugLog(`找到 ${fileItems.length} 个文件项，使用选择器: ${selector}`);
                break;
            }
        }

        if (fileItems.length === 0) {
            debugLog('未找到文件列表项，尝试查找所有可能的文本元素...');
            // 如果没有找到特定的文件列表，尝试查找所有包含文本的元素
            const allElements = doc.querySelectorAll('*');
            fileItems = Array.from(allElements).filter(el => {
                const text = el.textContent || el.innerText || '';
                return text.includes('集') && el.children.length === 0; // 只选择叶子节点
            });
            debugLog(`通过文本搜索找到 ${fileItems.length} 个可能的文件项`);
        }

        for (const item of fileItems) {
            try {
                // 获取文件名
                let fileName = '';
                if (item.title) {
                    fileName = item.title;
                } else if (item.textContent) {
                    fileName = item.textContent.trim();
                } else if (item.innerText) {
                    fileName = item.innerText.trim();
                }

                if (!fileName) continue;

                debugLog(`处理文件: ${fileName}`);

                // 检查是否已经添加过标注
                if (item.querySelector('.file-status-dot')) {
                    continue;
                }

                // 检查是否包含"全xx集"模式
                const episodeNumber = extractEpisodeNumber(fileName);

                if (episodeNumber) {
                    // 获取文件夹内文件数量
                    let fileCount = await getFileCount(item);
                    if (fileCount === null) {
                        debugLog('API方法获取文件数量失败');
                        fileCount = -1; // 设置为未知
                    }
                    debugLog(`${fileName}: 提取的集数=${episodeNumber}, 获取的文件数量=${fileCount}`);

                    // 创建标注圆点
                    let dot;
                    if (fileCount === -1) {
                        // 无法获取文件数量的处理
                        if (CONFIG.HIDE_UNKNOWN_FILES) {
                            // 隐藏无法确定文件数量的文件，不显示任何标注
                            debugLog(`${fileName}: 无法确定文件数量，已隐藏标注`);
                            continue;
                        } else if (CONFIG.SHOW_UNKNOWN_AS_INCOMPLETE) {
                            // 显示为不完整（红色）
                            dot = createDot(CONFIG.INCOMPLETE_COLOR, '?', episodeNumber, fileName, item);
                            debugLog(`${fileName}: 未知文件数量，标记为不完整 (?/${episodeNumber})`);
                        } else {
                            // 不显示标注
                            debugLog(`${fileName}: 无法确定文件数量，跳过标注`);
                            continue;
                        }
                    } else if (fileCount >= episodeNumber) {
                        dot = createDot(CONFIG.COMPLETE_COLOR, fileCount, episodeNumber, fileName, item); // 完整
                        debugLog(`${fileName}: 完整 (${fileCount}/${episodeNumber})`);
                    } else {
                        dot = createDot(CONFIG.INCOMPLETE_COLOR, fileCount, episodeNumber, fileName, item); // 不完整
                        debugLog(`${fileName}: 不完整 (${fileCount}/${episodeNumber})`);
                    }

                    dot.className = 'file-status-dot';

                    // 找到文件夹图标并添加圆点
                     const iconElement = findFolderIcon(item);
                     if (iconElement) {
                         // 确保图标容器有相对定位
                         const computedStyle = window.getComputedStyle(iconElement);
                         if (computedStyle.position === 'static') {
                             iconElement.style.position = 'relative';
                         }

                         // 确保图标容器有足够的尺寸来显示圆点
                         if (iconElement.offsetWidth < 20 || iconElement.offsetHeight < 20) {
                             iconElement.style.minWidth = '20px';
                             iconElement.style.minHeight = '20px';
                         }

                         iconElement.appendChild(dot);
                         debugLog(`${fileName}: 圆点已添加到图标元素`, iconElement);
                     } else {
                         // 备用方案：添加到文件名前面
                         if (item.firstChild) {
                             item.insertBefore(dot, item.firstChild);
                         } else {
                             item.appendChild(dot);
                         }
                         debugLog(`${fileName}: 未找到图标元素，使用备用方案`);
                     }
                }
            } catch (error) {
                debugLog('处理文件项时出错:', error);
            }
        }
    }

    // 处理文件列表项（包装函数）
    async function processFileItems() {
        // 处理主文档
        await processFileItemsInDocument(document);

        // 处理iframe内容
        processIframes();
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的文件列表项添加
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && (node.classList.contains('file-item') ||
                                node.classList.contains('list-item') ||
                                node.querySelector && node.querySelector('.file-name'))) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldProcess) {
                debugLog('检测到页面变化，重新处理文件列表...');
                setTimeout(() => {
                    processFileItems().then(() => {
                        // 处理完文件后，更新批量重命名按钮状态
                        createBatchRenameButton();
                    });
                }, CONFIG.MUTATION_DELAY);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        debugLog('页面变化监听器已启动');
    }

    // 主函数
    async function main() {
        debugLog('115网盘文件完整性检查器已启动');

        try {
            // 等待页面加载
            await new Promise(resolve => {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', resolve);
                } else {
                    resolve();
                }
            });

            // 等待一段时间让页面完全加载
            await new Promise(resolve => setTimeout(resolve, CONFIG.PROCESS_DELAY));

            // 处理当前页面的文件列表
            await processFileItems();

            // 处理完文件后，创建批量重命名按钮（仅在有绿标文件时显示）
            createBatchRenameButton();

            // 开始监听页面变化
            observePageChanges();

            debugLog('文件完整性检查器初始化完成');

        } catch (error) {
            debugLog('初始化失败:', error);
        }
    }

    // 启动脚本
    main();

})();