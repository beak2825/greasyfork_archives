// ==UserScript==
// @name         超时监控PRO-12.23
// @namespace    http://tampermonkey.net/
// @version      4.8.2
// @author       刚学会做蛋饼
// @license      MIT
// @description  辛辛苦苦测试
// @match        https://wanx.myapp.com/omp/data-manage/quick-look
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/543686/%E8%B6%85%E6%97%B6%E7%9B%91%E6%8E%A7PRO-1223.user.js
// @updateURL https://update.greasyfork.org/scripts/543686/%E8%B6%85%E6%97%B6%E7%9B%91%E6%8E%A7PRO-1223.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================
    // 配置信息
    // ========================
    const config = {
        summaryWebhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=bf3c31d9-dcee-445e-b18c-1f9ab01520b6', // 总群
        summaryWebhook2: 'xxx', // 报时群（设为 'xxx' 表示禁用）
        queueWebhookMap: {
            "珠宝": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "酒": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "文玩": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "食品生鲜": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f9136194-5933-4f5e-bb54-0a82497f4927"],
            "保健品": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f9136194-5933-4f5e-bb54-0a82497f4927"],
            "图书潮玩": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b72c58eb-c0b6-46c2-9fc9-7fc843561c1a"],
            "服饰钟表": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2d0c3be7-8d5d-4b11-8160-df4c91dc04c0"],
            "成人用品": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c67daf41-4474-4828-b34c-2ab3dc1cf413"],
            "美妆个护": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1165a099-5bd7-4fbc-af86-73c490ce9bee"],
            "好店": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=024081c8-2d25-47f6-b66c-158530ede4da"],
            "家清家装日用": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c2e24f55-852c-4c9b-8588-d29d9e69d058"],
            "教育培训": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a2464bb1-2653-469d-928d-27fff2a7950b"],
            "本地生活2.0": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93"],
            "高热召回": [
                "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93",
                "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=024081c8-2d25-47f6-b66c-158530ede4da"
            ],
            "达人专属": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93"],
            "宠物农资": [
                "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58afbcdc-e96e-457b-ba16-15f378cfecbe",
                "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=B_KEY"
            ],
            "电子数码": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=aacebbfc-40c7-4cc5-bd46-d4e9e990641a"],
            "先发后审": ["XXX"],
            "低风险曝光召回": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "先发后审-复审": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "临时(大闸蟹专项)": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9a102ab1-3f9d-43cb-b073-8c1207292278"],
            "API爆量迁移审核": ["hXXX"],
            "高风险曝光召回": ["XXX"],
            "商品打标板块": ["XXX"],
            "黑图标注": ["XXX"],
            "试运类目先审": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "试运类目先发": ["XXX"],
            "试运类目曝光召回": ["XXX"],
            "试运类目曝光召回复审": ["XXX"],
            "试运类目先发复审": ["XXX"],
            "本地2.0API爆量迁移审核": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93"],
            "召回-酒类": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "召回-本地生活2.0": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93"],
            "召回-服饰钟表": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2d0c3be7-8d5d-4b11-8160-df4c91dc04c0"],
            "召回-文玩": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "召回-珠宝首饰": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75"],
            "召回-家清家装日用": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c2e24f55-852c-4c9b-8588-d29d9e69d058"],
            "召回-电子数码": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=aacebbfc-40c7-4cc5-bd46-d4e9e990641a"],
            "召回-图书潮玩": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b72c58eb-c0b6-46c2-9fc9-7fc843561c1a"],
            "召回-宠物农资": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58afbcdc-e96e-457b-ba16-15f378cfecbe"],
            "召回-本地生活": ["XXX"],
            "召回-食品生鲜": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f9136194-5933-4f5e-bb54-0a82497f4927"],
            "召回-美妆个护": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1165a099-5bd7-4fbc-af86-73c490ce9bee"],
            "召回-教育培训": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a2464bb1-2653-469d-928d-27fff2a7950b"],
            "召回-成人用品": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c67daf41-4474-4828-b34c-2ab3dc1cf413"],
            "召回-保健品": ["https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f9136194-5933-4f5e-bb54-0a82497f4927"],
            "拆单队列": ["XXX"],
            "智能-模型优化": ["XXX"],
            "智能-属性标注": ["XXX"],
            "智能-主图标注": ["XXX"],
            "商品审核-全字段": ["XXX"],
            "商品审核-资质类目": ["XXX"],
            "商品审核-标题图片": ["XXX"],
        },
        thresholds: {
            pendingThreshold: 100,
            overtimeThreshold: 10
        },
        checkInterval: 8 * 60 * 1000 // 8分钟
    };

    // 【修改】给每个队列手动添加 group 字段（注意：group 值必须是字符串 "1"~"9" 或 "0"）
    const queueDefinitions = [
        { name: "珠宝", group: "2", timingType: "10min", overtimeThreshold: 10 },
        { name: "酒", group: "2", timingType: "10min", overtimeThreshold: 10 },
        { name: "文玩", group: "2", timingType: "10min", overtimeThreshold: 10 },
        { name: "食品生鲜", group: "3", timingType: "10min", overtimeThreshold: 10 },
        { name: "保健品", group: "3", timingType: "10min", overtimeThreshold: 10 },
        { name: "图书潮玩", group: "6", timingType: "10min", overtimeThreshold: 10 },
        { name: "服饰钟表", group: "7", timingType: "10min", overtimeThreshold: 10 },
        { name: "成人用品", group: "7", timingType: "10min", overtimeThreshold: 10 },
        { name: "美妆个护", group: "4", timingType: "10min", overtimeThreshold: 10 },
        { name: "好店", group: "4", timingType: "10min", overtimeThreshold: 10 },
        { name: "家清家装日用", group: "5", timingType: "10min", overtimeThreshold: 10 },
        { name: "教育培训", group: "7", timingType: "10min", overtimeThreshold: 10 },
        { name: "本地生活2.0", group: "5", timingType: "10min", overtimeThreshold: 10 },
        { name: "高热召回", group: "5", timingType: "10min", overtimeThreshold: 10 },
        { name: "达人专属", group: "5", timingType: "10min", overtimeThreshold: 10 },
        { name: "宠物农资", group: "6", timingType: "10min", overtimeThreshold: 10 },
        { name: "电子数码", group: "6", timingType: "10min", overtimeThreshold: 10 },
        { name: "先发后审", group: "0", timingType: "无要求", overtimeThreshold: 10 },
        { name: "低风险曝光召回", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "先发后审-复审", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "临时(大闸蟹专项)", group: "3", timingType: "1H", overtimeThreshold: 10 },
        { name: "API爆量迁移审核", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "高风险曝光召回", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "商品打标板块", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "黑图标注", group: "0", timingType: "1H", overtimeThreshold: 10 },
        { name: "试运类目先审", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "试运类目先发", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "试运类目曝光召回", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "试运类目曝光召回复审", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "试运类目先发复审", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "本地2.0API爆量迁移审核", group: "5", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-酒类", group: "2", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-本地生活2.0", group: "5", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-服饰钟表", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-文玩", group: "2", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-珠宝首饰", group: "2", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-宠物农资", group: "6", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-家清家装日用", group: "5", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-电子数码", group: "6", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-图书潮玩", group: "6", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-本地生活", group: "0", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-食品生鲜", group: "3", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-美妆个护", group: "4", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-教育培训", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-成人用品", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "召回-保健品", group: "3", timingType: "日清", overtimeThreshold: 10 },
        { name: "拆单队列", group: "0", timingType: "10min", overtimeThreshold: 10 },
        { name: "智能-模型优化", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "智能-属性标注", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "智能-主图标注", group: "7", timingType: "日清", overtimeThreshold: 10 },
        { name: "商品审核-全字段", group: "0", timingType: "无要求", overtimeThreshold: 10 },
        { name: "商品审核-资质类目", group: "0", timingType: "无要求", overtimeThreshold: 10 },
        { name: "商品审核-标题图片", group: "0", timingType: "无要求", overtimeThreshold: 10 },
    ];

    function generateQueues(defs) {
        return defs.map((def, index) => {
            const i = index + 1;
            return {
                name: def.name,
                selectors: {
                    container: `.queue-container:nth-child(${i})`,
                    pending: '.pending-count',
                    overtime: '.overtime-count',
                    maxOvertime: '.max-overtime span',
                    manpower: '.manpower span'
                },
                xpaths: {
                    pending: `/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[${i}]/div[1]/label[1]/span/div[2]`,
                    overtime: `/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[${i}]/div[1]/label[2]/span/div[2]`,
                    maxOvertime: `/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[${i}]/section[2]/div[1]/span`,
                    manpower: `/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[${i}]/ul/li[1]/span[2]`
                },
                timingType: def.timingType,
                overtimeThreshold: def.overtimeThreshold,
                group: def.group
            };
        });
    }

    const queues = generateQueues(queueDefinitions);

    const timingTypeOrder = { "10min": 1, "1H": 2, "日清": 3, "无要求": 4 };
    const timingTypeColors = { "10min": "🔺", "1H": "🔻", "日清": "🔹", "无要求": "🔸" };

    function parseMaxOvertime(text) {
        if (!text) return 0;
        const hourMatch = text.match(/(\d+)\s*小时/);
        const minuteMatch = text.match(/(\d+)\s*分钟/);
        const secondMatch = text.match(/(\d+)\s*秒/);
        let hours = 0, minutes = 0, seconds = 0;
        if (hourMatch) hours = parseInt(hourMatch[1]);
        if (minuteMatch) minutes = parseInt(minuteMatch[1]);
        if (secondMatch) seconds = parseInt(secondMatch[1]);
        if (text.includes(':')) {
            const parts = text.trim().split(':');
            if (parts.length === 3) {
                const [hh, mm, ss] = parts.map(n => parseInt(n) || 0);
                return hh * 60 + mm + (ss >= 30 ? 1 : 0);
            } else if (parts.length === 2) {
                const [mm, ss] = parts.map(n => parseInt(n) || 0);
                return mm + (ss >= 30 ? 1 : 0);
            }
        }
        return hours * 60 + minutes + (seconds >= 30 ? 1 : 0);
    }

    function getElementText(selector, xpath) {
        try {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                return result.singleNodeValue.textContent.trim();
            }
        } catch (e) {
            console.warn('XPath执行失败:', e.message);
        }
        const element = document.querySelector(selector);
        if (element && element.textContent) {
            return element.textContent.trim();
        }
        return '';
    }

    function getPendingData() {
        const raw = localStorage.getItem("supplier_pending_data");
        try {
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.data || {};
            }
            return {};
        } catch (e) {
            console.error("解析 pendingData 失败", e);
            return {};
        }
    }

    function formatOvertimeDisplay(originalText, fallbackMinutes) {
        let display = (originalText || '').trim();
        if (!display || display === '0' || display === '0秒' || display === '0分钟') {
            if (fallbackMinutes >= 60) {
                const hours = Math.floor(fallbackMinutes / 60);
                const minutes = fallbackMinutes % 60;
                display = `${hours}小时${minutes}分钟`;
            } else {
                display = `${fallbackMinutes}分钟`;
            }
        }
        return display;
    }

    // ✅ 子群报告（保持原样，用阿拉伯数字）
    function generateUnifiedReport(alertQueues, totalManpower) {
        if (!alertQueues || alertQueues.length === 0) return "";

        const groupedByTimingType = {};
        alertQueues.forEach(q => {
            const type = q.timingType;
            if (!groupedByTimingType[type]) {
                groupedByTimingType[type] = [];
            }
            groupedByTimingType[type].push(q);
        });

        const sortedTypes = Object.keys(groupedByTimingType)
            .sort((a, b) => (timingTypeOrder[a] || 999) - (timingTypeOrder[b] || 999));

        sortedTypes.forEach(type => {
            groupedByTimingType[type].sort((a, b) => b.maxOvertimeMins - a.maxOvertimeMins);
        });

        let report = `**超时/堆积：${alertQueues.length}个**\n`;

        sortedTypes.forEach(type => {
            const queuesOfType = groupedByTimingType[type];
            const colorEmoji = timingTypeColors[type] || "⚪";
            report += `**${colorEmoji} ${type}**\n`;
            queuesOfType.forEach((q, index) => {
                const fullAmount = q.supplierData || 0;
                const internalAmount = q.pendingNum;
                const ratio = fullAmount > 0 ? ((internalAmount / fullAmount) * 100).toFixed(1) : '0.0';
                const overtimeDisplay = formatOvertimeDisplay(q.maxOvertimeText, q.maxOvertimeMins);
                report += `  ${index + 1}. ${q.name} 超时：${overtimeDisplay}｜在岗：${q.manpowerNum}｜待审：${q.pendingNum}｜全：${fullAmount}（${ratio}%）\n`;
            });
            report += "──────────\n";
        });

        if (report.endsWith("──────────\n")) {
            report = report.slice(0, -"──────────\n".length);
        }

        const now = new Date();
        report += `\n🖥️ 总：${totalManpower}人\n`;
        report += `📅 ${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        return report;
    }

    // ✅【核心更新】总群报告：使用带圈数字 ①②③，每组独立编号
    function generateGroupedReport(alertQueues, totalManpower) {
        if (!alertQueues || alertQueues.length === 0) return "";

        // 带圈数字映射（1~20）
        const CIRCLED_NUMBERS = [
            '', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
            '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'
        ];

        const groups = {};
        alertQueues.forEach(q => {
            const g = q.group || "未分组";
            if (!groups[g]) groups[g] = [];
            groups[g].push(q);
        });

        // 排序：1~9 在前，"0" 在最后
        const nonZeroGroups = Object.keys(groups).filter(g => g !== "0").sort((a, b) => {
            const order = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            const ia = order.indexOf(a);
            const ib = order.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
        const sortedGroupNames = [...nonZeroGroups, ...(groups["0"] ? ["0"] : [])];

        const groupToLabel = {
            "1": "【一组】",
            "2": "【二组】",
            "3": "【三组】",
            "4": "【四组】",
            "5": "【五组】",
            "6": "【六组】",
            "7": "【七组】",
            "8": "【八组】",
            "9": "【九组】",
            "0": "【0】"
        };

        let fullReport = "";

        for (let gIndex = 0; gIndex < sortedGroupNames.length; gIndex++) {
            const groupName = sortedGroupNames[gIndex];
            const groupQueues = groups[groupName];
            const label = groupToLabel[groupName] || `【${groupName}】`;

            // 按 timingType 分组
            const byTiming = {};
            groupQueues.forEach(q => {
                const t = q.timingType;
                if (!byTiming[t]) byTiming[t] = [];
                byTiming[t].push(q);
            });

            // 排序 timingType
            const sortedTimings = Object.keys(byTiming).sort(
                (a, b) => (timingTypeOrder[a] || 999) - (timingTypeOrder[b] || 999)
            );

            // 每个 timingType 内部按超时倒序
            sortedTimings.forEach(timing => {
                byTiming[timing].sort((a, b) => b.maxOvertimeMins - a.maxOvertimeMins);
            });

            // 输出组标题
            fullReport += `${label}-超时堆积${groupQueues.length}个\n`;

            let itemIndex = 1; // 每组从 ① 重新开始
            sortedTimings.forEach(timing => {
                const colorEmoji = timingTypeColors[timing] || "⚪";
                fullReport += `${colorEmoji} ${timing}\n`;

                byTiming[timing].forEach(q => {
                    const fullAmount = q.supplierData || 0;
                    const internalAmount = q.pendingNum;
                    const ratio = fullAmount > 0 ? ((internalAmount / fullAmount) * 100).toFixed(1) : '0.0';
                    const overtimeDisplay = formatOvertimeDisplay(q.maxOvertimeText, q.maxOvertimeMins);

                    // 使用带圈数字（1~20），超出则用普通数字
                    const circled = (itemIndex <= 20) ? CIRCLED_NUMBERS[itemIndex] : `${itemIndex}.`;
                    fullReport += `  ${circled} ${q.name} 超时：${overtimeDisplay}｜在岗：${q.manpowerNum}｜待审：${q.pendingNum}｜全：${fullAmount}（${ratio}%）\n`;
                    itemIndex++;
                });
            });

            // 组间分隔线（非最后一组）
            if (gIndex < sortedGroupNames.length - 1) {
                fullReport += "──────────\n";
            }
        }

        // 全局统计
        const now = new Date();
        fullReport += `\n\n总超时队列：${alertQueues.length}个\n`;
        fullReport += `🖥️ 总：${totalManpower}人\n`;
        fullReport += `📅 ${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        return fullReport;
    }

    function sendToWebhooks(content, webhooks) {
        const list = Array.isArray(webhooks) ? webhooks : [webhooks];
        list.forEach(url => {
            if (!url || url === 'xxx' || url.trim() === '') return;
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        if (json.errcode === 0) {
                            console.log(`✅ [企业微信] 发送成功 → ${url}`);
                        } else {
                            console.error(`❌ [企业微信接口错误] ${url} | errcode: ${json.errcode}, errmsg: ${json.errmsg}`);
                        }
                    } catch (e) {
                        if (res.status === 200) {
                            console.warn(`⚠️ [响应非 JSON，但状态码 200，大概率成功] → ${url}`);
                        } else {
                            console.error(`🚨 [网络层错误] 状态码: ${res.status} → ${url}`, res.responseText?.substring(0, 200));
                        }
                    }
                },
                onerror: err => {
                    console.error(`💥 [请求异常] → ${url}`, err);
                }
            });
        });
    }

    function checkAndSend() {
        console.log('====== 开始检测 ======');
        const supplierData = getPendingData();
        let alertQueues = [];
        let totalManpower = 0;

        const parsedQueues = queues.map(queue => {
            const pending = getElementText(`${queue.selectors.container} ${queue.selectors.pending}`, queue.xpaths.pending);
            const overtime = getElementText(`${queue.selectors.container} ${queue.selectors.overtime}`, queue.xpaths.overtime);
            const maxOvertimeText = getElementText(`${queue.selectors.container} ${queue.selectors.maxOvertime}`, queue.xpaths.maxOvertime);
            const manpower = getElementText(`${queue.selectors.container} ${queue.selectors.manpower}`, queue.xpaths.manpower);

            const pendingNum = parseInt(pending) || 0;
            const manpowerNum = parseInt(manpower) || 0;
            const maxOvertimeMins = parseMaxOvertime(maxOvertimeText);
            const specificThreshold = queue.overtimeThreshold || config.thresholds.overtimeThreshold;

            totalManpower += manpowerNum;

            return {
                ...queue,
                pending, overtime, maxOvertimeText, manpower,
                pendingNum, manpowerNum, maxOvertimeMins,
                supplierData: supplierData[queue.name] || 0,
                specificThreshold
            };
        });

        const validQueues = parsedQueues.filter(q =>
            q.pendingNum !== undefined && q.maxOvertimeMins !== undefined
        );

        validQueues.forEach(q => {
            const threshold = q.specificThreshold;
            const shouldAlert = q.pendingNum > config.thresholds.pendingThreshold ||
                               q.maxOvertimeMins >= threshold;
            if (shouldAlert) {
                alertQueues.push(q);
            }
        });

        if (alertQueues.length > 0) {
            // === 1. 总群：使用新版带圈数字报告 ===
            const totalReport = generateGroupedReport(alertQueues, totalManpower);
            if (config.summaryWebhook && config.summaryWebhook !== 'xxx') {
                sendToWebhooks(totalReport, config.summaryWebhook);
            }
            if (config.summaryWebhook2 && config.summaryWebhook2 !== 'xxx') {
                sendToWebhooks(totalReport, config.summaryWebhook2);
            }

            // === 2. 子群：保持原逻辑（阿拉伯数字）===
            const webhookToQueues = {};

            alertQueues.forEach(queue => {
                const webhooks = config.queueWebhookMap[queue.name] || [];
                webhooks.forEach(url => {
                    if (!url || url === 'xxx' || url.trim() === '') return;
                    if (!webhookToQueues[url]) {
                        webhookToQueues[url] = [];
                    }
                    webhookToQueues[url].push(queue);
                });
            });

            for (const [webhookUrl, relevantQueues] of Object.entries(webhookToQueues)) {
                const relevantManpower = relevantQueues.reduce((sum, q) => sum + q.manpowerNum, 0);
                const specificReport = generateUnifiedReport(relevantQueues, relevantManpower);
                sendToWebhooks(specificReport, webhookUrl);
            }
        } else {
            console.log('无超时，无需发送');
        }
    }

    function waitForElementAndStartMonitoring() {
        let checkAttempts = 0;
        const maxAttempts = 30;
        const checkInterval = setInterval(() => {
            const firstQueueContainer = document.querySelector(queues[0].selectors.container) ||
                document.evaluate(queues[0].xpaths.maxOvertime, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (firstQueueContainer || checkAttempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (firstQueueContainer) {
                    console.log('页面元素已加载，开始监控...');
                    checkAndSend();
                    setInterval(checkAndSend, config.checkInterval);
                } else {
                    console.error('页面元素加载超时');
                }
            }
            checkAttempts++;
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElementAndStartMonitoring);
    } else {
        waitForElementAndStartMonitoring();
            }
})(); // ←←← 这一行缺失了！