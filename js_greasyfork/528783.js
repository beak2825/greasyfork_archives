// ==UserScript==
// @name         [银河奶牛]中文单位转换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  智能转换k/M单位：10k→1万，100k→10万，1M→1百万
// @license      MIT
// @author       sangshiCHI
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://luyh7.github.io/milkonomy/*
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/*
// @match        https://shykai.github.io/mwisim.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528783/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%B8%AD%E6%96%87%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528783/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%B8%AD%E6%96%87%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

/*转换规则说明：
1k-9999k范围：

1k → 1000

9.9k → 9900

1万-99.9万范围：

10k → 1万

99.9k → 9.99万

10万-99.9万范围：

100k → 10万

999k → 99.9万

100万及以上：

1000k → 1百万

10000k → 1千万
*/

//↓↓↓↓此段引用自stella‘Milky way idle汉化插件’脚本：https://greasyfork.org/zh-CN/scripts/494308-milky-way-idle%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6/code ↓↓↓↓
//1.排除非翻译部分
const excludeRegs = [
     // 一个字母都不包含
    /^[^a-zA-Z]*$/,
    // 排除时间
    /^(\d+h )?(\d+m )?(\d+s)*$/,
    // 等级
    /^Lv.\d+$/,
    ];
const excludeSelectors = [
    // 排除人名相关
    '[class^="CharacterName"]',
    // 排除排行榜人名
    '[class^="CharacterName_name__1amXp"] span',
    // 排除共享链接
    '[class^="SocialPanel_referralLink"]',
    // 排除工会介绍
    '[class^="GuildPanel_message"]',
    // 排除工会名字
    '[class^="GuildPanel_guildName"]',
    // 排除排行榜工会名字
    '[class^="LeaderboardPanel_guildName"]',
    // 排除个人信息工会名字
    '[class^="CharacterName_characterName__2FqyZ CharacterName_xlarge__1K-fn"]',
    // 排除战斗中的玩家名
    '[class^="BattlePanel_playersArea"] [class^="CombatUnit_name"]',
    // 排除消息内容
    '[class^="ChatMessage_chatMessage"] span',
    // 社区buff贡献者名字
    '[class^="CommunityBuff_contributors"] div',
    // 选择队伍中的队伍名
    '[class^="FindParty_partyName"]',
    // 队伍中的队伍名
    '[class^="Party_partyName"]',
    ];
//↑↑↑↑此段引用自stella‘Milky way idle汉化插件’脚本：https://greasyfork.org/zh-CN/scripts/494308-milky-way-idle%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6/code↑↑↑↑


(function() {
    'use strict';

    // 🔧 调试模式 (true开启日志)
    const DEBUG = true;
    const log = DEBUG ? console.log.bind(console, '[单位转换]') : () => {};

    // 🎯 配置核心参数（主要修改点1：移除千单位规则）
    const CONFIG = {
        SCAN_INTERVAL: 500,
        MIN_NUMBER: 10000, // 主要修改点2：仅处理1万以上数值
        UNIT_RULES: [
            { value: 1e8, symbol: '亿', decimals: 1 },
            { value: 1e4, symbol: '万', decimals: 1 }
        ],
        EXCLUDE_TAGS: ['SCRIPT', 'STYLE', 'TEXTAREA']
    };

    // 🔄 单位转换核心（主要修改点3：调整返回逻辑）
    function convertValue(input) {
        try {
            const match = input.match(/([\d,]+\.?\d*)([kKmM]?)/);
            if (!match) return input;

            let num = parseFloat(match[1].replace(/,/g, ''));
            const unit = match[2].toUpperCase();

            switch(unit) {
                case 'K': num *= 1e3; break;
                case 'M': num *= 1e6; break;
            }

            // 主要修改点4：千位以内直接返回格式化数值
            if (num < 10000) {
                return num.toLocaleString(); // 如2741 → 2,741
            }

            for (const rule of CONFIG.UNIT_RULES) {
                if (num >= rule.value) {
                    const value = num / rule.value;
                    let result = value.toFixed(rule.decimals)
                                    .replace(/\.?0+$/, '')
                                    .replace(/\.$/, '');

                    // 处理大数值进位问题（如5500万）
                    if (rule.symbol === '万' && num >= 1e7) {
                        return `${(num/1e4).toFixed(0)}万`;
                    }
                    return `${result}${rule.symbol}`;
                }
            }

            // 万级以下数值保留原格式（主要修改点5）
            return num.toLocaleString();

        } catch(e) {
            log('转换异常:', input, e);
            return input;
        }
    }

    /* 其余代码保持不变（DOM处理器/扫描器/监听系统等） */
    // ...（保持原有DOM处理逻辑不变）...

    // 🖥️ DOM处理器
    function processTextNode(node) {
        if (CONFIG.EXCLUDE_TAGS.includes(node.parentNode.tagName)) return;

        const newText = node.textContent.replace(/(\d[\d,.kKmM]*)/g, (match) => {
            if (/^\d+$/.test(match)) return match;
            return convertValue(match);
        });

        if (newText !== node.textContent) {
            node.textContent = newText;
            log('已转换:', node.textContent, '→', newText);
        }
    }

    // 🔍 安全扫描器
    function safeScan(root = document) {
        try {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                { acceptNode: node =>
                    node.textContent.match(/\d/) ?
                    NodeFilter.FILTER_ACCEPT :
                    NodeFilter.FILTER_REJECT
                }
            );

            let node;
            while ((node = walker.nextNode())) {
                processTextNode(node);
            }
        } catch(e) {
            log('扫描异常:', e);
        }
    }

    // 🚀 动态内容监听系统
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    setTimeout(() => safeScan(node), 100);
                }
            });
        });
    });

    // 📡 初始化系统
    function init() {
        safeScan(document.body);
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        setInterval(() => safeScan(document.body), CONFIG.SCAN_INTERVAL);
        log('系统启动成功');
    }

    // ⏳ 延迟启动防止遗漏
    if (document.readyState === 'complete') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1000));
    }
})();