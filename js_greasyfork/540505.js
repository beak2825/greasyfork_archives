// ==UserScript==
// @name 地牢：门票钥匙提醒+车速计算
// @namespace http://tampermonkey.net/
// @version 1.9 
// @description 通过定时刷新机制，高亮游戏聊天框中最新一条钥匙数量提示中低于100（可配置）的玩家，并集中显示在屏幕顶部。计算并显示所有符合条件的战斗时长。
// @author SUAN
// @match https://www.milkywayidle.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540505/%E5%9C%B0%E7%89%A2%EF%BC%9A%E9%97%A8%E7%A5%A8%E9%92%A5%E5%8C%99%E6%8F%90%E9%86%92%2B%E8%BD%A6%E9%80%9F%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540505/%E5%9C%B0%E7%89%A2%EF%BC%9A%E9%97%A8%E7%A5%A8%E9%92%A5%E5%8C%99%E6%8F%90%E9%86%92%2B%E8%BD%A6%E9%80%9F%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const HIGHLIGHT_THRESHOLD = 100; // 钥匙数量低于此值时将高亮
    const HIGHLIGHT_COLOR = 'yellow'; // 高亮的颜色
    const REFRESH_INTERVAL_MS = 120 * 1000; // 脚本刷新检测的间隔（毫秒），这里设置为 2 分钟
    const BATTLE_DURATION_TEXT_COLOR = '#ADD8E6'; // 战斗时长文字颜色 (浅蓝色)
    const MAX_BATTLE_DURATION_HOURS = 6; // 战斗时长超过此值（小时）则判定为跨天或异常，不显示时长

    // 集中显示部分的通用ID
    const DISPLAY_PANEL_ID = 'script_low_key_players_warning';

    // 移动端和PC端的特定参数配置
    const PC_CONFIG = {
        top: '1%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '16px',
        maxWidth: '80%',
        padding: '5px 15px'
    };

    const MOBILE_CONFIG = {
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        maxWidth: '95%',
        padding: '3px 10px'
    };

    // ----------------------------------------------------------------------
    // 动态选择当前设备的配置
    // ----------------------------------------------------------------------
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) || (window.innerWidth < 768);
    }

    const CURRENT_DEVICE_CONFIG = isMobileDevice() ? MOBILE_CONFIG : PC_CONFIG;

    // 根据选择的配置构建样式字符串
    const BASE_PANEL_STYLE = `
        position: fixed;
        top: ${CURRENT_DEVICE_CONFIG.top};
        left: ${CURRENT_DEVICE_CONFIG.left};
        transform: ${CURRENT_DEVICE_CONFIG.transform};
        color: #FF6347; /* 橙红色，警告色 */
        background-color: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
        padding: ${CURRENT_DEVICE_CONFIG.padding};
        border-radius: 8px;
        font-size: ${CURRENT_DEVICE_CONFIG.fontSize};
        font-weight: bold;
        z-index: 9999; /* 确保在最上层 */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        text-align: center;
        white-space: pre-wrap; /* 允许文本换行 */
        max-width: ${CURRENT_DEVICE_CONFIG.maxWidth};
        box-sizing: border-box; /* 确保 padding 和 border 不会增加实际宽度超出 max-width */
    `;
    // --- 结束配置项 ---

    const PANEL_HEADER_TEXT = '钥匙不足玩家: '; // 当有玩家时，显示此头部文本

    /**
     * 将时间字符串 "HH:MM:SS" 或 "HH:MM:SS AM/PM" 转换为当天的 Date 对象。
     * 关键修正：处理 12 小时制和跨天情况，并确保日期是递增的。
     * @param {string} timeStr 时间字符串，例如 "8/19 09:17:12" 或 "3:28:19 AM"。
     * @param {Date|null} referenceDate 用于比较的参考日期，通常是上一个时间点。
     * @returns {Date} 对应的 Date 对象。
     */
    function parseTimestamp(timeStr, referenceDate = null) {
        let hours, minutes, seconds;
        let ampm = '';

        // 移除日期部分，只保留时间
        const timeMatch = timeStr.match(/(\d{1,2}:\d{2}:\d{2}(?:\s*(?:AM|PM))?)/i);
        if (!timeMatch) {
            console.error("无法从字符串中提取时间部分:", timeStr);
            return new Date(); // 返回当前时间作为备用
        }
        const pureTimeStr = timeMatch[1].trim();

        // 尝试匹配 12 小时制 (HH:MM:SS AM/PM)
        const ampmMatch = pureTimeStr.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
        if (ampmMatch) {
            hours = parseInt(ampmMatch[1], 10);
            minutes = parseInt(ampmMatch[2], 10);
            seconds = parseInt(ampmMatch[3], 10);
            ampm = ampmMatch[4].toUpperCase();

            if (ampm === 'PM' && hours < 12) {
                hours += 12;
            } else if (ampm === 'AM' && hours === 12) {
                hours = 0;
            }
        } else {
            // 尝试匹配 24 小时制 (HH:MM:SS)
            const parts = pureTimeStr.split(':').map(Number);
            if (parts.length === 3) {
                hours = parts[0];
                minutes = parts[1];
                seconds = parts[2];
            } else {
                console.error("无法解析时间字符串:", pureTimeStr);
                return new Date();
            }
        }

        let date = new Date(); // 使用当前日期作为基础
        // 确保月份、日期、年份与 referenceDate 相同，以避免不必要的跨月/年问题
        if (referenceDate) {
            date.setFullYear(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
        }

        // 关键修正：从带有日期的完整字符串中解析出月和日
        const dateMatch = timeStr.match(/(\d+)\/(\d+)/);
        if (dateMatch) {
            const month = parseInt(dateMatch[1], 10) - 1; // 月份是0-11
            const day = parseInt(dateMatch[2], 10);
            // 如果当前年份和月份与参考日期相同，则使用其年份
            let year = referenceDate ? referenceDate.getFullYear() : date.getFullYear();

            // 检查是否跨年
            if (referenceDate && (month < referenceDate.getMonth() || (month === referenceDate.getMonth() && day < referenceDate.getDate()))) {
                 year++;
            }
            date.setFullYear(year, month, day);
        }

        date.setHours(hours, minutes, seconds, 0);

        // 关键逻辑：如果解析出的时间比参考时间早，则认为它是第二天
        // 这解决了 23:55 -> 00:00 的跨天问题
        if (referenceDate && date.getTime() < referenceDate.getTime()) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    /**
     * 将毫秒转换为 "HH:MM:SS" 格式。
     * @param {number} ms 毫秒数。
     * @returns {string} 格式化的时间字符串。
     */
    function formatDuration(ms) {
        // 确保毫秒数是非负的
        ms = Math.abs(ms);
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    /**
     * 处理单条聊天消息的高亮。
     * @param {Element} messageSpan 包含钥匙数量文本的 span 元素。
     * @returns {Array<Object>} 返回匹配到的低钥匙玩家信息数组，例如：[{ playerName: 'PlayerA', keyCount: 50 }]。
     */
    function processSingleKeyMessage(messageSpan) {
        const fullText = messageSpan.textContent;
        const regex = /\[(\w+)\s*-\s*(\d+)\]/g;
        let newHtmlParts = [];
        let lastIndex = 0;
        const lowKeyPlayersInMessage = [];

        let match;
        while ((match = regex.exec(fullText)) !== null) {
            const fullMatch = match[0];
            const playerName = match[1];
            const quantity = parseInt(match[2], 10);

            newHtmlParts.push(fullText.substring(lastIndex, match.index));

            if (quantity < HIGHLIGHT_THRESHOLD) {
                newHtmlParts.push(`<span style="color: ${HIGHLIGHT_COLOR};">${fullMatch}</span>`);
                lowKeyPlayersInMessage.push({ playerName, keyCount: quantity });
            } else {
                newHtmlParts.push(fullMatch);
            }
            lastIndex = regex.lastIndex;
        }

        newHtmlParts.push(fullText.substring(lastIndex));

        const newHtml = newHtmlParts.join('');
        // 获取或创建用于高亮内容的内部span，避免干扰时长span
        let highlightContentSpan = messageSpan.querySelector('.highlight-content');
        if (!highlightContentSpan) {
            highlightContentSpan = document.createElement('span');
            highlightContentSpan.className = 'highlight-content';
            // 将原始文本移动到新的highlightContentSpan中
            let tempContent = document.createElement('span');
            tempContent.innerHTML = messageSpan.innerHTML; // 复制原始内容
            messageSpan.innerHTML = ''; // 清空原始span
            messageSpan.appendChild(highlightContentSpan);
            // 将原始内容从tempContent移到highlightContentSpan
            while(tempContent.firstChild) {
                highlightContentSpan.appendChild(tempContent.firstChild);
            }
        }

        // 只有当高亮内容发生变化时才更新 innerHTML
        if (highlightContentSpan.innerHTML !== newHtml) {
            highlightContentSpan.innerHTML = newHtml;
        }

        return lowKeyPlayersInMessage;
    }


    /**
     * 在屏幕顶部固定位置显示钥匙数量低于阈值的玩家列表。
     * 当没有低于阈值的玩家时，隐藏面板。
     * @param {Array<Object>} lowKeyPlayers 包含低钥匙玩家信息的数组。
     */
    function displayLowKeyPlayers(lowKeyPlayers) {
        let displayPanel = document.getElementById(DISPLAY_PANEL_ID);

        if (!displayPanel) {
            displayPanel = document.createElement('div');
            displayPanel.id = DISPLAY_PANEL_ID;
            document.body.appendChild(displayPanel);
        }

        if (lowKeyPlayers.length > 0) {
            displayPanel.style.cssText = BASE_PANEL_STYLE;
            lowKeyPlayers.sort((a, b) => a.playerName.localeCompare(b.playerName));
            const playerStrings = lowKeyPlayers.map(p => `${p.playerName} (${p.keyCount})`).join('; ');
            displayPanel.textContent = `${PANEL_HEADER_TEXT}${playerStrings}`;
            displayPanel.style.display = 'block';
        } else {
            displayPanel.style.display = 'none';
            displayPanel.textContent = '';
        }
    }

    /**
     * 扫描聊天消息并进行高亮、信息收集和战斗时长计算。
     */
    function processChatMessages() {
        const chatMessages = document.querySelectorAll('.ChatMessage_chatMessage__2wev4.ChatMessage_systemMessage__3Jz9e');
        let latestKeyMessageContentSpan = null; // 用于高亮和顶部面板的最新钥匙消息

        let previousKeyMessageTime = null; // 上一个“钥匙数量”消息的 Date 对象时间
        let previousKeyMessageDiv = null; // 上一个“钥匙数量”消息的父 div
        let hadUnreadyMessageSinceLastKey = false; // 标记从上一个钥匙播报到现在是否有“未准备好”消息

        // 遍历整个聊天记录来计算所有战斗时长
        // 从历史旧消息开始遍历 (正序)，方便计算连续时间差
        for (let i = 0; i < chatMessages.length; i++) {
            const messageDiv = chatMessages[i];
            const timestampSpan = messageDiv.querySelector('.ChatMessage_timestamp__1iRZO');
            const contentSpan = messageDiv.querySelector('span:not(.ChatMessage_timestamp__1iRZO)');

            if (!timestampSpan || !contentSpan) continue;

            const messageText = contentSpan.textContent;
            // 提取时间戳字符串，移除方括号
            const messageTimestampStr = timestampSpan.textContent.replace('[', '').replace(']', '').trim();

            // 使用修正后的 parseTimestamp 函数，传入上一个时间点作为参考
            const currentMessageTime = parseTimestamp(messageTimestampStr, previousKeyMessageTime);

            // 1. 如果是“钥匙数量”消息
            if (messageText.includes('钥匙数量:')) {
                // 如果是最新一条“钥匙数量”消息（即当前是循环的最后一条，或下一条不是钥匙数量消息）
                if (i === chatMessages.length - 1 ||
                    !chatMessages[i + 1] ||
                    !chatMessages[i + 1].querySelector('span:not(.ChatMessage_timestamp__1iRZO)') ||
                    !chatMessages[i + 1].querySelector('span:not(.ChatMessage_timestamp__1iRZO)').textContent.includes('钥匙数量:'))
                {
                    latestKeyMessageContentSpan = contentSpan; // 这是需要高亮的最新一条
                }


                if (previousKeyMessageTime !== null && previousKeyMessageDiv !== null) {
                    // 计算从上一个“钥匙数量”到当前“钥匙数量”的时间差
                    let durationMs = currentMessageTime.getTime() - previousKeyMessageTime.getTime();

                    let durationText = '';
                    // 如果中间没有“未准备好”消息，并且时长在合理范围内，则显示时长
                    // 增加对时长超过阈值的判断
                    if (!hadUnreadyMessageSinceLastKey && durationMs > 0 && durationMs < MAX_BATTLE_DURATION_HOURS * 3600 * 1000) {
                        durationText = ` <span style="color: ${BATTLE_DURATION_TEXT_COLOR};">战斗时长: ${formatDuration(durationMs)}</span>`;
                    }

                    // 获取或创建用于显示时长的span
                    let durationSpan = previousKeyMessageDiv.querySelector('.battle-duration-info');
                    if (!durationSpan) {
                        durationSpan = document.createElement('span');
                        durationSpan.className = 'battle-duration-info';
                        previousKeyMessageDiv.appendChild(durationSpan); // 添加到前一个消息的div中
                    }
                    durationSpan.innerHTML = durationText; // 更新或清空时长
                }

                // 更新上一个“钥匙数量”信息为当前这条
                previousKeyMessageTime = currentMessageTime;
                previousKeyMessageDiv = messageDiv;
                hadUnreadyMessageSinceLastKey = false; // 重置中断标记
            }
            // 2. 如果不是“钥匙数量”消息，但包含“未准备好”
            else if (messageText.includes('未准备好')) {
                // 标记从上一个钥匙播报到现在，存在中断情况
                hadUnreadyMessageSinceLastKey = true;

                // 如果当前“未准备好”消息在上一条“钥匙数量”消息之后，那么清除上一条的时长
                // 找到上一个“钥匙数量”的div
                let prevKeyDiv = null;
                for(let j = i - 1; j >= 0; j--) {
                    const prevMsgDiv = chatMessages[j];
                    const prevContentSpan = prevMsgDiv.querySelector('span:not(.ChatMessage_timestamp__1iRZO)');
                    if (prevContentSpan && prevContentSpan.textContent.includes('钥匙数量:')) {
                        prevKeyDiv = prevMsgDiv;
                        break;
                    }
                }

                if (prevKeyDiv) {
                    let durationSpan = prevKeyDiv.querySelector('.battle-duration-info');
                    if (durationSpan) {
                        durationSpan.remove(); // 移除时长信息
                    }
                }
            }
        }

        // --- 1. 处理最新一条“钥匙数量”消息的高亮和顶部面板显示 ---
        const lowKeyPlayersToShow = [];
        if (latestKeyMessageContentSpan) {
            const lowKeyPlayersInLatestMessage = processSingleKeyMessage(latestKeyMessageContentSpan);
            lowKeyPlayersToShow.push(...lowKeyPlayersInLatestMessage);
        }
        displayLowKeyPlayers(lowKeyPlayersToShow);
    }

    // 在页面完全加载后，启动定时刷新
    window.addEventListener('load', () => {
        // 给予页面一些初始渲染时间，然后立即执行一次高亮和时长计算
        setTimeout(() => {
            console.log('Tampermonkey Script: 页面加载后首次执行高亮和时长计算。');
            processChatMessages();

            // 保持原有的定时刷新机制
            setInterval(processChatMessages, REFRESH_INTERVAL_MS);
            console.log(`Tampermonkey Script: 已设置定时器，每 ${REFRESH_INTERVAL_MS / 1000} 秒扫描一次聊天消息。`);
        }, 2000); // 延迟2秒，确保页面元素充分加载
    });

})();